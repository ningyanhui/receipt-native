import { sign as cryptoSign, verify as cryptoVerify } from 'node:crypto';
import { buildSigningBytes } from './signing-payload.js';
import { publicKeyFromRawBase64 } from './keys.js';

/**
 * Sign a receipt (mutates a copy). Sets signature + publicKey (base64).
 * Signature message = canonicalize(receipt without signature).
 *
 * @param {Record<string, unknown>} unsignedReceipt  signature may be null/absent
 * @param {import('node:crypto').KeyObject} privateKey
 * @param {string} publicKeyBase64  raw 32-byte pubkey, standard base64
 * @returns {Record<string, unknown>}
 */
export function signReceipt(unsignedReceipt, privateKey, publicKeyBase64) {
  const draft = {
    ...unsignedReceipt,
    publicKey: publicKeyBase64,
    signature: null,
  };
  // Message includes publicKey; excludes signature
  const message = buildSigningBytes(draft);
  const sig = cryptoSign(null, message, privateKey);
  return {
    ...draft,
    signature: sig.toString('base64'),
  };
}

/**
 * Verify Ed25519 signature on a receipt.
 * @param {Record<string, unknown>} receipt
 * @returns {{ ok: boolean, reason?: string }}
 */
export function verifyReceipt(receipt) {
  if (!receipt || typeof receipt !== 'object') {
    return { ok: false, reason: 'receipt is not an object' };
  }
  const { signature, publicKey } = receipt;
  if (typeof signature !== 'string' || !signature) {
    return { ok: false, reason: 'missing signature' };
  }
  if (typeof publicKey !== 'string' || !publicKey) {
    return { ok: false, reason: 'missing publicKey' };
  }

  let key;
  try {
    key = publicKeyFromRawBase64(publicKey);
  } catch (err) {
    return { ok: false, reason: `bad publicKey: ${err.message}` };
  }

  let sigBuf;
  try {
    sigBuf = Buffer.from(signature, 'base64');
  } catch {
    return { ok: false, reason: 'signature is not valid base64' };
  }
  if (sigBuf.length !== 64) {
    return { ok: false, reason: `signature must be 64 bytes, got ${sigBuf.length}` };
  }

  const message = buildSigningBytes(receipt);
  const ok = cryptoVerify(null, message, key, sigBuf);
  return ok ? { ok: true } : { ok: false, reason: 'signature mismatch' };
}
