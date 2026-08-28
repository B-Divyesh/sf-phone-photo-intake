# Photo Intake Receipt — verification 3 handoff

**Result: FAIL**

**Candidate tested:** `dcea0e63359df93d2a8f8274b375a49dd75cbca7`

**Live URL:** `https://phone-photo-intake.sociobot.in`

**Verification date:** 2026-08-28 UTC

The candidate is functionally strong and the prior deployment-only failures are repaired. Local and live peer transfer, exact deployment identity, 20-run interrupted resume behavior, PWA offline/update behavior, Android debug assembly, response policies, privacy, axe, and performance all passed. Release approval is withheld because keyboard focus disappears on the primary file chooser.

## Release-blocking defect

`#file-input` is keyboard focusable but fully transparent. Its 3 px `:focus-visible` outline is painted on the invisible input, while the visible **Choose photos and videos** label has no `:focus-within` styling. A keyboard user loses the visible focus position at the product's primary action. This violates the explicit visible-focus requirement.

Also fix these non-blocking defects before re-verification:

- Standalone mobile wordmark/footer links are below the 44 px touch-target requirement (208 × 36, 50 × 19, and 36 × 19 px measured at a 390 px viewport).
- Invalid text in the sender-side **Receiver code** field incorrectly reports “That sender code is invalid…”. Recovery still succeeds with a valid code.

## Exact evidence

- Clean starting checkout: candidate and `origin/main` both at `dcea0e63359df93d2a8f8274b375a49dd75cbca7`.
- `npm ci`: pass; 150 packages audited, 0 vulnerabilities.
- `npm run check`: pass on the final run; 11/11 Vitest tests, TypeScript/Vite production build, and Playwright 10 passed / 2 intentional duplicate-mobile skips. The suite includes 20 forced WebRTC interruption runs.
- Independent 20-run interruption instrumentation: every transfer was stopped with 1–6 of 8 chunks persisted; every resume sent exactly the missing 2–7 chunks; minimum completed-byte reuse 100%; all 20 completed with safe receipts and zero missing/changed.
- Production bundles: JS 34.89 kB raw / 12.72 kB gzip; CSS 13.42 kB raw / 3.72 kB gzip; hero WebP 58.46 kB.
- `npx cap sync android`: pass.
- `./android/gradlew -p android test assembleDebug` with JDK 21/API 35: pass, 143 tasks. Debug APK SHA-256: `1ad1dd5a207fadbc59d5924486742e4a5ba815a2aedf0aabe52fa427071230a9`; package `in.sociobot.phonephotointake`; min SDK 23, target SDK 35; debug v1/v2 signature verified.
- Live desktop and exact 390 × 844 mobile: normal transfer, 25/26 boundary, invalid input recovery, JSON/CSV export, persistence, cancel/confirm clear, no overflow, reduced motion, offline reload, and service-worker update passed with no page/console errors.
- Axe: zero violations on live desktop, mobile, and completed receipt. Manual keyboard testing found the file-picker focus failure that axe does not detect.
- Live Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.171 s, LCP 1.396 s, CLS 0, TBT 0 ms, 78,795 bytes transferred.
- Live and local SHA-256 matched for 12 sampled deployment artifacts, including HTML/legal routes, hashed JS/CSS/hero, icons, manifest, service worker, and offline page.
- Live headers passed: CSP, HSTS, COOP, COEP, Permissions-Policy, Referrer-Policy, `nosniff`, immutable hashed assets, no-cache PWA control files, and correct manifest MIME.
- Normal live operation issued no cross-origin requests. The only source-level external runtime integration is the required Sociobot billing endpoint after a user supplies a license or chooses checkout.
- PWA controlled offline reload passed. A controlled service-worker version change displayed the update toast, reloaded, and replaced caches with `pir-v5-shell`/`pir-v5-runtime`.

Full evidence and reproduction steps are in `.factory/verification-3.md`.

## Re-run

```sh
npm ci
npm run check
npx cap sync android
JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 \
  ANDROID_HOME=/usr/lib/android-sdk \
  ANDROID_SDK_ROOT=/usr/lib/android-sdk \
  ./android/gradlew -p android test assembleDebug
```

Then repeat keyboard focus inspection at the file picker, exact 390 px touch-target measurement, live axe/Lighthouse, offline/update behavior, and live/local SHA-256 comparison.

## Remaining device-lab scope

No physical Android handset or emulator was available. Native compilation, unit tests, APK metadata/signature, and embedded web assets passed, but Android photo-picker behavior, back gesture/backgrounding, and a physical Android-to-PC Wi-Fi interruption should still be tested before distributing a signed release APK.
