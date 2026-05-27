# Sprint 2 Review + Retrospective

- **Date:** 2026-05-18 (Sunday)
- **Sprint:** 2 (Week 7, build sprint)
- **Attendees:** Full team
- **Facilitator:** Yuval Pesok
- **Note-taker:** Yuval Pesok

## Sprint Review

### Sprint Goal (recap)

From sprint 2 planning on 2026-05-13: finish all sprint 1 PRs including the wireframes and MVP page, create a mobile-first MVP skeleton that allows upload, text, and template selection with no AI usage yet, accessible on GitHub Pages.

### Demo / What Shipped

#### Sprint 1 carry-overs (cleanup)

- PR #13 (Core Design Artifacts) merged, issue #1 closed.
- PR #14 (CI/CD Pipeline) merged, issue #5 closed.
- PR #17 (Landing Page Wireframe) merged, issue #3 closed.
- PR #19 (DevOps setup: Pages deploy, PR template, ADR-0001/ADR-0002) merged.
- Issue #4 (Versioning Protocol) closed, all AC met.
- Issue #10 (Baseline Code) closed with working index.html on GitHub Pages.

#### Sprint 2 new work

- **AGENTS.md and build foundation** landed via PR #40 and #41. Design tokens in `styles/tokens.css`, interface contract in `docs/interface-contract.md`, ADR-0001 accepted, ADR-0002 accepted (GitHub Pages).
- **Sprint 2 process docs** merged via PR #32 (standup logs, TA meeting notes, planning update, flexible standup template).
- **Prompt engineering research** merged via PR #20 (five prompt templates, edge case results).
- **ADR-0003 (backend stack)** proposed and merged via PR #34. Decision: defer the backend platform pick until the slow flow is queued. TA sign-off from Omair on 2026-05-20.
- **Library Grid design screens** merged via PR #42 (mobile-first crops from Figma).
- **Angelo's linting work** in progress on PR #31 (ESLint + Prettier config). Not merged yet.

### What Did NOT Ship (and why)

- **MVP skeleton on GitHub Pages.** The core UI pieces (home layout, gallery, conjure page) were in development but not merged to main by end of sprint. The sprint ran long and this work carried into the following week.
- **#11 Testing + Linting Infrastructure.** Angelo started the lint slice (PR #31) but the full umbrella (unit tests, e2e, JSDoc enforcement) is still open. Split into sub-issues #35, #36, #37 for cleaner tracking.
- **#2 Mobile Wireframes.** Closed as part of the design reshape (#38), but the updated wireframes for the quick flow were still in progress.
- **Branch protection on main.** Not yet enabled. Needed to avoid blocking the team while PRs were still catching up.

## Retrospective

### What Went Well

- **Sprint 1 cleanup happened fast.** All the stale PRs from sprint 1 got reviewed and merged in the first two days, clearing the way for new work.
- **Process scaffolding is solid.** AGENTS.md, interface contract, design tokens, meeting templates, ADR workflow, and standup cadence all established. The team has a clear spec to follow.
- **ADR process working.** Three ADRs written (0001, 0002, 0003) with proper format and TA sign-off where needed. Decisions are documented, not just made in Slack.
- **Design screens shipped.** Library Grid mobile-first crops give the frontend team a concrete reference to build against.
- **Subteam split is productive.** Four lanes (frontend, backend, testing/docs, design) with self-selected membership. People are working in parallel without stepping on each other.

### What Didn't Go Well

- **Sprint ran long.** The sprint was supposed to end Sunday 2026-05-17 but major features (home layout, gallery, conjure page) didn't merge until the following week. Scope was too ambitious for one week.
- **UI PRs came in late.** Harvey, Tim, and Jennifer all had work in progress but PRs opened late in the sprint, leaving no time for review within the sprint window.
- **Testing infrastructure still incomplete.** #11 has been open since sprint 1. Angelo started linting but the unit and e2e pieces haven't been touched. This is now two sprints without test coverage.
- **Standup cadence slipped.** Only 2 logged standups this sprint (05-13 and 05-14) instead of the target 3 per week. Need to be more disciplined.
- **Backend blocked by ADR deferral.** The defer decision on ADR-0003 was correct but it left Jordan and Bowen without a clear deliverable for the sprint beyond research.

### What We'll Try Next Sprint

- **Shorter sprint scope.** Commit to fewer items and actually finish them within the sprint window.
- **Testing infrastructure is a must-do, not a should-do.** Split #11 into #35 (lint), #36 (unit), #37 (e2e) and assign explicit owners.
- **PRs open early, even as drafts.** Draft PRs by mid-sprint so reviewers have time.
- **Three standups per week, logged.** No exceptions.

## Action Items (carry into Sprint 3)

- [x] Merge the UI PRs that are ready: home layout, gallery, conjure page.
- [ ] Get Angelo's lint PR (#31) reviewed and merged.
- [x] Assign owners for #36 (unit testing) and #37 (e2e testing) and deliver this sprint.
- [ ] Ratify ADR-0003 (backend stack) at sprint 3 planning once Omair's feedback is incorporated.
- [x] Film presentation video by Thursday 2026-05-21.
- [x] Backfill missing standup logs to meet the 3-per-week cadence.

## Evidence of Incorporation (from Sprint 1 retro)

- **"Merge PRs within 24h"** — PRs #12, #13, #14, #17 all merged early in sprint 2. The review SLA was adopted and mostly followed.
- **"All task assignment via GitHub Issues"** — Sprint 2 issues were posted on GitHub with self-assignment. Slack was used for discussion, not assignment.
- **"Every meeting produces a file"** — Standup template created, standups and TA meeting logged under `docs/meetings/`.
- **"ADRs for major decisions"** — ADR-0001, 0002, 0003 all written in MADR format under `docs/adr/`.
- **"Finish wireframes #2 and #3"** — #3 merged via PR #17. #2 reshaped into #38 (quick flow wireframe update) and closed.
- **"Assign owner for #11"** — Angelo took the lint slice. Full umbrella split into sub-issues #35, #36, #37 for clearer ownership.
