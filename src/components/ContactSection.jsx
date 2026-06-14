import { useEffect, useRef, useContext } from 'react'
import { resumeData } from '../data/resume'
import { ViewContext } from '../utils/ViewContext'
import SectionHeader from './SectionHeader'

const { profile } = resumeData

export default function ContactSection() {
  const { standardView } = useContext(ViewContext)
  const ref = useRef(null)

  const items = [
    { icon: '@', label: 'EMAIL', val: profile.email, href: `mailto:${profile.email}` },
    { icon: 'in', label: 'LINKEDIN', val: profile.linkedin, href: `https://${profile.linkedin}` },
    { icon: '{}', label: 'GITHUB', val: profile.github, href: `https://${profile.github}` },
    { icon: '◎', label: 'LOCATION', val: `${profile.location} · Open to Remote` },
  ]

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
      <section id="contact" className="resume-section" ref={ref}>
        <SectionHeader tag="TABLE" title="contact" standardTitle="Contact" />
        <div className="contact-grid fade-in">
          {items.map((item, i) => (
            <div className="contact-item" key={i}>
              <div className="contact-icon">{item.icon}</div>
              <div>
                <div className="contact-label">{item.label}</div>
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="contact-val">
                    {item.val}
                  </a>
                ) : (
                  <div className="contact-val">{item.val}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="resume-section" ref={ref}>
      <SectionHeader tag="TABLE" title="contact" standardTitle="Contact" />
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
              <span className="sql-op"> </span>
              <span className="sql-op">*</span>
              <span className="sql-op"> </span>
              <span className="sql-kw">FROM</span>
              <span className="sql-tbl"> contact</span>
              <span className="sql-op">;</span>
            </span>
          </div>
          <div className="query-result-block">
            <div className="result-meta">
              <span className="ok">●</span> {items.length} rows returned (0.001 ms)
            </div>
            <div className="output-table">
              <table>
                <thead>
                  <tr>
                    <th>method</th>
                    <th>value</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i}>
                      <td><span className="sql-kw">{item.label}</span></td>
                      <td>
                        {item.href ? (
                          <a href={item.href} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                            {item.val}
                          </a>
                        ) : (
                          item.val
                        )}
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
