import { DayWorkout, WorkoutKey } from './types'

// ─────────────────────────────────────────────────────────────────────────────
// WORKOUT MODE — flip to 'full' when ready to return to standard lengths
// ─────────────────────────────────────────────────────────────────────────────
export const WORKOUT_MODE: 'short' | 'full' = 'short'

// ─── Workout A — Push · SHORT (~30 min + 5 min warm-up) ──────────────────────
// Bench Press → Incline DB → Lateral Raise → Tricep Pushdown → Row finisher

const WORKOUT_A_SHORT: DayWorkout = {
  key: 'A',
  label: 'Push — Chest, Shoulders & Triceps',
  type: 'gym',
  exercises: [
    {
      id: 'a-bench-press',
      name: 'Barbell Bench Press',
      type: 'strength',
      restSeconds: 90,
      notes: '⏱ Start with 5 min warm-up (light bike, treadmill, or dynamic stretch)',
      setDetails: [
        { weight: 115, reps: '8',  note: 'working' },
        { weight: 135, reps: '6',  note: 'working' },
        { weight: 145, reps: '4',  note: 'top set' },
      ],
    },
    {
      id: 'a-incline-db',
      name: 'Incline Dumbbell Press',
      type: 'strength',
      restSeconds: 75,
      setDetails: [
        { weight: 45, reps: '10' },
        { weight: 50, reps: '8'  },
        { weight: 55, reps: '8'  },
      ],
    },
    {
      id: 'a-lateral-raise',
      name: 'Lateral Raises',
      type: 'strength',
      restSeconds: 45,
      setDetails: [
        { weight: 15, reps: '12' },
        { weight: 15, reps: '12' },
      ],
    },
    {
      id: 'a-tricep-pushdown',
      name: 'Tricep Cable Pushdown',
      type: 'strength',
      restSeconds: 45,
      setDetails: [
        { weight: 40, reps: '10' },
        { weight: 40, reps: '10' },
      ],
      youtubeUrl: 'https://www.youtube.com/results?search_query=tricep+cable+pushdown+form',
    },
    {
      id: 'a-cardio',
      name: 'Rowing Machine',
      type: 'cardio',
      duration: 8,
      intensity: 'Moderate steady pace — focus on full stroke, keep damper at 4–5',
    },
  ],
}

// ─── Workout A — Push · FULL (~60 min) ───────────────────────────────────────

const WORKOUT_A_FULL: DayWorkout = {
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

// ─── Workout B — Pull · SHORT (~30 min + 5 min warm-up) ─────────────────────
// RDL → Pull-Ups → Cable Row → Hammer Curl → Bike finisher

const WORKOUT_B_SHORT: DayWorkout = {
  key: 'B',
  label: 'Pull — Back & Biceps',
  type: 'gym',
  exercises: [
    {
      id: 'b-rdl',
      name: 'Romanian Deadlift',
      type: 'strength',
      restSeconds: 90,
      notes: '⏱ Start with 5 min warm-up (light bike, treadmill, or dynamic stretch)',
      setDetails: [
        { weight: 165, reps: '8'  },
        { weight: 185, reps: '6'  },
        { weight: 205, reps: '4', note: 'top set' },
      ],
    },
    {
      id: 'b-pullup',
      name: 'Pull-Ups',
      type: 'strength',
      restSeconds: 75,
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
      restSeconds: 60,
      setDetails: [
        { weight: 110, reps: '10' },
        { weight: 120, reps: '10' },
        { weight: 130, reps: '8'  },
      ],
    },
    {
      id: 'b-hammer-curl',
      name: 'Hammer Curl',
      type: 'strength',
      restSeconds: 45,
      setDetails: [
        { weight: 30, reps: '12' },
        { weight: 30, reps: '10' },
      ],
    },
    {
      id: 'b-cardio',
      name: 'Stationary Bike HIIT',
      type: 'cardio',
      duration: 8,
      intensity: '4 rounds: 30s all-out sprint / 90s easy pedal',
    },
  ],
}

// ─── Workout B — Pull · FULL (~60 min) ───────────────────────────────────────

const WORKOUT_B_FULL: DayWorkout = {
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

// ─── Workout C — Legs · SHORT (~30 min + 5 min warm-up) ─────────────────────
// Squat → Leg Press → Leg Curl → Stairmaster finisher

const WORKOUT_C_SHORT: DayWorkout = {
  key: 'C',
  label: 'Legs — Quads, Hamstrings & Glutes',
  type: 'gym',
  exercises: [
    {
      id: 'c-squat',
      name: 'Barbell Back Squat',
      type: 'strength',
      restSeconds: 90,
      notes: '⏱ Start with 5 min warm-up (light bike, treadmill, or dynamic stretch)',
      setDetails: [
        { weight: 165, reps: '8'  },
        { weight: 185, reps: '6'  },
        { weight: 205, reps: '4', note: 'top set' },
      ],
    },
    {
      id: 'c-leg-press',
      name: 'Leg Press',
      type: 'strength',
      restSeconds: 90,
      setDetails: [
        { weight: 245, reps: '12' },
        { weight: 270, reps: '10' },
        { weight: 315, reps: '8'  },
      ],
    },
    {
      id: 'c-leg-curl',
      name: 'Lying Leg Curl',
      type: 'strength',
      restSeconds: 60,
      setDetails: [
        { weight: 80, reps: '10' },
        { weight: 90, reps: '8'  },
      ],
    },
    {
      id: 'c-cardio',
      name: 'Stairmaster',
      type: 'cardio',
      duration: 8,
      intensity: 'Moderate (level 7–8) — steady grind to finish the legs session',
    },
  ],
}

// ─── Workout C — Legs · FULL (~60 min) ───────────────────────────────────────

const WORKOUT_C_FULL: DayWorkout = {
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

// ─── Workout D — Shoulders / Core · SHORT (~28 min + 5 min warm-up) ─────────
// Shoulder Press → Face Pull → Plank → Treadmill finisher

const WORKOUT_D_SHORT: DayWorkout = {
  key: 'D',
  label: 'Shoulders & Core',
  type: 'gym',
  exercises: [
    {
      id: 'd-db-shoulder-press',
      name: 'Dumbbell Shoulder Press',
      type: 'strength',
      restSeconds: 90,
      notes: '⏱ Start with 5 min warm-up (light bike, treadmill, or dynamic stretch)',
      setDetails: [
        { weight: 40, reps: '10' },
        { weight: 45, reps: '8'  },
        { weight: 50, reps: '8'  },
      ],
    },
    {
      id: 'd-face-pull',
      name: 'Face Pull',
      type: 'strength',
      restSeconds: 45,
      setDetails: [
        { weight: 25, reps: '15' },
        { weight: 30, reps: '15' },
        { weight: 35, reps: '12' },
      ],
      youtubeUrl: 'https://www.youtube.com/results?search_query=face+pull+cable+form',
    },
    {
      id: 'd-plank',
      name: 'Plank',
      type: 'strength',
      restSeconds: 45,
      setDetails: [
        { unit: 'bodyweight', reps: '60s' },
        { unit: 'bodyweight', reps: '60s' },
      ],
    },
    {
      id: 'd-cardio',
      name: 'Treadmill Incline Walk',
      type: 'cardio',
      duration: 7,
      intensity: 'Moderate (incline 10, speed 3.5)',
    },
  ],
}

// ─── Workout D — Shoulders / Core · FULL (~55 min) ───────────────────────────

const WORKOUT_D_FULL: DayWorkout = {
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

const SHORT_WORKOUTS: Record<WorkoutKey, DayWorkout> = {
  A: WORKOUT_A_SHORT,
  B: WORKOUT_B_SHORT,
  C: WORKOUT_C_SHORT,
  D: WORKOUT_D_SHORT,
}

const FULL_WORKOUTS: Record<WorkoutKey, DayWorkout> = {
  A: WORKOUT_A_FULL,
  B: WORKOUT_B_FULL,
  C: WORKOUT_C_FULL,
  D: WORKOUT_D_FULL,
}

export const WORKOUTS: Record<WorkoutKey, DayWorkout> =
  WORKOUT_MODE === 'short' ? SHORT_WORKOUTS : FULL_WORKOUTS

export const WORKOUT_ORDER: WorkoutKey[] = ['A', 'B', 'C', 'D']

// ─── Exercise substitutions ───────────────────────────────────────────────────
// Shown in the "Can't do this" sheet. Keyed by exercise ID.
// If an AI-generated exercise ID isn't in this map, fallback is skip + note.

export interface Substitution {
  id: string
  name: string
  note?: string
}

export const SUBSTITUTIONS: Record<string, Substitution[]> = {
  // ── Workout A (Push) ──────────────────────────────────────────────────────
  'a-bench-press': [
    { id: 'a-chest-press-machine', name: 'Chest Press Machine' },
    { id: 'a-db-bench-press',      name: 'Dumbbell Bench Press' },
    { id: 'a-smith-bench',         name: 'Smith Machine Bench Press' },
  ],
  'a-incline-db': [
    { id: 'a-incline-barbell',     name: 'Incline Barbell Press' },
    { id: 'a-incline-machine',     name: 'Incline Chest Press Machine' },
  ],
  'a-cable-fly': [
    { id: 'a-pec-deck',            name: 'Pec Deck / Chest Fly Machine' },
    { id: 'a-db-fly',              name: 'Dumbbell Chest Fly (flat)' },
  ],
  'a-ohp': [
    { id: 'a-seated-db-press',     name: 'Seated Dumbbell Shoulder Press' },
    { id: 'a-smith-ohp',           name: 'Smith Machine OHP' },
    { id: 'a-machine-shoulder',    name: 'Shoulder Press Machine' },
  ],
  'a-lateral-raise': [
    { id: 'a-cable-lateral',       name: 'Cable Lateral Raise' },
    { id: 'a-machine-lateral',     name: 'Lateral Raise Machine' },
  ],
  'a-tricep-pushdown': [
    { id: 'a-tricep-overhead',     name: 'Overhead Tricep Extension (cable)' },
    { id: 'a-skull-crusher',       name: 'EZ-Bar Skull Crusher', note: 'Use EZ-bar' },
    { id: 'a-dips',                name: 'Tricep Dips (bodyweight)' },
  ],
  // ── Workout B (Pull) ──────────────────────────────────────────────────────
  'b-rdl': [
    { id: 'b-db-rdl',              name: 'Dumbbell RDL' },
    { id: 'b-straight-leg-dl',     name: 'Straight-Leg Deadlift (lighter)' },
    { id: 'b-good-morning',        name: 'Good Mornings (barbell)', note: 'Light weight' },
  ],
  'b-pullup': [
    { id: 'b-lat-pulldown-wide',   name: 'Wide-Grip Lat Pulldown' },
    { id: 'b-assisted-pullup',     name: 'Assisted Pull-Up Machine' },
  ],
  'b-seated-row': [
    { id: 'b-chest-supported-row', name: 'Chest-Supported DB Row' },
    { id: 'b-t-bar-row',           name: 'T-Bar Row' },
    { id: 'b-machine-row',         name: 'Machine Row' },
  ],
  'b-lat-pulldown': [
    { id: 'b-straight-arm-pull',   name: 'Straight-Arm Pulldown (cable)' },
    { id: 'b-single-arm-row',      name: 'Single-Arm DB Row' },
  ],
  'b-bb-curl': [
    { id: 'b-ez-bar-curl',         name: 'EZ-Bar Curl' },
    { id: 'b-cable-curl',          name: 'Cable Curl' },
    { id: 'b-db-curl',             name: 'Dumbbell Curl' },
  ],
  'b-hammer-curl': [
    { id: 'b-rope-curl',           name: 'Rope Hammer Curl (cable)' },
    { id: 'b-incline-db-curl',     name: 'Incline Dumbbell Curl' },
  ],
  // ── Workout C (Legs) ──────────────────────────────────────────────────────
  'c-squat': [
    { id: 'c-goblet-squat',        name: 'Goblet Squat', note: 'Lighter load' },
    { id: 'c-hack-squat',          name: 'Hack Squat Machine' },
    { id: 'c-leg-press-sub',       name: 'Leg Press (higher volume)' },
  ],
  'c-leg-press': [
    { id: 'c-belt-squat',          name: 'Belt Squat' },
    { id: 'c-db-squat',            name: 'Dumbbell Squat' },
  ],
  'c-lunge': [
    { id: 'c-reverse-lunge',       name: 'Reverse Lunge' },
    { id: 'c-split-squat',         name: 'Bulgarian Split Squat' },
    { id: 'c-step-up',             name: 'Step-Up (box + dumbbells)' },
  ],
  'c-leg-curl': [
    { id: 'c-seated-leg-curl',     name: 'Seated Leg Curl Machine' },
    { id: 'c-nordic-curl',         name: 'Nordic Curl (bodyweight)', note: 'Hard — reduce range' },
    { id: 'c-db-leg-curl',         name: 'Dumbbell Leg Curl' },
  ],
  'c-calf-raise': [
    { id: 'c-seated-calf-raise',   name: 'Seated Calf Raise Machine' },
    { id: 'c-leg-press-calf',      name: 'Calf Raise on Leg Press' },
  ],
  // ── Workout D (Shoulders / Core) ─────────────────────────────────────────
  'd-db-shoulder-press': [
    { id: 'd-barbell-ohp',         name: 'Barbell OHP' },
    { id: 'd-machine-shoulder',    name: 'Shoulder Press Machine' },
    { id: 'd-smith-shoulder',      name: 'Smith Machine Shoulder Press' },
  ],
  'd-arnold-press': [
    { id: 'd-seated-db-press-sub', name: 'Seated Dumbbell Press' },
    { id: 'd-cable-shoulder-press',name: 'Single-Arm Cable Press' },
  ],
  'd-face-pull': [
    { id: 'd-band-pull-apart',     name: 'Band Pull-Apart', note: 'Use resistance band' },
    { id: 'd-rear-delt-fly',       name: 'Rear Delt Fly Machine' },
  ],
  'd-front-raise': [
    { id: 'd-cable-front-raise',   name: 'Cable Front Raise' },
    { id: 'd-plate-raise',         name: 'Plate Front Raise' },
  ],
  'd-plank': [
    { id: 'd-dead-bug',            name: 'Dead Bug', note: '3 × 10 reps' },
    { id: 'd-ab-wheel',            name: 'Ab Wheel Rollout' },
  ],
  'd-cable-crunch': [
    { id: 'd-decline-crunch',      name: 'Decline Crunch' },
    { id: 'd-hanging-leg-raise',   name: 'Hanging Leg Raise' },
  ],
  'd-russian-twist': [
    { id: 'd-landmine-rotation',   name: 'Landmine Rotation' },
    { id: 'd-woodchop',            name: 'Cable Woodchop' },
    { id: 'd-bicycle-crunch',      name: 'Bicycle Crunch (bodyweight)' },
  ],
}
