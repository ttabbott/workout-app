import { WorkoutKey } from './types'
import { WORKOUT_ORDER } from './workout-data'

export interface DailyLog {
  log_date: string
  day_type: 'gym' | 'yoga'
  gym_completed: boolean
  yoga_completed: boolean
  workout_key: WorkoutKey | null
}

/** Returns the first uncompleted workout key for this week (A→B→C→D), or 'filler' if all done. */
export function getSuggestedWorkout(weekLogs: DailyLog[]): WorkoutKey | 'filler' {
  const completedKeys = new Set(
    weekLogs
      .filter((l) => l.gym_completed && l.workout_key)
      .map((l) => l.workout_key as WorkoutKey)
  )
  for (const key of WORKOUT_ORDER) {
    if (!completedKeys.has(key)) return key
  }
  return 'filler'
}

/** Returns the set of workout keys completed this week. */
export function getCompletedWorkoutKeys(weekLogs: DailyLog[]): Set<WorkoutKey> {
  return new Set(
    weekLogs
      .filter((l) => l.gym_completed && l.workout_key)
      .map((l) => l.workout_key as WorkoutKey)
  )
}

/**
 * Yoga streak: consecutive days going backwards from today where yoga_completed=true.
 * Skips today if not yet done (starts checking from yesterday).
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
      if (i === 0) { cursor.setDate(cursor.getDate() - 1); continue }
      break
    }
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

/**
 * Weekly gym completion: completed workouts / total workouts expected so far
 * (out of 4 per week, counting only days up to today).
 */
export function calcWeeklyCompletion(weekLogs: DailyLog[]): {
  percent: number
  completedDays: number
  totalDays: number
} {
  const completed = weekLogs.filter((l) => l.gym_completed && l.workout_key).length
  // Total expected = 4 (A–D), but cap at how many calendar gym slots have passed this week
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dow = today.getDay()
  const mondayOffset = dow === 0 ? -6 : 1 - dow
  const monday = new Date(today)
  monday.setDate(today.getDate() + mondayOffset)

  // Gym day slots Mon/Tue/Thu/Fri = day-of-week 1,2,4,5
  const GYM_DAYS = new Set([1, 2, 4, 5])
  let slotsPassedThisWeek = 0
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    if (d > today) break
    if (GYM_DAYS.has(d.getDay())) slotsPassedThisWeek++
  }

  const total = Math.max(slotsPassedThisWeek, completed) // never show more done than total
  return {
    percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    completedDays: completed,
    totalDays: total,
  }
}

/** Returns logs scoped to the current Mon–Sun week. */
export function filterToThisWeek(logs: DailyLog[]): DailyLog[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dow = today.getDay()
  const mondayOffset = dow === 0 ? -6 : 1 - dow
  const monday = new Date(today)
  monday.setDate(today.getDate() + mondayOffset)
  const mondayStr = monday.toISOString().slice(0, 10)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const sundayStr = sunday.toISOString().slice(0, 10)

  return logs.filter((l) => l.log_date >= mondayStr && l.log_date <= sundayStr)
}
