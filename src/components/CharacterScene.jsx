// CharacterScene.jsx — Exact 3D character sync with 3d-portfolio-main
// Camera, lighting, touch, and head-tracking match the reference Scene.tsx

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader, DRACOLoader, RGBELoader } from 'three-stdlib'

/* ─── Decrypt helper ─── */
async function generateAESKey(password) {
  const passwordBuffer = new TextEncoder().encode(password)
  const hashedPassword = await crypto.subtle.digest('SHA-256', passwordBuffer)
  return crypto.subtle.importKey('raw', hashedPassword.slice(0, 32), { name: 'AES-CBC' }, false, ['encrypt', 'decrypt'])
}
async function decryptFile(url, password) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to fetch ${url}`)
  const encryptedData = await response.arrayBuffer()
  const iv = new Uint8Array(encryptedData.slice(0, 16))
  const data = encryptedData.slice(16)
  const key = await generateAESKey(password)
  return crypto.subtle.decrypt({ name: 'AES-CBC', iv }, key, data)
}

/* ─── Lighting ─── */
function setupLighting(scene) {
  const ambient = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambient)
  const frontKey = new THREE.DirectionalLight(0xffffff, 3.0)
  frontKey.position.set(0, 8, 14)
  scene.add(frontKey)
  const rimLeft = new THREE.DirectionalLight(0x7c3aed, 2.2)
  rimLeft.position.set(-8, 4, -4)
  scene.add(rimLeft)
  const rimRight = new THREE.DirectionalLight(0x2563eb, 1.5)
  rimRight.position.set(8, 4, -4)
  scene.add(rimRight)
  const fill = new THREE.DirectionalLight(0xffffff, 0.6)
  fill.position.set(0, -4, 10)
  scene.add(fill)
  const screenLight = new THREE.PointLight(0x7c3aed, 2.5, 8)
  screenLight.position.set(0, 13.5, 22)
  scene.add(screenLight)
  return { screenLight }
}

/* ─── Head tracking ─── */
function rotateHead(headBone, targetX, targetY, lerpX, lerpY) {
  if (!headBone) return
  const maxRot = 0.3
  headBone.rotation.y = THREE.MathUtils.lerp(headBone.rotation.y, targetX * maxRot, lerpX)
  headBone.rotation.x = THREE.MathUtils.lerp(headBone.rotation.x, -targetY * maxRot * 0.4, lerpY)
}

export default function CharacterScene() {
  const containerRef = useRef(null)
  const hoverDivRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let rect = container.getBoundingClientRect()
    let W = rect.width || window.innerWidth
    let H = rect.height || window.innerHeight
    const aspect = W / H

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()

    // ── EXACT CAMERA SYNC with 3d-portfolio-main Scene.tsx ──
    const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000)
    camera.position.z = 10
    camera.position.set(0, 13.1, 24.7)
    camera.zoom = 1.1
    camera.updateProjectionMatrix()

    const { screenLight } = setupLighting(scene)

    new RGBELoader()
      .setPath('/models/')
      .load('char_enviorment.hdr', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping
        scene.environment = texture
        scene.environmentIntensity = 0.7
      })

    // Mouse + touch tracking — same interpolation as 3d-portfolio
    let mouse = { x: 0, y: 0 }
    let interpolation = { x: 0.1, y: 0.2 }

    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // Touch support — matches 3d-portfolio handleTouchMove / handleTouchEnd
    let debounce
    const landingDiv = document.getElementById('landingDiv')
    const onTouchStart = (e) => {
      debounce = setTimeout(() => {
        e.target?.addEventListener('touchmove', onTouchMove, { passive: true })
      }, 200)
    }
    const onTouchMove = (e) => {
      const t = e.touches[0]
      if (!t) return
      mouse.x = (t.clientX / window.innerWidth) * 2 - 1
      mouse.y = -((t.clientY / window.innerHeight) * 2 - 1)
    }
    const onTouchEnd = () => {
      // Gradually return head to center after touch ends
      mouse = { x: 0, y: 0 }
      interpolation = { x: 0.05, y: 0.05 }
      setTimeout(() => { interpolation = { x: 0.1, y: 0.2 } }, 800)
    }
    if (landingDiv) {
      landingDiv.addEventListener('touchstart', onTouchStart, { passive: true })
      landingDiv.addEventListener('touchend', onTouchEnd, { passive: true })
    }

    const handleResize = () => {
      if (!containerRef.current) return
      let r = containerRef.current.getBoundingClientRect()
      let w = r.width || window.innerWidth
      let h = r.height || window.innerHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', handleResize, { passive: true })

    let headBone = null
    let mixer = null
    let characterLoaded = false
    const clock = new THREE.Clock()

    const loader = new GLTFLoader()
    const draco = new DRACOLoader()
    draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')
    loader.setDRACOLoader(draco)

    decryptFile('/models/character.enc', 'MyCharacter12')
      .then((buffer) => {
        loader.parse(buffer, '', (gltf) => {
          const char = gltf.scene

          char.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true
              child.receiveShadow = true
              child.frustumCulled = false
            }
          })

          const footR = char.getObjectByName('footR')
          const footL = char.getObjectByName('footL')
          if (footR) footR.position.y = 3.36
          if (footL) footL.position.y = 3.36

          char.traverse((child) => {
            if (child.name && (child.name.toLowerCase().includes('monitor') || child.name.toLowerCase().includes('screen'))) {
              child.visible = false
            }
          })

          scene.add(char)
          headBone = char.getObjectByName('spine006') || null

          if (gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(char)
            const idleClip = gltf.animations.find((a) =>
              a.name.toLowerCase().includes('idle') || a.name.toLowerCase().includes('stand')
            ) || gltf.animations[0]
            if (idleClip) {
              const action = mixer.clipAction(idleClip)
              action.play()
            }
          }

          characterLoaded = true
          draco.dispose()
          containerRef.current?.parentElement?.classList.add('character-loaded')
        }, (err) => {
          console.warn('Character parse failed:', err)
        })
      })
      .catch((err) => console.warn('Decrypt failed:', err))

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate)
      const delta = clock.getDelta()

      if (headBone && characterLoaded) {
        // Exact interpolation from 3d-portfolio { x: 0.1, y: 0.2 }
        rotateHead(headBone, mouse.x, mouse.y, interpolation.x, interpolation.y)
      }

      if (screenLight) {
        screenLight.intensity = 2.2 + Math.sin(clock.elapsedTime * 1.8) * 0.5
      }

      if (mixer) mixer.update(delta)
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(rafRef.current)
      clearTimeout(debounce)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', onMouseMove)
      if (landingDiv) {
        landingDiv.removeEventListener('touchstart', onTouchStart)
        landingDiv.removeEventListener('touchend', onTouchEnd)
      }
      scene.clear()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="character-container">
      <div className="character-model" ref={containerRef}>
        <div className="character-rim"></div>
        <div className="character-hover" ref={hoverDivRef}></div>
      </div>
    </div>
  )
}
