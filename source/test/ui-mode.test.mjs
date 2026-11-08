import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { zh, en } from '../src/locales.mjs';

const directory = await mkdtemp(fileURLToPath(new URL('.ui-mode-', import.meta.url)));
const compiled = join(directory, 'Panel.mjs');
await build({ entryPoints: [fileURLToPath(new URL('../src/Panel.jsx', import.meta.url))], outfile: compiled, bundle: true, platform: 'node', format: 'esm', external: ['react'] });
const { default: Panel } = await import(pathToFileURL(compiled));
const tick = () => new Promise(resolve => setImmediate(resolve));
const text = node => typeof node === 'string' ? node : (node?.children || []).map(text).join('');
const translate = key => zh[key] || key;
const rows = renderer => renderer.root.findAllByType('article');
const scopeTab = (renderer, key) => renderer.root.findAllByType('button').find(node => node.props.role === 'tab' && text(node).startsWith(zh[key]));
const byText = (renderer, value) => renderer.root.findAllByType('button').find(node => text(node) === value);
const click = async node => { assert.ok(node, 'control exists'); assert.ok(!node.props.disabled, 'control is available'); await act(async () => { node.props.onClick(); await tick(); }); };
const change = async (node, value) => { await act(async () => { node.props.onChange({ target: { value } }); await tick(); }); };
const idList = renderer => rows(renderer).map(row => row.props['data-skill-id']);

async function fixture(fn) {
  const oldWindow = globalThis.window, oldDocument = globalThis.document;
  const state = { confirmed: true, confirm: true, calls: [], revision: 0 };
  globalThis.window = { addEventListener() {}, removeEventListener() {}, confirm() { return state.confirm; } };
  globalThis.document = { activeElement: null, addEventListener() {}, removeEventListener() {} };
  const local = Array.from({ length: 32 }, (_, index) => ({ id: `local-${index}`, rootId: 'local-root', name: `local-${index}`, description: `Local workflow ${index}`, source: 'user-dsh', path: `/skills/local-${index}/SKILL.md`, enabled: true, valid: true, readOnly: index === 29, modelInvocable: true, userInvocable: index !== 0 && index !== 31, issues: [], hash: `hash-${index}`, ...(index === 30 ? { shadowedBy: 'local-1' } : {}) }));
  const plugins = Array.from({ length: 8 }, (_, index) => ({ id: `provider:${index}`, rootId: 'providers', name: `plugin-${index}`, description: `Plugin workflow ${index}`, source: 'bundled', provider: 'builtin', enabled: true, valid: true, readOnly: true, modelInvocable: true, userInvocable: index !== 0, issues: [] }));
  const catalogFor = mode => {
    const registered = mode === 'standard' ? [...plugins, ...local.filter(skill => skill.enabled && !skill.shadowedBy)] : plugins;
    const available = registered.filter(skill => skill.id !== 'local-31');
    const confirmed = state.confirmed ? available : available.slice(0, 2);
    const automaticIds = confirmed.filter(skill => skill.modelInvocable).map(skill => skill.id);
    const manualIds = confirmed.filter(skill => skill.userInvocable).map(skill => skill.id);
    return { complete: state.confirmed, availableIds: confirmed.map(skill => skill.id), automaticIds, manualIds, registeredIds: registered.map(skill => skill.id), counts: state.confirmed ? { available: available.length, automatic: automaticIds.length, manual: manualIds.length, registered: registered.length } : { available: null, automatic: null, manual: null, registered: null } };
  };
  let lastMode = 'minimal';
  const snapshot = mode => {
    const catalog = catalogFor(mode), available = new Set(catalog.availableIds), automatic = new Set(catalog.automaticIds), manual = new Set(catalog.manualIds);
    return { roots: [{ id: 'local-root', source: 'user-dsh', path: '/skills', writable: true }, { id: 'providers', source: 'bundled', path: '', writable: false }], complete: state.confirmed, context: { workspaceLabel: 'Example', presetId: mode, hasSession: true }, catalog, skills: [...local, ...plugins].map(skill => ({ ...skill, availability: { status: available.has(skill.id) ? 'available' : skill.id === 'local-31' ? 'invocation_disabled' : !skill.enabled ? 'disabled' : skill.shadowedBy ? 'shadowed' : 'not_in_preset', automatic: automatic.has(skill.id), manual: manual.has(skill.id) } })) };
  };
  const call = async (action, args = {}) => {
    state.calls.push({ action, args });
    if (action === 'contexts') return { current: { workspaceId: 'user', presetId: 'minimal' }, workspaces: [], presets: [{ id: 'minimal' }, { id: 'standard' }] };
    if (action === 'list') { lastMode = args.presetId === 'standard' ? 'standard' : 'minimal'; return snapshot(lastMode); }
    if (action === 'read') {
      const skill = snapshot(lastMode).skills.find(item => item.id === args.id);
      return { skill, hash: skill.hash || 'plugin-hash', files: [], text: `---\nname: ${skill.name}\ndescription: Example\n---\nOriginal instructions.\n` };
    }
    if (action === 'validate') return { issues: [] };
    if (action === 'batchToggle') { args.ids.forEach(id => { local.find(skill => skill.id === id).enabled = args.enabled; }); return { results: args.ids.map(id => ({ id, success: true })), changed: args.ids.length }; }
    return {};
  };
  let renderer;
  try {
    await act(async () => { renderer = TestRenderer.create(React.createElement(Panel, { call, t: translate, externalRevision: 0, back() {} }), { createNodeMock: () => ({ focus() {}, querySelectorAll() { return []; }, addEventListener() {}, removeEventListener() {} }) }); await tick(); });
    await fn({ renderer, state, local, plugins, call, refresh: async () => { await act(async () => { renderer.update(React.createElement(Panel, { call, t: translate, externalRevision: ++state.revision, back() {} })); await tick(); }); } });
  } finally { await act(async () => renderer?.unmount()); globalThis.window = oldWindow; globalThis.document = oldDocument; }
}

test('current mode defaults to its 8 confirmed skills rather than the 40-item library, including location counts and read-only details', async () => {
  await fixture(async ({ renderer, plugins }) => {
    assert.deepEqual(idList(renderer), plugins.map(skill => skill.id));
    assert.equal(text(scopeTab(renderer, 'currentModeView')), `${zh.currentModeView}8`);
    assert.equal(text(scopeTab(renderer, 'libraryView')), `${zh.libraryView}40`);
    const sidebar = renderer.root.findByType('aside');
    assert.ok(!text(sidebar).includes(zh.personalSkills), 'empty mode sources are not shown with installed-file counts');
    assert.ok(text(sidebar).includes(`${zh.scope_provided}8`));
    assert.equal(renderer.root.findAll(node => node.props.role === 'switch').length, 0, 'current mode has no file toggle');
    assert.equal(renderer.root.findAllByType('select').some(node => node.props['aria-label'] === zh.allStates), false);
    await click(rows(renderer)[0].findByProps({ className: 'dss-rowcontent' }));
    assert.equal(renderer.root.findAll(node => node.props.role === 'switch').length, 0, 'read-only provider details have no fake blue switches');
    assert.ok(text(renderer.root).includes(zh.providerProvided));
    assert.ok(!text(renderer.root.findByProps({ className: 'dss-detail' })).includes(zh.fileEnabled));
  });
});

test('manual invocation filter matches its catalog IDs and excludes automatic-only skills', async () => {
  await fixture(async ({ renderer, plugins }) => {
    const countButtons = renderer.root.findByProps({ className: 'dss-modecounts' });
    await click(countButtons.findAllByType('button').find(node => text(node).startsWith(zh.manualFilter)));
    assert.deepEqual(idList(renderer), plugins.filter(skill => skill.userInvocable).map(skill => skill.id));
    assert.ok(!idList(renderer).includes('provider:0'));
    assert.ok(text(renderer.root.findByType('aside')).includes(`${zh.scope_provided}7`));
    await click(countButtons.findAllByType('button').find(node => text(node).startsWith(zh.automaticFilter)));
    assert.equal(rows(renderer).length, 8);
  });
});

test('the skill library keeps file management separate and never batch-mutates hidden selections', async () => {
  await fixture(async ({ renderer, state }) => {
    await click(scopeTab(renderer, 'libraryView'));
    assert.equal(rows(renderer).length, 40);
    assert.equal(renderer.root.findAll(node => node.props.role === 'switch').length, 31, 'only writable local files get switches');
    assert.ok(text(rows(renderer).find(row => row.props['data-skill-id'] === 'local-0')).includes(zh.fileEnabled));
    assert.ok(text(rows(renderer).find(row => row.props['data-skill-id'] === 'local-31')).includes(zh.availability_invocation_disabled));
    for (const id of ['local-0', 'local-1']) await act(async () => { rows(renderer).find(row => row.props['data-skill-id'] === id).findByType('input').props.onChange(); });
    await change(renderer.root.findByProps({ 'aria-label': zh.search }), 'local-1');
    await click(byText(renderer, zh.disableSelected));
    assert.deepEqual(state.calls.find(item => item.action === 'batchToggle').args.ids, ['local-1']);
    await click(scopeTab(renderer, 'currentModeView'));
    assert.equal(renderer.root.findAll(node => node.props.role === 'toolbar').length, 0);
    await click(scopeTab(renderer, 'libraryView'));
    assert.equal(renderer.root.findAll(node => node.props.role === 'toolbar').length, 0, 'view switching clears old selections');
  });
});

test('mode changes follow the authoritative winner IDs and a dirty draft can block view switching', async () => {
  await fixture(async ({ renderer, state }) => {
    await change(renderer.root.findAllByType('select')[1], 'standard');
    assert.equal(rows(renderer).length, 38);
    assert.ok(!idList(renderer).includes('local-30'), 'the shadowed copy is excluded');
    assert.ok(!idList(renderer).includes('local-31'), 'both invocation controls off is not usable');
    await click(rows(renderer).find(row => row.props['data-skill-id'] === 'local-0').findByProps({ className: 'dss-rowcontent' }));
    const toggle = renderer.root.findAll(node => node.props.role === 'switch').find(node => node.props['aria-label'] === zh.allowModel);
    await click(toggle);
    state.confirm = false;
    await click(scopeTab(renderer, 'libraryView'));
    assert.equal(scopeTab(renderer, 'currentModeView').props['aria-selected'], true);
    assert.equal(renderer.root.findAll(node => node.props.role === 'switch').find(node => node.props['aria-label'] === zh.allowModel).props['aria-checked'], false, 'draft survives declined navigation');
    state.confirm = true;
    await click(scopeTab(renderer, 'libraryView'));
    assert.equal(scopeTab(renderer, 'libraryView').props['aria-selected'], true);
    assert.equal(renderer.root.findAll(node => node.props.className === 'dss-detail').length, 0);
  });
});

test('an incomplete catalog shows only confirmed items with unknown totals instead of zero availability', async () => {
  await fixture(async ({ renderer, state, refresh }) => {
    state.confirmed = false;
    await refresh();
    assert.equal(rows(renderer).length, 2);
    assert.equal(text(scopeTab(renderer, 'currentModeView')), `${zh.currentModeView}—`);
    assert.ok(text(renderer.root).includes(zh.catalogUnknown));
    assert.ok(text(renderer.root.findByProps({ className: 'dss-listhead' })).includes(`${zh.confirmedSkills} 2`));
    const counts = renderer.root.findByProps({ className: 'dss-modecounts' });
    assert.ok(!text(counts).includes('0'));
    state.confirmed = true;
    await refresh();
    assert.equal(rows(renderer).length, 8);
    assert.equal(renderer.root.findAllByProps({ className: 'dss-catalogstatus' }).length, 0);
  });
});

test.after(async () => { await rm(directory, { recursive: true, force: true }); });
