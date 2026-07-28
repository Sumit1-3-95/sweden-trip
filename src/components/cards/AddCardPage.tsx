'use client'
import { useState, useEffect } from 'react'
import { ArrowLeft, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { CardType, CountryTheme, DAY_META } from '@/types'

interface Props {
  activeDay: number
  theme: CountryTheme
  onClose: () => void
  onAdded: () => void
}

const TYPES: { value: CardType; label: string; emoji: string }[] = [
  { value: 'activity',  label: 'Activity',  emoji: '🎯' },
  { value: 'transport', label: 'Transport', emoji: '✈️' },
  { value: 'stay',      label: 'Stay',      emoji: '🏠' },
  { value: 'alert',     label: 'Alert',     emoji: '⚠️' },
  { value: 'free',      label: 'Note',      emoji: '📝' },
]

export default function AddCardPage({ activeDay, theme, onClose, onAdded }: Props) {
  const [type, setType] = useState<CardType>('activity')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [timeLabel, setTimeLabel] = useState('')
  const [selectedDay, setSelectedDay] = useState(activeDay)
  const [saving, setSaving] = useState(false)

  // Lock scroll behind
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // Back button support
  useEffect(() => {
    window.history.pushState({ addCard: true }, '')
    const onPop = () => onClose()
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [onClose])

  async function handleSave() {
    if (!title.trim()) return
    setSaving(true)
    await supabase.from('day_cards').insert({
      day_number: selectedDay,
      type,
      title: title.trim(),
      description: description.trim() || null,
      time_label: timeLabel.trim() || null,
      tags: [],
      status: 'upcoming',
      sort_order: 999,
      metadata: {},
    })
    setSaving(false)
    onAdded()
  }

  return (
    <div
      className="card-page-enter flex flex-col bg-gray-50"
      style={{ position: 'fixed', inset: 0, zIndex: 9999, overscrollBehavior: 'none' }}
    >
      {/* ── Sticky header ── */}
      <div
        className="flex-shrink-0 flex items-center gap-3 px-4 bg-white border-b border-gray-100"
        style={{ paddingTop: 'max(12px, env(safe-area-inset-top))', paddingBottom: 12 }}
      >
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-gray-700 active:opacity-60 transition-opacity"
          style={{ minWidth: 44, minHeight: 44, marginLeft: -8, paddingLeft: 8 }}
        >
          <ArrowLeft size={20} strokeWidth={2} />
          <span className="text-[14px] font-semibold">Back</span>
        </button>
        <div className="flex-1">
          <p className="text-[15px] font-bold text-gray-900 text-center">New card</p>
        </div>
        {/* Save in header too */}
        <button
          onClick={handleSave}
          disabled={saving || !title.trim()}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-semibold text-white disabled:opacity-40 active:scale-95 transition-all"
          style={{ background: theme.mid }}
        >
          <Check size={14} />
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      {/* ── Scrollable form ── */}
      <div
        className="flex-1 overflow-y-auto overscroll-contain"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* hero band matching theme */}
        <div
          className="px-5 py-5"
          style={{ background: theme.gradient }}
        >
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/60 mb-1">Adding to</p>
          <p className="font-serif text-[22px] font-light text-white">
            Day {selectedDay} · {DAY_META[selectedDay - 1]?.weekday} {DAY_META[selectedDay - 1]?.date}
          </p>
          <p className="text-[12px] text-white/60 mt-0.5">{DAY_META[selectedDay - 1]?.city}</p>
        </div>

        <div className="px-4 py-5 space-y-5 pb-32">

          {/* card type */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2.5 block">Card type</label>
            <div className="grid grid-cols-5 gap-2">
              {TYPES.map(t => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-2xl border-[1.5px] transition-all"
                  style={type === t.value
                    ? { background: theme.mid, borderColor: theme.mid, color: '#fff' }
                    : { background: '#fff', borderColor: '#e5e7eb', color: '#6b7280' }}
                >
                  <span className="text-xl">{t.emoji}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wide">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* day */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">Day</label>
            <select
              style={{ fontSize: 16 }}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
              value={selectedDay}
              onChange={e => setSelectedDay(Number(e.target.value))}
            >
              {DAY_META.map(d => (
                <option key={d.day} value={d.day}>
                  Day {d.day} · {d.weekday} {d.date} · {d.city}
                </option>
              ))}
            </select>
          </div>

          {/* title */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">Title *</label>
            <input
              style={{ fontSize: 16 }}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Vasa Museum"
              autoFocus
            />
          </div>

          {/* time */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">Time</label>
            <input
              style={{ fontSize: 16 }}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
              value={timeLabel}
              onChange={e => setTimeLabel(e.target.value)}
              placeholder="e.g. 9am, Morning, 14:25"
            />
          </div>

          {/* description */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">Description</label>
            <textarea
              style={{ fontSize: 16 }}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all resize-none"
              rows={5}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What's happening here…"
            />
          </div>
        </div>
      </div>

      {/* ── Pinned bottom CTA ── */}
      <div
        className="flex-shrink-0 px-4 py-4 bg-white border-t border-gray-100"
        style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={handleSave}
          disabled={saving || !title.trim()}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-[15px] text-white transition-all active:scale-95 disabled:opacity-40"
          style={{ background: theme.gradient }}
        >
          <Check size={18} />
          {saving ? 'Adding card…' : 'Add card'}
        </button>
      </div>
    </div>
  )
}