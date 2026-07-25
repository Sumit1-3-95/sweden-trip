'use client'
import { useState, useRef } from 'react'
import { X, Pencil, Check, Camera, Trash2, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase, uploadPhoto, getPhotoUrl } from '@/lib/supabase'
import { DayCard, CountryTheme, CardStatus } from '@/types'

interface Props {
  card: DayCard
  theme: CountryTheme
  onClose: () => void
  onUpdated: () => void
}

export default function CardDetailSheet({ card, theme, onClose, onUpdated }: Props) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ title: card.title, description: card.description || '', time_label: card.time_label || '', status: card.status })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [photoIdx, setPhotoIdx] = useState(0)
  const [photos, setPhotos] = useState(card.photos || [])
  const fileRef = useRef<HTMLInputElement>(null)
  const meta = card.metadata as Record<string, string> | null
  const airbnbUrl = meta?.airbnb ? `https://www.airbnb.com` : null

  async function saveEdit() {
    setSaving(true)
    await supabase.from('day_cards').update({ ...form, updated_at: new Date().toISOString() }).eq('id', card.id)
    setSaving(false)
    setEditing(false)
    onUpdated()
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    if (photos.length + files.length > 5) { alert('Max 5 photos per card'); return }
    setUploading(true)
    for (const file of files) {
      try {
        const path = await uploadPhoto(file, card.id)
        const url = getPhotoUrl(path)
        const { data } = await supabase.from('card_photos').insert({ card_id: card.id, storage_path: path }).select().single()
        if (data) setPhotos(p => [...p, { ...data, url }])
      } catch (err) { console.error(err) }
    }
    setUploading(false)
    onUpdated()
  }

  async function deletePhoto(photoId: string, path: string) {
    await supabase.storage.from('trip-photos').remove([path])
    await supabase.from('card_photos').delete().eq('id', photoId)
    setPhotos(p => p.filter(ph => ph.id !== photoId))
    setPhotoIdx(i => Math.max(0, i - 1))
    onUpdated()
  }

  const photosWithUrls = photos.map(p => ({ ...p, url: p.url || getPhotoUrl(p.storage_path) }))

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-white w-full max-w-app rounded-t-3xl max-h-[92dvh] overflow-y-auto">
        {/* handle */}
        <div className="w-9 h-1 bg-gray-200 rounded-full mx-auto mt-3" />

        {/* photo carousel */}
        {photosWithUrls.length > 0 ? (
          <div className="relative h-56 bg-gray-100 overflow-hidden">
            <img src={photosWithUrls[photoIdx].url} alt="" className="w-full h-full object-cover" />
            {photosWithUrls.length > 1 && (
              <>
                <button onClick={() => setPhotoIdx(i => (i - 1 + photosWithUrls.length) % photosWithUrls.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => setPhotoIdx(i => (i + 1) % photosWithUrls.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white">
                  <ChevronRight size={16} />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                  {photosWithUrls.map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === photoIdx ? 'bg-white' : 'bg-white/40'}`} />
                  ))}
                </div>
              </>
            )}
            <button onClick={() => deletePhoto(photosWithUrls[photoIdx].id, photosWithUrls[photoIdx].storage_path)}
              className="absolute top-3 right-3 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white">
              <Trash2 size={14} />
            </button>
          </div>
        ) : (
          <div className="h-36 flex items-center justify-center" style={{ background: theme.light }}>
            <div className="text-center">
              <div className="text-3xl mb-1">{theme.flag}</div>
              <p className="text-xs text-gray-400 font-medium">No photos yet</p>
            </div>
          </div>
        )}

        {/* header actions */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} className="text-gray-600" />
          </button>
          <div className="flex gap-2">
            {/* photo upload */}
            {photos.length < 5 && (
              <button onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 bg-gray-50 active:scale-95 transition-all">
                {uploading ? '↑ uploading...' : <><Camera size={13} />Add photo</>}
              </button>
            )}
            {/* edit toggle */}
            {editing ? (
              <button onClick={saveEdit} disabled={saving}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white active:scale-95 transition-all"
                style={{ background: theme.mid }}>
                <Check size={13} />{saving ? 'Saving…' : 'Save'}
              </button>
            ) : (
              <button onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 bg-gray-50 active:scale-95 transition-all">
                <Pencil size={13} />Edit
              </button>
            )}
          </div>
        </div>

        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />

        {/* content */}
        <div className="px-5 pb-8">
          {/* type chip */}
          <span className="chip bg-gray-100 text-gray-500 mb-3 capitalize">{card.type}</span>

          {editing ? (
            <div className="space-y-3">
              <input className="input text-base font-semibold" value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Title" />
              <textarea className="input resize-none" rows={4} value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" />
              <input className="input" value={form.time_label}
                onChange={e => setForm(f => ({ ...f, time_label: e.target.value }))} placeholder="Time (e.g. 9am, Morning, 14:25)" />
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">Status</p>
                <div className="flex gap-2">
                  {(['upcoming','now','done'] as CardStatus[]).map(s => (
                    <button key={s} onClick={() => setForm(f => ({ ...f, status: s }))}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize border transition-all ${form.status === s ? 'border-transparent text-white' : 'border-gray-200 text-gray-500 bg-gray-50'}`}
                      style={form.status === s ? { background: theme.mid } : {}}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <h2 className="font-serif text-2xl font-light text-gray-900 leading-tight mb-2">{card.title}</h2>
              {card.time_label && <p className="text-sm font-semibold mb-3" style={{ color: theme.mid }}>{card.time_label}</p>}
              {card.description && <p className="text-[13.5px] text-gray-600 leading-relaxed">{card.description}</p>}

              {/* tags */}
              {card.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {card.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              )}

              {/* metadata details */}
              {meta && Object.keys(meta).length > 0 && (
                <div className="mt-5 rounded-xl border border-gray-100 overflow-hidden">
                  {meta.ref && <MetaRow label="Booking ref" value={meta.ref} mono />}
                  {meta.from && <MetaRow label="From" value={meta.from} />}
                  {meta.to && <MetaRow label="To" value={meta.to} />}
                  {meta.dep && <MetaRow label="Departs" value={meta.dep} />}
                  {meta.arr && <MetaRow label="Arrives" value={meta.arr} />}
                  {meta.carriage && <MetaRow label="Carriage" value={meta.carriage} />}
                  {meta.host && <MetaRow label="Host" value={meta.host} />}
                  {meta.address && <MetaRow label="Address" value={meta.address} />}
                  {meta.checkIn && <MetaRow label="Check-in" value={meta.checkIn} />}
                  {meta.checkOut && <MetaRow label="Check-out" value={meta.checkOut} />}
                  {meta.nights && <MetaRow label="Nights" value={meta.nights} />}
                  {meta.note && <MetaRow label="Note" value={meta.note} warn />}
                </div>
              )}

              {/* alert inside stay */}
              {meta?.alert && (
                <div className="mt-3 bg-red-50 border border-red-200 border-l-4 border-l-red-400 rounded-xl p-3 text-[12px] text-red-700 leading-relaxed">
                  {meta.alert}
                </div>
              )}

              {/* Airbnb link */}
              {meta?.airbnb && (
                <a href="https://www.airbnb.com" target="_blank" rel="noopener noreferrer"
                  className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl border border-orange-200 bg-orange-50">
                  <div className="w-7 h-7 bg-[#FF5A5F] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[10px] font-bold">A</span>
                  </div>
                  <span className="text-sm font-semibold text-orange-700 flex-1">Open in Airbnb</span>
                  <ExternalLink size={14} className="text-orange-400" />
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function MetaRow({ label, value, mono, warn }: { label: string; value: string; mono?: boolean; warn?: boolean }) {
  return (
    <div className={`flex items-start justify-between gap-3 px-3.5 py-2.5 border-b border-gray-50 last:border-0 ${warn ? 'bg-amber-50' : 'bg-white'}`}>
      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex-shrink-0 pt-0.5">{label}</span>
      <span className={`text-[12.5px] text-right text-gray-700 ${mono ? 'font-mono font-bold tracking-widest' : 'font-medium'}`}>{value}</span>
    </div>
  )
}
