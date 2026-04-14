'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  userId: string
  weekStart: string
  initialNote: string
}

export default function WeeklyNotes({ userId, weekStart, initialNote }: Props) {
  const [note, setNote] = useState(initialNote)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const supabase = useRef(createClient()).current
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function persist(value: string) {
    setSaving(true)
    setSaved(false)
    if (value.trim()) {
      await supabase
        .from('user_notes')
        .upsert({ user_id: userId, week_start: weekStart, note_text: value.trim() },
                 { onConflict: 'user_id,week_start' })
    } else {
      // Empty — delete existing note if any
      await supabase
        .from('user_notes')
        .delete()
        .eq('user_id', userId)
        .eq('week_start', weekStart)
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value
    setNote(value)
    setSaved(false)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => persist(value), 1000)
  }

  return (
    <div className="rounded-2xl bg-gray-900/60 border border-gray-800/60 p-4 mt-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Notes for next week&apos;s plan
        </p>
        {saving && <span className="text-xs text-gray-500">Saving…</span>}
        {saved && !saving && <span className="text-xs text-emerald-400">Saved ✓</span>}
      </div>
      <textarea
        value={note}
        onChange={handleChange}
        placeholder="e.g. add more core work, reduce leg volume, skip RDL next week…"
        rows={3}
        className="w-full bg-transparent text-sm text-gray-200 placeholder-gray-600 resize-none
                   outline-none focus:ring-0 leading-relaxed"
      />
      <p className="text-xs text-gray-600 mt-1">
        Consumed on next Monday&apos;s AI generation, then cleared.
      </p>
    </div>
  )
}
