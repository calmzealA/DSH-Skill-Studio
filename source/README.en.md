# Skills Studio

[简体中文](README.md) · [Installation and publishing](docs/INSTALL.en.md) · [0.2.2 release notes](CHANGELOG.md) · [Verification record](docs/VERIFICATION.md) · [Research notes in Chinese](docs/RESEARCH.zh.md)

A skills management plugin for **DeepSeek Harness**, jointly created by **IT咖啡馆 X 老陈聊AI**. Inspect skill files, check their actual availability in the selected mode, and manage instructions, resources, and change history in one workspace.

**Version: 0.2.2. This is a community plugin, unaffiliated with DeepSeek AI.** The delivered package supports local installation. `YOUR_GITHUB_USER` and npm/GitHub/Pages publication examples are placeholders, not live download URLs.

## Features

| Goal | Action |
| --- | --- |
| See what the selected mode can use | The default **Current mode** view lists skills actually callable in the selected workspace and mode, rather than using the full library total. |
| Manage every skill file | Open **Skill library** to search, edit, import, export, and change file enablement. A card layout is also available. |
| Choose a workspace and mode | Use DSH's **Workspace** and **Mode** names, including Standard mode, PTC mode, Minimal mode, and Creator mode. These selectors change the view without changing the session. |
| Compare with the slash menu | Select the **/ Commands** count to see skills allowed in the chat menu. Model selection is counted separately; these sets can differ. |
| Set invocation | For local skills, save model selection and `/` manual invocation independently from instruction edits, preserving comments and other metadata. |
| Continue after a failed save | Brief file locks receive bounded retries. Persistent errors remain beside the save controls, with the draft retained, a retry action, and copyable error details. |
| Import a skill | Add from GitHub or local files, choose **Import to**, select **Next**, then select **Import** after viewing the skills. A same-name warning appears when relevant. |
| Check file locations | Use the help control beside **Save location** to view and copy the path; long paths do not dominate the interface. |
| Keep complete resources | Create, edit, import, and export skill bundles, including scripts, references, and assets. |
| Update and recover | Review GitHub updates, guard against concurrent changes, and restore retained history. |

The plugin follows DSH's Chinese/English language setting. Question-mark help contains explanations; successful operations use short messages, with synchronization details available on demand.

After a successful create or import, the workbench opens **Skill library** so the new item remains easy to find. Its availability in the selected mode is still shown in **Current mode**.

Content checks are structural diagnostics, not a third-party security certification. Importing a skill does not execute its scripts.

Complete resource operations apply to readable local skill bundles. Virtual skills from plugin/runtime providers expose synthesized instructions for viewing; their original resources remain managed by their provider.

## Install the delivered package

Extract the delivery ZIP and find **`dsh-skill-studio-0.2.2.tgz`**. Install that npm-format archive. The outer ZIP contains source and documentation. Keep the earlier `dsh-skill-studio-0.2.1.tgz` and original delivery ZIP separately for rollback. This patch is a new delivery.

**DSH Desktop:** Open **Plugins → More → Install third-party plugin**, enter the absolute local `.tgz` path, and select **Enable now** after installation. Follow the host's reload or restart instructions.

**DSH Web:** Open a terminal beside the `.tgz`:

```sh
dsh --version
dsh plugin --profile web add ./dsh-skill-studio-0.2.2.tgz
dsh web
```

In Windows PowerShell:

```powershell
dsh plugin --profile web add ".\dsh-skill-studio-0.2.2.tgz"
```

For an already running Web process, follow the installation result's activation instructions. Open Skills Studio, check **Workspace** and **Mode** (both default to the current session’s selections), and verify the destination before making changes.

The ordinary npm CLI cannot manage Desktop's reserved profile. Desktop users should use its built-in installer; replacing `web` with `desktop` in the command is not supported.

## Current mode and Skill library

**Current mode** answers “what can this workspace and mode use now?” **Skill library** retains scanned local skills and read-only entries supplied by plugins in that mode. If the library contains 40 entries but the selected mode provides eight callable skills, the default view shows those eight. Counts come from the actual host catalog; eight is an example, not a fixed property of Minimal mode.

The **Available in mode**, **Model use**, and **/ Commands** counts are selectable filters. Automatic and manual invocation are independent sets. Before comparing with a conversation’s `/` menu, select the same workspace and mode, then choose the manual-invocation filter. A model-only skill is absent from that list. A skill with both invocation policies disabled is not counted as callable.

Incomplete catalog results are shown as unconfirmed, not as a definite zero. Read-only plugin skills identify their provider without an inoperable blue switch. The **Skill library** file switch does not assert availability in any particular mode.

## Practical details

- File state, availability in the selected mode, and instructions previously loaded by a session are different facts. A catalog entry does not prove the full instructions are in the current model context.
- Project skills can shadow user skills with the same name. Editing a shadowed copy does not change the winning skill in that project.
- In **Overview**, use the two invocation switches and **Save settings**. For body changes, use **Edit → Save changes**. Model selection and manual invocation are independent.
- Review an import's destination, files, and conflicts. A GitHub import is pinned; it does not silently follow branch updates.
- Check the original location and existing files before restoring history.
- In **Skill library**, the file switch controls discovery eligibility rather than availability in the selected mode. Whole-skill disabling renames its instruction file. Disabling a shared `.agents/skills` copy can affect other agents using that directory.
- After a change, the plugin checks the real catalog and remounts the current `ui-skill` menu bridge through DSH's public Loader. An already open skill menu group is dismissed; reopen `/` to fetch the updated list. This does not restart the Agent or rewrite instructions already loaded into chat history.
- Other connected, visible plugin windows check for revisions about every five seconds and when they become visible again. Background, hidden, or disconnected windows are not guaranteed to refresh on that schedule.

Upgrading keeps skill directories and the existing history under `~/.dsh/skill-studio` (`$DSH_HOME/skill-studio` when overridden). It does not migrate or delete those files. See the [upgrade and rollback steps](docs/INSTALL.en.md#4-update-roll-back-or-uninstall).

## If saving fails

The plugin retries a brief file lock for a bounded period. If it still fails, close editors or synchronization tools that may hold the file, check write permissions, and retry. Keep the details open: the unsaved draft remains available. If the file changed elsewhere, reload and merge the latest version first; retries do not bypass overwrite protection.

## Compatibility and verification

The compatibility targets are npm runtime **0.2.1-rc.5** and upstream source **0.2.2-rc.1**. See the [verification record](docs/VERIFICATION.md) for its recorded checks and versions; it is not a claim that every later release has repeated them. Windows and macOS have not been verified on native machines. Real public GitHub API downloads returned HTTP 403 in this environment, so successful live GitHub importing remains unverified here.

Development is grounded in upstream commit `fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159`. DSH is a developer preview with potential breaking changes. Record actual host and plugin versions when troubleshooting: the npm `latest` tag and GitHub `master` can differ.

## Build and distribute

```sh
npm install
npm run build
npm test
npm pack
```

Publish through npm, a prebuilt GitHub package, or a custom plugin index. **No official marketplace account registration is required.** Publish an installable package first, put its actual source into an index, and let users add that index URL in DSH Discover.

The [complete guide](docs/INSTALL.en.md) covers Windows, macOS, Linux, Desktop/Web installation, removal, troubleshooting, and npm/GitHub/index publication.

The project and its accompanying documentation carry the joint creator credit **IT咖啡馆 X 老陈聊AI**. Code is available under the repository's MIT license; referenced third-party work retains its own attribution. Delivery does not automatically publish packages, indexes, or social posts.

## Sources

- [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)
- [Official plugin index guide](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/guide/plugin-market.md)
- [Official filesystem skills reference](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/skill/skill-filesystem/README.md)
- [Community comparison and Codex baseline](docs/RESEARCH.zh.md)
