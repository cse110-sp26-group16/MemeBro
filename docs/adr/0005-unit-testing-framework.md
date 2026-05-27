# ADR-0005: Unit testing framework

- **Status:** Proposed
- **Date:** 2026-05-24
- **Deciders:** Whole team

## Context

Issue #36 calls for a unit testing framework so contributors can write per-module smoke tests against the Definition of Done. The suite needs to run in CI to gate merges and be simple enough for 11 contributors with mixed web experience.

Because the app is vanilla HTML, CSS, and JS with no bundler (ADR-0001), the framework must handle plain JS source files without requiring a compile or transform step from the contributor's perspective. If the codebase adopts ES module syntax (`import`/`export`), the framework should support that natively.

We already chose Playwright for E2E testing (ADR-0004). The unit framework covers isolated function and module logic (string manipulation, data transforms, DOM helpers) rather than full browser flows.

Options considered:

1. **Vitest.** Modern test runner with native ESM support. Uses Vite's transform pipeline internally but does not require the project to use Vite as a bundler. Jest-compatible API (`describe`, `it`, `expect`). Fast startup, lightweight install (~30MB). Built-in coverage via `@vitest/coverage-v8`. JSDOM environment available for DOM unit tests.
2. **Jest.** Industry standard, massive ecosystem. Heavier install (~60MB). ES module support requires `--experimental-vm-modules` flag or Babel transforms, adding config friction for a no-bundler project. Slower startup due to its own transform pipeline.
3. **Mocha + Chai.** Flexible but requires assembling pieces manually (assertion library, coverage tool, mock library). More boilerplate config. No built-in watch mode or snapshot testing.

## Decision

Use **Vitest** as the unit testing framework.

Reasons:

- Native ESM support. Vanilla JS files using `import`/`export` work out of the box with zero extra config. Jest would require experimental flags or Babel, which contradicts the simplicity goal of ADR-0001.
- Jest-compatible API. Contributors who have used Jest before (common in CSE courses) will recognize `describe`, `it`, `expect`, `vi.fn()`. The learning curve is effectively zero.
- Fast execution. Vitest is significantly faster than Jest for small to medium suites because it reuses Vite's module graph and runs transforms on demand. Fast CI = fast feedback on PRs.
- Built-in essentials. Coverage (`vitest --coverage`), watch mode, mocking (`vi.mock`, `vi.fn`), and a JSDOM environment for DOM tests are all included or one install away. No need to assemble a toolchain from separate packages.
- Lightweight install. ~30MB vs Jest's ~60MB. Smaller `node_modules`, faster CI cold installs.

## Consequences

Positive:

- One `npm run test:unit` command runs the full unit suite locally and in CI.
- Contributors write tests in a familiar Jest-style syntax without needing to learn a new API.
- ES module source files work without any extra configuration or flags.
- Fast test execution keeps the feedback loop tight for 11 contributors working in parallel.
- JSDOM environment means DOM-manipulating helpers (e.g. template rendering functions) can be unit tested without spinning up a real browser.

Negative:

- Vitest is newer than Jest, so some Stack Overflow answers may reference Jest-specific config. Mitigated by the API being nearly identical and Vitest docs being comprehensive.
- Contributors who only know Jest may occasionally confuse `vi.fn()` with `jest.fn()`. Mitigated by including a well-commented example test.

## Implementation notes

- Install: `npm install -D vitest`
- Optional: `npm install -D @vitest/coverage-v8 jsdom` (coverage reporting + DOM environment)
- Config: `vitest.config.js` at repo root with `environment: 'jsdom'` for DOM tests
- Test location: `tests/unit/` directory, files named `*.test.js`
- Script in `package.json`: `"test:unit": "vitest run"`, `"test:unit:watch": "vitest"`
- CI integration: add a step in `.github/workflows/ci-cd.yml` that runs `npm run test:unit` and gates merge on failure

## Dependencies

| Package | Purpose |
| --- | --- |
| `vitest` | Unit test runner and assertions |
| `@vitest/coverage-v8` (optional) | Code coverage reporting |
| `jsdom` (optional) | DOM environment for unit testing DOM helpers |
