# Sprint 5 Planning

> Draft prepared ahead of the meeting. Seeded from a full end-to-end audit of the
> deployed site against the codebase, plus the Sprint 4 retro. Scope and
> assignments are for the team to confirm, edit, or replace.

- **Date:** 2026-06-05 (Friday)
- **Sprint:** 5 (final sprint, freeze buffer)
- **Type:** Sprint Planning
- **Attendees:** Full team (TBD at meeting)
- **Facilitator:** Yuval Pesok
- **Note-taker:** Yuval Pesok

## Agenda

1. Walk the deployed site end to end and name what is real versus mockup
2. Set the Sprint 5 goal and the cut line before the freeze
3. Decide wire-versus-hide for the dead controls
4. Assign issues by who already owns each area

## Discussion

### Most of the site looks done but is not wired

A full pass over the deployed site found that the home page is almost entirely
static markup. The only genuinely live pieces in the app are the template
gallery (loads real ImgFlip data), the editor (caption overlays plus PNG
download), and the search page (real, but orphaned, nothing links to it). The
sidebar links, filter pills, sort dropdown, top search, theme toggle, Conjure
buttons, and hero cards are all decorative, and several visible numbers (10,482,
the category counts, "4 / 5 credits", "All templates 20") are hardcoded with no
data behind them. Cards show "undefined uses" because the real ImgFlip data has
no use-count field.

A lot of this maps to features that were deliberately deferred in the 05-28 scope
cut (Conjure, My Memes / history, layers, desktop editor layout). The Sprint 5
job is to make the slice actually work and to make every visible control either
real or gone before the freeze.

### Wire versus hide

Default decision for the dead controls: make it real if it is cheap, otherwise
hide or remove it. ImgFlip gives no category or recency data, so the pills and
sort have nothing real to drive them and lean toward hiding. The dark theme is
cheap because the dark tokens already exist in `tokens.css`, so it just needs
JS. Favorites, recent, and my memes become real once persistence lands.

### Persistence

The team chose the full Mine experience for this sprint: favorites, recent, and
my memes all persist, built on `storage.js` (#106) and the History screen
(#107), both already open.

### AI incorporation

Real AI is not live anywhere in the running app today. The worker's
`rankTemplates()` is a stub that throws, the deployed frontend calls a relative
`/api/search` that 404s on Pages and silently falls back to a client-side string
match, and ADR-0011 is still Proposed with no provider locked. Since this is an
AI-themed course, real AI incorporation is a must-have, not a defer. The
committed feature is semantic search ranking, and the ranker is already written
on `feat/ai-search-ranking`, so this is mostly a land-and-wire job, not net-new
work. The generative Conjure flow stays deferred.

## Sprint Goal

Take the Library to Search to Editor slice from looks-done to actually-works, and
make every visible control either real or gone. The bar for the final build: no
dead buttons, no fake numbers, no "undefined."

## Scope (committed, sequenced by priority)

### AI incorporation (must-have for the grade)

This must land alongside P0. It is a graded requirement and it is mostly built.

- #134 Ratify ADR-0011 and get TA sign-off on the search AI provider (Jordan), unblocks the rest
- #77 AI provider integration for search ranking (Bowen), merge the `feat/ai-search-ranking` branch, wire the worker's `rankTemplates` to the real module, resolve the `ci-cd.yml` conflict with #89
- #135 Wire and deploy the worker for live AI search (Jordan), bind the provider, deploy, point the frontend at the real worker URL, verify a real model call
- #136 Tests for the AI search ranking and flow (Roy)

### P0, honesty and bug pass (cheap, makes the demo stop looking broken)

- #114 Fix gallery cards showing "undefined uses" and stray AI badges (Fariba)
- #115 Home page honesty pass, remove invented numbers (Harvey)
- #116 Remove duplicate top chrome from the embedded gallery on home (Harvey)
- #117 Fix the sidebar scrolling away instead of staying fixed (Yuval)
- #118 Editor, render a skeleton instead of blocking on the network (Yuval)
- #119 Remove the non-functional editor bottom toolbar (Yuval)
- #120 Fix the XSS sink in search.js (Yuval)

### P1, cheap real wires and core editor behavior

- #121 Wire the dark/light theme toggle (Yuval)
- #122 Add a hover affordance to template cards (Fariba)
- #123 Editor, make captions draggable (Alec)
- #124 Editor, add a caption color control (Yuval)
- #125 Connect the home search to real results (Yuval)
- #126 Decide, wire or hide the sort dropdown and filter pills (Harvey)

### P2, persistence, Mine, and editor layout

- #106 Build storage.js localStorage wrapper (Koji, already open) — foundation
- #127 Wire favorites, toggle, persist, and a Favorites view (Fariba), needs #106
- #128 Track and show real Recent templates (Harvey), needs #106
- #107 Build History Screen (Jennifer, already open)
- #129 Wire My Memes and fix the dead Mine/History nav (Jennifer), needs #106 and #107
- #130 Editor, desktop layout with a side editing panel (Alec)

### QA

- #66 E2E test for the gallery (Koji and Angelo, already open)
- #137 E2E test for the editor flow, caption edit, color, drag, download (Tim)

## Out of Scope (explicitly deferred)

- Conjure generative flow (image generation). `conjure.html` is static with no
  backend route and the generative provider is still pending, so this stays
  deferred. Hide the Conjure call-to-actions and the Conjured Mine entry so no
  dead button ships. Note this is separate from the AI search ranking (#77),
  which is in scope above.
- Stickers, FX, and layers panels.
- Export beyond PNG download, and multi-destination share.

## Tech debt (tracked, off the demo path)

- #131 Migrate ESLint to flat config and bump the Node toolchain (Yuval), unblocks
  the held dev-dependency bumps (#105)
- #132 Add Dependabot ignore and grouping rules (Yuval)

## Cut line for the freeze

AI incorporation (#134, #77, #135, #136) and P0 are both must-land, since AI is
a graded requirement and P0 is what a reviewer sees. Pull in P1 top down, and
treat P2 as stretch. If the freeze has real room, P2 lands too. Tech debt is off
the demo path and can run after the freeze.

## Decisions

- Sprint 5 is the final cleanup sprint. Plan everything, sequence by priority,
  pull in top down to the cut line.
- Default for dead controls is make it real if cheap, otherwise hide.
- Full persistence this sprint: favorites, recent, and my memes.
- AI incorporation is a must-have: land real semantic search ranking (ratify
  ADR-0011, merge #77, deploy the worker, point the frontend at it). Jordan leads
  it with Bowen.
- Generative Conjure stays deferred. Hide its entry points so no dead button ships.

## Assignments summary

| Person                     | Issues                                               |
| -------------------------- | ---------------------------------------------------- |
| Yuval (`ypesok28`)         | #117, #118, #119, #120, #121, #124, #125, #131, #132 |
| Jordan (`JordanJunaidi`)   | #134, #135, plus #77                                 |
| Bowen (`Endless1010`)      | #77                                                  |
| Harvey (`lurany`)          | #115, #116, #126, #128                               |
| Fariba (`Fariba-Tokhi`)    | #114, #122, #127                                     |
| Alec (`AlecLichtenberger`) | #123, #130                                           |
| Jennifer (`jenniferrzhu`)  | #129, plus #107                                      |
| Koji (`nakazawak`)         | #106, plus #66                                       |
| Angelo (`Asespene`)        | #66                                                  |
| Roy (`Flimgees`)           | #136                                                 |
| Tim (`timhaotongwu`)       | #137                                                 |

## Action Items

- [ ] Confirm the scope and cut line at the meeting, adjust assignments as needed
- [ ] Ratify ADR-0011 with TA sign-off (#134), it unblocks the AI work
- [ ] Merge #77 and deploy the worker so real AI search is live on the deployed site (#135)
- [ ] Land all P0 issues before the freeze
- [ ] Pull in P1 top down, then P2 if time allows
- [ ] Land #106 first so favorites, recent, and my memes can build on it
- [ ] Close the #120 XSS sink before the final presentation video

## Next Up

- Heads-down through the freeze, check-ins over the weekend
- Final presentation video filmed after the freeze
