# Photo Intake Receipt — polish round 1

**Work order:** `phone-photo-intake-polish-1-all-findings`

**Released candidate:** `5414d1e18754928ffd1c76ec6784af797033edf3`

**Review source:** `40cf93b6ef1822c41a40d8c0970e712f6b6ea6f2` / `.factory/review-1.md`

**Repair commit:** `f36f169826984693f5dbe01bd6d9353343fd7f92`

**Live URL:** <https://phone-photo-intake.sociobot.in>
**Deployment:** `6e51d624-fc61-42e8-9be4-e2a21117297b`

There were no earlier `.factory/review-*.md` or `.factory/polish-*.md` files beyond `review-1.md`. Every blocking, major, moderate, minor, claim-table, and copy-audit finding in that report is mapped below.

## Finding map

| Finding ID | Change made | Evidence |
| --- | --- | --- |
| R1-B1 · no isolated one-click demo | Added first-screen **Try it with sample data**, direct `/demo` and `?demo=1`, completed and interrupted samples, persistent banner, reset, exit, and the separate `demo:photo-intake-receipt` database plus `demo:` local-storage key. Exit deletes demo data and never reads normal data. | `@claim:demo-isolation`; `demo is one click, seeded, resettable, and isolated`; [live demo screenshot](evidence/polish-1/live/demo-mobile.png); live cold check recorded `demoIsolation: true`. |
| R1-B2 · no claims registry/tests | Added `.factory/claims.json` with 17 observable claims and an exact tagged command for each. Added `tests/claims.test.ts` to fail on duplicate, missing, or unlisted claim tags. | All 17 registry commands passed separately in clean clone `/tmp/phone-photo-intake-polish-1.GPDPJH`; `public claim registry maps every claim id to exactly one tagged test`. |
| R1-B3 · unknown routes become home | Added explicit supported-route matching, styled blueprint 404, `/404.html`, Azure 404 response override, and direct-load/reload coverage. | `landing copy, route metadata, history focus, and designed 404 are complete`; live `/does-not-exist` returned HTTP 404 with title `Page not found — Photo Intake Receipt`; [404 screenshot](evidence/polish-1/live/404-mobile.png). |
| R1-B4 · dead paid checkout | Removed price, license restore, and checkout controls. Added a plain availability statement and a claim test proving no checkout action exists. | `@claim:checkout-unavailable`; live DOM contained zero checkout links; live checkout notice visible after leaving demo. |
| R1-B5 · invisible file-picker focus | Added a 4 px vermilion `:focus-within` outline and regression coverage on the visible label. | `keyboard focus, touch targets, and axe baseline pass`; live cold check focused `#file-input` and found a visible label outline. |
| R1-M1 · first-screen wording and facts | Replaced intake/batch/hash jargon with the requested phone-to-PC job headline, audience sentence, sample and real actions, next-step text, and three privacy/offline/free facts. | `landing copy, route metadata, history focus, and designed 404 are complete`; [mobile first screen](evidence/polish-1/live/screenshot-mobile.png); `.factory/copy-audit.md`. |
| R1-M2 · metadata, route structure, focus, skeleton | Added route titles/descriptions/canonicals, OG/Twitter image metadata, Apple icon, `/demo` sitemap entry, common header/footer/build ID, History API navigation, H1 focus, polite announcements, three-step explanation, boundaries section, and deep-route files. | Route browser test above; [live cold-check record](evidence/polish-1/live/cold-check.json); live routes `/`, `/demo`, `/privacy/`, `/terms/` all returned 200 with their own title/H1/canonical. |
| R1-MOD1 · short mobile touch targets | Gave the wordmark and standalone header/footer links at least 44 px height; preserved visible mobile navigation and prevented horizontal overflow. | `keyboard focus, touch targets, and axe baseline pass` at 390 × 844; live cold check measured every target and no overflow. |
| R1-MIN1 · wrong receiver-code error | Standardized roles to phone code and PC code. The sending-side error now says: “That PC code is incomplete. Copy the full PC code and try again.” | `invalid PC code names the field and gives a next step`. |
| R1-COPY · landing and README language | Rewrote the review’s jargon, inconsistent terms, dead paid copy, two overlong README sentences, vague buttons, and internal factory language. Updated the catalog line to a 99-character, verb-first sentence. | `.factory/copy-audit.md`; `README.md`; cold-read screenshot above. No audited sentence exceeds 22 words or contains a banned marketing term. |
| R1-IDENTITY · preserve distinct appearance | Kept the warm drafting paper, cyan rules, navy type, vermilion marks, clipped sheets, Georgia/monospace pairing, generated blueprint art, and reduced-motion policy. Extended the same system to demo and 404 pages. | `.factory/design.md`; all three live screenshots in this report; visual inspection at 390 × 844 and 1366 × 900. |

## Review claim-table map

The IDs below mirror the 21 unlisted-claim rows named in review finding R1-B2.

| Review row ID | Resolution | Evidence |
| --- | --- | --- |
| `encrypted-local-transfer` | Registered as `direct-local-transfer`; two real browser peers use `iceServers: []`, transfer known bytes, and create a checked receipt. | `@claim:direct-local-transfer` |
| `resume-missing-chunks` | Registered as `resume-missing-parts`; reconnect requests retain saved parts and do not resend their indexes. | `@claim:resume-missing-parts`, 20/20 clean runs |
| `hash-receipt` | Registered as `verified-receipt`; downloaded receipt source and destination SHA-256 values equal an independently calculated hash. | `@claim:verified-receipt` |
| `no-cloud-upload` | Covered by direct-transfer and privacy-boundary claims; the complete flow permits same-origin requests only and sends media over the data channel. | `@claim:direct-local-transfer`, `@claim:privacy-network-boundary` |
| `preserve-original-bytes` | Registered as `unchanged-file-bytes`; an EXIF-bearing fixture is downloaded and compared byte-for-byte and by SHA-256. | `@claim:unchanged-file-bytes` |
| `local-browser-storage` | Registered as `local-device-storage`; test inspects demo IndexedDB and confirms removing files leaves receipts. | `@claim:local-device-storage` |
| `receipt-export` | Registered as `receipt-exports`; test validates JSON fields, CSV header, and one row per sample file. | `@claim:receipt-exports` |
| `download-received-files` | Registered unchanged; test downloads the receiving copy and compares every byte. | `@claim:download-received-files` |
| `receipt-selected-scope` | Registered as `selected-files-scope`; receipt includes the selected fixture and excludes an unselected name. | `@claim:selected-files-scope` |
| `offline-pwa` | Registered unchanged; demo is loaded, service-worker controlled, taken offline, reloaded, and its receipt opened. | `@claim:offline-pwa` |
| `free-limit-25` | Registered unchanged; 25 files enable preparation and 26 disable it with an announced error. | `@claim:free-limit-25` |
| `price-once-499` | Removed because checkout is unavailable; the app displays no price or purchase action. | `@claim:checkout-unavailable` |
| `checks-free` | Registered unchanged; both receipt formats download in a fresh context with no license. | `@claim:checks-free` |
| `unlimited-license` | Removed; no unavailable paid capability is advertised. | `@claim:checkout-unavailable` |
| `no-storage-subscription` | Removed with the unavailable paid offer. | `@claim:checkout-unavailable` |
| `license-another-device` | Removed with license restore controls and paid copy. | `@claim:checkout-unavailable` |
| `no-accounts-trackers-cdns` | Registered as `privacy-network-boundary`; the full flow captures requests and inspects script/style origins. | `@claim:privacy-network-boundary` |
| `billing-boundary` | Removed because this release makes no purchase request and loads no payment code. | `@claim:checkout-unavailable`, `@claim:privacy-network-boundary` |
| `same-network-requirement` | Registered as `same-network-transfer`; direct peers complete with no STUN/TURN. The test also closes the answering peer and observes the bounded same-network error instead of endless connecting. | `@claim:same-network-transfer` |
| `android-build` | Narrowed to the true claim that the repository includes the configured Capacitor Android project; APK production remains the later Android work order. | `@claim:android-project`; `npx cap sync android` passed |
| `test-suite-scope` | Removed the public prose claim about test internals. Verification commands and their actual scope remain factual developer instructions. | `README.md`; clean-clone suite results below |

## Final verification evidence

- Clean clone: `/tmp/phone-photo-intake-polish-1.GPDPJH` at `f36f169826984693f5dbe01bd6d9353343fd7f92`.
- `npm ci`: 149 packages, 0 vulnerabilities.
- Every command in `.factory/claims.json`: 17/17 passed separately.
- `npm test`: 5 files, 13 tests passed.
- `npm run build`: passed; JS 40.08 kB raw / 14.01 kB gzip, CSS 16.33 kB raw / 4.32 kB gzip, hero 58.46 kB.
- `npm run test:e2e`: 14 passed, 8 intentional mobile duplicates skipped; includes 20/20 interruption runs.
- `npx cap sync android`: passed.
- Local `verify-url.sh`: no console errors, one H1, one main, `lang=en`, no missing alt, no unlabeled buttons.
- Local axe CLI: zero violations on `/`, `/demo`, `/privacy/`, and `/terms/`.
- Local Lighthouse: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.8 s, CLS 0, TBT 30 ms.
- Live `verify-url.sh`: load 951 ms, no console errors, one H1, one main, no missing alt, no unlabeled buttons.
- Live axe CLI: zero violations on `/`, `/demo`, `/privacy/`, `/terms/`, and the 404.
- Live Lighthouse: 99 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.3 s, CLS 0, TBT 120 ms.
- Live cold check: demo isolation, reset/exit, offline reload, first-screen copy, metadata, route statuses, focus, 44 px targets, same-origin requests, no checkout link, and no mobile overflow all passed.

No review finding of any severity remains unresolved.
