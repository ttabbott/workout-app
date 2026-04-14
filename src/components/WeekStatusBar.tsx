'use client'

import { useRouter } from 'next/navigation'
import { WorkoutKey } from '@/lib/types'
import { WORKOUT_ORDER } from '@/lib/workout-data'

interface WeekStatusBarProps {
  completedKeys: Set<WorkoutKey>
  suggestedKey: WorkoutKey | 'filler'
  activeKey: WorkoutKey | 'filler'
}

const WORKOUT_SHORT: Record<WorkoutKey, string> = {
  A: 'Push',
  B: 'Pull',
  C: 'Legs',
  D: 'Shoulders',
}

export default function WeekStatusBar({ completedKeys, suggestedKey, activeKey }: WeekStatusBarProps) {
  const router = useRouter()
  const allDone = suggestedKey === 'filler'

  function handlePick(key: WorkoutKey) {
    if (completedKeys.has(key)) return
    // If tapping the natural suggestion, clear the override
    if (key === suggestedKey) {
      router.push('/')
    } else {
      router.push(`/?workout=${key}`)
    }
  }

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 px-4 py-3 mb-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2.5">
        This Week
      </p>
      <div className="grid grid-cols-4 gap-2">
        {WORKOUT_ORDER.map((key) => {
          const isDone = completedKeys.has(key)
          const isActive = activeKey === key
          const isClickable = !isDone && !allDone

          return (
            <button
              key={key}
              onClick={() => handlePick(key)}
              disabled={isDone || allDone}
              className={`rounded-xl px-2 py-2.5 text-center transition-all ${
                isDone
                  ? 'bg-emerald-950/60 border border-emerald-700/50 cursor-default'
                  : isActive
                  ? 'bg-orange-950/60 border border-orange-600/60'
                  : isClickable
                  ? 'bg-gray-800/60 border border-gray-700/50 hover:bg-gray-700/60 hover:border-gray-600/60 active:scale-95'
                  : 'bg-gray-800/60 border border-gray-700/50'
              }`}
            >
              <div
                className={`text-xs font-bold mb-0.5 ${
                  isDone ? 'text-emerald-400' : isActive ? 'text-orange-300' : 'text-gray-500'
                }`}
              >
                {isDone ? '✓' : key}
              </div>
              <div
                className={`text-xs leading-tight ${
                  isDone ? 'text-emerald-500/70' : isActive ? 'text-orange-200' : 'text-gray-600'
                }`}
              >
                {WORKOUT_SHORT[key]}
              </div>
            </button>
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
