import { useEffect, useRef } from 'react'
import { resumeData } from '../data/resume'

const PLANET_COLORS = [
  '#00FF88',
  '#67E8F9',
  '#FFB86C',
  '#C084FC',
  '#F87171',
  '#60A5FA',
  '#4ADE80',
  '#FF8A8A',
]

export default function SolarSystemBackground({ enabled }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let angle = 0

    const skills = resumeData.skills || []
    const planetCount = Math.min(skills.length, 8)

    if (planetCount === 0) return

    const planets = Array.from({ length: planetCount }, (_, i) => ({
      name: skills[i].skill,
      radius: 200 + i * 80,
      speed: 0.01 + i * 0.002,
      color: PLANET_COLORS[i % PLANET_COLORS.length],
      size: 8 + (i % 3) * 3,
      startAngle: (i / planetCount) * Math.PI * 2,
      nameWidth: skills[i].skill.length * 8,
    }))

    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      const w = window.innerWidth
      const h = window.innerHeight
      dpr = w < 768 ? 1 : Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
    }

    function drawSun(cx, cy) {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 70)
      g.addColorStop(0, 'rgba(0,255,136,0.18)')
      g.addColorStop(0.5, 'rgba(0,255,136,0.06)')
      g.addColorStop(1, 'rgba(0,255,136,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(cx, cy, 70, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = 'rgba(0,255,136,0.8)'
      ctx.beginPath()
      ctx.arc(cx, cy, 4, 0, Math.PI * 2)
      ctx.fill()
    }

    function draw() {
      const w = window.innerWidth
      const h = window.innerHeight
      const cx = w / 2
      const cy = h / 2

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      if (w < 600) {
        animId = requestAnimationFrame(draw)
        angle += 0.008
        return
      }

      drawSun(cx, cy)

      for (const p of planets) {
        const a = angle * p.speed + p.startAngle
        const x = cx + Math.cos(a) * p.radius
        const y = cy + Math.sin(a) * p.radius * 0.4

        ctx.strokeStyle = p.color + '20'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.ellipse(cx, cy, p.radius, p.radius * 0.4, 0, 0, Math.PI * 2)
        ctx.stroke()

        const glow = ctx.createRadialGradient(x, y, 0, x, y, p.size * 4)
        glow.addColorStop(0, p.color + '40')
        glow.addColorStop(1, p.color + '00')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(x, y, p.size * 4, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(x, y, p.size, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#7C8CA5'
        ctx.font = '12px JetBrains Mono, monospace'
        ctx.textAlign = 'left'
        ctx.fillText(p.name, x + p.size + 10, y + 5)
      }

      angle += 0.008
      animId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)

    if (enabled) {
      draw()
    } else {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [enabled])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
