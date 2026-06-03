# ADR-0010: Gate the GitHub Pages deploy on CI passing

- **Status:** Proposed <!-- Proposed | Accepted | Deferred | Superseded by ADR-NNNN -->
- **Date:** 2026-06-01
- **Deciders:** Yuval (@ypesok28), pending team ratification at review

## Context

Until now MemeBro had two independent workflows. `ci-cd.yml` ran lint and tests;
a separate `deploy.yml` published to GitHub Pages. Both triggered on a push to
`main` and ran concurrently, with no dependency between them. Nothing in the
pipeline made the deploy wait for the tests, so the only thing stopping a broken
build from going live was GitHub branch-protection settings, which live outside
the repo, are invisible in code review, and are bypassable by a direct or admin
push. The two workflows even shared a `pages` concurrency group, which only
serialized them in an arbitrary order rather than ordering verify-then-deploy.

This matters because the project is graded on process, and "CD" should mean we
deliver only verified builds. We needed the gate to be explicit and to live in
the repo. Options considered:

- **Option A. One workflow, `needs:`.** Move the deploy into `ci-cd.yml` as a
  job that `needs` the test jobs and runs only on push to `main`. The dependency
  is declared in code, in one file.
- **Option B. Keep `deploy.yml`, trigger on `workflow_run`.** Leave deploy
  separate but fire it only after the CI workflow concludes successfully.
  Separation of concerns, at the cost of a more indirect link and `workflow_run`
  / `conclusion` plumbing.
- **Option C. Status quo, rely on branch protection.** No pipeline change;
  document the required checks. Cheapest, but leaves the gate as invisible
  settings and does nothing for direct pushes.

## Decision

Adopt **Option A**. The `deploy` job lives in `ci-cd.yml`, declares
`needs: [lint, test-unit, test-e2e, test-worker]`, and runs only when
`github.event_name == 'push' && github.ref == 'refs/heads/main'`. `deploy.yml`
is deleted. Pages permissions (`pages: write`, `id-token: write`) are scoped to
the deploy job rather than the whole workflow, and the deploy keeps its own
`pages` concurrency group so deploys never cancel each other. A `ci-success`
aggregate job is the single status check branch protection should require.

## Consequences

Positive:

- A push that fails any required check never reaches GitHub Pages. The gate is
  now in code and visible in review.
- One workflow file describes the whole pipeline; least-privilege permissions.
- Branch protection requires one stable check (`ci-success`) instead of a list
  that silently weakens when a job is renamed.

Negative:

- Deploy is now coupled to the Worker tests; flaky `test-worker` runs can block a
  frontend-only deploy.
- `ci-cd.yml` is larger and does more. We accept that over the previous
  split-but-ungated arrangement.
- Branch protection still has to be configured to require `ci-success`; the ADR
  records intent but cannot set the repo setting.

## When this ADR changes

If we split frontend and backend into separate deploy targets, move off GitHub
Pages, or want per-PR preview deploys, we revisit this and write a successor ADR.
