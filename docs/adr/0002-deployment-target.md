# ADR-0002: Deployment target for the MemeBro site

- **Status:** Proposed
- **Date:** 2026-05-12
- **Deciders:** Whole team, with TA input pending

## Context

We need somewhere to host MemeBro so the TA, prof, and team can visit a live URL. Two main candidates:

- **GitHub Pages.** Free, integrated with the repo, simple Actions based deploy. Static only.
- **Cloudflare Pages.** Free, integrated with cloudflare's edge network, supports serverless functions (useful if we want a server side proxy for the AI api so we don't expose keys in the browser).

The choice depends on:

1. Whether we need server side features (most importantly an AI api proxy that keeps keys out of the client).
2. The TA's preference.
3. Whether we want preview deploys on every PR.

## Decision

Pending. The team will ask Omair at the wed 5/13 TA meeting which option fits given the AI proxy need. Once decided, this ADR will be updated to status Accepted and the deploy workflow will reflect the choice.

For now we are running on GitHub Pages with the deploy workflow in `.github/workflows/deploy.yml`. If we pick Cloudflare Pages later, the workflow gets replaced.

## Consequences

Will be documented once the decision is made.
