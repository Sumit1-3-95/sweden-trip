'use client'
import { DayCard, CountryTheme } from '@/types'
import { Plane, Train, Home, AlertTriangle, FileText, Image } from 'lucide-react'

interface Props {
  card: DayCard
  isLast: boolean
  theme: CountryTheme
  onClick: () => void
}

const TYPE_CONFIG = {
  activity:  { chipClass: 'bg-emerald-50 text-emerald-700', label: 'Activity' },
  transport: { chipClass: 'bg-blue-50 text-blue-700',      label: 'Transport' },
  stay:      { chipClass: 'bg-amber-50 text-amber-700',    label: 'Stay' },
  alert:     { chipClass: 'bg-red-50 text-red-700',        label: 'Alert' },
  free:      { chipClass: 'bg-gray-100 text-gray-600',     label: 'Note' },
}

const TYPE_ICON = {
  activity:  null,
  transport: Plane,
  stay:      Home,
  alert:     AlertTriangle,
  free:      FileText,
}

const STATUS_DOT = {
  done:     'bg-emerald-400',
  now:      'bg-blue-500 ring-4 ring-blue-100',
  upcoming: 'bg-gray-200 border-2 border-gray-300',
}

export default function TimelineCard({ card, isLast, theme, onClick }: Props) {
  const cfg = TYPE_CONFIG[card.type] || TYPE_CONFIG.free
  const isAlert = card.type === 'alert'
  const isTransport = card.type === 'transport'
  const meta = card.metadata as Record<string, string> | null
  const hasPhotos = card.photos && card.photos.length > 0
  const TypeIcon = TYPE_ICON[card.type]

  return (
    <div className="flex gap-3 mb-1">
      {/* spine */}
      <div className="flex flex-col items-center w-10 flex-shrink-0 pt-1">
        <span className="text-[10px] font-bold text-gray-400 leading-tight text-center min-h-[22px] flex items-center">
          {card.time_label?.replace(' ', '\n') || ''}
        </span>
        <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${STATUS_DOT[card.status]}`} />
        {!isLast && <div className="w-px flex-1 bg-gray-100 mt-1 min-h-[12px]" />}
      </div>

      {/* card body */}
      <div className="flex-1 pb-3">
        {isAlert ? (
          <div className="bg-red-50 border border-red-200 border-l-4 border-l-red-400 rounded-xl p-3.5">
            <div className="flex items-start gap-2">
              <AlertTriangle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-[13px] font-bold text-red-800">{card.title}</div>
                <div className="text-[12px] text-red-600 mt-1 leading-relaxed">{card.description}</div>
              </div>
            </div>
          </div>
        ) : isTransport ? (
          <TransportCard card={card} meta={meta} theme={theme} onClick={onClick} />
        ) : (
          <button onClick={onClick} className="w-full text-left card-base active:scale-[.98] transition-all shadow-card">
            {/* show first photo if exists */}
            {hasPhotos && card.photos![0] && (
              <div className="h-32 bg-gray-100 overflow-hidden relative">
                <img src={card.photos![0].url} alt="" className="w-full h-full object-cover" />
                {card.photos!.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Image size={10} />+{card.photos!.length - 1}
                  </div>
                )}
              </div>
            )}
            <div className="p-3.5">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className={`chip ${cfg.chipClass} flex items-center gap-1`}>
                  {TypeIcon && <TypeIcon size={9} />}{cfg.label}
                </span>
                {card.status === 'now' && (
                  <span className="chip bg-blue-50 text-blue-700 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />Now
                  </span>
                )}
                {card.status === 'done' && <span className="chip bg-gray-100 text-gray-500">Done ✓</span>}
              </div>
              <div className="text-[15px] font-semibold text-gray-900 leading-snug mb-1">{card.title}</div>
              {card.description && (
                <div className="text-[12.5px] text-gray-500 leading-relaxed line-clamp-2">{card.description}</div>
              )}
              {card.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {card.tags.slice(0, 4).map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              )}
            </div>
          </button>
        )}
      </div>
    </div>
  )
}

function TransportCard({ card, meta, theme, onClick }: { card: DayCard; meta: Record<string, string> | null; theme: CountryTheme; onClick: () => void }) {
  const isFllight = meta?.num?.includes('LH') || meta?.num?.includes('SK') || meta?.num?.includes('D8') || meta?.op?.toLowerCase().includes('lufthansa') || meta?.op?.toLowerCase().includes('norwegian') || meta?.op?.toLowerCase().includes('sas')
  return (
    <button onClick={onClick} className="w-full text-left card-base active:scale-[.98] transition-all shadow-card">
      <div className="p-3.5">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: theme.light }}>
            {isFllight ? <Plane size={16} style={{ color: theme.mid }} /> : <Train size={16} style={{ color: theme.mid }} />}
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{isFllight ? 'Flight' : 'Train'}</div>
            <div className="text-[13px] font-bold text-gray-800">{meta?.op} · {meta?.num}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-none">
            <div className="text-[22px] font-bold text-gray-900 leading-none tabular-nums">{meta?.dep || '—'}</div>
            <div className="text-[11px] text-gray-400 mt-0.5 max-w-[80px] truncate">{meta?.from}</div>
          </div>
          <div className="flex-1 flex items-center gap-1.5 px-2">
            <div className="flex-1 border-t-[1.5px] border-dashed border-gray-200" />
            {isFllight ? <Plane size={13} className="text-gray-300" /> : <Train size={13} className="text-gray-300" />}
          </div>
          <div className="flex-none text-right">
            <div className="text-[22px] font-bold text-gray-900 leading-none tabular-nums">{meta?.arr || '—'}</div>
            <div className="text-[11px] text-gray-400 mt-0.5 max-w-[80px] truncate">{meta?.to}</div>
          </div>
        </div>
        {meta?.via && <div className="text-[11px] text-gray-400 text-center mt-1.5">via {meta.via}</div>}
        <div className="flex gap-2 flex-wrap mt-3">
          {meta?.carriage && <span className="tag">🪑 {meta.carriage}</span>}
          <span className="tag">👨‍👩‍👧‍👦 All 5 passengers</span>
          <span className="tag text-emerald-700 bg-emerald-50 border-emerald-200">✓ Confirmed</span>
        </div>
        {meta?.ref && (
          <div className="mt-3 text-center text-[11px] font-bold tracking-widest rounded-lg py-1.5"
            style={{ background: theme.light, color: theme.dark }}>
            REF · {meta.ref}
          </div>
        )}
      </div>
    </button>
  )
}
