import { useNavigate } from 'react-router-dom'

const projects = [
  {
    number: '01',
    category: 'Desktop App · Cold Outreach',
    title: 'InSeconds Pro',
    desc: 'Python FastAPI desktop engine handling 50,000+ leads. Anti-spam, schema injection, AI co-pilot.',
    stack: ['Python', 'FastAPI', 'Firebase', 'HTMX'],
    href: 'https://wa.me/916393972524?text=Hi%20Hridyansh,%20I%27m%20interested%20in%20InSeconds%20Pro!',
    accent: '#60a5fa',
    external: true,
  },
  {
    number: '02',
    category: 'Chrome Extension · Gmail Automation',
    title: 'InSeconds Extension',
    desc: 'Manifest V3 browser extension. Virtual assistant inside Gmail — auto-compose, follow-ups, A/B testing.',
    stack: ['Vanilla JS', 'Firebase', 'Firestore', 'Chrome APIs'],
    href: 'https://wa.me/916393972524?text=Hi%20Hridyansh,%20I%27m%20interested%20in%20InSeconds%20Extension!',
    accent: '#a78bfa',
    external: true,
  },
  {
    number: '03',
    category: 'Interactive · 3D Simulation',
    title: 'Celestial Engine',
    desc: 'Three.js powered interactive solar system — 6 planets, volumetric sun shader, bloom, asteroid belt, telemetry panel.',
    stack: ['Three.js', 'WebGL', 'GLSL', 'Canvas'],
    route: '/celestial',
    accent: '#6ee7b7',
  },
  {
    number: '04',
    category: 'Branding · Advertising',
    title: 'Advertising Engine',
    desc: 'High-end interactive branding portfolio — 10 luxury product campaigns from Nike to GTA VI.',
    stack: ['GSAP', 'React', 'CSS3', 'Canvas'],
    route: '/branding',
    accent: '#fbbf24',
  },
  {
    number: '05',
    category: 'Creative · Interactive Lab',
    title: 'The Labs',
    desc: 'Six live experiments: Neural Engine, Whisky Brewer, Compiler, Entropy, Music Visualizer & Celestial preview.',
    stack: ['Canvas API', 'Web Audio', 'Physics', 'React'],
    route: '/labs',
    accent: '#34d399',
  },
]

export default function Work() {
  const navigate = useNavigate()

  const handleClick = (p, e) => {
    if (p.route) {
      e.preventDefault()
      navigate(p.route)
    }
  }

  return (
    <section className="section" id="work">
      <div className="section-container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '56px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div className="section-tag">Selected Work</div>
            <h2 className="section-title">What I've <span>Built.</span></h2>
          </div>
          <a
            href="#contact"
            className="btn-outline"
            onClick={e => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }}
          >
            All Projects →
          </a>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {projects.map((p, i) => (
            <a
              key={p.number}
              href={p.href || p.route || '#'}
              target={p.external ? '_blank' : '_self'}
              rel="noreferrer"
              onClick={(e) => handleClick(p, e)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                padding: '28px 24px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                background: 'var(--bg-card)',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = p.accent + '55'; e.currentTarget.style.transform = 'translateX(8px)'; e.currentTarget.style.background = 'var(--bg-elevated)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = 'var(--bg-card)' }}
            >
              {/* Number */}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.1em', minWidth: '24px' }}>{p.number}</span>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: p.accent, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>{p.category}</p>
                <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '6px' }}>{p.title}</h3>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{p.desc}</p>
              </div>

              {/* Stack + Arrow */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', flexShrink: 0 }}>
                <span style={{ fontSize: '1.2rem', color: p.accent, opacity: 0.7 }}>↗</span>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '200px' }}>
                  {p.stack.map(s => (
                    <span key={s} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', padding: '3px 7px', borderRadius: '4px', color: p.accent, background: `${p.accent}10`, border: `1px solid ${p.accent}25`, letterSpacing: '0.06em' }}>{s}</span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
