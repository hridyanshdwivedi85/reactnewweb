import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import FluidBackground from '../components/FluidBackground'

/* ══════════════════════════════════════════
   BRANDING PAGE — 10 Slides
   Full port of branding.html → React
   Nike · PS5 · Coke · Apple · ON Whey ·
   Cetaphil · Carlsberg · BMW · Xbox · GTA6
══════════════════════════════════════════ */

const slides = [
  {
    id: 'nike', theme: 'dark', cursor: '👟',
    bg: 'url(assets/images/bg_nike.png)',
    bgStyle: { filter: 'grayscale(100%) contrast(1.2) brightness(0.25)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' },
    fluidColor: '#a0a0a0',
  },
  {
    id: 'ps5', theme: 'dark', cursor: '🎮',
    bgVideo: 'https://cdn.pixabay.com/video/2020/05/25/40149-425254922_tiny.mp4',
    bgStyle: { filter: 'saturate(1.5) contrast(1.2) brightness(0.2)' },
    fluidColor: '#1e3a8a',
  },
  {
    id: 'coke', theme: 'light',
    slideStyle: { background: '#E50014' },
    fluidColor: '#7a000a',
  },
  {
    id: 'apple', theme: 'light',
    slideStyle: { background: '#f5f5f7' },
    fluidColor: '#9ca3af',
  },
  {
    id: 'on', theme: 'dark',
    slideStyle: { background: '#0A0A0A', color: 'white' },
    fluidColor: '#b45309',
  },
  {
    id: 'ceta', theme: 'light',
    slideStyle: { background: '#ffffff', color: '#005a9c' },
    fluidColor: '#1d4ed8',
  },
  {
    id: 'carls', theme: 'dark',
    slideStyle: { background: '#001B0E', color: '#D4AF37' },
    fluidColor: '#15803d',
  },
  {
    id: 'bmw', theme: 'dark',
    bgVideo: 'https://cdn.pixabay.com/video/2021/08/21/85860-591784961_tiny.mp4',
    bgStyle: { filter: 'brightness(0.25) contrast(1.3) saturate(0.8)' },
    slideStyle: { background: '#0a0a0a', color: 'white' },
    fluidColor: '#1d4ed8',
  },
  {
    id: 'xbox', theme: 'dark',
    bg: 'url(assets/images/xbox_bg.png)',
    bgStyle: { filter: 'brightness(0.22) saturate(1.5) contrast(1.2)' },
    slideStyle: { background: '#050f05', color: 'white' },
    fluidColor: '#166534',
  },
  {
    id: 'gta6', theme: 'dark',
    bgVideo: 'https://cdn.pixabay.com/video/2016/09/16/5227-182390772_tiny.mp4',
    bgStyle: { filter: 'brightness(0.35) saturate(2) contrast(1.15)', objectFit: 'cover' },
    slideStyle: { background: '#06060a', color: 'white' },
    fluidColor: '#be185d',
  },
]

/* Individual slide content components */
function NikeSlide({ active }) {
  return (
    <>
      <div className="br-text-block br-tl">
        <div className="br-brand-label" style={{ fontFamily: 'Space Grotesk', fontWeight: 900, letterSpacing: '0.3em', fontSize: '0.85rem' }}>NIKE</div>
        <h2 className="br-huge-title" style={{ fontFamily: 'Space Grotesk', color: '#fff' }}>
          Defy<br /><span style={{ color: '#666' }}>Gravity.</span>
        </h2>
        <p className="br-sarcastic">"Because running from your problems requires aerodynamic support."</p>
        <div className="br-price-tag"><span className="br-price-label">MSRP:</span><span className="br-price-val">$185.00</span></div>
      </div>
      <div className="br-visual-block br-br">
        <div className="br-tech-ring br-spin" />
        <div className="br-tech-ring br-ring-inner br-spin-rev" />
        <div className="br-nike-glow" />
        <div className="br-product br-nike-shoe float-fast" style={{ backgroundImage: 'url(assets/images/fg_nike.png)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', width: '100%', height: '100%' }} />
      </div>
    </>
  )
}

function PS5Slide({ active }) {
  return (
    <>
      <div className="br-ps5-glow" />
      <div className="br-visual-block" style={{ position: 'absolute', top: '50%', left: '75%', transform: 'translate(-50%,-50%)', width: '40vw', height: '50vh', zIndex: 30 }}>
        <div className="br-pulse-ring br-pulse" />
        <div className="br-product float-vertical" style={{ backgroundImage: 'url(assets/images/fg_ps5.png)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', width: '100%', height: '100%' }} />
      </div>
      <div className="br-text-block" style={{ position: 'absolute', top: '50%', left: '10%', transform: 'translateY(-50%)', width: '38vw', zIndex: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: '#fff' }}>
          <span style={{ fontSize: '1.5rem' }}>⬡</span>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', letterSpacing: '0.3em' }}>SONY</span>
        </div>
        <h2 className="br-huge-title" style={{ color: '#fff' }}>Play Has<br /><span style={{ color: '#3b82f6' }}>No Limits</span></h2>
        <div className="br-price-tag" style={{ borderColor: 'rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.1)' }}>
          <span className="br-price-label" style={{ color: '#bfdbfe' }}>SRP:</span><span className="br-price-val">$499.99</span>
        </div>
        <p className="br-sarcastic" style={{ color: '#93c5fd', borderColor: 'rgba(59,130,246,0.2)', background: 'rgba(30,58,138,0.3)' }}>
          "Outside has terrible graphics and bugs. Stay inside."
        </p>
      </div>
    </>
  )
}

function CokeSlide({ active }) {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center' }}>
      <div style={{ width: '40%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="assets/images/coke_can.png" className="float-fast" alt="Coca-Cola" style={{ height: '70%', objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }} />
      </div>
      <div style={{ width: '60%', padding: '0 4% 0 2%', color: '#fff' }}>
        <div style={{ fontFamily: 'Space Grotesk', fontSize: '2.5rem', fontWeight: 900, marginBottom: '16px', fontStyle: 'italic' }}>Coca-Cola</div>
        <h2 className="br-huge-title" style={{ color: '#fff' }}>Open<br />Happiness.</h2>
        <p className="br-sarcastic" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'rgba(255,255,255,0.9)', fontStyle: 'italic' }}>
          "Scientifically proven to make pizza taste 300% better."
        </p>
        <div className="br-price-tag" style={{ borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)' }}>
          <span className="br-price-val">12-PACK: $6.99</span>
        </div>
      </div>
    </div>
  )
}

function AppleSlide({ active }) {
  return (
    <>
      <div className="br-text-block" style={{ position: 'absolute', top: '50%', left: '10%', transform: 'translateY(-50%)', width: '40vw', zIndex: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', color: '#000', fontWeight: 700, fontSize: '1.1rem', marginBottom: '16px' }}>
          🍎 Watch Ultra
        </div>
        <h2 className="br-huge-title" style={{ color: '#000', lineHeight: 1 }}>Adventure<br />Awaits.</h2>
        <p className="br-sarcastic" style={{ color: '#6b7280', borderColor: '#e5e7eb', background: 'rgba(255,255,255,0.5)', fontFamily: 'JetBrains Mono', fontSize: '0.75rem' }}>
          // "Track exactly how many steps you didn't take today."
        </p>
        <div className="br-price-tag" style={{ borderColor: 'rgba(0,0,0,0.1)', background: 'rgba(0,0,0,0.05)', color: '#000' }}>
          <span style={{ fontSize: '0.7rem', color: '#6b7280', marginRight: '6px' }}>From</span>
          <span className="br-price-val" style={{ color: '#000', fontSize: '1.1rem' }}>$799.00</span>
        </div>
      </div>
      <div className="br-visual-block" style={{ position: 'absolute', top: '50%', right: '10%', transform: 'translateY(-50%)', width: '40vw', height: '60vh', zIndex: 30 }}>
        <img src="https://cdsassets.apple.com/live/SZLF0YNV/images/sp/111852_apple-watch-ultra.png"
          className="float-vertical" alt="Apple Watch Ultra"
          style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.2))' }} />
      </div>
    </>
  )
}

function OnSlide({ active }) {
  return (
    <>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotate(-10deg)', fontFamily: 'Space Grotesk', fontSize: '25vw', fontWeight: 900, color: 'rgba(255,215,0,0.03)', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 15 }}>
        GOLD STANDARD
      </div>
      <div className="br-text-block br-tl" style={{ zIndex: 40 }}>
        <div style={{ marginBottom: '20px' }}><span style={{ fontFamily: 'Space Grotesk', color: '#dc2626', fontWeight: 900, fontSize: '1.5rem', border: '2px solid #dc2626', padding: '2px 8px', borderRadius: '4px' }}>ON</span></div>
        <h2 className="br-huge-title" style={{ color: '#fff' }}>Fuel Your<br /><span style={{ color: '#eab308' }}>Greatness.</span></h2>
        <p className="br-sarcastic" style={{ borderLeft: '4px solid #dc2626', color: '#d1d5db' }}>"For when you want to look like you lift, but mostly just drink shakes."</p>
        <div className="br-price-tag" style={{ borderColor: 'rgba(234,179,8,0.3)', background: 'rgba(234,179,8,0.1)' }}>
          <span className="br-price-label" style={{ color: '#eab308' }}>5 LBS</span>
          <span className="br-price-val">$74.99</span>
        </div>
      </div>
      <div className="br-visual-block" style={{ position: 'absolute', bottom: '10%', right: '15%', width: '35vw', height: '60vh', zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="assets/images/whey_real.png" className="float-fast" alt="ON Whey" style={{ height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }} />
      </div>
    </>
  )
}

function CetaSlide({ active }) {
  return (
    <>
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '70vw', height: '70vw', background: 'radial-gradient(circle, rgba(0,90,156,0.05) 0%, transparent 60%)', borderRadius: '50%', zIndex: 12 }} />
      <div className="br-text-block" style={{ position: 'absolute', bottom: '15%', left: '8%', zIndex: 40, maxWidth: '45vw' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#005a9c', marginBottom: '16px', fontSize: '1.5rem', fontWeight: 900 }}>
          🌿 <span style={{ fontFamily: 'Space Grotesk', fontSize: '1.5rem' }}>Cetaphil</span>
        </div>
        <h2 className="br-huge-title" style={{ color: '#005a9c' }}>Pure<br /><span style={{ color: '#60a5fa' }}>Hydration.</span></h2>
        <p className="br-sarcastic" style={{ color: '#005a9c', borderLeft: '4px solid #60a5fa', background: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>
          "Because splashing tap water on your face at 3 AM isn't a skincare routine."
        </p>
        <div className="br-price-tag" style={{ borderColor: 'rgba(59,130,246,0.2)', background: 'rgba(59,130,246,0.1)', color: '#005a9c' }}>
          <span className="br-price-val" style={{ color: '#005a9c', fontSize: '1.1rem' }}>$14.50</span>
        </div>
      </div>
      <div className="br-visual-block" style={{ position: 'absolute', top: '50%', right: '10%', transform: 'translateY(-50%)', width: '30vw', height: '70vh', zIndex: 30 }}>
        <img src="assets/images/cetaphil_real.png" className="float-vertical" alt="Cetaphil" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
    </>
  )
}

function CarlsSlide({ active }) {
  return (
    <>
      <div className="br-text-block" style={{ position: 'absolute', top: '50%', left: '8%', transform: 'translateY(-50%)', zIndex: 40, maxWidth: '50vw' }}>
        <div style={{ fontFamily: 'Space Grotesk', fontSize: '2.5rem', fontWeight: 900, fontStyle: 'italic', color: '#D4AF37', textShadow: '0 0 20px rgba(212,175,55,0.5)', marginBottom: '16px' }}>Carlsberg</div>
        <h2 className="br-huge-title" style={{ color: '#fff' }}>Summer<br /><span style={{ color: '#D4AF37' }}>Vibes.</span></h2>
        <p className="br-sarcastic" style={{ color: '#00fa7d', borderLeft: '4px solid #D4AF37', fontWeight: 600 }}>
          "Probably the best excuse to skip the gym today."
        </p>
        <div className="br-price-tag" style={{ borderColor: 'rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.1)' }}>
          <span className="br-price-val" style={{ color: '#fff', fontSize: '1.1rem' }}>$12.99 // 6-PACK</span>
        </div>
      </div>
      <div className="br-visual-block" style={{ position: 'absolute', bottom: 0, right: '8%', width: '40vw', height: '85vh', zIndex: 30, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        <img src="assets/images/carlsberg_real.png" className="float-fast" alt="Carlsberg" style={{ height: '110%', objectFit: 'contain', filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.8))' }} />
      </div>
    </>
  )
}

function BMWSlide({ active }) {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, transparent 40%, rgba(0,102,204,0.08) 50%, transparent 60%)', zIndex: 11, pointerEvents: 'none' }} />
      <div className="br-text-block" style={{ position: 'absolute', top: '50%', left: '6%', transform: 'translateY(-50%)', zIndex: 40, maxWidth: '38vw' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <svg width="48" height="48" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="3"/>
            <circle cx="50" cy="50" r="42" fill="none" stroke="white" strokeWidth="1.5"/>
            <path d="M50 8 L50 50 L8 50" fill="#0066CC"/>
            <path d="M50 50 L50 92 L92 50" fill="#0066CC"/>
            <path d="M50 8 L50 50 L92 50" fill="white"/>
            <path d="M50 50 L50 92 L8 50" fill="white"/>
          </svg>
          <div>
            <div style={{ fontFamily: 'Space Grotesk', color: '#fff', fontSize: '1.2rem', fontWeight: 900 }}>BMW</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '9px', color: '#60a5fa', letterSpacing: '0.3em' }}>M SERIES</div>
          </div>
        </div>
        <h2 className="br-huge-title" style={{ color: '#fff' }}>Born To<br /><span style={{ background: 'linear-gradient(135deg,#60a5fa,#a78bfa,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Dominate.</span></h2>
        <p className="br-sarcastic" style={{ borderLeft: '4px solid #3b82f6', color: '#d1d5db' }}>
          "0–60 in 3.2s. Your student loan? 0–crippling in 3.2 semesters."
        </p>
        <div className="br-price-tag" style={{ borderColor: 'rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.1)' }}>
          <span className="br-price-label" style={{ color: '#93c5fd' }}>STARTING:</span>
          <span className="br-price-val">$142,000</span>
        </div>
      </div>
      <div className="br-visual-block" style={{ position: 'absolute', bottom: '8%', right: '3%', width: '50vw', height: '45vh', zIndex: 30, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        <img src="assets/images/bmw_car.png" className="float-fast" alt="BMW M Series" style={{ height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 20px 60px rgba(0,100,255,0.3))' }} />
      </div>
    </>
  )
}

function XboxSlide({ active }) {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 5px, rgba(16,124,16,0.02) 5px, rgba(16,124,16,0.02) 6px)', zIndex: 11, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '50%', left: '75%', transform: 'translate(-50%,-50%)', width: '60vw', height: '60vw', maxWidth: '700px', maxHeight: '700px', background: 'radial-gradient(circle, rgba(16,124,16,0.28) 0%, transparent 65%)', zIndex: 12, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', width: '80px', height: '80px', borderTop: '2px solid rgba(16,180,16,0.5)', borderLeft: '2px solid rgba(16,180,16,0.5)', zIndex: 15 }} />
      <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', width: '80px', height: '80px', borderBottom: '2px solid rgba(16,180,16,0.5)', borderRight: '2px solid rgba(16,180,16,0.5)', zIndex: 15 }} />
      <div id="xbox-text-block" className="br-text-block" style={{ position: 'absolute', top: '50%', left: '8%', transform: 'translateY(-50%)', zIndex: 40, maxWidth: '44vw' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <svg width="44" height="44" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#107C10"/><line x1="22" y1="22" x2="78" y2="78" stroke="white" strokeWidth="11" strokeLinecap="round"/><line x1="78" y1="22" x2="22" y2="78" stroke="white" strokeWidth="11" strokeLinecap="round"/></svg>
          <div>
            <div style={{ fontFamily: 'Space Grotesk', color: '#fff', fontSize: '1.4rem', fontWeight: 700 }}>Xbox</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', letterSpacing: '0.25em', color: '#52d152' }}>SERIES X</div>
          </div>
        </div>
        <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(2rem,3.8vw,3.5rem)', fontWeight: 900, lineHeight: 0.92, letterSpacing: '-0.03em', color: '#fff', textShadow: '0 0 40px rgba(16,180,16,0.3)', marginBottom: '16px' }}>
          Next Gen.<br />Next Level.<br /><span style={{ background: 'linear-gradient(135deg,#52d152,#107C10)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>No Excuses.</span>
        </h2>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 'clamp(0.6rem,0.95vw,0.75rem)', color: 'rgba(82,209,82,0.85)', background: 'rgba(16,124,16,0.08)', border: '1px solid rgba(16,180,16,0.2)', borderLeft: '3px solid #52d152', borderRadius: '4px', padding: '10px 16px', marginBottom: '20px', lineHeight: 1.65 }}>
          // "12 teraflops. Your GPU is crying.<br />Your wallet is already in therapy."
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
          {['12 TERAFLOPS GPU · RDNA 2', '1TB NVME SSD · ZERO LOAD SCREENS', '4K 120FPS · DOLBY VISION', 'QUICK RESUME · 6 GAMES'].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#52d152', boxShadow: '0 0 6px #52d152', flexShrink: 0 }} />
              {s}
            </div>
          ))}
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(16,124,16,0.15)', border: '1px solid rgba(16,180,16,0.3)', borderRadius: '999px', padding: '8px 22px' }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#52d152' }}>STARTING AT</span>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.3rem', color: '#fff' }}>$499.99</span>
        </div>
      </div>
      <div className="br-visual-block" style={{ position: 'absolute', top: '50%', left: '75%', transform: 'translate(-50%,-50%)', width: '42vw', height: '80vh', zIndex: 30 }}>
        <div className="br-pulse-ring br-pulse" style={{ borderColor: 'rgba(16,180,16,0.3)' }} />
        <img src="assets/images/xbox_real.png" className="float-vertical" alt="Xbox Series X" style={{ width: '100%', height: '85%', objectFit: 'contain', filter: 'drop-shadow(0 0 60px rgba(16,180,16,0.35))' }} />
      </div>
    </>
  )
}

function GTA6Slide({ active }) {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,6,10,0.75) 0%, rgba(6,6,10,0.2) 40%, rgba(6,6,10,0.5) 70%, rgba(6,6,10,0.92) 100%)', zIndex: 11, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '22vw', background: 'linear-gradient(to right, rgba(6,6,10,0.9), transparent)', zIndex: 12, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '22vw', background: 'linear-gradient(to left, rgba(6,6,10,0.9), transparent)', zIndex: 12, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent, #FF6E1E, #FF3E8A, #FF6E1E, transparent)', zIndex: 60 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent, #FF6E1E, #FF3E8A, #FF6E1E, transparent)', zIndex: 60 }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '50%', transform: 'translateX(-50%)', width: '80vw', height: '40vh', background: 'radial-gradient(ellipse, rgba(255,110,30,0.18) 0%, transparent 70%)', zIndex: 14, pointerEvents: 'none' }} />

      <div style={{ position: 'absolute', inset: 0, zIndex: 40, display: 'flex', alignItems: 'center', padding: '0 5%', gap: '2vw' }}>
        {/* Text LEFT */}
        <div style={{ flex: 1 }}>
          <div style={{ background: 'rgba(6,6,10,0.55)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,110,30,0.12)', borderRadius: '12px', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', letterSpacing: '0.45em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>▸ ROCKSTAR GAMES PRESENTS</div>
            <img src="assets/images/gta6.png" alt="GTA VI" style={{ width: 'auto', maxWidth: '100%', height: 'clamp(60px,10vw,120px)', objectFit: 'contain', filter: 'drop-shadow(0 0 20px rgba(255,110,30,0.5))' }} onError={e => e.target.style.display='none'} />
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 'clamp(0.55rem,0.85vw,0.72rem)', letterSpacing: '0.45em', color: 'rgba(255,80,30,0.95)', textTransform: 'uppercase' }}>◈  COMING 2025  ◈</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 'clamp(0.6rem,0.95vw,0.75rem)', color: 'rgba(255,140,80,0.9)', lineHeight: 1.65 }}>
              // "Finally — a game that lets you simulate crime,<br />traffic jams & moral bankruptcy at 60fps."
            </div>
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(135deg, #FF6E1E, #FF3E8A)', color: '#fff', fontFamily: 'Space Grotesk', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '13px 32px', borderRadius: '4px', border: 'none', cursor: 'pointer', boxShadow: '0 0 25px rgba(255,110,30,0.4)', width: 'fit-content' }}>
              🎮 Pre-Book Now
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
              {[{ n: '170M+', l: 'GTA V Sold' }, { n: '$2B+', l: 'Day-1 Target' }, { n: '∞', l: 'Chaos Index' }].map((s, i) => (
                <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {i > 0 && <div style={{ width: '1px', height: '36px', background: 'rgba(255,255,255,0.12)' }} />}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontFamily: 'Space Grotesk', fontSize: '1.4rem', fontWeight: 700, color: '#FF6E1E' }}>{s.n}</span>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.45rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>{s.l}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CD RIGHT */}
        <div style={{ flex: '0 0 auto', width: '42vw', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <div style={{ position: 'relative', width: 'clamp(180px,28vw,360px)', height: 'clamp(180px,28vw,360px)' }}>
            <div style={{ position: 'absolute', inset: '-15%', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,110,30,0.15) 0%, transparent 65%)', animation: 'discGlowPulse 3s ease-in-out infinite', pointerEvents: 'none' }} />
            <img src="assets/images/cd.png" alt="GTA 6 Disc" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', animation: 'discSpin 7s linear infinite', filter: 'drop-shadow(0 0 30px rgba(255,110,30,0.55)) drop-shadow(0 0 60px rgba(255,60,130,0.25))', position: 'relative', zIndex: 2 }} onError={e => e.target.style.display='none'} />
          </div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.55rem', letterSpacing: '0.35em', color: 'rgba(255,80,30,0.95)', textTransform: 'uppercase' }}>▶  PHYSICAL EDITION INCLUDED  ◀</div>
        </div>
      </div>
    </>
  )
}

const slideComponents = [NikeSlide, PS5Slide, CokeSlide, AppleSlide, OnSlide, CetaSlide, CarlsSlide, BMWSlide, XboxSlide, GTA6Slide]
const slideNames = ['NIKE', 'PS5', 'COLA', 'APPLE', 'ON', 'CETA', 'CARLS', 'BMW', 'XBOX', 'GTA6']

export default function BrandingPage() {
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const touchStart = useRef(null)

  const goTo = useCallback((i) => {
    if (transitioning || i === current) return
    setTransitioning(true)
    setTimeout(() => { setCurrent(i); setTransitioning(false) }, 350)
  }, [current, transitioning])

  const next = useCallback(() => { if (current < slides.length - 1) goTo(current + 1) }, [current, goTo])
  const prev = useCallback(() => { if (current > 0) goTo(current - 1) }, [current, goTo])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])


  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900)
    onResize()
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (touchStart.current == null) return
    const delta = e.changedTouches[0].clientX - touchStart.current
    if (Math.abs(delta) > 50) {
      if (delta < 0) next()
      else prev()
    }
    touchStart.current = null
  }

  const s = slides[current]
  const SlideContent = slideComponents[current]
  const isLight = s.theme === 'light'

  return (
    <div className={`brand-page-v2 ${isMobile ? 'mobile' : ''}`} style={{ background: '#000' }}>
      <FluidBackground baseColor={s.fluidColor} lowPower={isMobile} />

      {/* Slide Content wrapped in an elegant glass card */}
      <div className={`br-slide-content ${transitioning ? 'br-slide-out' : 'br-slide-in'}`} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
        <div className="br-ad-card" style={{
          position: 'relative',
          width: isMobile ? '100%' : '95vw',
          height: isMobile ? '100%' : '90vh',
          background: isMobile ? 'transparent' : 'rgba(10, 10, 15, 0.4)',
          backdropFilter: isMobile ? 'none' : 'blur(24px)',
          WebkitBackdropFilter: isMobile ? 'none' : 'blur(24px)',
          border: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: isMobile ? '0' : '24px',
          overflow: 'hidden',
          boxShadow: isMobile ? 'none' : '0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <SlideContent active={!transitioning} />
        </div>
      </div>

      {/* Nav Bar at top */}
      <div className="br-nav-top" style={{ color: isLight ? '#000' : '#fff' }}>
        <Link to="/" className="br-back-btn" style={{ color: isLight ? '#333' : 'rgba(255,255,255,0.7)', borderColor: isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)' }}>
          ← Hub
        </Link>
        <div className="br-slide-counter" style={{ color: isLight ? '#000' : '#fff' }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', letterSpacing: '0.2em' }}>
            {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </span>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '12px' }}>
            {slideNames[current]}
          </span>
        </div>
      </div>

      {/* Prev / Next arrows */}
      <div className="br-arrows">
        <button className="br-arrow" onClick={prev} disabled={current === 0}
          style={{ background: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.5)', color: isLight ? '#000' : '#fff', border: `1px solid ${isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'}` }}>
          ‹
        </button>
        <button className="br-arrow" onClick={next} disabled={current === slides.length - 1}
          style={{ background: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.5)', color: isLight ? '#000' : '#fff', border: `1px solid ${isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'}` }}>
          ›
        </button>
      </div>

      {/* Dot indicators */}
      <div className="br-dots">
        {slides.map((_, i) => (
          <button key={i} className={`br-dot ${i === current ? 'br-dot-active' : ''}`}
            onClick={() => goTo(i)}
            style={{ background: i === current ? '#fff' : 'rgba(255,255,255,0.3)' }}
          />
        ))}
      </div>
    </div>
  )
}
