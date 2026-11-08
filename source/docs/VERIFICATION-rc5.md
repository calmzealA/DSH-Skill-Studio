# DSH 0.2.1-rc.5 兼容性复核

2026-11-05，Linux，Node.js `24.22.1`。使用独立目录实际安装的 DSH `0.2.1-rc.5`，对应 Cordis `4.0.5`、Loader `1.0.6`；同时在工程开发依赖 DSH `0.2.2-rc.1` 上复核。

| 检查 | 结果 |
| --- | --- |
| 实际 AgentPresetRegistry 的 `acquireScope`、`inspectCompositions` | 通过；租约保留已撤回的预设版本，异步释放后移除，重复释放安全 |
| 实际 Session、Projection、WorkingDirectory | 通过；已提交的工作目录覆盖创建时目录，创建元数据不变 |
| 冷会话在创建后切换预设 | 通过；读取最后提交的 `minimal`，不会误用创建时或部署默认的 `standard` |
| 实际 Loader 的 `entries()`、`fiber.restart()` | 通过；目标实例重新挂载，启用状态和配置不变 |
| rc.5 实际 ui-skill / InputTriggerService 与真实文件系统 provider 集成 | 临时隔离安装中 5 项通过，覆盖旧会话缓存刷新、策略生效等待、停用后的同名回退，以及无文件系统 provider 的预设 |

rc.5 尚无 `agentPresets.presetForSession()`。插件只在该方法不存在时，使用 rc.5 的公开 `sessionProjections.stateOf(session, 'agentPreset')` 读取已提交状态。rc.1 优先使用专用读取方法，避免调用旧接口。因此保留 rc.5 兼容下限。

源码包附带 `scripts/check-runtime-contract.mjs`。它实际加载指定 DSH 安装中的上述服务；相邻 Agent、文件执行和提示组装能力使用最小占位，因为检查过程只读取状态，不创建 Agent 或运行会话回合。该脚本不替代完整浏览器验收或 Windows / macOS 真机测试。

在源码目录执行，默认检查工程开发依赖：

```sh
npm ci
node scripts/check-runtime-contract.mjs
```

独立安装并复查 rc.5：

```sh
DSH_RC5_TEST_DIR="$(mktemp -d)"
npm install --prefix "$DSH_RC5_TEST_DIR" --ignore-scripts --no-audit --no-fund @deepseek-ai/dsh@0.2.1-rc.5
node scripts/check-runtime-contract.mjs --runtime-package "$DSH_RC5_TEST_DIR/node_modules/@deepseek-ai/dsh/package.json"
```

也可将 `--runtime-package` 指向现有 DSH 安装的绝对 `package.json` 路径。成功时输出一行版本及通过结果；失败退出码为 `1`。检查自身创建的临时状态会自动清理，指定的 DSH 安装不受修改。
