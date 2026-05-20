# TA Meeting — 2026-05-20

- **Date:** 2026-05-20 (Wednesday)
- **TA:** Omair Qazi
- **Attendees from team:** Yuval Pesok (project lead)
- **Sprint:** 2

## Agenda

1. Status check on sprint 2 progress
2. ADR-0003 (backend stack for the AI proxy) walkthrough and approval
3. Open questions about the project or the presentation due today

## Questions for TA

- Are you OK with the proposed "defer" decision in ADR-0003 (PR #34), holding the backend stack call until ADR-0002 lands and the slow flow is actually queued for sprint 3?
- Any concerns about how sprint 2 is shaping up so far?
- Anything we should adjust for the presentation due today?

## TA Feedback / Answers

Short meeting overall. Omair asked if things were going well and whether we had any questions about the project or the presentation due today.

On ADR-0003 specifically: he approved our decision to defer the backend stack pick. He added that if the backend choice gets too complicated or if our needs shift after sprint 2, we can file a new ADR at that point and bring it to him for approval. The general process (ADR first, TA approval logged before code lands) stays in place.

No other blockers raised on either side.

## Decisions / Approvals

- **ADR-0003 (PR #34):** Omair approved the "defer" decision. The team still needs to formally ratify at Sunday sprint planning to flip the ADR status from Proposed to Accepted.
- **Open door for follow-up ADRs:** Omair confirmed that if the backend stack needs to shift later (e.g. when the slow flow lands in sprint 3 and we pick between Cloudflare Pages Functions and Workers), filing a new ADR and looping him in for approval is the right process.

## Action Items

- [ ] Ratify ADR-0003 at Sunday sprint planning, flip status from Proposed to Accepted — Yuval — by 2026-05-24
- [ ] Keep #26 (Jordan, worker setup) BLOCKED until the team ratifies ADR-0003 — Yuval — by 2026-05-24
- [ ] When ADR-0002 lands and the slow flow is actually scheduled, file ADR-0004 (or revisit ADR-0003) to pick the concrete backend platform — Yuval — by start of sprint 3
- [ ] Deliver the presentation due today — whole team — by EOD 2026-05-20
