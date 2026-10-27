#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { verifyReceipt } from '../crypto/sign.js';

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: npm run verify -- path/to/receipt.json');
    process.exit(2);
  }
  const filePath = path.resolve(arg);
  const receipt = JSON.parse(await readFile(filePath, 'utf8'));
  const result = verifyReceipt(receipt);
  if (result.ok) {
    console.log('green');
    console.log(`ok  ${path.basename(filePath)}  tool=${receipt.toolName}  id=${receipt.id}`);
    process.exit(0);
  }
  console.log('red');
  console.log(`fail  ${path.basename(filePath)}  reason=${result.reason}`);
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
