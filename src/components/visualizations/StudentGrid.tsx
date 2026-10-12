import { useEffect, useMemo, useState } from "react";
import type { VisualizationProps } from "./types";
import { numberFrom } from "./types";

type Category = "both" | "mathOnly" | "physicsOnly" | "neither";

const STUDIES_MATH: Record<Category, boolean> = {
  both: true,
  mathOnly: true,
  physicsOnly: false,
  neither: false,
};

const STUDIES_PHYSICS: Record<Category, boolean> = {
  both: true,
  mathOnly: false,
  physicsOnly: true,
  neither: false,
};

/**
 * Deterministic spread of the four categories across the grid.
 *
 * The students are mixed rather than grouped, so the learner cannot read the
 * answer off a block of colour, but the order is fixed so the picture never
 * changes between renders or sessions.
 */
function buildCohort(counts: Record<Category, number>): Category[] {
  const pool: Category[] = [];
  (Object.keys(counts) as Category[]).forEach((category) => {
    for (let i = 0; i < counts[category]; i += 1) pool.push(category);
  });

  // A small LCG shuffle with a fixed seed: reproducible, and good enough to
  // break up the runs.
  let seed = 20_13;
  for (let i = pool.length - 1; i > 0; i -= 1) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    const j = seed % (i + 1);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

function PersonIcon({ physics }: { physics: boolean }) {
  return (
    <svg viewBox="0 0 24 28" className="h-7 w-6" aria-hidden="true">
      <circle cx="12" cy="8" r="4.6" fill="currentColor" opacity={physics ? 1 : 0.42} />
      <path
        d="M3.5 25.5c0-4.7 3.8-7.9 8.5-7.9s8.5 3.2 8.5 7.9z"
        fill="currentColor"
        opacity={physics ? 1 : 0.42}
      />
    </svg>
  );
}

/**
 * The conditioning visualization for CP-01.
 *
 * Switching to "Mathematics students only" dims the students the information
 * rules out instead of removing them, which is the whole teaching point:
 * conditioning narrows the outcomes under consideration, it does not change
 * the class.
 */
export function StudentGrid({ config, onStateChange }: VisualizationProps) {
  const [mode, setMode] = useState<"all" | "math-only">("all");

  const counts = useMemo<Record<Category, number>>(
    () => ({
      both: numberFrom(config, "both", 4),
      mathOnly: numberFrom(config, "mathOnly", 4),
      physicsOnly: numberFrom(config, "physicsOnly", 4),
      neither: numberFrom(config, "neither", 8),
    }),
    [config],
  );

  const cohort = useMemo(() => buildCohort(counts), [counts]);

  useEffect(() => {
    onStateChange?.(mode);
  }, [mode, onStateChange]);

  const total = cohort.length;
  const mathCount = counts.both + counts.mathOnly;
  const physicsCount = counts.both + counts.physicsOnly;

  const denominator = mode === "all" ? total : mathCount;
  const numerator = mode === "all" ? physicsCount : counts.both;
  const probability = denominator === 0 ? 0 : numerator / denominator;

  const caption =
    mode === "all"
      ? `All ${total} students. ${physicsCount} of them study physics.`
      : `Only the ${mathCount} mathematics students are still possible. ${counts.both} of them study physics.`;

  return (
    <figure className="space-y-4">
      <div
        className="bg-sunken flex gap-1.5 rounded-2xl p-1.5"
        role="group"
        aria-label="Which students to count"
      >
        {(
          [
            ["all", "All students"],
            ["math-only", "Mathematics students only"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={mode === value}
            onClick={() => setMode(value)}
            className={`min-h-11 flex-1 rounded-xl px-2 text-xs font-bold transition-colors sm:text-sm ${
              mode === value ? "bg-accent text-white shadow-card" : "text-ink-muted hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="border-line bg-surface rounded-card border p-4 shadow-card sm:p-5">
        <ul className="grid grid-cols-5 gap-2 sm:gap-2.5" role="list">
          {cohort.map((category, index) => {
            const math = STUDIES_MATH[category];
            const physics = STUDIES_PHYSICS[category];
            const excluded = mode === "math-only" && !math;

            const description = math
              ? physics
                ? "studies mathematics and physics"
                : "studies mathematics only"
              : physics
                ? "studies physics only"
                : "studies neither subject";

            return (
              <li
                key={index}
                className={`flex aspect-square items-center justify-center rounded-2xl transition-all duration-300 ${
                  math ? "bg-accent-soft ring-accent/40 ring-2" : "bg-sunken"
                } ${physics ? "text-accent" : "text-ink-muted"}`}
                style={{ opacity: excluded ? 0.15 : 1 }}
              >
                <span className="sr-only">
                  {`Student ${index + 1}: ${description}${excluded ? ", excluded by the condition" : ""}.`}
                </span>
                <PersonIcon physics={physics} />
              </li>
            );
          })}
        </ul>

        <div className="text-ink-muted mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold">
          <span className="inline-flex items-center gap-2">
            <span className="bg-accent inline-block h-3 w-3 rounded-full" />
            Studies physics
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="bg-accent-soft ring-accent/40 inline-block h-3 w-3 rounded-sm ring-2" />
            Studies mathematics
          </span>
        </div>
      </div>

      <div className="bg-accent-soft rounded-card px-5 py-4" aria-live="polite">
        <p className="text-accent-ink text-xs font-extrabold tracking-wide">
          {mode === "all" ? "P(physics)" : "P(physics | mathematics)"}
        </p>
        <p className="mt-1 text-3xl font-extrabold tabular-nums">
          {numerator} / {denominator} = {Math.round(probability * 100)}%
        </p>
      </div>

      <figcaption className="text-ink-muted text-sm">{caption}</figcaption>
    </figure>
  );
}
