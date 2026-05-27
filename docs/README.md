# Documentation

How MemeBro documents itself: what lives where, how files are named, which doc
type to use when, and the formatting every doc has to pass. This is the single
source of truth for documentation conventions; `AGENTS.md` is the equivalent for
code.

## Index

### Decisions

- [`adr/`](adr/) — Architecture Decision Records ([index](adr/README.md))
- [`dependencies.md`](dependencies.md) — dependency + TA-approval ledger

### Conventions and contracts

- [`../AGENTS.md`](../AGENTS.md) — binding code conventions and folder structure
- [`interface-contract.md`](interface-contract.md) — mount points, shared data
  shapes, and cross-module events
- [`COMMITFORMAT.md`](COMMITFORMAT.md) — Conventional Commits
- [`SemVerInfo.md`](SemVerInfo.md) — versioning

### Process

- [`process/team-roster.md`](process/team-roster.md) — members, handles, leads
- [`process/team-cadence.md`](process/team-cadence.md) — schedule + process rules

### Meetings

- [`meetings/standups/`](meetings/standups/) — daily-ish syncs
- [`meetings/sprint-planning/`](meetings/sprint-planning/) — sprint kickoffs
- [`meetings/retrospectives/`](meetings/retrospectives/) — sprint retros
- [`meetings/ta/`](meetings/ta/) — TA meeting notes
- [`meetings/templates/`](meetings/templates/) — copy-to-start templates

## File naming

- **kebab-case** for all filenames: `team-roster.md`, not `Team_Roster.md`.
- **Dated docs** end in the meeting date, ISO format: `standup-2026-05-26.md`,
  `ta-meeting-2026-05-13.md`, `sprint-1-retro-2026-05-10.md`.
- **Sprint docs** carry the sprint number: `sprint-2-planning-2026-05-11.md`.
- **ADRs** are zero-padded and numbered sequentially: `0006-web-components-shadow-dom.md`.
  Numbers are never reused, even when an ADR is superseded.
- Dates are always `YYYY-MM-DD`.

## Which doc type to use

| You want to...                                                         | Write a...                     | Where                              |
| ---------------------------------------------------------------------- | ------------------------------ | ---------------------------------- |
| Record a decision (stack, architecture, tooling, process)              | ADR                            | [`adr/`](adr/)                     |
| Log a meeting                                                          | Meeting note (from a template) | the matching `meetings/` subfolder |
| Define a contract other lanes depend on                                | Update `interface-contract.md` | here                               |
| Track a dependency or its TA approval                                  | Add to `dependencies.md`       | here                               |
| Explain a long-form topic that isn't a decision (guides, walkthroughs) | Wiki page                      | the GitHub Wiki                    |

> Decisions go in ADRs, not the wiki. The wiki is for reference material and
> long guides. (Wiki pages can be edited directly since they cannot take PRs.)

## Formatting

Every `.md` file under version control (except the excluded prototype/archival
paths) must pass:

```bash
npm run lint          # includes markdownlint
npm run format:check  # prettier
```

The rules themselves live in [`../.markdownlint.json`](../.markdownlint.json)
and [`../.prettierrc.json`](../.prettierrc.json) — those files are the source of
truth, not this list. The ones people trip on most:

- One top-level `# H1` per file; heading levels increment by one (no `##` then
  `####`).
- Fenced code blocks specify a language (use `text` if none applies).
- No bare URLs — wrap them as `<https://...>` or `[label](https://...)`.
- Files end with a single trailing newline.

Run `npm run format` to auto-fix formatting before opening a PR.

## Templates

Start from a template instead of a blank file:

- Meeting notes: [`meetings/templates/`](meetings/templates/) (standup, sprint
  planning, retro, TA meeting)
- ADRs: [`adr/template.md`](adr/template.md)

Each template's header says where to copy it and what to fill in. Delete the
template's instructional comments once you've filled it in.

## Changing the conventions

Update this file via PR. Substantive changes (a new doc type, a renamed
convention) need team agreement at sprint planning or retro, matching the
`AGENTS.md` change process.
