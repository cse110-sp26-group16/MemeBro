/* global React, MemebroTemplates, MemebroShell */
const HIST_TEMPLATES = MemebroTemplates.TEMPLATES;
const HIST_Template = MemebroTemplates.TemplateImage;
const HIST_Icon = MemebroShell.Icon;

function HistoryScreen({ setRoute, setSelectedTemplate, initialTab = "all" }) {
  const [tab, setTab] = React.useState(initialTab);

  // synthesize "my memes" from templates with realistic-looking dates
  const dates = ["Just now", "2h ago", "Yesterday", "Yesterday", "2 days ago", "3 days ago", "Last week", "Last week", "2 wks", "2 wks", "Last month", "Last month"];
  const allMine = HIST_TEMPLATES.slice(0, 12).map((t, i) => ({
    ...t,
    date: dates[i],
    isDraft: i === 0 || i === 5,
    isShared: !(i === 0 || i === 5),
    isConjured: t.ai,
  }));

  const filtered = (() => {
    switch (tab) {
      case "drafts": return allMine.filter(m => m.isDraft);
      case "shared": return allMine.filter(m => m.isShared);
      case "conjured": return allMine.filter(m => m.isConjured);
      default: return allMine;
    }
  })();

  const openMeme = (m) => { setSelectedTemplate(m); setRoute("editor"); };

  const tabs = [
    { id: "all", label: "All", count: allMine.length },
    { id: "drafts", label: "Drafts", count: allMine.filter(m => m.isDraft).length },
    { id: "shared", label: "Shared", count: allMine.filter(m => m.isShared).length },
    { id: "conjured", label: "Conjured", count: allMine.filter(m => m.isConjured).length },
  ];

  return (
    <div className="content" data-screen-label="05 My Memes">
      <div className="page-header">
        <div>
          <h1>My memes <span className="count">{allMine.length}</span></h1>
          <p className="sub">Everything you've made. Tap to remix.</p>
        </div>
        <div className="row">
          <div className="search-bar" style={{ minWidth: 240 }}>
            <span className="muted"><HIST_Icon name="search" size={14}/></span>
            <input placeholder="Filter my memes..."/>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setRoute("home")}>
            <HIST_Icon name="plus" size={13} stroke="white"/> New meme
          </button>
        </div>
      </div>

      <div className="history-tabs">
        {tabs.map(tb =>
          <button
            key={tb.id}
            className={`history-tab ${tab === tb.id ? "active" : ""}`}
            onClick={() => setTab(tb.id)}
          >
            {tb.id === "conjured" && <HIST_Icon name="sparkles" size={13}/>}
            {tb.label}
            <span className="count">{tb.count}</span>
          </button>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="history-grid">
          {filtered.map((m, i) =>
            <div key={i} className="history-card" onClick={() => openMeme(m)}>
              <div className="hc-img"><HIST_Template template={m}/></div>
              {m.isConjured && <div className="hc-tag">✦ AI</div>}
              {m.isDraft && <div className="hc-tag" style={{ background: "rgba(227,105,26,0.9)" }}>DRAFT</div>}
              <div className="hc-actions">
                <button className="tpl-fav" aria-label="Favorite"><HIST_Icon name="heart" size={12}/></button>
                <button className="tpl-fav" aria-label="Copy"><HIST_Icon name="copy" size={12}/></button>
              </div>
              <div className="hc-meta">
                <div className="hc-title">{m.name}</div>
                <div className="hc-date">{m.date}</div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--ink-3)" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
          <div>Nothing here yet. Go make something!</div>
          <button className="btn btn-primary btn-sm" style={{ marginTop: 14 }} onClick={() => setRoute("home")}>
            Browse templates
          </button>
        </div>
      )}
    </div>
  );
}

window.MemebroScreens = window.MemebroScreens || {};
window.MemebroScreens.HistoryScreen = HistoryScreen;
