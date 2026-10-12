/**
 * Lightweight metadata for every lesson.
 *
 * The dashboard, Learn, Practice and Review need a lesson's title, length and
 * progress — never its prose. Keeping that here, and loading stages only when
 * a lesson is opened, is what stops the initial bundle growing with the
 * curriculum: at roughly 3.6 kB gzipped of content per lesson, all 49 concepts
 * would otherwise put ~160 kB of text into first load.
 *
 * `stageIds` is included because progress is counted per stage. It is a handful
 * of short strings, not content.
 *
 * This index is written by hand and kept honest by `contentIntegrity.test.ts`,
 * which loads every lesson and fails if any field here has drifted.
 */

import type { ConceptId } from "./schema";

export interface LessonMeta {
  id: string;
  title: string;
  blurb: string;
  conceptIds: ConceptId[];
  prerequisites: string[];
  estimatedMinutes: number;
  version: string;
  stageIds: string[];
}

const STAGES = (prefix: string): string[] => [
  `${prefix}-predict`,
  `${prefix}-explore`,
  `${prefix}-formalize`,
  `${prefix}-apply`,
  `${prefix}-reason`,
  `${prefix}-assess`,
];

/** Order matters: it is the order the dashboard recommends lessons in. */
export const LESSON_INDEX: LessonMeta[] = [
  {
    id: "CP-01",
    title: "When Information Changes Probability",
    blurb:
      "Discover why learning something true can change a probability without changing the world.",
    conceptIds: ["conditional-probability"],
    prerequisites: ["Sample spaces and events", "Probability axioms", "Fractions and percentages"],
    estimatedMinutes: 8,
    version: "1.0.0",
    stageIds: STAGES("cp01"),
  },
  {
    id: "CP-02",
    title: "Walking Through an Experiment",
    blurb:
      "Chain conditional probabilities to follow a multi-stage experiment from start to finish.",
    conceptIds: ["multiplication-rule"],
    prerequisites: ["Conditional probability", "Fractions and percentages"],
    estimatedMinutes: 9,
    version: "1.0.0",
    stageIds: STAGES("cp02"),
  },
  {
    id: "CP-03",
    title: "Adding Up the Cases",
    blurb: "Build an overall probability by splitting the world into cases and weighting each one.",
    conceptIds: ["total-probability"],
    prerequisites: ["Conditional probability", "The multiplication rule"],
    estimatedMinutes: 9,
    version: "1.0.0",
    stageIds: STAGES("cp03"),
  },
  {
    id: "CP-04",
    title: "Reasoning Backwards",
    blurb: "Invert a conditional probability to infer a hidden cause from the effect you observed.",
    conceptIds: ["bayes-theorem"],
    prerequisites: ["Conditional probability", "The multiplication rule", "Total probability"],
    estimatedMinutes: 10,
    version: "1.0.0",
    stageIds: STAGES("cp04"),
  },
  {
    id: "CP-05",
    title: "When Information Tells You Nothing",
    blurb:
      "Pin down what independence really claims — and why it is not the same as being unrelated.",
    conceptIds: ["independence"],
    prerequisites: ["Conditional probability", "Bayes' theorem"],
    estimatedMinutes: 9,
    version: "1.0.0",
    stageIds: STAGES("cp05"),
  },
  {
    id: "CP-06",
    title: "Independence That Depends on What You Know",
    blurb: "See why two flips of the same coin can be dependent until you know which coin it is.",
    conceptIds: ["conditional-independence"],
    prerequisites: ["Independence", "Bayes' theorem", "Total probability"],
    estimatedMinutes: 10,
    version: "1.0.0",
    stageIds: STAGES("cp06"),
  },
];

export const LESSON_META_BY_ID = new Map(LESSON_INDEX.map((l) => [l.id, l]));

export function lessonMeta(id: string): LessonMeta | undefined {
  return LESSON_META_BY_ID.get(id);
}

/** Lessons that teach a given concept. Empty until that concept is authored. */
export function lessonsForConcept(conceptId: ConceptId): LessonMeta[] {
  return LESSON_INDEX.filter((l) => l.conceptIds.includes(conceptId));
}

/** Concepts that currently have teachable content. */
export const TAUGHT_CONCEPT_IDS: ConceptId[] = Array.from(
  new Set(LESSON_INDEX.flatMap((l) => l.conceptIds)),
);
