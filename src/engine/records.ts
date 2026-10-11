/** Domain records that the engine reasons over and the storage layer persists. */

import type { ConceptId, Difficulty } from "../content/schema";

/** One submission of one exercise. Append-only; never rewritten in place. */
export interface AttemptRecord {
  id: string;
  exerciseId: string;
  lessonId?: string;
  conceptIds: ConceptId[];
  /** The learner's submission, as typed or as choice ids. */
  answer: string;
  correct: boolean;
  /** Submissions made on this exercise before this one landed, within a sitting. */
  attemptNumber: number;
  hintsUsed: number;
  /** Reserved for the optional tutor in phase 6; always false today. */
  aiAssisted: boolean;
  /** Wall-clock time on the exercise, milliseconds. */
  timeMs: number;
  /** Epoch milliseconds. */
  completedAt: number;
  /** Graded without hints, on the first try, on an assessment screen. */
  independent: boolean;
  difficulty: Difficulty;
  /** Version of the lesson or exercise bank that produced this item. */
  contentVersion: string;
}

/** Where a learner has reached inside a lesson. */
export interface LessonProgress {
  lessonId: string;
  /** Index of the furthest stage reached. */
  stageIndex: number;
  /** Stage ids the learner has answered or acknowledged. */
  completedStageIds: string[];
  startedAt: number;
  updatedAt: number;
  completedAt?: number;
  contentVersion: string;
}

export type ThemeChoice = "system" | "light" | "dark";

export interface ProgressState {
  /** Bumped by migrations in src/storage/migrations.ts. */
  schemaVersion: number;
  attempts: AttemptRecord[];
  lessons: Record<string, LessonProgress>;
  /** Lesson the learner was last inside, for "resume" on the dashboard. */
  lastLessonId?: string;
  theme: ThemeChoice;
  createdAt: number;
  updatedAt: number;
}
