# Decision log

A dated, one-line-per-decision record of what this project decided. It is an **index,
not a second source of truth**: each row's Ref names the file and section where the
reasoning lives. Those sources are:

- [DECISIONS.md](DECISIONS.md): reasoning that has no other home.
- [CLAUDE.md](../CLAUDE.md): how work on this repo is done.
- The code itself (`src/…`), when the decision is what the code does and nothing else
  explains it.
- **git history**: commit messages, and pull requests on GitHub, for decisions made
  before this log existed.

This file is repo-only. It is never built or shipped.

## How to keep this file

- **Add a file, not a row.** A new decision goes in `docs/decision-log/` as its own file
  named `YYYY-MM-DD-short-name.md` (lowercase, hyphenated), holding exactly one table
  row. Never edit the table on a branch: rows appended to the same last line by parallel
  branches always conflict, and separate files never do.
- **Fold on main.** `npm run decision-log -- --fold` appends the waiting entries to the
  end of the table in filename order (date, then name) and deletes their files. Run it on
  `main`, in a commit of its own, whenever the folder gets long. `npm run decision-log`
  on its own validates and prints the pending entries.
- **One row per decision, not per commit.** A reversed decision gets a new row of kind
  Reversed. The old row stays.
- **Say the decision, not the change** ("Completed projects can be restored", not "edit
  CompletedList.jsx").
- **Kind** is one of: Product, Design, Engineering, Process, Deferred, Reversed. The list
  lives in `scripts/decision-log-lib.js` (`KINDS`). Change it there, and here.
- **Ref** names the file → section holding the why. If no why is written anywhere, write
  it there first, usually in [DECISIONS.md](DECISIONS.md).

`npm test` validates every pending entry, so CI fails on a malformed one.

## Log

| Date | Kind | Decision | Ref |
|---|---|---|---|
| 2026-04-14 | Engineering | Built as a client-only React + Vite single-page app, started from the Vite React template | git history (a22147a); package.json |
| 2026-04-14 | Engineering | All data lives in the browser's localStorage (key `work-priorities-v1`); no backend or accounts | git history (a22147a); src/App.jsx → loadProjects / saveProjects |
| 2026-04-14 | Product | Active projects form one manually ordered list (move up/down); priority is a label, not the sort key | git history (a22147a); src/App.jsx → moveProject |
| 2026-04-14 | Product | A Focus Line is drawn under the top three once more than three projects are active | git history (a22147a); src/App.jsx → card list |
| 2026-04-14 | Product | A project has a required title plus optional description, priority (High/Medium/Low), status (Not Started/In Progress/Blocked), due date and owner | git history (a22147a); src/components/AddEditModal.jsx |
| 2026-04-14 | Product | Completing a project moves it to a dated Completed list, where it can be restored; permanent delete asks for confirmation | git history (a22147a); src/components/CompletedList.jsx |
| 2026-04-14 | Design | Priority is shown as a coloured bar and tag on every card, and status as a tag | git history (a22147a); src/components/ProjectCard.jsx |
| 2026-04-15 | Process | AI-assisted work follows written guidelines: think before coding, simplicity first, surgical changes, goal-driven verification | CLAUDE.md |
| 2026-11-07 | Engineering | Published on GitHub Pages: an Actions workflow builds with Vite and deploys dist/, with the base path set in vite.config.js | docs/DECISIONS.md → Deploy to GitHub Pages; git history (47b33e2) |
| 2026-11-07 | Engineering | The alternative deploy that derived the base path from the repo name at build time (jonmorris/work-priorities#1) was closed unmerged | docs/DECISIONS.md → Deploy to GitHub Pages |
