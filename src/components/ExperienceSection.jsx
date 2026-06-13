import { useState, useEffect, useRef } from 'react'
import { resumeData } from '../data/resume'

const { experience } = resumeData

export default function ExperienceSection() {
  const [openId, setOpenId] = useState(null)
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
  }, [])

  function toggle(id) {
    setOpenId((prev) => (prev === id ? null : id))
  }

  const formatPeriod = (start, end) => {
    const s = start.replace('-', ' – ')
    const e = end === 'Present' ? end : end?.replace('-', ' – ')
    return `${s} – ${e}`
  }

  return (
    <section id="experience" className="resume-section" ref={ref}>
      <div className="resume-section-header fade-in">
        <span className="resume-section-tag">TABLE</span>
        <span className="resume-section-title">experience</span>
        <div className="resume-section-rule" />
      </div>
      <div className="db-table exp-table fade-in">
        <div className="db-table-header">
          <span>▶</span>
          <span className="tbl-name">experience</span>
          <span style={{ marginLeft: 'auto' }}>{experience.length} rows</span>
        </div>
        <div className="db-table-cols">
          <div className="col-name">company</div>
          <div className="col-name">role</div>
          <div className="col-name">period</div>
          <div className="col-name" style={{ textAlign: 'right' }}>
            status
          </div>
        </div>

        {experience.map((exp, i) => {
          const id = `e${i}`
          const isOpen = openId === id
          const isCurrent = exp.end_date === 'Present'

          return (
            <div key={id}>
              <div
                className="db-row exp-row-toggle"
                onClick={() => toggle(id)}
              >
                <div>
                  <div className="exp-company">{exp.company}</div>
                </div>
                <div className="exp-role">
                  {exp.role} <span className={`toggle-icon ${isOpen ? 'open' : ''}`}>▶</span>
                </div>
                <div className="exp-period">{formatPeriod(exp.start_date, exp.end_date)}</div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`exp-badge ${isCurrent ? 'current' : ''}`}>
                    {isCurrent ? 'CURRENT' : 'PAST'}
                  </span>
                </div>
              </div>
              <div className={`exp-detail ${isOpen ? 'open' : ''}`}>
                <p className="exp-desc">{exp.description}</p>
                {exp.tech_used && (
                  <div className="tech-tags">
                    {exp.tech_used.map((tech) => (
                      <span key={tech} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
