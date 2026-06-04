interface TableColumn {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
}

interface TableRow {
  [key: string]: string | number | undefined;
  modelHref?: string;
}

interface ResultsTableProps {
  columns: TableColumn[];
  rows: TableRow[];
  caption?: string;
  highlightColumn?: string; // key of the column to visually emphasize
}

export default function ResultsTable({
  columns,
  rows,
  caption,
  highlightColumn,
}: ResultsTableProps) {
  const alignClass = (align?: string) => {
    if (align === "center") return "text-center";
    if (align === "right") return "text-right";
    return "text-left";
  };

  return (
    <figure className="my-6">
      <div className="w-full overflow-x-auto rounded-lg border border-border shadow-sm">
        <table className="w-full text-sm font-sans border-collapse">
          <thead>
            <tr className="bg-border/30 border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`
                    px-4 py-3 font-semibold text-ink/70 text-xs uppercase tracking-wider whitespace-nowrap
                    ${alignClass(col.align)}
                    ${col.key === highlightColumn ? "text-ink" : ""}
                  `}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="border-b border-border last:border-b-0 hover:bg-border/20 transition-colors"
              >
                {columns.map((col) => {
                  const isHighlight = col.key === highlightColumn;
                  const isFirst = col.key === columns[0].key;
                  const value = row[col.key] ?? "—";
                  return (
                    <td
                      key={col.key}
                      className={`
                        px-4 py-3 whitespace-nowrap
                        ${alignClass(col.align)}
                        ${isFirst ? "font-medium text-ink" : "text-muted"}
                        ${isHighlight ? "font-semibold text-ink bg-accent-light" : ""}
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
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <figcaption className="mt-2.5 text-xs text-center text-muted font-sans italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
