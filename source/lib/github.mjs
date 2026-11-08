import { createHash } from 'node:crypto';

const API = 'https://api.github.com';
const MiB = 1024 * 1024;
const DEFAULT_LIMITS = Object.freeze({ maxFiles: 200, maxFileBytes: 2 * MiB, maxTotalBytes: 8 * MiB });
const SHA = /^[a-f0-9]{40}$/i;

function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  throw error;
}

function cleanPath(value, allowEmpty = false) {
  if (typeof value !== 'string' || value.length > 1024 || value.includes('\\') || value.includes('\0')) {
    fail('GITHUB_PATH', 'Invalid repository path.');
  }
  if (allowEmpty && value === '') return '';
  const parts = value.split('/');
  if (parts.some(part => !part || part === '.' || part === '..' || part.includes(':'))) {
    fail('GITHUB_PATH', 'Repository paths must stay inside the selected skill directory.');
  }
  return parts.join('/');
}

function parseUrl(value) {
  if (typeof value !== 'string' || value.length > 2048) fail('GITHUB_URL', 'Enter a GitHub HTTPS repository, tree, or Markdown file URL.');
  let url;
  try { url = new URL(value); } catch { fail('GITHUB_URL', 'Invalid GitHub URL.'); }
  if (url.protocol !== 'https:' || url.hostname !== 'github.com' || url.port || url.username || url.password) {
    fail('GITHUB_URL', 'Only https://github.com/ URLs are accepted.');
  }
  if (url.search || url.hash) fail('GITHUB_URL', 'Remove the query string and fragment from the GitHub URL.');
  // Check the original spelling: URL parsing otherwise normalizes literal ../ away.
  const originalPath = value.match(/^https:\/\/github\.com(\/[^?#]*)?$/i)?.[1] ?? '';
  const rawParts = originalPath.replace(/^\//, '').replace(/\/$/, '').split('/');
  const parts = rawParts.map(part => {
    let decoded;
    try { decoded = decodeURIComponent(part); } catch { fail('GITHUB_PATH', 'Invalid URL path encoding.'); }
    if (decoded.includes('/') || decoded.includes('\\') || decoded === '.' || decoded === '..' || decoded.includes('\0')) {
      fail('GITHUB_PATH', 'Invalid URL path segment.');
    }
    return decoded;
  });
  if (parts.length < 2 || !/^[a-z0-9][a-z0-9-]*$/i.test(parts[0]) || !/^[a-z0-9_.-]+$/i.test(parts[1])) {
    fail('GITHUB_URL', 'The URL must contain an owner and repository.');
  }
  const repository = parts.slice(0, 2).join('/').replace(/\.git$/, '');
  if (parts.length === 2) return { repository, kind: 'repository', tail: [] };
  if (!['tree', 'blob'].includes(parts[2]) || parts.length < 4 || parts.length > 34 || parts.slice(3).some(x => !x)) {
    fail('GITHUB_URL', 'Use a repository URL, /tree/<ref>/<skill-directory>, or /blob/<ref>/<file>.md.');
  }
  return { repository, kind: parts[2], tail: parts.slice(3) };
}

function repoPath(repository) {
  return '/repos/' + repository.split('/').map(encodeURIComponent).join('/');
}

async function responseJson(response, maxBytes) {
  const length = Number(response.headers?.get?.('content-length') ?? 0);
  if (length > maxBytes) fail('GITHUB_TOO_LARGE', 'GitHub returned an oversized API response. Select a smaller skill directory.');
  if (response.body?.getReader) {
    const reader = response.body.getReader();
    const chunks = [];
    let size = 0;
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > maxBytes) {
          await reader.cancel();
          fail('GITHUB_TOO_LARGE', 'GitHub returned an oversized API response. Select a smaller skill directory.');
        }
        chunks.push(Buffer.from(value));
      }
    } finally { reader.releaseLock(); }
    try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
    catch (error) { if (error.code) throw error; fail('GITHUB_RESPONSE', 'GitHub returned invalid JSON.'); }
  }
  // The fallback also makes the transport injectable in deterministic tests.
  const result = await response.json();
  if (Buffer.byteLength(JSON.stringify(result)) > maxBytes) fail('GITHUB_TOO_LARGE', 'GitHub returned an oversized API response.');
  return result;
}

function client(options = {}) {
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const timeout = AbortSignal.timeout(120_000);
  const signal = options.signal ? AbortSignal.any([options.signal, timeout]) : timeout;
  return async function get(path, maxBytes = 4 * MiB, missingOkay = false) {
    signal.throwIfAborted();
    let response;
    try {
      response = await fetchImpl(API + path, {
        method: 'GET', redirect: 'error', signal: AbortSignal.any([signal, AbortSignal.timeout(30_000)]),
        headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'dsh-skill-studio/0.1.0' },
      });
    } catch (error) {
      if (options.signal?.aborted) throw options.signal.reason ?? error;
      if (signal.aborted || error.name === 'TimeoutError' || error.name === 'AbortError') fail('GITHUB_TIMEOUT', 'GitHub request timed out. Retry when the connection is available.');
      fail('GITHUB_NETWORK', 'Could not reach GitHub. Check the connection and retry.');
    }
    if (response.url && new URL(response.url).origin !== API) fail('GITHUB_URL', 'GitHub API redirects to another origin are refused.');
    if (response.status === 404 && missingOkay) return null;
    if (response.status === 403 || response.status === 429) {
      fail('GITHUB_RATE_LIMIT', 'GitHub denied the request or its public API rate limit was reached. Retry later; private repositories require a separate authenticated workflow.');
    }
    if (response.status === 404) fail('GITHUB_NOT_FOUND', 'GitHub repository, revision, or file was not found. Only public repositories are supported.');
    if (!response.ok) fail('GITHUB_HTTP', `GitHub request failed with HTTP ${response.status}.`);
    return responseJson(response, maxBytes);
  };
}

async function resolveCommit(get, repository, ref, missingOkay = false) {
  const commit = await get(`${repoPath(repository)}/commits/${encodeURIComponent(ref)}`, 2 * MiB, missingOkay);
  if (commit === null) return null;
  if (!SHA.test(commit.sha ?? '') || !SHA.test(commit.commit?.tree?.sha ?? '')) fail('GITHUB_RESPONSE', 'GitHub returned an invalid commit or tree identity.');
  return { sha: commit.sha.toLowerCase(), tree: commit.commit.tree.sha.toLowerCase() };
}

async function resolveUrl(parsed, get) {
  if (parsed.kind === 'repository') {
    const repo = await get(repoPath(parsed.repository));
    if (typeof repo.default_branch !== 'string' || !repo.default_branch) fail('GITHUB_RESPONSE', 'The repository has no default branch.');
    return { ref: repo.default_branch, path: '', kind: 'tree', commit: await resolveCommit(get, parsed.repository, repo.default_branch) };
  }
  if (SHA.test(parsed.tail[0] ?? '')) {
    const ref = parsed.tail[0];
    const path = cleanPath(parsed.tail.slice(1).join('/'), true);
    if (parsed.kind === 'blob' && !path) fail('GITHUB_PATH', 'A blob URL must identify a Markdown file.');
    return { ref, path, kind: parsed.kind, commit: await resolveCommit(get, parsed.repository, ref) };
  }
  // Longest valid ref wins, so branches such as feature/new-skill work without
  // guessing that every ref is a single path segment. Limit network work.
  if (parsed.tail.length > 16) fail('GITHUB_REF', 'This URL is too deeply nested. Use a 40-character commit URL, or select a shallower skill directory.');
  for (let split = parsed.tail.length; split >= 1; split--) {
    const ref = parsed.tail.slice(0, split).join('/');
    const commit = await resolveCommit(get, parsed.repository, ref, true);
    if (commit !== null) {
      const path = parsed.tail.slice(split).join('/');
      if (parsed.kind === 'blob' && !path) fail('GITHUB_PATH', 'A blob URL must identify a Markdown file.');
      return { ref, path: cleanPath(path, true), kind: parsed.kind, commit };
    }
  }
  fail('GITHUB_REF', 'No branch, tag, or commit matched this URL. Check the revision and skill path.');
}

function validateTree(tree) {
  if (tree?.truncated) fail('GITHUB_TRUNCATED', 'GitHub truncated the file listing. Select a smaller skill directory.');
  if (!Array.isArray(tree?.tree)) fail('GITHUB_RESPONSE', 'GitHub returned an invalid file tree.');
  for (const entry of tree.tree) {
    cleanPath(entry.path);
    if (entry.mode === '120000' || entry.mode === '160000' || entry.type === 'commit') {
      fail('GITHUB_LINK', `Symbolic links and submodules are not imported: ${entry.path}`);
    }
    if (!['tree', 'blob'].includes(entry.type) || !SHA.test(entry.sha ?? '')) fail('GITHUB_RESPONSE', 'GitHub returned an unsupported file entry.');
  }
  return tree.tree;
}

async function subtree(get, repository, initial, directory) {
  let sha = initial;
  const segments = directory ? cleanPath(directory).split('/') : [];
  for (const segment of segments) {
    const tree = await get(`${repoPath(repository)}/git/trees/${sha}`);
    // Only inspect the selected ancestor entry, not unrelated siblings: an
    // unrelated repository symlink must not prohibit a safe skill import.
    if (!Array.isArray(tree.tree) || tree.truncated) fail('GITHUB_TRUNCATED', 'The repository directory listing is incomplete.');
    const entry = tree.tree.find(row => row.path === segment);
    if (!entry) fail('GITHUB_NOT_FOUND', `Skill directory was not found: ${directory}`);
    if (entry.type !== 'tree' || entry.mode === '120000' || entry.mode === '160000' || !SHA.test(entry.sha ?? '')) {
      fail('GITHUB_LINK', 'The selected skill path is not a regular repository directory.');
    }
    sha = entry.sha;
  }
  const tree = await get(`${repoPath(repository)}/git/trees/${sha}?recursive=1`);
  return validateTree(tree);
}

async function loadSelection(repository, selection, get, limits) {
  const { ref, commit } = selection;
  let directory = selection.path;
  let flatFile = null;
  if (selection.kind === 'blob') {
    const segments = cleanPath(selection.path).split('/');
    const file = segments.pop();
    if (!file.endsWith('.md')) fail('GITHUB_PATH', 'Select SKILL.md or a flat Markdown skill file.');
    directory = segments.join('/');
    if (file !== 'SKILL.md') flatFile = file;
  }
  const tree = await subtree(get, repository, commit.tree, directory);
  let entries = tree.filter(row => row.type === 'blob');
  if (flatFile) entries = entries.filter(row => row.path === flatFile);
  else if (!entries.some(row => row.path === 'SKILL.md')) {
    const nested = entries.filter(row => /(^|\/)SKILL\.md$/.test(row.path));
    fail('GITHUB_SELECT_SKILL', nested.length
      ? 'This directory contains skill collections. Open the specific skill folder on GitHub and paste its /tree/ URL.'
      : 'No SKILL.md was found. Paste the URL of a skill folder or a flat .md skill file.');
  }
  if (!entries.length) fail('GITHUB_NOT_FOUND', 'The selected Markdown skill file was not found.');
  if (entries.length > limits.maxFiles) fail('GITHUB_TOO_LARGE', `A skill may contain at most ${limits.maxFiles} files.`);
  let declaredTotal = 0;
  for (const entry of entries) {
    if (!Number.isSafeInteger(entry.size) || entry.size < 0 || entry.size > limits.maxFileBytes) fail('GITHUB_TOO_LARGE', `A skill file is too large: ${entry.path}`);
    declaredTotal += entry.size;
  }
  if (declaredTotal > limits.maxTotalBytes) fail('GITHUB_TOO_LARGE', 'The selected skill exceeds the total import size limit.');
  const files = new Array(entries.length);
  let cursor = 0;
  let actualTotal = 0;
  async function worker() {
    for (;;) {
      const index = cursor++;
      if (index >= entries.length) return;
      const entry = entries[index];
      const blob = await get(`${repoPath(repository)}/git/blobs/${entry.sha}`, Math.ceil(limits.maxFileBytes * 1.5) + 8192);
      if (blob.encoding !== 'base64' || typeof blob.content !== 'string') fail('GITHUB_RESPONSE', `GitHub returned an unsupported blob encoding: ${entry.path}`);
      const encoded = blob.content.replace(/\s/g, '');
      if (encoded.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(encoded)) fail('GITHUB_RESPONSE', 'GitHub returned invalid base64 file data.');
      const data = Buffer.from(encoded, 'base64');
      actualTotal += data.length;
      if (data.length !== entry.size || data.length > limits.maxFileBytes || actualTotal > limits.maxTotalBytes) fail('GITHUB_TOO_LARGE', 'Downloaded skill size does not match the safe file listing.');
      const digest = createHash('sha1').update(`blob ${data.length}\0`).update(data).digest('hex');
      if (digest !== entry.sha.toLowerCase()) fail('GITHUB_INTEGRITY', `GitHub blob did not match the pinned tree: ${entry.path}`);
      files[index] = { path: entry.path, base64: data.toString('base64'), mode: entry.mode === '100755' ? 0o755 : 0o644 };
    }
  }
  await Promise.all(Array.from({ length: Math.min(4, entries.length) }, worker));
  const selectedPath = flatFile ? [directory, flatFile].filter(Boolean).join('/') : directory;
  const kind = flatFile ? 'blob' : 'tree';
  const canonical = `https://github.com/${repository}/${kind}/${ref.split('/').map(encodeURIComponent).join('/')}${selectedPath ? '/' + selectedPath.split('/').map(encodeURIComponent).join('/') : ''}`;
  return {
    files,
    source: { type: 'github', url: canonical, repository, commit: commit.sha, ref, path: selectedPath, kind },
  };
}

/** Download one public skill and all its resources from a pinned commit. Never executes repository code. */
export async function githubFiles(url, options = {}) {
  const parsed = parseUrl(url);
  const get = client(options);
  const selection = await resolveUrl(parsed, get);
  return loadSelection(parsed.repository, selection, get, { ...DEFAULT_LIMITS, ...options.limits });
}

/** Re-read the original branch or tag, while pinning the new download to its exact commit. */
export async function checkGithubUpdate(source, options = {}) {
  if (source?.type !== 'github' || !/^[a-z0-9][a-z0-9-]*\/[a-z0-9_.-]+$/i.test(source.repository ?? '') || typeof source.ref !== 'string' || !source.ref || source.ref.length > 255) {
    fail('GITHUB_SOURCE', 'This skill does not have valid GitHub source metadata.');
  }
  const get = client(options);
  const path = cleanPath(source.path ?? '', true);
  const commit = await resolveCommit(get, source.repository, source.ref);
  return loadSelection(source.repository, { ref: source.ref, path, kind: source.kind === 'blob' ? 'blob' : 'tree', commit }, get, { ...DEFAULT_LIMITS, ...options.limits });
}
