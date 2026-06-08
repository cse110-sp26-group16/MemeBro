# Sprint 4 Review + Retrospective

> Draft prepared ahead of the meeting. The Review sections are filled from the
> merge history and issue tracker. The Retrospective bullets are seeded from
> observable facts for the team to confirm, edit, or replace at the retro.

- **Date:** 2026-06-07 (Sunday)
- **Sprint:** 4 (Week 9, plus the freeze buffer to 2026-06-07)
- **Attendees:** Full team
- **Facilitator:** Yuval Pesok
- **Note-taker:** Yuval Pesok

## Sprint Review

### Sprint Goal (recap)

From Sprint 4 planning (2026-05-27) and the 2026-05-28 scope adjustment: ship a
single end-to-end vertical slice, **Library → Search → Editor**, so a user can
open MemeBro, search a template, tap one, edit captions, and download the result.
The Conjure generative flow, My Memes / history, layers panel, multi-destination
share, and the desktop editor layout were deliberately deferred. Alongside the
slice, finish the process and CI hardening (lint/format gate, CI-gated deploy,
required status check, ADR coverage).

### Demo / What Shipped

#### Frontend

- **Interface contract** updated to add the Search screen and promote the Editor to the core flow (#69, PR #79).
- **Search screen** with AI-ranked results and a client-side ImgFlip fallback so it works on Pages with no backend reachable (#72, PR #80).
- **Shared chrome** `<memebro-top-bar>` and `<memebro-tab-bar>` web components (#74, PR #83).
- **Home / library grid** polished to render real popular ImgFlip templates and route a tapped template to the editor (#70, PR #85).
- **Gallery** polish plus unit tests (#71/#63, PR #82).
- **Editor** caption-overlay editor with PNG download via html2canvas (#73, PR #99). Code complete and verified in a real browser; in review, pending merge as of this draft. This is the last piece of the slice.

#### Backend

- **Cloudflare Worker** scaffold with an `/api/status` health-check endpoint and CORS (#26, PR #49).
- **`/api/search`** Cloudflare route serving fixture-ranked templates (#75, PR #87).
- **AI prompt builder** pure function for the Conjure flow (#27, PR #53).

#### Testing / QA

- **Vitest** unit framework and **Playwright** E2E framework wired into CI (#36/#37, PRs #51/#50).
- **ImgFlip smoke tests** (#67, PR #84) and **JSON-validator tests** (#65, PR #78).

#### Process / CI / Docs

- **Lint + format gate** and a hardened single CI/CD pipeline that gates the Pages deploy on passing lint, unit, E2E, and worker tests (#60, #89; ADR-0010).
- **Branch protection** updated to require the `CI success` check (ADR-0012, PR #100, in review).
- **ADRs** 0009 (Cloudflare backend platform, supersedes 0003), 0010 (gate deploy on CI), 0011 (AI provider for search), 0012 (require CI success), 0013 (editor export via html2canvas).
- **Repo hygiene:** CODEOWNERS, README rewrite, ADR index, dependencies ledger (#57, #58, #59), and Dependabot enabled with six GitHub Actions bumps merged (#90 through #95).
- Deployed slice walks live at `https://cse110-sp26-group16.github.io/MemeBro/`.

### What Did NOT Ship (and why)

- **Real AI ranking (#77)** — code and tests exist on `feat/ai-search-ranking` but no PR. Deferred post-demo; the fixture and client-side fallback cover the demo. Conflicts with #89 on `ci-cd.yml` to resolve later.
- **My Memes / history (#107, #108) and `storage.js` (#106)** — outside the slice. Reopened late in the freeze buffer; being evaluated as a stretch (pull in only if it lands clean), otherwise post-freeze.
- **Conjure generative flow, Export beyond PNG download, layers panel, multi-destination share, desktop editor layout** — all deferred in the 2026-05-28 scope cut.
- **Remaining Dependabot bumps (#101 through #105)** — held during the freeze. The dev-dependencies group (#105) is blocked on an eslint flat-config migration and is tracked as separate tech debt.

## Retrospective

_Seeded from observable facts. Confirm, edit, or replace at the retro._

### What Went Well

- **The scope cut worked.** Narrowing to one Library → Search → Editor slice on 05-28 let the team ship a coherent end-to-end flow instead of six half-built screens.
- **CI/CD matured a lot.** Lint/format gate, a single hardened pipeline gating the deploy, a required `CI success` check, and Dependabot all landed this sprint.
- **ADR cadence held.** ADRs 0009 through 0013 are all documented, so every significant decision has a record.
- **The PR review blitz from the Sprint 3 retro actually happened.** Roughly fifteen PRs were reviewed and merged in the 05-27 batch, clearing the backlog before feature work.

### What Didn't Go Well

- **The editor was the long pole.** #73 slipped into the freeze buffer, which left the demo flow dead-ending until the final days.
- **Deferred scope reappeared late.** History (#106, #107, #108) showed up three days before the freeze, risking scope churn at the worst time.
- **Dependabot flooded the freeze week.** A batch of bumps arrived mid-freeze, and the eslint flat-config blocker (#105, formerly #98) is unresolved.
- **CodeQL review noise.** On large diffs CodeQL false-attributes a pre-existing alert to the PR, and the genuine `js/components/search.js:213` XSS sink on main is still unaddressed.

### What We'll Try Next

_This is the final sprint, so "next" is the remainder of the freeze and the wrap._

- Land the editor (#99) and the slice E2E (#66) first, then take stretch items only if they are clean.
- Add Dependabot ignore and grouping rules so freeze weeks are not flooded.
- Open a tracked issue for the eslint flat-config plus Node 22 toolchain migration.
- File an issue for the `search.js:213` XSS sink and close it before the final video.

## Cross-team Review Feedback (when applicable)

_Sprint 3 noted a code review swap with Team 19, feedback pending. Fill in or remove if the swap did not produce written feedback._

### Their feedback to us

- _Pending / fill in._

### Our feedback to them

- _Pending / fill in._

## Action Items (carry-forward)

- [ ] Get #99 (editor) reviewed and merged — Yuval + reviewer — by 2026-06-05
- [ ] Merge #100 (ADR-0012) and #109 (standup notes) — reviewer — by 2026-06-05
- [ ] Slice E2E #66 once the editor lands — Koji / Angelo — by 2026-06-06
- [ ] Decide history (#106 / #108) pull-in versus defer — Yuval — by 2026-06-06
- [ ] Dependabot ignore rules and an eslint flat-config migration issue — owner TBD — post-freeze
- [ ] Film the final presentation video after the freeze — full team — 2026-06-07

## Evidence of Incorporation (from Sprint 3 retro)

- **"PR review blitz at sprint start"** — done. The 05-27 batch reviewed and merged the backlog (#31, #33, #48, #49, #50, #51, #52, #62, and the process PRs) before new feature work.
- **"Unblock the backend, ratify ADR-0003"** — done. ADR-0009 ratified Cloudflare and superseded 0003 (PR #62); the Worker (#49) and `/api/search` (#87) shipped real code.
- **"Wiki PRs by mid-sprint"** — done. Wiki home (#29) and coding standards (#30) completed (committed directly, wiki pages cannot go through PRs).
- **"Finish Conjure #33"** — done. Merged 05-27.
- **"Prep repo for the cross-team review swap"** — done. README rewrite, ADR index, and docs cleanup (#58, #59) landed before the swap weekend.
