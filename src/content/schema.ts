/**
 * Content schema for Probability Lab.
 *
 * Lessons and exercises are *data*, never components. Anything here can be
 * authored as a plain object and rendered by the generic engine, which is what
 * lets later phases add hundreds of items without touching React code.
 */

// ---------------------------------------------------------------------------
// Curriculum identity
// ---------------------------------------------------------------------------

export type UnitId = "unit-1" | "unit-2" | "unit-3" | "unit-4";

/** Stable identifier for a single teachable idea, e.g. "conditional-probability". */
export type ConceptId = string;

export interface Concept {
  id: ConceptId;
  title: string;
  unitId: UnitId;
  topicId: string;
  /** One sentence describing what the learner should be able to do. */
  objective: string;
  /** Concepts that should ideally be understood first. */
  prerequisites: ConceptId[];
}

export interface Topic {
  id: string;
  title: string;
  unitId: UnitId;
  conceptIds: ConceptId[];
}

export interface Unit {
  id: UnitId;
  /** Roman-numeral label as MIT presents it, e.g. "Unit I". */
  label: string;
  title: string;
  summary: string;
  topicIds: string[];
}

// ---------------------------------------------------------------------------
// Rich text blocks
// ---------------------------------------------------------------------------

/**
 * Inline TeX is written between single dollar signs inside `text` fields and is
 * rendered by <RichText>. Use `math` blocks for display equations.
 */
export type Block =
  | { type: "paragraph"; text: string }
  | { type: "math"; tex: string; label?: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | {
      type: "callout";
      tone: "info" | "insight" | "warning";
      title?: string;
      text: string;
    }
  | { type: "stats"; items: { label: string; value: string }[] };

// ---------------------------------------------------------------------------
// Exercises
// ---------------------------------------------------------------------------

/** 1 recognition … 5 transfer / MIT exam level. Describes reasoning demand. */
export type Difficulty = 1 | 2 | 3 | 4 | 5;

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  1: "Recognition",
  2: "Direct application",
  3: "Combined concepts",
  4: "Mathematical reasoning",
  5: "Transfer",
};

export interface Hint {
  /** Shown in order; each one is strictly more revealing than the last. */
  text: string;
}

export interface Choice {
  id: string;
  label: string;
  correct?: boolean;
  /**
   * Shown when this distractor is picked. Name the specific wrong turn, never
   * a generic "incorrect".
   */
  misconception?: string;
}

interface ExerciseBase {
  id: string;
  conceptIds: ConceptId[];
  objective: string;
  difficulty: Difficulty;
  /** Blocks rendered above the answer control. */
  prompt: Block[];
  hints: Hint[];
  /** Revealed on request, or after a correct answer. */
  solution: Block[];
  /** Concepts a learner should already hold before meeting this problem. */
  prerequisites?: ConceptId[];
  /** Attribution when a problem is adapted from an external source. */
  source?: { label: string; url?: string };
}

export interface MultipleChoiceExercise extends ExerciseBase, ChoiceSpec {
  kind: "multiple-choice";
}

/** Unit the answer is expected in; drives unit-slip detection. */
export type NumericUnit = "probability" | "percent" | "plain";

/**
 * Everything the numeric validator needs, and nothing else — so a derivation
 * step can be graded by exactly the same function as a standalone exercise.
 */
export interface NumericSpec {
  /** Canonical answer expressed in `unit`. */
  value: number;
  /** Absolute tolerance, in the same unit as `value`. */
  tolerance: number;
  unit: NumericUnit;
  /** Accept "1/3" style input in addition to decimals. Default true. */
  acceptFraction?: boolean;
  /** Nudge (not a rejection) when a correct but unreduced fraction is entered. */
  preferSimplified?: boolean;
  /** Feedback when the right number is given in the wrong unit. */
  unitSlipFeedback?: string;
  /** Short hint placed in the input, e.g. "20 or 20%". */
  placeholder?: string;
}

/** Everything the choice validator needs. */
export interface ChoiceSpec {
  choices: Choice[];
  /** When true the learner must select every correct choice. */
  multiSelect?: boolean;
}

export interface NumericExercise extends ExerciseBase, NumericSpec {
  kind: "numeric";
}

/** A learner-manipulated visualization that has a checkable end state. */
export interface VisualExercise extends ExerciseBase {
  kind: "visual";
  /** Key into the visualization registry. */
  visualization: string;
  config: Record<string, unknown>;
  /** The visualization reports a state string; this one counts as solved. */
  solvedWhen: string;
}

/**
 * One checkpoint inside a derivation. Each step is graded on its own, so a
 * learner who takes a wrong turn is corrected there rather than at the end.
 */
export interface DerivationStep {
  id: string;
  prompt: Block[];
  answer: ({ kind: "numeric" } & NumericSpec) | ({ kind: "choice" } & ChoiceSpec);
  /** Shown after a wrong attempt on this step. */
  hint?: string;
}

/** A derivation worked one checkpoint at a time. */
export interface StepsExercise extends ExerciseBase {
  kind: "steps";
  steps: DerivationStep[];
}

export type Exercise = MultipleChoiceExercise | NumericExercise | VisualExercise | StepsExercise;

/**
 * A pool of practice problems for one curriculum topic, deliberately kept
 * apart from the guided lessons: a lesson teaches an idea once, a bank gives
 * the repetition and variation that mastery actually needs.
 */
export interface ExerciseBank {
  topicId: string;
  exercises: Exercise[];
}

// ---------------------------------------------------------------------------
// Lessons
// ---------------------------------------------------------------------------

/**
 * The six-stage lesson arc. Authors may omit or merge stages: CP-01 folds its
 * hook into `predict` and ends on an unassisted `assess` screen.
 */
export type StageKind =
  "hook" | "predict" | "explore" | "formalize" | "apply" | "reflect" | "assess";

export const STAGE_LABELS: Record<StageKind, string> = {
  hook: "Hook",
  predict: "Predict",
  explore: "Explore",
  formalize: "Formalize",
  apply: "Apply",
  reflect: "Reason",
  assess: "Challenge",
};

export interface Derivation {
  title: string;
  blocks: Block[];
}

export interface LessonStage {
  id: string;
  kind: StageKind;
  title: string;
  /** Rendered before the activity. */
  intro?: Block[];
  /** Embedded interactive figure, keyed into the visualization registry. */
  visualization?: { key: string; config?: Record<string, unknown> };
  /** The activity for this screen. A stage without one is read-only. */
  exercise?: Exercise;
  /** Rendered after the learner has answered. */
  debrief?: Block[];
  /** Optional collapsed rigour, closed by default. */
  derivation?: Derivation;
  /**
   * Assessment screens record independent performance and withhold hints until
   * after the first submission.
   */
  independent?: boolean;
}

export interface ResourceLink {
  label: string;
  url: string;
  kind: "video" | "slides" | "reading" | "problems" | "solutions";
  note?: string;
}

export interface Lesson {
  id: string;
  title: string;
  /** Short line shown on cards. */
  blurb: string;
  conceptIds: ConceptId[];
  /** Human-readable prerequisite names, shown before starting. */
  prerequisites: string[];
  estimatedMinutes: number;
  /** Bumped whenever stage content changes; recorded with every attempt. */
  version: string;
  stages: LessonStage[];
  resources?: ResourceLink[];
}
