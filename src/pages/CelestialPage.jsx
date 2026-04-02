import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import * as THREE from 'three'
import { EffectComposer, RenderPass, UnrealBloomPass } from 'three-stdlib'
import Navbar from '../components/Navbar'

/* ══════════════════════════════════════════════════
   CELESTIAL ENGINE — Full port of celestial.html
   Solar system with:
   • Volumetric procedural sun (custom GLSL)
   • 6 planets with real textures
   • 25,000 Milky Way particles
   • Asteroid belt
   • OrbitControls (scroll zoom, drag pan)
   • Bloom post-processing
   • Telemetry panel on click
   • Time dilation slider
══════════════════════════════════════════════════ */

const ENTITY_DATA = [
  { name: 'MERCURY', class: 'Barren Rock', radius: 3, distance: 50, speed: 0.04, tex: 'mercury', coreColor: 0x555555, status: '[ DEAD WORLD ]', sCol: '#888', stats: [{ label: 'GRAVITY', value: '3.7 m/s²' }, { label: 'TEMP', value: '167°C' }], coreDetails: [{ layer: 'CRUST', desc: 'Solid Silicate Rock' }, { layer: 'CORE', desc: 'Massive Iron Core' }] },
  { name: 'VENUS', class: 'Toxic Greenhouse', radius: 5.5, distance: 75, speed: 0.015, tex: 'venus', coreColor: 0xff8800, status: '[ EXTREME HAZARD ]', sCol: '#ef4444', stats: [{ label: 'GRAVITY', value: '8.87 m/s²' }, { label: 'TEMP', value: '464°C' }], coreDetails: [{ layer: 'CRUST', desc: 'Basaltic Rock' }, { layer: 'CORE', desc: 'Liquid Iron-Nickel' }] },
  { name: 'EARTH', class: 'Terrestrial Planet', radius: 6, distance: 110, speed: 0.01, isEarth: true, coreColor: 0xff4400, status: '[ HABITABLE ZONE ]', sCol: '#4ade80', stats: [{ label: 'GRAVITY', value: '9.8 m/s²' }, { label: 'TEMP', value: '15°C' }, { label: 'MOONS', value: '1' }], coreDetails: [{ layer: 'CRUST', desc: 'Silicate Rocks (0-40km)' }, { layer: 'MANTLE', desc: 'Viscous Silicate (2890km)' }, { layer: 'CORE', desc: 'Iron-Nickel Alloy' }] },
  { name: 'MARS', class: 'Dust Planet', radius: 4, distance: 150, speed: 0.008, tex: 'mars', coreColor: 0xcc3300, status: '[ COLONIZATION TARGET ]', sCol: '#facc15', stats: [{ label: 'GRAVITY', value: '3.71 m/s²' }, { label: 'TEMP', value: '-65°C' }], coreDetails: [{ layer: 'CRUST', desc: 'Iron Oxide Dust' }, { layer: 'CORE', desc: 'Liquid Iron & Sulfur' }] },
  { name: 'JUPITER', class: 'Gas Giant', radius: 18, distance: 220, speed: 0.002, tex: 'jupiter', coreColor: 0x555555, status: '[ HIGH GRAVITY ]', sCol: '#ef4444', stats: [{ label: 'GRAVITY', value: '24.79 m/s²' }, { label: 'TEMP', value: '-110°C' }], coreDetails: [{ layer: 'ATMOSPHERE', desc: 'Hydrogen (90%)' }, { layer: 'CORE', desc: 'Dense Rock & Ice' }] },
  { name: 'SATURN', class: 'Gas Giant', radius: 14, distance: 310, speed: 0.0009, tex: 'saturn', hasRings: true, coreColor: 0x666666, status: '[ RING SYSTEM ]', sCol: '#facc15', stats: [{ label: 'GRAVITY', value: '10.44 m/s²' }, { label: 'TEMP', value: '-140°C' }], coreDetails: [{ layer: 'ATMOSPHERE', desc: 'Hydrogen, Helium' }, { layer: 'CORE', desc: 'Rocky Silicates' }] },
]

const TEXTURES = {
  milkyway: '/assets/textures/starfield10k.jpg',
  earthMap: '/assets/textures/earth-blue-marble.jpg',
  earthBump: '/assets/textures/earth-topology.png',
  earthNight: '/assets/textures/earth-night.jpg',
  earthClouds: '/assets/textures/earth-clouds.png',
  mercury: '/assets/textures/mercurymap.jpg',
  venus: '/assets/textures/venusmap.jpg',
  mars: '/assets/textures/marsmap1k.jpg',
  jupiter: '/assets/textures/jupitermap.jpg',
  saturn: '/assets/textures/saturnmap.jpg',
  saturnRing: '/assets/textures/saturnringcolor.jpg',
  moon: '/assets/textures/moonmap1k.jpg',
}

export default function CelestialPage() {
  const containerRef = useRef(null)
  const rafRef = useRef(null)
  const engineRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [telemetry, setTelemetry] = useState(null)
  const [timeSpeed, setTimeSpeed] = useState(1)
  const timeRef = useRef(1)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // ─── Three.js setup ───
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.1, 10000)
    camera.position.set(0, 800, 1500)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' })
    renderer.setSize(el.clientWidth, el.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    el.appendChild(renderer.domElement)

    // HD Bloom Pass
    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(el.clientWidth, el.clientHeight), 1.2, 0.5, 0)
    composer.addPass(bloomPass)

    const texLoader = new THREE.TextureLoader()
    texLoader.crossOrigin = 'anonymous'
    const loadTex = (url) => {
      const t = texLoader.load(url, undefined, undefined, () => {})
      t.anisotropy = renderer.capabilities.getMaxAnisotropy()
      return t
    }

    scene.add(new THREE.AmbientLight(0xffffff, 0.15))

    // ─── Orbit Controls (manual) ───
    let isDragging = false, lastMouse = { x: 0, y: 0 }
    let spherical = { theta: 0, phi: Math.PI / 3, radius: 1700 }
    let target = new THREE.Vector3(0, 0, 0)

    const updateCamera = () => {
      camera.position.x = target.x + spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta)
      camera.position.y = target.y + spherical.radius * Math.cos(spherical.phi)
      camera.position.z = target.z + spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta)
      camera.lookAt(target)
    }
    updateCamera()

    el.addEventListener('mousedown', (e) => { isDragging = true; lastMouse = { x: e.clientX, y: e.clientY } })
    el.addEventListener('mouseup', () => { isDragging = false })
    el.addEventListener('mousemove', (e) => {
      if (!isDragging) return
      const dx = (e.clientX - lastMouse.x) * 0.005
      const dy = (e.clientY - lastMouse.y) * 0.005
      spherical.theta -= dx
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi + dy))
      lastMouse = { x: e.clientX, y: e.clientY }
      updateCamera()
    })
    el.addEventListener('wheel', (e) => {
      spherical.radius = Math.max(50, Math.min(3000, spherical.radius + e.deltaY * 1.5))
      updateCamera()
    }, { passive: true })

    // ─── Milky Way Background ───
    const bgGeo = new THREE.SphereGeometry(4000, 64, 64)
    const bgMat = new THREE.MeshBasicMaterial({ map: loadTex(TEXTURES.milkyway), side: THREE.BackSide, depthWrite: false, color: 0xcccccc })
    scene.add(new THREE.Mesh(bgGeo, bgMat))

    // Particle galaxy
    const pm = window.innerWidth < 768 ? 10000 : 25000
    const pg = new THREE.BufferGeometry()
    const pos = new Float32Array(pm * 3), cols = new Float32Array(pm * 3)
    for (let i = 0; i < pm; i++) {
      const r = 1000 + Math.random() * 2500, t = Math.random() * Math.PI * 2
      const y = (Math.random() - 0.5) * Math.random() * 800
      pos[i * 3] = r * Math.cos(t); pos[i * 3 + 1] = y; pos[i * 3 + 2] = r * Math.sin(t)
      const c = new THREE.Color()
      const m = Math.random()
      if (m > 0.8) c.setHex(0x5588ff)
      else if (m > 0.5) c.setHex(0xffaa55)
      else c.setHex(0xffffff)
      cols[i * 3] = c.r; cols[i * 3 + 1] = c.g; cols[i * 3 + 2] = c.b
    }
    pg.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    pg.setAttribute('color', new THREE.BufferAttribute(cols, 3))
    const galaxyPts = new THREE.Points(pg, new THREE.PointsMaterial({ size: 2.5, vertexColors: true, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending }))
    galaxyPts.rotation.x = Math.PI / 8
    scene.add(galaxyPts)

    // ─── Volumetric Sun ───
    const sunUniforms = { time: { value: 0 }, color1: { value: new THREE.Color(0xff4400) }, color2: { value: new THREE.Color(0xffaa00) } }
    const sunShader = new THREE.ShaderMaterial({
      uniforms: sunUniforms,
      vertexShader: `varying vec2 vUv; varying vec3 vPosition; void main(){vUv=uv;vPosition=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
      fragmentShader: `
        uniform float time; uniform vec3 color1; uniform vec3 color2; varying vec3 vPosition;
        float hash(vec3 p){p=fract(p*0.3183099+.1);p*=17.0;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
        float noise(vec3 x){vec3 i=floor(x);vec3 f=fract(x);f=f*f*(3.0-2.0*f);
          return mix(mix(mix(hash(i+vec3(0,0,0)),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
                     mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
        float fbm(vec3 p){float f=0.0;f+=0.5*noise(p);p*=2.02;f+=0.25*noise(p);p*=2.03;f+=0.125*noise(p);p*=2.01;f+=0.0625*noise(p);return f/0.9375;}
        void main(){vec3 p=vPosition*0.15+time*0.3;float n=fbm(p);vec3 col=mix(color1,color2,n*1.5);gl_FragColor=vec4(col,1.0);}
      `
    })
    const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(25, 64, 64), sunShader)
    scene.add(sunMesh)

    const sunLight = new THREE.PointLight(0xffffee, 3, 4000)
    scene.add(sunLight)

    // ─── Planets ───
    const interactable = []
    const orbitGroups = []
    const planetMeshes = []

    ENTITY_DATA.forEach((data) => {
      const orbitGroup = new THREE.Group()
      orbitGroup.userData.speed = data.speed
      orbitGroup.userData.angle = Math.random() * Math.PI * 2

      const geo = new THREE.SphereGeometry(data.radius, 64, 64)
      let mat
      if (data.isEarth) {
        mat = new THREE.MeshStandardMaterial({
          map: loadTex(TEXTURES.earthMap),
          bumpMap: loadTex(TEXTURES.earthBump), bumpScale: 0.2,
          emissiveMap: loadTex(TEXTURES.earthNight), emissive: new THREE.Color(0xffffee), emissiveIntensity: 2,
        })
        // Clouds
        const cloudMat = new THREE.MeshStandardMaterial({ map: loadTex(TEXTURES.earthClouds), transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false })
        const cloudMesh = new THREE.Mesh(new THREE.SphereGeometry(data.radius + 0.15, 64, 64), cloudMat)
        const earthWrapper = new THREE.Mesh(geo, mat)
        earthWrapper.position.x = data.distance
        earthWrapper.userData = { ...data, isPlanet: true }
        earthWrapper.add(cloudMesh)
        orbitGroup.add(earthWrapper)
        interactable.push(earthWrapper)
        planetMeshes.push({ mesh: earthWrapper, data, orbitGroup })
      } else {
        mat = new THREE.MeshStandardMaterial({ map: loadTex(TEXTURES[data.tex || 'mercury']), roughness: 0.7 })
        const mesh = new THREE.Mesh(geo, mat)
        mesh.position.x = data.distance
        mesh.userData = { ...data, isPlanet: true }

        if (data.hasRings) {
          const ringGeo = new THREE.RingGeometry(data.radius + 4, data.radius + 18, 128)
          const ringMat = new THREE.MeshStandardMaterial({ map: loadTex(TEXTURES.saturnRing), transparent: true, opacity: 0.9, side: THREE.DoubleSide })
          const ring = new THREE.Mesh(ringGeo, ringMat)
          ring.rotation.x = Math.PI / 2 + 0.2
          mesh.add(ring)
        }
        orbitGroup.add(mesh)
        interactable.push(mesh)
        planetMeshes.push({ mesh, data, orbitGroup })
      }

      const pathMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.05, side: THREE.DoubleSide })
      const pathMesh = new THREE.Mesh(new THREE.RingGeometry(data.distance - 0.3, data.distance + 0.3, 128), pathMat)
      pathMesh.rotation.x = Math.PI / 2
      scene.add(pathMesh)

      scene.add(orbitGroup)
      orbitGroups.push(orbitGroup)
    })

    // ─── Asteroid Belt ───
    const beltCount = window.innerWidth < 768 ? 800 : 2000
    const asteroids = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(0.8, 0), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 1 }), beltCount)
    const dummy = new THREE.Object3D()
    for (let i = 0; i < beltCount; i++) {
      const r = 180 + Math.random() * 25, t = Math.random() * Math.PI * 2
      dummy.position.set(Math.cos(t) * r, (Math.random() - 0.5) * 8, Math.sin(t) * r)
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
      const sc = Math.random() * 1.5 + 0.2; dummy.scale.set(sc, sc, sc)
      dummy.updateMatrix(); asteroids.setMatrixAt(i, dummy.matrix)
    }
    scene.add(asteroids)

    // ─── Raycaster for planet click ───
    const raycaster = new THREE.Raycaster()
    const mouse2D = new THREE.Vector2()

    el.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.cel-panel')) return
      const rect = el.getBoundingClientRect()
      mouse2D.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse2D.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse2D, camera)
      const hits = raycaster.intersectObjects(interactable, false)
      if (hits.length > 0) {
        const d = hits[0].object.userData
        setTelemetry(d)
        // Smooth camera zoom to planet
        const planetWorldPos = new THREE.Vector3()
        hits[0].object.getWorldPosition(planetWorldPos)
        target.copy(planetWorldPos)
        spherical.radius = d.radius * 8
        updateCamera()
      }
    })

    // ─── Resize ───
    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(el.clientWidth, el.clientHeight)
      composer.setSize(el.clientWidth, el.clientHeight)
    }
    window.addEventListener('resize', onResize)

    // ─── Animate ───
    const clock = new THREE.Clock()
    let baseTime = 0

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate)
      const delta = clock.getDelta()
      baseTime += delta * timeRef.current

      sunUniforms.time.value = baseTime * 0.5
      sunMesh.rotation.y += delta * 0.05
      galaxyPts.rotation.y += delta * 0.002

      planetMeshes.forEach(({ mesh, data, orbitGroup }) => {
        orbitGroup.userData.angle = (orbitGroup.userData.angle || 0) + data.speed * delta * timeRef.current * 60
        orbitGroup.rotation.y = orbitGroup.userData.angle
        mesh.rotation.y += delta * 0.3
      })
      asteroids.rotation.y += delta * 0.001 * timeRef.current

      composer.render()
    }
    animate()

    setTimeout(() => setLoading(false), 2000)

    engineRef.current = { scene, renderer }

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [])

  const handleTimeChange = (e) => {
    const v = parseFloat(e.target.value)
    setTimeSpeed(v)
    timeRef.current = v
  }

  return (
    <div className="cel-page">
      {/* Loading */}
      {loading && (
        <div className="cel-loading">
          <div className="cel-load-ring" />
          <div className="cel-load-title">ENTERING CELESTIAL MODE</div>
          <div className="cel-load-sub">Calibrating gravitation cores…</div>
        </div>
      )}

      <Navbar />

      {/* WebGL Canvas */}
      <div ref={containerRef} className="cel-canvas" />

      {/* HUD — Top Left */}
      <div className="cel-hud-tl">
        <Link to="/" className="cel-back-btn">← Return to Hub</Link>
        <div>
          <div className="cel-sector">{'>'} Sector 7G / Sol System</div>
          <div className="cel-title-hud">COSMOS SIMULATOR</div>
        </div>
      </div>

      {/* Telemetry Panel */}
      {telemetry && (
        <div className="cel-panel glass-panel">
          <div className="cel-panel-header">
            <div>
              <h2 className="cel-panel-name" style={{ color: telemetry.sCol }}>{telemetry.name}</h2>
              <div className="cel-panel-class">{telemetry.class}</div>
            </div>
            <button className="cel-panel-close" onClick={() => setTelemetry(null)}>✕</button>
          </div>

          <div className="cel-stats">
            {telemetry.stats?.map(s => (
              <div key={s.label} className="cel-stat-row">
                <span className="cel-stat-label">{s.label}</span>
                <span className="cel-stat-val">{s.value}</span>
              </div>
            ))}
          </div>

          <div className="cel-status" style={{ borderColor: `${telemetry.sCol}44`, color: telemetry.sCol }}>
            {telemetry.status}
          </div>

          {telemetry.coreDetails && (
            <div className="cel-core-details">
              <div className="cel-core-title">⚛ STRUCTURAL ANALYSIS</div>
              {telemetry.coreDetails.map(l => (
                <div key={l.layer} className="cel-core-row">
                  <span className="cel-core-layer">{l.layer}</span>
                  <span className="cel-core-desc">{l.desc}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Time Dilation */}
      <div className="cel-time glass-panel">
        <span className="cel-time-label">TIME DILATION</span>
        <input type="range" min="0" max="10" step="0.1" value={timeSpeed}
          onChange={handleTimeChange} className="cel-slider" />
        <span className="cel-time-speed">{timeSpeed.toFixed(1)}×</span>
      </div>

      {/* Bottom hint */}
      <div className="cel-hint">DRAG TO PAN | CLICK PLANET | SCROLL ZOOM</div>
    </div>
  )
}
