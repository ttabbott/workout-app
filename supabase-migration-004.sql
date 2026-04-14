-- Migration 004: user_notes table for weekly plan feedback
-- Run in Supabase SQL editor: https://supabase.com/dashboard/project/epfeofuadzwmgbqncxrf/sql/new

create table if not exists public.user_notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  week_start date not null,
  note_text text not null,
  created_at timestamptz default now() not null,
  unique(user_id, week_start)
);

alter table public.user_notes enable row level security;

create policy "Users manage their own notes"
  on public.user_notes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
