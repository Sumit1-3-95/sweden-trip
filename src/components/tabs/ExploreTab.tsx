'use client'
import { Plane, Train, Cloud, Euro, Languages, Lightbulb } from 'lucide-react'
import { DayData, CountryTheme } from '@/types'

const TRIVIA: Record<string, string> = {
  Stockholm: 'Stockholm is built on 14 islands connected by 57 bridges. It sits where Lake Mälaren meets the Baltic Sea.',
  Vaxholm: 'Vaxholm Fortress was built in the 16th century and has never been taken by force in its 500-year history.',
  'Thorslunda + Sigtuna': 'Sigtuna is Sweden\'s oldest town, founded around 980 AD. The runic stones on Stora gatan are over 1,000 years old.',
  Copenhagen: 'Copenhagen\'s Nyhavn canal was built in 1673 as a harbour for merchant ships. Hans Christian Andersen lived here for 18 years.',
  'Amsterdam → Sprang-Capelle': 'Efteling opened in 1952 and is one of the oldest theme parks in the world, predating Disneyland by 3 years.',
  Efteling: 'The Aquanura show uses 750 fountains and shoots water 30 metres into the air. The music was composed specifically for the park.',
  Rotterdam: 'Rotterdam was almost entirely destroyed in WWII. The city rebuilt itself as a laboratory for modern architecture — Cube Houses, Markthal, and the Erasmus Bridge.',
  'Rotterdam + Den Haag': 'Kinderdijk\'s 19 windmills were built in 1738 to drain the Alblasserwaard polder, which sits 6 metres below sea level.',
  'Den Haag → Ostend': 'Vermeer\'s Girl with a Pearl Earring has been called the "Mona Lisa of the North." Nobody knows who the girl is.',
  Bruges: 'Bruges has been called the "Venice of the North" since the Middle Ages. Its medieval centre has been virtually unchanged since the 15th century.',
  Ostend: 'James Ensor, the Belgian expressionist painter, was born and died in Ostend. His house is still there.',
  'Ghent → Sint-Pieters-Leeuw': 'Gravensteen Castle in Ghent was built by Philip of Alsace in 1180 as a deliberate show of power over the citizens of the city.',
  Brussels: 'The Atomium was built in 9 months for the 1958 World Expo. It was supposed to be torn down after the expo but the public loved it too much.',
  'Brussels → Stockholm': 'Brussels has more journalists accredited to it than Washington DC — it is the de facto capital of the European Union.',
  Solna: 'Solna is home to the Sweden national football stadium, Solna arena, and the Royal Djurgården park is nearby.',
  'Stockholm → Delhi': 'Arlanda airport has one of the fastest rail connections to a city centre of any airport in the world — 20 minutes to Stockholm Central.',
}

const PHRASES: Record<string, { flag: string; lang: string; phrases: { en: string; local: string; pron: string }[] }> = {
  se: { flag: '🇸🇪', lang: 'Swedish', phrases: [
    { en: 'Hello', local: 'Hej', pron: 'hey' },
    { en: 'Thank you', local: 'Tack', pron: 'tack' },
    { en: 'Cheers!', local: 'Skål!', pron: 'skol' },
    { en: 'Where is…?', local: 'Var är…?', pron: 'var air' },
    { en: 'How much?', local: 'Hur mycket?', pron: 'hoor mick-et' },
  ]},
  dk: { flag: '🇩🇰', lang: 'Danish', phrases: [
    { en: 'Hello', local: 'Hej', pron: 'hi' },
    { en: 'Thank you', local: 'Tak', pron: 'tack' },
    { en: 'Cheers!', local: 'Skål!', pron: 'skol' },
    { en: 'Excuse me', local: 'Undskyld', pron: 'oon-skool' },
  ]},
  nl: { flag: '🇳🇱', lang: 'Dutch', phrases: [
    { en: 'Hello', local: 'Hallo', pron: 'hah-low' },
    { en: 'Thank you', local: 'Dankjewel', pron: 'dank-yuh-vel' },
    { en: 'Cheers!', local: 'Proost!', pron: 'prohst' },
    { en: 'Where is…?', local: 'Waar is…?', pron: 'var is' },
  ]},
  be: { flag: '🇧🇪', lang: 'French', phrases: [
    { en: 'Hello', local: 'Bonjour', pron: 'bon-zhoor' },
    { en: 'Thank you', local: 'Merci', pron: 'mair-see' },
    { en: 'Cheers!', local: 'Santé!', pron: 'son-tay' },
    { en: 'How much?', local: 'Combien?', pron: 'com-bee-en' },
  ]},
}

interface Props { dayMeta: DayData; theme: CountryTheme }

export default function ExploreTab({ dayMeta, theme }: Props) {
  const trivia = TRIVIA[dayMeta.city] || 'Every day on this trip holds something extraordinary.'
  const lang = PHRASES[dayMeta.country]

  const tools = [
    { icon: Plane,      label: 'Flight status',  sub: 'Live tracking',       color: '#dbeafe', iconColor: '#1e40af' },
    { icon: Train,      label: 'Train status',   sub: 'Live departures',     color: '#dcfce7', iconColor: '#166534' },
    { icon: Cloud,      label: 'Weather',        sub: '5-day forecast',      color: theme.light, iconColor: theme.mid },
    { icon: Euro,       label: 'Currency',       sub: 'INR · SEK · EUR',     color: '#fef9c3', iconColor: '#854d0e' },
    { icon: Languages,  label: 'Language',       sub: 'Local phrases',       color: '#fce7f3', iconColor: '#9d174d' },
    { icon: Lightbulb,  label: 'Trivia',         sub: 'About this city',     color: '#f0fdf4', iconColor: '#166534' },
  ]

  return (
    <div className="pb-24">
      <div className="px-5 pt-14 pb-5" style={{ background: theme.gradient }}>
        <p className="font-serif text-3xl font-light text-white">Explore</p>
        <p className="text-sm text-white/60 mt-1">Tools and info for the road</p>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4">
        {tools.map(({ icon: Icon, label, sub, color, iconColor }) => (
          <button key={label} className="card-base p-4 text-left active:scale-95 transition-all shadow-card">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: color }}>
              <Icon size={18} style={{ color: iconColor }} />
            </div>
            <p className="text-[13px] font-bold text-gray-800">{label}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
          </button>
        ))}
      </div>

      {/* trivia */}
      <div className="mx-4 mb-4 card-base p-4 shadow-card">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: theme.mid }}>Did you know · {dayMeta.city}</p>
        <p className="text-[14px] font-semibold text-gray-800 leading-snug mb-2">{trivia}</p>
      </div>

      {/* language flashcards */}
      {lang && (
        <div className="mx-4 card-base p-4 shadow-card">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: theme.mid }}>
            {lang.flag} {lang.lang} phrases
          </p>
          <div className="space-y-2">
            {lang.phrases.map(p => (
              <div key={p.en} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-[12px] text-gray-500 w-24">{p.en}</span>
                <div className="text-right">
                  <p className="text-[13px] font-bold text-gray-800">{p.local}</p>
                  <p className="text-[10px] text-gray-400 italic">{p.pron}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
