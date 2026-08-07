'use client'
import { AlertTriangle } from 'lucide-react'
import { DayCard, DayData, CountryTheme } from '@/types'

interface Props { dayMeta: DayData; theme: CountryTheme; cards: DayCard[] }

export default function QuickPills({ dayMeta, theme, cards }: Props) {
  const alerts = cards.filter(c => c.type === 'alert').length
  const CITY_COORDS: Record<string, { lat: number; lon: number }> = {
    Stockholm: { lat: 59.33, lon: 18.07 }, Solna: { lat: 59.36, lon: 18.00 },
    'Malmö': { lat: 55.61, lon: 13.00 }, Copenhagen: { lat: 55.68, lon: 12.57 },
    'Sprang-Capelle': { lat: 51.66, lon: 5.01 }, Efteling: { lat: 51.65, lon: 5.05 },
    Rotterdam: { lat: 51.92, lon: 4.48 }, 'Den Haag': { lat: 52.07, lon: 4.31 },
    Ostend: { lat: 51.23, lon: 2.92 }, Bruges: { lat: 51.21, lon: 3.22 },
    Ghent: { lat: 51.05, lon: 3.72 }, Brussels: { lat: 50.85, lon: 4.35 },
    'Sint-Pieters-Leeuw': { lat: 50.77, lon: 4.26 },
  }
  const cityKey = Object.keys(CITY_COORDS).find(k => dayMeta.city.includes(k)) || 'Stockholm'
  const coords = CITY_COORDS[cityKey]
  const weatherUrl = `https://wttr.in/${coords.lat},${coords.lon}?format=3`

  if (alerts === 0) return null

  return (
    <div className="flex gap-2 px-4 pt-2 pb-0 overflow-x-auto no-scrollbar">
      <Pill alert>
        <AlertTriangle size={12} className="flex-shrink-0" />
        <span className="text-xs font-medium">{alerts} alert{alerts > 1 ? 's' : ''} today</span>
      </Pill>
    </div>
  )
}

function Pill({ children, alert }: { children: React.ReactNode; alert?: boolean }) {
  return (
    <div className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-sm whitespace-nowrap ${
      alert ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-gray-100 text-gray-600'
    }`}>
      {children}
    </div>
  )
}