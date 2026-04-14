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
import { WorkoutKey } from '@/lib/types'
import Header from '@/components/Header'
import StatsBar from '@/components/StatsBar'
import WeekStatusBar from '@/components/WeekStatusBar'
import WorkoutView, { InitialSetLog } from '@/components/WorkoutView'
import FillerCardioView from '@/components/FillerCardioView'
import YogaCheckIn from '@/components/YogaCheckIn'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const now = new Date()
  const logDate = now.toISOString().slice(0, 10)

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
  const isFiller = suggestedKey === 'filler'
  const todayWorkout = isFiller ? FILLER_CARDIO : WORKOUTS[suggestedKey as WorkoutKey]

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

  // ── Stats ─────────────────────────────────────────────────────────────────
  const yogaStreak = calcYogaStreak(allLogs)
  const weekly = calcWeeklyCompletion(weekLogs)

  // ── Labels ────────────────────────────────────────────────────────────────
  const dateLabel = `${DAY_NAMES[now.getDay()]}, ${MONTH_NAMES[now.getMonth()]} ${now.getDate()}`
  const workoutBadge = isFiller
    ? 'Bonus Cardio 🏃'
    : `Workout ${suggestedKey} 💪`
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
          <p className="text-gray-400 text-sm">{todayWorkout.label}</p>
        </div>

        {/* Stats */}
        <StatsBar
          yogaStreak={yogaStreak}
          weeklyCompletionPercent={weekly.percent}
          completedDays={weekly.completedDays}
          totalDays={weekly.totalDays}
        />

        {/* Week A/B/C/D status */}
        <WeekStatusBar completedKeys={completedKeys} suggestedKey={suggestedKey} />

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
            workoutKey={suggestedKey as WorkoutKey}
            initialSetLogs={initialSetLogs}
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
