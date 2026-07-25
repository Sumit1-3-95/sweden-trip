'use client'
import { useState, useEffect } from 'react'
import { Home, Calendar, Compass, CheckSquare } from 'lucide-react'
import { COUNTRY_THEMES } from '@/types'
import { DAY_META } from '@/types'
import TodayTab from '@/components/tabs/TodayTab'
import JourneyTab from '@/components/tabs/JourneyTab'
import ExploreTab from '@/components/tabs/ExploreTab'
import ListsTab from '@/components/tabs/ListsTab'

const TABS = [
  { id: 'today',   label: 'Today',   Icon: Home },
  { id: 'journey', label: 'Journey', Icon: Calendar },
  { id: 'explore', label: 'Explore', Icon: Compass },
  { id: 'lists',   label: 'Lists',   Icon: CheckSquare },
]

// Determine current trip day based on real date
function getCurrentDay(): number {
  const start = new Date('2026-07-24')
  const now = new Date()
  const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  if (diff < 1) return 1
  if (diff > 22) return 22
  return diff
}

export default function App() {
  const [activeTab, setActiveTab] = useState('today')
  const [activeDay, setActiveDay] = useState(getCurrentDay)

  const dayMeta = DAY_META[activeDay - 1]
  const theme = COUNTRY_THEMES[dayMeta.country]

  // Apply CSS custom properties for the active country theme
  useEffect(() => {
    const root = document.documentElement.style
    root.setProperty('--c-dark', theme.dark)
    root.setProperty('--c-mid', theme.mid)
    root.setProperty('--c-light', theme.light)
    root.setProperty('--c-acc', theme.acc)
    const metaTheme = document.querySelector('meta[name="theme-color"]')
    if (metaTheme) metaTheme.setAttribute('content', theme.dark)
  }, [theme])

  return (
    <div className="app-shell">
      {/* screens */}
      <div className={activeTab === 'today'   ? 'block page-enter' : 'hidden'}>
        <TodayTab activeDay={activeDay} setActiveDay={setActiveDay} theme={theme} dayMeta={dayMeta} />
      </div>
      <div className={activeTab === 'journey' ? 'block page-enter' : 'hidden'}>
        <JourneyTab activeDay={activeDay} setActiveDay={(d) => { setActiveDay(d); setActiveTab('today') }} />
      </div>
      <div className={activeTab === 'explore' ? 'block page-enter' : 'hidden'}>
        <ExploreTab dayMeta={dayMeta} theme={theme} />
      </div>
      <div className={activeTab === 'lists'   ? 'block page-enter' : 'hidden'}>
        <ListsTab />
      </div>

      {/* bottom nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app z-50 bg-white/92 backdrop-blur-xl border-t border-black/6 flex pb-safe">
        {TABS.map(({ id, label, Icon }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-all"
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${active ? 'bg-[var(--c-light)]' : ''}`}>
                <Icon size={16} className={active ? 'text-[var(--c-mid)]' : 'text-gray-400'} strokeWidth={active ? 2 : 1.7} />
              </div>
              <span className={`text-[10px] font-medium tracking-tight ${active ? 'text-[var(--c-mid)]' : 'text-gray-400'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
