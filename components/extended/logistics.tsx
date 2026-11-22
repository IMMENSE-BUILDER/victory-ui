"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import {
  RiAddLine,
  RiArchiveLine,
  RiArrowDownSLine,
  RiArrowRightLine,
  RiCalendarLine,
  RiCameraLine,
  RiCheckLine,
  RiCloseLine,
  RiErrorWarningLine,
  RiFileList3Line,
  RiFileTextLine,
  RiLoader4Line,
  RiMapPinLine,
  RiNavigationLine,
  RiPrinterLine,
  RiQuillPenLine,
  RiRefreshLine,
  RiRouteLine,
  RiSubtractLine,
  RiTimeLine,
  RiTruckLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* Shared anatomy */

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";
const cardSurface = "w-full rounded-xl border border-border-button-default bg-background-primary-default shadow-card";
const cardBase = cx(cardSurface, "max-w-[320px] p-2.5");

const buttonBase = cx(
  "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg text-caption-1-semibold",
  "transition-[transform,background-color,color,box-shadow,opacity] duration-150 ease-out",
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  "motion-reduce:transition-none motion-reduce:active:scale-100",
);
const primaryButton = cx(buttonBase, "h-7 bg-button-primary px-2.5 text-text-white shadow-xs", focusRing);
const secondaryButton = cx(
  buttonBase,
  "h-7 border border-border-button-default bg-background-primary-default px-2.5 text-text-primary shadow-xs hover:bg-background-primary-hover",
  focusRing,
);
const quietButton = cx(
  buttonBase,
  "h-6 px-1.5 text-text-secondary hover:bg-background-secondary-default hover:text-text-primary",
  focusRing,
);
const iconButton = cx(
  "flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-icon-tertiary",
  "transition-[background-color,color] duration-150 ease-out hover:bg-background-tertiary-default hover:text-text-primary",
  "motion-reduce:transition-none",
  focusRing,
);

type Tone = "ok" | "warn" | "error" | "info" | "neutral";

const TONE_SURFACE: Record<Tone, string> = {
  ok: "bg-status-lime-background text-status-lime-text",
  warn: "bg-status-yellow-background text-status-yellow-text",
  error: "bg-status-rose-background text-status-rose-text",
  info: "bg-status-blue-background text-status-blue-text",
  neutral: "bg-background-tertiary-default text-text-secondary",
};

const TONE_DOT: Record<Tone, string> = {
  ok: "bg-status-lime-text",
  warn: "bg-status-yellow-text",
  error: "bg-status-rose-text",
  info: "bg-status-blue-text",
  neutral: "bg-foreground-icon-tertiary",
};

function StatusPill({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-caption-2-medium",
        "transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
        TONE_SURFACE[tone],
      )}
    >
      <span aria-hidden className={cx("size-1.5 rounded-full", TONE_DOT[tone])} />
      {children}
    </span>
  );
}

function IconTile({
  icon: Icon,
  tone = "neutral",
}: {
  icon: IconComponent;
  tone?: "neutral" | "accent" | "warn" | "error";
}) {
  return (
    <span
      className={cx(
        "flex size-7 shrink-0 items-center justify-center rounded-lg",
        tone === "accent"
          ? "bg-accent-500/15 text-accent-500"
          : tone === "warn"
            ? "bg-status-yellow-background text-status-yellow-text"
            : tone === "error"
              ? "bg-status-rose-background text-status-rose-text"
              : "bg-background-tertiary-default text-foreground-icon-secondary",
      )}
    >
      <Icon className="size-3.5" aria-hidden />
    </span>
  );
}

function StepperButton({
  icon: Icon,
  label,
  onClick,
  disabled,
}: {
  icon: IconComponent;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cx(
        "flex size-6 shrink-0 items-center justify-center rounded-md border border-border-button-default",
        "bg-background-primary-default text-foreground-icon-secondary shadow-xs",
        "transition-[background-color,color,opacity] duration-150 ease-out",
        "hover:bg-background-primary-hover hover:text-text-primary",
        "disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none",
        focusRing,
      )}
    >
      <Icon className="size-3" aria-hidden />
    </button>
  );
}

function useEscape(active: boolean, onClose: () => void) {
  useEffect(() => {
    if (!active) return;
    const handle = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [active, onClose]);
}

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const rate = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/* 1. Shipment tracker */

const SHIPMENT_STEPS = [
  { label: "Picked up", place: "Oakland, CA", time: "Mon 09:12" },
  { label: "In transit", place: "Sacramento hub", time: "Tue 04:40" },
  { label: "Out for delivery", place: "Salt Lake City", time: "Wed 07:05" },
  { label: "Delivered", place: "Front desk", time: "Wed 11:20" },
] as const;

export function ShipmentTracker() {
  const [step, setStep] = useState(1);
  const current = SHIPMENT_STEPS[step];
  const delivered = step === SHIPMENT_STEPS.length - 1;

  return (
    <section aria-label="Shipment NL-884210336" className={cx(cardBase, "flex flex-col")}>
      <div className="flex items-center gap-2">
        <IconTile icon={RiTruckLine} tone="accent" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-1-semibold text-text-primary">
            <bdi>NL-884210336</bdi>
          </p>
          <p className="truncate text-caption-2-regular text-text-tertiary">Oakland → Salt Lake City · 2.4 lb</p>
        </div>
        <StatusPill tone={delivered ? "ok" : "info"}>{delivered ? "Delivered" : "On time"}</StatusPill>
      </div>

      <ol aria-label="Shipment milestones" className="mt-2">
        {SHIPMENT_STEPS.map((item, index) => {
          const done = index < step;
          const active = index === step;
          return (
            <li key={item.label} className="relative ps-4">
              {index < SHIPMENT_STEPS.length - 1 && (
                <span
                  aria-hidden
                  className={cx(
                    "absolute start-[19px] top-2.5 h-full w-px transition-[background-color] duration-200 ease-out motion-reduce:transition-none",
                    index < step ? "bg-accent-500" : "bg-separator-border",
                  )}
                />
              )}
              <button
                type="button"
                aria-current={active ? "step" : undefined}
                aria-label={`Step ${index + 1} of 4: ${item.label}, ${item.place}, ${item.time}`}
                onClick={() => setStep(index)}
                className={cx("group flex w-full items-center gap-2 rounded-sm py-0.5 text-start", focusRing)}
              >
                <span
                  aria-hidden
                  className={cx(
                    "relative z-10 flex size-[7px] shrink-0 items-center justify-center rounded-full border",
                    "transition-[background-color,border-color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
                    done
                      ? "border-accent-600 bg-accent-600"
                      : active
                        ? "border-accent-600 bg-background-primary-default ring-4 ring-accent-500/20"
                        : "border-border-button-default bg-background-primary-default group-hover:border-accent-500",
                  )}
                />
                <span
                  className={cx(
                    "min-w-0 flex-1 truncate text-caption-1-medium transition-[color] duration-150 ease-out motion-reduce:transition-none",
                    active ? "text-text-primary" : done ? "text-text-secondary" : "text-text-tertiary",
                  )}
                >
                  {item.label}
                </span>
                <span className="shrink-0 text-caption-2-regular text-text-tertiary tabular-nums">{item.time}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-2 flex items-center gap-2 border-t border-separator-border pt-2">
        <div key={step} className="min-w-0 flex-1 animate-label-in motion-reduce:animate-none">
          <p aria-live="polite" className="truncate text-caption-1-semibold text-text-primary">
            {current.label} · {current.place}
          </p>
          <p className="truncate text-caption-2-regular text-text-tertiary">
            {delivered ? "Signed by M. Chen at 11:20" : `Scan ${current.time} · ETA Wed 11:20`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setStep(delivered ? 0 : step + 1)}
          className={cx(delivered ? secondaryButton : primaryButton, "h-6")}
        >
          {delivered ? (
            <>
              <RiRefreshLine className="size-3" aria-hidden />
              Reset
            </>
          ) : (
            <>
              Next scan
              <RiArrowRightLine className="size-3 rtl:-scale-x-100" aria-hidden />
            </>
          )}
        </button>
      </div>
    </section>
  );
}

/* 2. Warehouse row */

const STOCK_MAX = 480;

function stockState(onHand: number, reorderPoint: number) {
  if (onHand <= 0) return { label: "Out", tone: "error" as Tone, bar: "bg-status-rose-text" };
  if (onHand <= reorderPoint) return { label: "Reorder", tone: "warn" as Tone, bar: "bg-status-orange-text" };
  if (onHand <= reorderPoint * 1.5) return { label: "Watch", tone: "info" as Tone, bar: "bg-status-yellow-text" };
  return { label: "In stock", tone: "ok" as Tone, bar: "bg-accent-500" };
}

export function WarehouseRow() {
  const [onHand, setOnHand] = useState(84);
  const [po, setPo] = useState<string | null>(null);
  const state = stockState(onHand, 120);
  const gap = Math.max(0, 120 - onHand);
  const adjust = (delta: number) => setOnHand((value) => Math.min(STOCK_MAX, Math.max(0, value + delta)));

  return (
    <section aria-label="Warehouse row GLV-4417" className={cx(cardBase, "flex flex-col")}>
      <div className="flex items-center gap-2">
        <IconTile icon={RiArchiveLine} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-1-semibold text-text-primary">Nitrile gloves · Large</p>
          <p className="truncate text-caption-2-regular text-text-tertiary">
            <bdi>SKU GLV-4417</bdi> · Bin B-14
          </p>
        </div>
        <StatusPill tone={state.tone}>{state.label}</StatusPill>
      </div>

      <div className="mt-2 flex items-end gap-2 rounded-lg bg-background-secondary-default px-2 py-1.5">
        <div className="min-w-0">
          <p className="text-caption-2-regular text-text-tertiary">On hand</p>
          <p key={onHand} className="animate-number-fade text-title-3-semibold text-text-primary tabular-nums motion-reduce:animate-none">
            {onHand}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <StepperButton icon={RiSubtractLine} label="Remove 30 units" disabled={onHand === 0} onClick={() => adjust(-30)} />
          <StepperButton icon={RiAddLine} label="Add 30 units" disabled={onHand === STOCK_MAX} onClick={() => adjust(30)} />
        </div>
        <div className="ms-auto text-end">
          <p className="text-caption-2-regular text-text-tertiary">Reorder at</p>
          <p className="text-caption-1-semibold text-text-primary tabular-nums">120</p>
        </div>
      </div>

      <div className="mt-2">
        <div className="relative h-1.5 overflow-hidden rounded-full bg-background-tertiary-default">
          <div
            aria-hidden
            className={cx(
              "h-full rounded-full transition-[width,background-color] duration-200 ease-out motion-reduce:transition-none",
              state.bar,
            )}
            style={{ width: `${(onHand / STOCK_MAX) * 100}%` }}
          />
          <span aria-hidden className="absolute inset-y-0 start-1/4 w-px bg-foreground-icon-tertiary" />
        </div>
        <p className="mt-1 text-caption-2-regular text-text-tertiary">
          {state.label === "Reorder" || state.label === "Out"
            ? `${gap} units below the reorder point.`
            : "Case pack of 30 · 2-day lead time."}
        </p>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <span role="status" aria-live="polite" className="min-w-0 truncate text-caption-2-medium text-text-tertiary">
          {po ? (
            <span className="flex items-center gap-1 text-status-lime-text">
              <RiCheckLine className="size-3" aria-hidden />
              <bdi>{po}</bdi> raised
            </span>
          ) : (
            "Suggested order: 240 units"
          )}
        </span>
        <button
          type="button"
          onClick={() => setPo("PO-2291")}
          disabled={Boolean(po)}
          className={cx(po ? secondaryButton : primaryButton, "h-6")}
        >
          {po ? (
            <>
              <RiCheckLine className="size-3" aria-hidden />
              Ordered
            </>
          ) : (
            <>
              Reorder 240
              <RiArrowRightLine className="size-3 rtl:-scale-x-100" aria-hidden />
            </>
          )}
        </button>
      </div>
    </section>
  );
}

/* 3. Inventory count */

const COUNT_EXPECTED = 480;

export function InventoryCount() {
  const inputId = useId();
  const [counted, setCounted] = useState("462");
  const [reconciled, setReconciled] = useState(false);
  const parsed = Number.parseInt(counted, 10);
  const valid = Number.isFinite(parsed);
  const variance = valid ? parsed - COUNT_EXPECTED : 0;
  const tone: Tone = !valid ? "neutral" : variance === 0 ? "ok" : variance < 0 ? "warn" : "info";
  const varianceLabel = !valid
    ? "Waiting for count"
    : variance === 0
      ? "Exact match"
      : variance < 0
        ? `${Math.abs(variance)} short`
        : `${variance} over`;

  return (
    <section aria-label="Cycle count C-2081" className={cx(cardBase, "flex flex-col")}>
      <div className="flex items-center gap-2">
        <IconTile icon={RiFileList3Line} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-1-semibold text-text-primary">Cycle count C-2081</p>
          <p className="truncate text-caption-2-regular text-text-tertiary">AA batteries · Bin A-07</p>
        </div>
        <StatusPill tone={reconciled ? "ok" : "neutral"}>{reconciled ? "Reconciled" : "Open"}</StatusPill>
      </div>

      <div className="mt-2 flex items-center gap-2 rounded-lg bg-background-secondary-default px-2 py-1.5">
        <div className="min-w-0 flex-1">
          <p className="text-caption-2-regular text-text-tertiary">Expected</p>
          <p className="text-body-2-semibold text-text-primary tabular-nums">{COUNT_EXPECTED}</p>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <label htmlFor={inputId} className="text-caption-2-regular text-text-tertiary">
            Counted
          </label>
          <input
            id={inputId}
            inputMode="numeric"
            aria-invalid={!valid}
            aria-describedby={`${inputId}-variance`}
            value={counted}
            disabled={reconciled}
            onChange={(event) => setCounted(event.target.value.replace(/[^\d]/g, ""))}
            className={cx(
              "h-6 w-16 rounded-md bg-background-primary-default px-1.5 text-end text-body-2-semibold text-text-primary shadow-xs tabular-nums outline-none",
              "disabled:opacity-60",
              focusRing,
            )}
          />
        </div>
      </div>

      <div className="mt-2 flex items-baseline justify-between gap-2">
        <span id={`${inputId}-variance`} aria-live="polite" className="text-caption-2-regular text-text-tertiary">
          Variance · {valid ? `${((variance / COUNT_EXPECTED) * 100).toFixed(1)}%` : "—"}
        </span>
        <span
          className={cx(
            "flex items-center gap-1 rounded-full px-1.5 py-0.5 text-caption-2-semibold tabular-nums",
            "transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
            TONE_SURFACE[tone],
          )}
        >
          {variance === 0 && valid ? <RiCheckLine className="size-3" aria-hidden /> : <RiErrorWarningLine className="size-3" aria-hidden />}
          {varianceLabel}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 border-t border-separator-border pt-2">
        <p className="min-w-0 flex-1 truncate text-caption-2-regular text-text-tertiary">
          {reconciled ? "Adjustment posted to the ledger at 14:06." : "Reconciling writes off the variance."}
        </p>
        <button
          type="button"
          disabled={!valid || reconciled}
          onClick={() => setReconciled(true)}
          className={cx(reconciled ? secondaryButton : primaryButton, "h-6")}
        >
          {reconciled ? (
            <>
              <RiCheckLine className="size-3" aria-hidden />
              Reconciled
            </>
          ) : (
            <>
              Reconcile
              <RiArrowRightLine className="size-3 rtl:-scale-x-100" aria-hidden />
            </>
          )}
        </button>
      </div>
    </section>
  );
}

/* 4. Route map */

const ROUTE_STOPS = [
  { name: "Depot 4", detail: "06:40", x: 26, y: 105 },
  { name: "Ashford", detail: "07:25", x: 88, y: 76 },
  { name: "Mill Lane", detail: "08:10", x: 118, y: 92 },
  { name: "Quay 9", detail: "09:05", x: 152, y: 50 },
  { name: "Harbour", detail: "09:40", x: 186, y: 26 },
] as const;

const ROUTE_CUMULATIVE = [0, 34.5, 51.7, 79, 100];

function pointPct(x: number, y: number) {
  return { left: `${(x / 200) * 100}%`, top: `${(y / 130) * 100}%` };
}

export function RouteMap() {
  const [current, setCurrent] = useState(2);
  const last = ROUTE_STOPS.length - 1;
  const complete = current === last;
  const from = ROUTE_STOPS[Math.max(0, current - 1)];
  const to = ROUTE_STOPS[current];
  const fraction = complete ? 1 : current === 0 ? 0 : 0.58;
  const driver = {
    x: from.x + (to.x - from.x) * fraction,
    y: from.y + (to.y - from.y) * fraction,
  };
  const driverPct = complete ? 100 : current === 0 ? 0 : ROUTE_CUMULATIVE[current - 1] + (ROUTE_CUMULATIVE[current] - ROUTE_CUMULATIVE[current - 1]) * 0.58;

  return (
    <section aria-label="Route 14, Bay Loop" className={cx(cardSurface, "max-w-[480px] p-2.5")}>
      <div className="flex items-center gap-2">
        <IconTile icon={RiRouteLine} tone="accent" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-1-semibold text-text-primary">Route 14 · Bay Loop</p>
          <p className="truncate text-caption-2-regular text-text-tertiary">Ana Ruiz · 5 stops · 18.2 mi</p>
        </div>
        <StatusPill tone={complete ? "ok" : "info"}>{complete ? "Complete" : current === 0 ? "At depot" : "En route"}</StatusPill>
      </div>

      <div className="mt-1.5 grid grid-cols-[1.05fr_1fr] gap-2">
        <div className="relative h-[100px] overflow-hidden rounded-lg border border-separator-border bg-background-secondary-default">
            <svg viewBox="0 0 200 130" preserveAspectRatio="none" aria-hidden className="absolute inset-0 size-full">
              <path d="M26 105 L88 76 L118 92 L152 50 L186 26" fill="none" className="stroke-foreground-icon-quaternary" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              <path d="M26 105 L88 76 L118 92 L152 50 L186 26" fill="none" pathLength={100} strokeDasharray="100" className="stroke-accent-500 transition-[stroke-dashoffset] duration-200 ease-out motion-reduce:transition-none" style={{ strokeDashoffset: 100 - driverPct }} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            </svg>

            {ROUTE_STOPS.map((stop, index) => {
              const done = index < current || complete;
              const next = index === current && !complete;
              return (
                <span
                  key={stop.name}
                  aria-hidden
                  style={pointPct(stop.x, stop.y)}
                  className={cx(
                    "absolute flex size-3.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-caption-2-semibold",
                    "transition-[background-color,border-color,color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
                    done
                      ? "border-accent-600 bg-accent-600 text-text-white"
                      : next
                        ? "border-accent-600 bg-background-primary-default text-accent-600 ring-2 ring-accent-500/25"
                        : "border-border-button-default bg-background-primary-default text-text-tertiary",
                  )}
                >
                  {index + 1}
                </span>
              );
            })}

            <span
              aria-hidden
              style={pointPct(driver.x, driver.y)}
              className={cx(
                "absolute z-10 flex size-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full",
                "bg-accent-600 text-text-white shadow-dropdown ring-2 ring-background-primary-default",
                "transition-[left,top] duration-200 ease-out motion-reduce:transition-none",
              )}
            >
              <RiNavigationLine className="size-2.5 rotate-45" />
            </span>
        </div>

        <ol aria-label="Route stops" className="flex flex-col justify-center gap-0.5">
          {ROUTE_STOPS.map((stop, index) => {
            const done = index < current || complete;
            const next = index === current && !complete;
            return (
              <li key={stop.name}>
                <button
                  type="button"
                  aria-current={next ? "step" : undefined}
                  onClick={() => setCurrent(index)}
                  className={cx(
                    "flex h-5 w-full items-center gap-1.5 rounded-md px-1 text-start",
                    "transition-[background-color] duration-150 ease-out motion-reduce:transition-none",
                    next ? "bg-accent-500/10" : "hover:bg-background-secondary-default",
                    focusRing,
                  )}
                >
                  <span
                    aria-hidden
                    className={cx(
                      "size-1.5 shrink-0 rounded-full",
                      done ? "bg-accent-500" : next ? "bg-accent-600" : "bg-foreground-icon-quaternary",
                    )}
                  />
                  <span className={cx("min-w-0 flex-1 truncate text-caption-2-medium", next ? "text-text-primary" : "text-text-secondary")}>
                    {stop.name}
                  </span>
                  <span className="shrink-0 text-caption-2-regular text-text-tertiary tabular-nums">{stop.detail}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-1.5 flex items-center gap-2">
        <span aria-live="polite" className="min-w-0 flex-1 truncate text-caption-2-regular text-text-tertiary">
          {complete ? "All parcels delivered." : `Next · ${ROUTE_STOPS[current].name}`}
        </span>
        <button
          type="button"
          onClick={() => setCurrent(complete ? 0 : current + 1)}
          className={cx(complete ? secondaryButton : primaryButton, "h-6")}
        >
          {complete ? (
            <>
              <RiRefreshLine className="size-3" aria-hidden />
              Replay
            </>
          ) : (
            <>
              Next stop
              <RiArrowRightLine className="size-3 rtl:-scale-x-100" aria-hidden />
            </>
          )}
        </button>
      </div>
    </section>
  );
}

/* 5. Delivery window */

const DELIVERY_WINDOWS = [
  { id: "morning", label: "8:00 – 10:00", note: "2 slots left", available: true },
  { id: "midday", label: "10:00 – 12:00", note: "Fully booked", available: false },
  { id: "afternoon", label: "12:00 – 14:00", note: "5 slots left", available: true },
] as const;

type WindowId = (typeof DELIVERY_WINDOWS)[number]["id"];

export function DeliveryWindow() {
  const [slot, setSlot] = useState<WindowId>("morning");
  const [confirmed, setConfirmed] = useState(false);
  const selected = DELIVERY_WINDOWS.find((item) => item.id === slot && item.available) ?? DELIVERY_WINDOWS[0];

  const choose = (id: WindowId) => {
    if (confirmed && id === slot) return;
    setSlot(id);
    setConfirmed(false);
  };

  return (
    <section aria-label="Choose a delivery window" className={cx(cardBase, "flex flex-col")}>
      <div className="flex items-center gap-2">
        <IconTile icon={RiCalendarLine} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-1-semibold text-text-primary">Delivery window</p>
          <p className="truncate text-caption-2-regular text-text-tertiary">Thu, Nov 6 · 118 Harbour Way</p>
        </div>
        <StatusPill tone={confirmed ? "ok" : "neutral"}>{confirmed ? "Booked" : "2-hour"}</StatusPill>
      </div>

      <div role="group" aria-label="Available windows" className="mt-2 flex flex-col gap-1">
        {DELIVERY_WINDOWS.map((item) => {
          const active = confirmed ? false : slot === item.id;
          const booked = confirmed && slot === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={booked || active}
              disabled={!item.available}
              onClick={() => choose(item.id)}
              className={cx(
                "flex h-7 items-center gap-2 rounded-lg border px-2 text-start",
                "transition-[background-color,border-color,color,opacity] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                !item.available
                  ? "border-transparent bg-background-secondary-default opacity-50"
                  : booked
                    ? "border-accent-600 bg-accent-500/10"
                    : active
                      ? "border-accent-500 bg-accent-500/10"
                      : "border-border-button-default bg-background-primary-default hover:bg-background-primary-hover",
              )}
            >
              <span
                aria-hidden
                className={cx(
                  "flex size-3.5 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,color] duration-150 ease-out motion-reduce:transition-none",
                  booked || active ? "border-accent-600 bg-accent-600 text-text-white" : "border-border-checkbox-default bg-background-primary-default",
                )}
              >
                {(booked || active) && <RiCheckLine className="size-2.5" aria-hidden />}
              </span>
              <span className={cx("min-w-0 flex-1 text-caption-1-semibold tabular-nums", item.available ? "text-text-primary" : "text-text-tertiary line-through")}>
                {item.label}
              </span>
              <span className="shrink-0 text-caption-2-regular text-text-tertiary">{item.note}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex items-center gap-2 border-t border-separator-border pt-2">
        <p role="status" aria-live="polite" className="min-w-0 flex-1 truncate text-caption-2-regular text-text-tertiary">
          {confirmed ? `Booked · ${selected.label}` : "Driver calls 30 minutes ahead."}
        </p>
        <button
          type="button"
          onClick={() => setConfirmed((value) => !value)}
          className={cx(confirmed ? secondaryButton : primaryButton, "h-6")}
        >
          {confirmed ? (
            <>
              <RiCheckLine className="size-3" aria-hidden />
              Confirmed
            </>
          ) : (
            <>
              Confirm
              <RiArrowRightLine className="size-3 rtl:-scale-x-100" aria-hidden />
            </>
          )}
        </button>
      </div>
    </section>
  );
}

/* 6. Carrier card */

const CARRIER_OPTIONS = [
  { id: "ground", name: "Ground", days: "3 days", eta: "Fri, Nov 7", rate: 14.8 },
  { id: "air", name: "2-Day Air", days: "2 days", eta: "Thu, Nov 6", rate: 28.4 },
  { id: "priority", name: "Priority", days: "1 day", eta: "Wed, Nov 5", rate: 46.2 },
] as const;

type CarrierId = (typeof CARRIER_OPTIONS)[number]["id"];

export function CarrierCard() {
  const [service, setService] = useState<CarrierId>("ground");
  const [booked, setBooked] = useState(false);
  const option = CARRIER_OPTIONS.find((item) => item.id === service) ?? CARRIER_OPTIONS[0];

  const choose = (id: CarrierId) => {
    setService(id);
    setBooked(false);
  };

  return (
    <section aria-label="Carrier rate" className={cx(cardBase, "flex flex-col")}>
      <div className="flex items-center gap-2">
        <IconTile icon={RiTruckLine} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-1-semibold text-text-primary">Meridian Freight</p>
          <p className="truncate text-caption-2-regular text-text-tertiary">Oakland → Reno · 2.4 lb · 18 × 12 × 6 in</p>
        </div>
        <StatusPill tone={booked ? "ok" : "neutral"}>{booked ? "Booked" : "Quote"}</StatusPill>
      </div>

      <div role="group" aria-label="Service level" className="mt-2 grid grid-cols-3 gap-1">
        {CARRIER_OPTIONS.map((item) => {
          const active = service === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => choose(item.id)}
              className={cx(
                "flex h-7 items-center justify-center rounded-md border px-1 text-caption-2-semibold",
                "transition-[background-color,border-color,color] duration-150 ease-out motion-reduce:transition-none",
                active
                  ? "border-accent-500 bg-accent-500/10 text-text-primary"
                  : "border-border-button-default bg-background-primary-default text-text-secondary hover:bg-background-primary-hover",
                focusRing,
              )}
            >
              {item.name}
            </button>
          );
        })}
      </div>

      <div key={service} className="mt-2 flex animate-label-in items-end justify-between gap-2 rounded-lg bg-background-secondary-default px-2 py-1.5 motion-reduce:animate-none">
        <div>
          <p className="text-caption-2-regular text-text-tertiary">Rate · {option.days}</p>
          <p className="text-title-3-semibold text-text-primary tabular-nums">{rate.format(option.rate)}</p>
        </div>
        <div className="text-end">
          <p className="text-caption-2-regular text-text-tertiary">Estimated arrival</p>
          <p className="text-caption-1-semibold text-text-primary">{option.eta}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setBooked(true)}
        disabled={booked}
        className={cx(booked ? secondaryButton : primaryButton, "mt-2 w-full")}
      >
        {booked ? (
          <>
            <RiCheckLine className="size-3" aria-hidden />
            Label booked · {option.name}
          </>
        ) : (
          <>
            {`Book label · ${rate.format(option.rate)}`}
            <RiArrowRightLine className="size-3 rtl:-scale-x-100" aria-hidden />
          </>
        )}
      </button>
    </section>
  );
}

/* 7. Packing list */

const PACK_ITEMS = [
  { id: "jacket", name: "Trail jacket", variant: "Slate · M", qty: 1 },
  { id: "socks", name: "Wool socks", variant: "Charcoal · L", qty: 3 },
  { id: "lamp", name: "Headlamp", variant: "400 lm", qty: 1 },
  { id: "drybag", name: "Dry bag", variant: "20 L", qty: 2 },
] as const;

type PackId = (typeof PACK_ITEMS)[number]["id"];

const PACK_START: Record<PackId, boolean> = { jacket: false, socks: true, lamp: true, drybag: false };
const PACK_TOTAL = PACK_ITEMS.reduce((total, item) => total + item.qty, 0);

export function PackingList() {
  const [packed, setPacked] = useState<Record<PackId, boolean>>(PACK_START);
  const [sealed, setSealed] = useState(false);
  const packedCount = PACK_ITEMS.reduce((total, item) => total + (packed[item.id] ? item.qty : 0), 0);
  const allPacked = packedCount === PACK_TOTAL;

  const toggle = (id: PackId) => {
    setPacked((current) => ({ ...current, [id]: !current[id] }));
    setSealed(false);
  };

  return (
    <section aria-label="Packing list for order NL-88214" className={cx(cardBase, "flex flex-col")}>
      <div className="flex items-center gap-2">
        <IconTile icon={RiFileList3Line} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-1-semibold text-text-primary">Packing list</p>
          <p className="truncate text-caption-2-regular text-text-tertiary">
            Order <bdi>NL-88214</bdi> · Box 2 of 2
          </p>
        </div>
        <StatusPill tone={sealed ? "ok" : allPacked ? "info" : "neutral"}>
          {sealed ? "Sealed" : `${packedCount}/${PACK_TOTAL}`}
        </StatusPill>
      </div>

      <ul className="mt-2 flex flex-col">
        {PACK_ITEMS.map((item) => {
          const checked = packed[item.id];
          return (
            <li key={item.id}>
              <button
                type="button"
                role="checkbox"
                aria-checked={checked}
                aria-label={`${item.name}, ${item.variant}, quantity ${item.qty}`}
                onClick={() => toggle(item.id)}
                className={cx(
                  "flex h-5 w-full items-center gap-2 rounded-md px-1 text-start",
                  "transition-[background-color] duration-150 ease-out hover:bg-background-secondary-default motion-reduce:transition-none",
                  focusRing,
                )}
              >
                <span
                  aria-hidden
                  className={cx(
                    "flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-[background-color,border-color,color] duration-150 ease-out motion-reduce:transition-none",
                    checked
                      ? "border-accent-600 bg-accent-600 text-text-white"
                      : "border-border-checkbox-default bg-background-primary-default",
                  )}
                >
                  {checked && (
                    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-2.5">
                      <path
                        d="M3.5 8.2 6.4 11 12.5 4.9"
                        className="animate-check-draw stroke-text-white"
                        strokeWidth="2.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        pathLength={1}
                      />
                    </svg>
                  )}
                </span>
                <span
                  className={cx(
                    "min-w-0 flex-1 truncate text-caption-1-medium transition-[color] duration-150 ease-out motion-reduce:transition-none",
                    checked ? "text-text-tertiary line-through" : "text-text-primary",
                  )}
                >
                  {item.name}
                  <span className="text-text-tertiary"> · {item.variant}</span>
                </span>
                <span className="shrink-0 rounded-full bg-background-tertiary-default px-1.5 text-caption-2-medium text-text-secondary tabular-nums">
                  ×{item.qty}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-1.5 flex items-center gap-2">
        <div
          role="progressbar"
          aria-label="Packing progress"
          aria-valuemin={0}
          aria-valuemax={PACK_TOTAL}
          aria-valuenow={packedCount}
          className="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-background-tertiary-default"
        >
          <div
            className={cx(
              "h-full rounded-full transition-[width,background-color] duration-200 ease-out motion-reduce:transition-none",
              allPacked ? "bg-status-lime-text" : "bg-accent-500",
            )}
            style={{ width: `${(packedCount / PACK_TOTAL) * 100}%` }}
          />
        </div>
        <span className="shrink-0 text-caption-2-regular text-text-tertiary tabular-nums">
          {packedCount} of {PACK_TOTAL} units
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <p aria-live="polite" className="min-w-0 flex-1 truncate text-caption-2-regular text-text-tertiary">
          {sealed ? "Box 2 sealed · 14:28" : allPacked ? "All lines checked. Ready to seal." : "Check each line before sealing."}
        </p>
        <button
          type="button"
          disabled={!allPacked || sealed}
          onClick={() => setSealed(true)}
          className={cx(sealed ? secondaryButton : primaryButton, "h-6")}
        >
          {sealed ? (
            <>
              <RiCheckLine className="size-3" aria-hidden />
              Sealed
            </>
          ) : (
            "Seal box"
          )}
        </button>
      </div>
    </section>
  );
}

/* 8. Return label */

const RETURN_REASONS = ["Wrong size", "Damaged in transit", "Changed my mind"] as const;

const BARCODE = [2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2] as const;

type PrintState = "idle" | "printing" | "printed";

export function ReturnLabel() {
  const selectId = useId();
  const [reason, setReason] = useState<(typeof RETURN_REASONS)[number]>("Wrong size");
  const [preview, setPreview] = useState(false);
  const [printState, setPrintState] = useState<PrintState>("idle");
  const previewRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasPreview = useRef(false);

  useEscape(preview, () => setPreview(false));

  useEffect(() => {
    if (printState !== "printing") return;
    const timer = window.setTimeout(() => setPrintState("printed"), 900);
    return () => window.clearTimeout(timer);
  }, [printState]);

  useEffect(() => {
    if (preview) closeRef.current?.focus();
    else if (wasPreview.current) previewRef.current?.focus();
    wasPreview.current = preview;
  }, [preview]);

  const print = () => {
    setPrintState("printing");
    setPreview(false);
  };
  const PrintIcon = printState === "printing" ? RiLoader4Line : printState === "printed" ? RiCheckLine : RiPrinterLine;

  return (
    <section aria-label="Return label RMA-3091" className={cx(cardBase, "flex flex-col")}>
      <div className="flex items-center gap-2">
        <IconTile icon={RiFileTextLine} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-1-semibold text-text-primary">Return label</p>
          <p className="truncate text-caption-2-regular text-text-tertiary"><bdi>RMA-3091</bdi> · Studio headphones</p>
        </div>
        <StatusPill tone={printState === "printed" ? "ok" : "neutral"}>{printState === "printed" ? "Printed" : "Draft"}</StatusPill>
      </div>

      {preview ? (
        <div role="dialog" aria-label="Return label preview" className="mt-2 animate-label-in rounded-lg border border-border-button-default bg-background-secondary-default p-2 motion-reduce:animate-none">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-caption-2-semibold tracking-wide text-text-tertiary uppercase">Return to</p>
              <p className="text-caption-1-semibold text-text-primary">Northline Returns</p>
              <p className="text-caption-2-regular text-text-secondary">4400 Ashby Ave, Oakland CA 94607</p>
            </div>
            <button ref={closeRef} type="button" aria-label="Close label preview" onClick={() => setPreview(false)} className={cx(iconButton, "-me-1 -mt-1")}>
              <RiCloseLine className="size-3.5" aria-hidden />
            </button>
          </div>
          <div className="mt-1.5 flex items-end justify-between gap-2 border-t border-separator-border pt-1.5">
            <div>
              <p className="text-caption-2-regular text-text-tertiary">RMA</p>
              <p className="text-caption-1-semibold text-text-primary tabular-nums">3091 · 1.2 lb</p>
            </div>
            <div aria-hidden className="flex h-5 items-stretch gap-[2px]">
              {BARCODE.map((width, index) => (
                <span key={`${width}-${index}`} className="bg-text-primary" style={{ width: `${width}px` }} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <button
          ref={previewRef}
          type="button"
          aria-haspopup="dialog"
          onClick={() => setPreview(true)}
          className={cx(
            "mt-2 flex items-center gap-2 rounded-lg border border-dashed border-border-button-default bg-background-secondary-default p-2 text-start",
            "transition-[background-color,border-color,opacity] duration-150 ease-out hover:border-accent-500 hover:bg-background-secondary-hover motion-reduce:transition-none",
            printState === "printing" && "opacity-60",
            focusRing,
          )}
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background-primary-default text-foreground-icon-secondary shadow-xs">
            <RiPrinterLine className="size-3.5" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-caption-1-semibold text-text-primary">Oakland, CA → Reno, NV</span>
            <span className="block truncate text-caption-2-regular text-text-tertiary">4 × 6 label · prepaid · {reason.toLowerCase()}</span>
          </span>
          <span className="shrink-0 text-caption-2-medium text-accent-500">Preview</span>
        </button>
      )}

      <div className="mt-2 flex items-center gap-1.5">
        <label htmlFor={selectId} className="shrink-0 text-caption-2-regular text-text-tertiary">
          Reason
        </label>
        <div className="relative min-w-0 flex-1">
          <select
            id={selectId}
            value={reason}
            onChange={(event) => {
              setReason(event.target.value as (typeof RETURN_REASONS)[number]);
              setPrintState("idle");
            }}
            className={cx(
              "h-6 w-full appearance-none rounded-md border border-border-button-default bg-background-primary-default ps-1.5 pe-5 text-caption-2-medium text-text-primary shadow-xs outline-none",
              focusRing,
            )}
          >
            {RETURN_REASONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <RiArrowDownSLine className="pointer-events-none absolute end-1 top-1/2 size-3 -translate-y-1/2 text-foreground-icon-tertiary" aria-hidden />
        </div>
        <button
          type="button"
          onClick={print}
          disabled={printState === "printing"}
          className={cx(printState === "printed" ? secondaryButton : primaryButton, "h-6")}
        >
          <PrintIcon className={cx("size-3", printState === "printing" && "animate-spin motion-reduce:animate-none")} aria-hidden />
          {printState === "printing" ? "Printing" : printState === "printed" ? "Printed" : "Print"}
        </button>
      </div>

      <p
        role="status"
        aria-live="polite"
        className={cx("mt-1.5 truncate text-caption-2-regular transition-[color] duration-200 ease-out motion-reduce:transition-none", printState === "printed" ? "text-status-lime-text" : "text-text-tertiary")}
      >
        {printState === "printing" ? "Sending to the label printer…" : printState === "printed" ? "Printed at 14:41 · drop at any pickup point." : "Return window closes Nov 18."}
      </p>
    </section>
  );
}

/* 9. Stock alert */

const REORDER_STEP = 60;

export function StockAlert() {
  const [quantity, setQuantity] = useState(120);
  const [po, setPo] = useState<string | null>(null);
  const total = quantity * 3.9;

  return (
    <section aria-label="Low stock alert" className={cx(cardBase, "flex flex-col")}>
      <div className="flex items-center gap-2">
        <IconTile icon={RiErrorWarningLine} tone="warn" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-1-semibold text-text-primary">Low stock</p>
          <p className="truncate text-caption-2-regular text-text-tertiary">
            AA batteries · 24-pack · <bdi>BAT-AA24</bdi>
          </p>
        </div>
        <StatusPill tone="warn">18 left</StatusPill>
      </div>

      <div className="mt-2 rounded-lg bg-background-secondary-default px-2 py-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-caption-2-regular text-text-tertiary">Below reorder point by</p>
          <p className="text-caption-2-semibold text-text-primary tabular-nums">32 units</p>
        </div>
        <div aria-hidden className="mt-1 h-1 overflow-hidden rounded-full bg-background-tertiary-default">
          <div className="h-full w-[36%] rounded-full bg-status-orange-text" />
        </div>
        <p className="mt-1 text-caption-2-regular text-text-tertiary">On hand 18 · Reorder at 50</p>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-caption-2-regular text-text-tertiary">Reorder quantity</p>
          <p className="text-caption-1-semibold text-text-primary tabular-nums">
            <span key={quantity} className="inline-block animate-number-fade motion-reduce:animate-none">
              {quantity}
            </span>{" "}
            units
          </p>
        </div>
        <StepperButton
          icon={RiSubtractLine}
          label="Decrease quantity by 60"
          disabled={quantity === REORDER_STEP || Boolean(po)}
          onClick={() => setQuantity((value) => Math.max(REORDER_STEP, value - REORDER_STEP))}
        />
        <StepperButton
          icon={RiAddLine}
          label="Increase quantity by 60"
          disabled={quantity === 480 || Boolean(po)}
          onClick={() => setQuantity((value) => Math.min(480, value + REORDER_STEP))}
        />
      </div>

      <div className="mt-2 flex items-center gap-2 border-t border-separator-border pt-2">
        <p aria-live="polite" className="min-w-0 flex-1 truncate text-caption-2-regular text-text-tertiary">
          {po ? (
            <span className="flex items-center gap-1 text-status-lime-text">
              <RiCheckLine className="size-3" aria-hidden />
              <bdi>{po}</bdi> · arrives Nov 8
            </span>
          ) : (
            <>{money.format(total)} · Volt Supply · 3-day lead</>
          )}
        </p>
        <button
          type="button"
          disabled={Boolean(po)}
          onClick={() => setPo("PO-7741")}
          className={cx(po ? secondaryButton : primaryButton, "h-6")}
        >
          {po ? (
            <>
              <RiCheckLine className="size-3" aria-hidden />
              Raised
            </>
          ) : (
            "Create PO"
          )}
        </button>
      </div>
    </section>
  );
}

/* 10. Dock schedule */

const DOCK_APPOINTMENTS = [
  { id: "cold", time: "06:30", carrier: "Merchants Cold Chain", bay: "02", note: "Reefer · 12 pallets", checked: true },
  { id: "ridge", time: "07:15", carrier: "Ridgeline Freight", bay: "01", note: "Dry goods · 6 pallets", checked: false },
  { id: "harbor", time: "08:00", carrier: "Harbor Line", bay: "04", note: "Late 10 min · 3 pallets", checked: false },
  { id: "pace", time: "09:30", carrier: "Pace Parcel", bay: "03", note: "Returns · 40 cartons", checked: false },
] as const;

type DockId = (typeof DOCK_APPOINTMENTS)[number]["id"];
type DockAppointment = {
  id: DockId;
  time: string;
  carrier: string;
  bay: string;
  note: string;
  checked: boolean;
};

export function DockSchedule() {
  const [appointments, setAppointments] = useState<DockAppointment[]>(() =>
    DOCK_APPOINTMENTS.map((item) => ({ ...item })),
  );
  const [selected, setSelected] = useState<DockId>("ridge");
  const active = appointments.find((item) => item.id === selected) ?? appointments[0];
  const onSite = appointments.filter((item) => item.checked).length;

  const checkIn = () => {
    setAppointments((current) => current.map((item) => (item.id === selected ? { ...item, checked: true } : item)));
  };

  return (
    <section aria-label="Dock schedule" className={cx(cardSurface, "max-w-[480px] p-2.5")}>
      <div className="flex items-center gap-2">
        <IconTile icon={RiTimeLine} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-1-semibold text-text-primary">Dock schedule</p>
          <p className="truncate text-caption-2-regular text-text-tertiary">Thu, Nov 6 · Building B · 4 appointments</p>
        </div>
        <StatusPill tone={onSite === appointments.length ? "ok" : "info"}>{onSite} of 4 on site</StatusPill>
      </div>

      <div className="mt-1.5 grid grid-cols-[38px_1fr_30px_62px] items-center gap-1 px-1 text-caption-2-regular text-text-tertiary">
        <span>Time</span>
        <span>Carrier</span>
        <span className="text-center">Bay</span>
        <span className="text-end">Status</span>
      </div>

      <ul aria-label="Dock appointments" className="mt-0.5 flex flex-col">
        {appointments.map((item) => {
          const isSelected = item.id === selected;
          const tone: Tone = item.checked ? "ok" : item.id === "harbor" ? "error" : item.id === "ridge" ? "info" : "neutral";
          const status = item.checked ? "At bay" : item.id === "harbor" ? "Late" : item.id === "ridge" ? "Due" : "Booked";
          return (
            <li key={item.id}>
              <button
                type="button"
                aria-pressed={isSelected}
                aria-label={`${item.time}, ${item.carrier}, bay ${item.bay}, ${status}`}
                onClick={() => setSelected(item.id)}
                className={cx(
                  "grid h-5 w-full grid-cols-[38px_1fr_30px_62px] items-center gap-1 rounded-md px-1 text-start ring-1 ring-inset",
                  "transition-[background-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                  isSelected ? "bg-accent-500/10 ring-accent-500/40" : "ring-transparent hover:bg-background-secondary-default",
                  focusRing,
                )}
              >
                <span className="text-caption-2-semibold text-text-primary tabular-nums">{item.time}</span>
                <span className="min-w-0 truncate text-caption-2-medium text-text-secondary">{item.carrier}</span>
                <span className="text-center text-caption-2-semibold text-text-primary tabular-nums">{item.bay}</span>
                <span className="flex justify-end">
                  <span className={cx("inline-flex items-center rounded-full px-1.5 py-0.5 text-caption-2-medium", TONE_SURFACE[tone])}>
                    {status}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-1.5 flex items-center gap-2 border-t border-separator-border pt-1.5">
        <div className="min-w-0 flex-1">
          <p aria-live="polite" className="truncate text-caption-2-medium text-text-primary">
            {active.time} · {active.carrier}
          </p>
          <p className="truncate text-caption-2-regular text-text-tertiary">
            Bay {active.bay} · {active.note}
          </p>
        </div>
        <button
          type="button"
          disabled={active.checked}
          onClick={checkIn}
          className={cx(active.checked ? secondaryButton : primaryButton, "h-6")}
        >
          {active.checked ? (
            <>
              <RiCheckLine className="size-3" aria-hidden />
              Checked in
            </>
          ) : (
            "Check in"
          )}
        </button>
      </div>
    </section>
  );
}

/* 11. Fleet status */

const FLEET = [
  { id: "van04", code: "Van 04", driver: "Ana Ruiz", status: "En route", tone: "ok" as Tone, ping: "1 min ago", detail: "I-880 N · 22 mph" },
  { id: "box12", code: "Box 12", driver: "Sam Okafor", status: "Idle", tone: "warn" as Tone, ping: "6 min ago", detail: "Depot 4 · Bay 3" },
  { id: "reefer07", code: "Reefer 07", driver: "Noor Haddad", status: "Service", tone: "error" as Tone, ping: "22 min ago", detail: "Ashford garage" },
] as const;

type FleetId = (typeof FLEET)[number]["id"];
type PingState = "idle" | "pinging" | "done";

export function FleetStatus() {
  const [selected, setSelected] = useState<FleetId>("van04");
  const [pingState, setPingState] = useState<PingState>("idle");
  const active = FLEET.find((item) => item.id === selected) ?? FLEET[0];

  useEffect(() => {
    if (pingState !== "pinging") return;
    const timer = window.setTimeout(() => setPingState("done"), 800);
    return () => window.clearTimeout(timer);
  }, [pingState]);

  return (
    <section aria-label="Fleet status" className={cx(cardBase, "flex flex-col")}>
      <div className="flex items-center gap-2">
        <IconTile icon={RiTruckLine} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-1-semibold text-text-primary">Fleet status</p>
          <p className="truncate text-caption-2-regular text-text-tertiary">3 vehicles · Depot 4</p>
        </div>
        <StatusPill tone={pingState === "done" ? "ok" : "neutral"}>
          {pingState === "pinging" ? "Pinging" : pingState === "done" ? "Live" : "3 tracked"}
        </StatusPill>
      </div>
      <span role="status" className="sr-only">
        {pingState === "pinging" ? "Pinging all vehicles." : pingState === "done" ? "All vehicles reported just now." : ""}
      </span>

      <ul aria-label="Vehicles" className="mt-1 flex flex-col">
        {FLEET.map((vehicle) => {
          const isSelected = vehicle.id === selected;
          return (
            <li key={vehicle.id}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelected(vehicle.id)}
                className={cx(
                  "flex h-8 w-full items-center gap-2 rounded-lg border px-1.5 text-start",
                  "transition-[background-color,border-color] duration-150 ease-out motion-reduce:transition-none",
                  isSelected
                    ? "border-accent-500 bg-accent-500/10"
                    : "border-transparent hover:bg-background-secondary-default",
                  focusRing,
                )}
              >
                <RiTruckLine className={cx("size-3.5 shrink-0", isSelected ? "text-accent-500" : "text-foreground-icon-tertiary")} aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-caption-1-semibold text-text-primary">
                    {vehicle.code} · <span className="text-text-secondary">{vehicle.driver}</span>
                  </span>
                  <span className="block truncate text-caption-2-regular text-text-tertiary">
                    {pingState === "pinging" ? "Pinging…" : pingState === "done" ? "just now" : vehicle.ping}
                  </span>
                </span>
                <StatusPill tone={vehicle.tone}>{vehicle.status}</StatusPill>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-1.5 flex items-center gap-2 border-t border-separator-border pt-1.5">
        <p className="min-w-0 flex-1 truncate text-caption-2-regular text-text-tertiary">
          {active.code} · {active.detail}
        </p>
        <button
          type="button"
          disabled={pingState === "pinging"}
          onClick={() => setPingState("pinging")}
          className={cx(quietButton, "h-6 px-1.5")}
        >
          <RiRefreshLine
            className={cx("size-3", pingState === "pinging" && "animate-spin motion-reduce:animate-none")}
            aria-hidden
          />
          Refresh pings
        </button>
      </div>
    </section>
  );
}

/* 12. Proof of delivery */

export function ProofOfDelivery() {
  const [signed, setSigned] = useState(false);
  const [photo, setPhoto] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const ready = signed && photo;

  return (
    <section aria-label="Proof of delivery for NL-88420" className={cx(cardBase, "flex flex-col")}>
      <div className="flex items-center gap-2">
        <IconTile icon={RiMapPinLine} tone={confirmed ? "accent" : "neutral"} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-1-semibold text-text-primary">Proof of delivery</p>
          <p className="truncate text-caption-2-regular text-text-tertiary">
            <bdi>NL-88420</bdi> · Maya Chen · 118 Harbour Way
          </p>
        </div>
        <StatusPill tone={confirmed ? "ok" : "neutral"}>{confirmed ? "Complete" : "Awaiting"}</StatusPill>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <button
          type="button"
          aria-pressed={photo}
          aria-label={photo ? "Remove delivery photo" : "Add delivery photo"}
          onClick={() => {
            setPhoto((value) => !value);
            setConfirmed(false);
          }}
          className={cx(
            "flex h-[58px] flex-col items-center justify-center gap-0.5 rounded-lg border border-dashed",
            "transition-[background-color,border-color,color] duration-150 ease-out motion-reduce:transition-none",
            photo
              ? "border-accent-500 bg-accent-500/10 text-accent-500"
              : "border-border-button-default bg-background-secondary-default text-foreground-icon-tertiary hover:border-accent-500 hover:text-accent-500",
            focusRing,
          )}
        >
          {photo ? <RiCheckLine className="size-4" aria-hidden /> : <RiCameraLine className="size-4" aria-hidden />}
          <span className="text-caption-2-medium">{photo ? "Porch · 14:32" : "Add photo"}</span>
        </button>

        <button
          type="button"
          aria-pressed={signed}
          aria-label={signed ? "Clear signature" : "Sign for delivery"}
          onClick={() => {
            setSigned((value) => !value);
            setConfirmed(false);
          }}
          className={cx(
            "flex h-[58px] flex-col items-center justify-center gap-0.5 rounded-lg border border-dashed",
            "transition-[background-color,border-color,color] duration-150 ease-out motion-reduce:transition-none",
            signed
              ? "border-accent-500 bg-accent-500/10 text-accent-500"
              : "border-border-button-default bg-background-secondary-default text-foreground-icon-tertiary hover:border-accent-500 hover:text-accent-500",
            focusRing,
          )}
        >
          {signed ? (
            <svg viewBox="0 0 84 26" fill="none" aria-hidden className="h-5 w-16">
              <path
                d="M3 20 C 13 5, 19 23, 28 13 S 42 3, 51 16 S 66 21, 80 7"
                className="animate-check-draw stroke-accent-500"
                strokeWidth="1.6"
                strokeLinecap="round"
                pathLength={1}
              />
            </svg>
          ) : (
            <RiQuillPenLine className="size-4" aria-hidden />
          )}
          <span className="text-caption-2-medium">{signed ? "M. Chen" : "Sign here"}</span>
        </button>
      </div>

      <div className="mt-2 flex items-center gap-2 border-t border-separator-border pt-2">
        <p aria-live="polite" className="min-w-0 flex-1 truncate text-caption-2-regular text-text-tertiary">
          {confirmed
            ? "POD-8842 filed · photo and signature attached."
            : !photo && !signed
              ? "Photo and signature are required."
              : !photo
                ? "Add a photo to finish."
                : !signed
                  ? "Recipient signature missing."
                  : "Ready to confirm."}
        </p>
        <button
          type="button"
          disabled={!ready || confirmed}
          onClick={() => setConfirmed(true)}
          className={cx(confirmed ? secondaryButton : primaryButton, "h-6")}
        >
          {confirmed ? (
            <>
              <RiCheckLine className="size-3" aria-hidden />
              Delivered
            </>
          ) : (
            "Confirm"
          )}
        </button>
        {confirmed && (
          <button type="button" aria-label="Undo delivery confirmation" onClick={() => setConfirmed(false)} className={cx(quietButton, "h-6 px-1")}>
            Undo
          </button>
        )}
      </div>
    </section>
  );
}

/* Specimens */

export const LOGISTICS_SECTION: ExtendedSection = {
  id: "logistics",
  title: "Logistics",
  blurb: "Shipments, stock and the last mile.",
  file: "logistics.tsx",
  entries: [
    { name: "Shipment Tracker", description: "Milestones from pickup to delivery with the current scan.", Demo: ShipmentTracker },
    { name: "Warehouse Row", description: "SKU, bin, on-hand and reorder point with live stock.", Demo: WarehouseRow },
    { name: "Inventory Count", description: "Counted against expected, with variance and reconcile.", Demo: InventoryCount },
    { name: "Route Map", description: "Five stops, a travelled line and the driver's live position.", Demo: RouteMap, wide: true },
    { name: "Delivery Window", description: "Pick a two-hour slot with availability and confirm.", Demo: DeliveryWindow },
    { name: "Carrier Card", description: "Service level, rate and arrival that update together.", Demo: CarrierCard },
    { name: "Packing List", description: "Check each line and watch the packed count climb.", Demo: PackingList },
    { name: "Return Label", description: "Reason, label preview and a print that lands.", Demo: ReturnLabel },
    { name: "Stock Alert", description: "Low stock with a suggested reorder quantity and cost.", Demo: StockAlert },
    { name: "Dock Schedule", description: "Appointments by time and bay, with check-in.", Demo: DockSchedule, wide: true },
    { name: "Fleet Status", description: "Vehicles, their status and the last ping received.", Demo: FleetStatus },
    { name: "Proof of Delivery", description: "Signature and photo placeholders with a confirm state.", Demo: ProofOfDelivery },
  ],
};
