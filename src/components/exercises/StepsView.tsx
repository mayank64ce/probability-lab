import { useEffect, useState } from "react";
import type { DerivationStep, StepsExercise } from "../../content/schema";
import { validateChoice, validateNumeric } from "../../engine/answerValidator";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { RichText, InlineText } from "../ui/RichText";
import type { Feedback } from "./Feedback";

/**
 * A derivation worked one checkpoint at a time.
 *
 * Steps are revealed in order and graded individually, so a learner who takes
 * a wrong turn is corrected at the turn rather than at the end. Finishing with
 * a stumble still advances the lesson — but it is not recorded as a correct
 * answer, because the point of a derivation is getting every step right.
 */
export function StepsView({
  exercise,
  submitted,
  onSubmit,
}: {
  exercise: StepsExercise;
  submitted: boolean;
  onSubmit: (answer: string, correct: boolean, feedback: Feedback) => void;
}) {
  const [done, setDone] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [stumbled, setStumbled] = useState(false);
  const [wrong, setWrong] = useState<string | null>(null);

  useEffect(() => {
    if (!submitted) {
      setDone([]);
      setAnswers([]);
      setStumbled(false);
      setWrong(null);
    }
  }, [submitted]);

  const index = done.length;
  const current = exercise.steps[index];

  function accept(step: DerivationStep, given: string) {
    const nextDone = [...done, step.id];
    const nextAnswers = [...answers, given];
    setDone(nextDone);
    setAnswers(nextAnswers);
    setWrong(null);

    if (nextDone.length === exercise.steps.length) {
      const clean = !stumbled;
      onSubmit(nextAnswers.join(" | "), clean, {
        tone: clean ? "correct" : "partial",
        title: clean ? "Every step correct." : "Derivation complete.",
        message: clean
          ? undefined
          : "You reached the end, but at least one step needed a second attempt — so this one does not count as an unassisted success.",
      });
    }
  }

  function reject(step: DerivationStep) {
    setStumbled(true);
    setWrong(step.id);
  }

  return (
    <div className="space-y-3">
      <ol className="space-y-3">
        {exercise.steps.map((step, i) => {
          const isDone = done.includes(step.id);
          if (!isDone && i !== index) return null;

          return (
            <li
              key={step.id}
              className={`rounded-2xl border px-4 py-3.5 ${
                isDone ? "border-good/40 bg-good-soft" : "border-line bg-surface"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                    isDone ? "bg-good text-white" : "bg-accent-soft text-accent-ink"
                  }`}
                >
                  {isDone ? <Icon name="check" size={15} strokeWidth={3} /> : i + 1}
                </span>

                <div className="min-w-0 flex-1 space-y-3">
                  <div className="text-[0.98rem] leading-relaxed">
                    <RichText blocks={step.prompt} />
                  </div>

                  {isDone ? (
                    <p className="text-good-ink text-sm font-bold">
                      <span className="sr-only">Answered: </span>
                      {answers[done.indexOf(step.id)]}
                    </p>
                  ) : (
                    <StepInput step={step} onAccept={accept} onReject={reject} />
                  )}

                  {wrong === step.id && step.hint && (
                    <p className="bg-warn-soft text-warn-ink animate-rise rounded-xl px-3.5 py-2.5 text-sm font-semibold">
                      <InlineText text={step.hint} />
                    </p>
                  )}
                  {wrong === step.id && !step.hint && (
                    <p className="text-bad-ink text-sm font-semibold">
                      Not that one — try the step again.
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {current === undefined && (
        <p className="text-ink-muted text-sm font-semibold">
          All {exercise.steps.length} steps complete.
        </p>
      )}
    </div>
  );
}

function StepInput({
  step,
  onAccept,
  onReject,
}: {
  step: DerivationStep;
  onAccept: (step: DerivationStep, given: string) => void;
  onReject: (step: DerivationStep) => void;
}) {
  const [value, setValue] = useState("");
  const inputId = `step-${step.id}`;

  if (step.answer.kind === "choice") {
    const spec = step.answer;
    return (
      <div role="radiogroup" aria-label="Step options" className="space-y-2">
        {spec.choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            role="radio"
            aria-checked={false}
            onClick={() =>
              validateChoice([choice.id], spec).correct
                ? onAccept(step, choice.label)
                : onReject(step)
            }
            className="border-line hover:border-accent hover:bg-accent-soft/40 pressable block w-full rounded-xl border-2 px-3.5 py-2.5 text-left text-[0.95rem] font-semibold transition-colors"
          >
            <InlineText text={choice.label} />
          </button>
        ))}
      </div>
    );
  }

  const spec = step.answer;
  const submit = () => {
    if (value.trim() === "") return;
    if (validateNumeric(value, spec).correct) onAccept(step, value.trim());
    else onReject(step);
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <label htmlFor={inputId} className="sr-only">
        Answer for step
      </label>
      <input
        id={inputId}
        type="text"
        inputMode={spec.acceptFraction === false ? "decimal" : "text"}
        autoComplete="off"
        value={value}
        placeholder={spec.placeholder}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        className="border-line-strong bg-surface focus-within:border-accent placeholder:text-ink-muted/60 min-h-12 flex-1 basis-32 rounded-xl border-2 px-3.5 text-base font-bold tabular-nums outline-none"
      />
      <Button onClick={submit} disabled={value.trim() === ""}>
        Check step
      </Button>
    </div>
  );
}
