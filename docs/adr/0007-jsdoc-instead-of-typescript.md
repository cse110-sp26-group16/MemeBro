# ADR-0007: Use JSDoc for types instead of TypeScript

- **Status:** Accepted
- **Date:** 2026-05-27
- **Deciders:** Whole team

## Context

This ADR records a decision already in force. The JSDoc requirement is written
into `AGENTS.md` ("JSDoc, required") and enforced in code by
`eslint-plugin-jsdoc` (see [ADR-0008](0008-frontend-linting-toolchain.md)). It
was never captured as a standalone ADR.

[ADR-0001](0001-vanilla-stack.md) locked vanilla JS with no bundler or build
step. We still want the things types give a team of 11: editor autocomplete,
catching wrong argument shapes, generated reference docs, and an honest paper
trail of what each function expects. The shared data shapes
(`Template`, `Caption`, `Meme`) in `docs/interface-contract.md` especially need
to be expressible in code so lanes can stub against them.

Options considered:

- **JSDoc type annotations.** Types as structured comments. Editors and ESLint
  read them. No compile step, ships as-is to the browser.
- **TypeScript.** Real static type checking, but requires a compiler and an
  emitted build artifact, which contradicts [ADR-0001](0001-vanilla-stack.md)'s
  "no bundler" decision.
- **No types at all.** Lowest ceremony, but no editor help and no enforced
  contract on the shared shapes, which is risky with this many contributors.

## Decision

Use JSDoc as the type system. It is required, not optional:

- Every exported function documents `@param` (with type) and `@returns` (with
  type).
- Every exported `@typedef` mirrors the shared shapes from
  `docs/interface-contract.md` in the consuming module.
- Every custom element class carries a top block describing what it does, the
  events it dispatches, and the attributes it observes.
- `@throws` is documented where a function can throw, and Promise types are
  resolved (`@returns {Promise<Meme[]>}`).

Enforcement is by `eslint-plugin-jsdoc`; until/where the linter is not yet
wired, reviewers enforce it in PR review.

## Consequences

Positive:

- Editor autocomplete and inline warnings on misuse, with zero build step. The
  code we write is the code that ships, consistent with
  [ADR-0001](0001-vanilla-stack.md).
- The shared data shapes have a single, checkable definition that other lanes
  can rely on.
- Generated API docs and a readable contract for new contributors.

Negative:

- Weaker than TypeScript. JSDoc gives editor-level hints, not a hard compile
  error. A wrong type is a warning a developer can ignore, not a failed build,
  unless we later run `tsc --checkJs` (not currently in scope).
- More verbose than TS annotations; the discipline depends on the linter and
  on review.
- Type expressions in comments can drift from the runtime code if not reviewed.

## When this ADR changes

If the codebase grows to the point where JSDoc's lack of real type checking is
causing bugs that a compiler would have caught, we revisit, either by adding a
`tsc --checkJs` gate (still no emit, still vanilla output) or by reconsidering
TypeScript with a successor to [ADR-0001](0001-vanilla-stack.md).
