'use client'
import { Cloud, CheckSquare, AlertTriangle, CreditCard } from 'lucide-react'
import { DayCard, DayData, CountryTheme } from '@/types'

const CURRENCY: Record<string, string> = { se: 'SEK', dk: 'DKK', nl: 'EUR', be: 'EUR' }

interface Props { dayMeta: DayData; theme: CountryTheme; cards: DayCard[] }

export default function QuickPills({ dayMeta, theme, cards }: Props) {
  const alerts = cards.filter(c => c.type === 'alert').length
  const done = cards.filter(c => c.status === 'done').length

  return (
    <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
      <Pill icon={<Cloud size={12} />} label="22°C · Partly cloudy" />
      <Pill icon={<CheckSquare size={12} />} label={`${done}/${cards.length} done`} />
      <Pill icon={<CreditCard size={12} />} label={`${CURRENCY[dayMeta.country]} today`} />
      {alerts > 0 && (
        <Pill icon={<AlertTriangle size={12} />} label={`${alerts} alert${alerts > 1 ? 's' : ''}`} alert />
      )}
    </div>
  )
}

function Pill({ icon, label, alert }: { icon: React.ReactNode; label: string; alert?: boolean }) {
  return (
    <div className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium shadow-sm whitespace-nowrap ${
      alert ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-gray-100 text-gray-600'
    }`}>
      {icon}{label}
    </div>
  )
}
