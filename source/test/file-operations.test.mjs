import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, readdir, rename, rm, realpath } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { tmpdir } from 'node:os';
import { SkillManager } from '../src/manager.mjs';
import { createFileOperations } from '../src/file-operations.mjs';
import { decodeUpload } from '../src/archive.mjs';

const md = body => `---\nname: demo\ndescription: Example workflow.\n---\n\n${body}\n`;
const upload = (path, text) => ({ path, base64: Buffer.from(text).toString('base64') });
const locked = code => Object.assign(new Error(`Injected filesystem ${code}`), { code });

async function fixture(t, fileOperations = {}) {
  const directory = await mkdtemp(join(await realpath(tmpdir()), 'dsh-file-lock-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const root = join(directory, 'skills');
  const manager = new SkillManager({ stateDir: join(directory, 'state'), roots: async () => [{ id: 'global', path: root, writable: true, source: 'user-dsh' }], fileOperations: { platform: 'win32', wait: async () => {}, ...fileOperations } });
  const request = (action, args = {}) => manager.request({ action, ...args });
  const created = await request('create', { rootId: 'global', text: md('Original instructions.') });
  return { directory, root, manager, request, created, path: join(root, 'demo', 'SKILL.md') };
}

test('retry handles temporary Windows share errors while the original file stays intact until atomic commit', async t => {
  let target, attempts = 0;
  const waits = [];
  const f = await fixture(t, {
    renameFile: async (from, to) => {
      if (to === target && attempts++ < 2) throw locked(attempts === 1 ? 'EPERM' : 'EBUSY');
      return rename(from, to);
    },
    wait: async milliseconds => {
      waits.push(milliseconds);
      assert.equal(await readFile(target, 'utf8'), md('Original instructions.'), 'no truncate/write fallback before a successful rename');
    },
  });
  target = f.path;
  const saved = await f.request('setPolicy', { id: f.created.skill.id, expectedHash: f.created.hash, modelInvocable: true, userInvocable: false });
  assert.equal(saved.skill.userInvocable, false);
  assert.equal(saved.text.split('---\n').at(-1), '\nOriginal instructions.\n');
  assert.equal(attempts, 3);
  assert.deepEqual(waits, [40, 80]);
  assert.equal((await f.request('history')).entries.length, 1, 'retries do not create duplicate recovery points');
  assert.deepEqual(await readdir(join(f.root, 'demo')), ['SKILL.md']);
});

test('persistent lock is bounded, preserves the file and recovery history, and permits retrying the unchanged draft', async t => {
  let target, blocked = true, attempts = 0;
  const waits = [];
  const f = await fixture(t, {
    renameFile: async (from, to) => {
      if (to === target && blocked) { attempts++; throw locked('EBUSY'); }
      return rename(from, to);
    }, wait: async value => { waits.push(value); },
  });
  target = f.path;
  const args = { id: f.created.skill.id, text: md('Unsaved draft.'), expectedHash: f.created.hash };
  await assert.rejects(f.request('save', args), error => error.code === 'FILE_BUSY' && error.fsCode === 'EBUSY' && error.cause.code === 'EBUSY');
  assert.equal(attempts, 7);
  assert.equal(waits.reduce((sum, value) => sum + value, 0), 1520);
  assert.equal(await readFile(target, 'utf8'), md('Original instructions.'));
  assert.equal((await f.request('read', { id: f.created.skill.id })).hash, f.created.hash);
  assert.equal((await f.request('history')).entries.length, 1);
  assert.deepEqual(await readdir(join(f.root, 'demo')), ['SKILL.md']);
  blocked = false;
  const saved = await f.request('save', args);
  assert.equal(saved.text, args.text);
});

test('persistent Windows access failure remains an actionable error and non-Windows permission failure is not retried', async () => {
  let attempts = 0, delays = 0;
  const operations = createFileOperations({ platform: 'win32', renameFile: async () => { attempts++; throw locked('EACCES'); }, wait: async () => { delays++; } });
  await assert.rejects(operations.rename('from', 'to'), error => error.code === 'FILE_ACCESS' && error.fsCode === 'EACCES');
  assert.equal(attempts, 7);
  assert.equal(delays, 6);
  attempts = 0;
  const posix = createFileOperations({ platform: 'linux', renameFile: async () => { attempts++; throw locked('EACCES'); }, wait: async () => assert.fail('a permanent POSIX permission error is not a sharing retry') });
  await assert.rejects(posix.rename('from', 'to'), { code: 'EACCES' });
  assert.equal(attempts, 1);
});

test('a resource edited by another program while a save waits is not overwritten', async t => {
  let target, reference, attempts = 0;
  const f = await fixture(t, {
    renameFile: async (from, to) => {
      if (to === target && attempts++ === 0) throw locked('EBUSY');
      return rename(from, to);
    }, wait: async () => { await writeFile(reference, 'Changed by another program.'); },
  });
  const withResource = await f.request('saveFile', { id: f.created.skill.id, path: 'reference.txt', base64: Buffer.from('Original reference.').toString('base64'), expectedHash: f.created.hash });
  target = f.path;
  reference = join(f.root, 'demo', 'reference.txt');
  await assert.rejects(f.request('save', { id: f.created.skill.id, text: md('Draft must remain unsaved.'), expectedHash: withResource.hash }), { code: 'STALE_WRITE' });
  assert.equal(attempts, 1, 'the next atomic commit is refused before another rename attempt');
  assert.equal(await readFile(target, 'utf8'), md('Original instructions.'));
  assert.equal(await readFile(reference, 'utf8'), 'Changed by another program.');
  assert.deepEqual((await readdir(join(f.root, 'demo'))).sort(), ['SKILL.md', 'reference.txt']);
});

test('temporary cleanup failure cannot hide the save error, and a later mutation retries cleanup', async t => {
  let target, blockSave = false, blockCleanup = false;
  const f = await fixture(t, {
    renameFile: async (from, to) => {
      if (to === target && blockSave) throw locked('EBUSY');
      return rename(from, to);
    }, removeFile: async (path, options) => {
      if (blockCleanup && path.startsWith(join(f.root, 'demo')) && path.endsWith('.tmp')) throw locked('EPERM');
      return rm(path, options);
    },
  });
  target = f.path; blockSave = true; blockCleanup = true;
  const args = { id: f.created.skill.id, text: md('Retained draft.'), expectedHash: f.created.hash };
  await assert.rejects(f.request('save', args), error => error.code === 'FILE_BUSY' && error.fsCode === 'EBUSY' && error.cleanupFsCode === 'EPERM');
  assert.equal((await f.request('read', { id: f.created.skill.id })).hash, f.created.hash, 'known temporary files do not become skill resources');
  blockSave = false; blockCleanup = false;
  assert.equal((await f.request('save', args)).text, args.text);
  assert.deepEqual(await readdir(join(f.root, 'demo')), ['SKILL.md']);
});

test('enable, delete and restore use the same bounded share-lock handling and retain full contents', async t => {
  let shouldBlock = () => false, attempts = 0;
  const f = await fixture(t, {
    renameFile: async (from, to) => {
      if (shouldBlock(from, to) && attempts++ < 2) throw locked('EPERM');
      return rename(from, to);
    },
  });
  shouldBlock = from => from === f.path;
  const disabled = await f.request('toggle', { id: f.created.skill.id, enabled: false });
  assert.equal(disabled.skill.enabled, false);
  assert.equal(attempts, 3);
  attempts = 0; shouldBlock = from => from === join(f.root, 'demo');
  const deleted = await f.request('delete', { id: f.created.skill.id });
  assert.equal((await f.request('list')).skills.length, 0);
  assert.equal(attempts, 3);
  attempts = 0; shouldBlock = (from, to) => to === join(f.root, 'demo');
  const restored = await f.request('restore', { historyId: deleted.historyId });
  assert.equal(restored.skill.enabled, false);
  assert.equal(restored.text, md('Original instructions.'));
  assert.equal(attempts, 3);
});

test('failed bundle publish rolls the original back and retains the import preview for retry', async t => {
  let target, blockPublish = false;
  const f = await fixture(t, {
    renameFile: async (from, to) => {
      if (blockPublish && to === target && basename(from).startsWith('.dsh-studio-') && !basename(from).startsWith('.dsh-studio-old-')) throw locked('EBUSY');
      return rename(from, to);
    },
  });
  const preview = await f.request('previewImport', { rootId: 'global', files: [upload('SKILL.md', md('Incoming instructions.')), upload('binary.dat', 'Resource.')], replaceId: f.created.skill.id, expectedHash: f.created.hash });
  target = join(f.root, 'demo'); blockPublish = true;
  await assert.rejects(f.request('applyImport', { token: preview.token }), { code: 'FILE_BUSY' });
  assert.equal(await readFile(f.path, 'utf8'), md('Original instructions.'));
  assert.deepEqual(await readdir(f.root), ['demo']);
  blockPublish = false;
  await f.request('applyImport', { token: preview.token });
  assert.equal(await readFile(f.path, 'utf8'), md('Incoming instructions.'));
  assert.equal(await readFile(join(target, 'binary.dat'), 'utf8'), 'Resource.');
});

test('if both publish and rollback are locked, original and incoming files remain in recovery folders', async t => {
  let target, blocked = false;
  const f = await fixture(t, {
    renameFile: async (from, to) => {
      if (blocked && to === target && basename(from).startsWith('.dsh-studio-')) throw locked('EBUSY');
      return rename(from, to);
    },
  });
  const preview = await f.request('previewImport', { rootId: 'global', files: [upload('SKILL.md', md('Incoming instructions.'))], replaceId: f.created.skill.id, expectedHash: f.created.hash });
  target = join(f.root, 'demo'); blocked = true;
  let recovery;
  await assert.rejects(f.request('applyImport', { token: preview.token }), error => {
    recovery = error.recoveryPath;
    return error.code === 'RECOVERY_REQUIRED' && error.fsCode === 'EBUSY';
  });
  assert.equal(await readFile(join(recovery, 'SKILL.md'), 'utf8'), md('Original instructions.'));
  const incoming = (await readdir(f.root)).find(name => name.startsWith('.dsh-studio-') && !name.startsWith('.dsh-studio-old-'));
  assert.equal(await readFile(join(f.root, incoming, 'SKILL.md'), 'utf8'), md('Incoming instructions.'));
  assert.equal((await f.request('history')).entries.length, 1);
});

test('cleanup of an obsolete backup may be retried without misreporting committed changes as a failed import', async t => {
  let blocked = false;
  const f = await fixture(t, {
    removeFile: async (path, options) => {
      if (blocked && basename(path).startsWith('.dsh-studio-old-')) throw locked('EBUSY');
      return rm(path, options);
    },
  });
  const preview = await f.request('previewImport', { rootId: 'global', files: [upload('SKILL.md', md('Incoming instructions.'))], replaceId: f.created.skill.id, expectedHash: f.created.hash });
  blocked = true;
  const installed = await f.request('applyImport', { token: preview.token });
  assert.equal(installed.added.length, 1);
  assert.equal(installed.warnings[0].code, 'CLEANUP_PENDING');
  assert.equal(await readFile(f.path, 'utf8'), md('Incoming instructions.'));
  blocked = false;
  const current = await f.request('read', { id: f.created.skill.id });
  await f.request('setPolicy', { id: f.created.skill.id, expectedHash: current.hash, modelInvocable: true, userInvocable: false });
  assert.deepEqual(await readdir(f.root), ['demo']);
});

test('after restart, only reserved UUID staging files stay out of export and normal hidden resources survive', async t => {
  let target, blockSave = false, blockCleanup = false;
  const f = await fixture(t, {
    renameFile: async (from, to) => {
      if (to === target && blockSave) throw locked('EBUSY');
      return rename(from, to);
    }, removeFile: async (path, options) => {
      if (blockCleanup && path.startsWith(join(f.root, 'demo')) && path.endsWith('.tmp')) throw locked('EPERM');
      return rm(path, options);
    },
  });
  target = f.path; blockSave = true; blockCleanup = true;
  await assert.rejects(f.request('save', { id: f.created.skill.id, text: md('Uncommitted staging content.'), expectedHash: f.created.hash }), { code: 'FILE_BUSY' });
  const temp = (await readdir(join(f.root, 'demo'))).find(name => name.startsWith('.dsh-studio-'));
  assert.ok(temp, 'fixture left a real staging file after cleanup was denied');
  for (const name of ['.notes.tmp', '.dsh-studio-not-a-uuid.tmp']) await writeFile(join(f.root, 'demo', name), 'A legitimate hidden resource.');
  const fresh = new SkillManager({ stateDir: join(f.directory, 'state'), roots: async () => [{ id: 'global', path: f.root, writable: true, source: 'user-dsh' }] });
  const list = await fresh.request({ action: 'list' });
  const current = await fresh.request({ action: 'read', id: list.skills[0].id });
  assert.deepEqual(current.files.map(file => file.path).sort(), ['.dsh-studio-not-a-uuid.tmp', '.notes.tmp', 'SKILL.md']);
  const exported = decodeUpload({ zipBase64: (await fresh.request({ action: 'export' })).base64 });
  assert.ok(exported.some(file => file.path === 'demo/.notes.tmp'));
  assert.equal(exported.some(file => file.path.endsWith(temp)), false);
  assert.equal(await readFile(join(f.root, 'demo', temp), 'utf8'), md('Uncommitted staging content.'), 'a read does not remove files');
  await fresh.request({ action: 'setPolicy', id: current.skill.id, expectedHash: current.hash, modelInvocable: true, userInvocable: false });
  assert.deepEqual((await readdir(join(f.root, 'demo'))).sort(), ['.dsh-studio-not-a-uuid.tmp', '.notes.tmp', 'SKILL.md']);
});

test('each mutation retries at most one queued cleanup and rotates a locked item fairly', async t => {
  let first, second, firstCalls = 0, secondCalls = 0;
  const waits = [];
  const f = await fixture(t, {
    removeFile: async (path, options) => {
      if (path === first) { firstCalls++; throw locked('EBUSY'); }
      if (path === second) secondCalls++;
      return rm(path, options);
    }, wait: async delay => { waits.push(delay); },
  });
  first = join(f.root, '.dsh-studio-old-first');
  second = join(f.root, '.dsh-studio-old-second');
  await writeFile(first, 'Old temporary data.');
  await writeFile(second, 'Other old temporary data.');
  f.manager.cleanupTasks.set(first, { force: true });
  f.manager.cleanupTasks.set(second, { force: true });
  const saved = await f.request('setPolicy', { id: f.created.skill.id, expectedHash: f.created.hash, modelInvocable: true, userInvocable: false });
  assert.equal(saved.warnings[0].code, 'CLEANUP_PENDING');
  assert.equal(firstCalls, 7);
  assert.equal(secondCalls, 0, 'nested initState calls do not drain more cleanup jobs');
  assert.equal(waits.reduce((sum, delay) => sum + delay, 0), 1520);
  await f.request('save', { id: f.created.skill.id, expectedHash: saved.hash, text: md('Next draft saved.') });
  assert.equal(firstCalls, 7, 'the locked job rotates behind the next queued item');
  assert.equal(secondCalls, 1);
  assert.equal(f.manager.cleanupTasks.size, 1);
});
