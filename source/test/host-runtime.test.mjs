import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { realpath, mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { apply } from '../src/index.mjs';

// Use the installed DSH registry, scope engine and watched filesystem provider
// together with that runtime's own Cordis. No mock registry or manual watcher
// invalidation substitutes for discovery in these host integration tests.
const runtime = createRequire(import.meta.resolve('@deepseek-ai/dsh/package.json'));
const load = name => import(pathToFileURL(runtime.resolve(name)).href);
const { Context } = await load('@deepseek-ai/cordis');
const { default: SkillRegistry, isUserInvocable, isModelInvocable } = await load('@deepseek-ai/dsh-skill');
const SkillFilesystem = await load('@deepseek-ai/dsh-skill-filesystem');
const { createScope } = await load('@deepseek-ai/dsh-scope');
const instruction = (name, description = 'Use this workflow.') => `---\nname: ${name}\ndescription: ${description}\n---\nRead references before proceeding.\n`;

async function until(read, accept, label) {
  const deadline = Date.now() + 2800;
  let last;
  do {
    last = await read();
    if (accept(last)) return last;
    await new Promise(resolve => setTimeout(resolve, 15));
  } while (Date.now() < deadline);
  assert.fail(`${label}: ${JSON.stringify(last)}`);
}

async function fixture(t) {
  const directory = await mkdtemp(join(await realpath(tmpdir()), 'skill-studio-host-runtime-'));
  const config = { dshHome: join(directory, 'dsh'), agentsHome: join(directory, 'agents') };
  const ctx = new Context();
  const keys = { standard: {}, minimal: {} };
  const scopes = Object.fromEntries(Object.entries(keys).map(([name, key]) => [name, createScope(ctx, key)]));
  const sessions = new Map();
  const leases = [];
  const selections = [];
  let changed = 0;
  let registrations = 0;
  ctx.provide('sessions', { get: id => sessions.get(id), list: () => [...sessions.values()] });
  ctx.provide('agents', { get: () => undefined, create() { assert.fail('A catalogue inspection must not create an Agent'); } });
  ctx.provide('agentPresets', {
    defaultId: 'standard',
    list: () => [{ id: 'standard', name: 'Filesystem preset' }, { id: 'minimal', name: 'No filesystem provider' }],
    presetForSession: session => session.recordedPreset ?? 'standard',
    inspectCompositions: () => [
      { id: 'standard', modules: [{ moduleName: '@deepseek-ai/dsh-skill-filesystem' }] },
      { id: 'minimal', modules: [] },
    ],
    async acquireScope(id) {
      const lease = { key: keys[id], disposed: false, async [Symbol.asyncDispose]() { await Promise.resolve(); lease.disposed = true; } };
      leases.push(lease);
      return lease;
    },
    select(...args) { selections.push(args); assert.fail('A detached view must not change a real Session preset'); },
  });
  ctx.provide('typert', { register() { registrations++; return () => { registrations--; }; } });
  await ctx.plugin(SkillRegistry).await();
  await scopes.standard.ctx.plugin(SkillFilesystem, {
    ...config, watch: true, watchStabilityThresholdMs: 600, watchPollIntervalMs: 20,
  }).await();
  ctx.on('skills/change', () => { changed++; });
  apply(ctx, config);
  const gateway = ctx.get('skillStudio');
  t.after(async () => {
    await ctx.fiber.dispose();
    assert.equal(registrations, 0);
    assert.ok(leases.every(lease => lease.disposed), 'host releases every acquired preset lease');
    assert.deepEqual(selections, []);
    await rm(directory, { recursive: true, force: true });
  });
  const registry = ctx.get('skills');
  return {
    directory, config, ctx, keys, sessions, registry,
    changes: () => changed,
    request: payload => gateway.request(payload),
    snapshot: (cwd, preset = 'standard') => registry.snapshot({ cwd, scope: keys[preset] }),
  };
}

async function writeSkill(root, name, description) {
  await mkdir(join(root, name), { recursive: true });
  const path = join(root, name, 'SKILL.md');
  await writeFile(path, instruction(name, description));
  return path;
}

test('real host waits for watched invocation policy and reports a disabled override falling back to the actual winner', { timeout: 15_000 }, async t => {
  const f = await fixture(t);
  const project = join(f.directory, 'project');
  await mkdir(join(project, '.git'), { recursive: true });
  const projectPath = await writeSkill(join(project, '.dsh', 'skills'), 'release-flow', 'Project instructions.');
  const fallbackPath = await writeSkill(join(f.config.dshHome, 'skills'), 'release-flow', 'User fallback instructions.');
  f.sessions.set('retained-session', { id: 'retained-session', header: { cwd: project }, recordedPreset: 'standard' });
  const payload = { sessionId: 'retained-session' };
  const first = await f.request({ action: 'list', ...payload });
  assert.equal(first.success, true);
  assert.equal(first.data.complete, true);
  const projectSkill = first.data.skills.find(row => row.path === projectPath);
  const fallback = first.data.skills.find(row => row.path === fallbackPath);
  assert.equal(projectSkill.availability.status, 'available');
  assert.equal(fallback.availability.status, 'shadowed');
  assert.equal(fallback.availability.winnerPath, projectPath);

  const beforeToggleRevision = first.data.revision;
  const disabled = await f.request({ action: 'toggle', ...payload, id: projectSkill.id, enabled: false });
  assert.equal(disabled.success, true);
  assert.equal(disabled.data.synchronization.catalog, 'verified');
  assert.equal(disabled.data.skill.availability.status, 'disabled');
  assert.equal(disabled.data.skill.availability.winnerPath, fallbackPath);
  assert.ok(disabled.data.revision > beforeToggleRevision, 'actual watcher notifications and the mutation advance the revision');
  const winner = (await f.snapshot(project)).skills.find(row => row.name === 'release-flow');
  assert.equal(winner.path, fallbackPath, 'verified response is backed by the actual provider winner');
  const active = (await f.request({ action: 'list', ...payload })).data.skills.find(row => row.path === fallbackPath);
  assert.equal(active.availability.status, 'available');

  const changeCount = f.changes();
  let completed = false;
  const operation = f.request({ action: 'setPolicy', ...payload, id: active.id, expectedHash: active.hash, modelInvocable: true, userInvocable: false })
    .then(value => { completed = true; return value; });
  await until(() => readFile(fallbackPath, 'utf8'), text => /user-invocable: false/.test(text), 'host did not save invocation controls');
  const stale = (await f.snapshot(project)).skills.find(row => row.name === 'release-flow');
  assert.equal(stale.invocation.userInvocable, true, 'fixture keeps a genuine stale catalogue while the 600ms stability watcher is pending');
  assert.equal(completed, false, 'host must not report verified immediately after writing the file');
  const policy = await operation;
  assert.equal(policy.success, true);
  assert.equal(policy.data.synchronization.catalog, 'verified');
  assert.ok(f.changes() > changeCount, 'the real filesystem watcher invalidated the registry before host completion');
  assert.deepEqual((await f.snapshot(project)).skills.find(row => row.name === 'release-flow').invocation, { modelInvocable: true, userInvocable: false });
  assert.deepEqual(policy.data.skill.availability, { status: 'available', automatic: true, manual: false, presetId: 'standard' });
  const loaded = await f.registry.get('release-flow', { cwd: project, scope: f.keys.standard });
  assert.deepEqual(loaded.invocation, { modelInvocable: true, userInvocable: false });

  const userOnly = await f.request({ action: 'setPolicy', ...payload, id: active.id, expectedHash: policy.data.hash, modelInvocable: false, userInvocable: true });
  assert.equal(userOnly.success, true);
  assert.equal(userOnly.data.synchronization.catalog, 'verified');
  assert.deepEqual(userOnly.data.skill.availability, { status: 'available', automatic: false, manual: true, presetId: 'standard' });
});

test('a preset genuinely lacking the filesystem provider verifies local edits as not in that preset', { timeout: 10_000 }, async t => {
  const f = await fixture(t);
  const view = { presetId: 'minimal', workspaceId: 'user' };
  const first = await f.request({ action: 'list', ...view });
  assert.equal(first.success, true);
  assert.equal(first.data.complete, true);
  assert.deepEqual((await f.snapshot(undefined, 'minimal')).skills, []);
  assert.deepEqual(first.data.catalog.counts, { available: 0, automatic: 0, manual: 0, registered: 0 });
  const root = first.data.roots.find(row => row.source === 'user-dsh');
  const created = await f.request({ action: 'create', ...view, rootId: root.id, name: 'outside-preset', description: 'A local skill excluded by the chosen preset.' });
  assert.equal(created.success, true);
  assert.equal(created.data.synchronization.catalog, 'verified', 'absence from a provider-free preset is a complete answer, not watcher pending');
  assert.deepEqual(created.data.skill.availability, { status: 'not_in_preset', automatic: false, manual: false, presetId: 'minimal' });
  const policy = await f.request({ action: 'setPolicy', ...view, id: created.data.skill.id, expectedHash: created.data.hash, modelInvocable: true, userInvocable: false });
  assert.equal(policy.success, true);
  assert.equal(policy.data.synchronization.catalog, 'verified');
  assert.equal(policy.data.skill.availability.status, 'not_in_preset');
  assert.deepEqual((await f.snapshot(undefined, 'minimal')).skills, []);
  assert.equal((await f.snapshot(undefined, 'standard')).skills.find(row => row.name === 'outside-preset').invocation.userInvocable, false, 'a real filesystem-enabled composition can independently read the saved policy');
});

test('current-mode catalogue matches the real winning registry and the official slash filter, not 31 enabled local files', { timeout: 15_000 }, async t => {
  const f = await fixture(t);
  const project = join(f.directory, 'work');
  await mkdir(join(project, '.git'), { recursive: true });
  f.sessions.set('catalog-session', { id: 'catalog-session', header: { cwd: project }, recordedPreset: 'standard' });
  for (let index = 0; index < 31; index++) {
    const name = `local-${String(index).padStart(2, '0')}`;
    const path = await writeSkill(join(f.config.dshHome, 'skills'), name);
    const flags = index === 0 ? 'user-invocable: false\n' : index === 1 ? 'disable-model-invocation: true\n' : index === 2 ? 'disable-model-invocation: true\nuser-invocable: false\n' : '';
    if (flags) await writeFile(path, instruction(name).replace('\n---\nRead', `\n${flags}---\nRead`));
  }
  const projectPath = await writeSkill(join(project, '.dsh', 'skills'), 'local-03', 'Project override.');
  for (let index = 0; index < 8; index++) {
    const dispose = f.registry.register({ name: `builtin-${index}`, description: 'A plugin-provided skill.', source: 'bundled', content: 'Use the bundled workflow.' });
    t.after(dispose);
  }
  const names = (data, ids) => ids.map(id => data.skills.find(skill => skill.id === id).name).sort();
  const minimal = await f.request({ action: 'list', sessionId: 'catalog-session', presetId: 'minimal' });
  assert.equal(minimal.success, true);
  assert.equal(minimal.data.skills.length, 40, 'the library retains 32 physical copies plus eight plugin skills');
  assert.equal(minimal.data.skills.filter(skill => !skill.readOnly && skill.enabled).length, 32);
  assert.equal(minimal.data.catalog.complete, true);
  assert.deepEqual(minimal.data.catalog.counts, { available: 8, automatic: 8, manual: 8, registered: 8 });
  assert.deepEqual(names(minimal.data, minimal.data.catalog.manualIds), (await f.registry.list({ cwd: project, scope: f.keys.minimal })).filter(isUserInvocable).map(skill => skill.name).sort());
  assert.ok(minimal.data.catalog.availableIds.every(id => id.startsWith('provider:')), 'local file switches do not create availability in a provider-free mode');

  const standard = await f.request({ action: 'list', sessionId: 'catalog-session', presetId: 'standard' });
  const actual = await f.registry.list({ cwd: project, scope: f.keys.standard });
  assert.equal(standard.data.catalog.complete, true);
  assert.deepEqual(standard.data.catalog.counts, { available: 38, automatic: 37, manual: 37, registered: 39 });
  assert.deepEqual(names(standard.data, standard.data.catalog.manualIds), actual.filter(isUserInvocable).map(skill => skill.name).sort(), 'same filter used by SessionSkillCatalog.list for / menus');
  assert.deepEqual(names(standard.data, standard.data.catalog.automaticIds), actual.filter(isModelInvocable).map(skill => skill.name).sort());
  assert.deepEqual(names(standard.data, standard.data.catalog.availableIds), actual.filter(skill => isUserInvocable(skill) || isModelInvocable(skill)).map(skill => skill.name).sort());
  const disabledInvocation = standard.data.skills.find(skill => skill.name === 'local-02');
  assert.equal(disabledInvocation.enabled, true);
  assert.equal(disabledInvocation.availability.status, 'invocation_disabled');
  assert.equal(disabledInvocation.effective, false);
  assert.ok(standard.data.catalog.registeredIds.includes(disabledInvocation.id));
  assert.ok(!standard.data.catalog.availableIds.includes(disabledInvocation.id));
  const overridden = standard.data.skills.filter(skill => skill.name === 'local-03');
  assert.equal(overridden.length, 2);
  assert.equal(overridden.filter(skill => standard.data.catalog.availableIds.includes(skill.id)).length, 1);
  assert.equal(overridden.find(skill => standard.data.catalog.availableIds.includes(skill.id)).path, projectPath);
});

test('incomplete real discovery retains confirmed rows but never turns an unknown total into zero', { timeout: 10_000 }, async t => {
  const f = await fixture(t);
  const candidate = { name: 'remote-confirmed', description: 'A known remote entry.', invocation: { modelInvocable: false, userInvocable: true }, source: 'bundled', provider: 'partial-remote', rank: 600, locator: 'remote-confirmed' };
  const dispose = f.registry.registerProvider(() => ({ name: 'partial-remote', list: async () => ({ candidates: [candidate], complete: false }), get: async () => undefined }));
  t.after(dispose);
  const result = await f.request({ action: 'list', workspaceId: 'user', presetId: 'minimal' });
  assert.equal(result.success, true);
  assert.equal(result.data.catalog.complete, false);
  assert.deepEqual(result.data.catalog.counts, { available: null, automatic: null, manual: null, registered: null });
  assert.equal(result.data.catalog.availableIds.length, 1);
  assert.equal(result.data.catalog.manualIds.length, 1);
  assert.equal(result.data.catalog.automaticIds.length, 0);
  assert.equal(result.data.skills.find(skill => skill.id === result.data.catalog.manualIds[0]).name, 'remote-confirmed');
});

test('a file policy still waiting for the real watcher is unknown rather than falsely available or empty', { timeout: 10_000 }, async t => {
  const f = await fixture(t);
  const path = await writeSkill(join(f.config.dshHome, 'skills'), 'waiting-policy');
  const first = await f.request({ action: 'list' });
  assert.equal(first.data.catalog.counts.available, 1);
  await writeFile(path, instruction('waiting-policy').replace('\n---\nRead', '\nuser-invocable: false\n---\nRead'));
  const pending = await f.request({ action: 'list' });
  assert.equal(pending.data.skills.find(skill => skill.name === 'waiting-policy').availability.status, 'unknown');
  assert.equal(pending.data.catalog.complete, false);
  assert.equal(pending.data.catalog.counts.available, null);
  assert.deepEqual(pending.data.catalog.availableIds, []);
  const settled = await until(() => f.request({ action: 'list' }), result => result.data.catalog.complete, 'file policy did not settle');
  assert.deepEqual(settled.data.catalog.counts, { available: 1, automatic: 1, manual: 0, registered: 1 });
});
