import { useEffect, useState } from "react";
import type { MultipleChoiceExercise } from "../../content/schema";
import { validateChoice } from "../../engine/answerValidator";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { InlineText } from "../ui/RichText";
import type { Feedback } from "./Feedback";

const LETTERS = "ABCDEFGH";

export function MultipleChoiceView({
  exercise,
  submitted,
  onSubmit,
}: {
  exercise: MultipleChoiceExercise;
  submitted: boolean;
  onSubmit: (answer: string, correct: boolean, feedback: Feedback) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const multi = exercise.multiSelect === true;

  // Retry lives in the action bar, so the selection clears from here whenever
  // the stage drops back out of its submitted state.
  useEffect(() => {
    if (!submitted) setSelected([]);
  }, [submitted]);

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
    <div className="space-y-4">
      <div
        role={multi ? "group" : "radiogroup"}
        aria-label="Answer choices"
        className="space-y-2.5"
      >
        {exercise.choices.map((choice, i) => {
          const isSelected = selected.includes(choice.id);
          const revealCorrect = submitted && choice.correct === true;
          const revealWrong = submitted && isSelected && choice.correct !== true;

          const shell = revealCorrect
            ? "border-good bg-good-soft"
            : revealWrong
              ? "border-bad bg-bad-soft"
              : isSelected
                ? "border-accent bg-accent-soft"
                : "border-line bg-surface hover:border-line-strong";

          const mark = revealCorrect
            ? "border-good bg-good text-white"
            : revealWrong
              ? "border-bad bg-bad text-white"
              : isSelected
                ? "border-accent bg-accent text-white"
                : "border-line-strong text-ink-muted";

          return (
            <button
              key={choice.id}
              type="button"
              role={multi ? "checkbox" : "radio"}
              aria-checked={isSelected}
              disabled={submitted}
              onClick={() => toggle(choice.id)}
              className={`pressable flex w-full items-center gap-3.5 rounded-2xl border-2 px-4 py-3.5 text-left text-[1rem] font-semibold disabled:cursor-default ${shell}`}
            >
              <span
                aria-hidden="true"
                className={`flex h-8 w-8 shrink-0 items-center justify-center border-2 text-[0.8rem] font-extrabold transition-colors ${mark}`}
                style={{ borderRadius: multi ? 10 : 999 }}
              >
                {revealCorrect || (isSelected && !submitted) ? (
                  <Icon name="check" size={16} strokeWidth={3} />
                ) : revealWrong ? (
                  <Icon name="close" size={15} strokeWidth={3} />
                ) : (
                  LETTERS[i]
                )}
              </span>
              <span className="min-w-0 flex-1">
                <InlineText text={choice.label} />
              </span>
            </button>
          );
        })}
      </div>

      {!submitted && (
        <Button onClick={submit} disabled={selected.length === 0} className="w-full sm:w-auto">
          Check answer
        </Button>
      )}
    </div>
  );
}
