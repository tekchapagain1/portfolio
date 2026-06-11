import { resumeData } from '../data/resume'

const { profile } = resumeData

export default function Footer({ theme, onToggleTheme, sla }) {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href={`https://${profile.github}`} target="_blank" rel="noopener noreferrer">
          <span className="footer-icon">&#x1F419;</span> GitHub
        </a>
        <a href={`https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer">
          <span className="footer-icon">&#x1F517;</span> LinkedIn
        </a>
        <a href={`mailto:${profile.email}`}>
          <span className="footer-icon">&#x2709;</span> Email
        </a>
        <a href={profile.website} target="_blank" rel="noopener noreferrer">
          <span className="footer-icon">&#x1F310;</span> Website
        </a>
        <button className="footer-theme-btn" onClick={onToggleTheme} title="Toggle theme">
          {theme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19'} {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>
      <div className="footer-sla">
        <span className="footer-sla-item" title="Uptime">&#x26A0; {sla.uptime}% uptime</span>
        <span className="footer-sla-item" title="Avg query time">&#x26A1; {sla.avgQuery.toFixed(3)}s avg</span>
        <span className="footer-sla-item" title="P99 latency">&#x23F1; P99 {sla.p99.toFixed(3)}s</span>
        <span className="footer-sla-item" title="Total queries">&#x1F4CA; {sla.totalQueries} queries</span>
      </div>
    </footer>
  )
}
