/**
 * Lesson loading.
 *
 * Metadata is always available synchronously from `lessonIndex.ts`; the stages
 * themselves arrive through a dynamic import, so opening CP-04 never downloads
 * CP-01's prose. Vite turns each entry below into its own chunk.
 */

import type { Lesson } from "./schema";

const LOADERS: Record<string, () => Promise<Lesson>> = {
  "FN-01": () => import("./mit-6041/unit-1/fn-01").then((m) => m.FN_01),
  "FN-02": () => import("./mit-6041/unit-1/fn-02").then((m) => m.FN_02),
  "FN-03": () => import("./mit-6041/unit-1/fn-03").then((m) => m.FN_03),
  "CP-01": () => import("./mit-6041/unit-1/cp-01").then((m) => m.CP_01),
  "CP-02": () => import("./mit-6041/unit-1/cp-02").then((m) => m.CP_02),
  "CP-03": () => import("./mit-6041/unit-1/cp-03").then((m) => m.CP_03),
  "CP-04": () => import("./mit-6041/unit-1/cp-04").then((m) => m.CP_04),
  "CP-05": () => import("./mit-6041/unit-1/cp-05").then((m) => m.CP_05),
  "CP-06": () => import("./mit-6041/unit-1/cp-06").then((m) => m.CP_06),
  "RV-01": () => import("./mit-6041/unit-1/rv-01").then((m) => m.RV_01),
  "RV-02": () => import("./mit-6041/unit-1/rv-02").then((m) => m.RV_02),
  "RV-03": () => import("./mit-6041/unit-1/rv-03").then((m) => m.RV_03),
  "RV-04": () => import("./mit-6041/unit-1/rv-04").then((m) => m.RV_04),
  "RV-05": () => import("./mit-6041/unit-1/rv-05").then((m) => m.RV_05),
  "RV-06": () => import("./mit-6041/unit-1/rv-06").then((m) => m.RV_06),
  "RV-07": () => import("./mit-6041/unit-1/rv-07").then((m) => m.RV_07),
};

/** Resolves to the full lesson, or undefined when no such lesson is published. */
export function loadLesson(id: string): Promise<Lesson> | undefined {
  return LOADERS[id]?.();
}

/** Every published lesson, loaded in parallel. For tests and tooling only. */
export function loadAllLessons(): Promise<Lesson[]> {
  return Promise.all(Object.values(LOADERS).map((load) => load()));
}

export {
  LESSON_INDEX,
  LESSON_META_BY_ID,
  TAUGHT_CONCEPT_IDS,
  lessonMeta,
  lessonsForConcept,
} from "./lessonIndex";
export type { LessonMeta } from "./lessonIndex";
