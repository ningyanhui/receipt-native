# Breaking changes (0.x)

This project is **0.x** ([semver](https://semver.org/)): breaking changes may land without a major bump, but we document them here and bump `receiptVersion` / package version when the **receipt bytes** contract changes.

## Rules

1. **`package.json` `version`** — semver for the npm/repo artifact.  
2. **`receipt.receiptVersion`** — version of the **receipt JSON contract**.  
   - Additive optional fields: usually keep `receiptVersion`, note in changelog.  
   - Rename/remove/repurpose signed fields, change canonicalize, change digest/signature encoding: **bump `receiptVersion`** (e.g. `0.1.0` → `0.2.0`) and add a section below.  
3. Verify/glass MUST remain able to fail closed on unknown/unsupported `receiptVersion` once we add an allowlist (today: accept `0.1.0`).  
4. Adapters MUST NOT invent parallel receipt shapes; always go through `emitReceipt`.

## History

### 0.1.0 (initial)

- Fields: `receiptVersion`, `id`, `timestamp`, `modelId`, `toolName`, `argsDigest`, `resultDigest`, `policyBundleHash`, `producer`, `signature`, `publicKey`, optional previews.  
- Encoding: standard base64 raw Ed25519 key/sig; signing message = UTF-8 canonicalize(receipt without `signature`).  
- Producers: `demo-loop`, `generic`, plus example harness ids.
