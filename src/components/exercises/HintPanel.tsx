import type { Hint } from "../../content/schema";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
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
    <div className="space-y-3">
      {hints.slice(0, revealed).map((hint, i) => (
        <div
          key={i}
          className="bg-warn-soft animate-rise flex gap-3 rounded-2xl px-4 py-3.5 text-[0.95rem] leading-relaxed"
        >
          <Icon name="lightbulb" size={18} className="text-warn-ink mt-0.5" />
          <div className="min-w-0">
            <p className="text-warn-ink mb-1 text-xs font-extrabold tracking-wide uppercase">
              Hint {i + 1} of {hints.length}
            </p>
            <p>
              <InlineText text={hint.text} />
            </p>
          </div>
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-2">
        {!exhausted && (
          <Button variant="secondary" onClick={onReveal} disabled={!canReveal}>
            {!canReveal && <Icon name="lock" size={15} />}
            {revealed === 0 ? "Show a hint" : "Another hint"}
          </Button>
        )}
        {!solutionRevealed && (
          <Button variant="ghost" onClick={onRevealSolution} disabled={!canReveal && !exhausted}>
            Show the worked solution
          </Button>
        )}
      </div>

      {!canReveal && lockedMessage && <p className="text-ink-muted text-xs">{lockedMessage}</p>}
    </div>
  );
}
