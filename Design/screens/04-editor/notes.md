# 04 Editor

The meme editor. Pick a template, add captions, style them, share.

**Maps to issue:** out of scope for sprint 2 per the lead's call. Reserved mount point `editor-root` per the interface contract.

## Design intent

Figma-like three-pane editor (layers, canvas, inspector) on desktop. Mobile collapses to a stacked layout with a bottom toolbar. Captions stay classic top and bottom by default, layers panel is the power-use escape hatch.

- Layers panel for power use, not the default mental model
- Captions are still classic top and bottom

## Mobile layout

Top to bottom:

1. Top bar: back arrow, template slug (`shrek-pondering-orb`), orange Share button
2. Canvas: meme preview (template image with current captions)
3. Caption row 1: "top → WHEN I FORGET" editable
4. Caption row 2: "bot → TO SAVE BEFORE QUIT" editable
5. STYLE row: classic, serif, type, glitch, bubble chips (single-select)
6. Bottom tab toolbar: text, style, sticker, fx, layers

## Desktop layout

Three panes plus top bar.

- Top bar: memebro logo, breadcrumb (memebro / editor / template-slug · untitled), undo, redo, orange Share button
- Left pane: LAYERS list (template, top caption, bot caption, + add layer)
- Center pane: large canvas with the meme preview
- Right pane: CAPTIONS (text inputs for each caption + text button), STYLE PRESETS (classic, type, bubble, serif, glitch, curve)

## Key interactions

- Tap a caption to edit text inline
- Pick a style preset, captions restyle
- Add or remove a layer (caption, sticker)
- Hit Share, go to export (screen 06)

## Sprint 2 note

Do not build this screen this sprint. Reserve the mount point and the navigation hooks (`memebro:template-selected` from Home / Gallery / Conjure routes to where the editor would be).
