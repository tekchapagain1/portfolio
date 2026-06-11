import { resumeData } from '../data/resume'

const { profile, experience } = resumeData

export default function Hero() {
  const startYears = experience
    .filter(e => e.start_date)
    .map(e => parseInt(e.start_date.slice(0, 4), 10))
  const earliestStart = Math.min(...startYears)
  const years = new Date().getFullYear() - (earliestStart || 2022)
  return (
    <header className="hero">
      <div className="hero-badge">
        <span className="hero-badge-dot" />
        {profile.title}
      </div>
      <h1 className="hero-title">
        <span className="hero-prompt">$</span> SELECT * FROM {profile.name.toLowerCase().replace(/\s+/, '_')}
      </h1>
      <p className="hero-subtitle">{profile.summary}</p>
      <div className="hero-meta">
        <span className="hero-meta-item">{profile.location}</span>
        <span className="hero-meta-item">⏳ {years}+ years experience</span>
      </div>
    </header>
  )
}
