import { useEffect, useRef, useContext } from 'react'
import { resumeData } from '../data/resume'
import { ViewContext } from '../utils/ViewContext'
import SectionHeader from './SectionHeader'

const { certifications } = resumeData

export default function CertificationsSection() {
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
      <section id="certifications" className="resume-section" ref={ref}>
        <SectionHeader tag="TABLE" title="certifications" standardTitle="Certifications" />
        <div className="certs-grid fade-in">
          {certifications.map((cert, i) => (
            <div className="cert-card" key={i}>
              <div className="cert-badge-icon">✦</div>
              <div className="cert-issuer">{cert.issuer.toUpperCase()}</div>
              <div className="cert-name">{cert.name}</div>
              <div className="cert-date">{cert.date}</div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section id="certifications" className="resume-section" ref={ref}>
      <SectionHeader tag="TABLE" title="certifications" standardTitle="Certifications" />
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
              <span className="sql-op"> name, issuer, date </span>
              <span className="sql-kw">FROM</span>
              <span className="sql-tbl"> certifications</span>
              <span className="sql-op"> </span>
              <span className="sql-kw">ORDER BY</span>
              <span className="sql-op"> date DESC;</span>
            </span>
          </div>
          <div className="query-result-block">
            <div className="result-meta">
              <span className="ok">●</span> {certifications.length} row{certifications.length !== 1 ? 's' : ''} returned (0.001 ms)
            </div>
            <div className="output-table">
              <table>
                <thead>
                  <tr>
                    <th>name</th>
                    <th>issuer</th>
                    <th>date</th>
                  </tr>
                </thead>
                <tbody>
                  {certifications.map((cert, i) => (
                    <tr key={i}>
                      <td>{cert.name}</td>
                      <td>{cert.issuer}</td>
                      <td>{cert.date}</td>
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
