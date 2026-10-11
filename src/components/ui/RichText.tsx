import type { ReactNode } from "react";
import type { Block } from "../../content/schema";
import { Math } from "./Math";

/**
 * Splits a string on inline `$...$` TeX spans and `**bold**` runs.
 *
 * A deliberately tiny formatter: content authors get maths and emphasis, and
 * nothing else can leak arbitrary markup into the page.
 */
export function InlineText({ text }: { text: string }): ReactNode {
  const parts = text.split(/(\$[^$]+\$)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
          return <Math key={i} tex={part.slice(1, -1)} />;
        }
        return <BoldRuns key={i} text={part} />;
      })}
    </>
  );
}

function BoldRuns({ text }: { text: string }): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
          <strong key={i} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

const CALLOUT_STYLES: Record<string, { bg: string; border: string; text: string }> = {
  info: { bg: "var(--surface-sunken)", border: "var(--border)", text: "var(--text)" },
  insight: { bg: "var(--accent-soft)", border: "var(--accent)", text: "var(--text)" },
  warning: { bg: "var(--warn-soft)", border: "var(--warn)", text: "var(--text)" },
};

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="leading-relaxed">
          <InlineText text={block.text} />
        </p>
      );

    case "math":
      return (
        <div className="overflow-x-auto py-1">
          <Math tex={block.tex} display ariaLabel={block.label} />
        </div>
      );

    case "list":
      return block.ordered ? (
        <ol className="list-decimal space-y-1.5 pl-5 leading-relaxed">
          {block.items.map((item, i) => (
            <li key={i}>
              <InlineText text={item} />
            </li>
          ))}
        </ol>
      ) : (
        <ul className="list-disc space-y-1.5 pl-5 leading-relaxed">
          {block.items.map((item, i) => (
            <li key={i}>
              <InlineText text={item} />
            </li>
          ))}
        </ul>
      );

    case "callout": {
      const style = CALLOUT_STYLES[block.tone] ?? CALLOUT_STYLES.info;
      return (
        <div
          className="rounded-xl border-l-4 px-4 py-3 text-[0.95rem] leading-relaxed"
          style={{ background: style.bg, borderLeftColor: style.border, color: style.text }}
        >
          {block.title && <p className="mb-1 font-semibold">{block.title}</p>}
          <p>
            <InlineText text={block.text} />
          </p>
        </div>
      );
    }

    case "stats":
      return (
        <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {block.items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl px-3 py-2.5"
              style={{ background: "var(--surface-sunken)" }}
            >
              <dt className="text-xs leading-snug" style={{ color: "var(--text-muted)" }}>
                {item.label}
              </dt>
              <dd className="mt-0.5 text-xl font-semibold tabular-nums">{item.value}</dd>
            </div>
          ))}
        </dl>
      );

    default:
      return null;
  }
}

/** Renders a sequence of content blocks with consistent vertical rhythm. */
export function RichText({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-3.5">
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </div>
  );
}
