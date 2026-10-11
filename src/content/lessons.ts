/** Registry of every authored lesson, keyed by concept for the Learn screen. */

import type { ConceptId, Lesson } from "./schema";
import { CP_01 } from "./mit-6041/unit-1/cp-01";

export const LESSONS: Lesson[] = [CP_01];

export const LESSONS_BY_ID = new Map(LESSONS.map((l) => [l.id, l]));

export function lessonById(id: string): Lesson | undefined {
  return LESSONS_BY_ID.get(id);
}

/** Lessons that teach a given concept. Empty until that concept is authored. */
export function lessonsForConcept(conceptId: ConceptId): Lesson[] {
  return LESSONS.filter((l) => l.conceptIds.includes(conceptId));
}

/** Concepts that currently have teachable content. */
export const TAUGHT_CONCEPT_IDS: ConceptId[] = Array.from(
  new Set(LESSONS.flatMap((l) => l.conceptIds)),
);
