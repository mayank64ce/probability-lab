import { createContext, useContext } from "react";
import type { AttemptRecord, LessonProgress, ProgressState, ThemeChoice } from "../engine/records";

export interface ProgressApi {
  state: ProgressState;
  /** Resolved theme actually applied, after folding in the OS preference. */
  resolvedTheme: "light" | "dark";
  /** False once a write has failed — private browsing, full quota, and so on. */
  persistent: boolean;
  recordAttempt: (attempt: AttemptRecord) => void;
  saveLessonProgress: (progress: LessonProgress) => void;
  setTheme: (theme: ThemeChoice) => void;
  replaceAll: (state: ProgressState) => void;
  reset: () => void;
}

export const ProgressContext = createContext<ProgressApi | null>(null);

export function useProgress(): ProgressApi {
  const api = useContext(ProgressContext);
  if (!api) throw new Error("useProgress must be used inside <ProgressProvider>");
  return api;
}
