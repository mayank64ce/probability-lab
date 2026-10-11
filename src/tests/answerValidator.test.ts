import { describe, expect, it } from "vitest";
import { gcd, parseNumericInput, validateChoice, validateNumeric } from "../engine/answerValidator";
import type { MultipleChoiceExercise, NumericExercise } from "../content/schema";

const numericBase: Omit<NumericExercise, "value" | "tolerance" | "unit"> = {
  kind: "numeric",
  id: "t",
  conceptIds: ["conditional-probability"],
  objective: "test",
  difficulty: 2,
  prompt: [],
  hints: [],
  solution: [],
};

function percentExercise(overrides: Partial<NumericExercise> = {}): NumericExercise {
  return { ...numericBase, value: 20, tolerance: 0.5, unit: "percent", ...overrides };
}

function probabilityExercise(overrides: Partial<NumericExercise> = {}): NumericExercise {
  return { ...numericBase, value: 1 / 3, tolerance: 0.005, unit: "probability", ...overrides };
}

describe("parseNumericInput", () => {
  it("reads integers, decimals and leading-dot decimals", () => {
    expect(parseNumericInput("20")?.value).toBe(20);
    expect(parseNumericInput("0.25")?.value).toBe(0.25);
    expect(parseNumericInput(".5")?.value).toBe(0.5);
    expect(parseNumericInput("-0.5")?.value).toBe(-0.5);
  });

  it("strips whitespace, commas and percent signs", () => {
    expect(parseNumericInput("  20 ")?.value).toBe(20);
    expect(parseNumericInput("1,000")?.value).toBe(1000);
    const pct = parseNumericInput("20%");
    expect(pct?.value).toBe(20);
    expect(pct?.hadPercentSign).toBe(true);
  });

  it("reads fractions, including spaced ones", () => {
    const third = parseNumericInput("1/3");
    expect(third?.value).toBeCloseTo(0.333333, 5);
    expect(third?.isFraction).toBe(true);
    expect(third?.numerator).toBe(1);
    expect(third?.denominator).toBe(3);
    expect(parseNumericInput(" 4 / 12 ")?.value).toBeCloseTo(1 / 3, 10);
  });

  it("rejects input it cannot read as one number", () => {
    expect(parseNumericInput("")).toBeNull();
    expect(parseNumericInput("   ")).toBeNull();
    expect(parseNumericInput("abc")).toBeNull();
    expect(parseNumericInput("1/0")).toBeNull();
    expect(parseNumericInput("%")).toBeNull();
    expect(parseNumericInput("1/2/3")).toBeNull();
    expect(parseNumericInput("20 30")).toBeNull();
    expect(parseNumericInput("NaN")).toBeNull();
    expect(parseNumericInput("Infinity")).toBeNull();
  });
});

describe("gcd", () => {
  it("handles the usual cases and zero", () => {
    expect(gcd(4, 12)).toBe(4);
    expect(gcd(1, 3)).toBe(1);
    expect(gcd(0, 5)).toBe(5);
    expect(gcd(-4, 12)).toBe(4);
  });
});

describe("validateNumeric — percentage questions", () => {
  const exercise = percentExercise();

  it("accepts the answer with and without a percent sign", () => {
    expect(validateNumeric("20", exercise).correct).toBe(true);
    expect(validateNumeric("20%", exercise).correct).toBe(true);
    expect(validateNumeric(" 20.0 ", exercise).correct).toBe(true);
  });

  it("honours the tolerance band at both edges", () => {
    expect(validateNumeric("20.5", exercise).correct).toBe(true);
    expect(validateNumeric("19.5", exercise).correct).toBe(true);
    expect(validateNumeric("20.6", exercise).correct).toBe(false);
    expect(validateNumeric("19.4", exercise).correct).toBe(false);
  });

  it("names a unit slip instead of marking it plainly wrong", () => {
    const result = validateNumeric("0.2", exercise);
    expect(result.correct).toBe(false);
    expect(result.verdict).toBe("unit-slip");
    expect(result.message).toMatch(/percentage/i);
  });

  it("flags a percentage outside 0 to 100", () => {
    expect(validateNumeric("140", exercise).verdict).toBe("out-of-range");
    expect(validateNumeric("-5", exercise).verdict).toBe("out-of-range");
  });

  it("marks a genuinely wrong answer incorrect", () => {
    expect(validateNumeric("6", exercise).verdict).toBe("incorrect");
    expect(validateNumeric("30", exercise).verdict).toBe("incorrect");
  });

  it("reports unreadable input distinctly", () => {
    expect(validateNumeric("twenty", exercise).verdict).toBe("unparseable");
  });

  it("accepts an equivalent fraction", () => {
    expect(validateNumeric("20/1", exercise).correct).toBe(true);
  });
});

describe("validateNumeric — probability questions", () => {
  const exercise = probabilityExercise({ preferSimplified: true });

  it("accepts the simplified fraction, the decimal and the percentage form", () => {
    expect(validateNumeric("1/3", exercise).verdict).toBe("correct");
    expect(validateNumeric("0.333", exercise).correct).toBe(true);
    expect(validateNumeric("0.3333333", exercise).correct).toBe(true);
    expect(validateNumeric("33.33%", exercise).correct).toBe(true);
  });

  it("accepts an unsimplified fraction but says so", () => {
    const result = validateNumeric("4/12", exercise);
    expect(result.correct).toBe(true);
    expect(result.verdict).toBe("correct-unsimplified");
    expect(result.message).toContain("1/3");
  });

  it("does not nag when preferSimplified is off", () => {
    const relaxed = probabilityExercise({ preferSimplified: false });
    expect(validateNumeric("4/12", relaxed).verdict).toBe("correct");
  });

  it("catches the percentage-for-probability slip", () => {
    const result = validateNumeric("33.33", exercise);
    expect(result.correct).toBe(false);
    expect(result.verdict).toBe("unit-slip");
  });

  it("rejects a probability above 1", () => {
    expect(validateNumeric("4", exercise).verdict).toBe("out-of-range");
  });

  it("rejects fractions when the exercise forbids them", () => {
    const decimalsOnly = probabilityExercise({ acceptFraction: false });
    expect(validateNumeric("1/3", decimalsOnly).verdict).toBe("unparseable");
    expect(validateNumeric("0.333", decimalsOnly).correct).toBe(true);
  });

  it("marks a near miss outside tolerance as incorrect", () => {
    expect(validateNumeric("0.25", exercise).verdict).toBe("incorrect");
  });
});

describe("validateNumeric — the CP-01 answers specifically", () => {
  it("grades the factory question at 20 percent", () => {
    const factory = percentExercise({ value: 20, tolerance: 0.5 });
    // 0.06 / 0.30 = 0.2 = 20%
    expect(validateNumeric("20", factory).correct).toBe(true);
    // The two commonest wrong turns: reading 6% as conditional, or inverting.
    expect(validateNumeric("6", factory).correct).toBe(false);
    expect(validateNumeric("5", factory).correct).toBe(false);
  });

  it("grades the king question at one third", () => {
    const cards = probabilityExercise({ preferSimplified: true });
    expect(validateNumeric("1/3", cards).correct).toBe(true);
    expect(validateNumeric("4/12", cards).correct).toBe(true);
    // 4/52 is forgetting to condition; 1/4 is picking a suit.
    expect(validateNumeric("4/52", cards).correct).toBe(false);
    expect(validateNumeric("1/4", cards).correct).toBe(false);
  });
});

describe("validateChoice", () => {
  const exercise: MultipleChoiceExercise = {
    kind: "multiple-choice",
    id: "mc",
    conceptIds: ["conditional-probability"],
    objective: "test",
    difficulty: 1,
    prompt: [],
    hints: [],
    solution: [],
    choices: [
      { id: "a", label: "20%", misconception: "That is the joint probability." },
      { id: "b", label: "40%" },
      { id: "c", label: "50%", correct: true },
    ],
  };

  it("accepts the correct single choice", () => {
    const result = validateChoice(["c"], exercise);
    expect(result.correct).toBe(true);
    expect(result.message).toBeUndefined();
  });

  it("returns the misconception attached to the chosen distractor", () => {
    const result = validateChoice(["a"], exercise);
    expect(result.correct).toBe(false);
    expect(result.message).toBe("That is the joint probability.");
    expect(result.wrongIds).toEqual(["a"]);
    expect(result.missingIds).toEqual(["c"]);
  });

  it("has no message when the distractor carries none", () => {
    expect(validateChoice(["b"], exercise).message).toBeUndefined();
  });

  it("requires every correct option in multi-select", () => {
    const multi: MultipleChoiceExercise = {
      ...exercise,
      multiSelect: true,
      choices: [
        { id: "a", label: "one", correct: true },
        { id: "b", label: "two", correct: true },
        { id: "c", label: "three" },
      ],
    };
    expect(validateChoice(["a"], multi).correct).toBe(false);
    expect(validateChoice(["a", "b"], multi).correct).toBe(true);
    expect(validateChoice(["a", "b", "c"], multi).correct).toBe(false);
  });

  it("treats an empty selection as incorrect", () => {
    expect(validateChoice([], exercise).correct).toBe(false);
  });
});
