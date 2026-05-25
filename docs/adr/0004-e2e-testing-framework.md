# ADR-0004: E2E testing framework

- **Status:** Proposed
- **Date:** 2026-05-24
- **Deciders:** Whole team

## Context

Issue #37 calls for an end to end testing framework so we can verify the MemeBro quick flow (land on home, pick a template, edit caption, export) works correctly in a real browser. The suite should run in CI to gate merges or run on a nightly cron, and be approachable enough for 11 contributors with mixed web experience to add tests over time.

Because the app is vanilla HTML, CSS, and JS with no bundler (ADR-0001), the framework needs to work against plain static files served by any local HTTP server. There is no build step, no hydration, and no client side routing to worry about.

Options considered:

1. **Playwright.** Microsoft backed, multi-browser (Chromium, Firefox, WebKit), modern async API with auto-waiting and built in assertions. First class GitHub Actions support via `microsoft/playwright-github-action`. Heavier install (~150MB browser binaries) but CI caches handle it.
2. **Cypress.** Popular frontend E2E tool with a nice interactive GUI. Historically Chromium focused in CI (Firefox support is experimental). Slower test execution than Playwright. Free tier of Cypress Cloud has limitations.
3. **Puppeteer + Jest.** Lower level Chrome DevTools Protocol wrapper. Chrome only, no built in test runner or assertions, requires manual pairing with Jest or Mocha. More boilerplate for contributors to learn.

## Decision

Use **Playwright** (`@playwright/test`) as the E2E testing framework.

Reasons:

- Multi-browser coverage out of the box. We can run against Chromium in CI by default and optionally add WebKit/Firefox later.
- Auto-wait and locator based selectors reduce flaky tests, which matters when 11 people are writing tests for the first time.
- The official GitHub Action (`microsoft/playwright-github-action`) installs browser deps cleanly in CI. No extra Docker or service container setup.
- Playwright's `webServer` config option can spin up a local static server automatically before tests run, which fits our no-bundler setup perfectly.
- The `@playwright/test` package includes its own test runner and assertion library, so we do not need to bring in a separate test framework for E2E.

## Consequences

Positive:

- One `npm run test:e2e` command runs the full browser suite locally and in CI.
- Contributors write tests in a single file format (Playwright test syntax) without needing to know Jest, Mocha, or other runners.
- Multi-browser support means we catch Safari/Firefox issues early without extra config.
- Playwright's trace viewer and screenshot on failure make debugging CI failures straightforward.

Negative:

- ~150MB of browser binaries need to be downloaded on first install and cached in CI. Acceptable tradeoff for reliable browser testing.
- Contributors unfamiliar with async/await may need a brief onboarding. We mitigate this by including a well commented example test that others can copy.

## Implementation notes

- Install: `npm install -D @playwright/test` then `npx playwright install --with-deps chromium`
- Config: `playwright.config.ts` at repo root, `webServer` pointed at a static file server (e.g. `npx serve .` on port 3000)
- Test location: `tests/e2e/` directory
- CI integration: add a step in `.github/workflows/ci-cd.yml` that installs Chromium and runs `npm run test:e2e`
- Script in `package.json`: `"test:e2e": "playwright test"`

## Dependencies

| Package | Purpose |
| --- | --- |
| `@playwright/test` | E2E test runner and assertions |
| `serve` (dev only) | Local static file server for test runs |
