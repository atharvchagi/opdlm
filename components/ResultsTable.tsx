import type { ReactNode } from "react";

interface TableColumn {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
}

interface TableRow {
  [key: string]: string | number | boolean | undefined;
  modelHref?: string;
  sectionLabel?: string;
  highlightRow?: boolean;
}

interface ResultsTableProps {
  columns: TableColumn[];
  rows: TableRow[];
  caption?: ReactNode;
  highlightColumn?: string; // key of the column to visually emphasize
  highlightColumns?: string[];
  dividerBeforeColumn?: string;
  compact?: boolean;
}

export default function ResultsTable({
  columns,
  rows,
  caption,
  highlightColumn,
  highlightColumns,
  dividerBeforeColumn,
  compact = false,
}: ResultsTableProps) {
  const alignClass = (align?: string) => {
    if (align === "center") return "text-center";
    if (align === "right") return "text-right";
    return "text-left";
  };

  const highlighted = new Set(
    [highlightColumn, ...(highlightColumns ?? [])].filter((key): key is string => Boolean(key))
  );

  return (
    <figure className="my-6">
      {caption && (
        <figcaption className="mb-2.5 text-xs text-center text-muted font-sans font-semibold">
          {caption}
        </figcaption>
      )}
      <div className="w-full overflow-x-auto rounded-lg border border-border shadow-sm">
        <table
          className={`w-full font-sans border-collapse ${
            compact ? "text-[0.72rem] leading-snug" : "text-sm"
          }`}
        >
          <thead>
            <tr className="bg-border/30 border-b border-border">
              {columns.map((col) => {
                const isHighlight = highlighted.has(col.key);
                const hasDivider = col.key === dividerBeforeColumn;

                return (
                  <th
                    key={col.key}
                    scope="col"
                    className={`
                      font-semibold text-ink/70 uppercase
                      ${compact
                        ? "px-2 py-2 text-[0.66rem] tracking-wide whitespace-normal leading-tight"
                        : "px-4 py-3 text-xs tracking-wider whitespace-nowrap"}
                      ${alignClass(col.align)}
                      ${isHighlight ? "text-ink bg-accent-light/70" : ""}
                      ${hasDivider ? "border-l-2 border-border" : ""}
                    `}
                  >
                    {col.label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              row.sectionLabel ? (
                <tr key={rowIdx} className="border-y border-border bg-border/35">
                  <td
                    colSpan={columns.length}
                    className={`
                      font-semibold text-ink uppercase tracking-wide
                      ${compact ? "px-2 py-2 text-[0.66rem]" : "px-4 py-2.5 text-xs"}
                    `}
                  >
                    {row.sectionLabel}
                  </td>
                </tr>
              ) : (
                <tr
                  key={rowIdx}
                  className={`
                    border-b border-border last:border-b-0 transition-colors
                    ${row.highlightRow ? "bg-accent-light/70 hover:bg-accent-light" : "hover:bg-border/20"}
                  `}
                >
                  {columns.map((col) => {
                    const isHighlight = highlighted.has(col.key);
                    const hasDivider = col.key === dividerBeforeColumn;
                    const isFirst = col.key === columns[0].key;
                    const value = row[col.key] ?? "—";
                    return (
                      <td
                        key={col.key}
                        className={`
                          whitespace-nowrap
                          ${compact ? "px-2 py-2" : "px-4 py-3"}
                          ${alignClass(col.align)}
                          ${isFirst || row.highlightRow ? "font-medium text-ink" : "text-muted"}
                          ${isHighlight ? "font-semibold text-ink bg-accent-light" : ""}
                          ${hasDivider ? "border-l-2 border-border" : ""}
                        `}
                      >
                        {isFirst && row.modelHref ? (
                          <a
                            href={row.modelHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline decoration-accent-border underline-offset-2 hover:text-accent-strong"
                          >
                            {value}
                          </a>
                        ) : (
                          value
                        )}
                      </td>
                    );
                  })}
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
