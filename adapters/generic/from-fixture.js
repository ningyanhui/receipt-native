#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { replayToolEvents } from '../_shared/replay.js';
import { ROOT } from '../../src/crypto/keys.js';

const fixture =
  process.argv[2] ||
  path.join(ROOT, 'fixtures/generic/sample-tool-events.json');

const { receipts, outDir } = await replayToolEvents({
  fixturePath: fixture,
  producer: 'generic',
});
console.log(
  `generic fixture → ${receipts.length} receipt(s) in ${path.relative(ROOT, outDir)}/`,
);
