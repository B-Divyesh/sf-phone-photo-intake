# Adversarial first-read review 1 — FAIL

**Work order:** `phone-photo-intake-review-1`

**Candidate:** `2df6d8a3a6724985594239b7279712180684a5dc`

**Live URL:** <https://phone-photo-intake.sociobot.in>

**Reviewed:** 2026-08-28 UTC
**Viewport checks:** 390 × 844 and 1440 × 900, fresh Chromium contexts

## Verdict

**FAIL.** There are five blocking findings: no sample-data demo, no claims registry or claim-tagged tests, broken unknown-route handling, a dead paid checkout action, and invisible keyboard focus on the main file chooser. There are also multiple structural and copy findings. This is above the PASS limit of zero blocking and at most three minor findings.

## Thirty-second cold read

I did not scroll or use repository context before recording these answers.

| Question | 390 px answer | Desktop answer | Result |
| --- | --- | --- | --- |
| What does this do? | It moves selected phone files, checks that they arrived, and produces a receipt before deletion. | Same. The phone-to-computer illustration reinforces the transfer. | Clear enough. |
| For whom? | People moving photos from a phone who want proof before deleting the originals. This is inferred; the hero never directly says “for people moving phone photos to a PC.” | Same inference. “Open this app on the phone and PC” starts at the bottom of the first viewport. | Major copy weakness, not blocking: the intended situation can still be inferred. |
| What should I click first? | **Start an intake**. | **Start an intake**. | The action is visible, but it scrolls to an empty picker rather than a sample. |

Exact first-screen copy: “Know the photos arrived. Then delete.” “Move a selected phone batch over an encrypted local connection. Interrupted chunks resume. Every byte is hashed into a receipt you can keep.” “Start an intake.” “No cloud upload.”

The screen supplies only one of the required three facts. Offline behavior and price are absent. The primary action also fails to state what appears after activation.

## Findings, ordered by severity

### BLOCKING 1 — there is no one-click demo, and the nominal demo URLs read real storage

**Quote:** “Start an intake”; “No files selected yet.”

There is no **Try it with sample data** action on the first screen. Activating **Start an intake** only scrolls to an empty file picker. `/demo` and `/?demo=1` both render that same empty production screen. Neither route has a “Demo — sample data, nothing is saved” banner, **Reset demo**, or **Start for real**.

This is also unsafe as a supposed sandbox. I seeded the normal `sb_license:phone-photo-intake` local-storage keys and a receipt named `receipt-real-sentinel` in the normal `photo-intake-receipt` IndexedDB database. Both `/demo` and `/?demo=1` displayed the real unlocked-license state, the real token in the license field, and the seeded receipt. Demo activity therefore is not isolated from real data.

**Concrete fix:** Add **Try it with sample data** beside the real first action. Route it to `/demo`, immediately render a realistic completed and interrupted photo batch, keep a persistent demo banner, implement **Reset demo** and **Start for real**, and use a separate `demo:` storage namespace. Add a test that seeds production storage, mutates and resets the demo, and confirms the production sentinel is neither displayed nor changed.

### BLOCKING 2 — `.factory/claims.json` and all claim-tagged tests are missing

**Quote:** “Interrupted chunks resume.” “No cloud upload.” “Works as an installable offline PWA.”

`.factory/claims.json` does not exist. `rg "@claim:"` finds no tests. There were therefore zero listed claim commands to run from the clean clone; this is a missing required verification surface, not a 0/0 pass. Existing unit and browser tests pass, but they are not mapped to public claims and do not cover all claims below.

Every row is a separate unlisted-claim finding. Repeated wording across the landing page and README can share one claim entry if `where` lists both locations.

| ID to add | Unlisted claim-like copy | Required observable test |
| --- | --- | --- |
| `encrypted-local-transfer` | “Move a selected phone batch over an encrypted local connection.” / “encrypted peer-to-peer WebRTC connection” / “DTLS-encrypted WebRTC data channel” | Use two clean demo peers, assert direct WebRTC with `iceServers: []`, successful transfer, and no photo request to a server. |
| `resume-missing-chunks` | “Interrupted chunks resume.” / “Resumes a re-paired batch by requesting only chunk indexes absent at the destination.” / “Only missing chunks are sent.” | Interrupt a multi-chunk demo transfer, reconnect, count sent chunks, and assert completed chunks are not resent. |
| `hash-receipt` | “Every byte is hashed into a receipt you can keep.” / “compares SHA-256 hashes” / “issues a locally sealed receipt” | Transfer bundled sample bytes, independently calculate both hashes, and validate the downloaded receipt. |
| `no-cloud-upload` | “No cloud upload.” / “without … cloud photo upload … or relay” | Intercept the full demo flow and assert all HTTP requests are same-origin or the documented billing exception, with no media upload. |
| `preserve-original-bytes` | “Files are read unchanged, preserving EXIF and original bytes.” / “Preserves file bytes—including EXIF—without decoding or recompressing media.” | Transfer a bundled JPEG with EXIF and compare source/destination bytes and EXIF exactly. |
| `local-browser-storage` | “The files stay in this browser’s local storage until you download or clear them.” / “Saves incoming chunks, completed files, manifests, and receipts to IndexedDB.” | Inspect the named stores after demo transfer, then clear the batch and assert only the receipt remains. |
| `receipt-export` | “JSON and CSV exports are always available.” / “Exports every receipt as JSON or CSV.” | Download both formats and assert headers, fields, and one row per sample file. |
| `download-received-files` | “received files can be downloaded from the destination” | Download every bundled sample file and compare each file with its source bytes. |
| `receipt-selected-scope` | “a receipt only covers the files selected in that source batch” / “It cannot prove that every photo on a phone was selected.” | Seed selected and unselected sample files, then assert the receipt lists only the selected set and states that limit. |
| `offline-pwa` | “Works as an installable offline PWA.” / “Saved receipts and local pairing still work.” | First load demo, set the context offline, reload, open a sample receipt, and verify the offline manifest/service worker state. |
| `free-limit-25` | “Free batches include up to 25 files.” / “free tier of 25 files per batch” | Confirm 25 files can be prepared and 26 cannot in clean free-mode storage. |
| `price-once-499` | “Remove the 25-file batch limit for ₹499 once.” / “one-time ₹499 Sociobot license” | Contract-test the enabled product and checkout response for ₹499 and one-time billing before displaying the action. |
| `checks-free` | “Verification, safe-delete checks, and exports are free for everyone.” | Complete verification and both exports without a license. |
| `unlimited-license` | “Unlimited files per selected batch.” | Apply a valid sandbox license and prepare more than 25 sample files. |
| `no-storage-subscription` | “One-time purchase, no storage subscription.” | Verify the billing product has no recurring interval and the app does not sell hosted storage. |
| `license-another-device` | “Use the license on another device.” | Document and test the second-device restore flow with a sandbox license. |
| `no-accounts-trackers-cdns` | “There are no analytics, trackers, third-party fonts, runtime CDNs, photo servers, or user accounts.” | Intercept all requests and inspect loaded scripts/fonts through the full demo flow. |
| `billing-boundary` | “Purchases use only the Sociobot billing API … payment card details never enter this app.” | Assert checkout goes only to the enabled Sociobot endpoint and no card form or payment-provider script loads in the app. |
| `same-network-requirement` | “Both devices must be able to reach each other on the same local network.” | Run the demo peer flow on the documented topology and add a clear failure test for an unreachable peer. |
| `android-build` | “includes a Capacitor Android project skeleton” | Build the clean Android project and record the APK as claim evidence, or remove this visitor-facing capability claim. |
| `test-suite-scope` | “`npm run test:e2e` … checks desktop and 390 px mobile UI, WCAG serious/critical issues, legal routes, real two-peer byte transfer, receipt generation, and offline reload.” | Keep a meta-test or CI manifest that proves each named check is collected and run. |

**Concrete fix:** Create `.factory/claims.json`, use exactly one `@claim:<id>` test per claim, seed all tests through `/demo`, and remove claims that cannot be observed in that sandbox.

### BLOCKING 3 — unknown routes silently become the home page

**Quote:** At `/does-not-exist`, the H1 is “Know the photos arrived. Then delete.” and the response is HTTP 200.

There is no designed 404. `/does-not-exist`, `/receipts/xyz`, and `/demo` all silently render the landing app with the landing title. A visitor following a bad receipt or demo link cannot tell that the destination does not exist. This is broken routing under the review contract.

**Concrete fix:** Recognize supported routes explicitly, render a product-styled “Page not found” screen for all others with a home link, and configure the host to return 404 where supported. Add direct-load and reload tests for `/demo`, `/privacy/`, `/terms/`, and an unknown URL.

### BLOCKING 4 — the paid primary action is a dead link

**Quote:** “Buy Intake Unlimited.”

Both HEAD and GET to `https://api.sociobot.in/api/v1/products/phone-photo-intake/checkout` returned HTTP 404 with `{"error":"enabled factory product","status":404}`. The page offers a ₹499 purchase that cannot start.

**Concrete fix:** Do not render the purchase action until the Sociobot product is enabled and a contract test gets the expected checkout response. If billing is intentionally unavailable, replace the price box with a plain availability statement and no dead action.

### BLOCKING 5 — keyboard focus disappears on the main file chooser

**Quote:** “Choose photos and videos.”

When `#file-input` receives keyboard focus, it is `opacity: 0`. Its computed 3 px outline is therefore invisible. The visible 874 × 84 px label has `outline: none`. A keyboard user loses their location on the central product action. The automated axe scan reports no serious/critical violations, so this requires the manual check.

**Concrete fix:** Add a high-contrast `.file-pick:focus-within` outline and a browser regression that focuses the real file input and asserts a visible style on its label.

### Major — first-screen audience, outcome, and facts are under-specified

**Quote:** “Move a selected phone batch over an encrypted local connection.” “Start an intake.” “No cloud upload.”

“Batch,” “intake,” and “encrypted local connection” make the visitor translate implementation language. The hero does not explicitly say phone-to-PC or identify the user situation. It provides one short fact rather than privacy, offline, and price facts. “Start an intake” names a process, not the result.

**Concrete rewrite:**

> Move phone photos to your PC, then verify them
>
> For people who want proof their selected photos arrived before deleting the phone copies.
>
> **Try it with sample data** — opens a completed transfer receipt
>
> **Transfer my photos** — starts with the phone file picker
>
> Photos do not upload to a server · Works offline after the first visit · Free for 25 files per transfer

### Major — route metadata and shared structure are incomplete

The root has a valid `lang`, description, SVG favicon, one H1, one main landmark, image alt text, and a 51-character title. However:

- `/privacy/` and `/terms/` keep “Photo Intake Receipt — transfer, verify, then delete” instead of route titles such as “Privacy — Photo Intake Receipt.”
- `/demo` has no demo title or demo H1.
- No route has a canonical link, Open Graph fields, Twitter card fields, or an Apple touch icon.
- `sitemap.xml` omits `/demo`.
- Legal-page headers omit the landing header navigation. The footer has no build/version identifier.
- There is no route-change H1 focus or route announcement. Activating **Start an intake** moves focus from the link to `<body>`, not the workbench heading.
- The landing page has a four-item proof strip rather than a clear three-step “How it works” section, and no plain “What it does not do” section.

**Concrete fix:** Add route metadata, `/demo` to the sitemap, consistent header/footer markup, build ID, H1 focus plus a polite route announcer, and the missing skeleton sections. Add metadata assertions per route.

### Moderate — mobile touch targets are too short

At 390 px the wordmark link is 208 × 36 px; footer **Privacy** and **Terms** links are 50 × 19 and 36 × 19 px. These do not meet the 44 px target requirement.

**Concrete fix:** Give standalone header and footer links a minimum 44 px block size through padding/min-height, then measure them in a 390 px test.

### Minor — the receiver-code error names the wrong code

**Quote:** After entering an invalid value in **Receiver code**, the status says “That sender code is invalid or incomplete. Copy the full code and try again.”

The correction sends the visitor to the wrong side of the pairing flow.

**Concrete rewrite:** “That receiver code is incomplete. Copy the full receiver code from the PC and try again.” Add a test for the sender-side receiver-code field.

### Pass observations

- The blueprint drafting-sheet identity is distinct and matches `.factory/design.md`; it is not a generic SaaS template.
- Fresh mobile and desktop loads produced no console/page errors.
- Live axe found zero serious or critical findings at 390 px.
- Initial load and the file-selection/hash action issued only same-origin HTTP requests. Offline reload worked after service-worker control.
- Internal links to `/`, `/privacy/`, `/terms/`, the manifest, icons, robots, and sitemap returned 200.

## Copy audit

Counting method: whitespace-separated words; arrows and standalone punctuation are not words; hyphenated technical terms count as one. UI fragments, headings, labels, and buttons are included because they must make sense independently. Dynamic receipt content and numbers such as `0%` are excluded. “Flag / rewrite” is `—` where no issue was found.

### Landing page

| # | Exact copy | Words | Flag / proposed rewrite |
| ---: | --- | ---: | --- |
| 1 | Skip to main content | 4 | — |
| 2 | Photo Intake Receipt | 3 | — |
| 3 | Transfer | 1 | — |
| 4 | Receipts | 1 | — |
| 5 | Unlock | 1 | Banned/vague nav term. Use **Pricing**. |
| 6 | Local transfer instrument · sheet 01 | 5 | Jargon/decorative fragment. Use “Direct photo transfer.” |
| 7 | Know the photos arrived. | 4 | — |
| 8 | Then delete. | 2 | — |
| 9 | Move a selected phone batch over an encrypted local connection. | 10 | “Batch” and “encrypted local connection” are jargon. Use “Move selected photos directly from your phone to your PC.” |
| 10 | Interrupted chunks resume. | 3 | “Chunks” is implementation jargon. Use “Interrupted transfers resume.” |
| 11 | Every byte is hashed into a receipt you can keep. | 10 | “Hashed” is jargon. Use “Every file is checked and listed on a receipt.” |
| 12 | Start an intake | 3 | Non-result action and inconsistent “intake.” Use **Transfer my photos**; add **Try it with sample data** first. |
| 13 | No cloud upload | 3 | “Cloud” is broad. Use “Photos do not upload to a server.” |
| 14 | Selected → transferred → checked | 3 | — |
| 15 | Select | 1 | Out-of-context heading. Use “Choose photos.” |
| 16 | Pair locally | 2 | “Pair” is jargon. Use “Connect the phone and PC.” |
| 17 | Resume chunks | 2 | Jargon. Use “Resume the transfer.” |
| 18 | Compare SHA-256 | 2 | Unexplained jargon. Use “Check every file.” |
| 19 | Offline mode. | 2 | — |
| 20 | Saved receipts and local pairing still work. | 7 | “Local pairing” is jargon. Use “Saved receipts and direct device connections still work.” |
| 21 | License checks will retry later. | 5 | — |
| 22 | Working drawing · A-01 | 3 | Heading fragment makes no sense alone. Use “Photo transfer.” |
| 23 | Start on both devices | 4 | — |
| 24 | Open this app on the phone and PC. | 8 | — |
| 25 | Pick the role each device plays; pairing codes are exchanged directly by you. | 13 | Passive and jargon-heavy. Use “Choose what each device does. You will copy one connection code each way.” |
| 26 | Send photos | 2 | — |
| 27 | Usually the phone | 3 | — |
| 28 | Receive photos | 2 | — |
| 29 | Usually the PC | 3 | — |
| 30 | Source device | 2 | Inconsistent with “sender” and “phone.” Use “Sending device” everywhere. |
| 31 | LAN / DTLS / SHA-256 | 3 | Three unexplained acronyms. Use “DIRECT / ENCRYPTED / FILES CHECKED.” |
| 32 | Select the exact batch | 4 | “Batch” conflicts with photos/files. Use “Choose the photos to transfer.” |
| 33 | The receipt can only cover what you choose here. | 9 | — |
| 34 | Files are read unchanged, preserving EXIF and original bytes. | 9 | “EXIF” is unexplained. Use “Files keep their original bytes and photo details.” |
| 35 | Choose photos and videos | 4 | — |
| 36 | Free batches include up to 25 files. | 7 | “Batches” is inconsistent. Use “Free transfers include up to 25 files.” |
| 37 | No files selected yet. | 4 | — |
| 38 | Hash batch and create sender code | 6 | Jargon and inconsistent role term. Use **Check files and create phone code**. |
| 39 | Move the sender code to the PC | 7 | Inconsistent role term. Use “Move the phone code to the PC.” |
| 40 | Paste it into “Receive photos” there. | 6 | — |
| 41 | Pairing codes contain connection details, never photo bytes. | 8 | Jargon. Use “Connection codes identify the devices. They never contain photos.” |
| 42 | Sender code | 2 | Use “Phone code” consistently. |
| 43 | Copy sender code | 3 | Use **Copy phone code**. |
| 44 | Bring back the receiver code | 5 | Use “Bring back the PC code.” |
| 45 | Receiver code | 2 | Use “PC code” consistently. |
| 46 | Connect and send missing chunks | 5 | “Chunks” is jargon. Use **Connect and resume transfer**. |
| 47 | Paste the sender code | 4 | Use “Paste the phone code.” |
| 48 | The files stay in this browser’s local storage until you download or clear them. | 14 | “Browser’s local storage” is jargon. Use “Received files stay on this device until you download or remove them.” |
| 49 | Create receiver code | 3 | Use **Create PC code**. |
| 50 | Return this code to the phone | 6 | — |
| 51 | Copy receiver code | 3 | Use **Copy PC code**. |
| 52 | Waiting to begin. | 3 | — |
| 53 | Archive drawer | 2 | Metaphor as heading. Use “Saved receipts.” |
| 54 | Recent receipts | 2 | — |
| 55 | Stored only in this browser. | 5 | “Browser” conflicts with “device.” Use “Saved only on this device.” |
| 56 | JSON and CSV exports are always available. | 7 | Technical formats are unexplained. Use “Download each receipt as JSON or a spreadsheet-ready CSV.” |
| 57 | No receipts yet. | 3 | — |
| 58 | Complete an intake and the verified record will appear here. | 10 | Inconsistent “intake.” Use “Complete a transfer and its checked receipt will appear here.” |
| 59 | Permanent tool license | 3 | — |
| 60 | Intake Unlimited | 2 | Heading is unclear alone. Use “Unlimited transfer sizes.” |
| 61 | Remove the 25-file batch limit for ₹499 once. | 8 | “Batch” is inconsistent. Use “Pay ₹499 once to transfer more than 25 files at a time.” |
| 62 | Verification, safe-delete checks, and exports are free for everyone. | 9 | “Safe-delete” is product jargon. Use “File checks and receipt downloads stay free for everyone.” |
| 63 | Unlimited files per selected batch | 5 | Use “Unlimited files per transfer.” |
| 64 | One-time purchase, no storage subscription | 5 | Fragment. Use “Pay once. There is no storage subscription.” |
| 65 | Use the license on another device | 6 | — |
| 66 | ₹499 one time | 3 | — |
| 67 | Buy Intake Unlimited | 3 | The result is named, but “Intake” is inconsistent. Use **Buy unlimited transfers** after checkout works. |
| 68 | Have a license? | 3 | — |
| 69 | Restore it | 2 | Ambiguous control. Use **Restore license**. |
| 70 | License token | 2 | “Token” is jargon. Use “License code.” |
| 71 | Verify license | 2 | — |
| 72 | Free mode · 25 files per batch | 6 | Use “Free mode · 25 files per transfer.” |
| 73 | Checkout and refunds are handled by Sociobot/Dodo, the merchant of record. | 11 | “Merchant of record” is legal jargon. Use “Sociobot/Dodo handles payment and refunds.” |
| 74 | Local-first utility by Sociobot. | 4 | “Local-first utility” is jargon. Use “Your files stay on your devices.” |
| 75 | Hero artwork generated for this product with the factory image model. | 11 | Internal “factory image model” language. Use “Artwork made for Photo Intake Receipt.” |
| 76 | Privacy | 1 | — |
| 77 | Terms | 1 | — |
| 78 | An app update is ready. | 5 | — |
| 79 | Reload | 1 | Button does not name the result. Use **Install update**. |

No landing sentence exceeds 22 words and none contains the skill’s banned marketing words. The main issue is unexplained implementation vocabulary and inconsistent names.

### README

Commands inside code fences are excluded because they are commands, not sentences.

| # | Exact copy | Words | Flag / proposed rewrite |
| ---: | --- | ---: | --- |
| 1 | Photo Intake Receipt | 3 | — |
| 2 | Photo Intake Receipt is a local-first companion for people moving phone photos to a PC. | 15 | “Local-first companion” is jargon. Use “Photo Intake Receipt helps people move phone photos to a PC without uploading them to a photo server.” |
| 3 | It sends a deliberately selected batch over an encrypted peer-to-peer WebRTC connection, resumes at saved 64 KiB chunks, compares SHA-256 hashes, and produces an exportable receipt that says exactly what arrived and whether those selected originals are safe to delete. | 40 | **Over 22**, jargon, and promotional “deliberately/exactly.” Use three sentences: “It sends selected photos directly to a PC. Interrupted transfers resume. A checked receipt says whether those selected originals are safe to delete.” |
| 4 | Live product: https://phone-photo-intake.sociobot.in | 3 | Add the required demo URL on the next line. |
| 5 | What it does | 3 | — |
| 6 | Pairs two browsers manually without an account, cloud photo upload, STUN server, or relay. | 14 | “STUN” and “relay” are unexplained. Use “Connects the phone and PC directly, without an account or photo server.” |
| 7 | Preserves file bytes—including EXIF—without decoding or recompressing media. | 8 | “EXIF” is unexplained. Use “Keeps each file and its embedded photo details unchanged.” |
| 8 | Saves incoming chunks, completed files, manifests, and receipts to IndexedDB. | 10 | Storage jargon. Use “Saves transfer progress, received files, and receipts in the browser’s device storage.” |
| 9 | Resumes a re-paired batch by requesting only chunk indexes absent at the destination. | 13 | Dense implementation jargon. Use “After reconnecting, it sends only the missing parts of each file.” |
| 10 | Verifies both source and destination with streaming SHA-256 and issues a locally sealed receipt. | 14 | Jargon. Use “Checks the sending and receiving copies, then creates a receipt on the device.” |
| 11 | Exports every receipt as JSON or CSV; received files can be downloaded from the destination. | 15 | “Destination” is inconsistent. Use “Downloads receipts as JSON or CSV. Download received files from the PC.” |
| 12 | Works as an installable offline PWA and includes a Capacitor Android project skeleton. | 13 | “PWA” and “Capacitor” are unexplained; “project skeleton” weakens the Android product claim. Use “Install it for offline use. The repository also builds an Android app with Capacitor.” |
| 13 | Offers a useful free tier of 25 files per batch. | 10 | Marketing adjective “useful.” Use “The free tier supports 25 files per transfer.” |
| 14 | A one-time ₹499 Sociobot license unlocks unlimited batch sizes. | 9 | Banned “unlocks” and inconsistent “batch.” Use “A ₹499 one-time license removes the file limit.” |
| 15 | The safety statement is intentionally narrow: a receipt only covers the files selected in that source batch. | 17 | “Source batch” is inconsistent. Use “A receipt covers only the files selected on the sending device.” |
| 16 | It cannot prove that every photo on a phone was selected. | 11 | — |
| 17 | Run and verify | 3 | — |
| 18 | Requires Node.js 20 or newer. | 5 | — |
| 19 | The exact production build command is `npm run build`; deploy the generated `dist/` directory. | 14 | “Exact” adds no value. Use “Run `npm run build`, then deploy the generated `dist/` directory.” |
| 20 | `npm run test:e2e` builds and serves production output, then checks desktop and 390 px mobile UI, WCAG serious/critical issues, legal routes, real two-peer byte transfer, receipt generation, and offline reload. | 30 | **Over 22.** Use “`npm run test:e2e` builds and serves production output. It checks both viewports, accessibility, legal routes, transfer, receipts, and offline reload.” |
| 21 | To refresh the native shell after web changes: | 8 | “Native shell” is jargon. Use “To copy web changes into the Android app:” |
| 22 | The Android project is in `android/`. | 6 | — |
| 23 | With Android SDK API 35 and JDK 21 installed, build and test the debug APK with: | 16 | Technical terms are appropriate but should link to prerequisites. Add one setup link or sentence defining them. |
| 24 | The resulting debug artifact is `android/app/build/outputs/apk/debug/app-debug.apk`. | 6 | “Artifact” is jargon. Use “The debug app is written to …” |
| 25 | It is intentionally not committed; production signing and distribution remain a factory release step. | 14 | Internal “factory release step.” Use “The file is not committed. Release signing happens during deployment.” |
| 26 | How pairing works | 3 | “Pairing” is jargon. Use “How to connect the phone and PC.” |
| 27 | On the phone/source, select the exact files and create a sender code. | 12 | Inconsistent paired role names. Use “On the sending phone, choose the files and create a phone code.” |
| 28 | On the PC/destination, choose **Receive photos**, paste that code, and create a receiver code. | 14 | Inconsistent paired role names. Use “On the receiving PC, choose **Receive photos**, paste the phone code, and create a PC code.” |
| 29 | Return the receiver code to the source. | 7 | Use “Return the PC code to the phone.” |
| 30 | The peers establish a DTLS-encrypted WebRTC data channel on the local network. | 12 | Jargon. Use “The phone and PC then open an encrypted direct connection.” |
| 31 | The destination reports saved chunk indexes. | 6 | Jargon. Use “The receiving PC reports which file parts it already has.” |
| 32 | Only missing chunks are sent. | 5 | “Chunks” is jargon. Use “Only missing file parts are sent.” |
| 33 | The destination assembles original bytes, computes SHA-256, and returns a receipt. | 11 | Jargon/inconsistent role. Use “The receiving PC rebuilds and checks each file, then returns a receipt.” |
| 34 | Delete phone originals only if the receipt says **Safe to delete this selected batch**. | 14 | “Batch” is inconsistent. Use “Delete the selected phone originals only when the receipt says they are safe to delete.” |
| 35 | Modern Chromium-based browsers are recommended. | 5 | Vague compatibility statement. Name the minimum tested browser versions. |
| 36 | Both devices must be able to reach each other on the same local network; guest Wi-Fi client isolation can block direct pairing. | 22 | “Client isolation” and “pairing” are jargon. Use “Both devices must share a network. Some guest Wi-Fi blocks devices from connecting to each other.” |
| 37 | Privacy and billing | 3 | — |
| 38 | There are no analytics, trackers, third-party fonts, runtime CDNs, photo servers, or user accounts. | 14 | “Runtime CDNs” is jargon. Use “The app has no analytics, tracking, external fonts or scripts, photo server, or user accounts.” |
| 39 | Local data controls are documented at `/privacy/`. | 7 | — |
| 40 | Purchases use only the Sociobot billing API; Sociobot/Dodo is the merchant of record, and payment card details never enter this app. | 21 | “Billing API” and “merchant of record” are jargon. Use “Sociobot/Dodo handles purchases and card details. Card details never enter this app.” |
| 41 | The billing base can be changed for factory staging: | 9 | Internal jargon. Use “To test against the staging billing server:” |
| 42 | Project notes | 2 | — |
| 43 | Product brief: `.factory/brief.json` | 3 | — |
| 44 | Visual system and image provenance: `.factory/design.md` | 6 | “Provenance” is jargon. Use “Visual system and image source: …” |
| 45 | Build handoff: `.factory/handoff.md` | 3 | — |
| 46 | License: MIT | 2 | — |

README hard-cap failures: rows 3 and 20. No skill-banned marketing word appears other than “unlocks”; “useful,” “deliberately,” and “exactly” are unnecessary promotional adjectives/adverbs.

### Terminology table

| Concept | Terms currently used | Use consistently |
| --- | --- | --- |
| The operation | intake, transfer, moving photos | transfer |
| Selected files | batch, source batch, photos, files | selected files; “transfer” for the grouped operation |
| Sending side | phone, source, source device, sender | sending phone / phone code |
| Receiving side | PC, destination, destination device, receiver | receiving PC / PC code |
| On-device persistence | local-first, local storage, browser storage, IndexedDB | saved on this device; name IndexedDB only in developer documentation |
| File verification | hash, SHA-256, compare, verify, safe-delete check | check files; explain SHA-256 once in technical documentation |

## Structure and behavior matrix

| Check | Result | Evidence |
| --- | --- | --- |
| Root title pattern | PASS | “Photo Intake Receipt — transfer, verify, then delete,” 51 characters. |
| Per-route titles | FAIL | Privacy, Terms, demo-like, and unknown routes keep the root title. |
| One H1 and main | PASS on root/Privacy/Terms | One of each, correct semantic elements. |
| Meta description | PASS on root only | Present and 79 characters; not route-specific. |
| Canonical / OG / Twitter / Apple icon | FAIL | All absent. SVG favicon is present. |
| Designed 404 | BLOCKING FAIL | Unknown routes return the home page with HTTP 200. |
| Deep legal links | PASS | Direct `/privacy/` and `/terms/` loads work. |
| Back button | PARTIAL | Browser back returns to the prior route/scroll position, but no H1 focus or announcement occurs. |
| Dead links | FAIL | The paid checkout link returns 404; tested internal resources return 200. |
| Consistent header/footer | FAIL | Legal headers omit navigation; footer omits version/build ID. |
| Privacy/Terms links | PASS | Both are present in the footer. |
| Visual identity | PASS | Original blueprint art, drafting grid, clipped controls, serif/monospace pairing, and vermilion checks are recognisable. |
| Reduced motion | PASS by source and prior gate | A reduced-motion rule removes transforms/transitions. |
| Mobile overflow | PASS | The 390 px page rendered without horizontal overflow in visual inspection. |
| Touch target size | FAIL | Wordmark and footer legal links are below 44 px high. |

## Verification evidence

Fresh clone: `/tmp/phone-photo-intake-review.HOYwn9`, commit `2df6d8a3a6724985594239b7279712180684a5dc`.

- `npm ci`: PASS, 149 packages installed, 0 vulnerabilities.
- `npm test`: PASS, 4 files and 11 tests.
- `npm run build`: PASS; `dist/` produced. JS: 34.89 kB raw / 12.72 kB gzip.
- `npm run test:e2e`: PASS, 10 passed and 2 intentional mobile duplicates skipped, including the 20-interruption campaign.
- Claim commands: **not runnable** because `.factory/claims.json` is missing.
- Live axe at 390 × 844: PASS, zero serious/critical violations; manual focus defect remains.
- Live network interception through load, sample file selection, hashing, and offline reload: only same-origin HTTP requests; offline shell and banner loaded.
- Live console/page errors: none on fresh mobile and desktop landing loads.

Passing generic gates do not override the demo, claims, routing, checkout, and keyboard failures above.
