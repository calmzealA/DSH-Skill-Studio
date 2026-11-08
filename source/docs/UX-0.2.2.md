# 0.2.2：分开回答“现在能用什么”和“技能库里有什么”

联合创作：**IT咖啡馆 X 老陈聊AI**。

0.2.1 把技能库总数放在模式选择器下面，并给文件显示“已启用”。虽然同时写了“此模式不可用”，主开关和总数仍容易被理解为该模式已经启用这些技能。0.2.2 将两件事分开呈现。

| 用户要判断的事 | 视图与依据 |
| --- | --- |
| 所选工作区、模式现在能用哪些技能 | 默认「当前模式」，依据宿主实际技能目录，且至少允许一种调用。 |
| 聊天输入框的 `/` 菜单应该有哪些技能 | 「/ 手动调用」筛选，依据该技能真实手动调用策略；比较前需确认工作区和模式与会话一致。 |
| 模型可以自动选择哪些技能 | 「模型自动使用」筛选，依据自动调用策略，与手动集合独立。 |
| 本机保存了哪些技能，哪些文件停用了 | 「技能库」，保留扫描到的本地技能和当前模式插件只读项，支持完整本地文件管理；「文件启用」不等于模式可用。 |
| 只读插件提供的技能能否开关 | 显示提供方信息，不放不可操作的蓝色文件开关。 |
| 是否已经确认完整目录 | 不完整时显示无法确认，不把未知状态计算成 0。 |

模式视图不放文件开关或批量文件操作；这些操作留在技能库。新建或导入成功后自动打开技能库，方便找到刚添加的技能。

同名副本只将宿主实际采用的版本计入可用名单。两种调用都关闭的技能可留在技能库中管理，不计为可调用。文件管理和历史恢复不会因为当前模式不提供某个技能而丢失。

数量不能硬编码。默认极简模式没有本地技能提供方，但其他插件仍可提供技能，用户也可以修改模式配置。因此“技能库 40 项、当前模式可调用 8 个”只是一种可能结果；真实数量由当前目录返回。

## English

Version 0.2.1 placed library totals and **Enabled** switches under a mode selector. Even with an unavailable-in-mode label, this could be read as “all these skills are enabled in this mode.” Version 0.2.2 separates the questions:

- **Current mode:** skills supplied by the actual host catalog with at least one permitted invocation.
- **/ Manual invocation:** the manual subset to compare with the conversation's slash menu, using the same workspace and mode.
- **Model selection:** the independent automatic-selection subset.
- **Skill library:** scanned local files and read-only entries supplied by plugins in the selected mode, with local file enablement managed separately.

The winning copy is counted once. Both-policies-off entries are not callable. Read-only plugin skills show their provider without a file switch. Incomplete results are marked unconfirmed rather than reported as zero. Counts come from the live catalog and are never fixed to the number in a screenshot or test fixture.
