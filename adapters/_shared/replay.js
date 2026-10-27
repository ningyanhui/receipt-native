import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { emitReceipt } from '../../src/producer/emit-receipt.js';
import { parseToolEventFile, normalizeToolEvent } from './tool-event.js';
import {
  keysExist,
  loadPrivateKey,
  loadPublicKeyBase64,
  ROOT,
} from '../../src/crypto/keys.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const FIXTURES_ROOT = path.join(ROOT, 'fixtures');

/**
 * Replay a generic tool-event file into signed receipts.
 *
 * @param {object} opts
 * @param {string} opts.fixturePath  absolute or repo-relative path to events file
 * @param {string} opts.producer     receipt.producer (e.g. 'generic' | 'pi' | ...)
 * @param {string} [opts.outDir]
 * @param {string} [opts.filePrefix]
 * @param {(ev: object) => object} [opts.mapEvent]  optional harness → generic mapper
 * @param {import('node:crypto').KeyObject} [opts.privateKey]
 * @param {string} [opts.publicKeyBase64]
 * @param {string} [opts.modelId]
 * @param {string} [opts.policyBundleHash]
 */
export async function replayToolEvents(opts) {
  const {
    fixturePath,
    producer,
    outDir,
    filePrefix = producer,
    mapEvent,
    modelId,
    policyBundleHash,
  } = opts;

  let privateKey = opts.privateKey;
  let publicKeyBase64 = opts.publicKeyBase64;
  if (!privateKey || !publicKeyBase64) {
    if (!(await keysExist())) {
      throw new Error('Missing keys/. Run: npm run keygen');
    }
    privateKey = privateKey ?? (await loadPrivateKey());
    publicKeyBase64 = publicKeyBase64 ?? (await loadPublicKeyBase64());
  }

  const abs = path.isAbsolute(fixturePath)
    ? fixturePath
    : path.join(ROOT, fixturePath);
  const raw = await readFile(abs, 'utf8');
  const { events, defaults } = parseToolEventFile(raw);
  const mergedDefaults = {
    ...defaults,
    ...(modelId ? { modelId } : {}),
    ...(policyBundleHash ? { policyBundleHash } : {}),
  };

  const dest =
    outDir ?? path.join(ROOT, 'receipts', 'adapters', producer);
  await mkdir(dest, { recursive: true });

  const receipts = [];
  for (const rawEv of events) {
    const shaped = mapEvent ? mapEvent(rawEv) : rawEv;
    const norm = normalizeToolEvent(shaped, mergedDefaults);
    const emitted = await emitReceipt({
      ...norm,
      producer,
      privateKey,
      publicKeyBase64,
      outDir: dest,
      filePrefix,
    });
    receipts.push(emitted);
  }
  return { receipts, outDir: dest, fixturePath: abs, producer };
}

export function defaultFixturePath(harness) {
  return path.join(FIXTURES_ROOT, harness, 'sample-tool-events.json');
}
