"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiCheckLine,
  RiCodeSSlashLine,
  RiFileCopyLine,
  RiPencilLine,
  RiTerminalBoxLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

const labelText = "text-body-2-medium text-text-secondary";

/* -------------------------------------------------------------------------- */
/*  Code block                                                                 */
/* -------------------------------------------------------------------------- */

const SNIPPET = `import { Button } from "@/components/base/buttons/button";

export function PublishBar() {
  // The primary action owns the row.
  return (
    <div className="flex justify-end gap-2">
      <Button variant="ghost">Preview</Button>
      <Button variant="primary">Publish</Button>
    </div>
  );
}`;

const KEYWORDS = new Set(["import", "from", "export", "function", "return", "const", "let", "await", "async", "if", "else"]);

/** A deliberately small highlighter: comments, strings, keywords, calls. */
function highlight(line: string) {
  const pattern = /(\/\/.*$)|("[^"]*")|('[^']*')|`[^`]*`|\b[A-Za-z_$][\w$]*\b/g;
  const parts: { text: string; tone?: string }[] = [];
  let last = 0;
  for (const match of line.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > last) parts.push({ text: line.slice(last, index) });
    const token = match[0];
    let tone: string | undefined;
    if (token.startsWith("//")) tone = "text-text-tertiary italic";
    else if (/^["'`]/.test(token)) tone = "text-status-lime-text";
    else if (KEYWORDS.has(token)) tone = "text-status-purple-text";
    else if (line[index + token.length] === "(") tone = "text-status-blue-text";
    else if (/^[A-Z]/.test(token)) tone = "text-text-primary font-medium";
    parts.push({ text: token, tone });
    last = index + token.length;
  }
  if (last < line.length) parts.push({ text: line.slice(last) });
  return parts;
}

export function CodeBlock({ title = "publish-bar.tsx" }: { title?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <div className="w-full max-w-[520px] overflow-hidden rounded-xl border border-border-button-default bg-docs-code-background">
      <div className="flex items-center justify-between border-b border-separator-border px-3 py-1.5">
        <span className="flex items-center gap-1.5 text-caption-1-medium text-text-secondary">
          <RiCodeSSlashLine className="size-3.5" aria-hidden /> {title}
        </span>
        <button
          type="button"
          onClick={() => setCopied(true)}
          className="flex items-center gap-1 rounded-sm px-1 py-0.5 text-caption-2-semibold text-text-tertiary transition-colors duration-150 ease hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          {copied ? <RiCheckLine className="size-3.5 text-state-success-text" aria-hidden /> : <RiFileCopyLine className="size-3.5" aria-hidden />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 text-caption-1-regular leading-5">
        <code className="font-mono">
          {SNIPPET.split("\n").map((line, index) => (
            <span key={index} className="flex">
              <span aria-hidden className="w-5 shrink-0 select-none text-end text-text-tertiary/60 tabular-nums">{index + 1}</span>
              <span className="ps-3 text-text-primary">
                {highlight(line).map((part, partIndex) => (
                  <span key={partIndex} className={part.tone}>{part.text}</span>
                ))}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Copy button                                                                */
/* -------------------------------------------------------------------------- */

export function CopyButton({ value = "npx victory-ui@latest add button", label = "Copy install command" }: { value?: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard?.writeText(value).catch(() => undefined);
        setCopied(true);
      }}
      aria-label={label}
      className={cx(
        "inline-flex h-8 items-center gap-1.5 rounded-lg border px-2 text-body-2-medium shadow-xs transition-colors duration-150 ease",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
        copied
          ? "border-border-button-default bg-status-lime-background text-status-lime-text"
          : "border-border-button-default bg-background-primary-default text-text-secondary hover:bg-background-primary-hover hover:text-text-primary",
      )}
    >
      {copied ? <RiCheckLine className="size-4" aria-hidden /> : <RiFileCopyLine className="size-4" aria-hidden />}
      <span className="font-mono text-caption-1-regular">{copied ? "Copied to clipboard" : value}</span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Inline edit                                                                */
/* -------------------------------------------------------------------------- */

export function InlineEdit({ initial = "Night shoot — contact sheet" }: { initial?: string }) {
  const id = useId();
  const [value, setValue] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initial);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const commit = () => {
    const next = draft.trim();
    if (next) setValue(next);
    setEditing(false);
  };

  return (
    <div className="flex w-full max-w-[320px] flex-col gap-1">
      <label htmlFor={id} className={labelText}>Document name</label>
      {editing ? (
        <input
          id={id}
          ref={inputRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") commit();
            if (event.key === "Escape") {
              setDraft(value);
              setEditing(false);
            }
          }}
          className="h-8 rounded-lg bg-background-tertiary-default px-2 text-body-medium text-text-primary outline-none ring-2 ring-inset ring-border-button-active"
        />
      ) : (
        <button
          id={id}
          type="button"
          onClick={() => {
            setDraft(value);
            setEditing(true);
          }}
          className="group flex h-8 items-center gap-1.5 rounded-lg px-2 text-start text-body-medium text-text-primary ring-2 ring-inset ring-transparent transition-colors duration-150 ease hover:bg-background-tertiary-default focus-visible:outline-none focus-visible:ring-border-focus-ring"
        >
          <span className="min-w-0 flex-1 truncate">{value}</span>
          <RiPencilLine className="size-3.5 shrink-0 text-foreground-icon-tertiary opacity-0 transition-opacity duration-150 ease group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden />
        </button>
      )}
      <span className="text-caption-1-regular text-text-tertiary">Click to rename · Enter saves, Escape cancels.</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  JSON viewer                                                                */
/* -------------------------------------------------------------------------- */

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

const PAYLOAD: Json = {
  template: "editorial-deck",
  size: { width: 1920, height: 1080 },
  pages: 12,
  published: false,
  owner: { name: "Morgan Lee", plan: "studio" },
};

function JsonNode({ value, depth = 0, name }: { value: Json; depth?: number; name?: string }) {
  const [open, setOpen] = useState(depth < 2);
  const isObject = typeof value === "object" && value !== null;
  const entries = isObject ? Object.entries(value as Record<string, Json>) : [];

  if (!isObject) {
    const tone =
      typeof value === "string" ? "text-status-lime-text" : typeof value === "boolean" ? "text-status-purple-text" : "text-status-blue-text";
    return (
      <div className="flex gap-1.5 ps-4">
        {name && <span className="text-text-secondary">{name}:</span>}
        <span className={tone}>{typeof value === "string" ? `"${value}"` : String(value)}</span>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((next) => !next)}
        aria-expanded={open}
        className="flex w-full items-center gap-1 rounded-sm text-start hover:bg-background-secondary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
      >
        {open ? <RiArrowDownSLine className="size-3.5 shrink-0 text-foreground-icon-tertiary" aria-hidden /> : <RiArrowRightSLine className="size-3.5 shrink-0 text-foreground-icon-tertiary rtl:-scale-x-100" aria-hidden />}
        {name && <span className="text-text-secondary">{name}:</span>}
        <span className="text-text-tertiary">{Array.isArray(value) ? `[${entries.length}]` : `{${entries.length}}`}</span>
      </button>
      {open && (
        <div className="ms-2 border-s border-separator-border ps-2">
          {entries.map(([key, child]) => (
            <JsonNode key={key} name={Array.isArray(value) ? undefined : key} value={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function JsonViewer({ title = "design.json" }: { title?: string }) {
  return (
    <div className="w-full max-w-[320px] overflow-hidden rounded-xl border border-border-button-default bg-docs-code-background">
      <div className="flex items-center justify-between border-b border-separator-border px-3 py-1.5">
        <span className="text-caption-1-medium text-text-secondary">{title}</span>
        <span className="text-caption-2-regular text-text-tertiary">5 keys</span>
      </div>
      <div className="p-2 font-mono text-caption-1-regular leading-5">
        <JsonNode value={PAYLOAD} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Diff viewer                                                                */
/* -------------------------------------------------------------------------- */

const DIFF = [
  { type: "ctx", old: 12, next: 12, text: "export function Cover() {" },
  { type: "del", old: 13, next: null, text: "  return <h1 className=\"text-6xl\">{title}</h1>;" },
  { type: "add", old: null, next: 13, text: "  return (" },
  { type: "add", old: null, next: 14, text: "    <h1 className=\"text-5xl text-balance\">{title}</h1>" },
  { type: "add", old: null, next: 15, text: "  );" },
  { type: "ctx", old: 14, next: 16, text: "}" },
];

export function DiffViewer({ title = "Cover.tsx" }: { title?: string }) {
  const added = DIFF.filter((line) => line.type === "add").length;
  const removed = DIFF.filter((line) => line.type === "del").length;

  return (
    <div className="w-full max-w-[520px] overflow-hidden rounded-xl border border-border-button-default bg-docs-code-background">
      <div className="flex items-center justify-between border-b border-separator-border px-3 py-1.5">
        <span className="text-caption-1-medium text-text-secondary">{title}</span>
        <span className="flex items-center gap-2 text-caption-2-semibold">
          <span className="text-state-success-text">+{added}</span>
          <span className="text-text-destructive">−{removed}</span>
        </span>
      </div>
      <div className="overflow-x-auto py-1 font-mono text-caption-1-regular leading-5">
        {DIFF.map((line, index) => (
          <div
            key={index}
            className={cx(
              "flex items-center gap-2 px-2",
              line.type === "add" && "bg-status-lime-background",
              line.type === "del" && "bg-status-rose-background",
            )}
          >
            <span aria-hidden className="w-4 shrink-0 select-none text-end text-text-tertiary tabular-nums">{line.old ?? ""}</span>
            <span aria-hidden className="w-4 shrink-0 select-none text-end text-text-tertiary tabular-nums">{line.next ?? ""}</span>
            <span
              aria-hidden
              className={cx(
                "w-2 shrink-0 select-none",
                line.type === "add" ? "text-state-success-text" : line.type === "del" ? "text-text-destructive" : "text-transparent",
              )}
            >
              {line.type === "add" ? "+" : line.type === "del" ? "−" : " "}
            </span>
            <span className={cx("whitespace-pre", line.type === "del" && "text-text-tertiary line-through decoration-text-tertiary/40")}>{line.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Quote                                                                      */
/* -------------------------------------------------------------------------- */

export function Quote({
  text = "The grid is a promise. Everything else is a negotiation.",
  author = "Morgan Lee",
  role = "Art director, Editrim",
}: {
  text?: string;
  author?: string;
  role?: string;
}) {
  return (
    <figure className="flex w-full max-w-[340px] flex-col gap-2">
      <span aria-hidden className="text-[32px] leading-none text-accent-500">“</span>
      <blockquote className="text-title-3-regular text-balance text-text-primary">{text}</blockquote>
      <figcaption className="flex items-center gap-1.5 text-caption-1-regular text-text-tertiary">
        <span className="h-px w-4 bg-separator-border-strong" aria-hidden />
        <span className="text-text-secondary">{author}</span>
        <span aria-hidden>·</span>
        <span>{role}</span>
      </figcaption>
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/*  Terminal                                                                   */
/* -------------------------------------------------------------------------- */

const LINES = [
  { prompt: true, text: "npm run build" },
  { prompt: false, text: "▲ Next.js 16.3.3" },
  { prompt: false, text: "  Creating an optimized production build …" },
  { prompt: false, text: "✓ Compiled successfully in 4.2s" },
  { prompt: false, text: "✓ Generating static pages (9/9)" },
];

export function Terminal({ title = "build" }: { title?: string }) {
  return (
    <div className="w-full max-w-[380px] overflow-hidden rounded-xl border border-border-button-default bg-docs-code-background">
      <div className="flex items-center gap-1.5 border-b border-separator-border px-3 py-1.5">
        <RiTerminalBoxLine className="size-3.5 text-foreground-icon-tertiary" aria-hidden />
        <span className="text-caption-1-medium text-text-secondary">{title}</span>
      </div>
      <div className="overflow-x-auto p-3 font-mono text-caption-1-regular leading-5">
        {LINES.map((line, index) => (
          <div key={index} className="flex gap-1.5 whitespace-pre">
            {line.prompt && <span className="text-accent-500" aria-hidden>❯</span>}
            <span className={line.text.startsWith("✓") ? "text-state-success-text" : "text-text-secondary"}>{line.text}</span>
            {index === LINES.length - 1 && <span aria-hidden className="ms-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-text-tertiary align-middle" />}
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Specimens                                                                  */
/* -------------------------------------------------------------------------- */

export const CONTENT_SECTION: ExtendedSection = {
  id: "content",
  title: "Content",
  blurb: "Code, quotes and the small editing verbs that keep a document alive.",
  file: "content.tsx",
  entries: [
    { name: "Code Block", description: "A file with line numbers, tone and a copy action.", Demo: CodeBlock, wide: true },
    { name: "Inline Edit", description: "Rename in place with Enter and Escape.", Demo: InlineEdit },
    { name: "Copy Button", description: "Copies, confirms, and returns to rest.", Demo: CopyButton, wide: true },
    { name: "JSON Viewer", description: "Collapsible keys with typed values.", Demo: JsonViewer },
    { name: "Diff Viewer", description: "A unified diff with both line numbers.", Demo: DiffViewer, wide: true },
    { name: "Quote", description: "An editorial pull quote with its attribution.", Demo: Quote },
    { name: "Terminal", description: "A build log with a live cursor.", Demo: Terminal, wide: true },
  ],
};
