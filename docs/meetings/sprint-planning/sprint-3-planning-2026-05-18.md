# Sprint 3 Planning Meeting

- **Date:** 2026-05-18 (Sunday)
- **Sprint:** 3 (Week 8)
- **Type:** Sprint Planning
- **Attendees:** Full team
- **Facilitator:** Yuval Pesok
- **Note-taker:** Yuval Pesok

## Agenda

1. Sprint 2 retro takeaways
2. Sprint 3 goal
3. Scope: must-do vs. carry-overs
4. Presentation video plan (due Thursday 2026-05-21)
5. Testing infrastructure ownership
6. Backend platform discussion
7. Action items

## Discussion

### Sprint 2 retro takeaways

Sprint 2 ran long. The UI work (home layout, gallery, conjure page) was in progress but didn't merge within the sprint window. Testing infrastructure (#11) carried over for the second time. The team agreed to commit to fewer items and actually close them this sprint.

Key retro actions to incorporate:

- Testing infra is a must-do, not a should-do.
- PRs open early as drafts.
- Three standups per week, logged.

### Presentation video

Due Thursday 2026-05-21. Each lane needs something visible. The home layout and gallery are close to merging, which gives the frontend lane a real demo. Backend can show the Cloudflare Worker scaffold and the prompt-builder helper. Testing/docs lane can show the CI pipeline and ADR process. Design can show the Library Grid screens.

Filming planned for Wednesday night. Yuval to compile content and slides with Claude Code.

### Testing infrastructure split

#11 (umbrella) split into three sub-issues for cleaner ownership:

- #35 (lint/format/JSDoc) — Angelo, already in progress on PR #31
- #36 (unit testing framework) — Yuval
- #37 (e2e testing framework) — Yuval

All three should ship this sprint with CI gating on PRs.

### Backend platform

ADR-0003 deferred the backend stack pick. Omair approved the defer on 2026-05-20. The team leans toward Cloudflare Pages Functions if ADR-0002 lands on Cloudflare Pages, or standalone Cloudflare Workers if we stay on GitHub Pages. Jordan started a Worker scaffold (#26) as a hedge. Formal ratification deferred to sprint 4 planning once Omair weighs in at the next TA meeting.

## Sprint Goal

> Merge all outstanding UI PRs so the quick flow skeleton is live on GitHub Pages, ship the testing infrastructure (lint, unit, e2e), and film the presentation video.

## Scope (committed for this sprint)

- Merge home page layout PR (#47, Harvey) — closes #24
- Merge template gallery PR (#45, Tim) — closes #22
- Review and merge Conjure page PR (#33, Jennifer) — closes #25
- Review and merge ImgFlip fetch PR (Roy) — closes #21
- Review and merge lint pipeline PR (#31, Angelo) — closes #35
- Set up unit testing framework with Vitest (#36, Yuval) — ADR, install, dummy test, CI
- Set up e2e testing framework with Playwright (#37, Yuval) — ADR, install, dummy test, CI
- Update changelog for sprint 2 (#28, Yuval)
- Film presentation video by Thursday 2026-05-21
- Visual QA pass (#43) against the design screens once UI PRs merge

## Out of Scope (explicitly deferred)

- Backend platform ratification (ADR-0003 follow-up). Deferred to sprint 4 pending TA input.
- AI-generated meme flow. No user-facing AI this sprint.
- Wiki pages (#29, #30). Koji and Alec to continue but these are not blocking.
- Cross-team code review swap. Scheduled for weekend of 5/23 and 5/24, prep happens end of sprint.

## Dependencies to request from TA

- `@playwright/test` and `serve` — needed for #37 (e2e testing)
- `vitest` and `jsdom` — needed for #36 (unit testing)
- Batch these with the lint deps (ESLint, Prettier) at the next TA meeting

## Test evidence to ship this sprint

- Unit test: one dummy Vitest test proving the framework runs (#36)
- E2E test: one dummy Playwright test proving the framework runs against the deployed page (#37)
- Lint: ESLint + Prettier config enforced in CI (#35)

## Decisions

- Sprint 3 runs Sunday 2026-05-18 through Saturday 2026-05-24.
- Sprint 4 planning on Sunday 2026-05-25.
- Testing infrastructure (#35, #36, #37) is the top priority alongside merging the UI PRs.
- Backend platform decision formally deferred to sprint 4 planning.
- Presentation video filming Wednesday 2026-05-21 evening.

## Action Items

- [x] Harvey: address any PR #47 review comments, get merged — by Monday 5/19
- [x] Tim: ping reviewer for PR #45 — by Monday 5/19
- [ ] Jennifer: address PR #33 comments and mark ready — by Wednesday 5/21
- [x] Roy: open PR for ImgFlip fetch (#21) — by Tuesday 5/20
- [ ] Angelo: rebase PR #31, ping reviewer — by Monday 5/19
- [x] Yuval: set up Vitest (#36) and Playwright (#37) with ADRs, dummy tests, and CI — by Thursday 5/22
- [x] Yuval: update changelog (#28) — by Friday 5/23
- [x] Yuval: compile presentation content and slides — by Wednesday 5/21
- [x] Yuval + Jordan + Koji: film presentation video — Wednesday evening 5/21
- [x] Everyone: log standups (target: 3 this week)
