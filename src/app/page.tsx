'use client'
import { useState, useEffect, useCallback } from 'react'
import { Home, Calendar, CheckSquare, Image } from 'lucide-react'
import { COUNTRY_THEMES, DAY_META } from '@/types'
import { DayCard, CountryTheme } from '@/types'
import TodayTab from '@/components/tabs/TodayTab'
import JourneyTab from '@/components/tabs/JourneyTab'
import ListsTab from '@/components/tabs/ListsTab'
import PhotosTab from '@/components/tabs/PhotosTab'
import CardDetailSheet from '@/components/cards/CardDetailSheet'
import AddCardPage from '@/components/cards/AddCardPage'

// Explore tab hidden from nav but code kept
// import ExploreTab from '@/components/tabs/ExploreTab'

const TABS = [
  { id: 'today',   label: 'Today',    Icon: Home },
  { id: 'journey', label: 'Journey',  Icon: Calendar },
  { id: 'photos',  label: 'Memories', Icon: Image },
  // Lists tab hidden — { id: 'lists', label: 'Lists', Icon: CheckSquare },
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
  const [openCard, setOpenCard] = useState<{ card: DayCard; theme: CountryTheme } | null>(null)
  const [showAddCard, setShowAddCard] = useState(false)
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

  const handleCloseCard = useCallback(() => setOpenCard(null), [])
  const handleUpdated = useCallback(() => setRefreshKey(k => k + 1), [])

  const NAV_HEIGHT = 64 // px — used for bottom padding

  return (
    <>
      {/* ── Main app ── */}
      <div className="app-shell" style={{ paddingBottom: NAV_HEIGHT }}>
        <div className={activeTab === 'today'   ? 'block page-enter' : 'hidden'}>
          <TodayTab
            key={refreshKey}
            activeDay={activeDay}
            setActiveDay={setActiveDay}
            theme={theme}
            dayMeta={dayMeta}
            onOpenCard={handleOpenCard}
            onAddCard={() => setShowAddCard(true)}
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
        <div className={activeTab === 'lists'   ? 'block page-enter' : 'hidden'}>
          <ListsTab />
        </div>
      </div>

      {/* ── Bottom nav — fixed, always on top ── */}
      {!openCard && !showAddCard && (
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(0,0,0,0.07)',
          display: 'flex',
          paddingTop: 8,
          paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        }}>
          {TABS.map(({ id, label, Icon }) => {
            const active = activeTab === id
            return (
              <button key={id} onClick={() => setActiveTab(id)} style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 2, border: 'none', background: 'transparent', cursor: 'pointer', padding: '0 2px',
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  background: active ? theme.light : 'transparent',
                  transition: 'all 0.15s',
                }}>
                  <Icon size={17} style={{ color: active ? theme.mid : '#9ca3af' }} strokeWidth={active ? 2.2 : 1.7} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 500, color: active ? theme.mid : '#9ca3af', letterSpacing: '-0.2px' }}>
                  {label}
                </span>
              </button>
            )
          })}
        </nav>
      )}

      {/* ── Add card — full page ── */}
      {showAddCard && (
        <AddCardPage
          activeDay={activeDay}
          theme={theme}
          onClose={() => setShowAddCard(false)}
          onAdded={() => { setRefreshKey(k => k + 1); setShowAddCard(false) }}
        />
      )}

      {/* ── Card detail — full page ── */}
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