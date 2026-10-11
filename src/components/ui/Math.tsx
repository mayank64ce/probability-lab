import { useMemo } from "react";
import katex from "katex";

interface MathProps {
  tex: string;
  display?: boolean;
  /** Spoken description for screen readers, when the TeX alone would be opaque. */
  ariaLabel?: string;
}

/**
 * Renders TeX with KaTeX.
 *
 * KaTeX output is marked aria-hidden and paired with the raw TeX in a visually
 * hidden span, so assistive technology reads something coherent instead of the
 * exploded glyph spans KaTeX produces.
 */
export function Math({ tex, display = false, ariaLabel }: MathProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, {
        displayMode: display,
        throwOnError: false,
        strict: "ignore",
        output: "html",
      });
    } catch {
      return null;
    }
  }, [tex, display]);

  if (html === null) {
    // Never blank out content because of a typo in the TeX.
    return <code className="text-[0.95em]">{tex}</code>;
  }

  const Tag = display ? "div" : "span";

  return (
    <Tag className={display ? "katex-display my-3" : "inline-block align-middle"}>
      <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: html }} />
      <span className="sr-only">{ariaLabel ?? tex}</span>
    </Tag>
  );
}
