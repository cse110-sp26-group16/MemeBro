/**
 * @typedef {object} ExecutionContext
 * @property {(promise: Promise<unknown>) => void} waitUntil
 * @property {() => void} passThroughOnException
 */

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
 * Routes an incoming request to the matching handler. Currently only
 * GET /api/status is implemented; everything else returns 404.
 *
 * @param {Request} request - The incoming fetch request.
 * @param {Record<string, unknown>} env - Worker environment bindings (none used yet).
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
