# adapters/cursor — example mapping onto generic tool-events

Maps Cursor / Cloud Agent–style `tool_call` records into the [generic schema](../generic/README.md).

| Path | Status |
|------|--------|
| Fixture replay | ✅ `npm run adapter:replay -- --harness cursor` |
| Live via JSONL watch | ✅ `npm run adapter:watch -- --file events.jsonl --harness cursor` |

> No official Cursor transcript export API exists. Use one of the paths below to collect
> events from a live session, then watch or replay.

## Fixture

```bash
npm run adapter:replay -- --harness cursor
```

## Live — JSONL watch path (recommended)

From inside an agent shell step, MCP server, or any wrapper that can intercept tool calls,
append one JSON line per tool completion to a shared JSONL file, then watch it:

```bash
# Terminal 1 — start watch before (or during) the agent session
npm run keygen          # once
npm run adapter:watch -- --file /tmp/cursor-events.jsonl --harness cursor

# Agent-side — append one line per tool call in Cursor-native shape:
echo '{"tool_call":{"name":"Shell","arguments":{"command":"npm test"}},"result":{"exitCode":0}}' \
  >> /tmp/cursor-events.jsonl
```

Or emit in the **generic** shape (no mapper needed):

```bash
echo '{"toolName":"Shell","args":{"command":"npm test"},"result":{"exitCode":0}}' \
  >> /tmp/cursor-events.jsonl
# then: npm run adapter:watch -- --file /tmp/cursor-events.jsonl
```

## Live — batch replay (session end)

Collect tool-call entries from Cursor's terminal/debug output into a JSON array, then replay:

```json
[
  { "tool_call": { "name": "read_file", "arguments": { "path": "package.json" } }, "result": { "ok": true } }
]
```

```bash
npm run adapter:replay -- --harness cursor --file /path/to/my-session.json
```

`map-event.js` handles several Cursor field shapes (`tool_call.name`, `tool_call.function.name`, `toolCall.name`, `name`).

Prefer the generic option when you can instrument the hook yourself — it skips this mapper entirely.
