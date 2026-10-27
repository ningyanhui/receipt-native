import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { emitReceipt } from './emit-receipt.js';
import { keysExist, loadPrivateKey, loadPublicKeyBase64, ROOT } from '../crypto/keys.js';

const SANDBOX = path.join(ROOT, 'demo-sandbox');
const OUTBOX_DIR = path.join(SANDBOX, 'outbox');
const HELLO_FILE = path.join(SANDBOX, 'hello.txt');

/**
 * Minimal tool-loop producer.
 * Emits one signed receipt per tool call via the unified emitReceipt API.
 */
export async function runDemoLoop() {
  if (!(await keysExist())) {
    throw new Error(
      'Missing Ed25519 keys. Run: npm run keygen\n' +
        `Expected private key under keys/ed25519-private.pem`,
    );
  }
  const privateKey = await loadPrivateKey();
  const publicKeyBase64 = await loadPublicKeyBase64();

  await mkdir(OUTBOX_DIR, { recursive: true });

  const receipts = [];

  // Tool 1: write_file
  {
    const args = {
      path: 'demo-sandbox/hello.txt',
      content: 'hello from receipt-native demo-loop\n',
    };
    await writeFile(HELLO_FILE, args.content, 'utf8');
    const written = await readFile(HELLO_FILE, 'utf8');
    const result = { ok: true, bytes: Buffer.byteLength(written, 'utf8'), path: args.path };

    const emitted = await emitReceipt({
      toolName: 'write_file',
      args,
      result,
      producer: 'demo-loop',
      argsPreview: { path: args.path, contentLen: args.content.length },
      resultPreview: result,
      privateKey,
      publicKeyBase64,
    });
    receipts.push(emitted);
  }

  // Tool 2: mock_outbound (local outbox only — never real network)
  {
    const args = {
      channel: 'mock',
      to: 'demo-recipient@local',
      body: 'Receipt-Native demo: task complete. See attached receipt ids.',
    };
    const outboxPath = path.join(OUTBOX_DIR, `${Date.now()}-outbound.json`);
    const envelope = {
      ...args,
      writtenAt: new Date().toISOString(),
      note: 'LOCAL ONLY — not sent over the network',
    };
    await writeFile(outboxPath, JSON.stringify(envelope, null, 2), 'utf8');
    const result = {
      ok: true,
      outboxFile: path.relative(ROOT, outboxPath),
      delivered: false,
      mode: 'local-outbox',
    };

    const emitted = await emitReceipt({
      toolName: 'mock_outbound',
      args,
      result,
      producer: 'demo-loop',
      argsPreview: { channel: args.channel, to: args.to, bodyLen: args.body.length },
      resultPreview: result,
      privateKey,
      publicKeyBase64,
    });
    receipts.push(emitted);
  }

  return { receipts, root: ROOT };
}
