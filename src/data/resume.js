import raw from '../../data/resume.json'

export const resumeData = raw

const TABLES = {
  profile: raw.profile ? [raw.profile] : [],
  skills: raw.skills || [],
  experience: raw.experience || [],
  education: raw.education || [],
  certifications: raw.certifications || [],
  projects: raw.projects || [],
}

const TABLE_COLUMNS = {
  profile: ['name', 'title', 'location', 'summary', 'email', 'linkedin', 'github', 'website', 'phone'],
  skills: ['skill', 'category', 'proficiency'],
  experience: ['company', 'role', 'start_date', 'end_date', 'description', 'tech_used'],
  education: ['institution', 'degree', 'field', 'start_date', 'end_date', 'gpa'],
  certifications: ['name', 'issuer', 'date'],
  projects: ['name', 'description', 'tech_used'],
}

const VIRTUAL_TABLES = ['resume']

export function getTableNames() {
  return [...Object.keys(TABLES), ...VIRTUAL_TABLES]
}

export function getTableData(tableName) {
  if (tableName === 'resume') return buildResumeOverview()
  return TABLES[tableName] || null
}

export function getTableColumns(tableName) {
  if (tableName === 'resume') return ['section', 'key', 'value']
  return TABLE_COLUMNS[tableName] || []
}

function buildResumeOverview() {
  const rows = []

  if (raw.profile) {
    for (const [key, val] of Object.entries(raw.profile)) {
      if (typeof val === 'string') {
        rows.push({ section: 'Profile', key, value: val })
      }
    }
  }

  if (raw.skills) {
    for (const s of raw.skills) {
      rows.push({ section: 'Skills', key: s.skill, value: `${s.proficiency} \u00B7 ${s.category}` })
    }
  }

  if (raw.experience) {
    for (const e of raw.experience) {
      rows.push({
        section: 'Experience',
        key: `${e.company} \u2014 ${e.role}`,
        value: `${e.start_date} to ${e.end_date}`,
      })
    }
  }

  if (raw.education) {
    for (const e of raw.education) {
      rows.push({
        section: 'Education',
        key: e.institution,
        value: e.gpa ? `${e.degree} in ${e.field} (GPA: ${e.gpa})` : `${e.degree} in ${e.field}`,
      })
    }
  }

  if (raw.certifications) {
    for (const c of raw.certifications) {
      rows.push({ section: 'Certifications', key: c.name, value: c.issuer })
    }
  }

  if (raw.projects) {
    for (const p of raw.projects) {
      rows.push({ section: 'Projects', key: p.name, value: p.tech_used.join(', ') })
    }
  }

  return rows
}
