/**
 * Choosing what to practise next.
 *
 * Pure and rule-based, like the rest of the engine: no model, no opaque
 * scoring. The policy the product plan asks for — weight towards the current
 * topic, weak concepts, and older material due for another look — is spelled
 * out below as explicit, testable terms.
 */

import type { ConceptId, Difficulty, Exercise } from "../content/schema";
import type { AttemptRecord } from "./records";
import { DAY_MS, summarizeConcept, masteryState } from "./masteryTracker";
import { INTERVAL_LADDER_DAYS, nextReviewAt } from "./reviewScheduler";

export type SessionKind = "topic" | "mixed" | "review";

/** What the learner has done with one specific problem. */
export interface ExerciseStats {
  exerciseId: string;
  total: number;
  correct: number;
  /** Correct submissions since the most recent incorrect one. */
  streak: number;
  hintsUsed: number;
  lastAttemptAt?: number;
}

export function summarizeExercise(exerciseId: string, attempts: AttemptRecord[]): ExerciseStats {
  const mine = attempts
    .filter((a) => a.exerciseId === exerciseId)
    .sort((a, b) => a.completedAt - b.completedAt);

  let streak = 0;
  for (let i = mine.length - 1; i >= 0; i -= 1) {
    if (!mine[i].correct) break;
    streak += 1;
  }

  return {
    exerciseId,
    total: mine.length,
    correct: mine.filter((a) => a.correct).length,
    streak,
    hintsUsed: mine.reduce((n, a) => n + a.hintsUsed, 0),
    lastAttemptAt: mine[mine.length - 1]?.completedAt,
  };
}

function ladderDays(index: number): number {
  const clamped = Math.min(Math.max(index, 0), INTERVAL_LADDER_DAYS.length - 1);
  return INTERVAL_LADDER_DAYS[clamped];
}

/**
 * When a problem should be served again.
 *
 * Null means "never attempted", which is an offer rather than a review. This
 * is what makes a solved problem come back at increasing intervals instead of
 * either vanishing or repeating immediately.
 */
export function exerciseDueAt(stats: ExerciseStats): number | null {
  if (stats.total === 0 || stats.lastAttemptAt === undefined) return null;
  if (stats.streak === 0) return stats.lastAttemptAt + ladderDays(0) * DAY_MS;
  return stats.lastAttemptAt + ladderDays(stats.streak - 1) * DAY_MS;
}

export interface SessionOptions {
  kind: SessionKind;
  /** How many problems to serve. */
  size: number;
  attempts: AttemptRecord[];
  now: number;
  /** Restricts the pool — the topic being drilled, or the concepts under review. */
  conceptIds?: ConceptId[];
}

/** Weights, named so the policy can be read without tracing the code. */
export const SESSION_WEIGHTS = {
  conceptNeedsReview: 100,
  conceptIsWeak: 60,
  conceptDue: 40,
  neverAttempted: 20,
  /** A problem answered correctly and not yet due again is a poor use of a slot. */
  solvedAndNotDue: -80,
  /** A problem missed last time should come back promptly. */
  missedLastTime: 70,
} as const;

interface Scored {
  exercise: Exercise;
  score: number;
  difficulty: Difficulty;
}

/**
 * Builds a practice set from a pool.
 *
 * Returns fewer than `size` problems only when the pool genuinely runs out —
 * padding a session with problems the learner solved yesterday would teach
 * nothing and inflate their accuracy.
 */
export function planSession(pool: Exercise[], options: SessionOptions): Exercise[] {
  const { attempts, now, size } = options;
  const wanted = options.conceptIds?.length ? new Set(options.conceptIds) : null;

  // Concept-level signals, computed once rather than per exercise.
  const conceptSignal = new Map<ConceptId, { weak: boolean; needsReview: boolean; due: boolean }>();
  const signalFor = (conceptId: ConceptId) => {
    const cached = conceptSignal.get(conceptId);
    if (cached) return cached;
    const stats = summarizeConcept(conceptId, attempts);
    const mastery = masteryState(stats, now);
    const dueAt = nextReviewAt(stats);
    const signal = {
      needsReview: mastery === "review-needed",
      weak: stats.total > 0 && stats.accuracy < 0.7,
      due: dueAt !== null && dueAt <= now,
    };
    conceptSignal.set(conceptId, signal);
    return signal;
  };

  const scored: Scored[] = pool
    .filter((exercise) => (wanted ? exercise.conceptIds.some((id) => wanted.has(id)) : true))
    .map((exercise) => {
      const stats = summarizeExercise(exercise.id, attempts);
      const dueAt = exerciseDueAt(stats);

      let score = 0;
      for (const conceptId of exercise.conceptIds) {
        const signal = signalFor(conceptId);
        if (signal.needsReview) score += SESSION_WEIGHTS.conceptNeedsReview;
        if (signal.weak) score += SESSION_WEIGHTS.conceptIsWeak;
        if (signal.due) score += SESSION_WEIGHTS.conceptDue;
      }

      if (stats.total === 0) {
        score += SESSION_WEIGHTS.neverAttempted;
      } else if (stats.streak === 0) {
        score += SESSION_WEIGHTS.missedLastTime;
      } else if (dueAt !== null && dueAt > now) {
        score += SESSION_WEIGHTS.solvedAndNotDue;
      }

      return { exercise, score, difficulty: exercise.difficulty };
    });

  return (
    scored
      .filter((s) => s.score > 0)
      .sort(
        (a, b) =>
          b.score - a.score ||
          a.difficulty - b.difficulty ||
          a.exercise.id.localeCompare(b.exercise.id),
      )
      .slice(0, size)
      // Serve the gentler problems first so a session does not open on a
      // transfer question.
      .sort((a, b) => a.difficulty - b.difficulty || a.exercise.id.localeCompare(b.exercise.id))
      .map((s) => s.exercise)
  );
}
