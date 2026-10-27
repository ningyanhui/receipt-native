#!/usr/bin/env node
import { generateAndWriteKeys } from '../crypto/keys.js';

async function main() {
  const out = await generateAndWriteKeys();
  console.log('receipt-native · keygen (Ed25519)');
  console.log('Wrote (gitignored):');
  console.log(`  ${out.privatePemPath}`);
  console.log(`  ${out.publicPemPath}`);
  console.log(`  ${out.publicB64Path}`);
  console.log(`publicKey (base64, raw 32 bytes): ${out.publicKeyBase64}`);
  console.log('Keep private key offline. Never commit keys/.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
