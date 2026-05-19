# Library Grid Design Bundle

The hi-fi design direction we picked for the build sprint. This is the source of truth for visuals (colors, type, spacing, layout, screen behavior).

## How to view it

Double-click the HTML files, they open in your browser. No build step, no server.

- `Memebro Library.html` is the hi-fi prototype. All 6 screens (Home, Search, Conjure, Editor, History, Export) are clickable. Use the Tweaks panel in the corner to cycle screens or toggle light/dark and density.
- `Memebro Wireframes (standalone).html` is the original 4-direction wireframe contact sheet (lo-fi). We picked direction 3 (Library Grid), the other three are here for context only.

The HTML loads React, ReactDOM, and Babel from a CDN, so you need an internet connection the first time you open it.

## What lives where

| File | What it is |
| --- | --- |
| `library/tokens.css` | The canonical design tokens. Every color, spacing, and type value lives here as a CSS variable. Port these values to `styles/tokens.css` for the actual build. |
| `library/*.jsx` | React components showing structure and behavior for each screen. The build is vanilla per ADR-0001, so treat the JSX as design intent, not code to copy. |
| `tweaks-panel.jsx` | The dev-only Tweaks panel (theme, density, screen cycler). Not part of the product, just helps you explore the prototype. |
| `styles.css` | Extra prototype styles. |

## Why this design

Picked from 4 wireframe directions on 5/13. Warm tan/cream/orange palette, Geist + Instrument Serif type. The Tweaks panel and JSX components are an exploration tool only, the real build is vanilla HTML, CSS, and JS.

## What this means for the build

When an issue says "Design source for this unit: the [screen] in the Library Grid design," open `Memebro Library.html`, cycle to that screen in the Tweaks panel, and build to what you see. Use `library/tokens.css` as the value source so colors and type match.
