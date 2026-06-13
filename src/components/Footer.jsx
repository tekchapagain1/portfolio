import { memo, useContext } from 'react'
import { ViewContext } from '../utils/ViewContext'

function Footer() {
  const { standardView } = useContext(ViewContext)

  if (standardView) {
    return (
      <footer className="resume-footer">
        &copy; {new Date().getFullYear()} Tek Chapagain &nbsp;·&nbsp; Built with React
      </footer>
    )
  }

  return (
    <footer className="resume-footer">
      <span className="green">resume.db</span> &nbsp;·&nbsp; SELECT * FROM tek_chapagain WHERE
      available = true &nbsp;·&nbsp; <span className="green">1 row returned</span>
    </footer>
  )
}

export default memo(Footer)
