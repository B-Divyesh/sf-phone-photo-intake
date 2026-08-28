# Photo Intake Receipt — polish round 1 handoff

**Work order:** `phone-photo-intake-polish-1`

**Result:** PASS — no blocking review finding remains

**Review base:** `40cf93b6ef1822c41a40d8c0970e712f6b6ea6f2`

**Clean-clone verified source:** `bda8b31c0289d89a91b68ba8690e8fa3ec4f4356`

**Production URL:** <https://phone-photo-intake.sociobot.in>

**Deployment ID:** `72c01bdc-c3fa-4c8a-9185-7a47316f53ac`

## What changed

- Rewrote the first screen around the phone-to-PC job, named its audience, added the sample and real actions, and stated privacy, offline, and free limits.
- Added `/demo` and `?demo=1` with a completed three-file harbour receipt, an interrupted four-part transfer, a persistent demo banner, reset, and exit controls.
- Isolated demo state in `demo:photo-intake-receipt`; demo mode never reads the production database or license key.
- Added `.factory/claims.json` with 17 claims. Every claim ID occurs in exactly one tagged test.
- Added real SPA routes, route-specific titles/descriptions/canonicals/social metadata, direct-load and reload coverage, H1 focus, announcements, shared navigation/footer, and a styled 404.
- Removed the dead paid checkout. The app now states that larger transfers are unavailable and renders no purchase action.
- Added visible file-picker focus, 44 px header/footer targets, visible mobile navigation, no-overflow checks, and the corrected PC-code error.
- Kept the original blueprint drafting-sheet identity and documented its demo, error-page, and social-image treatments.
- Updated the catalog sentence, copy audit, README, demo notes, sitemap, security policy, service worker, and Capacitor project checks.

## Clean-clone evidence

Verification used `/tmp/phone-photo-intake-polish.HuL2QT`, cloned without hardlinks at `bda8b31c0289d89a91b68ba8690e8fa3ec4f4356`.

- `npm ci`: 149 packages installed; 0 vulnerabilities.
- Every one of the 17 commands in `.factory/claims.json`: PASS when invoked separately.
- `npm test`: 4 files and 12 tests passed.
- `npm run build`: PASS; `dist/` produced.
- Production assets: JS 39.51 kB raw / 13.91 kB gzip; CSS 16.33 kB raw / 4.32 kB gzip; hero 58.46 kB.
- `npm run test:e2e`: 14 passed; 8 intentional mobile duplicates skipped. The run covered desktop and 390 × 844 mobile layouts, route reloads, focus, touch targets, axe, demo isolation, privacy, offline reload, downloads, and two-peer WebRTC.
- Resume claim: 20 of 20 fresh interruption/reconnect runs completed; already-saved parts were not resent.
- Playwright axe integration: zero serious or critical issues on `/`, `/demo`, `/privacy/`, `/terms/`, and the 404 in both projects.
- Local `verify-url.sh`: title present, `lang=en`, one H1, one main, 0 missing alt attributes, 0 unlabeled buttons, and 0 console errors.
- Local Lighthouse 12.8.2 mobile: performance 96, accessibility 100, best practices 100, SEO 100; LCP 1.7 s, CLS 0, TBT 220 ms.
- `npx cap sync android`: PASS. The Android app ID remains `in.sociobot.phonephotointake` and uses `dist/`.

## Live evidence

`/opt/fleet/lib/deploy-static.sh phone-photo-intake /work/repo/dist` reused `sf-phone-photo-intake` in `eastus2`, uploaded 374,837 bytes, and completed the deployment above.

`verify-url.sh https://phone-photo-intake.sociobot.in` reported a 954 ms load, no console errors, `lang=en`, one H1, one main, no missing alt attributes, and no unlabeled buttons.

HTTP and metadata checks after deployment:

| Route | HTTP | Title |
| --- | ---: | --- |
| `/` | 200 | Photo Intake Receipt — move and verify phone photos |
| `/demo` | 200 | Demo — Photo Intake Receipt |
| `/privacy/` | 200 | Privacy — Photo Intake Receipt |
| `/terms/` | 200 | Terms — Photo Intake Receipt |
| `/does-not-exist` | 404 | Page not found — Photo Intake Receipt |
| `/robots.txt` | 200 | — |
| `/sitemap.xml` | 200 | — |
| `/manifest.webmanifest` | 200 | — |

The demo, privacy, terms, and 404 routes also exposed their matching H1 and canonical URL in a fresh 390 × 844 Chromium page.

## Run and verify

```sh
npm ci
npm test
npm run build
npm run test:e2e
jq -r '.[] | [.id, .test] | @tsv' .factory/claims.json
```

For each row from the final command, run its `test` value separately from a clean clone.

## Remaining scope

There are no known blocking product, accessibility, claim, privacy, offline, routing, or deployment gaps.

This was a static PWA work order. The Capacitor project is present and synchronized, but this worker image has no Java runtime, so `./gradlew test assembleDebug` could not start. APK building, signing, and distribution remain assigned to the later Android work order, as required by the stack decision.

The ₹499 product is not enabled in the Sociobot billing API. The dead checkout was removed; no paid capability or purchase claim is shown.
