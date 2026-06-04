// ─── REPLACE: Set videoUrl to your YouTube embed URL, or use imageSrc ────────
// To use a video:   <MediaHero videoUrl="https://www.youtube.com/embed/YOUR_ID?autoplay=1&mute=1&loop=1" />
// To use an image:  <MediaHero imageSrc="/demo-preview.png" imageAlt="Demo screenshot" />
// To keep placeholder: use no props

interface MediaHeroProps {
  videoUrl?: string;
  imageSrc?: string;
  imageAlt?: string;
  caption?: string;
}

export default function MediaHero({
  videoUrl,
  imageSrc,
  imageAlt = "Project demo",
  // ─── REPLACE: Update caption text ──────────────────────────────────────────
  caption = "A real-time demonstration of PROJECT_NAME processing input and producing output.",
}: MediaHeroProps) {
  return (
    <figure className="mb-12">
      <div className="w-full rounded-xl overflow-hidden border border-border bg-code-bg shadow-sm">
        {videoUrl ? (
          /* YouTube / iframe embed */
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={videoUrl}
              title="Project demo video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              loading="lazy"
            />
          </div>
        ) : imageSrc ? (
          /* Static image */
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full object-cover"
            loading="lazy"
          />
        ) : (
          /* CSS-only placeholder — replace this entire block with your media */
          <div
            className="relative w-full flex flex-col items-center justify-center gap-4"
            style={{ aspectRatio: "16/9" }}
            aria-label="Demo video placeholder"
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, var(--border) 0, var(--border) 1px, transparent 0, transparent 50%)",
                backgroundSize: "22px 22px",
              }}
            />
            <div className="relative z-10 w-14 h-14 rounded-full bg-paper border border-border flex items-center justify-center shadow-sm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-strong)" strokeWidth="1.5" aria-hidden="true">
                <polygon points="5 3 19 12 5 21 5 3" fill="#e6ffe6" stroke="var(--accent-strong)"/>
              </svg>
            </div>
            <p className="relative z-10 text-sm text-muted font-sans font-medium">
              Add project figure or demo video
            </p>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-left text-muted font-sans italic leading-snug">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
