import test from 'node:test';
import assert from 'node:assert/strict';
import { realpath, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createRequire } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';
const exec = promisify(execFile);
const project = fileURLToPath(new URL('../', import.meta.url));

test('market generator refuses placeholders and its generated index passes the actual DSH validator', async () => {
  const dir = await mkdtemp(join(await realpath(tmpdir()), 'skill-studio-market-'));
  try {
    const output = join(dir, 'index.json');
    await assert.rejects(exec(process.execPath, ['scripts/generate-market.mjs', '--repository', 'https://github.com/example/dsh-skill-studio', '--commit', 'YOUR_SHA', '--output', output], { cwd: project }));
    const commit = '1234567890abcdef1234567890abcdef12345678';
    await exec(process.execPath, ['scripts/generate-market.mjs', '--repository', 'https://github.com/example/dsh-skill-studio', '--commit', commit, '--output', output], { cwd: project });
    const req = createRequire(import.meta.url);
    const runtimeReq = createRequire(req.resolve('@deepseek-ai/dsh/package.json'));
    const { parseMarketIndex, marketInstallTarget } = await import(pathToFileURL(runtimeReq.resolve('@deepseek-ai/dsh-plugin-market-index')));
    const value = JSON.parse(await readFile(output, 'utf8'));
    const index = parseMarketIndex(value, 'https://example.test/market/index.json');
    assert.equal(index.plugins[0].name, 'dsh-skill-studio');
    assert.equal(index.plugins[0].versions[0].source.commit, commit);
    assert.match(marketInstallTarget(index.plugins[0], index.plugins[0].versions[0]).spec, new RegExp(commit));
    for (const locale of ['zh', 'en']) {
      const metadata = JSON.parse(await readFile(join(project, 'locale', `${locale}.json`), 'utf8'));
      assert.ok(metadata.meta.title);
      await readFile(join(project, metadata.meta.detail));
    }
  } finally { await rm(dir, { recursive: true, force: true }); }
});
