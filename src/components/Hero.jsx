import React from 'react'
import CharacterScene from './CharacterScene'

export default function Hero() {
  return (
    <section className="landing-section" id="landingDiv">
      {/* Background circles from the new design */}
      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>

      <div className="landing-container">
        <div className="landing-intro">
          <h2>Hello! I'm</h2>
          <h1>
            HRIDYANSH
            <br />
            <span>DWIVEDI</span>
          </h1>
        </div>

        <div className="landing-info">
          <h3>System Architect &</h3>
          <h2 className="landing-info-h2">
            <div className="landing-h2-1">Tech</div>
            <div className="landing-h2-2">Business</div>
          </h2>
          <h2>
            <div className="landing-h2-info">Business</div>
            <div className="landing-h2-info-1">Tech</div>
          </h2>
        </div>
      </div>

      <CharacterScene />
    </section>
  )
}
