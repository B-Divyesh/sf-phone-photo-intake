# Copy audit — polish round 1

Count method: whitespace-separated words. Hyphenated terms count as one. No item exceeds 22 words or uses a banned marketing word.

| Screen | Exact copy | Words | Result |
| --- | --- | ---: | --- |
| Shared | Skip to main content | 4 | Pass |
| Shared | Photo Intake Receipt | 3 | Pass |
| Header | Home | 1 | Pass |
| Header | Demo | 1 | Pass |
| Header | Transfer | 1 | Pass |
| Header | Privacy | 1 | Pass |
| Hero | Direct photo transfer · sheet 01 | 6 | Pass |
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
| Offline | Saved receipts and direct device connections still work. | 8 | Pass |
| Workbench | Working drawing · A-01 | 4 | Pass |
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
| Steps | A receipt compares each copy with SHA-256. | 7 | Pass |
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
