import Nav from './components/Nav'
import Hero from './components/Hero'
import SkillsSection from './components/SkillsSection'
import ExperienceSection from './components/ExperienceSection'
import EducationSection from './components/EducationSection'
import CertificationsSection from './components/CertificationsSection'
import QueryPlayground from './components/QueryPlayground'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import './styles/resume.css'

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
        <QueryPlayground />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
