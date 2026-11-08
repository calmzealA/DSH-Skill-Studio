# Installing and publishing Skills Studio

This guide covers **`dsh-skill-studio@0.2.2`**, displayed as **Skills Studio / 技能工作台**, jointly created by **IT咖啡馆 X 老陈聊AI**. The delivered local `.tgz` is installable. npm, GitHub, and Pages examples remain placeholders until an actual public release. See the [0.2.2 release notes](../CHANGELOG.md) for changes.

## 1. Identify your host

- **Desktop:** Check the version in the application and use its built-in plugin installer.
- **Web:** Run `dsh --version` in the terminal that launches the server. Examples below use the `web` profile.
- **Remote Web:** A local filesystem path means a path on the DSH server. A file on the browser's computer is not automatically accessible to a remote server.

The compatibility targets are **0.2.1-rc.5** and **0.2.2-rc.1**. Check the delivered verification report for its recorded versions and environments; it does not establish fresh verification for every later release. Windows and macOS have not been verified on native machines. Successful real GitHub API importing remains unverified in this environment because its public API returned HTTP 403. The npm `latest` tag may differ from the newest published prerelease and GitHub's default branch; record the installed version instead of assuming they match.

For a fresh Web installation, a pinned runtime can be installed with:

```sh
npm install -g @deepseek-ai/dsh@0.2.1-rc.5
```

Existing users do not need to reinstall a working host. The current source baseline requires **Node.js 24.9.0 or newer**. Web's `dsh plugin` forwards package operations to pnpm on PATH. If it is missing, install it through your normal Node setup; the source baseline uses:

```sh
npm install -g pnpm@11.28.5
```

Desktop supplies its own runtime and installer, so these global CLI installations are normally unnecessary there.

## 2. Install the delivery archive

Extract the delivery ZIP and locate **`dsh-skill-studio-0.2.2.tgz`**. Install this npm-format archive, rather than the outer source ZIP. Keep `dsh-skill-studio-0.2.1.tgz` as a separate rollback artifact; do not overwrite it with the new package.

### Desktop on Windows, macOS, or Linux

1. Place the `.tgz` in a stable local folder.
2. Open **Plugins → More → Install third-party plugin**. Some versions place this action under **Add plugin**.
3. Enter the archive's absolute path. Enter only the path, not a `dsh plugin` command.
4. Select **Enable now**, or enable Skills Studio later in the installed list.
5. Follow the host's reload or restart result, then open Skills Studio.

| System | Example path |
| --- | --- |
| Windows | `C:\Users\YOUR_NAME\Downloads\dsh-skill-studio-0.2.2.tgz` |
| macOS | `/Users/YOUR_NAME/Downloads/dsh-skill-studio-0.2.2.tgz` |
| Linux | `/home/YOUR_NAME/Downloads/dsh-skill-studio-0.2.2.tgz` |

Replace these with the real path. The ordinary npm CLI refuses operations on Desktop's reserved profile. Do not replace `web` with `desktop` in the following Web commands.

### Web on Windows PowerShell

Open PowerShell beside the package:

```powershell
dsh --version
dsh plugin --profile web add ".\dsh-skill-studio-0.2.2.tgz"
```

Or supply an absolute path; retain quotes when it contains spaces:

```powershell
dsh plugin --profile web add "C:\DSH Plugins\dsh-skill-studio-0.2.2.tgz"
```

### Web on macOS, Linux, or WSL

```sh
dsh --version
dsh plugin --profile web add ./dsh-skill-studio-0.2.2.tgz
```

A WSL server uses WSL's user home and path syntax. A Windows download may be available through a path such as `/mnt/c/Users/YOUR_NAME/Downloads/dsh-skill-studio-0.2.2.tgz`.

Without a global `dsh` command, use the same pinned runtime as your installation:

```sh
npx @deepseek-ai/dsh@0.2.1-rc.5 plugin --profile web add ./dsh-skill-studio-0.2.2.tgz
```

pnpm must still be available to the runtime. For a custom profile, replace `web` with its actual name. Place `--profile` before `add`.

### Activate and check

Follow the host's activation result. If a restart is required, stop the existing process and relaunch from its original working directory:

```sh
dsh web
```

Verify that the installed list shows version `0.2.2`, the plugin is enabled, and Skills Studio opens on **Current mode**. **Skill library** separately shows the full managed inventory. Switch DSH's language in **Settings → General** and check that the panel follows. Check the **Workspace** and **Mode** selectors, create a small test skill in the intended root, then try editing, saving its invocation settings, disabling, recovery, and export. Reopen `/` after changes to check the new command list. Instructions already read by a conversation may remain in its history.

## 3. Understand sources and state

The default **Current mode** view is a compact, searchable list of skills actually callable in the selected workspace and mode. **Skill library** is a separate file-management view. Selecting a skill opens **Overview** inside the workbench; enter **Edit** for instruction changes. Use question-mark help for explanations.

The header's **Workspace** and **Mode** selectors initially show the current session’s selections, marked **(current)**. Without a session, the default mode is marked **(default)**. You may select another known workspace without changing the actual session's settings. The sidebar shows that workspace's name. With no selected session, personal skills remain manageable.

Built-in modes use DSH's names: Standard mode, PTC mode, Minimal mode, and Creator mode. Custom mode names are retained. DSH's default Minimal mode does not provide local skills, but plugins can still supply skills. Standard and PTC modes normally provide local skills. Configuration can change this behavior; counts always follow the actual host catalog, not a hard-coded total.

### Current mode and Skill library

**Current mode** includes only callable catalog entries: the host provides the skill and at least one invocation policy permits use. **Skill library** retains all scanned local skills plus read-only plugin entries supplied in the selected mode. Local items include disabled files, copies shadowed by another location, skills unavailable in this mode, and skills with both invocation policies off. Its **File enabled** switch controls the file, not the current mode's availability, and can affect other modes or agents reading that file.

Select the **Available in mode**, **Model use**, or **/ Commands** count to filter its list. Automatic and manual invocation have separate counts. To compare with a conversation's `/` menu, choose the same workspace and mode and use the manual-invocation filter. Model-only skills do not belong in that list; skills with both policies off are not callable.

An incomplete catalog is shown as unconfirmed, rather than a definite zero. Read-only plugin skills identify their provider without a blue file switch.

A successful create or import opens **Skill library** so the new item is easy to find, even when the selected mode cannot use it.

When creating or copying, use **Save to**. When importing, use **Import to** to choose who can use the skill:

| Destination | Use |
| --- | --- |
| A named workspace | Instructions for that workspace, such as project conventions or a dedicated workflow. |
| Personal skills | Files shared across this machine's workspaces; each mode still needs to provide them. DSH-only and shared-agent locations are identified separately. |
| Plugin-provided skills | Read-only skills supplied by plugins. Copy to a writable location before customizing. |

Use the help control beside **Save location** to view or copy the actual path. A long file path is not required knowledge for ordinary use.

### Directory reference

For users who need to locate files manually, the default locations are below. The actual **Save location** takes precedence.

| Source | Default path |
| --- | --- |
| Workspace DSH skills | `<projectRoot>/.dsh/skills` |
| Workspace shared skills | `<projectRoot>/.agents/skills` |
| Custom locations | Provider-configured directories |
| Personal DSH skills | `$DSH_HOME/skills`, default `~/.dsh/skills` |
| Personal shared skills | `$DSH_AGENTS_HOME/skills`, default `~/.agents/skills` |
| Plugin-provided skills | Managed by the supplying plugin |

Copies with the same name can exist at different locations. Details identify the copy that the selected workspace and mode actually use. `projectRoot` normally means the nearest `.git` ancestor of the working directory, or the working directory if none exists. Environment overrides and remote servers change actual paths.

DSH accepts an immediate `<root>/<folder>/SKILL.md` bundle or a flat `<root>/<name>.md` file. Frontmatter requires a lowercase kebab-case name and a description:

```markdown
---
name: article-review
description: Review a technology article for clarity and unsupported claims.
---

Read the article, identify unsupported claims, and suggest concrete revisions.
```

Export full bundles so supporting scripts, references, and assets travel with the instructions. **Allow model selection** maps to the inverse of `disable-model-invocation`; **Allow /manual invocation** maps to `user-invocable`. These policies are saved separately from body edits. Their YAML AST update preserves the instruction body, comments, and unrelated metadata.

Whole-skill disabling renames its instruction file to a disabled form. On a shared `.agents/skills` root, this can also affect other agents using that same directory. For DSH-specific copies, use a DSH root. Disabling does not remove instructions already retained in conversation history.

### Common operations

| Goal | Action |
| --- | --- |
| Create | Select **New skill**, choose a destination, and enter a valid name, description, and starter template. |
| Preview instructions | Select the skill to open **Overview**, with its instructions, source, and availability information. The details and close control stay inside the workbench content area. |
| Set invocation policy | In a local skill’s **Overview**, set **Allow model selection** and **Allow /manual invocation**, then select **Save settings**. |
| Edit instructions | Open **Edit**, change the instructions, then select **Save changes**. |
| Edit resources | In **Resources**, add a relative-path text resource, upload a file, select a text file to edit and save, or remove a resource. Binary files remain preserved and can be inspected after export. |
| Local import | **Import → Local files** accepts `.md`, `.zip`, or a complete folder. Choose **Import to**, select **Next**, view the skills, and select **Import**. |
| GitHub import | **Import → GitHub** accepts a concrete skill directory's `/tree/` URL or a Markdown file's `/blob/` URL, including `SKILL.md` and flat `.md` skills. Select **Next** to view the skill, then **Import**. A same-name warning appears when relevant. |
| Source update | In the imported skill's **Overview** source area, select **Check source updates**. Compare local/incoming instructions, commits, and changed resources, then explicitly apply the reviewed update. |
| Copy | Open a local skill, select **Copy to location**, and choose a writable root; the original is retained. |
| Batch maintenance | In **Skill library**, select local skills to change file enablement or export them. Hidden selections are not used for batch changes after switching scope. |
| Recover | Removing a skill retains a recovery point. Select the snapshot in **History** and restore; current state is backed up before replacement. |

For a collection repository, paste the **specific skill directory** instead of its collection root; this release does not provide a repository-wide multi-skill picker. A repository URL also works when its root is itself one skill. A GitHub fetch allows at most 200 files, 2 MiB per file, and 8 MiB total file content. Public API limits and network failures are reported; retry later instead of running untrusted download scripts.

Virtual skills from plugin/runtime providers expose synthesized instructions for viewing, without complete original-resource export; manage those through their provider. For local bundles, source updates replace the complete bundle and check its full hash for concurrent changes. Updates are explicit actions, with no background overwrite of imported content.

### Save results and the slash menu

Earlier SDK menu caching could leave an already opened `/` menu unchanged even after a successful file save. Version 0.2.2 shows a short **Saved** message, with catalog and menu synchronization details available from its help control. It checks the real catalog and uses DSH's public Loader to refresh the skill menu. It dismisses an open skill menu group; reopen `/` to fetch a fresh list. This does not restart the Agent or rewrite skill instructions already loaded into chat history.

Other connected, visible plugin windows check for revisions about every five seconds and follow changes. Becoming visible triggers another check. Hidden, background, or disconnected windows are not guaranteed to refresh on that schedule. File state, catalog verification, and menu refresh remain separate results; unsupported interfaces and incomplete synchronization are reported rather than treated as confirmed availability.

## 4. Update, roll back, or uninstall

Install a new `.tgz` into the same profile to update the plugin:

```sh
dsh plugin --profile web add ./dsh-skill-studio-0.2.2.tgz
```

Desktop users install `dsh-skill-studio-0.2.2.tgz` through the same built-in installer. Follow the host's activation result and confirm the installed version.

Upgrading the plugin does not migrate or delete skill directories or retained history. The history/state directory remains `~/.dsh/skill-studio`, or `$DSH_HOME/skill-studio` when `DSH_HOME` is overridden. Plugin updates are separate from updates to imported skills.

To roll back, keep the earlier `dsh-skill-studio-0.2.1.tgz` and install that archive into the same profile:

```sh
dsh plugin --profile web add ./dsh-skill-studio-0.2.1.tgz
```

Desktop users choose the retained `0.2.1` archive in the built-in installer. Confirm the host reports `0.2.1` after activation. Rollback changes the plugin version; it does not undo skill-file edits made while using `0.2.2`. Use skill history or a full bundle export to recover content. Keep the release archives as separate files. You may also retain the older 0.1 archive.

To remove the Web plugin:

```sh
dsh plugin --profile web remove dsh-skill-studio
```

Desktop users remove it in the installed plugins page. Removing a management plugin is not a substitute for deleting skills. Inspect actual instruction files, disabled states, and history locations before uninstalling. Use complete skill exports when moving to another machine.

## 5. Publish for other users

`YOUR_GITHUB_USER` is a placeholder throughout this section. Do not advertise an example package or URL as live before publication.

### Build and inspect the archive

In the source checkout:

```sh
npm install
npm run build
npm test
npm pack --dry-run
npm pack
```

Confirm that `dsh-skill-studio-0.2.2.tgz` contains the manifest, bundle patch, host code, browser build, locale assets, and required documentation. Install the archive into a clean DSH profile and verify startup before release.

### Publish to npm

Use an npm account that owns the chosen package name. If `dsh-skill-studio` is unavailable, rename it to an owned scope, such as `@YOUR_NPM_SCOPE/dsh-skill-studio`, and update module references, package checks, and the index consistently.

After renaming, substitute the actual filename printed by `npm pack` for the example `.tgz` filename below.

```sh
npm login
npm publish ./dsh-skill-studio-0.2.2.tgz --access public
```

Complete npm's own login or two-factor prompts. After confirming the real package is published, users can run:

```sh
dsh plugin --profile web add dsh-skill-studio@0.2.2
```

Desktop users enter `dsh-skill-studio@0.2.2` into its installer. These examples assume that exact package name was successfully published.

### Publish a prebuilt GitHub release

Create a public repository, fill in its real repository/homepage metadata, and commit source, required prebuilt output, and docs. Check `git status` before adding files so test workspaces and local data do not enter the repository.

```sh
git init
npm run build
git add .
git add -f lib
git commit -m "Release Skills Studio 0.2.2"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USER/dsh-skill-studio.git
git push -u origin main
git tag v0.2.2
git push origin v0.2.2
```

Create release `v0.2.2` in GitHub Releases and attach `dsh-skill-studio-0.2.2.tgz`. After replacing the username and checking that the asset exists, users can install it with:

```sh
dsh plugin --profile web add https://github.com/YOUR_GITHUB_USER/dsh-skill-studio/releases/download/v0.2.2/dsh-skill-studio-0.2.2.tgz
```

A Git installation is also possible when the repository includes ready-to-run output:

```sh
dsh plugin --profile web add github:YOUR_GITHUB_USER/dsh-skill-studio#v0.2.2
```

Avoid requiring builds during installation. If you add install-time scripts such as `prepare`, pnpm may require explicit script approval; follow the host's actual result instead of enabling all dependency scripts.

This project's development ignore rules exclude `lib/`. The explicit `git add -f lib` above includes the built release output; a source-only Git commit would be missing the installable entry files.

### Included repository checks

The source includes `.github/workflows/check.yml`. After a push or pull request in your repository, GitHub Actions installs, tests, builds, and packs on Linux, Windows, and macOS with Node 24, retaining each platform's `.tgz` artifact. Check the actual three-platform job results before public release. A workflow file alone does not establish that those systems have already passed.

This workflow does not publish to npm, create a public release, or deploy Pages. After checking CI and the artifact, use the publication steps above. If GitHub CLI is installed and authenticated, this command can create the release and attach its package:

```sh
gh release create v0.2.2 ./dsh-skill-studio-0.2.2.tgz --title "Skills Studio 0.2.2" --notes "Skills Studio 0.2.2. See README for installation and verification."
```

When the release tag already exists, verify that it points at the tested source commit. Perform one real installation from the public URL after publication.

## 6. Publish a custom plugin index

**DSH ships no index source and does not require registration with an official marketplace.** A custom market is a public JSON index hosted at an HTTP(S) URL.

For this project, the supplied generator can produce a Git-based index after you have a real repository URL and published commit:

```sh
node scripts/generate-market.mjs --repository https://github.com/YOUR_GITHUB_USER/dsh-skill-studio --commit ACTUAL_40_CHARACTER_COMMIT_SHA --output docs/market/index.json
```

Replace both placeholders. Obtain the release commit with `git rev-parse 'v0.2.2^{commit}'`. Git entries require a full 40-character commit SHA, not `main` or a tag name.

A minimal npm-based index looks like:

```json
{
  "format": 1,
  "title": { "en": "IT咖啡馆 X 老陈聊AI Plugins", "zh": "IT咖啡馆 X 老陈聊AI 插件" },
  "plugins": [
    {
      "name": "dsh-skill-studio",
      "title": { "en": "Skills Studio", "zh": "技能工作台" },
      "author": "IT咖啡馆 X 老陈聊AI",
      "versions": [
        {
          "version": "0.2.2",
          "publishTimestamp": 1793746800,
          "source": { "type": "npm" }
        }
      ]
    }
  ]
}
```

Use the actual publication Unix timestamp and actual package name. Copy the package's real `engines.dsh` range into the version's `engines.dsh` field. Omitting a range from this minimal example does not establish universal compatibility; the host checks the package again when installing.

The official repository also offers a reference generator. Put published npm package names or Git URLs into `plugins.txt`, then run this in a prepared DSH source checkout:

```sh
pnpm --filter @deepseek-ai/dsh-plugin-market-generator start --input plugins.txt --output site/index.json --title "IT咖啡馆 X 老陈聊AI Plugins"
```

### Host the JSON with GitHub Pages

1. Save your real index at `docs/market/index.json`; keep optional icons in an adjacent `icons/` folder.
2. Commit and push.
3. In repository **Settings → Pages**, select **Deploy from a branch**, branch `main`, directory `/docs`.
4. Wait for successful deployment and check the actual URL:

   `https://YOUR_GITHUB_USER.github.io/dsh-skill-studio/market/index.json`

5. Confirm it returns 2xx UTF-8 JSON without redirects. Do not use GitHub's HTML file preview URL. `curl -I "ACTUAL_URL"` can inspect the response.

That URL is a format example, not a deployed market supplied with this delivery. Other static hosts can serve the same files over HTTPS.

### Let users add the index

1. Enable **Custom plugin indexes** under **Plugins → Experimental plugins**; some versions show **More** first.
2. Open **Discover → Add index source** and paste the verified HTTPS index URL.
3. Search for Skills Studio / 技能工作台.
4. Inspect the author, package, version, and source before installing and enabling it.

Adding an index does not install every plugin in it and is not an official safety certification.

## 7. Community discovery

- Add the **`dsh-plugin`** topic to the public repository, as recommended by DSH's README.
- Use accurate npm keywords and document actual compatibility and installation instructions.
- For listing in [dshworks/awesome-dsh-plugins](https://github.com/dshworks/awesome-dsh-plugins), follow its [contribution guide](https://github.com/dshworks/awesome-dsh-plugins/blob/main/CONTRIBUTING.md): edit `data/plugins.json`, run `node scripts/validate.mjs` and `node scripts/render.mjs`, and submit a PR containing the required generated changes.
- Set `verifiedAgainst` and `lastVerified` to real checks. A `verified` entry requires evidence, such as `package.json#dsh.bundle`. Do not claim an unpublished npm name is installable.

The community's public Discover index is `https://dsh.works/awesome-dsh-plugins/market/index.json`. Its maintainers decide admission; a submitted PR is not a completed listing.

## 8. Troubleshooting

| Symptom | Check |
| --- | --- |
| Installed but no entry | Correct Desktop/Web profile, enabled state, compatibility diagnostics, and the host's reload instructions. |
| Incompatible version | Record actual host and plugin versions; GitHub master is not your installed runtime. |
| Package not found | Verify a local `.tgz` path or a genuinely published URL. npm mirrors cannot fix a missing GitHub release asset. |
| pnpm missing | Check Web CLI PATH; Desktop should use its built-in installer. |
| File is busy or access denied when saving | Brief locks receive bounded retries. If saving still fails, the error remains beside the save controls and the draft is retained. Close editors or synchronization tools that might hold the file, check write permissions, and retry; copy error details if needed. |
| Original files kept; recovery required | Open **Error details** for the recovery location and preserve those files. Resolve locking or access first. Do not repeatedly save or delete recovery copies; this error does not offer an ordinary save retry. |
| File changed while editing | Reload the latest file, merge your edit, then save again. The hash check prevents silent overwrite. |
| Skill unavailable | Check **Workspace**, **Mode**, diagnostics, file state, both invocation policies, and same-name overrides. The default Minimal mode does not provide local skills. Selecting another mode in the workbench does not change the session. |
| File saved but `/` still shows the old list | Open the synchronization details beside the short save result. The plugin dismisses an open skill menu group and refreshes its bridge through the public Loader; reopen `/` to fetch the new list. Check the selected view matches the actual session. |
| Another window shows an older state | Visible plugin windows check for revisions every five seconds. Return to a hidden/background window and refresh its view if needed. |
| Disabled skill still remembered | Previously loaded instructions remain in conversation history. Verify in a new conversation. |
| GitHub import failed | Check connectivity, the public repository path, and readable commit. Public GitHub API requests returned HTTP 403 in this development environment; successful live downloads have not been verified here. Private repository authentication is outside the default public import flow. |
| Remote server cannot read a file | Use its server-side path or the panel's upload interface. |
| Read-only item cannot be edited | Confirm its source and customize a writable local copy. |

The project and accompanying documentation carry the joint creator credit **IT咖啡馆 X 老陈聊AI**. Publication commands are for maintainers to run explicitly; delivery does not automatically publish to npm, GitHub, a plugin index, or social platforms.

## Official references

- [CLI and profiles](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/apps/cli/README.md)
- [Plugin indexes](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/docs/user/guide/plugin-market.md)
- [Index generator](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/apps/plugin-market-generator/README.md)
- [Filesystem skills](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/skill/skill-filesystem/README.md)
