import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error(`Missing env vars — URL: ${url ? 'ok' : 'MISSING'}, KEY: ${key ? 'ok' : 'MISSING'}`)
  return createClient(url, key)
}

const SEED_CARDS = [
  // ── DAY 1 ──
  { day_number:1, type:'transport', title:'Fly Delhi → Stockholm', time_label:'Early am', sort_order:0,
    description:'Lufthansa LH761 + LH2420 via Munich. All 5 passengers confirmed. Arrive Arlanda Terminal 5 at 14:25. Komal collecting.',
    tags:['Flight','All confirmed'], metadata:{ ref:'9XUWK9', from:'DEL', to:'ARN', dep:'~06:00', arr:'14:25', op:'Lufthansa', via:'Munich (MUC)' } },
  { day_number:1, type:'activity', title:'Settle in at Komal\'s', time_label:'Evening', sort_order:1,
    description:'Home-cooked dinner in Solna. Pure rest — do nothing. The trip starts properly tomorrow.',
    tags:['Rest','Family time'], metadata:{} },

  // ── DAY 2 ──
  { day_number:2, type:'activity', title:'Djurgården island walk', time_label:'Morning', sort_order:0,
    description:'Flat 4km shoreline loop around the island. Views back to Gamla Stan. Ideal for grandparents — no hills, wide paths, benches every 400m.',
    tags:['Flat walk','Family friendly','Free'], metadata:{} },
  { day_number:2, type:'activity', title:'Rosendals Trädgård café', time_label:'Afternoon', sort_order:1,
    description:'Stockholm\'s most beloved organic café in a 19th-century greenhouse. Pick fresh flowers, organic pastries, long tables in the garden. No rush.',
    tags:['Café','Garden'], metadata:{} },

  // ── DAY 3 ──
  { day_number:3, type:'activity', title:'Vasa Museum', time_label:'10am', sort_order:0,
    description:'A fully preserved 17th-century warship that sank on its maiden voyage in 1628, salvaged and restored. Nothing else like it anywhere. Under-18s free.',
    tags:['Museum','Ticket','Must-do'], metadata:{ ticketUrl:'https://vasamuseet.se', price:'230 SEK adult, under 18 free' } },
  { day_number:3, type:'activity', title:'Junibacken children\'s museum', time_label:'Afternoon', sort_order:1,
    description:'The Story Train glides through Pippi Longstocking\'s world, Karlsson-on-the-Roof, and Emil\'s farm. Mira will be completely spellbound.',
    tags:['Kids','Story Train','Ticket'], metadata:{ ticketUrl:'https://junibacken.se' } },
  { day_number:3, type:'activity', title:'Gamla Stan + Nobel Museum', time_label:'Late afternoon', sort_order:2,
    description:'Medieval cobblestone island. Nobel Museum inside Gamla Stan — interactive, all ages. Finish with fika at Stortorget.',
    tags:['History','Museum','Fika'], metadata:{} },

  // ── DAY 4 ──
  { day_number:4, type:'activity', title:'Ferry to Vaxholm', time_label:'9am', sort_order:0,
    description:'Waxholmsbolaget ferry from Strömkajen. 70 minutes through 14,000 islands. One of the most scenic short journeys in Scandinavia.',
    tags:['Ferry','Scenic','Family friendly'], metadata:{ departure:'Strömkajen', duration:'70 min', operator:'Waxholmsbolaget' } },
  { day_number:4, type:'activity', title:'Vaxholm island', time_label:'Afternoon', sort_order:1,
    description:'Swimming off the smooth granite rocks. Picnic lunch from the island bakery. The 16th-century fortress rises from the water nearby.',
    tags:['Swimming','Picnic','Outdoors'], metadata:{} },

  // ── DAY 5 ──
  { day_number:5, type:'activity', title:'Gamla Stan walk', time_label:'Morning', sort_order:0,
    description:'Stockholm\'s medieval island. Stortorget is the oldest square — the coloured merchant houses have stood since the 1400s. Compact and fully walkable.',
    tags:['History','Free','Walking'], metadata:{} },
  { day_number:5, type:'activity', title:'Nobel Museum', time_label:'10:30am', sort_order:1,
    description:'Each laureate\'s story told through objects, video and text. The café underneath with hanging chairs is lovely for coffee.',
    tags:['Museum','Ticket'], metadata:{ price:'~130 SEK' } },
  { day_number:5, type:'activity', title:'Stortorget fika', time_label:'Afternoon', sort_order:2,
    description:'Sit in the oldest square with coffee and a kardemummabulle (cardamom bun). This is the Swedish ritual of fika — taken seriously.',
    tags:['Food','Coffee'], metadata:{} },

  // ── DAY 6 ──
  { day_number:6, type:'activity', title:'Thorslunda strawberry picking', time_label:'10:30am', sort_order:0,
    description:'Self-picking farm 45 min from Solna. Fill baskets with Swedish jordgubbar straight from the field. Farm café on site for waffles and ice cream.',
    tags:['Family friendly','Kids','Outdoors'], metadata:{ address:'Torslundagård, 17996 Svartsjö', website:'thorslunda.se', note:'Check website for berry availability the day before' } },
  { day_number:6, type:'activity', title:'Sigtuna old town', time_label:'2pm', sort_order:1,
    description:'Sweden\'s oldest town. One beautiful main street (Stora gatan), Viking rune stones, lakeside views, the best fika café. Completely flat.',
    tags:['History','Elderly friendly','Scenic'], metadata:{ driveFrom:'Thorslunda ~45 min via E18', note:'Komal\'s car — clockwise loop back to Solna' } },

  // ── DAY 7 ──
  { day_number:7, type:'activity', title:'IKEA Barkarby', time_label:'10am', sort_order:0,
    description:'Swedish meatballs in the IKEA café first — grandparents will love this. Then the full store. Komal knows the best route.',
    tags:['Shopping','Food'], metadata:{ address:'IKEA Barkarby, Stockholm' } },
  { day_number:7, type:'activity', title:'157 + shopping area', time_label:'Afternoon', sort_order:1,
    description:'Outdoor lifestyle store + the surrounding Barkarbystaden shopping area. Good for last-minute gear and clothing.',
    tags:['Shopping'], metadata:{} },

  // ── DAY 8 ──
  { day_number:8, type:'activity', title:'Långholmen kayaking', time_label:'10am', sort_order:0,
    description:'2-hour kayak session on the calm Pålsund canal. Sumit + Aishwarya + Komal. Grandparents relax at Långholmen beach nearby.',
    tags:['Active','Adults only','Book ahead'], metadata:{ website:'langholmenkajak.se', note:'Book online in advance — July slots fill fast' } },
  { day_number:8, type:'alert', title:'⚠️ Pack all bags tonight', time_label:'Evening', sort_order:1,
    description:'Train to Malmö departs Stockholm Central at 07:19 tomorrow (Fri 1 Aug). Carriage 7. Leave Solna by 06:15am.',
    tags:['Alert'], metadata:{} },
  { day_number:8, type:'transport', title:'Train to Malmö', time_label:'07:19 tomorrow', sort_order:2,
    description:'SJ X2000 high-speed train. Train 523. Carriage 7. All 5 seats confirmed. 4h 34m journey.',
    tags:['Train','Confirmed'], metadata:{ ref:'W5UNRLKY', from:'Stockholm Central', to:'Malmö Central', dep:'07:19', arr:'11:53', op:'SJ X2000', carriage:'Carriage 7' } },

  // ── DAY 9 ──
  { day_number:9, type:'transport', title:'Train Stockholm → Malmö', time_label:'07:19', sort_order:0,
    description:'SJ X2000 · Train 523 · Carriage 7. Departs Stockholm Central. The journey passes Lake Vättern — worth being awake for.',
    tags:['Train','Confirmed'], metadata:{ ref:'W5UNRLKY', dep:'07:19', arr:'11:53' } },
  { day_number:9, type:'activity', title:'Malmöhus Castle', time_label:'2pm', sort_order:1,
    description:'Scandinavia\'s oldest Renaissance castle. City museum, aquarium, and art gallery all inside on one ticket.',
    tags:['Museum','Family friendly','Ticket'], metadata:{} },
  { day_number:9, type:'activity', title:'Ribersborg beach', time_label:'Afternoon', sort_order:2,
    description:'Long sandy city beach. The Kallbadhus bath house sits at the end of a wooden jetty extending into the water.',
    tags:['Beach','Family friendly'], metadata:{} },
  { day_number:9, type:'stay', title:'Hyllie kyrkoväg 48', time_label:'After 4pm', sort_order:3,
    description:'Julia\'s Airbnb in Hyllie. 3 stops from Malmö Central. Perfectly placed for the Øresund bridge commute to Copenhagen.',
    tags:['Stay','3 nights'], metadata:{ host:'Julia', address:'Hyllie kyrkoväg 48, Malmö', checkIn:'After 16:00', checkOut:'2 Aug by 10:00', nights:'3', airbnb:true, alert:'Flight Aug 2 departs CPH 08:10 — leave Airbnb 05:30am' } },

  // ── DAY 10 ──
  { day_number:10, type:'activity', title:'Train to Copenhagen', time_label:'Morning', sort_order:0,
    description:'35-minute Øresund train across one of Europe\'s great bridges. Runs every 20 min from Malmö Central.',
    tags:['Train','Bridge','Scenic'], metadata:{} },
  { day_number:10, type:'activity', title:'Rosenborg Castle + gardens', time_label:'Morning', sort_order:1,
    description:'Danish crown jewels — actual regalia, not reproductions. Beautiful surrounding King\'s Garden. Grandparents can sit while others visit.',
    tags:['Museum','Crown jewels','Ticket'], metadata:{} },
  { day_number:10, type:'activity', title:'Nyhavn waterfront', time_label:'Afternoon', sort_order:2,
    description:'Iconic colourful canal. 17th-century merchant houses. Canal boat tour available. Lunch at canal-side restaurant.',
    tags:['Canals','Food','Iconic'], metadata:{} },
  { day_number:10, type:'alert', title:'⚠️ Return to Malmö early', time_label:'Evening', sort_order:3,
    description:'Flight CPH→AMS departs 08:10 tomorrow. Leave Malmö Airbnb by 05:30am. Early night essential.',
    tags:['Alert'], metadata:{} },

  // ── DAY 11 ──
  { day_number:11, type:'alert', title:'⚠️ Leave Malmö by 05:30am', time_label:'05:30', sort_order:0,
    description:'Train from Hyllie station to CPH Airport. About 40 minutes. The tightest departure of the whole trip.',
    tags:['Alert','Early start'], metadata:{} },
  { day_number:11, type:'transport', title:'Fly CPH → Amsterdam', time_label:'08:10', sort_order:1,
    description:'Norwegian D83538. 1h 25m. All 5 passengers confirmed.',
    tags:['Flight','Confirmed'], metadata:{ ref:'XVDUPJ', from:'Copenhagen (CPH)', to:'Amsterdam (AMS)', dep:'08:10', arr:'09:35', op:'Norwegian', num:'D83538' } },
  { day_number:11, type:'stay', title:'Dijkstraat 12, Sprang-Capelle', time_label:'After 3pm', sort_order:2,
    description:'Sonny\'s Airbnb. 20 minutes from Efteling. Rest — big day tomorrow.',
    tags:['Stay','2 nights'], metadata:{ host:'Sonny', address:'Dijkstraat 12, Sprang-Capelle', checkIn:'After 15:00', checkOut:'4 Aug by 10:00', nights:'2', airbnb:true } },

  // ── DAY 12 ──
  { day_number:12, type:'activity', title:'Efteling theme park — full day', time_label:'10am', sort_order:0,
    description:'Europe\'s greatest fairytale park. 20 min taxi from the Airbnb. Open 10am–8pm in August.',
    tags:['Family friendly','Must-do'], metadata:{ website:'efteling.com', note:'Book SUMMER TICKETS only — normal tickets invalid in August. ~€38–53/person' } },
  { day_number:12, type:'activity', title:'Fairytale Forest', time_label:'Morning', sort_order:1,
    description:'Enchanted walk through old-growth woodland with elaborate fairy tale scenes. Perfect for Mira and grandparents.',
    tags:['Kids','Elderly friendly','Must-do'], metadata:{} },
  { day_number:12, type:'activity', title:'Aquanura lake show', time_label:'8pm', sort_order:2,
    description:'25-minute choreographed fountain show with fire, light, and music. One of the best shows in any European park. Bring a light jacket.',
    tags:['Must-see','Evening'], metadata:{} },

  // ── DAY 13 ──
  { day_number:13, type:'activity', title:'Markthal + Cube Houses', time_label:'Afternoon', sort_order:0,
    description:'Markthal: giant horseshoe arch with 11,000m² food mural ceiling. Cube Houses: Piet Blom\'s 45-degree yellow cubes. Both within walking distance.',
    tags:['Architecture','Food','Market'], metadata:{} },
  { day_number:13, type:'stay', title:'Van Brakelstraat 107, Rotterdam', time_label:'After 3pm', sort_order:1,
    description:'Alexander\'s townhouse. Central Rotterdam. Kinderdijk 30 min by water bus. Den Haag 25 min by train.',
    tags:['Stay','2 nights'], metadata:{ host:'Alexander', address:'Van Brakelstraat 107, Rotterdam', checkIn:'After 15:00', checkOut:'6 Aug by 11:00', nights:'2', airbnb:true } },

  // ── DAY 14 ──
  { day_number:14, type:'activity', title:'Kinderdijk windmills', time_label:'Morning', sort_order:0,
    description:'19 windmills from the 1740s — UNESCO World Heritage. Water bus from Rotterdam. Completely flat. One of the most purely Dutch experiences.',
    tags:['UNESCO','Water bus','Elderly friendly','Ticket'], metadata:{} },
  { day_number:14, type:'activity', title:'Madurodam, Den Haag', time_label:'Afternoon', sort_order:1,
    description:'1:25 scale replica of the Netherlands. Mira will spend an hour just pointing at things. 25 min train from Rotterdam.',
    tags:['Kids','Family friendly','Ticket'], metadata:{} },

  // ── DAY 15 ──
  { day_number:15, type:'activity', title:'Scheveningen beach', time_label:'Morning', sort_order:0,
    description:'Den Haag\'s North Sea beach. 3.5km of flat sand. Flat promenade. Grandparents can sit and watch the waves while others swim.',
    tags:['Beach','Elderly friendly','Family friendly'], metadata:{} },
  { day_number:15, type:'stay', title:'Mijnplein 6A, Ostend', time_label:'After 4pm', sort_order:1,
    description:'Peter\'s flat. North Sea is two minutes\' walk. Bruges 15 min by train. Ghent 35 min.',
    tags:['Stay','3 nights'], metadata:{ host:'Peter', address:'Mijnplein 6A, Ostend', checkIn:'After 16:00', checkOut:'9 Aug by 11:00', nights:'3', airbnb:true } },

  // ── DAY 16 ──
  { day_number:16, type:'activity', title:'Canal boat tour', time_label:'Morning', sort_order:0,
    description:'30 min in a low wooden boat under stone bridges through medieval Bruges. Grandparents: no walking required. Must-do.',
    tags:['Must-do','Elderly friendly','Boat'], metadata:{} },
  { day_number:16, type:'activity', title:'Markt + Belfry + chocolate', time_label:'Afternoon', sort_order:1,
    description:'Markt square unchanged for 600 years. Dumon chocolatier since 1948. Minnewater Lake — swans, willows, 14th-century sluice gate.',
    tags:['History','Chocolate','Scenic'], metadata:{} },

  // ── DAY 17 ──
  { day_number:17, type:'activity', title:'Ostend beach + coastal tram', time_label:'Morning', sort_order:0,
    description:'Widest sandy beach in Belgium. The Kusttram runs 68km along the full Belgian coast — world\'s longest tramway.',
    tags:['Beach','Family friendly','Tram'], metadata:{} },
  { day_number:17, type:'activity', title:'Fish market + harbour', time_label:'Afternoon', sort_order:1,
    description:'Grey North Sea shrimp, oysters, moules-frites. James Ensor\'s house nearby if energy allows.',
    tags:['Food','Culture'], metadata:{} },

  // ── DAY 18 ──
  { day_number:18, type:'activity', title:'Gravensteen Castle, Ghent', time_label:'Morning', sort_order:0,
    description:'Medieval water castle with moat. Armour, siege weapons, original torture instruments. Built 1180, never seriously remodelled. Mira will be fascinated.',
    tags:['History','Kids','Ticket'], metadata:{} },
  { day_number:18, type:'stay', title:'Vlierstraat 14, Sint-Pieters-Leeuw', time_label:'After 4pm', sort_order:1,
    description:'Elke\'s house. Brussels suburb, 15km from city centre. 20 min train to Brussels. 30 min taxi to BRU airport.',
    tags:['Stay','2 nights'], metadata:{ host:'Elke', address:'Vlierstraat 14, Sint-Pieters-Leeuw', checkIn:'After 16:00', checkOut:'11 Aug by 11:00', nights:'2', airbnb:true } },

  // ── DAY 19 ──
  { day_number:19, type:'activity', title:'Grand Place + Royal Gallery', time_label:'Morning', sort_order:0,
    description:'Victor Hugo called it the most beautiful square in the world. Belgian waffle from a street stall. Galeries Saint-Hubert: praline was invented here in 1912.',
    tags:['History','Food','Architecture'], metadata:{} },
  { day_number:19, type:'activity', title:'Atomium + Mini-Europe', time_label:'Afternoon', sort_order:1,
    description:'1958 World Expo iron crystal, 165 billion times enlarged. Mini-Europe next door: 350 monuments at 1:25 scale. The Vesuvius erupts on the hour.',
    tags:['Architecture','Kids','Ticket'], metadata:{} },

  // ── DAY 20 ──
  { day_number:20, type:'alert', title:'⚠️ Head to BRU airport by 16:30', time_label:'16:30', sort_order:0,
    description:'Pre-book taxi from Sint-Pieters-Leeuw (~30 min). Latest check-in for SK1590 is 18:10.',
    tags:['Alert'], metadata:{} },
  { day_number:20, type:'transport', title:'Fly Brussels → Stockholm', time_label:'18:55', sort_order:1,
    description:'SAS SK1590. 2h 10m. Arrive Arlanda 21:05. Komal collecting.',
    tags:['Flight','Confirmed'], metadata:{ ref:'YJI224', from:'Brussels (BRU)', to:'Stockholm Arlanda (ARN)', dep:'18:55', arr:'21:05', op:'SAS', num:'SK1590' } },

  // ── DAY 21 ──
  { day_number:21, type:'activity', title:'Full rest day', time_label:'All day', sort_order:0,
    description:'No alarm. No plan. Home-cooked food at Komal\'s. Three weeks of walking — the body needs this.',
    tags:['Rest','Family time'], metadata:{} },

  // ── DAY 22 ──
  { day_number:22, type:'activity', title:'Farewell dinner with Komal', time_label:'Evening', sort_order:0,
    description:'Last meal in Europe together. Komal\'s choice. Pack everything tonight.',
    tags:['Family time'], metadata:{} },
  { day_number:22, type:'alert', title:'⚠️ Pack everything tonight', time_label:'Night', sort_order:1,
    description:'Flight departs ARN at 06:00 tomorrow. Leave Solna at 3:00am. Set 3 alarms.',
    tags:['Alert'], metadata:{} },

  // ── DAY 23 (departure) stored as day 22 continued ──
  { day_number:22, type:'transport', title:'Fly Stockholm → Delhi', time_label:'06:00', sort_order:2,
    description:'LH2421 to Munich + LH762 to New Delhi. Ref 9XUWK9. Arrive Delhi 23:55. 22 days complete.',
    tags:['Flight','Confirmed'], metadata:{ ref:'9XUWK9', from:'Stockholm Arlanda (ARN)', to:'New Delhi (DEL)', dep:'06:00', arr:'23:55', op:'Lufthansa', num:'LH2421 + LH762', via:'Munich (MUC)' } },
]

export async function GET() {
  try {
    const supabase = getSupabase()

    // Check if already seeded
    const { count, error: countError } = await supabase
      .from('day_cards')
      .select('*', { count: 'exact', head: true })

    if (countError) return NextResponse.json({ error: countError.message, hint: 'Have you run supabase-schema.sql?' }, { status: 500 })

    if (count && count > 0) {
      return NextResponse.json({ message: `Already seeded — ${count} cards exist`, seeded: false })
    }

    const cards = SEED_CARDS.map(c => ({
      ...c,
      status: 'upcoming' as const,
      tags: c.tags || [],
      metadata: c.metadata || {},
    }))

    const { error, data } = await supabase.from('day_cards').insert(cards).select()
    if (error) return NextResponse.json({ error: error.message, hint: 'Check Supabase table permissions' }, { status: 500 })

    return NextResponse.json({ message: `Seeded ${data.length} cards successfully`, seeded: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}