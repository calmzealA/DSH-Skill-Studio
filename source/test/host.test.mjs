import test from 'node:test';
import assert from 'node:assert/strict';
import { realpath, mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { Context } from '@deepseek-ai/cordis';
import { apply, StudioGateway } from '../src/index.mjs';
import { contribution, descriptor, manifest, PACKAGE } from '../src/wire.mjs';
import { validateSkill } from '../src/manager.mjs';

const instruction = (name, body = 'Use the workflow.') => `---\nname: ${name}\ndescription: Test ${name}\n---\n${body}\n`;

async function setup(t, options = {}) {
  const directory = await mkdtemp(join(await realpath(tmpdir()), 'skill-studio-host-'));
  const ctx = new Context();
  const snapshots = [];
  const definitions = new Map();
  const sessionMap = new Map();
  const agents = new Map();
  const workspaces = [];
  const leases = [];
  const presetCalls = { select: 0, create: 0 };
  const registrations = [];
  let unregistered = 0;
  const registry = {
    async snapshot(lookup) {
      snapshots.push(lookup);
      return { skills: [...definitions.values()].map(row => ({ ...row, content: undefined, metadata: undefined })).map(({ content, metadata, ...row }) => row), complete: options.complete ?? true };
    },
    async get(name, lookup) { return definitions.get(name); },
  };
  ctx.provide('sessions', { get: id => sessionMap.get(id), list: () => [...sessionMap.values()] });
  ctx.provide('skills', registry);
  ctx.provide('workspaceRegistry', { list: () => workspaces });
  ctx.provide('agents', {
    get: id => agents.get(id),
    create() { presetCalls.create++; throw new Error('A management view must not create an Agent'); },
  });
  const presets = {
    defaultId: 'standard',
    list: () => [{ id: 'standard', name: 'Standard' }, { id: 'minimal', name: 'Minimal' }],
    presetForSession: session => session.recordedPreset ?? 'standard',
    composedPreset: context => context?.preset,
    serviceFor: agent => agent.skills,
    inspectCompositions: () => [{ id: 'standard', modules: [] }, { id: 'minimal', modules: [] }],
    async acquireScope(id) {
      const lease = { key: { preset: id }, released: false, async [Symbol.asyncDispose]() {
        await Promise.resolve();
        lease.released = true;
      } };
      leases.push(lease);
      return lease;
    },
    select() { presetCalls.select++; throw new Error('A management view must not select a Session preset'); },
  };
  if (options.presets !== false) ctx.provide('agentPresets', presets);
  ctx.provide('typert', {
    register(value) {
      registrations.push(value);
      return () => { unregistered++; };
    },
  });
  const config = { dshHome: join(directory, 'dsh'), agentsHome: join(directory, 'agents'), ...(options.config ?? {}) };
  apply(ctx, config);
  const gateway = ctx.get('skillStudio');
  t.after(async () => {
    await ctx.fiber.dispose();
    assert.equal(unregistered, 1, 'unloading disposes the Typert manifest registration');
    assert.ok(leases.every(lease => lease.released), 'every temporary preset scope lease was awaited and disposed');
    await rm(directory, { recursive: true, force: true });
  });
  const request = payload => gateway.request(payload);
  return { directory, ctx, config, gateway, request, definitions, sessionMap, registry, snapshots, registrations, presets, agents, workspaces, leases, presetCalls };
}

test('actual Cordis service registration exposes the declared Typert host and client contract', async t => {
  const { gateway, registrations } = await setup(t);
  assert.ok(gateway instanceof StudioGateway);
  assert.equal(gateway.typertRemote.serviceKey, 'skillStudio');
  assert.equal(gateway.typertRemote.namespace, 'skillStudio');
  assert.deepEqual(registrations, [manifest]);
  assert.equal(manifest.package, PACKAGE);
  assert.equal(manifest.face, 'host');
  assert.equal(manifest.invocations[0], contribution.descriptors[0]);
  assert.equal(descriptor.id, `${PACKAGE}#skillStudio/request`);
  assert.equal(descriptor.parameters[0].wire, 'payload');
  assert.equal(descriptor.invocation.kind, 'direct');
  const payload = { action: 'list', sessionId: 'test' };
  assert.equal(descriptor.parameters[0].codec.create().parse(payload), payload);
  assert.throws(() => descriptor.parameters[0].codec.create().parse(JSON.parse('{"__proto__":1}')), /INVALID_KEY/);
  assert.throws(() => descriptor.result.create().parse({ invalid: Number.NaN }), /INVALID_JSON/);
  assert.throws(() => descriptor.parameters[0].codec.create().parse(Array(5001).fill(null)), /REQUEST_TOO_LARGE/);
});

test('filesystem failures retain actionable details through the strict JSON gateway', async t => {
  const { gateway, request } = await setup(t);
  gateway.manager.request = async () => {
    throw Object.assign(new Error('The file is temporarily locked.'), {
      code: 'FILE_BUSY', fsCode: 'EBUSY', recoveryPath: '/recovery/original-skill',
      cause: new Error('native failure'),
    });
  };
  const result = await request({ action: 'read', id: 'locked-skill' });
  assert.deepEqual(result, { success: false, error: {
    code: 'FILE_BUSY', message: 'The file is temporarily locked.',
    fsCode: 'EBUSY', recoveryPath: '/recovery/original-skill',
  } });
  assert.equal(descriptor.result.create().parse(result), result);
});

test('host merges local manager entries with immutable provider skills and preserves invocation metadata in read', async t => {
  const { request, config, definitions } = await setup(t);
  const localPath = join(config.dshHome, 'skills', 'local-notes', 'SKILL.md');
  await mkdir(join(config.dshHome, 'skills', 'local-notes'), { recursive: true });
  await writeFile(localPath, instruction('local-notes'));
  definitions.set('local-notes', {
    name: 'local-notes', description: 'Test local-notes', path: localPath,
    provider: 'filesystem', source: 'user-dsh', invocation: { modelInvocable: true, userInvocable: true }, content: 'Local body.',
  });
  definitions.set('office-helper', {
    name: 'office-helper', description: 'Packaged office helper', provider: 'office-package', source: 'bundled',
    invocation: { modelInvocable: false, userInvocable: true }, content: 'Read the packaged instructions.',
    whenToUse: 'Use when preparing a document.', metadata: { tags: ['office'], owner: 'package-author' },
  });
  const result = await request({ action: 'list' });
  assert.equal(result.success, true);
  assert.equal(result.data.complete, true);
  assert.equal(result.data.skills.length, 2, 'the effective local path is not duplicated as a provider row');
  const local = result.data.skills.find(row => row.name === 'local-notes');
  assert.equal(local.effective, true);
  assert.equal(local.readOnly, false);
  const provider = result.data.skills.find(row => row.name === 'office-helper');
  assert.equal(provider.readOnly, true);
  assert.equal(provider.effective, true);
  assert.equal(provider.modelInvocable, false);
  assert.equal(provider.userInvocable, true);
  assert.ok(provider.id.startsWith('provider:'));
  assert.equal(result.data.roots.find(row => row.id === provider.rootId).writable, false);
  const read = await request({ action: 'read', id: provider.id });
  assert.equal(read.success, true);
  const parsed = validateSkill(read.data.text);
  assert.equal(parsed.modelInvocable, false);
  assert.equal(parsed.userInvocable, true);
  assert.equal(parsed.metadata.whenToUse, 'Use when preparing a document.');
  assert.deepEqual(parsed.metadata.metadata, { tags: ['office'], owner: 'package-author' });
  assert.match(read.data.text, /Read the packaged instructions/);
  assert.equal(Buffer.from(read.data.files[0].base64, 'base64').toString('utf8'), read.data.text);
  const remove = await request({ action: 'delete', id: provider.id });
  assert.equal(remove.success, false);
  assert.ok(['NOT_FOUND', 'READ_ONLY'].includes(remove.error.code));
});

test('session roots use the nearest Git project and requests cannot reuse an id to modify another project', async t => {
  const { directory, request, sessionMap, snapshots } = await setup(t);
  const projectA = join(directory, 'project-a');
  const projectB = join(directory, 'project-b');
  await mkdir(join(projectA, '.git'), { recursive: true });
  await mkdir(join(projectA, 'src', 'nested'), { recursive: true });
  await mkdir(join(projectB, '.git'), { recursive: true });
  sessionMap.set('session-a', { header: { cwd: join(projectA, 'src', 'nested') } });
  sessionMap.set('session-b', { header: { cwd: projectB } });
  const listing = await request({ action: 'list', sessionId: 'session-a' });
  assert.equal(listing.success, true);
  const root = listing.data.roots.find(row => row.source === 'project-dsh');
  assert.equal(root.path, join(projectA, '.dsh', 'skills'));
  assert.equal(root.rank, 100);
  assert.ok(root.rank < listing.data.roots.find(row => row.source === 'user-dsh').rank);
  assert.equal(snapshots.at(-1).cwd, join(projectA, 'src', 'nested'));
  const created = await request({ action: 'create', sessionId: 'session-a', rootId: root.id, name: 'project-task', description: 'Project workflow.' });
  assert.equal(created.success, true);
  assert.match(await readFile(join(projectA, '.dsh', 'skills', 'project-task', 'SKILL.md'), 'utf8'), /Project workflow/);
  const foreign = await request({ action: 'save', sessionId: 'session-b', id: created.data.skill.id, expectedHash: created.data.hash, text: instruction('project-task', 'Wrong project.') });
  assert.equal(foreign.success, false);
  assert.equal(foreign.error.code, 'NOT_FOUND');
  assert.doesNotMatch(await readFile(join(projectA, '.dsh', 'skills', 'project-task', 'SKILL.md'), 'utf8'), /Wrong project/);
  const global = await request({ action: 'list' });
  assert.equal(global.data.roots.some(row => row.source === 'project-dsh'), false);
});

test('call-derived Cordis contexts enforce native owner-only access before both reads and mutations', async t => {
  const { ctx, request, config } = await setup(t);
  const listing = await request({ action: 'list' });
  const rootId = listing.data.roots.find(row => row.source === 'user-dsh').id;
  const guest = ctx.extend({ invocation: { peer: { principal: { kind: 'guest', id: 'shared-reader' } } } }).get('skillStudio');
  const deniedRead = await guest.request({ action: 'list' });
  assert.deepEqual(deniedRead, { success: false, error: { code: 'FORBIDDEN', message: 'Only the DSH owner can manage skills' } });
  const deniedWrite = await guest.request({ action: 'create', rootId, name: 'guest-created', description: 'Should be refused.' });
  assert.equal(deniedWrite.error.code, 'FORBIDDEN');
  await assert.rejects(readFile(join(config.dshHome, 'skills', 'guest-created', 'SKILL.md')), { code: 'ENOENT' });
  const owner = ctx.extend({ invocation: { peer: { principal: { kind: 'owner' } } } }).get('skillStudio');
  const allowed = await owner.request({ action: 'create', rootId, name: 'owner-created', description: 'Owned workflow.' });
  assert.equal(allowed.success, true);
});

test('unknown actions and malformed input return bounded errors while registry failures preserve usable local entries', async t => {
  const { request, registry, config } = await setup(t);
  const unknown = await request({ action: 'an-unrecognized-action' });
  assert.equal(unknown.success, false);
  assert.equal(unknown.error.code, 'UNKNOWN_ACTION');
  assert.ok(unknown.error.message.length <= 1200);
  for (const payload of [null, {}, { action: 'list', sessionId: {} }, { action: 'list', sessionId: 'x'.repeat(201) }]) {
    const invalid = await request(payload);
    assert.equal(invalid.success, false);
    assert.equal(invalid.error.code, 'INVALID_REQUEST');
  }
  await mkdir(join(config.dshHome, 'skills', 'still-visible'), { recursive: true });
  await writeFile(join(config.dshHome, 'skills', 'still-visible', 'SKILL.md'), instruction('still-visible'));
  registry.snapshot = async () => { throw new Error('Provider temporarily unavailable'); };
  const partial = await request({ action: 'list' });
  assert.equal(partial.success, true);
  assert.equal(partial.data.complete, false);
  assert.deepEqual(partial.data.catalog.counts, { available: null, automatic: null, manual: null, registered: null });
  assert.match(partial.data.registryError, /temporarily unavailable/);
  assert.equal(partial.data.skills[0].name, 'still-visible');
});

test('an unavailable preset service preserves local entries with explicit unknown availability', async t => {
  const { request, config, definitions } = await setup(t, { presets: false });
  const path = join(config.dshHome, 'skills', 'unknown-context', 'SKILL.md');
  await mkdir(join(config.dshHome, 'skills', 'unknown-context'), { recursive: true });
  await writeFile(path, instruction('unknown-context'));
  definitions.set('unknown-context', {
    name: 'unknown-context', description: 'Test unknown-context', path, source: 'user-dsh', provider: 'filesystem',
    invocation: { modelInvocable: true, userInvocable: true }, content: 'Use the workflow.',
  });
  const result = await request({ action: 'list' });
  assert.equal(result.success, true);
  assert.equal(result.data.complete, false);
  assert.equal(result.data.catalog.complete, false);
  assert.deepEqual(result.data.catalog.counts, { available: null, automatic: null, manual: null, registered: null });
  assert.deepEqual(result.data.catalog.availableIds, []);
  assert.equal(result.data.context.presetId, 'unknown');
  assert.equal(result.data.skills[0].effective, false);
  assert.deepEqual(result.data.skills[0].availability, { status: 'unknown', automatic: false, manual: false, presetId: 'unknown' });
  const skill = result.data.skills[0];
  const policy = await request({ action: 'setPolicy', id: skill.id, expectedHash: skill.hash, modelInvocable: true, userInvocable: false });
  assert.equal(policy.success, true, 'local editing remains usable when the effective preset cannot be inspected');
  assert.equal(policy.data.synchronization.catalog, 'unknown', 'a complete host registry cannot verify an unknown preset composition');
  assert.equal(policy.data.skill.availability.status, 'unknown');
});

test('batchToggle reports partial success once and only mutates the selected project view', async t => {
  const { directory, request, sessionMap, workspaces, leases, presetCalls } = await setup(t);
  const projectA = join(directory, 'live-project');
  const projectB = join(directory, 'chosen-project');
  await mkdir(join(projectA, '.git'), { recursive: true });
  await mkdir(join(projectB, '.git'), { recursive: true });
  const actualSession = { id: 'actual-session', header: { cwd: projectA }, recordedPreset: 'standard' };
  sessionMap.set(actualSession.id, actualSession);
  workspaces.push({ path: projectB, title: 'Chosen project' });
  for (const path of [projectA, projectB]) {
    await mkdir(join(path, '.dsh', 'skills', 'same-workflow'), { recursive: true });
    await writeFile(join(path, '.dsh', 'skills', 'same-workflow', 'SKILL.md'), instruction('same-workflow'));
  }
  const actual = await request({ action: 'list', sessionId: actualSession.id });
  const foreignId = actual.data.skills.find(row => row.source === 'project-dsh').id;
  const options = await request({ action: 'contexts', sessionId: actualSession.id });
  const workspaceId = options.data.workspaces.find(row => row.path === projectB).id;
  const view = { sessionId: actualSession.id, workspaceId, presetId: 'minimal' };
  const selected = await request({ action: 'list', ...view });
  const selectedId = selected.data.skills.find(row => row.source === 'project-dsh').id;
  const previousRevision = (await request({ action: 'revision' })).data.revision;
  const result = await request({ action: 'batchToggle', ...view, ids: [selectedId, foreignId, 'missing-id', selectedId], enabled: false });
  assert.equal(result.success, true);
  assert.equal(result.data.changed, 1);
  assert.equal(result.data.results.length, 3, 'duplicate selections are only processed once');
  assert.deepEqual(result.data.results.map(row => [row.id, row.success]), [[selectedId, true], [foreignId, false], ['missing-id', false]]);
  assert.ok(result.data.results.slice(1).every(row => row.error.code === 'NOT_FOUND'));
  assert.equal(result.data.revision, previousRevision + 1, 'one batch publishes one explicit mutation revision without provider events');
  assert.equal((await request({ action: 'revision' })).data.revision, result.data.revision);
  await assert.rejects(readFile(join(projectB, '.dsh', 'skills', 'same-workflow', 'SKILL.md')), { code: 'ENOENT' });
  assert.match(await readFile(join(projectB, '.dsh', 'skills', 'same-workflow', 'SKILL.md.disabled'), 'utf8'), /same-workflow/);
  assert.match(await readFile(join(projectA, '.dsh', 'skills', 'same-workflow', 'SKILL.md'), 'utf8'), /same-workflow/);
  assert.equal(actualSession.header.cwd, projectA);
  assert.equal(actualSession.recordedPreset, 'standard');
  assert.equal(presetCalls.select, 0);
  assert.equal(presetCalls.create, 0);
  assert.ok(leases.some(lease => lease.key.preset === 'minimal'), 'the chosen preset is inspected through its own detached lease');
});

for (const [label, rows] of [
  ['no filesystem provider', []],
  ['a disabled filesystem provider', [{ moduleName: '@deepseek-ai/dsh-skill-filesystem', enabled: false }]],
]) {
  test(`an explicit preset with ${label} verifies a local create against its current definition`, async t => {
    const { request, config, presets, snapshots, leases, presetCalls } = await setup(t);
    let inventoryCalls = 0;
    const retainedInspectionCalls = [];
    presets.compositionInventory = async () => {
      inventoryCalls++;
      return [
        { id: 'minimal', rows },
        { id: 'standard', rows: [{ moduleName: '@deepseek-ai/dsh-skill-filesystem', enabled: true }] },
      ];
    };
    presets.inspectCompositions = (...args) => {
      retainedInspectionCalls.push(args);
      // An old retained revision of the SAME id must not describe this new lease.
      return [{ id: 'minimal', modules: [{ moduleName: '@deepseek-ai/dsh-skill-filesystem' }] }];
    };
    const view = { presetId: 'minimal', workspaceId: 'user' };
    const listed = await request({ action: 'list', ...view });
    assert.equal(listed.success, true);
    const rootId = listed.data.roots.find(row => row.source === 'user-dsh').id;
    const created = await request({ action: 'create', ...view, rootId, name: 'detached-local-workflow', description: 'Stored locally for a preset that does not expose filesystem skills.' });

    assert.equal(created.success, true);
    assert.equal(created.data.synchronization.catalog, 'verified', 'confirmed absence from a preset without an active filesystem source must not remain pending');
    assert.deepEqual(created.data.skill.availability, { status: 'not_in_preset', automatic: false, manual: false, presetId: 'minimal' });
    assert.equal(created.data.skill.effective, false);
    assert.match(await readFile(join(config.dshHome, 'skills', 'detached-local-workflow', 'SKILL.md'), 'utf8'), /detached-local-workflow/);
    assert.ok(inventoryCalls > 0, 'a cold or explicit preset checks the current composition definition');
    assert.deepEqual(retainedInspectionCalls, [], 'a successful current-definition check must not consult older retained revisions');
    assert.ok(snapshots.every(lookup => leases.some(lease => lease.key === lookup.scope)));
    assert.equal(presetCalls.create, 0);
    assert.equal(presetCalls.select, 0);
  });
}

test('a live preset verifies local creation from its exact retained composition rather than the current definition', async t => {
  const { directory, request, presets, agents, sessionMap, snapshots, leases, presetCalls } = await setup(t);
  const project = join(directory, 'retained-live-project');
  await mkdir(join(project, '.git'), { recursive: true });
  const session = { id: 'retained-live-session', header: { cwd: project }, recordedPreset: 'standard' };
  const liveContext = { preset: 'standard' };
  const live = { ctx: liveContext, session };
  sessionMap.set(session.id, session);
  agents.set(session.id, live);
  let inventoryCalls = 0;
  const inspectionCalls = [];
  presets.compositionInventory = async () => {
    inventoryCalls++;
    // The current definition differs from the revision this Agent still retains.
    return [{ id: 'standard', rows: [{ moduleName: '@deepseek-ai/dsh-skill-filesystem', enabled: true }] }];
  };
  presets.inspectCompositions = (...args) => {
    inspectionCalls.push(args);
    return args[0] === liveContext
      ? [{ id: 'standard', modules: [] }]
      : [{ id: 'standard', modules: [{ moduleName: '@deepseek-ai/dsh-skill-filesystem' }] }];
  };
  const listed = await request({ action: 'list', sessionId: session.id });
  assert.equal(listed.success, true);
  const rootId = listed.data.roots.find(row => row.source === 'project-dsh').id;
  const created = await request({ action: 'create', sessionId: session.id, rootId, name: 'live-local-workflow', description: 'Stored locally while the live retained preset has no filesystem source.' });

  assert.equal(created.success, true);
  assert.equal(created.data.synchronization.catalog, 'verified');
  assert.deepEqual(created.data.skill.availability, { status: 'not_in_preset', automatic: false, manual: false, presetId: 'standard' });
  assert.match(await readFile(join(project, '.dsh', 'skills', 'live-local-workflow', 'SKILL.md'), 'utf8'), /live-local-workflow/);
  assert.ok(inspectionCalls.length > 0);
  assert.ok(inspectionCalls.every(args => args.length === 1 && args[0] === liveContext), 'live inspection must always address that Agent context');
  assert.equal(inventoryCalls, 0, 'the latest definition does not describe an already running Agent');
  assert.ok(snapshots.every(lookup => lookup.scope === live), 'actual catalog reads keep the live Agent scope');
  assert.equal(leases.length, 0, 'a live inspection does not acquire an unrelated current-definition lease');
  assert.equal(presetCalls.create, 0);
  assert.equal(presetCalls.select, 0);
});
