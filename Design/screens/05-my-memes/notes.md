# 05 My Memes

The history view. Everything the user has made, organized.

**Maps to issue:** unowned for sprint 2 (history is post-MVP). Visual reference for the eventual implementation.

## Design intent

Categorized in the sidebar: conjured, drafts, favorites, team libraries. Clear filter persistence so the user does not lose their place.

- Team library support is a first-class organization unit
- Clear filter persistence, the chosen tab and filter stay across navigation

## Mobile layout

Top to bottom:

1. Top bar with hamburger, layers icon, "my memes" label, search query if any, conjure button
2. "My memes 12" header with count
3. Sub: "Everything you've made. Tap to remix."
4. Search input + orange "+ New meme" button row
5. Tab row: All 12, Drafts 2, Shared 10, Conjure
6. Meme grid (two columns at 375px), each card shows the meme + title + timestamp + optional DRAFT badge
7. Bottom tab bar, Mine tab active

## Desktop layout

Standard three-region shell.

- Sidebar adds a MINE group (My memes, Conjured with counts) and a TEAMS group (cutie-devs)
- Top bar shows the breadcrumb (memebro / my memes), filter input, sort buttons (date, favorites)
- Main content: "My memes 24" header, tab row (All, Drafts, Shared, Conjured), meme grid (five columns)

## Key interactions

- Tap a meme, go to editor with that meme loaded
- Tap a tab, filter the grid, persist the choice in storage
- Search, filter the visible memes
- Tap "+ New meme", go to home / library
