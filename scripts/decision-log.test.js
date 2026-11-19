import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { KINDS, isValidFilename, parseEntry, sortByFilename, appendRowsToTable } from './decision-log-lib.js'

const ok = '| 2026-11-19 | Process | Adopt a decision log | docs/DECISIONS.md → Running records |'

test('isValidFilename', () => {
  assert.ok(isValidFilename('2026-11-19-adopt-log.md'))
  assert.ok(isValidFilename('2026-11-19-v2.md'))
  for (const bad of ['2026-11-19.md', '2026-11-19-Adopt.md', '2026-11-19-a_b.md', '2026-11-19-a--b.md',
    '2026-11-19-a-.md', '26-11-19-a.md', '2026-11-19-a.txt', 'README.md']) {
    assert.ok(!isValidFilename(bad), bad)
  }
})

test('parseEntry accepts a valid row', () => {
  const e = parseEntry('2026-11-19-adopt-log.md', `\n${ok}\n\n`)
  assert.deepEqual(
    { date: e.date, kind: e.kind, decision: e.decision, ref: e.ref },
    { date: '2026-11-19', kind: 'Process', decision: 'Adopt a decision log', ref: 'docs/DECISIONS.md → Running records' },
  )
  assert.equal(e.row, ok)
})

test('parseEntry allows escaped pipes inside a cell', () => {
  const e = parseEntry('2026-11-19-x.md', '| 2026-11-19 | Product | A \\| B | git history |')
  assert.equal(e.decision, 'A \\| B')
})

test('parseEntry rejects bad entries with a message naming the file and problem', () => {
  const cases = [
    ['2026-11-19-Bad.md', ok, /filename/],
    ['2026-11-19-x.md', '', /exactly one non-blank line, found 0/],
    ['2026-11-19-x.md', `${ok}\n${ok}`, /exactly one non-blank line, found 2/],
    ['2026-11-19-x.md', ok.slice(1), /start and end/],
    ['2026-11-19-x.md', ok.slice(0, -1), /start and end/],
    ['2026-11-19-x.md', '| 2026-11-19 | Process | only three |', /exactly 4 cells/],
    ['2026-11-19-x.md', '| 2026-11-19 | Process | a | b | c |', /exactly 4 cells/],
    ['2026-11-19-x.md', '| 2026-11-18 | Process | a | b |', /does not match the filename date/],
    ['2026-11-19-x.md', '| 2026-11-19 | Content | a | b |', /Kind "Content"/],
    ['2026-11-19-x.md', '| 2026-11-19 | Process |  | b |', /Decision cell is empty/],
    ['2026-11-19-x.md', '| 2026-11-19 | Process | a |  |', /Ref cell is empty/],
  ]
  for (const [file, text, re] of cases) {
    assert.throws(() => parseEntry(file, text), err => err.message.startsWith(`${file}: `) && re.test(err.message), `${file} ${text}`)
  }
})

test('KINDS has no duplicates', () => {
  assert.equal(new Set(KINDS).size, KINDS.length)
})

test('sortByFilename orders by date, then name, without mutating', () => {
  const input = ['2026-11-19-b.md', '2026-01-02-z.md', '2026-11-19-a.md']
  assert.deepEqual(sortByFilename(input), ['2026-01-02-z.md', '2026-11-19-a.md', '2026-11-19-b.md'])
  assert.equal(input[0], '2026-11-19-b.md')
})

test('appendRowsToTable appends after the last row under ## Log', () => {
  const md = '# T\n\n## Log\n\n| Date | Kind | Decision | Ref |\n|---|---|---|---|\n| r1 |\n'
  assert.equal(appendRowsToTable(md, ['| r2 |', '| r3 |']),
    '# T\n\n## Log\n\n| Date | Kind | Decision | Ref |\n|---|---|---|---|\n| r1 |\n| r2 |\n| r3 |\n')
})

test('appendRowsToTable stops at the next ## section', () => {
  const md = '## Log\n\n| h |\n|---|\n| r1 |\n\n## After\n\n| other |\n'
  assert.equal(appendRowsToTable(md, ['| r2 |']), '## Log\n\n| h |\n|---|\n| r1 |\n| r2 |\n\n## After\n\n| other |\n')
})

test('appendRowsToTable errors without a Log table, and is a no-op for no rows', () => {
  assert.throws(() => appendRowsToTable('# T\n', ['| r |']), /no "## Log" heading/)
  assert.throws(() => appendRowsToTable('## Log\n\ntext\n', ['| r |']), /no table/)
  assert.equal(appendRowsToTable('anything', []), 'anything')
})

test('every pending entry in docs/decision-log/ is valid', () => {
  const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'decision-log')
  for (const f of readdirSync(dir).filter(f => f !== 'README.md')) {
    parseEntry(f, readFileSync(join(dir, f), 'utf8'))
  }
})
