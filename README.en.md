# Skills Studio for DeepSeek Harness

**Inspect, edit, and manage Skills inside DeepSeek Harness, with clear availability and recoverable changes.**

Created together by **IT咖啡馆 X 老陈聊AI** · Community plugin · Repository version **0.2.2**

[简体中文](README.md) · [Download plugin](https://github.com/itcoffee66/DSH-Skill-Studio/raw/refs/heads/main/dsh-skill-studio-0.2.2.tgz) · [Installation guide](source/docs/INSTALL.en.md) · [Changelog](source/CHANGELOG.md) · [Report an issue](https://github.com/itcoffee66/DSH-Skill-Studio/issues)

## What does it do?

As your collection grows, it becomes harder to find skill files, know which skills a mode can use, edit their instructions, or import updates without overwriting your work.

Skills Studio brings these tasks into DSH. Inspect what the selected workspace and mode can actually call, then manage local instructions, supporting resources, sources, and change history in one place.

| Capability | What you can do |
| --- | --- |
| Inspect actual availability | Start in Current mode and filter model-automatic and `/` manual invocation separately. |
| Browse your library | Search names, descriptions, or paths; switch list/card views and filter by source, state, or diagnostics. |
| Create and edit | Start from templates, edit complete `SKILL.md` files, and configure automatic/manual invocation independently. |
| Import and export | Import a GitHub skill directory or file, local Markdown, ZIP, or folder; export complete local bundles. |
| Manage resources | View, edit, create, upload, or remove supporting files while preserving the complete skill bundle. |
| Review source updates | Compare GitHub commits, instructions, and resource changes before applying an update. |
| Maintain and recover | Enable/disable local files in batches, export selections, and restore edits or removals through history. |
| Handle save failures | Retry temporary file locks a bounded number of times; retain current edits and persistent error feedback if saving fails. |

The interface follows DSH's Chinese/English setting and supports light and dark themes. Help is available through clickable icons. Details open within the plugin content area with explicit close controls.

## Quick installation

### 1. Download the plugin package

Download **[dsh-skill-studio-0.2.2.tgz](https://github.com/itcoffee66/DSH-Skill-Studio/raw/refs/heads/main/dsh-skill-studio-0.2.2.tgz)** from this repository. If GitHub opens a preview, select **Download raw file**.

Install the `.tgz` without extracting it. GitHub's **Code → Download ZIP** downloads the entire repository; that ZIP is not the installable plugin package.

### 2. Install and enable

**DSH Desktop**

1. Open **Plugins → More → Install third-party plugin**. Some builds use an **Add plugin** entry.
2. Enter the downloaded package's **absolute local path** in the package/address field, for example:

   ```text
   C:\Users\YOUR_NAME\Downloads\dsh-skill-studio-0.2.2.tgz
   ```

3. Install and enable Skills Studio, then reload or restart as DSH requests.
4. Open **Skills Studio** from the sidebar.

On macOS or Linux, enter the corresponding absolute path. Enter only the package path in Desktop's installer, not the terminal commands below.

**DSH Web**

Run from the folder containing the package:

```sh
dsh --version
dsh plugin --profile web add ./dsh-skill-studio-0.2.2.tgz
```

Windows PowerShell:

```powershell
dsh plugin --profile web add ".\dsh-skill-studio-0.2.2.tgz"
```

Replace `web` if you use another profile. Follow the installation result for reload instructions. If a restart is needed, stop the existing process before running `dsh web`. With remote Web, the path belongs to the **DSH server**, not the browser's computer. Use the application installer for Desktop; the ordinary CLI does not manage the reserved `desktop` profile.

The package in this repository is sufficient; adding a marketplace is not required. Use npm packages, Release URLs, or custom index URLs only when maintainers actually publish them. Publishing examples in the detailed guide are not live services.

## First use: choose a workspace and mode

The workspace and mode selectors determine what the workbench inspects. They follow the current session by default and can inspect other known workspaces or modes. **Changing these selectors does not switch the actual chat session's workspace or mode.**

| View | What it tells you |
| --- | --- |
| Current mode | Which skills can actually be called in the selected workspace and mode? |
| Skill library | Which local skills were scanned, plus which read-only skills the current mode's plugins provide? |

**An enabled file does not guarantee availability in a mode.** A library might contain 40 entries while a mode provides only 8 callable skills. These are illustrative counts, not a fixed rule. DSH's default Minimal mode does not provide local filesystem skills, although plugin-provided skills may remain available; custom mode configuration can change this.

To compare with the chat input's `/` menu, match the chat's workspace and mode, then select **/ manual invocation**. Automatic-only skills do not belong in that manual list. Skills with both invocation options disabled are excluded from callable totals. An unconfirmed catalog shows `—` rather than a definitive zero.

## Common workflows

1. **Create a skill:** choose New skill, select a destination, and fill in the name, description, and instructions. Creating or importing opens the library so you can find the new entry.
2. **Change invocation:** in a local skill's Overview, configure model-automatic and `/` manual invocation separately, then save settings. Use Edit to change the full instruction file.
3. **Import a skill:** choose GitHub or local files, select the destination, continue to preview, then import. For repositories containing multiple skills, use a specific skill directory URL.
4. **Maintain and recover:** manage file enablement in the library, edit supporting content under Resources, and open Change history to restore earlier content.

The workbench manages workspace and personal `.dsh/skills` and `.agents/skills` locations and recognizes configured custom roots. Use the help icon beside the save location to inspect the real path. Plugin-provided entries are read-only and should be managed through their provider. Readable local bundles can be copied to another writable location for editing.

## Behavior to understand

- **Shared roots affect other agents.** File enablement changes in `.agents/skills` can affect other tools reading the same directory. Disabling a local skill renames its instruction file to a disabled filename.
- **Disabling does not erase chat history.** Instructions previously read into a conversation are not removed by file edits, disabling, or menu refresh. Reopen `/` after saving to inspect the updated menu.
- **Updates protect local work.** Source updates require an explicit check and confirmation. Concurrent edits trigger overwrite protection. If saving fails, resolve file locks or permissions and retry while keeping your unsaved edits.
- **Import checks have limits.** Structural diagnostics are not a safety certification. Importing does not execute bundled scripts; review third-party instructions and resources before using them.
- **Complete export applies to local bundles.** Runtime-provided virtual skills expose composed instructions, not a guaranteed export of their original resources.

## Compatibility and verification

This version targets **DSH 0.2.1-rc.5 and 0.2.2-rc.1**. Web/source development requires **Node.js ≥ 24.9.0**; Desktop uses its bundled runtime. Later DSH versions may change interfaces and should be checked again.

The included [verification record](source/docs/VERIFICATION.md) dated 2026-11-05 reports **116 passing tests, 0 failures, and 1 conditional skip**, plus real Linux DSH Web comparisons between the workbench's mode list and the chat `/` menu. Native Windows/macOS acceptance testing was not completed. Real GitHub downloads returned HTTP 403 in that test environment. These are existing release records; this README update does not claim a new cross-platform test run.

## Upgrade and uninstall

Install the new `.tgz` in the same environment to upgrade. Export important skills first if needed. To roll back, install a previously retained package in that environment; rolling back the plugin does not undo skill content edits.

Web uninstall:

```sh
dsh plugin --profile web remove dsh-skill-studio
```

On Desktop, uninstall from the installed plugins list. Uninstalling does not automatically remove skill files or history. History defaults to `~/.dsh/skill-studio`; `DSH_HOME` or plugin configuration can change the actual location.

## Development

**The npm project is in `source/`, not the repository root.**

```sh
git clone https://github.com/itcoffee66/DSH-Skill-Studio.git
cd DSH-Skill-Studio/source
npm ci
npm run build
npm test
npm pack
```

The resulting package is `source/dsh-skill-studio-0.2.2.tgz`. See the [English installation and publishing guide](source/docs/INSTALL.en.md) or [中文指南](source/docs/INSTALL.zh.md) for details. Since `package.json` is in a subdirectory, do not use this repository's root Git URL directly as an npm plugin installation source.

## Documentation and feedback

- [Full installation and publishing guide](source/docs/INSTALL.en.md) · [Source README](source/README.en.md)
- [Changelog](source/CHANGELOG.md) · [Verification record](source/docs/VERIFICATION.md)
- [Offline handbook](Skills-Studio-Guide-v0.2.2.html): download and open in a browser.
- [Issues and suggestions](https://github.com/itcoffee66/DSH-Skill-Studio/issues): include DSH/plugin versions, OS, Desktop/Web, workspace/mode, and reproduction steps. Remove keys and private information from logs.

## Credits and license

Created together by **IT咖啡馆 X 老陈聊AI**. Issues and pull requests are welcome.

Licensed under the [MIT License](source/LICENSE). This is a community plugin for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness), with no official affiliation with DeepSeek AI.
