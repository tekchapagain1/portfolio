import { useState, useEffect, useRef, useContext } from 'react'
import { resumeData } from '../data/resume'
import { ViewContext } from '../utils/ViewContext'
import SectionHeader from './SectionHeader'

const { experience } = resumeData

export default function ExperienceSection() {
  const { standardView } = useContext(ViewContext)
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

  if (standardView) {
    return (
      <section id="experience" className="resume-section" ref={ref}>
        <SectionHeader tag="TABLE" title="experience" standardTitle="Experience" />
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
            <div className="col-name" style={{ textAlign: 'right' }}>status</div>
          </div>
          {experience.map((exp, i) => {
            const id = `e${i}`
            const isOpen = openId === id
            const isCurrent = exp.end_date === 'Present'
            return (
              <div key={id}>
                <div className="db-row exp-row-toggle" onClick={() => toggle(id)}>
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
                        <span key={tech} className="tech-tag">{tech}</span>
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

  return (
    <section id="experience" className="resume-section" ref={ref}>
      <SectionHeader tag="TABLE" title="experience" standardTitle="Experience" />
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
              <span className="sql-op"> company, role, start_date, end_date, tech_used </span>
              <span className="sql-kw">FROM</span>
              <span className="sql-tbl"> experience</span>
              <span className="sql-op"> </span>
              <span className="sql-kw">ORDER BY</span>
              <span className="sql-op"> start_date DESC;</span>
            </span>
          </div>
          <div className="query-result-block">
            <div className="result-meta">
              <span className="ok">●</span> {experience.length} rows returned (0.002 ms)
            </div>
            <div className="output-table">
              <table>
                <thead>
                  <tr>
                    <th>company</th>
                    <th>role</th>
                    <th>period</th>
                    <th>status</th>
                  </tr>
                </thead>
                <tbody>
                  {experience.map((exp, i) => {
                    const isCurrent = exp.end_date === 'Present'
                    return (
                      <tr key={i}>
                        <td><span className="sql-kw">{exp.company}</span></td>
                        <td>{exp.role}</td>
                        <td>{formatPeriod(exp.start_date, exp.end_date)}</td>
                        <td>
                          <span className={isCurrent ? 'ok' : 'sql-cmt'}>
                            {isCurrent ? 'CURRENT' : 'PAST'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
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
    </section>
  )
}
