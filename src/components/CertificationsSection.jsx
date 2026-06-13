import { useEffect, useRef } from 'react'
import { resumeData } from '../data/resume'
import SectionHeader from './SectionHeader'

const { certifications } = resumeData

export default function CertificationsSection() {
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
