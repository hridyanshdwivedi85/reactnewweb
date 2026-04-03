import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import * as THREE from 'three'
import { EffectComposer, RenderPass, UnrealBloomPass } from 'three-stdlib'
import Navbar from '../components/Navbar'

/* ══════════════════════════════════════════════════
   CELESTIAL ENGINE — High-Fidelity Solar System
   • Real sun point-light hitting every planet
   • Click planet → camera locks, orbit/zoom/drag around it
   • 25,000 Milky Way particles
   • Bloom post-processing
   • Full mobile responsive
══════════════════════════════════════════════════ */

const ENTITY_DATA = [
  { name: 'MERCURY', class: 'Barren Rock',        radius: 3,  distance: 50,  speed: 0.04,   tex: 'mercury', coreColor: 0x555555, status: '[ DEAD WORLD ]',          sCol: '#888',    stats: [{ label: 'GRAVITY', value: '3.7 m/s²' }, { label: 'TEMP', value: '167°C' },   { label: 'LAT/LONG', value: '14.2° N / 88.5° W' }], coreDetails: [{ layer: 'CRUST', desc: 'Solid Silicate Rock' }, { layer: 'CORE', desc: 'Massive Iron Core' }] },
  { name: 'VENUS',   class: 'Toxic Greenhouse',   radius: 5.5,distance: 75,  speed: 0.015,  tex: 'venus',   coreColor: 0xff8800, status: '[ EXTREME HAZARD ]',       sCol: '#ef4444', stats: [{ label: 'GRAVITY', value: '8.87 m/s²' }, { label: 'TEMP', value: '464°C' },   { label: 'LAT/LONG', value: '1.2° S / 104.3° E' }],  coreDetails: [{ layer: 'CRUST', desc: 'Basaltic Rock' }, { layer: 'CORE', desc: 'Liquid Iron-Nickel' }] },
  { name: 'EARTH',   class: 'Terrestrial Planet', radius: 6,  distance: 110, speed: 0.01,   isEarth: true,  coreColor: 0xff4400, status: '[ HABITABLE ZONE ]',        sCol: '#4ade80', stats: [{ label: 'GRAVITY', value: '9.8 m/s²' },  { label: 'TEMP', value: '15°C' },    { label: 'MOONS', value: '1' }],                       coreDetails: [{ layer: 'CRUST', desc: 'Silicate Rocks (0-40km)' }, { layer: 'MANTLE', desc: 'Viscous Silicate (2890km)' }, { layer: 'CORE', desc: 'Iron-Nickel Alloy' }] },
  { name: 'MARS',    class: 'Dust Planet',         radius: 4,  distance: 150, speed: 0.008,  tex: 'mars',    coreColor: 0xcc3300, status: '[ COLONIZATION TARGET ]',   sCol: '#facc15', stats: [{ label: 'GRAVITY', value: '3.71 m/s²' }, { label: 'TEMP', value: '-65°C' },   { label: 'LAT/LONG', value: '18.6° N / 226.2° E' }], coreDetails: [{ layer: 'CRUST', desc: 'Iron Oxide Dust' }, { layer: 'CORE', desc: 'Liquid Iron & Sulfur' }] },
  { name: 'JUPITER', class: 'Gas Giant',           radius: 18, distance: 220, speed: 0.002,  tex: 'jupiter', coreColor: 0x555555, status: '[ HIGH GRAVITY ]',           sCol: '#ef4444', stats: [{ label: 'GRAVITY', value: '24.79 m/s²' }, { label: 'TEMP', value: '-110°C' }],                  coreDetails: [{ layer: 'ATMOSPHERE', desc: 'Hydrogen (90%)' }, { layer: 'CORE', desc: 'Dense Rock & Ice' }] },
  { name: 'SATURN',  class: 'Gas Giant',           radius: 14, distance: 310, speed: 0.0009, tex: 'saturn',  hasRings: true, coreColor: 0x666666, status: '[ RING SYSTEM ]', sCol: '#facc15', stats: [{ label: 'GRAVITY', value: '10.44 m/s²' }, { label: 'TEMP', value: '-140°C' }],               coreDetails: [{ layer: 'ATMOSPHERE', desc: 'Hydrogen, Helium' }, { layer: 'CORE', desc: 'Rocky Silicates' }] },
]

const TEXTURES = {
  milkyway:    'assets/textures/starfield10k.jpg',
  earthMap:    'assets/textures/earth-blue-marble.jpg',
  earthBump:   'assets/textures/earth-topology.png',
  earthNight:  'assets/textures/earth-night.jpg',
  earthClouds: 'assets/textures/earth-clouds.png',
  mercury:     'assets/textures/mercurymap.jpg',
  venus:       'assets/textures/venusmap.jpg',
  mars:        'assets/textures/marsmap1k.jpg',
  jupiter:     'assets/textures/jupitermap.jpg',
  saturn:      'assets/textures/saturnmap.jpg',
  saturnRing:  'assets/textures/saturnringcolor.jpg',
  moon:        'assets/textures/moonmap1k.jpg',
}

export default function CelestialPage() {
  const containerRef = useRef(null)
  const rafRef       = useRef(null)
  const engineRef    = useRef(null)
  const planetsRef   = useRef({})

  const [exploded,  setExploded]  = useState({})
  const [loading,   setLoading]   = useState(true)
  const [telemetry, setTelemetry] = useState(null)
  const [timeSpeed, setTimeSpeed] = useState(1)
  const [lockedPlanet, setLockedPlanet] = useState(null)
  const [panelExpanded, setPanelExpanded] = useState(false)
  const [isLandscapeMobile, setIsLandscapeMobile] = useState(false)

  const timeRef        = useRef(1)
  const lockedRef      = useRef(null)   // mesh we're orbiting
  const lockedRadiusRef = useRef(null)  // orbit radius around locked planet
  const breakdownFxRef = useRef({})

  useEffect(() => {
    const isSmallTouchDevice = () =>
      window.matchMedia('(max-width: 1024px)').matches &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0)

    const requestFullscreenLandscape = async () => {
      const root = document.documentElement
      const isLandscape = window.innerWidth > window.innerHeight
      const shouldFullscreen = isSmallTouchDevice() && isLandscape
      setIsLandscapeMobile(shouldFullscreen)
      if (!shouldFullscreen) return

      try {
        if (!document.fullscreenElement && root.requestFullscreen) {
          await root.requestFullscreen({ navigationUI: 'hide' })
        } else if (!document.fullscreenElement && root.webkitRequestFullscreen) {
          root.webkitRequestFullscreen()
        }
      } catch {
        // Some mobile browsers block fullscreen without explicit gesture.
      }
    }

    requestFullscreenLandscape()
    window.addEventListener('orientationchange', requestFullscreenLandscape)
    window.addEventListener('resize', requestFullscreenLandscape, { passive: true })
    return () => {
      window.removeEventListener('orientationchange', requestFullscreenLandscape)
      window.removeEventListener('resize', requestFullscreenLandscape)
    }
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    /* ── Three.js setup ── */
    const scene    = new THREE.Scene()
    const isMobile = window.innerWidth < 768
    const camera   = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.1, 20000)
    camera.position.set(0, 800, 1500)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      powerPreference: 'high-performance',
    })
    renderer.setSize(el.clientWidth, el.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2))
    renderer.toneMapping          = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure  = 1.4
    renderer.shadowMap.enabled    = true
    renderer.shadowMap.type       = THREE.PCFSoftShadowMap
    el.appendChild(renderer.domElement)

    /* ── Post-processing Bloom ── */
    const composer  = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(el.clientWidth, el.clientHeight),
      isMobile ? 0.9 : 1.4,  // strength
      0.4,                   // radius
      0.0                    // threshold
    )
    composer.addPass(bloomPass)

    /* ── Texture loader ── */
    const texLoader = new THREE.TextureLoader()
    texLoader.crossOrigin = 'anonymous'
    const loadTex = (url) => {
      const t = texLoader.load(url, undefined, undefined, () => {})
      t.anisotropy = renderer.capabilities.getMaxAnisotropy()
      return t
    }

    /* ── Very dim ambient so sun does the work ── */
    scene.add(new THREE.AmbientLight(0x334466, 0.15))

    /* ─────────────────────────────────────────
       ORBIT CONTROLS — two modes:
       1. FREE  → orbit around (0,0,0)
       2. LOCKED → orbit around a specific planet
    ───────────────────────────────────────── */
    let spherical = { theta: 0.3, phi: Math.PI / 3, radius: 1700 }
    let currentSpherical = { ...spherical }
    let isDragging = false, lastMouse = { x: 0, y: 0 }
    let target = new THREE.Vector3(0, 0, 0)
    let currentTarget = new THREE.Vector3(0, 0, 0)

    // Touch state
    let lastTouchDist = null
    let lastTouchMid  = null

    const updateCamera = () => {
      const sp = currentSpherical
      const ct = currentTarget
      camera.position.x = ct.x + sp.radius * Math.sin(sp.phi) * Math.sin(sp.theta)
      camera.position.y = ct.y + sp.radius * Math.cos(sp.phi)
      camera.position.z = ct.z + sp.radius * Math.sin(sp.phi) * Math.cos(sp.theta)
      camera.lookAt(ct)
    }

    const onMouseDown  = (e) => { if (e.target.closest?.('.cel-panel')) return; isDragging = true; lastMouse = { x: e.clientX, y: e.clientY } }
    const onMouseUp    = ()  => { isDragging = false }
    const onMouseMove  = (e) => {
      if (!isDragging) return
      const dx = (e.clientX - lastMouse.x) * 0.005
      const dy = (e.clientY - lastMouse.y) * 0.005
      spherical.theta -= dx
      spherical.phi    = Math.max(0.05, Math.min(Math.PI - 0.05, spherical.phi + dy))
      lastMouse = { x: e.clientX, y: e.clientY }
    }
    const onWheel = (e) => {
      const locked = lockedRef.current
      if (locked) {
        lockedRadiusRef.current = Math.max(locked.userData.radius * 3, Math.min(locked.userData.radius * 50, lockedRadiusRef.current + e.deltaY * 0.5))
        spherical.radius = lockedRadiusRef.current
      } else {
        spherical.radius = Math.max(50, Math.min(6000, spherical.radius + e.deltaY * 2))
      }
    }

    // Touch events
    const onTouchStart = (e) => {
      if (e.target.closest?.('.cel-panel') || e.target.closest?.('.cel-time')) return
      if (e.touches.length === 1) {
        isDragging = true
        lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      } else if (e.touches.length === 2) {
        isDragging = false
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        lastTouchDist = Math.sqrt(dx * dx + dy * dy)
        lastTouchMid  = { x: (e.touches[0].clientX + e.touches[1].clientX) / 2, y: (e.touches[0].clientY + e.touches[1].clientY) / 2 }
      }
    }
    const onTouchMove = (e) => {
      e.preventDefault()
      if (e.touches.length === 1 && isDragging) {
        const dx = (e.touches[0].clientX - lastMouse.x) * 0.007
        const dy = (e.touches[0].clientY - lastMouse.y) * 0.007
        spherical.theta -= dx
        spherical.phi    = Math.max(0.05, Math.min(Math.PI - 0.05, spherical.phi + dy))
        lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      } else if (e.touches.length === 2) {
        const dx    = e.touches[0].clientX - e.touches[1].clientX
        const dy    = e.touches[0].clientY - e.touches[1].clientY
        const dist  = Math.sqrt(dx * dx + dy * dy)
        if (lastTouchDist !== null) {
          const delta = lastTouchDist - dist
          const locked = lockedRef.current
          if (locked) {
            lockedRadiusRef.current = Math.max(locked.userData.radius * 3, Math.min(locked.userData.radius * 50, lockedRadiusRef.current + delta * 0.8))
            spherical.radius = lockedRadiusRef.current
          } else {
            spherical.radius = Math.max(50, Math.min(6000, spherical.radius + delta * 3))
          }
        }
        lastTouchDist = dist
      }
    }
    const onTouchEnd = (e) => {
      if (e.touches.length < 2) lastTouchDist = null
      if (e.touches.length === 0) isDragging = false
    }

    el.addEventListener('mousedown',  onMouseDown)
    el.addEventListener('mouseup',    onMouseUp)
    window.addEventListener('mouseup',onMouseUp)
    el.addEventListener('mousemove',  onMouseMove)
    el.addEventListener('wheel',      onWheel,     { passive: true })
    el.addEventListener('touchstart', onTouchStart,{ passive: false })
    el.addEventListener('touchmove',  onTouchMove, { passive: false })
    el.addEventListener('touchend',   onTouchEnd,  { passive: true })

    /* ── Milky Way background ── */
    const bgGeo = new THREE.SphereGeometry(8000, 64, 64)
    const bgMat = new THREE.MeshBasicMaterial({ map: loadTex(TEXTURES.milkyway), side: THREE.BackSide, depthWrite: false, color: 0xaaaaaa })
    scene.add(new THREE.Mesh(bgGeo, bgMat))

    /* ── Star particle galaxy ── */
    const pm  = isMobile ? 12000 : 28000
    const pg  = new THREE.BufferGeometry()
    const pos = new Float32Array(pm * 3)
    const col = new Float32Array(pm * 3)
    for (let i = 0; i < pm; i++) {
      const r = 1000 + Math.random() * 3500
      const t = Math.random() * Math.PI * 2
      const y = (Math.random() - 0.5) * Math.random() * 1200
      pos[i*3]   = r * Math.cos(t)
      pos[i*3+1] = y
      pos[i*3+2] = r * Math.sin(t)
      const c = new THREE.Color()
      const m = Math.random()
      if      (m > 0.85) c.setHex(0x88aaff)
      else if (m > 0.65) c.setHex(0xffcc88)
      else if (m > 0.45) c.setHex(0xff8888)
      else               c.setHex(0xffffff)
      col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b
    }
    pg.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    pg.setAttribute('color',    new THREE.BufferAttribute(col, 3))
    const galaxyPts = new THREE.Points(pg, new THREE.PointsMaterial({
      size: isMobile ? 2 : 2.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }))
    galaxyPts.rotation.x = Math.PI / 8
    scene.add(galaxyPts)

    /* ────────────────────────────────────────────
       VOLUMETRIC SUN — custom GLSL shader
    ──────────────────────────────────────────── */
    const sunUniforms = {
      time:   { value: 0 },
      color1: { value: new THREE.Color(0xff4400) },
      color2: { value: new THREE.Color(0xffcc00) },
    }
    const sunMat = new THREE.ShaderMaterial({
      uniforms: sunUniforms,
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv      = uv;
          vPosition= position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec3 vPosition;

        float hash(vec3 p) {
          p = fract(p * 0.3183099 + .1);
          p *= 17.0;
          return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }
        float noise(vec3 x) {
          vec3 i = floor(x); vec3 f = fract(x);
          f = f*f*(3.0-2.0*f);
          return mix(
            mix(mix(hash(i+vec3(0,0,0)),hash(i+vec3(1,0,0)),f.x),
                mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
            mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),
                mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
        }
        float fbm(vec3 p) {
          float f = 0.0;
          f += 0.5000 * noise(p); p *= 2.02;
          f += 0.2500 * noise(p); p *= 2.03;
          f += 0.1250 * noise(p); p *= 2.01;
          f += 0.0625 * noise(p);
          return f / 0.9375;
        }
        void main() {
          vec3 p   = vPosition * 0.12 + time * 0.25;
          float n  = fbm(p);
          float n2 = fbm(p * 1.8 + time * 0.1);
          vec3 col = mix(color1, color2, n * 1.6 + n2 * 0.4);
          col = mix(col, vec3(1.0, 0.95, 0.8), pow(n, 3.0) * 0.6);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    })
    const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(25, 64, 64), sunMat)
    scene.add(sunMesh)

    /* ── Sun corona / glow sprite (additive) ── */
    const coronaGeo = new THREE.SphereGeometry(38, 32, 32)
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.BackSide,
    })
    scene.add(new THREE.Mesh(coronaGeo, coronaMat))

    /* ── Sun Point Light — the REAL source of planet lighting ── */
    const sunLight = new THREE.PointLight(0xfff5cc, 180, 0, 1.2)
    sunLight.position.set(0, 0, 0)
    sunLight.castShadow  = true
    sunLight.shadow.mapSize.width  = 1024
    sunLight.shadow.mapSize.height = 1024
    sunLight.shadow.camera.near    = 1
    sunLight.shadow.camera.far     = 1000
    scene.add(sunLight)

    /* ── Extra warm fill from sun direction (softer ambient side) ── */
    const sunFill = new THREE.PointLight(0xff8833, 20, 3000, 2)
    sunFill.position.set(0, 0, 0)
    scene.add(sunFill)

    /* ────────────────────────────────────────────
       PLANETS
    ──────────────────────────────────────────── */
    const interactable = []
    const orbitGroups  = []
    const planetMeshes = []

    ENTITY_DATA.forEach((data) => {
      const orbitGroup = new THREE.Group()
      orbitGroup.userData.speed = data.speed
      orbitGroup.userData.angle = Math.random() * Math.PI * 2

      const geo = new THREE.SphereGeometry(data.radius, isMobile ? 40 : 64, isMobile ? 40 : 64)

      let mesh
      if (data.isEarth) {
        /* Earth — multi-layer material */
        const mat = new THREE.MeshStandardMaterial({
          map:              loadTex(TEXTURES.earthMap),
          bumpMap:          loadTex(TEXTURES.earthBump),
          bumpScale:        0.3,
          roughness:        0.65,
          metalness:        0.0,
        })
        const earthMesh = new THREE.Mesh(geo, mat)
        earthMesh.castShadow    = true
        earthMesh.receiveShadow = true
        earthMesh.position.x    = data.distance
        earthMesh.userData      = { ...data, isPlanet: true }

        /* Night lights (emissive) */
        const nightMat = new THREE.MeshStandardMaterial({
          map:               loadTex(TEXTURES.earthNight),
          emissiveMap:       loadTex(TEXTURES.earthNight),
          emissive:          new THREE.Color(0xffffcc),
          emissiveIntensity: 1.5,
          transparent:       true,
          blending:          THREE.AdditiveBlending,
          depthWrite:        false,
          side:              THREE.FrontSide,
        })
        const nightMesh = new THREE.Mesh(new THREE.SphereGeometry(data.radius + 0.05, isMobile ? 40:64, isMobile ? 40:64), nightMat)
        earthMesh.add(nightMesh)

        /* Clouds */
        const cloudMat = new THREE.MeshStandardMaterial({
          map:         loadTex(TEXTURES.earthClouds),
          transparent: true,
          opacity:     0.75,
          blending:    THREE.AdditiveBlending,
          depthWrite:  false,
        })
        earthMesh.add(new THREE.Mesh(new THREE.SphereGeometry(data.radius + 0.2, isMobile ? 40:64, isMobile ? 40:64), cloudMat))

        /* Atmosphere glow */
        const atmosphereMat = new THREE.MeshBasicMaterial({
          color:       0x4488ff,
          transparent: true,
          opacity:     0.07,
          blending:    THREE.AdditiveBlending,
          depthWrite:  false,
          side:        THREE.BackSide,
        })
        earthMesh.add(new THREE.Mesh(new THREE.SphereGeometry(data.radius + 0.8, 32, 32), atmosphereMat))

        orbitGroup.add(earthMesh)

        /* Moon */
        const moonGroup = new THREE.Group()
        moonGroup.position.x = data.distance
        const moonMesh = new THREE.Mesh(
          new THREE.SphereGeometry(1.5, 32, 32),
          new THREE.MeshStandardMaterial({ map: loadTex(TEXTURES.moon), roughness: 0.9 })
        )
        moonMesh.castShadow    = true
        moonMesh.receiveShadow = true
        moonMesh.position.x    = 14
        moonGroup.add(moonMesh)
        orbitGroup.add(moonGroup)
        earthMesh.userData.moonGroup = moonGroup

        interactable.push(earthMesh)
        planetMeshes.push({ mesh: earthMesh, data, orbitGroup })
        planetsRef.current[data.name] = earthMesh
        mesh = earthMesh
      } else {
        const mat = new THREE.MeshStandardMaterial({
          map:      loadTex(TEXTURES[data.tex || 'mercury']),
          roughness: 0.75,
          metalness: 0.0,
        })
        mesh = new THREE.Mesh(geo, mat)
        mesh.castShadow    = true
        mesh.receiveShadow = true
        mesh.position.x    = data.distance
        mesh.userData      = { ...data, isPlanet: true }

        /* Atmosphere for rocky planets */
        if (data.name === 'VENUS') {
          const atmMat = new THREE.MeshBasicMaterial({
            color: 0xffaa44, transparent: true, opacity: 0.06,
            blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.BackSide,
          })
          mesh.add(new THREE.Mesh(new THREE.SphereGeometry(data.radius + 0.5, 32, 32), atmMat))
        }
        if (data.name === 'MARS') {
          const atmMat = new THREE.MeshBasicMaterial({
            color: 0xff6633, transparent: true, opacity: 0.04,
            blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.BackSide,
          })
          mesh.add(new THREE.Mesh(new THREE.SphereGeometry(data.radius + 0.4, 32, 32), atmMat))
        }

        if (data.hasRings) {
          const ringGeo = new THREE.RingGeometry(data.radius + 4, data.radius + 22, 160)
          /* Fix ring UV so texture maps correctly */
          const ringPos = ringGeo.attributes.position
          const ringUV  = ringGeo.attributes.uv
          for (let i = 0; i < ringPos.count; i++) {
            const x = ringPos.getX(i), y = ringPos.getY(i)
            const r = Math.sqrt(x*x + y*y)
            ringUV.setXY(i, (r - (data.radius+4)) / 18, 0.5)
          }
          const ringMat = new THREE.MeshStandardMaterial({
            map:         loadTex(TEXTURES.saturnRing),
            transparent: true,
            opacity:     0.92,
            side:        THREE.DoubleSide,
            roughness:   0.8,
          })
          const ring = new THREE.Mesh(ringGeo, ringMat)
          ring.rotation.x = Math.PI / 2 + 0.18
          ring.receiveShadow = true
          mesh.add(ring)
        }

        orbitGroup.add(mesh)
        interactable.push(mesh)
        planetMeshes.push({ mesh, data, orbitGroup })
        planetsRef.current[data.name] = mesh
      }

      /* Orbit path ring */
      const pathMat  = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.04, side: THREE.DoubleSide })
      const pathMesh = new THREE.Mesh(new THREE.RingGeometry(data.distance - 0.4, data.distance + 0.4, 160), pathMat)
      pathMesh.rotation.x = Math.PI / 2
      scene.add(pathMesh)

      scene.add(orbitGroup)
      orbitGroups.push(orbitGroup)
    })

    /* ── Asteroid belt ── */
    const beltCount = isMobile ? 600 : 2000
    const beltMesh  = new THREE.InstancedMesh(
      new THREE.DodecahedronGeometry(0.9, 0),
      new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 1 }),
      beltCount
    )
    beltMesh.castShadow    = true
    beltMesh.receiveShadow = true
    const dummy = new THREE.Object3D()
    for (let i = 0; i < beltCount; i++) {
      const r  = 182 + Math.random() * 28
      const t  = Math.random() * Math.PI * 2
      dummy.position.set(Math.cos(t)*r, (Math.random()-0.5)*8, Math.sin(t)*r)
      dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0)
      const sc = Math.random() * 1.6 + 0.2
      dummy.scale.set(sc, sc, sc)
      dummy.updateMatrix()
      beltMesh.setMatrixAt(i, dummy.matrix)
    }
    scene.add(beltMesh)

    /* ────────────────────────────────────────────
       RAYCASTER — Click to lock camera on planet
    ──────────────────────────────────────────── */
    const raycaster = new THREE.Raycaster()
    const mouse2D   = new THREE.Vector2()

    const trySelectPlanet = (clientX, clientY) => {
      const rect = el.getBoundingClientRect()
      mouse2D.x  = ((clientX - rect.left) / rect.width)  *  2 - 1
      mouse2D.y  = -((clientY - rect.top)  / rect.height) *  2 + 1
      raycaster.setFromCamera(mouse2D, camera)
      const hits = raycaster.intersectObjects(interactable, false)
      if (hits.length > 0) {
        const hitMesh = hits[0].object
        const d       = hitMesh.userData

        setTelemetry(d)
        setPanelExpanded(false)

        /* Lock camera onto this planet */
        lockedRef.current = hitMesh
        const lockRadius  = d.radius * 12
        lockedRadiusRef.current = lockRadius
        spherical.radius  = lockRadius
        spherical.theta   = 0.3
        spherical.phi     = Math.PI / 2.8
        setLockedPlanet(d.name)
      }
    }

    let pointerMoved = false
    const onPointerDown = (e) => {
      if (e.target.closest?.('.cel-panel') || e.target.closest?.('.cel-time')) return
      pointerMoved = false
    }
    const onPointerMove = () => { pointerMoved = true }
    const onPointerUp   = (e) => {
      if (e.target.closest?.('.cel-panel') || e.target.closest?.('.cel-time')) return
      if (!pointerMoved) trySelectPlanet(e.clientX, e.clientY)
    }

    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup',   onPointerUp)

    /* ── Resize ── */
    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(el.clientWidth, el.clientHeight)
      composer.setSize(el.clientWidth, el.clientHeight)
    }
    window.addEventListener('resize', onResize, { passive: true })

    /* ────────────────────────────────────────────
       ANIMATE LOOP
    ──────────────────────────────────────────── */
    const clock   = new THREE.Clock()
    let baseTime  = 0

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate)
      const delta = clock.getDelta()
      baseTime   += delta * timeRef.current

      /* ── Camera smooth follow ── */
      const locked = lockedRef.current
      if (locked) {
        /* Get planet world position each frame (it's moving) */
        const wp = new THREE.Vector3()
        locked.getWorldPosition(wp)
        target.copy(wp)
      }

      currentTarget.lerp(target, 0.06)
      currentSpherical.theta  += (spherical.theta  - currentSpherical.theta)  * 0.06
      currentSpherical.phi    += (spherical.phi     - currentSpherical.phi)    * 0.06
      currentSpherical.radius += (spherical.radius  - currentSpherical.radius) * 0.06
      updateCamera()

      /* ── Sun shader & glow ── */
      sunUniforms.time.value = baseTime * 0.4
      sunMesh.rotation.y    += delta * 0.04

      /* ── Galaxy slow spin ── */
      galaxyPts.rotation.y  += delta * 0.0015

      /* ── Planet orbits ── */
      planetMeshes.forEach(({ mesh, data, orbitGroup }) => {
        orbitGroup.userData.angle = (orbitGroup.userData.angle || 0) + data.speed * delta * timeRef.current * 60
        orbitGroup.rotation.y     = orbitGroup.userData.angle
        mesh.rotation.y          += delta * (data.name === 'JUPITER' ? 0.8 : 0.3)

        /* Moon orbit */
        if (mesh.userData.moonGroup) {
          mesh.userData.moonGroup.rotation.y += delta * 0.7 * timeRef.current
        }
      })

      /* ── Asteroid belt rotation ── */
      beltMesh.rotation.y += delta * 0.0008 * timeRef.current

      composer.render()
    }
    animate()

    setTimeout(() => setLoading(false), 2200)

    engineRef.current = { scene, renderer }

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize',     onResize)
      window.removeEventListener('mouseup',    onMouseUp)
      el.removeEventListener('mousedown',      onMouseDown)
      el.removeEventListener('mousemove',      onMouseMove)
      el.removeEventListener('wheel',          onWheel)
      el.removeEventListener('touchstart',     onTouchStart)
      el.removeEventListener('touchmove',      onTouchMove)
      el.removeEventListener('touchend',       onTouchEnd)
      el.removeEventListener('pointerdown',    onPointerDown)
      el.removeEventListener('pointermove',    onPointerMove)
      el.removeEventListener('pointerup',      onPointerUp)
      Object.values(breakdownFxRef.current).forEach((fx) => {
        fx.parent?.remove(fx.coreMesh)
        fx.parent?.remove(fx.pts)
        fx.coreMat?.dispose?.()
        fx.ptsGeo?.dispose?.()
        fx.pMat?.dispose?.()
      })
      breakdownFxRef.current = {}
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [])

  const handleTimeChange = (e) => {
    const v = parseFloat(e.target.value)
    setTimeSpeed(v)
    timeRef.current = v
  }

  const unlockCamera = () => {
    lockedRef.current       = null
    lockedRadiusRef.current = null
    engineRef.current && (engineRef.current.target = new THREE.Vector3(0, 0, 0))
    setLockedPlanet(null)
    setTelemetry(null)
    setPanelExpanded(false)
  }

  const breakDownPlanet = (name) => {
    if (exploded[name]) return
    setExploded(prev => ({ ...prev, [name]: true }))
    setPanelExpanded(true)
    const mesh = planetsRef.current[name]
    if (!mesh) return

    const data   = mesh.userData
    const parent = mesh.parent

    const coreGeo = new THREE.SphereGeometry(data.radius * 0.6, 32, 32)
    const coreMat = new THREE.MeshBasicMaterial({ color: data.coreColor || 0xff4400, wireframe: true, transparent: true, opacity: 0 })
    const coreMesh = new THREE.Mesh(coreGeo, coreMat)
    coreMesh.position.copy(mesh.position)
    parent.add(coreMesh)

    const ptsGeo = new THREE.BufferGeometry()
    const source = mesh.geometry.attributes.position.array
    const particleCount = window.innerWidth < 768 ? 24000 : 75000
    const distributed = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const pick = (i * 3) % source.length
      distributed[i * 3] = source[pick]
      distributed[i * 3 + 1] = source[pick + 1]
      distributed[i * 3 + 2] = source[pick + 2]
    }
    ptsGeo.setAttribute('position', new THREE.BufferAttribute(distributed, 3))
    const pMat = new THREE.PointsMaterial({ color: data.sCol || 0xffffff, size: 0.24, transparent: true, opacity: 1, blending: THREE.AdditiveBlending })
    const pts   = new THREE.Points(ptsGeo, pMat)
    pts.position.copy(mesh.position)
    parent.add(pts)
    mesh.visible = false

    import('gsap').then(({ gsap }) => {
      gsap.to(coreMat,      { opacity: 1, duration: 1.5 })
      gsap.to(pts.scale,    { x: 8, y: 8, z: 8, duration: 2.6, ease: 'power2.out' })
      gsap.to(pMat,         { opacity: 0.06, duration: 2.8, ease: 'power2.out' })
    })

    breakdownFxRef.current[name] = { parent, mesh, coreMesh, coreMat, pts, ptsGeo, pMat }
  }

  const reverseBreakdown = (name) => {
    const fx = breakdownFxRef.current[name]
    if (!fx) return
    fx.mesh.visible = true
    fx.parent.remove(fx.coreMesh)
    fx.parent.remove(fx.pts)
    fx.coreMat.dispose()
    fx.ptsGeo.dispose()
    fx.pMat.dispose()
    delete breakdownFxRef.current[name]
    setExploded(prev => ({ ...prev, [name]: false }))
    setPanelExpanded(false)
  }

  return (
    <div className="cel-page">
      {/* Loading */}
      {loading && (
        <div className="cel-loading">
          <div className="cel-load-stars" />
          <div className="cel-load-ring" />
          <div className="cel-load-title">ENTERING CELESTIAL MODE</div>
          <div className="cel-load-sub">Calibrating gravitational cores…</div>
          <div className="cel-load-pulse" />
        </div>
      )}

      <Navbar />

      {/* WebGL canvas */}
      <div ref={containerRef} className="cel-canvas" />

      {/* HUD — Top Left */}
      <div className="cel-hud-tl">
        <Link to="/" className="cel-back-btn">← Return to Hub</Link>
        <div>
          <div className="cel-sector">{'>'} Sector 7G / Sol System</div>
          <div className="cel-title-hud">COSMOS SIMULATOR</div>
        </div>
      </div>

      {/* Locked planet badge */}
      {lockedPlanet && (
        <div className={`cel-locked-badge ${telemetry ? 'cel-locked-badge-front' : ''}`} onClick={unlockCamera}>
          <span>🔒 {lockedPlanet}</span>
          <span className="cel-locked-free">TAP TO FREE</span>
        </div>
      )}

      {/* Telemetry Panel */}
      {telemetry && (
        <div className="cel-panel glass-panel">
          <div className="cel-panel-header">
            <div>
              <h2 className="cel-panel-name" style={{ color: telemetry.sCol }}>{telemetry.name}</h2>
              <div className="cel-panel-class">{telemetry.class}</div>
            </div>
            <button className="cel-panel-close" onClick={() => { setTelemetry(null); unlockCamera() }}>✕</button>
          </div>

          <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
            {!exploded[telemetry.name] ? (
              <button
                className="cel-panel-close"
                style={{ position:'relative', width:'100%', background:'rgba(255,0,0,0.18)', border:'1px solid red', padding:'0.5rem', color:'red', fontSize:'0.7rem', letterSpacing:'0.1em', borderRadius:'10px' }}
                onClick={() => breakDownPlanet(telemetry.name)}
              >
                INITIATE CORE BREAKDOWN
              </button>
            ) : (
              <div style={{ display:'grid', gap:'0.45rem' }}>
                <div style={{ color:'#22c55e', fontSize:'0.7rem', textAlign:'center', letterSpacing:'0.1em', fontWeight:'bold' }}>
                  CORE EXPOSED
                </div>
                <button
                  className="cel-panel-close"
                  style={{ position:'relative', width:'100%', background:'rgba(34,197,94,0.16)', border:'1px solid rgba(34,197,94,0.75)', padding:'0.5rem', color:'#7ff3a9', fontSize:'0.68rem', letterSpacing:'0.09em', borderRadius:'10px' }}
                  onClick={() => reverseBreakdown(telemetry.name)}
                >
                  REVERSE BREAKDOWN
                </button>
              </div>
            )}
          </div>
          {panelExpanded && (
            <>
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

              <div className="cel-orbit-hint">
                <span>🖱 Drag · Scroll to zoom around planet</span>
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
            </>
          )}
        </div>
      )}

      {/* Time Dilation */}
      <div className="cel-time glass-panel">
        <span className="cel-time-label">TIME</span>
        <input type="range" min="0" max="10" step="0.1" value={timeSpeed}
          onChange={handleTimeChange} className="cel-slider" />
        <span className="cel-time-speed">{timeSpeed.toFixed(1)}×</span>
      </div>

      {/* Hint */}
      <div className="cel-hint">
        {isLandscapeMobile
          ? 'LANDSCAPE MODE ACTIVE — FULLSCREEN REQUESTED'
          : lockedPlanet
          ? `ORBITING ${lockedPlanet} — DRAG · SCROLL ZOOM · TAP PLANET TO FREE`
          : 'DRAG TO PAN · CLICK PLANET TO LOCK · SCROLL ZOOM'}
      </div>
    </div>
  )
}
