export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">HD<span>.</span></div>
      <div className="footer-copy">
        © 2026 Hridyansh Dwivedi · System Architect
      </div>
      <a
        href="https://in.linkedin.com/in/hridyanshd85"
        target="_blank"
        rel="noreferrer"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          letterSpacing: '0.1em',
          color: 'var(--text-muted)',
          textDecoration: 'none',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#60a5fa'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        LinkedIn
      </a>
    </footer>
  )
}
