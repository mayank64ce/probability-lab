/**
 * Practice bank loading.
 *
 * Same shape as lesson loading: metadata is synchronous so Practice can show
 * what exists without downloading anything, and a topic's problems arrive in
 * their own chunk when a session actually starts.
 */

import type { ConceptId, Difficulty, Exercise, ExerciseBank } from "./schema";

export interface BankMeta {
  topicId: string;
  /** Total problems in the bank. */
  count: number;
  conceptIds: ConceptId[];
  byDifficulty: Record<Difficulty, number>;
}

/** Kept honest by `bankIntegrity.test.ts`, which loads every bank and compares. */
export const BANK_INDEX: BankMeta[] = [
  {
    topicId: "conditioning",
    count: 16,
    conceptIds: [
      "conditional-probability",
      "independence",
      "total-probability",
      "multiplication-rule",
      "bayes-theorem",
      "conditional-independence",
    ],
    byDifficulty: { 1: 3, 2: 4, 3: 4, 4: 3, 5: 2 },
  },
];

const LOADERS: Record<string, () => Promise<ExerciseBank>> = {
  conditioning: () => import("./mit-6041/banks/conditioning").then((m) => m.CONDITIONING_BANK),
};

export const BANKED_TOPIC_IDS = BANK_INDEX.map((b) => b.topicId);

export function bankMeta(topicId: string): BankMeta | undefined {
  return BANK_INDEX.find((b) => b.topicId === topicId);
}

/** Topics whose bank touches a given concept. */
export function banksForConcept(conceptId: ConceptId): BankMeta[] {
  return BANK_INDEX.filter((b) => b.conceptIds.includes(conceptId));
}

export function loadBank(topicId: string): Promise<ExerciseBank> | undefined {
  return LOADERS[topicId]?.();
}

/** Every problem across the named topics, for a mixed session. */
export async function loadExercises(topicIds: string[]): Promise<Exercise[]> {
  const banks = await Promise.all(
    topicIds.map((id) => LOADERS[id]?.()).filter((p): p is Promise<ExerciseBank> => Boolean(p)),
  );
  return banks.flatMap((b) => b.exercises);
}

/** Every bank, for tests and tooling. */
export function loadAllBanks(): Promise<ExerciseBank[]> {
  return Promise.all(Object.values(LOADERS).map((load) => load()));
}
