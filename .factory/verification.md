# Independent verification — FAIL

**Candidate:** `aa874815e282c97902f9652a89579f14631d48b2`  
**Live URL:** `https://phone-photo-intake.sociobot.in`  
**Verified:** 2026-08-28 UTC

## Verdict

**FAIL — do not release as a verified Android reliability appliance yet.** The web/PWA implementation and the live deployment are functional and byte-identical to the candidate, but the acceptance contract's core interrupted-transfer proof and Android artifact validation are not satisfied.

## Evidence collected

### Clean local checkout and production gate

- The checkout was clean and `HEAD` was exactly `aa874815e282c97902f9652a89579f14631d48b2` before verification.
- `npm ci` completed successfully (150 packages audited; 0 vulnerabilities).
- `npm test` passed: 3 files / 8 tests (hashing, receipt safety/CSV, pairing-code validation).
- `npm run build` passed, including `tsc --noEmit`; `dist/` was produced. Production assets: JS 34.87 kB raw / 12.70 kB gzip, CSS 13.42 kB raw / 3.72 kB gzip, hero WebP 58.46 kB. All are within the stated static budgets.
- `npm run test:e2e` passed: 9 tests passed and the one explicitly documented duplicate-mobile peer case was skipped. It covers one real Chromium peer transfer, offline shell reload, legal routes, and axe.

### Independent browser/product exercise

- Local production preview and the live site each had one `<h1>`, one `<main>`, correct title, no page/console errors, and no serious or critical axe findings.
- Normal two-peer transfer exercised independently: a 262,144-byte JPEG and a 524,288-byte MP4 transferred unchanged; the receipt reported source 2, destination 2, 786.4 kB checked, 0 missing/changed, per-file SHA-256 values, and **Safe to delete this selected batch**.
- Boundary selection: exactly 25 files enabled preparation; 26 files disabled it and displayed the limit explanation.
- Invalid sender-code path displayed an error and role switching permitted recovery to normal transfer.
- At 390 × 844 the page had no horizontal overflow, 16 px body text, and reduced-motion transition duration was effectively zero. Keyboard focus reached a link with a visible `rgb(178, 58, 42) solid 3px` outline.
- PWA: after online first load and service-worker control, an offline reload of the live URL rendered the app shell and visible offline status with no console errors.
- Observed normal-load requests stayed on `phone-photo-intake.sociobot.in`; source inspection confirms the only intentional external endpoint is Sociobot license verification/checkout, only after a license is supplied. WebRTC has `iceServers: []`, avoiding public STUN/TURN and relay traffic.

### Deployment identity and response policies

- Live `index.html`, JS, CSS, hero WebP, `sw.js`, manifest, offline page, and legal-route HTML SHA-256 values all exactly match the locally built `dist/` artifacts. The deployment-only failure was not reproduced.
- Live response headers include HSTS, `X-Content-Type-Options: nosniff`, and Referrer-Policy. The live manifest is served as `application/octet-stream`.
- A Lighthouse CLI attempt could not run because this container only exposes Playwright's headless-shell, which Lighthouse rejected as a Chrome executable. This is an environment limitation, not a product pass result.
- `npx cap sync android` passed. `android/gradlew test assembleDebug` could not start because the verifier image has neither `java` nor `JAVA_HOME`; no APK or physical Android verification was produced.

## Release-blocking defects

### High — central interruption/resume claim is unproven

The researched success measure requires 20 forced Wi-Fi interruptions with complete receipt accuracy and at least 90% completed-byte reuse. The automated test only re-pairs an already completed deterministic batch (there are zero missing chunks); it does not interrupt an in-progress transfer or run the 20-transfer campaign. There is no physical Android/PC network result or APK result. This is the defining reliability claim, so it cannot be accepted from the current evidence.

### High — Android artifact is not validated or deliverable in this verification

The product contract calls for an Android companion. The repository has a Capacitor project but no built debug/release APK or artifact SHA-256, and the native test/build could not start in the supplied environment because Java is absent. A JDK/Android-SDK-capable job must build an APK and test actual Android storage, backgrounding, LAN pairing, and interruption recovery before release.

## Non-blocking but required follow-ups

### Medium — invalid pairing input leaks a parser exception

Entering `invalid` as a sender code renders `Unexpected token '…' is not valid JSON` in the status region. Replace this with a stable, actionable message such as “That sender code is invalid or incomplete. Copy the full code and try again.”

### Medium — deployment cache/security policy misses the stated static-PWA policy

The live hashed JS/CSS/hero assets, service worker, and manifest all use `Cache-Control: public, must-revalidate, max-age=30`, rather than long-lived immutable caching for content-hashed assets. There is also no Content-Security-Policy, Permissions-Policy, or cross-origin isolation policy header. Serve the manifest with `application/manifest+json` and configure the static host accordingly.

## Required next verification

1. Build the debug APK in a JDK/Android-SDK worker, retain its SHA-256, and perform a real Android-to-PC transfer.
2. Run and retain a 20-run forced Wi-Fi interruption test using partial transfers; prove all receipts flag every missing/changed file and measure resumed bytes (>=90% reuse).
3. Correct the invalid-code message and deploy immutable hashed-asset cache/security headers; rerun this verification against the resulting commit and URL.
