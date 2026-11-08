import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import vm from 'node:vm';
import { createSnapshotStore } from '@deepseek-ai/dsh-client-store';
import { createCatalogSynchronizer } from '../src/catalog-sync.mjs';

// These are the actual packages inside the tested DSH runtime. In the web
// client bootClient mounts this same Cordis Loader over its bundle importer.
const dshRequire = createRequire(import.meta.resolve('@deepseek-ai/dsh/package.json'));
const cordis = await import(pathToFileURL(dshRequire.resolve('@deepseek-ai/cordis')).href);
const { default: Loader } = await import(pathToFileURL(dshRequire.resolve('@deepseek-ai/cordis-plugin-loader')).href);
const react = await import('react');
const jsxRuntime = await import('react/jsx-runtime');
const UI_SKILL = '@deepseek-ai/dsh-client-ui-skill';
const INPUT_TRIGGER = '@deepseek-ai/dsh-client-ui-input-trigger';

async function officialClientBundle(name) {
  let registration;
  const code = await readFile(dshRequire.resolve(`${name}/client`), 'utf8');
  vm.runInNewContext(code, {
    window: { __ModuleLoader__: { load(value) { registration = value; } } },
    AbortController, console, Map, Set, Promise,
  }, { filename: `${name}/lib/client.js` });
  assert.equal(registration.id, name);
  return registration.factory(specifier => {
    if (specifier === '@deepseek-ai/cordis') return cordis;
    if (specifier === '@deepseek-ai/dsh-client-store') return { createSnapshotStore };
    if (specifier === 'react') return react;
    if (specifier === 'react/jsx-runtime') return jsxRuntime;
    // No React view is rendered in this integration test. Ranking is the
    // only primitives function used by the real source's candidates path.
    if (specifier === '@deepseek-ai/dsh-client-ui-primitives') return {
      rankByName: (rows, query) => rows.filter(row => row.name.includes(query)),
    };
    throw new Error(`Unexpected browser bundle external: ${specifier}`);
  });
}

async function eventually(read, accept, label) {
  const deadline = Date.now() + 1500;
  do {
    const value = read();
    if (accept(value)) return value;
    await new Promise(resolve => setTimeout(resolve, 5));
  } while (Date.now() < deadline);
  assert.fail(`${label}: ${JSON.stringify(read())}`);
}

const skillNames = controller => Array.from(controller.menu.getSnapshot().groups)
  .filter(group => group.source === 'skill').flatMap(group => Array.from(group.items, row => row.name));

test('actual DSH ui-skill cache refreshes in retained sessions through the public browser Loader lifecycle', { timeout: 10_000 }, async t => {
  const skillPlugin = await officialClientBundle(UI_SKILL);
  const { InputTriggerService } = await officialClientBundle(INPUT_TRIGGER);
  const ctx = new cordis.Context();
  const sync = createCatalogSynchronizer(ctx);
  t.after(async () => { sync.dispose(); await ctx.fiber.dispose(); });

  let catalog = [{ name: 'workflow', description: 'Original instructions', modelInvocable: true }];
  const calls = [];
  const bindings = new Map();
  ctx.provide('sessions', {
    sessionOf: scope => [...bindings.values()].find(binding => binding.ctx === scope)?.session,
    binding: id => bindings.get(id),
    subagentAddress: () => undefined,
    list: { getSnapshot: () => ({ byId: {} }) },
    async using(id, _options, action) { return action({ binding: bindings.get(id) }); },
  });
  const skills = { async list({ sessionId }) {
      calls.push(sessionId);
      return { ok: true, value: { skills: catalog.map(row => ({ ...row })) } };
  } };
  ctx.provide('remote.skills', skills);
  ctx.provide('remote', {
    skills,
    $on() { return () => {}; },
  });
  ctx.provide('locale', { register: () => () => {}, bind: () => key => key });
  ctx.provide('slots', { inject() {}, register: () => () => {} });
  ctx.provide('sidebarRight', { openResource() {} });
  ctx.provide('uiConversation', { userText: { register() {} } });
  await ctx.plugin(InputTriggerService).await();
  await ctx.plugin(Loader).await();
  let unrelatedMounts = 0;
  const unrelated = { apply() { unrelatedMounts++; } };
  ctx.loader.internal = { async import(name) {
    if (name === UI_SKILL) return skillPlugin;
    if (name === 'unrelated-client') return unrelated;
    throw new Error(`Unexpected Loader import: ${name}`);
  } };
  await ctx.loader.create({ id: 'skill-ui', name: UI_SKILL });
  await ctx.loader.create({ id: 'unrelated', name: 'unrelated-client' });
  await ctx.loader.await();
  const entry = [...ctx.loader.entries()].find(row => row.options.name === UI_SKILL);
  const originalOptions = JSON.stringify(entry.options);

  async function session(id) {
    let scope;
    await ctx.plugin({ apply(child) { scope = child; } }).await();
    const binding = { sessionId: id, ctx: scope, session: { sessionId: id, getSnapshot: () => ({ openState: 'open' }) } };
    bindings.set(id, binding);
    return ctx.inputTriggers.sessionOf(scope);
  }
  const first = await session('previously-open-session');
  const second = await session('another-warmed-session');
  let revision = 0;
  function open(controller) {
    controller.track('', 0, { tier: 'plain' }, ++revision);
    controller.track('/', 1, { tier: 'plain' }, ++revision);
  }
  open(first);
  open(second);
  await eventually(() => skillNames(first), rows => rows.includes('workflow'), 'first slash catalogue did not warm');
  await eventually(() => skillNames(second), rows => rows.includes('workflow'), 'second slash catalogue did not warm');
  assert.equal(calls.length, 2, 'one actual ui-skill RPC per retained session');

  // Changing the Host response alone deliberately reproduces the reported
  // regression: closing/reopening the same session still reads cached data.
  catalog = [];
  open(first);
  await new Promise(resolve => setTimeout(resolve, 10));
  assert.deepEqual(skillNames(first), ['workflow']);
  assert.equal(calls.length, 2, 'reopening the old menu cannot invalidate ui-skill on its own');

  const result = await sync.sync();
  assert.equal(result.state, 'synced');
  assert.deepEqual(skillNames(first), [], 'a currently open menu immediately loses the disposed source rows');
  assert.deepEqual(skillNames(second), [], 'other previously warmed sessions lose stale rows too');
  open(first);
  open(second);
  await eventually(() => calls.length, count => count >= 4, 'source remount did not rewarm existing sessions');
  assert.deepEqual(skillNames(first), []);
  assert.deepEqual(skillNames(second), []);
  assert.deepEqual(Array.from(first.lexicon.getSnapshot().get('/') ?? []), []);

  catalog = [{ name: 'workflow', description: 'Enabled again', modelInvocable: false }];
  assert.equal((await sync.sync()).state, 'synced');
  open(first);
  open(second);
  await eventually(() => skillNames(first), rows => rows.includes('workflow'), 'same first session did not see re-enable');
  await eventually(() => skillNames(second), rows => rows.includes('workflow'), 'same second session did not see re-enable');
  assert.match(first.menu.getSnapshot().groups.find(group => group.source === 'skill').items[0].description, /Enabled again/);
  assert.equal(unrelatedMounts, 1, 'unrelated client plugins are never restarted');
  assert.equal(JSON.stringify(entry.options), originalOptions, 'refresh does not disable the entry or persist any configuration changes');
});

test('synchronizer coalesces concurrent requests, serializes later changes and stops scheduling on dispose', async () => {
  const waits = [];
  let active = 0;
  let maximumActive = 0;
  let restarts = 0;
  const fiber = { async restart() {
    restarts++;
    maximumActive = Math.max(maximumActive, ++active);
    await new Promise(resolve => waits.push(resolve));
    active--;
  } };
  const sync = createCatalogSynchronizer({ loader: { entries: () => [{ options: { name: UI_SKILL }, fiber }] } });
  const first = sync.sync();
  assert.equal(sync.sync(), first, 'same-tick mutations share a restart');
  await Promise.resolve();
  assert.equal(restarts, 1);
  assert.equal(sync.sync(), first, 'a mutation during refresh joins the drain');
  waits.shift()();
  await eventually(() => restarts, count => count === 2, 'a change arriving during restart needs a second pass');
  sync.dispose();
  waits.shift()();
  assert.equal((await first).reason, 'disposed');
  assert.equal((await sync.sync()).reason, 'disposed');
  assert.equal(restarts, 2);
  assert.equal(maximumActive, 1);
});

test('unsupported or failed client lifecycles return bounded explicit results without touching other entries', async () => {
  assert.deepEqual(await createCatalogSynchronizer({}).sync(), { state: 'unsupported', reason: 'loader-unavailable' });
  const entries = [{ options: { name: 'some-other-plugin' }, fiber: { restart() { assert.fail('wrong plugin'); } } }];
  const sync = createCatalogSynchronizer({ loader: { entries: () => entries } });
  assert.equal((await sync.sync()).reason, 'skill-plugin-unavailable');
  entries.push({ options: { name: UI_SKILL }, fiber: { restart() { throw new Error('Cannot activate official source'); } } });
  assert.deepEqual(await sync.sync(), { state: 'failed', reason: 'skill-plugin-restart-failed', message: 'Cannot activate official source' });
  entries.push({ options: { name: UI_SKILL }, fiber: { restart() { assert.fail('ambiguous source'); } } });
  assert.equal((await sync.sync()).reason, 'ambiguous-skill-plugin');
});
