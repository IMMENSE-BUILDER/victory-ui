"use client";

import { useEffect, useId, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import {
  RiArrowDownSLine,
  RiArrowRightLine,
  RiBuildingLine,
  RiCarLine,
  RiCheckLine,
  RiCloudLine,
  RiErrorWarningLine,
  RiFlightTakeoffLine,
  RiHotelBedLine,
  RiLoader4Line,
  RiMapPinLine,
  RiNotification3Line,
  RiRainyLine,
  RiRefreshLine,
  RiStarFill,
  RiSuitcase2Line,
  RiTicket2Line,
  RiWalkLine,
  RiWallet3Line,
  RiWindyLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* Shared */

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";
const card = "w-full rounded-xl border border-border-button-default bg-background-primary-default shadow-card";
const buttonBase =
  "inline-flex items-center justify-center gap-1.5 rounded-lg text-caption-1-semibold " +
  "transition-[transform,opacity,background-color,color,box-shadow] duration-150 ease-out " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 " +
  "motion-reduce:transition-none motion-reduce:active:scale-100";
const primaryButton = cx(buttonBase, "h-7 bg-button-primary px-2.5 text-text-white shadow-xs", focusRing);
const secondaryButton = cx(
  buttonBase,
  "h-7 border border-border-button-default bg-background-primary-default px-2.5 text-text-primary shadow-xs hover:bg-background-primary-hover",
  focusRing,
);
const quietButton = cx(
  "inline-flex h-6 shrink-0 items-center justify-center gap-1 rounded-md px-1.5 text-caption-2-semibold text-text-secondary",
  "transition-[background-color,color] duration-150 ease-out hover:bg-background-secondary-default hover:text-text-primary",
  "motion-reduce:transition-none",
  focusRing,
);
const iconTile = "flex size-7 shrink-0 items-center justify-center rounded-md bg-background-secondary-default text-foreground-icon-secondary";
const meta = "text-caption-2-regular text-text-tertiary";
const reveal = "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none";

type Tone = "neutral" | "green" | "yellow" | "blue" | "orange" | "rose";

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-background-secondary-default text-text-secondary",
  green: "bg-status-lime-background text-status-lime-text",
  yellow: "bg-status-yellow-background text-status-yellow-text",
  blue: "bg-status-blue-background text-status-blue-text",
  orange: "bg-status-orange-background text-status-orange-text",
  rose: "bg-status-rose-background text-status-rose-text",
};

function Tag({ tone = "neutral", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-caption-2-medium",
        TONE_CLASS[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

function Airport({
  code,
  city,
  align = "start",
}: {
  code: string;
  city: string;
  align?: "start" | "end";
}) {
  return (
    <div className={cx("flex min-w-0 flex-col", align === "end" && "items-end text-end")}>
      <bdi dir="ltr" className="text-title-3-semibold text-text-primary">
        {code}
      </bdi>
      <span className="w-full truncate text-caption-2-regular text-text-tertiary">{city}</span>
    </div>
  );
}

function FlightPath({ duration }: { duration: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-0.5 px-1" aria-hidden>
      <div className="flex w-full items-center gap-1">
        <span className="size-1 shrink-0 rounded-full bg-border-button-active" />
        <span className="h-px flex-1 border-t border-dashed border-border-button-hover" />
        <RiFlightTakeoffLine className="size-3.5 shrink-0 text-accent-600 rtl:-scale-x-100" />
        <span className="h-px flex-1 border-t border-dashed border-border-button-hover" />
        <span className="size-1 shrink-0 rounded-full bg-border-button-active" />
      </div>
      <span className="text-caption-2-regular text-text-tertiary">
        <bdi dir="ltr">{duration}</bdi>
      </span>
    </div>
  );
}

const BARCODE_BARS = Array.from({ length: 34 }, (_, index) => ((index * 5 + 2) % 4) + 1);

function Barcode({ value }: { value: string }) {
  return (
    <span
      role="img"
      aria-label={`Barcode ${value}`}
      dir="ltr"
      className="flex h-5 items-stretch gap-[2px] overflow-hidden"
    >
      {BARCODE_BARS.map((width, index) => (
        <span
          key={index}
          className={cx("shrink-0 bg-text-primary", index % 6 === 4 && "opacity-50")}
          style={{ width }}
        />
      ))}
    </span>
  );
}

/* 1. Flight Card */

export function FlightCard() {
  const detailsId = useId();
  const [open, setOpen] = useState(false);

  return (
    <section aria-label="Flight UA 512" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent-600 text-caption-2-bold text-text-white">
          UA
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-caption-1-semibold text-text-primary">United 512</h3>
          <p className={cx(meta, "truncate")}>Thu, Nov 6 · Nonstop</p>
        </div>
        <Tag tone="green">
          <span
            aria-hidden
            className="size-1.5 animate-pulse rounded-full bg-status-lime-text motion-reduce:animate-none"
          />
          On time
        </Tag>
      </div>

      <div className="mt-2 flex items-start gap-1">
        <Airport code="SFO" city="San Francisco" />
        <FlightPath duration="5h 25m" />
        <Airport code="JFK" city="New York" align="end" />
      </div>

      <div className="mt-2 flex items-center gap-2 rounded-lg bg-background-secondary-default px-2 py-1.5">
        <div className="min-w-0">
          <p className={meta}>Departs</p>
          <p className="text-body-2-semibold tabular-nums text-text-primary">
            <bdi dir="ltr">07:40</bdi>
          </p>
        </div>
        <span aria-hidden className="h-5 w-px bg-border-button-default" />
        <div className="min-w-0">
          <p className={meta}>Arrives</p>
          <p className="text-body-2-semibold tabular-nums text-text-primary">
            <bdi dir="ltr">16:05</bdi>
          </p>
        </div>
        <span aria-hidden className="h-5 w-px bg-border-button-default" />
        <div className="min-w-0">
          <p className={meta}>Gate</p>
          <p className="text-body-2-semibold text-text-primary">
            <bdi dir="ltr">D12</bdi>
          </p>
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={detailsId}
          onClick={() => setOpen((current) => !current)}
          className={cx(quietButton, "ms-auto")}
        >
          Gate info
          <RiArrowDownSLine
            className={cx(
              "size-3.5 transition-[transform] duration-200 ease-out motion-reduce:transition-none",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>
      </div>

      <div
        id={detailsId}
        inert={!open}
        className={cx(reveal, open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="pt-1.5 text-caption-2-regular text-text-secondary">
            Terminal 3 · 4 min walk from security. Boarding closes 07:15 at D12.
          </p>
        </div>
      </div>
    </section>
  );
}

/* 2. Boarding Pass */

export function BoardingPass() {
  const [saved, setSaved] = useState(false);

  return (
    <section
      aria-label="Boarding pass for Maya Chen"
      className={cx(
        card,
        "max-w-[300px] overflow-hidden transition-[box-shadow] duration-200 ease-out motion-reduce:transition-none",
        saved && "ring-1 ring-accent-500",
      )}
    >
      <div className="flex items-center gap-1.5 bg-accent-600 px-2.5 py-1 text-text-white">
        <RiFlightTakeoffLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
        <span className="text-caption-2-bold tracking-wide uppercase">United</span>
        <span className="ms-auto text-caption-2-medium tabular-nums">
          <bdi dir="ltr">UA 512</bdi>
        </span>
      </div>

      <div className="p-2.5">
        <div className="flex items-center justify-between gap-2">
          <Airport code="SFO" city="San Francisco" />
          <RiArrowRightLine className="size-4 shrink-0 text-foreground-icon-tertiary rtl:-scale-x-100" aria-hidden />
          <Airport code="JFK" city="New York" align="end" />
        </div>

        <dl className="mt-2 grid grid-cols-3 gap-1 rounded-lg bg-background-secondary-default p-1">
          <div className="min-w-0">
            <dt className={meta}>Passenger</dt>
            <dd className="truncate text-caption-1-semibold text-text-primary">Maya Chen</dd>
          </div>
          <div>
            <dt className={meta}>Seat</dt>
            <dd className="text-caption-1-semibold tabular-nums text-text-primary">
              <bdi dir="ltr">14A</bdi>
            </dd>
          </div>
          <div>
            <dt className={meta}>Group</dt>
            <dd className="text-caption-1-semibold tabular-nums text-text-primary">2</dd>
          </div>
        </dl>

        <div className="mt-1.5 flex items-end justify-between gap-2 border-t border-dashed border-border-button-hover pt-1.5">
          <div className="min-w-0">
            <p aria-live="polite" className={cx(meta, "truncate")}>
              {saved ? "Saved · Boarding closes 07:15" : "Gate D12 · Boards 07:00"}
            </p>
            <Barcode value="UA512 SFOJFK 14A" />
          </div>
          <button
            type="button"
            aria-pressed={saved}
            onClick={() => setSaved((current) => !current)}
            className={cx(saved ? secondaryButton : primaryButton, "h-7 shrink-0 px-2")}
          >
            {saved ? (
              <>
                <RiCheckLine className="size-3.5" aria-hidden />
                Saved
              </>
            ) : (
              <>
                <RiWallet3Line className="size-3.5" aria-hidden />
                Wallet
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

/* 3. Hotel Row */

export function HotelRow() {
  const [selected, setSelected] = useState(false);

  return (
    <section
      aria-label="The Hoxton, Williamsburg"
      className={cx(
        card,
        "max-w-[320px] p-2.5 transition-[border-color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
        selected && "border-accent-500 shadow-xs",
      )}
    >
      <div className="flex items-start gap-2">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background-secondary-default text-accent-600">
          <RiHotelBedLine className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="truncate text-body-2-semibold text-text-primary">The Hoxton, Williamsburg</h3>
            <span className="flex shrink-0 items-center gap-0.5 text-caption-2-semibold text-text-secondary">
              <RiStarFill className="size-3 text-status-yellow-text" aria-hidden />
              4.6
            </span>
          </div>
          <p className={cx(meta, "truncate")}>Williamsburg · 12 min to Union Square</p>
          <p className="mt-0.5 truncate text-caption-2-regular text-text-secondary">
            Nov 6 – 8 · 2 nights · Deluxe King
          </p>
        </div>
      </div>

      <div className="mt-2 flex items-end justify-between gap-2 border-t border-separator-border pt-2">
        <div className="min-w-0">
          <p className="text-body-2-semibold tabular-nums text-text-primary">
            $642 <span className="text-caption-2-regular text-text-tertiary">total · $321/night</span>
          </p>
          <p className="truncate text-caption-2-regular text-status-lime-text">Free cancellation until Nov 4</p>
        </div>
        <button
          type="button"
          aria-pressed={selected}
          onClick={() => setSelected((current) => !current)}
          className={cx(
            selected ? secondaryButton : primaryButton,
            "h-7 min-w-[76px] shrink-0",
            selected && "border-accent-500 text-accent-600",
          )}
        >
          {selected ? (
            <>
              <RiCheckLine className="size-3.5" aria-hidden />
              Selected
            </>
          ) : (
            "Select"
          )}
        </button>
      </div>
    </section>
  );
}

/* 4. Trip Timeline */

type TripEventKind = "flight" | "stay" | "plan";

type TripEvent = {
  time: string;
  title: string;
  kind: TripEventKind;
};

type TripDay = {
  label: string;
  date: string;
  summary: string;
  icon: IconComponent;
  events: TripEvent[];
};

const TRIP_DAYS: TripDay[] = [
  {
    label: "Thu",
    date: "Nov 6",
    summary: "Land at JFK 16:05. Check in after 15:00.",
    icon: RiFlightTakeoffLine,
    events: [
      { time: "07:40", title: "UA 512 to JFK", kind: "flight" },
      { time: "15:00", title: "The Hoxton, check-in", kind: "stay" },
    ],
  },
  {
    label: "Fri",
    date: "Nov 7",
    summary: "MoMA at 10:00, dinner in Williamsburg at 19:30.",
    icon: RiBuildingLine,
    events: [
      { time: "10:00", title: "MoMA, timed entry", kind: "plan" },
      { time: "19:30", title: "Lilia, table for 2", kind: "plan" },
    ],
  },
  {
    label: "Sat",
    date: "Nov 8",
    summary: "Flea market first, then UA 241 home at 18:20.",
    icon: RiMapPinLine,
    events: [
      { time: "09:00", title: "Brooklyn Flea", kind: "plan" },
      { time: "18:20", title: "UA 241 to SFO", kind: "flight" },
    ],
  },
];

const EVENT_DOT: Record<TripEventKind, string> = {
  flight: "bg-accent-500",
  stay: "bg-status-blue-text",
  plan: "bg-status-orange-text",
};

export function TripTimeline() {
  const [active, setActive] = useState(1);
  const day = TRIP_DAYS[active];
  const DayIcon = day.icon;

  return (
    <section aria-label="Trip to New York" className={cx(card, "max-w-[560px] p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-body-2-semibold text-text-primary">New York, three days</h3>
          <p className={meta}>Thu, Nov 6 – Sat, Nov 8 · 2 travelers</p>
        </div>
        <Tag tone="neutral">3 days</Tag>
      </div>

      <div role="group" aria-label="Trip days" className="mt-2 grid grid-cols-3 gap-1.5">
        {TRIP_DAYS.map((item, index) => {
          const selected = index === active;
          return (
            <button
              key={item.date}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive(index)}
              className={cx(
                "flex min-w-0 flex-col gap-1 rounded-lg border p-1.5 text-start",
                "transition-[background-color,border-color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
                focusRing,
                selected
                  ? "border-accent-500 bg-background-secondary-default shadow-xs"
                  : "border-border-button-default bg-background-primary-default hover:bg-background-primary-hover",
              )}
            >
              <span className="flex items-baseline justify-between gap-1">
                <span className="text-caption-1-semibold text-text-primary">{item.label}</span>
                <span className={meta}>{item.date}</span>
              </span>
              <span className="flex flex-col gap-1">
                {item.events.map((event) => (
                  <span key={event.time} className="flex min-w-0 items-center gap-1">
                    <span className={cx("size-1.5 shrink-0 rounded-full", EVENT_DOT[event.kind])} aria-hidden />
                    <bdi dir="ltr" className="shrink-0 text-caption-2-regular tabular-nums text-text-tertiary">
                      {event.time}
                    </bdi>
                    <span className="truncate text-caption-2-regular text-text-secondary">{event.title}</span>
                  </span>
                ))}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-1.5 flex items-center gap-2 rounded-lg bg-background-secondary-default px-2 py-1.5">
        <DayIcon className="size-3.5 shrink-0 text-accent-600" aria-hidden />
        <div aria-live="polite" className="min-w-0 flex-1">
          <p
            key={day.date}
            className="animate-label-in truncate text-caption-1-medium text-text-secondary motion-reduce:animate-none"
          >
            {day.summary}
          </p>
        </div>
        <span className="shrink-0 text-caption-2-regular tabular-nums text-text-tertiary">
          {day.events.length} events
        </span>
      </div>
    </section>
  );
}

/* 5. Seat Map */

const SEAT_ROWS = [12, 13, 14, 15] as const;
const SEAT_LETTERS = ["A", "B", "C", "D", "E", "F"] as const;
const OCCUPIED_SEATS = new Set(["12A", "12D", "13B", "13E", "14C", "14F", "15A", "15D"]);
const EXIT_SEATS = new Set(SEAT_LETTERS.map((letter) => `15${letter}`));

function seatType(seat: string) {
  const letter = seat.slice(-1);
  if (letter === "A" || letter === "F") return "Window";
  if (letter === "C" || letter === "D") return "Aisle";
  return "Middle";
}

function SeatButton({
  seat,
  selected,
  onSelect,
}: {
  seat: string;
  selected: boolean;
  onSelect: (seat: string) => void;
}) {
  const taken = OCCUPIED_SEATS.has(seat);
  const exit = EXIT_SEATS.has(seat);

  return (
    <button
      type="button"
      disabled={taken}
      aria-pressed={taken ? undefined : selected}
      aria-label={
        taken
          ? `Seat ${seat}, taken`
          : `Seat ${seat}, ${seatType(seat)}${exit ? ", exit row, $29" : ""}`
      }
      onClick={() => onSelect(seat)}
      className={cx(
        "flex size-6 shrink-0 items-center justify-center rounded-md border text-caption-2-semibold",
        "transition-[background-color,border-color,color,transform] duration-150 ease-out motion-reduce:transition-none",
        focusRing,
        selected
          ? "scale-105 border-accent-600 bg-accent-600 text-text-white shadow-xs"
          : taken
            ? "border-transparent bg-background-tertiary-default text-text-disabled line-through"
            : exit
              ? "border-status-yellow-text/40 bg-status-yellow-background text-status-yellow-text hover:border-status-yellow-text"
              : "border-border-button-default bg-background-primary-default text-text-secondary hover:border-border-button-hover hover:bg-background-primary-hover",
        taken && "pointer-events-none",
      )}
    >
      {seat.slice(-1)}
    </button>
  );
}

export function SeatMap() {
  const [selected, setSelected] = useState<string | null>("14A");
  const exitRow = selected ? EXIT_SEATS.has(selected) : false;

  return (
    <section aria-label="Choose a seat on flight UA 512" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Choose your seat</h3>
        <span className={meta}>A320 · rows 12–15</span>
      </div>

      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-caption-2-regular text-text-tertiary">
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-xs border border-border-button-default" aria-hidden />
          Open
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-xs bg-background-quaternary-default" aria-hidden />
          Taken
        </span>
        <span className="flex items-center gap-1">
          <span
            className="size-2 rounded-xs bg-status-yellow-background ring-1 ring-inset ring-status-yellow-text/40"
            aria-hidden
          />
          Exit row +$29
        </span>
      </div>

      <div dir="ltr" className="mt-1 rounded-lg bg-background-secondary-default p-1">
        <div role="group" aria-label="Seat map, rows 12 to 15" className="flex flex-col gap-0.5">
          {SEAT_ROWS.map((row) => (
            <div key={row} className="flex items-center gap-1">
              <span className="w-3 shrink-0 text-center text-caption-2-regular tabular-nums text-text-tertiary">
                {row}
              </span>
              <div className="flex flex-1 items-center gap-0.5">
                {SEAT_LETTERS.slice(0, 3).map((letter) => {
                  const seat = `${row}${letter}`;
                  return (
                    <SeatButton
                      key={seat}
                      seat={seat}
                      selected={selected === seat}
                      onSelect={setSelected}
                    />
                  );
                })}
                <span aria-hidden className="w-1.5 shrink-0" />
                {SEAT_LETTERS.slice(3).map((letter) => {
                  const seat = `${row}${letter}`;
                  return (
                    <SeatButton
                      key={seat}
                      seat={seat}
                      selected={selected === seat}
                      onSelect={setSelected}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-1 flex items-center justify-between gap-2">
        <p aria-live="polite" className="min-w-0 truncate text-caption-1-medium text-text-secondary">
          {selected ? `Seat ${selected} · ${seatType(selected)}` : "No seat selected"}
        </p>
        <span
          className={cx(
            "shrink-0 text-caption-2-semibold tabular-nums transition-[color] duration-150 ease-out motion-reduce:transition-none",
            exitRow ? "text-status-yellow-text" : "text-text-tertiary",
          )}
        >
          {selected ? (exitRow ? "+$29" : "Included") : "—"}
        </span>
      </div>
    </section>
  );
}

/* 6. Price Alert */

const FARE_HISTORY = [386, 402, 371, 355, 390, 344, 362, 329, 348, 336, 325, 318];
const FARE_MIN = Math.min(...FARE_HISTORY);
const FARE_MAX = Math.max(...FARE_HISTORY);
const barHeight = (fare: number) => 22 + Math.round(((fare - FARE_MIN) / (FARE_MAX - FARE_MIN)) * 78);

export function PriceAlert() {
  const rangeId = useId();
  const [enabled, setEnabled] = useState(true);
  const [threshold, setThreshold] = useState(340);

  const message = !enabled
    ? "Alerts are paused for this route."
    : threshold > 318
      ? `Today's fare is under your $${threshold} limit. We'll watch the next drop.`
      : `We'll alert you when the fare drops below $${threshold}.`;

  return (
    <section aria-label="Fare alert for SFO to JFK" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className={iconTile}>
          <RiFlightTakeoffLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">
            <bdi dir="ltr">SFO → JFK</bdi>
          </h3>
          <p className={meta}>Round trip · Dec 18–22</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="text-caption-2-regular text-text-tertiary">Alerts {enabled ? "on" : "off"}</span>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            aria-label="Fare alerts for SFO to JFK"
            onClick={() => setEnabled((current) => !current)}
            className={cx(
              "flex h-5 w-9 items-center rounded-full p-0.5",
              "transition-[background-color] duration-200 ease-out motion-reduce:transition-none",
              focusRing,
              enabled ? "bg-accent-600" : "bg-background-quaternary-default",
            )}
          >
            <span
              className={cx(
                "size-4 rounded-full bg-text-white shadow-xs",
                "transition-[transform] duration-200 ease-out motion-reduce:transition-none",
                enabled ? "translate-x-4 rtl:-translate-x-4" : "translate-x-0",
              )}
            />
          </button>
        </div>
      </div>

      <div className="mt-2 flex items-end justify-between gap-2">
        <div>
          <p className={meta}>Today's fare</p>
          <div className="flex items-baseline gap-2">
            <span className="text-title-2-semibold tabular-nums text-text-primary">$318</span>
            <span className="text-caption-2-regular tabular-nums text-text-tertiary line-through">$360</span>
            <Tag tone="green">−12%</Tag>
          </div>
        </div>
        <div aria-hidden className="flex h-8 items-end gap-0.5">
          {FARE_HISTORY.map((fare, index) => (
            <span
              key={index}
              className={cx(
                "w-1 rounded-full",
                index === FARE_HISTORY.length - 1 ? "bg-accent-500" : "bg-background-quaternary-default",
              )}
              style={{ height: `${barHeight(fare)}%` }}
            />
          ))}
        </div>
      </div>
      <p className="sr-only">Fares over the last twelve weeks ranged from $318 to $402.</p>

      <div className={cx("mt-2 transition-[opacity] duration-200 ease-out motion-reduce:transition-none", !enabled && "opacity-50")}>
        <div className="flex items-baseline justify-between gap-2">
          <label htmlFor={rangeId} className="text-caption-1-medium text-text-secondary">
            Alert me under
          </label>
          <span className="text-caption-1-semibold tabular-nums text-text-primary">${threshold}</span>
        </div>
        <input
          id={rangeId}
          type="range"
          min={290}
          max={400}
          step={10}
          value={threshold}
          disabled={!enabled}
          aria-valuetext={`$${threshold}`}
          onChange={(event) => setThreshold(Number(event.target.value))}
          className={cx("mt-1 h-4 w-full cursor-pointer accent-accent-600 disabled:cursor-not-allowed", focusRing)}
        />
      </div>

      <p role="status" className="mt-0.5 flex min-h-8 items-start gap-1 text-caption-2-regular text-text-secondary">
        <RiNotification3Line className="mt-0.5 size-3 shrink-0 text-foreground-icon-tertiary" aria-hidden />
        <span className="min-w-0">{message}</span>
      </p>
    </section>
  );
}

/* 7. Itinerary Day */

const ITINERARY = [
  { time: "09:00", title: "Breakfast at Café Mogador", place: "St. Marks Pl · 6 min walk" },
  { time: "10:00", title: "MoMA, timed entry", place: "11 W 53rd St · Ticket in wallet" },
  { time: "14:00", title: "High Line to Chelsea", place: "Enter at 23rd St" },
  { time: "19:30", title: "Dinner at Lilia", place: "567 Union Ave · Table for 2" },
] as const;

export function ItineraryDay() {
  const [current, setCurrent] = useState(1);
  const last = ITINERARY.length - 1;
  const stop = ITINERARY[current];

  return (
    <section aria-label="Itinerary for Friday, November 7" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="truncate text-body-2-semibold text-text-primary">Friday, Nov 7</h3>
        <span className={cx(meta, "shrink-0")}>New York · 4 stops</span>
      </div>

      <ol className="mt-1.5 flex flex-col">
        {ITINERARY.map((event, index) => {
          const done = index < current;
          const now = index === current;
          return (
            <li key={event.time} className="flex gap-2">
              <div className="flex w-4 shrink-0 flex-col items-center">
                <span
                  className={cx(
                    "mt-0.5 flex size-4 items-center justify-center rounded-full border text-caption-2-bold",
                    "transition-[background-color,border-color,color] duration-200 ease-out motion-reduce:transition-none",
                    done || now
                      ? "border-accent-600 bg-accent-600 text-text-white"
                      : "border-border-button-default bg-background-primary-default text-text-tertiary",
                    now && "ring-2 ring-accent-500/25",
                  )}
                >
                  {done ? <RiCheckLine className="size-2.5" aria-hidden /> : <span className="tabular-nums">{index + 1}</span>}
                </span>
                {index < last && (
                  <span
                    aria-hidden
                    className={cx(
                      "w-px flex-1 transition-[background-color] duration-200 ease-out motion-reduce:transition-none",
                      done ? "bg-accent-500" : "bg-background-tertiary-default",
                    )}
                  />
                )}
              </div>
              <div className={cx("min-w-0 flex-1 pb-1.5 transition-[opacity] duration-200 ease-out motion-reduce:transition-none", !done && !now && "opacity-60")}>
                <div className="flex items-baseline gap-1.5">
                  <bdi dir="ltr" className="shrink-0 text-caption-2-semibold tabular-nums text-text-secondary">
                    {event.time}
                  </bdi>
                  <span
                    className={cx(
                      "truncate text-caption-1-semibold transition-[color] duration-200 ease-out motion-reduce:transition-none",
                      done ? "text-text-tertiary line-through" : "text-text-primary",
                    )}
                  >
                    {event.title}
                  </span>
                </div>
                {now && <p className="truncate text-caption-2-regular text-text-secondary">{event.place}</p>}
              </div>
              {now && (
                <Tag tone="blue" className="mt-0.5 self-start">
                  Now
                </Tag>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-1 flex items-center justify-between gap-2 border-t border-separator-border pt-1.5">
        <span aria-live="polite" className="min-w-0 truncate text-caption-2-regular text-text-tertiary">
          {current + 1} of {ITINERARY.length} · Now at {stop.title.split(",")[0]}
        </span>
        <button
          type="button"
          onClick={() => setCurrent(current === last ? 0 : current + 1)}
          className={cx(secondaryButton, "h-6 shrink-0 px-2")}
        >
          {current === last ? (
            <>
              <RiRefreshLine className="size-3" aria-hidden />
              Start over
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

/* 8. Baggage Tracker */

const BAG_SCANS = [
  { label: "Checked in", detail: "SFO · Terminal 3 counter", time: "06:12" },
  { label: "Screened", detail: "SFO · TSA cleared", time: "06:24" },
  { label: "Loaded", detail: "SFO · Aircraft hold", time: "06:58" },
  { label: "In transit", detail: "UA 512 · SFO to JFK", time: "07:32" },
  { label: "Carousel", detail: "JFK · Belt 4", time: "16:20" },
] as const;

export function BaggageTracker() {
  const [current, setCurrent] = useState(2);
  const scan = BAG_SCANS[current];
  const done = current === BAG_SCANS.length - 1;
  const tone: Tone = done ? "green" : current === 3 ? "blue" : "neutral";

  return (
    <section aria-label="Baggage tracking for bag 0842 117" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className={iconTile}>
          <RiSuitcase2Line className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Bag 0842 117</h3>
          <p className={meta}>SFO → JFK · UA 512</p>
        </div>
        <Tag tone={tone}>{done ? "Arrived" : scan.label}</Tag>
      </div>

      <div
        role="progressbar"
        aria-label="Baggage journey progress"
        aria-valuemin={1}
        aria-valuemax={BAG_SCANS.length}
        aria-valuenow={current + 1}
        aria-valuetext={`${current + 1} of ${BAG_SCANS.length}, ${scan.label}`}
        className="mt-1 h-1 overflow-hidden rounded-full bg-background-tertiary-default"
      >
        <div
          className="h-full rounded-full bg-accent-500 transition-[width] duration-200 ease-out motion-reduce:transition-none"
          style={{ width: `${((current + 1) / BAG_SCANS.length) * 100}%` }}
        />
      </div>

      <div role="group" aria-label="Baggage scans" className="mt-1 flex flex-col">
        {BAG_SCANS.map((item, index) => {
          const complete = index < current;
          const active = index === current;
          return (
            <button
              key={item.label}
              type="button"
              aria-current={active ? "step" : undefined}
              onClick={() => setCurrent(index)}
              className={cx(
                "flex h-5 items-center gap-1.5 rounded-md px-1 text-start",
                "transition-[background-color] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                active ? "bg-background-secondary-default" : "hover:bg-background-secondary-default/60",
              )}
            >
              <span
                className={cx(
                  "flex size-2.5 shrink-0 items-center justify-center rounded-full transition-[background-color,border-color,color] duration-200 ease-out motion-reduce:transition-none",
                  complete || active
                    ? "bg-accent-600 text-text-white"
                    : "border border-border-checkbox-default bg-background-primary-default",
                  active && "ring-2 ring-accent-500/25",
                )}
              >
                {complete && <RiCheckLine className="size-2" aria-hidden />}
              </span>
              <span
                className={cx(
                  "min-w-0 flex-1 truncate text-caption-2-medium",
                  index <= current ? "text-text-primary" : "text-text-tertiary",
                )}
              >
                {item.label}
              </span>
              <span className="text-caption-2-regular tabular-nums text-text-tertiary">{item.time}</span>
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="mt-1 flex items-center gap-1 text-caption-2-regular text-text-secondary">
        <RiMapPinLine className="size-3 shrink-0 text-foreground-icon-tertiary" aria-hidden />
        <span className="min-w-0 truncate">{scan.detail}</span>
      </p>
    </section>
  );
}

/* 9. Gate Change */

export function GateChange() {
  const [acked, setAcked] = useState(false);

  return (
    <section
      aria-label="Gate change for UA 512"
      className={cx(
        "w-full max-w-[320px] rounded-xl border p-2.5",
        "transition-[background-color,border-color] duration-200 ease-out motion-reduce:transition-none",
        acked ? "border-status-lime-text/30 bg-status-lime-background" : "border-status-yellow-text/40 bg-status-yellow-background",
      )}
    >
      <div className="flex items-start gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background-secondary-default shadow-xs">
          {acked ? (
            <RiCheckLine className="size-4 animate-label-in text-status-lime-text motion-reduce:animate-none" aria-hidden />
          ) : (
            <RiErrorWarningLine className="size-4 text-status-yellow-text" aria-hidden />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p
            className={cx(
              "text-caption-2-semibold tracking-wide uppercase",
              acked ? "text-status-lime-text" : "text-status-yellow-text",
            )}
          >
            {acked ? "Acknowledged" : "Gate change"}
          </p>
          <h3 className="text-body-2-semibold text-text-primary">
            {acked ? "You're set for D18" : "UA 512 now boards at D18"}
          </h3>
        </div>
        <Tag tone={acked ? "green" : "yellow"}>UA 512</Tag>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span className={cx("rounded-md border border-border-button-default bg-background-primary-default px-1.5 py-0.5 text-caption-2-semibold text-text-tertiary line-through")}>
          <bdi dir="ltr">D12</bdi>
        </span>
        <RiArrowRightLine className="size-3.5 shrink-0 text-foreground-icon-tertiary rtl:-scale-x-100" aria-hidden />
        <span className="rounded-md border border-accent-500 bg-background-primary-default px-1.5 py-0.5 text-caption-2-semibold text-text-primary">
          <bdi dir="ltr">D18</bdi>
        </span>
        <span className="ms-auto flex items-center gap-1 text-caption-2-regular text-text-primary">
          <RiWalkLine className="size-3" aria-hidden />
          4 min
        </span>
      </div>

      <p aria-live="polite" className="mt-1.5 text-caption-2-regular text-text-primary">
        {acked
          ? "Alert acknowledged. We'll only ping you if the gate moves again."
          : "Follow signs to Concourse D. The old gate is closed."}
      </p>

      <button
        type="button"
        onClick={() => setAcked((current) => !current)}
        className={cx(acked ? secondaryButton : primaryButton, "mt-1.5 w-full")}
      >
        {acked ? (
          <>
            <RiRefreshLine className="size-3.5" aria-hidden />
            Undo
          </>
        ) : (
          "Acknowledge"
        )}
      </button>
    </section>
  );
}

/* 10. Car Rental */

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function CarRental() {
  const coverageId = useId();
  const [coverage, setCoverage] = useState(false);
  const total = 139 + (coverage ? 28 : 0);

  return (
    <section aria-label="Hertz car rental at JFK" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className={iconTile}>
          <RiCarLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Hertz · Midsize SUV</h3>
          <p className={meta}>Toyota RAV4 or similar</p>
        </div>
        <Tag tone="neutral">2 days</Tag>
      </div>

      <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-separator-border px-2 py-1">
        <RiMapPinLine className="size-3.5 shrink-0 text-accent-600" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-2-semibold text-text-primary">JFK Rental Center</p>
          <p className={cx(meta, "truncate")}>
            <bdi dir="ltr">Nov 6, 17:00</bdi> – <bdi dir="ltr">Nov 8, 16:30</bdi>
          </p>
        </div>
      </div>

      <div className="mt-1.5 rounded-lg bg-background-secondary-default p-1">
        <div className="flex items-baseline justify-between gap-2 text-caption-2-regular text-text-secondary">
          <span>2 days × $54</span>
          <span className="tabular-nums">$108</span>
        </div>
        <div className="flex items-baseline justify-between gap-2 text-caption-2-regular text-text-secondary">
          <span>Taxes &amp; fees</span>
          <span className="tabular-nums">$31</span>
        </div>
        <label
          htmlFor={coverageId}
          className={cx(
            "mt-1 flex cursor-pointer items-center gap-1.5 rounded-md px-1",
            "transition-[background-color] duration-150 ease-out hover:bg-background-tertiary-default motion-reduce:transition-none",
          )}
        >
          <input
            id={coverageId}
            type="checkbox"
            checked={coverage}
            onChange={(event) => setCoverage(event.target.checked)}
            className={cx("size-3.5 shrink-0 accent-accent-600", focusRing)}
          />
          <span className="min-w-0 flex-1 truncate text-caption-2-regular text-text-secondary">
            Full coverage · $14/day
          </span>
          <span
            className={cx(
              "shrink-0 text-caption-2-semibold tabular-nums transition-[color] duration-150 ease-out motion-reduce:transition-none",
              coverage ? "text-text-primary" : "text-text-tertiary",
            )}
          >
            +$28
          </span>
        </label>
        <div className="mt-1 flex items-baseline justify-between gap-2 border-t border-separator-border pt-1">
          <span className="text-caption-1-semibold text-text-secondary">Total</span>
          <span aria-live="polite" className="text-body-2-semibold tabular-nums text-text-primary">
            <span
              key={coverage ? "covered" : "base"}
              className="inline-block animate-label-in motion-reduce:animate-none"
            >
              {usd.format(total)}
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}

/* 11. Packing Weather */

type WeatherDay = {
  label: string;
  date: string;
  high: number;
  low: number;
  condition: string;
  hint: string;
  icon: IconComponent;
  iconClass: string;
};

const FORECAST: WeatherDay[] = [
  {
    label: "Thu",
    date: "Nov 6",
    high: 12,
    low: 7,
    condition: "Rain",
    hint: "Rain from 14:00 — pack the shell and waterproof shoes.",
    icon: RiRainyLine,
    iconClass: "text-status-blue-text",
  },
  {
    label: "Fri",
    date: "Nov 7",
    high: 14,
    low: 8,
    condition: "Cloudy",
    hint: "Dry and mild — a light jacket is enough for the day.",
    icon: RiCloudLine,
    iconClass: "text-status-blue-text",
  },
  {
    label: "Sat",
    date: "Nov 8",
    high: 10,
    low: 5,
    condition: "Windy",
    hint: "Gusts to 30 km/h — bring a scarf and a warm layer.",
    icon: RiWindyLine,
    iconClass: "text-status-cyan-text",
  },
];

export function PackingWeather() {
  const [day, setDay] = useState(0);
  const [unit, setUnit] = useState<"C" | "F">("C");
  const active = FORECAST[day];
  const ActiveIcon = active.icon;
  const degrees = (celsius: number) => `${unit === "C" ? celsius : Math.round((celsius * 9) / 5 + 32)}°`;

  return (
    <section aria-label="Destination weather for New York" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Packing for New York</h3>
          <p className={meta}>Nov 6 – 8 · 3 days</p>
        </div>
        <div
          role="group"
          aria-label="Temperature unit"
          className="flex shrink-0 rounded-md bg-segmented-control-background p-0.5"
        >
          {(["C", "F"] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={unit === value}
              onClick={() => setUnit(value)}
              className={cx(
                "h-5 w-6 rounded-sm text-caption-2-semibold",
                "transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                unit === value
                  ? "bg-segmented-control-selected-background text-text-primary shadow-xs"
                  : "text-text-tertiary hover:text-text-secondary",
              )}
            >
              °{value}
            </button>
          ))}
        </div>
      </div>

      <div role="group" aria-label="Forecast by day" className="mt-2 grid grid-cols-3 gap-1.5">
        {FORECAST.map((item, index) => {
          const Icon = item.icon;
          const selected = index === day;
          return (
            <button
              key={item.date}
              type="button"
              aria-pressed={selected}
              onClick={() => setDay(index)}
              className={cx(
                "flex min-w-0 flex-col gap-0.5 rounded-lg border p-1.5 text-start",
                "transition-[background-color,border-color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
                focusRing,
                selected
                  ? "border-accent-500 bg-background-secondary-default shadow-xs"
                  : "border-border-button-default bg-background-primary-default hover:bg-background-primary-hover",
              )}
            >
              <span className="flex items-center justify-between gap-1">
                <span className="text-caption-2-semibold text-text-primary">{item.label}</span>
                <Icon className={cx("size-3.5 shrink-0", item.iconClass)} aria-hidden />
              </span>
              <span className="text-body-2-semibold tabular-nums text-text-primary">
                {degrees(item.high)}{" "}
                <span className="text-caption-2-regular text-text-tertiary">{degrees(item.low)}</span>
              </span>
              <span className="truncate text-caption-2-regular text-text-tertiary">{item.condition}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-1.5 flex items-start gap-2 rounded-lg bg-background-secondary-default p-1.5">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-primary-default text-accent-600 shadow-xs">
          <ActiveIcon className="size-3.5" aria-hidden />
        </span>
        <div aria-live="polite" className="min-w-0 flex-1">
          <p
            key={`${day}-${unit}`}
            className="animate-label-in text-caption-1-regular text-text-secondary motion-reduce:animate-none"
          >
            <span className="text-caption-1-semibold text-text-primary">Pack: </span>
            {active.hint}
          </p>
        </div>
      </div>
    </section>
  );
}

/* 12. Booking Summary */

type BookingStatus = "idle" | "confirming" | "confirmed";

export function BookingSummary() {
  const [status, setStatus] = useState<BookingStatus>("idle");

  useEffect(() => {
    if (status !== "confirming") return;
    const timer = window.setTimeout(() => setStatus("confirmed"), 900);
    return () => window.clearTimeout(timer);
  }, [status]);

  return (
    <section aria-label="Booking summary" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className={iconTile}>
          <RiTicket2Line className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Booking summary</h3>
          <p className={meta}>
            1 traveler · <bdi dir="ltr">SFO → JFK</bdi>
          </p>
        </div>
        <Tag tone={status === "confirmed" ? "green" : "neutral"}>
          {status === "confirmed" ? "Confirmed" : "Held 24h"}
        </Tag>
      </div>

      <dl className="mt-2 flex flex-col gap-1">
        <div className="flex items-baseline justify-between gap-2">
          <dt className="text-caption-1-regular text-text-secondary">Fare · 1 traveler</dt>
          <dd className="text-caption-1-medium tabular-nums text-text-primary">$298.00</dd>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <dt className="text-caption-1-regular text-text-secondary">Taxes &amp; carrier fees</dt>
          <dd className="text-caption-1-medium tabular-nums text-text-primary">$75.20</dd>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <dt className="text-caption-1-regular text-text-secondary">Seat 14A + 1 checked bag</dt>
          <dd className="text-caption-1-medium tabular-nums text-text-primary">$64.00</dd>
        </div>
      </dl>

      <div className="mt-1.5 flex items-baseline justify-between gap-2 border-t border-separator-border pt-1.5">
        <span className="text-caption-1-semibold text-text-secondary">Total</span>
        <span className="text-body-semibold tabular-nums text-text-primary">$437.20</span>
      </div>

      <div aria-live="polite" className="mt-1.5">
        {status === "confirmed" ? (
          <div className="flex h-8 animate-label-in items-center gap-2 rounded-lg bg-status-lime-background px-2 motion-reduce:animate-none">
            <RiCheckLine className="size-3.5 shrink-0 text-status-lime-text" aria-hidden />
            <p className="min-w-0 flex-1 truncate text-caption-2-regular text-status-lime-text">
              E-ticket sent to <bdi dir="ltr">maya.chen@northline.co</bdi>
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className={cx(quietButton, "h-6 shrink-0 text-text-primary hover:bg-background-primary-default/60")}
            >
              Reset
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setStatus("confirming")}
            disabled={status === "confirming"}
            className={cx(primaryButton, "h-8 w-full")}
          >
            {status === "confirming" ? (
              <>
                <RiLoader4Line className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
                Confirming
              </>
            ) : (
              <>
                Confirm · $437.20
                <RiArrowRightLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
              </>
            )}
          </button>
        )}
      </div>
    </section>
  );
}

export const TRAVEL_SECTION: ExtendedSection = {
  id: "travel",
  title: "Travel",
  blurb: "Itineraries, gates and the small details of a trip.",
  file: "travel.tsx",
  entries: [
    {
      name: "Flight Card",
      description: "Route, times, gate and a live status with a gate-info disclosure.",
      Demo: FlightCard,
    },
    {
      name: "Boarding Pass",
      description: "Passenger, seat and boarding group on a pass that saves to a wallet.",
      Demo: BoardingPass,
    },
    {
      name: "Hotel Row",
      description: "Dates, room type, nightly price and a working select action.",
      Demo: HotelRow,
    },
    {
      name: "Trip Timeline",
      description: "Three days of flights, stays and plans on one selectable rail.",
      Demo: TripTimeline,
      wide: true,
    },
    {
      name: "Seat Map",
      description: "A cabin grid with taken, exit-row and selected seats.",
      Demo: SeatMap,
    },
    {
      name: "Price Alert",
      description: "A tracked route, today's fare and the drop threshold that triggers an alert.",
      Demo: PriceAlert,
    },
    {
      name: "Itinerary Day",
      description: "Timed plans with the current stop marked and the rest behind it.",
      Demo: ItineraryDay,
    },
    {
      name: "Baggage Tracker",
      description: "Every scan from the check-in desk to the carousel, with times.",
      Demo: BaggageTracker,
    },
    {
      name: "Gate Change",
      description: "The old gate, the new one and a way to acknowledge the move.",
      Demo: GateChange,
    },
    {
      name: "Car Rental",
      description: "Pickup, drop-off, class and a total that reacts to coverage.",
      Demo: CarRental,
    },
    {
      name: "Packing Weather",
      description: "Destination forecast by day with a packing hint and unit switch.",
      Demo: PackingWeather,
    },
    {
      name: "Booking Summary",
      description: "Fare, taxes and a confirm that sticks with a sent e-ticket.",
      Demo: BookingSummary,
    },
  ],
};
