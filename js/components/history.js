/**
 * History screen for saved memes.
 *
 * Reads saved memes from the storage API and renders them in a mobile-first grid.
 * Emits memebro:meme-deleted when a meme is removed and refreshes when memebro:meme-saved fires.
 */
import * as storage from "../api/storage.stub.js";

const EVENT_MEME_SAVED = "memebro:meme-saved";
const EVENT_MEME_DELETED = "memebro:meme-deleted";

/**
 * @typedef {object} Caption
 * @property {string} text
 */

/**
 * @typedef {object} Meme
 * @property {string} id
 * @property {string} templateId
 * @property {string} templateImageUrl
 * @property {Caption[]} captions
 * @property {'quick'|'conjure'} source
 * @property {string} createdAt
 */

/**
 * History component that renders saved memes and supports deletion.
 * @augments HTMLElement
 */
class MemebroHistory extends HTMLElement {
  /**
   * Create the history component and bind event handlers.
   */
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.memes = [];
    this.handleDocumentEvent = this.handleDocumentEvent.bind(this);
    this.handleCardClick = this.handleCardClick.bind(this);
  }

  /**
   * Attach event listeners and render initial content.
   */
  connectedCallback() {
    this.render();
    window.addEventListener(EVENT_MEME_SAVED, this.handleDocumentEvent);
    this.shadowRoot.addEventListener("click", this.handleCardClick);
    this.refreshMemes();
  }

  /**
   * Remove event listeners when the component is disconnected.
   */
  disconnectedCallback() {
    window.removeEventListener(EVENT_MEME_SAVED, this.handleDocumentEvent);
    this.shadowRoot.removeEventListener("click", this.handleCardClick);
  }

  /**
   * Handle a global meme-saved event by refreshing the list.
   * @param {Event} event - The custom event dispatched when a meme is saved.
   * @returns {void}
   */
  handleDocumentEvent(event) {
    if (event.type === EVENT_MEME_SAVED) {
      this.refreshMemes();
    }
  }

  /**
   * Handle clicks inside the shadow DOM and delete a saved meme.
   * @param {MouseEvent} event - The click event inside the shadow DOM.
   * @returns {void}
   */
  handleCardClick(event) {
    const deleteButton = event.target.closest("[data-delete-id]");
    if (!deleteButton) {
      return;
    }

    const memeId = deleteButton.getAttribute("data-delete-id");
    if (!memeId) {
      return;
    }

    storage.deleteMeme(memeId);
    this.dispatchEvent(
      new CustomEvent(EVENT_MEME_DELETED, {
        detail: { id: memeId },
        bubbles: true,
        composed: true,
      })
    );

    this.refreshMemes();
  }

  /**
   * Read memes from storage and re-render the component.
   * @returns {void}
   */
  refreshMemes() {
    const memes = storage.getMemes();
    this.memes = Array.isArray(memes) ? memes : [];
    this.render();
  }

  /**
   * Convert an ISO timestamp into a human-readable date string.
   * @param {string} createdAt - ISO 8601 timestamp from a saved meme.
   * @returns {string}
   */
  formatCreatedAt(createdAt) {
    const date = new Date(createdAt);
    if (Number.isNaN(date.valueOf())) {
      return "";
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }

  /**
   * Render the history screen UI inside shadow DOM.
   * @returns {void}
   */
  render() {
    const memeCount = this.memes.length;
    const cards = memeCount > 0 ? this.memes.map((meme) => this.renderMemeCard(meme)).join("") : "";

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
          width: min(100%, 1200px);
          margin: 0 auto;
          padding: var(--space-5);
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-3);
          margin-bottom: var(--space-5);
        }

        .crumbs {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--ink-3);
          font-size: var(--text-sm);
        }

        .crumbs strong {
          color: var(--ink);
          font-weight: 700;
        }

        .icon-button {
          width: 44px;
          height: 44px;
          border: 1px solid var(--line);
          border-radius: 14px;
          background: var(--surface);
          color: var(--ink);
          display: grid;
          place-items: center;
        }

        .hero {
          margin-bottom: var(--space-5);
        }

        .hero__title {
          font-size: clamp(2rem, 5vw, 3rem);
          letter-spacing: -0.06em;
          margin: 0 0 var(--space-2) 0;
          line-height: 1.02;
        }

        .hero__count {
          font-size: 1rem;
          color: var(--ink-3);
          font-weight: 600;
          margin-left: var(--space-2);
        }

        .hero__subtitle {
          margin: 0;
          color: var(--ink-3);
          font-size: var(--text-base);
          line-height: 1.6;
        }

        .toolbar {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: var(--space-3);
          margin-bottom: var(--space-5);
        }

        .search {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          border: 1px solid var(--line);
          border-radius: 999px;
          background: var(--surface);
          padding: var(--space-3) var(--space-4);
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .search input {
          width: 100%;
          border: none;
          background: transparent;
          color: var(--ink);
          font: inherit;
          outline: none;
        }

        .search input::placeholder {
          color: var(--ink-3);
        }

        .primary-button {
          border: none;
          background: var(--orange);
          color: white;
          border-radius: 999px;
          padding: 0 var(--space-5);
          min-height: 44px;
          font: inherit;
          font-weight: 700;
          box-shadow: var(--shadow-sm);
        }

        .tabs {
          display: grid;
          grid-auto-flow: column;
          gap: var(--space-3);
          overflow-x: auto;
          padding-bottom: var(--space-3);
          margin-bottom: var(--space-5);
        }

        .tab {
          flex: 0 0 auto;
          padding: var(--space-3) var(--space-4);
          border-radius: 999px;
          border: 1px solid transparent;
          background: var(--surface);
          color: var(--ink-3);
          font-size: var(--text-sm);
          white-space: nowrap;
        }

        .tab--active {
          border-color: var(--orange);
          color: var(--ink);
          background: var(--orange-soft);
        }

        .meme-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4);
        }

        .meme-card {
          border: 1px solid var(--line);
          border-radius: var(--radius-xl);
          overflow: hidden;
          background: var(--surface);
          box-shadow: var(--shadow-sm);
          display: grid;
          grid-template-rows: auto 1fr;
        }

        .meme-image {
          width: 100%;
          display: block;
          object-fit: cover;
          aspect-ratio: 16 / 10;
          background: var(--surface-2);
        }

        .meme-body {
          padding: var(--space-4);
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          gap: var(--space-4);
        }

        .meme-meta {
          min-width: 0;
        }

        .meme-title {
          margin: 0 0 var(--space-2) 0;
          font-size: 1rem;
          font-weight: 700;
          color: var(--ink);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .meme-subtitle {
          margin: 0;
          color: var(--ink-3);
          font-size: var(--text-sm);
        }

        .delete-button {
          border: none;
          background: var(--surface);
          color: var(--ink-3);
          padding: var(--space-2) var(--space-4);
          border-radius: 999px;
          cursor: pointer;
          font: inherit;
        }

        .empty-state {
          border: 1px dashed var(--line);
          border-radius: var(--radius-xl);
          padding: var(--space-5);
          text-align: center;
          color: var(--ink-3);
          background: var(--surface);
        }

        .empty-state strong {
          display: block;
          margin-bottom: var(--space-3);
          color: var(--ink);
          font-size: 1.1rem;
        }

        @media (min-width: 768px) {
          .page {
            padding: var(--space-6);
          }

          .topbar {
            justify-content: flex-start;
            gap: var(--space-4);
          }

          .toolbar {
            grid-template-columns: minmax(0, 1fr) auto;
          }

          .meme-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (min-width: 1024px) {
          .topbar {
            justify-content: space-between;
          }

          .meme-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
      </style>

      <section class="page" aria-labelledby="history-title">
        <div class="topbar">
          <button class="icon-button" type="button" aria-label="Open menu">☰</button>
          <div class="crumbs" aria-label="Breadcrumb">
            <span>memebro</span>
            <span aria-hidden="true">/</span>
            <strong>my memes</strong>
          </div>
          <button class="icon-button" type="button" aria-label="View filters">▧</button>
        </div>

        <header class="hero">
          <h1 id="history-title" class="hero__title">
            My memes
            <span class="hero__count">${memeCount}</span>
          </h1>
          <p class="hero__subtitle">Everything you've made. Tap to remix.</p>
        </header>

        <div class="toolbar">
          <label class="search">
            <span class="sr-only">Filter my memes</span>
            <input type="search" placeholder="Filter my memes..." aria-label="Filter my memes" />
          </label>
          <button class="primary-button" type="button">+ New meme</button>
        </div>

        <nav class="tabs" aria-label="My memes filters">
          <button class="tab tab--active" type="button">All</button>
          <button class="tab" type="button">Drafts</button>
          <button class="tab" type="button">Shared</button>
          <button class="tab" type="button">Conjured</button>
        </nav>

        ${memeCount === 0 ? this.renderEmptyState() : `<div class="meme-grid">${cards}</div>`}
      </section>
    `;
  }

  /**
   * Render a single meme card.
   * @param {Meme} meme - The meme object to render.
   * @returns {string}
   */
  renderMemeCard(meme) {
    const captionText =
      Array.isArray(meme.captions) && meme.captions.length > 0
        ? meme.captions[0].text
        : meme.templateId;

    return `
      <article class="meme-card">
        <img
          class="meme-image"
          src="${this.escapeHtml(meme.templateImageUrl)}"
          alt="Saved meme from ${this.escapeHtml(meme.templateId)}"
          loading="lazy"
        />
        <div class="meme-body">
          <div class="meme-meta">
            <h2 class="meme-title">${this.escapeHtml(captionText)}</h2>
            <p class="meme-subtitle">${this.escapeHtml(this.formatCreatedAt(meme.createdAt))}</p>
          </div>
          <button class="delete-button" type="button" data-delete-id="${this.escapeHtml(meme.id)}">
            Delete
          </button>
        </div>
      </article>
    `;
  }

  /**
   * Render the empty state when no saved memes exist.
   * @returns {string}
   */
  renderEmptyState() {
    return `
      <div class="empty-state" role="status" aria-live="polite">
        <strong>No memes saved yet.</strong>
        <p>Save a meme from the editor or conjure a new one to see it here.</p>
      </div>
    `;
  }

  /**
   * Escape string content for safe inclusion in HTML.
   * @param {string|number|boolean} value - Value to escape for HTML.
   * @returns {string}
   */
  escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
}

customElements.define("memebro-history", MemebroHistory);

const mountRoot = document.getElementById("history-root");
if (mountRoot) {
  mountRoot.appendChild(document.createElement("memebro-history"));
}
