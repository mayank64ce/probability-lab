import { useEffect, useState } from "react";
import type { NumericExercise } from "../../content/schema";
import { validateNumeric } from "../../engine/answerValidator";
import { Button } from "../ui/Button";
import type { Feedback } from "./Feedback";

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
}: {
  exercise: NumericExercise;
  submitted: boolean;
  wasCorrect: boolean;
  onSubmit: (answer: string, correct: boolean, feedback: Feedback) => void;
}) {
  const [value, setValue] = useState("");

  // Retry lives in the action bar; clear the field when it sends us back.
  useEffect(() => {
    if (!submitted) setValue("");
  }, [submitted]);

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
  const locked = submitted && wasCorrect;

  const frame = locked
    ? "border-good bg-good-soft"
    : submitted
      ? "border-bad bg-bad-soft"
      : "border-line-strong bg-surface focus-within:border-accent";

  return (
    <div className="space-y-2.5">
      <label htmlFor={inputId} className="block text-sm font-bold">
        Your answer
        {hint && <span className="text-ink-muted ml-1.5 font-medium">{hint}</span>}
      </label>

      <div className="flex flex-wrap items-center gap-2.5">
        <div
          className={`flex min-h-14 flex-1 basis-40 items-center rounded-2xl border-2 px-4 transition-colors ${frame}`}
        >
          <input
            id={inputId}
            type="text"
            inputMode={exercise.acceptFraction === false ? "decimal" : "text"}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            disabled={locked}
            value={value}
            placeholder={exercise.placeholder}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !submitted) submit();
            }}
            className="placeholder:text-ink-muted/60 w-full bg-transparent text-xl font-bold tabular-nums outline-none disabled:opacity-70"
          />
        </div>
        {!submitted && (
          <Button size="lg" onClick={submit} disabled={value.trim() === ""}>
            Check
          </Button>
        )}
      </div>

      {exercise.acceptFraction !== false && (
        <p className="text-ink-muted text-xs">
          Decimals and fractions are both accepted — 0.25 and 1/4 are the same answer.
        </p>
      )}
    </div>
  );
}
