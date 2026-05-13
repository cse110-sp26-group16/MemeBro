# Sprint 2 Planning Meeting

- **Date:** 2026-05-11 (Monday)
- **Sprint:** 2 (Week 7)
- **Type:** Sprint Planning
- **Attendees:** Yuval, Jordan, Fariba, Jenny, Koji, Alec, Angelo
- **Note-taker:** Yuval Pesok
- **Facilitator:** Yuval Pesok

## Agenda

1. Sprint 1 carry-overs and current PR status
2. Sprint 2 goal
3. Scope (must-do, should-do, nice-to-have)
4. Cadence confirmation (standups, planning/retro, TA meeting)
5. TA meeting prep
6. Close and action items

## Discussion

### Sprint 1 Carry-overs

Status as of Tue 2026-05-12. PRs #12 and #16 merged Mon evening, PR #17 was opened overnight by Fariba.

| Issue # | Title                            | Status                                              | Action                                         |
| ------- | -------------------------------- | --------------------------------------------------- | ---------------------------------------------- |
| #1      | Draft Core Design Artifacts      | Done, PR #13 open                                   | Review and merge PR #13, then close issue      |
| #2      | Wireframe Main Mobile Designs    | Not started (nakazawak)                             | Carry, must-do (sprint 1's biggest miss)       |
| #3      | Wireframe Landing Page           | Shipped, PR #17 open                                | Review and merge PR #17, then close issue      |
| #4      | Versioning Protocol Setup        | Done (all AC met)                                   | Close issue                                    |
| #5      | CI/CD Pipeline Skeleton          | PR #14 open, Pages not yet enabled                  | Review and merge PR #14, enable Pages          |
| #7      | Prompt Engineering               | Closed, PR #16 merged 2026-05-11                    | None, already closed                           |
| #8      | AI Architecture Research         | Closed, PR #12 merged 2026-05-11                    | None, already closed                           |
| #10     | Baseline Code                    | Partial, only index.html on main                    | Carry, must-do (add style.css and app.js)      |
| #11     | Testing + Linting Infrastructure | Not started, unassigned, blocked on TA dep approval | Carry, assign owner, get TA dep approval first |

### MVP Skeleton Plan

The main build target for sprint 2 is the mobile-first MVP skeleton on github pages: upload button, text input, template picker, preview area. No AI integration yet, that comes after the skeleton works end to end.

### Sprint 1 Lessons Carried Forward

Sprint 1's biggest problem was three PRs sitting open all weekend without review. Sprint 2 adopts a 24h review SLA: anyone with an open PR pings the team in slack, team aims to review within a day.

The functional groups from sprint 1 (design, devops, AI, QA) stay as the task lanes. We are adding a lead per lane plus an overall project lead so that with 11 people every area has a clear owner. Roles are fixed for now but can swap mid quarter if someone wants to try a different lane.

## Sprint Goal

> Finish all the sprint 1 PRS, inclduding the wireframes and MVP page, create a mobile-first MVP skeleton that allows upload, text, and selection of template wiht no AI usage yet accessible by github pages.

## Scope (committed for this sprint)

- Merge PR #13, #14, #17 (closes issues #1, #3, #5).
- Enable github pages in repo settings so #14 actually deploys.
- Close issue #4 (versioning, all AC met).
- Finish #2 mobile wireframes (nakazawak).
- Finish #10 baseline code: add style.css and app.js to main.
- Build the MVP skeleton on github pages (mobile-first, upload + text input + template picker + preview area, no AI).
- Assign an owner for #11 testing and linting infra, bring the dep batch to the TA first.
- Add a PR template at `.github/PULL_REQUEST_TEMPLATE.md`.
- Turn on branch protection on main (require 1 PR review before merge).
- Start `docs/dependencies.md` for the TA batch approval list.
- ADR-0001: vanilla HTML / CSS / JS, no frameworks (MADR format under `docs/adr/`).

## Out of Scope (explicitly deferred)

- README rewrite. Deferred because we want something real to describe first.
- ADR-0002 (cloudflare pages vs github pages). Gated on the TA answer at this week's meeting.
- Any AI integration. Saved for sprint 3 after the no-AI skeleton works end to end.
- Splitting into frontend / backend sub-teams. Per the TA's earlier guidance, hold off until week 6 and 7 are cleared.

## Decisions

- Sprint 2 ends Sunday 2026-05-17.
- Standups are tues / wed / thurs. Tues and thurs in person after class (~6:20pm), wed zoom at 1pm.
- Sunday is sprint planning + retro, whole team.
- Weekly TA meeting is Wednesdays at 10:30. Team leads usually join, anyone is free to join.
- 24h PR review SLA going forward.
- Functional area leads: project lead, design lead, devops lead, AI lead, QA lead. Fixed for now, can swap mid quarter. Assign at this meeting and record in [`team-roster.md`](../../process/team-roster.md).
- No front-end / back-end split this sprint per the TA's earlier guidance.

## Action Items

- [ ] Push the `docs/sprint-1-process` branch and open a PR so the retro, templates, and cadence land on main. Yuval, Tue 5/12.
- [ ] Slack the team a 24h review ping for PR #13, #14, #17. Yuval, Tue 5/12.
- [ ] Close issue #4 on github (versioning, all AC met). Tue 5/12.
- [ ] Create the Sprint 2 milestone on github and attach the must-do issues. Tue 5/12.
- [ ] Assign owners for issues #10 (Baseline Code) and #11 (Testing + Linting Infrastructure) by EOD Tuesday so nothing is orphan.
- [ ] Assign the 5 lead roles (project, design, devops, AI, QA) at this meeting and record in `docs/process/team-roster.md`.
- [ ] Log today's standup as `docs/meetings/standups/standup-2026-05-12.md`. Tue 5/12.
- [ ] Post the 4 TA questions in slack as Wednesday's TA meeting agenda by Tuesday night.

## Next Up

- **Next standup:** Tuesday 2026-05-12 (in person after class) or Wednesday 2026-05-13 (Zoom 1pm) depending on when this meeting is held.
- **TA meeting:** Wednesday 2026-05-13 at 10:30.
- **Sprint review + retrospective:** Sunday 2026-05-17.
- **This sprint ends:** Sunday 2026-05-17.
