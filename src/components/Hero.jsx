import React from 'react'
import CharacterScene from './CharacterScene'
import UnicornScene from "unicornstudio-react"

export default function Hero() {
  return (
    <section className="landing-section" id="landingDiv" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background UnicornStudio animation */}
      <div id="unicorn-wrapper" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <UnicornScene
          projectId="7bzzYJGvMvu0GRawnv9y"
          width="100%"
          height="100%"
          scale={1}
          dpi={1.5}
          sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@2.1.6/dist/unicornStudio.umd.js"
        />
      </div>

      {/* Background circles from the new design */}
      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade" style={{ zIndex: 1 }}></div>

      <div className="landing-container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="landing-intro">
          <h2>Hello! I'm</h2>
          <h1>
            HRIDYANSH
            <br />
            <span>DWIVEDI</span>
          </h1>
        </div>

        <div className="landing-info">
          <h3>CEO &</h3>
          <h2 style={{ 
            color: '#14b8a6', 
            fontFamily: 'var(--font-head)', 
            fontWeight: 800, 
            margin: 0,
            marginTop: '-5px',
            fontSize: 'clamp(3rem, 5vw, 4.5rem)',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            DEVELOPER
          </h2>
        </div>
      </div>

      <CharacterScene />
    </section>
  )
}
