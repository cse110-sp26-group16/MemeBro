/**
 * Frontend API configuration.
 *
 * The MemeBro backend worker (memebro-api) is deployed on Cloudflare, not on
 * GitHub Pages where this site is served. So API calls must target the worker's
 * absolute origin — a relative path like `/api/search` 404s on Pages and is
 * silently swallowed by the client-side fallback (see issue #135).
 */

/**
 * Absolute origin of the deployed Cloudflare worker, with no trailing slash.
 *
 * Set this to the URL printed by `wrangler deploy` (looks like
 * `https://memebro-api.<your-subdomain>.workers.dev`). Leave it empty to use
 * same-origin relative paths, which is handy for local `wrangler dev` where the
 * worker and page share an origin.
 *
 * @type {string}
 */
export const WORKER_BASE_URL = "https://memebro-api.jjunaidi.workers.dev";
