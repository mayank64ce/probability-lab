import type { Hint } from "../../content/schema";
import { Button } from "../ui/Button";
import { InlineText } from "../ui/RichText";

/**
 * Progressive hints: one at a time, each stronger than the last, and the
 * worked solution only once every hint has been spent or explicitly asked for.
 */
export function HintPanel({
  hints,
  revealed,
  canReveal,
  lockedMessage,
  onReveal,
  onRevealSolution,
  solutionRevealed,
}: {
  hints: Hint[];
  revealed: number;
  canReveal: boolean;
  lockedMessage?: string;
  onReveal: () => void;
  onRevealSolution: () => void;
  solutionRevealed: boolean;
}) {
  if (hints.length === 0 && solutionRevealed) return null;

  const exhausted = revealed >= hints.length;

  return (
    <div className="space-y-2.5">
      {hints.slice(0, revealed).map((hint, i) => (
        <div
          key={i}
          className="rounded-xl px-4 py-3 text-[0.95rem] leading-relaxed"
          style={{ background: "var(--surface-sunken)" }}
        >
          <p className="mb-1 text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
            Hint {i + 1} of {hints.length}
          </p>
          <p>
            <InlineText text={hint.text} />
          </p>
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        {!exhausted && (
          <Button variant="secondary" onClick={onReveal} disabled={!canReveal}>
            {revealed === 0 ? "Show a hint" : "Another hint"}
          </Button>
        )}
        {!solutionRevealed && (
          <Button variant="ghost" onClick={onRevealSolution} disabled={!canReveal && !exhausted}>
            Show the worked solution
          </Button>
        )}
      </div>

      {!canReveal && lockedMessage && (
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {lockedMessage}
        </p>
      )}
    </div>
  );
}
