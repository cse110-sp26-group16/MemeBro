# Interface Contract

The boundary spec between screens, components, and modules. Read this after `AGENTS.md` and `styles/tokens.css`, before you start a screen or module. Anything not specified here is open for you to design, but if it crosses a boundary another lane touches, it belongs in this doc.

## What this contract guarantees

Four things stay stable so the lanes can build in parallel without colliding:

1. Mount points, where each screen lives in the DOM
2. Shared data shapes, the meme and template objects
3. Events, how components hand data to each other across shadow DOM
4. Storage, the keys and shapes written to `localStorage`

If you need something not specified here, propose it via PR against this file. Do not invent a one-off in your screen.

## Pages and mount points

| Screen                                | File                           | Mount element                 | Issue |
| ------------------------------------- | ------------------------------ | ----------------------------- | ----- |
| Home (landing, popular templates)     | `index.html`                   | `<main id="home-root">`       | #24   |
| Gallery (browse and search templates) | `index.html` (toggled section) | `<section id="gallery-root">` | #22   |
| Conjure (AI prompt to generate meme)  | `pages/conjure.html`           | `<main id="conjure-root">`    | #25   |
| History (saved memes)                 | `pages/history.html`           | `<main id="history-root">`    | TBD   |

Each screen is a web component (e.g. `<memebro-home>`) that mounts inside its root element and owns its shadow DOM. The host page is a thin shell, it sets up the mount root and pulls in the component module, nothing else.

Editor and export screens are out of scope for sprint 2 but reserve `editor-root` and `export-root` so we do not collide later.

## Shared data shapes

These are the only data shapes that cross a screen or module boundary. Adding an optional field is fine, removing or renaming a field is a breaking change that needs team agreement.

### Template

A meme image plus minimal metadata.

```js
/**
 * @typedef {Object} Template
 * @property {string} id           Stable id from the upstream source (e.g. imgflip template id)
 * @property {string} name         Human-readable title
 * @property {string} imageUrl     Absolute URL to the image
 * @property {number} width        Image width in pixels
 * @property {number} height       Image height in pixels
 * @property {boolean} [popular]   True if returned from the popular list
 */
```

### Caption

A single text overlay on a meme.

```js
/**
 * @typedef {Object} Caption
 * @property {string} text
 * @property {number} x           Position from left as a 0 to 1 ratio of image width
 * @property {number} y           Position from top as a 0 to 1 ratio of image height
 * @property {number} fontSize    In px relative to image natural width
 * @property {string} color       CSS color string
 */
```

Positions are ratios, not pixels. A caption authored against a 500px wide image renders correctly at 1000px.

### Meme

A template plus the user's edits.

```js
/**
 * @typedef {Object} Meme
 * @property {string} id                 UUID generated client-side
 * @property {string} templateId         Matches Template.id
 * @property {string} templateImageUrl   Cached so the meme renders even if the upstream template moves
 * @property {Caption[]} captions
 * @property {'quick'|'conjure'} source  Which flow created it
 * @property {string} createdAt          ISO 8601 timestamp
 */
```

## Storage

`localStorage` is the only client-side store for sprint 2. No IndexedDB, no cookies for app data.

| Key                      | Type                | Notes                                                                |
| ------------------------ | ------------------- | -------------------------------------------------------------------- |
| `memebro:memes`          | `Meme[]`            | The saved meme list. History reads, Editor writes.                   |
| `memebro:schema-version` | `number`            | Currently `1`. Bump and add a migration if you change a shape above. |
| `memebro:theme`          | `'light' \| 'dark'` | Persisted theme choice. Foundation JS reads on load.                 |

All storage access goes through `js/api/storage.js`. Components do not call `localStorage` directly. That keeps the schema-version check in one place.

## Events

Components talk to each other by dispatching custom events that bubble up through the DOM. Names use the `memebro:` prefix in kebab-case.

| Event                       | `detail` shape                 | Fired by        | Listened by                     |
| --------------------------- | ------------------------------ | --------------- | ------------------------------- |
| `memebro:template-selected` | `{ template: Template }`       | Home, Gallery   | Editor (when it lands), Conjure |
| `memebro:meme-created`      | `{ meme: Meme }`               | Editor, Conjure | Storage layer                   |
| `memebro:meme-saved`        | `{ meme: Meme }`               | Storage layer   | History                         |
| `memebro:meme-deleted`      | `{ id: string }`               | History         | Storage layer                   |
| `memebro:theme-changed`     | `{ theme: 'light' \| 'dark' }` | Theme toggle    | Foundation, persistence         |

Always fire with `bubbles: true` and `composed: true` so the event escapes the shadow DOM:

```js
this.dispatchEvent(
  new CustomEvent("memebro:template-selected", {
    detail: { template },
    bubbles: true,
    composed: true,
  })
);
```

## API modules

Modules under `js/api/` expose async functions and know nothing about the DOM. Screens import and call them.

| Module                  | Purpose                                                               | Target exports                                                                                                                             |
| ----------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `js/api/imgflip-api.js` | Template search and popular list (#21)                                | `getPopularTemplates(): Promise<Template[]>`, `searchTemplates(query: string): Promise<Template[]>`                                        |
| `js/api/storage.js`     | `localStorage` wrapper                                                | `getMemes(): Meme[]`, `saveMeme(meme: Meme): void`, `deleteMeme(id: string): void`, `getTheme(): 'light'\|'dark'`, `setTheme(theme): void` |
| `js/api/ai-api.js`      | Pure prompt builder (#27)                                             | `buildAIPrompt(inputs: ConjureInputs): string`                                                                                             |
| `js/api/conjure.js`     | AI generation, BLOCKED on [ADR-0003](adr/0003-backend-stack.md) (#27) | `conjureMeme(prompt: string): Promise<Meme>`                                                                                               |

These signatures are the agreement so other lanes can stub against them while the real module is in flight. The owning issue locks the final signatures in its PR.

### ConjureInputs

The parameter object for `buildAIPrompt`. Passed through to `conjureMeme` as the `prompt` argument once the backend lands.

```js
/**
 * @typedef {'photo'|'cartoon'|'3d-render'|'retro'|'painted'|'screenshot'} MemeStyle
 * @typedef {'1-panel'|'2-panel'|'3-panel'|'4-panel'} MemeLayout
 *
 * @typedef {Object} ConjureInputs
 * @property {string}      concept          User's description of the meme situation or joke (required)
 * @property {string}      [memeFormat]     Named meme template (e.g. "Drake Hotline Bling"). Omit to let the model choose.
 * @property {MemeStyle}   [style]          Visual style. Defaults to 'photo'.
 * @property {MemeLayout}  [layout]         Panel layout. Defaults to '1-panel'.
 * @property {string}      [referenceImage] Base64 data URL of the user's reference photo (optional).
 */
```

`buildAIPrompt` returns a JSON string `{ "system": "...", "user": "..." }`. The backend passes each key to the AI provider in the correct role slot. The user section always ends with a `Return:` line specifying the expected output schema:

- **With `memeFormat`:** `{"top_text": "...", "bottom_text": "...", "image_treatment": "..."}`
- **Without `memeFormat`:** `{"suggested_format": "...", "top_text": "...", "bottom_text": "...", "image_treatment": "..."}`
- **Refusal (any template):** `{"refusal": "<friendly reason>"}`

## Routing

Plain `<a href>` for cross-page navigation. No client-side router.

Inside a page, screens toggle visibility by adding or removing a class on their mount root. The page shell does not manage this, the screen does.

## Theme

`data-theme="dark"` on `<html>` flips the dark token set. Components read `var(--token)` and do not check the attribute themselves.

The toggle (when it ships) writes the attribute and calls `storage.setTheme()`. On page load, a small foundation script reads `storage.getTheme()` and sets the attribute before any component mounts, so there is no flash.

## When this contract changes

Update via PR.

- Adding an optional field, a new event, a new module: non-breaking, normal review.
- Renaming or removing a field, renaming an event, moving a mount point: breaking. Post in the foundation Slack channel one day before the PR opens and get team acknowledgment at sprint planning or retro.

The bar is higher than other docs because every lane depends on this file.
