const mockTemplates = [
  {
    id: "drake",
    name: "Drake Hotline Bling",
    imageUrl: "https://i.imgflip.com/30b1gx.jpg",
    useCount: "1.2M",
    isAi: false,
  },
  {
    id: "distracted-boyfriend",
    name: "Distracted Boyfriend",
    imageUrl: "https://i.imgflip.com/1ur9b0.jpg",
    useCount: "980K",
    isAi: false,
  },
  {
    id: "two-buttons",
    name: "Two Buttons",
    imageUrl: "https://i.imgflip.com/1g8my4.jpg",
    useCount: "840K",
    isAi: true,
  },
  {
    id: "change-my-mind",
    name: "Change My Mind",
    imageUrl: "https://i.imgflip.com/24y43o.jpg",
    useCount: "760K",
    isAi: false,
  },
  {
    id: "left-exit",
    name: "Left Exit 12 Off Ramp",
    imageUrl: "https://i.imgflip.com/22bdq6.jpg",
    useCount: "650K",
    isAi: false,
  },
  {
    id: "expanding-brain",
    name: "Expanding Brain",
    imageUrl: "https://i.imgflip.com/1jwhww.jpg",
    useCount: "590K",
    isAi: true,
  },
];

/**
 * Template gallery screen. Renders a responsive grid of meme template cards
 * into its own shadow root, seeded with a built-in mock list until real data
 * is supplied via the `data` setter.
 *
 * Tag: `<memebro-template-gallery>`.
 */
class MemebroTemplateGallery extends HTMLElement {
  /**
   * Attaches an open shadow root and seeds the gallery with mock templates.
   */
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.templates = mockTemplates;
    this.handleClick = this.handleClick.bind(this);
  }

  /**
   * Replaces the gallery's templates and re-renders.
   * @param {object[]} templates - Templates to display; a non-array is treated as empty.
   */
  set data(templates) {
    this.templates = Array.isArray(templates) ? templates : [];
    this.render();
  }

  /**
   * Renders the gallery once the element is connected to the DOM.
   */
  connectedCallback() {
    this.shadowRoot.addEventListener("click", this.handleClick);
    this.render();
  }

  /**
   * Removes event listeners when disconnected.
   */
  disconnectedCallback() {
    this.shadowRoot.removeEventListener("click", this.handleClick);
  }

  /**
   * Dispatches the template-selected event when a template card is clicked.
   * @param {Event} event Click event from the shadow root.
   */
  handleClick(event) {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    if (target.closest(".favorite")) {
      return;
    }

    const card = target.closest(".template-card");

    if (!(card instanceof HTMLElement)) {
      return;
    }

    const template = this.templates.find((item) => item.id === card.dataset.templateId);

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
   * Renders the full gallery markup (styles, topbar, and template grid) into the shadow root.
   */
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          min-height: 100vh;
          background: var(--bg);
          color: var(--ink);
          overflow-x: hidden;
        }

        *, *::before, *::after {
          box-sizing: border-box;
        }

        .page {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: var(--radius-lg);
          overflow-x: hidden;
        }

        .topbar {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: var(--radius);
          margin-bottom: var(--radius-xl);
        }

        .brand {
          font-size: clamp(1.25rem, 8vw, 2.25rem);
          font-weight: 700;
          letter-spacing: -0.06em;
          white-space: nowrap;
        }

        .search {
          width: 100%;
          min-width: 0;
          border: 1px solid var(--line);
          background: var(--surface);
          color: var(--ink-2);
          border-radius: var(--radius-xl);
          padding: var(--radius-sm) var(--radius);
          box-shadow: var(--shadow-sm);
          font: inherit;
          outline: none;
        }

        .search::placeholder {
          color: var(--ink-3);
        }

        .menu {
          border: 1px solid var(--line);
          background: var(--surface);
          color: var(--ink);
          border-radius: var(--radius-xl);
          padding: var(--radius-sm) var(--radius);
          box-shadow: var(--shadow-sm);
        }

        .eyebrow {
          color: var(--orange-deep);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: var(--radius-sm);
        }

        .section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: var(--radius);
          margin-bottom: var(--radius);
        }

        .section-title {
          font-size: clamp(1.75rem, 9vw, 4rem);
          line-height: 0.9;
          letter-spacing: -0.08em;
          margin: 0;
        }

        .count {
          color: var(--ink-3);
          font-size: 0.85rem;
          white-space: nowrap;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: var(--radius);
        }

        .template-card {
          min-width: 0;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: var(--radius-lg);
          background: var(--surface);
          box-shadow: var(--shadow-sm);
          cursor: pointer;
          transition: transform 0.15s ease;
        }

        @media (prefers-reduced-motion: reduce) {
          .template-card {
            transition: none;
          }
        }

        .template-card:hover {
          transform: scale(1.03);
        }

        .image-wrap {
          position: relative;
          aspect-ratio: 1 / 1;
          background: var(--surface-2);
          overflow: hidden;
        }

        .template-image {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .favorite {
          position: absolute;
          top: var(--radius-sm);
          right: var(--radius-sm);
          border: 1px solid var(--line);
          background: var(--surface);
          color: var(--orange);
          border-radius: var(--radius-xl);
          padding: 0 var(--radius-sm);
          box-shadow: var(--shadow-sm);
          transition: transform 0.15s ease;
        }

        .favorite:hover {
          transform: scale(1.05);
        }

        .card-body {
          padding: var(--radius-sm);
        }

        .template-name {
          margin: 0;
          color: var(--ink);
          font-size: 0.9rem;
          font-weight: 600;
          line-height: 1.2;
        }

        .meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--radius-sm);
          margin-top: var(--radius-sm);
          color: var(--ink-3);
          font-size: 0.75rem;
        }

        .badge {
          color: var(--orange-deep);
          background: var(--orange-wash);
          border-radius: var(--radius-xl);
          padding: 0 var(--radius-sm);
          font-weight: 700;
        }

        @media (min-width: 768px) {
          .page {
            padding: var(--radius-xl);
          }

          .gallery-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
      </style>

      <section class="page" aria-labelledby="template-gallery-title">
        <header class="topbar">
          <div class="brand">memebro.</div>

          <input
            class="search"
            type="text"
            placeholder="search templates"
            aria-label="Search templates"
          />

          <button class="menu" type="button" aria-label="Open menu">
            •••
          </button>
        </header>

        <div class="eyebrow">Recent</div>

        <div class="section-header">
          <h1 id="template-gallery-title" class="section-title">Browse</h1>
          <span class="count">${this.templates.length} templates</span>
        </div>

        <div class="gallery-grid">
          ${this.templates.map((template) => this.renderCard(template)).join("")}
        </div>
      </section>
    `;
  }

  /**
   * Escapes a value for safe interpolation into HTML attributes and text content.
   * @param {*} value - The value to escape.
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

  /**
   * Builds the HTML string for a single template card.
   * @param {object} template - A template with `imageUrl`, `name`, `useCount`, and `isAi` fields.
   * @returns {string} the card's HTML markup.
   */
  renderCard(template) {
    const id = this.escapeHtml(template.id);
    const name = this.escapeHtml(template.name);
    const imageUrl = this.escapeHtml(template.imageUrl);
    const useCount = this.escapeHtml(template.useCount);
    return `
      <article class="template-card" data-template-id="${id}">
        <div class="image-wrap">
          <img
            class="template-image"
            src="${imageUrl}"
            alt="${name} meme template"
            loading="lazy"
          />

          <button
            class="favorite"
            type="button"
            aria-label="Favorite ${name}"
          >
            ♥
          </button>
        </div>

        <div class="card-body">
          <h2 class="template-name">${name}</h2>

          <div class="meta">
            <span>${useCount} uses</span>
            ${template.isAi ? '<span class="badge">AI</span>' : ""}
          </div>
        </div>
      </article>
    `;
  }
}

customElements.define("memebro-template-gallery", MemebroTemplateGallery);
