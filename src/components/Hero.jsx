import React, { Suspense, lazy, useEffect, useState } from 'react'
import UnicornScene from 'unicornstudio-react'

const CharacterScene = lazy(() => import('./CharacterScene'))

function canRenderHeavyHero() {
  if (typeof window === 'undefined') return true
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const saveDataEnabled = Boolean(navigator.connection?.saveData)
  return !prefersReducedMotion && !saveDataEnabled
}

export default function Hero() {
  const [allowHeavyEffects, setAllowHeavyEffects] = useState(canRenderHeavyHero)
  const [typedRole, setTypedRole] = useState('')
  const roleText = 'CEO && DEVELOPER'

  useEffect(() => {
    const update = () => setAllowHeavyEffects(canRenderHeavyHero())
    update()
    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    let i = 0
    let timer
    let cancelled = false

    const tick = () => {
      if (cancelled) return
      setTypedRole(roleText.slice(0, i))
      if (i < roleText.length) {
        i += 1
        timer = setTimeout(tick, 85)
      } else {
        timer = setTimeout(() => {
          i = 0
          tick()
        }, 1400)
      }
    }

    timer = setTimeout(tick, 400)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [])

  return (
    <section className="landing-section" id="landingDiv" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background UnicornStudio animation */}
      {allowHeavyEffects ? (
        <div id="unicorn-wrapper" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <UnicornScene
            projectId="7bzzYJGvMvu0GRawnv9y"
            width="100%"
            height="100%"
            scale={1}
            dpi={1.25}
            sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@2.1.6/dist/unicornStudio.umd.js"
          />
        </div>
      ) : (
        <div className="hero-fallback-bg" aria-hidden="true" />
      )}

      {/* Background circles from the new design */}
      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade" style={{ zIndex: 1 }}></div>

      <div className="landing-container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="landing-intro">
          <h2>Hello! I'm</h2>
          <h1>
            HRIDYANSH
            <br />
            <span>DWIVEDI</span>
          </h1>
        </div>

        <div className="landing-info">
          <div className="hero-cmd-box" aria-label="role terminal">
            <div className="hero-cmd-head">
              <span className="hero-dot hero-dot-close" />
              <span className="hero-dot hero-dot-min" />
              <span className="hero-dot hero-dot-max" />
              <span className="hero-cmd-title">portfolio-terminal</span>
            </div>
            <div className="hero-cmd-body">
              <p><span className="hero-prompt">$</span> whoami</p>
              <p className="hero-cmd-output">{typedRole}<span className="hero-caret">▌</span></p>
            </div>
          </div>
        </div>
      </div>

      {allowHeavyEffects ? (
        <Suspense fallback={null}>
          <CharacterScene />
        </Suspense>
      ) : null}
    </section>
  )
}
