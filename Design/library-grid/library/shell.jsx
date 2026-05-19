/* Memebro — shell: Sidebar, Topbar, MobileBottomNav */
/* global React */
const { useState, useEffect } = React;

function Icon({ name, size = 16, stroke = "currentColor" }) {
  const props = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke, strokeWidth: 1.8,
    strokeLinecap: "round", strokeLinejoin: "round",
  };
  const paths = {
    library:    <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    star:       <polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9"/>,
    clock:      <><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></>,
    sparkles:   <><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/><path d="M5.6 5.6l3 3M15.4 15.4l3 3M5.6 18.4l3-3M15.4 8.6l3-3"/></>,
    user:       <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></>,
    search:     <><circle cx="11" cy="11" r="7"/><line x1="20" y1="20" x2="16.65" y2="16.65"/></>,
    plus:       <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    folder:     <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>,
    heart:      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>,
    image:      <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>,
    download:   <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    share:      <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></>,
    link:       <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07L11.76 5"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07L12.24 19"/></>,
    bell:       <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    settings:   <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    menu:       <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    close:      <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    chevron:    <polyline points="9 18 15 12 9 6"/>,
    chevronL:   <polyline points="15 18 9 12 15 6"/>,
    chevronD:   <polyline points="6 9 12 15 18 9"/>,
    home:       <><path d="M3 12L12 4l9 8"/><path d="M5 10v10h14V10"/></>,
    aperture:   <><circle cx="12" cy="12" r="9"/><line x1="14.31" y1="8" x2="20.05" y2="17.94"/><line x1="9.69" y1="8" x2="21.17" y2="8"/><line x1="7.38" y1="12" x2="13.12" y2="2.06"/><line x1="9.69" y1="16" x2="3.95" y2="6.06"/><line x1="14.31" y1="16" x2="2.83" y2="16"/><line x1="16.62" y1="12" x2="10.88" y2="21.94"/></>,
    text:       <><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></>,
    palette:    <><circle cx="12" cy="12" r="9"/><circle cx="7.5" cy="10.5" r="1.5"/><circle cx="12" cy="7" r="1.5"/><circle cx="16.5" cy="10.5" r="1.5"/><circle cx="9" cy="16" r="1.5"/></>,
    sticker:    <><path d="M3 11l8-8h10v10l-8 8H5a2 2 0 0 1-2-2z"/><path d="M21 11l-5 5h-5v-5"/></>,
    crop:       <><path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/></>,
    sun:        <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>,
    moon:       <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>,
    grid:       <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
    arrowLeft:  <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    arrowRight: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    refresh:    <><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></>,
    upload:     <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>,
    layers:     <><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>,
    edit:       <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    copy:       <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>,
    trash:      <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></>,
    fire:       <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.38 0 2.5-1.12 2.5-2.5 0-1.5-1-2.5-2-3.5-.5-.5-1-1-1-2 0-1 0-2 1-2 1 0 2 1 2 2 0 1 0 2-1 2-2 0-3.5-1.5-3.5-3.5C9 4 11 2 12 2c3 0 5 2 5 5 0 2-1 3-2 4-1 1-2 2-2 3.5z"/>,
  };
  return <svg {...props}>{paths[name] || null}</svg>;
}

function Sidebar({ route, setRoute, collapsed, mobileOpen, closeMobile }) {
  const sections = [
    {
      label: "Library",
      items: [
        { id: "home", label: "All templates", icon: "library", count: "10,482" },
        { id: "favorites", label: "Favorites", icon: "star", count: "12" },
        { id: "recent", label: "Recent", icon: "clock" },
      ],
    },
    {
      label: "Categories",
      items: [
        { id: "cat-reaction", label: "Reaction", icon: "fire", count: "2,340" },
        { id: "cat-classic", label: "Classic", icon: "image", count: "1,820" },
        { id: "cat-4panel", label: "4-panel", icon: "grid", count: "640" },
        { id: "cat-video", label: "Video / GIF", icon: "aperture", count: "1,402" },
        { id: "cat-dev", label: "Dev humor", icon: "edit", count: "894" },
      ],
    },
    {
      label: "Mine",
      items: [
        { id: "mine", label: "My memes", icon: "user", count: "24" },
        { id: "ai-history", label: "Conjured ✦", icon: "sparkles", count: "6" },
      ],
    },
  ];

  const handle = (id) => {
    if (id === "home" || id === "mine") setRoute(id);
    else if (id.startsWith("cat-")) setRoute("home");
    else if (id === "favorites" || id === "recent" || id === "ai-history") setRoute(id === "mine" ? "mine" : "home");
    closeMobile && closeMobile();
  };

  return (
    <>
      {mobileOpen && <div className="sidebar-backdrop" onClick={closeMobile}></div>}
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">M</div>
          <div className="brand-text">memebro<span className="dot">.</span></div>
        </div>

        {sections.map((sec) => (
          <React.Fragment key={sec.label}>
            <div className="sidebar-label">{sec.label}</div>
            {sec.items.map((item) => {
              const active =
                (item.id === "home" && (route === "home" || route === "search")) ||
                (item.id === "mine" && route === "mine") ||
                (item.id === "ai-history" && route === "ai-history");
              return (
                <button
                  key={item.id}
                  className={`nav-item ${active ? "active" : ""}`}
                  onClick={() => handle(item.id)}
                  data-comment-anchor={`nav-${item.id}`}
                >
                  <span className="nav-icon"><Icon name={item.icon}/></span>
                  <span>{item.label}</span>
                  {item.count && <span className="nav-count">{item.count}</span>}
                </button>
              );
            })}
          </React.Fragment>
        ))}

        <div style={{ flex: 1 }}/>

        <div
          className="sidebar-cta"
          onClick={() => { setRoute("conjure"); closeMobile && closeMobile(); }}
          style={{ cursor: "pointer" }}
        >
          <h4>✦ Conjure with AI</h4>
          <div>Generate a brand-new template from a prompt.</div>
          <span className="pill">4 of 5 credits left</span>
        </div>
      </aside>
    </>
  );
}

function Topbar({ route, setRoute, query, setQuery, theme, setTheme, openMobileNav, toggleSidebar }) {
  const showSearch = route === "home" || route === "search" || route === "mine" || route === "ai-history";

  return (
    <header className="topbar">
      <button className="mobile-hamburger" onClick={openMobileNav} aria-label="Menu">
        <Icon name="menu" size={18}/>
      </button>

      <button
        className="btn btn-icon btn-ghost"
        onClick={toggleSidebar}
        style={{ marginLeft: -4 }}
        aria-label="Toggle sidebar"
        title="Toggle sidebar (desktop)"
      >
        <Icon name="layers" size={16}/>
      </button>

      <span className="crumbs" style={{ display: "var(--crumb-display, inline)" }}>
        {route === "home" && <>memebro / <strong>all templates</strong></>}
        {route === "search" && <>memebro / <strong>search</strong></>}
        {route === "conjure" && <>memebro / <strong>✦ conjure</strong></>}
        {route === "editor" && <>memebro / editor / <strong>untitled</strong></>}
        {route === "mine" && <>memebro / <strong>my memes</strong></>}
        {route === "ai-history" && <>memebro / mine / <strong>conjured ✦</strong></>}
        {route === "export" && <>memebro / editor / <strong>export</strong></>}
      </span>

      {showSearch && (
        <div className="search-bar" data-comment-anchor="topbar-search">
          <span style={{ color: "var(--ink-3)" }}><Icon name="search" size={15}/></span>
          <input
            placeholder="Search templates or describe an idea..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.length > 0) setRoute("search");
              else setRoute("home");
            }}
          />
          <span className="kbd">⌘K</span>
        </div>
      )}

      <div className="topbar-actions">
        <button
          className="btn btn-icon btn-ghost"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label="Toggle theme"
          title="Theme"
        >
          <Icon name={theme === "light" ? "moon" : "sun"} size={16}/>
        </button>
        <button
          className="btn btn-ai btn-sm"
          onClick={() => setRoute("conjure")}
          data-comment-anchor="conjure-cta"
        >
          <Icon name="sparkles" size={14}/>
          Conjure
        </button>
      </div>
    </header>
  );
}

function MobileBottomNav({ route, setRoute }) {
  const items = [
    { id: "home", label: "Library", icon: "library" },
    { id: "mine", label: "Mine", icon: "user" },
    { id: "conjure", label: "", icon: "sparkles", primary: true },
    { id: "search", label: "Search", icon: "search" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];
  return (
    <nav className="mobile-bottom-nav">
      {items.map((it) => (
        <button
          key={it.id}
          className={`mbn-btn ${it.primary ? "fab-btn" : ""} ${route === it.id && !it.primary ? "active" : ""}`}
          onClick={() => setRoute(it.id)}
          aria-label={it.label || it.id}
        >
          <span className="mbn-icon"><Icon name={it.icon} size={it.primary ? 22 : 18} stroke={it.primary ? "white" : "currentColor"}/></span>
          {it.label && <span>{it.label}</span>}
        </button>
      ))}
    </nav>
  );
}

window.MemebroShell = { Sidebar, Topbar, MobileBottomNav, Icon };
