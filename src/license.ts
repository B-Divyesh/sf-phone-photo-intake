const SLUG = 'phone-photo-intake';
const KEY = `sb_license:${SLUG}`;
const CACHE_KEY = `${KEY}:verdict`;
const BILLING_BASE = (import.meta.env.VITE_BILLING_BASE as string | undefined) ?? 'https://api.sociobot.in';

interface CachedVerdict { valid: boolean; checkedAt: number; reason?: string }

export const checkoutUrl = `${BILLING_BASE}/api/v1/products/${SLUG}/checkout`;

export function captureReturnedLicense(): void {
  const url = new URL(location.href);
  const token = url.searchParams.get('license');
  if (!token) return;
  localStorage.setItem(KEY, token);
  localStorage.removeItem(CACHE_KEY);
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

export function storedLicense(): string { return localStorage.getItem(KEY) ?? ''; }

export function hasCachedUnlock(): boolean {
  try {
    const verdict = JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null') as CachedVerdict | null;
    return Boolean(storedLicense() && verdict?.valid);
  } catch { return false; }
}

export async function verifyLicense(force = false): Promise<{ valid: boolean; reason: string }> {
  const token = storedLicense();
  if (!token) return { valid: false, reason: 'missing' };
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null') as CachedVerdict | null;
    if (!force && cached && Date.now() - cached.checkedAt < 86_400_000) return { valid: cached.valid, reason: cached.reason ?? 'cached' };
  } catch { /* verify below */ }
  try {
    const response = await fetch(`${BILLING_BASE}/api/v1/products/${SLUG}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('verification unavailable');
    const result = await response.json() as { valid: boolean; reason: string };
    localStorage.setItem(CACHE_KEY, JSON.stringify({ valid: result.valid, reason: result.reason, checkedAt: Date.now() } satisfies CachedVerdict));
    return result;
  } catch {
    return { valid: hasCachedUnlock(), reason: 'offline' };
  }
}

export function saveLicense(token: string): void {
  localStorage.setItem(KEY, token.trim());
  localStorage.removeItem(CACHE_KEY);
}
