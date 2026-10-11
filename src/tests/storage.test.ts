import { beforeEach, describe, expect, it } from "vitest";
import {
  STORAGE_KEY,
  coerceProgress,
  emptyProgress,
  exportProgress,
  importProgress,
  loadProgress,
  recordAttempt,
  saveProgress,
  upsertLessonProgress,
} from "../storage/progressStore";
import { CURRENT_SCHEMA_VERSION, migrate } from "../storage/migrations";
import type { AttemptRecord } from "../engine/records";

const T0 = Date.parse("2026-01-01T12:00:00Z");

function attempt(id: string): AttemptRecord {
  return {
    id,
    exerciseId: "ex",
    conceptIds: ["conditional-probability"],
    answer: "50",
    correct: true,
    attemptNumber: 1,
    hintsUsed: 0,
    aiAssisted: false,
    timeMs: 500,
    completedAt: T0,
    independent: true,
    difficulty: 2,
    contentVersion: "1.0.0",
  };
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("migrations", () => {
  it("brings unversioned state up to the current version", () => {
    const migrated = migrate({ attempts: [], lessons: {} });
    expect(migrated.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
  });

  it("leaves current-version state alone", () => {
    const state = { schemaVersion: CURRENT_SCHEMA_VERSION, attempts: [1] };
    expect(migrate(state)).toEqual(state);
  });

  it("preserves existing data while migrating", () => {
    const migrated = migrate({ attempts: [attempt("a")], theme: "dark" });
    expect((migrated.attempts as unknown[]).length).toBe(1);
    expect(migrated.theme).toBe("dark");
  });
});

describe("coerceProgress", () => {
  it("falls back to an empty state for junk", () => {
    expect(coerceProgress(null).attempts).toEqual([]);
    expect(coerceProgress("nonsense").attempts).toEqual([]);
    expect(coerceProgress(42).attempts).toEqual([]);
  });

  it("drops malformed attempt records rather than crashing", () => {
    const state = coerceProgress({
      schemaVersion: 1,
      attempts: [attempt("good"), { id: 7 }, null, { conceptIds: [] }],
      lessons: {},
    });
    expect(state.attempts).toHaveLength(1);
    expect(state.attempts[0].id).toBe("good");
  });

  it("rejects an unknown theme value", () => {
    expect(coerceProgress({ schemaVersion: 1, theme: "neon" }).theme).toBe("system");
    expect(coerceProgress({ schemaVersion: 1, theme: "dark" }).theme).toBe("dark");
  });
});

describe("load and save", () => {
  it("round-trips a state through localStorage", () => {
    const state = recordAttempt(emptyProgress(T0), attempt("a1"));
    expect(saveProgress(state)).toBe(true);
    const loaded = loadProgress();
    expect(loaded.attempts).toHaveLength(1);
    expect(loaded.attempts[0].id).toBe("a1");
  });

  it("returns an empty state when nothing is stored", () => {
    expect(loadProgress().attempts).toEqual([]);
  });

  it("survives corrupt stored JSON", () => {
    window.localStorage.setItem(STORAGE_KEY, "{not json");
    expect(loadProgress().attempts).toEqual([]);
  });
});

describe("reducers", () => {
  it("appends attempts without mutating the previous state", () => {
    const first = emptyProgress(T0);
    const second = recordAttempt(first, attempt("a1"));
    expect(first.attempts).toHaveLength(0);
    expect(second.attempts).toHaveLength(1);
  });

  it("keeps the furthest stage reached when progress moves backwards", () => {
    let state = upsertLessonProgress(emptyProgress(T0), {
      lessonId: "CP-01",
      stageIndex: 4,
      completedStageIds: ["a", "b"],
      startedAt: T0,
      updatedAt: T0,
      contentVersion: "1.0.0",
    });
    state = upsertLessonProgress(state, {
      lessonId: "CP-01",
      stageIndex: 1,
      completedStageIds: ["c"],
      startedAt: T0 + 1000,
      updatedAt: T0 + 1000,
      contentVersion: "1.0.0",
    });

    expect(state.lessons["CP-01"].stageIndex).toBe(4);
    expect(state.lessons["CP-01"].completedStageIds.sort()).toEqual(["a", "b", "c"]);
    expect(state.lessons["CP-01"].startedAt).toBe(T0);
    expect(state.lastLessonId).toBe("CP-01");
  });

  it("does not lose a completion timestamp on a later partial save", () => {
    let state = upsertLessonProgress(emptyProgress(T0), {
      lessonId: "CP-01",
      stageIndex: 5,
      completedStageIds: [],
      startedAt: T0,
      updatedAt: T0,
      completedAt: T0 + 500,
      contentVersion: "1.0.0",
    });
    state = upsertLessonProgress(state, {
      lessonId: "CP-01",
      stageIndex: 2,
      completedStageIds: [],
      startedAt: T0,
      updatedAt: T0 + 9000,
      contentVersion: "1.0.0",
    });
    expect(state.lessons["CP-01"].completedAt).toBe(T0 + 500);
  });
});

describe("export and import", () => {
  it("round-trips a backup", () => {
    const state = recordAttempt(emptyProgress(T0), attempt("a1"));
    const restored = importProgress(exportProgress(state));
    expect(restored.attempts).toHaveLength(1);
    expect(restored.attempts[0].id).toBe("a1");
  });

  it("rejects a file that is not a backup", () => {
    expect(() => importProgress('{"hello":"world"}')).toThrow(/backup/i);
    expect(() => importProgress("not json at all")).toThrow();
  });
});
