import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@supabase/supabase-js'
import { generateWeeklyPlan, getWeekStart, getLastWeekStart, LastWeekPerf } from '@/lib/generate-plan'
import { WORKOUTS, WORKOUT_ORDER } from '@/lib/workout-data'
import { WorkoutKey } from '@/lib/types'

// This route is called by Vercel Cron every Monday at 8am UTC.
// It uses the service role key to generate plans for all users.

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!serviceRoleKey) {
    return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 })
  }

  // Use service-role client to access all users' data
  const supabase = createServerClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  })

  const weekStart = getWeekStart()
  const lastWeekStart = getLastWeekStart()

  // Get all distinct user IDs that have logged in the last 30 days (active users)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: activeUsers, error: usersError } = await supabase
    .from('daily_logs')
    .select('user_id')
    .gte('log_date', thirtyDaysAgo.toISOString().slice(0, 10))

  if (usersError) {
    console.error('[cron/weekly-plan] Error fetching users:', usersError)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }

  // Deduplicate user IDs
  const userIds = [...new Set((activeUsers ?? []).map((r: { user_id: string }) => r.user_id))]
  console.log(`[cron/weekly-plan] Generating plans for ${userIds.length} users`)

  const results: { userId: string; status: 'ok' | 'error'; error?: string }[] = []

  for (const userId of userIds) {
    try {
      // Skip if plan already exists for this week
      const { data: existing } = await supabase
        .from('workout_plans')
        .select('id')
        .eq('user_id', userId)
        .eq('week_start', weekStart)
        .limit(1)

      if (existing && existing.length > 0) {
        results.push({ userId, status: 'ok' })
        continue
      }

      // Fetch last week's daily logs
      const { data: lastWeekDailyLogs } = await supabase
        .from('daily_logs')
        .select('log_date, workout_key, gym_completed')
        .eq('user_id', userId)
        .gte('log_date', lastWeekStart)
        .lt('log_date', weekStart)

      const lastWeekLogs = lastWeekDailyLogs ?? []

      // Fetch last week's set logs
      const { data: lastWeekSetLogs } = await supabase
        .from('set_logs')
        .select('exercise_id, set_index, completed, actual_weight, actual_reps, log_date')
        .eq('user_id', userId)
        .gte('log_date', lastWeekStart)
        .lt('log_date', weekStart)

      const setLogs = lastWeekSetLogs ?? []

      // Fetch last week's AI plan (if any) for accurate target weights
      const { data: lastWeekPlanRows } = await supabase
        .from('workout_plans')
        .select('workout_key, exercises')
        .eq('user_id', userId)
        .eq('week_start', lastWeekStart)

      // Build performance data
      const perf: LastWeekPerf = WORKOUT_ORDER.map((key: WorkoutKey) => {
        const dailyLog = lastWeekLogs.find((l) => l.workout_key === key)
        const completed = dailyLog?.gym_completed ?? false
        const logDate = dailyLog?.log_date

        const planRow = lastWeekPlanRows?.find((p) => p.workout_key === key)
        const exercises = planRow ? planRow.exercises : WORKOUTS[key].exercises

        const exercisePerfs = exercises.map((ex: { id: string; name: string; setDetails?: Array<{ weight?: number; reps: string; note?: string }> }) => {
          const exerciseSets = setLogs.filter(
            (s) => s.exercise_id === ex.id && s.log_date === logDate
          )
          const sets = (ex.setDetails ?? []).map((detail: { weight?: number; reps: string; note?: string }, i: number) => {
            const logged = exerciseSets.find((s) => s.set_index === i)
            return {
              setIndex: i,
              note: detail.note,
              targetWeight: detail.weight ?? null,
              targetReps: detail.reps,
              actualWeight: logged?.actual_weight ?? null,
              actualReps: logged?.actual_reps ?? null,
              completed: logged?.completed ?? false,
            }
          })
          return { exerciseId: ex.id, name: ex.name, sets }
        })

        return {
          workoutKey: key,
          label: WORKOUTS[key].label,
          completed,
          date: logDate,
          exercises: exercisePerfs,
        }
      })

      const plan = await generateWeeklyPlan(perf)
      if (!plan) {
        results.push({ userId, status: 'error', error: 'generateWeeklyPlan returned null' })
        continue
      }

      const rows = WORKOUT_ORDER.map((key: WorkoutKey) => ({
        user_id: userId,
        week_start: weekStart,
        workout_key: key,
        label: plan[key].label,
        exercises: plan[key].exercises,
      }))

      const { error: upsertError } = await supabase
        .from('workout_plans')
        .upsert(rows, { onConflict: 'user_id,week_start,workout_key' })

      if (upsertError) {
        results.push({ userId, status: 'error', error: upsertError.message })
      } else {
        results.push({ userId, status: 'ok' })
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      results.push({ userId, status: 'error', error: msg })
    }
  }

  const succeeded = results.filter((r) => r.status === 'ok').length
  const failed = results.filter((r) => r.status === 'error').length
  console.log(`[cron/weekly-plan] Done: ${succeeded} ok, ${failed} failed`)

  return NextResponse.json({ weekStart, succeeded, failed, results })
}
