import { useEffect, useRef } from 'react'
import { resumeData } from '../data/resume'
import SectionHeader from './SectionHeader'

const { skills } = resumeData

export default function SkillsSection() {
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

  return (
    <section id="skills" className="resume-section" ref={ref}>
      <SectionHeader tag="TABLE" title="skills" standardTitle="Skills" />
      <div className="db-table skills-table fade-in">
        <div className="db-table-header">
          <span>▶</span>
          <span className="tbl-name">skills</span>
          <span style={{ marginLeft: 'auto' }}>{skills.length} rows</span>
        </div>
        <div className="db-table-cols">
          <div className="col-name">skill</div>
          <div className="col-name">category</div>
          <div className="col-name" style={{ textAlign: 'right' }}>proficiency</div>
        </div>

        {skills.map((s, i) => (
          <div key={i} className="db-row">
            <div className="sk-name">{s.skill}</div>
            <div className="sk-category">{s.category}</div>
            <div style={{ textAlign: 'right' }}>
              <span className={`sk-badge ${s.proficiency === 'Advanced' ? 'advanced' : ''}`}>
                {s.proficiency}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
