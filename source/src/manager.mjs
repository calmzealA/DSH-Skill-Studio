import { constants } from 'node:fs';
import { mkdir, readdir, lstat, open } from 'node:fs/promises';
import { join, resolve, relative, dirname, basename, sep, parse, isAbsolute } from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { parseDocument, stringify } from 'yaml';
import { decodeUpload, encodeZip, normalizeArchivePath, normalizeFileMode } from './archive.mjs';
import { createFileOperations } from './file-operations.mjs';

const NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_FILE = 8 * 1024 * 1024;
const MAX_TOTAL = 32 * 1024 * 1024;
const MAX_FILES = 2000;
const DISABLED = '.disabled';
const ATOMIC_TEMP = /^\.dsh-studio-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.tmp$/i;
const MUTATIONS = new Set(['create', 'save', 'setPolicy', 'saveFile', 'deleteFile', 'toggle', 'delete', 'restore', 'applyImport', 'copy']);
const hash = (value) => createHash('sha256').update(value).digest('hex');
const fail = (code, message) => { const error = new Error(message); error.code = code; throw error; };
const issue = (code, message, severity = 'error') => ({ code, message, severity });
const exists = async (path) => { try { return await lstat(path); } catch (e) { if (e.code === 'ENOENT') return undefined; throw e; } };
const textOf = (file) => Buffer.from(file.base64, 'base64').toString('utf8');
const entryHash = (files) => hash(files.map((f) => `${f.path}\0${normalizeFileMode(f.mode)}\0${f.base64}`).sort().join('\0'));
const contentHash = (files) => entryHash(files.map((f) => ({ ...f, path: f.path === 'SKILL.md.disabled' ? 'SKILL.md' : f.path })));

function policyBoolean(value, fallback, key, issues) {
  if (value === undefined) return fallback;
  if (typeof value === 'boolean') return value;
  if (value === 1 || value === '1') return true;
  if (value === 0 || value === '0') return false;
  if (typeof value === 'string' && /^(true|yes|on)$/i.test(value)) return true;
  if (typeof value === 'string' && /^(false|no|off)$/i.test(value)) return false;
  issues.push(issue('INVALID_INVOCATION', `${key} must be a boolean.`));
  return fallback;
}

/** Keep the exact delimiter and body boundaries accepted by DSH's local provider. */
function frontmatterParts(text) {
  const firstEnd = text.indexOf('\n');
  if (firstEnd < 0 || text.slice(0, firstEnd).replace(/\r$/, '') !== '---') return undefined;
  const start = firstEnd + 1;
  for (let lineStart = start; lineStart <= text.length;) {
    const newline = text.indexOf('\n', lineStart);
    const lineEnd = newline < 0 ? text.length : newline;
    if (text.slice(lineStart, lineEnd).replace(/\r$/, '') === '---') {
      return { start, end: lineStart, bodyStart: newline < 0 ? text.length : newline + 1, newline: text[firstEnd - 1] === '\r' ? '\r\n' : '\n' };
    }
    if (newline < 0) break;
    lineStart = newline + 1;
  }
  return undefined;
}

/** Parse the same canonical frontmatter fields used by DSH's filesystem provider. */
export function validateSkill(text) {
  const issues = [];
  let metadata = {};
  let body = '';
  if (typeof text !== 'string' || Buffer.byteLength(text) > MAX_FILE) {
    return { issues: [issue('TOO_LARGE', 'SKILL.md must be text smaller than 8 MiB.')], metadata, body, modelInvocable: false, userInvocable: false, valid: false };
  }
  const parts = frontmatterParts(text);
  if (!parts) issues.push(issue('MISSING_FRONTMATTER', 'Add YAML frontmatter with name and description.'));
  else {
    body = text.slice(parts.bodyStart);
    try {
      const doc = parseDocument(text.slice(parts.start, parts.end), { uniqueKeys: true });
      if (doc.errors.length) throw doc.errors[0];
      const value = doc.toJS({ maxAliasCount: 20 });
      if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Frontmatter must be a mapping.');
      metadata = value;
    } catch (e) { issues.push(issue('INVALID_YAML', `Invalid YAML: ${e.message}`)); }
  }
  if (typeof metadata.name !== 'string' || !NAME.test(metadata.name)) issues.push(issue('INVALID_NAME', 'Use a lowercase kebab-case name, for example research-notes.'));
  if (typeof metadata.description !== 'string' || !metadata.description.length) issues.push(issue('MISSING_DESCRIPTION', 'A nonempty description is required.'));
  else if (!metadata.description.trim()) issues.push(issue('EMPTY_DESCRIPTION', 'Use a meaningful routing description instead of whitespace.', 'warning'));
  if (typeof metadata.description === 'string' && metadata.description.length > 1024) issues.push(issue('LONG_DESCRIPTION', 'Keep the routing description under 1024 characters.', 'warning'));
  for (const [oldKey, newKey] of [['disableModelInvocation', 'disable-model-invocation'], ['modelInvocable', 'disable-model-invocation'], ['userInvocable', 'user-invocable']]) {
    if (Object.hasOwn(metadata, oldKey)) issues.push(issue('LEGACY_INVOCATION', `Replace ${oldKey} with ${newKey}.`));
  }
  const modelInvocable = !policyBoolean(metadata['disable-model-invocation'], false, 'disable-model-invocation', issues);
  const userInvocable = policyBoolean(metadata['user-invocable'], true, 'user-invocable', issues);
  if (!body.trim()) issues.push(issue('EMPTY_BODY', 'Add instructions below the frontmatter.', 'warning'));
  if (body.length > 30000) issues.push(issue('LONG_BODY', 'Consider moving long reference material into references/.', 'warning'));
  return { metadata, issues, body, modelInvocable, userInvocable, valid: !issues.some(i => i.severity === 'error') };
}

/** Refuse symlinks at every existing segment, including the configured root. */
async function assertSafePath(path, boundary) {
  const absolute = resolve(path);
  if (boundary) {
    const rel = relative(resolve(boundary), absolute);
    if (rel.startsWith(`..${sep}`) || rel === '..' || isAbsolute(rel)) fail('UNSAFE_PATH', 'The path is outside its managed root.');
  }
  // path.parse preserves Windows drive roots and UNC server/share boundaries.
  const root = parse(absolute).root;
  const parts = absolute.slice(root.length).split(sep).filter(Boolean);
  let current = root;
  for (const part of parts) {
    current = join(current, part);
    const info = await exists(current);
    if (info?.isSymbolicLink()) fail('SYMLINK', 'Symbolic links are not managed.');
  }
  return absolute;
}

async function readSafe(path, maxBytes = MAX_FILE) {
  await assertSafePath(path);
  const file = await open(path, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
  try {
    const info = await file.stat();
    if (!info.isFile()) fail('UNSAFE_PATH', 'Expected a regular file.');
    if (info.size > maxBytes) fail('TOO_LARGE', 'A file exceeds its size limit.');
    return await file.readFile();
  } finally { await file.close(); }
}

async function atomicWrite(path, bytes, requestedMode, fileOps, beforeCommit, cleanup) {
  await assertSafePath(path);
  const previous = await exists(path);
  const mode = requestedMode ?? (previous ? previous.mode & 0o777 : 0o600);
  await mkdir(dirname(path), { recursive: true });
  await assertSafePath(dirname(path));
  const temp = join(dirname(path), `.dsh-studio-${randomUUID()}.tmp`);
  let failure;
  try {
    const file = await open(temp, 'wx', mode);
    try { await file.writeFile(bytes); if (process.platform !== 'win32') await file.chmod(mode); await file.sync(); } finally { await file.close(); }
    await fileOps.rename(temp, path, { beforeAttempt: async () => {
      await assertSafePath(path);
      if (beforeCommit) await beforeCommit(temp);
    } });
  } catch (error) { failure = error; throw error; }
  finally { await cleanup(temp, { force: true }, failure); }
}

async function readTree(directory, prefix = '', budget = { bytes: 0, count: 0 }, excludedPaths = new Set(), onAtomicTemp) {
  await assertSafePath(directory);
  const files = [];
  for (const row of (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    const path = normalizeArchivePath(prefix ? `${prefix}/${row.name}` : row.name);
    const absolute = join(directory, row.name);
    if (excludedPaths.has(resolve(absolute))) continue;
    if (row.isSymbolicLink()) fail('SYMLINK', 'Skill resources contain a symbolic link.');
    // This UUIDv4 namespace is reserved for our atomic writes. Even after a
    // restart, an interrupted staging file must never become a skill resource.
    // Other hidden files and ordinary .tmp resources remain visible.
    if (row.isFile() && ATOMIC_TEMP.test(row.name)) { onAtomicTemp?.(absolute); continue; }
    if (row.isDirectory()) files.push(...await readTree(absolute, path, budget, excludedPaths, onAtomicTemp));
    else if (row.isFile()) {
      if (++budget.count > MAX_FILES) fail('TOO_MANY_FILES', 'A skill contains more than 2000 files.');
      const bytes = await readSafe(absolute);
      budget.bytes += bytes.length;
      if (budget.bytes > MAX_TOTAL) fail('TOO_LARGE', 'A skill is larger than 32 MiB.');
      files.push({ path, base64: bytes.toString('base64'), size: bytes.length, mode: normalizeFileMode((await lstat(absolute)).mode) });
    } else fail('UNSAFE_PATH', 'Only regular files and directories are supported.');
  }
  return files;
}

function instructionFile(files) { return files.find((f) => f.path === 'SKILL.md' || f.path === 'SKILL.md.disabled'); }

function checkedBackup(record, expectedId) {
  try {
    if (!record || record.format !== 1 || record.id !== expectedId || typeof record.name !== 'string' || !record.name || typeof record.rootId !== 'string' || !record.rootId || typeof record.action !== 'string' || typeof record.date !== 'string' || !Number.isFinite(Date.parse(record.date)) || typeof record.bundle !== 'boolean' || typeof record.enabled !== 'boolean') throw new Error('Invalid backup fields.');
    const relative = normalizeArchivePath(record.relative);
    if (relative.includes('/')) throw new Error('Backup target is not a direct skill entry.');
    const files = decodeUpload({ files: record.files });
    if (record.bundle) {
      const instructions = files.filter(f => f.path === 'SKILL.md' || f.path === 'SKILL.md.disabled');
      const consistent = record.enabled ? instructions.some(f => f.path === 'SKILL.md') : instructions.length === 1 && instructions[0].path === 'SKILL.md.disabled';
      if (!consistent) throw new Error('Backup instruction state is inconsistent.');
    } else if (files.length !== 1 || files[0].path !== relative || !/\.md(?:\.disabled)?$/.test(relative) || record.enabled === relative.endsWith(DISABLED)) throw new Error('Flat backup state is inconsistent.');
    return { ...record, relative, files };
  } catch { fail('INVALID_BACKUP', 'The selected backup is incomplete or has an inconsistent format.'); }
}

export class SkillManager {
  constructor({ stateDir, roots, fileOperations }) {
    if (!stateDir || typeof roots !== 'function') throw new TypeError('stateDir and roots are required.');
    this.stateDir = resolve(stateDir);
    this.getRoots = roots;
    this.queue = Promise.resolve();
    this.previews = new Map();
    this.fileOps = createFileOperations(fileOperations);
    this.cleanupTasks = new Map();
    this.cleanupBudget = 0;
    this.warnings = [];
  }

  /** Serialize reads with writes so each browser response is one coherent observation. */
  request(payload) {
    const operation = this.queue.then(() => this.dispatch(payload));
    this.queue = operation.catch(() => {});
    return operation;
  }

  async dispatch(payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) fail('INVALID_REQUEST', 'Expected an action object.');
    const actions = {
      list: () => this.list(), read: () => this.read(payload), validate: () => validateSkill(payload.text),
      create: () => this.create(payload), save: () => this.save(payload), setPolicy: () => this.setPolicy(payload), saveFile: () => this.saveFile(payload), deleteFile: () => this.deleteFile(payload),
      toggle: () => this.toggle(payload), delete: () => this.delete(payload), history: () => this.history(),
      restore: () => this.restore(payload), export: () => this.export(payload),
      previewImport: () => this.previewImport(payload), applyImport: () => this.applyImport(payload),
      copy: () => this.copy(payload),
    };
    if (!Object.hasOwn(actions, payload.action)) fail('UNKNOWN_ACTION', 'Unknown skill management action.');
    this.warnings = [];
    this.cleanupBudget = MUTATIONS.has(payload.action) ? 1 : 0;
    if (MUTATIONS.has(payload.action)) await this.initState();
    const result = await actions[payload.action]();
    return this.warnings.length ? { ...result, warnings: this.warnings } : result;
  }

  async initState() {
    await assertSafePath(this.stateDir);
    await mkdir(join(this.stateDir, 'history'), { recursive: true, mode: 0o700 });
    await assertSafePath(join(this.stateDir, 'history'));
    // A growing queue of locked leftovers must not add unbounded save latency.
    // Nested snapshot/source initState calls share this request's one-item budget.
    if (this.cleanupBudget > 0) {
      this.cleanupBudget--;
      const task = this.cleanupTasks.entries().next().value;
      if (task) await this.cleanup(...task);
    }
    if (this.cleanupTasks.size && !this.warnings.some(warning => warning.code === 'CLEANUP_PENDING')) {
      this.warnings.push({ code: 'CLEANUP_PENDING', message: 'Changes were saved. Some temporary files are awaiting cleanup.' });
    }
  }

  async cleanup(path, options, primaryError) {
    try {
      await assertSafePath(path);
      await this.fileOps.remove(path, options);
      this.cleanupTasks.delete(path);
    } catch (error) {
      // Rotate a still-locked file so other cleanup jobs are not starved.
      this.cleanupTasks.delete(path);
      this.cleanupTasks.set(path, options);
      if (primaryError) {
        // Cleanup must never replace the error explaining why a save failed.
        primaryError.cleanupFsCode = error.fsCode ?? error.code;
      } else if (!this.warnings.some(warning => warning.code === 'CLEANUP_PENDING')) {
        this.warnings.push({ code: 'CLEANUP_PENDING', message: 'Changes were saved. A temporary backup is still in use; cleanup will be retried.', fsCode: error.fsCode ?? error.code });
      }
    }
  }

  writeAtomic(path, bytes, mode, beforeCommit) {
    return atomicWrite(path, bytes, mode, this.fileOps, beforeCommit, this.cleanup.bind(this));
  }

  rememberAtomicTemp(path) { this.cleanupTasks.set(path, { force: true }); }

  async assertEntryUnchanged(entry, temporaryPath) {
    await assertSafePath(entry.entryPath, entry.root.path);
    const excluded = new Set(this.cleanupTasks.keys());
    if (temporaryPath) excluded.add(resolve(temporaryPath));
    const files = entry.bundle
      ? await readTree(entry.entryPath, '', { bytes: 0, count: 0 }, excluded, path => this.rememberAtomicTemp(path))
      : [{ path: basename(entry.filePath), base64: (await readSafe(entry.filePath)).toString('base64'), mode: normalizeFileMode((await lstat(entry.filePath)).mode) }];
    this.checkHash({ hash: entryHash(files) }, entry.hash);
  }

  async assertDestinationFree(path, root) {
    await assertSafePath(path, root);
    if (await exists(path)) fail('CONFLICT', 'The destination was created by another process.');
  }

  async commitReplacement(entry, target, stage) {
    const old = join(entry.root.path, `.dsh-studio-old-${randomUUID()}`);
    await this.fileOps.rename(entry.entryPath, old, { beforeAttempt: () => this.assertEntryUnchanged(entry) });
    try {
      await this.fileOps.rename(stage, target, { beforeAttempt: () => this.assertDestinationFree(target, entry.root.path) });
    } catch (primaryError) {
      try {
        await this.fileOps.rename(old, entry.entryPath, { beforeAttempt: () => this.assertDestinationFree(entry.entryPath, entry.root.path) });
      } catch (rollbackError) {
        const error = new Error(`The replacement could not finish or roll back. Original files are preserved in ${old}. Restore from change history or retry after closing programs using these files.`, { cause: primaryError });
        error.code = 'RECOVERY_REQUIRED';
        error.fsCode = rollbackError.fsCode ?? rollbackError.code;
        error.recoveryPath = old;
        error.preserveStage = true;
        throw error;
      }
      throw primaryError;
    }
    await this.cleanup(old, { recursive: entry.bundle, force: true });
  }

  async roots() {
    const roots = await this.getRoots();
    const seen = new Set();
    return roots.filter((r) => {
      if (!r || typeof r.id !== 'string' || typeof r.path !== 'string') return false;
      const key = process.platform === 'win32' ? resolve(r.path).toLowerCase() : resolve(r.path);
      if (seen.has(key)) return false;
      seen.add(key); return true;
    }).map((r) => ({ ...r, path: resolve(r.path), rank: Number.isFinite(r.rank) ? r.rank : 1000, writable: r.writable === true }));
  }

  async sourceIndex() {
    const path = join(this.stateDir, 'sources.json');
    if (!await exists(path)) return {};
    await assertSafePath(path);
    try { return JSON.parse((await readSafe(path)).toString('utf8')); }
    catch (e) { if (e.code === 'SYMLINK') throw e; fail('INVALID_STATE', 'The skill source index is damaged.'); }
  }

  async setSource(id, source, installedHash, installedContentHash) {
    await this.initState();
    const index = await this.sourceIndex();
    if (source) index[id] = { ...source, installedHash, ...(installedContentHash ? { installedContentHash } : {}) };
    else delete index[id];
    await this.writeAtomic(join(this.stateDir, 'sources.json'), JSON.stringify(index));
  }

  async entries() {
    const roots = await this.roots();
    const sources = await this.sourceIndex();
    const entries = [];
    const rootErrors = [];
    for (const root of roots) {
      try {
        await assertSafePath(root.path);
        if (!await exists(root.path)) continue;
        for (const row of await readdir(root.path, { withFileTypes: true })) {
          if (row.name.startsWith('.')) continue;
          const entryPath = join(root.path, row.name);
          if (row.isSymbolicLink()) { rootErrors.push({ rootId: root.id, code: 'SYMLINK', path: entryPath }); continue; }
          if (row.isDirectory()) {
            const active = join(entryPath, 'SKILL.md');
            const disabled = `${active}${DISABLED}`;
            if (await exists(active)) entries.push({ root, entryPath, filePath: active, relative: row.name, bundle: true, enabled: true, duplicateInstruction: !!await exists(disabled) });
            else if (await exists(disabled)) entries.push({ root, entryPath, filePath: disabled, relative: row.name, bundle: true, enabled: false });
          } else if (row.isFile() && /\.md(?:\.disabled)?$/.test(row.name)) {
            if (row.name.endsWith(DISABLED) && await exists(entryPath.slice(0, -DISABLED.length))) continue;
            entries.push({ root, entryPath, filePath: entryPath, relative: row.name, bundle: false, enabled: !row.name.endsWith(DISABLED), duplicateInstruction: !row.name.endsWith(DISABLED) && !!await exists(`${entryPath}${DISABLED}`) });
          }
        }
      } catch (e) { rootErrors.push({ rootId: root.id, code: e.code || 'READ_FAILED', message: e.message }); }
    }
    const summaries = [];
    for (const entry of entries) {
      entry.id = hash(`${entry.root.id}\0${entry.filePath.replace(/\.disabled$/, '')}`).slice(0, 24);
      try {
        entry.files = entry.bundle ? await readTree(entry.entryPath, '', { bytes: 0, count: 0 }, new Set(this.cleanupTasks.keys()), path => this.rememberAtomicTemp(path)) : [{ path: basename(entry.filePath), base64: (await readSafe(entry.filePath)).toString('base64'), mode: normalizeFileMode((await lstat(entry.filePath)).mode) }];
        for (const file of entry.files) file.size ??= Buffer.from(file.base64, 'base64').length;
        entry.text = entry.bundle ? textOf(entry.files.find((f) => f.path === basename(entry.filePath))) : textOf(entry.files[0]);
        entry.parsed = validateSkill(entry.text);
        entry.hash = entryHash(entry.files);
      } catch (e) {
        entry.files = [];
        entry.text = '';
        entry.parsed = { metadata: {}, issues: [issue(e.code || 'READ_FAILED', e.message)], modelInvocable: false, userInvocable: false, valid: false };
        entry.unsafe = true;
        entry.hash = '';
      }
      const metadata = entry.parsed.metadata;
      if (entry.duplicateInstruction) entry.parsed.issues.push(issue('DUPLICATE_INSTRUCTION', 'Both enabled and disabled instruction files exist.', 'warning'));
      const fallback = entry.bundle ? basename(entry.entryPath) : basename(entry.filePath).replace(/\.md(?:\.disabled)?$/, '');
      const summary = {
        id: entry.id, rootId: entry.root.id, name: typeof metadata.name === 'string' ? metadata.name : fallback,
        description: typeof metadata.description === 'string' ? metadata.description : '', enabled: entry.enabled,
        readOnly: !entry.root.writable || !!entry.unsafe, source: entry.root.source, path: entry.filePath,
        hash: entry.hash, issues: entry.parsed.issues, valid: entry.parsed.valid, modelInvocable: entry.parsed.modelInvocable,
        userInvocable: entry.parsed.userInvocable,
        tags: Array.isArray(metadata.metadata?.tags) ? metadata.metadata.tags.filter((x) => typeof x === 'string') : [],
        fileCount: entry.files.length, bytes: entry.files.reduce((sum, f) => sum + f.size, 0),
      };
      if (sources[entry.id]) summary.sourceInfo = { ...sources[entry.id], modified: sources[entry.id].installedContentHash ? contentHash(entry.files) !== sources[entry.id].installedContentHash : entry.hash !== sources[entry.id].installedHash };
      entry.summary = summary;
      summaries.push(summary);
    }
    // Lowest rank wins, exactly as the local provider. Invalid or disabled entries cannot shadow.
    const winners = new Map();
    for (const entry of entries.slice().sort((a, b) => a.root.rank - b.root.rank || a.filePath.localeCompare(b.filePath))) {
      if (!entry.enabled || entry.parsed.issues.some((i) => i.severity === 'error')) continue;
      if (winners.has(entry.summary.name)) entry.summary.shadowedBy = winners.get(entry.summary.name);
      else winners.set(entry.summary.name, entry.id);
    }
    for (const entry of entries) entry.summary.effective = entry.enabled && entry.parsed.valid && !entry.summary.shadowedBy;
    return { roots, entries, skills: summaries.sort((a, b) => a.name.localeCompare(b.name)), rootErrors };
  }

  async list() {
    const result = await this.entries();
    return { roots: result.roots, skills: result.skills, rootErrors: result.rootErrors, historyCount: (await this.history()).entries.length };
  }

  async find(id, writable = false) {
    if (typeof id !== 'string') fail('INVALID_REQUEST', 'A skill id is required.');
    const entry = (await this.entries()).entries.find((e) => e.id === id);
    if (!entry) fail('NOT_FOUND', 'This skill no longer exists. Refresh the catalog.');
    if (writable && entry.summary.readOnly) fail('READ_ONLY', 'This skill is read-only. Copy it to a writable root first.');
    return entry;
  }

  async targetRoot(rootId) {
    const root = (await this.roots()).find((r) => r.id === rootId);
    if (!root) fail('ROOT_NOT_FOUND', 'Select a managed skill root.');
    if (!root.writable) fail('READ_ONLY', 'This skill root is read-only.');
    await assertSafePath(root.path);
    return root;
  }

  async read({ id }) {
    const entry = await this.find(id);
    return { skill: entry.summary, files: entry.files, text: entry.text, hash: entry.hash };
  }

  validateWrite(text) {
    const parsed = validateSkill(text);
    if (parsed.issues.some((i) => i.severity === 'error')) fail('INVALID_SKILL', parsed.issues.filter((i) => i.severity === 'error').map((i) => i.message).join(' '));
    return parsed;
  }

  async assertNoConflict(root, name, excludedId) {
    const found = (await this.entries()).entries.find((e) => e.root.id === root.id && e.id !== excludedId && e.summary.name.toLowerCase() === name.toLowerCase());
    if (found) fail('CONFLICT', `A skill named ${name} already exists in this root.`);
    // Also reserve physical names, even if the existing directory is not a valid skill.
    if (!excludedId && (await exists(join(root.path, name)) || await exists(join(root.path, `${name}.md`)) || await exists(join(root.path, `${name}.md.disabled`)))) fail('CONFLICT', `The destination ${name} already exists.`);
  }

  async snapshot(entry, action, extra = {}) {
    await this.initState();
    const record = {
      format: 1, id: randomUUID(), date: new Date().toISOString(), name: entry.summary.name,
      action, rootId: entry.root.id, relative: entry.relative, bundle: entry.bundle,
      enabled: entry.enabled, files: entry.files, sourceInfo: entry.summary.sourceInfo, ...extra,
    };
    await this.writeAtomic(join(this.stateDir, 'history', `${record.id}.json`), JSON.stringify(record));
    return record.id;
  }

  async create({ rootId, name, description, text }) {
    if (text === undefined) {
      if (typeof name !== 'string' || !NAME.test(name)) fail('INVALID_NAME', 'Use a lowercase kebab-case skill name.');
      if (typeof description !== 'string' || !description.trim()) fail('MISSING_DESCRIPTION', 'A description is required.');
      text = `---\n${stringify({ name, description: description.trim() })}---\n\n# ${name}\n\nDescribe the workflow, inputs, and expected output here.\n`;
    }
    const parsed = this.validateWrite(text);
    const root = await this.targetRoot(rootId);
    await this.assertNoConflict(root, parsed.metadata.name);
    const files = [{ path: 'SKILL.md', base64: Buffer.from(text).toString('base64'), size: Buffer.byteLength(text) }];
    await this.installFiles(root, parsed.metadata.name, files);
    return { created: parsed.metadata.name, ...(await this.readByPath(root.id, join(root.path, parsed.metadata.name, 'SKILL.md'))) };
  }

  async readByPath(rootId, filePath) {
    return this.read({ id: hash(`${rootId}\0${filePath.replace(/\.disabled$/, '')}`).slice(0, 24) });
  }

  checkHash(entry, expectedHash) {
    if (typeof expectedHash !== 'string' || expectedHash !== entry.hash) fail('STALE_WRITE', 'The skill changed after you opened it. Reload before saving.');
  }

  async save({ id, text, expectedHash }) {
    const entry = await this.find(id, true);
    this.checkHash(entry, expectedHash);
    const parsed = this.validateWrite(text);
    await this.assertNoConflict(entry.root, parsed.metadata.name, entry.id);
    const historyId = await this.snapshot(entry, 'save');
    await this.writeAtomic(entry.filePath, text, normalizeFileMode((await lstat(entry.filePath)).mode), temp => this.assertEntryUnchanged(entry, temp));
    return { ...(await this.read({ id })), historyId };
  }

  /** Set the two independent invocation controls without touching instruction bytes. */
  async setPolicy({ id, modelInvocable, userInvocable, expectedHash }) {
    if (typeof modelInvocable !== 'boolean' || typeof userInvocable !== 'boolean') fail('INVALID_REQUEST', 'Both invocation controls must be booleans.');
    const entry = await this.find(id, true);
    this.checkHash(entry, expectedHash);
    const parts = frontmatterParts(entry.text);
    if (!parts) fail('INVALID_SKILL', 'Repair the YAML frontmatter before saving invocation settings.');
    const doc = parseDocument(entry.text.slice(parts.start, parts.end), { uniqueKeys: true });
    let originalMetadata;
    try { originalMetadata = doc.toJS({ maxAliasCount: 20 }); }
    catch { fail('INVALID_SKILL', 'Repair the YAML frontmatter before saving invocation settings.'); }
    if (doc.errors.length || !doc.contents || !doc.contents.items || Array.isArray(originalMetadata)) fail('INVALID_SKILL', 'Repair the YAML frontmatter before saving invocation settings.');
    doc.set('disable-model-invocation', !modelInvocable);
    doc.set('user-invocable', userInvocable);
    const yaml = doc.toString({ lineWidth: 0 }).replace(/\r?\n/g, parts.newline);
    const text = entry.text.slice(0, parts.start) + yaml + entry.text.slice(parts.end);
    const parsed = this.validateWrite(text);
    const withoutPolicy = metadata => Object.fromEntries(Object.entries(metadata).filter(([key]) => !['disable-model-invocation', 'user-invocable'].includes(key)));
    if (!isDeepStrictEqual(withoutPolicy(originalMetadata), withoutPolicy(parsed.metadata))) fail('POLICY_ALIAS', 'Shared YAML anchors would change other metadata. Edit those anchors before saving invocation settings.');
    await this.assertNoConflict(entry.root, parsed.metadata.name, entry.id);
    if (text === entry.text) return await this.read({ id });
    const historyId = await this.snapshot(entry, 'setPolicy');
    await this.writeAtomic(entry.filePath, text, normalizeFileMode((await lstat(entry.filePath)).mode), temp => this.assertEntryUnchanged(entry, temp));
    return { ...(await this.read({ id })), historyId };
  }

  /** Manage arbitrary regular resources while keeping the complete bundle recoverable. */
  async saveFile({ id, path, base64, expectedHash, mode }) {
    const entry = await this.find(id, true);
    this.checkHash(entry, expectedHash);
    path = normalizeArchivePath(path);
    if (!entry.bundle) fail('NOT_BUNDLE', 'Resource files require a directory skill.');
    if (path === 'SKILL.md' || path === 'SKILL.md.disabled') fail('USE_SAVE', 'Use the skill editor to edit SKILL.md.');
    const files = decodeUpload({ files: [{ path, base64 }] });
    const target = join(entry.entryPath, path);
    await assertSafePath(target, entry.entryPath);
    const historyId = await this.snapshot(entry, 'saveFile');
    const previous = await exists(target);
    await this.writeAtomic(target, Buffer.from(files[0].base64, 'base64'), normalizeFileMode(mode ?? previous?.mode), temp => this.assertEntryUnchanged(entry, temp));
    return { ...(await this.read({ id })), historyId };
  }

  async deleteFile({ id, path, expectedHash }) {
    const entry = await this.find(id, true);
    this.checkHash(entry, expectedHash);
    path = normalizeArchivePath(path);
    if (!entry.bundle) fail('NOT_BUNDLE', 'Resource files require a directory skill.');
    if (path === 'SKILL.md' || path === 'SKILL.md.disabled') fail('USE_SAVE', 'Delete the skill to remove its instruction file.');
    const target = join(entry.entryPath, path);
    await assertSafePath(target, entry.entryPath);
    const info = await exists(target);
    if (!info) fail('NOT_FOUND', 'The resource no longer exists.');
    if (!info.isFile()) fail('UNSAFE_PATH', 'Select a regular resource file.');
    const historyId = await this.snapshot(entry, 'deleteFile');
    const removed = join(entry.root.path, `.dsh-studio-deleted-${randomUUID()}`);
    await this.fileOps.rename(target, removed, { beforeAttempt: () => this.assertEntryUnchanged(entry) });
    await this.cleanup(removed, { force: true });
    return { ...(await this.read({ id })), historyId };
  }

  async toggle({ id, enabled }) {
    if (typeof enabled !== 'boolean') fail('INVALID_REQUEST', 'enabled must be boolean.');
    const entry = await this.find(id, true);
    if (entry.enabled === enabled) return { skill: entry.summary };
    if (enabled) this.validateWrite(entry.text);
    const destination = enabled ? entry.filePath.slice(0, -DISABLED.length) : `${entry.filePath}${DISABLED}`;
    if (await exists(destination)) fail('CONFLICT', 'Both enabled and disabled instruction files exist. Resolve the conflict first.');
    const historyId = await this.snapshot(entry, 'toggle');
    await assertSafePath(entry.filePath, entry.root.path);
    await assertSafePath(destination, entry.root.path);
    await this.fileOps.rename(entry.filePath, destination, { beforeAttempt: async () => {
      await this.assertEntryUnchanged(entry);
      await this.assertDestinationFree(destination, entry.root.path);
    } });
    return { ...(await this.read({ id })), historyId };
  }

  async delete({ id }) {
    const entry = await this.find(id, true);
    if (entry.duplicateInstruction && !entry.bundle) fail('CONFLICT', 'Both enabled and disabled flat files exist. Resolve the duplicate before deleting.');
    const historyId = await this.snapshot(entry, 'delete');
    await assertSafePath(entry.entryPath, entry.root.path);
    const removed = join(entry.root.path, `.dsh-studio-deleted-${randomUUID()}`);
    await this.fileOps.rename(entry.entryPath, removed, { beforeAttempt: () => this.assertEntryUnchanged(entry) });
    await this.cleanup(removed, { recursive: entry.bundle, force: true });
    return { deleted: entry.summary.name, historyId };
  }

  async history() {
    const path = join(this.stateDir, 'history');
    await assertSafePath(path);
    if (!await exists(path)) return { entries: [] };
    const entries = [];
    for (const row of await readdir(path, { withFileTypes: true })) {
      if (!row.isFile() || !/^[0-9a-f-]{36}\.json$/i.test(row.name)) continue;
      try {
        const item = checkedBackup(JSON.parse((await readSafe(join(path, row.name), 48 * 1024 * 1024)).toString('utf8')), row.name.slice(0, -5));
        entries.push({ id: item.id, name: item.name, action: item.action, date: item.date, rootId: item.rootId });
      } catch { /* A damaged history file does not hide other recoverable versions. */ }
    }
    return { entries: entries.sort((a, b) => b.date.localeCompare(a.date)) };
  }

  async restore({ historyId }) {
    if (typeof historyId !== 'string' || !/^[0-9a-f-]{36}$/i.test(historyId)) fail('INVALID_REQUEST', 'Invalid history id.');
    const recordPath = join(this.stateDir, 'history', `${historyId}.json`);
    if (!await exists(recordPath)) fail('NOT_FOUND', 'The selected backup no longer exists.');
    let decoded;
    try { decoded = JSON.parse((await readSafe(recordPath, 48 * 1024 * 1024)).toString('utf8')); }
    catch { fail('INVALID_BACKUP', 'The selected backup cannot be read.'); }
    const record = checkedBackup(decoded, historyId);
    const root = await this.targetRoot(record.rootId);
    const rel = record.relative;
    const files = record.files;
    const target = join(root.path, rel);
    await assertSafePath(target, root.path);
    const current = (await this.entries()).entries.find((e) => e.entryPath === target || !record.bundle && e.filePath.replace(/\.disabled$/, '') === target.replace(/\.disabled$/, ''));
    if (NAME.test(record.name)) await this.assertNoConflict(root, record.name, current?.id);
    if (current) {
      if (current.summary.readOnly) fail('READ_ONLY', 'The current skill cannot be replaced.');
      // A same-name skill at another physical location must never be overwritten implicitly.
      await this.snapshot(current, 'restore');
    } else if (await exists(target)) fail('CONFLICT', 'An unrelated destination already exists.');
    const stage = join(root.path, `.dsh-studio-${randomUUID()}`);
    await mkdir(root.path, { recursive: true });
    let failure;
    try {
      if (record.bundle) {
        await mkdir(stage, { recursive: false });
        for (const file of files) await this.writeAtomic(join(stage, file.path), Buffer.from(file.base64, 'base64'), normalizeFileMode(file.mode));
      } else {
        if (files.length !== 1) fail('INVALID_BACKUP', 'Invalid flat skill backup.');
        await this.writeAtomic(stage, Buffer.from(files[0].base64, 'base64'), normalizeFileMode(files[0].mode));
      }
      if (current) {
        await this.commitReplacement(current, target, stage);
      } else await this.fileOps.rename(stage, target, { beforeAttempt: () => this.assertDestinationFree(target, root.path) });
    } catch (error) { failure = error; throw error; }
    finally { if (!failure?.preserveStage) await this.cleanup(stage, { recursive: true, force: true }, failure); }
    const restoredFile = record.bundle ? join(target, instructionFile(files)?.path ?? 'SKILL.md') : target;
    const restoredId = hash(`${root.id}\0${restoredFile.replace(/\.disabled$/, '')}`).slice(0, 24);
    await this.setSource(restoredId, record.sourceInfo, record.sourceInfo?.installedHash, record.sourceInfo?.installedContentHash);
    return { restored: record.name, ...(await this.read({ id: restoredId })) };
  }

  async export({ ids } = {}) {
    if (ids !== undefined && (!Array.isArray(ids) || ids.some(id => typeof id !== 'string') || new Set(ids).size !== ids.length)) fail('INVALID_REQUEST', 'ids must be an array of unique skill identifiers.');
    const result = await this.entries();
    if (ids?.some(id => !result.entries.some(entry => entry.id === id))) fail('NOT_FOUND', 'A selected skill no longer exists. Refresh before exporting.');
    const selected = ids === undefined ? result.entries : result.entries.filter((e) => ids.includes(e.id));
    if (!selected.length) fail('EMPTY_SELECTION', 'Select at least one skill to export.');
    const files = [];
    const names = new Map();
    for (const entry of selected) {
      if (entry.unsafe) fail('READ_FAILED', 'A selected skill cannot be safely read.');
      const key = NAME.test(entry.summary.name) ? entry.summary.name : `invalid-${entry.id}`;
      const count = (names.get(key) || 0) + 1;
      names.set(key, count);
      const folder = count === 1 ? key : `${key}--${count}`;
      if (entry.bundle) files.push(...entry.files.map((file) => ({ ...file, path: `${folder}/${file.path}` })));
      else files.push({ ...entry.files[0], path: `${folder}/${entry.enabled ? 'SKILL.md' : 'SKILL.md.disabled'}` });
    }
    return { filename: `dsh-skills-${new Date().toISOString().slice(0, 10)}.zip`, base64: encodeZip(files), count: selected.length };
  }

  async previewImport({ rootId, files, zipBase64, source, replaceId, expectedHash }) {
    const root = await this.targetRoot(rootId);
    const uploads = decodeUpload({ files, zipBase64 });
    const skillFiles = uploads.filter((f) => /(^|\/)SKILL\.md(?:\.disabled)?$/.test(f.path));
    const groups = [];
    for (const instruction of skillFiles) {
      const prefix = instruction.path.includes('/') ? instruction.path.slice(0, instruction.path.lastIndexOf('/') + 1) : '';
      if (skillFiles.some((other) => other !== instruction && other.path.startsWith(prefix) && (other.path.slice(prefix.length).includes('/')))) fail('NESTED_SKILLS', 'Nested skill bundles overlap. Import each bundle separately.');
      const bundle = uploads.filter((f) => f.path.startsWith(prefix)).map((f) => ({ ...f, path: f.path.slice(prefix.length) }));
      const parsed = validateSkill(textOf(instruction));
      if (bundle.some((f) => f !== instruction && f.path === (instruction.path.endsWith(DISABLED) ? 'SKILL.md' : 'SKILL.md.disabled'))) parsed.issues.push(issue('DUPLICATE_INSTRUCTION', 'The bundle contains both enabled and disabled instruction files.'));
      const name = typeof parsed.metadata.name === 'string' ? parsed.metadata.name : basename(prefix.replace(/\/$/, '')) || 'invalid-skill';
      groups.push({ name, description: typeof parsed.metadata.description === 'string' ? parsed.metadata.description : '', files: bundle, issues: parsed.issues, valid: !parsed.issues.some(i => i.severity === 'error'), modelInvocable: parsed.modelInvocable, userInvocable: parsed.userInvocable, enabled: instruction.path.endsWith('/SKILL.md') || instruction.path === 'SKILL.md' });
    }
    // A standalone Markdown skill is accepted; resource Markdown under an identified bundle is not a separate skill.
    for (const file of uploads) {
      if (!/\.md(?:\.disabled)?$/.test(file.path) || skillFiles.some((s) => {
        const prefix = s.path.includes('/') ? s.path.slice(0, s.path.lastIndexOf('/') + 1) : '';
        return file.path.startsWith(prefix);
      })) continue;
      const parsed = validateSkill(textOf(file));
      if (typeof parsed.metadata.name !== 'string') continue;
      groups.push({ name: parsed.metadata.name, description: typeof parsed.metadata.description === 'string' ? parsed.metadata.description : '', files: [{ ...file, path: file.path.endsWith(DISABLED) ? 'SKILL.md.disabled' : 'SKILL.md' }], issues: parsed.issues, valid: parsed.valid, modelInvocable: parsed.modelInvocable, userInvocable: parsed.userInvocable, enabled: !file.path.endsWith(DISABLED) });
    }
    if (!groups.length) fail('NO_SKILLS', 'No SKILL.md or valid standalone Markdown skills were found.');
    let replacement;
    if (replaceId !== undefined) {
      replacement = await this.find(replaceId, true);
      this.checkHash(replacement, expectedHash);
      if (replacement.root.id !== rootId) fail('INVALID_REQUEST', 'Updates must target the original root.');
      if (!replacement.bundle) fail('NOT_BUNDLE', 'Copy a flat skill to a directory bundle before updating from GitHub.');
      if (groups.length !== 1 || groups[0].name !== replacement.summary.name) fail('NAME_MISMATCH', 'An update must contain exactly the same skill name.');
    }
    const known = (await this.entries()).entries.filter((e) => e.root.id === rootId && e.id !== replaceId).map((e) => e.summary.name.toLowerCase());
    const seen = new Set();
    for (const group of groups) {
      group.conflict = known.includes(String(group.name).toLowerCase()) || seen.has(String(group.name).toLowerCase());
      seen.add(String(group.name).toLowerCase());
      if (!replacement && NAME.test(String(group.name)) && (await exists(join(root.path, group.name)) || await exists(join(root.path, `${group.name}.md`)) || await exists(join(root.path, `${group.name}.md.disabled`)))) group.conflict = true;
    }
    const token = randomUUID();
    for (const [key, value] of this.previews) if (value.expires < Date.now()) this.previews.delete(key);
    while (this.previews.size >= 20) this.previews.delete(this.previews.keys().next().value);
    // Preserve only plain JSON source metadata; no filesystem paths or executable hooks are accepted.
    const sourceInfo = source === undefined ? undefined : JSON.parse(JSON.stringify(source));
    this.previews.set(token, { rootId, groups, source: sourceInfo, replaceId, expectedHash, expires: Date.now() + 10 * 60 * 1000 });
    return { token, skills: groups.map(({ files: bundle, ...group }) => ({ ...group, text: textOf(instructionFile(bundle)), files: bundle.map(f => ({ path: f.path, size: f.size })) })), fileCount: uploads.length, bytes: uploads.reduce((s, f) => s + f.size, 0), ...(sourceInfo ? { source: sourceInfo } : {}), ...(replacement ? { replacement: replacement.summary, previousFiles: replacement.files.map((f) => ({ path: f.path, size: f.size })) } : {}) };
  }

  async installFiles(root, name, files) {
    if (!NAME.test(name)) fail('INVALID_NAME', 'Invalid skill name.');
    await this.assertNoConflict(root, name);
    const target = join(root.path, name);
    await mkdir(root.path, { recursive: true });
    await assertSafePath(root.path);
    const stage = join(root.path, `.dsh-studio-${randomUUID()}`);
    let failure;
    try {
      await mkdir(stage, { recursive: false });
      for (const file of files) {
        const safe = normalizeArchivePath(file.path);
        await this.writeAtomic(join(stage, safe), Buffer.from(file.base64, 'base64'), normalizeFileMode(file.mode));
      }
      if (await exists(target)) fail('CONFLICT', 'The destination was created by another process.');
      await this.fileOps.rename(stage, target, { beforeAttempt: () => this.assertDestinationFree(target, root.path) });
    } catch (error) { failure = error; throw error; }
    finally { await this.cleanup(stage, { recursive: true, force: true }, failure); }
  }

  async applyImport({ token }) {
    const preview = this.previews.get(token);
    if (!preview || preview.expires < Date.now()) fail('PREVIEW_EXPIRED', 'Preview expired. Choose the files again.');
    const root = await this.targetRoot(preview.rootId);
    const accepted = preview.groups.filter((g) => !g.conflict && !g.issues.some((i) => i.severity === 'error'));
    let replacement;
    if (preview.replaceId) {
      replacement = await this.find(preview.replaceId, true);
      this.checkHash(replacement, preview.expectedHash);
    }
    for (const group of accepted) await this.assertNoConflict(root, group.name, replacement?.id);
    const added = [];
    const skipped = preview.groups.filter((g) => !accepted.includes(g)).map((g) => ({ name: g.name, reason: g.conflict ? 'CONFLICT' : 'INVALID_SKILL' }));
    for (const group of accepted) {
      let files = group.files;
      if (replacement) {
        const instruction = instructionFile(files);
        files = files.map((f) => f === instruction ? { ...f, path: replacement.enabled ? 'SKILL.md' : 'SKILL.md.disabled' } : f);
        const historyId = await this.snapshot(replacement, 'update');
        await this.replaceBundle(replacement, files);
        const updated = await this.find(replacement.id);
        if (preview.source) await this.setSource(updated.id, preview.source, updated.hash, contentHash(updated.files));
        added.push({ name: group.name, updated: true, historyId });
      } else {
        await this.installFiles(root, group.name, files);
        const instruction = instructionFile(files);
        const installed = await this.find(hash(`${root.id}\0${join(root.path, group.name, instruction.path).replace(/\.disabled$/, '')}`).slice(0, 24));
        if (preview.source) await this.setSource(installed.id, preview.source, installed.hash, contentHash(installed.files));
        added.push({ name: group.name });
      }
    }
    this.previews.delete(token);
    return { added, skipped };
  }

  async replaceBundle(entry, files) {
    const stage = join(entry.root.path, `.dsh-studio-${randomUUID()}`);
    await assertSafePath(entry.entryPath, entry.root.path);
    let failure;
    try {
      await mkdir(stage, { recursive: false });
      for (const file of files) await this.writeAtomic(join(stage, normalizeArchivePath(file.path)), Buffer.from(file.base64, 'base64'), normalizeFileMode(file.mode));
      await this.commitReplacement(entry, entry.entryPath, stage);
    } catch (error) { failure = error; throw error; }
    finally { if (!failure?.preserveStage) await this.cleanup(stage, { recursive: true, force: true }, failure); }
  }

  async copy({ id, rootId }) {
    const entry = await this.find(id);
    if (entry.unsafe) fail('READ_FAILED', 'The source cannot be safely read.');
    const root = await this.targetRoot(rootId);
    const files = entry.bundle ? entry.files : [{ ...entry.files[0], path: entry.enabled ? 'SKILL.md' : 'SKILL.md.disabled' }];
    this.validateWrite(entry.text);
    await this.installFiles(root, entry.summary.name, files);
    return { copied: entry.summary.name };
  }
}
