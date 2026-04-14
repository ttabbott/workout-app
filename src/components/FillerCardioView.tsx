'use client'

import { useState } from 'react'
import { Exercise } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'

interface FillerCardioViewProps {
  exercises: Exercise[]
  userId: string
  logDate: string
}

export default function FillerCardioView({ exercises, userId, logDate }: FillerCardioViewProps) {
  const [done, setDone] = useState<Record<string, boolean>>({})

  async function toggle(exerciseId: string) {
    const next = !done[exerciseId]
    setDone((prev) => ({ ...prev, [exerciseId]: next }))
    const supabase = createClient()
    await supabase.from('set_logs').upsert(
      {
        user_id: userId,
        log_date: logDate,
        exercise_id: exerciseId,
        set_index: -1,
        completed: next,
        actual_weight: null,
        actual_reps: null,
      },
      { onConflict: 'user_id,log_date,exercise_id,set_index' }
    )
  }

  return (
    <div className="space-y-3">
      <div className="bg-emerald-950/40 border border-emerald-700/50 rounded-2xl p-4 text-center">
        <div className="text-2xl mb-1">🏆</div>
        <p className="text-emerald-300 font-semibold text-sm">All 4 workouts done this week!</p>
        <p className="text-emerald-500/70 text-xs mt-1">Here's a bonus cardio & recovery session</p>
      </div>

      {exercises.map((ex) => (
        <div
          key={ex.id}
          className={`rounded-2xl border px-4 py-4 transition-all ${
            done[ex.id]
              ? 'bg-emerald-950/60 border-emerald-700/60'
              : 'bg-gray-900 border-gray-800'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="text-white font-medium">{ex.name}</div>
              <div className="text-sm text-gray-400 mt-1">
                ⏱ {ex.duration} min — {ex.intensity}
              </div>
            </div>
            <button
              onClick={() => toggle(ex.id)}
              className={`flex-shrink-0 text-xs px-3 py-2 rounded-lg font-medium transition-colors ${
                done[ex.id]
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-white'
              }`}
            >
              {done[ex.id] ? '✓ Done' : 'Complete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
