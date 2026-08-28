# Photo Intake Receipt — polish round 1 handoff

**Work order:** `phone-photo-intake-polish-1-all-findings`

**Result:** PASS — all cumulative findings resolved

**Candidate polished:** `5414d1e18754928ffd1c76ec6784af797033edf3`

**Review commit:** `40cf93b6ef1822c41a40d8c0970e712f6b6ea6f2`

**Repair commit:** `f36f169826984693f5dbe01bd6d9353343fd7f92`

**Production:** <https://phone-photo-intake.sociobot.in>

**Deployment ID:** `6e51d624-fc61-42e8-9be4-e2a21117297b`

## Delivered

- Verified and retained the plain first screen, one-click `/demo` and `?demo=1` sandbox, completed/interrupted sample data, banner, reset, and start-real exit.
- Verified separate demo storage and added a registry integrity test so every public claim has exactly one listed test tag.
- Added the last missing product behavior: a direct connection that cannot reach its peer now ends after 20 seconds with a specific same-network recovery step.
- Extended the same-network claim test to prove both successful direct transfer and the unreachable-peer outcome.
- Re-verified real route titles, metadata, canonical links, History API focus, legal routes, shared structure, HTTP 404, file-picker focus, mobile targets, no overflow, offline behavior, and no dead checkout.
- Preserved the product’s blueprint drafting-sheet identity. No generic template or third-party visual asset was introduced.
- Updated the PWA cache/start versions, product version to 1.0.2, catalog description, copy audit, and complete finding map.

The exhaustive finding-to-change-to-evidence record is [`.factory/polish-1.md`](polish-1.md). Screenshots and machine-readable reports are in [`.factory/evidence/polish-1/`](evidence/polish-1/).

## Clean-clone verification

Clone: `/tmp/phone-photo-intake-polish-1.GPDPJH` at `f36f169826984693f5dbe01bd6d9353343fd7f92`.

- `npm ci`: PASS — 149 packages, 0 vulnerabilities.
- All 17 `.factory/claims.json` commands, invoked separately: PASS.
- `npm test`: PASS — 5 files, 13 tests.
- `npm run build`: PASS — `dist/` produced.
- Build size: JS 40.08 kB raw / 14.01 kB gzip; CSS 16.33 kB raw / 4.32 kB gzip; hero 58.46 kB.
- `npm run test:e2e`: PASS — 14 passed, 8 intentional viewport duplicates skipped.
- Resume campaign: PASS — 20/20 fresh interruption/reconnect runs retained saved parts.
- Desktop and 390 × 844 checks: PASS — copy, routing, focus, touch targets, mobile overflow, axe baseline, legal pages, downloads, real WebRTC transfer, privacy boundary, offline reload, and 404.
- `npx cap sync android`: PASS.

## Accessibility, privacy, offline, and performance

- Local `verify-url.sh`: 602 ms load, zero console errors, `lang=en`, one H1, one main, no missing alt, no unlabeled buttons.
- Local axe CLI on four product routes: zero violations.
- Local Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.8 s, CLS 0, TBT 30 ms.
- The full transfer privacy test observed only `http://127.0.0.1:4173` requests and no external script/style origin.
- Offline claim test reloaded `/demo` under `context.setOffline(true)` and opened its seeded receipt.
- Reduced motion, visible focus, bound labels, live errors/status, semantic landmarks, and 44 px mobile targets are covered by source and browser tests.

## Production verification after deployment

Cold checks used fresh 390 × 844 Chromium contexts after deployment.

| Route | HTTP | Title | H1 |
| --- | ---: | --- | --- |
| `/` | 200 | Photo Intake Receipt — move and verify phone photos | Move phone photos to your PC, then verify |
| `/demo` | 200 | Demo — Photo Intake Receipt | Review a finished photo transfer |
| `/?demo=1` | 200 | Demo — Photo Intake Receipt | Review a finished photo transfer |
| `/privacy/` | 200 | Privacy — Photo Intake Receipt | Privacy, drawn plainly |
| `/terms/` | 200 | Terms — Photo Intake Receipt | Terms of use |
| `/does-not-exist` | 404 | Page not found — Photo Intake Receipt | Page not found |

Additional production results:

- `verify-url.sh`: 951 ms, zero app console errors, one H1/main, correct language and image/button labels.
- axe CLI: zero violations across all five route types, including the 404.
- Lighthouse: performance 99, accessibility 100, best practices 100, SEO 100; LCP 1.3 s, CLS 0, TBT 120 ms.
- Demo reset and **Start for real** preserved a production local-storage sentinel.
- Offline `/demo` reload passed after service-worker control.
- Root, metadata, sitemap, manifest, icons, social image, legal pages, and demo returned 200; unknown route returned 404.
- CSP, Referrer-Policy, X-Content-Type-Options, COEP, COOP, and Permissions-Policy headers are live.
- Screenshot review confirmed the blueprint identity and usable 390 px layouts: [home](evidence/polish-1/live/screenshot-mobile.png), [demo](evidence/polish-1/live/demo-mobile.png), [404](evidence/polish-1/live/404-mobile.png).

## Run again

```sh
npm ci
npm test
npm run build
npm run test:e2e
npx cap sync android
```

Run every `test` value in `.factory/claims.json` separately for claim verification.

## Known gaps and next steps

No known product, review, accessibility, privacy, offline, routing, claim, mobile, or deployment gap remains in this work order.

The repository contains and syncs the required Capacitor Android project. The orchestrator assigned APK compilation/signing to a later Android work order; this static worker has no Java runtime or Android SDK, so no APK was built here.
