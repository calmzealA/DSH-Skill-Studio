import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, readdir, symlink, rm, lstat, realpath, chmod } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { SkillManager, validateSkill } from '../src/manager.mjs';
import { decodeUpload } from '../src/archive.mjs';

const md = (name, body = 'Follow the workflow.', extra = '') => `---\nname: ${name}\ndescription: Helpful ${name} instructions.\n${extra}---\n\n${body}\n`;
const file = (path, text) => ({ path, base64: Buffer.from(text).toString('base64') });
async function setup(t) {
  const dir = await mkdtemp(join(await realpath(tmpdir()), 'dsh-studio-test-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const roots = [{ id: 'global', path: join(dir, 'skills'), source: 'user-dsh', label: 'Global', rank: 400, writable: true }];
  const manager = new SkillManager({ stateDir: join(dir, 'state'), roots: async () => roots });
  const request = (action, args = {}) => manager.request({ action, ...args });
  return { dir, roots, manager, request };
}

test('frontmatter matches DSH invocation semantics and detects invalid canonical fields', () => {
  const parsed = validateSkill(md('research-notes', 'Instructions.', 'disable-model-invocation: yes\nuser-invocable: 0\n'));
  assert.equal(parsed.modelInvocable, false);
  assert.equal(parsed.userInvocable, false);
  assert.equal(parsed.issues.length, 0);
  assert.ok(validateSkill(md('Bad Name')).issues.some((i) => i.code === 'INVALID_NAME'));
  assert.ok(validateSkill('No frontmatter').issues.some((i) => i.code === 'MISSING_FRONTMATTER'));
  assert.ok(validateSkill(md('sample', 'Body', 'modelInvocable: true\n')).issues.some((i) => i.code === 'LEGACY_INVOCATION'));
  assert.ok(validateSkill(md('sample', 'Body', 'user-invocable: maybe\n')).issues.some((i) => i.code === 'INVALID_INVOCATION'));
});

test('create, atomic edit, stale editor rejection, enable and disable', async (t) => {
  const { request, roots } = await setup(t);
  const created = await request('create', { rootId: 'global', name: 'research-notes', description: 'Use for research.' });
  assert.equal(created.skill.name, 'research-notes');
  const firstHash = created.hash;
  const saved = await request('save', { id: created.skill.id, text: md('research-notes', 'Updated.'), expectedHash: firstHash });
  assert.notEqual(saved.hash, firstHash);
  await assert.rejects(request('save', { id: created.skill.id, text: md('research-notes', 'Stale.'), expectedHash: firstHash }), { code: 'STALE_WRITE' });
  const disabled = await request('toggle', { id: created.skill.id, enabled: false });
  assert.equal(disabled.skill.enabled, false);
  assert.match(disabled.skill.path, /SKILL\.md\.disabled$/);
  const enabled = await request('toggle', { id: created.skill.id, enabled: true });
  assert.equal(enabled.skill.id, created.skill.id);
  assert.equal((await readdir(join(roots[0].path, 'research-notes'))).some((x) => x.includes('.tmp')), false);
  assert.equal((await request('history')).entries.length, 3);
});

test('delete and restore retain complete binary resources and original enable state', async (t) => {
  const { request, roots } = await setup(t);
  const preview = await request('previewImport', { rootId: 'global', files: [file('demo/SKILL.md.disabled', md('demo')), file('demo/references/a.txt', 'complete resource'), { path: 'demo/assets/binary.bin', base64: Buffer.from([0, 255, 1]).toString('base64') }] });
  await request('applyImport', { token: preview.token });
  const skill = (await request('list')).skills[0];
  const deleted = await request('delete', { id: skill.id });
  assert.equal((await request('list')).skills.length, 0);
  await request('restore', { historyId: deleted.historyId });
  const restored = await request('read', { id: skill.id });
  assert.equal(restored.skill.enabled, false);
  assert.equal(restored.files.length, 3);
  assert.deepEqual(await readFile(join(roots[0].path, 'demo/assets/binary.bin')), Buffer.from([0, 255, 1]));
});

test('flat files support disable, export, and restore without changing identity', async (t) => {
  const { request, roots } = await setup(t);
  await mkdir(roots[0].path, { recursive: true });
  await writeFile(join(roots[0].path, 'flat.md'), md('flat'));
  const skill = (await request('list')).skills[0];
  const disabled = await request('toggle', { id: skill.id, enabled: false });
  const archive = decodeUpload({ zipBase64: (await request('export', { ids: [skill.id] })).base64 });
  assert.equal(archive[0].path, 'flat/SKILL.md.disabled');
  const deleted = await request('delete', { id: skill.id });
  await request('restore', { historyId: deleted.historyId });
  assert.equal((await request('read', { id: skill.id })).skill.enabled, false);
  assert.equal(disabled.skill.id, skill.id);
});

test('preview import skips existing conflicts and malformed skills without overwriting', async (t) => {
  const { request } = await setup(t);
  await request('create', { rootId: 'global', text: md('existing', 'Original.') });
  const preview = await request('previewImport', { rootId: 'global', files: [file('repo/existing/SKILL.md', md('existing', 'Overwrite.')), file('repo/new-one/SKILL.md', md('new-one')), file('repo/broken/SKILL.md', 'broken')] });
  assert.equal(preview.skills.find((s) => s.name === 'existing').conflict, true);
  const imported = await request('applyImport', { token: preview.token });
  assert.deepEqual(imported.added, [{ name: 'new-one' }]);
  assert.equal(imported.skipped.length, 2);
  const list = await request('list');
  const current = await request('read', { id: list.skills.find((s) => s.name === 'existing').id });
  assert.match(current.text, /Original/);
});

test('root SKILL.md import installs by frontmatter name and source metadata survives updates', async (t) => {
  const { request } = await setup(t);
  const source = { type: 'github', repository: 'example/skills', commit: 'a'.repeat(40), ref: 'main', path: 'skills/demo', url: 'https://github.com/example/skills/tree/main/skills/demo' };
  let preview = await request('previewImport', { rootId: 'global', files: [file('SKILL.md', md('demo')), file('references/old.txt', 'old')], source });
  await request('applyImport', { token: preview.token });
  let skill = (await request('list')).skills[0];
  assert.equal(skill.sourceInfo.commit, source.commit);
  assert.equal(skill.sourceInfo.modified, false);
  skill = (await request('toggle', { id: skill.id, enabled: false })).skill;
  assert.equal(skill.sourceInfo.modified, false);
  const newSource = { ...source, commit: 'b'.repeat(40) };
  preview = await request('previewImport', { rootId: 'global', files: [file('SKILL.md', md('demo', 'Updated upstream.')), file('references/new.txt', 'new')], source: newSource, replaceId: skill.id, expectedHash: skill.hash });
  assert.equal(preview.skills[0].conflict, false);
  const update = await request('applyImport', { token: preview.token });
  const updated = await request('read', { id: skill.id });
  assert.equal(updated.skill.enabled, false);
  assert.equal(updated.skill.sourceInfo.commit, newSource.commit);
  assert.equal(updated.files.some((f) => f.path === 'references/old.txt'), false);
  assert.equal(updated.files.some((f) => f.path === 'references/new.txt'), true);
  await request('restore', { historyId: update.added[0].historyId });
  const restored = await request('read', { id: skill.id });
  assert.equal(restored.skill.sourceInfo.commit, source.commit);
  assert.equal(restored.files.some((f) => f.path === 'references/old.txt'), true);
});

test('update requires unchanged complete bundle hash even when only a resource changes', async (t) => {
  const { request, roots } = await setup(t);
  const preview = await request('previewImport', { rootId: 'global', files: [file('SKILL.md', md('demo')), file('references/file.txt', 'before')] });
  await request('applyImport', { token: preview.token });
  const skill = (await request('list')).skills[0];
  const update = await request('previewImport', { rootId: 'global', files: [file('SKILL.md', md('demo', 'Updated'))], replaceId: skill.id, expectedHash: skill.hash });
  await writeFile(join(roots[0].path, 'demo/references/file.txt'), 'External edit');
  await assert.rejects(request('applyImport', { token: update.token }), { code: 'STALE_WRITE' });
});

test('malformed frontmatter remains visible and can be repaired by the editor', async (t) => {
  const { request, roots } = await setup(t);
  await mkdir(join(roots[0].path, 'repair-me'), { recursive: true });
  await writeFile(join(roots[0].path, 'repair-me/SKILL.md'), '---\nname: [\n---\nBroken');
  const skill = (await request('list')).skills[0];
  assert.equal(skill.name, 'repair-me');
  assert.ok(skill.issues.some((i) => i.code === 'INVALID_YAML'));
  const repaired = await request('save', { id: skill.id, expectedHash: skill.hash, text: md('repair-me') });
  assert.equal(repaired.skill.issues.length, 0);
});

test('source precedence exposes duplicate shadowing while invalid or disabled entries never shadow', async (t) => {
  const { request, roots, dir } = await setup(t);
  roots.push({ id: 'project', path: join(dir, 'project/.dsh/skills'), source: 'project-dsh', rank: 100, writable: true });
  const global = await request('create', { rootId: 'global', text: md('same-name') });
  const project = await request('create', { rootId: 'project', text: md('same-name') });
  assert.equal((await request('list')).skills.find((s) => s.id === global.skill.id).shadowedBy, project.skill.id);
  await request('toggle', { id: project.skill.id, enabled: false });
  assert.equal((await request('list')).skills.find((s) => s.id === global.skill.id).shadowedBy, undefined);
});

test('read-only roots can be copied but never edited or deleted', async (t) => {
  const { request, roots, dir } = await setup(t);
  const sourcePath = join(dir, 'bundled/demo');
  await mkdir(sourcePath, { recursive: true });
  await writeFile(join(sourcePath, 'SKILL.md'), md('demo'));
  roots.push({ id: 'bundled', path: join(dir, 'bundled'), source: 'bundled', rank: 600, writable: false });
  const skill = (await request('list')).skills[0];
  await assert.rejects(request('delete', { id: skill.id }), { code: 'READ_ONLY' });
  await request('copy', { id: skill.id, rootId: 'global' });
  assert.equal((await request('list')).skills.length, 2);
});

test('filesystem symlinks cannot escape a root, including resource symlinks and root symlinks', async (t) => {
  const { request, roots, dir } = await setup(t);
  await mkdir(join(roots[0].path, 'unsafe'), { recursive: true });
  await writeFile(join(roots[0].path, 'unsafe/SKILL.md'), md('unsafe'));
  await writeFile(join(dir, 'outside.txt'), 'Do not touch');
  try { await symlink(join(dir, 'outside.txt'), join(roots[0].path, 'unsafe/resource.txt')); }
  catch (e) { if (process.platform === 'win32' && ['EPERM', 'EACCES'].includes(e.code)) return t.skip('Windows symbolic-link privilege is unavailable.'); throw e; }
  const skill = (await request('list')).skills[0];
  assert.equal(skill.readOnly, true);
  assert.ok(skill.issues.some((i) => i.code === 'SYMLINK'));
  await assert.rejects(request('delete', { id: skill.id }), { code: 'READ_ONLY' });
  roots.push({ id: 'linked', path: join(dir, 'linked'), writable: true });
  await symlink(join(dir, 'outside'), join(dir, 'linked'));
  await assert.rejects(request('create', { rootId: 'linked', text: md('bad') }), { code: 'SYMLINK' });
  assert.equal(await readFile(join(dir, 'outside.txt'), 'utf8'), 'Do not touch');
});

test('concurrent browser writes are serialized and stale second edit is rejected', async (t) => {
  const { request } = await setup(t);
  const created = await request('create', { rootId: 'global', text: md('demo') });
  const writes = await Promise.allSettled([
    request('save', { id: created.skill.id, text: md('demo', 'One'), expectedHash: created.hash }),
    request('save', { id: created.skill.id, text: md('demo', 'Two'), expectedHash: created.hash }),
  ]);
  assert.equal(writes.filter((r) => r.status === 'fulfilled').length, 1);
  assert.equal(writes.find((r) => r.status === 'rejected').reason.code, 'STALE_WRITE');
});

test('bundle resource updates invalidate whole-bundle hash and have recovery history', async (t) => {
  const { request } = await setup(t);
  const created = await request('create', { rootId: 'global', text: md('demo') });
  const updated = await request('saveFile', { id: created.skill.id, path: 'references/help.md', base64: Buffer.from('A resource').toString('base64'), expectedHash: created.hash });
  assert.notEqual(updated.hash, created.hash);
  await request('restore', { historyId: updated.historyId });
  assert.equal((await request('read', { id: created.skill.id })).files.length, 1);
  await assert.rejects(request('saveFile', { id: created.skill.id, path: '../escape', base64: '', expectedHash: created.hash }), { code: 'INVALID_PATH' });
});

test('import rechecks conflicts after preview and rejects overlapping bundles', async (t) => {
  const { request } = await setup(t);
  const preview = await request('previewImport', { rootId: 'global', files: [file('demo/SKILL.md', md('demo'))] });
  await request('create', { rootId: 'global', text: md('demo', 'Keep this.') });
  await assert.rejects(request('applyImport', { token: preview.token }), { code: 'CONFLICT' });
  await assert.rejects(request('previewImport', { rootId: 'global', files: [file('SKILL.md', md('outer')), file('nested/SKILL.md', md('inner'))] }), { code: 'NESTED_SKILLS' });
});

test('duplicate active and disabled instruction files are visible without duplicate ids', async (t) => {
  const { request, roots } = await setup(t);
  await mkdir(join(roots[0].path, 'demo'), { recursive: true });
  await writeFile(join(roots[0].path, 'demo/SKILL.md'), md('demo'));
  await writeFile(join(roots[0].path, 'demo/SKILL.md.disabled'), md('demo'));
  const list = await request('list');
  assert.equal(list.skills.length, 1);
  assert.ok(list.skills[0].issues.some((i) => i.code === 'DUPLICATE_INSTRUCTION'));
  await assert.rejects(request('toggle', { id: list.skills[0].id, enabled: false }), { code: 'CONFLICT' });
});

test('resource deletion is reversible and cannot remove SKILL.md or escape its bundle', async (t) => {
  const { request } = await setup(t);
  const created = await request('create', { rootId: 'global', text: md('demo') });
  const withFile = await request('saveFile', { id: created.skill.id, path: 'scripts/run.py', base64: Buffer.from('print(1)').toString('base64'), expectedHash: created.hash });
  const removed = await request('deleteFile', { id: created.skill.id, path: 'scripts/run.py', expectedHash: withFile.hash });
  assert.equal(removed.files.length, 1);
  await request('restore', { historyId: removed.historyId });
  const restored = await request('read', { id: created.skill.id });
  assert.equal(restored.files.length, 2);
  await assert.rejects(request('deleteFile', { id: created.skill.id, path: 'SKILL.md', expectedHash: restored.hash }), { code: 'USE_SAVE' });
  await assert.rejects(request('deleteFile', { id: created.skill.id, path: '../escape', expectedHash: restored.hash }), { code: 'INVALID_PATH' });
});

test('case-distinct roots remain separate on case-sensitive platforms', { skip: process.platform === 'win32' }, async (t) => {
  const { request, roots, dir } = await setup(t);
  roots.push({ id: 'upper', path: join(dir, 'Skills'), source: 'custom', rank: 300, writable: true });
  await mkdir(roots[0].path, { recursive: true });
  await mkdir(roots[1].path, { recursive: true });
  const lowerInfo = await lstat(roots[0].path);
  const upperInfo = await lstat(roots[1].path);
  if (lowerInfo.dev === upperInfo.dev && lowerInfo.ino === upperInfo.ino) return t.skip('Filesystem is case-insensitive.');
  await request('create', { rootId: 'global', text: md('lower') });
  await request('create', { rootId: 'upper', text: md('upper') });
  assert.equal((await request('list')).skills.length, 2);
});

test('script executable permission survives import, edit, ZIP export, delete and restore', async (t) => {
  const { request, roots } = await setup(t);
  const preview = await request('previewImport', { rootId: 'global', files: [file('SKILL.md', md('executable')), { ...file('scripts/run.sh', '#!/bin/sh\nexit 0\n'), mode: 0o4755 }] });
  await request('applyImport', { token: preview.token });
  let read = await request('read', { id: (await request('list')).skills[0].id });
  const path = join(roots[0].path, 'executable/scripts/run.sh');
  if (process.platform !== 'win32') assert.equal((await lstat(path)).mode & 0o7777, 0o755);
  read = await request('saveFile', { id: read.skill.id, path: 'scripts/run.sh', base64: Buffer.from('#!/bin/sh\nexit 1\n').toString('base64'), expectedHash: read.hash });
  const exported = decodeUpload({ zipBase64: (await request('export', { ids: [read.skill.id] })).base64 });
  if (process.platform !== 'win32') assert.equal(exported.find(f => f.path.endsWith('/run.sh')).mode, 0o755);
  const deleted = await request('delete', { id: read.skill.id });
  await request('restore', { historyId: deleted.historyId });
  if (process.platform !== 'win32') assert.equal((await lstat(path)).mode & 0o7777, 0o755);
  // An external permission change alone invalidates an open editor's bundle hash.
  if (process.platform !== 'win32') {
    await chmod(path, 0o644);
    await assert.rejects(request('save', { id: read.skill.id, text: md('executable'), expectedHash: read.hash }), { code: 'STALE_WRITE' });
  }
});

test('invocation values follow DSH scalar-only coercion, including quoted strings and numbers', () => {
  for (const [yaml, expected] of [['true', true], ['false', false], ['1', true], ['0', false], ['"1"', true], ['"0"', false], ['"YES"', true], ["'off'", false], ['on', true], ['no', false]]) {
    const parsed = validateSkill(md('policy-test', 'Body', `disable-model-invocation: ${yaml}\nuser-invocable: ${yaml}\n`));
    assert.equal(parsed.valid, true, yaml);
    assert.equal(parsed.modelInvocable, !expected, yaml);
    assert.equal(parsed.userInvocable, expected, yaml);
  }
  for (const yaml of ['[true]', '[false]', '[1]', '[0]', '{}', 'null', '2', '0.5', '""', '" false "', 'maybe']) {
    const parsed = validateSkill(md('policy-test', 'Body', `disable-model-invocation: ${yaml}\nuser-invocable: ${yaml}\n`));
    assert.equal(parsed.valid, false, yaml);
    assert.equal(parsed.issues.filter(i => i.code === 'INVALID_INVOCATION').length, 2, yaml);
  }
  assert.equal(validateSkill(md('policy-test')).modelInvocable, true);
  assert.equal(validateSkill(md('policy-test')).userInvocable, true);
});

test('frontmatter boundaries agree with DSH instead of accepting ignored BOM or lone-CR files', () => {
  assert.equal(validateSkill(md('demo').replaceAll('\n', '\r\n')).valid, true);
  assert.equal(validateSkill(`\uFEFF${md('demo')}`).valid, false);
  assert.equal(validateSkill(md('demo').replaceAll('\n', '\r')).valid, false);
  assert.equal(validateSkill('---\nname: demo\ndescription: Read this.\n---').valid, true);
});

test('setPolicy preserves body bytes, comments and unknown metadata, with independent controls and history', async (t) => {
  const { request } = await setup(t);
  const body = '\r\n# 工作流\r\n\r\nKeep user-invocable: false in this example.\n```yaml\nmetadata:\n  custom: preserve\n```\r\n';
  const original = `---\r\n# name comment\r\nname: "policy-test" # exact name\r\ndescription: 'Route useful work.'\r\n# policy note\r\nuser-invocable: "no" # keep inline comment\r\nmetadata:\r\n  vendor: [one, two] # vendor comment\r\n  nested:\r\n    keep: 17\r\nx-extra: keep this\r\n---\r\n${body}`;
  const created = await request('create', { rootId: 'global', text: original });
  const before = validateSkill(original);
  let changed = await request('setPolicy', { id: created.skill.id, expectedHash: created.hash, modelInvocable: false, userInvocable: true });
  const after = validateSkill(changed.text);
  assert.equal(after.body, body);
  assert.deepEqual(after.metadata.metadata, before.metadata.metadata);
  assert.equal(after.metadata['x-extra'], before.metadata['x-extra']);
  assert.equal(after.metadata.name, before.metadata.name);
  assert.equal(after.metadata.description, before.metadata.description);
  for (const comment of ['# name comment', '# exact name', '# policy note', '# keep inline comment', '# vendor comment']) assert.ok(changed.text.includes(comment), comment);
  assert.match(changed.text, /disable-model-invocation: true\r\n/);
  assert.match(changed.text, /user-invocable: true # keep inline comment/);
  assert.equal(changed.skill.modelInvocable, false);
  assert.equal(changed.skill.userInvocable, true);
  assert.equal((await request('history')).entries[0].action, 'setPolicy');
  await assert.rejects(request('setPolicy', { id: created.skill.id, expectedHash: created.hash, modelInvocable: true, userInvocable: false }), { code: 'STALE_WRITE' });
  changed = await request('toggle', { id: created.skill.id, enabled: false });
  changed = await request('setPolicy', { id: created.skill.id, expectedHash: changed.hash, modelInvocable: true, userInvocable: false });
  assert.equal(changed.skill.enabled, false);
  assert.equal(changed.skill.effective, false);
  assert.equal(changed.skill.modelInvocable, true);
  assert.equal(changed.skill.userInvocable, false);
  assert.equal(validateSkill(changed.text).body, body);
});

test('setPolicy rejects nonboolean input and shared aliases without changing other metadata', async (t) => {
  const { request } = await setup(t);
  const created = await request('create', { rootId: 'global', text: md('demo', 'Body', 'user-invocable: &shared true\nx-metadata-copy: *shared\n') });
  await assert.rejects(request('setPolicy', { id: created.skill.id, expectedHash: created.hash, modelInvocable: 'false', userInvocable: true }), { code: 'INVALID_REQUEST' });
  await assert.rejects(request('setPolicy', { id: created.skill.id, expectedHash: created.hash, modelInvocable: true, userInvocable: false }), { code: 'POLICY_ALIAS' });
  assert.equal((await request('read', { id: created.skill.id })).text, created.text);
  assert.equal((await request('history')).entries.length, 0);
});

test('disabling or changing policy on a higher-priority copy preserves fallback copy policy', async (t) => {
  const { request, roots, dir } = await setup(t);
  roots.push({ id: 'project', path: join(dir, 'project/.dsh/skills'), source: 'project-dsh', rank: 100, writable: true });
  const global = await request('create', { rootId: 'global', text: md('same-name') });
  const project = await request('create', { rootId: 'project', text: md('same-name') });
  await request('setPolicy', { id: project.skill.id, expectedHash: project.hash, modelInvocable: false, userInvocable: false });
  let list = await request('list');
  assert.equal(list.skills.find(s => s.id === global.skill.id).effective, false);
  assert.equal(list.skills.find(s => s.id === global.skill.id).userInvocable, true);
  await request('toggle', { id: project.skill.id, enabled: false });
  list = await request('list');
  assert.equal(list.skills.find(s => s.id === global.skill.id).effective, true);
  assert.equal((await request('read', { id: global.skill.id })).text, global.text);
});

test('policy, physical enable state, and resources survive export, preview, copy and restore', async (t) => {
  const { request, roots, dir } = await setup(t);
  roots.push({ id: 'second', path: join(dir, 'second/skills'), source: 'custom', rank: 300, writable: true });
  let created = await request('create', { rootId: 'global', text: md('demo', 'Body', 'disable-model-invocation: "yes"\nuser-invocable: 0\n') });
  created = await request('toggle', { id: created.skill.id, enabled: false });
  const archive = await request('export', { ids: [created.skill.id] });
  const preview = await request('previewImport', { rootId: 'second', zipBase64: archive.base64 });
  assert.equal(preview.skills[0].enabled, false);
  assert.equal(preview.skills[0].modelInvocable, false);
  assert.equal(preview.skills[0].userInvocable, false);
  assert.equal(preview.skills[0].valid, true);
  await request('copy', { id: created.skill.id, rootId: 'second' });
  const copy = (await request('list')).skills.find(s => s.rootId === 'second');
  assert.equal(copy.enabled, false);
  assert.equal(copy.modelInvocable, false);
  assert.equal(copy.userInvocable, false);
  const deleted = await request('delete', { id: copy.id });
  const restored = await request('restore', { historyId: deleted.historyId });
  assert.equal(restored.skill.valid, true);
  assert.equal(restored.skill.enabled, false);
  assert.equal(restored.skill.userInvocable, false);
});

test('invalid backups and unavailable export selections fail instead of reporting partial success', async (t) => {
  const { request, dir } = await setup(t);
  const created = await request('create', { rootId: 'global', text: md('demo') });
  await assert.rejects(request('export', { ids: [created.skill.id, 'missing-id'] }), { code: 'NOT_FOUND' });
  const deleted = await request('delete', { id: created.skill.id });
  const path = join(dir, 'state/history', `${deleted.historyId}.json`);
  const original = JSON.parse(await readFile(path, 'utf8'));
  await writeFile(path, JSON.stringify({ ...original, files: [file('references/only.txt', 'Missing instruction')] }));
  assert.equal((await request('history')).entries.length, 0);
  await assert.rejects(request('restore', { historyId: deleted.historyId }), { code: 'INVALID_BACKUP' });
  await writeFile(path, '{ invalid json');
  await assert.rejects(request('restore', { historyId: deleted.historyId }), { code: 'INVALID_BACKUP' });
  await rm(path);
  await assert.rejects(request('restore', { historyId: deleted.historyId }), { code: 'NOT_FOUND' });
});

test('restoring damaged frontmatter preserves recoverability while marking the skill ineffective', async (t) => {
  const { request, roots } = await setup(t);
  await mkdir(join(roots[0].path, 'broken'), { recursive: true });
  await writeFile(join(roots[0].path, 'broken/SKILL.md'), '---\nname: [\n---\nBroken body');
  const broken = (await request('list')).skills[0];
  assert.equal(broken.valid, false);
  assert.equal(broken.effective, false);
  const fixed = await request('save', { id: broken.id, expectedHash: broken.hash, text: md('broken') });
  const restored = await request('restore', { historyId: fixed.historyId });
  assert.equal(restored.skill.valid, false);
  assert.equal(restored.skill.effective, false);
  assert.match(restored.text, /Broken body/);
});
