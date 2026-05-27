# MemeBro

AI-powered meme generator, mobile first. Think "ImgFlip for the AI generation":
pick a template, caption it, and export, or describe what you want and let AI
help build the meme.

- **Live site:** <https://cse110-sp26-group16.github.io/MemeBro/>
- **Status Check 1 video:** <https://youtu.be/CxGFtt9xntI>

CSE 110, Spring 2026, Group 16.

## Two flows

- **Quick flow** — pick a meme template, edit the caption, export. Uses the
  public ImgFlip API, no account or key required.
- **Conjure flow** — describe what you want and let AI help pick/build the meme.
  Backend for this is in progress (see [ADR-0003](docs/adr/0003-backend-stack.md)).

## Tech stack

Vanilla HTML, CSS, and JavaScript. No framework, no bundler, no build step.

- ES6 modules and native Web Components with Shadow DOM
  ([ADR-0006](docs/adr/0006-web-components-shadow-dom.md))
- JSDoc for types instead of TypeScript
  ([ADR-0007](docs/adr/0007-jsdoc-instead-of-typescript.md))
- Design tokens in `styles/tokens.css` as the single source of truth for color,
  spacing, and type
- Deployed as static files to GitHub Pages
  ([ADR-0002](docs/adr/0002-deployment-target.md))

See [ADR-0001](docs/adr/0001-vanilla-stack.md) for why we went vanilla.

## Getting started

Clone the repo, then because the app uses ES6 modules you need to serve it over
HTTP (opening `index.html` from the filesystem will not load modules):

```bash
# from the repo root
python3 -m http.server 8000
# then open http://localhost:8000
```

Any static file server works (`npx serve .`, the VS Code Live Server extension,
etc.).

### Linting and formatting

Tooling is dev-only; it does not ship to the browser
([ADR-0008](docs/adr/0008-frontend-linting-toolchain.md)).

```bash
npm ci            # install dev tooling
npm run lint      # eslint + stylelint + htmlhint + markdownlint + json
npm run format    # prettier --write
```

## Project structure

```text
index.html        Entry point (home + gallery)
js/               JavaScript modules
  components/      Web components (e.g. template-gallery.js)
styles/           CSS
  tokens.css       Design tokens (colors, spacing, type)
scripts/          Repo tooling (e.g. JSON validation)
docs/             Process docs, ADRs, meeting notes
.github/          CI/CD, PR + issue templates, CODEOWNERS
```

The full intended layout and all coding conventions live in
[`AGENTS.md`](AGENTS.md), the binding spec for contributors.

## Contributing

Read [`AGENTS.md`](AGENTS.md) before starting a build task. Key references:

- [`AGENTS.md`](AGENTS.md) — coding conventions, folder structure, PR rules
- [`docs/interface-contract.md`](docs/interface-contract.md) — mount points,
  shared data shapes, and events that cross module boundaries
- [`docs/COMMITFORMAT.md`](docs/COMMITFORMAT.md) — Conventional Commits
- [`docs/SemVerInfo.md`](docs/SemVerInfo.md) — versioning
- [`docs/adr/`](docs/adr/) — architecture decision records ([index](docs/adr/README.md))
- [`docs/dependencies.md`](docs/dependencies.md) — dependency + TA-approval ledger

All work is tracked in GitHub Issues; changes land via reviewed PRs against
`main`.

## Team

Group 16, 11 members. See [`docs/process/team-roster.md`](docs/process/team-roster.md)
for names and GitHub handles, and [`docs/process/team-cadence.md`](docs/process/team-cadence.md)
for the meeting schedule and process rules.
