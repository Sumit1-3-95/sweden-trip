'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  ArrowLeft, Pencil, Check, Camera, Trash2, ExternalLink,
  X, Plus, ChevronLeft, ChevronRight, Clock, MapPin,
  Train, Users, Lightbulb, Star, Info
} from 'lucide-react'
import { supabase, uploadPhoto, getPhotoUrl } from '@/lib/supabase'
import { DayCard, CountryTheme, CardStatus } from '@/types'

interface Props {
  card: DayCard
  theme: CountryTheme
  onClose: () => void
  onUpdated: () => void
}

type Tab = 'details' | 'photos'

export default function CardDetailSheet({ card, theme, onClose, onUpdated }: Props) {
  const [tab, setTab] = useState<Tab>('details')
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    title: card.title,
    description: card.description || '',
    time_label: card.time_label || '',
    status: card.status,
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const [photos, setPhotos] = useState(
    (card.photos || []).map(p => ({ ...p, url: p.url || getPhotoUrl(p.storage_path) }))
  )
  const fileRef = useRef<HTMLInputElement>(null)
  const meta = card.metadata as Record<string, string> | null

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') lightboxIdx !== null ? setLightboxIdx(null) : onClose()
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [lightboxIdx, onClose])

  async function saveEdit() {
    setSaving(true)
    await supabase.from('day_cards').update({ ...form, updated_at: new Date().toISOString() }).eq('id', card.id)
    setSaving(false)
    setEditing(false)
    onUpdated()
  }

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    if (photos.length + files.length > 5) { setUploadError('Max 5 photos per card'); return }
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
        setUploadError('Upload failed — check Supabase storage bucket is set to public')
      }
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
    onUpdated()
    setTab('photos')
  }, [card.id, photos.length, onUpdated])

  async function deletePhoto(id: string, path: string) {
    await supabase.storage.from('trip-photos').remove([path])
    await supabase.from('card_photos').delete().eq('id', id)
    setPhotos(prev => prev.filter(p => p.id !== id))
    setLightboxIdx(null)
    onUpdated()
  }

  const isTransport = card.type === 'transport'
  const isAlert = card.type === 'alert'
  const isStay = card.type === 'stay'

  // colour for card type
  const typeColor = isAlert ? '#ef4444' : isTransport ? '#3b82f6' : isStay ? '#f59e0b' : theme.mid

  return (
    <>
      {/* ── Full-page card ── */}
      <div
        className="flex flex-col bg-gray-50 card-page-enter"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          overscrollBehavior: 'none',
        }}
      >
        {/* ── Top hero area ── */}
        <div className="flex-shrink-0 relative overflow-hidden" style={{ minHeight: 180, background: theme.gradient }}>
          {/* pattern */}
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: theme.pattern }} />

          {/* back button */}
          <button
            onClick={onClose}
            className="absolute top-0 left-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{ marginTop: 'max(12px, env(safe-area-inset-top))', background: 'rgba(255,255,255,0.2)' }}
          >
            <ArrowLeft size={18} className="text-white" />
          </button>

          {/* action buttons */}
          <div className="absolute right-4 z-10 flex gap-2"
            style={{ top: 'max(12px, env(safe-area-inset-top))' }}>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading || photos.length >= 5}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all active:scale-95 disabled:opacity-40"
              style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', backdropFilter: 'blur(8px)' }}
            >
              <Camera size={13} />{uploading ? 'Uploading…' : 'Photo'}
            </button>
            {editing ? (
              <button onClick={saveEdit} disabled={saving}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold text-white transition-all active:scale-95"
                style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
                <Check size={13} />{saving ? 'Saving…' : 'Save'}
              </button>
            ) : (
              <button onClick={() => setEditing(true)}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
                style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
                <Pencil size={15} className="text-white" />
              </button>
            )}
          </div>

          {/* hero content */}
          <div className="relative z-10 px-5 pb-5 flex flex-col justify-end" style={{ paddingTop: 'max(56px, calc(env(safe-area-inset-top) + 44px))' }}>
            {/* type badge */}
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                {card.type} · Day {card.day_number}
              </span>
              {card.status === 'done' && (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-white">Done ✓</span>
              )}
              {card.status === 'now' && (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: 'rgba(255,255,255,0.25)', color: '#fff' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />Now
                </span>
              )}
            </div>
            <h1 className="font-serif text-[26px] font-light text-white leading-tight mb-1">{card.title}</h1>
            {card.time_label && (
              <p className="text-[13px] text-white/70 font-medium">{card.time_label}</p>
            )}
          </div>

          {/* photo preview strip on hero — if photos exist */}
          {photos.length > 0 && !editing && (
            <div className="absolute right-4 bottom-4 flex gap-2 z-10">
              {photos.slice(0, 3).map((p, i) => (
                <button key={p.id} onClick={() => { setTab('photos'); setLightboxIdx(i) }}
                  className="rounded-xl overflow-hidden border-2 border-white/40"
                  style={{ width: 44, height: 44 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
              {photos.length > 3 && (
                <button onClick={() => setTab('photos')}
                  className="rounded-xl border-2 border-white/40 flex items-center justify-center text-white text-[11px] font-bold"
                  style={{ width: 44, height: 44, background: 'rgba(0,0,0,0.4)' }}>
                  +{photos.length - 3}
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Quick facts strip ── */}
        {!editing && (meta?.duration || meta?.nearest_station || meta?.cost) && (
          <div className="flex-shrink-0 bg-white border-b border-gray-100">
            <div className="flex divide-x divide-gray-100">
              {meta.duration && (
                <div className="flex-1 px-3 py-2.5 flex items-center gap-2">
                  <Clock size={13} style={{ color: typeColor }} className="flex-shrink-0" />
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Duration</p>
                    <p className="text-[11px] font-semibold text-gray-800 leading-tight">{meta.duration}</p>
                  </div>
                </div>
              )}
              {meta.nearest_station && (
                <div className="flex-1 px-3 py-2.5 flex items-center gap-2">
                  <Train size={13} style={{ color: typeColor }} className="flex-shrink-0" />
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Getting there</p>
                    <p className="text-[11px] font-semibold text-gray-800 leading-tight line-clamp-2">{meta.nearest_station}</p>
                  </div>
                </div>
              )}
              {meta.cost && (
                <div className="flex-1 px-3 py-2.5 flex items-center gap-2">
                  <Star size={13} style={{ color: typeColor }} className="flex-shrink-0" />
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Cost</p>
                    <p className="text-[11px] font-semibold text-gray-800 leading-tight">{meta.cost}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Tab bar ── */}
        <div className="flex-shrink-0 bg-white border-b border-gray-100 flex px-4">
          {(['details', 'photos'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="relative py-3 px-4 text-[13px] font-semibold capitalize transition-all"
              style={{ color: tab === t ? typeColor : '#9ca3af' }}>
              {t}
              {t === 'photos' && photos.length > 0 && (
                <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: theme.light, color: theme.mid }}>
                  {photos.length}
                </span>
              )}
              {tab === t && (
                <div className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full" style={{ background: typeColor }} />
              )}
            </button>
          ))}
        </div>

        {/* upload error */}
        {uploadError && (
          <div className="flex-shrink-0 mx-4 mt-2 px-3 py-2 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
            <p className="text-[12px] text-red-600 font-medium">{uploadError}</p>
            <button onClick={() => setUploadError(null)}><X size={14} className="text-red-400" /></button>
          </div>
        )}

        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>

          {/* ══ DETAILS TAB ══════════════════════════════════ */}
          {tab === 'details' && (
            <div className="pb-12">
              {editing ? (
                /* Edit form */
                <div className="px-5 py-5 space-y-4">
                  <Field label="Title">
                    <input style={{ fontSize: 16 }} className="input" value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Title" />
                  </Field>
                  <Field label="Description">
                    <textarea style={{ fontSize: 16 }} className="input resize-none" rows={4}
                      value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" />
                  </Field>
                  <Field label="Time">
                    <input style={{ fontSize: 16 }} className="input" value={form.time_label}
                      onChange={e => setForm(f => ({ ...f, time_label: e.target.value }))} placeholder="e.g. 9am, Morning, 14:25" />
                  </Field>
                  <Field label="Status">
                    <div className="flex gap-2">
                      {(['upcoming', 'now', 'done'] as CardStatus[]).map(s => (
                        <button key={s} onClick={() => setForm(f => ({ ...f, status: s }))}
                          className="flex-1 py-2.5 rounded-xl text-[12px] font-bold capitalize border transition-all"
                          style={form.status === s
                            ? { background: typeColor, color: '#fff', borderColor: typeColor }
                            : { background: '#f9fafb', color: '#6b7280', borderColor: '#e5e7eb' }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>
              ) : (
                <>
                  {/* ── Description section ── */}
                  {card.description && (
                    <Section>
                      <p className="text-[14px] text-gray-700 leading-relaxed">{card.description}</p>
                    </Section>
                  )}

                  {/* ── Transport special layout ── */}
                  {isTransport && meta && (meta.dep || meta.arr) && (
                    <Section>
                      <SectionTitle icon={<Train size={14} />} label="Route" color={typeColor} />
                      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="flex items-center px-4 py-4 gap-3 bg-gray-50">
                          <div>
                            <p className="text-[26px] font-bold text-gray-900 tabular-nums leading-none">{meta.dep}</p>
                            <p className="text-[12px] text-gray-500 mt-1">{meta.from}</p>
                          </div>
                          <div className="flex-1 flex items-center gap-2 px-3">
                            <div className="flex-1 border-t-2 border-dashed border-gray-200" />
                            <span className="text-xl text-gray-300">›</span>
                          </div>
                          <div className="text-right">
                            <p className="text-[26px] font-bold text-gray-900 tabular-nums leading-none">{meta.arr}</p>
                            <p className="text-[12px] text-gray-500 mt-1">{meta.to}</p>
                          </div>
                        </div>
                        {meta.via && <MetaRow label="Via" value={meta.via} />}
                        {meta.duration && <MetaRow label="Duration" value={meta.duration} />}
                        {meta.op && <MetaRow label="Operator" value={meta.op} />}
                        {meta.num && <MetaRow label="Service" value={meta.num} />}
                        {meta.carriage && <MetaRow label="Carriage" value={meta.carriage} />}
                        {meta.terminal && <MetaRow label="Terminal" value={meta.terminal} />}
                        {meta.ref && <MetaRow label="Booking ref" value={meta.ref} mono />}
                        <div className="px-4 py-3 flex items-center gap-2 bg-emerald-50 border-t border-emerald-100">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                          <p className="text-[12px] font-semibold text-emerald-700">All 5 passengers confirmed</p>
                        </div>
                      </div>
                    </Section>
                  )}

                  {/* ── What to expect ── */}
                  {meta?.what_to_expect && (
                    <Section>
                      <SectionTitle icon={<Info size={14} />} label="What to expect" color={typeColor} />
                      <p className="text-[13.5px] text-gray-600 leading-relaxed">{meta.what_to_expect}</p>
                    </Section>
                  )}

                  {/* ── Insider tip ── */}
                  {meta?.tip && (
                    <Section noBorder>
                      <div className="rounded-xl p-4" style={{ background: theme.light }}>
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: theme.mid }}>
                            <Lightbulb size={13} className="text-white" />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: theme.mid }}>Insider tip</p>
                            <p className="text-[13px] leading-relaxed" style={{ color: theme.dark }}>{meta.tip}</p>
                          </div>
                        </div>
                      </div>
                    </Section>
                  )}

                  {/* ── Tags ── */}
                  {card.tags?.length > 0 && (
                    <Section>
                      <div className="flex flex-wrap gap-2">
                        {card.tags.map(t => (
                          <span key={t} className="text-[11px] font-medium px-2.5 py-1 rounded-lg border bg-white border-gray-100 text-gray-600">
                            {t}
                          </span>
                        ))}
                      </div>
                    </Section>
                  )}

                  {/* ── Practical info grid ── */}
                  {(meta?.best_time || meta?.elderly_friendly || meta?.kid_friendly || meta?.website || meta?.departure) && (
                    <Section>
                      <SectionTitle icon={<Info size={14} />} label="Practical info" color={typeColor} />
                      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        {meta.best_time && <MetaRow label="Best time" value={meta.best_time} />}
                        {meta.departure && <MetaRow label="Departures" value={meta.departure} />}
                        {meta.address && <MetaRow label="Address" value={meta.address} />}
                        {meta.elderly_friendly && <MetaRow label="Elderly access" value={meta.elderly_friendly} />}
                        {meta.kid_friendly && <MetaRow label="Kids" value={meta.kid_friendly} />}
                        {meta.website && (
                          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Website</span>
                            <a href={`https://${meta.website}`} target="_blank" rel="noopener noreferrer"
                              className="text-[12px] font-semibold flex items-center gap-1" style={{ color: typeColor }}>
                              {meta.website}<ExternalLink size={11} />
                            </a>
                          </div>
                        )}
                      </div>
                    </Section>
                  )}

                  {/* ── Stay details ── */}
                  {isStay && meta && (
                    <Section>
                      <SectionTitle icon={<MapPin size={14} />} label="Stay details" color={typeColor} />
                      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        {meta.host && <MetaRow label="Host" value={meta.host} />}
                        {meta.address && <MetaRow label="Address" value={meta.address} />}
                        {meta.checkIn && <MetaRow label="Check-in" value={meta.checkIn} />}
                        {meta.checkOut && <MetaRow label="Check-out" value={meta.checkOut} />}
                        {meta.nights && <MetaRow label="Nights" value={meta.nights} />}
                        {meta.nearest_station && <MetaRow label="Nearest stop" value={meta.nearest_station} />}
                        {meta.note && <MetaRow label="Note" value={meta.note} warn />}
                        {meta.alert && (
                          <div className="bg-red-50 border-t border-red-100 px-4 py-3">
                            <p className="text-[12px] text-red-700 font-medium leading-relaxed">{meta.alert}</p>
                          </div>
                        )}
                        {meta.airbnb && (
                          <a href="https://www.airbnb.com" target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 px-4 py-3 border-t border-gray-50 bg-white no-underline">
                            <div className="w-7 h-7 bg-[#FF5A5F] rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-[10px] font-bold">A</span>
                            </div>
                            <span className="text-[13px] font-semibold text-orange-700 flex-1">Open in Airbnb</span>
                            <ExternalLink size={14} className="text-orange-400" />
                          </a>
                        )}
                      </div>
                    </Section>
                  )}

                  {/* ── Accessibility ── */}
                  {(meta?.elderly_friendly || meta?.kid_friendly) && (
                    <Section>
                      <SectionTitle icon={<Users size={14} />} label="Who is it for?" color={typeColor} />
                      <div className="space-y-2">
                        {meta.elderly_friendly && (
                          <div className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3">
                            <span className="text-base flex-shrink-0">👴</span>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Grandparents</p>
                              <p className="text-[13px] text-gray-700">{meta.elderly_friendly}</p>
                            </div>
                          </div>
                        )}
                        {meta.kid_friendly && (
                          <div className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3">
                            <span className="text-base flex-shrink-0">👧</span>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Mira</p>
                              <p className="text-[13px] text-gray-700">{meta.kid_friendly}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </Section>
                  )}

                  {/* ── Add photo nudge if no photos ── */}
                  {photos.length === 0 && (
                    <Section noBorder>
                      <button onClick={() => fileRef.current?.click()}
                        className="w-full flex flex-col items-center justify-center gap-2.5 py-10 rounded-2xl border-2 border-dashed border-gray-200 active:scale-98 transition-all">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: theme.light }}>
                          <Camera size={22} style={{ color: theme.mid }} />
                        </div>
                        <div className="text-center">
                          <p className="text-[13px] font-semibold text-gray-600">Add photos from this visit</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">Up to 5 photos per card</p>
                        </div>
                      </button>
                    </Section>
                  )}
                </>
              )}
            </div>
          )}

          {/* ══ PHOTOS TAB ═══════════════════════════════════ */}
          {tab === 'photos' && (
            <div className="px-4 py-5 pb-12">
              {photos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center" style={{ background: theme.light }}>
                    <Camera size={32} style={{ color: theme.mid }} />
                  </div>
                  <div>
                    <p className="text-[16px] font-semibold text-gray-800 mb-1">No photos yet</p>
                    <p className="text-[13px] text-gray-400 max-w-[220px] mx-auto leading-relaxed">
                      Tap the Photo button above to capture this memory
                    </p>
                  </div>
                  <button onClick={() => fileRef.current?.click()} disabled={uploading}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[13px] text-white active:scale-95 transition-all"
                    style={{ background: theme.gradient }}>
                    <Camera size={15} />{uploading ? 'Uploading…' : 'Add first photo'}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Large main photo */}
                  <div className="relative rounded-2xl overflow-hidden bg-gray-100" style={{ height: 260 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photos[0].url} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => setLightboxIdx(0)}
                      className="absolute inset-0 flex items-end justify-end p-3">
                      <span className="text-white text-[11px] font-bold px-2.5 py-1 rounded-lg"
                        style={{ background: 'rgba(0,0,0,0.45)' }}>View full</span>
                    </button>
                    <button onClick={() => deletePhoto(photos[0].id, photos[0].storage_path)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(0,0,0,0.5)' }}>
                      <Trash2 size={15} className="text-white" />
                    </button>
                  </div>

                  {/* Thumbnail row */}
                  {photos.length > 1 && (
                    <div className="flex gap-2">
                      {photos.slice(1).map((p, i) => (
                        <div key={p.id} className="relative rounded-xl overflow-hidden bg-gray-100 flex-1"
                          style={{ height: 88 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.url} alt="" className="w-full h-full object-cover"
                            onClick={() => setLightboxIdx(i + 1)} />
                          <button onClick={() => deletePhoto(p.id, p.storage_path)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ background: 'rgba(0,0,0,0.5)' }}>
                            <X size={10} className="text-white" />
                          </button>
                        </div>
                      ))}
                      {photos.length < 5 && (
                        <button onClick={() => fileRef.current?.click()}
                          className="flex-1 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all"
                          style={{ height: 88 }}>
                          <Plus size={18} className="text-gray-300" />
                          <span className="text-[10px] text-gray-300 font-medium">Add</span>
                        </button>
                      )}
                    </div>
                  )}

                  {photos.length === 1 && photos.length < 5 && (
                    <button onClick={() => fileRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 active:scale-95 transition-all">
                      <Camera size={15} />
                      <span className="text-[12px] font-medium">Add more photos ({5 - photos.length} remaining)</span>
                    </button>
                  )}

                  <p className="text-[11px] text-gray-400 text-center">{photos.length}/5 · Tap × to remove</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxIdx !== null && (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col" onClick={() => setLightboxIdx(null)}>
          <div className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ paddingTop: 'max(12px,env(safe-area-inset-top))' }}>
            <div onClick={e => e.stopPropagation()}>
              <p className="text-white font-semibold text-[14px]">{card.title}</p>
              <p className="text-white/50 text-[11px]">{lightboxIdx + 1} of {photos.length}</p>
            </div>
            <button onClick={() => setLightboxIdx(null)}
              className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <X size={18} className="text-white" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center relative" onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos[lightboxIdx]?.url} alt="" className="max-w-full max-h-full object-contain" />
            {photos.length > 1 && (
              <>
                <button onClick={() => setLightboxIdx(i => ((i ?? 0) - 1 + photos.length) % photos.length)}
                  className="absolute left-4 w-10 h-10 bg-white/15 rounded-full flex items-center justify-center">
                  <ChevronLeft size={20} className="text-white" />
                </button>
                <button onClick={() => setLightboxIdx(i => ((i ?? 0) + 1) % photos.length)}
                  className="absolute right-4 w-10 h-10 bg-white/15 rounded-full flex items-center justify-center">
                  <ChevronRight size={20} className="text-white" />
                </button>
              </>
            )}
          </div>
          <div className="flex justify-center gap-1.5 py-5 flex-shrink-0" onClick={e => e.stopPropagation()}>
            {photos.map((_, i) => (
              <button key={i} onClick={() => setLightboxIdx(i)}
                className={`rounded-full transition-all ${i === lightboxIdx ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/30'}`} />
            ))}
          </div>
        </div>
      )}
    </>
  )
}

/* ── Helpers ── */
function Section({ children, noBorder }: { children: React.ReactNode; noBorder?: boolean }) {
  return (
    <div className={`px-5 py-4 ${!noBorder ? 'border-b border-gray-100' : ''}`}>
      {children}
    </div>
  )
}

function SectionTitle({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-5 h-5 flex items-center justify-center" style={{ color }}>{icon}</div>
      <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color }}>{label}</p>
    </div>
  )
}

function MetaRow({ label, value, mono, warn }: { label: string; value: string; mono?: boolean; warn?: boolean }) {
  return (
    <div className={`flex items-start gap-4 px-4 py-3 border-b border-gray-50 last:border-0 ${warn ? 'bg-amber-50' : 'bg-white'}`}>
      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex-shrink-0 pt-0.5 min-w-[72px]">
        {label}
      </span>
      <span className={`text-[13px] text-gray-700 flex-1 leading-snug ${mono ? 'font-mono font-bold tracking-widest' : 'font-medium'}`}>
        {value}
      </span>
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