import { useEffect, useMemo, useState } from "react";
import type { VisualizationProps } from "./types";

/**
 * A two-stage probability tree, drawn as nested rows rather than a node-link
 * diagram: a real tree needs horizontal room that a phone does not have, and
 * the thing worth seeing here is the arithmetic along each path.
 *
 * Two interaction modes, because the same picture carries three lessons:
 *
 * - `trace`     click a path and watch the multiplication rule run along it.
 * - `condition` keep only the paths matching an outcome. The kept paths sum to
 *               its total probability, and their shares *of that sum* are
 *               Bayes' theorem — which is why conditioning on a tree and
 *               inverting a conditional are the same move.
 */

interface TreeNode {
  id: string;
  label: string;
  p: number;
  /** Optional exact rendering, e.g. "3/10", so a fractions lesson shows fractions. */
  display?: string;
}

interface TreeBranch extends TreeNode {
  children: TreeNode[];
}

function isNode(value: unknown): value is TreeNode {
  if (typeof value !== "object" || value === null) return false;
  const n = value as Record<string, unknown>;
  return typeof n.id === "string" && typeof n.label === "string" && typeof n.p === "number";
}

function branchesFrom(config: Record<string, unknown>): TreeBranch[] {
  const raw = config.branches;
  if (!Array.isArray(raw)) return [];
  return raw.filter(isNode).map((branch) => {
    const children = (branch as unknown as { children?: unknown }).children;
    return {
      ...branch,
      children: Array.isArray(children) ? children.filter(isNode) : [],
    };
  });
}

function stringFrom(config: Record<string, unknown>, key: string, fallback: string): string {
  const value = config[key];
  return typeof value === "string" ? value : fallback;
}

/** Trims trailing zeros so 0.0050 reads as 0.005 and 1.0000 as 1. */
function fmt(n: number): string {
  return String(Number(n.toFixed(4)));
}

function pct(n: number): string {
  return `${Math.round(n * 1000) / 10}%`;
}

export function ProbabilityTree({ config, onStateChange }: VisualizationProps) {
  const branches = useMemo(() => branchesFrom(config), [config]);
  const mode = stringFrom(config, "mode", "condition") === "trace" ? "trace" : "condition";
  const conditionOn = stringFrom(config, "conditionOn", "");
  const conditionLabel = stringFrom(config, "conditionLabel", "the outcome");
  const showShares = config.showShares === true;

  const [conditioned, setConditioned] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "trace") onStateChange?.(selected === null ? "none" : `leaf:${selected}`);
    else onStateChange?.(conditioned ? "conditioned" : "all");
  }, [mode, selected, conditioned, onStateChange]);

  const leaves = branches.flatMap((branch) =>
    branch.children.map((child) => ({
      key: `${branch.id}-${child.id}`,
      branch,
      child,
      joint: branch.p * child.p,
      kept: child.id === conditionOn,
    })),
  );

  const keptTotal = leaves.filter((l) => l.kept).reduce((sum, l) => sum + l.joint, 0);
  const chosen = leaves.find((l) => l.key === selected);

  return (
    <figure className="space-y-4">
      {mode === "condition" ? (
        <div
          className="bg-sunken flex gap-1.5 rounded-2xl p-1.5"
          role="group"
          aria-label="Which paths to count"
        >
          {(
            [
              [false, "All paths"],
              [true, `Only ${conditionLabel.toLowerCase()} paths`],
            ] as const
          ).map(([value, label]) => (
            <button
              key={String(value)}
              type="button"
              aria-pressed={conditioned === value}
              onClick={() => setConditioned(value)}
              className={`min-h-11 flex-1 rounded-xl px-2 text-xs font-bold transition-colors sm:text-sm ${
                conditioned === value
                  ? "bg-accent text-white shadow-card"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-ink-muted text-sm font-semibold">Tap a path to multiply along it.</p>
      )}

      <div className="border-line bg-surface rounded-card space-y-3 border p-3 shadow-card sm:p-4">
        {branches.map((branch) => (
          <div key={branch.id} className="border-line border-l-2 pl-3">
            <p className="flex items-baseline justify-between gap-3 text-sm font-extrabold">
              <span>{branch.label}</span>
              <span className="text-ink-muted tabular-nums">{branch.display ?? fmt(branch.p)}</span>
            </p>

            <ul className="mt-2 space-y-1.5">
              {branch.children.map((child) => {
                const key = `${branch.id}-${child.id}`;
                const joint = branch.p * child.p;
                const dimmed = mode === "condition" && conditioned && child.id !== conditionOn;
                const picked = mode === "trace" && selected === key;
                const share = keptTotal > 0 ? joint / keptTotal : 0;

                const row = (
                  <>
                    <span className="min-w-0 flex-1 truncate">{child.label}</span>
                    <span className="text-ink-muted shrink-0 tabular-nums">
                      × {child.display ?? fmt(child.p)}
                    </span>
                    <span className="w-16 shrink-0 text-right font-bold tabular-nums">
                      {fmt(joint)}
                    </span>
                    {mode === "condition" && conditioned && showShares && (
                      <span
                        className={`bg-accent-soft text-accent-ink w-14 shrink-0 rounded-full py-0.5 text-center text-[0.68rem] font-extrabold tabular-nums ${
                          child.id === conditionOn ? "" : "invisible"
                        }`}
                      >
                        {pct(share)}
                      </span>
                    )}
                  </>
                );

                const classes = `flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-all duration-300 ${
                  picked ? "bg-accent-soft ring-accent/40 ring-2" : "bg-raised"
                }`;

                return (
                  <li key={key} style={{ opacity: dimmed ? 0.2 : 1 }}>
                    {mode === "trace" ? (
                      <button
                        type="button"
                        aria-pressed={picked}
                        onClick={() => setSelected(key)}
                        className={`${classes} w-full text-left`}
                      >
                        {row}
                      </button>
                    ) : (
                      <div className={classes}>
                        <span className="sr-only">
                          {`${branch.label}, then ${child.label}: probability ${fmt(joint)}${
                            dimmed ? ", excluded by the condition" : ""
                          }.`}
                        </span>
                        {row}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-accent-soft rounded-card px-5 py-4" aria-live="polite">
        {mode === "trace" ? (
          chosen ? (
            <>
              <p className="text-accent-ink text-xs font-extrabold tracking-wide">
                {chosen.branch.label}, then {chosen.child.label}
              </p>
              <p className="mt-1 text-2xl font-extrabold tabular-nums">
                {chosen.branch.display ?? fmt(chosen.branch.p)} ×{" "}
                {chosen.child.display ?? fmt(chosen.child.p)} = {fmt(chosen.joint)}
              </p>
            </>
          ) : (
            <p className="text-ink-muted text-sm font-semibold">
              No path selected yet. Tap one of the rows above.
            </p>
          )
        ) : conditioned ? (
          <>
            <p className="text-accent-ink text-xs font-extrabold tracking-wide">
              P({conditionLabel.toLowerCase()}) = sum of the paths that survived
            </p>
            <p className="mt-1 text-3xl font-extrabold tabular-nums">
              {fmt(keptTotal)} = {pct(keptTotal)}
            </p>
            {showShares && (
              <p className="text-ink-muted mt-2 text-sm font-semibold">
                Each badge is that path&rsquo;s share of this total. The badges add to 100%.
              </p>
            )}
          </>
        ) : (
          <>
            <p className="text-accent-ink text-xs font-extrabold tracking-wide">
              Every path, start to finish
            </p>
            <p className="mt-1 text-3xl font-extrabold tabular-nums">
              {leaves.length} paths, totalling {fmt(leaves.reduce((s, l) => s + l.joint, 0))}
            </p>
          </>
        )}
      </div>
    </figure>
  );
}
