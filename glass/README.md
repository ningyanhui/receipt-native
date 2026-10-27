# glass/ — C4 动作玻璃（M3）

立项组合：**C1 证据回执为骨，C4 动作玻璃为皮**。

极薄展示壳：时间线列出 tool 名 / 参数摘要 / 结果摘要；点击一行展开完整 receipt + 内嵌绿/红验签；可「送到 verify 页」。

**不是**完整 IDE / Agents Window / 多通道 Control UI / Gateway。

## 生成数据

```bash
npm run keygen          # 若尚未有 keys/
npm run demo            # 写出 signed receipts
npm run glass:bundle    # 或 glass:data → glass/run.json（最近一组 signed，排除 forged-*）
```

`glass/run.json` 已 gitignore，每次 demo 后重新 bundle。

## 打开玻璃（务必用静态服务）

`file://` 下 `fetch('./run.json')` 与加载 `../verify/verify-core.js` 常失败。**从仓库根目录**起服务：

```bash
cd /path/to/receipt-native
python3 -m http.server 8765
# → http://127.0.0.1:8765/glass/
```

或：`npx --yes serve -p 8765 .` 然后打开 `/glass/`。

备选：页面上「选文件…」加载 `glass/run.json`，或「粘贴 run JSON」。

## 验签

与 `verify/verify.html` 共用 `verify/verify-core.js`（Web Crypto Ed25519，算法与 Node CLI 一致）。
