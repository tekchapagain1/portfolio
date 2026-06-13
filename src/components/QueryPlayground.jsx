import { useState, useCallback, useEffect, useRef } from 'react'
import { initDatabase, executeQuery } from '../utils/realSqlExecutor'
import SectionHeader from './SectionHeader'

function useScrollFade(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.08 }
    )
    el.querySelectorAll('.fade-in').forEach((child) => obs.observe(child))
    return () => obs.disconnect()
  }, [ref])
}

function runQuery(sql, setOutput, setIsRunning) {
  const raw = sql.trim()
  if (!raw) {
    setOutput({ type: 'hint', text: 'Please enter a query.' })
    return
  }
  setIsRunning(true)
  setOutput({ type: 'hint', text: '-- Executing...' })
  try {
    const result = executeQuery(raw)
    setOutput({ type: 'rows', ...result })
  } catch (e) {
    setOutput({ type: 'error', text: e.message })
  }
  setIsRunning(false)
}

export default function QueryPlayground() {
  const [sql, setSql] = useState('')
  const [output, setOutput] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const textareaRef = useRef(null)
  const ref = useRef(null)

  useScrollFade(ref)

  useEffect(() => {
    initDatabase().then(() => setIsReady(true))
  }, [])

  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    function handleKey(e) {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        runQuery(sql, setOutput, setIsRunning)
      }
    }
    ta.addEventListener('keydown', handleKey)
    return () => ta.removeEventListener('keydown', handleKey)
  }, [sql])

  const handleRun = useCallback(() => {
    runQuery(sql, setOutput, setIsRunning)
  }, [sql])

  function handleSetQuery(q) {
    setSql(q)
    runQuery(q, setOutput, setIsRunning)
  }

  const placeholder = isReady
    ? "SELECT * FROM skills WHERE proficiency = 'Advanced';"
    : 'Loading database engine...'

  return (
    <section id="query" className="resume-section" ref={ref}>
      <SectionHeader tag="LIVE" title="query interface" standardTitle="Live Query" />
      <div className="playground fade-in">
        <div className="playground-header">
          <div className="dot dot-r" />
          <div className="dot dot-y" />
          <div className="dot dot-g" />
          <span className="ph-title">
            resume=# &nbsp;
            <span style={{ color: 'var(--text-muted)' }}>run any SQL against the resume</span>
          </span>
          <button className="run-btn" onClick={handleRun} disabled={isRunning || !isReady}>
            ▶ RUN
          </button>
        </div>
        <div className="query-input-area">
          <textarea
            ref={textareaRef}
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            rows={4}
            spellCheck={false}
            placeholder={placeholder}
            aria-label="SQL query input"
            disabled={!isReady}
          />
        </div>
        <div className="query-output" aria-live="polite" aria-atomic="true">
          {!output && (
            <span className="output-hint">
              {isReady
                ? '-- Output appears here. Try a query above, or pick a template below.'
                : '-- Initializing SQL engine...'}
            </span>
          )}
          {output?.type === 'hint' && <span className="output-hint">{output.text}</span>}
          {output?.type === 'error' && <span className="output-error">ERROR: {output.text}</span>}
          {output?.type === 'rows' && output.rows.length > 0 && (
            <>
              <div className="result-meta">
                <span className="ok">●</span> {output.meta} returned
              </div>
              <div className="output-table">
                <table>
                  <thead>
                    <tr>
                      {output.columns.map((col) => (
                        <th key={col}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {output.rows.map((row, i) => (
                      <tr key={i}>
                        {row.map((val, j) => (
                          <td key={j} title={String(val ?? 'NULL')}>
                            {val ?? <span className="output-null">NULL</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {output?.type === 'rows' && output.rows.length === 0 && (
            <span className="output-hint">-- 0 rows returned</span>
          )}
        </div>
        <div
          style={{
            padding: '12px 20px',
            background: 'var(--surface-2)',
            borderTop: '1px solid var(--border)',
          }}
        >
          <div className="chip-row">
            <span className="chip" onClick={() => handleSetQuery('SELECT * FROM profile;')}>
              SELECT * FROM profile
            </span>
            <span
              className="chip"
              onClick={() =>
                handleSetQuery("SELECT skill, category FROM skills WHERE proficiency = 'Advanced';")
              }
            >
              Expert skills
            </span>
            <span
              className="chip"
              onClick={() =>
                handleSetQuery(
                  'SELECT company, role, start_date FROM experience ORDER BY start_date DESC;'
                )
              }
            >
              Experience
            </span>
            <span
              className="chip"
              onClick={() =>
                handleSetQuery('SELECT category, COUNT(*) as total FROM skills GROUP BY category;')
              }
            >
              Skills by category
            </span>
            <span className="chip" onClick={() => handleSetQuery('SHOW TABLES;')}>
              SHOW TABLES
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
