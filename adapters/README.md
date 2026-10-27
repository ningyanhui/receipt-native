# Adapters

Receipt-Native does **not** own an agent loop. Adapters only turn tool events into **signed receipts**.

## Status table

| Adapter | Role | Status | How to run |
|---------|------|--------|------------|
| **generic** | **Any agent** (Qoder, ZCode, WorkBuddy, custom, …) via minimal tool-event JSON/JSONL | ✅ fixture + **live JSONL watch** | `npm run adapter:replay -- --harness generic` · `npm run adapter:watch -- --file events.jsonl` |
| demo-loop | Built-in local demo producer | ✅ | `npm run demo` |
| pi | Example mapper → generic | ✅ fixture / **live via JSONL watch** | `npm run adapter:watch -- --file events.jsonl --harness pi` |
| cursor | Example mapper → generic | ✅ fixture / **live via JSONL watch** | `npm run adapter:watch -- --file events.jsonl --harness cursor` |
| codex | Example mapper → generic | ✅ fixture / **live via JSONL watch** | `npm run adapter:watch -- --file events.jsonl --harness codex` |
| claude-code | Example mapper → generic | ✅ fixture / **live via JSONL watch** | `npm run adapter:watch -- --file events.jsonl --harness claude-code` |

**Live path (`adapter:watch`):** tail-watches a JSONL file; each appended line is an event → sign → receipt. No vendor SDK required. Named harnesses apply their `map-event.js` mapper before normalisation.

**Primary path:** export or hook into the [generic tool-event schema](./generic/README.md), then replay or watch. Named harness folders are thin field mappers, not exclusive integrations.

See also [`docs/bring-your-agent.md`](../docs/bring-your-agent.md).

## Live JSONL watch (quick demo)

```bash
npm run keygen          # once — generates keys/ (never commit)
npm run adapter:watch -- --file /tmp/live-demo.jsonl &

# In a second terminal (or from any process/agent), append events:
echo '{"toolName":"shell","args":{"command":"echo hi"},"result":{"exitCode":0}}' >> /tmp/live-demo.jsonl
echo '{"toolName":"write_file","args":{"path":"out.txt"},"result":{"ok":true}}' >> /tmp/live-demo.jsonl

# Watch terminal prints:
#   ✓ shell      →  receipts/adapters/generic/<id>.json  GREEN
#   ✓ write_file →  receipts/adapters/generic/<id>.json  GREEN
```

Receipts under `receipts/adapters/generic/` are signed and immediately verifiable:

```bash
npm run verify -- receipts/adapters/generic/<file>.json
```

## Extension point (new adapter)

1. Prefer emitting **generic** events — no new code required.  
2. If the vendor log shape is awkward, add `adapters/<name>/map-event.js` that returns `{ toolName, args, result, … }`.  
3. Drop a fixture under `fixtures/<name>/sample-tool-events.json`.  
4. Wire the name in `src/cli/adapter-replay.js` `KNOWN` (optional if callers pass `--file` with `--harness generic`).  
5. Document honesty: fixture ✅ vs live stub.

```
tool events  →  (optional mapEvent)  →  normalizeToolEvent  →  emitReceipt  →  receipts/*.json
                     adapters/_shared                         src/producer
```

## Hard no

- Multi-channel Gateway / becoming the control plane for all agents  
- Owning the reasoning loop as a product  
- Requiring vendor SDKs in this repo’s default `npm install`
