/**
 * Independent verification of every number asserted in CP-02, CP-03 and CP-04.
 *
 * As with CP-01, each answer is recomputed from the stated premises rather
 * than trusted, so a typo in a lesson fails the build. The distractors are
 * checked too: a distractor is only useful if it is the number a specific
 * wrong method actually produces.
 */

import { describe, expect, it } from "vitest";
import { CP_02 } from "../content/mit-6041/unit-1/cp-02";
import { CP_03, FACTORY_TREE } from "../content/mit-6041/unit-1/cp-03";
import { CP_04 } from "../content/mit-6041/unit-1/cp-04";
import { validateNumeric, validateChoice } from "../engine/answerValidator";
import type { Lesson, MultipleChoiceExercise, NumericExercise } from "../content/schema";

function exercise(lesson: Lesson, id: string) {
  const found = lesson.stages.map((s) => s.exercise).find((e) => e?.id === id);
  if (!found) throw new Error(`no exercise ${id}`);
  return found;
}

const mc = (lesson: Lesson, id: string) => exercise(lesson, id) as MultipleChoiceExercise;
const num = (lesson: Lesson, id: string) => exercise(lesson, id) as NumericExercise;

function correctLabel(ex: MultipleChoiceExercise): string {
  const correct = ex.choices.filter((c) => c.correct);
  expect(correct).toHaveLength(1);
  expect(validateChoice([correct[0].id], ex).correct).toBe(true);
  return correct[0].label;
}

// ---------------------------------------------------------------------------
// CP-02 — the multiplication rule
// ---------------------------------------------------------------------------

describe("CP-02 — two fuses from a box of 10, three defective", () => {
  const pD1 = 3 / 10;
  const pD2givenD1 = 2 / 9;

  it("gives P(both defective) = 1/15, about 6.7%", () => {
    expect(pD1 * pD2givenD1).toBeCloseTo(1 / 15, 12);
    expect(correctLabel(mc(CP_02, "cp02-ex-predict"))).toBe("6.7%");
  });

  it("offers the with-replacement and frozen-denominator errors as distractors", () => {
    const labels = mc(CP_02, "cp02-ex-predict").choices.map((c) => c.label);
    // Treating the draws as independent: (3/10)^2 = 0.09.
    expect(pD1 * pD1).toBeCloseTo(0.09, 12);
    expect(labels).toContain("9%");
    // Shrinking the numerator but not the denominator: (3/10)(2/10) = 0.06.
    expect(pD1 * (2 / 10)).toBeCloseTo(0.06, 12);
    expect(labels).toContain("6%");
    // Stopping after the first stage.
    expect(labels).toContain("30%");
  });

  it("draws a tree whose four paths are exhaustive", () => {
    const stage = CP_02.stages.find((s) => s.id === "cp02-explore");
    const branches = (stage?.visualization?.config?.branches ?? []) as {
      p: number;
      children: { p: number }[];
    }[];
    expect(branches).toHaveLength(2);
    const total = branches.reduce(
      (sum, b) => sum + b.children.reduce((s, c) => s + b.p * c.p, 0),
      0,
    );
    expect(total).toBeCloseTo(1, 12);
  });

  it("accepts 5/14 for two red marbles from five red and three blue", () => {
    const ex = num(CP_02, "cp02-ex-apply");
    expect((5 / 8) * (4 / 7)).toBeCloseTo(5 / 14, 12);
    expect(ex.value).toBeCloseTo(5 / 14, 12);
    expect(validateNumeric("5/14", ex).correct).toBe(true);
    expect(validateNumeric("0.357", ex).correct).toBe(true);
    // The with-replacement answer (5/8)^2 must not pass.
    expect(validateNumeric(String((5 / 8) ** 2), ex).correct).toBe(false);
  });

  it("makes the challenge a stopping-rule problem worth 1/6", () => {
    const ex = num(CP_02, "cp02-ex-assess");
    // Stopping on the third test forces exactly one path: good, good, defective.
    expect((6 / 10) * (5 / 9) * (4 / 8)).toBeCloseTo(1 / 6, 12);
    expect(ex.value).toBeCloseTo(1 / 6, 12);
    expect(ex.difficulty).toBe(4);
    expect(validateNumeric("1/6", ex).correct).toBe(true);
    // Multiplying by three, as if the defective item could land anywhere.
    expect(validateNumeric("0.5", ex).correct).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// CP-03 — the total probability theorem
// ---------------------------------------------------------------------------

describe("CP-03 — three machines", () => {
  const defectiveOf = (id: string) => {
    const branch = FACTORY_TREE.branches.find((b) => b.id === id);
    if (!branch) throw new Error(`no branch ${id}`);
    const child = branch.children.find((c) => c.id === "def");
    if (!child) throw new Error(`branch ${id} has no defective child`);
    return branch.p * child.p;
  };

  it("describes a genuine partition: the machine shares sum to 1", () => {
    expect(FACTORY_TREE.branches.reduce((s, b) => s + b.p, 0)).toBeCloseTo(1, 12);
  });

  it("gives each machine a complete set of outcomes", () => {
    for (const branch of FACTORY_TREE.branches) {
      expect(branch.children.reduce((s, c) => s + c.p, 0)).toBeCloseTo(1, 12);
    }
  });

  it("gives P(defective) = 2.7%", () => {
    const total = FACTORY_TREE.branches.reduce((s, b) => s + defectiveOf(b.id), 0);
    expect(total).toBeCloseTo(0.027, 12);
    expect(correctLabel(mc(CP_03, "cp03-ex-predict"))).toBe("2.7%");
  });

  it("offers the unweighted average as the headline distractor", () => {
    const rates = FACTORY_TREE.branches.map((b) => b.children.find((c) => c.id === "def")!.p);
    const unweighted = rates.reduce((s, r) => s + r, 0) / rates.length;
    // 1%, 3% and 10% averaged flat is 4.67%, not the 2.7% weighted answer.
    expect(unweighted).toBeCloseTo(0.046667, 5);
    const labels = mc(CP_03, "cp03-ex-predict").choices.map((c) => c.label);
    expect(labels).toContain("4.7%");
    // And the straight sum of the rates.
    expect(rates.reduce((s, r) => s + r, 0)).toBeCloseTo(0.14, 12);
    expect(labels).toContain("14%");
  });

  it("gives a 7% late rate across two suppliers", () => {
    const ex = num(CP_03, "cp03-ex-apply");
    expect(0.6 * 0.05 + 0.4 * 0.1).toBeCloseTo(0.07, 12);
    expect(ex.value).toBe(7);
    expect(ex.unit).toBe("percent");
    expect(validateNumeric("7", ex).correct).toBe(true);
    // The probability, entered where a percentage was asked for.
    expect(validateNumeric("0.07", ex).verdict).toBe("unit-slip");
  });

  it("makes the challenge the discarded-ball problem, worth 3/5", () => {
    const ex = num(CP_03, "cp03-ex-assess");
    const pRed = (3 / 5) * (2 / 4) + (2 / 5) * (3 / 4);
    expect(pRed).toBeCloseTo(0.6, 12);
    // The point of the problem: an unseen removal changes nothing.
    expect(pRed).toBeCloseTo(3 / 5, 12);
    expect(ex.value).toBeCloseTo(0.6, 12);
    expect(ex.difficulty).toBe(4);
    expect(validateNumeric("3/5", ex).correct).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// CP-04 — Bayes' theorem
// ---------------------------------------------------------------------------

describe("CP-04 — reasoning backwards", () => {
  const joint = FACTORY_TREE.branches.map((b) => ({
    id: b.id,
    p: b.p * b.children.find((c) => c.id === "def")!.p,
  }));
  const evidence = joint.reduce((s, j) => s + j.p, 0);

  it("reuses the CP-03 tree unchanged", () => {
    const stage = CP_04.stages.find((s) => s.id === "cp04-explore");
    const config = stage?.visualization?.config as Record<string, unknown>;
    expect(config.branches).toBe(FACTORY_TREE.branches);
    expect(config.showShares).toBe(true);
  });

  it("gives P(Machine B | defective) = 4/9, about 44%", () => {
    const posterior = joint.find((j) => j.id === "b")!.p / evidence;
    expect(posterior).toBeCloseTo(4 / 9, 12);
    expect(correctLabel(mc(CP_04, "cp04-ex-predict"))).toBe("About 44%");
  });

  it("offers the prior, the inverted conditional and the joint as distractors", () => {
    const labels = mc(CP_04, "cp04-ex-predict").choices.map((c) => c.label);
    expect(labels).toContain("40%"); // P(B), the prior
    expect(labels).toContain("3%"); // P(defective | B), inverted
    expect(labels).toContain("1.2%"); // P(B and defective), the joint
    expect(joint.find((j) => j.id === "b")!.p).toBeCloseTo(0.012, 12);
  });

  it("makes the posteriors over all three machines sum to 1", () => {
    const total = joint.reduce((s, j) => s + j.p / evidence, 0);
    expect(total).toBeCloseTo(1, 12);
    // Machine C makes a tenth of the output but 37% of the defects.
    expect(joint.find((j) => j.id === "c")!.p / evidence).toBeCloseTo(0.37037, 4);
  });

  it("gives the screening test a posterior of 1/6", () => {
    const ex = num(CP_04, "cp04-ex-apply");
    const pPos = 0.01 * 0.99 + 0.99 * 0.05;
    expect(pPos).toBeCloseTo(0.0594, 12);
    const posterior = (0.01 * 0.99) / pPos;
    expect(posterior).toBeCloseTo(1 / 6, 12);
    expect(ex.value).toBeCloseTo(100 / 6, 1);
    expect(validateNumeric("17", ex).correct).toBe(true);
    expect(validateNumeric("16.7", ex).correct).toBe(true);
    // Reading the sensitivity as the answer is the error being targeted.
    expect(validateNumeric("99", ex).correct).toBe(false);
  });

  it("backs the claim that a 10% prevalence lifts the posterior to about 69%", () => {
    const posterior = (0.1 * 0.99) / (0.1 * 0.99 + 0.9 * 0.05);
    expect(posterior).toBeCloseTo(0.6875, 4);
    const text = JSON.stringify(mc(CP_04, "cp04-ex-reason").choices);
    expect(text).toContain("69%");
  });

  it("makes the challenge a full Bayes computation worth 8/9", () => {
    const ex = num(CP_04, "cp04-ex-assess");
    const pWord = 0.4 * 0.6 + 0.6 * 0.05;
    expect(pWord).toBeCloseTo(0.27, 12);
    expect((0.4 * 0.6) / pWord).toBeCloseTo(8 / 9, 12);
    expect(ex.value).toBeCloseTo(8 / 9, 12);
    expect(ex.difficulty).toBe(4);
    expect(validateNumeric("8/9", ex).correct).toBe(true);
    // Answering with the likelihood instead of the posterior.
    expect(validateNumeric("0.6", ex).correct).toBe(false);
  });
});
