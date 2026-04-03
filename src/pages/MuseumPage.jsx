import { useState, useRef, useEffect, useCallback, Suspense, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useProgress, PointerLockControls, Environment, useAnimations, Html } from '@react-three/drei'
import * as THREE from 'three'

/* ═══════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════ */
const BASE_URL       = '/assets/models/museum/'
const ROOM_SPACING   = 48    // world units between room centres
const ROOM_TARGET    = 42    // scale each room to this footprint
const LOAD_RADIUS    = ROOM_SPACING * 2.2
const EYE_HEIGHT     = 2.2
const JUMP_IMPULSE   = 6.0
const GRAVITY        = -18
const MOVE_SPEED     = 5.5
const SPRINT_SPEED   = 11
const INTERACT_DIST  = 4.5   // metres for E-key annotation
const MOBILE_LOOK_SENSITIVITY = 0.0028

const ROOM_LINKS = {
  armoury: 'billiards',
  billiards: 'dining',
  dining: 'great_draw',
  great_draw: 'serving',
  serving: 'porcelain',
  porcelain: 'picture',
  picture: 'morning',
  morning: 'small_draw',
  small_draw: 'smoking',
  smoking: 'stables',
  stables: 'tack',
  tack: 'vestibule',
  vestibule: 'armoury',
}

/* World bounds: 4 cols (0-3) × 4 rows (0-3) */
const MAX_X = 3 * ROOM_SPACING + 20
const MAX_Z = 3 * ROOM_SPACING + 20
const MIN_X = -20
const MIN_Z = -20

/* ═══════════════════════════════════════════════════════════
   13 ROOM DEFINITIONS
═══════════════════════════════════════════════════════════ */
const MUSEUM_ROOMS = [
  { id: 'armoury',    name: 'The Armoury',            file: 'the_armoury.glb',            col: 0, row: 0, color: '#ef4444',
    desc: 'A magnificent collection of Renaissance-era plate armour, weapons, and heraldic shields from the Hallwyl family collection.' },
  { id: 'billiards',  name: 'The Billiards Room',      file: 'the_billiards_room.glb',     col: 1, row: 0, color: '#8b5cf6',
    desc: 'An opulently decorated Victorian billiards room featuring a full-size billiard table, leather chairs, and trophy displays.' },
  { id: 'dining',     name: 'The Dining Room',         file: 'the_dining_room.glb',        col: 2, row: 0, color: '#f97316',
    desc: 'The Grand Dining Room set for a formal banquet with fine porcelain, silverware, and floral arrangements as used in the 1900s.' },
  { id: 'great_draw', name: 'Great Drawing Room',      file: 'the_great_drawing_room.glb', col: 3, row: 0, color: '#06b6d4',
    desc: 'The largest reception room of the palace with ornate gilded walls, French-style furniture, and an elegant chandelier.' },
  { id: 'morning',    name: 'The Morning Room',        file: 'the_morning_room.glb',       col: 0, row: 1, color: '#22c55e',
    desc: 'A light-filled room where the family would gather for morning coffee, reading, and correspondence.' },
  { id: 'picture',    name: 'The Picture Gallery',     file: 'the_picture_gallery.glb',    col: 1, row: 1, color: '#eab308',
    desc: 'Over 200 paintings including Dutch, Flemish, and Swedish masters spanning three centuries of European art.' },
  { id: 'porcelain',  name: 'The Porcelain Room',      file: 'the_porcelain_room.glb',     col: 2, row: 1, color: '#ec4899',
    desc: 'The finest East Asian and European porcelain in Scandinavia — Meissen, Sèvres, and Ming dynasty pieces.' },
  { id: 'serving',    name: 'The Serving Room',        file: 'the_serving_room.glb',       col: 3, row: 1, color: '#64748b',
    desc: 'The service corridor connecting the kitchens to the grand dining room, lined with fine silverware and china.' },
  { id: 'small_draw', name: 'Small Drawing Room',      file: 'the_small_drawing_room.glb', col: 0, row: 2, color: '#a16207',
    desc: 'An intimate salon for private gatherings, featuring watercolours, embroidery frames, and period furnishings.' },
  { id: 'smoking',    name: 'The Smoking Room',        file: 'the_smoking_room.glb',       col: 1, row: 2, color: '#7c3aed',
    desc: 'The gentleman\'s retreat with dark wood panelling, leather armchairs, and a collection of pipes and humidors.' },
  { id: 'stables',    name: 'The Stables',             file: 'the_stables.glb',            col: 2, row: 2, color: '#16a34a',
    desc: 'Originally housing the Count\'s horses, now preserved with original stalls, harnesses, and equestrian equipment.' },
  { id: 'tack',       name: 'The Tack Room',           file: 'the_tack_room.glb',          col: 3, row: 2, color: '#0891b2',
    desc: 'The saddle room holds an extraordinary collection of 19th-century riding equipment, livery, and bridles.' },
  { id: 'vestibule',  name: 'The Upper Vestibule',     file: 'the_upper_vestibule.glb',    col: 1, row: 3, color: '#dc2626',
    desc: 'The grand upper landing connecting the main staircase to the private apartments on the first floor.' },
]

MUSEUM_ROOMS.forEach(r => useGLTF.preload(BASE_URL + r.file))

function roomWorldPos(room) { return { x: room.col * ROOM_SPACING, z: room.row * ROOM_SPACING } }

function nearestRoom(x, z) {
  let best = null, bestDist = Infinity
  for (const room of MUSEUM_ROOMS) {
    const p = roomWorldPos(room)
    const d = Math.hypot(x - p.x, z - p.z)
    if (d < bestDist) { bestDist = d; best = room }
  }
  return best
}

function getRoomById(id) {
  return MUSEUM_ROOMS.find(room => room.id === id) || null
}

/* ═══════════════════════════════════════════════════════════
   COLLISION MESH REGISTRY — rooms register their scenes here
   so the physics raycaster can check against them.
═══════════════════════════════════════════════════════════ */
const collisionMeshes = []
const registeredScenes = new WeakSet()

function registerScene(scene) {
  if (registeredScenes.has(scene)) return
  registeredScenes.add(scene)
  scene.traverse(node => {
    if (node.isMesh) collisionMeshes.push(node)
  })
}

/* ═══════════════════════════════════════════════════════════
   SINGLE ROOM MODEL
═══════════════════════════════════════════════════════════ */
function RoomModel({ room }) {
  const { scene } = useGLTF(BASE_URL + room.file)
  const initialised = useRef(false)
  const target = roomWorldPos(room)

  useEffect(() => {
    if (!scene || initialised.current) return
    initialised.current = true

    scene.traverse(node => {
      if (!node.isMesh) return
      node.castShadow    = false
      node.receiveShadow = false
      if (node.material) {
        node.material.side = THREE.DoubleSide
        node.material.needsUpdate = true
        // Boost realism
        if (node.material.roughness !== undefined)
          node.material.roughness = Math.min(node.material.roughness, 0.85)
      }
    })

    const box  = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const maxH = Math.max(size.x, size.z)
    if (maxH > 0) scene.scale.setScalar(ROOM_TARGET / maxH)

    const box2   = new THREE.Box3().setFromObject(scene)
    const centre = box2.getCenter(new THREE.Vector3())
    const minY   = box2.min.y

    scene.position.set(target.x - centre.x, -minY, target.z - centre.z)

    registerScene(scene)
  }, [scene, target.x, target.z])

  return <primitive object={scene} />
}

/* ═══════════════════════════════════════════════════════════
   ANNOTATION HOTSPOTS — discovered from room meshes
═══════════════════════════════════════════════════════════ */
function RoomAnnotations({ room, playerPos, isMobile }) {
  const { scene } = useGLTF(BASE_URL + room.file)
  const [hotspots, setHotspots] = useState([])

  useEffect(() => {
    if (!scene) return
    const spots = []
    scene.traverse(node => {
      if (!node.isMesh) return
      const name = node.name || ''
      // Filter meaningful named objects (skip generic geometry names)
      if (!name || name.match(/^(mesh|object|geometry|material|node|group|primitive|unnamed)/i)) return
      if (name.length < 3) return
      if (spots.length >= (isMobile ? 3 : 6)) return // cap per room

      const box = new THREE.Box3().setFromObject(node)
      const pos = box.getCenter(new THREE.Vector3())
      spots.push({
        id: `${room.id}_${name}`,
        name: name.replace(/_/g, ' ').replace(/\d+/g, '').trim(),
        position: [pos.x, Math.min(pos.y + 0.5, 3.5), pos.z],
        roomDesc: room.desc,
      })
    })
    setHotspots(spots)
  }, [scene, room, isMobile])

  return (
    <>
      {hotspots.map(spot => {
        const dx = (playerPos?.x ?? 0) - spot.position[0]
        const dz = (playerPos?.z ?? 0) - spot.position[2]
        const dist = Math.hypot(dx, dz)
        const nearby = dist < INTERACT_DIST
        if (dist > INTERACT_DIST * 3) return null
        return (
          <group key={spot.id} position={spot.position}>
            {/* Pulsing ring in 3D */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.15, 0.22, 16]} />
              <meshBasicMaterial
                color={nearby ? '#00ff88' : '#eab308'}
                transparent opacity={nearby ? 0.9 : 0.5}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshBasicMaterial color={nearby ? '#00ff88' : '#eab308'} />
            </mesh>
            {/* Distance-culled HTML label */}
            {dist < INTERACT_DIST * 1.5 && (
              <Html
                center
                distanceFactor={8}
                style={{
                  pointerEvents: 'none',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <div style={{
                  background: 'rgba(0,0,0,0.75)',
                  backdropFilter: 'blur(6px)',
                  border: `1px solid ${nearby ? '#00ff88' : '#eab30844'}`,
                  borderRadius: 6,
                  padding: '4px 10px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 10,
                  color: nearby ? '#00ff88' : '#eab308',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ fontSize: 12 }}>🏛</span>
                  <span>{spot.name || 'Exhibit'}</span>
                  {nearby && <span style={{ color: '#fff', fontSize: 9 }}>[E]</span>}
                </div>
              </Html>
            )}
          </group>
        )
      })}
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
   PROXIMITY LOADER
═══════════════════════════════════════════════════════════ */
function ProximityRoom({ room, playerCoarse, playerPos, isMobile }) {
  const p = roomWorldPos(room)
  const dist = Math.hypot(playerCoarse.x - p.x, playerCoarse.z - p.z)
  if (dist > LOAD_RADIUS) return null
  return (
    <Suspense fallback={null}>
      <RoomModel room={room} />
      <RoomAnnotations room={room} playerPos={playerPos} isMobile={isMobile} />
    </Suspense>
  )
}

/* ═══════════════════════════════════════════════════════════
   GROUND PLANE (walkable between rooms)
═══════════════════════════════════════════════════════════ */
function GroundPlane() {
  const W = ROOM_SPACING * 5
  const H = ROOM_SPACING * 5
  const meshRef = useRef()
  useEffect(() => {
    if (meshRef.current) collisionMeshes.push(meshRef.current)
  }, [])
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}
      position={[ROOM_SPACING * 1.5, -0.01, ROOM_SPACING * 1.5]} receiveShadow>
      <planeGeometry args={[W, H]} />
      <meshStandardMaterial color="#141210" roughness={0.95} />
    </mesh>
  )
}



/* ═══════════════════════════════════════════════════════════
   PHYSICS + FIRST-PERSON CONTROLLER
   - Camera-relative WASD (W always = forward relative to look)
   - Downward raycast for floor detection (stair climbing)
   - Forward raycast for wall collision
   - Jump with SPACE
   - Boundary clamp
═══════════════════════════════════════════════════════════ */
const _downRay = new THREE.Raycaster()
const _wallRay = new THREE.Raycaster()
const _tmpVec  = new THREE.Vector3()
const _fwdVec  = new THREE.Vector3()
const _rgtVec  = new THREE.Vector3()
const _moveVec = new THREE.Vector3()
const _backVec = new THREE.Vector3()
const _leftVec = new THREE.Vector3()

function FirstPersonController({
  onRoomChange, onPositionChange, locked,
  movingRef, sprintRef, posRef, velYRef,
  onInteractKey, teleportRef, touchInputRef, isMobile
}) {
  const { camera } = useThree()
  const keys       = useRef({})
  const velocity   = useRef(new THREE.Vector3())
  const bobPhase   = useRef(0)
  const floorY     = useRef(0)
  const airborne   = useRef(false)
  const lastRoomId = useRef(null)
  const frameCount = useRef(0)
  const pitch = useRef(-0.12)
  const yaw = useRef(0)

  useEffect(() => {
    camera.position.set(0, EYE_HEIGHT, ROOM_SPACING * 0.3)
    camera.fov = 80
    camera.rotation.set(pitch.current, yaw.current, 0, 'YXZ')
    camera.updateProjectionMatrix()
  }, [camera])

  useEffect(() => {
    const dn = e => {
      keys.current[e.code] = true
      if (e.code === 'KeyE' && locked) onInteractKey?.()
    }
    const up = e => { keys.current[e.code] = false }
    window.addEventListener('keydown', dn)
    window.addEventListener('keyup',   up)
    return () => { window.removeEventListener('keydown', dn); window.removeEventListener('keyup', up) }
  }, [locked, onInteractKey])

  useFrame((_, dt) => {
    const canControl = locked || isMobile
    if (!canControl) return
    frameCount.current++

    const K      = keys.current
    const touch = touchInputRef?.current
    const sprint = K.ShiftLeft || K.ShiftRight || !!touch?.sprint
    const speed  = sprint ? SPRINT_SPEED : MOVE_SPEED
    sprintRef.current = sprint

    if (isMobile && touch) {
      yaw.current -= (touch.lookX || 0) * MOBILE_LOOK_SENSITIVITY
      pitch.current -= (touch.lookY || 0) * MOBILE_LOOK_SENSITIVITY
      pitch.current = Math.max(-1.25, Math.min(1.25, pitch.current))
      camera.rotation.set(pitch.current, yaw.current, 0, 'YXZ')
      touch.lookX = 0
      touch.lookY = 0
    }

    /* === MOVEMENT direction (camera-relative XZ) === */
    _fwdVec.set(0, 0, -1).applyQuaternion(camera.quaternion)
    _fwdVec.y = 0; _fwdVec.normalize()
    _rgtVec.set(1, 0, 0).applyQuaternion(camera.quaternion)
    _rgtVec.y = 0; _rgtVec.normalize()

    _moveVec.set(0, 0, 0)
    if (K.KeyW || K.ArrowUp || touch?.forward)   _moveVec.add(_fwdVec)
    if (K.KeyS || K.ArrowDown || touch?.back)    _moveVec.sub(_fwdVec)
    if (K.KeyA || K.ArrowLeft || touch?.left)    _moveVec.sub(_rgtVec)
    if (K.KeyD || K.ArrowRight || touch?.right)  _moveVec.add(_rgtVec)

    const isMoving = _moveVec.lengthSq() > 0.001
    movingRef.current = isMoving
    if (isMoving) _moveVec.normalize()

    /* === JUMP === */
    if ((K.Space || touch?.jump) && !airborne.current) {
      velYRef.current = JUMP_IMPULSE
      airborne.current = true
    }

    /* === WALL COLLISION (every frame, 4 directions) === */
    if (isMoving && collisionMeshes.length > 0) {
      _backVec.copy(_fwdVec).negate()
      _leftVec.copy(_rgtVec).negate()
      const wallDirs = [_fwdVec, _rgtVec, _backVec, _leftVec]
      const origin   = camera.position.clone()
      origin.y -= 0.3 // check at waist height
      for (const dir of wallDirs) {
        _wallRay.set(origin, dir)
        const hits = _wallRay.intersectObjects(collisionMeshes, false)
        if (hits.length > 0 && hits[0].distance < 1.0) {
          // Remove component in that direction
          const dot = _moveVec.dot(dir)
          if (dot > 0) _moveVec.addScaledVector(dir, -dot)
        }
      }
    }

    /* === SMOOTH XZ MOVEMENT === */
    velocity.current.lerp(_moveVec.multiplyScalar(speed), 0.14)
    camera.position.x += velocity.current.x * dt
    camera.position.z += velocity.current.z * dt

    /* === BOUNDARY CLAMP (can't leave map) === */
    camera.position.x = Math.max(MIN_X, Math.min(MAX_X, camera.position.x))
    camera.position.z = Math.max(MIN_Z, Math.min(MAX_Z, camera.position.z))

    /* === VERTICAL PHYSICS + STAIR CLIMB (floor raycast) === */
    velYRef.current += GRAVITY * dt
    camera.position.y += velYRef.current * dt

    // Cast ray downward from 2m above player to find floor
    if (frameCount.current % 2 === 0 && collisionMeshes.length > 0) {
      _downRay.set(
        new THREE.Vector3(camera.position.x, camera.position.y + 2, camera.position.z),
        new THREE.Vector3(0, -1, 0)
      )
      const hits = _downRay.intersectObjects(collisionMeshes, true)
      if (hits.length > 0) {
        const hitY = hits[0].point.y
        floorY.current = hitY
      }
    }

    const targetY = floorY.current + EYE_HEIGHT
    if (camera.position.y <= targetY) {
      camera.position.y = targetY
      velYRef.current = 0
      airborne.current = false
    }

    /* === HEAD BOB === */
    if (isMoving && !airborne.current) {
      bobPhase.current += dt * (sprint ? 14 : 9)
      camera.position.y = targetY + Math.sin(bobPhase.current) * (sprint ? 0.06 : 0.035)
    }

    if (!isMoving) velocity.current.multiplyScalar(0.75)

    /* === Teleport Check === */
    if (teleportRef?.current) {
      camera.position.x = teleportRef.current.x
      camera.position.z = teleportRef.current.z
      teleportRef.current = null
      velocity.current.set(0, 0, 0)
    }

    /* === Update refs for minimap === */
    if (posRef) posRef.current = { x: camera.position.x, y: floorY.current, z: camera.position.z }
    onPositionChange({ x: camera.position.x, z: camera.position.z })

    /* === Room detection === */
    const room   = nearestRoom(camera.position.x, camera.position.z)
    const roomId = room?.id ?? null
    if (roomId !== lastRoomId.current) {
      lastRoomId.current = roomId
      onRoomChange(room)
    }
  })

  return null
}

/* ═══════════════════════════════════════════════════════════
   SCENE CONTENT
═══════════════════════════════════════════════════════════ */
function SceneContent({ onRoomChange, onPositionChange, locked, playerCoarse, playerPos, onInteractKey, teleportRef, touchInputRef, isMobile }) {
  const movingRef = useRef(false)
  const sprintRef = useRef(false)
  const posRef    = useRef({ x: 0, y: 0, z: ROOM_SPACING * 0.3 })
  const velYRef   = useRef(0)

  return (
    <>
      <ambientLight intensity={1.0} />
      <directionalLight
        position={[40, 50, 40]} intensity={isMobile ? 1.0 : 1.5} castShadow={!isMobile}
        shadow-mapSize={isMobile ? [1, 1] : [2048, 2048]}
        shadow-camera-far={350}
        shadow-camera-left={-100} shadow-camera-right={100}
        shadow-camera-top={100}  shadow-camera-bottom={-100}
      />
      <pointLight position={[ROOM_SPACING, 8, ROOM_SPACING]}      intensity={0.7} color="#fff8e8" />
      <pointLight position={[ROOM_SPACING * 2, 8, ROOM_SPACING * 2]} intensity={0.5} color="#e8f0ff" />
      <pointLight position={[0, 8, ROOM_SPACING * 2]}                 intensity={0.4} color="#ffe8d0" />
      {!isMobile && <Environment preset="apartment" />}

      <GroundPlane />

      {MUSEUM_ROOMS.map(room => (
        <ProximityRoom
          key={room.id}
          room={room}
          playerCoarse={playerCoarse}
          playerPos={playerPos}
          isMobile={isMobile}
        />
      ))}



      <FirstPersonController
        onRoomChange={onRoomChange}
        onPositionChange={onPositionChange}
        locked={locked}
        movingRef={movingRef}
        sprintRef={sprintRef}
        posRef={posRef}
        velYRef={velYRef}
        onInteractKey={onInteractKey}
        teleportRef={teleportRef}
        touchInputRef={touchInputRef}
        isMobile={isMobile}
      />
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
   LOADING SCREEN
═══════════════════════════════════════════════════════════ */
function LoadingScreen() {
  const { progress } = useProgress()
  const [dots, setDots] = useState('')
  const [tips]  = useState(() => [
    'Press SPACE to jump!',
    'Press E to interact with exhibits',
    'Hold SHIFT to sprint',
    'All 13 rooms are explorable',
    'Check the minimap in the corner',
    'Stairs can be climbed naturally',
  ])
  const [tipIdx, setTipIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 400)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setTipIdx(i => (i + 1) % tips.length), 2800)
    return () => clearInterval(id)
  }, [tips])

  const R = 60, SW = 5
  const cir = 2 * Math.PI * R
  const arc = (progress / 100) * cir
  const SEG = 36

  return (
    <div style={{
      position: 'absolute', inset: 0, background: '#050505', zIndex: 100,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <style>{`
        @keyframes spin   { to { transform: rotate(360deg) } }
        @keyframes pulse  { 0%,100%{opacity:.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes tipIn  { from{opacity:0;transform:translateY(6px)} to{opacity:.7;transform:translateY(0)} }
      `}</style>

      <div style={{ position: 'relative', width: 160, height: 160, marginBottom: 32 }}>
        <svg width={160} height={160} style={{ position: 'absolute' }}>
          <circle cx={80} cy={80} r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={SW} />
        </svg>
        <svg width={160} height={160} style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>
          <circle cx={80} cy={80} r={R} fill="none" stroke="url(#pg)" strokeWidth={SW}
            strokeLinecap="round" strokeDasharray={`${arc} ${cir}`}
            style={{ transition: 'stroke-dasharray 0.4s ease', filter: 'drop-shadow(0 0 6px #eab308)' }}
          />
        </svg>
        <svg width={160} height={160} style={{ position: 'absolute', animation: 'spin 5s linear infinite' }}>
          <circle cx={80} cy={80} r={R + 14} fill="none" stroke="rgba(234,179,8,0.15)" strokeWidth={1.5} strokeDasharray="6 8" />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#eab308', textShadow: '0 0 20px rgba(234,179,8,.7)', animation: 'pulse 1.5s ease-in-out infinite' }}>
            {Math.round(progress)}<span style={{ fontSize: 13, color: '#a68b00' }}>%</span>
          </div>
          <div style={{ fontSize: 7, color: '#665500', letterSpacing: 3, marginTop: 2 }}>LOADING</div>
        </div>
      </div>

      <div style={{ textAlign: 'center', animation: 'fadeUp .8s ease both', marginBottom: 24 }}>
        <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 6, color: '#fff', textShadow: '0 0 30px rgba(234,179,8,.4)' }}>
          Hallwyl Museum
        </div>
        <div style={{ fontSize: 10, color: '#555', letterSpacing: 4, marginTop: 6 }}>13 ROOMS · STOCKHOLM · EST. 1938</div>
      </div>

      <div style={{ width: 280, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 3, marginBottom: 6 }}>
          {Array.from({ length: SEG }).map((_, i) => {
            const on = i < Math.round((progress / 100) * SEG)
            return (
              <div key={i} style={{
                flex: 1, height: 4, borderRadius: 2,
                background: on ? `hsl(${38 + i * 1.5},85%,52%)` : 'rgba(255,255,255,0.05)',
                boxShadow: on ? '0 0 4px rgba(234,179,8,.4)' : 'none',
                transition: 'background .3s',
              }} />
            )
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 7, color: '#444' }}>
          <span>STREAMING ROOMS</span>
          <span>{progress < 100 ? `${Math.round(progress)}% · ${MUSEUM_ROOMS.length} rooms` : '✓ READY'}</span>
        </div>
      </div>

      <div style={{ fontSize: 11, color: '#555', letterSpacing: 2, animation: 'pulse 1.2s ease-in-out infinite', maxWidth: 320, textAlign: 'center', marginBottom: 16 }}>
        {progress < 15 && `INITIALISING SCENE${dots}`}
        {progress >= 15 && progress < 50 && `STREAMING GEOMETRY${dots}`}
        {progress >= 50 && progress < 80 && `LOADING TEXTURES${dots}`}
        {progress >= 80 && progress < 100 && `FINAL PASS${dots}`}
        {progress >= 100 && '✓ MUSEUM READY — CLICK TO ENTER'}
      </div>

      <div style={{ fontSize: 9, color: '#333', letterSpacing: 1.5, textAlign: 'center', maxWidth: 340, borderTop: '1px solid #111', paddingTop: 12, animation: 'tipIn .6s ease', }}>
        💡 {tips[tipIdx]}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   INSTRUCTIONS OVERLAY
═══════════════════════════════════════════════════════════ */
function Instructions({ onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 9000)
    return () => clearTimeout(t)
  }, [onDismiss])

  const controls = [
    { key: 'W A S D / ↑↓←→', desc: 'Walk (camera-relative)' },
    { key: 'MOUSE',            desc: 'Look around' },
    { key: 'SPACE',            desc: 'Jump' },
    { key: 'SHIFT',            desc: 'Sprint' },
    { key: 'E',                desc: 'Interact with exhibit' },
    { key: 'ESC',              desc: 'Release cursor' },
  ]

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)',
    }}>
      <div style={{
        background: 'rgba(6,6,6,0.96)', border: '1px solid rgba(234,179,8,0.2)',
        borderRadius: 20, padding: '44px 56px', textAlign: 'center',
        fontFamily: 'JetBrains Mono', color: '#fff', maxWidth: 460,
        boxShadow: '0 0 80px rgba(234,179,8,0.06)',
      }}>
        <div style={{ fontSize: 11, color: '#eab308', letterSpacing: 5, marginBottom: 8 }}>WELCOME TO</div>
        <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 2, marginBottom: 4 }}>Hallwyl Museum</div>
        <div style={{ fontSize: 9, color: '#333', letterSpacing: 3, marginBottom: 36 }}>
          13 ROOMS · STOCKHOLM · FIRST FLOOR
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36, textAlign: 'left' }}>
          {controls.map(c => (
            <div key={c.key} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                background: 'rgba(234,179,8,0.07)', border: '1px solid rgba(234,179,8,0.2)',
                borderRadius: 6, padding: '4px 10px', fontWeight: 700, fontSize: 10,
                color: '#eab308', minWidth: 120, textAlign: 'center', letterSpacing: 1,
              }}>{c.key}</div>
              <div style={{ fontSize: 11, color: '#777' }}>{c.desc}</div>
            </div>
          ))}
        </div>
        <button onClick={onDismiss} style={{
          background: 'linear-gradient(135deg,#eab308,#f97316)',
          border: 'none', borderRadius: 8, padding: '13px 40px',
          color: '#000', fontFamily: 'JetBrains Mono', fontWeight: 900,
          fontSize: 11, letterSpacing: 2, cursor: 'pointer',
          boxShadow: '0 0 24px rgba(234,179,8,.3)',
        }}>
          ENTER MUSEUM
        </button>
        <div style={{ fontSize: 8, color: '#333', marginTop: 12 }}>
          Auto-closes in a few seconds…
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   ANNOTATION PANEL (E-key popup)
═══════════════════════════════════════════════════════════ */
function AnnotationPanel({ room, linkedRoom, onClose, onGoLinkedRoom }) {
  if (!room) return null
  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
      zIndex: 45, maxWidth: 420, width: '90vw',
      background: 'rgba(5,5,5,0.92)', backdropFilter: 'blur(20px)',
      border: `1px solid ${room.color}44`, borderRadius: 16,
      padding: '28px 32px', fontFamily: 'JetBrains Mono', color: '#fff',
      boxShadow: `0 0 60px ${room.color}22`,
      animation: 'fadeUp .3s ease',
    }}>
      <style>{`@keyframes fadeUp { from{opacity:0;transform:translate(-50%,-48%)} to{opacity:1;transform:translate(-50%,-50%)} }`}</style>
      <div style={{ fontSize: 9, color: room.color, letterSpacing: 4, marginBottom: 6 }}>EXHIBIT INFO</div>
      <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 10, letterSpacing: 1 }}>{room.name}</div>
      <div style={{ fontSize: 11, color: '#888', lineHeight: 1.8, marginBottom: 20 }}>{room.desc}</div>
      <div style={{ display: 'flex', gap: 8, fontSize: 8, color: '#444', marginBottom: 16 }}>
        <span style={{ background: `${room.color}15`, border: `1px solid ${room.color}30`, borderRadius: 4, padding: '3px 8px', color: room.color }}>🏛 Hallwyl Museum</span>
        <span style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, padding: '3px 8px' }}>Stockholm</span>
        <span style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, padding: '3px 8px' }}>Est. 1938</span>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button onClick={onClose} style={{
          background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)',
          borderRadius: 6, padding: '8px 20px', color: '#eab308',
          fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 2, cursor: 'pointer',
        }}>
          [E] CLOSE
        </button>
        {linkedRoom && (
          <button onClick={() => onGoLinkedRoom?.(linkedRoom)} style={{
            background: `${linkedRoom.color}14`,
            border: `1px solid ${linkedRoom.color}66`,
            borderRadius: 6, padding: '8px 20px', color: linkedRoom.color,
            fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 1, cursor: 'pointer',
          }}>
            ENTER {linkedRoom.name.toUpperCase()}
          </button>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   ROOM NAME OVERLAY
═══════════════════════════════════════════════════════════ */
function RoomOverlay({ room }) {
  if (!room) return null
  return (
    <div style={{
      position: 'absolute', top: 24, right: 24, zIndex: 30,
      background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(10px)',
      border: `1px solid ${room.color}44`, borderRadius: 10, padding: '12px 20px',
      fontFamily: 'JetBrains Mono', textAlign: 'right',
      boxShadow: `0 0 24px ${room.color}22`,
      animation: 'rIn .35s ease',
    }}>
      <style>{`@keyframes rIn { from{opacity:0;transform:translateX(12px)} to{opacity:1;transform:translateX(0)} }`}</style>
      <div style={{ fontSize: 14, fontWeight: 900, color: room.color, textShadow: `0 0 12px ${room.color}`, letterSpacing: 1 }}>
        {room.name}
      </div>
      <div style={{ fontSize: 8, color: '#444', letterSpacing: 3, marginTop: 3 }}>HALLWYL MUSEUM</div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   MINIMAP
═══════════════════════════════════════════════════════════ */
function Minimap({ playerPos, currentRoom }) {
  const W = 200, H = 200
  const maxCol = 3, maxRow = 3
  const padX = 14, padY = 22
  const innerW = W - padX * 2
  const innerH = H - padY * 2

  const toMap = (wx, wz) => ({
    mx: padX + (wx / (maxCol * ROOM_SPACING)) * innerW,
    my: padY + (wz / (maxRow * ROOM_SPACING)) * innerH,
  })

  const cellW = (innerW / (maxCol + 1)) * 0.82
  const cellH = (innerH / (maxRow + 1)) * 0.78

  const { mx: pmx, my: pmy } = toMap(
    Math.max(0, Math.min(maxCol * ROOM_SPACING, playerPos.x)),
    Math.max(0, Math.min(maxRow * ROOM_SPACING, playerPos.z))
  )

  return (
    <div style={{
      position: 'absolute', bottom: 24, right: 24, zIndex: 30,
      width: W, height: H,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10,
      overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.7)',
    }}>
      <div style={{
        position: 'absolute', top: 5, left: 0, right: 0, textAlign: 'center',
        fontFamily: 'JetBrains Mono', fontSize: 7, color: '#444', letterSpacing: 2,
      }}>MINIMAP · 13 ROOMS</div>

      {MUSEUM_ROOMS.map(room => {
        const p = roomWorldPos(room)
        const { mx, my } = toMap(p.x, p.z)
        const active = currentRoom?.id === room.id
        return (
          <div key={room.id} title={room.name} style={{
            position: 'absolute',
            left: mx - cellW / 2, top: my - cellH / 2,
            width: cellW, height: cellH,
            background: active ? room.color + '44' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${active ? room.color : 'rgba(255,255,255,0.07)'}`,
            borderRadius: 3,
            boxShadow: active ? `0 0 10px ${room.color}80` : 'none',
            transition: 'all .3s',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {active && (
              <span style={{ fontSize: 4, color: room.color, fontFamily: 'JetBrains Mono', textAlign: 'center', maxWidth: cellW - 4, overflow: 'hidden' }}>
                {room.name}
              </span>
            )}
          </div>
        )
      })}

      <div style={{
        position: 'absolute', left: pmx - 4, top: pmy - 4,
        width: 8, height: 8, borderRadius: '50%',
        background: '#00ff88', boxShadow: '0 0 6px #00ff88',
        border: '1.5px solid #fff', zIndex: 5,
        transition: 'left .1s, top .1s',
      }} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   CROSSHAIR
═══════════════════════════════════════════════════════════ */
function Crosshair({ visible }) {
  if (!visible) return null
  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%,-50%)', zIndex: 20,
      pointerEvents: 'none', opacity: 0.6,
    }}>
      <div style={{ width: 20, height: 20, position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1.5, background: '#fff', transform: 'translateY(-50%)' }} />
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1.5, background: '#fff', transform: 'translateX(-50%)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 4, height: 4, borderRadius: '50%', background: '#eab308', transform: 'translate(-50%,-50%)' }} />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   INTERACT PROMPT HUD
═══════════════════════════════════════════════════════════ */
function InteractPrompt({ visible }) {
  if (!visible) return null
  return (
    <div style={{
      position: 'absolute', bottom: 80, left: '50%', transform: 'translateX(-50%)',
      zIndex: 35, pointerEvents: 'none',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      border: '1px solid rgba(234,179,8,0.3)',
      borderRadius: 8, padding: '6px 18px',
      fontFamily: 'JetBrains Mono', fontSize: 10,
      color: '#eab308', letterSpacing: 2,
      animation: 'pulse 1.2s ease-in-out infinite',
    }}>
      [E] EXAMINE EXHIBIT
    </div>
  )
}

function MobileControls({ touchInputRef, onInteract, onGateOpen }) {
  const setDir = (key, val) => {
    if (!touchInputRef.current) return
    touchInputRef.current[key] = val
  }

  const bindHold = key => ({
    onTouchStart: e => { e.preventDefault(); setDir(key, true) },
    onTouchEnd:   e => { e.preventDefault(); setDir(key, false) },
    onTouchCancel:e => { e.preventDefault(); setDir(key, false) },
    onMouseDown:  e => { e.preventDefault(); setDir(key, true) },
    onMouseUp:    e => { e.preventDefault(); setDir(key, false) },
    onMouseLeave: () => setDir(key, false),
  })

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 70, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', bottom: 20, left: 16, display: 'grid', gridTemplateColumns: '56px 56px 56px', gap: 6, pointerEvents: 'auto' }}>
        <button {...bindHold('left')} style={mobileBtnStyle}>◀</button>
        <button {...bindHold('forward')} style={mobileBtnStyle}>▲</button>
        <button {...bindHold('right')} style={mobileBtnStyle}>▶</button>
        <div />
        <button {...bindHold('back')} style={mobileBtnStyle}>▼</button>
      </div>

      <div style={{ position: 'absolute', bottom: 20, right: 16, display: 'grid', gridTemplateColumns: '64px 64px', gap: 8, pointerEvents: 'auto' }}>
        <button {...bindHold('jump')} style={mobileBtnStyle}>JUMP</button>
        <button {...bindHold('sprint')} style={mobileBtnStyle}>RUN</button>
        <button onClick={onInteract} style={mobileBtnStyle}>USE</button>
        <button onClick={onGateOpen} style={mobileBtnStyle}>GATE</button>
      </div>
    </div>
  )
}

const mobileBtnStyle = {
  height: 52,
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.2)',
  background: 'rgba(0,0,0,0.65)',
  color: '#fff',
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: 11,
  letterSpacing: 1,
}

/* ═══════════════════════════════════════════════════════════
   TELEPORT GATE MENU
═══════════════════════════════════════════════════════════ */
function TeleportGate({ onTeleport, open: controlledOpen, onOpenChange }) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen

  // Prevent event propagation so clicking the menu doesn't lock controls if overlay was used
  return (
    <div 
      onPointerDown={e => e.stopPropagation()} 
      style={{ position: 'relative', zIndex: 60 }}
    >
      <button onClick={() => setOpen(!open)} style={{
        background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.4)',
        borderRadius: 8, padding: '10px 20px', color: '#06b6d4',
        fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 700, letterSpacing: 2, cursor: 'pointer',
        boxShadow: '0 0 20px rgba(6,182,212,0.2)',
        display: 'flex', alignItems: 'center', height: '100%'
      }}>
        {open ? 'CLOSE GATE X' : 'TELEPORT ◈'}
      </button>
      
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, marginTop: 12,
          background: 'rgba(5,5,5,0.95)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(6,182,212,0.3)', borderRadius: 12, padding: 12,
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: 340,
          boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
        }}>
          {MUSEUM_ROOMS.map(room => (
            <button key={room.id} onClick={() => { onTeleport(room); setOpen(false) }} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 6, padding: '10px 8px', color: '#fff',
              fontFamily: 'JetBrains Mono', fontSize: 9, textAlign: 'left', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'all 0.2s'
            }}
            onMouseOver={e => { e.currentTarget.style.background = room.color + '44'; e.currentTarget.style.borderColor = room.color }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
            >
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: room.color }} />
              <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{room.name}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function MuseumPage() {
  const [locked,           setLocked]           = useState(false)
  const [currentRoom,      setCurrentRoom]       = useState(null)
  const [playerPos,        setPlayerPos]         = useState({ x: 0, z: ROOM_SPACING * 0.3 })
  const [playerCoarse,     setPlayerCoarse]      = useState({ x: 0, z: ROOM_SPACING * 0.3 })
  const [showInstructions, setShowInstructions]  = useState(true)
  const [loaded,           setLoaded]            = useState(false)
  const [annotationRoom,   setAnnotationRoom]    = useState(null)
  const [nearAnnotation,   setNearAnnotation]    = useState(false)
  const [isMobile,         setIsMobile]          = useState(() => (
    typeof window !== 'undefined'
      ? (window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 900)
      : false
  ))
  const [gateOpen,         setGateOpen]          = useState(false)
  const [webglFailed,      setWebglFailed]       = useState(false)
  const controlsRef = useRef()
  const lastCoarseRef = useRef({ x: 0, z: ROOM_SPACING * 0.3 })
  const teleportRef = useRef(null)
  const touchInputRef = useRef({
    forward: false, back: false, left: false, right: false,
    sprint: false, jump: false, lookX: 0, lookY: 0
  })
  const lastTouchRef = useRef(null)

  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    collisionMeshes.length = 0
    return () => {
      collisionMeshes.length = 0
    }
  }, [])

  const handleTeleport = useCallback((room) => {
    teleportRef.current = roomWorldPos(room)
    setGateOpen(false)
    // Small delay to ensure state sets before attempting lock
    if (!isMobile) {
      setTimeout(() => {
        controlsRef.current?.lock()
      }, 50)
    }
  }, [isMobile])

  const { progress } = useProgress()
  useEffect(() => { if (progress >= 100) setLoaded(true) }, [progress])

  const handleRoomChange = useCallback(r => setCurrentRoom(r), [])

  const handlePositionChange = useCallback(pos => {
    setPlayerPos(pos)
    const dx = pos.x - lastCoarseRef.current.x
    const dz = pos.z - lastCoarseRef.current.z
    if (Math.abs(dx) > 8 || Math.abs(dz) > 8) {
      lastCoarseRef.current = pos
      setPlayerCoarse({ ...pos })
    }
  }, [])

  const handleDismiss = useCallback(() => {
    setShowInstructions(false)
    if (!isMobile) {
      setTimeout(() => controlsRef.current?.lock(), 100)
    }
  }, [isMobile])

  const handleInteractKey = useCallback(() => {
    if (annotationRoom) {
      setAnnotationRoom(null)
      if (!isMobile) controlsRef.current?.lock()
    } else if (currentRoom) {
      setAnnotationRoom(currentRoom)
      if (!isMobile) controlsRef.current?.unlock()
    }
  }, [annotationRoom, currentRoom, isMobile])

  const closeAnnotation = useCallback(() => {
    setAnnotationRoom(null)
    if (!isMobile) setTimeout(() => controlsRef.current?.lock(), 100)
  }, [isMobile])

  const linkedRoom = annotationRoom ? getRoomById(ROOM_LINKS[annotationRoom.id]) : null

  const handleTouchLookStart = useCallback((e) => {
    if (!isMobile || e.touches.length !== 1) return
    lastTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }, [isMobile])

  const handleTouchLookMove = useCallback((e) => {
    if (!isMobile || e.touches.length !== 1 || !lastTouchRef.current) return
    e.preventDefault()
    const t = e.touches[0]
    touchInputRef.current.lookX += t.clientX - lastTouchRef.current.x
    touchInputRef.current.lookY += t.clientY - lastTouchRef.current.y
    lastTouchRef.current = { x: t.clientX, y: t.clientY }
  }, [isMobile])

  const handleTouchLookEnd = useCallback(() => {
    lastTouchRef.current = null
  }, [])

  /* Near-annotation detection */
  useEffect(() => {
    setNearAnnotation(!!currentRoom)
  }, [currentRoom])

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050505', position: 'relative', overflow: 'hidden' }}>

      {/* Back & Teleport Gate */}
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 60, display: 'flex', gap: 16 }}>
        <Link to="/" style={{
          color: '#fff', textDecoration: 'none', fontFamily: 'JetBrains Mono', fontSize: 11,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          padding: '0 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', letterSpacing: 1,
          display: 'flex', alignItems: 'center'
        }}>← Hub</Link>
        {loaded && !showInstructions && <TeleportGate onTeleport={handleTeleport} open={isMobile ? gateOpen : undefined} onOpenChange={isMobile ? setGateOpen : undefined} />}
      </div>

      {/* 3D Canvas */}
      <div
        style={{ position: 'absolute', inset: 0, touchAction: isMobile ? 'none' : 'auto' }}
        onTouchStart={handleTouchLookStart}
        onTouchMove={handleTouchLookMove}
        onTouchEnd={handleTouchLookEnd}
      >
        <Canvas
          shadows={!isMobile}
          dpr={isMobile ? [0.65, 1.05] : [1, 1.5]}
          gl={{ antialias: !isMobile, powerPreference: 'high-performance' }}
          camera={{ position: [0, EYE_HEIGHT, ROOM_SPACING * 0.3], fov: 80, near: 0.05, far: 600 }}
          onCreated={({ gl }) => {
            const canvas = gl.domElement
            const onLost = (e) => {
              e.preventDefault()
              setWebglFailed(true)
            }
            canvas.addEventListener('webglcontextlost', onLost, { passive: false, once: true })
          }}
        >
          {!isMobile && (
            <PointerLockControls
              ref={controlsRef}
              onLock={()   => setLocked(true)}
              onUnlock={() => setLocked(false)}
            />
          )}
          <Suspense fallback={null}>
            <SceneContent
              onRoomChange={handleRoomChange}
              onPositionChange={handlePositionChange}
              locked={isMobile ? true : locked}
              playerCoarse={playerCoarse}
              playerPos={playerPos}
              onInteractKey={handleInteractKey}
              teleportRef={teleportRef}
              touchInputRef={touchInputRef}
              isMobile={isMobile}
            />
          </Suspense>
        </Canvas>
      </div>

      {!loaded && <LoadingScreen />}
      {webglFailed && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 120,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.9)', color: '#fff', fontFamily: 'JetBrains Mono',
          textAlign: 'center', padding: 24
        }}>
          <div>
            <div style={{ fontSize: 18, color: '#f97316', marginBottom: 10 }}>Graphics reset detected</div>
            <div style={{ fontSize: 12, color: '#aaa' }}>Please reopen the page. Mobile quality has been reduced to prevent this.</div>
          </div>
        </div>
      )}
      {loaded && showInstructions && <Instructions onDismiss={handleDismiss} />}

      {loaded && !showInstructions && (
        <>
          <Crosshair visible={!isMobile && locked} />
          <RoomOverlay room={currentRoom} />
          <Minimap playerPos={playerPos} currentRoom={currentRoom} />

          {(isMobile || locked) && nearAnnotation && !annotationRoom && (
            <InteractPrompt visible />
          )}

          {/* Click-to-lock */}
          {!isMobile && !locked && !annotationRoom && (
            <div
              onClick={() => controlsRef.current?.lock()}
              style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)', zIndex: 40, cursor: 'pointer',
                background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(234,179,8,0.25)', borderRadius: 10,
                padding: '16px 32px', fontFamily: 'JetBrains Mono',
                color: '#eab308', fontSize: 12, letterSpacing: 3, textAlign: 'center',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            >
              <div>CLICK TO RESUME</div>
              <div style={{ fontSize: 8, color: '#555', marginTop: 4 }}>MOUSE CURSOR UNLOCKED</div>
            </div>
          )}

          {/* HUD hints */}
          <div style={{
            position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            zIndex: 20, pointerEvents: 'none',
            fontFamily: 'JetBrains Mono', fontSize: 9,
            color: 'rgba(255,255,255,0.15)', letterSpacing: 2,
          }}>
            WASD/ARROWS · MOUSE · SPACE JUMP · SHIFT SPRINT · E INTERACT · ESC UNLOCK
          </div>

          <div style={{
            position: 'absolute', top: 24, left: 72, zIndex: 30,
            fontFamily: 'JetBrains Mono', fontSize: 8,
            color: 'rgba(255,255,255,0.18)', letterSpacing: 2,
          }}>
            13 ROOMS
          </div>
        </>
      )}

      {/* Annotation panel — always rendered on top */}
      {annotationRoom && (
        <AnnotationPanel room={annotationRoom} linkedRoom={linkedRoom} onClose={closeAnnotation} onGoLinkedRoom={handleTeleport} />
      )}

      {loaded && !showInstructions && isMobile && (
        <MobileControls touchInputRef={touchInputRef} onInteract={handleInteractKey} onGateOpen={() => setGateOpen(v => !v)} />
      )}
    </div>
  )
}
