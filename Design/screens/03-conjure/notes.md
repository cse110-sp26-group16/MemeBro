# 03 Conjure

AI generation panel. Describe the meme, pick a style and layout, generate four variations.

**Maps to issue:** #25 (frontend Conjure modal)

## Design intent

Full panel with style and layout as first-class taxonomy, not buried options. History sidebar (desktop) of past conjures so prompts are reusable.

- Style and layout are first-class choices, the user picks both
- Previous prompts are reusable, surface them as chips

## Mobile layout

Modal that slides up over the current screen, takes most of the viewport.

Top to bottom:

1. Header: sparkle icon, "Conjure a template" title, close X
2. "DESCRIBE THE MEME" label
3. Textarea with placeholder (e.g. "a tiny rat in a chef hat looking dramatically at the camera")
4. Reusable prompt chip row: "shrek pondering an orb", "rat lawyer on zoom", "tiny astronaut confused", "drake but with 3 rows", "cat melting into chair"
5. Two-column block: REFERENCE IMAGE (OPTIONAL) drop zone on left, LAYOUT chips on right (1-panel, 2-panel, 3-panel, 4-panel)
6. STYLE row: visual swatches (Photo, Cartoon, 3D render, Retro, Painted, Screenshot)
7. Footer: "1 CREDIT WILL BE USED · 4 / 5 REMAINING" text, Cancel button, orange "Conjure 4 variations" button

## Desktop layout

Larger modal centered on the page, three-column structure.

- Left column (within modal): HISTORY label, list of past conjures with thumbnails (shrek pondering, cat lawyer, tiny astronaut)
- Center column: describe field, reference image drop zone, layout chips, style swatches as in mobile
- Right column (when result loaded): PREVIEW pane with one large result (A) and three thumbnail results (B, C, D), edit selected and regenerate buttons
- Background of the page dims behind the modal

## Key interactions

- Type or pick a chip to fill the description
- Drop or click to add reference image (optional)
- Pick style (single-select), pick layout (single-select)
- Hit Conjure, kick off generation, show four results
- Pick a result, hit Edit selected, go to editor (screen 04) with the conjured template loaded
- Hit Regenerate, spend another credit, get four new options

## Backend dependency

This screen depends on the AI generation backend, which is BLOCKED on ADR-0003 (PR #34). The UI can be scaffolded with a stub `conjureMeme()` (returns a fake `Meme` after a delay) until the real backend lands.
