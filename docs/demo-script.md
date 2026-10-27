# Demo 录屏分镜 · 60–90 秒

**一句话主张：** Agent 的动作可以像包裹单一样核验 — 证据回执运行时（C1），不是 coding agent。

旁白总时长目标：**60–90 秒**。镜头全部本地；「丢进聊天」只用草稿示意，**不真发 IM**。

> **本文件是可复现命令剧本。** Cursor 实测与视频生成由协调方负责；仓库内参考成片见 [`demo-video/receipt-native-demo.mp4`](../demo-video/receipt-native-demo.mp4)（约 88s，请勿本地擅自改片）。

片头可对照 README [「30 秒故事板」](../README.md#30-秒故事板) 五步 + 一键命令：

```bash
npm run demo:storyboard
```

---

## 录制前检查清单（与 `demo:storyboard` 对齐）

一键自检（推荐，失败非 0）：

```bash
npm test
npm run demo:storyboard
```

勾选：

- [ ] `npm run keygen`（若尚无 `keys/ed25519-*.pem`）
- [ ] `npm run demo` 产出 ≥2 张 signed（非 forged）
- [ ] 最新真单 `npm run verify -- receipts/<最新>.json` → **green**
- [ ] `npm run forge-demo` 后 `verify` 假单 → **red**
- [ ] `npm run glass:bundle` 后时间线可见
- [ ] `python3 -m http.server 8765` → `http://127.0.0.1:8765/glass/` 与 `/verify/verify.html`
- [ ] `npm run deliver:draft` 只写 `delivery/outbox/`，网络面板无聊天 API
- [ ] `npm run adapter:replay -- --harness generic`（任意 agent 路径）成功
- [ ] 片头/片尾点明：**不是 Gateway / 不是 coding agent**

---

## 0:00–0:10 · 开场（主张）

| | |
|--|--|
| **画面** | 终端仓库根目录；或 README 标题 / 30 秒故事板一闪 |
| **旁白** | 「这不是 Gateway，也不是 coding agent。每次 tool call 默认留下一张可转发、可离线校验的回执 — 像包裹单。」 |
| **字幕** | Receipt-Native · 证据回执运行时（C1） |
| **命令（可选预跑）** | `npm run demo:storyboard` 已在录屏前跑绿 |

---

## 0:10–0:25 · 终端 demo

| | |
|--|--|
| **画面** | `npm run keygen`（若需）→ `npm run demo`；滚动出现两行 signed receipt（write_file + mock_outbound），自检 GREEN |
| **旁白** | 「跑一小段 demo-loop：写文件、模拟外发 — 每一步落盘一张带 Ed25519 签名的回执。」 |
| **注意** | 不要演示真发网；`mock_outbound` 只写本地 outbox |
| **命令** | `npm run keygen` · `npm run demo` · `npm run verify -- receipts/<最新真单>.json` |

---

## 0:25–0:40 · 动作玻璃时间线

| | |
|--|--|
| **画面** | `npm run glass:bundle` → `python3 -m http.server 8765` → 浏览器 `http://127.0.0.1:8765/glass/`；时间线 ≥2 行带绿点 |
| **旁白** | 「动作玻璃是展示壳：同一 run 的动作排成时间线，一眼看到做过什么。」 |
| **命令** | `npm run glass:bundle` · `python3 -m http.server 8765` |

---

## 0:40–0:55 · 点开绿

| | |
|--|--|
| **画面** | 点开一行 → 展开完整 receipt → 「送到 verify」或打开 `http://127.0.0.1:8765/verify/verify.html` 粘贴真单 → **绿** |
| **旁白** | 「任意人拿到 JSON，离线也能验：签名对得上就是绿。」 |
| **命令** | `npm run verify -- receipts/<真单>.json` → green |

---

## 0:55–1:10 · forge 红（对比）

| | |
|--|--|
| **画面** | 终端 `npm run forge-demo`（别名 `npm run forge`）→ `npm run verify -- receipts/forged-….json` → **red**；或 verify 页粘假单 → **红** |
| **旁白** | 「改一个字段，立刻红。可转发、可对质 — 这就是和普通日志的差别。」 |
| **命令** | `npm run forge-demo` · `npm run verify -- receipts/forged-<…>.json` |

---

## 1:10–1:20 · 任意 agent 路径（generic）

| | |
|--|--|
| **画面** | 终端一行：`npm run adapter:replay -- --harness generic`；可选闪过 `docs/bring-your-agent.md` |
| **旁白** | 「不绑死某家产品。Qoder、ZCode、WorkBuddy，或你自己的 agent — 导出标准 tool 事件就能签回执。」 |
| **字幕** | Any agent · generic event log |
| **命令** | `npm run adapter:replay -- --harness generic` |
| **脚注** | 自定义文件：`npm run adapter:replay -- --harness generic --file /path/to/events.jsonl` — 与具名 harness 示例同管线 |

---

## 1:20–1:30 · 「假装」丢进聊天（草稿示意）+ 收束

| | |
|--|--|
| **画面** | `npm run deliver:draft` → 打开 `delivery/outbox/draft-message.md`；可用**截图占位** IM 输入框（**不要**点发送）。收束：绿/红并排或主张字幕 |
| **旁白** | 「消息通道只快递回执。脚本只起草。三十秒懂一件事：agent 动作可以像包裹单核验 — 证据回执运行时（C1），玻璃展示壳（C4）。」 |
| **字幕** | M4：草稿就绪 / 未真发 |
| **命令** | `npm run deliver:draft` |

---

## 命令速查（与 tip / `package.json` 一致）

| 步骤 | 命令 |
|------|------|
| 一键故事板 | `npm run demo:storyboard` |
| 密钥 | `npm run keygen` |
| Demo | `npm run demo` |
| 校验 | `npm run verify -- <path.json>` |
| 伪造 | `npm run forge-demo`（=`npm run forge`） |
| 玻璃数据 | `npm run glass:bundle` |
| 静态站 | `python3 -m http.server 8765` |
| 投递草稿 | `npm run deliver:draft` |
| 任意 agent | `npm run adapter:replay -- --harness generic` |

---

## 不做（录屏里也不要出现）

- 自建多通道 Gateway、接真 Telegram Bot、默认真发 IM
- 把 Pi / Cursor 等说成唯一入口（应强调 **generic-first**）
- 宣称本仓已完成 Cursor live E2E（协调方实测，非本剧本范围）
