# verify/ — 离线校验页（M2）

## 文件

| 文件 | 说明 |
|------|------|
| `verify-core.js` | 共享 Ed25519 验签核（glass 与本页共用，避免分叉） |
| `verify.html` | 粘贴 / deep-link 单张 receipt → 绿 / 红 |

## `verify.html`

1. 用浏览器打开（可 `file://`；与 glass 联用时建议同源静态服务）
2. 粘贴一张 receipt JSON，或带 `?r=<base64url(JSON)>` deep-link
3. **绿** = Ed25519 验签通过；**红** = 失败

算法与 Node CLI 相同：

- 签名消息 = `canonicalize(receipt without signature)`（UTF-8）
- `publicKey` / `signature`：标准 **base64**（pubkey raw 32 bytes，sig raw 64 bytes）
- 浏览器：Web Crypto `SubtleCrypto` + Ed25519（`verify-core.js`）

## CLI

```bash
npm run verify -- receipts/<file>.json   # prints green | red
npm run forge-demo                       # tamper toolName → red
```

## 绿 / 红演示

```bash
npm run keygen
npm run demo
# 打开最新 receipts/*.json，粘贴进 verify.html → 绿
npm run forge-demo
# 粘贴 receipts/forged-*.json → 红
```
