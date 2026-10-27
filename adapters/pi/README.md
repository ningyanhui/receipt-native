# adapters/pi — example mapping onto generic tool-events

Pi is **one example** of feeding the [generic adapter](../generic/README.md).  
We do **not** hard-depend on `@earendil-works/pi-agent-core` / `pi-coding-agent`.

| Path | Status |
|------|--------|
| Fixture replay | ✅ `npm run adapter:replay -- --harness pi` |
| Live via JSONL watch | ✅ `npm run adapter:watch -- --file events.jsonl --harness pi` |

## Fixture (no Pi install)

```bash
npm run adapter:replay -- --harness pi
# or
node adapters/pi/from-fixture.js
```

Events: `fixtures/pi/sample-tool-events.json` (Pi-flavored fields → `map-event.js` → generic).

## Live — JSONL watch path

Packages (optional, not required by this repo):

| Package | Role |
|---------|------|
| `@earendil-works/pi-coding-agent` | CLI `pi` |
| `@earendil-works/pi-agent-core` | tool calling / state |

**JSONL watch (live):**

```bash
# Terminal 1 — start watch
npm run keygen          # once
npm run adapter:watch -- --file /tmp/pi-events.jsonl --harness pi

# Pi-side — append one line per tool completion:
echo '{"toolName":"shell","args":{"command":"ls"},"result":{"exitCode":0}}' >> /tmp/pi-events.jsonl
```

**Or use the batch replay after a session:**

```bash
npm run adapter:replay -- --harness pi --file /tmp/pi-events.jsonl
```

Suggested Pi integration:

1. Subscribe to Pi tool-end / `toolResult` events.  
2. Append a generic tool-event (or Pi-shaped row that `map-event.js` understands) to a JSONL file.  
3. Keep `adapter:watch` running in the background for continuous receipt signing.

Do not install full Pi into this repo’s runtime deps for CI. Fixture replay proves the pipeline.

Upstream: https://github.com/earendil-works/pi · https://pi.dev
