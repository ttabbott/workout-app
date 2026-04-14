'use client'

import { useState, useRef } from 'react'
import { Exercise, SetLog, ExerciseLog, WorkoutKey, SetDetail } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface InitialSetLog {
  exercise_id: string
  set_index: number   // -1 for cardio
  completed: boolean
  actual_weight: number | null
  actual_reps: number | null
}

async function upsertSetLog(
  supabase: SupabaseClient,
  userId: string,
  logDate: string,
  payload: InitialSetLog
): Promise<string | null> {
  const { error } = await supabase.from('set_logs').upsert(
    {
      user_id: userId,
      log_date: logDate,
      exercise_id: payload.exercise_id,
      set_index: payload.set_index,
      completed: payload.completed,
      actual_weight: payload.actual_weight,
      actual_reps: payload.actual_reps,
    },
    { onConflict: 'user_id,log_date,exercise_id,set_index' }
  )
  if (error) {
    console.error('[WorkoutView] set_logs upsert failed:', error)
    return error.message
  }
  return null
}

async function upsertDailyLog(
  supabase: SupabaseClient,
  userId: string,
  logDate: string,
  dayType: string,
  fields: { gym_completed?: boolean; workout_key?: WorkoutKey }
): Promise<void> {
  const { error } = await supabase.from('daily_logs').upsert(
    { user_id: userId, log_date: logDate, day_type: dayType, ...fields },
    { onConflict: 'user_id,log_date' }
  )
  if (error) console.error('[WorkoutView] daily_logs upsert failed:', error)
}

// ─── Single set row ───────────────────────────────────────────────────────────

interface SetRowProps {
  setIndex: number
  exercise: Exercise
  detail: SetDetail   // per-set prescription
  log: SetLog
  onToggle: () => void
  onUpdate: (weight: number | null, reps: number | null) => void
}

function SetRow({ setIndex, exercise, detail, log, onToggle, onUpdate }: SetRowProps) {
  const isBodyweight = (detail.unit ?? exercise.unit) === 'bodyweight'
  const [editing, setEditing] = useState(false)
  const [editWeight, setEditWeight] = useState<string>(
    log.actualWeight !== null ? String(log.actualWeight) : String(detail.weight ?? exercise.weight ?? '')
  )
  const [editReps, setEditReps] = useState<string>(
    log.actualReps !== null
      ? String(log.actualReps)
      : detail.reps.split('-')[0].replace(/[^\d]/g, '') || detail.reps
  )

  function handleSave() {
    const w = !isBodyweight && editWeight !== '' ? Number(editWeight) : null
    const r = editReps !== '' ? Number(editReps) || null : null
    onUpdate(w, r)
    setEditing(false)
  }

  const prescribedLabel = isBodyweight
    ? `Bodyweight × ${detail.reps}`
    : `${detail.weight ?? exercise.weight ?? '—'} lbs × ${detail.reps}`

  return (
    <div
      className={`rounded-xl border px-4 py-3 transition-all ${
        log.completed
          ? 'bg-emerald-950/60 border-emerald-700/60'
          : 'bg-gray-800/60 border-gray-700'
      }`}
    >
      {editing ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            {!isBodyweight && (
              <div className="flex-1">
                <label className="text-xs text-gray-400 block mb-1">Weight (lbs)</label>
                <input
                  type="number"
                  value={editWeight}
                  onChange={(e) => setEditWeight(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  inputMode="decimal"
                />
              </div>
            )}
            <div className="flex-1">
              <label className="text-xs text-gray-400 block mb-1">Reps</label>
              <input
                type="number"
                value={editReps}
                onChange={(e) => setEditReps(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                inputMode="numeric"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium"
            >
              Save & Complete
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              log.completed ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-400'
            }`}
          >
            {log.completed ? '✓' : setIndex + 1}
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-sm text-gray-300">{prescribedLabel}</div>
            {log.completed && (log.actualWeight !== null || log.actualReps !== null) && (
              <div className="text-xs text-emerald-400 mt-0.5">
                Logged:{' '}
                {log.actualWeight !== null ? `${log.actualWeight} lbs` : 'BW'} ×{' '}
                {log.actualReps ?? '—'}
              </div>
            )}
          </div>

          <div className="flex gap-2 flex-shrink-0">
            {!log.completed && (
              <button
                onClick={() => setEditing(true)}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
              >
                Edit
              </button>
            )}
            <button
              onClick={onToggle}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                log.completed
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-white'
              }`}
            >
              {log.completed ? 'Undo' : 'Done'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Cardio block ─────────────────────────────────────────────────────────────

interface CardioBlockProps {
  exercise: Exercise
  log: ExerciseLog
  onComplete: () => void
}

function CardioBlock({ exercise, log, onComplete }: CardioBlockProps) {
  return (
    <div
      className={`rounded-xl border px-4 py-4 transition-all ${
        log.cardioCompleted
          ? 'bg-emerald-950/60 border-emerald-700/60'
          : 'bg-gray-800/60 border-gray-700'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="text-white font-medium">{exercise.name}</div>
          <div className="text-sm text-gray-400 mt-1">
            ⏱ {exercise.duration} min — {exercise.intensity}
          </div>
          {exercise.youtubeUrl && (
            <a
              href={exercise.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-red-400 mt-2 hover:text-red-300 transition-colors"
            >
              ▶ YouTube reference
            </a>
          )}
        </div>
        <button
          onClick={onComplete}
          className={`flex-shrink-0 text-xs px-3 py-2 rounded-lg font-medium transition-colors ${
            log.cardioCompleted
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              : 'bg-emerald-500 hover:bg-emerald-400 text-white'
          }`}
        >
          {log.cardioCompleted ? '✓ Done' : 'Complete'}
        </button>
      </div>
    </div>
  )
}

// ─── Exercise card ────────────────────────────────────────────────────────────

interface ExerciseCardProps {
  exercise: Exercise
  log: ExerciseLog
  onSetToggle: (si: number) => void
  onSetUpdate: (si: number, w: number | null, r: number | null) => void
  onCardioComplete: () => void
}

function ExerciseCard({ exercise, log, onSetToggle, onSetUpdate, onCardioComplete }: ExerciseCardProps) {
  const completedSets = log.sets.filter((s) => s.completed).length
  const totalSets = log.sets.length
  const setCount = exercise.setDetails?.length ?? exercise.sets ?? totalSets

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-base leading-snug">{exercise.name}</h3>
          {exercise.type === 'strength' && (
            <p className="text-gray-500 text-xs mt-0.5">
              {setCount} sets — progressive loading
            </p>
          )}
          {exercise.notes && (
            <p className="text-amber-400/80 text-xs mt-1 italic">{exercise.notes}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {exercise.youtubeUrl && exercise.type === 'strength' && (
            <a
              href={exercise.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors bg-red-950/40 px-2 py-1 rounded-lg border border-red-900/40"
            >
              ▶ Demo
            </a>
          )}
          {exercise.type === 'strength' && (
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                completedSets === totalSets
                  ? 'bg-emerald-900/60 text-emerald-300'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              {completedSets}/{totalSets}
            </span>
          )}
        </div>
      </div>

      <div className="px-4 pb-4 space-y-2">
        {exercise.type === 'strength'
          ? log.sets.map((setLog, i) => {
              const detail = exercise.setDetails?.[i] ?? {
                weight: exercise.weight,
                reps: exercise.reps ?? '—',
                unit: exercise.unit,
              }
              return (
                <SetRow
                  key={i}
                  setIndex={i}
                  exercise={exercise}
                  detail={detail}
                  log={setLog}
                  onToggle={() => onSetToggle(i)}
                  onUpdate={(w, r) => onSetUpdate(i, w, r)}
                />
              )
            })
          : (
            <CardioBlock exercise={exercise} log={log} onComplete={onCardioComplete} />
          )}
      </div>
    </div>
  )
}

// ─── Main workout view ────────────────────────────────────────────────────────

interface WorkoutViewProps {
  exercises: Exercise[]
  workoutLabel: string
  userId: string
  logDate: string           // 'YYYY-MM-DD'
  dayType: string
  workoutKey?: WorkoutKey   // A/B/C/D — saved on completion
  initialSetLogs: InitialSetLog[]
}

function buildInitialLogs(exercises: Exercise[], dbLogs: InitialSetLog[]): ExerciseLog[] {
  return exercises.map((ex) => {
    const exLogs = dbLogs.filter((l) => l.exercise_id === ex.id)

    if (ex.type === 'cardio') {
      const cardioLog = exLogs.find((l) => l.set_index === -1)
      return { exerciseId: ex.id, sets: [], cardioCompleted: cardioLog?.completed ?? false }
    }

    const setCount = ex.setDetails?.length ?? ex.sets ?? 0
    const sets: SetLog[] = Array.from({ length: setCount }, (_, i) => {
      const dbSet = exLogs.find((l) => l.set_index === i)
      return {
        completed: dbSet?.completed ?? false,
        actualWeight: dbSet?.actual_weight ?? null,
        actualReps: dbSet?.actual_reps ?? null,
      }
    })
    return { exerciseId: ex.id, sets }
  })
}

export default function WorkoutView({
  exercises,
  workoutLabel,
  userId,
  logDate,
  dayType,
  workoutKey,
  initialSetLogs,
}: WorkoutViewProps) {
  // Stable Supabase client — created once, not on every action
  const supabase = useRef(createClient()).current

  const [logs, setLogs] = useState<ExerciseLog[]>(() =>
    buildInitialLogs(exercises, initialSetLogs)
  )
  const [saveError, setSaveError] = useState<string | null>(null)

  // Check if everything is done → mark gym_completed + workout_key in daily_logs
  async function checkAllDone(updatedLogs: ExerciseLog[]) {
    const allStrengthDone = updatedLogs.every((l, i) =>
      exercises[i]?.type === 'strength' ? l.sets.every((s) => s.completed) : true
    )
    const allCardioDone = updatedLogs.every((l, i) =>
      exercises[i]?.type === 'cardio' ? l.cardioCompleted : true
    )
    if (allStrengthDone && allCardioDone) {
      await upsertDailyLog(supabase, userId, logDate, dayType, {
        gym_completed: true,
        ...(workoutKey ? { workout_key: workoutKey } : {}),
      })
    }
  }

  async function toggleSet(exIndex: number, setIndex: number) {
    const ex = exercises[exIndex]
    const prevSet = logs[exIndex].sets[setIndex]

    // Compute new values BEFORE calling setState
    const detail = ex.setDetails?.[setIndex]
    const newCompleted = !prevSet.completed
    const newWeight = prevSet.actualWeight ?? detail?.weight ?? ex.weight ?? null
    const newReps = prevSet.actualReps ?? (Number((detail?.reps ?? ex.reps ?? '').split('-')[0].replace(/[^\d]/g, '')) || null)

    const newLogs = logs.map((log, i) => {
      if (i !== exIndex) return log
      return {
        ...log,
        sets: log.sets.map((s, si) =>
          si === setIndex
            ? { completed: newCompleted, actualWeight: newWeight, actualReps: newReps }
            : s
        ),
      }
    })

    setLogs(newLogs)

    const err = await upsertSetLog(supabase, userId, logDate, {
      exercise_id: ex.id,
      set_index: setIndex,
      completed: newCompleted,
      actual_weight: newWeight,
      actual_reps: newReps,
    })

    if (err) {
      setSaveError(err)
      setLogs(logs) // revert on failure
    } else {
      setSaveError(null)
      await checkAllDone(newLogs)
    }
  }

  async function updateSet(exIndex: number, setIndex: number, weight: number | null, reps: number | null) {
    const ex = exercises[exIndex]

    const newLogs = logs.map((log, i) => {
      if (i !== exIndex) return log
      return {
        ...log,
        sets: log.sets.map((s, si) =>
          si === setIndex ? { completed: true, actualWeight: weight, actualReps: reps } : s
        ),
      }
    })

    setLogs(newLogs)

    const err = await upsertSetLog(supabase, userId, logDate, {
      exercise_id: ex.id,
      set_index: setIndex,
      completed: true,
      actual_weight: weight,
      actual_reps: reps,
    })

    if (err) {
      setSaveError(err)
      setLogs(logs)
    } else {
      setSaveError(null)
      await checkAllDone(newLogs)
    }
  }

  async function completeCardio(exIndex: number) {
    const ex = exercises[exIndex]
    const newCompleted = !logs[exIndex].cardioCompleted

    const newLogs = logs.map((log, i) =>
      i === exIndex ? { ...log, cardioCompleted: newCompleted } : log
    )

    setLogs(newLogs)

    const err = await upsertSetLog(supabase, userId, logDate, {
      exercise_id: ex.id,
      set_index: -1,
      completed: newCompleted,
      actual_weight: null,
      actual_reps: null,
    })

    if (err) {
      setSaveError(err)
      setLogs(logs)
    } else {
      setSaveError(null)
      await checkAllDone(newLogs)
    }
  }

  const totalSets = logs.reduce((acc, l) => acc + l.sets.length, 0)
  const completedSets = logs.reduce((acc, l) => acc + l.sets.filter((s) => s.completed).length, 0)
  const cardioTotal = logs.filter((_, i) => exercises[i]?.type === 'cardio').length
  const cardioDone = logs.filter((l, i) => exercises[i]?.type === 'cardio' && l.cardioCompleted).length
  const isAllDone = completedSets === totalSets && cardioDone === cardioTotal

  const strengthExercises = exercises.filter((e) => e.type === 'strength')
  const cardioExercises = exercises.filter((e) => e.type === 'cardio')

  return (
    <div className="space-y-4">
      {/* Save error banner */}
      {saveError && (
        <div className="px-4 py-3 rounded-xl bg-red-900/40 border border-red-700 text-red-300 text-sm">
          ⚠ Save failed: {saveError}
        </div>
      )}

      {/* Progress banner */}
      {totalSets > 0 && (
        <div
          className={`rounded-2xl p-4 border flex items-center gap-4 ${
            isAllDone ? 'bg-emerald-950/60 border-emerald-700/60' : 'bg-gray-900 border-gray-800'
          }`}
        >
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-2">
              <span className={isAllDone ? 'text-emerald-300 font-medium' : 'text-gray-300'}>
                {isAllDone ? '🎉 Workout complete!' : 'Workout progress'}
              </span>
              <span className={isAllDone ? 'text-emerald-300' : 'text-gray-400'}>
                {completedSets}/{totalSets} sets
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: totalSets > 0 ? `${(completedSets / totalSets) * 100}%` : '0%' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Strength */}
      {strengthExercises.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 px-1">
            Strength
          </h2>
          {strengthExercises.map((exercise) => {
            const exIndex = exercises.indexOf(exercise)
            return (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                log={logs[exIndex]}
                onSetToggle={(si) => toggleSet(exIndex, si)}
                onSetUpdate={(si, w, r) => updateSet(exIndex, si, w, r)}
                onCardioComplete={() => completeCardio(exIndex)}
              />
            )
          })}
        </div>
      )}

      {/* Cardio */}
      {cardioExercises.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 px-1">
            Cardio
          </h2>
          {cardioExercises.map((exercise) => {
            const exIndex = exercises.indexOf(exercise)
            return (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                log={logs[exIndex]}
                onSetToggle={(si) => toggleSet(exIndex, si)}
                onSetUpdate={(si, w, r) => updateSet(exIndex, si, w, r)}
                onCardioComplete={() => completeCardio(exIndex)}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
