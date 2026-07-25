'use client'
import { CountryTheme, DayData } from '@/types'

const SCENES: Record<string, string> = {
  se: `<g fill="white" opacity=".9"><rect x="0" y="105" width="430" height="15"/><rect x="30" y="30" width="22" height="75"/><rect x="26" y="26" width="30" height="8"/><rect x="35" y="10" width="12" height="20"/><polygon points="41,0 35,10 47,10"/><rect x="60" y="55" width="35" height="50"/><rect x="100" y="45" width="28" height="60"/><rect x="135" y="60" width="20" height="45"/><rect x="160" y="50" width="15" height="55"/><rect x="185" y="40" width="25" height="65"/><polygon points="197,15 185,40 210,40"/><rect x="218" y="65" width="18" height="40"/><rect x="242" y="55" width="22" height="50"/><rect x="272" y="62" width="16" height="43"/><rect x="292" y="58" width="20" height="47"/><rect x="316" y="50" width="14" height="55"/><rect x="334" y="68" width="18" height="37"/><rect x="356" y="48" width="26" height="57"/><rect x="386" y="60" width="20" height="45"/></g>`,
  dk: `<g fill="white" opacity=".9"><rect x="0" y="105" width="430" height="15"/><rect x="20" y="50" width="22" height="55"/><polygon points="31,36 20,50 42,50"/><rect x="44" y="45" width="20" height="60"/><polygon points="54,32 44,45 64,45"/><rect x="66" y="52" width="24" height="53"/><rect x="130" y="40" width="30" height="65"/><rect x="128" y="34" width="34" height="8"/><rect x="137" y="15" width="8" height="22"/><polygon points="141,5 137,15 145,15"/><rect x="188" y="55" width="22" height="50"/><ellipse cx="199" cy="55" rx="11" ry="6"/><rect x="270" y="62" width="55" height="43"/><rect x="275" y="55" width="45" height="10"/><rect x="362" y="44" width="18" height="61"/><polygon points="371,32 362,44 380,44"/></g>`,
  nl: `<g fill="white" opacity=".9"><rect x="0" y="108" width="430" height="12"/><rect x="20" y="45" width="14" height="65"/><rect x="13" y="68" width="28" height="8"/><line x1="27" y1="45" x2="10" y2="25" stroke="white" stroke-width="3"/><line x1="27" y1="45" x2="44" y2="25" stroke="white" stroke-width="3"/><line x1="27" y1="45" x2="10" y2="65" stroke="white" stroke-width="3"/><line x1="27" y1="45" x2="44" y2="65" stroke="white" stroke-width="3"/><rect x="52" y="40" width="24" height="65"/><polygon points="64,25 52,40 76,40"/><rect x="78" y="44" width="22" height="61"/><polygon points="89,30 78,44 100,44"/><rect x="102" y="36" width="26" height="69"/><polygon points="115,22 102,36 128,36"/><path d="M160,105 L160,50 Q210,20 260,50 L260,105 Z" fill="none" stroke="white" stroke-width="4"/><rect x="165" y="65" width="90" height="40"/><polygon points="355,10 348,80 362,80"/><line x1="355" y1="10" x2="330" y2="80" stroke="white" stroke-width="2"/><line x1="355" y1="10" x2="380" y2="80" stroke="white" stroke-width="2"/><rect x="328" y="80" width="100" height="8"/></g>`,
  be: `<g fill="white" opacity=".9"><rect x="0" y="108" width="430" height="12"/><rect x="15" y="42" width="24" height="66"/><polygon points="27,28 15,42 39,42"/><rect x="40" y="48" width="22" height="60"/><polygon points="51,35 40,48 62,48"/><rect x="75" y="25" width="30" height="83"/><rect x="72" y="19" width="36" height="9"/><rect x="80" y="8" width="20" height="14"/><polygon points="90,0 80,8 100,8"/><rect x="215" y="28" width="36" height="80"/><rect x="212" y="22" width="42" height="8"/><rect x="222" y="6" width="22" height="18"/><polygon points="233,0 222,6 244,6"/><circle cx="310" cy="30" r="18" fill="none" stroke="white" stroke-width="4"/><circle cx="285" cy="65" r="14" fill="none" stroke="white" stroke-width="4"/><circle cx="335" cy="65" r="14" fill="none" stroke="white" stroke-width="4"/><line x1="310" y1="48" x2="285" y2="51" stroke="white" stroke-width="4"/><line x1="310" y1="48" x2="335" y2="51" stroke="white" stroke-width="4"/><rect x="306" y="78" width="8" height="30"/></g>`,
}

interface Props { theme: CountryTheme; dayMeta: DayData; activeDay: number }

export default function HeroSection({ theme, dayMeta, activeDay }: Props) {
  const scene = SCENES[dayMeta.country] || SCENES.se

  return (
    <div className="relative overflow-hidden min-h-[220px] flex flex-col justify-end pt-14 pb-6 px-5"
      style={{ background: theme.gradient }}>
      {/* pattern overlay */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: theme.pattern, backgroundSize: dayMeta.country === 'dk' ? '24px 24px' : undefined }} />

      {/* city silhouette */}
      <svg className="absolute bottom-0 left-0 right-0 w-full h-28 opacity-15 transition-opacity duration-500"
        viewBox="0 0 430 120" preserveAspectRatio="xMidYMax meet"
        xmlns="http://www.w3.org/2000/svg"
        dangerouslySetInnerHTML={{ __html: scene }} />

      {/* day badge */}
      <div className="absolute top-14 right-5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl px-3.5 py-2.5 text-center">
        <div className="text-2xl font-bold text-white leading-none">{activeDay}</div>
        <div className="text-[10px] text-white/55 mt-0.5 font-medium">of 22</div>
      </div>

      {/* content */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-base">{theme.flag}</span>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-white/65">{dayMeta.city}, {theme.name}</span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/45">Day {activeDay}</span>
        </div>
        <h1 className="font-serif text-[30px] font-light text-white leading-[1.1] mb-1.5">
          {dayMeta.title}
        </h1>
        <p className="text-[13px] text-white/65 font-normal">{dayMeta.weekday} {dayMeta.date} · {dayMeta.preview}</p>
      </div>
    </div>
  )
}
