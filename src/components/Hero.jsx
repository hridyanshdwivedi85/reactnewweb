import React, { Suspense, lazy, useEffect, useState, useRef } from 'react'
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
  const [unicornVisible, setUnicornVisible] = useState(true)
  const [initialDims, setInitialDims] = useState({ w: '100%', h: '100%' })
  const sectionRef = useRef(null)
  const roleText = 'CEO && DEVELOPER'

  useEffect(() => {
    // Lock dimensions on mount to prevent mobile resize chaos
    if (typeof window !== 'undefined') {
      setInitialDims({ w: window.innerWidth, h: window.innerHeight })
    }
  }, [])

  // Hide UnicornStudio when scrolled past hero to prevent mobile resize crashes
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const heroHeight = sectionRef.current.offsetHeight
      setUnicornVisible(window.scrollY < heroHeight * 1.5)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setAllowHeavyEffects(canRenderHeavyHero())
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleMotionPrefChange = () => setAllowHeavyEffects(canRenderHeavyHero())
    if (typeof reducedMotionQuery.addEventListener === 'function') {
      reducedMotionQuery.addEventListener('change', handleMotionPrefChange)
      return () => reducedMotionQuery.removeEventListener('change', handleMotionPrefChange)
    }
    reducedMotionQuery.addListener(handleMotionPrefChange)
    return () => reducedMotionQuery.removeListener(handleMotionPrefChange)
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
        timer = setTimeout(() => { i = 0; tick() }, 1400)
      }
    }
    timer = setTimeout(tick, 400)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [])

  return (
    <section className="landing-section" id="landingDiv" ref={sectionRef}>
      {/* Background UnicornStudio animation */}
      {allowHeavyEffects ? (
        <div
          id="unicorn-wrapper"
          className="hero-bg-layer"
          style={{
            width: typeof initialDims.w === 'number' ? `${initialDims.w}px` : '100%',
            height: typeof initialDims.h === 'number' ? `${initialDims.h}px` : '100%',
            visibility: unicornVisible ? 'visible' : 'hidden',
            opacity: unicornVisible ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
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
        <div className="hero-fallback-bg hero-bg-layer" aria-hidden="true" />
      )}

      {/* Background circles */}
      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade" style={{ zIndex: 1 }}></div>

      <div className="landing-container">
        <div className="landing-intro">
          <h2>Hello! I'm</h2>
          <h1>
            HRIDYANSH
            <br />
            <span>DWIVEDI</span>
          </h1>
        </div>

        <div className="landing-info">
          <div className="hero-cmd-box hero-cmd-box-mobile" aria-label="role terminal">
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
