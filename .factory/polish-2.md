# Photo Intake Receipt — polish round 2

**Work order:** `phone-photo-intake-polish-2`

**Released candidate:** `872fe83a274d46783e54a3d0b0da127078ffa550`

**Review commit:** `c6e0006c07ce4343629cb5ab364d530c68571691`

**Repair commit:** `1f121d8f27c3bad8ea244fee462d16d633e7ea0d`

**Evidence commit:** `043927d83d10f2d8f9777e83081b15c5cde9d493`

**Deployment:** `6ba78f65-ed39-4072-8e72-39d3aaad4bed`

**Live URL:** <https://phone-photo-intake.sociobot.in>

Every finding in `review-2.md`, `review-1.md`, and `polish-1.md` was checked again. The round-2 README defect was repaired. Earlier fixes remain present and passed their regression and live checks.

## Review 2 finding

| Finding ID | Change made | Test evidence | Screenshot | Live URL check |
| --- | --- | --- | --- | --- |
| `F-2-1` | Replaced WebRTC, SHA-256, relay, and browser-storage wording in the visitor-facing README bullets with direct phone-to-PC, received-copy, and on-device wording. Added a regression test and refreshed the complete copy audit. | `plain-language product copy > keeps the README core job free of implementation jargon`; `@claim:direct-local-transfer`; `@claim:verified-receipt`; `@claim:local-device-storage` | [mobile home](evidence/polish-2/live/screenshot-mobile.png) | `/` returned 200 with build `1.0.3 · polish 2`; the three mapped behavior claims passed against the deployed artifact. |

## Earlier review findings

| Finding ID | Change retained or strengthened | Test evidence | Screenshot | Live URL check |
| --- | --- | --- | --- | --- |
| `R1-B1` | Kept the one-click `/demo` and `?demo=1` sample, persistent banner, reset, exit, completed receipt, paused transfer, and separate `demo:` storage. | `@claim:demo-isolation demo is one click, seeded, resettable, and isolated` | [demo](evidence/polish-2/live/demo-mobile.png) | `/?demo=1` preserved production license and receipt sentinels through mutation, reset, and exit. |
| `R1-B2` | Kept the 17-entry claim registry and exactly-one-tag integrity guard. Ran every listed command separately. | `public claim registry maps every claim id to exactly one tagged test and no test tag is unlisted`; 17/17 claim commands passed | [demo](evidence/polish-2/live/demo-mobile.png) | Live demo, transfer, privacy, offline, and route checks passed in `cold-check.json`. |
| `R1-B3` | Kept explicit supported routes, the blueprint 404, deep-route files, and host 404 override. | `landing copy, route metadata, history focus, and designed 404 are complete` | [404](evidence/polish-2/live/404-mobile.png) | `/missing-page` returned HTTP 404 with the correct title and H1. |
| `R1-B4` | Kept unavailable billing out of the interface and retained the plain availability notice. | `@claim:checkout-unavailable demo exit shows no purchase action while checkout is unavailable` | [mobile home](evidence/polish-2/live/screenshot-mobile.png) | `/` contained no checkout link; the availability notice was present. |
| `R1-B5` | Kept the 4 px vermilion `:focus-within` treatment on the visible file-picker label. | `keyboard focus, touch targets, and axe baseline pass` | [mobile home](evidence/polish-2/live/screenshot-mobile.png) | The hidden input produced a visible label outline at `/`. |
| `R1-M1` | Kept the job-first headline, named audience, primary sample action, next-step note, real action, and three facts on the first screen. | `landing copy, route metadata, history focus, and designed 404 are complete` | [mobile home](evidence/polish-2/live/screenshot-mobile.png) | Fresh 390 px `/` showed the complete first-screen wording and actions. |
| `R1-M2` | Kept per-route titles, descriptions, canonicals, social metadata, common header/footer, History API focus/announcement, three steps, and boundaries section. | `landing copy, route metadata, history focus, and designed 404 are complete` | [mobile home](evidence/polish-2/live/screenshot-mobile.png), [404](evidence/polish-2/live/404-mobile.png) | `/`, `/demo`, `/privacy/`, `/terms/`, and `/missing-page` had the expected status, title, one H1, one main, and focus behavior. |
| `R1-MOD1` | Kept 44 px header/footer targets, intentional single-column workbench, wrapping actions, and overflow guards. | `keyboard focus, touch targets, and axe baseline pass` | [mobile home](evidence/polish-2/live/screenshot-mobile.png) | Fresh 390 × 844 check found every tested target at least 44 px and no horizontal overflow. |
| `R1-MIN1` | Kept the specific PC-code recovery message and consistent phone/PC names. | `invalid PC code names the field and gives a next step` | [mobile home](evidence/polish-2/live/screenshot-mobile.png) | The deployed sender flow rendered the tested PC-code control and recovery path. |
| `R1-COPY` | Kept the plain UI terminology and completed the remaining README rewrite. Updated the verb-first, 95-character catalog sentence. | Both `plain-language product copy` tests; `.factory/copy-audit.md` | [mobile home](evidence/polish-2/live/screenshot-mobile.png) | Cold first screen remained understandable at 390 px and desktop. |
| `R1-IDENTITY` | Preserved the drafting-paper grid, navy/vermillion marks, clipped sheets, serif/monospace pairing, original blueprint art, and reduced-motion treatment. | `keyboard focus, touch targets, and axe baseline pass`; Lighthouse visual stability | [home](evidence/polish-2/live/screenshot-mobile.png), [demo](evidence/polish-2/live/demo-mobile.png), [404](evidence/polish-2/live/404-mobile.png) | Visual inspection of all three live routes confirmed the product-specific system. |

## Review 1 claim-table findings

| Finding ID | Change retained | Claim evidence | Screenshot | Live URL check |
| --- | --- | --- | --- | --- |
| `encrypted-local-transfer` | Registered as `direct-local-transfer`; direct peers use no relay configuration. | `@claim:direct-local-transfer` | [demo](evidence/polish-2/live/demo-mobile.png) | `/demo?transfer=1` completed a live two-peer transfer. |
| `resume-missing-chunks` | Registered as `resume-missing-parts`; saved part indexes are retained and not resent. | `@claim:resume-missing-parts`, 20/20 runs | [paused sample](evidence/polish-2/live/demo-mobile.png) | `/demo` displayed the resumable one-of-four-parts sample. |
| `hash-receipt` | Registered as `verified-receipt`; independent hashes match both receipt copies. | `@claim:verified-receipt` | [checked receipt](evidence/polish-2/live/demo-mobile.png) | Live two-peer transfer produced a safe-to-delete receipt. |
| `no-cloud-upload` | Covered by direct-transfer and privacy-boundary claims. | `@claim:direct-local-transfer`; `@claim:privacy-network-boundary` | [mobile home](evidence/polish-2/live/screenshot-mobile.png) | The cold live flow observed same-origin requests only. |
| `preserve-original-bytes` | Registered as `unchanged-file-bytes`; EXIF-like bytes remain exact. | `@claim:unchanged-file-bytes` | [checked receipt](evidence/polish-2/live/demo-mobile.png) | Live transfer completed through the same deployed byte-preserving path. |
| `local-browser-storage` | Registered as `local-device-storage`; removing received copies leaves receipts. | `@claim:local-device-storage` | [checked receipt](evidence/polish-2/live/demo-mobile.png) | `/?demo=1` isolation/reset/exit check preserved production storage. |
| `receipt-export` | Registered as `receipt-exports`; JSON and CSV content and row counts are asserted. | `@claim:receipt-exports` | [receipt actions](evidence/polish-2/live/demo-mobile.png) | Both download actions were present on the live checked receipt. |
| `download-received-files` | Registered unchanged; downloaded bytes equal the source. | `@claim:download-received-files` | [receipt actions](evidence/polish-2/live/demo-mobile.png) | Live completed receipt exposed the received-file download. |
| `receipt-selected-scope` | Registered as `selected-files-scope`; unselected names are excluded. | `@claim:selected-files-scope` | [checked receipt](evidence/polish-2/live/demo-mobile.png) | Live receipt states that it covers only selected files. |
| `offline-pwa` | Registered unchanged; demo reloads from service-worker storage offline. | `@claim:offline-pwa` | [demo](evidence/polish-2/live/demo-mobile.png) | Fresh production profile reloaded `/demo` offline with its receipt. |
| `free-limit-25` | Registered unchanged; 25 files proceed and 26 are rejected. | `@claim:free-limit-25` | [mobile chooser](evidence/polish-2/live/screenshot-mobile.png) | Live chooser and limits section state the 25-file boundary. |
| `price-once-499` | Removed the unavailable price and purchase action. | `@claim:checkout-unavailable` | [limits section](evidence/polish-2/live/screenshot-mobile.png) | No checkout link exists on `/`. |
| `checks-free` | Registered unchanged; checked receipt and both exports work without a license. | `@claim:checks-free` | [checked receipt](evidence/polish-2/live/demo-mobile.png) | Fresh live demo had no license and showed receipt downloads. |
| `unlimited-license` | Removed the unavailable unlimited-tier claim. | `@claim:checkout-unavailable` | [limits section](evidence/polish-2/live/screenshot-mobile.png) | Live site contains no unlimited purchase action or claim. |
| `no-storage-subscription` | Removed with the unavailable paid offer. | `@claim:checkout-unavailable` | [limits section](evidence/polish-2/live/screenshot-mobile.png) | Live site contains no subscription or payment offer. |
| `license-another-device` | Removed license restore controls and the unsupported claim. | `@claim:checkout-unavailable` | [limits section](evidence/polish-2/live/screenshot-mobile.png) | Live site contains no restore-license control. |
| `no-accounts-trackers-cdns` | Registered as `privacy-network-boundary`; requests and runtime assets are inspected. | `@claim:privacy-network-boundary` | [mobile home](evidence/polish-2/live/screenshot-mobile.png) | Cold live flow made same-origin requests only; CSP allows self only. |
| `billing-boundary` | Removed because this release makes no purchase request and loads no billing code. | `@claim:checkout-unavailable`; `@claim:privacy-network-boundary` | [limits section](evidence/polish-2/live/screenshot-mobile.png) | No checkout link, card form, or external script exists live. |
| `same-network-requirement` | Registered as `same-network-transfer`; success and unreachable-peer recovery are asserted. | `@claim:same-network-transfer` | [how it works](evidence/polish-2/live/screenshot-mobile.png) | Live two-peer transfer completed at `/demo?transfer=1`. |
| `android-build` | Narrowed to the configured Capacitor Android project required by this static work order. | `@claim:android-project`; `npx cap sync android` | [installed-web surface](evidence/polish-2/live/screenshot-mobile.png) | Live manifest returned 200; build `1.0.3` is synced into the Android project. |
| `test-suite-scope` | Removed the public claim about test internals; verification remains developer documentation. | Full `npm run test:e2e` run: 14 passed, 8 intentional duplicates skipped | [mobile home](evidence/polish-2/live/screenshot-mobile.png) | The deployed build was independently checked by `verify-live.mjs`. |

## Final evidence

- Final clean clone: `/tmp/phone-photo-intake-polish-2-final.USISf8`, evidence commit `043927d83d10f2d8f9777e83081b15c5cde9d493`.
- `npm ci`: 149 packages, zero vulnerabilities.
- `npm test`: 6 files, 15 tests passed.
- `npm run build`: passed; JS 40.08 kB raw / 14.01 kB gzip, CSS 16.33 kB raw / 4.32 kB gzip, hero 58.46 kB.
- Every one of the 17 `.factory/claims.json` commands: passed separately.
- `npm run test:e2e`: 14 passed, 8 intentional mobile duplicates skipped; the resume campaign passed 20/20 runs.
- `npx cap sync android`: passed.
- Local `verify-url.sh`: no console errors; correct title/lang/main/H1/image and button labels.
- Local axe CLI: zero violations on five route types.
- Local Lighthouse: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.7 s, CLS 0, TBT 0 ms.
- Live `verify-url.sh`: no console errors; correct title/lang/main/H1/image and button labels.
- Live axe CLI: zero violations on five route types.
- Live Lighthouse: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.4 s, CLS 0, TBT 60 ms.
- Live cold check: every recorded boolean in [cold-check.json](evidence/polish-2/live/cold-check.json) is true and `consoleErrors` is empty.

No finding of any severity remains unresolved.
