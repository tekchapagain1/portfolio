import { lazy, Suspense } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import SkillsSection from './components/SkillsSection'
import ExperienceSection from './components/ExperienceSection'
import EducationSection from './components/EducationSection'
import CertificationsSection from './components/CertificationsSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import './styles/resume.css'

const QueryPlayground = lazy(() => import('./components/QueryPlayground'))

export default function App() {
  return (
    <div className="resume-page">
      <Nav />
      <Hero />
      <main className="container">
        <SkillsSection />
        <ExperienceSection />
        <EducationSection />
        <CertificationsSection />
        <Suspense fallback={<div className="resume-section"><div className="container" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>-- Loading query engine...</div></div>}>
          <QueryPlayground />
        </Suspense>
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
