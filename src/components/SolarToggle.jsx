export default function SolarToggle({ enabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={enabled ? 'Disable solar system animation' : 'Enable solar system animation'}
      title={enabled ? 'Disable animation' : 'Enable animation'}
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 999,
        width: 36,
        height: 36,
        borderRadius: '50%',
        border: '1px solid rgba(0,255,136,0.3)',
        background: enabled ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,255,0.05)',
        color: enabled ? '#00FF88' : '#4B5670',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 14,
        lineHeight: 1,
        transition: 'all 0.2s ease',
        opacity: 0.5,
        backdropFilter: 'blur(4px)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.5' }}
    >
      {enabled ? '◉' : '○'}
    </button>
  )
}
