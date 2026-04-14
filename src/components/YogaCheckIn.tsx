'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface YogaCheckInProps {
  userId: string
  logDate: string     // 'YYYY-MM-DD'
  dayType: string     // 'gym' | 'yoga'
  initialDone: boolean
}

export default function YogaCheckIn({ userId, logDate, dayType, initialDone }: YogaCheckInProps) {
  const [done, setDone] = useState(initialDone)
  const [saving, setSaving] = useState(false)

  async function handleToggle() {
    setSaving(true)
    const next = !done
    const supabase = createClient()
    await supabase.from('daily_logs').upsert(
      {
        user_id: userId,
        log_date: logDate,
        day_type: dayType,
        yoga_completed: next,
      },
      { onConflict: 'user_id,log_date' }
    )
    setDone(next)
    setSaving(false)
  }

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">🧘</span>
          <div>
            <h2 className="text-white font-semibold text-lg">Yoga / Stretching</h2>
            <p className="text-gray-400 text-sm">Rest day — just check in when done</p>
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-5 leading-relaxed">
          Take 15–30 minutes for yoga or stretching. Focus on flexibility, breath, and recovery.
          No exercises prescribed — just move mindfully and mark it complete.
        </p>

        <button
          onClick={handleToggle}
          disabled={saving}
          className={`w-full py-4 rounded-xl font-semibold text-base transition-all disabled:opacity-60 ${
            done
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/40'
              : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700'
          }`}
        >
          {saving ? 'Saving…' : done ? '✓ Yoga Complete — Great work!' : 'Mark Yoga Done'}
        </button>
      </div>
    </div>
  )
}
