import { build } from 'esbuild';
import { mkdir, cp, readdir } from 'node:fs/promises';
await mkdir('lib', { recursive: true });
for (const name of await readdir('src')) if (name.endsWith('.mjs') && !['locales.mjs', 'client.mjs'].includes(name)) await cp(`src/${name}`, `lib/${name}`);
// DSH's browser loader accepts its own module wrapper, not native ESM. React
// is required from the host seed to keep one React instance.
await build({ entryPoints: ['src/client.mjs'], outfile: 'lib/client.js', bundle: true, format: 'cjs', platform: 'browser', target: 'es2022', jsx: 'automatic', loader: { '.css': 'text' }, external: ['react', 'react/jsx-runtime'], banner: { js: 'window.__ModuleLoader__.load({ id: "dsh-skill-studio", factory(require) { const module = {exports:{}}; const exports = module.exports;' }, footer: { js: 'return module.exports; }});' }, minify: false });
console.log('Built host modules and DSH client bundle.');
