import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Exercise } from "../../content/schema";
import { useProgress } from "../../app/ProgressContext";
import { emptyStageState } from "../../engine/lessonRunner";
import type { StageState } from "../../engine/lessonRunner";
import type { AttemptRecord } from "../../engine/records";
import { DIFFICULTY_LABELS } from "../../content/schema";
import { MultipleChoiceView } from "../exercises/MultipleChoiceView";
import { NumericView } from "../exercises/NumericView";
import { StepsView } from "../exercises/StepsView";
import { HintPanel } from "../exercises/HintPanel";
import { FeedbackPanel, FEEDBACK_SURFACE } from "../exercises/Feedback";
import type { Feedback } from "../exercises/Feedback";
import { RichText } from "../ui/RichText";
import { SegmentedProgress } from "../ui/ProgressBar";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Badge, Eyebrow } from "../ui/Badge";
import { Icon } from "../ui/Icon";

/**
 * A session takes over the viewport. Practice and Review live inside the app
 * shell, whose tab bar is fixed to the bottom of the screen — without this the
 * bar would sit on top of the session's own action bar.
 */
function Overlay({ children }: { children: ReactNode }) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div className="bg-canvas fixed inset-0 z-40 overflow-y-auto overscroll-contain">
      {children}
    </div>
  );
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `a-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

const FOOTER_BORDER: Record<Feedback["tone"], string> = {
  correct: "border-good/30",
  partial: "border-warn/30",
  incorrect: "border-bad/30",
};

/**
 * Runs a set of practice problems.
 *
 * Shares the lesson's shape deliberately — immersive, one activity, a verdict
 * in the action bar — so practice feels like the same product rather than a
 * second one.
 *
 * A first-attempt, unhinted correct answer here counts as *independent*, the
 * same as a lesson's final challenge. Without that, mastery would be
 * unreachable: six lessons supply only six assessment answers, and proficiency
 * alone asks for three per concept.
 */
export function SessionRunner({
  title,
  subtitle,
  exercises,
  onExit,
}: {
  title: string;
  subtitle?: string;
  exercises: Exercise[];
  onExit: () => void;
}) {
  const { recordAttempt } = useProgress();

  const [index, setIndex] = useState(0);
  const [states, setStates] = useState<Record<string, StageState>>({});
  const [feedback, setFeedback] = useState<Record<string, Feedback | null>>({});
  const [finished, setFinished] = useState(false);

  const enteredAt = useRef<number>(Date.now());
  const topRef = useRef<HTMLDivElement | null>(null);

  const exercise = exercises[index];
  const state = exercise ? (states[exercise.id] ?? emptyStageState()) : emptyStageState();

  useEffect(() => {
    enteredAt.current = Date.now();
    const top = topRef.current;
    if (top && typeof top.scrollIntoView === "function") top.scrollIntoView({ block: "start" });
  }, [index, finished]);

  const handleSubmit = useCallback(
    (answer: string, correct: boolean, next: Feedback) => {
      if (!exercise) return;
      const current = states[exercise.id] ?? emptyStageState();
      const independent = current.attempts === 0 && current.hintsRevealed === 0;

      const attempt: AttemptRecord = {
        id: newId(),
        exerciseId: exercise.id,
        lessonId: "practice",
        conceptIds: exercise.conceptIds,
        answer,
        correct,
        attemptNumber: current.attempts + 1,
        hintsUsed: current.hintsRevealed,
        aiAssisted: false,
        timeMs: Date.now() - enteredAt.current,
        completedAt: Date.now(),
        independent: independent && correct,
        difficulty: exercise.difficulty,
        contentVersion: "bank-1",
      };
      recordAttempt(attempt);

      setStates((s) => ({
        ...s,
        [exercise.id]: {
          ...current,
          submitted: true,
          correct,
          attempts: current.attempts + 1,
        },
      }));
      setFeedback((f) => ({ ...f, [exercise.id]: next }));
    },
    [exercise, states, recordAttempt],
  );

  const mutate = useCallback(
    (fn: (s: StageState) => StageState) => {
      if (!exercise) return;
      setStates((s) => ({ ...s, [exercise.id]: fn(s[exercise.id] ?? emptyStageState()) }));
    },
    [exercise],
  );

  const handlers = useMemo(
    () => ({
      onRetry: () => mutate((s) => ({ ...s, submitted: false, correct: false })),
      onRevealHint: () => mutate((s) => ({ ...s, hintsRevealed: s.hintsRevealed + 1 })),
      onRevealSolution: () => mutate((s) => ({ ...s, solutionRevealed: true })),
    }),
    [mutate],
  );

  const answered = new Set(
    exercises.map((e, i) => (states[e.id]?.submitted ? i : -1)).filter((i) => i >= 0),
  );

  // ----------------------------------------------------------- summary
  if (finished || !exercise) {
    const graded = exercises.filter((e) => states[e.id]?.submitted);
    const right = graded.filter((e) => states[e.id]?.correct).length;
    const hints = Object.values(states).reduce((n, s) => n + s.hintsRevealed, 0);

    return (
      <Overlay>
        <div ref={topRef} className="mx-auto w-full max-w-2xl space-y-5 px-5 py-10 sm:py-16">
          <Card tone="accent" className="text-center">
            <span
              aria-hidden="true"
              className="bg-accent mx-auto flex h-16 w-16 items-center justify-center rounded-3xl text-white"
            >
              <Icon name="check" size={34} strokeWidth={2.75} />
            </span>
            <div className="mt-5">
              <Eyebrow>Session complete</Eyebrow>
              <h1 className="mt-2 text-2xl font-extrabold">
                {right} of {graded.length} correct
              </h1>
            </div>
            <dl className="mt-7 grid grid-cols-2 gap-3">
              <div className="bg-surface/70 rounded-2xl px-4 py-3.5">
                <dd className="text-xl font-extrabold tabular-nums">{graded.length}</dd>
                <dt className="text-ink-muted mt-0.5 text-xs font-semibold">Answered</dt>
              </div>
              <div className="bg-surface/70 rounded-2xl px-4 py-3.5">
                <dd className="text-xl font-extrabold tabular-nums">{hints}</dd>
                <dt className="text-ink-muted mt-0.5 text-xs font-semibold">Hints used</dt>
              </div>
            </dl>
          </Card>

          <Card>
            <p className="leading-relaxed">
              {right === graded.length && graded.length > 0
                ? "A clean run. These concepts will come back on a longer delay now — recalling them then is what turns practice into memory."
                : "Whatever you missed moves to the front of the queue, and the concepts behind it come back sooner."}
            </p>
            <Button size="lg" className="mt-5 w-full" onClick={onExit}>
              Done
            </Button>
          </Card>
        </div>
      </Overlay>
    );
  }

  const verdict = state.submitted ? (feedback[exercise.id] ?? null) : null;
  const last = index === exercises.length - 1;
  const canRetry = state.submitted && !state.correct && exercise.kind === "numeric";

  return (
    <Overlay>
      <div className="flex min-h-dvh flex-col">
        <header className="border-line bg-canvas/90 sticky top-0 z-20 border-b backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-2xl items-center gap-4 px-5 py-3.5">
            <button
              type="button"
              onClick={onExit}
              aria-label="Exit practice"
              title="Exit practice"
              className="text-ink-muted hover:bg-raised hover:text-ink -ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors"
            >
              <Icon name="close" />
            </button>
            <SegmentedProgress
              total={exercises.length}
              current={index}
              completed={answered}
              label="Session progress"
            />
            <span className="text-ink-muted shrink-0 text-xs font-extrabold tabular-nums">
              {index + 1}/{exercises.length}
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-2xl flex-1 px-5 pt-7 pb-10">
          <div ref={topRef} className="scroll-mt-24" />

          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <Eyebrow>{title}</Eyebrow>
              {subtitle && <p className="text-ink-muted mt-1 text-sm">{subtitle}</p>}
            </div>
            <Badge tone="outline">{DIFFICULTY_LABELS[exercise.difficulty]}</Badge>
          </div>

          <section
            aria-label="Problem"
            className="border-line bg-surface rounded-card space-y-5 border p-5 shadow-card sm:p-6"
          >
            <div className="text-[1.05rem] leading-[1.7] font-medium">
              <RichText blocks={exercise.prompt} />
            </div>

            {exercise.kind === "multiple-choice" && (
              <MultipleChoiceView
                exercise={exercise}
                submitted={state.submitted}
                onSubmit={handleSubmit}
              />
            )}
            {exercise.kind === "numeric" && (
              <NumericView
                exercise={exercise}
                submitted={state.submitted}
                wasCorrect={state.correct}
                onSubmit={handleSubmit}
              />
            )}
            {exercise.kind === "steps" && (
              <StepsView exercise={exercise} submitted={state.submitted} onSubmit={handleSubmit} />
            )}

            {!(state.submitted && state.correct) && (
              <HintPanel
                hints={exercise.hints}
                revealed={state.hintsRevealed}
                canReveal={state.hintsRevealed < exercise.hints.length}
                onReveal={handlers.onRevealHint}
                onRevealSolution={handlers.onRevealSolution}
                solutionRevealed={state.solutionRevealed}
              />
            )}

            {(state.solutionRevealed || (state.submitted && state.correct)) && (
              <div className="bg-sunken animate-rise rounded-2xl px-5 py-4">
                <p className="text-ink-muted mb-2 text-xs font-extrabold tracking-wide uppercase">
                  Worked solution
                </p>
                <RichText blocks={exercise.solution} />
              </div>
            )}
          </section>
        </main>

        <footer
          className={`sticky bottom-0 z-20 border-t backdrop-blur-md ${
            verdict
              ? `${FEEDBACK_SURFACE[verdict.tone]} ${FOOTER_BORDER[verdict.tone]}`
              : "border-line bg-surface/95"
          }`}
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="mx-auto w-full max-w-2xl space-y-3.5 px-5 py-4">
            {verdict && (
              <div className="animate-rise">
                <FeedbackPanel feedback={verdict} />
              </div>
            )}
            {!state.submitted && (
              <p className="text-ink-muted text-sm font-medium">
                Answer to continue — hints are available whenever you want them.
              </p>
            )}

            <div className="flex items-center gap-2.5">
              {canRetry && (
                <Button variant="secondary" size="lg" onClick={handlers.onRetry}>
                  Try again
                </Button>
              )}
              <Button
                size="lg"
                className="flex-1"
                variant={
                  verdict?.tone === "correct"
                    ? "good"
                    : verdict?.tone === "incorrect"
                      ? "bad"
                      : "primary"
                }
                disabled={!state.submitted}
                onClick={() => (last ? setFinished(true) : setIndex((i) => i + 1))}
              >
                {last ? "Finish session" : "Next problem"}
                <Icon name="chevron" size={18} strokeWidth={2.5} />
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </Overlay>
  );
}
