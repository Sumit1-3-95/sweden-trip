'use client'
import { useState, useEffect } from 'react'
import { Camera, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase, getPhotoUrl } from '@/lib/supabase'
import { DAY_META, COUNTRY_THEMES } from '@/types'

interface Photo {
  id: string
  card_id: string
  storage_path: string
  url: string
  created_at: string
  card?: { title: string; day_number: number; type: string }
}

type GroupBy = 'date' | 'city' | 'activity'

export default function PhotosTab() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [groupBy, setGroupBy] = useState<GroupBy>('date')
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  useEffect(() => { fetchPhotos() }, [])

  async function fetchPhotos() {
    setLoading(true)
    const { data } = await supabase
      .from('card_photos')
      .select('*, card:day_cards(title, day_number, type)')
      .order('created_at', { ascending: false })
    if (data) {
      setPhotos(data.map(p => ({ ...p, url: getPhotoUrl(p.storage_path) })))
    }
    setLoading(false)
  }

  // Group photos
  const grouped: Record<string, Photo[]> = {}
  photos.forEach(p => {
    const day = p.card?.day_number || 0
    const meta = DAY_META[day - 1]
    let key = 'Other'
    if (groupBy === 'date') key = meta ? `Day ${day} · ${meta.date}` : 'Other'
    else if (groupBy === 'city') key = meta?.city || 'Other'
    else if (groupBy === 'activity') key = p.card?.title || 'Other'
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(p)
  })

  const flatPhotos = Object.values(grouped).flat()

  function getThemeForPhoto(p: Photo) {
    const day = p.card?.day_number || 1
    const meta = DAY_META[day - 1]
    return meta ? COUNTRY_THEMES[meta.country] : COUNTRY_THEMES.se
  }

  return (
    <div className="pb-24">
      {/* header */}
      <div className="px-5 pt-14 pb-5" style={{ background: 'linear-gradient(160deg,#0B2545,#1B4D8E)' }}>
        <div className="flex items-end justify-between">
          <div>
            <p className="font-serif text-3xl font-light text-white">Memories</p>
            <p className="text-sm text-white/60 mt-1">{photos.length} photo{photos.length !== 1 ? 's' : ''} from the trip</p>
          </div>
          <div className="text-3xl">📸</div>
        </div>
      </div>

      {/* group by selector */}
      <div className="flex gap-2 px-4 py-3 bg-white border-b border-gray-100">
        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 self-center mr-1">Group by</p>
        {(['date', 'city', 'activity'] as GroupBy[]).map(g => (
          <button key={g} onClick={() => setGroupBy(g)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold capitalize border transition-all ${groupBy === g ? 'border-se-mid text-se-mid bg-se-light' : 'border-gray-100 text-gray-500 bg-gray-50'}`}
            style={groupBy === g ? { borderColor: '#1B4D8E', color: '#1B4D8E', background: '#EBF3FF' } : {}}>
            {g}
          </button>
        ))}
      </div>

      {/* content */}
      {loading ? (
        <div className="grid grid-cols-3 gap-1 p-4">
          {[...Array(9)].map((_, i) => <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-20 h-20 rounded-2xl bg-se-light flex items-center justify-center mb-4" style={{ background: '#EBF3FF' }}>
            <Camera size={32} style={{ color: '#1B4D8E' }} />
          </div>
          <p className="text-[16px] font-semibold text-gray-800 mb-2">No photos yet</p>
          <p className="text-[13px] text-gray-400 leading-relaxed">
            Open any card from the Today or Journey tabs and tap <strong>Photo</strong> to start adding memories
          </p>
        </div>
      ) : (
        <div className="pb-4">
          {Object.entries(grouped).map(([group, groupPhotos]) => {
            if (!groupPhotos.length) return null
            const firstPhoto = groupPhotos[0]
            const theme = getThemeForPhoto(firstPhoto)
            return (
              <div key={group} className="mb-6">
                {/* group header */}
                <div className="flex items-center gap-3 px-4 py-2.5 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: theme.mid }} />
                  <p className="text-[13px] font-bold text-gray-800 flex-1">{group}</p>
                  <p className="text-[11px] text-gray-400 font-medium">{groupPhotos.length} photo{groupPhotos.length > 1 ? 's' : ''}</p>
                </div>

                {/* photo grid */}
                <div className="grid grid-cols-3 gap-1 px-4">
                  {groupPhotos.map(p => {
                    const idx = flatPhotos.findIndex(fp => fp.id === p.id)
                    return (
                      <button key={p.id} onClick={() => setLightboxIdx(idx)}
                        className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 active:scale-95 transition-all">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.url} alt="" className="w-full h-full object-cover" />
                        {/* card type badge */}
                        {p.card?.type && (
                          <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold capitalize text-white" style={{ background: 'rgba(0,0,0,0.45)' }}>
                            {p.card.type}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* horizontal scroll for date group — show card titles */}
                {groupBy === 'date' && groupPhotos.length > 0 && (
                  <div className="px-4 mt-2">
                    <p className="text-[11px] text-gray-400 font-medium truncate">
                      {[...new Set(groupPhotos.map(p => p.card?.title).filter(Boolean))].join(' · ')}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* lightbox */}
      {lightboxIdx !== null && flatPhotos[lightboxIdx] && (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col" onClick={() => setLightboxIdx(null)}>
          {/* top bar */}
          <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ paddingTop: 'max(12px,env(safe-area-inset-top))' }}>
            <div onClick={e => e.stopPropagation()}>
              <p className="text-white font-semibold text-[14px]">{flatPhotos[lightboxIdx].card?.title || 'Photo'}</p>
              <p className="text-white/50 text-[11px]">{lightboxIdx + 1} of {flatPhotos.length}</p>
            </div>
            <button onClick={() => setLightboxIdx(null)} className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <X size={18} className="text-white" />
            </button>
          </div>
          {/* image */}
          <div className="flex-1 flex items-center justify-center relative" onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={flatPhotos[lightboxIdx].url} alt="" className="max-w-full max-h-full object-contain" />
            {flatPhotos.length > 1 && (
              <>
                <button onClick={() => setLightboxIdx(i => ((i ?? 0) - 1 + flatPhotos.length) % flatPhotos.length)}
                  className="absolute left-3 w-10 h-10 bg-white/15 rounded-full flex items-center justify-center">
                  <ChevronLeft size={20} className="text-white" />
                </button>
                <button onClick={() => setLightboxIdx(i => ((i ?? 0) + 1) % flatPhotos.length)}
                  className="absolute right-3 w-10 h-10 bg-white/15 rounded-full flex items-center justify-center">
                  <ChevronRight size={20} className="text-white" />
                </button>
              </>
            )}
          </div>
          {/* dot strip */}
          <div className="flex justify-center gap-1 py-4 flex-shrink-0" onClick={e => e.stopPropagation()}>
            {flatPhotos.map((_, i) => (
              <button key={i} onClick={() => setLightboxIdx(i)}
                className={`rounded-full transition-all ${i === lightboxIdx ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/30'}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}