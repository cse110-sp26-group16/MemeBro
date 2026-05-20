# AGENTS.md

The spec every contributor follows when writing code on MemeBro. The file is named for the AI-agent convention (tools look for `AGENTS.md` at the repo root), but the rules apply equally to humans. Read it before you start a build task. It is binding, not advisory.

## About the project

MemeBro is a vanilla HTML, CSS, and JS web app deployed to GitHub Pages at `https://cse110-sp26-group16.github.io/MemeBro/`. Mobile first. Two flows: a quick flow (pick a template, edit the caption, export) and a slow flow (describe to AI, generate a custom meme). See the Library Grid hi-fi design for visuals.

## Stack rules

- Vanilla HTML, CSS, JS only, per [ADR-0001](docs/adr/0001-vanilla-stack.md). No frameworks, no bundlers, no JSX.
- ES6 modules for JavaScript (`import` / `export`).
- The Library Grid design's `.jsx` files are React, treat them as design intent, not code to copy.
- Backend stack is pending [ADR-0003](docs/adr/0003-backend-stack.md). No worker or serverless code until that ADR is Accepted.

## Folder structure

| Path | Purpose |
| --- | --- |
| `index.html` | Main entry, the landing page |
| `pages/` | Additional HTML pages (e.g. `pages/conjure.html`) |
| `styles/` | All CSS |
| `styles/tokens.css` | Design tokens, single source of truth for color, spacing, type |
| `js/` | JavaScript modules |
| `js/api/` | API client modules (e.g. `js/api/imgflip-api.js`) |
| `js/components/` | Web components |
| `assets/` | Images, fonts |
| `Design/` | Design references |
| `docs/` | Process docs, ADRs, conventions |
| `tests/` | Unit and E2E tests (path firmed up when test framework lands per #36, #37) |

## Design tokens

- `styles/tokens.css` is the only place colors, spacing, radii, shadows, and chrome dimensions are defined.
- Never hardcode a value that has a token. Use `var(--token-name)`.
- Light is default. Dark theme activates via `data-theme="dark"` on `<html>`.
- Need a value that does not exist as a token? Add it to `styles/tokens.css` with a sensible name, do not invent a one-off in your file.

## HTML conventions

- Use semantic elements: `header`, `nav`, `main`, `section`, `article`, `footer`.
- `lang="en"` on `<html>`.
- `alt` text on every `<img>`. Decorative images use `alt=""`.
- `aria-label` on interactive controls that have no visible text (icon buttons, etc).
- Mobile first. Build for 375px width as the baseline, scale up.

## CSS conventions

- Use tokens.
- Mobile-first media queries: `@media (min-width: ...)`.
- Class names in kebab-case. For component-internal pieces, BEM-style (`block__element--modifier`) is fine.
- Scope rules to a parent class or a custom element, do not style raw tags globally outside `tokens.css`.
- No `!important` unless overriding a third-party rule we cannot change.

## JavaScript conventions

- ES6 modules. One module per file.
- `const` by default, `let` when reassigning, never `var`.
- JSDoc on every exported function: parameter types, return type, one-line description. See [#30 Wiki Coding Standards](https://github.com/cse110-sp26-group16/MemeBro/issues/30) for the full JSDoc style.
- Pure functions where possible. Side effects are explicit.
- Async work with `async` / `await`, not raw promise chains.
- No `console.log` in committed code. Use it while debugging, remove before PR.

## Web components

- Custom elements via `class X extends HTMLElement`.
- Tag names in kebab-case with at least one hyphen, prefixed `memebro-` (e.g. `<memebro-gallery>`).
- Use Shadow DOM unless there is a documented reason not to.
- Component CSS lives inside the component (in its shadow root), not in global stylesheets.

## Testing

- Every screen and module ships with at least one smoke test (renders, runs, returns expected shape).
- Unit framework lands via [#36](https://github.com/cse110-sp26-group16/MemeBro/issues/36), E2E via [#37](https://github.com/cse110-sp26-group16/MemeBro/issues/37). Conventions firm up when those land.
- E2E covers the quick flow happy path end to end.

## Branches and commits

- Branch names: `<type>/<short-description>` per [docs/COMMITFORMAT.md](docs/COMMITFORMAT.md). The exact branch is named on your issue.
- Conventional commits per [docs/COMMITFORMAT.md](docs/COMMITFORMAT.md).
- SemVer per [docs/SemVerInfo.md](docs/SemVerInfo.md).
- Update `CHANGELOG.md` for any user-visible change.
- One PR closes one issue cleanly.

## Pull requests

- Use [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md), it auto-fills.
- Body includes `closes #N`.
- 24h review SLA. Your reviewer is named on the issue, ping them in your lane Slack channel when you open the PR.
- Disclose any AI agent usage in the PR body, per process rule 9.

## Required reading before you start a build task

In order:

1. This file
2. `styles/tokens.css`
3. `docs/interface-contract.md` (mount points, shared data shape)
4. The golden reference screen at `js/components/` once #24 lands
5. [ADR-0001](docs/adr/0001-vanilla-stack.md)
6. [docs/COMMITFORMAT.md](docs/COMMITFORMAT.md)
7. The "Build process additions" comment on your specific issue

## Working with AI agents

- Agents are optional. Use them or don't. The rules above apply equally either way.
- If you use one, feed it the four binding references from your issue: this file, `styles/tokens.css`, `docs/interface-contract.md`, and the golden reference screen.
- Your issue has an "Agent prompt starter" block. Copy it verbatim, fill the brackets, paste to your agent. That keeps every agent on the team anchored to the same spec.
- You review the agent's output before opening the PR. The agent does not push directly.
- Disclose agent usage in the PR body. Honesty about how the code got written is part of the process grade.

## When this file changes

Update via PR. Substantive changes (new convention, removed rule) need team agreement at sprint planning or retro. Small clarifications can land directly with a reviewer.
