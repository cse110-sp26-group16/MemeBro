import { describe, it, expect, beforeEach } from "vitest";
import "../../js/components/template-gallery.js";

describe("Template Gallery", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders 6 default template cards", () => {
    const gallery = document.createElement("memebro-template-gallery");
    document.body.appendChild(gallery);

    const cards = gallery.shadowRoot.querySelectorAll(".template-card");

    expect(cards.length).toBe(6);
  });

  it("renders image src, alt, and template name correctly", () => {
    const gallery = document.createElement("memebro-template-gallery");
    document.body.appendChild(gallery);

    const image = gallery.shadowRoot.querySelector(".template-image");
    const name = gallery.shadowRoot.querySelector(".template-name");

    expect(image).not.toBeNull();
    expect(image.src).toContain("30b1gx.jpg");
    expect(image.alt).toBe("Drake Hotline Bling meme template");
    expect(name.textContent).toBe("Drake Hotline Bling");
  });

  it("renders AI badges only for AI templates", () => {
    const gallery = document.createElement("memebro-template-gallery");
    document.body.appendChild(gallery);

    const badges = gallery.shadowRoot.querySelectorAll(".badge");

    expect(badges.length).toBe(2);
  });

  it("updates gallery when data is set to one template", () => {
    const gallery = document.createElement("memebro-template-gallery");
    document.body.appendChild(gallery);

    gallery.data = [
      {
        id: "test",
        name: "Test Template",
        imageUrl: "test.jpg",
        useCount: "1",
        isAi: false,
      },
    ];

    const cards = gallery.shadowRoot.querySelectorAll(".template-card");
    const count = gallery.shadowRoot.querySelector(".count");

    expect(cards.length).toBe(1);
    expect(count.textContent).toContain("1");
  });

  it("renders 0 cards when data is null", () => {
    const gallery = document.createElement("memebro-template-gallery");
    document.body.appendChild(gallery);

    gallery.data = null;

    const cards = gallery.shadowRoot.querySelectorAll(".template-card");

    expect(cards.length).toBe(0);
  });

  it("attaches an open shadow root", () => {
    const gallery = document.createElement("memebro-template-gallery");

    expect(gallery.shadowRoot).not.toBeNull();
  });
});
