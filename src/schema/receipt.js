/**
 * Receipt JSON shape — TRACE subset intent for M1 (unsigned).
 * Signature fields reserved for M2.
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
 * @property {string|null} [signature]  omitted/null in M1; Ed25519 in M2
 * @property {string|null} [publicKey]  omitted/null in M1
 * @property {object} [argsPreview]     optional short args for humans (not hashed as-is)
 * @property {object} [resultPreview]   optional short result for humans
 */

export const RECEIPT_VERSION = '0.1.0';
export const DEMO_MODEL_ID = 'demo-model/fixed';
export const DEMO_POLICY_BUNDLE_HASH =
  'policy-bundle:mvp-fixed:allow-write_file+mock_outbound';

/**
 * Build an unsigned receipt object (M1).
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
