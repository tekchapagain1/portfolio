import { useEffect } from 'react'

export default function TabSwitcher({ active, onChange }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '1') { e.preventDefault(); onChange('query') }
        if (e.key === '2') { e.preventDefault(); onChange('chat') }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onChange])

  return (
    <div className="tab-switcher">
      <button
        className={`tab-btn ${active === 'query' ? 'tab-btn--active' : ''}`}
        onClick={() => onChange('query')}
      >
        <span className="tab-icon">▶</span> Query <span className="tab-shortcut">^1</span>
      </button>
      <button
        className={`tab-btn ${active === 'chat' ? 'tab-btn--active' : ''}`}
        onClick={() => onChange('chat')}
      >
        <span className="tab-icon">💬</span> Chat <span className="tab-shortcut">^2</span>
      </button>
    </div>
  )
}
