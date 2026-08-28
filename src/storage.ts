import type { BatchManifest, IntakeReceipt } from './types';

const PRODUCTION_DB_NAME = 'photo-intake-receipt';
export const DEMO_DB_NAME = 'demo:photo-intake-receipt';
const DB_VERSION = 1;

export function isDemoMode(): boolean {
  const query = new URLSearchParams(location.search);
  return location.pathname.replace(/\/+$/, '') === '/demo' || query.get('demo') === '1';
}

function databaseName(): string {
  return isDemoMode() ? DEMO_DB_NAME : PRODUCTION_DB_NAME;
}

interface StoredChunk { key: string; batchId: string; fileId: string; index: number; blob: Blob }
export interface StoredFile { key: string; batchId: string; fileId: string; name: string; type: string; blob: Blob }

function request<T>(value: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    value.onsuccess = () => resolve(value.result);
    value.onerror = () => reject(value.error ?? new Error('Local storage request failed.'));
  });
}

function transactionDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Local storage transaction failed.'));
    tx.onabort = () => reject(tx.error ?? new Error('Local storage transaction was interrupted.'));
  });
}

export function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const opening = indexedDB.open(databaseName(), DB_VERSION);
    opening.onupgradeneeded = () => {
      const db = opening.result;
      const manifests = db.createObjectStore('manifests', { keyPath: 'id' });
      manifests.createIndex('createdAt', 'createdAt');
      const chunks = db.createObjectStore('chunks', { keyPath: 'key' });
      chunks.createIndex('batchId', 'batchId');
      chunks.createIndex('fileId', ['batchId', 'fileId']);
      const files = db.createObjectStore('files', { keyPath: 'key' });
      files.createIndex('batchId', 'batchId');
      const receipts = db.createObjectStore('receipts', { keyPath: 'id' });
      receipts.createIndex('createdAt', 'createdAt');
    };
    opening.onsuccess = () => resolve(opening.result);
    opening.onerror = () => reject(opening.error ?? new Error('Could not open local storage.'));
  });
}

export async function resetDemoDatabase(): Promise<void> {
  if (!isDemoMode()) throw new Error('Demo data can only be reset from the demo.');
  await new Promise<void>((resolve, reject) => {
    const deletion = indexedDB.deleteDatabase(DEMO_DB_NAME);
    deletion.onsuccess = () => resolve();
    deletion.onerror = () => reject(deletion.error ?? new Error('Could not reset demo data.'));
    deletion.onblocked = () => reject(new Error('Close other demo tabs, then reset again.'));
  });
}

export async function saveManifest(manifest: BatchManifest): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction('manifests', 'readwrite');
  tx.objectStore('manifests').put(manifest);
  await transactionDone(tx);
  db.close();
}

export async function getManifest(id: string): Promise<BatchManifest | undefined> {
  const db = await openDatabase();
  const tx = db.transaction('manifests');
  const result = await request<BatchManifest | undefined>(tx.objectStore('manifests').get(id));
  db.close();
  return result;
}

export async function saveChunk(batchId: string, fileId: string, index: number, buffer: ArrayBuffer): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction('chunks', 'readwrite');
  const value: StoredChunk = { key: `${batchId}:${fileId}:${index}`, batchId, fileId, index, blob: new Blob([buffer]) };
  tx.objectStore('chunks').put(value);
  await transactionDone(tx);
  db.close();
}

export async function chunkIndexes(batchId: string, fileId: string): Promise<number[]> {
  const db = await openDatabase();
  const tx = db.transaction('chunks');
  const entries = await request<StoredChunk[]>(tx.objectStore('chunks').index('fileId').getAll([batchId, fileId]));
  db.close();
  return entries.map((entry) => entry.index).sort((a, b) => a - b);
}

export async function assembleFile(batchId: string, fileId: string, name: string, type: string): Promise<Blob> {
  const db = await openDatabase();
  const readTx = db.transaction('chunks');
  const entries = await request<StoredChunk[]>(readTx.objectStore('chunks').index('fileId').getAll([batchId, fileId]));
  entries.sort((a, b) => a.index - b.index);
  const blob = new Blob(entries.map((entry) => entry.blob), { type });
  const writeTx = db.transaction('files', 'readwrite');
  const stored: StoredFile = { key: `${batchId}:${fileId}`, batchId, fileId, name, type, blob };
  writeTx.objectStore('files').put(stored);
  await transactionDone(writeTx);
  db.close();
  return blob;
}

export async function listStoredFiles(batchId: string): Promise<StoredFile[]> {
  const db = await openDatabase();
  const tx = db.transaction('files');
  const result = await request<StoredFile[]>(tx.objectStore('files').index('batchId').getAll(batchId));
  db.close();
  return result;
}

export async function saveReceipt(receipt: IntakeReceipt): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction('receipts', 'readwrite');
  tx.objectStore('receipts').put(receipt);
  await transactionDone(tx);
  db.close();
}

export async function listReceipts(): Promise<IntakeReceipt[]> {
  const db = await openDatabase();
  const tx = db.transaction('receipts');
  const result = await request<IntakeReceipt[]>(tx.objectStore('receipts').getAll());
  db.close();
  return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function clearBatch(batchId: string): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction(['manifests', 'chunks', 'files'], 'readwrite');
  tx.objectStore('manifests').delete(batchId);
  for (const storeName of ['chunks', 'files']) {
    const store = tx.objectStore(storeName);
    const index = store.index('batchId');
    const cursor = index.openCursor(IDBKeyRange.only(batchId));
    cursor.onsuccess = () => {
      const current = cursor.result;
      if (current) { current.delete(); current.continue(); }
    };
  }
  await transactionDone(tx);
  db.close();
}
