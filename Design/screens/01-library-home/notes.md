# 01 Library Home

The landing screen. The library is the asset.

**Maps to issue:** #24 (frontend Home / landing page)

## Design intent

Sidebar of categories on the left (desktop), masonry-style grid of templates on the right. Recent strip up top of the grid. A persistent conjure FAB on mobile, conjure CTA in the top bar on desktop.

- Library as asset mindset, the grid is the product
- FAB visible on every screen, conjure is always one tap away

## Mobile layout (build this first, baseline 375px)

Top to bottom:

1. Top bar with hamburger, layers icon, current category label, and a partial search input
2. Hero stack: dark "fastest way to ship a meme" card, then orange "conjure a brand-new template" card with credit count
3. "All templates" header with count
4. Category chip row: All, Trending, Reaction, Classic, 4-panel, Video, Dev humor, Wholesome
5. Recent strip (horizontal scroll of recent thumbnails)
6. Browse grid (masonry, two columns at 375px)
7. Bottom tab bar: Library, Mine, [orange FAB], Search, Settings

## Desktop layout (scale up at min-width breakpoint TBD)

Three regions: persistent left sidebar (244px), top bar, main content.

- Sidebar groups: LIBRARY (All templates with count, Favorites, Recent), CATEGORIES (Reaction, Classic, 4-panel, Video/GIF, Dev humor), MINE (My memes, Conjured)
- Sidebar footer: orange "Conjure with AI" card with credit count
- Top bar: layers icon, breadcrumb (memebro / all templates), centered search input with Cmd+K hint, theme toggle, orange Conjure button
- Main content: hero strip (two cards side by side), All templates header with sort, category chip row, recent strip, browse grid (five+ columns)

## Key interactions

- Tap a template, go to editor
- Tap conjure (FAB on mobile, button or card on desktop), open conjure modal (screen 03)
- Tap a category chip, filter the grid
- Tap search input, go to search screen (screen 02)
