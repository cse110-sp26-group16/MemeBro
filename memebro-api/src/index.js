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
 * Ranks meme templates against the query using the AI ranking provider.
 *
 * The real implementation is owned by issue #77. Until it lands this throws,
 * so the /api/search route surfaces a 502 "ranking failed" response. Set the
 * USE_FIXTURE binding to "true" to bypass ranking with stub data meanwhile.
 *
 * @param {string} query - The user's search text (already trimmed, non-empty).
 * @param {Record<string, unknown>} env - Worker environment bindings (AI binding, etc.).
 * @returns {Promise<RankedTemplate[]>} Templates ordered by descending score.
 * @throws {Error} Until the AI ranker is implemented (#77).
 */
async function rankTemplates(query, env) {
  throw new Error("AI ranking not implemented yet (#77)");
}

/**
 * Handles GET /api/search?q=<query>, returning AI-ranked meme templates as
 * `{ results: RankedTemplate[] }`.
 *
 * - 400 `{ error: "missing query" }` when `q` is absent or blank.
 * - 200 `{ results: [...] }` on success.
 * - 502 `{ error: "ranking failed" }` when the ranking provider throws.
 *
 * When `env.USE_FIXTURE === "true"` the route short-circuits to static fixture
 * data so the frontend can build against a stable shape before the AI ranker
 * (issue #77) lands. CORS headers are added by the entry-point wrapper.
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
