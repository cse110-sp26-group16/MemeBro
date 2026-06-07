# ADR-0008: Frontend linting and formatting toolchain

- **Status:** Accepted
- **Date:** 2026-05-27
- **Deciders:** Whole team

## Context

This ADR records a decision already in force. The toolchain landed via the lint
pipeline work (issue #35, PR #31) and its config sanitization (PR #55), but the
choice of tools was never captured as an ADR.

With 11 contributors writing vanilla HTML, CSS, and JS ([ADR-0001](0001-vanilla-stack.md)),
we need automated style and quality enforcement so PRs stay consistent without
relying on every reviewer to catch formatting by hand. Because CSE 110 grades
process over product, a linting setup that can be wired into a CI gate is itself
a graded artifact.

Vanilla JS also means no compiler catches mistakes, so the linter is doing the
job a build step would otherwise do (this is the enforcement arm of
[ADR-0007](0007-jsdoc-instead-of-typescript.md)).

Options considered:

- **A per-language toolchain:** ESLint (+ `eslint-plugin-jsdoc`) for JS,
  Prettier for formatting, stylelint for CSS, htmlhint for HTML, markdownlint
  for docs, plus a small JSON validator.
- **A minimal subset**, e.g. ESLint + Prettier only, leaving CSS/HTML/Markdown
  unchecked.
- **No tooling**, relying on review discipline alone.

## Decision

Adopt the per-language toolchain, wired through `package.json` scripts:

- `lint:js` — ESLint with `eslint-plugin-jsdoc` (enforces [ADR-0007](0007-jsdoc-instead-of-typescript.md)).
- `lint:css` — stylelint with `stylelint-config-standard`, plus a BEM-aware
  `selector-class-pattern` matching the class convention in `AGENTS.md`.
- `lint:html` — htmlhint.
- `lint:markdown` — markdownlint-cli.
- `lint:json` — a small `scripts/validate-json.js` check.
- `format:check` / `format` — Prettier.
- `lint` runs all of the above.

Gating scope is maintained source only: `js/`, `styles/`, `scripts/`, root
config, `docs/`, and root docs. Prototypes (`research/`), archival records
(`admin/`), design exports (`Design/`), and generated output (`test-results/`)
are excluded via the per-tool ignore files. These tools are dev dependencies;
they do not ship to the browser.

## Consequences

Positive:

- Consistent style across all file types without manual policing.
- JSDoc and CSS conventions are enforced by machine, not just convention docs.
- The `lint` and `format:check` scripts are directly consumable by a CI gate
  (the follow-up CI PR), which is a scored process artifact.

Negative:

- Five linters plus a formatter is more config surface to maintain and keep from
  contradicting each other (the BEM `selector-class-pattern` override in PR #55
  is one such reconciliation).
- New contributors must run `npm ci` and `npm run lint` locally to avoid
  surprises.
- Linter defaults can conflict with our own documented conventions; when they
  do, we fix the config to match the convention rather than rewrite code to
  match the linter.

## When this ADR changes

If a tool proves to be more noise than value (or a better single tool replaces
several), we adjust the toolchain via a successor ADR. Adding or removing a
linter is a config change that should be ratified at sprint planning or retro
per the `AGENTS.md` change process.
