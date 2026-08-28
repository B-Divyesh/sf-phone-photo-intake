# Photo Intake Receipt

Photo Intake Receipt helps people move selected phone photos to a PC. It checks each received copy before deletion.

Live product: <https://phone-photo-intake.sociobot.in>

One-click demo: <https://phone-photo-intake.sociobot.in/demo>

## What it does

- Connects the sending phone directly to the receiving PC.
- Does not route the connection or photos through a public server.
- Sends only missing file parts after an interrupted transfer.
- Keeps original file bytes and embedded photo details unchanged.
- Checks each received copy and creates a receipt.
- Saves transfer progress, received files, and receipts on this device.
- Downloads receipts as JSON or CSV and downloads received files from the PC.
- Works offline after the first visit.
- Supports 25 files per free transfer. File checks and receipt downloads need no license.

A receipt covers only files selected on the sending phone. It cannot show that every phone photo was selected.

The demo uses a separate database and never reads or changes real transfer data. See [`.factory/demo.md`](.factory/demo.md).

## Run and verify

Use Node.js 20 or newer.

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

Run `npm run build`, then deploy the generated `dist/` directory. Each public product claim and its command is listed in [`.factory/claims.json`](.factory/claims.json).

## Android project

The repository includes a Capacitor Android project for this product. Copy web changes into it with:

```sh
npm run build
npx cap sync android
```

With Android SDK API 35 and JDK 21 installed, run:

```sh
(cd android && ./gradlew test assembleDebug)
```

The debug app is written to `android/app/build/outputs/apk/debug/app-debug.apk`. The file is not committed. Release signing happens during deployment.

## Connect the phone and PC

1. Open the app on both devices while they share a reachable network.
2. On the sending phone, choose files and create a phone code.
3. On the receiving PC, paste the phone code and create a PC code.
4. Return the PC code to the phone and start the transfer.
5. Delete only the selected originals named safe in the receipt.

## Privacy and availability

The app has no analytics, tracking, external fonts, external scripts, photo server, or user accounts. Local data controls are explained on the [privacy page](https://phone-photo-intake.sociobot.in/privacy/).

Larger transfer licenses are not for sale while checkout is unavailable. The app does not show a dead purchase action.

## Project notes

- Product brief: [`.factory/brief.json`](.factory/brief.json)
- Visual system and image source: [`.factory/design.md`](.factory/design.md)
- Build handoff: [`.factory/handoff.md`](.factory/handoff.md)
- License: [MIT](LICENSE)
