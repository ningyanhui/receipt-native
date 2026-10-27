# Adapters

Receipt-Native does **not** own an agent loop. Adapters only turn tool events into **signed receipts**.

## Status table

| Adapter | Role | Status | How to run |
|---------|------|--------|------------|
| **generic** | **Any agent** (Qoder, ZCode, WorkBuddy, custom, …) via minimal tool-event JSON/JSONL | ✅ fixture replay | `npm run adapter:replay -- --harness generic` |
| demo-loop | Built-in local demo producer | ✅ | `npm run demo` |
| pi | Example mapper → generic | ✅ fixture / live stub | `npm run adapter:replay -- --harness pi` |
| cursor | Example mapper → generic | ✅ fixture / live stub | `npm run adapter:replay -- --harness cursor` |
| codex | Example mapper → generic | ✅ fixture / live stub | `npm run adapter:replay -- --harness codex` |
| claude-code | Example mapper → generic | ✅ fixture / live stub | `npm run adapter:replay -- --harness claude-code` |

**Primary path:** export or hook into the [generic tool-event schema](./generic/README.md), then replay. Named harness folders are thin aliases / field mappers, not exclusive integrations.

See also [`docs/bring-your-agent.md`](../docs/bring-your-agent.md).

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

- Multi-channel Gateway / OpenClaw clone  
- Owning the reasoning loop as a product  
- Requiring vendor SDKs in this repo’s default `npm install`
