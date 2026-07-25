-- Run this in Supabase → SQL Editor → New query

create table profiles (
  id uuid references auth.users primary key,
  name text not null,
  role text default 'member',
  avatar_color text default '#1B4D8E',
  created_at timestamptz default now()
);

create table day_cards (
  id uuid primary key default gen_random_uuid(),
  day_number integer not null,
  type text not null default 'activity',
  title text not null,
  description text,
  time_label text,
  location text,
  tags text[] default '{}',
  status text default 'upcoming',
  sort_order integer default 0,
  metadata jsonb default '{}',
  created_by uuid,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

create table card_photos (
  id uuid primary key default gen_random_uuid(),
  card_id uuid references day_cards(id) on delete cascade,
  storage_path text not null,
  caption text,
  uploaded_by uuid,
  created_at timestamptz default now()
);

create table checklist_lists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text default 'custom',
  day_number integer,
  created_at timestamptz default now()
);

create table checklist_items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid references checklist_lists(id) on delete cascade,
  text text not null,
  checked boolean default false,
  checked_by uuid,
  checked_at timestamptz,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Enable realtime
alter publication supabase_realtime add table day_cards;
alter publication supabase_realtime add table card_photos;
alter publication supabase_realtime add table checklist_items;

-- Enable RLS (Row Level Security)
alter table profiles enable row level security;
alter table day_cards enable row level security;
alter table card_photos enable row level security;
alter table checklist_lists enable row level security;
alter table checklist_items enable row level security;

-- Policies — all family members can read and write everything
create policy "family_all" on profiles for all using (true) with check (true);
create policy "family_all" on day_cards for all using (true) with check (true);
create policy "family_all" on card_photos for all using (true) with check (true);
create policy "family_all" on checklist_lists for all using (true) with check (true);
create policy "family_all" on checklist_items for all using (true) with check (true);
