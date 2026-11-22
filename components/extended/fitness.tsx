"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  RiAddLine,
  RiArrowDownLine,
  RiArrowDownSLine,
  RiArrowRightLine,
  RiArrowUpLine,
  RiCalendarEventLine,
  RiCameraLine,
  RiCheckLine,
  RiCloseLine,
  RiFireLine,
  RiHeartPulseLine,
  RiLightbulbLine,
  RiMoonLine,
  RiPauseLine,
  RiPlayLine,
  RiRefreshLine,
  RiRunLine,
  RiScalesLine,
  RiSnowflakeLine,
  RiSubtractLine,
  RiTimerLine,
  RiTrophyLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* Shared anatomy */

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";
const cardSurface = "w-full rounded-xl border border-border-button-default bg-background-primary-default shadow-card";
const muted = "text-caption-2-regular text-text-tertiary";
const buttonBase = cx(
  "inline-flex items-center justify-center gap-1.5 rounded-lg text-caption-1-semibold",
  "transition-[transform,background-color,color,box-shadow,opacity] duration-150 ease-out",
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  "motion-reduce:transition-none motion-reduce:active:scale-100",
  focusRing,
);
const primaryButton = cx(buttonBase, "h-8 bg-button-primary px-2.5 text-text-white shadow-xs");
const secondaryButton = cx(buttonBase, "h-8 border border-border-button-default bg-background-primary-default px-2.5 text-text-primary shadow-xs hover:bg-background-primary-hover");
const quietButton = cx(buttonBase, "h-7 px-1.5 text-text-secondary hover:bg-background-secondary-default hover:text-text-primary");
const iconButton = cx(
  "flex size-7 shrink-0 items-center justify-center rounded-md text-foreground-icon-secondary",
  "transition-[background-color,color] duration-150 ease-out hover:bg-background-tertiary-default hover:text-text-primary",
  "disabled:pointer-events-none disabled:text-foreground-icon-disabled",
  "motion-reduce:transition-none",
  focusRing,
);
const chipBase = "inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-caption-2-medium";

const tones = {
  lime: "bg-status-lime-background text-status-lime-text",
  yellow: "bg-status-yellow-background text-status-yellow-text",
  blue: "bg-status-blue-background text-status-blue-text",
  rose: "bg-status-rose-background text-status-rose-text",
  neutral: "bg-background-tertiary-default text-text-secondary",
} as const;

type Tone = keyof typeof tones;

function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return <span className={cx(chipBase, tones[tone])}>{children}</span>;
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
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div role="group" aria-label={label} className={cx("flex shrink-0 rounded-lg bg-background-secondary-default p-0.5", className)}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cx(
              "h-6 flex-1 rounded-md px-1.5 whitespace-nowrap text-caption-2-semibold",
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

const clock = (total: number) => `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
const points = new Intl.NumberFormat("en-US");

function Arc({
  value,
  radius,
  tone,
  width = 5,
}: {
  value: number;
  radius: number;
  tone: string;
  width?: number;
}) {
  const circumference = 2 * Math.PI * radius;
  const filled = Math.min(1, Math.max(0, value));
  return (
    <>
      <circle cx="40" cy="40" r={radius} fill="none" strokeWidth={width} className="stroke-background-tertiary-default" />
      <circle
        cx="40"
        cy="40"
        r={radius}
        fill="none"
        strokeWidth={width}
        strokeLinecap="round"
        stroke="currentColor"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - filled)}
        className={cx(tone, "transition-[stroke-dashoffset] duration-200 ease-out motion-reduce:transition-none")}
      />
    </>
  );
}

/* 1. Workout Card */

const WORKOUT_EXERCISES = [
  { name: "Bench press", detail: "4 × 6 · 80 kg" },
  { name: "Incline dumbbell press", detail: "3 × 8 · 28 kg" },
  { name: "Cable fly", detail: "3 × 12 · 18 kg" },
] as const;

const WORKOUT_MINUTES = 45;

export function WorkoutCard() {
  const [started, setStarted] = useState(false);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  const minutes = Math.min(WORKOUT_MINUTES, Math.floor(elapsed / 60));
  const progress = Math.min(100, (elapsed / (WORKOUT_MINUTES * 60)) * 100);
  const label = started && running ? "Pause workout" : started && elapsed > 0 ? "Resume workout" : "Start workout";

  return (
    <section aria-label="Push day workout" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-start gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent-600 text-text-white shadow-xs">
          <RiRunLine className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-2-semibold tracking-wide text-accent-600 uppercase">Today · 6 exercises</p>
          <h3 className="truncate text-body-2-semibold text-text-primary">Push Day A</h3>
        </div>
        <Badge tone={started ? "lime" : "neutral"}>{started ? clock(elapsed) : "45 min"}</Badge>
      </div>

      <ul aria-label="First exercises" className="mt-1.5 flex flex-col">
        {WORKOUT_EXERCISES.map((exercise, index) => {
          const current = started && index === 0;
          return (
            <li
              key={exercise.name}
              className={cx(
                "flex items-center gap-2 rounded-md px-1.5 py-1",
                "transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
                current ? "bg-background-secondary-default" : "",
              )}
            >
              <span
                aria-hidden
                className={cx(
                  "size-1.5 shrink-0 rounded-full transition-[background-color] duration-200 ease-out motion-reduce:transition-none",
                  current ? "bg-accent-500" : "bg-background-quaternary-default",
                )}
              />
              <span className="min-w-0 flex-1 truncate text-caption-1-medium text-text-primary">{exercise.name}</span>
              <span className={cx("shrink-0 tabular-nums", muted)}>{exercise.detail}</span>
            </li>
          );
        })}
      </ul>

      <div className="mt-1 flex items-center gap-2">
        <div
          role="progressbar"
          aria-label="Workout elapsed"
          aria-valuemin={0}
          aria-valuemax={WORKOUT_MINUTES}
          aria-valuenow={minutes}
          aria-valuetext={`${minutes} of ${WORKOUT_MINUTES} minutes`}
          className="h-1 flex-1 overflow-hidden rounded-full bg-background-tertiary-default"
        >
          <div
            className="h-full rounded-full bg-chart-1 transition-[width] duration-200 ease-out motion-reduce:transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className={cx("shrink-0 tabular-nums", muted)}>
          {minutes} / {WORKOUT_MINUTES} min
        </span>
      </div>

      <button
        type="button"
        onClick={() => {
          setStarted(true);
          setRunning((value) => !value);
        }}
        className={cx(started && running ? secondaryButton : primaryButton, "mt-2 w-full")}
      >
        {started && running ? (
          <RiPauseLine className="size-3.5" aria-hidden />
        ) : started && elapsed > 0 ? (
          <RiPlayLine className="size-3.5" aria-hidden />
        ) : (
          <RiArrowRightLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
        )}
        {label}
      </button>
    </section>
  );
}

/* 2. Activity Ring */

const ACTIVITY_DAYS = [
  { id: "mon", short: "M", full: "Monday, Nov 2", move: 540, exercise: 32, stand: 10 },
  { id: "tue", short: "T", full: "Tuesday, Nov 3", move: 430, exercise: 24, stand: 8 },
  { id: "wed", short: "W", full: "Wednesday, Nov 4", move: 612, exercise: 41, stand: 11 },
  { id: "thu", short: "T", full: "Thursday, Nov 5", move: 388, exercise: 22, stand: 9 },
  { id: "fri", short: "F", full: "Friday, Nov 6", move: 640, exercise: 45, stand: 12 },
  { id: "sat", short: "S", full: "Saturday, Nov 7", move: 590, exercise: 36, stand: 11 },
  { id: "sun", short: "S", full: "Sunday, Nov 8", move: 300, exercise: 12, stand: 7 },
] as const;

type ActivityDayId = (typeof ACTIVITY_DAYS)[number]["id"];

const ACTIVITY_RINGS = [
  { key: "move", label: "Move", unit: "kcal", goal: 560, radius: 30, tone: "text-chart-3", dot: "bg-chart-3" },
  { key: "exercise", label: "Exercise", unit: "min", goal: 30, radius: 21, tone: "text-chart-2", dot: "bg-chart-2" },
  { key: "stand", label: "Stand", unit: "hr", goal: 10, radius: 12, tone: "text-chart-1", dot: "bg-chart-1" },
] as const;

export function ActivityRing() {
  const [selected, setSelected] = useState<ActivityDayId>("thu");
  const day = ACTIVITY_DAYS.find((item) => item.id === selected) ?? ACTIVITY_DAYS[3];
  const closed = ACTIVITY_RINGS.filter((ring) => day[ring.key] >= ring.goal).length;
  const movePercent = Math.round((day.move / ACTIVITY_RINGS[0].goal) * 100);

  return (
    <section aria-label="Daily activity" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Activity</h3>
        <Badge tone={closed === ACTIVITY_RINGS.length ? "lime" : "neutral"}>{closed} of 3 goals</Badge>
      </div>

      <div role="group" aria-label="Choose a day" className="mt-1.5 grid grid-cols-7 gap-0.5">
        {ACTIVITY_DAYS.map((item) => {
          const active = item.id === selected;
          return (
            <button
              key={item.id}
              type="button"
              aria-label={item.full}
              aria-pressed={active}
              onClick={() => setSelected(item.id)}
              className={cx(
                "flex h-7 items-center justify-center rounded-md text-caption-2-semibold",
                "transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                active ? "bg-accent-600 text-text-white shadow-xs" : "text-text-tertiary hover:bg-background-secondary-default hover:text-text-primary",
                focusRing,
              )}
            >
              {item.short}
            </button>
          );
        })}
      </div>

      <div className="mt-1.5 flex items-center gap-3">
        <div className="relative size-[84px] shrink-0">
          <svg
            viewBox="0 0 80 80"
            className="size-full -rotate-90"
            role="img"
            aria-label={`${day.full}: ${ACTIVITY_RINGS.map((ring) => `${day[ring.key]} of ${ring.goal} ${ring.unit} ${ring.label.toLowerCase()}`).join(", ")}`}
          >
            {ACTIVITY_RINGS.map((ring) => (
              <Arc key={ring.key} value={day[ring.key] / ring.goal} radius={ring.radius} tone={ring.tone} />
            ))}
          </svg>
          <div aria-hidden className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-caption-1-semibold text-text-primary tabular-nums">{movePercent}%</span>
            <span className="text-caption-2-regular text-text-tertiary">move</span>
          </div>
        </div>

        <dl className="min-w-0 flex-1">
          {ACTIVITY_RINGS.map((ring) => {
            const met = day[ring.key] >= ring.goal;
            return (
              <div key={ring.key} className="flex items-center gap-1.5 py-0.5">
                <dt className="flex min-w-0 flex-1 items-center gap-1.5">
                  <span aria-hidden className={cx("size-1.5 shrink-0 rounded-full", ring.dot)} />
                  <span className={cx("truncate", muted)}>{ring.label}</span>
                  <RiCheckLine
                    className={cx(
                      "size-3 shrink-0 text-status-lime-text transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
                      met ? "scale-100 opacity-100" : "scale-50 opacity-0",
                    )}
                    aria-hidden
                  />
                  {met ? <span className="sr-only">Goal met</span> : null}
                </dt>
                <dd className="shrink-0 text-caption-2-semibold text-text-primary tabular-nums">
                  {day[ring.key]}/{ring.goal}
                  <span className="text-caption-2-regular text-text-tertiary"> {ring.unit}</span>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>

      <p aria-live="polite" className={cx("mt-1", muted)}>
        {day.full} · {movePercent}% of move goal
      </p>
    </section>
  );
}

/* 3. Heart Rate Zone */

const HEART_ZONES = [
  { id: "z1", label: "Z1", name: "Recovery", range: "96–114", height: "h-3", bar: "bg-chart-4" },
  { id: "z2", label: "Z2", name: "Endurance", range: "115–133", height: "h-4", bar: "bg-chart-1" },
  { id: "z3", label: "Z3", name: "Tempo", range: "134–152", height: "h-5", bar: "bg-chart-2" },
  { id: "z4", label: "Z4", name: "Threshold", range: "153–171", height: "h-6", bar: "bg-chart-8" },
  { id: "z5", label: "Z5", name: "VO2 max", range: "172–190", height: "h-7", bar: "bg-chart-3" },
] as const;

const HR_MODES = [{ value: "live", label: "Live" }, { value: "rest", label: "Resting" }] as const;

type HeartMode = (typeof HR_MODES)[number]["value"];

export function HeartRateZone() {
  const [mode, setMode] = useState<HeartMode>("live");
  const live = mode === "live";
  const bpm = live ? 158 : 58;
  const zone = live ? HEART_ZONES[3] : null;

  return (
    <section aria-label="Heart rate zones" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <RiHeartPulseLine className={cx("size-4", live ? "animate-pulse text-status-rose-text motion-reduce:animate-none" : "text-foreground-icon-tertiary")} aria-hidden />
          <h3 className="text-body-2-semibold text-text-primary">Heart rate</h3>
        </div>
        <Badge tone={live ? "rose" : "blue"}>{live ? "Live" : "Resting"}</Badge>
      </div>

      <div className="mt-1.5 flex items-end justify-between gap-2">
        <p className="flex items-baseline gap-1 text-title-1-semibold text-text-primary tabular-nums">
          {bpm}
          <span className="text-caption-1-medium text-text-tertiary">bpm</span>
        </p>
        <Segmented label="Heart rate mode" value={mode} options={HR_MODES} onChange={setMode} className="w-[116px]" />
      </div>

      <div
        role="img"
        aria-label={zone ? `${bpm} beats per minute, zone 4 of 5, ${zone.name}, ${zone.range} bpm` : `${bpm} beats per minute, below zone 1, recovery`}
        className="mt-2 flex h-12 items-end gap-1"
      >
        {HEART_ZONES.map((item) => {
          const active = item.id === zone?.id;
          return (
            <div key={item.id} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1">
              <span
                className={cx(
                  "w-full rounded-md",
                  item.height,
                  active ? item.bar : "bg-background-tertiary-default",
                  "origin-bottom transition-[background-color,opacity,transform] duration-200 ease-out motion-reduce:transition-none",
                  active ? "scale-y-100 opacity-100" : "scale-y-90 opacity-70",
                )}
              />
              <span className={cx("text-caption-2-medium transition-[color] duration-200 ease-out motion-reduce:transition-none", active ? "text-text-primary" : "text-text-tertiary")}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-1.5 flex items-baseline justify-between gap-2">
        <p aria-live="polite" className="min-w-0 truncate text-caption-1-semibold text-text-primary">
          {zone ? `Zone 4 · ${zone.name}` : "Below zone 1 · Recovery"}
        </p>
        <p className={cx("shrink-0 tabular-nums", muted)}>{zone ? `${zone.range} bpm` : "under 96 bpm"}</p>
      </div>
      <p className={cx("mt-0.5", muted)}>{live ? "18:42 in zone today · max 176 bpm" : "Recovered 4 min after the last set"}</p>
    </section>
  );
}

/* 4. Set Tracker */

type LoggedSet = { id: number; weight: number; reps: number };

const STARTING_SETS: LoggedSet[] = [{ id: 1, weight: 100, reps: 5 }, { id: 2, weight: 105, reps: 5 }];

const MAX_SETS = 4;

function PlateStepper({
  label,
  value,
  unit,
  step,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  step: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <span className="text-caption-2-medium text-text-tertiary">{label}</span>
      <div className="flex h-8 items-center justify-between rounded-lg bg-background-tertiary-default px-1">
        <button
          type="button"
          aria-label={`Decrease ${label.toLowerCase()}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - step))}
          className={cx(
            "flex size-6 items-center justify-center rounded-md text-foreground-icon-secondary",
            "transition-[background-color,color] duration-150 ease-out hover:bg-background-primary-default hover:text-text-primary",
            "disabled:pointer-events-none disabled:text-foreground-icon-disabled",
            "motion-reduce:transition-none",
            focusRing,
          )}
        >
          <RiSubtractLine className="size-3.5" aria-hidden />
        </button>
        <span className="text-caption-1-semibold text-text-primary tabular-nums">
          {value}
          <span className="ms-0.5 text-caption-2-regular text-text-tertiary">{unit}</span>
        </span>
        <button
          type="button"
          aria-label={`Increase ${label.toLowerCase()}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + step))}
          className={cx(
            "flex size-6 items-center justify-center rounded-md text-foreground-icon-secondary",
            "transition-[background-color,color] duration-150 ease-out hover:bg-background-primary-default hover:text-text-primary",
            "disabled:pointer-events-none disabled:text-foreground-icon-disabled",
            "motion-reduce:transition-none",
            focusRing,
          )}
        >
          <RiAddLine className="size-3.5" aria-hidden />
        </button>
      </div>
    </div>
  );
}

export function SetTracker() {
  const [sets, setSets] = useState<LoggedSet[]>(STARTING_SETS);
  const [weight, setWeight] = useState(105);
  const [reps, setReps] = useState(5);
  const complete = sets.length >= MAX_SETS;

  const logSet = () => {
    if (complete) return;
    setSets((current) => [...current, { id: current.length + 1, weight, reps }]);
  };

  return (
    <section aria-label="Back squat sets" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
          <RiScalesLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Back squat</h3>
          <p className={muted}>Target 5 reps · RPE 8</p>
        </div>
        <Badge tone={complete ? "lime" : "neutral"}>{sets.length} of {MAX_SETS}</Badge>
      </div>

      <ol aria-label="Sets logged" className="mt-1.5 grid grid-cols-4 gap-1">
        {Array.from({ length: MAX_SETS }, (_, index) => {
          const set = sets[index];
          const active = index === sets.length;
          return (
            <li
              key={index}
              aria-label={set ? `Set ${index + 1} complete: ${set.weight} kilograms for ${set.reps} reps` : active ? `Set ${index + 1}, next` : `Set ${index + 1}, pending`}
              className={cx(
                "flex h-7 items-center justify-center gap-0.5 rounded-md border text-caption-2-medium tabular-nums",
                "transition-[background-color,border-color,color] duration-200 ease-out motion-reduce:transition-none",
                set
                  ? "border-transparent bg-status-lime-background text-status-lime-text"
                  : active
                    ? "border-accent-500 bg-background-primary-default text-text-primary"
                    : "border-border-button-default bg-background-secondary-default text-text-tertiary",
              )}
            >
              {set ? (
                <>
                  <RiCheckLine className="size-3" aria-hidden />
                  {set.weight} × {set.reps}
                </>
              ) : (
                `Set ${index + 1}`
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-2 flex items-end gap-2">
        <PlateStepper label="Weight" value={weight} unit="kg" step={5} min={60} max={200} onChange={setWeight} />
        <PlateStepper label="Reps" value={reps} unit="reps" step={1} min={1} max={12} onChange={setReps} />
      </div>

      <button
        type="button"
        onClick={logSet}
        disabled={complete}
        className={cx(primaryButton, "mt-2 w-full h-7")}
      >
        {complete ? <RiCheckLine className="size-3.5" aria-hidden /> : <RiAddLine className="size-3.5" aria-hidden />}
        {complete ? "All sets logged" : "Log set"}
      </button>
      <p aria-live="polite" className="sr-only">{complete ? "All four sets logged." : `${sets.length} of 4 sets logged.`}</p>
    </section>
  );
}

/* 5. Rest Timer */

const REST_SECONDS = 90;

export function RestTimer() {
  const [remaining, setRemaining] = useState(REST_SECONDS);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (running && remaining === 0) setRunning(false);
  }, [remaining, running]);

  const done = remaining === 0;
  const progress = remaining / REST_SECONDS;

  const startOrPause = () => {
    if (done) {
      setRemaining(REST_SECONDS);
      setRunning(true);
      return;
    }
    setRunning((value) => !value);
  };

  const reset = () => {
    setRunning(false);
    setRemaining(REST_SECONDS);
  };

  return (
    <section aria-label="Rest timer" className={cx(cardSurface, "max-w-[300px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <RiTimerLine className="size-4 text-foreground-icon-secondary" aria-hidden />
          <h3 className="text-body-2-semibold text-text-primary">Rest timer</h3>
        </div>
        <Badge tone={done ? "lime" : running ? "blue" : "neutral"}>
          {done ? "Complete" : running ? "Counting" : remaining === REST_SECONDS ? "Ready" : "Paused"}
        </Badge>
      </div>

      <div className="mt-1.5 flex items-center gap-3">
        <div className="relative size-[76px] shrink-0">
          <svg viewBox="0 0 80 80" className="size-full -rotate-90" aria-hidden>
            <Arc value={progress} radius={32} tone={done ? "text-status-lime-text" : "text-chart-1"} />
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span role="timer" className="text-body-2-semibold text-text-primary tabular-nums">{clock(remaining)}</span>
            <span className="text-caption-2-regular text-text-tertiary">{done ? "done" : "left"}</span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className={muted}>Back squat · set 3</p>
          <p className="truncate text-caption-1-semibold text-text-primary">Next: 105 kg × 5</p>
          <div className="mt-2 flex items-center gap-1.5">
            <button type="button" onClick={startOrPause} className={cx(done ? secondaryButton : primaryButton, "h-7 min-w-0 flex-1 px-2")}>
              {running ? <RiPauseLine className="size-3.5" aria-hidden /> : <RiPlayLine className="size-3.5" aria-hidden />}
              {done ? "Start again" : running ? "Pause" : remaining < REST_SECONDS ? "Resume" : "Start"}
            </button>
            <button
              type="button"
              aria-label="Reset rest timer"
              disabled={!running && remaining === REST_SECONDS}
              onClick={reset}
              className={cx(iconButton, "border border-border-button-default bg-background-primary-default")}
            >
              <RiRefreshLine className="size-3.5" aria-hidden />
            </button>
          </div>
        </div>
      </div>
      <p aria-live="polite" className="sr-only">{done ? "Rest complete. Start your next set." : ""}</p>
    </section>
  );
}

/* 6. Streak Card */

const STREAK_DAYS = [
  { id: "mon", short: "M", full: "Monday, November 2", done: true },
  { id: "tue", short: "T", full: "Tuesday, November 3", done: true },
  { id: "wed", short: "W", full: "Wednesday, November 4", done: true },
  { id: "thu", short: "T", full: "Thursday, November 5", done: false },
  { id: "fri", short: "F", full: "Friday, November 6", done: false },
  { id: "sat", short: "S", full: "Saturday, November 7", done: false },
  { id: "sun", short: "S", full: "Sunday, November 8", done: false },
] as const;

export function StreakCard() {
  const [frozen, setFrozen] = useState(false);
  const [freezes, setFreezes] = useState(2);

  const freeze = () => {
    setFrozen(true);
    setFreezes((value) => Math.max(0, value - 1));
  };

  return (
    <section aria-label="Workout streak" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-status-orange-background text-status-orange-text">
          <RiFireLine className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">12 day streak</h3>
          <p className={muted}>Best 21 days · {freezes} {freezes === 1 ? "freeze" : "freezes"} left</p>
        </div>
      </div>

      <ol aria-label="This week" className="mt-2 flex items-start gap-1">
        {STREAK_DAYS.map((day) => {
          const today = day.id === "thu";
          const stateText = day.done ? "complete" : today && frozen ? "frozen" : today ? "today, not complete" : "upcoming";
          return (
            <li key={day.id} aria-label={`${day.full}: ${stateText}`} className="flex min-w-0 flex-1 flex-col items-center gap-1">
              <span className="text-caption-2-medium text-text-tertiary">{day.short}</span>
              <span
                className={cx(
                  "flex size-6 items-center justify-center rounded-full border",
                  "transition-[background-color,border-color,color,transform] duration-200 ease-out motion-reduce:transition-none",
                  day.done
                    ? "border-transparent bg-status-lime-background text-status-lime-text"
                    : today && frozen
                      ? "border-transparent bg-status-blue-background text-status-blue-text"
                      : today
                        ? "border-accent-500 bg-background-primary-default text-accent-600"
                        : "border-border-button-default bg-background-secondary-default text-text-tertiary",
                )}
              >
                {day.done ? (
                  <RiCheckLine className="size-3.5" aria-hidden />
                ) : today && frozen ? (
                  <RiSnowflakeLine key="frozen" className="size-3.5 animate-label-in motion-reduce:animate-none" aria-hidden />
                ) : (
                  <span className={cx("size-1 rounded-full", today ? "bg-accent-500" : "bg-background-quaternary-default")} />
                )}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="mt-2 flex items-center gap-2">
        <p aria-live="polite" className={cx("min-w-0 flex-1 truncate text-caption-2-regular", frozen ? "text-status-blue-text" : "text-text-tertiary")}>
          {frozen ? "Today frozen · streak safe" : "3 of 7 active · freeze protects today"}
        </p>
        <button
          type="button"
          onClick={freeze}
          disabled={frozen || freezes === 0}
          className={cx(secondaryButton, "h-7 shrink-0 px-2")}
        >
          {frozen ? <RiCheckLine className="size-3.5" aria-hidden /> : <RiSnowflakeLine className="size-3.5" aria-hidden />}
          {frozen ? "Frozen" : "Freeze"}
        </button>
      </div>
    </section>
  );
}

/* 7. Leaderboard Row */

type BoardScope = "week" | "month";

type BoardRow = {
  rank: number;
  name: string;
  initials: string;
  score: number;
  movement: number;
  you?: boolean;
};

const BOARDS: Record<BoardScope, BoardRow[]> = {
  week: [
    { rank: 1, name: "Priya Raman", initials: "PR", score: 4820, movement: 2 },
    { rank: 2, name: "Jordan Lee", initials: "JL", score: 4410, movement: -1, you: true },
    { rank: 3, name: "Sam Okafor", initials: "SO", score: 4205, movement: 0 },
  ],
  month: [
    { rank: 1, name: "Priya Raman", initials: "PR", score: 18420, movement: 0 },
    { rank: 2, name: "Sam Okafor", initials: "SO", score: 17980, movement: 3 },
    { rank: 3, name: "Jordan Lee", initials: "JL", score: 17110, movement: -2, you: true },
  ],
};

const BOARD_SCOPES = [{ value: "week", label: "Week" }, { value: "month", label: "Month" }] as const;

function Movement({ value }: { value: number }) {
  if (value === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-caption-2-medium text-text-tertiary">
        <RiSubtractLine className="size-3" aria-hidden />
        <span className="sr-only">No change</span>
      </span>
    );
  }
  const up = value > 0;
  const Icon = up ? RiArrowUpLine : RiArrowDownLine;
  return (
    <span className={cx("inline-flex items-center gap-0.5 text-caption-2-semibold tabular-nums", up ? "text-status-lime-text" : "text-status-rose-text")}>
      <Icon className="size-3" aria-hidden />
      {Math.abs(value)}
      <span className="sr-only">{up ? "places up" : "places down"}</span>
    </span>
  );
}

export function LeaderboardRow() {
  const [scope, setScope] = useState<BoardScope>("week");
  const rows = BOARDS[scope];

  return (
    <section aria-label="Squad leaderboard" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Squad leaderboard</h3>
        <Segmented label="Leaderboard period" value={scope} options={BOARD_SCOPES} onChange={setScope} className="w-[108px]" />
      </div>

      <ol key={scope} aria-live="polite" className="mt-1.5 animate-label-in motion-reduce:animate-none">
        {rows.map((row) => (
          <li
            key={row.name}
            className={cx(
              "flex h-8 items-center gap-2 rounded-md px-1.5",
              row.you ? "bg-background-secondary-default" : "",
            )}
          >
            <span className={cx("w-3 shrink-0 text-caption-2-semibold tabular-nums", row.rank === 1 ? "text-status-yellow-text" : "text-text-tertiary")}>
              {row.rank}
            </span>
            <span
              aria-hidden
              className={cx(
                "flex size-6 shrink-0 items-center justify-center rounded-full text-caption-2-semibold",
                row.you ? "bg-accent-600 text-text-white" : "bg-background-tertiary-default text-text-secondary",
              )}
            >
              {row.initials}
            </span>
            <span className="flex min-w-0 flex-1 items-center gap-1">
              <span className="truncate text-caption-1-medium text-text-primary">{row.name}</span>
              {row.you ? (
                <span className="shrink-0 rounded-full border border-border-button-default bg-background-primary-default px-1 text-caption-2-medium text-text-secondary">
                  You
                </span>
              ) : null}
            </span>
            <span className="shrink-0 text-caption-1-semibold text-text-primary tabular-nums">{points.format(row.score)}</span>
            <span className="flex w-6 shrink-0 justify-end">
              <Movement value={row.movement} />
            </span>
          </li>
        ))}
      </ol>

      <p className={cx("mt-1", muted)}>Updated 6:40 AM · 12 members · 1,200 pts per session</p>
    </section>
  );
}

/* 8. Plan Builder */

const PLAN_DAYS = [
  { id: "mon", short: "Mon", label: "Monday", date: "Nov 2" },
  { id: "tue", short: "Tue", label: "Tuesday", date: "Nov 3" },
  { id: "wed", short: "Wed", label: "Wednesday", date: "Nov 4" },
  { id: "thu", short: "Thu", label: "Thursday", date: "Nov 5" },
  { id: "fri", short: "Fri", label: "Friday", date: "Nov 6" },
  { id: "sat", short: "Sat", label: "Saturday", date: "Nov 7" },
  { id: "sun", short: "Sun", label: "Sunday", date: "Nov 8" },
] as const;

type PlanDayId = (typeof PLAN_DAYS)[number]["id"];

type Plan = Record<PlanDayId, string[]>;

const PLAN_START: Plan = {
  mon: ["Back squat", "Romanian deadlift", "Walking lunge"],
  tue: ["Bench press", "Incline press"],
  wed: [],
  thu: ["Deadlift", "Barbell row", "Face pull"],
  fri: ["Overhead press", "Pull-up"],
  sat: ["Zone 2 run"],
  sun: [],
};

const EXERCISE_POOL = [
  "Back squat",
  "Bench press",
  "Deadlift",
  "Overhead press",
  "Barbell row",
  "Pull-up",
  "Face pull",
  "Zone 2 run",
  "Farmer carry",
  "Walking lunge",
  "Romanian deadlift",
  "Incline press",
] as const;

export function PlanBuilder() {
  const baseId = useId();
  const [day, setDay] = useState<PlanDayId>("thu");
  const [plan, setPlan] = useState<Plan>(PLAN_START);

  const selectedDay = PLAN_DAYS.find((item) => item.id === day) ?? PLAN_DAYS[3];
  const exercises = plan[day];
  const next = EXERCISE_POOL.find((exercise) => !exercises.includes(exercise));
  const total = PLAN_DAYS.reduce((sum, item) => sum + plan[item.id].length, 0);
  const trainingDays = PLAN_DAYS.filter((item) => plan[item.id].length > 0).length;

  const addExercise = () => {
    if (!next) return;
    setPlan((current) => {
      if (current[day].includes(next)) return current;
      const updated: Plan = { ...current };
      updated[day] = [...current[day], next];
      return updated;
    });
  };

  const removeExercise = (exercise: string) => {
    setPlan((current) => {
      const updated: Plan = { ...current };
      updated[day] = current[day].filter((item) => item !== exercise);
      return updated;
    });
  };

  return (
    <section aria-label="Weekly training plan" className={cx(cardSurface, "max-w-[560px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Plan builder</h3>
        <div className="flex items-center gap-1.5">
          <span className={cx("tabular-nums", muted)}>{trainingDays} training days</span>
          <Badge>{total} exercises</Badge>
        </div>
      </div>

      <div className="mt-1.5 grid grid-cols-[92px_1fr] gap-2">
        <div role="group" aria-label="Choose a day" className="flex flex-col gap-0.5">
          {PLAN_DAYS.map((item) => {
            const active = item.id === day;
            const count = plan[item.id].length;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                aria-controls={`${baseId}-panel`}
                onClick={() => setDay(item.id)}
                className={cx(
                  "flex h-6 items-center gap-1.5 rounded-md border px-1.5 text-start",
                  "transition-[background-color,border-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                  active
                    ? "border-accent-500 bg-background-primary-default text-text-primary shadow-xs"
                    : "border-transparent text-text-secondary hover:bg-background-secondary-default hover:text-text-primary",
                  focusRing,
                )}
              >
                <span className={cx("text-caption-1-medium", active ? "text-text-primary" : "")}>{item.short}</span>
                <span className={cx("ms-auto text-caption-2-regular tabular-nums", active ? "text-text-secondary" : "text-text-tertiary")}>
                  {count || "–"}
                </span>
              </button>
            );
          })}
        </div>

        <div
          id={`${baseId}-panel`}
          className="flex min-h-[166px] min-w-0 flex-col rounded-lg border border-separator-border bg-background-secondary-default/60 p-2"
        >
          <div className="flex items-baseline justify-between gap-2">
            <div className="min-w-0">
              <p className="text-caption-1-semibold text-text-primary">{selectedDay.label}</p>
              <p aria-live="polite" className={cx("truncate", muted)}>
                {selectedDay.date} · {exercises.length} {exercises.length === 1 ? "exercise" : "exercises"}
              </p>
            </div>
            <span className="shrink-0 text-caption-2-regular text-text-tertiary">{plan[day].length > 0 ? "Scheduled" : "Rest"}</span>
          </div>

          {exercises.length > 0 ? (
            <ul className="mt-1 flex flex-col gap-0.5">
              {exercises.map((exercise, index) => (
                <li
                  key={exercise}
                  className="flex h-6 animate-label-in items-center gap-1.5 rounded-md bg-background-primary-default px-1.5 shadow-xs motion-reduce:animate-none"
                >
                  <span className="w-3 shrink-0 text-caption-2-regular text-text-tertiary tabular-nums">{index + 1}</span>
                  <span className="min-w-0 flex-1 truncate text-caption-1-medium text-text-primary">{exercise}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${exercise} from ${selectedDay.label}`}
                    onClick={() => removeExercise(exercise)}
                    className={cx(
                      "flex size-5 items-center justify-center rounded-sm text-foreground-icon-tertiary",
                      "transition-[background-color,color] duration-150 ease-out hover:bg-background-tertiary-default hover:text-text-primary",
                      "motion-reduce:transition-none",
                      focusRing,
                    )}
                  >
                    <RiCloseLine className="size-3" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-center">
              <RiMoonLine className="size-4 text-foreground-icon-tertiary" aria-hidden />
              <p className="text-caption-1-medium text-text-secondary">Rest day</p>
              <p className={muted}>No load scheduled. Add a session if you feel fresh.</p>
            </div>
          )}

          <button
            type="button"
            onClick={addExercise}
            disabled={!next}
            className={cx(secondaryButton, "mt-auto h-7 w-full px-2 text-caption-2-semibold")}
          >
            <RiAddLine className="size-3.5" aria-hidden />
            {next ? `Add ${next}` : "All exercises added"}
          </button>
        </div>
      </div>
    </section>
  );
}

/* 9. PR Badge */

const PERSONAL_RECORDS = [
  { id: "squat", short: "Squat", lift: "Back squat", weight: "140", unit: "kg", date: "Oct 28, 2026", previous: "135 kg on Aug 12", delta: "+5 kg", note: "1 rep · RPE 9" },
  { id: "bench", short: "Bench", lift: "Bench press", weight: "92.5", unit: "kg", date: "Oct 21, 2026", previous: "90 kg on Sep 3", delta: "+2.5 kg", note: "1 rep · RPE 9" },
  { id: "deadlift", short: "Deadlift", lift: "Deadlift", weight: "180", unit: "kg", date: "Sep 30, 2026", previous: "175 kg on Jul 19", delta: "+5 kg", note: "1 rep · RPE 10" },
] as const;

type PrId = (typeof PERSONAL_RECORDS)[number]["id"];

const PR_OPTIONS = PERSONAL_RECORDS.map((record) => ({ value: record.id, label: record.short }));

export function PRBadge() {
  const [lift, setLift] = useState<PrId>("squat");
  const [open, setOpen] = useState(false);
  const sheetId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const record = PERSONAL_RECORDS.find((item) => item.id === lift) ?? PERSONAL_RECORDS[0];

  useEffect(() => {
    if (!open) {
      if (wasOpen.current) triggerRef.current?.focus();
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <section aria-label="Personal record" className={cx(cardSurface, "relative max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent-600 text-text-white shadow-xs">
          <RiTrophyLine className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Personal record</h3>
          <p className={cx("truncate", muted)}>Verified by Coach Diaz</p>
        </div>
        <Badge tone="lime">PR</Badge>
      </div>

      <div className="mt-1.5" inert={open}>
        <Segmented label="Choose a lift" value={lift} options={PR_OPTIONS} onChange={setLift} className="w-full" />
      </div>

      <div className="mt-1.5 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="flex items-baseline gap-1 text-title-1-semibold text-text-primary tabular-nums">
            {record.weight}
            <span className="text-caption-1-medium text-text-tertiary">{record.unit}</span>
          </p>
          <p className={cx("truncate", muted)}>{record.lift} · {record.note}</p>
        </div>
        <Badge tone="lime">{record.delta}</Badge>
      </div>

      <div inert={open} className="mt-1.5 flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1 text-caption-2-regular text-text-secondary">
          <RiCalendarEventLine className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">{record.date}</span>
        </span>
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls={sheetId}
          onClick={() => setOpen(true)}
          className={quietButton}
        >
          Record card
          <RiArrowDownSLine className={cx("size-3.5 transition-[transform] duration-150 ease-out motion-reduce:transition-none", open && "rotate-180")} aria-hidden />
        </button>
      </div>

      {open ? (
        <div
          id={sheetId}
          role="dialog"
          aria-label={`${record.lift} record card`}
          className="absolute inset-0 z-10 flex animate-label-in flex-col rounded-xl border border-border-button-default bg-background-primary-default p-2.5 shadow-dropdown motion-reduce:animate-none"
        >
          <div className="flex items-center gap-2">
            <h4 className="flex-1 text-body-2-semibold text-text-primary">Record card</h4>
            <button ref={closeRef} type="button" aria-label="Close record card" onClick={() => setOpen(false)} className={iconButton}>
              <RiCloseLine className="size-3.5" aria-hidden />
            </button>
          </div>
          <p className={cx("mt-1", muted)}>{record.lift}</p>
          <p className="flex items-baseline gap-1 text-title-1-semibold text-text-primary tabular-nums">
            {record.weight}
            <span className="text-caption-1-medium text-text-tertiary">{record.unit}</span>
          </p>
          <dl className="mt-1 grid grid-cols-2 gap-1.5">
            <div className="min-w-0">
              <dt className={muted}>Set on</dt>
              <dd className="truncate text-caption-1-medium text-text-primary">{record.date}</dd>
            </div>
            <div className="min-w-0">
              <dt className={muted}>Previous best</dt>
              <dd className="truncate text-caption-1-medium text-text-primary">{record.previous}</dd>
            </div>
          </dl>
          <p className="mt-auto flex items-center gap-1 text-caption-2-medium text-status-lime-text">
            <RiCheckLine className="size-3.5" aria-hidden />
            Verified · Northline Barbell
          </p>
        </div>
      ) : null}
    </section>
  );
}

/* 10. Recovery Score */

const RECOVERY_DAYS = {
  today: { score: 82, status: "Primed", tone: "lime", sleep: "7h 42m", hrv: "68 ms", rhr: "52 bpm", advice: "Sleep debt is low. Keep the top set and skip the finisher." },
  yesterday: { score: 74, status: "Steady", tone: "yellow", sleep: "6h 58m", hrv: "61 ms", rhr: "55 bpm", advice: "Hold volume under 80% and rest two minutes between sets." },
} as const;

type RecoveryDayKey = keyof typeof RECOVERY_DAYS;

const RECOVERY_OPTIONS = [{ value: "today", label: "Today" }, { value: "yesterday", label: "Yesterday" }] as const;

export function RecoveryScore() {
  const [dayKey, setDayKey] = useState<RecoveryDayKey>("today");
  const day = RECOVERY_DAYS[dayKey];

  return (
    <section aria-label="Recovery score" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Recovery</h3>
        <Segmented label="Recovery day" value={dayKey} options={RECOVERY_OPTIONS} onChange={setDayKey} className="w-[124px]" />
      </div>

      <div className="mt-1.5 flex items-center gap-3">
        <div className="relative size-[76px] shrink-0">
          <svg viewBox="0 0 80 80" className="size-full -rotate-90" role="img" aria-label={`Readiness ${day.score} of 100, ${day.status}`}>
            <Arc value={day.score / 100} radius={30} tone={day.tone === "lime" ? "text-chart-2" : "text-chart-8"} width={6} />
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-title-3-semibold text-text-primary tabular-nums">{day.score}</span>
            <span className="text-caption-2-regular text-text-tertiary">of 100</span>
          </div>
        </div>

        <dl className="grid min-w-0 flex-1 grid-cols-3 gap-1.5">
          <div className="min-w-0">
            <dt className={muted}>Sleep</dt>
            <dd className="truncate text-caption-1-semibold text-text-primary tabular-nums">{day.sleep}</dd>
          </div>
          <div className="min-w-0">
            <dt className={muted}>HRV</dt>
            <dd className="truncate text-caption-1-semibold text-text-primary tabular-nums">{day.hrv}</dd>
          </div>
          <div className="min-w-0">
            <dt className={muted}>Resting</dt>
            <dd className="truncate text-caption-1-semibold text-text-primary tabular-nums">{day.rhr}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-1.5 flex items-start gap-1.5 rounded-lg bg-background-secondary-default px-2 py-1.5">
        <RiLightbulbLine className="mt-px size-3.5 shrink-0 text-status-yellow-text" aria-hidden />
        <div className="min-w-0">
          <p className="text-caption-2-semibold text-text-primary">Coach's note · {day.status}</p>
          <p className="text-caption-2-regular text-text-secondary">{day.advice}</p>
        </div>
      </div>
    </section>
  );
}

/* 11. Class Schedule */

type Booking = "idle" | "booked" | "waitlisted";

const CLASSES = [
  { id: "hyrox", time: "06:30", duration: "45 min", name: "Hyrox Conditioning", coach: "Coach Diaz", spots: 4, waitlist: 0 },
  { id: "mobility", time: "12:15", duration: "30 min", name: "Mobility Flow", coach: "Coach Okafor", spots: 0, waitlist: 2 },
  { id: "oly", time: "18:00", duration: "60 min", name: "Olympic Lifting", coach: "Coach Reyes", spots: 2, waitlist: 0 },
] as const;

export function ClassSchedule() {
  const baseId = useId();
  const [bookings, setBookings] = useState<Record<string, Booking>>({});

  const toggle = (id: string, waitlistOnly: boolean) => {
    setBookings((current) => {
      const state = current[id] ?? "idle";
      return { ...current, [id]: state === "idle" ? (waitlistOnly ? "waitlisted" : "booked") : "idle" };
    });
  };

  return (
    <section aria-labelledby={`${baseId}-title`} className={cx(cardSurface, "max-w-[560px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
          <RiCalendarEventLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 id={`${baseId}-title`} className="text-body-2-semibold text-text-primary">Thursday, Nov 5</h3>
          <p className={muted}>Northline Barbell · 3 classes</p>
        </div>
        <Badge tone="blue">Today</Badge>
      </div>

      <ul className="mt-1">
        {CLASSES.map((item) => {
          const state = bookings[item.id] ?? "idle";
          const waitlistOnly = item.spots === 0;
          const spotsLabel =
            state === "booked"
              ? `${item.spots - 1} spots left`
              : state === "waitlisted"
                ? `You're #${item.waitlist + 1} in line`
                : waitlistOnly
                  ? `Waitlist · ${item.waitlist} ahead`
                  : `${item.spots} spots left`;
          return (
            <li key={item.id} className="flex items-center gap-2 border-b border-separator-border py-1 last:border-b-0">
              <div className="w-11 shrink-0">
                <p className="text-caption-1-semibold text-text-primary tabular-nums">{item.time}</p>
                <p className="text-caption-2-regular text-text-tertiary tabular-nums">{item.duration}</p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-caption-1-semibold text-text-primary">{item.name}</p>
                <p key={state} aria-live="polite" className="animate-label-in truncate text-caption-2-regular text-text-tertiary motion-reduce:animate-none">
                  {item.coach} · {spotsLabel}
                </p>
              </div>
              <button
                type="button"
                aria-pressed={state !== "idle"}
                aria-label={state === "booked" ? `Cancel booking for ${item.name}` : state === "waitlisted" ? `Leave the waitlist for ${item.name}` : waitlistOnly ? `Join the waitlist for ${item.name}` : `Book ${item.name}`}
                onClick={() => toggle(item.id, waitlistOnly)}
                className={cx(
                  state === "idle" ? (waitlistOnly ? secondaryButton : primaryButton) : secondaryButton,
                  "h-7 w-24 shrink-0 px-1.5 text-caption-2-semibold",
                )}
              >
                {state === "booked" ? (
                  <>
                    <RiCheckLine className="size-3" aria-hidden />
                    Booked
                  </>
                ) : state === "waitlisted" ? (
                  <>
                    <RiCheckLine className="size-3" aria-hidden />
                    Waitlisted
                  </>
                ) : waitlistOnly ? (
                  "Waitlist"
                ) : (
                  "Book"
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <p className={cx("mt-1", muted)}>Free cancellation up to 2 hours before class.</p>
    </section>
  );
}

/* 12. Progress Photo */

const PROGRESS_PHOTOS = {
  before: { label: "Before", date: "Oct 2, 2026", weight: 82.4, waist: 86 },
  after: { label: "After", date: "Nov 4, 2026", weight: 78.1, waist: 81 },
} as const;

type PhotoView = keyof typeof PROGRESS_PHOTOS;

const PHOTO_OPTIONS = [{ value: "before", label: "Before" }, { value: "after", label: "After" }] as const;

function Figure({ build }: { build: PhotoView }) {
  return (
    <svg
      viewBox="0 0 48 72"
      aria-hidden
      className={cx(
        "h-14 w-auto text-foreground-icon-quaternary",
        "transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none",
        build === "before" ? "scale-x-110 opacity-80" : "scale-x-95 opacity-100",
      )}
    >
      <circle cx="24" cy="10" r="6" fill="currentColor" />
      <path
        d="M24 18c-6 0-10 4-10 10v14h3v22h5V42h4v22h5V42h3V28c0-6-4-10-10-10Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ProgressPhoto() {
  const [view, setView] = useState<PhotoView>("after");
  const photo = PROGRESS_PHOTOS[view];

  return (
    <section aria-label="Progress photo" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <RiCameraLine className="size-4 text-foreground-icon-secondary" aria-hidden />
          <h3 className="text-body-2-semibold text-text-primary">Progress photo</h3>
        </div>
        <Segmented label="Progress view" value={view} options={PHOTO_OPTIONS} onChange={setView} className="w-[116px]" />
      </div>

      <div className="relative mt-1.5 h-[78px] overflow-hidden rounded-lg bg-background-secondary-default">
        {(Object.keys(PROGRESS_PHOTOS) as PhotoView[]).map((key) => (
          <div
            key={key}
            aria-hidden
            className={cx(
              "absolute inset-0 flex items-center justify-center",
              "transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
              view === key ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0",
            )}
          >
            <Figure build={key} />
          </div>
        ))}
        <span className="absolute start-2 top-2 rounded-full bg-background-primary-default px-1.5 py-0.5 text-caption-2-semibold text-text-secondary shadow-xs">
          {photo.label}
        </span>
        <span key={view} className="absolute end-2 top-2 animate-label-in rounded-full bg-background-primary-default px-1.5 py-0.5 text-caption-2-regular text-text-tertiary shadow-xs motion-reduce:animate-none">
          {photo.date}
        </span>
      </div>

      <dl className="mt-1.5 grid grid-cols-3 gap-2">
        <div className="min-w-0">
          <dt className={muted}>Weight</dt>
          <dd className="text-caption-1-semibold text-text-primary tabular-nums">{photo.weight} kg</dd>
        </div>
        <div className="min-w-0">
          <dt className={muted}>Waist</dt>
          <dd className="text-caption-1-semibold text-text-primary tabular-nums">{photo.waist} cm</dd>
        </div>
        <div className="min-w-0">
          <dt className={muted}>{view === "after" ? "Change" : "Goal"}</dt>
          <dd className={cx("text-caption-1-semibold tabular-nums", view === "after" ? "text-status-lime-text" : "text-text-primary")}>
            {view === "after" ? "−4.3 kg" : "76.0 kg"}
          </dd>
        </div>
      </dl>
    </section>
  );
}

/* Section */

export const FITNESS_SECTION: ExtendedSection = {
  id: "fitness",
  title: "Fitness",
  blurb: "Sets, zones and recovery you can read.",
  file: "fitness.tsx",
  entries: [
    { name: "Workout Card", description: "Duration, exercise count and a start state that counts.", Demo: WorkoutCard },
    { name: "Activity Ring", description: "Move, exercise and stand arcs across a switchable week.", Demo: ActivityRing },
    { name: "Heart Rate Zone", description: "A live bpm reading and the zone it lands in.", Demo: HeartRateZone },
    { name: "Set Tracker", description: "Weight and reps per set, with a completed-set log.", Demo: SetTracker },
    { name: "Rest Timer", description: "A 90-second countdown with start, pause and reset.", Demo: RestTimer },
    { name: "Streak Card", description: "A 12-day streak, a weekly row and one freeze.", Demo: StreakCard },
    { name: "Leaderboard Row", description: "Rank, name, points and movement for the week.", Demo: LeaderboardRow },
    { name: "Plan Builder", description: "A seven-day plan with exercises added and removed.", Demo: PlanBuilder, wide: true },
    { name: "PR Badge", description: "A personal record, its date and a verified card.", Demo: PRBadge },
    { name: "Recovery Score", description: "Readiness, sleep and the note for today.", Demo: RecoveryScore },
    { name: "Class Schedule", description: "Times, coaches and booking for Thursday.", Demo: ClassSchedule, wide: true },
    { name: "Progress Photo", description: "Before and after, with dates and measurements.", Demo: ProgressPhoto },
  ],
};
