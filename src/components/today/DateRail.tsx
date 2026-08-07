'use client'
import { forwardRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DAY_META, COUNTRY_THEMES } from '@/types'

interface Props { activeDay: number; onDayChange: (day: number) => void }

const DateRail = forwardRef<HTMLDivElement, Props>(({ activeDay, onDayChange }, ref) => {
  const d = DAY_META[activeDay - 1]
  const t = COUNTRY_THEMES[d.country]
  const canPrev = activeDay > 1
  const canNext = activeDay < 22
  const prevDay = canPrev ? DAY_META[activeDay - 2] : null
  const nextDay = canNext ? DAY_META[activeDay] : null

  return (
    <div ref={ref} className="sticky top-0 z-30"
      style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      <div className="flex items-center px-2 py-2 gap-1">

        {/* ── Prev ── */}
        <button
          onClick={() => canPrev && onDayChange(activeDay - 1)}
          disabled={!canPrev}
          className="flex-shrink-0 flex flex-col items-center gap-0.5 active:scale-90 transition-all disabled:opacity-20"
          style={{ minWidth: 44 }}
        >
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: t.light }}>
            <ChevronLeft size={18} style={{ color: t.mid }} strokeWidth={2.5} />
          </div>
          {prevDay && <span className="text-[9px] font-semibold" style={{ color: t.mid + '70' }}>{prevDay.date.split(' ')[0]}</span>}
        </button>

        {/* ── Centre ── */}
        <div className="flex-1 flex items-center gap-3 px-1">
          {/* Flag — big, dominant */}
          <div className="flex-shrink-0 flex flex-col items-center gap-0.5">
            <span style={{ fontSize: 44, lineHeight: 1 }}>{t.flag}</span>
            <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: t.mid }}>{t.name}</span>
          </div>

          {/* divider */}
          <div className="w-px h-12 bg-gray-100 flex-shrink-0" />

          {/* date + info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[32px] font-bold tabular-nums leading-none" style={{ color: t.dark }}>
                {d.date.split(' ')[0]}
              </span>
              <span className="text-[14px] font-semibold" style={{ color: t.mid }}>
                {d.date.split(' ')[1]}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[12px] font-bold text-gray-700">{d.weekday}</span>
              <span className="text-gray-300 text-xs">·</span>
              <span className="text-[11px] font-semibold truncate" style={{ color: t.mid }}>{d.city}</span>
              <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-gray-400 flex-shrink-0">Day {d.day}/22</span>
            </div>
          </div>
        </div>

        {/* ── Next ── */}
        <button
          onClick={() => canNext && onDayChange(activeDay + 1)}
          disabled={!canNext}
          className="flex-shrink-0 flex flex-col items-center gap-0.5 active:scale-90 transition-all disabled:opacity-20"
          style={{ minWidth: 44 }}
        >
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: t.light }}>
            <ChevronRight size={18} style={{ color: t.mid }} strokeWidth={2.5} />
          </div>
          {nextDay && <span className="text-[9px] font-semibold" style={{ color: t.mid + '70' }}>{nextDay.date.split(' ')[0]}</span>}
        </button>

      </div>
    </div>
  )
})

DateRail.displayName = 'DateRail'
export default DateRail