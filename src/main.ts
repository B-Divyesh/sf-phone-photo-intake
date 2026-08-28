import './style.css';
import heroUrl from './assets/hero-blueprint.webp';
import { hashBlob, hashText } from './hash';
import { checkoutUrl, captureReturnedLicense, hasCachedUnlock, saveLicense, storedLicense, verifyLicense } from './license';
import { receiptCsv } from './receipt';
import { clearBatch, listReceipts, listStoredFiles } from './storage';
import { TransferSession } from './transfer';
import { CHUNK_SIZE, type BatchManifest, type IntakeFile, type IntakeReceipt } from './types';

const app = document.querySelector<HTMLDivElement>('#app')!;
const esc = (value: string) => value.replace(/[&<>'"]/g, (char) => ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' })[char]!);
const formatBytes = (bytes: number) => new Intl.NumberFormat(undefined, { style: 'unit', unit: bytes >= 1_000_000 ? 'megabyte' : 'kilobyte', maximumFractionDigits: 1 }).format(bytes / (bytes >= 1_000_000 ? 1_000_000 : 1_000));
const shortDate = (value: string) => new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

captureReturnedLicense();

function legalPage(kind: 'privacy' | 'terms'): void {
  const privacy = kind === 'privacy';
  app.innerHTML = `
    <header class="site-header"><a class="wordmark" href="/"><img src="/icons/icon.svg" width="36" height="36" alt="">Photo Intake Receipt</a></header>
    <main id="main" class="legal sheet">
      <p class="eyebrow">Document ${privacy ? 'P-01' : 'T-01'} · effective 28 August 2026</p>
      <h1>${privacy ? 'Privacy, drawn plainly' : 'Terms of use'}</h1>
      ${privacy ? `<p class="lede">Your photos, filenames, hashes, pairing codes, and receipts stay on the devices participating in a transfer. We do not run a photo server, account system, or analytics tracker.</p>
      <h2>Data on your device</h2><p>The app stores resumable chunks, completed files, manifests, receipts, and an optional license token in browser storage. You can export receipts or clear a received batch at any time.</p>
      <h2>Network use</h2><p>Transfers use an encrypted WebRTC data channel. Pairing is manual and configured without public STUN or TURN servers, so media is not relayed through Sociobot. License verification contacts <code>api.sociobot.in</code> at most once per day when a license is installed.</p>
      <h2>Payments</h2><p>Sociobot/Dodo is the merchant of record and receives the purchase details needed to issue and manage a license. This app does not receive card details.</p>
      <h2>Your control</h2><p>Removing this site's browser data deletes its local records. Download received files before clearing them. Questions: <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p>` : `<p class="lede">Photo Intake Receipt helps compare a selected source batch with bytes received by another device. Use the receipt as evidence, not as a substitute for checking that you selected everything intended.</p>
      <h2>License</h2><p>The free tier supports batches of up to 25 files. Intake Unlimited is a one-time ₹499 purchase for unlimited batch sizes and the same-device license. Accessibility, receipt export, and safety checks remain free. Sociobot/Dodo is the merchant of record; refunds are handled there and revoke the license.</p>
      <h2>Safe deletion</h2><p>“Safe to delete” applies only to the named files in the receipt and only after destination hashes match. It does not assert that every photo on a phone was selected or that a downloaded browser file remains stored forever. Keep another copy of important photos.</p>
      <h2>Availability</h2><p>The software is provided “as is”, without a guarantee that every browser, network, or storage condition is supported. You remain responsible for backups and deletion decisions.</p>
      <h2>Acceptable use</h2><p>Use the product only for files you are permitted to transfer. Do not attempt to disrupt the billing or licensing service.</p>`}
      <p><a class="button secondary" href="/">Return to the drafting desk</a></p>
    </main>${footer()}`;
}

function footer(): string {
  return `<footer><p>Local-first utility by Sociobot. Hero artwork generated for this product with the factory image model.</p><nav aria-label="Legal"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav></footer>`;
}

const pathname = location.pathname.replace(/\/+$/, '');
if (pathname === '/privacy' || pathname === '/terms') {
  legalPage(pathname.slice(1) as 'privacy' | 'terms');
} else {
  renderApp();
}

function renderApp(): void {
  const initiallyUnlocked = hasCachedUnlock();
  app.innerHTML = `
    <header class="site-header">
      <a class="wordmark" href="#top"><img src="/icons/icon.svg" width="36" height="36" alt="">Photo Intake Receipt</a>
      <nav aria-label="Primary"><a href="#workbench">Transfer</a><a href="#receipts">Receipts</a><a href="#unlock">Unlock</a></nav>
    </header>
    <main id="main">
      <section class="hero" id="top">
        <div class="hero-copy"><p class="eyebrow">Local transfer instrument · sheet 01</p><h1>Know the photos arrived.<br><em>Then</em> delete.</h1><p class="lede">Move a selected phone batch over an encrypted local connection. Interrupted chunks resume. Every byte is hashed into a receipt you can keep.</p><div class="hero-actions"><a class="button primary" href="#workbench">Start an intake</a><span class="privacy-mark">◉ No cloud upload</span></div></div>
        <figure class="hero-art"><img src="${heroUrl}" width="960" height="640" alt="Blueprint-style illustration of photo sheets moving from a phone to a computer and receiving verification ticks" fetchpriority="high" decoding="async"><figcaption>Selected → transferred → checked</figcaption></figure>
      </section>
      <section class="proof-strip" aria-label="How verification works"><span><b>01</b> Select</span><span><b>02</b> Pair locally</span><span><b>03</b> Resume chunks</span><span><b>04</b> Compare SHA-256</span></section>
      <div id="offline-banner" class="offline-banner" role="status" hidden><b>Offline mode.</b> Saved receipts and local pairing still work. License checks will retry later.</div>
      <section id="workbench" class="workbench ruled-section" aria-labelledby="workbench-title">
        <div class="section-heading"><p class="eyebrow">Working drawing · A-01</p><h2 id="workbench-title">Start on both devices</h2><p>Open this app on the phone and PC. Pick the role each device plays; pairing codes are exchanged directly by you.</p></div>
        <div class="role-switch" role="group" aria-label="Choose this device's role"><button class="role active" data-role="send" aria-pressed="true"><span aria-hidden="true">↗</span><b>Send photos</b><small>Usually the phone</small></button><button class="role" data-role="receive" aria-pressed="false"><span aria-hidden="true">↙</span><b>Receive photos</b><small>Usually the PC</small></button></div>
        <div class="intake-sheet sheet">
          <div class="sheet-id"><span id="mode-label">SOURCE DEVICE</span><span>LAN / DTLS / SHA-256</span></div>
          <section id="sender-panel" aria-labelledby="sender-title">
            <div class="step"><span class="step-number">1</span><div><h3 id="sender-title">Select the exact batch</h3><p>The receipt can only cover what you choose here. Files are read unchanged, preserving EXIF and original bytes.</p></div></div>
            <label class="file-pick"><span>Choose photos and videos</span><input id="file-input" type="file" accept="image/*,video/*" multiple><small id="file-limit">Free batches include up to 25 files.</small></label>
            <div id="selection" class="selection empty"><p>No files selected yet.</p></div>
            <button id="prepare" class="button primary" disabled>Hash batch and create sender code</button>
            <div id="sender-codes" class="pairing-block" hidden>
              <div class="step"><span class="step-number">2</span><div><h3>Move the sender code to the PC</h3><p>Paste it into “Receive photos” there. Pairing codes contain connection details, never photo bytes.</p></div></div>
              <label for="offer-code">Sender code</label><textarea id="offer-code" readonly rows="4"></textarea><button class="button secondary copy" data-copy="offer-code">Copy sender code</button>
              <div class="step"><span class="step-number">3</span><div><h3>Bring back the receiver code</h3></div></div>
              <label for="answer-input">Receiver code</label><textarea id="answer-input" rows="4" spellcheck="false"></textarea><button id="apply-answer" class="button primary">Connect and send missing chunks</button>
            </div>
          </section>
          <section id="receiver-panel" aria-labelledby="receiver-title" hidden>
            <div class="step"><span class="step-number">1</span><div><h3 id="receiver-title">Paste the sender code</h3><p>The files stay in this browser’s local storage until you download or clear them.</p></div></div>
            <label for="offer-input">Sender code</label><textarea id="offer-input" rows="5" spellcheck="false"></textarea><button id="make-answer" class="button primary">Create receiver code</button>
            <div id="receiver-code-block" class="pairing-block" hidden><div class="step"><span class="step-number">2</span><div><h3>Return this code to the phone</h3></div></div><label for="answer-code">Receiver code</label><textarea id="answer-code" readonly rows="4"></textarea><button class="button secondary copy" data-copy="answer-code">Copy receiver code</button></div>
          </section>
          <div class="transfer-status" role="status" aria-live="polite"><div><span class="status-dot" aria-hidden="true"></span><span id="status-text">Waiting to begin.</span></div><progress id="progress" max="100" value="0"><span>0%</span></progress><span id="progress-label">0%</span></div>
        </div>
        <div id="receipt-output" aria-live="polite"></div>
      </section>
      <section id="receipts" class="ruled-section history" aria-labelledby="receipts-title"><div class="section-heading"><p class="eyebrow">Archive drawer</p><h2 id="receipts-title">Recent receipts</h2><p>Stored only in this browser. JSON and CSV exports are always available.</p></div><div id="receipt-list" class="receipt-list"><p>Opening the local archive…</p></div></section>
      <section id="unlock" class="pricing ruled-section" aria-labelledby="unlock-title"><div><p class="eyebrow">Permanent tool license</p><h2 id="unlock-title">Intake Unlimited</h2><p>Remove the 25-file batch limit for ₹499 once. Verification, safe-delete checks, and exports are free for everyone.</p><ul><li>Unlimited files per selected batch</li><li>One-time purchase, no storage subscription</li><li>Use the license on another device</li></ul></div><div class="license-box"><p class="price">₹499 <small>one time</small></p><a class="button primary" href="${checkoutUrl}">Buy Intake Unlimited</a><details><summary>Have a license? Restore it</summary><label for="license-input">License token</label><input id="license-input" value="${esc(storedLicense())}" autocomplete="off"><button id="verify-license" class="button secondary">Verify license</button></details><p id="license-status" class="quiet" role="status">${initiallyUnlocked ? '✓ Unlimited is unlocked from your last verified license.' : 'Free mode · 25 files per batch'}</p><p class="fine">Checkout and refunds are handled by Sociobot/Dodo, the merchant of record. <a href="/terms/">Terms</a></p></div></section>
    </main>${footer()}
    <div id="update-toast" class="toast" hidden><span>An app update is ready.</span><button id="reload-update">Reload</button></div>`;

  bindApp(initiallyUnlocked);
}

function bindApp(initialUnlock: boolean): void {
  let unlocked = initialUnlock;
  let selectedFiles: File[] = [];
  let sourceFiles = new Map<string, File>();
  const $ = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector)!;
  const status = $('#status-text');
  const progress = $('#progress') as HTMLProgressElement;
  const progressLabel = $('#progress-label');
  const setStatus = (text: string, error = false) => { status.textContent = text; status.parentElement?.classList.toggle('error', error); };
  const setProgress = (done: number, total: number, label: string) => {
    const percent = total ? Math.round(done / total * 100) : 0;
    progress.value = percent; progressLabel.textContent = `${percent}% · ${label}`;
  };
  const callbacks = {
    onState: (value: string) => setStatus(value),
    onProgress: setProgress,
    onManifest: (manifest: BatchManifest) => setStatus(`Incoming: ${manifest.files.length} files, ${formatBytes(manifest.totalBytes)}.`),
    onReceipt: (receipt: IntakeReceipt) => { renderReceipt(receipt, $('#receipt-output')); void refreshReceipts(); },
    onError: (message: string) => setStatus(message, true),
  };
  let session = new TransferSession(callbacks);

  document.querySelectorAll<HTMLButtonElement>('.role').forEach((button) => button.addEventListener('click', () => {
    const role = button.dataset.role!;
    document.querySelectorAll<HTMLButtonElement>('.role').forEach((item) => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
    $('#sender-panel').hidden = role !== 'send'; $('#receiver-panel').hidden = role !== 'receive';
    $('#mode-label').textContent = role === 'send' ? 'SOURCE DEVICE' : 'DESTINATION DEVICE';
    session.close(); session = new TransferSession(callbacks); setStatus('Waiting to begin.'); setProgress(0, 100, 'ready');
  }));

  const input = $('#file-input') as HTMLInputElement;
  input.addEventListener('change', () => {
    selectedFiles = Array.from(input.files ?? []);
    const limit = unlocked ? Infinity : 25;
    const over = selectedFiles.length > limit;
    ($('#prepare') as HTMLButtonElement).disabled = selectedFiles.length === 0 || over;
    ($('#prepare') as HTMLButtonElement).textContent = 'Hash batch and create sender code';
    const selection = $('#selection');
    if (!selectedFiles.length) { selection.className = 'selection empty'; selection.innerHTML = '<p>No files selected yet.</p>'; return; }
    selection.className = `selection${over ? ' selection-error' : ''}`;
    selection.innerHTML = `<div><b>${selectedFiles.length} file${selectedFiles.length === 1 ? '' : 's'}</b><span>${formatBytes(selectedFiles.reduce((sum, file) => sum + file.size, 0))}</span></div><ol>${selectedFiles.slice(0, 5).map((file) => `<li><span>${esc(file.name)}</span><small>${formatBytes(file.size)}</small></li>`).join('')}${selectedFiles.length > 5 ? `<li class="more">+ ${selectedFiles.length - 5} more</li>` : ''}</ol>${over ? '<p class="field-error" role="alert">Free batches can contain 25 files. Choose fewer files or unlock unlimited batches below.</p>' : ''}`;
  });

  $('#prepare').addEventListener('click', async () => {
    try {
      ($('#prepare') as HTMLButtonElement).disabled = true;
      const manifest = await makeManifest(selectedFiles, (done, total, name) => { setStatus(`Hashing ${name}…`); setProgress(done, total, 'measuring source bytes'); });
      sourceFiles = new Map(manifest.files.map((meta, index) => [meta.id, selectedFiles[index]]));
      const offer = await session.makeOffer(manifest, sourceFiles);
      ($('#offer-code') as HTMLTextAreaElement).value = offer;
      $('#sender-codes').hidden = false;
      const prepare = $('#prepare') as HTMLButtonElement;
      prepare.disabled = false;
      prepare.textContent = 'Create fresh sender code to resume';
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Could not prepare the batch.', true); ($('#prepare') as HTMLButtonElement).disabled = false; }
  });

  $('#apply-answer').addEventListener('click', async () => {
    try { await session.applyAnswer(($('#answer-input') as HTMLTextAreaElement).value); }
    catch (error) { setStatus(error instanceof Error ? error.message : 'Could not use that receiver code.', true); }
  });

  $('#make-answer').addEventListener('click', async () => {
    try {
      setStatus('Reading sender code…');
      const answer = await session.acceptOffer(($('#offer-input') as HTMLTextAreaElement).value);
      ($('#answer-code') as HTMLTextAreaElement).value = answer;
      $('#receiver-code-block').hidden = false;
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Could not use that sender code.', true); }
  });

  document.querySelectorAll<HTMLButtonElement>('.copy').forEach((button) => button.addEventListener('click', async () => {
    const field = document.getElementById(button.dataset.copy!) as HTMLTextAreaElement;
    try { await navigator.clipboard.writeText(field.value); button.textContent = 'Copied'; setTimeout(() => { button.textContent = button.dataset.copy === 'offer-code' ? 'Copy sender code' : 'Copy receiver code'; }, 1800); }
    catch { field.select(); setStatus('Clipboard access was blocked. The code is selected; use Copy from your device.'); }
  }));

  $('#verify-license').addEventListener('click', async () => {
    saveLicense(($('#license-input') as HTMLInputElement).value);
    $('#license-status').textContent = 'Checking license…';
    const result = await verifyLicense(true); unlocked = result.valid;
    $('#license-status').textContent = result.valid ? '✓ Unlimited is unlocked on this device.' : result.reason === 'offline' ? 'Could not reach license verification. Your last verified access is unchanged.' : 'License not active. Check the complete token or buy a license.';
    $('#file-limit').textContent = unlocked ? 'Unlimited batch size is active.' : 'Free batches include up to 25 files.';
    input.dispatchEvent(new Event('change'));
  });

  window.addEventListener('online', updateOnlineState); window.addEventListener('offline', updateOnlineState); updateOnlineState();
  void refreshReceipts();
  void verifyLicense().then((result) => {
    unlocked = result.valid;
    $('#license-status').textContent = result.valid ? '✓ Unlimited is unlocked on this device.' : result.reason === 'offline' ? 'Offline. Using the last locally verified license state.' : 'Free mode · 25 files per batch';
    $('#file-limit').textContent = unlocked ? 'Unlimited batch size is active.' : 'Free batches include up to 25 files.';
  });
}

async function makeManifest(files: File[], onProgress: (done: number, total: number, name: string) => void): Promise<BatchManifest> {
  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  let completedBytes = 0;
  const metas: IntakeFile[] = [];
  for (const [index, file] of files.entries()) {
    const sha256 = await hashBlob(file, (ratio) => onProgress(completedBytes + file.size * ratio, totalBytes, file.name));
    const id = (await hashText(`${index}\0${file.name}\0${file.size}\0${file.lastModified}\0${sha256}`)).slice(0, 20);
    metas.push({ id, name: file.name, type: file.type || 'application/octet-stream', size: file.size, modified: file.lastModified, relativePath: file.webkitRelativePath || file.name, sha256, chunks: Math.ceil(file.size / CHUNK_SIZE) });
    completedBytes += file.size;
  }
  const fingerprint = metas.map((file) => `${file.id}:${file.sha256}`).join('|');
  return { id: `batch-${(await hashText(fingerprint)).slice(0, 24)}`, createdAt: new Date().toISOString(), sourceLabel: navigator.userAgent.includes('Android') ? 'Android device' : 'Browser device', files: metas, totalBytes };
}

function renderReceipt(receipt: IntakeReceipt, target: HTMLElement): void {
  const missing = receipt.files.filter((file) => file.status !== 'verified');
  target.innerHTML = `<article class="receipt ${receipt.safeToDelete ? 'receipt-safe' : 'receipt-hold'}">
    <div class="receipt-head"><div><p class="eyebrow">Intake receipt · ${esc(receipt.id.slice(-8))}</p><h2>${receipt.safeToDelete ? 'Safe to delete this selected batch' : 'Keep the phone originals'}</h2><p>${esc(receipt.scopeNote)}</p></div><div class="stamp">${receipt.safeToDelete ? 'VERIFIED' : 'HOLD'}</div></div>
    <dl class="receipt-totals"><div><dt>Source</dt><dd>${receipt.sourceCount} files</dd></div><div><dt>Destination verified</dt><dd>${receipt.destinationCount} files</dd></div><div><dt>Bytes checked</dt><dd>${formatBytes(receipt.receivedBytes)}</dd></div><div><dt>Missing / changed</dt><dd>${missing.length}</dd></div></dl>
    <div class="file-results" role="list">${receipt.files.map((file) => `<div class="file-result" role="listitem"><span class="result-icon" aria-hidden="true">${file.status === 'verified' ? '✓' : '!'}</span><div><b>${esc(file.name)}</b><small>${file.status} · ${formatBytes(file.size)} · SHA ${file.sha256.slice(0, 12)}…</small></div></div>`).join('')}</div>
    <p class="seal"><b>Receipt seal</b> ${receipt.seal}</p>
    <div class="receipt-actions"><button class="button secondary" data-export="json" data-id="${receipt.id}">Export JSON</button><button class="button secondary" data-export="csv" data-id="${receipt.id}">Export CSV</button><button class="button primary" data-download="${receipt.batchId}">Download received files</button><button class="text-button danger-button" data-clear="${receipt.batchId}">Clear local copies</button></div>
  </article>`;
  bindReceiptActions(target, receipt);
}

function bindReceiptActions(scope: HTMLElement, receipt: IntakeReceipt): void {
  scope.querySelectorAll<HTMLButtonElement>('[data-export]').forEach((button) => button.addEventListener('click', () => {
    const csv = button.dataset.export === 'csv';
    download(new Blob([csv ? receiptCsv(receipt) : JSON.stringify(receipt, null, 2)], { type: csv ? 'text/csv' : 'application/json' }), `${receipt.id}.${csv ? 'csv' : 'json'}`);
  }));
  scope.querySelector<HTMLButtonElement>('[data-download]')?.addEventListener('click', async () => {
    const files = await listStoredFiles(receipt.batchId);
    if (!files.length) { alert('The received file copies are not stored on this device. Open this receipt on the receiving device.'); return; }
    for (const file of files) { download(file.blob, file.name); await new Promise((resolve) => setTimeout(resolve, 180)); }
  });
  scope.querySelector<HTMLButtonElement>('[data-clear]')?.addEventListener('click', async () => {
    if (!confirm(`Clear locally stored received files for batch ${receipt.batchId.slice(0, 8)}? Exported downloads and the receipt remain. This cannot be undone.`)) return;
    await clearBatch(receipt.batchId); alert('Local received copies and resumable chunks were cleared. The receipt remains in your archive.');
  });
}

async function refreshReceipts(): Promise<void> {
  const target = document.querySelector<HTMLElement>('#receipt-list'); if (!target) return;
  try {
    const receipts = await listReceipts();
    if (!receipts.length) { target.innerHTML = '<div class="empty-receipts"><span aria-hidden="true">⌑</span><p>No receipts yet. Complete an intake and the verified record will appear here.</p></div>'; return; }
    target.innerHTML = receipts.map((receipt) => `<article class="receipt-row"><div><b>${receipt.safeToDelete ? '✓ Verified batch' : '⚠ Incomplete batch'}</b><span>${shortDate(receipt.createdAt)} · ${receipt.destinationCount}/${receipt.sourceCount} files</span></div><button class="text-button" data-view-receipt="${receipt.id}">View receipt</button></article>`).join('');
    target.querySelectorAll<HTMLButtonElement>('[data-view-receipt]').forEach((button) => button.addEventListener('click', () => {
      const receipt = receipts.find((item) => item.id === button.dataset.viewReceipt); const output = document.querySelector<HTMLElement>('#receipt-output'); if (receipt && output) { renderReceipt(receipt, output); output.scrollIntoView({ behavior: 'smooth' }); }
    }));
  } catch { target.innerHTML = '<p class="field-error">The local receipt archive could not be opened. Check that private browsing storage is available.</p>'; }
}

function download(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function updateOnlineState(): void {
  const banner = document.querySelector<HTMLElement>('#offline-banner'); if (banner) banner.hidden = navigator.onLine;
}

if ('serviceWorker' in navigator && (location.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(location.hostname))) {
  navigator.serviceWorker.register('/sw.js').then((registration) => {
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) {
          const toast = document.querySelector<HTMLElement>('#update-toast'); if (toast) toast.hidden = false;
          document.querySelector('#reload-update')?.addEventListener('click', () => { worker.postMessage('SKIP_WAITING'); location.reload(); }, { once: true });
        }
      });
    });
  }).catch(() => { /* App remains usable without installation support. */ });
}
