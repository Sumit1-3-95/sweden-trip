import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error(`Missing env vars — URL: ${url ? 'ok' : 'MISSING'}, KEY: ${key ? 'ok' : 'MISSING'}`)
  return createClient(url, key)
}

// ─────────────────────────────────────────────────────────────────
// AUTHORITATIVE SEED DATA
// Day 1  = Fri 24 Jul  Arrive Stockholm
// Day 2  = Sat 25 Jul  Djurgården + Vasa + Gamla Stan ✅ DONE
// Day 3  = Sun 26 Jul  Rest + IKEA + H&M + Baby library ✅ DONE
// Day 4  = Mon 27 Jul  Free Stockholm
// Day 5  = Tue 28 Jul  Free Stockholm
// Day 6  = Wed 29 Jul  Free Stockholm
// Day 7  = Thu 30 Jul  Train to Malmö 07:19 (W5UNRLKY) + check-in Zenith Malmö 16:00
// Day 8  = Fri 31 Jul  Malmö city day
// Day 9  = Sat  1 Aug  Copenhagen day trip
// Day 10 = Sun  2 Aug  Fly CPH→AMS 08:10 (XVDUPJ) → Sprang-Capelle
// Day 11 = Mon  3 Aug  Efteling
// Day 12 = Tue  4 Aug  Rotterdam check-in (HMRDYAK4RN / Michiel)
// Day 13 = Wed  5 Aug  Kinderdijk + Madurodam
// Day 14 = Thu  6 Aug  Scheveningen → Ostend (HMRXFTJ4PH / Peter)
// Day 15 = Fri  7 Aug  Bruges
// Day 16 = Sat  8 Aug  Ostend sea day
// Day 17 = Sun  9 Aug  Ghent → Sint-Pieters-Leeuw (HME5Q2RBTQ / Elke)
// Day 18 = Mon 10 Aug  Brussels
// Day 19 = Tue 11 Aug  Fly BRU→ARN 18:55 (YJI224)
// Day 20 = Wed 12 Aug  Rest Solna
// Day 21 = Thu 13 Aug  Farewell + pack
// Day 22 = Fri 14 Aug  Fly ARN→DEL 06:00 (9XUWK9)
// ─────────────────────────────────────────────────────────────────

const SEED_CARDS = [

  // ════════════════════════════════════════════════
  // DAY 1 · Fri 24 Jul · ARRIVE STOCKHOLM
  // ════════════════════════════════════════════════
  {
    day_number: 1, type: 'transport', title: 'Fly Delhi → Stockholm', time_label: '~06:00', sort_order: 0,
    description: 'Lufthansa LH761 + LH2420 via Munich. Arrive Stockholm Arlanda Terminal 5 at 14:25. Komal collecting from arrivals.',
    tags: ['Flight', 'Confirmed', 'All passengers'],
    metadata: {
      ref: '9XUWK9', from: 'New Delhi (DEL)', to: 'Stockholm Arlanda (ARN)',
      dep: '~06:00', arr: '14:25', op: 'Lufthansa', num: 'LH761 + LH2420', via: 'Munich (MUC)',
      duration: '~11h total', terminal: 'Terminal 5',
      tip: 'Komal is collecting from Terminal 5. Immigration can take 30–45 min in peak season.',
    }
  },
  {
    day_number: 1, type: 'activity', title: 'Arrive + settle at Komal\'s', time_label: 'Evening', sort_order: 1,
    description: 'Home-cooked dinner at Komal\'s place in Solna. Pure rest — the trip starts properly tomorrow.',
    tags: ['Rest', 'Family time'],
    metadata: {
      what_to_expect: 'Warm welcome and home-cooked meal. Komal\'s flat is in Solna, very close to the metro.',
      tip: 'Do nothing tonight. 22 days ahead.',
      nearest_station: 'Solna station (T-bana blue line)',
    }
  },

  // ════════════════════════════════════════════════
  // DAY 2 · Sat 25 Jul · DJURGÅRDEN + VASA + GAMLA STAN ✅ DONE
  // ════════════════════════════════════════════════
  {
    day_number: 2, type: 'activity', title: 'Boat to Djurgården', time_label: 'Morning', sort_order: 0,
    description: 'Took the boat from Strandvägen to Djurgården island. Beautiful first morning in Stockholm.',
    tags: ['Done ✓', 'Boat ride', 'Djurgården'],
    metadata: {
      what_to_expect: 'Scenic boat ride across the water to Djurgården island.',
      nearest_station: 'Strandvägen pier',
      tip: 'Already done — add your photos!',
    }
  },
  {
    day_number: 2, type: 'activity', title: 'Vasa Museum', time_label: '10:00', sort_order: 1,
    description: 'The fully preserved 17th-century warship that sank on its maiden voyage in 1628. Nothing else like it in the world.',
    tags: ['Done ✓', 'Museum', 'Must-do'],
    metadata: {
      what_to_expect: 'A vast dark hall with a 69-metre warship rising above you. Six levels of walkway, explanations of why it sank.',
      duration: '1.5–2 hours',
      nearest_station: 'Djurgårdsbron (Bus 69)',
      cost: '230 SEK adult · free under 18',
      tip: 'Already visited — add your photos!',
      elderly_friendly: 'Yes — lifts to all levels',
      kid_friendly: 'Yes — the scale is jaw-dropping for children',
    }
  },
  {
    day_number: 2, type: 'activity', title: 'Gamla Stan old town', time_label: 'Afternoon', sort_order: 2,
    description: 'Medieval island — cobblestone streets, coloured merchant houses, Stortorget square dating to the 13th century.',
    tags: ['Done ✓', 'History', 'Walking'],
    metadata: {
      what_to_expect: 'Compact island of winding streets and historic buildings. Nobel Museum inside the main square.',
      duration: '2–3 hours',
      nearest_station: 'Gamla Stan T-bana',
      tip: 'Already visited — add your photos from the day!',
      elderly_friendly: 'Cobblestones — wear supportive shoes',
      kid_friendly: 'Yes — fun to explore',
    }
  },

  // ════════════════════════════════════════════════
  // DAY 3 · Sun 26 Jul · REST + SHOPPING ✅ DONE
  // ════════════════════════════════════════════════
  {
    day_number: 3, type: 'activity', title: 'Rest morning', time_label: 'Morning', sort_order: 0,
    description: 'Slow morning at Komal\'s after the big Day 2. Home breakfast, catch up on rest.',
    tags: ['Done ✓', 'Rest'],
    metadata: { tip: 'Already done.' }
  },
  {
    day_number: 3, type: 'activity', title: 'IKEA + H&M + Stockholm shopping', time_label: 'Afternoon', sort_order: 1,
    description: 'IKEA, H&M and general Stockholm shopping. Swedish retail — meatballs, lingonberry jam, and everything else.',
    tags: ['Done ✓', 'Shopping', 'IKEA', 'H&M'],
    metadata: {
      what_to_expect: 'IKEA Barkarby for meatballs and Swedish food products. H&M and city centre shopping after.',
      tip: 'Already done — remember to pick up any Swedish souvenirs you forgot!',
      cost: 'Budget as needed',
      elderly_friendly: 'Yes — indoor shopping, lifts throughout',
    }
  },
  {
    day_number: 3, type: 'activity', title: 'Baby library Stockholm', time_label: 'Afternoon', sort_order: 2,
    description: 'Stockholm\'s children\'s library — a beautiful calm space, designed for young children.',
    tags: ['Done ✓', 'Kids', 'Mira', 'Library'],
    metadata: {
      what_to_expect: 'Picture books, reading nooks, interactive areas for toddlers. Mira\'s day.',
      nearest_station: 'T-Centralen (city centre)',
      kid_friendly: 'Yes — designed entirely for young children',
      tip: 'Already done.',
    }
  },

  // ════════════════════════════════════════════════
  // DAY 4 · Mon 27 Jul · FREE STOCKHOLM DAY
  // ════════════════════════════════════════════════
  {
    day_number: 4, type: 'activity', title: 'Ferry to Vaxholm', time_label: '09:30', sort_order: 0,
    description: 'Waxholmsbolaget ferry from Strömkajen through 14,000 islands to Vaxholm. One of the most scenic short journeys in Scandinavia.',
    tags: ['Ferry', 'Scenic', 'Day trip', 'Family friendly'],
    metadata: {
      what_to_expect: 'A slow 70-minute ferry through the Stockholm archipelago. Calm water, extraordinary scenery, open deck.',
      duration: '70 min each way',
      nearest_station: 'Strömkajen pier (walk from Gamla Stan or Kungsträdgården)',
      departure: 'Ferries every 1–2 hours. Check waxholmsbolaget.se for times.',
      best_time: 'Take the 09:30 ferry for a full day',
      tip: 'Sit on the upper open deck. Bring layers — cool on the water.',
      cost: '~165 SEK return adult',
      elderly_friendly: 'Yes — seated ferry, flat boarding',
      kid_friendly: 'Yes — the open deck is exciting for children',
    }
  },
  {
    day_number: 4, type: 'activity', title: 'Vaxholm island — swim + picnic', time_label: '11:00', sort_order: 1,
    description: 'Gateway to the Stockholm archipelago. Swimming off smooth granite rocks, 16th-century fortress, harbour bakery.',
    tags: ['Swimming', 'Picnic', 'Outdoors', 'Family friendly'],
    metadata: {
      what_to_expect: 'A small charming island — painted wooden houses, a fish smokehouse, the fortress across the water. Swimming is off smooth granite rocks.',
      duration: 'Full afternoon',
      nearest_station: 'Vaxholm ferry terminal — walk everywhere from there',
      tip: 'Buy smoked salmon on crispbread from the harbour smokehouse. Return ferry ~17:00.',
      cost: 'Lunch ~150 SEK',
      elderly_friendly: 'Harbour walk is flat. Rocks require some care.',
      kid_friendly: 'Yes — swimming, open space, harbour to explore',
    }
  },

  // ════════════════════════════════════════════════
  // DAY 5 · Tue 28 Jul · FREE STOCKHOLM DAY
  // ════════════════════════════════════════════════
  {
    day_number: 5, type: 'activity', title: 'Junibacken children\'s museum', time_label: '10:00', sort_order: 0,
    description: 'The Pippi Longstocking and Astrid Lindgren museum on Djurgården. The Story Train is the centrepiece — Mira will be completely spellbound.',
    tags: ['Kids', 'Ticket', 'Mira', 'Djurgården'],
    metadata: {
      what_to_expect: 'The Story Train glides through a darkened forest past Pippi\'s villa, Karlsson\'s rooftop, Emil\'s farm. Each scene in extraordinary detail. Play area where children can climb into Pippi\'s house.',
      duration: '1.5–2 hours',
      nearest_station: 'Djurgårdsbron (Bus 69) — 5 min walk',
      best_time: 'Morning — grab a Story Train timed slot on arrival',
      tip: 'The Story Train has a queue — get your slot immediately on entry.',
      cost: '~185 SEK adult · ~155 SEK child',
      website: 'junibacken.se',
      elderly_friendly: 'Yes — seated Story Train, flat access',
      kid_friendly: 'Yes — designed for children aged 1–10',
    }
  },
  {
    day_number: 5, type: 'activity', title: 'Rosendals Trädgård café', time_label: 'Afternoon', sort_order: 1,
    description: 'Stockholm\'s most beloved organic garden café in a 19th-century greenhouse. Pick-your-own flowers, cardamom buns, long tables in the garden.',
    tags: ['Café', 'Garden', 'Organic', 'Relaxed'],
    metadata: {
      what_to_expect: 'Working biodynamic market garden with a café inside a beautiful old greenhouse. Pastries made on-site. Queue, pick your food, find a table.',
      duration: '1–2 hours',
      nearest_station: '15 min walk from Junibacken along Djurgården island',
      best_time: 'Lunchtime — arrive before 1pm',
      tip: 'The cardamom buns are extraordinary. Pick-your-own flowers are cheap and lovely.',
      cost: 'Lunch ~150–200 SEK/person',
      website: 'rosendalstradgard.se',
      elderly_friendly: 'Yes — flat paths, seating throughout',
      kid_friendly: 'Yes — Mira can explore the garden',
    }
  },
  {
    day_number: 5, type: 'activity', title: 'Nobel Museum + Stortorget fika', time_label: '15:00', sort_order: 2,
    description: 'Nobel Museum inside Gamla Stan\'s Stortorget — laureate stories through objects and film. Then fika: coffee and a cardamom bun in the square.',
    tags: ['Museum', 'Ticket', 'Fika', 'History'],
    metadata: {
      what_to_expect: 'Interactive museum telling laureate stories. The ceiling installation — thousands of hanging portraits — is beautiful. Café chairs signed by past laureates underneath.',
      duration: '1 hour museum + 45 min fika',
      nearest_station: 'Gamla Stan T-bana — 2 min walk',
      tip: 'Look under the café chairs for laureate signatures. Fika at Café Järntorget on the square after.',
      cost: '~130 SEK adult',
      website: 'nobelprizemuseum.se',
      elderly_friendly: 'Yes — flat, accessible',
      kid_friendly: 'Yes — interactive displays',
    }
  },

  // ════════════════════════════════════════════════
  // DAY 6 · Wed 29 Jul · FREE STOCKHOLM DAY
  // ════════════════════════════════════════════════
  {
    day_number: 6, type: 'activity', title: 'Thorslunda strawberry picking', time_label: '10:30', sort_order: 0,
    description: 'Self-picking strawberries at Thorslundagård farm, 45 min west of Solna by Komal\'s car. Swedish jordgubbar in late July are extraordinary.',
    tags: ['Outdoors', 'Family friendly', 'Kids', 'Komal\'s car'],
    metadata: {
      what_to_expect: 'Pick your own strawberries straight from the rows, weigh and pay by the kilo. Farm café for waffles and ice cream.',
      duration: '1.5–2 hours',
      nearest_station: 'Drive ~45 min from Solna (Komal\'s car)',
      address: 'Torslundagård, 17996 Svartsjö',
      best_time: '10:00–12:00 — before the afternoon rush',
      tip: 'Check thorslundagard.se the day before to confirm berries are available. Pick more than you think you need.',
      cost: '~40–60 SEK/kg',
      elderly_friendly: 'Farm café is flat. Field picking requires bending — grandparents can wait at the café.',
      kid_friendly: 'Yes — Mira will love picking and eating',
    }
  },
  {
    day_number: 6, type: 'activity', title: 'Sigtuna old town', time_label: '14:00', sort_order: 1,
    description: 'Sweden\'s oldest town, founded 980 AD. One beautiful main street, Viking rune stones, lakeside café. Completely flat.',
    tags: ['History', 'Elderly friendly', 'Scenic', 'Komal\'s car'],
    metadata: {
      what_to_expect: 'Tiny town — walk the whole centre in 20 minutes. Stora gatan lined with small shops and cafés. Rune stones over 1,000 years old. Lake Mälaren at the end of the street.',
      duration: '2–3 hours',
      nearest_station: 'Drive from Thorslunda ~45 min via E18 (loop back to Solna)',
      best_time: 'Afternoon — lovely light on the lake',
      tip: 'Fika at Tant Bruns Kaffestuga on Stora gatan. Look for the rune stone embedded in the wall of St Lars church ruins.',
      cost: 'Free to walk. Café ~100 SEK/person.',
      elderly_friendly: 'Yes — flat main street, café seating',
      kid_friendly: 'Yes — open lakeside, ruins to explore',
    }
  },
  {
    day_number: 6, type: 'alert', title: '⚠️ Pack all bags tonight', time_label: 'Evening', sort_order: 2,
    description: 'Train to Malmö departs Stockholm Central at 07:19 TOMORROW (Thu 30 Jul). Leave Solna by 06:15am. Pack everything tonight — do not leave it to the morning.',
    tags: ['Alert', 'Critical'],
    metadata: { action: 'Pack everything tonight. Set alarm for 05:45am.' }
  },

  // ════════════════════════════════════════════════
  // DAY 7 · Thu 30 Jul · TRAIN TO MALMÖ + CHECK IN
  // ════════════════════════════════════════════════
  {
    day_number: 7, type: 'transport', title: 'SJ X2000 to Malmö', time_label: '07:19', sort_order: 0,
    description: 'SJ X2000 high-speed train from Stockholm Central to Malmö Central. 4h 34m. All 8 passengers confirmed in Carriage 7. Booking W5UNRLKY.',
    tags: ['Train', 'Confirmed', '8 passengers', 'Carriage 7'],
    metadata: {
      ref: 'W5UNRLKY',
      from: 'Stockholm Central',
      to: 'Malmö Central',
      dep: '07:19',
      arr: '11:53',
      op: 'SJ X2000',
      num: 'Train 523',
      carriage: 'Carriage 7',
      duration: '4h 34m',
      passengers: 'Sumit S27W · Aishwarya S28A · Dinesh S24A · Cheramanywati S23W · Komal S26W · Yogesh S25A · Mira S29A · Archie S30W',
      amenities: 'Bistro car · Breakfast · Wifi · Wheelchair lift',
      tip: 'Leave Solna by 06:15am. Sit left side of train for Lake Vättern views. Bistro car and power sockets at every seat.',
    }
  },
  {
    day_number: 7, type: 'activity', title: 'Arrive Malmö — explore the city', time_label: '12:00', sort_order: 1,
    description: 'Arrive Malmö Central 11:53. Drop bags at left luggage and explore the city before check-in at 16:00.',
    tags: ['Arrival', 'Explore', 'Malmö'],
    metadata: {
      what_to_expect: 'Malmö Central is a beautiful station. The city centre is a 5-minute walk. Lilla Torg (Little Square) is a lovely lunch spot — outdoor restaurants in a cobblestone square.',
      duration: 'Midday until 16:00 check-in',
      nearest_station: 'Malmö Central (arrived here)',
      tip: 'Left luggage at the station is easy. Lilla Torg for lunch — about 10 min walk from the station.',
      cost: 'Lunch ~150 SEK/person',
    }
  },
  {
    day_number: 7, type: 'stay', title: 'Zenith Malmö — check in', time_label: '16:00', sort_order: 2,
    description: 'Julia\'s Airbnb in Hyllie. Check-in from 4pm. 3 nights. Perfectly placed for Malmö city days and the Copenhagen day trip.',
    tags: ['Stay', '3 nights', 'Airbnb', 'Confirmed'],
    metadata: {
      host: 'Julia',
      host_phone: '+46 73 515 61 93',
      airbnb_ref: 'HM5KE8JFPJ',
      property_name: 'Zenith Malmö',
      address: 'Hyllie kyrkoväg 48, Malmö, Skåne County 216 16, Sweden',
      checkIn: '4:00 PM · Thu 30 Jul',
      checkOut: '10:00 AM · Sun 2 Aug',
      nights: '3',
      guests: '6 guests, 1 child, 1 infant',
      airbnb: 'true',
      nearest_station: 'Hyllie station (metro/Pågatågen) — 3 min walk',
      tip: 'Hyllie station: direct to Malmö Central (5 min) and Copenhagen Airport (35 min). Call Julia on +46 73 515 61 93.',
      alert: '⚠️ CPH flight departs 08:10 on Sun 2 Aug. Leave Airbnb by 05:30am. Arrange with Julia in advance.',
    }
  },

  // ════════════════════════════════════════════════
  // DAY 8 · Fri 31 Jul · MALMÖ CITY DAY
  // ════════════════════════════════════════════════
  {
    day_number: 8, type: 'activity', title: 'Malmöhus Castle', time_label: '14:00', sort_order: 0,
    description: 'Scandinavia\'s oldest Renaissance castle (1434). City museum, natural history museum, aquarium and art gallery — all one ticket.',
    tags: ['Museum', 'Castle', 'Family friendly', 'Ticket'],
    metadata: {
      what_to_expect: 'The aquarium is particularly good for Mira — sharks and rays. The city museum tells Malmö\'s history from medieval fishing village to modern city.',
      duration: '2–3 hours',
      nearest_station: 'Walk from Malmö Central — 15 min through the park',
      best_time: 'Afternoon',
      tip: 'The castle moat walk is lovely after the museum. Kungsparken surrounding it is free.',
      cost: '~130 SEK adult · free under 19',
      elderly_friendly: 'Yes — lifts available, flat grounds',
      kid_friendly: 'Yes — aquarium and open castle grounds',
    }
  },
  {
    day_number: 8, type: 'activity', title: 'Ribersborg beach', time_label: '17:00', sort_order: 1,
    description: 'Malmö\'s famous city beach — 2km of sandy shoreline with the Kallbadhus bath house at the end of a wooden jetty extending into the sea.',
    tags: ['Beach', 'Swimming', 'Family friendly', 'Sunset'],
    metadata: {
      what_to_expect: 'Long flat sandy beach with calm water. The Kallbadhus is a traditional Swedish cold bath house on a jetty — swim, sauna, or just walk out for views across to Denmark.',
      duration: '1.5–2 hours',
      nearest_station: 'Bus 2 from Stortorget, or 25 min walk from Malmöhus Castle',
      best_time: 'Evening — golden hour light over the water',
      tip: 'Walk to the end of the Kallbadhus jetty for views across the Øresund to Denmark. The Turning Torso is visible from the beach.',
      cost: 'Free beach. Kallbadhus entry ~100 SEK.',
      elderly_friendly: 'Yes — flat sand, long promenade',
      kid_friendly: 'Yes — calm safe swimming',
    }
  },

  // ════════════════════════════════════════════════
  // DAY 9 · Sat 1 Aug · COPENHAGEN DAY TRIP
  // ════════════════════════════════════════════════
  {
    day_number: 9, type: 'activity', title: 'Øresund train to Copenhagen', time_label: 'Morning', sort_order: 0,
    description: '35-minute Øresund train from Hyllie station across one of Europe\'s great bridges — half bridge, half tunnel under the sea.',
    tags: ['Train', 'Bridge', 'Scenic', 'Day trip'],
    metadata: {
      what_to_expect: 'The bridge is 8km long. The train emerges from the tunnel on the Danish side to cross the water. On a clear day you can see both countries at once.',
      duration: '35 min from Hyllie',
      nearest_station: 'Hyllie station (3 min walk from Zenith Malmö Airbnb)',
      departure: 'Every 20 minutes from Hyllie. No booking needed — buy at machine.',
      tip: 'Sit on the right side going to Copenhagen for the best bridge views. Buy a return ticket. ~170 DKK return.',
      cost: '~170 DKK return',
      elderly_friendly: 'Yes — direct train, seated',
      kid_friendly: 'Yes — the bridge crossing is exciting',
    }
  },
  {
    day_number: 9, type: 'activity', title: 'Rosenborg Castle + King\'s Garden', time_label: '10:30', sort_order: 1,
    description: '17th-century royal castle housing the actual Danish crown jewels — sceptre, orb, and crown used at coronations.',
    tags: ['Museum', 'Crown jewels', 'History', 'Ticket'],
    metadata: {
      what_to_expect: 'The jewels are the real ones — not reproductions. Great Hall, Winter Room, and the basement Treasury. King\'s Garden surrounding the castle is free and beautiful.',
      duration: '1.5 hours for castle, 30 min for gardens',
      nearest_station: 'Nørreport station — 5 min walk',
      best_time: 'Morning when it opens',
      tip: 'King\'s Garden is free — grandparents can sit here while others visit. Garden has a puppet theatre in summer.',
      cost: '~160 DKK adult · free under 18',
      elderly_friendly: 'Castle has some narrow passages. Gardens completely flat.',
      kid_friendly: 'Yes — crown jewels fascinate children',
    }
  },
  {
    day_number: 9, type: 'activity', title: 'Nyhavn waterfront + canal boat', time_label: '14:00', sort_order: 2,
    description: 'Copenhagen\'s iconic 17th-century canal — colourful merchant houses reflected in the water. Hans Christian Andersen lived here for 18 years.',
    tags: ['Iconic', 'Canals', 'Food', 'Boat tour'],
    metadata: {
      what_to_expect: '200m of canal lined with restaurants and the famous coloured houses. Canal boat tours every 30 min (45 min seated tour). Hans Christian Andersen lived in houses 18, 20, and 67.',
      duration: '1.5–2 hours',
      nearest_station: 'Kongens Nytorv metro — 2 min walk',
      best_time: 'Afternoon — light hits the coloured houses beautifully',
      tip: 'For lunch: walk one block back from the canal — half the tourist price. Canal boat tour is seated — perfect for grandparents. ~120 DKK.',
      cost: 'Canal boat ~120 DKK. Lunch varies.',
      elderly_friendly: 'Yes — flat promenade, seated boat tour',
      kid_friendly: 'Yes — boats, colourful buildings, open waterfront',
    }
  },
  {
    day_number: 9, type: 'alert', title: '⚠️ Return to Malmö early', time_label: 'Evening', sort_order: 3,
    description: 'Flight CPH→AMS departs 08:10 TOMORROW (Sun 2 Aug). Must leave Malmö Airbnb by 05:30am. Back from Copenhagen by 19:00 for rest.',
    tags: ['Alert', 'Critical'],
    metadata: { action: 'Return train to Hyllie by 19:00. Early night. Everything packed tonight.' }
  },

  // ════════════════════════════════════════════════
  // DAY 10 · Sun 2 Aug · FLY CPH→AMS → SPRANG-CAPELLE
  // ════════════════════════════════════════════════
  {
    day_number: 10, type: 'alert', title: '⚠️ Leave Malmö Airbnb by 05:30am', time_label: '05:30', sort_order: 0,
    description: 'Train from Hyllie station directly to Copenhagen Airport. About 35–40 minutes. Tightest departure of the whole trip.',
    tags: ['Alert', 'Critical', 'Early start'],
    metadata: { action: 'Bags packed night before. Walk to Hyllie station. Train direct to CPH Airport Terminal 3.' }
  },
  {
    day_number: 10, type: 'transport', title: 'Fly CPH → Amsterdam', time_label: '08:10', sort_order: 1,
    description: 'Norwegian D83538. 1h 25m. Arrive Amsterdam Schiphol 09:35. All passengers confirmed. Ref XVDUPJ.',
    tags: ['Flight', 'Confirmed', 'Norwegian'],
    metadata: {
      ref: 'XVDUPJ',
      from: 'Copenhagen (CPH)',
      to: 'Amsterdam Schiphol (AMS)',
      dep: '08:10',
      arr: '09:35',
      op: 'Norwegian',
      num: 'D83538',
      duration: '1h 25m',
      tip: 'Check in online the night before. Norwegian has strict baggage rules — check allowance on your booking.',
    }
  },
  {
    day_number: 10, type: 'activity', title: 'Transfer Schiphol → Sprang-Capelle', time_label: '10:30', sort_order: 2,
    description: 'Train from Schiphol Airport to Tilburg (~1 hour), then taxi to Dijkstraat 12, Sprang-Capelle (~20 min). Check in from 15:00.',
    tags: ['Transfer', 'Train', 'Taxi'],
    metadata: {
      what_to_expect: 'Schiphol has direct train connections. Intercity to Tilburg, then taxi to Sprang-Capelle.',
      duration: '~1.5 hours total',
      nearest_station: 'Schiphol Airport station (directly under the airport)',
      tip: 'Buy NS train tickets at yellow machines in airport. Pre-book Uber/taxi from Tilburg to Sprang-Capelle (~€30).',
      cost: '~€25 train + ~€30 taxi',
    }
  },
  {
    day_number: 10, type: 'stay', title: 'Eftelhuysje — Sprang-Capelle', time_label: '15:00', sort_order: 3,
    description: 'Sonny\'s Airbnb. Just 10 minutes from Efteling. 2 nights. Free parking on site. Rest well — Efteling tomorrow.',
    tags: ['Stay', '2 nights', 'Airbnb', 'Confirmed'],
    metadata: {
      host: 'Sonny',
      host_phone: '+31 6 22351393',
      airbnb_ref: 'HM55P4XKR2',
      property_name: 'Eftelhuysje',
      address: 'Dijkstraat 12 Buitenhuis, Sprang-Capelle, Noord-Brabant 5161 BV, Netherlands',
      checkIn: '3:00 PM · Sun 2 Aug',
      checkOut: '10:00 AM · Tue 4 Aug',
      nights: '2',
      guests: '6 guests',
      airbnb: 'true',
      nearest_station: 'Taxi from Tilburg station (~20 min)',
      tip: '10 minutes from Efteling — confirmed from listing. Free parking. Call Sonny on +31 6 22351393. Pre-book taxi to Efteling tonight.',
    }
  },

  // ════════════════════════════════════════════════
  // DAY 11 · Mon 3 Aug · EFTELING
  // ════════════════════════════════════════════════
  {
    day_number: 11, type: 'activity', title: 'Efteling — full day', time_label: '10:00', sort_order: 0,
    description: 'Europe\'s greatest fairytale theme park. Opened 1952 — older than Disneyland. Open 10am–8pm in August. Full day.',
    tags: ['Theme park', 'Must-do', 'Summer tickets', 'Family'],
    metadata: {
      what_to_expect: 'A full-day experience with something for every age. Beautifully maintained with mature woodland. Focus on Fairytale Forest in the morning (grandparents + Mira) and rides in the afternoon.',
      duration: 'Full day — 10am to 8pm',
      nearest_station: 'Taxi from Sprang-Capelle (~10 min, ~€15)',
      address: 'Europalaan 1, 5171 KW Kaatsheuvel',
      best_time: 'Arrive at 10am when it opens',
      tip: 'SUMMER TICKETS only at efteling.com — normal tickets invalid in August. Download the Efteling app for live wait times.',
      cost: '~€38–53 per person. Book in advance.',
      website: 'efteling.com',
      elderly_friendly: 'Yes — Fairytale Forest and Gondoletta are perfect. Wheelchairs available.',
      kid_friendly: 'Yes — this is Mira\'s day. The Fairytale Forest is magical.',
    }
  },
  {
    day_number: 11, type: 'activity', title: 'Fairytale Forest — Sprookjesbos', time_label: '10:00', sort_order: 1,
    description: 'The oldest part of Efteling — enchanted walk through old-growth woodland with 30 elaborate fairy tale scenes built over 70 years.',
    tags: ['Must-do', 'Elderly friendly', 'Kids', 'Fairytale'],
    metadata: {
      what_to_expect: 'Each scene is a large detailed diorama — Sleeping Beauty\'s castle, Hansel and Gretel\'s house, the Six Swans. The woodland itself is beautiful. Completely flat paved path.',
      duration: '1.5–2 hours at a relaxed pace',
      tip: 'Go first at 10am before it gets crowded. Stand at each scene for a full minute — the moving figures are on timers.',
      elderly_friendly: 'Yes — flat paved path. Benches at each scene.',
      kid_friendly: 'Yes — the centrepiece of Efteling for young children',
    }
  },
  {
    day_number: 11, type: 'activity', title: 'Aquanura fountain show', time_label: '20:00', sort_order: 2,
    description: '25-minute choreographed fountain show — 750 fountains, fire columns 30m high, coloured lights, and an original musical score. Best theme park show in Europe.',
    tags: ['Must-see', 'Evening show', 'All ages'],
    metadata: {
      what_to_expect: 'The whole park gathers around the main lake. Fire, water jets, light, and music. One of the most spectacular shows at any European theme park.',
      duration: '25 minutes',
      best_time: '20:00 — the final event of the day',
      tip: 'Find a spot on the eastern lake bank 20 min early. Bring a light jacket — cool by 8pm.',
      elderly_friendly: 'Yes — standing but brief',
      kid_friendly: 'Yes — Mira will love the fire and fountains',
    }
  },

  // ════════════════════════════════════════════════
  // DAY 12 · Tue 4 Aug · MOVE TO ROTTERDAM
  // ════════════════════════════════════════════════
  {
    day_number: 12, type: 'activity', title: 'Train to Rotterdam', time_label: 'Morning', sort_order: 0,
    description: 'Check out Sprang-Capelle by 10am. Train from Tilburg to Rotterdam Centraal (~45 min). Check in with Michiel from 15:00.',
    tags: ['Train', 'Travel day'],
    metadata: {
      duration: '~45 min train',
      nearest_station: 'Tilburg station (taxi from Sprang-Capelle ~20 min)',
      tip: 'Direct Intercity from Tilburg to Rotterdam Centraal. Very frequent service.',
    }
  },
  {
    day_number: 12, type: 'activity', title: 'Markthal', time_label: '13:00', sort_order: 1,
    description: 'Rotterdam\'s extraordinary indoor market hall — a 40-metre horseshoe arch whose inner ceiling is covered by an 11,000m² artwork of giant fruit and vegetables.',
    tags: ['Architecture', 'Food', 'Market', 'Must-see'],
    metadata: {
      what_to_expect: 'The ceiling mural is the largest artwork in the Netherlands. Below it: 100 market stalls, restaurants, supermarket. The building is the attraction as much as the food.',
      duration: '1–1.5 hours',
      nearest_station: 'Blaak metro station — 2 min walk',
      best_time: 'Lunchtime',
      tip: 'Look up constantly — the ceiling is the whole point. Indonesian and Dutch herring stalls are excellent. Cube Houses are right next door.',
      cost: 'Free to enter. Food ~€10–20/person.',
      elderly_friendly: 'Yes — fully flat, climate controlled',
      kid_friendly: 'Yes — the ceiling is astonishing for children',
    }
  },
  {
    day_number: 12, type: 'activity', title: 'Cube Houses + Erasmus Bridge', time_label: '15:00', sort_order: 2,
    description: 'Piet Blom\'s 1984 yellow cubes tilted at 45 degrees. One is open as a tiny museum. Then a walk along the Maas to the Erasmus Bridge.',
    tags: ['Architecture', 'Walk', 'Riverside', 'Iconic'],
    metadata: {
      what_to_expect: 'Cube Houses just outside Markthal. One cube (Kijk-Kubus) open as museum with the tilted interior. Erasmus Bridge 10 min walk along the river.',
      duration: '1.5 hours',
      nearest_station: 'Blaak metro station',
      tip: 'Erasmus Bridge lights up at night — worth an evening walk. Kijk-Kubus museum is small but worth €3.',
      cost: '€3 Kijk-Kubus museum',
      elderly_friendly: 'Flat riverside walk. Cube house interior has steep stairs — optional.',
      kid_friendly: 'Yes — the tilted architecture is disorientating and fun',
    }
  },
  {
    day_number: 12, type: 'stay', title: 'City house Rotterdam — Michiel', time_label: '15:00', sort_order: 3,
    description: 'Michiel\'s townhouse in central Rotterdam. 2 nights. Kinderdijk 30 min by water bus. Den Haag 25 min by direct train.',
    tags: ['Stay', '2 nights', 'Airbnb', 'Confirmed'],
    metadata: {
      host: 'Michiel',
      host_phone: '+31 6 49253898',
      airbnb_ref: 'HMRDYAK4RN',
      property_name: 'City house in the middle of Rotterdam!',
      address: 'Van Brakelstraat 107, Rotterdam, Zuid-Holland 3012 XW, Netherlands',
      checkIn: '3:00 PM · Tue 4 Aug',
      checkOut: '11:00 AM · Thu 6 Aug',
      nights: '2',
      guests: '6 guests, 2 infants',
      airbnb: 'true',
      tip: 'Call Michiel on +31 6 49253898. Central Rotterdam location.',
    }
  },

  // ════════════════════════════════════════════════
  // DAY 13 · Wed 5 Aug · KINDERDIJK + MADURODAM
  // ════════════════════════════════════════════════
  {
    day_number: 13, type: 'activity', title: 'Kinderdijk by water bus', time_label: '09:30', sort_order: 0,
    description: '19 windmills from the 1740s — UNESCO World Heritage. Water bus from Rotterdam along the River Noord. Completely flat.',
    tags: ['UNESCO', 'Water bus', 'Elderly friendly', 'Ticket', 'Iconic'],
    metadata: {
      what_to_expect: 'The most complete example of Dutch water management from the 18th century. Flat path between the mills. Some windmills open to enter. Extraordinary reflections in the water on clear days.',
      duration: '2–3 hours + 30 min each way water bus',
      nearest_station: 'Waterbus from Erasmus Bridge (Rotterdam Willemsplein) — every 30 min',
      best_time: 'Morning',
      tip: 'Buy combination ticket (water bus + entrance) at kinderdijk.nl. Rent bikes at Kinderdijk for a 30-min loop.',
      cost: '~€20 entry + ~€8 water bus return',
      website: 'kinderdijk.nl',
      elderly_friendly: 'Yes — completely flat path, seated water bus',
      kid_friendly: 'Yes — windmill scale is impressive',
    }
  },
  {
    day_number: 13, type: 'activity', title: 'Madurodam, Den Haag', time_label: '14:00', sort_order: 1,
    description: '1:25 scale replica of the entire Netherlands — airports, windmills, canals, Delta Works, all at knee height. Mira will spend an hour just pointing.',
    tags: ['Kids', 'Family friendly', 'Ticket', 'Interactive'],
    metadata: {
      what_to_expect: 'The whole Netherlands in a park the size of a city block. Schiphol Airport with tiny moving planes, the Delta Works, Kinderdijk mills, Anne Frank\'s house. Many models have moving parts.',
      duration: '1.5–2 hours',
      nearest_station: '25 min train Rotterdam Centraal → Den Haag Centraal, then 15 min tram',
      best_time: 'Afternoon',
      tip: 'The Vesuvius erupts on the hour. Kids love operating the locks and cranes.',
      cost: '~€19 adult · ~€15 child',
      website: 'madurodam.nl',
      elderly_friendly: 'Yes — flat paths throughout',
      kid_friendly: 'Yes — Mira will love the scale',
    }
  },

  // ════════════════════════════════════════════════
  // DAY 14 · Thu 6 Aug · SCHEVENINGEN → OSTEND
  // ════════════════════════════════════════════════
  {
    day_number: 14, type: 'activity', title: 'Scheveningen beach', time_label: 'Morning', sort_order: 0,
    description: 'Den Haag\'s North Sea beach — 3.5km of wide flat sand with a pier extending 400m into the sea.',
    tags: ['Beach', 'Elderly friendly', 'Family friendly', 'North Sea'],
    metadata: {
      what_to_expect: 'Wide open beach with soft sand. North Sea water cold but swimmable (~18°C). Flat promenade for grandparents. Pier has a restaurant at the end.',
      duration: '2 hours',
      nearest_station: 'Tram 1 or 9 from Den Haag Centraal — 15 min',
      best_time: 'Morning before the afternoon wind picks up',
      tip: 'Swim between the flags. Bring a windbreaker — the coastal wind is stronger than expected.',
      cost: 'Free',
      elderly_friendly: 'Yes — flat sand, flat promenade, pier accessible',
      kid_friendly: 'Yes — beach play, waves, pier',
    }
  },
  {
    day_number: 14, type: 'transport', title: 'Train to Ostend, Belgium', time_label: 'Afternoon', sort_order: 1,
    description: 'Train from Den Haag Centraal to Ostend via Antwerp. About 2.5 hours. Check in with Peter from 16:00.',
    tags: ['Train', 'Travel day', 'Into Belgium'],
    metadata: {
      from: 'Den Haag Centraal',
      to: 'Ostend (Oostende)',
      duration: '~2.5 hours',
      tip: 'Buy tickets at the station or on b-europe.com. Likely one change at Antwerp-Centraal.',
    }
  },
  {
    day_number: 14, type: 'stay', title: 'Duplex appartement — Ostend', time_label: '16:00', sort_order: 2,
    description: 'Peter\'s flat in Ostend. North Sea is 2 minutes\' walk. Bruges 15 min by train. Ghent 35 min. 3 nights.',
    tags: ['Stay', '3 nights', 'Airbnb', 'Confirmed', 'Seaside'],
    metadata: {
      host: 'Peter',
      host_phone: '+32 475 35 99 38',
      airbnb_ref: 'HMRXFTJ4PH',
      property_name: 'Duplex appartement',
      address: 'Mijnplein 6A, Ostend, Flanders 8400, Belgium',
      checkIn: '4:00 PM · Thu 6 Aug',
      checkOut: '11:00 AM · Sun 9 Aug',
      nights: '3',
      guests: '6 guests, 2 infants',
      airbnb: 'true',
      nearest_station: 'Ostend station — 10 min walk',
      tip: 'Call Peter on +32 475 35 99 38. Bruges train from Ostend every 30 min, 15 min journey. De Lijn coastal tram stops nearby.',
    }
  },

  // ════════════════════════════════════════════════
  // DAY 15 · Fri 7 Aug · BRUGES DAY TRIP
  // ════════════════════════════════════════════════
  {
    day_number: 15, type: 'activity', title: 'Train to Bruges', time_label: '09:30', sort_order: 0,
    description: '15-minute direct train from Ostend station to Bruges. Runs every 30 minutes. No booking needed.',
    tags: ['Train', '15 min', 'Easy'],
    metadata: {
      from: 'Ostend',
      to: 'Bruges (Brugge)',
      duration: '15 min',
      departure: 'Every 30 minutes from Ostend station',
      cost: '~€5.50 return',
    }
  },
  {
    day_number: 15, type: 'activity', title: 'Canal boat tour', time_label: '10:00', sort_order: 1,
    description: 'A 30-minute seated boat tour through the medieval back canals of Bruges — under stone bridges, past the backs of houses unchanged since the 15th century.',
    tags: ['Must-do', 'Elderly friendly', 'Boat', 'Scenic'],
    metadata: {
      what_to_expect: 'Five or six companies run identical tours from different canal points. Low wooden boat, guided commentary, ancient bridges overhead.',
      duration: '30 minutes',
      nearest_station: 'Rozenhoedkaai is the most scenic boarding point',
      best_time: 'As early as possible — queues build after 11am',
      tip: 'No booking needed — just queue. Cash only at some operators. All companies equal.',
      cost: '~€12 adult · ~€7 child',
      elderly_friendly: 'Yes — seated boat, assisted boarding',
      kid_friendly: 'Yes — boats are exciting for children',
    }
  },
  {
    day_number: 15, type: 'activity', title: 'Markt square + Belfry', time_label: '11:00', sort_order: 2,
    description: 'Bruges\' central medieval square, unchanged since the 14th century. The Belfry (83m, 1240 AD) rises above it — 366 steps for panoramic views.',
    tags: ['History', 'Architecture', 'Iconic', 'Photos'],
    metadata: {
      what_to_expect: 'Markt is surrounded by guildhalls and the Gothic Town Hall. Carillon plays every 15 minutes. Belfry climb is 366 narrow spiral stairs — not for everyone.',
      duration: '1 hour in the square, 45 min for Belfry climb',
      tip: 'Belfry not suitable for grandparents. Markt square itself is free and worth sitting in.',
      cost: '€16 Belfry entry. Markt free.',
      elderly_friendly: 'Square yes. Belfry — 366 narrow stairs, not recommended.',
      kid_friendly: 'Yes for the square. Belfry age/fitness dependent.',
    }
  },
  {
    day_number: 15, type: 'activity', title: 'Minnewater Lake + chocolate', time_label: '14:00', sort_order: 3,
    description: 'The Lake of Love — a calm willow-lined lake with white swans at the southern edge of the old city. Then: Bruges chocolate. This is not optional.',
    tags: ['Scenic', 'Walk', 'Chocolate', 'Shopping', 'Kids'],
    metadata: {
      what_to_expect: '14th-century sluice reservoir, now a beautiful swan-filled lake. 20-minute walk from Markt through medieval streets. Then the best chocolatiers in Belgium.',
      duration: '2–3 hours',
      tip: 'For chocolate: Dumon on Eiermarkt (since 1948 — extraordinary pralines). The Chocolate Line on Simon Stevinplein is theatrical. Budget €20–30 for the family.',
      cost: 'Lake free. Chocolate ~€20–30 family.',
      elderly_friendly: 'Yes — flat path to Minnewater',
      kid_friendly: 'Yes — swans, lake, chocolate tasting',
    }
  },

  // ════════════════════════════════════════════════
  // DAY 16 · Sat 8 Aug · OSTEND SEA DAY
  // ════════════════════════════════════════════════
  {
    day_number: 16, type: 'activity', title: 'Ostend beach morning', time_label: 'Morning', sort_order: 0,
    description: 'The widest sandy beach in Belgium — completely flat and firm. Swim, build sandcastles, walk the promenade. No plans required.',
    tags: ['Beach', 'Family friendly', 'Elderly friendly', 'Relaxed'],
    metadata: {
      what_to_expect: 'Broad flat beach, easy promenade access. Cold but swimmable North Sea (~18°C). Cafés and covered seating along the promenade.',
      duration: 'Morning — 2–3 hours',
      nearest_station: '2 min walk from Mijnplein Airbnb',
      tip: 'Buy grey North Sea shrimps (grijze garnalen) from a beach shack — tiny, intensely flavoured, the Belgian coastal specialty.',
      cost: 'Free beach',
      elderly_friendly: 'Yes — flat promenade, firm sand, plenty of seating',
      kid_friendly: 'Yes — Mira\'s beach day',
    }
  },
  {
    day_number: 16, type: 'activity', title: 'Kusttram — the world\'s longest tram', time_label: 'Midday', sort_order: 1,
    description: 'De Lijn Line 0 — 68km along the entire Belgian coast. The world\'s longest tram line. Take it to De Haan (beautiful art nouveau resort) and back.',
    tags: ['Tram', 'Scenic', 'Family friendly', 'World record'],
    metadata: {
      what_to_expect: 'Tram runs directly along the seafront, stopping at every coastal town. De Haan is the nicest stop — an entirely preserved art nouveau seaside resort from the 1900s.',
      duration: '45 min each way',
      nearest_station: 'Multiple stops along the Ostend seafront',
      tip: 'Get off at De Haan (Coq sur Mer), walk around, have lunch, tram back.',
      cost: '~€3.50 per journey',
      elderly_friendly: 'Yes — modern low-floor trams, seated',
      kid_friendly: 'Yes — trams are always exciting',
    }
  },
  {
    day_number: 16, type: 'activity', title: 'Harbour + fish market', time_label: 'Afternoon', sort_order: 2,
    description: 'Ostend\'s working harbour and fish market. Moules-frites at a harbour restaurant — the Belgian coastal dish.',
    tags: ['Food', 'Seafood', 'Local experience'],
    metadata: {
      what_to_expect: 'Fish market near the harbour sells the morning\'s catch. Try moules-frites (mussels with chips) at one of the harbour restaurants.',
      duration: '2 hours',
      tip: 'Brasserie du Phare near the harbour — excellent moules-frites. James Ensor house on Vlaanderenstraat if energy allows.',
      cost: 'Moules-frites lunch ~€18–22/person',
      elderly_friendly: 'Yes — flat harbour area, restaurant seating',
      kid_friendly: 'Yes — moules-frites universally loved',
    }
  },

  // ════════════════════════════════════════════════
  // DAY 17 · Sun 9 Aug · GHENT → SINT-PIETERS-LEEUW
  // ════════════════════════════════════════════════
  {
    day_number: 17, type: 'activity', title: 'Gravensteen Castle, Ghent', time_label: '11:00', sort_order: 0,
    description: 'A complete medieval water castle — moat, walls, towers — in the middle of 21st-century Ghent. Built 1180, never seriously remodelled.',
    tags: ['History', 'Castle', 'Kids', 'Ticket'],
    metadata: {
      what_to_expect: 'Count\'s apartments, Great Hall, watchtower, and ramparts with city views. Large collection of original armour, siege weapons, and medieval instruments.',
      duration: '1.5 hours',
      nearest_station: 'Ghent Sint-Pieters station, then tram 1 to Gravensteen (25 min total)',
      tip: 'Audio tour is unusually good and entertaining. Mira will be fascinated by the armour. Ramparts give best views in Ghent.',
      cost: '~€14 adult · free under 18',
      elderly_friendly: 'Steep internal stairs. Inner courtyard accessible.',
      kid_friendly: 'Yes — armour and towers endlessly fascinating for children',
    }
  },
  {
    day_number: 17, type: 'activity', title: 'Graslei canal + lunch', time_label: '13:00', sort_order: 1,
    description: 'Ghent\'s most beautiful stretch — medieval guild houses reflected in the Leie river. Lunch at a canal-side restaurant.',
    tags: ['Scenic', 'Canal', 'Food', 'Photos'],
    metadata: {
      what_to_expect: 'Graslei and Korenlei quays face each other across the Leie, lined with 12th–17th century guild houses. Sit and look — one of the most beautiful streetscapes in Belgium.',
      duration: '1.5 hours',
      nearest_station: 'Walk from Gravensteen — 10 min',
      tip: 'St Michael\'s Bridge gives the famous view of three medieval towers simultaneously — St Nicholas, the Belfry, and St Bavo\'s Cathedral.',
      cost: 'Lunch ~€15–20/person',
      elderly_friendly: 'Yes — flat quayside',
      kid_friendly: 'Yes',
    }
  },
  {
    day_number: 17, type: 'stay', title: 'The Bubble — Sint-Pieters-Leeuw', time_label: '16:00', sort_order: 2,
    description: 'Elke\'s holiday home. Brussels suburb, 15km from city centre. 20 min train to Brussels. 30 min taxi to BRU airport. 2 nights.',
    tags: ['Stay', '2 nights', 'Airbnb', 'Confirmed', 'Brussels base'],
    metadata: {
      host: 'Elke',
      host_phone: '+32 494 04 21 05',
      airbnb_ref: 'HME5Q2RBTQ',
      property_name: 'Holiday home "The Bubble"',
      address: 'Vlierstraat 14, Sint-Pieters-Leeuw, Vlaams Gewest 1600, Belgium',
      checkIn: '4:00 PM · Sun 9 Aug',
      checkOut: '11:00 AM · Tue 11 Aug',
      nights: '2',
      guests: '6 guests, 1 child, 1 infant',
      airbnb: 'true',
      nearest_station: 'Sint-Pieters-Leeuw station — train to Brussels ~20 min',
      tip: 'Call Elke on +32 494 04 21 05. BRU airport ~30 min by taxi.',
      alert: '⚠️ Flight BRU→ARN departs 18:55 on Tue 11 Aug. Leave Airbnb by 16:30. Pre-book taxi tonight.',
    }
  },

  // ════════════════════════════════════════════════
  // DAY 18 · Mon 10 Aug · BRUSSELS FULL DAY
  // ════════════════════════════════════════════════
  {
    day_number: 18, type: 'activity', title: 'Grand Place + Galeries Saint-Hubert', time_label: '09:00', sort_order: 0,
    description: 'Grand Place — Victor Hugo called it the most beautiful square in the world. Then the Galeries Saint-Hubert, where Belgian praline was invented in 1912.',
    tags: ['History', 'Architecture', 'Food', 'Must-see'],
    metadata: {
      what_to_expect: 'Grand Place is ringed by gilded 17th-century guildhalls and the Gothic Town Hall. Galeries Saint-Hubert (1847) is a 213-metre glass-vaulted arcade. Buy a Brussels waffle on the street.',
      duration: '1.5 hours',
      nearest_station: 'Brussels Central station — 5 min walk',
      best_time: '9am — before the tour groups arrive',
      tip: 'Brussels waffle: rectangular, plain, crisp — not oval Liège-style. Neuhaus on the Galeries invented praline in 1912 and is still there.',
      cost: 'Free to visit',
      elderly_friendly: 'Yes — cobblestones in Grand Place, gallery smooth',
      kid_friendly: 'Yes — golden guildhalls are visually spectacular',
    }
  },
  {
    day_number: 18, type: 'activity', title: 'Atomium + Mini-Europe', time_label: '13:00', sort_order: 1,
    description: '1958 World Expo iron crystal magnified 165 billion times. Adjacent Mini-Europe: 350 monuments at 1:25 scale. The Vesuvius erupts on the hour.',
    tags: ['Architecture', 'Kids', 'Iconic', 'Ticket'],
    metadata: {
      what_to_expect: 'Nine interconnected steel spheres connected by escalator tubes. Top sphere has 360° panoramic views. Mini-Europe next door — Mira will recognise the Eiffel Tower, Colosseum, Big Ben.',
      duration: '3 hours for both',
      nearest_station: 'Metro 6 to Heysel — 2 min walk',
      best_time: 'Afternoon',
      tip: 'Buy combination ticket for both. The view from the Atomium top sphere on a clear day covers the whole city.',
      cost: '~€16 Atomium · ~€15 Mini-Europe · combo discount available',
      elderly_friendly: 'Atomium has lifts. Mini-Europe completely flat.',
      kid_friendly: 'Yes — Mini-Europe designed for families. Atomium escalators exciting.',
    }
  },

  // ════════════════════════════════════════════════
  // DAY 19 · Tue 11 Aug · FLY BRU → STOCKHOLM
  // ════════════════════════════════════════════════
  {
    day_number: 19, type: 'alert', title: '⚠️ Taxi to BRU airport by 16:30', time_label: '16:30', sort_order: 0,
    description: 'Pre-booked taxi from Sint-Pieters-Leeuw to Brussels Airport (~30 min). Latest check-in for SK1590 is 18:10. Do not miss this flight.',
    tags: ['Alert', 'Critical'],
    metadata: { action: 'Pre-book taxi the night before. Leave 16:30 latest. 30 min + buffer.' }
  },
  {
    day_number: 19, type: 'activity', title: 'Final Brussels morning', time_label: 'Morning', sort_order: 1,
    description: 'Last morning in Belgium. Final waffle at Grand Place. Stock up on chocolate gifts to take home.',
    tags: ['Free morning', 'Chocolate', 'Farewell Belgium'],
    metadata: {
      tip: 'For chocolate gifts: Mary on Rue Royale or Neuhaus in the Galeries. Pierre Marcolini if budget allows. Budget €30–50 for a selection.',
    }
  },
  {
    day_number: 19, type: 'transport', title: 'Fly Brussels → Stockholm', time_label: '18:55', sort_order: 2,
    description: 'SAS SK1590. 2h 10m. Arrive Arlanda 21:05. Komal collecting. Ref YJI224.',
    tags: ['Flight', 'Confirmed', 'SAS'],
    metadata: {
      ref: 'YJI224',
      from: 'Brussels (BRU)',
      to: 'Stockholm Arlanda (ARN)',
      dep: '18:55',
      arr: '21:05',
      op: 'SAS',
      num: 'SK1590',
      duration: '2h 10m',
      tip: 'Check in online 24 hours before. Terminal A at Brussels Airport. Komal collecting at Arlanda.',
    }
  },

  // ════════════════════════════════════════════════
  // DAY 20 · Wed 12 Aug · REST DAY SOLNA
  // ════════════════════════════════════════════════
  {
    day_number: 20, type: 'activity', title: 'Full rest day at Komal\'s', time_label: 'All day', sort_order: 0,
    description: 'No alarm. No plan. Home-cooked food. After 20 days of travel, this day is not optional — it\'s essential.',
    tags: ['Rest', 'Family time', 'No plans'],
    metadata: {
      what_to_expect: 'Sleep, eat, sit in the garden, watch something. The grandparents especially need a completely unstructured day.',
      tip: 'Resist the urge to plan anything. The flight home is in two days.',
      elderly_friendly: 'Yes — this day is for them',
      kid_friendly: 'Yes — Mira happy at home',
    }
  },

  // ════════════════════════════════════════════════
  // DAY 21 · Thu 13 Aug · FAREWELL DINNER + PACK
  // ════════════════════════════════════════════════
  {
    day_number: 21, type: 'activity', title: 'Farewell dinner with Komal', time_label: 'Evening', sort_order: 0,
    description: 'The last meal in Europe together. Komal\'s choice — restaurant or home-cooked. Pack everything after dinner.',
    tags: ['Family time', 'Farewell', 'Komal'],
    metadata: {
      tip: 'Whatever Komal wants — she\'s been the anchor of this whole trip. Let her pick.',
    }
  },
  {
    day_number: 21, type: 'alert', title: '⚠️ Pack everything tonight', time_label: 'Night', sort_order: 1,
    description: 'Flight departs ARN at 06:00 TOMORROW (Fri 14 Aug). Leave Solna at 03:00am. Set 3 alarms. Everything done tonight.',
    tags: ['Alert', 'Critical'],
    metadata: { action: 'Pack all bags. Set alarm for 02:45am. Pre-book taxi to Arlanda Terminal 5.' }
  },

  // ════════════════════════════════════════════════
  // DAY 22 · Fri 14 Aug · FLY HOME TO DELHI
  // ════════════════════════════════════════════════
  {
    day_number: 22, type: 'transport', title: 'Fly Stockholm → Delhi', time_label: '06:00', sort_order: 0,
    description: 'LH2421 to Munich + LH762 to New Delhi. Ref 9XUWK9. Arrive Delhi 23:55. 22 days complete.',
    tags: ['Flight', 'Confirmed', 'Journey\'s end'],
    metadata: {
      ref: '9XUWK9',
      from: 'Stockholm Arlanda (ARN)',
      to: 'New Delhi (DEL)',
      dep: '06:00',
      arr: '23:55',
      op: 'Lufthansa',
      num: 'LH2421 + LH762',
      via: 'Munich (MUC)',
      duration: '~11h total',
      terminal: 'Terminal 5',
      tip: 'Leave Solna at 03:00am. Arlanda by 03:45am. The journey home: 22 days · 4 countries · 1 family.',
    }
  },
]

export async function GET(req: Request) {
  try {
    const supabase = getSupabase()
    const url = new URL(req.url)
    const force = url.searchParams.get('force') === 'true'

    if (force) {
      await supabase.from('card_photos').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('day_cards').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    } else {
      const { count, error: countError } = await supabase
        .from('day_cards')
        .select('*', { count: 'exact', head: true })
      if (countError) return NextResponse.json({ error: countError.message }, { status: 500 })
      if (count && count > 0) {
        return NextResponse.json({
          message: `Already seeded — ${count} cards exist. Add ?force=true to reseed.`,
          seeded: false
        })
      }
    }

    const cards = SEED_CARDS.map(c => ({
      ...c,
      status: 'upcoming' as const,
      tags: c.tags || [],
      metadata: c.metadata || {},
    }))

    const { error, data } = await supabase.from('day_cards').insert(cards).select()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({
      message: `Seeded ${data.length} cards successfully`,
      seeded: true,
      force
    })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}