import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error(`Missing env vars — URL: ${url ? 'ok' : 'MISSING'}, KEY: ${key ? 'ok' : 'MISSING'}`)
  return createClient(url, key)
}

const SEED_CARDS = [

  // ── DAY 1 · Arrive Stockholm ──────────────────────────────
  {
    day_number: 1, type: 'transport', title: 'Fly Delhi → Stockholm', time_label: '~06:00', sort_order: 0,
    description: 'Lufthansa LH761 + LH2420 via Munich. All 5 passengers confirmed on the same booking. Komal collecting from Terminal 5 on arrival.',
    tags: ['Flight', 'Confirmed', 'All 5 passengers'],
    metadata: {
      ref: '9XUWK9', from: 'New Delhi (DEL)', to: 'Stockholm Arlanda (ARN)',
      dep: '~06:00', arr: '14:25', op: 'Lufthansa', num: 'LH761 + LH2420', via: 'Munich (MUC)',
      duration: '~11h total', terminal: 'Terminal 5',
      tip: 'Komal is collecting from Terminal 5. Immigration queue can be 30-45 min in peak season — factor this in.'
    }
  },
  {
    day_number: 1, type: 'activity', title: 'Arrive & settle at Komal\'s', time_label: 'Evening', sort_order: 1,
    description: 'Home-cooked dinner at Komal\'s place in Solna. Rest — do not plan anything else today. The grandparents and Mira will be exhausted after an 11-hour journey.',
    tags: ['Rest', 'Family time', 'No plans needed'],
    metadata: {
      what_to_expect: 'A warm welcome and a home-cooked meal. Komal\'s flat is comfortable and centrally located in Solna — very close to the metro.',
      tip: 'Resist the urge to go out and explore. The trip has 21 more days. Rest is the most valuable thing you can do tonight.',
      duration: 'Evening only',
      nearest_station: 'Solna station (T-bana line 11, blue line)',
    }
  },

  // ── DAY 2 · Djurgården & Rosendals ───────────────────────
  {
    day_number: 2, type: 'activity', title: 'Djurgården island walk', time_label: 'Morning', sort_order: 0,
    description: 'A flat 4km loop around Djurgården island with waterfront views back to Gamla Stan. One of the most beautiful urban walks in Scandinavia.',
    tags: ['Free', 'Flat walk', 'Elderly friendly', 'Family friendly'],
    metadata: {
      what_to_expect: 'Wide, well-maintained paths through parkland with occasional glimpses of the water. Very calm on weekend mornings before the museums open. Benches every 400m — ideal for grandparents to rest.',
      duration: '1.5–2 hours at a relaxed pace',
      nearest_station: 'Djurgårdsbron (Bus 69 from city centre, or walk from Strandvägen)',
      best_time: 'Before 10am — quiet and beautiful in the morning light',
      tip: 'Stop at the eastern tip of the island for the best view back to the old town. Mira can run freely — very safe with no traffic.',
      cost: 'Free',
      elderly_friendly: 'Yes — completely flat, wide paths, multiple rest points',
      kid_friendly: 'Yes — open space, ducks, water views',
    }
  },
  {
    day_number: 2, type: 'activity', title: 'Rosendals Trädgård café', time_label: 'Afternoon', sort_order: 1,
    description: 'Stockholm\'s most beloved organic garden café, set in a 19th-century greenhouse on Djurgården. Pick-your-own flowers, organic pastries, long communal tables in the garden.',
    tags: ['Café', 'Garden', 'Organic', 'Relaxed'],
    metadata: {
      what_to_expect: 'A working biodynamic market garden with a café inside a beautiful old greenhouse. The pastries and bread are made on-site — the cardamom buns are extraordinary. You queue, pick your food, and find a table in the greenhouse or the garden.',
      duration: '1–2 hours',
      nearest_station: 'Walk from Djurgårdsbron or continue from the island walk — about 15 min walk from the main entrance',
      best_time: 'Lunchtime (11am–2pm)',
      tip: 'Cash and card both accepted. The pick-your-own flowers are cheap and make a lovely thing to bring back to Komal\'s. Arrive before 1pm on weekends — it fills up.',
      cost: 'Lunch ~150–200 SEK/person',
      website: 'rosendalstradgard.se',
      elderly_friendly: 'Yes — flat paths, seating available throughout',
      kid_friendly: 'Yes — Mira can explore the garden freely',
    }
  },

  // ── DAY 3 · Free Stockholm day — Junibacken + Rosendals ──────────────
  {
    day_number: 3, type: 'activity', title: "Junibacken children's museum", time_label: '10:00', sort_order: 0,
    description: "The Pippi Longstocking museum on Djurgården — Story Train, play areas, and Astrid Lindgren's world.",
    tags: ['Kids', 'Ticket', "Mira's highlight", 'Djurgården'],
    metadata: {
      what_to_expect: "The Story Train glides slowly through a darkened forest past Pippi's villa, Karlsson's rooftop, Emil's farm — each scene in extraordinary detail. Mira will be spellbound. Play area where children can climb into Pippi's house.",
      duration: '1.5–2 hours',
      nearest_station: 'Djurgårdsbron (Bus 69) — 5 min walk',
      best_time: 'Morning — grab a Story Train slot when you arrive',
      tip: "Already visited Vasa Museum on Day 1. Junibacken is right next door.",
      cost: '~185 SEK adult, ~155 SEK child',
      website: 'junibacken.se',
      elderly_friendly: 'Yes — seated Story Train, flat access',
      kid_friendly: 'Yes — designed for children aged 1–10',
    }
  },
  {
    day_number: 3, type: 'activity', title: 'Rosendals Trädgård café', time_label: 'Afternoon', sort_order: 1,
    description: "Stockholm's most beloved organic garden café in a 19th-century greenhouse on Djurgården. Pick-your-own flowers, organic pastries, long tables in the garden.",
    tags: ['Café', 'Garden', 'Organic', 'Relaxed', 'Djurgården'],
    metadata: {
      what_to_expect: 'A working biodynamic market garden with a café inside a beautiful old greenhouse. Pastries and bread made on-site — the cardamom buns are extraordinary.',
      duration: '1–2 hours',
      nearest_station: '15 min walk from Junibacken along the island',
      best_time: 'Lunchtime (11am–2pm)',
      tip: 'Arrive before 1pm — it fills up on summer weekends.',
      cost: 'Lunch ~150–200 SEK/person',
      website: 'rosendalstradgard.se',
      elderly_friendly: 'Yes — flat paths, seating throughout',
      kid_friendly: 'Yes — Mira can explore the garden freely',
    }
  },
  {
    day_number: 3, type: 'activity', title: 'Nobel Museum', time_label: '15:00', sort_order: 2,
    description: "Inside Gamla Stan's Stortorget — interactive museum on the Nobel Prize and its laureates. (Gamla Stan already visited on Day 1 — this is the Nobel Museum specifically.)",
    tags: ['Museum', 'Ticket', 'History'],
    metadata: {
      what_to_expect: 'The museum tells the stories of Nobel laureates through their actual possessions, letters, and video testimonies. The ceiling installation — thousands of hanging laureate portraits — is visually stunning.',
      duration: '1–1.5 hours',
      nearest_station: 'Gamla Stan T-bana — 2 min walk',
      tip: 'Look underneath the chairs in the Nobel Prize café — many are signed by past laureates.',
      cost: '~130 SEK adult',
      website: 'nobelprizemuseum.se',
      elderly_friendly: 'Yes — flat, accessible',
      kid_friendly: 'Yes — interactive displays',
    }
  },

  // ── DAY 4 · Vaxholm archipelago ───────────────────────────
  {
    day_number: 4, type: 'activity', title: 'Ferry to Vaxholm', time_label: '09:30', sort_order: 0,
    description: 'Waxholmsbolaget ferry from Strömkajen in the city centre to Vaxholm island. One of the most scenic short journeys in Scandinavia — through 14,000 islands.',
    tags: ['Ferry', 'Scenic', 'Family friendly', 'Day trip'],
    metadata: {
      what_to_expect: 'A slow, beautiful 70-minute ferry journey through the Stockholm archipelago. The water is calm, the scenery is extraordinary, and you can sit on the open deck. The ferry passes dozens of small islands and traditional red summer houses.',
      duration: '70 min each way',
      nearest_station: 'Strömkajen (walk from Gamla Stan or Kungsträdgården)',
      departure: 'Ferries roughly every 1–2 hours from Strömkajen. Check waxholmsbolaget.se for exact times.',
      best_time: 'Take the 09:30 ferry to get a full day on the island',
      tip: 'Buy a Stockholm archipelago card (Waxholmsbolaget) for unlimited ferry travel. Sit on the upper open deck for the best views. Bring layers — it can be cool on the water.',
      cost: '~165 SEK return adult',
      website: 'waxholmsbolaget.se',
      elderly_friendly: 'Yes — seated ferry journey, flat boarding',
      kid_friendly: 'Yes — the open deck is exciting for children',
    }
  },
  {
    day_number: 4, type: 'activity', title: 'Vaxholm island — swim & picnic', time_label: '11:00', sort_order: 1,
    description: 'Vaxholm is the gateway to the Stockholm archipelago — a small, charming island with a historic fortress, swimming rocks, and excellent picnic spots.',
    tags: ['Swimming', 'Picnic', 'Outdoors', 'Relaxed'],
    metadata: {
      what_to_expect: 'The harbour town is tiny but lovely — a few streets of painted wooden houses, a bakery, a fish smokehouse, and the 16th-century Vaxholm Fortress rising from the water nearby. The swimming is off smooth granite rocks — clear, cold water.',
      duration: 'Full afternoon — return ferry around 17:00',
      nearest_station: 'Vaxholm ferry terminal (walk everywhere from there)',
      best_time: 'Midday for swimming — the sun hits the rocks perfectly',
      tip: 'Buy lunch from the Vaxholm fish smokehouse on the harbour — smoked salmon on crispbread is the local specialty. The fortress can be visited by small boat from the harbour (~100 SEK).',
      cost: 'Lunch ~150 SEK, fortress optional',
      elderly_friendly: 'Harbour walk is flat. Swimming rocks require some care.',
      kid_friendly: 'Yes — swimming, harbour exploration, lots of open space',
    }
  },

  // ── DAY 5 · Gamla Stan + Nobel Museum ────────────────────
  {
    day_number: 5, type: 'activity', title: 'Gamla Stan walk', time_label: 'Morning', sort_order: 0,
    description: 'A slower, more relaxed morning in the medieval old town — without the time pressure of the previous evening visit.',
    tags: ['History', 'Free', 'Walking', 'Relaxed'],
    metadata: {
      what_to_expect: 'Gamla Stan is completely different in the morning — quieter, with shopkeepers setting up and the light low and golden. Stortorget (Sweden\'s oldest square) has been the centre of Stockholm life since the 13th century.',
      duration: '1.5–2 hours',
      nearest_station: 'Gamla Stan T-bana',
      best_time: 'Before 10am — significantly less crowded',
      tip: 'Find Mårten Trotzigs gränd — Stockholm\'s narrowest alley at just 90cm wide. The Royal Palace changing of the guard is at 12:15 on weekdays and 13:15 on weekends — worth timing your visit around it.',
      cost: 'Free',
      elderly_friendly: 'Cobblestones — wear supportive shoes',
      kid_friendly: 'Yes',
    }
  },
  {
    day_number: 5, type: 'activity', title: 'Nobel Museum', time_label: '10:30', sort_order: 1,
    description: 'Inside Gamla Stan\'s Stortorget — an interactive museum on the Nobel Prize and its laureates, housed in the old Stock Exchange building.',
    tags: ['Museum', 'Ticket', 'Interactive', 'All ages'],
    metadata: {
      what_to_expect: 'The museum tells the stories of Nobel laureates through their actual possessions, letters, and video testimonies. The ceiling installation — thousands of hanging laureate portraits — is visually stunning. The café underneath has chairs that previous laureates have signed on the underside.',
      duration: '1–1.5 hours',
      nearest_station: 'Gamla Stan T-bana — 2 min walk',
      best_time: 'Mid-morning',
      tip: 'Look underneath the chairs in the Nobel Prize café — many are signed by past laureates who ate there. The museum shop has interesting books and gifts.',
      cost: '~130 SEK adult',
      website: 'nobelprizemuseum.se',
      elderly_friendly: 'Yes — flat, accessible',
      kid_friendly: 'Yes — interactive displays',
    }
  },
  {
    day_number: 5, type: 'activity', title: 'Stortorget fika', time_label: 'Afternoon', sort_order: 2,
    description: 'Traditional Swedish fika in the oldest square in Stockholm. Coffee and a cardamom bun — Sweden\'s national ritual.',
    tags: ['Fika', 'Coffee', 'Relaxed', 'Swedish tradition'],
    metadata: {
      what_to_expect: 'Fika is more than just a coffee break in Sweden — it\'s a social ritual. Sit in Stortorget with a strong black coffee and a kardemummabulle (cardamom bun) or a kanelbulle (cinnamon bun). Watch the square. Take your time.',
      duration: '45 min–1 hour',
      nearest_station: 'Gamla Stan T-bana',
      tip: 'Café Järntorget on the square is good. The buns are freshly baked. A coffee and bun is ~80–100 SEK per person.',
      cost: '~80–100 SEK/person',
      elderly_friendly: 'Yes — seated, relaxed',
      kid_friendly: 'Yes — the buns are always popular',
    }
  },

  // ── DAY 6 · Thorslunda + Sigtuna ─────────────────────────
  {
    day_number: 6, type: 'activity', title: 'Thorslunda strawberry picking', time_label: '10:30', sort_order: 0,
    description: 'Self-picking strawberries at Thorslundagård farm, 45 min west of Solna by car. Swedish jordgubbar (strawberries) in late July are extraordinary — small, intensely sweet, and nothing like supermarket fruit.',
    tags: ['Outdoors', 'Family friendly', 'Kids', 'Komal\'s car'],
    metadata: {
      what_to_expect: 'You pick your own strawberries straight from the rows, weigh them, and pay by the kilo. The farm café serves waffles with jam and ice cream. The grandparents can sit at the café while others pick.',
      duration: '1.5–2 hours including café stop',
      nearest_station: 'Drive — ~45 min from Solna via Ekerö road (Komal\'s car)',
      address: 'Torslundagård, 17996 Svartsjö',
      best_time: '10:00–12:00 — before the afternoon rush',
      tip: 'Check thorslundagard.se or call the day before to confirm strawberries are available — late July is the tail end of the season. Pick more than you think you need — they disappear fast. Eat with cream.',
      cost: '~40–60 SEK/kg strawberries',
      website: 'thorslundagard.se',
      elderly_friendly: 'Farm café is flat and accessible. Field picking requires bending — grandparents can wait at the café.',
      kid_friendly: 'Yes — Mira will love picking and eating',
    }
  },
  {
    day_number: 6, type: 'activity', title: 'Sigtuna old town', time_label: '14:00', sort_order: 1,
    description: 'Sweden\'s oldest town, founded around 980 AD. A single beautiful main street (Stora gatan), Viking rune stones, a lakeside café, and church ruins from the 12th century.',
    tags: ['History', 'Elderly friendly', 'Scenic', 'Komal\'s car'],
    metadata: {
      what_to_expect: 'Sigtuna is tiny — you can walk the whole town in 20 minutes. Stora gatan is lined with small shops and cafés. The Viking rune stones are embedded right into the street and surrounding walls. Lake Mälaren is at the end of the main street.',
      duration: '2–3 hours',
      nearest_station: 'Drive from Thorslunda — ~45 min via E18 (clockwise loop back to Solna)',
      best_time: 'Afternoon — lovely light on the lake',
      tip: 'Have fika at Tant Bruns Kaffestuga on Stora gatan — one of the most charming cafés in Sweden. The rune stones on the high street are over 1,000 years old. Look for the runestone embedded in the wall of St Lars church ruins.',
      cost: 'Free to walk. Café ~100 SEK/person.',
      elderly_friendly: 'Yes — flat main street, café seating available',
      kid_friendly: 'Yes — open lakeside area, historic ruins to explore',
    }
  },

  // ── DAY 7 · IKEA + Shopping ──────────────────────────────
  {
    day_number: 7, type: 'activity', title: 'IKEA Barkarby', time_label: '10:00', sort_order: 0,
    description: 'IKEA Barkarby — the classic Swedish experience. Swedish meatballs in the café first, then the full store. Komal knows the route.',
    tags: ['Shopping', 'Food', 'Swedish experience'],
    metadata: {
      what_to_expect: 'Start with breakfast in the IKEA café — the Swedish meatball plate is ~60 SEK and genuinely good. Then browse the store. Good for small household items, Swedish food products (lingonberry jam, cloudberry preserve, Swedish candy) to take home.',
      duration: '2–3 hours',
      nearest_station: 'IKEA Barkarby — drive with Komal or take pendeltåg to Barkarby station (20 min from Stockholm)',
      address: 'IKEA Barkarby, Stockholm',
      best_time: 'Weekday morning — much less crowded than weekends',
      tip: 'Buy lingonberry jam, cloudberry preserve, Daim chocolate, and Swedish candy (lösgodis) to take home as gifts — all available in the Swedish food market section.',
      cost: 'Meatball café ~60–80 SEK, shopping budget as needed',
      elderly_friendly: 'Yes — trolleys and lifts available throughout',
      kid_friendly: 'Yes — Småland play area available',
    }
  },
  {
    day_number: 7, type: 'activity', title: '157 + Barkarbystaden shopping', time_label: 'Afternoon', sort_order: 1,
    description: 'Outdoor lifestyle store 157 and the Barkarbystaden shopping area near IKEA. Good for clothing, outdoor gear, and last-minute travel items.',
    tags: ['Shopping', 'Practical', 'Outdoor gear'],
    metadata: {
      what_to_expect: '157 is a Swedish outdoor and lifestyle clothing brand — good quality at reasonable prices. The surrounding Barkarbystaden area has a mix of Swedish chains and international brands.',
      duration: '1.5–2 hours',
      nearest_station: 'Barkarby station or drive from IKEA',
      tip: 'Good for buying lightweight rain jackets, walking shoes, or any practical items you forgot to pack.',
      cost: 'Budget as needed',
      elderly_friendly: 'Yes — flat shopping area',
      kid_friendly: 'Yes',
    }
  },

  // ── DAY 8 · Kayaking + Train to Malmö ────────────────────
  {
    day_number: 8, type: 'activity', title: 'Långholmen kayaking', time_label: '10:00', sort_order: 0,
    description: 'Morning kayaking session on the calm Pålsund canal around Långholmen island. Just Sumit, Aishwarya, and Komal. Grandparents and Mira relax at the Långholmen beach nearby.',
    tags: ['Active', 'Adults', 'Book ahead', 'Morning only'],
    metadata: {
      what_to_expect: 'The Pålsund canal is sheltered and completely calm — perfect for beginners. No experience needed. Single and tandem kayaks available. The water is clean enough to swim in. The route takes you around the island with city views.',
      duration: '2 hours',
      nearest_station: 'Bus 40 to Långholmsbron, or 20 min walk from Slussen',
      best_time: '10am session — finish by noon to allow time to pack for the train',
      tip: 'Book at langholmenkajak.se in advance — July slots fill fast. All participants must be able to swim. Life jackets provided. Grandparents: Långholmen beach has flat grassy areas and a small café.',
      cost: '~250–350 SEK/kayak for 2 hours',
      website: 'langholmenkajak.se',
      elderly_friendly: 'Not for kayaking. Långholmen beach is flat and accessible for waiting.',
      kid_friendly: 'Mira stays at the beach — not suitable for toddlers in kayaks',
    }
  },
  {
    day_number: 8, type: 'alert', title: '⚠️ Pack all bags tonight', time_label: 'Evening', sort_order: 1,
    description: 'Train to Malmö departs Stockholm Central at 07:19 tomorrow (Fri 1 Aug). Leave Solna by 06:15am. Everything must be packed and ready tonight — do not leave it to the morning.',
    tags: ['Alert', 'Critical'],
    metadata: { action: 'Pack everything tonight. Set alarm for 06:00am.' }
  },
  {
    day_number: 8, type: 'transport', title: 'Train to Malmö (tomorrow 07:19)', time_label: '07:19 tmrw', sort_order: 2,
    description: 'SJ X2000 high-speed train from Stockholm Central to Malmö Central. 4h 34m journey. All 5 seats confirmed in Carriage 7.',
    tags: ['Train', 'Confirmed', 'All 5 passengers'],
    metadata: {
      ref: 'W5UNRLKY', from: 'Stockholm Central', to: 'Malmö Central',
      dep: '07:19', arr: '11:53', op: 'SJ X2000', num: 'Train 523', carriage: 'Carriage 7',
      duration: '4h 34m',
      passengers: 'Sumit S27W · Aishwarya S28A · Dinesh S24A · Cheramanywati S23W · Komal S26W · Yogesh S25A · Mira S29A · Archie S30W',
      amenities: 'Bistro car · Breakfast · Wifi · Wheelchair lift',
      tip: 'SJ X2000 has Bistro car, breakfast service, and Wifi. Seats 23–30 are all in Carriage 7. Left side of train for Lake Vättern views.',
    }
  },

  // ── DAY 9 · Malmö ────────────────────────────────────────
  {
    day_number: 9, type: 'transport', title: 'Train Stockholm → Malmö', time_label: '07:19', sort_order: 0,
    description: 'SJ X2000 Train 523. Departs Stockholm Central. 4h 34m direct. The train passes Lake Vättern — worth being awake for.',
    tags: ['Train', 'Confirmed'],
    metadata: {
      ref: 'W5UNRLKY', dep: '07:19', arr: '11:53',
      carriage: 'Carriage 7', tip: 'Sit left side of train for Lake Vättern views'
    }
  },
  {
    day_number: 9, type: 'activity', title: 'Malmöhus Castle', time_label: '14:00', sort_order: 1,
    description: 'Scandinavia\'s oldest Renaissance castle, built in 1434. Houses the city museum, natural history museum, aquarium, and art gallery — all on one ticket.',
    tags: ['Museum', 'Castle', 'Family friendly', 'Ticket'],
    metadata: {
      what_to_expect: 'The castle is surprisingly large inside — the aquarium is particularly good for Mira, with sharks and rays. The city museum tells Malmö\'s history from medieval fishing village to modern multicultural city. The art gallery has rotating exhibitions.',
      duration: '2–3 hours',
      nearest_station: 'Walk from Malmö Central — about 15 min through the park',
      best_time: 'Early afternoon after arriving from Stockholm',
      tip: 'The moat around the castle is lovely for a post-museum walk. The castle park (Kungsparken) surrounding it is beautiful and free.',
      cost: '~130 SEK adult, children free under 19',
      elderly_friendly: 'Yes — lifts available, flat grounds',
      kid_friendly: 'Yes — aquarium and open castle grounds',
    }
  },
  {
    day_number: 9, type: 'activity', title: 'Ribersborg beach', time_label: '17:00', sort_order: 2,
    description: 'Malmö\'s famous city beach — 2km of sandy shoreline with the Kallbadhus (cold bath house) at the end of a wooden jetty extending into the water.',
    tags: ['Beach', 'Swimming', 'Sunset', 'Family friendly'],
    metadata: {
      what_to_expect: 'A long, flat, sandy beach with calm water. The Kallbadhus is a traditional Swedish cold bath house on a jetty — you can swim, use the sauna, or just walk out to enjoy the views across to Denmark.',
      duration: '1.5–2 hours',
      nearest_station: 'Bus 2 from Stortorget, or 25 min walk from Malmöhus Castle',
      best_time: 'Evening — golden hour light over the water is beautiful',
      tip: 'Walk to the end of the Kallbadhus jetty for views across the Øresund to Denmark. The Turning Torso skyscraper is visible from the beach.',
      cost: 'Free beach. Kallbadhus entry ~100 SEK.',
      elderly_friendly: 'Yes — flat sand, long promenade',
      kid_friendly: 'Yes — calm, safe swimming',
    }
  },
  {
    day_number: 9, type: 'stay', title: 'Hyllie kyrkoväg 48', time_label: 'After 16:00', sort_order: 3,
    description: 'Julia\'s Airbnb in Hyllie — the perfect base for Malmö and Copenhagen day trips. 3 stops from Malmö Central on the metro, and just 2 stops from the Øresund bridge.',
    tags: ['Stay', '3 nights', 'Airbnb'],
    metadata: {
      host: 'Julia', host_phone: '+46 73 515 61 93', airbnb_ref: 'HM5KE8JFPJ',
      property_name: 'Zenith Malmö',
      address: 'Hyllie kyrkoväg 48, Malmö, Skåne County 216 16, Sweden',
      checkIn: 'After 16:00 · Thu 30 Jul', checkOut: '10:00am · Sun 2 Aug', nights: '3',
      guests: '6 guests, 1 child, 1 infant',
      airbnb: 'true',
      nearest_station: 'Hyllie station (metro/Pågatågen) — 3 min walk',
      tip: 'Call Julia on +46 73 515 61 93 if any issues. Hyllie station to CPH Airport is direct — about 35 min.',
      alert: '⚠️ CPH flight departs 08:10 on Aug 2. Leave this Airbnb by 05:30am.',
    }
  },

  // ── DAY 10 · Copenhagen day trip ─────────────────────────
  {
    day_number: 10, type: 'activity', title: 'Train to Copenhagen', time_label: 'Morning', sort_order: 0,
    description: 'Øresund train from Malmö Central to Copenhagen Central — 35 minutes across one of Europe\'s great engineering achievements.',
    tags: ['Train', 'Scenic', 'Øresund bridge'],
    metadata: {
      what_to_expect: 'The Øresund Bridge is 8km long — half bridge, half tunnel. The train emerges from the tunnel on the Danish side to cross the water on the bridge section. On a clear day you can see both countries at once.',
      duration: '35 min each way',
      nearest_station: 'Malmö Central (from Hyllie take the metro 2 stops)',
      departure: 'Øresund trains run every 20 minutes. No booking needed — buy at the machine.',
      tip: 'Sit on the right side of the train going to Copenhagen for the best bridge views. A return ticket is ~170 DKK (or ~220 SEK). The Copenhagen card is worth buying if you plan multiple museums.',
      cost: '~170 DKK return',
      elderly_friendly: 'Yes — direct train, seated',
      kid_friendly: 'Yes — the bridge crossing is exciting',
    }
  },
  {
    day_number: 10, type: 'activity', title: 'Rosenborg Castle + King\'s Garden', time_label: '10:30', sort_order: 1,
    description: 'A 17th-century royal castle housing the actual Danish crown jewels — the sceptre, orb, and crown used at coronations. The surrounding King\'s Garden is beautiful and free.',
    tags: ['Museum', 'Crown jewels', 'History', 'Ticket'],
    metadata: {
      what_to_expect: 'The castle is compact but richly decorated — the Great Hall, the Winter Room, and the basement Treasury (where the crown jewels are kept under heavy security) are the highlights. The jewels are the real ones — not reproductions.',
      duration: '1.5 hours for castle, 30 min for gardens',
      nearest_station: 'Nørreport station (metro/S-tog) — 5 min walk',
      best_time: 'Morning, when it opens — queues build up by midday',
      tip: 'The King\'s Garden surrounding the castle is free to enter and a lovely place for the grandparents to sit while others visit the castle. The garden has a puppet theatre in summer.',
      cost: '~160 DKK adult, children under 18 free',
      elderly_friendly: 'Castle has some narrow passages. Gardens completely flat.',
      kid_friendly: 'Yes — the crown jewels fascinate children',
    }
  },
  {
    day_number: 10, type: 'activity', title: 'Nyhavn waterfront', time_label: '14:00', sort_order: 2,
    description: 'Copenhagen\'s iconic canal — 17th-century merchant houses in vivid colours reflected in the water. Once a working harbour, now the most photographed spot in Denmark.',
    tags: ['Iconic', 'Canals', 'Food', 'Photos'],
    metadata: {
      what_to_expect: 'Nyhavn is about 200m of canal lined with restaurants, bars, and the coloured houses. Canal boat tours depart from here every 30 minutes. Hans Christian Andersen lived in three different houses on Nyhavn (numbers 18, 20, and 67).',
      duration: '1.5–2 hours',
      nearest_station: 'Kongens Nytorv metro station — 2 min walk',
      best_time: 'Afternoon — the light hits the coloured houses beautifully',
      tip: 'For lunch, walk one block back from the canal to find restaurants at half the tourist price. The canal boat tour (45 min) gives a great perspective on the city and is seated — perfect for grandparents.',
      cost: 'Canal boat tour ~120 DKK. Lunch varies.',
      elderly_friendly: 'Yes — flat promenade, canal boat tour is seated',
      kid_friendly: 'Yes — boats, colourful buildings, open waterfront',
    }
  },
  {
    day_number: 10, type: 'alert', title: '⚠️ Return to Malmö early', time_label: 'Evening', sort_order: 3,
    description: 'Flight CPH→AMS departs 08:10 tomorrow. Leave Malmö Airbnb by 05:30am. Back from Copenhagen by 19:00 at the latest for rest.',
    tags: ['Alert', 'Critical'],
    metadata: { action: 'Return train to Malmö by 19:00. Early night essential.' }
  },

  // ── DAY 11 · Fly to Netherlands ──────────────────────────
  {
    day_number: 11, type: 'alert', title: '⚠️ Leave Malmö Airbnb by 05:30am', time_label: '05:30', sort_order: 0,
    description: 'Train from Hyllie station directly to CPH Airport. About 35–40 minutes. The tightest departure of the whole trip — do not be late.',
    tags: ['Alert', 'Critical', 'Early start'],
    metadata: { action: 'Bags packed night before. Taxi or walk to Hyllie station. Train direct to CPH Airport.' }
  },
  {
    day_number: 11, type: 'transport', title: 'Fly CPH → Amsterdam', time_label: '08:10', sort_order: 1,
    description: 'Norwegian D83538. 1h 25m. All 5 passengers confirmed. Check in online the night before.',
    tags: ['Flight', 'Confirmed'],
    metadata: {
      ref: 'XVDUPJ', from: 'Copenhagen (CPH)', to: 'Amsterdam Schiphol (AMS)',
      dep: '08:10', arr: '09:35', op: 'Norwegian', num: 'D83538',
      duration: '1h 25m',
      tip: 'Check in online the night before. Norwegian has strict baggage rules — check bag allowance on your booking.',
    }
  },
  {
    day_number: 11, type: 'activity', title: 'Train Schiphol → Sprang-Capelle', time_label: '10:30', sort_order: 2,
    description: 'Train from Schiphol Airport to Tilburg or \'s-Hertogenbosch, then taxi to Dijkstraat 12, Sprang-Capelle. About 1.5 hours total.',
    tags: ['Train', 'Transfer'],
    metadata: {
      what_to_expect: 'Schiphol has excellent direct train connections. Take the Intercity to Tilburg (about 1 hour), then a taxi (~20 min) to Sprang-Capelle. Alternatively, train to \'s-Hertogenbosch and taxi.',
      duration: '~1.5 hours from Schiphol',
      nearest_station: 'Schiphol Airport station (directly under the airport)',
      tip: 'Buy train tickets at the yellow NS machines in the airport. A taxi from Tilburg to Sprang-Capelle is ~30 EUR. Pre-book via Uber or local taxi if possible.',
      cost: '~25 EUR train + ~30 EUR taxi',
    }
  },
  {
    day_number: 11, type: 'stay', title: 'Dijkstraat 12, Sprang-Capelle', time_label: 'After 15:00', sort_order: 3,
    description: 'Sonny\'s Airbnb in Sprang-Capelle — just 20 minutes from Efteling. Rest well tonight — Efteling tomorrow is a full day.',
    tags: ['Stay', '2 nights', 'Airbnb', 'Efteling base'],
    metadata: {
      host: 'Sonny', host_phone: '+31 6 22351393', airbnb_ref: 'HM55P4XKR2',
      property_name: 'Eftelhuysje',
      address: 'Dijkstraat 12 Buitenhuis, Sprang-Capelle, Noord-Brabant 5161 BV, Netherlands',
      checkIn: 'After 15:00 · Sun 2 Aug', checkOut: '10:00am · Tue 4 Aug', nights: '2',
      guests: '6 guests',
      airbnb: 'true',
      tip: '10 minutes from Efteling — confirmed from listing. Free parking on site. Call Sonny on +31 6 22351393. Book taxi to Efteling tonight for tomorrow morning (~€20–25).',
      nearest_station: 'Taxi from Tilburg station (~20 min)',
    }
  },

  // ── DAY 12 · Efteling ────────────────────────────────────
  {
    day_number: 12, type: 'activity', title: 'Taxi to Efteling', time_label: '09:30', sort_order: 0,
    description: 'Pre-booked taxi from Dijkstraat 12 to Efteling theme park. About 20 minutes. Book tonight.',
    tags: ['Taxi', 'Book tonight', 'Transfer'],
    metadata: {
      duration: '~20 min drive',
      address: 'Efteling, Europalaan 1, Kaatsheuvel',
      tip: 'Book via Uber or a local Tilburg taxi company the night before. ~€20–25 one way. Park opens at 10am.',
    }
  },
  {
    day_number: 12, type: 'activity', title: 'Efteling — full day', time_label: '10:00', sort_order: 1,
    description: 'Europe\'s greatest fairytale theme park. Opened in 1952 — older than Disneyland. Open 10am–8pm in August. Plan a full day.',
    tags: ['Theme park', 'Must-do', 'Summer tickets', 'Family'],
    metadata: {
      what_to_expect: 'Efteling is a full-day experience with something for every age. The park is beautifully maintained with mature woodland throughout. It\'s large — wear comfortable shoes and don\'t try to do everything. Focus on the Fairytale Forest in the morning (grandparents and Mira) and the rides in the afternoon.',
      duration: 'Full day — 10am to 8pm',
      nearest_station: 'Taxi from Sprang-Capelle (~20 min)',
      best_time: 'Arrive at 10am when it opens. Fairytale Forest first before it gets crowded.',
      tip: 'Book SUMMER TICKETS at efteling.com — normal tickets are not valid in August. The Aquanura fountain show is at 8pm and is the best way to end the day. Download the Efteling app for live wait times.',
      cost: '~€38–53 per person depending on the day. Book in advance.',
      website: 'efteling.com',
      elderly_friendly: 'Yes — the Fairytale Forest and Gondoletta are perfect. Wheelchairs available.',
      kid_friendly: 'Yes — this is Mira\'s day. The Fairytale Forest will be magical for her.',
    }
  },
  {
    day_number: 12, type: 'activity', title: 'Fairytale Forest — Sprookjesbos', time_label: '10:00', sort_order: 2,
    description: 'The oldest part of Efteling — an enchanted walk through old-growth woodland with 30 elaborate fairy tale scenes built over 70 years.',
    tags: ['Must-do', 'Elderly friendly', 'Kids', 'Fairytale'],
    metadata: {
      what_to_expect: 'Each scene is a large, detailed diorama — Sleeping Beauty\'s castle, Hansel and Gretel\'s witch\'s house, the Six Swans, Little Red Riding Hood. The woodland itself is beautiful. The pace is slow and contemplative. Grandparents will love this as much as the children.',
      duration: '1.5–2 hours at a relaxed pace',
      tip: 'Go first thing at 10am before it gets crowded. The path is fully flat and paved. Some of the scenes have moving figures and sound — stand and watch for a full minute.',
      elderly_friendly: 'Yes — flat, paved path throughout. Benches at each scene.',
      kid_friendly: 'Yes — the centrepiece of Efteling for young children',
    }
  },
  {
    day_number: 12, type: 'activity', title: 'Gondoletta + Baron 1898', time_label: 'Afternoon', sort_order: 3,
    description: 'Gondoletta: a peaceful solar-powered wooden boat gliding around the park\'s main lake. Baron 1898: a mine-shaft drop coaster with a 37m vertical fall.',
    tags: ['Boat', 'Thrill ride', 'Family'],
    metadata: {
      what_to_expect: 'The Gondoletta is 20 minutes of complete calm — seated in a wooden gondola drifting around the lake with views of the park. Perfect for grandparents and Mira. Baron 1898 is for the thrill-seekers — the queue is themed as a 19th-century mine, and the drop is one of the best in Europe.',
      tip: 'Check wait times on the Efteling app. Gondoletta is best in the afternoon when the lake light is beautiful.',
      elderly_friendly: 'Gondoletta yes. Baron 1898 — check with your doctor.',
      kid_friendly: 'Gondoletta yes. Baron 1898 — height restriction applies.',
    }
  },
  {
    day_number: 12, type: 'activity', title: 'Aquanura water show', time_label: '20:00', sort_order: 4,
    description: '25-minute choreographed fountain show with fire columns, water jets 30 metres high, coloured lights, and an original musical score. One of the best theme park shows in Europe.',
    tags: ['Must-see', 'Evening show', 'All ages'],
    metadata: {
      what_to_expect: 'The entire park gathers around the main lake for Aquanura. 750 fountains, fire effects, and a sweeping musical score. Find a spot at the lake edge 20 minutes before it starts. Bring a light jacket — it gets cool by 8pm in early August.',
      duration: '25 minutes',
      best_time: '20:00 — the final event of the day',
      tip: 'The best viewing spots are the eastern bank of the lake. Arrive 20 min early to get a front-row position.',
      elderly_friendly: 'Yes — standing only but brief',
      kid_friendly: 'Yes — Mira will love the fire and fountains',
    }
  },

  // ── DAY 13 · Rotterdam ───────────────────────────────────
  {
    day_number: 13, type: 'activity', title: 'Train to Rotterdam', time_label: 'Morning', sort_order: 0,
    description: 'Check out Sprang-Capelle by 10am. Train from Tilburg to Rotterdam Centraal (~45 min). Check in with Alexander after 3pm.',
    tags: ['Train', 'Travel day'],
    metadata: {
      duration: '~45 min train',
      nearest_station: 'Tilburg station (taxi from Sprang-Capelle, ~20 min)',
      tip: 'Direct Intercity from Tilburg to Rotterdam Centraal. Very frequent service.',
    }
  },
  {
    day_number: 13, type: 'activity', title: 'Markthal', time_label: '13:00', sort_order: 1,
    description: 'Rotterdam\'s extraordinary indoor market hall — a 40-metre-high horseshoe arch entirely enclosed in glass, whose inner ceiling is covered by an 11,000m² artwork of fruits and vegetables.',
    tags: ['Architecture', 'Food', 'Market', 'Must-see'],
    metadata: {
      what_to_expect: 'The building itself is the attraction. The ceiling mural — called Hoorn des Overvloeds (Horn of Plenty) — is the largest artwork in the Netherlands. Below it: 100 market stalls selling food from around the world, plus restaurants, a supermarket, and a food court.',
      duration: '1–1.5 hours',
      nearest_station: 'Blaak metro station — 2 min walk',
      best_time: 'Lunchtime — perfect for eating your way through the market',
      tip: 'Look up constantly — the ceiling is the whole point. The Indonesian and Dutch herring stalls are particularly good. The Cube Houses are right next door.',
      cost: 'Free to enter. Food ~€10–20/person.',
      elderly_friendly: 'Yes — fully flat, climate controlled',
      kid_friendly: 'Yes — the ceiling is genuinely astonishing for children',
    }
  },
  {
    day_number: 13, type: 'activity', title: 'Cube Houses + Maas riverfront', time_label: '15:00', sort_order: 2,
    description: 'Piet Blom\'s 1984 experiment: 38 yellow cubes tilted at 45 degrees on hexagonal pillars. One is open as a tiny museum. Then a walk along the Maas River to the Erasmus Bridge.',
    tags: ['Architecture', 'Walk', 'Riverside'],
    metadata: {
      what_to_expect: 'The Cube Houses are just outside Markthal — you\'ll see them immediately. One cube (the Kijk-Kubus) is open as a museum showing the tilted interior. The Erasmus Bridge is a 10-minute walk along the river — best at dusk.',
      duration: '1.5 hours',
      nearest_station: 'Blaak metro station',
      tip: 'The Erasmus Bridge lights up at night — if you have energy for an evening walk it\'s beautiful. The museum inside the cube house is small but worth the 3 EUR entry.',
      cost: '€3 Kijk-Kubus museum',
      elderly_friendly: 'Flat riverside walk. Cube house interior has steep stairs — optional.',
      kid_friendly: 'Yes — the tilted architecture is disorientating and fun',
    }
  },
  {
    day_number: 13, type: 'stay', title: 'Van Brakelstraat 107, Rotterdam', time_label: 'After 15:00', sort_order: 3,
    description: 'Michiel\'s townhouse in central Rotterdam. 2 nights. Kinderdijk 30 min by water bus. Den Haag 25 min by direct train.',
    tags: ['Stay', '2 nights', 'Airbnb', 'Central Rotterdam'],
    metadata: {
      host: 'Michiel', host_phone: '+31 6 49253898', airbnb_ref: 'HMRDYAK4RN',
      property_name: 'City house in the middle of Rotterdam!',
      address: 'Van Brakelstraat 107, Rotterdam, Zuid-Holland 3012 XW, Netherlands',
      checkIn: 'After 15:00 · Tue 4 Aug', checkOut: '11:00am · Thu 6 Aug', nights: '2',
      guests: '6 guests, 2 infants',
      airbnb: 'true',
      tip: 'Call Michiel on +31 6 49253898. Central Rotterdam location.',
      nearest_station: 'Ask Alexander for nearest metro/bus stop',
    }
  },

  // ── DAY 14 · Kinderdijk + Madurodam ─────────────────────
  {
    day_number: 14, type: 'activity', title: 'Kinderdijk by water bus', time_label: '09:30', sort_order: 0,
    description: '19 windmills built in the 1740s to drain the Alblasserwaard polder — UNESCO World Heritage Site. Water bus from Rotterdam takes 30 minutes along the River Noord.',
    tags: ['UNESCO', 'Water bus', 'Elderly friendly', 'Ticket', 'Iconic'],
    metadata: {
      what_to_expect: 'The windmills are the most complete surviving example of Dutch water management from the 18th century. The path between them is completely flat and follows the canal. On a clear day the reflections in the water are extraordinary. Some windmills are open to enter.',
      duration: '2–3 hours at Kinderdijk, 30 min each way by water bus',
      nearest_station: 'Waterbus from Erasmus Bridge (Rotterdam Willemsplein) — departs every 30 min',
      best_time: 'Morning — best light and fewest crowds',
      tip: 'Buy the combination ticket (water bus + entrance) online at kinderdijk.nl. The water bus is a fun experience in itself. Rent a bicycle at Kinderdijk for a 30-min loop around the mills.',
      cost: '~€20 entry + ~€8 water bus return',
      website: 'kinderdijk.nl',
      elderly_friendly: 'Yes — completely flat path, water bus is seated',
      kid_friendly: 'Yes — windmill scale is impressive, open windmills to explore',
    }
  },
  {
    day_number: 14, type: 'activity', title: 'Madurodam, Den Haag', time_label: '14:00', sort_order: 1,
    description: '1:25 scale replica of the Netherlands — airports, windmills, canals, cities, the Delta Works, all at knee height. Mira will spend an hour pointing at things.',
    tags: ['Kids', 'Family friendly', 'Ticket', 'Interactive'],
    metadata: {
      what_to_expect: 'The entire Netherlands in a park the size of a city block. You walk between 1:25 scale models of Schiphol Airport (with tiny moving planes), the Delta Works, Kinderdijk windmills, the Binnenhof parliament, and Anne Frank\'s house. Many of the models have moving parts and interactive elements.',
      duration: '1.5–2 hours',
      nearest_station: '25 min train from Rotterdam Centraal to Den Haag Centraal, then 15 min tram',
      best_time: 'Afternoon',
      tip: 'The Vesuvius model erupts on the hour. Kids love operating the locks, the cranes, and the airport controls. The Delta Works model explains the flooding problem beautifully.',
      cost: '~€19 adult, ~€15 child',
      website: 'madurodam.nl',
      elderly_friendly: 'Yes — flat paths throughout',
      kid_friendly: 'Yes — designed for families, Mira will love the scale',
    }
  },

  // ── DAY 15 · Scheveningen + Ostend ───────────────────────
  {
    day_number: 15, type: 'activity', title: 'Scheveningen beach', time_label: 'Morning', sort_order: 0,
    description: 'Den Haag\'s North Sea beach — 3.5km of wide, flat sand with a long pier extending 400m into the sea. 15 minutes by tram from Den Haag Centraal.',
    tags: ['Beach', 'Elderly friendly', 'Family friendly', 'North Sea'],
    metadata: {
      what_to_expect: 'A wide, open beach with soft sand. The North Sea water is cold but swimmable in August (~18°C). The promenade behind the beach is flat and long — perfect for grandparents to walk while others swim. The pier has a restaurant at the end with sea views.',
      duration: '2 hours',
      nearest_station: 'Tram 1 or 9 from Den Haag Centraal — 15 min to Scheveningen',
      best_time: 'Morning before the afternoon wind picks up',
      tip: 'The North Sea can have waves and rip currents — swim between the flags. Bring a windbreaker — the coastal wind is often stronger than expected.',
      cost: 'Free',
      elderly_friendly: 'Yes — flat sand, flat promenade, pier accessible',
      kid_friendly: 'Yes — beach play, waves, pier',
    }
  },
  {
    day_number: 15, type: 'transport', title: 'Train to Ostend, Belgium', time_label: 'Afternoon', sort_order: 1,
    description: 'Train from Den Haag Centraal to Ostend via Antwerp. About 2.5 hours. Check in with Peter after 4pm.',
    tags: ['Train', 'Travel day'],
    metadata: {
      from: 'Den Haag Centraal', to: 'Ostend (Oostende)',
      duration: '~2.5 hours',
      tip: 'Buy tickets at the station. Likely one change (often at Antwerp-Centraal). Book in advance on B-Europe or SNCB website for better prices.',
    }
  },
  {
    day_number: 15, type: 'stay', title: 'Mijnplein 6A, Ostend', time_label: 'After 16:00', sort_order: 2,
    description: 'Peter\'s flat in Ostend. The North Sea is 2 minutes\' walk. Bruges is 15 min by train. Ghent is 35 min.',
    tags: ['Stay', '3 nights', 'Airbnb', 'Seaside'],
    metadata: {
      host: 'Peter', host_phone: '+32 475 35 99 38', airbnb_ref: 'HMRXFTJ4PH',
      property_name: 'Duplex appartement',
      address: 'Mijnplein 6A, Ostend, Flanders 8400, Belgium',
      checkIn: 'After 16:00 · Thu 6 Aug', checkOut: '11:00am · Sun 9 Aug', nights: '3',
      guests: '6 guests, 2 infants',
      airbnb: 'true',
      tip: 'Call Peter on +32 475 35 99 38. Bruges train from Ostend — 15 min every 30 min. De Lijn coastal tram stops near the flat.',
      nearest_station: 'Ostend station — 10 min walk',
    }
  },

  // ── DAY 16 · Bruges ──────────────────────────────────────
  {
    day_number: 16, type: 'activity', title: 'Train to Bruges', time_label: '09:30', sort_order: 0,
    description: '15-minute direct train from Ostend station to Bruges. Runs every 30 minutes.',
    tags: ['Train', '15 min', 'Easy'],
    metadata: {
      from: 'Ostend', to: 'Bruges (Brugge)', duration: '15 min',
      departure: 'Every 30 minutes from Ostend station',
      cost: '~€5.50 return', tip: 'Buy return ticket at the machine — day return is slightly cheaper.',
    }
  },
  {
    day_number: 16, type: 'activity', title: 'Canal boat tour', time_label: '10:00', sort_order: 1,
    description: 'A 30-minute seated boat tour through the medieval back canals of Bruges. The only way to see the city from water level, under its ancient stone bridges.',
    tags: ['Must-do', 'Elderly friendly', 'Boat', 'Scenic'],
    metadata: {
      what_to_expect: 'Five or six companies run almost identical tours from different points on the canal. You sit in a low wooden boat and glide under bridges, past the backs of medieval houses, through narrow waterways. The boatmen give commentary.',
      duration: '30 minutes',
      nearest_station: 'Multiple boarding points in the city centre — Rozenhoedkaai is the most scenic',
      best_time: 'As early as possible — queues build after 11am',
      tip: 'All companies are roughly equal. Queue at Rozenhoedkaai for the best scenery on boarding. No booking needed — just queue. Cash only at some operators.',
      cost: '~€12 adult, ~€7 child',
      elderly_friendly: 'Yes — seated boat, assisted boarding',
      kid_friendly: 'Yes — boats are exciting for children',
    }
  },
  {
    day_number: 16, type: 'activity', title: 'Markt + Belfry', time_label: '11:00', sort_order: 2,
    description: 'Bruges\' central square, unchanged since the 14th century. The Belfry tower (83m) can be climbed for rooftop views. Carillon plays every 15 minutes.',
    tags: ['History', 'Architecture', 'Iconic', 'Photos'],
    metadata: {
      what_to_expect: 'Markt is surrounded by guildhalls and the Provincial Court. The Belfry dates from 1240 and contains a carillon of 47 bells. The climb is 366 steps on a narrow spiral staircase.',
      duration: '1 hour in the square, 45 min for the Belfry climb',
      nearest_station: 'Walk from canal boat landing — 5 min',
      tip: 'The Belfry climb is not suitable for grandparents — steep spiral stairs. But the view from the top is genuinely spectacular. Markt itself is free to sit in and enjoy.',
      cost: '€16 Belfry entry',
      elderly_friendly: 'Markt square yes. Belfry — not recommended (366 narrow stairs)',
      kid_friendly: 'Yes for the square. Belfry — age/fitness dependent',
    }
  },
  {
    day_number: 16, type: 'activity', title: 'Minnewater Lake + chocolate', time_label: '14:00', sort_order: 3,
    description: 'The Lake of Love — a calm, willow-lined lake with white swans at the southern edge of the old city. Then: Bruges chocolate. This is not optional.',
    tags: ['Scenic', 'Walk', 'Chocolate', 'Shopping', 'Kid friendly'],
    metadata: {
      what_to_expect: 'Minnewater is a 14th-century sluice reservoir, now a beautiful swam-filled lake with a medieval lock gate. The walk from Markt to Minnewater through medieval streets takes about 20 minutes. After: Bruges has more artisan chocolatiers per square metre than anywhere.',
      duration: '2–3 hours',
      nearest_station: 'Walk from Markt (20 min)',
      tip: 'For chocolate: Dumon on Eiermarkt has been there since 1948 (their pralines are extraordinary). The Chocolate Line on Simon Stevinplein is theatrical and inventive. Budget €20–30 for chocolate per family.',
      cost: 'Lake free. Chocolate ~€20–30/family.',
      elderly_friendly: 'Yes — flat path to Minnewater',
      kid_friendly: 'Yes — swans, lake, and the chocolate tasting',
    }
  },

  // ── DAY 17 · Ostend beach day ─────────────────────────────
  {
    day_number: 17, type: 'activity', title: 'Ostend beach morning', time_label: 'Morning', sort_order: 0,
    description: 'The widest sandy beach in Belgium — completely flat and firm. Swim, build sandcastles, walk the promenade. No plans required.',
    tags: ['Beach', 'Family friendly', 'Elderly friendly', 'Relaxed'],
    metadata: {
      what_to_expect: 'A broad, flat beach with easy access from the promenade. The sand is firm enough to walk on easily. The water is cold (~18°C) but swimmable. The promenade runs for several kilometres with cafés and covered seating.',
      duration: 'Morning — 2–3 hours',
      nearest_station: '2 min walk from Mijnplein Airbnb',
      tip: 'Swim between the flags. Buy a bag of grey North Sea shrimps (grijze garnalen) from a beach shack — tiny, intensely flavoured, a Belgian coastal specialty.',
      cost: 'Free beach',
      elderly_friendly: 'Yes — flat promenade, firm sand, plenty of seating',
      kid_friendly: 'Yes — Mira\'s beach day',
    }
  },
  {
    day_number: 17, type: 'activity', title: 'Kusttram coastal tram', time_label: 'Midday', sort_order: 1,
    description: 'De Lijn Line 0 — the world\'s longest tram line, running 68km along the entire Belgian coastline from De Panne to Knokke.',
    tags: ['Tram', 'Scenic', 'Family friendly', 'World record'],
    metadata: {
      what_to_expect: 'The tram runs directly along the seafront, stopping at every coastal town. Take it 4–5 stops north to De Haan (a beautiful art nouveau coastal resort) and walk back through the dunes, or ride the whole line one way.',
      duration: '45 min each way for a good stretch',
      nearest_station: 'Multiple stops along the Ostend seafront — nearest is Ostend station area',
      tip: 'De Haan (Coq sur Mer) is the nicest stop — an entirely preserved art nouveau seaside resort from the 1900s. Get off, walk around, have lunch, take the tram back.',
      cost: '~€3.50 per journey',
      elderly_friendly: 'Yes — modern low-floor trams, seated throughout',
      kid_friendly: 'Yes — trams are always exciting',
    }
  },
  {
    day_number: 17, type: 'activity', title: 'Ostend harbour + fish market', time_label: 'Afternoon', sort_order: 2,
    description: 'Ostend\'s working harbour and fish market. North Sea shrimp, oysters, moules-frites at a harbour restaurant.',
    tags: ['Food', 'Culture', 'Seafood', 'Local experience'],
    metadata: {
      what_to_expect: 'Ostend was Belgium\'s most important fishing port. The fish market near the harbour still sells the morning\'s catch. Try moules-frites (mussels with chips) at one of the harbour restaurants — this is the Belgian coastal dish.',
      duration: '2 hours',
      nearest_station: 'Walk from the beach — 10 min',
      tip: 'Lunch at Brasserie du Phare near the harbour — excellent moules-frites, good prices. The James Ensor house (the Belgian expressionist painter) is on Vlaanderenstraat and worth a 20-min visit.',
      cost: 'Moules-frites lunch ~€18–22/person',
      elderly_friendly: 'Yes — flat harbour area, restaurant seating',
      kid_friendly: 'Yes — moules-frites is universally loved',
    }
  },

  // ── DAY 18 · Ghent + Sint-Pieters-Leeuw ─────────────────
  {
    day_number: 18, type: 'activity', title: 'Gravensteen Castle, Ghent', time_label: '11:00', sort_order: 0,
    description: 'A complete medieval water castle — moat, walls, towers — in the middle of 21st-century Ghent. Built 1180 by the Count of Flanders. Never seriously remodelled.',
    tags: ['History', 'Castle', 'Kids', 'Ticket'],
    metadata: {
      what_to_expect: 'You enter through the original gatehouse into the inner courtyard, then work your way up through the count\'s apartments, the Great Hall, the watchtower, and finally the ramparts with views over the city. The interior houses a large collection of original armour, siege weapons, and medieval torture instruments.',
      duration: '1.5 hours',
      nearest_station: 'Ghent Sint-Pieters station, then tram 1 to Gravensteen (25 min)',
      best_time: 'Midday — come straight from Ostend',
      tip: 'The self-guided audio tour is unusually good and entertaining. Mira will be fascinated by the armour. The ramparts give the best views in Ghent.',
      cost: '~€14 adult, children under 18 free',
      website: 'historischehuizen.be',
      elderly_friendly: 'Steep internal stairs — not the easiest. The inner courtyard is accessible.',
      kid_friendly: 'Yes — the armour and torture instruments are endlessly fascinating for children',
    }
  },
  {
    day_number: 18, type: 'activity', title: 'Graslei canal boat', time_label: '13:00', sort_order: 1,
    description: 'Ghent\'s most beautiful stretch — a row of medieval guild houses reflected in the Leie river. Canal boat tours depart from here.',
    tags: ['Scenic', 'Canal', 'Boat', 'Photos', 'Family friendly'],
    metadata: {
      what_to_expect: 'The Graslei and Korenlei quays face each other across the Leie river, lined with perfectly preserved 12th–17th century guild houses. The canal boat tour gives the best perspective. The area is also lovely just to sit and have lunch overlooking the water.',
      duration: '45 min boat tour + 30 min in the area',
      nearest_station: 'Walk from Gravensteen — 10 min',
      tip: 'The boat tour passes under St Michael\'s Bridge with a famous view of three medieval towers simultaneously — St Nicholas, the Belfry, and St Bavo\'s Cathedral.',
      cost: '~€10 boat tour',
      elderly_friendly: 'Yes — seated boat, flat quayside',
      kid_friendly: 'Yes',
    }
  },
  {
    day_number: 18, type: 'stay', title: 'Vlierstraat 14, Sint-Pieters-Leeuw', time_label: 'After 16:00', sort_order: 2,
    description: 'Elke\'s house in Sint-Pieters-Leeuw — a Brussels suburb 15km from the city centre. 20 min train to Brussels. 30 min taxi to BRU airport.',
    tags: ['Stay', '2 nights', 'Airbnb', 'Brussels base'],
    metadata: {
      host: 'Elke', host_phone: '+32 494 04 21 05', airbnb_ref: 'HME5Q2RBTQ',
      property_name: 'Holiday home "The Bubble"',
      address: 'Vlierstraat 14, Sint-Pieters-Leeuw, Vlaams Gewest 1600, Belgium',
      checkIn: 'After 16:00 · Sun 9 Aug', checkOut: '11:00am · Tue 11 Aug', nights: '2',
      guests: '6 guests, 1 child, 1 infant',
      airbnb: 'true',
      tip: 'Call Elke on +32 494 04 21 05. Brussels ~20 min by train. BRU airport ~30 min by taxi.',
      nearest_station: 'Sint-Pieters-Leeuw station (train to Brussels ~20 min)',
      alert: '⚠️ Flight BRU→ARN departs 18:55 on Aug 11. Leave Airbnb by 16:30. Pre-book taxi.',
    }
  },

  // ── DAY 19 · Brussels ─────────────────────────────────────
  {
    day_number: 19, type: 'activity', title: 'Grand Place + Royal Gallery', time_label: '09:00', sort_order: 0,
    description: 'Grand Place — Victor Hugo called it the most beautiful square in the world. Then the Galeries Royales Saint-Hubert, where praline was invented in 1912.',
    tags: ['History', 'Architecture', 'Food', 'Must-see'],
    metadata: {
      what_to_expect: 'Grand Place is ringed by gilded 17th-century guildhalls and the Gothic Town Hall. The detail on the facades is extraordinary — worth standing and staring for 10 minutes. The Galeries Saint-Hubert (1847) is a 213-metre glass-vaulted shopping arcade — one of the most beautiful in Europe.',
      duration: '1.5 hours',
      nearest_station: 'Brussels Central station — 5 min walk. Or metro Gare Centrale.',
      best_time: '9am — before the tour groups arrive',
      tip: 'Buy a Belgian waffle on the street — the Brussels waffle (rectangular, plain, crisp) not the Liège waffle (oval, sweet). Do not add Nutella. Neuhaus on the Galeries invented praline in 1912 and is still worth visiting.',
      cost: 'Free to visit the square and gallery',
      elderly_friendly: 'Yes — cobblestones in Grand Place, but gallery is smooth',
      kid_friendly: 'Yes — the golden guildhalls are visually spectacular',
    }
  },
  {
    day_number: 19, type: 'activity', title: 'Atomium + Mini-Europe', time_label: '13:00', sort_order: 1,
    description: 'The Atomium — 1958 World Expo structure representing an iron crystal magnified 165 billion times. Adjacent Mini-Europe: 350 monuments at 1:25 scale from across Europe.',
    tags: ['Architecture', 'Kids', 'Iconic', 'Ticket'],
    metadata: {
      what_to_expect: 'The Atomium is nine interconnected steel spheres (each 18m in diameter) connected by escalator tubes. The top sphere has 360° panoramic views over Brussels. Mini-Europe is right next door — Mira will recognise the Eiffel Tower, the Colosseum, Big Ben, and the Acropolis. The Vesuvius model erupts on the hour.',
      duration: '3 hours for both',
      nearest_station: 'Metro 6 to Heysel — 2 min walk',
      best_time: 'Afternoon',
      tip: 'Buy a combination ticket for Atomium + Mini-Europe at a slight discount. The view from the Atomium top sphere on a clear day is extraordinary — you can see the whole city.',
      cost: '~€16 Atomium, ~€15 Mini-Europe, combo discount available',
      website: 'atomium.be / minieurope.com',
      elderly_friendly: 'Atomium has lifts. Mini-Europe is flat throughout.',
      kid_friendly: 'Yes — Mini-Europe is designed for children. The Atomium escalators are exciting.',
    }
  },

  // ── DAY 20 · Fly back to Stockholm ───────────────────────
  {
    day_number: 20, type: 'alert', title: '⚠️ Leave Sint-Pieters-Leeuw by 16:30', time_label: '16:30', sort_order: 0,
    description: 'Pre-booked taxi to Brussels Airport (~30 min). Latest check-in for SK1590 is 18:10. Do not miss this flight.',
    tags: ['Alert', 'Critical'],
    metadata: { action: 'Pre-book taxi the night before. Allow 30 min + buffer. Leave 16:30 latest.' }
  },
  {
    day_number: 20, type: 'activity', title: 'Final Brussels morning', time_label: 'Morning', sort_order: 1,
    description: 'Last morning in Belgium. Revisit Grand Place for a final waffle. Stock up on chocolate gifts.',
    tags: ['Free', 'Chocolate', 'Last morning'],
    metadata: {
      tip: 'For chocolate gifts: Mary on Rue Royale or Neuhaus in the Galeries. Budget €30–50 for a selection to take home. Pierre Marcolini is the top-end option.',
    }
  },
  {
    day_number: 20, type: 'transport', title: 'Fly Brussels → Stockholm', time_label: '18:55', sort_order: 2,
    description: 'SAS SK1590. 2h 10m. Arrive Arlanda 21:05. Komal collecting.',
    tags: ['Flight', 'Confirmed'],
    metadata: {
      ref: 'YJI224', from: 'Brussels (BRU)', to: 'Stockholm Arlanda (ARN)',
      dep: '18:55', arr: '21:05', op: 'SAS', num: 'SK1590',
      duration: '2h 10m',
      tip: 'Check in online 24 hours before. Terminal A at Brussels Airport.',
    }
  },

  // ── DAY 21 · Rest day ─────────────────────────────────────
  {
    day_number: 21, type: 'activity', title: 'Full rest day at Komal\'s', time_label: 'All day', sort_order: 0,
    description: 'No plans. No alarm. Home-cooked food. After 3 weeks of travel, this day is not optional — it\'s essential.',
    tags: ['Rest', 'Family time', 'No plans'],
    metadata: {
      what_to_expect: 'Sleep, eat, sit in the garden, watch something. The grandparents especially will need a completely unstructured day. Mira will be happy just being at home.',
      tip: 'Resist the urge to plan anything. The flight home is at 06:00 the day after tomorrow — conserve energy.',
      elderly_friendly: 'Yes — this day is for them',
      kid_friendly: 'Yes',
    }
  },

  // ── DAY 22 · Farewell + Depart ───────────────────────────
  {
    day_number: 22, type: 'activity', title: 'Farewell dinner with Komal', time_label: 'Evening', sort_order: 0,
    description: 'The last meal in Europe together. Komal\'s choice — restaurant or home-cooked. This one matters.',
    tags: ['Family time', 'Farewell', 'Komal'],
    metadata: {
      tip: 'Whatever Komal wants — she\'s been hosting you for the start and end of the whole trip. Let her pick the restaurant or cook if she prefers. This is the real goodbye.',
    }
  },
  {
    day_number: 22, type: 'alert', title: '⚠️ Pack everything tonight', time_label: 'Night', sort_order: 1,
    description: 'Flight departs ARN at 06:00 tomorrow. Leave Solna at 3:00am. Set 3 alarms. Nothing for the morning — everything done tonight.',
    tags: ['Alert', 'Critical'],
    metadata: { action: 'Pack all bags. Set alarm for 02:45am. Pre-book taxi to Arlanda.' }
  },
  {
    day_number: 22, type: 'transport', title: 'Fly Stockholm → Delhi', time_label: '06:00', sort_order: 2,
    description: 'LH2421 to Munich + LH762 to New Delhi. Ref 9XUWK9. Arrive Delhi 23:55. 22 days complete.',
    tags: ['Flight', 'Confirmed', 'Journey\'s end'],
    metadata: {
      ref: '9XUWK9', from: 'Stockholm Arlanda (ARN)', to: 'New Delhi (DEL)',
      dep: '06:00', arr: '23:55', op: 'Lufthansa', num: 'LH2421 + LH762', via: 'Munich (MUC)',
      duration: '~11h total', terminal: 'Terminal 5',
      tip: 'Leave Solna at 3:00am. Arlanda Terminal 5 by 3:45am. The journey home: 22 days, 4 countries, 1 family.',
    }
  },
]

export async function GET(req: Request) {
  try {
    const supabase = getSupabase()
    const url = new URL(req.url)
    const force = url.searchParams.get('force') === 'true'

    if (force) {
      // Clear existing cards and reseed
      await supabase.from('card_photos').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('day_cards').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    } else {
      const { count, error: countError } = await supabase.from('day_cards').select('*', { count: 'exact', head: true })
      if (countError) return NextResponse.json({ error: countError.message, hint: 'Have you run supabase-schema.sql?' }, { status: 500 })
      if (count && count > 0) return NextResponse.json({ message: `Already seeded — ${count} cards exist. Add ?force=true to reseed.`, seeded: false })
    }

    const cards = SEED_CARDS.map(c => ({ ...c, status: 'upcoming', tags: c.tags || [], metadata: c.metadata || {} }))
    const { error, data } = await supabase.from('day_cards').insert(cards).select()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ message: `Seeded ${data.length} cards successfully`, seeded: true, force })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}