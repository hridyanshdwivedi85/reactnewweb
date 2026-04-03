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
          {projects.map((p) => (
            <a
              key={p.number}
              className="work-list-item"
              href={p.href || p.route || '#'}
              target={p.external ? '_blank' : '_self'}
              rel="noreferrer"
              onClick={(e) => handleClick(p, e)}
              style={{ '--project-accent': p.accent }}
            >
              {/* Number */}
              <span className="work-list-number">{p.number}</span>

              {/* Info */}
              <div className="work-list-content">
                <p className="work-list-category">{p.category}</p>
                <h3 className="work-list-title">{p.title}</h3>
                <p className="work-list-desc">{p.desc}</p>
              </div>

              {/* Stack + Arrow */}
              <div className="work-list-meta">
                <span className="work-list-arrow">↗</span>
                <div className="work-list-stack">
                  {p.stack.map(s => (
                    <span key={s} className="work-list-tag">{s}</span>
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
