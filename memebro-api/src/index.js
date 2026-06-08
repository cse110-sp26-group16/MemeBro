/**
 * @typedef {object} ExecutionContext
 * @property {(promise: Promise<unknown>) => void} waitUntil
 * @property {() => void} passThroughOnException
 */

/**
 * A meme image plus minimal metadata. Mirrors the Template shape in
 * docs/interface-contract.md.
 *
 * @typedef {object} Template
 * @property {string} id - Stable id from the upstream source (e.g. imgflip template id).
 * @property {string} name - Human-readable title.
 * @property {string} imageUrl - Absolute URL to the image.
 * @property {number} width - Image width in pixels.
 * @property {number} height - Image height in pixels.
 * @property {boolean} [popular] - True if returned from the popular list.
 */

/**
 * A Template plus an AI relevance ranking. Returned by GET /api/search.
 *
 * @typedef {Template & { score: number, reason?: string }} RankedTemplate
 */

/**
 * Static, pre-ranked templates returned when USE_FIXTURE === "true". Lets the
 * frontend develop against a stable response shape before the AI ranker
 * (issue #77) lands. Ordered by descending score.
 *
 * @type {RankedTemplate[]}
 */
const FIXTURE_RESULTS = [
  {
    id: "181913649",
    name: "Drake Hotline Bling",
    imageUrl: "https://i.imgflip.com/30b1gx.jpg",
    width: 1200,
    height: 1200,
    popular: true,
    score: 0.98,
    reason: "Fixture: classic approve/disapprove format",
  },
  {
    id: "112126428",
    name: "Distracted Boyfriend",
    imageUrl: "https://i.imgflip.com/1ur9b0.jpg",
    width: 1200,
    height: 800,
    popular: true,
    score: 0.91,
    reason: "Fixture: temptation / comparison format",
  },
  {
    id: "87743020",
    name: "Two Buttons",
    imageUrl: "https://i.imgflip.com/1g8my4.jpg",
    width: 600,
    height: 908,
    popular: true,
    score: 0.84,
    reason: "Fixture: difficult choice format",
  },
];

/**
 * Default Workers AI text-embedding model used to rank templates. Overridable
 * via the SEARCH_EMBED_MODEL var (see wrangler.jsonc) so the model can change
 * without a code edit. Chosen per ADR-0011 (AI provider for search ranking).
 *
 * @type {string}
 */
const DEFAULT_EMBED_MODEL = "@cf/baai/bge-base-en-v1.5";

/**
 * Maximum number of ranked templates returned for a single query.
 *
 * @type {number}
 */
const MAX_RESULTS = 20;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

/**
 * Returns a copy of the given response with the shared CORS_HEADERS merged in,
 * so the worker can be called from the browser frontend.
 *
 * @param {Response} response - The original response from the route handler.
 * @returns {Response} A new Response with the same status and body, plus CORS headers.
 */
function withCors(response) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * Fetches the candidate set to rank: ImgFlip's ~100 most-captioned templates.
 * Mapped to the shared Template shape (docs/interface-contract.md).
 *
 * @returns {Promise<Template[]>} The popular templates, each marked popular.
 * @throws {Error} When ImgFlip is unreachable or returns an unsuccessful body.
 */
async function getPopularTemplates() {
  const response = await fetch("https://api.imgflip.com/get_memes?type=image");

  if (!response.ok) {
    throw new Error(`ImgFlip HTTP error: ${response.status}`);
  }

  const json = await response.json();

  if (!json.success || !json.data || !Array.isArray(json.data.memes)) {
    throw new Error("ImgFlip returned an unsuccessful response");
  }

  return json.data.memes.map((meme) => ({
    id: meme.id,
    name: meme.name,
    imageUrl: meme.url,
    width: meme.width,
    height: meme.height,
    popular: true,
  }));
}

/**
 * Cosine similarity between two equal-length numeric vectors. Returns a value
 * in [-1, 1]; 0 when either vector has zero magnitude.
 *
 * @param {number[]} a - First embedding vector.
 * @param {number[]} b - Second embedding vector.
 * @returns {number} The cosine similarity of the two vectors.
 */
function cosineSimilarity(a, b) {
  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  if (magA === 0 || magB === 0) {
    return 0;
  }

  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

/**
 * Maps a similarity score to a human-readable note. Embeddings do not emit
 * prose, so `reason` is synthesized from score bands per ADR-0011.
 *
 * @param {number} score - A cosine-similarity score.
 * @returns {string} A short, human-readable match description.
 */
function describeScore(score) {
  if (score >= 0.7) {
    return "Strong semantic match";
  }
  if (score >= 0.5) {
    return "Likely match";
  }
  if (score >= 0.3) {
    return "Possible match";
  }
  return "Weak match";
}

/**
 * Naive, model-free ranking: case-insensitive title substring match. This is
 * the Option D fallback from ADR-0011, used when Workers AI is unavailable so
 * search degrades to lexical matching rather than failing.
 *
 * @param {string} query - The user's search text (already trimmed, non-empty).
 * @param {Template[]} templates - The candidate templates to rank.
 * @returns {RankedTemplate[]} Matching templates, highest score first.
 */
function rankTemplatesLexically(query, templates) {
  const needle = query.toLowerCase();

  return templates
    .filter((template) => template.name.toLowerCase().includes(needle))
    .slice(0, MAX_RESULTS)
    .map((template, index) => ({
      ...template,
      score: 1 - index / MAX_RESULTS,
      reason: template.name.toLowerCase() === needle ? "Exact title match" : "Partial title match",
    }));
}

/**
 * Ranks meme templates against the query using Workers AI text embeddings
 * (ADR-0011, Option A): embed the query and the template titles, then sort by
 * cosine similarity. If the Workers AI binding is missing or the embedding
 * call fails, this degrades to the lexical fallback (Option D) instead of
 * throwing, so a Workers AI outage downgrades search rather than breaking it.
 *
 * @param {string} query - The user's search text (already trimmed, non-empty).
 * @param {Record<string, unknown>} env - Worker environment bindings (AI binding, etc.).
 * @returns {Promise<RankedTemplate[]>} Templates ordered by descending score.
 * @throws {Error} Only if the candidate templates cannot be fetched.
 */
async function rankTemplates(query, env) {
  const templates = await getPopularTemplates();

  if (!env.AI || typeof env.AI.run !== "function") {
    return rankTemplatesLexically(query, templates);
  }

  try {
    const model = env.SEARCH_EMBED_MODEL || DEFAULT_EMBED_MODEL;

    const { data: titleVectors } = await env.AI.run(model, {
      text: templates.map((template) => template.name),
    });
    const {
      data: [queryVector],
    } = await env.AI.run(model, { text: [query] });

    return templates
      .map((template, index) => {
        const score = cosineSimilarity(queryVector, titleVectors[index]);
        return { ...template, score, reason: describeScore(score) };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_RESULTS);
  } catch {
    return rankTemplatesLexically(query, templates);
  }
}

/**
 * Handles GET /api/search?q=<query>, returning AI-ranked meme templates as
 * `{ results: RankedTemplate[] }`.
 *
 * - 400 `{ error: "missing query" }` when `q` is absent or blank.
 * - 200 `{ results: [...] }` on success (AI-ranked, or lexical fallback).
 * - 502 `{ error: "ranking failed" }` when the candidate templates cannot be
 *   fetched. (A Workers AI failure alone does not 502 — it degrades to lexical
 *   ranking inside rankTemplates per ADR-0011.)
 *
 * When `env.USE_FIXTURE === "true"` the route short-circuits to static fixture
 * data. This is a local/dev escape hatch only; production sets it to "false"
 * so the route calls the real ranker. CORS headers are added by the
 * entry-point wrapper.
 *
 * @param {URL} url - Parsed request URL carrying the `q` search param.
 * @param {Record<string, unknown>} env - Worker environment bindings.
 * @returns {Promise<Response>} The JSON search response.
 */
async function handleSearch(url, env) {
  const query = (url.searchParams.get("q") ?? "").trim();

  if (!query) {
    return Response.json({ error: "missing query" }, { status: 400 });
  }

  if (env.USE_FIXTURE === "true") {
    return Response.json({ results: FIXTURE_RESULTS });
  }

  try {
    const results = await rankTemplates(query, env);
    return Response.json({ results });
  } catch {
    return Response.json({ error: "ranking failed" }, { status: 502 });
  }
}

/**
 * Routes an incoming request to the matching handler. Implements
 * GET /api/status and GET /api/search; everything else returns 404.
 *
 * @param {Request} request - The incoming fetch request.
 * @param {Record<string, unknown>} env - Worker environment bindings.
 * @param {ExecutionContext} ctx - The Cloudflare Worker execution context.
 * @returns {Promise<Response>} The route response, or a 404 if no route matches.
 */
async function handleRequest(request, env, ctx) {
  const url = new URL(request.url);

  if (url.pathname === "/api/status" && request.method === "GET") {
    return Response.json({
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  }

  if (url.pathname === "/api/search" && request.method === "GET") {
    return handleSearch(url, env);
  }

  return new Response("Not Found", { status: 404 });
}

export default {
  /**
   * Cloudflare Worker entry point. Short-circuits CORS preflight OPTIONS
   * requests, then delegates routing to handleRequest and wraps the
   * response with CORS headers.
   *
   * @param {Request} request - The incoming fetch request.
   * @param {Record<string, unknown>} env - Worker environment bindings.
   * @param {ExecutionContext} ctx - The Cloudflare Worker execution context.
   * @returns {Promise<Response>} The final response sent to the client.
   */
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const response = await handleRequest(request, env, ctx);
    return withCors(response);
  },
};
