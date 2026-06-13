export default function ViewToggle({ standardView, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={standardView ? 'Switch to technical (SQL terminal) view' : 'Switch to standard view'}
      style={{
        position: 'fixed',
        bottom: 100,
        right: 20,
        zIndex: 999,
        padding: '8px 14px',
        borderRadius: 20,
        border: '1px solid rgba(0,255,136,0.25)',
        background: 'rgba(8,12,24,0.85)',
        backdropFilter: 'blur(8px)',
        color: '#E2E8F0',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 12,
        lineHeight: 1,
        transition: 'all 0.2s ease',
        opacity: 0.7,
        letterSpacing: '0.02em',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7' }}
    >
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: standardView ? 'rgba(255,255,255,0.08)' : 'rgba(0,255,136,0.15)',
        color: standardView ? '#7C8CA5' : '#00FF88',
        fontSize: 11,
        fontWeight: 700,
        flexShrink: 0,
      }}>
        {standardView ? '>' : '≡'}
      </span>
      <span style={{ whiteSpace: 'nowrap' }}>
        {standardView ? 'Standard View' : 'Technical View'}
      </span>
      <span style={{ color: '#7C8CA5', fontSize: 11 }}>
        {standardView ? '(click for SQL)' : '(click for default)'}
      </span>
    </button>
  )
}
