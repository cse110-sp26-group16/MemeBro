/* global React, MemebroTemplates, MemebroShell */
const CONJURE_TEMPLATES = MemebroTemplates.TEMPLATES;
const CONJURE_Template = MemebroTemplates.TemplateImage;
const CONJURE_Icon = MemebroShell.Icon;

function ConjureScreen({ setRoute, setSelectedTemplate, initialPrompt = "" }) {
  const [prompt, setPrompt] = React.useState(initialPrompt);
  const [hasRef, setHasRef] = React.useState(false);
  const [style, setStyle] = React.useState("photo");
  const [layout, setLayout] = React.useState("1-panel");
  const [generating, setGenerating] = React.useState(false);
  const [results, setResults] = React.useState(null);
  const [selectedIdx, setSelectedIdx] = React.useState(0);

  const examplePrompts = [
    "shrek pondering an orb",
    "rat lawyer on zoom",
    "tiny astronaut confused",
    "drake but with 3 rows",
    "cat melting into chair",
  ];

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      // pick 4 random AI templates to use as "results"
      const pool = [...CONJURE_TEMPLATES].sort((a,b) => (b.ai?1:0)-(a.ai?1:0));
      setResults(pool.slice(0, 4));
      setSelectedIdx(0);
      setGenerating(false);
    }, 1600);
  };

  const useResult = () => {
    if (results && results[selectedIdx]) {
      setSelectedTemplate({ ...results[selectedIdx], ai: true, name: prompt || results[selectedIdx].name });
      setRoute("editor");
    }
  };

  const stylePreviews = [
    { id: "photo",     name: "Photo",     bg: "linear-gradient(135deg, #e8d4c0, #a07a4f)" },
    { id: "cartoon",   name: "Cartoon",   bg: "linear-gradient(135deg, #f4c5a8, #e88656)" },
    { id: "3d",        name: "3D render", bg: "linear-gradient(135deg, #cdd9e3, #7a98b4)" },
    { id: "retro",     name: "Retro",     bg: "linear-gradient(135deg, #f0e0a8, #c8a445)" },
    { id: "painted",   name: "Painted",   bg: "linear-gradient(135deg, #e8c8d8, #a85a78)" },
    { id: "screenshot",name: "Screenshot",bg: "linear-gradient(135deg, #d8d8d8, #5a5a5a)" },
  ];

  const layouts = [
    { id: "1-panel", name: "1-panel" },
    { id: "2-panel", name: "2-panel" },
    { id: "3-panel", name: "3-panel" },
    { id: "4-panel", name: "4-panel" },
  ];

  return (
    <div className="modal-backdrop" data-screen-label="03 Conjure" onClick={(e) => { if (e.target === e.currentTarget) setRoute("home"); }}>
      <div className="modal" style={{ maxWidth: 820 }}>
        <div className="modal-header">
          <h2>✦ <em>Conjure</em> a template</h2>
          <button className="btn btn-icon btn-ghost" onClick={() => setRoute("home")} aria-label="Close">
            <CONJURE_Icon name="close" size={16}/>
          </button>
        </div>
        <div className="modal-body">
          {!results ? (
            <>
              <div className="form-field">
                <label>Describe the meme</label>
                <textarea
                  className="textarea"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. a tiny rat in a chef hat looking dramatically at the camera"
                  rows={3}
                  autoFocus
                />
                <div className="row" style={{ gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                  {examplePrompts.map(p =>
                    <button key={p} className="chip" onClick={() => setPrompt(p)}>{p}</button>
                  )}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="form-field" style={{ marginBottom: 0 }}>
                  <label>Reference image (optional)</label>
                  <div className="dropzone" onClick={() => setHasRef(!hasRef)}>
                    {hasRef ? (
                      <div className="row" style={{ justifyContent: "center" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 6, background: "var(--bg-2)" }}/>
                        <div className="text-sm" style={{ color: "var(--ink-2)" }}>reference.png · click to remove</div>
                      </div>
                    ) : (
                      <>
                        <div className="dz-icon"><CONJURE_Icon name="upload" size={20} stroke="var(--ink-3)"/></div>
                        Drop or click to add image
                      </>
                    )}
                  </div>
                </div>

                <div className="form-field" style={{ marginBottom: 0 }}>
                  <label>Layout</label>
                  <div className="chips">
                    {layouts.map(l =>
                      <button key={l.id} className={`chip ${layout === l.id ? "active" : ""}`} onClick={() => setLayout(l.id)}>{l.name}</button>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-field" style={{ marginTop: 16 }}>
                <label>Style</label>
                <div className="style-grid">
                  {stylePreviews.map(s =>
                    <button
                      key={s.id}
                      className={`style-tile ${style === s.id ? "active" : ""}`}
                      onClick={() => setStyle(s.id)}
                    >
                      <div className="style-preview" style={{ background: s.bg }}/>
                      <div className="style-name">{s.name}</div>
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="row-between" style={{ marginBottom: 14 }}>
                <div>
                  <div className="text-mono text-xs muted">PROMPT</div>
                  <div className="text-sm" style={{ color: "var(--ink)", marginTop: 2 }}>"{prompt}"</div>
                </div>
                <button className="btn btn-sm" onClick={() => setResults(null)}>
                  <CONJURE_Icon name="edit" size={13}/> Edit
                </button>
              </div>

              <div className="ai-results">
                {results.map((r, i) => (
                  <div key={i} className={`ai-result ${selectedIdx === i ? "selected" : ""}`} onClick={() => setSelectedIdx(i)}>
                    <div className="check"><CONJURE_Icon name="plus" size={11} stroke="white"/></div>
                    <CONJURE_Template template={r}/>
                  </div>
                ))}
              </div>

              <div className="row" style={{ marginTop: 14, justifyContent: "space-between" }}>
                <div className="text-mono text-xs muted">SELECTED VARIATION {selectedIdx + 1} / 4</div>
                <button className="btn btn-sm btn-ghost" onClick={generate}>
                  <CONJURE_Icon name="refresh" size={13}/> Regenerate all
                </button>
              </div>
            </>
          )}

          {generating && (
            <div style={{
              marginTop: 16,
              padding: 18,
              borderRadius: "var(--radius)",
              background: "var(--orange-wash)",
              border: "1px dashed var(--orange)",
              display: "flex",
              alignItems: "center",
              gap: 14,
              color: "var(--ink-2)",
              fontSize: 14,
            }}>
              <div className="generating-dots"><span/><span/><span/></div>
              <div>
                <div style={{ fontWeight: 600, color: "var(--ink)" }}>Conjuring 4 variations…</div>
                <div className="text-sm muted">"{prompt || "describe something above"}"</div>
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <div className="meta">
            {results ? "VARIATION SELECTED · READY TO EDIT" : "1 CREDIT WILL BE USED · 4 / 5 REMAINING"}
          </div>
          <div className="row">
            <button className="btn btn-ghost" onClick={() => setRoute("home")}>Cancel</button>
            {results ? (
              <button className="btn btn-primary btn-lg" onClick={useResult}>
                Use this <CONJURE_Icon name="arrowRight" size={15} stroke="white"/>
              </button>
            ) : (
              <button
                className="btn btn-ai btn-lg"
                onClick={generate}
                disabled={!prompt || generating}
                style={{ opacity: (!prompt || generating) ? 0.5 : 1 }}
              >
                <CONJURE_Icon name="sparkles" size={15} stroke="white"/>
                {generating ? "Conjuring…" : "Conjure 4 variations"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

window.MemebroScreens = window.MemebroScreens || {};
window.MemebroScreens.ConjureScreen = ConjureScreen;
