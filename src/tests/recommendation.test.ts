/**
 * The dashboard recommendation.
 *
 * The product plan's criterion for smart practice is that "performance on
 * previous exercises meaningfully changes future recommendations". That is a
 * behavioural claim, so it is pinned here: the same learner, with different
 * answer histories, must be sent somewhere different.
 */

import { describe, expect, it } from "vitest";
import { recommend } from "../engine/selectors";
import { emptyProgress, recordAttempt, upsertLessonProgress } from "../storage/progressStore";
import { DAY_MS } from "../engine/masteryTracker";
import { LESSON_INDEX } from "../content/lessons";
import type { AttemptRecord, ProgressState } from "../engine/records";

const NOW = Date.UTC(2026, 1, 10);
const FIRST = LESSON_INDEX[0];
const SECOND = LESSON_INDEX[1];

function attempt(over: Partial<AttemptRecord>): AttemptRecord {
  return {
    id: `a-${Math.random()}`,
    exerciseId: "x",
    lessonId: "practice",
    conceptIds: ["conditional-probability"],
    answer: "1",
    correct: true,
    attemptNumber: 1,
    hintsUsed: 0,
    aiAssisted: false,
    timeMs: 1000,
    completedAt: NOW,
    independent: true,
    difficulty: 2,
    contentVersion: "bank-1",
    ...over,
  };
}

function completed(state: ProgressState, lessonId: string, stageIds: string[]): ProgressState {
  return upsertLessonProgress(state, {
    lessonId,
    stageIndex: stageIds.length - 1,
    completedStageIds: stageIds,
    startedAt: NOW - DAY_MS,
    updatedAt: NOW - DAY_MS,
    completedAt: NOW - DAY_MS,
    contentVersion: "1.0.0",
  });
}

describe("recommend", () => {
  it("sends a brand new learner to the first lesson", () => {
    const rec = recommend(emptyProgress(NOW), NOW);
    expect(rec.kind).toBe("next-lesson");
    expect(rec.lessonId).toBe(FIRST.id);
  });

  it("puts finishing an open lesson above everything else", () => {
    let state = emptyProgress(NOW);
    state = upsertLessonProgress(state, {
      lessonId: FIRST.id,
      stageIndex: 2,
      completedStageIds: FIRST.stageIds.slice(0, 2),
      startedAt: NOW - DAY_MS,
      updatedAt: NOW - DAY_MS,
      contentVersion: "1.0.0",
    });
    // Even with a miss on the books, the half-done lesson wins.
    state = recordAttempt(state, attempt({ correct: false, completedAt: NOW - 3 * DAY_MS }));

    const rec = recommend(state, NOW);
    expect(rec.kind).toBe("resume-lesson");
    expect(rec.lessonId).toBe(FIRST.id);
  });

  it("moves to the next lesson once the first is done cleanly", () => {
    const state = completed(emptyProgress(NOW), FIRST.id, FIRST.stageIds);
    const rec = recommend(state, NOW);
    expect(rec.kind).toBe("next-lesson");
    expect(rec.lessonId).toBe(SECOND.id);
  });

  it("interrupts new material when something is due for review", () => {
    let state = completed(emptyProgress(NOW), FIRST.id, FIRST.stageIds);
    // Missed two days ago, so the one-day interval has already elapsed.
    state = recordAttempt(state, attempt({ correct: false, completedAt: NOW - 2 * DAY_MS }));

    const rec = recommend(state, NOW);
    expect(rec.kind).toBe("review-due");
    expect(rec.conceptId).toBe("conditional-probability");
    expect(rec.count).toBe(1);
  });

  it("sends a learner to practise a weak concept that is not yet due", () => {
    let state = completed(emptyProgress(NOW), FIRST.id, FIRST.stageIds);
    // Missed just now: weak, but the spaced interval has not elapsed yet.
    state = recordAttempt(state, attempt({ correct: false, completedAt: NOW }));

    const rec = recommend(state, NOW);
    expect(rec.kind).toBe("practice-weak");
    expect(rec.conceptId).toBe("conditional-probability");
  });

  it("is driven by performance, not by lesson order", () => {
    // Two learners, identical lesson progress, different answers.
    const base = completed(emptyProgress(NOW), FIRST.id, FIRST.stageIds);

    const strong = recordAttempt(base, attempt({ correct: true, completedAt: NOW }));
    const struggling = recordAttempt(base, attempt({ correct: false, completedAt: NOW }));

    expect(recommend(strong, NOW).kind).toBe("next-lesson");
    expect(recommend(struggling, NOW).kind).toBe("practice-weak");
  });

  it("reports all-done once every lesson is finished and nothing is outstanding", () => {
    let state = emptyProgress(NOW);
    for (const lesson of LESSON_INDEX) state = completed(state, lesson.id, lesson.stageIds);
    const rec = recommend(state, NOW);
    expect(rec.kind).toBe("all-done");
    expect(rec.lessonId).toBeUndefined();
  });
});
