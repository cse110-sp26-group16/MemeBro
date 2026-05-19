/* global React, ReactDOM, MemebroShell, MemebroScreens, MemebroTemplates */
/* global TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakToggle, TweakSelect */

const { useState, useEffect } = React;
const { Sidebar, Topbar, MobileBottomNav } = MemebroShell;
const { HomeScreen, SearchScreen, ConjureScreen, EditorScreen, HistoryScreen, ExportScreen } = MemebroScreens;
const { TEMPLATES } = MemebroTemplates;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "density": "regular",
  "screen": "home"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRouteState] = useState(tweaks.screen || "home");
  const [query, setQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [conjurePrompt, setConjurePrompt] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // sync route ↔ tweaks.screen so the Tweaks panel can drive the active screen
  useEffect(() => {
    if (tweaks.screen && tweaks.screen !== route) {
      setRouteState(tweaks.screen);
    }
    // eslint-disable-next-line
  }, [tweaks.screen]);

  const setRoute = (r) => {
    setRouteState(r);
    setTweak("screen", r);
  };

  // apply theme + density to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tweaks.theme || "light");
    document.documentElement.setAttribute("data-density", tweaks.density || "regular");
    // density tweaks: change topbar height / sidebar width / radii
    const d = tweaks.density;
    const root = document.documentElement.style;
    if (d === "compact") {
      root.setProperty("--sidebar-w", "220px");
      root.setProperty("--topbar-h", "48px");
    } else if (d === "cozy") {
      root.setProperty("--sidebar-w", "260px");
      root.setProperty("--topbar-h", "64px");
    } else {
      root.setProperty("--sidebar-w", "244px");
      root.setProperty("--topbar-h", "56px");
    }
  }, [tweaks.theme, tweaks.density]);

  const handleSetTemplate = (t) => setSelectedTemplate(t);

  // search auto-routes from topbar input
  const handleSetQuery = (q) => {
    setQuery(q);
    if (q && route === "home") setRoute("search");
  };

  return (
    <div className={`app-root ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar
        route={route}
        setRoute={setRoute}
        collapsed={sidebarCollapsed}
        mobileOpen={mobileNavOpen}
        closeMobile={() => setMobileNavOpen(false)}
      />

      <main className="main">
        <Topbar
          route={route}
          setRoute={setRoute}
          query={query}
          setQuery={handleSetQuery}
          theme={tweaks.theme}
          setTheme={(v) => setTweak("theme", v)}
          openMobileNav={() => setMobileNavOpen(true)}
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* render the active screen */}
        {route === "home" && (
          <HomeScreen
            setRoute={setRoute}
            setSelectedTemplate={handleSetTemplate}
            query={query}
          />
        )}
        {route === "search" && (
          <SearchScreen
            query={query}
            setQuery={setQuery}
            setRoute={setRoute}
            setSelectedTemplate={handleSetTemplate}
            setConjurePrompt={setConjurePrompt}
          />
        )}
        {route === "editor" && (
          <EditorScreen
            template={selectedTemplate}
            setRoute={setRoute}
            setSelectedTemplate={handleSetTemplate}
          />
        )}
        {route === "mine" && (
          <HistoryScreen
            setRoute={setRoute}
            setSelectedTemplate={handleSetTemplate}
          />
        )}
        {route === "ai-history" && (
          <HistoryScreen
            setRoute={setRoute}
            setSelectedTemplate={handleSetTemplate}
            initialTab="conjured"
          />
        )}
        {route === "export" && (
          <ExportScreen template={selectedTemplate} setRoute={setRoute}/>
        )}
      </main>

      {/* Conjure is rendered as a modal layered on top of any route */}
      {route === "conjure" && (
        <ConjureScreen
          setRoute={setRoute}
          setSelectedTemplate={handleSetTemplate}
          initialPrompt={conjurePrompt}
        />
      )}

      <MobileBottomNav route={route} setRoute={setRoute}/>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Appearance">
          <TweakRadio
            label="Theme"
            value={tweaks.theme}
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ]}
            onChange={(v) => setTweak("theme", v)}
          />
          <TweakRadio
            label="Density"
            value={tweaks.density}
            options={[
              { value: "compact", label: "Compact" },
              { value: "regular", label: "Regular" },
              { value: "cozy", label: "Cozy" },
            ]}
            onChange={(v) => setTweak("density", v)}
          />
        </TweakSection>
        <TweakSection label="Cycle screens">
          <TweakSelect
            label="Active screen"
            value={route}
            options={[
              { value: "home", label: "01 · Library home" },
              { value: "search", label: "02 · Search → AI" },
              { value: "conjure", label: "03 · Conjure (modal)" },
              { value: "editor", label: "04 · Editor" },
              { value: "mine", label: "05 · My memes" },
              { value: "ai-history", label: "05b · Conjured ✦" },
              { value: "export", label: "06 · Export" },
            ]}
            onChange={(v) => {
              if (v === "search") setQuery(query || "ratatouille pulling hair");
              if (v === "conjure") setConjurePrompt(conjurePrompt || "shrek pondering an orb");
              setRoute(v);
            }}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
