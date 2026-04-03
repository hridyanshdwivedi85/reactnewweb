// DinoGame.jsx — Chrome T-Rex Dino Game ported to React
// Self-contained, uses inline SVG frame data from the original dino.html

import { useEffect, useRef, useState } from 'react'

export default function DinoGame({ onClose }) {
  const containerRef = useRef(null)
  const [gameStarted, setGameStarted] = useState(false)
  const scriptRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Dynamically inject the full dino game markup into a shadow layer
    const wrapper = document.createElement('div')
    wrapper.id = 'dino-game-root'
    wrapper.className = 'dino-root'
    wrapper.innerHTML = `
      <div id="main-frame-error" class="interstitial-wrapper">
        <div id="offline-resources" style="display:none">
          <div id="offline-resources-1x">
            <img id="1x-obstacle-large" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAAyCAMAAACJUtIoAAAACVBMVEX////39/dTU1OabbyfAAAAAXRSTlMAQObYZgAAAXhJREFUeF7t2NGqAjEMANGM///RlwvaYQndULuFPJgHUYaEI6IPhgNAOA8HZ+3U6384F5y1U6YzAZTWG+dZamnFEstBFtCKJZSHWMADLJ18z+JqpQeLdKoDC8siC5iFCQs4znIxB5B1t6F3lQWkL4N0JsF+u6GXJdbI+FKW+yWr3lhgCZ2VSag3Nlk/FnRkIRbasLCO0oulikMsvmGpeiGLZ1jOMgtIP5bODivYYUXEIVbwFCt4khVssRgsgidZwQaLd2A8m7MYLGTl4KeQQs2y4kMAMGGlmQViDIb5O6xZnnLD485dIBzqDSE1yyFdL4Iqu4XJqUUWl/NVAFSZq1P6a5aqbAUM2epQbBioWflUBABiUyhYyZoCBev8XyMAObDNOhOAfiyxmHU0YNlldGAphGjFCjA3YkUn1o/1Y3EkZFZ5isCC6NUgwDBn1RuXH96doNfAhDXfsIyJ2AnolcCVhay0kcYbW0HvCO8OwIcJ3GzkORpkFuUP/1Ec8FW1qJkAAAAASUVORK5CYII=">
            <img id="1x-obstacle-small" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAAAjCAMAAABRlI+PAAAADFBMVEX////////39/dTU1PhglcSAAAAAXRSTlMAQObYZgAAAPNJREFUeF7tlkEKwzAMBLXr//+5iQhU7gRRQkyhZI+DhwH74jhmO+oIJBVwURljuAXagG5QqkSgBLqg3JnxJ1Cb8SmQ3o6gpO85owGlOB4m2BNKJ11BSd01owGlOHkcIAuHkz6UNpPKgozPM54dADHjJuNhZiJxdQCQgZJeBczgCAAy3yhPJvcnmdC9mZwBIsQMFV5AkzHBNknFgcKM+oyDIFcfCAoy03m+jSMIcmoVZkKqSjr1fghyahRmoKRUHYLiSI1SMlCq5CDgX6BXmKkfn+oQ0KEyyrzoy8GbXJ9xrM/YjhUZgl9nnsyTCe9rgSRdV15CwRcIEu8GGQAAAABJRU5ErkJggg==">
            <img id="1x-cloud" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAOCAQAAAD6HOaKAAAAU0lEQVR4XrWSsQkAQAgD3X9El/ELixQpJHCfdApnUCtXz7o49cgagaGPaq4rIwAP9s/C7R7UX3inJ0BDb6qWDC7ScOR/QWjRlFizuPwLtTLj+qkH6DjD2wLtikUAAAAASUVORK5CYII=">
            <img id="1x-text" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL8AAAAYAgMAAADWncTDAAAABlBMVEX///9TU1NYzE1OAAAAAXRSTlMAQObYZgAAAO1JREFUeF690TFqxUAQA1BNoRtk7jMu3E9Auv9Vgr/5A863Y9zEhVhkHmhZsEGkw4Lppmllh1tcLHx+aRj2YnEDuQFvcQW+EoZY0TQLCZbEVxRxAvY+i8ikW0C0bwFdbictG2zvu/4EcCuBF0B23IBsQHZBYgm1n86BN+BmyV5rQFyCJAiDJSTfgBV9BbjvXdzIcKchpMOYd3gO/jvCeuUGFALg95J0/SrtQlrzz+sAjDwCIQsbWAdgbqrQpKYRjmPuAfU5dMC+c0rxOTiO+T6ZlK4pbcDLI1DIRaf3GxDGALkQHnD+cGhMKeox+AEOL3mLO7TQZgAAAABJRU5ErkJggg==">
            <img id="1x-horizon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABLAAAAAMAgMAAAAPCKxBAAAABlBMVEX///9TU1NYzE1OAAAAAXRSTlMAQObYZgAAALJJREFUeF7t1EEKAyEMhtEvMNm7sPfJEVyY+1+ltLgYAsrQCtWhbxEhQvgxIJtSZypxa/WGshgzKdbq/UihMFMlt3o/CspEYoihIMaAb6mCvM6C+BTAeyo+wN4yykV/6pVfkdLpVyI1hh7GJ6QunUoLEQlQglNP2nkQkeF8+ei9cLxMue1qxVRfk1Ej0s6AEGWfVOk0QUtnK5Xo0Lac6wpdtnQqB6VxomPaz+dgF1PaqqmeWJlz1jYUaSIAAAAASUVORK5CYII=">
            <img id="1x-trex" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQgAAAAvAgMAAABiRrxWAAAADFBMVEX///9TU1P39/f///+TS9URAAAAAXRSTlMAQObYZgAAAPpJREFUeF7d0jFKRkEMhdGLMM307itNLALyVmHvJuzTDMjdn72E95PGFEZSmeoU4YMMgxhskvQec8YSVFX1NhGcS5ywtbmC8khcZeKq+ZWJ4F8Sr2+ZCErjkJFEfcjAc/6/BMlfcz6xHdhRthYzIZhIHMcTVY1scUUiAphK8CMSPUbieTBhvD9Lj0vyV4wklEGzHpciKGOJoBp7XDcFs4kWxxM7Ey3iZ8JbzASAvMS7XLOJHTTvEkEZSeQl7DMuwVyCasqK5+XzQRYLUJlMbPXjFcn3m8eKBSjWZMJwvGIOvViAzCbUj1VEDoqFOEQGE3SyInJQLOQMJL4B7enP1UbLXJQAAAAASUVORK5CYII=">
            <img id="1x-restart" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAgCAQAAADQmBIFAAAAZklEQVR4Xu3WMQoAIAxDUe/Y+58jYwV1CwQJWQT5o/DAoaWjV2i/LRym/A5FjEsR41LPQchByEHwIVAEC4gZpghmSDP8egXpr/hQZaAKQFQe+pBOQAblDC336qrlPpSg0MEjInbWTLFFmwc8TpTAAAAAAElFTkSuQmCC">
          </div>
          <div id="offline-resources-2x">
            <img id="2x-obstacle-large" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABkBAMAAADOLxDzAAAACVBMVEX///9TU1P39/ea77PDAAAAAXRSTlMAQObYZgAAAa9JREFUeF7t1lFqhEAQBuG+wl6h7n/IEEgKlma2R8Vk1O4HWSh++Xzb8AKA8E4IXrlYnsXr+zgh1OdifZbBdFIApdWiWShtVhmQ+jAWMLFollCOsTzgxiyd7GcR01/YLOZf1SwsN2EBozBgAU9l4TAHkDWzCNjKApZlybO4z+GtFwu9bGKZl2TJSyxDxaoX8yyha7LGZRDqxR+ymtUsaNaWhTM+s5rl05tjNUsVz2Kxi6XqhSy4NcvbzgLSnzzvjqzgCCsiHsXSdZwVPIAVHGIhi+ABrOAAi5+Avy7HQhaycpAVpDDBsuKDAOBCrHzjQHgYhl9YsHxf+vRrsQxjVVAsDNMsF6uydBUhq+wWBq/ayCKWZekqA6DKPPEq/ZMsYllWdgGDoMdaLAzMsFwszgoAi1pDxUrWFKhZLlZnpXIkAORAs7YEoFmzQSxmt2NWs+xOP7GapRCiZjUrwFyymhX/xmpWs5rVrGZxQphmsT6LAAsvdgcBhmmWi9VZvN7+x+4K2WtgwBosFmZZvIh9IXsl8M5C1mCxLsvTfizoxfDTAfgdAIPFlVhxRqgHlrVZX9y44aEEvVqmAAAAAElFTkSuQmCC">
            <img id="2x-obstacle-small" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAABGBAMAAAByJ2Z/AAAADFBMVEX///9TU1P39/f///+TS9URAAAAAXRSTlMAQObYZgAAARZJREFUeF7t2NEJwzAQg2GtcCtoBe2/W6k5aK8qLgR6ToL9KPzzgR+NPCRRjg2ScjiQ9DKMCE4HRYQOJB2MJyXyQWPQgeSCDD8HnYHh10F6NbJk9KyMwpJ+hkEfnoSyGX1NUmAOqVjSz4zrNgwhm9FbMmEyuS7DpQw/Gf5kOGEYXMgwWBobnGHQmZKsYuyKDcZk8gdmM5uJMzKbgS7I5KENgJzxxN95PUMfAKi8gCXO6BQM4cM4ysEZwplyfxFDErAhmWniDKT3pJEpD2RDMpPEGUt6mOIQ1XFGmiXOZNLIgKUpgzH4lTgDtDIgmY0NznhSnWhk/v2ZkuONGOI2DEn0MNf7ttvMZjazmc2AJDkdJOlQ0sk8AC45t4r28J0GAAAAAElFTkSuQmCC">
            <img id="2x-cloud" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAAAcAgMAAACR2TCnAAAABlBMVEUAAADa2to4qB92AAAAAXRSTlMAQObYZgAAAFFJREFUeF6VzTEKAFEIxNA03m+a3P8q2wqi/E35BIdeGXq3q5hnrwBs7mC5vIZzu/nnqI319vRtqHB731blwSHjx+22+Rdn94rzQq0ugKPVlz5onyJcGdu0NgAAAABJRU5ErkJggg==">
            <img id="2x-text" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAX4AAAAwAQMAAAAsMYMXAAAABlBMVEUAAABTU1OoaSf/AAAAAXRSTlMAQObYZgAAAPdJREFUeF7tkzFqAzEQRb9RsZ11BF0jlXSlpDdYOcFeSeCLKLeYQujHwxRrtF0gUoqo+AwfPRh4DDZByKk7tkv3rNszWhLHKv7BhtObALxF3LP44vRvRoLPTa4avoS8BLA+PSNFzyqAq/wDwNZxrxKBxq5axLGRS4EkgP6A6rrhy6ZVQLoiZKpfRJ8NqCp+HbCZpAcromNNHTfoeWS7hwnA//tROIpm17lddCbFgMAylGSZANiRhL1ou2treo0/ErB5AtAwbr8e8HK28wpwP8rmpwCv23+cPZhvK8GOCUD4lMHRALiOw8O9TAAcB2C8B7zDSvPw+8A3sQJ/MSdPGzIAAAAASUVORK5CYII=">
            <img id="2x-horizon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAACWAAAAAYAQMAAABEalRSAAAABlBMVEX///9TU1NYzE1OAAAAAXRSTlMAQObYZgAAAOtJREFUeF7tljEKwzAMRb/J0CWgI/QKOYAh1+pUcjQfpUfw2MFEHVyDQSQmQUNM9AYNcobnh4egU+YVqhAvZSpgsfolPnSv5d0nz3vHslgUdK81RLzyvHcsi+WBNxQh4Ln8pw4Wi7skAg9mXgHMrEACXJnbHIllsbqGAtwXhnYswzFzwPWxWEPc2CexoobkHM4ZpD6s2loWiyIEEwCChIomMiMEHqgP573C9eHkc5VLWh3XsljnGVoLWVl+31bp38piTVVuihtPOAm9kcRLbrFjEvqwamtZLK5eI8sSan9rXEK0LcNFrY5oWawf59S7YSRD7eMAAAAASUVORK5CYII=">
            <img id="2x-trex" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAhAAAABeAgMAAAAPo8UvAAAADFBMVEX///9TU1P39/f///+TS9URAAAAAXRSTlMAQObYZgAAASdJREFUeF7t1qFOBEEQRdEyGP7vGQy/hsHc/0MPSe8ylU2vKEIqqQnviRZXdI7pyUQuONda901FGAG6j8aa+6mDEUboHP01sk5EHHWEjt/UY0dk/U+Ir/cdkXUEovV1GFF/HQMR/mLWEUYYYQRrf65XRhgB2595Y80lYRjCCG7AV/IZ0FdDabgDhiKMgE+tAX01ES+ajDBCADpHZw0tRdaZCCNEGhCdNSSlQTEVYUROQGeNxxoxH2EErXU+wohdQXONqyBorDsixiB2Be01JiOM2BXQX1MRUxFGpAL6aypiMsIIJCFBtSK98fFYKd6wFDEbYUQgEYh6hTSkonbDDTAdYQTrKNd9QPWGUFwAYYRYR7U+XemGfB0ajTACWEe1Pl3thtxMhBHfOCEbEnR2KZcAAAAASUVORK5CYII=">
            <img id="2x-restart" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABAAgMAAADE0Nm5AAAACVBMVEX////39/dTU1OabbyfAAAAAXRSTlMAQObYZgAAAGNJREFUeF7d1CEOwDAMQ9GS3q/ExPcz8Sm3gYBWVRo0afvwSQl0ax1To22JntKWupfGjriSXiLViCXCmXBHCykJTxaYEeIQGcVrHYklcoX8YYpSUggzcpBTiv5JtQWorUltmS6s4ZKtz2GgjAAAAABJRU5ErkJggg==">
          </div>
          <template id="audio-resources">
            <audio id="offline-sound-press" src="data:audio/mpeg;base64,T2dnUwACAAAAAAAAAABVDxppAAAAABYzHfUBHgF2b3JiaXMAAAAAAkSsAAD/////AHcBAP////+4AU9nZ1MAAAAAAAAAAAAAVQ8aaQEAAADfaULaEEf//////////////////+IDdm9yYmlzNwAAAEFPOyBhb1R1ViBiNSBbMjAwNjEwMjRdIChiYXNlZCBvbiBYaXBoLk9yZydzIGxpYlZvcmJpcykAAAAAAQV2b3JiaXMVQkNWAQAAAABkFFRVAA=="></audio>
            <audio id="offline-sound-hit" src="data:audio/mpeg;base64,T2dnUwACAAAAAAAAAABVDxppAAAAABYzHfUBHgF2b3JiaXMAAAAAAkSsAAD/////AHcBAP////+4AU9nZ1MAAAAAAAAAAAAAVQ8aaQEAAADfaULaEEf//////////////////+IDdm9yYmlzNwAAAEFPOyBhb1R1ViBiNSBbMjAwNjEwMjRdIChiYXNlZCBvbiBYaXBoLk9yZydzIGxpYlZvcmJpcykAAAAAAQV2b3JiaXMVQkNWAQAAAABkFFRVAA=="></audio>
            <audio id="offline-sound-reached" src="data:audio/mpeg;base64,T2dnUwACAAAAAAAAAABVDxppAAAAABYzHfUBHgF2b3JiaXMAAAAAAkSsAAD/////AHcBAP////+4AU9nZ1MAAAAAAAAAAAAAVQ8aaQEAAADfaULaEEf//////////////////+IDdm9yYmlzNwAAAEFPOyBhb1R1ViBiNSBbMjAwNjEwMjRdIChiYXNlZCBvbiBYaXBoLk9yZydzIGxpYlZvcmJpcykAAAAAAQV2b3JiaXMVQkNWAQAAAABkFFRVAA=="></audio>
          </template>
        </div>
        <div id="dino-title" style="text-align:center;font-family:'Space Grotesk',sans-serif;margin-bottom:8px;">
          <span style="font-size:1.1rem;font-weight:700;color:#7c3aed;letter-spacing:0.2em;">T-REX RUN</span><br>
          <span style="font-size:0.65rem;color:rgba(255,255,255,0.3);letter-spacing:0.15em;font-family:'JetBrains Mono',monospace;">PRESS SPACE OR CLICK TO JUMP</span>
        </div>
        <button id="details-button" style="display:none"></button>
      </div>
    `
    container.appendChild(wrapper)

    // Inject the original dino runner script
    const script = document.createElement('script')
    script.src = '/dino_runner.js'
    script.onload = () => {
      if (window.Runner) {
        try { new window.Runner('.interstitial-wrapper') } catch(e) { console.warn('Dino init:', e) }
      }
    }
    script.onerror = () => {
      // Fallback: inject inline mini script
      const inlineScript = document.createElement('script')
      inlineScript.textContent = `
        (function() {
          if (!document.querySelector('.interstitial-wrapper')) return;
          setTimeout(function() {
            try { if (window.Runner) new window.Runner('.interstitial-wrapper'); } catch(e) {}
          }, 200);
        })();
      `
      document.body.appendChild(inlineScript)
    }
    document.body.appendChild(script)
    scriptRef.current = script

    return () => {
      if (container.contains(wrapper)) container.removeChild(wrapper)
      if (document.body.contains(script)) document.body.removeChild(script)
    }
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9000,
      background: 'rgba(0,0,0,0.92)',
      backdropFilter: 'blur(20px)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '20px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'rgba(124,58,237,0.8)', textTransform: 'uppercase' }}>
          ◈ Easter Egg Unlocked — T-REX RUNNER
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.6)', borderRadius: '50%',
            width: '36px', height: '36px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
        >✕</button>
      </div>

      {/* Game container */}
      <div
        ref={containerRef}
        style={{
          background: '#f7f7f7',
          borderRadius: '16px',
          padding: '24px',
          width: 'min(90vw, 640px)',
          boxShadow: '0 0 80px rgba(124,58,237,0.2), 0 40px 80px rgba(0,0,0,0.6)',
          border: '1px solid rgba(124,58,237,0.3)',
          position: 'relative',
        }}
      />

      {/* Tip */}
      <div style={{
        marginTop: '20px', fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
        color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em', textTransform: 'uppercase',
      }}>
        // found the easter egg. impressive.
      </div>
    </div>
  )
}
