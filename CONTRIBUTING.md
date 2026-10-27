# Contributing

Thanks for caring about **Receipt-Native** — agent actions as forwardable, offline-verifiable receipts.

## Hard product boundaries（不做清单）

PRs that expand into the following will be closed:

1. **多通道 Gateway / 再造 OpenClaw** — 消息通道最多作回执投递，不作产品本体  
2. **自研 coding agent loop / 通用对话壳** — 不把「又一个 agent」当交付物；demo-loop 仅用于打通 receipt 管线  
3. **dataagent / 贴钱可谈签 / 结果工单主线** — 已明确否决  
4. **完整 SIEM / 可观测 SaaS / 企业账号体系** — 禁止 otel/仪表盘主叙事  
5. **联邦身份、跨 Gateway 合约、agent 社交广场** — C5 延后，不进 MVP  
6. **26 harness 统一层** — 若碰桥，只服务演示用的那一个（优先 Pi）  
7. **以第一笔收入为两周成功标准的商业化叙事**

## 欢迎的方向

- 对齐 TRACE 子集的 receipt 字段与互操作
- 签名 / 离线 verify（绿/红）与伪造对比
- Pi（或其它单一 harness）producer 适配器
- 极薄动作玻璃：时间线 → 点开 receipt（展示壳，不是 IDE）

## 本地开发

```bash
npm run demo
```

不要推送密钥；不要对接真实 Telegram 发送（演示用 mock outbox）。

## 命名提醒

一句话主张优先用「包裹单 / agent 的 git / 可转发执行回执」，避免写成「又一个 otel」。
