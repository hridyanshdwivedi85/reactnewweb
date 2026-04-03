import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

/* ══════════════════════════════════════════════════
   PORTFOLIO PAGE
   • Cinematic gradient splash intro
   • All tools / products Hridyansh built
   • InSeconds Suite details from Labs
══════════════════════════════════════════════════ */

const TOOLS = [
  {
    id: 'inseconds-pro',
    category: 'PRODUCT · SAAS',
    emoji: '⚡',
    name: 'InSeconds Pro',
    tagline: 'Cold Outreach at Machine Scale',
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #0e7490 0%, #06b6d4 50%, #22d3ee 100%)',
    desc: 'A Python FastAPI desktop engine that handles 50,000+ leads with anti-spam cloaking, schema injection, and AI co-pilot scanning. Built to send cold emails at a scale that human operators simply cannot match.',
    tech: ['Python', 'FastAPI', 'Firebase', 'AI / LLM', 'SQLite', 'Tkinter'],
    highlights: [
      '50K+ leads processed per session',
      'Anti-spam cloaking & schema injection',
      'AI co-pilot scans every reply for intent',
      'Desktop GUI with real-time terminal',
    ],
    status: 'LIVE',
    statusColor: '#22c55e',
  },
  {
    id: 'inseconds-ext',
    category: 'PRODUCT · CHROME EXTENSION',
    emoji: '🧩',
    name: 'InSeconds Extension',
    tagline: 'Gmail Automation That Feels Human',
    color: '#a855f7',
    gradient: 'linear-gradient(135deg, #6d28d9 0%, #a855f7 50%, #d8b4fe 100%)',
    desc: 'A Chrome Manifest V3 tool that physically operates Gmail exactly like a human would — mouse events, keyboard input, realistic delays. Impossible to detect by anti-bot systems. Built on top of the browser native DOM.',
    tech: ['Chrome APIs', 'Manifest V3', 'JavaScript', 'Gmail DOM'],
    highlights: [
      'Operates Gmail like a real human user',
      'Zero API calls — pure DOM manipulation',
      'Undetectable by Gmail anti-bot systems',
      'Bulk personalised outreach in minutes',
    ],
    status: 'LIVE',
    statusColor: '#22c55e',
  }
]

/* ── Splash screen ── */
function PortfolioSplash({ onDone }) {
  const [phase, setPhase] = useState(0) // 0=fade-in word, 1=hold, 2=fade-out

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600)
    const t2 = setTimeout(() => setPhase(2), 2000)
    const t3 = setTimeout(() => onDone(), 2700)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px',
        background: 'radial-gradient(ellipse at 30% 40%, #1a0533 0%, #050510 50%, #000208 100%)',
        opacity: phase === 2 ? 0 : 1,
        transition: phase === 2 ? 'opacity 0.7s ease' : 'none',
        pointerEvents: phase === 2 ? 'none' : 'all',
        overflow: 'hidden',
      }}
    >
      {/* Animated gradient orbs */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '20%', left: '15%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)',
          animation: 'splashOrb1 4s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', right: '10%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)',
          animation: 'splashOrb2 5s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 65%)',
          animation: 'splashOrb3 6s ease-in-out infinite',
        }} />
      </div>

      {/* Main text */}
      <div style={{
        position: 'relative', zIndex: 2, textAlign: 'center',
        transform: phase >= 1 ? 'translateY(0)' : 'translateY(30px)',
        opacity: phase >= 1 ? 1 : 0,
        transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1), opacity 0.8s ease',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(0.6rem, 1.5vw, 0.8rem)',
          letterSpacing: '0.5em',
          color: 'rgba(6,182,212,0.7)',
          marginBottom: '16px',
          textTransform: 'uppercase',
        }}>
          Hridyansh Dwivedi
        </div>
        <div style={{
          fontFamily: 'var(--font-head)',
          fontSize: 'clamp(4rem, 12vw, 9rem)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 1,
          background: 'linear-gradient(135deg, #ffffff 0%, #a78bfa 40%, #06b6d4 70%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 0 60px rgba(124,58,237,0.4))',
        }}>
          PORTFOLIO
        </div>
        <div style={{
          width: '60%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.6), rgba(6,182,212,0.6), transparent)',
          margin: '20px auto 0',
          animation: phase >= 1 ? 'splashLine 0.8s ease 0.3s both' : 'none',
        }} />
      </div>
    </div>
  )
}

/* ── Tool Card ── */
function ToolCard({ tool, index }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="ptf-card"
      style={{
        '--card-color': tool.color,
        transitionDelay: `${(index % 3) * 80}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(32px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      {/* Card header gradient bar */}
      <div className="ptf-card-bar" style={{ background: tool.gradient }} />

      <div className="ptf-card-inner">
        {/* Top row */}
        <div className="ptf-card-top">
          <span className="ptf-card-emoji">{tool.emoji}</span>
          <div style={{ flex: 1 }}>
            <div className="ptf-card-category">{tool.category}</div>
            <h3 className="ptf-card-title">{tool.name}</h3>
            <div className="ptf-card-tagline">{tool.tagline}</div>
          </div>
          <span className="ptf-card-status" style={{ color: tool.statusColor, borderColor: tool.statusColor + '40', background: tool.statusColor + '10' }}>
            {tool.status}
          </span>
        </div>

        <p className="ptf-card-desc">{tool.desc}</p>

        {/* Highlights */}
        <ul className="ptf-card-highlights">
          {tool.highlights.map(h => (
            <li key={h}>
              <span style={{ color: tool.color }}>▸</span> {h}
            </li>
          ))}
        </ul>

        {/* Tech chips */}
        <div className="ptf-card-chips">
          {tool.tech.map(t => (
            <span key={t} className="ptf-chip" style={{ borderColor: tool.color + '30', color: tool.color }}>
              {t}
            </span>
          ))}
        </div>

        {/* Link if available */}
        {tool.link && (
          <Link to={tool.link} className="ptf-card-link" style={{ color: tool.color }}>
            Open Experience →
          </Link>
        )}
      </div>
    </div>
  )
}

export default function PortfolioPage() {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <div className="ptf-page">
      {/* Splash */}
      {showSplash && <PortfolioSplash onDone={() => setShowSplash(false)} />}

      <Navbar />

      {/* Hero */}
      <section className="ptf-hero">
        <div className="ptf-hero-bg">
          <div className="ptf-orb ptf-orb-1" />
          <div className="ptf-orb ptf-orb-2" />
          <div className="ptf-orb ptf-orb-3" />
        </div>
        <div className="ptf-hero-content">
          <div className="ptf-hero-tag">// EVERYTHING I'VE BUILT</div>
          <h1 className="ptf-hero-title">
            Tools &amp; <span>Products</span>
          </h1>
          <p className="ptf-hero-sub">
            From AI-powered outreach engines to GPU particle simulators —
            every project is a system designed to do what humans can't.
          </p>
          <div className="ptf-hero-stats">
            {[
              { n: '9', l: 'Projects' },
              { n: '50K+', l: 'Leads Processed' },
              { n: '3D', l: 'WebGL Experiences' },
              { n: '∞', l: 'Iterations' },
            ].map(s => (
              <div key={s.l} className="ptf-hero-stat">
                <span className="ptf-hero-stat-n">{s.n}</span>
                <span className="ptf-hero-stat-l">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <div className="ptf-grid-section">
        <div className="ptf-grid">
          {TOOLS.map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} index={i} />
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="ptf-cta">
        <div className="ptf-cta-text">Want to collaborate on something ambitious?</div>
        <a href="mailto:mannathridyanshdwivedi85@gmail.com" className="btn-primary">
          ✉ Get in Touch
        </a>
      </div>

      <style>{`
        @keyframes splashOrb1 {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(40px,-30px) scale(1.1); }
        }
        @keyframes splashOrb2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-50px,30px) scale(0.9); }
        }
        @keyframes splashOrb3 {
          0%,100% { transform: translate(-50%,-50%) scale(1); }
          50% { transform: translate(-50%,-50%) scale(1.15); }
        }
        @keyframes splashLine {
          from { transform: scaleX(0); opacity: 0; }
          to   { transform: scaleX(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
