import { getTableData, getTableColumns, getTableNames } from '../data/resume'

function evaluateValue(row, field) {
  if (field.includes('.')) {
    const parts = field.split('.')
    let val = row
    for (const p of parts) {
      if (val && typeof val === 'object') val = val[p]
      else return undefined
    }
    return val
  }
  return row[field]
}

function matchesCondition(row, condition) {
  if (condition.type === 'and') {
    return matchesCondition(row, condition.left) && matchesCondition(row, condition.right)
  }
  if (condition.type === 'or') {
    return matchesCondition(row, condition.left) || matchesCondition(row, condition.right)
  }
  const leftVal = evaluateValue(row, condition.left.value)
  let rightVal = condition.right.value
  if (condition.right.type === 'number') rightVal = Number(rightVal)

  switch (condition.operator) {
    case '=':
      if (Array.isArray(leftVal)) return leftVal.some(v => String(v).toLowerCase() === String(rightVal).toLowerCase())
      return String(leftVal).toLowerCase() === String(rightVal).toLowerCase()
    case '!=':
      if (Array.isArray(leftVal)) return !leftVal.some(v => String(v).toLowerCase() === String(rightVal).toLowerCase())
      return String(leftVal).toLowerCase() !== String(rightVal).toLowerCase()
    case '>':
      return Number(leftVal) > Number(rightVal)
    case '<':
      return Number(leftVal) < Number(rightVal)
    case '>=':
      return Number(leftVal) >= Number(rightVal)
    case '<=':
      return Number(leftVal) <= Number(rightVal)
    case 'LIKE': {
      const pattern = String(rightVal).toLowerCase().replace(/%/g, '.*')
      const regex = new RegExp(`^${pattern}$`, 'i')
      if (Array.isArray(leftVal)) return leftVal.some(v => regex.test(String(v)))
      return regex.test(String(leftVal))
    }
    default:
      return false
  }
}

function fieldName(field) {
  if (typeof field === 'string') return field
  if (field.type === 'star') return '*'
  if (field.type === 'field') return field.name
  if (field.type === 'literal') return field.value
  if (field.type === 'function') {
    const args = field.args.map(a => a.type === 'star' ? '*' : a.name).join(', ')
    return `${field.name}(${args})`
  }
  return ''
}

function projectRow(row, fields) {
  if (fields.length === 1 && fields[0].type === 'star') return row
  const result = {}
  for (const f of fields) {
    if (f.type === 'star') { Object.assign(result, row); continue }
    if (f.type === 'field') { result[f.name] = evaluateValue(row, f.name); continue }
    if (f.type === 'literal') { result[f.value] = f.isNumber ? Number(f.value) : f.value; continue }
  }
  return result
}

function execShowTables() {
  const names = getTableNames()
  return {
    columns: ['table_name'],
    rows: names.map(n => ({ table_name: n })),
    rowCount: names.length,
  }
}

function execDescribe(tableName) {
  const columns = getTableColumns(tableName)
  if (!columns || columns.length === 0) {
    throw new Error(`Table '${tableName}' not found. Available tables: ${getTableNames().join(', ')}`)
  }
  return {
    columns: ['column_name'],
    rows: columns.map(col => ({ column_name: col })),
    rowCount: columns.length,
  }
}

function execAggregation(ast, rows) {
  let groups

  if (ast.groupBy) {
    const groupMap = {}
    for (const row of rows) {
      const key = ast.groupBy.map(f => String(evaluateValue(row, f) ?? '')).join('||')
      if (!groupMap[key]) groupMap[key] = []
      groupMap[key].push(row)
    }
    groups = Object.values(groupMap).map(groupRows => ({ rows: groupRows }))
  } else {
    groups = [{ rows }]
  }

  const resultRows = groups.map(group => {
    const row = {}
    for (const field of ast.fields) {
      if (field.type === 'field') {
        const val = evaluateValue(group.rows[0], field.name)
        row[field.name] = val !== undefined ? val : null
      } else if (field.type === 'literal') {
        row[field.value] = field.isNumber ? Number(field.value) : field.value
      } else if (field.type === 'function') {
        const values = group.rows.map(r => {
          if (field.args[0].type === 'star') return 1
          return evaluateValue(r, field.args[0].name)
        })
        const nums = values.filter(v => v !== null && v !== undefined && !isNaN(Number(v))).map(Number)
        const colName = fieldName(field)
        switch (field.name) {
          case 'COUNT': row[colName] = values.length; break
          case 'SUM': row[colName] = nums.reduce((a, b) => a + b, 0); break
          case 'AVG': row[colName] = nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0; break
          case 'MIN': row[colName] = nums.length ? Math.min(...nums) : null; break
          case 'MAX': row[colName] = nums.length ? Math.max(...nums) : null; break
          default: row[colName] = null
        }
      }
    }
    return row
  })

  const columns = ast.fields.map(fieldName)
  return {
    columns,
    rows: resultRows,
    rowCount: resultRows.length,
  }
}

function hasAggregation(fields) {
  return fields.some(f => typeof f === 'object' && f.type === 'function')
}

function execSelect(ast) {
  const tableName = ast.from || 'profile'
  const rows = getTableData(tableName)
  if (!rows) {
    throw new Error(`Table '${tableName}' not found. Available tables: ${getTableNames().join(', ')}`)
  }

  let result = [...rows]

  if (ast.where) {
    result = result.filter(row => matchesCondition(row, ast.where))
  }

  if (hasAggregation(ast.fields) || ast.groupBy) {
    let aggResult = execAggregation(ast, result)

    if (ast.orderBy) {
      const { field, direction } = ast.orderBy
      aggResult.rows.sort((a, b) => {
        const aVal = a[field] ?? ''
        const bVal = b[field] ?? ''
        const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true })
        return direction === 'DESC' ? -cmp : cmp
      })
    }

    if (ast.limit !== null) {
      aggResult.rows = aggResult.rows.slice(0, ast.limit)
      aggResult.rowCount = aggResult.rows.length
    }

    return aggResult
  }

  if (ast.orderBy) {
    const { field, direction } = ast.orderBy
    result.sort((a, b) => {
      const aVal = evaluateValue(a, field) ?? ''
      const bVal = evaluateValue(b, field) ?? ''
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true })
      return direction === 'DESC' ? -cmp : cmp
    })
  }

  if (ast.limit !== null) {
    result = result.slice(0, ast.limit)
  }

  if (ast.distinct) {
    const seen = new Set()
    result = result.filter(row => {
      const key = JSON.stringify(projectRow(row, ast.fields))
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  result = result.map(row => projectRow(row, ast.fields))

  const cols = ast.fields.length === 1 && ast.fields[0].type === 'star'
    ? getTableColumns(tableName)
    : ast.fields.map(fieldName)

  return {
    columns: result.length > 0 ? Object.keys(result[0]) : cols,
    rows: result,
    rowCount: result.length,
  }
}

export function executeQuery(ast) {
  const startTime = performance.now()

  let result
  switch (ast.type) {
    case 'show_tables':
      result = execShowTables()
      break
    case 'describe':
      result = execDescribe(ast.tableName)
      break
    case 'select':
      result = execSelect(ast)
      break
    default:
      throw new Error(`Unknown statement type: ${ast.type}`)
  }

  result.elapsed = ((performance.now() - startTime) / 1000).toFixed(3)
  return result
}
