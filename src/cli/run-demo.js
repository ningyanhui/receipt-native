#!/usr/bin/env node
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { digestPayload } from '../crypto/digest.js';
import { runDemoLoop } from '../producer/demo-loop.js';
import { verifyReceipt } from '../crypto/sign.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

async function main() {
  console.log('receipt-native · M2 demo-loop (signed receipts)');
  console.log('Not a Gateway. Not a coding agent. Local only.\n');

  const { receipts } = await runDemoLoop();

  const expectedByTool = {
    write_file: {
      args: {
        path: 'demo-sandbox/hello.txt',
        content: 'hello from receipt-native demo-loop\n',
      },
    },
    mock_outbound: {
      args: {
        channel: 'mock',
        to: 'demo-recipient@local',
        body: 'Receipt-Native demo: task complete. See attached receipt ids.',
      },
    },
  };

  for (const { fileName, receipt } of receipts) {
    console.log(`✓ ${receipt.toolName}`);
    console.log(`  file: receipts/${fileName}`);
    console.log(`  id:   ${receipt.id}`);
    console.log(`  argsDigest:   ${receipt.argsDigest}`);
    console.log(`  resultDigest: ${receipt.resultDigest}`);
    console.log(`  producer:     ${receipt.producer}`);
    console.log(`  publicKey:    ${receipt.publicKey?.slice(0, 16)}…`);
    console.log(`  signature:    ${receipt.signature?.slice(0, 24)}…`);

    const expected = expectedByTool[receipt.toolName];
    if (!expected) throw new Error(`unexpected tool ${receipt.toolName}`);
    const recomputedArgs = digestPayload(expected.args);
    if (recomputedArgs !== receipt.argsDigest) {
      throw new Error(
        `argsDigest mismatch for ${receipt.toolName}: got ${receipt.argsDigest}, recomputed ${recomputedArgs}`,
      );
    }
    console.log('  argsDigest recomputed: OK');

    const v = verifyReceipt(receipt);
    if (!v.ok) throw new Error(`self-verify failed for ${receipt.toolName}: ${v.reason}`);
    console.log('  signature verify: GREEN');
    console.log('');
  }

  for (const { receipt } of receipts) {
    if (!/^[0-9a-f]{64}$/.test(receipt.argsDigest)) {
      throw new Error(`bad argsDigest for ${receipt.toolName}`);
    }
    if (!/^[0-9a-f]{64}$/.test(receipt.resultDigest)) {
      throw new Error(`bad resultDigest for ${receipt.toolName}`);
    }
    if (typeof receipt.signature !== 'string' || !receipt.signature) {
      throw new Error(`missing signature on ${receipt.toolName}`);
    }
    if (typeof receipt.publicKey !== 'string' || !receipt.publicKey) {
      throw new Error(`missing publicKey on ${receipt.toolName}`);
    }
    const required = [
      'receiptVersion',
      'id',
      'timestamp',
      'modelId',
      'toolName',
      'argsDigest',
      'resultDigest',
      'policyBundleHash',
      'producer',
    ];
    for (const k of required) {
      if (receipt[k] === undefined || receipt[k] === null || receipt[k] === '') {
        throw new Error(`missing field ${k} on ${receipt.toolName}`);
      }
    }
  }

  const d1 = digestPayload({ a: 1, b: 'x' });
  const d2 = digestPayload({ b: 'x', a: 1 });
  if (d1 !== d2) throw new Error('canonical digest not stable under key reorder');

  const onDisk = (await readdir(path.join(ROOT, 'receipts')))
    .filter((f) => f.endsWith('.json'))
    .sort();
  console.log(`Wrote ${receipts.length} signed receipt(s) under receipts/`);
  for (const f of onDisk) {
    const raw = JSON.parse(await readFile(path.join(ROOT, 'receipts', f), 'utf8'));
    const tag = raw.signature ? 'signed' : 'unsigned';
    console.log(`  - ${f} (${raw.toolName}, ${tag})`);
  }
  console.log('\nTry: npm run verify -- receipts/<file>.json');
  console.log('     open verify/verify.html and paste JSON → green');
  console.log('     npm run forge-demo  → tampered receipt → red');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
