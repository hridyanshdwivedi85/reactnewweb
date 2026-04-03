import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform vec3 uColor;
varying vec2 vUv;

// More advanced FBM and noise for liquid effect
float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f*f*(3.0-2.0*f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

#define OCTAVES 6
float fbm(in vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st = rot * st * 2.0 + shift;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
    vec2 st = gl_FragCoord.xy/uResolution.xy;
    st.x *= uResolution.x/uResolution.y;

    // Mouse influence is very strong and localized
    vec2 mouseEffect = (uMouse * 2.0 - 1.0);
    mouseEffect.x *= uResolution.x/uResolution.y;
    
    // Distance field for mouse displacement
    float mouseDist = distance(st, mouseEffect * 0.5 + 0.5 * vec2(uResolution.x/uResolution.y, 1.0));
    float mouseInfluence = smoothstep(0.4, 0.0, mouseDist); // High interaction radius

    // Layer 1: Base flow
    vec2 q = vec2(0.);
    q.x = fbm(st + 0.05 * uTime);
    q.y = fbm(st + vec2(1.0));

    // Layer 2: Secondary distortion heavily influenced by mouse
    vec2 r = vec2(0.);
    r.x = fbm(st + 1.0 * q + vec2(1.7, 9.2) + 0.15 * uTime + mouseInfluence * 2.0);
    r.y = fbm(st + 1.0 * q + vec2(8.3, 2.8) + 0.126 * uTime - mouseInfluence * 2.0);

    float f = fbm(st + r);

    // Color mixing to achieve premium responsive liquid look
    vec3 baseColorDark = mix(vec3(0.0), uColor * 0.15, 0.5); // Very dark tint of the base color
    vec3 highlightColor = mix(vec3(0.8, 0.85, 0.9), uColor + vec3(0.5), 0.3); // Bright liquid reflections

    vec3 color = mix(
        baseColorDark,
        highlightColor,
        clamp(f * f * 3.5, 0.0, 1.0)
    );

    // Vignette / Depth gradient
    color = mix(color, vec3(0.0), clamp(length(q) * 0.8, 0.0, 1.0));

    // Dynamic contrast boost
    color = color * color * (1.5 + mouseInfluence * 0.5); 

    gl_FragColor = vec4(color, 1.0);
}
`;

const FluidShaderMaterial = ({ baseColor }) => {
  const meshRef = useRef();
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const targetColor = useMemo(() => new THREE.Color(), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uColor: { value: new THREE.Color(baseColor || '#111111') },
    }),
    []
  );

  useEffect(() => {
    targetColor.set(baseColor || '#111111');
  }, [baseColor, targetColor]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX / window.innerWidth;
      mouse.current.y = 1.0 - (e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime() * 0.4;
      
      meshRef.current.material.uniforms.uColor.value.lerp(targetColor, 0.05);
      meshRef.current.material.uniforms.uMouse.value.lerp(mouse.current, 0.08);
      meshRef.current.material.uniforms.uResolution.value.set(state.size.width, state.size.height);
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
};

export default function FluidBackground({ baseColor = '#111111' }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', background: '#000' }}>
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <FluidShaderMaterial baseColor={baseColor} />
      </Canvas>
    </div>
  );
}
