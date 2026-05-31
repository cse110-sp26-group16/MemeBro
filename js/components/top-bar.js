/**
 * Shared header chrome for every screen in the Library → Search → Editor slice.
 *
 * Renders a three-region top bar (leading breadcrumb, center search field,
 * trailing actions) into an open shadow root. The bar owns only layout and
 * tokens; each screen injects its own content through the named slots below so
 * the chrome stays identical across Home, Search, and Editor.
 *
 * Tag: `<memebro-top-bar>`.
 *
 * Slots:
 * - `breadcrumb`   Leading region. Menu/layers controls and the current
 *                  breadcrumb trail (e.g. `memebro / all templates`).
 * - `search-input` Center region. A search field or live query readout.
 * - `actions`      Trailing region. Theme toggle, Conjure button, etc.
 *
 * Observes: no attributes.
 * Dispatches: no events (interactive controls live in the slotted content and
 * dispatch their own events).
 */
class MemebroTopBar extends HTMLElement {
  /**
   * Attaches an open shadow root so consumers and tests can introspect it.
   */
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  /**
   * Renders the chrome layout once the element is connected to the DOM.
   */
  connectedCallback() {
    this.render();
  }

  /**
   * Paints the top-bar layout and slots into the shadow root.
   */
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: sticky;
          top: 0;
          z-index: 10;
          background: var(--surface);
          border-bottom: 1px solid var(--line);
        }

        *, *::before, *::after {
          box-sizing: border-box;
        }

        .bar {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: var(--space-3);
          min-height: var(--topbar-h);
          padding: 0 var(--space-4);
        }

        .region {
          display: flex;
          align-items: center;
          min-width: 0;
          gap: var(--space-2);
        }

        .region--breadcrumb {
          color: var(--ink-3);
          font-size: var(--text-sm);
          white-space: nowrap;
        }

        .region--search {
          justify-content: center;
        }

        .region--actions {
          justify-content: flex-end;
        }

        /* Let a slotted search field fill the center region. */
        ::slotted([slot="search-input"]) {
          width: 100%;
        }
      </style>

      <header class="bar">
        <div class="region region--breadcrumb">
          <slot name="breadcrumb"></slot>
        </div>

        <div class="region region--search">
          <slot name="search-input"></slot>
        </div>

        <div class="region region--actions">
          <slot name="actions"></slot>
        </div>
      </header>
    `;
  }
}

customElements.define("memebro-top-bar", MemebroTopBar);

export { MemebroTopBar };
