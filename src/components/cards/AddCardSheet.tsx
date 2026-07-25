'use client'
import { useState } from 'react'
import { X, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { CardType, CountryTheme } from '@/types'

interface Props { dayNumber: number; theme: CountryTheme; onClose: () => void; onAdded: () => void }

const TYPES: { value: CardType; label: string; emoji: string }[] = [
  { value: 'activity',  label: 'Activity',  emoji: '🎯' },
  { value: 'transport', label: 'Transport', emoji: '✈️' },
  { value: 'stay',      label: 'Stay',      emoji: '🏠' },
  { value: 'alert',     label: 'Alert',     emoji: '⚠️' },
  { value: 'free',      label: 'Note',      emoji: '📝' },
]

export default function AddCardSheet({ dayNumber, theme, onClose, onAdded }: Props) {
  const [type, setType] = useState<CardType>('activity')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [timeLabel, setTimeLabel] = useState('')
  const [tags, setTags] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!title.trim()) return
    setSaving(true)
    await supabase.from('day_cards').insert({
      day_number: dayNumber, type, title: title.trim(),
      description: description.trim() || null,
      time_label: timeLabel.trim() || null,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      status: 'upcoming', sort_order: 999,
      metadata: {},
    })
    setSaving(false)
    onAdded()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-white w-full max-w-app rounded-t-3xl max-h-[88dvh] overflow-y-auto">
        <div className="w-9 h-1 bg-gray-200 rounded-full mx-auto mt-3" />

        <div className="flex items-center justify-between px-5 pt-4 pb-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">Add card · Day {dayNumber}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} className="text-gray-600" />
          </button>
        </div>

        <div className="px-5 py-5 space-y-4">
          {/* type selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 block">Card type</label>
            <div className="grid grid-cols-5 gap-2">
              {TYPES.map(t => (
                <button key={t.value} onClick={() => setType(t.value)}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border-[1.5px] transition-all text-center ${type === t.value ? 'border-transparent text-white' : 'border-gray-100 bg-gray-50 text-gray-600'}`}
                  style={type === t.value ? { background: theme.mid, borderColor: theme.mid } : {}}>
                  <span className="text-lg">{t.emoji}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wide">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">Title *</label>
            <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Vasa Museum" autoFocus />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">Description</label>
            <textarea className="input resize-none" rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="What's happening here..." />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">Time</label>
            <input className="input" value={timeLabel} onChange={e => setTimeLabel(e.target.value)} placeholder="e.g. 9am, Morning, 14:25" />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">Tags <span className="font-normal normal-case">(comma separated)</span></label>
            <input className="input" value={tags} onChange={e => setTags(e.target.value)} placeholder="Family friendly, Ticket, Must-do" />
          </div>

          <button onClick={handleSave} disabled={saving || !title.trim()}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all active:scale-95 disabled:opacity-50"
            style={{ background: theme.gradient }}>
            <Check size={16} />{saving ? 'Adding…' : 'Add card'}
          </button>
        </div>
      </div>
    </div>
  )
}
