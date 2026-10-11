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
  isLastStage,
  lessonProgressRatio,
} from "../engine/lessonRunner";
import type { StageState } from "../engine/lessonRunner";
import type { AttemptRecord } from "../engine/records";
import { StageView } from "../components/lessons/StageView";
import type { Feedback } from "../components/exercises/FeedbackBanner";
import { Button } from "../components/ui/Button";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `a-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

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
      <Card>
        <h1 className="text-lg font-semibold">Lesson not found</h1>
        <p className="mt-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
          No lesson is published under the id “{lessonId}”.
        </p>
        <Link to="/learn" className="mt-4 inline-block">
          <Button variant="secondary">Back to Learn</Button>
        </Link>
      </Card>
    );
  }

  const completedIds = Object.entries(stageStates)
    .filter(([, st]) => st.submitted)
    .map(([id]) => id);
  const storedCompleted = stored?.completedStageIds ?? [];
  const ratio = finished
    ? 1
    : lessonProgressRatio(lesson, Array.from(new Set([...completedIds, ...storedCompleted])));

  // ---------------------------------------------------------------- summary
  if (finished) {
    const assess = lesson.stages.find((s) => s.independent);
    const assessState = assess ? stageStates[assess.id] : undefined;

    return (
      <div ref={topRef} className="space-y-5">
        <Card raised>
          <p
            className="text-xs font-semibold tracking-wide uppercase"
            style={{ color: "var(--accent-text)" }}
          >
            Lesson complete
          </p>
          <h1 className="mt-1.5 text-xl font-semibold">{lesson.title}</h1>
          <div className="mt-4">
            <ProgressBar value={1} label="Lesson progress" />
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-4">
            <div>
              <dd className="text-lg font-semibold">
                {assessState?.correct ? "Correct" : assessState ? "Not yet" : "—"}
              </dd>
              <dt className="text-xs" style={{ color: "var(--text-muted)" }}>
                Unassisted challenge
              </dt>
            </div>
            <div>
              <dd className="text-lg font-semibold tabular-nums">
                {Object.values(stageStates).reduce((n, s) => n + s.hintsRevealed, 0)}
              </dd>
              <dt className="text-xs" style={{ color: "var(--text-muted)" }}>
                Hints used
              </dt>
            </div>
          </dl>

          <p className="mt-5 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            One lesson is a start, not mastery. {conceptTitle(lesson.conceptIds[0])} will come back
            for review after a delay — recalling it then is what makes it stick.
          </p>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Link to="/" className="flex-1">
              <Button className="w-full">Back to dashboard</Button>
            </Link>
            <Button
              variant="secondary"
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
            <h2 className="text-base font-semibold">Go deeper at MIT</h2>
            <ul className="mt-3 space-y-2">
              {lesson.resources.map((resource) => (
                <li key={resource.label}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="block rounded-xl px-3.5 py-3"
                    style={{
                      background: "var(--surface-raised)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <span className="text-sm font-medium">{resource.label} ↗</span>
                    {resource.note && (
                      <span className="mt-0.5 block text-xs" style={{ color: "var(--text-muted)" }}>
                        {resource.note}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    );
  }

  if (!stage) return null;

  const advanceAllowed = canAdvance(stage, stageState);
  const last = isLastStage(lesson, index);

  function goNext() {
    if (!lesson || !stage) return;
    if (last) {
      persist(index, Array.from(new Set([...completedIds, ...storedCompleted, stage.id])), true);
      setFinished(true);
      return;
    }
    const next = index + 1;
    setIndex(next);
    persist(next, Array.from(new Set([...completedIds, ...storedCompleted])), false);
  }

  return (
    <div ref={topRef} className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate("/learn")}
            className="text-sm font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            ‹ Exit
          </button>
          <Badge tone="accent">
            {STAGE_LABELS[stage.kind]} · {index + 1} of {lesson.stages.length}
          </Badge>
        </div>
        <div className="mt-2.5">
          <ProgressBar value={ratio} label="Lesson progress" compact />
        </div>
      </div>

      <div>
        <h1 className="text-xl font-semibold tracking-tight">{stage.title}</h1>
        {index === 0 && (
          <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
            {lesson.title} · about {lesson.estimatedMinutes} min · builds on{" "}
            {lesson.prerequisites.join(", ").toLowerCase()}
          </p>
        )}
      </div>

      <StageView
        stage={stage}
        state={stageState}
        feedback={feedback[stage.id] ?? null}
        handlers={handlers}
      />

      {/* Footer navigation */}
      <div
        className="sticky bottom-20 z-10 flex gap-2 rounded-2xl p-2 sm:bottom-4"
        style={{ background: "var(--surface-raised)", border: "1px solid var(--border)" }}
      >
        <Button
          variant="secondary"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          aria-label="Previous screen"
        >
          Back
        </Button>
        <Button className="flex-1" disabled={!advanceAllowed} onClick={goNext}>
          {last ? "Finish lesson" : "Continue"}
        </Button>
      </div>

      {!advanceAllowed && (
        <p className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
          {stage.independent
            ? "Answer correctly, or reveal the worked solution, to finish."
            : "Commit to an answer to continue — being wrong here is part of the lesson."}
        </p>
      )}
    </div>
  );
}
