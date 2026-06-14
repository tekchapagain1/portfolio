import { useState, useEffect, useRef, useContext } from 'react'
import { resumeData } from '../data/resume'
import { ViewContext } from '../utils/ViewContext'
import SectionHeader from './SectionHeader'

const { projects } = resumeData

export default function ProjectsSection() {
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

  if (standardView) {
    return (
      <section id="projects" className="resume-section" ref={ref}>
        <SectionHeader tag="TABLE" title="projects" standardTitle="Projects" />
        <div className="db-table exp-table fade-in">
          <div className="db-table-header">
            <span>▶</span>
            <span className="tbl-name">projects</span>
            <span style={{ marginLeft: 'auto' }}>{projects.length} rows</span>
          </div>
          <div className="db-table-cols">
            <div className="col-name">name</div>
            <div className="col-name">description</div>
            <div className="col-name" style={{ textAlign: 'right' }}>tech</div>
          </div>
          {projects.map((proj, i) => {
            const id = `p${i}`
            const isOpen = openId === id
            return (
              <div key={id}>
                <div className="db-row exp-row-toggle" onClick={() => toggle(id)}>
                  <div>
                    <div className="exp-company">{proj.name}</div>
                  </div>
                  <div className="exp-role">
                    <span className="exp-period">{proj.description.slice(0, 80)}{proj.description.length > 80 ? '...' : ''}</span>
                    <span className={`toggle-icon ${isOpen ? 'open' : ''}`}>▶</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="exp-badge">{proj.tech_used.length} tools</span>
                  </div>
                </div>
                <div className={`exp-detail ${isOpen ? 'open' : ''}`}>
                  <p className="exp-desc">{proj.description}</p>
                  {proj.tech_used && (
                    <div className="tech-tags">
                      {proj.tech_used.map((tech) => (
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
    <section id="projects" className="resume-section" ref={ref}>
      <SectionHeader tag="TABLE" title="projects" standardTitle="Projects" />
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
              <span className="sql-op"> name, </span>
              <span className="sql-fn">SUBSTR</span>
              <span className="sql-op">(description, 1, 60) AS short_desc, tech_used </span>
              <span className="sql-kw">FROM</span>
              <span className="sql-tbl"> projects</span>
              <span className="sql-op">;</span>
            </span>
          </div>
          <div className="query-result-block">
            <div className="result-meta">
              <span className="ok">●</span> {projects.length} rows returned (0.001 ms)
            </div>
            <div className="output-table">
              <table>
                <thead>
                  <tr>
                    <th>name</th>
                    <th>description</th>
                    <th>tech</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((proj, i) => (
                    <tr key={i}>
                      <td>{proj.name}</td>
                      <td>{proj.description.slice(0, 60)}{proj.description.length > 60 ? '...' : ''}</td>
                      <td>{proj.tech_used.join(', ')}</td>
                    </tr>
                  ))}
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
