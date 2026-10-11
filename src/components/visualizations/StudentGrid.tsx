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

function PersonIcon({ physics, math }: { physics: boolean; math: boolean }) {
  return (
    <svg viewBox="0 0 24 28" className="h-full w-full" aria-hidden="true">
      <circle
        cx="12"
        cy="7"
        r="5"
        fill={physics ? "var(--accent)" : "var(--surface-sunken)"}
        stroke={math ? "var(--accent-text)" : "var(--border)"}
        strokeWidth={math ? 2 : 1.25}
      />
      <path
        d="M3 26c0-5 4-8.5 9-8.5s9 3.5 9 8.5z"
        fill={physics ? "var(--accent)" : "var(--surface-sunken)"}
        stroke={math ? "var(--accent-text)" : "var(--border)"}
        strokeWidth={math ? 2 : 1.25}
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
    <figure className="space-y-3">
      <div
        className="flex gap-1.5 rounded-xl p-1"
        role="group"
        aria-label="Which students to count"
        style={{ background: "var(--surface-sunken)" }}
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
            className="min-h-10 flex-1 rounded-lg px-2 text-xs font-semibold transition-colors sm:text-sm"
            style={
              mode === value
                ? { background: "var(--accent)", color: "#fff" }
                : { background: "transparent", color: "var(--text-muted)" }
            }
          >
            {label}
          </button>
        ))}
      </div>

      <div
        className="rounded-2xl p-3 sm:p-4"
        style={{ background: "var(--surface-raised)", border: "1px solid var(--border)" }}
      >
        <ul className="grid grid-cols-5 gap-2 sm:gap-3" role="list">
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
                className="aspect-3/4 transition-opacity duration-300"
                style={{ opacity: excluded ? 0.15 : 1 }}
              >
                <span className="sr-only">
                  {`Student ${index + 1}: ${description}${excluded ? ", excluded by the condition" : ""}.`}
                </span>
                <PersonIcon physics={physics} math={math} />
              </li>
            );
          })}
        </ul>

        <div
          className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.7rem]"
          style={{ color: "var(--text-muted)" }}
        >
          <span className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ background: "var(--accent)" }}
            />
            Studies physics
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{
                background: "var(--surface-sunken)",
                border: "2px solid var(--accent-text)",
              }}
            />
            Studies mathematics
          </span>
        </div>
      </div>

      <div
        className="rounded-xl px-4 py-3"
        style={{ background: "var(--accent-soft)" }}
        aria-live="polite"
      >
        <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          {mode === "all" ? "P(physics)" : "P(physics | mathematics)"}
        </p>
        <p className="mt-0.5 text-2xl font-semibold tabular-nums">
          {numerator} / {denominator} = {Math.round(probability * 100)}%
        </p>
      </div>

      <figcaption className="text-sm" style={{ color: "var(--text-muted)" }}>
        {caption}
      </figcaption>
    </figure>
  );
}
