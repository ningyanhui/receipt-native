# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
for the **package artifact**. Receipt JSON contract changes also bump `receipt.receiptVersion`
(see [`docs/breaking-changes.md`](docs/breaking-changes.md)).

## [Unreleased]

## [0.1.1] - 2026-10-27

- Published to npm as `receipt-native@0.1.1` (`latest`).
- CLI entrypoints include shebang so `bin` survives `npm publish`.
- Note: `0.1.0` was staged then superseded; use `0.1.1`.



### Added

- **`adapter:watch` CLI** — `npm run adapter:watch -- --file events.jsonl [--harness <name>]` tails a JSONL file of generic tool-events and emits a signed receipt for each appended line using the same `emitReceipt` pipeline as fixture replay; no vendor SDK required
- **`bin` / `exports` / `files` in `package.json`** — package is now publish-ready (`receipt-verify`, `receipt-keygen`, `receipt-watch`, `receipt-replay` CLI entry points; `private` removed); engines node≥20 preserved

### Changed

- README, `docs/demo-script.md`, `CONTRIBUTING.md`, `adapters/README.md`: removed all competitor product names while keeping the product boundary clear (not a Gateway, not a coding agent, message channel delivers receipt drafts only, C1 runtime + C4 glass shell)
- Adapter status table (README + `adapters/README.md`): named adapters now show **live via JSONL watch ✅** instead of "live stub"; honest note that no vendor-official Cursor/Codex SDK hook exists — live path is "bring-your-own append"
- `adapters/{cursor,codex,claude-code,pi}/README.md`: each updated with `adapter:watch` quick-start commands
- `docs/bring-your-agent.md`: Step 2 now covers both batch replay and live watch; added two-terminal demo section
- `docs/release-checklist.md`: live watch added to smoke table; "out of scope" updated — vendor-official SDK hooks still out of scope, JSONL watch live path is now in scope

### Added (prior unreleased)

- `npm run demo:storyboard` — one-shot smoke: keygen → demo → verify green → forge → verify red → glass → deliver draft → generic adapter replay
- [`docs/release-checklist.md`](docs/release-checklist.md) — pre-release self-check

## [0.1.0] — 2026-10-27

Initial public MVP of **Receipt-Native** (C1 evidence-receipt runtime; C4 action glass as display shell only).

### Added

- **Signed receipts** — Ed25519 over `canonicalize(receipt without signature)`; `publicKey` / `signature` as standard base64 of raw 32/64 bytes
- **Producer API** — `emitReceipt({ toolName, args, result, producer, … })` (`src/producer/emit-receipt.js`)
- **Demo loop** — `npm run demo` (write_file + mock_outbound) writes signed receipts under `receipts/`
- **Verify** — CLI `npm run verify` and `verify/verify.html` (green / red)
- **Forge demo** — `npm run forge-demo` tampers a real receipt without re-signing → must verify red
- **Action glass** — `npm run glass:bundle` + static `/glass/` timeline (display shell, not an IDE)
- **IM deliver draft** — `npm run deliver:draft` writes `delivery/outbox/` only; **never sends**
- **Generic-first adapters** — any agent via minimal tool-event JSON/JSONL (`adapters/generic/`); example mappers for pi / cursor / codex / claude-code (fixture replay + live stub honesty)
- **BYO docs** — [`docs/bring-your-agent.md`](docs/bring-your-agent.md) (Qoder / ZCode / WorkBuddy / custom same path)
- **CI** — GitHub Actions: unit tests, demo green, forge red, adapter replay
- **Open-source kit** — MIT `LICENSE`, `CONTRIBUTING.md`, `SECURITY.md`, `docs/architecture.md`, `docs/breaking-changes.md`, `docs/demo-script.md`, golden fixtures + insecure `fixtures/test-keys/` for tests only

### Security

- Private keys under `keys/` are gitignored; never commit PEMs or `*.b64` key material from a real keygen
- Delivery path is draft-only by design (no Telegram/IM API in default scripts)

[Unreleased]: https://github.com/ningyanhui/receipt-native/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/ningyanhui/receipt-native/releases/tag/v0.1.0
