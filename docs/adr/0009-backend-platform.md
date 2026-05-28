# ADR-0009: Cloudflare as the backend platform for the AI proxy

- **Status:** Accepted
- **Date:** 2026-05-27
- **Deciders:** Whole team, with TA sign-off from Omair Qazi

## Context

This ADR supersedes [ADR-0003](0003-backend-stack.md). ADR-0003 proposed
_deferring_ the backend choice because the slow (AI) flow was out of MVP scope
and the pick was coupled to the then-pending deployment target ([ADR-0002](0002-deployment-target.md)).
Both of those blockers are now resolved: ADR-0002 landed on GitHub Pages, the
slow flow is in active sprint work, and the team has committed to a backend
direction. The "defer" decision is therefore obsolete.

The need is unchanged from ADR-0003: the quick flow calls the public ImgFlip API
straight from the browser (no key), but the slow flow uses a third-party AI model
whose secret key cannot ship in the browser. We need a small serverless backend
that takes a prompt from the client, calls the AI provider with the secret key,
and returns the result.

The team walked the backend plan through Omair at the 2026-05-20 TA meeting and
he approved Cloudflare for the AI proxy (Digital Ocean was offered as a fallback
option). That approval is the basis for moving ADR-0003's successor to Accepted.

A naming note worth recording: the 2026-05-20 TA log frames the approved platform
as Cloudflare **Pages** (Functions bundled with hosting), while the first backend
PR ([#49](https://github.com/cse110-sp26-group16/MemeBro/pull/49)) ships a
standalone Cloudflare **Worker**. These are two delivery models of the _same_
Cloudflare V8-isolate runtime — code written for one ports to the other with
minimal change. Rather than over-specify a product the team hasn't separately
re-ratified, this ADR makes the binding decision at the level Omair actually
approved (Cloudflare as the backend platform) and treats the specific product as
an implementation detail recorded below.

Options considered:

- **Cloudflare (Workers or Pages Functions).** TA-approved. Generous free tier,
  scaffolds with `wrangler`, same runtime regardless of delivery model.
- **Digital Ocean.** The TA-suggested fallback. A heavier, more general compute
  platform; more setup than we need for a single proxy endpoint.
- **A different serverless provider (Vercel / Netlify Functions).** Comparable
  serverless model but adds a third platform alongside GitHub Pages and would
  need its own TA dependency approval.

## Decision

Adopt **Cloudflare as the backend platform** for the AI proxy, per the chosen
option above. The proxy is a thin serverless endpoint: accept a prompt, call the
AI provider with the server-held secret, return the result. Secret keys are held
server-side and never reach the browser.

Implementation note (not a separate binding decision): the team has started with
a **standalone Cloudflare Worker** (PR #49) rather than Pages Functions, because
GitHub Pages — not Cloudflare Pages — won the deployment-target decision, so the
backend is decoupled from hosting and runs as its own Worker. Moving to Pages
Functions later would be a runtime-compatible change, not a new platform.

Digital Ocean remains the documented fallback if Cloudflare proves unworkable.

This decision does **not** approve the AI provider itself. The provider
(Replicate is the candidate) carries a secret key and remains **pending** a
dedicated ADR and its own TA dependency approval per process rule 8. The Worker
can be built and health-checked without it; wiring the real provider call waits
on that approval.

## Consequences

Positive:

- [#26](https://github.com/cse110-sp26-group16/MemeBro/issues/26) (Cloudflare
  Worker for the AI proxy) is **unblocked**; PR #49 can land on an approved
  platform.
- The backend is independent of the hosting choice, so a future deployment
  change does not force a backend rewrite.
- Same-runtime Workers/Pages Functions keeps the door open to consolidating onto
  Pages Functions later without a platform migration.

Negative:

- Cloudflare is a new external platform the team must learn and keep configured
  (`wrangler`, account, deploy secrets).
- Running the Worker as a separate service from GitHub Pages hosting means two
  places to deploy and monitor instead of one.
- The proxy stays a stub until the AI-provider ADR and its TA approval land; the
  slow flow is not end-to-end functional on backend platform choice alone.

## When this ADR changes

If Cloudflare proves unworkable we revisit and write a successor (Digital Ocean
is the standing fallback). A move between Cloudflare Workers and Pages Functions
is an implementation change, not a successor ADR, since the platform decision is
unchanged. The separate AI-provider choice is tracked in its own forthcoming ADR.

TA sign-off captured in [`docs/meetings/ta/ta-meeting-2026-05-20.md`](../meetings/ta/ta-meeting-2026-05-20.md).
