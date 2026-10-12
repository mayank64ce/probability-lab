/**
 * Derived views over progress state. Pure functions, so the dashboard never
 * stores anything that can drift out of sync with the attempt log.
 */

import type { ConceptId } from "../content/schema";
import { LESSON_INDEX, lessonMeta } from "../content/lessons";
import type { AttemptRecord, ProgressState } from "./records";
import { summarizeConcept, masteryState } from "./masteryTracker";
import type { ConceptStats, MasteryState } from "./masteryTracker";
import { dueReviews, weakConcepts } from "./reviewScheduler";
import type { ReviewItem } from "./reviewScheduler";

/** Concepts the learner has actually attempted — the scope for review logic. */
export function attemptedConceptIds(attempts: AttemptRecord[]): ConceptId[] {
  return Array.from(new Set(attempts.flatMap((a) => a.conceptIds)));
}

export interface CourseProgress {
  lessonsAvailable: number;
  lessonsStarted: number;
  lessonsCompleted: number;
  conceptsTouched: number;
  /** 0–1 across the lessons that exist today, not the whole eventual course. */
  ratio: number;
}

export function courseProgress(state: ProgressState): CourseProgress {
  const entries = Object.values(state.lessons).filter((l) => lessonMeta(l.lessonId));
  const completed = entries.filter((l) => l.completedAt !== undefined).length;

  return {
    lessonsAvailable: LESSON_INDEX.length,
    lessonsStarted: entries.length,
    lessonsCompleted: completed,
    conceptsTouched: attemptedConceptIds(state.attempts).length,
    ratio: LESSON_INDEX.length === 0 ? 0 : completed / LESSON_INDEX.length,
  };
}

/**
 * What to do next: finish what is open, otherwise start the first unstarted
 * lesson. Returns null once everything authored so far is complete.
 */
export function recommendedLessonId(state: ProgressState): string | null {
  const inProgress = LESSON_INDEX.find((lesson) => {
    const p = state.lessons[lesson.id];
    return p !== undefined && p.completedAt === undefined;
  });
  if (inProgress) return inProgress.id;

  const unstarted = LESSON_INDEX.find((lesson) => state.lessons[lesson.id] === undefined);
  return unstarted?.id ?? null;
}

export interface RecentPerformance {
  attempts: number;
  correct: number;
  accuracy: number;
  /** Independent attempts, i.e. unassisted assessment answers. */
  independent: number;
  independentCorrect: number;
  hintsUsed: number;
  lastActiveAt?: number;
}

export function recentPerformance(attempts: AttemptRecord[], limit = 20): RecentPerformance {
  const recent = [...attempts].sort((a, b) => b.completedAt - a.completedAt).slice(0, limit);
  const correct = recent.filter((a) => a.correct).length;
  const independent = recent.filter((a) => a.independent);

  return {
    attempts: recent.length,
    correct,
    accuracy: recent.length === 0 ? 0 : correct / recent.length,
    independent: independent.length,
    independentCorrect: independent.filter((a) => a.correct).length,
    hintsUsed: recent.reduce((sum, a) => sum + a.hintsUsed, 0),
    lastActiveAt: recent[0]?.completedAt,
  };
}

export interface ConceptSnapshot {
  conceptId: ConceptId;
  stats: ConceptStats;
  mastery: MasteryState;
}

export function conceptSnapshots(
  conceptIds: ConceptId[],
  attempts: AttemptRecord[],
  now: number = Date.now(),
): ConceptSnapshot[] {
  return conceptIds.map((conceptId) => {
    const stats = summarizeConcept(conceptId, attempts);
    return { conceptId, stats, mastery: masteryState(stats, now) };
  });
}

export interface DashboardData {
  progress: CourseProgress;
  recommendedLessonId: string | null;
  resumeLessonId: string | null;
  weak: ReviewItem[];
  due: ReviewItem[];
  performance: RecentPerformance;
  snapshots: ConceptSnapshot[];
}

export function dashboardData(state: ProgressState, now: number = Date.now()): DashboardData {
  const touched = attemptedConceptIds(state.attempts);
  const resume = state.lastLessonId;
  const resumeOpen =
    resume !== undefined &&
    lessonMeta(resume) !== undefined &&
    state.lessons[resume]?.completedAt === undefined;

  return {
    progress: courseProgress(state),
    recommendedLessonId: recommendedLessonId(state),
    resumeLessonId: resumeOpen ? resume : null,
    weak: weakConcepts(touched, state.attempts, now),
    due: dueReviews(touched, state.attempts, now),
    performance: recentPerformance(state.attempts),
    snapshots: conceptSnapshots(touched, state.attempts, now),
  };
}
