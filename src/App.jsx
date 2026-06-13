import { lazy, Suspense } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Footer from './components/Footer'
import './styles/resume.css'

const SkillsSection = lazy(() => import('./components/SkillsSection'))
const ExperienceSection = lazy(() => import('./components/ExperienceSection'))
const EducationSection = lazy(() => import('./components/EducationSection'))
const CertificationsSection = lazy(() => import('./components/CertificationsSection'))
const QueryPlayground = lazy(() => import('./components/QueryPlayground'))
const ContactSection = lazy(() => import('./components/ContactSection'))

const fallback = <div className="resume-section"><div className="container" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>-- Loading...</div></div>

export default function App() {
  return (
    <div className="resume-page">
      <Nav />
      <Hero />
      <main className="container">
        <Suspense fallback={fallback}>
          <SkillsSection />
          <ExperienceSection />
          <EducationSection />
          <CertificationsSection />
          <QueryPlayground />
          <ContactSection />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
