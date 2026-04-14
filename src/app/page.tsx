import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { WORKOUTS, FILLER_CARDIO } from '@/lib/workout-data'
import {
  getSuggestedWorkout,
  getCompletedWorkoutKeys,
  calcYogaStreak,
  calcWeeklyCompletion,
  filterToThisWeek,
} from '@/lib/stats'
import { WorkoutKey, DayWorkout, Exercise } from '@/lib/types'
import { getWeekStart } from '@/lib/generate-plan'
import Header from '@/components/Header'
import StatsBar from '@/components/StatsBar'
import WeekStatusBar from '@/components/WeekStatusBar'
import WorkoutView, { InitialSetLog } from '@/components/WorkoutView'
import FillerCardioView from '@/components/FillerCardioView'
import YogaCheckIn from '@/components/YogaCheckIn'
import GeneratePlanButton from '@/components/GeneratePlanButton'
import WeeklyNotes from '@/components/WeeklyNotes'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ workout?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const now = new Date()
  const logDate = now.toISOString().slice(0, 10)
  const weekStart = getWeekStart()

  const { workout: workoutParam } = await searchParams

  // ── Fetch last 60 days of daily logs ──────────────────────────────────────
  const sixtyDaysAgo = new Date(now)
  sixtyDaysAgo.setDate(now.getDate() - 60)

  const { data: recentLogs } = await supabase
    .from('daily_logs')
    .select('log_date, day_type, gym_completed, yoga_completed, workout_key')
    .eq('user_id', user.id)
    .gte('log_date', sixtyDaysAgo.toISOString().slice(0, 10))

  const allLogs = recentLogs ?? []
  const weekLogs = filterToThisWeek(allLogs)

  // ── Determine today's workout ─────────────────────────────────────────────
  const suggestedKey = getSuggestedWorkout(weekLogs)
  const completedKeys = getCompletedWorkoutKeys(weekLogs)

  // Allow overriding the suggested workout via ?workout=B (only uncompleted keys)
  const VALID_KEYS: WorkoutKey[] = ['A', 'B', 'C', 'D']
  const pickedKey = workoutParam && VALID_KEYS.includes(workoutParam as WorkoutKey) && !completedKeys.has(workoutParam as WorkoutKey)
    ? workoutParam as WorkoutKey
    : null
  const activeKey = pickedKey ?? suggestedKey

  const isFiller = activeKey === 'filler'

  // ── Load this week's AI-generated plan (if available) ────────────────────
  let hasPlan = false
  let aiWorkouts: Record<WorkoutKey, DayWorkout> | null = null

  if (!isFiller) {
    const { data: planRows } = await supabase
      .from('workout_plans')
      .select('workout_key, label, exercises')
      .eq('user_id', user.id)
      .eq('week_start', weekStart)

    if (planRows && planRows.length === 4) {
      hasPlan = true
      aiWorkouts = {} as Record<WorkoutKey, DayWorkout>
      for (const row of planRows) {
        aiWorkouts[row.workout_key as WorkoutKey] = {
          key: row.workout_key as WorkoutKey,
          label: row.label,
          type: 'gym',
          exercises: row.exercises as Exercise[],
        }
      }
    }
  }

  // Use AI plan if available, otherwise fall back to baseline
  const todayWorkout: DayWorkout = isFiller
    ? FILLER_CARDIO
    : (aiWorkouts?.[activeKey as WorkoutKey] ?? WORKOUTS[activeKey as WorkoutKey])

  // ── Fetch today's set logs ────────────────────────────────────────────────
  const { data: rawSetLogs } = await supabase
    .from('set_logs')
    .select('exercise_id, set_index, completed, actual_weight, actual_reps')
    .eq('user_id', user.id)
    .eq('log_date', logDate)

  const initialSetLogs: InitialSetLog[] = (rawSetLogs ?? []).map((r) => ({
    exercise_id: r.exercise_id,
    set_index: r.set_index,
    completed: r.completed,
    actual_weight: r.actual_weight,
    actual_reps: r.actual_reps,
  }))

  // ── Fetch today's yoga state ──────────────────────────────────────────────
  const { data: todayLog } = await supabase
    .from('daily_logs')
    .select('yoga_completed')
    .eq('user_id', user.id)
    .eq('log_date', logDate)
    .maybeSingle()

  const yogaDoneToday = todayLog?.yoga_completed ?? false

  // ── Fetch this week's user note ───────────────────────────────────────────
  const { data: noteRow } = await supabase
    .from('user_notes')
    .select('note_text')
    .eq('user_id', user.id)
    .eq('week_start', weekStart)
    .maybeSingle()

  const currentNote = noteRow?.note_text ?? ''

  // ── Stats ─────────────────────────────────────────────────────────────────
  const yogaStreak = calcYogaStreak(allLogs)
  const weekly = calcWeeklyCompletion(weekLogs)

  // ── Labels ────────────────────────────────────────────────────────────────
  const dateLabel = `${DAY_NAMES[now.getDay()]}, ${MONTH_NAMES[now.getMonth()]} ${now.getDate()}`
  const workoutBadge = isFiller
    ? 'Bonus Cardio 🏃'
    : `Workout ${activeKey} 💪`
  const badgeClass = isFiller
    ? 'bg-blue-900/50 text-blue-300 border-blue-800/60'
    : 'bg-orange-900/50 text-orange-300 border-orange-800/60'

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header email={user.email ?? ''} />

      <main className="max-w-lg mx-auto px-4 py-5">
        {/* Date + workout badge */}
        <div className="mb-5">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white">{dateLabel}</h1>
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${badgeClass}`}>
              {workoutBadge}
            </span>
          </div>
          <p className="text-gray-400 text-sm">
            {todayWorkout.label}
            {hasPlan && (
              <span className="ml-2 text-xs text-indigo-400 font-medium">✨ AI</span>
            )}
          </p>
        </div>

        {/* Stats */}
        <StatsBar
          yogaStreak={yogaStreak}
          weeklyCompletionPercent={weekly.percent}
          completedDays={weekly.completedDays}
          totalDays={weekly.totalDays}
        />

        {/* Week A/B/C/D status */}
        <WeekStatusBar completedKeys={completedKeys} suggestedKey={suggestedKey} activeKey={activeKey} />

        {/* AI plan generation banner — shown if no plan yet and not filler */}
        {!isFiller && !hasPlan && <GeneratePlanButton />}

        {/* Today's workout */}
        {isFiller ? (
          <FillerCardioView
            exercises={todayWorkout.exercises}
            userId={user.id}
            logDate={logDate}
          />
        ) : (
          <WorkoutView
            exercises={todayWorkout.exercises}
            workoutLabel={todayWorkout.label}
            userId={user.id}
            logDate={logDate}
            dayType="gym"
            workoutKey={activeKey as WorkoutKey}
            initialSetLogs={initialSetLogs}
            weekStart={weekStart}
          />
        )}

        {/* Notes for next week */}
        {!isFiller && (
          <WeeklyNotes
            userId={user.id}
            weekStart={weekStart}
            initialNote={currentNote}
          />
        )}

        {/* Yoga — always shown */}
        <div className="mt-4">
          {!isFiller && (
            <p className="text-xs text-gray-500 uppercase tracking-widest px-1 mb-3">
              Yoga — Optional Today
            </p>
          )}
          <YogaCheckIn
            userId={user.id}
            logDate={logDate}
            dayType="gym"
            initialDone={yogaDoneToday}
          />
        </div>
      </main>
    </div>
  )
}
