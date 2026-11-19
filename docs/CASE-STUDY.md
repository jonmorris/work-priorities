# Case study: Work Priorities

A running, modular case study of **Work Priorities**, a small web app for keeping work
projects in one ranked order. It is written for a portfolio. This file is repo-only:
it is never built or shipped.

## How this file works

- **Modules, not chapters.** Each `##` section stands alone, so a write-up can pick
  modules and drop the rest without leaving a gap.
- **Tag lines.** Every module opens with an italic tag line:
  - **Core**: the spine of any version.
  - **Optional**: long form, or a specific audience named in brackets.
  - **Evidence**: what to show beside the text, marked `[ ]` until it has been captured
    and `[x]` once it has.
- **Running.** When work is worth telling, add or amend a module and add a row to
  *Log of additions*. Facts and dates come from [DECISION-LOG.md](DECISION-LOG.md). This
  file is where they become a story.
- **Placeholders** go in `[[double brackets]]` for the owner to fill in (role, tools,
  metrics, reflections). Never invent those.

## Suggested cuts

| Form | Modules |
|---|---|
| Short | 1, 2, 4, 11 |
| Standard | 1, 2, 3, 4, 5, 7, 11 |
| Long | 1–11 |

## 1. Overview

*Core · Evidence: [ ] hero screenshot of the ranked list with the Focus Line*

Work Priorities is a single-page web app for ranking work projects. Every active project
sits in one ordered list, the top three sit above a "Focus Line", and finished work moves
to a dated Completed list. It runs entirely in the browser and is published on GitHub
Pages.

- **Role:** [[your role(s): designer, developer, product owner]]
- **Timeline:** first build 14 April 2026; published on GitHub Pages 7 November 2026.
  [[active working time, if you want to state it]]
- **Tools:** React, Vite, GitHub Actions, GitHub Pages, AI coding assistants (Claude
  Code). [[design tools, anything else used]]
- **Team:** [[solo, or who else contributed]]

## 2. The problem

*Core · Evidence: [ ] [[a before-state: the list, doc or board you used before]]*

[[What wasn't working: how you tracked priorities before, and what went wrong with it.]]

The app answers one question: *what should I be working on, in what order?* Each project
carries a priority, a status, a due date and an owner. What the app commits to is the
order.

[[Who it is for: just you, or a team.]]

## 3. Reframing the brief

*Optional [long form; product and design audiences] · Evidence: [ ] [[early sketch or note, if one exists]]*

A typical tracker sorts by a field: priority, due date, status. Work Priorities doesn't.
Priority is a coloured label, and the list order is whatever you set by moving projects up
and down. The brief went from "track priorities" to "maintain one honest ranking".

[[Why you made that shift. What a priority field alone failed to tell you.]]

## 4. One ranked list

*Core · Evidence: [ ] short screen recording of moving a project up past another*

- **Decision (2026-04-14):** active projects form one manually ordered list. Up and down
  controls swap a project with its neighbour, with a short animation. Rank numbers update
  as projects move.
- **Trade-off:** manual order means the list never reshuffles itself. That is
  predictable, but it also means nothing re-ranks a project whose due date is getting
  close. Due dates and priority are shown on the card, and you act on them yourself.
- [[Whether you considered automatic sorting, and why you didn't use it.]]

## 5. The Focus Line

*Core · Evidence: [ ] screenshot with four or more active projects, showing the line under rank 3*

- **Decision (2026-04-14):** once more than three projects are active, a labelled
  "Focus Line" is drawn under the third.
- It turns the ranking into a commitment: above the line is what you're working on,
  below it is what waits.
- [[Why three. Whether the number came from experience or was a guess you'd revisit.]]

## 6. Local-first, no backend

*Optional [engineering audience] · Evidence: [ ] none needed; a code excerpt of load/save if wanted*

- **Decision (2026-04-14):** all data lives in the browser's `localStorage` under a single
  versioned key (`work-priorities-v1`). There are no accounts and no server.
- **What that buys:** the app is a static site that GitHub Pages can host for free, it
  works with no sign-up, and the data stays on your device.
- **What it costs:** no sync between devices or browsers, no sharing, and clearing site
  data deletes everything.
- [[Whether those costs have mattered in practice.]]

## 7. Shipping: the blank page

*Core · Evidence: [ ] screenshot of the blank page; [ ] the passing deploy run in GitHub Actions*

The app was finished in April, but the first attempt to publish it on GitHub Pages showed
an empty white page.

- **Cause:** Pages was serving the repository's source `index.html`, which loads
  `/src/main.jsx`. Browsers can't run JSX, and that absolute path ignores the
  `/work-priorities/` subpath, so the script never loaded.
- **Fix (2026-11-07):** a GitHub Actions workflow builds the app with Vite and deploys
  the built `dist/` folder. The base path is set in `vite.config.js`. The fix was checked
  by serving the build under `/work-priorities/` and loading it in a headless browser
  before merging.
- **A second trap:** until the Pages source was switched to "GitHub Actions", the old
  branch deploy still ran on every push. It finished seconds after the new one and could
  put the blank page back. After the switch, a fresh run of the new workflow published
  the app.
- The lesson travels: when a deploy "succeeds" but the page is wrong, check which
  pipeline actually served the page.

## 8. Saying no on the record

*Optional [long form; product audiences] · Evidence: [ ] link to the closed pull request*

- **A closed alternative:** a competing deploy fix (jonmorris/work-priorities#1) derived
  the base path from the repository name at build time, so a rename wouldn't break it. It
  was closed unmerged in favour of setting the path in `vite.config.js`.
  [[Your reason for that choice.]]
- **Not built:** sync, sharing, accounts, notifications. Nothing has been formally
  deferred in the decision log yet. [[Which of these you'd consider, and which you'd
  refuse on principle.]]
- From 2026-11-19, deferrals are recorded in [DECISION-LOG.md](DECISION-LOG.md) with kind
  *Deferred*, so this module can draw on them.

## 9. Quality

*Optional [engineering audience] · Evidence: [ ] the CI test run*

- The app has no automated UI tests. The deploy fix was verified by rendering the built
  page in a headless browser.
- Lint (`npm run lint`) runs clean apart from one pre-existing error, an unused variable
  in `src/App.jsx`, and one hook-dependency warning in `src/components/AddEditModal.jsx`.
- From 2026-11-19, `npm test` runs in CI on every pull request. It checks the project's
  own records: every pending decision-log entry must parse.
- [[How you tested the app by hand: browsers, devices, edge cases such as an empty list
  or many projects.]]

## 10. Working with an AI collaborator

*Optional [audiences interested in AI-assisted work] · Evidence: [ ] CLAUDE.md excerpt; [ ] an AI-authored PR description*

- **Ground rules (2026-04-15):** the repo's `CLAUDE.md` sets out how an AI assistant
  should work here: state assumptions and ask when unsure, write the minimum code, touch
  only what the task needs, and define how success will be checked.
- **In practice:** the blank-page fix was diagnosed and shipped by Claude Code in a single
  session, including the test render and the follow-up re-deploy. Two AI sessions
  independently proposed deploy fixes (jonmorris/work-priorities#1 and #2), so a person
  had to choose between them.
- **Records:** the decision log and this case study were set up so that AI-assisted
  changes leave a written trail of what was decided and why.
- [[Your reflection: where the assistant helped, where you had to steer it, what you'd
  change.]]

## 11. Outcome and reflection

*Core · Evidence: [ ] link to the live app; [ ] [[a usage note or metric]]*

- **Live:** https://jonmorris.github.io/work-priorities/
- **Outcome:** [[Do you use it? How often? Has it changed how you plan work?]]
- **Metrics:** [[anything measurable, or say plainly that it's a personal tool]]
- **What I'd do differently:** [[reflection]]
- **What's next:** [[next steps, if any]]

## Log of additions

| Date | Module | Change |
|---|---|---|
| 2026-11-19 | 1–11 | Initial draft from git history, the code, and DECISION-LOG.md |
