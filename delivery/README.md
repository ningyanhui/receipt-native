# Delivery · 消息只作快递

**Telegram（或任意 IM）在这里只是快递柜，不是 Gateway。**

Receipt-Native 的产品面是：每次 agent tool call → 一张可转发、可离线核验的 signed receipt。  
聊天通道只负责把「回执 + 如何打开 glass/verify」送到人眼前；**不**当控制面、**不**路由工具、**不**代替宿主（Pi / demo-loop）。

本目录的 CLI **只起草、不真发**。敏感动作（真发 IM、挂 bot token、打聊天 HTTP）一律人工确认后由人手粘贴。

## 人工粘贴步骤（推荐）

1. 本地已有 signed receipt：
   ```bash
   npm run keygen && npm run demo
   npm run glass:bundle   # 可选，便于文案里提时间线
   ```
2. 起草投递稿（只写本地文件）：
   ```bash
   npm run deliver:draft
   ```
3. 打开 `delivery/outbox/draft-message.md`，复制「中文」或「English」段。
4. 在 Telegram / Slack / 任意 IM **手动粘贴**正文；若支持附件，附上 `delivery/outbox/draft-receipt.json`。
5. 收件人侧：打开仓库 `verify/verify.html`（或本地静态页）粘贴 JSON → 期望 **绿**；或打开 `glass/` 看时间线。

**禁止本仓库脚本：** 调用 Telegram Bot API、Webhook、任意聊天服务 HTTP、自动 `sendMessage`。

## 推荐消息文案模板

### 中文（短）

```
这是一张可核验的 agent 动作回执（Receipt-Native）。

把附件 draft-receipt.json 粘进 verify/verify.html → 应为绿。
动作时间线：仓库根目录起静态服务后打开 /glass/。

说明：聊天只快递回执，不是 Gateway；此消息为本地草稿，未自动发出。
```

### English (short)

```
This is a verifiable agent action receipt (Receipt-Native).

Paste the attached draft-receipt.json into verify/verify.html → expect green.
Timeline: serve the repo root statically, then open /glass/.

Note: chat is delivery only — not a Gateway. Local draft; not auto-sent.
```

`npm run deliver:draft` 会按**最近一张 signed receipt**（及可选 `glass/run.json` 摘要）填好更具体的版本到 `draft-message.md`。

## 产出路径

| 文件 | 用途 |
|------|------|
| `delivery/outbox/draft-message.md` | 可复制到 IM 的正文（中英） |
| `delivery/outbox/draft-receipt.json` | 附件候选（最近一张 signed receipt 副本） |

`outbox/` 内容默认不入库（见该目录 `.gitignore`）。

## 里程碑状态

**M4：草稿就绪 / 未真发** ✅（起草 CLI + 本文档；无 Telegram API）
