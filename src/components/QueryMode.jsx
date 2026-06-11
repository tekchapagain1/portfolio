import { useState } from 'react'
import SchemaPanel from './SchemaPanel'
import QueryInput from './QueryInput'
import QueryResults from './QueryResults'
import SuggestedQueries from './SuggestedQueries'
import { parseQuery } from '../utils/sqlParser'
import { executeQuery } from '../utils/sqlExecutor'
import { explainQuery, generateQueryPlan } from '../utils/explainQuery'

export default function QueryMode({ onRecordQuery }) {
  const [inputValue, setInputValue] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [lastQuery, setLastQuery] = useState('')
  const [explanation, setExplanation] = useState('')
  const [plan, setPlan] = useState(null)

  function handleExecute(sql) {
    setError(null)
    setResult(null)
    setExplanation('')
    setPlan(null)
    setLastQuery(sql)
    const trimmed = sql.trim()
    if (!/^(SELECT|SHOW|DESCRIBE|DESC)\b/i.test(trimmed)) {
      setError("Hey, this isn't a full SQL engine \u2014 it only handles SELECT, SHOW TABLES, and DESCRIBE queries on the resume data. Try clicking a suggested query above!")
      onRecordQuery(0, true)
      return
    }
    try {
      const ast = parseQuery(sql)
      const start = performance.now()
      const res = executeQuery(ast)
      res.elapsed = ((performance.now() - start) / 1000).toFixed(3)
      setResult(res)
      setPlan(generateQueryPlan(ast, res.rowCount))
      onRecordQuery(parseFloat(res.elapsed), false)
    } catch (err) {
      setError("Hmm, that query didn't work. This engine supports SELECT, WHERE, LIKE, GROUP BY, ORDER BY, LIMIT, SHOW TABLES, and DESCRIBE on resume tables. Try a simpler query or pick one from the suggestions above.")
      onRecordQuery(0, true)
    }
  }

  function handleExplain(sql) {
    const trimmed = sql.trim()
    if (!trimmed) return
    if (!/^(SELECT|SHOW|DESCRIBE|DESC)\b/i.test(trimmed)) {
      setExplanation("This doesn't look like a supported query. I can only explain SELECT, SHOW TABLES, and DESCRIBE queries.")
      return
    }
    try {
      const ast = parseQuery(sql)
      setExplanation(explainQuery(ast))
    } catch (err) {
      setExplanation("Can't explain that query \u2014 try a valid SELECT with WHERE, GROUP BY, or ORDER BY on resume tables.")
    }
  }

  return (
    <div className="query-mode">
      <SchemaPanel />
      <div className="query-mode-main">
        <QueryInput
          value={inputValue}
          onValueChange={setInputValue}
          onExecute={handleExecute}
          onExplain={handleExplain}
          error={error}
          hasExplanation={!!explanation}
        />
        {explanation && (
          <div className="query-explanation">
            <span className="query-explanation-icon">&#x1F4A1;</span>
            {explanation}
          </div>
        )}
        <SuggestedQueries onSelect={(sql) => { setInputValue(sql); handleExecute(sql); }} />
        <QueryResults result={result} query={lastQuery} plan={plan} />
      </div>
    </div>
  )
}
