export default function SolarToggle({ enabled, onToggle, standardView, onToggleView }) {
  if (standardView) {
    return (
      <button
        onClick={onToggleView}
        aria-label="Switch to technical (SQL terminal) view"
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 999,
          padding: '14px 18px',
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
          background: 'rgba(0,255,136,0.15)',
          color: '#00FF88',
          fontSize: 10,
          flexShrink: 0,
        }}>
          ◈
        </span>
        <span style={{ whiteSpace: 'nowrap' }}>Technical</span>
      </button>
    )
  }

  return (
    <button
      onClick={onToggle}
      aria-label={enabled ? 'Disable solar system animation' : 'Enable solar system animation'}
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 999,
        padding: '14px 18px',
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
        background: enabled ? 'rgba(0,255,136,0.15)' : 'rgba(255,255,255,0.05)',
        color: enabled ? '#00FF88' : '#4B5670',
        fontSize: 10,
        flexShrink: 0,
      }}>
        {enabled ? '◉' : '○'}
      </span>
      <span style={{ whiteSpace: 'nowrap' }}>
        {enabled ? 'Planets On' : 'Planets Off'}
      </span>
    </button>
  )
}
