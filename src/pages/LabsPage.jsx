// LabsPage.jsx — Full-screen animated slider for all 6 lab modules
// Each module is a SLIDE with smooth page-slide animation

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { LABS_CONTENT } from './LabsContent'
import '../labs.css'

/* ── Module metadata with info overlays ── */
const MODULES = [
  {
    id: 'mod-neural',
    slug: 'neural',
    name: 'Neural Core',
    tag: '01 / AI SIMULATION',
    emoji: '🧠',
    color: '#d97706',
    desc: 'An interactive AI model training simulation. Power on the Neural Core, ingest data sets, and watch your model train epoch-by-epoch. Monitor real-time terminal output, training progress gauge, and the neural orb\'s cognitive state. Pure browser-based machine learning theatre.',
    tech: ['Canvas API', 'GSAP', 'State Machine', 'Web Audio'],
  },
  {
    id: 'mod-brew',
    slug: 'brew',
    name: 'Mixology Lab',
    tag: '02 / FLUID PHYSICS',
    emoji: '🥃',
    color: '#f59e0b',
    desc: 'Advanced fluid dynamics simulation powered by CSS physics and canvas rendering. Select your spirit — Whiskey, Red Wine, or Vodka — add ice with real-time temperature drop, control H₂O dilution, and watch a physically accurate pour animation fill your glass. Built for the Jack Daniel\'s brand.',
    tech: ['CSS Physics', 'Canvas', 'GSAP', 'Web Audio'],
  },
  {
    id: 'mod-compiler',
    slug: 'compiler',
    name: 'Compiler',
    tag: '03 / BUILD PIPELINE',
    emoji: '⚙️',
    color: '#3ddc84',
    desc: 'A universal deployment pipeline visualizer. Hit "Initialize Build" and watch your source files — JS, TSX, CSS — get parsed, compiled, bundled, code-signed, and deployed simultaneously to iOS (arm64) and Android (AAB/APK) targets. Live terminal output and animated data-flow packets included.',
    tech: ['SVG Animation', 'GSAP', 'Canvas', 'State Machine'],
  },
  {
    id: 'mod-portfolio',
    slug: 'portfolio',
    name: 'InSeconds Suite',
    tag: '04 / PRODUCTS',
    emoji: '🚀',
    color: '#06b6d4',
    desc: 'Two battle-tested cold outreach products. InSeconds Pro is a Python FastAPI desktop engine that handles 50K+ leads with anti-spam cloaking, schema injection, and AI co-pilot scanning. InSeconds Extension is a Chrome Manifest V3 tool that physically operates Gmail like a human would — impossible to detect.',
    tech: ['Python', 'FastAPI', 'Chrome APIs', 'Firebase'],
  },
  {
    id: 'mod-music',
    slug: 'music',
    name: 'Spatial Audio',
    tag: '05 / MUSIC PLAYER',
    emoji: '🎵',
    color: '#a855f7',
    desc: 'A spatial audio player paired with an interactive Three.js astronaut model floating in zero gravity. Drag to rotate the 3D character, hit Start to load your local audio file, and watch the visualizer react in real time. Designed for headphone listening — the stereo field is calibrated for maximum immersion.',
    tech: ['Three.js', 'Web Audio API', 'WebGL', 'GSAP'],
  },
  {
    id: 'mod-entropy',
    slug: 'entropy',
    name: 'Entropy',
    tag: '06 / PARTICLE ENGINE',
    emoji: '💥',
    color: '#f97316',
    desc: 'A GPU-accelerated particle physics engine for pure creative expression. Thousands of particles spawn, collide, and dissolve into chaotic beauty — a cinematic finale that embodies the philosophy: Coding means creativity. Every render is unique. Every frame is art.',
    tech: ['Canvas API', 'Particle Physics', 'GSAP', 'WebGL'],
  },
]

// Theme map for each module's background
const MODULE_THEMES = {
  neural: 'data',
  brew: 'coffee',
  compiler: 'matrix',
  portfolio: 'geo',
  music: 'music',
  entropy: 'entropy',
}

export default function LabsPage() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [prevIdx, setPrevIdx] = useState(null)
  const [direction, setDirection] = useState(1) // 1=forward, -1=backward
  const [animating, setAnimating] = useState(false)
  const [showInfo, setShowInfo] = useState(true)
  const touchStartX = useRef(null)
  const scriptRef = useRef(null)
  const gsapLoadedRef = useRef(false)
  const legacyBootedRef = useRef(false)
  const bgCanvasRef = useRef(null)
  const bgEngineRef = useRef(null)

  /* ── Inject Tailwind CDN for lab module HTML ── */
  useEffect(() => {
    if (document.querySelector('[data-tailwind-labs]')) return
    const script = document.createElement('script')
    script.src = 'https://cdn.tailwindcss.com'
    script.setAttribute('data-tailwind-labs', '1')
    document.head.appendChild(script)

    return () => {
      // Don't remove tailwind — other pages may have loaded after
    }
  }, [])

  /* ── Load GSAP + FontAwesome + legacy JS once ── */
  useEffect(() => {
    if (legacyBootedRef.current) return
    legacyBootedRef.current = true

    const loadGSAP = () => new Promise((resolve) => {
      if (window.gsap) { resolve(); return }
      const s = document.createElement('script')
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js'
      s.onload = resolve
      document.head.appendChild(s)
    })

    const loadFA = () => {
      if (document.querySelector('[data-fa-loaded]')) return
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
      link.setAttribute('data-fa-loaded', '1')
      document.head.appendChild(link)
    }

    loadFA()
    loadGSAP().then(() => {
      const bootstrapLabs = () => {
        gsapLoadedRef.current = true
        if (window.initLabs && !window.__labsInitDone) {
          window.initLabs()
          window.__labsInitDone = true
        }
        if (window.BGEngine && bgCanvasRef.current) {
          window.BGEngine.canvas = bgCanvasRef.current
          window.BGEngine.init()
        }
        setTimeout(() => activateModule(0), 400)
      }

      if (window.initLabs) {
        bootstrapLabs()
        return
      }

      const script = document.createElement('script')
      script.src = '/labs_legacy.js'
      script.onload = bootstrapLabs
      document.body.appendChild(script)
      scriptRef.current = script
    })

    return () => {
      if (scriptRef.current?.parentNode) scriptRef.current.parentNode.removeChild(scriptRef.current)
    }
  }, [])

  /* ── Activate a module by calling legacy init ── */
  const activateModule = useCallback((idx) => {
    const mod = MODULES[idx]
    if (!mod) return

    // Switch BGEngine theme
    if (window.BGEngine) {
      window.BGEngine.setTheme(MODULE_THEMES[mod.slug] || 'galaxy')
    }

    const initFns = {
      neural: window.initNeuralCore,
      brew: window.initBrewLab,
      compiler: window.initCompiler,
      music: window.initMusic,
      entropy: window.initEntropy,
    }
    const fn = initFns[mod.slug]
    if (typeof fn === 'function') {
      try { fn() } catch (e) { console.warn('Module init error:', e) }
    }
  }, [])

  /* ── Navigate slides ── */
  const goTo = useCallback((idx) => {
    if (animating || idx === activeIdx) return
    setDirection(idx > activeIdx ? 1 : -1)
    setPrevIdx(activeIdx)
    setAnimating(true)
    setTimeout(() => {
      setActiveIdx(idx)
      setPrevIdx(null)
      setAnimating(false)
      activateModule(idx)
    }, 550)
  }, [activeIdx, animating, activateModule])

  const next = useCallback(() => { if (activeIdx < MODULES.length - 1) goTo(activeIdx + 1) }, [activeIdx, goTo])
  const prev = useCallback(() => { if (activeIdx > 0) goTo(activeIdx - 1) }, [activeIdx, goTo])

  /* ── Keyboard nav ── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next()
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  /* ── Touch/swipe ── */
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 50) { delta > 0 ? next() : prev() }
    touchStartX.current = null
  }

  const mod = MODULES[activeIdx]

  // Slide enter/exit classes
  const slideClass = (idx) => {
    if (idx === activeIdx) return animating ? `labs-slide labs-slide-entering labs-slide-enter-${direction > 0 ? 'right' : 'left'}` : 'labs-slide labs-slide-active'
    if (idx === prevIdx) return `labs-slide labs-slide-exiting labs-slide-exit-${direction > 0 ? 'left' : 'right'}`
    return 'labs-slide labs-slide-hidden'
  }

  return (
    <div
      className="labs-slider-page"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ── PARTICLE BACKGROUND CANVAS (used by BGEngine in labs_legacy.js) ── */}
      <canvas
        id="bg-canvas"
        ref={bgCanvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100dvh',
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.55,
        }}
      />

      {/* ── PREMIUM AURORA GRADIENT BACKGROUND (always visible) ── */}
      <div className="labs-aurora-bg" />

      {/* ── LEGACY CURSOR ELEMENTS expected by labs_legacy.js ── */}
      <div id="cursor-dot" className="cursor-dot" style={{ position: 'fixed', pointerEvents: 'none', zIndex: 10000, display: 'none' }} />
      <div id="cursor-outline" className="cursor-outline" style={{ position: 'fixed', pointerEvents: 'none', zIndex: 9999, display: 'none' }} />

      {/* ── TOP HUD ── */}
      <div className="labs-hud-top">
        <Link to="/" className="labs-back-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Hub
        </Link>

        <div className="labs-hud-center">
          <span className="labs-hud-tag" style={{ color: mod.color }}>
            {mod.tag}
          </span>
          <span className="labs-hud-title">{mod.name}</span>
        </div>

        <button
          className="labs-info-toggle"
          onClick={() => setShowInfo(!showInfo)}
          title="Toggle info panel"
        >
          {showInfo ? '✕' : 'ⓘ'}
        </button>
      </div>

      {/* ── SLIDES ── */}
      {MODULES.map((m, idx) => (
        <div key={m.id} className={slideClass(idx)}>
          <div id={m.id} className="module" dangerouslySetInnerHTML={{ __html: LABS_CONTENT[m.id] }}>
          </div>
        </div>
      ))}

      {/* ── INFO PANEL ── */}
      <div className={`labs-info-panel ${showInfo ? 'labs-info-visible' : 'labs-info-hidden'}`} style={{ '--mod-color': mod.color }}>
        <div className="labs-info-emoji">{mod.emoji}</div>
        <div className="labs-info-content">
          <p className="labs-info-desc">{mod.desc}</p>
          <div className="labs-info-tech">
            {mod.tech.map((t) => (
              <span key={t} className="labs-info-chip" style={{ borderColor: mod.color + '40', color: mod.color }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── LEFT ARROW ── */}
      <button
        className="labs-nav-arrow labs-nav-prev"
        onClick={prev}
        disabled={activeIdx === 0 || animating}
      >
        ‹
      </button>

      {/* ── RIGHT ARROW ── */}
      <button
        className="labs-nav-arrow labs-nav-next"
        onClick={next}
        disabled={activeIdx === MODULES.length - 1 || animating}
      >
        ›
      </button>

      {/* ── DOTS ── */}
      <div className="labs-dots">
        {MODULES.map((m, i) => (
          <button
            key={m.id}
            className={`labs-dot ${i === activeIdx ? 'labs-dot-active' : ''}`}
            onClick={() => goTo(i)}
            style={i === activeIdx ? { background: mod.color, boxShadow: `0 0 10px ${mod.color}` } : {}}
            title={m.name}
          />
        ))}
      </div>

      {/* ── MODULE COUNTER ── */}
      <div className="labs-counter">
        <span className="labs-counter-cur" style={{ color: mod.color }}>
          {String(activeIdx + 1).padStart(2, '0')}
        </span>
        <span className="labs-counter-sep">/</span>
        <span className="labs-counter-total">{String(MODULES.length).padStart(2, '0')}</span>
      </div>
    </div>
  )
}
