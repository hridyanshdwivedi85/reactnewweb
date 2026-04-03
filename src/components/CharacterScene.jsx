// CharacterScene.jsx — Robot Playground 3D Model
// Replaces Pikachu with robot_playground.glb
// Features: idle levitation bob, head tracking, colorful mini particles, animation controls

import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { GLTFLoader, DRACOLoader } from 'three-stdlib'

/* ─── Lighting ─── */
function setupLighting(scene) {
  scene.add(new THREE.AmbientLight(0xffffff, 0.7))

  const front = new THREE.DirectionalLight(0xe8f0ff, 3.0)
  front.position.set(0, 4, 8)
  scene.add(front)

  const rimL = new THREE.DirectionalLight(0x7c3aed, 2.0)
  rimL.position.set(-6, 3, -2)
  scene.add(rimL)

  const rimR = new THREE.DirectionalLight(0x06b6d4, 1.8)
  rimR.position.set(6, 3, -2)
  scene.add(rimR)

  const fill = new THREE.DirectionalLight(0xffffff, 0.5)
  fill.position.set(0, -3, 5)
  scene.add(fill)

  const back = new THREE.DirectionalLight(0xa78bfa, 0.8)
  back.position.set(0, 6, -8)
  scene.add(back)

  // Point light for dramatic glow
  const glow = new THREE.PointLight(0x7c3aed, 4, 10)
  glow.position.set(0, 1, 3)
  scene.add(glow)
}

/* ─── Mini Particle Canvas ─── */
function MiniParticles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W = canvas.width = canvas.offsetWidth
    let H = canvas.height = canvas.offsetHeight

    const COLORS = [
      '#7c3aed', '#06b6d4', '#ec4899', '#a78bfa',
      '#38bdf8', '#f97316', '#34d399', '#fbbf24',
      '#c084fc', '#22d3ee', '#fb7185', '#4ade80',
    ]

    const isMobile = window.innerWidth < 768
    const COUNT = isMobile ? 45 : 90

    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * (isMobile ? 2.2 : 3) + 0.8,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.55 + 0.25,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.018 + 0.008,
    }))

    let raf
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      particles.forEach(p => {
        p.pulse += p.pulseSpeed
        const glow = Math.sin(p.pulse) * 0.35 + 0.65
        p.x += p.vx
        p.y += p.vy
        if (p.x < -10) p.x = W + 10
        if (p.x > W + 10) p.x = -10
        if (p.y < -10) p.y = H + 10
        if (p.y > H + 10) p.y = -10
        ctx.save()
        ctx.globalAlpha = p.alpha * glow
        ctx.shadowBlur = 10
        ctx.shadowColor = p.color
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()

    const onResize = () => {
      W = canvas.width = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }
    window.addEventListener('resize', onResize, { passive: true })
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
    />
  )
}

/* ─── Find head / root bone for tracking ─── */
function findHeadBone(model) {
  const names = ['Head', 'head', 'HEAD', 'Neck', 'neck', 'mixamorigHead', 'Spine2', 'spine002']
  for (const name of names) {
    const b = model.getObjectByName(name)
    if (b) return b
  }
  let found = null
  model.traverse(child => {
    if (!found && (child.isBone || child.type === 'Bone')) {
      const n = child.name.toLowerCase()
      if (n.includes('head') || n.includes('neck')) found = child
    }
  })
  return found || model
}

/* ─── Tracking logic ─── */
function handleTargetTracking(model, headBone, mouseX, mouseY, ix, iy) {
  if (!model) return
  const lerp = THREE.MathUtils.lerp
  
  // Only track if we are somewhat near the top of the page
  if (window.scrollY < 400) {
    // 1. Slightly rotate the entire body toward cursor (subtle)
    const bodyMaxY = Math.PI / 12
    const bodyMaxX = Math.PI / 24
    model.rotation.y = lerp(model.rotation.y, mouseX * bodyMaxY, iy * 0.5)
    model.rotation.x = lerp(model.rotation.x, -mouseY * bodyMaxX, ix * 0.5)

    // 2. Rotate the head bone specifically if found and not the same as the root model
    if (headBone && headBone !== model && headBone.isBone) {
      const headMax = Math.PI / 6
      headBone.rotation.y = lerp(headBone.rotation.y, mouseX * headMax, iy)
      headBone.rotation.x = lerp(headBone.rotation.x, -mouseY * headMax, ix)
    }
  }
}

export default function CharacterScene() {
  const containerRef = useRef(null)
  const rafRef       = useRef(null)
  const mixerRef     = useRef(null)
  const actionsRef   = useRef({})
  const currentActionRef = useRef(null)
  const visibleRef = useRef(true)

  const [activeAnim, setActiveAnim] = useState(null)
  const [animNames,  setAnimNames]  = useState([])
  const [modelReady, setModelReady] = useState(false)

  const switchAnimation = useCallback((name) => {
    const actions = actionsRef.current
    const next = actions[name]
    if (!next) return
    const prev = currentActionRef.current
    if (prev && prev !== next) prev.fadeOut(0.5)
    next.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(0.5).play()
    currentActionRef.current = next
    setActiveAnim(name)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting
      },
      { threshold: 0.05 }
    )
    visibilityObserver.observe(container)

    const rect = container.getBoundingClientRect()
    let W = rect.width  || window.innerWidth
    let H = rect.height || window.innerHeight

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping         = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3
    renderer.shadowMap.enabled   = true
    renderer.shadowMap.type      = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(22, W / H, 0.1, 1000)
    camera.position.set(0, 1.6, 6.5)
    camera.lookAt(0, 1.2, 0)

    setupLighting(scene)

    let mouse = { x: 0, y: 0 }
    let interp = { x: 0.1, y: 0.2 }
    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    const handleResize = () => {
      if (!containerRef.current) return
      const r = containerRef.current.getBoundingClientRect()
      const w = r.width || window.innerWidth
      const h = r.height || window.innerHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', handleResize, { passive: true })

    let headBone    = null
    let robotModel  = null
    let modelLoaded = false
    const clock     = new THREE.Clock()

    const loader = new GLTFLoader()
    const draco  = new DRACOLoader()
    draco.setDecoderPath('draco/')
    loader.setDRACOLoader(draco)

    loader.load(
      'models/robot_playground.glb',
      async (gltf) => {
        robotModel = gltf.scene

        try { await renderer.compileAsync(robotModel, camera, scene) } catch (_) {}

        robotModel.traverse(child => {
          if (child.isMesh) {
            child.castShadow    = true
            child.receiveShadow = true
            child.frustumCulled = false
            if (child.material?.isMeshStandardMaterial) {
              child.material.envMapIntensity = 1.2
            }
          }
        })

        // Auto-scale
        const box  = new THREE.Box3().setFromObject(robotModel)
        const size = box.getSize(new THREE.Vector3())
        if (size.y > 0) {
          robotModel.scale.setScalar(1.35 / size.y)
        }

        // Center at feet
        const box2   = new THREE.Box3().setFromObject(robotModel)
        const center = box2.getCenter(new THREE.Vector3())
        const min    = box2.min
        robotModel.position.set(-center.x, -min.y + 0.1, -center.z)

        scene.add(robotModel)
        headBone = findHeadBone(robotModel)

        // Animations
        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(robotModel)
          mixerRef.current = mixer

          const names   = gltf.animations.map(a => a.name)
          const actions = {}
          gltf.animations.forEach(clip => {
            const action = mixer.clipAction(clip)
            action.setLoop(THREE.LoopRepeat, Infinity)
            actions[clip.name] = action
          })
          actionsRef.current = actions
          setAnimNames(names)

          // Play first animation by default
          const firstAction = Object.values(actions)[0]
          if (firstAction) {
            firstAction.play()
            currentActionRef.current = firstAction
            setActiveAnim(names[0])
          }
        }

        modelLoaded = true
        draco.dispose()
        const parent = containerRef.current?.parentElement
        if (parent) parent.classList.add('character-loaded')
        setModelReady(true)
      },
      undefined,
      (err) => console.warn('[Robot] Load failed:', err)
    )

    let bobTime = 0
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate)
      const delta = clock.getDelta()
      bobTime += delta

      if (robotModel && modelLoaded && visibleRef.current && !document.hidden) {
        // Gentle levitation bob
        robotModel.position.y += Math.sin(bobTime * 1.2) * 0.0005
        // Slow idle sway
        robotModel.rotation.y  = Math.sin(bobTime * 0.3) * 0.025
        // Cursor tracking
        handleTargetTracking(robotModel, headBone, mouse.x, mouse.y, interp.x, interp.y)
        if (mixerRef.current) mixerRef.current.update(delta)
      }
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(rafRef.current)
      visibilityObserver.disconnect()
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', onMouseMove)
      scene.clear()
      renderer.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  }, [switchAnimation])

  const ANIM_ICONS = ['🤖', '🕺', '⚡', '🚶', '✨', '💫']

  return (
    <div className="character-container">
      {/* Mini particles */}
      <MiniParticles />

      <div className="character-model" ref={containerRef}>
        <div className="character-rim" />
        <div className="character-hover" />
      </div>

      {/* Controls removed for cleaner aesthetic */}
    </div>
  )
}
