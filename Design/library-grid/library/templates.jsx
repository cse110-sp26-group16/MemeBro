/* Memebro — placeholder meme template visuals
   Generates varied SVGs so templates look intentional, not generic boxes.
   Each template has its own color palette, layout, and label. */

const PALETTES = [
  { bg: ["#f4c5a8", "#e88656"], fg: "#3a1d0a", accent: "#fff" },
  { bg: ["#cdd9e3", "#7a98b4"], fg: "#1a2638", accent: "#fff" },
  { bg: ["#e8d4c0", "#a07a4f"], fg: "#2a1a0a", accent: "#fff" },
  { bg: ["#a8d8c8", "#4a8a72"], fg: "#0e2a22", accent: "#fff" },
  { bg: ["#f0e0a8", "#c8a445"], fg: "#3a2a0a", accent: "#fff" },
  { bg: ["#e8c8d8", "#a85a78"], fg: "#3a0a1a", accent: "#fff" },
  { bg: ["#d8d8d8", "#5a5a5a"], fg: "#1a1a1a", accent: "#fff" },
  { bg: ["#d4e8a8", "#5a8a2a"], fg: "#1a2a0a", accent: "#fff" },
  { bg: ["#1a1a1a", "#3a3a3a"], fg: "#f0f0f0", accent: "#e3691a" },
  { bg: ["#fce0c0", "#f08838"], fg: "#3a1a0a", accent: "#fff" },
  { bg: ["#c0d4e8", "#3a6a8a"], fg: "#0a1a2a", accent: "#fff" },
  { bg: ["#e8c8a8", "#8a5a2a"], fg: "#2a1a0a", accent: "#fff" },
];

const hash = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

// figure variants — simple silhouette-style abstract characters
function Figure({ x, y, size = 60, palette, variant = 0 }) {
  const head = size * 0.36;
  const body = size * 0.6;
  const c = palette.fg;
  switch (variant % 6) {
    case 0: // standard standing figure
      return (
        <g transform={`translate(${x}, ${y})`}>
          <circle cx="0" cy={-body * 0.6} r={head / 2} fill={c}/>
          <rect x={-body * 0.32} y={-body * 0.4} width={body * 0.64} height={body * 0.9} rx={body * 0.15} fill={c}/>
        </g>
      );
    case 1: // pointing/reaching
      return (
        <g transform={`translate(${x}, ${y})`}>
          <circle cx="0" cy={-body * 0.62} r={head / 2} fill={c}/>
          <path d={`M${-body*0.3} ${-body*0.4} L${body*0.5} ${-body*0.35} L${body*0.5} ${-body*0.15} L${body*0.3} ${-body*0.05} L${body*0.3} ${body*0.5} L${-body*0.3} ${body*0.5} Z`} fill={c}/>
        </g>
      );
    case 2: // big-headed (cute)
      return (
        <g transform={`translate(${x}, ${y})`}>
          <circle cx="0" cy={-body * 0.4} r={head * 0.8} fill={c}/>
          <circle cx={-head * 0.25} cy={-body * 0.4} r="2" fill={palette.bg[0]}/>
          <circle cx={head * 0.25} cy={-body * 0.4} r="2" fill={palette.bg[0]}/>
          <rect x={-body * 0.2} y={-body * 0.15} width={body * 0.4} height={body * 0.5} rx={body * 0.1} fill={c}/>
        </g>
      );
    case 3: // confused/handsy
      return (
        <g transform={`translate(${x}, ${y})`}>
          <circle cx="0" cy={-body * 0.6} r={head / 2} fill={c}/>
          <rect x={-body * 0.32} y={-body * 0.4} width={body * 0.64} height={body * 0.9} rx={body * 0.15} fill={c}/>
          <circle cx={-body * 0.45} cy={-body * 0.5} r={head * 0.25} fill={c}/>
          <circle cx={body * 0.45} cy={-body * 0.5} r={head * 0.25} fill={c}/>
        </g>
      );
    case 4: // sitting/squat
      return (
        <g transform={`translate(${x}, ${y})`}>
          <circle cx="0" cy={-body * 0.5} r={head / 2} fill={c}/>
          <ellipse cx="0" cy={body * 0.1} rx={body * 0.42} ry={body * 0.35} fill={c}/>
        </g>
      );
    default: // dramatic figure
      return (
        <g transform={`translate(${x}, ${y})`}>
          <path d={`M${-head*0.5} ${-body*0.75} a${head*0.5} ${head*0.5} 0 1 1 ${head} 0 L${body*0.4} ${body*0.5} L${-body*0.4} ${body*0.5} Z`} fill={c}/>
        </g>
      );
  }
}

function PanelBg({ x, y, w, h, palette, dir = "v" }) {
  const id = `g-${hash(`${x}${y}${w}${h}`)}`;
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2={dir === "v" ? 0 : 1} y2={dir === "v" ? 1 : 0}>
          <stop offset="0%" stopColor={palette.bg[0]}/>
          <stop offset="100%" stopColor={palette.bg[1]}/>
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id})`}/>
    </>
  );
}

// caption renderer — meme-style text inside the SVG (for thumbnails)
function MemeText({ x, y, text, size = 14, palette, anchor = "middle" }) {
  return (
    <g>
      <text x={x} y={y} fontFamily="Impact, Anton, sans-serif"
            fontSize={size} fontWeight="900" textAnchor={anchor}
            fill="white" stroke="black" strokeWidth={size * 0.12}
            paintOrder="stroke" letterSpacing="0.5">
        {text.toUpperCase()}
      </text>
    </g>
  );
}

/* === TEMPLATE LAYOUTS === */
/* each returns SVG content for a given aspect ratio */

function TPL_Drake({ palette, w, h, captions = ["NO", "YES"], fill }) {
  const half = h / 2;
  const svgProps = fill ? { style: { width: "100%", height: "100%", display: "block" } } : { width: "100%" };
  return (
    <svg viewBox={`0 0 ${w} ${h}`} {...svgProps} preserveAspectRatio="xMidYMid slice">
      <PanelBg x={0} y={0} w={w * 0.4} h={half} palette={palette}/>
      <PanelBg x={0} y={half} w={w * 0.4} h={half} palette={{...palette, bg:[palette.bg[1], palette.bg[0]]}}/>
      <rect x={w * 0.4} y={0} width={w * 0.6} height={half} fill={palette.accent || "#fff"} opacity="0.95"/>
      <rect x={w * 0.4} y={half} width={w * 0.6} height={half} fill={palette.accent || "#fff"} opacity="0.95"/>
      <Figure x={w * 0.2} y={half * 0.55} size={half * 0.85} palette={palette} variant={3}/>
      <Figure x={w * 0.2} y={half * 1.55} size={half * 0.85} palette={palette} variant={1}/>
      <line x1={0} y1={half} x2={w} y2={half} stroke={palette.fg} strokeWidth="1.5" opacity="0.4"/>
      <line x1={w * 0.4} y1={0} x2={w * 0.4} y2={h} stroke={palette.fg} strokeWidth="1.5" opacity="0.4"/>
      <text x={w * 0.45} y={half * 0.5 + 6} fontFamily="Geist, sans-serif" fontSize={w * 0.06} fontWeight="600" fill={palette.fg}>{captions[0]}</text>
      <text x={w * 0.45} y={half * 1.5 + 6} fontFamily="Geist, sans-serif" fontSize={w * 0.06} fontWeight="600" fill={palette.fg}>{captions[1]}</text>
    </svg>
  );
}

function TPL_TwoButtons({ palette, w, h, fill }) {
  const svgProps = fill ? { style: { width: "100%", height: "100%", display: "block" } } : { width: "100%" };
  return (
    <svg viewBox={`0 0 ${w} ${h}`} {...svgProps} preserveAspectRatio="xMidYMid slice">
      <PanelBg x={0} y={0} w={w} h={h} palette={palette}/>
      <rect x={w * 0.15} y={h * 0.45} width={w * 0.32} height={h * 0.18} rx={h * 0.05} fill="#e3413a"/>
      <rect x={w * 0.53} y={h * 0.45} width={w * 0.32} height={h * 0.18} rx={h * 0.05} fill="#e3413a"/>
      <Figure x={w * 0.5} y={h * 0.32} size={h * 0.45} palette={palette} variant={3}/>
      <text x={w * 0.31} y={h * 0.56} textAnchor="middle" fontSize={w * 0.04} fontWeight="700" fill="white">A</text>
      <text x={w * 0.69} y={h * 0.56} textAnchor="middle" fontSize={w * 0.04} fontWeight="700" fill="white">B</text>
    </svg>
  );
}

function TPL_DistractedBF({ palette, w, h, fill }) {
  const svgProps = fill ? { style: { width: "100%", height: "100%", display: "block" } } : { width: "100%" };
  return (
    <svg viewBox={`0 0 ${w} ${h}`} {...svgProps} preserveAspectRatio="xMidYMid slice">
      <PanelBg x={0} y={0} w={w} h={h} palette={palette} dir="h"/>
      <Figure x={w * 0.22} y={h * 0.78} size={h * 0.6} palette={palette} variant={1}/>
      <Figure x={w * 0.5} y={h * 0.78} size={h * 0.6} palette={palette} variant={3}/>
      <Figure x={w * 0.78} y={h * 0.78} size={h * 0.6} palette={palette} variant={0}/>
    </svg>
  );
}

function TPL_FourPanel({ palette, w, h, fill }) {
  const variants = [0, 2, 4, 5];
  const svgProps = fill ? { style: { width: "100%", height: "100%", display: "block" } } : { width: "100%" };
  return (
    <svg viewBox={`0 0 ${w} ${h}`} {...svgProps} preserveAspectRatio="xMidYMid slice">
      {[0,1,2,3].map(i => {
        const x = (i % 2) * w / 2;
        const y = Math.floor(i / 2) * h / 2;
        const p = { ...palette, bg: i % 2 === 0 ? palette.bg : [palette.bg[1], palette.bg[0]] };
        return (
          <g key={i}>
            <PanelBg x={x} y={y} w={w/2} h={h/2} palette={p}/>
            <Figure x={x + w/4} y={y + h * 0.4} size={h * 0.32} palette={p} variant={variants[i]}/>
          </g>
        );
      })}
      <line x1={w/2} y1={0} x2={w/2} y2={h} stroke="white" strokeWidth="2"/>
      <line x1={0} y1={h/2} x2={w} y2={h/2} stroke="white" strokeWidth="2"/>
    </svg>
  );
}

function TPL_Single({ palette, w, h, variant = 0, fill }) {
  const svgProps = fill ? { style: { width: "100%", height: "100%", display: "block" } } : { width: "100%" };
  return (
    <svg viewBox={`0 0 ${w} ${h}`} {...svgProps} preserveAspectRatio="xMidYMid slice">
      <PanelBg x={0} y={0} w={w} h={h} palette={palette}/>
      <Figure x={w/2} y={h * 0.65} size={Math.min(w, h) * 0.7} palette={palette} variant={variant}/>
    </svg>
  );
}

function TPL_Reaction({ palette, w, h, fill }) {
  const svgProps = fill ? { style: { width: "100%", height: "100%", display: "block" } } : { width: "100%" };
  return (
    <svg viewBox={`0 0 ${w} ${h}`} {...svgProps} preserveAspectRatio="xMidYMid slice">
      <PanelBg x={0} y={0} w={w} h={h} palette={palette}/>
      <ellipse cx={w/2} cy={h * 0.6} rx={w * 0.32} ry={h * 0.3} fill={palette.fg}/>
      <circle cx={w * 0.42} cy={h * 0.5} r={h * 0.04} fill="white"/>
      <circle cx={w * 0.58} cy={h * 0.5} r={h * 0.04} fill="white"/>
      <path d={`M${w*0.4} ${h*0.65} Q${w*0.5} ${h*0.74} ${w*0.6} ${h*0.65}`} stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function TPL_ExpandingBrain({ palette, w, h, fill }) {
  const svgProps = fill ? { style: { width: "100%", height: "100%", display: "block" } } : { width: "100%" };
  return (
    <svg viewBox={`0 0 ${w} ${h}`} {...svgProps} preserveAspectRatio="xMidYMid slice">
      {[0,1,2,3].map(i => {
        const y = i * h / 4;
        const p = { ...palette, bg: i % 2 === 0 ? palette.bg : [palette.bg[1], palette.bg[0]] };
        return (
          <g key={i}>
            <PanelBg x={0} y={y} w={w * 0.45} h={h/4} palette={p}/>
            <rect x={w * 0.45} y={y} width={w * 0.55} height={h/4} fill={palette.accent} opacity="0.95"/>
            <circle cx={w * 0.22} cy={y + h * 0.12} r={h * 0.07 + i * h * 0.012} fill={palette.fg}/>
            {i >= 2 && <circle cx={w * 0.22} cy={y + h * 0.12} r={h * 0.07 + i * h * 0.012} fill="none" stroke="#fff" strokeWidth="1" opacity="0.5"/>}
          </g>
        );
      })}
    </svg>
  );
}

function TPL_ChangeMind({ palette, w, h, fill }) {
  const svgProps = fill ? { style: { width: "100%", height: "100%", display: "block" } } : { width: "100%" };
  return (
    <svg viewBox={`0 0 ${w} ${h}`} {...svgProps} preserveAspectRatio="xMidYMid slice">
      <PanelBg x={0} y={0} w={w} h={h} palette={palette}/>
      <rect x={w * 0.12} y={h * 0.4} width={w * 0.45} height={h * 0.25} rx="4" fill="white" stroke={palette.fg} strokeWidth="2"/>
      <line x1={w * 0.17} y1={h * 0.48} x2={w * 0.5} y2={h * 0.48} stroke={palette.fg} strokeWidth="1.5"/>
      <line x1={w * 0.17} y1={h * 0.54} x2={w * 0.45} y2={h * 0.54} stroke={palette.fg} strokeWidth="1.5"/>
      <Figure x={w * 0.72} y={h * 0.62} size={h * 0.55} palette={palette} variant={0}/>
    </svg>
  );
}

function TPL_Stonks({ palette, w, h, fill }) {
  const svgProps = fill ? { style: { width: "100%", height: "100%", display: "block" } } : { width: "100%" };
  return (
    <svg viewBox={`0 0 ${w} ${h}`} {...svgProps} preserveAspectRatio="xMidYMid slice">
      <PanelBg x={0} y={0} w={w} h={h} palette={palette}/>
      <polyline points={`${w*0.1},${h*0.7} ${w*0.3},${h*0.5} ${w*0.5},${h*0.6} ${w*0.7},${h*0.3} ${w*0.9},${h*0.15}`}
                fill="none" stroke={palette.accent || "#fff"} strokeWidth="3" opacity="0.7"/>
      <Figure x={w * 0.5} y={h * 0.7} size={h * 0.45} palette={palette} variant={1}/>
    </svg>
  );
}

const TEMPLATES = [
  { id: "drake",         name: "Drake Hotline",    cat: "classic",   layout: TPL_Drake,         h: 240, uses: "12.4k" },
  { id: "two-buttons",   name: "Two Buttons",      cat: "reaction",  layout: TPL_TwoButtons,    h: 220, uses: "8.2k" },
  { id: "distracted",    name: "Distracted Bf",    cat: "classic",   layout: TPL_DistractedBF,  h: 160, uses: "18.9k" },
  { id: "expanding",     name: "Expanding Brain",  cat: "4-panel",   layout: TPL_ExpandingBrain,h: 320, uses: "9.1k" },
  { id: "change-mind",   name: "Change My Mind",   cat: "reaction",  layout: TPL_ChangeMind,    h: 200, uses: "6.8k" },
  { id: "stonks",        name: "Stonks Guy",       cat: "reaction",  layout: TPL_Stonks,        h: 240, uses: "11.0k" },
  { id: "four-panel",    name: "Four-Panel Mood",  cat: "4-panel",   layout: TPL_FourPanel,     h: 260, uses: "4.4k" },
  { id: "thinking-cat",  name: "Thinking Cat",     cat: "reaction",  layout: TPL_Reaction,      h: 220, uses: "15.2k" },
  { id: "this-is-fine",  name: "This Is Fine",     cat: "classic",   layout: TPL_Single,        h: 220, uses: "22.1k", variant: 4 },
  { id: "leo-cheers",    name: "Leo Cheers",       cat: "reaction",  layout: TPL_Single,        h: 200, uses: "7.6k", variant: 1 },
  { id: "spider-pointing", name: "Spidermen Pointing", cat: "classic", layout: TPL_DistractedBF, h: 160, uses: "5.9k" },
  { id: "wojak",         name: "Wojak",            cat: "reaction",  layout: TPL_Single,        h: 240, uses: "10.3k", variant: 2 },
  { id: "success-kid",   name: "Success Kid",      cat: "classic",   layout: TPL_Single,        h: 220, uses: "8.8k", variant: 5 },
  { id: "disaster-girl", name: "Disaster Girl",    cat: "classic",   layout: TPL_Single,        h: 260, uses: "13.6k", variant: 0 },
  { id: "one-does-not",  name: "One Does Not...",  cat: "classic",   layout: TPL_Single,        h: 220, uses: "4.7k", variant: 5 },
  { id: "drake-3",       name: "Drake 3-Row",      cat: "ai",        layout: TPL_Drake,         h: 280, uses: "230",   ai: true },
  { id: "rat-chef",      name: "Rat Chef Panic",   cat: "ai",        layout: TPL_Single,        h: 240, uses: "112",   ai: true, variant: 3 },
  { id: "tiny-astro",    name: "Tiny Astronaut",   cat: "ai",        layout: TPL_Single,        h: 280, uses: "98",    ai: true, variant: 5 },
  { id: "shrek-pondering", name: "Shrek Pondering",cat: "ai",        layout: TPL_TwoButtons,    h: 230, uses: "54",    ai: true },
  { id: "melt-monday",   name: "Melt Monday",      cat: "ai",        layout: TPL_Single,        h: 200, uses: "203",   ai: true, variant: 4 },
];

// give each template a stable palette assignment
TEMPLATES.forEach((t, i) => { t.palette = PALETTES[hash(t.id) % PALETTES.length]; });

function TemplateImage({ template, w = 280, fill = false }) {
  const Layout = template.layout;
  const variant = template.variant ?? 0;
  return (
    <Layout palette={template.palette} w={w} h={template.h} variant={variant} fill={fill}/>
  );
}

window.MemebroTemplates = { TEMPLATES, TemplateImage, PALETTES };
