import { useState, useEffect, useCallback } from 'react'
import Hero from './components/Hero'
import TabSwitcher from './components/TabSwitcher'
import QueryMode from './components/QueryMode'
import ChatMode from './components/ChatMode'
import Footer from './components/Footer'
import HelpOverlay from './components/HelpOverlay'
import './styles/terminal.css'

export default function App() {
  const [mode, setMode] = useState('query')
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('portfolio_theme') || 'dark'
    }
    return 'dark'
  })
  const [showHelp, setShowHelp] = useState(false)
  const [sla, setSla] = useState({ totalQueries: 0, avgQuery: 0, p99: 0, uptime: '100.00' })

  useEffect(() => {
    document.documentElement.classList.toggle('theme--light', theme === 'light')
    localStorage.setItem('portfolio_theme', theme)
  }, [theme])

  useEffect(() => {
    function handleKey(e) {
      if (e.key === '?' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        if (document.activeElement?.tagName !== 'INPUT') {
          setShowHelp(s => !s)
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const closeHelp = useCallback(() => setShowHelp(false), [])

  const recordQuery = useCallback((elapsed, errored) => {
    setSla(prev => {
      const newTotal = prev.totalQueries + 1
      const newErrors = errored ? 1 : 0
      const newTotalTime = errored ? prev.avgQuery * (prev.totalQueries || 0) : (prev.avgQuery * (prev.totalQueries || 0)) + elapsed
      const newMax = errored ? prev.p99 : Math.max(prev.p99, elapsed)
      const successCount = newTotal - (errored ? 1 : 0)
      const avg = successCount > 0 ? newTotalTime / successCount : 0
      return {
        totalQueries: newTotal,
        avgQuery: avg,
        p99: newMax,
        uptime: (successCount / newTotal * 100).toFixed(2),
      }
    })
  }, [])

  function toggleTheme() {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="app">
      <div className="container">
        <Hero />
        <TabSwitcher active={mode} onChange={setMode} />
        {mode === 'query' ? <QueryMode onRecordQuery={recordQuery} /> : <ChatMode />}
        <Footer theme={theme} onToggleTheme={toggleTheme} sla={sla} />
      </div>
      {showHelp && <HelpOverlay onClose={closeHelp} />}
    </div>
  )
}
