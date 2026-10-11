/**
 * Grading for numeric and multiple-choice answers.
 *
 * Everything here is pure and side-effect free so it can be exhaustively unit
 * tested. The validator — never an AI — is the authority on correctness.
 */

import type { Choice, MultipleChoiceExercise, NumericExercise } from "../content/schema";

// ---------------------------------------------------------------------------
// Number parsing
// ---------------------------------------------------------------------------

export interface ParsedNumber {
  /** Numeric value of the digits the learner typed, ignoring any % sign. */
  value: number;
  /** True when written as "a/b". */
  isFraction: boolean;
  numerator?: number;
  denominator?: number;
  /** True when the input carried an explicit % sign. */
  hadPercentSign: boolean;
}

const DECIMAL = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;
const FRACTION = /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*\/\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))$/;

export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y > 0) {
    [x, y] = [y, x % y];
  }
  return x;
}

/**
 * Parses learner input such as "20", "20%", " 0.2 ", "1/3", "-.5", "1,000".
 * Returns null for anything it cannot read as a single number.
 */
export function parseNumericInput(raw: string): ParsedNumber | null {
  if (typeof raw !== "string") return null;

  let s = raw.trim().replace(/,/g, "");
  if (s === "") return null;

  let hadPercentSign = false;
  if (s.endsWith("%")) {
    hadPercentSign = true;
    s = s.slice(0, -1).trim();
    if (s === "") return null;
  }

  const fraction = FRACTION.exec(s);
  if (fraction) {
    const numerator = Number(fraction[1]);
    const denominator = Number(fraction[2]);
    if (!Number.isFinite(numerator) || !Number.isFinite(denominator)) return null;
    if (denominator === 0) return null;
    return {
      value: numerator / denominator,
      isFraction: true,
      numerator,
      denominator,
      hadPercentSign,
    };
  }

  if (DECIMAL.test(s)) {
    const value = Number(s);
    if (!Number.isFinite(value)) return null;
    return { value, isFraction: false, hadPercentSign };
  }

  return null;
}

// ---------------------------------------------------------------------------
// Numeric grading
// ---------------------------------------------------------------------------

export type NumericVerdict =
  "correct" | "correct-unsimplified" | "unit-slip" | "out-of-range" | "incorrect" | "unparseable";

export interface NumericResult {
  verdict: NumericVerdict;
  /** True for both plain-correct and correct-but-unsimplified answers. */
  correct: boolean;
  /** The value in the exercise's own unit, or null when unparseable. */
  parsed: number | null;
  /** Feedback specific to the verdict. Never just "wrong". */
  message?: string;
}

/**
 * Converts the learner's input into the exercise's unit.
 *
 * A bare number is read as already being in the requested unit; an explicit %
 * sign is honoured, so "0.2" answers a probability question and "20%" answers
 * a percentage question, and each is converted when it meets the other.
 */
function toExerciseUnit(parsed: ParsedNumber, unit: NumericExercise["unit"]): number {
  if (unit === "percent") {
    return parsed.value;
  }
  if (unit === "probability") {
    return parsed.hadPercentSign ? parsed.value / 100 : parsed.value;
  }
  return parsed.value;
}

/** The same magnitude expressed in the *other* unit, used to spot unit slips. */
function inOppositeUnit(parsed: ParsedNumber, unit: NumericExercise["unit"]): number | null {
  if (unit === "percent") return parsed.hadPercentSign ? null : parsed.value * 100;
  if (unit === "probability") return parsed.hadPercentSign ? null : parsed.value / 100;
  return null;
}

function outOfRange(value: number, unit: NumericExercise["unit"]): boolean {
  if (unit === "percent") return value < 0 || value > 100;
  if (unit === "probability") return value < 0 || value > 1;
  return false;
}

export function validateNumeric(raw: string, exercise: NumericExercise): NumericResult {
  const parsed = parseNumericInput(raw);
  if (!parsed) {
    return {
      verdict: "unparseable",
      correct: false,
      parsed: null,
      message: "Enter a number, a decimal, or a fraction such as 1/3.",
    };
  }

  if (parsed.isFraction && exercise.acceptFraction === false) {
    return {
      verdict: "unparseable",
      correct: false,
      parsed: null,
      message: "This answer needs to be a decimal rather than a fraction.",
    };
  }

  const value = toExerciseUnit(parsed, exercise.unit);
  const tolerance = Math.abs(exercise.tolerance);

  if (Math.abs(value - exercise.value) <= tolerance) {
    // Right number. Flag an unreduced fraction without taking the mark away.
    if (
      exercise.preferSimplified &&
      parsed.isFraction &&
      Number.isInteger(parsed.numerator) &&
      Number.isInteger(parsed.denominator) &&
      parsed.numerator !== 0 &&
      gcd(parsed.numerator!, parsed.denominator!) !== 1
    ) {
      const divisor = gcd(parsed.numerator!, parsed.denominator!);
      const n = parsed.numerator! / divisor;
      const d = parsed.denominator! / divisor;
      return {
        verdict: "correct-unsimplified",
        correct: true,
        parsed: value,
        message: `Correct. ${parsed.numerator}/${parsed.denominator} is right, and it reduces to ${n}/${d}.`,
      };
    }
    return { verdict: "correct", correct: true, parsed: value };
  }

  // Right magnitude, wrong unit — a slip worth naming rather than marking blind.
  const alternative = inOppositeUnit(parsed, exercise.unit);
  if (alternative !== null && Math.abs(alternative - exercise.value) <= tolerance) {
    return {
      verdict: "unit-slip",
      correct: false,
      parsed: value,
      message:
        exercise.unitSlipFeedback ??
        (exercise.unit === "percent"
          ? "That is the right probability, but this question asks for a percentage."
          : "That is the right percentage, but this question asks for a probability between 0 and 1."),
    };
  }

  if (outOfRange(value, exercise.unit)) {
    return {
      verdict: "out-of-range",
      correct: false,
      parsed: value,
      message:
        exercise.unit === "percent"
          ? "A probability has to land between 0% and 100%."
          : "A probability has to land between 0 and 1.",
    };
  }

  return { verdict: "incorrect", correct: false, parsed: value };
}

// ---------------------------------------------------------------------------
// Multiple-choice grading
// ---------------------------------------------------------------------------

export interface ChoiceResult {
  correct: boolean;
  /** Correct choices the learner failed to select. */
  missingIds: string[];
  /** Incorrect choices the learner selected. */
  wrongIds: string[];
  /** Misconception text attached to the first wrong choice picked. */
  message?: string;
}

export function validateChoice(
  selectedIds: string[],
  exercise: MultipleChoiceExercise,
): ChoiceResult {
  const selected = new Set(selectedIds);
  const byId = new Map<string, Choice>(exercise.choices.map((c) => [c.id, c]));

  const missingIds = exercise.choices
    .filter((c) => c.correct && !selected.has(c.id))
    .map((c) => c.id);
  const wrongIds = selectedIds.filter((id) => !byId.get(id)?.correct);

  const firstWrong = wrongIds.map((id) => byId.get(id)).find((c) => c?.misconception);

  return {
    correct: missingIds.length === 0 && wrongIds.length === 0,
    missingIds,
    wrongIds,
    message: firstWrong?.misconception,
  };
}
