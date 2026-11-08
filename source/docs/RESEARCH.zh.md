# 技能工作台：调研依据与能力边界

核验日期：**2026-11-04，北京时间**。这份说明解释首版的设计依据、参考产品和验收口径，供使用者与后续维护者核对。

0.2 的实现、菜单同步和兼容性结论以 [README](../README.md)、[变更记录](../CHANGELOG.md)及[验证记录](VERIFICATION.md)为准。

## 官方实现基线

本次开发读取了 [DeepSeek Harness 官方仓库](https://github.com/deepseek-ai/deepseek-harness)，源码基线为提交 **`fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159`**，根包版本 **0.2.2-rc.1**。npm `latest` 标签当时仍指向 **0.2.1-rc.5**；0.2.2-rc.1 可按精确版本获取。标签、可获取版本、源码 HEAD 和实际安装版本应分别记录。

| 官方约定 | 对插件设计的影响 |
| --- | --- |
| 一切皆插件；外部组合包通过 `dsh.bundle.patch` 进入 profile | 交付可安装组合包，由宿主完成加载；无需修改 DSH 源码。 |
| Skills 注册表与文件系统提供方分离 | “列出所有运行时技能”和“管理可写技能文件”不是同一件事。来源与只读状态必须可见。 |
| 文件系统发现仅一层：目录 `SKILL.md` 或平铺 `.md` | 导入前要检查最终布局；把下载仓库扔进根目录不保证被发现。 |
| frontmatter 的 `name`、`description` 必填 | 提供诊断，把“无效而被宿主忽略”解释出来。 |
| 默认根按 rank 裁决同名技能 | 显示同名与被遮蔽状态，避免修改无效副本。 |
| `modelInvocable` 与 `userInvocable` 独立 | UI 分别呈现模型自动调用和用户手动调用。 |
| 主机监视文件变化，正文按需读取 | 本地修改应回到真实技能文件；不为每次编辑要求重启整个宿主。 |
| Client locale 有公开命名空间与变更机制 | 跟随 DSH 设置切换中英文，未提供的语言使用英文回退。 |
| 自定义插件索引是实验性能力，默认没有索引源 | 提供自建 JSON 索引发布方法，不虚构官方上架或认证。 |
| 普通 npm CLI 拒绝 Desktop 保留 profile | Desktop 与 Web 的安装方法分别说明。 |

官方 [文件系统提供方说明](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/skill/skill-filesystem/README.zh.md)、[注册表说明](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/skill/skill/README.zh.md)、[locale 说明](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/client/locale/README.zh.md)和 [插件索引指南](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/docs/user/guide/plugin-market.zh.md)是对应行为的主要依据。

## 已有社区方案

以下为各项目当时 README 自述能力的比较，**未把阅读 README 视为逐项真机验证**。版本号仅用于标记本次观察，可能继续变化。

| 项目 | 本次观察的重点 | 对本插件的启发 |
| --- | --- | --- |
| [Fishquito7/dsh-skill-mcp-panel](https://github.com/Fishquito7/dsh-skill-mcp-panel)，2.3.7 | Skills/MCP 全页面板；技能列表、全文、启停、导入、迁移、分组、CLI；停用重命名，删除可撤销 | 核心管理已有成熟先例，入口和可恢复操作是基础能力。 |
| [MichengAI/dsh-skills-manager](https://github.com/MichengAI/dsh-skills-manager)，1.2.29 | 全局/项目/发现/回收站；多 Agent 来源；GitHub 订阅、更新 diff、备份恢复、创建和导入 | 导入后需要记录来源，更新需要保护本地修改，不能以“新增管理UI”当作唯一亮点。 |
| [aa2246740/dsh-skillhub](https://github.com/aa2246740/dsh-skillhub)，1.0.9 | 全局/项目/对话三层开关，保留原文件，MCP 联动 | 整体启停和调用策略应明确；不能误称本插件也提供会话三层覆盖。 |
| [2026heshao/dsh-armory](https://github.com/2026heshao/dsh-armory) | Skills、MCP、专家与市场的综合面板，强调来源和安装清单 | 综合市场属于另一个范围；首版把技能文件与变更管理做好。 |
| [xiajiajun516/dsh-config-manager](https://github.com/xiajiajun516/dsh-config-manager) | 整套 DSH 配置备份迁移，含技能 | 技能 ZIP 导出不等于完整 DSH 配置备份，应避免混淆。 |
| [oh-my-dsh/dsh-plugin-upgrade-skill](https://github.com/oh-my-dsh/dsh-plugin-upgrade-skill) | 版本迁移知识与插件开发/测试/发布工作流 | 开发者预览阶段应固定源码依据、实际运行测试，并保留兼容性边界。 |

本插件的首版重点是：**把有效技能及其来源解释清楚，把创建、导入、编辑和恢复做成可检查的闭环。** 不以“首个技能管理器”“官方技能商店”或“绝对安全”宣传。

## Codex 能力基线

“达到 Codex 的技能管理程度”需要拆成明确能力。核验依据为 [OpenAI 官方 Build skills](https://learn.chatgpt.com/docs/build-skills)，以及本次会话提供的技能管理流程。ChatGPT Work 与本地 Codex 的具体安装、存储和开关方式不同，不能混用路径与生命周期。

| 已核验的 Codex 能力 | Skills Studio 的对应设计 |
| --- | --- |
| 查看和探索技能 | 本地技能清单、搜索、来源和作用域。 |
| 创建和手动编写 `SKILL.md` | 模板创建、完整文本编辑、frontmatter 诊断。 |
| 安装来自其他仓库的技能 | GitHub 固定提交导入，以及 ZIP/文件夹/Markdown 导入。 |
| 启用或禁用技能 | 可写本地技能的整体启停；双调用策略分别配置。 |
| 多来源技能，按需加载正文和资源 | 显示根目录与同名状态，正文/资源检查，完整 bundle 导出。 |
| 检测技能变化 | 修改实际技能文件，由 DSH 发现链处理变更；菜单缓存以宿主版本行为为准。 |
| 可选 UI 与依赖元数据 | 不删除随技能导入的 `agents/openai.yaml` 等资源；保留文件不等于 DSH 会实现 Codex 对它们的所有语义。 |

Codex 的本地禁用可通过 `config.toml` 的 `skills.config` 选择器实现；本插件采用 DSH 文件系统发现可识别的文件状态，不能用 Codex 配置代替 DSH 行为。Codex 对同名技能的展示语义也不同：DSH 的有效项应以它自己的注册表与根优先级规则判断。

首版的哈希并发检查、导入预览、历史恢复与完整资源导出是本插件自己的管理能力。是否“全面超过 Codex”没有单一客观定义，因此只按实现与验证矩阵报告。

## 首版可验证范围

| 操作 | 需要验证的结果 |
| --- | --- |
| 列举与诊断 | 正常、停用、无效和同名项状态准确；来源路径清楚。 |
| 创建/编辑 | 有效技能能落盘；非法内容有具体诊断；外部修改不会被静默覆盖。 |
| 双调用策略 | 模型与手动调用分别映射到官方 frontmatter 字段。 |
| 导入 | Markdown、完整文件夹与 ZIP 先预览；不越界写入，不覆盖未确认的已有目标。 |
| GitHub | 公共仓库来源固定到提交，记录来源；下载内容不执行。 |
| 停用/启用 | 指令文件进入/离开发现链；不能声称会清除已经进入会话的历史正文。 |
| 删除/恢复 | 保留恢复所需内容；目标冲突不能悄悄覆盖其他文件。 |
| 导出 | 指令与配套资源一并保存，可用于重新导入。 |
| 语言/主题 | DSH 中英文切换可跟随；明暗主题、窄屏与键盘操作可用。 |
| 包安装 | 对实际支持的运行时安装 `.tgz` 并启动，验证 host 与 client 都已加载。 |

验证结论以随交付提供的实际报告为准。声明兼容范围不等于已经覆盖该范围内每个 alpha/RC 的每个平台。

## 已知边界

- **第三方内容。** 结构检查、文件哈希和固定提交提供可核查性，不能证明脚本或指令安全。
- **共享根。** 整体停用会将指令文件改为停用形式。`~/.agents/skills` 可能同时供 Codex、Claude 或其他 Agent 使用，文件变更会影响其他消费者。DSH 专用定制宜放入 `.dsh/skills`。
- **只读来源。** 插件自带、远程和运行时注册技能不应被当作可写用户文件。需要定制时复制到可写根，并检查同名优先级。
- **文件状态。** 编辑保护依赖读取到的文件哈希，不能替代外部备份或 Git 管理。对外部协同写入应重新读取后合并。
- **调用状态。** 停用控制后续发现，不改写现有对话历史；两个 invocation 字段也不是脚本执行权限系统。
- **GitHub。** 首版围绕公开仓库导入；固定提交不意味着自动升级、私有凭据支持或远程脚本执行。
- **分发。** 没有实际发布的 npm 名称、GitHub Release 和索引 URL 都应标为待配置；不能把模板地址当成已经上线。
- **平台。** Windows/macOS 的路径与 UI 适配需要对应平台验证；Linux 实测不能替代真机结论。
