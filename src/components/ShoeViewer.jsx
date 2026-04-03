import { Suspense, useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'
import { TextureLoader, MeshStandardMaterial, Box3, Vector3 } from 'three'

const MODEL_BASE = `${import.meta.env.BASE_URL}assets/models/`

const SHOES = [
  {
    id: 'adidas',
    name: 'Adidas Neo · Ultraboost',
    subtitle: 'Future Runner · Limited Edition',
    price: '$240',
    description: 'A revolutionary design featuring responsive Boost cushioning and an adaptive Primeknit upper. Ready for both the runway and the marathon.',
    tags: ['UltraBoost', 'Primeknit', 'Limited'],
    accent: '#0055ff',
    glow: 'rgba(0,85,255,0.5)',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk X — Concept',
    subtitle: 'Neural Collection · 2077',
    price: 'Not of this era',
    description: 'Reactive fiber-optic upper that pulses with your heartbeat. Neural-mesh sole adapts in real-time. Available exclusively in Neo-Tokyo.',
    tags: ['Fiber-Optic', 'Neural-Mesh', 'AI-Adaptive'],
    accent: '#ff6600',
    glow: 'rgba(255,100,0,0.5)',
  },
]

function AdidasModel() {
  const ref = useRef()
  // Loading the ply file
  const geometry = useLoader(PLYLoader, `${MODEL_BASE}adidas-shoes/11.ply`)
  
  const mat = useMemo(() => {
    geometry.computeVertexNormals()
    return new MeshStandardMaterial({
      vertexColors: geometry.hasAttribute('color'),
      color: geometry.hasAttribute('color') ? 0xffffff : 0xdddddd,
      roughness: 0.3,
      metalness: 0.1,
    })
  }, [geometry])

  useEffect(() => {
    if (!geometry) return
    
    // Scale and center the PLY buffer geometry
    geometry.computeBoundingBox()
    const box = geometry.boundingBox
    const size = new Vector3()
    box.getSize(size)
    const center = new Vector3()
    box.getCenter(center)
    
    const maxDim = Math.max(size.x, size.y, size.z)
    if (maxDim > 0) {
      const scale = 1.3 / maxDim // Reduced scale
      if (ref.current) {
        ref.current.scale.setScalar(scale)
        // Center the geometry so OrbitControls pivots nicely
        geometry.translate(-center.x, -center.y, -center.z)
      }
    }
  }, [geometry])

  return <mesh ref={ref} geometry={geometry} material={mat} castShadow receiveShadow />
}

function CyberpunkModel() {
  const ref = useRef()
  const fbx = useLoader(FBXLoader, `${MODEL_BASE}cyberpunk-sneaker/source/futuristic+sneaker+3d+model.fbx`)
  const texture = useLoader(TextureLoader, `${MODEL_BASE}cyberpunk-sneaker/textures/tripo_image_1eb60c4e_0.jpeg`)

  useEffect(() => {
    if (!fbx || !texture) return
    fbx.traverse(c => {
      if (c.isMesh) {
        c.material = new MeshStandardMaterial({
          map: texture,
          metalness: 0.1, roughness: 0.8,
        })
        c.castShadow = true
      }
    })
    fbx.position.set(0, 0, 0)
    fbx.scale.setScalar(1)
    fbx.updateMatrixWorld(true)

    const box = new Box3().setFromObject(fbx)
    const size = new Vector3(); box.getSize(size)
    const center = new Vector3(); box.getCenter(center)
    const maxDim = Math.max(size.x, size.y, size.z)
    if (maxDim > 0) {
      const scale = 1.3 / maxDim // Reduced scale
      fbx.scale.setScalar(scale)
      fbx.position.copy(center).multiplyScalar(-scale)
      fbx.position.y -= 0.1
    }
  }, [fbx, texture])

  return <primitive ref={ref} object={fbx} />
}

function Scene({ idx }) {
  const accentColor = idx === 0 ? '#6688ff' : '#ff6600'
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[4, 8, 4]} intensity={2.5} castShadow angle={0.3} penumbra={0.6} color={accentColor} />
      <pointLight position={[-4, 1, -2]} intensity={1.5} color={accentColor} />
      <pointLight position={[0, -2, 4]} intensity={0.8} color="#ffffff" />
      <Environment preset="city" />
      <Suspense fallback={null}>
        {idx === 0 ? <AdidasModel /> : <CyberpunkModel />}
      </Suspense>
    </>
  )
}

function LoaderFallback({ accent }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '14px', zIndex: 5,
    }}>
      <div style={{
        width: '44px', height: '44px',
        border: '2px solid rgba(255,255,255,0.1)',
        borderTopColor: accent, borderRadius: '50%',
        animation: 'spin 0.9s linear infinite',
      }} />
      <div style={{
        fontFamily: 'JetBrains Mono', fontSize: '0.62rem',
        letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)',
        textTransform: 'uppercase',
      }}>Loading Model…</div>
    </div>
  )
}

export default function ShoeViewer({ isMobile }) {
  const [idx, setIdx] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const shoe = SHOES[idx]

  useEffect(() => {
    setIsLoading(true)
    const t = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(t)
  }, [idx])

  const prev = () => setIdx(i => Math.max(i - 1, 0))
  const next = () => setIdx(i => Math.min(i + 1, SHOES.length - 1))

  return (
    <div
      style={{
        position: 'relative', width: '100%', height: '100%',
        background: 'linear-gradient(135deg, #040410 0%, #080820 60%, #040410 100%)',
        overflow: 'hidden', cursor: 'grab'
      }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 70% 60% at 50% 40%, ${shoe.glow} 0%, transparent 70%)`,
        transition: 'background 1s ease',
      }} />

      {/* 3D Canvas */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {isLoading && <LoaderFallback accent={shoe.accent} />}
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.5, 3.5], fov: 42 }} shadows gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}>
          <Suspense fallback={null}>
            <Scene idx={idx} />
          </Suspense>
          <OrbitControls 
            enableZoom={true} // Allow zooming to interact more
            autoRotate 
            autoRotateSpeed={1.5}
            minPolarAngle={Math.PI * 0.1} 
            maxPolarAngle={Math.PI * 0.85} 
          />
        </Canvas>
      </div>

      {/* Make it more obvious it's interactive */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        pointerEvents: 'none', zIndex: 10, opacity: isLoading ? 0 : 0.8,
        animation: 'fadeOutPointer 4s forwards'
      }}>
        <div style={{
          padding: '8px 16px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          borderRadius: '20px', color: 'white', fontFamily: 'JetBrains Mono', fontSize: '0.6rem',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          DRAG TO ROTATE
        </div>
      </div>

      {/* Top labels */}
      <div style={{
        position: 'absolute', top: '14px', left: '18px', zIndex: 10,
        fontFamily: 'Space Grotesk', fontWeight: 900, letterSpacing: '0.35em',
        fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase',
      }}>ADIDAS & CYBERPUNK · 3D VAULT</div>

      <div style={{
        position: 'absolute', top: '14px', right: '18px', zIndex: 10,
        fontFamily: 'JetBrains Mono', fontSize: '0.62rem',
        color: shoe.accent, letterSpacing: '0.2em',
      }}>
        {String(idx + 1).padStart(2, '0')} / {String(SHOES.length).padStart(2, '0')}
      </div>

      {/* Swipe arrows -> Move slightly up so they don't block swipe? */}
      {[{ dir: 'prev', pos: 'left', label: '‹', disabled: idx === 0, action: prev },
        { dir: 'next', pos: 'right', label: '›', disabled: idx === SHOES.length - 1, action: next }
      ].map(({ dir, pos, label, disabled, action }) => (
        <button key={dir} onClick={action} disabled={disabled} style={{
          position: 'absolute', [pos]: '10px', top: '40%', transform: 'translateY(-50%)',
          zIndex: 20, width: '38px', height: '38px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.07)', border: `1px solid ${shoe.accent}44`,
          color: '#fff', fontSize: '1.4rem', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s', opacity: disabled ? 0.2 : 1,
        }}>{label}</button>
      ))}

      {/* Bottom info panel (The Ad UI) */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
        background: 'linear-gradient(to top, rgba(4,4,16,0.97) 0%, rgba(4,4,16,0.7) 60%, transparent 100%)',
        padding: isMobile ? '30px 18px 18px' : '40px 28px 24px',
        display: 'flex', flexDirection: isMobile ? 'column' : 'row',
        gap: '14px', alignItems: isMobile ? 'flex-start' : 'flex-end',
        pointerEvents: 'none' /* let drag events pass through to canvas */
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: 'JetBrains Mono', fontSize: '0.55rem',
            letterSpacing: '0.3em', color: shoe.accent,
            textTransform: 'uppercase', marginBottom: '6px',
            transition: 'color 0.5s',
          }}>{shoe.subtitle}</div>
          <div style={{
            fontFamily: 'Space Grotesk', fontWeight: 900,
            fontSize: isMobile ? '1.35rem' : '2.2rem',
            color: '#fff', letterSpacing: '-0.02em', marginBottom: '7px',
          }}>{shoe.name}</div>
          <div style={{
            fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.6, maxWidth: '420px', marginBottom: '12px',
          }}>{shoe.description}</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {shoe.tags.map(tag => (
               <span key={tag} style={{
                fontFamily: 'JetBrains Mono', fontSize: '0.55rem',
                padding: '4px 10px',
                background: `linear-gradient(90deg, ${shoe.accent}22, transparent)`,
                border: `1px solid ${shoe.accent}66`,
                borderRadius: '4px', color: '#fff',
                letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>{tag}</span>
            ))}
          </div>
        </div>
        <div style={{
          flexShrink: 0,
          background: `${shoe.accent}18`,
          border: `1px solid ${shoe.accent}44`,
          borderRadius: '12px', padding: '16px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
          transition: 'all 0.5s',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>EXCLUSIVELY YOURS</div>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: '1.4rem', color: '#fff' }}>{shoe.price}</div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeOutPointer { 0%, 50% { opacity: 0.8; } 100% { opacity: 0; } }
      `}</style>
    </div>
  )
}
