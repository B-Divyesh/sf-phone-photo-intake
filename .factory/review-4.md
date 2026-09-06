# Photo Intake Receipt review 4 — FAIL

**Reviewed implementation candidate:** `1f121d8f27c3bad8ea244fee462d16d633e7ea0d`<br>
**Documentation HEAD:** `b000b0ab9c78600e776d152fd75c77a0db747a6a`<br>
**Live URL:** <https://phone-photo-intake.sociobot.in><br>
**Review date:** 2026-09-06

## Verdict

**FAIL.** There is **one minor finding**, `F4-1`, and **zero untested claims**. This review cannot be marked PASS because the work order requires zero findings of every severity.

## Job, audience, and first action

The job is to move selected phone photos to a PC, check the received copies, and keep a receipt before deleting phone originals. It is for people who need proof that their selected photos arrived before deletion. On fresh phone and desktop browsers, before scrolling, the page showed:

- Job: “Move phone photos to your PC, then verify”.
- Audience: “For people who want proof their selected photos arrived before deleting the phone copies.”
- First action: “Try it with sample data”; its adjacent result says “Opens a completed receipt.”

Both fresh contexts started at `scrollY: 0`, had no console errors, and showed the same three facts: no server upload, offline after the first visit, and free for 25 files.

## Finding

### F4-1 — minor: legal and error copy uses blueprint-themed wording instead of plain route labels

The `/privacy/` page uses the H1 **“Privacy, drawn plainly”**. “Drawn” is a blueprint metaphor rather than a plain, stand-alone legal-page heading. The designed 404 also begins with the decorative label **“Drawing missing · 404”** before the clear H1. This conflicts with the attached plain-words contract: no metaphor or mood headings, and no decorative labels that do not help the user act.

The user path is not broken: both pages have correct titles, one H1, clear body copy, and a return link. Replace the privacy H1 with **“Privacy”** and remove the 404 eyebrow or make it **“Error 404”**. Add a regression assertion for the route headings and rerun the copy audit. No product-code change was made in this review.

## Live product exercise

Fresh Playwright phone (390 × 844) and desktop (1440 × 960) contexts opened the live home page. The mobile page had no horizontal overflow and no console errors. Visual inspection confirmed the warm blueprint system remains product-specific and readable, not a generic template.

The one-click `/demo` sample loaded a realistic completed three-file receipt and an interrupted four-part transfer. Its persistent banner read “Demo — sample data, nothing is saved.” I removed received demo copies, used **Reset demo**, then used **Start for real**. A production local-storage license sentinel and a production IndexedDB receipt sentinel remained unchanged; the demo returned to the seeded receipt and never showed production data.

The live verifier also completed a new two-peer demo transfer, checked the received file, and exercised the offline demo reload after service-worker control. It recorded only same-origin HTTP requests, no console errors, no checkout link, visible primary file-input focus, history focus restoration, 44px navigation targets, and the expected route states.

## Routes, links, privacy, and accessibility

| Check | Result | Evidence |
| --- | --- | --- |
| `/`, `/demo`, `/privacy/`, `/terms/` | PASS | HTTP 200, correct per-route title, one main and one H1. |
| Unknown URL | PASS | `/unknown-review-four` returned deliberate HTTP 404 with the designed Page not found screen and return link. |
| Links | PASS | Rendered internal links and the Param Factory link returned HTTP 200; the privacy mail link is explicit `mailto:`. |
| Privacy boundary | PASS | Full live demo transfer made only same-origin requests; no tracking, external font, external script, account, STUN, or TURN request appeared. |
| Security/cache policy | PASS | Live CSP, HSTS, COEP, COOP, Permissions-Policy, Referrer-Policy, `nosniff`, immutable hashed assets, and no-cache service worker/manifest are present. |
| Accessibility | PASS except `F4-1` copy | Pinned Playwright/axe check passed on root, demo, legal pages, and 404 in desktop and mobile projects; primary chooser focus has a visible 3px container outline; semantic and keyboard checks passed. The standalone axe CLI could not find a system Chrome, so the repository's pinned Playwright/axe integration was used with the preinstalled browser. |
| Reduced motion | PASS | `prefers-reduced-motion` removes transitions, animation, transforms, and smooth scrolling. |
| PWA | PASS | Manifest/icons load; after first visit the seeded demo reloads offline and service-worker update UI is present. |

This is a static local-first PWA with no product backend, tenant, health, or rate-limit endpoint. Backend isolation, restart persistence, and 429/Retry-After checks are therefore not applicable.

## Claim and clean-checkout evidence

Fresh clone: `/tmp/phone-photo-intake-review-4.Adp1sZ` at documentation HEAD `b000b0a`. `git diff 1f121d8..b000b0a` contains reports, copy-audit material, evidence, README wording, and test/verifier documentation; it contains no shipped application source, asset, public-file, or package dependency change. The live HTML, JS, CSS, and hero asset matched the locally built candidate bytes by SHA-256.

- `npm ci`: PASS — 149 packages installed; zero vulnerabilities reported.
- `npm test`: PASS — 6 files, 15 tests.
- `npm run build`: PASS — `dist/` produced. JS: 40.08 kB raw / 14.01 kB gzip; CSS: 16.33 kB raw / 4.32 kB gzip; hero: 58.46 kB.
- `npm run test:e2e`: PASS — 22 tests, including normal, invalid, boundary, recovery, mobile, route, offline, update, keyboard, and 20-interruption paths.
- `npm run test:e2e -- --grep 'keyboard focus, touch targets, and axe baseline pass'`: PASS — 2 projects passed.
- Every individual `test` command in `.factory/claims.json`: PASS — 17 of 17. This includes the 20-run resume campaign, byte-for-byte transfer/download, selected-file scope, no-photo connection codes, offline reload, demo isolation, local storage, privacy network boundary, and Android-project source claim.

There are no unlisted visitor-facing claims in the live landing page or README: all reliability, privacy, storage, offline, selection-scope, file-limit, download, direct-connection, and checkout statements map to `.factory/claims.json`.

## Earlier findings disposition

| Earlier finding group | Current disposition |
| --- | --- |
| Review 1: missing demo, missing claim registry/tests, silent unknown-route home, dead checkout | Resolved and reverified: isolated demo, 17 tested claims, deliberate designed 404, and no unavailable checkout action. |
| Review 1: first-screen clarity, metadata/skeleton, mobile targets, incorrect receiver-code error | Resolved and reverified: clear first screen, route metadata/landmarks/footer, 44px targets, and “That PC code is incomplete” recovery text. |
| Initial verification: resume proof, Android validation, pairing exception, cache/security policy | Resolved/reverified where applicable: 20 fresh interruptions preserve completed parts; Android source claim passes; invalid input gives a field-specific next step; live headers/cache policy pass. APK runtime remains a later Android work order under the documented stack decision. |
| Verification 3: invisible file-chooser focus, short standalone links, incorrect PC-code error | Resolved and reverified by the direct keyboard/axe test, 390px target measurement, and invalid-code test. |
| Review 2 `F-2-1`: README implementation jargon | Resolved: current README uses direct phone-to-PC, received-copy, and on-device wording. |
| Review 3 | Its PASS checks remain valid, except it did not identify `F4-1`; this review reports that remaining plain-words defect. |

## Required next step

Repair `F4-1`, add a plain-copy regression test, rebuild and deploy, then repeat the route/copy portion of this review. Until then the unambiguous verdict is **FAIL**.
