const HERO_DATA = {
  title: "Data-Efficient Autoregressive-to-Diffusion Language Models via On-Policy Distillation",
  authors: [
    { name: "Xingyu Su", affiliation: "1", equalContribution: true },
    { name: "Jacob Helwig", affiliation: "1", equalContribution: true },
    { name: "Shubham Parashar", affiliation: "1", equalContribution: true },
    { name: "Atharv Chagi", affiliation: "1" },
    { name: "Lakshmi Jotsna", affiliation: "1" },
    { name: "Degui Zhi", affiliation: "2" },
    { name: "James Caverlee", affiliation: "1" },
    { name: "Dileep Kalathil", affiliation: "1,3" },
    { name: "Shuiwang Ji", affiliation: "1" },
  ],
  affiliations: [
    { id: "1", name: "Department of Computer Science and Engineering, Texas A&M University" },
    { id: "2", name: "Department of Bioinformatics and Systems Medicine, University of Texas Health Science Center at Houston" },
    { id: "3", name: "Department of Electrical and Computer Engineering, Texas A&M University" },
  ],
  venue: "Preprint",
};

export default function Hero() {
  const { title, authors, affiliations, venue } = HERO_DATA;
  const firstLineAuthors = authors.slice(0, 7);
  const secondLineAuthors = authors.slice(7);

  return (
    <section className="pt-24 pb-8 text-left">
      {/* Title */}
      <h1 className="max-w-4xl font-sans font-semibold leading-snug text-ink mb-4"
        style={{ fontSize: "clamp(1.5rem, 3.4vw, 2.1rem)" }}>
        {title}
      </h1>

      {/* Authors */}
      <p className="text-base text-muted font-sans mb-1.5">
        {firstLineAuthors.map((author, i) => (
          <span key={author.name} className={i < firstLineAuthors.length - 1 ? "inline-block mr-2" : "inline-block"}>
            <span className="font-semibold text-ink">{author.name}</span>
            {author.equalContribution && (
              <sup className="text-muted/70 text-[10px] ml-0.5">*</sup>
            )}
            {author.affiliation && (
              <sup className="text-muted/70 text-[10px] ml-0.5">{author.affiliation}</sup>
            )}
          </span>
        ))}
        <br />
        {secondLineAuthors.map((author, i) => (
          <span key={author.name} className={i < secondLineAuthors.length - 1 ? "inline-block mr-2" : "inline-block"}>
            <span className="font-semibold text-ink">{author.name}</span>
            {author.equalContribution && (
              <sup className="text-muted/70 text-[10px] ml-0.5">*</sup>
            )}
            {author.affiliation && (
              <sup className="text-muted/70 text-[10px] ml-0.5">{author.affiliation}</sup>
            )}
          </span>
        ))}
      </p>

      <p className="text-xs text-muted/70 font-sans mb-1">
        * Equal contribution
      </p>

      {/* Affiliations */}
      <p className="text-sm text-muted/80 font-sans mb-3">
        {affiliations.map((aff, i) => (
          <span key={aff.id}>
            {i > 0 && <span className="mx-2 text-border">·</span>}
            <sup className="mr-0.5">{aff.id}</sup>{aff.name}
          </span>
        ))}
      </p>

      {/* Venue badge */}
      <p className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-muted bg-border/60 px-3 py-1 rounded-full mb-7">
        <span className="w-1.5 h-1.5 rounded-full bg-accent border border-accent-strong inline-block" aria-hidden="true" />
        {venue}
      </p>
    </section>
  );
}
