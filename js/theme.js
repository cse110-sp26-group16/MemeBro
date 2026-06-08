/**
 * @file Dark/light theme control shared across Home, Editor, and Search.
 *
 * The active theme lives as `data-theme` on `<html>`. A small synchronous
 * script in each page's `<head>` sets that attribute before first paint (so
 * there is no flash), reading the saved choice or falling back to the OS
 * `prefers-color-scheme`. This module owns the runtime behavior: flipping the
 * theme on click and persisting the choice through `storage.js`.
 */

import { setTheme } from "./api/storage.js";

/**
 * Read the theme currently applied to the document root.
 * @returns {'light'|'dark'} the active theme
 */
export function currentTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

/**
 * Apply a theme to the document root. Any value other than `'dark'` is treated
 * as light, so callers cannot leave the page in an unknown state.
 * @param {'light'|'dark'} theme   the theme to apply
 * @returns {void}
 */
export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme === "dark" ? "dark" : "light";
}

/**
 * Flip the active theme, apply it to the document, and persist the choice.
 * @returns {'light'|'dark'} the newly applied theme
 */
export function toggleTheme() {
  const next = currentTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  setTheme(next);
  return next;
}

/**
 * Wire a stable toggle button: reflect the current theme in `aria-pressed` and
 * flip on click. For chrome that re-renders (e.g. the search screen), call
 * {@link toggleTheme} from the existing delegated handler instead.
 * @param {HTMLElement|null} button   the toggle control, or null if absent
 * @returns {void}
 */
export function wireToggle(button) {
  if (!button) {
    return;
  }
  button.setAttribute("aria-pressed", String(currentTheme() === "dark"));
  button.addEventListener("click", () => {
    const theme = toggleTheme();
    button.setAttribute("aria-pressed", String(theme === "dark"));
  });
}
