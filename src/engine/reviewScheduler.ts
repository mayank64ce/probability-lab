/**
 * Spaced review on an explicit interval ladder.
 *
 * A deliberately simple rule system — no model, no opaque scoring. Successful
 * recall pushes a concept further down the ladder; a failure drops it back to
 * the start, and leaning on hints costs one rung.
 */

import type { ConceptId } from "../content/schema";
import type { AttemptRecord } from "./records";
import { DAY_MS, summarizeConcept, masteryState } from "./masteryTracker";
import type { ConceptStats, MasteryState } from "./masteryTracker";

/** Days until the next review, indexed by the learner's current streak. */
export const INTERVAL_LADDER_DAYS = [1, 3, 7, 16, 35, 70] as const;

export type ReviewReason =
  "never-practiced" | "answered-incorrectly" | "needed-hints" | "found-difficult" | "time-elapsed";

export const REVIEW_REASON_LABELS: Record<ReviewReason, string> = {
  "never-practiced": "Not practiced yet",
  "answered-incorrectly": "Missed last time",
  "needed-hints": "Needed hints",
  "found-difficult": "Low accuracy so far",
  "time-elapsed": "Due for spaced review",
};

export interface ReviewItem {
  conceptId: ConceptId;
  dueAt: number;
  /** Positive when the item is already due; milliseconds past due. */
  overdueMs: number;
  reason: ReviewReason;
  stats: ConceptStats;
  mastery: MasteryState;
}

function ladderDays(index: number): number {
  const clamped = Math.min(Math.max(index, 0), INTERVAL_LADDER_DAYS.length - 1);
  return INTERVAL_LADDER_DAYS[clamped];
}

/**
 * Chooses the next review time for one concept.
 *
 * Returns null when the concept has never been attempted — those are offers to
 * learn, not reviews, and the dashboard treats them separately.
 */
export function nextReviewAt(stats: ConceptStats): number | null {
  if (stats.total === 0 || stats.lastAttemptAt === undefined) return null;

  // A miss always comes back tomorrow, whatever the streak used to be.
  if (stats.streak === 0) return stats.lastAttemptAt + ladderDays(0) * DAY_MS;

  // Hints mean the recall was not clean, so give up a rung.
  const leanedOnHints = stats.hintsUsed > 0 && stats.assistedCorrect > 0;
  const rung = stats.streak - 1 - (leanedOnHints ? 1 : 0);

  return stats.lastAttemptAt + ladderDays(rung) * DAY_MS;
}

function reviewReason(stats: ConceptStats): ReviewReason {
  if (stats.total === 0) return "never-practiced";
  if (stats.streak === 0) return "answered-incorrectly";
  if (stats.accuracy < 0.6) return "found-difficult";
  if (stats.hintsUsed > 0 && stats.assistedCorrect > 0) return "needed-hints";
  return "time-elapsed";
}

/**
 * Every concept that is due now, most overdue first.
 *
 * `conceptIds` scopes the sweep to concepts the learner has actually met, so
 * the untouched parts of the curriculum never masquerade as review debt.
 */
export function dueReviews(
  conceptIds: ConceptId[],
  attempts: AttemptRecord[],
  now: number = Date.now(),
): ReviewItem[] {
  const items: ReviewItem[] = [];

  for (const conceptId of conceptIds) {
    const stats = summarizeConcept(conceptId, attempts);
    if (stats.total === 0) continue;

    const dueAt = nextReviewAt(stats);
    if (dueAt === null || dueAt > now) continue;

    items.push({
      conceptId,
      dueAt,
      overdueMs: now - dueAt,
      reason: reviewReason(stats),
      stats,
      mastery: masteryState(stats, now),
    });
  }

  return items.sort((a, b) => b.overdueMs - a.overdueMs);
}

/** Concepts the learner is measurably shaky on, weakest first. */
export function weakConcepts(
  conceptIds: ConceptId[],
  attempts: AttemptRecord[],
  now: number = Date.now(),
): ReviewItem[] {
  return conceptIds
    .map((conceptId) => {
      const stats = summarizeConcept(conceptId, attempts);
      return { conceptId, stats, mastery: masteryState(stats, now) };
    })
    .filter(({ stats, mastery }) => {
      if (stats.total === 0) return false;
      // A concept answered correctly once is new, not weak. Weakness needs
      // evidence: a miss, or a run of answers that is mostly wrong.
      return mastery === "review-needed" || stats.accuracy < 0.7;
    })
    .map(({ conceptId, stats, mastery }) => {
      const dueAt = nextReviewAt(stats) ?? now;
      return {
        conceptId,
        dueAt,
        overdueMs: now - dueAt,
        reason: reviewReason(stats),
        stats,
        mastery,
      };
    })
    .sort((a, b) => a.stats.accuracy - b.stats.accuracy);
}
