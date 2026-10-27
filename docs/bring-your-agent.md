# Bring your own agent

Receipt-Native works with **any** agent that can expose tool calls as data — Qoder, ZCode, WorkBuddy, Pi, Cursor, Codex, Claude Code, a shell wrapper, a CI job, etc.

You do **not** need a first-party adapter. Use the **generic** tool-event format.

## Three steps

### 1. Export tool events

For each completed tool call, write one object:

```json
{
  "toolName": "write_file",
  "args": { "path": "x.txt", "content": "hi" },
  "result": { "ok": true },
  "timestamp": "2026-10-27T08:00:00.000Z",
  "modelId": "my-agent/model"
}
```

Save as:

- a JSON **array**, or  
- `{ "events": [ ... ] }`, or  
- **JSON Lines** (one object per line)

Easiest live hook: append JSONL on every tool end.

### 2. Replay or live-watch → signed receipts

**Batch replay** (process a completed file):

```bash
npm run keygen    # once, local keys/ (never commit private key)
npm run adapter:replay -- --harness generic --file /path/to/events.jsonl
```

**Live watch** (sign each line as it is appended — real-time path):

```bash
npm run keygen    # once
npm run adapter:watch -- --file /path/to/events.jsonl
# Then append events from any process; each line is signed immediately.
# Add --skip-existing to ignore lines already in the file before watch started.
```

With a named harness mapper (`pi`, `cursor`, `codex`, `claude-code`):

```bash
npm run adapter:watch -- --file /path/to/events.jsonl --harness cursor
```

The live watch path uses the same `emitReceipt` pipeline as replay — no official Cursor / Codex SDK required. Write a JSON line on each tool completion and watch signs it.

### 3. Verify / glass

```bash
npm run verify -- receipts/adapters/generic/<file>.json   # green
npm run glass:bundle
# serve repo root and open /glass/
```

## Agent status (all welcome)

| Agent / harness | Special adapter needed? | Status |
|-----------------|-------------------------|--------|
| **Any agent** (generic event log) | No | ✅ use `--harness generic` |
| Qoder | No | ✅ generic format |
| ZCode | No | ✅ generic format |
| WorkBuddy | No | ✅ generic format |
| Pi | Optional mapper | ✅ fixture example in `adapters/pi` |
| Cursor | Optional mapper | ✅ fixture example in `adapters/cursor` |
| Codex | Optional mapper | ✅ fixture example in `adapters/codex` |
| Claude Code | Optional mapper | ✅ fixture example in `adapters/claude-code` |
| Your internal bot | No | ✅ generic format |

## What we will not become

- A multi-channel message Gateway  
- A unified “host every agent” platform with our own loop  
- Something that silently sends IM / Telegram for you

Message delivery in this repo stays **draft-only** unless you explicitly opt into a future send path.

## Live watch quick-start (two-terminal demo)

```bash
# Terminal 1 — start watcher (keep running)
npm run keygen
npm run adapter:watch -- --file /tmp/demo-live.jsonl

# Terminal 2 — append events (any agent, shell script, or CI job)
echo '{"toolName":"read_file","args":{"path":"x.txt"},"result":{"ok":true,"bytes":42}}' >> /tmp/demo-live.jsonl
echo '{"toolName":"shell","args":{"command":"npm test"},"result":{"exitCode":0}}' >> /tmp/demo-live.jsonl

# Terminal 1 prints:
#   ✓ read_file  →  receipts/adapters/generic/<id>.json  GREEN
#   ✓ shell      →  receipts/adapters/generic/<id>.json  GREEN
```

Verify any receipt offline:

```bash
npm run verify -- receipts/adapters/generic/<file>.json   # → green
```
