import type { ReactNode } from "react";

interface FigureBlockProps {
  src?: string;
  alt?: string;
  caption?: ReactNode;
  width?: "full" | "lg" | "md";
  heightClass?: string;
  /** CSS-only placeholder label — shown when src is not provided */
  placeholderLabel?: string;
}

export default function FigureBlock({
  src,
  alt = "Figure",
  caption,
  width = "full",
  heightClass = "h-auto",
  // ─── REPLACE: Set placeholderLabel to describe what the figure should show ──
  placeholderLabel = "Replace with your figure image",
}: FigureBlockProps) {
  const widthClass = {
    full: "w-full",
    lg: "w-full max-w-2xl mx-auto",
    md: "w-full max-w-xl mx-auto",
  }[width];

  return (
    <figure className={`my-8 ${widthClass}`}>
      <div className="rounded-xl border border-border overflow-hidden bg-code-bg shadow-sm">
        {src ? (
          src.endsWith(".pdf") ? (
            <iframe
              src={src}
              title={alt}
              className={`w-full ${heightClass} bg-white`}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt}
              className="w-full object-contain"
              loading="lazy"
            />
          )
        ) : (
          /* CSS-only placeholder */
          <div
            className="relative w-full flex flex-col items-center justify-center gap-3 py-16 px-8"
            role="img"
            aria-label={placeholderLabel}
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, var(--border) 0, var(--border) 1px, transparent 0, transparent 50%)",
                backgroundSize: "20px 20px",
              }}
            />
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              className="text-muted/40 relative z-10"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <p className="relative z-10 text-sm text-muted/60 font-sans text-center">
              {/* ─── REPLACE: src="/your-figure.png" ─────────────────────────── */}
              {placeholderLabel}
            </p>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-center text-muted font-sans font-semibold leading-snug px-4">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
