# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
for the **package artifact**. Receipt JSON contract changes also bump `receipt.receiptVersion`
(see [`docs/breaking-changes.md`](docs/breaking-changes.md)).

## [Unreleased]

### Added

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
