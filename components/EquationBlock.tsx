import katex from "katex";
import type { ReactNode } from "react";

interface EquationBlockProps {
  latex: string;
  label?: string;
  caption?: ReactNode;
}

interface InlineMathProps {
  latex: string;
  className?: string;
}

function renderLatex(latex: string, displayMode: boolean) {
  return katex.renderToString(latex, {
    displayMode,
    output: "htmlAndMathml",
    strict: "ignore",
    throwOnError: false,
    trust: false,
  });
}

export function InlineMath({
  latex,
  className = "",
}: InlineMathProps) {
  const rendered = renderLatex(latex, false);

  return (
    <span
      className={`inline-math text-ink ${className}`}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
}

export default function EquationBlock({
  latex,
  label,
  caption,
}: EquationBlockProps) {
  const rendered = renderLatex(latex, true);

  return (
    <figure className="my-6">
      {label && (
        <div className="mb-2 text-xs font-sans font-semibold uppercase tracking-widest text-muted">
          {label}
        </div>
      )}
      <div className="equation-scroll overflow-x-auto rounded-lg border border-border bg-code-bg px-4 py-4 shadow-sm">
        <div
          className="min-w-max text-ink"
          dangerouslySetInnerHTML={{ __html: rendered }}
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-muted font-sans italic leading-snug">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
