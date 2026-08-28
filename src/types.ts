export const CHUNK_SIZE = 64 * 1024;

export interface IntakeFile {
  id: string;
  name: string;
  type: string;
  size: number;
  modified: number;
  relativePath: string;
  sha256: string;
  chunks: number;
}

export interface BatchManifest {
  id: string;
  createdAt: string;
  sourceLabel: string;
  files: IntakeFile[];
  totalBytes: number;
}

export interface FileResult extends IntakeFile {
  receivedBytes: number;
  destinationSha256?: string;
  status: 'pending' | 'receiving' | 'verified' | 'changed' | 'missing';
}

export interface IntakeReceipt {
  version: 1;
  id: string;
  batchId: string;
  createdAt: string;
  sourceCount: number;
  destinationCount: number;
  sourceBytes: number;
  receivedBytes: number;
  files: FileResult[];
  seal: string;
  safeToDelete: boolean;
  scopeNote: string;
}

export type WireMessage =
  | { type: 'manifest'; manifest: BatchManifest }
  | { type: 'need'; missing: Record<string, number[]> }
  | { type: 'chunk-meta'; fileId: string; index: number; size: number }
  | { type: 'file-result'; fileId: string; status: 'verified' | 'changed'; sha256: string }
  | { type: 'receipt'; receipt: IntakeReceipt }
  | { type: 'error'; message: string };
