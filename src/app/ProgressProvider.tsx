import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { AttemptRecord, LessonProgress, ProgressState, ThemeChoice } from "../engine/records";
import {
  emptyProgress,
  loadProgress,
  recordAttempt as addAttempt,
  saveProgress,
  setTheme as applyTheme,
  upsertLessonProgress,
} from "../storage/progressStore";
import { ProgressContext } from "./ProgressContext";
import type { ProgressApi } from "./ProgressContext";

function prefersDark(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * Owns all persisted learner state.
 *
 * Progress is loaded once on mount and written back after every change, so
 * closing the tab mid-lesson loses nothing.
 */
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => loadProgress());
  const [persistent, setPersistent] = useState(true);
  const [systemDark, setSystemDark] = useState(prefersDark);
  const firstRender = useRef(true);

  // Persist on every change, but not for the initial load.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!saveProgress(state)) setPersistent(false);
  }, [state]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const resolvedTheme: "light" | "dark" =
    state.theme === "system" ? (systemDark ? "dark" : "light") : state.theme;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [resolvedTheme]);

  const recordAttempt = useCallback((attempt: AttemptRecord) => {
    setState((current) => addAttempt(current, attempt));
  }, []);

  const saveLessonProgress = useCallback((progress: LessonProgress) => {
    setState((current) => upsertLessonProgress(current, progress));
  }, []);

  const setTheme = useCallback((theme: ThemeChoice) => {
    setState((current) => applyTheme(current, theme));
  }, []);

  const replaceAll = useCallback((next: ProgressState) => setState(next), []);

  const reset = useCallback(() => setState(emptyProgress()), []);

  const value = useMemo<ProgressApi>(
    () => ({
      state,
      resolvedTheme,
      persistent,
      recordAttempt,
      saveLessonProgress,
      setTheme,
      replaceAll,
      reset,
    }),
    [
      state,
      resolvedTheme,
      persistent,
      recordAttempt,
      saveLessonProgress,
      setTheme,
      replaceAll,
      reset,
    ],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}
