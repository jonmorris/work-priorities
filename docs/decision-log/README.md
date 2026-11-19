# Pending decision-log entries

Each file here is one decision waiting to be folded into [../DECISION-LOG.md](../DECISION-LOG.md).
Name it `YYYY-MM-DD-short-name.md` and put exactly one table row in it:
`| Date | Kind | Decision | Ref |`. See "How to keep this file" in DECISION-LOG.md.

- `npm run decision-log` validates and prints the pending entries.
- `npm run decision-log -- --fold` folds them into the table and deletes the files (run it on `main` only).
