export type ExerciseType = 'strength' | 'cardio'
export type WorkoutKey = 'A' | 'B' | 'C' | 'D'
export type DayType = 'gym' | 'yoga' | 'filler'

/** Per-set prescription for progressive/pyramid loading */
export interface SetDetail {
  weight?: number
  reps: string              // e.g. "10", "8", "6–8"
  unit?: 'lbs' | 'kg' | 'bodyweight'
  note?: string             // e.g. "warm-up", "working", "top set"
}

export interface Exercise {
  id: string
  name: string
  type: ExerciseType
  // Per-set prescriptions (used when sets differ in weight/reps)
  setDetails?: SetDetail[]
  // Fallback for uniform sets or cardio
  sets?: number
  reps?: string
  weight?: number
  unit?: 'lbs' | 'kg' | 'bodyweight'
  // Cardio
  duration?: number
  intensity?: string
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
  cardioCompleted?: boolean
}

export interface DayWorkout {
  key?: WorkoutKey          // A/B/C/D for gym workouts
  label: string
  type: DayType
  exercises: Exercise[]
}
