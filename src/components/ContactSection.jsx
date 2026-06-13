import { useEffect, useRef } from 'react'
import { resumeData } from '../data/resume'
import SectionHeader from './SectionHeader'

const { profile } = resumeData

export default function ContactSection() {
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

  const items = [
    { icon: '@', label: 'EMAIL', val: profile.email, href: `mailto:${profile.email}` },
    { icon: 'in', label: 'LINKEDIN', val: profile.linkedin, href: `https://${profile.linkedin}` },
    { icon: '{}', label: 'GITHUB', val: profile.github, href: `https://${profile.github}` },
    { icon: '◎', label: 'LOCATION', val: `${profile.location} · Open to Remote` },
  ]

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
