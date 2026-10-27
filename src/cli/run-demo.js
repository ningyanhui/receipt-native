#!/usr/bin/env node
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { digestPayload } from '../crypto/digest.js';
import { runDemoLoop } from '../producer/demo-loop.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

async function main() {
  console.log('receipt-native · M1 demo-loop (unsigned receipts)');
  console.log('Not a Gateway. Not a coding agent. Local only.\n');

  const { receipts } = await runDemoLoop();

  // Known payloads must match demo-loop.js (recompute digests from disk receipts)
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
    console.log(`  signature:    ${receipt.signature === null ? '(none — M1 unsigned)' : receipt.signature}`);

    const expected = expectedByTool[receipt.toolName];
    if (!expected) throw new Error(`unexpected tool ${receipt.toolName}`);
    const recomputedArgs = digestPayload(expected.args);
    if (recomputedArgs !== receipt.argsDigest) {
      throw new Error(
        `argsDigest mismatch for ${receipt.toolName}: got ${receipt.argsDigest}, recomputed ${recomputedArgs}`,
      );
    }
    console.log('  argsDigest recomputed: OK');
    console.log('');
  }

  for (const { receipt } of receipts) {
    if (!/^[0-9a-f]{64}$/.test(receipt.argsDigest)) {
      throw new Error(`bad argsDigest for ${receipt.toolName}`);
    }
    if (!/^[0-9a-f]{64}$/.test(receipt.resultDigest)) {
      throw new Error(`bad resultDigest for ${receipt.toolName}`);
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

  // Canonical stability
  const d1 = digestPayload({ a: 1, b: 'x' });
  const d2 = digestPayload({ b: 'x', a: 1 });
  if (d1 !== d2) throw new Error('canonical digest not stable under key reorder');

  // Disk listing
  const onDisk = (await readdir(path.join(ROOT, 'receipts')))
    .filter((f) => f.endsWith('.json'))
    .sort();
  console.log(`Wrote ${receipts.length} unsigned receipt(s) under receipts/`);
  for (const f of onDisk) {
    const raw = JSON.parse(await readFile(path.join(ROOT, 'receipts', f), 'utf8'));
    console.log(`  - ${f} (${raw.toolName})`);
  }
  console.log('Next: M2 Ed25519 + verify.html');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
