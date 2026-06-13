import { useState, useEffect, useRef } from 'react'
import { resumeData } from '../data/resume'
import SectionHeader from './SectionHeader'

const { projects } = resumeData

export default function ProjectsSection() {
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
              <div
                className="db-row exp-row-toggle"
                onClick={() => toggle(id)}
              >
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
