"use client";

import { useId, useState } from "react";
import { Check, Copy, FileCode, Palette, Sparkles } from "lucide-react";
import styles from "./code-viewer.module.css";

export type CodeViewerProps = {
  previewKey: string;
  tsxCode: string;
  cssCode: string;
  aiPrompt: string;
};

type TabType = "tsx" | "css";

export function CodeViewer({
  previewKey,
  tsxCode,
  cssCode,
  aiPrompt,
}: CodeViewerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("tsx");
  const [copiedTarget, setCopiedTarget] = useState<"code" | "prompt" | null>(null);
  const [copyError, setCopyError] = useState<"code" | "prompt" | null>(null);
  const baseId = useId();

  const hasCss = cssCode.trim().length > 0;

  async function handleCopy(target: "code" | "prompt") {
    const textToCopy = target === "prompt" ? aiPrompt : activeTab === "tsx" ? tsxCode : cssCode;
    function fallbackCopy(text: string) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const copied = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (!copied) throw new Error("Clipboard copy failed");
    }

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(textToCopy);
        } catch {
          fallbackCopy(textToCopy);
        }
      } else {
        fallbackCopy(textToCopy);
      }
      setCopiedTarget(target);
      setCopyError(null);
      setTimeout(() => setCopiedTarget(null), 2000);
    } catch {
      setCopyError(target);
      setTimeout(() => setCopyError(null), 2500);
    }
  }

  const currentCode = activeTab === "tsx" ? tsxCode : cssCode;
  const lines = currentCode ? currentCode.split("\n") : [];

  return (
    <div className={styles.container} role="region" aria-label="Read-only component source">
      <div className={styles.header}>
        <div className={styles.tabs} role="tablist" aria-label="Code viewer tabs">
          <button
            id={`${baseId}-tab-tsx`}
            type="button"
            role="tab"
            aria-selected={activeTab === "tsx"}
            aria-controls={`${baseId}-panel-tsx`}
            className={styles.tab}
            onClick={() => setActiveTab("tsx")}
          >
            <FileCode size={14} aria-hidden="true" />
            <span>{previewKey}.tsx</span>
          </button>
          {hasCss && (
            <button
              id={`${baseId}-tab-css`}
              type="button"
              role="tab"
              aria-selected={activeTab === "css"}
              aria-controls={`${baseId}-panel-css`}
              className={styles.tab}
              onClick={() => setActiveTab("css")}
            >
              <Palette size={14} aria-hidden="true" />
              <span>{previewKey}.module.css</span>
            </button>
          )}
        </div>

        <div className={styles.actions}>
          <span className={styles.badge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            Read-only source
          </span>

          <button
            type="button"
            className={styles.promptButton}
            data-copied={copiedTarget === "prompt"}
            onClick={() => handleCopy("prompt")}
            aria-label={copyError === "prompt" ? "Failed to copy AI prompt" : "Copy AI build prompt"}
          >
            {copiedTarget === "prompt" ? <Check size={14} aria-hidden="true" /> : <Sparkles size={14} aria-hidden="true" />}
            <span>{copyError === "prompt" ? "Copy failed" : copiedTarget === "prompt" ? "Prompt copied" : "Copy AI prompt"}</span>
          </button>

          <button
            type="button"
            className={styles.copyButton}
            data-copied={copiedTarget === "code"}
            onClick={() => handleCopy("code")}
            aria-label={
              copiedTarget === "code"
                ? "Code copied to clipboard"
                : `Copy ${activeTab === "tsx" ? "TSX" : "CSS"} source code`
            }
          >
            {copiedTarget === "code" ? (
              <>
                <Check size={14} aria-hidden="true" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} aria-hidden="true" />
                <span>{copyError === "code" ? "Copy failed" : `Copy ${activeTab === "tsx" ? "TSX" : "CSS"}`}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div
        id={`${baseId}-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${activeTab}`}
        className={styles.panel}
      >
        <pre className={styles.codeBlock} tabIndex={0}>
          <code>
            {lines.map((line, idx) => (
              <span className={styles.line} key={idx}>
                <span className={styles.lineNumber} aria-hidden="true">{idx + 1}</span>
                <span className={styles.lineContent}>{highlightLine(line, activeTab)}</span>
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

/**
 * Lightweight, zero-dependency syntax highlighter for TSX and CSS.
 */
function highlightLine(line: string, language: "tsx" | "css") {
  if (!line) return " ";

  // Comment line check
  if (line.trim().startsWith("//") || line.trim().startsWith("/*")) {
    return <span className={styles.tokenComment}>{line}</span>;
  }

  if (language === "css") {
    // CSS rule or property highlighting
    const parts = line.split(/(:|;|{|})/);
    return parts.map((part, i) => {
      if (part === ":" || part === ";" || part === "{" || part === "}") {
        return <span key={i} className={styles.tokenPunctuation}>{part}</span>;
      }
      if (part.includes("var(") || part.includes("@")) {
        return <span key={i} className={styles.tokenKeyword}>{part}</span>;
      }
      return part;
    });
  }

  // TSX token highlighting
  const tokens = line.split(/([a-zA-Z_$][a-zA-Z0-9_$]*|"[^"]*"|'[^']*'|`[^`]*`|<[^>]+>|[{}()[\];,.])/g);

  const keywords = new Set([
    "import", "export", "from", "const", "let", "var", "function", "return",
    "default", "type", "interface", "as", "true", "false", "null", "undefined",
    "async", "await", "if", "else", "new", "readonly"
  ]);

  return tokens.map((token, i) => {
    if (!token) return null;

    if (keywords.has(token)) {
      return <span key={i} className={styles.tokenKeyword}>{token}</span>;
    }

    if ((token.startsWith('"') && token.endsWith('"')) ||
        (token.startsWith("'") && token.endsWith("'")) ||
        (token.startsWith("`") && token.endsWith("`"))) {
      return <span key={i} className={styles.tokenString}>{token}</span>;
    }

    if (token.startsWith("<") && token.endsWith(">")) {
      return <span key={i} className={styles.tokenTag}>{token}</span>;
    }

    if (/^[0-9]+(\.[0-9]+)?$/.test(token)) {
      return <span key={i} className={styles.tokenNumber}>{token}</span>;
    }

    return token;
  });
}
