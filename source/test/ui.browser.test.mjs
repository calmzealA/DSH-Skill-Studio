import test from 'node:test';
import assert from 'node:assert/strict';
import { realpath, mkdtemp, mkdir, writeFile, readFile, rm, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createServer } from 'node:http';
import { build } from 'esbuild';
import { chromium } from 'playwright';
import { SkillManager } from '../src/manager.mjs';

const browserPath = process.env.DSS_BROWSER_PATH || '/usr/bin/chromium';
let browserAvailable = true;
try { await access(browserPath); } catch { browserAvailable = false; }

test('browser: create, edit policies and resources, preview import, recover, and switch locale', { skip: !browserAvailable || process.env.DSS_RUN_BROWSER_TESTS !== '1', timeout: 60000 }, async () => {
  const dir = await mkdtemp(join(await realpath(tmpdir()), 'dss-ui-'));
  const rootPath = join(dir, 'skills');
  await mkdir(rootPath, { recursive: true });
  const roots = [{ id: 'personal', path: rootPath, source: 'user-dsh', label: 'Personal', rank: 400, writable: true }];
  const manager = new SkillManager({ stateDir: join(dir, 'state'), roots: async () => roots });
  await manager.request({ action: 'create', rootId: 'personal', name: 'research-brief', description: 'Research primary sources', text: '---\nname: research-brief\ndescription: Research primary sources\n---\n\nRead the source.\n' });
  const code = await build({ stdin: { contents: `import React from 'react'; import {createRoot} from 'react-dom/client'; import Panel from './src/Panel.jsx'; import {en,zh} from './src/locales.mjs'; const root=createRoot(document.getElementById('app')); const call=async(action,args={})=>{const response=await fetch('/api',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,...args})});const value=await response.json();if(value.error)throw Object.assign(new Error(value.error.message),{code:value.error.code});return value;}; let locale='en'; function render(){const dict=locale==='zh'?zh:en; root.render(React.createElement(Panel,{call,t:key=>dict[key]||key,back(){}}));} window.setLocale=value=>{locale=value;render();};render();`, resolveDir: resolve('.') }, bundle: true, format: 'iife', write: false, minify: false });
  const css = await readFile(new URL('../src/style.css', import.meta.url), 'utf8');
  const server = createServer(async (req, res) => {
    if (req.url === '/api') { try { let body = ''; for await (const chunk of req) body += chunk; const result = await manager.request(JSON.parse(body)); res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(result)); } catch (error) { res.setHeader('content-type', 'application/json'); res.end(JSON.stringify({ error: { message: error.message, code: error.code } })); } return; }
    if (req.url === '/client.js') { res.setHeader('content-type', 'application/javascript'); res.end(code.outputFiles[0].text); return; }
    res.setHeader('content-type', 'text/html'); res.end(`<!doctype html><meta charset="utf-8"><style>html,body,#app{margin:0;height:100%;} ${css}</style><div id="app"></div><script src="/client.js"></script>`);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ executablePath: browserPath, headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage({ viewport: { width: 1360, height: 900 } });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    // This standalone harness exercises file management; runtime-catalog truth
    // is covered separately with the actual DSH registry and mode fixtures.
    await page.getByRole('tab', { name: /^Skill library/ }).click();
    await page.locator('.dss-rowcontent').filter({ hasText: /^research-brief/ }).first().waitFor();
    await page.getByRole('button', { name: 'New skill', exact: true }).click();
    const create = page.getByRole('dialog', { name: 'Create a skill' });
    await create.getByRole('textbox', { name: 'Skill name' }).fill('writing-review');
    await create.getByRole('textbox', { name: 'Description', exact: true }).fill('Review clear and accurate writing');
    await create.getByRole('button', { name: 'Create skill', exact: true }).click();
    await page.locator('.dss-rowcontent').filter({ hasText: /^writing-review/ }).first().waitFor();
    await page.locator('.dss-rowcontent').filter({ hasText: /^writing-review/ }).first().click();
    let detail = page.getByRole('region', { name: 'writing-review', exact: true });
    await detail.getByRole('switch', { name: 'Allow automatic model selection', exact: true }).click();
    await detail.getByRole('button', { name: 'Save settings', exact: true }).click();
    await page.getByText('Saved', { exact: true }).waitFor();
    let listed = await manager.request({ action: 'list' });
    assert.equal(listed.skills.find(skill => skill.name === 'writing-review').modelInvocable, false);
    assert.equal(listed.skills.find(skill => skill.name === 'writing-review').userInvocable, true, 'invocation policies are independent');
    await detail.getByRole('button', { name: 'Disable file', exact: true }).click();
    await detail.getByText('File disabled', { exact: true }).waitFor();
    listed = await manager.request({ action: 'list' });
    assert.equal(listed.skills.find(skill => skill.name === 'writing-review').enabled, false);
    await detail.getByRole('button', { name: 'Enable file', exact: true }).click();
    await detail.getByRole('button', { name: 'Edit instructions', exact: true }).click();
    await detail.getByRole('textbox', { name: 'Skill instructions in Markdown' }).fill('---\nname: writing-review\ndescription: Review clear and accurate writing\ndisable-model-invocation: true\n---\n\n# Review\nCheck factual claims.\n');
    await detail.getByRole('button', { name: 'Save changes', exact: true }).click();
    await page.getByText('Saved', { exact: true }).waitFor();
    await detail.getByRole('tab', { name: 'Resources', exact: true }).click();
    await detail.getByRole('textbox', { name: 'Resource path', exact: true }).fill('references/checklist.md');
    await detail.getByRole('button', { name: 'Add text resource', exact: true }).click();
    await detail.getByRole('textbox', { name: 'Resource text editor' }).fill('Check the facts.\n');
    await detail.getByRole('button', { name: 'Save resource', exact: true }).click();
    await page.getByText('Resource saved', { exact: true }).waitFor();
    assert.equal(await readFile(join(rootPath, 'writing-review/references/checklist.md'), 'utf8'), 'Check the facts.\n');
    await detail.getByRole('button', { name: 'Close details', exact: true }).first().click();
    await page.getByRole('button', { name: 'Import', exact: true }).click();
    let importer = page.getByRole('dialog', { name: 'Import skills', exact: true });
    await importer.getByRole('tab', { name: 'Local files', exact: true }).click();
    await importer.locator('input[type=file]').first().setInputFiles({ name: 'SKILL.md', mimeType: 'text/markdown', buffer: Buffer.from('---\nname: imported-check\ndescription: Imported preview test\n---\n\nVerify the preview.\n') });
    await importer.getByRole('button', { name: 'Next', exact: true }).click();
    await importer.getByText('imported-check', { exact: true }).waitFor();
    listed = await manager.request({ action: 'list' });
    assert.equal(listed.skills.some(skill => skill.name === 'imported-check'), false, 'preview does not install');
    await importer.getByRole('button', { name: 'Import', exact: true }).click();
    await page.locator('.dss-rowcontent').filter({ hasText: /^imported-check/ }).first().waitFor();
    await page.locator('.dss-rowcontent').filter({ hasText: /^research-brief/ }).first().click();
    detail = page.getByRole('region', { name: 'research-brief', exact: true });
    page.once('dialog', dialog => dialog.accept());
    await detail.getByRole('button', { name: 'Remove skill', exact: true }).click();
    await page.getByText('Skill moved to recovery history', { exact: true }).waitFor();
    await page.getByRole('button', { name: 'History', exact: true }).click();
    const history = page.getByRole('dialog', { name: 'History', exact: true });
    const entry = history.locator('.dss-historyrow').filter({ hasText: 'research-brief' }).first();
    page.once('dialog', dialog => dialog.accept());
    await entry.getByRole('button', { name: 'Restore', exact: true }).click();
    await page.getByText('Recovery point restored', { exact: true }).waitFor();
    await history.getByRole('button', { name: 'Close', exact: true }).first().click();
    await page.locator('.dss-rowcontent').filter({ hasText: /^research-brief/ }).first().waitFor();
    await page.evaluate(() => window.setLocale('zh'));
    await page.getByRole('heading', { name: '技能工作台', exact: true }).waitFor();
    await page.getByRole('textbox', { name: '搜索技能、描述或路径' }).fill('writing');
    assert.equal(await page.locator('.dss-skillrow').count(), 1);
    await page.getByRole('textbox', { name: '搜索技能、描述或路径' }).fill('');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false, 'mobile has no horizontal overflow');
    await page.locator('.dss-rowcontent').filter({ hasText: /^writing-review/ }).first().click();
    detail = page.getByRole('region', { name: 'writing-review', exact: true });
    await detail.getByRole('button', { name: '关闭详情', exact: true }).first().waitFor();
    assert.equal(await page.evaluate(() => { const root = document.querySelector('.dss').getBoundingClientRect(), detail = document.querySelector('.dss-detail').getBoundingClientRect(); return detail.top >= root.top && detail.bottom <= root.bottom + 1 && detail.left >= root.left && detail.right <= root.right + 1; }), true, 'detail stays inside the host work area');
    assert.equal(await page.locator('.dss-main').isVisible(), false, 'narrow screens switch to detail page');
    await detail.getByRole('button', { name: '状态概览', exact: true }).click();
    await detail.getByRole('note').waitFor();
    await page.keyboard.press('Escape');
    assert.equal(await detail.getByRole('note').count(), 0, 'help dismisses with Escape');
    assert.deepEqual(errors, []);
  } finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); await rm(dir, { recursive: true, force: true }); }
});
