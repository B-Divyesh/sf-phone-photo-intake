import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

interface Claim {
  id: string;
  claim: string;
  where: string;
  test: string;
  sandbox: string;
}

describe('public claim registry', () => {
  it('maps every claim id to exactly one tagged test and no test tag is unlisted', async () => {
    const claims = JSON.parse(await readFile(new URL('../.factory/claims.json', import.meta.url), 'utf8')) as Claim[];
    const testSources = await Promise.all([
      readFile(new URL('./e2e/app.spec.ts', import.meta.url), 'utf8'),
      readFile(new URL('./deployment-policy.test.ts', import.meta.url), 'utf8'),
    ]);
    const source = testSources.join('\n');
    const ids = claims.map(({ id }) => id);

    expect(new Set(ids).size).toBe(ids.length);
    for (const claim of claims) {
      expect(claim.claim.trim()).not.toBe('');
      expect(claim.where.trim()).not.toBe('');
      expect(claim.sandbox.trim()).not.toBe('');
      expect(claim.test).toContain(`@claim:${claim.id}`);
      expect(source.match(new RegExp(`@claim:${claim.id}(?![a-z0-9-])`, 'g')) ?? []).toHaveLength(1);
    }

    const taggedIds = [...source.matchAll(/@claim:([a-z0-9-]+)/g)].map((match) => match[1]);
    expect([...new Set(taggedIds)].sort()).toEqual([...ids].sort());
  });
});
