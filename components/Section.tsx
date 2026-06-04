import type { ReactNode } from "react";

interface SectionProps {
  id?: string;
  title: string;
  children: ReactNode;
  /** Use "h2" for top-level sections, "h3" for subsections */
  level?: "h2" | "h3";
}

export default function Section({
  id,
  title,
  children,
  level = "h2",
}: SectionProps) {
  const Heading = level;
  const anchorId = id ?? title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  return (
    <section id={anchorId} className="py-10 border-t border-border first:border-t-0">
      <Heading
        className={`font-sans font-semibold text-ink mb-5 group flex items-center gap-2 ${
          level === "h2" ? "text-2xl" : "text-xl"
        }`}
      >
        {title}
        {/* Anchor link */}
        <a
          href={`#${anchorId}`}
          className="opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity text-muted"
          aria-label={`Link to ${title} section`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </a>
      </Heading>
      <div className="prose-content">{children}</div>
    </section>
  );
}
