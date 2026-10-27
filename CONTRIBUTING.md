# Contributing

Thanks for caring about **Receipt-Native** — agent actions as forwardable, offline-verifiable receipts.

## Hard product boundaries（不做清单）

PRs that expand into the following will be closed:

1. **多通道 Gateway / 成为任意 agent 的控制中心** — 消息通道最多作回执投递，不作产品本体  
2. **自研 coding agent loop / 通用对话壳 /「拥有 loop 的平台」** — demo-loop 仅打通 receipt 管线；本仓库不托管多 harness 运行时  
3. **dataagent / 贴钱可谈签 / 结果工单主线** — 已明确否决  
4. **完整 SIEM / 可观测 SaaS / 企业账号体系** — 禁止 otel/仪表盘主叙事  
5. **联邦身份、跨 Gateway 合约、agent 社交广场** — C5 延后，不进 MVP  
6. **以第一笔收入为两周成功标准的商业化叙事**  
7. **脚本默认真发 IM** — delivery 只起草，真发需另确认

## 欢迎的方向

- 对齐 TRACE 子集的 receipt 字段与互操作  
- 签名 / 离线 verify（绿/红）与伪造对比  
- **多适配器**：任何能导出 [generic tool-event](adapters/generic/README.md) 的 agent（Qoder、ZCode、WorkBuddy、Pi、Cursor、…）  
- 极薄动作玻璃：时间线 → 点开 receipt（展示壳，不是 IDE）  
- 测试、CI、文档、fixture 质量

### 适配器贡献指南

1. **优先 generic**：能映射到最小 tool-event schema 就不要新造 receipt 形状。  
2. 新目录 `adapters/<name>/`：`README.md`（诚实写清 fixture ✅ vs live stub）+ 可选 `map-event.js`。  
3. `fixtures/<name>/sample-tool-events.json` + 可用 `npm run adapter:replay -- --harness <name>`（或 `--harness generic --file …`）。  
4. **禁止**在适配器里实现完整 agent loop、多通道路由、或把本仓变成 Gateway。  
5. 不要把厂商 SDK 加进默认 `dependencies`；可选 peer / 文档安装即可。

## 本地开发

```bash
npm test
npm run keygen
npm run demo
npm run verify -- receipts/<file>.json
npm run forge-demo
npm run adapter:replay -- --harness generic
npm run adapter:replay -- --harness pi
npm run adapter:replay -- --harness cursor
npm run adapter:replay -- --harness codex
npm run adapter:replay -- --harness claude-code
```

不要推送密钥；不要对接真实 Telegram 发送（演示用 mock outbox / deliver draft）。

## 命名提醒

一句话主张优先用「包裹单 / agent 的 git / 可转发执行回执」，避免写成「又一个 otel」或「多通道 Gateway」。
