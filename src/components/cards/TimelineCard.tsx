'use client'
import { DayCard, CountryTheme } from '@/types'
import { Plane, Train, Home, AlertTriangle, FileText, Camera, Pencil } from 'lucide-react'
import { getPhotoUrl } from '@/lib/supabase'

interface Props {
  card: DayCard
  isLast: boolean
  theme: CountryTheme
  onClick: () => void
}

// Pastel tag colour palette — cycles through these
const TAG_COLORS = [
  { background: '#EDE9FE', color: '#6D28D9' }, // purple
  { background: '#D1FAE5', color: '#065F46' }, // green
  { background: '#DBEAFE', color: '#1E40AF' }, // blue
  { background: '#FCE7F3', color: '#9D174D' }, // pink
  { background: '#FEF3C7', color: '#92400E' }, // amber
  { background: '#CFFAFE', color: '#155E75' }, // cyan
  { background: '#FFE4E6', color: '#9F1239' }, // rose
  { background: '#F0FDF4', color: '#166534' }, // lime
]

const TYPE_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  activity:  { bg: 'bg-emerald-50',  text: 'text-emerald-700', label: 'Activity' },
  transport: { bg: 'bg-blue-50',     text: 'text-blue-700',    label: 'Transport' },
  stay:      { bg: 'bg-amber-50',    text: 'text-amber-700',   label: 'Stay' },
  alert:     { bg: 'bg-red-50',      text: 'text-red-700',     label: 'Alert' },
  free:      { bg: 'bg-gray-100',    text: 'text-gray-600',    label: 'Note' },
}

const STATUS_DOT: Record<string, string> = {
  done:     'bg-emerald-400',
  now:      'bg-blue-500 ring-4 ring-blue-100',
  upcoming: 'bg-gray-200 border-2 border-gray-300',
}

export default function TimelineCard({ card, isLast, theme, onClick }: Props) {
  const cfg = TYPE_CONFIG[card.type] || TYPE_CONFIG.free
  const isAlert = card.type === 'alert'
  const isTransport = card.type === 'transport'
  const meta = card.metadata as Record<string, string> | null
  const firstPhoto = card.photos?.[0]
  const photoUrl = firstPhoto ? (firstPhoto.url || getPhotoUrl(firstPhoto.storage_path)) : null
  const photoCount = card.photos?.length || 0

  return (
    <div className="flex gap-3 mb-1">
      {/* timeline spine */}
      <div className="flex flex-col items-center w-10 flex-shrink-0 pt-2">
        <span className="text-[10px] font-bold text-gray-400 text-center leading-tight min-h-[20px]">
          {card.time_label || ''}
        </span>
        <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${STATUS_DOT[card.status] || STATUS_DOT.upcoming}`} />
        {!isLast && <div className="w-px flex-1 bg-gray-100 mt-1 min-h-3" />}
      </div>

      {/* card body */}
      <div className="flex-1 pb-3">

        {/* alert — tappable to edit/delete */}
        {isAlert ? (
          <button onClick={onClick} className="w-full text-left bg-red-50 border border-red-200 border-l-4 border-l-red-400 rounded-xl px-4 py-3 active:scale-[.98] transition-all">
            <div className="flex items-start gap-2">
              <AlertTriangle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-red-800 leading-snug">{card.title}</p>
                {card.description && <p className="text-[12px] text-red-600 mt-1 leading-relaxed line-clamp-2">{card.description}</p>}
              </div>
              <Pencil size={11} className="text-red-300 flex-shrink-0 mt-0.5" />
            </div>
          </button>

        /* transport — ticket style */
        ) : isTransport ? (
          <button onClick={onClick}
            className="w-full text-left overflow-hidden active:scale-[.98] transition-all relative"
            style={{
              background: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)',
              border: '1px solid #e0e0e0',
              borderRadius: 16,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
            }}
          >
            {/* ticket top strip — coloured by theme */}
            <div className="px-4 pt-3 pb-2.5 flex items-center gap-2.5"
              style={{ borderBottom: '1px dashed #ddd' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: theme.gradient }}>
                {meta?.num?.match(/LH|SK|D8|FR/) || meta?.type === 'flight'
                  ? <Plane size={14} className="text-white" />
                  : <Train size={14} className="text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{meta?.op || 'Transport'}</p>
                <p className="text-[13px] font-bold text-gray-800 truncate">{meta?.num || card.title}</p>
              </div>
              {meta?.ref && (
                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-lg bg-white border border-gray-200 text-gray-500 flex-shrink-0">
                  {meta.ref}
                </span>
              )}
            </div>

            {/* ticket notch effect — left and right circles */}
            <div className="relative">
              <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-100"
                style={{ border: '1px solid #e0e0e0' }} />
              <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-100"
                style={{ border: '1px solid #e0e0e0' }} />
            </div>

            {/* route section */}
            {(meta?.dep || meta?.arr) && (
              <div className="flex items-center px-4 py-3 gap-2">
                <div>
                  <p className="text-[22px] font-bold text-gray-900 leading-none tabular-nums">{meta.dep}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5 max-w-[90px] truncate font-medium">{meta.from}</p>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1 px-2">
                  <div className="w-full border-t border-dashed border-gray-300" />
                  {meta?.num?.match(/LH|SK|D8|FR/) || meta?.type === 'flight'
                    ? <Plane size={11} className="text-gray-300" />
                    : <Train size={11} className="text-gray-300" />}
                </div>
                <div className="text-right">
                  <p className="text-[22px] font-bold text-gray-900 leading-none tabular-nums">{meta.arr}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5 max-w-[90px] truncate text-right font-medium">{meta.to}</p>
                </div>
              </div>
            )}

            {/* ticket footer */}
            {(meta?.carriage || meta?.passengers) && (
              <div className="px-4 py-2 flex items-center gap-2"
                style={{ borderTop: '1px dashed #ddd', background: 'rgba(0,0,0,0.02)' }}>
                {meta.carriage && <span className="text-[10px] text-gray-400 font-semibold">🪑 {meta.carriage}</span>}
                <span className="text-gray-200">·</span>
                <span className="text-[10px] text-emerald-600 font-bold">✓ Confirmed</span>
              </div>
            )}
          </button>

        /* activity / stay / free — photo card */
        ) : (
          <button onClick={onClick} className="w-full text-left bg-white rounded-xl border border-black/5 shadow-card overflow-hidden active:scale-[.98] transition-all">
            {/* single photo strip — only if photo exists */}
            {photoUrl && (
              <div className="relative" style={{ height: 140 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoUrl} alt="" className="w-full h-full object-cover" />
                {/* photo count badge */}
                {photoCount > 1 && (
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[10px] font-bold" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <Camera size={10} />+{photoCount - 1} more
                  </div>
                )}
                {/* status badge on photo */}
                {card.status === 'now' && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: theme.mid, color: '#fff' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />Now
                  </div>
                )}
              </div>
            )}

            <div className="px-3.5 pt-3 pb-3.5">
              {/* type + status row */}
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${cfg.bg} ${cfg.text}`}>
                  {cfg.label}
                </span>
                {!photoUrl && card.status === 'now' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1" style={{ background: theme.light, color: theme.mid }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: theme.mid }} />Now
                  </span>
                )}
                {card.status === 'done' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-400">Done ✓</span>
                )}
                {/* camera icon if no photo yet — invite uploads */}
                {!photoUrl && card.type !== 'alert' && (
                  <span className="ml-auto flex items-center gap-1 text-[10px] text-gray-300 font-medium">
                    <Camera size={11} />Add photo
                  </span>
                )}
              </div>

              <p className="text-[15px] font-semibold text-gray-900 leading-snug mb-1">{card.title}</p>

              {card.description && (
                <p className="text-[12.5px] text-gray-500 leading-relaxed line-clamp-2">{card.description}</p>
              )}

              {/* tags — colourful pastels */}
              {card.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {card.tags.slice(0, 3).map((t, i) => (
                    <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-md" style={TAG_COLORS[i % TAG_COLORS.length]}>{t}</span>
                  ))}
                  {card.tags.length > 3 && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-400">+{card.tags.length - 3}</span>
                  )}
                </div>
              )}

              {/* stay quick info */}
              {card.type === 'stay' && meta?.host && (
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50">
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Host</p>
                    <p className="text-[12px] font-semibold text-gray-700">{meta.host}</p>
                  </div>
                  {meta.checkIn && <div className="flex-1">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Check-in</p>
                    <p className="text-[12px] font-semibold text-gray-700">{meta.checkIn}</p>
                  </div>}
                  {meta.nights && <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Nights</p>
                    <p className="text-[12px] font-semibold text-gray-700">{meta.nights}</p>
                  </div>}
                </div>
              )}
            </div>
          </button>
        )}
      </div>
    </div>
  )
}