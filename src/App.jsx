import { useState, useRef, lazy, Suspense } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Footer from './components/Footer'
import SolarSystemBackground from './components/SolarSystemBackground'
import SolarToggle from './components/SolarToggle'
import { ViewContext } from './utils/ViewContext'
import './styles/resume.css'

const SkillsSection = lazy(() => import('./components/SkillsSection'))
const ExperienceSection = lazy(() => import('./components/ExperienceSection'))
const ProjectsSection = lazy(() => import('./components/ProjectsSection'))
const EducationSection = lazy(() => import('./components/EducationSection'))
const CertificationsSection = lazy(() => import('./components/CertificationsSection'))
const QueryPlayground = lazy(() => import('./components/QueryPlayground'))
const ContactSection = lazy(() => import('./components/ContactSection'))

const fallback = <div className="resume-section"><div className="container" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>-- Loading...</div></div>

function StandardHTML({ onToggle }) {
  const iframeRef = useRef(null)

  function onLoad() {
    const doc = iframeRef.current?.contentDocument
    if (doc) {
      iframeRef.current.style.height = doc.documentElement.scrollHeight + 'px'
    }
  }

  return (
    <div className="standard-html">
      <button className="std-toggle" onClick={onToggle} aria-label="Switch to technical view">
        ≡ Technical
      </button>
      <iframe ref={iframeRef} src="/main.html" title="Resume" className="std-iframe" onLoad={onLoad} />
    </div>
  )
}

export default function App() {
  // Solar system is OFF by default — opt-in only. Heavy animation, easy to opt out of.
  const [solarEnabled, setSolarEnabled] = useState(
    () => localStorage.getItem('solarEnabled') === 'true'
  )
  // Standard View is the default — recruiter-friendly. Technical/SQL view is opt-in.
  const [standardView, setStandardView] = useState(
    () => localStorage.getItem('standardView') !== 'false'
  )

  function toggleSolar() {
    setSolarEnabled((p) => {
      const next = !p
      localStorage.setItem('solarEnabled', String(next))
      return next
    })
  }

  function toggleStandard() {
    setStandardView((p) => {
      const next = !p
      localStorage.setItem('standardView', String(next))
      return next
    })
  }

  return (
    <div className={`resume-page${standardView ? ' standard-view' : ''}`}>
      <SolarSystemBackground enabled={solarEnabled} />
      <SolarToggle enabled={solarEnabled} onToggle={toggleSolar} standardView={standardView} onToggleView={toggleStandard} />
        <ViewContext.Provider value={{ standardView }}>
          {standardView ? (
            <StandardHTML onToggle={toggleStandard} />
          ) : (
            <>
              <Nav onToggle={toggleStandard} />
              <Hero />
              <main id="main-content" className="container">
                <Suspense fallback={fallback}>
                  <SkillsSection />
                  <ExperienceSection />
                  <ProjectsSection />
                  <EducationSection />
                  <CertificationsSection />
                  <QueryPlayground />
                  <ContactSection />
                </Suspense>
              </main>
              <Footer />
            </>
          )}
        </ViewContext.Provider>
    </div>
  )
}
