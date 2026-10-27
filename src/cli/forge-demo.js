#!/usr/bin/env node
/**
 * Forge demo: take a real signed receipt, tamper toolName (or argsDigest),
 * write without re-signing → must verify red.
 */
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifyReceipt } from '../crypto/sign.js';
import { runDemoLoop } from '../producer/demo-loop.js';
import { keysExist } from '../crypto/keys.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const RECEIPTS = path.join(ROOT, 'receipts');

async function pickSignedReceipt() {
  await mkdir(RECEIPTS, { recursive: true });
  const files = (await readdir(RECEIPTS))
    .filter((f) => f.endsWith('.json') && !f.startsWith('forged-'))
    .sort();

  for (const f of files.reverse()) {
    const receipt = JSON.parse(await readFile(path.join(RECEIPTS, f), 'utf8'));
    if (typeof receipt.signature === 'string' && receipt.signature) {
      return { fileName: f, receipt };
    }
  }
  return null;
}

async function main() {
  console.log('receipt-native · forge-demo (tamper → expect red)\n');

  if (!(await keysExist())) {
    console.error('No keys/. Run: npm run keygen');
    process.exit(1);
  }

  let picked = await pickSignedReceipt();
  if (!picked) {
    console.log('No signed receipts yet — running demo first…\n');
    await runDemoLoop();
    picked = await pickSignedReceipt();
  }
  if (!picked) {
    console.error('Still no signed receipt after demo');
    process.exit(1);
  }

  const { fileName, receipt } = picked;
  const before = verifyReceipt(receipt);
  if (!before.ok) {
    console.error(`Source receipt already fails verify: ${before.reason}`);
    process.exit(1);
  }

  const forged = {
    ...receipt,
    toolName: receipt.toolName + '_TAMPERED',
    // keep same signature + publicKey → must fail
  };

  const outName = `forged-${fileName}`;
  const outPath = path.join(RECEIPTS, outName);
  await writeFile(outPath, JSON.stringify(forged, null, 2) + '\n', 'utf8');

  const after = verifyReceipt(forged);
  console.log(`source:  receipts/${fileName}`);
  console.log(`         CLI verify → ${before.ok ? 'green' : 'red'}`);
  console.log(`forged:  receipts/${outName}`);
  console.log(`         tampered field: toolName → ${JSON.stringify(forged.toolName)}`);
  console.log(`         CLI verify → ${after.ok ? 'green' : 'red'} (${after.reason ?? 'ok'})`);
  console.log('');
  if (after.ok) {
    console.error('BUG: forged receipt verified green — signing payload mismatch?');
    process.exit(1);
  }
  console.log('Paste forged JSON into verify/verify.html → expect RED.');
  console.log(`npm run verify -- receipts/${outName}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
