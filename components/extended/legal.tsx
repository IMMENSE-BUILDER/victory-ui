"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ComponentType, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import {
  RiArrowDownSLine,
  RiArrowRightLine,
  RiBookOpenLine,
  RiBuilding2Line,
  RiCalendarEventLine,
  RiCheckLine,
  RiCloseLine,
  RiEyeLine,
  RiFileCopyLine,
  RiFileTextLine,
  RiGlobeLine,
  RiHistoryLine,
  RiMailLine,
  RiNotification3Line,
  RiPencilLine,
  RiQuillPenLine,
  RiRefreshLine,
  RiSendPlaneLine,
  RiShieldCheckLine,
  RiTimeLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* -------------------------------------------------------------------------- */
/*  Shared anatomy                                                             */
/* -------------------------------------------------------------------------- */
type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";
const cardSurface = "w-full rounded-xl border border-border-button-default bg-background-primary-default shadow-card";
const buttonBase = cx(
  "inline-flex items-center justify-center gap-1.5 rounded-lg text-caption-1-semibold",
  "transition-[transform,opacity,background-color,color,box-shadow] duration-150 ease-out",
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  "motion-reduce:transition-none motion-reduce:active:scale-100",
);
const primaryButton = cx(buttonBase, "h-8 bg-button-primary px-2.5 text-text-white shadow-xs", focusRing);
const secondaryButton = cx(
  buttonBase,
  "h-8 border border-border-button-default bg-background-primary-default px-2.5 text-text-primary shadow-xs hover:bg-background-primary-hover",
  focusRing,
);
const quietButton = cx(
  buttonBase,
  "h-7 px-1.5 text-text-secondary hover:bg-background-secondary-default hover:text-text-primary",
  focusRing,
);
const iconButton = cx(
  "flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-icon-tertiary",
  "transition-[background-color,color] duration-150 ease-out hover:bg-background-tertiary-default hover:text-text-primary",
  "motion-reduce:transition-none",
  focusRing,
);
const revealGrid = "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none";
const metaText = "text-caption-2-regular text-text-tertiary";

const TONES = {
  lime: "bg-status-lime-background text-status-lime-text",
  orange: "bg-status-orange-background text-status-orange-text",
  blue: "bg-status-blue-background text-status-blue-text",
  neutral: "bg-background-tertiary-default text-text-secondary",
} as const;

type Tone = keyof typeof TONES;

function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-caption-2-medium",
        "transition-colors duration-200 ease-out motion-reduce:transition-none",
        TONES[tone],
      )}
    >
      {children}
    </span>
  );
}

function Avatar({ initials, tone = "blue", size = "md" }: { initials: string; tone?: Tone; size?: "sm" | "md" }) {
  return (
    <span
      aria-hidden
      className={cx(
        "flex shrink-0 items-center justify-center rounded-full text-caption-2-semibold",
        TONES[tone],
        size === "sm" ? "size-5" : "size-7",
      )}
    >
      {initials}
    </span>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  describedBy,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  describedBy?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-describedby={describedBy}
      onClick={() => onChange(!checked)}
      className={cx(
        "relative h-5 w-9 shrink-0 rounded-full border shadow-xs",
        "transition-[background-color,border-color] duration-200 ease-out motion-reduce:transition-none",
        checked
          ? "border-accent-600 bg-accent-600"
          : "border-border-checkbox-default bg-background-tertiary-default",
        focusRing,
      )}
    >
      <span
        className={cx(
          "absolute top-0.5 start-0.5 size-3.5 rounded-full bg-background-primary-default shadow-xs",
          "transition-transform duration-200 ease-out motion-reduce:transition-none",
          checked ? "translate-x-4 rtl:-translate-x-4" : "translate-x-0",
        )}
      />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  1. Contract Card                                                           */
/* -------------------------------------------------------------------------- */
export function ContractCard() {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <section aria-label="Master Services Agreement" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-start gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent-600 text-text-white shadow-xs">
          <RiFileTextLine className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="min-w-0 text-body-2-semibold text-text-primary">Master Services Agreement</h3>
            <Badge tone={acknowledged ? "lime" : "blue"}>{acknowledged ? "Acknowledged" : "Active"}</Badge>
          </div>
          <p className="truncate text-caption-2-regular text-text-tertiary">
            Northline Studio × Cascade Logistics
          </p>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 rounded-lg bg-background-secondary-default px-2 py-1.5">
        <RiCalendarEventLine className="size-3.5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
        <span className={metaText}>Term</span>
        <span className="text-caption-1-medium text-text-primary">Jan 1 – Dec 31, 2026</span>
        <span className="ms-auto shrink-0 text-caption-2-medium text-text-tertiary tabular-nums">12 mo</span>
      </div>

      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${baseId}-parties`}
        onClick={() => setOpen((current) => !current)}
        className={cx(
          "mt-1 flex h-6 w-full items-center gap-1 rounded-sm text-start",
          "transition-colors duration-150 ease-out motion-reduce:transition-none",
          focusRing,
        )}
      >
        <span className="flex-1 text-caption-1-medium text-text-secondary">Parties and renewal</span>
        <RiArrowDownSLine
          className={cx(
            "size-3.5 shrink-0 text-foreground-icon-tertiary transition-transform duration-200 ease-out motion-reduce:transition-none",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      <div
        id={`${baseId}-parties`}
        inert={!open}
        className={cx(revealGrid, open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
      >
        <div className="min-h-0 overflow-hidden">
          <dl className="grid grid-cols-[68px_1fr] gap-x-2 gap-y-1 pt-0.5 pb-1 text-caption-2-regular">
            <dt className="text-text-tertiary">Provider</dt>
            <dd className="truncate text-text-secondary">Northline Studio, Inc.</dd>
            <dt className="text-text-tertiary">Client</dt>
            <dd className="truncate text-text-secondary">Cascade Logistics LLC</dd>
            <dt className="text-text-tertiary">Renewal</dt>
            <dd className="truncate text-text-secondary">Auto-renews · 30-day notice</dd>
          </dl>
        </div>
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2 border-t border-separator-border pt-1.5">
        <span aria-live="polite" className={cx("min-w-0 truncate", metaText)}>
          {acknowledged ? "Renewal logged · Nov 5" : "Needs your acknowledgement"}
        </span>
        <button
          type="button"
          aria-label="Acknowledge the renewal"
          disabled={acknowledged}
          onClick={() => setAcknowledged(true)}
          className={cx(acknowledged ? secondaryButton : primaryButton, "h-7 shrink-0")}
        >
          {acknowledged ? (
            <>
              <RiCheckLine className="size-3.5" aria-hidden />
              Acknowledged
            </>
          ) : (
            <>
              Acknowledge
              <RiArrowRightLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
            </>
          )}
        </button>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  2. Clause Row                                                              */
/* -------------------------------------------------------------------------- */
const CLAUSE_BODY =
  "Each party shall hold the other’s Confidential Information in confidence and use it only to perform the Services. The obligation survives termination for three years.";

export function ClauseRow() {
  const baseId = useId();
  const [open, setOpen] = useState(true);
  const [reviewed, setReviewed] = useState(false);

  return (
    <section aria-label="Clause 4.2, Confidentiality" className={cx(cardSurface, "max-w-[320px] p-2")}>
      <div className="flex items-start gap-2">
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default font-mono text-caption-2-semibold text-text-secondary">
          4.2
        </span>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${baseId}-body`}
          onClick={() => setOpen((current) => !current)}
          className={cx("flex min-w-0 flex-1 items-start gap-1.5 rounded-sm text-start", focusRing)}
        >
          <span className="min-w-0 flex-1">
            <span className="block text-body-2-semibold text-text-primary">Confidentiality</span>
            <span className="block text-caption-2-regular text-text-tertiary">Mutual · survives 3 years</span>
          </span>
          <RiArrowDownSLine
            className={cx(
              "mt-0.5 size-3.5 shrink-0 text-foreground-icon-tertiary transition-transform duration-200 ease-out motion-reduce:transition-none",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>
      </div>

      <div
        id={`${baseId}-body`}
        inert={!open}
        className={cx(revealGrid, open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="ps-8 pt-1.5 text-caption-1-regular text-text-secondary">{CLAUSE_BODY}</p>
          <div className="mt-1.5 flex items-center justify-between gap-2 ps-8">
            <span
              aria-live="polite"
              className={cx(
                "flex min-w-0 items-center gap-1 text-caption-2-medium transition-colors duration-200 ease-out motion-reduce:transition-none",
                reviewed ? "text-status-lime-text" : "text-text-tertiary",
              )}
            >
              {reviewed ? (
                <>
                  <RiCheckLine className="size-3 shrink-0" aria-hidden />
                  <span className="truncate">Reviewed by Priya</span>
                </>
              ) : (
                <span className="truncate">Not reviewed yet</span>
              )}
            </span>
            <button
              type="button"
              aria-pressed={reviewed}
              onClick={() => setReviewed((current) => !current)}
              className={cx(quietButton, "h-6 shrink-0")}
            >
              {reviewed ? "Undo" : "Mark reviewed"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  3. Signature Pad                                                           */
/* -------------------------------------------------------------------------- */
type SignatureMode = "type" | "draw";
type Point = { x: number; y: number };

const SIGNED_DATE = "Nov 5, 2026 · 2:41 PM";
const SIGNATURE_VIEWBOX = { width: 300, height: 64 };

function SignatureInk({
  points,
  label,
  className,
  baseline = false,
  onPointerDown,
  onPointerMove,
  onPointerEnd,
}: {
  points: Point[];
  label: string;
  className?: string;
  baseline?: boolean;
  onPointerDown?: (event: ReactPointerEvent<SVGSVGElement>) => void;
  onPointerMove?: (event: ReactPointerEvent<SVGSVGElement>) => void;
  onPointerEnd?: () => void;
}) {
  return (
    <svg
      viewBox={`0 0 ${SIGNATURE_VIEWBOX.width} ${SIGNATURE_VIEWBOX.height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={label}
      className={className}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
    >
      {baseline && <line x1="16" y1="48" x2="284" y2="48" className="stroke-border-button-default" strokeDasharray="3 3" />}
      {points.length > 0 && (
        <polyline
          points={points.map((point) => `${point.x},${point.y}`).join(" ")}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function SignatureTabs({ mode, onChange }: { mode: SignatureMode; onChange: (mode: SignatureMode) => void }) {
  return (
    <div role="group" aria-label="Signature method" className="flex rounded-md bg-background-tertiary-default p-0.5">
      {(["type", "draw"] as const).map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={mode === option}
          onClick={() => onChange(option)}
          className={cx(
            "h-6 rounded-sm px-2 text-caption-2-semibold capitalize",
            "transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
            mode === option
              ? "bg-segmented-control-selected-background text-text-primary shadow-xs"
              : "text-text-tertiary hover:text-text-secondary",
            focusRing,
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function SignaturePad() {
  const [mode, setMode] = useState<SignatureMode>("type");
  const [name, setName] = useState("Jordan Lee");
  const [points, setPoints] = useState<Point[]>([]);
  const [signed, setSigned] = useState(false);
  const drawing = useRef(false);
  const canSign = mode === "type" ? name.trim().length > 1 : points.length > 2;

  const pointFrom = (event: ReactPointerEvent<SVGSVGElement>): Point => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: Math.round(((event.clientX - rect.left) / rect.width) * SIGNATURE_VIEWBOX.width),
      y: Math.round(((event.clientY - rect.top) / rect.height) * SIGNATURE_VIEWBOX.height),
    };
  };

  const startDraw = (event: ReactPointerEvent<SVGSVGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    drawing.current = true;
    setPoints([pointFrom(event)]);
  };

  const moveDraw = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!drawing.current) return;
    setPoints((current) => [...current.slice(-399), pointFrom(event)]);
  };

  const endDraw = () => {
    drawing.current = false;
  };

  return (
    <section aria-label={signed ? "Signature confirmed" : "Signature pad"} className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">
          {signed ? "Signature captured" : "Sign the agreement"}
        </h3>
        {!signed && <SignatureTabs mode={mode} onChange={setMode} />}
      </div>

      {mode === "type" ? (
        signed ? (
          <div className="mt-2 flex h-14 items-center justify-center rounded-lg border border-separator-border bg-background-secondary-default px-3">
            <span className="truncate font-serif text-title-2-medium italic text-text-primary">{name.trim()}</span>
          </div>
        ) : (
          <label className="mt-2 block">
            <span className="sr-only">Type your full name</span>
            <input
              value={name}
              autoComplete="name"
              maxLength={40}
              onChange={(event) => setName(event.target.value)}
              className={cx(
                "h-14 w-full rounded-lg border border-separator-border bg-background-secondary-default px-3",
                "text-center font-serif text-title-3-regular italic text-text-primary outline-none",
                "placeholder:text-text-placeholder",
                focusRing,
              )}
              placeholder="Type your full name"
            />
          </label>
        )
      ) : (
        <div
          className={cx(
            "relative mt-2 h-14 overflow-hidden rounded-lg border bg-background-secondary-default",
            signed ? "border-separator-border" : "border-dashed border-border-button-default",
          )}
        >
          <SignatureInk
            points={points}
            baseline={!signed}
            label={signed ? "Your drawn signature" : "Signature drawing area. Draw with a pointer, or switch to Type."}
            className={cx("h-full w-full text-text-primary", !signed && "touch-none")}
            onPointerDown={signed ? undefined : startDraw}
            onPointerMove={signed ? undefined : moveDraw}
            onPointerEnd={signed ? undefined : endDraw}
          />
          {!signed && points.length === 0 && (
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-caption-2-regular text-text-tertiary">
              Sign above the line
            </span>
          )}
        </div>
      )}

      {signed && (
        <div className="mt-2 flex animate-label-in items-center gap-2 rounded-lg bg-status-lime-background px-2 py-1.5 text-status-lime-text motion-reduce:animate-none">
          <RiCheckLine className="size-4 shrink-0" aria-hidden />
          <div role="status" className="min-w-0 flex-1">
            <p className="truncate text-caption-2-semibold">Signed by {mode === "type" ? name.trim() : "Jordan Lee"}</p>
            <p className="truncate text-caption-2-regular">{SIGNED_DATE}</p>
          </div>
        </div>
      )}
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span className={cx("min-w-0 truncate", metaText)}>
          {signed
            ? "Signed in this session."
            : mode === "type"
              ? "Adopted as your electronic signature."
              : "Use a finger, pen or trackpad."}
        </span>
        <div className="flex shrink-0 items-center gap-1">
          {!signed && mode === "draw" && points.length > 0 && (
            <button key="clear" type="button" aria-label="Clear drawing" onClick={() => setPoints([])} className={iconButton}>
              <RiCloseLine className="size-3.5" aria-hidden />
            </button>
          )}
          <button
            key="sign"
            type="button"
            aria-label={signed ? "Sign again" : "Confirm signature"}
            disabled={!signed && !canSign}
            onClick={() => setSigned((current) => !current)}
            className={cx(signed ? secondaryButton : primaryButton, "h-7")}
          >
            {signed ? (
              <RiRefreshLine className="size-3.5" aria-hidden />
            ) : (
              <RiQuillPenLine className="size-3.5" aria-hidden />
            )}
            {signed ? "Sign again" : "Confirm"}
          </button>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  4. Approval Chain                                                          */
/* -------------------------------------------------------------------------- */
const APPROVAL_STEPS = [
  { title: "Submitted", actor: "Maya Chen", detail: "Nov 3 · 09:12", initials: "MC" },
  { title: "Legal review", actor: "Priya Raman", detail: "Due today", initials: "PR" },
  { title: "Finance review", actor: "Daniel Okoye", detail: "Nov 6", initials: "DO" },
  { title: "Counterparty", actor: "Cascade Logistics", detail: "Not started", initials: "CL" },
] as const;

export function ApprovalChain() {
  const [current, setCurrent] = useState(1);
  const finished = current >= APPROVAL_STEPS.length;
  const active = finished ? null : APPROVAL_STEPS[current];
  const last = APPROVAL_STEPS.length - 1;

  return (
    <section aria-label="Approval chain" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-2">
        <h3 className="min-w-0 flex-1 truncate text-body-2-semibold text-text-primary">Approval chain</h3>
        <span
          aria-live="polite"
          className={cx(
            "shrink-0 text-caption-2-medium tabular-nums transition-colors duration-200 ease-out motion-reduce:transition-none",
            finished ? "text-status-lime-text" : "text-text-tertiary",
          )}
        >
          {finished ? "All approved" : `${current} of ${APPROVAL_STEPS.length}`}
        </span>
        <button
          type="button"
          disabled={finished}
          aria-label={active ? `Approve ${active.title} step` : "All approvals complete"}
          onClick={() => setCurrent((index) => Math.min(APPROVAL_STEPS.length, index + 1))}
          className={cx(primaryButton, "h-6 shrink-0 gap-1 px-1.5 text-caption-2-semibold")}
        >
          {finished ? (
            <>
              <RiCheckLine className="size-3" aria-hidden />
              Done
            </>
          ) : (
            <>
              Approve
              <RiArrowRightLine className="size-3 rtl:-scale-x-100" aria-hidden />
            </>
          )}
        </button>
      </div>

      <ol className="mt-1.5">
        {APPROVAL_STEPS.map((step, index) => {
          const done = index < current;
          const isCurrent = index === current;
          return (
            <li key={step.title} className="relative flex items-center gap-2 pb-1 last:pb-0">
              {index < last && (
                <span
                  aria-hidden
                  className={cx(
                    "absolute start-[9px] top-[18px] h-[calc(100%-12px)] w-px",
                    "transition-colors duration-200 ease-out motion-reduce:transition-none",
                    done ? "bg-accent-500" : "bg-border-button-default",
                  )}
                />
              )}
              <span
                className={cx(
                  "relative z-[1] flex size-5 shrink-0 items-center justify-center rounded-full border text-caption-2-semibold",
                  "transition-[background-color,border-color,color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
                  done
                    ? "border-accent-600 bg-accent-600 text-text-white"
                    : isCurrent
                      ? "border-accent-600 bg-background-primary-default text-accent-600 ring-2 ring-accent-500/20"
                      : "border-border-button-default bg-background-primary-default text-text-tertiary",
                )}
              >
                {done ? (
                  <RiCheckLine className="size-3" aria-hidden />
                ) : (
                  <span className="tabular-nums">{index + 1}</span>
                )}
              </span>
              <div className="flex min-w-0 flex-1 items-center gap-1.5">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cx(
                        "truncate text-caption-1-semibold",
                        isCurrent ? "text-text-primary" : done ? "text-text-secondary" : "text-text-tertiary",
                      )}
                    >
                      {step.title}
                    </span>
                    {isCurrent && <span className="shrink-0 text-caption-2-medium text-status-orange-text">Current</span>}
                  </div>
                  <p className="truncate text-caption-2-regular text-text-tertiary">
                    {step.actor} · {step.detail}
                  </p>
                </div>
                {index <= current && <Avatar initials={step.initials} tone={done ? "lime" : "blue"} size="sm" />}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  5. Compliance Badge                                                        */
/* -------------------------------------------------------------------------- */
const EVIDENCE = [
  { title: "SOC 2 Type II report", meta: "2.4 MB" },
  { title: "Penetration test summary", meta: "1.1 MB" },
] as const;

export function ComplianceBadge() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open) closeRef.current?.focus();
    else if (wasOpen.current) triggerRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <section aria-label="SOC 2 compliance" className="relative w-full max-w-[300px]">
      <div className={cx(cardSurface, "p-2.5")} inert={open}>
        <div className="flex items-start gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-status-lime-background text-status-lime-text">
            <RiShieldCheckLine className="size-4" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="min-w-0 truncate text-body-2-semibold text-text-primary">SOC 2 Type II</h3>
              <Badge tone="lime">
                <span className="size-1.5 rounded-full bg-status-lime-text" aria-hidden />
                Compliant
              </Badge>
            </div>
            <p className="truncate text-caption-2-regular text-text-tertiary">Trust Services Criteria</p>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-1">
          <div className="min-w-0 rounded-md bg-background-secondary-default px-2 py-1">
            <p className="text-caption-2-regular text-text-tertiary">Evidence</p>
            <p className="truncate text-caption-1-medium text-text-primary">2 documents</p>
          </div>
          <div className="min-w-0 rounded-md bg-background-secondary-default px-2 py-1">
            <p className="text-caption-2-regular text-text-tertiary">Last reviewed</p>
            <p className="truncate text-caption-1-medium text-text-primary">Sep 18, 2026</p>
          </div>
        </div>
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls="compliance-evidence"
          onClick={() => setOpen(true)}
          className={cx(secondaryButton, "mt-1.5 h-7 w-full")}
        >
          <RiEyeLine className="size-3.5" aria-hidden />
          Review evidence
        </button>
      </div>
      {open && (
        <div
          id="compliance-evidence"
          role="dialog"
          aria-label="SOC 2 evidence"
          className={cx(
            cardSurface,
            "absolute inset-0 z-10 flex animate-label-in flex-col p-2.5 shadow-dropdown motion-reduce:animate-none",
          )}
        >
          <div className="flex items-center gap-2">
            <RiShieldCheckLine className="size-4 shrink-0 text-status-lime-text" aria-hidden />
            <h3 className="min-w-0 flex-1 truncate text-body-2-semibold text-text-primary">Evidence</h3>
            <button ref={closeRef} type="button" aria-label="Close evidence" onClick={() => setOpen(false)} className={iconButton}>
              <RiCloseLine className="size-3.5" aria-hidden />
            </button>
          </div>

          <ul className="mt-1.5 flex flex-col gap-1">
            {EVIDENCE.map((item) => (
              <li key={item.title} className="flex items-center gap-1.5 rounded-md bg-background-secondary-default px-2 py-1">
                <RiFileTextLine className="size-3.5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
                <p className="min-w-0 flex-1 truncate text-caption-2-medium text-text-primary">{item.title}</p>
                <span className="shrink-0 text-caption-2-regular text-text-tertiary">{item.meta}</span>
                <RiCheckLine className="size-3.5 shrink-0 text-status-lime-text" aria-hidden />
              </li>
            ))}
          </ul>

          <div className="mt-auto flex items-center justify-between gap-2 pt-1.5">
            <span className="min-w-0 truncate text-caption-2-regular text-text-tertiary">Sep 18 · Priya Raman</span>
            <button type="button" onClick={() => setOpen(false)} className={cx(quietButton, "h-6 shrink-0")}>
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  6. Policy Nav                                                              */
/* -------------------------------------------------------------------------- */
const POLICY_SECTIONS = [
  { id: "scope", label: "1. Scope", summary: "Covers every production system that stores client data." },
  { id: "data", label: "2. Data handling", summary: "Encrypted at rest with AES-256 and in transit with TLS 1.2+." },
  { id: "retention", label: "3. Retention", summary: "Logs are kept 90 days; invoices and contracts for seven years." },
  { id: "access", label: "4. Access control", summary: "SSO is required, with quarterly access reviews." },
] as const;

type PolicyId = (typeof POLICY_SECTIONS)[number]["id"];

export function PolicyNav() {
  const [active, setActive] = useState<PolicyId>("data");
  const current = POLICY_SECTIONS.find((item) => item.id === active) ?? POLICY_SECTIONS[0];

  return (
    <nav aria-label="Data policy sections" className={cx(cardSurface, "max-w-[300px] p-2")}>
      <div className="flex items-center gap-2 px-1">
        <RiBookOpenLine className="size-3.5 shrink-0 text-foreground-icon-secondary" aria-hidden />
        <h3 className="min-w-0 flex-1 truncate text-body-2-semibold text-text-primary">Data policy</h3>
        <span className="shrink-0 font-mono text-caption-2-regular text-text-tertiary">v3.2</span>
      </div>

      <ul className="mt-1 flex flex-col">
        {POLICY_SECTIONS.map((item) => {
          const selected = item.id === active;
          return (
            <li key={item.id}>
              <button
                type="button"
                aria-current={selected ? "location" : undefined}
                onClick={() => setActive(item.id)}
                className={cx(
                  "group flex h-6 w-full items-center gap-2 rounded-md px-1.5 text-start",
                  "transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
                  selected
                    ? "bg-background-secondary-default text-text-primary"
                    : "text-text-secondary hover:bg-background-secondary-default hover:text-text-primary",
                  focusRing,
                )}
              >
                <span
                  aria-hidden
                  className={cx(
                    "h-3 w-0.5 shrink-0 rounded-full bg-accent-500",
                    "transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
                    selected ? "scale-y-100 opacity-100" : "scale-y-50 opacity-0",
                  )}
                />
                <span className="min-w-0 flex-1 truncate text-caption-1-medium">{item.label}</span>
                {selected && <span className="shrink-0 text-caption-2-medium text-accent-600">Current</span>}
              </button>
            </li>
          );
        })}
      </ul>

      <div aria-live="polite" className="mt-1 min-h-[34px] rounded-md bg-background-secondary-default px-2 py-1.5">
        <p key={active} className="animate-label-in text-caption-2-regular text-text-secondary motion-reduce:animate-none">
          {current.summary}
        </p>
      </div>
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/*  7. Redline Diff                                                            */
/* -------------------------------------------------------------------------- */
export function RedlineDiff() {
  const [accepted, setAccepted] = useState(false);

  return (
    <section aria-label="Tracked change in payment terms" className={cx(cardSurface, "max-w-[460px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
          <RiPencilLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">§7.4 Payment terms</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">Proposed by Priya Raman · Nov 4</p>
        </div>
        <span className="flex shrink-0 items-center gap-1 font-mono text-caption-2-semibold">
          <span className="text-status-lime-text">+1</span>
          <span className="text-status-rose-text">−1</span>
        </span>
      </div>

      <div className="mt-2 rounded-lg border border-separator-border bg-background-secondary-default px-2.5 py-2">
        {accepted ? (
          <p key="clean" className="animate-label-in text-body-2-regular text-text-primary motion-reduce:animate-none">
            The Client shall pay each undisputed invoice within{" "}
            <span className="rounded-xs bg-status-lime-background px-0.5 text-status-lime-text">sixty (60)</span>{" "}
            days of receipt.
          </p>
        ) : (
          <p key="markup" className="animate-label-in text-body-2-regular text-text-primary motion-reduce:animate-none">
            The Client shall pay each undisputed invoice within{" "}
            <del className="rounded-xs bg-status-rose-background px-0.5 text-status-rose-text decoration-status-rose-text">
              thirty (30)
            </del>{" "}
            <ins className="rounded-xs bg-status-lime-background px-0.5 text-status-lime-text no-underline">
              sixty (60)
            </ins>{" "}
            days of receipt.
          </p>
        )}

        <div className="mt-1.5 flex items-center gap-3 text-caption-2-regular text-text-tertiary">
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-xs bg-status-rose-background" aria-hidden />
            Deleted
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-xs bg-status-lime-background" aria-hidden />
            Inserted
          </span>
        </div>
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span aria-live="polite" className={cx("min-w-0 truncate text-caption-2-regular", accepted ? "text-status-lime-text" : "text-text-tertiary")}>
          {accepted ? "Revision accepted · Nov 5, 2:41 PM" : "Awaiting your review"}
        </span>
        <button
          type="button"
          onClick={() => setAccepted((current) => !current)}
          className={cx(accepted ? secondaryButton : primaryButton, "h-7 shrink-0")}
        >
          {accepted ? (
            <>
              <RiRefreshLine className="size-3.5" aria-hidden />
              Undo
            </>
          ) : (
            <>
              <RiCheckLine className="size-3.5" aria-hidden />
              Accept change
            </>
          )}
        </button>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  8. Deadline Card                                                           */
/* -------------------------------------------------------------------------- */
export function DeadlineCard() {
  const [remind, setRemind] = useState(true);
  const [snoozed, setSnoozed] = useState(false);
  const due = snoozed ? "Nov 21, 2026" : "Nov 14, 2026";
  const days = snoozed ? 16 : 9;

  return (
    <section aria-label="Upcoming contract deadline" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-caption-2-semibold tracking-wide text-text-tertiary uppercase">Deadline</span>
        <Badge tone={snoozed ? "blue" : "orange"}>
          <RiTimeLine className="size-3" aria-hidden />
          Due in {days} days
        </Badge>
      </div>

      <h3 className="mt-1 text-body-2-semibold text-text-primary">Cascade MSA renewal</h3>

      <div aria-live="polite" className="mt-1.5 flex items-center gap-2">
        <RiCalendarEventLine className="size-3.5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
        <span className="text-caption-1-medium text-text-primary">{due}</span>
        <span className="ms-auto text-caption-2-regular text-text-tertiary tabular-nums">{days} days left</span>
      </div>

      <div className="mt-1 flex items-center gap-2">
        <Avatar initials="PR" tone="blue" size="sm" />
        <span className="min-w-0 flex-1 truncate text-caption-2-regular text-text-secondary">Priya Raman · Owner</span>
        <span className="shrink-0 text-caption-2-regular text-text-tertiary">Legal</span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 border-t border-separator-border pt-1.5">
        <div className="flex min-w-0 items-center gap-1.5">
          <RiNotification3Line className="size-3.5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
          <span className="truncate text-caption-2-medium text-text-secondary">Remind me 3 days before</span>
        </div>
        <Toggle checked={remind} onChange={setRemind} label="Remind me three days before the deadline" />
      </div>

      <div
        inert={!remind}
        className={cx(revealGrid, remind ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="mt-1 flex items-center gap-1 rounded-md bg-background-secondary-default px-2 py-1 text-caption-2-regular text-text-tertiary">
            <RiCheckLine className="size-3 shrink-0 text-status-lime-text" aria-hidden />
            Reminder set for {snoozed ? "Nov 18" : "Nov 11"}, 9:00 AM
          </p>
        </div>
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span className={metaText}>Renews automatically</span>
        <button
          type="button"
          aria-pressed={snoozed}
          onClick={() => setSnoozed((current) => !current)}
          className={cx(secondaryButton, "h-6 shrink-0 px-2")}
        >
          {snoozed ? (
            <>
              <RiRefreshLine className="size-3" aria-hidden />
              Undo
            </>
          ) : (
            "Snooze 7 days"
          )}
        </button>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  9. Entity Card                                                             */
/* -------------------------------------------------------------------------- */
const REGISTRATION_ID = "DE-6842197";

export function EntityCard() {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyId = () => {
    setCopied(true);
    void navigator.clipboard?.writeText(REGISTRATION_ID).catch(() => undefined);
  };

  return (
    <section aria-label="Northline Studio entity" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-start gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent-100 text-accent-700">
          <RiBuilding2Line className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="min-w-0 text-body-2-semibold text-text-primary">Northline Studio, Inc.</h3>
            <Badge tone="lime">Good standing</Badge>
          </div>
          <p className="truncate text-caption-2-regular text-text-tertiary">Delaware C corporation</p>
        </div>
      </div>

      <dl className="mt-2 grid grid-cols-[1fr_auto] items-center gap-x-2 gap-y-1 rounded-lg bg-background-secondary-default px-2 py-1.5">
        <dt className="flex items-center gap-1.5 text-caption-2-regular text-text-tertiary">
          <RiGlobeLine className="size-3 shrink-0" aria-hidden />
          Jurisdiction
        </dt>
        <dd className="text-end text-caption-1-medium text-text-primary">Delaware, USA</dd>
        <dt className="text-caption-2-regular text-text-tertiary">Registration ID</dt>
        <dd className="flex items-center justify-end gap-1">
          <span dir="ltr" className="font-mono text-caption-1-medium text-text-primary">{REGISTRATION_ID}</span>
          <button
            type="button"
            aria-label={copied ? "Registration ID copied" : "Copy registration ID"}
            onClick={copyId}
            className={cx(iconButton, "size-5")}
          >
            {copied ? (
              <RiCheckLine className="size-3 animate-label-in text-status-lime-text motion-reduce:animate-none" aria-hidden />
            ) : (
              <RiFileCopyLine className="size-3" aria-hidden />
            )}
          </button>
        </dd>
        <dt className="text-caption-2-regular text-text-tertiary">Formed</dt>
        <dd className="text-end text-caption-1-medium text-text-primary">Mar 4, 2021</dd>
      </dl>
      <span aria-live="polite" className="sr-only">{copied ? "Registration ID copied to clipboard" : ""}</span>

      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${baseId}-agent`}
        onClick={() => setOpen((current) => !current)}
        className={cx(
          "mt-1 flex h-6 w-full items-center gap-1 rounded-sm text-start",
          "transition-colors duration-150 ease-out motion-reduce:transition-none",
          focusRing,
        )}
      >
        <span className="flex-1 text-caption-2-medium text-text-secondary">Registered agent</span>
        <span className={metaText}>Wilmington, DE</span>
        <RiArrowDownSLine
          className={cx(
            "size-3.5 shrink-0 text-foreground-icon-tertiary transition-transform duration-200 ease-out motion-reduce:transition-none",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      <div
        id={`${baseId}-agent`}
        inert={!open}
        className={cx(revealGrid, open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="rounded-md bg-background-secondary-default px-2 py-1.5 text-caption-2-regular text-text-secondary">
            Corporation Trust Center
            <br />
            1209 Orange St, Wilmington, DE 19801
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  10. Consent Toggle                                                         */
/* -------------------------------------------------------------------------- */
export function ConsentToggle() {
  const descriptionId = useId();
  const [enabled, setEnabled] = useState(false);

  return (
    <section aria-label="Product update consent" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-start gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
          <RiMailLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">Product updates</h3>
          <p className="text-caption-2-regular text-text-tertiary">Optional · opt in anytime</p>
        </div>
        <Toggle
          checked={enabled}
          onChange={setEnabled}
          label="Receive product update emails"
          describedBy={descriptionId}
        />
      </div>

      <p id={descriptionId} className="mt-2 text-caption-1-regular text-text-secondary">
        One email a month about new features and fixes. We never sell your address, and every message
        has a one-click unsubscribe.
      </p>

      <div
        inert={!enabled}
        className={cx(revealGrid, "mt-1.5", enabled ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
      >
        <div className="min-h-0 overflow-hidden">
          <div aria-live="polite" className="rounded-lg bg-background-secondary-default px-2 py-1.5">
            <p className="flex items-center gap-1 text-caption-2-semibold text-status-lime-text">
              <RiCheckLine className="size-3" aria-hidden />
              Opted in · consent v4.2
            </p>
            <p className="mt-0.5 text-caption-2-regular text-text-tertiary">
              Recorded Nov 5, 2026 · 2:41 PM · IP 198.51.100.24
            </p>
          </div>
        </div>
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2 border-t border-separator-border pt-1.5">
        <span className={cx("min-w-0 truncate", metaText)}>
          {enabled ? "Consent recorded in your account." : "No email will be sent."}
        </span>
        {enabled ? (
          <button type="button" onClick={() => setEnabled(false)} className={cx(quietButton, "h-6 shrink-0")}>
            Withdraw
          </button>
        ) : (
          <span className="shrink-0 text-caption-2-medium text-text-tertiary">Optional</span>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  11. Audit Trail                                                            */
/* -------------------------------------------------------------------------- */
const AUDIT_EVENTS = [
  {
    id: "sent",
    title: "Contract sent to counterparty",
    actor: "Maya Chen",
    source: "Northline legal",
    time: "Nov 3 · 09:12",
    detail: "Sent from the legal team to Elena Ruiz at Cascade Logistics.",
    icon: RiSendPlaneLine,
    kind: "all",
  },
  {
    id: "redline",
    title: "Clause 4.2 redlined",
    actor: "Priya Raman",
    source: "Contract workspace",
    time: "Nov 4 · 11:26",
    detail: "Confidentiality survival changed from two to three years.",
    icon: RiPencilLine,
    kind: "all",
  },
  {
    id: "approved",
    title: "Legal approval recorded",
    actor: "Priya Raman",
    source: "Legal review",
    time: "Nov 5 · 08:40",
    detail: "Approved with no conditions. Signature hash 9f2c…a41d.",
    icon: RiShieldCheckLine,
    kind: "decisions",
  },
] as const;

type AuditFilter = "all" | "decisions";
type AuditId = (typeof AUDIT_EVENTS)[number]["id"];

export function AuditTrail() {
  const [filter, setFilter] = useState<AuditFilter>("all");
  const [expanded, setExpanded] = useState<AuditId | null>("redline");
  const events = AUDIT_EVENTS.filter((event) => filter === "all" || event.kind === "decisions");

  return (
    <section aria-label="Contract audit trail" className={cx(cardSurface, "max-w-[460px] p-2.5")}>
      <div className="flex items-center gap-2">
        <RiHistoryLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
        <h3 className="min-w-0 flex-1 truncate text-body-2-semibold text-text-primary">Audit trail</h3>
        <span className="shrink-0 font-mono text-caption-2-regular text-text-tertiary">GMT+1</span>
        <div role="group" aria-label="Filter audit events" className="flex rounded-md bg-background-tertiary-default p-0.5">
          {(["all", "decisions"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={filter === option}
              onClick={() => setFilter(option)}
              className={cx(
                "h-6 rounded-sm px-1.5 text-caption-2-semibold capitalize",
                "transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                filter === option
                  ? "bg-segmented-control-selected-background text-text-primary shadow-xs"
                  : "text-text-tertiary hover:text-text-secondary",
                focusRing,
              )}
            >
              {option === "all" ? "All" : "Approvals"}
            </button>
          ))}
        </div>
      </div>

      <ol aria-live="polite" className="mt-1.5 flex flex-col">
        {events.map((event) => {
          const open = expanded === event.id;
          const Icon = event.icon;
          return (
            <li key={event.id} className="border-b border-separator-border last:border-b-0">
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`audit-${event.id}`}
                onClick={() => setExpanded(open ? null : event.id)}
                className={cx(
                  "flex w-full items-start gap-2 rounded-md px-1 py-1 text-start",
                  "transition-colors duration-150 ease-out hover:bg-background-secondary-default motion-reduce:transition-none",
                  focusRing,
                )}
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-background-tertiary-default text-foreground-icon-secondary">
                  <Icon className="size-3" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span className="min-w-0 flex-1 truncate text-caption-1-medium text-text-primary">{event.title}</span>
                    <span className="shrink-0 font-mono text-caption-2-regular text-text-tertiary tabular-nums">{event.time}</span>
                  </span>
                  <span className="flex items-center gap-1 text-caption-2-regular text-text-tertiary">
                    <bdi className="truncate">{event.actor}</bdi>
                    <span aria-hidden>·</span>
                    <span className="truncate">{event.source}</span>
                  </span>
                </span>
                <RiArrowDownSLine
                  className={cx(
                    "mt-0.5 size-3.5 shrink-0 text-foreground-icon-tertiary transition-transform duration-200 ease-out motion-reduce:transition-none",
                    open && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>
              <div
                id={`audit-${event.id}`}
                inert={!open}
                className={cx(revealGrid, open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
              >
                <div className="min-h-0 overflow-hidden">
                  <p className="pb-1 ps-8 pe-5 text-caption-2-regular text-text-secondary">{event.detail}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  12. Terms Summary                                                          */
/* -------------------------------------------------------------------------- */
const KEY_TERMS = [
  { term: "Term", value: "12 months, auto-renews" },
  { term: "Notice", value: "30 days before renewal" },
  { term: "Liability", value: "Capped at fees paid" },
] as const;

const FULL_TERMS = [
  {
    title: "1. Fees",
    body: "Invoices are due within 60 days. Late amounts accrue interest at 1% per month.",
  },
  {
    title: "2. Termination",
    body: "Either party may terminate for material breach after 30 days’ written notice.",
  },
  {
    title: "3. Liability",
    body: "Aggregate liability is capped at the fees paid in the 12 months before the claim.",
  },
] as const;

export function TermsSummary() {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);

  return (
    <section aria-label="Terms summary" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-start gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
          <RiFileTextLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">Terms summary</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">Master Services Agreement · v4.2</p>
        </div>
        <Badge tone={accepted ? "lime" : "neutral"}>{accepted ? "Accepted" : "Draft"}</Badge>
      </div>

      <dl className="mt-2 grid grid-cols-[88px_1fr] gap-x-2 gap-y-1 rounded-lg bg-background-secondary-default px-2 py-1.5">
        {KEY_TERMS.map((item) => (
          <div key={item.term} className="contents">
            <dt className="text-caption-2-regular text-text-tertiary">{item.term}</dt>
            <dd className="truncate text-caption-1-medium text-text-primary">{item.value}</dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${baseId}-full`}
        onClick={() => setOpen((current) => !current)}
        className={cx(
          "mt-1 flex h-6 w-full items-center gap-1 rounded-sm text-start",
          "transition-colors duration-150 ease-out motion-reduce:transition-none",
          focusRing,
        )}
      >
        <span className="flex-1 text-caption-2-medium text-text-secondary">Read full terms</span>
        <span className={metaText}>3 sections</span>
        <RiArrowDownSLine
          className={cx(
            "size-3.5 shrink-0 text-foreground-icon-tertiary transition-transform duration-200 ease-out motion-reduce:transition-none",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      <div
        id={`${baseId}-full`}
        inert={!open}
        className={cx(revealGrid, open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="mt-0.5 flex flex-col gap-1 rounded-lg border border-separator-border px-2 py-1.5">
            {FULL_TERMS.map((item) => (
              <div key={item.title}>
                <p className="text-caption-2-semibold text-text-primary">{item.title}</p>
                <p className="text-caption-2-regular text-text-secondary">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2 border-t border-separator-border pt-1.5">
        <span aria-live="polite" className={cx("min-w-0 truncate", metaText)}>
          {accepted ? "Accepted Nov 5, 2026" : "Summary only · not legal advice"}
        </span>
        <button
          type="button"
          disabled={accepted}
          onClick={() => setAccepted(true)}
          className={cx(accepted ? secondaryButton : primaryButton, "h-6 shrink-0 px-2")}
        >
          {accepted ? (
            <>
              <RiCheckLine className="size-3" aria-hidden />
              Accepted
            </>
          ) : (
            "Accept terms"
          )}
        </button>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Specimens                                                                  */
/* -------------------------------------------------------------------------- */
export const LEGAL_SECTION: ExtendedSection = {
  id: "legal",
  title: "Legal",
  blurb: "Clauses, signatures and decisions with a paper trail.",
  file: "legal.tsx",
  entries: [
    { name: "Contract Card", description: "Parties, term and status with an acknowledgement step.", Demo: ContractCard },
    { name: "Clause Row", description: "One clause with an expandable body and a review mark.", Demo: ClauseRow },
    { name: "Signature Pad", description: "Type or draw a signature, then confirm and date it.", Demo: SignaturePad },
    { name: "Approval Chain", description: "Four approval steps with a live current approver.", Demo: ApprovalChain },
    { name: "Compliance Badge", description: "SOC 2 status with an evidence overlay that closes on Escape.", Demo: ComplianceBadge },
    { name: "Policy Nav", description: "Policy sections with the current one marked and summarised.", Demo: PolicyNav },
    { name: "Redline Diff", description: "An inline tracked change you can accept or undo.", Demo: RedlineDiff, wide: true },
    { name: "Deadline Card", description: "Due date, owner and a reminder you can switch off.", Demo: DeadlineCard },
    { name: "Entity Card", description: "Entity, jurisdiction and a registration ID you can copy.", Demo: EntityCard },
    { name: "Consent Toggle", description: "Opt-in with plain language and a visible consent receipt.", Demo: ConsentToggle },
    { name: "Audit Trail", description: "Actors, timestamps and expandable event detail.", Demo: AuditTrail, wide: true },
    { name: "Terms Summary", description: "Key terms with the full agreement a click away.", Demo: TermsSummary },
  ],
};
