'use client'
import { useState, useEffect, useCallback } from 'react'
import { Home, Calendar, Compass, CheckSquare, Image } from 'lucide-react'
import { COUNTRY_THEMES, DAY_META } from '@/types'
import { DayCard, CountryTheme } from '@/types'
import TodayTab from '@/components/tabs/TodayTab'
import JourneyTab from '@/components/tabs/JourneyTab'
import ExploreTab from '@/components/tabs/ExploreTab'
import ListsTab from '@/components/tabs/ListsTab'
import PhotosTab from '@/components/tabs/PhotosTab'
import CardDetailSheet from '@/components/cards/CardDetailSheet'

const TABS = [
  { id: 'today',   label: 'Today',    Icon: Home },
  { id: 'journey', label: 'Journey',  Icon: Calendar },
  { id: 'photos',  label: 'Memories', Icon: Image },
  { id: 'explore', label: 'Explore',  Icon: Compass },
  { id: 'lists',   label: 'Lists',    Icon: CheckSquare },
]

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
  // Global card detail state — lives here so it renders at root level
  const [openCard, setOpenCard] = useState<{ card: DayCard; theme: CountryTheme } | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const dayMeta = DAY_META[activeDay - 1]
  const theme = COUNTRY_THEMES[dayMeta.country]

  useEffect(() => {
    const root = document.documentElement.style
    root.setProperty('--c-dark', theme.dark)
    root.setProperty('--c-mid', theme.mid)
    root.setProperty('--c-light', theme.light)
    root.setProperty('--c-acc', theme.acc)
    const metaTheme = document.querySelector('meta[name="theme-color"]')
    if (metaTheme) metaTheme.setAttribute('content', theme.dark)
  }, [theme])

  // Handle back button / swipe on mobile
  useEffect(() => {
    if (openCard) {
      window.history.pushState({ card: true }, '')
      const onPop = () => setOpenCard(null)
      window.addEventListener('popstate', onPop)
      return () => window.removeEventListener('popstate', onPop)
    }
  }, [openCard])

  const handleOpenCard = useCallback((card: DayCard, cardTheme: CountryTheme) => {
    setOpenCard({ card, theme: cardTheme })
  }, [])

  const handleCloseCard = useCallback(() => {
    setOpenCard(null)
  }, [])

  const handleUpdated = useCallback(() => {
    setRefreshKey(k => k + 1)
  }, [])

  return (
    <>
      {/* Main app shell */}
      <div className="app-shell">
        <div className={activeTab === 'today'   ? 'block page-enter' : 'hidden'}>
          <TodayTab
            key={refreshKey}
            activeDay={activeDay}
            setActiveDay={setActiveDay}
            theme={theme}
            dayMeta={dayMeta}
            onOpenCard={handleOpenCard}
          />
        </div>
        <div className={activeTab === 'journey' ? 'block page-enter' : 'hidden'}>
          <JourneyTab
            activeDay={activeDay}
            setActiveDay={d => { setActiveDay(d); setActiveTab('today') }}
            onOpenCard={handleOpenCard}
          />
        </div>
        <div className={activeTab === 'photos'  ? 'block page-enter' : 'hidden'}>
          <PhotosTab />
        </div>
        <div className={activeTab === 'explore' ? 'block page-enter' : 'hidden'}>
          <ExploreTab dayMeta={dayMeta} theme={theme} />
        </div>
        <div className={activeTab === 'lists'   ? 'block page-enter' : 'hidden'}>
          <ListsTab />
        </div>

        {/* Bottom nav — hidden when card is open */}
        {!openCard && (
          <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/6 flex"
            style={{
              background: 'rgba(255,255,255,0.96)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              paddingBottom: 'max(10px,env(safe-area-inset-bottom))',
            }}>
            {TABS.map(({ id, label, Icon }) => {
              const active = activeTab === id
              return (
                <button key={id} onClick={() => setActiveTab(id)}
                  className="flex-1 flex flex-col items-center gap-0.5 pt-2.5 transition-all">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                    style={{ background: active ? theme.light : 'transparent' }}>
                    <Icon size={16} style={{ color: active ? theme.mid : '#9ca3af' }} strokeWidth={active ? 2.2 : 1.7} />
                  </div>
                  <span className="text-[10px] font-medium tracking-tight"
                    style={{ color: active ? theme.mid : '#9ca3af' }}>
                    {label}
                  </span>
                </button>
              )
            })}
          </nav>
        )}
      </div>

      {/* Card detail — rendered at ROOT level, outside app-shell, truly full screen */}
      {openCard && (
        <CardDetailSheet
          card={openCard.card}
          theme={openCard.theme}
          onClose={handleCloseCard}
          onUpdated={handleUpdated}
        />
      )}
    </>
  )
}