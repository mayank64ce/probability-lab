/**
 * Guards that apply to every lesson, present and future.
 *
 * Phase 1 verified CP-01's arithmetic by hand. These checks are the part that
 * has to scale: structural rules the engine assumes, and TeX that actually
 * renders. A lesson that breaks one of them fails the build rather than
 * reaching a learner.
 */

import { describe, expect, it } from "vitest";
import katex from "katex";
import { LESSON_INDEX, loadAllLessons } from "../content/lessons";
import { CONCEPTS_BY_ID } from "../content/curriculum";
import type { Block, Lesson } from "../content/schema";

// Stages live in their own chunks now, so they are awaited once up front.
const LESSONS = await loadAllLessons();

/** Every human-readable string in a lesson, wherever it is nested. */
function stringsIn(lesson: Lesson): string[] {
  const out: string[] = [];

  const fromBlocks = (blocks: Block[] | undefined) => {
    for (const block of blocks ?? []) {
      if (block.type === "paragraph") out.push(block.text);
      else if (block.type === "list") out.push(...block.items);
      else if (block.type === "callout") out.push(block.text, block.title ?? "");
      else if (block.type === "stats") out.push(...block.items.map((i) => `${i.label} ${i.value}`));
    }
  };

  for (const stage of lesson.stages) {
    fromBlocks(stage.intro);
    fromBlocks(stage.debrief);
    fromBlocks(stage.derivation?.blocks);
    const exercise = stage.exercise;
    if (!exercise) continue;
    fromBlocks(exercise.prompt);
    fromBlocks(exercise.solution);
    out.push(...exercise.hints.map((h) => h.text));
    if (exercise.kind === "multiple-choice") {
      for (const choice of exercise.choices) out.push(choice.label, choice.misconception ?? "");
    }
    if (exercise.kind === "numeric") out.push(exercise.unitSlipFeedback ?? "");
  }
  return out.filter(Boolean);
}

/** Display maths, collected separately because it renders in display mode. */
function displayTex(lesson: Lesson): string[] {
  const out: string[] = [];
  const fromBlocks = (blocks: Block[] | undefined) => {
    for (const block of blocks ?? []) if (block.type === "math") out.push(block.tex);
  };
  for (const stage of lesson.stages) {
    fromBlocks(stage.intro);
    fromBlocks(stage.debrief);
    fromBlocks(stage.derivation?.blocks);
    fromBlocks(stage.exercise?.prompt);
    fromBlocks(stage.exercise?.solution);
  }
  return out;
}

/** Inline spans, matching the splitter in RichText. */
function inlineTex(text: string): string[] {
  return text
    .split(/(\$[^$]+\$)/g)
    .filter((p) => p.startsWith("$") && p.endsWith("$") && p.length > 2)
    .map((p) => p.slice(1, -1));
}

describe.each(LESSONS.map((l) => [l.id, l] as const))("%s", (_id, lesson) => {
  it("has a unique, non-empty id for every stage", () => {
    const ids = lesson.stages.map((s) => s.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("teaches concepts that exist in the curriculum", () => {
    for (const conceptId of lesson.conceptIds) {
      expect(CONCEPTS_BY_ID.has(conceptId), `unknown concept ${conceptId}`).toBe(true);
    }
    for (const stage of lesson.stages) {
      for (const conceptId of stage.exercise?.conceptIds ?? []) {
        expect(CONCEPTS_BY_ID.has(conceptId), `unknown concept ${conceptId}`).toBe(true);
      }
    }
  });

  it("ends on an unassisted challenge", () => {
    const last = lesson.stages[lesson.stages.length - 1];
    expect(last.independent).toBe(true);
    expect(last.exercise).toBeDefined();
  });

  it("gives every exercise hints and a worked solution", () => {
    for (const stage of lesson.stages) {
      const exercise = stage.exercise;
      if (!exercise) continue;
      expect(exercise.hints.length, `${exercise.id} has no hints`).toBeGreaterThan(0);
      expect(exercise.solution.length, `${exercise.id} has no solution`).toBeGreaterThan(0);
      expect(exercise.objective.length).toBeGreaterThan(0);
    }
  });

  it("gives every multiple-choice question exactly one correct answer and named misconceptions", () => {
    for (const stage of lesson.stages) {
      const exercise = stage.exercise;
      if (exercise?.kind !== "multiple-choice") continue;
      const correct = exercise.choices.filter((c) => c.correct);
      if (exercise.multiSelect !== true) {
        expect(correct.length, `${exercise.id} should have one correct choice`).toBe(1);
      }
      for (const choice of exercise.choices.filter((c) => !c.correct)) {
        expect(
          (choice.misconception ?? "").length,
          `${exercise.id} choice "${choice.label}" has no misconception text`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it("renders all of its TeX", () => {
    const render = (tex: string, display: boolean) =>
      katex.renderToString(tex, { displayMode: display, throwOnError: true, strict: false });

    for (const tex of displayTex(lesson)) {
      expect(() => render(tex, true), `display maths failed: ${tex}`).not.toThrow();
    }
    for (const text of stringsIn(lesson)) {
      for (const tex of inlineTex(text)) {
        expect(() => render(tex, false), `inline maths failed: ${tex}`).not.toThrow();
      }
    }
  });

  it("links only to MIT OpenCourseWare over https", () => {
    for (const resource of lesson.resources ?? []) {
      expect(resource.url).toMatch(/^https:\/\/ocw\.mit\.edu\//);
    }
  });
});

describe("the lesson set as a whole", () => {
  it("keeps the metadata index in step with the lessons themselves", () => {
    expect(LESSON_INDEX.map((m) => m.id)).toEqual(LESSONS.map((l) => l.id));

    for (const lesson of LESSONS) {
      const meta = LESSON_INDEX.find((m) => m.id === lesson.id);
      expect(meta, `no index entry for ${lesson.id}`).toBeDefined();
      expect(meta).toMatchObject({
        id: lesson.id,
        title: lesson.title,
        blurb: lesson.blurb,
        conceptIds: lesson.conceptIds,
        prerequisites: lesson.prerequisites,
        estimatedMinutes: lesson.estimatedMinutes,
        version: lesson.version,
        stageIds: lesson.stages.map((s) => s.id),
      });
    }
  });

  it("has unique lesson ids", () => {
    const ids = LESSONS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has unique exercise ids across every lesson", () => {
    const ids = LESSONS.flatMap((l) =>
      l.stages.map((s) => s.exercise?.id).filter((id): id is string => Boolean(id)),
    );
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("stays inside the 5–10 minute session budget", () => {
    for (const lesson of LESSONS) {
      expect(lesson.estimatedMinutes).toBeGreaterThanOrEqual(5);
      expect(lesson.estimatedMinutes).toBeLessThanOrEqual(10);
    }
  });

  it("ends every lesson on a challenge at least as demanding as its earlier work", () => {
    for (const lesson of LESSONS) {
      const assess = lesson.stages[lesson.stages.length - 1].exercise;
      expect(assess, `${lesson.id} has no final exercise`).toBeDefined();
      // CP-01's challenge is the one specified verbatim in the product plan.
      const floor = lesson.id === "CP-01" ? 2 : 4;
      expect(assess!.difficulty, `${lesson.id} challenge is too easy`).toBeGreaterThanOrEqual(
        floor,
      );
    }
  });

  /**
   * TeX backslashes must be written "\\" in a TypeScript string. A lone
   * backslash is swallowed by the string literal — "\;" silently becomes ";"
   * and "\frac" becomes a formfeed — which renders wrong without ever failing.
   */
  it("escapes every TeX backslash in the content source", () => {
    // Vite's raw glob rather than node:fs, so the app keeps browser-only types.
    const sources = import.meta.glob("../content/mit-6041/**/*.ts", {
      query: "?raw",
      import: "default",
      eager: true,
    }) as Record<string, string>;

    expect(Object.keys(sources).length).toBeGreaterThan(0);

    const offenders: string[] = [];
    for (const [path, source] of Object.entries(sources)) {
      source.split("\n").forEach((line, i) => {
        // Ignore \' and \" which are ordinary quote escaping.
        if (/(?<!\\)\\(?!\\|'|")/.test(line)) offenders.push(`${path}:${i + 1}: ${line.trim()}`);
      });
    }
    expect(offenders).toEqual([]);
  });
});
