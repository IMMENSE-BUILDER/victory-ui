"use client";

import { Fragment, useEffect, useId, useRef, useState } from "react";
import { RiAddLine, RiAlertLine, RiArrowDownSLine, RiArrowRightLine, RiArrowUpLine, RiCalendarLine, RiCheckLine, RiCloseLine, RiCodeLine, RiLoader4Line, RiMailLine, RiPauseLine, RiPlayLine, RiRefreshLine, RiSendPlaneLine } from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/*  Shared */

const number = new Intl.NumberFormat("en-US");
const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";
const card =
  "w-full max-w-[320px] rounded-xl border border-border-button-default bg-background-primary-default p-2.5 shadow-card";
const buttonBase = "inline-flex items-center justify-center gap-1 rounded-md text-caption-1-semibold transition-[background-color,color,box-shadow,transform,opacity] duration-150 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:scale-100";
const primaryButton = cx(buttonBase, "h-7 bg-button-primary px-2.5 text-text-white shadow-xs hover:opacity-90", focusRing);
const secondaryButton = cx(buttonBase, "h-7 border border-border-button-default bg-background-primary-default px-2 text-text-primary shadow-xs hover:bg-background-primary-hover", focusRing);
const quietButton = cx(buttonBase, "h-6 px-1.5 text-caption-2-semibold text-text-secondary hover:bg-background-secondary-default hover:text-text-primary", focusRing);
const iconButton = cx("flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-icon-tertiary", "transition-[background-color,color] duration-150 ease-out hover:bg-background-tertiary-default hover:text-text-primary", "motion-reduce:transition-none", focusRing);
const chipBase = "inline-flex h-6 items-center gap-1 rounded-full border px-2 text-caption-2-semibold transition-[background-color,border-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none";
const chipSelected = "border-accent-500 bg-accent-500/10 text-text-primary";
const chipIdle = "border-border-button-default bg-background-primary-default text-text-secondary hover:bg-background-primary-hover hover:text-text-primary";
const fieldBase = "h-6 w-full rounded-md bg-background-tertiary-default ps-1.5 pe-5 text-caption-1-medium text-text-primary outline-none transition-[background-color,box-shadow] duration-150 ease-out motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";
const menuSurface = "absolute z-20 mt-1 overflow-hidden rounded-lg border border-border-button-default bg-background-primary-default p-1 shadow-dropdown";
const menuRow = "flex w-full items-center gap-1.5 rounded-md px-1.5 text-start text-caption-1-medium text-text-primary transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none";

/** Close any open overlay from the keyboard, wherever focus sits. */
function useEscape(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;
    const handler = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onEscape();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [active, onEscape]);
}

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly { id: T; label: string }[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="flex items-center gap-0.5 rounded-md bg-background-tertiary-default p-0.5">
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.id)}
            className={cx(
              "h-6 rounded-sm px-2 text-caption-2-semibold",
              "transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
              focusRing,
              active
                ? "bg-background-primary-default text-text-primary shadow-xs"
                : "text-text-tertiary hover:text-text-secondary",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/*  1. Funnel chart */

const FUNNEL_STAGES = [
  { name: "Landing page", value: 12480, width: 100 },
  { name: "Sign-up", value: 3742, width: 74 },
  { name: "Activation", value: 1286, width: 47 },
  { name: "Paid plan", value: 418, width: 27 },
] as const;

export function FunnelChart() {
  const [active, setActive] = useState(1);
  const stage = FUNNEL_STAGES[active];
  const previous = active > 0 ? FUNNEL_STAGES[active - 1] : null;
  const conversion = previous ? (stage.value / previous.value) * 100 : 100;
  const dropped = previous ? previous.value - stage.value : 0;
  return (
    <section aria-label="Signup funnel" className={card}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Signup funnel</h3>
        <span className="text-caption-2-regular text-text-tertiary">Last 30 days</span>
      </div>
      <div role="group" aria-label="Funnel stages" className="mt-1.5 flex flex-col gap-1">
        {FUNNEL_STAGES.map((item, index) => {
          const selected = index === active;
          const stepFromPrevious = index === 0 ? null : FUNNEL_STAGES[index - 1];
          const step = stepFromPrevious ? (item.value / stepFromPrevious.value) * 100 : 100;
          return (
            <button
              key={item.name}
              type="button"
              aria-pressed={selected}
              aria-label={index === 0 ? `${item.name}: ${number.format(item.value)} people` : `${item.name}: ${number.format(item.value)} people, ${step.toFixed(1)} percent of the previous stage`}
              onClick={() => setActive(index)}
              className={cx(
                "flex h-6 w-full flex-col justify-center rounded-md px-1.5 text-start",
                "transition-[background-color] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                selected ? "bg-background-secondary-default" : "hover:bg-background-secondary-default/60",
              )}
            >
              <span className="flex items-baseline justify-between gap-2">
                <span className={cx("truncate text-caption-2-medium", selected ? "text-text-primary" : "text-text-secondary")}>
                  {item.name}
                </span>
                <span className="flex shrink-0 items-baseline gap-1.5">
                  <span className="text-caption-2-semibold text-text-primary tabular-nums">{number.format(item.value)}</span>
                  <span className="w-9 text-end text-caption-2-regular text-text-tertiary tabular-nums">{step.toFixed(1)}%</span>
                </span>
              </span>
              <span aria-hidden className="mt-1 h-1 overflow-hidden rounded-full bg-background-tertiary-default">
                <span
                  className={cx(
                    "block h-full rounded-full transition-[width,background-color] duration-200 ease-out motion-reduce:transition-none",
                    selected ? "bg-chart-1-active" : "bg-chart-1",
                  )}
                  style={{ width: `${item.width}%` }}
                />
              </span>
            </button>
          );
        })}
      </div>
      <p aria-live="polite" className="mt-1.5 flex items-center justify-between gap-2 text-caption-2-regular text-text-tertiary">
        <span className="truncate">
          {previous ? `${conversion.toFixed(1)}% from ${previous.name}` : "12,480 sessions entered"}
        </span>
        <span className="shrink-0 tabular-nums">{previous ? `${number.format(dropped)} dropped` : "3.3% reach paid"}</span>
      </p>
    </section>
  );
}

/*  2. Cohort grid */
const COHORT_WEEKS = ["W0", "W1", "W2", "W3", "W4", "W5"] as const;
const COHORTS = [
  { label: "Mar 2", size: 1840, retention: [100, 68, 54, 47, 43, 39] },
  { label: "Mar 9", size: 2016, retention: [100, 64, 51, 44, 40] },
  { label: "Mar 16", size: 1728, retention: [100, 61, 48, 42] },
  { label: "Mar 23", size: 1932, retention: [100, 66, 52] },
  { label: "Mar 30", size: 2104, retention: [100, 63] },
] as const;
function cohortTone(value: number) {
  if (value >= 90) return "bg-chart-1/60";
  if (value >= 60) return "bg-chart-1/50";
  if (value >= 45) return "bg-chart-1/35";
  if (value >= 30) return "bg-chart-1/25";
  return "bg-chart-1/15";
}

export function CohortGrid() {
  const [row, setRow] = useState(0);
  const [week, setWeek] = useState(3);
  const cohort = COHORTS[row];
  const retention = cohort.retention[week] ?? 0;
  const retained = Math.round((cohort.size * retention) / 100);
  return (
    <section aria-label="Weekly retention by cohort" className={card}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Retention by cohort</h3>
        <span className="text-caption-2-regular text-text-tertiary">Weekly signups</span>
      </div>
      <div role="group" aria-label="Cohort retention grid" className="mt-1.5 grid grid-cols-[44px_repeat(6,minmax(0,1fr))] gap-0.5">
        <span aria-hidden />
        {COHORT_WEEKS.map((label) => (
          <span key={label} className="text-center text-caption-2-regular text-text-tertiary">
            {label}
          </span>
        ))}
        {COHORTS.map((item, itemIndex) => (
          <Fragment key={item.label}>
            <span className="flex items-center text-caption-2-regular text-text-tertiary">{item.label}</span>
            {COHORT_WEEKS.map((label, weekIndex) => {
              const value = item.retention[weekIndex];
              if (value === undefined) {
                return <span key={label} aria-hidden className="h-5 rounded-sm bg-background-secondary-default/50" />;
              }
              const selected = row === itemIndex && week === weekIndex;
              return (
                <button
                  key={label}
                  type="button"
                  aria-pressed={selected}
                  aria-label={`${item.label} cohort, week ${weekIndex}: ${value} percent retained, ${Math.round(
                    (item.size * value) / 100,
                  )} of ${number.format(item.size)} users`}
                  onClick={() => {
                    setRow(itemIndex);
                    setWeek(weekIndex);
                  }}
                  className={cx(
                    "h-5 rounded-sm text-center text-caption-2-semibold text-text-primary tabular-nums",
                    "transition-[background-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                    focusRing,
                    cohortTone(value),
                    selected
                      ? "ring-2 ring-accent-500 ring-inset"
                      : "hover:ring-1 hover:ring-chart-1-active hover:ring-inset",
                  )}
                >
                  {value}
                </button>
              );
            })}
          </Fragment>
        ))}
      </div>
      <p aria-live="polite" className="mt-1 flex items-center justify-between gap-2 text-caption-2-regular text-text-tertiary">
        <span className="truncate">
          {cohort.label} · week {week}
        </span>
        <span className="shrink-0 tabular-nums">
          {retention}% retained · {number.format(retained)} users
        </span>
      </p>
    </section>
  );
}

/*  3. Segment builder */
const SEGMENT_BASE = 48200;
const SEGMENT_FIELDS = [
  { name: "Plan", operator: "is", options: ["Pro", "Team", "Enterprise"], reach: [0.42, 0.18, 0.06] },
  { name: "Country", operator: "is", options: ["United States", "Germany", "Japan"], reach: [0.56, 0.09, 0.07] },
  { name: "Last seen", operator: "within", options: ["7 days", "14 days", "30 days"], reach: [0.48, 0.71, 0.88] },
  { name: "Company size", operator: "over", options: ["200 seats", "500 seats", "1,000 seats"], reach: [0.33, 0.19, 0.08] },
  { name: "Referrer", operator: "is", options: ["Product Hunt", "Google", "Partner"], reach: [0.12, 0.34, 0.08] },
] as const;
type SegmentCondition = { id: number; field: number; value: number };
const INITIAL_CONDITIONS: SegmentCondition[] = [
  { id: 1, field: 0, value: 0 },
  { id: 2, field: 2, value: 1 },
];

export function SegmentBuilder() {
  const [conditions, setConditions] = useState<SegmentCondition[]>(INITIAL_CONDITIONS);
  const nextId = useRef(2);
  const audience =
    Math.round(
      (SEGMENT_BASE *
        conditions.reduce((total, condition) => {
          const field = SEGMENT_FIELDS[condition.field];
          return total * (field.reach[condition.value] ?? 1);
        }, 1)) /
        10,
    ) * 10;
  const addCondition = () => {
    if (conditions.length >= 3) return;
    const used = new Set(conditions.map((condition) => condition.field));
    const field = SEGMENT_FIELDS.findIndex((_, index) => !used.has(index));
    if (field === -1) return;
    nextId.current += 1;
    setConditions((current) => [...current, { id: nextId.current, field, value: 0 }]);
  };
  const removeCondition = (id: number) => {
    setConditions((current) => current.filter((condition) => condition.id !== id));
  };
  return (
    <section aria-label="Segment builder" className={card}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Segment builder</h3>
        <span className="text-caption-2-regular text-text-tertiary">48,200 people</span>
      </div>
      <div className="mt-1.5 flex flex-col gap-1">
        {conditions.map((condition) => {
          const field = SEGMENT_FIELDS[condition.field];
          return (
            <div key={condition.id} className="flex animate-label-in items-center gap-1 motion-reduce:animate-none">
              <select
                aria-label={`Condition property, currently ${field.name}`}
                value={condition.field}
                onChange={(event) => {
                  const nextField = Number(event.target.value);
                  setConditions((current) =>
                    current.map((item) => (item.id === condition.id ? { ...item, field: nextField, value: 0 } : item)),
                  );
                }}
                className={cx(fieldBase, "w-28 shrink-0 text-caption-2-semibold")}
              >
                {SEGMENT_FIELDS.map((option, index) => (
                  <option key={option.name} value={index}>
                    {option.name}
                  </option>
                ))}
              </select>
              <span className="shrink-0 text-caption-2-regular text-text-tertiary">{field.operator}</span>
              <select
                aria-label={`${field.name} value`}
                value={condition.value}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setConditions((current) =>
                    current.map((item) => (item.id === condition.id ? { ...item, value } : item)),
                  );
                }}
                className={cx(fieldBase, "min-w-0 flex-1 text-caption-2-medium")}
              >
                {field.options.map((option, index) => (
                  <option key={option} value={index}>
                    {option}
                  </option>
                ))}
              </select>
              <button
                type="button"
                aria-label={`Remove ${field.name} condition`}
                onClick={() => removeCondition(condition.id)}
                className={iconButton}
              >
                <RiCloseLine className="size-3" aria-hidden />
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={addCondition}
          disabled={conditions.length >= 3}
          className={cx(quietButton, "ps-0 hover:bg-transparent")}
        >
          <RiAddLine className="size-3" aria-hidden />
          Add condition
        </button>
        <span className="text-caption-2-regular text-text-tertiary">Max 3</span>
      </div>
      <div aria-live="polite" className="mt-1 flex items-baseline justify-between gap-2 rounded-lg bg-background-secondary-default px-2 py-1">
        <span className="text-caption-2-medium text-text-secondary">Estimated audience</span>
        <span key={audience} className="animate-number-fade text-caption-1-semibold text-text-primary tabular-nums motion-reduce:animate-none">
          {number.format(audience)} people
        </span>
      </div>
    </section>
  );
}

/*  4. Retention curve */
const RETENTION_WEEKS = ["W0", "W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"] as const;
const RETENTION_SERIES = {
  current: [100, 62, 48, 41, 36, 33, 30, 28, 27],
  previous: [100, 58, 44, 37, 32, 29, 26, 24, 22],
};
const retentionX = (index: number) => 10 + (index * 276) / 8;
const retentionY = (value: number) => 78 - ((value - 15) / 85) * 60;
const retentionPath = (values: number[]) =>
  values.map((value, index) => `${index === 0 ? "M" : "L"} ${retentionX(index).toFixed(1)} ${retentionY(value).toFixed(1)}`).join(" ");

export function RetentionCurve() {
  const [week, setWeek] = useState(4);
  const [visible, setVisible] = useState({ current: true, previous: true });
  const current = RETENTION_SERIES.current[week];
  const previous = RETENTION_SERIES.previous[week];
  const delta = current - previous;
  const toggleSeries = (key: "current" | "previous") => {
    setVisible((state) => {
      const next = { ...state, [key]: !state[key] };
      return next.current || next.previous ? next : state;
    });
  };
  return (
    <section aria-label="Week over week retention" className={card}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Retention curve</h3>
        <span className="text-caption-2-regular text-text-tertiary">Median 36%</span>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <button type="button" aria-pressed={visible.current} onClick={() => toggleSeries("current")} className={cx("flex items-center gap-1 rounded-sm text-caption-2-medium transition-[opacity,color] duration-150 ease-out motion-reduce:transition-none", focusRing, visible.current ? "text-text-secondary" : "text-text-tertiary opacity-60")}>
          <span className={cx("size-1.5 rounded-full transition-colors duration-150 ease-out motion-reduce:transition-none", visible.current ? "bg-chart-1" : "bg-background-quaternary-default")} />
          This quarter
        </button>
        <button type="button" aria-pressed={visible.previous} onClick={() => toggleSeries("previous")} className={cx("flex items-center gap-1 rounded-sm text-caption-2-medium transition-[opacity,color] duration-150 ease-out motion-reduce:transition-none", focusRing, visible.previous ? "text-text-secondary" : "text-text-tertiary opacity-60")}>
          <span className={cx("size-1.5 rounded-full transition-colors duration-150 ease-out motion-reduce:transition-none", visible.previous ? "bg-chart-3" : "bg-background-quaternary-default")} />
          Last quarter
        </button>
      </div>
      <div className="relative mt-0.5">
        <svg
          viewBox="0 0 296 88"
          className="h-[88px] w-full"
          role="img"
          aria-label={`Weekly retention from week 0 to week 8. At week ${week}, ${current} percent of this quarter's cohort returned versus ${previous} percent last quarter.`}
        >
          {[25, 50, 75].map((tick) => (
            <line
              key={tick}
              x1="10"
              x2="286"
              y1={retentionY(tick)}
              y2={retentionY(tick)}
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2 3"
              className="text-separator-border"
            />
          ))}
          <line x1="10" x2="286" y1="78" y2="78" stroke="currentColor" strokeWidth="1" className="text-separator-border" />
          {[0, 2, 4, 6, 8].map((labelIndex) => (
            <text key={labelIndex} x={retentionX(labelIndex)} y="86" textAnchor="middle" fill="currentColor" className="text-caption-2-regular text-text-tertiary">
              {RETENTION_WEEKS[labelIndex]}
            </text>
          ))}
          <line
            x1={retentionX(week)}
            x2={retentionX(week)}
            y1="14"
            y2="78"
            stroke="currentColor"
            strokeWidth="1"
            className="text-chart-1/30"
          />
          <g className={cx("transition-opacity duration-200 ease-out motion-reduce:transition-none", visible.previous ? "opacity-100" : "opacity-0")}>
            <path
              d={retentionPath(RETENTION_SERIES.previous)}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeDasharray="4 3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-chart-3"
            />
            <circle cx={retentionX(week)} cy={retentionY(previous)} r="2.6" fill="currentColor" className="text-chart-3" />
          </g>
          <g className={cx("transition-opacity duration-200 ease-out motion-reduce:transition-none", visible.current ? "opacity-100" : "opacity-0")}>
            <path
              d={retentionPath(RETENTION_SERIES.current)}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-chart-1"
            />
            <circle cx={retentionX(week)} cy={retentionY(current)} r="3" fill="currentColor" className="text-chart-1" />
          </g>
        </svg>
        <div dir="ltr" className="absolute inset-0 grid grid-cols-9" role="group" aria-label="Select a week">
          {RETENTION_WEEKS.map((label, index) => (
            <button
              key={label}
              type="button"
              aria-pressed={week === index}
              aria-label={`Week ${index}: ${RETENTION_SERIES.current[index]} percent this quarter, ${RETENTION_SERIES.previous[index]} percent last quarter`}
              onMouseEnter={() => setWeek(index)}
              onFocus={() => setWeek(index)}
              onClick={() => setWeek(index)}
              className={cx("h-full rounded-sm", focusRing)}
            />
          ))}
        </div>
      </div>
      <p aria-live="polite" className="mt-0.5 flex items-center justify-between gap-2 text-caption-2-regular text-text-tertiary">
        <span>
          Week {week} · {current}% this quarter
        </span>
        <span className={cx("tabular-nums", delta >= 0 ? "text-status-lime-text" : "text-status-rose-text")}>
          {delta >= 0 ? "+" : ""}
          {delta} pts vs. last
        </span>
      </p>
    </section>
  );
}

/*  5. Compare toggle */
const COMPARE_PERIODS = [
  {
    id: "current",
    label: "Current",
    range: "Oct 1 – Oct 30",
    note: "vs. Sep 1 – Sep 30",
    value: 24810,
    delta: 12.4,
    bars: [38, 52, 47, 61, 58, 71, 64, 78, 72, 88],
    color: "bg-chart-1",
  },
  {
    id: "previous",
    label: "Previous",
    range: "Sep 1 – Sep 30",
    note: "baseline before the campaign",
    value: 22076,
    delta: 4.1,
    bars: [34, 45, 52, 48, 56, 60, 54, 66, 61, 70],
    color: "bg-chart-2",
  },
] as const;
type ComparePeriod = (typeof COMPARE_PERIODS)[number]["id"];

export function CompareToggle() {
  const [period, setPeriod] = useState<ComparePeriod>("current");
  const active = COMPARE_PERIODS.find((item) => item.id === period) ?? COMPARE_PERIODS[0];
  const difference = COMPARE_PERIODS[0].value - COMPARE_PERIODS[1].value;
  return (
    <section aria-label="Compare sessions by period" className={card}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Sessions</h3>
        <Segmented label="Compare periods" options={COMPARE_PERIODS} value={period} onChange={setPeriod} />
      </div>
      <div className="mt-0.5 flex items-baseline gap-1.5">
        <span key={active.id} className="animate-number-fade text-title-3-semibold text-text-primary tabular-nums motion-reduce:animate-none">
          {number.format(active.value)}
        </span>
        <span
          className={cx(
            "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-caption-2-semibold",
            "transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
            active.delta >= 0
              ? "bg-status-lime-background text-status-lime-text"
              : "bg-status-rose-background text-status-rose-text",
          )}
        >
          <RiArrowUpLine className="size-3" aria-hidden />
          {active.delta}%
        </span>
      </div>
      <p className="text-caption-2-regular text-text-tertiary">
        {active.range} · {active.note}
      </p>
      <div
        className="mt-1.5 flex h-14 items-end gap-1"
        role="img"
        aria-label={`Daily sessions for ${active.range}, trending up ${active.delta} percent overall.`}
      >
        {active.bars.map((bar, index) => (
          <span
            key={index}
            className={cx(
              "w-full rounded-sm transition-[height,background-color] duration-200 ease-out motion-reduce:transition-none",
              active.color,
            )}
            style={{ height: `${(bar / 92) * 100}%` }}
          />
        ))}
      </div>
      <p aria-live="polite" className="mt-1 flex items-center justify-between gap-2 text-caption-2-regular text-text-tertiary">
        <span className="truncate">{active.id === "current" ? `${number.format(difference)} more than previous` : "Same sample, prior month"}</span>
        <span className="shrink-0">30 days</span>
      </p>
    </section>
  );
}

/*  6. Attribution row */
type AttributionModel = "first" | "last";
const ATTRIBUTION_TOTAL = 3132;
const ATTRIBUTION_CHANNELS = ["Organic search", "Paid social", "Email", "Referral"] as const;
const ATTRIBUTION_BARS = ["bg-chart-1", "bg-chart-3", "bg-chart-2", "bg-chart-5"] as const;
const ATTRIBUTION_MODELS: Record<AttributionModel, { shares: number[]; cpa: number[] }> = {
  first: { shares: [46, 24, 18, 12], cpa: [18, 64, 12, 41] },
  last: { shares: [31, 38, 21, 10], cpa: [22, 57, 9, 48] },
};
const ATTRIBUTION_OPTIONS = [
  { id: "first", label: "First" },
  { id: "last", label: "Last" },
] as const;

export function AttributionRow() {
  const [model, setModel] = useState<AttributionModel>("last");
  const [channel, setChannel] = useState(0);
  const data = ATTRIBUTION_MODELS[model];
  const selectedShare = data.shares[channel];
  const selectedCount = Math.round((ATTRIBUTION_TOTAL * selectedShare) / 100);
  return (
    <section aria-label="Channel attribution" className={card}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Attribution</h3>
        <Segmented label="Attribution model" options={ATTRIBUTION_OPTIONS} value={model} onChange={setModel} />
      </div>
      <p className="text-caption-2-regular text-text-tertiary">
        {number.format(ATTRIBUTION_TOTAL)} conversions · {model === "first" ? "first-touch model" : "last-touch model"}
      </p>
      <div role="group" aria-label="Channels" className="mt-1 flex flex-col gap-0.5">
        {ATTRIBUTION_CHANNELS.map((name, index) => {
          const share = data.shares[index];
          const count = Math.round((ATTRIBUTION_TOTAL * share) / 100);
          const selected = channel === index;
          return (
            <button
              key={name}
              type="button"
              aria-pressed={selected}
              aria-label={`${name}: ${number.format(count)} conversions, ${share} percent of all conversions`}
              onClick={() => setChannel(index)}
              className={cx(
                "flex flex-col gap-0.5 rounded-md px-1 py-0.5 text-start",
                "transition-[background-color] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                selected ? "bg-background-secondary-default" : "hover:bg-background-secondary-default/60",
              )}
            >
              <span className="flex items-baseline justify-between gap-2">
                <span className="truncate text-caption-2-medium text-text-secondary">{name}</span>
                <span className="flex shrink-0 items-baseline gap-1.5">
                  <span
                    key={`${model}-${name}`}
                    className="animate-number-fade text-caption-2-semibold text-text-primary tabular-nums motion-reduce:animate-none"
                  >
                    {number.format(count)}
                  </span>
                  <span className="w-7 text-end text-caption-2-regular text-text-tertiary tabular-nums">{share}%</span>
                </span>
              </span>
              <span aria-hidden className="h-1 overflow-hidden rounded-full bg-background-tertiary-default">
                <span
                  className={cx(
                    "block h-full rounded-full transition-[width,background-color] duration-200 ease-out motion-reduce:transition-none",
                    ATTRIBUTION_BARS[index],
                  )}
                  style={{ width: `${share}%` }}
                />
              </span>
            </button>
          );
        })}
      </div>
      <p aria-live="polite" className="mt-1 truncate text-caption-2-regular text-text-tertiary">
        {ATTRIBUTION_CHANNELS[channel]} · {number.format(selectedCount)} conversions · ${data.cpa[channel]} CPA
      </p>
    </section>
  );
}

/*  7. Report scheduler */
const REPORT_FREQUENCIES = [
  { id: "weekly", label: "Weekly", next: "Mon, Nov 9", time: "9:00 AM" },
  { id: "biweekly", label: "2 weeks", next: "Mon, Nov 16", time: "9:00 AM" },
  { id: "monthly", label: "Monthly", next: "Tue, Dec 1", time: "9:00 AM" },
] as const;
type ReportFrequency = (typeof REPORT_FREQUENCIES)[number]["id"];
type Recipient = { id: string; name: string; email: string };
const INITIAL_RECIPIENTS: Recipient[] = [
  { id: "maya", name: "Maya Chen", email: "maya@northline.co" },
  { id: "dev", name: "Dev Raman", email: "dev@northline.co" },
];
const RECIPIENT_POOL: Recipient[] = [
  { id: "priya", name: "Priya Shah", email: "priya@northline.co" },
  { id: "leo", name: "Leo Park", email: "leo@northline.co" },
];
const RECIPIENT_ROSTER = [...INITIAL_RECIPIENTS, ...RECIPIENT_POOL];
function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ReportScheduler() {
  const [frequency, setFrequency] = useState<ReportFrequency>("weekly");
  const [recipients, setRecipients] = useState<Recipient[]>(INITIAL_RECIPIENTS);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  useEffect(() => {
    if (status !== "sending") return;
    const timer = window.setTimeout(() => setStatus("sent"), 900);
    return () => window.clearTimeout(timer);
  }, [status]);
  const schedule = REPORT_FREQUENCIES.find((item) => item.id === frequency) ?? REPORT_FREQUENCIES[0];
  const addRecipient = () => {
    const next = RECIPIENT_ROSTER.find((candidate) => !recipients.some((item) => item.id === candidate.id));
    if (!next) return;
    setRecipients((current) => [...current, next]);
    setStatus("idle");
  };
  return (
    <section aria-label="Scheduled report" className={card}>
      <div className="flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
          <RiMailLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">Revenue digest</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">{number.format(ATTRIBUTION_TOTAL)} conversions · 30 days</p>
        </div>
        <span className="inline-flex h-5 shrink-0 items-center gap-1 rounded-full bg-status-lime-background px-1.5 text-caption-2-medium text-status-lime-text">
          <span className="size-1 rounded-full bg-status-lime-text" aria-hidden />
          Active
        </span>
      </div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <span className="text-caption-2-medium text-text-tertiary">Frequency</span>
        <Segmented label="Report frequency" options={REPORT_FREQUENCIES} value={frequency} onChange={(next) => { setFrequency(next); setStatus("idle"); }} />
      </div>
      <div role="group" aria-label="Report recipients" className="mt-1 flex flex-wrap items-center gap-1">
        {recipients.map((recipient) => (
          <span key={recipient.id} className="inline-flex h-6 max-w-32 animate-label-in items-center gap-1 rounded-full border border-border-button-default bg-background-secondary-default pe-0.5 ps-0.5 motion-reduce:animate-none">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-500/10 text-caption-2-semibold text-text-primary">{initials(recipient.name)}</span>
            <span className="min-w-0 truncate text-caption-2-medium text-text-secondary">{recipient.name.split(" ")[0]}</span>
            <button type="button" aria-label={`Remove ${recipient.name}`} onClick={() => { setRecipients((current) => current.filter((item) => item.id !== recipient.id)); setStatus("idle"); }} className="flex size-4 shrink-0 items-center justify-center rounded-full text-foreground-icon-tertiary transition-[background-color,color] duration-150 ease-out hover:bg-background-tertiary-default hover:text-text-primary motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring">
              <RiCloseLine className="size-3" aria-hidden />
            </button>
          </span>
        ))}
        <button
          type="button"
          aria-label={`Add recipient${recipients.length >= 4 ? ", limit reached" : ""}`}
          disabled={recipients.length >= 4}
          onClick={addRecipient}
          className={cx(iconButton, "rounded-full border border-dashed border-border-button-default")}
        >
          <RiAddLine className="size-3" aria-hidden />
        </button>
      </div>
      <div className="mt-1 flex items-center justify-between gap-2 rounded-md bg-background-secondary-default px-1.5 py-1">
        <span className="flex items-center gap-1 text-caption-2-regular text-text-tertiary">
          <RiCalendarLine className="size-3" aria-hidden />
          Next send
        </span>
        <span key={frequency} className="animate-label-in text-caption-2-semibold text-text-primary tabular-nums motion-reduce:animate-none">
          {schedule.next} · {schedule.time}
        </span>
      </div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <span
          role="status"
          aria-live="polite"
          className={cx(
            "min-w-0 truncate text-caption-2-regular",
            status === "sent" ? "text-status-lime-text" : "text-text-tertiary",
          )}
        >
          {status === "sending"
            ? "Sending test…"
            : status === "sent"
              ? `Test sent to ${recipients.length} ${recipients.length === 1 ? "person" : "people"}`
              : `${recipients.length} of 4 recipients`}
        </span>
        <button
          type="button"
          onClick={() => setStatus("sending")}
          disabled={status === "sending" || recipients.length === 0}
          className={cx(primaryButton, "h-6 shrink-0")}
        >
          {status === "sending" ? (
            <>
              <RiLoader4Line className="size-3 animate-spin motion-reduce:animate-none" aria-hidden />
              Sending
            </>
          ) : status === "sent" ? (
            <>
              <RiRefreshLine className="size-3" aria-hidden />
              Send again
            </>
          ) : (
            <>
              <RiSendPlaneLine className="size-3 rtl:-scale-x-100" aria-hidden />
              Send test
            </>
          )}
        </button>
      </div>
    </section>
  );
}

/*  8. Query builder */
const QUERY_METRICS = [
  { id: "sessions", label: "Sessions", expression: "count(distinct session_id)", rows: 24810, unit: "rows" },
  { id: "signups", label: "Signups", expression: "count(distinct user_id)", rows: 3742, unit: "users" },
  { id: "revenue", label: "Revenue", expression: "sum(amount_usd)", rows: 128460, unit: "dollars" },
] as const;
const QUERY_FILTERS = [
  { id: "all", label: "All users", clause: "true", factor: 1 },
  { id: "pro", label: "Plan: Pro", clause: "plan = 'pro'", factor: 0.42 },
  { id: "us", label: "Country: US", clause: "country = 'us'", factor: 0.56 },
  { id: "mobile", label: "Mobile only", clause: "device = 'mobile'", factor: 0.45 },
] as const;
const QUERY_GROUPS = [
  { id: "day", label: "Day", clause: "day" },
  { id: "week", label: "Week", clause: "week" },
  { id: "source", label: "Source", clause: "source" },
  { id: "device", label: "Device", clause: "device" },
] as const;
type QueryMetricId = (typeof QUERY_METRICS)[number]["id"];
type QueryFilterId = (typeof QUERY_FILTERS)[number]["id"];
type QueryGroupId = (typeof QUERY_GROUPS)[number]["id"];

export function QueryBuilder() {
  const groupId = useId();
  const [metricId, setMetricId] = useState<QueryMetricId>("sessions");
  const [filterId, setFilterId] = useState<QueryFilterId>("pro");
  const [groupBy, setGroupBy] = useState<QueryGroupId>("day");
  const [status, setStatus] = useState<"idle" | "running" | "done">("idle");
  const metric = QUERY_METRICS.find((item) => item.id === metricId) ?? QUERY_METRICS[0];
  const filter = QUERY_FILTERS.find((item) => item.id === filterId) ?? QUERY_FILTERS[0];
  const group = QUERY_GROUPS.find((item) => item.id === groupBy) ?? QUERY_GROUPS[0];
  const rows = Math.round(metric.rows * filter.factor);
  const result =
    metric.id === "revenue" ? `$${number.format(rows)}` : `${number.format(rows)} ${metric.unit}`;
  const query = `select ${metric.expression}\nfrom events where ${filter.clause}\ngroup by ${group.clause}`;
  useEffect(() => {
    if (status !== "running") return;
    const timer = window.setTimeout(() => setStatus("done"), 700);
    return () => window.clearTimeout(timer);
  }, [status]);
  const change = <T,>(setter: (next: T) => void) => (next: T) => {
    setter(next);
    setStatus("idle");
  };
  return (
    <section aria-label="Query builder" className={card}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Query builder</h3>
        <span className="flex items-center gap-1 text-caption-2-regular text-text-tertiary">
          <RiCodeLine className="size-3" aria-hidden />
          events
        </span>
      </div>
      <div className="mt-1.5 grid grid-cols-3 gap-1">
        <label htmlFor={`${groupId}-metric`} className="flex min-w-0 flex-col gap-0.5">
          <span className="text-caption-2-medium text-text-tertiary">Metric</span>
          <select
            id={`${groupId}-metric`}
            value={metricId}
            onChange={(event) => change(setMetricId)(event.target.value as QueryMetricId)}
            className={fieldBase}
          >
            {QUERY_METRICS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor={`${groupId}-filter`} className="flex min-w-0 flex-col gap-0.5">
          <span className="text-caption-2-medium text-text-tertiary">Filter</span>
          <select
            id={`${groupId}-filter`}
            value={filterId}
            onChange={(event) => change(setFilterId)(event.target.value as QueryFilterId)}
            className={fieldBase}
          >
            {QUERY_FILTERS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor={`${groupId}-group`} className="flex min-w-0 flex-col gap-0.5">
          <span className="text-caption-2-medium text-text-tertiary">Group by</span>
          <select
            id={`${groupId}-group`}
            value={groupBy}
            onChange={(event) => change(setGroupBy)(event.target.value as QueryGroupId)}
            className={fieldBase}
          >
            {QUERY_GROUPS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <pre
        key={query}
        dir="ltr"
        className="mt-1.5 animate-label-in overflow-hidden rounded-lg bg-background-secondary-default p-1.5 text-start font-mono text-caption-2-regular whitespace-pre-wrap text-text-secondary motion-reduce:animate-none"
      >
        <code>{query}</code>
      </pre>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span aria-live="polite" className="min-w-0 truncate text-caption-2-regular text-text-tertiary">
          {status === "running" ? "Running on events…" : status === "done" ? `${result} · 0.24s` : "Draft query, not run"}
        </span>
        <button
          type="button"
          disabled={status === "running"}
          onClick={() => setStatus("running")}
          className={cx(primaryButton, "h-6 shrink-0")}
        >
          {status === "running" ? (
            <RiLoader4Line className="size-3 animate-spin motion-reduce:animate-none" aria-hidden />
          ) : (
            <RiPlayLine className="size-3" aria-hidden />
          )}
          {status === "done" ? "Run again" : status === "running" ? "Running" : "Run"}
        </button>
      </div>
    </section>
  );
}

/*  9. Anomaly alert */
const ANOMALY_SERIES = [18, 21, 17, 23, 20, 24, 22, 26, 31, 46, 58, 64];
const ANOMALY_SUSPECTS = [
  { id: "deploy", label: "Deploy #482", tag: "3 min before" },
  { id: "gateway", label: "Payment gateway", tag: "5xx up 6.4×" },
  { id: "ios", label: "iOS 18.2 cohort", tag: "crash +4 pts" },
] as const;
type AnomalyPhase = "idle" | "investigating" | "logged";

export function AnomalyAlert() {
  const [phase, setPhase] = useState<AnomalyPhase>("idle");
  const [suspect, setSuspect] = useState<string | null>(null);
  return (
    <section aria-label="Anomaly alert" className={card}>
      <div className="flex items-center gap-1.5">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-status-orange-background text-status-orange-text">
          <RiAlertLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">Anomaly detected</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">Checkout errors · production</p>
        </div>
        <span className="shrink-0 text-caption-2-regular text-text-tertiary">14m ago</span>
      </div>
      <div key={phase} aria-live="polite" className="animate-label-in motion-reduce:animate-none">
        {phase === "idle" && (
          <>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-title-3-semibold text-text-primary tabular-nums">8.6%</span>
              <span className="text-caption-2-medium text-text-secondary">error rate</span>
              <span className="ms-auto rounded-full bg-status-rose-background px-1.5 py-0.5 text-caption-2-semibold text-status-rose-text tabular-nums">
                +214%
              </span>
            </div>
            <div className="mt-1 flex h-8 items-end gap-0.5" role="img" aria-label="Error rate over the last fourteen minutes, spiking sharply in the final three.">
              {ANOMALY_SERIES.map((value, index) => (
                <span
                  key={index}
                  className={cx(
                    "w-full rounded-sm",
                    index > ANOMALY_SERIES.length - 4 ? "bg-status-rose-text" : "bg-chart-2",
                    "transition-[height,background-color] duration-200 ease-out motion-reduce:transition-none",
                  )}
                  style={{ height: `${(value / 72) * 100}%` }}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPhase("investigating")}
              className={cx(primaryButton, "mt-1.5 h-6 w-full")}
            >
              Investigate
              <RiArrowRightLine className="size-3 rtl:-scale-x-100" aria-hidden />
            </button>
          </>
        )}
        {phase === "investigating" && (
          <>
            <p className="mt-1 text-caption-2-regular text-text-secondary">3 likely causes from the last 30 minutes</p>
            <div role="group" aria-label="Likely causes" className="mt-1 flex flex-col gap-0.5">
              {ANOMALY_SUSPECTS.map((item) => {
                const selected = suspect === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setSuspect(item.id)}
                    className={cx(
                      "flex h-6 items-center gap-1.5 rounded-md px-1.5 text-start",
                      "transition-[background-color] duration-150 ease-out motion-reduce:transition-none",
                      focusRing,
                      selected ? "bg-background-secondary-default" : "hover:bg-background-secondary-default/60",
                    )}
                  >
                    <span className={cx("size-1.5 shrink-0 rounded-full", selected ? "bg-accent-500" : "bg-background-quaternary-default")} aria-hidden />
                    <span className="truncate text-caption-2-semibold text-text-primary">{item.label}</span>
                    <span className="ms-auto shrink-0 text-caption-2-regular text-text-tertiary">{item.tag}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-1.5 flex items-center gap-1.5">
              <button type="button" onClick={() => setPhase("idle")} className={cx(quietButton, "h-6")}>
                Back
              </button>
              <button
                type="button"
                disabled={!suspect}
                onClick={() => setPhase("logged")}
                className={cx(primaryButton, "h-6 flex-1")}
              >
                Open incident
              </button>
            </div>
          </>
        )}
        {phase === "logged" && (
          <>
            <div role="status" className="flex flex-col items-center gap-1 py-2 text-center">
              <span className="flex size-8 items-center justify-center rounded-full bg-status-lime-background text-status-lime-text">
                <RiCheckLine className="size-4" aria-hidden />
              </span>
              <p className="text-body-2-semibold text-text-primary">Incident INC-218 opened</p>
              <p className="text-caption-2-regular text-text-secondary">Paged on-call and linked 3 related events.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setPhase("idle");
                setSuspect(null);
              }}
              className={cx(secondaryButton, "h-6 w-full")}
            >
              Start over
            </button>
          </>
        )}
      </div>
    </section>
  );
}

/*  10. Dashboard filter */
const DATE_RANGES = [
  { id: "7d", label: "7 days", short: "Oct 24 – Oct 30", sessions: 6412, delta: 8.2 },
  { id: "30d", label: "30 days", short: "Oct 1 – Oct 30", sessions: 24810, delta: 12.4 },
  { id: "90d", label: "90 days", short: "Aug 2 – Oct 30", sessions: 71204, delta: 18.1 },
] as const;
type DateRangeId = (typeof DATE_RANGES)[number]["id"];
const DASHBOARD_SEGMENTS = [
  { id: "pro", label: "Pro plan", factor: 0.36 },
  { id: "mobile", label: "Mobile", factor: 0.45 },
  { id: "returning", label: "Returning", factor: 0.25 },
] as const;

export function DashboardFilter() {
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [rangeId, setRangeId] = useState<DateRangeId>("30d");
  const [segments, setSegments] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => {
    setMenuOpen(false);
    triggerRef.current?.focus();
  };
  useEscape(menuOpen, closeMenu);
  useEffect(() => {
    if (!menuOpen) return;
    const dismiss = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [menuOpen]);
  const range = DATE_RANGES.find((item) => item.id === rangeId) ?? DATE_RANGES[1];
  const factor = DASHBOARD_SEGMENTS.filter((item) => segments.includes(item.id)).reduce(
    (total, item) => total * item.factor,
    1,
  );
  const sessions = Math.round((range.sessions * factor) / 10) * 10;
  const labels = DASHBOARD_SEGMENTS.filter((item) => segments.includes(item.id)).map((item) => item.label);
  const toggleSegment = (id: string) => {
    setSegments((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };
  return (
    <section aria-label="Dashboard filters" className={card}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-body-2-semibold text-text-primary">Overview</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">{range.short}</p>
        </div>
        <div ref={menuRef} className="relative shrink-0">
          <button
            ref={triggerRef}
            type="button"
            aria-expanded={menuOpen}
            aria-haspopup="listbox"
            aria-controls={menuOpen ? menuId : undefined}
            onClick={() => setMenuOpen((open) => !open)}
            className={cx(
              "flex h-6 items-center gap-1 rounded-md border border-border-button-default bg-background-primary-default px-1.5 text-caption-2-medium text-text-secondary shadow-xs",
              "transition-[background-color,color] duration-150 ease-out hover:bg-background-primary-hover hover:text-text-primary motion-reduce:transition-none",
              focusRing,
            )}
          >
            <RiCalendarLine className="size-3" aria-hidden />
            {range.label}
            <RiArrowDownSLine
              className={cx("size-3 transition-transform duration-150 ease-out motion-reduce:transition-none", menuOpen && "rotate-180")}
              aria-hidden
            />
          </button>
          {menuOpen && (
            <div
              id={menuId}
              role="listbox"
              aria-label="Date range"
              className={cx(menuSurface, "end-0 top-full w-48 animate-label-in motion-reduce:animate-none")}
            >
              {DATE_RANGES.map((option) => {
                const selected = option.id === rangeId;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      setRangeId(option.id);
                      closeMenu();
                    }}
                    className={cx(menuRow, "h-7 justify-between hover:bg-background-secondary-default", focusRing, selected && "bg-background-secondary-default")}
                  >
                    <span className="truncate text-caption-1-medium">{option.label}</span>
                    <span className="shrink-0 text-caption-2-regular text-text-tertiary">{option.short}</span>
                    {selected && <RiCheckLine className="size-3 shrink-0 text-accent-600" aria-hidden />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="mt-1.5 flex items-baseline gap-1.5">
        <span key={sessions} className="animate-number-fade text-title-3-semibold text-text-primary tabular-nums motion-reduce:animate-none">
          {number.format(sessions)}
        </span>
        <span className="text-caption-2-regular text-text-tertiary">sessions</span>
        <span className="ms-auto inline-flex items-center gap-0.5 rounded-full bg-status-lime-background px-1.5 py-0.5 text-caption-2-semibold text-status-lime-text tabular-nums">
          <RiArrowUpLine className="size-3" aria-hidden />
          {range.delta}%
        </span>
      </div>
      <div role="group" aria-label="Segment filters" className="mt-1.5 flex flex-wrap gap-1">
        <button
          type="button"
          aria-pressed={segments.length === 0}
          onClick={() => setSegments([])}
          className={cx(chipBase, segments.length === 0 ? chipSelected : chipIdle, focusRing)}
        >
          All users
        </button>
        {DASHBOARD_SEGMENTS.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={segments.includes(option.id)}
            onClick={() => toggleSegment(option.id)}
            className={cx(chipBase, segments.includes(option.id) ? chipSelected : chipIdle, focusRing)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p aria-live="polite" className="mt-1 truncate text-caption-2-regular text-text-tertiary">
        {labels.length ? labels.join(" · ") : "All traffic"} · {range.label}
      </p>
    </section>
  );
}

/*  11. Goal tracker */
const GOAL_TARGET = 120000;
const GOAL_EXPECTED = 0.39;
const GOAL_START = 45000;
const GOAL_STEP = 5000;

export function GoalTracker() {
  const [actual, setActual] = useState(GOAL_START);
  const progress = Math.min(100, (actual / GOAL_TARGET) * 100);
  const reached = actual >= GOAL_TARGET;
  const pace = actual - GOAL_TARGET * GOAL_EXPECTED;
  const status = reached ? "Goal reached" : pace >= 500 ? "Ahead of pace" : pace <= -500 ? "Behind pace" : "On pace";
  const tone = reached || pace >= 500
    ? "bg-status-lime-background text-status-lime-text"
    : pace <= -500
      ? "bg-status-yellow-background text-status-yellow-text"
      : "bg-status-blue-background text-status-blue-text";
  return (
    <section aria-label="Q4 pipeline goal" className={card}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Q4 pipeline goal</h3>
        <span className="text-caption-2-regular text-text-tertiary">56 days left</span>
      </div>
      <div className="mt-0.5 flex items-baseline gap-1.5">
        <span key={actual} className="animate-number-fade text-title-3-semibold text-text-primary tabular-nums motion-reduce:animate-none">
          ${number.format(actual)}
        </span>
        <span className="text-caption-2-regular text-text-tertiary">of ${number.format(GOAL_TARGET)}</span>
        <span className="ms-auto text-caption-2-semibold text-text-secondary tabular-nums">{Math.round(progress)}%</span>
      </div>
      <div
        role="progressbar"
        aria-label="Pipeline toward Q4 goal"
        aria-valuemin={0}
        aria-valuemax={GOAL_TARGET}
        aria-valuenow={actual}
        aria-valuetext={`$${number.format(actual)} of $${number.format(GOAL_TARGET)}`}
        className="relative mt-1.5 h-2 overflow-hidden rounded-full bg-background-tertiary-default"
      >
        <div
          className={cx(
            "h-full rounded-full transition-[width,background-color] duration-200 ease-out motion-reduce:transition-none",
            reached ? "bg-status-lime-text" : "bg-chart-1",
          )}
          style={{ width: `${progress}%` }}
        />
        <span aria-hidden className="absolute inset-y-0 w-px bg-separator-border-strong" style={{ insetInlineStart: `${GOAL_EXPECTED * 100}%` }} />
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span aria-live="polite" className={cx("inline-flex h-6 items-center rounded-full px-1.5 text-caption-2-semibold", tone)}>
          {status}
        </span>
        <div className="flex items-center gap-1">
          <button type="button" aria-label="Reset goal progress" onClick={() => setActual(GOAL_START)} className={iconButton}>
            <RiRefreshLine className="size-3" aria-hidden />
          </button>
          <button
            type="button"
            disabled={reached}
            onClick={() => setActual((current) => Math.min(GOAL_TARGET, current + GOAL_STEP))}
            className={cx(primaryButton, "h-6")}
          >
            {reached ? (
              <>
                <RiCheckLine className="size-3" aria-hidden />
                Complete
              </>
            ) : (
              <>
                <RiAddLine className="size-3" aria-hidden />
                Log $5k
              </>
            )}
          </button>
        </div>
      </div>
      <p className="mt-1 text-caption-2-regular text-text-tertiary">
        Expected ${number.format(GOAL_TARGET * GOAL_EXPECTED)} by Nov 5 · marker at 39%
      </p>
    </section>
  );
}

/*  12. Event stream */
type EventFamily = "checkout" | "auth" | "account";
type StreamEvent = {
  id: string;
  name: string;
  family: EventFamily;
  props: { label: string; value: string }[];
};
const EVENT_FAMILY_META: Record<EventFamily, { label: string; dot: string }> = {
  checkout: { label: "Checkout", dot: "bg-chart-1" },
  auth: { label: "Auth", dot: "bg-chart-4" },
  account: { label: "Account", dot: "bg-chart-5" },
};
const EVENT_POOL: StreamEvent[] = [
  { id: "p1", name: "checkout_completed", family: "checkout", props: [{ label: "order", value: "$148.00" }, { label: "plan", value: "Pro" }, { label: "source", value: "web" }] },
  { id: "p2", name: "signup_completed", family: "auth", props: [{ label: "method", value: "Google" }, { label: "plan", value: "Trial" }] },
  { id: "p3", name: "checkout_failed", family: "checkout", props: [{ label: "reason", value: "card_declined" }, { label: "amount", value: "$64.00" }] },
  { id: "p4", name: "session_started", family: "auth", props: [{ label: "device", value: "iOS 18.2" }, { label: "country", value: "US" }] },
  { id: "p5", name: "plan_upgraded", family: "account", props: [{ label: "from", value: "Team" }, { label: "to", value: "Business" }] },
  { id: "p6", name: "invoice_paid", family: "checkout", props: [{ label: "amount", value: "$1,240.00" }, { label: "method", value: "ACH" }] },
  { id: "p7", name: "password_reset", family: "auth", props: [{ label: "channel", value: "email" }] },
];
const EVENT_AGES = ["just now", "3s ago", "6s ago", "9s ago", "12s ago"];
type EventFilter = "all" | EventFamily;

export function EventStream() {
  const [events, setEvents] = useState<StreamEvent[]>(EVENT_POOL.slice(0, 4));
  const [filter, setFilter] = useState<EventFilter>("all");
  const [live, setLive] = useState(true);
  const [selectedId, setSelectedId] = useState("p1");
  const cursor = useRef(4);
  useEffect(() => {
    if (!live) return;
    const timer = window.setInterval(() => {
      const next = EVENT_POOL[cursor.current % EVENT_POOL.length];
      const index = cursor.current;
      cursor.current += 1;
      setEvents((current) => [{ ...next, id: `${next.id}-${index}` }, ...current].slice(0, 4));
    }, 2800);
    return () => window.clearInterval(timer);
  }, [live]);
  const visible = filter === "all" ? events : events.filter((event) => event.family === filter);
  const selected = visible.find((event) => event.id === selectedId) ?? visible[0];
  return (
    <section aria-label="Recent product events" className={card}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <h3 className="shrink-0 text-body-2-semibold text-text-primary">Event stream</h3>
          <span className="inline-flex h-5 items-center gap-1 rounded-full bg-background-secondary-default px-1.5 text-caption-2-medium text-text-tertiary">
            <span
              className={cx(
                "size-1.5 rounded-full",
                live ? "animate-pulse bg-status-lime-text motion-reduce:animate-none" : "bg-background-quaternary-default",
              )}
            />
            {live ? "Live" : "Paused"}
          </span>
        </div>
        <button
          type="button"
          aria-pressed={!live}
          aria-label={live ? "Pause event stream" : "Resume event stream"}
          onClick={() => setLive((value) => !value)}
          className={iconButton}
        >
          {live ? <RiPauseLine className="size-3" aria-hidden /> : <RiPlayLine className="size-3" aria-hidden />}
        </button>
      </div>
      <div role="group" aria-label="Filter events" className="mt-1.5 flex items-center gap-1">
        <button type="button" aria-pressed={filter === "all"} onClick={() => setFilter("all")} className={cx(chipBase, "h-5 px-1.5", filter === "all" ? chipSelected : chipIdle, focusRing)}>
          All
        </button>
        {(Object.keys(EVENT_FAMILY_META) as EventFamily[]).map((family) => (
          <button
            key={family}
            type="button"
            aria-pressed={filter === family}
            onClick={() => setFilter(family)}
            className={cx(chipBase, "h-5 px-1.5", filter === family ? chipSelected : chipIdle, focusRing)}
          >
            {EVENT_FAMILY_META[family].label}
          </button>
        ))}
      </div>
      <div role="group" aria-label="Recent events" className="mt-1 flex flex-col gap-0.5">
        {visible.map((event) => {
          const position = events.indexOf(event);
          const age = EVENT_AGES[position] ?? "2m ago";
          const isSelected = selected?.id === event.id;
          return (
            <button
              key={event.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedId(event.id)}
              className={cx(
                "flex h-6 animate-label-in items-center gap-1.5 rounded-md px-1 text-start motion-reduce:animate-none",
                "transition-[background-color] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                isSelected ? "bg-background-secondary-default" : "hover:bg-background-secondary-default/60",
              )}
            >
              <span className={cx("size-1.5 shrink-0 rounded-full", EVENT_FAMILY_META[event.family].dot)} aria-hidden />
              <span dir="ltr" className="min-w-0 flex-1 truncate text-start font-mono text-caption-2-medium text-text-primary">
                {event.name}
              </span>
              <span className="shrink-0 rounded-sm bg-background-tertiary-default px-1 text-caption-2-regular text-text-tertiary">
                {event.props[0]?.value}
              </span>
              <span className="w-9 shrink-0 text-end text-caption-2-regular text-text-tertiary tabular-nums">{age}</span>
            </button>
          );
        })}
        {visible.length === 0 && (
          <p className="flex h-6 items-center text-caption-2-regular text-text-tertiary">No {EVENT_FAMILY_META[filter as EventFamily]?.label.toLowerCase()} events yet.</p>
        )}
      </div>
      <p aria-live="polite" dir="ltr" className="mt-1 min-h-4 truncate text-start font-mono text-caption-2-regular text-text-tertiary">
        {selected ? selected.props.map((property) => `${property.label}=${property.value}`).join(" · ") : "Select an event to inspect properties"}
      </p>
    </section>
  );
}

/*  Specimens */
export const ANALYTICS_SECTION: ExtendedSection = {
  id: "analytics",
  title: "Analytics",
  blurb: "Funnels, cohorts and the shape of a question.",
  file: "analytics.tsx",
  entries: [
    { name: "Funnel Chart", description: "Four funnel stages with conversion, drop-off and a selectable detail.", Demo: FunnelChart },
    { name: "Cohort Grid", description: "Weekly retention by cohort, colour-scaled and inspectable.", Demo: CohortGrid },
    { name: "Segment Builder", description: "Add conditions, change values and watch the audience shrink.", Demo: SegmentBuilder },
    { name: "Retention Curve", description: "Two quarters of weekly retention with a movable week guide.", Demo: RetentionCurve },
    { name: "Compare Toggle", description: "Flip between this period and the last; totals and bars follow.", Demo: CompareToggle },
    { name: "Attribution Row", description: "Channels, conversions and share under two attribution models.", Demo: AttributionRow },
    { name: "Report Scheduler", description: "Frequency, recipients and the next send, with a working test send.", Demo: ReportScheduler },
    { name: "Query Builder", description: "Metric, filter and group by compile into a query that runs.", Demo: QueryBuilder },
    { name: "Anomaly Alert", description: "A detected spike with suspects and an incident action.", Demo: AnomalyAlert },
    { name: "Dashboard Filter", description: "A date range menu and segment chips that recompute the total.", Demo: DashboardFilter },
    { name: "Goal Tracker", description: "Target, actual and pace, with a logging action that moves the bar.", Demo: GoalTracker },
    { name: "Event Stream", description: "Recent events with properties, family filters and pause control.", Demo: EventStream },
  ],
};
