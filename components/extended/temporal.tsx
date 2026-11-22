"use client";

import { useEffect, useId, useMemo, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCalendarLine,
  RiCheckLine,
  RiCloseLine,
  RiFileTextLine,
  RiFlashlightLine,
  RiGlobalLine,
  RiMapPinLine,
  RiPauseLine,
  RiPlayLine,
  RiRocketLine,
  RiSearchLine,
  RiTimeLine,
  RiUploadCloud2Line,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/**
 * Temporal: the family that answers “when?”. Every specimen is pinned to a
 * fixed reference date so the library renders identically on the server and
 * the client. Only the countdown advances, and only after mount.
 */

/* -------------------------------------------------------------------------- */
/*  Shared                                                                     */
/* -------------------------------------------------------------------------- */

const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";

const CARD =
  "w-full max-w-[320px] rounded-xl border border-border-button-default bg-background-primary-default shadow-card";

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx(CARD, className)}>{children}</div>;
}

function IconButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  className,
  iconClassName,
}: {
  icon: IconComponent;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cx(
        "flex size-7 shrink-0 items-center justify-center rounded-md text-foreground-icon-secondary",
        "transition-[background-color,color] duration-150 ease",
        "hover:bg-background-tertiary-hover hover:text-text-primary",
        FOCUS,
        "disabled:pointer-events-none disabled:text-foreground-icon-disabled",
        className,
      )}
    >
      <Icon className={cx("size-4", iconClassName)} aria-hidden />
    </button>
  );
}

function PresetButton({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cx(
        "flex h-6 items-center justify-center rounded-md px-2 text-caption-2-semibold whitespace-nowrap",
        "transition-colors duration-150 ease",
        FOCUS,
        active
          ? "bg-segmented-control-selected-background text-text-primary shadow-xs"
          : "text-text-tertiary hover:text-text-secondary",
        className,
      )}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Date math — pure, so rendering never depends on the clock                  */
/* -------------------------------------------------------------------------- */

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Monday-first, matching the grid. */
const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

/** Monday-first long names, used for accessible day labels. */
const WEEKDAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const MONTH_OFFSETS = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

/** Sakamoto's algorithm: 0 = Sunday, 1 = Monday, … */
const SAKAMOTO = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];

const pad2 = (value: number) => String(value).padStart(2, "0");

function isLeapYear(year: number) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

/** `month` is 0-based here. */
function daysInMonth(year: number, month: number) {
  return month === 1 && isLeapYear(year) ? 29 : DAYS_IN_MONTH[month];
}

/** `month` is 0-based here. */
function weekdayOf(year: number, month: number, day: number) {
  const adjusted = month < 2 ? year - 1 : year;
  return (
    (adjusted +
      Math.floor(adjusted / 4) -
      Math.floor(adjusted / 100) +
      Math.floor(adjusted / 400) +
      SAKAMOTO[month] +
      day) %
    7
  );
}

/** `month` is 0-based here. */
function isoOf(year: number, month: number, day: number) {
  return `${year}-${pad2(month + 1)}-${pad2(day)}`;
}

function parseIso(iso: string) {
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number);
  return { year, month: month - 1, day };
}

/**
 * A stable ordinal for a calendar day. Only differences matter, so the epoch
 * is irrelevant; this avoids constructing `Date` objects during render.
 */
function dayNumber(iso: string) {
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number);
  const leapDay = isLeapYear(year) && month > 2 ? 1 : 0;
  return (
    year * 365 +
    Math.floor((year - 1) / 4) -
    Math.floor((year - 1) / 100) +
    Math.floor((year - 1) / 400) +
    MONTH_OFFSETS[month - 1] +
    leapDay +
    day
  );
}

function formatLongDate(iso: string) {
  const { year, month, day } = parseIso(iso);
  const weekday = WEEKDAY_NAMES[(weekdayOf(year, month, day) + 6) % 7];
  return `${weekday}, ${MONTHS[month]} ${day}`;
}

function shortDate(iso: string) {
  const { month, day } = parseIso(iso);
  return `${MONTHS_SHORT[month]} ${day}`;
}

/* -------------------------------------------------------------------------- */
/*  Calendar grid                                                              */
/* -------------------------------------------------------------------------- */

const TODAY = { year: 2026, month: 2, day: 18 } as const;
const TODAY_ISO = isoOf(TODAY.year, TODAY.month, TODAY.day);

type CalendarEvent = {
  iso: string;
  title: string;
  time: string;
  tone: string;
};

const CALENDAR_EVENTS: CalendarEvent[] = [
  { iso: "2026-02-26", title: "Recce with the gaffer", time: "09:00", tone: "bg-chart-3" },
  { iso: "2026-03-04", title: "Storyboard review", time: "10:00", tone: "bg-chart-3" },
  { iso: "2026-03-12", title: "Location scout", time: "08:30", tone: "bg-chart-1" },
  { iso: "2026-03-18", title: "Shoot day one", time: "07:00", tone: "bg-chart-5" },
  { iso: "2026-03-18", title: "Call sheet due", time: "18:00", tone: "bg-chart-2" },
  { iso: "2026-03-24", title: "Client review", time: "15:00", tone: "bg-chart-4" },
  { iso: "2026-04-02", title: "Final delivery", time: "12:00", tone: "bg-chart-1" },
];

type CalendarCell = {
  year: number;
  month: number;
  day: number;
  iso: string;
  inMonth: boolean;
};

function shiftMonth(view: { year: number; month: number }, delta: number) {
  const month = view.month + delta;
  if (month < 0) return { year: view.year - 1, month: 11 };
  if (month > 11) return { year: view.year + 1, month: 0 };
  return { year: view.year, month };
}

/** Always returns 42 cells so the card keeps the same height every month. */
function buildMonth(year: number, month: number): CalendarCell[] {
  const offset = (weekdayOf(year, month, 1) + 6) % 7;
  const cells: CalendarCell[] = [];

  for (let index = 0; index < 42; index += 1) {
    let cellYear = year;
    let cellMonth = month;
    let cellDay = index - offset + 1;

    if (cellDay < 1) {
      cellMonth -= 1;
      if (cellMonth < 0) {
        cellMonth = 11;
        cellYear -= 1;
      }
      cellDay += daysInMonth(cellYear, cellMonth);
    } else if (cellDay > daysInMonth(year, month)) {
      cellDay -= daysInMonth(year, month);
      cellMonth += 1;
      if (cellMonth > 11) {
        cellMonth = 0;
        cellYear += 1;
      }
    }

    cells.push({
      year: cellYear,
      month: cellMonth,
      day: cellDay,
      iso: isoOf(cellYear, cellMonth, cellDay),
      inMonth: cellMonth === month && cellYear === year,
    });
  }

  return cells;
}

export function CalendarGrid() {
  const [view, setView] = useState<{ year: number; month: number }>({ year: TODAY.year, month: TODAY.month });
  const [selected, setSelected] = useState(TODAY_ISO);

  const cells = useMemo(() => buildMonth(view.year, view.month), [view]);
  const selectedEvents = CALENDAR_EVENTS.filter((event) => event.iso === selected);
  const monthPrefix = `${view.year}-${pad2(view.month + 1)}`;
  const monthEventCount = CALENDAR_EVENTS.filter((event) => event.iso.startsWith(monthPrefix)).length;

  const goToMonth = (delta: number) => {
    const next = shiftMonth(view, delta);
    // Keep the same day-of-month where possible, clamped to the new month.
    const day = Math.min(Number(selected.slice(8, 10)), daysInMonth(next.year, next.month));
    setView(next);
    setSelected(isoOf(next.year, next.month, day));
  };

  const selectDay = (cell: CalendarCell) => {
    setSelected(cell.iso);
    // A trailing or leading day belongs to the neighbouring month; follow it.
    if (!cell.inMonth) setView({ year: cell.year, month: cell.month });
  };

  const goToToday = () => {
    setView({ year: TODAY.year, month: TODAY.month });
    setSelected(TODAY_ISO);
  };

  const isOnToday =
    view.year === TODAY.year && view.month === TODAY.month && selected === TODAY_ISO;

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-1 border-b border-separator-border px-3 py-2">
        <div className="flex min-w-0 flex-col">
          <h3 className="text-body-2-semibold text-text-primary">
            {MONTHS[view.month]} {view.year}
          </h3>
          <span className="text-caption-1-regular text-text-tertiary">
            {monthEventCount} {monthEventCount === 1 ? "event" : "events"} this month
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <IconButton
            icon={RiArrowLeftSLine}
            label="Previous month"
            onClick={() => goToMonth(-1)}
            iconClassName="rtl:-scale-x-100"
          />
          <IconButton
            icon={RiArrowRightSLine}
            label="Next month"
            onClick={() => goToMonth(1)}
            iconClassName="rtl:-scale-x-100"
          />
        </div>
      </div>

      <div className="px-2.5 pt-2 pb-2.5">
        <div className="grid grid-cols-7">
          {WEEKDAYS.map((weekday) => (
            <span
              key={weekday}
              aria-hidden
              className="flex h-5 items-center justify-center text-caption-2-semibold text-text-tertiary"
            >
              {weekday}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-0.5" role="group" aria-label={`${MONTHS[view.month]} ${view.year}`}>
          {cells.map((cell) => {
            const isSelected = cell.iso === selected;
            const isToday = cell.iso === TODAY_ISO;
            const events = CALENDAR_EVENTS.filter((event) => event.iso === cell.iso);
            const weekday = WEEKDAY_NAMES[(weekdayOf(cell.year, cell.month, cell.day) + 6) % 7];
            const eventLabel =
              events.length === 0
                ? ""
                : `, ${events.length} ${events.length === 1 ? "event" : "events"}`;

            return (
              <button
                key={cell.iso}
                type="button"
                aria-label={`${weekday}, ${MONTHS[cell.month]} ${cell.day}, ${cell.year}${eventLabel}`}
                aria-pressed={isSelected}
                aria-current={isToday ? "date" : undefined}
                onClick={() => selectDay(cell)}
                className={cx(
                  "relative mx-auto flex size-8 flex-col items-center justify-center rounded-md",
                  "text-caption-1-medium tabular-nums transition-colors duration-100 ease",
                  FOCUS,
                  !isSelected && "hover:bg-background-tertiary-hover hover:text-text-primary",
                  cell.inMonth ? "text-text-secondary" : "text-text-tertiary",
                  isToday && !isSelected && "ring-1 ring-inset ring-border-button-active",
                  isSelected && "bg-accent-600 text-text-white shadow-xs hover:bg-accent-700",
                )}
              >
                <span>{cell.day}</span>
                {events.length > 0 && (
                  <span aria-hidden className="absolute bottom-0.5 flex items-center gap-0.5">
                    {events.slice(0, 3).map((event, index) => (
                      <span
                        key={`${event.title}-${index}`}
                        className={cx(
                          "size-1 rounded-full",
                          isSelected ? "bg-accent-100" : event.tone,
                        )}
                      />
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-separator-border px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <span className="min-w-0 truncate text-body-2-semibold text-text-primary">
            {formatLongDate(selected)}
          </span>
          <button
            type="button"
            onClick={goToToday}
            disabled={isOnToday}
            className={cx(
              "inline-flex h-6 shrink-0 items-center rounded-sm px-1.5 text-caption-1-semibold text-text-secondary",
              "transition-colors duration-150 ease hover:text-text-primary",
              FOCUS,
              "disabled:pointer-events-none disabled:opacity-40",
            )}
          >
            Today
          </button>
        </div>

        {selectedEvents.length > 0 ? (
          <ul className="mt-1.5 flex flex-col gap-1">
            {selectedEvents.map((event) => (
              <li key={`${event.iso}-${event.title}`} className="flex items-center gap-1.5">
                <span aria-hidden className={cx("size-1.5 shrink-0 rounded-full", event.tone)} />
                <span className="min-w-0 flex-1 truncate text-caption-1-regular text-text-secondary">
                  {event.title}
                </span>
                <span className="shrink-0 text-caption-2-regular text-text-tertiary tabular-nums">
                  {event.time}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-caption-1-regular text-text-tertiary">
            Nothing booked. Pick another day for the call sheet.
          </p>
        )}
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Date range field                                                           */
/* -------------------------------------------------------------------------- */

const NIGHTLY_RATE = 180;
const money = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

const RANGE_PRESETS = [
  { id: "7d", label: "Last 7 days", start: "2026-03-12", end: "2026-03-18" },
  { id: "30d", label: "Last 30 days", start: "2026-02-17", end: "2026-03-18" },
  { id: "quarter", label: "This quarter", start: "2026-01-01", end: "2026-03-31" },
] as const;

const dateFieldClass = cx(
  "h-9 w-full rounded-lg bg-background-tertiary-default px-2 text-start",
  "text-body-2-medium text-text-primary tabular-nums outline-none",
  "ring-1 ring-inset ring-transparent transition-[box-shadow,background-color] duration-150 ease",
  "hover:ring-border-button-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring",
  "[&::-webkit-calendar-picker-indicator]:cursor-pointer",
);

export function DateRangeField() {
  const startId = useId();
  const endId = useId();
  const hintId = useId();

  const [start, setStart] = useState("2026-03-12");
  const [end, setEnd] = useState("2026-03-18");

  const nights = start && end ? dayNumber(end) - dayNumber(start) : Number.NaN;
  const valid = Number.isFinite(nights) && nights >= 0;
  const activePreset =
    RANGE_PRESETS.find((preset) => preset.start === start && preset.end === end)?.id ?? null;

  const applyPreset = (preset: (typeof RANGE_PRESETS)[number]) => {
    setStart(preset.start);
    setEnd(preset.end);
  };

  const helper = valid
    ? nights === 0
      ? "Same-day check-in and check-out."
      : `Estimated $${money.format(nights * NIGHTLY_RATE)} at $${money.format(NIGHTLY_RATE)} a night.`
    : !start || !end
      ? "Choose both a check-in and a check-out date."
      : "Check-out must be after check-in.";

  return (
    <Card className="flex flex-col gap-3 p-3">
      <div className="flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-background-secondary-default text-foreground-icon-secondary">
          <RiCalendarLine className="size-4" aria-hidden />
        </span>
        <div className="flex min-w-0 flex-col">
          <h3 className="text-body-2-semibold text-text-primary">Stay dates</h3>
          <p className="text-caption-1-regular text-text-tertiary">Cabin 04 · 2 guests</p>
        </div>
      </div>

      <div
        role="group"
        aria-label="Quick date ranges"
        className="flex gap-0.5 rounded-lg bg-segmented-control-background p-0.5"
      >
        {RANGE_PRESETS.map((preset) => (
          <PresetButton
            key={preset.id}
            active={activePreset === preset.id}
            onClick={() => applyPreset(preset)}
            className="flex-1 px-1"
          >
            {preset.label}
          </PresetButton>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label htmlFor={startId} className="text-caption-1-medium text-text-tertiary">
            Check-in
          </label>
          <input
            id={startId}
            type="date"
            dir="ltr"
            value={start}
            max={end || undefined}
            aria-invalid={!valid}
            aria-describedby={hintId}
            onChange={(event) => setStart(event.target.value)}
            className={dateFieldClass}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={endId} className="text-caption-1-medium text-text-tertiary">
            Check-out
          </label>
          <input
            id={endId}
            type="date"
            dir="ltr"
            value={end}
            min={start || undefined}
            aria-invalid={!valid}
            aria-describedby={hintId}
            onChange={(event) => setEnd(event.target.value)}
            className={cx(
              dateFieldClass,
              !valid && "ring-1 ring-border-error-default hover:ring-border-error-default",
            )}
          />
        </div>
      </div>

      <div className="rounded-lg bg-background-secondary-default px-2.5 py-2" aria-live="polite">
        <div className="flex items-end justify-between gap-2">
          <div className="flex min-w-0 flex-col">
            <span className="text-caption-1-regular text-text-tertiary">Stay length</span>
            <span
              className={cx(
                "text-title-3-semibold tabular-nums",
                valid ? "text-text-primary" : "text-text-error-primary",
              )}
            >
              {valid ? `${nights} ${nights === 1 ? "night" : "nights"}` : "Check dates"}
            </span>
          </div>
          <span
            dir="ltr"
            className="shrink-0 text-caption-1-medium text-text-secondary tabular-nums"
          >
            {valid ? `${shortDate(start)} – ${shortDate(end)}` : "—"}
          </span>
        </div>
        <p
          id={hintId}
          className={cx(
            "mt-0.5 text-caption-2-regular",
            valid ? "text-text-tertiary" : "text-text-error-primary",
          )}
        >
          {helper}
        </p>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Relative time                                                              */
/* -------------------------------------------------------------------------- */

type Moment = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

const RELATIVE_NOW: Moment = { year: 2026, month: 2, day: 18, hour: 14, minute: 32 };

function isoMoment(at: Moment) {
  return `${at.year}-${pad2(at.month + 1)}-${pad2(at.day)}T${pad2(at.hour)}:${pad2(at.minute)}:00Z`;
}

function formatAbsolute(at: Moment) {
  return `${MONTHS_SHORT[at.month]} ${at.day}, ${at.year} · ${pad2(at.hour)}:${pad2(at.minute)} UTC`;
}

/**
 * Relative copy from two fixed moments. “Yesterday” is a calendar-day
 * judgement, not a 24-hour bucket, which is what people actually mean.
 */
function relativeFrom(at: Moment, now: Moment) {
  const dayDiff = dayNumber(isoMoment(at)) - dayNumber(isoMoment(now));

  if (dayDiff === 0) {
    const minutes = now.hour * 60 + now.minute - (at.hour * 60 + at.minute);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  if (dayDiff === -1) return "yesterday";
  if (dayDiff < -1) return `${-dayDiff} days ago`;
  return "upcoming";
}

type ActivityEvent = {
  id: string;
  title: string;
  detail: string;
  at: Moment;
  icon: IconComponent;
  tone: string;
};

const ACTIVITY: ActivityEvent[] = [
  {
    id: "call-sheet",
    title: "Call sheet published",
    detail: "18 crew · Bay 2",
    at: { year: 2026, month: 2, day: 18, hour: 14, minute: 29 },
    icon: RiFileTextLine,
    tone: "text-chart-1",
  },
  {
    id: "cover",
    title: "Maya approved the cover",
    detail: "Version 3 · final",
    at: { year: 2026, month: 2, day: 18, hour: 13, minute: 45 },
    icon: RiCheckLine,
    tone: "text-chart-2",
  },
  {
    id: "location",
    title: "Location moved to Bay 2",
    detail: "Stage B · 09:00 call",
    at: { year: 2026, month: 2, day: 18, hour: 12, minute: 32 },
    icon: RiMapPinLine,
    tone: "text-chart-3",
  },
  {
    id: "budget",
    title: "Budget v4 uploaded",
    detail: "Finance · 2.4 MB",
    at: { year: 2026, month: 2, day: 17, hour: 16, minute: 5 },
    icon: RiUploadCloud2Line,
    tone: "text-chart-4",
  },
  {
    id: "lighting",
    title: "Lighting test wrapped",
    detail: "Rooftop · 42 stills",
    at: { year: 2026, month: 2, day: 15, hour: 9, minute: 10 },
    icon: RiFlashlightLine,
    tone: "text-chart-5",
  },
];

export function RelativeTime() {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-separator-border px-3 py-2">
        <div className="flex items-center gap-1.5">
          <RiTimeLine className="size-4 text-foreground-icon-secondary" aria-hidden />
          <h3 className="text-body-2-semibold text-text-primary">Recent activity</h3>
        </div>
        <span className="shrink-0 text-caption-2-regular text-text-tertiary tabular-nums">14:32 UTC</span>
      </div>

      <ul className="divide-y divide-separator-border">
        {ACTIVITY.map((event) => {
          const Icon = event.icon;
          const relative = relativeFrom(event.at, RELATIVE_NOW);
          const absolute = formatAbsolute(event.at);

          return (
            <li key={event.id} className="flex items-start gap-2 px-3 py-2">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-background-secondary-default">
                <Icon className={cx("size-3.5", event.tone)} aria-hidden />
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="truncate text-body-2-medium text-text-primary">{event.title}</p>
                <p className="truncate text-caption-1-regular text-text-tertiary">{event.detail}</p>
              </div>
              <time
                dateTime={isoMoment(event.at)}
                title={absolute}
                aria-label={`${relative} — ${absolute}`}
                className="shrink-0 pt-0.5 text-caption-2-medium text-text-secondary tabular-nums"
              >
                {relative}
              </time>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-separator-border px-3 py-1.5">
        <p className="text-caption-2-regular text-text-tertiary">
          Hover a time for the exact stamp.
        </p>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Countdown timer                                                            */
/* -------------------------------------------------------------------------- */

const LAUNCH_TOTAL_SECONDS = 5 * 24 * 60 * 60;
const LAUNCH_REMAINING_SECONDS = 3 * 24 * 60 * 60 + 18 * 60 * 60 + 24 * 60 + 51;

export function CountdownTimer() {
  const [remaining, setRemaining] = useState(LAUNCH_REMAINING_SECONDS);
  const [running, setRunning] = useState(true);
  const finished = remaining <= 0;

  useEffect(() => {
    if (!running || finished) return;
    const timer = window.setInterval(() => {
      setRemaining((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running, finished]);

  const days = Math.floor(remaining / 86_400);
  const hours = Math.floor((remaining % 86_400) / 3_600);
  const minutes = Math.floor((remaining % 3_600) / 60);
  const seconds = remaining % 60;
  const progress = Math.min(
    100,
    Math.max(0, ((LAUNCH_TOTAL_SECONDS - remaining) / LAUNCH_TOTAL_SECONDS) * 100),
  );

  const blocks = [
    { label: "days", value: days },
    { label: "hours", value: hours },
    { label: "minutes", value: minutes },
    { label: "seconds", value: seconds },
  ];

  return (
    <Card className="overflow-hidden">
      <div className="flex items-start justify-between gap-2 border-b border-separator-border px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-background-secondary-default text-foreground-icon-secondary">
            <RiRocketLine className="size-4" aria-hidden />
          </span>
          <div className="flex min-w-0 flex-col">
            <h3 className="truncate text-body-2-semibold text-text-primary">Season 4 launch</h3>
            <span className="truncate text-caption-1-regular text-text-tertiary">
              Sun, Mar 22 · 09:00 UTC
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setRunning((current) => !current)}
          disabled={finished}
          aria-label={finished ? "Launch day reached" : running ? "Pause countdown" : "Resume countdown"}
          className={cx(
            "inline-flex h-8 shrink-0 items-center gap-1 rounded-lg border border-border-button-default",
            "bg-background-primary-default px-2 text-caption-1-semibold text-text-primary shadow-xs",
            "transition-colors duration-150 ease hover:bg-background-primary-hover",
            FOCUS,
            "disabled:pointer-events-none disabled:opacity-40",
          )}
        >
          {finished ? (
            <RiCheckLine className="size-3.5" aria-hidden />
          ) : running ? (
            <RiPauseLine className="size-3.5" aria-hidden />
          ) : (
            <RiPlayLine className="size-3.5" aria-hidden />
          )}
          {finished ? "Live" : running ? "Pause" : "Resume"}
        </button>
      </div>

      <div className="flex flex-col gap-2.5 px-3 py-3">
        <div
          role="timer"
          aria-live="off"
          aria-label={`Time until launch: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`}
          className="grid grid-cols-4 gap-1.5"
        >
          {blocks.map((block) => (
            <div
              key={block.label}
              className="flex flex-col items-center gap-0.5 rounded-lg bg-background-secondary-default py-1.5"
            >
              <span className="text-title-3-semibold text-text-primary tabular-nums">
                {pad2(block.value)}
              </span>
              <span className="text-caption-2-medium text-text-tertiary uppercase">{block.label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-caption-1-medium text-text-secondary">
            <span
              aria-hidden
              className={cx(
                "size-1.5 rounded-full",
                finished
                  ? "bg-chart-2"
                  : running
                    ? "animate-pulse bg-chart-2 motion-reduce:animate-none"
                    : "bg-foreground-icon-tertiary",
              )}
            />
            {finished ? "Live now" : running ? "Counting down" : "Paused"}
          </span>
          <span className="text-caption-2-regular text-text-tertiary tabular-nums">
            {Math.round(progress)}% elapsed
          </span>
        </div>

        <div
          role="progressbar"
          aria-label="Launch window elapsed"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          aria-valuetext={`${Math.round(progress)}% elapsed`}
          className="flex h-1.5 overflow-hidden rounded-full bg-background-tertiary-default"
        >
          <span
            className="block h-full shrink-0 rounded-full bg-accent-500 transition-[width] duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-caption-2-regular text-text-tertiary">
          Five-day launch window · updates every second while running.
        </p>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Duration field                                                             */
/* -------------------------------------------------------------------------- */

const DURATION_PRESETS = [
  { id: "15m", label: "15m", seconds: 15 * 60 },
  { id: "1h", label: "1h", seconds: 60 * 60 },
  { id: "4h", label: "4h", seconds: 4 * 60 * 60 },
] as const;

function totalMinutesLabel(totalSeconds: number) {
  const minutes = totalSeconds / 60;
  if (totalSeconds === 0) return "0";
  if (minutes < 1) return "<1";
  const rounded = Math.round(minutes * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function humanizeDuration(totalSeconds: number) {
  if (totalSeconds === 0) return "No time selected";

  const hours = Math.floor(totalSeconds / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;
  const parts: string[] = [];

  if (hours > 0) parts.push(`${hours} ${hours === 1 ? "hr" : "hrs"}`);
  if (minutes > 0) parts.push(`${minutes} min`);
  if (seconds > 0) parts.push(`${seconds} sec`);

  return parts.join(" ");
}

function DurationSegment({
  label,
  ariaLabel,
  value,
  max,
  onChange,
}: {
  label: string;
  ariaLabel: string;
  value: string;
  max: number;
  onChange: (next: string) => void;
}) {
  const normalize = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 2);
    if (!digits) return "";
    if (digits.length === 1) return digits;
    return String(Math.min(max, Number(digits))).padStart(2, "0");
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <input
        type="text"
        inputMode="numeric"
        maxLength={2}
        autoComplete="off"
        spellCheck={false}
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange(normalize(event.target.value))}
        onBlur={() => {
          const next = value === "" ? "00" : String(Math.min(max, Number(value))).padStart(2, "0");
          onChange(next);
        }}
        onKeyDown={(event) => {
          if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
          event.preventDefault();
          const current = Number(value) || 0;
          const delta = event.key === "ArrowUp" ? 1 : -1;
          const next = (current + delta + (max + 1)) % (max + 1);
          onChange(pad2(next));
        }}
        className={cx(
          "h-11 w-14 rounded-lg bg-background-tertiary-default text-center",
          "text-title-3-semibold text-text-primary tabular-nums outline-none",
          "ring-1 ring-inset ring-transparent transition-[box-shadow,background-color] duration-150 ease",
          "hover:ring-border-button-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring",
        )}
      />
      <span className="text-caption-2-medium text-text-tertiary uppercase">{label}</span>
    </div>
  );
}

export function DurationField() {
  const [hours, setHours] = useState("01");
  const [minutes, setMinutes] = useState("30");
  const [seconds, setSeconds] = useState("00");

  const totalSeconds =
    (Number(hours) || 0) * 3_600 + (Number(minutes) || 0) * 60 + (Number(seconds) || 0);
  const activePreset =
    DURATION_PRESETS.find((preset) => preset.seconds === totalSeconds)?.id ?? null;

  const applyPreset = (total: number) => {
    setHours(pad2(Math.floor(total / 3_600)));
    setMinutes(pad2(Math.floor((total % 3_600) / 60)));
    setSeconds(pad2(total % 60));
  };

  return (
    <Card className="flex flex-col gap-3 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col">
          <h3 className="text-body-2-semibold text-text-primary">Session length</h3>
          <p className="text-caption-1-regular text-text-tertiary">Studio B · 15-minute blocks</p>
        </div>
        <button
          type="button"
          onClick={() => applyPreset(0)}
          disabled={totalSeconds === 0}
          className={cx(
            "inline-flex h-6 shrink-0 items-center rounded-sm px-1.5 text-caption-1-semibold text-text-secondary",
            "transition-colors duration-150 ease hover:text-text-primary",
            FOCUS,
            "disabled:pointer-events-none disabled:opacity-40",
          )}
        >
          Clear
        </button>
      </div>

      <div
        role="group"
        aria-label="Session duration"
        className="flex items-start justify-center gap-1"
      >
        <DurationSegment label="hrs" ariaLabel="Hours" value={hours} max={23} onChange={(next) => setHours(next)} />
        <span aria-hidden className="mt-2.5 text-title-3-semibold text-text-tertiary">
          :
        </span>
        <DurationSegment label="min" ariaLabel="Minutes" value={minutes} max={59} onChange={(next) => setMinutes(next)} />
        <span aria-hidden className="mt-2.5 text-title-3-semibold text-text-tertiary">
          :
        </span>
        <DurationSegment label="sec" ariaLabel="Seconds" value={seconds} max={59} onChange={(next) => setSeconds(next)} />
      </div>

      <div
        role="group"
        aria-label="Quick durations"
        className="flex gap-0.5 rounded-lg bg-segmented-control-background p-0.5"
      >
        {DURATION_PRESETS.map((preset) => (
          <PresetButton
            key={preset.id}
            active={activePreset === preset.id}
            onClick={() => applyPreset(preset.seconds)}
            className="flex-1"
          >
            {preset.label}
          </PresetButton>
        ))}
      </div>

      <div
        className="flex items-end justify-between gap-2 rounded-lg bg-background-secondary-default px-2.5 py-2"
        aria-live="polite"
      >
        <div className="flex min-w-0 flex-col">
          <span className="text-caption-1-regular text-text-tertiary">Total</span>
          <div className="flex items-baseline gap-1">
            <span className="text-title-3-semibold text-text-primary tabular-nums">
              {totalMinutesLabel(totalSeconds)}
            </span>
            <span className="text-caption-1-regular text-text-secondary">min total</span>
          </div>
        </div>
        <span className="shrink-0 text-end text-caption-1-regular text-text-tertiary">
          {humanizeDuration(totalSeconds)}
        </span>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Timezone picker                                                            */
/* -------------------------------------------------------------------------- */

const CURRENT_ZONE_ID = "America/Los_Angeles";
const REFERENCE_UTC_MINUTES = 14 * 60 + 32;

type Zone = {
  id: string;
  city: string;
  country: string;
  /** Minutes east of UTC. */
  offset: number;
  abbr: string;
};

const ZONES: Zone[] = [
  {
    id: "America/Los_Angeles",
    city: "Los Angeles",
    country: "United States",
    offset: -480,
    abbr: "PDT",
  },
  { id: "America/New_York", city: "New York", country: "United States", offset: -240, abbr: "EDT" },
  { id: "Europe/London", city: "London", country: "United Kingdom", offset: 0, abbr: "GMT" },
  { id: "Europe/Berlin", city: "Berlin", country: "Germany", offset: 60, abbr: "CET" },
  { id: "Asia/Tokyo", city: "Tokyo", country: "Japan", offset: 540, abbr: "JST" },
  { id: "Australia/Sydney", city: "Sydney", country: "Australia", offset: 660, abbr: "AEDT" },
];

function formatOffset(offsetMinutes: number) {
  const sign = offsetMinutes < 0 ? "−" : "+";
  const absolute = Math.abs(offsetMinutes);
  return `UTC${sign}${pad2(Math.floor(absolute / 60))}:${pad2(absolute % 60)}`;
}

/** Local wall-clock time at the fixed reference instant. */
function zoneTime(offsetMinutes: number) {
  const total = ((REFERENCE_UTC_MINUTES + offsetMinutes) % 1_440 + 1_440) % 1_440;
  return `${pad2(Math.floor(total / 60))}:${pad2(total % 60)}`;
}

export function TimezonePicker() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(CURRENT_ZONE_ID);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase().replace(/−/g, "-");
    if (!needle) return ZONES;

    return ZONES.filter((zone) =>
      `${zone.city} ${zone.country} ${zone.id} ${zone.abbr} ${formatOffset(zone.offset)}`
        .toLowerCase()
        .replace(/−/g, "-")
        .includes(needle),
    );
  }, [query]);

  const selected = ZONES.find((zone) => zone.id === selectedId) ?? ZONES[0];

  return (
    <Card className="overflow-hidden">
      <div
        aria-live="polite"
        className="flex items-start justify-between gap-2 border-b border-separator-border px-3 py-2"
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-background-secondary-default text-foreground-icon-secondary">
            <RiGlobalLine className="size-4" aria-hidden />
          </span>
          <div className="flex min-w-0 flex-col">
            <h3 className="truncate text-body-2-semibold text-text-primary">{selected.city}</h3>
            <span className="truncate text-caption-1-regular text-text-tertiary">
              {selected.country} · <bdi dir="ltr">{formatOffset(selected.offset)}</bdi>
            </span>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end" dir="ltr">
          <span className="text-body-2-semibold text-text-primary tabular-nums">
            {zoneTime(selected.offset)}
          </span>
          <span className="text-caption-2-regular text-text-tertiary">{selected.abbr}</span>
        </div>
      </div>

      <div className="border-b border-separator-border px-2.5 py-2">
        <div className="flex h-8 items-center gap-2 rounded-lg bg-background-tertiary-default px-2 ring-1 ring-inset ring-transparent transition-[box-shadow] duration-150 ease hover:ring-border-button-hover focus-within:ring-2 focus-within:ring-border-focus-ring">
          <RiSearchLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
          <input
            type="search"
            aria-label="Search timezones"
            placeholder="Search city or offset"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-body-2-regular text-text-primary outline-none placeholder:text-text-tertiary [&::-webkit-search-cancel-button]:appearance-none"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear timezone search"
              onClick={() => setQuery("")}
              className={cx(
                "flex size-5 shrink-0 items-center justify-center rounded-sm text-foreground-icon-secondary",
                "transition-colors duration-150 ease hover:bg-background-tertiary-hover hover:text-text-primary",
                FOCUS,
              )}
            >
              <RiCloseLine className="size-3.5" aria-hidden />
            </button>
          )}
        </div>
        <span className="sr-only" role="status">
          {filtered.length} {filtered.length === 1 ? "zone" : "zones"}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-1 px-3 py-6 text-center">
          <div role="status" className="flex flex-col items-center gap-1">
            <RiGlobalLine className="size-5 text-foreground-icon-tertiary" aria-hidden />
            <p className="text-body-2-medium text-text-secondary">No zones found</p>
            <p className="text-caption-1-regular text-text-tertiary">
              Try a city, country or an offset like “+09:00”.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setQuery("")}
            className={cx(
              "mt-1 inline-flex h-6 items-center rounded-sm px-1.5 text-caption-1-semibold text-text-secondary",
              "underline-offset-2 transition-colors duration-150 ease hover:text-text-primary hover:underline",
              FOCUS,
            )}
          >
            Clear search
          </button>
        </div>
      ) : (
        <ul aria-label="Timezones" className="flex flex-col gap-0.5 p-1">
          {filtered.map((zone) => {
            const active = zone.id === selectedId;
            const current = zone.id === CURRENT_ZONE_ID;

            return (
              <li key={zone.id}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedId(zone.id)}
                  className={cx(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-start",
                    "transition-colors duration-100 ease",
                    FOCUS,
                    active
                      ? "bg-background-secondary-default"
                      : "hover:bg-background-secondary-hover",
                  )}
                >
                  <span className="flex size-4 shrink-0 items-center justify-center text-foreground-icon-primary">
                    {active && <RiCheckLine className="size-3.5" aria-hidden />}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-body-2-medium text-text-primary">{zone.city}</span>
                      {current && (
                        <span className="shrink-0 rounded-full bg-background-tertiary-default px-1.5 py-px text-caption-2-medium text-text-secondary">
                          Current
                        </span>
                      )}
                    </span>
                    <span className="truncate text-caption-2-regular text-text-tertiary">
                      {zone.country} · {zone.abbr}
                    </span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end" dir="ltr">
                    <span className="text-caption-1-medium text-text-secondary tabular-nums">
                      {formatOffset(zone.offset)}
                    </span>
                    <span className="text-caption-2-regular text-text-tertiary tabular-nums">
                      {zoneTime(zone.offset)}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="border-t border-separator-border px-3 py-1.5">
        <p className="text-caption-2-regular text-text-tertiary">
          Local times at 14:32 UTC · offsets shown for March 18.
        </p>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Specimens                                                                  */
/* -------------------------------------------------------------------------- */

export const TEMPORAL_SECTION: ExtendedSection = {
  id: "temporal",
  title: "Temporal",
  blurb: "Calendars, ranges and clocks that keep their promises.",
  file: "temporal.tsx",
  entries: [
    {
      name: "Calendar Grid",
      description: "A month view with event dots and a live day detail.",
      Demo: CalendarGrid,
    },
    {
      name: "Date Range Field",
      description: "Start and end dates, quick ranges and a computed nights count.",
      Demo: DateRangeField,
    },
    {
      name: "Relative Time",
      description: "Recent activity in human terms, with the exact stamp on hover.",
      Demo: RelativeTime,
    },
    {
      name: "Countdown Timer",
      description: "A launch countdown with progress and a pause control.",
      Demo: CountdownTimer,
    },
    {
      name: "Duration Field",
      description: "Segmented hh:mm:ss entry with quick presets and a minute total.",
      Demo: DurationField,
    },
    {
      name: "Timezone Picker",
      description: "Searchable zones with UTC offsets and a current marker.",
      Demo: TimezonePicker,
    },
  ],
};
