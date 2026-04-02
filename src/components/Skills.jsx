const skillGroups = [
  { cat: 'Frontend & 3D', items: [
    { icon: '⚛️', name: 'React', sub: 'Components & Hooks' },
    { icon: '🔺', name: 'Three.js', sub: '3D / WebGL / GLSL' },
    { icon: '🎞', name: 'GSAP', sub: 'Animations' },
    { icon: '🟨', name: 'JavaScript', sub: 'ES2024+' },
    { icon: '🌐', name: 'Next.js', sub: 'Full-stack' },
  ], color: '#7c3aed' },
  { cat: 'Backend & APIs', items: [
    { icon: '📦', name: 'Node.js', sub: 'Express & REST' },
    { icon: '🐍', name: 'Python', sub: 'FastAPI' },
    { icon: '🔥', name: 'Firebase', sub: 'Auth & Firestore' },
    { icon: '🗄️', name: 'SQL', sub: 'Databases' },
    { icon: '☁️', name: 'GCP', sub: 'Cloud Platform' },
  ], color: '#2563eb' },
  { cat: 'Design & Tools', items: [
    { icon: '📐', name: 'Figma', sub: 'UI Design' },
    { icon: '🎨', name: 'CSS3', sub: 'Architecture' },
    { icon: '🌊', name: 'Tailwind', sub: 'Utility-first' },
    { icon: '🐳', name: 'Docker', sub: 'DevOps' },
    { icon: '🤖', name: 'AI / LLM', sub: 'Groq · GPT' },
  ], color: '#059669' },
]

export default function Skills() {
  return (
    <section className="section" id="skills">
      <div className="section-container">
        <div className="section-tag">Arsenal</div>
        <h2 className="section-title">Tech <span>Stack.</span></h2>
        <p className="section-desc">Tools I use to build production-grade, performant experiences.</p>

        <div className="skills-grid">
          {skillGroups.map(group => (
            <div key={group.cat} className="skill-category" style={{ borderTopColor: group.color }}>
              <div className="skill-cat-title" style={{ color: group.color }}>{group.cat}</div>
              <div className="skill-chips">
                {group.items.map(s => (
                  <div key={s.name} className="skill-chip" title={s.sub}>
                    <span style={{ marginRight: '4px' }}>{s.icon}</span>
                    {s.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
