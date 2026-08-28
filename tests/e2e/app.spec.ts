import { createHash } from 'node:crypto';
import { expect, test, type Browser, type BrowserContext, type Download, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const DEMO_DB = 'demo:photo-intake-receipt';

test('landing copy, route metadata, history focus, and designed 404 are complete', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Photo Intake Receipt — move and verify phone photos');
  await expect(page.locator('h1')).toHaveText('Move phone photos to your PC, then verify');
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  await expect(page.locator('.plain-facts li')).toHaveCount(3);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://phone-photo-intake.sociobot.in/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og-photo-intake\.jpg$/);
  await expect(page.locator('a[href*="checkout"]')).toHaveCount(0);

  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveTitle('Demo — Photo Intake Receipt');
  await expect(page.locator('h1')).toBeFocused();
  await page.goBack();
  await expect(page.locator('h1')).toBeFocused();

  for (const route of [
    { path: '/privacy/', title: 'Privacy — Photo Intake Receipt', heading: 'Privacy, drawn plainly' },
    { path: '/terms/', title: 'Terms — Photo Intake Receipt', heading: 'Terms of use' },
    { path: '/demo', title: 'Demo — Photo Intake Receipt', heading: 'Review a finished photo transfer' },
  ]) {
    await page.goto(route.path);
    await expect(page).toHaveTitle(route.title);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText(route.heading);
    await expect(page.locator('header nav')).toBeAttached();
    await expect(page.locator('footer')).toContainText(/Build 1\.0\.1/);
  }

  await page.goto('/does-not-exist');
  await expect(page).toHaveTitle('Page not found — Photo Intake Receipt');
  await expect(page.locator('h1')).toHaveText('Page not found');
  await expect(page.getByRole('link', { name: 'Return to the transfer desk' })).toBeVisible();
});

test('keyboard focus, touch targets, and axe baseline pass', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.locator('#file-input').focus();
  const focusStyle = await page.locator('.file-pick').evaluate((element) => {
    const style = getComputedStyle(element);
    return { width: parseFloat(style.outlineWidth), color: style.outlineColor, style: style.outlineStyle };
  });
  expect(focusStyle.width).toBeGreaterThanOrEqual(3);
  expect(focusStyle.style).not.toBe('none');
  expect(focusStyle.color).not.toBe('rgba(0, 0, 0, 0)');

  for (const route of ['/', '/demo', '/privacy/', '/terms/', '/missing-page']) {
    await page.goto(route);
    const results = await new AxeBuilder({ page: page as never }).exclude('#update-toast').analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  }

  if (testInfo.project.name === 'mobile') {
    await page.goto('/');
    for (const target of [page.locator('.wordmark'), page.getByRole('link', { name: 'Privacy' }).last(), page.getByRole('link', { name: 'Terms' })]) {
      const box = await target.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(await page.evaluate(() => innerWidth));
  }
});

test('invalid PC code names the field and gives a next step', async ({ page }) => {
  await page.goto('/');
  await page.locator('#file-input').setInputFiles({ name: 'IMG_0001.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('sample') });
  await page.getByRole('button', { name: 'Check files and create phone code' }).click();
  await expect(page.locator('#answer-input')).toBeVisible({ timeout: 15_000 });
  await page.locator('#answer-input').fill('incomplete');
  await page.getByRole('button', { name: 'Connect and resume transfer' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'That PC code is incomplete. Copy the full PC code and try again.' })).toBeVisible();
});

test('@claim:demo-isolation demo is one click, seeded, resettable, and isolated', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Storage isolation is viewport-independent.');
  await page.goto('/');
  await page.evaluate(async () => {
    localStorage.setItem('sb_license:phone-photo-intake', 'production-license-sentinel');
    await new Promise<void>((resolve, reject) => {
      const open = indexedDB.open('photo-intake-receipt', 1);
      open.onupgradeneeded = () => {
        const db = open.result;
        const manifests = db.createObjectStore('manifests', { keyPath: 'id' }); manifests.createIndex('createdAt', 'createdAt');
        const chunks = db.createObjectStore('chunks', { keyPath: 'key' }); chunks.createIndex('batchId', 'batchId'); chunks.createIndex('fileId', ['batchId', 'fileId']);
        const files = db.createObjectStore('files', { keyPath: 'key' }); files.createIndex('batchId', 'batchId');
        const receipts = db.createObjectStore('receipts', { keyPath: 'id' }); receipts.createIndex('createdAt', 'createdAt');
      };
      open.onerror = () => reject(open.error);
      open.onsuccess = () => {
        const db = open.result;
        const tx = db.transaction('receipts', 'readwrite');
        tx.objectStore('receipts').put({ version: 1, id: 'receipt-real-sentinel', batchId: 'real', createdAt: '2026-08-28T00:00:00Z', sourceCount: 9, destinationCount: 7, sourceBytes: 9, receivedBytes: 7, files: [], seal: 'sentinel', safeToDelete: false, scopeNote: 'production only' });
        tx.oncomplete = () => { db.close(); resolve(); }; tx.onerror = () => reject(tx.error);
      };
    });
  });

  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Selected phone files are safe to delete' })).toBeVisible();
  await expect(page.getByText('A transfer ready to resume')).toBeVisible();
  await expect(page.getByText('7/9 files')).toHaveCount(0);
  await expect(page.locator('body')).not.toContainText('production-license-sentinel');
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Remove received copies' }).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('heading', { name: 'Selected phone files are safe to delete' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('sb_license:phone-photo-intake'))).toBe('production-license-sentinel');
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText('7/9 files')).toBeVisible();
});

test('@claim:receipt-exports @claim:checks-free demo exports checked receipt formats without a license', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Download contents are viewport-independent.');
  await page.goto('/?demo=1');
  await expect(page.getByRole('heading', { name: 'Selected phone files are safe to delete' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('sb_license:phone-photo-intake'))).toBeNull();

  const jsonDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download JSON' }).click();
  const json = JSON.parse((await downloadBuffer(await jsonDownload)).toString('utf8')) as { files: Array<{ name: string }>; scopeNote: string; safeToDelete: boolean };
  expect(json.safeToDelete).toBe(true);
  expect(json.files.map((file) => file.name)).toEqual(['IMG_1842_harbour.jpg', 'IMG_1843_ticket.jpg', 'VID_1844_departure.mp4']);
  expect(json.scopeNote).toContain('only the files selected');

  const csvDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download CSV' }).click();
  const csv = (await downloadBuffer(await csvDownload)).toString('utf8');
  expect(csv.split('\n')).toHaveLength(4);
  expect(csv).toContain('"source_sha256"');
  expect(csv).toContain('"IMG_1842_harbour.jpg"');
});

test('@claim:offline-pwa demo receipt reloads offline after the first visit', async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Offline behavior is viewport-independent.');
  await page.goto('/demo');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  const manifest = await page.request.get('/manifest.webmanifest');
  expect(manifest.ok()).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Review a finished photo transfer' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Selected phone files are safe to delete' })).toBeVisible();
});

test('@claim:free-limit-25 free transfer accepts 25 files and rejects 26', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'File-limit behavior is viewport-independent.');
  await page.goto('/demo?transfer=1');
  const files = Array.from({ length: 26 }, (_, index) => ({ name: `IMG_${String(index + 1).padStart(4, '0')}.jpg`, mimeType: 'image/jpeg', buffer: Buffer.from([index]) }));
  await page.locator('#file-input').setInputFiles(files.slice(0, 25));
  await expect(page.getByRole('button', { name: 'Check files and create phone code' })).toBeEnabled();
  await page.locator('#file-input').setInputFiles(files);
  await expect(page.getByRole('button', { name: 'Check files and create phone code' })).toBeDisabled();
  await expect(page.getByRole('alert')).toContainText('Free transfers support 25 files');
});

test('@claim:direct-local-transfer @claim:verified-receipt @claim:unchanged-file-bytes @claim:local-device-storage @claim:download-received-files @claim:selected-files-scope @claim:same-network-transfer @claim:privacy-network-boundary transfers and proves one selected file', async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'The two-peer protocol is exercised once in Chromium.');
  const senderContext = await demoContext(browser);
  const receiverContext = await demoContext(browser);
  const requests: string[] = [];
  senderContext.on('request', (request) => requests.push(request.url()));
  receiverContext.on('request', (request) => requests.push(request.url()));
  const sender = await senderContext.newPage(); const receiver = await receiverContext.newPage();
  try {
    await sender.goto('/demo?transfer=1'); await receiver.goto('/demo?transfer=1');
    const source = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe1, 0x00, 0x12]), Buffer.from('Exif\0\0phone-photo-intake-original'), Buffer.from([0xff, 0xd9])]);
    await sender.locator('#file-input').setInputFiles({ name: 'IMG_0042_with-exif.jpg', mimeType: 'image/jpeg', buffer: source });
    await sender.getByRole('button', { name: 'Check files and create phone code' }).click();
    await expect(sender.locator('#offer-code')).not.toHaveValue('', { timeout: 15_000 });
    await pair(sender, receiver);
    await expect(receiver.getByRole('heading', { name: 'Selected phone files are safe to delete' })).toBeVisible({ timeout: 30_000 });
    await expect(receiver.getByText('Missing or changed').locator('..')).toContainText('0');
    await expect(receiver.locator('.file-results')).toContainText('IMG_0042_with-exif.jpg');
    await expect(receiver.locator('.file-results')).not.toContainText('IMG_9999_not-selected.jpg');

    const stored = await databaseCounts(receiver, DEMO_DB);
    expect(stored.files).toBeGreaterThanOrEqual(4);
    expect(stored.receipts).toBeGreaterThanOrEqual(2);

    const expectedHash = createHash('sha256').update(source).digest('hex');
    const receiptEvent = receiver.waitForEvent('download');
    await receiver.getByRole('button', { name: 'Download JSON' }).last().click();
    const receipt = JSON.parse((await downloadBuffer(await receiptEvent)).toString('utf8')) as { files: Array<{ sha256: string; destinationSha256: string }> };
    expect(receipt.files[0].sha256).toBe(expectedHash);
    expect(receipt.files[0].destinationSha256).toBe(expectedHash);

    const downloadEvent = receiver.waitForEvent('download');
    await receiver.getByRole('button', { name: 'Download received files' }).last().click();
    const downloaded = await downloadBuffer(await downloadEvent);
    expect(downloaded.equals(source)).toBe(true);
    expect(createHash('sha256').update(downloaded).digest('hex')).toBe(expectedHash);

    const configs = await sender.evaluate(() => (window as unknown as { __rtcConfigs: RTCConfiguration[] }).__rtcConfigs);
    expect(configs.length).toBeGreaterThan(0);
    expect(configs.every((config) => Array.isArray(config.iceServers) && config.iceServers.length === 0)).toBe(true);
    expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
    expect(await receiver.locator('script[src^="http"]').count()).toBe(0);
    expect(await receiver.locator('link[href^="http"][rel="stylesheet"]').count()).toBe(0);

    receiver.once('dialog', (dialog) => dialog.accept());
    await receiver.getByRole('button', { name: 'Remove received copies' }).last().click();
    const cleared = await databaseCounts(receiver, DEMO_DB);
    expect(cleared.receipts).toBeGreaterThanOrEqual(2);
    expect(cleared.files).toBe(3);
  } finally { await senderContext.close(); await receiverContext.close(); }
});

test('@claim:resume-missing-parts resumes real saved parts through 20 interruptions', async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'The interruption campaign uses two isolated browser profiles.');
  test.setTimeout(210_000);
  const completedRuns: number[] = [];
  for (let run = 0; run < 20; run += 1) {
    const senderContext = await demoContext(browser, true); const receiverContext = await demoContext(browser);
    try {
      const sender = await senderContext.newPage(); const receiver = await receiverContext.newPage();
      await sender.goto('/demo?transfer=1'); await receiver.goto('/demo?transfer=1');
      await sender.locator('#file-input').setInputFiles({ name: `INTERRUPT_${run}.jpg`, mimeType: 'image/jpeg', buffer: Buffer.alloc(512 * 1024, run) });
      await sender.getByRole('button', { name: 'Check files and create phone code' }).click();
      await expect(sender.locator('#offer-code')).not.toHaveValue('', { timeout: 15_000 });
      await pair(sender, receiver);
      await expect.poll(() => storedTransferChunkKeys(receiver).then((keys) => keys.length), { timeout: 20_000 }).toBeGreaterThanOrEqual(3);
      const savedBefore = await storedTransferChunkKeys(receiver);
      const firstOffer = await sender.locator('#offer-code').inputValue();
      await sender.getByRole('button', { name: 'Create a fresh phone code to resume' }).click();
      await expect.poll(() => sender.locator('#offer-code').inputValue(), { timeout: 15_000 }).not.toBe(firstOffer);
      await pair(sender, receiver);
      await expect.poll(async () => { const after = new Set(await storedTransferChunkKeys(receiver)); return savedBefore.every((key) => after.has(key)); }, { timeout: 20_000 }).toBe(true);
      await expect(receiver.getByRole('heading', { name: 'Selected phone files are safe to delete' }).last()).toBeVisible({ timeout: 30_000 });
      const sentIndexes = await sender.evaluate(() => (window as unknown as { __sentChunkIndexes: number[] }).__sentChunkIndexes);
      for (const key of savedBefore) {
        const index = Number(key.split(':').at(-1));
        expect(sentIndexes.filter((sent) => sent === index)).toHaveLength(1);
      }
      completedRuns.push(savedBefore.length);
    } finally { await senderContext.close(); await receiverContext.close(); }
  }
  expect(completedRuns).toHaveLength(20);
  expect(Math.min(...completedRuns)).toBeGreaterThanOrEqual(3);
});

async function demoContext(browser: Browser, delayData = false): Promise<BrowserContext> {
  const context = await browser.newContext();
  await context.addInitScript((delay: boolean) => {
    const Native = window.RTCPeerConnection;
    (window as unknown as { __rtcConfigs: RTCConfiguration[]; __sentChunkIndexes: number[] }).__rtcConfigs = [];
    (window as unknown as { __sentChunkIndexes: number[] }).__sentChunkIndexes = [];
    window.RTCPeerConnection = new Proxy(Native, { construct(target, args: [RTCConfiguration?]) { (window as unknown as { __rtcConfigs: RTCConfiguration[] }).__rtcConfigs.push(args[0] ?? {}); return Reflect.construct(target, args); } });
    if (delay) {
      const originalSend = RTCDataChannel.prototype.send;
      const queues = new WeakMap<RTCDataChannel, Promise<void>>();
      RTCDataChannel.prototype.send = function delayedSend(data: string | Blob | ArrayBuffer | ArrayBufferView): void {
        const channel = this; const previous = queues.get(channel) ?? Promise.resolve();
        const next = previous.then(() => new Promise<void>((resolve) => setTimeout(resolve, 12))).then(() => { if (channel.readyState === 'open') { if (typeof data === 'string') { try { const message = JSON.parse(data) as { type?: string; index?: number }; if (message.type === 'chunk-meta' && typeof message.index === 'number') (window as unknown as { __sentChunkIndexes: number[] }).__sentChunkIndexes.push(message.index); } catch { /* Other control messages are not chunk records. */ } } originalSend.call(channel, data as never); } }).catch(() => undefined);
        queues.set(channel, next);
      };
    }
  }, delayData);
  return context;
}

async function pair(sender: Page, receiver: Page): Promise<void> {
  await receiver.getByRole('button', { name: 'Receive photos' }).click();
  await receiver.locator('#offer-input').fill(await sender.locator('#offer-code').inputValue());
  await receiver.getByRole('button', { name: 'Create PC code' }).click();
  await expect(receiver.locator('#answer-code')).not.toHaveValue('', { timeout: 15_000 });
  await sender.locator('#answer-input').fill(await receiver.locator('#answer-code').inputValue());
  await sender.getByRole('button', { name: 'Connect and resume transfer' }).click();
}

async function downloadBuffer(download: Download): Promise<Buffer> {
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}

async function databaseCounts(page: Page, name: string): Promise<{ files: number; receipts: number }> {
  return page.evaluate(async (database) => new Promise((resolve, reject) => {
    const opening = indexedDB.open(database);
    opening.onerror = () => reject(opening.error);
    opening.onsuccess = () => {
      const db = opening.result; const tx = db.transaction(['files', 'receipts']);
      const files = tx.objectStore('files').count(); const receipts = tx.objectStore('receipts').count();
      tx.oncomplete = () => { resolve({ files: files.result, receipts: receipts.result }); db.close(); }; tx.onerror = () => reject(tx.error);
    };
  }), name);
}

async function storedTransferChunkKeys(page: Page): Promise<string[]> {
  return page.evaluate(async (database) => new Promise<string[]>((resolve, reject) => {
    const opening = indexedDB.open(database); opening.onerror = () => reject(opening.error);
    opening.onsuccess = () => { const db = opening.result; const request = db.transaction('chunks').objectStore('chunks').getAll(); request.onerror = () => reject(request.error); request.onsuccess = () => { resolve((request.result as Array<{ key: string }>).map((chunk) => chunk.key).filter((key) => key.startsWith('batch-'))); db.close(); }; };
  }), DEMO_DB);
}
