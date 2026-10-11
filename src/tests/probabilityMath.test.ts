/**
 * Independent verification of every number asserted in CP-01.
 *
 * These recompute each answer from the stated premises rather than trusting
 * the authored content, so a typo in a lesson fails the build.
 */

import { describe, expect, it } from "vitest";
import { CP_01 } from "../content/mit-6041/unit-1/cp-01";
import { validateNumeric, validateChoice } from "../engine/answerValidator";
import type { MultipleChoiceExercise, NumericExercise } from "../content/schema";

/** P(A | B) from first principles. */
function conditional(pAandB: number, pB: number): number {
  if (pB <= 0) throw new Error("conditioning on an impossible event");
  return pAandB / pB;
}

function exerciseAt(index: number) {
  const exercise = CP_01.stages[index].exercise;
  if (!exercise) throw new Error(`stage ${index} has no exercise`);
  return exercise;
}

describe("screen 1 — the class of 100", () => {
  // 100 students, 40 study mathematics, 20 study both.
  const pMath = 40 / 100;
  const pBoth = 20 / 100;

  it("gives P(physics | mathematics) = 50%", () => {
    expect(conditional(pBoth, pMath)).toBeCloseTo(0.5, 12);
  });

  it("marks 50% as the only correct choice", () => {
    const exercise = exerciseAt(0) as MultipleChoiceExercise;
    const correct = exercise.choices.filter((c) => c.correct);
    expect(correct).toHaveLength(1);
    expect(correct[0].label).toBe("50%");
    expect(validateChoice([correct[0].id], exercise).correct).toBe(true);
  });

  it("offers the joint and the marginal probability as distractors", () => {
    const labels = (exerciseAt(0) as MultipleChoiceExercise).choices.map((c) => c.label);
    expect(labels).toContain("20%"); // P(both)
    expect(labels).toContain("40%"); // P(mathematics)
  });
});

describe("screen 2 — the 20-student grid", () => {
  const config = CP_01.stages[1].visualization?.config as Record<string, number>;

  it("is a 20-student cohort", () => {
    const total = config.both + config.mathOnly + config.physicsOnly + config.neither;
    expect(total).toBe(20);
  });

  it("reproduces the same proportions as screen 1", () => {
    const total = 20;
    const math = config.both + config.mathOnly;
    const physics = config.both + config.physicsOnly;

    expect(math / total).toBeCloseTo(0.4, 12); // matches P(B) = 0.4
    expect(config.both / total).toBeCloseTo(0.2, 12); // matches P(A ∩ B) = 0.2
    expect(physics / total).toBeCloseTo(0.4, 12);
  });

  it("moves P(physics) from 40% to 50% under conditioning", () => {
    const total = 20;
    const math = config.both + config.mathOnly;
    const physics = config.both + config.physicsOnly;

    expect(physics / total).toBeCloseTo(0.4, 12);
    expect(conditional(config.both / total, math / total)).toBeCloseTo(0.5, 12);
  });
});

describe("screen 3 — the formalized values", () => {
  const config = CP_01.stages[2].visualization?.config as Record<string, number>;

  it("uses P(B) = 0.4 and P(A ∩ B) = 0.2, giving 0.5", () => {
    expect(config.pB).toBeCloseTo(0.4, 12);
    expect(config.pAB).toBeCloseTo(0.2, 12);
    expect(conditional(config.pAB, config.pB)).toBeCloseTo(0.5, 12);
  });

  it("keeps the intersection no larger than either event", () => {
    expect(config.pAB).toBeLessThanOrEqual(config.pA);
    expect(config.pAB).toBeLessThanOrEqual(config.pB);
  });

  it("refuses to condition on an impossible event", () => {
    expect(() => conditional(0.2, 0)).toThrow();
  });
});

describe("screen 4 — the factory", () => {
  // 30% from Machine A; 6% of ALL components are from A and defective.
  const pA = 0.3;
  const pAandDefective = 0.06;

  it("gives P(defective | A) = 20%", () => {
    expect(conditional(pAandDefective, pA)).toBeCloseTo(0.2, 12);
  });

  it("stores that answer as 20 in percent units", () => {
    const exercise = exerciseAt(3) as NumericExercise;
    expect(exercise.unit).toBe("percent");
    expect(exercise.value).toBeCloseTo(conditional(pAandDefective, pA) * 100, 12);
    expect(validateNumeric("20", exercise).correct).toBe(true);
  });

  it("does not accept the headline 6% figure", () => {
    expect(validateNumeric("6", exerciseAt(3) as NumericExercise).correct).toBe(false);
  });
});

describe("screen 5 — independence", () => {
  it("follows from P(A|B) = P(A) that P(A ∩ B) = P(A)P(B)", () => {
    const pA = 0.35;
    const pB = 0.4;
    const pAandB = pA * pB; // constructed to be independent
    expect(conditional(pAandB, pB)).toBeCloseTo(pA, 12);
  });

  it("names independence as the correct conclusion", () => {
    const exercise = exerciseAt(4) as MultipleChoiceExercise;
    const correct = exercise.choices.find((c) => c.correct);
    expect(correct?.label).toMatch(/independent/i);
  });

  it("is a different situation from mutual exclusivity", () => {
    // Disjoint events: P(A ∩ B) = 0, so P(A | B) = 0, not P(A).
    expect(conditional(0, 0.4)).toBe(0);
  });
});

describe("screen 6 — the card", () => {
  // Standard deck: 4 kings, 12 cards that are J, Q or K.
  const pKing = 4 / 52;
  const pFace = 12 / 52;

  it("gives P(king | J, Q or K) = 1/3", () => {
    expect(conditional(pKing, pFace)).toBeCloseTo(1 / 3, 12);
  });

  it("stores that answer as a probability, not a percentage", () => {
    const exercise = exerciseAt(5) as NumericExercise;
    expect(exercise.unit).toBe("probability");
    expect(exercise.value).toBeCloseTo(1 / 3, 12);
  });

  it("accepts every equivalent form the learner might type", () => {
    const exercise = exerciseAt(5) as NumericExercise;
    for (const input of ["1/3", "4/12", "0.333", "0.3333", "33.33%"]) {
      expect(validateNumeric(input, exercise).correct, input).toBe(true);
    }
  });

  it("rejects the unconditioned 4/52 and the suit answer 1/4", () => {
    const exercise = exerciseAt(5) as NumericExercise;
    expect(validateNumeric("4/52", exercise).correct).toBe(false);
    expect(validateNumeric("1/4", exercise).correct).toBe(false);
  });
});
