'use client'
import { useState, useRef, useEffect } from 'react'
import { Camera } from 'lucide-react'
import { CountryTheme, DayData } from '@/types'

// Rich SVG patterns per country — decorative background elements
const BG_PATTERNS: Record<string, string> = {
  se: `
    <!-- Crown pattern for Sweden -->
    <circle cx="50" cy="30" r="18" fill="none" stroke="white" stroke-width="1" opacity="0.06"/>
    <circle cx="380" cy="60" r="30" fill="none" stroke="white" stroke-width="1" opacity="0.05"/>
    <circle cx="200" cy="10" r="25" fill="none" stroke="white" stroke-width="1" opacity="0.04"/>
    <!-- Nordic cross hint -->
    <rect x="0" y="75" width="430" height="2" fill="white" opacity="0.04"/>
    <rect x="120" y="0" width="2" height="220" fill="white" opacity="0.04"/>
    <!-- Snowflake dots -->
    <circle cx="80" cy="50" r="2" fill="white" opacity="0.08"/>
    <circle cx="160" cy="20" r="1.5" fill="white" opacity="0.06"/>
    <circle cx="300" cy="40" r="2" fill="white" opacity="0.08"/>
    <circle cx="360" cy="15" r="1.5" fill="white" opacity="0.06"/>
    <circle cx="40" cy="100" r="2" fill="white" opacity="0.05"/>
    <circle cx="420" cy="90" r="2" fill="white" opacity="0.06"/>
  `,
  dk: `
    <!-- Viking ships silhouette hint -->
    <path d="M20,140 Q60,110 100,140 Q140,110 180,140" fill="none" stroke="white" stroke-width="1.5" opacity="0.06"/>
    <path d="M250,150 Q290,120 330,150 Q370,120 410,150" fill="none" stroke="white" stroke-width="1.5" opacity="0.05"/>
    <!-- Danish cross -->
    <rect x="0" y="85" width="430" height="2" fill="white" opacity="0.05"/>
    <rect x="80" y="0" width="2" height="220" fill="white" opacity="0.04"/>
    <!-- Dots -->
    <circle cx="200" cy="40" r="25" fill="none" stroke="white" stroke-width="1" opacity="0.05"/>
    <circle cx="350" cy="20" r="15" fill="none" stroke="white" stroke-width="1" opacity="0.04"/>
    <circle cx="50" cy="30" r="20" fill="none" stroke="white" stroke-width="1" opacity="0.04"/>
  `,
  nl: `
    <!-- Windmill blades -->
    <line x1="380" y1="20" x2="380" y2="120" stroke="white" stroke-width="2" opacity="0.07"/>
    <line x1="330" y1="70" x2="430" y2="70" stroke="white" stroke-width="2" opacity="0.07"/>
    <line x1="345" y1="35" x2="415" y2="105" stroke="white" stroke-width="2" opacity="0.06"/>
    <line x1="415" y1="35" x2="345" y2="105" stroke="white" stroke-width="2" opacity="0.06"/>
    <!-- Tulip shapes -->
    <ellipse cx="60" cy="50" rx="12" ry="18" fill="none" stroke="white" stroke-width="1" opacity="0.07"/>
    <line x1="60" y1="68" x2="60" y2="130" stroke="white" stroke-width="1" opacity="0.06"/>
    <ellipse cx="120" cy="35" rx="10" ry="15" fill="none" stroke="white" stroke-width="1" opacity="0.06"/>
    <line x1="120" y1="50" x2="120" y2="130" stroke="white" stroke-width="1" opacity="0.05"/>
    <!-- Canal lines -->
    <rect x="0" y="160" width="430" height="1.5" fill="white" opacity="0.05"/>
    <rect x="0" y="170" width="430" height="1.5" fill="white" opacity="0.04"/>
  `,
  be: `
    <!-- Gothic arch pattern -->
    <path d="M80,220 L80,80 Q80,40 110,40 Q140,40 140,80 L140,220" fill="none" stroke="white" stroke-width="1.5" opacity="0.06"/>
    <path d="M180,220 L180,100 Q180,60 210,60 Q240,60 240,100 L240,220" fill="none" stroke="white" stroke-width="1.5" opacity="0.05"/>
    <path d="M290,220 L290,70 Q290,30 320,30 Q350,30 350,70 L350,220" fill="none" stroke="white" stroke-width="1.5" opacity="0.05"/>
    <!-- Diamond pattern (Belgian flag inspired) -->
    <rect x="380" y="20" width="30" height="80" fill="none" stroke="white" stroke-width="1" opacity="0.05" transform="rotate(45 395 60)"/>
    <!-- Stars -->
    <circle cx="30" cy="40" r="2" fill="white" opacity="0.1"/>
    <circle cx="50" cy="20" r="1.5" fill="white" opacity="0.08"/>
    <circle cx="15" cy="60" r="1.5" fill="white" opacity="0.07"/>
  `,
}

// City-specific overlays for extra character
const CITY_OVERLAYS: Record<string, string> = {
  'Stockholm': `<text x="10" y="210" font-size="120" fill="white" opacity="0.03" font-family="serif">STH</text>`,
  'Malmö': `<text x="10" y="210" font-size="120" fill="white" opacity="0.03" font-family="serif">MLM</text>`,
  'Copenhagen': `<text x="10" y="210" font-size="100" fill="white" opacity="0.03" font-family="serif">CPH</text>`,
  'Efteling': `<text x="10" y="210" font-size="90" fill="white" opacity="0.04" font-family="serif">✨</text>`,
  'Rotterdam': `<text x="10" y="210" font-size="110" fill="white" opacity="0.03" font-family="serif">RTM</text>`,
  'Brussels': `<text x="10" y="210" font-size="110" fill="white" opacity="0.03" font-family="serif">BRU</text>`,
  'Bruges': `<text x="10" y="210" font-size="110" fill="white" opacity="0.03" font-family="serif">BRG</text>`,
  'Ostend': `<text x="10" y="210" font-size="110" fill="white" opacity="0.03" font-family="serif">OST</text>`,
}

// City skyline silhouettes
const SKYLINES: Record<string, string> = {
  se: `<g fill="white" opacity=".12"><rect x="0" y="105" width="430" height="15"/><rect x="30" y="55" width="18" height="50"/><polygon points="39,40 30,55 48,55"/><rect x="60" y="65" width="30" height="40"/><rect x="100" y="55" width="22" height="50"/><rect x="135" y="68" width="16" height="37"/><rect x="165" y="58" width="12" height="47"/><rect x="190" y="48" width="20" height="57"/><polygon points="200,33 190,48 210,48"/><rect x="224" y="62" width="14" height="43"/><rect x="252" y="52" width="18" height="53"/><rect x="285" y="60" width="13" height="45"/><rect x="310" y="55" width="11" height="50"/><rect x="335" y="62" width="15" height="43"/><rect x="362" y="45" width="22" height="60"/><polygon points="373,30 362,45 384,45"/><rect x="392" y="58" width="16" height="47"/></g>`,
  dk: `<g fill="white" opacity=".12"><rect x="0" y="108" width="430" height="12"/><rect x="20" y="58" width="18" height="50"/><polygon points="29,44 20,58 38,58"/><rect x="50" y="52" width="16" height="56"/><polygon points="58,38 50,52 66,52"/><rect x="80" y="65" width="20" height="43"/><rect x="140" y="45" width="25" height="63"/><rect x="138" y="39" width="29" height="7"/><rect x="148" y="22" width="7" height="19"/><polygon points="151,12 147,22 156,22"/><rect x="200" y="60" width="18" height="48"/><rect x="270" y="65" width="45" height="43"/><rect x="275" y="58" width="35" height="9"/><rect x="360" y="50" width="15" height="58"/><polygon points="367,36 360,50 375,50"/></g>`,
  nl: `<g fill="white" opacity=".12"><rect x="0" y="108" width="430" height="12"/><rect x="18" y="48" width="12" height="60"/><rect x="11" y="70" width="26" height="7"/><line x1="24" y1="48" x2="8" y2="28" stroke="white" stroke-width="2.5" opacity="1"/><line x1="24" y1="48" x2="40" y2="28" stroke="white" stroke-width="2.5" opacity="1"/><line x1="24" y1="48" x2="8" y2="68" stroke="white" stroke-width="2.5" opacity="1"/><line x1="24" y1="48" x2="40" y2="68" stroke="white" stroke-width="2.5" opacity="1"/><rect x="55" y="42" width="20" height="66"/><polygon points="65,28 55,42 75,42"/><rect x="88" y="46" width="18" height="62"/><polygon points="97,32 88,46 106,46"/><rect x="120" y="38" width="22" height="70"/><polygon points="131,24 120,38 142,38"/><rect x="200" y="42" width="18" height="66"/><polygon points="209,28 200,42 218,42"/><rect x="270" y="50" width="14" height="58"/><rect x="310" y="36" width="20" height="72"/><polygon points="320,22 310,36 330,36"/></g>`,
  be: `<g fill="white" opacity=".12"><rect x="0" y="108" width="430" height="12"/><rect x="15" y="45" width="20" height="63"/><polygon points="25,31 15,45 35,45"/><rect x="48" y="50" width="18" height="58"/><polygon points="57,36 48,50 66,50"/><rect x="80" y="28" width="26" height="80"/><rect x="77" y="22" width="32" height="8"/><rect x="85" y="8" width="16" height="16"/><polygon points="93,0 85,8 101,8"/><rect x="220" y="30" width="30" height="78"/><rect x="217" y="24" width="36" height="8"/><rect x="226" y="8" width="18" height="18"/><polygon points="235,0 226,8 244,8"/><circle cx="340" cy="35" r="16" fill="none" stroke="white" stroke-width="3"/><circle cx="315" cy="68" r="12" fill="none" stroke="white" stroke-width="3"/><circle cx="365" cy="68" r="12" fill="none" stroke="white" stroke-width="3"/><line x1="340" y1="51" x2="315" y2="56" stroke="white" stroke-width="3"/><line x1="340" y1="51" x2="365" y2="56" stroke="white" stroke-width="3"/><rect x="337" y="80" width="6" height="28"/></g>`,
}

const HERO_STORAGE_KEY = 'hero_images'
interface Props { theme: CountryTheme; dayMeta: DayData; activeDay: number }

export default function HeroSection({ theme, dayMeta, activeDay }: Props) {
  const [heroImg, setHeroImg] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(HERO_STORAGE_KEY)
      if (saved) { const map = JSON.parse(saved); setHeroImg(map[activeDay] || null) }
    } catch { setHeroImg(null) }
  }, [activeDay])

  function handleHeroUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      setHeroImg(dataUrl)
      try {
        const saved = localStorage.getItem(HERO_STORAGE_KEY)
        const map = saved ? JSON.parse(saved) : {}
        map[activeDay] = dataUrl
        localStorage.setItem(HERO_STORAGE_KEY, JSON.stringify(map))
      } catch {}
      setUploading(false)
    }
    reader.readAsDataURL(file)
    if (fileRef.current) fileRef.current.value = ''
  }

  const bgPattern = BG_PATTERNS[dayMeta.country] || BG_PATTERNS.se
  const skyline = SKYLINES[dayMeta.country] || SKYLINES.se
  // Find city overlay — check if city name contains any key
  const cityKey = Object.keys(CITY_OVERLAYS).find(k => dayMeta.city.includes(k))
  const cityOverlay = cityKey ? CITY_OVERLAYS[cityKey] : ''

  return (
    <div
      className="relative overflow-hidden flex flex-col justify-end pb-6 px-5"
      style={{
        minHeight: 230,
        background: heroImg ? 'transparent' : theme.gradient,
        paddingTop: 'max(56px, env(safe-area-inset-top))',
      }}
    >
      {/* ── Custom hero image ── */}
      {heroImg && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.05) 100%)'
          }} />
        </>
      )}

      {/* ── Thematic background — no custom image ── */}
      {!heroImg && (
        <>
          {/* decorative SVG layer — country patterns */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 430 220"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
            dangerouslySetInnerHTML={{ __html: bgPattern + cityOverlay + skyline }}
          />
          {/* subtle radial light at top-right */}
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse 60% 50% at 80% 0%, rgba(255,255,255,0.08) 0%, transparent 70%)'
          }} />
        </>
      )}

      {/* ── Day badge — top right ── */}
      <div
        className="absolute right-5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl px-3 py-2 text-center"
        style={{ top: 'max(14px, env(safe-area-inset-top))' }}
      >
        <div className="text-[22px] font-bold text-white leading-none">{activeDay}</div>
        <div className="text-[9px] text-white/55 mt-0.5 font-medium uppercase tracking-wider">of 22</div>
      </div>

      {/* ── Camera button — top left ── */}
      <label
        htmlFor={`hero-upload-day-${activeDay}`}
        className="absolute left-5 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-90"
        style={{ top: 'max(14px, env(safe-area-inset-top))', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}
        title={uploading ? 'Uploading…' : 'Change hero photo'}
      >
        <Camera size={13} className="text-white" />
      </label>
      <input
        id={`hero-upload-day-${activeDay}`}
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleHeroUpload}
      />

      {/* ── Text content ── */}
      <div className="relative z-10">
        {/* location chip */}
        <div
          className="inline-flex items-center gap-2 mb-2.5 px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(12px)' }}
        >
          <span className="text-base leading-none">{theme.flag}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/90">
            {dayMeta.city} · {theme.name}
          </span>
        </div>

        {/* title */}
        <h1
          className="font-serif text-[30px] font-light text-white leading-[1.1] mb-2"
          style={{ textShadow: '0 2px 16px rgba(0,0,0,0.4)' }}
        >
          {dayMeta.title}
        </h1>

        {/* date + preview chip */}
        <div
          className="inline-flex items-center px-3 py-1.5 rounded-full gap-2"
          style={{ background: 'rgba(0,0,0,0.22)', backdropFilter: 'blur(12px)' }}
        >
          <span className="text-[11px] text-white/90 font-semibold">{dayMeta.weekday} {dayMeta.date}</span>
          <span className="w-1 h-1 rounded-full bg-white/40" />
          <span className="text-[11px] text-white/70">{dayMeta.preview}</span>
        </div>
      </div>
    </div>
  )
}