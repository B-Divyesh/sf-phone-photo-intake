import { describe, expect, it } from 'vitest';
import { createReceipt, receiptCsv } from '../src/receipt';
import type { BatchManifest, FileResult } from '../src/types';

const manifest: BatchManifest = {
  id: 'batch-1', createdAt: '2026-08-28T00:00:00.000Z', sourceLabel: 'phone', totalBytes: 10,
  files: [{ id: 'file-1', name: 'IMG_0001.jpg', type: 'image/jpeg', size: 10, modified: 1, relativePath: 'DCIM/IMG_0001.jpg', sha256: 'a'.repeat(64), chunks: 1 }],
};

describe('intake receipt', () => {
  it('allows deletion only when every destination hash verified', async () => {
    const files: FileResult[] = [{ ...manifest.files[0], receivedBytes: 10, destinationSha256: 'a'.repeat(64), status: 'verified' }];
    const receipt = await createReceipt(manifest, files);
    expect(receipt.safeToDelete).toBe(true);
    expect(receipt.destinationCount).toBe(1);
    expect(receipt.seal).toMatch(/^[a-f0-9]{64}$/);
  });

  it('holds deletion for a changed file', async () => {
    const files: FileResult[] = [{ ...manifest.files[0], receivedBytes: 10, destinationSha256: 'b'.repeat(64), status: 'changed' }];
    const receipt = await createReceipt(manifest, files);
    expect(receipt.safeToDelete).toBe(false);
    expect(receipt.destinationCount).toBe(0);
  });

  it('exports filenames and hashes as CSV', async () => {
    const receipt = await createReceipt(manifest, [{ ...manifest.files[0], receivedBytes: 10, status: 'missing' }]);
    expect(receiptCsv(receipt)).toContain('"IMG_0001.jpg"');
    expect(receiptCsv(receipt)).toContain('"source_sha256"');
  });
});
