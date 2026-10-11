import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useProgress } from "../app/ProgressContext";
import { dashboardData } from "../engine/selectors";
import { lessonById } from "../content/lessons";
import { UNITS, conceptTitle, conceptsForUnit, COURSE } from "../content/curriculum";
import { lessonProgressRatio } from "../engine/lessonRunner";
import { REVIEW_REASON_LABELS } from "../engine/reviewScheduler";
import { Card, SectionHeading } from "../components/ui/Card";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Badge, MasteryBadge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

function relativeTime(ts: number, now: number): string {
  const diff = now - ts;
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
}

export function Dashboard() {
  const { state } = useProgress();
  const now = Date.now();
  const data = useMemo(() => dashboardData(state, now), [state, now]);

  const nextLesson = data.recommendedLessonId ? lessonById(data.recommendedLessonId) : null;
  const resumeLesson = data.resumeLessonId ? lessonById(data.resumeLessonId) : null;
  const resumeProgress = resumeLesson
    ? lessonProgressRatio(resumeLesson, state.lessons[resumeLesson.id]?.completedStageIds ?? [])
    : 0;

  return (
    <div className="space-y-7">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Probability Lab</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Short interactive lessons across the {COURSE.code} curriculum.
        </p>
      </section>

      {/* Resume takes priority over a fresh recommendation. */}
      {resumeLesson ? (
        <Card raised>
          <p
            className="text-xs font-semibold tracking-wide uppercase"
            style={{ color: "var(--accent-text)" }}
          >
            Pick up where you left off
          </p>
          <h2 className="mt-1.5 text-lg font-semibold">{resumeLesson.title}</h2>
          <div className="mt-3">
            <ProgressBar value={resumeProgress} label={`${resumeLesson.title} progress`} compact />
            <p className="mt-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
              {Math.round(resumeProgress * 100)}% complete
            </p>
          </div>
          <Link to={`/lesson/${resumeLesson.id}`} className="mt-4 block">
            <Button className="w-full">Resume lesson</Button>
          </Link>
        </Card>
      ) : nextLesson ? (
        <Card raised>
          <p
            className="text-xs font-semibold tracking-wide uppercase"
            style={{ color: "var(--accent-text)" }}
          >
            Recommended next
          </p>
          <h2 className="mt-1.5 text-lg font-semibold">{nextLesson.title}</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            {nextLesson.blurb}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <Badge tone="accent">{nextLesson.estimatedMinutes} min</Badge>
            {nextLesson.conceptIds.map((id) => (
              <Badge key={id}>{conceptTitle(id)}</Badge>
            ))}
          </div>
          <Link to={`/lesson/${nextLesson.id}`} className="mt-4 block">
            <Button className="w-full">Start lesson</Button>
          </Link>
        </Card>
      ) : (
        <Card raised>
          <h2 className="text-lg font-semibold">Everything available is complete</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            More lessons are being written. Review keeps what you have learned sharp in the
            meantime.
          </p>
        </Card>
      )}

      {/* Course progress */}
      <section>
        <SectionHeading title="Your progress" hint="Across the lessons published so far" />
        <Card>
          <ProgressBar value={data.progress.ratio} label="Course progress" />
          <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
            {[
              {
                label: "Lessons done",
                value: `${data.progress.lessonsCompleted}/${data.progress.lessonsAvailable}`,
              },
              { label: "Concepts met", value: String(data.progress.conceptsTouched) },
              {
                label: "Recent accuracy",
                value:
                  data.performance.attempts === 0
                    ? "—"
                    : `${Math.round(data.performance.accuracy * 100)}%`,
              },
            ].map((item) => (
              <div key={item.label}>
                <dd className="text-xl font-semibold tabular-nums">{item.value}</dd>
                <dt className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
                  {item.label}
                </dt>
              </div>
            ))}
          </dl>
        </Card>
      </section>

      {/* Weak concepts */}
      <section>
        <SectionHeading title="Weak concepts" hint="Where the evidence says you are shaky" />
        {data.weak.length === 0 ? (
          <Card>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {data.performance.attempts === 0
                ? "Nothing yet — answer some questions and anything shaky will surface here."
                : "No weak spots right now. Keep going."}
            </p>
          </Card>
        ) : (
          <ul className="space-y-2">
            {data.weak.map((item) => (
              <li key={item.conceptId}>
                <Card>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium">{conceptTitle(item.conceptId)}</p>
                      <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
                        {REVIEW_REASON_LABELS[item.reason]} · {item.stats.correct}/
                        {item.stats.total} correct
                      </p>
                    </div>
                    <MasteryBadge state={item.mastery} />
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Reviews due */}
      <section>
        <SectionHeading
          title="Reviews due"
          action={
            data.due.length > 0 ? (
              <Link
                to="/review"
                className="text-sm font-semibold"
                style={{ color: "var(--accent-text)" }}
              >
                See all
              </Link>
            ) : undefined
          }
        />
        <Card>
          {data.due.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Nothing due. Concepts reappear here on a spaced schedule.
            </p>
          ) : (
            <ul className="space-y-2">
              {data.due.slice(0, 4).map((item) => (
                <li key={item.conceptId} className="flex items-center justify-between gap-3">
                  <span className="min-w-0 truncate text-sm font-medium">
                    {conceptTitle(item.conceptId)}
                  </span>
                  <Badge tone="warn">{REVIEW_REASON_LABELS[item.reason]}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      {/* Recent performance */}
      {data.performance.attempts > 0 && (
        <section>
          <SectionHeading title="Recent performance" hint="Your last 20 answers" />
          <Card>
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Answered", value: String(data.performance.attempts) },
                { label: "Correct", value: String(data.performance.correct) },
                {
                  label: "Unassisted",
                  value: `${data.performance.independentCorrect}/${data.performance.independent}`,
                },
                { label: "Hints used", value: String(data.performance.hintsUsed) },
              ].map((item) => (
                <div key={item.label}>
                  <dd className="text-lg font-semibold tabular-nums">{item.value}</dd>
                  <dt className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {item.label}
                  </dt>
                </div>
              ))}
            </dl>
            {data.performance.lastActiveAt && (
              <p className="mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
                Last active {relativeTime(data.performance.lastActiveAt, now)}.
              </p>
            )}
          </Card>
        </section>
      )}

      {/* The four MIT units */}
      <section>
        <SectionHeading title="The curriculum" hint={`${COURSE.code} · ${COURSE.institution}`} />
        <ul className="space-y-2">
          {UNITS.map((unit) => {
            const concepts = conceptsForUnit(unit.id);
            const withContent = concepts.filter((c) =>
              data.snapshots.some((s) => s.conceptId === c.id && s.stats.total > 0),
            ).length;

            return (
              <li key={unit.id}>
                <Link to={`/learn#${unit.id}`} className="block">
                  <Card className="transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p
                          className="text-xs font-semibold"
                          style={{ color: "var(--accent-text)" }}
                        >
                          {unit.label}
                        </p>
                        <p className="mt-0.5 font-medium">{unit.title}</p>
                        <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                          {concepts.length} concepts · {withContent} started
                        </p>
                      </div>
                      <span aria-hidden="true" style={{ color: "var(--text-muted)" }}>
                        ›
                      </span>
                    </div>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
