"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RiCheckLine, RiErrorWarningLine, RiFileCopyLine } from "@remixicon/react";

import { cx } from "@/utils/cx";

/**
 * Copies one specimen's source, exactly as it ships.
 *
 * The build step (`scripts/generate-extended-sources.mjs`) writes one JSON per
 * family into `public/sources`, holding the file's preamble (imports and shared
 * helpers) plus each component's own declaration. A family's JSON is fetched
 * the first time one of its buttons is used and then kept in memory, so the
 * library page never ships 500 copies of component source.
 */

type SourceFile = {
  id: string;
  file: string;
  preamble: string;
  entries: Record<string, string>;
};

type Status = "idle" | "working" | "copied" | "error";

const cache = new Map<string, Promise<SourceFile>>();

function loadSource(sectionId: string): Promise<SourceFile> {
  const existing = cache.get(sectionId);
  if (existing) return existing;
  const request = fetch(`/sources/${sectionId}.json`, { cache: "force-cache" })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json() as Promise<SourceFile>;
    })
    .catch((error) => {
      cache.delete(sectionId);
      throw error;
    });
  cache.set(sectionId, request);
  return request;
}

/** Clipboard API where available, a hidden textarea everywhere else. */
async function writeClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall through to the legacy path (Safari, permission denials).
    }
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.top = "0";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(area);
  if (!ok) throw new Error("copy failed");
}

export function CopySourceButton({
  sectionId,
  entryName,
  className,
}: {
  sectionId: string;
  entryName: string;
  className?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  const settle = (next: Status, delay: number) => {
    setStatus(next);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus("idle"), delay);
  };

  const copy = useCallback(async () => {
    setStatus("working");
    try {
      const source = await loadSource(sectionId);
      const body = source.entries[entryName];
      if (!body) throw new Error("missing entry");
      await writeClipboard(`${source.preamble}\n\n${body}`);
      settle("copied", 1800);
    } catch {
      settle("error", 2400);
    }
  }, [sectionId, entryName]);

  const label =
    status === "copied"
      ? "Copied"
      : status === "error"
        ? "Copy failed"
        : status === "working"
          ? "Copying"
          : "Copy code";

  return (
    <button
      type="button"
      data-copy-source={entryName}
      onClick={copy}
      disabled={status === "working"}
      aria-label={`Copy ${entryName} source code`}
      title={`Copy ${entryName} source code`}
      className={cx(
        "inline-flex h-7 shrink-0 items-center gap-1 rounded-md border px-1.5",
        "text-caption-2-medium whitespace-nowrap shadow-xs backdrop-blur-sm",
        "transition-[background-color,border-color,color] duration-150 ease",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
        status === "copied"
          ? "border-state-success-base bg-state-success-base text-state-success-text"
          : status === "error"
            ? "border-border-error-default bg-background-primary-default text-text-error-primary"
            : "border-border-button-default bg-background-primary-default/90 text-text-secondary hover:border-border-button-hover hover:text-text-primary",
        status === "working" && "opacity-70",
        className,
      )}
    >
      {status === "copied" ? (
        <RiCheckLine className="size-3.5" aria-hidden />
      ) : status === "error" ? (
        <RiErrorWarningLine className="size-3.5" aria-hidden />
      ) : (
        <RiFileCopyLine className="size-3.5" aria-hidden />
      )}
      <span className="hidden sm:inline">{label}</span>
      <span className="sr-only sm:hidden">{label}</span>
    </button>
  );
}
