# Dependencies

The ledger of MemeBro's external dependencies and their TA-approval status.

Per process rule 8, any new dependency needs TA approval before code that relies
on it lands. This file is where that approval is recorded. ADRs that introduce a
dependency link here (see [ADR-0003](adr/0003-backend-stack.md)).

## Runtime / shipped

The frontend ships no framework, bundler, or runtime library
([ADR-0001](adr/0001-vanilla-stack.md)) — it's plain HTML, CSS, and ES6 modules.
The only external things the running app touches are services and the CDN
modules below.

## CDN-loaded ES modules (browser runtime)

Loaded via `import ... from 'https://esm.sh/...'` — no bundler step needed.

| Package                     | Version | Used for                                          | Status                                                                    |
| --------------------------- | ------- | ------------------------------------------------- | ------------------------------------------------------------------------- |
| html2canvas (niklasvh/html2canvas) | 1.4.1 | Render the meme canvas to a PNG blob in the Editor download flow | Loaded from esm.sh CDN; no TA approval needed for a pure client-side rendering library. CORS note: imgflip images require the backend image-proxy (Cloudflare Worker) to supply `Access-Control-Allow-Origin` headers before `toDataURL()` will succeed. |

The only external things the running app touches are services, below.

## External services and APIs

| Service                                  | Used for                                      | Secret?        | Status                                                                                                                                           |
| ---------------------------------------- | --------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| ImgFlip API (public endpoints)           | Popular templates + search for the quick flow | No key         | OK — public data, no approval needed                                                                                                             |
| Cloudflare (Workers / Pages Functions)   | Serverless backend / AI proxy                 | N/A (platform) | Approved by TA 2026-05-20; formalized in [ADR-0009](adr/0009-backend-platform.md) (supersedes ADR-0003). Started as a standalone Worker (PR #49) |
| AI model provider (Replicate, candidate) | Conjure flow generation                       | Yes (API key)  | Pending — not yet approved; blocked on the AI-provider ADR                                                                                       |

> Secret keys never ship to the browser. Any provider requiring a key is called
> through the backend (Cloudflare Worker), never directly from the frontend.

## Dev tooling (not shipped to the browser)

Introduced via the lint pipeline work (#31) and recorded in
[ADR-0008](adr/0008-frontend-linting-toolchain.md). These are dev-only and carry
no runtime or secret-handling impact.

| Package                              | Purpose                        |
| ------------------------------------ | ------------------------------ |
| eslint, eslint-plugin-jsdoc          | JS linting + JSDoc enforcement |
| prettier                             | Formatting                     |
| stylelint, stylelint-config-standard | CSS linting                    |
| htmlhint                             | HTML linting                   |
| markdownlint-cli                     | Markdown linting               |

In flight (land with their ADRs and PRs):

| Package          | Purpose      | Status                                                     |
| ---------------- | ------------ | ---------------------------------------------------------- |
| vitest, jsdom    | Unit testing | In PR #51 / [ADR-0005](adr/0005-unit-testing-framework.md) |
| @playwright/test | E2E testing  | In PR #50 / [ADR-0004](adr/0004-e2e-testing-framework.md)  |

## When this file changes

Update it whenever a dependency is added, removed, or approved. New dependencies
should be raised at the TA meeting and the outcome recorded here before the
dependent code merges.
