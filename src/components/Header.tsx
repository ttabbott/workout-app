'use client'

interface HeaderProps {
  email: string
}

export default function Header({ email }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur border-b border-gray-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xl">🏋️</span>
        <span className="font-bold text-white text-lg">WorkoutTracker</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-gray-400 text-xs hidden sm:block truncate max-w-[140px]">{email}</span>
        <form action="/auth/signout" method="POST">
          <button
            type="submit"
            className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
          >
            Sign Out
          </button>
        </form>
      </div>
    </header>
  )
}
