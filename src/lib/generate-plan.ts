import Anthropic from '@anthropic-ai/sdk'
import { DayWorkout, Exercise, WorkoutKey } from './types'
import { WORKOUTS, WORKOUT_ORDER } from './workout-data'

const MODEL = 'claude-opus-4-5'

// ─── Performance types ────────────────────────────────────────────────────────

export interface SetPerf {
  setIndex: number
  note?: string
  targetWeight: number | null
  targetReps: string
  actualWeight: number | null
  actualReps: number | null
  completed: boolean
}

export interface ExercisePerf {
  exerciseId: string
  name: string
  sets: SetPerf[]
}

export interface WorkoutPerf {
  workoutKey: WorkoutKey
  label: string
  completed: boolean
  date?: string
  exercises: ExercisePerf[]
}

export type LastWeekPerf = WorkoutPerf[]

// ─── Utility ──────────────────────────────────────────────────────────────────

export function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const dow = d.getDay()
  d.setDate(d.getDate() + (dow === 0 ? -6 : 1 - dow))
  return d.toISOString().slice(0, 10)
}

export function getLastWeekStart(): string {
  const d = new Date()
  d.setDate(d.getDate() - 7)
  return getWeekStart(d)
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

function formatPerf(perf: LastWeekPerf): string {
  if (perf.length === 0) {
    return 'No previous data (first week). Use the baseline weights listed below as starting point.'
  }
  const lines: string[] = []
  for (const key of WORKOUT_ORDER) {
    const wp = perf.find((p) => p.workoutKey === key)
    if (!wp) { lines.push(`Workout ${key}: NOT COMPLETED`); continue }
    lines.push(`Workout ${key} (${wp.label}) — ${wp.completed ? `COMPLETED${wp.date ? ` on ${wp.date}` : ''}` : 'NOT COMPLETED'}`)
    for (const ep of wp.exercises) {
      if (!ep.sets.length) continue
      lines.push(`  ${ep.name}`)
      for (const s of ep.sets) {
        const target = s.targetWeight ? `${s.targetWeight}lbs×${s.targetReps}` : `BW×${s.targetReps}`
        if (!s.completed) { lines.push(`    Set ${s.setIndex + 1}${s.note ? ` (${s.note})` : ''}: ${target} — SKIPPED`); continue }
        const actual = s.actualWeight ? `${s.actualWeight}lbs×${s.actualReps}` : `BW×${s.actualReps}`
        const hit = (!s.targetWeight || s.actualWeight === s.targetWeight)
        lines.push(`    Set ${s.setIndex + 1}${s.note ? ` (${s.note})` : ''}: target ${target} → actual ${actual} ${hit ? '✓' : '✗ missed'}`)
      }
    }
  }
  return lines.join('\n')
}

function formatBaseline(): string {
  const lines: string[] = []
  for (const key of WORKOUT_ORDER) {
    const w = WORKOUTS[key]
    lines.push(`Workout ${key} — ${w.label}`)
    for (const ex of w.exercises) {
      if (ex.type === 'strength' && ex.setDetails) {
        const sets = ex.setDetails.map((s, i) => `S${i + 1}:${s.weight ?? 'BW'}×${s.reps}`).join('  ')
        lines.push(`  ${ex.name} (rest ${ex.restSeconds}s): ${sets}`)
      } else if (ex.type === 'cardio') {
        lines.push(`  ${ex.name}: ${ex.duration}min — ${ex.intensity}`)
      }
    }
  }
  return lines.join('\n')
}

function buildPrompt(perf: LastWeekPerf): string {
  return `You are an expert personal trainer. Generate a weekly 4-day gym workout plan in JSON.

USER PROFILE
Goals: hypertrophy, fat loss, cardiovascular fitness, strength, general health, flexibility
Equipment: full commercial gym
Level: intermediate
Split: Workout A = Push (Chest/Shoulders/Triceps), B = Pull (Back/Biceps), C = Legs, D = Shoulders & Core

BASELINE WEIGHTS (current plan)
${formatBaseline()}

LAST WEEK PERFORMANCE
${formatPerf(perf)}

PROGRESSIVE OVERLOAD RULES
- All working sets hit at target weight → increase compound lifts +5 lbs, isolation +2.5 lbs next week
- Any working set missed → keep same weight
- Workout not completed → keep same weight
- Warm-up set = ~65% of first working set weight (round to nearest 5)
- Bodyweight exercises: if all sets hit → increase reps by 1–2

CONSTRAINTS
- Keep the same exercise IDs for continuity (e.g. "a-bench-press")
- You may swap 1–2 accessory exercises per workout for variety; assign a new id if so
- Workouts A and C must include one cardio finisher exercise
- Each workout: 6–8 exercises total
- Add youtubeUrl for any non-standard exercises: https://www.youtube.com/results?search_query=EXERCISE+NAME+form
- Rest times: compounds 180s, machine/cable compounds 90–120s, isolation 60s, core 45–60s

OUTPUT FORMAT
Return ONLY valid JSON — no markdown, no explanation. Exact structure:
{
  "workouts": {
    "A": {
      "label": "Push — Chest, Shoulders & Triceps",
      "exercises": [
        {
          "id": "a-bench-press",
          "name": "Barbell Bench Press",
          "type": "strength",
          "restSeconds": 180,
          "setDetails": [
            { "weight": 95, "reps": "10", "note": "warm-up" },
            { "weight": 120, "reps": "8", "note": "working" },
            { "weight": 140, "reps": "6", "note": "working" },
            { "weight": 150, "reps": "4", "note": "top set" }
          ]
        },
        {
          "id": "a-cardio",
          "name": "Treadmill Incline Walk",
          "type": "cardio",
          "duration": 20,
          "intensity": "Moderate (incline 10, speed 3.5)"
        }
      ]
    },
    "B": { "label": "...", "exercises": [...] },
    "C": { "label": "...", "exercises": [...] },
    "D": { "label": "...", "exercises": [...] }
  }
}`
}

// ─── Validate parsed plan ─────────────────────────────────────────────────────

function isValidPlan(v: unknown): v is { workouts: Record<WorkoutKey, { label: string; exercises: Exercise[] }> } {
  if (!v || typeof v !== 'object') return false
  const { workouts } = v as Record<string, unknown>
  if (!workouts || typeof workouts !== 'object') return false
  for (const key of WORKOUT_ORDER) {
    const w = (workouts as Record<string, unknown>)[key]
    if (!w || typeof w !== 'object') return false
    const { label, exercises } = w as Record<string, unknown>
    if (typeof label !== 'string') return false
    if (!Array.isArray(exercises) || exercises.length === 0) return false
  }
  return true
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function generateWeeklyPlan(perf: LastWeekPerf): Promise<Record<WorkoutKey, DayWorkout> | null> {
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const prompt = buildPrompt(perf)

    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = msg.content[0].type === 'text' ? msg.content[0].text : ''
    // Strip accidental markdown fences
    const json = raw.replace(/^```(?:json)?\s*/m, '').replace(/\s*```\s*$/m, '').trim()
    const parsed = JSON.parse(json)

    if (!isValidPlan(parsed)) {
      console.error('[generate-plan] Claude returned unexpected structure')
      return null
    }

    const result = {} as Record<WorkoutKey, DayWorkout>
    for (const key of WORKOUT_ORDER) {
      const w = parsed.workouts[key]
      result[key] = { key, label: w.label, type: 'gym', exercises: w.exercises as Exercise[] }
    }
    return result
  } catch (err) {
    console.error('[generate-plan] Error:', err)
    return null
  }
}
