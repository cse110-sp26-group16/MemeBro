/**
 * Responsive template gallery web component.
 * Dispatches `memebro:template-selected` with `{ template }` when a card is selected.
 */
class MemebroTemplateGallery extends HTMLElement {
  /**
   * Creates the gallery component and binds event handlers.
   */
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.templates = [];
    this.handleClick = this.handleClick.bind(this);
  }

  /**
   * Replaces the gallery templates and re-renders.
   * @param {object[]} templates Template data to render.
   */
  set data(templates) {
    this.templates = Array.isArray(templates) ? templates : [];
    this.render();
  }

  /**
   * Adds event listeners and renders the gallery when connected.
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

    const card = target.closest(".template-card");

    if (!(card instanceof HTMLElement)) {
      return;
    }

    const template = this.templates.find(
      (item) => item.id === card.dataset.templateId
    );

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
   * Renders the template gallery grid into the shadow root.
   */
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        *, *::before, *::after {
          box-sizing: border-box;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: var(--space-3);
        }

        .template-card {
          display: block;
          min-width: 0;
          overflow: hidden;
          color: inherit;
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          text-decoration: none;
        }

        .image-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          background: var(--surface-2);
          overflow: hidden;
        }

        .template-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-body {
          display: grid;
          gap: var(--space-1);
          padding: var(--space-3);
        }

        .template-name {
          margin: 0;
          color: var(--ink);
          font-size: var(--text-sm);
          font-weight: 700;
          line-height: 1.2;
        }

        .template-meta {
          margin: 0;
          color: var(--ink-3);
          font-size: var(--text-xs);
        }

        @media (min-width: 900px) {
          .gallery-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (min-width: 1180px) {
          .gallery-grid {
            grid-template-columns: repeat(5, minmax(0, 1fr));
          }
        }
      </style>

      <div class="gallery-grid">
        ${this.templates.map((template) => this.renderCard(template)).join("")}
      </div>
    `;
  }

  /**
   * Escapes a value for safe HTML interpolation.
   * @param {*} value Value to escape.
   * @returns {string} Escaped string.
   */
  escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /**
   * Builds the markup for one template card.
   * @param {object} template Template object.
   * @returns {string} Template card HTML.
   */
  renderCard(template) {
    const id = this.escapeHtml(template.id);
    const name = this.escapeHtml(template.name);
    const imageUrl = this.escapeHtml(template.imageUrl);

    return `
      <a
        class="template-card"
        href="pages/editor.html?templateId=${encodeURIComponent(template.id)}"
        data-template-id="${id}"
      >
        <div class="image-frame">
          <img
            class="template-image"
            src="${imageUrl}"
            alt="${name} meme template"
            loading="lazy"
          />
        </div>
        <div class="card-body">
          <p class="template-name">${name}</p>
          <p class="template-meta">Popular template</p>
        </div>
      </a>
    `;
  }
}

customElements.define("memebro-template-gallery", MemebroTemplateGallery);