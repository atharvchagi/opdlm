"use client";

import { useState } from "react";

const BIBTEX = `@misc{su2026opdlm,
      title={Data-Efficient Autoregressive-to-Diffusion Language Models via On-Policy Distillation},
      author={Xingyu Su and Jacob Helwig and Shubham Parashar and Atharv Chagi and Lakshmi Jotsna and Degui Zhi and James Caverlee and Dileep Kalathil and Shuiwang Ji},
      year={2026},
      eprint={2606.06712},
      archivePrefix={arXiv},
      primaryClass={cs.CL},
      url={https://arxiv.org/abs/2606.06712},
}`;

export default function CitationBlock() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(BIBTEX);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = BIBTEX;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-lg border border-border overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-2.5 bg-border/30 border-b border-border">
        <span className="text-xs font-mono text-muted uppercase tracking-wider">BibTeX</span>
        <button
          type="button"
          onClick={handleCopy}
          className={`
            flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-sans transition-all duration-150
            ${
              copied
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-paper border-border text-muted hover:text-ink hover:border-ink/20"
            }
          `}
          aria-label="Copy BibTeX citation to clipboard"
        >
          {copied ? (
            <>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto bg-code-bg p-4 text-sm leading-relaxed text-ink/90">
        <code>{BIBTEX}</code>
      </pre>
    </div>
  );
}
