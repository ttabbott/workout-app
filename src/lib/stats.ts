export interface DailyLog {
  log_date: string       // 'YYYY-MM-DD'
  day_type: 'gym' | 'yoga'
  gym_completed: boolean
  yoga_completed: boolean
}

/** Days of week that are gym days (Mon=1, Tue=2, Thu=4, Fri=5) */
const GYM_DAYS = new Set([1, 2, 4, 5])

/**
 * Yoga streak = consecutive days going backwards from today where yoga was done.
 * If today's yoga isn't done yet we start checking from yesterday.
 */
export function calcYogaStreak(logs: DailyLog[]): number {
  const doneSet = new Set(
    logs.filter((l) => l.yoga_completed).map((l) => l.log_date)
  )
  if (doneSet.size === 0) return 0

  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)

  let streak = 0

  for (let i = 0; i < 365; i++) {
    const dateStr = cursor.toISOString().slice(0, 10)

    if (doneSet.has(dateStr)) {
      streak++
    } else {
      // If today isn't done yet, skip to yesterday before breaking
      if (i === 0) {
        cursor.setDate(cursor.getDate() - 1)
        continue
      }
      break
    }

    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

/**
 * Weekly completion = completed days / expected days so far this week (Mon–today).
 * A gym day counts as complete when gym_completed=true.
 * A rest day counts as complete when yoga_completed=true.
 */
export function calcWeeklyCompletion(logs: DailyLog[]): {
  percent: number
  completedDays: number
  totalDays: number
} {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Start of this week (Monday)
  const dow = today.getDay()
  const mondayOffset = dow === 0 ? -6 : 1 - dow
  const monday = new Date(today)
  monday.setDate(today.getDate() + mondayOffset)

  const logMap = new Map(logs.map((l) => [l.log_date, l]))

  let completedDays = 0
  let totalDays = 0

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    if (d > today) break // don't count future days

    totalDays++
    const dateStr = d.toISOString().slice(0, 10)
    const log = logMap.get(dateStr)

    if (GYM_DAYS.has(d.getDay())) {
      if (log?.gym_completed) completedDays++
    } else {
      if (log?.yoga_completed) completedDays++
    }
  }

  return {
    percent: totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0,
    completedDays,
    totalDays,
  }
}
