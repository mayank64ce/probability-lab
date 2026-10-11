/**
 * Pure navigation logic for a lesson.
 *
 * Holds no React state and touches no storage, so the stage rules — above all
 * "no solution before the learner commits" — are directly testable.
 */

import type { Lesson, LessonStage } from "../content/schema";

export interface StageState {
  /** Choice ids, or the raw text of a numeric answer. */
  submitted: boolean;
  correct: boolean;
  attempts: number;
  hintsRevealed: number;
  solutionRevealed: boolean;
}

export function emptyStageState(): StageState {
  return {
    submitted: false,
    correct: false,
    attempts: 0,
    hintsRevealed: 0,
    solutionRevealed: false,
  };
}

/** A stage with no exercise is read-only and can always be passed. */
export function stageRequiresAnswer(stage: LessonStage): boolean {
  return stage.exercise !== undefined;
}

/**
 * Whether the learner may move on.
 *
 * Committing to an answer is what unlocks the next screen — being *right* is
 * not required, because predicting wrongly is how the lesson teaches. The one
 * exception is an assessment stage, which must be answered correctly or
 * explicitly given up on via the worked solution.
 */
export function canAdvance(stage: LessonStage, state: StageState): boolean {
  if (!stageRequiresAnswer(stage)) return true;
  if (stage.independent) return state.correct || state.solutionRevealed;
  return state.submitted;
}

/** Hints stay locked on assessment screens until the learner has had a go. */
export function hintsAvailable(stage: LessonStage, state: StageState): boolean {
  if (!stage.exercise || stage.exercise.hints.length === 0) return false;
  if (stage.independent && state.attempts === 0) return false;
  return state.hintsRevealed < stage.exercise.hints.length;
}

/** The debrief and any worked solution stay hidden until an answer is in. */
export function feedbackVisible(stage: LessonStage, state: StageState): boolean {
  if (!stageRequiresAnswer(stage)) return true;
  return state.submitted;
}

export function stageIndexById(lesson: Lesson, stageId: string): number {
  return lesson.stages.findIndex((s) => s.id === stageId);
}

export function clampStageIndex(lesson: Lesson, index: number): number {
  if (!Number.isFinite(index)) return 0;
  return Math.min(Math.max(Math.trunc(index), 0), lesson.stages.length - 1);
}

export function isLastStage(lesson: Lesson, index: number): boolean {
  return index >= lesson.stages.length - 1;
}

/** Fraction of stages completed, 0–1, for the progress bar. */
export function lessonProgressRatio(lesson: Lesson, completedStageIds: string[]): number {
  if (lesson.stages.length === 0) return 0;
  const known = new Set(lesson.stages.map((s) => s.id));
  const done = new Set(completedStageIds.filter((id) => known.has(id)));
  return done.size / lesson.stages.length;
}
