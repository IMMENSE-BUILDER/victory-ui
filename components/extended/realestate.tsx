"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  RiArrowDownSLine,
  RiArrowLeftSLine,
  RiArrowRightLine,
  RiArrowRightSLine,
  RiBellLine,
  RiCalendarLine,
  RiCheckLine,
  RiDropLine,
  RiFileCopyLine,
  RiHeartFill,
  RiHeartLine,
  RiHotelBedLine,
  RiMailLine,
  RiMapPinLine,
  RiPhoneLine,
  RiRulerLine,
  RiSearchLine,
  RiStarFill,
  RiTimeLine,
  RiVerifiedBadgeLine,
  RiWalkLine,
} from "@remixicon/react";
import { Switch } from "@/components/base/switch/switch";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* Shared */

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";
const card =
  "w-full rounded-xl border border-border-button-default bg-background-primary-default shadow-card";
const buttonBase =
  "inline-flex items-center justify-center gap-1.5 rounded-lg text-caption-1-semibold " +
  "transition-[transform,opacity,background-color,color,box-shadow] duration-150 ease-out " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 " +
  "motion-reduce:transition-none motion-reduce:active:scale-100";
const primaryButton = cx(
  buttonBase,
  "h-7 bg-button-primary px-2.5 text-text-white shadow-xs",
  focusRing,
);
const secondaryButton = cx(
  buttonBase,
  "h-7 border border-border-button-default bg-background-primary-default px-2.5 text-text-primary shadow-xs hover:bg-background-primary-hover",
  focusRing,
);
const iconButton = cx(
  "flex size-6 shrink-0 items-center justify-center rounded-full bg-background-primary-default/90 text-foreground-icon-secondary shadow-xs",
  "transition-[transform,background-color,color] duration-150 ease-out hover:bg-background-primary-default hover:text-text-primary active:scale-95",
  "motion-reduce:transition-none motion-reduce:active:scale-100",
  focusRing,
);
const metaText = "text-caption-2-regular text-text-tertiary";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const compactUsd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
});
const count = new Intl.NumberFormat("en-US");

type Tone = "neutral" | "lime" | "yellow" | "blue";

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-background-secondary-default text-text-secondary",
  lime: "bg-status-lime-background text-status-lime-text",
  yellow: "bg-status-yellow-background text-status-yellow-text",
  blue: "bg-status-blue-background text-status-blue-text",
};

function Pill({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-caption-2-semibold",
        TONE_CLASS[tone],
      )}
    >
      {children}
    </span>
  );
}

function Segmented({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label: string;
  value: string;
  options: readonly { value: string; label: string; ariaLabel?: string }[];
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div role="group" aria-label={label} className={cx("grid gap-0.5 rounded-md bg-background-secondary-default p-0.5", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          aria-label={option.ariaLabel}
          onClick={() => onChange(option.value)}
          className={cx(
            "h-6 rounded-sm text-caption-2-semibold transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
            focusRing,
            value === option.value
              ? "bg-segmented-control-selected-background text-text-primary shadow-xs"
              : "text-text-tertiary hover:text-text-secondary",
          )}
        >
          <bdi dir="ltr">{option.label}</bdi>
        </button>
      ))}
    </div>
  );
}

/* 1. Listing Card */

const LISTING = {
  price: 1_285_000, address: "1428 Sanchez Street", city: "San Francisco, CA 94114",
  beds: 3, baths: 2, sqft: 1_640,
} as const;

function ListingArt() {
  return (
    <svg
      viewBox="0 0 300 72"
      preserveAspectRatio="xMidYMid slice"
      className="h-16 w-full"
      aria-hidden
    >
      <rect width="300" height="72" className="fill-background-tertiary-default" />
      <circle cx="248" cy="18" r="13" className="fill-status-yellow-background" />
      <path d="M0 58 38 40l24 8 20-16 34 14 30-8 32 12 28-14 30 12 36-8 28 10v12H0z" className="fill-accent-200" />
      <path d="M84 72V38h104v34z" className="fill-accent-700" />
      <path d="M74 40 136 8l62 32z" className="fill-accent-800" />
      <rect x="96" y="46" width="18" height="14" rx="1.5" className="fill-status-yellow-background" />
      <rect x="126" y="46" width="18" height="14" rx="1.5" className="fill-background-primary-default" />
      <path d="M158 72V50a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v22z" className="fill-accent-950" />
      <circle cx="56" cy="48" r="10" className="fill-accent-500" />
      <rect x="54" y="48" width="4" height="24" className="fill-accent-800" />
    </svg>
  );
}

export function ListingCard() {
  const [saved, setSaved] = useState(false);

  return (
    <section aria-label={`Listing at ${LISTING.address}`} className={cx(card, "max-w-[300px] overflow-hidden")}>
      <div className="relative">
        <ListingArt />
        <span className="absolute start-2 top-2 rounded-full bg-background-primary-default/90 px-1.5 py-0.5 text-caption-2-semibold text-text-primary shadow-xs">
          For sale
        </span>
        <button
          type="button"
          aria-label={saved ? "Remove from saved homes" : "Save this home"}
          aria-pressed={saved}
          onClick={() => setSaved((current) => !current)}
          className={cx(
            "absolute end-2 top-2 flex size-7 items-center justify-center rounded-full bg-background-primary-default/90 shadow-xs",
            "transition-[transform,color,background-color] duration-200 ease-out active:scale-90",
            "motion-reduce:transition-none motion-reduce:active:scale-100",
            focusRing,
            saved ? "text-status-rose-text" : "text-foreground-icon-secondary hover:text-text-primary",
          )}
        >
          {saved ? (
            <RiHeartFill className="size-4 animate-label-in motion-reduce:animate-none" aria-hidden />
          ) : (
            <RiHeartLine className="size-4" aria-hidden />
          )}
        </button>
      </div>

      <div className="p-2.5">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-title-3-semibold text-text-primary tabular-nums">
            <bdi dir="ltr">{usd.format(LISTING.price)}</bdi>
          </p>
          <span
            className={cx(
              "shrink-0 text-caption-2-medium transition-colors duration-200 ease-out motion-reduce:transition-none",
              saved ? "text-status-rose-text" : "text-text-tertiary",
            )}
          >
            {saved ? "Saved" : "New today"}
          </span>
        </div>
        <p className="mt-0.5 truncate text-caption-1-medium text-text-primary">{LISTING.address}</p>
        <p className="flex items-center gap-0.5 truncate text-caption-2-regular text-text-tertiary">
          <RiMapPinLine className="size-3 shrink-0" aria-hidden />
          {LISTING.city}
        </p>
        <div className="mt-1.5 flex items-center gap-2.5 border-t border-separator-border pt-1.5 text-caption-2-medium text-text-secondary">
          <span className="flex items-center gap-1">
            <RiHotelBedLine className="size-3.5 text-foreground-icon-tertiary" aria-hidden />
            {LISTING.beds} bd
          </span>
          <span className="flex items-center gap-1">
            <RiDropLine className="size-3.5 text-foreground-icon-tertiary" aria-hidden />
            {LISTING.baths} ba
          </span>
          <span className="flex items-center gap-1 tabular-nums">
            <RiRulerLine className="size-3.5 text-foreground-icon-tertiary" aria-hidden />
            <bdi dir="ltr">{count.format(LISTING.sqft)} sq ft</bdi>
          </span>
        </div>
      </div>
    </section>
  );
}

/* 2. Floor Plan */

const FLOOR_ROOMS = [
  { id: "living", name: "Living", dims: "24' × 16'", detail: "South-facing · 384 sq ft", span: "col-span-3" },
  { id: "kitchen", name: "Kitchen", dims: "12' × 14'", detail: "Renovated 2024 · 168 sq ft", span: "col-span-2" },
  { id: "bedroom", name: "Bedroom", dims: "14' × 12'", detail: "Walk-in closet · 168 sq ft", span: "col-span-3" },
  { id: "bath", name: "Bath", dims: "6' × 8'", detail: "Heated floor · 48 sq ft", span: "col-span-2" },
] as const;

type RoomId = (typeof FLOOR_ROOMS)[number]["id"];

export function FloorPlan() {
  const [selected, setSelected] = useState<RoomId>("living");
  const room = FLOOR_ROOMS.find((item) => item.id === selected) ?? FLOOR_ROOMS[0];

  return (
    <section aria-label="Second floor plan" className={cx(card, "max-w-[300px] p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Second floor</h3>
        <span className={metaText}>
          <bdi dir="ltr">768 sq ft</bdi> · 1 bed
        </span>
      </div>

      <div role="group" aria-label="Rooms" className="mt-1.5 grid grid-cols-5 gap-px overflow-hidden rounded-lg bg-separator-border">
        {FLOOR_ROOMS.map((item) => {
          const active = item.id === selected;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => setSelected(item.id)}
              className={cx(
                "relative flex h-10 flex-col items-start justify-center gap-0.5 p-1.5 text-start",
                "transition-[background-color,box-shadow,color] duration-200 ease-out motion-reduce:transition-none",
                focusRing,
                item.span,
                active
                  ? "bg-background-secondary-default ring-2 ring-inset ring-accent-500"
                  : "bg-background-primary-default hover:bg-background-secondary-default",
              )}
            >
              <span className="flex w-full items-center justify-between gap-1">
                <span className="truncate text-caption-2-semibold text-text-primary">{item.name}</span>
                <span
                  className={cx(
                    "size-1.5 shrink-0 rounded-full bg-accent-500 transition-opacity duration-200 ease-out motion-reduce:transition-none",
                    active ? "opacity-100" : "opacity-0",
                  )}
                  aria-hidden
                />
              </span>
              <span className="text-caption-2-regular text-text-tertiary tabular-nums">
                <bdi dir="ltr">{item.dims}</bdi>
              </span>
            </button>
          );
        })}
      </div>

      <div
        key={room.id}
        aria-live="polite"
        className="mt-1.5 flex animate-label-in items-center justify-between gap-2 rounded-md bg-background-secondary-default px-2 py-1 motion-reduce:animate-none"
      >
        <span className="min-w-0 truncate text-caption-2-medium text-text-primary">
          {room.name} · {room.detail}
        </span>
        <span className="shrink-0 text-caption-2-semibold text-text-secondary tabular-nums">
          <bdi dir="ltr">{room.dims}</bdi>
        </span>
      </div>
    </section>
  );
}

/* 3. Mortgage Calculator */

const PRICE_MIN = 400_000;
const PRICE_MAX = 1_600_000;
const PRICE_STEP = 25_000;
const DOWN_OPTIONS = [5, 10, 20] as const;
const RATE_OPTIONS = [5.75, 6.25, 6.75] as const;

function monthlyPayment(price: number, downPercent: number, rate: number) {
  const principal = price * (1 - downPercent / 100);
  const monthlyRate = rate / 100 / 12;
  const factor = Math.pow(1 + monthlyRate, 360);
  return Math.round((principal * monthlyRate * factor) / (factor - 1));
}

export function MortgageCalculator() {
  const priceId = useId();
  const [price, setPrice] = useState(850_000);
  const [down, setDown] = useState<number>(20);
  const [rate, setRate] = useState<number>(6.25);

  const principal = price * (1 - down / 100);
  const payment = monthlyPayment(price, down, rate);
  const interest = Math.round(principal * (rate / 100 / 12));
  const principalPart = payment - interest;
  const principalShare = Math.round((principalPart / payment) * 100);

  return (
    <section aria-label="Mortgage calculator" className={cx(card, "max-w-[300px] p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={priceId} className="text-caption-1-medium text-text-secondary">
          Home price
        </label>
        <output htmlFor={priceId} className="text-body-2-semibold text-text-primary tabular-nums">
          <bdi dir="ltr">{usd.format(price)}</bdi>
        </output>
      </div>
      <input
        id={priceId}
        type="range"
        min={PRICE_MIN}
        max={PRICE_MAX}
        step={PRICE_STEP}
        value={price}
        aria-valuetext={usd.format(price)}
        onChange={(event) => setPrice(Number(event.target.value))}
        className={cx(
          "mt-0.5 h-5 w-full cursor-pointer accent-accent-600",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
        )}
      />

      <div className="mt-0.5 grid grid-cols-2 gap-2">
        <div>
          <div className="flex items-baseline justify-between gap-1">
            <span className="text-caption-1-medium text-text-secondary">Down</span>
            <span className="text-caption-2-semibold text-text-primary tabular-nums">
              <bdi dir="ltr">{down}% · {usd.format(price * (down / 100))}</bdi>
            </span>
          </div>
          <Segmented
            label="Down payment"
            value={String(down)}
            onChange={(next) => setDown(Number(next))}
            options={DOWN_OPTIONS.map((option) => ({ value: String(option), label: `${option}%` }))}
            className="mt-1 grid-cols-3"
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-1">
            <span className="text-caption-1-medium text-text-secondary">Rate</span>
            <span className="text-caption-2-semibold text-text-primary tabular-nums">
              <bdi dir="ltr">{rate}%</bdi>
            </span>
          </div>
          <Segmented
            label="Interest rate"
            value={String(rate)}
            onChange={(next) => setRate(Number(next))}
            options={RATE_OPTIONS.map((option) => ({ value: String(option), label: String(option) }))}
            className="mt-1 grid-cols-3"
          />
        </div>
      </div>

      <div className="mt-1.5 rounded-lg bg-background-secondary-default px-2 py-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <p aria-live="polite" className="flex items-baseline gap-1">
            <span className="text-title-3-semibold text-text-primary tabular-nums">
              <bdi dir="ltr">{usd.format(payment)}</bdi>
            </span>
            <span className="text-caption-2-regular text-text-tertiary">/ mo</span>
          </p>
          <span className="text-caption-2-regular text-text-tertiary">
            <bdi dir="ltr">30-yr fixed</bdi>
          </span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <div className="flex h-1 flex-1 overflow-hidden rounded-full bg-background-tertiary-default">
            <span
              className="bg-accent-500 transition-[width] duration-200 ease-out motion-reduce:transition-none"
              style={{ width: `${principalShare}%` }}
            />
            <span className="flex-1 bg-status-yellow-text/60" />
          </div>
          <span className="shrink-0 text-caption-2-semibold text-text-tertiary tabular-nums">
            {principalShare}% principal
          </span>
        </div>
        <p className="mt-0.5 text-caption-2-regular text-text-tertiary tabular-nums">
          <bdi dir="ltr">
            {usd.format(principalPart)} principal · {usd.format(interest)} interest
          </bdi>
        </p>
      </div>
    </section>
  );
}

/* 4. Tour Scheduler */

const TOUR_DATES = [
  { id: "thu", weekday: "Thu", day: "12", full: "Thursday, November 12" },
  { id: "fri", weekday: "Fri", day: "13", full: "Friday, November 13" },
  { id: "sat", weekday: "Sat", day: "14", full: "Saturday, November 14" },
  { id: "sun", weekday: "Sun", day: "15", full: "Sunday, November 15" },
] as const;

const TOUR_TIMES = ["9:00 AM", "11:30 AM", "2:00 PM"] as const;

type TourDateId = (typeof TOUR_DATES)[number]["id"];
type TourTime = (typeof TOUR_TIMES)[number];

export function TourScheduler() {
  const [dateId, setDateId] = useState<TourDateId>("sat");
  const [time, setTime] = useState<TourTime>("2:00 PM");
  const [confirmed, setConfirmed] = useState(false);
  const date = TOUR_DATES.find((item) => item.id === dateId) ?? TOUR_DATES[0];

  const chooseDate = (id: TourDateId) => {
    setDateId(id);
    setConfirmed(false);
  };

  const chooseTime = (next: TourTime) => {
    setTime(next);
    setConfirmed(false);
  };

  return (
    <section aria-label="Schedule a tour" className={cx(card, "max-w-[300px] p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Schedule a tour</h3>
        <span className={metaText}>30 min · in person</span>
      </div>

      <div role="group" aria-label="Tour date" className="mt-1.5 grid grid-cols-4 gap-1">
        {TOUR_DATES.map((item) => {
          const active = item.id === dateId;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              aria-label={item.full}
              onClick={() => chooseDate(item.id)}
              className={cx(
                "flex flex-col items-center rounded-lg border py-1",
                "transition-[background-color,border-color,box-shadow,color] duration-200 ease-out motion-reduce:transition-none",
                focusRing,
                active
                  ? "border-accent-500 bg-background-secondary-default shadow-xs"
                  : "border-border-button-default bg-background-primary-default hover:bg-background-primary-hover",
              )}
            >
              <span className={cx("text-caption-2-medium", active ? "text-text-primary" : "text-text-tertiary")}>
                {item.weekday}
              </span>
              <span className="text-body-2-semibold text-text-primary tabular-nums">{item.day}</span>
            </button>
          );
        })}
      </div>

      <Segmented
        label="Tour time"
        value={time}
        onChange={(next) => chooseTime(next as TourTime)}
        options={TOUR_TIMES.map((option) => ({ value: option, label: option }))}
        className="mt-1.5 grid-cols-3"
      />

      <button
        type="button"
        onClick={() => setConfirmed((current) => !current)}
        className={cx(confirmed ? secondaryButton : primaryButton, "mt-2 h-8 w-full")}
      >
        {confirmed ? (
          <>
            <RiCalendarLine className="size-3.5" aria-hidden />
            Change time
          </>
        ) : (
          <>
            Confirm tour
            <RiArrowRightLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
          </>
        )}
      </button>

      <p aria-live="polite" className="mt-1.5 flex items-center gap-1 text-caption-2-regular">
        {confirmed && (
          <RiCheckLine className="size-3 shrink-0 animate-label-in text-status-lime-text motion-reduce:animate-none" aria-hidden />
        )}
        <span className={cx("truncate", confirmed ? "text-status-lime-text" : "text-text-tertiary")}>
          {confirmed
            ? `Confirmed · ${date.weekday}, Nov ${date.day} · ${time}`
            : `${date.weekday}, Nov ${date.day} · ${time} with Maya Torres`}
        </span>
      </p>
    </section>
  );
}

/* 5. Agent Card */

const AGENT = {
  name: "Maya Torres", initials: "MT", brokerage: "Sotheby's International Realty",
  license: "DRE #01987221 · 14 years", phone: "(415) 555-0132", phoneHref: "tel:+14155550132",
  email: "maya.torres@sothebysrealty.com", nextTour: "Fri, Nov 13 · 10:00 AM",
} as const;

const contactRow = cx(
  "flex h-8 w-full items-center gap-2 rounded-md px-2 text-start text-caption-1-medium text-text-secondary",
  "transition-[background-color,color] duration-150 ease-out hover:bg-background-secondary-default hover:text-text-primary",
  "motion-reduce:transition-none",
  focusRing,
);

export function AgentCard() {
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const toggle = () => {
    setOpen((current) => !current);
    setCopied(false);
  };

  const copyEmail = () => {
    void navigator.clipboard?.writeText(AGENT.email).catch(() => undefined);
    setCopied(true);
  };

  return (
    <section aria-label={`Listing agent ${AGENT.name}`} className={cx(card, "max-w-[300px] p-2.5")}>
      <div ref={rootRef} className="relative">
        <div className="flex items-start gap-2.5">
          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-accent-500 to-accent-700 text-caption-1-semibold text-text-white shadow-xs"
          >
            {AGENT.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 text-body-2-semibold text-text-primary">
              <span className="truncate">{AGENT.name}</span>
              <RiVerifiedBadgeLine className="size-3.5 shrink-0 text-accent-600" aria-label="Verified agent" />
            </p>
            <p className="truncate text-caption-2-regular text-text-secondary">{AGENT.brokerage}</p>
            <p className="truncate text-caption-2-regular text-text-tertiary">{AGENT.license}</p>
          </div>
          <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-status-yellow-background px-1.5 py-0.5 text-caption-2-semibold text-status-yellow-text">
            <RiStarFill className="size-3" aria-hidden />
            4.9
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2 rounded-lg bg-background-secondary-default px-2 py-1.5">
          <span className="flex min-w-0 items-center gap-1 text-caption-2-regular text-text-secondary">
            <RiCalendarLine className="size-3.5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
            <span className="truncate">Next tour <bdi dir="ltr">{AGENT.nextTour}</bdi></span>
          </span>
          <span className="shrink-0 text-caption-2-regular text-text-tertiary">~5 min reply</span>
        </div>

        <div className="relative mt-2 flex gap-1.5">
          <a href={AGENT.phoneHref} className={cx(secondaryButton, "h-8 flex-1")}>
            <RiPhoneLine className="size-3.5" aria-hidden />
            Call
          </a>
          <button
            ref={triggerRef}
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={toggle}
            className={cx(primaryButton, "h-8 flex-1")}
          >
            <RiMailLine className="size-3.5" aria-hidden />
            Contact
            <RiArrowDownSLine
              className={cx(
                "size-3.5 transition-transform duration-200 ease-out motion-reduce:transition-none",
                open && "rotate-180",
              )}
              aria-hidden
            />
          </button>

          <div
            id={panelId}
            role="group"
            aria-label={`Contact ${AGENT.name}`}
            inert={!open}
            className={cx(
              "absolute end-0 bottom-full z-20 mb-1.5 w-[248px] rounded-lg border border-border-button-default bg-background-primary-default p-1 shadow-dropdown",
              "origin-bottom transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
              open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0",
            )}
          >
            <a href={AGENT.phoneHref} onClick={() => setOpen(false)} className={contactRow}>
              <RiPhoneLine className="size-3.5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
              <span className="flex-1">Call</span>
              <span className="text-caption-2-regular text-text-tertiary" dir="ltr">{AGENT.phone}</span>
            </a>
            <a href={`mailto:${AGENT.email}`} onClick={() => setOpen(false)} className={contactRow}>
              <RiMailLine className="size-3.5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
              <span className="min-w-0 flex-1 truncate" dir="ltr">{AGENT.email}</span>
            </a>
            <button type="button" onClick={copyEmail} className={contactRow}>
              <RiFileCopyLine className="size-3.5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
              <span className="flex-1">{copied ? "Copied to clipboard" : "Copy email"}</span>
              {copied && <RiCheckLine className="size-3.5 shrink-0 text-status-lime-text" aria-hidden />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 6. Saved Search */

const SAVED_SEARCH = {
  name: "Noe Valley · 2+ beds", criteria: ["2+ beds", "≤ $1.6M", "House", "Garage"],
  newCount: 24, total: 138,
} as const;

export function SavedSearch() {
  const [alerts, setAlerts] = useState(true);

  return (
    <section aria-label="Saved search" className={cx(card, "max-w-[300px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background-secondary-default text-foreground-icon-secondary">
          <RiSearchLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">{SAVED_SEARCH.name}</h3>
          <p className={cx(metaText, "truncate")}>Saved search · updated 2h ago</p>
        </div>
        <Switch isSelected={alerts} onChange={setAlerts} size="sm" aria-label="Daily listing alerts" />
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {SAVED_SEARCH.criteria.map((criterion) => (
          <span
            key={criterion}
            className="rounded-full bg-background-secondary-default px-1.5 py-0.5 text-caption-2-medium text-text-secondary"
          >
            {criterion}
          </span>
        ))}
      </div>

      <div
        className={cx(
          "mt-2 flex items-center gap-2 rounded-lg bg-background-secondary-default px-2 py-1.5",
          "transition-opacity duration-200 ease-out motion-reduce:transition-none",
          alerts ? "opacity-100" : "opacity-60",
        )}
      >
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-600 text-caption-2-semibold text-text-white tabular-nums">
          {SAVED_SEARCH.newCount}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-1-semibold text-text-primary">new since yesterday</p>
          <p className="truncate text-caption-2-regular text-text-tertiary">
            {SAVED_SEARCH.total} matches · 6 added today
          </p>
        </div>
        <span className="size-1.5 shrink-0 rounded-full bg-accent-500" aria-hidden />
      </div>

      <p
        aria-live="polite"
        className={cx(
          "mt-1.5 flex items-center gap-1 text-caption-2-regular transition-colors duration-200 ease-out motion-reduce:transition-none",
          alerts ? "text-text-secondary" : "text-text-tertiary",
        )}
      >
        <RiBellLine className="size-3 shrink-0" aria-hidden />
        {alerts ? "Alerts on · Daily at 9:00 AM" : "Alerts paused · Nothing will be sent"}
      </p>
    </section>
  );
}

/* 7. Neighborhood Stats */

const NEIGHBORHOOD = {
  name: "Noe Valley",
  city: "San Francisco",
  sales: 41,
  buy: { median: 1_420_000, cityMedian: 1_205_000, delta: "+18%", schools: "8/10", commute: "28 min" },
  rent: { median: 4_850, cityMedian: 4_450, delta: "+9%", schools: "8/10", commute: "28 min" },
} as const;

type Market = "buy" | "rent";

export function NeighborhoodStats() {
  const [market, setMarket] = useState<Market>("buy");
  const data = NEIGHBORHOOD[market];
  const max = Math.max(data.median, data.cityMedian);

  return (
    <section aria-label={`${NEIGHBORHOOD.name} neighborhood stats`} className={cx(card, "max-w-[300px] p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">{NEIGHBORHOOD.name}</h3>
        <span className={metaText}>
          {NEIGHBORHOOD.city} · {NEIGHBORHOOD.sales} sales
        </span>
      </div>

      <Segmented
        label="Market type"
        value={market}
        onChange={(next) => setMarket(next as Market)}
        options={[
          { value: "buy", label: "Buy" },
          { value: "rent", label: "Rent" },
        ]}
        className="mt-1.5 grid-cols-2"
      />

      <div
        key={market}
        aria-live="polite"
        className="mt-1.5 grid animate-label-in grid-cols-3 divide-x divide-separator-border rounded-lg bg-background-secondary-default py-1 motion-reduce:animate-none"
      >
        <div className="px-1.5">
          <p className="truncate text-caption-2-regular text-text-tertiary">Median</p>
          <p className="truncate text-body-2-semibold text-text-primary tabular-nums">
            <bdi dir="ltr">{market === "buy" ? compactUsd.format(data.median) : usd.format(data.median)}</bdi>
          </p>
          <p className="truncate text-caption-2-regular text-text-tertiary">{market === "buy" ? "sale price" : "per month"}</p>
        </div>
        <div className="px-1.5">
          <p className="truncate text-caption-2-regular text-text-tertiary">Schools</p>
          <p className="truncate text-body-2-semibold text-text-primary tabular-nums">{data.schools}</p>
          <p className="truncate text-caption-2-regular text-text-tertiary">out of 10</p>
        </div>
        <div className="px-1.5">
          <p className="truncate text-caption-2-regular text-text-tertiary">Commute</p>
          <p className="truncate text-body-2-semibold text-text-primary tabular-nums">
            <bdi dir="ltr">{data.commute}</bdi>
          </p>
          <p className="truncate text-caption-2-regular text-text-tertiary">to FiDi</p>
        </div>
      </div>

      <div className="mt-2 flex flex-col gap-1">
        {[
          { label: "Neighborhood", value: data.median, width: 100 },
          { label: "City", value: data.cityMedian, width: Math.round((data.cityMedian / max) * 100) },
        ].map((row) => (
          <div key={row.label} className="flex items-center gap-1.5">
            <span className="w-[68px] shrink-0 text-caption-2-regular text-text-tertiary">{row.label}</span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-background-tertiary-default">
              <span
                className={cx(
                  "block h-full rounded-full transition-[width] duration-200 ease-out motion-reduce:transition-none",
                  row.label === "Neighborhood" ? "bg-accent-500" : "bg-background-quaternary-default",
                )}
                style={{ width: `${row.width}%` }}
              />
            </span>
            <span className="w-[52px] shrink-0 text-end text-caption-2-semibold text-text-primary tabular-nums">
              <bdi dir="ltr">
                {market === "buy" ? compactUsd.format(row.value) : usd.format(row.value)}
              </bdi>
            </span>
          </div>
        ))}
      </div>

      <p className="mt-1.5 text-caption-2-regular text-text-tertiary">
        {data.delta} vs city median · 90-day figures
      </p>
    </section>
  );
}

/* 8. Offer Tracker */

type OfferStatus = "Accepted" | "Countered" | "Pending";

const OFFERS = [
  { id: "chen", name: "Lena Chen", initials: "LC", amount: 1_312_000, down: "20% down", status: "Accepted", note: "21-day close · no contingencies" },
  { id: "ortega", name: "Marco Ortega", initials: "MO", amount: 1_295_000, down: "25% down", status: "Countered", note: "Seller countered at $1,320,000" },
  { id: "whitfield", name: "June Whitfield", initials: "JW", amount: 1_280_000, down: "30% down", status: "Pending", note: "Awaiting proof of funds" },
] as const;

const OFFER_TONE: Record<OfferStatus, Tone> = {
  Accepted: "lime",
  Countered: "yellow",
  Pending: "blue",
};

export function OfferTracker() {
  const [selected, setSelected] = useState<string>(OFFERS[0].id);
  const current = OFFERS.find((offer) => offer.id === selected) ?? OFFERS[0];

  return (
    <section aria-label="Offer tracker" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Offers</h3>
        <span className={metaText}>1428 Sanchez St · 3 offers</span>
      </div>

      <div role="group" aria-label="Offers received" className="mt-1.5 flex flex-col gap-0.5">
        {OFFERS.map((offer) => {
          const active = offer.id === selected;
          return (
            <button
              key={offer.id}
              type="button"
              aria-pressed={active}
              onClick={() => setSelected(offer.id)}
              className={cx(
                "flex w-full items-center gap-2 rounded-md border px-1.5 py-1 text-start",
                "transition-[background-color,border-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                active
                  ? "border-accent-500 bg-background-secondary-default"
                  : "border-transparent hover:bg-background-secondary-default",
              )}
            >
              <span
                aria-hidden
                className="flex size-5 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-accent-500 to-accent-700 text-caption-2-semibold text-text-white shadow-xs"
              >
                {offer.initials}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-caption-1-semibold text-text-primary">{offer.name}</span>
                <span className="block text-caption-2-regular text-text-tertiary">{offer.down}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1.5">
                <span className="text-caption-1-semibold text-text-primary tabular-nums">
                  <bdi dir="ltr">{usd.format(offer.amount)}</bdi>
                </span>
                <Pill tone={OFFER_TONE[offer.status]}>{offer.status}</Pill>
              </span>
            </button>
          );
        })}
      </div>

      <p
        key={current.id}
        aria-live="polite"
        className="mt-1.5 flex animate-label-in items-center gap-1 border-t border-separator-border pt-1.5 text-caption-2-regular text-text-secondary motion-reduce:animate-none"
      >
        <RiTimeLine className="size-3 shrink-0 text-foreground-icon-tertiary" aria-hidden />
        <span className="truncate">{current.note}</span>
      </p>
    </section>
  );
}

/* 9. Lease Summary */

const LEASE = {
  unit: "14A Cedar Court", term: "Aug 1, 2026 – Jul 31, 2027",
  rent: 3_450, deposit: 6_900, renewal: "+$75", monthsElapsed: 3, monthsTotal: 12,
} as const;

export function LeaseSummary() {
  const [requested, setRequested] = useState(false);
  const progress = Math.round((LEASE.monthsElapsed / LEASE.monthsTotal) * 100);

  return (
    <section aria-label="Lease summary" className={cx(card, "max-w-[300px] p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">{LEASE.unit}</h3>
        <Pill tone="lime">Active</Pill>
      </div>

      <div className="mt-1.5 flex items-baseline justify-between gap-2">
        <span className="shrink-0 text-caption-2-regular text-text-tertiary">Term</span>
        <span className="truncate text-caption-1-medium text-text-primary">
          <bdi dir="ltr">{LEASE.term}</bdi>
        </span>
      </div>

      <dl className="mt-1.5 grid grid-cols-3 gap-1 rounded-lg bg-background-secondary-default p-1.5">
        <div className="min-w-0">
          <dt className="text-caption-2-regular text-text-tertiary">Rent</dt>
          <dd className="truncate text-caption-1-semibold text-text-primary tabular-nums">
            <bdi dir="ltr">{usd.format(LEASE.rent)}</bdi><span className="text-caption-2-regular text-text-tertiary"> /mo</span>
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-caption-2-regular text-text-tertiary">Deposit</dt>
          <dd className="truncate text-caption-1-semibold text-text-primary tabular-nums">
            <bdi dir="ltr">{usd.format(LEASE.deposit)}</bdi>
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-caption-2-regular text-text-tertiary">Renewal</dt>
          <dd className="truncate text-caption-1-semibold text-text-primary tabular-nums">
            <bdi dir="ltr">{LEASE.renewal}</bdi><span className="text-caption-2-regular text-text-tertiary"> /mo</span>
          </dd>
        </div>
      </dl>

      <div className="mt-2">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-caption-2-regular text-text-tertiary">
            {LEASE.monthsElapsed} of {LEASE.monthsTotal} months
          </span>
          <span
            aria-live="polite"
            className={cx(
              "truncate text-caption-2-regular transition-colors duration-200 ease-out motion-reduce:transition-none",
              requested ? "text-status-lime-text" : "text-text-tertiary",
            )}
          >
            {requested ? "Maya confirms in 2 days" : <>Renews <bdi dir="ltr">Jul 31, 2027</bdi></>}
          </span>
        </div>
        <div role="progressbar" aria-label="Lease elapsed" aria-valuemin={0} aria-valuemax={LEASE.monthsTotal} aria-valuenow={LEASE.monthsElapsed} className="mt-1">
          <div className="h-1 overflow-hidden rounded-full bg-background-tertiary-default">
            <div
              className="h-full rounded-full bg-accent-500 transition-[width] duration-200 ease-out motion-reduce:transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {requested ? (
        <div className="mt-2 flex h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-status-lime-background text-caption-1-semibold text-status-lime-text">
          <RiCheckLine className="size-3.5 animate-label-in motion-reduce:animate-none" aria-hidden />
          Renewal requested
        </div>
      ) : (
        <button type="button" onClick={() => setRequested(true)} className={cx(primaryButton, "mt-2 h-8 w-full")}>
          Request renewal
          <RiArrowRightLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
        </button>
      )}
    </section>
  );
}

/* 10. Property Gallery */

const PROPERTY_PHOTOS = [
  {
    label: "Living room", detail: "South-facing · 24' × 18'",
    tone: "bg-linear-to-br from-accent-200 via-accent-400 to-chart-4", block: "bg-accent-900/50", kind: "living",
  },
  {
    label: "Kitchen", detail: "Quartz island · renovated 2024",
    tone: "bg-linear-to-br from-status-yellow-background via-accent-100 to-chart-2", block: "bg-accent-800/50", kind: "kitchen",
  },
  {
    label: "Primary suite", detail: "Walk-in closet · 15' × 13'",
    tone: "bg-linear-to-br from-chart-3 via-accent-300 to-accent-600", block: "bg-accent-950/45", kind: "bedroom",
  },
  {
    label: "Roof deck", detail: "City views · 480 sq ft",
    tone: "bg-linear-to-br from-status-cyan-background via-chart-2 to-accent-500", block: "bg-accent-800/50", kind: "deck",
  },
  {
    label: "Bath", detail: "Heated floors · updated 2023",
    tone: "bg-linear-to-br from-accent-100 via-status-blue-background to-chart-1", block: "bg-accent-700/45", kind: "bath",
  },
] as const;

type PropertyPhoto = (typeof PROPERTY_PHOTOS)[number];

function GalleryArt({ photo }: { photo: PropertyPhoto }) {
  return (
    <span aria-hidden className={cx("absolute inset-0 overflow-hidden", photo.tone)}>
      <span className="absolute -end-3 -top-5 size-20 rounded-full bg-background-primary-default/25" />
      <span className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-accent-950/45 to-transparent" />

      {photo.kind === "living" && (
        <>
          <span className="absolute bottom-[10%] start-[8%] h-[38%] w-[62%] rounded-t-md bg-accent-900/50" />
          <span className="absolute bottom-[40%] start-[14%] h-[18%] w-[20%] rounded-sm bg-background-primary-default/60" />
          <span className="absolute bottom-[10%] end-[10%] h-[30%] w-1 rounded-full bg-accent-950/40" />
          <span className="absolute bottom-[36%] end-[5%] size-6 rounded-full bg-accent-700/60" />
        </>
      )}

      {photo.kind === "kitchen" && (
        <>
          <span className="absolute inset-x-[8%] bottom-[16%] h-[24%] rounded-sm bg-accent-900/50" />
          <span className="absolute inset-x-[8%] bottom-[39%] h-[3%] bg-background-primary-default/30" />
          <span className="absolute start-[28%] top-[10%] size-3 rounded-full bg-status-yellow-background/80" />
          <span className="absolute end-[28%] top-[10%] size-3 rounded-full bg-status-yellow-background/80" />
        </>
      )}

      {photo.kind === "bedroom" && (
        <>
          <span className="absolute bottom-[12%] start-[10%] h-[36%] w-[76%] rounded-md bg-accent-950/40" />
          <span className="absolute bottom-[40%] start-[16%] h-[14%] w-[24%] rounded-sm bg-background-primary-default/70" />
          <span className="absolute bottom-[40%] start-[44%] h-[14%] w-[24%] rounded-sm bg-background-primary-default/70" />
          <span className="absolute inset-x-[10%] bottom-[29%] h-px bg-background-primary-default/30" />
        </>
      )}

      {photo.kind === "deck" && (
        <>
          <span className="absolute inset-x-0 top-[42%] h-px bg-background-primary-default/50" />
          <span className="absolute start-[8%] top-[16%] size-5 rounded-full bg-status-yellow-background/80" />
          <span className="absolute inset-x-[6%] bottom-[18%] flex h-[24%] justify-between border-t border-background-primary-default/50">
            {[0, 1, 2, 3, 4].map((post) => (
              <span key={post} className="w-px bg-background-primary-default/40" />
            ))}
          </span>
        </>
      )}

      {photo.kind === "bath" && (
        <>
          <span className="absolute inset-x-0 top-0 h-[22%] bg-background-primary-default/10" />
          <span className="absolute bottom-[12%] start-[14%] h-[24%] w-[52%] rounded-full border border-background-primary-default/50 bg-background-primary-default/25" />
          <span className="absolute bottom-[34%] end-[14%] h-[18%] w-[16%] rounded-t-md bg-accent-900/40" />
        </>
      )}
    </span>
  );
}

export function PropertyGallery() {
  const [index, setIndex] = useState(0);
  const photo = PROPERTY_PHOTOS[index];

  const step = (delta: number) =>
    setIndex((current) => (current + delta + PROPERTY_PHOTOS.length) % PROPERTY_PHOTOS.length);

  return (
    <figure aria-label="Property photos" className={cx(card, "max-w-[320px] p-2")}>
      <div className="relative h-[92px] overflow-hidden rounded-lg bg-background-tertiary-default">
        <div key={index} className="absolute inset-0 animate-label-in motion-reduce:animate-none">
          <GalleryArt photo={photo} />
        </div>

        <span className="absolute end-1.5 top-1.5 rounded-full bg-background-primary-default/90 px-1.5 py-0.5 text-caption-2-semibold text-text-primary shadow-xs tabular-nums">
          <bdi dir="ltr">{index + 1} / {PROPERTY_PHOTOS.length}</bdi>
        </span>

        <div className="absolute inset-y-0 start-1.5 flex items-center">
          <button type="button" aria-label="Previous photo" onClick={() => step(-1)} className={iconButton}>
            <RiArrowLeftSLine className="size-4 rtl:-scale-x-100" aria-hidden />
          </button>
        </div>
        <div className="absolute inset-y-0 end-1.5 flex items-center">
          <button type="button" aria-label="Next photo" onClick={() => step(1)} className={iconButton}>
            <RiArrowRightSLine className="size-4 rtl:-scale-x-100" aria-hidden />
          </button>
        </div>
      </div>

      <div role="group" aria-label="Choose a photo" className="mt-1.5 grid grid-cols-5 gap-1">
        {PROPERTY_PHOTOS.map((item, position) => {
          const active = position === index;
          return (
            <button
              key={item.label}
              type="button"
              aria-label={item.label}
              aria-pressed={active}
              onClick={() => setIndex(position)}
              className={cx(
                "relative h-8 overflow-hidden rounded-md",
                "transition-[box-shadow,opacity] duration-150 ease-out motion-reduce:transition-none",
                "focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary-default",
                focusRing,
                active
                  ? "opacity-100 ring-2 ring-border-focus-ring"
                  : "opacity-70 ring-1 ring-inset ring-border-button-default hover:opacity-100",
              )}
            >
              <span aria-hidden className={cx("absolute inset-0", item.tone)} />
              <span aria-hidden className={cx("absolute inset-x-2 bottom-0 h-2/5 rounded-t-sm", item.block)} />
            </button>
          );
        })}
      </div>

      <figcaption className="mt-1.5 flex items-baseline justify-between gap-2">
        <span aria-live="polite" className="min-w-0 truncate text-caption-1-semibold text-text-primary">
          {photo.label}
        </span>
        <span className={cx(metaText, "min-w-0 truncate text-end")}>{photo.detail}</span>
      </figcaption>
    </figure>
  );
}

/* 11. Walk Score */

const WALK_PLACES = [
  {
    id: "mission", label: "Mission", name: "Mission District", cross: "Valencia St & 18th",
    walk: 98, transit: 89, bike: 94, note: "Daily errands do not require a car.",
  },
  {
    id: "sunset", label: "Sunset", name: "Outer Sunset", cross: "Noriega St & 46th Ave",
    walk: 74, transit: 66, bike: 58, note: "Some errands need a short drive.",
  },
] as const;

const RING_RADIUS = 18;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function ScoreRing({ label, score, tone }: { label: string; score: number; tone: string }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-1">
      <div role="img" aria-label={`${label} score ${score} out of 100`} className="relative size-12">
        <svg viewBox="0 0 44 44" className="size-full -rotate-90" aria-hidden>
          <circle cx="22" cy="22" r={RING_RADIUS} fill="none" strokeWidth="4" stroke="currentColor" className="text-background-tertiary-default" />
          <circle
            cx="22"
            cy="22"
            r={RING_RADIUS}
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            stroke="currentColor"
            strokeDasharray={RING_CIRCUMFERENCE}
            style={{ strokeDashoffset: RING_CIRCUMFERENCE * (1 - score / 100) }}
            className={cx("transition-[stroke-dashoffset] duration-[240ms] ease-out motion-reduce:transition-none", tone)}
          />
        </svg>
        <span aria-hidden className="absolute inset-0 flex items-center justify-center text-body-2-semibold text-text-primary tabular-nums">
          {score}
        </span>
      </div>
      <span className="truncate text-caption-2-medium text-text-tertiary">{label}</span>
    </div>
  );
}

export function WalkScore() {
  const [placeId, setPlaceId] = useState<string>("mission");
  const place = WALK_PLACES.find((item) => item.id === placeId) ?? WALK_PLACES[0];

  return (
    <section aria-label={`Walk Score for ${place.name}`} className={cx(card, "max-w-[300px] p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Walk Score</h3>
        <span className={metaText}>By address</span>
      </div>

      <Segmented
        label="Choose an address"
        value={placeId}
        onChange={setPlaceId}
        options={WALK_PLACES.map((item) => ({ value: item.id, label: item.label, ariaLabel: item.name }))}
        className="mt-1.5 grid-cols-2"
      />

      <p className="mt-1 truncate text-caption-2-regular text-text-tertiary">
        {place.name} · {place.cross}
      </p>

      <div className="mt-1.5 grid grid-cols-3 gap-1">
        <ScoreRing label="Walk" score={place.walk} tone="text-accent-500" />
        <ScoreRing label="Transit" score={place.transit} tone="text-chart-2" />
        <ScoreRing label="Bike" score={place.bike} tone="text-chart-4" />
      </div>

      <p
        key={place.id}
        aria-live="polite"
        className="mt-1 flex animate-label-in items-center gap-1 rounded-md bg-background-secondary-default px-2 py-0.5 text-caption-2-regular text-text-secondary motion-reduce:animate-none"
      >
        <RiWalkLine className="size-3 shrink-0 text-foreground-icon-tertiary" aria-hidden />
        <span className="truncate">{place.note}</span>
      </p>
    </section>
  );
}

/* 12. Compare Homes */

const COMPARE_HOMES = [
  {
    id: "sanchez", address: "1428 Sanchez Street", short: "1428 Sanchez", area: "Noe Valley",
    price: 1_285_000, monthly: 6_840, beds: 3, baths: 2, sqft: 1_640, hoa: 0,
    tone: "bg-linear-to-br from-accent-400 to-chart-4",
  },
  {
    id: "guerrero", address: "520 Guerrero Street", short: "520 Guerrero", area: "Mission Dolores",
    price: 1_195_000, monthly: 6_310, beds: 2, baths: 2, sqft: 1_380, hoa: 385,
    tone: "bg-linear-to-br from-chart-4 to-accent-700",
  },
] as const;

type CompareId = (typeof COMPARE_HOMES)[number]["id"];

export function CompareHomes() {
  const [mode, setMode] = useState<"list" | "monthly">("list");
  const [pick, setPick] = useState<CompareId | null>(null);
  const homes = COMPARE_HOMES;
  const picked = homes.find((home) => home.id === pick);
  const other = picked ? homes.find((home) => home.id !== picked.id) : undefined;
  const sizeDelta = picked && other ? Math.abs(picked.sqft - other.sqft) : 0;

  const rows = [
    {
      label: mode === "list" ? "Price" : "Est. monthly",
      values: homes.map((home) =>
        mode === "list" ? usd.format(home.price) : `${usd.format(home.monthly)}/mo`,
      ),
    },
    { label: "Beds · baths", values: homes.map((home) => `${home.beds} bd · ${home.baths} ba`) },
    { label: "Interior", values: homes.map((home) => `${count.format(home.sqft)} sq ft`) },
    { label: "HOA", values: homes.map((home) => (home.hoa === 0 ? "None" : `${usd.format(home.hoa)}/mo`)) },
  ];

  return (
    <section aria-label="Compare two homes" className={cx(card, "max-w-[560px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Compare homes</h3>
        <Segmented
          label="Price display"
          value={mode}
          onChange={(next) => setMode(next as "list" | "monthly")}
          options={[
            { value: "list", label: "List" },
            { value: "monthly", label: "Monthly" },
          ]}
          className="grid-cols-2"
        />
      </div>

      <table className="mt-1.5 w-full table-fixed border-collapse">
        <caption className="sr-only">
          Comparison of {homes[0].address} and {homes[1].address}
        </caption>
        <colgroup>
          <col className="w-[34%]" />
          <col className="w-[33%]" />
          <col className="w-[33%]" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className="pb-1 text-start align-bottom">
              <span className="text-caption-2-medium text-text-tertiary">Home</span>
            </th>
            {homes.map((home, index) => (
              <th key={home.id} scope="col" className={cx("pb-1 align-bottom", index === 1 && "border-s border-separator-border")}>
                <button
                  type="button"
                  aria-pressed={pick === home.id}
                  onClick={() => setPick(pick === home.id ? null : home.id)}
                  className={cx(
                    "flex w-full flex-col items-center gap-0.5 rounded-md px-1 py-0.5",
                    "transition-[background-color] duration-150 ease-out motion-reduce:transition-none",
                    focusRing,
                    pick === home.id ? "bg-background-secondary-default" : "hover:bg-background-secondary-default",
                  )}
                >
                  <span className="flex max-w-full items-center gap-1 text-caption-2-semibold text-text-primary">
                    <span aria-hidden className={cx("size-1.5 shrink-0 rounded-full", home.tone)} />
                    <span className="truncate">{home.short}</span>
                    <RiCheckLine
                      className={cx(
                        "size-3 shrink-0 text-accent-600 transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none",
                        pick === home.id ? "scale-100 opacity-100" : "scale-50 opacity-0",
                      )}
                      aria-hidden
                    />
                  </span>
                  <span className="max-w-full truncate text-caption-2-regular text-text-tertiary">{home.area}</span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-separator-border">
              <th scope="row" className="py-0.5 pe-2 text-start text-caption-2-regular text-text-tertiary">
                {row.label}
              </th>
              {row.values.map((value, index) => (
                <td
                  key={homes[index].id}
                  className={cx(
                    "py-0.5 text-center text-caption-1-semibold text-text-primary tabular-nums",
                    index === 1 && "border-s border-separator-border",
                    homes[index].id === pick && "bg-background-secondary-default",
                  )}
                >
                  <bdi dir="ltr">{value}</bdi>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <p aria-live="polite" className={cx(metaText, "mt-1.5 truncate")}>
        {picked
          ? `Your pick: ${picked.short} · ${count.format(sizeDelta)} sq ft ${picked.sqft > (other?.sqft ?? 0) ? "larger" : "smaller"}`
          : "Select a home to mark your pick."}
      </p>
    </section>
  );
}

/* Specimens */

export const REALESTATE_SECTION: ExtendedSection = {
  id: "realestate",
  title: "Real estate",
  blurb: "Listings, tours and the numbers behind a move.",
  file: "realestate.tsx",
  entries: [
    { name: "Listing Card", description: "Price, beds, baths and a save toggle on one quiet card.", Demo: ListingCard },
    { name: "Floor Plan", description: "Pick a room to read its dimensions and finish notes.", Demo: FloorPlan },
    { name: "Mortgage Calculator", description: "Price, down payment and rate drive a live monthly figure.", Demo: MortgageCalculator },
    { name: "Tour Scheduler", description: "Choose a date and time, then confirm the showing.", Demo: TourScheduler },
    { name: "Agent Card", description: "An agent, a brokerage and contact options that open in place.", Demo: AgentCard },
    { name: "Saved Search", description: "Criteria, new results and a daily alert switch.", Demo: SavedSearch },
    { name: "Neighborhood Stats", description: "Median price, schools and commute, buy or rent.", Demo: NeighborhoodStats },
    { name: "Offer Tracker", description: "Three offers with amounts and statuses; pick one for detail.", Demo: OfferTracker },
    { name: "Lease Summary", description: "Term, rent, deposit and a one-tap renewal request.", Demo: LeaseSummary },
    { name: "Property Gallery", description: "A main frame, thumbnails, arrows and a photo counter.", Demo: PropertyGallery },
    { name: "Walk Score", description: "Walk, transit and bike rings that redraw for each address.", Demo: WalkScore },
    { name: "Compare Homes", description: "Two homes on price, beds, size and HOA, side by side.", Demo: CompareHomes, wide: true },
  ],
};
