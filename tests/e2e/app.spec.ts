import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('landing page and transfer workbench are usable', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Photo Intake Receipt/);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: /Know the photos arrived/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Send photos/ })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: /Receive photos/ }).click();
  await expect(page.locator('#offer-input')).toBeVisible();
  await page.locator('#offer-input').fill('not-a-valid-code');
  await page.getByRole('button', { name: 'Create receiver code' }).click();
  await expect(page.getByRole('status').filter({ hasText: /could not|valid|character/i })).toBeVisible();
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

  await receiver.getByRole('button', { name: /Receive photos/ }).click();
  await receiver.locator('#offer-input').fill(await page.locator('#offer-code').inputValue());
  await receiver.getByRole('button', { name: 'Create receiver code' }).click();
  await expect(receiver.locator('#answer-code')).not.toHaveValue('', { timeout: 15_000 });

  await page.locator('#answer-input').fill(await receiver.locator('#answer-code').inputValue());
  await page.getByRole('button', { name: 'Connect and send missing chunks' }).click();
  await expect(page.getByRole('heading', { name: 'Safe to delete this selected batch' })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText('1 files', { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/IMG_0042.jpg/).first()).toBeVisible();
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
