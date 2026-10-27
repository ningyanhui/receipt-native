# adapters/codex — example mapping onto generic tool-events

OpenAI Codex CLI / agent tool events → [generic schema](../generic/README.md).

| Path | Status |
|------|--------|
| Fixture replay | ✅ `npm run adapter:replay -- --harness codex` |
| Live via JSONL watch | ✅ `npm run adapter:watch -- --file events.jsonl --harness codex` |

> No official Codex SDK hook is included. Append tool events to a JSONL file from your
> Codex wrapper, then watch or replay (bring-your-own append).

## Fixture

```bash
npm run adapter:replay -- --harness codex
```

## Live — JSONL watch path

```bash
# Terminal 1 — start watch
npm run keygen          # once
npm run adapter:watch -- --file /tmp/codex-events.jsonl --harness codex

# Codex-side wrapper — append one line per tool completion:
echo '{"toolName":"shell","args":{"command":"ls"},"result":{"exitCode":0}}' \
  >> /tmp/codex-events.jsonl
```

If your Codex export is already generic (`toolName` / `args` / `result`), use `--harness generic` instead — no mapper applied.
