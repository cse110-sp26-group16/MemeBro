# 02 Search → AI

Search with a graceful path into AI generation when nothing matches.

**Maps to issue:** #22 (frontend Gallery / browse) and #25 (Conjure entry from search)

## Design intent

Shows partial matches in the grid, never an abrupt empty state. The conjure offer is a horizontal card below results so the user can fall through to AI generation without losing context.

- No abrupt empty state, ever
- Conjure inherits the current scope (query, filters)

## Mobile layout

Top to bottom:

1. Top bar with hamburger, layers icon, current scope label, the live query
2. Big "Results for «query»" header with exact + partial count (e.g. `0 exact · 0 partial`)
3. Clear button
4. Orange "Can't find «query»? Let AI conjure it" card with description, estimated time, credits, and a full-width Conjure button
5. "CLOSEST MATCHES" section header (collapsible if empty)
6. Empty state copy: "Try a different keyword, or conjure it." with a small magnifier
7. Bottom tab bar, Search tab active

## Desktop layout

Same three-region shell as Home (sidebar, top bar, main).

- Top bar shows the active search query in the centered input
- Main content top: "Results for «query»" header with exact + partial count
- Conjure card: horizontal layout with sparkle icon, copy, and a right-aligned orange Conjure button
- Below: "CLOSEST MATCHES" section, then the partial-match grid OR the empty state copy
- Sidebar footer keeps the orange "Conjure with AI" card with credit count

## Key interactions

- Type in the search input, results update live
- Hit Conjure on the inline card, open conjure modal pre-filled with the query (screen 03)
- Click a partial match, go to editor
- Clear, reset to the unfiltered grid (back to screen 01)
