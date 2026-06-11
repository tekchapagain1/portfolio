import { getTableNames } from '../data/resume'

export function explainQuery(ast) {
  if (ast.type === 'show_tables') return 'List all available tables in the database.'
  if (ast.type === 'describe') return `Show column names for the \`${ast.tableName}\` table.`

  let parts = []

  const tableName = ast.from || 'profile'
  const fields = ast.fields
  const funcFields = fields.filter(f => f.type === 'function')
  const colFields = fields.filter(f => f.type !== 'function')

  if (colFields.length === 0 && funcFields.length === 0) {
    parts.push('Fetch all columns')
  } else {
    const cols = colFields.map(f => {
      if (f.type === 'star') return 'all columns'
      if (f.type === 'literal') return `\`${f.value}\``
      return `\`${f.name}\``
    })
    const funcs = funcFields.map(f => `\`${f.name}(${f.args.map(a => a.type === 'star' ? '*' : a.name).join(',')})\``)
    const all = [...cols, ...funcs]
    parts.push(all.length > 1
      ? `Retrieve ${all.slice(0, -1).join(', ')} and ${all[all.length - 1]}`
      : `Retrieve ${all[0]}`)
  }

  parts.push(`from the \`${tableName}\` table`)

  if (ast.where) {
    parts.push(`where ${describeCondition(ast.where)}`)
  }

  if (ast.groupBy) {
    parts.push(`grouped by ${ast.groupBy.map(f => `\`${f}\``).join(', ')}`)
  }

  if (ast.orderBy) {
    const dir = ast.orderBy.direction === 'DESC' ? 'descending' : 'ascending'
    parts.push(`sorted by \`${ast.orderBy.field}\` in ${dir} order`)
  }

  if (ast.limit !== null) {
    parts.push(`limited to ${ast.limit} row${ast.limit !== 1 ? 's' : ''}`)
  }

  let result = parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
  for (let i = 1; i < parts.length; i++) {
    result += ' ' + parts[i]
  }
  result += '.'

  return result
}

function describeCondition(cond) {
  if (cond.type === 'and') return `${describeCondition(cond.left)} and ${describeCondition(cond.right)}`
  if (cond.type === 'or') return `${describeCondition(cond.left)} or ${describeCondition(cond.right)}`
  const opStr = cond.operator === 'LIKE' ? 'contains' : cond.operator
  const leftStr = `\`${cond.left.value}\``
  const rightStr = cond.right.type === 'string' ? `'${cond.right.value}'` : cond.right.value
  return `${leftStr} ${opStr} ${rightStr}`
}

export function generateQueryPlan(ast, rowCount) {
  const steps = []
  const tableName = ast.from || 'profile'
  const tables = getTableNames()
  const estimatedRows = 4 // rough estimate based on typical data size
  steps.push({
    label: 'Scan ExistingRDD',
    detail: `\`${tableName}\` [rows=${rowCount || estimatedRows}]`,
  })
  if (ast.where) {
    steps.push({
      label: 'Filter',
      detail: `isnotnull + matching conditions [rows~=${Math.max(1, Math.round((rowCount || estimatedRows) * 0.6))}]`,
    })
  }
  if (ast.groupBy) {
    const n = Math.max(1, ast.groupBy.length)
    steps.push({
      label: 'HashAggregate',
      detail: `groupBy=[${ast.groupBy.join(', ')}], functions=[${ast.fields.filter(f => f.type === 'function').map(f => `${f.name}(${f.args.map(a => a.type === 'star' ? '*' : a.name).join(',')})`).join(', ')}]`,
    })
  }
  if (ast.orderBy) {
    steps.push({
      label: 'Sort',
      detail: `\`${ast.orderBy.field}\` ${ast.orderBy.direction}, global=true`,
    })
  }
  if (ast.limit !== null) {
    steps.push({
      label: 'Take',
      detail: `limit=${ast.limit}`,
    })
  }
  steps.push({
    label: 'Exchange (Result)',
    detail: `1-to-1, rows=${rowCount || 0}`,
  })
  return steps
}
