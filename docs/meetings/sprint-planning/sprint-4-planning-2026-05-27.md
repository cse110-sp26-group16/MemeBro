# Sprint 4 Planning Meeting

- **Date:** 2026-05-27 (Wednesday)
- **Sprint:** 4 (Week 9)
- **Type:** Sprint Planning
- **Attendees:** Full team (Yuval, Jordan, Koji, Alec, Angelo, Harvey, Roy, Jennifer; Tim and Bowen via Zoom chat)
- **Facilitator:** Yuval Pesok
- **Note-taker:** Yuval Pesok

## Agenda

1. Wrap Sprint 3 and merge the remaining open PRs
2. Set the Sprint 4 goals and scope
3. Lock the AI flow direction and the backend plan
4. Assign lanes and dish out issues

## Discussion

### Testing needs to go from scaffolding to real tests

Sprint 3 stood up the unit test framework (Vitest) and the e2e framework (Playwright), but no actual tests have been committed yet. Angelo raised this and the team agreed it is the biggest gap. Sprint 4 needs real unit tests and real e2e tests landing in the repo, not just the harness.

### Finish the CI/CD pipeline

Yuval has a couple of process and pipeline PRs still open, including the lint and format gate. Once those merge we have a proper CI/CD setup that runs on every PR and on deployment. Getting them reviewed and merged is the unblock.

### Backend on Cloudflare

The team confirmed Cloudflare as the backend platform (Pages plus Workers). Jordan has the health-check Worker up and is leading the backend build. Next step is actually developing the backend logic rather than just the scaffold. Some people will work across the frontend and backend lanes to connect the two.

### AI flow

The team agreed to build the simpler path first: use AI to suggest or search for a suitable meme template, rather than generate a brand new template from scratch. That is the first AI utilization. Generating a template with AI is harder and becomes a later stretch goal. Once the frontend pages are done, the backend wires up the AI API endpoints and everything gets connected.

### Teams and timeline

We keep the same sub-teams from Sprint 3 to avoid confusion, and anyone who wants to switch lanes can ask Yuval. Yuval will float between frontend and backend to help. Extra standups this week (Thursday after class, plus Friday and weekend check-ins) to stay aligned. Jordan noted the code freeze is the Sunday after this one, roughly two weeks out. The final presentation video can be filmed after the freeze, so the priority is finishing the code.

## Sprint Goal

Move from scaffolding to a working end to end slice: commit real unit and e2e tests, finish the CI/CD pipeline, build out the Cloudflare backend, ship the first AI feature (template suggestion or search), and connect the frontend to the backend. Target everything done by Sunday 2026-05-31.

## Scope (committed for this sprint)

- Write and commit real unit tests against existing modules, closes part of #36 and #11
- Write and commit real e2e tests for the quick flow, closes part of #37 and #11
- Finish and merge the CI/CD pipeline (lint and format gate on every PR), closes #35
- Build out the Cloudflare backend beyond the health-check scaffold, closes #26
- Ship the first AI feature (suggest or search a meme template), closes #27
- Finish remaining frontend pages and merge the approved UI PRs (#33 Conjure, #48 ImgFlip fetch)
- Connect the frontend to the backend AI endpoints

## Out of Scope (explicitly deferred)

- AI generating a brand new meme template from scratch, deferred because it is harder and the suggestion or search path comes first
- Lane reshuffles, deferred so teams stay stable through the final push unless someone requests a switch

## ADRs to write this sprint

- ADR-0009: backend platform (Cloudflare) — Yuval, draft already open as PR #62, get it reviewed and merged
- ADR-0010: AI provider for the template suggestion or search feature — owner TBD (Jordan and Bowen lane), draft once the provider is picked, needs TA dependency sign-off first

## Dependencies to request from TA

- AI provider service for the template suggestion or search feature — needed for #27 — bring to the TA meeting for approval before adding, then log in `docs/dependencies.md`
- Cloudflare (Pages and Workers) — already approved, recorded in ADR-0009

## Test evidence to ship this sprint

- Unit test for the ImgFlip fetch module — issue #36
- Unit test for the AI prompt helper — issue #36
- E2E test for the quick flow (upload, prompt, pick template, generate) — issue #37

## Decisions

- AI flow: build the template suggestion or search path first, defer AI template generation as a stretch goal
- Backend platform: Cloudflare (Pages plus Workers)
- Sub-teams stay as they are from Sprint 3, switches by request to Yuval
- Sprint 4 target completion is Sunday 2026-05-31, ahead of the code freeze the following Sunday

## Action Items

- [ ] Dish out the Sprint 4 issues — Yuval — 2026-05-27
- [ ] Review and merge the open process and CI/CD PRs — team — this week
- [ ] Commit real unit tests — testing lane — by Sunday
- [ ] Commit real e2e tests — testing lane — by Sunday
- [ ] Build out the Cloudflare backend logic — Jordan — by Sunday
- [ ] Pick the AI provider and open ADR-0010 — Jordan and Bowen — early sprint
- [ ] Connect the frontend pages to the backend endpoints — frontend and backend lanes — by Sunday

## Next Up

- Standup Thursday 2026-05-28 after class, plus Friday and weekend check-ins
- Sprint 4 review and retro Sunday 2026-05-31
- Code freeze the following Sunday, final presentation video filmed after
