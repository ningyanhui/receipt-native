# adapters/codex — example mapping onto generic tool-events

OpenAI Codex CLI / agent tool events → [generic schema](../generic/README.md).

| Path | Status |
|------|--------|
| Fixture replay | ✅ `npm run adapter:replay -- --harness codex` |
| Live Codex hook | stub — dump tool events, then replay |

```bash
npm run adapter:replay -- --harness codex
```

If your Codex export is already generic (`toolName` / `args` / `result`), use `--harness generic` instead.
