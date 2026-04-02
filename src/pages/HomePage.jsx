import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Stats from '../components/Stats'
import About from '../components/About'
import Work from '../components/Work'
import Skills from '../components/Skills'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import DinoGame from '../components/DinoGame'

// Easter egg: type "dino" anywhere on the page to trigger it
function useKonamiDino(onTrigger) {
  useEffect(() => {
    const seq = 'dino'
    let buffer = ''
    const handler = (e) => {
      buffer = (buffer + e.key).slice(-seq.length)
      if (buffer === seq) onTrigger()
    }
    window.addEventListener('keypress', handler)
    return () => window.removeEventListener('keypress', handler)
  }, [onTrigger])
}

export default function HomePage() {
  const [showDino, setShowDino] = useState(false)

  useKonamiDino(() => setShowDino(true))

  return (
    <>
      <Navbar onDinoTrigger={() => setShowDino(true)} />
      <main>
        <Hero />
        <Stats />
        <About />
        <Work />
        <Skills />
        <Contact />
      </main>
      <Footer />

      {/* Easter egg Dino Game */}
      {showDino && <DinoGame onClose={() => setShowDino(false)} />}
    </>
  )
}
