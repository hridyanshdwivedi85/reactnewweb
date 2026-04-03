import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

// Reusable audio context for UI sounds
let audioCtx = null
function playBeep(freq = 440, type = 'sine', duration = 0.1, vol = 0.1) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
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

export default function CoffeeBrewerUI({ active }) {
  const [power, setPower] = useState(false)
  const [brew, setBrew] = useState(false)
  const [steam, setSteam] = useState(false)
  
  const [temp, setTemp] = useState(25.0)
  const [time, setTime] = useState(0)
  
  const uiRef = useRef(null)

  // Turn on/off sounds
  const togglePower = () => {
    playBeep(power ? 300 : 800, 'square', 0.1, 0.05)
    setPower(!power)
    if (power) {
      setBrew(false)
      setSteam(false)
    }
  }

  const toggleBrew = () => {
    if (!power) return
    playBeep(brew ? 400 : 900, 'sine', 0.1, 0.05)
    setBrew(!brew)
  }

  const toggleSteam = () => {
    if (!power) return
    playBeep(steam ? 400 : 1000, 'triangle', 0.1, 0.05)
    setSteam(!steam)
  }

  // Handle heating simulation
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

  // Handle brewing time
  useEffect(() => {
    let interval;
    if (brew && power) {
      interval = setInterval(() => {
        setTime(t => t + 0.1)
      }, 100)
    } else if (!brew && time > 0) {
      // Auto reset after 3 seconds of not brewing
      const to = setTimeout(() => setTime(0), 3000)
      return () => clearTimeout(to)
    }
    return () => clearInterval(interval)
  }, [brew, power, time])

  // GSAP for brew stream and cup fill calculation
  const streamRef = useRef(null)
  const levelRef = useRef(null)

  useEffect(() => {
    if (brew) {
      gsap.to(streamRef.current, { scaleY: 1, opacity: 1, duration: 0.3, transformOrigin: 'top' })
      gsap.to(levelRef.current, { scaleY: Math.min(1, time / 30), duration: 0.2, transformOrigin: 'bottom' })
    } else {
      gsap.to(streamRef.current, { opacity: 0, duration: 0.2 })
      if (time === 0) {
        gsap.to(levelRef.current, { scaleY: 0, duration: 0.5 })
      }
    }
  }, [brew, time])

  return (
    <div ref={uiRef} className="coffee-lab-wrapper" style={{ 
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column', 
      alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', padding: '20px',
      fontFamily: '"JetBrains Mono", "Space Grotesk", monospace', backgroundColor: 'transparent'
    }}>
      <div style={{ transform: 'scale(0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* ── TOP PANEL ── */}
      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'space-around', border: '1px solid #333', padding: '15px', borderRadius: '8px', marginBottom: '15px', background: 'linear-gradient(180deg, #111, #0a0a0a)' }}>
        <SwitchButton label="POWER" active={power} onClick={togglePower} />
        <SwitchButton label="BREW" active={brew} onClick={toggleBrew} />
        <SwitchButton label="STEAM" active={steam} onClick={toggleSteam} />
      </div>

      {/* ── MIDDLE INFO PANEL ── */}
      <div style={{ width: '100%', maxWidth: '400px', border: '1px solid rgba(255,100,0,0.3)', borderRadius: '8px', padding: '15px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(180deg, #180a00, #0a0400)', boxShadow: power ? '0 0 20px rgba(255,100,0,0.05)' : 'none' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: 4, height: 20, backgroundColor: '#f97316' }}></div>
            <h2 style={{ margin: 0, color: '#fff', fontStyle: 'italic', fontSize: '20px', letterSpacing: '2px', fontWeight: 900 }}>GAGGIA<span style={{ color: '#f97316' }}>.GLS</span></h2>
          </div>
          <div style={{ color: '#666', fontSize: '10px', letterSpacing: '4px', marginTop: '2px', marginBottom: '15px' }}>PRO-MOD SERIES</div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: power ? (temp > 92 ? '#22c55e' : '#f97316') : '#333' }}></div>
            <span style={{ color: power ? '#f97316' : '#555', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>
              {power ? (temp > 92 ? 'READY TO BREW' : 'BOILER HEATING') : 'SYSTEM OFFLINE'}
            </span>
          </div>
        </div>
        
        {/* Analog Dial */}
        <div style={{ position: 'relative', width: 60, height: 60, borderRadius: '50%', border: '4px solid #222', background: '#111' }}>
           <div style={{ position: 'absolute', top: '50%', left: '50%', width: 2, height: 25, backgroundColor: '#fff', transformOrigin: 'bottom center', transform: `translate(-50%, -100%) rotate(${Math.min(120, temp * 1.5 - 60)}deg)`, transition: 'transform 0.2s' }}></div>
           <div style={{ position: 'absolute', top: '50%', left: '50%', width: 6, height: 6, borderRadius: '50%', backgroundColor: '#f97316', transform: 'translate(-50%, -50%)' }}></div>
        </div>
      </div>

      {/* ── METRICS PANEL ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px', marginBottom: '15px', width: '100%', maxWidth: '460px' }}>
        {/* PID */}
        <div style={{ width: '130px', flex: '1 1 120px', border: '1px solid rgba(255,100,0,0.3)', borderRadius: '6px', padding: '10px', background: '#0a0a0a' }}>
          <div style={{ fontSize: '9px', color: '#666', marginBottom: '10px' }}>PID.SYS</div>
          <div style={{ color: power ? '#f97316' : '#333', fontSize: '32px', textAlign: 'center', fontWeight: 'bold', textShadow: power ? '0 0 10px rgba(255,100,0,0.5)' : 'none' }}>
            {temp.toFixed(1)}
          </div>
          <div style={{ display: 'flex', gap: '4px', marginTop: '10px' }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ flex: 1, height: 4, background: power && i < (temp/12) ? '#f97316' : '#222' }}></div>
            ))}
          </div>
        </div>
        
        {/* FLOW GRAPH */}
        <div style={{ width: '130px', flex: '1 1 120px', border: '1px solid rgba(0,200,255,0.2)', borderRadius: '6px', padding: '10px', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontSize: '9px', color: '#666', marginBottom: '10px' }}>FLOW</div>
          <div style={{ color: brew ? '#06b6d4' : '#333', fontSize: '18px', fontWeight: 'bold' }}>
            {(brew ? Math.min(2.4, time * 0.5) + Math.random()*0.1 : 0).toFixed(2)} <span style={{ fontSize: '10px' }}>ml/s</span>
          </div>
          {/* Animated line representing graph */}
          <div style={{ position: 'absolute', bottom: 10, left: 0, width: '100%', height: '30px', borderTop: '1px dashed #333' }}>
            <div style={{ width: brew ? '100%' : '0%', height: '2px', background: '#06b6d4', position: 'absolute', bottom: 10, left: 0, boxShadow: '0 0 8px #06b6d4', transition: 'width 0.2s linear' }}></div>
          </div>
        </div>

        {/* TIME */}
        <div style={{ width: '130px', flex: '1 1 120px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '10px', background: '#0a0a0a' }}>
          <div style={{ fontSize: '9px', color: '#666', marginBottom: '10px' }}>TIME</div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '5px 0' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #333', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', width: 1, height: 18, background: brew ? '#fff' : '#444', transformOrigin: 'bottom center', transform: `translate(-50%, -100%) rotate(${time * 6}deg)` }}></div>
            </div>
          </div>
          <div style={{ color: brew ? '#fff' : '#555', textAlign: 'right', fontSize: '12px' }}>
            0:{time.toFixed(1).padStart(4, '0')}
          </div>
        </div>
      </div>

      {/* ── PORTAFILTER & CUP ── */}
      <div style={{ position: 'relative', width: 200, height: 140, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Portafilter */}
        <div style={{ width: 80, height: 25, background: 'linear-gradient(90deg, #444, #999, #444)', borderRadius: '0 0 10px 10px', position: 'relative', zIndex: 3 }}>
           {/* Handle */}
           <div style={{ position: 'absolute', left: -60, top: 5, width: 60, height: 12, background: 'repeating-linear-gradient(45deg, #111, #111 2px, #222 2px, #222 4px)' }}></div>
           {/* Spouts */}
           <div style={{ position: 'absolute', bottom: -10, left: 20, width: 6, height: 10, background: '#777', borderRadius: '0 0 3px 3px' }}></div>
           <div style={{ position: 'absolute', bottom: -10, right: 20, width: 6, height: 10, background: '#777', borderRadius: '0 0 3px 3px' }}></div>
        </div>
        
        {/* Steam Wand Output */}
        <div style={{ position: 'absolute', top: 5, right: 30, width: 2, height: 10, background: '#888' }}>
          <div style={{ position: 'absolute', bottom: -50, left: -20, width: 40, height: 50, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', opacity: steam ? 1 : 0, transition: 'opacity 0.2s', zIndex: 4, pointerEvents: 'none' }}>
            <div style={{ width: 40, height: steam ? 60 : 0, background: 'linear-gradient(to top, rgba(255,255,255,0.8), transparent)', filter: 'blur(5px)', animation: steam ? 'steam-rise 1s infinite alternate' : 'none', transformOrigin: 'bottom' }}></div>
            <style>{`
              @keyframes steam-rise {
                0% { transform: translateY(0) scaleX(1); opacity: 0.5; }
                100% { transform: translateY(-20px) scaleX(2); opacity: 0; }
              }
            `}</style>
          </div>
        </div>

        {/* Stream */}
        <div ref={streamRef} style={{ width: 6, height: 60, background: 'linear-gradient(to bottom, #5c3a21, #c98242)', position: 'absolute', top: 35, boxShadow: '0 0 10px rgba(201,130,66,0.6)', opacity: 0, transform: 'scaleY(0)', borderRadius: '3px' }}></div>

        {/* Cup */}
        <div style={{ width: 80, height: 50, border: '4px solid #f1f5f9', borderTop: 'none', borderRadius: '0 0 35px 35px', position: 'absolute', bottom: 0, overflow: 'hidden', zIndex: 2, background: 'rgba(255,255,255,0.05)', boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.5), 0 5px 15px rgba(0,0,0,0.5)' }}>
          {/* Coffee liquid inside */}
          <div ref={levelRef} style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, #3b1c0a 10%, #743e1d 90%)', transformOrigin: 'bottom', transform: 'scaleY(0)', boxShadow: 'inset 0 5px 10px rgba(0,0,0,0.5)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: '#d97706', opacity: 0.9 }}></div>
          </div>
        </div>
        {/* Cup Handle */}
        <div style={{ position: 'absolute', bottom: 12, right: 42, width: 24, height: 24, border: '4px solid #f1f5f9', borderRadius: '50%', zIndex: 1, boxShadow: 'inset 0 0 5px rgba(0,0,0,0.3)' }}></div>
      </div>
      </div>

    </div>
  )
}

function SwitchButton({ label, active, onClick }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
      <button 
        onClick={onClick}
        style={{ 
          width: 40, height: 50, background: active ? '#222' : '#111', 
          border: '2px solid', borderColor: active ? '#444' : '#222', borderRadius: '4px',
          cursor: 'pointer', outline: 'none', transition: 'all 0.1s', position: 'relative',
          boxShadow: active ? 'inset 0 10px 20px rgba(0,0,0,0.5), 0 0 8px rgba(255,255,255,0.1)' : 'inset 0 -10px 20px rgba(0,0,0,0.5)',
          transform: active ? 'translateY(2px)' : 'none'
        }}
      >
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 2, height: 10, background: active ? '#888' : '#444' }}></div>
      </button>
      <div style={{ width: 30, height: 4, background: active ? '#ef4444' : '#333', boxShadow: active ? '0 0 8px #ef4444' : 'none', borderRadius: '2px' }}></div>
      <div style={{ color: '#666', fontSize: '10px', letterSpacing: '1px' }}>{label}</div>
    </div>
  )
}
