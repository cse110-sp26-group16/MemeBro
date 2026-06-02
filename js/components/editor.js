/**
 * @typedef {import('../api/imgflip-api.js').Template} Template
 */

/**
 * @typedef {Object} Caption
 * @property {string} text
 * @property {number} x        Position from left as a 0–1 ratio of image width
 * @property {number} y        Position from top as a 0–1 ratio of image height
 * @property {number} fontSize Ratio of image natural width (e.g. 0.06 = 6 %)
 * @property {string} color    CSS color string
 */

/**
 * @typedef {Object} Meme
 * @property {string}             id               UUID generated client-side
 * @property {string}             templateId       Matches Template.id
 * @property {string}             templateImageUrl Cached image URL
 * @property {Caption[]}          captions
 * @property {'quick'|'conjure'}  source           Which flow created it
 * @property {string}             createdAt        ISO 8601 timestamp
 */

import { getPopularTemplates } from "../api/imgflip-api.js";
class MemeBroEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.template = null;
    /** @type {Caption[]} */
    this.captions = [
      { text: "", x: 0.5, y: 0.05, fontSize: 0.06, color: "#ffffff" },
      { text: "", x: 0.5, y: 0.88, fontSize: 0.06, color: "#ffffff" },
    ];
  }

  async connectedCallback() {
    const params = new URLSearchParams(window.location.search);
    this.templateId = params.get("templateId");
    await this.resolveTemplate();
    this.render();
    this._attachListeners();
  }

  async resolveTemplate() {
    const templates = await getPopularTemplates();
    this.template = templates.find((t) => t.id === this.templateId) || null;
  }

  render() {
    const imageUrl = this.template ? this.template.imageUrl : "";
    const ratio = this.template ? `${this.template.width} / ${this.template.height}` : "1 / 1";
    const altText = this.template ? `${this.template.name} meme template` : "meme template";

    const captionInputsHtml = this.captions
      .map(
        (cap, i) =>
          `<input
            class="meme-canvas-caption"
            data-caption-index="${i}"
            style="left:${cap.x * 100}%;top:${cap.y * 100}%;font-size:calc(${cap.fontSize} * 100cqw);color:${cap.color};"
            type="text"
            value="${cap.text}"
            placeholder="${i === 0 ? "TOP TEXT" : "BOTTOM TEXT"}"
            aria-label="${i === 0 ? "Top caption" : "Bottom caption"}" />`
      )
      .join("\n");

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: var(--space-6) var(--space-4);
          background: var(--bg-2);
          min-height: 100vh;
        }

        .meme-canvas {
          position: relative;
          container-type: inline-size;
          width: 100%;
          max-width: 480px;
          aspect-ratio: ${ratio};
          border-radius: var(--radius);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          border-color: var(--ink);
          border-width: 2px;
          border-style: solid;
        }

        .meme-canvas-img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .meme-canvas-caption {
          position: absolute;
          transform: translateX(-50%);
          width: 90%;
          background: transparent;
          border: none;
          font-weight: 700;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: var(--tracking-wide);
          text-shadow: 2px 2px 0 var(--editor-caption-outline), -2px -2px 0 var(--editor-caption-outline), 2px -2px 0 var(--editor-caption-outline), -2px 2px 0 var(--editor-caption-outline);
          padding: var(--space-2);
          outline: none;
        }

        .meme-canvas-caption::placeholder {
          color: color-mix(in srgb, var(--editor-caption-text) 60%, transparent);
          font-weight: 400;
          text-transform: none;
          letter-spacing: normal;
          text-shadow: none;
        }
      </style>

      <div class="meme-canvas">
        <img class="meme-canvas-img" src="${imageUrl}" alt="${altText}" />
        ${captionInputsHtml}
      </div>`;
  }

  
  _attachListeners() {
    this.shadowRoot.querySelectorAll(".meme-canvas-caption").forEach((input) => {
      input.addEventListener("input", (e) => {
        const idx = Number(e.currentTarget.dataset.captionIndex);
        this.captions[idx].text = e.currentTarget.value;
      });
    });
  }
}

customElements.define("memebro-editor", MemeBroEditor);
export { MemeBroEditor };
