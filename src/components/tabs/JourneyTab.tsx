'use client'
import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Plane, Train } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { DayCard, DAY_META, COUNTRY_THEMES, DayData, CountryTheme } from '@/types'

interface Props {
  activeDay: number
  setActiveDay: (d: number) => void
  onOpenCard: (card: DayCard, theme: CountryTheme) => void
}

export default function JourneyTab({ activeDay, setActiveDay, onOpenCard }: Props) {
  const [cardsByDay, setCardsByDay] = useState<Record<number, DayCard[]>>({})
  const [openDays, setOpenDays] = useState<Set<number>>(new Set())
  const stripRef = useRef<HTMLDivElement>(null)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    const { data } = await supabase.from('day_cards').select('*').order('sort_order')
    if (!data) return
    const grouped: Record<number, DayCard[]> = {}
    data.forEach(c => { if (!grouped[c.day_number]) grouped[c.day_number] = []; grouped[c.day_number].push(c) })
    setCardsByDay(grouped)
  }

  function toggleDay(day: number) {
    setOpenDays(s => { const n = new Set(s); n.has(day) ? n.delete(day) : n.add(day); return n })
  }

  function goToDay(day: number) {
    setActiveDay(day)
    const btn = stripRef.current?.querySelector(`[data-day="${day}"]`)
    btn?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }

  let lastCountry = ''

  return (
    <div className="pb-24">
      {/* hero */}
      <div className="bg-se-dark px-5 pt-14 pb-5 relative overflow-hidden" style={{ background: 'linear-gradient(160deg,#0B2545,#1B4D8E)' }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(90deg,rgba(255,255,255,1) 0,rgba(255,255,255,1) 1px,transparent 0,transparent 48px),repeating-linear-gradient(rgba(255,255,255,1) 0,rgba(255,255,255,1) 1px,transparent 0,transparent 48px)' }} />
        <p className="font-serif text-3xl font-light text-white relative z-10">Our <em>journey</em></p>
        <p className="text-sm text-white/60 mt-1 relative z-10">22 days · 4 countries · 1 family</p>
        <div className="flex gap-2.5 mt-4 relative z-10">
          {[['22','Days'],['4','Countries'],['5','Airbnbs'],['8','Cities']].map(([n,l]) => (
            <div key={l} className="flex-1 bg-white/10 border border-white/15 rounded-xl px-2 py-2.5 text-center">
              <div className="text-xl font-bold text-white leading-none">{n}</div>
              <div className="text-[10px] text-white/55 font-medium uppercase tracking-wider mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* date strip */}
      <div className="bg-white/96 backdrop-blur-xl border-b border-black/5 sticky top-0 z-30">
        <div ref={stripRef} className="flex gap-1 px-3 py-2 overflow-x-auto no-scrollbar">
          {DAY_META.map(d => {
            const t = COUNTRY_THEMES[d.country]
            const active = d.day === activeDay
            return (
              <button key={d.day} data-day={d.day} onClick={() => goToDay(d.day)}
                className="flex-shrink-0 flex flex-col items-center gap-0.5 min-w-[52px] rounded-xl px-1.5 py-2 border-[1.5px] transition-all"
                style={{ borderColor: active ? t.mid : 'transparent', background: active ? t.light : 'transparent' }}>
                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: active ? t.mid : '#9ca3af' }}>{d.weekday}</span>
                <span className="font-bold leading-none" style={{ fontSize: active ? '20px' : '18px', color: active ? t.dark : '#d1d5db' }}>{d.date.split(' ')[0]}</span>
                <div className="w-1.5 h-1.5 rounded-full mt-0.5" style={{ background: active ? t.mid : t.mid + '44' }} />
              </button>
            )
          })}
        </div>
      </div>

      {/* day list */}
      <div className="pt-2 pb-4">
        {DAY_META.map(d => {
          const t = COUNTRY_THEMES[d.country]
          const showDivider = d.country !== lastCountry
          if (showDivider) lastCountry = d.country
          const isOpen = openDays.has(d.day)
          const cards = cardsByDay[d.day] || []
          const hasFlight = cards.some(c => c.type === 'transport' && (c.metadata as Record<string,string>)?.num?.match(/LH|SK|D8/))
          const hasTrain = cards.some(c => c.type === 'transport' && !((c.metadata as Record<string,string>)?.num?.match(/LH|SK|D8/)))
          const hasAlert = cards.some(c => c.type === 'alert')

          return (
            <div key={d.day}>
              {showDivider && <CountryDivider d={d} />}
              <div className="mx-4 mb-3 rounded-xl overflow-hidden border border-black/5 shadow-card bg-white">
                <button className="w-full flex items-stretch" onClick={() => toggleDay(d.day)}>
                  {/* day num panel */}
                  <div className="w-16 flex-shrink-0 flex flex-col items-center justify-center py-4 relative overflow-hidden"
                    style={{ background: t.gradient }}>
                    <span className="text-2xl font-bold text-white leading-none relative z-10">{d.day}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-white/50 mt-1 relative z-10">{d.weekday}</span>
                    <span className="text-xs relative z-10 mt-1">{t.flag}</span>
                  </div>
                  {/* info */}
                  <div className="flex-1 px-3.5 py-3.5 text-left">
                    <p className="text-[11px] font-semibold text-gray-400">{d.weekday} {d.date}</p>
                    <p className="text-[14px] font-bold text-gray-900 mt-0.5 leading-snug">{d.title}</p>
                    <p className="text-[12px] text-gray-400 mt-0.5 truncate">{d.preview}</p>
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {hasFlight && <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-600">✈️ Flight</span>}
                      {hasTrain && <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600">🚆 Train</span>}
                      {hasAlert && <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-50 text-red-600">⚠️ Alert</span>}
                    </div>
                  </div>
                  <div className="flex items-center pr-3.5">
                    <ChevronDown size={18} className="text-gray-300 transition-transform" style={{ transform: isOpen ? 'rotate(180deg)' : '' }} />
                  </div>
                </button>

                {isOpen && cards.length > 0 && (
                  <div className="border-t border-gray-50">
                    {/* scene */}
                    <div className="h-28 relative overflow-hidden" style={{ background: t.gradient }}>
                      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: t.pattern }} />
                      <div className="absolute inset-0 flex items-end justify-center pb-2 opacity-20">
                        <svg viewBox="0 0 430 80" className="w-full h-20" style={{ fill: 'white' }}>
                          <rect x="20" y="20" width="30" height="60"/><polygon points="35,5 20,20 50,20"/>
                          <rect x="60" y="30" width="25" height="50"/><polygon points="72,15 60,30 85,30"/>
                          <rect x="95" y="25" width="35" height="55"/><rect x="100" y="15" width="10" height="12"/>
                          <rect x="145" y="35" width="20" height="45"/><rect x="175" y="28" width="28" height="52"/>
                          <polygon points="189,14 175,28 203,28"/>
                          <rect x="215" y="38" width="22" height="42"/><rect x="248" y="22" width="32" height="58"/>
                          <polygon points="264,8 248,22 280,22"/>
                          <rect x="292" y="32" width="20" height="48"/><rect x="325" y="18" width="38" height="62"/>
                          <polygon points="344,4 325,18 363,18"/>
                          <rect x="378" y="30" width="24" height="50"/>
                        </svg>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl mb-1">{t.flag}</div>
                          <p className="text-white/70 text-xs font-semibold">{d.city}</p>
                        </div>
                      </div>
                    </div>
                    {/* activities */}
                    <div className="divide-y divide-gray-50">
                      {cards.map(c => <JourneyCardRow key={c.id} card={c} theme={t} />)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CountryDivider({ d }: { d: DayData }) {
  const t = COUNTRY_THEMES[d.country]
  const days = DAY_META.filter(x => x.country === d.country)
  return (
    <div className="mx-4 mb-2 mt-3 rounded-xl px-4 py-3.5 flex items-center gap-3 relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${t.light}, ${t.mid}22)` }}>
      <span className="text-4xl filter drop-shadow-sm">{t.flag}</span>
      <div>
        <p className="font-bold text-[16px]" style={{ color: t.dark }}>{t.name}</p>
        <p className="text-[12px] font-medium mt-0.5" style={{ color: t.mid }}>
          {days[0].date} – {days[days.length - 1].date} · {days.length} day{days.length > 1 ? 's' : ''}
        </p>
      </div>
      <span className="absolute right-3 text-[60px] font-black opacity-5 font-serif leading-none" style={{ color: t.dark }}>{t.flag}</span>
    </div>
  )
}

function JourneyCardRow({ card, theme }: { card: DayCard; theme: CountryTheme }) {
  const meta = card.metadata as Record<string, string> | null
  const isAlert = card.type === 'alert'
  return (
    <div className={`px-4 py-3 ${isAlert ? 'bg-red-50' : ''}`}>
      <div className="flex gap-3 items-start">
        <div className="text-[11px] font-bold text-gray-400 w-12 flex-shrink-0 pt-0.5">{card.time_label || ''}</div>
        <div className="flex-1">
          <p className={`text-[13px] font-bold ${isAlert ? 'text-red-700' : 'text-gray-800'}`}>{card.title}</p>
          {card.description && <p className="text-[12px] text-gray-500 mt-1 leading-relaxed line-clamp-3">{card.description}</p>}
          {meta?.ref && <p className="text-[11px] font-mono font-bold mt-1.5 px-2 py-0.5 rounded inline-block" style={{ background: theme.light, color: theme.dark }}>REF: {meta.ref}</p>}
          {card.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {card.tags.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}