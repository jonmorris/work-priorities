// Usage:
//   npm run decision-log            validate pending entries and print them
//   npm run decision-log -- --fold  append them to docs/DECISION-LOG.md and delete the files (main only)
import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseEntry, sortByFilename, appendRowsToTable } from './decision-log-lib.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dir = join(root, 'docs', 'decision-log')
const logPath = join(root, 'docs', 'DECISION-LOG.md')

const files = sortByFilename(readdirSync(dir).filter(f => f !== 'README.md'))
const entries = []
const errors = []
for (const f of files) {
  try {
    entries.push({ file: f, ...parseEntry(f, readFileSync(join(dir, f), 'utf8')) })
  } catch (e) {
    errors.push(e.message)
  }
}

if (errors.length) {
  for (const msg of errors) console.error(`error: ${msg}`)
  process.exit(1)
}

if (process.argv.includes('--fold')) {
  if (entries.length === 0) {
    console.log('Nothing to fold.')
  } else {
    const log = readFileSync(logPath, 'utf8')
    writeFileSync(logPath, appendRowsToTable(log, entries.map(e => e.row)))
    for (const e of entries) unlinkSync(join(dir, e.file))
    console.log(`Folded ${entries.length} entr${entries.length === 1 ? 'y' : 'ies'} into docs/DECISION-LOG.md.`)
  }
} else {
  for (const e of entries) console.log(e.row)
  console.log(`${entries.length} pending entr${entries.length === 1 ? 'y' : 'ies'}.`)
}
