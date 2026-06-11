# Portfolio — Interactive ETL Developer Resume

An interactive portfolio website styled as a terminal/database console. Visitors can explore the resume via **SQL queries** or a **chatbot** — perfect for showcasing ETL/Data Engineering skills.

## Features

### Query Mode

Run SQL against the resume data. Supported commands:

```sql
SHOW TABLES;
DESCRIBE experience;
SELECT * FROM profile;
SELECT * FROM skills WHERE proficiency = 'Expert';
SELECT * FROM experience WHERE tech_used LIKE '%Databricks%' ORDER BY start_date DESC;
SELECT skill, category FROM skills WHERE category = 'Programming';
SELECT category, COUNT(*) FROM skills GROUP BY category;
SELECT COUNT(*) FROM experience;
SELECT MIN(gpa), MAX(gpa) FROM education;
```

| Table | Contents |
|---|---|
| `profile` | Name, title, location, summary, contact |
| `skills` | Skill name, category, proficiency level |
| `experience` | Job history with company, role, dates, description |
| `education` | Degrees, institutions, GPA |
| `certifications` | Cert names, issuers, dates |
| `projects` | Project descriptions and tech used |
| `resume` | Unified view — all sections as rows |

### Chat Mode

Ask natural-language questions about the resume:

- "Tell me about yourself"
- "What skills do you have?"
- "Describe your Databricks experience"
- "Contact info"

## Getting Started

```bash
npm install
npm run dev
```

### Customize the Resume

Edit `data/resume.json` with your own information. The UI reads from this single source — no code changes needed.

```bash
npm run build   # Production build → dist/
npm run preview # Preview the production build
```

## Tech Stack

- **React 19** + **Vite 8**
- Zero runtime dependencies beyond React
- Custom SQL parser (tokenizer + recursive-descent)
- Dark terminal theme with JetBrains Mono

## Project Structure

```
src/
├── components/    # UI components
├── data/          # Resume data helpers
├── utils/         # SQL parser, executor, chatbot
└── styles/        # CSS (terminal dark theme)
data/
└── resume.json    # Your resume data
```
