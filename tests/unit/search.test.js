import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import "../../js/components/search.js";

const buildResponse = (results) => ({
  ok: true,
  json: async () => ({ results }),
});

describe("Memebro search screen", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("mounts and renders the search input", () => {
    const search = document.createElement("memebro-search");
    document.body.appendChild(search);

    const input = search.shadowRoot.querySelector("#search-input");
    expect(input).not.toBeNull();
    expect(input.placeholder).toBe("Search templates or describe a meme");
  });

  it("performs a debounced search and fires memebro:template-selected on tap", async () => {
    const mockResults = [
      {
        id: "test-id",
        name: "Test template",
        imageUrl: "https://example.com/test.jpg",
        width: 500,
        height: 500,
        score: 0.91,
        reason: "Partial title match",
      },
    ];

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => buildResponse(mockResults))
    );

    const search = document.createElement("memebro-search");
    document.body.appendChild(search);

    const input = search.shadowRoot.querySelector("#search-input");
    input.value = "test";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));

    await new Promise((resolve) => setTimeout(resolve, 300));

    const cards = search.shadowRoot.querySelectorAll(".result-card");
    expect(cards.length).toBe(1);
    expect(cards[0].href).toContain("editor.html?templateId=test-id");

    const selected = new Promise((resolve) => {
      document.addEventListener("memebro:template-selected", (event) => resolve(event), {
        once: true,
      });
    });

    cards[0].click();

    const event = await selected;
    expect(event.detail.template.id).toBe("test-id");
  });
});
