# Adversarial first-read review 2 — FAIL

**Work order:** `phone-photo-intake-review-2`  
**Reviewed:** 2026-08-28 UTC  
**Candidate:** `872fe83a274d46783e54a3d0b0da127078ffa550`  
**Live URL:** <https://phone-photo-intake.sociobot.in>

## Verdict

**FAIL.** There is one minor finding, `F-2-1`: the README introduces core product behaviour with unexplained implementation terms. The first-read and product-flow checks otherwise passed. This round cannot be marked PASS because the required standard is zero findings of every severity.

## Thirty-second cold read

I used fresh Chromium contexts at 390 × 844 and 1440 × 900. I recorded this before scrolling.

| Question | 390 px | Desktop |
| --- | --- | --- |
| What does this do? | It moves selected photos from a phone to a PC, checks that they arrived, and gives a receipt before I delete phone copies. | Same. |
| For whom? | People who want proof that selected phone photos reached their PC before deleting them. | Same. |
| What should I click first? | **Try it with sample data**. The adjacent text says it opens a completed receipt. | Same. |

The exact first-screen copy that made this clear was: “Move phone photos to your PC, then verify”; “For people who want proof their selected photos arrived before deleting the phone copies.”; “Try it with sample data”; and “Opens a completed receipt.” The three facts—no server upload, offline after first visit, and free for 25 files—were also visible without scrolling. This is not a first-screen blocking finding.

## Findings

### F-2-1 — minor: README uses implementation jargon for the core job

**Location and exact copy:** README, “What it does” bullets:

- “Connects a sending phone and receiving PC through an encrypted direct WebRTC connection.”
- “Checks both copies with SHA-256 and creates a receipt.”
- “Saves progress, received files, and receipts in browser device storage.”

**Why this fails:** The product screen deliberately says “encrypted direct connection,” “check every file,” and “saved only on this device.” The README regresses to `WebRTC`, `SHA-256`, and “browser device storage” without explaining why a normal photo-transfer visitor should care. The plain-words requirement explicitly includes the README. These terms are not needed to decide whether the product fits the job.

**Concrete fix:** Keep the technical terms in a separate developer note if needed, and rewrite the visitor-facing bullets as:

- “Connects the sending phone directly to the receiving PC.”
- “Checks each received copy and creates a receipt.”
- “Saves transfer progress, received files, and receipts on this device.”

The existing `direct-local-transfer`, `verified-receipt`, and `local-device-storage` claim tests already prove these rewritten claims; no new product assertion is needed.

## Copy audit

Method: whitespace-separated word counts; hyphenated terms count as one. Headings, labels, buttons, and empty/error states are included because they must stand alone. Dynamic receipt values and hidden update text are excluded. The landing page has no item over 22 words, banned marketing adjective, inconsistent product term, opaque heading, or non-result-naming button. The README flags are consolidated in `F-2-1`.

### Landing page

| # | Exact copy | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Skip to main content | 4 | Pass |
| 2 | Photo Intake Receipt | 3 | Pass |
| 3 | Home | 1 | Pass |
| 4 | Demo | 1 | Pass |
| 5 | Transfer | 1 | Pass |
| 6 | Privacy | 1 | Pass |
| 7 | Direct photo transfer | 3 | Pass |
| 8 | Move phone photos to your PC, then verify | 8 | Pass |
| 9 | For people who want proof their selected photos arrived before deleting the phone copies. | 14 | Pass |
| 10 | Try it with sample data | 5 | Pass |
| 11 | Opens a completed receipt. | 4 | Pass |
| 12 | Transfer my photos | 3 | Pass |
| 13 | Photos do not upload to a server. | 7 | Pass |
| 14 | Works offline after the first visit. | 7 | Pass |
| 15 | Free for 25 files per transfer. | 6 | Pass |
| 16 | Selected → transferred → checked | 3 | Pass |
| 17 | Offline mode. | 2 | Pass |
| 18 | Saved receipts remain available to review and download. | 8 | Pass |
| 19 | Photo transfer | 2 | Pass |
| 20 | Transfer on both devices | 4 | Pass |
| 21 | Open this page on the sending phone and receiving PC. | 10 | Pass |
| 22 | Choose what this device does. | 5 | Pass |
| 23 | Send photos | 2 | Pass |
| 24 | Use on the phone | 4 | Pass |
| 25 | Receive photos | 2 | Pass |
| 26 | Use on the PC | 4 | Pass |
| 27 | Choose the photos to transfer | 5 | Pass |
| 28 | The receipt covers only these files. | 6 | Pass |
| 29 | Their original bytes and photo details stay unchanged. | 8 | Pass |
| 30 | Choose photos and videos | 4 | Pass |
| 31 | Free transfers include up to 25 files. | 7 | Pass |
| 32 | No files selected yet. | 4 | Pass |
| 33 | Check files and create phone code | 6 | Pass |
| 34 | Move the phone code to the PC | 7 | Pass |
| 35 | Paste it into “Receive photos.” | 5 | Pass |
| 36 | Connection codes never contain photos. | 5 | Pass |
| 37 | Copy phone code | 3 | Pass |
| 38 | Bring back the PC code | 6 | Pass |
| 39 | Connect and resume transfer | 4 | Pass |
| 40 | Paste the phone code | 4 | Pass |
| 41 | Received files stay on this device until you download or remove them. | 12 | Pass |
| 42 | Create PC code | 3 | Pass |
| 43 | Return this code to the phone | 6 | Pass |
| 44 | Copy PC code | 3 | Pass |
| 45 | Waiting to begin. | 3 | Pass |
| 46 | How the transfer works | 4 | Pass |
| 47 | Use this page on the phone and PC. | 8 | Pass |
| 48 | Keep both devices on the same network. | 7 | Pass |
| 49 | Choose the photos. | 3 | Pass |
| 50 | Select only the phone files that should appear on the receipt. | 11 | Pass |
| 51 | Connect the devices. | 3 | Pass |
| 52 | Copy one connection code each way. | 6 | Pass |
| 53 | The browser opens an encrypted direct connection. | 7 | Pass |
| 54 | Check every file. | 3 | Pass |
| 55 | Interrupted transfers send only missing parts. | 6 | Pass |
| 56 | A receipt checks whether every byte matches. | 7 | Pass |
| 57 | Recent receipts | 2 | Pass |
| 58 | Saved only on this device. | 5 | Pass |
| 59 | Download each receipt as JSON or a spreadsheet-ready CSV. | 9 | Pass |
| 60 | No receipts yet. | 3 | Pass |
| 61 | Complete a transfer to save its checked receipt here. | 9 | Pass |
| 62 | What it does not do | 5 | Pass |
| 63 | The app does not upload photos, choose files for you, or prove that you selected every phone photo. | 18 | Pass |
| 64 | Transfer size | 2 | Pass |
| 65 | Free transfers support up to 25 files. | 7 | Pass |
| 66 | Larger transfers are not for sale while checkout is unavailable. | 10 | Pass |
| 67 | Move selected phone photos to a PC and check every file. | 11 | Pass |
| 68 | Artwork made for Photo Intake Receipt. | 6 | Pass |
| 69 | Built by Param Factory (external) | 5 | Pass |

### README

Code blocks, literal URLs, and command names are excluded because they are commands/links, not prose sentences. All prose, labels, and headings are included below.

| # | Exact copy | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Photo Intake Receipt | 3 | Pass |
| 2 | Photo Intake Receipt helps people move selected phone photos to a PC. | 12 | Pass |
| 3 | It checks each received copy before deletion. | 7 | Pass |
| 4 | Live product | 2 | Pass |
| 5 | One-click demo | 2 | Pass |
| 6 | What it does | 3 | Pass |
| 7 | Connects a sending phone and receiving PC through an encrypted direct WebRTC connection. | 13 | `F-2-1`: WebRTC jargon |
| 8 | Uses no public connection relay or photo server. | 8 | Pass |
| 9 | Sends only missing file parts after an interrupted transfer. | 9 | Pass |
| 10 | Keeps original file bytes and embedded photo details unchanged. | 9 | Pass |
| 11 | Checks both copies with SHA-256 and creates a receipt. | 9 | `F-2-1`: SHA-256 jargon |
| 12 | Saves progress, received files, and receipts in browser device storage. | 10 | `F-2-1`: storage jargon |
| 13 | Downloads receipts as JSON or CSV and downloads received files from the PC. | 13 | Pass |
| 14 | Works offline after the first visit. | 6 | Pass |
| 15 | Supports 25 files per free transfer. | 6 | Pass |
| 16 | File checks and receipt downloads need no license. | 8 | Pass |
| 17 | A receipt covers only files selected on the sending phone. | 10 | Pass |
| 18 | It cannot show that every phone photo was selected. | 9 | Pass |
| 19 | The demo uses a separate database and never reads or changes real transfer data. | 14 | Pass; technical detail is necessary to state isolation |
| 20 | See `.factory/demo.md`. | 3 | Pass |
| 21 | Run and verify | 3 | Pass |
| 22 | Use Node.js 20 or newer. | 5 | Pass; developer setup |
| 23 | Run `npm run build`, then deploy the generated `dist/` directory. | 10 | Pass; developer instruction |
| 24 | Each public product claim and its command is listed in `.factory/claims.json`. | 12 | Pass; developer instruction |
| 25 | Android project | 2 | Pass |
| 26 | The repository includes a Capacitor Android project for this product. | 10 | Pass; developer fact covered by `android-project` |
| 27 | Copy web changes into it with: | 6 | Pass; developer instruction |
| 28 | With Android SDK API 35 and JDK 21 installed, run: | 10 | Pass; developer instruction |
| 29 | The debug app is written to `android/app/build/outputs/apk/debug/app-debug.apk`. | 13 | Pass; developer instruction |
| 30 | The file is not committed. | 5 | Pass |
| 31 | Release signing happens during deployment. | 5 | Pass |
| 32 | Connect the phone and PC | 5 | Pass |
| 33 | Open the app on both devices while they share a reachable network. | 12 | Pass |
| 34 | On the sending phone, choose files and create a phone code. | 11 | Pass |
| 35 | On the receiving PC, paste the phone code and create a PC code. | 13 | Pass |
| 36 | Return the PC code to the phone and start the transfer. | 11 | Pass |
| 37 | Delete only the selected originals named safe in the receipt. | 10 | Pass |
| 38 | Privacy and availability | 3 | Pass |
| 39 | The app has no analytics, tracking, external fonts, external scripts, photo server, or user accounts. | 15 | Pass; covered by `privacy-network-boundary` |
| 40 | Local data controls are explained on the privacy page. | 9 | Pass |
| 41 | Larger transfer licenses are not for sale while checkout is unavailable. | 11 | Pass; covered by `checkout-unavailable` |
| 42 | The app does not show a dead purchase action. | 9 | Pass; covered by `checkout-unavailable` |
| 43 | Project notes | 2 | Pass |
| 44 | Product brief | 2 | Pass |
| 45 | Visual system and image source | 5 | Pass |
| 46 | Build handoff | 2 | Pass |
| 47 | License: MIT | 2 | Pass |

Terminology stayed consistent on the landing page: **transfer**, **selected files**, **sending phone / phone code**, **receiving PC / PC code**, **check files**, and **saved on this device**. The three README jargon regressions are the only exception.

## Demo and sandbox verification

- The first-screen link entered `/demo` in one click. It immediately showed the persistent “Demo — sample data, nothing is saved” banner, **Reset demo**, **Start for real**, a completed three-file harbour-trip receipt (`IMG_1842_harbour.jpg`, `IMG_1843_ticket.jpg`, and `VID_1844_departure.mp4`), and the visibly paused four-part family-photo transfer.
- Reset restored the completed sample. I seeded production local storage with `sb_license:phone-photo-intake = production-license-sentinel` and a production receipt; neither appeared in demo. Reset and **Start for real** left the sentinel unchanged. Code confirms the separate `demo:photo-intake-receipt` database and `demo:` local-storage marker.
- A fresh live `/demo` visit waited for service-worker control, then reloaded offline with the sample receipt still available.
- Network interception through the live demo flow observed only `https://phone-photo-intake.sociobot.in` requests and no console or page errors. This confirms the live privacy boundary for the demonstrated flow.

## Claims verification

I used clean clone `/tmp/phone-photo-intake-review-2` at the reviewed commit, ran `npm ci`, and invoked every `test` command from `.factory/claims.json` separately. All 17 entries passed; `receipt-exports` and `checks-free` intentionally share one tagged browser test, as do the eight two-peer transfer assertions. The final full `npm run test:e2e` run also passed (the Playwright last-run report records `status: passed` and no failed tests), including the 20-run interruption campaign.

| Claim ID | Result | Observable evidence checked by its listed test |
| --- | --- | --- |
| `demo-isolation` | Pass | Production sentinel remains unchanged across demo mutation, reset, and exit. |
| `receipt-exports` | Pass | Sample receipt downloads as JSON and CSV with expected rows. |
| `checks-free` | Pass | Checked receipt and both downloads work without a license. |
| `selected-files-scope` | Pass | Only selected source files appear in the receipt. |
| `offline-pwa` | Pass | Seeded demo reloads offline after the first visit. |
| `free-limit-25` | Pass | 25 files continue; 26 files are rejected. |
| `checkout-unavailable` | Pass | Exit shows availability notice and no checkout action. |
| `direct-local-transfer` | Pass | Two demo peers use `iceServers: []` and no photo HTTP upload. |
| `connection-codes-no-photo-data` | Pass | Codes decode to SDP details, not sample filename or bytes. |
| `verified-receipt` | Pass | Known bytes produce zero-mismatch safe-to-delete receipt. |
| `unchanged-file-bytes` | Pass | EXIF-like fixture is downloaded byte-for-byte unchanged. |
| `local-device-storage` | Pass | Demo IndexedDB retains receipt after received copies are removed. |
| `download-received-files` | Pass | Receiving PC download matches source bytes. |
| `same-network-transfer` | Pass | Direct peers complete; unreachable peer gets a recovery error. |
| `privacy-network-boundary` | Pass | Full flow has same-origin HTTP requests and no external runtime assets. |
| `resume-missing-parts` | Pass | Twenty interrupted two-peer runs retain saved parts and avoid resend. |
| `android-project` | Pass | Capacitor Android web directory, launcher activity, intent, and app id exist. |

I cross-checked every visitor-facing claim on the live landing page and README against this registry. Each maps to an entry above; there is no unlisted-claim finding. The README terminology issue in `F-2-1` changes wording, not the underlying registered claims.

## Previous-finding regression check

I read `review-1.md`, `polish-1.md`, and the previous handoff, then checked the live site and current source rather than accepting their fixed status.

| Earlier finding | Current confirmation |
| --- | --- |
| `R1-B1` demo isolation | Fixed: live `/demo` is one click, seeded, resettable, bannered, and uses the separate demo database. |
| `R1-B2` missing registry/tests and its 21 claim rows | Fixed: `.factory/claims.json` has 17 mapped observable claims; the complete mapping is exercised in the table above. Removed former billing/licensing claims are not displayed. |
| `R1-B3` unknown routes become home | Fixed: `/does-not-exist` returns HTTP 404 and renders the blueprint-styled “Page not found” page with a return link. |
| `R1-B4` dead paid checkout | Fixed: the live DOM has no checkout link; the availability sentence is present and claim-tested. |
| `R1-B5` invisible chooser focus | Fixed: current `.file-pick:focus-within` has a visible 4 px outline and its regression test passes. |
| `R1-M1` under-specified first screen | Fixed: cold mobile and desktop answers are clear, with the requested action and three facts. |
| `R1-M2` missing metadata, structure, and route focus | Fixed: route titles, descriptions, canonicals, OG/Twitter, common header/footer, focus, announcement, three steps, and boundary section are present. |
| `R1-MOD1` short mobile targets | Fixed: current 390 px viewport has no horizontal overflow and header/footer target checks pass. |
| `R1-MIN1` wrong PC-code error | Fixed: the current error says “That PC code is incomplete. Copy the full PC code and try again.” |
| `R1-COPY` landing/README wording | Landing fixed; README jargon is the new, narrower `F-2-1` finding. |
| `R1-IDENTITY` generic or inconsistent visual identity | Fixed: current mobile screenshots show the documented drafting-paper grid, navy/vermillion marks, original photo-transfer artwork, clipped borders, and serif/monospace pairing. It is not a generic SaaS template. |

## Structure, accessibility, and routing

| Route | HTTP | Title | H1 | Metadata/structure |
| --- | ---: | --- | --- | --- |
| `/` | 200 | `Photo Intake Receipt — move and verify phone photos` | Move phone photos to your PC, then verify | One main/H1; 98-character description; canonical, OG/Twitter image, SVG favicon. |
| `/demo` | 200 | `Demo — Photo Intake Receipt` | Review a finished photo transfer | One main/H1; route canonical and demo description. |
| `/privacy/` | 200 | `Privacy — Photo Intake Receipt` | Privacy, drawn plainly | One main/H1; route canonical and description. |
| `/terms/` | 200 | `Terms — Photo Intake Receipt` | Terms of use | One main/H1; route canonical and description. |
| `/does-not-exist` | 404 | `Page not found — Photo Intake Receipt` | Page not found | Designed 404 with return link and product metadata. |

- Client navigation to Demo focuses its H1; browser Back returns to the landing H1. The live region is present in source.
- The landing crawl found every same-origin link (`/`, `/demo`, `/#main`, `/privacy/`, `/terms/`) returning 200. The footer’s explicitly marked external Param Factory link and mail link are not dead internal routes.
- The header, skip link, footer one-liner, Privacy, Terms, and build ID are consistent across all tested routes.
- Fresh mobile and desktop loads had no console or page errors. The 390 px document width equalled the viewport width.
- No AI feature is present. That is appropriate here: byte-preserving transfer and verification need deterministic local checks, and the brief does not imply an AI decision. Existing receipt JSON/CSV and received-file downloads cover the obvious export need.

## What would make this perfect

Replace the three README core-flow bullets in `F-2-1` with the proposed plain-language wording, re-run the copy audit and the three existing mapped claim tests, and repeat this review. No additional capability, payment path, AI feature, storage service, or visual redesign is indicated by the brief.

## Verification commands

Clean clone commands run:

```sh
npm ci
npm test
npm run build
# each test value in .factory/claims.json, separately
npm run test:e2e
```

`npm test` passed: 5 files / 13 tests. `npm run build` passed and produced `dist/`; the main JavaScript bundle was 14.01 kB gzip.
