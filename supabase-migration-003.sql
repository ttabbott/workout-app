-- Migration 003: AI-generated weekly workout plans
-- Run in: https://supabase.com/dashboard/project/epfeofuadzwmgbqncxrf/sql/new

create table if not exists public.workout_plans (
  id           uuid        default gen_random_uuid() primary key,
  user_id      uuid        references auth.users not null,
  week_start   date        not null,   -- Monday of the target week
  workout_key  text        not null check (workout_key in ('A', 'B', 'C', 'D')),
  label        text        not null,
  exercises    jsonb       not null,   -- Exercise[] serialised
  generated_at timestamptz default now() not null,
  unique(user_id, week_start, workout_key)
);

alter table public.workout_plans enable row level security;

create policy "Users manage their own workout plans"
  on public.workout_plans for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);
