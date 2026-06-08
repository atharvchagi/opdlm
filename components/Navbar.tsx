"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Motivation", href: "#motivation" },
  { label: "How", href: "#how-opdlm-works" },
  { label: "Highlights", href: "#highlights" },
  { label: "Results", href: "#results" },
  { label: "Parallelization", href: "#parallelization" },
  { label: "Quick Start", href: "#quick-start" },
  { label: "Citation", href: "#citation" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-paper/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-paper/80 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="max-w-wide mx-auto px-5 sm:px-8 h-14 flex items-center justify-between gap-4">
        <div className="flex shrink-0 items-center gap-2" aria-label="Texas A&M and DIVE Lab">
          <Image
            src="/tamu_logo.png"
            alt="Texas A&M University"
            width={678}
            height={636}
            unoptimized
            priority
            className="h-8 w-auto object-contain"
          />
          <Image
            src="/dive_logo.png"
            alt="DIVE Lab"
            width={681}
            height={739}
            unoptimized
            priority
            className="h-9 w-auto object-contain"
          />
        </div>

        <nav className="hidden sm:flex items-center gap-1" aria-label="Project sections">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-sm text-muted hover:text-ink hover:bg-border/50 rounded-md transition-all duration-150 font-sans"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 rounded-md hover:bg-border/60 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span
            className={`w-4.5 h-px bg-ink transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`}
            style={{ width: "18px", height: "1.5px" }}
          />
          <span
            className={`h-px bg-ink transition-all duration-200 ${menuOpen ? "opacity-0" : "opacity-100"}`}
            style={{ width: "18px", height: "1.5px" }}
          />
          <span
            className={`h-px bg-ink transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
            style={{ width: "18px", height: "1.5px" }}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`sm:hidden overflow-hidden transition-all duration-300 border-t border-border ${
          menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        } bg-paper/98 backdrop-blur-md`}
      >
        <nav className="px-5 py-3 flex flex-col gap-0.5" aria-label="Project sections">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2.5 text-sm text-muted hover:text-ink hover:bg-border/50 rounded-md transition-all duration-150 font-sans"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
