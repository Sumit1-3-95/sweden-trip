'use client'
import { useState, useEffect, useRef } from 'react'
import { Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { DayCard, DayData, CountryTheme, COUNTRY_THEMES } from '@/types'
import HeroSection from '@/components/today/HeroSection'
import DateRail from '@/components/today/DateRail'
import QuickPills from '@/components/today/QuickPills'
import TimelineCard from '@/components/cards/TimelineCard'
import AddCardSheet from '@/components/cards/AddCardSheet'

interface Props {
  activeDay: number
  setActiveDay: (d: number) => void
  theme: CountryTheme
  dayMeta: DayData
  onOpenCard: (card: DayCard, theme: CountryTheme) => void
}

export default function TodayTab({ activeDay, setActiveDay, theme, dayMeta, onOpenCard }: Props) {
  const [cards, setCards] = useState<DayCard[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const railRef = useRef<HTMLDivElement>(null)

  useEffect(() => { fetchCards() }, [activeDay])

  useEffect(() => {
    const channel = supabase
      .channel('day_cards_today')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'day_cards' }, () => fetchCards())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [activeDay])

  async function fetchCards() {
    setLoading(true)
    const { data } = await supabase
      .from('day_cards')
      .select('*, photos:card_photos(*)')
      .eq('day_number', activeDay)
      .order('sort_order')
    setCards(data || [])
    setLoading(false)
  }

  function handleDayChange(day: number) {
    setActiveDay(day)
    setTimeout(() => {
      const btn = railRef.current?.querySelector(`[data-day="${day}"]`)
      btn?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
    }, 50)
  }

  return (
    <div className="pb-28">
      <HeroSection theme={theme} dayMeta={dayMeta} activeDay={activeDay} />
      <DateRail ref={railRef} activeDay={activeDay} onDayChange={handleDayChange} />
      <QuickPills dayMeta={dayMeta} theme={theme} cards={cards} />

      <div className="px-4 pb-2 pt-3">
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
          {dayMeta.weekday} {dayMeta.date} · plan
        </p>
      </div>

      <div className="px-4">
        {loading ? (
          <div className="space-y-3 pt-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-white rounded-xl animate-pulse border border-black/5" />
            ))}
          </div>
        ) : cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-sm font-medium text-gray-500">No cards yet for this day</p>
            <p className="text-xs text-gray-400 mt-1">Tap + to add one</p>
          </div>
        ) : (
          cards.map((card, idx) => (
            <TimelineCard
              key={card.id}
              card={card}
              isLast={idx === cards.length - 1}
              theme={theme}
              onClick={() => {
                // pass correct country theme for the card's day
                onOpenCard(card, theme)
              }}
            />
          ))
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowAdd(true)}
        className="fixed bottom-20 right-4 rounded-2xl flex items-center justify-center shadow-card-lg z-40 transition-all active:scale-90"
        style={{ background: theme.gradient, width: 52, height: 52 }}
        aria-label="Add card"
      >
        <Plus size={22} className="text-white" strokeWidth={2.5} />
      </button>

      {showAdd && (
        <AddCardSheet
          dayNumber={activeDay}
          theme={theme}
          onClose={() => setShowAdd(false)}
          onAdded={fetchCards}
        />
      )}
    </div>
  )
}