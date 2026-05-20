# Design Screens

The six screens from the Library Grid hi-fi design, cropped into mobile-first and desktop pieces, plus the wireframe sketches that capture the design rationale.

## Mobile-first norm

The build is mobile-first per AGENTS.md. Read the mobile crop and the mobile half of the wireframe before the desktop versions. The mobile design is the baseline at 375px, desktop is the scaled-up version at the breakpoint.

## Folder structure

```
Design/screens/
├── README.md (this file)
├── 01-library-home/
│   ├── notes.md                 design intent, layout, key interactions
│   ├── 1-mobile.png             hi-fi mobile, the baseline
│   ├── 2-desktop.png            hi-fi desktop, the scaled-up
│   ├── 3-mobile-wireframe.png   wireframe with design rationale column
│   └── 4-desktop-wireframe.png  wireframe desktop sketch
├── 02-search/
├── 03-conjure/
├── 04-editor/
├── 05-my-memes/
└── 06-export/
```

File numbers force sort order: mobile first, then desktop, hi-fi before wireframe.

## Mapping screen to lane issue

| Screen | Issue | Owner |
| --- | --- | --- |
| 01 Library Home | #24 | Harvey |
| 02 Search | #22 | Tim |
| 03 Conjure | #25 | Jennifer |
| 04 Editor | out of sprint 2 | reserved |
| 05 My Memes | out of sprint 2 | reserved |
| 06 Export | out of sprint 2 | reserved |

The three sprint-2 screens (#22, #24, #25) implement against the mobile crop first, then add the desktop layout at the breakpoint.

## How to use these files

When building a screen:

1. Read `notes.md` for the design intent and layout structure
2. Open `1-mobile.png` next to your editor, build to match at 375px
3. Use `styles/tokens.css` for every color, spacing, type value
4. Follow the data shapes and events from `docs/interface-contract.md`
5. Add the desktop layout (`2-desktop.png`) once mobile works, gated by `@media (min-width: ...)` queries

When reviewing a PR:

1. Compare the rendered screen to `1-mobile.png` at 375px width in DevTools
2. Compare at desktop width to `2-desktop.png`
3. Flag any visual drift in the PR review

## Editor and Export

Screens 04 and 06 are out of scope for sprint 2 but their `notes.md` and crops are here so the interface contract can reserve their mount points (`editor-root`, `export-root`) without surprises later.

## Source

The Library Grid hi-fi design bundle (React + Babel-in-browser standalone). The bundle lives in the lead's machine at `~/Desktop/memebro-design/` and is not committed to the repo (it is React, our stack is vanilla). These cropped PNGs are the canonical visual ground truth for the build.
