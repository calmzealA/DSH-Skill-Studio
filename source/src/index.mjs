import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import { homedir } from 'node:os';
import { resolve, join, relative, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { SkillManager } from './manager.mjs';
import { ContextResolver } from './context.mjs';
import { githubFiles, checkGithubUpdate } from './github.mjs';
import { manifest, PACKAGE } from './wire.mjs';

export const name = PACKAGE;
export const inject = ['typert', 'skills', 'sessions'];
const hash = text => createHash('sha256').update(text).digest('hex');
const MUTATIONS = new Set(['create', 'save', 'setPolicy', 'saveFile', 'deleteFile', 'toggle', 'delete', 'restore', 'applyImport', 'copy', 'batchToggle']);
const errorOf = error => ({ code: error.code ?? 'OPERATION_FAILED', message: String(error.message ?? error).slice(0, 1200), ...(typeof error.fsCode === 'string' ? { fsCode: error.fsCode.slice(0, 80) } : {}), ...(typeof error.recoveryPath === 'string' ? { recoveryPath: error.recoveryPath.slice(0, 1200) } : {}) });
const fail = (code, message) => { throw Object.assign(new Error(message), { code }); };
const pathKey = path => { const value = resolve(path); return process.platform === 'win32' ? value.toLowerCase() : value; };
const samePath = (a, b) => typeof a === 'string' && typeof b === 'string' && pathKey(a) === pathKey(b);
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
function homePath(value, fallback) {
  const path = value?.trim() || fallback;
  return path === '~' ? homedir() : path.startsWith('~/') || path.startsWith('~\\') ? join(homedir(), path.slice(2)) : resolve(path);
}
function viewKey(view) { return `${view.context.workspaceId}:${view.context.presetId}:${view.context.sessionId}`; }
function runtimeState(skill, snapshot, view) {
  const winner = snapshot?.skills.find(row => row.name === skill.name);
  const match = skill.id.startsWith('provider:') ? winner?.provider === skill.provider : samePath(winner?.path, skill.path);
  let status = !skill.enabled ? 'disabled' : skill.valid === false ? 'invalid'
    : view.context.complete === false ? 'unknown' : match ? 'available'
    : winner ? 'shadowed' : snapshot?.complete && view.context.complete !== false ? 'not_in_preset' : 'unknown';
  if (match && !skill.readOnly && (winner.invocation.modelInvocable !== skill.modelInvocable || winner.invocation.userInvocable !== skill.userInvocable)) status = 'unknown';
  if (status === 'available' && !winner.invocation.modelInvocable && !winner.invocation.userInvocable) status = 'invocation_disabled';
  return { status, automatic: status === 'available' && winner.invocation.modelInvocable, manual: status === 'available' && winner.invocation.userInvocable, presetId: view.context.presetId, ...(winner?.path && !match ? { winnerPath: winner.path } : {}) };
}

/** A current-mode catalogue is a projection of the actual winning registry rows,
 * never a count of enabled files in the skill library. Unresolved discovery or
 * policy changes leave totals unknown while preserving confirmed entries. */
function modeCatalog(snapshot, view, skills) {
  const catalog = { complete: snapshot.complete === true && view.context.complete !== false, availableIds: [], automaticIds: [], manualIds: [], registeredIds: [] };
  for (const entry of snapshot.skills) {
    const skill = skills.find(row => !row.id.startsWith('provider:') && row.name === entry.name && samePath(row.path, entry.path))
      ?? skills.find(row => row.id.startsWith('provider:') && row.name === entry.name && row.provider === entry.provider);
    if (!skill || !['available', 'invocation_disabled'].includes(skill.availability?.status)) {
      catalog.complete = false;
      continue;
    }
    catalog.registeredIds.push(skill.id);
    if (skill.availability.status !== 'available') continue;
    catalog.availableIds.push(skill.id);
    if (entry.invocation.modelInvocable) catalog.automaticIds.push(skill.id);
    if (entry.invocation.userInvocable) catalog.manualIds.push(skill.id);
  }
  catalog.counts = Object.fromEntries(['available', 'automatic', 'manual', 'registered'].map(key => [key, catalog.complete ? catalog[`${key}Ids`].length : null]));
  return catalog;
}

export class StudioGateway extends TypertRemoteService {
  constructor(ctx, config = {}) {
    super(ctx, 'skillStudio');
    this.config = config;
    this.activeRoots = [];
    this.virtuals = new Map();
    this.queue = Promise.resolve();
    this.revision = 0;
    this.dshHome = homePath(config.dshHome ?? process.env.DSH_HOME, join(homedir(), '.dsh'));
    this.resolver = new ContextResolver(ctx, config);
    this.manager = new SkillManager({ stateDir: join(this.dshHome, 'skill-studio'), roots: async () => this.activeRoots });
  }
  request(payload) {
    const next = this.queue.then(() => this.perform(payload)).then(result => JSON.parse(JSON.stringify(result)));
    this.queue = next.catch(() => {});
    return next;
  }
  roots(view) {
    const result = [];
    const add = (path, source, rank, label, writable = true) => {
      path = resolve(path);
      if (!result.some(row => samePath(row.path, path))) result.push({ id: hash(path).slice(0, 20), path, source, rank, label, writable });
    };
    if (view.context.workspacePath) {
      add(join(view.context.workspacePath, '.dsh', 'skills'), 'project-dsh', 100, '.dsh');
      add(join(view.context.workspacePath, '.agents', 'skills'), 'project-agents', 200, '.agents');
    }
    for (const path of this.config.customSkillDirs ?? []) add(homePath(path, path), 'custom', 300, path);
    add(join(this.dshHome, 'skills'), 'user-dsh', 400, 'DSH');
    add(join(homePath(this.config.agentsHome ?? process.env.DSH_AGENTS_HOME, join(homedir(), '.agents')), 'skills'), 'user-agents', 500, 'Agents');
    return result;
  }
  async snapshot(view) {
    if (!view.registry?.snapshot) return { skills: [], complete: false };
    return view.registry.snapshot({ cwd: view.cwd, scope: view.scope });
  }
  async list(view) {
    const data = await this.manager.request({ action: 'list' });
    this.virtuals.clear();
    let snapshot;
    try { snapshot = await this.snapshot(view); }
    catch (error) { snapshot = { skills: [], complete: false }; data.registryError = String(error.message); }
    // Registry snapshots already resolve same-name providers. Keep that first
    // winner if an older/custom registry repeats a row, rather than double-count.
    const seenNames = new Set();
    snapshot = { ...snapshot, skills: snapshot.skills.filter(entry => !seenNames.has(entry.name) && seenNames.add(entry.name)) };
    data.complete = snapshot.complete && view.context.complete !== false;
    data.context = { ...view.context, complete: data.complete };
    for (const skill of data.skills) {
      skill.availability = runtimeState(skill, snapshot, view);
      skill.effective = skill.availability.status === 'available';
      const winner = snapshot.skills.find(row => row.name === skill.name);
      if (winner?.path && !samePath(winner.path, skill.path) && skill.enabled) skill.winnerPath = winner.path;
    }
    for (const entry of snapshot.skills) {
      if (data.skills.some(skill => !skill.id.startsWith('provider:') && samePath(skill.path, entry.path))) continue;
      // Managed project roots are intentionally hidden in user-only mode.
      if (view.context.workspaceId === 'user' && ['project-dsh', 'project-agents'].includes(entry.source)) continue;
      const skill = { id: `provider:${hash(`${viewKey(view)}:${entry.provider}:${entry.name}`).slice(0, 20)}`, rootId: 'providers', name: entry.name, description: entry.description, provider: entry.provider, enabled: true, valid: true, readOnly: true, source: entry.source, path: entry.path ?? entry.provider, hash: '', issues: [], modelInvocable: entry.invocation.modelInvocable, userInvocable: entry.invocation.userInvocable, effective: view.context.complete !== false };
      skill.availability = runtimeState(skill, snapshot, view);
      skill.effective = skill.availability.status === 'available';
      this.virtuals.set(skill.id, { skill, viewKey: viewKey(view) }); data.skills.push(skill);
    }
    if (this.virtuals.size) data.roots.push({ id: 'providers', path: '', source: 'bundled', label: 'Plugins', rank: 600, writable: false });
    data.skills.sort((a, b) => a.name.localeCompare(b.name));
    data.catalog = modeCatalog(snapshot, view, data.skills);
    data.revision = this.revision;
    return data;
  }
  async readVirtual(id, view) {
    const record = this.virtuals.get(id);
    if (!record || record.viewKey !== viewKey(view)) fail('NOT_FOUND', 'The selected view changed. Refresh the catalog.');
    const info = record.skill;
    const definition = await view.registry.get(info.name, { cwd: view.cwd, scope: view.scope });
    if (!definition) fail('NOT_FOUND', 'Skill is no longer available');
    const text = `---\nname: ${JSON.stringify(info.name)}\ndescription: ${JSON.stringify(info.description)}\ndisable-model-invocation: ${!definition.invocation.modelInvocable}\nuser-invocable: ${definition.invocation.userInvocable}\n${definition.whenToUse ? `whenToUse: ${JSON.stringify(definition.whenToUse)}\n` : ''}${definition.metadata ? `metadata: ${JSON.stringify(definition.metadata)}\n` : ''}---\n${definition.content}`;
    return { skill: info, text, hash: hash(text), resourceBase: definition.resourceBase, files: [{ path: 'SKILL.md', base64: Buffer.from(text).toString('base64'), size: Buffer.byteLength(text) }] };
  }
  async previewUpdate(payload) {
    const current = await this.manager.request({ action: 'read', id: payload.id });
    const source = current.skill.sourceInfo;
    if (!source || source.type !== 'github') fail('NO_SOURCE', 'This skill has no GitHub source');
    const next = await checkGithubUpdate(source);
    const data = await this.manager.request({ action: 'previewImport', rootId: current.skill.rootId, files: next.files, source: next.source, replaceId: payload.id, expectedHash: current.hash });
    const instruction = next.files.find(file => /(^|\/)SKILL\.md$/.test(file.path)) ?? next.files.find(file => file.path.endsWith('.md'));
    const fileRevision = file => `${file.base64}:${file.mode ?? 0o644}`;
    const oldFiles = new Map(current.files.map(file => [file.path.replace(/\.disabled$/, ''), fileRevision(file)]));
    const incomingFiles = new Map(next.files.map(file => [file.path, fileRevision(file)]));
    const changes = [...new Set([...oldFiles.keys(), ...incomingFiles.keys()])].map(path => ({ path, status: !oldFiles.has(path) ? 'added' : !incomingFiles.has(path) ? 'removed' : oldFiles.get(path) === incomingFiles.get(path) ? 'unchanged' : 'changed' }));
    return { ...data, source: next.source, previousCommit: source.commit, currentText: current.text, incomingText: instruction ? Buffer.from(instruction.base64, 'base64').toString('utf8') : '', changes, localModified: source.modified, unchanged: source.commit === next.source.commit };
  }
  async local(payload) {
    if (payload.action === 'previewGithub') {
      const { files, source } = await githubFiles(payload.url);
      const data = await this.manager.request({ action: 'previewImport', rootId: payload.rootId, files, source });
      return { ...data, source };
    }
    if (payload.action === 'previewUpdate') return this.previewUpdate(payload);
    if (payload.action === 'batchToggle') {
      if (!Array.isArray(payload.ids) || !payload.ids.length || payload.ids.length > 200 || typeof payload.enabled !== 'boolean') fail('INVALID_REQUEST', 'Choose up to 200 skills and a boolean enabled state.');
      const results = [];
      for (const id of new Set(payload.ids)) {
        try { await this.manager.request({ action: 'toggle', id, enabled: payload.enabled }); results.push({ id, success: true }); }
        catch (error) { results.push({ id, success: false, error: errorOf(error) }); }
      }
      return { results, changed: results.filter(row => row.success).length };
    }
    return this.manager.request(payload);
  }
  /** Wait for actual discovery, rather than invalidating a menu ahead of the watcher. */
  async settle(view, before, after) {
    if (view.context.complete === false) return { catalog: 'unknown' };
    const old = new Map(before.skills.map(skill => [skill.id, skill]));
    const next = new Map(after.skills.map(skill => [skill.id, skill]));
    const changed = [...new Set([...old.keys(), ...next.keys()])].filter(id => old.get(id)?.hash !== next.get(id)?.hash);
    if (!changed.length) return { catalog: 'verified' };
    let expectsFilesystem = false;
    try {
      const presets = this.ctx.get('agentPresets');
      if (view.scope?.ctx && typeof presets?.inspectCompositions === 'function') {
        // A live Agent may retain a different revision of this same preset id.
        expectsFilesystem = presets.inspectCompositions(view.scope.ctx).some(preset => preset.id === view.context.presetId && preset.modules.some(row => row.moduleName === '@deepseek-ai/dsh-skill-filesystem'));
      } else if (typeof presets?.compositionInventory === 'function') {
        // Cold leases refer to the current definition, not every retained revision.
        const inventory = await presets.compositionInventory();
        expectsFilesystem = inventory.some(preset => preset.id === view.context.presetId && preset.rows.some(row => row.moduleName === '@deepseek-ai/dsh-skill-filesystem' && row.enabled === true));
      } else {
        expectsFilesystem = presets?.inspectCompositions?.().some(preset => preset.id === view.context.presetId && preset.modules.some(row => row.moduleName === '@deepseek-ai/dsh-skill-filesystem')) ?? false;
      }
    } catch {
      // Older hosts or unavailable inventory keep the existing inspection fallback.
      try {
        expectsFilesystem = this.ctx.get('agentPresets')?.inspectCompositions?.().some(preset => preset.id === view.context.presetId && preset.modules.some(row => row.moduleName === '@deepseek-ai/dsh-skill-filesystem')) ?? false;
      } catch { /* Actual catalog observations below remain the authority. */ }
    }
    const relevant = skill => {
      if (!skill || !skill.source?.startsWith('project-')) return true;
      if (!view.context.workspacePath) return false;
      const rel = relative(view.context.workspacePath, skill.path);
      return rel !== '..' && !rel.startsWith(`..${sep}`);
    };
    const deadline = Date.now() + 1800;
    await delay(240);
    let latest;
    do {
      try { latest = await this.snapshot(view); }
      catch { return { catalog: 'unknown' }; }
      const localObserved = latest.skills.some(row => ['project-dsh', 'project-agents', 'user-dsh', 'user-agents'].includes(row.source));
      let matches = latest.complete;
      for (const id of changed) {
        const previous = old.get(id), desired = next.get(id);
        if (!relevant(desired ?? previous)) continue;
        if (!desired || !desired.enabled || desired.valid === false) {
          if (previous && latest.skills.some(row => samePath(row.path, previous.path))) matches = false;
          continue;
        }
        if (desired.shadowedBy) continue;
        const observed = latest.skills.find(row => samePath(row.path, desired.path));
        if (!observed) { if (expectsFilesystem || localObserved) matches = false; continue; }
        if (observed.name !== desired.name || observed.description !== desired.description || observed.invocation.modelInvocable !== desired.modelInvocable || observed.invocation.userInvocable !== desired.userInvocable) matches = false;
      }
      if (matches) return { catalog: 'verified' };
      await delay(60);
    } while (Date.now() < deadline);
    return { catalog: latest?.complete ? 'pending' : 'unknown' };
  }
  async perform(payload) {
    try {
      const principal = this.ctx.invocation?.peer?.principal;
      if (principal && principal.kind !== 'owner') fail('FORBIDDEN', 'Only the DSH owner can manage skills');
      if (!payload || Array.isArray(payload) || typeof payload.action !== 'string' || Buffer.byteLength(JSON.stringify(payload)) > 48 * 1024 * 1024 || payload.sessionId !== undefined && (typeof payload.sessionId !== 'string' || payload.sessionId.length > 200)) fail('INVALID_REQUEST', 'Invalid or oversized request');
      if (payload.action === 'contexts') return { success: true, data: await this.resolver.options(payload.sessionId) };
      if (payload.action === 'revision') return { success: true, data: { revision: this.revision } };
      return await this.resolver.withView(payload, async view => {
        this.activeRoots = this.roots(view);
        if (payload.action === 'list') return { success: true, data: await this.list(view) };
        if (payload.action === 'read' && String(payload.id).startsWith('provider:')) return { success: true, data: await this.readVirtual(payload.id, view) };
        const mutation = MUTATIONS.has(payload.action);
        const before = mutation ? await this.manager.request({ action: 'list' }) : undefined;
        const data = await this.local(payload);
        if (mutation) {
          const after = await this.manager.request({ action: 'list' });
          let synchronization = await this.settle(view, before, after);
          if (payload.sessionId && !view.context.followSession) {
            await this.resolver.withView({ sessionId: payload.sessionId }, async actual => {
              const checked = await this.settle(actual, before, after);
              if (checked.catalog !== 'verified') synchronization = checked;
            });
          }
          this.revision++;
          data.synchronization = synchronization;
          data.revision = this.revision;
        }
        if (data.skill) {
          try { data.skill.availability = runtimeState(data.skill, await this.snapshot(view), view); data.skill.effective = data.skill.availability.status === 'available'; }
          catch { data.skill.availability = { status: 'unknown', automatic: false, manual: false, presetId: view.context.presetId }; }
          data.context = view.context;
        }
        return { success: true, data };
      });
    } catch (error) {
      this.ctx.logger?.warn?.('Skills Studio: %s', error.message);
      return { success: false, error: errorOf(error) };
    }
  }
}

export function apply(ctx, config = {}) {
  const gateway = new StudioGateway(ctx, config);
  ctx.on('skills/change', () => { gateway.revision++; });
  ctx.effect(() => ctx.typert.register(manifest), 'skill-studio: remote manifest');
}
