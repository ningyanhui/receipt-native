import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { digestPayload } from '../crypto/digest.js';
import { makeUnsignedReceipt } from '../schema/receipt.js';
import { signReceipt } from '../crypto/sign.js';
import {
  keysExist,
  loadPrivateKey,
  loadPublicKeyBase64,
  ROOT,
} from '../crypto/keys.js';

/**
 * @typedef {import('../schema/receipt.js').ProducerId} ProducerId
 * @typedef {import('../schema/receipt.js').Receipt} Receipt
 *
 * @typedef {Object} EmitReceiptInput
 * @property {string} toolName
 * @property {unknown} args
 * @property {unknown} result
 * @property {string} [modelId]
 * @property {ProducerId} producer
 * @property {string} [policyBundleHash]
 * @property {object} [argsPreview]
 * @property {object} [resultPreview]
 * @property {string} [id]           fixed id (fixtures / golden)
 * @property {string} [timestamp]    fixed ISO timestamp (fixtures / golden)
 * @property {import('node:crypto').KeyObject} [privateKey]
 * @property {string} [publicKeyBase64]
 * @property {string|false} [outDir] directory to write JSON; false = no write;
 *                                   undefined = <repo>/receipts
 * @property {string} [filePrefix]   optional filename prefix (e.g. harness name)
 */

/**
 * Unified producer API: digest args/result → unsigned receipt → Ed25519 sign.
 * Adapters and demo-loop both call this; verify/glass stay harness-agnostic.
 *
 * @param {EmitReceiptInput} input
 * @returns {Promise<{ receipt: Receipt, fileName?: string, filePath?: string }>}
 */
export async function emitReceipt(input) {
  const {
    toolName,
    args,
    result,
    producer,
    modelId,
    policyBundleHash,
    argsPreview,
    resultPreview,
    id = randomUUID(),
    timestamp = new Date().toISOString(),
    outDir,
    filePrefix,
  } = input;

  if (!toolName || typeof toolName !== 'string') {
    throw new TypeError('emitReceipt: toolName is required');
  }
  if (!producer || typeof producer !== 'string') {
    throw new TypeError('emitReceipt: producer is required');
  }

  let privateKey = input.privateKey;
  let publicKeyBase64 = input.publicKeyBase64;
  if (!privateKey || !publicKeyBase64) {
    if (!(await keysExist())) {
      throw new Error(
        'Missing Ed25519 keys. Run: npm run keygen\n' +
          'Or pass privateKey + publicKeyBase64 to emitReceipt.',
      );
    }
    privateKey = privateKey ?? (await loadPrivateKey());
    publicKeyBase64 = publicKeyBase64 ?? (await loadPublicKeyBase64());
  }

  const argsDigest = digestPayload(args);
  const resultDigest = digestPayload(result);

  const unsigned = makeUnsignedReceipt({
    id,
    timestamp,
    toolName,
    argsDigest,
    resultDigest,
    producer,
    modelId,
    policyBundleHash,
    argsPreview,
    resultPreview,
  });

  const receipt = /** @type {Receipt} */ (
    signReceipt(unsigned, privateKey, publicKeyBase64)
  );

  if (outDir === false) {
    return { receipt };
  }

  const dir = outDir ?? path.join(ROOT, 'receipts');
  await mkdir(dir, { recursive: true });
  const prefix = filePrefix ? `${filePrefix}_` : '';
  const fileName = `${prefix}${timestamp.replace(/[:.]/g, '-')}_${toolName}_${id.slice(0, 8)}.json`;
  const filePath = path.join(dir, fileName);
  await writeFile(filePath, JSON.stringify(receipt, null, 2) + '\n', 'utf8');

  return { receipt, fileName, filePath };
}

export default emitReceipt;
