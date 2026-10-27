/**
 * Browser / static-page Ed25519 verify helpers.
 * Must match src/crypto/digest.js canonicalize + src/crypto/signing-payload.js
 * Loaded as a classic script (no module) so file:// and http both work.
 */
(function (global) {
  'use strict';

  function sortValue(value) {
    if (value === null || typeof value !== 'object') {
      if (typeof value === 'undefined') return null;
      return value;
    }
    if (Array.isArray(value)) return value.map(sortValue);
    const out = {};
    for (const key of Object.keys(value).sort()) {
      const v = value[key];
      if (typeof v === 'undefined') continue;
      out[key] = sortValue(v);
    }
    return out;
  }

  function canonicalize(value) {
    return JSON.stringify(sortValue(value));
  }

  function buildSigningMessage(receipt) {
    const { signature: _omit, ...rest } = receipt;
    return canonicalize(rest);
  }

  function b64ToBytes(b64) {
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  /**
   * @param {object} receipt
   * @returns {Promise<{ok: boolean, reason?: string}>}
   */
  async function verifyReceiptBrowser(receipt) {
    if (!receipt || typeof receipt !== 'object' || Array.isArray(receipt)) {
      return { ok: false, reason: 'receipt is not an object' };
    }
    const { signature, publicKey } = receipt;
    if (typeof signature !== 'string' || !signature) {
      return { ok: false, reason: 'missing signature' };
    }
    if (typeof publicKey !== 'string' || !publicKey) {
      return { ok: false, reason: 'missing publicKey' };
    }

    let pubBytes, sigBytes;
    try {
      pubBytes = b64ToBytes(publicKey);
      sigBytes = b64ToBytes(signature);
    } catch {
      return { ok: false, reason: 'publicKey/signature not valid base64' };
    }
    if (pubBytes.length !== 32) {
      return { ok: false, reason: `publicKey must be 32 bytes, got ${pubBytes.length}` };
    }
    if (sigBytes.length !== 64) {
      return { ok: false, reason: `signature must be 64 bytes, got ${sigBytes.length}` };
    }

    if (!global.crypto?.subtle) {
      return {
        ok: false,
        reason:
          'Web Crypto SubtleCrypto unavailable (need modern browser / https or localhost or file:// with support)',
      };
    }

    let key;
    try {
      key = await crypto.subtle.importKey(
        'raw',
        pubBytes,
        { name: 'Ed25519' },
        false,
        ['verify'],
      );
    } catch (err) {
      return { ok: false, reason: `importKey failed: ${err.message || err} (browser may lack Ed25519)` };
    }

    const message = new TextEncoder().encode(buildSigningMessage(receipt));
    let ok;
    try {
      ok = await crypto.subtle.verify({ name: 'Ed25519' }, key, sigBytes, message);
    } catch (err) {
      return { ok: false, reason: `verify threw: ${err.message || err}` };
    }
    return ok ? { ok: true } : { ok: false, reason: 'signature mismatch' };
  }

  function previewText(value, maxLen) {
    const lim = maxLen || 80;
    if (value === undefined || value === null) return '—';
    let s;
    try {
      s = typeof value === 'string' ? value : JSON.stringify(value);
    } catch {
      s = String(value);
    }
    if (s.length > lim) return s.slice(0, lim - 1) + '…';
    return s;
  }

  global.ReceiptVerify = {
    canonicalize,
    buildSigningMessage,
    verifyReceiptBrowser,
    previewText,
    b64ToBytes,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
