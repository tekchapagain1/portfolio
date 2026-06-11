import { resumeData } from '../data/resume'

const { profile, skills, experience, education, certifications, projects } = resumeData

export default function DataQualityCard() {
  const checks = [
    { label: 'Profile', ok: profile && profile.name && profile.title && profile.summary },
    { label: 'Skills', ok: skills && skills.length > 0 },
    { label: 'Experience', ok: experience && experience.length > 0 },
    { label: 'Education', ok: education && education.length > 0 },
    { label: 'Certifications', ok: certifications && certifications.length > 0 },
    { label: 'Projects', ok: projects && projects.length > 0 },
  ]

  const passed = checks.filter(c => c.ok).length
  const total = checks.length
  const pct = Math.round((passed / total) * 100)

  return (
    <div className="dq-card">
      <div className="dq-card-header">
        <span className="dq-card-title">Data Quality</span>
        <span className={`dq-badge ${pct === 100 ? 'dq-badge--ok' : pct >= 80 ? 'dq-badge--warn' : 'dq-badge--bad'}`}>
          {pct}%
        </span>
      </div>
      <div className="dq-bar">
        <div className="dq-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="dq-checks">
        {checks.map((c, i) => (
          <div key={i} className="dq-check">
            <span className={`dq-check-icon ${c.ok ? 'dq-check--pass' : 'dq-check--fail'}`}>
              {c.ok ? '\u2713' : '\u2717'}
            </span>
            <span className="dq-check-label">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
