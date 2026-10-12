import { describe, expect, it } from "vitest";
import {
  canAdvance,
  clampStageIndex,
  emptyStageState,
  feedbackVisible,
  hintsAvailable,
  isLastStage,
  lessonProgressRatio,
  stageIndexById,
} from "../engine/lessonRunner";
import type { Lesson, LessonStage } from "../content/schema";
import { CP_01 } from "../content/mit-6041/unit-1/cp-01";

const readOnly: LessonStage = { id: "r", kind: "formalize", title: "Read" };

const guided: LessonStage = {
  id: "g",
  kind: "apply",
  title: "Apply",
  exercise: {
    kind: "numeric",
    id: "g-ex",
    conceptIds: ["conditional-probability"],
    objective: "o",
    difficulty: 2,
    prompt: [],
    hints: [{ text: "one" }, { text: "two" }],
    solution: [],
    value: 20,
    tolerance: 0.5,
    unit: "percent",
  },
};

const assessment: LessonStage = { ...guided, id: "a", independent: true };

describe("canAdvance", () => {
  it("lets a read-only screen through immediately", () => {
    expect(canAdvance(readOnly, emptyStageState())).toBe(true);
  });

  it("blocks a guided screen until an answer is committed", () => {
    expect(canAdvance(guided, emptyStageState())).toBe(false);
  });

  it("lets a wrong answer through on a guided screen", () => {
    expect(canAdvance(guided, { ...emptyStageState(), submitted: true, correct: false })).toBe(
      true,
    );
  });

  it("requires a correct answer, or the solution, on an assessment", () => {
    expect(canAdvance(assessment, { ...emptyStageState(), submitted: true, correct: false })).toBe(
      false,
    );
    expect(canAdvance(assessment, { ...emptyStageState(), submitted: true, correct: true })).toBe(
      true,
    );
    expect(
      canAdvance(assessment, { ...emptyStageState(), submitted: true, solutionRevealed: true }),
    ).toBe(true);
  });
});

describe("hintsAvailable", () => {
  it("offers hints straight away on a guided screen", () => {
    expect(hintsAvailable(guided, emptyStageState())).toBe(true);
  });

  it("withholds hints on an assessment until the first submission", () => {
    expect(hintsAvailable(assessment, emptyStageState())).toBe(false);
    expect(hintsAvailable(assessment, { ...emptyStageState(), attempts: 1 })).toBe(true);
  });

  it("stops once every hint is spent", () => {
    expect(hintsAvailable(guided, { ...emptyStageState(), hintsRevealed: 2 })).toBe(false);
  });

  it("offers nothing on a screen without an exercise", () => {
    expect(hintsAvailable(readOnly, emptyStageState())).toBe(false);
  });
});

describe("feedbackVisible", () => {
  it("hides feedback before the learner commits", () => {
    expect(feedbackVisible(guided, emptyStageState())).toBe(false);
    expect(feedbackVisible(guided, { ...emptyStageState(), submitted: true })).toBe(true);
  });

  it("always shows content on a read-only screen", () => {
    expect(feedbackVisible(readOnly, emptyStageState())).toBe(true);
  });
});

describe("stage indexing", () => {
  const lesson = { stages: [readOnly, guided, assessment] } as Lesson;

  it("clamps out-of-range indices", () => {
    expect(clampStageIndex(lesson, -5)).toBe(0);
    expect(clampStageIndex(lesson, 99)).toBe(2);
    expect(clampStageIndex(lesson, Number.NaN)).toBe(0);
    expect(clampStageIndex(lesson, 1.7)).toBe(1);
  });

  it("finds a stage by id and detects the last one", () => {
    expect(stageIndexById(lesson, "g")).toBe(1);
    expect(stageIndexById(lesson, "missing")).toBe(-1);
    expect(isLastStage(lesson, 2)).toBe(true);
    expect(isLastStage(lesson, 1)).toBe(false);
  });

  it("measures progress and ignores unknown stage ids", () => {
    const stageIds = lesson.stages.map((s) => s.id);
    expect(lessonProgressRatio(stageIds, [])).toBe(0);
    expect(lessonProgressRatio(stageIds, ["r", "g", "a"])).toBe(1);
    expect(lessonProgressRatio(stageIds, ["r", "r", "bogus"])).toBeCloseTo(1 / 3, 10);
  });
});

describe("CP-01 structure", () => {
  it("has six screens in the intended arc", () => {
    expect(CP_01.stages).toHaveLength(6);
    expect(CP_01.stages.map((s) => s.kind)).toEqual([
      "predict",
      "explore",
      "formalize",
      "apply",
      "reflect",
      "assess",
    ]);
  });

  it("ends on an unassisted assessment", () => {
    const last = CP_01.stages[CP_01.stages.length - 1];
    expect(last.independent).toBe(true);
    expect(hintsAvailable(last, emptyStageState())).toBe(false);
  });

  it("gives every exercise hints, a solution and a difficulty", () => {
    for (const stage of CP_01.stages) {
      if (!stage.exercise) continue;
      expect(stage.exercise.hints.length).toBeGreaterThan(0);
      expect(stage.exercise.solution.length).toBeGreaterThan(0);
      expect(stage.exercise.difficulty).toBeGreaterThanOrEqual(1);
      expect(stage.exercise.conceptIds.length).toBeGreaterThan(0);
    }
  });

  it("uses unique stage and exercise ids", () => {
    const stageIds = CP_01.stages.map((s) => s.id);
    expect(new Set(stageIds).size).toBe(stageIds.length);
    const exerciseIds = CP_01.stages.flatMap((s) => (s.exercise ? [s.exercise.id] : []));
    expect(new Set(exerciseIds).size).toBe(exerciseIds.length);
  });

  it("offers exactly one correct choice on each multiple-choice screen", () => {
    for (const stage of CP_01.stages) {
      if (stage.exercise?.kind !== "multiple-choice") continue;
      expect(stage.exercise.choices.filter((c) => c.correct).length).toBe(1);
      // Every distractor should teach something, not just be wrong.
      for (const choice of stage.exercise.choices.filter((c) => !c.correct)) {
        expect(choice.misconception, `${stage.id}/${choice.id}`).toBeTruthy();
      }
    }
  });
});
