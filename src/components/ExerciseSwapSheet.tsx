'use client'

import { useEffect, useRef } from 'react'
import { Exercise } from '@/lib/types'
import { SUBSTITUTIONS, Substitution } from '@/lib/workout-data'

interface Props {
  exercise: Exercise
  workoutKey: string
  onSkip: () => void
  onSwap: (substitute: Exercise) => void
  onNoteForNextWeek: (text: string) => void
  onClose: () => void
}

export default function ExerciseSwapSheet({
  exercise,
  workoutKey,
  onSkip,
  onSwap,
  onNoteForNextWeek,
  onClose,
}: Props) {
  const sheetRef = useRef<HTMLDivElement>(null)

  // Close on backdrop click
  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose()
  }

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const subs: Substitution[] = SUBSTITUTIONS[exercise.id] ?? []

  function buildSubstituteExercise(sub: Substitution): Exercise {
    // Inherit the same set structure as the original, just swap id/name
    return {
      ...exercise,
      id: sub.id,
      name: sub.name,
      notes: sub.note,
    }
  }

  function handleSwap(sub: Substitution) {
    onSwap(buildSubstituteExercise(sub))
  }

  function handleNoteForNextWeek() {
    onNoteForNextWeek(`Replace "${exercise.name}" next week — unavailable today`)
    onSkip()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/60"
      onClick={handleBackdropClick}
    >
      <div
        ref={sheetRef}
        className="w-full max-w-lg mx-auto bg-gray-900 rounded-t-3xl border-t border-gray-800 p-5 pb-8"
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-gray-700 rounded-full mx-auto mb-4" />

        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Can&apos;t do</p>
        <h3 className="text-lg font-bold text-white mb-4">{exercise.name}</h3>

        {/* Substitutions */}
        {subs.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-2">Swap to…</p>
            <div className="space-y-2">
              {subs.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handleSwap(sub)}
                  className="w-full text-left px-4 py-3 rounded-xl bg-gray-800 hover:bg-gray-700
                             transition-colors flex items-center justify-between"
                >
                  <div>
                    <span className="text-sm font-medium text-white">{sub.name}</span>
                    {sub.note && (
                      <span className="text-xs text-gray-400 ml-2">— {sub.note}</span>
                    )}
                  </div>
                  <span className="text-gray-500 text-lg">→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-800 my-3" />

        {/* Other options */}
        <div className="space-y-2">
          <button
            onClick={handleNoteForNextWeek}
            className="w-full text-left px-4 py-3 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60
                       border border-indigo-800/40 transition-colors"
          >
            <p className="text-sm font-medium text-indigo-300">Skip + note for next week</p>
            <p className="text-xs text-indigo-500 mt-0.5">
              Skip today and tell AI to suggest an alternative next week
            </p>
          </button>

          <button
            onClick={() => { onSkip(); onClose() }}
            className="w-full text-left px-4 py-3 rounded-xl bg-gray-800/60 hover:bg-gray-800
                       transition-colors"
          >
            <p className="text-sm font-medium text-gray-300">Skip for today only</p>
            <p className="text-xs text-gray-500 mt-0.5">Remove from today&apos;s session, no note saved</p>
          </button>

          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:text-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
