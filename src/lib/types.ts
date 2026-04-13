export type ExerciseType = 'strength' | 'cardio'

export interface Exercise {
  id: string
  name: string
  type: ExerciseType
  // Strength fields
  sets?: number
  reps?: string   // e.g. "8", "8-12", "12-15"
  weight?: number // lbs
  unit?: 'lbs' | 'kg' | 'bodyweight'
  // Cardio fields
  duration?: number  // minutes
  intensity?: string // e.g. "Moderate", "High"
  // Extra
  youtubeUrl?: string
  notes?: string
}

export interface SetLog {
  completed: boolean
  actualWeight: number | null
  actualReps: number | null
}

export interface ExerciseLog {
  exerciseId: string
  sets: SetLog[]
  // cardio
  actualDuration?: number
  actualIntensity?: string
  cardioCompleted?: boolean
}

export type DayType = 'gym' | 'yoga' | 'rest'

export interface DayWorkout {
  dayOfWeek: number // 0=Sun, 1=Mon, ... 6=Sat
  label: string
  type: DayType
  exercises: Exercise[]
}
