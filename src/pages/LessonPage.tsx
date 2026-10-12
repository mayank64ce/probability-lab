import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { lessonById } from "../content/lessons";
import { conceptTitle } from "../content/curriculum";
import { STAGE_LABELS } from "../content/schema";
import { useProgress } from "../app/ProgressContext";
import {
  canAdvance,
  clampStageIndex,
  emptyStageState,
  feedbackVisible,
  isLastStage,
} from "../engine/lessonRunner";
import type { StageState } from "../engine/lessonRunner";
import type { AttemptRecord } from "../engine/records";
import { StageView } from "../components/lessons/StageView";
import { FeedbackPanel, FEEDBACK_SURFACE } from "../components/exercises/Feedback";
import type { Feedback } from "../components/exercises/Feedback";
import { Button } from "../components/ui/Button";
import { SegmentedProgress } from "../components/ui/ProgressBar";
import { Card } from "../components/ui/Card";
import { Eyebrow } from "../components/ui/Badge";
import { Icon } from "../components/ui/Icon";

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
 * A lesson takes over the whole viewport: no app chrome, one activity, and a
 * single action bar pinned to the bottom that doubles as the place the verdict
 * appears. The learner should have nothing to decide except the question.
 */
export function LessonPage() {
  const { lessonId = "" } = useParams();
  const navigate = useNavigate();
  const { state, recordAttempt, saveLessonProgress } = useProgress();

  const lesson = lessonById(lessonId);
  const stored = lesson ? state.lessons[lesson.id] : undefined;

  // Resume where the learner left off, the first time this lesson mounts.
  const [index, setIndex] = useState(() =>
    lesson ? clampStageIndex(lesson, stored?.stageIndex ?? 0) : 0,
  );
  const [stageStates, setStageStates] = useState<Record<string, StageState>>({});
  const [feedback, setFeedback] = useState<Record<string, Feedback | null>>({});
  const [finished, setFinished] = useState(false);

  const stageEnteredAt = useRef<number>(Date.now());
  const topRef = useRef<HTMLDivElement | null>(null);

  const stage = lesson?.stages[index];
  const stageState = stage ? (stageStates[stage.id] ?? emptyStageState()) : emptyStageState();

  // Reset the per-stage timer and scroll back to the top on every screen change.
  useEffect(() => {
    stageEnteredAt.current = Date.now();
    // Optional browser API — absent in jsdom, and never worth a render crash.
    const top = topRef.current;
    if (top && typeof top.scrollIntoView === "function") {
      top.scrollIntoView({ block: "start" });
    }
  }, [index, finished]);

  const persist = useCallback(
    (stageIndex: number, completedStageIds: string[], completed: boolean) => {
      if (!lesson) return;
      const now = Date.now();
      saveLessonProgress({
        lessonId: lesson.id,
        stageIndex,
        completedStageIds,
        startedAt: now,
        updatedAt: now,
        completedAt: completed ? now : undefined,
        contentVersion: lesson.version,
      });
    },
    [lesson, saveLessonProgress],
  );

  // Mark the lesson as started as soon as it opens, so "resume" works even if
  // the learner leaves on the very first screen.
  useEffect(() => {
    if (!lesson) return;
    if (state.lessons[lesson.id] === undefined) persist(index, [], false);
    // Intentionally runs once per lesson mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id]);

  const handleSubmit = useCallback(
    (answer: string, correct: boolean, nextFeedback: Feedback) => {
      if (!lesson || !stage || !stage.exercise) return;

      const current = stageStates[stage.id] ?? emptyStageState();
      const independent =
        stage.independent === true && current.attempts === 0 && current.hintsRevealed === 0;

      const attempt: AttemptRecord = {
        id: newId(),
        exerciseId: stage.exercise.id,
        lessonId: lesson.id,
        conceptIds: stage.exercise.conceptIds,
        answer,
        correct,
        attemptNumber: current.attempts + 1,
        hintsUsed: current.hintsRevealed,
        aiAssisted: false,
        timeMs: Date.now() - stageEnteredAt.current,
        completedAt: Date.now(),
        independent,
        difficulty: stage.exercise.difficulty,
        contentVersion: lesson.version,
      };
      recordAttempt(attempt);

      const updated: StageState = {
        ...current,
        submitted: true,
        correct,
        attempts: current.attempts + 1,
      };
      setStageStates((s) => ({ ...s, [stage.id]: updated }));
      setFeedback((f) => ({ ...f, [stage.id]: nextFeedback }));

      // Record the stage as done once the learner has committed to an answer.
      const completedIds = Object.entries({ ...stageStates, [stage.id]: updated })
        .filter(([, st]) => st.submitted)
        .map(([id]) => id);
      persist(index, completedIds, false);
    },
    [lesson, stage, stageStates, recordAttempt, persist, index],
  );

  const mutateStage = useCallback(
    (fn: (s: StageState) => StageState) => {
      if (!stage) return;
      setStageStates((s) => ({ ...s, [stage.id]: fn(s[stage.id] ?? emptyStageState()) }));
    },
    [stage],
  );

  const handlers = useMemo(
    () => ({
      onSubmit: handleSubmit,
      onRetry: () => mutateStage((s) => ({ ...s, submitted: false, correct: false })),
      onRevealHint: () => mutateStage((s) => ({ ...s, hintsRevealed: s.hintsRevealed + 1 })),
      onRevealSolution: () => mutateStage((s) => ({ ...s, solutionRevealed: true })),
      onOpenDerivation: () => undefined,
    }),
    [handleSubmit, mutateStage],
  );

  if (!lesson) {
    return (
      <div className="mx-auto w-full max-w-2xl px-5 py-16">
        <Card>
          <h1 className="text-xl font-extrabold">Lesson not found</h1>
          <p className="text-ink-muted mt-2">No lesson is published under the id “{lessonId}”.</p>
          <Link to="/learn" className="mt-5 inline-block">
            <Button variant="secondary">Back to Learn</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const completedIds = Object.entries(stageStates)
    .filter(([, st]) => st.submitted)
    .map(([id]) => id);
  const storedCompleted = stored?.completedStageIds ?? [];
  const doneIds = new Set([...completedIds, ...storedCompleted]);
  // A screen counts as done once it has an answer on it, or once the learner
  // has moved past it — read-only screens never record an answer but are still
  // genuinely behind you.
  const doneIndices = new Set(
    lesson.stages.map((s, i) => (doneIds.has(s.id) || i < index ? i : -1)).filter((i) => i >= 0),
  );

  // ---------------------------------------------------------------- summary
  if (finished) {
    const assess = lesson.stages.find((s) => s.independent);
    const assessState = assess ? stageStates[assess.id] : undefined;
    const hints = Object.values(stageStates).reduce((n, s) => n + s.hintsRevealed, 0);

    return (
      <div className="bg-canvas min-h-dvh">
        <div ref={topRef} className="mx-auto w-full max-w-2xl space-y-5 px-5 py-10 sm:py-16">
          <Card tone="accent" className="text-center">
            <span
              aria-hidden="true"
              className="bg-accent mx-auto flex h-16 w-16 items-center justify-center rounded-3xl text-white"
            >
              <Icon name="check" size={34} strokeWidth={2.75} />
            </span>
            <div className="mt-5">
              <Eyebrow>Lesson complete</Eyebrow>
              <h1 className="mt-2 text-2xl font-extrabold">{lesson.title}</h1>
            </div>

            <dl className="mt-7 grid grid-cols-2 gap-3">
              <div className="bg-surface/70 rounded-2xl px-4 py-3.5">
                <dd className="text-xl font-extrabold">
                  {assessState?.correct ? "Correct" : assessState ? "Not yet" : "—"}
                </dd>
                <dt className="text-ink-muted mt-0.5 text-xs font-semibold">
                  Unassisted challenge
                </dt>
              </div>
              <div className="bg-surface/70 rounded-2xl px-4 py-3.5">
                <dd className="text-xl font-extrabold tabular-nums">{hints}</dd>
                <dt className="text-ink-muted mt-0.5 text-xs font-semibold">Hints used</dt>
              </div>
            </dl>
          </Card>

          <Card>
            <p className="leading-relaxed">
              One lesson is a start, not mastery. {conceptTitle(lesson.conceptIds[0])} will come
              back for review after a delay — recalling it then is what makes it stick.
            </p>
            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
              <Link to="/" className="flex-1">
                <Button size="lg" className="w-full">
                  Back to dashboard
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="lg"
                className="flex-1"
                onClick={() => {
                  setFinished(false);
                  setIndex(0);
                }}
              >
                Review the lesson
              </Button>
            </div>
          </Card>

          {lesson.resources && lesson.resources.length > 0 && (
            <Card>
              <h2 className="text-lg font-bold">Go deeper at MIT</h2>
              <ul className="mt-4 space-y-2.5">
                {lesson.resources.map((resource) => (
                  <li key={resource.label}>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="border-line hover:border-line-strong hover:bg-raised flex items-start gap-3 rounded-2xl border px-4 py-3.5 transition-colors"
                    >
                      <Icon name="external" size={18} className="text-accent mt-0.5" />
                      <span className="min-w-0">
                        <span className="block font-bold">{resource.label}</span>
                        {resource.note && (
                          <span className="text-ink-muted mt-0.5 block text-sm">
                            {resource.note}
                          </span>
                        )}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    );
  }

  if (!stage) return null;

  const advanceAllowed = canAdvance(stage, stageState);
  const last = isLastStage(lesson, index);
  const showFeedback = feedbackVisible(stage, stageState);
  const verdict = showFeedback ? (feedback[stage.id] ?? null) : null;
  // Only numeric answers are worth retrying: a multiple-choice question has
  // already shown which option was right, so "try again" would be theatre.
  const canRetry =
    stageState.submitted && !stageState.correct && stage.exercise?.kind === "numeric";

  const helper = advanceAllowed
    ? null
    : stage.independent
      ? "Answer correctly, or reveal the worked solution, to finish."
      : "Commit to an answer to continue — being wrong here is part of the lesson.";

  function goNext() {
    if (!lesson || !stage) return;
    if (last) {
      persist(index, Array.from(new Set([...doneIds, stage.id])), true);
      setFinished(true);
      return;
    }
    const next = index + 1;
    setIndex(next);
    persist(next, Array.from(doneIds), false);
  }

  return (
    <div className="bg-canvas flex min-h-dvh flex-col">
      <header className="border-line bg-canvas/90 sticky top-0 z-20 border-b backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-4 px-5 py-3.5">
          <button
            type="button"
            onClick={() => navigate("/learn")}
            aria-label="Exit lesson"
            title="Exit lesson"
            className="text-ink-muted hover:bg-raised hover:text-ink -ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors"
          >
            <Icon name="close" />
          </button>
          <SegmentedProgress
            total={lesson.stages.length}
            current={index}
            completed={doneIndices}
            label="Lesson progress"
          />
          <span className="text-ink-muted shrink-0 text-xs font-extrabold tabular-nums">
            {index + 1}/{lesson.stages.length}
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pt-7 pb-10">
        {/* scroll-mt keeps the sticky header from covering the heading. */}
        <div ref={topRef} className="scroll-mt-24" />

        <div className="mb-6">
          <Eyebrow>{STAGE_LABELS[stage.kind]}</Eyebrow>
          <h1 className="mt-1.5 text-[1.65rem] font-extrabold sm:text-3xl">{stage.title}</h1>
          {index === 0 && (
            <p className="text-ink-muted mt-2 text-sm">
              {lesson.title} · about {lesson.estimatedMinutes} min · builds on{" "}
              {lesson.prerequisites.join(", ").toLowerCase()}
            </p>
          )}
        </div>

        <StageView
          stage={stage}
          state={stageState}
          showFeedback={showFeedback}
          handlers={handlers}
        />
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

          {helper && <p className="text-ink-muted text-sm font-medium">{helper}</p>}

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              aria-label="Previous screen"
              title="Previous screen"
              className="text-ink-muted hover:bg-raised hover:text-ink flex h-13 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors disabled:pointer-events-none disabled:opacity-30"
            >
              <Icon name="arrow-left" />
            </button>

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
              disabled={!advanceAllowed}
              onClick={goNext}
            >
              {last ? "Finish lesson" : "Continue"}
              <Icon name="chevron" size={18} strokeWidth={2.5} />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
