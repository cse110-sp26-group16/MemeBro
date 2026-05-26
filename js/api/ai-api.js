**
 * @fileoverview Pure helper that builds the AI prompt string for meme generation.
 * No network calls live here — the actual API request is handled by js/api/conjure.js
 * once the backend platform is decided (ADR-0003).
 */

/**
 * @typedef {'photo'|'cartoon'|'3d-render'|'retro'|'painted'|'screenshot'} MemeStyle
 * @typedef {'1-panel'|'2-panel'|'3-panel'|'4-panel'} MemeLayout
 */

/**
 * @typedef {Object} ConjureInputs
 * @property {string}      concept         User's description of the meme situation or joke
 * @property {string}      [memeFormat]    Named template (e.g. "Drake Hotline Bling"). Omit to let the model choose.
 * @property {MemeStyle}   [style]         Visual style. Defaults to 'photo'.
 * @property {MemeLayout}  [layout]        Panel layout. Defaults to '1-panel'.
 * @property {string}      [referenceImage] Base64 data URL of the user's reference photo (optional).
 */

const SYSTEM_PROMPT = `You are MemeBro, a PG-13 meme generator.

Rules:
1. Keep content safe, non-hateful, and PG-13. No slurs, sexual content, graphic violence, or harassment of private individuals.
2. Self-deprecating, situational, or absurdist humor only — never punching down on appearance, identity, or protected class.
3. Preserve the canonical layout and text placement of the named meme format when one is provided.
4. If you cannot comply with a request, return ONLY: {"refusal": "<short friendly reason>"}
5. Always return valid JSON matching the specified output schema — never plain prose.`;

/**
 * Build a fully-formed prompt object for the AI meme generation backend.
 * Returns a JSON string with separate "system" and "user" keys so the backend
 * can pass each part to the AI provider in the correct role slot.
 *
 * Pure function — same inputs always produce the same output, no side effects.
 *
 * @param {ConjureInputs} inputs - User-supplied conjure parameters
 * @returns {string} JSON string: `{ "system": "...", "user": "..." }`
 * @throws {Error} If `inputs.concept` is missing or not a non-empty string
 */
export function buildAIPrompt(inputs) {
  if (!inputs || typeof inputs.concept !== 'string' || inputs.concept.trim() === '') {
    throw new Error('buildAIPrompt: inputs.concept is required and must be a non-empty string');
  }

  const {
    concept,
    memeFormat = null,
    style = 'photo',
    layout = '1-panel',
    referenceImage = null,
  } = inputs;

  const lines = [
    `Concept: ${concept.trim()}`,
    `Style: ${style}`,
    `Layout: ${layout}`,
  ];

  if (memeFormat) {
    lines.push(`Format: ${memeFormat}`);
  }

  if (referenceImage) {
    lines.push(`Reference image: ${referenceImage}`);
  }

  const outputSchema = memeFormat
    ? '{"top_text": "...", "bottom_text": "...", "image_treatment": "..."}'
    : '{"suggested_format": "...", "top_text": "...", "bottom_text": "...", "image_treatment": "..."}';

  lines.push('', `Return: ${outputSchema}`);

  return JSON.stringify({ system: SYSTEM_PROMPT, user: lines.join('\n') });
}
