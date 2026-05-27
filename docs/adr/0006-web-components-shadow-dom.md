# ADR-0006: Use native Web Components with Shadow DOM for UI

- **Status:** Accepted
- **Date:** 2026-05-27
- **Deciders:** Whole team

## Context

This ADR records a decision already in force. The componentization approach was
set in `AGENTS.md` and `docs/interface-contract.md` and is the basis of the
shipped screens (home #24, gallery #22, conjure #25). It was never captured as a
standalone ADR, so the rationale lived only in convention docs. This fixes that.

[ADR-0001](0001-vanilla-stack.md) locked vanilla HTML, CSS, and JS with no
framework and no bundler. We still need a way to build reusable, self-contained
screens (home, gallery, conjure, history) that multiple people can work on in
parallel without their styles and markup colliding.

Options considered:

- **Native Web Components (custom elements) with Shadow DOM.** Encapsulated
  markup and styles per component, no dependencies, native to the platform.
- **Plain DOM with template functions / `<template>` elements.** Simplest, but
  no style encapsulation, so every component's CSS leaks into a global sheet.
- **Custom elements in the light DOM (no Shadow DOM).** Component semantics
  without style scoping; back to global CSS collisions.

## Decision

Build each screen as a native custom element (`class X extends HTMLElement`)
that owns its own Shadow DOM:

- Tag names are kebab-case with the `memebro-` prefix (e.g. `<memebro-gallery>`).
- Component CSS lives inside the component's shadow root, not in global
  stylesheets.
- The host page is a thin shell that sets up a mount root and imports the
  component module (per the mount-point table in `docs/interface-contract.md`).
- Cross-component communication uses bubbling `CustomEvent`s with
  `composed: true` so they escape the shadow boundary (see the events table in
  the interface contract).

## Consequences

Positive:

- Style encapsulation by default. A component's CSS cannot leak out and the
  global page cannot leak in, so lanes build screens in parallel without
  collisions.
- No framework or dependency. This is the browser's own component model, which
  keeps us inside [ADR-0001](0001-vanilla-stack.md).
- Clear ownership boundary. Each component is one file with its markup, styles,
  and behavior together.

Negative:

- Shadow DOM blocks global styling, so design tokens must cross the boundary
  deliberately. We do this with CSS custom properties in `styles/tokens.css`
  (custom properties inherit through shadow roots), which is why tokens are the
  single source of truth and components only read `var(--token)`.
- Events must be dispatched with `composed: true` or they will not escape the
  shadow root. This is easy to forget; the interface contract documents it.
- Testing requires traversing `shadowRoot` rather than the light DOM, which the
  unit-test setup ([ADR-0005](0005-unit-testing-framework.md)) has to account
  for.
- No server-side rendering, which is fine given [ADR-0002](0002-deployment-target.md)
  (static GitHub Pages).

## When this ADR changes

If we hit a wall where Shadow DOM encapsulation costs more than it gives (for
example, a screen that needs heavy global styling or third-party widgets that
fight the shadow boundary), we revisit with a successor ADR. As long as the
stack stays vanilla per [ADR-0001](0001-vanilla-stack.md), native components are
the default.
