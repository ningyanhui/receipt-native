#!/usr/bin/env node
import path from 'node:path';
import { replayToolEvents, defaultFixturePath } from '../_shared/replay.js';
import { mapEvent } from './map-event.js';
import { ROOT } from '../../src/crypto/keys.js';

const fixture = process.argv[2] || defaultFixturePath('codex');
const { receipts, outDir } = await replayToolEvents({
  fixturePath: fixture,
  producer: 'codex',
  mapEvent,
});
console.log(`codex fixture → ${receipts.length} receipt(s) in ${path.relative(ROOT, outDir)}/`);
