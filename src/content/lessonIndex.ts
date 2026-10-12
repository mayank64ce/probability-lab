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

/**
 * Order matters: it is the order the dashboard recommends lessons in, so it
 * follows the curriculum rather than the order the lessons were written.
 */
export const LESSON_INDEX: LessonMeta[] = [
  {
    id: "FN-01",
    title: "Listing What Can Happen",
    blurb:
      "Build the list of outcomes a probability model rests on — and see what breaks without it.",
    conceptIds: ["sample-spaces"],
    prerequisites: ["Fractions and percentages"],
    estimatedMinutes: 8,
    version: "1.0.0",
    stageIds: STAGES("fn01"),
  },
  {
    id: "FN-02",
    title: "The Three Rules Everything Rests On",
    blurb:
      "Learn the axioms as constraints — what a set of probabilities is and is not allowed to be.",
    conceptIds: ["probability-axioms"],
    prerequisites: ["Sample spaces and events"],
    estimatedMinutes: 9,
    version: "1.0.0",
    stageIds: STAGES("fn02"),
  },
  {
    id: "FN-03",
    title: "Counting Without Listing",
    blurb:
      "Count the outcomes of an experiment too large to write down — and know when order matters.",
    conceptIds: ["counting"],
    prerequisites: ["Sample spaces and events", "Probability axioms"],
    estimatedMinutes: 9,
    version: "1.0.0",
    stageIds: STAGES("fn03"),
  },
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
  {
    id: "RV-01",
    title: "Turning Outcomes Into Numbers",
    blurb: "Meet the random variable: not a number, but a rule that attaches one to every outcome.",
    conceptIds: ["discrete-random-variables"],
    prerequisites: ["Sample spaces and events"],
    estimatedMinutes: 8,
    version: "1.0.0",
    stageIds: STAGES("rv01"),
  },
  {
    id: "RV-02",
    title: "The Shape of a Random Variable",
    blurb: "Collect all the probabilities of a random variable into one object — its distribution.",
    conceptIds: ["probability-mass-functions"],
    prerequisites: ["Discrete random variables", "Probability axioms"],
    estimatedMinutes: 8,
    version: "1.0.0",
    stageIds: STAGES("rv02"),
  },
  {
    id: "RV-03",
    title: "Where the Distribution Balances",
    blurb:
      "Find the long-run average of a random variable, and see why it is rarely a value it takes.",
    conceptIds: ["expectation"],
    prerequisites: ["Probability mass functions"],
    estimatedMinutes: 9,
    version: "1.0.0",
    stageIds: STAGES("rv03"),
  },
  {
    id: "RV-04",
    title: "How Far From the Middle",
    blurb: "Measure spread, and see why two very different variables can share an average.",
    conceptIds: ["variance"],
    prerequisites: ["Expectation", "Probability mass functions"],
    estimatedMinutes: 9,
    version: "1.0.0",
    stageIds: STAGES("rv04"),
  },
  {
    id: "RV-05",
    title: "Changing the Variable",
    blurb: "Transform a random variable, and find out why the average does not transform with it.",
    conceptIds: ["functions-of-random-variables"],
    prerequisites: ["Expectation", "Probability mass functions"],
    estimatedMinutes: 9,
    version: "1.0.0",
    stageIds: STAGES("rv05"),
  },
  {
    id: "RV-06",
    title: "Two Variables at Once",
    blurb: "Describe a pair of random variables together, and recover each one from the pair.",
    conceptIds: ["joint-pmfs"],
    prerequisites: ["Probability mass functions", "Conditional probability"],
    estimatedMinutes: 9,
    version: "1.0.0",
    stageIds: STAGES("rv06"),
  },
  {
    id: "RV-07",
    title: "Averages Under a Condition",
    blurb: "Take an expectation inside a condition, then rebuild the whole average from the cases.",
    conceptIds: ["conditional-expectation-discrete"],
    prerequisites: ["Expectation", "Conditional probability", "Total probability"],
    estimatedMinutes: 9,
    version: "1.0.0",
    stageIds: STAGES("rv07"),
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
