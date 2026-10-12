import { useCallback } from "react";
import type { VisualExercise } from "../../content/schema";
import type { Feedback } from "./Feedback";

/**
 * A visual exercise is graded by the figure itself: the stage forwards the
 * visualization's reported state here, and reaching `solvedWhen` completes it.
 * There is no Check button — manipulating the model *is* the answer.
 */
export function useVisualGrading(
  exercise: VisualExercise | undefined,
  submitted: boolean,
  onSubmit: (answer: string, correct: boolean, feedback: Feedback) => void,
) {
  return useCallback(
    (state: string) => {
      if (!exercise || submitted) return;
      if (state !== exercise.solvedWhen) return;
      onSubmit(state, true, { tone: "correct", title: "That is the move." });
    },
    [exercise, submitted, onSubmit],
  );
}
