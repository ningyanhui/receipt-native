/**
 * Action glass — timeline over a run of signed receipts.
 * Uses ReceiptVerify from ../verify/verify-core.js (same logic as verify.html).
 */
(function () {
  'use strict';

  const RV = globalThis.ReceiptVerify;
  if (!RV) {
    document.getElementById('status').textContent =
      '缺少 ReceiptVerify（../verify/verify-core.js 未加载）。请从仓库根目录起静态服务打开 /glass/。';
    return;
  }

  const statusEl = document.getElementById('status');
  const timelineEl = document.getElementById('timeline');
  const pasteEl = document.getElementById('paste');
  const btnPasteApply = document.getElementById('btnPasteApply');

  /** @type {{receipt: object, verify: {ok:boolean, reason?:string}, fileName?: string}[]} */
  let rows = [];

  function setStatus(msg) {
    statusEl.textContent = msg;
  }

  function normalizePayload(data) {
    if (!data) throw new Error('empty payload');
    if (Array.isArray(data)) return { receipts: data, meta: {} };
    if (Array.isArray(data.receipts)) {
      return {
        receipts: data.receipts,
        meta: {
          generatedAt: data.generatedAt,
          fileNames: data.fileNames,
          source: data.source,
        },
      };
    }
    // single receipt
    if (data.toolName || data.signature || data.receiptVersion) {
      return { receipts: [data], meta: {} };
    }
    throw new Error('JSON must be run.json ({receipts:[…]}) , receipt array, or one receipt');
  }

  async function render(payload) {
    const { receipts, meta } = normalizePayload(payload);
    const sorted = [...receipts].sort((a, b) => {
      const ta = Date.parse(a.timestamp || '') || 0;
      const tb = Date.parse(b.timestamp || '') || 0;
      return ta - tb;
    });

    const nameById = {};
    if (Array.isArray(meta.fileNames) && meta.fileNames.length === receipts.length) {
      receipts.forEach((r, i) => {
        if (r && r.id) nameById[r.id] = meta.fileNames[i];
      });
    }

    rows = [];
    for (let i = 0; i < sorted.length; i++) {
      const receipt = sorted[i];
      const verify = await RV.verifyReceiptBrowser(receipt);
      const fileName = receipt.id ? nameById[receipt.id] : undefined;
      rows.push({ receipt, verify, fileName });
    }

    timelineEl.innerHTML = '';
    rows.forEach((row, idx) => {
      const li = document.createElement('li');
      li.className = 'row';
      li.dataset.idx = String(idx);

      const badgeClass = row.verify.ok ? 'green' : 'red';
      const badgeText = row.verify.ok ? 'GREEN' : 'RED';
      const argsP = RV.previewText(row.receipt.argsPreview ?? row.receipt.argsDigest, 100);
      const resP = RV.previewText(row.receipt.resultPreview ?? row.receipt.resultDigest, 100);
      const ts = row.receipt.timestamp || '—';

      li.innerHTML = `
        <div class="row-head" role="button" tabindex="0">
          <span class="badge ${badgeClass}">${badgeText}</span>
          <div class="meta">
            <div><span class="tool">${escapeHtml(row.receipt.toolName || '(no tool)')}</span>
              <span class="ts">${escapeHtml(ts)}</span></div>
            <div class="previews">
              <div><strong>args</strong> ${escapeHtml(argsP)}</div>
              <div><strong>result</strong> ${escapeHtml(resP)}</div>
            </div>
          </div>
        </div>
        <div class="row-body">
          <div class="verify-line ${badgeClass}">
            ${row.verify.ok ? 'GREEN · 验签通过' : 'RED · ' + escapeHtml(row.verify.reason || 'fail')}
          </div>
          <div class="actions">
            <button type="button" class="secondary btn-verify-page">送到 verify 页</button>
            <button type="button" class="secondary btn-copy">复制 receipt JSON</button>
          </div>
          <pre class="receipt"></pre>
        </div>
      `;
      li.querySelector('pre.receipt').textContent = JSON.stringify(row.receipt, null, 2);

      const head = li.querySelector('.row-head');
      const toggle = () => {
        const wasOpen = li.classList.contains('open');
        timelineEl.querySelectorAll('.row.open').forEach((el) => el.classList.remove('open', 'selected'));
        if (!wasOpen) {
          li.classList.add('open', 'selected');
        }
      };
      head.addEventListener('click', toggle);
      head.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });

      li.querySelector('.btn-verify-page').addEventListener('click', (e) => {
        e.stopPropagation();
        openVerify(row.receipt);
      });
      li.querySelector('.btn-copy').addEventListener('click', async (e) => {
        e.stopPropagation();
        const text = JSON.stringify(row.receipt, null, 2);
        try {
          await navigator.clipboard.writeText(text);
          setStatus('已复制 receipt JSON 到剪贴板 — 也可粘贴进 verify/verify.html');
        } catch {
          setStatus('剪贴板不可用；请从展开区手动复制 JSON');
        }
      });

      timelineEl.appendChild(li);
    });

    const green = rows.filter((r) => r.verify.ok).length;
    const red = rows.length - green;
    const when = meta.generatedAt ? ` · bundled ${meta.generatedAt}` : '';
    setStatus(
      `已加载 ${rows.length} 条回执 · 绿 ${green} / 红 ${red}${when}` +
        (meta.source ? ` · source ${meta.source}` : ''),
    );
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function toBase64Url(jsonStr) {
    const bytes = new TextEncoder().encode(jsonStr);
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function openVerify(receipt) {
    const compact = JSON.stringify(receipt);
    // Prefer query for shorter navigation; hash as fallback note in status if URL too long
    const enc = toBase64Url(compact);
    const url = `../verify/verify.html?r=${enc}`;
    if (url.length > 1800) {
      // Too long for some browsers — open blank verify and put JSON in clipboard / status
      navigator.clipboard?.writeText(JSON.stringify(receipt, null, 2)).catch(() => {});
      window.open('../verify/verify.html', '_blank', 'noopener');
      setStatus('receipt 较大：已尝试复制到剪贴板，请在 verify 页粘贴。也可点「复制 receipt JSON」。');
      return;
    }
    window.open(url, '_blank', 'noopener');
  }

  async function loadRunJson() {
    setStatus('正在 fetch ./run.json …');
    try {
      const res = await fetch('./run.json', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      await render(data);
    } catch (err) {
      setStatus(
        `加载 run.json 失败: ${err.message || err}。请先 npm run glass:bundle，并用仓库根目录静态服务打开本页；或改用「选文件 / 粘贴」。`,
      );
    }
  }

  document.getElementById('btnLoadRun').addEventListener('click', () => loadRunJson());
  document.getElementById('fileInput').addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      await render(JSON.parse(text));
    } catch (err) {
      setStatus(`读文件失败: ${err.message || err}`);
    }
  });
  document.getElementById('btnPasteToggle').addEventListener('click', () => {
    pasteEl.classList.toggle('show');
    btnPasteApply.hidden = !pasteEl.classList.contains('show');
  });
  btnPasteApply.addEventListener('click', async () => {
    try {
      await render(JSON.parse(pasteEl.value));
    } catch (err) {
      setStatus(`粘贴解析失败: ${err.message || err}`);
    }
  });

  // Auto-try run.json on load (works under http server)
  loadRunJson();
})();
