import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getWeekStart } from '@/lib/generate-plan'
import { WorkoutKey, Exercise } from '@/lib/types'

// PATCH /api/swap-exercise
// Replaces one exercise in the current week's workout_plans row with a substitute.
// Body: { workoutKey, oldExerciseId, substitute: Exercise }

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { workoutKey, oldExerciseId, substitute } = body as {
      workoutKey: WorkoutKey
      oldExerciseId: string
      substitute: Exercise
    }

    if (!workoutKey || !oldExerciseId || !substitute) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const weekStart = getWeekStart()

    // Fetch the current exercises for this workout
    const { data: planRow, error: fetchError } = await supabase
      .from('workout_plans')
      .select('exercises')
      .eq('user_id', user.id)
      .eq('week_start', weekStart)
      .eq('workout_key', workoutKey)
      .maybeSingle()

    if (fetchError) {
      return NextResponse.json({ error: 'Failed to fetch plan' }, { status: 500 })
    }

    if (!planRow) {
      // No AI plan row exists — can't persist swap (swap will be in-memory only on the client)
      return NextResponse.json({ error: 'No plan row found for this workout' }, { status: 404 })
    }

    const exercises = planRow.exercises as Exercise[]
    const idx = exercises.findIndex((e) => e.id === oldExerciseId)
    if (idx === -1) {
      return NextResponse.json({ error: 'Exercise not found in plan' }, { status: 404 })
    }

    // Replace the exercise, preserving position
    const updated = [...exercises]
    updated[idx] = substitute

    const { error: updateError } = await supabase
      .from('workout_plans')
      .update({ exercises: updated })
      .eq('user_id', user.id)
      .eq('week_start', weekStart)
      .eq('workout_key', workoutKey)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 })
    }

    return NextResponse.json({ success: true, exercises: updated })
  } catch (err) {
    console.error('[swap-exercise] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
