# Decisions

The reasoning behind decisions that is not already written down elsewhere.
Each section is the target of one or more Refs in [DECISION-LOG.md](DECISION-LOG.md).
Add a section here when a decision's "why" has no other home.

## Running records

*2026-11-19.* The project keeps two repo-only records. Neither is built or shipped.

- **[DECISION-LOG.md](DECISION-LOG.md)**: a dated, one-line index of decisions. Each row
  points to the file and section that holds the reasoning.
- **[CASE-STUDY.md](CASE-STUDY.md)**: a modular portfolio write-up built from those facts.

New log entries are separate files in `docs/decision-log/`, folded into the table on
`main`. When parallel branches each append a row to the end of the same table, they
always conflict. Separate files never do. `npm test` validates the pending entries, so a
malformed entry fails CI.

**Kinds:** Product, Design, Engineering, Process, Deferred, Reversed. This is the default
list minus Content, because the app has no reader-facing content beyond its own UI
labels. The list lives in `scripts/decision-log-lib.js` (`KINDS`).

## Deploy to GitHub Pages

*2026-11-07, commit 47b33e2.* GitHub Pages was serving the repository's source
`index.html`, which loads `/src/main.jsx`. Browsers can't execute JSX, and that absolute
path ignores the `/work-priorities/` subpath of a project site, so the page rendered
blank.

The fix builds with Vite in a GitHub Actions workflow (`.github/workflows/deploy.yml`) and
deploys `dist/`. `base: '/work-priorities/'` is set in `vite.config.js`. The Pages source
was switched from "Deploy from a branch" to "GitHub Actions". Until that switch, both
deploys ran on each push, and the branch deploy could overwrite the built site.

An alternative, jonmorris/work-priorities#1, passed the base path on the command line,
derived from the repository name. It was closed unmerged. No reason for preferring the
config-file approach was recorded.
