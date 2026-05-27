# Sprint 3 Review + Retrospective

- **Date:** 2026-05-24 (Sunday)
- **Sprint:** 3 (Week 8)
- **Attendees:** Full team
- **Facilitator:** Yuval Pesok
- **Note-taker:** Yuval Pesok

## Sprint Review

### Sprint Goal (recap)

From sprint 3 planning: merge all outstanding UI PRs so the quick flow skeleton is live on GitHub Pages, ship the testing infrastructure (lint, unit, e2e), film the presentation video, and prep for the cross-team code review swap.

### Demo / What Shipped

#### Frontend

- **Home page layout (#24)** merged via PR #47. Mobile-first with pinned search bar and Conjure action button. Harvey.
- **Template gallery (#22)** merged via PR #45. Responsive CSS grid with category filtering and placeholder images. Tim.
- **ImgFlip fetch module (#21)** code complete with mock fetch test, PR #48 open. Roy.
- **Conjure page UI (#25)** PR #33 in review, addressing comments. Jennifer.

#### Testing / QA

- **Lint pipeline (#35)** PR #31 rebased and updated with ESLint + Prettier + Stylelint config. Angelo. Pending review.
- **Unit testing framework (#36)** ADR-0005 written (Vitest), framework installed and configured, dummy test passing, CI wired. PR #51 open. Yuval.
- **E2E testing framework (#37)** ADR-0004 written (Playwright), framework installed and configured, dummy smoke test, CI wired. PR #50 open. Yuval.
- **Visual QA pass (#43)** open for design review against `Design/screens/`. Pivoted from #38.

#### Documentation / Process

- **Changelog (#28)** updated with v0.1.0 covering all sprint 2 deliverables. PR #52 open. Yuval.
- **ADR-0003 (backend stack defer)** merged via PR #34 with TA sign-off from Omair.
- **ADR-0004 (Playwright for E2E)** and **ADR-0005 (Vitest for unit testing)** proposed.
- **Status check video** filmed Thursday 2026-05-21, link added to README.
- **Meeting templates tightened** with spec-mandated sections. PR #46 open. Yuval.

#### Backend

- **Cloudflare Worker (#26)** PR #49 open with health-check endpoint and CORS. Jordan.
- **AI prompt helper (#27)** pure JS string assembly in progress. Bowen. Network call still blocked on platform pick.

### What Did NOT Ship (and why)

- **Conjure page UI (#25)** still in review. Jennifer addressing PR #33 comments. Carry to sprint 4.
- **Lint pipeline (#35)** PR #31 has been rebased multiple times but not merged. Review needed. Carry to sprint 4.
- **Wiki pages (#29, #30)** still in progress. Koji and Alec working on them. Carry to sprint 4.
- **#26 serverless API full implementation** blocked on ADR-0003 ratification. The health-check scaffold is up but the AI proxy logic waits on the platform decision. Carry to sprint 4.

## Retrospective

### What Went Well

- **UI actually shipped to main.** Home page and template gallery both merged. For the first time, the deployed GitHub Pages site looks like a real product.
- **Testing infrastructure delivered.** Three separate PRs for lint, unit, and e2e. The split into sub-issues (#35, #36, #37) made ownership clear and unblocked parallel work.
- **ADR cadence is strong.** Five ADRs total now (0001 through 0005). The team is documenting decisions consistently.
- **Presentation video done on time.** Filmed Thursday 2026-05-21 with visible progress from every lane.
- **Standup cadence improved.** Three logged standups this week (05-19, 05-20, 05-21), hitting the target.

### What Didn't Go Well

- **PR review backlog.** Multiple PRs open at sprint end (#31, #33, #48, #49, #50, #51, #52). The 24h SLA is not being enforced consistently.
- **Backend still mostly blocked.** ADR-0003 defer was the right call but Jordan and Bowen have been in a holding pattern for two sprints. Need to unblock the platform decision at sprint 4 planning.
- **Wiki work (#29, #30) stalled.** Koji and Alec have made progress but neither has opened a PR. Needs a push.
- **Angelo's lint PR (#31) has been open for over a week.** Force-pushed multiple times, no merge. Blocking the full CI pipeline vision.

### What We'll Try Next Sprint

- **Unblock the backend.** Ratify ADR-0003 at sprint 4 planning and pick a concrete platform so Jordan and Bowen can ship real code.
- **PR review blitz at sprint start.** Dedicate the first day of sprint 4 to reviewing and merging all open PRs before starting new work.
- **Wiki PRs by mid-sprint.** Koji and Alec open draft PRs by Wednesday so reviewers have time.
- **Code review swap prep.** Clean up the repo, README, and docs before the swap weekend.

## Cross-team Review Feedback (when applicable)

Code review swap with another team scheduled for the weekend of 5/23 and 5/24. Feedback to be captured once received.

### Their feedback to us

- Pending.

### Our feedback to them

- Pending.

## Action Items (carry into Sprint 4)

- [ ] Merge all open PRs: #31 (lint), #33 (conjure), #48 (ImgFlip), #49 (Cloudflare), #50 (e2e), #51 (unit), #52 (changelog), #46 (meeting templates).
- [ ] Ratify ADR-0003 and pick the concrete backend platform (Cloudflare Pages Functions or Workers).
- [ ] Koji: open PR for wiki home page (#29) by mid-sprint.
- [ ] Alec: open PR for wiki coding standards (#30) by mid-sprint.
- [ ] Jennifer: finish Conjure page review comments and get #33 merged.
- [ ] Prep repo for cross-team code review swap.
- [ ] Sprint 4 planning tomorrow (2026-05-25).

## Evidence of Incorporation (from Sprint 2 retro)

- **"Shorter sprint scope"** — Sprint 3 focused on merging the UI PRs and testing infra rather than adding new features. Scope was more realistic.
- **"Testing infrastructure is a must-do"** — #36 and #37 both delivered with ADRs, framework installs, dummy tests, and CI wiring. #35 (lint) is in review.
- **"PRs open early, even as drafts"** — Home layout and gallery PRs were opened and reviewed within the sprint. Some PRs still came late but overall improvement.
- **"Three standups per week, logged"** — Hit the target this sprint (05-19, 05-20, 05-21).
