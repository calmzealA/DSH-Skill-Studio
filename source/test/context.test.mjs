import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, realpath, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Context } from '@deepseek-ai/cordis';
import { ContextResolver } from '../src/context.mjs';

const workspaceId = path => createHash('sha256').update(path).digest('hex').slice(0, 20);

async function fixture(t) {
  const directory = await mkdtemp(join(await realpath(tmpdir()), 'skill-studio-context-'));
  const ctx = new Context();
  const sessions = new Map();
  const agents = new Map();
  const workspaces = [];
  const registry = { name: 'host registry' };
  const calls = { create: 0, select: 0, leases: [], acquired: [] };
  const rows = [
    { id: 'standard', name: 'Standard', description: 'Default composition.' },
    { id: 'minimal', name: 'Minimal' },
    { id: 'broken', name: 'Unavailable', broken: 'The provider failed to start.' },
  ];
  const presets = {
    defaultId: 'standard',
    list: async () => rows,
    composedPreset: context => context?.preset,
    presetForSession: session => session?.recordedPreset ?? null,
    serviceFor: agent => agent.skillRegistry,
    async acquireScope(id) {
      calls.acquired.push(id);
      const lease = {
        id, key: { preset: id }, released: false,
        async [Symbol.asyncDispose]() {
          // Make releasing asynchronous so withView must await the disposer.
          await Promise.resolve();
          lease.released = true;
        },
      };
      calls.leases.push(lease);
      return lease;
    },
    select() { calls.select++; throw new Error('Inspection must not change the session preset'); },
  };
  const sessionService = { get: id => sessions.get(id), list: () => [...sessions.values()] };
  ctx.provide('sessions', sessionService);
  ctx.provide('agents', {
    get: id => agents.get(id),
    create() { calls.create++; throw new Error('Inspection must not create an Agent'); },
  });
  ctx.provide('skills', registry);
  ctx.provide('workspaceRegistry', { list: () => workspaces });
  ctx.provide('agentPresets', presets);
  t.after(async () => {
    await ctx.fiber.dispose();
    await rm(directory, { recursive: true, force: true });
  });
  return { directory, ctx, sessions, sessionService, agents, workspaces, registry, calls, rows, presets, resolver: new ContextResolver(ctx) };
}

test('context options merge known workspaces and sessions by the nearest Git root', async t => {
  const f = await fixture(t);
  const registered = join(f.directory, 'registered');
  const linked = join(f.directory, 'linked');
  const plain = join(f.directory, 'plain');
  await mkdir(join(registered, '.git'), { recursive: true });
  await mkdir(join(registered, 'src', 'nested'), { recursive: true });
  await mkdir(join(linked, 'packages'), { recursive: true });
  await writeFile(join(linked, '.git'), 'gitdir: ../other/.git/worktrees/linked\n');
  await mkdir(plain);
  f.workspaces.push({ id: 'native-id-is-not-exposed', title: 'Registered project', path: registered });
  const session = { id: 'selected', header: { cwd: join(registered, 'src') }, recordedPreset: 'minimal' };
  f.sessions.set(session.id, session);
  f.sessions.set('sibling', { id: 'sibling', header: { cwd: join(registered, 'src', 'nested') } });
  f.sessions.set('plain', { id: 'plain', header: { cwd: plain } });
  f.ctx.provide('workingDirectory', { get: observed => observed === session ? join(linked, 'packages') : undefined });
  f.agents.set(session.id, { ctx: { preset: 'standard' } });

  const options = await f.resolver.options(session.id);
  assert.deepEqual(new Set(options.workspaces.map(row => row.path)), new Set([registered, linked, plain]));
  assert.equal(options.workspaces.filter(row => row.path === registered).length, 1);
  for (const row of options.workspaces) {
    assert.equal(row.id, workspaceId(row.path));
    assert.ok(row.label, 'every workspace has a usable display label');
  }
  assert.deepEqual(options.current, { workspaceId: workspaceId(linked), presetId: 'standard', sessionId: 'selected' });
  assert.deepEqual(options.presets, f.rows.map(row => ({ ...row, isDefault: row.id === 'standard' })));
  await f.resolver.withView({ sessionId: session.id }, view => {
    assert.equal(view.cwd, join(linked, 'packages'), 'a followed session keeps its actual cwd below the displayed Git workspace root');
    assert.equal(view.context.workspacePath, linked);
  });
  assert.equal(f.calls.create, 0);
  assert.equal(f.calls.select, 0);
});

test('options includes a requested session even when it is absent from the session roster', async t => {
  const f = await fixture(t);
  const project = join(f.directory, 'single-session-project');
  await mkdir(project);
  const session = { id: 'not-listed', header: { cwd: project }, recordedPreset: 'minimal' };
  f.sessionService.get = id => id === session.id ? session : undefined;
  f.sessionService.list = () => [];
  const options = await f.resolver.options(session.id);
  assert.equal(options.workspaces.find(row => row.path === project)?.id, workspaceId(project));
  assert.equal(options.current.workspaceId, workspaceId(project));
  assert.equal(options.current.presetId, 'minimal');
});

test('current context reads the effective working directory and live preset registry without a lease', async t => {
  const f = await fixture(t);
  const original = join(f.directory, 'original');
  const current = join(f.directory, 'current');
  await mkdir(original);
  await mkdir(current);
  const session = { id: 'live', header: { cwd: original }, recordedPreset: 'minimal' };
  const liveRegistry = { name: 'live preset registry' };
  const live = { ctx: { preset: 'standard' }, session, skillRegistry: liveRegistry };
  f.sessions.set(session.id, session);
  f.agents.set(session.id, live);
  f.ctx.provide('workingDirectory', { get: observed => observed === session ? current : undefined });

  const result = await f.resolver.withView({ sessionId: session.id, workspaceId: 'current', presetId: 'current' }, async view => {
    assert.equal(view.cwd, current);
    assert.equal(view.registry, liveRegistry);
    assert.equal(view.scope, live);
    assert.equal(view.context.workspaceId, workspaceId(current));
    assert.equal(view.context.workspacePath, current);
    assert.equal(view.context.presetId, 'standard');
    assert.equal(view.context.presetLabel, 'Standard');
    assert.equal(view.context.sessionId, session.id);
    assert.equal(view.context.followSession, true);
    assert.equal(view.context.hasSession, true);
    assert.equal(view.context.complete, true);
    return 'inspected';
  });
  assert.equal(result, 'inspected');
  assert.deepEqual(f.calls.acquired, []);
  assert.equal(f.calls.create, 0);
  assert.equal(f.calls.select, 0);
});

test('a live context without a preset-local registry falls back to the host registry', async t => {
  const f = await fixture(t);
  const session = { id: 'live', header: {}, recordedPreset: 'standard' };
  const live = { ctx: { preset: 'standard' }, session };
  f.sessions.set(session.id, session);
  f.agents.set(session.id, live);
  await f.resolver.withView({ sessionId: session.id }, view => {
    assert.equal(view.registry, f.registry);
    assert.equal(view.scope, live);
  });
  assert.deepEqual(f.calls.acquired, []);
});

test('cold session inspection leases its recorded preset and awaits release after consumption', async t => {
  const f = await fixture(t);
  const project = join(f.directory, 'cold');
  await mkdir(project);
  const session = { id: 'cold', header: { cwd: project }, recordedPreset: 'minimal' };
  f.sessions.set(session.id, session);
  const result = await f.resolver.withView({ sessionId: session.id }, async view => {
    const lease = f.calls.leases.at(-1);
    assert.equal(view.registry, f.registry);
    assert.equal(view.scope, lease.key);
    assert.equal(view.context.presetId, 'minimal');
    assert.equal(lease.released, false);
    await Promise.resolve();
    assert.equal(lease.released, false, 'the lease is retained while the async consumer is active');
    return 17;
  });
  assert.equal(result, 17);
  assert.deepEqual(f.calls.acquired, ['minimal']);
  assert.equal(f.calls.leases[0].released, true, 'withView awaits asynchronous disposal before returning');
  assert.equal(f.calls.create, 0);
  assert.equal(f.calls.select, 0);
});

test('DSH rc.5 reads a cold session selection through the public projection when the dedicated preset reader is absent', async t => {
  const f = await fixture(t);
  const session = { id: 'legacy-cold', header: { cwd: f.directory, agentPreset: 'standard' } };
  f.sessions.set(session.id, session);
  delete f.presets.presetForSession;
  const reads = [];
  f.ctx.provide('sessionProjections', { stateOf(observed, key) {
    reads.push([observed, key]);
    return 'minimal';
  } });
  const options = await f.resolver.options(session.id);
  assert.equal(options.current.presetId, 'minimal', 'a later committed selection takes precedence over the creation header and default');
  await f.resolver.withView({ sessionId: session.id }, view => {
    assert.equal(view.context.presetId, 'minimal');
    assert.equal(view.context.complete, true);
    assert.equal(view.scope, f.calls.leases.at(-1).key);
  });
  assert.ok(reads.length > 0);
  assert.ok(reads.every(([observed, key]) => observed === session && key === 'agentPreset'));
  assert.deepEqual(f.calls.acquired, ['minimal']);
  assert.equal(f.calls.leases[0].released, true);
  assert.equal(f.calls.select, 0);
  assert.equal(f.calls.create, 0);
});

test('the newer dedicated preset reader takes precedence without reading the legacy projection face', async t => {
  const f = await fixture(t);
  const session = { id: 'current-reader', header: { cwd: f.directory }, recordedPreset: 'minimal' };
  f.sessions.set(session.id, session);
  f.ctx.provide('sessionProjections', { stateOf() { assert.fail('A runtime with presetForSession must not use the legacy projection read'); } });
  assert.equal((await f.resolver.options(session.id)).current.presetId, 'minimal');
  session.recordedPreset = null;
  assert.equal((await f.resolver.options(session.id)).current.presetId, 'standard', 'null from the dedicated reader uses the known default without invoking a fallback reader');
});

test('explicit workspace and preset inspect a detached view without mutating the live Agent', async t => {
  const f = await fixture(t);
  const current = join(f.directory, 'live-workspace');
  const selected = join(f.directory, 'selected-workspace');
  await mkdir(current);
  await mkdir(selected);
  const session = { id: 'live', header: { cwd: current }, recordedPreset: 'standard' };
  const live = { ctx: { preset: 'standard' }, session, skillRegistry: { name: 'live registry' } };
  f.sessions.set(session.id, session);
  f.agents.set(session.id, live);
  f.workspaces.push({ path: selected, title: 'Selected workspace' });
  await f.resolver.withView({ sessionId: session.id, workspaceId: workspaceId(selected), presetId: 'minimal' }, view => {
    assert.equal(view.cwd, selected);
    assert.equal(view.registry, f.registry);
    assert.equal(view.scope, f.calls.leases.at(-1).key);
    assert.equal(view.context.workspaceId, workspaceId(selected));
    assert.equal(view.context.workspacePath, selected);
    assert.equal(view.context.presetId, 'minimal');
    assert.equal(view.context.followSession, false);
    assert.equal(view.context.hasSession, true);
  });
  assert.equal(live.ctx.preset, 'standard');
  assert.equal(session.recordedPreset, 'standard');
  assert.equal(f.calls.leases[0].released, true);
  assert.equal(f.calls.create, 0);
  assert.equal(f.calls.select, 0);
});

test('explicit user scope clears cwd while preserving the selected preset inspection', async t => {
  const f = await fixture(t);
  const session = { id: 'live', header: { cwd: f.directory }, recordedPreset: 'standard' };
  f.sessions.set(session.id, session);
  await f.resolver.withView({ sessionId: session.id, workspaceId: 'user', presetId: 'minimal' }, view => {
    assert.equal(view.cwd, undefined);
    assert.equal(view.context.workspaceId, 'user');
    assert.equal(view.context.workspacePath, undefined);
    assert.equal(view.context.presetId, 'minimal');
    assert.equal(view.context.followSession, false);
  });
});

test('lease release also runs when a consumer fails', async t => {
  const f = await fixture(t);
  const failure = new Error('consumer failed');
  await assert.rejects(f.resolver.withView({ presetId: 'minimal' }, async () => {
    await Promise.resolve();
    throw failure;
  }), error => error === failure);
  assert.equal(f.calls.leases.length, 1);
  assert.equal(f.calls.leases[0].released, true);
});

test('concurrent detached views retain and dispose their own lease independently', async t => {
  const f = await fixture(t);
  let releaseFirst;
  const firstGate = new Promise(resolve => { releaseFirst = resolve; });
  let enteredFirst;
  const firstEntered = new Promise(resolve => { enteredFirst = resolve; });
  const first = f.resolver.withView({ presetId: 'standard' }, async view => {
    const lease = f.calls.leases.find(row => row.key === view.scope);
    enteredFirst();
    await firstGate;
    assert.equal(lease.released, false);
    return view.context.presetId;
  });
  await firstEntered;
  const second = await f.resolver.withView({ presetId: 'minimal' }, view => view.context.presetId);
  assert.equal(second, 'minimal');
  assert.equal(f.calls.leases[0].released, false);
  assert.equal(f.calls.leases[1].released, true);
  assert.notEqual(f.calls.leases[0].key, f.calls.leases[1].key);
  releaseFirst();
  assert.equal(await first, 'standard');
  assert.equal(f.calls.leases[0].released, true);
});

test('unknown and raw-path workspace selections cannot reach the consumer', async t => {
  const f = await fixture(t);
  let consumed = false;
  for (const id of ['missing-workspace', f.directory]) {
    await assert.rejects(f.resolver.withView({ workspaceId: id }, () => { consumed = true; }), error => error.code === 'UNKNOWN_WORKSPACE');
  }
  assert.equal(consumed, false);
  assert.deepEqual(f.calls.acquired, [], 'invalid targets are rejected before acquiring a preset');
});

test('unknown and broken explicit presets cannot silently fall back to a global registry', async t => {
  const f = await fixture(t);
  let consumed = false;
  await assert.rejects(f.resolver.withView({ presetId: 'missing-preset' }, () => { consumed = true; }), error => error.code === 'UNKNOWN_PRESET');
  await assert.rejects(f.resolver.withView({ presetId: 'broken' }, () => { consumed = true; }), error => error.code === 'PRESET_UNAVAILABLE');
  assert.equal(consumed, false);
  assert.deepEqual(f.calls.acquired, []);
});

test('a failed scope acquisition never invokes the consumer or fabricates a lease', async t => {
  const f = await fixture(t);
  f.presets.acquireScope = async () => { throw new Error('Preset activation failed'); };
  let consumed = false;
  await assert.rejects(f.resolver.withView({ presetId: 'minimal' }, () => { consumed = true; }), error => error.code === 'PRESET_UNAVAILABLE');
  assert.equal(consumed, false);
  assert.deepEqual(f.calls.leases, []);
});

test('an unregistered deployment default remains unknown instead of reporting confirmed availability', async t => {
  const f = await fixture(t);
  f.presets.defaultId = 'not-registered';
  const options = await f.resolver.options();
  assert.equal(options.current.presetId, 'unknown');
  assert.equal(options.presets.some(row => row.isDefault), false);
  await f.resolver.withView({}, view => {
    assert.equal(view.context.presetId, 'unknown');
    assert.equal(view.context.complete, false);
    assert.equal(view.scope, undefined);
  });
  assert.deepEqual(f.calls.acquired, []);
});

test('a host with known workspaces still defaults to user scope when no session is selected', async t => {
  const f = await fixture(t);
  const project = join(f.directory, 'known-project');
  await mkdir(project);
  f.workspaces.push({ path: project, title: 'Known project' });
  const options = await f.resolver.options();
  assert.equal(options.workspaces.length, 1);
  assert.equal(options.current.workspaceId, 'user');
  await f.resolver.withView({}, view => {
    assert.equal(view.cwd, undefined);
    assert.equal(view.context.workspaceId, 'user');
    assert.equal(view.context.workspacePath, undefined);
    assert.equal(view.context.hasSession, false);
  });
});

test('an invalid scope lease is rejected and its available disposer is still awaited', async t => {
  const f = await fixture(t);
  let disposed = false;
  f.presets.acquireScope = async () => ({
    async [Symbol.asyncDispose]() { await Promise.resolve(); disposed = true; },
  });
  let consumed = false;
  await assert.rejects(f.resolver.withView({ presetId: 'minimal' }, () => { consumed = true; }), error => error.code === 'PRESET_UNAVAILABLE');
  assert.equal(consumed, false);
  assert.equal(disposed, true);
});

test('a minimal Cordis host can manage user files without pretending a preset is known', async t => {
  const ctx = new Context();
  t.after(() => ctx.fiber.dispose());
  const registry = { name: 'minimal registry' };
  ctx.provide('skills', registry);
  const resolver = new ContextResolver(ctx);
  const options = await resolver.options();
  assert.deepEqual(options.workspaces, []);
  assert.deepEqual(options.presets, []);
  assert.equal(options.current.workspaceId, 'user');
  assert.equal(options.current.presetId, 'unknown');
  await resolver.withView({}, view => {
    assert.equal(view.cwd, undefined);
    assert.equal(view.registry, registry);
    assert.equal(view.scope, undefined);
    assert.equal(view.context.hasSession, false);
    assert.equal(view.context.presetId, 'unknown');
    assert.equal(view.context.complete, false);
  });
});
