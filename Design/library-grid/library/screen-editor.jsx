/* global React, MemebroTemplates, MemebroShell */
const EDITOR_Template = MemebroTemplates.TemplateImage;
const EDITOR_Icon = MemebroShell.Icon;
const EDITOR_TEMPLATES = MemebroTemplates.TEMPLATES;

function EditorScreen({ template, setRoute, setSelectedTemplate }) {
  const t = template || EDITOR_TEMPLATES[0];
  const [topText, setTopText] = React.useState("WHEN YOU FINALLY FIX THE BUG");
  const [bottomText, setBottomText] = React.useState("AT 4:59 PM ON FRIDAY");
  const [activePreset, setActivePreset] = React.useState("classic");
  const [selectedLayer, setSelectedLayer] = React.useState("top");
  const [mobileTab, setMobileTab] = React.useState("text");

  const presets = [
    { id: "classic", name: "Classic", className: "" },
    { id: "serif", name: "Serif", className: "serif" },
    { id: "mono", name: "Mono", className: "mono" },
    { id: "bubble", name: "Bubble", className: "bubble" },
    { id: "glitch", name: "Glitch", className: "" },
    { id: "cursed", name: "Cursed", className: "" },
  ];

  const stickers = ["🔥", "✨", "💀", "⚡", "👀", "🌶️", "💯", "🤯"];

  const captionStyle = (() => {
    switch (activePreset) {
      case "serif": return { fontFamily: "'Instrument Serif', serif", fontStyle: "italic", WebkitTextStroke: "0", textShadow: "0 2px 8px rgba(0,0,0,0.5)", fontWeight: 400, textTransform: "none" };
      case "mono": return { fontFamily: "'Geist Mono', monospace", WebkitTextStroke: "0", textShadow: "0 2px 4px rgba(0,0,0,0.6)", fontWeight: 500, letterSpacing: 0 };
      case "bubble": return { fontFamily: "'Geist', sans-serif", color: "var(--orange)", WebkitTextStroke: "2px white", textShadow: "3px 3px 0 #000", fontWeight: 800, textTransform: "none" };
      case "glitch": return { fontFamily: "'Geist Mono', monospace", color: "#0ff", WebkitTextStroke: "0", textShadow: "2px 0 #f0f, -2px 0 #ff0", fontWeight: 700 };
      case "cursed": return { fontFamily: "'Impact', sans-serif", filter: "blur(0.4px) contrast(1.4) saturate(1.4)", WebkitTextStroke: "1px #fff", color: "yellow", textShadow: "2px 2px 0 #000" };
      default: return {};
    }
  })();

  return (
    <div className="editor" data-screen-label="04 Editor">
      <aside className="panel-left">
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <button className="btn btn-icon btn-ghost btn-sm" onClick={() => setRoute("home")} aria-label="Back">
            <EDITOR_Icon name="arrowLeft" size={14}/>
          </button>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
            <div className="text-mono text-xs muted">{t.ai ? "✦ conjured" : "template"}</div>
          </div>
        </div>

        <div className="section-label" style={{ fontSize: 10, margin: "10px 0 6px" }}>Layers</div>
        <div className="layers">
          <div className={`layer ${selectedLayer === "tpl" ? "active" : ""}`} onClick={() => setSelectedLayer("tpl")}>
            <div className="layer-thumb" style={{ overflow: "hidden" }}><EDITOR_Template template={t} w={24}/></div>
            <span>Template</span>
          </div>
          <div className={`layer ${selectedLayer === "top" ? "active" : ""}`} onClick={() => setSelectedLayer("top")}>
            <div className="layer-thumb" style={{ display: "grid", placeItems: "center" }}><EDITOR_Icon name="text" size={12}/></div>
            <span>Top caption</span>
          </div>
          <div className={`layer ${selectedLayer === "bot" ? "active" : ""}`} onClick={() => setSelectedLayer("bot")}>
            <div className="layer-thumb" style={{ display: "grid", placeItems: "center" }}><EDITOR_Icon name="text" size={12}/></div>
            <span>Bottom caption</span>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ width: "100%", justifyContent: "flex-start", marginTop: 4 }}>
            <EDITOR_Icon name="plus" size={12}/> Add text
          </button>
        </div>

        <div className="section-label" style={{ fontSize: 10, margin: "18px 0 6px" }}>Captions</div>
        <div className="form-field" style={{ marginBottom: 8 }}>
          <input className="input" value={topText} onChange={(e) => setTopText(e.target.value)} style={{ fontSize: 13 }}/>
        </div>
        <div className="form-field" style={{ marginBottom: 0 }}>
          <input className="input" value={bottomText} onChange={(e) => setBottomText(e.target.value)} style={{ fontSize: 13 }}/>
        </div>

        {t.ai && (
          <div className="sidebar-cta" style={{ marginTop: 18, padding: 12 }}>
            <h4>✦ Regenerate template</h4>
            <div className="text-sm">This template was conjured. Tweak the prompt to get a new variant.</div>
            <button className="btn btn-sm" style={{ marginTop: 8, background: "white", color: "var(--orange-deep)", border: "none", width: "100%", justifyContent: "center" }}>
              Edit prompt
            </button>
          </div>
        )}
      </aside>

      <div className="editor-canvas-wrap">
        <div className="editor-canvas" data-comment-anchor="editor-canvas">
          <EDITOR_Template template={t} w={500} fill={true}/>
          <div className={`caption top ${selectedLayer === "top" ? "selected" : ""}`} style={captionStyle} onClick={() => setSelectedLayer("top")}>
            {topText}
          </div>
          <div className={`caption bottom ${selectedLayer === "bot" ? "selected" : ""}`} style={captionStyle} onClick={() => setSelectedLayer("bot")}>
            {bottomText}
          </div>
        </div>
      </div>

      <aside className="panel-right">
        <div style={{ display: "flex", gap: 6, marginBottom: 16, justifyContent: "flex-end" }}>
          <button className="btn btn-icon btn-ghost btn-sm" aria-label="Undo"><EDITOR_Icon name="arrowLeft" size={13}/></button>
          <button className="btn btn-icon btn-ghost btn-sm" aria-label="Redo"><EDITOR_Icon name="arrowRight" size={13}/></button>
          <button className="btn btn-primary btn-sm" onClick={() => setRoute("export")} data-comment-anchor="editor-export">
            <EDITOR_Icon name="share" size={13} stroke="white"/> Share
          </button>
        </div>

        <div className="section-label" style={{ fontSize: 10, margin: "0 0 8px" }}>Style presets (1-tap)</div>
        <div className="preset-grid">
          {presets.map(p =>
            <button
              key={p.id}
              className={`preset ${p.className} ${activePreset === p.id ? "active" : ""}`}
              onClick={() => setActivePreset(p.id)}
            >
              <div className="preset-sample">Aa</div>
              <div className="preset-name">{p.name}</div>
            </button>
          )}
        </div>

        <div className="section-label" style={{ fontSize: 10, margin: "18px 0 8px" }}>Stickers</div>
        <div className="sticker-grid">
          {stickers.map((s, i) =>
            <div key={i} className="sticker">{s}</div>
          )}
        </div>

        <div className="section-label" style={{ fontSize: 10, margin: "18px 0 8px" }}>Effects</div>
        <div className="chips">
          <button className="chip">Deep-fry</button>
          <button className="chip">Vintage</button>
          <button className="chip">Glitch</button>
          <button className="chip">JPEG crunch</button>
        </div>
      </aside>

      {/* mobile: bottom toolbar */}
      <div className="mobile-editor-tabs">
        {[
          { id: "text", label: "Text", icon: "text" },
          { id: "style", label: "Style", icon: "palette" },
          { id: "sticker", label: "Stickers", icon: "sticker" },
          { id: "crop", label: "Crop", icon: "crop" },
          { id: "share", label: "Share", icon: "share" },
        ].map(tab =>
          <button
            key={tab.id}
            className={`met ${mobileTab === tab.id ? "active" : ""}`}
            onClick={() => {
              if (tab.id === "share") setRoute("export");
              else setMobileTab(tab.id);
            }}
          >
            <span className="met-icon"><EDITOR_Icon name={tab.icon} size={18}/></span>
            <span>{tab.label}</span>
          </button>
        )}
      </div>
    </div>
  );
}

window.MemebroScreens = window.MemebroScreens || {};
window.MemebroScreens.EditorScreen = EditorScreen;
