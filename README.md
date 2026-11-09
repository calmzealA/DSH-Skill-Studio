# Skills Studio · 技能工作台

**在 DeepSeek Harness 中查看、编辑和管理 Skills，让技能装得明白、用得清楚、改得放心。**

由 **IT咖啡馆 X 老陈聊AI** 共同打造 · 社区插件 · 当前仓库版本 **0.2.2**

[English](README.en.md) · [下载安装包](https://github.com/itcoffee66/DSH-Skill-Studio/raw/refs/heads/main/dsh-skill-studio-0.2.2.tgz) · [完整安装指南](source/docs/INSTALL.zh.md) · [更新记录](source/CHANGELOG.md) · [反馈问题](https://github.com/itcoffee66/DSH-Skill-Studio/issues)

## 它能帮你做什么？

Skills 越装越多，往往会遇到这些问题：不知道技能放在哪里，不确定当前模式能不能用，修改正文要翻文件夹，导入时又担心覆盖自己的内容。

技能工作台把这些操作放到 DSH 内完成。你既能查看当前工作区和模式真正可调用的技能，也能管理本地技能文件、配套资源和变更历史。

| 能力 | 使用方式 |
| --- | --- |
| 看清实际可用技能 | 默认进入「当前模式」，分别查看模型自动使用、`/` 手动调用的清单。 |
| 管理技能库 | 搜索名称、描述或路径，切换列表与卡片，按来源、状态和诊断问题筛选。 |
| 创建与编辑 | 从模板创建技能，编辑完整 `SKILL.md`，分别设置模型自动选用和 `/` 手动调用。 |
| 导入与导出 | 支持 GitHub 技能目录或文件、本地 Markdown、ZIP 和文件夹；本地技能可完整导出。 |
| 管理配套资源 | 查看、编辑、新增、上传或移除技能中的资源文件，保留完整技能包。 |
| 检查来源更新 | 对比 GitHub 来源的新提交、正文和资源变化，再决定是否更新。 |
| 批量维护与恢复 | 批量启停本地技能、导出所选；通过变更历史恢复修改或移除的技能。 |
| 减少保存困扰 | 短暂文件占用自动有限重试；失败时保留当前编辑内容，提供持续错误提示和重试。 |

界面随 DSH 设置自动切换中英文，适配浅色与深色主题。详细说明放在可点击的提示图标中；详情在插件内容区内打开，提供明确的关闭入口。

## 快速安装

### 1. 下载插件包

下载仓库中的 **[dsh-skill-studio-0.2.2.tgz](https://github.com/itcoffee66/DSH-Skill-Studio/raw/refs/heads/main/dsh-skill-studio-0.2.2.tgz)**，保存到本机。浏览器若打开的是文件预览页，请点击 **Download raw file**。

安装使用 `.tgz`，无需解压。GitHub 的 **Code → Download ZIP** 下载的是整个仓库，不能直接当成插件包安装。

### 2. 安装并启用

**DSH Desktop 桌面版**

1. 打开「插件」，在「更多」中选择「安装第三方插件」（部分版本为「添加插件」）。
2. 在包名或地址输入框填写下载文件的**绝对路径**，例如：

   ```text
   C:\Users\YOUR_NAME\Downloads\dsh-skill-studio-0.2.2.tgz
   ```

3. 安装后启用 Skills Studio / 技能工作台，按 DSH 提示重载或重启。
4. 从侧边栏打开「技能工作台」。

macOS、Linux 桌面版同样使用本机绝对路径。桌面安装框只填包路径，不填下面的命令。

**DSH Web 版**

在安装包所在目录运行：

```sh
dsh --version
dsh plugin --profile web add ./dsh-skill-studio-0.2.2.tgz
```

Windows PowerShell：

```powershell
dsh plugin --profile web add ".\dsh-skill-studio-0.2.2.tgz"
```

自定义 profile 请替换 `web`。按安装结果处理重载；需要重启时，先停止原进程，再运行 `dsh web`。远程 Web 的包路径属于 **DSH 服务器**，而非浏览器所在电脑。Desktop 请使用应用内安装器，不要通过普通 CLI 管理 `desktop` profile。

目前可直接使用本仓库提供的安装包，不需要先添加市场。npm 包、Release 下载地址和自定义市场索引请以维护者实际发布的内容为准；不要把文档中的发布示例当成已上线服务。

## 第一次使用：先选工作区和模式

顶部「工作区」「模式」决定工作台查看的范围。默认跟随当前会话，也可选择其他已知工作区或模式。**这里的选择不会切换聊天会话实际使用的工作区或模式。**

| 页面 | 回答的问题 |
| --- | --- |
| 当前模式 | 所选工作区、模式现在实际可以调用哪些技能？ |
| 技能库 | 扫描到了哪些本地技能，以及当前模式由插件提供的哪些只读技能？ |

**技能文件已启用，不等于当前模式可用。** 例如技能库有 40 项，某个模式可能只提供其中 8 项；这只是示例，数量以 DSH 实际结果为准。DSH 默认极简模式不提供本地技能，仍可能包含插件提供的技能；自定义模式配置可以改变这一点。

要与聊天输入框的 `/` 菜单核对，先确认两边的工作区和模式一致，再点击「**/ 手动调用**」。只允许模型自动使用的技能不会出现在手动清单中；两种调用都关闭的技能不计为可用。无法确认目录时显示「—」，不会把未知结果写成确定的零。

## 常用操作

1. **新建技能**：点击「新建技能」，选择保存位置，填写名称、描述和指令。新建或导入后会打开「技能库」，方便找到新技能。
2. **修改调用方式**：在详情「概览」中分别设置「允许模型自动选用」「允许 /手动调用」，保存设置。修改完整指令请进入「编辑」。
3. **导入技能**：点击「导入技能」，选择 GitHub 或本地文件，确认「导入到」的位置，点「下一步」查看内容，再点「导入」。GitHub 多技能仓库请使用具体技能目录的链接。
4. **维护与恢复**：在「技能库」管理文件启停；进入「资源文件」维护配套内容；需要撤回修改时打开「变更历史」。

可管理工作区和个人的 `.dsh/skills`、`.agents/skills`，并识别配置中的自定义位置。真实路径可点击「保存位置」旁的提示图标查看。插件自带技能为只读，请通过原插件管理；需要改写可读取的本地技能时，可复制到其他位置后编辑。

## 使用前需要了解

- **共享目录会影响其他 Agent。** 对 `.agents/skills` 中技能的文件启停，可能影响读取同一目录的其他工具；整体停用会将指令文件重命名为禁用文件名。
- **停用不会删除聊天历史。** 已读入会话的技能正文不会因修改、停用或菜单刷新而被抹去。保存后重新展开 `/` 菜单查看新结果。
- **更新保护本地修改。** 来源更新需主动检查和确认；并发修改会触发防覆盖检查。保存失败时先处理文件占用或权限问题，再重试；不要丢弃尚未保存的编辑内容。
- **导入检查有边界。** 结构诊断不等于安全认证，导入过程不执行技能中的脚本；之后使用第三方技能时仍应了解其指令和资源。
- **完整导出针对本地技能包。** 运行时提供的虚拟技能仅供查看合成指令，不承诺导出提供方的原始资源。

## 兼容性与验证

本版本的兼容目标为 **DSH 0.2.1-rc.5 / 0.2.2-rc.1**。Web 与源码开发要求 **Node.js ≥ 24.9.0**；Desktop 使用自身运行时。DSH 后续版本可能存在接口变化，升级后请重新确认兼容性。

随版本附带的 [验证记录](source/docs/VERIFICATION.md)（2026-11-05）记录了 **116 项测试通过、0 项失败、1 项条件跳过**，以及 Linux DSH Web 中当前模式清单与真实 `/` 菜单的对照。Windows/macOS 尚未完成真机验收；真实 GitHub 下载在当时测试环境受 HTTP 403 限制。以上为既有版本记录，不代表本 README 更新重新完成了全平台测试。

## 升级与卸载

升级时在原环境安装新版 `.tgz`，重要技能可先导出。回退时在同一环境安装此前保留的旧包；回退插件不会撤销技能内容修改。

Web 卸载：

```sh
dsh plugin --profile web remove dsh-skill-studio
```

Desktop 在已安装插件列表卸载。卸载插件不会自动删除技能文件或历史；历史默认位于 `~/.dsh/skill-studio`，实际位置受 `DSH_HOME` 或插件配置影响。

## 源码开发

**本仓库的 npm 项目位于 `source/`，不在仓库根目录。**

```sh
git clone https://github.com/itcoffee66/DSH-Skill-Studio.git
cd DSH-Skill-Studio/source
npm ci
npm run build
npm test
npm pack
```

打包输出为 `source/dsh-skill-studio-0.2.2.tgz`。完整安装、升级、排错和发布说明见 [中文指南](source/docs/INSTALL.zh.md) / [English guide](source/docs/INSTALL.en.md)。当前仓库布局下，`package.json` 在子目录，因此不要直接把仓库根地址作为 npm 插件安装源。

## 文档与反馈

- [完整中文安装与发布指南](source/docs/INSTALL.zh.md) · [源码说明](source/README.md)
- [更新记录](source/CHANGELOG.md) · [验证记录](source/docs/VERIFICATION.md)
- [离线使用手册](Skills-Studio-Guide-v0.2.2.html)：下载后在浏览器中打开。
- [提交问题或建议](https://github.com/itcoffee66/DSH-Skill-Studio/issues)：请附 DSH 版本、插件版本、系统、Desktop/Web、工作区与模式，以及复现步骤；分享日志时移除密钥和私人信息。

## 联合创作与许可

**IT咖啡馆 X 老陈聊AI** 共同打造。欢迎提交 Issue 和 Pull Request。

本项目采用 [MIT License](source/LICENSE)。这是面向 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的社区插件，与 DeepSeek AI 无官方隶属关系。
