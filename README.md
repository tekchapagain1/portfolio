# Portfolio — Interactive ETL Developer Resume

A terminal-themed interactive portfolio for Tek Chapagain, an ETL Developer. Visitors explore the resume via **SQL queries** against an in-browser SQLite database, or switch to a **Standard View** for a professional card-layout experience. Deployed at **[tekchapagain.com.np](https://tekchapagain.com.np)**.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Database | sql.js (SQLite compiled to WASM, runs in-browser) |
| Font | JetBrains Mono (deferred, non-render-blocking) |
| Deployment | GitHub Pages |
| Dependencies | `react`, `react-dom`, `sql.js` only |

## Features

### Dual View Mode
- **Technical View** — SQL terminal interface with a query-block hero, `.db`-style section headers (`TABLE / -- skills`), a statusbar, and SQL-themed footer. The hero displays a live query result table.
- **Standard View** — Non-technical friendly: hero switches to an intro card with avatar, summary, and 4-column highlights grid. Section headers become `<h2>` elements. Nav shows name instead of prompt. Footer is simplified copyright.
- Preference persisted in `localStorage`.

### Interactive SQL Playground
A live query interface using sql.js. Visitors can run `SELECT`, `SHOW TABLES`, `GROUP BY`, `ORDER BY`, and aggregate queries against the resume dataset. Pre-built chip templates for quick exploration.

### Canvas Solar System
A subtle background animation of 8 planets orbiting at radii 200–760px, each named after a skill (e.g., Python, SQL, Spark). Low opacities keep it ambient. Toggle on/off via a pill button.

### Background Music
Lo-fi royalty-free track ("Good Night - Lofi Cozy Chill Music" by FASSounds, Pixabay). Plays at 30% volume, loops, preload="none". Toggle on/off via a pill button.

### Performance Optimizations
- Google Fonts loaded with `media="print" onload="this.media='all'"` (non-render-blocking)
- Below-fold sections (`SkillsSection`, `ExperienceSection`, `EducationSection`, `CertificationsSection`, `ContactSection`, `QueryPlayground`) lazy-loaded via `React.lazy()`
- Font CSS preloaded with `rel="preload" as="style"`
- FCP improved from 3.6s → ~1.8s

### Accessibility
- Dark-theme `--text-muted` contrast ratio: 5.72:1 (was 3.9:1)
- Light-theme `--text-muted` contrast ratio: 4.96:1 (was 2.8:1)
- Button text contrast: `.btn-primary` text set to `#080C18` (14:1 on dark bg)
- Touch targets minimum 44px on mobile
- `aria-live` region on query output

### Responsive Design
Breakpoints at 768px and 480px:
- Touch-friendly targets (min 44px)
- Stacked toggle buttons
- 2-column stats/highlights grids
- Horizontally scrollable `.query-block` on mobile (overflow-x: auto)
- Reduced padding, smaller font sizes

## Project Structure

```
portfolio/
├── public/
│   ├── favicon.svg          # Database-cylinder SVG in #00FF88
│   └── bg-music.mp3         # Lo-fi background track (4.5 MB)
├── src/
│   ├── components/
│   │   ├── Hero.jsx              # Query-block ↔ standard intro card
│   │   ├── Nav.jsx               # Sticky nav with prompt/name
│   │   ├── Footer.jsx            # SQL-themed ↔ copyright
│   │   ├── SectionHeader.jsx     # ViewContext-aware section header
│   │   ├── SolarSystemBackground.jsx  # Canvas solar system animation
│   │   ├── SolarToggle.jsx       # Pill toggle for solar system
│   │   ├── MusicToggle.jsx       # Pill toggle for background music
│   │   ├── ViewToggle.jsx        # Pill toggle for view mode
│   │   ├── SkillsSection.jsx     # Lazy-loaded
│   │   ├── ExperienceSection.jsx # Lazy-loaded
│   │   ├── EducationSection.jsx  # Lazy-loaded
│   │   ├── CertificationsSection.jsx # Lazy-loaded
│   │   ├── QueryPlayground.jsx   # Lazy-loaded interactive SQL
│   │   └── ContactSection.jsx    # Lazy-loaded
│   ├── data/
│   │   ├── resume.json           # Source of truth for all resume data
│   │   └── resume.js             # Helper to import/export JSON
│   ├── utils/
│   │   ├── ViewContext.jsx       # React Context for standardView
│   │   ├── realSqlExecutor.js    # sql.js wrapper (init, execute)
│   │   └── sqlParser.js          # Tokenizer + recursive-descent parser
│   ├── styles/
│   │   └── resume.css            # All styles (theme, layout, mobile)
│   └── App.jsx                   # Root: lazy imports, toggles, ViewContext provider
├── dist/
│   └── portfolio-review.html     # Self-contained single-file review build
├── vite.config.js
└── package.json
```

## Getting Started

```bash
npm install
npm run dev        # Development server
npm run build      # Production build → dist/
npm run preview    # Preview the production build
npm run lint       # ESLint
```

## Data Model

The resume data lives in `src/data/resume.json`. The SQL engine exposes these tables:

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

Edit `src/data/resume.json` with your own information. The UI reads from this single source — no code changes required. To change the background music, replace `public/bg-music.mp3` and update the source in `MusicToggle.jsx`.

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
- **Pill-shaped toggles with text labels** — clarity over icon-only circles.
- **8 planets max** from 14 skills — avoids visual clutter in solar system.
- **sql.js WASM** — zero server needed; full SQLite in the browser.
