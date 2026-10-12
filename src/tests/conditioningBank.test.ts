/**
 * Independent verification of every answer in the conditioning bank.
 *
 * Where the problem has a small sample space the answer is recomputed by
 * enumeration rather than by repeating my arithmetic — a test that restates
 * the formula I used would confirm nothing.
 */

import { describe, expect, it } from "vitest";
import { CONDITIONING_BANK } from "../content/mit-6041/banks/conditioning";
import { validateNumeric, validateChoice } from "../engine/answerValidator";
import type { MultipleChoiceExercise, NumericExercise, StepsExercise } from "../content/schema";

const byId = new Map(CONDITIONING_BANK.exercises.map((e) => [e.id, e]));
const num = (id: string) => byId.get(id) as NumericExercise;
const mc = (id: string) => byId.get(id) as MultipleChoiceExercise;
const steps = (id: string) => byId.get(id) as StepsExercise;

function correctLabel(id: string): string {
  const ex = mc(id);
  const correct = ex.choices.filter((c) => c.correct);
  expect(correct).toHaveLength(1);
  expect(validateChoice([correct[0].id], ex).correct).toBe(true);
  return correct[0].label;
}

describe("recognition problems", () => {
  it("names the definition of a conditional probability", () => {
    expect(correctLabel("cond-b01")).toContain("P(A \\cap B)");
    expect(correctLabel("cond-b01")).toContain("P(B)");
  });

  it("names the factorisation as the definition of independence", () => {
    expect(correctLabel("cond-b02")).toBe("$P(A \\cap B) = P(A)\\,P(B)$");
  });

  it("picks the only genuine partition of a die roll", () => {
    const faces = [1, 2, 3, 4, 5, 6];
    const even = faces.filter((f) => f % 2 === 0);
    const odd = faces.filter((f) => f % 2 === 1);
    // Disjoint and exhaustive.
    expect(even.filter((f) => odd.includes(f))).toEqual([]);
    expect([...even, ...odd].sort()).toEqual(faces);
    expect(correctLabel("cond-b03")).toBe("{even}, {odd}");
  });
});

describe("direct calculation problems", () => {
  it("b04 — divides the joint by the condition", () => {
    expect(0.12 / 0.4).toBeCloseTo(0.3, 12);
    expect(num("cond-b04").value).toBeCloseTo(0.3, 12);
  });

  it("b05 — two blue from six red and four blue", () => {
    expect((4 / 10) * (3 / 9)).toBeCloseTo(2 / 15, 12);
    expect(num("cond-b05").value).toBeCloseTo(2 / 15, 12);
    expect(validateNumeric("2/15", num("cond-b05")).correct).toBe(true);
    // With replacement would be 0.16 — must not pass.
    expect(validateNumeric("0.16", num("cond-b05")).correct).toBe(false);
  });

  it("b06 — weights two defect rates by supplier share", () => {
    expect(0.7 * 0.02 + 0.3 * 0.06).toBeCloseTo(0.032, 12);
    expect(num("cond-b06").value).toBeCloseTo(0.032, 12);
    // The unweighted average, 4%, is wrong and must be rejected.
    expect(validateNumeric("0.04", num("cond-b06")).correct).toBe(false);
  });

  it("b07 — multiplies independent probabilities", () => {
    expect(0.4 * 0.25).toBeCloseTo(0.1, 12);
    expect(num("cond-b07").value).toBeCloseTo(0.1, 12);
  });
});

describe("combined problems", () => {
  it("b08 — inverts the supplier conditional", () => {
    const evidence = 0.7 * 0.02 + 0.3 * 0.06;
    expect((0.3 * 0.06) / evidence).toBeCloseTo(9 / 16, 12);
    expect(num("cond-b08").value).toBeCloseTo(9 / 16, 12);
    // Confusing P(defect | B) with P(B | defect) gives 0.06.
    expect(validateNumeric("0.06", num("cond-b08")).correct).toBe(false);
  });

  it("b09 — the second card is an ace exactly as often as the first", () => {
    const viaPartition = (4 / 52) * (3 / 51) + (48 / 52) * (4 / 51);
    expect(viaPartition).toBeCloseTo(1 / 13, 12);
    expect(viaPartition).toBeCloseTo(4 / 52, 12);
    expect(num("cond-b09").value).toBeCloseTo(1 / 13, 12);
  });

  it("b10 — conditioning on an independent event changes nothing", () => {
    expect(((0.5 * 0.6) / 0.6).toFixed(10)).toBe((0.5).toFixed(10));
    expect(correctLabel("cond-b10")).toBe("$P(A \\mid B) = 0.5$");
  });

  it("b16 — two heads take the two-headed coin to 0.8", () => {
    const pHH = 0.5 * 0.5 ** 2 + 0.5 * 1 ** 2;
    expect(pHH).toBeCloseTo(0.625, 12);
    expect(0.5 / pHH).toBeCloseTo(0.8, 12);
    expect(num("cond-b16").value).toBeCloseTo(0.8, 12);
  });
});

describe("reasoning problems", () => {
  it("b11 — positive dependence is symmetric", () => {
    // Any joint above the independent product must raise both conditionals.
    const pA = 0.4;
    const pB = 0.5;
    const joint = 0.3; // above pA*pB = 0.2
    expect(joint).toBeGreaterThan(pA * pB);
    expect(joint / pB).toBeGreaterThan(pA);
    expect(joint / pA).toBeGreaterThan(pB);
    expect(correctLabel("cond-b11")).toBe("$P(B \\mid A) > P(B)$");
  });

  it("b12 — at least one 6 in four rolls, by the complement", () => {
    // Enumerate all 6^4 outcomes rather than trusting the formula.
    let hits = 0;
    for (let a = 1; a <= 6; a += 1)
      for (let b = 1; b <= 6; b += 1)
        for (let c = 1; c <= 6; c += 1)
          for (let d = 1; d <= 6; d += 1) if ([a, b, c, d].includes(6)) hits += 1;
    const exact = hits / 6 ** 4;
    expect(exact).toBeCloseTo(1 - (5 / 6) ** 4, 12);
    expect(exact).toBeCloseTo(671 / 1296, 12);
    expect(num("cond-b12").value).toBeCloseTo(exact, 12);
    // Adding the per-roll chances double-counts.
    expect(validateNumeric(String(4 / 6), num("cond-b12")).correct).toBe(false);
  });

  it("b13 — each derivation step is right, and they chain", () => {
    const ex = steps("cond-b13");
    const values = ex.steps.map((s) => (s.answer.kind === "numeric" ? s.answer.value : Number.NaN));
    const [pRedGivenA, pRed, posterior] = values;

    expect(pRedGivenA).toBeCloseTo(2 / 5, 12);
    expect(pRed).toBeCloseTo(0.5 * (2 / 5) + 0.5 * (4 / 5), 12);
    expect(posterior).toBeCloseTo((0.5 * pRedGivenA) / pRed, 12);
    expect(posterior).toBeCloseTo(1 / 3, 12);
  });
});

describe("transfer problems", () => {
  it("b14 — the three-card hat, counted by faces", () => {
    // Faces, not cards: each is equally likely to be the one showing.
    const faces = [
      { card: "rr", visible: "red", hidden: "red" },
      { card: "rr", visible: "red", hidden: "red" },
      { card: "rb", visible: "red", hidden: "black" },
      { card: "rb", visible: "black", hidden: "red" },
      { card: "bb", visible: "black", hidden: "black" },
      { card: "bb", visible: "black", hidden: "black" },
    ];
    const redVisible = faces.filter((f) => f.visible === "red");
    const bothRed = redVisible.filter((f) => f.hidden === "red");
    expect(redVisible).toHaveLength(3);
    expect(bothRed.length / redVisible.length).toBeCloseTo(2 / 3, 12);
    expect(num("cond-b14").value).toBeCloseTo(2 / 3, 12);
    // The intuitive 1/2 must be rejected.
    expect(validateNumeric("0.5", num("cond-b14")).correct).toBe(false);
  });

  it("b15 — two children, at least one boy", () => {
    const families = [
      ["B", "B"],
      ["B", "G"],
      ["G", "B"],
      ["G", "G"],
    ];
    const atLeastOneBoy = families.filter((f) => f.includes("B"));
    const bothBoys = atLeastOneBoy.filter((f) => f.every((c) => c === "B"));
    expect(atLeastOneBoy).toHaveLength(3);
    expect(bothBoys.length / atLeastOneBoy.length).toBeCloseTo(1 / 3, 12);
    expect(num("cond-b15").value).toBeCloseTo(1 / 3, 12);
    expect(validateNumeric("0.5", num("cond-b15")).correct).toBe(false);

    // And the contrast the solution draws: naming a specific child gives 1/2.
    const elderIsBoy = families.filter((f) => f[0] === "B");
    expect(elderIsBoy.filter((f) => f[1] === "B").length / elderIsBoy.length).toBeCloseTo(0.5, 12);
  });
});
