import { zipSync } from 'fflate';
import { inflateRawSync } from 'node:zlib';

export const ARCHIVE_LIMITS = Object.freeze({ files: 2000, totalBytes: 32 * 1024 * 1024, fileBytes: 8 * 1024 * 1024, archiveBytes: 40 * 1024 * 1024 });

function fail(code, message) { const error = new Error(message); error.code = code; throw error; }

/** Keep only the portable executable distinction; never restore special bits. */
export function normalizeFileMode(value) {
  if (value === '100755' || value === '0755') return 0o755;
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 && (value & 0o111) !== 0 ? 0o755 : 0o644;
}

/** Portable relative paths: the same archive must be safe on Windows and Unix. */
export function normalizeArchivePath(value) {
  if (typeof value !== 'string' || !value || value.length > 4096 || /[\x00-\x1f\x7f]/.test(value)) fail('INVALID_PATH', 'Invalid archive path');
  const path = value.replaceAll('\\', '/');
  if (path.startsWith('/') || path.includes(':')) fail('INVALID_PATH', 'Absolute archive paths are not allowed');
  const segments = path.replace(/\/$/, '').split('/');
  if (segments.some(part => !part || part === '.' || part === '..' || /[ .]$/.test(part) || /[<>"|?*]/.test(part) || /^(con|prn|aux|nul|com[1-9¹²³]|lpt[1-9¹²³])\s*(?:\.|$)/i.test(part))) fail('INVALID_PATH', 'Unsafe archive path');
  return segments.join('/');
}

export function decodeBase64(value, maxBytes = ARCHIVE_LIMITS.fileBytes) {
  if (typeof value !== 'string' || value.length > Math.ceil(maxBytes / 3) * 4 + 4 || value.length % 4 !== 0 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value)) fail('INVALID_UPLOAD', 'Invalid or oversized base64 data');
  const data = Buffer.from(value, 'base64');
  if (data.length > maxBytes) fail('LIMIT_EXCEEDED', 'Upload is too large');
  return data;
}

function portableKey(path) { return path.normalize('NFC').toLowerCase(); }

const crcTable = Array.from({ length: 256 }, (_, value) => {
  for (let bit = 0; bit < 8; bit++) value = (value & 1) ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});
function crc32(bytes) {
  let value = 0xffffffff;
  for (const byte of bytes) value = crcTable[(value ^ byte) & 255] ^ (value >>> 8);
  return (value ^ 0xffffffff) >>> 0;
}

function checkEntries(entries) {
  if (entries.length > ARCHIVE_LIMITS.files) fail('LIMIT_EXCEEDED', 'Too many files');
  let total = 0;
  const seen = new Map();
  for (const entry of entries) {
    const key = portableKey(entry.path);
    if (seen.has(key)) fail('DUPLICATE_PATH', 'Duplicate archive file path');
    seen.set(key, entry);
    if (entry.size > ARCHIVE_LIMITS.fileBytes || (total += entry.size) > ARCHIVE_LIMITS.totalBytes) fail('LIMIT_EXCEEDED', 'Archive exceeds the expanded size limit');
  }
  for (const key of seen.keys()) {
    const parts = key.split('/');
    for (let index = 1; index < parts.length; index++) if (seen.has(parts.slice(0, index).join('/'))) fail('DUPLICATE_PATH', 'A file conflicts with an archive directory');
  }
  return entries;
}

/** Inspect the central directory before asking the inflater to allocate memory. */
function inspectZip(data) {
  if (data.length < 22 || data.length > ARCHIVE_LIMITS.archiveBytes) fail('INVALID_ARCHIVE', 'Invalid ZIP file');
  let end = -1;
  for (let cursor = data.length - 22; cursor >= Math.max(0, data.length - 65557); cursor--) {
    if (data.readUInt32LE(cursor) === 0x06054b50 && cursor + 22 + data.readUInt16LE(cursor + 20) === data.length) { end = cursor; break; }
  }
  if (end < 0) fail('INVALID_ARCHIVE', 'ZIP end record is missing');
  const count = data.readUInt16LE(end + 10);
  const centralSize = data.readUInt32LE(end + 12);
  const start = data.readUInt32LE(end + 16);
  if (data.readUInt16LE(end + 4) || data.readUInt16LE(end + 6) || data.readUInt16LE(end + 8) !== count || count === 0xffff || centralSize === 0xffffffff || start === 0xffffffff || count > ARCHIVE_LIMITS.files || start + centralSize !== end) fail('INVALID_ARCHIVE', 'Unsupported or oversized ZIP directory');
  let cursor = start;
  const entries = [];
  const dirs = new Set();
  for (let index = 0; index < count; index++) {
    if (cursor + 46 > end || data.readUInt32LE(cursor) !== 0x02014b50) fail('INVALID_ARCHIVE', 'Invalid ZIP directory entry');
    const flags = data.readUInt16LE(cursor + 8);
    const method = data.readUInt16LE(cursor + 10);
    const compressed = data.readUInt32LE(cursor + 20);
    const size = data.readUInt32LE(cursor + 24);
    const crc = data.readUInt32LE(cursor + 16);
    const nameLength = data.readUInt16LE(cursor + 28);
    const extraLength = data.readUInt16LE(cursor + 30);
    const commentLength = data.readUInt16LE(cursor + 32);
    const mode = data.readUInt32LE(cursor + 38) >>> 16;
    const originOS = data[cursor + 5];
    const local = data.readUInt32LE(cursor + 42);
    if (cursor + 46 + nameLength + extraLength + commentLength > end || flags & 1 || ![0, 8].includes(method) || compressed === 0xffffffff || size === 0xffffffff || local + 30 > start || data.readUInt32LE(local) !== 0x04034b50 || data.readUInt16LE(cursor + 34)) fail('INVALID_ARCHIVE', 'Unsupported ZIP entry');
    if ((mode & 0xf000) === 0xa000) fail('SYMLINK_FORBIDDEN', 'Symbolic links are not supported');
    if ((mode & 0xf000) && ![0x4000, 0x8000].includes(mode & 0xf000)) fail('INVALID_ARCHIVE', 'Special files are not supported');
    const rawName = data.subarray(cursor + 46, cursor + 46 + nameLength);
    const name = rawName.toString('utf8');
    if (name.includes('\ufffd')) fail('INVALID_ARCHIVE', 'ZIP filenames must be UTF-8');
    const path = normalizeArchivePath(name);
    const localNameLength = data.readUInt16LE(local + 26);
    const localExtraLength = data.readUInt16LE(local + 28);
    const bodyStart = local + 30 + localNameLength + localExtraLength;
    if (data.readUInt16LE(local + 6) !== flags || data.readUInt16LE(local + 8) !== method || bodyStart + compressed > start || !data.subarray(local + 30, local + 30 + localNameLength).equals(rawName)) fail('INVALID_ARCHIVE', 'ZIP header and directory disagree');
    const directory = name.endsWith('/') || (mode & 0xf000) === 0x4000;
    if (directory) {
      if (size || compressed > 64) fail('INVALID_ARCHIVE', 'ZIP directories must be empty');
      const key = portableKey(path);
      if (dirs.has(key)) fail('DUPLICATE_PATH', 'Duplicate archive directory');
      dirs.add(key);
    } else entries.push({ path, size, compressed, method, bodyStart, crc, mode: originOS === 3 ? normalizeFileMode(mode) : 0o644 });
    cursor += 46 + nameLength + extraLength + commentLength;
  }
  if (cursor !== end) fail('INVALID_ARCHIVE', 'Invalid ZIP directory size');
  checkEntries(entries);
  for (const entry of entries) if (dirs.has(portableKey(entry.path))) fail('DUPLICATE_PATH', 'A file conflicts with an archive directory');
  return entries;
}

/** Decode a browser upload or ZIP. Nothing is written and no uploaded code runs. */
export function decodeUpload({ files, zipBase64 } = {}) {
  if (files !== undefined && zipBase64 !== undefined) fail('INVALID_UPLOAD', 'Choose files or a ZIP archive');
  if (zipBase64 !== undefined) {
    const data = decodeBase64(zipBase64, ARCHIVE_LIMITS.archiveBytes);
    const entries = inspectZip(data);
    return entries.map(entry => {
      const compressed = data.subarray(entry.bodyStart, entry.bodyStart + entry.compressed);
      let bytes;
      try {
        // maxOutputLength also catches streams whose directory lies about size.
        bytes = entry.method === 0 ? compressed : inflateRawSync(compressed, { maxOutputLength: Math.max(1, entry.size) });
      } catch { fail('INVALID_ARCHIVE', 'Unable to decompress ZIP archive within its declared size'); }
      if (bytes.length !== entry.size || crc32(bytes) !== entry.crc) fail('INVALID_ARCHIVE', 'ZIP checksum or expanded size differs from its directory');
      return { path: entry.path, size: bytes.length, base64: bytes.toString('base64'), mode: entry.mode };
    });
  }
  if (!Array.isArray(files) || !files.length || files.length > ARCHIVE_LIMITS.files) fail('INVALID_UPLOAD', 'Upload must contain between 1 and 2000 files');
  const entries = files.map(file => {
    const path = normalizeArchivePath(file?.path);
    const bytes = decodeBase64(file?.base64);
    return { path, size: bytes.length, base64: bytes.toString('base64'), mode: normalizeFileMode(file?.mode) };
  });
  return checkEntries(entries);
}

export function encodeZip(files) {
  const entries = decodeUpload({ files });
  const output = Object.create(null);
  for (const file of entries) output[file.path] = [new Uint8Array(Buffer.from(file.base64, 'base64')), { os: 3, attrs: ((0o100000 | normalizeFileMode(file.mode)) << 16) >>> 0 }];
  return Buffer.from(zipSync(output, { level: 6 })).toString('base64');
}
