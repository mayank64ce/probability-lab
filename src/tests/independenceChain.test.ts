/**
 * Independent verification of every number asserted in CP-05 and CP-06.
 *
 * Both lessons turn on claims that are easy to state and easy to get subtly
 * wrong — that conditioning moves nothing, or that it moves a belief by a
 * specific amount — so each is recomputed from premises here, including the
 * cross-checks the worked solutions make in passing.
 */

import { describe, expect, it } from "vitest";
import { CP_05 } from "../content/mit-6041/unit-1/cp-05";
import { CP_06, TWO_COIN_TREE } from "../content/mit-6041/unit-1/cp-06";
import { validateNumeric, validateChoice } from "../engine/answerValidator";
import type { Lesson, MultipleChoiceExercise, NumericExercise } from "../content/schema";

function exercise(lesson: Lesson, id: string) {
  const found = lesson.stages.map((s) => s.exercise).find((e) => e?.id === id);
  if (!found) throw new Error(`no exercise ${id}`);
  return found;
}
const mc = (l: Lesson, id: string) => exercise(l, id) as MultipleChoiceExercise;
const num = (l: Lesson, id: string) => exercise(l, id) as NumericExercise;

function correctLabel(ex: MultipleChoiceExercise): string {
  const correct = ex.choices.filter((c) => c.correct);
  expect(correct).toHaveLength(1);
  expect(validateChoice([correct[0].id], ex).correct).toBe(true);
  return correct[0].label;
}

// ---------------------------------------------------------------------------
// CP-05 — independence
// ---------------------------------------------------------------------------

describe("CP-05 — two dice", () => {
  // All 36 ordered pairs are equally likely.
  const pairs = Array.from({ length: 36 }, (_, i) => [(i % 6) + 1, Math.floor(i / 6) + 1]);
  const share = (f: (a: number, b: number) => boolean) =>
    pairs.filter(([a, b]) => f(a, b)).length / 36;

  const pA = share((a) => a === 6);
  const pB = share((a, b) => a + b === 7);
  const pAB = share((a, b) => a === 6 && a + b === 7);

  it("makes 'first die is 6' and 'sum is 7' genuinely independent", () => {
    expect(pA).toBeCloseTo(1 / 6, 12);
    expect(pB).toBeCloseTo(1 / 6, 12);
    expect(pAB).toBeCloseTo(1 / 36, 12);
    expect(pAB).toBeCloseTo(pA * pB, 12);
    // Which is what the conditional form says too.
    expect(pAB / pA).toBeCloseTo(pB, 12);
  });

  it("asks the learner to predict that nothing moves", () => {
    expect(correctLabel(mc(CP_05, "cp05-ex-predict"))).toBe("Nothing — it stays at $1/6$");
  });
});

describe("CP-05 — the tree where nothing moves", () => {
  const branches = (CP_05.stages.find((s) => s.id === "cp05-explore")?.visualization?.config
    ?.branches ?? []) as { id: string; p: number; children: { id: string; p: number }[] }[];

  const defectOf = (id: string) => {
    const b = branches.find((x) => x.id === id)!;
    return b.p * b.children.find((c) => c.id === "def")!.p;
  };

  it("is a complete probability model", () => {
    expect(branches.reduce((s, b) => s + b.p, 0)).toBeCloseTo(1, 12);
    for (const b of branches) {
      expect(b.children.reduce((s, c) => s + c.p, 0)).toBeCloseTo(1, 12);
    }
  });

  it("leaves the posterior equal to the prior, which is what independence looks like", () => {
    const evidence = branches.reduce((s, b) => s + defectOf(b.id), 0);
    expect(evidence).toBeCloseTo(0.05, 12);
    for (const b of branches) {
      expect(defectOf(b.id) / evidence).toBeCloseTo(b.p, 12);
    }
  });

  it("differs from CP-04, where the posterior did move", () => {
    // Equal defect rates are precisely the condition for no movement.
    const rates = branches.map((b) => b.children.find((c) => c.id === "def")!.p);
    expect(new Set(rates).size).toBe(1);
  });
});

describe("CP-05 — applying and assessing independence", () => {
  it("gives P(A or B) = 0.65 and rejects the forgotten overlap", () => {
    const ex = num(CP_05, "cp05-ex-apply");
    expect(0.3 + 0.5 - 0.3 * 0.5).toBeCloseTo(0.65, 12);
    expect(ex.value).toBeCloseTo(0.65, 12);
    expect(validateNumeric("0.65", ex).correct).toBe(true);
    expect(validateNumeric("0.8", ex).correct).toBe(false);
  });

  it("rules out independence for disjoint events with positive probability", () => {
    expect(correctLabel(mc(CP_05, "cp05-ex-reason"))).toBe("No — never, under these conditions");
  });

  it("makes the challenge a 2-of-3 reliability problem worth 0.972", () => {
    const ex = num(CP_05, "cp05-ex-assess");
    const allThree = 0.9 ** 3;
    const exactlyOneFails = 3 * 0.1 * 0.9 ** 2;
    expect(allThree).toBeCloseTo(0.729, 12);
    expect(exactlyOneFails).toBeCloseTo(0.243, 12);
    expect(allThree + exactlyOneFails).toBeCloseTo(0.972, 12);
    expect(ex.value).toBeCloseTo(0.972, 12);
    expect(ex.difficulty).toBe(4);
    expect(validateNumeric("0.972", ex).correct).toBe(true);
    // Forgetting the system tolerates one failure, and dropping the factor of 3.
    expect(validateNumeric("0.729", ex).correct).toBe(false);
    expect(validateNumeric("0.81", ex).correct).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// CP-06 — conditional independence
// ---------------------------------------------------------------------------

describe("CP-06 — the two-coin box", () => {
  const pFair = 0.5;
  const headsFair = 0.5;
  const headsTwoHeaded = 1;

  const runOfHeads = (n: number) => pFair * headsFair ** n + (1 - pFair) * headsTwoHeaded ** n;

  it("makes the flips dependent once the coin is unknown", () => {
    const pH1 = runOfHeads(1);
    const pH1H2 = runOfHeads(2);
    expect(pH1).toBeCloseTo(0.75, 12);
    expect(pH1H2).toBeCloseTo(0.625, 12);
    // Dependent: the joint is not the product of the marginals.
    expect(pH1H2).not.toBeCloseTo(pH1 * pH1, 6);
    expect(pH1H2 / pH1).toBeCloseTo(5 / 6, 12);
  });

  it("keeps them independent once the coin is known", () => {
    expect(headsFair ** 2).toBeCloseTo(0.25, 12);
    expect(headsTwoHeaded ** 2).toBeCloseTo(1, 12);
  });

  it("predicts that the second flip becomes more likely, not less", () => {
    expect(correctLabel(mc(CP_06, "cp06-ex-predict"))).toBe("It rises");
    expect(runOfHeads(2) / runOfHeads(1)).toBeGreaterThan(runOfHeads(1));
  });

  it("shifts the posterior over the coin from 1/2 to 2/3 on one heads", () => {
    const branches = TWO_COIN_TREE.branches;
    expect(branches.reduce((s, b) => s + b.p, 0)).toBeCloseTo(1, 12);
    for (const b of branches) {
      expect(b.children.reduce((s, c) => s + c.p, 0)).toBeCloseTo(1, 12);
    }

    const heads = branches.map((b) => ({
      id: b.id,
      p: b.p * (b.children.find((c) => c.id === "h")?.p ?? 0),
    }));
    const evidence = heads.reduce((s, h) => s + h.p, 0);
    expect(evidence).toBeCloseTo(0.75, 12);
    expect(heads.find((h) => h.id === "fair")!.p / evidence).toBeCloseTo(1 / 3, 12);
    expect(heads.find((h) => h.id === "two-headed")!.p / evidence).toBeCloseTo(2 / 3, 12);

    // And that posterior reproduces P(H2 | H1) exactly.
    expect((1 / 3) * 0.5 + (2 / 3) * 1).toBeCloseTo(5 / 6, 12);
  });

  it("confirms the reverse counterexample: independent but not conditionally so", () => {
    // Two fair flips, conditioned on "the flips differ".
    const outcomes = [
      ["H", "H"],
      ["H", "T"],
      ["T", "H"],
      ["T", "T"],
    ];
    const differ = outcomes.filter(([a, b]) => a !== b);
    const pAgivenC = differ.filter(([a]) => a === "H").length / differ.length;
    const pBgivenC = differ.filter(([, b]) => b === "H").length / differ.length;
    const pABgivenC = differ.filter(([a, b]) => a === "H" && b === "H").length / differ.length;
    expect(pAgivenC).toBeCloseTo(0.5, 12);
    expect(pBgivenC).toBeCloseTo(0.5, 12);
    expect(pABgivenC).toBe(0);
    expect(pABgivenC).not.toBeCloseTo(pAgivenC * pBgivenC, 6);
  });
});

describe("CP-06 — applying and assessing conditional independence", () => {
  it("gives P(disease | two positives) = 9/13", () => {
    const ex = num(CP_06, "cp06-ex-apply");
    const evidence = 0.1 * 0.9 ** 2 + 0.9 * 0.2 ** 2;
    expect(evidence).toBeCloseTo(0.117, 12);
    expect((0.1 * 0.9 ** 2) / evidence).toBeCloseTo(9 / 13, 12);
    expect(ex.value).toBeCloseTo(9 / 13, 12);
    expect(ex.difficulty).toBe(4);
    expect(validateNumeric("9/13", ex).correct).toBe(true);
    // A single positive gives 1/3, as the solution claims.
    expect((0.1 * 0.9) / (0.1 * 0.9 + 0.9 * 0.2)).toBeCloseTo(1 / 3, 12);
  });

  it("makes the challenge a three-flip chain worth 0.9", () => {
    const ex = num(CP_06, "cp06-ex-assess");
    const run = (n: number) => 0.5 * 0.5 ** n + 0.5 * 1 ** n;
    expect(run(2)).toBeCloseTo(0.625, 12);
    expect(run(3)).toBeCloseTo(0.5625, 12);
    expect(run(3) / run(2)).toBeCloseTo(0.9, 12);
    expect(ex.value).toBeCloseTo(0.9, 12);
    expect(ex.difficulty).toBe(4);
    expect(validateNumeric("0.9", ex).correct).toBe(true);
    // The solution's cross-check: posterior on the two-headed coin is 0.8.
    expect(0.5 / run(2)).toBeCloseTo(0.8, 12);
    expect(0.8 * 1 + 0.2 * 0.5).toBeCloseTo(0.9, 12);
  });

  it("states that neither property implies the other", () => {
    expect(correctLabel(mc(CP_06, "cp06-ex-reason"))).toBe("Neither one implies the other");
  });
});
