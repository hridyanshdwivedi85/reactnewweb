const socials = [
  {
    label: 'LinkedIn',
    icon: 'in',
    href: 'https://in.linkedin.com/in/hridyanshd85',
    style: { fontFamily: 'serif', fontWeight: 900, fontSize: '15px' },
  },
  {
    label: 'Instagram',
    icon: '✦',
    href: 'https://www.instagram.com/hridyansh__d/',
  },
  {
    label: 'Email',
    icon: '✉',
    href: 'mailto:mannathridyanshdwivedi85@gmail.com',
  },
  {
    label: 'WhatsApp',
    icon: '◎',
    href: 'https://wa.me/916393972524',
  },
]

export default function SocialSidebar() {
  return (
    <aside className="social-sidebar" aria-label="Social links">
      {socials.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target={s.href.startsWith('http') ? '_blank' : '_self'}
          rel="noreferrer"
          className="social-icon-link"
          aria-label={s.label}
          title={s.label}
        >
          <span style={s.style}>{s.icon}</span>
        </a>
      ))}
    </aside>
  )
}
