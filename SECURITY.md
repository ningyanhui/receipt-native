# Security

## Keys

- **Never commit private keys.** `keys/` is gitignored (`*.pem`, `*.key`, `keys/*` except README/gitkeep).  
- Generate locally: `npm run keygen`.  
- CI uses ephemeral keys (or the **public** fixture key under `fixtures/test-keys/`, labeled insecure / test-only).

## If a private key leaks

1. Stop using that keypair for any real receipts.  
2. Rotate: `npm run keygen` (new files under `keys/`).  
3. Treat receipts signed by the leaked key as untrusted until re-issued.  
4. If the leak was committed to git, purge history and revoke any published artifacts that embedded the PEM.

## Verify trust model (one line)

A **green** verify means the receipt bytes (minus `signature`) match an Ed25519 signature under `receipt.publicKey` — it does **not** by itself prove who controls that key or that the tool really ran; pin / distribute public keys out of band.

## Reporting

Please open a GitHub issue marked security (or contact the repo owner) for vulnerabilities in sign/verify or adapter replay. Do not file private keys in issues.
