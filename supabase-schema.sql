-- Platforma Najmu — schemat bazy
-- Uruchom w Supabase: Dashboard → SQL Editor → New query → Run

-- ============ PROFILES (jeden na uzytkownika) ============
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text,                       -- 'wynajmujacy' | 'najemca' | null
  stripe_customer_id text,
  created_at timestamptz default now()
);

-- ============ PROPERTIES (mieszkania wystawiane przez wynajmujacych) ============
create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  city text not null,
  district text,
  rooms int,
  area numeric,
  price int,                       -- zl / mc
  available_from text,
  description text,
  image_url text,
  tour_url text,
  has_tour boolean default false,
  status text default 'aktywne',   -- aktywne | wynajete | wstrzymane
  created_at timestamptz default now()
);

-- ============ TENANT_LEADS (najemcy — czego szukaja) ============
create table if not exists tenant_leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  full_name text,
  contact text,
  city text,
  district text,
  budget_max int,
  rooms_min int,
  move_in text,
  pets boolean default false,
  duration text,
  notes text,
  source text,                     -- skad lead: fb | olx | formularz | instagram
  created_at timestamptz default now()
);

-- ============ FAVORITES (ulubione mieszkania najemcy) ============
create table if not exists favorites (
  user_id uuid references auth.users(id) on delete cascade,
  property_id uuid references properties(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, property_id)
);

-- ============ ORDERS (pakiety + gwarancja) ============
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid references properties(id) on delete set null,
  package text,                    -- basic | standard | premium
  amount int,
  guarantee_days int,
  status text default 'oczekuje',  -- oczekuje | oplacone | wynajete | zwrot
  refund_due date,
  stripe_session_id text,
  paid_at timestamptz,
  created_at timestamptz default now()
);

-- ============ INDEKSY ============
create index if not exists idx_properties_owner on properties(owner_id);
create index if not exists idx_properties_city on properties(city);
create index if not exists idx_leads_user on tenant_leads(user_id);
create index if not exists idx_orders_user on orders(user_id);

-- ============ RLS ============
alter table profiles enable row level security;
alter table properties enable row level security;
alter table tenant_leads enable row level security;
alter table favorites enable row level security;
alter table orders enable row level security;

-- profiles: tylko swoje
create policy "profiles_select_own" on profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);

-- properties: publiczny odczyt (lista mieszkan), zapis tylko wlasciciel
create policy "properties_select_all" on properties for select using (true);
create policy "properties_insert_own" on properties for insert with check (auth.uid() = owner_id);
create policy "properties_update_own" on properties for update using (auth.uid() = owner_id);
create policy "properties_delete_own" on properties for delete using (auth.uid() = owner_id);

-- tenant_leads: kazdy moze dodac (lead z formularza), czyta tylko swoje
create policy "leads_insert_any" on tenant_leads for insert with check (true);
create policy "leads_select_own" on tenant_leads for select using (auth.uid() = user_id);

-- favorites: tylko swoje
create policy "favorites_all_own" on favorites for all using (auth.uid() = user_id);

-- orders: tylko swoje
create policy "orders_select_own" on orders for select using (auth.uid() = user_id);
create policy "orders_insert_own" on orders for insert with check (auth.uid() = user_id);

-- ============ AUTO-PROFIL PRZY REJESTRACJI ============
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
