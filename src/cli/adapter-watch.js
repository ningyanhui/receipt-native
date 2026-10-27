#!/usr/bin/env node
// @ts-check
/**
 * Watch a JSONL file of tool events and emit a signed receipt for each appended line.
 *
 * Usage:
 *   npm run adapter:watch -- --file /path/to/events.jsonl
 *   npm run adapter:watch -- --file /path/to/events.jsonl --harness cursor
 *   npm run adapter:watch -- --file /path/to/events.jsonl --skip-existing
 *
 * Each new complete line (terminated by newline) is treated as one tool-event JSON object.
 * The event is normalised, signed with local keys/, and written to receipts/adapters/<producer>/.
 *
 * Append to the watched file from any agent, shell script, or CI job — no vendor SDK needed.
 */
import { createReadStream } from 'node:fs';
import { stat, mkdir } from 'node:fs/promises';
import { watch } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { emitReceipt } from '../producer/emit-receipt.js';
import { normalizeToolEvent } from '../../adapters/_shared/tool-event.js';
import {
  keysExist,
  loadPrivateKey,
  loadPublicKeyBase64,
  ROOT,
} from '../crypto/keys.js';
import { verifyReceipt } from '../crypto/sign.js';

const KNOWN = ['generic', 'pi', 'cursor', 'codex', 'claude-code'];

function parseArgs(argv) {
  const out = { harness: 'generic', file: null, skipExisting: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--harness' || a === '-h') out.harness = argv[++i];
    else if (a === '--file' || a === '-f') out.file = argv[++i];
    else if (a === '--skip-existing') out.skipExisting = true;
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

/**
 * Read new bytes from `filePath` starting at `fromOffset`, split into lines.
 * Returns `{ lines, bytesConsumed, partial }`.
 * `partial` is any trailing text without a terminating newline (held for the next read).
 */
async function readNewLines(filePath, fromOffset, previousPartial = '') {
  let fileSize;
  try {
    fileSize = (await stat(filePath)).size;
  } catch {
    return { lines: [], bytesConsumed: 0, partial: previousPartial };
  }

  if (fileSize <= fromOffset) {
    return { lines: [], bytesConsumed: 0, partial: previousPartial };
  }

  const chunks = await new Promise((resolve, reject) => {
    const acc = [];
    const stream = createReadStream(filePath, { start: fromOffset });
    stream.on('data', (c) => acc.push(c));
    stream.on('end', () => resolve(acc));
    stream.on('error', reject);
  });

  const newBytes = Buffer.concat(chunks);
  const text = previousPartial + newBytes.toString('utf8');
  const parts = text.split(/\r?\n/);
  // Last element is either empty (file ended with newline) or an incomplete line.
  const partial = parts.pop() ?? '';
  return { lines: parts, bytesConsumed: newBytes.length, partial };
}

async function processLine(line, ctx) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;

  let rawEv;
  try {
    rawEv = JSON.parse(trimmed);
  } catch (err) {
    console.error(`  ⚠  skipped (JSON parse error): ${err.message}`);
    return;
  }

  const shaped = ctx.mapEvent ? ctx.mapEvent(rawEv) : rawEv;
  let norm;
  try {
    norm = normalizeToolEvent(shaped);
  } catch (err) {
    console.error(`  ⚠  skipped (normalize error): ${err.message}`);
    return;
  }

  const emitted = await emitReceipt({
    ...norm,
    producer: ctx.producer,
    privateKey: ctx.privateKey,
    publicKeyBase64: ctx.publicKeyBase64,
    outDir: ctx.outDir,
  });

  const v = verifyReceipt(emitted.receipt);
  const rel = emitted.fileName
    ? path.relative(ROOT, path.join(ctx.outDir, emitted.fileName))
    : '(no file)';

  if (v.ok) {
    console.log(`  ✓ ${norm.toolName}  →  ${rel}  GREEN`);
  } else {
    console.error(`  ✗ ${norm.toolName}  →  verify FAILED: ${v.reason}`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log(`Usage: npm run adapter:watch -- --file <events.jsonl> [options]

Options:
  --file, -f <path>       JSONL file to watch for appended tool events (required)
  --harness, -h <name>    Harness mapper to apply (default: generic)
                          Known: ${KNOWN.join(', ')}
  --skip-existing         Skip lines already in the file; only process new appends
  --help                  Show this help

Each appended line must be a complete JSON object matching the generic tool-event schema
(or the selected harness's native shape).  A signed receipt is emitted for each line.

Demo (two terminals):
  # Terminal 1 — start watcher
  npm run keygen          # first time only
  npm run adapter:watch -- --file /tmp/my-events.jsonl

  # Terminal 2 — append events
  echo '{"toolName":"shell","args":{"command":"ls"},"result":{"exitCode":0}}' >> /tmp/my-events.jsonl
  echo '{"toolName":"write_file","args":{"path":"x.txt"},"result":{"ok":true}}' >> /tmp/my-events.jsonl`);
    process.exit(0);
  }

  if (!args.file) {
    console.error('Error: --file <path> is required.\n');
    console.error('Usage: npm run adapter:watch -- --file events.jsonl [--harness generic]');
    console.error('       npm run adapter:watch -- --help');
    process.exit(2);
  }

  const harness = args.harness || 'generic';
  const filePath = path.resolve(args.file);
  const producer = harness === 'generic' ? 'generic' : harness;
  const mapEvent = await loadMapper(harness);
  const outDir = path.join(ROOT, 'receipts', 'adapters', producer);

  if (!(await keysExist())) {
    console.error('Missing keys/. Run: npm run keygen');
    process.exit(1);
  }
  const privateKey = await loadPrivateKey();
  const publicKeyBase64 = await loadPublicKeyBase64();

  await mkdir(outDir, { recursive: true });

  const ctx = { mapEvent, producer, privateKey, publicKeyBase64, outDir };

  console.log('receipt-native · adapter watch');
  console.log(`  harness:       ${harness}`);
  console.log(`  file:          ${filePath}`);
  console.log(`  receipts out:  ${path.relative(ROOT, outDir)}/`);
  console.log(`  skip-existing: ${args.skipExisting}`);
  console.log('');

  // Determine starting byte offset and process any pre-existing content.
  let offset = 0;
  let partial = '';

  if (args.skipExisting) {
    try {
      offset = (await stat(filePath)).size;
      console.log(`  (skipping ${offset} existing bytes)`);
    } catch {
      // File doesn't exist yet — start at 0 when it appears.
    }
  } else {
    try {
      const { lines, bytesConsumed, partial: p } = await readNewLines(filePath, 0);
      offset = bytesConsumed;
      partial = p;
      for (const line of lines) {
        await processLine(line, ctx);
      }
      if (lines.length > 0) {
        console.log(`  (processed ${lines.length} existing line(s))`);
      }
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
      console.log('  (file not found — waiting for creation…)');
    }
  }

  console.log('Watching for appended tool events… (Ctrl+C to stop)\n');

  // Serialise watch callbacks to avoid concurrent reads from the same offset.
  let busy = false;
  let pending = false;

  async function checkFile() {
    if (busy) { pending = true; return; }
    busy = true;
    try {
      const { lines, bytesConsumed, partial: p } = await readNewLines(filePath, offset, partial);
      if (bytesConsumed > 0 || p !== partial) {
        offset += bytesConsumed;
        partial = p;
        for (const line of lines) {
          await processLine(line, ctx);
        }
      }
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error(`  watch read error: ${err.message}`);
      }
    } finally {
      busy = false;
      if (pending) { pending = false; setImmediate(checkFile); }
    }
  }

  // Watch the parent directory so creation of the file is detected too.
  const watchDir = path.dirname(filePath);
  const watchTarget = path.basename(filePath);

  const watcher = watch(watchDir, { persistent: true }, (_event, filename) => {
    if (filename === watchTarget || filename === null) {
      checkFile();
    }
  });

  watcher.on('error', (err) => {
    console.error(`watcher error: ${err.message}`);
  });

  process.on('SIGINT', () => {
    console.log('\nStopped.');
    watcher.close();
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    watcher.close();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
