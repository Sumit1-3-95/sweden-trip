'use client'
import { useState, useRef, useEffect } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import { CountryTheme, DayData } from '@/types'
import { supabase } from '@/lib/supabase'

// ── Decorative SVG background patterns per country ──
const BG_PATTERNS: Record<string, string> = {
  se: `
    <circle cx="50" cy="30" r="18" fill="none" stroke="white" stroke-width="1" opacity="0.06"/>
    <circle cx="380" cy="60" r="30" fill="none" stroke="white" stroke-width="1" opacity="0.05"/>
    <circle cx="200" cy="10" r="25" fill="none" stroke="white" stroke-width="1" opacity="0.04"/>
    <rect x="0" y="75" width="430" height="2" fill="white" opacity="0.04"/>
    <rect x="120" y="0" width="2" height="220" fill="white" opacity="0.04"/>
    <circle cx="80" cy="50" r="2" fill="white" opacity="0.08"/>
    <circle cx="160" cy="20" r="1.5" fill="white" opacity="0.06"/>
    <circle cx="300" cy="40" r="2" fill="white" opacity="0.08"/>
    <circle cx="360" cy="15" r="1.5" fill="white" opacity="0.06"/>
  `,
  dk: `
    <path d="M20,140 Q60,110 100,140 Q140,110 180,140" fill="none" stroke="white" stroke-width="1.5" opacity="0.06"/>
    <path d="M250,150 Q290,120 330,150 Q370,120 410,150" fill="none" stroke="white" stroke-width="1.5" opacity="0.05"/>
    <rect x="0" y="85" width="430" height="2" fill="white" opacity="0.05"/>
    <rect x="80" y="0" width="2" height="220" fill="white" opacity="0.04"/>
    <circle cx="200" cy="40" r="25" fill="none" stroke="white" stroke-width="1" opacity="0.05"/>
    <circle cx="350" cy="20" r="15" fill="none" stroke="white" stroke-width="1" opacity="0.04"/>
  `,
  nl: `
    <line x1="380" y1="20" x2="380" y2="120" stroke="white" stroke-width="2" opacity="0.07"/>
    <line x1="330" y1="70" x2="430" y2="70" stroke="white" stroke-width="2" opacity="0.07"/>
    <line x1="345" y1="35" x2="415" y2="105" stroke="white" stroke-width="2" opacity="0.06"/>
    <line x1="415" y1="35" x2="345" y2="105" stroke="white" stroke-width="2" opacity="0.06"/>
    <ellipse cx="60" cy="50" rx="12" ry="18" fill="none" stroke="white" stroke-width="1" opacity="0.07"/>
    <line x1="60" y1="68" x2="60" y2="130" stroke="white" stroke-width="1" opacity="0.06"/>
    <rect x="0" y="160" width="430" height="1.5" fill="white" opacity="0.05"/>
    <rect x="0" y="170" width="430" height="1.5" fill="white" opacity="0.04"/>
  `,
  be: `
    <path d="M80,220 L80,80 Q80,40 110,40 Q140,40 140,80 L140,220" fill="none" stroke="white" stroke-width="1.5" opacity="0.06"/>
    <path d="M180,220 L180,100 Q180,60 210,60 Q240,60 240,100 L240,220" fill="none" stroke="white" stroke-width="1.5" opacity="0.05"/>
    <path d="M290,220 L290,70 Q290,30 320,30 Q350,30 350,70 L350,220" fill="none" stroke="white" stroke-width="1.5" opacity="0.05"/>
    <circle cx="30" cy="40" r="2" fill="white" opacity="0.1"/>
    <circle cx="50" cy="20" r="1.5" fill="white" opacity="0.08"/>
  `,
}

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

const SKYLINES: Record<string, string> = {
  se: `<g fill="white" opacity=".12"><rect x="0" y="105" width="430" height="15"/><rect x="30" y="55" width="18" height="50"/><polygon points="39,40 30,55 48,55"/><rect x="60" y="65" width="30" height="40"/><rect x="100" y="55" width="22" height="50"/><rect x="135" y="68" width="16" height="37"/><rect x="165" y="58" width="12" height="47"/><rect x="190" y="48" width="20" height="57"/><polygon points="200,33 190,48 210,48"/><rect x="224" y="62" width="14" height="43"/><rect x="252" y="52" width="18" height="53"/><rect x="285" y="60" width="13" height="45"/><rect x="310" y="55" width="11" height="50"/><rect x="335" y="62" width="15" height="43"/><rect x="362" y="45" width="22" height="60"/><polygon points="373,30 362,45 384,45"/><rect x="392" y="58" width="16" height="47"/></g>`,
  dk: `<g fill="white" opacity=".12"><rect x="0" y="108" width="430" height="12"/><rect x="20" y="58" width="18" height="50"/><polygon points="29,44 20,58 38,58"/><rect x="50" y="52" width="16" height="56"/><polygon points="58,38 50,52 66,52"/><rect x="80" y="65" width="20" height="43"/><rect x="140" y="45" width="25" height="63"/><rect x="138" y="39" width="29" height="7"/><rect x="148" y="22" width="7" height="19"/><polygon points="151,12 147,22 156,22"/><rect x="200" y="60" width="18" height="48"/><rect x="270" y="65" width="45" height="43"/><rect x="275" y="58" width="35" height="9"/><rect x="360" y="50" width="15" height="58"/><polygon points="367,36 360,50 375,50"/></g>`,
  nl: `<g fill="white" opacity=".12"><rect x="0" y="108" width="430" height="12"/><rect x="18" y="48" width="12" height="60"/><rect x="11" y="70" width="26" height="7"/><line x1="24" y1="48" x2="8" y2="28" stroke="white" stroke-width="2.5" opacity="1"/><line x1="24" y1="48" x2="40" y2="28" stroke="white" stroke-width="2.5" opacity="1"/><line x1="24" y1="48" x2="8" y2="68" stroke="white" stroke-width="2.5" opacity="1"/><line x1="24" y1="48" x2="40" y2="68" stroke="white" stroke-width="2.5" opacity="1"/><rect x="55" y="42" width="20" height="66"/><polygon points="65,28 55,42 75,42"/><rect x="88" y="46" width="18" height="62"/><polygon points="97,32 88,46 106,46"/></g>`,
  be: `<g fill="white" opacity=".12"><rect x="0" y="108" width="430" height="12"/><rect x="15" y="45" width="20" height="63"/><polygon points="25,31 15,45 35,45"/><rect x="48" y="50" width="18" height="58"/><polygon points="57,36 48,50 66,50"/><rect x="80" y="28" width="26" height="80"/><rect x="77" y="22" width="32" height="8"/><rect x="85" y="8" width="16" height="16"/><polygon points="93,0 85,8 101,8"/></g>`,
}

// Supabase storage bucket and path helper
const BUCKET = 'trip-photos'
const heroPath = (day: number) => `hero/day-${day}.jpg`

interface Props { theme: CountryTheme; dayMeta: DayData; activeDay: number }

export default function HeroSection({ theme, dayMeta, activeDay }: Props) {
  const [heroUrl, setHeroUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // Load hero image from Supabase on mount and day change
  useEffect(() => {
    setHeroUrl(null) // clear previous day's image while loading
    loadHeroImage()
  }, [activeDay])

  async function loadHeroImage() {
    try {
      // Get public URL — if file doesn't exist Supabase still returns a URL,
      // so we do a lightweight HEAD check via cache-busting
      const { data } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(heroPath(activeDay))

      // Verify the image actually exists by attempting to load it
      // We use a small fetch with HEAD to avoid downloading the full image
      const res = await fetch(data.publicUrl, { method: 'HEAD' })
      if (res.ok) {
        setHeroUrl(data.publicUrl + '?t=' + Date.now()) // cache-bust
      }
    } catch {
      // No image for this day — use default gradient
    }
  }

  async function handleHeroUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)

    try {
      // Compress/resize client-side by drawing to canvas at max 1200px wide
      const compressed = await compressImage(file, 1200, 0.85)

      // Upload to Supabase Storage — upsert so re-upload replaces existing
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(heroPath(activeDay), compressed, {
          contentType: 'image/jpeg',
          upsert: true,
          cacheControl: '3600',
        })

      if (error) throw error

      // Get fresh public URL and display immediately
      const { data } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(heroPath(activeDay))

      setHeroUrl(data.publicUrl + '?t=' + Date.now())
    } catch (err) {
      console.error('Hero upload failed:', err)
      alert('Upload failed. Make sure the trip-photos bucket is set to public.')
    }

    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  // Compress image to JPEG at max width to keep storage small
  async function compressImage(file: File, maxWidth: number, quality: number): Promise<Blob> {
    return new Promise((resolve) => {
      const img = new window.Image()
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width)
        const w = img.width * scale
        const h = img.height * scale
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, w, h)
        canvas.toBlob(blob => resolve(blob!), 'image/jpeg', quality)
      }
      img.src = URL.createObjectURL(file)
    })
  }

  const bgPattern = BG_PATTERNS[dayMeta.country] || BG_PATTERNS.se
  const skyline = SKYLINES[dayMeta.country] || SKYLINES.se
  const cityKey = Object.keys(CITY_OVERLAYS).find(k => dayMeta.city.includes(k))
  const cityOverlay = cityKey ? CITY_OVERLAYS[cityKey] : ''

  return (
    <div
      className="relative overflow-hidden flex flex-col justify-end pb-6 px-5"
      style={{
        minHeight: 230,
        background: theme.gradient,
        paddingTop: 'max(56px, env(safe-area-inset-top))',
      }}
    >
      {/* ── Custom hero image from Supabase ── */}
      {heroUrl && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setHeroUrl(null)} // fallback to gradient if broken
          />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.05) 100%)'
          }} />
        </>
      )}

      {/* ── Thematic SVG background (shown when no custom image) ── */}
      {!heroUrl && (
        <>
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 430 220"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
            dangerouslySetInnerHTML={{ __html: bgPattern + cityOverlay + skyline }}
          />
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
        className="absolute left-5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full cursor-pointer transition-all active:scale-90"
        style={{
          top: 'max(14px, env(safe-area-inset-top))',
          background: 'rgba(0,0,0,0.28)',
          backdropFilter: 'blur(8px)',
        }}
        title={uploading ? 'Uploading…' : 'Change banner photo'}
      >
        {uploading
          ? <Loader2 size={12} className="text-white animate-spin" />
          : <Camera size={12} className="text-white" />
        }
        <span className="text-[10px] font-semibold text-white">
          {uploading ? 'Uploading…' : heroUrl ? 'Change' : 'Add photo'}
        </span>
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
        <div
          className="inline-flex items-center gap-2 mb-2.5 px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(12px)' }}
        >
          <span className="text-base leading-none">{theme.flag}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/90">
            {dayMeta.city} · {theme.name}
          </span>
        </div>
        <h1
          className="font-serif text-[30px] font-light text-white leading-[1.1] mb-2"
          style={{ textShadow: '0 2px 16px rgba(0,0,0,0.4)' }}
        >
          {dayMeta.title}
        </h1>
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