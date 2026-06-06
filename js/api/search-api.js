/**
 * @typedef {object} Template
 * @property {string} id
 * @property {string} name
 * @property {string} imageUrl
 * @property {number} width
 * @property {number} height
 * @property {boolean} [popular]
 */

/**
 * @typedef {Template & {
 *   score: number,
 *   reason?: string,
 * }} RankedTemplate
 */

import { getMemes } from "./imgflip-api.js";
import { WORKER_BASE_URL } from "./config.js";

/**
 * Performs an AI-ranked template search.
 * @param {string} query The user's search text.
 * @returns {Promise<RankedTemplate[]>} Ranked templates, highest score first.
 */
export async function searchTemplatesWithAI(query) {
  const normalized = String(query || "").trim();

  if (!normalized) {
    return [];
  }

  // Call the deployed worker's absolute URL; it sends CORS. WORKER_BASE_URL is
  // empty for local same-origin dev, in which case this stays a relative path.
  const endpoint = `${WORKER_BASE_URL}/api/search?q=${encodeURIComponent(normalized)}`;

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`Search endpoint returned status ${response.status}`);
    }

    const json = await response.json();

    if (!json || !Array.isArray(json.results)) {
      throw new Error("Invalid search response shape");
    }

    return json.results;
  } catch (error) {
    const memes = await getMemes("image");
    const normalizedText = normalized.toLowerCase();

    return memes
      .filter((template) => String(template.name).toLowerCase().includes(normalizedText))
      .slice(0, 20)
      .map((template, index) => ({
        id: template.id,
        name: template.name,
        imageUrl: template.imageUrl || template.url || "",
        width: template.width,
        height: template.height,
        score: 1 - index / 20,
        reason:
          String(template.name).toLowerCase() === normalizedText
            ? "Exact title match"
            : "Partial title match",
      }));
  }
}
