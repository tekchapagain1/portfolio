# Tek Chapagain — ETL Developer

Building ETL pipelines with Python, SQL, and Databricks. 4 years turning raw data into actionable insights.

→ **[tekchapagain.com.np](https://tekchapagain.com.np)**

A terminal-themed interactive portfolio with an in-browser SQL playground. The resume is queryable as SQLite tables — or view it as a clean, professional card layout. Deployed on Vercel.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Database | sql.js (SQLite compiled to WASM, runs in-browser) |
| Font | JetBrains Mono (deferred, non-render-blocking) |
| Deployment | Vercel |
| Dependencies | `react`, `react-dom`, `sql.js` only |

## Features

### Dual View Mode
- **Standard View** (default) — Professional card layout with intro card, summary, highlights grid, and section headers. For non-technical reviewers.
- **Technical View** — SQL terminal interface with query-block hero, `.db`-style section headers, and a live SQL playground. Toggle available in the nav.
- Preference persisted in `localStorage`.

### Interactive SQL Playground
A live query interface using sql.js (SQLite compiled to WASM, runs fully in the browser — no server). Visitors can run `SELECT`, `SHOW TABLES`, `GROUP BY`, `ORDER BY`, and aggregate queries against the resume dataset. Pre-built chip templates for quick exploration.

### Canvas Solar System
A subtle background animation of orbiting planets named after skills (Python, SQL, Spark, etc.). Toggle on/off via a pill button. **Defaults to off** — opt-in only to avoid battery drain.

## Getting Started

```bash
npm install
npm run dev        # Development server
npm run build      # Production build → dist/
npm run preview    # Preview the production build
npm run lint       # ESLint
```

## Data Model

The resume data lives in `data/resume.json`. The SQL engine exposes these tables:

| Table | Contents |
|---|---|
| `profile` | Name, title, location, summary, contact |
| `skills` | Skill name, category, proficiency level |
| `experience` | Job history with company, role, dates, description |
| `education` | Degrees, institutions, GPA |
| `certifications` | Cert names, issuers, dates |
| `projects` | Project descriptions and tech used |
| `resume` | Unified view — all sections as rows |

## Customization

Edit `data/resume.json` with your own information. The UI reads from this single source — no code changes required.

## Available SQL Commands

```sql
SHOW TABLES;
DESCRIBE experience;
SELECT * FROM profile;
SELECT * FROM skills WHERE proficiency = 'Advanced';
SELECT * FROM experience ORDER BY start_date DESC;
SELECT category, COUNT(*) FROM skills GROUP BY category;
SELECT MIN(gpa), MAX(gpa) FROM education;
```

## Key Decisions

- **Canvas over CSS** for the solar system — better animated multi-object performance.
- **React Context** (`ViewContext`) over prop drilling — standardView spans 8+ components.
- **Standard View is default** — recruiter-friendly layout first, SQL playground as bonus.
- **sql.js WASM** — zero server needed; full SQLite in the browser.
