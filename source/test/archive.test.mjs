import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zipSync } from 'fflate';
import { normalizeArchivePath, normalizeFileMode, decodeUpload, encodeZip, ARCHIVE_LIMITS } from '../src/archive.mjs';

const file = (path, text = 'hello') => ({ path, base64: Buffer.from(text).toString('base64') });
const zip = entries => Buffer.from(zipSync(entries));
const centralOffset = data => data.indexOf(Buffer.from([0x50, 0x4b, 0x01, 0x02]));

test('portable upload and ZIP round trip preserves binary resources', () => {
  const files = [file('my-skill/SKILL.md', '技能'), file('my-skill/assets/pixel.bin', '\x00\xff')];
  assert.deepEqual(decodeUpload({ zipBase64: encodeZip(files) }).map(({ path, base64 }) => ({ path, base64 })), files);
  assert.equal(normalizeArchivePath('skill\\scripts\\run.py'), 'skill/scripts/run.py');
});

test('rejects traversal, absolute and Windows-special paths', () => {
  for (const path of ['../oops', 'a/../../oops', '/oops', '\\server\\share', 'C:\\oops', 'a/CON.txt', 'a/CON .txt', 'a/COM¹.txt', 'a/lpt1', 'a/end.', 'a/end ', 'a//b', 'a/./b', 'a\x00b', 'a:stream', 'a/*']) {
    assert.throws(() => normalizeArchivePath(path), { code: 'INVALID_PATH' }, path);
  }
});

test('rejects duplicate, case collisions and file-directory collisions', () => {
  for (const paths of [['a', 'a'], ['A/B.md', 'a/b.MD'], ['a', 'a/b']]) assert.throws(() => decodeUpload({ files: paths.map(path => file(path)) }), { code: 'DUPLICATE_PATH' });
});

test('rejects ZIP path traversal before decompression', () => {
  const data = zip({ '../oops': new Uint8Array([1]) });
  assert.throws(() => decodeUpload({ zipBase64: data.toString('base64') }), { code: 'INVALID_PATH' });
});

test('rejects declared expansion bomb before allocating its output', () => {
  const data = zip({ 'skill/SKILL.md': new Uint8Array([1]) });
  data.writeUInt32LE(0x70000000, centralOffset(data) + 24);
  assert.throws(() => decodeUpload({ zipBase64: data.toString('base64') }), { code: 'LIMIT_EXCEEDED' });
});

test('rejects ZIP symbolic links and encrypted entries', () => {
  const link = zip({ 'skill/SKILL.md': new Uint8Array([1]) });
  link.writeUInt32LE((0xa1ff << 16) >>> 0, centralOffset(link) + 38);
  assert.throws(() => decodeUpload({ zipBase64: link.toString('base64') }), { code: 'SYMLINK_FORBIDDEN' });
  const encrypted = zip({ 'skill/SKILL.md': new Uint8Array([1]) });
  encrypted.writeUInt16LE(1, centralOffset(encrypted) + 8);
  assert.throws(() => decodeUpload({ zipBase64: encrypted.toString('base64') }), { code: 'INVALID_ARCHIVE' });
});

test('rejects invalid base64, per-file limit and excessive file count', () => {
  assert.throws(() => decodeUpload({ files: [{ path: 'file', base64: 'invalid!' }] }), { code: 'INVALID_UPLOAD' });
  assert.throws(() => decodeUpload({ files: [{ path: 'file', base64: Buffer.alloc(ARCHIVE_LIMITS.fileBytes + 1).toString('base64') }] }));
  assert.throws(() => decodeUpload({ files: Array.from({ length: 2001 }, (_, i) => file(`${i}.md`)) }), { code: 'INVALID_UPLOAD' });
});

test('rejects malformed and mismatched ZIP headers', () => {
  const data = zip({ 'skill/SKILL.md': new Uint8Array([1]) });
  data[30] = 'X'.charCodeAt(0);
  assert.throws(() => decodeUpload({ zipBase64: data.toString('base64') }), { code: 'INVALID_ARCHIVE' });
  assert.throws(() => decodeUpload({ zipBase64: Buffer.from('zip?').toString('base64') }), { code: 'INVALID_ARCHIVE' });
});

test('validates CRC and bounds streams whose directory understates expansion', () => {
  const crc = zip({ 'skill/SKILL.md': new Uint8Array([1, 2, 3]) });
  crc.writeUInt32LE(12345, centralOffset(crc) + 16);
  assert.throws(() => decodeUpload({ zipBase64: crc.toString('base64') }), { code: 'INVALID_ARCHIVE' });
  const understated = zip({ 'skill/SKILL.md': new Uint8Array(1024 * 1024) });
  understated.writeUInt32LE(1, centralOffset(understated) + 24);
  assert.throws(() => decodeUpload({ zipBase64: understated.toString('base64') }), { code: 'INVALID_ARCHIVE' });
});

test('accepts explicit ZIP directory entries', () => {
  const data = zip({ 'skill/': new Uint8Array(), 'skill/SKILL.md': new TextEncoder().encode('hello') });
  assert.equal(decodeUpload({ zipBase64: data.toString('base64') }).length, 1);
});

test('preserves executable files through ZIP while stripping special bits', () => {
  const files = [{ ...file('skill/scripts/run.sh', '#!/bin/sh\n'), mode: 0o107755 }, { ...file('skill/SKILL.md'), mode: '100644' }];
  const result = decodeUpload({ zipBase64: encodeZip(files) });
  assert.equal(result[0].mode, 0o755);
  assert.equal(result[1].mode, 0o644);
  assert.equal(decodeUpload({ files })[0].mode, 0o755);
  for (const value of [0o100755, 0o100001, 0o7755, '100755', '0755']) assert.equal(normalizeFileMode(value), 0o755);
  for (const value of [undefined, null, -1, 0o7644, '100644', 'invalid', NaN]) assert.equal(normalizeFileMode(value), 0o644);
});

test('ignores executable ZIP attributes unless created by Unix', () => {
  const data = zip({ 'skill/scripts/run.sh': [new TextEncoder().encode('run'), { os: 0, attrs: (0o100755 << 16) >>> 0 }] });
  assert.equal(decodeUpload({ zipBase64: data.toString('base64') })[0].mode, 0o644);
});
