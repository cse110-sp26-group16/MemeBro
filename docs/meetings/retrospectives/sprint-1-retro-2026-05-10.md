# Sprint 1 Review + Retrospective

- **Date:** 2026-05-10 (Sunday)
- **Sprint:** 1 (Week 6 — design + prototyping sprint per course spec)
- **Attendees:** Full team
- **Facilitator:** Yuval Pesok
- **Note-taker:** Yuval Pesok

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

Substantial exploration and design work landed this sprint, mostly
across short-lived feature branches with PRs opened but not yet
merged.

#### Design (issues #1, #2, #3)

- **#1 Core Design Artifacts — shipped** (Jennifer).
  - `research/design-brief.md` — problem statement, mobile-first +
    speed framing.
  - `research/personas.md` — three personas (Alex the rapid-fire
    reactor, Marcus the OG meme enthusiast, plus one more).
  - `research/user-stories.md` — user stories grouped by persona,
    explicitly addressing the < 5-minute speed requirement.
  - Branch: `core-design-artifacts` — open in **PR #13**, awaiting
    review.
- **#2 Wireframe Main Mobile Designs — not started** (nakazawak).
  No commits and no comment on the issue.
- **#3 Wireframe Landing Page — not started** (Fariba-Tokhi).
  - Want more understand of the user flow of the app, will help design it better.
  - Should the focus be on AI generate it or if based off a prompt
    - Want a place where users can add an input, pick a template

#### DevOps (issues #4, #5)

- **#4 Versioning Protocol Setup — done** (Flimgees). Commit format
  guide (`docs/COMMITFORMAT.md`), SemVer guide (`docs/SemVerInfo.md`),
  `.gitignore`, `CHANGELOG.md` placeholder, and the issue template
  are all in the repo. All acceptance criteria met. **Close this
  issue.**
- **#5 CI/CD Pipeline Skeleton — in flight** (Alec). GitHub Actions
  workflow committed at `.github/workflows/ci-cd.yml`. Live
  deployment pending Pages being enabled on the repo. Open in
  **PR #14**. Also made a index.html to allow for a github pagEs to be delpoyed.

#### AI (issues #7, #8)

- **#7 Prompt Engineering — shipped** (Endless1010, Asespene).
  Five prompt templates (`research/prompts/template-a..e.md`), a
  spike doc (`research/prompt-engineering-spike.md`), and an
  edge-case results doc on the `prompt-engineering` branch. **Not
  yet opened as a PR.**
- **#8 AI Architecture Research — substantial** (Asespene). Working
  AI face-swap prototype on `research/ai-prototype-issue` (also on
  `ai-meme-prototype-result1`): `test-meme.js` script, generated
  outputs for famous meme templates (change-my-mind, drake,
  distracted-boyfriend, two-buttons, one-does-not-simply), a
  guardrail rejection test for a mean prompt, and `AI-prompt-testing.md`
  notes. Open in **PR #12**. Asespene noted the markdown writeup is
  still being finished.

#### QA (issues #10, #11)

- **#10 Baseline Code — partial.** `index.html` (Hello World) is
  on `main` (merged via PR #15). No `style.css` or `app.js` yet, and
  the page itself is a placeholder.
- **#11 Testing + Linting Infrastructure — not started.**
  Unassigned, no movement. Blocked partly on TA approval for dev
  dependencies (ESLint, Prettier, Jest, Playwright).

#### Process / meta (not tied to an specific issue)

- **4 PRs opened this sprint** (#12, #13, #14, #15). PR #15 merged;
  #12 / #13 / #14 still open.
- Conventional Commits guide, SemVer guide, `.gitignore`, issue
  template, and functional labels (`design`, `devops`, `AI`, `QA`)
  all in `main`.
- A `docs/sprint-1-process` branch was started with Sprint 1
  planning notes, meeting templates (sprint planning, standup,
  retro, TA meeting), this retrospective, and the team-cadence
  doc. Not yet PR'd.

### What Did NOT Ship (and why)

- **#2 Wireframe Main Mobile Designs.** No comments and no commits
  from the assignee. Without wireframes the implementation team has
  nothing concrete to build against. **Carry to Sprint 2 as a
  Must-do.**
- **#3 Wireframe Landing Page.** Empty branch, no commits. **Carry
  to Sprint 2 as a Must-do.**
- **#11 Testing + Linting Infrastructure.** Unassigned, no movement.
  Partly blocked on TA approval for dev dependencies. **Carry to
  Sprint 2 with an explicit assignee and bring the dep request to
  the TA meeting.**
- **PR reviews.** Three of the four PRs opened this sprint (#12,
  #13, #14) are still open and unmerged. The work was done but the
  review loop didn't close — they sat overnight without anyone
  picking them up. **Carry to Sprint 2: review-within-24h rule.**
- **`#10 Baseline Code` is only partial.** Only `index.html` exists;
  `style.css` and `app.js` are still owed.

## Retrospective

### What Went Well

- **Substantial design and exploration shipped.** Design brief,
  three personas, user stories, five tested prompt templates, and a
  working AI face-swap prototype with guardrail tests. Real
  engagement with the problem space, not just process scaffolding.
- **PR practice actually started this sprint.** Four PRs opened
  (#12, #13, #14, #15). That gets us past "we've never used PRs"
  before any > 300 LoC changes hit, which is a hard CSE 110
  requirement.
- **CI/CD workflow file written** even though it's not deployed
  yet. Sprint 2 starts with that already drafted instead of from
  zero.
- **Process scaffolding is solid in `main`.** Conventional Commits,
  SemVer, `.gitignore`, issue template, and labels are all merged.
  A big chunk of CSE 110's process requirements is already off the
  list.
- **Functional task split** (`design` / `devops` / `AI` / `QA`)
  gave everyone a clear lane and matched the spec's expectations.
- **AI prototype validated the PG-13 guardrail.** The "mean prompt"
  rejection test directly satisfies the acceptance criterion from
  issue #7. That's not just exploration — it's evidence we can
  hit a spec constraint.

### What Didn't Go Well

- **Only 2 team meetings this sprint** (planning + 1 Zoom standup).
  The spec requires ≥ 3 standups per week — we missed that target.
- **Three of four PRs sat open without review.** PRs #12, #13, #14
  were opened but didn't get reviewed or merged before the sprint
  ended. The work happened in isolation rather than feeding back
  into `main`.
- **Two design issues had zero movement** (#2 wireframes — mobile,
  #3 wireframes — landing). Both have assignees and both are
  Week-6-gate items, which made this the most important sprint to
  hit them.
- **Early task assignment happened in Slack** with no GitHub audit
  trail until later. Hard for the TA to grade work that doesn't
  trace back to an issue.
- **No ADRs** despite making real technical decisions (vanilla-only
  stack, AI prototype approach, deployment direction).
- **No TA meeting captured** in `docs/meetings/ta/` yet.
- **No retro scheduled in advance.** This retro exists because we
  noticed it was missing — Sprint 2 needs the retro on the calendar
  from day one.

### What We'll Try Next Sprint

These map directly to the action items below.

- **Standups Mon / Wed / Fri** on a fixed cadence. Mon and Fri can
  be Slack async; Wed is a quick Zoom sync. Each standup → a file
  in `docs/meetings/standups/`.
- **PR review SLA: 24 hours.** Anyone with an open PR pings the team
  in Slack; team aims to review within a day. No PR sits open for a
  whole sprint again.
- **All task assignment via GitHub Issues from the start.** Slack
  is fine for discussion; assignment itself must land on the issue
  with the right label.
- **Every meeting produces a file** under `docs/meetings/...` using
  the templates. No file = it didn't happen.
- **Roles assigned at Sprint 2 planning** and rotated per sprint:
  Scrum Master, GitHub Wrangler, Tech Lead, TA Liaison.
- **ADRs for major decisions** (vanilla stack, deployment, AI
  provider). MADR format under `docs/adr/`.
- **Retro + planning on the calendar** every Sunday going forward.

## Action Items (carry into Sprint 2)

- [x] **Merge PRs #12, #13, #14** within 24h of Sprint 2 kickoff so
      design + AI + CI work lands on `main`.
- [x] **Open a PR for the `prompt-engineering` branch** (issue #7
      work) — not yet PR'd.
- [x] **Close issue #4** (Versioning Protocol Setup) — all AC met.
- [x] **Finish wireframes #2 and #3** (carry-over). _Owners:
      nakazawak (#2) and Fariba-Tokhi (#3)._
- [x] **Assign an owner for #11** (Testing + Linting Infrastructure)
      and bring the dep batch to the TA. _Owner: Scrum Master to
      assign._
- [x] **Complete #10 baseline code** (`style.css` + `app.js`).
- [x] **Create the Sprint 2 milestone** on GitHub and tag the
      carry-overs.
- [x] **Open a PR for `docs/sprint-1-process`** → `main` (includes
      planning notes, meeting templates, this retro, team cadence,
      Sprint 2 planning script). _Owner: whoever runs the planning
      meeting._
- [x] **Schedule recurring meetings on calendar**: Sun planning +
      retro, Mon / Wed / Fri standups, weekly TA meeting.
- [x] **Draft ADR-0001** ("Use vanilla HTML / CSS / JS — no
      frameworks") in MADR format.
- [x] **Draft ADR-0002** ("Deployment target: Cloudflare Pages vs
      GitHub Pages") and bring it to the TA meeting for sign-off.
- [x] **Open a PR template** at `.github/PULL_REQUEST_TEMPLATE.md`.
- [x] **Enable branch protection on `main`** (require PR review).
- [x] **Bring the dependency batch-approval request** to the TA
      meeting (ESLint, Prettier, Jest, Playwright, AI SDK).

## Evidence of Incorporation (from previous retro)

This is the first retrospective of the project, so there is no prior
retro to incorporate from. Starting next sprint, this section will
list how the action items above were addressed (or why they weren't).
