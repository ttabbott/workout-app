import { DayWorkout, WorkoutKey } from './types'

// ─── Workout A — Push (Chest / Shoulders / Triceps) ──────────────────────────

const WORKOUT_A: DayWorkout = {
  key: 'A',
  label: 'Push — Chest, Shoulders & Triceps',
  type: 'gym',
  exercises: [
    {
      id: 'a-bench-press',
      name: 'Barbell Bench Press',
      type: 'strength',
      restSeconds: 180,
      setDetails: [
        { weight: 95,  reps: '10', note: 'warm-up' },
        { weight: 115, reps: '8',  note: 'working' },
        { weight: 135, reps: '6',  note: 'working' },
        { weight: 145, reps: '4',  note: 'top set' },
      ],
    },
    {
      id: 'a-incline-db',
      name: 'Incline Dumbbell Press',
      type: 'strength',
      restSeconds: 120,
      setDetails: [
        { weight: 40, reps: '12' },
        { weight: 50, reps: '10' },
        { weight: 55, reps: '8'  },
        { weight: 55, reps: '8'  },
      ],
    },
    {
      id: 'a-cable-fly',
      name: 'Cable Chest Fly',
      type: 'strength',
      restSeconds: 60,
      setDetails: [
        { weight: 20, reps: '15' },
        { weight: 25, reps: '12' },
        { weight: 25, reps: '12' },
      ],
      youtubeUrl: 'https://www.youtube.com/results?search_query=cable+chest+fly+form',
    },
    {
      id: 'a-ohp',
      name: 'Overhead Press (Barbell)',
      type: 'strength',
      restSeconds: 180,
      setDetails: [
        { weight: 65, reps: '10', note: 'warm-up' },
        { weight: 75, reps: '8'  },
        { weight: 85, reps: '6'  },
        { weight: 85, reps: '6'  },
      ],
    },
    {
      id: 'a-lateral-raise',
      name: 'Lateral Raises',
      type: 'strength',
      restSeconds: 60,
      setDetails: [
        { weight: 12, reps: '15' },
        { weight: 15, reps: '12' },
        { weight: 15, reps: '12' },
      ],
    },
    {
      id: 'a-tricep-pushdown',
      name: 'Tricep Cable Pushdown',
      type: 'strength',
      restSeconds: 60,
      setDetails: [
        { weight: 35, reps: '12' },
        { weight: 40, reps: '10' },
        { weight: 40, reps: '10' },
      ],
      youtubeUrl: 'https://www.youtube.com/results?search_query=tricep+cable+pushdown+form',
    },
    {
      id: 'a-cardio',
      name: 'Treadmill Incline Walk',
      type: 'cardio',
      duration: 20,
      intensity: 'Moderate (incline 10, speed 3.5)',
    },
  ],
}

// ─── Workout B — Pull (Back / Biceps) ────────────────────────────────────────

const WORKOUT_B: DayWorkout = {
  key: 'B',
  label: 'Pull — Back & Biceps',
  type: 'gym',
  exercises: [
    {
      id: 'b-rdl',
      name: 'Romanian Deadlift',
      type: 'strength',
      restSeconds: 180,
      setDetails: [
        { weight: 135, reps: '10', note: 'warm-up' },
        { weight: 165, reps: '8'  },
        { weight: 185, reps: '6'  },
        { weight: 205, reps: '4',  note: 'top set' },
      ],
    },
    {
      id: 'b-pullup',
      name: 'Pull-Ups',
      type: 'strength',
      restSeconds: 120,
      setDetails: [
        { unit: 'bodyweight', reps: '8' },
        { unit: 'bodyweight', reps: '8' },
        { unit: 'bodyweight', reps: '8' },
      ],
      notes: 'Add weight if 8 reps feel easy',
    },
    {
      id: 'b-seated-row',
      name: 'Seated Cable Row',
      type: 'strength',
      restSeconds: 90,
      setDetails: [
        { weight: 100, reps: '12' },
        { weight: 120, reps: '10' },
        { weight: 130, reps: '8'  },
      ],
    },
    {
      id: 'b-lat-pulldown',
      name: 'Lat Pulldown',
      type: 'strength',
      restSeconds: 90,
      setDetails: [
        { weight: 90,  reps: '12' },
        { weight: 110, reps: '10' },
        { weight: 120, reps: '8'  },
      ],
    },
    {
      id: 'b-bb-curl',
      name: 'Barbell Bicep Curl',
      type: 'strength',
      restSeconds: 60,
      setDetails: [
        { weight: 55, reps: '10' },
        { weight: 65, reps: '8'  },
        { weight: 75, reps: '6'  },
      ],
    },
    {
      id: 'b-hammer-curl',
      name: 'Hammer Curl',
      type: 'strength',
      restSeconds: 60,
      setDetails: [
        { weight: 25, reps: '12' },
        { weight: 30, reps: '12' },
        { weight: 30, reps: '10' },
      ],
    },
  ],
}

// ─── Workout C — Legs ─────────────────────────────────────────────────────────

const WORKOUT_C: DayWorkout = {
  key: 'C',
  label: 'Legs — Quads, Hamstrings & Glutes',
  type: 'gym',
  exercises: [
    {
      id: 'c-squat',
      name: 'Barbell Back Squat',
      type: 'strength',
      restSeconds: 180,
      setDetails: [
        { weight: 135, reps: '10', note: 'warm-up' },
        { weight: 165, reps: '8'  },
        { weight: 185, reps: '6'  },
        { weight: 205, reps: '4',  note: 'top set' },
      ],
    },
    {
      id: 'c-leg-press',
      name: 'Leg Press',
      type: 'strength',
      restSeconds: 120,
      setDetails: [
        { weight: 225, reps: '12' },
        { weight: 270, reps: '10' },
        { weight: 315, reps: '8'  },
      ],
    },
    {
      id: 'c-lunge',
      name: 'Walking Lunges',
      type: 'strength',
      restSeconds: 90,
      setDetails: [
        { weight: 35, reps: '12 each' },
        { weight: 40, reps: '12 each' },
        { weight: 45, reps: '10 each' },
      ],
      youtubeUrl: 'https://www.youtube.com/results?search_query=walking+lunges+dumbbell+form',
    },
    {
      id: 'c-leg-curl',
      name: 'Lying Leg Curl',
      type: 'strength',
      restSeconds: 90,
      setDetails: [
        { weight: 65, reps: '12' },
        { weight: 80, reps: '10' },
        { weight: 90, reps: '8'  },
      ],
    },
    {
      id: 'c-calf-raise',
      name: 'Standing Calf Raise',
      type: 'strength',
      restSeconds: 60,
      setDetails: [
        { weight: 135, reps: '20' },
        { weight: 180, reps: '15' },
        { weight: 205, reps: '12' },
        { weight: 205, reps: '12' },
      ],
    },
    {
      id: 'c-cardio',
      name: 'Stationary Bike HIIT',
      type: 'cardio',
      duration: 15,
      intensity: 'High (30s sprint / 90s easy × 6 rounds)',
      youtubeUrl: 'https://www.youtube.com/results?search_query=stationary+bike+HIIT+workout',
    },
  ],
}

// ─── Workout D — Shoulders / Core ────────────────────────────────────────────

const WORKOUT_D: DayWorkout = {
  key: 'D',
  label: 'Shoulders & Core',
  type: 'gym',
  exercises: [
    {
      id: 'd-db-shoulder-press',
      name: 'Dumbbell Shoulder Press',
      type: 'strength',
      restSeconds: 120,
      setDetails: [
        { weight: 35, reps: '12', note: 'warm-up' },
        { weight: 45, reps: '10' },
        { weight: 50, reps: '8'  },
        { weight: 55, reps: '6',  note: 'top set' },
      ],
    },
    {
      id: 'd-arnold-press',
      name: 'Arnold Press',
      type: 'strength',
      restSeconds: 90,
      setDetails: [
        { weight: 30, reps: '12' },
        { weight: 35, reps: '10' },
        { weight: 40, reps: '8'  },
      ],
      youtubeUrl: 'https://www.youtube.com/results?search_query=arnold+press+form+tutorial',
    },
    {
      id: 'd-face-pull',
      name: 'Face Pull',
      type: 'strength',
      restSeconds: 60,
      setDetails: [
        { weight: 25, reps: '15' },
        { weight: 30, reps: '15' },
        { weight: 35, reps: '12' },
      ],
      youtubeUrl: 'https://www.youtube.com/results?search_query=face+pull+cable+form',
    },
    {
      id: 'd-front-raise',
      name: 'Dumbbell Front Raise',
      type: 'strength',
      restSeconds: 60,
      setDetails: [
        { weight: 15, reps: '12' },
        { weight: 20, reps: '12' },
        { weight: 20, reps: '10' },
      ],
    },
    {
      id: 'd-plank',
      name: 'Plank',
      type: 'strength',
      restSeconds: 60,
      setDetails: [
        { unit: 'bodyweight', reps: '45s' },
        { unit: 'bodyweight', reps: '60s' },
        { unit: 'bodyweight', reps: '60s' },
      ],
    },
    {
      id: 'd-cable-crunch',
      name: 'Cable Crunch',
      type: 'strength',
      restSeconds: 60,
      setDetails: [
        { weight: 40, reps: '15' },
        { weight: 50, reps: '15' },
        { weight: 55, reps: '12' },
      ],
      youtubeUrl: 'https://www.youtube.com/results?search_query=cable+crunch+form',
    },
    {
      id: 'd-russian-twist',
      name: 'Russian Twist',
      type: 'strength',
      restSeconds: 45,
      setDetails: [
        { weight: 20, reps: '20 total' },
        { weight: 25, reps: '20 total' },
        { weight: 25, reps: '16 total' },
      ],
      youtubeUrl: 'https://www.youtube.com/results?search_query=weighted+russian+twist+form',
    },
  ],
}

// ─── Filler Cardio — shown when all 4 workouts done for the week ──────────────

export const FILLER_CARDIO: DayWorkout = {
  label: 'Bonus Cardio & Recovery',
  type: 'filler',
  exercises: [
    {
      id: 'filler-treadmill',
      name: 'Treadmill Zone 2',
      type: 'cardio',
      duration: 30,
      intensity: 'Low–moderate (incline 8, speed 3.2–3.5) — keep HR 120–140',
    },
    {
      id: 'filler-stairmaster',
      name: 'Stairmaster',
      type: 'cardio',
      duration: 15,
      intensity: 'Moderate (level 6–8)',
    },
    {
      id: 'filler-stretch',
      name: 'Full-Body Stretch / Cool Down',
      type: 'cardio',
      duration: 10,
      intensity: 'Easy — focus on hips, quads, hamstrings, shoulders',
    },
  ],
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export const WORKOUTS: Record<WorkoutKey, DayWorkout> = {
  A: WORKOUT_A,
  B: WORKOUT_B,
  C: WORKOUT_C,
  D: WORKOUT_D,
}

export const WORKOUT_ORDER: WorkoutKey[] = ['A', 'B', 'C', 'D']
