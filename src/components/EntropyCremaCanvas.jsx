import React, { useRef, useEffect } from 'react'

export default function EntropyCremaCanvas({ active }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!active) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationFrameId;

    let W = canvas.width = canvas.offsetWidth
    let H = canvas.height = canvas.offsetHeight

    const particles = []
    const particleCount = window.innerWidth < 768 ? 60 : 120
    const mouse = { x: -1000, y: -1000 }

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 2 + 1
      })
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, W, H)

      // Update & Draw
      for (let i = 0; i < particleCount; i++) {
        let p = particles[i]
        p.x += p.vx
        p.y += p.vy

        // Attraction to mouse
        if (mouse.x > 0) {
          let dx = mouse.x - p.x
          let dy = mouse.y - p.y
          let dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 400 && dist > 20) {
            p.vx += (dx / dist) * 0.05
            p.vy += (dy / dist) * 0.05
          }
        }

        // Friction
        p.vx *= 0.98
        p.vy *= 0.98

        // Constant movement
        p.vx += (Math.random() - 0.5) * 0.2
        p.vy += (Math.random() - 0.5) * 0.2

        if (p.x < 0) { p.x = 0; p.vx *= -1 }
        if (p.x > W) { p.x = W; p.vx *= -1 }
        if (p.y < 0) { p.y = 0; p.vy *= -1 }
        if (p.y > H) { p.y = H; p.vy *= -1 }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(217, 119, 6, 0.9)' // Crema orange color
        ctx.fill()

        // Link with mouse
        let dxMouse = mouse.x - p.x
        let dyMouse = mouse.y - p.y
        let distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)
        if (distMouse < 150) {
          ctx.beginPath()
          ctx.strokeStyle = `rgba(217, 119, 6, ${1 - distMouse / 150})`
          ctx.lineWidth = 1
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
        }

        // Link with other particles
        for (let j = i + 1; j < particleCount; j++) {
          let p2 = particles[j]
          let dx = p2.x - p.x
          let dy = p2.y - p.y
          let dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - dist / 100) * 0.3})`
            ctx.lineWidth = 0.5
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

      // Draw crosshair at mouse
      if (mouse.x > 0 && mouse.y > 0) {
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)'
        ctx.lineWidth = 1
        ctx.moveTo(mouse.x - 12, mouse.y)
        ctx.lineTo(mouse.x + 12, mouse.y)
        ctx.moveTo(mouse.x, mouse.y - 12)
        ctx.lineTo(mouse.x, mouse.y + 12)
        ctx.stroke()

        ctx.beginPath()
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
        ctx.lineWidth = 1
        ctx.arc(mouse.x, mouse.y, 18, 0, Math.PI * 2)
        ctx.stroke()
      }

      animationFrameId = requestAnimationFrame(drawParticles)
    }

    drawParticles()

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }
    const handleResize = () => {
      W = canvas.width = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', handleResize)
    }
  }, [active])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: '#0a0a0a', overflow: 'hidden' }}>
      <canvas 
        ref={canvasRef} 
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} 
      />
      
      {/* ── TYPOGRAPHY OVERLAY ── */}
      <div style={{ 
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
        zIndex: 2, textAlign: 'center', pointerEvents: 'none', width: '90%', maxWidth: '900px'
      }}>
        <h1 style={{ 
          fontFamily: '"Playfair Display", serif', fontSize: 'clamp(3rem, 10vw, 8rem)', 
          color: '#e5e5e5', margin: 0, letterSpacing: '-2px', lineHeight: 1 
        }}>
          Coding means
        </h1>
        <h2 style={{ 
          fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: 'clamp(3rem, 10vw, 8rem)', 
          color: '#f97316', margin: 0, letterSpacing: '-1px', lineHeight: 1 
        }}>
          creativity.
        </h2>
        
        <p style={{ 
          fontFamily: '"Space Grotesk", sans-serif', fontSize: '13px', color: '#b3b3b3', 
          letterSpacing: '2px', textTransform: 'uppercase', marginTop: '30px', lineHeight: 1.8, 
          margin: '30px auto 0', maxWidth: '500px', fontWeight: 500
        }}>
          SYSTEM ARCHITECT & BUSINESS ENGINEER
        </p>

        <div style={{ 
          marginTop: '60px', fontFamily: '"JetBrains Mono", monospace', color: '#f97316', 
          fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase'
        }}>
          PRESENTED BY HRIDYANSH
        </div>
      </div>
    </div>
  )
}
