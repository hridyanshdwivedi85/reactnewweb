import { useRef, useState, useCallback, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, RoundedBox, Html } from '@react-three/drei'
import * as THREE from 'three'

/* ─── Web Audio ─────────────────────── */
function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    if (type === 'click') {
      const osc = ctx.createOscillator(), gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'square'
      osc.frequency.setValueAtTime(220, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.12)
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
      osc.start(); osc.stop(ctx.currentTime + 0.15)
    } else if (type === 'dispense') {
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.55, ctx.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < data.length; i++)
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.07))
      const src = ctx.createBufferSource(), gain = ctx.createGain(), filt = ctx.createBiquadFilter()
      filt.type = 'bandpass'; filt.frequency.value = 280
      src.buffer = buf; src.connect(filt); filt.connect(gain); gain.connect(ctx.destination)
      gain.gain.setValueAtTime(0.5, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55)
      src.start()
    } else if (type === 'coin') {
      const osc = ctx.createOscillator(), gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(1100, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.1)
      gain.gain.setValueAtTime(0.22, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22)
      osc.start(); osc.stop(ctx.currentTime + 0.22)
    }
  } catch (_) {}
}

/* ─── Drink definitions ──────────────── */
const DRINKS = [
  { id: 'classic', label: 'Coke Classic',  sub: 'Original Taste',  color: '#E50014', hex: 0xE50014, price: '$1.50' },
  { id: 'zero',    label: 'Coke Zero',     sub: 'Zero Sugar',      color: '#1a1a28', hex: 0x1a1a28,  price: '$1.50' },
  { id: 'diet',    label: 'Diet Coke',     sub: 'Light & Crisp',   color: '#4f9fd4', hex: 0x4f9fd4, price: '$1.50' },
  { id: 'cherry',  label: 'Coke Cherry',   sub: 'Cherry Burst',    color: '#8B0000', hex: 0x8B0000, price: '$1.75' },
]

/* ─── Falling Coke Can ───────────────── */
function CokeCan({ color, falling, onLand }) {
  const ref = useRef()
  const vel = useRef(0)
  const rot = useRef(0)
  const done = useRef(false)

  useEffect(() => {
    if (falling && ref.current) {
      ref.current.position.set(0, 2.8, 0.9)
      ref.current.rotation.set(0, 0, 0)
      vel.current = 0; done.current = false
    }
  }, [falling])

  useFrame((_, dt) => {
    if (!falling || !ref.current || done.current) return
    vel.current -= 9.8 * dt * 1.4
    ref.current.position.y += vel.current * dt
    rot.current += dt * 8
    ref.current.rotation.z = rot.current
    if (ref.current.position.y <= -2.05) {
      ref.current.position.y = -2.05
      done.current = true
      vel.current  = 0
      onLand?.()
    }
  })

  if (!falling) return null
  return (
    <group ref={ref}>
      {/* Body */}
      <mesh>
        <cylinderGeometry args={[0.11, 0.11, 0.36, 32]} />
        <meshStandardMaterial color={color} metalness={0.92} roughness={0.08} />
      </mesh>
      {/* Top rim */}
      <mesh position={[0, 0.175, 0]}>
        <cylinderGeometry args={[0.088, 0.11, 0.04, 32]} />
        <meshStandardMaterial color="#bbb" metalness={1} roughness={0.08} />
      </mesh>
      {/* Pull tab */}
      <mesh position={[0.04, 0.205, 0]} rotation={[0, 0, 0.3]}>
        <torusGeometry args={[0.018, 0.005, 8, 12]} />
        <meshStandardMaterial color="#999" metalness={1} roughness={0.1} />
      </mesh>
      {/* Label band */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.113, 0.113, 0.15, 32]} />
        <meshStandardMaterial color="#fff" metalness={0.05} roughness={0.6} opacity={0.9} transparent />
      </mesh>
    </group>
  )
}

/* ─── Status LEDs ─────────────────────── */
function StatusLEDs({ dispensing, selected }) {
  const t    = useRef(0)
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef()]

  useFrame((_, dt) => {
    t.current += dt
    refs.forEach((r, i) => {
      if (!r.current) return
      if (dispensing) {
        const on = Math.floor(t.current * 7) % refs.length === i
        r.current.material.emissiveIntensity = on ? 3.5 : 0.05
        r.current.material.emissive.set(on ? '#00ff88' : '#002200')
      } else if (selected) {
        r.current.material.emissiveIntensity = 0.75 + Math.sin(t.current * 5 + i) * 0.25
        r.current.material.emissive.set('#ffe200')
      } else {
        r.current.material.emissiveIntensity = 0.22 + Math.sin(t.current * 2 + i * 1.3) * 0.1
        r.current.material.emissive.set('#ff1100')
      }
    })
  })

  return (
    <group position={[0, 2.0, 0.461]}>
      {refs.map((r, i) => (
        <mesh key={i} ref={r} position={[-0.4 + i * 0.2, 0, 0]}>
          <circleGeometry args={[0.026, 16]} />
          <meshStandardMaterial color="#0a0000" emissive="#ff1100" emissiveIntensity={0.22} />
        </mesh>
      ))}
    </group>
  )
}

/* ─── Selection Button with HTML Label ── */
function SelectionButton({ position, drink, onClick, selected, disabled }) {
  const [hov, setHov] = useState(false)
  const meshRef  = useRef()
  const lightRef = useRef()
  const t        = useRef(0)

  useFrame((_, dt) => {
    t.current += dt
    if (meshRef.current) {
      const s = selected ? 1 + Math.sin(t.current * 9) * 0.055 : hov ? 1.04 : 1
      meshRef.current.scale.setScalar(s)
    }
    if (lightRef.current) {
      lightRef.current.intensity = selected
        ? 2.5 + Math.sin(t.current * 9) * 0.8
        : hov ? 1.3 : 0.4
    }
  })

  return (
    <group position={position}>
      <pointLight ref={lightRef} color={disabled ? '#111' : drink.color} intensity={0.4} distance={0.6} />
      <RoundedBox
        ref={meshRef}
        args={[0.52, 0.14, 0.05]}
        radius={0.014} smoothness={4}
        onClick={e => { e.stopPropagation(); if (!disabled) { onClick(); playSound('click') } }}
        onPointerOver={e => { e.stopPropagation(); if (!disabled) { setHov(true); document.body.style.cursor = 'pointer' } }}
        onPointerOut={() => { setHov(false); document.body.style.cursor = 'auto' }}
      >
        <meshStandardMaterial
          color={disabled ? '#131313' : drink.color}
          emissive={disabled ? '#000' : drink.color}
          emissiveIntensity={hov || selected ? 0.9 : 0.18}
          metalness={0.4} roughness={0.3}
        />
      </RoundedBox>

      {/* LED dot */}
      <mesh position={[0.21, 0.073, 0.028]}>
        <circleGeometry args={[0.014, 12]} />
        <meshStandardMaterial
          color={selected ? '#00ff66' : '#ff2200'}
          emissive={selected ? '#00ff66' : '#ff2200'}
          emissiveIntensity={selected ? 3 : 0.5}
        />
      </mesh>

      {/* HTML text label — always legible */}
      <Html
        center
        distanceFactor={5}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
        position={[-0.02, 0, 0.03]}
      >
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          width: 100, padding: '0 4px',
          fontFamily: 'JetBrains Mono, monospace',
          opacity: disabled ? 0.4 : 1,
        }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: selected ? '#fff' : '#ddd', letterSpacing: 0.5 }}>
              {drink.label}
            </div>
            <div style={{ fontSize: 7, color: selected ? '#ffcc00' : '#888' }}>
              {drink.sub}
            </div>
          </div>
          <div style={{ fontSize: 9, color: selected ? '#ffcc00' : '#aaa', fontWeight: 700 }}>
            {drink.price}
          </div>
        </div>
      </Html>
    </group>
  )
}

/* ─── GET DRINK button ───────────────── */
function GetDrinkButton({ position, disabled, dispensing, onClick }) {
  const [hov, setHov] = useState(false)
  const ref = useRef()
  const t   = useRef(0)

  useFrame((_, dt) => {
    t.current += dt
    if (!ref.current) return
    const s = !disabled && hov ? 1.04 + Math.sin(t.current * 14) * 0.01 : 1
    ref.current.scale.setScalar(s)
  })

  const col    = disabled ? '#111' : dispensing ? '#004400' : '#e0a000'
  const emCol  = disabled ? '#000' : dispensing ? '#00ff55' : '#ffbb00'

  return (
    <group position={position}>
      <pointLight color={disabled ? '#000' : '#ffaa00'} intensity={disabled ? 0 : 1.0} distance={0.55} />
      <RoundedBox
        ref={ref}
        args={[0.6, 0.15, 0.06]}
        radius={0.016} smoothness={4}
        onClick={e => { e.stopPropagation(); if (!disabled) onClick() }}
        onPointerOver={e => { e.stopPropagation(); if (!disabled) { setHov(true); document.body.style.cursor = 'pointer' } }}
        onPointerOut={() => { setHov(false); document.body.style.cursor = 'auto' }}
      >
        <meshStandardMaterial
          color={col} emissive={emCol}
          emissiveIntensity={disabled ? 0 : dispensing ? 2 : hov ? 1.1 : 0.35}
          metalness={0.55} roughness={0.25}
        />
      </RoundedBox>
      <Html center distanceFactor={5} style={{ pointerEvents: 'none', userSelect: 'none' }} position={[0, 0, 0.035]}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 900,
          color: disabled ? '#555' : dispensing ? '#00ff88' : '#000',
          letterSpacing: 1, whiteSpace: 'nowrap',
        }}>
          {dispensing ? '⬇  DISPENSING' : '▶  GET DRINK'}
        </div>
      </Html>
    </group>
  )
}

/* ─── Coin insert slot ───────────────── */
function CoinSlot({ position }) {
  const t = useRef(0)
  const glowRef = useRef()
  useFrame((_, dt) => {
    t.current += dt
    if (glowRef.current) {
      glowRef.current.material.emissiveIntensity = 0.3 + Math.sin(t.current * 3) * 0.2
    }
  })
  return (
    <group position={position}>
      {/* Slot frame */}
      <mesh>
        <boxGeometry args={[0.18, 0.065, 0.018]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Slot opening */}
      <mesh ref={glowRef} position={[0, 0, 0.01]}>
        <boxGeometry args={[0.12, 0.016, 0.012]} />
        <meshStandardMaterial color="#000" emissive="#ffaa00" emissiveIntensity={0.3} />
      </mesh>
      <Html center distanceFactor={6} style={{ pointerEvents: 'none', userSelect: 'none' }} position={[0, -0.038, 0.012]}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 6, color: '#ffaa40', letterSpacing: 1 }}>
          COIN SLOT
        </div>
      </Html>
    </group>
  )
}

/* ─── Animated window light sweep ────── */
function WindowSweep() {
  const ref = useRef()
  const t   = useRef(0)
  useFrame((_, dt) => {
    t.current += dt
    if (ref.current) {
      ref.current.position.x = Math.sin(t.current * 0.85) * 0.42
      ref.current.material.opacity = 0.025 + Math.abs(Math.sin(t.current * 0.85)) * 0.06
    }
  })
  return (
    <mesh ref={ref} position={[0, 0.38, 0.463]}>
      <planeGeometry args={[0.32, 2.2]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.04} />
    </mesh>
  )
}

/* ─── Logo backlit panel (top) ─────── */
function LogoPanel({ t }) {
  const panelRef = useRef()
  const timeRef  = useRef(0)
  useFrame((_, dt) => {
    timeRef.current += dt
    if (panelRef.current) {
      panelRef.current.material.emissiveIntensity = 0.55 + Math.sin(timeRef.current * 2.2) * 0.12
    }
  })
  return (
    <group>
      {/* Backlit red panel */}
      <mesh ref={panelRef} position={[0, 1.62, 0.458]}>
        <boxGeometry args={[1.08, 0.46, 0.005]} />
        <meshStandardMaterial color="#C8000E" emissive="#E50014" emissiveIntensity={0.55} />
      </mesh>
      {/* Logo glow light */}
      <pointLight position={[0, 1.62, 0.82]} color="#ff4444" intensity={2.2} distance={1.3} />
      {/* HTML logo text */}
      <Html
        center
        distanceFactor={6}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
        position={[0, 1.62, 0.47]}
      >
        <div style={{
          fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 900,
          fontSize: 28, color: '#fff',
          textShadow: '0 0 16px rgba(255,255,255,0.6), 0 2px 4px rgba(0,0,0,0.8)',
          whiteSpace: 'nowrap', letterSpacing: 1,
        }}>
          Coca‑Cola
        </div>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 6,
          color: 'rgba(255,200,200,0.8)', letterSpacing: 4,
          textAlign: 'center', marginTop: 2,
        }}>
          REAL MAGIC
        </div>
      </Html>
    </group>
  )
}

/* ─── Full Vending Machine ────────────── */
function VendingMachineMesh({ selectedDrink, setSelectedDrink, dispensing, onDispense }) {
  const groupRef = useRef()
  const t        = useRef(0)

  useFrame((_, dt) => {
    t.current += dt
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t.current * 0.25) * 0.025
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>

      {/* ── Main body (red) ── */}
      <mesh castShadow>
        <boxGeometry args={[1.38, 4.1, 0.88]} />
        <meshStandardMaterial color="#C0101E" metalness={0.65} roughness={0.22} />
      </mesh>

      {/* ── Side chrome trim ── */}
      {[-0.71, 0.71].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} castShadow>
          <boxGeometry args={[0.036, 4.14, 0.9]} />
          <meshStandardMaterial color="#aaa" metalness={0.97} roughness={0.04} />
        </mesh>
      ))}

      {/* ── Top cap ── */}
      <mesh position={[0, 2.1, 0]}>
        <boxGeometry args={[1.4, 0.1, 0.9]} />
        <meshStandardMaterial color="#8a0010" metalness={0.85} roughness={0.12} />
      </mesh>

      {/* ── Bottom kick plate ── */}
      <mesh position={[0, -2.1, 0]}>
        <boxGeometry args={[1.4, 0.1, 0.92]} />
        <meshStandardMaterial color="#666" metalness={0.95} roughness={0.07} />
      </mesh>

      {/* ── Coca-Cola Logo backlit panel ── */}
      <LogoPanel />

      {/* ── Glass window ── */}
      <mesh position={[0, 0.38, 0.45]}>
        <boxGeometry args={[1.0, 2.16, 0.01]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.14} metalness={0.05} roughness={0} />
      </mesh>
      <WindowSweep />

      {/* ── Cans inside display ── */}
      {DRINKS.map((d, row) =>
        [-0.28, 0, 0.28].map((x, ci) => (
          <mesh key={`${row}-${ci}`}
            position={[x, 0.85 - row * 0.52, 0.23]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.1, 0.1, 0.33, 20]} />
            <meshStandardMaterial color={d.color} metalness={0.9} roughness={0.1} />
          </mesh>
        ))
      )}

      {/* Interior light */}
      <pointLight position={[0, 0.5, 0.08]} color="#ffe4cc" intensity={0.5} distance={1.6} />

      {/* ── Selection panel BG ── */}
      <mesh position={[0, -0.98, 0.453]}>
        <boxGeometry args={[1.0, 1.1, 0.008]} />
        <meshStandardMaterial color="#0c0002" />
      </mesh>

      {/* ── Status LED strip ── */}
      <StatusLEDs dispensing={dispensing} selected={!!selectedDrink} />

      {/* ── 4 Drink Buttons ── */}
      {DRINKS.map((d, i) => (
        <SelectionButton
          key={d.id}
          position={[0, -0.7 - i * 0.195, 0.465]}
          drink={d}
          selected={selectedDrink === d.id}
          disabled={dispensing}
          onClick={() => setSelectedDrink(d.id)}
        />
      ))}

      {/* ── Get Drink button ── */}
      <GetDrinkButton
        position={[0, -1.58, 0.465]}
        disabled={!selectedDrink || dispensing}
        dispensing={dispensing}
        onClick={onDispense}
      />

      {/* ── Coin slot ── */}
      <CoinSlot position={[0.3, -1.35, 0.454]} />

      {/* ── Dispense chute ── */}
      <mesh position={[0, -1.98, 0.53]}>
        <boxGeometry args={[0.7, 0.2, 0.012]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0, -2.1, 0.7]}>
        <boxGeometry args={[0.7, 0.01, 0.34]} />
        <meshStandardMaterial color="#555" metalness={0.9} roughness={0.1} />
      </mesh>
      {[-0.35, 0.35].map((x, i) => (
        <mesh key={i} position={[x, -1.98, 0.7]}>
          <boxGeometry args={[0.01, 0.24, 0.34]} />
          <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* ── Brand footer tag ── */}
      <Html
        center distanceFactor={6}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
        position={[0, -1.85, 0.465]}
      >
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 6,
          color: 'rgba(255,120,120,0.6)', letterSpacing: 3, textAlign: 'center',
        }}>
          REFRIGERATED · PLEASE RECYCLE
        </div>
      </Html>

      {/* ── Floor shadow ── */}
      <mesh position={[0, -2.19, 0.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.1, 32]} />
        <meshStandardMaterial color="#000" transparent opacity={0.4} />
      </mesh>
    </group>
  )
}

/* ─── Main Export ─────────────────────── */
export default function CokeVendingMachine({ isMobile }) {
  const [selectedDrink, setSelectedDrink] = useState(null)
  const [dispensing,    setDispensing]    = useState(false)
  const [showCan,       setShowCan]       = useState(false)
  const [canColor,      setCanColor]      = useState('#E50014')
  const [message,       setMessage]       = useState(null)

  const colorMap = { classic: '#E50014', zero: '#1a1a28', diet: '#4f9fd4', cherry: '#8B0000' }

  const onDispense = useCallback(() => {
    if (!selectedDrink || dispensing) return
    playSound('coin')
    setTimeout(() => {
      playSound('dispense')
      setCanColor(colorMap[selectedDrink])
      setDispensing(true)
      setShowCan(true)
      setMessage('DISPENSING…')
    }, 320)
  }, [selectedDrink, dispensing])

  const onCanLand = useCallback(() => {
    setMessage('ENJOY! 🥤')
    setTimeout(() => {
      setDispensing(false)
      setShowCan(false)
      setSelectedDrink(null)
      setMessage(null)
    }, 1900)
  }, [])

  const statusMsg = message ?? (selectedDrink
    ? `SELECTED: ${DRINKS.find(d => d.id === selectedDrink)?.label ?? selectedDrink.toUpperCase()}`
    : 'SELECT YOUR DRINK')

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      background: 'linear-gradient(160deg, #1a0003 0%, #0a0000 55%, #100008 100%)',
    }}>

      {/* ── Status Banner ── */}
      <div style={{
        position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
        zIndex: 20, fontFamily: "'JetBrains Mono', monospace",
        fontSize: isMobile ? '9px' : '11px',
        color: dispensing ? '#00ff88' : selectedDrink ? '#ffee00' : '#fff',
        background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)',
        padding: '7px 22px', borderRadius: 20,
        border: `1px solid ${dispensing ? '#00ff8822' : selectedDrink ? '#ffee0022' : '#ff000018'}`,
        letterSpacing: '2px', transition: 'all 0.3s',
        textShadow: dispensing ? '0 0 8px #00ff88' : selectedDrink ? '0 0 6px #ffe500' : 'none',
        whiteSpace: 'nowrap',
      }}>
        {statusMsg}
      </div>

      {/* ── Brand identity (top-left) ── */}
      <div style={{
        position: 'absolute', top: isMobile ? 52 : 58, left: isMobile ? 14 : 26,
        zIndex: 20, pointerEvents: 'none',
      }}>
        <div style={{
          fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic', fontWeight: 900,
          fontSize: isMobile ? '1.8rem' : '2.8rem',
          color: '#fff',
          textShadow: '0 0 28px rgba(229,0,20,0.9), 0 2px 6px rgba(0,0,0,0.9)',
          lineHeight: 1,
        }}>
          Coca‑Cola
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: isMobile ? '7px' : '8px', letterSpacing: '4px', marginTop: 6,
          color: '#ff8888', textTransform: 'uppercase',
        }}>
          Real Magic · 1886
        </div>
      </div>

      {/* ── Quick-select sidebar ── */}
      <div style={{
        position: 'absolute',
        bottom: isMobile ? 52 : 32,
        right: isMobile ? 10 : 18,
        zIndex: 20, display: 'flex', flexDirection: 'column', gap: 7,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12, padding: '14px 16px',
      }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: '#555', letterSpacing: 3, marginBottom: 4 }}>
          VARIANTS
        </div>
        {DRINKS.map(d => (
          <div
            key={d.id}
            onClick={() => { if (!dispensing) { setSelectedDrink(d.id); playSound('click') } }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              cursor: dispensing ? 'not-allowed' : 'pointer',
              opacity: dispensing ? 0.35 : 1,
              transition: 'opacity .3s',
              background: selectedDrink === d.id ? 'rgba(255,255,255,0.05)' : 'transparent',
              borderRadius: 6, padding: '4px 6px',
            }}
          >
            <div style={{
              width: 9, height: 9, borderRadius: '50%',
              background: selectedDrink === d.id ? '#00ff88' : d.color,
              boxShadow: selectedDrink === d.id ? '0 0 8px #00ff88' : `0 0 4px ${d.color}`,
              flexShrink: 0,
            }} />
            <div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? '8px' : '9px',
                color: selectedDrink === d.id ? '#fff' : 'rgba(255,255,255,0.48)',
                fontWeight: selectedDrink === d.id ? 700 : 400,
                transition: 'color .2s', letterSpacing: 0.5,
              }}>{d.label}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: '#444' }}>{d.price}</div>
            </div>
          </div>
        ))}
        <button
          disabled={!selectedDrink || dispensing}
          onClick={onDispense}
          style={{
            marginTop: 8, padding: '9px 18px',
            background: !selectedDrink || dispensing
              ? 'rgba(30,30,30,0.6)'
              : 'linear-gradient(135deg, #e8a000, #ff6622)',
            border: 'none', borderRadius: 7,
            color: !selectedDrink || dispensing ? '#444' : '#000',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '9px', fontWeight: 900, letterSpacing: '1.5px',
            cursor: !selectedDrink || dispensing ? 'not-allowed' : 'pointer',
            transition: 'all .2s',
            boxShadow: !selectedDrink || dispensing ? 'none' : '0 0 16px rgba(232,160,0,.45)',
          }}
        >
          {dispensing ? '● DISPENSING' : '▶ GET DRINK'}
        </button>
      </div>

      {/* ── 3D Canvas ── */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Canvas
          camera={{ position: [0, 0.5, isMobile ? 5.8 : 5.0], fov: isMobile ? 54 : 48 }}
          shadows
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
        >
          <color attach="background" args={['transparent']} />
          <ambientLight intensity={0.55} />
          <spotLight
            position={[4, 8, 6]} angle={0.3} penumbra={0.55}
            intensity={3.8} color="#fff" castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <spotLight position={[-3, 6, 5]} intensity={1.6} color="#ff4455" />
          <pointLight position={[0, -1.5, 2.8]} intensity={0.7} color="#ff2222" />
          <pointLight position={[0, 3, 2]}     intensity={0.4} color="#ffffff" />

          <Suspense fallback={null}>
            <VendingMachineMesh
              selectedDrink={selectedDrink}
              setSelectedDrink={setSelectedDrink}
              dispensing={dispensing}
              onDispense={onDispense}
            />
            <CokeCan color={canColor} falling={showCan} onLand={onCanLand} />
          </Suspense>

          <OrbitControls
            enableZoom={false} enablePan={false}
            minPolarAngle={Math.PI * 0.28}
            maxPolarAngle={Math.PI * 0.72}
            minAzimuthAngle={-Math.PI / 3.2}
            maxAzimuthAngle={Math.PI / 3.2}
            autoRotate={!dispensing && !selectedDrink}
            autoRotateSpeed={0.45}
          />
        </Canvas>
      </div>

      {/* ── Instructions ── */}
      <div style={{
        position: 'absolute', bottom: isMobile ? 16 : 18,
        left: '50%', transform: 'translateX(-50%)',
        zIndex: 20, pointerEvents: 'none',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '8px', color: 'rgba(255,255,255,0.2)',
        letterSpacing: '1px', whiteSpace: 'nowrap',
      }}>
        DRAG TO ROTATE · SELECT VARIANT · PRESS GET DRINK
      </div>
    </div>
  )
}
