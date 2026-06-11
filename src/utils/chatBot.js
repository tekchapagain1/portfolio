import { resumeData } from '../data/resume'

const { profile, skills, experience, education, certifications, projects } = resumeData

function matchAny(input, keywords) {
  const lower = input.toLowerCase()
  return keywords.some(k => {
    if (k.includes(' ')) return lower.includes(k)
    return new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(input)
  })
}

const intentMap = [
  {
    keywords: ['databricks', 'spark', 'pyspark', 'delta lake', 'etl'],
    response: () => {
      const relevantExp = experience.filter(e =>
        e.tech_used.some(t => t.toLowerCase().includes('databricks') || t.toLowerCase().includes('spark') || t.toLowerCase().includes('delta'))
      )
      const relevantProj = projects.filter(p =>
        p.tech_used.some(t => t.toLowerCase().includes('databricks') || t.toLowerCase().includes('spark') || t.toLowerCase().includes('delta'))
      )
      let resp = `**Databricks/Spark Experience:**\n\n`
      if (relevantExp.length) {
        resp += relevantExp.map(e => `- ${e.role} @ ${e.company}: ${e.description}`).join('\n\n')
      }
      if (relevantProj.length) {
        resp += `\n\n**Projects:**\n`
        resp += relevantProj.map(p => `- **${p.name}**: ${p.description}`).join('\n\n')
      }
      return resp
    },
  },
  {
    keywords: ['experience', 'work', 'job', 'employment', 'career', 'positions'],
    response: () => {
      const list = experience.map(e => `- **${e.role}** @ ${e.company} (${e.start_date} — ${e.end_date})\n  ${e.description}`).join('\n\n')
      return `Work experience:\n${list}`
    },
  },
  {
    keywords: ['skills', 'technologies', 'tech stack', 'tools', 'what do you know'],
    response: () => {
      const list = skills.map(s => `- **${s.skill}** (${s.category}, ${s.proficiency})`).join('\n')
      return `Here are the skills:\n${list}`
    },
  },
  {
    keywords: ['about', 'who are you', 'tell me about yourself', 'introduce', 'summary', 'overview'],
    response: () =>
      `${profile.name} is a ${profile.title} based in ${profile.location}. ${profile.summary}`,
  },
  {
    keywords: ['education', 'study', 'degree', 'university', 'college', 'academic', 'gpa'],
    response: () => {
      const list = education.map(e => `- **${e.degree}** in ${e.field} — ${e.institution} (${e.start_date}—${e.end_date})${e.gpa ? `, GPA: ${e.gpa}` : ''}`).join('\n')
      return `Education:\n${list}`
    },
  },
  {
    keywords: ['certification', 'certificate', 'cert', 'credential'],
    response: () => {
      const list = certifications.map(c => `- **${c.name}** — ${c.issuer} (${c.date})`).join('\n')
      return `Certifications:\n${list}`
    },
  },
  {
    keywords: ['project', 'portfolio work', 'built'],
    response: () => {
      const list = projects.map(p => `- **${p.name}**: ${p.description}\n  Tech: ${p.tech_used.join(', ')}`).join('\n\n')
      return `Projects:\n${list}`
    },
  },
  {
    keywords: ['contact', 'email', 'reach', 'hire', 'phone', 'linkedin', 'github'],
    response: () =>
      `You can reach ${profile.name} at:\n- Email: ${profile.email}\n- LinkedIn: ${profile.linkedin}\n- GitHub: ${profile.github}\n- Website: ${profile.website || 'N/A'}`,
  },
  {
    keywords: ['latest', 'recent', 'current', 'present'],
    response: () => {
      const current = experience.find(e => e.end_date === 'Present')
      if (current) {
        return `Currently working as **${current.role}** at **${current.company}**. ${current.description}`
      }
      return 'Check the experience section for the most recent role.'
    },
  },
  {
    keywords: ['sql', 'query', 'mode', 'select'],
    response: () =>
      `Want to run SQL queries? Toggle to **Query** mode above!\n\nTry:\n- \`SHOW TABLES\` — list all tables\n- \`DESCRIBE experience\` — see columns\n- \`SELECT * FROM experience\` — all data\n- \`SELECT skill, proficiency FROM skills WHERE category = 'Programming'\` — filtered`,
  },
  {
    keywords: ['hi', 'hello', 'hey', 'greetings'],
    response: () =>
      `Hello! I'm ${profile.name}'s virtual assistant. Ask me anything about their experience, skills, or background — or try switching to **Query** mode to run SQL on their resume!`,
  },
]

export function getChatResponse(input) {
  const lower = input.toLowerCase().trim()
  if (!lower) return 'Please type a question!'

  for (const { keywords, response } of intentMap) {
    if (matchAny(input, keywords)) {
      return response()
    }
  }

  return `I'm not sure how to answer that. Try asking about **skills**, **experience**, **education**, **projects**, or **contact** info. Or switch to **Query** mode and use SQL!`
}
