import { useRef, useEffect } from 'react'

export default function MusicToggle({ enabled, onToggle }) {
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (enabled) {
      audio.volume = 0.3
      audio.loop = true
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [enabled])

  return (
    <>
      <audio ref={audioRef} src="/bg-music.mp3" preload="none" />
      <button
        onClick={onToggle}
        aria-label={enabled ? 'Pause background music' : 'Play background music'}
        style={{
          position: 'fixed',
          bottom: 60,
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
          background: enabled ? 'rgba(0,255,136,0.15)' : 'rgba(255,255,255,0.05)',
          color: enabled ? '#00FF88' : '#4B5670',
          fontSize: 11,
          flexShrink: 0,
        }}>
          {enabled ? '♫' : '♪'}
        </span>
        <span style={{ whiteSpace: 'nowrap' }}>
          {enabled ? 'Music On' : 'Music Off'}
        </span>
      </button>
    </>
  )
}
