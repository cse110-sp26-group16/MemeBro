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
    this.activeStyle = 'classic';
    this.activeTab = 'text';
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
        :host {
          display: flex;
          flex-direction: column;
          background: var(--bg-2);
          min-height: 100vh;
        }

        .editor-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-4);
          padding: var(--space-6) var(--space-4) var(--space-4);
          width: 100%;
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

        .panels-area {
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

        .style-row {
          width: 100%;
        }

        .style-row__label {
          font-size: var(--text-xs);
          font-family: Geist, system-ui, sans-serif;
          color: var(--ink-3);
          text-transform: uppercase;
          letter-spacing: var(--tracking-wide);
          margin-bottom: var(--space-2);
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
        }

        .style-chip[aria-pressed="true"] {
          background: var(--ink);
          color: var(--bg);
        }

        /* per-style caption fonts */
        .caption-style--classic {
          font-family: Geist, "Arial Narrow", sans-serif;
        }
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
          text-shadow:
            2px  0   0 #ff0040,
            -2px  0   0 #00ffff,
            0    2px 0 var(--editor-caption-outline);
        }
        .caption-style--bubble {
          font-family: Geist, system-ui, sans-serif;
          -webkit-text-stroke: 4px var(--editor-caption-outline);
          paint-order: stroke fill;
          text-shadow: none;
        }

        /* coming-soon panel */
        .panel-coming-soon {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-8) var(--space-4);
        }

        .panel-coming-soon__label {
          font-size: var(--text-sm);
          color: var(--ink-4);
          font-family: Geist, system-ui, sans-serif;
          font-style: italic;
          letter-spacing: var(--tracking-wide);
        }

        /* bottom toolbar */
        .editor-toolbar {
          position: sticky;
          bottom: 0;
          width: 100%;
          background: var(--surface);
          border-top: 1px solid var(--line);
          display: flex;
          align-items: stretch;
          box-shadow: 0 -2px 8px rgb(60 40 12 / 6%);
          z-index: 10;
        }

        .editor-toolbar__tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--space-1);
          padding: var(--space-2) var(--space-1);
          height: var(--bottom-nav-h);
          background: transparent;
          border: none;
          color: var(--ink-3);
          font-size: var(--text-xs);
          font-family: Geist, system-ui, sans-serif;
          cursor: pointer;
          position: relative;
          transition: color 0.15s;
        }

        .editor-toolbar__tab:hover {
          color: var(--ink-2);
        }

        .editor-toolbar__tab--active {
          color: var(--orange);
        }

        .editor-toolbar__tab--active::before {
          content: '';
          position: absolute;
          top: 0;
          left: 25%;
          right: 25%;
          height: 2px;
          background: var(--orange);
          border-radius: 0 0 var(--radius-sm) var(--radius-sm);
        }

        .editor-toolbar__icon {
          width: 22px;
          height: 22px;
          display: block;
        }

        .editor-toolbar__label {
          line-height: 1;
          letter-spacing: var(--tracking-wide);
        }
      </style>

      <div class="editor-content">
        <div class="meme-canvas">
          <img class="meme-canvas-img" src="${imageUrl}" alt="${altText}" />
          ${captionOverlaysHtml}
        </div>
        <div class="panels-area" id="panels-area" role="tabpanel">
          ${this.buildActivePanelHtml()}
        </div>
      </div>
      <nav class="editor-toolbar" role="tablist" aria-label="Editor tools">
        ${this._buildToolbarHtml()}
      </nav>`;
  }

  /**
   * Builds the HTML for the five toolbar tab buttons.
   * @returns {string} HTML string for the toolbar
   */
  _buildToolbarHtml() {
    const tabs = [
      {
        id: 'text',
        label: 'text',
        icon: '<path d="M4 6h16M12 6v12"/>',
      },
      {
        id: 'style',
        label: 'style',
        icon: '<path d="M15 4l5 5L9 20H4v-5L15 4z"/>',
      },
      {
        id: 'sticker',
        label: 'sticker',
        icon: '<circle cx="12" cy="12" r="8"/><path d="M9 13.5s1 1.5 3 1.5 3-1.5 3-1.5"/><circle cx="9.5" cy="10" r="1" fill="currentColor"/><circle cx="14.5" cy="10" r="1" fill="currentColor"/>',
      },
      {
        id: 'fx',
        label: 'fx',
        icon: '<path d="M12 2l2.4 7.4L22 12l-7.6 2.6L12 22l-2.4-7.4L2 12l7.6-2.6z"/>',
      },
      {
        id: 'layers',
        label: 'layers',
        icon: '<path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>',
      },
    ];
    return tabs
      .map((tab) => {
        const isActive = this.activeTab === tab.id;
        return `<button
          class="editor-toolbar__tab${isActive ? ' editor-toolbar__tab--active' : ''}"
          role="tab"
          data-tab="${tab.id}"
          aria-selected="${isActive}"
          aria-label="${tab.label}"
        >
          <svg class="editor-toolbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            ${tab.icon}
          </svg>
          <span class="editor-toolbar__label">${tab.label}</span>
        </button>`;
      })
      .join('\n');
  }

  /**
   * Builds the HTML string for the currently active editor panel.
   * Returns text inputs for 'text', style chips for 'style',
   * and a placeholder for unwired tabs (sticker, fx, layers).
   * @returns {string} HTML string for the active panel
   */
  buildActivePanelHtml() {
    if (this.activeTab === 'text') {
      return `
        <div class="input-panels">
          <div class="input-panels-row">
            <span class="input-panels-label">top →</span>
            <input class="input-panels-input" data-panel-index="0" type="text" placeholder="Top text" aria-label="Top caption" value="${this.captions[0].text}" />
          </div>
          <div class="input-panels-row">
            <span class="input-panels-label">bot →</span>
            <input class="input-panels-input" data-panel-index="1" type="text" placeholder="Bottom text" aria-label="Bottom caption" value="${this.captions[1].text}" />
          </div>
        </div>`;
    }
    if (this.activeTab === 'style') {
      return `
        <div class="style-row">
          <p class="style-row__label">Style</p>
          <div class="style-row__chips" role="group" aria-label="Caption style">
            <button class="style-chip" data-style="classic" aria-pressed="${this.activeStyle === 'classic'}">classic</button>
            <button class="style-chip" data-style="serif"   aria-pressed="${this.activeStyle === 'serif'}">serif</button>
            <button class="style-chip" data-style="type"    aria-pressed="${this.activeStyle === 'type'}">type</button>
            <button class="style-chip" data-style="glitch"  aria-pressed="${this.activeStyle === 'glitch'}">glitch</button>
            <button class="style-chip" data-style="bubble"  aria-pressed="${this.activeStyle === 'bubble'}">bubble</button>
          </div>
        </div>`;
    }
    return `
      <div class="panel-coming-soon">
        <span class="panel-coming-soon__label">coming soon</span>
      </div>`;
  }

  /**
   * Switches the active toolbar tab: updates this.activeTab, replaces the
   * panel content, syncs aria-selected on all tab buttons, and re-attaches
   * panel listeners.
   * @param {string} tabId - one of 'text' | 'style' | 'sticker' | 'fx' | 'layers'
   */
  switchTab(tabId) {
    this.activeTab = tabId;
    const panelsArea = this.shadowRoot.getElementById('panels-area');
    if (panelsArea) {
      panelsArea.innerHTML = this.buildActivePanelHtml();
    }
    this.shadowRoot.querySelectorAll('.editor-toolbar__tab').forEach((btn) => {
      const isActive = btn.dataset.tab === tabId;
      btn.setAttribute('aria-selected', String(isActive));
      btn.classList.toggle('editor-toolbar__tab--active', isActive);
    });
    this.attachPanelListeners();
  }

  /**
   * Wires all interactive elements after the initial render.
   */
  attachListeners() {
    this.attachPanelListeners();
    this.attachToolbarListeners();
  }

  /**
   * Attaches listeners for the currently rendered panel content (caption inputs
   * and style chips). Called after initial render and after each tab switch.
   */
  attachPanelListeners() {
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
  }

  /**
   * Attaches click listeners for the bottom toolbar tabs. Called once after
   * the initial render.
   */
  attachToolbarListeners() {
    this.shadowRoot.querySelectorAll('.editor-toolbar__tab').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        this.switchTab(e.currentTarget.dataset.tab);
      });
    });
  }
}

customElements.define("memebro-editor", MemeBroEditor);
export { MemeBroEditor };
