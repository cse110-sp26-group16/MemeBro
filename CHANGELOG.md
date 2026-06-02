# Changelog

All notable changes to MemeBro will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/) and [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- AI-powered template ranking module (`memebro-api/src/search-ranking.js`); backs the `/api/search` route once ADR-0010 (#76) picks the provider (#77)
- Worker test CI job — `memebro-api` tests now run on every PR (#75)
- Shared `<memebro-top-bar>` and `<memebro-tab-bar>` chrome web components for the Library → Search → Editor slice (#74)

## [0.1.0] - 2026-05-24

Sprint 2: foundation and quick flow skeleton.

### Added

- Home page layout with library grid, pinned search top bar, and mobile Conjure action (#47)
- Responsive meme template gallery component with category filtering (#45)
- Design tokens in `styles/tokens.css` ported from the Library Grid hi-fi (#41)
- AGENTS.md contributor spec defining norms for branches, commits, testing, and JSDoc (#41)
- Interface contract documenting screens, data shapes, custom events, and localStorage schema (#41)
- Prompt engineering research spike with five prompt templates and edge case results (#20)

### Changed

- ADR-0001 cross-references fixed, ADR-0002 (GitHub Pages deployment) accepted (#41)
- JSDoc promoted from recommended to required, with lint enforcement planned (#41)

### Documentation

- ADR-0003 proposed and deferred (backend stack for AI proxy) with TA sign-off (#34)
- Library Grid mobile-first design screens added to `docs/design/` (#42)
- Sprint 2 process docs and meeting logs (#32)
