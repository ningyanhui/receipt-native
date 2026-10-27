#!/usr/bin/env bash
# One-shot reproducible path for the 30s storyboard / release smoke.
# Fail closed (non-zero) on unexpected green forge or any other step failure.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> receipt-native · demo:storyboard"
echo "    root: $ROOT"
echo

step() { echo; echo "── $* ──"; }

have_keys() {
  [[ -f keys/ed25519-private.pem && -f keys/ed25519-public.pem ]]
}

latest_signed() {
  # Prefer write_file demo receipts; fall back to any non-forged *.json under receipts/
  local f
  f="$(ls -1t receipts/*_write_file_*.json 2>/dev/null | grep -v forged | head -1 || true)"
  if [[ -z "${f:-}" ]]; then
    f="$(ls -1t receipts/*.json 2>/dev/null | grep -v forged | head -1 || true)"
  fi
  if [[ -z "${f:-}" ]]; then
    echo "No signed receipt under receipts/" >&2
    return 1
  fi
  printf '%s' "$f"
}

latest_forged() {
  local f
  # Prefer newest by mtime so we verify the forge we just wrote
  f="$(ls -1t receipts/forged-*.json 2>/dev/null | head -1 || true)"
  if [[ -z "${f:-}" ]]; then
    echo "No forged receipt under receipts/" >&2
    return 1
  fi
  printf '%s' "$f"
}

step "1/8 keygen (if needed)"
if have_keys; then
  echo "keys already present — skip keygen"
else
  npm run keygen
fi

step "2/8 demo (signed receipts)"
npm run demo

step "3/8 verify latest real receipt → expect green"
REAL="$(latest_signed)"
echo "Verifying $REAL"
OUT="$(npm run verify -- "$REAL")"
echo "$OUT"
echo "$OUT" | grep -q '^green$' || { echo "expected green for $REAL" >&2; exit 1; }

step "4/8 forge-demo (tamper without re-sign)"
npm run forge-demo

step "5/8 verify forged → expect red"
FORGED="$(latest_forged)"
echo "Verifying $FORGED (must be red)"
set +e
FOUT="$(npm run verify -- "$FORGED" 2>&1)"
FCODE=$?
set -e
echo "$FOUT"
if [[ $FCODE -eq 0 ]] || echo "$FOUT" | grep -q '^green$'; then
  echo "forged receipt unexpectedly green: $FORGED" >&2
  exit 1
fi
echo "$FOUT" | grep -q '^red$' || { echo "expected red line for $FORGED" >&2; exit 1; }
echo "forged correctly red"

step "6/8 glass:bundle"
npm run glass:bundle

step "7/8 deliver:draft (local only — does NOT send IM)"
npm run deliver:draft

step "8/8 adapter:replay --harness generic (any-agent path)"
npm run adapter:replay -- --harness generic

echo
echo "════════════════════════════════════════════════════════"
echo " demo:storyboard OK"
echo
echo " Next — open locally (do not commit keys/receipts noise):"
echo "   python3 -m http.server 8765"
echo "   glass:  http://127.0.0.1:8765/glass/"
echo "   verify: http://127.0.0.1:8765/verify/verify.html"
echo "   draft:  delivery/outbox/draft-message.md"
echo
echo " Any agent (Qoder / ZCode / WorkBuddy / …):"
echo "   npm run adapter:replay -- --harness generic --file /path/to/events.jsonl"
echo "   see docs/bring-your-agent.md"
echo "════════════════════════════════════════════════════════"
