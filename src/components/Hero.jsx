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

  useEffect(() => {
    const update = () => setAllowHeavyEffects(canRenderHeavyHero())
    update()
    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
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
          <h3>CEO &</h3>
          <h2 style={{ 
            color: '#14b8a6', 
            fontFamily: 'var(--font-head)', 
            fontWeight: 800, 
            margin: 0,
            marginTop: '-5px',
            fontSize: 'clamp(3rem, 5vw, 4.5rem)',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            DEVELOPER
          </h2>
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
