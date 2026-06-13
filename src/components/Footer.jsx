import { memo } from 'react'

function Footer() {
  return (
    <footer className="resume-footer">
      <span className="green">resume.db</span> &nbsp;·&nbsp; SELECT * FROM tek_chapagain WHERE
      available = true &nbsp;·&nbsp; <span className="green">1 row returned</span>
    </footer>
  )
}

export default memo(Footer)
