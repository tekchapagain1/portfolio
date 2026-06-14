import { memo, useContext } from 'react'
import { ViewContext } from '../utils/ViewContext'

function Nav() {
  const { standardView } = useContext(ViewContext)

  return (
    <nav className="resume-nav" aria-label="Section navigation">
      <div className="resume-nav-inner">
        <div className="resume-nav-logo">
          {standardView ? (
            <>
              <span className="prompt" aria-hidden="true">◈</span>
              <a href="#">Tek Chapagain</a>
            </>
          ) : (
            <>
              <span className="prompt" aria-hidden="true">$</span>
              <span>tek@resume:~</span>
            </>
          )}
        </div>
        <ul className="resume-nav-links" role="list">
          <li><a href="#skills">SKILLS</a></li>
          <li><a href="#experience">EXPERIENCE</a></li>
          <li><a href="#education">EDUCATION</a></li>
          {!standardView && <li><a href="#query">QUERY</a></li>}
          <li><a href="#contact">CONTACT</a></li>
        </ul>
      </div>
      <div className="resume-statusbar" role="status">
        {standardView ? (
          <span>RESUME — Tek Chapagain</span>
        ) : (
          <>
            <span>CONNECTED</span>
            <span>DB: resume_v1</span>
            <span>ENGINE: Oracle 19c</span>
            <span>OPEN FOR WORK</span>
          </>
        )}
      </div>
    </nav>
  )
}

export default memo(Nav)
