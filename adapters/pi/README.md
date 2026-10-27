# adapters/pi — example mapping onto generic tool-events

Pi is **one example** of feeding the [generic adapter](../generic/README.md).  
We do **not** hard-depend on `@earendil-works/pi-agent-core` / `pi-coding-agent`.

| Path | Status |
|------|--------|
| Fixture replay | ✅ `npm run adapter:replay -- --harness pi` |
| Live Pi hook | stub — see below |

## Fixture (no Pi install)

```bash
npm run adapter:replay -- --harness pi
# or
node adapters/pi/from-fixture.js
```

Events: `fixtures/pi/sample-tool-events.json` (Pi-flavored fields → `map-event.js` → generic).

## Live hook (stub + guide)

Packages (optional, not required by this repo):

| Package | Role |
|---------|------|
| `@earendil-works/pi-coding-agent` | CLI `pi` |
| `@earendil-works/pi-agent-core` | tool calling / state |

Suggested integration:

1. Subscribe to Pi tool-end / `toolResult` events.  
2. Append a **generic** tool-event (or Pi-shaped row that `map-event.js` understands) to a JSONL file.  
3. `npm run adapter:replay -- --harness pi --file that.jsonl`  
   or `--harness generic` if you already emit the minimal schema.

Do not install full Pi into this repo’s runtime deps for CI. Fixture replay proves the pipeline.

Upstream: https://github.com/earendil-works/pi · https://pi.dev
