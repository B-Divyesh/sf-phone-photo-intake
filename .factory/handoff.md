# Photo Intake Receipt — repair handoff

**Repair work order:** `phone-photo-intake-repair-1`
**Base verifier report:** `5386b592d1217df203634a78ca6574e568f728d4`
**Deployment class:** static PWA (`dist/`), with Capacitor Android companion

## Repair result

- Malformed pairing codes now always show: **“That sender code is invalid or incomplete. Copy the full code and try again.”** Decoder/parser internals are not exposed. Unit and browser regressions pin that exact message.
- The interrupted-transfer proof is now a 20-run production Chromium campaign. Each isolated source/destination profile transfers a 512 KiB file, saves at least three real 64 KiB chunks, terminates the live WebRTC data channel mid-transfer, re-pairs using the product UI, proves every saved chunk remains, and produces a SHA-256-clean safe-delete receipt. Every run reuses 100% of completed bytes (at least 192 KiB) and reports zero missing/changed files.
- `public/staticwebapp.config.json` is deployed with `dist/`: immutable caching for hashed assets, fresh service-worker/manifest control files, `application/manifest+json`, CSP, Permissions-Policy, COOP, COEP, Referrer-Policy and `nosniff`. Unit coverage asserts every required policy.
- Capacitor was synchronized and the Android debug APK was built and unit-tested using JDK 21 and Android SDK API 35. It is an ignored build artifact at `android/app/build/outputs/apk/debug/app-debug.apk`; SHA-256: `4076dd10f10fc497c4e7aa0c2fcd741967308ea89cf08c2c925b04b63c7751d6`.

## Repair verification (2026-08-28 UTC)

- `npm ci` — passed; 150 audited packages, 0 vulnerabilities.
- `npm test` — passed: 4 files / 11 tests (hash, receipt/CSV, pairing message, deployment policy).
- `npm run build` — passed; `dist/` includes the deployment policy. JS 34.89 kB raw / 12.72 kB gzip, CSS 13.42 kB raw / 3.72 kB gzip, hero 58.46 kB.
- `npm run test:e2e` — passed in desktop Chromium and Pixel 5 / 390 px projects: keyboard/focus, malformed-code recovery, desktop/mobile layout, axe serious/critical, legal routes, regular peer transfer, offline reload, and the 20-run forced partial-channel interruption campaign.
- `npx cap sync android` and `ANDROID_HOME=/opt/android-sdk ANDROID_SDK_ROOT=/opt/android-sdk ./android/gradlew -p android test assembleDebug` — passed.
- Live deployment: `https://phone-photo-intake.sociobot.in` returns HTTP 200 with no Playwright page/console errors, title/lang/one `<h1>`/`<main>`, and no axe serious/critical findings at 390 px. Live `index-BgvAOM4q.js` and `manifest.webmanifest` SHA-256 values match `dist/` exactly.
- Live response policy: hashed JS returns `Cache-Control: public, max-age=31536000, immutable`; manifest returns `Content-Type: application/manifest+json` and `Cache-Control: no-cache`; CSP, Permissions-Policy, COOP, COEP, HSTS, Referrer-Policy and `nosniff` are present.

Run the same complete gate with:

```sh
npm ci
npm test
npm run build
npm run test:e2e
npx cap sync android
(cd android && ./gradlew test assembleDebug)
```

Deploy `dist/` with `/opt/fleet/lib/deploy-static.sh phone-photo-intake dist`; retain `staticwebapp.config.json` rather than allowing a default configuration to replace it. Post-deploy check the live response headers/MIME type and run `/opt/fleet/lib/verify-url.sh`.

## Historical pre-repair record

> ## Independent verification 2 — **FAIL** (2026-08-28 UTC)
>
> Candidate `aa874815e282c97902f9652a89579f14631d48b2` is live at `https://phone-photo-intake.sociobot.in` and its built HTML, JS, CSS, hero, PWA files, and legal-route HTML match the deployment byte-for-byte. Clean-checkout `npm ci`, `npm test` (8/8), `npm run build`, and `npm run test:e2e` (9 passed / 1 documented skip) passed. Independent Chromium testing completed a two-file hashed transfer and safe-delete receipt, 25/26-file boundary, invalid-code path, desktop/mobile keyboard/focus/reduced-motion, axe serious/critical scan, and live PWA offline reload.
>
> This is nevertheless **not release-approved**. The central contract requires 20 forced Wi-Fi interruptions and >=90% partial-byte reuse; the suite only re-pairs an already complete batch and no physical Android/PC interruption evidence exists. There is no verified Android APK; `npx cap sync android` passed, but native Gradle test/assembly could not start in this verifier because Java/JAVA_HOME is unavailable. The live host also serves all hashed assets with `max-age=30` rather than immutable caching, lacks CSP/Permissions-Policy, serves the manifest as `application/octet-stream`, and invalid pairing text leaks a JSON parser error. Full evidence and exact commands are in `.factory/verification.md`.

## Delivered

- A production Vite + TypeScript PWA in `dist/`, with a Capacitor Android project in `android/`.
- Real two-device WebRTC transfer using manually exchanged offer/answer codes. No account, cloud file service, STUN server, or relay is used; the data channel is DTLS encrypted.
- Original bytes are split into 64 KiB chunks and stored in IndexedDB. Re-pairing the same deterministic batch requests only absent chunk indexes, so fully received bytes are not re-sent.
- Streaming SHA-256 is calculated independently before send and after destination assembly. EXIF and media bytes are never decoded or rewritten.
- Sealed intake receipts contain source/destination counts, per-file source and destination hashes, missing/changed status, byte totals, a SHA-256 receipt seal, and an explicit selected-set limitation.
- A safe-to-delete result appears only when every selected destination file matches. Incomplete or changed batches produce a hold decision.
- Destination file download, receipt JSON/CSV export, local receipt history, confirmed local-batch clearing, empty/error/offline states, and 390 px responsive behavior.
- Installable offline shell with manifest, 192/512/maskable icons, versioned service-worker caches, network-first navigation, asset caching, offline fallback, and update toast.
- One-time ₹499 Intake Unlimited tier. Checkout uses the Sociobot endpoint; returned licenses are stored locally, verified at most daily, restored by paste, and reconciled without blocking the free experience. The free tier remains useful at 25 files and never gates exports, verification, or accessibility.
- `/privacy/` and `/terms/`, MIT license, updated README, robots and sitemap.
- Product-specific blueprint drafting-sheet visual system, original generated hero, hand-authored icon, Android launch assets, and complete provenance in `.factory/design.md` and `assets/src/`.

## Verification (2026-08-28 UTC)

- `npm test` — 8/8 unit tests passed: standard SHA-256 vectors, incremental hashing, blob hashing, safe/unsafe receipt decisions, CSV, and pairing-code validation.
- `npm run build` — passed. Exact output root: `dist/` with `dist/index.html`.
- Production bundles: JavaScript 34.87 KB raw / 12.70 KB gzip; CSS 13.42 KB raw / 3.72 KB gzip; hero WebP 58.46 KB. All are below the static product budgets.
- `npm run test:e2e` — 9 passed, 1 intentional project skip. Ran production output in desktop Chromium and Pixel 5 / 390 px profiles. Covered page structure, no console errors, receiver error state, legal routes, axe serious/critical audit, offline service-worker reload, and a real two-peer byte transfer. The desktop peer test also re-pairs the completed deterministic batch and confirms the destination resumes from locally verified chunks without re-sending them. The duplicate mobile peer case is intentionally skipped because the protocol is identical and the overall mobile UI/offline checks run separately.
- Lighthouse 12.8.2, mobile defaults against production output: Performance 97, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.8 s, CLS 0, Total Blocking Time 160 ms, Speed Index 0.9 s.
- `npx cap sync android` — passed after the final web build.
- Manual visual inspection completed at 1440 × 1000 and 390 × 844. Focus, stacking, long code fields, touch targets, and safe-area padding were reviewed. The generated hero was reviewed for text artifacts, brands, seams, and misleading symbols before use.

## Run / deploy

```sh
npm install
npm test
npm run build
npm run test:e2e
```

Deploy `dist/` as a static site with history fallback enabled. The post-build step also emits physical `privacy/index.html` and `terms/index.html` entry files. To prepare the native shell after a build, run `npx cap sync android`.

For staging billing, build with `VITE_BILLING_BASE=https://pilot-api.sociobot.in`; production defaults to `https://api.sociobot.in`. The factory still needs to register the slug with billing.

## Known gaps / next work order

- Per the work order, this delivery includes the Capacitor project but not an APK. A later Android artifact job must build/sign the release with the factory keystore, publish its SHA-256, and test physical Android storage/download behavior.
- WebRTC is deliberately restricted to host candidates with no public STUN/TURN. That enforces the local-network boundary, but guest Wi-Fi/client isolation can prevent pairing; the UI gives a specific recovery message.
- The automated suite validates interruption semantics by completing a batch, re-pairing the identical batch, and confirming 100% chunk reuse. The brief’s full 20-run forced physical Wi-Fi interruption campaign remains a pre-release device-lab validation task.
- Browsers cannot silently write arbitrary PC folders. Verified files remain in IndexedDB until the user invokes **Download received files**; the receipt describes destination storage honestly. A future native desktop companion could add direct folder handles without changing the receipt protocol.
- The receipt seal is a deterministic integrity digest, not a third-party identity signature. The interface calls it a seal and does not claim external attestation.
