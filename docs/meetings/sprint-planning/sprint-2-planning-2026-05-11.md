# Sprint 2 Planning Meeting

<!--
  THIS IS A WORKING DOC — fill it in LIVE during the meeting.
  Read the [PROMPT] lines out loud. Fill the [FILL] slots with what
  the team says. Check the [DECIDE] checkboxes when each output is
  locked. Save and commit this file right after the meeting.
-->

- **Date:** 2026-05-11 (Monday)
- **Sprint:** 2 (Week 7)
- **Type:** Sprint 2 Planning (follows Sprint 1 retrospective)
- **Attendees:** _[FILL — list everyone present]_
- **Note-taker:** _[FILL — not the facilitator]_
- **Facilitator:** _[FILL]_

---

## Sprint 1 Retro Recap (skip if retro already merged)

If the Sprint 1 retro doc is still open, finish it here first. Otherwise
skip straight to "Sprint 2 Goal" below.

- Link to retro:
  [`sprint-1-retro-2026-05-10.md`](../retrospectives/sprint-1-retro-2026-05-10.md)

---

## Part 1 — Sprint 2 Goal (5 min)

**[PROMPT]** *"In one sentence — what does the end of next Sunday look
like if this sprint goes well?"*

**[FILL] Sprint 2 Goal:**

> _Type the agreed one-sentence goal here. Example:
> "Land all carry-over design artifacts (personas, wireframes) and
> open the first implementation PR with the vanilla HTML/CSS/JS
> skeleton."_

**[DECIDE]**

- [ ] Goal is one sentence
- [ ] Goal is achievable in one week
- [ ] Everyone agreed (no silent "ummm" — ask each person directly)

---

## Part 2 — Sprint 2 Scope (10 min)

Open the GitHub issues board. Go through each open issue and decide:
**carry over to Sprint 2 / new issue needed / backlog / close**.

### Carry-overs from Sprint 1

| Issue # | Title | Status | Action |
| --- | --- | --- | --- |
| #1 | Draft Core Design Artifacts | _[FILL — done / partial / not started]_ | _[carry / close / backlog]_ |
| #2 | Wireframe Main Mobile Designs | _[FILL]_ | _[carry / close / backlog]_ |
| #3 | Wireframe Landing Page | _[FILL]_ | _[carry / close / backlog]_ |
| #4 | Versioning Protocol Setup | ✅ Done (all AC met) | **Close** |
| #5 | CI/CD Pipeline Skeleton | _[FILL]_ | _[carry / close / backlog]_ |
| #7 | Prompt Engineering | _[FILL]_ | _[carry / close / backlog]_ |
| #8 | AI Architecture Research | _[FILL]_ | _[carry / close / backlog]_ |
| #10 | Baseline Code | _[FILL]_ | _[carry / close / backlog]_ |
| #11 | Testing + Linting Infrastructure | _[FILL]_ | _[carry / close / backlog]_ |

### New issues to create for Sprint 2

Suggested — adapt to what came up in the retro:

- [ ] **ADR-0001** — "Use vanilla HTML / CSS / JS — no frameworks" (MADR format, `docs/adr/0001-vanilla-stack.md`)
- [ ] **ADR-0002** — "Deployment target: Cloudflare Pages vs GitHub Pages" (gated on TA answer)
- [ ] **README rewrite** — replace the one-line placeholder with real project info
- [ ] **PR template** — add `.github/PULL_REQUEST_TEMPLATE.md`
- [ ] **Branch protection on `main`** — require 1 PR review before merge
- [ ] **`docs/dependencies.md`** — batch list of deps to request from TA (ESLint, Prettier, Jest, Playwright, AI SDK)
- [ ] _[FILL — anything else the team wants]_

### Tiered commitment (be honest about capacity)

Move issues into tiers so the team commits realistically.

**Must-do (sprint fails if these don't land):**

- _[FILL — paste issue numbers + titles]_

**Should-do (we want these but the must-dos come first):**

- _[FILL]_

**Nice-to-have (only if we finish everything else):**

- _[FILL]_

**[DECIDE]**

- [ ] Every issue in "Must-do" has an assignee (no orphan issues)
- [ ] The Sprint 2 milestone on GitHub is populated with the Must-do + Should-do issues
- [ ] "Nice-to-have" items stay in the backlog without a milestone

---

## Part 3 — Roles (5 min)

Each role rotates per sprint. Read the descriptions from
[`docs/process/team-cadence.md`](../../process/team-cadence.md) if anyone
asks what a role does.

**[PROMPT]** *"Four roles for Sprint 2. They rotate so this isn't
permanent. Who wants Scrum Master?"* — repeat per role.

| Role | Sprint 2 Owner |
| --- | --- |
| **Scrum Master** | _[FILL]_ |
| **GitHub Wrangler** | _[FILL]_ |
| **Tech Lead** | _[FILL]_ |
| **TA Liaison** | _[FILL]_ |

**[DECIDE]**

- [ ] Each role has exactly one owner
- [ ] No one person has more than one role (unless team agreed and
      it's documented why)

---

## Part 4 — Cadence Buy-in (3 min)

Pull up [`docs/process/team-cadence.md`](../../process/team-cadence.md)
and share the screen.

**[PROMPT]** *"This is the proposed cadence. Standups Monday, Wednesday,
Friday. Sunday is planning + retro. Weekly TA meeting. Does this work
for everyone? Any amendments?"*

**[FILL] Amendments (if any):**

- _e.g., "Move Wed standup to Thursday because of class conflict"_

**[DECIDE]**

- [ ] Team agreed on Mon / Wed / Fri standups
- [ ] Team agreed on Sunday planning + retro
- [ ] Team agreed on weekly TA meeting
- [ ] Any amendments are recorded above

---

## Part 5 — TA Meeting Prep (5 min)

**[PROMPT]** *"We need to talk to Omair this week. Four questions to
bring. Who can join the meeting?"*

**Questions for the TA:**

1. Did our Sprint 1 design+prototyping clear the Week 6 gate, or do we
   need to redo design+prototyping this week?
2. Can we get batch approval for our tooling deps (ESLint, Prettier,
   Jest, Playwright, an AI SDK)?
3. Cloudflare Pages vs GitHub Pages — any preference given the AI
   proxy need?
4. When is it OK to split into front-end / back-end sub-teams?

**[FILL]**

- **TA meeting day/time:** _[FILL]_
- **Going to TA meeting:** _[FILL — 2+ team members]_

**[DECIDE]**

- [ ] TA meeting is on the calendar
- [ ] Attendees are named
- [ ] TA Liaison will post the agenda in Slack ≥ 24h before the meeting

---

## Part 6 — Close (3 min)

**[PROMPT]** *"Recap before we end — Sprint 2 goal is [X], we
committed to [N] must-do issues, [role owners], first standup is
[when], TA meeting is [when]. Anything else?"*

**[FILL] Anything raised at the close:**

- _e.g., "Reminder to add new deps to docs/dependencies.md not the
  repo directly"_

---

## Action Items (carried into Sprint 2)

Compiled from the discussion above — these are the "homework" everyone
walks away with.

- [ ] _[FILL — action]_ — _[FILL — owner]_ — _[due date]_
- [ ] _[FILL]_ — _[FILL]_ — _[date]_
- [ ] _[FILL]_ — _[FILL]_ — _[date]_

### Standing action items (don't forget these)

- [ ] **Scrum Master** — schedules recurring calendar invites for
      Mon/Wed/Fri standups + Sunday planning/retro by Tuesday EOD.
- [ ] **GitHub Wrangler** — creates the Sprint 2 milestone today,
      adds the PR template, enables branch protection by Tuesday EOD.
- [ ] **Tech Lead** — drafts ADR-0001 (vanilla stack) by Wednesday
      standup; starts `docs/dependencies.md` for TA approval batch.
- [ ] **TA Liaison** — books the TA meeting; posts the 4 questions
      in Slack as the agenda ≥ 24h before.

---

## Next Up

- **Next standup:** Wednesday 2026-05-13 — Zoom or async Slack
- **Next planning + retro:** Sunday 2026-05-17 — whole team
- **This sprint ends:** Sunday 2026-05-17
