export default function Contact() {
  return (
    <section className="section contact-section" id="contact">
      <div className="section-container">
        <div className="contact-inner">
          <div className="section-tag">// CONTACT</div>
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            Let's build something<br /><span>remarkable together.</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '460px', lineHeight: 1.7 }}>
            Open to freelance briefs, full-time roles, and ambitious collaborations.
            I respond within 24 hours.
          </p>
          <a
            href="mailto:mannathridyanshdwivedi85@gmail.com"
            className="contact-email"
          >
            mannathridyanshdwivedi85@gmail.com
          </a>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="mailto:mannathridyanshdwivedi85@gmail.com" className="btn-primary">
              ✉ Send Email
            </a>
            <a href="https://in.linkedin.com/in/hridyanshd85" target="_blank" rel="noreferrer"
              className="btn-outline">
              LinkedIn →
            </a>
          </div>

          {/* Social grid */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}>
            {[
              { label: 'GitHub', url: 'https://github.com/hridyanshdwivedi85' },
              { label: 'X / Twitter', url: 'https://x.com/Hridyansh_d' },
              { label: 'Instagram', url: 'https://www.instagram.com/hridyansh__d/' },
              { label: 'WhatsApp', url: 'https://wa.me/916393972524' },
            ].map(s => (
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.12em', color: 'var(--text-muted)', padding: '6px 12px', border: '1px solid var(--border)', borderRadius: '6px', transition: 'all 0.2s', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-hover)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
