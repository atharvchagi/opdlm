"use client";

import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  label?: string;
}

const COMMANDS = new Set([
  "bash",
  "conda",
  "export",
  "huggingface-cli",
  "pip",
  "python",
]);

function tokenClassName(token: string, isCommand: boolean) {
  if (token === "\\") return "text-muted";
  if (token.startsWith("#")) return "text-muted";
  if (token.startsWith("--")) return "text-accent-strong";
  if (/^\$[A-Z0-9_]+/.test(token)) return "text-accent-strong";
  if (/^[A-Z0-9_]+=/.test(token)) return "text-accent-strong";
  if (/^<[^>]+>$/.test(token)) return "text-ink/70 italic";
  if (isCommand || COMMANDS.has(token)) return "text-ink font-medium";
  return "text-ink/90";
}

function renderBashLine(line: string, lineIndex: number) {
  const trimmedStart = line.trimStart();

  if (trimmedStart.startsWith("#")) {
    const leadingSpace = line.slice(0, line.length - trimmedStart.length);
    return (
      <span key={lineIndex}>
        {leadingSpace}
        <span className="text-muted">{trimmedStart}</span>
      </span>
    );
  }

  let hasCommand = false;

  return (
    <span key={lineIndex}>
      {line.split(/(\s+)/).map((token, tokenIndex) => {
        if (!token || /^\s+$/.test(token)) return token;

        const isAssignment = /^[A-Z0-9_]+=/.test(token);
        const isContinuation = token === "\\";
        const isFlag = token.startsWith("--");
        const isCommand =
          !hasCommand &&
          !isAssignment &&
          !isContinuation &&
          !isFlag &&
          !token.startsWith("$");

        if (isCommand) hasCommand = true;

        return (
          <span className={tokenClassName(token, isCommand)} key={`${lineIndex}-${tokenIndex}`}>
            {token}
          </span>
        );
      })}
    </span>
  );
}

function renderCode(code: string, language: string) {
  const normalized = code.trim();

  if (language !== "bash" && language !== "sh" && language !== "shell") {
    return normalized;
  }

  return normalized.split("\n").map((line, index, lines) => (
    <span key={index}>
      {renderBashLine(line, index)}
      {index < lines.length - 1 ? "\n" : null}
    </span>
  ));
}

export default function CodeBlock({
  code,
  language = "bash",
  label,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for non-secure contexts
      const ta = document.createElement("textarea");
      ta.value = code.trim();
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="my-5 rounded-lg border border-border overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-border/40 border-b border-border">
        <div className="flex items-center gap-2">
          {/* Traffic lights */}
          <span className="w-2.5 h-2.5 rounded-full bg-border" aria-hidden="true" />
          <span className="w-2.5 h-2.5 rounded-full bg-border" aria-hidden="true" />
          <span className="w-2.5 h-2.5 rounded-full bg-border" aria-hidden="true" />
          {label && (
            <span className="ml-2 text-xs font-mono text-muted">{label}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted/60 uppercase tracking-wider">
            {language}
          </span>
          <button
            onClick={handleCopy}
            className={`
              flex items-center gap-1.5 text-xs font-sans px-2.5 py-1 rounded-md border transition-all duration-150
              ${
                copied
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-paper border-border text-muted hover:text-ink hover:border-ink/20"
              }
            `}
            aria-label="Copy code to clipboard"
          >
            {copied ? (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>
      {/* Code content */}
      <pre className="overflow-x-auto p-4 bg-code-bg text-sm leading-relaxed">
        <code
          className="font-mono text-ink/90"
          // Language class for future syntax highlighting (e.g. Prism, Shiki)
          data-language={language}
        >
          {renderCode(code, language)}
        </code>
      </pre>
    </div>
  );
}
