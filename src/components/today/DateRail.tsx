'use client'
import { forwardRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DAY_META, COUNTRY_THEMES } from '@/types'

interface Props {
  activeDay: number
  onDayChange: (day: number) => void
}

const DateRail = forwardRef<HTMLDivElement, Props>(({ activeDay, onDayChange }, ref) => {
  const d = DAY_META[activeDay - 1]
  const t = COUNTRY_THEMES[d.country]
  const canPrev = activeDay > 1
  const canNext = activeDay < 22
  const prevDay = canPrev ? DAY_META[activeDay - 2] : null
  const nextDay = canNext ? DAY_META[activeDay] : null

  return (
    <div
      ref={ref}
      className="sticky top-0 z-30"
      style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}
    >
      <div className="flex items-center px-3 py-2.5 gap-2">

        {/* ── Prev ── */}
        <button
          onClick={() => canPrev && onDayChange(activeDay - 1)}
          disabled={!canPrev}
          className="flex-shrink-0 flex flex-col items-center gap-0.5 transition-all active:scale-90 disabled:opacity-20"
          style={{ minWidth: 44, minHeight: 44, justifyContent: 'center' }}
        >
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{ background: t.light }}
          >
            <ChevronLeft size={18} style={{ color: t.mid }} strokeWidth={2.5} />
          </div>
          {prevDay && (
            <span className="text-[9px] font-semibold" style={{ color: t.mid + '80' }}>
              {prevDay.date.split(' ')[0]}
            </span>
          )}
        </button>

        {/* ── Centre ── */}
        <div className="flex-1 flex items-center gap-3">

          {/* date number block */}
          <div
            className="flex-shrink-0 w-14 h-14 rounded-2xl flex flex-col items-center justify-center"
            style={{ background: t.gradient }}
          >
            <span className="text-[28px] font-bold text-white leading-none tabular-nums">
              {d.date.split(' ')[0]}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-white/70 mt-0.5">
              {d.date.split(' ')[1]}
            </span>
          </div>

          {/* day info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: t.mid }}>
                Day {d.day}
              </span>
              <span className="text-[10px] text-gray-300">·</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                of 22
              </span>
              <span className="ml-auto text-base leading-none">{t.flag}</span>
            </div>
            <p className="text-[15px] font-bold text-gray-900 leading-tight truncate">
              {d.weekday}
            </p>
            <p className="text-[11px] font-semibold truncate mt-0.5" style={{ color: t.mid }}>
              {d.city}
            </p>
          </div>
        </div>

        {/* ── Next ── */}
        <button
          onClick={() => canNext && onDayChange(activeDay + 1)}
          disabled={!canNext}
          className="flex-shrink-0 flex flex-col items-center gap-0.5 transition-all active:scale-90 disabled:opacity-20"
          style={{ minWidth: 44, minHeight: 44, justifyContent: 'center' }}
        >
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{ background: t.light }}
          >
            <ChevronRight size={18} style={{ color: t.mid }} strokeWidth={2.5} />
          </div>
          {nextDay && (
            <span className="text-[9px] font-semibold" style={{ color: t.mid + '80' }}>
              {nextDay.date.split(' ')[0]}
            </span>
          )}
        </button>

      </div>
    </div>
  )
})

DateRail.displayName = 'DateRail'
export default DateRail