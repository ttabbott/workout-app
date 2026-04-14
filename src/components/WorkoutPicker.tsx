'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { WorkoutKey } from '@/lib/types'

interface WorkoutOption {
  key: WorkoutKey
  label: string
}

interface Props {
  activeKey: WorkoutKey
  suggestedKey: WorkoutKey
  options: WorkoutOption[]   // uncompleted workouts excluding the current active one
}

export default function WorkoutPicker({ activeKey, suggestedKey, options }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  if (options.length === 0) return null

  function pick(key: WorkoutKey) {
    setOpen(false)
    if (key === suggestedKey) {
      router.push('/')
    } else {
      router.push(`/?workout=${key}`)
    }
  }

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors"
      >
        <span className="text-gray-600">⇄</span>
        Change workout
        <span className="text-gray-600">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="mt-2 flex flex-wrap gap-2">
          {options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => pick(opt.key)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700
                         border border-gray-700 hover:border-gray-600 transition-all active:scale-95"
            >
              <span className="text-xs font-bold text-orange-300">{opt.key}</span>
              <span className="text-xs text-gray-300">{opt.label}</span>
            </button>
          ))}
          {activeKey !== suggestedKey && (
            <button
              onClick={() => pick(suggestedKey)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-800/50 hover:bg-gray-700
                         border border-gray-700/60 transition-all active:scale-95"
            >
              <span className="text-xs text-gray-400">↩ Back to suggested ({suggestedKey})</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
