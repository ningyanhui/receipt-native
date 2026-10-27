# adapters/cursor — example mapping onto generic tool-events

Maps Cursor / Cloud Agent–style `tool_call` records into the [generic schema](../generic/README.md).

| Path | Status |
|------|--------|
| Fixture replay | ✅ `npm run adapter:replay -- --harness cursor` |
| Live Cursor hook | **stub** — no official Cursor transcript export API yet; collect manually (see below) |

## Fixture

```bash
npm run adapter:replay -- --harness cursor
```

## Live (stub — manual collection)

Cursor Cloud Agents do not currently expose a transcript export API.  
To produce a receipt from a live Cursor session you have two options:

**Option A — generic events (recommended)**  
If you control code that runs inside the agent loop (e.g. a shell step or MCP server), emit generic tool-event objects and save them as JSONL yourself:

```json
{ "toolName": "Shell", "args": { "command": "npm test" }, "result": { "exitCode": 0 }, "timestamp": "…" }
```

Then replay:

```bash
npm run adapter:replay -- --harness generic --file /path/to/events.jsonl
```

**Option B — cursor fixture format (manual transcript)**  
Copy tool-call entries from Cursor's terminal/debug output into a JSON array:

```json
[
  { "tool_call": { "name": "read_file", "arguments": { "path": "package.json" } }, "result": { "ok": true } }
]
```

Replay:

```bash
npm run adapter:replay -- --harness cursor --file /path/to/my-session.json
```

`map-event.js` handles several Cursor field shapes (`tool_call.name`, `tool_call.function.name`, `toolCall.name`, `name`).

Prefer Option A (generic) when you can instrument the hook yourself — it avoids this mapper entirely.
