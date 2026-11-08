import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { en, zh, NS } from '../src/locales.mjs';

test('UI has matching English and Chinese dictionaries and all literal labels are registered', async () => {
  assert.equal(NS, 'skillStudio');
  assert.deepEqual(Object.keys(en).sort(), Object.keys(zh).sort());
  const source = await readFile(new URL('../src/Panel.jsx', import.meta.url), 'utf8');
  for (const [, key] of source.matchAll(/\bt\('([^']+)'\)/g)) assert.ok(key in en && key in zh, `missing UI label: ${key}`);
});

test('UI builds and renders the bilingual DSH shell; invocation editing preserves instruction content', async () => {
  const folder = await mkdtemp(fileURLToPath(new URL('.ui-test-', import.meta.url)));
  try {
    const outfile = join(folder, 'Panel.mjs');
    await build({ entryPoints: [fileURLToPath(new URL('../src/Panel.jsx', import.meta.url))], outfile, bundle: true, platform: 'node', format: 'esm', external: ['react'] });
    const { default: Panel, frontmatterFlag, scopeOf, markdownBody, SkillMarkdown, helpPlacement } = await import(pathToFileURL(outfile));
    for (const dictionary of [en, zh]) {
      const html = renderToStaticMarkup(React.createElement(Panel, { call: async () => ({ roots: [], skills: [] }), t: key => dictionary[key] || key, back() {} }));
      assert.ok(html.includes(dictionary.title));
      assert.ok(html.includes(dictionary.newSkill));
      assert.ok(html.includes(dictionary.import));
      assert.ok(html.includes('aria-busy="false"'));
      assert.ok(html.includes('role="status"'));
    }
    const input = '\uFEFF---\r\nname: example\r\ndescription: |\r\n  A multi-line description.\r\n---\r\n\r\n# Instructions\r\nKeep the original content.\r\n';
    const modified = frontmatterFlag(input, 'disable-model-invocation', true);
    assert.match(modified, /disable-model-invocation: true/);
    assert.ok(modified.includes('description: |\r\n  A multi-line description.'));
    assert.ok(modified.endsWith('\r\n# Instructions\r\nKeep the original content.\r\n'));
    assert.equal((frontmatterFlag(modified, 'disable-model-invocation', false).match(/disable-model-invocation:/g) || []).length, 1);
    assert.equal(frontmatterFlag('No frontmatter', 'user-invocable', false), 'No frontmatter');
    assert.equal(scopeOf('user-agents'), 'global');
    assert.equal(scopeOf('project-dsh'), 'workspace');
    assert.equal(scopeOf('bundled'), 'provided');
    assert.equal(scopeOf('custom'), 'custom');
    assert.equal(markdownBody('---\nname: example\ndescription: Example\n---\n# Workflow'), '# Workflow');
    const markdown = renderToStaticMarkup(React.createElement(SkillMarkdown, { text: '---\nname: example\ndescription: private routing metadata\n---\n# Workflow\n<script>alert(1)</script>\n\n[unsafe](javascript:alert) [source](https://example.com)\n\n```sh\necho hello\n```' }));
    assert.ok(markdown.includes('<h1>Workflow</h1>'));
    assert.ok(markdown.includes('&lt;script&gt;'));
    assert.ok(!markdown.includes('<script>'));
    assert.ok(!markdown.includes('href=\"javascript:'));
    assert.ok(markdown.includes('rel=\"noreferrer noopener\"'));
    assert.ok(!markdown.includes('private routing metadata'));
    assert.ok(markdown.includes('data-language=\"sh\"'));

    const bounds = { left: 100, right: 500, top: 60, bottom: 460 };
    for (const anchor of [
      { left: 104, right: 124, top: 70, bottom: 90 },
      { left: 475, right: 495, top: 70, bottom: 90 },
      { left: 104, right: 124, top: 425, bottom: 445 },
      { left: 475, right: 495, top: 425, bottom: 445 }
    ]) {
      const placement = helpPlacement(anchor, bounds, 180);
      const x = anchor.left + placement.left, y = anchor.top + placement.top;
      assert.ok(x >= bounds.left && x + placement.width <= bounds.right, 'help fits either horizontal edge');
      assert.ok(y >= bounds.top && y + Math.min(180, placement.maxHeight) <= bounds.bottom, 'help flips up near the lower edge');
    }
  } finally { await rm(folder, { recursive: true, force: true }); }
});


test('detail and dialogs remain inside the host work area, with separate policy persistence', async () => {
  const [source, css] = await Promise.all([
    readFile(new URL('../src/Panel.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/style.css', import.meta.url), 'utf8')
  ]);
  assert.ok(!/position\s*:\s*fixed/.test(css), 'no UI surface may escape to the full browser window');
  assert.match(css, /\.dss-overlay\{position:absolute;inset:0/);
  assert.match(source, /className="dss-detail" role="region"/);
  assert.ok(!source.includes("dialog === 'detail'"), 'detail is an inline pane, not a modal');
  assert.match(source, /call\('setPolicy'/);
  assert.match(source, /call\('batchToggle'/);
  assert.ok(!source.includes('item.rank'), 'numeric source priorities are not shown');
  assert.ok(source.includes('IT咖啡馆 X 老陈聊AI'));
  assert.match(source, /aria-expanded=\{open\}/);
  assert.match(source, /workspaceId, presetId/);
});
