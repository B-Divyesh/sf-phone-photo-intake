# Photo Intake Receipt review 5 — PASS

**Verdict: PASS.** This review found **0 findings** and **0 untested public claims**.

**Implementation reviewed:** `9212ac37fd2e66890504b9ee554fae7fde44940f` (`fix: use plain route labels`)  
**Documentation baseline:** `08bd17a2230c6ee284d7d7fde9ec829e309ec20c` (`docs: add verification four report`)  
**Live URL:** <https://phone-photo-intake.sociobot.in>  
**Checked:** 2026-09-06

The commits after the implementation candidate contain reports only. The live delivery matched the clean candidate build by SHA-256 for all 17 shipped files.

## Job, audience, and first action

The job is to move selected phone photos to a PC, check the received copies, and keep a receipt before deleting the phone originals. It is for people who need proof that selected photos arrived before deletion.

Fresh phone (390 × 844) and desktop (1440 × 960) browser contexts both began at `scrollY: 0`. Before scrolling, each showed:

- Job: **Move phone photos to your PC, then verify**.
- Audience: **For people who want proof their selected photos arrived before deleting the phone copies.**
- First action: **Try it with sample data**.
- Result: **Opens a completed receipt.**

The three visible facts say that photos do not upload to a server, the app works offline after the first visit, and the free limit is 25 files.

## Clean checkout evidence

A new checkout at the implementation SHA was created in `/tmp/phone-photo-intake-review-5.0G4xXy/repo`. After `npm ci`, all required commands passed:

| Check | Result |
| --- | --- |
| `npm test` | PASS — 6 files, 15 tests. |
| `npm run build` | PASS — `dist/` produced. Main JS: 39.98 kB raw / 13.97 kB gzip; CSS: 16.33 kB raw / 4.32 kB gzip; hero art: 58.46 kB. |
| Every command in `.factory/claims.json` | PASS — 17 of 17 commands run separately. |
| `npm run test:e2e` | PASS — 16 passed; 8 mobile duplicates deliberately skipped because their paired desktop tests exercise viewport-independent paths. |
| `npx cap sync android` | PASS — built PWA copied into the Capacitor Android project. |

The separate claim commands passed for demo separation, receipt and received-file downloads, free checks, selected-file scope, offline reload, the 25-file limit, unavailable checkout, direct local transfer, connection-code privacy, checked receipts, unchanged file bytes, local storage, same-network transfer, network privacy, interrupted-transfer recovery, and the Android-project source claim. The recovery command completed its 20-interruption campaign successfully.

## Live product evidence

- The fresh phone check completed the one-click sample flow. It displayed a realistic three-file checked receipt and the paused sample (`1 of 4 parts saved`), retained **Demo — sample data, nothing is saved**, reset to the seeded state, and returned to normal mode with **Start for real**.
- A normal-storage license sentinel and normal IndexedDB receipt sentinel stayed unchanged through demo removal, reset, and exit. The demo label stayed present while using sample data.
- Two live demo peers transferred `IMG_live-check.jpg`. The receiving peer showed a checked safe-to-delete receipt. The full transfer flow made only same-origin HTTP requests.
- The demo reloaded offline after service-worker control. The live page had no page errors or non-404 console errors.
- Normal, invalid, boundary, and recovery paths passed in the clean suite: incomplete PC codes identify the PC code and the next step; 25 files can continue; 26 are blocked with an alert; a valid code works after an invalid attempt; saved parts remain through the interruption/reconnect campaign.
- Desktop reduced-motion checks retained the visible 4 px file-chooser focus state after the short reduced-motion transition. Keyboard skip-link use, route/back focus handling, and 44 px mobile navigation targets passed. No mobile horizontal overflow was present.

## Routes, accessibility, privacy, and links

| Route | HTTP | Title | H1 |
| --- | ---: | --- | --- |
| `/` | 200 | Photo Intake Receipt — move and verify phone photos | Move phone photos to your PC, then verify |
| `/demo` | 200 | Demo — Photo Intake Receipt | Review a finished photo transfer |
| `/privacy/` | 200 | Privacy — Photo Intake Receipt | Privacy |
| `/terms/` | 200 | Terms — Photo Intake Receipt | Terms of use |
| `/missing-page` | 404 | Page not found — Photo Intake Receipt | Page not found |

Pinned Playwright/axe scans reported zero violations on all five routes at both phone and desktop widths. The designed 404 is a deliberate HTTP 404 with a clear return link; the expected browser resource message for that URL is not a product error. Desktop link crawling found all rendered same-origin links at HTTP 200. The privacy mail link is an explicit `mailto:` link.

Live headers include a self-only CSP, HSTS, `nosniff`, Referrer-Policy, COEP, COOP, Permissions-Policy, and appropriate cache rules. The manifest, icons, robots file, sitemap, service worker, and offline page are served. No analytics, tracking, external font/script, account, photo server, STUN, or TURN request was observed in the reviewed transfer path.

## Claims audit

All 17 registry entries have a declared command, and each command passed from the clean checkout. The landing page, demo, legal pages, and README were checked against the registry. No public claim lacked a claim entry and tested observable result.

## Earlier findings

| Earlier finding | Current disposition |
| --- | --- |
| Initial verification: interruption proof and Android validation | Resolved as scoped: the independent 20-interruption claim passes; the repository Android-project claim and Capacitor sync pass. APK build/signing remains a later Android work order and is not advertised as available. |
| Initial verification: pairing message and static policy | Resolved: invalid PC-code recovery is field-specific; live security and cache policy are present. |
| Review 1: missing demo, claims, 404, checkout, chooser focus | Resolved: isolated one-click demo, 17 claim commands, designed HTTP 404, no unavailable checkout action, and visible chooser focus all pass. |
| Review 1: first screen, metadata, structure, target size, receiver-code copy | Resolved: first-read checks, route metadata and landmarks, 44 px checks, and invalid-code regression pass. |
| Verification 3: invisible chooser focus, small targets, wrong PC-code message | Resolved: direct focus, mobile target, and invalid-code checks pass, including reduced-motion focus. |
| Review 2 `F-2-1`: README implementation jargon | Resolved: current README uses direct phone/PC and on-device wording. |
| Review 4 `F4-1`: themed Privacy/404 copy | Resolved: the Privacy H1 is **Privacy** and the 404 has no decorative eyebrow. |

This is a static local-first PWA with no backend, tenant store, health endpoint, restartable service, or request allowance. Tenant isolation, restart persistence, and 429/`Retry-After` checks do not apply.

## Result

**PASS — 0 findings; 0 untested claims.**
