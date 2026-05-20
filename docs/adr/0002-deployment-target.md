# ADR-0002: Deployment target for the MemeBro site

- **Status:** Accepted
- **Date:** 2026-05-19
- **Deciders:** Whole team, with TA input

## Context

We need somewhere to host MemeBro so the TA, prof, and team can visit a live URL. Two main candidates were considered:

- **GitHub Pages.** Free, integrated with the repo, simple Actions based deploy. Static only.
- **Cloudflare Pages.** Free, integrated with cloudflare's edge network, supports serverless functions (useful if we want a server side proxy for the AI api so we don't expose keys in the browser).

The choice came down to:

1. Whether the static frontend and the AI proxy needed to live in the same place.
2. The TA's preference for keeping the process trail visible inside the repo.
3. Whether we wanted preview deploys on every PR.

## Decision

Host the MemeBro frontend on **GitHub Pages**, served from the `main` branch of `cse110-sp26-group16/MemeBro` via `.github/workflows/deploy.yml` (uses `actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages`). Live URL: `https://cse110-sp26-group16.github.io/MemeBro/`.

The AI proxy (server side endpoint that holds the AI api key so it never reaches the browser) is **out of scope** for this ADR and is decided separately in a future backend ADR. GitHub Pages is static only, so wherever the proxy lands it will be a separate origin called from the frontend.

## Consequences

Positive:

- Zero infra setup. The repo already has the deploy workflow wired up and pages enabled.
- The deploy trail (every push to `main` produces a deployment) lives next to the code and the PRs, which matches the "process over product" grading axis.
- Custom domains are possible later via `CNAME` if we want one, but the default subdomain is fine for the quarter.

Negative:

- No server side compute on this origin. Any backend (AI proxy, rate limiting, secrets) must live elsewhere and be called via CORS. A future backend ADR picks that elsewhere.
- No native PR preview deploys. We get a single environment (`main`). Reviewers verify locally, or we add a manual preview workflow later if it becomes painful.
- Cache invalidation on the `*.github.io` CDN can take a couple minutes after a deploy. Acceptable for a class project.

## When this ADR changes

If we later need server side rendering, request rewrites, or a single origin for frontend and backend, we revisit this ADR and write a successor. As long as the frontend stays vanilla static files (per [ADR-0001](0001-vanilla-stack.md)), GitHub Pages is sufficient.
