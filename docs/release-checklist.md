# Release checklist

Run before tagging or announcing a release. Prefer the one-shot smoke when possible.

## Automated smoke

```bash
npm test
npm run demo:storyboard
```

`demo:storyboard` must exit **0** and print glass/verify URLs. It covers:

| Step | Expect |
|------|--------|
| keygen (if no `keys/`) | keypair created, not committed |
| `demo` | ≥1 signed receipt under `receipts/` |
| `verify` latest real | **green** |
| `forge-demo` | `receipts/forged-*.json` |
| `verify` forged | **red** (non-zero from verify; storyboard treats as pass) |
| `glass:bundle` | `glass/run.json` |
| `deliver:draft` | `delivery/outbox/draft-*.md` only — **no IM send** |
| `adapter:replay --harness generic` | signed receipts from fixture |

## Manual / docs

- [ ] README 「30 秒故事板」 matches `demo:storyboard` / `docs/demo-script.md`
- [ ] Adapter table still **generic-first** (named harnesses are examples, not a whitelist)
- [ ] `CHANGELOG.md` has an entry for this version
- [ ] `docs/breaking-changes.md` updated if `receiptVersion` or canonicalize/encoding changed
- [ ] `SECURITY.md` still accurate (keys, forge closed)

## Secrets & artifacts (must stay out of git)

- [ ] `git status` shows **no** `keys/*.pem`, `keys/*.b64`, or other private key material staged
- [ ] Runtime noise not staged: `receipts/*.json` (except keep `.gitkeep`), `glass/run.json`, `delivery/outbox/draft-*`, `demo-sandbox/outbox/`
- [ ] Only committed key material is **insecure** `fixtures/test-keys/` (tests only)

## CI

- [ ] `.github/workflows/ci.yml` green on the tip you intend to tag
- [ ] `npm ci` works (zero runtime deps is intentional; lock may be tiny)

## Out of scope for a code release (coordinate separately)

- Live Cursor / Pi / Codex / Claude Code hooks (stubs + docs only in-repo)
- Real IM send
- Screen recording / GenerateVideo (use `docs/demo-script.md` as the command script)
