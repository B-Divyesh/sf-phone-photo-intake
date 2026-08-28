# Photo Intake Receipt — build handoff

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
