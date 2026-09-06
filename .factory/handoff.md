# Photo Intake Receipt — review 4 handoff

> **Review 4 update (2026-09-06): FAIL.** The implementation and all 17 tested public claims passed a fresh-clone and live review, but one minor plain-words defect remains: the privacy H1 says “Privacy, drawn plainly” and the 404 has the decorative “Drawing missing” label. The required zero-finding standard is not met. See [review-4.md](review-4.md). No product code changed in this review.

**Reviewed implementation candidate:** `1f121d8f27c3bad8ea244fee462d16d633e7ea0d`<br>
**Documentation HEAD reviewed:** `b000b0ab9c78600e776d152fd75c77a0db747a6a`

## Current handoff

- `npm ci`, `npm test`, `npm run build`, `npm run test:e2e`, the direct Playwright/axe keyboard check, and all 17 individual claim commands passed from a clean clone.
- Live phone and desktop review passed the first-screen, demo isolation/reset/exit, transfer, offline, privacy, routes, links, focus, 404, and response-policy checks.
- The only known gap is `F4-1` in [review-4.md](review-4.md). Replace the themed legal/404 wording with plain labels and add a regression before calling the product PASS.

---

> **Review 3 update (2026-08-28): PASS.** An independent cold mobile/desktop review of `cbcf18042a1b4b43871e745689d4ae565dd2b96c` found zero findings and changed no product code. In fresh clone `/tmp/phone-photo-intake-review-3.gKZTp4`, `npm test`, `npm run build`, and every one of the 17 individually invoked claim commands passed. The live review confirmed first-read clarity, the seeded isolated/offline demo, production-storage isolation, same-origin network behaviour, routes/links/focus/404, and the documented visual identity. Full evidence, the required landing/README sentence audit, historic-finding regression matrix, and verification table are in [review-3.md](review-3.md). No known gap remains; repeat the full review after user-visible, storage, or network changes.

**Work order:** `phone-photo-intake-polish-2`

**Result:** PASS — all cumulative findings resolved

**Released candidate:** `872fe83a274d46783e54a3d0b0da127078ffa550`

**Review commit:** `c6e0006c07ce4343629cb5ab364d530c68571691`

**Repair commit:** `1f121d8f27c3bad8ea244fee462d16d633e7ea0d`

**Evidence commit:** `043927d83d10f2d8f9777e83081b15c5cde9d493`

**Deployment:** `6ba78f65-ed39-4072-8e72-39d3aaad4bed`

**Production:** <https://phone-photo-intake.sociobot.in>

## Delivered

- Resolved `F-2-1` by replacing the README’s WebRTC, SHA-256, relay, and browser-storage terms with plain descriptions of the user’s job.
- Added automated guards for the README wording and verb-first, 120-character catalog limit.
- Updated the catalog sentence to: “Move selected phone photos to a PC, check each copy, and keep a receipt before deleting originals.”
- Rechecked every round-1 finding and all 21 earlier claim-table findings against source, tests, and production.
- Preserved and rechecked the one-click isolated `?demo=1` sample, banner, reset, exit, titles, metadata, real routes, focus, 404, legal links, mobile layout, and blueprint visual system.
- Released build `1.0.3 · polish 2`, advanced the PWA cache/install version, pushed the repair, and deployed the static artifact.

The complete finding-to-change-to-evidence matrix is [`.factory/polish-2.md`](polish-2.md). Machine-readable reports and screenshots are in [`.factory/evidence/polish-2/`](evidence/polish-2/).

## Verification

Final clean clone `/tmp/phone-photo-intake-polish-2-final.USISf8` at `043927d83d10f2d8f9777e83081b15c5cde9d493`:

- `npm ci`: PASS — 149 packages, zero vulnerabilities.
- `npm test`: PASS — 6 files, 15 tests.
- `npm run build`: PASS — `dist/` produced.
- Build: JS 40.08 kB raw / 14.01 kB gzip; CSS 16.33 kB raw / 4.32 kB gzip; hero 58.46 kB.
- Every command in `.factory/claims.json`, invoked separately: PASS — 17/17.
- `npm run test:e2e`: PASS — 14 passed, 8 intentional mobile duplicates skipped.
- Resume campaign: PASS — 20/20 fresh interruption/reconnect runs retained saved parts.
- `npx cap sync android`: PASS.

Local and production quality checks:

- `verify-url.sh`: PASS locally and live; no console errors, one H1/main, `lang=en`, and complete image/button names.
- axe CLI 4.10.3: zero violations on `/`, `/demo`, `/privacy/`, `/terms/`, and the 404, locally and live.
- Local Lighthouse: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.7 s, CLS 0, TBT 0 ms.
- Live Lighthouse: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.4 s, CLS 0, TBT 60 ms.
- Live cold browser: first-screen copy, `?demo=1`, isolation/reset/exit, route statuses/titles/H1s, History focus, 44 px targets, no overflow, file-picker focus, same-origin requests, offline reload, no checkout, and real two-peer transfer all passed.
- Security headers are live: CSP, Referrer-Policy, X-Content-Type-Options, COEP, COOP, Permissions-Policy, and HSTS.

## Run again

```sh
npm ci
npm test
npm run build
npm run test:e2e
npx cap sync android
node scripts/verify-live.mjs https://phone-photo-intake.sociobot.in .factory/evidence/polish-2/live
```

Run every `test` value in `.factory/claims.json` separately for the complete claim audit.

## Known gaps and next steps

No review, product, accessibility, privacy, offline, routing, claims, mobile, performance, or deployment gap remains.

The repository contains and syncs the required Capacitor Android project. APK compilation and signing remain assigned to the later Android work order by the stack decision; this work order remains a static PWA deployment.
