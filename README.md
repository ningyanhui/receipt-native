# Receipt-Native

**Agent 的动作可以像包裹单一样核验** — 像 git 之于代码变更，每次 tool call 默认留下可转发、可离线校验的执行回执。

> **这不是 Gateway，也不是 coding agent。**  
> 消息通道只负责投递回执；本仓库不自研 agent loop 当产品，不接多通道控制面。

## 两周成功标准

- 旁观者 **30 秒**感到：「哦，原来 agent 的动作可以像包裹单一样核验」
- `verify` 页绿 / 红可转发（M2 ✅）
- 60–90 秒录屏 demo

当前进度：**M0–M3**（签名回执 + 离线绿/红 + 动作玻璃）。

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

伪造对比（真单绿、假单红）：

```bash
npm run forge-demo             # 篡改 toolName，写出 receipts/forged-*.json
npm run verify -- receipts/forged-*.json     # → red
# 再把 forged JSON 粘进 verify.html → 红
```

成功时：

1. `demo-sandbox/hello.txt` 被写入
2. `demo-sandbox/outbox/*.json` 有一张**本地**模拟外发单（不真发网）
3. `receipts/` 下至少 2 张 **signed** receipt（`write_file` + `mock_outbound`，含 `signature` + `publicKey`）
4. `npm run glass:bundle` 后打开动作玻璃，时间线 ≥2 行且真单为绿

### 动作玻璃（M3）

```bash
npm run demo
npm run glass:bundle    # 同 glass:data → glass/run.json（最近一组 signed，排除 forged-*）
# 从仓库根目录起静态服务（file:// 下 fetch 常失败）：
python3 -m http.server 8765
# 浏览器打开 http://127.0.0.1:8765/glass/
```

时间线按 timestamp 排序；每行 toolName / argsPreview / resultPreview + 绿/红验签；点击展开完整 receipt，可「送到 verify 页」。验签与 `verify/verify.html` 共用 `verify/verify-core.js`。

### 编码约定

| 字段 | 编码 |
|------|------|
| `publicKey` | 标准 **base64**，raw 32-byte Ed25519 公钥 |
| `signature` | 标准 **base64**，raw 64-byte Ed25519 签名 |
| 签名消息 | UTF-8 of `canonicalize(receipt 去掉 signature)`（与 digest 同一套 canonicalize） |

宿主策略：优先接 **Pi**（见 `adapters/pi/`）；本机若无 `pi` CLI，MVP 用最小 **demo-loop** 演示 receipt 管线，**不假装已接上真实 Pi**。

## 里程碑

| 阶段 | 内容 | 状态 |
|------|------|------|
| M0 | 仓库骨架、不做清单、目录 | ✅ |
| M1 | 每 tool call 落盘 unsigned receipt | ✅ demo-loop |
| M2 | Ed25519 签名 + `verify/` 绿/红 | ✅ |
| M3 | `glass/` 动作玻璃展示壳 | ✅ |
| M4 | 消息通道仅投递回执（可选） | 未做 |

## 不做清单

1. **不做**多通道 Gateway / 再造 OpenClaw  
2. **不做**自研 coding agent loop / 通用对话壳  
3. **不做** dataagent / 贴钱可谈签 / 结果工单主线  
4. **不做**完整 SIEM / 可观测 SaaS / 企业账号体系  
5. **不做**联邦身份、跨 Gateway 合约、agent 社交广场  
6. **不做** 26 harness 统一层；若碰桥，只服务演示用的那一个（优先 Pi）  
7. **不做**以第一笔收入为两周成功标准的商业化叙事  

详见 `CONTRIBUTING.md`。

## 主张与边界

| 是 | 不是 |
|----|------|
| 证据回执运行时（C1） | OpenClaw 类消息 Gateway |
| C4 动作玻璃作展示壳 | 又一个 coding agent / IDE |
| 消息 = 投递面 | otel / SIEM 主叙事 |
| TRACE 子集字段意图 | 完整供应链信任平台 |

## 布局

```
src/schema/     receipt 形状
src/crypto/     canonicalize、Ed25519 sign/verify、keys
src/producer/   demo-loop（signed）
src/cli/        keygen / demo / verify / forge-demo
adapters/pi/    预留 Pi 接入说明（未实现）
glass/          M3 动作玻璃（index + app.js；run.json 由 bundle 生成）
verify/         verify.html + verify-core.js 离线绿/红
keys/           本地密钥（gitignore；仅 .gitkeep + README）
receipts/       落盘回执
demo-sandbox/   本地演示沙箱
```

## License

MIT
