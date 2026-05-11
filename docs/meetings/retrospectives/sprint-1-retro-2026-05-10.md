# Sprint 1 Review + Retrospective

- **Date:** 2026-05-10 (Sunday)
- **Sprint:** 1 (Week 6 — design + prototyping sprint per course spec)
- **Attendees:** Full team
- **Facilitator:** _TODO_
- **Note-taker:** _TODO_

## Sprint Review

### Sprint Goal (recap)

From the Sprint 1 planning meeting on 2026-05-05: prove out the
**upload → text input → template → meme output** loop conceptually,
align the team on direction, and split the design / DevOps / AI / QA
work across the team via GitHub Issues.

Per the CSE 110 spec, Week 6 is specifically the **design and
prototyping sprint** — the deliverables the TA will gate on are
design artifacts (personas, user stories, wireframes), AI exploration,
and the baseline scaffolding for the project, not working features.

### Demo / What Shipped

<!--
  Fill in honestly. Link to the file, branch, PR, or screenshot for
  each item. If nothing shipped for a category, write "Not shipped"
  and move it into "What Did NOT Ship" below.
-->

- **Design** (issues #1, #2, #3):
  - _TODO — personas + user stories status_
  - _TODO — mobile wireframes status_
  - _TODO — landing page wireframe status_
- **DevOps** (issues #4, #5):
  - #4 Versioning Protocol Setup — ✅ done (commit format guide, SemVer
    guide, `.gitignore`, `CHANGELOG.md` placeholder, issue template).
    Acceptance criteria all met; closing this issue.
  - #5 CI/CD Pipeline Skeleton — _TODO status_
- **AI** (issues #7, #8):
  - _TODO — prompt engineering status_
  - _TODO — AI architecture research status_
- **QA** (issues #10, #11):
  - _TODO — baseline code status_
  - _TODO — testing + linting infra status_
- **Process / meta**:
  - Conventional Commits guide (`docs/COMMITFORMAT.md`).
  - SemVer guide (`docs/SemVerInfo.md`).
  - Task assignment issue template.
  - Functional labels configured (`design`, `devops`, `AI`, `QA`).
  - Sprint 1 planning meeting notes captured.
  - Meeting templates added for sprint planning, standups, retros,
    and TA meetings.

### What Did NOT Ship (and why)

<!--
  Be specific — vague "in progress" entries are worse than nothing.
  Each item should say WHY it didn't land and what changes for Sprint 2.
-->

- _TODO_ — _reason / carry-over plan_

## Retrospective

### What Went Well

- **Clear MVP direction agreed early.** The team aligned on the
  "functionality first, refinement after" approach during the planning
  meeting, so nobody is debating scope.
- **Process scaffolding landed.** Commit format, SemVer, `.gitignore`,
  issue template, and the label scheme are all in the repo. That's a
  big chunk of CSE 110's process requirements already satisfied.
- **Functional task split.** Splitting issues across `design`,
  `devops`, `AI`, and `QA` made it easy for people to pick work that
  matched their interest.
- **Migrated from Slack to GitHub Issues mid-sprint.** Recognized the
  audit-trail gap and corrected it inside the same sprint instead of
  letting it persist.

### What Didn't Go Well

- **Early task assignment happened in Slack with no audit trail.**
  Tasks were discussed and split over chat, then later mirrored into
  GitHub Issues. For the early discussion there is no record in the
  repo, which is exactly the kind of opacity the spec grades against.
- **Only 2 team meetings this sprint** (planning + 1 Zoom standup).
  The spec requires **≥ 3 standups per week** — we missed that target.
- **No pull requests opened all sprint.** Even small doc changes were
  committed directly. The team has not practiced the PR review workflow
  yet, which becomes mandatory at > 300 LoC changes.
- **No ADRs (Architectural Decision Records) yet** even though we made
  real technical decisions (vanilla-only stack constraint, deployment
  target implied, MVP scope locked).
- **No TA meeting captured** in `docs/meetings/ta/` yet.
- **No retrospective scheduled in advance.** This retro is happening
  because we noticed it was missing, not because the team's cadence
  produced it.

### What We'll Try Next Sprint

These become **action items**, owned, in the next section.

- All task assignment goes through **GitHub Issues from the start of
  Sprint 2**. Slack is fine for discussion but the assignment itself
  lands as an issue with assignee and label before work begins.
- Standups **3 times per week on a fixed cadence**: Mon / Wed / Fri.
  Mon and Fri can be Slack-async; Wed is a quick Zoom sync. Each
  standup gets its own file in `docs/meetings/standups/`.
- **Every meeting produces a file** in `docs/meetings/...` using the
  templates. No file = it didn't happen.
- **One person owns notes per meeting**, rotating each meeting (not
  each sprint).
- **First PR opened by mid-Sprint 2.** Even the doc branches go via PR
  from now on so we build a review trail.
- **At least one ADR per major technical decision** (vanilla stack,
  deployment target, AI provider, testing tooling). MADR format.
- **Roles assigned at Sprint 2 planning**: Scrum Master, GitHub
  Wrangler, TA Liaison, Tech Lead, rotating Note-taker.
- **Retro + sprint planning scheduled on the calendar** for every
  Sunday from here on, so we never have to "remember" to do them.

## Action Items (carry into Sprint 2)

- [ ] Each Sprint 1 issue owner posts a status comment on their issue
      (done / not done / carry over) — _due before Sprint 2 planning_.
- [ ] Close issue #4 (Versioning Protocol Setup) — all AC met.
      _Owner: GitHub Wrangler_.
- [ ] Create **Sprint 2** milestone and assign carry-over issues to it.
      _Owner: GitHub Wrangler_.
- [ ] Schedule recurring meetings on calendar: Sun planning + retro,
      Mon / Wed / Fri standups, weekly TA meeting.
      _Owner: Scrum Master_.
- [ ] Add `docs/process/team-cadence.md` and link it from the README.
      _Owner: Tech Lead_.
- [ ] Draft **ADR-0001** ("Use vanilla HTML / CSS / JS — no
      frameworks") in MADR format. _Owner: Tech Lead_.
- [ ] Draft **ADR-0002** ("Deployment target: Cloudflare Pages vs
      GitHub Pages") and bring it to the TA meeting for sign-off.
      _Owner: TA Liaison + Tech Lead_.
- [ ] Open a PR template at `.github/PULL_REQUEST_TEMPLATE.md`.
      _Owner: GitHub Wrangler_.
- [ ] Open the **first PR** by merging `docs/sprint-1-process` →
      `main`. _Owner: whoever opens this branch's PR_.
- [ ] Bring the **dependency batch approval** request to the next TA
      meeting (ESLint, Prettier, Jest, Playwright, AI SDK).
      _Owner: TA Liaison_.

## Evidence of Incorporation (from previous retro)

This is the first retrospective of the project, so there is no prior
retro to incorporate from. Starting next sprint, this section will
list how the action items above were addressed (or why they weren't).
