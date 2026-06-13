import { useState, lazy, Suspense } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Footer from './components/Footer'
import SolarSystemBackground from './components/SolarSystemBackground'
import SolarToggle from './components/SolarToggle'
import MusicToggle from './components/MusicToggle'
import ViewToggle from './components/ViewToggle'
import { ViewContext } from './utils/ViewContext'
import './styles/resume.css'

const SkillsSection = lazy(() => import('./components/SkillsSection'))
const ExperienceSection = lazy(() => import('./components/ExperienceSection'))
const EducationSection = lazy(() => import('./components/EducationSection'))
const CertificationsSection = lazy(() => import('./components/CertificationsSection'))
const QueryPlayground = lazy(() => import('./components/QueryPlayground'))
const ContactSection = lazy(() => import('./components/ContactSection'))

const fallback = <div className="resume-section"><div className="container" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>-- Loading...</div></div>

export default function App() {
  const [solarEnabled, setSolarEnabled] = useState(
    () => localStorage.getItem('solarEnabled') !== 'false'
  )
  const [musicEnabled, setMusicEnabled] = useState(
    () => localStorage.getItem('musicEnabled') === 'true'
  )
  const [standardView, setStandardView] = useState(
    () => localStorage.getItem('standardView') === 'true'
  )

  function toggleSolar() {
    setSolarEnabled((p) => {
      const next = !p
      localStorage.setItem('solarEnabled', next)
      return next
    })
  }

  function toggleMusic() {
    setMusicEnabled((p) => {
      const next = !p
      localStorage.setItem('musicEnabled', next)
      return next
    })
  }

  function toggleStandard() {
    setStandardView((p) => {
      const next = !p
      localStorage.setItem('standardView', next)
      return next
    })
  }

  return (
    <div className={`resume-page${standardView ? ' standard-view' : ''}`}>
      <SolarSystemBackground enabled={solarEnabled} />
      <SolarToggle enabled={solarEnabled} onToggle={toggleSolar} />
      <MusicToggle enabled={musicEnabled} onToggle={toggleMusic} />
      <ViewToggle standardView={standardView} onToggle={toggleStandard} />
        <ViewContext.Provider value={{ standardView }}>
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
        </ViewContext.Provider>
    </div>
  )
}
