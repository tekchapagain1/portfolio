import { useState, useCallback, memo } from 'react'
import { getTableNames, getTableColumns } from '../data/resume'
import MedallionPipeline from './MedallionPipeline'
import DataQualityCard from './DataQualityCard'

function SchemaPanel() {
  const [expanded, setExpanded] = useState({})
  const tables = getTableNames()

  const toggle = useCallback((name) => {
    setExpanded(prev => ({ ...prev, [name]: !prev[name] }))
  }, [])

  function expandAll() {
    const all = {}
    tables.forEach(t => { all[t] = true })
    setExpanded(all)
  }

  function collapseAll() {
    setExpanded({})
  }

  return (
    <aside className="schema-panel">
      <div className="schema-header">
        <div className="schema-status">
          <span className="schema-status-dot" />
          DATABASE CONNECTED
        </div>
        <div className="schema-dbname">
          <span className="schema-dbname-icon">&#x25C8;</span>
          resume_db
        </div>
      </div>

      <div className="schema-tree">
        <div className="schema-tree-header">
          <span className="schema-tree-title">Tables</span>
          <span className="schema-tree-actions">
            <button className="schema-tree-action" onClick={expandAll} title="Expand all">&#x25B6;&#x25B6;</button>
            <button className="schema-tree-action" onClick={collapseAll} title="Collapse all">&#x25C0;&#x25C0;</button>
          </span>
        </div>
        {tables.map(name => (
          <div key={name} className="schema-node">
            <button className="schema-table-row" onClick={() => toggle(name)}>
              <span className={`schema-chevron ${expanded[name] ? 'open' : ''}`}>&#x25B6;</span>
              <span className="schema-table-icon">&#x1F4CB;</span>
              <span className="schema-table-label">{name}</span>
            </button>
            {expanded[name] && (
              <div className="schema-columns">
                {getTableColumns(name).map(col => (
                  <div key={col} className="schema-column-row">
                    <span className="schema-column-indent" />
                    <span className="schema-column-icon">&#x2502;</span>
                    <span className="schema-column-label">{col}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="schema-footer">
        <DataQualityCard />
        <MedallionPipeline />
      </div>
    </aside>
  )
}

export default memo(SchemaPanel)
