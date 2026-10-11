import { useState } from "react";
import type { NumericExercise } from "../../content/schema";
import { validateNumeric } from "../../engine/answerValidator";
import { Button } from "../ui/Button";
import type { Feedback } from "./FeedbackBanner";

const UNIT_HINT: Record<NumericExercise["unit"], string> = {
  percent: "Answer as a percentage.",
  probability: "Answer as a probability between 0 and 1.",
  plain: "",
};

export function NumericView({
  exercise,
  submitted,
  wasCorrect,
  onSubmit,
  onRetry,
}: {
  exercise: NumericExercise;
  submitted: boolean;
  wasCorrect: boolean;
  onSubmit: (answer: string, correct: boolean, feedback: Feedback) => void;
  onRetry: () => void;
}) {
  const [value, setValue] = useState("");

  function submit() {
    if (value.trim() === "") return;
    const result = validateNumeric(value, exercise);

    const feedback: Feedback =
      result.verdict === "correct"
        ? { tone: "correct", title: "Correct." }
        : result.verdict === "correct-unsimplified"
          ? { tone: "correct", title: "Correct.", message: result.message }
          : result.verdict === "unit-slip"
            ? { tone: "partial", title: "Right value, wrong unit.", message: result.message }
            : result.verdict === "unparseable"
              ? {
                  tone: "incorrect",
                  title: "That is not a number I can read.",
                  message: result.message,
                }
              : { tone: "incorrect", title: "Not quite.", message: result.message };

    onSubmit(value.trim(), result.correct, feedback);
  }

  const hint = UNIT_HINT[exercise.unit];
  const inputId = `numeric-${exercise.id}`;

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium">
          Your answer
          {hint && (
            <span className="ml-1.5 font-normal" style={{ color: "var(--text-muted)" }}>
              {hint}
            </span>
          )}
        </label>
        <div className="flex gap-2">
          <input
            id={inputId}
            type="text"
            inputMode={exercise.acceptFraction === false ? "decimal" : "text"}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            disabled={submitted && wasCorrect}
            value={value}
            placeholder={exercise.placeholder}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !submitted) submit();
            }}
            className="min-h-11 w-full rounded-xl border px-3.5 text-base tabular-nums disabled:opacity-60"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          />
          {!submitted && (
            <Button onClick={submit} disabled={value.trim() === ""}>
              Check
            </Button>
          )}
        </div>
        {exercise.acceptFraction !== false && (
          <p className="mt-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
            Decimals and fractions are both accepted — 0.25 and 1/4 are the same answer.
          </p>
        )}
      </div>

      {submitted && !wasCorrect && (
        <Button
          variant="secondary"
          className="w-full sm:w-auto"
          onClick={() => {
            setValue("");
            onRetry();
          }}
        >
          Try again
        </Button>
      )}
    </div>
  );
}
