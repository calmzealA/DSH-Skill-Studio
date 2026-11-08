import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { githubFiles, checkGithubUpdate } from '../src/github.mjs';

const COMMIT = '1'.repeat(40);
const ROOT = '2'.repeat(40);
const SKILLS = '3'.repeat(40);
const HELPER = '4'.repeat(40);
const md = '---\nname: helper\ndescription: A useful test skill\n---\n\nRead references/guide.md.\n';

function blob(path, text, extra = {}) {
  const data = Buffer.from(text);
  const sha = createHash('sha1').update(`blob ${data.length}\0`).update(data).digest('hex');
  return { entry: { path, mode: '100644', type: 'blob', sha, size: data.length, ...extra }, content: data.toString('base64') };
}

function fixture(options = {}) {
  const calls = [];
  const files = options.files ?? [blob('SKILL.md', md), blob('references/guide.md', 'A guide.\n'), blob('assets/icon.bin', Buffer.from([0, 1, 200, 255]))];
  const ref = options.ref ?? 'main';
  const trees = {
    [ROOT]: { tree: [{ path: 'skills', type: 'tree', mode: '040000', sha: SKILLS }] },
    [SKILLS]: { tree: [{ path: 'helper', type: 'tree', mode: '040000', sha: HELPER }] },
    [HELPER]: { tree: files.map(file => file.entry), truncated: options.truncated ?? false },
  };
  const fetchImpl = async (url, init) => {
    assert.ok(url.startsWith('https://api.github.com/repos/acme/tools'));
    assert.equal(init.redirect, 'error');
    assert.equal(init.method, 'GET');
    assert.equal(init.headers.Authorization, undefined);
    calls.push(url);
    if (options.respond) {
      const response = options.respond(url, init);
      if (response) return response;
    }
    const apiPath = url.slice('https://api.github.com/repos/acme/tools'.length);
    let data;
    if (apiPath === '') data = { default_branch: ref };
    else if (apiPath.startsWith('/commits/')) {
      const requested = decodeURIComponent(apiPath.slice('/commits/'.length));
      if (requested !== ref && requested !== COMMIT) return Response.json({ message: 'Not found' }, { status: 404 });
      data = { sha: COMMIT, commit: { tree: { sha: ROOT } } };
    } else if (apiPath.startsWith('/git/trees/')) {
      const key = apiPath.slice('/git/trees/'.length).split('?')[0];
      data = structuredClone(trees[key]);
      if (options.rootSkill && key === ROOT && apiPath.includes('?')) data = { tree: files.map(file => file.entry) };
    } else if (apiPath.startsWith('/git/blobs/')) {
      const file = files.find(row => row.entry.sha === apiPath.slice('/git/blobs/'.length));
      data = file && { sha: file.entry.sha, size: file.entry.size, encoding: 'base64', content: file.content };
    }
    return data ? Response.json(data) : Response.json({ message: 'Not found' }, { status: 404 });
  };
  return { calls, fetchImpl, files };
}

test('pins a branch to a commit and downloads the complete skill bundle with binary resources', async () => {
  const f = fixture();
  const result = await githubFiles('https://github.com/acme/tools/tree/main/skills/helper', { fetchImpl: f.fetchImpl });
  assert.deepEqual(result.files.map(x => x.path), ['SKILL.md', 'references/guide.md', 'assets/icon.bin']);
  assert.deepEqual(Buffer.from(result.files[2].base64, 'base64'), Buffer.from([0, 1, 200, 255]));
  assert.equal(result.source.commit, COMMIT);
  assert.equal(result.source.ref, 'main');
  assert.equal(result.source.path, 'skills/helper');
  assert.equal(result.source.kind, 'tree');
  assert.ok(f.calls.some(x => x.includes(`/git/trees/${ROOT}`)));
  assert.ok(f.calls.every(x => !x.includes('/contents/') && !x.includes('raw.githubusercontent')));
});

test('GitHub executable blobs retain only portable executable permission metadata', async () => {
  const f = fixture({ files: [blob('SKILL.md', md), blob('scripts/run.sh', '#!/bin/sh\nexit 0\n', { mode: '100755' })] });
  const result = await githubFiles('https://github.com/acme/tools/tree/main/skills/helper', { fetchImpl: f.fetchImpl });
  assert.equal(result.files.find(file => file.path === 'SKILL.md').mode, 0o644);
  assert.equal(result.files.find(file => file.path === 'scripts/run.sh').mode, 0o755);
});

test('resolves branch names containing slashes and retains that ref for subsequent updates', async () => {
  const f = fixture({ ref: 'feature/skill' });
  const initial = await githubFiles('https://github.com/acme/tools/tree/feature/skill/skills/helper', { fetchImpl: f.fetchImpl });
  assert.equal(initial.source.ref, 'feature/skill');
  f.calls.length = 0;
  const next = await checkGithubUpdate(initial.source, { fetchImpl: f.fetchImpl });
  assert.equal(next.source.path, 'skills/helper');
  assert.equal(f.calls[0], 'https://api.github.com/repos/acme/tools/commits/feature%2Fskill');
});

test('a SKILL.md blob URL includes siblings and nested resources', async () => {
  const f = fixture();
  const result = await githubFiles('https://github.com/acme/tools/blob/main/skills/helper/SKILL.md', { fetchImpl: f.fetchImpl });
  assert.equal(result.files.length, 3);
  assert.equal(result.source.path, 'skills/helper');
  assert.equal(result.source.kind, 'tree');
});

test('a flat Markdown blob URL imports only that file', async () => {
  const f = fixture({ files: [blob('helper.md', md), blob('unrelated.md', 'unrelated')] });
  const result = await githubFiles('https://github.com/acme/tools/blob/main/skills/helper/helper.md', { fetchImpl: f.fetchImpl });
  assert.deepEqual(result.files.map(x => x.path), ['helper.md']);
  assert.equal(result.source.path, 'skills/helper/helper.md');
  assert.equal(result.source.kind, 'blob');
  const next = await checkGithubUpdate(result.source, { fetchImpl: f.fetchImpl });
  assert.equal(next.files.length, 1);
});

test('a repository URL imports a skill at its default branch root', async () => {
  const f = fixture({ rootSkill: true });
  const result = await githubFiles('https://github.com/acme/tools', { fetchImpl: f.fetchImpl });
  assert.equal(result.source.ref, 'main');
  assert.equal(result.source.path, '');
  assert.equal(result.files.length, 3);
});

test('a collection root requires a concrete skill directory rather than silently choosing one', async () => {
  const f = fixture({ respond: url => url.endsWith(`/git/trees/${ROOT}?recursive=1`) ? Response.json({ tree: [blob('skills/a/SKILL.md', md).entry, blob('skills/b/SKILL.md', md).entry] }) : undefined });
  await assert.rejects(githubFiles('https://github.com/acme/tools', { fetchImpl: f.fetchImpl }), { code: 'GITHUB_SELECT_SKILL' });
  assert.equal(f.calls.filter(x => x.includes('/git/blobs/')).length, 0);
});

test('rejects unsafe hosts, credentials, paths, and URL queries before making any request', async () => {
  const bad = [
    'http://github.com/acme/tools', 'https://evil.test/acme/tools', 'https://github.com.evil.test/acme/tools',
    'https://user:password@github.com/acme/tools', 'https://github.com:444/acme/tools',
    'https://github.com/acme/tools/tree/main/../secret', 'https://github.com/acme/tools/tree/main/%2e%2e/secret',
    'https://github.com/acme/tools/tree/main/x%2Fy', 'https://github.com/acme/tools?token=abc',
  ];
  let requested = false;
  for (const url of bad) await assert.rejects(githubFiles(url, { fetchImpl: () => { requested = true; throw new Error('Unexpected'); } }), error => ['GITHUB_URL', 'GITHUB_PATH'].includes(error.code));
  assert.equal(requested, false);
});

test('rejects symlinks, submodules, traversal entries, and truncated trees', async () => {
  for (const extra of [{ mode: '120000' }, { mode: '160000', type: 'commit' }, { path: '../escape.md' }]) {
    const f = fixture({ files: [blob('SKILL.md', md), blob('link', 'target', extra)] });
    await assert.rejects(githubFiles('https://github.com/acme/tools/tree/main/skills/helper', { fetchImpl: f.fetchImpl }), error => ['GITHUB_LINK', 'GITHUB_PATH'].includes(error.code));
    assert.equal(f.calls.filter(x => x.includes('/git/blobs/')).length, 0);
  }
  const f = fixture({ truncated: true });
  await assert.rejects(githubFiles('https://github.com/acme/tools/tree/main/skills/helper', { fetchImpl: f.fetchImpl }), { code: 'GITHUB_TRUNCATED' });
});

test('enforces file count, individual size, and aggregate size before downloading blobs', async () => {
  for (const limits of [{ maxFiles: 2 }, { maxFileBytes: 5 }, { maxTotalBytes: 10 }]) {
    const f = fixture();
    await assert.rejects(githubFiles('https://github.com/acme/tools/tree/main/skills/helper', { fetchImpl: f.fetchImpl, limits }), { code: 'GITHUB_TOO_LARGE' });
    assert.equal(f.calls.filter(x => x.includes('/git/blobs/')).length, 0);
  }
});

test('rejects content that does not match the commit-pinned blob hash', async () => {
  const f = fixture({ respond: url => url.includes('/git/blobs/') ? Response.json({ encoding: 'base64', content: Buffer.from('x'.repeat(Buffer.byteLength(md))).toString('base64') }) : undefined });
  await assert.rejects(githubFiles('https://github.com/acme/tools/tree/main/skills/helper', { fetchImpl: f.fetchImpl }), error => ['GITHUB_INTEGRITY', 'GITHUB_TOO_LARGE'].includes(error.code));
});

test('reports rate limits, missing repositories, and failed connections explicitly', async () => {
  for (const status of [403, 429]) await assert.rejects(githubFiles('https://github.com/acme/tools', { fetchImpl: async () => Response.json({}, { status }) }), { code: 'GITHUB_RATE_LIMIT' });
  await assert.rejects(githubFiles('https://github.com/acme/tools', { fetchImpl: async () => Response.json({}, { status: 404 }) }), { code: 'GITHUB_NOT_FOUND' });
  await assert.rejects(githubFiles('https://github.com/acme/tools', { fetchImpl: async () => { throw new Error('offline'); } }), { code: 'GITHUB_NETWORK' });
});

test('rejects a source record that attempts to escape GitHub API repository scope', async () => {
  await assert.rejects(checkGithubUpdate({ type: 'github', repository: '../secrets', ref: 'main', path: '' }), { code: 'GITHUB_SOURCE' });
});
