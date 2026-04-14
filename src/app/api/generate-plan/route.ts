import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateWeeklyPlan, getWeekStart, LastWeekPerf, getLastWeekStart } from '@/lib/generate-plan'
import { WORKOUT_ORDER } from '@/lib/workout-data'
import { WorkoutKey } from '@/lib/types'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const weekStart = getWeekStart()
    const lastWeekStart = getLastWeekStart()

    // ── Build last week's performance data ──────────────────────────────────
    // Fetch last week's daily_logs to find completed workouts
    const { data: lastWeekDailyLogs } = await supabase
      .from('daily_logs')
      .select('log_date, workout_key, gym_completed')
      .eq('user_id', user.id)
      .gte('log_date', lastWeekStart)
      .lt('log_date', weekStart)

    const lastWeekLogs = lastWeekDailyLogs ?? []

    // Fetch last week's set_logs for performance details
    const { data: lastWeekSetLogs } = await supabase
      .from('set_logs')
      .select('exercise_id, set_index, completed, actual_weight, actual_reps, log_date')
      .eq('user_id', user.id)
      .gte('log_date', lastWeekStart)
      .lt('log_date', weekStart)

    const setLogs = lastWeekSetLogs ?? []

    // Fetch this week's existing plan (if any) to use as target weights
    const { data: existingPlanRows } = await supabase
      .from('workout_plans')
      .select('workout_key, exercises')
      .eq('user_id', user.id)
      .eq('week_start', lastWeekStart)

    // Build LastWeekPerf from the data
    const { WORKOUTS } = await import('@/lib/workout-data')

    const perf: LastWeekPerf = WORKOUT_ORDER.map((key: WorkoutKey) => {
      const dailyLog = lastWeekLogs.find((l) => l.workout_key === key)
      const completed = dailyLog?.gym_completed ?? false
      const logDate = dailyLog?.log_date

      // Use AI-generated exercises for last week if available, else baseline
      const planRow = existingPlanRows?.find((p) => p.workout_key === key)
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

        return {
          exerciseId: ex.id,
          name: ex.name,
          sets,
        }
      })

      return {
        workoutKey: key,
        label: WORKOUTS[key].label,
        completed,
        date: logDate,
        exercises: exercisePerfs,
      }
    })

    // ── Fetch this week's user notes (if any) ────────────────────────────────
    const { data: noteRow } = await supabase
      .from('user_notes')
      .select('id, note_text')
      .eq('user_id', user.id)
      .eq('week_start', weekStart)
      .maybeSingle()

    const userNotes = noteRow?.note_text ?? undefined

    // ── Generate new plan via Claude ─────────────────────────────────────────
    const plan = await generateWeeklyPlan(perf, userNotes)
    if (!plan) {
      return NextResponse.json({ error: 'Failed to generate plan' }, { status: 500 })
    }

    // ── Delete consumed note ──────────────────────────────────────────────────
    if (noteRow?.id) {
      await supabase.from('user_notes').delete().eq('id', noteRow.id)
    }

    // ── Upsert into workout_plans ─────────────────────────────────────────────
    const rows = WORKOUT_ORDER.map((key: WorkoutKey) => ({
      user_id: user.id,
      week_start: weekStart,
      workout_key: key,
      label: plan[key].label,
      exercises: plan[key].exercises,
    }))

    const { error: upsertError } = await supabase
      .from('workout_plans')
      .upsert(rows, { onConflict: 'user_id,week_start,workout_key' })

    if (upsertError) {
      console.error('[generate-plan] Upsert error:', upsertError)
      return NextResponse.json({ error: 'Failed to save plan' }, { status: 500 })
    }

    return NextResponse.json({ success: true, weekStart })
  } catch (err) {
    console.error('[generate-plan] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
