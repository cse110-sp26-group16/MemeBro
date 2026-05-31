import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../js/components/template-gallery.js";

const SAFE = {
  id: "safe",
  name: "Drake Hotline Bling",
  imageUrl: "https://i.imgflip.com/30b1gx.jpg",
  useCount: "1.2M",
  isAi: false,
};

function mount(templates) {
  const el = document.createElement("memebro-template-gallery");
  document.body.appendChild(el);
  if (templates !== undefined) el.data = templates;
  return el;
}

describe("MemebroTemplateGallery – rendering", () => {
  let el;

  afterEach(() => el.remove());

  it("renders one card per template", () => {
    el = mount([SAFE, { ...SAFE, id: "b" }, { ...SAFE, id: "c" }]);
    const cards = el.shadowRoot.querySelectorAll(".template-card");
    expect(cards.length).toBe(3);
  });

  it("shows the correct template count", () => {
    el = mount([SAFE, { ...SAFE, id: "b" }]);
    expect(el.shadowRoot.querySelector(".count").textContent).toBe("2 templates");
  });

  it("renders the image src and alt from template data", () => {
    el = mount([SAFE]);
    const img = el.shadowRoot.querySelector(".template-image");
    expect(img.getAttribute("src")).toBe(SAFE.imageUrl);
    expect(img.getAttribute("alt")).toContain("Drake Hotline Bling");
  });

  it("shows the AI badge only when isAi is true", () => {
    el = mount([{ ...SAFE, isAi: true }]);
    expect(el.shadowRoot.querySelector(".badge")).not.toBeNull();
  });

  it("omits the AI badge when isAi is false", () => {
    el = mount([SAFE]);
    expect(el.shadowRoot.querySelector(".badge")).toBeNull();
  });

  it("treats a non-array data value as empty", () => {
    el = mount(null);
    expect(el.shadowRoot.querySelectorAll(".template-card").length).toBe(0);
  });
});

describe("MemebroTemplateGallery – XSS protection", () => {
  let el;

  afterEach(() => el.remove());

  it("does not create a <script> element when name contains tags", () => {
    el = mount([{ ...SAFE, name: "</h2><script>alert(1)</script>" }]);
    expect(el.shadowRoot.querySelector("script")).toBeNull();
  });

  it("renders the malicious name as safe text content, not markup", () => {
    const payload = "</h2><script>alert(1)</script>";
    el = mount([{ ...SAFE, name: payload }]);
    const h2 = el.shadowRoot.querySelector(".template-name");
    expect(h2.textContent.trim()).toBe(payload);
    expect(h2.querySelector("script")).toBeNull();
  });

  it('does not inject event handlers when name contains a " breakout attempt', () => {
    el = mount([{ ...SAFE, name: 'x" onmouseover="alert(1)' }]);
    const allElements = [...el.shadowRoot.querySelectorAll("*")];
    for (const elem of allElements) {
      expect(elem.hasAttribute("onmouseover")).toBe(false);
    }
  });

  it("escapes & in template.name to an HTML entity in text content", () => {
    el = mount([{ ...SAFE, name: "Tom & Jerry" }]);
    expect(el.shadowRoot.querySelector(".template-name").innerHTML.trim()).toBe(
      "Tom &amp; Jerry"
    );
  });

  it("does not create a <script> element when imageUrl contains tags", () => {
    el = mount([{ ...SAFE, imageUrl: 'https://evil.com/"><script>alert(1)</script>' }]);
    expect(el.shadowRoot.querySelector("script")).toBeNull();
  });

  it("does not inject event handlers via imageUrl breakout", () => {
    el = mount([{ ...SAFE, imageUrl: 'x" onerror="alert(1)' }]);
    const img = el.shadowRoot.querySelector(".template-image");
    expect(img.hasAttribute("onerror")).toBe(false);
  });

  it("does not create HTML elements when useCount contains tags", () => {
    el = mount([{ ...SAFE, useCount: "<b>lots</b>" }]);
    const meta = el.shadowRoot.querySelector(".meta");
    expect(meta.querySelector("b")).toBeNull();
  });
});
