# Sprint 2 Planning Meeting

- **Date:** 2026-05-13 (Wednesday)
- **Sprint:** 2 (Week 7)
- **Type:** Sprint Planning (scaffold drafted 2026-05-11, team alignment held during the wed 1pm zoom standup)
- **Attendees:** Yuval, Jordan, Alec, Roy, Harvey, Fariba, Jennifer, Koji
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

### Sprint 2 Direction Shift (2026-05-13)

At the 10:30 TA meeting on 5/13, Omair gave positive feedback on the design overall but wants the MVP to offer two flows side by side:

- **Quick:** pick a template from a library, edit the text, done. Image flip style.
- **Slow:** describe what you want to an AI and generate a custom meme.

Both live in the same product. The quick flow lands in the MVP this sprint, AI generation comes after. Jordan also noted that image flip shows a popular templates list on the home screen so users don't have to search to start, we'll mirror that on the landing page.

Omair also greenlit the subteam split for sprint 2. He had previously asked us to hold the front / back split until weeks 6 and 7 were cleared, the research and design phases are now done and the build needs parallel lanes, so he approved it.

In the wed 1pm zoom standup that followed (which doubled as this planning session), the team aligned on:

- Splitting into 4 working groups of roughly 2 people each: frontend, backend, testing/docs/PR review, design. Github issues for sprint 2 going up today so people can self-select.
- Backend group's first move: pick an AI model. Open source / free preferred since we don't need anything huge. Replicate is the leading candidate, Angelo's research already uses it. After model selection, scaffold the functions that hit the model.
- Backend group also picks up the image flip API for the top 100 meme templates (Jordan identified it) as the data source for the quick flow.
- Frontend group's first move: build the core UI from the existing design, mobile-first.
- Design group's first move: update the wireframes to include the quick flow (search + templates + text edit) plus a popular templates list on the landing page.
- Testing/docs/PR group's first move: own the AGENTS.md at repo root (code style and conventions for agent-driven code), plus shepherd open PRs through the 24h review SLA.

Two upcoming external deadlines from Omair:

- Presentation video due Thursday 2026-05-21. Doesn't need a working prototype, but each lane needs something to show.
- Code review swap with another MemBro team the weekend after the presentation (5/23 and 5/24). We'll review their repo, they'll review ours.

Omair said he'd post written answers to the 4 open dock questions later today after midterm grading wraps.

### Sprint 1 Carry-over Check (in the 5/13 standup)

- Fariba: design work done, walked the team through the current Figma, open to edits.
- Koji: no update on the mobile wireframes (#2) in the standup, the design group will pick this up under the new structure.
- No one else flagged outstanding sprint 1 work.

## Sprint Goal

> Finish all the sprint 1 PRS, inclduding the wireframes and MVP page, create a mobile-first MVP skeleton that allows upload, text, and selection of template wiht no AI usage yet accessible by github pages.

## Scope (committed for this sprint)

- Merge PR #13, #14, #17 (closes issues #1, #3, #5).
- Enable github pages in repo settings so #14 actually deploys.
- Close issue #4 (versioning, all AC met).
- Finish #2 mobile wireframes, now reshaped to include the quick flow (template search + text edit) and a popular templates list on the landing page. Owned by the design group (Fariba, Koji).
- Finish #10 baseline code: add style.css and app.js to main.
- Build the MVP skeleton on github pages (mobile-first, upload + text input + template picker + preview area, no AI-generated output yet, but wired to the image flip top 100 templates API for the quick-meme path).
- Assign an owner for #11 testing and linting infra, bring the dep batch to the TA first.
- Add a PR template at `.github/PULL_REQUEST_TEMPLATE.md`.
- Turn on branch protection on main (require 1 PR review before merge).
- Start `docs/dependencies.md` for the TA batch approval list.
- ADR-0001: vanilla HTML / CSS / JS, no frameworks (MADR format under `docs/adr/`).
- Add `AGENTS.md` at the repo root with code style and conventions for any AI agents writing code on the repo.
- Stand up 4 working groups (frontend, backend, testing/docs/PR review, design) and have each member self-select via the sprint 2 github issues.
- Backend group: pick the AI model (start with Replicate research) and scaffold the functions that hit it. No user-facing AI in the MVP yet, just the integration plumbing.
- Backend group: wire up the image flip top 100 templates API as the data source for the search flow.
- Frontend group: build the core UI off the design once the lane is staffed.
- Prepare a presentation video for Thursday 2026-05-21. Doesn't need a working prototype, but each lane brings something to show.

## Out of Scope (explicitly deferred)

- README rewrite. Deferred because we want something real to describe first.
- ADR-0002 (cloudflare pages vs github pages). Gated on the TA answer at this week's meeting.
- User-facing AI generation in the shipped MVP. Saved for sprint 3 after the no-AI skeleton works end to end. Backend group can do model research and integration scaffolding in parallel this sprint, just not user-facing.

## Decisions

- Sprint 2 ends Sunday 2026-05-17.
- Standups are tues / wed / thurs. Tues and thurs in person after class (~6:20pm), wed zoom at 1pm.
- Sunday is sprint planning + retro, whole team.
- Weekly TA meeting is Wednesdays at 10:30. Team leads usually join, anyone is free to join.
- 24h PR review SLA going forward.
- Functional area leads: project lead, design lead, devops lead, AI lead, QA lead. Fixed for now, can swap mid quarter. Assign at this meeting and record in [`team-roster.md`](../../process/team-roster.md).
- 4 working groups of ~2 people each: frontend, backend, testing/docs/PR review, design. Members self-select via sprint 2 github issues. Omair approved the split at the 5/13 TA meeting (research and design phases are done).
- MVP offers two flows: **quick** (pick template, edit text, image flip style) and **slow** (describe to AI, generate custom meme). Both live in the same product. Quick flow ships this sprint, AI generation comes after.
- Mobile wireframes get an update to add the quick flow (template search + text edit) and a popular templates list on the landing page.
- Cross-team code review swap with another MemBro group on the weekend of 5/23 and 5/24, per Omair.
- AI model direction: open source / free, Replicate is the leading candidate.
- AGENTS.md lives at the repo root and defines code style / conventions for agent-driven code.

## Action Items

- [x] Push the `docs/sprint-1-process` branch and open a PR so the retro, templates, and cadence land on main. Yuval, Tue 5/12.
- [x] Slack the team a 24h review ping for PR #13, #14, #17. Yuval, Tue 5/12.
- [x] Close issue #4 on github (versioning, all AC met). Tue 5/12.
- [x] Create the Sprint 2 milestone on github and attach the must-do issues. Tue 5/12.
- [x] Assign owners for issues #10 (Baseline Code) and #11 (Testing + Linting Infrastructure) by EOD Tuesday so nothing is orphan.
- [x] Assign the 5 lead roles (project, design, devops, AI, QA) at this meeting and record in `docs/process/team-roster.md`.
- [x] Log today's standup as `docs/meetings/standups/standup-2026-05-12.md`. Tue 5/12.
- [x] Post the 4 TA questions in slack as Wednesday's TA meeting agenda by Tuesday night.
- [x] Open sprint 2 github issues for each working group (frontend, backend, testing/docs/PR, design) so members self-select. Yuval, Wed 5/13.
- [x] Each team member: pick a group via the sprint 2 issues by Fri 5/15.
- [x] Add `AGENTS.md` at repo root with code style and conventions. Yuval / testing-docs group.
- [x] Update mobile wireframes for the quick flow (template search + text edit) and the popular templates list on the landing page. Fariba, Koji.
- [ ] Coordinate the code review swap with another MemBro team for the weekend of 5/23 and 5/24. Yuval.
- [x] AI model research (start with Replicate) and pick a direction. Backend group.
- [ ] Wire image flip top 100 templates API as the data source for the quick-meme search flow. Backend group.
- [x] Start the core UI build off the design. Frontend group.
- [x] Prep something to show for the Thursday 2026-05-21 presentation video. Each lane.
- [x] Check the dock for Omair's answers once midterm grading wraps. Yuval, Jordan, Wed 5/13.
- [x] Try to schedule an in-person sprint kickoff for next week, possibly the library (per Fariba's ask). Yuval.

## Next Up

- **Next standup:** Thursday 2026-05-14 in person after class (~6:20pm).
- **Sprint review + retrospective:** Sunday 2026-05-17.
- **This sprint ends:** Sunday 2026-05-17.
- **Presentation video due:** Thursday 2026-05-21.
- **Cross-team code review swap:** weekend of 5/23 and 5/24.
