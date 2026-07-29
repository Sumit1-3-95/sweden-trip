'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  ArrowLeft, Pencil, Check, Camera, Trash2, ExternalLink,
  X, Plus, ChevronLeft, ChevronRight, Clock, Train,
  Users, Lightbulb, Info, MapPin, BookOpen, Image as ImageIcon,
} from 'lucide-react'
import { supabase, uploadPhoto, getPhotoUrl } from '@/lib/supabase'
import { DayCard, CountryTheme, CardStatus, DAY_META } from '@/types'

interface Props {
  card: DayCard
  theme: CountryTheme
  onClose: () => void
  onUpdated: () => void
}

type Tab = 'itinerary' | 'photos' | 'trivia'

export default function CardDetailSheet({ card, theme, onClose, onUpdated }: Props) {
  const [tab, setTab] = useState<Tab>('itinerary')
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    title: card.title,
    description: card.description || '',
    time_label: card.time_label || '',
    status: card.status,
    day_number: card.day_number,
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const [coverPhotoId, setCoverPhotoId] = useState<string | null>(null)
  const [trivia, setTrivia] = useState<string>('')
  const [location, setLocation] = useState<string>(card.location || (card.metadata as Record<string,string> | null)?.maps_url || '')
  const [editingLocation, setEditingLocation] = useState(false)
  const [locationDraft, setLocationDraft] = useState(location)
  const [editingTrivia, setEditingTrivia] = useState(false)
  const [savingTrivia, setSavingTrivia] = useState(false)
  const [photos, setPhotos] = useState(
    (card.photos || []).map(p => ({ ...p, url: p.url || getPhotoUrl(p.storage_path) }))
  )
  const fileRef = useRef<HTMLInputElement>(null)
  const meta = card.metadata as Record<string, string> | null
  const isTransport = card.type === 'transport'
  const isStay = card.type === 'stay'
  const isAlert = card.type === 'alert'
  const typeColor = isAlert ? '#ef4444' : isTransport ? '#3b82f6' : isStay ? '#f59e0b' : theme.mid

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // Load trivia from metadata
  useEffect(() => {
    const m = card.metadata as Record<string, string> | null
    setTrivia(m?.trivia || '')
  }, [card.id])

  // Escape key
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxIdx !== null) setLightboxIdx(null)
        else onClose()
      }
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [lightboxIdx, onClose])

  async function saveEdit() {
    setSaving(true)
    await supabase.from('day_cards').update({
      title: form.title,
      description: form.description,
      time_label: form.time_label,
      status: form.status,
      day_number: form.day_number,
      updated_at: new Date().toISOString(),
    }).eq('id', card.id)
    setSaving(false)
    setEditing(false)
    onUpdated()
    if (form.day_number !== card.day_number) onClose()
  }

  async function saveTrivia() {
    setSavingTrivia(true)
    const currentMeta = (card.metadata as Record<string, string>) || {}
    await supabase.from('day_cards').update({
      metadata: { ...currentMeta, trivia },
      updated_at: new Date().toISOString(),
    }).eq('id', card.id)
    setSavingTrivia(false)
    setEditingTrivia(false)
    onUpdated()
  }

  async function saveLocation() {
    const val = locationDraft.trim()
    setLocation(val)
    setEditingLocation(false)
    // Save to metadata.maps_url
    const currentMeta = (card.metadata as Record<string, string>) || {}
    await supabase.from('day_cards').update({
      location: val,
      metadata: { ...currentMeta, maps_url: val },
      updated_at: new Date().toISOString(),
    }).eq('id', card.id)
    onUpdated()
  }

  async function deleteCard() {
    if (!confirm('Delete this card? This cannot be undone.')) return
    for (const p of photos) {
      await supabase.storage.from('trip-photos').remove([p.storage_path])
    }
    await supabase.from('card_photos').delete().eq('card_id', card.id)
    await supabase.from('day_cards').delete().eq('id', card.id)
    onUpdated()
    onClose()
  }

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    if (photos.length + files.length > 10) { setUploadError('Max 10 photos per card'); return }
    setUploadError(null)
    setUploading(true)
    for (const file of files) {
      try {
        const path = await uploadPhoto(file, card.id)
        const url = getPhotoUrl(path)
        const { data, error } = await supabase.from('card_photos').insert({ card_id: card.id, storage_path: path }).select().single()
        if (error) throw error
        setPhotos(prev => [...prev, { ...data, url }])
      } catch (err) {
        console.error(err)
        setUploadError('Upload failed — check storage bucket is public')
      }
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
    onUpdated()
    // switch to photos tab and jump to newest
    setTab('photos')
  }, [card.id, photos.length, onUpdated])

  async function deletePhoto(id: string, path: string) {
    await supabase.storage.from('trip-photos').remove([path])
    await supabase.from('card_photos').delete().eq('id', id)
    setPhotos(prev => prev.filter(p => p.id !== id))
    if (lightboxIdx !== null) setLightboxIdx(null)
    if (coverPhotoId === id) setCoverPhotoId(null)
    onUpdated()
  }

  // Render markdown-ish trivia (bold, italic, bullets, headers)
  function renderTrivia(text: string) {
    const lines = text.split('\n')
    return lines.map((line, i) => {
      if (line.startsWith('## ')) return <h3 key={i} className="text-[15px] font-bold text-gray-900 mt-4 mb-1.5">{line.slice(3)}</h3>
      if (line.startsWith('# ')) return <h2 key={i} className="text-[17px] font-bold text-gray-900 mt-4 mb-2">{line.slice(2)}</h2>
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return (
          <div key={i} className="flex gap-2 items-start my-1">
            <span className="text-[14px] mt-0.5 flex-shrink-0" style={{ color: typeColor }}>•</span>
            <p className="text-[14px] text-gray-700 leading-relaxed">{formatInline(line.slice(2))}</p>
          </div>
        )
      }
      if (line.trim() === '') return <div key={i} className="h-2" />
      return <p key={i} className="text-[14px] text-gray-700 leading-relaxed my-1">{formatInline(line)}</p>
    })
  }

  function formatInline(text: string): React.ReactNode {
    // bold **text**, italic *text*
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} className="font-bold text-gray-900">{part.slice(2,-2)}</strong>
      if (part.startsWith('*') && part.endsWith('*')) return <em key={i} className="italic text-gray-600">{part.slice(1,-1)}</em>
      return part
    })
  }

  const TABS: { id: Tab; label: string; Icon: React.ElementType }[] = [
    { id: 'itinerary', label: 'Itinerary', Icon: Info },
    { id: 'photos',    label: `Photos${photos.length > 0 ? ` (${photos.length})` : ''}`, Icon: ImageIcon },
    { id: 'trivia',    label: 'Trivia', Icon: BookOpen },
  ]

  return (
    <>
      <div
        className="card-page-enter flex flex-col bg-gray-50"
        style={{ position: 'fixed', inset: 0, zIndex: 9999, overscrollBehavior: 'none' }}
      >
        {/* ── Header ── */}
        <div
          className="flex-shrink-0 flex items-center gap-2 px-4 bg-white border-b border-gray-100"
          style={{ paddingTop: 'max(12px, env(safe-area-inset-top))', paddingBottom: 10 }}
        >
          <button onClick={onClose}
            className="flex items-center gap-1.5 text-gray-700 active:opacity-60 transition-opacity flex-shrink-0"
            style={{ minWidth: 44, minHeight: 44, marginLeft: -8, paddingLeft: 8 }}>
            <ArrowLeft size={20} strokeWidth={2} />
            <span className="text-[14px] font-semibold">Back</span>
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-gray-900 truncate text-center">{card.title}</p>
          </div>
          {/* Photo upload */}
          {photos.length < 10 ? (
            <label htmlFor="card-photo-upload"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border border-gray-200 bg-gray-50 text-gray-600 cursor-pointer active:bg-gray-100 flex-shrink-0">
              <Camera size={13} style={{ color: typeColor }} />
              {uploading ? '…' : 'Photo'}
            </label>
          ) : (
            <span className="text-[11px] text-gray-400 flex-shrink-0">10/10</span>
          )}
          {/* Edit / Save */}
          {editing ? (
            <button onClick={saveEdit} disabled={saving}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-white flex-shrink-0 disabled:opacity-50"
              style={{ background: typeColor }}>
              <Check size={13} />{saving ? '…' : 'Save'}
            </button>
          ) : (
            <button onClick={() => setEditing(true)}
              className="w-8 h-8 rounded-xl flex items-center justify-center border border-gray-200 bg-gray-50 flex-shrink-0 active:bg-gray-100">
              <Pencil size={14} className="text-gray-500" />
            </button>
          )}
        </div>

        <input ref={fileRef} id="card-photo-upload" type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />

        {/* ── Hero ── */}
        {photos.length > 0 ? (
          <div className="relative flex-shrink-0" style={{ height: 220 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverPhotoId ? (photos.find(p => p.id === coverPhotoId)?.url || photos[0].url) : photos[0].url}
              alt="" className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' }} />
            {/* text on hero */}
            <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{card.type} · Day {card.day_number}</span>
              <h1 className="font-serif text-[22px] font-light text-white leading-tight" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>{card.title}</h1>
              {card.time_label && <p className="text-[12px] text-white/75 mt-0.5">🕐 {card.time_label}</p>}
            </div>
            {/* photo count */}
            {photos.length > 1 && (
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[10px] font-bold" style={{ background: 'rgba(0,0,0,0.4)' }}>
                <ImageIcon size={10} /> {photos.length}
              </div>
            )}
          </div>
        ) : (
          <div className="relative flex-shrink-0 px-5 py-6" style={{ background: theme.gradient, minHeight: 130 }}>
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: theme.pattern }} />
            <div className="relative z-10 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                {card.type} · Day {card.day_number} · {DAY_META[card.day_number - 1]?.weekday} {DAY_META[card.day_number - 1]?.date}
              </span>
              <h1 className="font-serif text-[24px] font-light text-white leading-tight mt-1">{card.title}</h1>
              {card.time_label && <p className="text-[12px] text-white/70 mt-1">🕐 {card.time_label}</p>}
              <label htmlFor="card-photo-upload"
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                <Camera size={11} /> Add a photo
              </label>
            </div>
          </div>
        )}

        {/* upload error */}
        {uploadError && (
          <div className="flex-shrink-0 mx-4 mt-2 flex items-center justify-between px-3 py-2 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-[12px] text-red-600 font-medium">{uploadError}</p>
            <button onClick={() => setUploadError(null)}><X size={14} className="text-red-400" /></button>
          </div>
        )}

        {/* ── Tab bar ── */}
        <div className="flex-shrink-0 bg-white border-b border-gray-100 flex">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 relative text-[12px] font-semibold transition-colors"
              style={{ color: tab === id ? typeColor : '#9ca3af' }}>
              <Icon size={13} />
              {label}
              {tab === id && (
                <div className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full" style={{ background: typeColor }} />
              )}
            </button>
          ))}
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>

          {/* ══ ITINERARY TAB ══ */}
          {tab === 'itinerary' && (
            <div className="pb-16">
              {editing ? (
                <div className="px-4 py-5 space-y-4">
                  <Field label="Title">
                    <input style={{ fontSize: 16 }} className="input" value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Title" />
                  </Field>
                  <Field label="Description">
                    <textarea style={{ fontSize: 16 }} className="input resize-none" rows={5}
                      value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" />
                  </Field>
                  <Field label="Time">
                    <input style={{ fontSize: 16 }} className="input" value={form.time_label}
                      onChange={e => setForm(f => ({ ...f, time_label: e.target.value }))} placeholder="e.g. 9am, Morning, 14:25" />
                  </Field>
                  <Field label="Move to day">
                    <select style={{ fontSize: 16 }} className="input appearance-none" value={form.day_number}
                      onChange={e => setForm(f => ({ ...f, day_number: Number(e.target.value) }))}>
                      {DAY_META.map(d => (
                        <option key={d.day} value={d.day}>Day {d.day} · {d.weekday} {d.date} · {d.city}</option>
                      ))}
                    </select>
                    {form.day_number !== card.day_number && (
                      <p className="text-[11px] text-amber-600 font-medium mt-1.5">⚠️ Card will move to Day {form.day_number} on save</p>
                    )}
                  </Field>
                  <Field label="Status">
                    <div className="flex gap-2">
                      {(['upcoming', 'now', 'done'] as CardStatus[]).map(s => (
                        <button key={s} onClick={() => setForm(f => ({ ...f, status: s }))}
                          className="flex-1 py-2.5 rounded-xl text-[12px] font-bold capitalize border transition-all"
                          style={form.status === s ? { background: typeColor, color: '#fff', borderColor: typeColor } : { background: '#f9fafb', color: '#6b7280', borderColor: '#e5e7eb' }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <div className="pt-2 border-t border-gray-100">
                    <button onClick={deleteCard}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold text-red-600 border border-red-200 bg-red-50 active:bg-red-100 transition-all">
                      <Trash2 size={14} /> Delete this card
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Location — tappable maps link */}
                  {(location || meta?.maps_url) && (
                    <Sec>
                      <div className="flex items-center justify-between gap-3">
                        <a
                          href={location || meta?.maps_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 flex-1 no-underline active:opacity-70 transition-opacity"
                        >
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: theme.light }}>
                            <MapPin size={16} style={{ color: theme.mid }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Location</p>
                            <p className="text-[13px] font-semibold truncate" style={{ color: theme.mid }}>Open in Maps →</p>
                          </div>
                        </a>
                        <button onClick={() => { setLocationDraft(location || meta?.maps_url || ''); setEditingLocation(true) }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center border border-gray-100 bg-gray-50 text-gray-400 active:scale-90 transition-all flex-shrink-0">
                          <Pencil size={11} />
                        </button>
                      </div>
                      {editingLocation && (
                        <div className="mt-3 flex gap-2">
                          <input
                            style={{ fontSize: 16 }}
                            className="input flex-1 text-[13px]"
                            value={locationDraft}
                            onChange={e => setLocationDraft(e.target.value)}
                            placeholder="Paste a Google Maps or any maps URL"
                            autoFocus
                          />
                          <button onClick={saveLocation}
                            className="px-3 py-2 rounded-xl text-[12px] font-semibold text-white flex-shrink-0"
                            style={{ background: theme.mid }}>
                            Save
                          </button>
                          <button onClick={() => setEditingLocation(false)}
                            className="px-3 py-2 rounded-xl text-[12px] font-semibold text-gray-500 border border-gray-200 bg-gray-50 flex-shrink-0">
                            Cancel
                          </button>
                        </div>
                      )}
                    </Sec>
                  )}

                  {/* No location yet — subtle add prompt */}
                  {!location && !meta?.maps_url && !isTransport && (
                    <Sec>
                      <button onClick={() => { setLocationDraft(''); setEditingLocation(true) }}
                        className="flex items-center gap-2.5 text-left active:opacity-60 transition-opacity w-full">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border border-dashed border-gray-200">
                          <MapPin size={16} className="text-gray-300" />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-gray-400">Add location</p>
                          <p className="text-[11px] text-gray-300">Paste a Google Maps URL</p>
                        </div>
                      </button>
                      {editingLocation && (
                        <div className="mt-3 flex gap-2">
                          <input
                            style={{ fontSize: 16 }}
                            className="input flex-1 text-[13px]"
                            value={locationDraft}
                            onChange={e => setLocationDraft(e.target.value)}
                            placeholder="https://maps.app.goo.gl/..."
                            autoFocus
                          />
                          <button onClick={saveLocation}
                            className="px-3 py-2 rounded-xl text-[12px] font-semibold text-white flex-shrink-0"
                            style={{ background: theme.mid }}>
                            Save
                          </button>
                          <button onClick={() => setEditingLocation(false)}
                            className="px-3 py-2 rounded-xl text-[12px] font-semibold text-gray-500 border border-gray-200 bg-gray-50 flex-shrink-0">
                            Cancel
                          </button>
                        </div>
                      )}
                    </Sec>
                  )}

                  {/* Quick facts strip */}
                  {(meta?.duration || meta?.nearest_station || meta?.cost) && (
                    <div className="flex bg-white border-b border-gray-100 divide-x divide-gray-100">
                      {meta?.duration && <FactCell icon={<Clock size={12} />} label="Duration" value={meta.duration} color={typeColor} />}
                      {meta?.nearest_station && <FactCell icon={<Train size={12} />} label="Getting there" value={meta.nearest_station} color={typeColor} />}
                      {meta?.cost && <FactCell icon={<Info size={12} />} label="Cost" value={meta.cost} color={typeColor} />}
                    </div>
                  )}

                  {/* Description */}
                  {card.description && (
                    <Sec><p className="text-[14px] text-gray-700 leading-relaxed">{card.description}</p></Sec>
                  )}

                  {/* Transport route */}
                  {isTransport && meta && (meta.dep || meta.arr) && (
                    <Sec>
                      <SecTitle icon={<Train size={13} />} label="Route" color={typeColor} />
                      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="flex items-center gap-3 px-4 py-4 bg-gray-50">
                          <div>
                            <p className="text-[26px] font-bold tabular-nums text-gray-900 leading-none">{meta.dep}</p>
                            <p className="text-[12px] text-gray-500 mt-1">{meta.from}</p>
                          </div>
                          <div className="flex-1 flex items-center gap-2 px-2">
                            <div className="flex-1 border-t-2 border-dashed border-gray-200" />
                            <span className="text-gray-300 text-lg">›</span>
                          </div>
                          <div className="text-right">
                            <p className="text-[26px] font-bold tabular-nums text-gray-900 leading-none">{meta.arr}</p>
                            <p className="text-[12px] text-gray-500 mt-1">{meta.to}</p>
                          </div>
                        </div>
                        {meta.via && <MRow label="Via" value={meta.via} />}
                        {meta.duration && <MRow label="Duration" value={meta.duration} />}
                        {meta.op && <MRow label="Operator" value={meta.op} />}
                        {meta.num && <MRow label="Service" value={meta.num} />}
                        {meta.carriage && <MRow label="Carriage" value={meta.carriage} />}
                        {meta.passengers && <MRow label="Seats" value={meta.passengers} />}
                        {meta.amenities && <MRow label="Amenities" value={meta.amenities} />}
                        {meta.terminal && <MRow label="Terminal" value={meta.terminal} />}
                        {meta.ref && <MRow label="Booking ref" value={meta.ref} mono />}
                        <div className="px-4 py-3 flex items-center gap-2 bg-emerald-50 border-t border-emerald-100">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                          <p className="text-[12px] font-semibold text-emerald-700">Confirmed</p>
                        </div>
                      </div>
                    </Sec>
                  )}

                  {/* What to expect */}
                  {meta?.what_to_expect && (
                    <Sec>
                      <SecTitle icon={<Info size={13} />} label="What to expect" color={typeColor} />
                      <p className="text-[13.5px] text-gray-600 leading-relaxed">{meta.what_to_expect}</p>
                    </Sec>
                  )}

                  {/* Insider tip */}
                  {meta?.tip && (
                    <Sec>
                      <div className="rounded-2xl p-4 flex gap-3" style={{ background: theme.light }}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: theme.mid }}>
                          <Lightbulb size={14} className="text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: theme.mid }}>Insider tip</p>
                          <p className="text-[13px] leading-relaxed" style={{ color: theme.dark }}>{meta.tip}</p>
                        </div>
                      </div>
                    </Sec>
                  )}

                  {/* Tags */}
                  {card.tags?.length > 0 && (
                    <Sec>
                      <div className="flex flex-wrap gap-2">
                        {card.tags.map((t, i) => (
                          <span key={t} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                            style={TAG_COLORS[i % TAG_COLORS.length]}>{t}</span>
                        ))}
                      </div>
                    </Sec>
                  )}

                  {/* Stay details */}
                  {isStay && meta && (
                    <Sec>
                      <SecTitle icon={<MapPin size={13} />} label="Stay details" color={typeColor} />

                      {/* Property header card */}
                      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-3">
                        {/* Property name banner */}
                        {meta.property_name && (
                          <div className="px-4 py-3 border-b border-gray-50" style={{ background: theme.light }}>
                            <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: theme.mid }}>Property</p>
                            <p className="text-[15px] font-bold" style={{ color: theme.dark }}>{meta.property_name}</p>
                          </div>
                        )}
                        {/* Check-in / Check-out row */}
                        {(meta.checkIn || meta.checkOut) && (
                          <div className="flex divide-x divide-gray-50">
                            {meta.checkIn && (
                              <div className="flex-1 px-4 py-3">
                                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">Check-in</p>
                                <p className="text-[13px] font-bold text-gray-800">{meta.checkIn}</p>
                              </div>
                            )}
                            {meta.checkOut && (
                              <div className="flex-1 px-4 py-3">
                                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">Check-out</p>
                                <p className="text-[13px] font-bold text-gray-800">{meta.checkOut}</p>
                              </div>
                            )}
                          </div>
                        )}
                        {/* nights + guests */}
                        {(meta.nights || meta.guests) && (
                          <div className="flex divide-x divide-gray-50 border-t border-gray-50">
                            {meta.nights && (
                              <div className="flex-1 px-4 py-2.5">
                                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Nights</p>
                                <p className="text-[13px] font-semibold text-gray-700">{meta.nights}</p>
                              </div>
                            )}
                            {meta.guests && (
                              <div className="flex-1 px-4 py-2.5">
                                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Guests</p>
                                <p className="text-[12px] font-semibold text-gray-700">{meta.guests}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Host + contact */}
                      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-3">
                        {meta.host && <MRow label="Host" value={meta.host} />}
                        {meta.host_phone && (
                          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0 bg-white">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 min-w-[80px]">Phone</span>
                            <a href={`tel:${meta.host_phone}`}
                              className="text-[13px] font-semibold flex items-center gap-1.5 no-underline"
                              style={{ color: typeColor }}>
                              📞 {meta.host_phone}
                            </a>
                          </div>
                        )}
                        {meta.airbnb_ref && <MRow label="Ref" value={meta.airbnb_ref} mono />}
                        {meta.nearest_station && <MRow label="Nearest stop" value={meta.nearest_station} />}
                        {meta.note && <MRow label="Note" value={meta.note} warn />}
                      </div>

                      {/* Address */}
                      {meta.address && (
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-3">
                          <MRow label="Address" value={meta.address} />
                        </div>
                      )}

                      {/* Alert */}
                      {meta.alert && (
                        <div className="bg-red-50 border border-red-200 border-l-4 border-l-red-400 rounded-2xl px-4 py-3 mb-3">
                          <p className="text-[12px] text-red-700 font-medium leading-relaxed">{meta.alert}</p>
                        </div>
                      )}

                      {/* Action buttons — Maps + Airbnb */}
                      <div className="flex gap-3">
                        {meta.maps_url && (
                          <a href={meta.maps_url} target="_blank" rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-gray-200 bg-white no-underline active:scale-95 transition-all">
                            <span className="text-xl">🗺️</span>
                            <div>
                              <p className="text-[12px] font-bold text-gray-800">Open Maps</p>
                              <p className="text-[10px] text-gray-400">Get directions</p>
                            </div>
                          </a>
                        )}
                        {(meta.airbnb_url || meta.airbnb) && (
                          <a href={meta.airbnb_url || 'https://www.airbnb.com'} target="_blank" rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl no-underline active:scale-95 transition-all"
                            style={{ background: '#FF5A5F' }}>
                            <span className="text-xl">🏠</span>
                            <div>
                              <p className="text-[12px] font-bold text-white">Airbnb</p>
                              <p className="text-[10px] text-white/70">View listing</p>
                            </div>
                          </a>
                        )}
                      </div>
                    </Sec>
                  )}

                  {/* Practical info */}
                  {(meta?.best_time || meta?.departure || meta?.website) && (
                    <Sec>
                      <SecTitle icon={<Info size={13} />} label="Practical info" color={typeColor} />
                      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        {meta.best_time && <MRow label="Best time" value={meta.best_time} />}
                        {meta.departure && <MRow label="Departures" value={meta.departure} />}
                        {!isStay && meta.address && <MRow label="Address" value={meta.address} />}
                        {meta.website && (
                          <div className="flex items-center justify-between px-4 py-3 bg-white">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Website</span>
                            <a href={`https://${meta.website}`} target="_blank" rel="noopener noreferrer"
                              className="text-[12px] font-semibold flex items-center gap-1" style={{ color: typeColor }}>
                              {meta.website} <ExternalLink size={11} />
                            </a>
                          </div>
                        )}
                      </div>
                    </Sec>
                  )}

                  {/* Accessibility */}
                  {(meta?.elderly_friendly || meta?.kid_friendly) && (
                    <Sec>
                      <SecTitle icon={<Users size={13} />} label="Who is it for?" color={typeColor} />
                      <div className="space-y-2">
                        {meta.elderly_friendly && <AccessRow emoji="👴" label="Grandparents" value={meta.elderly_friendly} />}
                        {meta.kid_friendly && <AccessRow emoji="👧" label="Mira" value={meta.kid_friendly} />}
                      </div>
                    </Sec>
                  )}
                </>
              )}
            </div>
          )}

          {/* ══ PHOTOS TAB ══ */}
          {tab === 'photos' && (
            <div className="pb-16">
              {photos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center gap-4">
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center" style={{ background: theme.light }}>
                    <Camera size={32} style={{ color: theme.mid }} />
                  </div>
                  <div>
                    <p className="text-[16px] font-semibold text-gray-800 mb-1">No photos yet</p>
                    <p className="text-[13px] text-gray-400 leading-relaxed max-w-[220px] mx-auto">
                      Tap the Photo button above to capture this memory
                    </p>
                  </div>
                  <label htmlFor="card-photo-upload"
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-[13px] text-white cursor-pointer active:scale-95 transition-all"
                    style={{ background: theme.gradient }}>
                    <Camera size={15} />{uploading ? 'Uploading…' : 'Add first photo'}
                  </label>
                </div>
              ) : (
                <div>
                  {/* Masonry-style grid */}
                  <div className="p-3 grid grid-cols-2 gap-2">
                    {photos.map((p, i) => (
                      <button
                        key={p.id}
                        onClick={() => setLightboxIdx(i)}
                        className="relative overflow-hidden rounded-2xl bg-gray-100 active:scale-[.97] transition-all"
                        style={{
                          // first photo spans full width, rest are 2-col
                          gridColumn: i === 0 ? 'span 2' : 'span 1',
                          height: i === 0 ? 220 : 130,
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.url} alt="" className="w-full h-full object-cover" />
                        {/* cover badge */}
                        {coverPhotoId === p.id && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white flex items-center gap-1"
                            style={{ background: typeColor }}>★ Cover</div>
                        )}
                        {!coverPhotoId && i === 0 && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                            style={{ background: 'rgba(0,0,0,0.4)' }}>Cover</div>
                        )}
                        {/* delete */}
                        <button
                          onClick={e => { e.stopPropagation(); deletePhoto(p.id, p.storage_path) }}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ background: 'rgba(0,0,0,0.5)' }}>
                          <X size={12} className="text-white" />
                        </button>
                      </button>
                    ))}

                    {/* Add more slot */}
                    {photos.length < 10 && (
                      <label
                        htmlFor="card-photo-upload"
                        className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 cursor-pointer active:bg-gray-50 transition-all"
                        style={{ height: 130, gridColumn: photos.length === 0 || photos.length % 2 === 0 ? 'span 2' : 'span 1' }}>
                        <Plus size={20} className="text-gray-300" />
                        <span className="text-[11px] text-gray-400 font-medium">{uploading ? 'Uploading…' : `Add photo (${10 - photos.length} left)`}</span>
                      </label>
                    )}
                  </div>

                  {/* Cover photo selector */}
                  {photos.length > 1 && (
                    <div className="mx-3 mb-3 bg-white rounded-2xl border border-gray-100 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Card display photo (cover)</p>
                      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        {photos.map((p, i) => {
                          const isCover = coverPhotoId ? coverPhotoId === p.id : i === 0
                          return (
                            <button
                              key={p.id}
                              onClick={() => setCoverPhotoId(p.id)}
                              className="relative flex-shrink-0 rounded-xl overflow-hidden transition-all"
                              style={{
                                width: 60, height: 60,
                                outline: isCover ? `3px solid ${typeColor}` : '3px solid transparent',
                                outlineOffset: 2,
                              }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={p.url} alt="" className="w-full h-full object-cover" />
                              {isCover && (
                                <div className="absolute inset-0 flex items-end justify-center pb-1" style={{ background: 'rgba(0,0,0,0.25)' }}>
                                  <span className="text-white text-[16px]">★</span>
                                </div>
                              )}
                            </button>
                          )
                        })}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-2">Tap a photo to set it as the card thumbnail on the home screen</p>
                    </div>
                  )}

                  <p className="text-center text-[11px] text-gray-400 pb-4">{photos.length}/10 photos · Tap to view full size</p>
                </div>
              )}
            </div>
          )}

          {/* ══ TRIVIA TAB ══ */}
          {tab === 'trivia' && (
            <div className="pb-16">
              {/* header row */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
                <div>
                  <p className="text-[13px] font-bold text-gray-800">Interesting facts</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Supports **bold**, *italic*, # headers, - bullets</p>
                </div>
                {editingTrivia ? (
                  <div className="flex gap-2">
                    <button onClick={() => setEditingTrivia(false)}
                      className="px-3 py-1.5 rounded-xl text-[11px] font-semibold border border-gray-200 text-gray-500 bg-gray-50">
                      Cancel
                    </button>
                    <button onClick={saveTrivia} disabled={savingTrivia}
                      className="px-3 py-1.5 rounded-xl text-[11px] font-semibold text-white disabled:opacity-50"
                      style={{ background: typeColor }}>
                      {savingTrivia ? 'Saving…' : 'Save'}
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setEditingTrivia(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold border border-gray-200 text-gray-600 bg-gray-50">
                    <Pencil size={11} />{trivia ? 'Edit' : 'Add trivia'}
                  </button>
                )}
              </div>

              {editingTrivia ? (
                <div className="px-4 py-4">
                  {/* format helper chips */}
                  <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
                    {[
                      { label: '# Header', insert: '# ' },
                      { label: '## Sub-header', insert: '## ' },
                      { label: '- Bullet', insert: '\n- ' },
                      { label: '**bold**', insert: '****' },
                      { label: '*italic*', insert: '**' },
                    ].map(f => (
                      <button key={f.label}
                        onClick={() => setTrivia(t => t + f.insert)}
                        className="flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-gray-200 text-gray-600 bg-white active:bg-gray-50">
                        {f.label}
                      </button>
                    ))}
                  </div>
                  <textarea
                    style={{ fontSize: 16 }}
                    className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none font-mono text-[13px]"
                    rows={14}
                    value={trivia}
                    onChange={e => setTrivia(e.target.value)}
                    placeholder={`# Vasa Museum\n\n- Built in 1626, sank on its maiden voyage in 1628\n- Salvaged in 1961 after 333 years under water\n- 95% of the original ship is preserved\n\n## Why did it sink?\n\n*The ship was too narrow and top-heavy*`}
                  />
                </div>
              ) : trivia ? (
                <div className="px-5 py-5">
                  {/* rendered trivia */}
                  <div className="prose-custom">
                    {renderTrivia(trivia)}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center gap-4">
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center" style={{ background: theme.light }}>
                    <BookOpen size={32} style={{ color: theme.mid }} />
                  </div>
                  <div>
                    <p className="text-[16px] font-semibold text-gray-800 mb-1">No trivia yet</p>
                    <p className="text-[13px] text-gray-400 leading-relaxed max-w-[240px] mx-auto">
                      Add interesting facts, history, or tips about this activity in formatted text
                    </p>
                  </div>
                  <button onClick={() => setEditingTrivia(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-[13px] text-white active:scale-95 transition-all"
                    style={{ background: theme.gradient }}>
                    <BookOpen size={15} /> Add trivia
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxIdx !== null && (
        <div className="fixed inset-0 bg-black flex flex-col" style={{ zIndex: 10000 }}
          onClick={() => setLightboxIdx(null)}>
          {/* top bar */}
          <div className="flex items-center justify-between px-4 flex-shrink-0"
            style={{ paddingTop: 'max(16px, env(safe-area-inset-top))', paddingBottom: 12 }}
            onClick={e => e.stopPropagation()}>
            <div>
              <p className="text-white font-semibold text-[14px]">{card.title}</p>
              <p className="text-white/50 text-[11px]">{(lightboxIdx ?? 0) + 1} of {photos.length}</p>
            </div>
            <button onClick={() => setLightboxIdx(null)}
              className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <X size={18} className="text-white" />
            </button>
          </div>

          {/* image */}
          <div className="flex-1 flex items-center justify-center relative" onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos[lightboxIdx ?? 0]?.url} alt="" className="max-w-full max-h-full object-contain" />
            {photos.length > 1 && (
              <>
                <button
                  onClick={() => setLightboxIdx(i => ((i ?? 0) - 1 + photos.length) % photos.length)}
                  className="absolute left-3 w-11 h-11 bg-white/15 rounded-full flex items-center justify-center active:bg-white/30">
                  <ChevronLeft size={22} className="text-white" />
                </button>
                <button
                  onClick={() => setLightboxIdx(i => ((i ?? 0) + 1) % photos.length)}
                  className="absolute right-3 w-11 h-11 bg-white/15 rounded-full flex items-center justify-center active:bg-white/30">
                  <ChevronRight size={22} className="text-white" />
                </button>
              </>
            )}
          </div>

          {/* dot strip + delete */}
          <div className="flex-shrink-0 pb-safe" onClick={e => e.stopPropagation()}>
            <div className="flex justify-center gap-1.5 py-3">
              {photos.map((_, i) => (
                <button key={i} onClick={() => setLightboxIdx(i)}
                  className={`rounded-full transition-all ${i === lightboxIdx ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/35'}`} />
              ))}
            </div>
            {/* delete from lightbox */}
            <div className="flex justify-center pb-6">
              <button
                onClick={() => {
                  const p = photos[lightboxIdx ?? 0]
                  if (p) deletePhoto(p.id, p.storage_path)
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold text-white"
                style={{ background: 'rgba(239,68,68,0.7)' }}>
                <Trash2 size={13} /> Delete photo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ── Palette ── */
const TAG_COLORS = [
  { background: '#EDE9FE', color: '#6D28D9' },
  { background: '#D1FAE5', color: '#065F46' },
  { background: '#DBEAFE', color: '#1E40AF' },
  { background: '#FCE7F3', color: '#9D174D' },
  { background: '#FEF3C7', color: '#92400E' },
  { background: '#CFFAFE', color: '#155E75' },
  { background: '#FFE4E6', color: '#9F1239' },
  { background: '#F0FDF4', color: '#166534' },
]

/* ── Layout helpers ── */
function Sec({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-4 border-b border-gray-100">{children}</div>
}
function SecTitle({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span style={{ color }}>{icon}</span>
      <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color }}>{label}</p>
    </div>
  )
}
function FactCell({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="flex-1 flex items-start gap-2 px-3 py-3">
      <span className="mt-0.5 flex-shrink-0" style={{ color }}>{icon}</span>
      <div className="min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
        <p className="text-[11px] font-semibold text-gray-800 leading-snug mt-0.5 line-clamp-2">{value}</p>
      </div>
    </div>
  )
}
function MRow({ label, value, mono, warn }: { label: string; value: string; mono?: boolean; warn?: boolean }) {
  return (
    <div className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-0 ${warn ? 'bg-amber-50' : 'bg-white'}`}>
      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex-shrink-0 pt-0.5 min-w-[80px]">{label}</span>
      <span className={`text-[13px] text-gray-700 flex-1 leading-snug ${mono ? 'font-mono font-bold tracking-widest' : 'font-medium'}`}>{value}</span>
    </div>
  )
}
function AccessRow({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3">
      <span className="text-base flex-shrink-0">{emoji}</span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
        <p className="text-[13px] text-gray-700">{value}</p>
      </div>
    </div>
  )
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block">{label}</label>
      {children}
    </div>
  )
}