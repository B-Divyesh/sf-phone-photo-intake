import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('static deployment policy', () => {
  it('sets immutable caching for hashed assets and fresh PWA control files', async () => {
    const policy = JSON.parse(await readFile(new URL('../public/staticwebapp.config.json', import.meta.url), 'utf8')) as {
      globalHeaders: Record<string, string>;
      mimeTypes: Record<string, string>;
      routes: Array<{ route: string; headers: Record<string, string> }>;
    };
    const headersFor = (route: string) => policy.routes.find((entry) => entry.route === route)?.headers;

    expect(headersFor('/assets/*')?.['Cache-Control']).toContain('immutable');
    expect(headersFor('/sw.js')?.['Cache-Control']).toBe('no-cache');
    expect(headersFor('/manifest.webmanifest')?.['Content-Type']).toBe('application/manifest+json');
    expect(policy.mimeTypes['.webmanifest']).toBe('application/manifest+json');
  });

  it('ships the documented browser security boundaries', async () => {
    const policy = JSON.parse(await readFile(new URL('../public/staticwebapp.config.json', import.meta.url), 'utf8')) as { globalHeaders: Record<string, string> };
    expect(policy.globalHeaders['Content-Security-Policy']).toContain("default-src 'self'");
    expect(policy.globalHeaders['Permissions-Policy']).toContain('camera=()');
    expect(policy.globalHeaders['Cross-Origin-Embedder-Policy']).toBe('require-corp');
    expect(policy.globalHeaders['Cross-Origin-Opener-Policy']).toBe('same-origin');
  });
});
