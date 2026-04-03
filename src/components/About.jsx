import { useEffect, useRef, useState } from 'react'

/* ══════════════════════════════════════════════════
   ABOUT SECTION — Advanced with:
   • AI Avatar using DiceBear API (Adventurer style)
   • LinkedIn card (same as index.html)
   • GSAP-inspired scroll reveal via IntersectionObserver
   • Timeline of experience
   • Tech skills grid
   • No Beeyond Digital
══════════════════════════════════════════════════ */

const LINKEDIN_URL = 'https://in.linkedin.com/in/hridyanshd85'
const AVATAR_URL = `https://api.dicebear.com/7.x/adventurer/svg?seed=Hridyansh&backgroundColor=0a0a0f&eyebrows=variant08&eyes=variant17&mouth=variant26&skinColor=b68655&hair=long01&hairColor=2c1b18&radius=50`

const timeline = [
  { year: 'Present', role: 'System Architect & Vibe Coder', company: 'Independent', desc: 'Pioneering advanced "vibe coding" methodologies. Architecting and deploying sophisticated custom tools and AI-driven workflows to engineer modern software solutions.', color: '#7c3aed' },
  { year: '2023 – 2024', role: 'Founder & Lead Generation Specialist', company: 'Digital Consulting', desc: 'Engineered scalable digital marketing strategies as an independent consultant, successfully driving and converting 10,000+ high-quality B2B leads.', color: '#2563eb' },
  { year: '2022', role: 'Business Development Manager', company: 'B2B Sales', desc: 'Spearheaded full-cycle sales processes. Drove substantial revenue growth through strategic deal closures and high-level stakeholder negotiations.', color: '#059669' },
  { year: '2021', role: 'Business Development Executive', company: 'International Sales', desc: 'Managed global client relations across the US and Canada. Successfully generated and orchestrated high-value client acquisition meetings.', color: '#d97706' },
]

const skills = [
  { cat: 'Frontend', items: ['✨ React', '🧊 Three.js', '🎬 GSAP', '🎨 CSS', '🌊 Tailwind'] },
  { cat: 'Backend', items: ['🟢 Node.js', '🚂 Express', '🌐 REST APIs', '🔥 Firebase'] },
  { cat: 'Tools', items: ['⚡ Vite', '🐙 Git', '🖋️ Figma', '▲ Vercel'] },
  { cat: 'Creative', items: ['🔮 WebGL', '🖌️ Canvas API', '🪄 Animation', '🏷️ Branding'] },
]

function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

function RevealBox({ children, delay = 0, className = '' }) {
  const [ref, visible] = useReveal()
  return (
    <div ref={ref} className={`reveal-box ${visible ? 'reveal-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

export default function About() {
  return (
    <section className="about-v2" id="about">
      <div className="about-container">

        {/* ── LEFT: Avatar + LinkedIn Card ── */}
        <div className="about-left">
          <RevealBox delay={0}>
            <div className="about-avatar-wrap">
              <div className="about-avatar-ring" />
              <div className="about-avatar-ring about-avatar-ring-2" />
              <img src={AVATAR_URL} alt="Hridyansh Dwivedi avatar" className="about-avatar" />
              <div className="about-avatar-badge">
                <span className="about-badge-dot" />
                <span>Available</span>
              </div>
            </div>
          </RevealBox>

          {/* LinkedIn Card (same style as index.html) */}
          <RevealBox delay={150}>
            <div className="linkedin-card">
              <div className="li-card-header">
                <img src={AVATAR_URL} alt="Profile" className="li-card-avatar" />
                <div className="li-card-info">
                  <h3 className="li-card-name">Hridyansh Dwivedi</h3>
                  <p className="li-card-role">System Architect &amp; Developer</p>
                  <p className="li-card-location">📍 India</p>
                </div>
              </div>

              <div className="li-card-stats">
                {[['500+', 'Connections'], ['4k+', 'Followers'], ['3+', 'Years']].map(([n, l]) => (
                  <div key={l} className="li-stat">
                    <span className="li-stat-n">{n}</span>
                    <span className="li-stat-l">{l}</span>
                  </div>
                ))}
              </div>

              <div className="li-card-actions">
                <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="li-btn li-btn-primary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2" fill="currentColor"/></svg>
                  LinkedIn
                </a>
                <a href="mailto:mannathridyanshdwivedi85@gmail.com" className="li-btn li-btn-outline">
                  ✉ Email Me
                </a>
              </div>
            </div>
          </RevealBox>

          {/* Social grid */}
          <RevealBox delay={250}>
            <div className="about-socials">
              {[
                { icon: 'in', label: 'LinkedIn', url: LINKEDIN_URL, color: '#0a66c2' },
                { icon: 'gh', label: 'GitHub', url: 'https://github.com/hridyanshdwivedi85', color: '#f0f6fc' },
                { icon: '𝕏', label: 'X / Twitter', url: 'https://x.com/Hridyansh_d', color: '#fff' },
                { icon: 'ig', label: 'Instagram', url: 'https://www.instagram.com/hridyansh__d/', color: '#e1306c' },
              ].map(s => (
                <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="about-social-btn" style={{ '--accent': s.color }}>
                  <span className="about-social-icon">{s.icon}</span>
                  <span className="about-social-label">{s.label}</span>
                </a>
              ))}
            </div>
          </RevealBox>
        </div>

        {/* ── RIGHT: Bio + Timeline + Skills ── */}
        <div className="about-right">
          <RevealBox delay={50}>
            <div className="about-intro">
              <div className="about-section-tag">// ABOUT ME</div>
              <h2 className="about-heading">
                Code that Drives<br />
                <span className="about-heading-accent">Revenue.</span>
              </h2>
              <p className="about-bio">
                I am a <strong>System Architect, Vibe Coder, and Tech Innovator</strong> based in India, brilliantly bridging the gap between high-level sales strategy and advanced software engineering. Before transitioning entirely to technology, I established a formidable foundation in international business development, personally orchestrating the sale of over 10,000+ digital marketing leads.
              </p>
              <p className="about-bio" style={{ marginTop: '12px' }}>
                Today, I leverage advanced AI workflows and <strong>"vibe coding"</strong> logic to engineer custom SaaS tools, high-conversion web platforms, and breathtaking 3D web experiences. I believe the most successful software must be technically elegant under the hood while remaining relentlessly focused on commercial goals.
              </p>
            </div>
          </RevealBox>

          {/* Timeline */}
          <RevealBox delay={150}>
            <div className="about-timeline-section">
              <div className="about-section-tag">// EXPERIENCE</div>
              <div className="about-timeline">
                {timeline.map((t, i) => (
                  <div key={t.year} className="about-tl-item" style={{ '--tl-color': t.color, animationDelay: `${i * 100}ms` }}>
                    <div className="about-tl-dot" />
                    <div className="about-tl-content">
                      <div className="about-tl-year">{t.year}</div>
                      <div className="about-tl-role">{t.role}</div>
                      <div className="about-tl-company">{t.company}</div>
                      <p className="about-tl-desc">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </RevealBox>

          {/* Skills */}
          <RevealBox delay={200}>
            <div className="about-skills-section">
              <div className="about-section-tag">// TECHNICAL SKILLS</div>
              <div className="about-skills-grid">
                {skills.map((cat, i) => (
                  <div key={cat.cat} className="about-skill-cat" style={{ animationDelay: `${i * 80}ms` }}>
                    <div className="about-skill-cat-title">{cat.cat}</div>
                    <div className="about-skill-items">
                      {cat.items.map(item => (
                        <span key={item} className="about-skill-chip">{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </RevealBox>
        </div>
      </div>
    </section>
  )
}
