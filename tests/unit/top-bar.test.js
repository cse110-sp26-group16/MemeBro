import { describe, it, expect, beforeEach } from "vitest";
import "../../js/components/top-bar.js";

/**
 * Mounts a fresh `<memebro-top-bar>` in the document body.
 * @returns {HTMLElement} the connected top-bar element
 */
function mountTopBar() {
  const bar = document.createElement("memebro-top-bar");
  document.body.appendChild(bar);
  return bar;
}

describe("<memebro-top-bar>", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("is registered as a custom element", () => {
    expect(customElements.get("memebro-top-bar")).toBeDefined();
  });

  it("mounts with an open shadow root", () => {
    const bar = mountTopBar();
    expect(bar.shadowRoot).not.toBeNull();
    expect(bar.shadowRoot.querySelector(".bar")).not.toBeNull();
  });

  it("exposes the three named slots", () => {
    const bar = mountTopBar();
    const slotNames = [...bar.shadowRoot.querySelectorAll("slot")].map((slot) =>
      slot.getAttribute("name")
    );
    expect(slotNames).toEqual(["breadcrumb", "search-input", "actions"]);
  });

  it("renders content projected into each named slot", () => {
    const bar = mountTopBar();

    const crumb = document.createElement("span");
    crumb.setAttribute("slot", "breadcrumb");
    crumb.textContent = "memebro / all templates";

    const input = document.createElement("input");
    input.setAttribute("slot", "search-input");

    const action = document.createElement("button");
    action.setAttribute("slot", "actions");
    action.textContent = "Conjure";

    bar.append(crumb, input, action);

    const assignedFor = (name) =>
      bar.shadowRoot.querySelector(`slot[name="${name}"]`).assignedNodes({ flatten: true });

    expect(assignedFor("breadcrumb")).toContain(crumb);
    expect(assignedFor("search-input")).toContain(input);
    expect(assignedFor("actions")).toContain(action);
  });
});
