import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { zh, en } from '../src/locales.mjs';

const folder = await mkdtemp(fileURLToPath(new URL('.ui-interaction-', import.meta.url)));
const outfile = join(folder, 'Panel.mjs');
await build({ entryPoints: [fileURLToPath(new URL('../src/Panel.jsx', import.meta.url))], outfile, bundle: true, platform: 'node', format: 'esm', external: ['react'] });
const { default: Panel, presetDisplayName, rootLabel, errorDetails } = await import(pathToFileURL(outfile));
const tick = () => new Promise(resolve => setImmediate(resolve));
const text = node => typeof node === 'string' ? node : (node?.children || []).map(text).join('');
const button = (renderer, label) => renderer.root.findAllByType('button').find(node => text(node) === label);
const click = async node => { assert.ok(node, 'button exists'); assert.ok(!node.props.disabled, 'button is available'); await act(async () => { node.props.onClick(); await tick(); }); };
const t = key => zh[key] || key;

async function fixture(fn) {
  const priorWindow = globalThis.window;
  const priorDocument = globalThis.document;
  globalThis.window = { addEventListener() {}, removeEventListener() {}, confirm() { return true; } };
  globalThis.document = { activeElement: null, addEventListener() {}, removeEventListener() {} };
  let renderer;
  const skill = { id: 'local-1', name: 'save-check', description: 'A save workflow', source: 'project-dsh', rootId: 'workspace', path: '/project/.dsh/skills/save-check/SKILL.md', enabled: true, valid: true, modelInvocable: true, userInvocable: true, hash: 'one', availability: { status: 'available', automatic: true, manual: true }, issues: [] };
  let current = { skill, text: '---\nname: save-check\ndescription: A save workflow\n---\nOriginal body\n', hash: 'one', files: [] };
  const state = { calls: [], failSave: true, failListAfterSave: false, committed: false, failResource: false };
  const list = () => ({ roots: [{ id: 'workspace', source: 'project-dsh', path: '/project/.dsh/skills', writable: true }], skills: [{ ...current.skill, hash: current.hash }], context: { workspaceLabel: state.workspaceLabel || 'Writing project', workspacePath: state.hasWorkspace === false ? undefined : state.workspacePath || '/project', presetId: state.currentMode || 'standard', hasSession: state.hasSession === true }, catalog: { complete: true, availableIds: ['local-1'], automaticIds: current.skill.modelInvocable ? ['local-1'] : [], manualIds: current.skill.userInvocable ? ['local-1'] : [], counts: { available: 1, automatic: current.skill.modelInvocable ? 1 : 0, manual: current.skill.userInvocable ? 1 : 0, registered: 1 } } });
  const call = async (action, args) => {
    state.calls.push({ action, args });
    if (action === 'contexts') return { current: { workspaceId: 'workspace-id', presetId: 'standard' }, workspaces: [{ id: 'workspace-id', label: 'Writing project' }], presets: [{ id: 'standard' }, { id: 'minimal' }, { id: 'standard-copy', name: 'Custom mode' }] };
    if (action === 'list') { if (state.committed && state.failListAfterSave) throw Object.assign(new Error('List connection failed'), { code: 'OFFLINE' }); return list(); }
    if (action === 'read') return current;
    if (action === 'validate') return { issues: [] };
    if (action === 'previewGithub') return { token: 'preview-1', skills: [{ name: 'import-example', description: 'Import example', issues: [], conflict: false }] };
    if (action === 'applyImport') return { installed: [], skipped: [{ name: 'import-example', reason: 'The file is temporarily in use.' }] };
    if (action === 'setPolicy' || action === 'save') {
      if (state.failSave) throw Object.assign(new Error('rename failed: file used by scanner'), { code: state.errorCode || 'FILE_BUSY', fsCode: 'EBUSY', recoveryPath: state.errorCode === 'RECOVERY_REQUIRED' ? '/restore/original-files' : undefined });
      state.committed = true;
      current = action === 'save' ? { ...current, text: args.text, hash: 'two' } : { ...current, skill: { ...current.skill, modelInvocable: args.modelInvocable, userInvocable: args.userInvocable }, hash: 'two' };
      return { ...current, synchronization: { catalog: 'verified', menu: 'synced' } };
    }
    return {};
  };
  try {
    await act(async () => { renderer = TestRenderer.create(React.createElement(Panel, { call, t, externalRevision: 0, back() {} }), { createNodeMock: () => ({ focus() {}, querySelectorAll() { return []; }, addEventListener() {}, removeEventListener() {} }) }); await tick(); });
    await click(renderer.root.findByProps({ className: 'dss-rowcontent' }));
    await fn({ state, renderer, call, current: () => current, rerender: async revision => { await act(async () => { renderer.update(React.createElement(Panel, { call, t, externalRevision: revision, back() {} })); await tick(); }); } });
  } finally { await act(async () => renderer?.unmount()); globalThis.window = priorWindow; globalThis.document = priorDocument; }
}

test('failed policy save keeps the draft and persistent local error through reads, refreshes and locale changes; retry uses the current controls', async () => {
  await fixture(async ({ renderer, state, rerender, call }) => {
    const userSwitch = () => renderer.root.findAllByType('button').find(node => node.props.role === 'switch' && node.props['aria-label'] === zh.allowUser);
    await click(userSwitch());
    assert.equal(userSwitch().props['aria-checked'], false);
    await click(button(renderer, zh.savePolicy));
    let alerts = renderer.root.findAll(node => node.props.role === 'alert');
    assert.equal(alerts.length, 1, 'the save error appears once beside the detail controls');
    assert.ok(text(alerts[0]).includes(zh.error_FILE_BUSY));
    assert.ok(text(alerts[0]).includes('FILE_BUSY\nEBUSY\nrename failed'));
    assert.equal(userSwitch().props['aria-checked'], false, 'failed save does not revert the switch');
    assert.ok(button(renderer, zh.errorRetry));
    await click(renderer.root.findByProps({ 'aria-label': zh.refresh }));
    assert.equal(renderer.root.findAll(node => node.props.role === 'alert').length, 1, 'manual refresh does not clear the error');
    await rerender(1);
    assert.equal(renderer.root.findAll(node => node.props.role === 'alert').length, 1, 'external list refresh must not dismiss a failed save');
    await act(async () => { renderer.update(React.createElement(Panel, { call, t: key => en[key] || key, externalRevision: 2 })); await tick(); });
    assert.ok(text(renderer.root).includes(en.error_FILE_BUSY), 'the retained error follows the host language');
    await act(async () => { renderer.update(React.createElement(Panel, { call, t, externalRevision: 3 })); await tick(); });
    state.failSave = false;
    await click(button(renderer, zh.errorRetry));
    assert.equal(renderer.root.findAll(node => node.props.role === 'alert').length, 0);
    assert.ok(text(renderer.root).includes(zh.saved));
    assert.equal(state.calls.filter(item => item.action === 'setPolicy').at(-1).args.userInvocable, false);
    assert.ok(!text(renderer.root).includes(zh.syncVerified), 'technical synchronization text is hidden until requested');
  });
});

test('failed instruction save preserves the text; a saved file with a failed list refresh is reported as saved', async () => {
  await fixture(async ({ renderer, state, current }) => {
    await click(button(renderer, zh.editInstructions));
    const editor = () => renderer.root.findByProps({ 'aria-label': zh.editorLabel });
    const draft = current().text + '\nKeep this new paragraph.';
    await act(async () => { editor().props.onChange({ target: { value: draft } }); });
    await click(button(renderer, zh.save));
    assert.equal(editor().props.value, draft);
    assert.equal(current().text.includes('new paragraph'), false, 'the failed write does not change the saved file');
    state.failSave = false; state.failListAfterSave = true;
    await click(button(renderer, zh.errorRetry));
    assert.equal(current().text, draft);
    assert.equal(renderer.root.findAll(node => node.props.role === 'alert').length, 0, 'list failure after commit is not a failed save');
    assert.ok(text(renderer.root).includes(zh.refreshAfterSaveFailed));
  });
});

test('recovery failures retain their location and do not offer an unsafe retry', async () => {
  await fixture(async ({ renderer, state }) => {
    state.errorCode = 'RECOVERY_REQUIRED';
    await click(renderer.root.findAllByType('button').find(node => node.props.role === 'switch' && node.props['aria-label'] === zh.allowUser));
    await click(button(renderer, zh.savePolicy));
    assert.ok(text(renderer.root).includes(zh.error_RECOVERY_REQUIRED));
    assert.ok(text(renderer.root).includes('/restore/original-files'));
    assert.equal(button(renderer, zh.errorRetry), undefined);
  });
});

test('official mode names preserve custom names and location labels hide implementation paths', () => {
  assert.equal(presetDisplayName({ id: 'standard' }, t), '标准模式');
  assert.equal(presetDisplayName({ id: 'minimal' }, t), '极简模式');
  assert.equal(presetDisplayName({ id: 'cordis' }, t), '创造模式');
  assert.equal(presetDisplayName({ id: 'standard', name: 'My own standard' }, t), 'My own standard');
  assert.equal(rootLabel({ source: 'project-dsh' }, t, 'Writing project'), 'Writing project');
  assert.equal(rootLabel({ source: 'user-agents' }, t), '共享技能');
  assert.equal(rootLabel({ source: 'bundled', label: 'Plugins' }, t), '插件自带');
  assert.equal(errorDetails({ code: 'RECOVERY_REQUIRED', fsCode: 'EPERM', message: 'Retained backup', recoveryPath: '/restore/me' }), 'RECOVERY_REQUIRED\nEPERM\nRetained backup\n/restore/me');
});

test('workspace and mode choices use direct names with accurate current/default suffixes', async () => {
  await fixture(async ({ renderer, state, rerender }) => {
    const choices = () => renderer.root.findAllByType('select').slice(0, 2).map(select => text(select.findAllByType('option').find(option => option.props.value === 'current')));
    assert.deepEqual(choices(), ['Writing project', '标准模式（默认）']);
    state.hasSession = true;
    await rerender(1);
    assert.deepEqual(choices(), ['Writing project（当前）', '标准模式（当前）']);
    assert.ok(!choices().some(label => label.includes('当前会话')));
  });
});

test('follow-current headers prefer refreshed runtime context over the initial context choices', async () => {
  await fixture(async ({ renderer, state, rerender }) => {
    const choices = () => renderer.root.findAllByType('select').slice(0, 2).map(select => text(select.findAllByType('option').find(option => option.props.value === 'current')));
    state.currentMode = 'minimal'; state.hasSession = true; state.workspaceLabel = 'Different project'; state.workspacePath = '/different';
    await rerender(1);
    assert.deepEqual(choices(), ['Different project（当前）', '极简模式（当前）']);
    state.hasWorkspace = false;
    await rerender(2);
    assert.deepEqual(choices(), ['个人技能', '极简模式（当前）'], 'an old workspace label must not survive a global-only current context');
  });
});

test('an import with skipped items keeps its preview and error inside the import dialog', async () => {
  await fixture(async ({ renderer }) => {
    await click(button(renderer, zh.import));
    const url = renderer.root.findByProps({ type: 'url' });
    await act(async () => { url.props.onChange({ target: { value: 'https://github.com/example/skills/tree/main/example' } }); });
    await click(button(renderer, zh.preview));
    assert.ok(text(renderer.root).includes('import-example'));
    await click(button(renderer, zh.importNow));
    const dialog = renderer.root.findAll(node => node.props.role === 'dialog');
    assert.equal(dialog.length, 1, 'partial failure must not dismiss the import dialog');
    assert.ok(text(dialog[0]).includes(zh.savedPartial));
    assert.ok(text(dialog[0]).includes('import-example'), 'the skill preview is still available');
  });
});

test.after(async () => { await rm(folder, { recursive: true, force: true }); });
