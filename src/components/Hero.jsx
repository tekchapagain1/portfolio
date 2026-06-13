import { useEffect, useRef, useContext } from 'react'
import { resumeData } from '../data/resume'
import { ViewContext } from '../utils/ViewContext'

const { profile, experience, skills } = resumeData

export default function Hero() {
  const { standardView } = useContext(ViewContext)
  const ref = useRef(null)

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
  }, [standardView])

  const startYears = experience
    .filter((e) => e.start_date)
    .map((e) => parseInt(e.start_date.slice(0, 4), 10))
  const earliestStart = Math.min(...startYears)
  const years = new Date().getFullYear() - (earliestStart || 2022)

  const expertSkills = skills.filter((s) => s.proficiency === 'Advanced').length
  const pipelineCount = experience.length

  const initials = profile.name.split(' ')[0][0] + '.' + profile.name.split(' ').slice(-1)[0][0]

  return (
    <header ref={ref}>
      <div className="resume-hero">
        <p className="resume-hero-eyebrow">
          {standardView
            ? `-- PORTFOLIO \u00A0·\u00A0 ${profile.name} \u00A0·\u00A0 ${profile.location}`
            : `-- RESUME.DB \u00A0·\u00A0 ESTABLISHED ${earliestStart} \u00A0·\u00A0 KATHMANDU, NP`
          }
        </p>

        {standardView ? (
          <div className="standard-intro-card fade-in">
            <div className="standard-intro-header">
              <div className="standard-intro-avatar">{initials}</div>
              <div>
                <h1 className="standard-intro-name">{profile.name}</h1>
                <p className="standard-intro-title">{profile.title} — ETL &amp; Data Engineering</p>
              </div>
            </div>
            <p className="standard-intro-summary">{profile.summary}</p>
            <div className="looking-for">
              <span className="looking-for-dot" aria-hidden="true" />
              <span>
                <strong>Open to senior ETL / data engineering roles</strong> — remote or relocation-friendly.
                4+ years building pipelines that don't wake you up at 3 a.m.
              </span>
            </div>
            <div className="standard-intro-highlights">
              <div className="standard-highlight">
                <span className="standard-highlight-val">{years}+</span>
                <span className="standard-highlight-lbl">Years Experience</span>
              </div>
              <div className="standard-highlight">
                <span className="standard-highlight-val">{pipelineCount}</span>
                <span className="standard-highlight-lbl">Positions Held</span>
              </div>
              <div className="standard-highlight">
                <span className="standard-highlight-val">{expertSkills}</span>
                <span className="standard-highlight-lbl">Expert Skills</span>
              </div>
              <div className="standard-highlight">
                <span className="standard-highlight-val">{profile.location.split(',')[0]}</span>
                <span className="standard-highlight-lbl">Location</span>
              </div>
            </div>
            <div className="resume-hero-actions">
              <a href="#experience" className="btn btn-primary">
                <span className="btn-icon">↓</span>
                <span>See experience</span>
              </a>
              <a href="#projects" className="btn btn-ghost">
                <span className="btn-icon">→</span>
                <span>View projects</span>
              </a>
              <a href="#contact" className="btn btn-ghost">
                <span className="btn-icon">@</span>
                <span>Get in touch</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="query-block fade-in">
            <div className="query-titlebar">
              <div className="dot dot-r" />
              <div className="dot dot-y" />
              <div className="dot dot-g" />
              <span className="query-titlebar-label">oracle — resume.db</span>
            </div>
            <div className="query-body">
              <div className="query-line">
                <span className="prompt-sym">resume=#</span>
                <span>
                  <span className="sql-kw">SELECT</span>
                  <span className="sql-op"> name, title, location </span>
                  <span className="sql-kw">FROM</span>
                  <span className="sql-tbl"> profile</span>
                  <span className="sql-op"> </span>
                  <span className="sql-kw">WHERE</span>
                  <span className="sql-op"> status </span>
                  <span className="sql-op">= </span>
                  <span className="sql-str">'active'</span>
                  <span className="sql-op">;</span>
                </span>
              </div>
              <div className="query-result-block">
                <div className="result-meta">
                  <span className="ok">●</span> 1 row returned (0.003 ms)
                </div>
                <div className="output-table">
                  <table>
                    <thead>
                      <tr>
                        <th>name</th>
                        <th>title</th>
                        <th>location</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{profile.name}</td>
                        <td>
                          {profile.title}{' '}
                          <span className="sql-cmt">-- Data Engineer · Business Intelligence Developer</span>
                        </td>
                        <td>{profile.location}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="query-line" style={{ marginTop: 14 }}>
                <span className="prompt-sym">resume=#</span>
                <span className="cursor-blink" />
              </div>
            </div>
          </div>
        )}
        {!standardView && (
        <div className="fade-in" style={{ transitionDelay: '0.1s' }}>
          <h1 className="resume-hero-name">
            {profile.name.split(' ')[0]}{' '}
            <span className="accent">{profile.name.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="resume-hero-title">
            <span className="tech">ETL Developer</span> &nbsp;/&nbsp; Data Engineer &nbsp;/&nbsp; Business Intelligence Developer
          </p>
          <p className="resume-hero-summary">{profile.summary}</p>
          <div className="looking-for looking-for--inline">
            <span className="looking-for-dot" aria-hidden="true" />
            <span>
              <strong>Open to senior ETL / data engineering roles</strong> — remote or relocation-friendly.
            </span>
          </div>
          <div className="resume-hero-actions">
              <a href="#query" className="btn btn-primary">
                <span className="btn-icon">▶</span>
                <span>Run a query</span>
              </a>
            <a href="#contact" className="btn btn-ghost">
              <span className="btn-icon">→</span>
              <span>Get in touch</span>
            </a>
          </div>
        </div>
        )}

        <div className="resume-hero-stats fade-in" style={{ transitionDelay: '0.2s' }}>
          <div className="stat-cell">
            <div className="stat-val">{years}+</div>
            <div className="stat-lbl">YRS EXPERIENCE</div>
          </div>
          <div className="stat-cell">
            <div className="stat-val">{pipelineCount}</div>
            <div className="stat-lbl">POSITIONS HELD</div>
          </div>
          <div className="stat-cell">
            <div className="stat-val">{expertSkills}</div>
            <div className="stat-lbl">EXPERT SKILLS</div>
          </div>
          <div className="stat-cell">
            <div className="stat-val">{initials}</div>
            <div className="stat-lbl">CERTIFICATIONS</div>
          </div>
        </div>
      </div>
    </header>
  )
}
