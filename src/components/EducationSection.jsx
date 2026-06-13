import { useEffect, useRef } from 'react'
import { resumeData } from '../data/resume'

const { education } = resumeData

export default function EducationSection() {
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
    <section id="education" className="resume-section" ref={ref}>
      <div className="resume-section-header fade-in">
        <span className="resume-section-tag">TABLE</span>
        <span className="resume-section-title">education</span>
        <div className="resume-section-rule" />
      </div>
      <div className="db-table edu-table fade-in">
        <div className="db-table-header">
          <span>▶</span>
          <span className="tbl-name">education</span>
          <span style={{ marginLeft: 'auto' }}>{education.length} rows</span>
        </div>
        <div className="db-table-cols">
          <div className="col-name">degree</div>
          <div className="col-name">institution</div>
          <div className="col-name">year</div>
          <div className="col-name" style={{ textAlign: 'right' }}>
            gpa
          </div>
        </div>
        {education.map((edu, i) => (
          <div className="db-row" key={i}>
            <div className="edu-degree">{edu.degree}</div>
            <div className="edu-school">{edu.institution}</div>
            <div className="edu-year">{edu.end_date}</div>
            <div className="gpa">{edu.gpa ?? '—'}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
