interface StatsBarProps {
  yogaStreak: number
  weeklyCompletionPercent: number
  completedDays: number
  totalDays: number
}

export default function StatsBar({
  yogaStreak,
  weeklyCompletionPercent,
  completedDays,
  totalDays,
}: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-5">
      {/* Yoga streak */}
      <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
        <div className="text-2xl mb-1">🧘</div>
        <div className="text-2xl font-bold text-white">{yogaStreak}</div>
        <div className="text-xs text-gray-400 mt-0.5">day yoga streak</div>
      </div>

      {/* Weekly completion */}
      <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
        <div className="text-2xl mb-1">📅</div>
        <div className="text-2xl font-bold text-white">{weeklyCompletionPercent}%</div>
        <div className="text-xs text-gray-400 mt-0.5">
          this week ({completedDays}/{totalDays} days)
        </div>
        {/* Progress bar */}
        <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: `${weeklyCompletionPercent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
