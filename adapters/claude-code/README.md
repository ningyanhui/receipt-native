# adapters/claude-code — example mapping onto generic tool-events

Claude Code tool-use / hook logs → [generic schema](../generic/README.md).

| Path | Status |
|------|--------|
| Fixture replay | ✅ `npm run adapter:replay -- --harness claude-code` |
| Live via JSONL watch | ✅ `npm run adapter:watch -- --file events.jsonl --harness claude-code` |

> No official Claude Code SDK hook is included. Append tool events to a JSONL file from
> your Claude Code hook, then watch or replay (bring-your-own append).

## Fixture

```bash
npm run adapter:replay -- --harness claude-code
```

## Live — JSONL watch path

```bash
# Terminal 1 — start watch
npm run keygen          # once
npm run adapter:watch -- --file /tmp/cc-events.jsonl --harness claude-code

# Claude Code hook — append one line per tool_use + tool_result pair:
echo '{"type":"tool_use","name":"Bash","input":{"command":"npm test"},"output":{"exitCode":0}}' \
  >> /tmp/cc-events.jsonl
```

Prefer emitting in the **generic** shape when possible (`toolName` / `args` / `result`) — the mapper is skipped entirely:

```bash
npm run adapter:watch -- --file /tmp/cc-events.jsonl
```
