const btnStyle = {
  position: 'fixed',
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
}

const dotStyle = (active) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 18,
  height: 18,
  borderRadius: '50%',
  background: active ? 'rgba(0,255,136,0.15)' : 'rgba(255,255,255,0.05)',
  color: active ? '#00FF88' : '#4B5670',
  fontSize: 10,
  flexShrink: 0,
})

export default function SolarToggle({ enabled, onToggle, standardView, onToggleView }) {
  if (standardView) {
    return (
      <button
        onClick={onToggleView}
        aria-label="Switch to technical view"
        style={{ ...btnStyle, bottom: 20, right: 20 }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7' }}
      >
        <span style={dotStyle(true)}>◈</span>
        <span style={{ whiteSpace: 'nowrap' }}>Technical</span>
      </button>
    )
  }

  return (
    <>
      <button
        onClick={onToggleView}
        aria-label="Switch to standard view"
        style={{ ...btnStyle, bottom: 80, right: 20 }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7' }}
      >
        <span style={dotStyle(true)}>≡</span>
        <span style={{ whiteSpace: 'nowrap' }}>Standard</span>
      </button>
      <button
        onClick={onToggle}
        aria-label={enabled ? 'Disable solar system animation' : 'Enable solar system animation'}
        style={{ ...btnStyle, bottom: 20, right: 20 }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7' }}
      >
        <span style={dotStyle(enabled)}>
          {enabled ? '◉' : '○'}
        </span>
        <span style={{ whiteSpace: 'nowrap' }}>
          {enabled ? 'Planets On' : 'Planets Off'}
        </span>
      </button>
    </>
  )
}
