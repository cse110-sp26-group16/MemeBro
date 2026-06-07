const STORAGE_KEY = "memebro:memes";

/**
 * @typedef {object} Meme
 * @property {string} id
 * @property {string} templateId
 * @property {string} templateImageUrl
 * @property {object[]} captions
 * @property {'quick'|'conjure'} source
 * @property {string} createdAt
 */

const defaultMemes = [
  {
    id: "demo-1",
    templateId: "drake",
    templateImageUrl: "https://i.imgflip.com/30b1gx.jpg",
    captions: [{ text: "When the history page finally works" }],
    source: "quick",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "demo-2",
    templateId: "distracted-boyfriend",
    templateImageUrl: "https://i.imgflip.com/1ur9b0.jpg",
    captions: [{ text: "Me writing code vs. me fixing the bug" }],
    source: "conjure",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

/**
 * Seed localStorage with default demo memes.
 * @returns {Meme[]}
 */
function seedDefaultMemes() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMemes));
  return defaultMemes;
}

/**
 * Get all saved memes from localStorage, seeding with defaults if needed.
 * @returns {Meme[]}
 */
export function getMemes() {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return seedDefaultMemes();
  }

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return seedDefaultMemes();
    }
    return parsed;
  } catch {
    return seedDefaultMemes();
  }
}

/**
 * Remove a saved meme by id.
 * @param {string} id - Meme id to delete.
 * @returns {void}
 */
export function deleteMeme(id) {
  const memes = getMemes().filter((meme) => meme.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memes));
}
