import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const base = (process.argv[2] ?? 'https://phone-photo-intake.sociobot.in').replace(/\/$/, '');
const evidenceDirectory = process.argv[3] ?? '.factory/evidence/polish-2/live';
await mkdir(evidenceDirectory, { recursive: true });

const browser = await chromium.launch();
const report = { base, checkedAt: new Date().toISOString(), routes: [], checks: {}, consoleErrors: [] };

try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  context.on('request', (request) => {
    const url = new URL(request.url());
    assert.equal(url.origin, base, `Unexpected request origin: ${url.origin}`);
  });
  const page = await context.newPage();
  page.on('pageerror', (error) => report.consoleErrors.push(String(error)));
  page.on('console', (message) => {
    const isExpectedMissingRouteResponse = new URL(page.url()).pathname === '/missing-page' && message.text().includes('404');
    if (message.type() === 'error' && !isExpectedMissingRouteResponse) report.consoleErrors.push(message.text());
  });

  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  assert.equal(await page.title(), 'Photo Intake Receipt — move and verify phone photos');
  assert.equal(await page.locator('h1').textContent(), 'Move phone photos to your PC, then verify');
  assert.equal(await page.locator('.plain-facts li').count(), 3);
  assert.equal(await page.locator('a[href*="checkout"]').count(), 0);
  assert.match(await page.locator('footer').innerText(), /Build 1\.0\.3 · polish 2/);
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `${base}/`);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth === innerWidth), true);
  await page.screenshot({ path: `${evidenceDirectory}/screenshot-mobile.png`, fullPage: true });

  const targetHeights = await page.locator('.wordmark, .site-header nav a, footer nav a').evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().height));
  assert.equal(targetHeights.every((height) => height >= 44), true);
  await page.locator('#file-input').focus();
  const outline = await page.locator('.file-pick').evaluate((element) => {
    const style = getComputedStyle(element);
    return { style: style.outlineStyle, width: parseFloat(style.outlineWidth) };
  });
  assert.notEqual(outline.style, 'none');
  assert.ok(outline.width >= 3);

  await page.evaluate(async () => {
    localStorage.setItem('sb_license:phone-photo-intake', 'production-license-sentinel');
    await new Promise((resolve, reject) => {
      const opening = indexedDB.open('photo-intake-receipt', 1);
      opening.onupgradeneeded = () => {
        const database = opening.result;
        const manifests = database.createObjectStore('manifests', { keyPath: 'id' }); manifests.createIndex('createdAt', 'createdAt');
        const chunks = database.createObjectStore('chunks', { keyPath: 'key' }); chunks.createIndex('batchId', 'batchId'); chunks.createIndex('fileId', ['batchId', 'fileId']);
        const files = database.createObjectStore('files', { keyPath: 'key' }); files.createIndex('batchId', 'batchId');
        const receipts = database.createObjectStore('receipts', { keyPath: 'id' }); receipts.createIndex('createdAt', 'createdAt');
      };
      opening.onerror = () => reject(opening.error);
      opening.onsuccess = () => {
        const database = opening.result;
        const transaction = database.transaction('receipts', 'readwrite');
        transaction.objectStore('receipts').put({ version: 1, id: 'receipt-real-sentinel', batchId: 'real', createdAt: '2026-08-28T00:00:00Z', sourceCount: 9, destinationCount: 7, sourceBytes: 9, receivedBytes: 7, files: [], seal: 'sentinel', safeToDelete: false, scopeNote: 'production only' });
        transaction.oncomplete = () => { database.close(); resolve(); };
        transaction.onerror = () => reject(transaction.error);
      };
    });
  });

  await page.goto(`${base}/?demo=1`, { waitUntil: 'networkidle' });
  assert.equal(await page.title(), 'Demo — Photo Intake Receipt');
  await page.getByText('Demo — sample data, nothing is saved').waitFor();
  await page.getByRole('heading', { name: 'Selected phone files are safe to delete' }).waitFor();
  await page.getByText('A transfer ready to resume').waitFor();
  assert.equal(await page.getByText('7/9 files').count(), 0);
  assert.equal(await page.evaluate(() => localStorage.getItem('sb_license:phone-photo-intake')), 'production-license-sentinel');
  await page.screenshot({ path: `${evidenceDirectory}/demo-mobile.png`, fullPage: true });
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Remove received copies' }).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await page.getByRole('heading', { name: 'Selected phone files are safe to delete' }).waitFor();
  await page.getByRole('link', { name: 'Start for real' }).click();
  assert.equal(await page.evaluate(() => localStorage.getItem('sb_license:phone-photo-intake')), 'production-license-sentinel');
  await page.getByText('7/9 files').waitFor();

  await page.goto(`${base}/`);
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await page.waitForFunction(() => document.querySelector('h1') === document.activeElement);
  await page.goBack();
  await page.waitForFunction(() => document.querySelector('h1') === document.activeElement);
  await page.getByRole('link', { name: 'Transfer my photos' }).click();
  await page.waitForFunction(() => document.querySelector('#workbench-title') === document.activeElement);

  for (const expected of [
    ['/', 200, 'Photo Intake Receipt — move and verify phone photos', 'Move phone photos to your PC, then verify'],
    ['/demo', 200, 'Demo — Photo Intake Receipt', 'Review a finished photo transfer'],
    ['/privacy/', 200, 'Privacy — Photo Intake Receipt', 'Privacy, drawn plainly'],
    ['/terms/', 200, 'Terms — Photo Intake Receipt', 'Terms of use'],
    ['/missing-page', 404, 'Page not found — Photo Intake Receipt', 'Page not found'],
  ]) {
    const [path, expectedStatus, expectedTitle, expectedHeading] = expected;
    const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
    assert.equal(response?.status(), expectedStatus);
    assert.equal(await page.title(), expectedTitle);
    assert.equal(await page.locator('h1').textContent(), expectedHeading);
    assert.equal(await page.locator('main').count(), 1);
    assert.equal(await page.locator('h1').count(), 1);
    report.routes.push({ path, status: response?.status(), title: await page.title(), heading: expectedHeading });
    if (path === '/missing-page') await page.screenshot({ path: `${evidenceDirectory}/404-mobile.png`, fullPage: true });
  }
  assert.deepEqual(report.consoleErrors, []);
  await context.close();

  const offlineContext = await browser.newContext();
  const offlinePage = await offlineContext.newPage();
  await offlinePage.goto(`${base}/demo`, { waitUntil: 'networkidle' });
  await offlinePage.evaluate(() => navigator.serviceWorker.ready);
  if (!await offlinePage.evaluate(() => Boolean(navigator.serviceWorker.controller))) await offlinePage.reload({ waitUntil: 'networkidle' });
  await offlineContext.setOffline(true);
  await offlinePage.reload();
  await offlinePage.getByRole('heading', { name: 'Review a finished photo transfer' }).waitFor();
  await offlinePage.getByRole('heading', { name: 'Selected phone files are safe to delete' }).waitFor();
  await offlineContext.close();

  const senderContext = await browser.newContext();
  const receiverContext = await browser.newContext();
  const sender = await senderContext.newPage();
  const receiver = await receiverContext.newPage();
  await sender.goto(`${base}/demo?transfer=1`);
  await receiver.goto(`${base}/demo?transfer=1`);
  const source = Buffer.from('live-polish-two-photo-bytes');
  await sender.locator('#file-input').setInputFiles({ name: 'IMG_live-check.jpg', mimeType: 'image/jpeg', buffer: source });
  await sender.getByRole('button', { name: 'Check files and create phone code' }).click();
  await sender.waitForFunction(() => Boolean(document.querySelector('#offer-code')?.value));
  await receiver.getByRole('button', { name: 'Receive photos' }).click();
  await receiver.locator('#offer-input').fill(await sender.locator('#offer-code').inputValue());
  await receiver.getByRole('button', { name: 'Create PC code' }).click();
  await receiver.waitForFunction(() => Boolean(document.querySelector('#answer-code')?.value));
  await sender.locator('#answer-input').fill(await receiver.locator('#answer-code').inputValue());
  await sender.getByRole('button', { name: 'Connect and resume transfer' }).click();
  await receiver.getByRole('heading', { name: 'Selected phone files are safe to delete' }).last().waitFor({ timeout: 30_000 });
  assert.match(await receiver.locator('.file-results').last().innerText(), /IMG_live-check\.jpg/);
  await senderContext.close();
  await receiverContext.close();

  report.checks = {
    firstScreenCopyAndFacts: true,
    build: '1.0.3 · polish 2',
    demoQueryEntry: true,
    demoIsolationResetAndExit: true,
    routeFocusAndBack: true,
    mobileTargetsAndOverflow: true,
    fileChooserFocus: true,
    onlySameOriginRequests: true,
    offlineDemoReload: true,
    liveTwoPeerTransfer: true,
    noCheckoutAction: true,
  };
  await writeFile(`${evidenceDirectory}/cold-check.json`, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
