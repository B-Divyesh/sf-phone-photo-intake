import './style.css';
import heroUrl from './assets/hero-blueprint.webp';
import { demoProgress, discardDemoData, resetDemoData, seedDemoData } from './demo';
import { hashBlob, hashText } from './hash';
import { receiptCsv } from './receipt';
import { clearBatch, isDemoMode, listReceipts, listStoredFiles } from './storage';
import { TransferSession } from './transfer';
import { CHUNK_SIZE, type BatchManifest, type IntakeFile, type IntakeReceipt } from './types';

const app = document.querySelector<HTMLDivElement>('#app')!;
const BUILD_ID = '1.0.2 · polish 1';
const ORIGIN = 'https://phone-photo-intake.sociobot.in';
const esc = (value: string) => value.replace(/[&<>'"]/g, (char) => ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' })[char]!);
const formatBytes = (bytes: number) => new Intl.NumberFormat(undefined, { style: 'unit', unit: bytes >= 1_000_000 ? 'megabyte' : 'kilobyte', maximumFractionDigits: 1 }).format(bytes / (bytes >= 1_000_000 ? 1_000_000 : 1_000));
const shortDate = (value: string) => new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

interface RouteMeta { title: string; description: string; canonical: string }

function setMeta(meta: RouteMeta): void {
  document.title = meta.title;
  const set = (selector: string, attribute: string, value: string) => document.querySelector(selector)?.setAttribute(attribute, value);
  set('meta[name="description"]', 'content', meta.description);
  set('link[rel="canonical"]', 'href', `${ORIGIN}${meta.canonical}`);
  set('meta[property="og:title"]', 'content', meta.title);
  set('meta[property="og:description"]', 'content', meta.description);
  set('meta[property="og:url"]', 'content', `${ORIGIN}${meta.canonical}`);
  set('meta[name="twitter:title"]', 'content', meta.title);
  set('meta[name="twitter:description"]', 'content', meta.description);
}

function header(): string {
  return `<header class="site-header"><a class="wordmark" href="/"><img src="/icons/icon.svg" width="36" height="36" alt="">Photo Intake Receipt</a><nav aria-label="Primary"><a href="/">Home</a><a href="/demo">Demo</a><a href="/#workbench">Transfer</a><a href="/privacy/">Privacy</a></nav></header>`;
}

function footer(): string {
  return `<footer><div><p>Move selected phone photos to a PC and check every file.</p><p>Artwork made for Photo Intake Receipt.</p></div><nav aria-label="Footer"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="https://sociobot.in" rel="external">Built by Param Factory (external)</a></nav><small>Build ${BUILD_ID}</small></footer>`;
}

function frame(content: string): void {
  app.innerHTML = `${header()}${content}${footer()}<div id="route-status" class="sr-only" aria-live="polite"></div><div id="update-toast" class="toast" hidden><span>An app update is ready.</span><button id="reload-update">Install update</button></div>`;
}

function legalPage(kind: 'privacy' | 'terms'): void {
  const privacy = kind === 'privacy';
  setMeta({
    title: privacy ? 'Privacy — Photo Intake Receipt' : 'Terms — Photo Intake Receipt',
    description: privacy ? 'How Photo Intake Receipt keeps photo transfers and receipts on your devices.' : 'Terms for using Photo Intake Receipt and its checked transfer receipts.',
    canonical: `/${kind}/`,
  });
  frame(`<main id="main" class="legal sheet"><p class="eyebrow">Document ${privacy ? 'P-01' : 'T-01'} · effective 28 August 2026</p><h1 tabindex="-1">${privacy ? 'Privacy, drawn plainly' : 'Terms of use'}</h1>
    ${privacy ? `<p class="lede">Your photos, file details, connection codes, and receipts stay on the devices used for a transfer.</p><h2>Data on your device</h2><p>The app saves transfer progress, received files, and receipts in device storage. You can download or remove them.</p><h2>Network use</h2><p>Photo transfers use an encrypted direct browser connection. The app uses no public connection relay.</p><h2>Demo data</h2><p>The demo uses a separate database named <code>demo:photo-intake-receipt</code>. It never reads or changes your transfer database.</p><h2>No tracking</h2><p>The app has no analytics, tracking, external fonts, external scripts, photo server, or user accounts.</p><h2>Your control</h2><p>Removing this site’s data deletes its local records. Download important files first. Email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a> with questions.</p>` : `<p class="lede">A receipt compares only the selected files with copies received by the other device.</p><h2>Safe deletion</h2><p>“Safe to delete” applies only to the files named in the receipt. It does not show that every phone photo was selected.</p><h2>Keep a backup</h2><p>Browser storage can be cleared by the device or browser. Keep another copy of important photos.</p><h2>Availability</h2><p>The software is provided “as is.” You remain responsible for backups and deletion decisions.</p><h2>Purchases</h2><p>Larger transfer licenses are not for sale while checkout is unavailable. No purchase action appears in the app.</p><h2>Acceptable use</h2><p>Transfer only files you have permission to use.</p>`}<p><a class="button secondary" href="/">Return to the transfer desk</a></p></main>`);
}

function notFoundPage(): void {
  setMeta({ title: 'Page not found — Photo Intake Receipt', description: 'This Photo Intake Receipt page does not exist.', canonical: '/404.html' });
  frame(`<main id="main" class="not-found"><section class="sheet"><p class="eyebrow">Drawing missing · 404</p><h1 tabindex="-1">Page not found</h1><p class="lede">This address does not match a transfer, demo, privacy page, or terms page.</p><a class="button primary" href="/">Return to the transfer desk</a></section></main>`);
}

function landingPage(): void {
  setMeta({ title: 'Photo Intake Receipt — move and verify phone photos', description: 'Move selected phone photos to a PC, check each copy, and keep a receipt before deleting originals.', canonical: '/' });
  frame(`<main id="main"><section class="hero" id="top"><div class="hero-copy"><p class="eyebrow">Direct photo transfer</p><h1 tabindex="-1">Move phone photos to your PC, then verify</h1><p class="lede">For people who want proof their selected photos arrived before deleting the phone copies.</p><div class="hero-actions"><a class="button primary" href="/demo">Try it with sample data</a><span>Opens a completed receipt.</span><a class="button secondary" href="#workbench">Transfer my photos</a></div><ul class="plain-facts"><li>Photos do not upload to a server.</li><li>Works offline after the first visit.</li><li>Free for 25 files per transfer.</li></ul></div><figure class="hero-art"><img src="${heroUrl}" width="960" height="640" alt="Blueprint illustration showing photo sheets moving from a phone to a PC and receiving check marks" fetchpriority="high" decoding="async"><figcaption>Selected → transferred → checked</figcaption></figure></section><div id="offline-banner" class="offline-banner" role="status" hidden><b>Offline mode.</b> Saved receipts remain available to review and download.</div>${workbench()}<section class="how ruled-section" aria-labelledby="how-title"><div class="section-heading"><p class="eyebrow">Three checked steps</p><h2 id="how-title">How the transfer works</h2><p>Use this page on the phone and PC. Keep both devices on the same network.</p></div><ol><li><b>Choose the photos.</b><span>Select only the phone files that should appear on the receipt.</span></li><li><b>Connect the devices.</b><span>Copy one connection code each way. The browser opens an encrypted direct connection.</span></li><li><b>Check every file.</b><span>Interrupted transfers send only missing parts. A receipt checks whether every byte matches.</span></li></ol></section><section id="receipts" class="ruled-section history" aria-labelledby="receipts-title"><div class="section-heading"><p class="eyebrow">Saved records</p><h2 id="receipts-title">Recent receipts</h2><p>Saved only on this device. Download each receipt as JSON or a spreadsheet-ready CSV.</p></div><div id="receipt-list" class="receipt-list"><p>Opening saved receipts…</p></div></section><section class="limits ruled-section" aria-labelledby="limits-title"><div><p class="eyebrow">Clear boundaries</p><h2 id="limits-title">What it does not do</h2><p>The app does not upload photos, choose files for you, or prove that you selected every phone photo.</p></div><div class="availability"><h3>Transfer size</h3><p>Free transfers support up to 25 files. Larger transfers are not for sale while checkout is unavailable.</p></div></section></main>`);
  bindApp();
}

function workbench(): string {
  return `<section id="workbench" class="workbench ruled-section" aria-labelledby="workbench-title"><div class="section-heading"><p class="eyebrow">Photo transfer</p><h2 id="workbench-title" tabindex="-1">Transfer on both devices</h2><p>Open this page on the sending phone and receiving PC. Choose what this device does.</p></div><div class="role-switch" role="group" aria-label="Choose what this device does"><button class="role active" data-role="send" aria-pressed="true"><span aria-hidden="true">↗</span><b>Send photos</b><small>Use on the phone</small></button><button class="role" data-role="receive" aria-pressed="false"><span aria-hidden="true">↙</span><b>Receive photos</b><small>Use on the PC</small></button></div><div class="intake-sheet sheet"><div class="sheet-id"><span id="mode-label">SENDING PHONE</span><span>DIRECT / ENCRYPTED / CHECKED</span></div><section id="sender-panel" aria-labelledby="sender-title"><div class="step"><span class="step-number">1</span><div><h3 id="sender-title">Choose the photos to transfer</h3><p>The receipt covers only these files. Their original bytes and photo details stay unchanged.</p></div></div><label class="file-pick"><span>Choose photos and videos</span><input id="file-input" type="file" accept="image/*,video/*" multiple aria-describedby="file-limit"><small id="file-limit">Free transfers include up to 25 files.</small></label><div id="selection" class="selection empty"><p>No files selected yet.</p></div><button id="prepare" class="button primary" disabled>Check files and create phone code</button><div id="sender-codes" class="pairing-block" hidden><div class="step"><span class="step-number">2</span><div><h3>Move the phone code to the PC</h3><p>Paste it into “Receive photos.” Connection codes never contain photos.</p></div></div><label for="offer-code">Phone code</label><textarea id="offer-code" readonly rows="4"></textarea><button class="button secondary copy" data-copy="offer-code">Copy phone code</button><div class="step"><span class="step-number">3</span><div><h3>Bring back the PC code</h3></div></div><label for="answer-input">PC code</label><textarea id="answer-input" rows="4" spellcheck="false"></textarea><button id="apply-answer" class="button primary">Connect and resume transfer</button></div></section><section id="receiver-panel" aria-labelledby="receiver-title" hidden><div class="step"><span class="step-number">1</span><div><h3 id="receiver-title">Paste the phone code</h3><p>Received files stay on this device until you download or remove them.</p></div></div><label for="offer-input">Phone code</label><textarea id="offer-input" rows="5" spellcheck="false"></textarea><button id="make-answer" class="button primary">Create PC code</button><div id="receiver-code-block" class="pairing-block" hidden><div class="step"><span class="step-number">2</span><div><h3>Return this code to the phone</h3></div></div><label for="answer-code">PC code</label><textarea id="answer-code" readonly rows="4"></textarea><button class="button secondary copy" data-copy="answer-code">Copy PC code</button></div></section><div class="transfer-status" role="status" aria-live="polite"><div><span class="status-dot" aria-hidden="true"></span><span id="status-text">Waiting to begin.</span></div><progress id="progress" max="100" value="0"><span>0%</span></progress><span id="progress-label">0%</span></div></div><div id="receipt-output" aria-live="polite"></div></section>`;
}

async function demoPage(): Promise<void> {
  if (new URLSearchParams(location.search).get('transfer') === '1') {
    await demoTransferPage();
    return;
  }
  setMeta({ title: 'Demo — Photo Intake Receipt', description: 'Explore a completed and interrupted phone photo transfer with isolated sample data.', canonical: '/demo' });
  frame(`${demoBanner()}<main id="main" class="demo-main"><section class="demo-intro"><p class="eyebrow">Sample transfer · isolated workspace</p><h1 tabindex="-1">Review a finished photo transfer</h1><p class="lede">Maya moved three harbour-trip files from her phone to her PC. Every selected file arrived unchanged.</p></section><section aria-labelledby="completed-title"><h2 id="completed-title" class="sr-only">Completed sample receipt</h2><div id="demo-receipt"><p>Preparing the sample receipt…</p></div></section><section class="paused sheet" aria-labelledby="paused-title"><div><p class="eyebrow">Interrupted sample · saved progress</p><h2 id="paused-title">A transfer ready to resume</h2><p><b>IMG_2098_family-lunch.jpg</b> stopped after one of four file parts arrived.</p><p>Reconnect the same devices to send only the three missing parts.</p></div><div class="paused-meter"><span id="paused-count">1 of 4 parts saved</span><progress max="4" value="1">25%</progress><span class="hold-mark">PAUSED</span></div></section><section class="demo-note" aria-labelledby="sandbox-title"><h2 id="sandbox-title">This sample stays separate</h2><p>Demo changes use the <code>demo:photo-intake-receipt</code> database. Your transfers, receipts, and license data are never read.</p><p><a href="/demo?transfer=1">Open the sample transfer controls</a></p></section></main>`);
  await seedDemoData();
  const receipt = (await listReceipts()).find((item) => item.id === 'receipt-demo-harbour-trip');
  if (receipt) renderReceipt(receipt, document.querySelector<HTMLElement>('#demo-receipt')!);
  const progress = await demoProgress();
  document.querySelector('#paused-count')!.textContent = `${progress.savedParts} of ${progress.totalParts} parts saved`;
  const meter = document.querySelector<HTMLProgressElement>('.paused-meter progress')!; meter.max = progress.totalParts; meter.value = progress.savedParts;
  bindDemoControls();
}

function demoBanner(): string {
  return `<div class="demo-banner" role="status"><b>Demo — sample data, nothing is saved</b><div><button id="reset-demo" class="text-button">Reset demo</button><a id="start-real" href="/" class="button secondary">Start for real</a></div></div>`;
}

async function demoTransferPage(): Promise<void> {
  setMeta({ title: 'Sample transfer — Photo Intake Receipt', description: 'Run a phone-to-PC transfer inside the isolated Photo Intake Receipt demo.', canonical: '/demo' });
  await seedDemoData();
  frame(`${demoBanner()}<main id="main"><section class="demo-lab-head"><p class="eyebrow">Demo transfer controls</p><h1 tabindex="-1">Transfer sample files between two demo devices</h1><p class="lede">Open this address in both demo windows. Test files stay inside the demo database.</p><a href="/demo">Return to the finished sample</a></section>${workbench()}</main>`);
  bindApp();
  bindDemoControls();
}

function bindDemoControls(): void {
  document.querySelector('#reset-demo')?.addEventListener('click', async () => { const button = document.querySelector<HTMLButtonElement>('#reset-demo')!; button.disabled = true; button.textContent = 'Resetting…'; await resetDemoData(); await route(false); announce('Demo reset to the original sample.'); });
  document.querySelector('#start-real')?.addEventListener('click', async (event) => { event.preventDefault(); await discardDemoData(); navigate('/'); });
}

async function route(moveFocus = true): Promise<void> {
  const path = location.pathname.replace(/\/+$/, '') || '/';
  if (isDemoMode()) await demoPage();
  else if (path === '/') landingPage();
  else if (path === '/privacy' || path === '/terms') legalPage(path.slice(1) as 'privacy' | 'terms');
  else notFoundPage();
  if (moveFocus) { document.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true }); announce(document.title); }
  bindNavigation(); updateOnlineState();
}

function announce(text: string): void { const status = document.querySelector<HTMLElement>('#route-status'); if (status) status.textContent = text; }
function navigate(url: string): void { history.pushState({}, '', url); void route(); }

function bindNavigation(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]').forEach((link) => link.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href); if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.hash) return;
    event.preventDefault(); navigate(`${url.pathname}${url.search}${url.hash}`);
  }));
  document.querySelector<HTMLAnchorElement>('a[href="#workbench"]')?.addEventListener('click', () => requestAnimationFrame(() => document.querySelector<HTMLElement>('#workbench-title')?.focus({ preventScroll: true })));
}

function bindApp(): void {
  let selectedFiles: File[] = [];
  let sourceFiles = new Map<string, File>();
  const $ = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector)!;
  const status = $('#status-text'); const progress = $('#progress') as HTMLProgressElement; const progressLabel = $('#progress-label');
  const setStatus = (text: string, error = false) => { status.textContent = text; status.parentElement?.classList.toggle('error', error); };
  const setProgress = (done: number, total: number, label: string) => { const percent = total ? Math.round(done / total * 100) : 0; progress.value = percent; progressLabel.textContent = `${percent}% · ${label}`; };
  const callbacks = { onState: setStatus, onProgress: setProgress, onManifest: (manifest: BatchManifest) => setStatus(`Incoming: ${manifest.files.length} files, ${formatBytes(manifest.totalBytes)}.`), onReceipt: (receipt: IntakeReceipt) => { renderReceipt(receipt, $('#receipt-output')); void refreshReceipts(); }, onError: (message: string) => setStatus(message, true) };
  let session = new TransferSession(callbacks);
  document.querySelectorAll<HTMLButtonElement>('.role').forEach((button) => button.addEventListener('click', () => { const role = button.dataset.role!; document.querySelectorAll<HTMLButtonElement>('.role').forEach((item) => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); }); $('#sender-panel').hidden = role !== 'send'; $('#receiver-panel').hidden = role !== 'receive'; $('#mode-label').textContent = role === 'send' ? 'SENDING PHONE' : 'RECEIVING PC'; session.close(); session = new TransferSession(callbacks); setStatus('Waiting to begin.'); setProgress(0, 100, 'ready'); }));
  const input = $('#file-input') as HTMLInputElement;
  input.addEventListener('change', () => { selectedFiles = Array.from(input.files ?? []); const over = selectedFiles.length > 25; ($('#prepare') as HTMLButtonElement).disabled = selectedFiles.length === 0 || over; ($('#prepare') as HTMLButtonElement).textContent = 'Check files and create phone code'; const selection = $('#selection'); if (!selectedFiles.length) { selection.className = 'selection empty'; selection.innerHTML = '<p>No files selected yet.</p>'; return; } selection.className = `selection${over ? ' selection-error' : ''}`; selection.innerHTML = `<div><b>${selectedFiles.length} file${selectedFiles.length === 1 ? '' : 's'}</b><span>${formatBytes(selectedFiles.reduce((sum, file) => sum + file.size, 0))}</span></div><ol>${selectedFiles.slice(0, 5).map((file) => `<li><span>${esc(file.name)}</span><small>${formatBytes(file.size)}</small></li>`).join('')}${selectedFiles.length > 5 ? `<li class="more">+ ${selectedFiles.length - 5} more</li>` : ''}</ol>${over ? '<p class="field-error" role="alert">Free transfers support 25 files. Remove one or more files to continue.</p>' : ''}`; });
  $('#prepare').addEventListener('click', async () => { try { ($('#prepare') as HTMLButtonElement).disabled = true; const manifest = await makeManifest(selectedFiles, (done, total, name) => { setStatus(`Checking ${name}…`); setProgress(done, total, 'checking phone files'); }); sourceFiles = new Map(manifest.files.map((meta, index) => [meta.id, selectedFiles[index]])); ($('#offer-code') as HTMLTextAreaElement).value = await session.makeOffer(manifest, sourceFiles); $('#sender-codes').hidden = false; const prepare = $('#prepare') as HTMLButtonElement; prepare.disabled = false; prepare.textContent = 'Create a fresh phone code to resume'; } catch (error) { setStatus(error instanceof Error ? error.message : 'The files could not be prepared. Try choosing them again.', true); ($('#prepare') as HTMLButtonElement).disabled = false; } });
  $('#apply-answer').addEventListener('click', async () => { try { await session.applyAnswer(($('#answer-input') as HTMLTextAreaElement).value); } catch (error) { setStatus(error instanceof Error ? error.message : 'That PC code could not be used. Copy the full PC code and try again.', true); } });
  $('#make-answer').addEventListener('click', async () => { try { setStatus('Reading phone code…'); ($('#answer-code') as HTMLTextAreaElement).value = await session.acceptOffer(($('#offer-input') as HTMLTextAreaElement).value); $('#receiver-code-block').hidden = false; } catch (error) { setStatus(error instanceof Error ? error.message : 'That phone code could not be used. Copy the full phone code and try again.', true); } });
  document.querySelectorAll<HTMLButtonElement>('.copy').forEach((button) => button.addEventListener('click', async () => { const field = document.getElementById(button.dataset.copy!) as HTMLTextAreaElement; try { await navigator.clipboard.writeText(field.value); button.textContent = 'Copied'; setTimeout(() => { button.textContent = button.dataset.copy === 'offer-code' ? 'Copy phone code' : 'Copy PC code'; }, 1800); } catch { field.select(); setStatus('Clipboard access was blocked. The code is selected. Use your device’s copy command.'); } }));
  window.addEventListener('online', updateOnlineState); window.addEventListener('offline', updateOnlineState); void refreshReceipts();
}

async function makeManifest(files: File[], onProgress: (done: number, total: number, name: string) => void): Promise<BatchManifest> {
  const totalBytes = files.reduce((sum, file) => sum + file.size, 0); let completedBytes = 0; const metas: IntakeFile[] = [];
  for (const [index, file] of files.entries()) { const sha256 = await hashBlob(file, (ratio) => onProgress(completedBytes + file.size * ratio, totalBytes, file.name)); const id = (await hashText(`${index}\0${file.name}\0${file.size}\0${file.lastModified}\0${sha256}`)).slice(0, 20); metas.push({ id, name: file.name, type: file.type || 'application/octet-stream', size: file.size, modified: file.lastModified, relativePath: file.webkitRelativePath || file.name, sha256, chunks: Math.ceil(file.size / CHUNK_SIZE) }); completedBytes += file.size; }
  const fingerprint = metas.map((file) => `${file.id}:${file.sha256}`).join('|'); return { id: `batch-${(await hashText(fingerprint)).slice(0, 24)}`, createdAt: new Date().toISOString(), sourceLabel: navigator.userAgent.includes('Android') ? 'Android phone' : 'Sending phone', files: metas, totalBytes };
}

function renderReceipt(receipt: IntakeReceipt, target: HTMLElement): void {
  const missing = receipt.files.filter((file) => file.status !== 'verified');
  target.innerHTML = `<article class="receipt ${receipt.safeToDelete ? 'receipt-safe' : 'receipt-hold'}"><div class="receipt-head"><div><p class="eyebrow">Transfer receipt · ${esc(receipt.id.slice(-8))}</p><h2>${receipt.safeToDelete ? 'Selected phone files are safe to delete' : 'Keep the phone originals'}</h2><p>${esc(receipt.scopeNote)}</p></div><div class="stamp">${receipt.safeToDelete ? 'VERIFIED' : 'HOLD'}</div></div><dl class="receipt-totals"><div><dt>Selected</dt><dd>${receipt.sourceCount} files</dd></div><div><dt>PC copies checked</dt><dd>${receipt.destinationCount} files</dd></div><div><dt>Bytes checked</dt><dd>${formatBytes(receipt.receivedBytes)}</dd></div><div><dt>Missing or changed</dt><dd>${missing.length}</dd></div></dl><div class="file-results" role="list">${receipt.files.map((file) => `<div class="file-result" role="listitem"><span class="result-icon" aria-hidden="true">${file.status === 'verified' ? '✓' : '!'}</span><div><b>${esc(file.name)}</b><small>${file.status} · ${formatBytes(file.size)} · SHA-256 ${file.sha256.slice(0, 12)}…</small></div></div>`).join('')}</div><p class="seal"><b>Receipt seal</b> ${receipt.seal}</p><div class="receipt-actions"><button class="button secondary" data-export="json" data-id="${receipt.id}">Download JSON</button><button class="button secondary" data-export="csv" data-id="${receipt.id}">Download CSV</button><button class="button primary" data-download="${receipt.batchId}">Download received files</button><button class="text-button danger-button" data-clear="${receipt.batchId}">Remove received copies</button></div></article>`;
  bindReceiptActions(target, receipt);
}

function bindReceiptActions(scope: HTMLElement, receipt: IntakeReceipt): void {
  scope.querySelectorAll<HTMLButtonElement>('[data-export]').forEach((button) => button.addEventListener('click', () => { const csv = button.dataset.export === 'csv'; download(new Blob([csv ? receiptCsv(receipt) : JSON.stringify(receipt, null, 2)], { type: csv ? 'text/csv' : 'application/json' }), `${receipt.id}.${csv ? 'csv' : 'json'}`); }));
  scope.querySelector<HTMLButtonElement>('[data-download]')?.addEventListener('click', async () => { const files = await listStoredFiles(receipt.batchId); if (!files.length) { alert('Received copies are not saved on this device. Open the receipt on the receiving PC.'); return; } for (const file of files) { download(file.blob, file.name); await new Promise((resolve) => setTimeout(resolve, 180)); } });
  scope.querySelector<HTMLButtonElement>('[data-clear]')?.addEventListener('click', async () => { if (!confirm(`Remove received copies for transfer ${receipt.batchId.slice(0, 8)}? Downloaded files and this receipt remain.`)) return; await clearBatch(receipt.batchId); alert('Received copies and saved transfer progress were removed. The receipt remains.'); });
}

async function refreshReceipts(): Promise<void> {
  const target = document.querySelector<HTMLElement>('#receipt-list'); if (!target) return;
  try { const receipts = await listReceipts(); if (!receipts.length) { target.innerHTML = '<div class="empty-receipts"><span aria-hidden="true">⌑</span><p>No receipts yet. Complete a transfer to save its checked receipt here.</p></div>'; return; } target.innerHTML = receipts.map((receipt) => `<article class="receipt-row"><div><b>${receipt.safeToDelete ? '✓ Checked transfer' : '⚠ Incomplete transfer'}</b><span>${shortDate(receipt.createdAt)} · ${receipt.destinationCount}/${receipt.sourceCount} files</span></div><button class="text-button" data-view-receipt="${receipt.id}">View receipt</button></article>`).join(''); target.querySelectorAll<HTMLButtonElement>('[data-view-receipt]').forEach((button) => button.addEventListener('click', () => { const receipt = receipts.find((item) => item.id === button.dataset.viewReceipt); const output = document.querySelector<HTMLElement>('#receipt-output'); if (receipt && output) { renderReceipt(receipt, output); output.scrollIntoView({ behavior: 'smooth' }); } })); } catch { target.innerHTML = '<p class="field-error">Saved receipts could not be opened. Check that device storage is available.</p>'; }
}

function download(blob: Blob, name: string): void { const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
function updateOnlineState(): void { const banner = document.querySelector<HTMLElement>('#offline-banner'); if (banner) banner.hidden = navigator.onLine; }

window.addEventListener('popstate', () => void route());
void route(false);

if ('serviceWorker' in navigator && (location.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(location.hostname))) {
  navigator.serviceWorker.register('/sw.js').then((registration) => registration.addEventListener('updatefound', () => { const worker = registration.installing; worker?.addEventListener('statechange', () => { if (worker.state === 'installed' && navigator.serviceWorker.controller) { const toast = document.querySelector<HTMLElement>('#update-toast'); if (toast) toast.hidden = false; document.querySelector('#reload-update')?.addEventListener('click', () => { worker.postMessage('SKIP_WAITING'); location.reload(); }, { once: true }); } }); })).catch(() => { /* Installation support is optional. */ });
}
