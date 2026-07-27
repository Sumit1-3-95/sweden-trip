export type Country = 'se' | 'dk' | 'nl' | 'be'
export type CardType = 'activity' | 'transport' | 'stay' | 'alert' | 'free'
export type CardStatus = 'done' | 'now' | 'upcoming'

export interface DayCard {
  id: string
  day_number: number
  type: CardType
  title: string
  description: string | null
  time_label: string | null
  location: string | null
  tags: string[]
  status: CardStatus
  sort_order: number
  metadata: Record<string, unknown> | null
  created_by: string | null
  updated_at: string
  created_at: string
  photos?: CardPhoto[]
}

export interface CardPhoto {
  id: string
  card_id: string
  storage_path: string
  caption: string | null
  uploaded_by: string | null
  created_at: string
  url?: string
}

export interface DayData {
  day: number
  date: string
  weekday: string
  country: Country
  city: string
  title: string
  preview: string
}

export interface CountryTheme {
  dark: string
  mid: string
  light: string
  acc: string
  flag: string
  name: string
  gradient: string
  pattern: string
}

export const COUNTRY_THEMES: Record<Country, CountryTheme> = {
  se: {
    dark: '#0B2545', mid: '#1B4D8E', light: '#EBF3FF', acc: '#F5C842',
    flag: '🇸🇪', name: 'Sweden',
    gradient: 'linear-gradient(160deg, #0B2545 0%, #1B4D8E 100%)',
    pattern: 'repeating-linear-gradient(90deg,rgba(255,255,255,.05) 0,rgba(255,255,255,.05) 1px,transparent 0,transparent 48px),repeating-linear-gradient(rgba(255,255,255,.05) 0,rgba(255,255,255,.05) 1px,transparent 0,transparent 48px)',
  },
  dk: {
    dark: '#6B1010', mid: '#C0392B', light: '#FDECEA', acc: '#F5E8A0',
    flag: '🇩🇰', name: 'Denmark',
    gradient: 'linear-gradient(160deg, #6B1010 0%, #C0392B 100%)',
    pattern: 'radial-gradient(rgba(255,255,255,.07) 1px,transparent 1px)',
  },
  nl: {
    dark: '#6B3400', mid: '#D4690A', light: '#FFF0E0', acc: '#F5D060',
    flag: '🇳🇱', name: 'Netherlands',
    gradient: 'linear-gradient(160deg, #6B3400 0%, #D4690A 100%)',
    pattern: 'repeating-linear-gradient(45deg,rgba(255,255,255,.05) 0,rgba(255,255,255,.05) 1px,transparent 0,transparent 12px)',
  },
  be: {
    dark: '#3A2200', mid: '#8B6914', light: '#FFF9E0', acc: '#E8C040',
    flag: '🇧🇪', name: 'Belgium',
    gradient: 'linear-gradient(160deg, #3A2200 0%, #8B6914 100%)',
    pattern: 'repeating-linear-gradient(135deg,rgba(255,255,255,.05) 0,rgba(255,255,255,.05) 1px,transparent 0,transparent 14px)',
  },
}

// AUTHORITATIVE ITINERARY — verified against all booking PDFs
// Day 1  = Fri 24 Jul = Arrive Stockholm (flight LH ref 9XUWK9, lands 14:25)
// Day 2  = Sat 25 Jul = Djurgården + Vasa Museum + Gamla Stan ✅ DONE
// Day 3  = Sun 26 Jul = Rest + IKEA + H&M + Baby library ✅ DONE
// Day 4  = Mon 27 Jul = Free Stockholm day
// Day 5  = Tue 28 Jul = Free Stockholm day
// Day 6  = Wed 29 Jul = Free Stockholm day
// Day 7  = Thu 30 Jul = 🚆 Train to Malmö 07:19 (W5UNRLKY) + check-in Zenith Malmö 16:00
// Day 8  = Fri 31 Jul = Malmö city day
// Day 9  = Sat  1 Aug = Copenhagen day trip (Øresund train)
// Day 10 = Sun  2 Aug = ✈️ CPH→AMS 08:10 (XVDUPJ) → Sprang-Capelle check-in 15:00
// Day 11 = Mon  3 Aug = Efteling theme park
// Day 12 = Tue  4 Aug = Move to Rotterdam, check-in 15:00 (HMRDYAK4RN / Michiel)
// Day 13 = Wed  5 Aug = Kinderdijk + Madurodam
// Day 14 = Thu  6 Aug = Scheveningen → train to Ostend, check-in 16:00 (HMRXFTJ4PH / Peter)
// Day 15 = Fri  7 Aug = Bruges day trip
// Day 16 = Sat  8 Aug = Ostend sea day
// Day 17 = Sun  9 Aug = Ghent → Sint-Pieters-Leeuw check-in 16:00 (HME5Q2RBTQ / Elke)
// Day 18 = Mon 10 Aug = Brussels full day
// Day 19 = Tue 11 Aug = ✈️ BRU→ARN 18:55 SAS SK1590 (YJI224)
// Day 20 = Wed 12 Aug = Rest day Solna
// Day 21 = Thu 13 Aug = Farewell dinner + pack
// Day 22 = Fri 14 Aug = ✈️ ARN→DEL 06:00 Lufthansa (9XUWK9)

export const DAY_META: DayData[] = [
  { day:1,  date:'24 Jul', weekday:'Fri', country:'se', city:'Stockholm',        title:'Arrive in Stockholm',         preview:'Flight lands 14:25 · Komal collecting' },
  { day:2,  date:'25 Jul', weekday:'Sat', country:'se', city:'Stockholm',        title:'Djurgården + Vasa + Gamla Stan', preview:'Done ✓ · boat ride · museum · old town' },
  { day:3,  date:'26 Jul', weekday:'Sun', country:'se', city:'Stockholm',        title:'Rest day + Shopping',         preview:'Done ✓ · IKEA · H&M · Baby library' },
  { day:4,  date:'27 Jul', weekday:'Mon', country:'se', city:'Stockholm',        title:'Stockholm free day',          preview:'Vaxholm archipelago ferry' },
  { day:5,  date:'28 Jul', weekday:'Tue', country:'se', city:'Stockholm',        title:'Stockholm free day',          preview:'Gamla Stan · Nobel Museum · fika' },
  { day:6,  date:'29 Jul', weekday:'Wed', country:'se', city:'Stockholm',        title:'Stockholm free day',          preview:'Thorslunda strawberries · Sigtuna' },
  { day:7,  date:'30 Jul', weekday:'Thu', country:'se', city:'Stockholm → Malmö', title:'Train to Malmö',             preview:'SJ X2000 07:19 · arrive 11:53 · Zenith Malmö' },
  { day:8,  date:'31 Jul', weekday:'Fri', country:'se', city:'Malmö',            title:'Malmö city day',              preview:'Malmöhus Castle · Ribersborg beach' },
  { day:9,  date:'1 Aug',  weekday:'Sat', country:'dk', city:'Copenhagen',       title:'Copenhagen day trip',         preview:'Øresund bridge · Rosenborg · Nyhavn' },
  { day:10, date:'2 Aug',  weekday:'Sun', country:'nl', city:'Sprang-Capelle',   title:'Fly to Netherlands',          preview:'CPH→AMS 08:10 · leave Malmö 05:30' },
  { day:11, date:'3 Aug',  weekday:'Mon', country:'nl', city:'Efteling',         title:'Efteling theme park',         preview:'Fairytale Forest · Aquanura · full day' },
  { day:12, date:'4 Aug',  weekday:'Tue', country:'nl', city:'Rotterdam',        title:'Move to Rotterdam',           preview:'Markthal · Cube Houses · riverside' },
  { day:13, date:'5 Aug',  weekday:'Wed', country:'nl', city:'Rotterdam',        title:'Kinderdijk + Madurodam',      preview:'UNESCO windmills · miniature Netherlands' },
  { day:14, date:'6 Aug',  weekday:'Thu', country:'be', city:'Ostend',           title:'Scheveningen → Ostend',       preview:'North Sea beach · train to Belgium' },
  { day:15, date:'7 Aug',  weekday:'Fri', country:'be', city:'Bruges',           title:'Bruges day trip',             preview:'Canal boat · Markt · chocolate · Minnewater' },
  { day:16, date:'8 Aug',  weekday:'Sat', country:'be', city:'Ostend',           title:'Ostend sea day',              preview:'North Sea beach · coastal tram · harbour' },
  { day:17, date:'9 Aug',  weekday:'Sun', country:'be', city:'Sint-Pieters-Leeuw', title:'Ghent → Brussels area',    preview:'Gravensteen castle · check in The Bubble' },
  { day:18, date:'10 Aug', weekday:'Mon', country:'be', city:'Brussels',         title:'Brussels full day',           preview:'Grand Place · Atomium · Mini-Europe' },
  { day:19, date:'11 Aug', weekday:'Tue', country:'se', city:'Brussels → Stockholm', title:'Fly home to Stockholm',  preview:'SAS SK1590 BRU→ARN 18:55' },
  { day:20, date:'12 Aug', weekday:'Wed', country:'se', city:'Solna',            title:'Rest day',                    preview:'Home cooking · sleep · recharge' },
  { day:21, date:'13 Aug', weekday:'Thu', country:'se', city:'Solna',            title:'Last day + farewell dinner',  preview:'Pack · farewell dinner with Komal' },
  { day:22, date:'14 Aug', weekday:'Fri', country:'se', city:'Stockholm → Delhi', title:'Fly home to Delhi',         preview:'ARN→DEL 06:00 · Lufthansa · journey\'s end' },
]