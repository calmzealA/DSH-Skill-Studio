/**
 * Compatibility bridge for DSH's session-cached slash skill catalogue.
 *
 * DSH 0.2.1-rc.5 and 0.2.2-rc.1 expose no skill-source invalidation API.
 * Their public Cordis Loader/Fiber lifecycle can remount just the browser's
 * official ui-skill plugin. Its source disposer removes stale candidates from
 * every retained session, and source registration warms their new catalogues.
 * No host plugin, Agent, connection, or unrelated client module is restarted.
 */
const UI_SKILL = '@deepseek-ai/dsh-client-ui-skill';

/**
 * Create one page-owned, serial catalogue synchronizer.
 * Call sync only after the host registry observes a successful mutation.
 * Calls made in one tick share a pass; changes arriving during a restart get
 * one subsequent pass. Disposal prevents further passes without interrupting
 * the Loader's already-running lifecycle work.
 */
export function createCatalogSynchronizer(ctx) {
  let disposed = false;
  let requested = 0;
  let active;

  const unsupported = reason => ({ state: 'unsupported', reason });

  async function restartSource() {
    const loader = typeof ctx?.get === 'function' ? ctx.get('loader') : ctx?.loader;
    if (typeof loader?.entries !== 'function') return unsupported('loader-unavailable');
    const entries = [...loader.entries()].filter(entry => entry?.options?.name === UI_SKILL);
    if (entries.length !== 1) return unsupported(entries.length ? 'ambiguous-skill-plugin' : 'skill-plugin-unavailable');
    const entry = entries[0];
    if (entry.disabled || typeof entry.fiber?.restart !== 'function') return unsupported('skill-plugin-inactive');
    await entry.fiber.restart();
    return { state: 'synced', plugin: UI_SKILL };
  }

  async function drain(token) {
    let result;
    try {
      do {
        const current = requested;
        if (disposed) return unsupported('disposed');
        try {
          result = await restartSource();
        } catch (error) {
          result = { state: 'failed', reason: 'skill-plugin-restart-failed', message: String(error?.message ?? error).slice(0, 600) };
        }
        if (disposed) return unsupported('disposed');
        if (current === requested) return result;
      } while (true);
    } finally {
      // Clear synchronously before this promise settles; a new caller must
      // not join a completed drain and lose its requested revision.
      if (active === token) active = undefined;
    }
  }

  return {
    sync() {
      if (disposed) return Promise.resolve(unsupported('disposed'));
      requested++;
      if (!active) {
        // Defer the first pass so a synchronous burst becomes one restart.
        const token = {};
        token.promise = Promise.resolve().then(() => drain(token));
        active = token;
      }
      return active.promise;
    },
    dispose() { disposed = true; },
  };
}
