# Photo Intake Receipt — polish round 2 handoff

**Work order:** `phone-photo-intake-polish-2`

**Result:** PASS — all cumulative findings resolved

**Released candidate:** `872fe83a274d46783e54a3d0b0da127078ffa550`

**Review commit:** `c6e0006c07ce4343629cb5ab364d530c68571691`

**Repair commit:** `1f121d8f27c3bad8ea244fee462d16d633e7ea0d`

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

Clean clone `/tmp/phone-photo-intake-polish-2.sit9xq` at `1f121d8f27c3bad8ea244fee462d16d633e7ea0d`:

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
