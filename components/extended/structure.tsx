"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  RiAddLine,
  RiArrowDownSLine,
  RiBellLine,
  RiCheckLine,
  RiFileCopyLine,
  RiImageLine,
  RiMoreLine,
  RiPencilLine,
  RiSaveLine,
} from "@remixicon/react";
import { Avatar } from "@/components/base/avatar/avatar";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* -------------------------------------------------------------------------- */
/*  Card                                                                       */
/* -------------------------------------------------------------------------- */

export function Card({
  title = "Shot list",
  meta = "18 items",
  children,
  footer,
  action,
}: {
  title?: string;
  meta?: string;
  children?: ReactNode;
  footer?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="w-full max-w-[320px] overflow-hidden rounded-xl border border-border-button-default bg-background-primary-default shadow-xs">
      <header className="flex items-start justify-between gap-2 border-b border-separator-border px-3 py-2">
        <div className="flex min-w-0 flex-col">
          <h3 className="truncate text-body-2-semibold text-text-primary">{title}</h3>
          <span className="text-caption-1-regular text-text-tertiary">{meta}</span>
        </div>
        {action ?? (
          <button type="button" aria-label="Card actions" className="flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-icon-secondary hover:bg-background-secondary-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring">
            <RiMoreLine className="size-4" aria-hidden />
          </button>
        )}
      </header>
      <div className="px-3 py-2.5 text-body-2-regular text-text-secondary">
        {children ?? (
          <ul className="flex flex-col gap-1.5">
            {["Cover — dawn, 35mm", "Bay 2 — wide, 50mm", "Rooftop — backlit, 85mm"].map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <span aria-hidden className="size-1 rounded-full bg-foreground-icon-tertiary" />
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
      {footer !== undefined ? (
        <div className="border-t border-separator-border px-3 py-1.5">{footer}</div>
      ) : (
        <div className="flex items-center justify-between border-t border-separator-border px-3 py-1.5">
          <span className="text-caption-2-regular text-text-tertiary">Updated 4m ago</span>
          <button type="button" className="text-caption-1-semibold text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring">
            Open
          </button>
        </div>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section header                                                             */
/* -------------------------------------------------------------------------- */

export function SectionHeader({
  title = "Recent files",
  description = "Everything the team touched this week.",
  action = "View all",
}: {
  title?: string;
  description?: string;
  action?: string;
}) {
  return (
    <div className="flex w-full max-w-[360px] items-start justify-between gap-3">
      <div className="flex min-w-0 flex-col">
        <h2 className="text-title-3-semibold text-text-primary">{title}</h2>
        <p className="text-body-2-regular text-text-secondary">{description}</p>
      </div>
      <button
        type="button"
        className="mt-0.5 shrink-0 rounded-sm text-caption-1-semibold text-text-secondary underline-offset-2 hover:text-text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
      >
        {action}
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page header                                                                */
/* -------------------------------------------------------------------------- */

export function PageHeader({
  title = "Brand kits",
  description = "Palettes, faces and logos, shared with every design in the workspace.",
  primary = "New kit",
  secondary = "Import",
}: {
  title?: string;
  description?: string;
  primary?: string;
  secondary?: string;
}) {
  return (
    <div className="flex w-full max-w-[400px] flex-col gap-2.5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h1 className="text-title-2-medium text-text-primary">{title}</h1>
        <div className="flex items-center gap-1.5">
          <button type="button" className="inline-flex h-7 items-center rounded-lg border border-border-button-default bg-background-primary-default px-2 text-caption-1-semibold text-text-primary shadow-xs hover:bg-background-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring">
            {secondary}
          </button>
          <button type="button" className="inline-flex h-7 items-center gap-1 rounded-lg bg-button-primary px-2 text-caption-1-semibold text-text-white shadow-xs hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring">
            <RiAddLine className="size-3.5" aria-hidden /> {primary}
          </button>
        </div>
      </div>
      <p className="max-w-[46ch] text-body-2-regular text-text-secondary">{description}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sticky footer bar                                                          */
/* -------------------------------------------------------------------------- */

export function StickyFooterBar() {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timer = window.setTimeout(() => setSaved(false), 1800);
    return () => window.clearTimeout(timer);
  }, [saved]);

  return (
    <div className="w-full max-w-[380px] overflow-hidden rounded-xl border border-border-button-default bg-background-primary-default shadow-card">
      <div className="h-16 bg-background-secondary-default px-3 py-2">
        <div className="h-2 w-2/3 rounded-full bg-background-tertiary-default" />
        <div className="mt-1.5 h-2 w-1/2 rounded-full bg-background-tertiary-default" />
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-separator-border px-3 py-2">
        <span className="text-caption-1-regular text-text-tertiary">
          {saved ? <span className="flex items-center gap-1 text-state-success-text"><RiCheckLine className="size-3.5" aria-hidden /> Draft saved</span> : "Unsaved changes · 2 pages"}
        </span>
        <div className="flex items-center gap-1.5">
          <button type="button" className="h-7 rounded-lg border border-border-button-default px-2 text-caption-1-semibold text-text-primary hover:bg-background-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring">
            Discard
          </button>
          <button
            type="button"
            onClick={() => setSaved(true)}
            className="inline-flex h-7 items-center gap-1 rounded-lg bg-button-primary px-2 text-caption-1-semibold text-text-white shadow-xs hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            <RiSaveLine className="size-3.5" aria-hidden /> Save draft
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Split button                                                               */
/* -------------------------------------------------------------------------- */

export function SplitButton() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("Publish now");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        type="button"
        className="inline-flex h-8 items-center gap-1 rounded-s-lg bg-button-primary px-2.5 text-body-2-medium text-text-white shadow-xs hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
      >
        <RiFileCopyLine className="size-4" aria-hidden /> {mode}
      </button>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="More publish options"
        onClick={() => setOpen((next) => !next)}
        className="inline-flex h-8 items-center justify-center rounded-e-lg border-s border-white/20 bg-button-primary px-1.5 text-text-white shadow-xs hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
      >
        <RiArrowDownSLine className={cx("size-4 transition-transform duration-200 ease-out", open && "rotate-180")} aria-hidden />
      </button>

      {open && (
        <div role="menu" className="absolute top-[calc(100%+6px)] end-0 z-30 w-[190px] rounded-xl border border-border-button-default bg-background-primary-default p-1 shadow-dropdown">
          {["Publish now", "Schedule…", "Save as draft"].map((option) => (
            <button
              key={option}
              type="button"
              role="menuitem"
              onClick={() => {
                setMode(option === "Schedule…" ? "Publish now" : option);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-start text-body-2-regular text-text-primary hover:bg-dropdown-item-hover-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              {option}
              {mode === option && <RiCheckLine className="size-3.5 text-foreground-icon-primary" aria-hidden />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Notification badge                                                         */
/* -------------------------------------------------------------------------- */

export function NotificationBadge({ count = 4 }: { count?: number }) {
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        aria-label={`Notifications, ${count} unread`}
        className="relative flex size-9 items-center justify-center rounded-lg border border-border-button-default bg-background-primary-default text-foreground-icon-secondary shadow-xs hover:bg-background-primary-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
      >
        <RiBellLine className="size-4" aria-hidden />
        {count > 0 && (
          <span className="absolute -end-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-button-danger px-1 text-caption-2-semibold text-text-white ring-2 ring-background-primary-default">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>
      <button
        type="button"
        aria-label="Messages, unread"
        className="relative flex size-9 items-center justify-center rounded-lg border border-border-button-default bg-background-primary-default text-foreground-icon-secondary shadow-xs hover:bg-background-primary-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
      >
        <RiPencilLine className="size-4" aria-hidden />
        <span aria-hidden className="absolute -end-0.5 -top-0.5 size-2 rounded-full bg-accent-500 ring-2 ring-background-primary-default" />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Aspect frame                                                               */
/* -------------------------------------------------------------------------- */

export function AspectFrame({
  ratio = "16 : 10",
  caption = "Cover frame · 35mm",
  src,
}: {
  ratio?: string;
  caption?: string;
  src?: string;
}) {
  return (
    <figure className="flex w-full max-w-[300px] flex-col gap-1.5">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border-button-default bg-background-tertiary-default">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="size-full object-cover" />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-1 text-foreground-icon-tertiary">
            <RiImageLine className="size-5" aria-hidden />
            <span className="text-caption-2-medium">No still selected</span>
          </div>
        )}
        <span className="absolute bottom-1.5 end-1.5 rounded-sm bg-background-primary-default/90 px-1 py-0.5 text-caption-2-semibold text-text-secondary shadow-xs">
          {ratio}
        </span>
      </div>
      <figcaption className="text-caption-1-regular text-text-tertiary">{caption}</figcaption>
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/*  Data list                                                                  */
/* -------------------------------------------------------------------------- */

const ROWS = [
  { name: "Maya Chen", role: "Art director", value: "18 files", initials: "MC", color: "blue" as const },
  { name: "Jonas Reed", role: "Photographer", value: "12 files", initials: "JR", color: "lime" as const },
  { name: "Priya Nair", role: "Producer", value: "9 files", initials: "PN", color: "pink" as const },
];

export function DataList({ title = "Contributors" }: { title?: string }) {
  return (
    <div className="w-full max-w-[380px] overflow-hidden rounded-xl border border-border-button-default bg-background-primary-default">
      <div className="flex items-center justify-between border-b border-separator-border px-3 py-2">
        <span className="text-body-2-semibold text-text-primary">{title}</span>
        <span className="text-caption-1-regular text-text-tertiary">This quarter</span>
      </div>
      <ul className="divide-y divide-separator-border">
        {ROWS.map((row) => (
          <li key={row.name} className="flex items-center gap-2.5 px-3 py-2">
            <Avatar size="sm" color={row.color} initials={row.initials} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-body-2-medium text-text-primary">{row.name}</p>
              <p className="truncate text-caption-1-regular text-text-tertiary">{row.role}</p>
            </div>
            <span className="shrink-0 text-caption-1-medium text-text-secondary tabular-nums">{row.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Specimens                                                                  */
/* -------------------------------------------------------------------------- */

export const STRUCTURE_SECTION: ExtendedSection = {
  id: "structure",
  title: "Structure",
  blurb: "The frames, bars and headers a page is assembled from.",
  file: "structure.tsx",
  entries: [
    { name: "Card", description: "Header, body and footer with one clear action.", Demo: Card },
    { name: "Section Header", description: "A heading, a line of context and a way out.", Demo: SectionHeader, wide: true },
    { name: "Page Header", description: "Title, description and the page's two actions.", Demo: PageHeader, wide: true },
    { name: "Sticky Footer Bar", description: "Unsaved state and its verbs, pinned in reach.", Demo: StickyFooterBar, wide: true },
    { name: "Split Button", description: "A default action with the rest of the menu.", Demo: SplitButton },
    { name: "Notification Badge", description: "Counts on the icon, a dot when a count is noise.", Demo: NotificationBadge },
    { name: "Aspect Frame", description: "A fixed-ratio still with its ratio and caption.", Demo: AspectFrame },
    { name: "Data List", description: "Stackable rows for the narrow half of the app.", Demo: DataList, wide: true },
  ],
};
