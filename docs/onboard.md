# Onboarding — MemeBro

Everything a new contributor (or a team taking this project over) needs to get
from a fresh `git clone` to a running app, a green build, and a merged change.
This is the long-form companion to the [`README.md`](../README.md) quickstart
and the binding [`AGENTS.md`](../AGENTS.md) contributor spec.

- **Team:** Cutie Devs — Group 16, CSE 110, Spring 2026
- **Live site:** <https://cse110-sp26-group16.github.io/MemeBro/>
- **Repo:** <https://github.com/cse110-sp26-group16/MemeBro>

---

## 1. What this project is

MemeBro is an AI-assisted, mobile-first meme generator — "ImgFlip for the AI
generation." It has two intended flows:

- **Quick flow (shipped):** pick a template → caption it → export PNG. Uses the
  public ImgFlip API; no account or key required.
- **Conjure flow (partial):** describe a meme in words and let AI help build it.
  The search half (AI-ranked template search) ships; the generative half is
  scaffolded but not wired end to end.

The frontend is **vanilla HTML/CSS/JS** — no framework, no bundler, no build
step ([ADR-0001](adr/0001-vanilla-stack.md)). The backend is a **Cloudflare
Worker** ([ADR-0009](adr/0009-backend-platform.md)). The site deploys as static
files to GitHub Pages ([ADR-0002](adr/0002-deployment-target.md)).

---

## 2. Prerequisites

| Tool        | Version           | Why                                                  |
| ----------- | ----------------- | ---------------------------------------------------- |
| **Node.js** | **>= 22.13.0**    | Dev tooling, tests, lint. Enforced in `package.json` `engines`. |
| **npm**     | ships with Node   | Dependency install + scripts.                        |
| **Python 3** _or_ `npx serve` | any recent | Local static server (ES modules need HTTP, not `file://`). |
| **git**     | any               | Clone, branch, PR.                                   |
| **Wrangler** (optional) | latest | Only if you touch the Cloudflare Worker backend (`memebro-api/`). |

A modern Chromium-based browser is assumed for E2E tests (Playwright installs
its own Chromium).

---

## 3. First run (frontend) — 2 minutes

The app is static files. Because it uses ES6 modules, you **must** serve it over
HTTP — opening `index.html` from the filesystem will fail to load modules.

```bash
# 1. clone
git clone git@github.com:cse110-sp26-group16/MemeBro.git
cd MemeBro

# 2. serve the repo root over HTTP (pick ONE)
python3 -m http.server 8000        # then open http://localhost:8000
#   or
npx serve .                        # prints the URL it serves on
#   or use the VS Code "Live Server" extension

# 3. open the printed URL in a browser
```

You should see the library home grid. Tap a template → caption it in the editor
→ download the PNG. That is the shipped Quick flow.

> You do **not** need `npm install` just to run the app — the browser code has no
> runtime build. `npm install` is only for the dev tooling (lint, tests, hooks).

---

## 4. Dev tooling setup — for contributing

```bash
npm ci          # install dev tooling exactly per package-lock.json
                # (also installs the husky pre-commit hook via "prepare")
```

Then any of:

```bash
npm run lint            # eslint + stylelint + htmlhint + markdownlint + JSON validator
npm run format          # prettier --write across the repo
npm run format:check    # prettier --check (what CI runs)
npm run test:unit       # vitest (jsdom) — tests/unit/**/*.test.js
npm run test:unit:watch # vitest in watch mode while developing
npm run test:e2e        # playwright against a static server on :3000
```

The husky **pre-commit hook** runs `lint-staged` (prettier + eslint/stylelint
`--fix`) on staged files, so the most common CI failures get caught before you
even push. CI is still the source of truth; the hook is a fast first pass.

---

## 5. Repo tour

```text
index.html              Entry point — library home + gallery
pages/                  Standalone screens: editor, search, conjure, history
js/
  components/           Web components (Shadow DOM): template-gallery, editor,
                        search, top-bar, tab-bar, history
  api/                  Data layer: imgflip-api, search-api, ai-api, storage,
                        config
  theme.js              Light/dark theme toggle
  vendor/               Vendored deps (html2canvas) — no CDN at runtime
styles/
  tokens.css            Design tokens (color, spacing, type) — single source of truth
memebro-api/            Cloudflare Worker backend (separate npm package)
  src/index.js          Worker entry: /api/status, /api/search
  src/search-ranking.js AI/lexical template ranking
  test/                 Worker unit tests (vitest)
tests/
  unit/                 Frontend vitest specs
  e2e/                  Playwright specs (home, quick-flow, editor)
scripts/                Repo tooling (JSON validator)
docs/
  adr/                  Architecture Decision Records (MADR format) 0001–0013
  meetings/             Standups, sprint planning, retros, TA meetings
  process/              team-cadence.md, team-roster.md
  interface-contract.md Mount points, shared data shapes, cross-module events
  ci-pipeline.md        How CI/CD works (reference)
Design/                 Hi-fi screens + wireframes (mobile + desktop)
research/               Personas, user stories, AI prototype outputs, prompts
.github/                CI/CD workflows, CODEOWNERS, PR/issue templates, Dependabot
AGENTS.md               Binding contributor spec — read before any build task
```

**Where to start reading:** `AGENTS.md` → `docs/interface-contract.md` →
`docs/adr/README.md` (the ADR index). Those three explain the conventions, the
contracts between modules, and *why* every major decision was made.

---

## 6. Architecture in one diagram

```text
  Browser (GitHub Pages, static)
  ┌─────────────────────────────────────────────┐
  │  index.html / pages/*.html                   │
  │    └─ <memebro-*> web components (Shadow DOM)│
  │         ├─ js/api/imgflip-api.js  ───────────┼──▶  ImgFlip public API (templates)
  │         ├─ js/api/search-api.js   ───────────┼──▶  Cloudflare Worker /api/search
  │         ├─ js/api/storage.js      ──┐         │     (AI-ranked, lexical fallback)
  │         └─ js/api/ai-api.js          │        │
  └──────────────────────────────────────┼───────┘
                                          ▼
                                   localStorage
                                   (favorites, history)
```

Components talk to the host page through **custom events** (e.g.
`memebro:template-selected`, `memebro:search-submit`, `memebro:favorite-toggled`)
and shared data shapes — all documented in `docs/interface-contract.md`. If the
search API is unreachable, the frontend silently falls back to client-side
ImgFlip matching, so the app works on Pages even with the backend down.

---

## 7. Making a change — the full loop

This is the exact path demonstrated in the hand-off video.

```bash
# 1. branch off main; name it <type>/<short-desc> (Conventional Commit types)
git checkout main && git pull
git checkout -b feat/example-tweak

# 2. make your edit (e.g. tweak js/components/template-gallery.js)

# 3. run the local gates before committing
npm run lint
npm run test:unit

# 4. commit (Conventional Commits — see docs/COMMITFORMAT.md)
#    the pre-commit hook auto-fixes formatting/lint on staged files
git add -A
git commit -m "feat(gallery): example tweak"

# 5. push and open a PR against main
git push -u origin feat/example-tweak
gh pr create --fill        # or open the PR in the GitHub UI
```

On the PR, the **CI/CD Pipeline** runs `lint`, `test-unit`, `test-e2e`, and
`test-worker` in parallel, plus a non-blocking dependency audit and CodeQL. They
roll up into a single **`CI success`** check. Once it's green and a teammate
approves (required for changes > 300 LoC; we use PRs for smaller changes too),
merge to `main`. The merge triggers the **`deploy`** job, which publishes to
GitHub Pages — but only after all four required jobs pass.

Full pipeline reference: [`docs/ci-pipeline.md`](ci-pipeline.md).

---

## 8. Backend (Cloudflare Worker) — only if you touch `memebro-api/`

`memebro-api/` is a **separate npm package** with its own `package.json` and
tests. It is not needed to run the frontend (the fallback covers it).

```bash
cd memebro-api
npm ci
npm test                  # worker unit tests (also run as test-worker in CI)
npx wrangler dev          # run the worker locally (needs Cloudflare auth)
npx wrangler deploy       # deploy (needs Cloudflare account + Workers AI binding)
```

Routes: `/api/status` (health check + CORS) and `/api/search` (AI-ranked
template search via Cloudflare Workers AI embeddings, with an in-worker lexical
fallback). See [ADR-0009](adr/0009-backend-platform.md) and
[ADR-0011](adr/0011-ai-provider-search.md).

---

## 9. Process rules (the non-negotiables)

From [`docs/process/team-cadence.md`](process/team-cadence.md):

1. **All work is tracked in GitHub Issues**, assigned and labeled *before* work
   starts.
2. **Feature branches off `main`**, named `<type>/<short-description>`.
3. **Changes > 300 LoC go through a reviewed PR.** Smaller doc/process changes
   use PRs too, to build the review trail.
4. **Conventional Commits** ([`COMMITFORMAT.md`](COMMITFORMAT.md)) +
   **SemVer** ([`SemVerInfo.md`](SemVerInfo.md)); update `CHANGELOG.md` for any
   user-visible change.
5. **Major decisions become ADRs** (MADR format) under `docs/adr/`.
6. **New dependencies need TA approval**, tracked in
   [`dependencies.md`](dependencies.md).
7. **Every meeting produces a Markdown file** under `docs/meetings/` — "no file
   = it didn't happen."

---

## 10. Known gaps / gotchas (read before you trust the build)

These are honestly catalogued — see [`ci-pipeline.md`](ci-pipeline.md) "What is
still open" and the Sprint 4 retro for the full list.

- **Pages publishes the whole repo** (`upload-pages-artifact path: '.'`). Tests,
  `docs/`, and `research/` go live too. A curated publish dir is a TODO.
- **Unit-test glob is a blind spot.** Vitest only collects
  `tests/unit/**/*.test.js`; a test placed elsewhere reports green with zero
  tests collected. No coverage floor yet.
- **Branch protection** must be set in repo Settings to actually *enforce* the
  `CI success` gate (one-time config — [ADR-0010](adr/0010-gate-deploy-on-ci.md),
  [ADR-0012](adr/0012-require-ci-success-check.md)).
- **Pre-existing dependency advisories** in the `markdownlint`/`markdown-it` dev
  chain (ReDoS); fix is a breaking bump that Dependabot will propose.
- **`js/components/search.js` had an XSS sink** flagged by CodeQL — verify it's
  closed before trusting user-supplied search text rendering.

---

## 11. Where to go next

See [`README.md`](../README.md) "What's next" and the hand-off video conclusion.
The short version: wire the Conjure generative flow end to end, finish AI
ranking, restore My Memes/history, curate the Pages publish directory, and add
coverage thresholds to CI.
