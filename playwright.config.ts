import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  // The interruption campaign creates two real peer profiles per run; serial execution
  // keeps those local data channels isolated from the desktop/mobile UI checks.
  workers: 1,
  webServer: { command: 'npm run build && npm run preview -- --host 127.0.0.1', url: 'http://127.0.0.1:4173', reuseExistingServer: false },
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 5'] } },
  ],
});
