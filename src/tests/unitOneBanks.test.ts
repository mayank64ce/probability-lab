/**
 * Independent verification of every answer in the foundations and discrete
 * random variable banks, by enumeration wherever the space allows it.
 */

import { describe, expect, it } from "vitest";
import { FOUNDATIONS_BANK } from "../content/mit-6041/banks/foundations";
import { DISCRETE_RV_BANK } from "../content/mit-6041/banks/discrete-random-variables";
import { validateNumeric, validateChoice } from "../engine/answerValidator";
import type { ExerciseBank, MultipleChoiceExercise, NumericExercise } from "../content/schema";

const PAIRS: [number, number][] = [];
for (let a = 1; a <= 6; a += 1) for (let b = 1; b <= 6; b += 1) PAIRS.push([a, b]);
const share = (f: (a: number, b: number) => boolean) =>
  PAIRS.filter(([a, b]) => f(a, b)).length / 36;

const choose = (n: number, k: number) => {
  let r = 1;
  for (let i = 0; i < k; i += 1) r = (r * (n - i)) / (i + 1);
  return Math.round(r);
};

const pick = (bank: ExerciseBank, id: string) => {
  const found = bank.exercises.find((e) => e.id === id);
  if (!found) throw new Error(`no exercise ${id}`);
  return found;
};
const fnum = (id: string) => pick(FOUNDATIONS_BANK, id) as NumericExercise;
const fmc = (id: string) => pick(FOUNDATIONS_BANK, id) as MultipleChoiceExercise;
const rnum = (id: string) => pick(DISCRETE_RV_BANK, id) as NumericExercise;
const rmc = (id: string) => pick(DISCRETE_RV_BANK, id) as MultipleChoiceExercise;

function correctLabel(ex: MultipleChoiceExercise): string {
  const correct = ex.choices.filter((c) => c.correct);
  expect(correct).toHaveLength(1);
  expect(validateChoice([correct[0].id], ex).correct).toBe(true);
  return correct[0].label;
}

describe("foundations bank", () => {
  it("b04 — P(odd) on one die", () => {
    expect([1, 2, 3, 4, 5, 6].filter((f) => f % 2 === 1).length / 6).toBeCloseTo(0.5, 12);
    expect(fnum("fnd-b04").value).toBeCloseTo(0.5, 12);
  });

  it("b05 — disjoint events simply add", () => {
    expect(0.3 + 0.45).toBeCloseTo(0.75, 12);
    expect(fnum("fnd-b05").value).toBeCloseTo(0.75, 12);
  });

  it("b06 — the complement rule", () => {
    expect(1 - 0.35).toBeCloseTo(0.65, 12);
    expect(fnum("fnd-b06").value).toBeCloseTo(0.65, 12);
  });

  it("b07 — PINs with repetition", () => {
    expect(10 ** 4).toBe(10000);
    expect(fnum("fnd-b07").value).toBe(10000);
    // The without-repetition count must not pass.
    expect(validateNumeric("5040", fnum("fnd-b07")).correct).toBe(false);
  });

  it("b08 — at least one 6, by enumeration", () => {
    const exact = share((a, b) => a === 6 || b === 6);
    expect(exact).toBeCloseTo(11 / 36, 12);
    expect(exact).toBeCloseTo(1 - 25 / 36, 12);
    expect(fnum("fnd-b08").value).toBeCloseTo(exact, 12);
    // The double-count.
    expect(validateNumeric(String(12 / 36), fnum("fnd-b08")).correct).toBe(false);
  });

  it("b09 — a binomial coefficient", () => {
    expect(choose(10, 4)).toBe(210);
    expect(fnum("fnd-b09").value).toBe(210);
  });

  it("b10 — the intersection from inclusion-exclusion", () => {
    expect(0.5 + 0.4 - 0.7).toBeCloseTo(0.2, 12);
    expect(fnum("fnd-b10").value).toBeCloseTo(0.2, 12);
  });

  it("b11 — the forced overlap", () => {
    expect(0.9 + 0.8 - 1).toBeCloseTo(0.7, 12);
    expect(correctLabel(fmc("fnd-b11"))).toBe("0.7");
  });

  it("b12 — adjacent arrangements, by enumeration", () => {
    // Enumerate all 120 orderings of five people and count the adjacent ones.
    const people = ["A", "B", "c", "d", "e"];
    const perms: string[][] = [];
    const walk = (left: string[], acc: string[]) => {
      if (left.length === 0) return void perms.push(acc);
      left.forEach((x, i) => walk([...left.slice(0, i), ...left.slice(i + 1)], [...acc, x]));
    };
    walk(people, []);
    expect(perms).toHaveLength(120);
    const adjacent = perms.filter((p) => Math.abs(p.indexOf("A") - p.indexOf("B")) === 1);
    expect(adjacent).toHaveLength(48);
    expect(adjacent.length / perms.length).toBeCloseTo(2 / 5, 12);
    expect(fnum("fnd-b12").value).toBe(48);
    // Forgetting the two internal orders.
    expect(validateNumeric("24", fnum("fnd-b12")).correct).toBe(false);
  });

  it("b13 — prime sums, by enumeration", () => {
    const isPrime = (n: number) => n > 1 && [2, 3, 5, 7, 11].includes(n);
    const exact = share((a, b) => isPrime(a + b));
    expect(exact).toBeCloseTo(5 / 12, 12);
    expect(fnum("fnd-b13").value).toBeCloseTo(exact, 12);
    // Counting 9 as prime is the named slip.
    expect(share((a, b) => isPrime(a + b) || a + b === 9)).toBeCloseTo(19 / 36, 12);
    expect(validateNumeric(String(19 / 36), fnum("fnd-b13")).correct).toBe(false);
  });

  it("b14 — five distinct weekdays", () => {
    const exact = (7 * 6 * 5 * 4 * 3) / 7 ** 5;
    expect(exact).toBeCloseTo(2520 / 16807, 12);
    expect(fnum("fnd-b14").value).toBeCloseTo(exact, 12);
    expect(exact).toBeLessThan(0.2);
  });

  it("b15 — committees with an exclusion", () => {
    expect(choose(10, 4) - choose(8, 2)).toBe(182);
    // Cross-check by the three permitted cases: neither, A only, B only.
    const neither = choose(8, 4);
    const aOnly = choose(8, 3);
    const bOnly = choose(8, 3);
    expect(neither + aOnly + bOnly).toBe(182);
    expect(fnum("fnd-b15").value).toBe(182);
    expect(validateNumeric("210", fnum("fnd-b15")).correct).toBe(false);
  });
});

describe("discrete random variable bank", () => {
  it("b04 — a uniform expectation", () => {
    expect([1, 2, 3, 4].reduce((s, x) => s + x / 4, 0)).toBeCloseTo(2.5, 12);
    expect(rnum("drv-b04").value).toBeCloseTo(2.5, 12);
  });

  it("b05 — an indicator expectation is its success probability", () => {
    expect(0 * 0.3 + 1 * 0.7).toBeCloseTo(0.7, 12);
    expect(rnum("drv-b05").value).toBeCloseTo(0.7, 12);
  });

  it("b06 — three heads in three fair flips", () => {
    expect(1 / 2 ** 3).toBeCloseTo(0.125, 12);
    expect(rnum("drv-b06").value).toBeCloseTo(0.125, 12);
  });

  it("b07 — a shift leaves variance alone", () => {
    expect(rnum("drv-b07").value).toBe(9);
    // 25 would be the answer if the shift were (wrongly) squared in.
    expect(validateNumeric("25", rnum("drv-b07")).correct).toBe(false);
  });

  it("b08 — variance of a uniform on 1..4", () => {
    const vals = [1, 2, 3, 4].map((x) => ({ x, p: 0.25 }));
    const m = vals.reduce((s, v) => s + v.x * v.p, 0);
    const exact = vals.reduce((s, v) => s + (v.x - m) ** 2 * v.p, 0);
    expect(exact).toBeCloseTo(1.25, 12);
    expect(rnum("drv-b08").value).toBeCloseTo(exact, 12);
  });

  it("b09 — linearity of expectation", () => {
    expect(3 * 4 + 2).toBe(14);
    expect(rnum("drv-b09").value).toBe(14);
  });

  it("b10 — an independent joint probability", () => {
    const exact = share((a, b) => a === 2 && b === 5);
    expect(exact).toBeCloseTo(1 / 36, 12);
    expect(exact).toBeCloseTo((1 / 6) * (1 / 6), 12);
    expect(rnum("drv-b10").value).toBeCloseTo(exact, 12);
  });

  it("b11 — a non-linear transformation", () => {
    const exact = [1, 2, 3].reduce((s, x) => s + (x - 2) ** 2 / 3, 0);
    expect(exact).toBeCloseTo(2 / 3, 12);
    expect(rnum("drv-b11").value).toBeCloseTo(exact, 12);
    // g(E[X]) = 0 is the trap the solution names.
    expect(validateNumeric("0", rnum("drv-b11")).correct).toBe(false);
  });

  it("b12 — expectation conditioned on even", () => {
    expect([2, 4, 6].reduce((s, x) => s + x / 3, 0)).toBeCloseTo(4, 12);
    expect(rnum("drv-b12").value).toBeCloseTo(4, 12);
  });

  it("b13 — zero variance means constant", () => {
    expect(correctLabel(rmc("drv-b13"))).toBe("$X$ takes a single value with probability 1");
  });

  it("b14 — E[min] by enumeration, and it pairs with E[max]", () => {
    const eMin = PAIRS.reduce((s, [a, b]) => s + Math.min(a, b) / 36, 0);
    const eMax = PAIRS.reduce((s, [a, b]) => s + Math.max(a, b) / 36, 0);
    expect(eMin).toBeCloseTo(91 / 36, 12);
    // The check the solution makes: min + max = sum.
    expect(eMin + eMax).toBeCloseTo(7, 12);
    expect(rnum("drv-b14").value).toBeCloseTo(eMin, 12);
  });

  it("b15 — expectation conditioned on at least one head", () => {
    const flips = [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ];
    const heads = flips.map(([a, b]) => a + b);
    const kept = heads.filter((h) => h >= 1);
    const exact = kept.reduce((s, h) => s + h, 0) / kept.length;
    expect(exact).toBeCloseTo(4 / 3, 12);
    expect(rnum("drv-b15").value).toBeCloseTo(exact, 12);
    // The unweighted average of the surviving values.
    expect(validateNumeric("1.5", rnum("drv-b15")).correct).toBe(false);
  });
});
