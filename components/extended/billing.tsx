"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import {
  RiAddLine, RiArrowDownSLine, RiArrowRightLine, RiBankCardLine, RiCalendarEventLine,
  RiCheckLine, RiCloseLine, RiCoupon3Line, RiDownloadLine, RiErrorWarningLine,
  RiExchangeDollarLine, RiFileTextLine, RiGlobalLine, RiLoader4Line, RiPauseCircleLine,
  RiRefreshLine, RiSafeLine, RiScales3Line, RiShieldCheckLine, RiSubtractLine, RiTeamLine,
  RiVipCrownLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* Shared anatomy */

type IconComponent = ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";
const card =
  "w-full max-w-[320px] rounded-xl border border-border-button-default bg-background-primary-default p-2.5 shadow-xs";
const meta = "text-caption-2-regular text-text-tertiary";
const chip = "inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-caption-2-medium";
const iconTile =
  "flex size-7 shrink-0 items-center justify-center rounded-lg bg-background-tertiary-default text-foreground-icon-secondary";
const buttonBase =
  "inline-flex items-center justify-center gap-1 rounded-lg text-caption-1-semibold " +
  "transition-[transform,opacity,background-color,color,box-shadow] duration-150 ease-out " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 " +
  "motion-reduce:transition-none motion-reduce:active:scale-100";
const primaryButton = cx(buttonBase, "h-8 bg-button-primary px-2.5 text-text-white shadow-xs", focusRing);
const softButton = cx(
  buttonBase,
  "h-7 border border-border-button-default bg-background-primary-default px-2 text-text-primary shadow-xs hover:bg-background-primary-hover",
  focusRing,
);
const quietButton = cx(
  buttonBase,
  "h-7 px-1.5 text-text-secondary hover:bg-background-secondary-default hover:text-text-primary",
  focusRing,
);
const dangerButton = cx(buttonBase, "h-7 bg-button-danger px-2 text-text-white shadow-xs", focusRing);
const iconButton = cx(
  "flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-icon-tertiary",
  "transition-[background-color,color] duration-150 ease-out hover:bg-background-tertiary-default hover:text-text-primary motion-reduce:transition-none",
  focusRing,
);
const fieldShell =
  "flex h-8 w-full items-center gap-1.5 rounded-lg bg-background-tertiary-default px-2 " +
  "ring-2 ring-inset ring-transparent transition-[background-color,box-shadow] duration-150 ease-out " +
  "focus-within:ring-border-button-active motion-reduce:transition-none";
const fieldInput =
  "min-w-0 flex-1 bg-transparent p-0 text-caption-1-medium text-text-primary outline-none placeholder:text-text-placeholder";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const usd0 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const TONES = {
  lime: "bg-status-lime-background text-status-lime-text",
  rose: "bg-status-rose-background text-status-rose-text",
  orange: "bg-status-orange-background text-status-orange-text",
  accent: "bg-accent-100 text-accent-700",
  neutral: "bg-background-secondary-default text-text-secondary",
} as const;
type Tone = keyof typeof TONES;

function Chip({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return <span className={cx(chip, TONES[tone])}>{children}</span>;
}

function Head({
  icon: Icon,
  title,
  detail,
  trailing,
  iconClassName,
}: {
  icon: IconComponent;
  title: string;
  detail?: string;
  trailing?: ReactNode;
  iconClassName?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={cx(iconTile, iconClassName)}>
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-body-2-semibold text-text-primary">{title}</h3>
        {detail ? <p className={cx(meta, "truncate")}>{detail}</p> : null}
      </div>
      {trailing}
    </div>
  );
}

function Meter({ value, tone = "bg-accent-500", label }: { value: number; tone?: string; label: string }) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(Math.max(0, Math.min(100, value)))}
      className="h-1.5 overflow-hidden rounded-full bg-background-tertiary-default"
    >
      <div
        className={cx(
          "h-full rounded-full transition-[width,background-color] duration-200 ease-out motion-reduce:transition-none",
          tone,
        )}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

function Reveal({ id, open, children }: { id?: string; open: boolean; children: ReactNode }) {
  return (
    <div
      id={id}
      inert={!open}
      className={cx(
        "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
      )}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (next: T) => void;
  className?: string;
}) {
  return (
    <div role="group" aria-label={label} className={cx("flex shrink-0 rounded-md bg-background-secondary-default p-0.5", className)}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cx(
              "h-5 flex-1 rounded-sm px-1.5 text-caption-2-semibold whitespace-nowrap",
              "transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
              active
                ? "bg-segmented-control-selected-background text-text-primary shadow-xs"
                : "text-text-tertiary hover:text-text-secondary",
              focusRing,
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function Switch({ checked, label, onChange }: { checked: boolean; label: string; onChange: (next: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cx(
        "flex h-4 w-7 shrink-0 items-center rounded-full p-0.5 transition-[background-color] duration-200 ease-out motion-reduce:transition-none",
        checked ? "bg-accent-600" : "bg-background-quaternary-default",
        focusRing,
      )}
    >
      <span
        aria-hidden
        className={cx(
          "size-3 rounded-full bg-control-indicator-background shadow-xs transition-[transform] duration-200 ease-out motion-reduce:transition-none",
          checked ? "translate-x-3 rtl:-translate-x-3" : "translate-x-0",
        )}
      />
    </button>
  );
}

/** Focus the panel on open, close on Escape, and give focus back on close. */
function useDialog(open: boolean, setOpen: (next: boolean) => void) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (!open) {
      if (wasOpen.current) {
        wasOpen.current = false;
        triggerRef.current?.focus();
      }
      return;
    }
    wasOpen.current = true;
    panelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return { triggerRef, panelRef };
}

/* 1 · Plan Card */

const PLAN_DATA = {
  studio: { name: "Studio", price: 149, seats: 10, used: 8 },
  scale: { name: "Scale", price: 249, seats: 20, used: 8 },
} as const;
type PlanId = keyof typeof PLAN_DATA;

export function PlanCard() {
  const listId = useId();
  const changeRef = useRef<HTMLButtonElement>(null);
  const [planId, setPlanId] = useState<PlanId>("studio");
  const [picking, setPicking] = useState(false);
  const plan = PLAN_DATA[planId];

  return (
    <section aria-label={`${plan.name} plan`} className={cx(card, "flex flex-col gap-2")}>
      <Head icon={RiVipCrownLine} title={`${plan.name} plan`} detail="Renews Dec 1, 2026" trailing={<Chip tone="lime">Active</Chip>} />

      <div className="flex items-end justify-between gap-2">
        <p className="flex items-baseline gap-1">
          <span key={planId} className="animate-number-fade text-title-2-semibold text-text-primary tabular-nums motion-reduce:animate-none">
            {usd0.format(plan.price)}
          </span>
          <span className={meta}>/month</span>
        </p>
        <p className={cx(meta, "pb-0.5 text-end")}>{plan.used} of {plan.seats} seats</p>
      </div>

      <Meter value={(plan.used / plan.seats) * 100} label={`${plan.used} of ${plan.seats} seats used`} />

      <button ref={changeRef} type="button" aria-expanded={picking} aria-controls={listId} onClick={() => setPicking((next) => !next)} className={cx(softButton, "w-full")}>
        <RiExchangeDollarLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
        Change plan
        <RiArrowDownSLine
          className={cx(
            "ms-auto size-3.5 text-foreground-icon-tertiary transition-transform duration-200 ease-out motion-reduce:transition-none",
            picking && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      <Reveal id={listId} open={picking}>
        <div role="group" aria-label="Choose a plan" className="grid grid-cols-2 gap-1.5 pt-1.5">
          {(Object.keys(PLAN_DATA) as PlanId[]).map((id) => {
            const option = PLAN_DATA[id];
            const active = id === planId;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => { setPlanId(id); setPicking(false); changeRef.current?.focus(); }}
                className={cx(
                  "flex h-8 items-center justify-between gap-1 rounded-lg border px-2 text-start",
                  "transition-[background-color,border-color,color] duration-150 ease-out motion-reduce:transition-none",
                  active
                    ? "border-accent-500 bg-background-secondary-default"
                    : "border-border-button-default bg-background-primary-default hover:bg-background-primary-hover",
                  focusRing,
                )}
              >
                <span className="text-caption-1-semibold text-text-primary">{option.name}</span>
                <span className={cx("text-caption-2-medium tabular-nums", active ? "text-accent-600" : "text-text-tertiary")}>
                  {usd0.format(option.price)}
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      <span className="sr-only" aria-live="polite">{plan.name} plan, {usd0.format(plan.price)} per month.</span>
    </section>
  );
}

/* 2 · Seat Manager */

const INCLUDED_SEATS = 10;
const SEAT_RATE = 12;
const DAYS_LEFT = 17;
const CYCLE_DAYS = 30;

export function SeatManager() {
  const [savedSeats, setSavedSeats] = useState(8);
  const [seats, setSeats] = useState(8);
  const [justSaved, setJustSaved] = useState(false);
  const [lastAdded, setLastAdded] = useState(0);
  const [lastCharge, setLastCharge] = useState(0);

  const added = Math.max(0, seats - savedSeats);
  const charge = (added * SEAT_RATE * DAYS_LEFT) / CYCLE_DAYS;
  const shownAdded = justSaved ? lastAdded : added;
  const shownCharge = justSaved ? lastCharge : charge;
  const dirty = seats !== savedSeats;
  const extra = Math.max(0, seats - INCLUDED_SEATS);

  const move = (delta: number) => {
    setSeats((current) => Math.min(20, Math.max(1, current + delta)));
    setJustSaved(false);
  };

  const apply = () => {
    setLastAdded(added);
    setLastCharge(charge);
    setSavedSeats(seats);
    setJustSaved(true);
  };

  return (
    <section aria-label="Manage seats" className={cx(card, "flex flex-col gap-2")}>
      <Head
        icon={RiTeamLine}
        title="Seats"
        detail={`Studio includes ${INCLUDED_SEATS} · 17 days left`}
        trailing={<Chip tone={extra > 0 ? "accent" : "neutral"}>{seats} assigned</Chip>}
      />

      <div className="flex items-center gap-2 rounded-lg bg-background-secondary-default p-1">
        <button type="button" aria-label="Remove one seat" disabled={seats <= 1} onClick={() => move(-1)} className={cx(softButton, "size-7 shrink-0 p-0")}>
          <RiSubtractLine className="size-3.5" aria-hidden />
        </button>
        <p className="min-w-0 flex-1 text-center">
          <span key={seats} className="animate-number-fade text-body-2-semibold text-text-primary tabular-nums motion-reduce:animate-none">
            {seats}
          </span>
          <span className={meta}> assigned</span>
          {extra > 0 ? <span className="text-caption-2-medium text-accent-600"> · +{extra} extra</span> : null}
        </p>
        <button type="button" aria-label="Add one seat" disabled={seats >= 20} onClick={() => move(1)} className={cx(softButton, "size-7 shrink-0 p-0")}>
          <RiAddLine className="size-3.5" aria-hidden />
        </button>
      </div>

      <div className="rounded-lg border border-separator-border bg-background-secondary-default px-2 py-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className={meta}>
            {shownAdded > 0 ? `${shownAdded} added × ${usd.format(SEAT_RATE)}` : justSaved ? "Seats updated" : dirty ? "Seat removal" : "No change"}
          </span>
          <span
            key={shownCharge}
            className={cx(
              "animate-number-fade text-caption-1-semibold tabular-nums motion-reduce:animate-none",
              shownCharge > 0 ? "text-text-primary" : "text-text-tertiary",
            )}
          >
            {usd.format(shownCharge)}
          </span>
        </div>
        <p className={cx(meta, "truncate")}>
          {shownCharge > 0
            ? `Prorated for ${DAYS_LEFT} of ${CYCLE_DAYS} days · renews Dec 1`
            : justSaved ? "Saved · renews Dec 1" : dirty ? "Removals settle on Dec 1 · no charge today" : "No charge today · renews Dec 1"}
        </p>
      </div>

      <button type="button" onClick={apply} disabled={!dirty} className={cx(primaryButton, "w-full")}>
        {justSaved ? (
          <><RiCheckLine className="size-3.5" aria-hidden />Seats updated</>
        ) : (
          <><RiTeamLine className="size-3.5" aria-hidden />Apply seat change</>
        )}
      </button>

      <span className="sr-only" aria-live="polite">
        {justSaved
          ? `${seats} seats active. ${shownCharge > 0 ? `${usd.format(shownCharge)} charged today.` : "No charge today."}`
          : dirty
            ? `${seats} seats selected. ${usd.format(shownCharge)} due today.`
            : `${savedSeats} seats active.`}
      </span>
    </section>
  );
}

/* 3 · Upgrade Dialog */

const UPGRADES = [
  { id: "scale", name: "Scale", price: 249, detail: "20 seats · SSO · audit log" },
  { id: "frontline", name: "Frontline", price: 499, detail: "Unlimited seats · 99.9% SLA" },
] as const;
type UpgradeId = (typeof UPGRADES)[number]["id"];

const UPGRADE_INCLUDES = {
  studio: ["10 seats and 250 GB", "Board and timeline views", "Email support"],
  scale: ["20 seats and 1 TB", "SAML SSO and audit log", "Priority support"],
  frontline: ["Unlimited seats", "99.9% uptime SLA", "Dedicated success manager"],
} as const;

export function UpgradeDialog() {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<UpgradeId>("scale");
  const [plan, setPlan] = useState<UpgradeId | null>(null);
  const { triggerRef, panelRef } = useDialog(open, setOpen);
  const chosen = plan ? UPGRADES.find((item) => item.id === plan) ?? UPGRADES[0] : null;
  const features = UPGRADE_INCLUDES[plan ?? "studio"];

  const confirm = () => {
    setPlan(selected);
    setOpen(false);
  };

  return (
    <section aria-label="Plan upgrade" className={cx(card, "relative flex min-h-[188px] flex-col")}>
      <div inert={open} className="flex flex-1 flex-col">
        <Head
          icon={RiVipCrownLine}
          title={chosen ? `${chosen.name} plan` : "Studio plan"}
          detail={chosen ? `Starts Dec 1 · ${usd0.format(chosen.price)}/mo` : "Renews Dec 1 · $149/mo"}
          trailing={<Chip tone={chosen ? "accent" : "lime"}>{chosen ? "Upgrade set" : "Active"}</Chip>}
        />

        <p className={cx(meta, "mt-1.5")}>
          {chosen ? "This month’s usage carries over. The difference lands on Dec 1." : "8 of 10 seats are filled. Scale removes the ceiling."}
        </p>

        <ul className="mt-1 flex flex-col gap-0.5">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-1.5 text-caption-2-regular text-text-secondary">
              <RiCheckLine className="size-3 shrink-0 text-status-lime-text" aria-hidden />
              <span className="truncate">{feature}</span>
            </li>
          ))}
        </ul>

        <button ref={triggerRef} type="button" aria-haspopup="dialog" onClick={() => { if (plan) setSelected(plan); setOpen(true); }} className={cx(primaryButton, "mt-auto w-full")}>
          <RiVipCrownLine className="size-3.5" aria-hidden />
          {chosen ? "Change request" : "Upgrade plan"}
        </button>
      </div>

      {open ? (
        <div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={cx(
            "absolute inset-0 z-10 flex animate-label-in flex-col rounded-xl border border-border-button-default outline-none",
            "bg-background-primary-default p-2.5 shadow-dropdown motion-reduce:animate-none",
          )}
        >
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <h3 id={titleId} className="text-body-2-semibold text-text-primary">Upgrade plan</h3>
              <p className={cx(meta, "truncate")}>Studio · switch starts Dec 1, 2026</p>
            </div>
            <button type="button" aria-label="Close upgrade dialog" onClick={() => setOpen(false)} className={iconButton}>
              <RiCloseLine className="size-3.5" aria-hidden />
            </button>
          </div>

          <div role="group" aria-label="Choose a higher plan" className="mt-2 flex flex-col gap-1.5">
            {UPGRADES.map((option) => {
              const active = option.id === selected;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelected(option.id)}
                  className={cx(
                    "flex h-9 items-center gap-2 rounded-lg border px-2 text-start",
                    "transition-[background-color,border-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                    active
                      ? "border-accent-500 bg-background-secondary-default shadow-xs"
                      : "border-border-button-default bg-background-primary-default hover:bg-background-primary-hover",
                    focusRing,
                  )}
                >
                  <span
                    aria-hidden
                    className={cx(
                      "flex size-3.5 shrink-0 items-center justify-center rounded-full border",
                      active ? "border-accent-600 bg-accent-600 text-text-white" : "border-border-checkbox-default bg-background-primary-default",
                    )}
                  >
                    {active ? <RiCheckLine className="size-2.5" aria-hidden /> : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-caption-1-semibold text-text-primary">{option.name}</span>
                    <span className={cx(meta, "block truncate")}>{option.detail}</span>
                  </span>
                  <span className="shrink-0 text-caption-1-semibold text-text-primary tabular-nums">
                    {usd0.format(option.price)}<span className={meta}>/mo</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-auto flex items-center justify-between gap-2 pt-2">
            <span className={meta}>Due Dec 1 · prorated</span>
            <button type="button" onClick={confirm} className={cx(primaryButton, "h-7 shrink-0")}>
              Upgrade to {UPGRADES.find((item) => item.id === selected)?.name}
              <RiArrowRightLine className="size-3 rtl:-scale-x-100" aria-hidden />
            </button>
          </div>
        </div>
      ) : null}

      <span className="sr-only" aria-live="polite">
        {chosen ? `${chosen.name} upgrade set for Dec 1, 2026.` : "Studio plan. Upgrade available."}
      </span>
    </section>
  );
}

/* 4 · Invoice Detail */

const INVOICE_LINES = [
  { label: "Platform · 8 seats", note: "Nov 1–30, 2026", amount: 149 },
  { label: "Usage overage", note: "42 GB above plan", amount: 42.6 },
  { label: "Priority support", note: "Business hours", amount: 29 },
] as const;
const INVOICE_SUBTOTAL = 220.6;
const INVOICE_TAX = 17.65;
const INVOICE_TOTAL = 238.25;

type DownloadState = "idle" | "preparing" | "done";

export function InvoiceDetail() {
  const [download, setDownload] = useState<DownloadState>("idle");

  useEffect(() => {
    if (download !== "preparing") return;
    const timer = window.setTimeout(() => setDownload("done"), 900);
    return () => window.clearTimeout(timer);
  }, [download]);

  return (
    <section aria-label="Invoice DF-2041" className={cx(card, "max-w-[460px]")}>
      <Head icon={RiFileTextLine} title="Invoice DF-2041" detail="Nov 1, 2026 · Northline Studio" trailing={<Chip tone="lime">Paid</Chip>} />

      <div className="mt-2 grid grid-cols-[minmax(0,1fr)_136px] gap-2">
        <ul className="flex flex-col gap-1">
          {INVOICE_LINES.map((line) => (
            <li key={line.label} className="flex items-start justify-between gap-2 border-b border-separator-border pb-1 last:border-b-0 last:pb-0">
              <span className="min-w-0">
                <span className="block truncate text-caption-1-medium text-text-primary">{line.label}</span>
                <span className={cx(meta, "block truncate")}>{line.note}</span>
              </span>
              <span dir="ltr" className="shrink-0 text-caption-1-semibold text-text-primary tabular-nums">{usd.format(line.amount)}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col rounded-lg bg-background-secondary-default p-2">
          <div className="flex items-baseline justify-between gap-1">
            <span className={meta}>Subtotal</span>
            <span dir="ltr" className="text-caption-2-medium text-text-secondary tabular-nums">{usd.format(INVOICE_SUBTOTAL)}</span>
          </div>
          <div className="flex items-baseline justify-between gap-1">
            <span className={meta}>Tax · 8%</span>
            <span dir="ltr" className="text-caption-2-medium text-text-secondary tabular-nums">{usd.format(INVOICE_TAX)}</span>
          </div>
          <div className="mt-1 flex items-baseline justify-between gap-1 border-t border-separator-border pt-1">
            <span className="text-caption-2-semibold text-text-primary">Total</span>
            <span dir="ltr" className="text-caption-1-semibold text-text-primary tabular-nums">{usd.format(INVOICE_TOTAL)}</span>
          </div>
          <button
            type="button"
            onClick={() => setDownload("preparing")}
            disabled={download === "preparing"}
            className={cx(primaryButton, "mt-auto h-7 w-full px-1.5 text-caption-2-semibold")}
          >
            {download === "preparing" ? (
              <><RiLoader4Line className="size-3 animate-spin motion-reduce:animate-none" aria-hidden />Preparing</>
            ) : download === "done" ? (
              <><RiCheckLine className="size-3" aria-hidden />Downloaded</>
            ) : (
              <><RiDownloadLine className="size-3" aria-hidden />Download PDF</>
            )}
          </button>
          <span className={cx(meta, "mt-1 text-center")}>PDF · 84 KB</span>
        </div>
      </div>

      <p className={cx(meta, "mt-1.5 flex items-center gap-1 border-t border-separator-border pt-1.5")}>
        <RiShieldCheckLine className="size-3 shrink-0" aria-hidden />
        <span className="truncate" dir="ltr">VAT DE312456789 · tax invoice</span>
      </p>
      <span className="sr-only" aria-live="polite">
        {download === "done" ? "Invoice PDF downloaded." : download === "preparing" ? "Preparing invoice PDF." : ""}
      </span>
    </section>
  );
}

/* 5 · Billing History */

const HISTORY = [
  { id: "nov", period: "Nov 1, 2026", status: "Paid", amount: 238.25, invoice: "DF-2041", method: "Visa ···· 4242", tone: "lime" },
  { id: "oct", period: "Oct 1, 2026", status: "Paid", amount: 429, invoice: "DF-2038", method: "Visa ···· 4242", tone: "lime" },
  { id: "sep", period: "Sep 1, 2026", status: "Refunded", amount: -39, invoice: "DF-2035", method: "Visa ···· 4242", tone: "neutral" },
] as const;
type HistoryFilter = "all" | "paid" | "refunded";

export function BillingHistory() {
  const baseId = useId();
  const [filter, setFilter] = useState<HistoryFilter>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const visible = HISTORY.filter((item) => filter === "all" || item.status.toLowerCase() === filter);

  return (
    <section aria-label="Billing history" className={cx(card, "flex flex-col")}>
      <Head
        icon={RiFileTextLine}
        title="Billing history"
        detail="Last 3 invoices · Northline Studio"
        trailing={<span className={cx(meta, "shrink-0 tabular-nums")}>2 paid</span>}
      />

      <div className="mt-1.5">
        <Segmented
          label="Filter invoices by status"
          value={filter}
          options={[
            { value: "all", label: "All" },
            { value: "paid", label: "Paid" },
            { value: "refunded", label: "Refunded" },
          ]}
          onChange={(next) => { setFilter(next); setOpenId(null); }}
          className="w-full"
        />
      </div>

      <ul key={filter} className="mt-1 flex animate-label-in flex-col motion-reduce:animate-none">
        {visible.map((item) => {
          const open = openId === item.id;
          return (
            <li key={item.id} className="border-b border-separator-border last:border-b-0">
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`${baseId}-${item.id}`}
                onClick={() => setOpenId(open ? null : item.id)}
                className={cx(
                  "flex h-7 w-full items-center gap-1.5 rounded-sm text-start",
                  "transition-[background-color] duration-150 ease-out hover:bg-background-secondary-default motion-reduce:transition-none",
                  focusRing,
                )}
              >
                <span className="min-w-0 flex-1 truncate text-caption-1-medium text-text-primary">{item.period}</span>
                <Chip tone={item.tone}>{item.status}</Chip>
                <span dir="ltr" className={cx("w-16 shrink-0 text-end text-caption-1-semibold tabular-nums", item.amount < 0 ? "text-text-tertiary" : "text-text-primary")}>
                  {item.amount < 0 ? `−${usd.format(Math.abs(item.amount))}` : usd.format(item.amount)}
                </span>
                <RiArrowDownSLine
                  className={cx(
                    "size-3.5 shrink-0 text-foreground-icon-tertiary transition-transform duration-200 ease-out motion-reduce:transition-none",
                    open && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>
              <Reveal id={`${baseId}-${item.id}`} open={open}>
                <p className={cx(meta, "flex items-center justify-between gap-2 pb-1.5 ps-1")}>
                  <span className="truncate">{item.invoice} · {item.method}</span>
                  <span className="shrink-0">Receipt emailed</span>
                </p>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* 6 · Proration Preview */

const PRORATION = {
  nov18: { label: "Nov 18", note: "12 days left", credit: 59.6, charge: 99.6, tax: 3.2, due: 43.2 },
  nov25: { label: "Nov 25", note: "6 days left", credit: 29.8, charge: 49.8, tax: 1.6, due: 21.6 },
  dec1: { label: "Dec 1", note: "at renewal", credit: 0, charge: 249, tax: 19.92, due: 268.92 },
} as const;
type ProrationId = keyof typeof PRORATION;

function MoneyLine({ label, amount, tone }: { label: string; amount: string; tone?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className={meta}>{label}</span>
      <span dir="ltr" className={cx("text-caption-2-medium tabular-nums", tone ?? "text-text-primary")}>{amount}</span>
    </div>
  );
}

export function ProrationPreview() {
  const [choice, setChoice] = useState<ProrationId>("nov18");
  const row = PRORATION[choice];

  return (
    <section aria-label="Proration preview" className={cx(card, "flex flex-col gap-1")}>
      <Head icon={RiScales3Line} title="Proration preview" detail={`Upgrade · ${row.note}`} trailing={<Chip tone="accent">Estimate</Chip>} />

      <div className="flex items-center gap-1.5 rounded-lg bg-background-secondary-default px-2 py-1">
        <span className="text-caption-2-medium text-text-secondary">Studio {usd0.format(149)}</span>
        <RiArrowRightLine className="size-3 shrink-0 text-foreground-icon-tertiary rtl:-scale-x-100" aria-hidden />
        <span className="text-caption-2-semibold text-text-primary">Scale {usd0.format(249)}</span>
        <span className={cx(meta, "ms-auto truncate")}>8 seats</span>
      </div>

      <Segmented
        label="Change date"
        value={choice}
        options={[
          { value: "nov18", label: "Nov 18" },
          { value: "nov25", label: "Nov 25" },
          { value: "dec1", label: "Dec 1" },
        ]}
        onChange={setChoice}
        className="w-full"
      />

      <div aria-live="polite" className="flex animate-label-in flex-col gap-0.5 motion-reduce:animate-none" key={choice}>
        <MoneyLine label="Unused Studio time" amount={row.credit > 0 ? `−${usd.format(row.credit)}` : usd.format(0)} tone="text-status-lime-text" />
        <MoneyLine label="Scale charge" amount={`+${usd.format(row.charge)}`} />
        <MoneyLine label="Tax · 8%" amount={usd.format(row.tax)} tone="text-text-secondary" />
      </div>

      <div className="flex items-baseline justify-between gap-2 border-t border-separator-border pt-1.5">
        <span className="text-caption-2-semibold text-text-primary">Due {row.label}</span>
        <span key={`due-${choice}`} dir="ltr" className="animate-number-fade text-caption-1-semibold text-text-primary tabular-nums motion-reduce:animate-none">
          {usd.format(row.due)}
        </span>
      </div>
    </section>
  );
}

/* 7 · Spend Limit */

const SPENT = 612;
const CAP_OPTIONS = [600, 800, 1200] as const;

export function SpendLimit() {
  const [cap, setCap] = useState<number>(800);
  const [threshold, setThreshold] = useState<"75" | "90">("75");
  const thresholdPct = Number(threshold);
  const alertAt = (cap * thresholdPct) / 100;
  const over = SPENT > cap;
  const alerted = SPENT >= alertAt;
  const left = Math.max(0, cap - SPENT);
  const tone = over ? "bg-status-rose-text" : alerted ? "bg-status-orange-text" : "bg-accent-500";

  return (
    <section aria-label="Monthly spend limit" className={cx(card, "flex flex-col gap-1.5")}>
      <Head icon={RiSafeLine} title="Spend limit" detail="Usage and overages · resets Dec 1" trailing={<Chip tone="neutral">Monthly</Chip>} />

      <div className="flex items-end justify-between gap-2">
        <p className="flex items-baseline gap-1">
          <span className="text-title-3-semibold text-text-primary tabular-nums">{usd.format(SPENT)}</span>
          <span className={meta}>spent</span>
        </p>
        <p className={cx(meta, "pb-0.5 text-end")}>of {usd0.format(cap)} cap</p>
      </div>

      <div className="relative">
        <Meter value={(SPENT / cap) * 100} tone={tone} label={`${usd.format(SPENT)} of ${usd.format(cap)} monthly cap used`} />
        <span
          aria-hidden
          className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background-primary-default bg-text-primary"
          style={{ insetInlineStart: `${thresholdPct}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-1">
        <span className={meta}>Cap</span>
        <div role="group" aria-label="Monthly cap" className="flex items-center gap-1">
          {CAP_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              aria-label={`Set monthly cap to ${usd0.format(option)}`}
              aria-pressed={cap === option}
              onClick={() => setCap(option)}
              className={cx(
                "h-6 rounded-md px-1.5 text-caption-2-semibold tabular-nums",
                "transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                cap === option
                  ? "bg-segmented-control-selected-background text-text-primary shadow-xs"
                  : "text-text-tertiary hover:bg-background-secondary-default hover:text-text-secondary",
                focusRing,
              )}
            >
              {usd0.format(option)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className={meta}>Alert at</span>
        <Segmented
          label="Alert threshold"
          value={threshold}
          options={[{ value: "75", label: "75%" }, { value: "90", label: "90%" }]}
          onChange={setThreshold}
        />
      </div>

      <p
        aria-live="polite"
        className={cx(
          "flex items-center gap-1.5 border-t border-separator-border pt-1.5 text-caption-2-medium",
          over ? "text-status-rose-text" : alerted ? "text-status-orange-text" : "text-text-tertiary",
        )}
      >
        <span aria-hidden className={cx("size-1.5 shrink-0 rounded-full", over ? "bg-status-rose-text" : alerted ? "bg-status-orange-text" : "bg-status-lime-text")} />
        <span className="min-w-0 flex-1 truncate">
          {over
            ? `Cap reached · ${usd.format(SPENT - cap)} over · usage paused`
            : alerted
              ? `Alert sent at ${usd0.format(alertAt)} · ${usd.format(left)} left`
              : `No alert yet · ${usd.format(left)} left`}
        </span>
      </p>
    </section>
  );
}

/* 8 · Tax ID Field */

const TAX_COUNTRIES = [
  { id: "DE", name: "Germany", short: "Germany", label: "VAT ID", placeholder: "123456789", pattern: /^\d{9}$/, hint: "9 digits after DE" },
  { id: "GB", name: "United Kingdom", short: "UK", label: "VAT number", placeholder: "123456789", pattern: /^\d{9}(\d{3})?$/, hint: "9 or 12 digits after GB" },
  { id: "FR", name: "France", short: "France", label: "VAT number", placeholder: "AB123456789", pattern: /^[A-Z]{2}\d{9}$/, hint: "2 letters and 9 digits after FR" },
  { id: "US", name: "United States", short: "US", label: "EIN", placeholder: "12-3456789", pattern: /^\d{2}-\d{7}$/, hint: "EIN as 12-3456789" },
] as const;
type TaxStatus = "idle" | "verified" | "error";

export function TaxIdField() {
  const id = useId();
  const hintId = useId();
  const [countryId, setCountryId] = useState("DE");
  const [value, setValue] = useState("312456789");
  const [status, setStatus] = useState<TaxStatus>("idle");
  const country = TAX_COUNTRIES.find((item) => item.id === countryId) ?? TAX_COUNTRIES[0];
  const isEU = country.id !== "US";

  const verify = () => setStatus(country.pattern.test(value) ? "verified" : "error");
  const message =
    status === "error"
      ? `Enter ${country.hint}.`
      : status === "verified"
        ? isEU ? "Verified · reverse charge applies." : "Verified · tax exemption on file."
        : `${country.hint} · shown on invoices.`;

  return (
    <section aria-label="Tax identification" className={cx(card, "flex flex-col gap-1.5")}>
      <Head icon={RiGlobalLine} title="Tax ID" detail="For VAT invoices and exemptions" trailing={<Chip tone="neutral">{country.id}</Chip>} />

      <div className="grid grid-cols-[104px_minmax(0,1fr)] gap-1.5">
        <div className="relative">
          <select
            aria-label="Country for tax ID"
            value={countryId}
            onChange={(event) => { setCountryId(event.target.value); setValue(""); setStatus("idle"); }}
            className={cx(
              "h-8 w-full appearance-none rounded-lg bg-background-tertiary-default ps-2 pe-6 text-caption-1-medium text-text-primary outline-none",
              focusRing,
            )}
          >
            {TAX_COUNTRIES.map((item) => <option key={item.id} value={item.id}>{item.short}</option>)}
          </select>
          <RiArrowDownSLine className="pointer-events-none absolute end-1.5 top-1/2 size-3.5 -translate-y-1/2 text-foreground-icon-tertiary" aria-hidden />
        </div>

        <div className={cx(fieldShell, status === "error" && "ring-border-error-default")}>
          <span dir="ltr" className="shrink-0 text-caption-2-semibold text-text-tertiary">{country.id}</span>
          <input
            id={id}
            dir="ltr"
            value={value}
            spellCheck={false}
            autoComplete="off"
            aria-label={`${country.label} for ${country.name}`}
            aria-invalid={status === "error"}
            aria-describedby={hintId}
            placeholder={country.placeholder}
            onChange={(event) => {
              setValue(event.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 14));
              setStatus("idle");
            }}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              event.preventDefault();
              verify();
            }}
            className={cx(fieldInput, "font-mono tracking-wide")}
          />
          {status === "verified" ? <RiCheckLine className="size-3.5 shrink-0 text-status-lime-text" aria-hidden /> : null}
        </div>
      </div>

      <p
        key={status}
        id={hintId}
        aria-live="polite"
        className={cx(
          "min-h-4 animate-label-in text-caption-2-regular motion-reduce:animate-none",
          status === "error" ? "text-text-error-primary" : status === "verified" ? "text-status-lime-text" : "text-text-tertiary",
        )}
      >
        {message}
      </p>

      <div className="flex items-center justify-between gap-2">
        <button type="button" onClick={verify} className={cx(softButton, "shrink-0")}>
          <RiShieldCheckLine className="size-3.5" aria-hidden />
          {country.id === "US" ? "Verify EIN" : "Verify VAT ID"}
        </button>
        <span className={cx(meta, "text-end")}>
          {status === "verified"
            ? isEU ? "Reverse charge applies" : "Tax exemption on file"
            : isEU ? "8% VAT until verified" : "Taxable until verified"}
        </span>
      </div>
    </section>
  );
}

/* 9 · Cancel Flow */

const CANCEL_REASONS = ["Too expensive", "Not using it enough", "Missing a feature"] as const;
type CancelStep = "reason" | "offer" | "done";
type CancelOutcome = "paused" | "cancelled";

export function CancelFlow() {
  const [step, setStep] = useState<CancelStep>("reason");
  const [reason, setReason] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<CancelOutcome>("paused");
  const headerTone: Tone = step === "done" ? (outcome === "paused" ? "lime" : "rose") : step === "offer" ? "accent" : "neutral";

  const reset = () => { setStep("reason"); setReason(null); };
  const finish = (next: CancelOutcome) => { setOutcome(next); setStep("done"); };

  return (
    <section aria-label="Cancel subscription" className={cx(card, "flex flex-col gap-2")}>
      <Head
        icon={step === "done" && outcome === "paused" ? RiPauseCircleLine : RiErrorWarningLine}
        iconClassName={
          step === "done"
            ? outcome === "paused"
              ? "bg-status-lime-background text-status-lime-text"
              : "bg-status-rose-background text-status-rose-text"
            : undefined
        }
        title={step === "done" ? "Plan status" : "Cancel subscription"}
        detail={step === "done" ? (outcome === "paused" ? "Studio · paused · resumes Mar 1" : "Studio · ends Dec 1, 2026") : "Studio · $149/mo · renews Dec 1"}
        trailing={<Chip tone={headerTone}>{step === "done" ? "Updated" : step === "offer" ? "Step 2 of 2" : "Step 1 of 2"}</Chip>}
      />

      {step === "reason" ? (
        <div key="reason" className="animate-label-in motion-reduce:animate-none">
          <p className="text-caption-2-medium text-text-secondary">What is the main reason?</p>
          <div role="group" aria-label="Reason for cancelling" className="mt-1 flex flex-col">
            {CANCEL_REASONS.map((option) => {
              const active = reason === option;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setReason(option)}
                  className={cx(
                    "flex h-6 items-center gap-2 rounded-sm text-start transition-[color] duration-150 ease-out motion-reduce:transition-none",
                    active ? "text-text-primary" : "text-text-secondary hover:text-text-primary",
                    focusRing,
                  )}
                >
                  <span
                    aria-hidden
                    className={cx(
                      "flex size-3 items-center justify-center rounded-full border",
                      active ? "border-accent-600 bg-accent-600" : "border-border-checkbox-default",
                    )}
                  >
                    {active ? <span className="size-1 rounded-full bg-control-indicator-background" /> : null}
                  </span>
                  <span className="text-caption-1-medium">{option}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-1.5 flex items-center gap-1">
            <button type="button" onClick={reset} className={quietButton}>Keep plan</button>
            <button type="button" disabled={!reason} onClick={() => setStep("offer")} className={cx(primaryButton, "h-7 ms-auto")}>
              Continue
              <RiArrowRightLine className="size-3 rtl:-scale-x-100" aria-hidden />
            </button>
          </div>
        </div>
      ) : null}

      {step === "offer" ? (
        <div key="offer" className="animate-label-in motion-reduce:animate-none">
          <div className="rounded-lg bg-background-secondary-default p-2">
            <p className="flex items-center gap-1.5 text-caption-1-semibold text-text-primary">
              <RiPauseCircleLine className="size-3.5 text-accent-600" aria-hidden />
              Pause for 3 months instead
            </p>
            <p className={cx(meta, "mt-0.5")}>Keep boards, history and all 8 seats. Billing resumes Mar 1, 2027.</p>
          </div>
          <button type="button" onClick={() => finish("paused")} className={cx(primaryButton, "mt-1.5 h-7 w-full")}>
            Pause my plan
          </button>
          <div className="mt-1 flex items-center justify-between gap-1">
            <button type="button" onClick={() => setStep("reason")} className={quietButton}>Back</button>
            <button type="button" onClick={() => finish("cancelled")} className={cx(dangerButton, "h-6")}>Cancel anyway</button>
          </div>
        </div>
      ) : null}

      {step === "done" ? (
        <div key="done" className="animate-label-in motion-reduce:animate-none">
          <div
            className={cx(
              "flex items-start gap-2 rounded-lg p-2",
              outcome === "paused" ? "bg-status-lime-background text-status-lime-text" : "bg-status-rose-background text-status-rose-text",
            )}
          >
            {outcome === "paused" ? (
              <RiPauseCircleLine className="mt-0.5 size-4 shrink-0" aria-hidden />
            ) : (
              <RiErrorWarningLine className="mt-0.5 size-4 shrink-0" aria-hidden />
            )}
            <div className="min-w-0">
              <p className="text-caption-1-semibold">
                {outcome === "paused" ? "Plan paused until Mar 1, 2027" : "Subscription cancelled"}
              </p>
              <p className="text-caption-2-regular">
                {outcome === "paused"
                  ? "Nothing is deleted. Billing resumes automatically."
                  : "Access ends Dec 1, 2026. Export your boards before then."}
              </p>
            </div>
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <span className={cx(meta, "min-w-0 truncate")}>Reason: {reason ?? "Not given"}</span>
            <button type="button" onClick={reset} className={cx(softButton, "h-7 shrink-0")}>
              <RiRefreshLine className="size-3.5" aria-hidden />
              Reactivate
            </button>
          </div>
        </div>
      ) : null}

      <span className="sr-only" aria-live="polite">
        {step === "done"
          ? outcome === "paused" ? "Plan paused until March 1, 2027." : "Subscription cancelled. Access ends December 1, 2026."
          : step === "offer" ? "Retention offer shown." : "Choose a cancellation reason."}
      </span>
    </section>
  );
}

/* 10 · Dunning Banner */

type DunningStatus = "failed" | "retrying" | "paid";

export function DunningBanner() {
  const [status, setStatus] = useState<DunningStatus>("failed");
  const [backupReady, setBackupReady] = useState(false);

  useEffect(() => {
    if (status !== "retrying") return;
    const timer = window.setTimeout(() => setStatus("paid"), 1100);
    return () => window.clearTimeout(timer);
  }, [status]);

  const paid = status === "paid";

  return (
    <section aria-label="Payment status" className={cx(card, "flex flex-col gap-2")}>
      <Head
        icon={paid ? RiCheckLine : RiErrorWarningLine}
        iconClassName={paid ? "bg-status-lime-background text-status-lime-text" : "bg-status-rose-background text-status-rose-text"}
        title={paid ? "Payment received" : status === "retrying" ? "Retrying payment" : "Payment failed"}
        detail={paid ? "Invoice DF-2041 · paid Nov 5" : "Visa ···· 4242 declined on Nov 4"}
        trailing={<Chip tone={paid ? "lime" : status === "retrying" ? "neutral" : "rose"}>{paid ? "Paid" : status === "retrying" ? "Retrying" : "Action needed"}</Chip>}
      />

      <div className="flex items-center justify-between gap-2 rounded-lg bg-background-secondary-default px-2 py-1.5">
        <p className="flex items-baseline gap-1">
          <span dir="ltr" className="text-body-2-semibold text-text-primary tabular-nums">{usd.format(INVOICE_TOTAL)}</span>
          <span className={meta}>invoice</span>
        </p>
        <span className={cx(meta, "truncate text-end")}>
          {paid ? "Receipt sent to finance" : status === "retrying" ? "Contacting the bank" : "Retry scheduled Nov 7"}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        {paid ? (
          <button type="button" onClick={() => { setStatus("failed"); setBackupReady(false); }} className={cx(softButton, "h-7 w-full")}>
            <RiRefreshLine className="size-3.5" aria-hidden />
            Reset demo
          </button>
        ) : (
          <>
            <button type="button" disabled={status === "retrying"} onClick={() => setStatus("retrying")} className={cx(primaryButton, "h-7 flex-1")}>
              {status === "retrying" ? (
                <><RiLoader4Line className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />Retrying</>
              ) : (
                <><RiBankCardLine className="size-3.5" aria-hidden />Retry payment</>
              )}
            </button>
            <button type="button" disabled={backupReady || status === "retrying"} onClick={() => setBackupReady(true)} className={cx(softButton, "h-7 shrink-0")}>
              {backupReady ? <><RiCheckLine className="size-3 text-status-lime-text" aria-hidden />Backup ready</> : "Update card"}
            </button>
          </>
        )}
      </div>

      {backupReady && !paid ? (
        <p className={cx(meta, "flex items-center gap-1")}>
          <RiCheckLine className="size-3 text-status-lime-text" aria-hidden />
          Backup Visa ending 1881 is on file.
        </p>
      ) : null}

      <span className="sr-only" aria-live="polite">
        {paid
          ? "Payment received. Invoice DF-2041 is paid."
          : status === "retrying" ? "Retrying the card charge."
          : backupReady ? "Backup card ending 1881 is ready." : "Payment failed. Retry available."}
      </span>
    </section>
  );
}

/* 11 · Payout Row */

export function PayoutRow() {
  const detailsId = useId();
  const [open, setOpen] = useState(false);

  return (
    <section aria-label="Next payout" className="w-full max-w-[320px] overflow-hidden rounded-xl border border-border-button-default bg-background-primary-default shadow-xs">
      <button
        type="button"
        aria-label={`${open ? "Hide" : "Show"} payout of ${usd.format(2480)} on November 14, in transit`}
        aria-expanded={open}
        aria-controls={detailsId}
        onClick={() => setOpen((next) => !next)}
        className={cx(
          "flex w-full items-center gap-2.5 p-2.5 text-start",
          "transition-[background-color] duration-150 ease-out hover:bg-background-primary-hover motion-reduce:transition-none",
          focusRing,
          "focus-visible:ring-inset",
        )}
      >
        <span aria-hidden className="flex size-9 shrink-0 flex-col items-center justify-center rounded-lg bg-background-secondary-default">
          <span className="text-caption-2-semibold tracking-wide text-text-tertiary uppercase">Nov</span>
          <span className="text-caption-1-semibold text-text-primary tabular-nums">14</span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-caption-1-semibold text-text-primary">Stripe payout</span>
          <span className={cx(meta, "block truncate")}>Next payout · 4-day rolling</span>
        </span>
        <span className="shrink-0 text-end">
          <span dir="ltr" className="block text-body-2-semibold text-text-primary tabular-nums">{usd.format(2480)}</span>
          <Chip tone="orange">In transit</Chip>
        </span>
        <RiArrowDownSLine
          className={cx(
            "size-3.5 shrink-0 text-foreground-icon-tertiary transition-transform duration-200 ease-out motion-reduce:transition-none",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      <Reveal id={detailsId} open={open}>
        <div className="px-2.5 pb-2.5">
          <dl className="grid grid-cols-3 gap-1.5 rounded-lg bg-background-secondary-default px-2 py-1.5">
            <div>
              <dt className={meta}>Gross</dt>
              <dd dir="ltr" className="text-caption-2-semibold text-text-primary tabular-nums">{usd.format(2552.4)}</dd>
            </div>
            <div>
              <dt className={meta}>Fees</dt>
              <dd dir="ltr" className="text-caption-2-semibold text-text-secondary tabular-nums">−{usd.format(72.4)}</dd>
            </div>
            <div>
              <dt className={meta}>Net</dt>
              <dd dir="ltr" className="text-caption-2-semibold text-text-primary tabular-nums">{usd.format(2480)}</dd>
            </div>
          </dl>
          <p className={cx(meta, "mt-1 flex items-center gap-1")}>
            <RiCalendarEventLine className="size-3 shrink-0" aria-hidden />
            Arrives Nov 16 · reference PO-8841
          </p>
        </div>
      </Reveal>
    </section>
  );
}

/* 12 · Credit Balance */

export function CreditBalance() {
  const [autoApply, setAutoApply] = useState(true);
  const [applied, setApplied] = useState(false);
  const balance = applied ? 0 : 120;
  const nextInvoice = INVOICE_TOTAL - (applied ? 120 : 0);

  return (
    <section aria-label="Account credit" className={cx(card, "flex flex-col gap-1.5")}>
      <Head
        icon={RiCoupon3Line}
        title="Credit balance"
        detail="Referral credits · 1 credit"
        trailing={<Chip tone={applied ? "lime" : "accent"}>{applied ? "Applied" : "Available"}</Chip>}
      />

      <div className="flex items-end justify-between gap-2">
        <p className="flex items-baseline gap-1">
          <span
            key={balance}
            className={cx(
              "animate-number-fade text-title-3-semibold tabular-nums motion-reduce:animate-none",
              applied ? "text-text-tertiary" : "text-text-primary",
            )}
          >
            {usd.format(balance)}
          </span>
          <span className={meta}>credit</span>
        </p>
        <p className={cx(meta, "flex items-center gap-1 pb-0.5 text-end")}>
          <RiCalendarEventLine className="size-3 shrink-0" aria-hidden />
          Expires Mar 31, 2027
        </p>
      </div>

      <div className="flex items-center justify-between gap-2 rounded-lg bg-background-secondary-default px-2 py-1">
        <div className="min-w-0">
          <p className="truncate text-caption-2-medium text-text-primary">Apply automatically</p>
          <p className={cx(meta, "truncate")}>To invoice DF-2042 · {usd.format(INVOICE_TOTAL)}</p>
        </div>
        <Switch checked={autoApply} label="Apply credit automatically to the next invoice" onChange={setAutoApply} />
      </div>

      <div className="flex items-center justify-between gap-2">
        <span aria-live="polite" className={cx(meta, "min-w-0 truncate")}>
          {applied ? `Next invoice drops to ${usd.format(nextInvoice)}` : autoApply ? "Ready for invoice DF-2042" : "Manual application only"}
        </span>
        {applied ? (
          <button type="button" onClick={() => setApplied(false)} className={cx(softButton, "h-7 shrink-0")}>
            <RiRefreshLine className="size-3.5" aria-hidden />
            Undo
          </button>
        ) : (
          <button type="button" onClick={() => setApplied(true)} className={cx(primaryButton, "h-7 shrink-0 px-2")}>
            Apply {usd0.format(120)}
          </button>
        )}
      </div>
    </section>
  );
}

/* Specimens */

export const BILLING_SECTION: ExtendedSection = {
  id: "billing",
  title: "Billing",
  blurb: "Plans, usage and the money conversations a product cannot avoid.",
  file: "billing.tsx",
  entries: [
    { name: "Plan Card", description: "Current plan, renewal, seats and a one-tap plan switch.", Demo: PlanCard },
    { name: "Seat Manager", description: "Add or remove seats and see the prorated charge before confirming.", Demo: SeatManager },
    { name: "Upgrade Dialog", description: "Pick a higher tier in a compact dialog and confirm the change.", Demo: UpgradeDialog },
    { name: "Invoice Detail", description: "Line items, tax, total and a PDF download that reports back.", Demo: InvoiceDetail, wide: true },
    { name: "Billing History", description: "Past periods filtered by status, with invoice detail on demand.", Demo: BillingHistory },
    { name: "Proration Preview", description: "What a mid-cycle upgrade actually costs, day by day.", Demo: ProrationPreview },
    { name: "Spend Limit", description: "A monthly cap, an alert threshold and usage that says which one hit.", Demo: SpendLimit },
    { name: "Tax ID Field", description: "Country, VAT ID and validation with a plain-language result.", Demo: TaxIdField },
    { name: "Cancel Flow", description: "A reason, a pause offer and a final confirmation.", Demo: CancelFlow },
    { name: "Dunning Banner", description: "A declined card banner with retry and a backup-card path.", Demo: DunningBanner },
    { name: "Payout Row", description: "Payout date, amount, status and the fee breakdown.", Demo: PayoutRow },
    { name: "Credit Balance", description: "Available credit, expiry and one-tap application.", Demo: CreditBalance },
  ],
};
