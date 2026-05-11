# Sprint 1 Planning Meeting

- **Date:** 2026-05-05 (Tuesday)
- **Sprint:** 1
- **Type:** Sprint Planning (kickoff)
- **Attendees:** Full team
- **Note-taker:** _TODO — add name_

## Agenda

1. Project direction and team alignment
2. Define MVP scope
3. Split tasks across the team via GitHub Issues

## Discussion

### Project Direction

The team aligned on MemeBro's core concept: a fast, mobile-friendly meme
generator where a user can supply their own photo, combine it with a meme
template + caption, and get a finished meme out. AI assistance is the planned
differentiator vs. existing tools like ImgFlip.

The strategy we agreed on is **functionality first, refinement after**:

1. First, prove the full **upload → text input → template → output** loop
   end-to-end.
2. Once that loop works, focus on what users actually want and what makes
   MemeBro better and more unique than ImgFlip / existing meme tools (speed,
   mobile UX, AI quality, sharing).

### MVP Scope (locked for this sprint)

The MVP must demonstrate the full pipeline at a basic level:

- Upload a photo from the user's device.
- Accept a text input (caption).
- Pick / apply a meme template.
- Produce a generated meme image as output.

#### Initial Layout

- **Main image / preview area** at the top of the screen.
- **Text input box** below the preview.
- **Button** below the text box to choose a photo.

Layout is intentionally rough at this stage. Wireframes (issues #2, #3) and
user stories / personas (issue #1) will refine it after the MVP loop is
functional.

### Task Split

Tasks were assigned across the team using the existing GitHub Issues
(#1 – #11), grouped under the functional labels (`design`, `devops`, `AI`,
`QA`).

## Decisions

- **MVP scope** locked for Sprint 1: upload + text input + template + meme
  output.
- **Initial layout**: preview at top, text input in the middle, upload button
  at the bottom.
- **Sequencing**: functionality first; UX polish, AI quality, and
  differentiation features come *after* the MVP loop works.
- Continue using the existing `design` / `devops` / `AI` / `QA` label scheme
  for issues.

## Action Items

- [x] Split work across the team via GitHub Issues — completed during meeting.
- [ ] Each assignee makes progress on their issue(s) this sprint.
- [ ] Standups logged in `docs/meetings/standups/` (≥ 3× per week per
      CSE 110 process requirements).
- [ ] Sprint review + retrospective notes captured at end of sprint.

## Next Up

- **Standups** ≥ 3× this week.
- **Sprint review + retrospective** at end of sprint.
- **Weekly TA meeting** — capture notes in `docs/meetings/ta/`.
