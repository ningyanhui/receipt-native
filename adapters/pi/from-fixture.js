#!/usr/bin/env node
import path from 'node:path';
import { replayToolEvents, defaultFixturePath } from '../_shared/replay.js';
import { mapEvent } from './map-event.js';
import { ROOT } from '../../src/crypto/keys.js';

const fixture = process.argv[2] || defaultFixturePath('pi');
const { receipts, outDir } = await replayToolEvents({
  fixturePath: fixture,
  producer: 'pi',
  mapEvent,
});
console.log(`pi fixture → ${receipts.length} receipt(s) in ${path.relative(ROOT, outDir)}/`);
