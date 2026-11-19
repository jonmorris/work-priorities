// Helpers for docs/decision-log/: one pending decision per file, folded into
// docs/DECISION-LOG.md on main. See docs/DECISION-LOG.md "How to keep this file".

// The one place the allowed Kinds are listed.
export const KINDS = ['Product', 'Design', 'Engineering', 'Process', 'Deferred', 'Reversed']

const FILENAME_RE = /^\d{4}-\d{2}-\d{2}-[a-z0-9]+(-[a-z0-9]+)*\.md$/

export function isValidFilename(name) {
  return FILENAME_RE.test(name)
}

// Split a table row on unescaped pipes; returns the cells between the outer pipes.
function splitCells(line) {
  return line.slice(1, -1).split(/(?<!\\)\|/).map(c => c.trim())
}

// Parse one entry file. Returns { date, kind, decision, ref, row }; throws an
// Error whose message names the file and the problem.
export function parseEntry(filename, text) {
  const fail = msg => { throw new Error(`${filename}: ${msg}`) }

  if (!isValidFilename(filename)) {
    fail('filename must look like YYYY-MM-DD-short-name.md (lowercase, hyphenated)')
  }
  const lines = text.split(/\r?\n/).filter(l => l.trim() !== '')
  if (lines.length !== 1) fail(`must hold exactly one non-blank line, found ${lines.length}`)

  const row = lines[0].trim()
  if (!row.startsWith('|') || !row.endsWith('|')) fail('row must start and end with "|"')

  const cells = splitCells(row)
  if (cells.length !== 4) fail(`row must have exactly 4 cells (Date | Kind | Decision | Ref), found ${cells.length}`)

  const [date, kind, decision, ref] = cells
  const fileDate = filename.slice(0, 10)
  if (date !== fileDate) fail(`Date cell "${date}" does not match the filename date ${fileDate}`)
  if (!KINDS.includes(kind)) fail(`Kind "${kind}" is not one of: ${KINDS.join(', ')}`)
  if (!decision) fail('Decision cell is empty')
  if (!ref) fail('Ref cell is empty')

  return { date, kind, decision, ref, row }
}

// Filename order is date order, then name.
export function sortByFilename(filenames) {
  return [...filenames].sort()
}

// Append rows after the last row of the table under the "## Log" heading.
export function appendRowsToTable(markdown, rows) {
  if (rows.length === 0) return markdown
  const lines = markdown.split('\n')
  const heading = lines.findIndex(l => l.trim() === '## Log')
  if (heading < 0) throw new Error('DECISION-LOG.md has no "## Log" heading')

  let last = -1
  for (let i = heading + 1; i < lines.length; i++) {
    if (lines[i].startsWith('## ')) break
    if (lines[i].trim().startsWith('|')) last = i
  }
  if (last < 0) throw new Error('no table found under "## Log"')

  lines.splice(last + 1, 0, ...rows)
  return lines.join('\n')
}
