#!/usr/bin/env node
/**
 * M4: draft a forwardable receipt message for IM paste — NEVER sends.
 * Writes only under delivery/outbox/. No Telegram API, no HTTP to chat hosts.
 */
import { readdir, readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const RECEIPTS_DIR = path.join(ROOT, 'receipts');
const GLASS_RUN = path.join(ROOT, 'glass', 'run.json');
const OUTBOX = path.join(ROOT, 'delivery', 'outbox');
const OUT_MD = path.join(OUTBOX, 'draft-message.md');
const OUT_JSON = path.join(OUTBOX, 'draft-receipt.json');

async function fileExists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function loadLatestSignedReceipt() {
  let files;
  try {
    files = await readdir(RECEIPTS_DIR);
  } catch {
    throw new Error(`Cannot read ${RECEIPTS_DIR}. Run: npm run keygen && npm run demo`);
  }

  const candidates = [];
  for (const name of files) {
    if (!name.endsWith('.json')) continue;
    if (name.startsWith('forged-')) continue;
    const raw = await readFile(path.join(RECEIPTS_DIR, name), 'utf8');
    let receipt;
    try {
      receipt = JSON.parse(raw);
    } catch {
      continue;
    }
    if (!receipt?.signature || !receipt?.publicKey || !receipt?.timestamp) continue;
    const t = Date.parse(receipt.timestamp);
    if (Number.isNaN(t)) continue;
    candidates.push({ name, receipt, t });
  }

  if (candidates.length === 0) {
    throw new Error(
      'No signed receipts under receipts/ (excluding forged-*).\n' +
        'Run: npm run keygen && npm run demo',
    );
  }

  candidates.sort((a, b) => b.t - a.t);
  return candidates[0];
}

async function loadGlassSummary() {
  if (!(await fileExists(GLASS_RUN))) return null;
  try {
    const raw = await readFile(GLASS_RUN, 'utf8');
    const data = JSON.parse(raw);
    if (!data?.receipts?.length) return null;
    return {
      generatedAt: data.generatedAt,
      count: data.receipts.length,
      fileNames: data.fileNames || [],
      tools: data.receipts.map((r) => r.toolName).filter(Boolean),
    };
  } catch {
    return null;
  }
}

function shortId(id) {
  if (typeof id !== 'string' || id.length < 8) return id || '(none)';
  return id.slice(0, 8);
}

function buildMessage({ receipt, fileName, glass }) {
  const tool = receipt.toolName || '(unknown)';
  const ts = receipt.timestamp || '(no timestamp)';
  const id = receipt.id || '(no id)';
  const pk = typeof receipt.publicKey === 'string' ? receipt.publicKey.slice(0, 16) + '…' : '(none)';
  const glassHint = glass
    ? `同一 run 共 ${glass.count} 张动作（${glass.tools.join(', ')}）。`
    : '（可选）先跑 npm run glass:bundle 再打开动作玻璃时间线。';

  const zh = [
    '这是一张可核验的 agent 动作回执（Receipt-Native）。',
    '',
    `工具：${tool}`,
    `时间：${ts}`,
    `回执 id：${id}`,
    `文件：receipts/${fileName}`,
    `公钥前缀：${pk}`,
    '',
    '如何核验：',
    '1. 打开仓库里的 verify/verify.html（或本地静态服务），粘贴附件 draft-receipt.json → 应为绿。',
    '2. 动作玻璃：从仓库根目录 python3 -m http.server 8765，浏览器打开 http://127.0.0.1:8765/glass/ 看时间线。',
    glassHint,
    '',
    '说明：消息通道只快递回执，不是 Gateway；本消息由 npm run deliver:draft 本地起草，未自动发出。',
  ].join('\n');

  const en = [
    'This is a verifiable agent action receipt (Receipt-Native).',
    '',
    `tool: ${tool}`,
    `time: ${ts}`,
    `receipt id: ${id}`,
    `file: receipts/${fileName}`,
    `publicKey prefix: ${pk}`,
    '',
    'How to verify:',
    '1. Open verify/verify.html (or a local static server), paste the attached draft-receipt.json → expect green.',
    '2. Action glass: from repo root run python3 -m http.server 8765, open http://127.0.0.1:8765/glass/ for the timeline.',
    glass
      ? `Same run has ${glass.count} action(s): ${glass.tools.join(', ')}.`
      : '(Optional) run npm run glass:bundle first for the glass timeline.',
    '',
    'Note: chat is delivery only — not a Gateway. This text was drafted locally by npm run deliver:draft and was NOT sent.',
  ].join('\n');

  return [
    `# Receipt-Native · IM draft (DO NOT auto-send)`,
    ``,
    `Generated locally. Copy into Telegram / any IM yourself.`,
    `Attach: \`delivery/outbox/draft-receipt.json\` (copy of receipts/${fileName}).`,
    ``,
    `---`,
    ``,
    `## 中文（可直接粘贴）`,
    ``,
    zh,
    ``,
    `---`,
    ``,
    `## English (paste-ready)`,
    ``,
    en,
    ``,
    `---`,
    ``,
    `## Meta`,
    ``,
    `- receiptId: \`${id}\` (short: ${shortId(id)})`,
    `- sourceFile: \`receipts/${fileName}\``,
    `- glass: ${glass ? `yes (${glass.count} in run.json)` : 'no run.json — run npm run glass:bundle'}`,
    `- network: **none** (this CLI never calls Telegram / chat HTTP)`,
    ``,
  ].join('\n');
}

async function main() {
  console.log('receipt-native · M4 deliver:draft');
  console.log('Chat = courier only. Drafting locally — will NOT send.\n');

  const latest = await loadLatestSignedReceipt();
  const glass = await loadGlassSummary();

  await mkdir(OUTBOX, { recursive: true });

  await writeFile(OUT_JSON, JSON.stringify(latest.receipt, null, 2) + '\n', 'utf8');
  const md = buildMessage({
    receipt: latest.receipt,
    fileName: latest.name,
    glass,
  });
  await writeFile(OUT_MD, md, 'utf8');

  console.log(`✓ wrote ${path.relative(ROOT, OUT_MD)}`);
  console.log(`✓ wrote ${path.relative(ROOT, OUT_JSON)}`);
  console.log(`  source: receipts/${latest.name}`);
  console.log(`  tool:   ${latest.receipt.toolName}`);
  console.log(`  id:     ${latest.receipt.id}`);
  if (glass) {
    console.log(`  glass:  ${glass.count} receipt(s) in glass/run.json`);
  } else {
    console.log('  glass:  (no glass/run.json — optional: npm run glass:bundle)');
  }
  console.log('\nNext: open delivery/outbox/draft-message.md, copy into IM by hand.');
  console.log('Attach draft-receipt.json if the chat supports files.');
  console.log('See delivery/README.md. No API calls were made.');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
