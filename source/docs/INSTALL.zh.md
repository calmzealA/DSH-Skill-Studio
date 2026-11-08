# Skills Studio 安装与公开发布

本文对应插件 **`dsh-skill-studio@0.2.2`**，显示名称为 **技能工作台 / Skills Studio**，由 **IT咖啡馆 X 老陈聊AI** 共同打造。包和公开地址是两回事：交付的本地 `.tgz` 可以直接安装；npm 包和 GitHub 仓库只有实际发布后才能用于网友安装。[变更记录](../CHANGELOG.md)列出 0.2.2 的主要调整。

## 1. 确认你用的 DSH

- **Desktop 桌面应用：** 在应用内查看版本，并使用应用内的插件安装器。
- **Web：** 在启动 DSH 的终端运行 `dsh --version`，确认正在使用的 profile，下面示例使用 `web`。
- **远程 Web：** 本地路径指运行 DSH 服务器那台机器上的路径。电脑浏览器能看到某文件，不代表远程 DSH 服务器也能读到它。

兼容目标为 **0.2.1-rc.5** 和 **0.2.2-rc.1**。请以[验证记录](VERIFICATION.md)标明的插件版本与实测环境为准，旧版结果不自动成为 0.2.2 的结论。Windows/macOS 尚未真机验证；当前执行环境的真实 GitHub API 下载返回 HTTP 403。核验时 npm `latest` 标签是 0.2.1-rc.5，0.2.2-rc.1 已可按精确版本获取；不能用 dist-tag 或仓库页面版本代替本机版本。

全新安装 Web 时，可选择固定版本运行时；已有可用 DSH 的用户无需先重新安装：

```sh
npm install -g @deepseek-ai/dsh@0.2.1-rc.5
```

本次源码基线要求 Node.js **24.9.0 或更新版本**。Web 的 `dsh plugin` 会转发给 PATH 上的 pnpm。若提示找不到 pnpm，先按你现有的 Node 管理方式安装它；当前源码使用的版本为：

```sh
npm install -g pnpm@11.28.5
```

这些全局安装命令只用于缺少对应工具的机器。Desktop 使用自身打包的运行时和安装器，通常不需要准备这些命令行工具。

## 2. 安装交付包

解压交付 ZIP，找到 `dsh-skill-studio-0.2.2.tgz`。不要把外层源码 ZIP 当成插件包。

### Desktop：Windows、macOS、Linux

1. 把 `.tgz` 放到本机固定目录。
2. 打开 DSH「插件」，在「更多」中选择「安装第三方插件」。不同发行版可能把入口放在「添加插件」中。
3. 在包名或地址中输入该文件的**绝对路径**，不要在输入框里附加 `dsh plugin ...`。
4. 安装后点击「立即启用」；若关闭了安装窗口，在已安装列表中启用 Skills Studio。
5. 按宿主提示完成重载或重启，再打开技能工作台。

输入框示例：

| 系统 | 示例路径 |
| --- | --- |
| Windows | `C:\Users\YOUR_NAME\Downloads\dsh-skill-studio-0.2.2.tgz` |
| macOS | `/Users/YOUR_NAME/Downloads/dsh-skill-studio-0.2.2.tgz` |
| Linux | `/home/YOUR_NAME/Downloads/dsh-skill-studio-0.2.2.tgz` |

替换为实际用户名和文件路径。普通 npm CLI 会拒绝管理 `desktop` profile；不要用 `dsh plugin --profile desktop ...` 代替桌面安装器。

### Web：Windows PowerShell

在包所在目录打开 PowerShell：

```powershell
dsh --version
dsh plugin --profile web add ".\dsh-skill-studio-0.2.2.tgz"
```

或使用完整路径，路径中有空格时保留引号：

```powershell
dsh plugin --profile web add "C:\DSH Plugins\dsh-skill-studio-0.2.2.tgz"
```

### Web：macOS / Linux / WSL

```sh
dsh --version
dsh plugin --profile web add ./dsh-skill-studio-0.2.2.tgz
```

WSL 中运行的 DSH 使用 WSL 的用户目录和文件路径。Windows 盘上的包可按实际挂载点使用，例如 `/mnt/c/Users/YOUR_NAME/Downloads/dsh-skill-studio-0.2.2.tgz`。

### 未全局安装 dsh 命令

用与你现有环境一致的运行时版本代替命令入口，例如：

```sh
npx @deepseek-ai/dsh@0.2.1-rc.5 plugin --profile web add ./dsh-skill-studio-0.2.2.tgz
```

仍需保证 pnpm 能由该运行时找到。自定义 profile 把 `web` 替换为实际名字；`--profile` 必须放在 `add` 前面。

### 生效和检查

以宿主返回的安装结果为准处理启用、重载和重启。需要重启 Web 时，先结束现有 DSH 进程，再从原工作目录启动：

```sh
dsh web
```

检查以下结果：

1. 已安装列表出现 `dsh-skill-studio`，版本为 `0.2.2`，且已启用。
2. 能打开技能工作台，列表没有一直停在加载状态。
3. 默认进入「当前模式」，只显示该工作区、模式实际可调用的技能；切到「技能库」可查看完整技能清单。选中技能后在内容区查看「概览」。在 DSH「设置 → 常规」切换中文/English，文案跟随变化。
4. 确认顶部「工作区」「模式」，创建一个测试技能，检查写入位置；分别保存调用设置、正文，确认已保存。
5. 重新打开 `/` 菜单查看新列表。已读进旧会话的正文不会因为文件修改、停用或菜单刷新而从历史中消失。

## 3. 第一次使用

先确认顶部的「工作区」「模式」。默认使用当前会话的工作区和模式，也可选择其他已知工作区。左侧显示具体工作区名称，避免把另一个工作区仍称为“当前工作区”。没有会话时，也能管理个人技能。

**工作台中的选择只改变查看和管理范围，不会改变当前会话的工作区或模式。** 内置模式使用 DSH 的标准名称：标准模式、PTC 模式、极简模式、创造模式；自己创建的模式保留原名称。

### 当前模式与技能库

打开工作台默认进入「当前模式」，只显示所选工作区、模式下实际可调用的技能。切换到「技能库」可管理全部已扫描的本地技能，并查看当前模式由插件提供的只读项。本地项包括已停用、当前模式不提供、被同名副本覆盖和两种调用都关闭的技能。技能库中的文件开关（「文件已启用 / 文件已停用」）不代表该模式能用；它会影响读取同一文件的模式或 Agent。

DSH 默认极简模式不提供本地技能，但仍可由插件提供技能。标准模式和 PTC 模式通常提供本地技能。模式配置可以改变，因此以实际目录为准，不能把截图中的 8 个当成固定数量。

点击「当前模式可用」「模型自动使用」「/ 手动调用」统计即可筛选对应清单，自动与手动分别统计。要核对聊天输入框的 `/` 菜单，请先让顶部工作区和模式与该会话一致，再筛选「/ 手动调用」。仅允许模型自动使用的技能不应出现在这份手动清单中；两种调用都关闭的技能不计为可用。

若目录不完整或暂时无法确认，界面会说明无法确认，而不是显示一个确定的“0 个可用”。插件自带的只读技能显示提供方信息，不显示蓝色文件开关。

选择技能先看「概览」，修改正文时再进入「编辑」。新建或导入成功后自动切到「技能库」，方便找到刚添加的技能；当前模式能否调用仍以模式清单为准。

新建或复制时，在「保存到」选择位置；导入时，在「导入到」选择使用范围：

| 使用范围 | 适合什么情况 |
| --- | --- |
| 某个工作区 | 只想让这个工作区使用，例如项目规范或专用流程；界面显示具体工作区名称。 |
| 个人技能 | 供本机多个工作区共用的文件；具体模式能否调用仍看「当前模式」。DSH 专用与其他 Agent 共用的位置会分别说明。 |
| 插件自带技能 | 随插件提供，只读查看；需要修改时先复制到可写位置。 |

需要查看真实文件夹时，点「保存位置」的提示图标，可以查看和复制路径。路径用于定位文件，不需要记住它才能使用工作台。

### 目录参考

以下供需要手动定位文件的用户参考；实际路径以「保存位置」为准。

| 来源 | 默认路径 |
| --- | --- |
| 工作区 DSH 技能 | `<projectRoot>/.dsh/skills` |
| 工作区共享技能 | `<projectRoot>/.agents/skills` |
| 自定义位置 | DSH 配置中的目录 |
| 个人 DSH 技能 | `$DSH_HOME/skills`，默认 `~/.dsh/skills` |
| 个人共享技能 | `$DSH_AGENTS_HOME/skills`，默认 `~/.agents/skills` |
| 插件自带技能 | 由对应插件提供 |

同名技能可能来自不同位置，详情会显示当前实际使用的版本。`projectRoot` 通常是离工作目录最近的 `.git` 祖先；没有时使用工作目录。Windows 的 `~` 指运行 DSH 的用户主目录。自定义环境变量会改变实际位置；远程 DSH 的路径属于服务器。

技能必须有合法 YAML frontmatter：

```markdown
---
name: article-review
description: Review a Chinese technology article for clarity and unsupported claims.
---

Read the article, identify unsupported claims, and suggest concrete revisions.
```

名称使用小写英文、数字和连字符；描述必填。目录可以包含配套资源，分发时应导出整个技能包。中文目录名与合法英文 `name` 可以并存。

「允许模型自动选用」对应 `disable-model-invocation` 的反向含义，「允许 /手动调用」对应 `user-invocable`。两个设置互相独立；在概览中点「保存设置」单独保存，保留原正文、注释和其他元数据。完整指令仍在「编辑」页签保存。查看状态时应同时核对调用设置、整体文件启停和所选模式下的实际可用性。

| 状态层次 | 解释 |
| --- | --- |
| 技能库中的文件开关 | 指令文件是否处于可发现的文件名状态，不表示当前模式实际提供它。 |
| 当前模式可调用 | 宿主实际提供该技能，且至少允许一种调用；模型自动使用和 `/` 手动调用各自统计。出现在列表中不表示模型已读过全文。 |
| 会话已读内容 | 曾注入聊天的技能正文；工作台不修改这段历史，也不能仅凭目录结果断言当前模型上下文仍保留全文。 |

**共享目录的启停会影响其他 Agent。** 整体停用会重命名指令文件，例如 `SKILL.md` 变为 `SKILL.md.disabled`。在 `~/.agents/skills` 这类共享根操作，其他读取该目录的 Agent 也会受到影响；DSH 专用副本可放在 `.dsh/skills`。

### 常用操作

| 目的 | 操作 |
| --- | --- |
| 新建 | 点「新建技能」，在「保存到」选择使用范围，填写合法名称、描述和起步模板。 |
| 修改调用设置 | 打开本地技能「概览」，分别切换「允许模型自动选用」「允许 /手动调用」，点「保存设置」；看到「已保存」即可，更多同步信息点提示图标查看。 |
| 修改指令 | 打开技能，在「编辑」中修改完整正文，点「保存修改」。 |
| 修改配套文件 | 在「资源文件」选择文本文件编辑，点「保存资源」；也可填写相对路径「新增文本资源」、上传资源或移除资源。二进制文件保留在包内，可导出后查看。 |
| 导入本地包 | 「导入技能 → 本地文件」，选择 `.md`、`.zip` 或完整文件夹，在「导入到」选择位置，点「下一步」，查看技能后点「导入」。 |
| 从 GitHub 导入 | 「导入技能 → GitHub」，粘贴具体技能文件夹的 `/tree/` URL 或 Markdown 文件的 `/blob/` URL（支持 `SKILL.md` 与平铺 `.md`）。点「下一步」查看技能，再点「导入」；有同名技能时会显示具体提醒。 |
| 更新 GitHub 来源 | 已导入技能的「概览 → 来源 → 检查来源更新」，对照已安装/新提交、本地/新正文和资源变更，检查本地修改提示，再点「应用已检查的更新」。 |
| 复制到另一根 | 打开本地技能，点「复制到其他位置」，选择可写位置；保留原技能和资源。 |
| 批量维护 | 在「技能库」勾选本地技能，执行文件启用、停用或导出所选。切换范围后，隐藏选择不会被用于批量修改。 |
| 删除与恢复 | 「移除技能」会留恢复点；在「变更历史」选对应快照恢复。恢复前也保存当前状态。 |

GitHub 仓库如果包含很多技能，请粘贴**具体技能目录**的网址；当前版本不提供整仓多技能选择器。仓库根本身是一个技能时也支持仓库根 URL。单次获取限制为 200 个文件、单文件 2 MiB、总文件内容 8 MiB。公共 API 限流或网络不可达时会给出错误，稍后重试；不会通过执行第三方下载脚本绕过。

对于插件或运行时提供的虚拟技能，工作台仅供查看合成指令，不提供其原始资源的完整导出；请通过原提供方管理。对于本地完整包，更新会处理其全部资源，并用整个 bundle 的哈希检查并发修改。GitHub 更新是主动操作，工作台不会后台自动覆盖你导入的内容。

### 保存结果与技能菜单

相关 SDK 的客户端技能目录按会话缓存。旧版会出现文件写入成功、宿主已发现新状态，但已打开的 `/` 菜单仍显示旧结果的问题；这不表示指令文件没有保存。

0.2.2 的成功提示只显示「已保存」等简短结果；目录和菜单的同步信息可点击提示图标查看。**当前打开的技能菜单组会先关闭，重新打开 `/` 时获取新列表。** 若菜单仍旧，先确认工作台所选工作区和模式与会话相同，再查看同步详情。“已保存”只说明文件已保存，不等于每种模式都支持该技能。
其他窗口在已加载插件、连接正常且可见时，约每 5 秒检查宿主的变更版本，发现变化后刷新各自菜单与工作台列表；隐藏窗口恢复可见时也会检查。它不是对离线或隐藏窗口的 5 秒送达承诺。刷新不重启 Agent、不回写聊天，也不删除会话已经读入的正文。

## 4. 升级、回退和卸载

从旧版升级到 0.2.2，在原 profile 安装新 `.tgz`。操作前可导出重要技能；更新插件不等于更新已导入的第三方技能。

```sh
dsh plugin --profile web add ./dsh-skill-studio-0.2.2.tgz
```

PowerShell 使用 `dsh plugin --profile web add ".\dsh-skill-studio-0.2.2.tgz"`。Desktop 在原应用的安装器中输入新包绝对路径，按宿主提示启用与重载。

技能仍保存在原技能根；工作台历史目录仍是 `$DSH_HOME/skill-studio`，默认 `~/.dsh/skill-studio`，本次不迁移、不清空。插件卸载也不会自动清理这些技能文件和历史。若配置了自定义 `dshHome`，历史仍保存在对应位置。

保留旧的 `dsh-skill-studio-0.2.1.tgz` 和原交付 ZIP，0.2.2 另存为新文件。需要回退时，在同一 profile 安装旧包：

```sh
dsh plugin --profile web add ./dsh-skill-studio-0.2.1.tgz
```

Desktop 同样在安装器选择旧包。更早的 0.1 包也可自行保留。回退插件不会撤销使用新版期间对技能文件的修改；需要恢复技能时使用变更历史或此前导出的完整包。不要通过删除历史目录完成回退。

Web 卸载：

```sh
dsh plugin --profile web remove dsh-skill-studio
```

Desktop 在已安装插件列表中卸载。跨机器迁移请导出完整技能包，不能只复制某个插件设置文件。若希望另外删除技能或历史，应在确认真实路径与备份后独立处理。

## 5. 把插件发布给网友

### 先发布包，再公布命令

下面所有 `YOUR_GITHUB_USER` 都是占位符。未完成发布前，不要把相应 npm 包名和 URL 写成“点击即可安装”。

在插件源码根目录检查：

```sh
npm install
npm run build
npm test
npm pack --dry-run
npm pack
```

确认生成 `dsh-skill-studio-0.2.2.tgz`，其中包含 manifest、bundle patch、宿主代码、浏览器产物、语言资源和必要文档。在干净 DSH profile 中安装该 `.tgz` 并启动，确认它实际可加载。

### npm 发布

你需要一个有该包名发布权限的 npm 账号。`dsh-skill-studio` 如已被占用，先改成你拥有的名称，例如 `@YOUR_NPM_SCOPE/dsh-skill-studio`；同时更新 manifest、patch 中的模块名、文档、市场索引及打包检查。

改名后，以 `npm pack` 实际输出的 `.tgz` 文件名替换下面的示例文件名。

```sh
npm login
npm publish ./dsh-skill-studio-0.2.2.tgz --access public
```

npm 可能要求浏览器登录或双重验证，按 npm 自身提示完成。确认发布成功后，让网友输入真实包名和精确版本，例如：

```sh
dsh plugin --profile web add dsh-skill-studio@0.2.2
```

Desktop 直接在插件安装器中输入 `dsh-skill-studio@0.2.2`。这条命令只有在包确实以该名称发布后才可用。

### GitHub 发布预构建包

创建自己的公开仓库，填入真实 repository/homepage，并将源码、预构建产物和文档提交后创建标签。以下命令在你自己的 checkout 中执行，提交前检查 `git status`，避免把本地数据或测试工作区加入仓库：

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

在 GitHub Releases 创建 `v0.2.2` 并上传 `dsh-skill-studio-0.2.2.tgz`。安装命令示例，替换用户名并确认链接已存在：

```sh
dsh plugin --profile web add https://github.com/YOUR_GITHUB_USER/dsh-skill-studio/releases/download/v0.2.2/dsh-skill-studio-0.2.2.tgz
```

也可从 Git 仓库安装：

```sh
dsh plugin --profile web add github:YOUR_GITHUB_USER/dsh-skill-studio#v0.2.2
```

Git 安装应包含已经生成的运行产物；用户无需在安装时运行构建脚本。若你自行添加 `prepare` 等安装时脚本，pnpm 可能要求额外批准，应以宿主提示为准，不要为了安装盲目允许所有依赖脚本。

本项目开发时忽略 `lib/`，因此上面的 `git add -f lib` 用于把发行产物明确加入发布提交；只提交源码但不构建，会使 Git 直装缺少入口文件。

### 仓库自带的自动检查

源码包含 `.github/workflows/check.yml`。推送到自己的 GitHub 仓库或提交 PR 后，它会在 Linux、Windows、macOS 的 Node 24 环境运行安装、测试、构建与打包，并在 Actions 中保留各平台 `.tgz` 产物。首次公开发布前，打开该仓库 Actions 页面检查三项任务的实际结果；有这份工作流文件不代表它已经在三个系统上执行通过。

这份工作流不会自动发布到 npm，也不会替你创建公开 Release 或 Pages。确认 CI 与发行产物后，再执行上面的发布步骤。若已安装并登录 GitHub CLI，也可用以下命令创建 Release 并上传包：

```sh
gh release create v0.2.2 ./dsh-skill-studio-0.2.2.tgz --title "Skills Studio 0.2.2" --notes "Skills Studio 0.2.2: clearer skill views and catalog synchronization. See README for installation and verification."
```

Release 标签已存在时，该命令使用现有标签；确认它指向刚验证的发行提交。发布后仍应按公开 URL 再做一次真实安装检查。

## 6. 自建市场索引

**DSH 没有内置索引源，也没有必须注册的官方市场账号。** 它接受一个公开的 JSON 索引 URL。你可以发布自己的“IT咖啡馆 X 老陈聊AI 插件索引”，其中先放本插件。

### 索引内容

npm 方式的完整最小示例：

```json
{
  "format": 1,
  "title": { "en": "IT咖啡馆 X 老陈聊AI Plugins", "zh": "IT咖啡馆 X 老陈聊AI 插件" },
  "plugins": [
    {
      "name": "dsh-skill-studio",
      "title": { "en": "Skills Studio", "zh": "技能工作台" },
      "description": {
        "en": "Inspect, create, import and manage local DSH skills.",
        "zh": "查看、创建、导入并管理 DSH 本地技能。"
      },
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

把 `publishTimestamp` 改为实际发布的 Unix 秒；发布前按实际包名修改 `name`，并把包自身的 `engines.dsh` 原样写入对应版本的 `engines.dsh`。省略示例中的兼容范围不等于宣称所有宿主都适用，宿主安装时仍会校验包的声明。

Git 方式把版本的 `source` 换成以下结构，使用实际发布提交的完整 **40 位 SHA**；不能填 `main` 或标签名代替：

```json
{
  "type": "git",
  "url": "https://github.com/YOUR_GITHUB_USER/dsh-skill-studio",
  "commit": "REPLACE_WITH_ACTUAL_40_CHARACTER_COMMIT_SHA"
}
```

这段 Git 示例中的 SHA 是占位文字，替换后才是有效索引。可用 `git rev-parse 'v0.2.2^{commit}'` 获取发布标签对应的提交。

本项目附带生成脚本，填入真实仓库与提交即可生成 Git 来源索引：

```sh
node scripts/generate-market.mjs --repository https://github.com/YOUR_GITHUB_USER/dsh-skill-studio --commit ACTUAL_40_CHARACTER_COMMIT_SHA --output docs/market/index.json
```

脚本参数中的用户名和 SHA 都需要替换，不能原样运行示例。

官方仓库也提供索引生成器。把真实 npm 包名或 Git 仓库 URL 写进 `plugins.txt`，在已经安装并构建的 DSH 源码仓库运行：

```sh
pnpm --filter @deepseek-ai/dsh-plugin-market-generator start --input plugins.txt --output site/index.json --title "IT咖啡馆 X 老陈聊AI Plugins"
```

### GitHub Pages 托管

1. 将索引保存为你仓库的 `docs/market/index.json`，图标若有则放在相邻 `icons/` 目录。
2. 提交并推送到 GitHub。
3. 在仓库「Settings → Pages」选择「Deploy from a branch」，分支选 `main`，目录选 `/docs`。
4. 等 Pages 显示部署成功，打开真实地址验证 JSON：

   `https://YOUR_GITHUB_USER.github.io/dsh-skill-studio/market/index.json`

5. 确认此地址返回 2xx、UTF-8 JSON、没有跳转，也不是 GitHub 的文件预览 HTML 页面。终端可检查 `curl -I "实际URL"`。

上述是部署后的地址格式，不是本交付已经上线的市场。Cloudflare Pages、对象存储或其他静态主机同样可以托管；使用实际返回 JSON 的 HTTPS 地址。

### 网友如何添加

1. DSH「插件 → 实验性插件」启用「自定义插件索引」。有的版本先点「更多」。
2. 打开「发现 → 添加索引源」，粘贴你已经验证的 HTTPS 索引地址。
3. 搜索 Skills Studio / 技能工作台。
4. 打开卡片，核对作者、包名、版本和真实安装来源，安装后启用。

添加索引只增加发现来源，不自动安装其中所有插件，也不构成 DSH 官方安全认证。

## 7. 提高社区可发现性

- 给公开仓库添加 GitHub 话题 **`dsh-plugin`**。这是官方 README 推荐的社区发现入口。
- npm `keywords` 中填写真实相关关键词；让 README 清楚说明插件版本、兼容范围和安装入口。
- 可向 [dshworks/awesome-dsh-plugins](https://github.com/dshworks/awesome-dsh-plugins) 提交收录 PR。按其 [CONTRIBUTING.md](https://github.com/dshworks/awesome-dsh-plugins/blob/main/CONTRIBUTING.md) 修改 `data/plugins.json`，运行 `node scripts/validate.mjs` 和 `node scripts/render.mjs`，提交相应生成文件。
- `verifiedAgainst` 写实际测试过的 DSH 版本，`lastVerified` 写实际核验日期；`status` 如实填写，`verified` 需有 `evidence`，例如 `package.json#dsh.bundle`。npm 未发布就不要填写一个不存在的 npm 地址。

该社区公开的 Discover 索引为 `https://dsh.works/awesome-dsh-plugins/market/index.json`。能否被收录由维护者决定；提交 PR 不等于已上架。

## 8. 排错

| 现象 | 检查 |
| --- | --- |
| 安装成功但没有入口 | 检查当前 Desktop/Web profile、插件是否已启用、兼容性错误和宿主的重载提示。 |
| 版本不兼容 | 记录 `dsh --version` 与插件版本；使用满足声明的宿主，不能把 master 版本当作本机版本。 |
| 找不到包 | 本地使用实际 `.tgz` 路径；公开地址需先发布。切换 npm 镜像不会修复不存在的 GitHub Release 文件。 |
| pnpm 找不到 | Web CLI 检查 PATH；Desktop 使用内置安装器。 |
| 保存提示文件被占用或无权写入 | 程序会先有限重试；仍失败时，错误保留在保存区域，草稿不清空。关闭可能占用文件的编辑器或同步程序，检查写入权限后重试；也可复制错误详情用于排查。 |
| 提示原文件已保留、需恢复 | 展开「错误详情」查看恢复位置，保留这些文件和错误信息。先解决占用或权限问题，不要反复保存或自行删除恢复副本；这类错误不提供普通保存重试。 |
| 保存提示文件已变化 | 重新读取最新内容并合并修改，再保存；这是防覆盖保护。 |
| 某技能无法调用 | 确认「工作区」「模式」、启用状态和两个调用开关。默认极简模式不支持本地技能；同名技能可能来自其他位置。 |
| 新增技能或调用策略没反映到 `/` 菜单 | 点提示图标查看同步详情，关闭后重新打开 `/` 菜单，并确认工作区和模式与会话一致。若仍未更新，再重连检查。 |
| 停用后旧会话仍记得正文 | 旧历史仍包含已读内容；新建会话再检查后续可用性。 |
| GitHub 获取失败 | 检查网络、仓库路径和提交是否可读。私有仓库、登录凭据和任意网站下载不在公开导入的默认范围内。 |
| 远程 DSH 读不到电脑文件 | 使用服务器上的实际路径，或通过界面提供的上传入口传输。 |
| 只读条目不能修改 | 先确认来源；使用可写本地根的副本进行定制。 |

本项目及随附文档由 **IT咖啡馆 X 老陈聊AI** 共同打造，以该联合品牌署名。本文的发布命令供维护者手动执行；交付不自动发布 npm、GitHub、市场索引或社交平台内容。

## 官方依据

- [CLI 与 profile 行为](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/apps/cli/README.zh.md)
- [插件索引指南](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/docs/user/guide/plugin-market.zh.md)
- [索引生成器](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/apps/plugin-market-generator/README.zh.md)
- [本地技能发现](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/skill/skill-filesystem/README.zh.md)
