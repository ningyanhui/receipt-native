# keys/ (local only)

Ed25519 keypair used to sign receipts. **Never commit private keys.**

```bash
npm run keygen
```

Creates (gitignored):

| File | Purpose |
|------|---------|
| `ed25519-private.pem` | PKCS8 PEM private key (mode 0600) |
| `ed25519-public.pem` | SPKI PEM public key |
| `ed25519-public.b64` | raw 32-byte public key, **standard base64** (same encoding as `receipt.publicKey`) |

Receipt fields:

- `publicKey` — standard base64 of raw 32 bytes
- `signature` — standard base64 of raw 64-byte Ed25519 signature

Signing message = UTF-8 of `canonicalize(receipt without signature)` — same canonicalize as digests (`src/crypto/digest.js`).
