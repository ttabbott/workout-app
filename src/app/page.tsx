import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getTodayWorkout, getWeeklyStats } from '@/lib/workout-data'
import Header from '@/components/Header'
import StatsBar from '@/components/StatsBar'
import WorkoutView from '@/components/WorkoutView'
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
  const stats = getWeeklyStats()

  const now = new Date()
  const dateLabel = `${DAY_NAMES[now.getDay()]}, ${MONTH_NAMES[now.getMonth()]} ${now.getDate()}`

  const typeLabel =
    today.type === 'gym'
      ? 'Gym Day 💪'
      : 'Rest & Yoga 🧘'

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
            <span
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${typeBadgeClass}`}
            >
              {typeLabel}
            </span>
          </div>
          <p className="text-gray-400 text-sm">{today.label}</p>
        </div>

        {/* Stats */}
        <StatsBar
          yogaStreak={stats.yogaStreak}
          weeklyCompletionPercent={stats.weeklyCompletionPercent}
          completedDays={stats.completedDays}
          totalDays={stats.totalDays}
        />

        {/* Today's workout */}
        {today.type === 'gym' ? (
          <WorkoutView exercises={today.exercises} workoutLabel={today.label} />
        ) : (
          <>
            <YogaCheckIn />
            <p className="text-center text-gray-600 text-xs mt-5">
              Gym days: Mon · Tue · Thu · Fri
            </p>
          </>
        )}
      </main>
    </div>
  )
}
