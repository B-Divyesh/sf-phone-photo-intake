# Photo Intake Receipt — repair 2

**Work order:** `phone-photo-intake-repair-2`  
**Result:** **PASS — F4-1 resolved; no current findings**  
**Implementation candidate:** `9212ac37fd2e66890504b9ee554fae7fde44940f`  
**Previous review/report baseline:** `f3fa41541c86d410c178b33e0650a179b5dc9ad6`  
**Deployment:** `b20da794-31cd-417e-9bfa-26d34aaa4b0f`  
**Production:** <https://phone-photo-intake.sociobot.in>

## Repair

`F4-1` is fixed at the rendered route level:

- `/privacy/` now has the direct H1 **Privacy**.
- The 404 has no decorative eyebrow. Its H1 remains **Page not found**.
- Legal and error return actions now say **Return to photo transfer**.
- The offline fallback no longer calls the product a “drafting desk.”
- The PWA cache and manifest versions advanced with build `1.0.4 · repair 2`, so installed clients receive the new labels.

The browser regression `legal and error routes use direct labels and a clear return action` checks the assembled application. It navigates to `/privacy/` and an unknown address, verifies the rendered H1s and return action, and verifies the 404 has no eyebrow. It does not inspect source strings.

`.factory/copy-audit.md` now includes the legal, error, and offline routes. Every audited item is 22 words or fewer and uses a direct label or action.

## Earlier findings

The repair retains the independently verified resolutions for all earlier reports:

| Earlier finding group | Current disposition |
| --- | --- |
| Review 1: demo, claim registry, 404, unavailable checkout, chooser focus | Retained and rechecked: isolated one-click demo, 17 tested claims, HTTP 404, no checkout action, visible focus. |
| Review 1: first screen, metadata/routes, mobile targets, pairing error, copy/identity | Retained and rechecked in browser suites and the live cold check. |
| Initial verification: resume evidence, Android project, pairing recovery, cache/security | Retained: 20-interruption browser coverage, Capacitor project/sync, field-specific recovery, and live response policies. |
| Verification 3: chooser focus, mobile targets, incorrect PC-code message | Retained and covered by browser checks. |
| Review 2 `F-2-1`: README implementation jargon | Retained: README plain-language test passes. |
| Review 4 `F4-1`: themed privacy/404 copy | Resolved by this repair and its outcome-based route test. |

## Verification

Fresh clone: `/tmp/phone-photo-intake-repair-2.RXNbbg/repo` at implementation SHA `9212ac3`.

- `npm ci`: passed; 149 packages, zero vulnerabilities.
- `npm test`: passed; 6 files and 15 tests.
- `npm run build`: passed; `dist/` produced. Main JS is 39.98 kB raw / 13.97 kB gzip, CSS is 16.33 kB raw / 4.32 kB gzip, and the hero is 58.46 kB.
- All 17 `test` commands in `.factory/claims.json` were launched separately and passed. This includes demo isolation, receipt exports, direct local two-peer transfer, byte preservation, offline reload, no external runtime requests, 25-file limit, and the 20 interruption/reconnect campaign.
- `npm run test:e2e`: passed from the clean clone; Playwright collected 24 desktop/mobile cases and reported no failed test.
- `npx cap sync android`: passed after the build. APK compilation is deliberately a later Android work order under the PWA-first static assignment.
- Live `verify-url.sh`: passed (889 ms load, no console/page errors, one H1/main, `lang=en`, no missing image alt text, no unlabeled buttons).
- Live `scripts/verify-live.mjs`: passed the phone cold check, demo isolation/reset/exit, a two-peer transfer, offline reload, same-origin request boundary, return-focus behavior, 44 px targets, no overflow, the expected 404, and no checkout action.
- Fresh live phone (390 × 844) and desktop (1440 × 960) checks both started at `scrollY: 0` and showed the job, audience, first action, adjacent outcome, and three facts before scrolling. Neither context reported a console error.
- Live Playwright/axe scans on `/`, `/demo`, `/privacy/`, `/terms/`, and the 404 reported zero violations at desktop and phone widths.
- The live HTML, JS, CSS, hero, service worker, and manifest SHA-256 values matched `dist/` exactly. The static policy remains live: self-only CSP, HSTS, immutable hashed assets, and no-cache PWA control files.

Live screenshots and machine output are in `/work/.evidence/repair-2/live/`.

## Known gaps

There is no known web product, accessibility, privacy, routing, claim, or deployment gap.

The Lighthouse CLI could not attach to the worker's preinstalled Playwright headless-shell (`Unable to connect to Chrome`), so this round has no new Lighthouse score. This is a worker-tooling limitation, not a product failure; the production browser, axe, bundle-size, and live route checks above passed. A signed APK and physical Android device test remain assigned to the later Android work order.
