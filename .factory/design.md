# Photo Intake Receipt — visual system

## Direction: blueprint drafting sheet

This product is a reliability instrument, not a gallery. Its interface borrows from an engineer's checked drawing: warm drafting paper, cyan construction lines, navy ink, registration marks, and vermilion review stamps. The metaphor fits the job because every transferred file is a measured item and every deletion decision needs evidence. Decoration is limited to explanatory marks: file paths, hash fragments, connection lines, and verification stamps.

The treatment is deliberately single-mode. A pale drafting surface is painted explicitly in every route and in the install splash; the sheet metaphor would become less legible if inverted. Browser color-scheme remains `light`.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| paper | `#F4F0E6` | page background |
| paper-raised | `#FFFDF7` | active sheets and forms |
| grid | `#B9D4D8` | blueprint grid and dividers |
| ink | `#102D3A` | primary text (12.6:1 on paper) |
| ink-muted | `#49636C` | secondary text (5.6:1 on paper) |
| blueprint | `#075F73` | links, focus and active state (6.5:1) |
| blueprint-deep | `#034657` | pressed controls |
| chalk | `#F9FCF8` | text on blueprint controls |
| safe | `#14613D` | verified/safe status |
| caution | `#8B4B08` | incomplete/resume status |
| danger | `#9A2E2E` | mismatch/error status |
| stamp | `#B23A2A` | receipt seal and sparse emphasis |

Status always includes a label or icon, never color alone. Fine grid lines are decorative and never carry meaning.

## Type

- Headings and large counters: `Georgia`, `Cambria`, serif. The modest slab-like forms feel archival and give receipts authority.
- Interface, metadata, and body: `ui-monospace`, `SFMono-Regular`, `Consolas`, monospace. It aligns counts, hashes, and filenames without a font download.
- Scale: 12 / 14 / 16 / 20 / 28 / clamp(40–68) px. Body is 16 px minimum; line-height 1.55; reading measure 68 characters.

No external or bundled font files are required, keeping first load small and private.

## Spacing and shape

- Base unit: 4 px. Primary rhythm: 8, 12, 16, 24, 32, 48, 64 px.
- Main content: 1180 px maximum with 20 px mobile gutters; dense working screens become one column below 760 px.
- Corners are clipped rather than pill-shaped: 2–6 px radii, 1 px blueprint rules, occasional doubled borders on official receipts.
- Controls are at least 44 × 44 px with 8 px between adjacent targets.
- Registration crosses, measured ticks, dashed trim lines, and a hand-authored file-flow glyph form the icon language.

## Interaction grammar

The home screen presents one decision immediately: send photos or receive them. Each mode unfolds as a numbered drafting procedure—select, pair, transfer, receipt—with a persistent status strip. Selection adds measured rows; verification applies a restrained angled `VERIFIED` stamp. Destructive "clear local copies" actions name the exact batch and require confirmation.

Pairing uses copy/paste connection codes. This is less magical than an account service, but transparent, works without a cloud relay, and makes the local-only privacy boundary visible. Instructions explicitly identify which code goes to which device.

## Motion

- 180 ms opacity/translate reveal for newly completed steps.
- 240 ms progress fill for received chunks.
- The verified stamp settles once with a small 3-degree rotation; nothing loops.
- Under `prefers-reduced-motion: reduce`, transforms and smooth scrolling are removed and updates are instant. Progress remains understandable through text and native progress semantics.

## Responsive intent

At 390 px, the wide receipt table becomes stacked file records, action bars wrap, and secondary explanatory copy shortens or moves below the working controls. No feature is removed. Safe-area padding protects installed Android navigation and display cutouts.

## Asset plan and provenance

- `src/assets/hero-blueprint.webp`: original generated editorial still life showing a phone-to-laptop photo intake as a physical blueprint with checked file cards. It explains the transfer/verification relationship rather than acting as filler. Generated with the factory Azure image model (`factory-image`) on 2026-08-28, then reviewed and converted locally to WebP at ≤300 KB.
- `public/icons/icon.svg`: hand-authored product mark—phone, incoming sheet, and check register—created in this repository, MIT licensed with the product.
- PWA PNG icons are rendered locally from that SVG; no stock or third-party imagery.

### Image prompt sheet

Use case: `stylized-concept`
Asset type: responsive landing-page hero illustration
Primary request: an overhead editorial still life of a phone transferring a small set of photo contact sheets into a desktop computer intake tray, with every sheet connected to a precise verification tick and one restrained approval stamp
Scene/backdrop: warm ivory architectural drafting paper with faint cyan grid, crop marks, measurement ticks, and clean negative space
Subject: one generic unbranded smartphone, one compact desktop monitor, five abstract photo sheets, a clear directional transfer path, small check marks
Style/medium: tactile cut-paper and technical gouache illustration, precise blueprint geometry, subtle paper fibers, not photorealistic UI
Composition/framing: landscape 3:2, top-down, main objects centered-right with calm negative space, strong readable silhouette at mobile crop
Lighting/mood: soft desk light, calm, methodical, trustworthy
Color palette: ivory paper, deep navy ink, faded cyan construction lines, restrained vermilion stamp, muted green verification marks
Materials/textures: toothy drafting paper, graphite edges, screenprinted ink, tiny registration imperfections
Constraints: no legible text, no people, no brands, no logos, no watermark; do not imply cloud storage; avoid generic gradient, neon, glassmorphism, and glossy 3D

