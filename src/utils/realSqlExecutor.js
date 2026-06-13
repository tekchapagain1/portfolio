import initSqlJs from 'sql.js'
import { resumeData } from '../data/resume'

let db = null
let initPromise = null

function guessType(val) {
  if (typeof val === 'number') return Number.isInteger(val) ? 'INTEGER' : 'REAL'
  if (typeof val === 'boolean') return 'INTEGER'
  return 'TEXT'
}

function tableInfo(table) {
  const columns = {}
  for (const row of table) {
    for (const [key, val] of Object.entries(row)) {
      if (!columns[key]) columns[key] = guessType(val)
    }
  }
  return columns
}

function toFlat(val) {
  if (val === null || val === undefined) return null
  if (Array.isArray(val)) return JSON.stringify(val)
  return val
}

function createTableSQL(name, columns) {
  const cols = Object.entries(columns)
    .map(([col, type]) => `"${col}" ${type}`)
    .join(', ')
  return `CREATE TABLE IF NOT EXISTS "${name}" (${cols})`
}

function insertSQL(name, columns, rows) {
  const colList = columns.map((c) => `"${c}"`).join(', ')
  const placeholders = columns.map(() => '?').join(', ')
  const stmt = db.prepare(`INSERT INTO "${name}" (${colList}) VALUES (${placeholders})`)
  for (const row of rows) {
    stmt.run(columns.map((c) => toFlat(row[c])))
  }
  stmt.free()
}

export async function initDatabase() {
  if (db) return db
  if (initPromise) return initPromise

  initPromise = (async () => {
    const SQL = await initSqlJs({
      locateFile: () => `/sql-wasm.wasm`,
    })
    db = new SQL.Database()

    db.run('PRAGMA journal_mode=OFF')
    db.run('PRAGMA page_size=4096')

    const data = resumeData

    if (data.profile) {
      const cols = tableInfo([data.profile])
      db.run(createTableSQL('profile', cols))
      insertSQL('profile', Object.keys(cols), [data.profile])
    }

    for (const name of ['skills', 'experience', 'education', 'certifications', 'projects']) {
      const rows = data[name]
      if (!rows || rows.length === 0) continue
      const cols = tableInfo(rows)
      db.run(createTableSQL(name, cols))
      insertSQL(name, Object.keys(cols), rows)
    }

    return db
  })()

  return initPromise
}

export function getDatabase() {
  if (!db) throw new Error('Database not initialized. Call initDatabase() first.')
  return db
}

const META_TABLES = ['sqlite_sequence', 'sqlite_master']

export function executeQuery(sql) {
  if (!db) throw new Error('Database not initialized. Call initDatabase() first.')

  const trimmed = sql.trim()
  const upper = trimmed.toUpperCase()

  if (upper === 'SHOW TABLES' || upper === 'SHOW TABLES;') {
    const result = db.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
    const tables = result.length > 0
      ? result[0].values.map((r) => r[0]).filter((t) => !META_TABLES.includes(t))
      : []
    return {
      columns: ['table_name'],
      rows: tables.map((t) => [t]),
      meta: `${tables.length} tables`,
    }
  }

  if (/^(?:DESCRIBE|DESC)\s/i.test(upper)) {
    const match = trimmed.match(/^(?:DESCRIBE|DESC)\s+(\w+)/i)
    if (match) {
      const tbl = match[1]
      const result = db.exec(`PRAGMA table_info("${tbl}")`)
      if (result.length > 0) {
        const columns = result[0].values.map((r) => ({
          column: r[1],
          type: r[2],
        }))
        return {
          columns: ['column', 'type'],
          rows: columns.map((c) => [c.column, c.type]),
          meta: `${columns.length} columns`,
        }
      }
      throw new Error(`relation "${tbl}" does not exist`)
    }
  }

  if (/^\s*SELECT\b/i.test(upper) || /^\s*PRAGMA\b/i.test(upper) || /^\s*EXPLAIN\b/i.test(upper)) {
    const result = db.exec(trimmed)
    if (result.length === 0) {
      return { columns: [], rows: [], meta: '0 rows' }
    }
    const columns = result[0].columns
    const rows = result[0].values
    const count = rows.length
    return {
      columns,
      rows,
      meta: `${count} ${count === 1 ? 'row' : 'rows'}`,
    }
  }

  throw new Error('Only SELECT, SHOW TABLES, DESCRIBE, PRAGMA, and EXPLAIN queries are supported.')
}
