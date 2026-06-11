const SUGGESTIONS = [
  { label: 'View my profile', query: 'SELECT * FROM profile' },
  { label: 'Expert skills', query: "SELECT * FROM skills WHERE proficiency = 'Expert'" },
  { label: 'Databricks experience', query: "SELECT * FROM experience WHERE tech_used LIKE '%Databricks%'" },
  { label: 'Skills by category', query: 'SELECT category, COUNT(*) FROM skills GROUP BY category' },
  { label: 'Resume overview', query: "SELECT * FROM resume WHERE section = 'Skills' OR section = 'Experience'" },
  { label: 'Show all tables', query: 'SHOW TABLES' },
]

export default function SuggestedQueries({ onSelect }) {
  return (
    <div className="suggested">
      <span className="suggested-label">Try:</span>
      <div className="suggested-chips">
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            className="suggested-chip"
            onClick={() => onSelect(s.query)}
            title={s.query}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
