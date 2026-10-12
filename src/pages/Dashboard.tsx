import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useProgress } from "../app/ProgressContext";
import { dashboardData } from "../engine/selectors";
import { lessonMeta } from "../content/lessons";
import { UNITS, conceptTitle, conceptsForUnit, COURSE } from "../content/curriculum";
import { lessonProgressRatio } from "../engine/lessonRunner";
import { REVIEW_REASON_LABELS } from "../engine/reviewScheduler";
import { Card, IconTile, SectionHeading } from "../components/ui/Card";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Badge, Eyebrow, MasteryBadge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";

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

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-line bg-surface rounded-2xl border px-4 py-3.5 text-center">
      <p className="text-2xl font-extrabold tabular-nums">{value}</p>
      <p className="text-ink-muted mt-0.5 text-xs font-semibold">{label}</p>
    </div>
  );
}

export function Dashboard() {
  const { state } = useProgress();
  const now = Date.now();
  const data = useMemo(() => dashboardData(state, now), [state, now]);

  const nextLesson = data.recommendedLessonId ? lessonMeta(data.recommendedLessonId) : null;
  const resumeLesson = data.resumeLessonId ? lessonMeta(data.resumeLessonId) : null;
  const resumeProgress = resumeLesson
    ? lessonProgressRatio(
        resumeLesson.stageIds,
        state.lessons[resumeLesson.id]?.completedStageIds ?? [],
      )
    : 0;

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-extrabold sm:text-4xl">Probability Lab</h1>
        <p className="text-ink-muted mt-1.5">
          Short interactive lessons across the {COURSE.code} curriculum.
        </p>
      </header>

      {/* Resume takes priority over a fresh recommendation. */}
      {resumeLesson ? (
        <Card tone="accent">
          <Eyebrow>Pick up where you left off</Eyebrow>
          <h2 className="mt-2 text-2xl font-extrabold">{resumeLesson.title}</h2>
          <div className="mt-5">
            <ProgressBar value={resumeProgress} label={`${resumeLesson.title} progress`} />
            <p className="text-ink-muted mt-2 text-sm font-semibold">
              {Math.round(resumeProgress * 100)}% complete
            </p>
          </div>
          <Link to={`/lesson/${resumeLesson.id}`} className="mt-6 block sm:inline-block">
            <Button size="lg" className="w-full sm:w-auto sm:px-10">
              Resume lesson
              <Icon name="chevron" size={18} strokeWidth={2.5} />
            </Button>
          </Link>
        </Card>
      ) : nextLesson ? (
        <Card tone="accent">
          <Eyebrow>Recommended next</Eyebrow>
          <h2 className="mt-2 text-2xl font-extrabold">{nextLesson.title}</h2>
          <p className="mt-2 leading-relaxed">{nextLesson.blurb}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge tone="accent">{nextLesson.estimatedMinutes} min</Badge>
            {nextLesson.conceptIds.map((id) => (
              <Badge key={id} tone="outline">
                {conceptTitle(id)}
              </Badge>
            ))}
          </div>
          <Link to={`/lesson/${nextLesson.id}`} className="mt-6 block sm:inline-block">
            <Button size="lg" className="w-full sm:w-auto sm:px-10">
              Start lesson
              <Icon name="chevron" size={18} strokeWidth={2.5} />
            </Button>
          </Link>
        </Card>
      ) : (
        <Card tone="accent">
          <Eyebrow>All caught up</Eyebrow>
          <h2 className="mt-2 text-2xl font-extrabold">Everything available is complete</h2>
          <p className="mt-2 leading-relaxed">
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
          <div className="mt-5 grid grid-cols-3 gap-2.5">
            <Stat
              value={`${data.progress.lessonsCompleted}/${data.progress.lessonsAvailable}`}
              label="Lessons done"
            />
            <Stat value={String(data.progress.conceptsTouched)} label="Concepts met" />
            <Stat
              value={
                data.performance.attempts === 0
                  ? "—"
                  : `${Math.round(data.performance.accuracy * 100)}%`
              }
              label="Recent accuracy"
            />
          </div>
        </Card>
      </section>

      {/* Weak concepts */}
      <section>
        <SectionHeading title="Weak concepts" hint="Where the evidence says you are shaky" />
        {data.weak.length === 0 ? (
          <Card>
            <p className="text-ink-muted">
              {data.performance.attempts === 0
                ? "Nothing yet — answer some questions and anything shaky will surface here."
                : "No weak spots right now. Keep going."}
            </p>
          </Card>
        ) : (
          <ul className="space-y-2.5">
            {data.weak.map((item) => (
              <li key={item.conceptId}>
                <Card className="flex items-center gap-4">
                  <IconTile tone="warn">
                    <Icon name="target" />
                  </IconTile>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold">{conceptTitle(item.conceptId)}</p>
                    <p className="text-ink-muted mt-0.5 text-sm">
                      {REVIEW_REASON_LABELS[item.reason]} · {item.stats.correct}/{item.stats.total}{" "}
                      correct
                    </p>
                  </div>
                  <MasteryBadge state={item.mastery} />
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
              <Link to="/review" className="text-accent-ink text-sm font-bold">
                See all
              </Link>
            ) : undefined
          }
        />
        <Card>
          {data.due.length === 0 ? (
            <p className="text-ink-muted">
              Nothing due. Concepts reappear here on a spaced schedule.
            </p>
          ) : (
            <ul className="space-y-3">
              {data.due.slice(0, 4).map((item) => (
                <li key={item.conceptId} className="flex items-center justify-between gap-3">
                  <span className="min-w-0 truncate font-semibold">
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
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              <Stat value={String(data.performance.attempts)} label="Answered" />
              <Stat value={String(data.performance.correct)} label="Correct" />
              <Stat
                value={`${data.performance.independentCorrect}/${data.performance.independent}`}
                label="Unassisted"
              />
              <Stat value={String(data.performance.hintsUsed)} label="Hints used" />
            </div>
            {data.performance.lastActiveAt && (
              <p className="text-ink-muted mt-4 text-sm">
                Last active {relativeTime(data.performance.lastActiveAt, now)}.
              </p>
            )}
          </Card>
        </section>
      )}

      {/* The four MIT units */}
      <section>
        <SectionHeading title="The curriculum" hint={`${COURSE.code} · ${COURSE.institution}`} />
        <ul className="space-y-2.5">
          {UNITS.map((unit) => {
            const concepts = conceptsForUnit(unit.id);
            const withContent = concepts.filter((c) =>
              data.snapshots.some((s) => s.conceptId === c.id && s.stats.total > 0),
            ).length;

            return (
              <li key={unit.id}>
                <Link to={`/learn#${unit.id}`} className="block">
                  <Card interactive className="flex items-center gap-4">
                    <IconTile>
                      <Icon name="book" />
                    </IconTile>
                    <div className="min-w-0 flex-1">
                      <p className="text-accent-ink text-xs font-extrabold tracking-wide">
                        {unit.label}
                      </p>
                      <p className="mt-0.5 font-bold">{unit.title}</p>
                      <p className="text-ink-muted mt-0.5 text-sm">
                        {concepts.length} concepts · {withContent} started
                      </p>
                    </div>
                    <Icon name="chevron" className="text-ink-muted" />
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
