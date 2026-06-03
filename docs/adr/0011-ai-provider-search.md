# ADR-0011: AI provider for template search ranking

- **Status:** Proposed <!-- pending TA sign-off; no dependency added in this PR -->
- **Date:** 2026-06-01
- **Deciders:** Whole team, pending TA sign-off from Omair Qazi

## Context

The search screen (#72) calls `searchTemplatesWithAI(query)` in
`js/api/search-api.js`, which hits the worker route `GET /api/search?q=<query>`
(#75) and expects back `{ results: RankedTemplate[] }`. The route already exists
and runs on Cloudflare ([ADR-0009](0009-backend-platform.md)), but its ranking
function is a stub: it returns static fixtures when `USE_FIXTURE === "true"` and
otherwise throws, surfacing `502 { error: "ranking failed" }`. Issue #77 wires
the real ranking in, and it is **blocked on this decision** — we cannot pick an
implementation without first agreeing which provider does the ranking.

Scope matters here: this is a **ranking** problem, not a generation problem. The
candidate set is ImgFlip's ~100 popular templates, each with a short human title
(e.g. "Distracted Boyfriend", "Two Buttons"). The job is to score those existing
templates against a free-text query and order them by relevance. That is a
text-similarity / semantic-search task. It is **not** the conjure flow's
image-generation task, whose provider (Replicate, candidate) is a separate,
still-pending decision per [ADR-0009](0009-backend-platform.md). Nothing here
commits the conjure flow to anything, and nothing there commits search.

Forces at play:

- **Alignment with ADR-0009.** The backend platform is Cloudflare, already
  TA-approved. A provider that lives inside Cloudflare carries the least
  dependency-approval friction (process rule 8) and no extra account to manage.
- **No secrets in the worker.** The #75 route is built to use `wrangler.jsonc`
  bindings only, no API keys in source. A provider that authenticates via a
  binding preserves that; an external HTTP API forces a server-held secret.
- **Cost.** This is a student project on free tiers. Per-query cost and any
  per-call egress to a third party are real constraints.
- **Latency.** Search is interactive. A same-runtime call beats a round trip to
  an external API.
- **Quality of match.** A query like "hard choice" should surface "Two Buttons"
  even though the words do not overlap. Pure string matching cannot do that;
  semantic embeddings can.
- **The `reason` field is optional.** `RankedTemplate.score` is required;
  `reason` is a nice-to-have. We do not need a generative model just to produce a
  human-readable explanation.

Options considered:

- **A. Cloudflare Workers AI text embeddings** (e.g. `@cf/baai/bge-base-en-v1.5`).
  Embed the query, compare against precomputed template-title embeddings by
  cosine similarity, sort descending. Runs on the approved Cloudflare platform,
  authenticates via an `ai` binding (no secret), low latency, free daily Neuron
  allowance.
- **B. OpenAI embeddings API** (`text-embedding-3-small`). Strong embedding
  quality, but a new external vendor: new ADR + TA approval, a server-held
  `OPENAI_API_KEY` secret, and per-call egress + latency to an external host.
- **C. Vision / image-embedding (CLIP-style).** Rank the query against the
  template _images_ rather than their titles. More powerful in principle, but far
  heavier: embed and store ~100 image vectors, and it solves a problem we do not
  have, since ImgFlip titles are already descriptive text. Highest cost and
  complexity for marginal gain on a text-query use case.
- **D. Naive text similarity** (Levenshtein distance or character trigrams),
  computed in the worker with no model at all. Zero dependency, zero cost,
  trivial. But it is lexical only — it cannot connect "hard choice" to "Two
  Buttons" — which is essentially what the existing client-side substring
  fallback already does.

## Decision

Adopt **Option A: Cloudflare Workers AI text embeddings** as the provider for
template search ranking, with **Option D retained as an in-worker fallback**.

Concretely, when #77 lands, `rankTemplates(query, env)` will:

1. Embed the query with a Workers AI embedding model via the `env.AI` binding.
2. Compare it (cosine similarity) against template-title embeddings — computed
   once and cached (Workers KV) rather than recomputed per request, since the
   ~100 popular templates change rarely.
3. Return `RankedTemplate[]` sorted by descending similarity, mapping similarity
   to `score`. `reason` may be synthesized from the score band (e.g. "Strong
   semantic match") since embeddings do not produce prose; it remains optional.
4. On any Workers AI failure, fall back to the naive in-worker text-similarity
   ranking (Option D) instead of returning `502`, so search degrades rather than
   breaks.

Workers AI is chosen over the external alternatives chiefly because it sits
inside the already-approved Cloudflare platform ([ADR-0009](0009-backend-platform.md)),
authenticates by binding rather than secret (matching the #75 route's
no-secrets-in-source constraint), and keeps the call in-runtime for cost and
latency. Embeddings are chosen over a generative model because ranking does not
require generation, and over image embeddings because the titles are already
good text signal.

This ADR **does not** add Workers AI to [`../dependencies.md`](../dependencies.md).
It records the proposed direction only. Adding the service to the dependency
ledger waits on TA sign-off per process rule 8 (see "When this ADR changes").

### Environment and binding requirements

- **Workers AI binding** in `memebro-api/wrangler.jsonc`:

  ```jsonc
  "ai": { "binding": "AI" }
  ```

  Exposed to the worker as `env.AI`. No API key, no secret.

- **`SEARCH_EMBED_MODEL`** (`vars`, optional): pins the embedding model id (e.g.
  `@cf/baai/bge-base-en-v1.5`) so it can change without a code edit.

- **`USE_FIXTURE`** (`vars`, existing from #75): keep `"true"` until this lands,
  then flip to `"false"` so the route uses real ranking.

- **Template-embedding cache** (optional, later): a Workers KV namespace binding
  to store precomputed title vectors. Not required for a first cut.

- **No secrets are introduced.** Had we chosen Option B, it would have required
  `wrangler secret put OPENAI_API_KEY`; we are explicitly avoiding that.

## Consequences

Positive:

- Stays on one approved platform (Cloudflare), so no new vendor account and the
  lightest path through process rule 8.
- No secret key in the worker — consistent with the #75 route's binding-only
  design.
- Semantic matching beats the lexical substring fallback for real queries.
- In-runtime call keeps latency and cost low; the free daily Neuron allowance
  comfortably covers development, the demo, and light use, especially with
  template embeddings cached and the search input debounced.
- The Option D fallback means a Workers AI outage degrades search to lexical
  matching instead of returning `502`.

Negative:

- Workers AI embedding quality may trail a dedicated provider like OpenAI
  `text-embedding-3-small`; if relevance proves weak we revisit (see below).
- `reason` is synthesized from score bands, not genuinely explanatory, because
  embeddings do not emit prose. Acceptable since the field is optional.
- Adds a Workers AI binding and a small caching concern (when/how to refresh
  template embeddings) to the worker's operational surface.
- Neuron usage is metered; unbounded traffic (e.g. ranking on every keystroke
  without debounce) could exhaust the free allowance.

## Alternatives

See Options B, C, and D in [Context](#context) for the full comparison. In short:
B (OpenAI embeddings) was rejected for now because it adds an external vendor and
a server-held secret for a quality gain we do not yet need; C (image embeddings)
was rejected as over-engineered for a text-query, text-title problem; D (naive
similarity) was kept as the fallback rather than the primary because it is purely
lexical.

## When this ADR changes

- **TA approval is the gate.** Although Cloudflare is already approved as the
  platform, the team brings Workers AI to the TA (Omair) for confirmation before
  it is added to [`../dependencies.md`](../dependencies.md) and before #77's real
  call lands. The #77 PR also tags Bowen for sign-off.
- If Workers AI relevance proves inadequate in practice, we revisit and write a
  successor ADR adopting Option B (OpenAI embeddings), accepting the external
  vendor and secret-management cost.
- If search later needs to match on template _imagery_ rather than titles, that
  reopens Option C as a successor.

## References

- [ADR-0009](0009-backend-platform.md) — Cloudflare as the backend platform.
- [docs/interface-contract.md](../interface-contract.md) — `RankedTemplate` shape
  and the `GET /api/search` response contract.
- `js/api/search-api.js` — frontend caller and its current lexical fallback.
- `memebro-api/src/index.js` — the `GET /api/search` route and `rankTemplates`
  seam (#75) that #77 fills in.
- [Cloudflare Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)
  — Neuron model and current free daily allowance (verify before relying on
  specific figures).
