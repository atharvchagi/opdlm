const LINKS = [
  {
    label: "Paper",
    href: "https://arxiv.org/abs/2606.06712",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    iconOnly: true,
    primary: true,
  },
  {
    label: "Code",
    href: "https://github.com/divelab/OPDLM",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
    iconOnly: true,
    primary: false,
  },
  {
    label: "Models",
    href: "https://huggingface.co/collections/divelab/opdlm",
    icon: (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/hf_logo.png" alt="" className="h-3.5 w-3.5 object-contain" />
    ),
    iconOnly: true,
    primary: false,
  },
];

export default function LinkButtons() {
  return (
    <div className="flex flex-wrap items-center justify-start gap-2.5 mb-4 -mt-8">
      {LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.href.startsWith("http") ? "_blank" : undefined}
          rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
          aria-label={link.iconOnly ? link.label : undefined}
          title={link.iconOnly ? link.label : undefined}
          className={`
            inline-flex items-center gap-2 ${link.iconOnly ? "px-3" : "px-4"} py-2 text-sm font-sans font-medium rounded-md
            border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong focus-visible:ring-offset-2
            ${
              link.primary
                ? "bg-accent text-ink border-accent-border hover:bg-accent hover:border-accent-strong shadow-sm hover:shadow-md"
                : "bg-paper text-ink border-border hover:border-accent-border hover:text-ink hover:bg-accent-light"
            }
          `}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}
