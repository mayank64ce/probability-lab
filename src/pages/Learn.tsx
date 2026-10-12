import { Link } from "react-router-dom";
import { useProgress } from "../app/ProgressContext";
import { UNITS, TOPICS_BY_ID, CONCEPTS_BY_ID, conceptTitle, COURSE } from "../content/curriculum";
import { lessonsForConcept } from "../content/lessons";
import { summarizeConcept, masteryState } from "../engine/masteryTracker";
import { lessonProgressRatio } from "../engine/lessonRunner";
import { Card } from "../components/ui/Card";
import { Badge, MasteryBadge } from "../components/ui/Badge";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Icon } from "../components/ui/Icon";

/**
 * The whole curriculum, open at every point. Nothing is locked: prerequisites
 * are shown as guidance, never as a gate.
 */
export function Learn() {
  const { state } = useProgress();
  const now = Date.now();

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-3xl font-extrabold sm:text-4xl">Learn</h1>
        <p className="text-ink-muted mt-1.5">
          Every topic is open. Follow the order or jump straight to what you need.
        </p>
      </header>

      {UNITS.map((unit) => (
        <section key={unit.id} id={unit.id} className="scroll-mt-24">
          <div className="border-line mb-5 border-b pb-5">
            <p className="text-accent-ink text-xs font-extrabold tracking-[0.1em] uppercase">
              {unit.label}
            </p>
            <h2 className="mt-1.5 text-2xl font-extrabold">{unit.title}</h2>
            <p className="text-ink-muted mt-1.5">{unit.summary}</p>
          </div>

          <div className="space-y-7">
            {unit.topicIds.map((topicId) => {
              const topic = TOPICS_BY_ID.get(topicId);
              if (!topic) return null;

              return (
                <div key={topicId}>
                  <h3 className="text-ink-muted mb-3 text-xs font-extrabold tracking-[0.08em] uppercase">
                    {topic.title}
                  </h3>
                  <ul className="space-y-2.5">
                    {topic.conceptIds.map((conceptId) => {
                      const concept = CONCEPTS_BY_ID.get(conceptId);
                      const lessons = lessonsForConcept(conceptId);
                      const stats = summarizeConcept(conceptId, state.attempts);
                      const mastery = masteryState(stats, now);

                      // Most of the curriculum has no lesson written yet.
                      // Those concepts are listed, but compactly, so the few
                      // that are playable are what the eye lands on.
                      if (lessons.length === 0) {
                        return (
                          <li
                            key={conceptId}
                            className="border-line flex items-center justify-between gap-4 rounded-2xl border border-dashed px-4 py-3"
                          >
                            <div className="min-w-0">
                              <p className="text-ink-muted font-semibold">
                                {concept?.title ?? conceptId}
                              </p>
                              {concept?.objective && (
                                <p className="text-ink-muted/70 mt-0.5 text-xs leading-relaxed">
                                  {concept.objective}
                                </p>
                              )}
                            </div>
                            <Badge tone="outline">Soon</Badge>
                          </li>
                        );
                      }

                      return (
                        <li key={conceptId}>
                          <Card>
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0 flex-1">
                                <p className="font-bold">{concept?.title ?? conceptId}</p>
                                {concept?.objective && (
                                  <p className="text-ink-muted mt-1 text-sm leading-relaxed">
                                    {concept.objective}
                                  </p>
                                )}
                                {concept && concept.prerequisites.length > 0 && (
                                  <p className="text-ink-muted mt-2 text-xs">
                                    <span className="font-bold">Builds on:</span>{" "}
                                    {concept.prerequisites.map((p) => conceptTitle(p)).join(", ")}
                                  </p>
                                )}
                              </div>
                              {stats.total > 0 && <MasteryBadge state={mastery} />}
                            </div>

                            <ul className="mt-4 space-y-2.5">
                              {lessons.map((lesson) => {
                                const progress = state.lessons[lesson.id];
                                const ratio = lessonProgressRatio(
                                  lesson.stageIds,
                                  progress?.completedStageIds ?? [],
                                );
                                const started = progress !== undefined;
                                const done = progress?.completedAt !== undefined;

                                return (
                                  <li key={lesson.id}>
                                    <Link
                                      to={`/lesson/${lesson.id}`}
                                      className="border-line hover:border-accent hover:bg-accent-soft/40 block rounded-2xl border-2 px-4 py-3.5 transition-colors"
                                    >
                                      <div className="flex items-center justify-between gap-3">
                                        <span className="flex min-w-0 items-center gap-2.5 font-bold">
                                          <Icon
                                            name={done ? "check" : "sparkle"}
                                            size={17}
                                            className={done ? "text-good" : "text-accent"}
                                          />
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
                                        <div className="mt-3">
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

      <footer className="border-line text-ink-muted border-t pt-6 text-xs leading-relaxed">
        <p>
          Curriculum mapped from{" "}
          <a
            href={COURSE.url}
            target="_blank"
            rel="noreferrer noopener"
            className="text-accent-ink font-semibold underline"
          >
            {COURSE.code} {COURSE.title}
          </a>{" "}
          ({COURSE.term}, {COURSE.instructor}), {COURSE.institution}, used under{" "}
          <a
            href={COURSE.licenseUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="text-accent-ink font-semibold underline"
          >
            {COURSE.license}
          </a>
          . All lessons and problems here are original; MIT material is linked, not reproduced.
        </p>
      </footer>
    </div>
  );
}
