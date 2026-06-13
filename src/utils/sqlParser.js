function tokenize(sql) {
  const tokens = []
  let i = 0
  while (i < sql.length) {
    if (sql[i] === ' ' || sql[i] === '\t' || sql[i] === '\n') { i++; continue }
    if (sql[i] === ',') { tokens.push({ type: 'COMMA', value: ',' }); i++; continue }
    if (sql[i] === '*') { tokens.push({ type: 'STAR', value: '*' }); i++; continue }
    if (sql[i] === '=') { tokens.push({ type: 'OP', value: '=' }); i++; continue }
    if (sql[i] === '!' && sql[i + 1] === '=') { tokens.push({ type: 'OP', value: '!=' }); i += 2; continue }
    if (sql[i] === '>' && sql[i + 1] === '=') { tokens.push({ type: 'OP', value: '>=' }); i += 2; continue }
    if (sql[i] === '<' && sql[i + 1] === '=') { tokens.push({ type: 'OP', value: '<=' }); i += 2; continue }
    if (sql[i] === '>') { tokens.push({ type: 'OP', value: '>' }); i++; continue }
    if (sql[i] === '<') { tokens.push({ type: 'OP', value: '<' }); i++; continue }
    if (sql[i] === '(') { tokens.push({ type: 'LPAREN', value: '(' }); i++; continue }
    if (sql[i] === ')') { tokens.push({ type: 'RPAREN', value: ')' }); i++; continue }
    if (sql[i] === ';') { tokens.push({ type: 'SEMICOLON', value: ';' }); i++; continue }
    if (sql[i] === "'") {
      let s = ''
      i++
      while (i < sql.length && sql[i] !== "'") { s += sql[i]; i++ }
      if (i < sql.length) i++
      tokens.push({ type: 'STRING', value: s })
      continue
    }
    if (/[a-zA-Z_]/.test(sql[i])) {
      let s = ''
      while (i < sql.length && /[a-zA-Z0-9_.]/.test(sql[i])) { s += sql[i]; i++ }
      const upper = s.toUpperCase()
      if (['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER', 'BY', 'ASC', 'DESC', 'LIMIT', 'LIKE', 'DISTINCT', 'GROUP', 'HAVING'].includes(upper)) {
        tokens.push({ type: 'KEYWORD', value: upper })
      } else {
        tokens.push({ type: 'IDENTIFIER', value: s })
      }
      continue
    }
    if (/[0-9]/.test(sql[i])) {
      let s = ''
      while (i < sql.length && /[0-9.]/.test(sql[i])) { s += sql[i]; i++ }
      tokens.push({ type: 'NUMBER', value: s })
      continue
    }
    i++
  }
  return tokens
}

function expect(tokens, pos, type, value) {
  if (pos.i >= tokens.length) throw new Error(`Syntax error: expected ${type} near end of query`)
  if (tokens[pos.i].type !== type || (value !== undefined && tokens[pos.i].value.toUpperCase() !== value.toUpperCase())) {
    throw new Error(`Syntax error near '${tokens[pos.i].value}' at position ${pos.i}`)
  }
  return tokens[pos.i++]
}

function parseFunctionCall(tokens, pos, name) {
  const args = []
  pos.i++ // skip function name (IDENTIFIER)
  if (pos.i < tokens.length && tokens[pos.i].type === 'LPAREN') {
    pos.i++ // skip LPAREN
  } else {
    throw new Error(`Syntax error: expected ( after function name '${name}'`)
  }
  if (tokens[pos.i] && tokens[pos.i].type === 'STAR') {
    args.push({ type: 'star' })
    pos.i++
  } else if (tokens[pos.i] && tokens[pos.i].type === 'IDENTIFIER') {
    args.push({ type: 'field', name: tokens[pos.i].value })
    pos.i++
  }
  if (pos.i < tokens.length && tokens[pos.i].type === 'RPAREN') {
    pos.i++
  } else {
    throw new Error(`Syntax error: expected ) after function arguments near '${tokens[pos.i]?.value || 'end'}'`)
  }
  return { type: 'function', name: name.toUpperCase(), args }
}

function parseFields(tokens, pos) {
  const fields = []
  while (pos.i < tokens.length) {
    const tok = tokens[pos.i]
    if (tok.type === 'STAR') {
      fields.push({ type: 'star' })
      pos.i++
    } else if (tok.type === 'IDENTIFIER') {
      if (pos.i + 1 < tokens.length && tokens[pos.i + 1].type === 'LPAREN') {
        fields.push(parseFunctionCall(tokens, pos, tok.value))
      } else {
        fields.push({ type: 'field', name: tok.value })
        pos.i++
      }
    } else if (tok.type === 'NUMBER') {
      fields.push({ type: 'literal', value: tok.value, isNumber: true })
      pos.i++
    } else if (tok.type === 'STRING') {
      fields.push({ type: 'literal', value: tok.value })
      pos.i++
    } else {
      break
    }
    if (pos.i < tokens.length && tokens[pos.i].type === 'COMMA') {
      pos.i++
    } else {
      break
    }
  }
  if (fields.length === 0) throw new Error('Syntax error: expected field list after SELECT')
  return fields
}

function isAggregateSelect(fields) {
  return fields.some(f => f.type === 'function')
}

function parseSelect(tokens) {
  const ast = {
    type: 'select',
    distinct: false,
    fields: [],
    from: null,
    where: null,
    orderBy: null,
    limit: null,
    groupBy: null,
    having: null,
  }
  const pos = { i: 0 }

  expect(tokens, pos, 'KEYWORD', 'SELECT')
  if (pos.i < tokens.length && tokens[pos.i].type === 'KEYWORD' && tokens[pos.i].value === 'DISTINCT') {
    ast.distinct = true
    pos.i++
  }

  ast.fields = parseFields(tokens, pos)
  ast.aggregate = isAggregateSelect(ast.fields)

  if (pos.i < tokens.length) {
    expect(tokens, pos, 'KEYWORD', 'FROM')
    const tableTok = expect(tokens, pos, 'IDENTIFIER')
    ast.from = tableTok.value.toLowerCase()
  }

  if (pos.i < tokens.length && tokens[pos.i].type === 'KEYWORD' && tokens[pos.i].value === 'WHERE') {
    pos.i++
    ast.where = parseCondition(tokens, pos)
  }

  if (pos.i < tokens.length && tokens[pos.i].type === 'KEYWORD' && tokens[pos.i].value === 'GROUP') {
    pos.i++
    expect(tokens, pos, 'KEYWORD', 'BY')
    ast.groupBy = []
    while (pos.i < tokens.length) {
      if (tokens[pos.i].type === 'IDENTIFIER') {
        ast.groupBy.push(tokens[pos.i].value)
        pos.i++
      } else {
        break
      }
      if (pos.i < tokens.length && tokens[pos.i].type === 'COMMA') {
        pos.i++
      } else {
        break
      }
    }
    if (ast.groupBy.length === 0) throw new Error('Syntax error: expected field after GROUP BY')
  }

  if (pos.i < tokens.length && tokens[pos.i].type === 'KEYWORD' && tokens[pos.i].value === 'ORDER') {
    pos.i++
    expect(tokens, pos, 'KEYWORD', 'BY')
    const fieldTok = expect(tokens, pos, 'IDENTIFIER')
    let dir = 'ASC'
    if (pos.i < tokens.length && tokens[pos.i].type === 'KEYWORD' && (tokens[pos.i].value === 'ASC' || tokens[pos.i].value === 'DESC')) {
      dir = tokens[pos.i].value
      pos.i++
    }
    ast.orderBy = { field: fieldTok.value, direction: dir }
  }

  if (pos.i < tokens.length && tokens[pos.i].type === 'KEYWORD' && tokens[pos.i].value === 'LIMIT') {
    pos.i++
    const numTok = expect(tokens, pos, 'NUMBER')
    ast.limit = parseInt(numTok.value, 10)
  }

  if (pos.i < tokens.length && tokens[pos.i].type === 'SEMICOLON') {
    pos.i++
  }

  if (pos.i < tokens.length) {
    throw new Error(`Syntax error: unexpected token '${tokens[pos.i].value}' after complete statement`)
  }

  return ast
}

function parseCondition(tokens, pos) {
  const left = parseOperand(tokens, pos)
  if (!left) throw new Error(`Syntax error: expected condition after WHERE near '${tokens[pos.i]?.value || 'end'}'`)

  let operator
  if (pos.i < tokens.length && tokens[pos.i].type === 'OP') {
    operator = tokens[pos.i].value
    pos.i++
  } else if (pos.i < tokens.length && tokens[pos.i].type === 'KEYWORD' && tokens[pos.i].value === 'LIKE') {
    operator = 'LIKE'
    pos.i++
  } else {
    throw new Error(`Syntax error: expected operator after '${left.value}'`)
  }

  const right = parseOperand(tokens, pos)
  if (!right) throw new Error('Syntax error: expected value after operator')

  let condition = { type: 'binary', operator, left, right }

  if (pos.i < tokens.length && tokens[pos.i].type === 'KEYWORD' && (tokens[pos.i].value === 'AND' || tokens[pos.i].value === 'OR')) {
    const connective = tokens[pos.i].value === 'AND' ? 'and' : 'or'
    pos.i++
    const rightCond = parseCondition(tokens, pos)
    condition = { type: connective, left: condition, right: rightCond }
  }

  return condition
}

function parseOperand(tokens, pos) {
  if (pos.i >= tokens.length) return null
  const tok = tokens[pos.i]
  if (tok.type === 'STRING') { pos.i++; return { type: 'string', value: tok.value } }
  if (tok.type === 'NUMBER') { pos.i++; return { type: 'number', value: tok.value } }
  if (tok.type === 'IDENTIFIER') { pos.i++; return { type: 'identifier', value: tok.value } }
  return null
}

export function parseQuery(sql) {
  const cleaned = sql.trim()
  if (!cleaned) throw new Error('Empty query')

  if (/^SHOW\s+TABLES\s*;?\s*$/i.test(cleaned)) {
    return { type: 'show_tables' }
  }

  let match = cleaned.match(/^(?:DESCRIBE|DESC)\s+(\w+)\s*;?\s*$/i)
  if (match) {
    return { type: 'describe', tableName: match[1].toLowerCase() }
  }

  match = cleaned.match(/^SHOW\s+(?:COLUMNS|FIELDS)\s+FROM\s+(\w+)\s*;?\s*$/i)
  if (match) {
    return { type: 'describe', tableName: match[1].toLowerCase() }
  }

  const tokens = tokenize(cleaned)
  return parseSelect(tokens)
}
