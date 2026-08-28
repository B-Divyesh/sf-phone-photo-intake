# Independent product verification 3 — **FAIL**

**Work order:** `phone-photo-intake-verify-3`

**Candidate tested:** `dcea0e63359df93d2a8f8274b375a49dd75cbca7`

**Live URL tested:** `https://phone-photo-intake.sociobot.in`

**Verified:** 2026-08-28 UTC

**Final result:** **FAIL — do not release as fully conformant until the keyboard focus defect is fixed and reverified.**

## Acceptance summary

| Area | Result | Evidence |
| --- | --- | --- |
| Clean install, unit tests, type check, production build | PASS | Clean candidate checkout; `npm ci` audited 150 packages with 0 vulnerabilities; `npm run check` passed after clearing a verifier-owned preview process. Vitest: 4 files / 11 tests. `tsc --noEmit` and Vite production build passed. |
| Core sender/receiver job | PASS | Independent local and live Chromium runs transferred a selected file containing special filename characters, independently hashed it on both peers, produced safe receipts with 0 missing/changed files, exported valid JSON/CSV, retained the receipt after reload, and honored cancel/confirm clearing. |
| Interrupted transfer success measure | PASS | Repository campaign passed 20 forced channel interruptions. A separate instrumented 20-run campaign used 512 KiB files (8 × 64 KiB chunks), interrupted every run with 1–6 chunks persisted, counted binary sends after re-pairing, sent exactly `8 - retained` chunks every time, reused 100% of completed bytes (requirement: >=90%), and reached a safe receipt in every run. |
| Boundary/error/recovery | PASS with minor copy defect | 25 files enabled preparation; 26 disabled it and exposed a `role=alert`. Invalid sender codes were handled without console errors. A valid receiver code worked after an invalid receiver-code attempt. The latter error incorrectly says “sender code”; see defects. |
| PWA/offline/update | PASS | Manifest fields/icons were valid; online load gained service-worker control; live offline reload showed the shell and offline status. A controlled `pir-v4` → `pir-v5` service-worker replacement displayed “An app update is ready,” reloaded, and left `pir-v5-shell`/`pir-v5-runtime` caches. |
| Android build | PASS (runtime device test not available) | `npx cap sync android` passed. With JDK 21 and Android SDK API 35 provisioned, `./android/gradlew -p android test assembleDebug` passed all 143 tasks. APK metadata: package `in.sociobot.phonephotointake`, min SDK 23, target/compile SDK 35; debug v1/v2 signature verified. |
| Privacy/network policy | PASS | A complete normal live flow made no cross-origin HTTP requests. Source review found no analytics, trackers, external fonts/scripts, STUN, or TURN. A synthetic returned license was stripped from the address bar, stored locally, and caused only the expected Sociobot verification request. |
| Live deployment identity | PASS | Twelve representative deploy artifacts, including HTML/legal routes, JS, CSS, hero, icons, manifest, service worker, and offline page, matched local `dist/` byte-for-byte by SHA-256. |
| Browser security/cache policy | PASS | Live CSP, HSTS, COOP, COEP, Permissions-Policy, Referrer-Policy, and `nosniff` were present. Hashed JS was `max-age=31536000, immutable`; manifest and service worker were `no-cache`; manifest MIME was `application/manifest+json`. |
| Accessibility and keyboard | **FAIL** | Axe found no violations on live desktop, exact 390 px mobile, or the completed receipt. Semantics, skip link, reduced motion, and general focus ring passed. The keyboard-focused file input is fully transparent and its visible label has no focus styling, so focus disappears at the primary intake action. |
| Performance/budgets | PASS | JS 34.89 kB raw / 12.72 kB gzip; CSS 13.42 kB raw / 3.72 kB gzip; hero 58.46 kB. Live mobile Lighthouse 12.8.2: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.171 s, LCP 1.396 s, CLS 0, TBT 0 ms, transfer 78,795 bytes. Lab INP was unavailable because no interaction occurred. |

## Local gate evidence

Environment: Node `v22.23.2`, npm `10.9.8`, OpenJDK `21.0.12`, Android command-line tools `13.0`, API 35.

- Initial checkout was clean on `main`, with `HEAD` and `origin/main` both exactly `dcea0e63359df93d2a8f8274b375a49dd75cbca7`.
- `npm ci`: pass; 149 packages installed, 150 audited, 0 vulnerabilities.
- `npm test`: pass; 11/11 tests across hashing, receipts/CSV, pairing validation, and deploy policy.
- `npm run build`: pass; includes `tsc --noEmit`; output root `dist/`.
- `npm run test:e2e`: pass; 10 passed, 2 intentional duplicate-mobile skips. Desktop peer transfer and the 20-run interruption campaign ran; desktop and mobile both covered the basic workbench, legal routes, axe, and offline reload.
- `npm run check`: pass on the final run; it repeated unit tests, exact production build, and E2E as one declared repository gate. An earlier invocation stopped only because the verifier's own preview server occupied port 4173; it passed after that server was stopped.
- `npx cap sync android`: pass.
- `JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 ANDROID_HOME=/usr/lib/android-sdk ANDROID_SDK_ROOT=/usr/lib/android-sdk ./android/gradlew -p android test assembleDebug`: pass; 143 actionable tasks executed.
- Debug APK: 4.2 MB at `android/app/build/outputs/apk/debug/app-debug.apk`; SHA-256 `1ad1dd5a207fadbc59d5924486742e4a5ba815a2aedf0aabe52fa427071230a9`. It is debug-signed (v1/v2), not a production release artifact. The embedded HTML, manifest, service worker, and production JS matched `dist/` by SHA-256.

There is no separate lint script. Type checking is part of `npm run build`.

## Functional and resilience evidence

The independent browser flow was performed against both the local production preview and the live URL:

- Empty state identified that no files were selected and the prepare action was disabled.
- Exactly 25 files were accepted; 26 files disabled the action and announced the corrective message.
- A file named `IMG_<script>_é.jpg` transferred without markup injection or filename corruption.
- Sender and receiver both showed **Safe to delete this selected batch**, source/destination counts of 1/1, 0 missing/changed, a source hash fragment, and a 64-character receipt seal.
- JSON and CSV downloads had the expected filenames; parsed JSON had `safeToDelete: true` and a 64-character seal.
- Receipt history survived reload. Canceling **Clear local copies** retained one stored file; accepting the specific confirmation reduced stored files to zero while preserving the receipt.
- The invalid receiver-code attempt did not poison the session: replacing it with the valid code completed the same transfer.
- The independently instrumented interruption campaign performed 20 valid partial transfers. Each had 1–6 of 8 chunks saved at disconnection; after re-pairing, the sender emitted exactly the remaining 2–7 binary chunks, never a completed chunk. Minimum completed-byte reuse was 100%; all 20 receipts were safe with no missing/changed file.

## Live deployment evidence

Selected SHA-256 comparisons:

| Artifact | SHA-256 | Result |
| --- | --- | --- |
| `/` (`dist/index.html`) | `31aa5fcc61ab7b168e03e797f6aa56c0a0cf0c193a884bdb182087a5476908f4` | MATCH |
| `/assets/index-BgvAOM4q.js` | `94ebe530f65c30420fc343ff83bb8c282fb36643123f566d5e1cbfafdf7100ba` | MATCH |
| `/assets/style-BEYlrhix.css` | `5b2797941cccb9a6d0c4ebd363fb2b276d09798933e8830450c746a166a9045b` | MATCH |
| `/assets/hero-blueprint-Cbwq7quq.webp` | `ac0b3ee3b1d07a7d743d4cd495e49b87e08829fac8b991103159a7091c9f4951` | MATCH |
| `/manifest.webmanifest` | `4fa28b7edeea2cb40d473e600a3621d6a7956862338443adafb5e5b10b070809` | MATCH |
| `/sw.js` | `81512380c01307c024bac063f03d26e6fdd871727ee89304eaa9269e39523109` | MATCH |

The same comparison also passed for `/privacy/`, `/terms/`, `/offline.html`, SVG icon, 192 px icon, and 512 px icon. The deployment-only MIME/cache/policy failure from the earlier report is fixed and was not reproduced.

`verify-url.sh` returned HTTP 200, 808 ms network-idle load, correct title/lang/one H1/main, no missing image alt attributes, and no console/page errors. Its simple `innerText` heuristic reported one unlabeled button because **Verify license** is inside a closed `<details>`; the button has literal text and both axe runs report no name violation.

## Accessibility, responsive, and visual evidence

- Desktop 1440 × 1000 and exact mobile 390 × 844 were visually inspected. The product-specific drafting-sheet system rendered coherently; mobile width and document scroll width were both 390 px.
- Body type was 16 px. `<title>`, `lang=en`, one `<h1>`, one `<main>`, image alt text, labels, status/live regions, and legal pages were present.
- Live axe scans reported zero violations at both viewport sizes; a second scan of the populated receipt also reported zero violations.
- First Tab focused the skip link, made it visible at top 8 px with a 3 px vermilion outline, and Enter moved to `#main`.
- With reduced motion, primary-control transition duration computed to `0.01ms` and the hero transform computed to `none`.

## Privacy and browser policy evidence

- No third-party request occurred during the complete initial, boundary, pairing, transfer, receipt, export, persistence, clear, mobile, or offline flow on the live origin.
- No analytics/tracker calls or third-party fonts/scripts exist in source. Photos, chunks, manifests, completed blobs, and receipts are stored in IndexedDB. WebRTC is created with `iceServers: []`; transport is the browser's DTLS data channel.
- A synthetic invalid returned license was saved under `sb_license:phone-photo-intake`, removed from the browser URL, and checked only at `https://api.sociobot.in/api/v1/products/phone-photo-intake/verify?...`. The checkout link targets the required Sociobot endpoint. No payment provider is embedded.
- Live navigation uses `Cache-Control: public, must-revalidate, max-age=30`; hashed assets use one-year immutable caching. PWA control files use `no-cache`.

## Defects by severity

### Major — keyboard focus becomes invisible on the primary file chooser

Reproduction on local and live desktop Chromium:

1. Load `/` and press Tab through the header, start link, and role controls.
2. The ninth focus stop is `#file-input` inside **Choose photos and videos**.
3. The active input computes to `opacity: 0`, approximately 26 × 46 CSS px. Its own 3 px outline is therefore invisible; the enclosing `.file-pick` label computes to no outline and has no `:focus-within` style.

The chooser remains keyboard-operable, but the user cannot see current focus on the central product action. This violates the explicit visible-focus acceptance requirement and makes the overall result **FAIL**. Apply the focus indication to the visible label/container (for example with `.file-pick:focus-within`) and add a regression that tabs to the actual file input and asserts a visible container focus style.

### Moderate — standalone mobile link targets are shorter than 44 CSS px

At 390 px, the wordmark link measured 208 × 36 px and footer legal links measured 50 × 19 px and 36 × 19 px. The hidden file input's small box is not counted separately because its 358 × 84 px label is the pointer target. Increase padding/min-height on the standalone wordmark/footer links to satisfy the product's 44 px touch-target contract.

### Minor — receiver-code error names the wrong code

After a sender code is created, entering `broken-answer` in **Receiver code** displays: “That sender code is invalid or incomplete. Copy the full code and try again.” Recovery works once a valid receiver code is supplied, but the message names and instructs the wrong side of the exchange.

## Limitations

- No physical Android handset or emulator was available. The native project, tests, APK assembly/signature/metadata, embedded production assets, exact 390 px browser UI, and browser-based peer behavior were verified; Android chooser behavior, backgrounding, back gesture, and a physical Android-to-PC LAN interruption remain device-lab checks.
- Lighthouse lab runs do not emit an INP metric without user interactions. TBT was 0 ms; no field data was available.

## Required re-verification

1. Add an obvious focus indicator to the visible file-picker surface and a keyboard regression test.
2. Increase the standalone mobile wordmark/footer link hit areas to 44 px.
3. Make receiver-code validation text identify the receiver code.
4. Rerun keyboard, exact 390 px, axe, full transfer/resume, `npm run check`, and live artifact identity checks on the repaired commit.
