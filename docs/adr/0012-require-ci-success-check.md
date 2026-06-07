# ADR-0012: Require the ci-success check in branch protection

- **Status:** Accepted
- **Date:** 2026-06-01
- **Deciders:** Whole team

## Context

[ADR-0010](0010-gate-deploy-on-ci.md) moved the deploy into `ci-cd.yml` and made it
`needs: [lint, test-unit, test-e2e, test-worker]`, so a push to `main` that fails CI
never reaches GitHub Pages. ADR-0010 was explicit that this only stops a failing push
from deploying. It does nothing to stop a red pull request from being merged into `main`
in the first place, because the merge gate lives in GitHub branch protection, which is a
repo setting outside the workflow file. ADR-0010 recorded that the setting still had to
be configured and that an ADR cannot set it.

We checked the live setting and found the gap was real. `main` requires one PR review,
blocks force pushes, and blocks deletion, but it does not require any status check. The
"Require status checks to pass before merging" feature had been toggled on, but
`ci-success` was never added to the required list, and an empty list requires nothing. A
reviewer could approve and merge a PR with red CI, and it would then deploy.

A second fact shapes the decision: all 11 active team members are repo admins (see
`docs/process/team-roster.md`). GitHub's `enforce_admins` flag controls whether the
protection rule also binds admins. With it off, any admin can bypass a required check,
and on an all-admin team that means the check binds nobody by force.

Options considered:

- **Option A. Require `ci-success`, leave `strict` off and `enforce_admins` off.** Arms
  the gate for the normal review flow, keeps an admin escape hatch, and avoids the rebase
  churn of `strict`. On an all-admin repo the gate is held up by convention and PR
  visibility rather than being technically unbypassable.
- **Option B. Require `ci-success` and turn `enforce_admins` on.** Makes the gate binding
  for everyone. Removes any emergency manual-merge path and blocks all 11 admins equally.
- **Option C. Require `ci-success` and turn `strict` on.** Also forces every branch to be
  up to date with `main` before it can merge, so `main` is always verified as merged.
  Adds rebase races on an active repo.
- **Option D. Status quo.** Leave branch protection as is and rely on reviewers not
  approving red PRs. Cheapest, but leaves the ADR-0010 gate unenforced.

## Decision

Adopt **Option A**. Configure branch protection on `main` to require the `CI success`
status check before merging. The required-check context is the job's display name from
`ci-cd.yml` (`name: CI success`), not the job id `ci-success`. Keep `strict` off (do not
require branches to be up to date) and keep `enforce_admins` off (admins may bypass).

`CI success` is the single aggregating check from ADR-0010, so renaming or adding
underlying jobs cannot weaken the gate. We require that one check, not the four underlying
jobs. Renaming the aggregating job's display name does break the match, but it fails
closed: PRs block on a check that never reports, until the branch protection rule is
updated to the new name.

We choose `strict` off because the team merges often during a sprint, and the
up-to-date-branch requirement creates rebase races that cost more than they save at this
project's size. We choose `enforce_admins` off deliberately, to preserve a manual merge
path if CI is wedged near a deadline. We accept that, because everyone is an admin, this
makes the gate enforced by team convention and PR visibility rather than being technically
unbypassable. If people routinely bypass it, the follow-up is to turn `enforce_admins` on,
which is a one-setting change and a successor to this ADR.

This decision changes a repo setting only. It does not touch the workflow files, which
already encode the gate per ADR-0010.

## Consequences

Positive:

- The ADR-0010 gate is now enforced at merge time, not just at deploy time. A PR with red
  CI cannot be merged through the normal flow.
- Requiring the single `CI success` check means renaming the underlying jobs cannot
  silently weaken the gate.
- No `strict` flag means no forced-rebase churn during active sprint work.
- Keeping an admin bypass leaves a documented escape hatch for a CI outage near a
  deadline.

Negative:

- Because all members are admins and `enforce_admins` is off, the gate is bypassable by
  anyone. It relies on team discipline, and a grader could read a bypassable check as
  weaker than an enforced one.
- With `strict` off, two PRs that each pass CI independently can still merge into a
  combined `main` that fails (a semantic conflict). CI on the next push catches it, but
  after the fact.
- Branch protection lives in repo settings, not in the repo, so this ADR is the only
  in-repo record of the choice. Anyone auditing the real rule has to read it from GitHub.

## When this ADR changes

If bypasses become a problem, or if the team decides the gate must be technically binding
(for example before a final submission), we turn `enforce_admins` on and write a successor.
If merge volume grows enough that stale-branch breakage on `main` becomes common, we
revisit `strict`. Moving off GitHub Pages or restructuring the required jobs also prompts a
revisit, in step with [ADR-0010](0010-gate-deploy-on-ci.md).
