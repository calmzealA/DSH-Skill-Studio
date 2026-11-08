import React from 'react';
import Panel from './Panel.jsx';
import { zh, en } from './locales.mjs';
import style from './style.css';
import { contribution, PACKAGE, NS } from './wire.mjs';
import { createCatalogSynchronizer } from './catalog-sync.mjs';

export const inject = ['slots', 'locale', 'remote', 'sessions', 'layout'];
const PANEL_ID = 'laochen-skill-studio';
function Icon() {
  return React.createElement('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, 'aria-hidden': true },
    React.createElement('path', { d: 'M5 4h10l4 4v12H5zM15 4v5h4M8 13h8M8 16h5' }));
}

export function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'skill-studio: dictionaries');
  ctx.effect(() => {
    const node = document.createElement('style'); node.dataset.plugin = PACKAGE; node.textContent = style;
    document.head.append(node); return () => node.remove();
  }, 'skill-studio: styles');
  const mount = ctx.remote.$mount(contribution);
  const t = ctx.locale.bind(NS);
  const synchronizer = createCatalogSynchronizer(ctx);
  const mutations = new Set(['create', 'save', 'setPolicy', 'saveFile', 'deleteFile', 'toggle', 'delete', 'restore', 'applyImport', 'copy', 'batchToggle']);
  const revisionListeners = new Set();
  let lastSession;
  let revision = 0;
  let externalRevision = 0;
  let baseline = false;
  let disposed = false;
  let polling = false;
  function sessionId() {
    const rows = ctx.sessions.list.getSnapshot().byId;
    const active = Object.entries(rows).find(([, row]) => row.retainedBy?.mainView > 0)?.[0];
    if (active) lastSession = active;
    if (lastSession && !rows[lastSession]) lastSession = undefined;
    return lastSession;
  }
  ctx.effect(() => ctx.sessions.list.subscribe(() => { sessionId(); }), 'skill-studio: session target');
  async function invoke(action, args = {}) {
    await mount;
    const result = await ctx.get('remote.skillStudio').request({ action, ...args, sessionId: sessionId() });
    if (!result.ok) throw Object.assign(new Error(result.error.message), { code: result.error.code });
    if (!result.value.success) {
      const error = result.value.error;
      throw Object.assign(new Error(error.message), { code: error.code, ...(error.fsCode ? { fsCode: error.fsCode } : {}), ...(error.recoveryPath ? { recoveryPath: error.recoveryPath } : {}) });
    }
    return result.value.data;
  }
  async function call(action, args = {}) {
    const data = await invoke(action, args);
    if (mutations.has(action)) {
      // The Host waits for real filesystem discovery before we clear the
      // browser source's session caches. No fake manager/reset event is sent.
      const menu = await synchronizer.sync();
      data.synchronization = { ...data.synchronization, menu: menu.state };
      if (data.revision !== undefined) { revision = data.revision; baseline = true; }
    }
    return data;
  }
  async function pollRevision() {
    if (disposed || polling || document.visibilityState === 'hidden') return;
    polling = true;
    try {
      const next = await invoke('revision');
      if (disposed) return;
      const changed = baseline && next.revision !== revision;
      revision = next.revision; baseline = true;
      if (changed) {
        await synchronizer.sync();
        externalRevision++;
        for (const listener of revisionListeners) listener();
      }
    } catch { /* Connection UI owns offline/reconnect feedback; the next tick retries. */ }
    finally { polling = false; }
  }
  ctx.effect(() => {
    void pollRevision();
    const timer = setInterval(() => { void pollRevision(); }, 5000);
    const onVisible = () => { if (document.visibilityState !== 'hidden') void pollRevision(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      disposed = true; clearInterval(timer); synchronizer.dispose();
      document.removeEventListener('visibilitychange', onVisible); revisionListeners.clear();
    };
  }, 'skill-studio: cross-client catalogue refresh');
  function StudioPage() {
    // Follow the actual DSH locale store, including changes while the page is open.
    React.useSyncExternalStore(fn => ctx.locale.subscribe(fn), () => ctx.locale.getSnapshot());
    const observedRevision = React.useSyncExternalStore(listener => { revisionListeners.add(listener); return () => revisionListeners.delete(listener); }, () => externalRevision);
    return React.createElement(Panel, { call, t, externalRevision: observedRevision, back: () => ctx.layout.selectPanel(null) });
  }
  ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({ name: 'sidebar.panellist', id: PANEL_ID, order: 1.5, label: () => t('nav'), locale: NS }, Icon));
  ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: PANEL_ID, locale: NS }, StudioPage));
}
