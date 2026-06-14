import { useEffect, useRef, useContext } from 'react'
import { resumeData } from '../data/resume'
import { ViewContext } from '../utils/ViewContext'
import SectionHeader from './SectionHeader'

const { skills } = resumeData

export default function SkillsSection() {
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
  }, [])

  if (standardView) {
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

  return (
    <section id="skills" className="resume-section" ref={ref}>
      <SectionHeader tag="TABLE" title="skills" standardTitle="Skills" />
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
              <span className="sql-op"> skill, category, proficiency </span>
              <span className="sql-kw">FROM</span>
              <span className="sql-tbl"> skills</span>
              <span className="sql-op"> </span>
              <span className="sql-kw">ORDER BY</span>
              <span className="sql-op"> category, skill;</span>
            </span>
          </div>
          <div className="query-result-block">
            <div className="result-meta">
              <span className="ok">●</span> {skills.length} rows returned (0.001 ms)
            </div>
            <div className="output-table">
              <table>
                <thead>
                  <tr>
                    <th>skill</th>
                    <th>category</th>
                    <th>proficiency</th>
                  </tr>
                </thead>
                <tbody>
                  {skills.map((s, i) => (
                    <tr key={i}>
                      <td>
                        <span className="sql-kw">{s.skill}</span>
                      </td>
                      <td>{s.category}</td>
                      <td>
                        <span className={s.proficiency === 'Advanced' ? 'ok' : 'sql-cmt'}>
                          {s.proficiency}
                        </span>
                      </td>
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
