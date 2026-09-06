# Photo transfer verification 4 — PASS

**Verdict: PASS.** The implementation has **zero findings** and **zero untested public claims**.

**Implementation reviewed:** `9212ac37fd2e66890504b9ee554fae7fde44940f` (`fix: use plain route labels`)  
**Documentation baseline:** `f5b55e66b243a2e26ee7c11b18034cff52f00995` (`docs: link repair report commit`)  
**Live product:** <https://phone-photo-intake.sociobot.in>  
**Checked:** 2026-09-06

The documentation-only commits after the implementation change only `.factory/handoff.md` and add `.factory/repair-2.md`; they do not make a new product image.

## What the first screen says

Fresh phone (390 × 844) and desktop (1440 × 960) browser contexts both loaded at `scrollY: 0` with these items visible before scrolling:

- Job: **Move phone photos to your PC, then verify**.
- Audience: **For people who want proof their selected photos arrived before deleting the phone copies.**
- First action: **Try it with sample data**.
- Result of that action: **Opens a completed receipt.**
- Facts: photos do not upload to a server, it works offline after the first visit, and the free limit is 25 files.

## Clean checkout checks

A new clone at the implementation SHA in `/tmp/phone-photo-intake-verify-4.CVWBt3/repo` passed:

| Check | Result | Evidence |
| --- | --- | --- |
| `npm ci` | PASS | 149 packages installed; 0 vulnerabilities. |
| `npm test` | PASS | 6 files, 15 tests. |
| `npm run build` | PASS | `dist/` produced. Main JS: 39.98 kB raw / 13.97 kB gzip; CSS: 16.33 kB raw / 4.32 kB gzip; hero: 58.46 kB. |
| Every command in `.factory/claims.json` | PASS | 17 of 17 were invoked separately; none failed. |
| `npm run test:e2e` | PASS | Playwright ran 24 cases; `test-results/.last-run.json` reports `status: passed` and no failed tests. |
| `npx cap sync android` | PASS | The Capacitor project copied the built PWA and updated Android plugins. |

The individual claim runs cover demo separation, JSON/CSV and received-file downloads, free checks, selected-file scope, offline reload, the 25-file boundary, unavailable checkout, direct local transfer, code privacy, checked receipts, byte preservation, local storage, same-network transfer, network privacy, interrupted-transfer recovery, and the Android project. The two-minute `resume-missing-parts` campaign passed in a clean browser run.

## Live product checks

- A fresh phone and desktop browser loaded `/`, `/demo`, `/privacy/`, `/terms/`, and a new unknown route. Axe found **0 violations** on every route at both widths.
- The unknown route returned HTTP 404 with one `Page not found` H1 and a `Return to photo transfer` link. The browser's expected 404 resource message was not classified as a product console defect.
- `/privacy/` rendered H1 **Privacy**. The 404 had no eyebrow or decorative copy. These are the exact `F4-1` repair conditions.
- The live demo showed a populated three-file safe-to-delete receipt and the realistic paused transfer (`1 of 4 parts saved`), kept the persistent **Demo — sample data, nothing is saved** label and **Reset demo** action, and retained the label after changing pages.
- The independent live flow seeded normal-storage sentinels, entered demo, removed received copies, reset demo, and left with **Start for real**. The normal license and receipt sentinels were unchanged.
- Two clean live demo peers transferred `IMG_live-check.jpg`; the receiving peer showed the checked safe-to-delete receipt. The same run confirmed only same-origin requests, no checkout action, no page/console errors, offline demo reload after service-worker control, focus restoration on navigation/back, visible file-chooser focus, 44 px navigation targets, and no mobile horizontal overflow.
- Normal, invalid, boundary, and recovery paths passed in the clean browser suite: invalid PC code names the PC code and gives the next step; 25 files continue while 26 are blocked with an alert; a valid code works after an invalid attempt; 20 forced interruptions retained all completed parts and resumed only missing parts.
- All rendered internal links returned 200. Same-page anchors worked. The remaining links are explicit `mailto:` or external links and were not fetched outside product scope.
- The live static security policy has self-only CSP, HSTS, `nosniff`, Referrer-Policy, COEP, COOP, Permissions-Policy, immutable hashed assets, and no-cache service-worker/manifest responses.

## Routes and runtime identity

| Route | HTTP | Title | H1 |
| --- | ---: | --- | --- |
| `/` | 200 | Photo Intake Receipt — move and verify phone photos | Move phone photos to your PC, then verify |
| `/demo` | 200 | Demo — Photo Intake Receipt | Review a finished photo transfer |
| `/privacy/` | 200 | Privacy — Photo Intake Receipt | Privacy |
| `/terms/` | 200 | Terms — Photo Intake Receipt | Terms of use |
| `/fresh-unknown-route` | 404 | Page not found — Photo Intake Receipt | Page not found |

SHA-256 comparison between the clean-candidate `dist/` and production matched all 11 checked delivery files: `index.html`, JS, CSS, hero art, service worker, manifest, offline page, Open Graph image, and the SVG/192/512 icons. The live footer reports build `1.0.4 · repair 2`.

## Claim audit

All 17 registry entries have one declared command and that command passed from the clean clone: `demo-isolation`, `receipt-exports`, `checks-free`, `selected-files-scope`, `offline-pwa`, `free-limit-25`, `checkout-unavailable`, `direct-local-transfer`, `connection-codes-no-photo-data`, `verified-receipt`, `unchanged-file-bytes`, `local-device-storage`, `download-received-files`, `same-network-transfer`, `privacy-network-boundary`, `resume-missing-parts`, and `android-project`.

The live landing page, demo, privacy, terms, and README claims were cross-checked against this registry. No new claim-like statement lacks a test. No analytics, tracking, third-party font/script, account, photo server, STUN, or TURN request was observed in the live transfer flow.

## Earlier findings

| Earlier finding | Current disposition and evidence |
| --- | --- |
| Initial verification: interruption proof | Resolved. `resume-missing-parts` passed its independent 20-interruption campaign; the full suite also passed. |
| Initial verification: Android project/artifact | The public claim is that the repository contains a Capacitor Android project; its claim test and `npx cap sync android` pass. This PWA-first assignment explicitly leaves APK build/signing to a later Android work order, and no APK is advertised as available. |
| Initial verification: pairing message and static policy | Resolved. The invalid PC-code regression passes; live headers and cache policy are present. |
| Review 1: no demo, no claim registry, home-page 404, dead checkout, chooser focus | Resolved. Isolated seeded demo/reset/exit, 17 claim commands, HTTP 404, no checkout action, and visible 3 px chooser focus all passed live and locally. |
| Review 1: first-screen clarity, metadata/shared structure, mobile targets, receiver-code copy | Resolved. Fresh phone/desktop first-read, route table, link/metadata tests, 44 px checks, and invalid-code regression passed. |
| Review 2 `F-2-1`: README implementation jargon | Resolved. The plain-language README test passes and current copy uses phone/PC, received-copy, and on-device terms. |
| Verification 3: chooser focus, short targets, wrong PC-code message | Resolved. Keyboard, touch-target, and invalid PC-code tests pass. |
| Review 4 `F4-1`: themed Privacy/404 route copy | Resolved. Rendered `/privacy/` is **Privacy**; the rendered 404 has no eyebrow and uses the direct return action. |

## Scope notes

This is a static local-first PWA with no backend, tenant store, health endpoint, or request allowance; tenant-isolation, restart-persistence, and 429 checks do not apply. The Android SDK and JDK are absent in this verification container, so a new Gradle/APK run was not possible; that is not a failed claim or an untested browser product path because the assigned deliverable is the PWA plus Capacitor skeleton. The documented Android project claim was independently tested and synchronization passed.

Lighthouse could not attach to the worker's headless shell in the preceding repair round. This verification instead confirmed the measurable budgets, live browser behavior, response policies, semantic structure, focus, and zero-violation axe scans. No public performance number is claimed without a passing test.

## Result

**PASS — 0 findings; 0 untested claims.**
