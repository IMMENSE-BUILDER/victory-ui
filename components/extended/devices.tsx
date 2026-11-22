"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import {
  RiAddLine, RiAlarmLine, RiArrowDownLine, RiArrowRightLine, RiArrowUpLine, RiCalendarEventLine,
  RiCameraLine, RiCheckDoubleLine, RiCheckLine, RiCloseLine, RiDoorLockLine, RiDownloadLine,
  RiFilmLine, RiFireLine, RiFlashlightLine, RiHome4Line, RiLightbulbLine, RiLoader4Line,
  RiLockLine, RiMoonLine, RiPlayLine, RiRefreshLine, RiRouterLine, RiShieldCheckLine,
  RiSnowflakeLine, RiSpeakerLine, RiSparklingLine, RiSubtractLine, RiSunLine, RiTempColdLine,
  RiTempHotLine, RiThermometerLine, RiVolumeMuteLine, RiVolumeUpLine, RiWalkLine, RiWaterPercentLine,
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
  "w-full max-w-[320px] rounded-xl border border-border-button-default bg-background-primary-default p-2.5 shadow-xs";
const meta = "text-caption-2-regular text-text-tertiary";
const chip = "inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-caption-2-medium";
const iconTile =
  "flex size-7 shrink-0 items-center justify-center rounded-lg bg-background-tertiary-default text-foreground-icon-secondary";
const softButton =
  "inline-flex items-center justify-center gap-1 rounded-md border border-border-button-default bg-background-primary-default text-caption-2-semibold text-text-secondary shadow-xs " +
  "transition-[background-color,border-color,color] duration-150 ease-out hover:bg-background-primary-hover hover:text-text-primary " +
  "motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-40 " +
  focusRing;
const iconButton =
  "flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-icon-tertiary " +
  "transition-[background-color,color] duration-150 ease-out hover:bg-background-secondary-default hover:text-text-primary " +
  "motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-40 " +
  focusRing;
const primaryButton =
  "inline-flex h-7 items-center justify-center gap-1 rounded-md bg-button-primary px-2 text-caption-2-semibold text-text-white shadow-xs " +
  "transition-[opacity,transform] duration-150 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 " +
  "motion-reduce:transition-none motion-reduce:active:scale-100 " +
  focusRing;

function Toggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cx(
        "flex h-5 w-9 shrink-0 items-center rounded-full p-0.5",
        "transition-[background-color] duration-150 ease-out motion-reduce:transition-none",
        checked ? "bg-accent-600" : "bg-background-quaternary-default",
        focusRing,
      )}
    >
      <span
        aria-hidden
        className={cx(
          "size-4 rounded-full bg-control-indicator-background shadow-xs",
          "transition-[transform] duration-150 ease-out motion-reduce:transition-none",
          checked ? "translate-x-4 rtl:-translate-x-4" : "translate-x-0",
        )}
      />
    </button>
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
    <div
      role="group"
      aria-label={label}
      className={cx("flex shrink-0 rounded-md bg-background-secondary-default p-0.5", className)}
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

function SignalBars({ level, className }: { level: number; className?: string }) {
  return (
    <span aria-hidden className={cx("flex h-3 items-end gap-0.5", className)}>
      {[1, 2, 3, 4].map((bar) => (
        <span
          key={bar}
          className={cx(
            "w-0.5 rounded-full transition-[background-color] duration-150 ease-out motion-reduce:transition-none",
            bar <= level
              ? level <= 2
                ? "bg-status-orange-text"
                : "bg-status-lime-text"
              : "bg-background-quaternary-default",
          )}
          style={{ height: `${bar * 25}%` }}
        />
      ))}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  1. Device Card                                                             */
/* -------------------------------------------------------------------------- */

export function DeviceCard() {
  const [on, setOn] = useState(true);

  return (
    <section aria-label="Living room floor lamp" className={cx(card, "relative overflow-hidden")}>
      <span
        aria-hidden
        className={cx(
          "pointer-events-none absolute -end-6 -top-8 size-24 rounded-full bg-accent-500/10 blur-xl",
          "transition-opacity duration-200 ease-out motion-reduce:transition-none",
          on ? "opacity-100" : "opacity-0",
        )}
      />

      <div className="relative flex items-start gap-2">
        <span
          className={cx(
            iconTile,
            "transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
            on ? "bg-accent-100 text-accent-700" : "text-foreground-icon-tertiary",
          )}
        >
          <RiLightbulbLine className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Floor lamp</h3>
          <p className={cx(meta, "truncate")}>Living room · Standing lamp</p>
        </div>
        <Toggle checked={on} label="Power for the living room floor lamp" onChange={setOn} />
      </div>

      <div className="relative mt-2 flex items-center justify-between gap-2 rounded-lg bg-background-secondary-default px-2 py-1.5">
        <div className="min-w-0">
          <p className={meta}>Power</p>
          <p
            aria-live="polite"
            className={cx(
              "truncate text-body-2-semibold transition-colors duration-150 ease-out motion-reduce:transition-none",
              on ? "text-text-primary" : "text-text-tertiary",
            )}
          >
            {on ? "On · 62% brightness" : "Off since 7:04 AM"}
          </p>
        </div>
        <span className={cx(chip, "bg-status-lime-background text-status-lime-text")}>
          <span className="size-1.5 rounded-full bg-status-lime-text" aria-hidden />
          Online
        </span>
      </div>

      <p className={cx(meta, "relative mt-1.5 flex items-center gap-1")}>
        <RiFlashlightLine className="size-3" aria-hidden />
        1.2 kWh this week · responds in 40 ms
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  2. Sensor Reading                                                          */
/* -------------------------------------------------------------------------- */

const SENSOR_MODES = {
  temperature: {
    full: "Temperature", value: "21.4", unit: "°C", change: "+0.8°",
    icon: RiTempColdLine, trendIcon: RiArrowUpLine,
    series: [18.9, 19.1, 19.6, 20.2, 20.8, 21.4, 21.9, 22.1, 21.7, 21.2, 20.9, 21.4],
  },
  humidity: {
    full: "Relative humidity", value: "47", unit: "%", change: "+5%",
    icon: RiWaterPercentLine, trendIcon: RiArrowUpLine,
    series: [44, 43, 45, 46, 48, 47, 45, 44, 46, 49, 50, 47],
  },
} as const;

type SensorMode = keyof typeof SENSOR_MODES;

export function SensorReading() {
  const [mode, setMode] = useState<SensorMode>("temperature");
  const reading = SENSOR_MODES[mode];
  const TrendIcon = reading.trendIcon;
  const low = Math.min(...reading.series);
  const high = Math.max(...reading.series);
  const range = high - low || 1;

  return (
    <section aria-label="Bedroom climate sensor" className={cx(card, "flex flex-col")}>
      <div className="flex items-center gap-2">
        <span className={iconTile}>
          <RiTempColdLine className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Bedroom sensor</h3>
          <p className={cx(meta, "truncate")}>Second floor · 88% battery</p>
        </div>
        <Segmented
          label="Sensor reading"
          value={mode}
          options={[
            { value: "temperature", label: "Temp" },
            { value: "humidity", label: "Humidity" },
          ]}
          onChange={setMode}
        />
      </div>

      <div className="mt-1.5 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <div aria-live="polite" className="flex items-baseline gap-0.5">
            <span
              key={mode}
              className="animate-number-fade text-title-1-semibold text-text-primary tabular-nums motion-reduce:animate-none"
            >
              {reading.value}
            </span>
            <span className="text-body-2-semibold text-text-tertiary">{reading.unit}</span>
          </div>
          <p className={cx(meta, "truncate")}>{reading.full}</p>
        </div>
        <span className={cx(chip, "mb-1 bg-background-secondary-default text-text-secondary")}>
          <TrendIcon className="size-3 text-status-lime-text" aria-hidden />
          {reading.change}
        </span>
      </div>

      <div aria-hidden className="mt-1.5 flex h-9 items-end gap-0.5">
        {reading.series.map((value, index) => (
          <span
            key={`${mode}-${index}`}
            className={cx(
              "flex-1 rounded-sm transition-[height,background-color] duration-200 ease-out motion-reduce:transition-none",
              index === reading.series.length - 1 ? "bg-accent-500" : "bg-accent-500/25",
            )}
            style={{ height: `${12 + ((value - low) / range) * 88}%` }}
          />
        ))}
      </div>
      <p className="sr-only">
        {reading.full} ranged from {low} to {high} {reading.unit} over the last twelve hours.
      </p>

      <div className={cx("mt-1.5 flex items-center justify-between gap-2 border-t border-separator-border pt-1.5", meta)}>
        <span className="truncate">
          Low {low.toFixed(1)}
          {reading.unit} · High {high.toFixed(1)}
          {reading.unit}
        </span>
        <span className="shrink-0">5 min ago</span>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  3. Automation Rule                                                         */
/* -------------------------------------------------------------------------- */

export function AutomationRule() {
  const [enabled, setEnabled] = useState(true);

  return (
    <section aria-label="Evening entry automation" className={cx(card, "relative overflow-hidden")}>
      <span
        aria-hidden
        className={cx(
          "absolute inset-y-2 start-0 w-0.5 rounded-full bg-accent-500",
          "transition-opacity duration-200 ease-out motion-reduce:transition-none",
          enabled ? "opacity-100" : "opacity-0",
        )}
      />

      <div className="flex items-start gap-2">
        <span
          className={cx(
            iconTile,
            "transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
            enabled ? "bg-accent-100 text-accent-700" : "text-foreground-icon-tertiary",
          )}
        >
          <RiSparklingLine className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Evening entry</h3>
          <p className={cx(meta, "truncate")}>Sunset · 5:48 PM today</p>
        </div>
        <Toggle checked={enabled} label="Enable the Evening entry automation" onChange={setEnabled} />
      </div>

      <div
        className={cx(
          "mt-2 flex flex-col gap-1 transition-opacity duration-200 ease-out motion-reduce:transition-none",
          enabled ? "opacity-100" : "opacity-40",
        )}
      >
        <div className="flex items-center gap-1.5 rounded-md bg-background-secondary-default px-1.5 py-1">
          <span className="w-8 shrink-0 text-caption-2-semibold tracking-wide text-text-tertiary uppercase">If</span>
          <RiWalkLine className="size-3.5 shrink-0 text-foreground-icon-secondary" aria-hidden />
          <span className="min-w-0 flex-1 truncate text-caption-1-medium text-text-primary">Hallway motion</span>
          <span className={cx(meta, "shrink-0")}>after sunset</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-md bg-background-secondary-default px-1.5 py-1">
          <span className="w-8 shrink-0 text-caption-2-semibold tracking-wide text-text-tertiary uppercase">Then</span>
          <RiLightbulbLine className="size-3.5 shrink-0 text-foreground-icon-secondary" aria-hidden />
          <span className="min-w-0 flex-1 truncate text-caption-1-medium text-text-primary">Porch light</span>
          <span className={cx(meta, "shrink-0")}>at 40%</span>
        </div>
      </div>

      <p aria-live="polite" className={cx(meta, "mt-1.5 flex items-center gap-1 border-t border-separator-border pt-1.5")}>
        <RiShieldCheckLine className="size-3" aria-hidden />
        <span className="truncate">
          {enabled ? "Ran 18 times this week · last at 7:42 PM" : "Paused since Monday · no runs"}
        </span>
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  4. Energy Chart                                                            */
/* -------------------------------------------------------------------------- */

const ENERGY_WEEKS = [
  {
    id: "this", label: "This week", comparison: { text: "+5% vs last week", up: true },
    days: [
      { day: "Mon", kwh: 5.2 }, { day: "Tue", kwh: 6.8 }, { day: "Wed", kwh: 4.4 }, { day: "Thu", kwh: 7.1 },
      { day: "Fri", kwh: 5.6 }, { day: "Sat", kwh: 8.2 }, { day: "Sun", kwh: 6.1 },
    ],
  },
  {
    id: "last", label: "Last week", comparison: { text: "3% less than prior", up: false },
    days: [
      { day: "Mon", kwh: 4.8 }, { day: "Tue", kwh: 5.9 }, { day: "Wed", kwh: 6.2 }, { day: "Thu", kwh: 5.1 },
      { day: "Fri", kwh: 7.4 }, { day: "Sat", kwh: 6.8 }, { day: "Sun", kwh: 5.0 },
    ],
  },
] as const;

const energyFormat = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const moneyFormat = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const KWH_RATE = 0.17;

export function EnergyChart() {
  const [weekId, setWeekId] = useState<"this" | "last">("this");
  const [dayIndex, setDayIndex] = useState(6);
  const week = ENERGY_WEEKS.find((item) => item.id === weekId) ?? ENERGY_WEEKS[0];
  const total = week.days.reduce((sum, item) => sum + item.kwh, 0);
  const max = Math.max(...week.days.map((item) => item.kwh));
  const selected = week.days[dayIndex];
  const share = Math.round((selected.kwh / total) * 100);
  const CompareIcon = week.comparison.up ? RiArrowUpLine : RiArrowDownLine;

  return (
    <section aria-label="Home electricity use" className={cx(card, "flex flex-col")}>
      <div className="flex items-center gap-2">
        <span className={iconTile}>
          <RiFlashlightLine className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Energy use</h3>
          <p className={cx(meta, "truncate")}>All circuits · 7 days</p>
        </div>
        <Segmented
          label="Energy week"
          value={weekId}
          options={[
            { value: "this", label: "This" },
            { value: "last", label: "Last" },
          ]}
          onChange={setWeekId}
        />
      </div>

      <div className="mt-1.5 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="flex items-baseline gap-1">
            <span
              key={`${weekId}-${total}`}
              className="animate-number-fade text-title-2-semibold text-text-primary tabular-nums motion-reduce:animate-none"
            >
              {energyFormat.format(total)}
            </span>
            <span className="text-caption-1-medium text-text-tertiary">kWh</span>
          </p>
          <p className={cx(meta, "truncate")}>{moneyFormat.format(total * KWH_RATE)} at $0.17/kWh</p>
        </div>
        <span
          className={cx(
            chip,
            "mb-1",
            week.comparison.up
              ? "bg-status-orange-background text-status-orange-text"
              : "bg-status-lime-background text-status-lime-text",
          )}
        >
          <CompareIcon className="size-3 rtl:-scale-x-100" aria-hidden />
          {week.comparison.text}
        </span>
      </div>

      <div role="group" aria-label="Daily electricity use" className="mt-1.5 flex items-end gap-1">
        {week.days.map((item, index) => {
          const active = index === dayIndex;
          return (
            <button
              key={item.day}
              type="button"
              aria-pressed={active}
              aria-label={`${item.day}: ${energyFormat.format(item.kwh)} kilowatt hours`}
              onClick={() => setDayIndex(index)}
              className={cx("group flex min-w-0 flex-1 flex-col items-center gap-1 rounded-md", focusRing)}
            >
              <span className="flex h-10 w-full items-end justify-center">
                <span
                  className={cx(
                    "w-full max-w-5 rounded-sm transition-[height,background-color] duration-200 ease-out motion-reduce:transition-none",
                    active ? "bg-accent-500" : "bg-accent-500/25 group-hover:bg-accent-500/40",
                  )}
                  style={{ height: `${Math.max(10, (item.kwh / max) * 100)}%` }}
                />
              </span>
              <span
                className={cx(
                  "text-caption-2-medium transition-colors duration-150 ease-out motion-reduce:transition-none",
                  active ? "text-text-primary" : "text-text-tertiary",
                )}
              >
                {item.day}
              </span>
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className={cx(meta, "mt-1.5 truncate border-t border-separator-border pt-1.5")}>
        {selected.day} · {energyFormat.format(selected.kwh)} kWh · {share}% of the week
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  5. Camera Tile                                                             */
/* -------------------------------------------------------------------------- */

export function CameraTile() {
  const [live, setLive] = useState(false);
  const [muted, setMuted] = useState(true);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasLive = useRef(false);

  useEffect(() => {
    if (live) {
      wasLive.current = true;
      closeRef.current?.focus();
      const onKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") setLive(false);
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
    if (wasLive.current) {
      wasLive.current = false;
      triggerRef.current?.focus();
    }
  }, [live]);

  return (
    <section aria-label="Front porch camera" className={card}>
      <div className="flex items-center gap-2">
        <span className={iconTile}>
          <RiCameraLine className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Front porch</h3>
          <p className={cx(meta, "truncate")}>Camera · 1080p · Night vision</p>
        </div>
        <button
          type="button"
          aria-label="Mute camera audio"
          aria-pressed={muted}
          disabled={!live}
          onClick={() => setMuted((value) => !value)}
          className={cx(iconButton, "disabled:opacity-40")}
        >
          {muted ? <RiVolumeMuteLine className="size-3.5" aria-hidden /> : <RiVolumeUpLine className="size-3.5" aria-hidden />}
        </button>
      </div>

      <div className="relative mt-2 h-[104px] overflow-hidden rounded-lg border border-separator-border bg-background-secondary-default">
        <div
          aria-hidden
          className={cx(
            "absolute inset-0 transition-opacity duration-200 ease-out motion-reduce:transition-none",
            live ? "opacity-100" : "opacity-0",
          )}
        >
          <span className="absolute inset-x-0 top-0 h-2/5 bg-status-blue-background/60" />
          <span className="absolute inset-x-0 top-2/5 h-3/5 bg-background-secondary-hover" />
          <span className="absolute bottom-0 start-4 h-11 w-12 rounded-t-md border border-border-button-default bg-background-tertiary-default" />
          <span className="absolute start-4 top-[62%] size-1 rounded-full bg-foreground-icon-tertiary" />
          <span className="absolute bottom-0 end-0 h-4 w-16 bg-background-quaternary-default/70" />
          <span className="absolute bottom-2 end-4 size-7 rounded-full bg-status-lime-background" />
          <span className="absolute bottom-1 end-7 size-5 rounded-full bg-status-lime-background/80" />
          <span className="absolute end-9 top-3 size-3 rounded-full bg-status-yellow-background" />
          <span className="absolute inset-y-0 start-10 w-px bg-background-primary-default/20" />
          <span className="absolute inset-y-0 end-16 w-px bg-background-primary-default/20" />
        </div>

        <div
          inert={live}
          className={cx(
            "absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 bg-background-primary-default px-2 text-center",
            "transition-opacity duration-200 ease-out motion-reduce:transition-none",
            live ? "pointer-events-none opacity-0" : "opacity-100",
          )}
        >
          <span className="flex size-6 items-center justify-center rounded-full bg-background-tertiary-default text-foreground-icon-secondary">
            <RiLockLine className="size-3.5" aria-hidden />
          </span>
          <p className="text-caption-1-semibold text-text-primary">Privacy shutter on</p>
          <p className={cx(meta, "truncate")}>Nothing is recording.</p>
          <button ref={triggerRef} type="button" onClick={() => setLive(true)} className={cx(softButton, "h-6 px-2")}>
            <RiPlayLine className="size-3" aria-hidden />
            View live
          </button>
        </div>

        <div
          inert={!live}
          className={cx(
            "absolute inset-0 z-20 transition-opacity duration-200 ease-out motion-reduce:transition-none",
            live ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <span className="absolute start-2 top-2 flex items-center gap-1 rounded-full bg-background-primary-default/90 px-1.5 py-0.5 text-caption-2-semibold text-text-primary">
            <span className="size-1.5 animate-pulse rounded-full bg-status-rose-text motion-reduce:animate-none" aria-hidden />
            Live
          </span>
          <span className="absolute bottom-2 start-2 rounded-sm bg-background-primary-default/90 px-1 py-0.5 text-caption-2-medium text-text-secondary tabular-nums">
            7:42 PM
          </span>
          <button ref={closeRef} type="button" aria-label="Close live view" onClick={() => setLive(false)} className={cx(iconButton, "absolute end-1.5 top-1.5")}>
            <RiCloseLine className="size-3.5" aria-hidden />
          </button>
        </div>
      </div>

      <p className={cx(meta, "mt-1.5 flex items-center gap-1")}>
        <RiShieldCheckLine className="size-3 shrink-0" aria-hidden />
        <span className="truncate">Encrypted on this hub · 14-day history</span>
      </p>
      <span className="sr-only" aria-live="polite">
        {live ? "Live view open. Press Escape to close." : "Live view closed. The privacy shutter is on."}
      </span>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  6. Thermostat                                                              */
/* -------------------------------------------------------------------------- */

const DIAL_RADIUS = 38;
const DIAL_CIRCUMFERENCE = 2 * Math.PI * DIAL_RADIUS;
const MIN_TEMP = 16;
const MAX_TEMP = 28;

export function Thermostat() {
  const [target, setTarget] = useState(21.5);
  const [mode, setMode] = useState<"heat" | "cool">("heat");
  const progress = (target - MIN_TEMP) / (MAX_TEMP - MIN_TEMP);

  const adjust = (delta: number) =>
    setTarget((value) => Math.min(MAX_TEMP, Math.max(MIN_TEMP, Math.round((value + delta) * 2) / 2)));

  return (
    <section aria-label="Living room thermostat" className={cx(card, "flex items-center gap-3")}>
      <div className="relative size-24 shrink-0">
        <svg viewBox="0 0 96 96" className="size-full -rotate-90" aria-hidden>
          <circle cx="48" cy="48" r={DIAL_RADIUS} fill="none" strokeWidth="7" className="stroke-background-tertiary-default" />
          <circle
            cx="48"
            cy="48"
            r={DIAL_RADIUS}
            fill="none"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={DIAL_CIRCUMFERENCE}
            strokeDashoffset={DIAL_CIRCUMFERENCE * (1 - progress)}
            className={cx(
              "transition-[stroke-dashoffset,stroke] duration-200 ease-out motion-reduce:transition-none",
              mode === "heat" ? "stroke-accent-500" : "stroke-chart-4",
            )}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            key={target}
            className="animate-number-fade text-title-2-semibold text-text-primary tabular-nums motion-reduce:animate-none"
          >
            {target.toFixed(1)}°
          </span>
          <span className={cx(meta, "flex items-center gap-0.5")}>
            {mode === "heat" ? <RiFireLine className="size-3" aria-hidden /> : <RiSnowflakeLine className="size-3" aria-hidden />}
            Target
          </span>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-body-2-semibold text-text-primary">Living room</h3>
        <p className={cx(meta, "truncate")}>Now 20.1° · 46% humidity</p>

        <Segmented
          label="Thermostat mode"
          value={mode}
          options={[
            { value: "heat", label: "Heat" },
            { value: "cool", label: "Cool" },
          ]}
          onChange={setMode}
          className="mt-1.5 w-full"
        />

        <div className="mt-1.5 flex items-center gap-1">
          <button
            type="button"
            aria-label="Decrease target temperature"
            disabled={target <= MIN_TEMP}
            onClick={() => adjust(-0.5)}
            className={cx(softButton, "size-7 p-0")}
          >
            <RiSubtractLine className="size-3.5" aria-hidden />
          </button>
          <span className={cx(meta, "text-center tabular-nums")}>0.5°</span>
          <button
            type="button"
            aria-label="Increase target temperature"
            disabled={target >= MAX_TEMP}
            onClick={() => adjust(0.5)}
            className={cx(softButton, "size-7 p-0")}
          >
            <RiAddLine className="size-3.5" aria-hidden />
          </button>
          <span className={cx(meta, "ms-auto shrink-0")}>Eco</span>
        </div>

        <p aria-live="polite" className={cx(meta, "mt-1 truncate")}>
          {mode === "heat" ? "Heating" : "Cooling"} to {target.toFixed(1)}° · 18 min
        </p>
        <span className="sr-only" aria-live="polite">
          Target temperature {target.toFixed(1)} degrees
        </span>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  7. Scene Picker                                                            */
/* -------------------------------------------------------------------------- */

const SCENES = [
  { id: "morning", label: "Morning", detail: "6 lights on · blinds open", icon: RiSunLine },
  { id: "away", label: "Away", detail: "Lights off · locks armed", icon: RiLockLine },
  { id: "movie", label: "Movie", detail: "4 lights at 15% · blinds closed", icon: RiFilmLine },
  { id: "night", label: "Night", detail: "3 lights at 20% · doors locked", icon: RiMoonLine },
] as const;

type SceneId = (typeof SCENES)[number]["id"];

export function ScenePicker() {
  const [activeId, setActiveId] = useState<SceneId>("movie");
  const active = SCENES.find((scene) => scene.id === activeId) ?? SCENES[2];
  const ActiveIcon = active.icon;

  return (
    <section aria-label="Living room scenes" className={card}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Scenes</h3>
        <span className={meta}>Living room · 4 scenes</span>
      </div>

      <div role="group" aria-label="Choose a scene" className="mt-1.5 grid grid-cols-2 gap-1.5">
        {SCENES.map((scene) => {
          const Icon = scene.icon;
          const selected = scene.id === activeId;
          return (
            <button
              key={scene.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setActiveId(scene.id)}
              className={cx(
                "flex h-10 items-center gap-1.5 rounded-lg border px-2 text-start",
                "transition-[background-color,border-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                selected
                  ? "border-accent-500 bg-background-secondary-default shadow-xs"
                  : "border-border-button-default bg-background-primary-default hover:bg-background-primary-hover",
                focusRing,
              )}
            >
              <Icon
                className={cx(
                  "size-4 shrink-0 transition-colors duration-150 ease-out motion-reduce:transition-none",
                  selected ? "text-accent-600" : "text-foreground-icon-secondary",
                )}
                aria-hidden
              />
              <span className="min-w-0 flex-1 truncate text-caption-1-semibold text-text-primary">{scene.label}</span>
              <RiCheckLine
                className={cx(
                  "size-3 shrink-0 text-accent-600 transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none",
                  selected ? "scale-100 opacity-100" : "scale-50 opacity-0",
                )}
                aria-hidden
              />
            </button>
          );
        })}
      </div>

      <div className="mt-1.5 flex items-center gap-2 rounded-lg bg-background-secondary-default px-2 py-1.5">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-primary-default text-accent-600 shadow-xs">
          <ActiveIcon className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p aria-live="polite" className="truncate text-caption-1-semibold text-text-primary">
            {active.label} is active
          </p>
          <p className={cx(meta, "truncate")}>{active.detail}</p>
        </div>
        <span className={cx(chip, "bg-status-lime-background text-status-lime-text")}>Local</span>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  8. Alert Log                                                               */
/* -------------------------------------------------------------------------- */

const ALERTS = [
  {
    id: "porch", kind: "Motion", room: "Front porch", detail: "Person detected at the steps",
    time: "6:42 AM", icon: RiWalkLine, tone: "bg-status-rose-background text-status-rose-text",
  },
  {
    id: "kitchen", kind: "Climate", room: "Kitchen", detail: "Temperature reached 27.8°C",
    time: "5:16 AM", icon: RiTempHotLine, tone: "bg-status-orange-background text-status-orange-text",
  },
  {
    id: "hall", kind: "Motion", room: "Hallway", detail: "Motion cleared after 40 seconds",
    time: "11:08 PM", icon: RiWalkLine, tone: "bg-status-rose-background text-status-rose-text",
  },
] as const;

type AlertFilter = "all" | "motion" | "climate";

export function AlertLog() {
  const [filter, setFilter] = useState<AlertFilter>("all");
  const [read, setRead] = useState<Record<string, boolean>>({ hall: true });
  const unread = ALERTS.filter((alert) => !read[alert.id]).length;
  const visible = ALERTS.filter((alert) => filter === "all" || alert.kind.toLowerCase() === filter);

  return (
    <section aria-label="Home alert log" className={cx(card, "flex flex-col")}>
      <div className="flex items-center gap-2">
        <span className={iconTile}>
          <RiAlarmLine className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">Alerts</h3>
          <p className={cx(meta, "truncate")}>Past 24 hours · 3 rooms</p>
        </div>
        <span
          className={cx(
            chip,
            "transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
            unread ? "bg-accent-100 text-accent-700" : "bg-status-lime-background text-status-lime-text",
          )}
        >
          {unread ? `${unread} new` : "All read"}
        </span>
        <button
          type="button"
          aria-label="Mark all alerts as read"
          disabled={unread === 0}
          onClick={() => setRead(Object.fromEntries(ALERTS.map((alert) => [alert.id, true])))}
          className={iconButton}
        >
          <RiCheckDoubleLine className="size-3.5" aria-hidden />
        </button>
      </div>

      <div className="mt-1.5">
        <Segmented
          label="Filter alerts"
          value={filter}
          options={[
            { value: "all", label: "All" },
            { value: "motion", label: "Motion" },
            { value: "climate", label: "Climate" },
          ]}
          onChange={setFilter}
          className="w-full"
        />
      </div>

      <ul aria-live="polite" className="mt-1 flex flex-col">
        {visible.map((alert) => {
          const Icon = alert.icon;
          const isUnread = !read[alert.id];
          return (
            <li key={alert.id}>
              <button
                type="button"
                aria-label={`${isUnread ? "Unread" : "Read"} ${alert.kind} alert: ${alert.detail}, ${alert.room}, ${alert.time}`}
                onClick={() => setRead((current) => ({ ...current, [alert.id]: true }))}
                className={cx(
                  "flex w-full items-center gap-1.5 rounded-md px-1 py-1 text-start",
                  "transition-[background-color,opacity] duration-150 ease-out motion-reduce:transition-none",
                  isUnread ? "hover:bg-background-secondary-default" : "opacity-60",
                  focusRing,
                )}
              >
                <span className={cx("flex size-6 shrink-0 items-center justify-center rounded-md", alert.tone)}>
                  <Icon className="size-3" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-1">
                    <span className="truncate text-caption-1-semibold text-text-primary">{alert.kind}</span>
                    <span className={cx(meta, "truncate")}>· {alert.room}</span>
                    <span className="ms-auto shrink-0 text-caption-2-medium text-text-tertiary tabular-nums">{alert.time}</span>
                  </span>
                  <span className={cx(meta, "block truncate")}>{alert.detail}</span>
                </span>
                <span
                  aria-hidden
                  className={cx(
                    "size-1.5 shrink-0 rounded-full bg-accent-500 transition-opacity duration-200 ease-out motion-reduce:transition-none",
                    isUnread ? "opacity-100" : "opacity-0",
                  )}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  9. Network Map                                                             */
/* -------------------------------------------------------------------------- */

const NETWORK_DEVICES = [
  {
    id: "lock", label: "Front lock", room: "Entry", signal: 4, band: "Thread", ping: "18 ms",
    icon: RiDoorLockLine, position: "left-0 top-0", x: 32, y: 16,
  },
  {
    id: "cam", label: "Porch cam", room: "Porch", signal: 2, band: "2.4 GHz", ping: "64 ms",
    icon: RiCameraLine, position: "right-0 top-0", x: 248, y: 16,
  },
  {
    id: "thermo", label: "Thermostat", room: "Hallway", signal: 3, band: "Thread", ping: "24 ms",
    icon: RiThermometerLine, position: "left-0 bottom-0", x: 32, y: 80,
  },
  {
    id: "speaker", label: "Speaker", room: "Kitchen", signal: 4, band: "5 GHz", ping: "9 ms",
    icon: RiSpeakerLine, position: "right-0 bottom-0", x: 248, y: 80,
  },
] as const;

type NetworkDevice = (typeof NETWORK_DEVICES)[number];
type NetworkId = NetworkDevice["id"];

function strengthLabel(level: number) {
  if (level >= 4) return "Excellent";
  if (level === 3) return "Good";
  if (level === 2) return "Fair";
  return "Weak";
}

export function NetworkMap() {
  const [selectedId, setSelectedId] = useState<NetworkId>("lock");
  const active = NETWORK_DEVICES.find((device) => device.id === selectedId) ?? NETWORK_DEVICES[0];

  return (
    <section aria-label="Home network map" className={cx(card, "flex flex-col")}>
      <div className="flex items-center gap-2">
        <span className={iconTile}>
          <RiRouterLine className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Home mesh</h3>
          <p className={cx(meta, "truncate")}>12 devices · 1 weak signal</p>
        </div>
        <span className={cx(chip, "bg-status-lime-background text-status-lime-text")}>
          <span className="size-1.5 rounded-full bg-status-lime-text" aria-hidden />
          Online
        </span>
      </div>

      <div dir="ltr" className="relative mt-1.5 h-24 rounded-lg bg-background-secondary-default/60">
        <svg viewBox="0 0 280 96" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
          {NETWORK_DEVICES.map((device) => (
            <line
              key={device.id}
              x1="140"
              y1="48"
              x2={device.x}
              y2={device.y}
              strokeWidth="1"
              strokeDasharray={device.signal <= 2 ? "2 3" : undefined}
              className={cx(
                "transition-[stroke] duration-200 ease-out motion-reduce:transition-none",
                selectedId === device.id ? "stroke-accent-500" : "stroke-border-button-default",
              )}
            />
          ))}
        </svg>

        <span className="absolute left-1/2 top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border-button-default bg-background-primary-default text-foreground-icon-secondary shadow-xs">
          <RiRouterLine className="size-4" aria-hidden />
          <span aria-hidden className="absolute -top-0.5 -right-0.5 size-2 rounded-full border-2 border-background-primary-default bg-status-lime-text" />
        </span>

        {NETWORK_DEVICES.map((device) => {
          const Icon = device.icon;
          const selected = device.id === selectedId;
          return (
            <button
              key={device.id}
              type="button"
              aria-pressed={selected}
              aria-label={`${device.label}, ${device.room}, ${strengthLabel(device.signal)} signal, ${device.band}, ${device.ping}`}
              onClick={() => setSelectedId(device.id)}
              className={cx("absolute flex w-16 flex-col items-center gap-0.5 rounded-lg p-0.5", device.position, focusRing)}
            >
              <span
                className={cx(
                  "relative flex size-7 items-center justify-center rounded-full border bg-background-primary-default shadow-xs",
                  "transition-[border-color,box-shadow,color] duration-150 ease-out motion-reduce:transition-none",
                  selected
                    ? "border-accent-500 text-accent-600 ring-1 ring-accent-500/30"
                    : "border-border-button-default text-foreground-icon-secondary",
                )}
              >
                <Icon className="size-3.5" aria-hidden />
                <span
                  aria-hidden
                  className={cx(
                    "absolute -top-0.5 -right-0.5 size-1.5 rounded-full ring-2 ring-background-primary-default",
                    device.signal <= 2 ? "bg-status-orange-text" : "bg-status-lime-text",
                  )}
                />
              </span>
              <span
                className={cx(
                  "w-full truncate text-center text-caption-2-medium transition-colors duration-150 ease-out motion-reduce:transition-none",
                  selected ? "text-text-primary" : "text-text-tertiary",
                )}
              >
                {device.label}
              </span>
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className={cx(meta, "mt-1.5 flex items-center gap-1.5 border-t border-separator-border pt-1.5")}>
        <span className="min-w-0 flex-1 truncate">
          <span className="text-text-primary">{active.label}</span> · {active.room} · {active.band} · {active.ping}
        </span>
        <SignalBars level={active.signal} />
        <span className={cx("shrink-0", active.signal <= 2 ? "text-status-orange-text" : "text-status-lime-text")}>
          {strengthLabel(active.signal)}
        </span>
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  10. Firmware Update                                                        */
/* -------------------------------------------------------------------------- */

type UpdateStatus = "idle" | "installing" | "done";

export function FirmwareUpdate() {
  const [status, setStatus] = useState<UpdateStatus>("idle");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (status !== "installing") return;
    if (progress >= 100) {
      setStatus("done");
      return;
    }
    const timer = window.setTimeout(() => {
      setProgress((value) => Math.min(100, value + 10));
    }, 160);
    return () => window.clearTimeout(timer);
  }, [progress, status]);

  const install = () => {
    setProgress(0);
    setStatus("installing");
  };

  return (
    <section aria-label="Front door lock firmware" className={card}>
      <div className="flex items-center gap-2">
        <span className={iconTile}>
          <RiDownloadLine className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Front door lock</h3>
          <p className={cx(meta, "truncate")}>Connected via Thread · 88% battery</p>
        </div>
        <span
          className={cx(
            chip,
            "transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
            status === "done"
              ? "bg-status-lime-background text-status-lime-text"
              : status === "installing"
                ? "bg-background-tertiary-default text-text-secondary"
                : "bg-accent-100 text-accent-700",
          )}
        >
          {status === "done" ? "Up to date" : status === "installing" ? "Installing" : "Update ready"}
        </span>
      </div>

      <div className="mt-1.5 flex items-center gap-2 rounded-lg bg-background-secondary-default px-2 py-1.5">
        <div className="min-w-0 flex-1">
          <p className={meta}>Installed</p>
          <p dir="ltr" className="text-start text-caption-1-semibold text-text-secondary tabular-nums">2.4.1</p>
        </div>
        <RiArrowRightLine className="size-3.5 shrink-0 text-foreground-icon-tertiary rtl:-scale-x-100" aria-hidden />
        <div className="min-w-0 flex-1 text-end">
          <p className={meta}>Available</p>
          <p dir="ltr" className="text-end text-caption-1-semibold text-text-primary tabular-nums">2.6.0</p>
        </div>
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span className={cx(meta, "truncate")}>
          {status === "idle"
            ? "3.8 MB · Adds Matter pairing"
            : status === "installing"
              ? "Installing 2.6.0 · keep nearby"
              : "Restart not needed · release notes sent"}
        </span>
        <span className="shrink-0 text-caption-2-semibold text-text-secondary tabular-nums">
          {status === "idle" ? "3.8 MB" : status === "done" ? "Done" : `${progress}%`}
        </span>
      </div>

      <div
        role="progressbar"
        aria-label="Firmware install progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        className="mt-1 h-1.5 overflow-hidden rounded-full bg-background-tertiary-default"
      >
        <div
          className={cx(
            "h-full rounded-full transition-[width,background-color] duration-200 ease-out motion-reduce:transition-none",
            status === "done" ? "bg-status-lime-text" : "bg-accent-500",
          )}
          style={{ width: `${progress}%` }}
        />
      </div>

      <button
        type="button"
        onClick={install}
        disabled={status === "installing"}
        className={cx(primaryButton, "mt-2 w-full")}
      >
        {status === "installing" ? (
          <>
            <RiLoader4Line className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
            Installing {progress}%
          </>
        ) : status === "done" ? (
          <>
            <RiRefreshLine className="size-3.5" aria-hidden />
            Install again
          </>
        ) : (
          <>
            <RiDownloadLine className="size-3.5" aria-hidden />
            Install update
          </>
        )}
      </button>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  11. Schedule                                                               */
/* -------------------------------------------------------------------------- */

type WeekDay = {
  day: string;
  initial: string;
  on: number;
  off: number;
  enabled: boolean;
};

const WEEK: WeekDay[] = [
  { day: "Monday", initial: "M", on: 390, off: 1365, enabled: true },
  { day: "Tuesday", initial: "T", on: 390, off: 1365, enabled: true },
  { day: "Wednesday", initial: "W", on: 390, off: 1365, enabled: true },
  { day: "Thursday", initial: "T", on: 390, off: 1425, enabled: true },
  { day: "Friday", initial: "F", on: 390, off: 1425, enabled: true },
  { day: "Saturday", initial: "S", on: 480, off: 1410, enabled: false },
  { day: "Sunday", initial: "S", on: 480, off: 1350, enabled: true },
];

function formatTime(minutes: number) {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12;
  return `${hour}:${String(mins).padStart(2, "0")} ${period}`;
}

function TimeControl({
  label,
  value,
  disabled,
  onChange,
}: {
  label: "On" | "Off";
  value: number;
  disabled: boolean;
  onChange: (delta: number) => void;
}) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-1 rounded-md bg-background-primary-default px-1 py-0.5 shadow-xs">
      <span className="shrink-0 text-caption-2-medium text-text-tertiary">{label}</span>
      <span
        key={value}
        className="min-w-0 flex-1 animate-number-fade text-center text-caption-1-semibold text-text-primary tabular-nums motion-reduce:animate-none"
      >
        {formatTime(value)}
      </span>
      <button
        type="button"
        aria-label={`Move ${label === "On" ? "start" : "end"} 30 minutes earlier`}
        disabled={disabled}
        onClick={() => onChange(-30)}
        className={cx("flex size-5 shrink-0 items-center justify-center rounded-sm text-foreground-icon-tertiary", focusRing)}
      >
        <RiSubtractLine className="size-3" aria-hidden />
      </button>
      <button
        type="button"
        aria-label={`Move ${label === "On" ? "start" : "end"} 30 minutes later`}
        disabled={disabled}
        onClick={() => onChange(30)}
        className={cx("flex size-5 shrink-0 items-center justify-center rounded-sm text-foreground-icon-tertiary", focusRing)}
      >
        <RiAddLine className="size-3" aria-hidden />
      </button>
    </div>
  );
}

export function Schedule() {
  const [week, setWeek] = useState<WeekDay[]>(() => WEEK.map((day) => ({ ...day })));
  const [selected, setSelected] = useState(0);
  const day = week[selected];

  const updateDay = (index: number, patch: Partial<WeekDay>) =>
    setWeek((current) => current.map((entry, position) => (position === index ? { ...entry, ...patch } : entry)));

  const shift = (key: "on" | "off", delta: number) => {
    const next = (day[key] + delta + 1440) % 1440;
    updateDay(selected, key === "on" ? { on: next } : { off: next });
  };

  return (
    <section aria-label="Heating schedule" className={card}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Schedule</h3>
        <span className={cx(meta, "truncate")}>Hallway thermostat</span>
      </div>

      <div role="group" aria-label="Day of the week" className="mt-1.5 flex gap-1 rounded-lg bg-background-secondary-default p-1">
        {week.map((entry, index) => {
          const active = index === selected;
          return (
            <button
              key={entry.day}
              type="button"
              aria-pressed={active}
              aria-label={`${entry.day}${entry.enabled ? ", schedule on" : ", no schedule"}`}
              onClick={() => setSelected(index)}
              className={cx(
                "flex h-8 flex-1 flex-col items-center justify-center gap-0.5 rounded-md text-caption-2-semibold",
                "transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                active
                  ? "bg-segmented-control-selected-background text-text-primary shadow-xs"
                  : "text-text-tertiary hover:text-text-secondary",
                focusRing,
              )}
            >
              {entry.initial}
              <span
                aria-hidden
                className={cx(
                  "size-1 rounded-full transition-[background-color,opacity] duration-150 ease-out motion-reduce:transition-none",
                  entry.enabled ? "bg-accent-500 opacity-100" : "bg-transparent opacity-0",
                )}
              />
            </button>
          );
        })}
      </div>

      <div
        className={cx(
          "mt-1.5 rounded-lg bg-background-secondary-default px-1.5 py-1",
          "transition-opacity duration-200 ease-out motion-reduce:transition-none",
          day.enabled ? "opacity-100" : "opacity-60",
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-caption-1-semibold text-text-primary">{day.day}</p>
          <span className="flex shrink-0 items-center gap-1.5">
            <span className={meta}>{day.enabled ? "On" : "Off"}</span>
            <Toggle
              checked={day.enabled}
              label={`Enable schedule for ${day.day}`}
              onChange={(next) => updateDay(selected, { enabled: next })}
            />
          </span>
        </div>

        <div className="mt-1 flex items-center gap-1.5">
          <TimeControl label="On" value={day.on} disabled={!day.enabled} onChange={(delta) => shift("on", delta)} />
          <TimeControl label="Off" value={day.off} disabled={!day.enabled} onChange={(delta) => shift("off", delta)} />
        </div>
      </div>

      <p aria-live="polite" className={cx(meta, "mt-1.5 flex items-center gap-1")}>
        <RiCalendarEventLine className="size-3 shrink-0" aria-hidden />
        <span className="truncate">
          {day.enabled
            ? `${day.day} · ${formatTime(day.on)} to ${formatTime(day.off)} · Heat`
            : `${day.day} · no schedule, frost guard only`}
        </span>
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  12. Room Filter                                                            */
/* -------------------------------------------------------------------------- */

const ROOMS = [
  { id: "living", name: "Living room", count: 6 },
  { id: "kitchen", name: "Kitchen", count: 4 },
  { id: "bedroom", name: "Bedroom", count: 3 },
  { id: "hallway", name: "Hallway", count: 2 },
  { id: "garage", name: "Garage", count: 1 },
] as const;

type RoomId = (typeof ROOMS)[number]["id"];
const TOTAL_DEVICES = ROOMS.reduce((sum, room) => sum + room.count, 0);

export function RoomFilter() {
  const [selected, setSelected] = useState<RoomId[]>([]);
  const count =
    selected.length === 0
      ? TOTAL_DEVICES
      : ROOMS.filter((room) => selected.includes(room.id)).reduce((sum, room) => sum + room.count, 0);

  const toggleRoom = (id: RoomId) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );

  const chipClass = (active: boolean) =>
    cx(
      "inline-flex h-7 items-center gap-1 rounded-full border px-2 text-caption-2-medium",
      "transition-[background-color,border-color,color] duration-150 ease-out motion-reduce:transition-none",
      active
        ? "border-accent-500 bg-background-secondary-default text-text-primary shadow-xs"
        : "border-border-button-default bg-background-primary-default text-text-secondary hover:bg-background-primary-hover",
      focusRing,
    );

  const countClass = (active: boolean) =>
    cx(
      "rounded-full px-1 text-caption-2-semibold tabular-nums transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
      active ? "bg-accent-100 text-accent-700" : "bg-background-tertiary-default text-text-tertiary",
    );

  return (
    <section aria-label="Filter devices by room" className={cx(card, "flex flex-col")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Rooms</h3>
        <span className={meta}>{ROOMS.length} rooms</span>
      </div>

      <div className="mt-1.5 flex flex-wrap gap-1.5">
        <button
          type="button"
          aria-pressed={selected.length === 0}
          onClick={() => setSelected([])}
          className={chipClass(selected.length === 0)}
        >
          All rooms
          <span className={countClass(selected.length === 0)}>{TOTAL_DEVICES}</span>
        </button>
        {ROOMS.map((room) => {
          const active = selected.includes(room.id);
          return (
            <button
              key={room.id}
              type="button"
              aria-pressed={active}
              onClick={() => toggleRoom(room.id)}
              className={chipClass(active)}
            >
              {room.name}
              <span className={countClass(active)}>{room.count}</span>
            </button>
          );
        })}
      </div>

      <div className={cx(meta, "mt-1.5 flex items-center gap-1 border-t border-separator-border pt-1.5")}>
        <RiHome4Line className="size-3.5 shrink-0" aria-hidden />
        <span>Showing</span>
        <span
          key={count}
          aria-live="polite"
          className="animate-number-fade text-caption-1-semibold text-text-primary tabular-nums motion-reduce:animate-none"
        >
          {count}
        </span>
        <span>{count === 1 ? "device" : "devices"}</span>
        <button
          type="button"
          onClick={() => setSelected([])}
          disabled={selected.length === 0}
          className={cx(
            "ms-auto shrink-0 rounded-sm text-caption-2-semibold text-accent-600 underline-offset-2",
            "transition-opacity duration-150 ease-out hover:underline motion-reduce:transition-none disabled:invisible",
            focusRing,
          )}
        >
          Clear
        </button>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Specimens                                                                  */
/* -------------------------------------------------------------------------- */

export const DEVICES_SECTION: ExtendedSection = {
  id: "devices",
  title: "Devices",
  blurb: "Sensors, scenes and the room that answers back.",
  file: "devices.tsx",
  entries: [
    { name: "Device Card", description: "A living-room lamp with room, power state and a live toggle.", Demo: DeviceCard },
    { name: "Sensor Reading", description: "Bedroom temperature and humidity, with the last twelve hours.", Demo: SensorReading },
    { name: "Automation Rule", description: "Hallway motion after sunset turns on the porch light.", Demo: AutomationRule },
    { name: "Energy Chart", description: "Seven days of electricity with the selected day's share.", Demo: EnergyChart },
    { name: "Camera Tile", description: "A porch camera that starts behind a privacy shutter.", Demo: CameraTile },
    { name: "Thermostat", description: "A living-room dial from 16 to 28 degrees in half steps.", Demo: Thermostat },
    { name: "Scene Picker", description: "Morning, Away, Movie and Night — one active at a time.", Demo: ScenePicker },
    { name: "Alert Log", description: "Motion and climate alerts, filtered and marked read.", Demo: AlertLog },
    { name: "Network Map", description: "Four mesh devices with signal strength, band and latency.", Demo: NetworkMap },
    { name: "Firmware Update", description: "A door lock moving from 2.4.1 to 2.6.0, with progress.", Demo: FirmwareUpdate },
    { name: "Schedule", description: "A weekly heating schedule with on and off times per day.", Demo: Schedule },
    { name: "Room Filter", description: "Filter devices by room and read the matching count.", Demo: RoomFilter },
  ],
};
