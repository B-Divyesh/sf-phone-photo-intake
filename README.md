# Photo Intake Receipt

Photo Intake Receipt is a local-first companion for people moving phone photos to a PC. It sends a deliberately selected batch over an encrypted peer-to-peer WebRTC connection, resumes at saved 64 KiB chunks, compares SHA-256 hashes, and produces an exportable receipt that says exactly what arrived and whether those selected originals are safe to delete.

Live product: <https://phone-photo-intake.sociobot.in>

## What it does

- Pairs two browsers manually without an account, cloud photo upload, STUN server, or relay.
- Preserves file bytes—including EXIF—without decoding or recompressing media.
- Saves incoming chunks, completed files, manifests, and receipts to IndexedDB.
- Resumes a re-paired batch by requesting only chunk indexes absent at the destination.
- Verifies both source and destination with streaming SHA-256 and issues a locally sealed receipt.
- Exports every receipt as JSON or CSV; received files can be downloaded from the destination.
- Works as an installable offline PWA and includes a Capacitor Android project skeleton.
- Offers a useful free tier of 25 files per batch. A one-time ₹499 Sociobot license unlocks unlimited batch sizes.

The safety statement is intentionally narrow: a receipt only covers the files selected in that source batch. It cannot prove that every photo on a phone was selected.

## Run and verify

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
npm test
npm run build
npm run test:e2e
```

The exact production build command is `npm run build`; deploy the generated `dist/` directory. `npm run test:e2e` builds and serves production output, then checks desktop and 390 px mobile UI, WCAG serious/critical issues, legal routes, real two-peer byte transfer, receipt generation, and offline reload.

To refresh the native shell after web changes:

```sh
npm run build
npx cap sync android
```

The Android project is in `android/`. Building an APK is intentionally deferred to the Android artifact work order, where the factory SDK and signing material are available.

## How pairing works

1. On the phone/source, select the exact files and create a sender code.
2. On the PC/destination, choose **Receive photos**, paste that code, and create a receiver code.
3. Return the receiver code to the source. The peers establish a DTLS-encrypted WebRTC data channel on the local network.
4. The destination reports saved chunk indexes. Only missing chunks are sent.
5. The destination assembles original bytes, computes SHA-256, and returns a receipt. Delete phone originals only if the receipt says **Safe to delete this selected batch**.

Modern Chromium-based browsers are recommended. Both devices must be able to reach each other on the same local network; guest Wi-Fi client isolation can block direct pairing.

## Privacy and billing

There are no analytics, trackers, third-party fonts, runtime CDNs, photo servers, or user accounts. Local data controls are documented at `/privacy/`. Purchases use only the Sociobot billing API; Sociobot/Dodo is the merchant of record, and payment card details never enter this app.

The billing base can be changed for factory staging:

```sh
VITE_BILLING_BASE=https://pilot-api.sociobot.in npm run build
```

## Project notes

- Product brief: [`.factory/brief.json`](.factory/brief.json)
- Visual system and image provenance: [`.factory/design.md`](.factory/design.md)
- Build handoff: [`.factory/handoff.md`](.factory/handoff.md)
- License: MIT
