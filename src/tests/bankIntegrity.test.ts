/**
 * Guards for the practice banks.
 *
 * Same intent as `contentIntegrity` for lessons: structural rules the session
 * runner assumes, the difficulty spread the product plan specifies, and TeX
 * that actually renders.
 */

import { describe, expect, it } from "vitest";
import katex from "katex";
import { BANK_INDEX, loadAllBanks } from "../content/banks";
import { CONCEPTS_BY_ID, TOPICS_BY_ID } from "../content/curriculum";
import { loadAllLessons } from "../content/lessons";
import { validateChoice, validateNumeric } from "../engine/answerValidator";
import type { Block, Difficulty, Exercise } from "../content/schema";

const BANKS = await loadAllBanks();
const LESSONS = await loadAllLessons();

/** The spread the plan asks for, per topic bank. */
const REQUIRED_SPREAD: Record<Difficulty, number> = { 1: 3, 2: 4, 3: 3, 4: 3, 5: 2 };

function stringsIn(exercise: Exercise): string[] {
  const out: string[] = [];
  const fromBlocks = (blocks: Block[] | undefined) => {
    for (const block of blocks ?? []) {
      if (block.type === "paragraph") out.push(block.text);
      else if (block.type === "list") out.push(...block.items);
      else if (block.type === "callout") out.push(block.text, block.title ?? "");
      else if (block.type === "stats") out.push(...block.items.map((i) => `${i.label} ${i.value}`));
    }
  };
  fromBlocks(exercise.prompt);
  fromBlocks(exercise.solution);
  out.push(...exercise.hints.map((h) => h.text));
  if (exercise.kind === "multiple-choice") {
    for (const c of exercise.choices) out.push(c.label, c.misconception ?? "");
  }
  if (exercise.kind === "steps") {
    for (const step of exercise.steps) {
      fromBlocks(step.prompt);
      out.push(step.hint ?? "");
      if (step.answer.kind === "choice") out.push(...step.answer.choices.map((c) => c.label));
    }
  }
  return out.filter(Boolean);
}

function displayTex(exercise: Exercise): string[] {
  const out: string[] = [];
  const fromBlocks = (blocks: Block[] | undefined) => {
    for (const block of blocks ?? []) if (block.type === "math") out.push(block.tex);
  };
  fromBlocks(exercise.prompt);
  fromBlocks(exercise.solution);
  if (exercise.kind === "steps") for (const s of exercise.steps) fromBlocks(s.prompt);
  return out;
}

const inlineTex = (text: string) =>
  text
    .split(/(\$[^$]+\$)/g)
    .filter((p) => p.startsWith("$") && p.endsWith("$") && p.length > 2)
    .map((p) => p.slice(1, -1));

describe.each(BANKS.map((b) => [b.topicId, b] as const))("the %s bank", (_topicId, bank) => {
  it("belongs to a real curriculum topic", () => {
    expect(TOPICS_BY_ID.has(bank.topicId)).toBe(true);
  });

  it("meets the difficulty spread the plan specifies", () => {
    for (const [level, minimum] of Object.entries(REQUIRED_SPREAD)) {
      const count = bank.exercises.filter((e) => e.difficulty === Number(level)).length;
      expect(
        count,
        `difficulty ${level} has ${count}, wanted at least ${minimum}`,
      ).toBeGreaterThanOrEqual(minimum);
    }
    expect(bank.exercises.length).toBeGreaterThanOrEqual(15);
  });

  it("covers every concept in its topic", () => {
    const topic = TOPICS_BY_ID.get(bank.topicId)!;
    const covered = new Set(bank.exercises.flatMap((e) => e.conceptIds));
    for (const conceptId of topic.conceptIds) {
      expect(covered.has(conceptId), `no bank problem covers ${conceptId}`).toBe(true);
    }
  });

  it("references only concepts that exist", () => {
    for (const exercise of bank.exercises) {
      for (const id of [...exercise.conceptIds, ...(exercise.prerequisites ?? [])]) {
        expect(CONCEPTS_BY_ID.has(id), `unknown concept ${id}`).toBe(true);
      }
    }
  });

  it("gives every problem hints, a solution and an objective", () => {
    for (const exercise of bank.exercises) {
      expect(exercise.hints.length, `${exercise.id} has no hints`).toBeGreaterThan(0);
      expect(exercise.solution.length, `${exercise.id} has no solution`).toBeGreaterThan(0);
      expect(exercise.objective.length).toBeGreaterThan(0);
    }
  });

  it("gives every multiple-choice problem one answer and named misconceptions", () => {
    for (const exercise of bank.exercises) {
      if (exercise.kind !== "multiple-choice") continue;
      const correct = exercise.choices.filter((c) => c.correct);
      expect(correct.length, `${exercise.id} should have one correct choice`).toBe(1);
      expect(validateChoice([correct[0].id], exercise).correct).toBe(true);
      for (const wrong of exercise.choices.filter((c) => !c.correct)) {
        expect(
          (wrong.misconception ?? "").length,
          `${exercise.id} choice "${wrong.label}" has no misconception`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it("accepts its own answer for every numeric problem", () => {
    for (const exercise of bank.exercises) {
      if (exercise.kind !== "numeric") continue;
      const result = validateNumeric(String(exercise.value), exercise);
      expect(result.correct, `${exercise.id} rejects its own value`).toBe(true);
    }
  });

  it("makes every derivation step gradeable and self-consistent", () => {
    for (const exercise of bank.exercises) {
      if (exercise.kind !== "steps") continue;
      expect(exercise.steps.length).toBeGreaterThan(1);
      const ids = exercise.steps.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);

      for (const step of exercise.steps) {
        if (step.answer.kind === "numeric") {
          expect(
            validateNumeric(String(step.answer.value), step.answer).correct,
            `${exercise.id}/${step.id} rejects its own value`,
          ).toBe(true);
        } else {
          const correct = step.answer.choices.filter((c) => c.correct);
          expect(correct.length, `${exercise.id}/${step.id} needs one correct choice`).toBe(1);
        }
      }
    }
  });

  it("renders all of its TeX", () => {
    const render = (tex: string, display: boolean) =>
      katex.renderToString(tex, { displayMode: display, throwOnError: true, strict: false });

    for (const exercise of bank.exercises) {
      for (const tex of displayTex(exercise)) {
        expect(
          () => render(tex, true),
          `display maths failed in ${exercise.id}: ${tex}`,
        ).not.toThrow();
      }
      for (const text of stringsIn(exercise)) {
        for (const tex of inlineTex(text)) {
          expect(
            () => render(tex, false),
            `inline maths failed in ${exercise.id}: ${tex}`,
          ).not.toThrow();
        }
      }
    }
  });
});

describe("the banks as a whole", () => {
  it("keeps the metadata index in step with the banks themselves", () => {
    expect(BANK_INDEX.map((b) => b.topicId)).toEqual(BANKS.map((b) => b.topicId));
    for (const bank of BANKS) {
      const meta = BANK_INDEX.find((m) => m.topicId === bank.topicId)!;
      expect(meta.count, `${bank.topicId} count`).toBe(bank.exercises.length);
      expect(new Set(meta.conceptIds)).toEqual(
        new Set(bank.exercises.flatMap((e) => e.conceptIds)),
      );
      for (const level of [1, 2, 3, 4, 5] as Difficulty[]) {
        expect(meta.byDifficulty[level], `${bank.topicId} difficulty ${level}`).toBe(
          bank.exercises.filter((e) => e.difficulty === level).length,
        );
      }
    }
  });

  it("never reuses an exercise id, inside the banks or against the lessons", () => {
    const bankIds = BANKS.flatMap((b) => b.exercises.map((e) => e.id));
    const lessonIds = LESSONS.flatMap((l) =>
      l.stages.map((s) => s.exercise?.id).filter((id): id is string => Boolean(id)),
    );
    const all = [...bankIds, ...lessonIds];
    expect(new Set(all).size, "duplicate exercise id").toBe(all.length);
  });

  it("keeps bank problems out of the lessons", () => {
    // A bank exists to supply variation, so a problem must not simply be a
    // lesson's problem again under a different id.
    const lessonPrompts = new Set(
      LESSONS.flatMap((l) =>
        l.stages
          .map((s) => s.exercise?.prompt?.map((b) => ("text" in b ? b.text : "")).join(" "))
          .filter(Boolean),
      ),
    );
    for (const bank of BANKS) {
      for (const exercise of bank.exercises) {
        const prompt = exercise.prompt.map((b) => ("text" in b ? b.text : "")).join(" ");
        expect(lessonPrompts.has(prompt), `${exercise.id} repeats a lesson prompt`).toBe(false);
      }
    }
  });
});
