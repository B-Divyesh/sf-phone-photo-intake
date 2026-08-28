import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('landing page and transfer workbench are usable', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page).toHaveTitle(/Photo Intake Receipt/);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: /Know the photos arrived/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Send photos/ })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: /Receive photos/ }).click();
  await expect(page.locator('#offer-input')).toBeVisible();
  await page.locator('#offer-input').fill('not-a-valid-code');
  await page.getByRole('button', { name: 'Create receiver code' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'That sender code is invalid or incomplete. Copy the full code and try again.' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('has no serious accessibility violations', async ({ page }) => {
  await page.goto('/');
  // @axe-core/playwright carries its own compatible Page type; runtime uses the pinned browser.
  const results = await new AxeBuilder({ page: page as never }).exclude('#update-toast').analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
});

test('legal routes have one main heading', async ({ page }) => {
  for (const route of ['/privacy/', '/terms/']) {
    await page.goto(route);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
  }
});

test('transfers bytes and produces a safe-to-delete receipt', async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'End-to-end peer path is covered once in Chromium.');
  const receiver = await context.newPage();
  await page.goto('/');
  await receiver.goto('/');

  await page.locator('#file-input').setInputFiles({
    name: 'IMG_0042.jpg',
    mimeType: 'image/jpeg',
    buffer: Buffer.from('unchanged-photo-exif-and-pixel-bytes'),
  });
  await page.getByRole('button', { name: 'Hash batch and create sender code' }).click();
  await expect(page.locator('#offer-code')).not.toHaveValue('', { timeout: 15_000 });
  const firstOffer = await page.locator('#offer-code').inputValue();

  await receiver.getByRole('button', { name: /Receive photos/ }).click();
  await receiver.locator('#offer-input').fill(firstOffer);
  await receiver.getByRole('button', { name: 'Create receiver code' }).click();
  await expect(receiver.locator('#answer-code')).not.toHaveValue('', { timeout: 15_000 });
  const firstAnswer = await receiver.locator('#answer-code').inputValue();

  await page.locator('#answer-input').fill(firstAnswer);
  await page.getByRole('button', { name: 'Connect and send missing chunks' }).click();
  await expect(page.getByRole('heading', { name: 'Safe to delete this selected batch' })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText('1 files', { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/IMG_0042.jpg/).first()).toBeVisible();

  await page.getByRole('button', { name: 'Create fresh sender code to resume' }).click();
  await expect.poll(() => page.locator('#offer-code').inputValue(), { timeout: 15_000 }).not.toBe(firstOffer);
  await receiver.locator('#offer-input').fill(await page.locator('#offer-code').inputValue());
  await receiver.getByRole('button', { name: 'Create receiver code' }).click();
  await expect.poll(() => receiver.locator('#answer-code').inputValue(), { timeout: 15_000 }).not.toBe(firstAnswer);
  await page.locator('#answer-input').fill(await receiver.locator('#answer-code').inputValue());
  await page.getByRole('button', { name: 'Connect and send missing chunks' }).click();
  await expect(receiver.locator('#progress-label')).toContainText('Resuming from verified local chunks', { timeout: 20_000 });
});

test('app shell reloads offline after first visit', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: /Know the photos arrived/ })).toBeVisible();
  await expect(page.getByText('Offline mode.')).toBeVisible();
});

async function storedChunkKeys(page: import('@playwright/test').Page): Promise<string[]> {
  return page.evaluate(async () => new Promise<string[]>((resolve, reject) => {
    const opening = indexedDB.open('photo-intake-receipt');
    opening.onerror = () => reject(opening.error);
    opening.onsuccess = () => {
      const db = opening.result;
      const transaction = db.transaction('chunks');
      const request = transaction.objectStore('chunks').getAll();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => { resolve((request.result as Array<{ key: string }>).map((chunk) => chunk.key)); db.close(); };
    };
  }));
}

async function pair(sender: import('@playwright/test').Page, receiver: import('@playwright/test').Page): Promise<void> {
  await receiver.getByRole('button', { name: /Receive photos/ }).click();
  await receiver.locator('#offer-input').fill(await sender.locator('#offer-code').inputValue());
  await receiver.getByRole('button', { name: 'Create receiver code' }).click();
  await expect(receiver.locator('#answer-code')).not.toHaveValue('', { timeout: 15_000 });
  await sender.locator('#answer-input').fill(await receiver.locator('#answer-code').inputValue());
  await sender.getByRole('button', { name: 'Connect and send missing chunks' }).click();
}

test('resumes real partial chunks through 20 forced WebRTC channel interruptions', async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'The campaign uses two isolated Chromium device profiles; mobile layout has separate coverage.');
  test.setTimeout(180_000);
  const completedRuns: number[] = [];

  for (let run = 0; run < 20; run += 1) {
    const senderContext = await browser.newContext();
    const receiverContext = await browser.newContext();
    try {
      // Keep channel sends ordered but slow enough to terminate an actual in-progress transfer.
      // This lives only in the browser test environment; production transfer timing is unchanged.
      await senderContext.addInitScript(() => {
        const originalSend = RTCDataChannel.prototype.send;
        const queues = new WeakMap<RTCDataChannel, Promise<void>>();
        RTCDataChannel.prototype.send = function delayedSend(data: string | Blob | ArrayBuffer | ArrayBufferView): void {
          const channel = this;
          const previous = queues.get(channel) ?? Promise.resolve();
          const next = previous.then(() => new Promise<void>((resolve) => setTimeout(resolve, 12))).then(() => {
            if (channel.readyState === 'open') originalSend.call(channel, data as never);
          }).catch(() => undefined);
          queues.set(channel, next);
        };
      });
      const sender = await senderContext.newPage();
      const receiver = await receiverContext.newPage();
      await sender.goto('/');
      await receiver.goto('/');
      await sender.locator('#file-input').setInputFiles({
        name: `INTERRUPT_${run}.jpg`,
        mimeType: 'image/jpeg',
        buffer: Buffer.alloc(512 * 1024, run),
      });
      await sender.getByRole('button', { name: 'Hash batch and create sender code' }).click();
      await expect(sender.locator('#offer-code')).not.toHaveValue('', { timeout: 15_000 });
      await pair(sender, receiver);

      await expect.poll(() => storedChunkKeys(receiver).then((keys) => keys.length), { timeout: 20_000 }).toBeGreaterThanOrEqual(3);
      const partialKeys = await storedChunkKeys(receiver);
      const firstOffer = await sender.locator('#offer-code').inputValue();

      // Equivalent to losing Wi-Fi: terminate the live channel while chunks are persisted,
      // then use the normal fresh-code recovery path.
      await sender.getByRole('button', { name: 'Create fresh sender code to resume' }).click();
      await expect.poll(() => sender.locator('#offer-code').inputValue(), { timeout: 15_000 }).not.toBe(firstOffer);
      await receiver.locator('#offer-input').fill(await sender.locator('#offer-code').inputValue());
      await receiver.getByRole('button', { name: 'Create receiver code' }).click();
      await expect(receiver.locator('#answer-code')).not.toHaveValue('', { timeout: 15_000 });
      await sender.locator('#answer-input').fill(await receiver.locator('#answer-code').inputValue());
      await sender.getByRole('button', { name: 'Connect and send missing chunks' }).click();

      // Every byte completed before the interruption remains present when the new manifest is compared.
      await expect.poll(async () => {
        const resumed = new Set(await storedChunkKeys(receiver));
        return partialKeys.every((key) => resumed.has(key));
      }, { timeout: 20_000 }).toBe(true);
      await expect(receiver.getByRole('heading', { name: 'Safe to delete this selected batch' })).toBeVisible({ timeout: 30_000 });
      await expect(receiver.getByText('Missing / changed').locator('..')).toContainText('0');
      completedRuns.push(partialKeys.length);
    } finally {
      await senderContext.close();
      await receiverContext.close();
    }
  }

  expect(completedRuns).toHaveLength(20);
  // At least three 64 KiB chunks were retained in each run: 100% of completed bytes were reused.
  expect(Math.min(...completedRuns)).toBeGreaterThanOrEqual(3);
});
