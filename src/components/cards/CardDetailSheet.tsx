'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  ArrowLeft, Pencil, Check, Camera, Trash2, ExternalLink,
  X, Plus, ChevronLeft, ChevronRight, Clock, Train,
  Users, Lightbulb, Info, MapPin
} from 'lucide-react'
import { supabase, uploadPhoto, getPhotoUrl } from '@/lib/supabase'
import { DayCard, CountryTheme, CardStatus, DAY_META } from '@/types'

interface Props {
  card: DayCard
  theme: CountryTheme
  onClose: () => void
  onUpdated: () => void
}

export default function CardDetailSheet({ card, theme, onClose, onUpdated }: Props) {
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
    const { error } = await supabase
      .from('day_cards')
      .update({
        title: form.title,
        description: form.description,
        time_label: form.time_label,
        status: form.status,
        day_number: form.day_number,
        updated_at: new Date().toISOString(),
      })
      .eq('id', card.id)
    if (error) console.error('Save error', error)
    setSaving(false)
    setEditing(false)
    onUpdated()
    // If day changed, close the card — it now belongs to a different day
    if (form.day_number !== card.day_number) onClose()
  }

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    if (photos.length + files.length > 5) {
      setUploadError('Max 5 photos per card')
      return
    }
    setUploadError(null)
    setUploading(true)
    for (const file of files) {
      try {
        const path = await uploadPhoto(file, card.id)
        const url = getPhotoUrl(path)
        const { data, error } = await supabase
          .from('card_photos')
          .insert({ card_id: card.id, storage_path: path })
          .select()
          .single()
        if (error) throw error
        setPhotos(prev => [...prev, { ...data, url }])
      } catch (err) {
        console.error('Upload error:', err)
        setUploadError('Upload failed — check storage bucket is public')
      }
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
    onUpdated()
  }, [card.id, photos.length, onUpdated])

  async function deletePhoto(id: string, path: string) {
    await supabase.storage.from('trip-photos').remove([path])
    await supabase.from('card_photos').delete().eq('id', id)
    setPhotos(prev => prev.filter(p => p.id !== id))
    if (lightboxIdx !== null) setLightboxIdx(null)
    onUpdated()
  }

  return (
    <>
      {/* ── Full screen page ── */}
      <div
        className="card-page-enter flex flex-col"
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: '#f8f9fb',
          overscrollBehavior: 'none',
        }}
      >
        {/* ── Sticky header bar ── */}
        <div
          className="flex-shrink-0 flex items-center gap-3 px-4 bg-white border-b border-gray-100"
          style={{
            paddingTop: 'max(12px, env(safe-area-inset-top))',
            paddingBottom: 12,
          }}
        >
          {/* Back button — large tap target */}
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-700 active:opacity-60 transition-opacity"
            style={{ minWidth: 44, minHeight: 44, marginLeft: -8, paddingLeft: 8 }}
          >
            <ArrowLeft size={20} strokeWidth={2} />
            <span className="text-[14px] font-semibold">Back</span>
          </button>

          <div className="flex-1" />

          {/* Upload photo button */}
          <button
            onPointerDown={e => { e.stopPropagation(); e.preventDefault(); fileRef.current?.click() }}
            disabled={uploading || photos.length >= 5}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold border border-gray-200 bg-gray-50 text-gray-700 active:bg-gray-100 transition-all disabled:opacity-40"
          >
            <Camera size={14} style={{ color: typeColor }} />
            {uploading ? 'Uploading…' : 'Photo'}
          </button>

          {/* Edit / Save button */}
          {editing ? (
            <button
              onClick={saveEdit}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold text-white active:opacity-80 transition-all disabled:opacity-50"
              style={{ background: typeColor }}
            >
              <Check size={14} />
              {saving ? 'Saving…' : 'Save'}
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="w-9 h-9 rounded-xl flex items-center justify-center border border-gray-200 bg-gray-50 active:bg-gray-100 transition-all"
            >
              <Pencil size={15} className="text-gray-500" />
            </button>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
        />

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>

          {/* Hero colour band */}
          <div
            className="relative px-5 py-6"
            style={{ background: theme.gradient, minHeight: 120 }}
          >
            <div className="absolute inset-0 opacity-5"
              style={{ backgroundImage: theme.pattern }} />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                  {card.type}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                  Day {card.day_number} · {DAY_META[card.day_number - 1]?.weekday} {DAY_META[card.day_number - 1]?.date}
                </span>
              </div>
              <h1 className="font-serif text-[26px] font-light text-white leading-tight">
                {card.title}
              </h1>
              {card.time_label && (
                <p className="text-[13px] text-white/70 mt-1 flex items-center gap-1.5">
                  <span className="opacity-60">🕐</span> {card.time_label}
                </p>
              )}
            </div>
          </div>

          {/* upload error */}
          {uploadError && (
            <div className="mx-4 mt-3 flex items-center justify-between px-3 py-2 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-[12px] text-red-600 font-medium">{uploadError}</p>
              <button onClick={() => setUploadError(null)}>
                <X size={14} className="text-red-400" />
              </button>
            </div>
          )}

          {editing ? (
            /* ── Edit form ── */
            <div className="px-4 py-5 space-y-4">
              <Field label="Title">
                <input
                  style={{ fontSize: 16 }}
                  className="input"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Title"
                />
              </Field>
              <Field label="Description">
                <textarea
                  style={{ fontSize: 16 }}
                  className="input resize-none"
                  rows={5}
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Description"
                />
              </Field>
              <Field label="Time">
                <input
                  style={{ fontSize: 16 }}
                  className="input"
                  value={form.time_label}
                  onChange={e => setForm(f => ({ ...f, time_label: e.target.value }))}
                  placeholder="e.g. 9am, Morning, 14:25"
                />
              </Field>
              <Field label="Day">
                <select
                  style={{ fontSize: 16 }}
                  className="input appearance-none"
                  value={form.day_number}
                  onChange={e => setForm(f => ({ ...f, day_number: Number(e.target.value) }))}
                >
                  {DAY_META.map(d => (
                    <option key={d.day} value={d.day}>
                      Day {d.day} · {d.weekday} {d.date} · {d.city}
                    </option>
                  ))}
                </select>
                {form.day_number !== card.day_number && (
                  <p className="text-[11px] text-amber-600 font-medium mt-1.5 flex items-center gap-1">
                    ⚠️ Card will move to Day {form.day_number} on save
                  </p>
                )}
              </Field>
              <Field label="Status">
                <div className="flex gap-2">
                  {(['upcoming', 'now', 'done'] as CardStatus[]).map(s => (
                    <button
                      key={s}
                      onClick={() => setForm(f => ({ ...f, status: s }))}
                      className="flex-1 py-2.5 rounded-xl text-[12px] font-bold capitalize border transition-all"
                      style={form.status === s
                        ? { background: typeColor, color: '#fff', borderColor: typeColor }
                        : { background: '#f9fafb', color: '#6b7280', borderColor: '#e5e7eb' }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          ) : (
            /* ── View mode ── */
            <div className="pb-12">

              {/* Description */}
              {card.description && (
                <Section>
                  <p className="text-[14px] text-gray-700 leading-relaxed">{card.description}</p>
                </Section>
              )}

              {/* Quick facts row */}
              {(meta?.duration || meta?.nearest_station || meta?.cost) && (
                <div className="flex border-b border-gray-100 bg-white divide-x divide-gray-100">
                  {meta?.duration && (
                    <FactCell icon={<Clock size={12} />} label="Duration" value={meta.duration} color={typeColor} />
                  )}
                  {meta?.nearest_station && (
                    <FactCell icon={<Train size={12} />} label="Getting there" value={meta.nearest_station} color={typeColor} />
                  )}
                  {meta?.cost && (
                    <FactCell icon={<Info size={12} />} label="Cost" value={meta.cost} color={typeColor} />
                  )}
                </div>
              )}

              {/* Transport route block */}
              {isTransport && meta && (meta.dep || meta.arr) && (
                <Section>
                  <SectionTitle icon={<Train size={13} />} label="Route" color={typeColor} />
                  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    {(meta.dep || meta.arr) && (
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
                    )}
                    {meta.via && <MRow label="Via" value={meta.via} />}
                    {meta.duration && <MRow label="Duration" value={meta.duration} />}
                    {meta.op && <MRow label="Operator" value={meta.op} />}
                    {meta.num && <MRow label="Service" value={meta.num} />}
                    {meta.carriage && <MRow label="Carriage" value={meta.carriage} />}
                    {meta.terminal && <MRow label="Terminal" value={meta.terminal} />}
                    {meta.ref && <MRow label="Booking ref" value={meta.ref} mono />}
                    <div className="px-4 py-3 flex items-center gap-2 bg-emerald-50 border-t border-emerald-100">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <p className="text-[12px] font-semibold text-emerald-700">All 5 passengers confirmed</p>
                    </div>
                  </div>
                </Section>
              )}

              {/* What to expect */}
              {meta?.what_to_expect && (
                <Section>
                  <SectionTitle icon={<Info size={13} />} label="What to expect" color={typeColor} />
                  <p className="text-[13.5px] text-gray-600 leading-relaxed">{meta.what_to_expect}</p>
                </Section>
              )}

              {/* Insider tip */}
              {meta?.tip && (
                <Section>
                  <div className="rounded-2xl p-4 flex gap-3" style={{ background: theme.light }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: theme.mid }}>
                      <Lightbulb size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: theme.mid }}>
                        Insider tip
                      </p>
                      <p className="text-[13px] leading-relaxed" style={{ color: theme.dark }}>{meta.tip}</p>
                    </div>
                  </div>
                </Section>
              )}

              {/* Tags */}
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

              {/* Stay details */}
              {isStay && meta && (
                <Section>
                  <SectionTitle icon={<MapPin size={13} />} label="Stay details" color={typeColor} />
                  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    {meta.host && <MRow label="Host" value={meta.host} />}
                    {meta.address && <MRow label="Address" value={meta.address} />}
                    {meta.checkIn && <MRow label="Check-in" value={meta.checkIn} />}
                    {meta.checkOut && <MRow label="Check-out" value={meta.checkOut} />}
                    {meta.nights && <MRow label="Nights" value={meta.nights} />}
                    {meta.nearest_station && <MRow label="Nearest stop" value={meta.nearest_station} />}
                    {meta.note && <MRow label="Note" value={meta.note} warn />}
                    {meta.alert && (
                      <div className="px-4 py-3 bg-red-50 border-t border-red-100">
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

              {/* Practical info */}
              {(meta?.best_time || meta?.departure || meta?.address || meta?.website) && (
                <Section>
                  <SectionTitle icon={<Info size={13} />} label="Practical info" color={typeColor} />
                  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    {meta.best_time && <MRow label="Best time" value={meta.best_time} />}
                    {meta.departure && <MRow label="Departures" value={meta.departure} />}
                    {!isStay && meta.address && <MRow label="Address" value={meta.address} />}
                    {meta.website && (
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0 bg-white">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Website</span>
                        <a href={`https://${meta.website}`} target="_blank" rel="noopener noreferrer"
                          className="text-[12px] font-semibold flex items-center gap-1"
                          style={{ color: typeColor }}>
                          {meta.website} <ExternalLink size={11} />
                        </a>
                      </div>
                    )}
                  </div>
                </Section>
              )}

              {/* Accessibility */}
              {(meta?.elderly_friendly || meta?.kid_friendly) && (
                <Section>
                  <SectionTitle icon={<Users size={13} />} label="Who is it for?" color={typeColor} />
                  <div className="space-y-2">
                    {meta.elderly_friendly && (
                      <AccessRow emoji="👴" label="Grandparents" value={meta.elderly_friendly} />
                    )}
                    {meta.kid_friendly && (
                      <AccessRow emoji="👧" label="Mira" value={meta.kid_friendly} />
                    )}
                  </div>
                </Section>
              )}

              {/* ── Photos section — inline, no tab ── */}
              <Section>
                <div className="flex items-center justify-between mb-3">
                  <SectionTitle icon={<Camera size={13} />} label={`Photos ${photos.length > 0 ? `(${photos.length}/5)` : ''}`} color={typeColor} />
                  {photos.length < 5 && (
                    <button
                      onPointerDown={e => { e.stopPropagation(); e.preventDefault(); fileRef.current?.click() }}
                      disabled={uploading}
                      className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600 bg-white active:bg-gray-50 disabled:opacity-40 transition-all"
                    >
                      <Plus size={11} />
                      {uploading ? 'Uploading…' : 'Add'}
                    </button>
                  )}
                </div>

                {photos.length === 0 ? (
                  <button
                    onPointerDown={e => { e.stopPropagation(); e.preventDefault(); fileRef.current?.click() }}
                    disabled={uploading}
                    className="w-full flex flex-col items-center justify-center gap-3 py-10 rounded-2xl border-2 border-dashed border-gray-200 active:bg-gray-50 transition-all disabled:opacity-50"
                  >
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ background: theme.light }}>
                      <Camera size={22} style={{ color: theme.mid }} />
                    </div>
                    <div className="text-center">
                      <p className="text-[13px] font-semibold text-gray-600">
                        {uploading ? 'Uploading…' : 'Add photos from this visit'}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Up to 5 photos per card</p>
                    </div>
                  </button>
                ) : (
                  <div className="space-y-2">
                    {/* Main large photo */}
                    <div className="relative rounded-2xl overflow-hidden bg-gray-100" style={{ height: 220 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photos[0].url} alt=""
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setLightboxIdx(0)}
                      />
                      <button
                        onClick={() => deletePhoto(photos[0].id, photos[0].storage_path)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(0,0,0,0.5)' }}
                      >
                        <Trash2 size={13} className="text-white" />
                      </button>
                      <button
                        onClick={() => setLightboxIdx(0)}
                        className="absolute bottom-3 right-3 text-white text-[10px] font-bold px-2 py-1 rounded-lg"
                        style={{ background: 'rgba(0,0,0,0.4)' }}
                      >
                        View full
                      </button>
                    </div>

                    {/* Thumbnails */}
                    {photos.length > 1 && (
                      <div className="flex gap-2">
                        {photos.slice(1).map((p, i) => (
                          <div key={p.id} className="relative flex-1 rounded-xl overflow-hidden bg-gray-100"
                            style={{ height: 80 }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={p.url} alt=""
                              className="w-full h-full object-cover cursor-pointer"
                              onClick={() => setLightboxIdx(i + 1)}
                            />
                            <button
                              onClick={() => deletePhoto(p.id, p.storage_path)}
                              className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center"
                              style={{ background: 'rgba(0,0,0,0.5)' }}
                            >
                              <X size={10} className="text-white" />
                            </button>
                          </div>
                        ))}
                        {photos.length < 5 && (
                          <button
                            onPointerDown={e => { e.stopPropagation(); e.preventDefault(); fileRef.current?.click() }}
                            className="flex-1 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 active:bg-gray-50 transition-all"
                            style={{ height: 80 }}>
                            <Plus size={16} className="text-gray-300" />
                            <span className="text-[10px] text-gray-300 font-medium">Add</span>
                          </button>
                        )}
                      </div>
                    )}

                    {photos.length === 1 && photos.length < 5 && (
                      <button
                        onPointerDown={e => { e.stopPropagation(); e.preventDefault(); fileRef.current?.click() }}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 active:bg-gray-50 transition-all"
                      >
                        <Camera size={14} />
                        <span className="text-[12px] font-medium">Add more photos ({5 - photos.length} remaining)</span>
                      </button>
                    )}
                  </div>
                )}
              </Section>
            </div>
          )}
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 bg-black flex flex-col"
          style={{ zIndex: 10000 }}
          onClick={() => setLightboxIdx(null)}
        >
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}
            onClick={e => e.stopPropagation()}
          >
            <div>
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
                <button
                  onClick={() => setLightboxIdx(i => ((i ?? 0) - 1 + photos.length) % photos.length)}
                  className="absolute left-4 w-10 h-10 bg-white/15 rounded-full flex items-center justify-center">
                  <ChevronLeft size={20} className="text-white" />
                </button>
                <button
                  onClick={() => setLightboxIdx(i => ((i ?? 0) + 1) % photos.length)}
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

/* ── Small helpers ── */
function Section({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-4 border-b border-gray-100">{children}</div>
}

function SectionTitle({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
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