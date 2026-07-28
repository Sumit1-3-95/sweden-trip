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
    <div ref={ref} className="bg-white border-b border-black/5 sticky top-0 z-30">
      <div className="px-4 pt-3 pb-2">

        {/* ── Main date row ── */}
        <div className="flex items-center gap-3">

          {/* Prev button + ghost day */}
          <button
            onClick={() => canPrev && onDayChange(activeDay - 1)}
            disabled={!canPrev}
            className="flex flex-col items-center gap-0.5 flex-shrink-0 transition-all active:scale-90 disabled:opacity-20"
            style={{ minWidth: 40 }}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: t.light }}>
              <ChevronLeft size={16} style={{ color: t.mid }} />
            </div>
            {prevDay && (
              <span className="text-[9px] font-medium text-gray-300">{prevDay.date.split(' ')[0]}</span>
            )}
          </button>

          {/* Centre — main date card */}
          <div className="flex-1 flex flex-col items-center">
            {/* day number + country */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: t.mid }}>
                Day {d.day} of 22
              </span>
              <span className="text-base leading-none">{t.flag}</span>
            </div>

            {/* big date */}
            <div
              className="flex items-baseline gap-2 px-5 py-2 rounded-2xl"
              style={{ background: t.light }}
            >
              <span className="font-serif text-[28px] font-light leading-none" style={{ color: t.dark }}>
                {d.date.split(' ')[0]}
              </span>
              <span className="text-[13px] font-semibold" style={{ color: t.mid }}>
                {d.date.split(' ')[1]} · {d.weekday}
              </span>
            </div>

            {/* city */}
            <p className="text-[11px] font-semibold mt-1.5" style={{ color: t.mid }}>
              {d.city}
            </p>
          </div>

          {/* Next button + ghost day */}
          <button
            onClick={() => canNext && onDayChange(activeDay + 1)}
            disabled={!canNext}
            className="flex flex-col items-center gap-0.5 flex-shrink-0 transition-all active:scale-90 disabled:opacity-20"
            style={{ minWidth: 40 }}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: t.light }}>
              <ChevronRight size={16} style={{ color: t.mid }} />
            </div>
            {nextDay && (
              <span className="text-[9px] font-medium text-gray-300">{nextDay.date.split(' ')[0]}</span>
            )}
          </button>
        </div>


        {/* ── Dot strip — tap any day ── */}
        <div className="flex gap-1 mt-2 overflow-x-auto no-scrollbar">
          {DAY_META.map(day => {
            const dt = COUNTRY_THEMES[day.country]
            const isActive = day.day === activeDay
            return (
              <button
                key={day.day}
                onClick={() => onDayChange(day.day)}
                className="flex-shrink-0 transition-all"
                style={{
                  width: isActive ? 20 : 5,
                  height: 5,
                  borderRadius: 99,
                  background: isActive ? dt.mid : dt.mid + '44',
                }}
                title={`Day ${day.day} · ${day.date}`}
              />
            )
          })}
        </div>

      </div>
    </div>
  )
})

DateRail.displayName = 'DateRail'
export default DateRail