import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { label: 'HOME',      path: '/' },
  { label: 'CELESTIAL', path: '/celestial' },
  { label: 'BRANDING',  path: '/branding' },
  { label: 'PORTFOLIO', path: '/portfolio' },
  { label: 'LABS',      path: '/labs' },
]

export default function Navbar({ onDinoTrigger }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [logoClickCount, setLogoClickCount] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const go = (path) => {
    if (path.startsWith('#')) {
      const el = document.querySelector(path)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(path)
    }
    setMenuOpen(false)
  }

  // Triple-click logo to trigger Dino Easter Egg
  const handleLogoClick = () => {
    const count = logoClickCount + 1
    setLogoClickCount(count)
    if (count === 1) {
      go('/')
    }
    if (count >= 3) {
      setLogoClickCount(0)
      if (onDinoTrigger) onDinoTrigger()
    }
    setTimeout(() => setLogoClickCount(0), 1500)
  }

  return (
    <>
      <nav className="navbar" style={scrolled ? { boxShadow: '0 4px 30px rgba(0,0,0,0.5)' } : {}}>
        {/* Logo — triple click = dino easter egg */}
        <button className="navbar-logo" onClick={handleLogoClick} style={{ background: 'none', border: 'none', cursor: 'pointer' }} title="Click fast 3x for a surprise">
          HD<span>.</span>{logoClickCount >= 2 ? <span style={{fontSize:'0.5rem',marginLeft:'4px',opacity:0.6}}>🦕</span> : null}
        </button>

        {/* Desktop links */}
        <div className="navbar-links">
          {NAV_ITEMS.map(item => (
            <button
              key={item.label}
              className={`nav-pill ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => go(item.path)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* LinkedIn CTA (desktop) */}
        <div className="navbar-cta" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a
            href="https://in.linkedin.com/in/hridyanshd85"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '999px',
              background: 'rgba(10,102,194,0.15)',
              border: '1px solid rgba(10,102,194,0.35)',
              color: '#60a5fa',
              fontFamily: 'var(--font-head)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              transition: 'all 0.25s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(10,102,194,0.3)'; e.currentTarget.style.color='#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(10,102,194,0.15)'; e.currentTarget.style.color='#60a5fa' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2" fill="currentColor"/></svg>
            LinkedIn
          </a>

          {/* Hamburger (mobile) */}
          <button
            className="navbar-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{ marginLeft: '4px' }}
          >
            <span className="hamburger-line" style={menuOpen ? { transform: 'rotate(45deg) translate(4px,4px)' } : {}} />
            <span className="hamburger-line" style={menuOpen ? { opacity: 0 } : {}} />
            <span className="hamburger-line" style={menuOpen ? { transform: 'rotate(-45deg) translate(4px,-4px)' } : {}} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.label}
            className={`mobile-nav-pill ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => go(item.path)}
          >
            {item.label}
          </button>
        ))}
        <a
          href="https://in.linkedin.com/in/hridyanshd85"
          target="_blank"
          rel="noreferrer"
          className="mobile-nav-pill"
          style={{ color: '#60a5fa' }}
        >
          LinkedIn →
        </a>
      </div>
    </>
  )
}
