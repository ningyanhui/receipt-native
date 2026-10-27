# Receipt-Native

**Agent 的动作可以像包裹单一样核验** — 像 git 之于代码变更，每次 tool call 默认留下可转发、可离线校验的执行回执。

> **这不是 Gateway，也不是 coding agent，更不是又一个 OpenClaw。**  
> 产品是 **证据回执运行时（C1）**；**动作玻璃（C4）** 只是展示壳。  
> 消息通道 **只快递回执**（本仓仅草稿），不作控制面。  
> **任意 agent** 只要能导出 tool 事件，就能接入 — 见 [`docs/bring-your-agent.md`](docs/bring-your-agent.md)。

## 30 秒故事板

1. **主张**：「agent 动作可以像包裹单核验」  
2. **终端**：`npm run demo` 或 `adapter:replay` → **signed** receipt  
3. **玻璃**：`/glass/` 时间线  
4. **绿 / 红**：真单绿、`forge-demo` 假单红  
5. **快递**：`deliver:draft` 只写本地草稿（**不真发**）

分镜：[`docs/demo-script.md`](docs/demo-script.md) · 架构：[`docs/architecture.md`](docs/architecture.md)

## 适配器状态

| Adapter | 说明 | 状态 |
|---------|------|------|
| **Any agent (generic event log)** | Qoder / ZCode / WorkBuddy / 自定义… 最小 tool-event JSON/JSONL | ✅ **主路径** |
| demo-loop | 仓库内置演示 producer | ✅ |
| pi | 通用格式的示例映射 | ✅ fixture / live stub |
| cursor | 同上 | ✅ fixture / live stub |
| codex | 同上 | ✅ fixture / live stub |
| claude-code | 同上 | ✅ fixture / live stub |

详情：[`adapters/README.md`](adapters/README.md) · 三步接入：[`docs/bring-your-agent.md`](docs/bring-your-agent.md)

```bash
npm run adapter:replay -- --harness generic
npm run adapter:replay -- --harness generic --file /path/to/your-events.jsonl
```

## 快速开始

```bash
git clone https://github.com/ningyanhui/receipt-native.git
cd receipt-native
npm install
npm test
npm run keygen
npm run demo
npm run verify -- receipts/<最新一张>.json   # → green
```

| | 真单 | 假单 |
|--|------|------|
| 做法 | `npm run demo` | `npm run forge-demo` |
| CLI | `verify` → **green** | `verify` → **red** |

### 动作玻璃

```bash
npm run demo && npm run glass:bundle
python3 -m http.server 8765   # → http://127.0.0.1:8765/glass/
```

### 投递草稿（未真发）

```bash
npm run deliver:draft
# → delivery/outbox/draft-message.md
```

## 编码约定

| 字段 | 编码 |
|------|------|
| `publicKey` | 标准 **base64**，raw 32-byte Ed25519 |
| `signature` | 标准 **base64**，raw 64-byte Ed25519 |
| 签名消息 | UTF-8 of `canonicalize(receipt 去掉 signature)` |

统一入口：`emitReceipt({ toolName, args, result, producer, … })`（`src/producer/emit-receipt.js`）。

## 不做清单

1. 多通道 Gateway / 再造 OpenClaw  
2. 自研 coding agent loop /「拥有 loop 的平台」  
3. dataagent / 贴钱可谈签主线  
4. 完整 SIEM / 企业账号 SaaS  
5. 联邦身份 / agent 社交广场  
6. 默认真发 IM（只起草）  
7. 把某几个厂商做成唯一入口（**欢迎任意 agent via generic**）

见 [`CONTRIBUTING.md`](CONTRIBUTING.md) · [`SECURITY.md`](SECURITY.md) · [`LICENSE`](LICENSE) · [`docs/breaking-changes.md`](docs/breaking-changes.md)

## 布局

```
src/schema/       receipt 形状
src/crypto/       canonicalize、Ed25519、keys
src/producer/     emitReceipt + demo-loop
src/cli/          keygen / demo / verify / forge / glass / deliver / adapter-replay
adapters/generic/ 任意 agent（主适配器）
adapters/{pi,cursor,codex,claude-code}/  示例映射
fixtures/         golden + harness sample events + test-keys
glass/ verify/ delivery/ docs/ test/ .github/workflows/
```

## License

MIT
