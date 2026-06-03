# ADR-0012: Export edited memes by rasterizing the DOM with html2canvas

- **Status:** Accepted
- **Date:** 2026-06-03
- **Deciders:** Yuval (lead) + editor lane (#73)

## Context

The editor screen (#73) is the final step of the Library → Search → Editor demo
flow. It renders a template `<img>` with caption `<span>` overlays absolutely
positioned over it in shadow DOM, styled with CSS (five presets: classic uses
Impact, glitch uses layered `text-shadow`, bubble uses `-webkit-text-stroke`,
etc.). The "download" action has to flatten that on-screen preview — image plus
styled captions — into a single PNG the user can save.

Forces at play:

- **[ADR-0001](0001-vanilla-stack.md):** no framework, no bundler. Adding any
  shipped library has to be justified against this.
- **Caption styling lives in CSS.** Whatever exports the meme either reuses that
  rendered CSS or re-implements all five styles by hand.
- **Template images are cross-origin** (`i.imgflip.com`). Any canvas-based export
  taints the canvas — and `toBlob()`/`toDataURL()` then throw a SecurityError —
  unless the image is fetched in CORS mode and the host sends the right header.
  We verified ImgFlip serves `Access-Control-Allow-Origin: *`.
- **Sprint goal is "function over polish"** with the demo imminent (freeze
  2026-06-07).
- **Process rule 8** requires TA approval for new dependencies. The TA (Omair)
  confirmed frontend-only libraries are exempt and need only a ledger entry; this
  is recorded in [`../dependencies.md`](../dependencies.md).

Options considered:

- **Option A — html2canvas (DOM rasterization).** Capture the `.meme-canvas`
  node; the library renders the actual computed CSS to a canvas, then
  `toBlob()` → download. Single self-contained ES module, vendored.
- **Option B — Canvas 2D compositing (no dependency).** Hand-draw the image and
  each caption with `drawImage` + `fillText`/`strokeText`, manually porting all
  five caption styles. Zero dependencies, but more code and lower fidelity for
  the glitch/bubble effects (CSS `text-shadow` and `-webkit-text-stroke` have no
  one-to-one canvas equivalent).
- **Option C — Server-side render.** Have the Cloudflare Worker composite the
  meme. Offloads the browser but adds an image upload + round-trip and backend
  work; over-scoped for the demo slice.

## Decision

Adopt **Option A**. Vendor **html2canvas 1.4.1** at
`js/vendor/html2canvas.esm.js` and import it directly into `js/components/editor.js`.

The editor's `downloadMeme()`:

1. rasterizes the `.meme-canvas` node with `html2canvas(node, { useCORS: true })`
   (the `<img>` carries `crossorigin="anonymous"` so the canvas isn't tainted),
2. converts the canvas to a PNG blob (`toBlob`, wrapped in a `Promise`/`await`),
3. triggers a download named `memebro-<template-slug>-<timestamp>.png`, and
4. dispatches `memebro:meme-downloaded` (`{ meme, format: 'png' }`,
   `bubbles: true, composed: true`) on success.

On failure it surfaces a small dismissible error popup rather than failing
silently. The vendored file is exempt from ESLint/Prettier (added to
`.eslintignore` and `.prettierignore`) and recorded in
[`../dependencies.md`](../dependencies.md).

We chose A because it renders the real CSS — all five caption styles export
correctly with zero re-implementation — keeps our own code to a single method,
and matches the approach pinned in issue #73. The CORS check removed the one risk
that threatened any canvas approach, and html2canvas is permissible under
ADR-0001 (a single ES module, not a framework) and the TA's frontend-lib carve-out.

## Consequences

Positive:

- The exported PNG matches the on-screen preview exactly; no separate styling
  code to keep in sync.
- Small footprint in our codebase — the complexity lives in the vendored library.
- Self-contained: vendored, not loaded from a CDN, so download works offline and
  on flaky demo-day networks.

Negative:

- Ships a ~410 KB ES module (~90 KB gzipped) on the editor route. Acceptable for
  a one-quarter project; it loads only on the editor page.
- html2canvas rasterizes whatever the browser actually renders, so fonts must be
  loaded. The "classic" style depends on the system `Impact` font (not a web
  font), so it renders on macOS/Windows but may fall back elsewhere.
- This is the project's first shipped frontend library. It softens ADR-0001's
  "no runtime library" framing to "no framework or bundler; self-contained
  single-module utilities are allowed and logged in the dependency ledger."

## When this ADR changes

If we need pixel-perfect or server-side rendering, export formats beyond PNG, or
html2canvas proves unreliable for caption styles we add later, revisit with a
successor ADR (Option B canvas compositing, or Option C a Worker-side renderer).
