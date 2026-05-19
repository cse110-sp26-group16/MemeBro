/* global React, MemebroTemplates, MemebroShell */
const EXPORT_Template = MemebroTemplates.TemplateImage;
const EXPORT_Icon = MemebroShell.Icon;
const EXPORT_TEMPLATES = MemebroTemplates.TEMPLATES;

function ExportScreen({ template, setRoute }) {
  const t = template || EXPORT_TEMPLATES[0];
  const [format, setFormat] = React.useState("png");
  const [aspect, setAspect] = React.useState("1:1");
  const [copied, setCopied] = React.useState(false);

  const copyToClip = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const sizeMap = { "1:1": "1080×1080", "4:5": "1080×1350", "9:16": "1080×1920", "16:9": "1920×1080" };
  const fileSizeMap = { png: "148 KB", jpg: "84 KB", webp: "62 KB", gif: "420 KB", mp4: "1.2 MB" };

  return (
    <div className="content" data-screen-label="06 Export">
      <div className="row" style={{ marginBottom: 16, gap: 8 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setRoute("editor")}>
          <EXPORT_Icon name="arrowLeft" size={14}/> Back to editor
        </button>
      </div>

      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <h1>Ready to <em>send it</em></h1>
          <p className="sub">Pick a format + destination. Memebro auto-saves the original to your library.</p>
        </div>
      </div>

      <div className="export-layout">
        <div className="export-preview" data-comment-anchor="export-preview">
          <div className="canvas-frame" style={{
            aspectRatio: aspect.replace(":", "/"),
            maxWidth: aspect === "9:16" ? 280 : aspect === "16:9" ? 520 : 420,
          }}>
            <EXPORT_Template template={t} w={500} fill={true}/>
            <div className="caption top" style={{
              position: "absolute",
              left: 0, right: 0, top: 10,
              textAlign: "center",
              fontFamily: "Impact, Anton, sans-serif",
              fontWeight: 900,
              textTransform: "uppercase",
              color: "white",
              WebkitTextStroke: "2px #000",
              textShadow: "2px 2px 0 #000",
              fontSize: "clamp(18px, 5.5vw, 32px)",
              padding: "0 12px",
            }}>WHEN YOU FINALLY FIX THE BUG</div>
            <div className="caption bottom" style={{
              position: "absolute",
              left: 0, right: 0, bottom: 14,
              textAlign: "center",
              fontFamily: "Impact, Anton, sans-serif",
              fontWeight: 900,
              textTransform: "uppercase",
              color: "white",
              WebkitTextStroke: "2px #000",
              textShadow: "2px 2px 0 #000",
              fontSize: "clamp(18px, 5.5vw, 32px)",
              padding: "0 12px",
            }}>AT 4:59 PM ON FRIDAY</div>
          </div>
          <div className="file-info">
            <span>{sizeMap[aspect]}</span>
            <span>·</span>
            <span>{format.toUpperCase()}</span>
            <span>·</span>
            <span>{fileSizeMap[format]}</span>
          </div>
          <div className="text-mono text-xs muted" style={{ textAlign: "center" }}>
            ✓ Auto-saved to your library
          </div>
        </div>

        <div className="export-options">
          <div className="option-group">
            <label className="field-label">Format</label>
            <div className="toggle-row">
              {["png", "jpg", "webp", "gif", "mp4"].map(f =>
                <button key={f} className={`toggle-btn ${format === f ? "active" : ""}`} onClick={() => setFormat(f)}>
                  {f.toUpperCase()}
                </button>
              )}
            </div>
          </div>

          <div className="option-group">
            <label className="field-label">Aspect ratio</label>
            <div className="toggle-row">
              {["1:1", "4:5", "9:16", "16:9"].map(a =>
                <button key={a} className={`toggle-btn ${aspect === a ? "active" : ""}`} onClick={() => setAspect(a)}>
                  {a}
                </button>
              )}
              <button className="toggle-btn">Custom</button>
            </div>
          </div>

          <div className="option-group">
            <label className="field-label">Send to</label>
            <div className="dest-list">
              <div className="dest-row primary" data-comment-anchor="export-download">
                <div className="dest-icon"><EXPORT_Icon name="download" size={16} stroke="white"/></div>
                <div>
                  <div>Download</div>
                  <div className="dest-sub" style={{ opacity: 0.85, marginLeft: 0, fontSize: 11 }}>save to device</div>
                </div>
                <div className="dest-sub">⌘S</div>
              </div>
              <div className="dest-row" onClick={copyToClip}>
                <div className="dest-icon"><EXPORT_Icon name="copy" size={14}/></div>
                <div>{copied ? "Copied!" : "Copy to clipboard"}</div>
                <div className="dest-sub">⌘C</div>
              </div>
              <div className="dest-row">
                <div className="dest-icon"><EXPORT_Icon name="link" size={14}/></div>
                <div>Copy shareable link</div>
                <div className="dest-sub">memebro.app/m/x8k2</div>
              </div>
              <div className="dest-row">
                <div className="dest-icon" style={{ background: "#1da1f2", color: "white" }}>𝕏</div>
                <div>Post to Twitter</div>
              </div>
              <div className="dest-row">
                <div className="dest-icon" style={{ background: "#5865f2", color: "white", fontWeight: 700, fontSize: 13 }}>D</div>
                <div>Send to Discord</div>
              </div>
              <div className="dest-row">
                <div className="dest-icon" style={{ background: "#4a154b", color: "white", fontWeight: 700, fontSize: 13 }}>S</div>
                <div>Send to Slack</div>
              </div>
            </div>
          </div>

          {t.ai && (
            <div className="sidebar-cta" style={{ padding: 16 }}>
              <h4>Share your conjured template?</h4>
              <div className="text-sm" style={{ marginBottom: 8 }}>Others can discover and remix "{t.name}". You stay credited.</div>
              <div className="row">
                <button className="btn btn-sm" style={{ background: "white", color: "var(--orange-deep)", border: "none" }}>
                  Make public
                </button>
                <button className="btn btn-sm btn-ghost" style={{ color: "rgba(255,255,255,0.85)" }}>Not now</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

window.MemebroScreens = window.MemebroScreens || {};
window.MemebroScreens.ExportScreen = ExportScreen;
