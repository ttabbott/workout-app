'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function GeneratePlanButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/generate-plan', { method: 'POST' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? `HTTP ${res.status}`)
      }
      // Refresh the page so the server component re-fetches the new plan
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl bg-indigo-950/60 border border-indigo-800/50 p-4 mb-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl">🤖</span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-indigo-200 mb-0.5">No AI plan for this week</p>
          <p className="text-xs text-indigo-400 mb-3">
            Generate a personalised plan based on last week&apos;s performance and progressive overload.
          </p>
          {error && (
            <p className="text-xs text-red-400 mb-2">Error: {error}</p>
          )}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50
                       text-white text-sm font-semibold transition-colors"
          >
            {loading ? 'Generating…' : 'Generate This Week\'s Plan'}
          </button>
        </div>
      </div>
    </div>
  )
}
