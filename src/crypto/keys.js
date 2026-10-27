import { generateKeyPairSync, createPrivateKey, createPublicKey } from 'node:crypto';
import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '../..');
export const KEYS_DIR = path.join(ROOT, 'keys');
export const PRIVATE_PEM_PATH = path.join(KEYS_DIR, 'ed25519-private.pem');
export const PUBLIC_PEM_PATH = path.join(KEYS_DIR, 'ed25519-public.pem');
export const PUBLIC_B64_PATH = path.join(KEYS_DIR, 'ed25519-public.b64');

/** Ed25519 SPKI DER prefix (12 bytes) before the 32-byte raw public key. */
const ED25519_SPKI_PREFIX = Buffer.from('302a300506032b6570032100', 'hex');

/**
 * Generate a new Ed25519 keypair under keys/ (gitignored).
 * Overwrites existing keys.
 */
export async function generateAndWriteKeys() {
  await mkdir(KEYS_DIR, { recursive: true });
  const { publicKey, privateKey } = generateKeyPairSync('ed25519');

  const privatePem = privateKey.export({ type: 'pkcs8', format: 'pem' });
  const publicPem = publicKey.export({ type: 'spki', format: 'pem' });
  const publicRawB64 = rawPublicKeyBase64(publicKey);

  await writeFile(PRIVATE_PEM_PATH, privatePem, { mode: 0o600 });
  await writeFile(PUBLIC_PEM_PATH, publicPem, { mode: 0o644 });
  await writeFile(PUBLIC_B64_PATH, publicRawB64 + '\n', { mode: 0o644 });

  return {
    privatePemPath: PRIVATE_PEM_PATH,
    publicPemPath: PUBLIC_PEM_PATH,
    publicB64Path: PUBLIC_B64_PATH,
    publicKeyBase64: publicRawB64,
  };
}

/** @param {import('node:crypto').KeyObject} publicKey */
export function rawPublicKeyBase64(publicKey) {
  const der = publicKey.export({ type: 'spki', format: 'der' });
  if (der.length !== 44) {
    throw new Error(`unexpected Ed25519 SPKI length ${der.length}`);
  }
  if (!der.subarray(0, 12).equals(ED25519_SPKI_PREFIX)) {
    throw new Error('unexpected Ed25519 SPKI prefix');
  }
  return der.subarray(12).toString('base64');
}

/** @param {string} base64Raw32 */
export function publicKeyFromRawBase64(base64Raw32) {
  const raw = Buffer.from(base64Raw32, 'base64');
  if (raw.length !== 32) {
    throw new Error(`Ed25519 public key must be 32 raw bytes, got ${raw.length}`);
  }
  const der = Buffer.concat([ED25519_SPKI_PREFIX, raw]);
  return createPublicKey({ key: der, format: 'der', type: 'spki' });
}

export async function keysExist() {
  try {
    await access(PRIVATE_PEM_PATH);
    await access(PUBLIC_PEM_PATH);
    return true;
  } catch {
    return false;
  }
}

export async function loadPrivateKey() {
  const pem = await readFile(PRIVATE_PEM_PATH, 'utf8');
  return createPrivateKey(pem);
}

export async function loadPublicKey() {
  const pem = await readFile(PUBLIC_PEM_PATH, 'utf8');
  return createPublicKey(pem);
}

/** Raw 32-byte public key as standard base64 (not base64url). */
export async function loadPublicKeyBase64() {
  try {
    const fromFile = (await readFile(PUBLIC_B64_PATH, 'utf8')).trim();
    if (fromFile) return fromFile;
  } catch {
    /* fall through */
  }
  const pub = await loadPublicKey();
  return rawPublicKeyBase64(pub);
}
