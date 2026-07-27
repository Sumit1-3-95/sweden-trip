'use client'
import { useState, useEffect, useRef } from 'react'
import { Plus, Pencil, Check, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { DayCard, DayData, CountryTheme, COUNTRY_THEMES, DAY_META } from '@/types'
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

  // Editable day heading
  const [editingHeading, setEditingHeading] = useState(false)
  const [headingValue, setHeadingValue] = useState(dayMeta.title)
  const [headingDraft, setHeadingDraft] = useState(dayMeta.title)
  const headingInputRef = useRef<HTMLInputElement>(null)

  const railRef = useRef<HTMLDivElement>(null)

  // Reset heading when day changes
  useEffect(() => {
    setHeadingValue(dayMeta.title)
    setHeadingDraft(dayMeta.title)
    setEditingHeading(false)
  }, [activeDay, dayMeta.title])

  useEffect(() => {
    if (editingHeading) headingInputRef.current?.focus()
  }, [editingHeading])

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

  function saveHeading() {
    if (headingDraft.trim()) setHeadingValue(headingDraft.trim())
    setEditingHeading(false)
  }

  function cancelHeading() {
    setHeadingDraft(headingValue)
    setEditingHeading(false)
  }

  return (
    <div className="pb-36">
      <HeroSection theme={theme} dayMeta={{ ...dayMeta, title: headingValue }} activeDay={activeDay} />
      <DateRail ref={railRef} activeDay={activeDay} onDayChange={handleDayChange} />
      <QuickPills dayMeta={dayMeta} theme={theme} cards={cards} />

      {/* ── Day heading row — editable ── */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-2">
        {editingHeading ? (
          <>
            <input
              ref={headingInputRef}
              style={{ fontSize: 16 }}
              className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-[13px] font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={headingDraft}
              onChange={e => setHeadingDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') saveHeading(); if (e.key === 'Escape') cancelHeading() }}
              placeholder="Day heading…"
            />
            <button
              onClick={saveHeading}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all active:scale-90 flex-shrink-0"
              style={{ background: theme.mid }}
            >
              <Check size={14} />
            </button>
            <button
              onClick={cancelHeading}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 bg-gray-50 text-gray-500 transition-all active:scale-90 flex-shrink-0"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                {dayMeta.weekday} {dayMeta.date} · plan
              </p>
              <p className="text-[14px] font-semibold text-gray-700 mt-0.5 truncate">{headingValue}</p>
            </div>
            {/* subtle edit button */}
            <button
              onClick={() => { setHeadingDraft(headingValue); setEditingHeading(true) }}
              className="w-7 h-7 rounded-lg flex items-center justify-center border border-gray-100 bg-gray-50 text-gray-400 hover:text-gray-600 transition-all active:scale-90 flex-shrink-0"
              title="Edit day heading"
            >
              <Pencil size={11} />
            </button>
          </div>
        )}
      </div>

      {/* Timeline */}
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
              onClick={() => onOpenCard(card, theme)}
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