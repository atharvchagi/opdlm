"use client";

import { useEffect, useState } from "react";

const TOC_ITEMS = [
  { id: "quick-start", label: "Quick Start" },
  { id: "why-opdlm", label: "Why OPDLM?" },
  { id: "how-opdlm-works", label: "How It Works" },
  { id: "results", label: "Results" },
  { id: "conclusion", label: "Conclusion" },
  { id: "citation", label: "Citation" },
];

export default function TableOfContents() {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const headings = TOC_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // Pick the topmost visible heading
          const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
          setActiveId(top.target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <aside
      className="hidden xl:block sticky top-24 self-start w-48 shrink-0 pl-6 pr-2"
      aria-label="Table of contents"
    >
      <p className="text-xs font-sans font-semibold uppercase tracking-widest text-muted/70 mb-3">
        Contents
      </p>
      <nav>
        <ul className="space-y-0.5" role="list">
          {TOC_ITEMS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`
                    block text-sm font-sans py-1 pl-3 border-l-2 transition-all duration-150
                    ${isActive
                      ? "border-accent-strong text-ink font-medium bg-accent-light/60"
                      : "border-transparent text-muted hover:text-ink hover:border-border"
                    }
                  `}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
