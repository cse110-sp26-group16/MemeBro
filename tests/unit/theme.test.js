import { describe, it, expect, beforeEach, vi } from "vitest";

// Isolate the theme logic from the persistence layer: storage.js touches
// localStorage (and Node 22's native localStorage shadows jsdom's), so we stub
// setTheme and just assert it is called with the right value.
const { setThemeMock } = vi.hoisted(() => ({ setThemeMock: vi.fn() }));
vi.mock("../../js/api/storage.js", () => ({ setTheme: setThemeMock }));

const { currentTheme, applyTheme, toggleTheme, wireToggle } = await import("../../js/theme.js");

describe("theme", () => {
  beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
    setThemeMock.mockClear();
  });

  describe("applyTheme", () => {
    it("sets data-theme on the document root", () => {
      applyTheme("dark");
      expect(document.documentElement.dataset.theme).toBe("dark");
    });

    it("treats any non-dark value as light so the page is never left unknown", () => {
      applyTheme("banana");
      expect(document.documentElement.dataset.theme).toBe("light");
    });
  });

  describe("currentTheme", () => {
    it("defaults to light when no theme is set", () => {
      expect(currentTheme()).toBe("light");
    });

    it("reads the applied theme", () => {
      applyTheme("dark");
      expect(currentTheme()).toBe("dark");
    });
  });

  describe("toggleTheme", () => {
    it("flips light to dark, applies it, and persists the choice", () => {
      applyTheme("light");
      const next = toggleTheme();
      expect(next).toBe("dark");
      expect(document.documentElement.dataset.theme).toBe("dark");
      expect(setThemeMock).toHaveBeenCalledWith("dark");
    });

    it("flips dark back to light", () => {
      applyTheme("dark");
      expect(toggleTheme()).toBe("light");
      expect(setThemeMock).toHaveBeenLastCalledWith("light");
    });
  });

  describe("wireToggle", () => {
    it("does not throw when the button is missing", () => {
      expect(() => wireToggle(null)).not.toThrow();
    });

    it("reflects the current theme in aria-pressed on wire-up", () => {
      applyTheme("dark");
      const button = document.createElement("button");
      wireToggle(button);
      expect(button.getAttribute("aria-pressed")).toBe("true");
    });

    it("toggles the theme and updates aria-pressed on click", () => {
      applyTheme("light");
      const button = document.createElement("button");
      wireToggle(button);
      expect(button.getAttribute("aria-pressed")).toBe("false");

      button.click();
      expect(currentTheme()).toBe("dark");
      expect(button.getAttribute("aria-pressed")).toBe("true");
      expect(setThemeMock).toHaveBeenCalledWith("dark");
    });
  });
});
