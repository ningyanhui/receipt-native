# adapters/cursor — example mapping onto generic tool-events

Maps Cursor / Cloud Agent–style `tool_call` records into the [generic schema](../generic/README.md).

| Path | Status |
|------|--------|
| Fixture replay | ✅ `npm run adapter:replay -- --harness cursor` |
| Live Cursor hook | stub — export tool trajectory JSON, then replay |

## Fixture

```bash
npm run adapter:replay -- --harness cursor
```

## Live (stub)

1. From agent transcripts / debug export, collect each tool invocation as `{ tool_call: { name, arguments }, result }`.  
2. Save as JSON array or JSONL.  
3. Replay with `--harness cursor` (uses `map-event.js`) **or** reshape to generic and use `--harness generic`.

Prefer exporting **generic** events when you control the hook — then you do not need this mapper.
