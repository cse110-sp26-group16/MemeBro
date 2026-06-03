import { describe, it, expect, beforeEach } from "vitest";
import "../../js/components/tab-bar.js";

/**
 * Mounts a fresh `<memebro-tab-bar>`, optionally with an initial active tab.
 * @param {string} [active] - initial value for the `active` attribute
 * @returns {HTMLElement} the connected tab-bar element
 */
function mountTabBar(active) {
  const bar = document.createElement("memebro-tab-bar");
  if (active) {
    bar.setAttribute("active", active);
  }
  document.body.appendChild(bar);
  return bar;
}

/**
 * Finds the tab anchor for a given tab id within the shadow root.
 * @param {HTMLElement} bar - the tab-bar element
 * @param {string} id - the tab id (`library | mine | search | settings`)
 * @returns {HTMLAnchorElement|null} the matching anchor, or null
 */
function tab(bar, id) {
  return bar.shadowRoot.querySelector(`.tab[data-tab="${id}"]`);
}

describe("<memebro-tab-bar>", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("is registered as a custom element", () => {
    expect(customElements.get("memebro-tab-bar")).toBeDefined();
  });

  it("observes the active attribute", () => {
    expect(customElements.get("memebro-tab-bar").observedAttributes).toEqual(["active"]);
  });

  it("mounts with an open shadow root and four tabs", () => {
    const bar = mountTabBar();
    expect(bar.shadowRoot).not.toBeNull();
    expect(bar.shadowRoot.querySelectorAll(".tab")).toHaveLength(4);
  });

  it("links each tab to its interface-contract route", () => {
    const bar = mountTabBar();
    expect(tab(bar, "library").getAttribute("href")).toBe("index.html");
    expect(tab(bar, "mine").getAttribute("href")).toBe("pages/history.html");
    expect(tab(bar, "search").getAttribute("href")).toBe("pages/search.html");
    expect(tab(bar, "settings").getAttribute("href")).toBe("#settings");
  });

  it("highlights the tab named by the initial active attribute", () => {
    const bar = mountTabBar("search");
    const searchTab = tab(bar, "search");
    expect(searchTab.classList.contains("tab--active")).toBe(true);
    expect(searchTab.getAttribute("aria-current")).toBe("page");
  });

  it("highlights exactly one tab at a time", () => {
    const bar = mountTabBar("library");
    const active = bar.shadowRoot.querySelectorAll(".tab--active");
    expect(active).toHaveLength(1);
    expect(active[0].dataset.tab).toBe("library");
  });

  it("moves the highlight reactively when the active attribute changes", () => {
    const bar = mountTabBar("library");
    expect(tab(bar, "library").classList.contains("tab--active")).toBe(true);

    bar.setAttribute("active", "settings");

    expect(tab(bar, "library").classList.contains("tab--active")).toBe(false);
    expect(tab(bar, "library").hasAttribute("aria-current")).toBe(false);
    expect(tab(bar, "settings").classList.contains("tab--active")).toBe(true);
    expect(tab(bar, "settings").getAttribute("aria-current")).toBe("page");
  });

  it("reflects the active property to the attribute and updates the highlight", () => {
    const bar = mountTabBar();
    bar.active = "mine";
    expect(bar.getAttribute("active")).toBe("mine");
    expect(bar.active).toBe("mine");
    expect(tab(bar, "mine").classList.contains("tab--active")).toBe(true);
  });

  it("highlights no tab when active is unset or unknown", () => {
    const bar = mountTabBar("not-a-tab");
    expect(bar.shadowRoot.querySelectorAll(".tab--active")).toHaveLength(0);
  });
});
