import { hashBlob, hashText } from './hash';
import { createReceipt } from './receipt';
import { assembleFile, chunkIndexes, listReceipts, resetDemoDatabase, saveChunk, saveManifest, saveReceipt } from './storage';
import { CHUNK_SIZE, type BatchManifest, type FileResult, type IntakeFile } from './types';

const DEMO_MARKER = 'demo:photo-intake-receipt:seed-v1';

const samples = [
  { name: 'IMG_1842_harbour.jpg', type: 'image/jpeg', bytes: new TextEncoder().encode('EXIF:2026-08-24T18:42:00Z\nHarbour sunset original photo bytes\n') },
  { name: 'IMG_1843_ticket.jpg', type: 'image/jpeg', bytes: new TextEncoder().encode('EXIF:2026-08-24T18:44:00Z\nFerry ticket original photo bytes\n') },
  { name: 'VID_1844_departure.mp4', type: 'video/mp4', bytes: new TextEncoder().encode('Sample ferry departure video bytes, unchanged in the demo.\n') },
];

async function fileMeta(index: number): Promise<IntakeFile> {
  const sample = samples[index];
  const blob = new Blob([sample.bytes], { type: sample.type });
  const sha256 = await hashBlob(blob);
  return {
    id: `demo-file-${index + 1}`,
    name: sample.name,
    type: sample.type,
    size: blob.size,
    modified: Date.parse('2026-08-24T18:42:00Z') + index * 120_000,
    relativePath: `DCIM/Camera/${sample.name}`,
    sha256,
    chunks: Math.ceil(blob.size / CHUNK_SIZE),
  };
}

export async function seedDemoData(): Promise<void> {
  const existing = await listReceipts();
  if (localStorage.getItem(DEMO_MARKER) === 'ready' && existing.length) return;

  const files = await Promise.all(samples.map((_, index) => fileMeta(index)));
  const manifest: BatchManifest = {
    id: 'demo-completed-harbour-trip',
    createdAt: '2026-08-24T19:06:00.000Z',
    sourceLabel: 'Maya’s phone',
    files,
    totalBytes: files.reduce((sum, file) => sum + file.size, 0),
  };
  await saveManifest(manifest);
  const results: FileResult[] = [];
  for (const [index, file] of files.entries()) {
    const sample = samples[index];
    await saveChunk(manifest.id, file.id, 0, sample.bytes.buffer.slice(sample.bytes.byteOffset, sample.bytes.byteOffset + sample.bytes.byteLength));
    const received = await assembleFile(manifest.id, file.id, file.name, file.type);
    results.push({ ...file, destinationSha256: await hashBlob(received), receivedBytes: received.size, status: 'verified' });
  }
  const receipt = await createReceipt(manifest, results);
  receipt.id = 'receipt-demo-harbour-trip';
  receipt.createdAt = '2026-08-24T19:06:18.000Z';
  receipt.seal = await hashText('photo-intake-demo-harbour-trip');
  await saveReceipt(receipt);

  const interruptedFile = await fileMeta(0);
  const interrupted: BatchManifest = {
    id: 'demo-paused-family-album',
    createdAt: '2026-08-28T09:14:00.000Z',
    sourceLabel: 'Maya’s phone',
    files: [{ ...interruptedFile, id: 'demo-paused-file', name: 'IMG_2098_family-lunch.jpg', size: CHUNK_SIZE * 4, chunks: 4 }],
    totalBytes: CHUNK_SIZE * 4,
  };
  await saveManifest(interrupted);
  await saveChunk(interrupted.id, interrupted.files[0].id, 0, new Uint8Array(CHUNK_SIZE).buffer);
  localStorage.setItem(DEMO_MARKER, 'ready');
}

export async function resetDemoData(): Promise<void> {
  localStorage.removeItem(DEMO_MARKER);
  await resetDemoDatabase();
  await seedDemoData();
}

export async function discardDemoData(): Promise<void> {
  localStorage.removeItem(DEMO_MARKER);
  await resetDemoDatabase();
}

export async function demoProgress(): Promise<{ savedParts: number; totalParts: number }> {
  const savedParts = (await chunkIndexes('demo-paused-family-album', 'demo-paused-file')).length;
  return { savedParts, totalParts: 4 };
}
