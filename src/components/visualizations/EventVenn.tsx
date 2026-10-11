import { useId, useState } from "react";
import type { VisualizationProps } from "./types";
import { numberFrom } from "./types";

/**
 * Two events in a sample space, with a toggle that restricts the universe to
 * B. Conditioning is drawn as the shaded rectangle shrinking to the circle:
 * the overlap is unchanged, the denominator is not.
 *
 * The circles are schematic rather than area-proportional — the numbers are
 * printed alongside so nothing has to be judged by eye.
 */
export function EventVenn({ config }: VisualizationProps) {
  const [conditioned, setConditioned] = useState(false);
  const clipId = useId();

  const pB = numberFrom(config, "pB", 0.4);
  const pAB = numberFrom(config, "pAB", 0.2);
  const pA = numberFrom(config, "pA", 0.35);

  const conditional = pB > 0 ? pAB / pB : NaN;

  return (
    <figure className="space-y-3">
      <div
        className="rounded-2xl p-3 sm:p-4"
        style={{ background: "var(--surface-raised)", border: "1px solid var(--border)" }}
      >
        <svg
          viewBox="0 0 320 170"
          className="w-full"
          role="img"
          aria-label={
            conditioned
              ? `Sample space restricted to event B. Within B, the overlap with A covers a fraction ${conditional.toFixed(2)} of it.`
              : `A sample space containing two overlapping events: A with probability ${pA}, B with probability ${pB}, overlapping in probability ${pAB}.`
          }
        >
          <defs>
            <clipPath id={`${clipId}-b`}>
              <circle cx="195" cy="85" r="62" />
            </clipPath>
          </defs>

          {/* The whole sample space. */}
          <rect
            x="4"
            y="4"
            width="312"
            height="162"
            rx="12"
            fill="var(--surface-sunken)"
            stroke="var(--border)"
            style={{ transition: "opacity 300ms" }}
            opacity={conditioned ? 0.3 : 1}
          />
          <text
            x="16"
            y="24"
            fontSize="12"
            fill="var(--text-muted)"
            opacity={conditioned ? 0.35 : 1}
          >
            Ω
          </text>

          {/* Event A. */}
          <circle
            cx="125"
            cy="85"
            r="62"
            fill="var(--accent)"
            fillOpacity={conditioned ? 0.08 : 0.2}
            stroke="var(--accent)"
            strokeWidth="2"
            strokeOpacity={conditioned ? 0.3 : 1}
            style={{ transition: "fill-opacity 300ms, stroke-opacity 300ms" }}
          />

          {/* Event B — stays fully lit when it becomes the new universe. */}
          <circle
            cx="195"
            cy="85"
            r="62"
            fill="var(--accent)"
            fillOpacity={conditioned ? 0.16 : 0.2}
            stroke="var(--accent-text)"
            strokeWidth={conditioned ? 3 : 2}
            style={{ transition: "stroke-width 300ms" }}
          />

          {/* The intersection, drawn by clipping A against B. */}
          <g clipPath={`url(#${clipId}-b)`}>
            <circle cx="125" cy="85" r="62" fill="var(--accent)" fillOpacity="0.55" />
          </g>

          <text
            x="72"
            y="90"
            fontSize="15"
            fontWeight="600"
            fill="var(--text)"
            opacity={conditioned ? 0.4 : 1}
          >
            A
          </text>
          <text x="238" y="90" fontSize="15" fontWeight="600" fill="var(--text)">
            B
          </text>
          <text x="148" y="90" fontSize="11" fontWeight="600" fill="var(--text)">
            A∩B
          </text>
        </svg>
      </div>

      <button
        type="button"
        aria-pressed={conditioned}
        onClick={() => setConditioned((v) => !v)}
        className="min-h-11 w-full rounded-xl px-4 text-sm font-semibold transition-colors"
        style={
          conditioned
            ? { background: "var(--accent)", color: "#fff" }
            : {
                background: "var(--surface-raised)",
                color: "var(--text)",
                border: "1px solid var(--border)",
              }
        }
      >
        {conditioned ? "Showing the whole sample space restricted to B" : "Condition on B"}
      </button>

      <div
        className="rounded-xl px-4 py-3"
        style={{ background: "var(--accent-soft)" }}
        aria-live="polite"
      >
        {conditioned ? (
          <>
            <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              P(A | B) = P(A ∩ B) / P(B)
            </p>
            <p className="mt-0.5 text-xl font-semibold tabular-nums">
              {pAB} / {pB} = {conditional.toFixed(2)}
            </p>
          </>
        ) : (
          <>
            <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Unconditional
            </p>
            <p className="mt-0.5 text-xl font-semibold tabular-nums">
              P(A) = {pA} &nbsp;·&nbsp; P(A ∩ B) = {pAB}
            </p>
          </>
        )}
      </div>

      <figcaption className="text-sm" style={{ color: "var(--text-muted)" }}>
        {conditioned
          ? "B is now the entire universe. The overlap did not grow — it simply makes up a larger share of what is left."
          : "A and B overlap. Press the button to make B the only thing that counts."}
      </figcaption>
    </figure>
  );
}
