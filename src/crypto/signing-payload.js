import { canonicalize } from './digest.js';

/**
 * Signing covers every receipt field except `signature`.
 * Same canonicalize() as digests — no separate "green-check" path.
 *
 * @param {Record<string, unknown>} receipt
 * @returns {string} canonical JSON string (UTF-8 message to sign/verify)
 */
export function buildSigningMessage(receipt) {
  if (!receipt || typeof receipt !== 'object' || Array.isArray(receipt)) {
    throw new TypeError('receipt must be an object');
  }
  const { signature: _omit, ...rest } = receipt;
  return canonicalize(rest);
}

/**
 * @param {Record<string, unknown>} receipt
 * @returns {Buffer}
 */
export function buildSigningBytes(receipt) {
  return Buffer.from(buildSigningMessage(receipt), 'utf8');
}
