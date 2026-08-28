# Adversarial first-read review 3 — PASS

**Work order:** `phone-photo-intake-review-3`  
**Reviewed candidate:** `cbcf18042a1b4b43871e745689d4ae565dd2b96c`  
**Live URL:** <https://phone-photo-intake.sociobot.in>  
**Reviewed:** 2026-08-28 UTC

## Verdict

**PASS.** Zero findings remain: no blocking, minor, unlisted-claim, or untested-claim item was found.

## Thirty-second cold read

Fresh 390 × 844 and 1440 × 900 Chromium contexts were loaded directly at `/` before scrolling.

| Question | Answer at both sizes |
| --- | --- |
| What does it do? | Moves selected phone photos to a PC, verifies received copies, and keeps a receipt before deletion. |
| For whom? | People who want proof selected phone photos arrived before deleting phone copies. |
| What should I click first? | **Try it with sample data**; “Opens a completed receipt.” says what follows. |

The exact first-screen copy is “Move phone photos to your PC, then verify”; “For people who want proof their selected photos arrived before deleting the phone copies.”; “Try it with sample data”; and “Opens a completed receipt.” It also shows three facts: “Photos do not upload to a server.”, “Works offline after the first visit.”, and “Free for 25 files per transfer.” The mobile document width equalled 390 px, both hero actions were visible and 358 × 51 px, and neither context had console/page errors.

## Copy audit

Words are whitespace-separated; hyphenated terms count as one. The list includes static headings, labels, actions, empty states, and footer text. Dynamic receipt data and the hidden update notice are excluded. All rows pass: no item exceeds 22 words, uses a banned marketing adjective, changes core terminology, has opaque context, or uses a non-result action. `JSON` and `CSV` are necessary download-format names.

### Landing page

| # | Copy | Words |
| ---: | --- | ---: |
| 1 | Skip to main content | 4 |
| 2 | Photo Intake Receipt | 3 |
| 3 | Home | 1 |
| 4 | Demo | 1 |
| 5 | Transfer | 1 |
| 6 | Privacy | 1 |
| 7 | Direct photo transfer | 3 |
| 8 | Move phone photos to your PC, then verify | 8 |
| 9 | For people who want proof their selected photos arrived before deleting the phone copies. | 14 |
| 10 | Try it with sample data | 5 |
| 11 | Opens a completed receipt. | 4 |
| 12 | Transfer my photos | 3 |
| 13 | Photos do not upload to a server. | 7 |
| 14 | Works offline after the first visit. | 7 |
| 15 | Free for 25 files per transfer. | 6 |
| 16 | Selected → transferred → checked | 3 |
| 17 | Offline mode. | 2 |
| 18 | Saved receipts remain available to review and download. | 8 |
| 19 | Photo transfer | 2 |
| 20 | Transfer on both devices | 4 |
| 21 | Open this page on the sending phone and receiving PC. | 10 |
| 22 | Choose what this device does. | 5 |
| 23 | Send photos | 2 |
| 24 | Use on the phone | 4 |
| 25 | Receive photos | 2 |
| 26 | Use on the PC | 4 |
| 27 | Choose the photos to transfer | 5 |
| 28 | The receipt covers only these files. | 6 |
| 29 | Their original bytes and photo details stay unchanged. | 8 |
| 30 | Choose photos and videos | 4 |
| 31 | Free transfers include up to 25 files. | 7 |
| 32 | No files selected yet. | 4 |
| 33 | Check files and create phone code | 6 |
| 34 | Move the phone code to the PC | 7 |
| 35 | Paste it into “Receive photos.” | 5 |
| 36 | Connection codes never contain photos. | 5 |
| 37 | Copy phone code | 3 |
| 38 | Bring back the PC code | 6 |
| 39 | Connect and resume transfer | 4 |
| 40 | Paste the phone code | 4 |
| 41 | Received files stay on this device until you download or remove them. | 12 |
| 42 | Create PC code | 3 |
| 43 | Return this code to the phone | 6 |
| 44 | Copy PC code | 3 |
| 45 | Waiting to begin. | 3 |
| 46 | How the transfer works | 4 |
| 47 | Use this page on the phone and PC. | 8 |
| 48 | Keep both devices on the same network. | 7 |
| 49 | Choose the photos. | 3 |
| 50 | Select only the phone files that should appear on the receipt. | 11 |
| 51 | Connect the devices. | 3 |
| 52 | Copy one connection code each way. | 6 |
| 53 | The browser opens an encrypted direct connection. | 7 |
| 54 | Check every file. | 3 |
| 55 | Interrupted transfers send only missing parts. | 6 |
| 56 | A receipt checks whether every byte matches. | 7 |
| 57 | Recent receipts | 2 |
| 58 | Saved only on this device. | 5 |
| 59 | Download each receipt as JSON or a spreadsheet-ready CSV. | 9 |
| 60 | No receipts yet. | 3 |
| 61 | Complete a transfer to save its checked receipt here. | 9 |
| 62 | What it does not do | 5 |
| 63 | The app does not upload photos, choose files for you, or prove that you selected every phone photo. | 18 |
| 64 | Transfer size | 2 |
| 65 | Free transfers support up to 25 files. | 7 |
| 66 | Larger transfers are not for sale while checkout is unavailable. | 10 |
| 67 | Move selected phone photos to a PC and check every file. | 11 |
| 68 | Artwork made for Photo Intake Receipt. | 6 |
| 69 | Built by Param Factory (external) | 5 |

### README

Code blocks and literal URLs are commands/links, not prose sentences. All other prose, labels, and headings follow.

| # | Copy | Words |
| ---: | --- | ---: |
| 1 | Photo Intake Receipt | 3 |
| 2 | Photo Intake Receipt helps people move selected phone photos to a PC. | 12 |
| 3 | It checks each received copy before deletion. | 7 |
| 4 | Live product | 2 |
| 5 | One-click demo | 2 |
| 6 | What it does | 3 |
| 7 | Connects the sending phone directly to the receiving PC. | 9 |
| 8 | Does not route the connection or photos through a public server. | 11 |
| 9 | Sends only missing file parts after an interrupted transfer. | 9 |
| 10 | Keeps original file bytes and embedded photo details unchanged. | 9 |
| 11 | Checks each received copy and creates a receipt. | 8 |
| 12 | Saves transfer progress, received files, and receipts on this device. | 10 |
| 13 | Downloads receipts as JSON or CSV and downloads received files from the PC. | 13 |
| 14 | Works offline after the first visit. | 7 |
| 15 | Supports 25 files per free transfer. | 7 |
| 16 | File checks and receipt downloads need no license. | 8 |
| 17 | A receipt covers only files selected on the sending phone. | 10 |
| 18 | It cannot show that every phone photo was selected. | 9 |
| 19 | The demo uses a separate database and never reads or changes real transfer data. | 14 |
| 20 | Run and verify | 3 |
| 21 | Use Node.js 20 or newer. | 5 |
| 22 | Run `npm run build`, then deploy the generated `dist/` directory. | 10 |
| 23 | Each public product claim and its command is listed in `.factory/claims.json`. | 12 |
| 24 | Android project | 2 |
| 25 | The repository includes a Capacitor Android project for this product. | 10 |
| 26 | Copy web changes into it with: | 6 |
| 27 | With Android SDK API 35 and JDK 21 installed, run: | 10 |
| 28 | The debug app is written to `android/app/build/outputs/apk/debug/app-debug.apk`. | 9 |
| 29 | The file is not committed. | 5 |
| 30 | Release signing happens during deployment. | 5 |
| 31 | Connect the phone and PC | 5 |
| 32 | Open the app on both devices while they share a reachable network. | 12 |
| 33 | On the sending phone, choose files and create a phone code. | 11 |
| 34 | On the receiving PC, paste the phone code and create a PC code. | 13 |
| 35 | Return the PC code to the phone and start the transfer. | 11 |
| 36 | Delete only the selected originals named safe in the receipt. | 10 |
| 37 | Privacy and availability | 3 |
| 38 | The app has no analytics, tracking, external fonts, external scripts, photo server, or user accounts. | 15 |
| 39 | Local data controls are explained on the privacy page. | 9 |
| 40 | Larger transfer licenses are not for sale while checkout is unavailable. | 11 |
| 41 | The app does not show a dead purchase action. | 9 |
| 42 | Project notes | 2 |
| 43 | Product brief | 2 |
| 44 | Visual system and image source | 5 |
| 45 | Build handoff | 2 |
| 46 | License: MIT | 2 |

Terminology is consistently **transfer**, **selected files**, **sending phone / phone code**, **receiving PC / PC code**, **check**, and **saved on this device**. The old `WebRTC`, `SHA-256`, and browser-storage README jargon from `F-2-1` is absent.

## Demo, offline, and privacy

The first action entered `/demo` in one click. Its first screen already showed a completed three-file harbour-trip receipt (`IMG_1842_harbour.jpg`, `IMG_1843_ticket.jpg`, `VID_1844_departure.mp4`) and a paused family-photo transfer with one of four parts saved. The persistent banner was exactly **“Demo — sample data, nothing is saved”**, with **Reset demo** and **Start for real**.

In a fresh live context I seeded a production receipt and `sb_license:phone-photo-intake` sentinel before entering demo. Demo did not display either. Removing demo copies, resetting, and exiting left the sentinel unchanged; source uses distinct `photo-intake-receipt` and `demo:photo-intake-receipt` databases and a `demo:` marker. Reset restored the sample. After service-worker control, `/demo` reloaded offline with its completed receipt. Full live interception recorded only the product origin, no external assets, and no console/page errors.

## Claims

Fresh clone: `/tmp/phone-photo-intake-review-3.gKZTp4`. `npm ci` installed 149 packages with zero vulnerabilities. `npm test` passed 6 files / 15 tests and `npm run build` passed, producing `dist/` (14.01 kB gzip JS). Every claim command was invoked separately; all 17 passed.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `demo-isolation` | Pass | Production sentinels survive demo mutate/reset/exit. |
| `receipt-exports` | Pass | JSON fields and CSV header/rows download. |
| `checks-free` | Pass | Checked receipt and exports work without a license. |
| `selected-files-scope` | Pass | Only selected fixture appears. |
| `offline-pwa` | Pass | Seeded demo reloads offline. |
| `free-limit-25` | Pass | 25 proceed; 26 fail. |
| `checkout-unavailable` | Pass | Availability notice and no checkout action. |
| `direct-local-transfer` | Pass | Empty `iceServers`, direct peer transfer, no photo HTTP. |
| `connection-codes-no-photo-data` | Pass | No filename/bytes in codes. |
| `verified-receipt` | Pass | Known bytes produce zero mismatch. |
| `unchanged-file-bytes` | Pass | EXIF-like bytes match exactly. |
| `local-device-storage` | Pass | Receipt survives copy removal. |
| `download-received-files` | Pass | Receiver download matches source bytes. |
| `same-network-transfer` | Pass | Direct peers complete; unreachable case gives recovery. |
| `privacy-network-boundary` | Pass | Same-origin flow and self-hosted runtime. |
| `resume-missing-parts` | Pass | 20 interruptions retain parts and avoid resend. |
| `android-project` | Pass | Capacitor web directory, launcher, intent, app id exist. |

All claim-like landing and README sentences map to the registry: direct/no-server, unchanged files, receipt/download/local storage, offline, file limit, free checks, selection scope, checkout, and privacy language are covered by the listed tests. No unlisted-claim finding applies.

## Earlier findings rechecked

I read `review-1.md`, `review-2.md`, `polish-1.md`, `polish-2.md`, and the prior handoff, then checked the current source and live deployment rather than accepting fixed labels.

| Earlier item | Current result |
| --- | --- |
| `R1-B1` demo missing/unsafe | Fixed: one-click seeded, resettable, isolated, offline demo verified. |
| `R1-B2` registry/tests absent and its claim rows | Fixed: 17 listed commands passed; mapped claims below. |
| `R1-B3` unknown URL became home | Fixed: designed HTTP 404 returned. |
| `R1-B4` dead checkout | Fixed: no checkout action, claim-tested notice. |
| `R1-B5` chooser focus invisible | Fixed: live `.file-pick:focus-within` 4 px outline; regression passed. |
| `R1-M1` first screen underspecified | Fixed: cold-read answers and three facts visible. |
| `R1-M2` route metadata/structure incomplete | Fixed: verified in route table below. |
| `R1-MOD1` mobile targets/overflow | Fixed: 390 px test passed. |
| `R1-MIN1` wrong PC-code error | Fixed: source/test name PC code and next step. |
| `R1-COPY` jargon/inconsistent terms | Fixed: complete audit above passes. |
| `R1-IDENTITY` generic/inconsistent appearance | Fixed: blueprint design is consistent live. |
| `F-2-1` README jargon | Fixed: direct phone-to-PC/on-device wording remains. |

The earlier claim rows map individually as follows: encrypted transfer → `direct-local-transfer`; resume chunks → `resume-missing-parts`; hash receipt → `verified-receipt`; no cloud upload → direct/privacy; preserve bytes → `unchanged-file-bytes`; local storage → `local-device-storage`; receipt export → `receipt-exports`; received-files download unchanged; selected scope → `selected-files-scope`; offline unchanged; free limit unchanged; free checks unchanged; same network → `same-network-transfer`; Android build → `android-project`; no accounts/trackers/CDNs → `privacy-network-boundary`. Former unavailable price, unlimited-license, subscription, cross-device-license, billing-boundary, and test-suite claims were removed from visitor copy; `checkout-unavailable` confirms no replacement dead sale action.

## Structure, routes, links, and leverage

| Route | HTTP | Title | H1 |
| --- | ---: | --- | --- |
| `/` | 200 | Photo Intake Receipt — move and verify phone photos | Move phone photos to your PC, then verify |
| `/demo` | 200 | Demo — Photo Intake Receipt | Review a finished photo transfer |
| `/privacy/` | 200 | Privacy — Photo Intake Receipt | Privacy, drawn plainly |
| `/terms/` | 200 | Terms — Photo Intake Receipt | Terms of use |
| `/no-such-review-route` | 404 | Page not found — Photo Intake Receipt | Page not found |

Each had one `<main>`/`<h1>`, description, canonical, OG/Twitter product art, favicon, `lang=en`, consistent header/skip link/footer, Privacy/Terms, and build id. `robots.txt`, sitemap, manifest, icon, and OG image returned 200. `/`, `/demo`, `/demo?transfer=1`, anchors, legal routes, and the explicit external link were crawled successfully; mail is explicit `mailto:`. Client navigation focused the new H1 and Back returned focus to landing H1. The announced route live region is present.

Visual inspection at 390 px and desktop found the warm blueprint grid, clipped receipt sheets, serif/monospace pairing, original transfer illustration, and verification stamps documented in `design.md`; it is not a generic SaaS template. JSON/CSV and received-file downloads cover the implied export need. The brief calls for deterministic local transfer and verification, not AI; an AI step would be decorative. No missed-leverage or AI finding applies.

## What would make this perfect

Nothing remains to change in this round. Preserve the isolated demo and claim suite as release gates and repeat this full review after any user-visible, storage, or network change.
