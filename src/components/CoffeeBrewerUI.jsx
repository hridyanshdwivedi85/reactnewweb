import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

// --- Audio System ---
let audioCtx = null
function playBeep(freq = 440, type = 'sine', duration = 0.1, vol = 0.1) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    if (audioCtx.state === 'suspended') audioCtx.resume()
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime)
    gain.gain.setValueAtTime(vol, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start()
    osc.stop(audioCtx.currentTime + duration)
  } catch (e) {}
}

const brewAudio = new Audio('https://actions.google.com/sounds/v1/water/boiling_water.ogg')
brewAudio.loop = true
brewAudio.volume = 0.3

const steamAudio = new Audio('https://actions.google.com/sounds/v1/water/air_release.ogg')
steamAudio.loop = true
steamAudio.volume = 0.3

export default function CoffeeBrewerUI({ active }) {
  // Machine State
  const [power, setPower] = useState(false)
  const [brew, setBrew] = useState(false)
  const [steam, setSteam] = useState(false)
  const [pouringMilk, setPouringMilk] = useState(false)
  
  // Metrics
  const [temp, setTemp] = useState(25.0)
  const [time, setTime] = useState(0)
  const [beanLevel, setBeanLevel] = useState(0)
  const [coffeeAmount, setCoffeeAmount] = useState(0) // 0 to 100
  const [milkLevel, setMilkLevel] = useState(0)       // 0 to 100
  const [milkFrothed, setMilkFrothed] = useState(0)   // 0 to 100
  const [milkInCup, setMilkInCup] = useState(0)       // 0 to 100

  const containerRef = useRef(null)
  const uiRef = useRef(null)
  const [scale, setScale] = useState(1)

  // Fluid UI Scaling logic
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const parentDiv = containerRef.current
        const availableHeight = parentDiv.clientHeight
        const availableWidth = parentDiv.clientWidth
        
        // Machine base size is 450x850
        const scaleH = availableHeight / 850
        const scaleW = availableWidth / 450
        
        // Use 95% of the tighter constraint so it never touches edges exactly
        const finalScale = Math.min(scaleH, scaleW) * 0.95
        setScale(Math.max(0.2, finalScale)) // don't scale to 0
      }
    }
    measure()
    // small timeout to ensure layout is done
    setTimeout(measure, 100) 
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [active])

  const togglePower = () => {
    playBeep(power ? 300 : 800, 'square', 0.1, 0.05)
    if (power) {
      setPower(false)
      setBrew(false)
      setSteam(false)
      setPouringMilk(false)
    } else {
      setPower(true)
    }
  }

  const toggleBrew = () => {
    if (!power) return
    if (coffeeAmount >= 100 && !brew) {
      playBeep(200, 'sawtooth', 0.2, 0.1) // Cup full
      return
    }
    if (beanLevel <= 0 && !brew) {
      setBeanLevel(100) // Auto-fill beans
    }
    
    if (!brew) {
      brewAudio.currentTime = 0
      brewAudio.play().catch(e => {})
    } else {
      brewAudio.pause()
    }
    playBeep(brew ? 400 : 900, 'sine', 0.1, 0.05)
    setBrew(!brew)
  }

  const toggleSteam = () => {
    if (!power) return
    if (milkLevel <= 0 && !steam) {
      setMilkLevel(100) // Auto-fill milk
    }

    if (!steam) {
      steamAudio.currentTime = 0
      steamAudio.play().catch(e => {})
    } else {
      steamAudio.pause()
    }
    playBeep(steam ? 400 : 1000, 'triangle', 0.1, 0.05)
    setSteam(!steam)
  }

  const doActionMilk = () => {
    // Top up cold milk into pitcher
    playBeep(600, 'triangle', 0.05, 0.1)
    setMilkLevel(prev => Math.min(100, prev + 40))
  }

  const doActionPour = () => {
    if (milkLevel <= 0 || milkFrothed < 20 || pouringMilk) return
    playBeep(500, 'sine', 0.2, 0.1)
    setPouringMilk(true)
  }

  const addBeans = () => {
    playBeep(600, 'triangle', 0.05, 0.1)
    setBeanLevel(prev => Math.min(100, prev + 40))
  }

  const resetCup = () => {
    setCoffeeAmount(0)
    setMilkInCup(0)
    setTime(0)
  }

  // Effect: Heating System
  useEffect(() => {
    let interval;
    if (power) {
      interval = setInterval(() => {
        setTemp(prev => {
          if (prev < 93.5) return +(prev + 0.5 + Math.random() * 0.5).toFixed(1)
          return +(93.0 + Math.random() * 1.5).toFixed(1)
        })
      }, 150)
    } else {
      interval = setInterval(() => {
        setTemp(prev => {
          if (prev > 25) return +(prev - 0.2).toFixed(1)
          return 25.0
        })
      }, 300)
    }
    return () => clearInterval(interval)
  }, [power])

  // Effect: Brew System
  useEffect(() => {
    let interval;
    if (brew && power) {
      interval = setInterval(() => {
        setTime(t => t + 0.1)
        setBeanLevel(prev => Math.max(0, prev - 0.3))
        setCoffeeAmount(prev => {
          const next = prev + 1.2
          if (next >= 100 || beanLevel <= 0) {
            setBrew(false)
            brewAudio.pause()
            return Math.min(100, next)
          }
          return next
        })
      }, 100)
    }
    return () => clearInterval(interval)
  }, [brew, power, beanLevel])

  // Effect: Steaming System
  useEffect(() => {
    let interval;
    if (steam && power) {
      interval = setInterval(() => {
        setMilkFrothed(prev => {
          const next = prev + 1.5
          if (next >= 100 || milkLevel <= 0) {
            setSteam(false)
            steamAudio.pause()
            return Math.min(100, next)
          }
          return next
        })
      }, 100)
    }
    return () => clearInterval(interval)
  }, [steam, power, milkLevel])

  // Effect: Pouring Milk
  useEffect(() => {
    let interval;
    if (pouringMilk) {
      interval = setInterval(() => {
        setMilkLevel(prev => {
          const next = prev - 2
          if (next <= 0) {
            setPouringMilk(false)
            return 0
          }
          return next
        })
        setMilkInCup(prev => Math.min(100, prev + 2))
      }, 50)
    }
    return () => clearInterval(interval)
  }, [pouringMilk])


  // -- VIEW RENDERING -- //
  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
      
      {/* Dynamic scaled container representing the Machine */}
      <div 
        ref={uiRef} 
        style={{ 
          width: 450, 
          height: 850, 
          transform: `scale(${scale})`, 
          transformOrigin: 'center center',
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          fontFamily: '"JetBrains Mono", monospace',
          position: 'relative'
        }}
      >

        {/* ── 1. TOP MODULE: HOPPER ── */}
        <div style={{ position: 'relative', width: 220, height: 120, marginBottom: '20px', marginTop: '40px', zIndex: 10 }}>
          <button onClick={addBeans} className="hover-glow" style={{ position: 'absolute', top: -35, left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,150,0,0.5)', borderRadius: '20px', padding: '6px 20px', cursor: 'pointer', color: '#f97316', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', backdropFilter: 'blur(4px)' }}>
            + Add Beans
          </button>
          
          {/* Authentic Hopper Shape (Trapezoid) */}
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(to right, rgba(255,255,255,0.02), rgba(255,255,255,0.1))', border: '2px solid rgba(255,255,255,0.1)', borderBottom: 'none', clipPath: 'polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)', position: 'relative', boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.5)' }}>
            <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${beanLevel}%`, background: 'linear-gradient(to top, #3b1c0a, #743e1d)', transition: 'height 0.3s' }}>
              <div style={{ width: '100%', height: '100%', opacity: 0.5, backgroundImage: 'radial-gradient(#1a0f07 2px, transparent 2px)', backgroundSize: '10px 10px' }}></div>
            </div>
            <div style={{ position: 'absolute', top: 0, right: 20, width: 20, height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1))', transform: 'skewX(-10deg)' }}></div>
          </div>
        </div>

        {/* ── 2. CENTER MODULE: MACHINE BODY & CONTROLS ── */}
        <div style={{ width: '100%', background: 'linear-gradient(135deg, #1f1f1f, #0d0d0d)', borderRadius: '15px', border: '1px solid #333', boxShadow: '0 20px 50px rgba(0,0,0,0.8), inset 0 2px 5px rgba(255,255,255,0.1)', padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 5 }}>
          
          {/* Top Switches */}
          <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 0' }}>
            <Switch label="POWER" active={power} onClick={togglePower} color="#ef4444" />
            <Switch label="BREW" active={brew} onClick={toggleBrew} color="#3b82f6" />
            <Switch label="STEAM" active={steam} onClick={toggleSteam} color="#eab308" />
          </div>

          {/* Status Dash */}
          <div style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '10px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 4, height: 16, backgroundColor: '#f97316' }}></div>
                <h2 style={{ margin: 0, color: '#fff', fontStyle: 'italic', fontSize: '18px', letterSpacing: '2px', fontWeight: 900 }}>NOVA.CORE</h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: power ? '#22c55e' : '#333', boxShadow: power ? `0 0 10px #22c55e` : 'none' }}></div>
                <span style={{ color: power ? '#fff' : '#555', fontSize: '11px', letterSpacing: '1px' }}>{power ? (temp > 92 ? 'READY' : 'HEATING') : 'OFFLINE'}</span>
              </div>
            </div>
            
            {/* Pressure Dial */}
            <div style={{ position: 'relative', width: 60, height: 60, borderRadius: '50%', border: '3px solid #222', background: '#111' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', width: 2, height: 24, backgroundColor: '#fff', transformOrigin: 'bottom center', transform: `translate(-50%, -100%) rotate(${Math.min(120, temp * 1.5 - 60)}deg)`, transition: 'transform 0.2s', borderRadius: '2px' }}></div>
              <div style={{ position: 'absolute', top: '50%', left: '50%', width: 6, height: 6, borderRadius: '50%', backgroundColor: '#f97316', transform: 'translate(-50%, -50%)' }}></div>
            </div>
          </div>

          {/* Digital Telemetry */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
             <TelemetryBox label="TEMP" value={`${temp.toFixed(1)}°`} highlight={power} />
             <TelemetryBox label="FLOW.R" value={`${brew ? (time*0.5).toFixed(2) : '0.00'}`} highlight={brew} />
             <TelemetryBox label="TIME" value={`0:${time.toFixed(1).padStart(4, '0')}`} highlight={brew || pouringMilk} />
          </div>

        </div>

        {/* ── 3. LOWER MODULE: BREW GROUP & STEAM WAND ── */}
        <div style={{ position: 'relative', width: '100%', height: 260, marginTop: '-10px', zIndex: 1 }}>
          
          {/* Back Wall */}
          <div style={{ position: 'absolute', top: 0, left: 30, right: 30, bottom: 20, background: 'linear-gradient(to bottom, #111, #181818)', border: '1px solid #222', borderTop: 'none', borderRadius: '0 0 5px 5px' }}></div>

          {/* Center Brew Head */}
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 100, height: 40, background: 'linear-gradient(135deg, #444, #222)', borderRadius: '0 0 20px 20px', border: '1px solid #555', borderTop: 'none', display: 'flex', justifyContent: 'center', zIndex: 4, boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }}>
            <div style={{ position: 'absolute', bottom: -10, width: 60, height: 15, background: '#333', borderRadius: '0 0 10px 10px' }}></div>
            {/* Spouts */}
            <div style={{ position: 'absolute', bottom: -20, left: 20, width: 8, height: 12, background: 'linear-gradient(90deg, #777, #aaa)', borderRadius: '0 0 4px 4px' }}></div>
            <div style={{ position: 'absolute', bottom: -20, right: 20, width: 8, height: 12, background: 'linear-gradient(90deg, #777, #aaa)', borderRadius: '0 0 4px 4px' }}></div>
            
            {/* Brew Liquid Streams */}
            <div style={{ position: 'absolute', top: 32, left: 21, width: 6, height: 100, background: 'linear-gradient(to bottom, #c98242 20%, #ffedd5)', boxShadow: '0 0 10px rgba(201,130,66,0.8)', opacity: brew ? 1 : 0, transition: 'opacity 0.2s', zIndex: -1 }}></div>
            <div style={{ position: 'absolute', top: 32, right: 21, width: 6, height: 100, background: 'linear-gradient(to bottom, #c98242 20%, #ffedd5)', boxShadow: '0 0 10px rgba(201,130,66,0.8)', opacity: brew ? 1 : 0, transition: 'opacity 0.2s', zIndex: -1 }}></div>
          </div>

          {/* Right Steam Wand */}
          <div style={{ position: 'absolute', top: 0, right: 60, width: 8, height: 110, background: 'linear-gradient(90deg, #666, #ccc, #555)', borderRadius: '0 0 4px 4px', transformOrigin: 'top', transform: 'rotate(-10deg)', zIndex: 5, boxShadow: '2px 5px 10px rgba(0,0,0,0.5)' }}>
            <div style={{ position: 'absolute', top: 10, width: 14, height: 20, left: -3, background: '#111', borderRadius: '2px' }}></div>
            {/* Steam FX - Pointed down correctly into the milk pitcher below */}
            <div style={{ position: 'absolute', bottom: -60, left: -25, width: 50, height: 80, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', opacity: steam ? 1 : 0, transition: 'opacity 0.1s', pointerEvents: 'none' }}>
               {[...Array(8)].map((_, i) => (
                 <div key={i} style={{
                   position: 'absolute', top: 0, left: 10 + Math.random()*30, width: 15, height: 15,
                   background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 60%)', borderRadius: '50%', filter: 'blur(4px)',
                   animation: steam ? `steamFall ${0.5 + Math.random()}s linear infinite` : 'none', animationDelay: `${Math.random()}s`
                 }}></div>
               ))}
            </div>
          </div>

          {/* Milk Pitcher */}
          <div style={{ position: 'absolute', bottom: 20, right: 30, width: 60, height: 80, zIndex: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.2))', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px 4px 10px 10px', position: 'relative', overflow: 'hidden', backdropFilter: 'blur(2px)' }}>
              {/* Milk Liquid */}
              <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${milkLevel}%`, background: '#f8fafc', transition: 'height 0.2s', boxShadow: 'inset 0 10px 15px rgba(0,0,0,0.1)' }}>
                {/* Froth indicator */}
                <div style={{ width: '100%', height: `${Math.min(100, milkFrothed)}%`, background: 'rgba(255,255,255,0.7)', position: 'absolute', top: 0, borderBottom: '1px solid #e2e8f0', backgroundImage: `radial-gradient(transparent 50%, rgba(0,0,0,0.05) 100%)`, backgroundSize: '4px 4px' }}></div>
              </div>
            </div>
          </div>
          
          <div style={{ position: 'absolute', bottom: 105, right: 30, width: 60, display: 'flex', justifyContent: 'center', gap: '5px', zIndex: 10 }}>
             <button onClick={doActionMilk} style={{ padding: '2px 4px', fontSize: '9px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid #555', borderRadius: '2px', cursor: 'pointer' }}>+MILK</button>
             {milkFrothed >= 20 && milkLevel > 0 && (
                <button onClick={doActionPour} style={{ padding: '2px 4px', fontSize: '9px', background: '#f97316', color: '#fff', border: 'none', borderRadius: '2px', cursor: 'pointer', fontWeight: 'bold' }}>POUR</button>
             )}
          </div>

          {/* Pouring Milk Stream */}
          {pouringMilk && (
             <div style={{ position: 'absolute', bottom: 85, right: 60, width: 50, height: 6, background: '#fff', transformOrigin: 'right', transform: 'rotate(-130deg)', zIndex: 6, borderRadius: '4px', boxShadow: '0 0 10px #fff' }}></div>
          )}
          {pouringMilk && (
             <div style={{ position: 'absolute', bottom: 35, left: '50%', transform: 'translateX(20px)', width: 6, height: 60, background: '#fff', zIndex: 5, borderRadius: '3px', filter: 'blur(1px)' }}></div>
          )}

          {/* Center Glass Cup */}
          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 20, width: 90, height: 80, zIndex: 3, cursor: 'pointer' }} title="Click to clear cup" onClick={resetCup}>
             <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '5px 5px 40px 40px', overflow: 'hidden', backdropFilter: 'blur(3px)', position: 'relative', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }}>
               {/* Coffee Layer */}
               <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${coffeeAmount}%`, background: 'linear-gradient(to top, #290f01, #4a2109)', transition: 'height 0.2s', zIndex: 1 }}></div>
               {/* Crema Layer */}
               <div style={{ position: 'absolute', bottom: `${coffeeAmount}%`, width: '100%', height: coffeeAmount > 0 ? '6px' : '0', background: '#d97706', transition: 'bottom 0.2s', zIndex: 2 }}></div>
               {/* Milk Layer */}
               <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${milkInCup}%`, background: 'rgba(255,255,255,0.9)', transition: 'height 0.2s', zIndex: 3, mixBlendMode: 'screen', filter: 'contrast(1.5) brightness(1.2)' }}></div>
             </div>
             {/* Handle */}
             <div style={{ position: 'absolute', top: 20, right: -15, width: 25, height: 35, border: '3px solid rgba(255,255,255,0.2)', borderRadius: '0 15px 15px 0', zIndex: 1 }}></div>
          </div>

          {/* Drip Tray Base */}
          <div style={{ position: 'absolute', bottom: 0, width: '100%', height: 20, background: 'linear-gradient(to bottom, #777, #333)', borderRadius: '4px', zIndex: 2, display: 'flex', flexDirection: 'column', boxShadow: '0 10px 20px rgba(0,0,0,0.8)' }}>
             <div style={{ display: 'flex', width: '100%', height: '8px', gap: '3px', padding: '2px 10px' }}>
                {[...Array(24)].map((_, i) => (
                  <div key={i} style={{ flex: 1, backgroundColor: '#111', borderRadius: '1px' }}></div>
                ))}
             </div>
          </div>
        </div>

      </div>

      <style>{`
        .hover-glow:hover { background: rgba(255,255,255,0.1) !important; color: #fff !important; }
        @keyframes steamFall {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          30% { opacity: 0.9; }
          100% { transform: translateY(50px) scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

function Switch({ label, active, onClick, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
      <button 
        onClick={onClick}
        style={{ 
          width: 48, height: 60, background: active ? 'linear-gradient(to bottom, #2a2a2a, #111)' : 'linear-gradient(to bottom, #111, #0a0a0a)', 
          border: '1px solid', borderColor: active ? '#444' : '#222', borderRadius: '4px',
          cursor: 'pointer', outline: 'none', transition: 'all 0.1s', position: 'relative',
          boxShadow: active ? 'inset 0 5px 15px rgba(0,0,0,0.9), 0 2px 5px rgba(255,255,255,0.1)' : 'inset 0 1px 1px rgba(255,255,255,0.1), 0 10px 20px rgba(0,0,0,0.9)',
          transform: active ? 'translateY(4px)' : 'none'
        }}
      >
        <div style={{ position: 'absolute', top: active ? '25%' : '15%', left: '50%', transform: 'translateX(-50%)', width: 4, height: 16, background: active ? '#aaa' : '#444', borderRadius: '2px' }}></div>
      </button>
      <div style={{ width: 40, height: 4, background: active ? color : '#333', boxShadow: active ? `0 0 12px ${color}` : 'inset 0 1px 2px rgba(0,0,0,0.5)', borderRadius: '2px' }}></div>
      <div style={{ color: '#888', fontSize: '10px', letterSpacing: '1px' }}>{label}</div>
    </div>
  )
}

function TelemetryBox({ label, value, highlight }) {
  return (
    <div style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '6px', padding: '10px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ color: '#555', fontSize: '9px', letterSpacing: '1px', marginBottom: '6px' }}>{label}</div>
      <div style={{ color: highlight ? '#fff' : '#444', fontSize: '18px', fontWeight: 'bold', textShadow: highlight ? '0 0 10px rgba(255,255,255,0.4)' : 'none', fontFamily: '"Space Grotesk", sans-serif' }}>{value}</div>
      {highlight && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }}></div>}
    </div>
  )
}
