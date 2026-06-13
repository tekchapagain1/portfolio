import { createContext } from 'react'

// Default to Standard View — recruiter-friendly, non-technical friendly.
// Technical (SQL terminal) view is opt-in via the nav toggle.
export const ViewContext = createContext({ standardView: true })
