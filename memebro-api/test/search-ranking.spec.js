import { describe, it, expect, vi } from "vitest";
import { rankTemplates, buildResults } from "../src/search-ranking.js";

const MOCK_ENV = { AI_API_KEY: "test-key" };

const TEMPLATES = [
  {
    id: "drake",
    name: "Drake Hotline Bling",
    imageUrl: "https://i.imgflip.com/30b1gx.jpg",
    width: 1200,
    height: 1200,
  },
  {
    id: "distracted",
    name: "Distracted Boyfriend",
    imageUrl: "https://i.imgflip.com/1ur9b0.jpg",
    width: 1200,
    height: 800,
  },
  {
    id: "buttons",
    name: "Two Buttons",
    imageUrl: "https://i.imgflip.com/1g8my4.jpg",
    width: 600,
    height: 908,
  },
];

const TEMPLATE_MAP = new Map(TEMPLATES.map((t) => [t.id, t]));

describe("rankTemplates - empty / short-circuit cases", () => {
  it("returns [] for an empty string query without calling the provider", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const result = await rankTemplates("", TEMPLATES, MOCK_ENV).catch(() => null);
    expect(result).toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled();
    vi.restoreAllMocks();
  });

  it("returns [] for a whitespace-only query without calling the provider", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const result = await rankTemplates("   ", TEMPLATES, MOCK_ENV).catch(() => null);
    expect(result).toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled();
    vi.restoreAllMocks();
  });

  it("returns [] when templates array is empty without calling the provider", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const result = await rankTemplates("drake", [], MOCK_ENV).catch(() => null);
    expect(result).toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled();
    vi.restoreAllMocks();
  });
});

describe("buildResults - ranking and filtering logic", () => {
  it("returns templates ranked by score descending", () => {
    const raw = [
      { id: "distracted", score: 0.95, reason: "Direct name match" },
      { id: "drake", score: 0.4, reason: "Loose thematic match" },
    ];
    const result = buildResults(raw, TEMPLATE_MAP);
    expect(result[0].id).toBe("distracted");
    expect(result[0].score).toBe(0.95);
    expect(result[1].id).toBe("drake");
  });

  it("carries all Template fields through to the result", () => {
    const result = buildResults([{ id: "drake", score: 0.8, reason: "Match" }], TEMPLATE_MAP);
    expect(result[0]).toMatchObject({
      id: "drake",
      name: "Drake Hotline Bling",
      imageUrl: "https://i.imgflip.com/30b1gx.jpg",
      width: 1200,
      height: 1200,
      score: 0.8,
      reason: "Match",
    });
  });

  it("excludes templates scored at 0", () => {
    const raw = [
      { id: "drake", score: 0.9, reason: "Strong match" },
      { id: "distracted", score: 0, reason: "No match" },
    ];
    const result = buildResults(raw, TEMPLATE_MAP);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("drake");
  });

  it("excludes ids not present in the template map", () => {
    const raw = [
      { id: "drake", score: 0.9, reason: "Match" },
      { id: "unknown-id", score: 0.7, reason: "Ghost template" },
    ];
    const result = buildResults(raw, TEMPLATE_MAP);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("drake");
  });

  it("clamps scores above 1 down to 1", () => {
    const result = buildResults([{ id: "drake", score: 1.5, reason: "Over" }], TEMPLATE_MAP);
    expect(result[0].score).toBe(1);
  });

  it("returns [] when the raw rankings array is empty", () => {
    expect(buildResults([], TEMPLATE_MAP)).toEqual([]);
  });

  it("breaks equal scores by template id ascending", () => {
    const raw = [
      { id: "drake", score: 0.5, reason: "Tie" },
      { id: "buttons", score: 0.5, reason: "Tie" },
      { id: "distracted", score: 0.5, reason: "Tie" },
    ];
    const result = buildResults(raw, TEMPLATE_MAP);
    expect(result.map((r) => r.id)).toEqual(["buttons", "distracted", "drake"]);
  });

  it("produces a stable order on repeated calls with the same input", () => {
    const raw = [
      { id: "drake", score: 0.7, reason: "A" },
      { id: "distracted", score: 0.7, reason: "B" },
      { id: "buttons", score: 0.3, reason: "C" },
    ];
    const first = buildResults(raw, TEMPLATE_MAP).map((r) => r.id);
    const second = buildResults(raw, TEMPLATE_MAP).map((r) => r.id);
    expect(first).toEqual(second);
    expect(first).toEqual(["distracted", "drake", "buttons"]);
  });
});
