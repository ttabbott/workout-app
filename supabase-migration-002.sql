-- Migration 002: add workout_key to daily_logs
-- Run in: https://supabase.com/dashboard/project/epfeofuadzwmgbqncxrf/sql/new

ALTER TABLE public.daily_logs
  ADD COLUMN IF NOT EXISTS workout_key TEXT
  CHECK (workout_key IN ('A', 'B', 'C', 'D'));
