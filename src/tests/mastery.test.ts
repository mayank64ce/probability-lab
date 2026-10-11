import { describe, expect, it } from "vitest";
import { DAY_MS, masteryState, summarizeConcept } from "../engine/masteryTracker";
import { dueReviews, nextReviewAt, weakConcepts } from "../engine/reviewScheduler";
import type { AttemptRecord } from "../engine/records";

const T0 = Date.parse("2026-01-01T12:00:00Z");

function attempt(overrides: Partial<AttemptRecord> = {}): AttemptRecord {
  return {
    id: Math.random().toString(36).slice(2),
    exerciseId: "ex",
    conceptIds: ["conditional-probability"],
    answer: "x",
    correct: true,
    attemptNumber: 1,
    hintsUsed: 0,
    aiAssisted: false,
    timeMs: 1000,
    completedAt: T0,
    independent: false,
    difficulty: 2,
    contentVersion: "1.0.0",
    ...overrides,
  };
}

describe("summarizeConcept", () => {
  it("counts only attempts tagged with the concept", () => {
    const stats = summarizeConcept("conditional-probability", [
      attempt(),
      attempt({ conceptIds: ["independence"] }),
    ]);
    expect(stats.total).toBe(1);
  });

  it("breaks the streak on a miss and resumes after it", () => {
    const stats = summarizeConcept("conditional-probability", [
      attempt({ completedAt: T0, correct: true }),
      attempt({ completedAt: T0 + 1000, correct: false }),
      attempt({ completedAt: T0 + 2000, correct: true }),
    ]);
    expect(stats.total).toBe(3);
    expect(stats.correct).toBe(2);
    expect(stats.streak).toBe(1);
    expect(stats.accuracy).toBeCloseTo(2 / 3, 10);
  });

  it("separates independent from assisted correct answers", () => {
    const stats = summarizeConcept("conditional-probability", [
      attempt({ independent: true }),
      attempt({ completedAt: T0 + 1000, independent: false, hintsUsed: 2 }),
    ]);
    expect(stats.independentCorrect).toBe(1);
    expect(stats.assistedCorrect).toBe(1);
    expect(stats.hintsUsed).toBe(2);
  });

  it("counts distinct calendar days", () => {
    const stats = summarizeConcept("conditional-probability", [
      attempt({ completedAt: T0 }),
      attempt({ completedAt: T0 + 60_000 }),
      attempt({ completedAt: T0 + 3 * DAY_MS }),
    ]);
    expect(stats.distinctDays).toBe(2);
  });

  it("returns a zeroed summary for an untouched concept", () => {
    const stats = summarizeConcept("bayes-theorem", [attempt()]);
    expect(stats.total).toBe(0);
    expect(stats.accuracy).toBe(0);
    expect(stats.lastAttemptAt).toBeUndefined();
  });
});

describe("masteryState", () => {
  it("is not-started with no attempts", () => {
    expect(masteryState(summarizeConcept("x", []), T0)).toBe("not-started");
  });

  it("never reaches proficient from one lucky answer", () => {
    const stats = summarizeConcept("conditional-probability", [attempt({ independent: true })]);
    expect(masteryState(stats, T0 + 1000)).toBe("learning");
  });

  it("moves to review-needed the moment an answer is missed", () => {
    const stats = summarizeConcept("conditional-probability", [
      attempt({ completedAt: T0, independent: true }),
      attempt({ completedAt: T0 + 1000, independent: true }),
      attempt({ completedAt: T0 + 2000, independent: true }),
      attempt({ completedAt: T0 + 3000, correct: false }),
    ]);
    expect(masteryState(stats, T0 + 4000)).toBe("review-needed");
  });

  it("reaches practicing on two correct answers, short of proficient", () => {
    const stats = summarizeConcept("conditional-probability", [
      attempt({ completedAt: T0 }),
      attempt({ completedAt: T0 + 1000 }),
    ]);
    expect(masteryState(stats, T0 + 2000)).toBe("practicing");
  });

  it("reaches proficient on three independent correct answers", () => {
    const stats = summarizeConcept("conditional-probability", [
      attempt({ completedAt: T0, independent: true }),
      attempt({ completedAt: T0 + 1000, independent: true }),
      attempt({ completedAt: T0 + 2000, independent: true }),
    ]);
    expect(masteryState(stats, T0 + 3000)).toBe("proficient");
  });

  it("withholds mastery until the concept survives a week-long gap", () => {
    const sameDay = summarizeConcept(
      "conditional-probability",
      Array.from({ length: 6 }, (_, i) =>
        attempt({ completedAt: T0 + i * 1000, independent: true }),
      ),
    );
    expect(masteryState(sameDay, T0 + 10_000)).toBe("proficient");

    const spaced = summarizeConcept("conditional-probability", [
      ...Array.from({ length: 5 }, (_, i) =>
        attempt({ completedAt: T0 + i * 1000, independent: true }),
      ),
      attempt({ completedAt: T0 + 8 * DAY_MS, independent: true }),
    ]);
    expect(masteryState(spaced, T0 + 8 * DAY_MS + 1000)).toBe("mastered");
  });

  it("sends a stale concept back for review", () => {
    const stats = summarizeConcept("conditional-probability", [
      attempt({ completedAt: T0, independent: true }),
      attempt({ completedAt: T0 + 1000, independent: true }),
      attempt({ completedAt: T0 + 2000, independent: true }),
    ]);
    expect(masteryState(stats, T0 + 20 * DAY_MS)).toBe("review-needed");
  });
});

describe("nextReviewAt", () => {
  it("has nothing to schedule for an unattempted concept", () => {
    expect(nextReviewAt(summarizeConcept("x", []))).toBeNull();
  });

  it("brings a missed concept back the next day", () => {
    const stats = summarizeConcept("conditional-probability", [
      attempt({ completedAt: T0, correct: false }),
    ]);
    expect(nextReviewAt(stats)).toBe(T0 + DAY_MS);
  });

  it("stretches the interval as the streak grows", () => {
    const build = (n: number) =>
      summarizeConcept(
        "conditional-probability",
        Array.from({ length: n }, (_, i) => attempt({ completedAt: T0 + i * 1000 })),
      );

    const one = build(1);
    expect(nextReviewAt(one)! - one.lastAttemptAt!).toBe(1 * DAY_MS);
    const two = build(2);
    expect(nextReviewAt(two)! - two.lastAttemptAt!).toBe(3 * DAY_MS);
    const three = build(3);
    expect(nextReviewAt(three)! - three.lastAttemptAt!).toBe(7 * DAY_MS);
  });

  it("costs a rung when hints were needed", () => {
    const hinted = summarizeConcept("conditional-probability", [
      attempt({ completedAt: T0, hintsUsed: 1 }),
      attempt({ completedAt: T0 + 1000, hintsUsed: 1 }),
      attempt({ completedAt: T0 + 2000, hintsUsed: 1 }),
    ]);
    // Streak of 3 would be 7 days; leaning on hints drops it to 3.
    expect(nextReviewAt(hinted)! - hinted.lastAttemptAt!).toBe(3 * DAY_MS);
  });

  it("caps at the top of the ladder", () => {
    const long = summarizeConcept(
      "conditional-probability",
      Array.from({ length: 20 }, (_, i) => attempt({ completedAt: T0 + i * 1000 })),
    );
    expect(nextReviewAt(long)! - long.lastAttemptAt!).toBe(70 * DAY_MS);
  });
});

describe("dueReviews and weakConcepts", () => {
  const attempts = [
    attempt({ conceptIds: ["conditional-probability"], completedAt: T0, correct: false }),
    attempt({ conceptIds: ["independence"], completedAt: T0, correct: true }),
  ];
  const ids = ["conditional-probability", "independence"];

  it("lists nothing before anything falls due", () => {
    expect(dueReviews(ids, attempts, T0 + 1000)).toHaveLength(0);
  });

  it("lists a missed concept once its day has passed", () => {
    const due = dueReviews(ids, attempts, T0 + DAY_MS + 1000);
    const missed = due.find((d) => d.conceptId === "conditional-probability");
    expect(missed).toBeDefined();
    expect(missed!.reason).toBe("answered-incorrectly");
  });

  it("also brings a first correct answer back after one day", () => {
    // Rung 0 of the ladder applies to a streak of one, right or wrong.
    expect(dueReviews(ids, attempts, T0 + DAY_MS - 1000)).toHaveLength(0);
    expect(dueReviews(ids, attempts, T0 + DAY_MS + 1000)).toHaveLength(2);
  });

  it("ignores concepts that were never attempted", () => {
    expect(dueReviews(["bayes-theorem"], attempts, T0 + 100 * DAY_MS)).toHaveLength(0);
  });

  it("sorts the most overdue first", () => {
    const older = [
      attempt({
        conceptIds: ["conditional-probability"],
        completedAt: T0 - 30 * DAY_MS,
        correct: false,
      }),
      attempt({ conceptIds: ["independence"], completedAt: T0 - 2 * DAY_MS, correct: false }),
    ];
    const due = dueReviews(ids, older, T0);
    expect(due[0].conceptId).toBe("conditional-probability");
  });

  it("flags a concept answered wrong as weak", () => {
    const weak = weakConcepts(ids, attempts, T0 + 1000);
    expect(weak.map((w) => w.conceptId)).toContain("conditional-probability");
  });

  it("does not call a concept weak just because it is new", () => {
    // One correct answer out of one is no evidence of weakness.
    const weak = weakConcepts(ids, attempts, T0 + 1000);
    expect(weak.map((w) => w.conceptId)).not.toContain("independence");
  });
});
