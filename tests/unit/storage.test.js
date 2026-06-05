import { describe, it, expect, beforeEach } from "vitest";

// Node 20+ ships an experimental native localStorage that shadows jsdom's and is
// inert without --localstorage-file. Install a standards-compliant in-memory
// mock so these tests exercise the storage module deterministically anywhere.
/** Minimal in-memory Web Storage implementation for tests. */
class MemoryStorage {
  /** @type {Map<string, string>} */
  #store = new Map();

  /**
   * Number of stored entries.
   * @returns {number} the entry count
   */
  get length() {
    return this.#store.size;
  }

  /**
   * Read a stored value.
   * @param {string} key - the key to read
   * @returns {string|null} the value, or null when absent
   */
  getItem(key) {
    return this.#store.has(String(key)) ? this.#store.get(String(key)) : null;
  }

  /**
   * Write a value.
   * @param {string} key - the key to write
   * @param {string} value - the value to store
   * @returns {void}
   */
  setItem(key, value) {
    this.#store.set(String(key), String(value));
  }

  /**
   * Remove a key.
   * @param {string} key - the key to remove
   * @returns {void}
   */
  removeItem(key) {
    this.#store.delete(String(key));
  }

  /**
   * Remove all keys.
   * @returns {void}
   */
  clear() {
    this.#store.clear();
  }
}

Object.defineProperty(globalThis, "localStorage", {
  value: new MemoryStorage(),
  configurable: true,
  writable: true,
});

const { getMemes, saveMeme, deleteMeme, getTheme, setTheme } =
  await import("../../js/api/storage.js");

const KEY_MEMES = "memebro:memes";
const KEY_SCHEMA_VERSION = "memebro:schema-version";
const KEY_THEME = "memebro:theme";

/**
 * Build a valid Meme matching the interface-contract shape.
 * @param {Partial<import("../../js/api/storage.js").Meme>} [overrides] - fields to override
 * @returns {import("../../js/api/storage.js").Meme} a Meme object
 */
function makeMeme(overrides = {}) {
  return {
    id: "meme-1",
    templateId: "imgflip-181913649",
    templateImageUrl: "https://i.imgflip.com/30b1gx.jpg",
    captions: [{ text: "hello", x: 0.5, y: 0.1, fontSize: 32, color: "#fff" }],
    source: "quick",
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("getMemes", () => {
    it("returns an empty array when the store is empty", () => {
      expect(getMemes()).toEqual([]);
    });

    it("returns an empty array when the value is corrupt JSON", () => {
      localStorage.setItem(KEY_MEMES, "{not valid json");
      expect(getMemes()).toEqual([]);
    });

    it("returns an empty array when the stored value is not an array", () => {
      localStorage.setItem(KEY_MEMES, JSON.stringify({ nope: true }));
      expect(getMemes()).toEqual([]);
    });
  });

  describe("saveMeme / getMemes round-trip", () => {
    it("saves a meme and reads it back unchanged", () => {
      const meme = makeMeme();
      saveMeme(meme);
      expect(getMemes()).toEqual([meme]);
    });

    it("persists across separate reads (simulating a reload)", () => {
      saveMeme(makeMeme({ id: "a" }));
      saveMeme(makeMeme({ id: "b" }));
      const reloaded = getMemes();
      expect(reloaded.map((m) => m.id)).toEqual(["a", "b"]);
    });

    it("does not add extra or renamed fields", () => {
      const meme = makeMeme();
      saveMeme(meme);
      const [stored] = getMemes();
      expect(Object.keys(stored).sort()).toEqual(
        ["captions", "createdAt", "id", "source", "templateId", "templateImageUrl"].sort()
      );
    });

    it("generates a UUID id when the meme has none", () => {
      const { id, ...withoutId } = makeMeme();
      void id;
      saveMeme(withoutId);
      const [stored] = getMemes();
      expect(typeof stored.id).toBe("string");
      expect(stored.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    it("upserts a meme with an existing id rather than duplicating", () => {
      saveMeme(makeMeme({ id: "x", source: "quick" }));
      saveMeme(makeMeme({ id: "x", source: "conjure" }));
      const memes = getMemes();
      expect(memes).toHaveLength(1);
      expect(memes[0].source).toBe("conjure");
    });
  });

  describe("deleteMeme", () => {
    it("removes the meme with the matching id", () => {
      saveMeme(makeMeme({ id: "a" }));
      saveMeme(makeMeme({ id: "b" }));
      deleteMeme("a");
      expect(getMemes().map((m) => m.id)).toEqual(["b"]);
    });

    it("is a no-op when the id is not present", () => {
      saveMeme(makeMeme({ id: "a" }));
      deleteMeme("missing");
      expect(getMemes().map((m) => m.id)).toEqual(["a"]);
    });

    it("does not throw when the store is empty", () => {
      expect(() => deleteMeme("anything")).not.toThrow();
      expect(getMemes()).toEqual([]);
    });
  });

  describe("getTheme / setTheme", () => {
    it("defaults to light when unset", () => {
      expect(getTheme()).toBe("light");
    });

    it("round-trips a saved theme", () => {
      setTheme("dark");
      expect(getTheme()).toBe("dark");
    });

    it("falls back to light for a corrupt value", () => {
      localStorage.setItem(KEY_THEME, "{bad json");
      expect(getTheme()).toBe("light");
    });

    it("falls back to light for an unrecognized value", () => {
      localStorage.setItem(KEY_THEME, JSON.stringify("neon"));
      expect(getTheme()).toBe("light");
    });

    it("ignores invalid theme values on write", () => {
      setTheme("dark");
      // @ts-expect-error testing invalid input
      setTheme("rainbow");
      expect(getTheme()).toBe("dark");
    });
  });

  describe("schema version", () => {
    it("stamps the current schema version on first access", () => {
      getMemes();
      expect(localStorage.getItem(KEY_SCHEMA_VERSION)).toBe("1");
    });

    it("leaves an already-current version untouched", () => {
      localStorage.setItem(KEY_SCHEMA_VERSION, "1");
      saveMeme(makeMeme());
      expect(localStorage.getItem(KEY_SCHEMA_VERSION)).toBe("1");
    });
  });
});
