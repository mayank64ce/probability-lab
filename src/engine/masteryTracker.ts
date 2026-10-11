/**
 * Rule-based mastery. Deliberately transparent: a learner should be able to
 * read the rule that produced their state, and no state is ever granted for
 * merely finishing a lesson.
 */

import type { ConceptId } from "../content/schema";
import type { AttemptRecord } from "./records";

export type MasteryState =
  "not-started" | "learning" | "practicing" | "proficient" | "mastered" | "review-needed";

export const MASTERY_LABELS: Record<MasteryState, string> = {
  "not-started": "Not started",
  learning: "Learning",
  practicing: "Practicing",
  proficient: "Proficient",
  mastered: "Mastered",
  "review-needed": "Review needed",
};

export const DAY_MS = 24 * 60 * 60 * 1000;

export interface ConceptStats {
  conceptId: ConceptId;
  total: number;
  correct: number;
  /** Correct, unhinted, first attempt, on an assessment screen. */
  independentCorrect: number;
  /** Correct answers that leaned on a hint or a retry. */
  assistedCorrect: number;
  /** Correct submissions since the most recent incorrect one. */
  streak: number;
  accuracy: number;
  hintsUsed: number;
  firstAttemptAt?: number;
  lastAttemptAt?: number;
  lastCorrectAt?: number;
  /** Separate calendar days with at least one attempt — proxy for retention. */
  distinctDays: number;
}

export function summarizeConcept(conceptId: ConceptId, attempts: AttemptRecord[]): ConceptStats {
  const relevant = attempts
    .filter((a) => a.conceptIds.includes(conceptId))
    .sort((a, b) => a.completedAt - b.completedAt);

  const stats: ConceptStats = {
    conceptId,
    total: relevant.length,
    correct: 0,
    independentCorrect: 0,
    assistedCorrect: 0,
    streak: 0,
    accuracy: 0,
    hintsUsed: 0,
    distinctDays: 0,
  };

  stats.firstAttemptAt = relevant[0]?.completedAt;

  const days = new Set<string>();
  for (const attempt of relevant) {
    days.add(new Date(attempt.completedAt).toISOString().slice(0, 10));
    stats.hintsUsed += attempt.hintsUsed;
    if (attempt.correct) {
      stats.correct += 1;
      stats.streak += 1;
      stats.lastCorrectAt = attempt.completedAt;
      if (attempt.independent) stats.independentCorrect += 1;
      else stats.assistedCorrect += 1;
    } else {
      stats.streak = 0;
    }
    stats.lastAttemptAt = attempt.completedAt;
  }

  stats.distinctDays = days.size;
  stats.accuracy = stats.total === 0 ? 0 : stats.correct / stats.total;
  return stats;
}

/**
 * Thresholds are heuristics, chosen so that a single lucky answer can never
 * reach "proficient" and retention always requires a return visit.
 */
export const MASTERY_RULES = {
  practicingCorrect: 2,
  proficientIndependentCorrect: 3,
  proficientAccuracy: 0.75,
  masteredIndependentCorrect: 5,
  /** A concept only counts as mastered once it survives a gap this long. */
  retentionGapMs: 7 * DAY_MS,
  /** Past this long untouched, a shaky concept is surfaced for review. */
  stalenessMs: 14 * DAY_MS,
} as const;

export function masteryState(stats: ConceptStats, now: number = Date.now()): MasteryState {
  if (stats.total === 0) return "not-started";

  const lastAttempt = stats.lastAttemptAt ?? 0;
  const failedLast = stats.streak === 0;
  const stale = now - lastAttempt > MASTERY_RULES.stalenessMs;

  if (failedLast) return "review-needed";

  const spansRetentionGap =
    stats.distinctDays >= 2 &&
    stats.lastCorrectAt !== undefined &&
    stats.firstAttemptAt !== undefined &&
    stats.lastCorrectAt - stats.firstAttemptAt >= MASTERY_RULES.retentionGapMs;

  if (
    stats.independentCorrect >= MASTERY_RULES.masteredIndependentCorrect &&
    stats.accuracy >= MASTERY_RULES.proficientAccuracy &&
    spansRetentionGap
  ) {
    return "mastered";
  }

  if (
    stats.independentCorrect >= MASTERY_RULES.proficientIndependentCorrect &&
    stats.accuracy >= MASTERY_RULES.proficientAccuracy
  ) {
    return stale ? "review-needed" : "proficient";
  }

  if (stats.correct >= MASTERY_RULES.practicingCorrect) {
    return stale ? "review-needed" : "practicing";
  }

  return "learning";
}
