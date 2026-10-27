import { createHash } from 'node:crypto';

/**
 * Stable JSON canonicalization (JCS-ish subset):
 * - objects: keys sorted lexicographically, recurse
 * - arrays: preserve order, recurse
 * - no undefined; omit undefined object values
 * - numbers/booleans/strings/null as JSON
 */
export function canonicalize(value) {
  return JSON.stringify(sortValue(value));
}

function sortValue(value) {
  if (value === null || typeof value !== 'object') {
    if (typeof value === 'undefined') return null;
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(sortValue);
  }
  const out = {};
  for (const key of Object.keys(value).sort()) {
    const v = value[key];
    if (typeof v === 'undefined') continue;
    out[key] = sortValue(v);
  }
  return out;
}

/** @param {unknown} value @returns {string} sha256 hex */
export function sha256Hex(value) {
  const canonical = typeof value === 'string' ? value : canonicalize(value);
  return createHash('sha256').update(canonical, 'utf8').digest('hex');
}

/** Digest of tool args / result payloads. */
export function digestPayload(payload) {
  return sha256Hex(payload);
}
