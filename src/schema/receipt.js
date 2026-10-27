/**
 * Receipt JSON shape — TRACE subset intent.
 * M2: Ed25519 signature over canonicalize(receipt without signature).
 *
 * Encoding:
 * - publicKey: standard base64 of raw 32-byte Ed25519 public key
 * - signature: standard base64 of raw 64-byte Ed25519 signature
 *
 * @typedef {'demo-loop' | 'pi'} ProducerId
 *
 * @typedef {Object} Receipt
 * @property {string} receiptVersion  e.g. "0.1.0"
 * @property {string} id              uuid-ish unique id
 * @property {string} timestamp       ISO-8601
 * @property {string} modelId         demo may fix a string
 * @property {string} toolName
 * @property {string} argsDigest      sha256 hex of canonical args
 * @property {string} resultDigest    sha256 hex of canonical result
 * @property {string} policyBundleHash fixed string ok for MVP
 * @property {ProducerId} producer
 * @property {string|null} [signature]  Ed25519 sig (base64); null until signed
 * @property {string|null} [publicKey]  Ed25519 pubkey (base64 raw32); set at sign time
 * @property {object} [argsPreview]     optional short args for humans (included in signed payload)
 * @property {object} [resultPreview]   optional short result for humans (included in signed payload)
 */

export const RECEIPT_VERSION = '0.1.0';
export const DEMO_MODEL_ID = 'demo-model/fixed';
export const DEMO_POLICY_BUNDLE_HASH =
  'policy-bundle:mvp-fixed:allow-write_file+mock_outbound';

/**
 * Build an unsigned receipt object (signature/publicKey null).
 * @param {object} p
 * @param {string} p.id
 * @param {string} p.timestamp
 * @param {string} p.toolName
 * @param {string} p.argsDigest
 * @param {string} p.resultDigest
 * @param {ProducerId} [p.producer]
 * @param {string} [p.modelId]
 * @param {string} [p.policyBundleHash]
 * @param {object} [p.argsPreview]
 * @param {object} [p.resultPreview]
 * @returns {Receipt}
 */
export function makeUnsignedReceipt(p) {
  return {
    receiptVersion: RECEIPT_VERSION,
    id: p.id,
    timestamp: p.timestamp,
    modelId: p.modelId ?? DEMO_MODEL_ID,
    toolName: p.toolName,
    argsDigest: p.argsDigest,
    resultDigest: p.resultDigest,
    policyBundleHash: p.policyBundleHash ?? DEMO_POLICY_BUNDLE_HASH,
    producer: p.producer ?? 'demo-loop',
    signature: null,
    publicKey: null,
    ...(p.argsPreview !== undefined ? { argsPreview: p.argsPreview } : {}),
    ...(p.resultPreview !== undefined ? { resultPreview: p.resultPreview } : {}),
  };
}
