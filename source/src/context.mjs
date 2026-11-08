import { createHash } from 'node:crypto';
import { stat } from 'node:fs/promises';
import { basename, dirname, isAbsolute, join, resolve } from 'node:path';

const USER_WORKSPACE = 'user';
const UNKNOWN_PRESET = 'unknown';
const workspaceId = path => createHash('sha256').update(path).digest('hex').slice(0, 20);
const service = (ctx, name) => typeof ctx.get === 'function' ? ctx.get(name) : ctx[name];
const fail = (code, message) => Object.assign(new Error(message), { code });
const validId = value => typeof value === 'string' && value.length > 0 && value.length <= 200 && !value.includes('\0');
const pathValue = value => typeof value === 'string' && value.length > 0 && isAbsolute(value) ? resolve(value) : undefined;
const sessionIdOf = session => session?.id ?? session?.header?.id;

/** Match the filesystem skill provider's nearest Git ancestor, including .git files in worktrees. */
async function projectRoot(cwd) {
  const original = resolve(cwd);
  let current = original;
  for (;;) {
    if (await stat(join(current, '.git')).then(() => true, error => {
      if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return false;
      throw error;
    })) return current;
    const parent = dirname(current);
    if (parent === current) return original;
    current = parent;
  }
}

/**
 * Resolve an observational workspace/preset view. Nothing here creates an Agent,
 * changes a Session directory, or selects a real Session's preset.
 */
export class ContextResolver {
  constructor(ctx, config = {}) {
    this.ctx = ctx;
    this.config = config;
  }

  async inspect(sessionId) {
    if (sessionId !== undefined && !validId(sessionId)) throw fail('INVALID_CONTEXT', 'Invalid session id');
    const sessionsService = service(this.ctx, 'sessions');
    const workspaceRegistry = service(this.ctx, 'workspaceRegistry');
    const agentPresets = service(this.ctx, 'agentPresets');
    const agents = service(this.ctx, 'agents');
    const [registered, sessions, roster, selected, live] = await Promise.all([
      workspaceRegistry?.list?.() ?? [],
      sessionsService?.list?.() ?? [],
      agentPresets?.list?.() ?? [],
      sessionId === undefined ? undefined : sessionsService?.get?.(sessionId),
      sessionId === undefined ? undefined : agents?.get?.(sessionId),
    ]);
    const session = selected ?? live?.session ?? (sessionId === undefined ? undefined : sessions.find(row => sessionIdOf(row) === sessionId));
    const workingDirectory = service(this.ctx, 'workingDirectory');
    const currentCwd = session === undefined ? undefined
      : pathValue(await workingDirectory?.get?.(session)) ?? pathValue(session.header?.cwd);
    const candidates = [
      ...registered.map(row => ({ path: pathValue(row.path), label: row.title ?? row.label })),
      ...sessions.map(row => ({ path: pathValue(row.header?.cwd) })),
      ...(session === undefined ? [] : [{ path: pathValue(session.header?.cwd) }]),
      { path: currentCwd },
    ].filter(row => row.path !== undefined);
    const normalized = await Promise.all(candidates.map(async row => ({ ...row, path: await projectRoot(row.path) })));
    const known = new Map();
    for (const row of normalized) {
      if (known.has(row.path)) continue;
      known.set(row.path, { id: workspaceId(row.path), label: row.label?.trim() || basename(row.path) || row.path, path: row.path });
    }
    const workspaces = [...known.values()];
    const currentRoot = currentCwd === undefined ? undefined : await projectRoot(currentCwd);
    const defaultId = agentPresets?.defaultId;
    const presets = roster.map(row => ({
      id: row.id,
      ...(row.name === undefined ? {} : { name: row.name }),
      ...(row.description === undefined ? {} : { description: row.description }),
      ...(row.broken === undefined ? {} : { broken: row.broken }),
      isDefault: row.id === defaultId,
    }));
    const composedId = live === undefined ? undefined : await agentPresets?.composedPreset?.(live.ctx);
    // DSH 0.2.1-rc.5 exposes the committed selection through its public
    // Session projection registry; 0.2.2-rc.1 adds the dedicated preset read.
    // Use the projection only when that newer method is absent, so its null
    // answer remains authoritative and newer runtimes avoid the legacy face.
    const recordedId = session === undefined ? undefined
      : typeof agentPresets?.presetForSession === 'function'
        ? await agentPresets.presetForSession(session)
        : await service(this.ctx, 'sessionProjections')?.stateOf?.(session, 'agentPreset');
    const knownDefaultId = presets.some(row => row.id === defaultId) ? defaultId : undefined;
    const presetId = composedId ?? recordedId ?? knownDefaultId ?? UNKNOWN_PRESET;
    const current = {
      workspaceId: currentRoot === undefined ? USER_WORKSPACE : workspaceId(currentRoot),
      presetId,
      sessionId,
    };
    return { workspaces, presets, current, session, live, currentCwd, agentPresets };
  }

  /** Return only client-safe choices; paths supplied by callers are never added to this inventory. */
  async options(sessionId) {
    const { workspaces, presets, current } = await this.inspect(sessionId);
    return { workspaces, presets, current };
  }

  /**
   * Run a read against a live composition or a temporary public preset lease.
   * The lease remains alive through the callback and is always awaited on exit.
   */
  async withView(payload = {}, fn) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload) || typeof fn !== 'function') {
      throw fail('INVALID_CONTEXT', 'Invalid context request');
    }
    for (const key of ['workspaceId', 'presetId']) {
      if (payload[key] !== undefined && !validId(payload[key])) throw fail('INVALID_CONTEXT', `Invalid ${key}`);
    }
    const state = await this.inspect(payload.sessionId);
    const followWorkspace = payload.workspaceId === undefined || payload.workspaceId === 'current';
    const followPreset = payload.presetId === undefined || payload.presetId === 'current';
    const selectedWorkspaceId = followWorkspace ? state.current.workspaceId : payload.workspaceId;
    const workspace = selectedWorkspaceId === USER_WORKSPACE ? undefined
      : state.workspaces.find(row => row.id === selectedWorkspaceId);
    if (selectedWorkspaceId !== USER_WORKSPACE && workspace === undefined) {
      throw fail('UNKNOWN_WORKSPACE', 'Choose a known workspace; absolute paths are not accepted');
    }
    const selectedPresetId = followPreset ? state.current.presetId : payload.presetId;
    const preset = state.presets.find(row => row.id === selectedPresetId);
    if (!followPreset && preset === undefined) throw fail('UNKNOWN_PRESET', `Unknown agent preset: ${selectedPresetId}`);
    if (!followPreset && preset.broken !== undefined) throw fail('PRESET_UNAVAILABLE', `Agent preset is unavailable: ${selectedPresetId}: ${preset.broken}`);
    const context = {
      workspaceId: selectedWorkspaceId,
      presetId: selectedPresetId,
      presetLabel: preset?.name ?? (selectedPresetId === UNKNOWN_PRESET ? 'Unknown preset' : selectedPresetId),
      workspaceLabel: workspace?.label ?? 'User skills',
      workspacePath: workspace?.path,
      sessionId: payload.sessionId,
      followSession: followWorkspace && followPreset,
      hasSession: state.session !== undefined,
      complete: selectedPresetId !== UNKNOWN_PRESET,
    };
    const cwd = followWorkspace ? state.currentCwd : workspace?.path;
    const hostRegistry = service(this.ctx, 'skills');
    let registry = hostRegistry;
    let scope;
    let lease;
    try {
      if (followPreset && state.live !== undefined) {
        registry = await state.agentPresets?.serviceFor?.(state.live, 'skills') ?? hostRegistry;
        scope = state.live;
      } else if (selectedPresetId !== UNKNOWN_PRESET && state.agentPresets?.acquireScope !== undefined) {
        try {
          lease = await state.agentPresets.acquireScope(selectedPresetId);
          if (lease?.key === undefined || typeof lease[Symbol.asyncDispose] !== 'function') {
            throw fail('PRESET_UNAVAILABLE', 'The preset service returned an invalid scope lease');
          }
          scope = lease.key;
        } catch (error) {
          if (!followPreset) {
            if (error.code === 'PRESET_UNAVAILABLE') throw error;
            throw Object.assign(fail('PRESET_UNAVAILABLE', `Agent preset could not be inspected: ${selectedPresetId}`), { cause: error });
          }
          context.complete = false;
        }
      } else {
        context.complete = false;
        if (!followPreset) throw fail('PRESET_UNAVAILABLE', `Agent preset scope is unavailable: ${selectedPresetId}`);
      }
      if (registry === undefined || (payload.sessionId !== undefined && state.session === undefined)) context.complete = false;
      return await fn({ cwd, registry, scope, context });
    } finally {
      if (typeof lease?.[Symbol.asyncDispose] === 'function') await lease[Symbol.asyncDispose]();
    }
  }
}
