import type { LessonStage } from "../../content/schema";
import type { StageState } from "../../engine/lessonRunner";
import { feedbackVisible, hintsAvailable } from "../../engine/lessonRunner";
import { RichText } from "../ui/RichText";
import { Collapsible } from "../ui/Collapsible";
import { Visualization } from "../visualizations/registry";
import { MultipleChoiceView } from "../exercises/MultipleChoiceView";
import { NumericView } from "../exercises/NumericView";
import { useVisualGrading } from "../exercises/VisualView";
import { FeedbackBanner } from "../exercises/FeedbackBanner";
import type { Feedback } from "../exercises/FeedbackBanner";
import { HintPanel } from "../exercises/HintPanel";

export interface StageHandlers {
  onSubmit: (answer: string, correct: boolean, feedback: Feedback) => void;
  onRetry: () => void;
  onRevealHint: () => void;
  onRevealSolution: () => void;
  onOpenDerivation: () => void;
}

/**
 * One screen of a lesson: at most one main activity, and nothing revealed
 * before the learner has committed to an answer.
 */
export function StageView({
  stage,
  state,
  feedback,
  handlers,
}: {
  stage: LessonStage;
  state: StageState;
  feedback: Feedback | null;
  handlers: StageHandlers;
}) {
  const exercise = stage.exercise;
  const showFeedback = feedbackVisible(stage, state);
  const visualHandler = useVisualGrading(
    exercise?.kind === "visual" ? exercise : undefined,
    state.submitted,
    handlers.onSubmit,
  );

  return (
    <div className="space-y-5">
      {stage.intro && <RichText blocks={stage.intro} />}

      {stage.visualization && (
        <Visualization
          viz={stage.visualization.key}
          config={stage.visualization.config}
          onStateChange={exercise?.kind === "visual" ? visualHandler : undefined}
        />
      )}

      {exercise && (
        <section
          aria-label="Activity"
          className="space-y-4 rounded-2xl p-4 sm:p-5"
          style={{ background: "var(--surface-raised)", border: "1px solid var(--border)" }}
        >
          <RichText blocks={exercise.prompt} />

          {exercise.kind === "multiple-choice" && (
            <MultipleChoiceView
              exercise={exercise}
              submitted={state.submitted}
              wasCorrect={state.correct}
              onSubmit={handlers.onSubmit}
              onRetry={handlers.onRetry}
            />
          )}

          {exercise.kind === "numeric" && (
            <NumericView
              exercise={exercise}
              submitted={state.submitted}
              wasCorrect={state.correct}
              onSubmit={handlers.onSubmit}
              onRetry={handlers.onRetry}
            />
          )}

          {feedback && showFeedback && <FeedbackBanner feedback={feedback} />}

          {exercise.kind !== "visual" && (
            <HintPanel
              hints={exercise.hints}
              revealed={state.hintsRevealed}
              canReveal={hintsAvailable(stage, state)}
              lockedMessage={
                stage.independent && state.attempts === 0
                  ? "Submit an answer first — this question is meant to be done unassisted."
                  : undefined
              }
              onReveal={handlers.onRevealHint}
              onRevealSolution={handlers.onRevealSolution}
              solutionRevealed={state.solutionRevealed}
            />
          )}

          {state.solutionRevealed && (
            <div className="rounded-xl px-4 py-3.5" style={{ background: "var(--surface-sunken)" }}>
              <p className="mb-2 text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
                Worked solution
              </p>
              <RichText blocks={exercise.solution} />
            </div>
          )}
        </section>
      )}

      {stage.debrief && showFeedback && <RichText blocks={stage.debrief} />}

      {stage.derivation && (
        <Collapsible title={stage.derivation.title} onOpen={handlers.onOpenDerivation}>
          <RichText blocks={stage.derivation.blocks} />
        </Collapsible>
      )}
    </div>
  );
}
