import { useState } from 'react'

export default function QueryResults({ result, query, plan }) {
  const [copied, setCopied] = useState(false)
  const [showPlan, setShowPlan] = useState(false)

  if (!result) return null

  const { columns, rows, rowCount, elapsed } = result

  function copyTable() {
    const header = columns.join('\t')
    const data = rows.map(r => columns.map(c => formatCellValue(r[c])).join('\t')).join('\n')
    navigator.clipboard.writeText(header + '\n' + data)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function exportCSV() {
    const header = columns.map(c => `"${c}"`).join(',')
    const data = rows.map(r => columns.map(c => `"${String(formatCellValue(r[c])).replace(/"/g, '""')}"`).join(',')).join('\n')
    download(`${header}\n${data}`, 'query_result.csv', 'text/csv')
  }

  function exportJSON() {
    const json = JSON.stringify(rows, null, 2)
    download(json, 'query_result.json', 'application/json')
  }

  return (
    <div className="query-results">
      <div className="query-status">
        Query returned{' '}
        <span className="query-status-count">{rowCount} row{rowCount !== 1 ? 's' : ''}</span>
        {' '}({elapsed}s)
        {query && <span className="query-status-query"> &mdash; {query}</span>}
      </div>
      {(plan || rowCount > 0) && (
        <div className="query-toolbar">
          {plan && (
            <button className="query-action-btn" onClick={() => setShowPlan(s => !s)}>
              {showPlan ? 'Hide Plan' : 'Show Plan'}
            </button>
          )}
          {rowCount > 0 && (
            <>
              <button className="query-action-btn" onClick={copyTable} title="Copy as tab-separated">
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button className="query-action-btn" onClick={exportCSV} title="Export CSV">CSV</button>
              <button className="query-action-btn" onClick={exportJSON} title="Export JSON">JSON</button>
            </>
          )}
        </div>
      )}

      {showPlan && plan && (
        <div className="query-plan">
          <div className="query-plan-title">Spark Execution Plan</div>
          <div className="query-plan-steps">
            {plan.map((step, i) => (
              <div key={i} className="query-plan-step">
                <span className="query-plan-num">{i === 0 ? '\u25B6' : '\u2193'}</span>
                <span className="query-plan-label">{step.label}</span>
                <span className="query-plan-detail">{step.detail}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {rowCount === 0 ? (
        <div className="query-empty">No results found.</div>
      ) : (
        <div className="query-table-wrapper">
          <table className="query-table">
            <thead>
              <tr>
                <th className="query-row-num">#</th>
                {columns.map((col, i) => (
                  <th key={i}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td className="query-row-num">{i + 1}</td>
                  {columns.map((col, j) => (
                    <td key={j}>{formatCell(row[col])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function CellTooltip({ text, children }) {
  const [show, setShow] = useState(false)
  return (
    <span
      className="cell-truncated"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && <span className="cell-tooltip-popup">{text}</span>}
    </span>
  )
}

function formatCell(val) {
  if (val === null || val === undefined) return <span className="cell-null">NULL</span>
  if (Array.isArray(val)) return val.join(', ')
  if (typeof val === 'object') return JSON.stringify(val)
  const text = String(val)
  if (text.length > 100) {
    return <CellTooltip text={text}>{text.slice(0, 100).trimEnd()}&hellip;</CellTooltip>
  }
  return text
}

function formatCellValue(val) {
  if (val === null || val === undefined) return 'NULL'
  if (Array.isArray(val)) return val.join(', ')
  if (typeof val === 'object') return JSON.stringify(val)
  return String(val)
}

function download(content, filename, mime) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
