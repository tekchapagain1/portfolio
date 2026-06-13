import { useEffect, useRef } from 'react'
import { resumeData } from '../data/resume'
import SectionHeader from './SectionHeader'

const { skills } = resumeData

const CATEGORY_COLORS = {
  'Programming': 'amber',
  'Web Framework': 'amber',
  'Platform': null,
  'Tools': null,
  'Visualization': 'cyan',
  'ETL': null,
  'DevOps': 'blue',
  'CI/CD': 'blue',
  'Database': 'purple',
  'Web Development': 'cyan',
}

function categorizeSkills() {
  const map = {}
  for (const s of skills) {
    const cat = s.category || 'Other'
    if (!map[cat]) map[cat] = []
    map[cat].push(s)
  }
  return Object.entries(map)
}

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

  const categorized = categorizeSkills()

  return (
    <section id="skills" className="resume-section" ref={ref}>
      <SectionHeader tag="TABLE" title="skills" standardTitle="Skills" />
      <div className="skills-grid fade-in">
        {categorized.map(([cat, items]) => {
          const color = CATEGORY_COLORS[cat] || ''
          return (
            <div key={cat}>
              <div className="skill-cat-header">
                <div className={`cat-dot ${color}`} />
                <span>{cat}</span>
              </div>
              <div className="skill-pills">
                {items.map((s) => (
                  <span
                    key={s.skill}
                    className={`pill ${s.proficiency === 'Advanced' ? 'expert' : ''}`}
                  >
                    {s.skill}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
