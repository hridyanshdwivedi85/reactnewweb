import { useEffect, useRef, useState } from 'react'

const stats = [
  { number: 50, suffix: '+', label: 'Projects Shipped' },
  { number: 3, suffix: '+', label: 'Years Experience' },
  { number: 4, suffix: 'K', label: 'LinkedIn Followers' },
  { number: 99, suffix: '%', label: 'Passion Level' },
]

function AnimatedNumber({ target, suffix }) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const animated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true
          const duration = 1800
          const start = performance.now()
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(Math.round(target * eased))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref} className="stat-number">
      {value}{suffix}
    </span>
  )
}

export default function Stats() {
  return (
    <div className="stats-bar">
      <div className="stats-bar-inner">
        {stats.map((s) => (
          <div key={s.label} className="stat-item">
            <AnimatedNumber target={s.number} suffix={s.suffix} />
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
