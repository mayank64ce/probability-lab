import { Link } from "react-router-dom";
import { useProgress } from "../app/ProgressContext";
import { attemptedConceptIds, conceptSnapshots } from "../engine/selectors";
import { dueReviews, nextReviewAt, REVIEW_REASON_LABELS } from "../engine/reviewScheduler";
import { conceptTitle } from "../content/curriculum";
import { lessonsForConcept } from "../content/lessons";
import { Card, SectionHeading } from "../components/ui/Card";
import { Badge, MasteryBadge } from "../components/ui/Badge";

function formatDue(ts: number, now: number): string {
  const days = Math.round((ts - now) / 86_400_000);
  if (days <= 0) return "due now";
  if (days === 1) return "in 1 day";
  return `in ${days} days`;
}

/**
 * Review surfaces whatever the scheduler says is due, from real attempt data.
 * With one lesson published the list is naturally short — it is not a mockup.
 */
export function Review() {
  const { state } = useProgress();
  const now = Date.now();

  const touched = attemptedConceptIds(state.attempts);
  const due = dueReviews(touched, state.attempts, now);
  const snapshots = conceptSnapshots(touched, state.attempts, now);
  const upcoming = snapshots
    .map((s) => ({ ...s, dueAt: nextReviewAt(s.stats) }))
    .filter((s): s is typeof s & { dueAt: number } => s.dueAt !== null && s.dueAt > now)
    .sort((a, b) => a.dueAt - b.dueAt);

  return (
    <div className="space-y-7">
      <section>
        <h1 className="text-3xl font-extrabold sm:text-4xl">Review</h1>
        <p className="text-ink-muted mt-1.5">
          Concepts come back on a spaced schedule — sooner if you missed them, later each time you
          recall them cleanly.
        </p>
      </section>

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
          <ul className="space-y-2">
            {due.map((item) => {
              const lesson = lessonsForConcept(item.conceptId)[0];
              return (
                <li key={item.conceptId}>
                  <Card>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-bold">{conceptTitle(item.conceptId)}</p>
                        <p className="text-ink-muted mt-0.5 text-sm">
                          {REVIEW_REASON_LABELS[item.reason]} · {item.stats.correct}/
                          {item.stats.total} correct
                          {item.stats.hintsUsed > 0 && ` · ${item.stats.hintsUsed} hints`}
                        </p>
                      </div>
                      <MasteryBadge state={item.mastery} />
                    </div>
                    {lesson && (
                      <Link
                        to={`/lesson/${lesson.id}`}
                        className="border-line hover:border-accent hover:bg-accent-soft/40 mt-4 block rounded-2xl border-2 px-4 py-3 font-bold transition-colors"
                      >
                        Revisit {lesson.title} ›
                      </Link>
                    )}
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
            <ul className="space-y-2.5">
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
