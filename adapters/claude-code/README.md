# adapters/claude-code — example mapping onto generic tool-events

Claude Code tool-use / hook logs → [generic schema](../generic/README.md).

| Path | Status |
|------|--------|
| Fixture replay | ✅ `npm run adapter:replay -- --harness claude-code` |
| Live hooks | stub — log tool_use + tool_result, then replay |

```bash
npm run adapter:replay -- --harness claude-code
```

Prefer emitting generic events from your hook when possible.
