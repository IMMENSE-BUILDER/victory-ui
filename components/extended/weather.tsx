"use client";

import { useId, useRef, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import {
  RiAlertLine,
  RiArrowDownSLine,
  RiCalendarEventLine,
  RiCloudyLine,
  RiCloseLine,
  RiDrizzleLine,
  RiDropLine,
  RiMapPinLine,
  RiPauseLine,
  RiPlayLine,
  RiRadarLine,
  RiRainyLine,
  RiSearchLine,
  RiSnowyLine,
  RiStarFill,
  RiStarLine,
  RiSunCloudyLine,
  RiSunLine,
  RiThunderstormsLine,
  RiUmbrellaLine,
  RiWindyLine,
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
const card =
  "w-full max-w-[320px] rounded-xl border border-border-button-default bg-background-primary-default p-3 shadow-xs";
const muted = "text-caption-2-regular text-text-tertiary";
const chip = "inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-caption-2-medium";
const reveal =
  "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none";
const softButton =
  "inline-flex items-center justify-center gap-1 rounded-md border border-border-button-default bg-background-primary-default text-caption-2-semibold text-text-secondary shadow-xs " +
  "transition-[background-color,border-color,color] duration-150 ease-out hover:bg-background-primary-hover hover:text-text-primary " +
  "motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-40 " +
  focusRing;
const iconButton =
  "flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-icon-tertiary " +
  "transition-[background-color,color] duration-150 ease-out hover:bg-background-secondary-default hover:text-text-primary " +
  "motion-reduce:transition-none " +
  focusRing;

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
    <div
      role="group"
      aria-label={label}
      className={cx("flex shrink-0 rounded-lg bg-background-secondary-default p-0.5", className)}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cx(
              "h-6 flex-1 rounded-md px-1.5 text-caption-2-semibold whitespace-nowrap",
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

function Expand({ open, id, children }: { open: boolean; id: string; children: ReactNode }) {
  return (
    <div
      id={id}
      inert={!open}
      className={cx(reveal, open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

const fToC = (fahrenheit: number) => Math.round(((fahrenheit - 32) * 5) / 9);
const formatTemp = (fahrenheit: number, unit: "F" | "C") =>
  `${unit === "F" ? fahrenheit : fToC(fahrenheit)}°`;

/* -------------------------------------------------------------------------- */
/*  1. Current Conditions                                                      */
/* -------------------------------------------------------------------------- */

export function CurrentConditions() {
  const [unit, setUnit] = useState<"F" | "C">("F");

  return (
    <section
      aria-label="Current conditions in Seattle, Washington"
      className={cx(card, "relative overflow-hidden")}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -end-8 -top-10 size-28 rounded-full bg-accent-500/10 blur-xl"
      />

      <div className="relative flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1 text-caption-1-medium text-text-secondary">
          <RiMapPinLine aria-hidden className="size-3.5 shrink-0 text-foreground-icon-tertiary" />
          <span className="truncate">Seattle, WA</span>
        </span>
        <Segmented
          label="Temperature unit"
          value={unit}
          onChange={setUnit}
          options={[
            { value: "F", label: "°F" },
            { value: "C", label: "°C" },
          ]}
        />
      </div>

      <div className="relative mt-1 flex items-end justify-between gap-2">
        <div aria-live="polite" className="flex min-w-0 flex-col">
          <span
            key={unit}
            className="animate-number-fade text-display-3-medium text-text-primary tabular-nums motion-reduce:animate-none"
          >
            {formatTemp(54, unit)}
          </span>
          <span className="truncate text-caption-1-medium text-text-secondary">
            Light rain · feels like {formatTemp(51, unit)}
          </span>
        </div>
        <span className="mb-1 flex size-11 shrink-0 items-center justify-center rounded-full bg-accent-500/10 text-accent-600 ring-1 ring-accent-500/20">
          <RiRainyLine className="size-6" aria-hidden />
        </span>
      </div>

      <div className="relative mt-2 flex items-center gap-2 border-t border-separator-border pt-2 text-caption-2-regular text-text-tertiary">
        <span className="tabular-nums">H {formatTemp(56, unit)}</span>
        <span aria-hidden>·</span>
        <span className="tabular-nums">L {formatTemp(47, unit)}</span>
        <span className="ms-auto flex items-center gap-1 tabular-nums">
          <RiDropLine aria-hidden className="size-3" />
          82%
        </span>
        <span className="flex items-center gap-1 tabular-nums">
          <RiWindyLine aria-hidden className="size-3" />
          14 mph
        </span>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  2. Hourly Strip                                                            */
/* -------------------------------------------------------------------------- */

type Hour = {
  time: string;
  temp: number;
  chance: number;
  amount: string;
  wind: string;
  icon: IconComponent;
  tone: string;
};

const HOURLY: Hour[] = [
  { time: "3 PM", temp: 54, chance: 80, amount: "0.12", wind: "WSW 16", icon: RiRainyLine, tone: "text-accent-600" },
  { time: "4 PM", temp: 54, chance: 70, amount: "0.09", wind: "WSW 17", icon: RiRainyLine, tone: "text-accent-600" },
  { time: "5 PM", temp: 53, chance: 55, amount: "0.05", wind: "W 15", icon: RiDrizzleLine, tone: "text-accent-600" },
  { time: "6 PM", temp: 52, chance: 40, amount: "0.02", wind: "W 13", icon: RiDrizzleLine, tone: "text-accent-600" },
  { time: "7 PM", temp: 51, chance: 30, amount: "0.01", wind: "WNW 12", icon: RiCloudyLine, tone: "text-foreground-icon-secondary" },
  { time: "8 PM", temp: 50, chance: 20, amount: "—", wind: "WNW 10", icon: RiCloudyLine, tone: "text-foreground-icon-secondary" },
  { time: "9 PM", temp: 50, chance: 15, amount: "—", wind: "NW 9", icon: RiCloudyLine, tone: "text-foreground-icon-secondary" },
  { time: "10 PM", temp: 49, chance: 10, amount: "—", wind: "NW 8", icon: RiCloudyLine, tone: "text-foreground-icon-secondary" },
];

export function HourlyStrip() {
  const [selected, setSelected] = useState(0);
  const hour = HOURLY[selected];

  return (
    <section aria-label="Hourly forecast for Seattle" className={card}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Next 8 hours</h3>
        <span className={muted}>Easing through the evening</span>
      </div>

      <div role="group" aria-label="Choose an hour" dir="ltr" className="mt-1.5 flex gap-0.5">
        {HOURLY.map((item, index) => {
          const Icon = item.icon;
          const active = index === selected;
          return (
            <button
              key={item.time}
              type="button"
              aria-pressed={active}
              aria-label={`${item.time}, ${item.temp} degrees, ${item.chance} percent chance of rain`}
              onClick={() => setSelected(index)}
              className={cx(
                "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-md px-0.5 py-1",
                "transition-[background-color,color,transform] duration-150 ease-out motion-reduce:transition-none",
                active
                  ? "bg-background-secondary-default text-text-primary"
                  : "text-text-tertiary hover:bg-background-secondary-default/70 hover:text-text-secondary",
                focusRing,
              )}
            >
              <span className="text-caption-2-regular tabular-nums">{item.time}</span>
              <Icon
                aria-hidden
                className={cx(
                  "size-3.5 transition-transform duration-150 ease-out motion-reduce:transition-none",
                  active && "scale-110",
                  item.tone,
                )}
              />
              <span className="text-caption-1-semibold tabular-nums">{item.temp}°</span>
            </button>
          );
        })}
      </div>

      <p
        aria-live="polite"
        className="mt-1 flex items-center justify-between gap-2 rounded-md bg-background-secondary-default px-2 py-1 text-caption-2-regular text-text-secondary"
      >
        <span key={selected} className="animate-label-in truncate motion-reduce:animate-none">
          {hour.time} · {hour.chance}% chance · {hour.wind} mph
        </span>
        <span className="shrink-0 tabular-nums text-text-tertiary">
          {hour.amount === "—" ? "Dry" : `${hour.amount} in`}
        </span>
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  3. Seven Day                                                               */
/* -------------------------------------------------------------------------- */

type Day = {
  day: string;
  high: number;
  low: number;
  condition: string;
  chance: number;
  icon: IconComponent;
  tone: string;
};

const WEEK: Day[] = [
  { day: "Mon", high: 56, low: 47, condition: "Rain", chance: 80, icon: RiRainyLine, tone: "text-accent-600" },
  { day: "Tue", high: 58, low: 48, condition: "Cloudy", chance: 30, icon: RiCloudyLine, tone: "text-foreground-icon-secondary" },
  { day: "Wed", high: 61, low: 49, condition: "Partly cloudy", chance: 15, icon: RiSunCloudyLine, tone: "text-accent-600" },
  { day: "Thu", high: 63, low: 50, condition: "Sunny", chance: 5, icon: RiSunLine, tone: "text-status-orange-text" },
  { day: "Fri", high: 62, low: 50, condition: "Partly cloudy", chance: 20, icon: RiSunCloudyLine, tone: "text-accent-600" },
  { day: "Sat", high: 59, low: 49, condition: "Showers", chance: 55, icon: RiDrizzleLine, tone: "text-accent-600" },
  { day: "Sun", high: 57, low: 47, condition: "Rain", chance: 70, icon: RiRainyLine, tone: "text-accent-600" },
];

const WEEK_MIN = Math.min(...WEEK.map((item) => item.low));
const WEEK_MAX = Math.max(...WEEK.map((item) => item.high));
const WEEK_SPAN = WEEK_MAX - WEEK_MIN;

export function SevenDay() {
  const [selected, setSelected] = useState(0);
  const day = WEEK[selected];

  return (
    <section aria-label="Seven day forecast for Seattle" className={card}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">7-day forecast</h3>
        <span
          key={selected}
          aria-live="polite"
          className="animate-label-in truncate text-caption-2-regular text-text-tertiary motion-reduce:animate-none"
        >
          {day.day} · {day.condition} · {day.chance}%
        </span>
      </div>

      <ul className="mt-1">
        {WEEK.map((item, index) => {
          const Icon = item.icon;
          const active = index === selected;
          const offset = ((item.low - WEEK_MIN) / WEEK_SPAN) * 100;
          const width = ((item.high - item.low) / WEEK_SPAN) * 100;
          return (
            <li key={item.day}>
              <button
                type="button"
                aria-pressed={active}
                aria-label={`${item.day}, ${item.condition}, high ${item.high}, low ${item.low}, ${item.chance} percent chance of rain`}
                onClick={() => setSelected(index)}
                className={cx(
                  "flex h-5 w-full items-center gap-1.5 rounded-md px-1 text-caption-2-regular",
                  "transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
                  active
                    ? "bg-background-secondary-default text-text-primary"
                    : "text-text-secondary hover:bg-background-secondary-default/70",
                  focusRing,
                )}
              >
                <span className="w-7 shrink-0 text-start text-caption-2-semibold">{item.day}</span>
                <Icon aria-hidden className={cx("size-3 shrink-0", item.tone)} />
                <span className="w-6 shrink-0 text-end tabular-nums text-text-tertiary">{item.low}°</span>
                <span
                  aria-hidden
                  className="relative h-1 flex-1 overflow-hidden rounded-full bg-background-quaternary-default"
                >
                  <span
                    className={cx(
                      "absolute inset-y-0 rounded-full bg-chart-4 transition-[background-color] duration-150 ease-out motion-reduce:transition-none",
                      active && "bg-accent-500",
                    )}
                    style={{ left: `${offset}%`, width: `${width}%` }}
                  />
                </span>
                <span className="w-6 shrink-0 text-end tabular-nums text-text-primary">{item.high}°</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  4. Air Quality                                                             */
/* -------------------------------------------------------------------------- */

type Pollutant = {
  id: string;
  label: string;
  value: number;
  unit: string;
  note: string;
};

const POLLUTANTS: Pollutant[] = [
  { id: "pm25", label: "PM2.5", value: 34, unit: "µg/m³", note: "Fine particles" },
  { id: "o3", label: "O₃", value: 21, unit: "ppb", note: "Ground ozone" },
  { id: "no2", label: "NO₂", value: 12, unit: "ppb", note: "Nitrogen dioxide" },
];

const AQI_MAX = 100;

export function AirQuality() {
  const [pollutant, setPollutant] = useState("pm25");
  const item = POLLUTANTS.find((option) => option.id === pollutant) ?? POLLUTANTS[0];
  const fill = Math.min(item.value, AQI_MAX);

  return (
    <section aria-label="Air quality in Seattle" className={card}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-body-2-semibold text-text-primary">Air quality</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">Seattle · overall AQI 34</p>
        </div>
        <span className={cx(chip, "bg-status-lime-background text-status-lime-text")}>Good</span>
      </div>

      <div className="mt-1 flex items-center gap-3">
        <div className="relative w-[108px] shrink-0">
          <svg
            viewBox="0 0 108 62"
            className="h-auto w-full"
            role="img"
            aria-label={`${item.label} sub-index ${item.value}, ${item.note.toLowerCase()}`}
          >
            <path
              d="M 12 54 A 42 42 0 0 1 96 54"
              fill="none"
              stroke="currentColor"
              strokeWidth={8}
              strokeLinecap="round"
              pathLength={100}
              className="text-background-quaternary-default"
            />
            <path
              d="M 12 54 A 42 42 0 0 1 96 54"
              fill="none"
              stroke="currentColor"
              strokeWidth={8}
              strokeLinecap="round"
              pathLength={100}
              style={{ strokeDasharray: `${fill} 100` }}
              className="text-status-lime-text transition-[stroke-dasharray] duration-200 ease-out motion-reduce:transition-none"
            />
          </svg>
          <div aria-hidden className="absolute inset-x-0 bottom-0 flex flex-col items-center">
            <span
              key={item.id}
              className="animate-number-fade text-title-2-medium text-text-primary tabular-nums motion-reduce:animate-none"
            >
              {item.value}
            </span>
            <span className="text-caption-2-regular text-text-tertiary">AQI sub-index</span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-1-semibold text-text-primary">{item.note}</p>
          <p className="truncate text-caption-2-regular text-text-secondary tabular-nums">
            {item.value} {item.unit}
          </p>
          <p className="mt-1 truncate text-caption-2-regular text-text-tertiary">
            Dominant · PM2.5
          </p>
        </div>
      </div>

      <div role="group" aria-label="Pollutant sub-index" className="mt-1 flex gap-1">
        {POLLUTANTS.map((option) => {
          const active = option.id === pollutant;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => setPollutant(option.id)}
              className={cx(
                "h-6 flex-1 rounded-md text-caption-2-semibold",
                "transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                active
                  ? "bg-background-secondary-default text-text-primary shadow-xs"
                  : "text-text-tertiary hover:bg-background-secondary-default/70 hover:text-text-secondary",
                focusRing,
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  5. Sunrise Card                                                            */
/* -------------------------------------------------------------------------- */

const SUN_STOPS = [
  { id: "rise", label: "Rise", time: "6:42 AM", detail: "First light 6:14 AM", t: 0 },
  { id: "noon", label: "Noon", time: "11:59 AM", detail: "Peak elevation 27°", t: 0.5 },
  { id: "set", label: "Set", time: "5:18 PM", detail: "Last light 5:46 PM", t: 1 },
] as const;

type SunStopId = (typeof SUN_STOPS)[number]["id"];

export function SunriseCard() {
  const [stopId, setStopId] = useState<SunStopId>("rise");
  const stop = SUN_STOPS.find((option) => option.id === stopId) ?? SUN_STOPS[0];
  const angle = stop.t * Math.PI;
  const x = 100 - 56 * Math.cos(angle);
  const y = 64 - 56 * Math.sin(angle);

  return (
    <section
      aria-label="Sunrise and sunset in Seattle. Sunrise 6:42 AM, sunset 5:18 PM, 10 hours 36 minutes of daylight."
      className={card}
    >
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Sun &amp; daylight</h3>
        <span className="text-caption-2-regular text-text-tertiary tabular-nums">10h 36m</span>
      </div>

      <div className="relative mt-1 h-[58px] w-full">
        <svg
          viewBox="0 0 200 74"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full"
          aria-hidden
        >
          <line
            x1="8"
            y1="64"
            x2="192"
            y2="64"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            className="text-border-button-default"
          />
          <path
            d="M 44 64 A 56 56 0 0 1 156 64 L 44 64 Z"
            fill="currentColor"
            className="text-accent-500/10"
          />
          <path
            d="M 44 64 A 56 56 0 0 1 156 64"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="3 4"
            vectorEffect="non-scaling-stroke"
            className="text-accent-500/60"
          />
        </svg>
        <span
          aria-hidden
          className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-status-yellow-background ring-2 ring-status-yellow-text/60 transition-[left,top] duration-200 ease-out motion-reduce:transition-none"
          style={{ left: `${(x / 200) * 100}%`, top: `${(y / 74) * 100}%` }}
        />
      </div>

      <Segmented
        label="Sun position"
        value={stopId}
        onChange={setStopId}
        options={SUN_STOPS.map((option) => ({ value: option.id, label: option.label }))}
        className="mt-1 w-full"
      />

      <div className="mt-1 flex items-center justify-between gap-2 border-t border-separator-border pt-1.5">
        <span aria-live="polite" key={stop.id} className="animate-label-in text-caption-2-semibold text-text-primary motion-reduce:animate-none">
          {stop.label} {stop.time}
        </span>
        <span className="truncate text-caption-2-regular text-text-tertiary">{stop.detail}</span>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  6. Precipitation Chart                                                     */
/* -------------------------------------------------------------------------- */

const PRECIP = [
  { time: "3 PM", chance: 80, amount: "0.12" },
  { time: "4 PM", chance: 70, amount: "0.09" },
  { time: "5 PM", chance: 55, amount: "0.05" },
  { time: "6 PM", chance: 40, amount: "0.02" },
  { time: "7 PM", chance: 30, amount: "0.01" },
  { time: "8 PM", chance: 20, amount: "—" },
  { time: "9 PM", chance: 15, amount: "—" },
  { time: "10 PM", chance: 10, amount: "—" },
];

export function PrecipitationChart() {
  const [selected, setSelected] = useState(0);
  const hour = PRECIP[selected];

  return (
    <section aria-label="Chance of rain by hour in Seattle" className={card}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="flex items-center gap-1 text-body-2-semibold text-text-primary">
          <RiUmbrellaLine aria-hidden className="size-3.5 text-foreground-icon-tertiary" />
          Chance of rain
        </h3>
        <span className="text-caption-2-regular text-text-tertiary tabular-nums">Peak 80%</span>
      </div>

      <div dir="ltr" className="mt-1.5">
        <div role="group" aria-label="Chance of rain by hour" className="flex h-10 items-end gap-1">
          {PRECIP.map((item, index) => {
            const active = index === selected;
            return (
              <button
                key={item.time}
                type="button"
                aria-pressed={active}
                aria-label={`${item.time}, ${item.chance} percent chance of rain, ${item.amount} inches expected`}
                onClick={() => setSelected(index)}
                className={cx(
                  "group flex h-full flex-1 items-end justify-center rounded-sm",
                  focusRing,
                )}
              >
                <span
                  className={cx(
                    "animate-bar-rise w-full max-w-5 rounded-t-sm transition-[background-color,box-shadow] duration-150 ease-out motion-reduce:animate-none motion-reduce:transition-none",
                    active
                      ? "bg-accent-500 shadow-xs"
                      : "bg-chart-4/60 group-hover:bg-chart-4",
                  )}
                  style={{ height: `${item.chance}%`, animationDelay: `${index * 35}ms` }}
                />
              </button>
            );
          })}
        </div>

        <div className="mt-1 flex gap-1 text-caption-2-regular" aria-hidden>
          {PRECIP.map((item, index) => (
            <span
              key={item.time}
              className={cx(
                "flex-1 text-center tabular-nums",
                index === selected ? "text-text-primary" : "text-text-tertiary",
              )}
            >
              {item.time.replace(" ", "")}
            </span>
          ))}
        </div>
      </div>

      <p
        aria-live="polite"
        className="mt-1 flex items-center justify-between gap-2 border-t border-separator-border pt-1.5 text-caption-2-regular text-text-secondary"
      >
        <span key={selected} className="animate-label-in truncate motion-reduce:animate-none">
          {hour.time} · {hour.chance}% chance
        </span>
        <span className="shrink-0 tabular-nums text-text-tertiary">
          {hour.amount === "—" ? "Dry" : `${hour.amount} in expected`}
        </span>
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  7. Wind Compass                                                            */
/* -------------------------------------------------------------------------- */

const WIND_SNAPSHOTS = [
  { id: "now", label: "Now", speed: 14, gust: 26, dir: "WSW", deg: 248 },
  { id: "four", label: "4 PM", speed: 17, gust: 31, dir: "W", deg: 270 },
  { id: "five", label: "5 PM", speed: 21, gust: 38, dir: "WNW", deg: 292 },
] as const;

type WindId = (typeof WIND_SNAPSHOTS)[number]["id"];

export function WindCompass() {
  const [snapshot, setSnapshot] = useState<WindId>("now");
  const wind = WIND_SNAPSHOTS.find((option) => option.id === snapshot) ?? WIND_SNAPSHOTS[0];

  return (
    <section aria-label="Wind in Seattle" className={card}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Wind</h3>
        <span className="text-caption-2-regular text-text-tertiary">Updated 3:40 PM</span>
      </div>

      <div className="mt-1 flex items-center gap-3">
        <div
          dir="ltr"
          role="img"
          aria-label={`Wind from ${wind.dir} at ${wind.speed} miles per hour, gusting ${wind.gust}`}
          className="relative size-[88px] shrink-0 overflow-hidden rounded-full border border-border-button-default bg-background-secondary-default"
        >
          <span aria-hidden className="absolute inset-1.5 rounded-full border border-separator-border" />
          <span aria-hidden className="absolute inset-x-3 top-1/2 h-px -translate-y-1/2 bg-separator-border" />
          <span aria-hidden className="absolute inset-y-3 left-1/2 w-px -translate-x-1/2 bg-separator-border" />
          <span aria-hidden className="absolute left-1/2 top-0.5 -translate-x-1/2 text-caption-2-medium text-text-tertiary">N</span>
          <span aria-hidden className="absolute right-1 top-1/2 -translate-y-1/2 text-caption-2-medium text-text-tertiary">E</span>
          <span aria-hidden className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-caption-2-medium text-text-tertiary">S</span>
          <span aria-hidden className="absolute left-1 top-1/2 -translate-y-1/2 text-caption-2-medium text-text-tertiary">W</span>
          <div
            aria-hidden
            className="absolute inset-0 transition-transform duration-200 ease-out motion-reduce:transition-none"
            style={{ transform: `rotate(${wind.deg}deg)` }}
          >
            <svg viewBox="0 0 24 24" className="absolute inset-0 size-full">
              <path d="M12 4.5 15.2 17 12 15.1 8.8 17Z" className="fill-accent-500" />
            </svg>
          </div>
          <span aria-hidden className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground-icon-primary" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1">
            <span className="text-title-2-medium text-text-primary tabular-nums">{wind.speed}</span>
            <span className="text-caption-1-medium text-text-secondary">mph</span>
            <span className={cx(chip, "ms-auto bg-background-secondary-default text-text-secondary")}>
              From {wind.dir}
            </span>
          </div>
          <p className="mt-0.5 truncate text-caption-2-regular text-text-tertiary tabular-nums">
            Gusts {wind.gust} mph
          </p>
          <Segmented
            label="Wind snapshot"
            value={snapshot}
            onChange={setSnapshot}
            options={WIND_SNAPSHOTS.map((option) => ({ value: option.id, label: option.label }))}
            className="mt-1.5 w-full"
          />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  8. Alert Banner                                                            */
/* -------------------------------------------------------------------------- */

export function AlertBanner() {
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <section
      aria-label="Weather alert"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          close();
        }
      }}
      className="relative w-full max-w-[320px] overflow-hidden rounded-xl border border-border-button-default bg-background-primary-default shadow-xs"
    >
      <span aria-hidden className="absolute inset-y-0 start-0 w-0.5 bg-status-orange-text" />
      <div className="flex items-start gap-2 p-2.5">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-status-orange-background text-status-orange-text">
          <RiAlertLine className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-1.5 text-body-2-semibold text-text-primary">
            Wind Advisory
            <span className={cx(chip, "bg-status-orange-background text-status-orange-text")}>Moderate</span>
          </p>
          <p className="truncate text-caption-2-regular text-text-tertiary">
            Northwest Interior · until 7:00 PM
          </p>
        </div>
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? "Hide alert details" : "Show alert details"}
          onClick={() => setOpen((current) => !current)}
          className={cx(iconButton, "-me-1 -mt-1")}
        >
          <RiArrowDownSLine
            aria-hidden
            className={cx(
              "size-4 transition-transform duration-200 ease-out motion-reduce:transition-none",
              open && "rotate-180",
            )}
          />
        </button>
      </div>

      <Expand open={open} id={panelId}>
        <div className="border-t border-separator-border px-2.5 py-2">
          <ul className="flex flex-col gap-1 text-caption-2-regular text-text-secondary">
            <li className="flex gap-1.5">
              <span aria-hidden className="mt-1 size-1 shrink-0 rounded-full bg-status-orange-text" />
              Gusts to 40 mph through 7 PM, strongest near the water.
            </li>
            <li className="flex gap-1.5">
              <span aria-hidden className="mt-1 size-1 shrink-0 rounded-full bg-status-orange-text" />
              Secure bins, patio furniture and anything loose on balconies.
            </li>
            <li className="flex gap-1.5">
              <span aria-hidden className="mt-1 size-1 shrink-0 rounded-full bg-status-orange-text" />
              High-profile vehicles should use caution on the SR 520 bridge.
            </li>
          </ul>
          <p className="mt-1.5 text-caption-2-regular text-text-tertiary tabular-nums">
            Issued 2:15 PM · Expires 7:00 PM
          </p>
        </div>
      </Expand>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  9. Radar Card                                                              */
/* -------------------------------------------------------------------------- */

const RADAR_BLIPS = [
  { left: "27%", top: "35%", tone: "bg-chart-2" },
  { left: "63%", top: "43%", tone: "bg-status-yellow-text" },
  { left: "47%", top: "68%", tone: "bg-status-rose-text" },
];

const RADAR_LEGEND = [
  { label: "Light", tone: "bg-chart-2" },
  { label: "Moderate", tone: "bg-status-yellow-text" },
  { label: "Heavy", tone: "bg-status-rose-text" },
];

export function RadarCard() {
  const [playing, setPlaying] = useState(true);

  return (
    <section aria-label="Weather radar for Puget Sound" className={card}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 text-body-2-semibold text-text-primary">
          <RiRadarLine aria-hidden className="size-4 text-accent-600" />
          Radar
          <span className="text-caption-2-regular text-text-tertiary">12 mi</span>
        </h3>
        <button
          type="button"
          aria-label={playing ? "Pause radar sweep" : "Resume radar sweep"}
          onClick={() => setPlaying((current) => !current)}
          className={cx(softButton, "h-6 px-2")}
        >
          {playing ? <RiPauseLine className="size-3" aria-hidden /> : <RiPlayLine className="size-3" aria-hidden />}
          {playing ? "Live" : "Paused"}
        </button>
      </div>

      <div className="mt-1.5 flex items-center gap-3">
        <div
          dir="ltr"
          role="img"
          aria-label="Radar sweep over Puget Sound showing light rain northwest, moderate rain east and heavy cells south."
          className="relative size-24 shrink-0 overflow-hidden rounded-full border border-border-button-default bg-background-secondary-default"
        >
          <span aria-hidden className="absolute inset-[16%] rounded-full border border-separator-border" />
          <span aria-hidden className="absolute inset-[33%] rounded-full border border-separator-border" />
          <span aria-hidden className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-separator-border" />
          <span aria-hidden className="absolute inset-y-2 left-1/2 w-px -translate-x-1/2 bg-separator-border" />

          <div
            aria-hidden
            className="absolute inset-0 animate-spin motion-reduce:animate-none"
            style={{ animationDuration: "5s", animationPlayState: playing ? "running" : "paused" }}
          >
            <span className="absolute left-1/2 top-0 h-1/2 w-px -translate-x-1/2 bg-chart-1/80" />
            <span className="absolute left-1/2 top-0 h-1/2 w-8 -translate-x-full bg-linear-to-l from-chart-1/40 to-transparent" />
          </div>

          {RADAR_BLIPS.map((blip) => (
            <span
              key={`${blip.left}-${blip.top}`}
              aria-hidden
              className={cx("absolute size-1.5 rounded-full ring-2 ring-background-primary-default", blip.tone)}
              style={{ left: blip.left, top: blip.top }}
            />
          ))}
          <span aria-hidden className="absolute left-1/2 top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-500" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-caption-1-semibold text-text-primary">Puget Sound</p>
          <ul className="mt-1 flex flex-col gap-0.5">
            {RADAR_LEGEND.map((item) => (
              <li key={item.label} className="flex items-center gap-1.5 text-caption-2-regular text-text-secondary">
                <span aria-hidden className={cx("size-1.5 shrink-0 rounded-full", item.tone)} />
                {item.label}
              </li>
            ))}
          </ul>
          <p className="mt-1 text-caption-2-regular text-text-tertiary tabular-nums">Frame 3:42 PM</p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  10. Moon Phase                                                             */
/* -------------------------------------------------------------------------- */

const MOON_NIGHTS = [
  { id: "tonight", label: "Tonight", phase: "Waxing gibbous", illum: 78, shift: 9, note: "Rises 3:12 PM · Sets 2:48 AM" },
  { id: "nov21", label: "Nov 21", phase: "Waxing gibbous", illum: 92, shift: 4, note: "Rises 3:56 PM · Sets 3:18 AM" },
  { id: "full", label: "Nov 24", phase: "Full moon", illum: 100, shift: 0, note: "Rises 4:28 PM · Sets 6:12 AM" },
] as const;

type MoonId = (typeof MOON_NIGHTS)[number]["id"];

export function MoonPhase() {
  const [nightId, setNightId] = useState<MoonId>("tonight");
  const night = MOON_NIGHTS.find((option) => option.id === nightId) ?? MOON_NIGHTS[0];

  return (
    <section aria-label="Moon phase for Seattle" className={card}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Moon</h3>
        <span className="text-caption-2-regular text-text-tertiary tabular-nums">
          {night.illum}% illuminated
        </span>
      </div>

      <div className="mt-1.5 flex items-center gap-3">
        <div
          role="img"
          aria-label={`${night.phase}, ${night.illum} percent illuminated`}
          className="relative size-16 shrink-0 overflow-hidden rounded-full bg-background-quaternary-default ring-1 ring-border-button-default"
        >
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-linear-to-br from-accent-100 to-accent-200 transition-transform duration-200 ease-out motion-reduce:transition-none"
            style={{ transform: `translateX(${night.shift}px)` }}
          >
            <span className="absolute left-[38%] top-[30%] size-2 rounded-full bg-accent-300/40" />
            <span className="absolute left-[58%] top-[52%] size-1.5 rounded-full bg-accent-300/35" />
            <span className="absolute left-[30%] top-[62%] size-1 rounded-full bg-accent-300/30" />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p aria-live="polite" className="text-title-3-semibold text-text-primary">
            {night.phase}
          </p>
          <div
            role="progressbar"
            aria-label="Illumination"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={night.illum}
            className="mt-1 h-1 overflow-hidden rounded-full bg-background-quaternary-default"
          >
            <div
              className="h-full rounded-full bg-accent-500 transition-[width] duration-200 ease-out motion-reduce:transition-none"
              style={{ width: `${night.illum}%` }}
            />
          </div>
          <p className="mt-1 truncate text-caption-2-regular text-text-tertiary tabular-nums">
            {night.note}
          </p>
        </div>
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2 border-t border-separator-border pt-1.5">
        <span className="flex items-center gap-1 text-caption-2-regular text-text-tertiary">
          <RiCalendarEventLine aria-hidden className="size-3" />
          Next full moon · Nov 24
        </span>
        <Segmented
          label="Moon night"
          value={nightId}
          onChange={setNightId}
          options={MOON_NIGHTS.map((option) => ({ value: option.id, label: option.label }))}
        />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  11. UV Meter                                                               */
/* -------------------------------------------------------------------------- */

const UV_BANDS = [
  {
    max: 2,
    name: "Low",
    bar: "bg-status-lime-text",
    text: "text-status-lime-text",
    advice: "No protection needed. Wear sunglasses on bright days.",
  },
  {
    max: 5,
    name: "Moderate",
    bar: "bg-status-yellow-text",
    text: "text-status-yellow-text",
    advice: "Cover up and use SPF 30 around midday. Seek shade near noon.",
  },
  {
    max: 7,
    name: "High",
    bar: "bg-status-orange-text",
    text: "text-status-orange-text",
    advice: "SPF 30+, a hat and shade between 10 AM and 4 PM.",
  },
  {
    max: 10,
    name: "Very high",
    bar: "bg-status-rose-text",
    text: "text-status-rose-text",
    advice: "Avoid direct sun from 10 AM to 4 PM. Use SPF 50 and cover up.",
  },
  {
    max: 11,
    name: "Extreme",
    bar: "bg-accent-500",
    text: "text-accent-600",
    advice: "Stay indoors. Unprotected skin can burn in minutes.",
  },
];

const UV_STEPS = Array.from({ length: 12 }, (_, index) => index);
const uvBand = (value: number) => UV_BANDS.find((band) => value <= band.max) ?? UV_BANDS[UV_BANDS.length - 1];

export function UVMeter() {
  const [uv, setUv] = useState(4);
  const band = uvBand(uv);

  return (
    <section aria-label="UV index in Seattle" className={card}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="flex items-center gap-1 text-body-2-semibold text-text-primary">
          <RiSunLine aria-hidden className="size-3.5 text-status-orange-text" />
          UV index
        </h3>
        <span className="text-caption-2-regular text-text-tertiary">Seattle · 3:00 PM</span>
      </div>

      <div className="mt-1 flex items-baseline gap-2">
        <span
          key={uv}
          className="animate-number-fade text-title-1-medium text-text-primary tabular-nums motion-reduce:animate-none"
        >
          {uv}
        </span>
        <span className={cx("text-caption-1-semibold", band.text)}>{band.name}</span>
        <span className="ms-auto text-caption-2-regular text-text-tertiary">0–11+</span>
      </div>

      <div role="group" aria-label="Set the UV index" dir="ltr" className="mt-1 flex gap-0.5">
        {UV_STEPS.map((step) => {
          const stepBand = uvBand(step);
          const active = step === uv;
          return (
            <button
              key={step}
              type="button"
              aria-pressed={active}
              aria-label={`UV ${step}, ${stepBand.name}`}
              onClick={() => setUv(step)}
              className={cx(
                "h-6 flex-1 rounded-sm",
                "transition-[opacity,box-shadow,transform] duration-150 ease-out motion-reduce:transition-none",
                stepBand.bar,
                active
                  ? "opacity-100 shadow-xs -translate-y-0.5"
                  : "opacity-40 hover:opacity-70",
                focusRing,
              )}
            />
          );
        })}
      </div>

      <p
        key={uv}
        aria-live="polite"
        className="mt-1.5 min-h-8 animate-label-in text-caption-2-regular text-text-secondary motion-reduce:animate-none"
      >
        {band.advice}
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  12. Location Search                                                        */
/* -------------------------------------------------------------------------- */

const CITIES = [
  { id: "seattle", name: "Seattle", region: "WA", temp: 54, condition: "Light rain", icon: RiRainyLine, tone: "text-accent-600" },
  { id: "portland", name: "Portland", region: "OR", temp: 57, condition: "Cloudy", icon: RiCloudyLine, tone: "text-foreground-icon-secondary" },
  { id: "san-francisco", name: "San Francisco", region: "CA", temp: 63, condition: "Partly cloudy", icon: RiSunCloudyLine, tone: "text-accent-600" },
  { id: "austin", name: "Austin", region: "TX", temp: 78, condition: "Sunny", icon: RiSunLine, tone: "text-status-orange-text" },
  { id: "denver", name: "Denver", region: "CO", temp: 46, condition: "Snow showers", icon: RiSnowyLine, tone: "text-accent-600" },
  { id: "new-york", name: "New York", region: "NY", temp: 52, condition: "Windy", icon: RiWindyLine, tone: "text-foreground-icon-secondary" },
  { id: "miami", name: "Miami", region: "FL", temp: 81, condition: "Thunderstorms", icon: RiThunderstormsLine, tone: "text-status-orange-text" },
];

type City = (typeof CITIES)[number];

const CITY_LIMIT = 3;

function CityRow({
  city,
  active,
  saved,
  onSelect,
  onSave,
}: {
  city: City;
  active: boolean;
  saved: boolean;
  onSelect: () => void;
  onSave: () => void;
}) {
  const Icon = city.icon;

  return (
    <li className="animate-label-in motion-reduce:animate-none">
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-pressed={active}
          onClick={onSelect}
          className={cx(
            "flex min-w-0 flex-1 items-center gap-2 rounded-md px-1.5 py-0.5 text-start",
            "transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
            active
              ? "bg-background-secondary-default text-text-primary"
              : "text-text-secondary hover:bg-background-secondary-default/70",
            focusRing,
          )}
        >
          <Icon aria-hidden className={cx("size-3.5 shrink-0", city.tone)} />
          <span className="min-w-0 flex-1 truncate text-caption-1-medium">
            {city.name}
            <span className="text-text-tertiary">, {city.region}</span>
          </span>
          <span className="shrink-0 text-caption-1-semibold tabular-nums">{city.temp}°</span>
        </button>
        <button
          type="button"
          aria-pressed={saved}
          aria-label={saved ? `Remove ${city.name} from saved cities` : `Save ${city.name}`}
          onClick={onSave}
          className={cx(
            iconButton,
            "size-6",
            saved && "text-status-yellow-text",
          )}
        >
          {saved ? (
            <RiStarFill className="size-3.5" aria-hidden />
          ) : (
            <RiStarLine className="size-3.5" aria-hidden />
          )}
        </button>
      </div>
    </li>
  );
}

export function LocationSearch() {
  const listId = useId();
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<string[]>(["seattle", "portland"]);
  const [active, setActive] = useState("seattle");
  const [notice, setNotice] = useState<string | null>(null);

  const trimmed = query.trim().toLowerCase();
  const visible = trimmed
    ? CITIES.filter((city) => `${city.name} ${city.region}`.toLowerCase().includes(trimmed)).slice(0, 3)
    : CITIES.filter((city) => saved.includes(city.id));
  const activeCity = CITIES.find((city) => city.id === active) ?? CITIES[0];

  const toggleSaved = (city: City) => {
    if (saved.includes(city.id)) {
      setSaved((current) => current.filter((id) => id !== city.id));
      setNotice(`${city.name} removed from saved cities.`);
      return;
    }
    if (saved.length >= CITY_LIMIT) {
      setNotice(`Saved cities are full. Remove one to add ${city.name}.`);
      return;
    }
    setSaved((current) => [...current, city.id]);
    setNotice(`${city.name} saved.`);
  };

  return (
    <section
      aria-label="Weather location search"
      onKeyDown={(event) => {
        if (event.key === "Escape" && query) {
          event.stopPropagation();
          setQuery("");
          setNotice(null);
        }
      }}
      className={card}
    >
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Weather locations</h3>
        <span className="text-caption-2-regular text-text-tertiary tabular-nums">
          {saved.length} saved
        </span>
      </div>

      <div className="mt-1.5 flex h-8 items-center gap-1.5 rounded-lg bg-background-secondary-default ps-2 pe-1 focus-within:ring-2 focus-within:ring-border-focus-ring">
        <RiSearchLine aria-hidden className="size-3.5 shrink-0 text-foreground-icon-tertiary" />
        <input
          type="search"
          value={query}
          autoComplete="off"
          aria-label="Search cities"
          aria-controls={listId}
          placeholder="Search a city"
          onChange={(event) => {
            setQuery(event.target.value);
            setNotice(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && visible[0]) {
              event.preventDefault();
              setActive(visible[0].id);
              setNotice(`${visible[0].name} selected.`);
            }
          }}
          className="min-w-0 flex-1 bg-transparent p-0 text-body-2-regular text-text-primary outline-none placeholder:text-text-tertiary [&::-webkit-search-cancel-button]:appearance-none"
        />
        {query ? (
          <button
            type="button"
            aria-label="Clear city search"
            onClick={() => {
              setQuery("");
              setNotice(null);
            }}
            className={iconButton}
          >
            <RiCloseLine className="size-3.5" aria-hidden />
          </button>
        ) : null}
      </div>

      <ul id={listId} key={trimmed || "saved"} className="mt-1" aria-label={trimmed ? "City search results" : "Saved cities"}>
        {visible.length === 0 ? (
          <li className="flex h-[72px] items-center justify-center rounded-lg border border-dashed border-border-button-default px-2 text-center text-caption-2-regular text-text-tertiary">
            {trimmed
              ? `No cities match “${query.trim()}”. Try Seattle, Denver or Miami.`
              : "No saved cities yet. Search above to add one."}
          </li>
        ) : (
          visible.map((city) => {
            const isSaved = saved.includes(city.id);
            return (
              <CityRow
                key={city.id}
                city={city}
                active={city.id === active}
                saved={isSaved}
                onSelect={() => {
                  setActive(city.id);
                  setNotice(`${city.name} · ${city.condition} · ${city.temp}°`);
                }}
                onSave={() => toggleSaved(city)}
              />
            );
          })
        )}
      </ul>

      <p
        aria-live="polite"
        className="mt-1 flex items-center gap-1 truncate border-t border-separator-border pt-1.5 text-caption-2-regular text-text-tertiary"
      >
        <RiMapPinLine aria-hidden className="size-3 shrink-0" />
        <span className="truncate">{notice ?? `${activeCity.name} · ${activeCity.condition} · ${activeCity.temp}°`}</span>
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Specimens                                                                  */
/* -------------------------------------------------------------------------- */

export const WEATHER_SECTION: ExtendedSection = {
  id: "weather",
  title: "Weather",
  blurb: "Forecasts, alerts and the sky right now.",
  file: "weather.tsx",
  entries: [
    { name: "Current Conditions", description: "54° and light rain, with a Fahrenheit-to-Celsius switch.", Demo: CurrentConditions },
    { name: "Hourly Strip", description: "Eight hours on one strip; pick an hour for rain and wind.", Demo: HourlyStrip },
    { name: "Seven Day", description: "Daily highs and lows drawn against the week's range.", Demo: SevenDay },
    { name: "Air Quality", description: "A gauge for PM2.5, ozone and nitrogen dioxide.", Demo: AirQuality },
    { name: "Sunrise Card", description: "The sun's arc with rise, noon and set over Seattle.", Demo: SunriseCard },
    { name: "Precipitation Chart", description: "Chance-of-rain bars with the expected amount per hour.", Demo: PrecipitationChart },
    { name: "Wind Compass", description: "A compass needle that turns as the wind shifts.", Demo: WindCompass },
    { name: "Alert Banner", description: "A wind advisory that opens to the full details.", Demo: AlertBanner },
    { name: "Radar Card", description: "A live radar sweep with a rain-intensity legend.", Demo: RadarCard },
    { name: "Moon Phase", description: "Waxing gibbous tonight; a full moon on Nov 24.", Demo: MoonPhase },
    { name: "UV Meter", description: "Set any index from 0 to 11 and read the advice.", Demo: UVMeter },
    { name: "Location Search", description: "Search seven cities and keep three saved.", Demo: LocationSearch },
  ],
};
