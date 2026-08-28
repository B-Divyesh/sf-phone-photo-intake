import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('plain-language product copy', () => {
  it('keeps the README core job free of implementation jargon', async () => {
    const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
    const coreJob = readme.split('## What it does\n')[1]?.split('\n## ')[0] ?? '';

    expect(coreJob).toContain('Connects the sending phone directly to the receiving PC.');
    expect(coreJob).toContain('Checks each received copy and creates a receipt.');
    expect(coreJob).toContain('Saves transfer progress, received files, and receipts on this device.');
    expect(coreJob).not.toMatch(/\b(?:WebRTC|SHA-256|IndexedDB|browser device storage)\b/i);
  });

  it('keeps the catalog description verb-first and within 120 characters', async () => {
    const description = (await readFile(new URL('../.factory/catalog-description.txt', import.meta.url), 'utf8')).trim();

    expect(description.length).toBeLessThanOrEqual(120);
    expect(description).toMatch(/^Move\b/);
  });
});
