import { describe, it, expect, vi } from "vitest";
import { searchTemplatesWithAI } from "../../js/api/search-api";

vi.mock("../../js/api/imgflip-api.js", () => {
  const mockTemplates = [
    {
      id: "drake",
      name: "Drake Hotline Bling",
      imageUrl: "https://i.imgflip.com/30b1gx.jpg",
      width: 1200,
      height: 1200,
    },
    {
      id: "imgflip-distracted-id",
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

  return {
    getMemes: vi.fn().mockResolvedValue(mockTemplates),
  };
});

describe("Frontend Search - Client to Worker Fallback", () => {
  it("uses worker results when the worker's network call succeeds", async () => {
    const mockWorker = {
      results: [
        {
          id: "drake",
          score: 0.8,
          name: "Drake Hotline Bling",
        },
      ],
    };

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockWorker,
    });

    const results = await searchTemplatesWithAI("drake");

    expect(fetchSpy).toHaveBeenCalled();
    expect(results[0].id).toBe("drake");

    vi.restoreAllMocks();
  });

  it("falls back to local search when the worker has an error", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Offline Worker"));

    const results = await searchTemplatesWithAI("Boyfriend");

    expect(fetchSpy).toHaveBeenCalled();
    expect(results).toBeDefined();
    expect(results).toHaveLength(1);

    expect(results[0]).toMatchObject({
      id: "imgflip-distracted-id",
      name: "Distracted Boyfriend",
      reason: "Partial title match",
    });

    expect(results[0].score).toBe(1);

    vi.restoreAllMocks();
  });
});
