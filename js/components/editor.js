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

import html2canvas from "https://esm.sh/html2canvas@1.4.1";
import "./top-bar.js";
import { getPopularTemplates } from "../api/imgflip-api.js";
class MemeBroEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.template = null;
    this.activeStyle = 'classic';
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
    this.attachListeners();
  }

  async resolveTemplate() {
    const templates = await getPopularTemplates();
    this.template = templates.find((t) => t.id === this.templateId) || null;
  }

  render() {
    const imageUrl = this.template ? this.template.imageUrl : "";
    const ratio = this.template ? `${this.template.width} / ${this.template.height}` : "1 / 1";
    const altText = this.template ? `${this.template.name} meme template` : "meme template";

    const styleClass = `caption-style--${this.activeStyle}`;
    const captionOverlaysHtml = this.captions
      .map(
        (cap, i) =>
          `<span
            class="meme-canvas-caption ${styleClass}${cap.text ? '' : ' meme-canvas-caption--placeholder'}"
            data-caption-index="${i}"
            aria-hidden="true"
            style="left:${cap.x * 100}%;top:${cap.y * 100}%;font-size:calc(${cap.fontSize} * 100cqw);color:${cap.color};"
          >${cap.text || (i === 0 ? "TOP TEXT" : "BOTTOM TEXT")}</span>`
      )
      .join("\n");

    this.shadowRoot.innerHTML = `
      <style>
        *, *::before, *::after {
          box-sizing: border-box;
        }

        :host {
          display: flex;
          flex-direction: column;
          background: var(--bg-2);
          /* fill exactly the visible viewport; 100svh collapses with browser chrome on iOS */
          height: 100vh;
          height: 100svh;
          width: 100%;
          overflow: hidden;
        }

        .editor-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-4);
          padding: var(--space-4) var(--space-4) var(--space-6);
          width: 100%;
          min-width: 0;
          overflow-y: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
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
          border: 2px solid var(--ink);
          flex-shrink: 0;
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
          pointer-events: none;
          user-select: none;
          font-weight: 700;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: var(--tracking-wide);
          color: var(--editor-caption-text);
          padding: var(--space-2);
          font-family: Geist, system-ui, sans-serif;
        }

        .meme-canvas-caption--placeholder {
          opacity: 0.5;
          font-weight: 400;
          text-transform: none;
          letter-spacing: normal;
        }

        .editor-panels {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          width: 100%;
          max-width: 480px;
        }

        .input-panels {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          width: 100%;
        }

        .input-panels-row {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: var(--radius);
          padding: var(--space-2) var(--space-3);
          min-height: 44px;
        }

        .input-panels-label {
          font-size: var(--text-sm);
          color: var(--ink);
          white-space: nowrap;
          font-family: Geist, system-ui, sans-serif;
        }

        .input-panels-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-size: var(--text-base);
          color: var(--ink-2);
          font-family: Geist, system-ui, sans-serif;
        }

        .input-panels-input::placeholder {
          color: var(--ink-2);
        }

        .style-row__label {
          font-size: var(--text-xs);
          font-family: Geist, system-ui, sans-serif;
          color: var(--ink-3);
          text-transform: uppercase;
          letter-spacing: var(--tracking-wide);
          margin: 0 0 var(--space-2) 0;
        }

        .style-row__chips {
          display: flex;
          flex-direction: row;
          gap: var(--space-2);
          overflow-x: auto;
          scrollbar-width: none;
        }

        .style-row__chips::-webkit-scrollbar {
          display: none;
        }

        .style-chip {
          flex-shrink: 0;
          padding: var(--space-1) var(--space-4);
          border-radius: 9999px;
          border: 1.5px solid var(--ink);
          background: transparent;
          color: var(--ink);
          font-size: var(--text-sm);
          font-family: Geist, system-ui, sans-serif;
          cursor: pointer;
          min-height: 36px;
        }

        .style-chip[aria-pressed="true"] {
          background: var(--ink);
          color: var(--bg);
        }

        /* per-style caption fonts */
        .caption-style--classic { font-family: Geist, "Arial Narrow", sans-serif; }
        .caption-style--serif {
          font-family: "Instrument Serif", Georgia, serif;
          font-weight: 400;
          font-style: italic;
        }
        .caption-style--type {
          font-family: "Geist Mono", "Courier New", monospace;
          font-weight: 500;
          text-transform: none;
          letter-spacing: 0.02em;
        }
        .caption-style--glitch {
          font-family: Geist, system-ui, sans-serif;
          text-shadow: 2px 0 0 #ff0040, -2px 0 0 #00ffff, 0 2px 0 var(--editor-caption-outline);
        }
        .caption-style--bubble {
          font-family: Geist, system-ui, sans-serif;
          -webkit-text-stroke: 4px var(--editor-caption-outline);
          paint-order: stroke fill;
          text-shadow: none;
        }

        /* bottom toolbar — visual only, no interaction */
        .editor-toolbar {
          flex-shrink: 0;
          width: 100%;
          background: var(--surface);
          border-top: 1px solid var(--line);
          display: flex;
          align-items: center;
          height: var(--bottom-nav-h);
          pointer-events: none;
          user-select: none;
        }

        .editor-toolbar__item {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--text-sm);
          font-family: Geist, system-ui, sans-serif;
          color: var(--ink-3);
          letter-spacing: var(--tracking-wide);
        }

        .top-bar-back {
          background: transparent;
          border: none;
          padding: var(--space-2);
          color: var(--ink);
          font-size: var(--text-xl);
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          font-family: Geist, system-ui, sans-serif;
          min-height: 44px;
        }

        .top-bar-title {
          font-size: var(--text-sm);
          font-family: Geist, system-ui, sans-serif;
          color: var(--ink);
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        .download-btn {
          background: var(--orange);
          color: #fff;
          border: none;
          border-radius: var(--radius);
          padding: var(--space-2) var(--space-4);
          font-size: var(--text-sm);
          font-weight: 600;
          font-family: Geist, system-ui, sans-serif;
          cursor: pointer;
          min-height: 36px;
          letter-spacing: 0.01em;
        }

        .download-btn:active {
          background: var(--orange-deep);
        }
      </style>

      <memebro-top-bar>
        <button class="top-bar-back" slot="breadcrumb" aria-label="Go back">&#8592;</button>
        <span class="top-bar-title" slot="search-input">${this.template ? this.template.name : ''}</span>
        <button class="download-btn" slot="actions" aria-label="Download PNG">Download</button>
      </memebro-top-bar>
      <div class="editor-content">
        <div class="meme-canvas">
          <img class="meme-canvas-img" src="${imageUrl}" alt="${altText}" crossorigin="anonymous" />
          ${captionOverlaysHtml}
        </div>
        <div class="editor-panels">
          <div class="input-panels">
            <div class="input-panels-row">
              <span class="input-panels-label">top →</span>
              <input class="input-panels-input" data-panel-index="0" type="text" placeholder="Top text" aria-label="Top caption" value="${this.captions[0].text}" />
            </div>
            <div class="input-panels-row">
              <span class="input-panels-label">bot →</span>
              <input class="input-panels-input" data-panel-index="1" type="text" placeholder="Bottom text" aria-label="Bottom caption" value="${this.captions[1].text}" />
            </div>
          </div>
          <div class="style-row">
            <p class="style-row__label">Style</p>
            <div class="style-row__chips" role="group" aria-label="Caption style">
              <button class="style-chip" data-style="classic" aria-pressed="${this.activeStyle === 'classic'}">classic</button>
              <button class="style-chip" data-style="serif"   aria-pressed="${this.activeStyle === 'serif'}">serif</button>
              <button class="style-chip" data-style="type"    aria-pressed="${this.activeStyle === 'type'}">type</button>
              <button class="style-chip" data-style="glitch"  aria-pressed="${this.activeStyle === 'glitch'}">glitch</button>
              <button class="style-chip" data-style="bubble"  aria-pressed="${this.activeStyle === 'bubble'}">bubble</button>
            </div>
          </div>
        </div>
      </div>
      <div class="editor-toolbar" aria-hidden="true">
        <span class="editor-toolbar__item">text</span>
        <span class="editor-toolbar__item">style</span>
        <span class="editor-toolbar__item">sticker</span>
        <span class="editor-toolbar__item">fx</span>
        <span class="editor-toolbar__item">layers</span>
      </div>`;
  }

  /**
   * Wires caption inputs to canvas overlays and style chips to caption fonts.
   */
  attachListeners() {
    this.shadowRoot.querySelectorAll('.input-panels-input').forEach((input) => {
      input.addEventListener('input', (e) => {
        const idx = Number(e.currentTarget.dataset.panelIndex);
        const text = e.currentTarget.value;
        this.captions[idx].text = text;

        const overlay = this.shadowRoot.querySelector(
          `.meme-canvas-caption[data-caption-index="${idx}"]`
        );
        if (overlay) {
          if (text) {
            overlay.textContent = text;
            overlay.classList.remove('meme-canvas-caption--placeholder');
          } else {
            overlay.textContent = idx === 0 ? 'TOP TEXT' : 'BOTTOM TEXT';
            overlay.classList.add('meme-canvas-caption--placeholder');
          }
        }
      });
    });

    this.shadowRoot.querySelectorAll('.style-chip').forEach((chip) => {
      chip.addEventListener('click', (e) => {
        const style = e.currentTarget.dataset.style;
        this.activeStyle = style;

        this.shadowRoot.querySelectorAll('.style-chip').forEach((c) => {
          c.setAttribute('aria-pressed', String(c.dataset.style === style));
        });

        const styleClass = `caption-style--${style}`;
        this.shadowRoot.querySelectorAll('.meme-canvas-caption').forEach((overlay) => {
          overlay.className = overlay.className
            .split(' ')
            .filter((cls) => !cls.startsWith('caption-style--'))
            .concat(styleClass)
            .join(' ');
        });
      });
    });

    const backBtn = this.shadowRoot.querySelector('.top-bar-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => history.back());
    }

    const downloadBtn = this.shadowRoot.querySelector('.download-btn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => this._downloadMeme());
    }

  }

  /**
   * Renders the meme canvas to a PNG via html2canvas, constructs a {@link Meme}
   * object, fires `memebro:meme-downloaded`, and triggers a browser download.
   * NOTE: imgflip images must be served with CORS headers for html2canvas to
   * read pixel data. If the canvas is tainted the download will fail; routing
   * images through the backend proxy (Cloudflare Worker) resolves this.
   * @returns {Promise<void>}
   * @throws {Error} if html2canvas fails to render
   */
  async _downloadMeme() {
    const memeEl = this.shadowRoot.querySelector('.meme-canvas');
    const rendered = await html2canvas(memeEl, {
      useCORS: true,
      allowTaint: false,
      backgroundColor: null,
      scale: window.devicePixelRatio || 2,
      logging: false,
    });

    /** @type {Meme} */
    const meme = {
      id: crypto.randomUUID(),
      templateId: this.templateId ?? '',
      templateImageUrl: this.template?.imageUrl ?? '',
      captions: this.captions.map((c) => ({ ...c })),
      source: 'quick',
      createdAt: new Date().toISOString(),
    };

    this.dispatchEvent(
      new CustomEvent('memebro:meme-downloaded', {
        detail: { meme, format: 'png' },
        bubbles: true,
        composed: true,
      })
    );

    const link = document.createElement('a');
    link.href = rendered.toDataURL('image/png');
    link.download = `meme-${meme.id}.png`;
    link.click();
  }
}

customElements.define("memebro-editor", MemeBroEditor);
export { MemeBroEditor };
