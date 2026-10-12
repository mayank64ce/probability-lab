/**
 * The practice selection policy.
 *
 * The product plan asks for a mix weighted towards the current topic, weak
 * concepts and older material due again. That policy is only trustworthy if it
 * is pinned down, so each weighting term is exercised separately here.
 */

import { describe, expect, it } from "vitest";
import {
  exerciseDueAt,
  planSession,
  summarizeExercise,
  SESSION_WEIGHTS,
} from "../engine/practiceSession";
import { DAY_MS } from "../engine/masteryTracker";
import type { AttemptRecord } from "../engine/records";
import type { Exercise } from "../content/schema";

const NOW = Date.UTC(2026, 0, 20);

function problem(id: string, conceptIds: string[], difficulty: 1 | 2 | 3 | 4 | 5): Exercise {
  return {
    kind: "numeric",
    id,
    conceptIds,
    objective: `objective for ${id}`,
    difficulty,
    prompt: [{ type: "paragraph", text: "x" }],
    hints: [{ text: "h" }],
    solution: [{ type: "paragraph", text: "s" }],
    value: 1,
    tolerance: 0.01,
    unit: "probability",
  };
}

function attempt(over: Partial<AttemptRecord> & { exerciseId: string }): AttemptRecord {
  return {
    id: `a-${Math.random()}`,
    lessonId: "practice",
    conceptIds: ["c1"],
    answer: "1",
    correct: true,
    attemptNumber: 1,
    hintsUsed: 0,
    aiAssisted: false,
    timeMs: 1000,
    completedAt: NOW - DAY_MS,
    independent: true,
    difficulty: 2,
    contentVersion: "bank-1",
    ...over,
  };
}

describe("summarizeExercise", () => {
  it("counts the streak back from the most recent answer", () => {
    const attempts = [
      attempt({ exerciseId: "e1", correct: true, completedAt: NOW - 5 * DAY_MS }),
      attempt({ exerciseId: "e1", correct: false, completedAt: NOW - 4 * DAY_MS }),
      attempt({ exerciseId: "e1", correct: true, completedAt: NOW - 3 * DAY_MS }),
      attempt({ exerciseId: "e1", correct: true, completedAt: NOW - 2 * DAY_MS }),
      attempt({ exerciseId: "other", correct: false, completedAt: NOW }),
    ];
    const stats = summarizeExercise("e1", attempts);
    expect(stats.total).toBe(4);
    expect(stats.correct).toBe(3);
    expect(stats.streak).toBe(2);
    expect(stats.lastAttemptAt).toBe(NOW - 2 * DAY_MS);
  });
});

describe("exerciseDueAt", () => {
  it("returns null for a problem never attempted", () => {
    expect(exerciseDueAt(summarizeExercise("unseen", []))).toBeNull();
  });

  it("brings a missed problem back the next day", () => {
    const stats = summarizeExercise("e1", [
      attempt({ exerciseId: "e1", correct: false, completedAt: NOW }),
    ]);
    expect(exerciseDueAt(stats)).toBe(NOW + DAY_MS);
  });

  it("stretches the interval with each clean recall", () => {
    const one = summarizeExercise("e1", [
      attempt({ exerciseId: "e1", correct: true, completedAt: NOW }),
    ]);
    const three = summarizeExercise("e1", [
      attempt({ exerciseId: "e1", correct: true, completedAt: NOW - 2 * DAY_MS }),
      attempt({ exerciseId: "e1", correct: true, completedAt: NOW - DAY_MS }),
      attempt({ exerciseId: "e1", correct: true, completedAt: NOW }),
    ]);
    expect(exerciseDueAt(one)).toBe(NOW + 1 * DAY_MS);
    expect(exerciseDueAt(three)).toBe(NOW + 7 * DAY_MS);
  });
});

describe("planSession", () => {
  const pool = [
    problem("p1", ["c1"], 1),
    problem("p2", ["c1"], 3),
    problem("p3", ["c2"], 2),
    problem("p4", ["c2"], 5),
  ];

  it("offers everything to a learner who has done nothing", () => {
    const set = planSession(pool, { kind: "mixed", size: 10, attempts: [], now: NOW });
    expect(set.map((e) => e.id).sort()).toEqual(["p1", "p2", "p3", "p4"]);
  });

  it("serves the gentler problems first", () => {
    const set = planSession(pool, { kind: "mixed", size: 10, attempts: [], now: NOW });
    const difficulties = set.map((e) => e.difficulty);
    expect([...difficulties].sort((a, b) => a - b)).toEqual(difficulties);
  });

  it("holds back a problem answered correctly and not yet due again", () => {
    const attempts = [attempt({ exerciseId: "p1", correct: true, completedAt: NOW })];
    const set = planSession(pool, { kind: "mixed", size: 10, attempts, now: NOW });
    expect(set.map((e) => e.id)).not.toContain("p1");
  });

  it("serves that same problem once its interval has elapsed", () => {
    const attempts = [attempt({ exerciseId: "p1", correct: true, completedAt: NOW - 2 * DAY_MS })];
    const set = planSession(pool, { kind: "mixed", size: 10, attempts, now: NOW });
    expect(set.map((e) => e.id)).toContain("p1");
  });

  it("puts a missed problem ahead of an unseen one", () => {
    const attempts = [
      attempt({
        exerciseId: "p4",
        conceptIds: ["c2"],
        correct: false,
        completedAt: NOW - 3 * DAY_MS,
      }),
    ];
    const set = planSession(pool, { kind: "mixed", size: 1, attempts, now: NOW });
    expect(set.map((e) => e.id)).toEqual(["p4"]);
    expect(SESSION_WEIGHTS.missedLastTime).toBeGreaterThan(SESSION_WEIGHTS.neverAttempted);
  });

  it("pulls in problems on a weak concept ahead of untouched ones", () => {
    // c1 answered mostly wrong: three misses, one hit.
    const attempts = [
      attempt({
        exerciseId: "x",
        conceptIds: ["c1"],
        correct: false,
        completedAt: NOW - 9 * DAY_MS,
      }),
      attempt({
        exerciseId: "y",
        conceptIds: ["c1"],
        correct: false,
        completedAt: NOW - 8 * DAY_MS,
      }),
      attempt({
        exerciseId: "z",
        conceptIds: ["c1"],
        correct: false,
        completedAt: NOW - 7 * DAY_MS,
      }),
      attempt({
        exerciseId: "w",
        conceptIds: ["c1"],
        correct: true,
        completedAt: NOW - 6 * DAY_MS,
      }),
    ];
    const set = planSession(pool, { kind: "mixed", size: 2, attempts, now: NOW });
    // Both c1 problems outrank the untouched c2 ones.
    expect(set.map((e) => e.id).sort()).toEqual(["p1", "p2"]);
  });

  it("restricts a review session to the concepts that came round", () => {
    const set = planSession(pool, {
      kind: "review",
      size: 10,
      attempts: [],
      now: NOW,
      conceptIds: ["c2"],
    });
    expect(set.map((e) => e.id).sort()).toEqual(["p3", "p4"]);
  });

  it("returns an empty set rather than padding with recently solved problems", () => {
    const attempts = pool.map((p) =>
      attempt({ exerciseId: p.id, conceptIds: p.conceptIds, correct: true, completedAt: NOW }),
    );
    expect(planSession(pool, { kind: "mixed", size: 6, attempts, now: NOW })).toEqual([]);
  });

  it("never serves more than asked for", () => {
    const set = planSession(pool, { kind: "mixed", size: 2, attempts: [], now: NOW });
    expect(set).toHaveLength(2);
  });
});
