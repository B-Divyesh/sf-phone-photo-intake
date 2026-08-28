import { hashText } from './hash';
import type { BatchManifest, FileResult, IntakeReceipt } from './types';

export async function createReceipt(manifest: BatchManifest, files: FileResult[]): Promise<IntakeReceipt> {
  const destinationCount = files.filter((file) => file.status === 'verified').length;
  const receivedBytes = files.reduce((sum, file) => sum + file.receivedBytes, 0);
  const createdAt = new Date().toISOString();
  const canonical = JSON.stringify({ batchId: manifest.id, createdAt, files: files.map((f) => [f.id, f.sha256, f.destinationSha256, f.status]) });
  const seal = await hashText(canonical);
  return {
    version: 1,
    id: `receipt-${manifest.id}`,
    batchId: manifest.id,
    createdAt,
    sourceCount: manifest.files.length,
    destinationCount,
    sourceBytes: manifest.totalBytes,
    receivedBytes,
    files,
    seal,
    safeToDelete: destinationCount === manifest.files.length && files.every((file) => file.status === 'verified'),
    scopeNote: 'This receipt covers only the files selected in this source batch.',
  };
}

export function receiptCsv(receipt: IntakeReceipt): string {
  const escape = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
  const rows = [['filename','relative_path','bytes','source_sha256','destination_sha256','status']];
  receipt.files.forEach((file) => rows.push([file.name,file.relativePath,String(file.size),file.sha256,file.destinationSha256 ?? '',file.status]));
  return rows.map((row) => row.map(escape).join(',')).join('\n');
}
