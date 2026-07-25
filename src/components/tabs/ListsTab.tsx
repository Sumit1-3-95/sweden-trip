'use client'
import { useState, useEffect } from 'react'
import { Plus, Check, Zap } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface CheckItem { id: string; text: string; checked: boolean; list_id: string }
interface CheckList { id: string; name: string; type: string; items?: CheckItem[] }

const SEED_LISTS = [
  { name: 'Packing', type: 'packing', items: ['Passports (all 5)','Schengen visa printouts','Flight booking confirmations','Train booking W5UNRLKY','All Airbnb confirmations','Travel insurance (all 5)','Medications (22 days + spare)','Power adaptor (Type F — EU)','Phone chargers + power banks','Sunscreen SPF 50','Kids: Mira\'s comfort toys','Camera + memory cards'] },
  { name: 'Documents', type: 'documents', items: ['Passports photocopied','Visas saved on phone','Insurance on phone','Emergency contacts printed','Efteling tickets printed/saved'] },
  { name: 'Day checklist', type: 'daily', items: ['Tickets for today\'s activities','Daypack packed','Power bank charged','Water bottles filled','Sunscreen applied','Kids snacks packed'] },
]

export default function ListsTab() {
  const [lists, setLists] = useState<CheckList[]>([])
  const [activeList, setActiveList] = useState<string | null>(null)
  const [newItem, setNewItem] = useState('')
  const [tripCheckMode, setTripCheckMode] = useState(false)
  const [tripCheckIdx, setTripCheckIdx] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchOrSeed() }, [])

  async function fetchOrSeed() {
    setLoading(true)
    const { data: existingLists } = await supabase.from('checklist_lists').select('*')
    if (!existingLists || existingLists.length === 0) {
      // seed
      for (const sl of SEED_LISTS) {
        const { data: list } = await supabase.from('checklist_lists').insert({ name: sl.name, type: sl.type }).select().single()
        if (list) {
          await supabase.from('checklist_items').insert(sl.items.map((text, i) => ({ list_id: list.id, text, sort_order: i })))
        }
      }
    }
    const { data: ls } = await supabase.from('checklist_lists').select('*, items:checklist_items(*)').order('created_at')
    setLists(ls || [])
    if (ls?.length) setActiveList(ls[0].id)
    setLoading(false)
  }

  async function toggleItem(item: CheckItem) {
    await supabase.from('checklist_items').update({ checked: !item.checked, checked_at: !item.checked ? new Date().toISOString() : null }).eq('id', item.id)
    setLists(prev => prev.map(l => ({ ...l, items: l.items?.map(i => i.id === item.id ? { ...i, checked: !i.checked } : i) })))
  }

  async function addItem() {
    if (!newItem.trim() || !activeList) return
    const { data } = await supabase.from('checklist_items').insert({ list_id: activeList, text: newItem.trim(), sort_order: 999 }).select().single()
    if (data) {
      setLists(prev => prev.map(l => l.id === activeList ? { ...l, items: [...(l.items || []), data] } : l))
      setNewItem('')
    }
  }

  const currentList = lists.find(l => l.id === activeList)
  const items = currentList?.items || []
  const done = items.filter(i => i.checked).length
  const pct = items.length ? Math.round((done / items.length) * 100) : 0
  const r = 24, circ = 2 * Math.PI * r
  const dash = circ - (pct / 100) * circ

  // trip check mode
  const unchecked = items.filter(i => !i.checked)
  if (tripCheckMode && unchecked.length > 0) {
    const item = unchecked[tripCheckIdx] || unchecked[0]
    return (
      <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center px-8 z-50">
        <button onClick={() => setTripCheckMode(false)} className="absolute top-14 right-5 text-white/50 text-sm font-medium">Exit</button>
        <div className="text-white/40 text-sm font-medium mb-8">{tripCheckIdx + 1} of {unchecked.length} remaining</div>
        <div className="text-center mb-12">
          <p className="font-serif text-3xl font-light text-white leading-snug">{item.text}</p>
        </div>
        <div className="flex gap-4 w-full">
          <button onClick={() => setTripCheckIdx(i => Math.min(i + 1, unchecked.length - 1))}
            className="flex-1 py-4 rounded-2xl bg-white/10 text-white font-semibold text-base">Skip</button>
          <button onClick={async () => { await toggleItem(item); if (tripCheckIdx >= unchecked.length - 1) setTripCheckMode(false) }}
            className="flex-1 py-4 rounded-2xl bg-emerald-500 text-white font-bold text-base flex items-center justify-center gap-2">
            <Check size={18} /> Done
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-24">
      <div className="px-5 pt-14 pb-5 bg-amber-900" style={{ background: 'linear-gradient(160deg,#3A2200,#8B6914)' }}>
        <p className="font-serif text-3xl font-light text-white">Lists</p>
        <p className="text-sm text-white/60 mt-1">Stay ready · pack smart</p>
      </div>

      {/* progress ring */}
      <div className="mx-4 mt-4 card-base p-4 flex items-center gap-4 shadow-card">
        <svg width="60" height="60" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r={r} fill="none" stroke="#f0f0f0" strokeWidth="5" />
          <circle cx="30" cy="30" r={r} fill="none" stroke="#22c55e" strokeWidth="5"
            strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round" transform="rotate(-90 30 30)" />
          <text x="30" y="35" textAnchor="middle" fontSize="13" fontWeight="700" fill="#111">{pct}%</text>
        </svg>
        <div className="flex-1">
          <p className="text-[20px] font-bold text-gray-900">{done} of {items.length} done</p>
          <p className="text-[12px] text-gray-400">{currentList?.name || 'Checklist'}</p>
        </div>
        <button onClick={() => setTripCheckMode(true)} disabled={unchecked.length === 0}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold text-white disabled:opacity-40 active:scale-95 transition-all"
          style={{ background: 'linear-gradient(135deg,#3A2200,#8B6914)' }}>
          <Zap size={13} />Check
        </button>
      </div>

      {/* list tabs */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
        {lists.map(l => (
          <button key={l.id} onClick={() => setActiveList(l.id)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[12px] font-semibold border transition-all ${activeList === l.id ? 'bg-amber-800 border-amber-700 text-white' : 'border-gray-200 text-gray-500 bg-white'}`}>
            {l.name}
          </button>
        ))}
      </div>

      {/* items */}
      <div className="px-4 pb-4 space-y-1">
        {loading ? (
          [1,2,3,4].map(i => <div key={i} className="h-12 bg-white rounded-xl animate-pulse" />)
        ) : (
          items.map(item => (
            <button key={item.id} onClick={() => toggleItem(item)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-50 shadow-sm active:scale-[.98] transition-all">
              <div className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${item.checked ? 'bg-emerald-500' : 'border-2 border-gray-200'}`}>
                {item.checked && <Check size={11} className="text-white" strokeWidth={3} />}
              </div>
              <span className={`flex-1 text-[13px] text-left font-medium transition-all ${item.checked ? 'line-through text-gray-300' : 'text-gray-800'}`}>{item.text}</span>
            </button>
          ))
        )}

        {/* add item */}
        <div className="flex gap-2 pt-2">
          <input className="input flex-1 text-sm" value={newItem} onChange={e => setNewItem(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addItem()} placeholder="Add an item…" />
          <button onClick={addItem} disabled={!newItem.trim()} className="w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-40 active:scale-90 transition-all" style={{ background: 'linear-gradient(135deg,#3A2200,#8B6914)' }}>
            <Plus size={18} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
