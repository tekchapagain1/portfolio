import { useEffect, useRef, useContext } from 'react'
import { resumeData } from '../data/resume'
import { ViewContext } from '../utils/ViewContext'
import SectionHeader from './SectionHeader'

const { education } = resumeData

export default function EducationSection() {
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
      <section id="education" className="resume-section" ref={ref}>
        <SectionHeader tag="TABLE" title="education" standardTitle="Education" />
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
            <div className="col-name" style={{ textAlign: 'right' }}>gpa</div>
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

  return (
    <section id="education" className="resume-section" ref={ref}>
      <SectionHeader tag="TABLE" title="education" standardTitle="Education" />
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
              <span className="sql-op"> degree, institution, end_date, </span>
              <span className="sql-fn">NVL</span>
              <span className="sql-op">(gpa, </span>
              <span className="sql-str">'—'</span>
              <span className="sql-op">) AS gpa </span>
              <span className="sql-kw">FROM</span>
              <span className="sql-tbl"> education</span>
              <span className="sql-op">;</span>
            </span>
          </div>
          <div className="query-result-block">
            <div className="result-meta">
              <span className="ok">●</span> {education.length} row{education.length !== 1 ? 's' : ''} returned (0.001 ms)
            </div>
            <div className="output-table">
              <table>
                <thead>
                  <tr>
                    <th>degree</th>
                    <th>institution</th>
                    <th>year</th>
                    <th>gpa</th>
                  </tr>
                </thead>
                <tbody>
                  {education.map((edu, i) => (
                    <tr key={i}>
                      <td>{edu.degree}</td>
                      <td>{edu.institution}</td>
                      <td>{edu.end_date}</td>
                      <td>{edu.gpa != null ? edu.gpa : <span className="sql-cmt">NULL</span>}</td>
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
