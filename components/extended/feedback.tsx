"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  RiAlertLine,
  RiCheckLine,
  RiCloseLine,
  RiErrorWarningLine,
  RiInformationLine,
  RiInboxLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* -------------------------------------------------------------------------- */
/*  Progress bar                                                               */
/* -------------------------------------------------------------------------- */

export function ProgressBar({
  label = "Render queue",
  value = 68,
  indeterminate = false,
}: {
  label?: string;
  value?: number;
  indeterminate?: boolean;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="flex w-full max-w-[280px] flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-body-2-medium text-text-secondary">{label}</span>
        <span className="text-body-2-medium text-text-primary tabular-nums">{indeterminate ? "—" : `${clamped}%`}</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : clamped}
        className="relative h-2 overflow-hidden rounded-full bg-background-tertiary-default"
      >
        <span
          className={cx(
            "absolute inset-y-0 rounded-full bg-accent-500",
            indeterminate ? "w-1/3 animate-indeterminate" : "start-0 transition-[width] duration-500 ease-out",
          )}
          style={indeterminate ? undefined : { width: `${clamped}%` }}
        />
      </div>
      <span className="text-caption-1-regular text-text-tertiary">
        {indeterminate ? "Estimating the remaining frames…" : "12 of 18 frames · about 40 seconds left"}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Meter                                                                      */
/* -------------------------------------------------------------------------- */

export function Meter({ label = "Storage", used = 74 }: { label?: string; used?: number }) {
  const segments = 24;
  const filled = Math.round((used / 100) * segments);
  const tone = used > 90 ? "bg-status-rose-text" : used > 75 ? "bg-status-orange-text" : "bg-state-success-base";

  return (
    <div className="flex w-full max-w-[280px] flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-body-2-medium text-text-secondary">{label}</span>
        <span className="text-caption-1-medium text-text-tertiary">{used}% of 50 GB</span>
      </div>
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={used}
        className="flex gap-0.5"
      >
        {Array.from({ length: segments }).map((_, index) => (
          <span
            key={index}
            className={cx(
              "h-4 flex-1 rounded-[1px] transition-colors duration-300 ease-out",
              index < filled ? tone : "bg-background-tertiary-default",
            )}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-caption-1-regular text-text-tertiary">
        <span>37 GB used</span>
        <span>13 GB free</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Skeleton                                                                   */
/* -------------------------------------------------------------------------- */

export function Skeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="flex w-full max-w-[300px] flex-col gap-2.5" aria-busy aria-live="polite" aria-label="Loading project list">
      <div className="flex items-center gap-2.5">
        <div className="size-9 shrink-0 animate-pulse rounded-full bg-background-tertiary-default" />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="h-3 w-2/5 animate-pulse rounded-full bg-background-tertiary-default" />
          <div className="h-2.5 w-3/5 animate-pulse rounded-full bg-background-tertiary-default/70" />
        </div>
      </div>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-2.5">
          <div className="size-6 shrink-0 animate-pulse rounded-md bg-background-tertiary-default" />
          <div className="h-2.5 animate-pulse rounded-full bg-background-tertiary-default" style={{ width: `${72 - index * 14}%` }} />
        </div>
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Empty state                                                                */
/* -------------------------------------------------------------------------- */

export function EmptyState({
  title = "No shots in this folder",
  body = "Drag stills into the folder, or start a new set from a template.",
  action = "New set",
}: {
  title?: string;
  body?: string;
  action?: string;
}) {
  return (
    <div className="flex w-full max-w-[300px] flex-col items-center gap-2 rounded-xl border border-dashed border-border-button-default px-4 py-6 text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-background-tertiary-default text-foreground-icon-secondary">
        <RiInboxLine className="size-5" aria-hidden />
      </span>
      <h3 className="text-headline-semibold text-text-primary">{title}</h3>
      <p className="text-body-2-regular text-text-secondary">{body}</p>
      <button
        type="button"
        className="mt-1 inline-flex h-7 items-center rounded-lg border border-border-button-default bg-background-primary-default px-2.5 text-caption-1-semibold text-text-primary shadow-xs transition-colors duration-150 ease hover:bg-background-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
      >
        {action}
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Callout                                                                    */
/* -------------------------------------------------------------------------- */

const CALLOUT_TONES = {
  info: {
    icon: RiInformationLine,
    surface: "bg-status-blue-background",
    ink: "text-status-blue-text",
    border: "border-status-blue-text/20",
  },
  success: {
    icon: RiCheckLine,
    surface: "bg-status-lime-background",
    ink: "text-status-lime-text",
    border: "border-status-lime-text/20",
  },
  warning: {
    icon: RiAlertLine,
    surface: "bg-status-orange-background",
    ink: "text-status-orange-text",
    border: "border-status-orange-text/20",
  },
  danger: {
    icon: RiErrorWarningLine,
    surface: "bg-status-rose-background",
    ink: "text-status-rose-text",
    border: "border-status-rose-text/20",
  },
} as const;

export type CalloutTone = keyof typeof CALLOUT_TONES;

export function Callout({
  tone = "warning",
  title = "This export will be flattened",
  body = "Text will no longer be editable after the PDF is written. Keep the .editrim file if you plan to revise it.",
  action = "Export a copy instead",
}: {
  tone?: CalloutTone;
  title?: string;
  body?: string;
  action?: string;
}) {
  const t = CALLOUT_TONES[tone];
  const Icon = t.icon;
  return (
    <div role="status" className={cx("flex w-full max-w-[320px] gap-2.5 rounded-xl border p-3", t.surface, t.border)}>
      <Icon className={cx("mt-0.5 size-4 shrink-0", t.ink)} aria-hidden />
      <div className="flex min-w-0 flex-col gap-1">
        <p className={cx("text-body-2-semibold", t.ink)}>{title}</p>
        <p className="text-body-2-regular text-text-primary/85">{body}</p>
        <button
          type="button"
          className={cx(
            "mt-0.5 w-max rounded-sm text-caption-1-semibold underline-offset-2 hover:underline",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
            t.ink,
          )}
        >
          {action}
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Spinner                                                                    */
/* -------------------------------------------------------------------------- */

export function Spinner({ label = "Saving changes" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2.5" role="status" aria-live="polite">
      <span className="relative flex size-5 items-center justify-center" aria-hidden>
        <span className="absolute inset-0 rounded-full border-2 border-background-tertiary-default" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-accent-500" />
      </span>
      <span className="text-body-2-medium text-text-secondary">{label}</span>
      <span className="sr-only">In progress</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Toast stack                                                                */
/* -------------------------------------------------------------------------- */

const STARTER_TOASTS = [
  { id: 1, tone: "success" as const, title: "Brand kit applied", body: "12 layers restyled across 3 pages." },
  { id: 2, tone: "info" as const, title: "Share link copied", body: "Anyone with the link can comment." },
];

const TOAST_TONES = {
  success: { icon: RiCheckLine, ink: "text-state-success-text" },
  info: { icon: RiInformationLine, ink: "text-status-blue-text" },
} as const;

export function ToastStack() {
  const [toasts, setToasts] = useState(STARTER_TOASTS);

  return (
    <div className="flex w-full max-w-[320px] flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-caption-1-semibold tracking-wide text-text-tertiary uppercase">Live region</span>
        <button
          type="button"
          onClick={() => setToasts(STARTER_TOASTS)}
          className="rounded-sm text-caption-1-semibold text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          Replay
        </button>
      </div>
      {toasts.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border-button-default px-3 py-4 text-center text-caption-1-regular text-text-tertiary">
          All caught up.
        </p>
      ) : (
        toasts.map((toast) => {
          const t = TOAST_TONES[toast.tone];
          const Icon = t.icon;
          return (
            <div
              key={toast.id}
              role="status"
              className="flex items-start gap-2.5 rounded-xl border border-border-button-default bg-background-primary-default p-2.5 shadow-card"
            >
              <Icon className={cx("mt-0.5 size-4 shrink-0", t.ink)} aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-body-2-semibold text-text-primary">{toast.title}</p>
                <p className="text-caption-1-regular text-text-secondary">{toast.body}</p>
              </div>
              <button
                type="button"
                aria-label={`Dismiss ${toast.title}`}
                onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
                className="flex size-5 shrink-0 items-center justify-center rounded-sm text-foreground-icon-tertiary hover:bg-background-tertiary-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                <RiCloseLine className="size-3.5" aria-hidden />
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Confirm dialog                                                             */
/* -------------------------------------------------------------------------- */

export function ConfirmDialog({
  trigger = "Delete folder",
  title = "Delete “Night shoot”?",
  body = "18 stills and 2 clips will be removed. This cannot be undone.",
  confirm = "Delete folder",
}: {
  trigger?: string;
  title?: string;
  body?: string;
  confirm?: string;
}) {
  const [open, setOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-8 items-center rounded-lg border border-border-button-default bg-background-primary-default px-2.5 text-body-2-medium text-text-primary shadow-xs transition-colors duration-150 ease hover:bg-background-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
      >
        {trigger}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="presentation" onPointerDown={() => setOpen(false)}>
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onPointerDown={(event) => event.stopPropagation()}
            className="w-full max-w-[360px] rounded-2xl border border-border-button-default bg-background-primary-default p-4 shadow-xl"
          >
            <div className="flex items-start gap-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-status-rose-background text-status-rose-text">
                <RiErrorWarningLine className="size-4" aria-hidden />
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <h3 id={titleId} className="text-headline-semibold text-text-primary">{title}</h3>
                <p className="text-body-2-regular text-text-secondary">{body}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                ref={cancelRef}
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-8 items-center rounded-lg border border-border-button-default bg-background-primary-default px-2.5 text-body-2-medium text-text-primary shadow-xs hover:bg-background-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                Keep it
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-8 items-center rounded-lg bg-button-danger px-2.5 text-body-2-medium text-text-white shadow-xs hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                {confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Loading overlay                                                            */
/* -------------------------------------------------------------------------- */

export function LoadingOverlay({ label = "Applying brand kit" }: { label?: string }) {
  return (
    <div className="relative w-full max-w-[300px] overflow-hidden rounded-xl border border-border-button-default">
      <div className="flex flex-col gap-2 p-3" aria-hidden>
        <div className="h-3 w-1/2 rounded-full bg-background-tertiary-default" />
        <div className="h-2.5 w-3/4 rounded-full bg-background-tertiary-default" />
        <div className="h-2.5 w-2/3 rounded-full bg-background-tertiary-default" />
        <div className="mt-1 h-16 rounded-lg bg-background-tertiary-default" />
      </div>
      <div className="absolute inset-0 grid place-items-center bg-background-primary-default/70 backdrop-blur-[2px]">
        <div className="flex flex-col items-center gap-2" role="status" aria-live="polite">
          <span className="relative flex size-6 items-center justify-center" aria-hidden>
            <span className="absolute inset-0 rounded-full border-2 border-background-tertiary-default" />
            <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-accent-500" />
          </span>
          <span className="text-caption-1-semibold text-text-secondary">{label}</span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Specimens                                                                  */
/* -------------------------------------------------------------------------- */

export const FEEDBACK_SECTION: ExtendedSection = {
  id: "feedback",
  title: "Feedback",
  blurb: "Telling people what is happening, and what to do about it.",
  file: "feedback.tsx",
  entries: [
    { name: "Progress Bar", description: "Determinate work with an indeterminate fallback.", Demo: ProgressBar },
    { name: "Meter", description: "Segmented capacity with a threshold tone.", Demo: Meter },
    { name: "Skeleton", description: "A loading silhouette that holds the layout.", Demo: Skeleton },
    { name: "Empty State", description: "A blank surface that names the next move.", Demo: EmptyState },
    { name: "Callout", description: "Four tones of inline advice with one action.", Demo: Callout, wide: true },
    { name: "Spinner", description: "A quiet, labelled wait indicator.", Demo: Spinner },
    { name: "Toast Stack", description: "Dismissible confirmations in a live region.", Demo: ToastStack, wide: true },
    { name: "Confirm Dialog", description: "An alert dialog that traps focus and closes on Escape.", Demo: ConfirmDialog },
    { name: "Loading Overlay", description: "Blocks a surface without losing its shape.", Demo: LoadingOverlay },
  ],
};
