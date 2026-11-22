"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import {
  RiAddLine,
  RiArrowRightSLine,
  RiBellLine,
  RiCheckDoubleLine,
  RiCheckLine,
  RiCloseLine,
  RiFileCopyLine,
  RiImageLine,
  RiLinkM,
  RiLoaderLine,
  RiLock2Line,
  RiMoreLine,
  RiRefreshLine,
  RiSearchLine,
  RiShareLine,
  RiStickyNoteLine,
  RiTimeLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

const iconButton =
  "flex size-7 shrink-0 items-center justify-center rounded-md text-foreground-icon-secondary transition-colors duration-150 ease " +
  "hover:bg-background-secondary-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";

const secondaryButton =
  "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-border-button-default bg-background-primary-default px-2.5 " +
  "text-body-2-medium text-text-primary shadow-xs transition-colors duration-150 ease hover:bg-background-primary-hover " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";

const primaryButton =
  "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-accent-600 px-2.5 text-body-2-medium text-text-white shadow-xs " +
  "transition-colors duration-150 ease hover:bg-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";

/* -------------------------------------------------------------------------- */
/*  Panel                                                                      */
/* -------------------------------------------------------------------------- */

const PANEL_CHECKS = [
  { id: "copy", label: "Copy reviewed", meta: "Maya · 09:12" },
  { id: "assets", label: "Assets exported", meta: "18 files" },
  { id: "alt", label: "Alt text checked", meta: "2 missing" },
  { id: "preview", label: "Preview shared", meta: "Not sent" },
];

const INITIAL_PANEL_STATE = [true, true, false, false];

export function Panel() {
  const [done, setDone] = useState<boolean[]>(INITIAL_PANEL_STATE);

  const completed = done.filter(Boolean).length;
  const percent = (completed / PANEL_CHECKS.length) * 100;

  return (
    <section className="w-full max-w-[320px] overflow-hidden rounded-2xl border border-border-button-default bg-background-primary-default shadow-xs">
      <header className="flex items-start justify-between gap-2 border-b border-separator-border px-3 py-2.5">
        <div className="min-w-0">
          <h3 className="text-headline-medium text-text-primary">Release checklist</h3>
          <p className="mt-0.5 truncate text-caption-1-regular text-text-tertiary">Website · v2.14.0</p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            aria-label="Mark all checks complete"
            onClick={() => setDone(PANEL_CHECKS.map(() => true))}
            className={iconButton}
          >
            <RiCheckDoubleLine className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Reset checklist"
            onClick={() => setDone(INITIAL_PANEL_STATE)}
            className={iconButton}
          >
            <RiRefreshLine className="size-4" aria-hidden />
          </button>
        </div>
      </header>

      <div className="px-3 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <span aria-live="polite" className="text-caption-1-regular text-text-secondary">
            {completed} of {PANEL_CHECKS.length} complete
          </span>
          <span className="text-caption-2-regular text-text-tertiary tabular-nums">{Math.round(percent)}%</span>
        </div>
        <div
          role="progressbar"
          aria-label="Release checks complete"
          aria-valuemin={0}
          aria-valuemax={PANEL_CHECKS.length}
          aria-valuenow={completed}
          aria-valuetext={`${completed} of ${PANEL_CHECKS.length} checks`}
          className="mt-1.5 h-1 overflow-hidden rounded-full bg-background-tertiary-default"
        >
          <div
            className="h-full rounded-full bg-accent-600 transition-[width] duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>

        <ul className="mt-2 flex flex-col">
          {PANEL_CHECKS.map((check, index) => {
            const isDone = done[index] ?? false;
            return (
              <li key={check.id}>
                <button
                  type="button"
                  aria-pressed={isDone}
                  onClick={() =>
                    setDone((current) => current.map((value, position) => (position === index ? !value : value)))
                  }
                  className="flex w-full items-center gap-2 rounded-md px-1 py-1.5 text-start transition-colors duration-100 ease hover:bg-background-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                >
                  <span
                    aria-hidden
                    className={cx(
                      "flex size-4 shrink-0 items-center justify-center rounded-full border",
                      isDone
                        ? "border-accent-600 bg-accent-600 text-text-white"
                        : "border-border-button-default bg-background-primary-default",
                    )}
                  >
                    {isDone && <RiCheckLine className="size-3" />}
                  </span>
                  <span
                    className={cx(
                      "min-w-0 flex-1 truncate text-body-2-medium",
                      isDone ? "text-text-tertiary line-through" : "text-text-primary",
                    )}
                  >
                    {check.label}
                  </span>
                  <span className="shrink-0 text-caption-2-regular text-text-tertiary">
                    {isDone ? "Done" : check.meta}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <footer className="flex items-center justify-between gap-2 border-t border-separator-border px-3 py-1.5">
        <span className="text-caption-2-regular text-text-tertiary">Last run 09:42</span>
        <span className="text-caption-2-regular text-text-tertiary">Auto-checks on save</span>
      </footer>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sheet                                                                      */
/* -------------------------------------------------------------------------- */

const SHEET_ACCESS = [
  { id: "view", label: "View" },
  { id: "comment", label: "Comment" },
  { id: "edit", label: "Edit" },
] as const;

type SheetAccess = (typeof SHEET_ACCESS)[number]["id"];

const ACCESS_DETAIL: Record<SheetAccess, string> = {
  view: "can view and download the cut",
  comment: "can comment and draw on frames",
  edit: "can replace media and adjust the cut",
};

export function Sheet() {
  const [open, setOpen] = useState(false);
  const [access, setAccess] = useState<SheetAccess>("comment");
  const [copied, setCopied] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open) closeRef.current?.focus();
    if (wasOpen.current && !open) triggerRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const trapFocus = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const focusable = event.currentTarget.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable.item(0);
    const last = focusable.item(focusable.length - 1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="surfaces-share-sheet"
        onClick={() => {
          setCopied(false);
          setOpen(true);
        }}
        className={secondaryButton}
      >
        <RiShareLine className="size-4 text-foreground-icon-secondary" aria-hidden />
        Share review
      </button>

      <div
        aria-hidden={!open}
        inert={!open}
        className={cx("fixed inset-0 z-50 overflow-hidden", open ? "pointer-events-auto" : "pointer-events-none")}
      >
        <div
          aria-hidden
          className={cx(
            "absolute inset-0 bg-background-tertiary-default/60 backdrop-blur-[2px] transition-opacity duration-200 ease",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <button
          type="button"
          aria-label="Dismiss share sheet"
          tabIndex={-1}
          onClick={() => setOpen(false)}
          className="absolute inset-0 cursor-default focus:outline-none"
        />

        <div
          id="surfaces-share-sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby="surfaces-share-title"
          aria-describedby="surfaces-share-description"
          onKeyDown={trapFocus}
          className={cx(
            "absolute inset-y-0 end-0 flex w-full max-w-[360px] flex-col border-s border-border-button-default bg-background-primary-default shadow-xl",
            "transition-transform duration-200 ease-out",
            open ? "translate-x-0" : "translate-x-full rtl:-translate-x-full",
          )}
        >
          <header className="flex items-start justify-between gap-3 border-b border-separator-border px-3 py-3">
            <div className="min-w-0">
              <h2 id="surfaces-share-title" className="text-title-3-semibold text-text-primary">
                Share review
              </h2>
              <p id="surfaces-share-description" className="mt-0.5 text-caption-1-regular text-text-tertiary">
                Invite a client to comment on the final cut.
              </p>
            </div>
            <button
              ref={closeRef}
              type="button"
              aria-label="Close share sheet"
              onClick={() => setOpen(false)}
              className={iconButton}
            >
              <RiCloseLine className="size-4" aria-hidden />
            </button>
          </header>

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-3">
            <div className="flex flex-col gap-1">
              <span className="text-caption-1-regular uppercase tracking-wide text-text-tertiary">Share link</span>
              <div className="flex items-center gap-1.5 rounded-lg border border-border-button-default bg-background-secondary-default px-2 py-1.5">
                <RiLinkM className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
                <span dir="ltr" className="min-w-0 flex-1 truncate text-body-2-medium text-text-secondary">
                  northlight.studio/s/9f2c
                </span>
                <button
                  type="button"
                  aria-label={copied ? "Link copied" : "Copy share link"}
                  onClick={() => setCopied(true)}
                  className={iconButton}
                >
                  {copied ? (
                    <RiCheckLine className="size-4 text-accent-600" aria-hidden />
                  ) : (
                    <RiFileCopyLine className="size-4" aria-hidden />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-caption-1-regular uppercase tracking-wide text-text-tertiary">Access</span>
              <div role="group" aria-label="Link access" className="grid grid-cols-3 gap-0.5 rounded-lg bg-background-secondary-default p-0.5">
                {SHEET_ACCESS.map((option) => {
                  const active = access === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setAccess(option.id)}
                      className={cx(
                        "h-7 rounded-md text-caption-1-regular transition-colors duration-150 ease",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                        active
                          ? "bg-background-primary-default text-text-primary shadow-xs"
                          : "text-text-tertiary hover:text-text-secondary",
                      )}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
              <p className="text-caption-1-regular text-text-tertiary">Anyone with the link {ACCESS_DETAIL[access]}.</p>
            </div>

            <div className="flex items-start gap-2 rounded-lg bg-background-secondary-default px-2.5 py-2">
              <RiLock2Line className="mt-px size-3.5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
              <p className="text-caption-1-regular text-text-secondary">
                Downloads are watermarked with the reviewer&apos;s name. You can revoke the link at any time.
              </p>
            </div>

            <div className="flex items-center gap-2 text-caption-2-regular text-text-tertiary">
              <RiTimeLine className="size-3.5" aria-hidden />
              <span>Link expires in 7 days</span>
            </div>
          </div>

          <footer className="flex items-center justify-between gap-2 border-t border-separator-border p-3">
            <button type="button" onClick={() => setOpen(false)} className={secondaryButton}>
              Cancel
            </button>
            <button type="button" onClick={() => setCopied(true)} className={cx(primaryButton, "min-w-[112px]")}>
              {copied ? <RiCheckLine className="size-4" aria-hidden /> : <RiFileCopyLine className="size-4" aria-hidden />}
              {copied ? "Copied" : "Copy link"}
            </button>
          </footer>

          <span role="status" aria-live="polite" className="sr-only">
            {copied ? "Share link copied" : ""}
          </span>
        </div>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Well                                                                       */
/* -------------------------------------------------------------------------- */

export function Well() {
  return (
    <figure className="w-full max-w-[320px]">
      <div className="rounded-xl bg-background-secondary-default p-3 ring-1 ring-border-button-default ring-inset">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <RiStickyNoteLine className="size-3.5 text-foreground-icon-secondary" aria-hidden />
            <span className="text-caption-1-regular uppercase tracking-wide text-text-tertiary">Working note</span>
          </div>
          <RiLock2Line className="size-3.5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
        </div>
        <p className="mt-1.5 text-body-regular text-text-secondary">
          The client wants the cover at 3:2, not 16:10. Keep the type block where it is and crop from the left edge.
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-caption-2-regular text-text-tertiary">
          <RiTimeLine className="size-3.5" aria-hidden />
          <span>Saved 12 minutes ago</span>
          <span aria-hidden>·</span>
          <span>42 words</span>
        </div>
      </div>
      <figcaption className="mt-1.5 text-caption-1-regular text-text-tertiary">
        Pinned to Cover / v3 · Visible to the studio
      </figcaption>
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/*  Labeled divider                                                            */
/* -------------------------------------------------------------------------- */

export function LabeledDivider() {
  return (
    <div className="flex w-full max-w-[320px] flex-col gap-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-caption-1-regular uppercase tracking-wide text-text-tertiary">Today</span>
          <span aria-hidden className="h-px flex-1 bg-separator-border" />
        </div>
        <p className="text-body-2-medium text-text-secondary">Maya approved the cover crop.</p>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span aria-hidden className="h-px flex-1 bg-separator-border" />
          <span className="shrink-0 text-caption-1-regular uppercase tracking-wide text-text-tertiary">Earlier this week</span>
          <span aria-hidden className="h-px flex-1 bg-separator-border" />
        </div>
        <p className="text-body-2-medium text-text-secondary">Jonas uploaded 18 stills from the dawn shoot.</p>
      </div>

      <div className="flex items-center gap-2">
        <span aria-hidden className="h-px flex-1 bg-separator-border" />
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1 rounded-sm text-caption-1-regular uppercase tracking-wide text-text-secondary transition-colors duration-150 ease hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          View archive
          <RiArrowRightSLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Scroll shadow                                                              */
/* -------------------------------------------------------------------------- */

const SCROLL_FADE = 24;

const DEPLOY_LOG = [
  { time: "09:42", title: "Deploy running", detail: "Promoting v2.14.0 to production", active: true },
  { time: "09:39", title: "Cache warmed", detail: "42 routes primed in fra1", active: false },
  { time: "09:36", title: "Health checks", detail: "12 of 12 probes green", active: false },
  { time: "09:31", title: "Migration applied", detail: "Adds review_expires_at to shares", active: false },
  { time: "09:27", title: "Build finished", detail: "214 tests · 38s", active: false },
  { time: "09:24", title: "Build started", detail: "Commit 9f2c1ad on main", active: false },
  { time: "09:18", title: "Preview rebuilt", detail: "Branch preview ready in 42s", active: false },
  { time: "09:08", title: "Deploy requested", detail: "Triggered by Maya Chen", active: false },
  { time: "08:52", title: "Nightly backup", detail: "Snapshot stored in eu-west", active: false },
  { time: "08:40", title: "Certificate renewed", detail: "northlight.studio · valid 90 days", active: false },
];

export function ScrollShadow() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  // The log is known to overflow; start the bottom edge soft, then measure.
  const [bottomGap, setBottomGap] = useState(SCROLL_FADE);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    setBottomGap(node.scrollHeight - node.clientHeight - node.scrollTop);
  }, []);

  const topFade = Math.min(1, scrollTop / SCROLL_FADE);
  const bottomFade = Math.min(1, Math.max(0, bottomGap / SCROLL_FADE));

  return (
    <div className="w-full max-w-[320px] overflow-hidden rounded-xl border border-border-button-default bg-background-primary-default">
      <div className="flex items-center justify-between border-b border-separator-border px-3 py-2">
        <span className="text-body-2-medium text-text-primary">Deploy log</span>
        <span className="flex items-center gap-1 text-caption-2-regular text-text-tertiary">
          <span aria-hidden className="size-1.5 rounded-full bg-accent-500" />
          Live
        </span>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          tabIndex={0}
          role="region"
          aria-label="Deploy log"
          onScroll={(event) => {
            const node = event.currentTarget;
            setScrollTop(node.scrollTop);
            setBottomGap(node.scrollHeight - node.clientHeight - node.scrollTop);
          }}
          className="h-[176px] overflow-y-auto px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-inset"
        >
          <ol className="flex flex-col gap-2.5">
            {DEPLOY_LOG.map((entry) => (
              <li key={entry.time} className="flex items-start gap-2">
                <span
                  aria-hidden
                  className={cx(
                    "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
                    entry.active
                      ? "bg-background-tertiary-default text-foreground-icon-secondary"
                      : "bg-accent-600 text-text-white",
                  )}
                >
                  {entry.active ? <RiLoaderLine className="size-2.5" /> : <RiCheckLine className="size-2.5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-body-2-medium text-text-primary">{entry.title}</span>
                    <span className="shrink-0 text-caption-2-regular text-text-tertiary tabular-nums">{entry.time}</span>
                  </div>
                  <p className="text-caption-1-regular text-text-secondary">{entry.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-6">
          <div
            className="absolute inset-0 bg-linear-to-b from-background-primary-default to-transparent"
            style={{ opacity: topFade }}
          />
          <div
            className="absolute inset-0 backdrop-blur-[1px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
            style={{ opacity: topFade }}
          />
          <div
            className="absolute inset-x-0 top-0 h-4 backdrop-blur-[4px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
            style={{ opacity: topFade }}
          />
        </div>

        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-6">
          <div
            className="absolute inset-0 bg-linear-to-t from-background-primary-default to-transparent"
            style={{ opacity: bottomFade }}
          />
          <div
            className="absolute inset-0 backdrop-blur-[1px] [mask-image:linear-gradient(to_top,black,transparent)]"
            style={{ opacity: bottomFade }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-4 backdrop-blur-[4px] [mask-image:linear-gradient(to_top,black,transparent)]"
            style={{ opacity: bottomFade }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-separator-border px-3 py-1.5">
        <span className="text-caption-2-regular text-text-tertiary">{scrollTop > 0 ? "Scrolled" : "At top"}</span>
        <span className="text-caption-2-regular text-text-tertiary">
          {bottomGap <= 1 ? "End of log" : "10 events · more below"}
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Masonry grid                                                               */
/* -------------------------------------------------------------------------- */

type MasonryKind = "image" | "palette" | "contrast" | "icons" | "motion" | "note";

const MASONRY_TILES: { id: string; title: string; meta: string; height: string; kind: MasonryKind }[] = [
  { id: "cover", title: "Cover crop", meta: "3:2 · Maya Chen", height: "h-24", kind: "image" },
  { id: "palette", title: "Brand palette", meta: "5 colour tokens", height: "h-16", kind: "palette" },
  { id: "contrast", title: "Contrast check", meta: "Body on surface", height: "h-20", kind: "contrast" },
  { id: "icons", title: "Icon set", meta: "24 px grid", height: "h-28", kind: "icons" },
  { id: "motion", title: "Motion curves", meta: "3 durations", height: "h-16", kind: "motion" },
  { id: "note", title: "Client note", meta: "2 replies", height: "h-24", kind: "note" },
];

const MASONRY_ICONS = [RiAddLine, RiSearchLine, RiBellLine, RiImageLine, RiLinkM, RiMoreLine];

const MASONRY_SWATCHES = ["bg-accent-100", "bg-accent-300", "bg-accent-500", "bg-accent-700", "bg-accent-900"];

const MASONRY_MOTION = [
  { ms: "120", width: "w-1/4" },
  { ms: "240", width: "w-2/4" },
  { ms: "480", width: "w-3/4" },
];

export function MasonryGrid() {
  return (
    <div className="w-full columns-2 gap-x-2.5 sm:columns-3">
      {MASONRY_TILES.map((tile) => (
        <figure
          key={tile.id}
          className="mb-2.5 break-inside-avoid overflow-hidden rounded-xl border border-border-button-default bg-background-primary-default shadow-xs"
        >
          <div className={cx("relative flex items-center justify-center overflow-hidden bg-background-secondary-default", tile.height)}>
            {tile.kind === "image" && (
              <>
                <RiImageLine className="size-6 text-foreground-icon-tertiary" aria-hidden />
                <span className="absolute bottom-1.5 end-1.5 rounded-sm bg-background-primary-default/90 px-1 py-0.5 text-caption-2-regular text-text-secondary">
                  3:2
                </span>
              </>
            )}

            {tile.kind === "palette" && (
              <div aria-hidden className="absolute inset-0 flex">
                {MASONRY_SWATCHES.map((swatch) => (
                  <span key={swatch} className={cx("flex-1", swatch)} />
                ))}
              </div>
            )}

            {tile.kind === "contrast" && (
              <div className="flex flex-col items-center">
                <span className="text-title-3-semibold text-text-primary tabular-nums">7.4:1</span>
                <span className="text-caption-2-regular text-text-tertiary">AAA · body</span>
              </div>
            )}

            {tile.kind === "icons" && (
              <div className="grid grid-cols-3 gap-1.5">
                {MASONRY_ICONS.map((Icon, index) => (
                  <span
                    key={index}
                    className="flex size-7 items-center justify-center rounded-md border border-separator-border bg-background-primary-default text-foreground-icon-secondary"
                  >
                    <Icon className="size-3.5" aria-hidden />
                  </span>
                ))}
              </div>
            )}

            {tile.kind === "motion" && (
              <div className="flex w-full flex-col gap-1.5 px-3">
                {MASONRY_MOTION.map((row) => (
                  <div key={row.ms} className="flex items-center gap-2">
                    <span className="w-6 shrink-0 text-caption-2-regular text-text-tertiary tabular-nums">{row.ms}</span>
                    <span className={cx("h-1 rounded-full bg-accent-500", row.width)} />
                  </div>
                ))}
              </div>
            )}

            {tile.kind === "note" && (
              <p className="px-3 text-start text-caption-1-regular text-text-secondary">
                “Crop tighter on the left. The type needs room to breathe.”
              </p>
            )}
          </div>

          <figcaption className="border-t border-separator-border px-2 py-1.5">
            <p className="truncate text-body-2-medium text-text-primary">{tile.title}</p>
            <p className="truncate text-caption-2-regular text-text-tertiary">{tile.meta}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Specimens                                                                  */
/* -------------------------------------------------------------------------- */

export const SURFACES_SECTION: ExtendedSection = {
  id: "surfaces",
  title: "Surfaces",
  blurb: "Frames that hold a section, a note or a list, and the edges between them.",
  file: "surfaces.tsx",
  entries: [
    { name: "Panel", description: "A titled frame with header actions and a quiet footer.", Demo: Panel },
    { name: "Sheet", description: "A side panel that slides from the end, closes on Escape.", Demo: Sheet, wide: true },
    { name: "Well", description: "An inset surface for the aside, with a caption and a soft ring.", Demo: Well },
    { name: "Labeled Divider", description: "Leading, centered and trailing labels that break a list.", Demo: LabeledDivider },
    { name: "Scroll Shadow", description: "A fixed-height log that fades its edges as it scrolls.", Demo: ScrollShadow },
    { name: "Masonry Grid", description: "A three-column board of varied cards and captions.", Demo: MasonryGrid, wide: true },
  ],
};
