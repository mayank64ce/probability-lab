import { Link } from "react-router-dom";
import { useProgress } from "../app/ProgressContext";
import { UNITS, TOPICS_BY_ID, CONCEPTS_BY_ID, conceptTitle, COURSE } from "../content/curriculum";
import { lessonsForConcept } from "../content/lessons";
import { summarizeConcept, masteryState } from "../engine/masteryTracker";
import { lessonProgressRatio } from "../engine/lessonRunner";
import { Card } from "../components/ui/Card";
import { Badge, MasteryBadge } from "../components/ui/Badge";
import { ProgressBar } from "../components/ui/ProgressBar";

/**
 * The whole curriculum, open at every point. Nothing is locked: prerequisites
 * are shown as guidance, never as a gate.
 */
export function Learn() {
  const { state } = useProgress();
  const now = Date.now();

  return (
    <div className="space-y-7">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Learn</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Every topic is open. Follow the order or jump straight to what you need.
        </p>
      </section>

      {UNITS.map((unit) => (
        <section key={unit.id} id={unit.id} className="scroll-mt-20">
          <div className="mb-3">
            <p className="text-xs font-semibold" style={{ color: "var(--accent-text)" }}>
              {unit.label}
            </p>
            <h2 className="mt-0.5 text-lg font-semibold">{unit.title}</h2>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              {unit.summary}
            </p>
          </div>

          <div className="space-y-4">
            {unit.topicIds.map((topicId) => {
              const topic = TOPICS_BY_ID.get(topicId);
              if (!topic) return null;

              return (
                <div key={topicId}>
                  <h3 className="mb-2 text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
                    {topic.title}
                  </h3>
                  <ul className="space-y-2">
                    {topic.conceptIds.map((conceptId) => {
                      const concept = CONCEPTS_BY_ID.get(conceptId);
                      const lessons = lessonsForConcept(conceptId);
                      const stats = summarizeConcept(conceptId, state.attempts);
                      const mastery = masteryState(stats, now);

                      return (
                        <li key={conceptId}>
                          <Card>
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <p className="font-medium">{concept?.title ?? conceptId}</p>
                                {concept?.objective && (
                                  <p
                                    className="mt-0.5 text-xs leading-relaxed"
                                    style={{ color: "var(--text-muted)" }}
                                  >
                                    {concept.objective}
                                  </p>
                                )}
                                {concept && concept.prerequisites.length > 0 && (
                                  <p
                                    className="mt-1.5 text-xs"
                                    style={{ color: "var(--text-muted)" }}
                                  >
                                    <span className="font-medium">Builds on:</span>{" "}
                                    {concept.prerequisites.map((p) => conceptTitle(p)).join(", ")}
                                  </p>
                                )}
                              </div>
                              {stats.total > 0 && <MasteryBadge state={mastery} />}
                            </div>

                            {lessons.length > 0 ? (
                              <ul className="mt-3 space-y-2">
                                {lessons.map((lesson) => {
                                  const progress = state.lessons[lesson.id];
                                  const ratio = lessonProgressRatio(
                                    lesson,
                                    progress?.completedStageIds ?? [],
                                  );
                                  const started = progress !== undefined;
                                  const done = progress?.completedAt !== undefined;

                                  return (
                                    <li key={lesson.id}>
                                      <Link
                                        to={`/lesson/${lesson.id}`}
                                        className="block rounded-xl px-3.5 py-3"
                                        style={{
                                          background: "var(--surface-raised)",
                                          border: "1px solid var(--border)",
                                        }}
                                      >
                                        <div className="flex items-center justify-between gap-3">
                                          <span className="min-w-0 text-sm font-medium">
                                            {lesson.title}
                                          </span>
                                          <Badge
                                            tone={done ? "correct" : started ? "accent" : "neutral"}
                                          >
                                            {done
                                              ? "Complete"
                                              : started
                                                ? "In progress"
                                                : `${lesson.estimatedMinutes} min`}
                                          </Badge>
                                        </div>
                                        {started && !done && (
                                          <div className="mt-2">
                                            <ProgressBar
                                              value={ratio}
                                              compact
                                              label={`${lesson.title} progress`}
                                            />
                                          </div>
                                        )}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            ) : (
                              <p className="mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
                                Lesson not written yet.
                              </p>
                            )}
                          </Card>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <footer className="pt-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
        <p>
          Curriculum mapped from{" "}
          <a
            href={COURSE.url}
            target="_blank"
            rel="noreferrer noopener"
            className="underline"
            style={{ color: "var(--accent-text)" }}
          >
            {COURSE.code} {COURSE.title}
          </a>{" "}
          ({COURSE.term}, {COURSE.instructor}), {COURSE.institution}, used under{" "}
          <a
            href={COURSE.licenseUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="underline"
            style={{ color: "var(--accent-text)" }}
          >
            {COURSE.license}
          </a>
          . All lessons and problems here are original; MIT material is linked, not reproduced.
        </p>
      </footer>
    </div>
  );
}
