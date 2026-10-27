# verify/ — 离线校验页（M2）

## `verify.html`

1. 用浏览器打开（可 `file://`，无需服务器）
2. 粘贴一张 receipt JSON
3. **绿** = Ed25519 验签通过；**红** = 失败

算法与 Node CLI 相同：

- 签名消息 = `canonicalize(receipt without signature)`（UTF-8）
- `publicKey` / `signature`：标准 **base64**（pubkey raw 32 bytes，sig raw 64 bytes）
- 浏览器：Web Crypto `SubtleCrypto` + Ed25519

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
