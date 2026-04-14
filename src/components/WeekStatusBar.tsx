import { WorkoutKey } from '@/lib/types'
import { WORKOUTS, WORKOUT_ORDER } from '@/lib/workout-data'

interface WeekStatusBarProps {
  completedKeys: Set<WorkoutKey>
  suggestedKey: WorkoutKey | 'filler'
}

const WORKOUT_SHORT: Record<WorkoutKey, string> = {
  A: 'Push',
  B: 'Pull',
  C: 'Legs',
  D: 'Shoulders',
}

export default function WeekStatusBar({ completedKeys, suggestedKey }: WeekStatusBarProps) {
  const allDone = suggestedKey === 'filler'

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 px-4 py-3 mb-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2.5">
        This Week
      </p>
      <div className="grid grid-cols-4 gap-2">
        {WORKOUT_ORDER.map((key) => {
          const isDone = completedKeys.has(key)
          const isCurrent = suggestedKey === key
          return (
            <div
              key={key}
              className={`rounded-xl px-2 py-2.5 text-center transition-all ${
                isDone
                  ? 'bg-emerald-950/60 border border-emerald-700/50'
                  : isCurrent
                  ? 'bg-orange-950/60 border border-orange-600/60'
                  : 'bg-gray-800/60 border border-gray-700/50'
              }`}
            >
              <div
                className={`text-xs font-bold mb-0.5 ${
                  isDone ? 'text-emerald-400' : isCurrent ? 'text-orange-300' : 'text-gray-500'
                }`}
              >
                {isDone ? '✓' : key}
              </div>
              <div
                className={`text-xs leading-tight ${
                  isDone ? 'text-emerald-500/70' : isCurrent ? 'text-orange-200' : 'text-gray-600'
                }`}
              >
                {WORKOUT_SHORT[key]}
              </div>
            </div>
          )
        })}
      </div>
      {allDone && (
        <p className="text-center text-emerald-400 text-xs mt-2.5 font-medium">
          🎉 All 4 workouts done this week!
        </p>
      )}
    </div>
  )
}
