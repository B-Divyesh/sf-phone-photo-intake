# Copy audit — polish round 2

Count method: whitespace-separated words. Hyphenated terms count as one. No item exceeds 22 words or uses a banned marketing word.

| Screen | Exact copy | Words | Result |
| --- | --- | ---: | --- |
| Shared | Skip to main content | 4 | Pass |
| Shared | Photo Intake Receipt | 3 | Pass |
| Header | Home | 1 | Pass |
| Header | Demo | 1 | Pass |
| Header | Transfer | 1 | Pass |
| Header | Privacy | 1 | Pass |
| Hero | Direct photo transfer | 3 | Pass |
| Hero | Move phone photos to your PC, then verify | 8 | Pass |
| Hero | For people who want proof their selected photos arrived before deleting the phone copies. | 14 | Pass |
| Hero | Try it with sample data | 5 | Pass |
| Hero | Opens a completed receipt. | 4 | Pass |
| Hero | Transfer my photos | 3 | Pass |
| Hero | Photos do not upload to a server. | 7 | Pass |
| Hero | Works offline after the first visit. | 7 | Pass |
| Hero | Free for 25 files per transfer. | 6 | Pass |
| Hero art | Selected → transferred → checked | 3 | Pass |
| Offline | Offline mode. | 2 | Pass |
| Offline | Saved receipts remain available to review and download. | 8 | Pass |
| Workbench | Photo transfer | 2 | Pass |
| Workbench | Transfer on both devices | 4 | Pass |
| Workbench | Open this page on the sending phone and receiving PC. | 10 | Pass |
| Workbench | Choose what this device does. | 5 | Pass |
| Workbench | Send photos | 2 | Pass |
| Workbench | Use on the phone | 4 | Pass |
| Workbench | Receive photos | 2 | Pass |
| Workbench | Use on the PC | 4 | Pass |
| Workbench | Choose the photos to transfer | 5 | Pass |
| Workbench | The receipt covers only these files. | 6 | Pass |
| Workbench | Their original bytes and photo details stay unchanged. | 8 | Pass |
| Workbench | Choose photos and videos | 4 | Pass |
| Workbench | Free transfers include up to 25 files. | 7 | Pass |
| Workbench | No files selected yet. | 4 | Pass |
| Workbench | Check files and create phone code | 6 | Pass |
| Workbench | Move the phone code to the PC | 7 | Pass |
| Workbench | Paste it into “Receive photos.” | 5 | Pass |
| Workbench | Connection codes never contain photos. | 5 | Pass |
| Workbench | Copy phone code | 3 | Pass |
| Workbench | Bring back the PC code | 6 | Pass |
| Workbench | Connect and resume transfer | 4 | Pass |
| Workbench | Paste the phone code | 4 | Pass |
| Workbench | Received files stay on this device until you download or remove them. | 12 | Pass |
| Workbench | Create PC code | 3 | Pass |
| Workbench | Return this code to the phone | 6 | Pass |
| Workbench | Copy PC code | 3 | Pass |
| Workbench | Waiting to begin. | 3 | Pass |
| Steps | How the transfer works | 4 | Pass |
| Steps | Use this page on the phone and PC. | 8 | Pass |
| Steps | Keep both devices on the same network. | 7 | Pass |
| Steps | Choose the photos. | 3 | Pass |
| Steps | Select only the phone files that should appear on the receipt. | 11 | Pass |
| Steps | Connect the devices. | 3 | Pass |
| Steps | Copy one connection code each way. | 6 | Pass |
| Steps | The browser opens an encrypted direct connection. | 7 | Pass |
| Steps | Check every file. | 3 | Pass |
| Steps | Interrupted transfers send only missing parts. | 6 | Pass |
| Steps | A receipt checks whether every byte matches. | 7 | Pass |
| Receipts | Recent receipts | 2 | Pass |
| Receipts | Saved only on this device. | 5 | Pass |
| Receipts | Download each receipt as JSON or a spreadsheet-ready CSV. | 9 | Pass |
| Receipts | No receipts yet. | 3 | Pass |
| Receipts | Complete a transfer to save its checked receipt here. | 9 | Pass |
| Limits | What it does not do | 5 | Pass |
| Limits | The app does not upload photos, choose files for you, or prove that you selected every phone photo. | 18 | Pass |
| Limits | Transfer size | 2 | Pass |
| Limits | Free transfers support up to 25 files. | 7 | Pass |
| Limits | Larger transfers are not for sale while checkout is unavailable. | 10 | Pass |
| Footer | Move selected phone photos to a PC and check every file. | 11 | Pass |
| Footer | Artwork made for Photo Intake Receipt. | 6 | Pass |
| Footer | Built by Param Factory (external) | 5 | Pass |
| Update | An app update is ready. | 5 | Pass |
| Update | Install update | 2 | Pass |

## Terminology

| Concept | One term used |
| --- | --- |
| Operation | transfer |
| Sending side | sending phone; phone code |
| Receiving side | receiving PC; PC code |
| Group of chosen items | selected files |
| Verification | check files; SHA-256 appears only in the technical explanation |
| Persistence | saved on this device; IndexedDB appears only in privacy and developer notes |

The first screen reads aloud in one breath: move selected phone photos to a PC, try the completed sample, or start a real transfer.

## README re-check

The repaired README uses the same terms as the product: **transfer**, **sending phone**, **receiving PC**, **phone code**, **PC code**, and **selected files**. Its longest visitor-facing sentence has 18 words. It has no sentence over 22 words and no banned marketing word.

| Section | Exact copy | Words | Result |
| --- | --- | ---: | --- |
| Introduction | Photo Intake Receipt helps people move selected phone photos to a PC. | 12 | Pass |
| Introduction | It checks each received copy before deletion. | 7 | Pass |
| What it does | Connects the sending phone directly to the receiving PC. | 9 | Pass; resolves `F-2-1` without WebRTC jargon |
| What it does | Uses no public connection relay or photo server. | 8 | Pass |
| What it does | Sends only missing file parts after an interrupted transfer. | 9 | Pass |
| What it does | Keeps original file bytes and embedded photo details unchanged. | 9 | Pass |
| What it does | Checks each received copy and creates a receipt. | 8 | Pass; resolves `F-2-1` without SHA-256 jargon |
| What it does | Saves transfer progress, received files, and receipts on this device. | 10 | Pass; resolves `F-2-1` without storage jargon |
| What it does | Downloads receipts as JSON or CSV and downloads received files from the PC. | 13 | Pass |
| What it does | Works offline after the first visit. | 7 | Pass |
| What it does | Supports 25 files per free transfer. | 7 | Pass |
| What it does | File checks and receipt downloads need no license. | 8 | Pass |
| Scope | A receipt covers only files selected on the sending phone. | 10 | Pass |
| Scope | It cannot show that every phone photo was selected. | 9 | Pass |
| Demo | The demo uses a separate database and never reads or changes real transfer data. | 14 | Pass |
| Setup | Use Node.js 20 or newer. | 5 | Pass; developer prerequisite |
| Setup | Run `npm run build`, then deploy the generated `dist/` directory. | 10 | Pass; developer instruction |
| Setup | Each public product claim and its command is listed in `.factory/claims.json`. | 12 | Pass; developer instruction |
| Android | The repository includes a Capacitor Android project for this product. | 10 | Pass; developer fact |
| Android | Copy web changes into it with: | 6 | Pass; developer instruction |
| Android | With Android SDK API 35 and JDK 21 installed, run: | 10 | Pass; developer instruction |
| Android | The debug app is written to `android/app/build/outputs/apk/debug/app-debug.apk`. | 9 | Pass; developer instruction |
| Android | The file is not committed. | 5 | Pass |
| Android | Release signing happens during deployment. | 5 | Pass |
| Connection | Open the app on both devices while they share a reachable network. | 12 | Pass |
| Connection | On the sending phone, choose files and create a phone code. | 11 | Pass |
| Connection | On the receiving PC, paste the phone code and create a PC code. | 13 | Pass |
| Connection | Return the PC code to the phone and start the transfer. | 11 | Pass |
| Connection | Delete only the selected originals named safe in the receipt. | 10 | Pass |
| Privacy | The app has no analytics, tracking, external fonts, external scripts, photo server, or user accounts. | 15 | Pass |
| Privacy | Local data controls are explained on the privacy page. | 9 | Pass |
| Availability | Larger transfer licenses are not for sale while checkout is unavailable. | 11 | Pass |
| Availability | The app does not show a dead purchase action. | 9 | Pass |

## Catalog re-check

The catalog sentence has 16 words and 96 characters:

> Move selected phone photos to a PC, verify each copy, and keep a receipt before deleting originals.

It starts with a verb, names the job, and stays below the 120-character limit.
