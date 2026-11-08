# Skills Studio 变更记录 / Release notes

由 **IT咖啡馆 X 老陈聊AI** 共同打造。项目及随附文档使用该联合创作署名；第三方组件与引用资料保留各自归属。

## 0.2.2

### 中文

- 默认进入「当前模式」，只显示所选工作区、模式实际提供且至少允许一种调用的技能。「技能库」单独保留本地技能文件和只读插件项的清单，不再用技能库总数表示当前模式可用数量。
- 模型自动使用与 `/` 手动调用分别计数和筛选。对照聊天的 `/` 菜单时使用手动调用清单；仅允许模型调用、两种调用都关闭或被同名副本覆盖的技能不会混入。
- 当前模式列表移除文件开关。只读插件技能显示提供方信息；技能库中的开关明确为「文件启用」，不暗示能在所选模式中使用。
- 目录未完整确认时显示无法确认，不把未知状态当成“0 个可用”。来源分组、筛选和数量跟随当前视图，切换范围不保留会误用于批量操作的隐藏选择。
- 新建或导入成功后自动打开「技能库」，避免当前模式不支持时找不到刚添加的技能。
- 保留 0.2.1 的保存重试、持久错误与草稿、模式名称、导入、完整资源和历史恢复能力。

在原 profile 安装 `dsh-skill-studio-0.2.2.tgz` 升级。技能和历史目录保持原位置；保留 `dsh-skill-studio-0.2.1.tgz` 与原交付 ZIP 供回退。截图或测试中的“8 个”只是该模式当时的实际结果，不是硬编码的固定数量。最终测试与验收范围见[验证记录](docs/VERIFICATION.md)。

### English

- **Current mode** is now the default and lists only skills actually supplied by the selected workspace and mode with at least one permitted invocation. **Skill library** separately retains local skill files and read-only plugin entries; its total is no longer presented as the mode's callable count.
- **Model use** and **/ Commands** have separate counts and filters. Compare the manual list with a conversation's `/` menu. Model-only skills, entries with both policies off, and shadowed copies do not enter that list.
- File switches are removed from the current-mode list. Read-only plugin skills identify their provider. The library switch explicitly controls **File enabled**, without implying availability in the selected mode.
- Incomplete catalog results remain unconfirmed rather than becoming a definite zero. Source groups, filters, and counts follow the selected view; hidden selections do not carry into batch operations after a scope change.
- Successful creation or import opens **Skill library**, so a mode that cannot use the new skill does not hide it from file management.
- The save retries, persistent errors and drafts, mode names, import flow, complete resources, and recovery history from 0.2.1 remain available.

Install `dsh-skill-studio-0.2.2.tgz` into the existing profile. Skill and history locations remain unchanged. Retain `dsh-skill-studio-0.2.1.tgz` and its delivery ZIP for rollback. A count such as eight in a screenshot or fixture is an observed result, not a fixed total. See the [verification record](docs/VERIFICATION.md) for final checks and scope.

## 0.2.1

### 中文

- 保存遇到短暂文件占用时进行有限重试；持续占用或写入权限问题明确报错。失败不改写原文件，重试不绕过外部修改的哈希检查。
- 保存错误保留在详情的保存区域，提供重试和复制错误详情，未保存内容保留。普通查看和刷新不再清除保存错误；写入成功后的刷新失败与保存失败分别说明。
- 使用 DSH 的「工作区」「模式」名称；内置模式显示标准模式、PTC 模式、极简模式、创造模式，自定义名称原样保留。左侧和保存位置显示具体工作区名称。
- 用直接说明表达当前模式能否使用技能。DSH 默认极简模式不提供本地技能，不再写“未进入所选预设”。
- 成功操作使用「已保存」等简短结果，目录和菜单同步详情收进提示图标；左侧和路径说明改为面向用户的技能使用范围。
- 导入改为「导入技能 → 导入到 → 下一步 → 导入」，说明为“从 GitHub 或本地文件添加技能”。只有遇到真实同名问题时才显示提醒，长路径在「保存位置」中查看和复制。

在原 profile 安装 `dsh-skill-studio-0.2.1.tgz` 升级。技能和历史目录保持原位置；保留 `dsh-skill-studio-0.2.0.tgz` 与原交付 ZIP 供回退，0.2.1 另存，不覆盖旧交付。

测试数量和范围以[验证记录](docs/VERIFICATION.md)为准。占用故障通过可复现测试验证，不能视为 Windows/macOS 真机验收；实际公共 GitHub 下载和公开发布仍以各自完成的验证为准。

### English

- Save operations retry brief file locks for a bounded period and report persistent locks or write-access failures explicitly. Failed writes preserve the original; retries retain concurrent-change protection.
- Save errors stay beside the detail's save controls, with retry and copyable error details. The unsaved draft remains. Ordinary reads and refreshes do not clear the error; refresh failures after a successful write are described separately.
- DSH's **Workspace** and **Mode** terminology replaces custom labels. Built-in modes show their localized names and custom names remain unchanged. The sidebar and destination controls identify the actual workspace.
- Mode support is explained directly: DSH's default Minimal mode does not provide local skills, rather than describing a skill as “not in the selected preset.”
- Success uses short messages such as **Saved**, with catalog/menu synchronization details available through a help control.
- Import uses **Import skills → Import to → Next → Import** and “Add skills from GitHub or local files.” Actual name conflicts receive specific warnings; long paths are available through **Save location** with a copy action.

Install `dsh-skill-studio-0.2.1.tgz` into the existing profile. Skill and history locations remain unchanged. Retain `dsh-skill-studio-0.2.0.tgz` and its original delivery ZIP for rollback; 0.2.1 is a separate delivery.

See the [verification record](docs/VERIFICATION.md) for final counts and scope. Reproducible lock-failure tests are not a native Windows/macOS acceptance test. Live public GitHub downloading and public distribution retain their own verification status.

## 0.2.0

### 中文

- 默认使用紧凑列表，详情留在工作台内容区；打开技能先看「概览」，正文修改进入「编辑」。关闭控件不再占用 DSH 标题栏。
- 顶部可选择目标工作区与 Agent 预设，支持仅全局技能。选择只改变检查视图，不切换真实会话的目录或预设，也不创建 Agent。
- 文件启停与预设下的实际可用性分别显示。概览中的两种调用策略独立保存，通过 YAML AST 保留原正文、注释和其他元数据；按钮为「保存调用设置」。
- 修改后核对实际技能目录，再报告目录核验和菜单同步状态。文件保存成功不等于所有预设都已提供该技能。
- 针对 SDK 的会话技能菜单缓存，通过公开 Loader 生命周期仅重挂官方 `ui-skill` 菜单桥；当前打开的技能菜单组会先撤下，重新打开菜单时取得新列表。其他已连接且可见的窗口约每 5 秒检查变更版本，恢复可见时也会检查。
- 增加点击问号帮助，列表移除内部优先级数字。资源页支持上传资源，并保留完整包导出、来源更新预览、并发哈希保护和历史恢复。

升级安装 `dsh-skill-studio-0.2.0.tgz` 到原 profile。技能文件和 `$DSH_HOME/skill-studio` 历史目录保持原位置；保留 `dsh-skill-studio-0.1.0.tgz` 与旧交付 ZIP，回退时重新安装旧包。

菜单刷新不重启 Agent，也不会重写会话中已经加载的正文。隐藏或断开的窗口不承诺在 5 秒内同步；不支持对应公开接口的宿主会给出状态提示。测试结论以[验证记录](docs/VERIFICATION.md)对应的版本为准：Windows/macOS 未真机验证，真实外网 GitHub 下载在当前环境返回 HTTP 403，公开 npm/Release/索引地址需实际发布后才可使用。

### English

- A compact list is now the default. Details stay within the workspace content area and open on **Overview**; instruction changes use **Edit**. Detail controls no longer occupy DSH's title bar.
- Target workspace and Agent preset selectors support a global-only view. These choices change the inspection view without changing a real Session's directory or preset, or creating an Agent.
- File enablement and availability in the selected preset are separate. Independent invocation settings are saved through a YAML AST, preserving the body, comments, and other metadata.
- Mutations check the actual skill catalog and report catalog/menu synchronization separately. A saved file does not prove that every preset provides the skill.
- A public Loader lifecycle bridge remounts only the official `ui-skill` menu integration to refresh the SDK's session-cached skill list. The current skill menu group is withdrawn first; reopen the menu to obtain its fresh list. Other connected, visible windows check the revision about every five seconds and when they become visible.
- Clickable question-mark help replaces persistent technical explanations; internal priority numbers are removed from the list. Resource uploads join complete bundle exports, source-update previews, hash protection, and recoverable history.

Install `dsh-skill-studio-0.2.0.tgz` into the existing profile. Skill locations and `$DSH_HOME/skill-studio` history remain unchanged. Retain the `0.1.0` package and original delivery ZIP for rollback.

Menu refresh does not restart Agents or rewrite instructions already loaded into conversation history. Five-second synchronization is not guaranteed for hidden or disconnected windows. Hosts without the required public interface report their synchronization status. See the version-specific [verification record](docs/VERIFICATION.md): native Windows/macOS checks remain unperformed, live GitHub downloads returned HTTP 403 in this environment, and public package/index addresses must be published before they work.

## 0.1.0

首版提供本地技能管理、双语界面、完整包导入导出、GitHub 固定提交与来源更新预览、资源管理、变更历史和哈希防覆盖。该版交付包保留为回退版本。

The initial release provided bilingual local skill management, complete bundle import/export, pinned GitHub imports and update previews, resource management, recovery history, and hash-based overwrite protection. Its delivery package remains available as a rollback artifact.
