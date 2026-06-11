import { useState, useEffect, useRef } from 'react'

const HISTORY_KEY = 'portfolio_query_history'
const MAX_HISTORY = 100

function loadHistory() {
  try {
    const stored = localStorage.getItem(HISTORY_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-MAX_HISTORY)))
  } catch { /* quota exceeded — ignore */ }
}

export default function QueryInput({ value, onValueChange, onExecute, onExplain, error, hasExplanation }) {
  const [history, setHistory] = useState(loadHistory)
  const [historyIdx, setHistoryIdx] = useState(-1)
  const inputRef = useRef(null)

  useEffect(() => {
    saveHistory(history)
  }, [history])

  function handleSubmit(e) {
    e.preventDefault()
    if (!value.trim()) return
    setHistory(prev => [...prev, value])
    setHistoryIdx(-1)
    onExecute(value)
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const newIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1)
      setHistoryIdx(newIdx)
      onValueChange(history[newIdx])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIdx === -1) return
      const newIdx = historyIdx + 1
      if (newIdx >= history.length) {
        setHistoryIdx(-1)
        onValueChange('')
      } else {
        setHistoryIdx(newIdx)
        onValueChange(history[newIdx])
      }
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  function handleExplainClick() {
    if (!value.trim()) return
    onExplain(value)
  }

  return (
    <div className="query-input-area">
      <form onSubmit={handleSubmit} className="query-form">
        <span className="query-prompt">sql&gt;</span>
        <input
          ref={inputRef}
          type="text"
          className="query-input"
          placeholder="SELECT * FROM experience WHERE tech_used LIKE '%Databricks%'"
          value={value}
          onChange={e => onValueChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoFocus
        />
        <button type="submit" className="query-exec-btn">
          Execute <span className="query-exec-hint">&#x2318;&#x23CE;</span>
        </button>
        <button
          type="button"
          className={`query-explain-btn ${hasExplanation ? 'query-explain-btn--active' : ''}`}
          onClick={handleExplainClick}
          title="Explain this query in plain English"
        >
          &#x1F4A1; Explain
        </button>
      </form>
      {error && <div className="query-error">{error}</div>}
    </div>
  )
}
