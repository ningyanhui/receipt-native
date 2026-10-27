# Receipt-Native

**给 AI Agent 每一次 tool call 签发可离线核验的回执**  
*Signed execution receipts for every AI agent action*

[![CI](https://github.com/ningyanhui/receipt-native/actions/workflows/ci.yml/badge.svg)](https://github.com/ningyanhui/receipt-native/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/receipt-native)](https://www.npmjs.com/package/receipt-native)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node ≥20](https://img.shields.io/badge/node-%E2%89%A520-brightgreen)](package.json)

---

## 这是什么

你的 AI agent 每天执行几十上百次 `write_file`、`run_command`、`web_search`……  
**你能事后证明它执行了什么、结果是什么吗？**

Receipt-Native 在每一次 tool call 发生时，用 **Ed25519 私钥签名**，生成一份执行回执（JSON 文件）。  
任何人随时在**完全离线**的环境下都能核验：这份回执是真的？还是伪造的？

就像 git 让代码变更有据可查，Receipt-Native 让 **agent 的每一个动作有据可查**。

### 适合谁

- **开发者**：想留存 AI agent（Cursor、Claude Code、Codex 等）工具调用的可信记录，便于事后审计和复盘
- **团队**：需要对 agent 产出保留签名证明，满足内部合规或复盘需求
- **工具开发者**：为自定义 agent 附加「有签名、可验真伪」的执行日志

### 这不是什么

- **不是 agent 控制面 / Gateway** — 不介入 agent 的决策与执行流程，不做消息路由
- **不是 coding agent** — 不自己写代码、不拥有 agent loop
- **不是 SIEM / 企业 SaaS** — 无云端账号体系，本地运行
- **消息投递目前只写本地草稿** — `deliver:draft` 仅生成本地 JSON，不真发 IM；  
  实时签发路径通过 **JSONL watch** 实现（`npm run adapter:watch`）

### 快速安装

```bash
npm i receipt-native          # npm 已发布 v0.1.1

# 或克隆源码完整体验
git clone https://github.com/ningyanhui/receipt-native.git
cd receipt-native && npm install
```

完整接入指南 → [`docs/bring-your-agent.md`](docs/bring-your-agent.md)

---

## 60 秒亲眼看绿 / 红

```bash
# 克隆 + 安装
git clone https://github.com/ningyanhui/receipt-native.git
cd receipt-native
npm install

# 一键走完全链路：keygen → demo → verify绿 → forge → verify红 → glass → deliver草稿 → adapter replay
npm run demo:storyboard
```

脚本结束后：

```bash
python3 -m http.server 8765
# 动作玻璃  → http://127.0.0.1:8765/glass/
# 离线校验  → http://127.0.0.1:8765/verify/verify.html
```

**绿 / 红快速对照：**

| | 真单 | 伪造单 |
|--|------|--------|
| 命令 | `npm run demo` | `npm run forge-demo` |
| `verify` | → **green** ✅ | → **red** ❌ |

演示分镜：[`docs/demo-script.md`](docs/demo-script.md) · 成片 (~68s)：[`demo-video/receipt-native-demo.mp4`](demo-video/receipt-native-demo.mp4) · 渲染流程：[`demo-video/PIPELINE.md`](demo-video/PIPELINE.md)

---

## 接入任意 Agent（3步）

不需要第一方适配器；用 **generic** 工具事件格式即可。

```bash
# 1. 为每个 tool call 写一行 JSON，保存为 .jsonl
# { "toolName": "write_file", "args": {…}, "result": {…}, "timestamp": "…", "modelId": "…" }

# 2. 生成签名回执
npm run keygen    # 一次性；生成 keys/（私钥不要提交）
npm run adapter:replay -- --harness generic --file /path/to/events.jsonl

# 3. 离线校验
npm run verify -- receipts/<最新>.json   # → green / red
```

完整说明：[`docs/bring-your-agent.md`](docs/bring-your-agent.md)

---

## 适配器状态

| Adapter | 说明 | 状态 |
|---------|------|------|
| **generic**（任意 agent）| Qoder / ZCode / WorkBuddy / 自定义… 最小 tool-event JSON/JSONL | ✅ **主路径（含 live watch）** |
| demo-loop | 仓库内置演示 producer | ✅ |
| pi | 通用格式的示例映射 | ✅ fixture / live via JSONL watch |
| cursor | 同上 | ✅ fixture / live via JSONL watch |
| codex | 同上 | ✅ fixture / live via JSONL watch |
| claude-code | 同上 | ✅ fixture / live via JSONL watch |

> **live via JSONL watch** = `npm run adapter:watch -- --file events.jsonl [--harness <name>]`  
> 向文件 append 一行 tool-event，自动签名出证回执，无需官方 SDK 钩子。  
> 各适配器详情：[`adapters/README.md`](adapters/README.md)

---

## 不做清单

1. 多通道 Gateway / 成为任意 agent 的控制中心
2. 自研 coding agent loop /「拥有 loop 的平台」
3. dataagent / 贴钱可谈签主线
4. 完整 SIEM / 企业账号 SaaS
5. 联邦身份 / agent 社交广场
6. 默认真发 IM（`deliver:draft` **只写本地草稿**）
7. 把某几个厂商做成唯一入口（**欢迎任意 agent via generic**）

---

## 编码约定

| 字段 | 编码 |
|------|------|
| `publicKey` | 标准 base64，raw 32-byte Ed25519 |
| `signature` | 标准 base64，raw 64-byte Ed25519 |
| 签名消息 | UTF-8 of `canonicalize(receipt 去掉 signature)` |

统一入口：`emitReceipt({ toolName, args, result, producer, … })`（`src/producer/emit-receipt.js`）

---

## 项目布局

```
src/schema/       receipt 形状
src/crypto/       canonicalize、Ed25519、keys
src/producer/     emitReceipt + demo-loop
src/cli/          keygen / demo / verify / forge / glass / deliver / adapter-replay
adapters/generic/ 任意 agent（主适配器）
adapters/{pi,cursor,codex,claude-code}/  示例映射
fixtures/         golden + harness sample events + test-keys
glass/            C4 动作玻璃（浏览器）
verify/           离线校验页面
delivery/         IM 草稿投递
demo-video/       HyperFrames 成片 + PIPELINE
docs/             架构、接入指南、分镜脚本
.github/workflows/  CI（unit + verify绿/红 + adapter replay）
```

架构：[`docs/architecture.md`](docs/architecture.md) · 发布自检：[`docs/release-checklist.md`](docs/release-checklist.md)

---

[`CONTRIBUTING.md`](CONTRIBUTING.md) · [`SECURITY.md`](SECURITY.md) · [`LICENSE`](LICENSE) · [`docs/breaking-changes.md`](docs/breaking-changes.md)

MIT © Receipt-Native contributors
