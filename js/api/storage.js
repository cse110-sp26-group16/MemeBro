/**
 * @file The single client-side persistence layer for MemeBro.
 * `localStorage` is the only client-side store for sprint 2 (no IndexedDB, no
 * cookies). Every screen reads and writes through this module — components never
 * touch `localStorage` directly. That keeps the schema-version check in one place.
 *
 * Keys and shapes are frozen in docs/interface-contract.md. Do not invent new
 * ones here; change the contract first.
 */

/**
 * @typedef {object} Caption
 * @property {string} text
 * @property {number} x         Position from left as a 0 to 1 ratio of image width
 * @property {number} y         Position from top as a 0 to 1 ratio of image height
 * @property {number} fontSize  In px relative to image natural width
 * @property {string} color     CSS color string
 */

/**
 * @typedef {object} Meme
 * @property {string} id                 UUID generated client-side
 * @property {string} templateId         Matches Template.id
 * @property {string} templateImageUrl   Cached so the meme renders even if the upstream template moves
 * @property {Caption[]} captions
 * @property {'quick'|'conjure'} source  Which flow created it
 * @property {string} createdAt          ISO 8601 timestamp
 */

/**
 * @typedef {object} Template
 * @property {string} id           Stable id from the upstream source
 * @property {string} name         Human-readable title
 * @property {string} imageUrl     Absolute URL to the image
 * @property {number} width        Image width in pixels
 * @property {number} height       Image height in pixels
 * @property {boolean} [popular]   True if returned from the popular list
 */

/** @typedef {'light'|'dark'} Theme */

const KEY_MEMES = "memebro:memes";
const KEY_RECENT_TEMPLATES = "memebro:recent-templates";
const KEY_SCHEMA_VERSION = "memebro:schema-version";
const KEY_THEME = "memebro:theme";
const MAX_RECENT_TEMPLATES = 8;

/** Current storage schema version. Bump and add a migration if a shape changes. */
const SCHEMA_VERSION = 1;

/** @type {Theme} */
const DEFAULT_THEME = "light";

/**
 * Read and JSON-parse a key, returning a fallback on any failure.
 * Reads never throw — corrupt JSON or a missing/unavailable store falls back.
 * @template T
 * @param {string} key      The localStorage key to read
 * @param {T} fallback      Value returned when the key is absent or malformed
 * @returns {T} the parsed value, or `fallback`
 */
function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/**
 * JSON-serialize and write a value. Swallows quota/availability errors so a
 * failed write never crashes a screen.
 * @param {string} key    The localStorage key to write
 * @param {unknown} value The value to serialize and store
 * @returns {void}
 */
function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable or over quota — fail soft */
  }
}

/**
 * Ensure the persisted schema version is recorded and current. This is the one
 * and only place the schema version is checked, leaving a clear seam for future
 * migrations: when `SCHEMA_VERSION` changes, branch on the stored value here and
 * transform the data before stamping the new version.
 * @returns {void}
 */
function ensureSchemaVersion() {
  const stored = readJSON(KEY_SCHEMA_VERSION, null);
  if (stored === SCHEMA_VERSION) {
    return;
  }

  // Future migrations slot in here, e.g.:
  //   if (stored === 1) { /* migrate v1 -> v2 */ }
  // For now there is only one version, so we simply stamp it.
  writeJSON(KEY_SCHEMA_VERSION, SCHEMA_VERSION);
}

/**
 * Generate a client-side UUID. Uses `crypto.randomUUID` when available and
 * falls back to an RFC 4122 v4 string built from `crypto.getRandomValues`.
 * @returns {string} a UUID v4 string
 */
function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(
    16,
    20
  )}-${hex.slice(20, 32)}`;
}

/**
 * Read all saved memes, newest first as written. Never throws — an absent or
 * corrupt store yields an empty array.
 * @returns {Meme[]} the saved memes, or `[]` when none are stored
 */
export function getMemes() {
  ensureSchemaVersion();
  const memes = readJSON(KEY_MEMES, []);
  return Array.isArray(memes) ? memes : [];
}

/**
 * Persist a meme. If the meme has no `id`, one is generated client-side. An
 * existing meme with the same `id` is replaced (upsert); otherwise the meme is
 * appended. Returns nothing per the contract — read back with `getMemes()`.
 * @param {Meme} meme   The meme to save; `id` is generated when absent
 * @returns {void}
 */
export function saveMeme(meme) {
  ensureSchemaVersion();
  if (!meme || typeof meme !== "object") {
    return;
  }

  const toSave = { ...meme };
  if (typeof toSave.id !== "string" || toSave.id === "") {
    toSave.id = generateId();
  }
  if (typeof toSave.createdAt !== "string" || toSave.createdAt === "") {
    toSave.createdAt = new Date().toISOString();
  }

  const memes = getMemes();
  const index = memes.findIndex((m) => m && m.id === toSave.id);
  if (index === -1) {
    memes.push(toSave);
  } else {
    memes[index] = toSave;
  }
  writeJSON(KEY_MEMES, memes);
}

/**
 * Remove the meme with the given id. A no-op when the id is not present.
 * @param {string} id   The id of the meme to delete
 * @returns {void}
 */
export function deleteMeme(id) {
  ensureSchemaVersion();
  const memes = getMemes();
  const next = memes.filter((m) => !(m && m.id === id));
  writeJSON(KEY_MEMES, next);
}

/**
 * Read recently opened templates, most recent first.
 * @returns {Template[]} the recent templates, or `[]` when none are stored
 */
export function getRecentTemplates() {
  ensureSchemaVersion();
  const templates = readJSON(KEY_RECENT_TEMPLATES, []);
  return Array.isArray(templates) ? templates : [];
}

/**
 * Record a template as recently opened, deduped by id and capped.
 * @param {Template} template The template opened in the editor
 * @returns {void}
 */
export function recordRecentTemplate(template) {
  ensureSchemaVersion();
  if (!template || typeof template !== "object" || typeof template.id !== "string") {
    return;
  }

  const recent = getRecentTemplates().filter((item) => item && item.id !== template.id);
  recent.unshift({
    id: template.id,
    name: template.name,
    imageUrl: template.imageUrl,
    width: template.width,
    height: template.height,
    ...(template.popular === undefined ? {} : { popular: template.popular }),
  });

  writeJSON(KEY_RECENT_TEMPLATES, recent.slice(0, MAX_RECENT_TEMPLATES));
}

/**
 * Read the persisted theme. Defaults to `'light'` when unset, and falls back to
 * the default for any unrecognized stored value.
 * @returns {Theme} the stored theme, or the default
 */
export function getTheme() {
  ensureSchemaVersion();
  const theme = readJSON(KEY_THEME, DEFAULT_THEME);
  return theme === "light" || theme === "dark" ? theme : DEFAULT_THEME;
}

/**
 * Persist the theme choice. Ignores values other than `'light'` or `'dark'`.
 * @param {Theme} theme   The theme to persist
 * @returns {void}
 */
export function setTheme(theme) {
  ensureSchemaVersion();
  if (theme !== "light" && theme !== "dark") {
    return;
  }
  writeJSON(KEY_THEME, theme);
}
