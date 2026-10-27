import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { createPrivateKey } from 'node:crypto';
import { canonicalize, digestPayload } from '../src/crypto/digest.js';
import { verifyReceipt, signReceipt } from '../src/crypto/sign.js';
import { makeUnsignedReceipt } from '../src/schema/receipt.js';
import { emitReceipt } from '../src/producer/emit-receipt.js';
import { replayToolEvents } from '../adapters/_shared/replay.js';
import { parseToolEventFile, normalizeToolEvent } from '../adapters/_shared/tool-event.js';
import { ROOT } from '../src/crypto/keys.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const golden = JSON.parse(
  readFileSync(path.join(ROOT, 'fixtures/golden/signed-receipt.json'), 'utf8'),
);
const forged = JSON.parse(
  readFileSync(path.join(ROOT, 'fixtures/golden/forged-receipt.json'), 'utf8'),
);
const testPriv = createPrivateKey(
  readFileSync(path.join(ROOT, 'fixtures/test-keys/ed25519-private.pem')),
);
const testPubB64 = readFileSync(
  path.join(ROOT, 'fixtures/test-keys/ed25519-public.b64'),
  'utf8',
).trim();

describe('digest', () => {
  it('is stable under key reorder', () => {
    assert.equal(digestPayload({ a: 1, b: 'x' }), digestPayload({ b: 'x', a: 1 }));
  });
  it('canonicalize sorts object keys', () => {
    assert.equal(canonicalize({ b: 1, a: 2 }), '{"a":2,"b":1}');
  });
});

describe('sign / verify', () => {
  it('golden signed receipt verifies green', () => {
    const v = verifyReceipt(golden);
    assert.equal(v.ok, true, v.reason);
  });
  it('forged receipt verifies red', () => {
    const v = verifyReceipt(forged);
    assert.equal(v.ok, false);
    assert.match(v.reason || '', /mismatch/i);
  });
  it('tampering argsDigest fails verify', () => {
    const bad = { ...golden, argsDigest: '0'.repeat(64) };
    assert.equal(verifyReceipt(bad).ok, false);
  });
});

describe('emitReceipt', () => {
  it('produces a verifiable receipt without writing when outDir=false', async () => {
    const { receipt, fileName } = await emitReceipt({
      toolName: 'shell',
      args: { command: 'true' },
      result: { exitCode: 0 },
      producer: 'generic',
      privateKey: testPriv,
      publicKeyBase64: testPubB64,
      outDir: false,
      id: 'test-emit-1',
      timestamp: '2026-10-27T12:00:00.000Z',
    });
    assert.equal(fileName, undefined);
    assert.equal(receipt.producer, 'generic');
    assert.equal(verifyReceipt(receipt).ok, true);
    assert.equal(receipt.argsDigest, digestPayload({ command: 'true' }));
  });
});

describe('generic tool-event parse', () => {
  it('parses array and normalizes', () => {
    const { events } = parseToolEventFile(
      JSON.stringify([{ toolName: 't', args: {}, result: { ok: true } }]),
    );
    const n = normalizeToolEvent(events[0]);
    assert.equal(n.toolName, 't');
  });
  it('parses JSONL', () => {
    const { events } = parseToolEventFile(
      '{"toolName":"a","args":1,"result":2}\n{"toolName":"b","args":3,"result":4}\n',
    );
    assert.equal(events.length, 2);
  });
});

describe('adapter fixture replay', () => {
  it('generic fixture yields green receipts', async () => {
    const { receipts } = await replayToolEvents({
      fixturePath: path.join(ROOT, 'fixtures/generic/sample-tool-events.json'),
      producer: 'generic',
      privateKey: testPriv,
      publicKeyBase64: testPubB64,
      outDir: path.join(ROOT, 'receipts', 'test-out', 'generic'),
    });
    assert.ok(receipts.length >= 2);
    for (const { receipt } of receipts) {
      assert.equal(receipt.producer, 'generic');
      assert.equal(verifyReceipt(receipt).ok, true);
    }
  });
  it('pi fixture via mapEvent yields green receipts', async () => {
    const { mapEvent } = await import('../adapters/pi/map-event.js');
    const { receipts } = await replayToolEvents({
      fixturePath: path.join(ROOT, 'fixtures/pi/sample-tool-events.json'),
      producer: 'pi',
      mapEvent,
      privateKey: testPriv,
      publicKeyBase64: testPubB64,
      outDir: path.join(ROOT, 'receipts', 'test-out', 'pi'),
    });
    assert.ok(receipts.length >= 1);
    assert.equal(verifyReceipt(receipts[0].receipt).ok, true);
    assert.equal(receipts[0].receipt.producer, 'pi');
  });
});

describe('adapter watch — live JSONL path', () => {
  it('processes JSONL lines via the same emitReceipt pipeline', async () => {
    // Simulate the core of adapter-watch: parse a JSONL line → normalise → emitReceipt → verify
    const lines = [
      '{"toolName":"shell","args":{"command":"echo hi"},"result":{"exitCode":0},"timestamp":"2026-10-27T10:00:00.000Z"}',
      '{"toolName":"write_file","args":{"path":"out.txt","content":"ok"},"result":{"ok":true},"timestamp":"2026-10-27T10:00:01.000Z"}',
    ];

    const outDir = path.join(ROOT, 'receipts', 'test-out', 'watch-generic');
    mkdirSync(outDir, { recursive: true });

    for (const line of lines) {
      const rawEv = JSON.parse(line);
      const norm = normalizeToolEvent(rawEv);
      const emitted = await emitReceipt({
        ...norm,
        producer: 'generic',
        privateKey: testPriv,
        publicKeyBase64: testPubB64,
        outDir,
      });
      assert.equal(verifyReceipt(emitted.receipt).ok, true, `watch line "${norm.toolName}" should verify green`);
    }
  });

  it('parseToolEventFile handles JSONL correctly', () => {
    const jsonl = [
      '{"toolName":"a","args":{},"result":{"ok":true}}',
      '{"toolName":"b","args":{"x":1},"result":{"ok":false}}',
    ].join('\n') + '\n';

    const { events } = parseToolEventFile(jsonl);
    assert.equal(events.length, 2);
    assert.equal(events[0].toolName, 'a');
    assert.equal(events[1].toolName, 'b');
  });
});
