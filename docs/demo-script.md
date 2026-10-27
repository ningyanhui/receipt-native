# Demo 录屏分镜 · 60–90 秒

**一句话主张：** Agent 的动作可以像包裹单一样核验 — 不是又一个 Claw / coding agent。

旁白总时长目标：**60–90 秒**。镜头全部本地；「丢进聊天」只用草稿示意，**不真发 IM**。

---

## 0:00–0:10 · 开场（主张）

| | |
|--|--|
| **画面** | 终端仓库根目录；或 README 标题一闪 |
| **旁白** | 「这不是 Gateway，也不是 coding agent。每次 tool call 默认留下一张可转发、可离线校验的回执 — 像包裹单。」 |
| **字幕** | Receipt-Native · 证据回执，不是 Claw |

---

## 0:10–0:25 · 终端 demo

| | |
|--|--|
| **画面** | `npm run keygen`（若需）→ `npm run demo`；滚动出现两行 signed receipt（write_file + mock_outbound），自检 GREEN |
| **旁白** | 「跑一小段 demo-loop：写文件、模拟外发 — 每一步落盘一张带 Ed25519 签名的回执。」 |
| **注意** | 不要演示真发网；`mock_outbound` 只写本地 outbox |

---

## 0:25–0:40 · 动作玻璃时间线

| | |
|--|--|
| **画面** | `npm run glass:bundle` → `python3 -m http.server 8765` → 浏览器 `http://127.0.0.1:8765/glass/`；时间线 ≥2 行带绿点 |
| **旁白** | 「动作玻璃是展示壳：同一 run 的动作排成时间线，一眼看到做过什么。」 |

---

## 0:40–0:55 · 点开绿

| | |
|--|--|
| **画面** | 点开一行 → 展开完整 receipt → 「送到 verify」或打开 `verify/verify.html` 粘贴真单 → **绿** |
| **旁白** | 「任意人拿到 JSON，离线也能验：签名对得上就是绿。」 |

---

## 0:55–1:10 · forge 红（对比）

| | |
|--|--|
| **画面** | 终端 `npm run forge-demo` → `npm run verify -- receipts/forged-….json` → **red**；或 verify 页粘假单 → **红** |
| **旁白** | 「改一个字段，立刻红。可转发、可对质 — 这就是和普通日志的差别。」 |

---

## 1:10–1:25 · 「假装」丢进聊天（草稿示意）

| | |
|--|--|
| **画面** | `npm run deliver:draft` → 打开 `delivery/outbox/draft-message.md`；可选再开 `draft-receipt.json`。可用**截图占位**：IM 输入框里贴上草稿文案（本地模拟图 / 涂掉真实会话），**不要**点发送、不要挂 bot。 |
| **旁白** | 「消息通道只快递回执。脚本只起草，真发由人手粘贴确认。」 |
| **字幕** | M4：草稿就绪 / 未真发 |

---

## 1:25–1:30 · 收束

| | |
|--|--|
| **画面** | 绿 / 红并排一帧；或回到主张字幕 |
| **旁白** | 「三十秒懂一件事：agent 动作可以像包裹单核验。不是又一个 OpenClaw。」 |

---

## 录制前检查清单

- [ ] `npm run demo` 产出 ≥2 张 signed（非 forged）
- [ ] `npm run glass:bundle` 后 glass 时间线可见
- [ ] 真单绿、`forge-demo` 红各录一次
- [ ] `npm run deliver:draft` 只写 `delivery/outbox/`，网络面板无聊天 API
- [ ] 片头/片尾点明：**不是 Gateway / 不是 coding agent**

## 不做（录屏里也不要出现）

- 自建多通道 Gateway、接真 Telegram Bot、推远程、接 Pi 当产品主叙事
