import { useState } from "react";
import type { MultipleChoiceExercise } from "../../content/schema";
import { validateChoice } from "../../engine/answerValidator";
import { Button } from "../ui/Button";
import { InlineText } from "../ui/RichText";
import type { Feedback } from "./FeedbackBanner";

export function MultipleChoiceView({
  exercise,
  submitted,
  wasCorrect,
  onSubmit,
  onRetry,
}: {
  exercise: MultipleChoiceExercise;
  submitted: boolean;
  wasCorrect: boolean;
  onSubmit: (answer: string, correct: boolean, feedback: Feedback) => void;
  onRetry: () => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const multi = exercise.multiSelect === true;

  function toggle(id: string) {
    if (submitted) return;
    setSelected((current) =>
      multi ? (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]) : [id],
    );
  }

  function submit() {
    if (selected.length === 0) return;
    const result = validateChoice(selected, exercise);

    const feedback: Feedback = result.correct
      ? { tone: "correct", title: "Correct." }
      : {
          tone: "incorrect",
          title: "Not quite.",
          message:
            result.message ??
            (result.missingIds.length > 0 && result.wrongIds.length === 0
              ? "That is right as far as it goes, but there is more than one correct choice here."
              : undefined),
        };

    onSubmit(selected.join(","), result.correct, feedback);
  }

  return (
    <div className="space-y-3">
      <div role={multi ? "group" : "radiogroup"} aria-label="Answer choices" className="space-y-2">
        {exercise.choices.map((choice) => {
          const isSelected = selected.includes(choice.id);
          const revealCorrect = submitted && choice.correct === true;
          const revealWrong = submitted && isSelected && choice.correct !== true;

          const style = revealCorrect
            ? { background: "var(--correct-soft)", borderColor: "var(--correct)" }
            : revealWrong
              ? { background: "var(--wrong-soft)", borderColor: "var(--wrong)" }
              : isSelected
                ? { background: "var(--accent-soft)", borderColor: "var(--accent)" }
                : { background: "var(--surface)", borderColor: "var(--border)" };

          return (
            <button
              key={choice.id}
              type="button"
              role={multi ? "checkbox" : "radio"}
              aria-checked={isSelected}
              disabled={submitted}
              onClick={() => toggle(choice.id)}
              className="flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-[0.95rem] transition-colors disabled:cursor-default"
              style={style}
            >
              <span
                aria-hidden="true"
                className="flex h-5 w-5 shrink-0 items-center justify-center border-2 text-[0.65rem] font-bold"
                style={{
                  borderRadius: multi ? 5 : 999,
                  borderColor: isSelected || revealCorrect ? "var(--accent)" : "var(--border)",
                  background: isSelected ? "var(--accent)" : "transparent",
                  color: "#fff",
                }}
              >
                {isSelected ? "✓" : ""}
              </span>
              <span className="min-w-0 flex-1">
                <InlineText text={choice.label} />
              </span>
              {revealCorrect && (
                <span aria-hidden="true" className="text-sm" style={{ color: "var(--correct)" }}>
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <Button onClick={submit} disabled={selected.length === 0} className="w-full sm:w-auto">
          Check answer
        </Button>
      ) : (
        !wasCorrect && (
          <Button
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => {
              setSelected([]);
              onRetry();
            }}
          >
            Try again
          </Button>
        )
      )}
    </div>
  );
}
