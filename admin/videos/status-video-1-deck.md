# MemeBro Status Video 1, Slide Deck Spec

> **Instructions for the AI assistant generating the PPTX**
>
> Convert this spec into a `.pptx` file using `python-pptx`. One slide per `## Slide` section.
> Use the bullets as slide body content and the **Speaker notes** block as the slide notes
> (these get read aloud, so they must be saved as slide notes, not visible on the slide).
>
> Style guidance (MemeBro brand, mirrors the app at `styles/tokens.css`):
>
> Colors (use exact hex):
>
> - Background: warm cream `#f6efde`
> - Surface / card: `#fcf8ee` with rounded corners (~18px) and a soft warm drop shadow `rgba(60,40,12,0.08)`
> - Hairline rules and dividers: `#e6d6b0`
> - Primary ink (text): `#1f1408` (dark brown, never pure black)
> - Secondary ink: `#4a3a26`
> - Tertiary ink (slide numbers, captions): `#8a7958`
> - Primary accent: orange `#e3691a` (use for headings, underlines, dot bullets, flowchart arrows, callout chips)
> - Secondary accents (use sparingly for visual interest): mint `#6fb89c`, rose `#d97384`, blue `#6a8fb8`
>
> Type:
>
> - Body sans: Geist (with `system-ui, -apple-system, sans-serif` fallback)
> - Display accent: Instrument Serif italic (use for the word "MemeBro" on the title slide and any pull-quote-style headers)
> - Mono: Geist Mono (only if showing code, not needed for this deck)
>
> Layout:
>
> - Title slide: centered, "MemeBro" set in Instrument Serif italic at ~88pt, orange underline beneath, subtitle in Geist 18pt ink-2
> - All other slides: small slide number bottom right in ink-3, footer in ink-3 reading "MemeBro · CSE 110 Group 16 · Sprint Status Video 1"
> - Dot bullets are orange filled circles, not default black squares
> - Bullets: 6 to 10 words each, generous line spacing
> - Two-column slides: 55/45 split, generous gutter
> - Images embed inside a rounded-corner surface card with the soft warm shadow, so they look like polaroids on cream paper
>
> Vibe:
>
> - Cozy, warm, hand-crafted, the opposite of corporate slide-deck blue
> - Lots of cream breathing room, never edge-to-edge dense
> - One accent color doing the lifting (orange), other accents only if a slide needs a third visual hierarchy
>
> Save the output as `status-video-1.pptx` in the same directory as this file.
>
> Target spoken length: 4 minutes. Total speaker notes are written to hit ~580 words at a natural pace.
>
> ### Embedding images and mockups
>
> If we have mockups, screenshots, or design assets to show:
>
> 1. Drop the image files into `admin/videos/assets/` (PNG or JPG)
> 2. Reference them on the relevant slide using:
>    `**Image:** ./assets/<filename>.png` with a short caption underneath
> 3. The generated Python script should use `slide.shapes.add_picture()` to embed them at the position implied by the layout hint (right column, full-bleed, etc.)
>
> If a slide says "Visual:" but has no `**Image:**` line, the script should render a styled placeholder box with the visual description as caption text, so we can drop the real asset in by hand in PowerPoint later.

---

## Deck overview

- 8 slides total
- Slide 1 is the title slide
- Slides 2 through 8 follow the order below
- Emphasis is on process, iteration, and honest self-assessment, not on the product features themselves

---

## Slide 1: Title

**Layout:** Title slide, centered, no body bullets

**Title:** MemeBro

**Subtitle:**

- Sprint Status Video 1
- CSE 110, Spring 2026, Group 16
- 2026-05-20

**Visual:** simple text only, accent color underline below the word "MemeBro"

**Speaker notes:**
Hi, we're group 16 and this is our mid-quarter status update on MemeBro, our AI-assisted meme generator. In the next four minutes we'll cover what we've built, how our team actually works, what we got wrong along the way, and what's coming next.

---

## Slide 2: What we're building

**Title:** What we're building

**Bullets:**

- Pick a meme template
- Type a vibe, AI suggests a caption
- Save it to your personal gallery
- Mobile first, runs entirely in the browser

**Visual:** two column layout, bullets on the left, single phone-frame mockup on the right inside a rounded surface card with warm shadow

**Image:** ../../Design/screens/01-library-home/1-mobile.png
Caption: Library Home, mobile

**Speaker notes:**
MemeBro is a web app where you pick a meme template, describe the vibe you want, and our AI suggests a caption. You can save what you make in a personal gallery. It's mobile first, no install, runs entirely in the browser today. Our target user is anyone who wants to make a quick joke without learning a design tool.

---

## Slide 3: Where we are, the walking skeleton

**Title:** Where we are

**Bullets:**

- 5 active PRs across all 4 lanes, all in review
- Gallery, conjure UI, home page, ImgFlip fetch all in flight
- Design system tokens and AGENTS.md already merged
- 3 ADRs published: stack, hosting, backend strategy
- Deployment is sprint 3 day 1 (Cloudflare Pages setup in flight)

**Visual:** bullets on the left, three small mockup thumbnails stacked or in a row on the right, each inside its own rounded surface card

**Images:**

- ../../Design/screens/01-library-home/1-mobile.png (caption: Library Home)
- ../../Design/screens/03-conjure/1-mobile.png (caption: Conjure)
- ../../Design/screens/05-my-memes/1-mobile.png (caption: My Memes)

**Speaker notes:**
We're at the walking skeleton stage. All four of our lanes have work in flight, with five active pull requests in review right now: the template gallery component, the conjure page UI, the home page layout, the ImgFlip API integration, and the CI/CD pipeline. We've also published three architecture decision records covering our stack, hosting, and backend strategy. Deployment itself is the first thing we land in sprint 3, on Cloudflare Pages.

---

## Slide 4: CI/CD pipeline

**Title:** CI/CD pipeline

**Bullets:**

- Lint, unit tests, end-to-end on every push and every PR
- Nothing merges to main without green checks
- Branch protection on main, PR only path
- Deploy target: Cloudflare Pages (sprint 3)
- Pipeline in final review, lands this week

**Visual:** horizontal flowchart: Push, then Lint, then Unit, then E2E, then Deploy. Arrows in accent color.

**Speaker notes:**
Our CI/CD pipeline is built and in final review this week. Once merged, every push and every pull request runs lint, unit tests, and end-to-end tests. Nothing merges to main without all gates green, and main is already protected so the only path in is a reviewed pull request. We pivoted our hosting target from GitHub Pages to Cloudflare Pages this sprint because Pages Functions gives us a clean path to the AI proxy backend without changing how we deploy.

---

## Slide 5: Our process and how it evolved

**Title:** How we actually work

**Bullets:**

- Project lead plus 4 lanes of 2 (frontend, backend, testing/docs, design)
- Standups at least 3 per week, all logged in repo
- Weekly TA meeting with action items tracked
- All decisions land in ADRs, not Slack
- AGENTS.md keeps humans and AI agents writing consistent code
- GitHub Issues are the source of truth, not Slack threads

**Visual:** simple org chart on the right showing Lead at top, 4 lane boxes below. Bullets on the left.

**Speaker notes:**
Process is what makes a ten person team actually ship. We're organized as a project lead plus four lanes of two for the build sprints: frontend, backend, testing and docs, and design. Standups happen at least three times a week and every one of them is logged in our repo. We meet with our TA every week with formal action items captured each session. All architectural decisions get written up as ADRs instead of being talked through in Slack. We also wrote an AGENTS.md file that defines our coding norms so humans and AI agents writing code stay consistent across the codebase. Our issue tracker is the source of truth and Slack is just where we coordinate.

---

## Slide 6: Challenges and how we navigated them

**Title:** Challenges, and how we navigated them

**Bullets:**

- Backend stack decision was non-trivial. Documented a structured deferral with a re-decision date instead of guessing.
- Hosting target evolved as the AI integration shape became clearer. Captured the pivot to Cloudflare Pages in an ADR with full rationale.
- Testing infrastructure was bigger than one work item. Split into lint, unit, and end-to-end sub-issues so they ship independently.
- Coordinating AI agent assisted code across many contributors. AGENTS.md acts as a shared contract so the codebase stays coherent.
- Cross-team PR review at scale. 24 hour SLA plus lane Slack channels so reviews don't sit in queue.

**Visual:** two column layout, "Challenge" on the left in muted color, "How we navigated it" on the right in accent color

**Speaker notes:**
Every team hits real friction, and ours has been around making hard decisions cleanly. The backend stack was a non-trivial choice between static-only, serverless functions, and a full backend, so instead of picking one prematurely we wrote a structured deferral ADR with a clear re-decision date. As our AI integration came into focus, we realized our original hosting target wasn't the right fit and pivoted to Cloudflare Pages, with the rationale captured in an ADR. Our testing infrastructure work was larger than a single issue, so we split it into lint, unit, and end-to-end sub-items that can ship in parallel. With multiple contributors using AI assistants on the same repo, we wrote AGENTS.md as a shared contract to keep style and conventions coherent. And we set a 24 hour review SLA with lane-specific Slack channels so pull requests don't sit in queue.

---

## Slide 7: AI usage, pros and cons

**Title:** AI usage

**Bullets (two column):**

_Pros:_

- Faster scaffolding (AGENTS.md, tokens, ADR drafts)
- Cleaner JSDoc coverage across the codebase
- Meeting transcripts to structured notes
- Agents follow our written conventions

_Cons:_

- Will invent abstractions if not constrained
- Output needs human review before commit
- Easy to over-document and create noise

_How we mitigate:_

- AGENTS.md acts as a contract for AI agents
- JSDoc lint enforces consistency
- Human author owns and reviews every PR

**Visual:** three column layout: Pros, Cons, Mitigations. Equal weight.

**Speaker notes:**
AI has been a real force multiplier. We use it for scaffolding, drafting ADRs, transcribing meeting notes, and keeping our documentation in shape. The cons are real though. Agents will invent abstractions if you let them, output needs human review before merge, and it's very easy to over-document. We mitigate by treating AGENTS.md as a contract that bounds what AI does, by enforcing JSDoc through lint, and by requiring the human author to own and review every PR.

---

## Slide 8: What's next, and what to look forward to

**Title:** What's next

**Bullets:**

- Sprint 3 (next 2 weeks): Cloudflare Pages deploy live, AI proxy on Pages Functions, full end-to-end meme flow, test coverage across shipped components
- Sprint 4: polish, accessibility pass, final presentation prep
- Working end-to-end demo by sprint 3 close
- Full product walkthrough at the final presentation

**Visual:** simple timeline left to right: Sprint 3, Sprint 4, Final. Each with one or two key milestones underneath. Closing line at bottom: "Thanks, Group 16."

**Speaker notes:**
Sprint 3 starts Sunday. Day one we land the Cloudflare Pages deploy so we have a live URL. From there we stand up the AI proxy on Pages Functions, wire the full end-to-end meme flow, and bring test coverage up across the components we've already shipped. Sprint 4 is polish, an accessibility pass, and final presentation prep. By the close of sprint 3 we'll have a working end-to-end demo, and we'll bring a full product walkthrough to the final presentation. Thanks for watching.

---

## Appendix: optional speaker variations

If a section runs short on camera, expand by mentioning:

- Slide 3: reference specific PR numbers from the active queue and the design system tokens that already merged
- Slide 5: mention AGENTS.md lives in the repo root and is required reading for anyone using an AI agent on this codebase
- Slide 6: mention the cross-team review swap happening in week 9 as further process iteration

Stay generic on personnel. Reference "the frontend lane", "the backend lane", or "the team" rather than individual names. This is a class-wide presentation, and lane-level framing reads as more professional than name-by-name updates.

If a section runs long, cut from:

- Slide 2 first (the product description is the least important part of this video)
- Slide 8 last (close cleanly even if you have to drop the appendix details)

## Appendix: generation prompt to use

Paste this prompt at the top of a fresh Claude conversation along with this whole file:

```
You are generating a designed PowerPoint deck using python-pptx that matches
the MemeBro app's brand exactly. Read the spec file I'm about to paste.
Generate a single Python script that:

1. Creates a .pptx file matching the spec
2. Strictly applies the Style guidance section at the top of the spec
   (warm cream background, orange accent, Geist + Instrument Serif fonts,
   rounded surface cards with warm shadow, orange dot bullets, ink-not-black
   text)
3. One slide per "## Slide" section
4. Bullets go in the slide body, "Speaker notes:" block goes in slide notes
5. Where the slide has "**Image:**" or "**Images:**" lines, embed those files
   inside rounded surface cards with the soft warm shadow described in the
   style guidance, so they look like polaroids on cream paper
6. Renders the title slide with Instrument Serif italic for the word
   "MemeBro" and an orange underline beneath it
7. Adds a footer "MemeBro · CSE 110 Group 16 · Sprint Status Video 1" and
   a slide number to every non-title slide, both in ink-3
8. Saves the output as status-video-1.pptx in the working directory
   (admin/videos/)

Output only the Python script, no commentary. I'll run it locally with
`python admin/videos/generate_deck.py`. Use only python-pptx and Pillow as
dependencies.
```
