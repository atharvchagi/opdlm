interface ResultCardProps {
  metric: string;
  value: string;
  comparison?: string;
  description?: string;
  highlight?: boolean;
}

export default function ResultCard({
  metric,
  value,
  comparison,
  description,
  highlight = false,
}: ResultCardProps) {
  return (
    <div
      className={`
        rounded-lg border p-5 flex flex-col gap-1 transition-shadow hover:shadow-md
        ${highlight
          ? "border-accent-border bg-accent-light"
          : "border-border bg-paper hover:border-border"
        }
      `}
    >
      <span className="text-xs font-sans font-semibold uppercase tracking-widest text-muted">
        {metric}
      </span>
      <span className="text-3xl font-serif font-semibold leading-none text-ink">
        {value}
      </span>
      {comparison && (
        <span className="text-sm font-sans text-green-700 font-medium">
          {comparison}
        </span>
      )}
      {description && (
        <p className="text-sm font-sans text-muted mt-1 leading-snug">
          {description}
        </p>
      )}
    </div>
  );
}
