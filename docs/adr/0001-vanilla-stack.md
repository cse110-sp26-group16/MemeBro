# ADR-0001: Use vanilla HTML, CSS, and JavaScript with no frontend framework

- **Status:** Accepted
- **Date:** 2026-05-12
- **Deciders:** Whole team

## Context

For MemeBro we need to pick a frontend stack. The CSE 110 spec recommends keeping technology choices simple unless there is a real reason to pull in a framework. Our team is 11 people with mixed web experience, and the project lifecycle is one quarter.

Options considered:

- Vanilla HTML, CSS, and JavaScript (no framework).
- React (or Vue, Svelte, etc.) with a bundler.
- Server side framework with templating (Django, Express + EJS, etc.).

## Decision

Use vanilla HTML, CSS, and JavaScript. No frontend framework, no bundler. The only build step is whatever the eventual AI integration needs (likely a server proxy for the AI api key, decided in a future ADR).

## Consequences

Positive:

- Zero ramp up for teammates who are new to web dev.
- No build pipeline to maintain. We deploy static files directly to GitHub Pages.
- Fewer dependencies to ask the TA to approve.
- Faster iteration on the MVP skeleton.

Negative:

- Harder to scale if the feature set grows aggressively. We accept this risk for a one quarter project.
- Less ergonomic for complex state. We will feel this if the AI integration UI gets stateful.
- No component reuse beyond plain functions and templates.

If the team hits a wall with the vanilla approach, we will write a follow-up ADR to revisit and document why.
