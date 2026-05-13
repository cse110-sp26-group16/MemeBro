# Team Cadence and Process

The single source of truth for how MemeBro's team works each week:
when we meet, where notes live, who owns what, and the process rules
we follow for branching, PRs, and decisions.

This document exists to satisfy the **process > product** principle
from the CSE 110 spec: the way we work is what we're graded on.

---

## Weekly Meeting Schedule

| Day                            | Event                                                               | Format                      | Time           | Who attends                                |
| ------------------------------ | ------------------------------------------------------------------- | --------------------------- | -------------- | ------------------------------------------ |
| **Sunday**                     | Sprint Retrospective (prior sprint) + Sprint Planning (next sprint) | Zoom or in-person           | ~45–60 min     | Whole team (required)                      |
| **Tuesday**                    | Standup #1                                                          | In person after class       | ~10 min, 6:20pm | Whole team                                 |
| **Wednesday**                  | TA Meeting                                                          | Zoom or in-person           | 10:30 am       | Team leads usually, anyone welcome, with TA |
| **Wednesday**                  | Standup #2                                                          | Zoom                        | 1:00 pm        | Whole team                                 |
| **Thursday**                   | Standup #3                                                          | In person after class       | ~10 min, 6:20pm | Whole team                                 |
| **Once before end of quarter** | Prof Meeting                                                        | Whoever can attend          | ~20 min        | ≥ 2 team members + Prof                    |

**Rule:** every meeting produces a Markdown file using the matching
template in `docs/meetings/templates/`. **No file = it didn't happen**
for grading purposes.

### Standup Format (the only 3 questions)

Each person answers, in order:

1. **Did** — what you completed since the last standup.
2. **Doing** — what you're working on before the next standup.
3. **Blockers** — anything stopping you (none is a valid answer).

Standups are **not** for design discussions, scope changes, or deep
debates. If a topic needs more than 60 seconds, take it offline and
either book a separate sync or raise it at Sunday planning.

---

## Folder Layout for Meeting Notes

```text
docs/meetings/
├── templates/                   ← copy these, don't edit in place
│   ├── sprint-planning.md
│   ├── standup.md
│   ├── sprint-review-retrospective.md
│   └── ta-meeting.md
├── sprint-planning/
│   └── sprint-<N>-planning-YYYY-MM-DD.md
├── standups/
│   └── standup-YYYY-MM-DD.md
├── retrospectives/
│   └── sprint-<N>-retro-YYYY-MM-DD.md
├── ta/
│   └── ta-meeting-YYYY-MM-DD.md
└── prof/
    └── prof-meeting-YYYY-MM-DD.md
```

Always use **`YYYY-MM-DD`** in filenames so they sort chronologically.

---

## Roles

The team is organized around five lead roles: one per functional lane
plus a project lead overall. Roles are fixed for now but can swap mid
quarter if someone wants to try a different lane. Lead assignments live
in [`team-roster.md`](./team-roster.md).

| Role             | Owns                                                                                                                 |
| ---------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Project Lead** | Overall facilitator. Schedules meetings, runs sprint planning and retros, makes sure standups happen and get a file. |
| **Design Lead**  | Wireframes, personas, user stories, UX flow.                                                                         |
| **DevOps Lead**  | CI/CD, deployment, github pages, branch protection, repo health.                                                     |
| **AI Lead**      | AI integration, prompts, guardrails, anything model facing.                                                          |
| **QA Lead**      | Testing infrastructure, linting, baseline code health, e2e tests.                                                    |

In addition, **note-taker** rotates per meeting (not per sprint).
Whoever volunteers to write up a given meeting is the note-taker for
that meeting only.

---

## Process Rules

These are non-negotiable for the project:

1. **All work is captured in GitHub.** Planning, meeting notes, tests,
   code, and documentation all live in this repo.
2. **All task assignment happens via GitHub Issues.** Slack is fine
   for discussion, but the assignment itself must land as an issue
   with an owner and label _before_ work begins.
3. **Branching.** Use feature branches off `main`. Branch names follow
   `<type>/<short-description>` (e.g., `feat/upload-screen`,
   `docs/sprint-2-process`). Type matches the Conventional Commit
   types in `docs/COMMITFORMAT.md`.
4. **Pull Requests.** Any change > 300 lines of code (LoC) must go
   through a PR with review by another teammate. We also use PRs for
   smaller doc / process changes so the team builds the review trail.
5. **Commits.** Follow Conventional Commits (`docs/COMMITFORMAT.md`).
6. **Versioning.** SemVer (`docs/SemVerInfo.md`). Update
   `CHANGELOG.md` as part of any user-visible change.
7. **Technical decisions.** Any major decision (stack, deployment
   target, AI provider, testing tool, library adoption) must land as
   an ADR in MADR format under `docs/adr/`.
8. **Dependencies.** New dependencies require TA approval. Batch
   requests when possible. Track approvals in
   `docs/dependencies.md`.
9. **AI usage.** If GenAI is used to produce work, expose it in the
   PR description or relevant docs and discuss it.
10. **Testing.** Unit and E2E tests are demonstrated early and grown
    over the project — not bolted on at the end.

---

## CSE 110 Spec Coverage Cheat Sheet

This cadence directly satisfies these required artifacts:

- Sprint planning meeting before each sprint — Sunday.
- Standups ≥ 3× per week — Tue / Wed / Thu.
- Sprint review + retrospective ≥ 2× this quarter — every Sunday
  alternating sprints (we'll easily exceed 2).
- Weekly TA meeting captured.
- ≥ 1 Prof meeting before end of quarter (book early — office
  hours fill up).
- All work captured in GitHub incrementally.
- PR path for changes > 300 LoC, reviewed by a teammate.
- Conventional Commits + SemVer + `CHANGELOG.md`.
- ADRs in MADR format for major decisions.
- Branching demonstrated continuously.

---

## When This Document Changes

Update this file whenever the team agrees to a process change in a
retrospective. The change should land via a PR so the team explicitly
ratifies it.
