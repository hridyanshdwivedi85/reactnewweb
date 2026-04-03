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
      <main style={{ paddingBottom: '100px' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Hero />
        </div>
        
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Stats />
        </div>
        
        <div style={{ position: 'relative', zIndex: 3 }}>
          <About />
        </div>
        
        <div style={{ position: 'relative', zIndex: 4 }}>
          <Work />
        </div>
        
        <div style={{ position: 'relative', zIndex: 5 }}>
          <Skills />
        </div>
        
        <div style={{ position: 'relative', zIndex: 6 }}>
          <Contact />
        </div>
      </main>
      <Footer />

      {/* Easter egg Dino Game */}
      {showDino && <DinoGame onClose={() => setShowDino(false)} />}
    </>
  )
}
