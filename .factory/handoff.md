# Photo Intake Receipt — adversarial review 1 handoff

**Work order:** `phone-photo-intake-review-1`

**Result:** **FAIL**

**Candidate:** `2df6d8a3a6724985594239b7279712180684a5dc`
**Reviewed:** 2026-08-28 UTC

## What was done

Created `.factory/review-1.md` with the required cold mobile/desktop read, complete landing and README copy inventory with word counts and rewrites, demo/storage-isolation exercise, claims cross-check, routing/metadata/link review, accessibility checks, and severity-ordered verdict.

No product code was changed.

## Verdict and blocking findings

The review result is **FAIL**:

1. No one-click sample-data demo exists. `/demo` and `?demo=1` render the empty production app, lack the demo banner/reset/start-real controls, and read normal license and receipt storage.
2. `.factory/claims.json` and all `@claim:*` tests are missing while the landing page and README make many observable claims.
3. Unknown paths return HTTP 200 with the home screen instead of a designed 404.
4. **Buy Intake Unlimited** targets a Sociobot checkout URL that returns HTTP 404.
5. Keyboard focus on the primary file chooser is invisible because the focused input has `opacity: 0` and its visible label has no `:focus-within` treatment.

The review also records incomplete route metadata/shared structure, sub-44 px mobile link targets, dense/inconsistent terminology, two README sentences over 22 words, and an error that calls an invalid receiver code a sender code.

## How it was verified

From a clean clone at the exact candidate commit:

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

Results: install passed with 0 vulnerabilities; Vitest passed 11/11; production build produced `dist/`; Playwright passed 10 tests with 2 intentional duplicate-mobile skips, including the 20-interruption resume campaign.

Live verification used fresh Chromium contexts at 390 × 844 and 1440 × 900. It included screenshots/visual inspection, console capture, same-origin request capture, offline reload, live axe, direct demo URL/storage sentinel checks, internal-link crawling, checkout GET/HEAD checks, unknown deep links, route metadata, back/focus behavior, mobile target measurement, and the receiver-code error path.

## What passed

- The first screen communicates the transfer/check/delete job and exposes a visible first action, although the audience is inferred rather than directly named.
- The blueprint visual identity is specific, coherent, and faithful to `.factory/design.md`.
- Fresh mobile and desktop loads had no console errors.
- Live axe reported no serious/critical violations.
- Same-origin file loading and hashing plus offline shell reload worked.
- Root, Privacy, Terms, manifest, icons, robots, and sitemap URLs returned 200.
- Unit, build, and existing E2E gates passed.

## Required next verification

After repair, rerun the full clean-clone gates and specifically verify:

- one-click seeded `/demo`, isolated `demo:` storage, Reset, and Start for real;
- every `.factory/claims.json` command and exact `@claim:<id>` mapping;
- enabled Sociobot checkout;
- designed unknown-route behavior and route-specific metadata;
- keyboard focus on the visible file-picker surface and 44 px mobile links;
- all copy-audit rewrites and consistent phone/PC/transfer terminology.

Full evidence and concrete fixes are in `.factory/review-1.md`.
