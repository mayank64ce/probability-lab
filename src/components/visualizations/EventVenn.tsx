import type { CSSProperties } from "react";
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
    <figure className="space-y-4">
      <div className="border-line bg-surface rounded-card border p-4 shadow-card sm:p-5">
        <svg
          viewBox="0 0 320 180"
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
              <circle cx="196" cy="92" r="64" />
            </clipPath>
          </defs>

          {/* The whole sample space. */}
          <rect
            x="4"
            y="4"
            width="312"
            height="172"
            rx="18"
            className="fill-sunken stroke-line"
            strokeWidth="2"
            style={{ transition: "opacity 300ms" }}
            opacity={conditioned ? 0.35 : 1}
          />
          <text
            x="18"
            y="28"
            fontSize="13"
            fontWeight="700"
            className="fill-ink-muted"
            opacity={conditioned ? 0.35 : 1}
          >
            Ω
          </text>

          {/* Event A. */}
          <circle
            cx="124"
            cy="92"
            r="64"
            className="fill-accent stroke-accent"
            fillOpacity={conditioned ? 0.07 : 0.18}
            strokeWidth="2.5"
            strokeOpacity={conditioned ? 0.25 : 0.9}
            style={{ transition: "fill-opacity 300ms, stroke-opacity 300ms" }}
          />

          {/* Event B — stays fully lit when it becomes the new universe. */}
          <circle
            cx="196"
            cy="92"
            r="64"
            className="fill-accent stroke-accent"
            fillOpacity={conditioned ? 0.16 : 0.18}
            strokeWidth={conditioned ? 4 : 2.5}
            style={{ transition: "stroke-width 300ms" }}
          />

          {/* The intersection, drawn by clipping A against B. */}
          <g clipPath={`url(#${clipId}-b)`}>
            <circle cx="124" cy="92" r="64" className="fill-accent" fillOpacity="0.58" />
          </g>

          <text
            x="68"
            y="98"
            fontSize="17"
            fontWeight="800"
            className="fill-ink"
            opacity={conditioned ? 0.35 : 1}
          >
            A
          </text>
          <text x="242" y="98" fontSize="17" fontWeight="800" className="fill-ink">
            B
          </text>
          <text x="146" y="98" fontSize="12" fontWeight="800" className="fill-ink">
            A∩B
          </text>
        </svg>
      </div>

      <button
        type="button"
        aria-pressed={conditioned}
        onClick={() => setConditioned((v) => !v)}
        className={`pressable min-h-13 w-full rounded-2xl px-4 text-sm font-bold ${
          conditioned ? "bg-accent text-white" : "bg-surface border-line-strong text-ink border-2"
        }`}
        style={
          {
            "--press-edge": conditioned ? "var(--color-accent-deep)" : "var(--color-line-strong)",
          } as CSSProperties
        }
      >
        {conditioned ? "Showing the whole sample space restricted to B" : "Condition on B"}
      </button>

      <div className="bg-accent-soft rounded-card px-5 py-4" aria-live="polite">
        {conditioned ? (
          <>
            <p className="text-accent-ink text-xs font-extrabold tracking-wide">
              P(A | B) = P(A ∩ B) / P(B)
            </p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums">
              {pAB} / {pB} = {conditional.toFixed(2)}
            </p>
          </>
        ) : (
          <>
            <p className="text-accent-ink text-xs font-extrabold tracking-wide">Unconditional</p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums">
              P(A) = {pA} &nbsp;·&nbsp; P(A ∩ B) = {pAB}
            </p>
          </>
        )}
      </div>

      <figcaption className="text-ink-muted text-sm">
        {conditioned
          ? "B is now the entire universe. The overlap did not grow — it simply makes up a larger share of what is left."
          : "A and B overlap. Press the button to make B the only thing that counts."}
      </figcaption>
    </figure>
  );
}
