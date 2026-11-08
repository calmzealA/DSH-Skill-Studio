import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { parseArgs } from 'node:util';
const { values } = parseArgs({ options: { repository: { type: 'string' }, commit: { type: 'string' }, output: { type: 'string', default: 'market/index.json' } } });
if (!values.repository || !/^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/.test(values.repository) || !/^[0-9a-f]{40}$/i.test(values.commit ?? '')) {
  console.error('Usage: node scripts/generate-market.mjs --repository https://github.com/OWNER/dsh-skill-studio --commit FULL_40_CHARACTER_SHA [--output market/index.json]');
  process.exit(1);
}
const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const repo = values.repository.replace(/\/$/, '');
const index = { format: 1, title: { en: 'IT咖啡馆 X 老陈聊AI · DSH Plugins', zh: 'IT咖啡馆 X 老陈聊AI · DSH 插件' }, description: { en: 'Community plugins jointly created by IT咖啡馆 X 老陈聊AI', zh: 'IT咖啡馆 X 老陈聊AI共同打造的社区插件' }, plugins: [{ name: pkg.name, title: pkg.dsh.title, description: pkg.dsh.description, author: pkg.author, homepage: `${repo}#readme`, repository: { url: repo }, versions: [{ version: pkg.version, publishTimestamp: Math.floor(Date.now() / 1000), source: { type: 'git', url: repo, commit: values.commit }, engines: { dsh: pkg.engines.dsh } }] }] };
await mkdir(dirname(values.output), { recursive: true });
await writeFile(values.output, JSON.stringify(index, null, 2) + '\n');
console.log(`Generated ${values.output}. Publish this JSON to an HTTPS static host; keep the referenced Git commit available.`);
