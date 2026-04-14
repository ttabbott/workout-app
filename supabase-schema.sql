-- Phase 2 schema: run this in Supabase SQL Editor
-- https://supabase.com/dashboard/project/epfeofuadzwmgbqncxrf/sql/new

-- ─── Tables ───────────────────────────────────────────────────────────────────

-- One row per user per day: tracks gym + yoga completion
create table if not exists public.daily_logs (
  id           uuid        default gen_random_uuid() primary key,
  user_id      uuid        references auth.users not null,
  log_date     date        not null,
  day_type     text        not null check (day_type in ('gym', 'yoga')),
  gym_completed   boolean  default false not null,
  yoga_completed  boolean  default false not null,
  created_at   timestamptz default now() not null,
  unique(user_id, log_date)
);

-- One row per set (or cardio block) per user per day
-- set_index = -1 means it's a cardio exercise
create table if not exists public.set_logs (
  id           uuid        default gen_random_uuid() primary key,
  user_id      uuid        references auth.users not null,
  log_date     date        not null,
  exercise_id  text        not null,
  set_index    integer     not null default -1,
  completed    boolean     default true not null,
  actual_weight numeric,
  actual_reps  integer,
  created_at   timestamptz default now() not null,
  unique(user_id, log_date, exercise_id, set_index)
);

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table public.daily_logs enable row level security;
alter table public.set_logs    enable row level security;

create policy "Users manage their own daily logs"
  on public.daily_logs for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage their own set logs"
  on public.set_logs for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);
