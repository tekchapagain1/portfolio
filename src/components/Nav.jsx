import { memo } from 'react'

function Nav() {
  return (
    <nav className="resume-nav" aria-label="Section navigation">
      <div className="resume-nav-inner">
        <div className="resume-nav-logo">
          <span className="prompt" aria-hidden="true">$</span>
          <span>tek@resume:~</span>
        </div>
        <ul className="resume-nav-links" role="list">
          <li><a href="#skills">SKILLS</a></li>
          <li><a href="#experience">EXPERIENCE</a></li>
          <li><a href="#education">EDUCATION</a></li>
          <li><a href="#query">QUERY</a></li>
          <li><a href="#contact">CONTACT</a></li>
        </ul>
      </div>
      <div className="resume-statusbar" role="status">
        <span>CONNECTED</span>
        <span>DB: resume_v1</span>
        <span>ENGINE: Oracle 19c</span>
        <span>OPEN FOR WORK</span>
      </div>
    </nav>
  )
}

export default memo(Nav)
