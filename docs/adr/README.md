# Architecture Decision Records

This directory holds MemeBro's Architecture Decision Records (ADRs), one file
per significant decision, in [MADR](https://adr.github.io/madr/) format. Per
team process rule 7, every major stack, architecture, tooling, or process
decision is captured here.

## Index

| ADR                                         | Decision                                | Status                      |
| ------------------------------------------- | --------------------------------------- | --------------------------- |
| [0001](0001-vanilla-stack.md)               | Vanilla HTML/CSS/JS, no framework       | Accepted                    |
| [0002](0002-deployment-target.md)           | Deploy to GitHub Pages                  | Accepted                    |
| [0003](0003-backend-stack.md)               | Backend stack for the AI proxy          | Superseded by ADR-0009      |
| [0004](0004-e2e-testing-framework.md)       | Playwright for E2E testing              | Proposed (lands via PR #50) |
| [0005](0005-unit-testing-framework.md)      | Vitest for unit testing                 | Proposed (lands via PR #51) |
| [0006](0006-web-components-shadow-dom.md)   | Web Components with Shadow DOM          | Accepted (lands via PR #56) |
| [0007](0007-jsdoc-instead-of-typescript.md) | JSDoc instead of TypeScript             | Accepted (lands via PR #56) |
| [0008](0008-frontend-linting-toolchain.md)  | Frontend linting + formatting toolchain | Accepted (lands via PR #56) |
| [0009](0009-backend-platform.md)            | Cloudflare as the backend platform      | Accepted                    |
| [0010](0010-gate-deploy-on-ci.md)           | Gate the Pages deploy on CI passing     | Accepted                    |
| [0011](0011-ai-provider-search.md)          | AI provider for template search ranking | Proposed (pending TA)       |

> Some ADRs are still in open PRs and will appear in this directory once those
> PRs merge. The status column notes which.

## Status legend

- **Accepted** — decided and in effect.
- **Proposed** — drafted, awaiting team ratification (and TA sign-off where a
  new dependency is involved).
- **Deferred** — intentionally not deciding yet; revisit later.
- **Superseded** — replaced by a later ADR (which it links to).

## Adding an ADR

1. Copy the structure of an existing ADR (context, options, decision,
   consequences, "when this changes").
2. Use the next free number. Numbers are never reused, even if an ADR is
   superseded.
3. Open a PR. Decisions that introduce a new dependency also need TA approval
   logged in [`../dependencies.md`](../dependencies.md) per process rule 8.
4. Add a row to the index above.
