import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, MeshDistortMaterial, Sphere, Points, PointMaterial, Torus, Stars, ContactShadows, Float, MeshWobbleMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'
import '../labs.css'
import CoffeeBrewerUI from '../components/CoffeeBrewerUI'
import EntropyCremaCanvas from '../components/EntropyCremaCanvas'

/* ── MODULE CONTENT ── */
const MODULES = [
  {
    id: 'mod-neural',
    name: 'Neural Core',
    tag: '01 / DASHBOARD UI',
    desc: 'Demonstrates advanced WebGL state synchronization and React layout micro-animations. These techniques are highly applicable for building responsive monitoring dashboards and SaaS platforms.',
    tech: ['State Sync', 'WebGL', 'React Three Fiber', 'GSAP'],
    color: '#d97706',
  },
  {
    id: 'mod-brew',
    name: 'Gaggia PRO-MOD',
    tag: '02 / HARDWARE SIMULATION',
    desc: 'A full frontend replication of a high-end coffee brewer dashboard. Showcases complex state management tying together functional UI buttons, live graphing, analog timers, and synchronized fluid CSS/SVG animation workflows.',
    tech: ['React State', 'GSAP Timelines', 'Web Audio', 'SVG Engine'],
    color: '#f59e0b',
  },
  {
    id: 'mod-compiler',
    name: 'Compiler Pipeline',
    tag: '03 / DATA VISUALISATION',
    desc: 'Showcases heavy instance geometry manipulation and Framer-grade smooth staggering. Used to represent deployment architectures, data pipelines, and network graphs in complex enterprise web apps.',
    tech: ['InstancedMesh', 'Math.sin', 'React Spring'],
    color: '#3ddc84',
  },
  {
    id: 'mod-music',
    name: 'Spatial Audio',
    tag: '04 / INTERACTIVE MEDIA',
    desc: 'Highlights dynamic media synchronization with shader modifications. Perfect for next-gen interactive media apps, streaming services, or landing pages requiring highly reactive visual feedback.',
    tech: ['TorusKnot', 'MeshWobbleMaterial', 'WebGL'],
    color: '#a855f7',
  },
  {
    id: 'mod-entropy',
    name: 'Entropy Crema',
    tag: '05 / KINETIC TYPOGRAPHY',
    desc: 'A pure creative expression demonstrating bespoke canvas engineering, kinetic typography, and mathematical cursor tracking. Elevates brand landing pages from static layouts to unforgettable, cinematic web experiences.',
    tech: ['Canvas API', 'Kinetic Particles', 'Mouse Tracking', 'Typography'],
    color: '#f97316',
  },
]

/* ── VISUALIZERS (THREE.JS FABRICS) ── */

// 1. Neural Core (Node Sphere)
function NeuralVisualizer({ active }) {
  const meshRef = useRef()
  useFrame((state, delta) => {
    if (active && meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2
      meshRef.current.rotation.y += delta * 0.3
    }
  })
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2, 1]} />
        <meshStandardMaterial color="#d97706" wireframe wireframeLinewidth={2} emissive="#d97706" emissiveIntensity={0.5} />
      </mesh>
      {/* Inner glowing core */}
      <Sphere args={[1.2, 32, 32]}>
        <meshStandardMaterial color="#fcd34d" emissive="#d97706" emissiveIntensity={2} transparent opacity={0.8} />
      </Sphere>
    </Float>
  )
}

// 2. Mixology (Fluid Bubble)
function MixologyVisualizer({ active }) {
  return (
    <Float speed={3} rotationIntensity={2} floatIntensity={3}>
      <Sphere args={[2, 64, 64]}>
        <MeshDistortMaterial
          color="#f59e0b"
          attach="material"
          distort={0.6}
          speed={active ? 2.5 : 0.5}
          roughness={0.1}
          metalness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </Sphere>
    </Float>
  )
}

// 3. Compiler (Assembling Cubes)
function CompilerVisualizer({ active }) {
  const groupRef = useRef()
  useFrame((state) => {
    if (active && groupRef.current) {
      const t = state.clock.getElapsedTime()
      groupRef.current.children.forEach((child, i) => {
        child.position.y = Math.sin(t * 2 + i) * 0.5
        child.rotation.x = t * 0.5 + i
        child.rotation.y = t * 0.5 + i
      })
    }
  })
  return (
    <group ref={groupRef}>
      {[...Array(27)].map((_, i) => {
        const x = (i % 3) * 1.5 - 1.5
        const y = Math.floor((i / 3) % 3) * 1.5 - 1.5
        const z = Math.floor(i / 9) * 1.5 - 1.5
        return (
          <mesh key={i} position={[x, y, z]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#3ddc84" metalness={0.5} roughness={0.2} emissive="#065f46" emissiveIntensity={0.2} />
          </mesh>
        )
      })}
    </group>
  )
}

// 4. Spatial Audio (Wobble Torus)
function SpatialAudioVisualizer({ active }) {
  const torusRef = useRef()
  useFrame((state, delta) => {
    if (active && torusRef.current) {
      torusRef.current.rotation.z += delta * 0.5
      torusRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.3
    }
  })
  return (
    <Float speed={1} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={torusRef}>
        <torusKnotGeometry args={[1.5, 0.4, 128, 32]} />
        <MeshWobbleMaterial color="#a855f7" factor={1} speed={active ? 3 : 0.5} metalness={0.6} roughness={0.1} emissive="#581c87" emissiveIntensity={0.5} />
      </mesh>
    </Float>
  )
}

/* ── MAIN SCENE CONTROLLER ── */
function LabScene({ activeIdx }) {
  // Only render 3D elements for Neural (0), Compiler (2), Audio (3)
  if (activeIdx === 1 || activeIdx === 4) return null;

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} color="#7c3aed" intensity={1} />
      
      {/* Background stars for a deep space aesthetic */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <group position={[3, 0, 0]}>
        {activeIdx === 0 && <NeuralVisualizer active={true} />}
        {activeIdx === 2 && <CompilerVisualizer active={true} />}
        {activeIdx === 3 && <SpatialAudioVisualizer active={true} />}
      </group>

      <ContactShadows position={[3, -3, 0]} opacity={0.4} scale={20} blur={2} far={4} color="#000000" />
    </>
  )
}

/* ── MAIN PAGE COMPONENT ── */
export default function LabsPage() {
  const [activeIdx, setActiveIdx] = useState(0)
  const infoRef = useRef(null)

  const goTo = (idx) => {
    if (idx === activeIdx) return
    // Animate UI out
    gsap.to(infoRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      onComplete: () => {
        setActiveIdx(idx)
        // Animate UI in
        gsap.to(infoRef.current, {
          opacity: (idx === 1 || idx === 4) ? 0 : 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out'
        })
      }
    })
  }

  const next = () => { if (activeIdx < MODULES.length - 1) goTo(activeIdx + 1) }
  const prev = () => { if (activeIdx > 0) goTo(activeIdx - 1) }

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next()
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeIdx])

  const mod = MODULES[activeIdx]

  return (
    <div className="labs-slider-page" style={{ position: 'relative', width: '100vw', height: '100vh', backgroundColor: '#05050d', overflow: 'hidden' }}>
      
      {/* ── THREE.JS CANVAS (OUTPUT) ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, transition: 'opacity 0.6s', opacity: [0, 2, 3].includes(activeIdx) ? 1 : 0 }}>
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <LabScene activeIdx={activeIdx} />
          {/* Subtle slow pan */}
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate={true}
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Canvas>
      </div>

      {/* ── CUSTOM DOM COMPONENTS ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: activeIdx === 1 ? 'auto' : 'none', transition: 'opacity 0.6s, transform 0.6s', opacity: activeIdx === 1 ? 1 : 0, transform: activeIdx === 1 ? 'scale(1)' : 'scale(1.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {activeIdx === 1 && <CoffeeBrewerUI active={activeIdx === 1} />}
      </div>
      
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: activeIdx === 4 ? 'auto' : 'none', transition: 'opacity 1s ease', opacity: activeIdx === 4 ? 1 : 0 }}>
        {activeIdx === 4 && <EntropyCremaCanvas active={activeIdx === 4} />}
      </div>

      {/* ── GRADIENT OVERLAY FOR TEXT READABILITY ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', transition: 'opacity 0.6s', opacity: (activeIdx === 1 || activeIdx === 4) ? 0 : 1, background: 'linear-gradient(90deg, rgba(5,5,13,0.95) 0%, rgba(5,5,13,0.6) 40%, transparent 100%)', zIndex: 1 }} />

      {/* ── TOP HUD ── */}
      <div className="labs-hud-top" style={{ zIndex: 10, position: 'absolute', top: 0, width: '100%', padding: '30px 40px', display: 'flex', justifyContent: 'space-between', boxSizing: 'border-box' }}>
        <Link to="/" className="labs-back-btn hover:text-white transition-colors flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '12px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Hub
        </Link>
        <div style={{ letterSpacing: '4px', textTransform: 'uppercase', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
          SYSTEM OUTPUT: LABS
        </div>
      </div>

      {/* ── INFORMATION PANEL (LEFT UI) ── */}
      <div 
        ref={infoRef}
        style={{
          position: 'absolute',
          left: '5%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '100%',
          maxWidth: '450px',
          zIndex: 10,
          padding: '40px',
          opacity: (activeIdx === 1 || activeIdx === 4) ? 0 : 1, // Completely hide logic panel for Coffee & Entropy
          pointerEvents: (activeIdx === 1 || activeIdx === 4) ? 'none' : 'auto',
          transition: 'opacity 0.5s ease'
        }}
      >
        <p style={{ color: mod.color, letterSpacing: '3px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, marginBottom: '16px' }}>
          {mod.tag}
        </p>
        <h1 style={{ color: '#fff', fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1, margin: '0 0 24px', letterSpacing: '-1px', fontFamily: '"Space Grotesk", sans-serif', fontWeight: 800 }}>
          {mod.name}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: 1.7, marginBottom: '32px' }}>
          {mod.desc}
        </p>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {mod.tech.map((t, idx) => (
            <span key={idx} style={{ padding: '6px 12px', border: `1px solid ${mod.color}40`, borderRadius: '4px', fontSize: '11px', color: mod.color, textTransform: 'uppercase', letterSpacing: '1px' }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── NAVIGATION CONTROLS (BOTTOM HUD) ── */}
      <div style={{ position: 'absolute', bottom: '40px', left: '0', width: '100%', padding: '0 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button 
            onClick={prev}
            disabled={activeIdx === 0}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: activeIdx === 0 ? 'rgba(255,255,255,0.2)' : '#fff', width: '44px', height: '44px', borderRadius: '50%', cursor: activeIdx === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            {MODULES.map((m, i) => (
              <div 
                key={i} 
                onClick={() => goTo(i)}
                style={{ 
                  width: i === activeIdx ? '24px' : '6px', 
                  height: '6px', 
                  borderRadius: '3px', 
                  backgroundColor: i === activeIdx ? mod.color : 'rgba(255,255,255,0.2)', 
                  transition: 'all 0.4s ease',
                  cursor: 'pointer',
                  boxShadow: i === activeIdx ? `0 0 10px ${mod.color}` : 'none'
                }} 
              />
            ))}
          </div>

          <button 
            onClick={next}
            disabled={activeIdx === MODULES.length - 1}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: activeIdx === MODULES.length - 1 ? 'rgba(255,255,255,0.2)' : '#fff', width: '44px', height: '44px', borderRadius: '50%', cursor: activeIdx === MODULES.length - 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', fontSize: '14px', letterSpacing: '4px', color: 'rgba(255,255,255,0.3)', fontWeight: 'bold' }}>
          <span style={{ color: mod.color, fontSize: '32px', lineHeight: '0.8', marginRight: '6px' }}>
            0{activeIdx + 1}
          </span>
          / 05
        </div>
      </div>
    </div>
  )
}
