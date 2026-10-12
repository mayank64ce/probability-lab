import { useState } from "react";
import { Link } from "react-router-dom";
import { useProgress } from "../app/ProgressContext";
import { BANK_INDEX, loadExercises } from "../content/banks";
import { TOPICS_BY_ID, conceptTitle } from "../content/curriculum";
import { TAUGHT_CONCEPT_IDS } from "../content/lessons";
import { summarizeConcept, masteryState } from "../engine/masteryTracker";
import { planSession } from "../engine/practiceSession";
import type { Exercise } from "../content/schema";
import { Card, IconTile, SectionHeading } from "../components/ui/Card";
import { Badge, Eyebrow, MasteryBadge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { SessionRunner } from "../components/practice/SessionRunner";

const SESSION_SIZE = 6;

interface ActiveSession {
  title: string;
  subtitle: string;
  exercises: Exercise[];
}

/**
 * Practice draws on the topic banks, which are kept apart from the lessons.
 * A session is planned by `planSession`, so what you get is weighted towards
 * weak concepts and material that has come round again — not a fixed list.
 */
export function Practice() {
  const { state } = useProgress();
  const now = Date.now();

  const [session, setSession] = useState<ActiveSession | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [emptyNotice, setEmptyNotice] = useState<string | null>(null);

  async function start(kind: "topic" | "mixed", topicId?: string) {
    const topicIds = topicId ? [topicId] : BANK_INDEX.map((b) => b.topicId);
    setLoading(topicId ?? "mixed");
    setEmptyNotice(null);
    try {
      const pool = await loadExercises(topicIds);
      const exercises = planSession(pool, {
        kind: kind === "mixed" ? "mixed" : "topic",
        size: SESSION_SIZE,
        attempts: state.attempts,
        now: Date.now(),
      });

      if (exercises.length === 0) {
        setEmptyNotice(
          "Nothing is due here right now — you have answered everything in this bank recently. Come back when the spaced schedule brings it round again.",
        );
        return;
      }

      const topic = topicId ? TOPICS_BY_ID.get(topicId) : undefined;
      setSession({
        title: topic ? topic.title : "Mixed practice",
        subtitle: `${exercises.length} problem${exercises.length === 1 ? "" : "s"}`,
        exercises,
      });
    } finally {
      setLoading(null);
    }
  }

  if (session) {
    return (
      <SessionRunner
        title={session.title}
        subtitle={session.subtitle}
        exercises={session.exercises}
        onExit={() => setSession(null)}
      />
    );
  }

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-extrabold sm:text-4xl">Practice</h1>
        <p className="text-ink-muted mt-1.5">
          Drill a single topic, or let a mixed session pick for you.
        </p>
      </header>

      <Card tone="accent">
        <Eyebrow>Smart mix</Eyebrow>
        <h2 className="mt-2 text-2xl font-extrabold">Let the schedule choose</h2>
        <p className="mt-2 leading-relaxed">
          Weighted towards concepts you have missed, concepts you are shaky on, and older material
          due for another look. Anything you answered correctly and recently is held back.
        </p>
        <Button
          size="lg"
          className="mt-6 w-full sm:w-auto sm:px-10"
          disabled={loading !== null}
          onClick={() => void start("mixed")}
        >
          {loading === "mixed" ? "Building a session…" : "Start mixed practice"}
          <Icon name="chevron" size={18} strokeWidth={2.5} />
        </Button>
      </Card>

      {emptyNotice && (
        <Card>
          <p role="status" className="text-ink-muted leading-relaxed">
            {emptyNotice}
          </p>
        </Card>
      )}

      <section>
        <SectionHeading title="By topic" hint="Problems held separately from the lessons" />
        <ul className="space-y-2.5">
          {BANK_INDEX.map((bank) => {
            const topic = TOPICS_BY_ID.get(bank.topicId);
            return (
              <li key={bank.topicId}>
                <Card className="flex flex-wrap items-center gap-4">
                  <IconTile>
                    <Icon name="target" />
                  </IconTile>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold">{topic?.title ?? bank.topicId}</p>
                    <p className="text-ink-muted mt-0.5 text-sm">
                      {bank.count} problems · {bank.conceptIds.length} concepts
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    disabled={loading !== null}
                    onClick={() => void start("topic", bank.topicId)}
                  >
                    {loading === bank.topicId ? "Loading…" : "Practise"}
                  </Button>
                </Card>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <SectionHeading title="Your concepts" hint="Everything the lessons have taught so far" />
        <ul className="space-y-2.5">
          {TAUGHT_CONCEPT_IDS.map((conceptId) => {
            const stats = summarizeConcept(conceptId, state.attempts);
            return (
              <li key={conceptId}>
                <Card className="flex items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold">{conceptTitle(conceptId)}</p>
                    <p className="text-ink-muted mt-0.5 text-sm">
                      {stats.total === 0
                        ? "Not attempted yet"
                        : `${stats.correct} of ${stats.total} correct · ${stats.independentCorrect} unassisted`}
                    </p>
                  </div>
                  {stats.total > 0 ? (
                    <MasteryBadge state={masteryState(stats, now)} />
                  ) : (
                    <Badge tone="outline">New</Badge>
                  )}
                </Card>
              </li>
            );
          })}
        </ul>
      </section>

      <footer className="text-ink-muted text-sm">
        <Link to="/learn" className="text-accent-ink font-bold">
          Browse the curriculum →
        </Link>
      </footer>
    </div>
  );
}
