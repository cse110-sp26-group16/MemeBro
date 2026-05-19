# TA Meeting, 2026-05-13

- **Date:** 2026-05-13 (Wednesday) at 10:30
- **TA:** Omair Qazi
- **Attendees from team:** Yuval, Jordan
- **Sprint:** 2

## Agenda

1. Sprint 2 plan and team structure
2. Design walkthrough and feedback
3. Upcoming presentation deadline and code review swap
4. Open process questions on the dock

## Discussion

### Team structure

Omair recommended splitting the team into subteams for sprint 2 (frontend, backend, etc.) now that the research and design phases are done and the build needs parallel lanes. This greenlights the sub-team split he had previously asked us to hold on, the gate was "after weeks 6 and 7 are cleared" and we're effectively there.

### Design feedback

Omair liked the overall direction. The main note: the current design only supports AI generation, real users need a quick path too. He wants the app to offer two flows side by side:

- **Quick:** pick a meme template from a library, edit the text, done. Image flip style.
- **Slow:** describe what you want to an AI and have it generate a custom meme.

Both live in the same product. The MVP this sprint needs the quick path even though the AI generation work comes after.

### Presentation and code review swap

- Presentation video is due next Thursday (2026-05-21). Every team presents what they have so far. Doesn't need a fully working prototype, but each lane brings something to show.
- The weekend after the presentation, teams swap code reviews with other MemBro groups. We'll review another team's repo, they'll review ours.

### Open dock questions

We had 4 process questions queued on the dock (week 6 gate sign-off, dep batch approval, cloudflare vs github pages, sub-team timing). Omair is mid midterm grading, said he'd post written answers in the dock later today once he wraps.

## TA Feedback / Answers

- Split into subteams now (frontend, backend, testing/docs/PR, design). Research and design phases are done.
- Build two flows into the MVP: quick (template + text edit) and slow (AI generation from a description).
- The current design needs a small reshape to include the quick flow (search templates, pick, add text), plus the popular templates list on the landing page like image flip.
- Presentation video deadline: Thursday 2026-05-21.
- Code review swap with another MemBro team the weekend after the presentation.
- Written answers to the 4 dock questions coming later today after midterm grading.

## Decisions / Approvals

- Sub-team split approved for sprint 2.
- MVP scope expanded to include both the quick (no AI) and slow (AI) paths.
- Presentation deadline confirmed for Thursday 2026-05-21.
- Cross-team code review swap confirmed for the weekend of 5/23 and 5/24.

## Action Items

- [ ] Open sprint 2 github issues for the new subteams (frontend, backend, testing/docs/PR, design), have members self-select. Yuval, Wed 5/13.
- [ ] Update wireframes for the quick flow (template search + click + text edit + popular templates list on landing). Fariba, Koji.
- [ ] Wire the image flip top 100 templates API as the data source for the quick flow. Backend group.
- [ ] Each lane prep something to show for the Thursday 5/21 presentation video. All leads.
- [ ] Coordinate the code review swap with another MemBro team for the weekend of 5/23 and 5/24. Yuval.
- [ ] Check the dock for Omair's written answers to the 4 process questions later today. Yuval, Jordan.
- [ ] Mix in 2 to 3 user-fronted product questions for next week's TA meeting agenda (carrying forward 5/06 guidance).
