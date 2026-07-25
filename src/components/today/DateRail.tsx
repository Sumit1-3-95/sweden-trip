'use client'
import { forwardRef } from 'react'
import { DAY_META, COUNTRY_THEMES } from '@/types'

interface Props {
  activeDay: number
  onDayChange: (day: number) => void
}

const DateRail = forwardRef<HTMLDivElement, Props>(({ activeDay, onDayChange }, ref) => {
  return (
    <div className="bg-white border-b border-black/5 sticky top-0 z-30">
      <div ref={ref} className="flex gap-1 px-3 py-2 overflow-x-auto no-scrollbar">
        {DAY_META.map((d) => {
          const t = COUNTRY_THEMES[d.country]
          const active = d.day === activeDay
          return (
            <button
              key={d.day}
              data-day={d.day}
              onClick={() => onDayChange(d.day)}
              className="flex-shrink-0 flex flex-col items-center gap-0.5 min-w-[52px] rounded-xl px-1.5 py-2 border-[1.5px] transition-all"
              style={{
                borderColor: active ? t.mid : 'transparent',
                background: active ? t.light : 'transparent',
              }}
            >
              <span className="text-[9px] font-bold uppercase tracking-widest"
                style={{ color: active ? t.mid : '#9ca3af' }}>
                {d.weekday}
              </span>
              <span className="text-lg font-bold leading-none transition-all"
                style={{ color: active ? t.dark : '#d1d5db', fontSize: active ? '20px' : '18px' }}>
                {d.date.split(' ')[0]}
              </span>
              <div className="w-1.5 h-1.5 rounded-full mt-0.5 transition-all"
                style={{ background: active ? t.mid : t.mid + '44' }} />
            </button>
          )
        })}
      </div>
    </div>
  )
})

DateRail.displayName = 'DateRail'
export default DateRail
