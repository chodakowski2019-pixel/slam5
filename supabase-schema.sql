-- Slam5 Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)

-- Profiles (one per user)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  phone_number text,
  body_goal text,
  mind_goal text,
  money_goal text,
  plan_time text default 'morning',
  plan_hour text default '08:00',
  onboarding_completed boolean default false,
  subscription_status text default 'none',
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  total_points integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tasks
create table if not exists tasks (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  completed boolean default false,
  project_id text,
  category text default 'money',
  is_frog boolean default false,
  timer_minutes integer default 25,
  timer_seconds_left integer,
  timer_running boolean default false,
  points integer default 0,
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- Projects
create table if not exists projects (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  emoji text default '📁',
  color text default '#818cf8',
  description text,
  created_at timestamptz default now()
);

-- Goals
create table if not exists goals (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  deadline date,
  horizon text default '1y',
  progress integer default 0,
  milestones jsonb default '[]'::jsonb,
  project_id text,
  completed boolean default false,
  created_at timestamptz default now()
);

-- Parking Lot
create table if not exists parking_lot (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  text text not null,
  created_at timestamptz default now()
);

-- Day Records
create table if not exists day_records (
  id serial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  tasks_total integer default 0,
  tasks_completed integer default 0,
  won boolean default false,
  points integer default 0,
  unique(user_id, date)
);

-- Indexes for fast queries
create index if not exists idx_tasks_user on tasks(user_id);
create index if not exists idx_tasks_created on tasks(user_id, created_at);
create index if not exists idx_projects_user on projects(user_id);
create index if not exists idx_goals_user on goals(user_id);
create index if not exists idx_parking_user on parking_lot(user_id);
create index if not exists idx_day_records_user on day_records(user_id, date);

-- Row Level Security (RLS) — users can only see their own data
alter table profiles enable row level security;
alter table tasks enable row level security;
alter table projects enable row level security;
alter table goals enable row level security;
alter table parking_lot enable row level security;
alter table day_records enable row level security;

-- RLS Policies
create policy "Users read own profile" on profiles for select using (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);
create policy "Users insert own profile" on profiles for insert with check (auth.uid() = id);

create policy "Users read own tasks" on tasks for select using (auth.uid() = user_id);
create policy "Users manage own tasks" on tasks for all using (auth.uid() = user_id);

create policy "Users read own projects" on projects for select using (auth.uid() = user_id);
create policy "Users manage own projects" on projects for all using (auth.uid() = user_id);

create policy "Users read own goals" on goals for select using (auth.uid() = user_id);
create policy "Users manage own goals" on goals for all using (auth.uid() = user_id);

create policy "Users read own parking" on parking_lot for select using (auth.uid() = user_id);
create policy "Users manage own parking" on parking_lot for all using (auth.uid() = user_id);

create policy "Users read own records" on day_records for select using (auth.uid() = user_id);
create policy "Users manage own records" on day_records for all using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
