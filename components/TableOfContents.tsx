"use client";

import { useEffect, useState } from "react";

const TOC_ITEMS = [
  { id: "motivation", label: "Motivation" },
  { id: "how-opdlm-works", label: "How OPDLM Works" },
  { id: "highlights", label: "Highlights" },
  { id: "results", label: "Results" },
  { id: "parallelization", label: "Parallelization" },
  { id: "quick-start", label: "Quick Start" },
  { id: "citation", label: "Citation" },
];

export default function TableOfContents() {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const sections = TOC_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];

    const updateActive = () => {
      const offset = 120;
      let current = sections[0]?.id ?? "";

      for (const section of sections) {
        if (section.getBoundingClientRect().top <= offset) {
          current = section.id;
        }
      }

      setActiveId(current);
    };

    updateActive();
    const frame = window.requestAnimationFrame(updateActive);
    const timeout = window.setTimeout(updateActive, 150);
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    window.addEventListener("hashchange", updateActive);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
      window.removeEventListener("hashchange", updateActive);
    };
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
