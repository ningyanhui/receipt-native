#!/usr/bin/env node
import path from 'node:path';
import { replayToolEvents, defaultFixturePath } from '../_shared/replay.js';
import { mapEvent } from './map-event.js';
import { ROOT } from '../../src/crypto/keys.js';

const fixture = process.argv[2] || defaultFixturePath('cursor');
const { receipts, outDir } = await replayToolEvents({
  fixturePath: fixture,
  producer: 'cursor',
  mapEvent,
});
console.log(`cursor fixture → ${receipts.length} receipt(s) in ${path.relative(ROOT, outDir)}/`);
