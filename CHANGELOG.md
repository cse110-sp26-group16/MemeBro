# Changelog

All notable changes to MemeBro will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/) and [Semantic Versioning](https://semver.org/).

## [Unreleased]

Sprint 4: the Library → Search → Editor vertical slice plus a process and CI hardening push.

### Added

- Search screen with AI-ranked template results and a graceful client-side ImgFlip fallback when the search API is unreachable (#72)
- `/api/search` Cloudflare Worker route serving fixture-ranked templates (#75)
- Cloudflare Worker API scaffold with an `/api/status` health-check endpoint and CORS handling (#26)
- AI prompt builder pure function for the Conjure flow (#27)
- Shared `<memebro-top-bar>` and `<memebro-tab-bar>` chrome web components for the Library → Search → Editor slice (#74)
- Vitest unit-testing and Playwright end-to-end frameworks wired into CI (#36, #37)
- ImgFlip smoke tests, JSON-validator tests, and gallery unit tests (#67, #65, #71)
- CODEOWNERS, a full README rewrite, an ADR index, and a dependencies ledger (#57, #58, #59)

### Changed

- Polished the library home browse grid to render real popular templates from the ImgFlip API and route selected templates to the editor (#70)
- Updated the interface contract to add the Search screen and promote the Editor to the core flow (#69)
- Hardened CI/CD into a single pipeline that gates the GitHub Pages deploy on passing lint, unit, E2E, and worker tests (#89)

### Fixed

- Escaped user-controlled template text rendered in the gallery to close an XSS injection sink (#64)

### Documentation

- ADR-0009 (Cloudflare as the backend platform, supersedes ADR-0003), ADR-0010 (gate the Pages deploy on CI), and ADR-0011 (AI provider for template search) (#62, #89, #88)
- ADR-0006 (web components with Shadow DOM), ADR-0007 (JSDoc instead of TypeScript), and ADR-0008 (frontend linting toolchain) (#56)

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
