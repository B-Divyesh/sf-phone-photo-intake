import { describe, expect, it } from 'vitest';
import { Sha256, hashBlob, hashText } from '../src/hash';

describe('SHA-256', () => {
  it('matches standard vectors', async () => {
    expect(await hashText('')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    expect(await hashText('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });

  it('is incremental across arbitrary chunk boundaries', () => {
    const hash = new Sha256();
    hash.update(new TextEncoder().encode('a'));
    hash.update(new TextEncoder().encode('bc'));
    expect(hash.hex()).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });

  it('hashes a multi-block blob without changing it', async () => {
    const blob = new Blob(['photo-bytes'.repeat(100_000)]);
    const progress: number[] = [];
    const digest = await hashBlob(blob, (ratio) => progress.push(ratio));
    expect(digest).toMatch(/^[a-f0-9]{64}$/);
    expect(progress.at(-1)).toBe(1);
    expect(blob.size).toBe(1_100_000);
  });
});
