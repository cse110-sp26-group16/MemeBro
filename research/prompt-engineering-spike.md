# MemeBro — AI Prompt Engineering Spike

**Status:** Draft v0.1 — ready for TA/team review
**Related issue:** Spike — validate AI prompt templates before integration
**Author:** _TBD_

## 1. Goal

Validate that a prompt template can:

1. Merge a user image + text concept into a known meme format while preserving its style
2. Reliably refuse non-PG-13 or "mean" content
3. Stay fast enough for the mobile use case (well under the 5-minute red line from the brief)

## 2. Variables

All templates share the same input contract:

| Variable         | Description                                     | Example                              |
| ---------------- | ----------------------------------------------- | ------------------------------------ |
| `{user_image}`   | Uploaded photo                                  | A selfie                             |
| `{user_concept}` | The user's joke or situation in their own words | "me when the wifi cuts out mid-Zoom" |
| `{meme_format}`  | Named meme template the user picked             | "Drake Hotline Bling"                |

## 3. Prompt Templates

Five templates were drafted. Full source for each is in [`prompts/`](./prompts/).

| ID  | Name                           | When to use                               | File                                               |
| --- | ------------------------------ | ----------------------------------------- | -------------------------------------------------- |
| A   | Strict Format-Preserving       | User picks a known format                 | [`prompts/template-a.md`](./prompts/template-a.md) |
| B   | Concept-First                  | User gives a vibe, model picks the format | [`prompts/template-b.md`](./prompts/template-b.md) |
| C   | Edit / Iterate                 | User wants to tweak an existing meme      | [`prompts/template-c.md`](./prompts/template-c.md) |
| D   | Caption-Only (fast path)       | Text-only suggestions, no image gen       | [`prompts/template-d.md`](./prompts/template-d.md) |
| E   | Safety Classifier (pre-flight) | Runs before A–D to gate the request       | [`prompts/template-e.md`](./prompts/template-e.md) |

### Design choices

- **JSON-only output contract.** Every template forces structured JSON, including for refusals (`{"refusal": "..."}`). This makes prompt injection harder and gives the frontend a clean shape to render.
- **Two-stage architecture.** Template E (cheap classifier, ~200ms) runs _before_ the heavier generation templates. Single tuning point for "fun, not mean" and saves tokens on requests that would be refused anyway.
- **Fast path separation.** Template D returns text-only candidates for the mobile "I'm in a group chat right now" use case — no image-gen latency.

## 4. Test Results

Full edge-case results, including prompt injection and borderline cases, are in [`tests/edge-case-results.md`](./tests/edge-case-results.md).

**Headline numbers:**

- 12 edge cases run against Templates A and E
- 12/12 behaved as intended
- 6/6 clearly-violating inputs were blocked
- 2/2 borderline inputs degraded gracefully (soft refusal or named-individual scrubbing)
- 1/1 prompt-injection attempt was caught by the JSON-only contract

## 5. Recommendations

1. **Adopt Template A as the Sprint 1 default.** Most predictable, JSON-structured, 100% reliable in the dry-run. B and C land in Sprint 2.
2. **Run Template E as pre-flight on every request.** Single tuning point for guardrails; saves tokens on requests that would be refused downstream anyway.
3. **Always require JSON output**, including refusals — frontend renders them as friendly toasts instead of broken UI states.
4. **Add a "who is this person to you?" UI step** when a concept contains a name. The classifier needs that relationship context to distinguish "my roommate" jokes from harassment.
5. **Open an ADR** on two-stage (classifier + generator) vs. single-prompt architecture — this is a real architectural decision and the project requires it in MADR format.

## 6. Next Steps

- [ ] Open ADR: "Two-stage prompt architecture (classifier + generator)"
- [ ] Wire `tests/edge-case-results.md` cases into actual fixtures under `tests/prompts/` once a provider is chosen
- [ ] Track token cost per template (Omair flagged token accounting as a resume-worthy thing to instrument early)
- [ ] Decide: do refusals count as a "failed generation" in analytics? (Recommend: no — they're a feature.)
- [ ] Re-run the test table against the chosen provider's API in CI

## 7. Caveats

- Test results in §4 are from a **manual dry-run** against a vision-capable LLM with default safety settings. They are _not_ yet a CI suite. The next-steps list above tracks getting them there.
- The `{meme_format}` variable is currently free-text. If we want stricter control, swap it for an enum of supported formats and reject anything else upstream.

---

_v0.1 — initial draft for TA/team review._
