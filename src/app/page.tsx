import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getTodayWorkout } from '@/lib/workout-data'
import { calcYogaStreak, calcWeeklyCompletion } from '@/lib/stats'
import Header from '@/components/Header'
import StatsBar from '@/components/StatsBar'
import WorkoutView, { InitialSetLog } from '@/components/WorkoutView'
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

  const today = getTodayWorkout()
  const now = new Date()
  const logDate = now.toISOString().slice(0, 10)   // 'YYYY-MM-DD'

  // ── Fetch today's set logs (for gym days) ──────────────────────────────────
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

  // ── Fetch today's daily log (for yoga done state) ─────────────────────────
  const { data: todayLog } = await supabase
    .from('daily_logs')
    .select('yoga_completed')
    .eq('user_id', user.id)
    .eq('log_date', logDate)
    .maybeSingle()

  const yogaDoneToday = todayLog?.yoga_completed ?? false

  // ── Fetch last 60 days of daily logs (for streak + weekly %) ─────────────
  const sixtyDaysAgo = new Date(now)
  sixtyDaysAgo.setDate(now.getDate() - 60)

  const { data: recentLogs } = await supabase
    .from('daily_logs')
    .select('log_date, day_type, gym_completed, yoga_completed')
    .eq('user_id', user.id)
    .gte('log_date', sixtyDaysAgo.toISOString().slice(0, 10))

  const stats = (() => {
    const logs = recentLogs ?? []
    const yogaStreak = calcYogaStreak(logs)
    const weekly = calcWeeklyCompletion(logs)
    return { yogaStreak, ...weekly }
  })()

  // ── UI labels ─────────────────────────────────────────────────────────────
  const dateLabel = `${DAY_NAMES[now.getDay()]}, ${MONTH_NAMES[now.getMonth()]} ${now.getDate()}`
  const typeLabel = today.type === 'gym' ? 'Gym Day 💪' : 'Rest & Yoga 🧘'
  const typeBadgeClass =
    today.type === 'gym'
      ? 'bg-orange-900/50 text-orange-300 border-orange-800/60'
      : 'bg-purple-900/50 text-purple-300 border-purple-800/60'

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header email={user.email ?? ''} />

      <main className="max-w-lg mx-auto px-4 py-5">
        {/* Date + workout type */}
        <div className="mb-5">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white">{dateLabel}</h1>
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${typeBadgeClass}`}>
              {typeLabel}
            </span>
          </div>
          <p className="text-gray-400 text-sm">{today.label}</p>
        </div>

        {/* Stats */}
        <StatsBar
          yogaStreak={stats.yogaStreak}
          weeklyCompletionPercent={stats.percent}
          completedDays={stats.completedDays}
          totalDays={stats.totalDays}
        />

        {/* Today's workout */}
        {today.type === 'gym' ? (
          <>
            <WorkoutView
              exercises={today.exercises}
              workoutLabel={today.label}
              userId={user.id}
              logDate={logDate}
              dayType={today.type}
              initialSetLogs={initialSetLogs}
            />
            {/* Yoga optional on gym days */}
            <div className="mt-4">
              <p className="text-xs text-gray-500 uppercase tracking-widest px-1 mb-3">
                Optional — Yoga today
              </p>
              <YogaCheckIn
                userId={user.id}
                logDate={logDate}
                dayType={today.type}
                initialDone={yogaDoneToday}
              />
            </div>
          </>
        ) : (
          <>
            <YogaCheckIn
              userId={user.id}
              logDate={logDate}
              dayType={today.type}
              initialDone={yogaDoneToday}
            />
            <p className="text-center text-gray-600 text-xs mt-5">
              Gym days: Mon · Tue · Thu · Fri
            </p>
          </>
        )}
      </main>
    </div>
  )
}
