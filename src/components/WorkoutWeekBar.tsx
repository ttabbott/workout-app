'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { WorkoutKey } from '@/lib/types'
import { WORKOUT_ORDER } from '@/lib/workout-data'

interface WorkoutOption {
  key: WorkoutKey
  label: string
}

interface Props {
  completedKeys: Set<WorkoutKey>
  suggestedKey: WorkoutKey | 'filler'
  activeKey: WorkoutKey | 'filler'
  pickerOptions: WorkoutOption[]
}

export default function WorkoutWeekBar({ completedKeys, suggestedKey, activeKey, pickerOptions }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const allDone = suggestedKey === 'filler'

  function pick(key: WorkoutKey) {
    setOpen(false)
    router.push(key === suggestedKey ? '/' : `/?workout=${key}`)
  }

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 px-4 py-3 mb-4">
      {/* Single row: chips + change button */}
      <div className="flex items-center gap-2">
        {/* Compact chips */}
        <div className="flex gap-1.5 flex-1">
          {WORKOUT_ORDER.map((key) => {
            const isDone = completedKeys.has(key)
            const isActive = activeKey === key
            return (
              <div
                key={key}
                className={`flex items-center justify-center rounded-lg text-xs font-bold transition-all
                  ${isDone
                    ? 'w-7 h-7 bg-emerald-950/80 border border-emerald-700/50 text-emerald-400'
                    : isActive
                    ? 'px-3 h-7 bg-orange-950/80 border border-orange-600/70 text-orange-300'
                    : 'w-7 h-7 bg-gray-800/60 border border-gray-700/40 text-gray-600'
                  }`}
              >
                {isDone ? '✓' : key}
              </div>
            )
          })}
        </div>

        {/* Change button — only shown if alternatives exist */}
        {!allDone && pickerOptions.length > 0 && (
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-200
                       transition-colors whitespace-nowrap ml-1"
          >
            Change
            <span className="text-gray-600 text-[10px]">{open ? '▲' : '▼'}</span>
          </button>
        )}

        {allDone && (
          <span className="text-xs text-emerald-400 font-medium ml-1">All done 🎉</span>
        )}
      </div>

      {/* Picker options — shown inline when open */}
      {open && (
        <div className="mt-3 pt-3 border-t border-gray-800 flex flex-col gap-2">
          {pickerOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => pick(opt.key)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-800
                         hover:bg-gray-700 border border-gray-700/60 transition-all
                         active:scale-[0.98] text-left"
            >
              <span className="text-sm font-bold text-orange-300 w-4">{opt.key}</span>
              <span className="text-sm text-gray-200">{opt.label}</span>
            </button>
          ))}
          {activeKey !== suggestedKey && !allDone && (
            <button
              onClick={() => pick(suggestedKey as WorkoutKey)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-500
                         hover:text-gray-300 transition-colors"
            >
              ↩ Back to suggested ({suggestedKey})
            </button>
          )}
        </div>
      )}
    </div>
  )
}
