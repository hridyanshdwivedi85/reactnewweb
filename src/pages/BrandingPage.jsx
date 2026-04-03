import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import FluidBackground from '../components/FluidBackground'
import ShoeViewer from '../components/ShoeViewer'
import CokeVendingMachine from '../components/CokeVendingMachine'

/* ══════════════════════════════════════════
   BRANDING PAGE — 10 Slides
   Nike · PS5 · Coke · Apple · ON Whey ·
   Cetaphil · Carlsberg · BMW · Xbox · GTA6
══════════════════════════════════════════ */

const slides = [
  {
    id: 'adidas', theme: 'dark', cursor: 'adidas',
    bg: 'url(assets/images/bg_adidas.png)',
    bgStyle: { filter: 'grayscale(100%) contrast(1.2) brightness(0.15)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' },
    fluidColor: '#0033aa',
    cardBg: 'rgba(10, 10, 20, 0.25)',
  },
  {
    id: 'ps5', theme: 'dark', cursor: '🎮',
    bgVideo: 'https://cdn.pixabay.com/video/2020/05/25/40149-425254922_tiny.mp4',
    bgStyle: { filter: 'saturate(1.5) contrast(1.2) brightness(0.2)' },
    fluidColor: '#1e3a8a',
    cardBg: 'rgba(5, 10, 40, 0.4)',
  },
  {
    id: 'coke', theme: 'light',
    slideStyle: { background: '#E50014' },
    fluidColor: '#7a000a',
    cardBg: 'rgba(229, 0, 20, 0.1)',
  },
  {
    id: 'apple', theme: 'light',
    slideStyle: { background: '#f5f5f7' },
    fluidColor: '#9ca3af',
    cardBg: 'rgba(240, 240, 245, 0.3)',
  },
  {
    id: 'on', theme: 'dark',
    slideStyle: { background: '#0A0A0A', color: 'white' },
    fluidColor: '#b45309',
    cardBg: 'rgba(15, 10, 0, 0.4)',
  },
  {
    id: 'ceta', theme: 'light',
    slideStyle: { background: '#ffffff', color: '#005a9c' },
    fluidColor: '#1d4ed8',
    cardBg: 'rgba(255, 255, 255, 0.4)',
  },
  {
    id: 'carls', theme: 'dark',
    slideStyle: { background: '#001B0E', color: '#D4AF37' },
    fluidColor: '#15803d',
    cardBg: 'rgba(0, 25, 10, 0.4)',
  },
  {
    id: 'bmw', theme: 'dark',
    bgVideo: 'https://cdn.pixabay.com/video/2021/08/21/85860-591784961_tiny.mp4',
    bgStyle: { filter: 'brightness(0.25) contrast(1.3) saturate(0.8)' },
    slideStyle: { background: '#0a0a0a', color: 'white' },
    fluidColor: '#1d4ed8',
    cardBg: 'rgba(10, 15, 25, 0.4)',
  },
  {
    id: 'xbox', theme: 'dark',
    bg: 'url(assets/images/xbox_bg.png)',
    bgStyle: { filter: 'brightness(0.22) saturate(1.5) contrast(1.2)' },
    slideStyle: { background: '#050f05', color: 'white' },
    fluidColor: '#166534',
    cardBg: 'rgba(5, 25, 10, 0.3)',
  },
  {
    id: 'gta6', theme: 'dark',
    bgVideo: 'https://cdn.pixabay.com/video/2016/09/16/5227-182390772_tiny.mp4',
    bgStyle: { filter: 'brightness(0.35) saturate(2) contrast(1.15)', objectFit: 'cover' },
    slideStyle: { background: '#06060a', color: 'white' },
    fluidColor: '#be185d',
    cardBg: 'rgba(15, 5, 15, 0.4)',
  },
]

/* ── Adidas Slide wrapping new 3D viewer ── */
function AdidasSlide({ isMobile }) {
  return <ShoeViewer isMobile={isMobile} />
}

function PS5Slide() {
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

/* ── Coke Slide wrapping new Vending Machine ── */
function CokeSlide({ isMobile }) {
  return <CokeVendingMachine isMobile={isMobile} />
}

function AppleSlide() {
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

function OnSlide() {
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

function CetaSlide() {
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

function CarlsSlide() {
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

function BMWSlide() {
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

function XboxSlide({ isMobile }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: isMobile ? 'flex-end' : 'center', padding: isMobile ? '80px 20px 40px' : '0 5%' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 5px, rgba(16,124,16,0.02) 5px, rgba(16,124,16,0.02) 6px)', zIndex: 11, pointerEvents: 'none' }} />
      <div id="xbox-text-block" className="br-text-block" style={{ position: isMobile ? 'static' : 'absolute', top: '50%', left: '8%', transform: isMobile ? 'none' : 'translateY(-50%)', zIndex: 40, maxWidth: isMobile ? '100%' : '44vw', textAlign: isMobile ? 'center' : 'left', marginBottom: isMobile ? '20px' : '0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', justifyContent: isMobile ? 'center' : 'flex-start' }}>
          <svg width="44" height="44" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#107C10"/><line x1="22" y1="22" x2="78" y2="78" stroke="white" strokeWidth="11" strokeLinecap="round"/><line x1="78" y1="22" x2="22" y2="78" stroke="white" strokeWidth="11" strokeLinecap="round"/></svg>
          <div>
            <div style={{ fontFamily: 'Space Grotesk', color: '#fff', fontSize: '1.4rem', fontWeight: 700 }}>Xbox</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', letterSpacing: '0.25em', color: '#52d152' }}>SERIES X</div>
          </div>
        </div>
        <h2 style={{ fontFamily: 'Space Grotesk', fontSize: isMobile ? '2.2rem' : 'clamp(2rem,3.8vw,3.5rem)', fontWeight: 900, lineHeight: 0.92, letterSpacing: '-0.03em', color: '#fff', textShadow: '0 0 40px rgba(16,180,16,0.3)', marginBottom: '16px' }}>
          Next Gen.<br />Next Level.<br /><span style={{ background: 'linear-gradient(135deg,#52d152,#107C10)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>No Excuses.</span>
        </h2>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(16,124,16,0.15)', border: '1px solid rgba(16,180,16,0.3)', borderRadius: '999px', padding: '8px 22px' }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#52d152' }}>STARTING AT</span>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.3rem', color: '#fff' }}>$499.99</span>
        </div>
      </div>
      <div className="br-visual-block" style={{ position: isMobile ? 'relative' : 'absolute', top: isMobile ? 'auto' : '50%', left: isMobile ? 'auto' : '75%', transform: isMobile ? 'none' : 'translate(-50%,-50%)', width: isMobile ? '70vw' : '42vw', height: isMobile ? '40vh' : '80vh', zIndex: 30 }}>
        <img src="assets/images/xbox_real.png" className="float-vertical" alt="Xbox Series X" style={{ width: '100%', height: isMobile ? '100%' : '85%', objectFit: 'contain', filter: 'drop-shadow(0 0 60px rgba(16,180,16,0.35))' }} />
      </div>
    </div>
  )
}

function GTA6Slide({ isMobile }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,6,10,0.75) 0%, rgba(6,6,10,0.2) 40%, rgba(6,6,10,0.5) 70%, rgba(6,6,10,0.92) 100%)', zIndex: 11, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent, #FF6E1E, #FF3E8A, #FF6E1E, transparent)', zIndex: 60 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent, #FF6E1E, #FF3E8A, #FF6E1E, transparent)', zIndex: 60 }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 40, display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', padding: isMobile ? '80px 24px 24px' : '0 5%', gap: isMobile ? '2rem' : '2vw', width: '100%', height: '100%' }}>
        <div style={{ flex: 1, width: isMobile ? '100%' : 'auto' }}>
          <div style={{ background: 'rgba(6,6,10,0.55)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,110,30,0.12)', borderRadius: '12px', padding: isMobile ? '20px' : '28px 32px', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: isMobile ? 'center' : 'flex-start', textAlign: isMobile ? 'center' : 'left' }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', letterSpacing: '0.45em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>▸ ROCKSTAR GAMES PRESENTS</div>
            <img src="assets/images/gta6.png" alt="GTA VI" style={{ width: 'auto', maxWidth: '100%', height: isMobile ? '60px' : 'clamp(60px,10vw,120px)', objectFit: 'contain', filter: 'drop-shadow(0 0 20px rgba(255,110,30,0.5))' }} onError={e => e.target.style.display='none'} />
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: 'rgba(255,140,80,0.9)', lineHeight: 1.65 }}>
              // "Finally — a game that lets you simulate crime,<br />traffic jams &amp; moral bankruptcy at 60fps."
            </div>
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(135deg, #FF6E1E, #FF3E8A)', color: '#fff', fontFamily: 'Space Grotesk', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '13px 32px', borderRadius: '4px', border: 'none', cursor: 'pointer', boxShadow: '0 0 25px rgba(255,110,30,0.4)', width: 'fit-content' }}>
              🎮 Pre-Book
            </button>
          </div>
        </div>
        <div style={{ flex: '0 0 auto', width: isMobile ? '60vw' : '42vw', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ position: 'relative', width: isMobile ? '180px' : 'clamp(180px,28vw,360px)', height: isMobile ? '180px' : 'clamp(180px,28vw,360px)' }}>
            <img src="assets/images/cd.png" alt="GTA 6 Disc" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', animation: 'discSpin 10s linear infinite', filter: 'drop-shadow(0 0 30px rgba(255,110,30,0.55))' }} onError={e => e.target.style.display='none'} />
          </div>
        </div>
      </div>
    </div>
  )
}

const slideComponents = [AdidasSlide, PS5Slide, CokeSlide, AppleSlide, OnSlide, CetaSlide, CarlsSlide, BMWSlide, XboxSlide, GTA6Slide]
const slideNames = ['ADIDAS', 'PS5', 'COLA', 'APPLE', 'ON', 'CETA', 'CARLS', 'BMW', 'XBOX', 'GTA6']
const slideIcons = ['👟', '🎮', '🥤', '🍎', '💪', '🌿', '🍺', '🚗', '🎮', '🎯']

/* Adidas logo cursor SVG data URI (Simplified) */
const ADIDAS_CURSOR_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M2 18h4l6-10H8zm7 0h4l4-7h-4zm7 0h4l2-4h-4z' fill='white' opacity='0.92'/></svg>`
const ADIDAS_CURSOR = `url("data:image/svg+xml;utf8,${encodeURIComponent(ADIDAS_CURSOR_SVG)}") 12 12, auto`

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
    const onKey = (e) => { if (e.key === 'ArrowRight') next(); if (e.key === 'ArrowLeft') prev() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900)
    onResize()
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleTouchStart = (e) => { touchStart.current = e.touches[0].clientX }
  const handleTouchEnd = (e) => {
    if (touchStart.current == null) return
    const delta = e.changedTouches[0].clientX - touchStart.current
    if (Math.abs(delta) > 50) { if (delta < 0) next(); else prev() }
    touchStart.current = null
  }

  const s = slides[current]
  const SlideContent = slideComponents[current]
  const isLight = s.theme === 'light'
  const isAdidas = s.id === 'adidas'
  const isCoke = s.id === 'coke'
  /* Adidas/Coke slides render their own full canvas — skip glass card framing */
  const isFullCanvas = isAdidas || isCoke

  const customCursor = isAdidas ? ADIDAS_CURSOR : 'auto'

  return (
    <div
      className={`brand-page-v2 ${isMobile ? 'mobile' : ''}`}
      style={{ background: '#000', cursor: customCursor }}
    >
      {/* Skip FluidBackground for slides that render their own WebGL Canvas to avoid context loss */}
      {!isFullCanvas && <FluidBackground baseColor={s.fluidColor} lowPower={isMobile} />}

      {/* Slide Content */}
      <div
        className={`br-slide-content ${transitioning ? 'br-slide-out' : 'br-slide-in'}`}
        onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
      >
        <div
          className="br-ad-card"
          style={{
            position: 'relative',
            width: isMobile ? '100%' : '95vw',
            height: isMobile ? '100%' : '90vh',
            background: isFullCanvas ? 'transparent' : (isMobile ? 'transparent' : s.cardBg || 'rgba(10, 10, 15, 0.4)'),
            backdropFilter: (isFullCanvas || isMobile) ? 'none' : 'blur(24px)',
            WebkitBackdropFilter: (isFullCanvas || isMobile) ? 'none' : 'blur(24px)',
            border: (isFullCanvas || isMobile) ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: (isFullCanvas || isMobile) ? '0' : '24px',
            overflow: 'hidden',
            boxShadow: (isFullCanvas || isMobile) ? 'none' : '0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
          }}
        >
          <SlideContent active={!transitioning} isMobile={isMobile} />
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

      {/* Prev / Next arrows — hide on mobile (replaced by bottom nav) */}
      {!isMobile && (
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
      )}

      {/* Desktop dot indicators */}
      {!isMobile && (
        <div className="br-dots">
          {slides.map((_, i) => (
            <button key={i} className={`br-dot ${i === current ? 'br-dot-active' : ''}`}
              onClick={() => goTo(i)}
              style={{ background: i === current ? '#fff' : 'rgba(255,255,255,0.3)' }}
            />
          ))}
        </div>
      )}

      {/* Mobile Bottom Tab Bar */}
      {isMobile && (
        <div className="br-mobile-tab-bar">
          <div className="br-mobile-tab-scroll">
            {slides.map((sl, i) => (
              <button
                key={i}
                className={`br-mobile-tab ${i === current ? 'br-mobile-tab-active' : ''}`}
                onClick={() => goTo(i)}
              >
                <span className="br-mobile-tab-icon">{slideIcons[i]}</span>
                <span className="br-mobile-tab-label">{slideNames[i]}</span>
                {i === current && <span className="br-mobile-tab-dot" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
