/**
 * Independent verification of every number in the foundations and random
 * variable lessons.
 *
 * Wherever the sample space is small enough, the answer is recomputed by
 * enumerating it rather than by repeating the arithmetic the lesson states —
 * a test that restates my own working would confirm nothing.
 */

import { describe, expect, it } from "vitest";
import { FN_01 } from "../content/mit-6041/unit-1/fn-01";
import { FN_02 } from "../content/mit-6041/unit-1/fn-02";
import { FN_03 } from "../content/mit-6041/unit-1/fn-03";
import { RV_01, DIE_PMF, SUM_PMF } from "../content/mit-6041/unit-1/rv-01";
import { RV_02 } from "../content/mit-6041/unit-1/rv-02";
import { RV_03 } from "../content/mit-6041/unit-1/rv-03";
import { RV_04 } from "../content/mit-6041/unit-1/rv-04";
import { RV_05 } from "../content/mit-6041/unit-1/rv-05";
import { RV_06 } from "../content/mit-6041/unit-1/rv-06";
import { RV_07 } from "../content/mit-6041/unit-1/rv-07";
import { validateNumeric, validateChoice } from "../engine/answerValidator";
import type { Lesson, MultipleChoiceExercise, NumericExercise } from "../content/schema";

/** All 36 ordered pairs of two dice, the ground truth for most of Unit I. */
const PAIRS: [number, number][] = [];
for (let a = 1; a <= 6; a += 1) for (let b = 1; b <= 6; b += 1) PAIRS.push([a, b]);
const share = (f: (a: number, b: number) => boolean) =>
  PAIRS.filter(([a, b]) => f(a, b)).length / 36;

const choose = (n: number, k: number) => {
  let r = 1;
  for (let i = 0; i < k; i += 1) r = (r * (n - i)) / (i + 1);
  return Math.round(r);
};

function exercise(lesson: Lesson, id: string) {
  const found = lesson.stages.map((s) => s.exercise).find((e) => e?.id === id);
  if (!found) throw new Error(`no exercise ${id}`);
  return found;
}
const num = (l: Lesson, id: string) => exercise(l, id) as NumericExercise;
const mc = (l: Lesson, id: string) => exercise(l, id) as MultipleChoiceExercise;

function correctLabel(ex: MultipleChoiceExercise): string {
  const correct = ex.choices.filter((c) => c.correct);
  expect(correct).toHaveLength(1);
  expect(validateChoice([correct[0].id], ex).correct).toBe(true);
  return correct[0].label;
}

// ---------------------------------------------------------------------------

describe("FN-01 — sample spaces", () => {
  it("has 36 equally likely outcomes", () => {
    expect(PAIRS).toHaveLength(36);
    expect(new Set(PAIRS.map(String)).size).toBe(36);
    expect(correctLabel(mc(FN_01, "fn01-ex-predict"))).toBe("36");
  });

  it("offers the eleven sums and the unordered count as distractors", () => {
    const labels = mc(FN_01, "fn01-ex-predict").choices.map((c) => c.label);
    const sums = new Set(PAIRS.map(([a, b]) => a + b));
    expect(sums.size).toBe(11);
    expect(labels).toContain("11");
    // Unordered pairs: C(6,2) + 6 doubles.
    expect(choose(6, 2) + 6).toBe(21);
    expect(labels).toContain("21");
  });

  it("gives P(sum at least 10) = 1/6", () => {
    expect(share((a, b) => a + b >= 10)).toBeCloseTo(1 / 6, 12);
    expect(num(FN_01, "fn01-ex-apply").value).toBeCloseTo(1 / 6, 12);
  });

  it("gives P(different dice and even sum) = 1/3", () => {
    const exact = share((a, b) => a !== b && (a + b) % 2 === 0);
    expect(exact).toBeCloseTo(1 / 3, 12);
    const ex = num(FN_01, "fn01-ex-assess");
    expect(ex.value).toBeCloseTo(exact, 12);
    expect(ex.difficulty).toBe(4);
    // The two slips the solution names must both fail.
    expect(validateNumeric("0.5", ex).correct).toBe(false);
    expect(validateNumeric(String(5 / 18), ex).correct).toBe(false);
  });
});

describe("FN-02 — the axioms", () => {
  it("draws a union of 11 cells, not 12", () => {
    const sum7 = PAIRS.filter(([a, b]) => a + b === 7);
    const redSix = PAIRS.filter(([a]) => a === 6);
    const union = new Set([...sum7, ...redSix].map(String));
    expect(sum7).toHaveLength(6);
    expect(redSix).toHaveLength(6);
    expect(union.size).toBe(11);
    // Which is inclusion-exclusion: 6 + 6 - 1.
    const both = sum7.filter(([a, b]) => a === 6 && a + b === 7);
    expect(both).toHaveLength(1);
    expect(sum7.length + redSix.length - both.length).toBe(union.size);
  });

  it("gives P(A or B) = 0.9 when the overlap is 0.2", () => {
    expect(0.6 + 0.5 - 0.2).toBeCloseTo(0.9, 12);
    expect(num(FN_02, "fn02-ex-apply").value).toBeCloseTo(0.9, 12);
  });

  it("forces an overlap of at least 0.1", () => {
    // P(A and B) = P(A) + P(B) - P(A or B), and the union cannot exceed 1.
    expect(0.6 + 0.5 - 1).toBeCloseTo(0.1, 12);
    expect(correctLabel(mc(FN_02, "fn02-ex-reason"))).toBe("0.1");
  });

  it("gives 0.85 for the three-event union", () => {
    const exact = 3 * 0.5 - 3 * 0.25 + 0.1;
    expect(exact).toBeCloseTo(0.85, 12);
    const ex = num(FN_02, "fn02-ex-assess");
    expect(ex.value).toBeCloseTo(exact, 12);
    expect(ex.difficulty).toBe(4);
    // Stopping before adding the triple overlap back.
    expect(validateNumeric("0.75", ex).correct).toBe(false);
  });
});

describe("FN-03 — counting", () => {
  it("gives 60 ordered codes from five tiles", () => {
    const codes = new Set<string>();
    const tiles = [1, 2, 3, 4, 5];
    for (const a of tiles)
      for (const b of tiles)
        for (const c of tiles) if (a !== b && b !== c && a !== c) codes.add(`${a}${b}${c}`);
    expect(codes.size).toBe(60);
    expect(correctLabel(mc(FN_03, "fn03-ex-predict"))).toBe("60");
  });

  it("offers the with-replacement and unordered counts as distractors", () => {
    const labels = mc(FN_03, "fn03-ex-predict").choices.map((c) => c.label);
    expect(5 ** 3).toBe(125);
    expect(labels).toContain("125");
    expect(choose(5, 3)).toBe(10);
    expect(labels).toContain("10");
  });

  it("gives 56 committees of three from eight", () => {
    expect(choose(8, 3)).toBe(56);
    const ex = num(FN_03, "fn03-ex-apply");
    expect(ex.value).toBe(56);
    expect(validateNumeric("56", ex).correct).toBe(true);
    // The ordered count must not pass.
    expect(validateNumeric("336", ex).correct).toBe(false);
  });

  it("gives 10/21 for exactly two women on a committee of three", () => {
    const exact = (choose(5, 2) * choose(4, 1)) / choose(9, 3);
    expect(exact).toBeCloseTo(10 / 21, 12);
    const ex = num(FN_03, "fn03-ex-assess");
    expect(ex.value).toBeCloseTo(exact, 12);
    expect(ex.difficulty).toBe(4);
    // The slip the solution names: forgetting to fill the third seat.
    expect(validateNumeric(String(choose(5, 2) / choose(9, 3)), ex).correct).toBe(false);
  });
});

describe("RV-01 — random variables", () => {
  it("gives P(X = 5) = 1/9 for the sum", () => {
    expect(share((a, b) => a + b === 5)).toBeCloseTo(1 / 9, 12);
    expect(num(RV_01, "rv01-ex-apply").value).toBeCloseTo(1 / 9, 12);
  });

  it("gives P(max = 4) = 7/36", () => {
    const exact = share((a, b) => Math.max(a, b) === 4);
    expect(exact).toBeCloseTo(7 / 36, 12);
    // And the cumulative argument the solution uses agrees.
    expect((4 ** 2 - 3 ** 2) / 36).toBeCloseTo(exact, 12);
    const ex = num(RV_01, "rv01-ex-assess");
    expect(ex.value).toBeCloseTo(exact, 12);
    expect(ex.difficulty).toBe(4);
    // The double-count the solution warns about.
    expect(validateNumeric(String(8 / 36), ex).correct).toBe(false);
  });

  it("ships PMFs that are genuine distributions", () => {
    for (const pmf of [DIE_PMF, SUM_PMF]) {
      expect(pmf.values.reduce((s, v) => s + v.p, 0)).toBeCloseTo(1, 12);
      expect(pmf.values.every((v) => v.p >= 0)).toBe(true);
    }
    // And the sum PMF matches the dice it claims to describe.
    for (const { x, p } of SUM_PMF.values) {
      expect(p, `p(${x})`).toBeCloseTo(
        share((a, b) => a + b === x),
        12,
      );
    }
  });
});

describe("RV-02 — probability mass functions", () => {
  it("gives p(7) = 6/36 and p(4) = 1/12", () => {
    expect(share((a, b) => a + b === 7)).toBeCloseTo(6 / 36, 12);
    expect(correctLabel(mc(RV_02, "rv02-ex-predict"))).toBe("$6/36$");
    expect(share((a, b) => a + b === 4)).toBeCloseTo(1 / 12, 12);
    expect(num(RV_02, "rv02-ex-explore").value).toBeCloseTo(1 / 12, 12);
  });

  it("gives 3/8 for two heads in three fair flips", () => {
    const seqs = ["HHH", "HHT", "HTH", "HTT", "THH", "THT", "TTH", "TTT"];
    const two = seqs.filter((s) => [...s].filter((c) => c === "H").length === 2);
    expect(two).toHaveLength(3);
    expect(two.length / seqs.length).toBeCloseTo(0.375, 12);
    expect(num(RV_02, "rv02-ex-apply").value).toBeCloseTo(0.375, 12);
  });

  it("gives 0.2646 for two heads in four biased flips", () => {
    const exact = choose(4, 2) * 0.3 ** 2 * 0.7 ** 2;
    expect(exact).toBeCloseTo(0.2646, 10);
    const ex = num(RV_02, "rv02-ex-assess");
    expect(ex.value).toBeCloseTo(exact, 10);
    expect(ex.difficulty).toBe(4);
    // Forgetting the six orderings, and assuming a fair coin.
    expect(validateNumeric("0.0441", ex).correct).toBe(false);
    expect(validateNumeric(String(6 / 16), ex).correct).toBe(false);
  });
});

describe("RV-03 — expectation", () => {
  const mean = (vals: { x: number; p: number }[]) => vals.reduce((s, v) => s + v.x * v.p, 0);

  it("gives 3.5 for one fair die", () => {
    expect(mean(DIE_PMF.values)).toBeCloseTo(3.5, 12);
    expect(correctLabel(mc(RV_03, "rv03-ex-predict"))).toBe("3.5");
  });

  it("gives 0.2 expected gain on the wager", () => {
    expect(5 * 0.2 + -1 * 0.8).toBeCloseTo(0.2, 12);
    expect(num(RV_03, "rv03-ex-apply").value).toBeCloseTo(0.2, 12);
  });

  it("gives E[max] = 161/36", () => {
    // Enumerate rather than trusting the 2k-1 formula the solution derives.
    const exact = PAIRS.reduce((s, [a, b]) => s + Math.max(a, b) / 36, 0);
    expect(exact).toBeCloseTo(161 / 36, 12);
    for (let k = 1; k <= 6; k += 1) {
      expect(share((a, b) => Math.max(a, b) === k)).toBeCloseTo((2 * k - 1) / 36, 12);
    }
    const ex = num(RV_03, "rv03-ex-assess");
    expect(ex.value).toBeCloseTo(exact, 12);
    expect(ex.difficulty).toBe(4);
    expect(validateNumeric("3.5", ex).correct).toBe(false);
  });
});

describe("RV-04 — variance", () => {
  it("gives var = 35/12 for one fair die", () => {
    const m = DIE_PMF.values.reduce((s, v) => s + v.x * v.p, 0);
    const exact = DIE_PMF.values.reduce((s, v) => s + (v.x - m) ** 2 * v.p, 0);
    expect(exact).toBeCloseTo(35 / 12, 12);
    // And the computational formula agrees with the definition.
    const viaSquares = DIE_PMF.values.reduce((s, v) => s + v.x ** 2 * v.p, 0) - m ** 2;
    expect(viaSquares).toBeCloseTo(exact, 10);
    expect(num(RV_04, "rv04-ex-apply").value).toBeCloseTo(35 / 12, 12);
  });

  it("quadruples the variance when the payouts double", () => {
    expect(2 ** 2 * 4).toBe(16);
    expect(correctLabel(mc(RV_04, "rv04-ex-reason"))).toBe("16");
  });

  it("maximises p(1-p) at 0.25", () => {
    let best = 0;
    for (let p = 0; p <= 1.0001; p += 0.0005) best = Math.max(best, p * (1 - p));
    expect(best).toBeCloseTo(0.25, 6);
    const ex = num(RV_04, "rv04-ex-assess");
    expect(ex.value).toBeCloseTo(0.25, 12);
    expect(ex.difficulty).toBe(4);
  });
});

describe("RV-05 — functions of random variables", () => {
  it("gives E[X^2] = 91/6, above (E[X])^2", () => {
    const eX2 = DIE_PMF.values.reduce((s, v) => s + v.x ** 2 * v.p, 0);
    expect(eX2).toBeCloseTo(91 / 6, 12);
    expect(eX2).toBeGreaterThan(3.5 ** 2);
    // The gap really is the variance, as the debrief claims.
    expect(eX2 - 3.5 ** 2).toBeCloseTo(35 / 12, 10);
    expect(num(RV_05, "rv05-ex-apply").value).toBeCloseTo(91 / 6, 12);
    expect(correctLabel(mc(RV_05, "rv05-ex-predict"))).toBe("No — $E[X^2]$ is larger");
  });

  it("gives E|X - 7| = 35/18", () => {
    const exact = PAIRS.reduce((s, [a, b]) => s + Math.abs(a + b - 7) / 36, 0);
    expect(exact).toBeCloseTo(35 / 18, 12);
    const ex = num(RV_05, "rv05-ex-assess");
    expect(ex.value).toBeCloseTo(exact, 12);
    expect(ex.difficulty).toBe(4);
    // |E[X] - 7| = 0 is the error the solution calls out.
    expect(validateNumeric("0", ex).correct).toBe(false);
  });
});

describe("RV-06 — joint PMFs", () => {
  it("gives P(first = 3, sum = 4) = 1/36, not the product of the margins", () => {
    const joint = share((a, b) => a === 3 && a + b === 4);
    expect(joint).toBeCloseTo(1 / 36, 12);
    const product = (1 / 6) * share((a, b) => a + b === 4);
    expect(product).toBeCloseTo(1 / 72, 12);
    expect(joint).not.toBeCloseTo(product, 6);
    expect(correctLabel(mc(RV_06, "rv06-ex-predict"))).toBe("$1/36$");
  });

  it("recovers the marginal p(sum = 4) = 1/12 by summing the joint", () => {
    const summed = [1, 2, 3, 4, 5, 6].reduce(
      (s, x) => s + share((a, b) => a === x && a + b === 4),
      0,
    );
    expect(summed).toBeCloseTo(1 / 12, 12);
    expect(num(RV_06, "rv06-ex-apply").value).toBeCloseTo(1 / 12, 12);
  });

  it("gives P(first = 4 | sum = 9) = 1/4", () => {
    const nine = PAIRS.filter(([a, b]) => a + b === 9);
    expect(nine).toHaveLength(4);
    const exact = nine.filter(([a]) => a === 4).length / nine.length;
    expect(exact).toBeCloseTo(0.25, 12);
    const ex = num(RV_06, "rv06-ex-assess");
    expect(ex.value).toBeCloseTo(exact, 12);
    expect(ex.difficulty).toBe(4);
    // The unconditional p_X(4) must not pass.
    expect(validateNumeric(String(1 / 6), ex).correct).toBe(false);
  });
});

describe("RV-07 — conditional expectation", () => {
  it("gives E[X | X > 3] = 5", () => {
    const high = [4, 5, 6];
    expect(high.reduce((s, x) => s + x / high.length, 0)).toBeCloseTo(5, 12);
    expect(correctLabel(mc(RV_07, "rv07-ex-predict"))).toBe("5");
  });

  it("rebuilds 3.5 from the two halves of the die", () => {
    const low = [1, 2, 3].reduce((s, x) => s + x / 3, 0);
    const high = [4, 5, 6].reduce((s, x) => s + x / 3, 0);
    expect(low).toBeCloseTo(2, 12);
    expect(high).toBeCloseTo(5, 12);
    expect(0.5 * low + 0.5 * high).toBeCloseTo(3.5, 12);
    expect(num(RV_07, "rv07-ex-apply").value).toBeCloseTo(3.5, 12);
  });

  it("gives 11/3 for the box of two fair dice and one trick die", () => {
    const exact = (2 / 3) * 3.5 + (1 / 3) * 4;
    expect(exact).toBeCloseTo(11 / 3, 12);
    const ex = num(RV_07, "rv07-ex-assess");
    expect(ex.value).toBeCloseTo(exact, 12);
    expect(ex.difficulty).toBe(4);
    // The unweighted average the solution names as the trap.
    expect(validateNumeric("3.75", ex).correct).toBe(false);
  });
});
