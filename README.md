# Europa Trip 2026 · Family PWA

22 days · Sweden · Denmark · Netherlands · Belgium

## Setup in 5 steps

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Copy `.env.local.example` to `.env.local` and fill in your Supabase values:
```bash
cp .env.local.example .env.local
```
Then edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
Find these in: Supabase dashboard → Settings → API

### 3. Run the Supabase schema
In Supabase → SQL Editor → New query, paste and run the schema from `supabase-schema.sql`

### 4. Create the storage bucket
Supabase → Storage → New bucket → Name: `trip-photos` → Public: ✅ Yes

### 5. Run locally
```bash
npm run dev
```
Open http://localhost:3000

### 6. Seed the database
Visit http://localhost:3000/api/seed once to load all 22 days of itinerary data.

## Deploy to Vercel
```bash
git init && git add . && git commit -m "initial"
```
Push to GitHub, then import in vercel.com. Add environment variables in Vercel dashboard → Settings → Environment Variables.

## Features
- **Today tab** — live day dashboard, date rail to browse all 22 days, timeline cards
- **Journey tab** — all 22 days grouped by country with expandable cards
- **Explore tab** — tools, trivia, language phrases
- **Lists tab** — checklists with 2-minute trip check mode
- **Edit cards** — tap any card → edit button → update title, description, time, status
- **Photo upload** — tap any card → add photo → up to 5 photos per card (stored in Supabase)
- **Add cards** — FAB (+) button on Today tab to add new cards
- **Realtime** — Supabase Realtime subscription keeps all members in sync
- **PWA** — add to home screen on iOS/Android for app-like experience
