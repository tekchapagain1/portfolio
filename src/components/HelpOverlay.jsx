import { useEffect } from 'react'

const SHORTCUTS = [
  { keys: ['Ctrl+1', '\u23181'], label: 'Switch to Query mode' },
  { keys: ['Ctrl+2', '\u23182'], label: 'Switch to Chat mode' },
  { keys: ['\u2191', '\u2193'], label: 'Navigate query history' },
  { keys: ['Ctrl+Enter', '\u2318\u23CE'], label: 'Execute query' },
  { keys: ['?'], label: 'Toggle this help overlay' },
  { keys: ['Esc'], label: 'Close this overlay' },
]

export default function HelpOverlay({ onClose }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="help-overlay" onClick={onClose}>
      <div className="help-modal" onClick={e => e.stopPropagation()}>
        <div className="help-header">
          <span className="help-title">Keyboard Shortcuts</span>
          <button className="help-close" onClick={onClose}>&#x2715;</button>
        </div>
        <div className="help-body">
          {SHORTCUTS.map((s, i) => (
            <div key={i} className="help-row">
              <span className="help-keys">
                {s.keys.map((k, j) => (
                  <span key={j} className="help-key">{k}</span>
                ))}
              </span>
              <span className="help-desc">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="help-footer">
          Try <code>SHOW TABLES</code>, <code>SELECT * FROM resume</code>, or ask the chat bot!
        </div>
      </div>
    </div>
  )
}
