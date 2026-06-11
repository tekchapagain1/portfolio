import { useState } from 'react'
import { resumeData } from '../data/resume'

const { profile, experience } = resumeData

export default function Hero() {
  const [expanded, setExpanded] = useState(false)
  const startYears = experience
    .filter(e => e.start_date)
    .map(e => parseInt(e.start_date.slice(0, 4), 10))
  const earliestStart = Math.min(...startYears)
  const years = new Date().getFullYear() - (earliestStart || 2022)
  const truncated = profile.summary.length > 120
    ? profile.summary.slice(0, 120).trimEnd() + '…'
    : profile.summary
  return (
    <header className="hero">
      <div className="hero-badge">
        <span className="hero-badge-dot" />
        {profile.title}
      </div>
      <h1 className="hero-title">
        <span className="hero-prompt">$</span> SELECT * FROM {profile.name.toLowerCase().replace(/\s+/, '_')}
      </h1>
      <p
        className={`hero-subtitle ${truncated ? 'hero-subtitle--truncable' : ''} ${expanded ? 'hero-subtitle--expanded' : ''}`}
        onClick={() => truncated && setExpanded(e => !e)}
        role={truncated ? 'button' : undefined}
        tabIndex={truncated ? 0 : undefined}
        onKeyDown={truncated ? e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(x => !x) } } : undefined}
      >
        {expanded ? profile.summary : truncated}
        {truncated && !expanded && <span className="hero-subtitle-toggle"> +</span>}
        {truncated && expanded && <span className="hero-subtitle-toggle"> -</span>}
      </p>
      <div className="hero-meta">
        <span className="hero-meta-item">{profile.location}</span>
        <span className="hero-meta-item">⏳ {years}+ years experience</span>
      </div>
    </header>
  )
}
