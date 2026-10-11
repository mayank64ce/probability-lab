/**
 * Progress persistence.
 *
 * localStorage is enough at this data volume — a few thousand attempt records
 * at most — and it keeps reads synchronous, which makes the UI simpler. The
 * interface is deliberately narrow so swapping in IndexedDB later touches only
 * this file.
 */

import type { AttemptRecord, LessonProgress, ProgressState, ThemeChoice } from "../engine/records";
import { CURRENT_SCHEMA_VERSION, migrate } from "./migrations";

export const STORAGE_KEY = "probability-lab:progress:v1";

export function emptyProgress(now: number = Date.now()): ProgressState {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    attempts: [],
    lessons: {},
    theme: "system",
    createdAt: now,
    updatedAt: now,
  };
}

/** Narrows unknown parsed JSON to a ProgressState, repairing missing fields. */
export function coerceProgress(raw: unknown): ProgressState {
  if (typeof raw !== "object" || raw === null) return emptyProgress();

  const migrated = migrate(raw as Record<string, unknown>);
  const base = emptyProgress();

  const attempts = Array.isArray(migrated.attempts)
    ? (migrated.attempts as AttemptRecord[]).filter(
        (a) => a && typeof a.id === "string" && Array.isArray(a.conceptIds),
      )
    : [];

  const lessons =
    typeof migrated.lessons === "object" && migrated.lessons !== null
      ? (migrated.lessons as Record<string, LessonProgress>)
      : {};

  const theme = migrated.theme;

  return {
    ...base,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    attempts,
    lessons,
    lastLessonId: typeof migrated.lastLessonId === "string" ? migrated.lastLessonId : undefined,
    theme: theme === "light" || theme === "dark" || theme === "system" ? theme : "system",
    createdAt: typeof migrated.createdAt === "number" ? migrated.createdAt : base.createdAt,
    updatedAt: typeof migrated.updatedAt === "number" ? migrated.updatedAt : base.updatedAt,
  };
}

/**
 * Reads persisted progress. Any failure — private mode, cleared site data,
 * corrupt JSON — degrades to a fresh state rather than breaking the app.
 */
export function loadProgress(): ProgressState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    return coerceProgress(JSON.parse(raw));
  } catch {
    return emptyProgress();
  }
}

/** Returns false when the write failed, so callers can warn once. */
export function saveProgress(state: ProgressState): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Pure reducers over ProgressState
// ---------------------------------------------------------------------------

export function recordAttempt(state: ProgressState, attempt: AttemptRecord): ProgressState {
  return {
    ...state,
    attempts: [...state.attempts, attempt],
    updatedAt: attempt.completedAt,
  };
}

export function upsertLessonProgress(
  state: ProgressState,
  progress: LessonProgress,
): ProgressState {
  const existing = state.lessons[progress.lessonId];
  const merged: LessonProgress = {
    ...progress,
    startedAt: existing?.startedAt ?? progress.startedAt,
    // Furthest point reached, so stepping back never loses progress.
    stageIndex: Math.max(existing?.stageIndex ?? 0, progress.stageIndex),
    completedStageIds: Array.from(
      new Set([...(existing?.completedStageIds ?? []), ...progress.completedStageIds]),
    ),
    completedAt: progress.completedAt ?? existing?.completedAt,
  };

  return {
    ...state,
    lessons: { ...state.lessons, [progress.lessonId]: merged },
    lastLessonId: progress.lessonId,
    updatedAt: progress.updatedAt,
  };
}

export function setTheme(state: ProgressState, theme: ThemeChoice): ProgressState {
  return { ...state, theme, updatedAt: Date.now() };
}

// ---------------------------------------------------------------------------
// Backup
// ---------------------------------------------------------------------------

export function exportProgress(state: ProgressState): string {
  return JSON.stringify({ ...state, exportedAt: Date.now() }, null, 2);
}

/** Throws when the payload is not readable progress, so the UI can report it. */
export function importProgress(json: string): ProgressState {
  const parsed: unknown = JSON.parse(json);
  if (typeof parsed !== "object" || parsed === null || !("attempts" in parsed)) {
    throw new Error("That file does not look like a Probability Lab backup.");
  }
  return coerceProgress(parsed);
}
