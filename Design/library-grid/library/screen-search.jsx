/* global React, MemebroTemplates, MemebroShell */
const SEARCH_TEMPLATES = MemebroTemplates.TEMPLATES;
const SEARCH_Template = MemebroTemplates.TemplateImage;
const SEARCH_Icon = MemebroShell.Icon;

function SearchScreen({ query, setQuery, setRoute, setSelectedTemplate, setConjurePrompt }) {
  // fuzzy-ish match — return at most 4 partials when there's no exact match
  const q = query.toLowerCase().trim();
  const matches = SEARCH_TEMPLATES.filter(t =>
    t.name.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q)
  );
  const noExact = matches.length === 0;
  const partials = noExact
    ? SEARCH_TEMPLATES.filter(t =>
        q.split(/\s+/).some(word => word && (t.name.toLowerCase().includes(word) || t.cat.toLowerCase().includes(word)))
      ).slice(0, 6)
    : matches;

  const openTemplate = (t) => { setSelectedTemplate(t); setRoute("editor"); };
  const tryConjure = () => { setConjurePrompt(query); setRoute("conjure"); };

  return (
    <div className="content" data-screen-label="02 Search">
      <div className="search-result-head">
        <h2>
          Results for <span className="query">"{query || "—"}"</span>
          <span className="count text-mono">
            {noExact ? `0 exact · ${partials.length} partial` : `${matches.length} matches`}
          </span>
        </h2>
        <button className="btn btn-ghost btn-sm" onClick={() => { setQuery(""); setRoute("home"); }}>
          <SEARCH_Icon name="close" size={13}/> Clear
        </button>
      </div>

      {noExact && (
        <div className="conjure-banner" data-comment-anchor="search-conjure-banner">
          <div className="glyph">✦</div>
          <div>
            <h3>Can't find <em>"{query}"</em>? Let AI conjure it.</h3>
            <p>We'll generate a brand-new template from your query — keep the same prompt or refine it on the next step.</p>
            <div className="meta">~8 SEC · 4 OPTIONS · 1 CREDIT · YOU OWN IT</div>
          </div>
          <button className="btn btn-primary btn-lg" onClick={tryConjure}>
            <SEARCH_Icon name="sparkles" size={15}/> Conjure
          </button>
        </div>
      )}

      <div className="section-label">
        <SEARCH_Icon name="library" size={11}/>
        {noExact ? "Closest matches" : "Templates"}
      </div>

      {partials.length > 0 ? (
        <div className="masonry">
          {partials.map(t =>
            <div key={t.id} className={`tpl-card ${t.ai ? "ai-badge" : ""}`} onClick={() => openTemplate(t)}>
              <div className="tpl-img"><SEARCH_Template template={t}/></div>
              <div className="tpl-meta">
                <span className="tpl-name">{t.name}</span>
                <span className="tpl-uses">{t.uses}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--ink-3)" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
          <div>Try a different keyword, or conjure it.</div>
        </div>
      )}

      {noExact && partials.length > 0 && (
        <>
          <div className="spacer-lg"/>
          <div className="section-label">
            <SEARCH_Icon name="sparkles" size={11}/>
            Or try these recently conjured by others
          </div>
          <div className="masonry">
            {SEARCH_TEMPLATES.filter(t => t.ai).map(t =>
              <div key={t.id} className="tpl-card ai-badge" onClick={() => openTemplate(t)}>
                <div className="tpl-img"><SEARCH_Template template={t}/></div>
                <div className="tpl-meta">
                  <span className="tpl-name">{t.name}</span>
                  <span className="tpl-uses">{t.uses}</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

window.MemebroScreens = window.MemebroScreens || {};
window.MemebroScreens.SearchScreen = SearchScreen;
