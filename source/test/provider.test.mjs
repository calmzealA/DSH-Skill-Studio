import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { realpath, mkdtemp, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { SkillManager } from '../src/manager.mjs';

// Resolve all three packages through the installed DSH runtime, rather than
// mixing its nested Cordis version with the plugin's peer dependency.
const dshRequire = createRequire(import.meta.resolve('@deepseek-ai/dsh/package.json'));
const { Context } = await import(pathToFileURL(dshRequire.resolve('@deepseek-ai/cordis')).href);
const { default: SkillRegistry } = await import(pathToFileURL(dshRequire.resolve('@deepseek-ai/dsh-skill')).href);
const SkillFilesystem = await import(pathToFileURL(dshRequire.resolve('@deepseek-ai/dsh-skill-filesystem')).href);

async function until(read, accept, label) {
  const deadline = Date.now() + 2800;
  let last;
  do {
    last = await read();
    if (accept(last)) return last;
    await new Promise(resolve => setTimeout(resolve, 25));
  } while (Date.now() < deadline);
  assert.fail(`Real DSH filesystem watcher did not observe ${label} within 2.8 seconds: ${JSON.stringify(last)}`);
}

test('real installed DSH provider discovers, loads, hot-disables, and recovers manager-created skill bundles', { timeout: 20_000 }, async t => {
  const directory = await mkdtemp(join(await realpath(tmpdir()), 'skill-studio-provider-'));
  const dshHome = join(directory, 'user-home');
  const root = { id: 'user-dsh', path: join(dshHome, 'skills'), source: 'user-dsh', label: 'DSH user skills', rank: 400, writable: true };
  const manager = new SkillManager({ stateDir: join(dshHome, 'skill-studio'), roots: async () => [root] });
  const ctx = new Context();
  t.after(async () => {
    await ctx.fiber.dispose();
    await rm(directory, { recursive: true, force: true });
  });
  await ctx.plugin(SkillRegistry);
  await ctx.plugin(SkillFilesystem, {
    dshHome, agentsHome: join(directory, 'agents-home'),
    watch: true, watchStabilityThresholdMs: 20, watchPollIntervalMs: 10,
  });
  const skills = ctx.get('skills');
  const snapshot = () => skills.snapshot({ cwd: directory });
  const get = () => skills.get('integration-notes', { cwd: directory });
  assert.deepEqual((await snapshot()).skills, [], 'prime the real watcher while the skill root is still absent');

  const created = await manager.request({ action: 'create', rootId: root.id, name: 'integration-notes', description: 'Use to validate a real DSH skill.' });
  const discovered = await until(snapshot, value => value.complete && value.skills.some(row => row.name === 'integration-notes'), 'creation');
  const summary = discovered.skills.find(row => row.name === 'integration-notes');
  assert.equal(summary.source, 'user-dsh');
  assert.equal(summary.path, join(root.path, 'integration-notes', 'SKILL.md'));
  assert.match((await get()).content, /Describe the workflow/);

  const policyText = '---\nname: integration-notes\ndescription: Updated routing description.\ndisable-model-invocation: true\nuser-invocable: false\n---\n\nUpdated body; read references/guide.txt before proceeding.\n';
  const saved = await manager.request({ action: 'save', id: created.skill.id, expectedHash: created.hash, text: policyText });
  const changed = await until(snapshot, value => value.complete && value.skills.find(row => row.name === 'integration-notes')?.description === 'Updated routing description.', 'edited frontmatter');
  assert.deepEqual(changed.skills[0].invocation, { modelInvocable: false, userInvocable: false }, 'the actual provider parses both canonical invocation controls');
  const loaded = await get();
  assert.equal(loaded.content, 'Updated body; read references/guide.txt before proceeding.');
  assert.deepEqual(loaded.invocation, { modelInvocable: false, userInvocable: false });
  assert.deepEqual(loaded.resourceBase, { kind: 'directory', path: join(root.path, 'integration-notes') });

  await manager.request({ action: 'saveFile', id: created.skill.id, expectedHash: saved.hash, path: 'references/guide.txt', base64: Buffer.from('A resource restored with the bundle.').toString('base64') });
  await manager.request({ action: 'toggle', id: created.skill.id, enabled: false });
  await until(snapshot, value => value.complete && !value.skills.some(row => row.name === 'integration-notes'), 'disable');
  assert.equal(await get(), undefined, 'trusted provider lookup also excludes the renamed disabled instruction file');
  await manager.request({ action: 'toggle', id: created.skill.id, enabled: true });
  await until(snapshot, value => value.complete && value.skills.some(row => row.name === 'integration-notes'), 're-enable');
  assert.match((await get()).content, /Updated body/);

  const deleted = await manager.request({ action: 'delete', id: created.skill.id });
  await until(snapshot, value => value.complete && !value.skills.some(row => row.name === 'integration-notes'), 'delete');
  assert.equal(await get(), undefined);
  await manager.request({ action: 'restore', historyId: deleted.historyId });
  await until(snapshot, value => value.complete && value.skills.some(row => row.name === 'integration-notes'), 'restore');
  assert.match((await get()).content, /Updated body/);
  assert.deepEqual((await get()).invocation, { modelInvocable: false, userInvocable: false });
  assert.equal(await readFile(join(root.path, 'integration-notes', 'references', 'guide.txt'), 'utf8'), 'A resource restored with the bundle.');
});
