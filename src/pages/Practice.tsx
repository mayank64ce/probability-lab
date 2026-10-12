import { Link } from "react-router-dom";
import { useProgress } from "../app/ProgressContext";
import { TAUGHT_CONCEPT_IDS, lessonsForConcept } from "../content/lessons";
import { conceptTitle } from "../content/curriculum";
import { summarizeConcept, masteryState } from "../engine/masteryTracker";
import { Card, SectionHeading } from "../components/ui/Card";
import { Eyebrow, MasteryBadge } from "../components/ui/Badge";

/**
 * Practice is deliberately honest about its state: the mixing policy and the
 * session runner arrive with the exercise bank in phase 2, so nothing here
 * pretends to be a working practice session yet.
 */
export function Practice() {
  const { state } = useProgress();
  const now = Date.now();

  return (
    <div className="space-y-7">
      <section>
        <h1 className="text-3xl font-extrabold sm:text-4xl">Practice</h1>
        <p className="text-ink-muted mt-1.5">
          Drill a single topic, or let a mixed session pick for you.
        </p>
      </section>

      <Card tone="accent">
        <Eyebrow>Not available yet</Eyebrow>
        <h2 className="mt-2 text-xl font-extrabold">The exercise bank is still being written</h2>
        <p className="text-ink-muted mt-2 leading-relaxed">
          Practice sessions need a pool of problems to draw from. Right now the only graded
          questions live inside the lessons themselves. Once the bank lands, this screen will offer
          topic practice and a smart mix weighted towards your current topic, your weak concepts,
          and older material due for another look.
        </p>
      </Card>

      <section>
        <SectionHeading
          title="What you can practise today"
          hint="Lesson questions, including the unassisted challenge at the end"
        />
        {TAUGHT_CONCEPT_IDS.length === 0 ? (
          <Card>
            <p className="text-ink-muted">No lessons published yet.</p>
          </Card>
        ) : (
          <ul className="space-y-2">
            {TAUGHT_CONCEPT_IDS.map((conceptId) => {
              const stats = summarizeConcept(conceptId, state.attempts);
              const lessons = lessonsForConcept(conceptId);

              return (
                <li key={conceptId}>
                  <Card>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-bold">{conceptTitle(conceptId)}</p>
                        <p className="text-ink-muted mt-0.5 text-sm">
                          {stats.total === 0
                            ? "Not attempted yet"
                            : `${stats.correct} of ${stats.total} correct · ${stats.independentCorrect} unassisted`}
                        </p>
                      </div>
                      {stats.total > 0 && <MasteryBadge state={masteryState(stats, now)} />}
                    </div>
                    {lessons.map((lesson) => (
                      <Link
                        key={lesson.id}
                        to={`/lesson/${lesson.id}`}
                        className="border-line hover:border-accent hover:bg-accent-soft/40 mt-4 block rounded-2xl border-2 px-4 py-3 font-bold transition-colors"
                      >
                        Replay {lesson.title} ›
                      </Link>
                    ))}
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
