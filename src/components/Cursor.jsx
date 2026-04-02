// Cursor.jsx — Premium GSAP-powered cursor with mix-blend-mode difference
// Matches exact behavior from 3d-portfolio-main/src/components/Cursor.tsx

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    // Only render on non-touch pointer devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    const cursor = cursorRef.current
    if (!cursor) return

    let hover = false
    const mousePos = { x: 0, y: 0 }
    const cursorPos = { x: 0, y: 0 }

    document.addEventListener('mousemove', (e) => {
      mousePos.x = e.clientX
      mousePos.y = e.clientY
    })

    let rafId
    const loop = () => {
      rafId = requestAnimationFrame(loop)
      if (!hover) {
        const delay = 6
        cursorPos.x += (mousePos.x - cursorPos.x) / delay
        cursorPos.y += (mousePos.y - cursorPos.y) / delay
        cursor.style.transform = `translate(${cursorPos.x}px, ${cursorPos.y}px)`
      }
    }
    loop()

    // Hover interactions for data-cursor elements
    document.querySelectorAll('[data-cursor]').forEach((item) => {
      item.addEventListener('mouseover', (e) => {
        const target = e.currentTarget
        const rect = target.getBoundingClientRect()
        if (item.dataset.cursor === 'icons') {
          cursor.classList.add('cursor-icons')
          cursor.style.transform = `translate(${rect.left}px, ${rect.top}px)`
          cursor.style.setProperty('--cursorH', `${rect.height}px`)
          hover = true
        }
        if (item.dataset.cursor === 'disable') {
          cursor.classList.add('cursor-disable')
        }
      })
      item.addEventListener('mouseout', () => {
        cursor.classList.remove('cursor-disable', 'cursor-icons')
        hover = false
      })
    })

    // Enhanced interactions for links/buttons
    const addHover = () => {
      document.querySelectorAll('a, button').forEach((el) => {
        el.addEventListener('mouseenter', () => {
          cursor.classList.add('cursor-hover')
        })
        el.addEventListener('mouseleave', () => {
          cursor.classList.remove('cursor-hover')
        })
      })
    }
    addHover()

    // Re-run on DOM changes (for dynamically loaded content)
    const observer = new MutationObserver(addHover)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [])

  return (
    <div className="cursor-main" ref={cursorRef} />
  )
}
