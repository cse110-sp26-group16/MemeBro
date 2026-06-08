/**
 * AI-powered template ranking module.
 *
 * Given a user query and a list of meme templates, calls the AI provider
 * (chosen in ADR-0010, #76) to score each template's relevance, then returns
 * them sorted highest-score first. Ties are broken by template id (ascending)
 * for stable, deterministic output.
 *
 * Required Worker binding: the AI provider API key — name TBD in ADR-0010.
 * Set via `wrangler secret put <KEY_NAME>`.
 */

/**
 * @typedef {object} Template
 * @property {string} id - Stable id from the upstream source.
 * @property {string} name - Human-readable title.
 * @property {string} imageUrl - Absolute URL to the template image.
 * @property {number} width - Image width in pixels.
 * @property {number} height - Image height in pixels.
 */

/**
 * @typedef {Template & {score: number, reason?: string}} RankedTemplate
 */

/**
 * @typedef {object} WorkerEnv
 * @property {string} AI_API_KEY - AI provider API key, set as a Worker secret. Key name confirmed in ADR-0010.
 */

const clamp = (n) => Math.min(1, Math.max(0, Number(n) || 0));

/**
 * Builds the ranked result list from a raw AI provider response array.
 *
 * Filters out unknown template ids and zero-score entries, clamps scores to
 * [0, 1], and sorts by score descending with id ascending as a tiebreaker.
 *
 * @param {Array<{id: string, score: number, reason?: string}>} rankings - Raw rankings from the AI provider.
 * @param {Map<string, Template>} templateMap - Map of id to Template for the original candidates.
 * @returns {RankedTemplate[]} Filtered and sorted ranked templates.
 */
function buildResults(rankings, templateMap) {
  return rankings
    .filter(
      (r) =>
        r !== null &&
        typeof r === "object" &&
        typeof r.id === "string" &&
        templateMap.has(r.id) &&
        Number(r.score) > 0
    )
    .map((r) => ({
      ...templateMap.get(r.id),
      score: clamp(r.score),
      reason: typeof r.reason === "string" ? r.reason : undefined,
    }))
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}

/**
 * Ranks meme templates by relevance to a search query using an AI provider.
 *
 * Returns an empty array immediately when `query` is blank or `templates` is
 * empty, without calling the AI provider. Throws on provider HTTP errors or
 * malformed responses so the caller (`/api/search`) can map them to a 502.
 *
 * Ties between templates with the same score are broken by `template.id`
 * (ascending lexicographic order) for a stable, deterministic result.
 *
 * @param {string} query - The user's search text.
 * @param {Template[]} templates - Candidate templates to rank.
 * @param {WorkerEnv} env - Cloudflare Worker environment bindings.
 * @returns {Promise<RankedTemplate[]>} Relevant templates sorted by score descending.
 * @throws {Error} If the AI provider returns a non-OK HTTP status or invalid JSON.
 */
export async function rankTemplates(query, templates, env) {
  const normalized = String(query || "").trim();

  if (!normalized || templates.length === 0) {
    return [];
  }

  // TODO(ADR-0010 / #76): replace this block with the chosen provider's API call.
  // The provider receives `query` and the template list and must return a JSON
  // array of { id, score, reason } objects. `env.AI_API_KEY` holds the secret.
  // Until ADR-0010 lands, this function throws so callers get a clear signal.
  void env;
  throw new Error("AI ranking provider not yet configured — pending ADR-0010 (#76)");

  // The result-building logic below is already wired; it runs once the TODO
  // above is replaced with a real provider call that sets `rankings`.
  //
  // const templateMap = new Map(templates.map((t) => [t.id, t]));
  // return buildResults(rankings, templateMap);
}

export { buildResults };
