import { useState } from "react";
import { Link } from "react-router-dom";
import { useProgress } from "../app/ProgressContext";
import { attemptedConceptIds, conceptSnapshots } from "../engine/selectors";
import { dueReviews, nextReviewAt, REVIEW_REASON_LABELS } from "../engine/reviewScheduler";
import { planSession } from "../engine/practiceSession";
import { conceptTitle } from "../content/curriculum";
import { lessonsForConcept } from "../content/lessons";
import { BANK_INDEX, loadExercises } from "../content/banks";
import type { Exercise } from "../content/schema";
import { Card, IconTile, SectionHeading } from "../components/ui/Card";
import { Badge, Eyebrow, MasteryBadge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { SessionRunner } from "../components/practice/SessionRunner";

function formatDue(ts: number, now: number): string {
  const days = Math.round((ts - now) / 86_400_000);
  if (days <= 0) return "due now";
  if (days === 1) return "in 1 day";
  return `in ${days} days`;
}

/**
 * Review surfaces whatever the scheduler says is due, from real attempt data,
 * and now lets the learner actually do something about it: a session drawn
 * from the banks and restricted to the concepts that came round.
 */
export function Review() {
  const { state } = useProgress();
  const now = Date.now();

  const [session, setSession] = useState<Exercise[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const touched = attemptedConceptIds(state.attempts);
  const due = dueReviews(touched, state.attempts, now);
  const snapshots = conceptSnapshots(touched, state.attempts, now);
  const upcoming = snapshots
    .map((s) => ({ ...s, dueAt: nextReviewAt(s.stats) }))
    .filter((s): s is typeof s & { dueAt: number } => s.dueAt !== null && s.dueAt > now)
    .sort((a, b) => a.dueAt - b.dueAt);

  async function startReview() {
    setLoading(true);
    setNotice(null);
    try {
      const pool = await loadExercises(BANK_INDEX.map((b) => b.topicId));
      const exercises = planSession(pool, {
        kind: "review",
        size: 6,
        attempts: state.attempts,
        now: Date.now(),
        conceptIds: due.map((d) => d.conceptId),
      });
      if (exercises.length === 0) {
        setNotice(
          "No bank problems cover those concepts yet. Revisiting the lesson is the next best thing.",
        );
        return;
      }
      setSession(exercises);
    } finally {
      setLoading(false);
    }
  }

  if (session) {
    return (
      <SessionRunner
        title="Review"
        subtitle={`${session.length} problem${session.length === 1 ? "" : "s"} on concepts that came round`}
        exercises={session}
        onExit={() => setSession(null)}
      />
    );
  }

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-extrabold sm:text-4xl">Review</h1>
        <p className="text-ink-muted mt-1.5">
          Concepts come back on a spaced schedule — sooner if you missed them, later each time you
          recall them cleanly.
        </p>
      </header>

      {due.length > 0 && (
        <Card tone="accent">
          <Eyebrow>Due now</Eyebrow>
          <h2 className="mt-2 text-2xl font-extrabold">
            {due.length} concept{due.length === 1 ? "" : "s"} ready for another look
          </h2>
          <p className="mt-2 leading-relaxed">
            A short session drawn from the practice banks, restricted to what came round.
          </p>
          <Button
            size="lg"
            className="mt-6 w-full sm:w-auto sm:px-10"
            disabled={loading}
            onClick={() => void startReview()}
          >
            {loading ? "Building a session…" : "Start review session"}
            <Icon name="chevron" size={18} strokeWidth={2.5} />
          </Button>
        </Card>
      )}

      {notice && (
        <Card>
          <p role="status" className="text-ink-muted leading-relaxed">
            {notice}
          </p>
        </Card>
      )}

      <section>
        <SectionHeading title="Due now" />
        {due.length === 0 ? (
          <Card>
            <p className="text-ink-muted">
              {touched.length === 0
                ? "Nothing to review yet. Finish a lesson and concepts will start appearing here."
                : "Nothing due right now. Check the schedule below for what is coming."}
            </p>
          </Card>
        ) : (
          <ul className="space-y-2.5">
            {due.map((item) => {
              const lesson = lessonsForConcept(item.conceptId)[0];
              return (
                <li key={item.conceptId}>
                  <Card className="flex items-center gap-4">
                    <IconTile tone="warn">
                      <Icon name="repeat" />
                    </IconTile>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold">{conceptTitle(item.conceptId)}</p>
                      <p className="text-ink-muted mt-0.5 text-sm">
                        {REVIEW_REASON_LABELS[item.reason]} · {item.stats.correct}/
                        {item.stats.total} correct
                        {item.stats.hintsUsed > 0 && ` · ${item.stats.hintsUsed} hints`}
                      </p>
                      {lesson && (
                        <Link
                          to={`/lesson/${lesson.id}`}
                          className="text-accent-ink mt-1.5 inline-block text-sm font-bold"
                        >
                          Revisit {lesson.title} →
                        </Link>
                      )}
                    </div>
                    <MasteryBadge state={item.mastery} />
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {upcoming.length > 0 && (
        <section>
          <SectionHeading title="Scheduled" hint="Nothing to do until these come around" />
          <Card>
            <ul className="space-y-3">
              {upcoming.map((item) => (
                <li key={item.conceptId} className="flex items-center justify-between gap-3">
                  <span className="min-w-0 truncate font-semibold">
                    {conceptTitle(item.conceptId)}
                  </span>
                  <Badge>{formatDue(item.dueAt, now)}</Badge>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}
    </div>
  );
}
