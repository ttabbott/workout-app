import { DayWorkout } from './types'

// Sample week plan — day 0=Sunday through 6=Saturday
// Gym days: Monday(1), Tuesday(2), Thursday(4), Friday(5)
// Yoga/rest: Sunday(0), Wednesday(3), Saturday(6)

export const SAMPLE_WEEK: DayWorkout[] = [
  // Sunday — yoga
  {
    dayOfWeek: 0,
    label: 'Rest & Yoga',
    type: 'yoga',
    exercises: [],
  },

  // Monday — Push (Chest / Shoulders / Triceps) + Cardio
  {
    dayOfWeek: 1,
    label: 'Push Day — Chest, Shoulders & Triceps',
    type: 'gym',
    exercises: [
      {
        id: 'ex-barbell-bench',
        name: 'Barbell Bench Press',
        type: 'strength',
        sets: 4,
        reps: '8',
        weight: 135,
        unit: 'lbs',
      },
      {
        id: 'ex-incline-db',
        name: 'Incline Dumbbell Press',
        type: 'strength',
        sets: 3,
        reps: '10',
        weight: 50,
        unit: 'lbs',
      },
      {
        id: 'ex-cable-fly',
        name: 'Cable Chest Fly',
        type: 'strength',
        sets: 3,
        reps: '12-15',
        weight: 25,
        unit: 'lbs',
        youtubeUrl: 'https://www.youtube.com/results?search_query=cable+chest+fly+form',
      },
      {
        id: 'ex-ohp',
        name: 'Overhead Press (Barbell)',
        type: 'strength',
        sets: 3,
        reps: '8',
        weight: 85,
        unit: 'lbs',
      },
      {
        id: 'ex-lateral-raise',
        name: 'Lateral Raises',
        type: 'strength',
        sets: 3,
        reps: '15',
        weight: 15,
        unit: 'lbs',
      },
      {
        id: 'ex-tricep-pushdown',
        name: 'Tricep Cable Pushdown',
        type: 'strength',
        sets: 3,
        reps: '12',
        weight: 40,
        unit: 'lbs',
        youtubeUrl: 'https://www.youtube.com/results?search_query=tricep+cable+pushdown+form',
      },
      {
        id: 'ex-treadmill-mon',
        name: 'Treadmill Incline Walk',
        type: 'cardio',
        duration: 20,
        intensity: 'Moderate (incline 10, speed 3.5)',
      },
    ],
  },

  // Tuesday — Pull (Back / Biceps)
  {
    dayOfWeek: 2,
    label: 'Pull Day — Back & Biceps',
    type: 'gym',
    exercises: [
      {
        id: 'ex-deadlift',
        name: 'Romanian Deadlift',
        type: 'strength',
        sets: 4,
        reps: '8',
        weight: 185,
        unit: 'lbs',
      },
      {
        id: 'ex-pullup',
        name: 'Pull-Ups',
        type: 'strength',
        sets: 3,
        reps: '8-10',
        unit: 'bodyweight',
        notes: 'Add weight if 10 reps feel easy',
      },
      {
        id: 'ex-seated-row',
        name: 'Seated Cable Row',
        type: 'strength',
        sets: 3,
        reps: '10',
        weight: 120,
        unit: 'lbs',
      },
      {
        id: 'ex-lat-pulldown',
        name: 'Lat Pulldown',
        type: 'strength',
        sets: 3,
        reps: '12',
        weight: 110,
        unit: 'lbs',
      },
      {
        id: 'ex-barbell-curl',
        name: 'Barbell Bicep Curl',
        type: 'strength',
        sets: 3,
        reps: '10',
        weight: 65,
        unit: 'lbs',
      },
      {
        id: 'ex-hammer-curl',
        name: 'Hammer Curl',
        type: 'strength',
        sets: 3,
        reps: '12',
        weight: 30,
        unit: 'lbs',
      },
    ],
  },

  // Wednesday — yoga/rest
  {
    dayOfWeek: 3,
    label: 'Rest & Yoga',
    type: 'yoga',
    exercises: [],
  },

  // Thursday — Legs + Cardio
  {
    dayOfWeek: 4,
    label: 'Leg Day — Quads, Hamstrings & Glutes',
    type: 'gym',
    exercises: [
      {
        id: 'ex-squat',
        name: 'Barbell Back Squat',
        type: 'strength',
        sets: 4,
        reps: '8',
        weight: 185,
        unit: 'lbs',
      },
      {
        id: 'ex-leg-press',
        name: 'Leg Press',
        type: 'strength',
        sets: 3,
        reps: '10-12',
        weight: 270,
        unit: 'lbs',
      },
      {
        id: 'ex-lunge',
        name: 'Walking Lunges',
        type: 'strength',
        sets: 3,
        reps: '12 each leg',
        weight: 40,
        unit: 'lbs',
        youtubeUrl: 'https://www.youtube.com/results?search_query=walking+lunges+dumbbell+form',
      },
      {
        id: 'ex-leg-curl',
        name: 'Lying Leg Curl',
        type: 'strength',
        sets: 3,
        reps: '12',
        weight: 80,
        unit: 'lbs',
      },
      {
        id: 'ex-calf-raise',
        name: 'Standing Calf Raise',
        type: 'strength',
        sets: 4,
        reps: '15',
        weight: 180,
        unit: 'lbs',
      },
      {
        id: 'ex-bike-thu',
        name: 'Stationary Bike',
        type: 'cardio',
        duration: 15,
        intensity: 'High (interval: 30s sprint / 90s easy)',
        youtubeUrl: 'https://www.youtube.com/results?search_query=stationary+bike+HIIT+workout',
      },
    ],
  },

  // Friday — Shoulders + Core
  {
    dayOfWeek: 5,
    label: 'Shoulders & Core',
    type: 'gym',
    exercises: [
      {
        id: 'ex-db-shoulder-press',
        name: 'Dumbbell Shoulder Press',
        type: 'strength',
        sets: 4,
        reps: '10',
        weight: 45,
        unit: 'lbs',
      },
      {
        id: 'ex-arnold-press',
        name: 'Arnold Press',
        type: 'strength',
        sets: 3,
        reps: '12',
        weight: 35,
        unit: 'lbs',
        youtubeUrl: 'https://www.youtube.com/results?search_query=arnold+press+form+tutorial',
      },
      {
        id: 'ex-face-pull',
        name: 'Face Pull',
        type: 'strength',
        sets: 3,
        reps: '15',
        weight: 30,
        unit: 'lbs',
        youtubeUrl: 'https://www.youtube.com/results?search_query=face+pull+cable+form',
      },
      {
        id: 'ex-front-raise',
        name: 'Dumbbell Front Raise',
        type: 'strength',
        sets: 3,
        reps: '12',
        weight: 20,
        unit: 'lbs',
      },
      {
        id: 'ex-plank',
        name: 'Plank',
        type: 'strength',
        sets: 3,
        reps: '45–60s hold',
        unit: 'bodyweight',
      },
      {
        id: 'ex-cable-crunch',
        name: 'Cable Crunch',
        type: 'strength',
        sets: 3,
        reps: '15',
        weight: 50,
        unit: 'lbs',
        youtubeUrl: 'https://www.youtube.com/results?search_query=cable+crunch+form',
      },
      {
        id: 'ex-russian-twist',
        name: 'Russian Twist',
        type: 'strength',
        sets: 3,
        reps: '20 total',
        weight: 25,
        unit: 'lbs',
        youtubeUrl: 'https://www.youtube.com/results?search_query=weighted+russian+twist+form',
      },
    ],
  },

  // Saturday — yoga/rest
  {
    dayOfWeek: 6,
    label: 'Rest & Yoga',
    type: 'yoga',
    exercises: [],
  },
]

export function getTodayWorkout(): DayWorkout {
  const dayOfWeek = new Date().getDay()
  return SAMPLE_WEEK.find((d) => d.dayOfWeek === dayOfWeek) ?? SAMPLE_WEEK[0]
}

export function getWeeklyStats() {
  // Hardcoded sample stats for Phase 1
  return {
    yogaStreak: 5,
    weeklyCompletionPercent: 60,
    completedDays: 3,
    totalDays: 5,
  }
}
