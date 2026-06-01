/**
 * @typedef {object} Template
 * @property {string} id
 * @property {string} name
 * @property {string} imageUrl
 * @property {number} width
 * @property {number} height
 * @property {boolean} [popular]
 */

/**
 * @typedef {Template & {
 *   score: number,
 *   reason?: string,
 * }} RankedTemplate
 */

import { searchTemplatesWithAI } from "../api/search-api.js";

const SEARCH_DEBOUNCE_MS = 250;

/**
 * Stubbed shared bottom tab bar component.
 */
class MemebroTabBar extends HTMLElement {
  /**
   * Creates a tab bar shell using open shadow DOM.
   */
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  /**
   * Called when the tab bar is inserted into the DOM.
   */
  connectedCallback() {
    this.render();
  }

  /**
   * Renders the tab bar markup into the shadow root.
   */
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          background: var(--surface);
          border-top: 1px solid var(--line);
          box-shadow: var(--shadow-sm);
        }

        nav {
          display: flex;
          justify-content: space-between;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
        }

        a {
          flex: 1;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          text-decoration: none;
          color: var(--ink-3);
          font-size: var(--text-xs);
        }

        a[aria-current="page"] {
          color: var(--ink);
          font-weight: 700;
        }
      </style>
      <nav aria-label="Primary navigation">
        <a href="../index.html">Library</a>
        <a href="search.html" aria-current="page">Search</a>
        <a href="conjure.html">Conjure</a>
        <a href="../pages/history.html">History</a>
      </nav>
    `;
  }
}

customElements.define("memebro-tab-bar", MemebroTabBar);

/**
 * Search screen for AI-ranked template search.
 * @augments {HTMLElement}
 */
export class MemebroSearch extends HTMLElement {
  /**
   * Creates the search screen and attaches an open shadow root.
   */
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.query = "";
    this.results = [];
    this.exactCount = 0;
    this.partialCount = 0;
    this.debounceTimer = null;
    this.boundInput = this.handleInput.bind(this);
    this.boundClick = this.handleResultClick.bind(this);
  }

  /**
   * Connects the component and installs event listeners.
   */
  connectedCallback() {
    this.render();
    this.shadowRoot.addEventListener("input", this.boundInput);
    this.shadowRoot.addEventListener("click", this.boundClick);
  }

  /**
   * Cleans up timers and event listeners when the component disconnects.
   */
  disconnectedCallback() {
    clearTimeout(this.debounceTimer);
    this.shadowRoot.removeEventListener("input", this.boundInput);
    this.shadowRoot.removeEventListener("click", this.boundClick);
  }

  /**
   * Handles text input and schedules a debounced search.
   * @param {Event} event The input event from the search field.
   */
  async handleInput(event) {
    const target = event.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    if (target.id !== "search-input") {
      return;
    }

    this.query = target.value;
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.performSearch();
    }, SEARCH_DEBOUNCE_MS);
  }

  /**
   * Queries the AI search API and updates the result counts.
   * @returns {Promise<void>}
   */
  async performSearch() {
    const normalized = this.query.trim();

    if (!normalized) {
      this.results = [];
      this.exactCount = 0;
      this.partialCount = 0;
      this.render();
      return;
    }

    const results = await searchTemplatesWithAI(normalized);
    this.results = Array.isArray(results) ? results : [];
    this.exactCount = this.results.filter(
      (result) => result.name.toLowerCase() === normalized.toLowerCase()
    ).length;
    this.partialCount = this.results.length - this.exactCount;
    this.render();
  }

  /**
   * Dispatches the selected template event when a result card is tapped.
   * @param {Event} event The click event from the shadow DOM.
   */
  handleResultClick(event) {
    const card = event.target.closest(".result-card");

    if (!(card instanceof HTMLAnchorElement)) {
      return;
    }

    const templateId = card.dataset.templateId;
    if (!templateId) {
      return;
    }

    const template = this.results.find((item) => item.id === templateId);

    if (!template) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent("memebro:template-selected", {
        detail: { template },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Renders the full search screen UI into the shadow DOM.
   */
  render() {
    const hasResults = this.results.length > 0;
    const showQuery = this.query.trim().length > 0;
    const resultHeading = showQuery ? `Results for “${this.query.trim()}”` : "Search results";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          min-height: 100vh;
          background: var(--bg);
          color: var(--ink);
          font-family: inherit;
        }

        *, *::before, *::after {
          box-sizing: border-box;
        }

        .page {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          padding: var(--space-5);
          gap: var(--space-5);
        }

        .search-panel {
          display: grid;
          gap: var(--space-4);
        }

        .search-label {
          color: var(--ink-3);
          font-size: var(--text-sm);
          letter-spacing: var(--tracking-wide);
          text-transform: uppercase;
        }

        .search-field {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          width: 100%;
          border: 1px solid var(--line);
          border-radius: var(--radius-xl);
          background: var(--surface);
          padding: var(--space-3) var(--space-4);
          box-shadow: var(--shadow-sm);
        }

        .search-field input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          color: var(--ink);
          font-size: var(--text-base);
        }

        .search-field input::placeholder {
          color: var(--ink-3);
        }

        .icon {
          color: var(--orange-deep);
          font-size: 1rem;
        }

        .clear-button {
          border: none;
          background: transparent;
          color: var(--ink-3);
          font-size: 1.3rem;
          line-height: 1;
          padding: 0;
        }

        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: var(--space-3);
          margin-bottom: var(--space-2);
        }

        .title {
          font-size: var(--text-2xl);
          font-weight: 700;
          letter-spacing: -0.03em;
          margin: 0;
        }

        .counts {
          color: var(--ink-3);
          font-size: var(--text-sm);
          white-space: nowrap;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: var(--space-3);
        }

        .result-card {
          display: block;
          text-decoration: none;
          color: inherit;
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        .image-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          background: var(--surface-2);
          overflow: hidden;
        }

        .result-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .card-body {
          padding: var(--space-3);
          display: grid;
          gap: var(--space-2);
        }

        .template-name {
          margin: 0;
          font-size: var(--text-sm);
          font-weight: 700;
          line-height: 1.2;
        }

        .template-meta {
          display: flex;
          justify-content: space-between;
          gap: var(--space-2);
          color: var(--ink-3);
          font-size: var(--text-xs);
        }

        .reason {
          margin: 0;
          color: var(--ink-3);
          font-size: 0.75rem;
          line-height: 1.4;
        }

        .empty-state {
          margin: 0;
          color: var(--ink-3);
          font-size: var(--text-base);
          line-height: 1.6;
        }

        .conjure-card {
          display: grid;
          gap: var(--space-3);
          padding: var(--space-4);
          border-radius: var(--radius-xl);
          border: 1px solid var(--orange);
          background: var(--orange-soft);
          box-shadow: var(--shadow-sm);
        }

        .conjure-label {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-weight: 700;
          color: var(--ink);
        }

        .conjure-title {
          font-size: var(--text-lg);
          margin: 0;
          line-height: 1.2;
        }

        .conjure-copy {
          margin: 0;
          color: var(--ink-2);
          font-size: var(--text-sm);
          line-height: 1.5;
        }

        .conjure-actions {
          display: flex;
          justify-content: flex-start;
        }

        .conjure-button {
          border: none;
          background: var(--orange);
          color: var(--surface);
          padding: var(--space-3) var(--space-4);
          font-size: var(--text-base);
          border-radius: 999px;
          box-shadow: var(--shadow-sm);
        }

        .tab-wrapper {
          margin-top: auto;
        }
      </style>
      <div class="page">
        <section class="search-panel">
          <div class="search-label">Search</div>
          <div class="search-field">
            <span class="icon" aria-hidden="true">⌕</span>
            <input
              id="search-input"
              type="search"
              autocomplete="off"
              placeholder="Search templates or describe a meme"
              value="${this.query}"
            />
            <button class="clear-button" type="button" aria-label="Clear search">×</button>
          </div>
        </section>

        <section class="search-results">
          <div class="header-row">
            <h2 class="title">${resultHeading}</h2>
            <div class="counts">${this.exactCount} exact · ${this.partialCount} partial</div>
          </div>

          ${
            hasResults
              ? `<div class="results-grid">${this.results
                  .map(
                    (template) => `
                <a
                  class="result-card"
                  href="editor.html?templateId=${encodeURIComponent(template.id)}"
                  data-template-id="${template.id}"
                >
                  <div class="image-frame">
                    <img
                      class="result-image"
                      src="${template.imageUrl}"
                      alt="${template.name} template"
                    />
                  </div>
                  <div class="card-body">
                    <p class="template-name">${template.name}</p>
                    <div class="template-meta">
                      <span>Score ${template.score.toFixed(2)}</span>
                      <span>${template.reason || "AI match"}</span>
                    </div>
                  </div>
                </a>
              `
                  )
                  .join("")}</div>`
              : `<p class="empty-state">Try a different keyword, or conjure it.</p>`
          }

          <div class="conjure-card">
            <div class="conjure-label">
              <span aria-hidden="true">✦</span>
              <p class="conjure-title">Can’t find ${showQuery ? `“${this.query.trim()}”` : "it"}? Let AI conjure it.</p>
            </div>
            <p class="conjure-copy">Generate a custom template</p>
            <div class="conjure-actions">
              <button class="conjure-button" type="button">generate ✦</button>
            </div>
          </div>
        </section>

        <div class="tab-wrapper">
          <memebro-tab-bar></memebro-tab-bar>
        </div>
      </div>
    `;
  }
}

customElements.define("memebro-search", MemebroSearch);
