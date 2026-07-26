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

  return (
    <div ref={ref} className="bg-white border-b border-black/5 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3">

        {/* prev button */}
        <button
          onClick={() => canPrev && onDayChange(activeDay - 1)}
          disabled={!canPrev}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 disabled:opacity-25"
          style={{ background: t.light }}
        >
          <ChevronLeft size={16} style={{ color: t.mid }} />
        </button>

        {/* centre — date display */}
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: t.mid }}>
            {d.weekday} · Day {d.day} of 22
          </span>
          <span className="text-[17px] font-bold leading-tight" style={{ color: t.dark }}>
            {d.date} · {d.city}
          </span>
          {/* country dot row */}
          <div className="flex gap-1 mt-1">
            {DAY_META.map(day => (
              <div
                key={day.day}
                onClick={() => onDayChange(day.day)}
                className="cursor-pointer transition-all rounded-full"
                style={{
                  width: day.day === activeDay ? 16 : 4,
                  height: 4,
                  background: day.day === activeDay
                    ? COUNTRY_THEMES[day.country].mid
                    : COUNTRY_THEMES[day.country].mid + '44',
                }}
              />
            ))}
          </div>
        </div>

        {/* next button */}
        <button
          onClick={() => canNext && onDayChange(activeDay + 1)}
          disabled={!canNext}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 disabled:opacity-25"
          style={{ background: t.light }}
        >
          <ChevronRight size={16} style={{ color: t.mid }} />
        </button>

      </div>
    </div>
  )
})

DateRail.displayName = 'DateRail'
export default DateRail