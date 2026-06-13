import { useContext } from 'react'
import { ViewContext } from '../utils/ViewContext'

export default function SectionHeader({ tag, title, standardTitle }) {
  const { standardView } = useContext(ViewContext)

  if (standardView) {
    return (
      <div className="resume-section-header fade-in">
        <h2 className="resume-section-title-standard">{standardTitle || title}</h2>
        <div className="resume-section-rule" />
      </div>
    )
  }

  return (
    <div className="resume-section-header fade-in">
      <span className="resume-section-tag">{tag}</span>
      <span className="resume-section-title">{title}</span>
      <div className="resume-section-rule" />
    </div>
  )
}
