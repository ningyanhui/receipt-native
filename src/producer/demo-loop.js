import { randomUUID } from 'node:crypto';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { digestPayload } from '../crypto/digest.js';
import { makeUnsignedReceipt } from '../schema/receipt.js';
import { keysExist, loadPrivateKey, loadPublicKeyBase64 } from '../crypto/keys.js';
import { signReceipt } from '../crypto/sign.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const SANDBOX = path.join(ROOT, 'demo-sandbox');
const RECEIPTS_DIR = path.join(ROOT, 'receipts');
const OUTBOX_DIR = path.join(SANDBOX, 'outbox');
const HELLO_FILE = path.join(SANDBOX, 'hello.txt');

/**
 * Minimal tool-loop producer.
 * Emits one signed receipt per tool call (M2). Requires keys/ from npm run keygen.
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

  await mkdir(RECEIPTS_DIR, { recursive: true });
  await mkdir(OUTBOX_DIR, { recursive: true });

  const receipts = [];

  // Tool 1: write_file
  {
    const args = {
      path: 'demo-sandbox/hello.txt',
      content: 'hello from receipt-native demo-loop\n',
    };
    const abs = HELLO_FILE;
    await writeFile(abs, args.content, 'utf8');
    const written = await readFile(abs, 'utf8');
    const result = { ok: true, bytes: Buffer.byteLength(written, 'utf8'), path: args.path };

    const receipt = await emitReceipt({
      toolName: 'write_file',
      args,
      result,
      argsPreview: { path: args.path, contentLen: args.content.length },
      resultPreview: result,
      privateKey,
      publicKeyBase64,
    });
    receipts.push(receipt);
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

    const receipt = await emitReceipt({
      toolName: 'mock_outbound',
      args,
      result,
      argsPreview: { channel: args.channel, to: args.to, bodyLen: args.body.length },
      resultPreview: result,
      privateKey,
      publicKeyBase64,
    });
    receipts.push(receipt);
  }

  return { receipts, root: ROOT };
}

async function emitReceipt({
  toolName,
  args,
  result,
  argsPreview,
  resultPreview,
  privateKey,
  publicKeyBase64,
}) {
  const id = randomUUID();
  const timestamp = new Date().toISOString();
  const argsDigest = digestPayload(args);
  const resultDigest = digestPayload(result);

  const unsigned = makeUnsignedReceipt({
    id,
    timestamp,
    toolName,
    argsDigest,
    resultDigest,
    producer: 'demo-loop',
    argsPreview,
    resultPreview,
  });

  const receipt = signReceipt(unsigned, privateKey, publicKeyBase64);

  const fileName = `${timestamp.replace(/[:.]/g, '-')}_${toolName}_${id.slice(0, 8)}.json`;
  const filePath = path.join(RECEIPTS_DIR, fileName);
  await writeFile(filePath, JSON.stringify(receipt, null, 2) + '\n', 'utf8');

  return { fileName, filePath, receipt };
}
