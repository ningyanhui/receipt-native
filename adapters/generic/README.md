# adapters/generic — Any agent

**This is the primary adapter.** Any coding agent / harness that can export (or hook) tool calls into the minimal **tool-event** schema can produce signed receipts — no special SDK required.

Examples that fit: Qoder, ZCode, WorkBuddy, Pi, Cursor, Codex, Claude Code, custom loops, CI wrappers.

## Tool-event schema (minimal)

Required per event:

| Field | Type | Notes |
|-------|------|--------|
| `toolName` | string | Tool / function name |
| `args` | any | Digested via canonicalize + sha256 |
| `result` | any | Digested the same way |

Optional: `timestamp` (ISO-8601), `modelId`, `id`, `policyBundleHash`, `argsPreview`, `resultPreview`.

Aliases accepted: `tool_name` / `name` → `toolName`; `model_id` → `modelId`; `ts` → `timestamp`.

### File shapes

1. **JSON array** of events  
2. **Object wrapper**: `{ "events": [...], "modelId"?: "...", "policyBundleHash"?: "..." }`  
3. **JSON Lines**: one event object per line

See `fixtures/generic/sample-tool-events.json` and `.jsonl`.

## Run (no API key)

```bash
npm run keygen   # once
npm run adapter:replay -- --harness generic
# or point at your export:
npm run adapter:replay -- --harness generic --file /path/to/your-events.json
```

Receipts land in `receipts/adapters/generic/`. Then:

```bash
npm run verify -- receipts/adapters/generic/<file>.json
npm run glass:bundle   # after copying/using receipts as usual
```

## How to hook a live agent

1. On each tool completion, append one tool-event object (JSONL is easiest).  
2. Or batch-export a JSON array at session end.  
3. Replay → signed receipts → verify/glass.

You do **not** need to depend on this repo from inside the agent. Export plain JSON; we sign offline.

## Not in scope

- Owning the agent loop / becoming a multi-channel Gateway  
- Requiring a vendor SDK as a hard dependency  
- Truly sending IM messages
