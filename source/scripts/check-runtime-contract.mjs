#!/usr/bin/env node
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdtemp, mkdir, readFile, rm } from 'node:fs/promises';
import { isAbsolute, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ContextResolver } from '../src/context.mjs';

const usage = 'Usage: node scripts/check-runtime-contract.mjs [--runtime-package /absolute/path/to/@deepseek-ai/dsh/package.json]';

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) { console.log(usage); return; }
  if (args.length && (args.length !== 2 || args[0] !== '--runtime-package' || !isAbsolute(args[1]))) throw new Error(usage);
  const packageFile = args[1] ?? fileURLToPath(import.meta.resolve('@deepseek-ai/dsh/package.json'));
  const metadata = JSON.parse(await readFile(packageFile, 'utf8'));
  assert.equal(metadata.name, '@deepseek-ai/dsh', '--runtime-package must identify the DSH package.json');
  const runtime = createRequire(packageFile);
  const load = name => import(pathToFileURL(runtime.resolve(name)).href);
  const { Context } = await load('@deepseek-ai/cordis');
  const { default: Loader } = await load('@deepseek-ai/cordis-plugin-loader');
  const { default: SessionStore } = await load('@deepseek-ai/dsh-session');
  const { default: SessionProjections } = await load('@deepseek-ai/dsh-session-projection');
  const { default: AgentPresets } = await load('@deepseek-ai/dsh-agent-preset-registry');
  const { default: WorkingDirectory } = await load('@deepseek-ai/dsh-working-directory');
  const { default: SkillRegistry } = await load('@deepseek-ai/dsh-skill');
  const directory = await mkdtemp(join(tmpdir(), 'skill-studio-runtime-contract-'));
  const original = join(directory, 'original');
  const effective = join(directory, 'effective');
  await mkdir(original);
  await mkdir(effective);
  const ctx = new Context();
  ctx.baseUrl = pathToFileURL(`${directory}/`).href;
  const releases = [];
  let lease;
  try {
    // Adjacent capabilities are minimal because this check observes state:
    // it creates no Agent, runs no turn, and performs no execution-world I/O.
    ctx.provide('agents', { get: () => undefined, create() { assert.fail('Inspection must not create an Agent'); } });
    ctx.provide('fs', {});
    ctx.provide('systemPrompt', { context: () => () => {}, getContextOrder: () => 10 });
    await ctx.plugin(Loader).await();
    await ctx.plugin(SessionStore).await();
    await ctx.plugin(SessionProjections).await();
    await ctx.plugin(SkillRegistry).await();
    await ctx.plugin(WorkingDirectory, { defaultDirectory: original }).await();
    await ctx.plugin(AgentPresets, { default: 'standard' }).await();
    const presets = ctx.agentPresets;
    releases.push(await presets.register({ id: 'standard', plugins: [] }));
    const releaseMinimal = await presets.register({ id: 'minimal', plugins: [] });
    releases.push(releaseMinimal);
    lease = await presets.acquireScope('minimal');
    assert.equal(typeof lease.key, 'object');
    assert.equal(typeof lease[Symbol.asyncDispose], 'function');
    assert.equal(presets.inspectCompositions().length, 2);
    assert.equal((await ctx.skills.snapshot({ scope: lease.key })).complete, true);

    const session = ctx.sessions.create('cold-contract-session', { meta: { cwd: original, agentPreset: 'standard' } });
    session.append('agent-preset/selected', { agentPreset: 'minimal' });
    session.append('working-directory/change', { cwd: effective });
    assert.equal(ctx.workingDirectory.get(session), effective);
    assert.equal(session.header.cwd, original, 'committed cwd must not mutate the immutable creation header');
    const options = await new ContextResolver(ctx).options(session.id);
    assert.equal(options.current.presetId, 'minimal', 'the cold Session selection must override its creation header and deployment default');
    assert.equal(options.workspaces.find(row => row.id === options.current.workspaceId)?.path, effective);
    await new ContextResolver(ctx).withView({ sessionId: session.id }, view => {
      assert.equal(view.context.presetId, 'minimal');
      assert.equal(view.cwd, effective);
      assert.equal(view.context.complete, true);
    });

    await releaseMinimal();
    assert.equal(presets.inspectCompositions().some(row => row.id === 'minimal'), true, 'a scope lease must retain a retired revision');
    await lease[Symbol.asyncDispose]();
    await lease[Symbol.asyncDispose]();
    assert.equal(presets.inspectCompositions().some(row => row.id === 'minimal'), false, 'async disposal must release that retained revision');

    // The browser uses this same public Loader/Fiber lifecycle. Verify the
    // exact entries()/restart() operations without replacing a module revision.
    let mounts = 0;
    ctx.loader.builtins['skill-studio-contract'] = { apply() { mounts++; } };
    await ctx.loader.create({ id: 'contract-entry', name: 'cordis:skill-studio-contract' });
    await ctx.loader.await();
    const entry = [...ctx.loader.entries()].find(row => row.options.id === 'contract-entry');
    const before = JSON.stringify(entry.options);
    assert.equal(mounts, 1);
    await entry.fiber.restart();
    assert.equal(mounts, 2);
    assert.equal(JSON.stringify(entry.options), before, 'restart must preserve enablement and configuration');
    console.log(`DSH ${metadata.version}: preset leases, cold-session selection, working directory, and Loader restart passed.`);
  } finally {
    if (lease) await lease[Symbol.asyncDispose]();
    for (const release of releases.reverse()) await release();
    await ctx.fiber.dispose();
    await rm(directory, { recursive: true, force: true });
  }
}

main().catch(error => { console.error(`Runtime contract check failed: ${error.message}`); process.exitCode = 1; });
