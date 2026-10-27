# Receipt-Native

**Agent 的动作可以像包裹单一样核验** — 像 git 之于代码变更，每次 tool call 默认留下可转发、可离线校验的执行回执。

> **这不是 Gateway，也不是 coding agent，更不是又一个 OpenClaw。**  
> 产品是 **证据回执运行时（C1）**；**动作玻璃（C4）** 只是展示壳。  
> 消息通道（Telegram 等）**只快递回执**，不作控制面。本仓库不自研 agent loop 当产品。

## 30 秒故事板（旁白要点）

1. **主张**：「agent 动作可以像包裹单核验」— 不是又一个 Claw。
2. **终端**：`npm run demo` → 每步一张 **signed** receipt。
3. **玻璃**：打开 `/glass/` 时间线，看见动作序列。
4. **绿**：真单进 `verify/` → 绿。
5. **红**：`forge-demo` 篡改 → 红（可转发对质）。
6. **快递**：`deliver:draft` 只写本地草稿；人手粘贴进 IM（**不真发**）。

完整 60–90 秒分镜见 [`docs/demo-script.md`](docs/demo-script.md)。

## 两周成功标准

- 旁观者 **30 秒**感到：「哦，原来 agent 的动作可以像包裹单一样核验」
- `verify` 页绿 / 红可转发
- 60–90 秒录屏 demo（文案与分镜已就绪；实拍可选）

当前进度：**M0–M5**（签名回执 + 离线绿/红 + 动作玻璃 + **投递草稿** + demo 叙事）。

## 快速开始（绿 / 红演示）

```bash
git clone https://github.com/ningyanhui/receipt-native.git
cd receipt-native
npm install                    # 安装依赖（当前无外部依赖，生成 lock 即可）
npm run keygen                 # 生成本地 Ed25519（keys/ 不入库）
npm run demo                   # 写出 signed receipts
npm run verify -- receipts/<最新一张>.json   # → green
```

浏览器：打开 `verify/verify.html`（可 `file://`），粘贴真 receipt → **绿**。

### 绿 / 红对比

| | 真单 | 假单 |
|--|------|------|
| 做法 | `npm run demo` 产出 | `npm run forge-demo` 篡改字段 |
| CLI | `npm run verify -- receipts/<真>.json` → **green** | `npm run verify -- receipts/forged-*.json` → **red** |
| 页 | `verify/verify.html` 粘贴 → **绿** | 粘贴 forged → **红** |

```bash
npm run forge-demo
npm run verify -- receipts/forged-*.json     # → red
```

成功时：

1. `demo-sandbox/hello.txt` 被写入
2. `demo-sandbox/outbox/*.json` 有一张**本地**模拟外发单（不真发网）
3. `receipts/` 下至少 2 张 **signed** receipt（`write_file` + `mock_outbound`）
4. `npm run glass:bundle` 后打开动作玻璃，时间线 ≥2 行且真单为绿

### 动作玻璃（M3）

```bash
npm run demo
npm run glass:bundle    # → glass/run.json（最近一组 signed，排除 forged-*）
python3 -m http.server 8765
# → http://127.0.0.1:8765/glass/
```

### 投递草稿（M4 · 未真发）

```bash
npm run deliver:draft
# → delivery/outbox/draft-message.md   （可复制到 IM）
# → delivery/outbox/draft-receipt.json （附件候选）
```

**绝不**调用 Telegram API / 聊天 HTTP。步骤与文案模板见 [`delivery/README.md`](delivery/README.md)。

### 编码约定

| 字段 | 编码 |
|------|------|
| `publicKey` | 标准 **base64**，raw 32-byte Ed25519 公钥 |
| `signature` | 标准 **base64**，raw 64-byte Ed25519 签名 |
| 签名消息 | UTF-8 of `canonicalize(receipt 去掉 signature)`（与 digest 同一套 canonicalize） |

宿主策略：优先接 **Pi**（见 `adapters/pi/`，**文档预留，MVP 未接**）；本机若无 `pi` CLI，用最小 **demo-loop** 演示 receipt 管线，**不假装已接上真实 Pi**。

## 里程碑

| 阶段 | 内容 | 状态 |
|------|------|------|
| M0 | 仓库骨架、不做清单、目录 | ✅ |
| M1 | 每 tool call 落盘 unsigned receipt | ✅ demo-loop |
| M2 | Ed25519 签名 + `verify/` 绿/红 | ✅ |
| M3 | `glass/` 动作玻璃展示壳 | ✅ |
| M4 | 消息通道仅投递回执 | ✅ **草稿就绪 / 未真发** |
| M5 | README + 60–90s demo 叙事 | ✅ 分镜见 `docs/demo-script.md` |

## 不做清单

1. **不做**多通道 Gateway / 再造 OpenClaw  
2. **不做**自研 coding agent loop / 通用对话壳  
3. **不做** dataagent / 贴钱可谈签 / 结果工单主线  
4. **不做**完整 SIEM / 可观测 SaaS / 企业账号体系  
5. **不做**联邦身份、跨 Gateway 合约、agent 社交广场  
6. **不做** 26 harness 统一层；若碰桥，只服务演示用的那一个（优先 Pi）  
7. **不做**以第一笔收入为两周成功标准的商业化叙事  
8. **不做**脚本真发 IM / 自建聊天 Gateway（M4 只起草）

详见 `CONTRIBUTING.md`。

## 主张与边界

| 是 | 不是 |
|----|------|
| 证据回执运行时（C1） | OpenClaw 类消息 Gateway |
| C4 动作玻璃作展示壳 | 又一个 coding agent / IDE |
| 消息 = 投递面（草稿） | otel / SIEM 主叙事 |
| TRACE 子集字段意图 | 完整供应链信任平台 |
| 可转发绿/红对质 | 「再做一个 Claw」 |

## 布局

```
src/schema/     receipt 形状
src/crypto/     canonicalize、Ed25519 sign/verify、keys
src/producer/   demo-loop（signed）
src/cli/        keygen / demo / verify / forge / glass / deliver-draft
adapters/pi/    预留 Pi 接入说明（未实现）
glass/          动作玻璃（index + app.js；run.json 由 bundle 生成）
verify/         verify.html + verify-core.js 离线绿/红
delivery/       M4 投递说明 + outbox 草稿（不真发）
docs/           demo-script 等叙事
keys/           本地密钥（gitignore）
receipts/       落盘回执
demo-sandbox/   本地演示沙箱
```

## License

MIT
