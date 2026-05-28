# ADR-0003: Backend stack for the AI proxy

- **Status:** Superseded by [ADR-0009](0009-backend-platform.md)
- **Date:** 2026-05-19
- **Deciders:** Whole team, with TA sign-off from Omair Qazi

## Context

The MVP quick flow (template pick, caption edit, export) does not need a backend. It calls the public ImgFlip api directly from the browser, no key required.

The slow flow uses a third party AI model (Replicate is the leading candidate per Angelo's research). That api requires a secret key, and we cannot ship the key in the browser. We need a small backend that takes a prompt from the client, calls the AI api with the secret key, and returns the result.

ADR-0001 locked vanilla HTML, CSS, JS on the frontend with no bundler. ADR-0002 is still pending the deployment target call (GitHub Pages vs Cloudflare Pages). The backend choice is partially coupled to ADR-0002, because Cloudflare Pages comes with Functions for free while GitHub Pages does not host server side code at all.

Issue #26 currently picks Cloudflare Workers without an ADR, which is the gap this document fixes. Per process rule 7, any stack choice has to land as an ADR. Per process rule 8, any new dependency needs TA approval before code lands.

Options considered:

1. **Cloudflare Workers.** Standalone serverless, generous free tier, simple to scaffold with `wrangler`. Independent of the hosting choice. New dep, needs TA approval.
2. **Cloudflare Pages Functions.** Same runtime model as Workers but bundled into Cloudflare Pages hosting. Free with ADR-0002 if we pick Cloudflare Pages. Couples the backend choice to the hosting choice.
3. **Vercel Functions or Netlify Functions.** Similar serverless. Adds a third platform on top of GitHub and whatever ADR-0002 picks. New dep, needs TA approval.
4. **Defer.** Do not pick a backend stack yet. The slow flow is sprint 3 work, not MVP. Pause #26 until ADR-0002 lands and the slow flow is actually queued.

## Decision

Proposed: option 4, defer. Reasoning:

- The slow flow is explicitly out of scope for the MVP per the sprint 2 plan. Picking a backend now risks redo if ADR-0002 lands on Cloudflare Pages (option 2 becomes free) or if the chosen AI provider changes.
- TA has not approved Cloudflare Workers as a dep yet. Shipping code on an unapproved stack violates rule 8.
- Pausing #26 frees the backend group to focus on the data layer for the quick flow (ImgFlip top 100, useful in the MVP) and on AI model research, both of which are already in the sprint plan.

The team should ratify the actual stack at sprint planning once Omair weighs in on Wed. Likely paths from here:

- If ADR-0002 picks Cloudflare Pages, pick option 2 (Functions come free, one platform).
- If ADR-0002 picks GitHub Pages, pick option 1 (Workers as a separate service) with TA approval logged in `docs/dependencies.md`.

Until ratified, #26 stays paused. The AI Prompt Function in #27 can still land as a pure JS helper that builds a prompt string (no network call), because the helper is useful regardless of where the backend ends up running.

## Consequences

The defer decision has the following effects once the team ratifies:

- **#26 (Cloudflare Worker for AI proxy) stays BLOCKED** until ADR-0002 lands and the team picks a concrete backend platform (likely at the sprint planning that schedules the slow flow, sprint 3 at earliest). Jordan should redirect effort to the data layer for the quick flow until then.
- **#27 (AI Prompt Function) is partially unblocked.** The prompt-builder helper (pure JS string assembly, no network call) can land now. The network call to the AI provider waits on the platform pick.
- **No code lands on any backend platform** until the team ratifies ADR-0003 and (where applicable) Omair approves the chosen platform as a dependency per process rule 8.
- **Follow-up ADR expected.** Per Omair's guidance on 2026-05-20, once the slow flow is queued and ADR-0002 has landed, the team files a follow-up ADR picking the concrete platform (likely ADR-0004) and brings it to him for dependency approval.

TA sign-off captured in [`docs/meetings/ta/ta-meeting-2026-05-20.md`](../meetings/ta/ta-meeting-2026-05-20.md).
