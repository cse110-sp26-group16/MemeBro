/**
 * Tab definitions in display order. The `id` matches an accepted value of the
 * `active` attribute; `href` follows the interface-contract routing section
 * (plain cross-page `<a href>`, no client-side router).
 * @type {{ id: string, label: string, href: string, icon: string }[]}
 */
const TABS = [
  {
    id: "library",
    label: "Library",
    href: "index.html",
    icon: '<rect x="3" y="3" width="7" height="7" rx="1.5"></rect><rect x="14" y="3" width="7" height="7" rx="1.5"></rect><rect x="3" y="14" width="7" height="7" rx="1.5"></rect><rect x="14" y="14" width="7" height="7" rx="1.5"></rect>',
  },
  {
    id: "mine",
    label: "Mine",
    href: "pages/history.html",
    icon: '<circle cx="12" cy="8" r="4"></circle><path d="M4 21c0-4 4-6 8-6s8 2 8 6"></path>',
  },
  {
    id: "search",
    label: "Search",
    href: "pages/search.html",
    icon: '<circle cx="11" cy="11" r="7"></circle><line x1="16.5" y1="16.5" x2="21" y2="21"></line>',
  },
  {
    id: "settings",
    label: "Settings",
    href: "#settings",
    icon: '<circle cx="12" cy="12" r="3.2"></circle><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5 5l2.1 2.1M16.9 16.9 19 19M19 5l-2.1 2.1M7.1 16.9 5 19"></path>',
  },
];

/**
 * Shared bottom navigation for every screen in the Library → Search → Editor
 * slice. Renders four cross-page tabs (Library, Mine, Search, Settings) into an
 * open shadow root, with a center gap reserved for the floating Conjure action.
 *
 * The tab matching the `active` attribute is visually highlighted; the
 * highlight updates reactively when the attribute changes.
 *
 * Tag: `<memebro-tab-bar>`.
 *
 * Observes: `active` — one of `library | mine | search | settings`. The
 * matching tab highlights and is marked `aria-current="page"`.
 * Dispatches: no events (navigation is plain `<a href>` per the interface
 * contract routing section).
 * Slots: none.
 */
class MemebroTabBar extends HTMLElement {
  /**
   * The attributes whose changes trigger attributeChangedCallback.
   * @returns {string[]} the observed attribute names
   */
  static get observedAttributes() {
    return ["active"];
  }

  /**
   * Attaches an open shadow root so consumers and tests can introspect it.
   */
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  /**
   * The currently active tab id.
   * @returns {string|null} the `active` attribute value, or null if unset
   */
  get active() {
    return this.getAttribute("active");
  }

  /**
   * Sets the active tab, reflecting to the `active` attribute.
   * @param {string} value - one of `library | mine | search | settings`
   */
  set active(value) {
    this.setAttribute("active", value);
  }

  /**
   * Renders the tab bar once the element is connected to the DOM.
   */
  connectedCallback() {
    this.render();
    this.updateActive();
  }

  /**
   * Reacts to a change of the `active` attribute by re-highlighting the
   * matching tab. Skips work until the shadow root has been rendered.
   * @param {string} name - the attribute that changed
   * @param {string|null} _oldValue - the previous value (unused)
   * @param {string|null} _newValue - the new value (unused)
   */
  attributeChangedCallback(name, _oldValue, _newValue) {
    if (name === "active" && this.shadowRoot.childElementCount > 0) {
      this.updateActive();
    }
  }

  /**
   * Applies the active highlight to the tab matching the `active` attribute and
   * clears it from the rest.
   */
  updateActive() {
    const active = this.getAttribute("active");
    const tabs = this.shadowRoot.querySelectorAll(".tab");
    tabs.forEach((tab) => {
      const isActive = tab.dataset.tab === active;
      tab.classList.toggle("tab--active", isActive);
      if (isActive) {
        tab.setAttribute("aria-current", "page");
      } else {
        tab.removeAttribute("aria-current");
      }
    });
  }

  /**
   * Builds the HTML string for a single tab anchor.
   * @param {{ id: string, label: string, href: string, icon: string }} tab - the tab definition
   * @returns {string} the anchor markup
   */
  renderTab(tab) {
    return `
      <a class="tab" data-tab="${tab.id}" href="${tab.href}">
        <svg class="tab__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          ${tab.icon}
        </svg>
        <span class="tab__label">${tab.label}</span>
      </a>
    `;
  }

  /**
   * Paints the tab bar markup and styles into the shadow root.
   */
  render() {
    const [library, mine, search, settings] = TABS;
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background: var(--surface);
          border-top: 1px solid var(--line);
        }

        *, *::before, *::after {
          box-sizing: border-box;
        }

        .nav {
          display: grid;
          grid-template-columns: repeat(2, 1fr) var(--space-8) repeat(2, 1fr);
          align-items: center;
          min-height: var(--bottom-nav-h);
          padding-bottom: env(safe-area-inset-bottom, 0);
        }

        .tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--space-1);
          padding: var(--space-2) var(--space-1);
          color: var(--ink-3);
          font-size: var(--text-xs);
          font-weight: 500;
          text-decoration: none;
          letter-spacing: var(--tracking-wide);
          transition: color 0.15s ease;
        }

        .tab:hover {
          color: var(--ink-2);
        }

        .tab__icon {
          width: 24px;
          height: 24px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .tab--active {
          color: var(--orange);
        }

        /* Reserved center column keeps the four tabs clear of the Conjure FAB. */
        .spacer {
          width: 100%;
        }
      </style>

      <nav class="nav" aria-label="Primary navigation">
        ${this.renderTab(library)}
        ${this.renderTab(mine)}
        <span class="spacer" aria-hidden="true"></span>
        ${this.renderTab(search)}
        ${this.renderTab(settings)}
      </nav>
    `;
  }
}

customElements.define("memebro-tab-bar", MemebroTabBar);

export { MemebroTabBar };
