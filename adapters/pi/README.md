# adapters/pi — 预留（尚未实现）

本目录预留 **Pi** 作为 receipt producer 的挂接点。  
**本轮 MVP 未接入真实 Pi**；管线由 `src/producer/demo-loop.js` 打通。

## 为何优先 Pi

立项默认宿主是 Pi：不自建 coding agent loop，只在已有 harness 的 tool call 边界写回执。

本机当前可能 **没有 `pi` CLI**。策略：

1. M1：用最小 demo tool-loop 演示 unsigned receipt  
2. 之后：在本目录实现 Pi RPC/SDK 钩子，把 `producer` 字段从 `"demo-loop"` 换成 `"pi"`

## 可引用的包名（调研时点 · 2026-10）

Pi 已迁至 Earendil Works（旧 `@mariozechner/*` 弃用指向新 scope）：

| 用途 | 包名 | 备注 |
|------|------|------|
| CLI / coding agent | `@earendil-works/pi-coding-agent` | `npm i -g --ignore-scripts @earendil-works/pi-coding-agent`；CLI 仍为 `pi` |
| Agent SDK / runtime | `@earendil-works/pi-agent-core` | tool calling + state；约 v1.4.0 |
| 统一 LLM API | `@earendil-works/pi-ai` | 常与 agent-core 同用 |
| 旧 scope（勿新依赖） | `@mariozechner/pi-coding-agent` 等 | 弃用；另有历史包 `@mariozechner/pi-agent`（0.9.x）勿与新 scope 混淆 |

- 仓库：https://github.com/earendil-works/pi  
- 站点：https://pi.dev  

## 设想接入方式（高层，未实现）

1. **事件订阅**：在 Pi agent 的 tool 执行前后（或 `toolResult` 事件）截获 `toolName`、args、result。  
2. **写回执**：对 args/result 做与本仓库相同的 canonical + sha256；填 `producer: "pi"`、`modelId` 取自 Pi 当前模型。  
3. **RPC / 无头**：用 Pi 的 RPC 或 print/JSON 模式跑固定 demo 任务，避免交互 TUI。  
4. **不拥有 loop**：适配器只观察/包装 tool 边界，不在本仓库再实现一套 agent 推理循环当产品。

示例伪代码（**不是可运行代码**）：

```js
// future: adapters/pi/hook.js
agent.subscribe((ev) => {
  if (ev.type === 'tool_end') {
    writeUnsignedReceipt({
      producer: 'pi',
      toolName: ev.toolName,
      argsDigest: digest(ev.args),
      resultDigest: digest(ev.result),
      modelId: ev.modelId,
    });
  }
});
```

## 本轮明确不做

- 不 `npm install` Pi 进本仓库主依赖（避免拖慢 M1）  
- 不假装 CLI 已可用  
- 不把 Pi 封装成又一个多通道 Gateway
