"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import {
  RiArchiveLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiArrowRightSLine,
  RiArrowUpLine,
  RiBookmarkLine,
  RiCheckLine,
  RiCloseLine,
  RiCompass3Line,
  RiDeleteBinLine,
  RiErrorWarningLine,
  RiFileTextLine,
  RiFilter3Line,
  RiFlashlightLine,
  RiHeartPulseLine,
  RiHome5Line,
  RiLineChartLine,
  RiLoader4Line,
  RiLogoutBoxRLine,
  RiMessage3Line,
  RiMoonLine,
  RiMore2Line,
  RiRefreshLine,
  RiSearchLine,
  RiSendPlaneLine,
  RiShoppingBag3Line,
  RiTimeLine,
  RiUser3Line,
  RiUserAddLine,
  RiWifiLine,
} from "@remixicon/react";
import { useDirection } from "@/components/foundations/direction/direction";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* Shared mobile anatomy */

const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";
const screen = "relative flex h-44 w-full max-w-[300px] flex-col overflow-hidden rounded-3xl border border-border-button-default bg-background-primary-default shadow-card";
const panel = "w-full max-w-[300px] overflow-hidden rounded-3xl border border-border-button-default bg-background-primary-default shadow-card";
const scrim = "absolute inset-0 bg-text-primary/25 backdrop-blur-sm transition-opacity duration-200 ease-out motion-reduce:transition-none";

const primaryButton = cx(
  "inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-lg bg-button-primary px-2.5 text-caption-1-semibold text-text-white shadow-xs",
  "transition-[background-color,opacity,transform,scale] duration-150 ease-out hover:opacity-90 active:scale-[0.98]",
  "disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none motion-reduce:active:scale-100",
  focusRing,
);

const secondaryButton = cx(
  "inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-lg border border-border-button-default bg-background-primary-default px-2.5 text-caption-1-semibold text-text-primary shadow-xs",
  "transition-[background-color,border-color,color,transform,scale] duration-150 ease-out hover:bg-background-primary-hover active:scale-[0.98]",
  "disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none motion-reduce:active:scale-100",
  focusRing,
);

const dangerButton = cx(
  "inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-lg bg-button-danger px-2.5 text-caption-1-semibold text-text-white shadow-xs",
  "transition-[background-color,opacity,transform,scale] duration-150 ease-out hover:opacity-90 active:scale-[0.98]",
  "disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none motion-reduce:active:scale-100",
  focusRing,
);

const quietButton = cx(
  "inline-flex h-7 shrink-0 items-center gap-1 rounded-md px-1.5 text-caption-1-medium text-text-secondary",
  "transition-[background-color,color] duration-150 ease-out hover:bg-background-secondary-default hover:text-text-primary",
  "disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none",
  focusRing,
);

const iconButton = cx(
  "flex size-7 shrink-0 items-center justify-center rounded-full text-foreground-icon-secondary",
  "transition-[background-color,color] duration-150 ease-out hover:bg-background-tertiary-default hover:text-text-primary",
  "motion-reduce:transition-none",
  focusRing,
);

const sheetRow = cx(
  "flex h-8 w-full items-center gap-2 rounded-md px-2 text-start text-caption-1-medium text-text-primary",
  "transition-[background-color,color] duration-150 ease-out hover:bg-background-secondary-default motion-reduce:transition-none",
  focusRing,
);

function useEscape(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const handle = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [open, onClose]);
}

/** Arrow-key step for a horizontal tab list, mirrored for RTL. */
function tabStep(current: number, count: number, key: string, rtl: boolean) {
  if (key !== "ArrowLeft" && key !== "ArrowRight") return null;
  const forward = key === "ArrowRight" ? !rtl : rtl;
  return (current + (forward ? 1 : count - 1)) % count;
}

function SignalBars() {
  return (
    <span aria-hidden className="flex items-end gap-[2px]">
      {[3, 4, 5, 6].map((height, index) => (
        <span key={height} className={cx("w-[2px] rounded-full", index < 3 ? "bg-text-primary" : "bg-text-tertiary")} style={{ height }} />
      ))}
    </span>
  );
}

function BatteryMeter({ percent = 82, charging = false }: { percent?: number; charging?: boolean }) {
  return (
    <span aria-hidden className="flex items-center gap-1">
      {charging ? <RiFlashlightLine className="size-3 text-status-lime-text" /> : null}
      <span className="relative flex h-2.5 w-[18px] items-center rounded-[3px] border border-text-tertiary p-[1.5px]">
        <span
          className={cx("h-full rounded-[1px] transition-[width,background-color] duration-200 ease-out motion-reduce:transition-none", charging ? "bg-status-lime-text" : "bg-text-primary")}
          style={{ width: `${Math.max(8, Math.min(100, percent))}%` }}
        />
      </span>
      <span className="h-1 w-[2px] rounded-e-full bg-text-tertiary" />
    </span>
  );
}

function StatusBar({ battery = 82, charging = false, onBattery }: { battery?: number; charging?: boolean; onBattery?: () => void }) {
  return (
    <div className="relative flex h-7 shrink-0 items-end justify-between px-3.5 pb-1">
      <span className="sr-only">Status bar. 9:41. Strong signal. Wi-Fi connected.</span>
      <span aria-hidden className="text-caption-2-semibold text-text-primary tabular-nums">9:41</span>
      <span aria-hidden className="pointer-events-none absolute start-1/2 top-1 h-[9px] w-12 -translate-x-1/2 rounded-full bg-background-quaternary-default rtl:translate-x-1/2" />
      <span className="flex items-center gap-1.5 text-text-primary">
        <SignalBars />
        <RiWifiLine className="size-3.5" aria-hidden />
        {onBattery ? (
          <button
            type="button"
            aria-pressed={charging}
            aria-label={charging ? "Battery charging. Stop charging" : `Battery ${battery} percent. Start charging`}
            onClick={onBattery}
            className={cx("flex items-center rounded-sm p-1", focusRing)}
          >
            <BatteryMeter percent={battery} charging={charging} />
          </button>
        ) : (
          <BatteryMeter percent={battery} charging={charging} />
        )}
      </span>
    </div>
  );
}

function Phone({ label, children, status = true, className }: { label: string; children: ReactNode; status?: boolean; className?: string }) {
  return (
    <div role="group" aria-label={label} className={cx(screen, className)}>
      {status ? <StatusBar /> : null}
      <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

/* 1. Tab Bar */

const TAB_ITEMS = [
  { id: "today", label: "Today", icon: RiHome5Line, kicker: "Thursday, 5 November", title: "Lower body · 24 min", meta: "3 of 4 sets logged. Next at 18:00." },
  { id: "discover", label: "Discover", icon: RiCompass3Line, kicker: "Near you", title: "Riverside loop · 5.2 km", meta: "Easy pace, 42 min. Two friends are going." },
  { id: "saved", label: "Saved", icon: RiBookmarkLine, kicker: "6 saved", title: "Mobility for desk days", meta: "The 12-minute reset you keep coming back to." },
  { id: "you", label: "You", icon: RiUser3Line, kicker: "This week", title: "3 of 4 goals on track", meta: "Sleep is up 18 minutes from last week." },
] as const;

export function TabBar() {
  const baseId = useId();
  const [index, setIndex] = useState(0);
  const rtl = useDirection() === "rtl";
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = TAB_ITEMS[index];

  return (
    <Phone label={`Tab bar demo. ${active.label} tab selected.`}>
      <div role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-${active.id}`} className="flex flex-1 flex-col justify-center px-3.5 pb-1">
        <div key={active.id} className="animate-label-in motion-reduce:animate-none">
          <p className="text-caption-2-semibold tracking-wide text-accent-600 uppercase">{active.kicker}</p>
          <h3 className="mt-0.5 text-title-3-semibold text-text-primary">{active.title}</h3>
          <p className="mt-0.5 text-caption-1-regular text-text-secondary">{active.meta}</p>
        </div>
      </div>

      <div role="tablist" aria-label="App sections" className="relative mx-2 mb-2 grid shrink-0 grid-cols-4 rounded-2xl bg-background-secondary-default p-1">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-1 px-0.5 transition-[inset-inline-start] duration-200 ease-out motion-reduce:transition-none"
          style={{ width: "calc((100% - 8px) / 4)", insetInlineStart: `calc(4px + ${index} * ((100% - 8px) / 4))` }}
        >
          <span className="block h-full rounded-xl bg-background-primary-default shadow-xs" />
        </span>
        {TAB_ITEMS.map((item, position) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              ref={(element) => { refs.current[position] = element; }}
              id={`${baseId}-${item.id}`}
              type="button"
              role="tab"
              aria-selected={position === index}
              aria-controls={`${baseId}-panel`}
              tabIndex={position === index ? 0 : -1}
              onClick={() => setIndex(position)}
              onKeyDown={(event) => {
                const next = tabStep(position, TAB_ITEMS.length, event.key, rtl);
                if (next === null) return;
                event.preventDefault();
                setIndex(next);
                refs.current[next]?.focus();
              }}
              className={cx(
                "relative flex h-10 flex-col items-center justify-center gap-0.5 rounded-xl text-caption-2-medium",
                "transition-[color] duration-150 ease-out motion-reduce:transition-none",
                position === index ? "text-accent-600" : "text-text-tertiary hover:text-text-secondary",
                focusRing,
              )}
            >
              <Icon className="size-4" aria-hidden />
              {item.label}
            </button>
          );
        })}
      </div>
    </Phone>
  );
}

/* 2. Bottom Sheet */

const STAY_FILTERS = [
  { id: "price", label: "Under $250" },
  { id: "trail", label: "Walk to trail" },
  { id: "pets", label: "Pet friendly" },
  { id: "tub", label: "Hot tub" },
] as const;

export function BottomSheet() {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(["price", "pets"]);
  const [drag, setDrag] = useState(0);
  const dragStart = useRef<number | null>(null);
  const moved = useRef(false);
  const sheetRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = () => { setOpen(false); setDrag(0); triggerRef.current?.focus(); };

  useEscape(open, close);
  useEffect(() => { if (open) sheetRef.current?.focus(); }, [open]);

  const startDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    dragStart.current = event.clientY;
    moved.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (dragStart.current === null) return;
    const delta = event.clientY - dragStart.current;
    if (Math.abs(delta) > 4) moved.current = true;
    setDrag(Math.max(0, Math.min(120, delta)));
  };

  const endDrag = () => {
    if (dragStart.current === null) return;
    dragStart.current = null;
    if (drag > 48) close(); else setDrag(0);
  };

  const toggle = (id: string) => setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  return (
    <Phone label="Bottom sheet demo">
      <div className="flex flex-1 flex-col p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-caption-2-semibold tracking-wide text-accent-600 uppercase">Catskills</p>
            <h3 className="text-body-2-semibold text-text-primary">24 cabins this weekend</h3>
          </div>
          <button ref={triggerRef} type="button" aria-haspopup="dialog" aria-label={`Open filters, ${selected.length} selected`} onClick={() => setOpen(true)} className={cx(secondaryButton, "h-7 gap-1 px-2")}>
            <RiFilter3Line className="size-3.5" aria-hidden />
            {selected.length}
          </button>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {[{ name: "Cedar cabin", price: "$240" }, { name: "Pine loft", price: "$185" }].map((stay) => (
            <div key={stay.name} className="rounded-lg border border-separator-border bg-background-secondary-default p-1.5">
              <p className="truncate text-caption-2-semibold text-text-primary">{stay.name}</p>
              <p className="text-caption-2-regular text-text-tertiary">{stay.price} · 2 nights</p>
            </div>
          ))}
        </div>

        <p className="mt-auto text-caption-2-regular text-text-tertiary">{selected.length} filters · 24 stays fit</p>
      </div>

      <div aria-hidden={!open} className={cx("absolute inset-0 z-20", !open && "pointer-events-none")}>
        <button type="button" tabIndex={-1} aria-label="Close filters" onClick={close} className={cx(scrim, open ? "opacity-100" : "opacity-0")} />
        <section
          ref={sheetRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          inert={!open}
          className={cx(
            "absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-border-button-default bg-background-primary-default pb-2.5 shadow-dropdown",
            "transition-transform duration-200 ease-out motion-reduce:transition-none",
            open ? "translate-y-0" : "translate-y-full",
            focusRing,
          )}
          style={open ? { transform: `translateY(${drag}px)`, transition: dragStart.current !== null ? "none" : undefined } : undefined}
        >
          <button
            type="button"
            aria-label="Drag down or activate to close filters"
            onClick={() => {
              if (moved.current) {
                moved.current = false;
                return;
              }
              close();
            }}
            onPointerDown={startDrag}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className={cx("mx-auto flex h-4 w-20 touch-none cursor-grab items-center justify-center rounded-sm active:cursor-grabbing", focusRing)}
          >
            <span className="h-1 w-8 rounded-full bg-background-quaternary-default" />
          </button>

          <div className="px-3.5">
            <div className="flex items-baseline justify-between gap-2">
              <h3 id={titleId} className="text-body-2-semibold text-text-primary">Filters</h3>
              <span className="text-caption-2-regular text-text-tertiary">24 stays match</span>
            </div>

            <div role="group" aria-label="Stay filters" className="mt-1 grid grid-cols-2 gap-1">
              {STAY_FILTERS.map((filter) => {
                const active = selected.includes(filter.id);
                return (
                  <button
                    key={filter.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggle(filter.id)}
                    className={cx(
                      "h-6 rounded-full border px-2 text-caption-2-medium",
                      "transition-[background-color,border-color,color] duration-150 ease-out motion-reduce:transition-none",
                      active
                        ? "border-accent-500 bg-accent-50 text-accent-700"
                        : "border-border-button-default bg-background-primary-default text-text-secondary hover:bg-background-primary-hover",
                      focusRing,
                    )}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-1.5 flex items-center gap-1.5">
              <button type="button" onClick={() => setSelected([])} className={cx(quietButton, "h-7")}>Reset</button>
              <button type="button" onClick={close} className={cx(primaryButton, "h-7 flex-1")}>Show 24 stays</button>
            </div>
          </div>
        </section>
      </div>
    </Phone>
  );
}

/* 3. Action Sheet */

export function ActionSheet() {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"options" | "confirm">("options");
  const [left, setLeft] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    setStep("options");
    triggerRef.current?.focus();
  };

  const openOptions = () => {
    setStep("options");
    setOpen(true);
  };

  useEscape(open, close);

  useEffect(() => {
    if (open) sheetRef.current?.focus();
  }, [open]);

  const transfer = () => {
    setNote("Transfer request sent to Priya.");
    close();
  };

  const confirmLeave = () => {
    setLeft(true);
    setNote(null);
    close();
  };

  return (
    <Phone label="Action sheet demo">
      <div className="flex flex-1 flex-col p-3">
        <div className="flex items-center gap-2">
          <span aria-hidden className="flex size-8 items-center justify-center rounded-lg bg-accent-600 text-caption-2-semibold text-text-white">RP</span>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-body-2-semibold text-text-primary">Rally Point</h3>
            <p className="text-caption-2-regular text-text-tertiary">12 boards · 5 members</p>
          </div>
          <button ref={triggerRef} type="button" aria-haspopup="dialog" aria-label="Open project options" onClick={openOptions} className={cx(secondaryButton, "size-7 px-0")}>
            <RiMore2Line className="size-4" aria-hidden />
          </button>
        </div>

        <div className="mt-2 rounded-lg border border-separator-border bg-background-secondary-default px-2 py-1.5">
          <p className="text-caption-2-semibold text-text-primary">Your access</p>
          <p className="text-caption-2-regular text-text-tertiary">Editor · joined March 2024</p>
        </div>

        <div className="mt-auto" aria-live="polite">
          {left ? (
            <div className="flex items-center justify-between gap-2 rounded-lg bg-background-secondary-default px-2 py-1.5">
              <span className="min-w-0 flex-1 truncate text-caption-2-medium text-text-secondary">You left Rally Point.</span>
              <button type="button" onClick={() => setLeft(false)} className={cx(quietButton, "h-6")}>Undo</button>
            </div>
          ) : note ? (
            <div className="flex items-center justify-between gap-2 rounded-lg bg-background-secondary-default px-2 py-1.5">
              <span className="min-w-0 flex-1 truncate text-caption-2-medium text-text-secondary">{note}</span>
              <button type="button" aria-label="Dismiss notice" onClick={() => setNote(null)} className={iconButton}>
                <RiCloseLine className="size-3" aria-hidden />
              </button>
            </div>
          ) : (
            <button type="button" aria-haspopup="dialog" onClick={openOptions} className={cx(quietButton, "h-6")}>
              <RiMore2Line className="size-3.5" aria-hidden />
              Project options
            </button>
          )}
        </div>
      </div>

      <div aria-hidden={!open} className={cx("absolute inset-0 z-20", !open && "pointer-events-none")}>
        <button type="button" tabIndex={-1} aria-label="Close project options" onClick={close} className={cx(scrim, open ? "opacity-100" : "opacity-0")} />
        <div
          ref={sheetRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          inert={!open}
          className={cx(
            "absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-border-button-default bg-background-primary-default pb-2 shadow-dropdown",
            "transition-transform duration-200 ease-out motion-reduce:transition-none",
            open ? "translate-y-0" : "translate-y-full",
            focusRing,
          )}
        >
          <div className="px-3 pb-2 pt-2">
            <div className="flex items-center justify-between gap-2">
              <h3 id={titleId} className="text-body-2-semibold text-text-primary">
                {step === "options" ? "Project options" : "Leave this project?"}
              </h3>
              <button type="button" aria-label="Close project options" onClick={close} className={cx(iconButton, "size-6")}>
                <RiCloseLine className="size-3.5" aria-hidden />
              </button>
            </div>

            {step === "options" ? (
              <div className="mt-1 flex flex-col gap-0.5">
                <button type="button" onClick={transfer} className={cx(sheetRow, "h-7")}>
                  <RiUserAddLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
                  Transfer ownership
                </button>
                <button type="button" onClick={() => setStep("confirm")} className={cx(sheetRow, "h-7 text-text-destructive")}>
                  <RiLogoutBoxRLine className="size-4 shrink-0" aria-hidden />
                  Leave project
                </button>
                <button type="button" onClick={close} className={cx(secondaryButton, "mt-1 h-7 w-full")}>Cancel</button>
              </div>
            ) : (
              <div className="animate-label-in motion-reduce:animate-none">
                <div className="mt-1 flex items-start gap-2">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-status-rose-background text-status-rose-text">
                    <RiErrorWarningLine className="size-3.5" aria-hidden />
                  </span>
                  <p className="text-caption-1-regular text-text-secondary">
                    You&rsquo;ll lose access to 12 boards and 3 drafts. Owners keep the work.
                  </p>
                </div>
                <div className="mt-2 flex gap-1.5">
                  <button type="button" onClick={close} className={cx(secondaryButton, "h-8 flex-1")}>Keep my seat</button>
                  <button type="button" onClick={confirmLeave} className={cx(dangerButton, "h-8 flex-1")}>Leave project</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Phone>
  );
}

/* 4. Swipe Row */

const REVEAL = 96;

export function SwipeRow() {
  const rtl = useDirection() === "rtl";
  const [open, setOpen] = useState(false);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [state, setState] = useState<"idle" | "archived" | "deleted">("idle");
  const startX = useRef<number | null>(null);
  const startAt = useRef(0);
  const moved = useRef(false);

  useEscape(open, () => setOpen(false));

  const start = (event: ReactPointerEvent<HTMLDivElement>) => {
    startX.current = event.clientX;
    startAt.current = open ? REVEAL : 0;
    moved.current = false;
    setDrag(startAt.current);
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const move = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    const delta = rtl ? event.clientX - startX.current : startX.current - event.clientX;
    if (Math.abs(delta) > 4) moved.current = true;
    setDrag(Math.max(0, Math.min(REVEAL, startAt.current + delta)));
  };

  const settle = () => {
    if (startX.current === null) return;
    startX.current = null;
    setDragging(false); setOpen(drag > REVEAL / 2); setDrag(0);
  };

  const reset = () => { setState("idle"); setOpen(false); setDrag(0); };

  return (
    <div className="w-full max-w-[300px]">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Messages</h3>
        <span className="text-caption-2-medium text-text-tertiary">3 unread</span>
      </div>

      <div className="relative mt-1 overflow-hidden rounded-xl border border-border-button-default bg-background-secondary-default shadow-xs">
        <div aria-hidden={!open} className="absolute inset-y-0 end-0 flex w-24">
          <button
            type="button"
            tabIndex={open ? 0 : -1}
            aria-label="Archive Maya Chen's message"
            onClick={() => {
              setState("archived");
              setOpen(false);
            }}
            className={cx(
              "flex flex-1 flex-col items-center justify-center gap-0.5 bg-background-secondary-default text-caption-2-semibold text-text-secondary",
              "transition-colors duration-150 ease-out hover:bg-background-secondary-hover motion-reduce:transition-none",
              focusRing,
            )}
          >
            <RiArchiveLine className="size-4" aria-hidden />
            Archive
          </button>
          <button
            type="button"
            tabIndex={open ? 0 : -1}
            aria-label="Delete Maya Chen's message"
            onClick={() => {
              setState("deleted");
              setOpen(false);
            }}
            className={cx(
              "flex flex-1 flex-col items-center justify-center gap-0.5 bg-background-tertiary-error text-caption-2-semibold text-text-error-primary",
              "transition-colors duration-150 ease-out hover:bg-background-quaternary-error motion-reduce:transition-none",
              focusRing,
            )}
          >
            <RiDeleteBinLine className="size-4" aria-hidden />
            Delete
          </button>
        </div>

        {state === "idle" ? (
          <div
            role="group"
            aria-label="Message from Maya Chen"
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={settle}
            onPointerCancel={settle}
            onClick={() => {
              if (moved.current) {
                moved.current = false;
                return;
              }
              if (open) setOpen(false);
            }}
            className={cx(
              "relative flex h-14 touch-pan-y items-center gap-2 bg-background-primary-default px-2.5 select-none",
              !dragging && "transition-transform duration-200 ease-out motion-reduce:transition-none",
            )}
            style={{ transform: `translateX(${(rtl ? 1 : -1) * (dragging ? drag : open ? REVEAL : 0)}px)` }}
          >
            <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-100 text-caption-2-semibold text-accent-700">MC</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-caption-1-semibold text-text-primary">Maya Chen</span>
                <span className="shrink-0 text-caption-2-regular text-text-tertiary">9:12</span>
              </div>
              <p className="truncate text-caption-2-regular text-text-secondary">Sent the Q4 deck for review.</p>
            </div>
            <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-accent-500" />
            <button
              type="button"
              aria-label={open ? "Hide message actions" : "Show message actions"}
              aria-expanded={open}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                setOpen((current) => !current);
              }}
              className={iconButton}
            >
              <RiMore2Line className="size-4" aria-hidden />
            </button>
          </div>
        ) : (
          <div aria-live="polite" className="flex h-14 animate-label-in items-center justify-between gap-2 bg-background-primary-default px-2.5 motion-reduce:animate-none">
            <span className="flex min-w-0 items-center gap-1.5 text-caption-1-medium text-text-secondary">
              <RiCheckLine className="size-4 shrink-0 text-status-lime-text" aria-hidden />
              <span className="truncate">{state === "archived" ? "Archived 1 conversation" : "Deleted 1 conversation"}</span>
            </span>
            <button type="button" onClick={reset} className={cx(quietButton, "h-7")}>Undo</button>
          </div>
        )}
      </div>

      <p className="mt-1.5 text-caption-2-regular text-text-tertiary">Swipe the row, or use the actions button.</p>
    </div>
  );
}

/* 5. Pull to Refresh */

export function PullToRefresh() {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshed, setRefreshed] = useState(false);
  const [added, setAdded] = useState(false);
  const startY = useRef<number | null>(null);

  useEffect(() => {
    if (!refreshing) return;
    const timer = window.setTimeout(() => {
      setRefreshing(false);
      setRefreshed(true);
      setAdded(true);
      setPull(0);
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [refreshing]);

  const refresh = () => {
    if (refreshing) return;
    setRefreshed(false);
    setRefreshing(true);
    setPull(24);
  };

  const start = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (refreshing) return;
    startY.current = event.clientY;
    setRefreshed(false);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const move = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (startY.current === null) return;
    setPull(Math.max(0, Math.min(34, (event.clientY - startY.current) * 0.6)));
  };

  const settle = () => {
    if (startY.current === null) return;
    startY.current = null;
    if (pull >= 26) refresh();
    else setPull(0);
  };

  const rows = [
    ...(added ? [{ id: "priya", name: "Priya Nair", line: "Approved the Q3 budget", new: true }] : []),
    { id: "nadia", name: "Nadia Ruiz", line: "Shared the Q3 recap", new: true },
    { id: "kitchen", name: "Kitchen rota", line: "You are on Friday this week", new: false },
  ].slice(0, 3);

  return (
    <Phone label="Pull to refresh demo">
      <div className="flex h-7 shrink-0 items-center justify-between px-3">
        <span className="text-caption-1-semibold text-text-primary">Inbox</span>
        <button type="button" aria-label="Refresh inbox" disabled={refreshing} onClick={refresh} className={cx(iconButton, "size-6 disabled:pointer-events-none disabled:opacity-40")}>
          <RiRefreshLine className={cx("size-3.5", refreshing && "animate-spin motion-reduce:animate-none")} aria-hidden />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 touch-pan-x flex-col" onPointerDown={start} onPointerMove={move} onPointerUp={settle} onPointerCancel={settle}>
        <div className="flex shrink-0 items-center justify-center overflow-hidden" style={{ height: refreshing ? 24 : pull }}>
          <div className={cx("flex items-center gap-1.5 transition-opacity duration-150 ease-out motion-reduce:transition-none", pull > 8 || refreshing ? "opacity-100" : "opacity-0")}>
            <RiLoader4Line
              aria-hidden
              className={cx("size-4 text-foreground-icon-secondary", refreshing && "animate-spin motion-reduce:animate-none")}
              style={refreshing ? undefined : { transform: `rotate(${pull * 4}deg)` }}
            />
            <span className="text-caption-2-regular text-text-tertiary">
              {refreshing ? "Refreshing…" : pull >= 26 ? "Release to refresh" : "Pull to refresh"}
            </span>
          </div>
        </div>

        <ul aria-live="polite" className="flex min-h-0 flex-1 flex-col justify-center overflow-hidden px-3">
          {rows.map((row) => (
            <li key={row.id} className={cx("flex h-6 items-center gap-1.5 border-b border-separator-border last:border-b-0", row.id === "priya" && "animate-label-in motion-reduce:animate-none")}>
              <span aria-hidden className={cx("size-1.5 shrink-0 rounded-full", row.new ? "bg-accent-500" : "bg-background-quaternary-default")} />
              <span className="min-w-0 flex-1 truncate text-caption-2-regular text-text-primary">{row.name} · {row.line}</span>
            </li>
          ))}
        </ul>

        <p aria-live="polite" className="px-3 pb-1 text-caption-2-regular text-text-tertiary">
          {refreshing ? "Checking for new messages…" : refreshed ? "Updated just now · 2 new" : "Pull down from the top to refresh."}
        </p>
      </div>
    </Phone>
  );
}

/* 6. Status Bar */

export function StatusBarChrome() {
  const [charging, setCharging] = useState(false);

  return (
    <Phone label="Status bar demo" status={false}>
      <StatusBar battery={82} charging={charging} onBattery={() => setCharging((current) => !current)} />

      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <p className="text-caption-2-medium tracking-wide text-text-tertiary uppercase">Thursday, 5 November</p>
        <p className="text-display-4-semibold text-text-primary tabular-nums">9:41</p>
        <div className="mt-1 flex h-5 items-center gap-1 rounded-full bg-background-secondary-default px-2 text-caption-2-medium text-text-secondary">
          {charging ? <RiFlashlightLine className="size-3 text-status-lime-text" aria-hidden /> : <RiMoonLine className="size-3 text-text-tertiary" aria-hidden />}
          <span aria-live="polite">{charging ? "Charging · 82%" : "Focus until 18:00"}</span>
        </div>
      </div>

      <p className="pb-1.5 text-center text-caption-2-regular text-text-tertiary">
        {charging ? "Cable connected. Tap the battery to unplug." : "Tap the battery to plug in."}
      </p>
    </Phone>
  );
}

/* 7. Segmented Tabs */

const PERIODS = [
  { id: "day", label: "Day", value: "$1,280", delta: "8.2% vs Wednesday", note: "18 orders · 4 refunds", bars: [38, 52, 44, 68, 58, 82, 74] },
  { id: "week", label: "Week", value: "$8,940", delta: "12.4% vs last week", note: "132 orders · 6 refunds", bars: [46, 64, 58, 76, 70, 88, 81] },
  { id: "month", label: "Month", value: "$34,120", delta: "4.1% vs October", note: "540 orders · 21 refunds", bars: [54, 48, 66, 62, 78, 72, 90] },
] as const;

export function SegmentedTabs() {
  const baseId = useId();
  const [index, setIndex] = useState(1);
  const rtl = useDirection() === "rtl";
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = PERIODS[index];

  return (
    <div className={cx(panel, "p-3")}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-caption-2-regular text-text-tertiary">Payouts</p>
          <h3 className="text-body-2-semibold text-text-primary">Revenue</h3>
        </div>
        <span className="rounded-full bg-background-secondary-default px-1.5 py-0.5 text-caption-2-medium text-text-tertiary">USD</span>
      </div>

      <div role="tablist" aria-label="Revenue period" className="relative mt-2 grid grid-cols-3 rounded-lg bg-background-secondary-default p-0.5">
        <span
          aria-hidden
          className="absolute inset-y-0.5 rounded-md bg-background-primary-default shadow-xs transition-[inset-inline-start] duration-200 ease-out motion-reduce:transition-none"
          style={{ width: "calc((100% - 4px) / 3)", insetInlineStart: `calc(${index} * ((100% - 4px) / 3) + 2px)` }}
        />
        {PERIODS.map((period, position) => (
          <button
            key={period.id}
            ref={(element) => { refs.current[position] = element; }}
            id={`${baseId}-${period.id}`}
            type="button"
            role="tab"
            aria-selected={position === index}
            aria-controls={`${baseId}-panel`}
            tabIndex={position === index ? 0 : -1}
            onClick={() => setIndex(position)}
            onKeyDown={(event) => {
              const next = tabStep(position, PERIODS.length, event.key, rtl);
              if (next === null) return;
              event.preventDefault();
              setIndex(next);
              refs.current[next]?.focus();
            }}
            className={cx(
              "relative z-10 h-7 rounded-md text-caption-1-semibold transition-[color] duration-150 ease-out motion-reduce:transition-none",
              position === index ? "text-text-primary" : "text-text-tertiary hover:text-text-secondary",
              focusRing,
            )}
          >
            {period.label}
          </button>
        ))}
      </div>

      <div key={active.id} id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-${active.id}`} className="mt-2 flex animate-label-in items-end justify-between gap-3 motion-reduce:animate-none">
        <div className="min-w-0">
          <p className="text-title-2-semibold text-text-primary tabular-nums">{active.value}</p>
          <p className="flex items-center gap-0.5 text-caption-2-medium text-status-lime-text">
            <RiArrowUpLine className="size-3" aria-hidden />
            {active.delta}
          </p>
          <p className="truncate text-caption-2-regular text-text-tertiary">{active.note}</p>
        </div>
        <div aria-hidden className="flex h-10 items-end gap-1">
          {active.bars.map((height, position) => (
            <span key={position} className="w-1.5 rounded-full bg-accent-500/80 transition-[height] duration-200 ease-out motion-reduce:transition-none" style={{ height: `${height}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* 8. Bottom Nav */

const DESTINATIONS = [
  { id: "home", label: "Home", icon: RiHome5Line, title: "Good evening, Rowan", meta: "3 orders are on the way.", badge: 0 },
  { id: "search", label: "Search", icon: RiSearchLine, title: "Find a refill", meta: "128 kits near you, ready today.", badge: 0 },
  { id: "orders", label: "Orders", icon: RiShoppingBag3Line, title: "Your orders", meta: "1 arriving · 2 scheduled.", badge: 3 },
  { id: "inbox", label: "Inbox", icon: RiMessage3Line, title: "Messages", meta: "The studio replied 4 minutes ago.", badge: 0 },
  { id: "you", label: "You", icon: RiUser3Line, title: "Your account", meta: "Gold member · 1,240 points.", badge: 0 },
] as const;

export function BottomNav() {
  const [index, setIndex] = useState(0);
  const active = DESTINATIONS[index];

  return (
    <Phone label={`Bottom nav demo. ${active.label} destination selected.`}>
      <div className="flex flex-1 flex-col justify-center px-3.5 pb-1">
        <div key={active.id} className="animate-label-in motion-reduce:animate-none">
          <p className="text-caption-2-semibold tracking-wide text-accent-600 uppercase">{active.label}</p>
          <h3 className="mt-0.5 text-title-3-semibold text-text-primary">{active.title}</h3>
          <p className="mt-0.5 text-caption-1-regular text-text-secondary">{active.meta}</p>
        </div>
      </div>

      <nav aria-label="Primary" className="mx-2 mb-2 grid shrink-0 grid-cols-5 rounded-2xl bg-background-secondary-default p-1">
        {DESTINATIONS.map((item, position) => {
          const Icon = item.icon;
          const current = position === index;
          return (
            <button
              key={item.id}
              type="button"
              aria-current={current ? "page" : undefined}
              aria-label={item.badge ? `${item.label}, ${item.badge} new orders` : item.label}
              onClick={() => setIndex(position)}
              className={cx(
                "relative flex h-10 flex-col items-center justify-center gap-0.5 rounded-xl text-caption-2-medium",
                "transition-[color] duration-150 ease-out motion-reduce:transition-none",
                current ? "text-accent-600" : "text-text-tertiary hover:text-text-secondary",
                focusRing,
              )}
            >
              <span
                className={cx(
                  "relative flex size-6 items-center justify-center rounded-full",
                  "transition-[background-color,box-shadow,transform,translate] duration-200 ease-out motion-reduce:transition-none",
                  current ? "-translate-y-0.5 bg-background-primary-default shadow-xs" : "bg-transparent",
                )}
              >
                <Icon className="size-4" aria-hidden />
                {item.badge ? (
                  <span className="absolute -top-0.5 end-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-status-rose-text px-0.5 text-caption-2-semibold text-text-white">
                    {item.badge}
                    <span className="sr-only"> new orders</span>
                  </span>
                ) : null}
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>
    </Phone>
  );
}

/* 9. Mobile Toast */

const TOAST_ROWS = [
  { id: "maya", name: "Maya Chen", line: "Q3 planning · 12 messages" },
  { id: "guild", name: "Design guild", line: "Friday critique · 8 messages" },
  { id: "ari", name: "Ari Okafor", line: "Lease renewal · 3 messages" },
];

export function MobileToast() {
  const [visible, setVisible] = useState(true);
  const [archived, setArchived] = useState(true);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(() => setVisible(false), 6000);
    return () => window.clearTimeout(timer);
  }, [visible, cycle]);

  const replay = () => {
    setArchived(true);
    setVisible(true);
    setCycle((current) => current + 1);
  };

  return (
    <Phone label="Mobile toast demo">
      <div className="flex h-8 shrink-0 items-center justify-between px-3">
        <span className="text-caption-1-semibold text-text-primary">Inbox</span>
        <span className="text-caption-2-regular text-text-tertiary">12 threads</span>
      </div>

      <ul className="flex min-h-0 flex-1 flex-col justify-center px-3">
        {TOAST_ROWS.map((row) => (
          <li key={row.id} className={cx("flex h-6 items-center gap-2 border-b border-separator-border last:border-b-0 transition-opacity duration-200 ease-out motion-reduce:transition-none", row.id === "maya" && archived && "opacity-40")}>
            <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-background-quaternary-default" />
            <span className={cx("min-w-0 flex-1 truncate text-caption-2-regular text-text-primary", row.id === "maya" && archived && "line-through")}>
              {row.name} · {row.line}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex h-8 shrink-0 items-center justify-between gap-2 border-t border-separator-border px-3">
        <span aria-live="polite" className="truncate text-caption-2-regular text-text-tertiary">
          {archived ? "1 conversation archived" : "Restored to your inbox"}
        </span>
        <button type="button" onClick={replay} className={cx(quietButton, "h-6")}>
          <RiRefreshLine className="size-3" aria-hidden />
          Replay
        </button>
      </div>

      <div aria-live="polite" aria-atomic="true" className="pointer-events-none absolute inset-x-2 top-2 z-10">
        <div
          inert={!visible}
          aria-hidden={!visible}
          className={cx(
            "pointer-events-auto flex items-center gap-2 rounded-2xl border border-border-button-default bg-background-primary-default px-2.5 py-2 shadow-dropdown",
            "transition-[opacity,transform,translate] duration-200 ease-out motion-reduce:transition-none",
            visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0",
          )}
        >
          <span aria-hidden className="flex size-6 shrink-0 items-center justify-center rounded-full bg-status-lime-background text-status-lime-text">
            <RiArchiveLine className="size-3.5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-caption-1-semibold text-text-primary">Archived &ldquo;Q3 planning&rdquo;</p>
            <p className="truncate text-caption-2-regular text-text-tertiary">Maya Chen · 12 messages</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setArchived(false);
              setVisible(false);
            }}
            className={cx("rounded-md px-1 py-0.5 text-caption-1-semibold text-accent-600", focusRing)}
          >
            Undo
          </button>
          <button type="button" aria-label="Dismiss notification" onClick={() => setVisible(false)} className={cx("flex size-6 items-center justify-center rounded-full text-foreground-icon-tertiary", focusRing)}>
            <RiCloseLine className="size-3.5" aria-hidden />
          </button>
        </div>
      </div>
    </Phone>
  );
}

/* 10. Search Overlay */

const NOTE_ROWS = [
  { id: "launch", name: "Launch brief", meta: "Edited 2h ago" },
  { id: "retro", name: "Q3 retro", meta: "6 comments" },
  { id: "travel", name: "Travel receipts", meta: "Shared with Ari" },
];

export function SearchOverlay() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [lastSearch, setLastSearch] = useState<string | null>(null);
  const [recent, setRecent] = useState(["quarterly planning", "Maya Chen"]);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = () => { setOpen(false); triggerRef.current?.focus(); };
  const openSearch = () => { setQuery(""); setOpen(true); };
  const submit = () => {
    const term = query.trim();
    if (!term) return;
    setLastSearch(term);
    close();
  };

  useEscape(open, close);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  const matches = recent.filter((item) => item.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <Phone label="Search overlay demo">
      <div className="flex flex-1 flex-col px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-body-2-semibold text-text-primary">Notes</h3>
          <button ref={triggerRef} type="button" aria-haspopup="dialog" onClick={openSearch} className={cx(secondaryButton, "h-7 gap-1 px-2 text-caption-2-semibold")}>
            <RiSearchLine className="size-3" aria-hidden />
            Search
          </button>
        </div>

        <ul className="mt-1.5 flex flex-1 flex-col justify-center">
          {NOTE_ROWS.map((note) => (
            <li key={note.id} className="flex h-6 items-center gap-2 border-b border-separator-border last:border-b-0">
              <RiFileTextLine className="size-3.5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
              <span className="min-w-0 flex-1 truncate text-caption-2-regular text-text-primary">{note.name}</span>
              <span className="shrink-0 text-caption-2-regular text-text-tertiary">{note.meta}</span>
            </li>
          ))}
        </ul>

        <p className="truncate text-caption-2-regular text-text-tertiary" aria-live="polite">
          {lastSearch ? `14 results for “${lastSearch}”` : "1,204 notes · 12 folders"}
        </p>
      </div>

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search notes"
        inert={!open}
        className={cx(
          "absolute inset-0 z-20 flex flex-col bg-background-primary-default p-2",
          "transition-[opacity,transform,translate] duration-200 ease-out motion-reduce:transition-none",
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <div className="flex shrink-0 items-center gap-1">
          <button type="button" aria-label="Close search" onClick={close} className={cx(iconButton, "size-7")}>
            <RiArrowLeftLine className="size-4 rtl:-scale-x-100" aria-hidden />
          </button>
          <div className="flex h-7 min-w-0 flex-1 items-center gap-1.5 rounded-lg bg-background-tertiary-default px-2 focus-within:ring-2 focus-within:ring-border-focus-ring">
            <RiSearchLine className="size-3.5 shrink-0 text-foreground-icon-secondary" aria-hidden />
            <input
              ref={inputRef}
              type="search"
              value={query}
              aria-label="Search notes"
              placeholder="Search 1,204 notes"
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key !== "Enter") return;
                event.preventDefault();
                submit();
              }}
              className="min-w-0 flex-1 bg-transparent p-0 text-caption-1-medium text-text-primary outline-none placeholder:text-text-placeholder [&::-webkit-search-cancel-button]:appearance-none"
            />
            {query ? (
              <button type="button" aria-label="Clear search" onClick={() => setQuery("")} className={cx("flex size-5 shrink-0 items-center justify-center rounded-full text-foreground-icon-tertiary", focusRing)}>
                <RiCloseLine className="size-3" aria-hidden />
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-1.5 flex shrink-0 items-center justify-between gap-2">
          <span className="text-caption-2-semibold tracking-wide text-text-tertiary uppercase">{query ? "Matches" : "Recent"}</span>
          <button type="button" onClick={() => setRecent([])} disabled={recent.length === 0} className={cx(quietButton, "h-5 px-1 text-caption-2-medium")}>
            Clear all
          </button>
        </div>

        <div className="mt-0.5 flex min-h-0 flex-1 flex-col overflow-hidden">
          {matches.length === 0 ? (
            <p className="px-1 text-caption-2-regular text-text-tertiary">
              {recent.length === 0 ? "No recent searches yet." : "No saved query matches."}
            </p>
          ) : (
            matches.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setQuery(item);
                  inputRef.current?.focus();
                }}
                className={cx(
                  "flex h-6 w-full items-center gap-1.5 rounded-sm px-1 text-start text-caption-1-regular text-text-secondary",
                  "transition-colors duration-150 ease-out hover:bg-background-secondary-default motion-reduce:transition-none",
                  focusRing,
                )}
              >
                <RiTimeLine className="size-3 shrink-0 text-foreground-icon-tertiary" aria-hidden />
                <span className="min-w-0 flex-1 truncate">{item}</span>
                <RiArrowRightSLine className="size-3 shrink-0 text-foreground-icon-tertiary rtl:-scale-x-100" aria-hidden />
              </button>
            ))
          )}
        </div>

        {query.trim() ? (
          <button type="button" onClick={submit} className={cx(secondaryButton, "h-6 w-full justify-start rounded-md px-1.5 text-caption-2-semibold")}>
            <RiSearchLine className="size-3" aria-hidden />
            <span className="min-w-0 truncate">Search all notes for “{query.trim()}”</span>
          </button>
        ) : (
          <p className="text-caption-2-regular text-text-tertiary">Type to search titles, people and folders.</p>
        )}
      </div>
    </Phone>
  );
}

/* 11. Onboarding Pager */

const PAGES = [
  { icon: RiHeartPulseLine, title: "Train with a plan", body: "Four short sessions a week, built around the knee you keep forgetting." },
  { icon: RiLineChartLine, title: "See every gain", body: "Strength, sleep and recovery in one weekly read you can trust." },
  { icon: RiFlashlightLine, title: "Ready when you are", body: "Your first session is 18 minutes and needs no equipment." },
] as const;

export function OnboardingPager() {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const rtl = useDirection() === "rtl";
  const last = PAGES.length - 1;

  const finish = () => setDone(true);
  const replay = () => {
    setDone(false);
    setIndex(0);
  };

  return (
    <div className={cx(panel, "flex h-44 flex-col")}>
      <div className="flex h-8 shrink-0 items-center justify-between px-3">
        <span className="text-caption-2-semibold tracking-wide text-accent-600 uppercase">Northline Training</span>
        {done ? (
          <span className="text-caption-2-regular text-text-tertiary">Intro complete</span>
        ) : (
          <button type="button" onClick={finish} className={cx(quietButton, "h-5 px-1 text-caption-2-medium")}>Skip</button>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {done ? "Intro complete." : `Page ${index + 1} of ${PAGES.length}: ${PAGES[index].title}`}
      </p>

      {done ? (
        <div className="flex min-h-0 flex-1 animate-label-in flex-col items-center justify-center gap-1 px-4 text-center motion-reduce:animate-none">
          <span className="flex size-9 items-center justify-center rounded-full bg-accent-600 text-text-white ring-8 ring-accent-500/10">
            <RiCheckLine className="size-4" aria-hidden />
          </span>
          <h3 className="mt-1 text-body-2-semibold text-text-primary">You&rsquo;re set, Rowan.</h3>
          <p className="text-caption-2-regular text-text-secondary">First session Monday at 07:30. We&rsquo;ll remind you Sunday.</p>
        </div>
      ) : (
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <div className="flex h-full transition-transform duration-200 ease-out motion-reduce:transition-none" style={{ transform: `translateX(${(rtl ? 1 : -1) * index * (100 / PAGES.length)}%)` }}>
            {PAGES.map((page, position) => {
              const Icon = page.icon;
              return (
                <div key={page.title} aria-hidden={position !== index} inert={position !== index} className="flex h-full w-full shrink-0 flex-col items-center justify-center gap-1.5 px-4 text-center">
                  <span className="flex size-8 items-center justify-center rounded-full bg-accent-100 text-accent-700">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <h3 className="text-body-2-semibold text-text-primary">{page.title}</h3>
                  <p className="text-caption-2-regular text-text-secondary">{page.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex h-10 shrink-0 items-center justify-between gap-2 px-3">
        {done ? (
          <button type="button" onClick={replay} className={cx(secondaryButton, "h-7 w-full")}>
            <RiRefreshLine className="size-3.5" aria-hidden />
            Replay intro
          </button>
        ) : (
          <>
            <div role="group" aria-label="Choose a page" className="flex items-center">
              {PAGES.map((page, position) => (
                <button key={page.title} type="button" aria-label={`Page ${position + 1}: ${page.title}`} aria-current={position === index ? "step" : undefined} onClick={() => setIndex(position)} className={cx("flex size-5 items-center justify-center rounded-full", focusRing)}>
                  <span className={cx("h-1.5 rounded-full transition-[width,background-color] duration-200 ease-out motion-reduce:transition-none", position === index ? "w-4 bg-accent-600" : "w-1.5 bg-background-quaternary-default")} />
                </button>
              ))}
            </div>

            <button type="button" onClick={() => (index === last ? finish() : setIndex(index + 1))} className={cx(primaryButton, "h-7")}>
              {index === last ? "Get started" : "Next"}
              {index === last ? null : <RiArrowRightLine className="size-3.5 rtl:-scale-x-100" aria-hidden />}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* 12. Keyboard Accessory */

const INITIAL_MESSAGES = [
  { id: 1, text: "Dinner at 7? I booked the corner table.", mine: false },
  { id: 2, text: "Works for me. I'll bring the deck.", mine: true },
];

export function KeyboardAccessory() {
  const countId = useId();
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const remaining = 140 - draft.length;

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((current) => [...current, { id: current.length + 1, text, mine: true }]);
    setDraft("");
    setSent(true);
  };

  return (
    <Phone label="Keyboard accessory demo">
      <div className="flex h-7 shrink-0 items-center gap-2 border-b border-separator-border px-3">
        <span aria-hidden className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-100 text-caption-2-semibold text-accent-700">MC</span>
        <p className="min-w-0 flex-1 truncate text-caption-1-semibold text-text-primary">Maya Chen</p>
        <span aria-live="polite" className="text-caption-2-medium text-status-lime-text">{sent ? "Sent" : "Online"}</span>
      </div>

      <div aria-live="polite" className="flex min-h-0 flex-1 flex-col justify-end gap-1 overflow-hidden px-3 py-1.5">
        {messages.slice(-2).map((message) => (
          <div
            key={message.id}
            className={cx(
              "max-w-[85%] animate-label-in rounded-2xl px-2 py-1 text-caption-2-regular motion-reduce:animate-none",
              message.mine ? "ms-auto rounded-ee-sm bg-accent-600 text-text-white" : "rounded-es-sm bg-background-secondary-default text-text-primary",
            )}
          >
            {message.text}
          </div>
        ))}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          send();
        }}
        className="shrink-0 border-t border-separator-border p-1.5"
      >
        <div className="flex items-center gap-1.5">
          <div className="flex h-9 min-w-0 flex-1 items-center rounded-2xl bg-background-tertiary-default px-2.5 focus-within:ring-2 focus-within:ring-border-focus-ring">
            <input
              value={draft}
              maxLength={140}
              aria-label="Reply to Maya"
              aria-describedby={countId}
              placeholder="Reply to Maya…"
              onChange={(event) => {
                setDraft(event.target.value);
                setSent(false);
              }}
              className="min-w-0 flex-1 bg-transparent p-0 text-caption-1-medium text-text-primary outline-none placeholder:text-text-placeholder"
            />
            <span id={countId} className={cx("ms-1 shrink-0 text-caption-2-regular tabular-nums", remaining <= 15 ? "text-text-error-primary" : "text-text-tertiary")}>
              {draft.length}/140
            </span>
          </div>
          <button
            type="submit"
            aria-label="Send reply"
            disabled={!draft.trim()}
            className={cx(
              "flex size-9 shrink-0 items-center justify-center rounded-full bg-button-primary text-text-white shadow-xs",
              "transition-[background-color,opacity,transform,scale] duration-150 ease-out hover:opacity-90 active:scale-95",
              "disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none motion-reduce:active:scale-100",
              focusRing,
            )}
          >
            <RiSendPlaneLine className="size-4 rtl:-scale-x-100" aria-hidden />
          </button>
        </div>
      </form>
    </Phone>
  );
}

/* Specimens */

export const MOBILE_SECTION: ExtendedSection = {
  id: "mobile",
  title: "Mobile",
  blurb: "The chrome a small screen needs and nothing more.",
  file: "mobile.tsx",
  entries: [
    { name: "Tab Bar", description: "Four sections, one sliding pill and a live panel.", Demo: TabBar },
    { name: "Bottom Sheet", description: "Drag the handle to snap filters open or closed.", Demo: BottomSheet },
    { name: "Action Sheet", description: "A destructive choice stops for one clear confirmation.", Demo: ActionSheet },
    { name: "Swipe Row", description: "Drag a message to reveal archive and delete.", Demo: SwipeRow },
    { name: "Pull to Refresh", description: "Pull for distance, release for a spinner and a new row.", Demo: PullToRefresh },
    { name: "Status Bar", description: "Time, signal, Wi-Fi and a battery that charges.", Demo: StatusBarChrome },
    { name: "Segmented Tabs", description: "Three periods with a pill that slides between them.", Demo: SegmentedTabs },
    { name: "Bottom Nav", description: "Five destinations, a badge and an unmistakable active state.", Demo: BottomNav },
    { name: "Mobile Toast", description: "A top toast with undo, dismiss and auto-close.", Demo: MobileToast },
    { name: "Search Overlay", description: "A full-sheet search with recents and a live filter.", Demo: SearchOverlay },
    { name: "Onboarding Pager", description: "Three pages, dots and a get-started finish.", Demo: OnboardingPager },
    { name: "Keyboard Accessory", description: "A reply bar with a live count and a sent state.", Demo: KeyboardAccessory },
  ],
};
