import type { LessonStage } from "../../content/schema";
import type { StageState } from "../../engine/lessonRunner";
import { hintsAvailable } from "../../engine/lessonRunner";
import { RichText } from "../ui/RichText";
import { Collapsible } from "../ui/Collapsible";
import { Visualization } from "../visualizations/registry";
import { MultipleChoiceView } from "../exercises/MultipleChoiceView";
import { NumericView } from "../exercises/NumericView";
import { StepsView } from "../exercises/StepsView";
import { useVisualGrading } from "../exercises/VisualView";
import type { Feedback } from "../exercises/Feedback";
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
 *
 * The verdict is deliberately not rendered here — it belongs to the action bar
 * at the bottom of the lesson, so the learner's own answer stays visible while
 * the explanation arrives beneath it.
 */
export function StageView({
  stage,
  state,
  showFeedback,
  handlers,
}: {
  stage: LessonStage;
  state: StageState;
  showFeedback: boolean;
  handlers: StageHandlers;
}) {
  const exercise = stage.exercise;
  const visualHandler = useVisualGrading(
    exercise?.kind === "visual" ? exercise : undefined,
    state.submitted,
    handlers.onSubmit,
  );

  return (
    <div className="space-y-6">
      {stage.intro && (
        <div className="text-[1.05rem] leading-[1.7]">
          <RichText blocks={stage.intro} />
        </div>
      )}

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
          className="border-line bg-surface rounded-card space-y-5 border p-5 shadow-card sm:p-6"
        >
          <div className="text-[1.05rem] leading-[1.7] font-medium">
            <RichText blocks={exercise.prompt} />
          </div>

          {exercise.kind === "multiple-choice" && (
            <MultipleChoiceView
              exercise={exercise}
              submitted={state.submitted}
              onSubmit={handlers.onSubmit}
            />
          )}

          {exercise.kind === "steps" && (
            <StepsView
              exercise={exercise}
              submitted={state.submitted}
              onSubmit={handlers.onSubmit}
            />
          )}

          {exercise.kind === "numeric" && (
            <NumericView
              exercise={exercise}
              submitted={state.submitted}
              wasCorrect={state.correct}
              onSubmit={handlers.onSubmit}
            />
          )}

          {/* Hints are noise once the answer is already right. */}
          {exercise.kind !== "visual" && !(state.submitted && state.correct) && (
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
            <div className="bg-sunken animate-rise rounded-2xl px-5 py-4">
              <p className="text-ink-muted mb-2 text-xs font-extrabold tracking-wide uppercase">
                Worked solution
              </p>
              <RichText blocks={exercise.solution} />
            </div>
          )}
        </section>
      )}

      {stage.debrief && showFeedback && (
        <div className="animate-rise text-[1.05rem] leading-[1.7]">
          <RichText blocks={stage.debrief} />
        </div>
      )}

      {stage.derivation && (
        <Collapsible title={stage.derivation.title} onOpen={handlers.onOpenDerivation}>
          <RichText blocks={stage.derivation.blocks} />
        </Collapsible>
      )}
    </div>
  );
}
