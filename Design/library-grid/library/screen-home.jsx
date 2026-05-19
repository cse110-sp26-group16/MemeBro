/* global React, MemebroTemplates, MemebroShell */
const { TEMPLATES, TemplateImage } = MemebroTemplates;
const { Icon } = MemebroShell;

function HomeScreen({ setRoute, setSelectedTemplate, query }) {
  const filters = ["All", "Trending", "Reaction", "Classic", "4-panel", "Video", "Dev humor", "Wholesome"];
  const [activeFilter, setActiveFilter] = React.useState("All");

  const recent = TEMPLATES.slice(0, 8);
  const grid = TEMPLATES;

  const openTemplate = (t) => {
    setSelectedTemplate(t);
    setRoute("editor");
  };

  return (
    <div className="content" data-screen-label="01 Library Home">
      <div className="hero-strip">
        <div className="hero-card dark">
          <div className="hero-decor">M</div>
          <div>
            <h2>The fastest way to ship <em>a meme</em>.</h2>
            <p>10,000+ templates ready to go. Or describe what you wish existed — we'll conjure it.</p>
          </div>
          <div className="hero-actions">
            <button className="btn btn-on-hero" onClick={() => setActiveFilter("Trending")}>
              <Icon name="fire" size={14}/> Trending
            </button>
            <button className="btn btn-on-hero outline" onClick={() => setRoute("conjure")}>
              <Icon name="sparkles" size={14}/> Conjure new
            </button>
          </div>
        </div>
        <div className="hero-card orange">
          <div className="hero-decor star">✦</div>
          <div>
            <h2>Conjure a <em>brand-new</em> template</h2>
            <p>From a prompt + optional reference image. ~8 sec, 4 options.</p>
          </div>
          <div className="hero-actions">
            <button className="btn btn-on-hero" onClick={() => setRoute("conjure")}>
              Try it — 4/5 credits
            </button>
          </div>
        </div>
      </div>

      <div className="page-header">
        <div>
          <h1>All templates <span className="count">{TEMPLATES.length.toLocaleString()}</span></h1>
          <p className="sub">Tap a template to start. Hover for actions.</p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <select className="input" style={{ width: "auto", paddingRight: 30 }}>
            <option>Sort: Popular</option>
            <option>Sort: Newest</option>
            <option>Sort: Recently used</option>
          </select>
        </div>
      </div>

      <div className="chips" style={{ marginBottom: 22 }}>
        {filters.map(f =>
          <button
            key={f}
            className={`chip ${activeFilter === f ? "active" : ""}`}
            onClick={() => setActiveFilter(f)}
          >{f}</button>
        )}
      </div>

      <div className="section-label"><Icon name="clock" size={11}/> Recent</div>
      <div className="recents">
        {recent.map(t =>
          <div key={t.id} className="recent-card" onClick={() => openTemplate(t)} title={t.name}>
            <TemplateImage template={t}/>
            <div className="recent-label">{t.name.split(" ")[0]}</div>
          </div>
        )}
      </div>

      <div className="section-label"><Icon name="library" size={11}/> Browse</div>
      <div className="masonry">
        {grid.slice(0, 4).map(t =>
          <div key={t.id} className={`tpl-card ${t.ai ? "ai-badge" : ""}`} onClick={() => openTemplate(t)}>
            <div className="tpl-img"><TemplateImage template={t}/></div>
            <button className="tpl-fav" onClick={(e) => { e.stopPropagation(); }} aria-label="Favorite">
              <Icon name="heart" size={13}/>
            </button>
            <div className="tpl-meta">
              <span className="tpl-name">{t.name}</span>
              <span className="tpl-uses">{t.uses}</span>
            </div>
          </div>
        )}
        <div className="conjure-card" onClick={() => setRoute("conjure")}>
          <div className="stars">✦</div>
          <div>
            <h4>Can't find it?</h4>
            <p>Describe the meme you wish existed. We'll generate a brand-new template.</p>
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); setRoute("conjure"); }}>
              <Icon name="sparkles" size={13}/> Conjure
            </button>
            <span className="text-mono text-xs muted">1 credit</span>
          </div>
        </div>
        {grid.slice(4).map(t =>
          <div key={t.id} className={`tpl-card ${t.ai ? "ai-badge" : ""}`} onClick={() => openTemplate(t)}>
            <div className="tpl-img"><TemplateImage template={t}/></div>
            <button className="tpl-fav" onClick={(e) => { e.stopPropagation(); }} aria-label="Favorite">
              <Icon name="heart" size={13}/>
            </button>
            <div className="tpl-meta">
              <span className="tpl-name">{t.name}</span>
              <span className="tpl-uses">{t.uses}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

window.MemebroScreens = window.MemebroScreens || {};
window.MemebroScreens.HomeScreen = HomeScreen;
