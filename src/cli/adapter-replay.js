#!/usr/bin/env node
/**
 * Replay harness fixtures (or any generic tool-event file) into signed receipts.
 *
 *   npm run adapter:replay -- --harness generic
 *   npm run adapter:replay -- --harness pi
 *   npm run adapter:replay -- --harness generic --file path/to/events.json
 */
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  replayToolEvents,
  defaultFixturePath,
} from '../../adapters/_shared/replay.js';
import { ROOT } from '../crypto/keys.js';
import { verifyReceipt } from '../crypto/sign.js';

const KNOWN = ['generic', 'pi', 'cursor', 'codex', 'claude-code'];

function parseArgs(argv) {
  const out = { harness: 'generic', file: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--harness' || a === '-h') out.harness = argv[++i];
    else if (a === '--file' || a === '-f') out.file = argv[++i];
    else if (a === '--help') out.help = true;
  }
  return out;
}

async function loadMapper(harness) {
  if (harness === 'generic') return undefined;
  try {
    const modPath = path.join(ROOT, 'adapters', harness, 'map-event.js');
    const mod = await import(pathToFileURL(modPath).href);
    return mod.mapEvent ?? mod.default;
  } catch {
    return undefined;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(`Usage: npm run adapter:replay -- --harness <name> [--file path]

Known harnesses: ${KNOWN.join(', ')}
Default file: fixtures/<harness>/sample-tool-events.json
Any agent: export tool events as generic JSON/JSONL → --harness generic --file …`);
    process.exit(0);
  }

  const harness = args.harness || 'generic';
  if (!KNOWN.includes(harness) && !args.file) {
    console.error(
      `Unknown harness "${harness}". Use one of: ${KNOWN.join(', ')} or pass --file`,
    );
    process.exit(2);
  }

  const fixturePath = args.file
    ? path.resolve(args.file)
    : defaultFixturePath(harness);
  const mapEvent = await loadMapper(harness);
  const producer = harness === 'generic' ? 'generic' : harness;

  console.log(`receipt-native · adapter replay`);
  console.log(`  harness:  ${harness}`);
  console.log(`  producer: ${producer}`);
  console.log(`  fixture:  ${path.relative(ROOT, fixturePath)}`);
  console.log('');

  const { receipts, outDir } = await replayToolEvents({
    fixturePath,
    producer,
    mapEvent,
  });

  for (const { fileName, receipt } of receipts) {
    const v = verifyReceipt(receipt);
    if (!v.ok) {
      throw new Error(`verify failed for ${fileName}: ${v.reason}`);
    }
    console.log(`✓ ${receipt.toolName}  →  ${path.relative(ROOT, path.join(outDir, fileName))}  GREEN`);
  }
  console.log(`\nWrote ${receipts.length} signed receipt(s) under ${path.relative(ROOT, outDir)}/`);
  console.log('Any agent that can emit the generic tool-event schema can use --harness generic.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
