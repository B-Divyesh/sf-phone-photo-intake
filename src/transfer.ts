import { hashBlob } from './hash';
import { decodePairing, encodePairing, waitForIce } from './pairing';
import { assembleFile, chunkIndexes, saveChunk, saveManifest, saveReceipt } from './storage';
import { createReceipt } from './receipt';
import { CHUNK_SIZE, type BatchManifest, type FileResult, type IntakeReceipt, type WireMessage } from './types';

interface SessionCallbacks {
  onState: (state: string) => void;
  onProgress: (received: number, total: number, label: string) => void;
  onManifest?: (manifest: BatchManifest) => void;
  onReceipt: (receipt: IntakeReceipt) => void;
  onError: (message: string) => void;
}

export class TransferSession {
  private peer?: RTCPeerConnection;
  private channel?: RTCDataChannel;
  private files = new Map<string, File>();
  private manifest?: BatchManifest;
  private pendingChunk?: { fileId: string; index: number; size: number };
  private receiveQueue = Promise.resolve();
  private results = new Map<string, FileResult>();
  private receiptMade = false;

  constructor(private callbacks: SessionCallbacks) {}

  async makeOffer(manifest: BatchManifest, sourceFiles: Map<string, File>): Promise<string> {
    this.close();
    this.manifest = manifest;
    this.files = new Map(sourceFiles);
    this.peer = this.makePeer();
    this.channel = this.peer.createDataChannel('photo-intake', { ordered: true });
    this.bindSender(this.channel);
    await this.peer.setLocalDescription(await this.peer.createOffer());
    await waitForIce(this.peer);
    this.callbacks.onState('Offer ready — move this code to the receiving device.');
    return encodePairing(this.peer.localDescription!);
  }

  async acceptOffer(code: string): Promise<string> {
    this.close();
    this.peer = this.makePeer();
    this.peer.ondatachannel = (event) => {
      this.channel = event.channel;
      this.bindReceiver(event.channel);
    };
    await this.peer.setRemoteDescription(decodePairing(code));
    await this.peer.setLocalDescription(await this.peer.createAnswer());
    await waitForIce(this.peer);
    this.callbacks.onState('Answer ready — return this code to the sending device.');
    return encodePairing(this.peer.localDescription!);
  }

  async applyAnswer(code: string): Promise<void> {
    if (!this.peer) throw new Error('Create a sender code first.');
    await this.peer.setRemoteDescription(decodePairing(code));
    this.callbacks.onState('Pairing… keep both screens open.');
  }

  close(): void {
    this.channel?.close();
    this.peer?.close();
    this.channel = undefined;
    this.peer = undefined;
    this.receiptMade = false;
    this.manifest = undefined;
    this.files.clear();
    this.results.clear();
    this.pendingChunk = undefined;
  }

  private makePeer(): RTCPeerConnection {
    const peer = new RTCPeerConnection({ iceServers: [] });
    peer.onconnectionstatechange = () => {
      const state = peer.connectionState;
      if (state === 'connected') this.callbacks.onState('Encrypted local connection established.');
      if (state === 'disconnected') this.callbacks.onState('Connection interrupted. Pair again to resume received chunks.');
      if (state === 'failed') this.callbacks.onError('The devices could not connect. Confirm they are on the same local network, then create fresh pairing codes.');
    };
    return peer;
  }

  private bindSender(channel: RTCDataChannel): void {
    channel.binaryType = 'arraybuffer';
    channel.bufferedAmountLowThreshold = 512 * 1024;
    channel.onopen = () => {
      this.callbacks.onState('Connected. Comparing the destination before sending…');
      this.send({ type: 'manifest', manifest: this.manifest! });
    };
    channel.onmessage = (event) => {
      if (typeof event.data !== 'string') return;
      const message = JSON.parse(event.data) as WireMessage;
      if (message.type === 'need') void this.sendMissing(message.missing);
      if (message.type === 'file-result') this.callbacks.onState(message.status === 'verified' ? `Verified ${this.files.get(message.fileId)?.name ?? 'file'}.` : 'A destination hash did not match.');
      if (message.type === 'receipt') {
        void saveReceipt(message.receipt);
        this.callbacks.onReceipt(message.receipt);
        this.callbacks.onState(message.receipt.safeToDelete ? 'Receipt complete. Selected phone originals are safe to delete.' : 'Receipt complete with missing or changed files. Keep the originals.');
      }
      if (message.type === 'error') this.callbacks.onError(message.message);
    };
  }

  private bindReceiver(channel: RTCDataChannel): void {
    channel.binaryType = 'arraybuffer';
    channel.onopen = () => this.callbacks.onState('Connected. Waiting for the source manifest…');
    channel.onmessage = (event) => {
      this.receiveQueue = this.receiveQueue.then(async () => {
        if (typeof event.data === 'string') await this.receiveControl(JSON.parse(event.data) as WireMessage);
        else await this.receiveChunk(event.data as ArrayBuffer);
      }).catch((error: unknown) => this.callbacks.onError(error instanceof Error ? error.message : 'The incoming transfer failed.'));
    };
  }

  private async receiveControl(message: WireMessage): Promise<void> {
    if (message.type === 'manifest') {
      this.manifest = message.manifest;
      await saveManifest(message.manifest);
      this.callbacks.onManifest?.(message.manifest);
      const missing: Record<string, number[]> = {};
      let resumedBytes = 0;
      for (const file of message.manifest.files) {
        const existing = new Set(await chunkIndexes(message.manifest.id, file.id));
        missing[file.id] = Array.from({ length: file.chunks }, (_, index) => index).filter((index) => !existing.has(index));
        resumedBytes += file.size - missing[file.id].reduce((sum, index) => sum + Math.min(CHUNK_SIZE, file.size - index * CHUNK_SIZE), 0);
        this.results.set(file.id, { ...file, receivedBytes: file.size - missing[file.id].reduce((sum, index) => sum + Math.min(CHUNK_SIZE, file.size - index * CHUNK_SIZE), 0), status: 'receiving' });
      }
      this.callbacks.onProgress(resumedBytes, message.manifest.totalBytes, resumedBytes ? 'Resuming from verified local chunks' : 'Destination is ready');
      this.send({ type: 'need', missing });
      await this.finalizeCompletedFiles();
    }
    if (message.type === 'chunk-meta') this.pendingChunk = message;
    if (message.type === 'error') this.callbacks.onError(message.message);
  }

  private async receiveChunk(buffer: ArrayBuffer): Promise<void> {
    if (!this.pendingChunk || !this.manifest) throw new Error('Received file data without its chunk record. Pair again to resume safely.');
    const meta = this.pendingChunk;
    this.pendingChunk = undefined;
    if (buffer.byteLength !== meta.size) throw new Error('A received chunk changed size. Pair again; the saved chunks will be reused.');
    await saveChunk(this.manifest.id, meta.fileId, meta.index, buffer);
    const result = this.results.get(meta.fileId);
    if (result) result.receivedBytes = Math.min(result.size, result.receivedBytes + buffer.byteLength);
    const total = Array.from(this.results.values()).reduce((sum, file) => sum + file.receivedBytes, 0);
    this.callbacks.onProgress(total, this.manifest.totalBytes, result?.name ?? 'Receiving');
    if (result && result.receivedBytes === result.size) await this.verifyFile(result);
  }

  private async finalizeCompletedFiles(): Promise<void> {
    for (const result of this.results.values()) if (result.receivedBytes === result.size) await this.verifyFile(result);
    await this.maybeFinish();
  }

  private async verifyFile(result: FileResult): Promise<void> {
    if (!this.manifest || result.status === 'verified' || result.status === 'changed') return;
    const blob = await assembleFile(this.manifest.id, result.id, result.name, result.type);
    const destinationSha256 = await hashBlob(blob);
    result.destinationSha256 = destinationSha256;
    result.status = destinationSha256 === result.sha256 ? 'verified' : 'changed';
    this.send({ type: 'file-result', fileId: result.id, status: result.status, sha256: destinationSha256 });
    await this.maybeFinish();
  }

  private async maybeFinish(): Promise<void> {
    if (!this.manifest || this.receiptMade || this.results.size !== this.manifest.files.length) return;
    if (Array.from(this.results.values()).some((file) => file.status === 'receiving' || file.status === 'pending')) return;
    this.receiptMade = true;
    const receipt = await createReceipt(this.manifest, Array.from(this.results.values()));
    await saveReceipt(receipt);
    this.send({ type: 'receipt', receipt });
    this.callbacks.onReceipt(receipt);
  }

  private async sendMissing(missing: Record<string, number[]>): Promise<void> {
    if (!this.channel || !this.manifest) return;
    const totalMissing = Object.values(missing).reduce((sum, chunks) => sum + chunks.length, 0);
    if (totalMissing === 0) {
      this.callbacks.onState('The destination already has every chunk; checking hashes.');
      return;
    }
    let sent = 0;
    for (const fileMeta of this.manifest.files) {
      const file = this.files.get(fileMeta.id);
      if (!file) { this.send({ type: 'error', message: `The source file ${fileMeta.name} is no longer selected.` }); continue; }
      for (const index of missing[fileMeta.id] ?? []) {
        await this.waitForBuffer();
        const buffer = await file.slice(index * CHUNK_SIZE, Math.min((index + 1) * CHUNK_SIZE, file.size)).arrayBuffer();
        this.send({ type: 'chunk-meta', fileId: fileMeta.id, index, size: buffer.byteLength });
        this.channel.send(buffer);
        sent += 1;
        this.callbacks.onProgress(sent, totalMissing, `Sending ${fileMeta.name}`);
      }
    }
    this.callbacks.onState('All needed chunks sent. Destination is checking hashes…');
  }

  private async waitForBuffer(): Promise<void> {
    if (!this.channel || this.channel.bufferedAmount < 2 * 1024 * 1024) return;
    await new Promise<void>((resolve) => this.channel!.addEventListener('bufferedamountlow', () => resolve(), { once: true }));
  }

  private send(message: WireMessage): void {
    if (this.channel?.readyState === 'open') this.channel.send(JSON.stringify(message));
  }
}
