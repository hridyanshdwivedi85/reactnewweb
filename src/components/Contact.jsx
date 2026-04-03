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
          <a href="mailto:mannathridyanshdwivedi85@gmail.com" className="contact-email">
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
        </div>
      </div>
    </section>
  )
}
