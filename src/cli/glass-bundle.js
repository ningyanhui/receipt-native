#!/usr/bin/env node
/**
 * Collect the latest signed demo run from receipts/ into glass/run.json.
 * Excludes forged-*.json. Zero deps.
 */
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const RECEIPTS_DIR = path.join(ROOT, 'receipts');
const GLASS_DIR = path.join(ROOT, 'glass');
const OUT = path.join(GLASS_DIR, 'run.json');

/** Receipts within this window of the newest timestamp count as one "run". */
const RUN_WINDOW_MS = 5000;

async function main() {
  await mkdir(GLASS_DIR, { recursive: true });

  let files;
  try {
    files = await readdir(RECEIPTS_DIR);
  } catch {
    throw new Error(`Cannot read ${RECEIPTS_DIR}`);
  }

  const candidates = [];
  for (const name of files) {
    if (!name.endsWith('.json')) continue;
    if (name.startsWith('forged-')) continue;
    const raw = await readFile(path.join(RECEIPTS_DIR, name), 'utf8');
    let receipt;
    try {
      receipt = JSON.parse(raw);
    } catch {
      continue;
    }
    if (!receipt || typeof receipt !== 'object') continue;
    if (typeof receipt.signature !== 'string' || !receipt.signature) continue;
    if (typeof receipt.publicKey !== 'string' || !receipt.publicKey) continue;
    if (typeof receipt.timestamp !== 'string') continue;
    const t = Date.parse(receipt.timestamp);
    if (Number.isNaN(t)) continue;
    candidates.push({ name, receipt, t });
  }

  if (candidates.length === 0) {
    throw new Error(
      'No signed receipts found under receipts/ (excluding forged-*).\n' +
        'Run: npm run keygen && npm run demo',
    );
  }

  candidates.sort((a, b) => b.t - a.t);
  const newest = candidates[0].t;
  const run = candidates
    .filter((c) => newest - c.t <= RUN_WINDOW_MS)
    .sort((a, b) => a.t - b.t);

  const payload = {
    generatedAt: new Date().toISOString(),
    source: 'receipts/',
    runWindowMs: RUN_WINDOW_MS,
    fileNames: run.map((r) => r.name),
    receipts: run.map((r) => r.receipt),
  };

  await writeFile(OUT, JSON.stringify(payload, null, 2) + '\n', 'utf8');

  console.log(`glass/run.json ← ${run.length} signed receipt(s) from latest run`);
  for (const r of run) {
    console.log(`  - ${r.name}  (${r.receipt.toolName} @ ${r.receipt.timestamp})`);
  }
  console.log('\nOpen glass with a static server from repo root:');
  console.log('  python3 -m http.server 8765');
  console.log('  → http://127.0.0.1:8765/glass/');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
