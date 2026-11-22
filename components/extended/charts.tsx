"use client";

import { useId, useState } from "react";
import {
  RiAddLine,
  RiArrowDownLine,
  RiArrowRightUpLine,
  RiArrowUpLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* -------------------------------------------------------------------------- */
/*  Shared                                                                     */
/* -------------------------------------------------------------------------- */

const number = new Intl.NumberFormat("en-US");

const card =
  "w-full max-w-[320px] rounded-xl border border-border-button-default bg-background-primary-default p-3 shadow-xs";

const chip =
  "inline-flex items-center gap-0.5 rounded-sm px-1 py-px text-caption-2-semibold tabular-nums";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";

type Point = { x: number; y: number };

const round = (value: number) => Math.round(value * 100) / 100;

/** Map a series onto the drawing box, top edge high, bottom edge low. */
function buildPoints(values: number[], width: number, top: number, bottom: number, padX: number): Point[] {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const stepX = values.length > 1 ? (width - padX * 2) / (values.length - 1) : 0;

  return values.map((value, index) => ({
    x: padX + index * stepX,
    y: bottom - ((value - min) / span) * (bottom - top),
  }));
}

/** Catmull-Rom to cubic bezier, kept gentle so peaks do not overshoot the box. */
function buildSmoothPath(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${round(points[0].x)} ${round(points[0].y)}`;

  let path = `M ${round(points[0].x)} ${round(points[0].y)}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[index - 1] ?? points[index];
    const current = points[index];
    const next = points[index + 1];
    const after = points[index + 2] ?? next;

    const control1x = current.x + (next.x - previous.x) / 6;
    const control1y = current.y + (next.y - previous.y) / 6;
    const control2x = next.x - (after.x - current.x) / 6;
    const control2y = next.y - (after.y - current.y) / 6;

    path += ` C ${round(control1x)} ${round(control1y)} ${round(control2x)} ${round(control2y)} ${round(next.x)} ${round(next.y)}`;
  }
  return path;
}

/* -------------------------------------------------------------------------- */
/*  Sparkline                                                                  */
/* -------------------------------------------------------------------------- */

const SPARK_RANGES = [
  {
    id: "7d",
    label: "7d",
    caption: "Last 7 days",
    previous: "328",
    delta: 8.5,
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [41, 38, 47, 52, 49, 61, 68],
  },
  {
    id: "30d",
    label: "30d",
    caption: "Last 30 days",
    previous: "1,053",
    delta: 24.5,
    labels: ["Sep 8", "Sep 11", "Sep 14", "Sep 17", "Sep 20", "Sep 23", "Sep 26", "Sep 29", "Oct 2", "Oct 5"],
    values: [96, 112, 104, 121, 118, 142, 133, 148, 157, 180],
  },
  {
    id: "90d",
    label: "90d",
    caption: "Last 90 days",
    previous: "3,988",
    delta: 18.9,
    labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"],
    values: [312, 298, 341, 366, 354, 401, 389, 432, 418, 451, 474, 506],
  },
];

export function Sparkline() {
  const rawId = useId();
  const gradientId = `spark-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [rangeId, setRangeId] = useState("30d");

  const range = SPARK_RANGES.find((option) => option.id === rangeId) ?? SPARK_RANGES[1];
  const total = range.values.reduce((sum, value) => sum + value, 0);
  const points = buildPoints(range.values, 296, 12, 72, 10);
  const linePath = buildSmoothPath(points);
  const first = points[0];
  const last = points[points.length - 1];
  const areaPath = `${linePath} L ${round(last.x)} 80 L ${round(first.x)} 80 Z`;

  return (
    <div className={card}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-caption-1-medium text-text-tertiary">
            Signups · {range.caption.toLowerCase()}
          </span>
          <span className="text-title-3-semibold text-text-primary tabular-nums">
            {number.format(total)}
          </span>
        </div>
        <span className={cx(chip, "bg-status-lime-background text-status-lime-text")}>
          <RiArrowUpLine className="size-3" aria-hidden />
          {range.delta.toFixed(1)}%
        </span>
      </div>

      <svg
        viewBox="0 0 296 84"
        className="mt-2 h-auto w-full cursor-crosshair"
        role="img"
        aria-label={`Signups ${range.caption.toLowerCase()}: ${number.format(total)} total, up ${range.delta.toFixed(1)} percent versus the previous period.`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.28} />
            <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>

        <line x1="10" y1="80" x2="286" y2="80" stroke="currentColor" strokeWidth="1" className="text-separator-border" />
        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path
          d={linePath}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-chart-1"
        />

        {points.map((point, index) => (
          <g key={range.labels[index]} className="group/point">
            <line
              x1={round(point.x)}
              y1="12"
              x2={round(point.x)}
              y2="80"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2 3"
              className="text-chart-1 opacity-0 transition-opacity duration-150 group-hover/point:opacity-40"
            />
            <circle
              cx={round(point.x)}
              cy={round(point.y)}
              r="3.2"
              fill="currentColor"
              className="text-chart-1 opacity-0 transition-opacity duration-150 group-hover/point:opacity-100"
            />
            <circle cx={round(point.x)} cy={round(point.y)} r="9" fill="none" pointerEvents="all">
              <title>{`${range.labels[index]} · ${number.format(range.values[index])} signups`}</title>
            </circle>
          </g>
        ))}

        <circle cx={round(last.x)} cy={round(last.y)} r="6" fill="currentColor" pointerEvents="none" className="text-chart-1 opacity-20" />
        <circle cx={round(last.x)} cy={round(last.y)} r="3.2" fill="currentColor" pointerEvents="none" className="text-chart-1" />
      </svg>

      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-caption-2-regular text-text-tertiary">vs. {range.previous} previous</span>
        <div className="flex items-center gap-0.5 rounded-md bg-background-tertiary-default p-0.5" role="group" aria-label="Sparkline range">
          {SPARK_RANGES.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={option.id === range.id}
              aria-label={`Show ${option.caption.toLowerCase()}`}
              onClick={() => setRangeId(option.id)}
              className={cx(
                "h-5 rounded-sm px-1.5 text-caption-2-semibold transition-colors duration-150 ease",
                focusRing,
                option.id === range.id
                  ? "bg-background-primary-default text-text-primary shadow-xs"
                  : "text-text-tertiary hover:text-text-secondary",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mini bar series                                                            */
/* -------------------------------------------------------------------------- */

const MONTHLY = [
  { month: "Jan", value: 42 },
  { month: "Feb", value: 51 },
  { month: "Mar", value: 47 },
  { month: "Apr", value: 63 },
  { month: "May", value: 58 },
  { month: "Jun", value: 71 },
  { month: "Jul", value: 69 },
  { month: "Aug", value: 84 },
  { month: "Sep", value: 78 },
  { month: "Oct", value: 92 },
  { month: "Nov", value: 88 },
  { month: "Dec", value: 104 },
];

const MONTHLY_TOTAL = MONTHLY.reduce((sum, month) => sum + month.value, 0);
const MONTHLY_AVERAGE = MONTHLY_TOTAL / MONTHLY.length;
const MONTHLY_MAX = Math.max(...MONTHLY.map((month) => month.value));
const AVERAGE_PCT = (MONTHLY_AVERAGE / MONTHLY_MAX) * 100;

export function MiniBarSeries() {
  const [active, setActive] = useState(MONTHLY.length - 1);
  const month = MONTHLY[active];

  return (
    <div className={card}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-caption-1-medium text-text-tertiary">Monthly revenue</span>
        <span className="text-caption-2-regular text-text-tertiary tabular-nums">FY26 · ${MONTHLY_TOTAL}k</span>
      </div>
      <div className="mt-0.5 flex items-baseline gap-1.5">
        <span className="text-title-3-semibold text-text-primary tabular-nums">${month.value}k</span>
        <span className="text-caption-1-regular text-text-tertiary">{month.month} 2026</span>
      </div>

      <div className="relative mt-2.5 h-24" onMouseLeave={() => setActive(MONTHLY.length - 1)}>
        <div className="flex h-full items-end gap-1">
          {MONTHLY.map((entry, index) => {
            const isActive = index === active;
            return (
              <button
                key={entry.month}
                type="button"
                aria-label={`${entry.month} 2026 revenue: ${entry.value} thousand dollars`}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                className={cx(
                  "group flex h-full flex-1 items-end justify-center rounded-sm",
                  focusRing,
                )}
              >
                <span
                  aria-hidden
                  style={{ height: `${(entry.value / MONTHLY_MAX) * 100}%` }}
                  className={cx(
                    "w-full rounded-t-sm transition-[background-color] duration-150 ease",
                    isActive ? "bg-chart-2" : "bg-chart-2/45 group-hover:bg-chart-2/75",
                  )}
                />
              </button>
            );
          })}
        </div>

        <div className="pointer-events-none absolute inset-x-0" style={{ bottom: `${AVERAGE_PCT}%` }}>
          <div className="border-t border-dashed border-text-tertiary/60" />
          <span className="absolute start-0 -top-4 bg-background-primary-default pe-1 text-caption-2-regular text-text-tertiary tabular-nums">
            avg ${MONTHLY_AVERAGE.toFixed(1)}k
          </span>
        </div>
      </div>

      <div className="mt-1.5 flex justify-between text-caption-2-regular text-text-tertiary">
        <span>Jan 2026</span>
        <span>Dec 2026</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Donut breakdown                                                            */
/* -------------------------------------------------------------------------- */

const DONUT_CIRCUMFERENCE = 2 * Math.PI * 48;
const DONUT_GAP = 3;

const DONUT_SOURCES = [
  { label: "Direct", value: 18420, tone: "text-chart-1", dot: "bg-chart-1" },
  { label: "Search", value: 10830, tone: "text-chart-2", dot: "bg-chart-2" },
  { label: "Social", value: 6810, tone: "text-chart-3", dot: "bg-chart-3" },
  { label: "Referral", value: 4020, tone: "text-chart-4", dot: "bg-chart-4" },
];

const DONUT_TOTAL = DONUT_SOURCES.reduce((sum, source) => sum + source.value, 0);

let donutCursor = 0;
const DONUT_ARCS = DONUT_SOURCES.map((source) => {
  const length = (source.value / DONUT_TOTAL) * DONUT_CIRCUMFERENCE;
  const arc = {
    ...source,
    share: Math.round((source.value / DONUT_TOTAL) * 100),
    length,
    offset: donutCursor,
  };
  donutCursor += length;
  return arc;
});

export function DonutBreakdown() {
  const [active, setActive] = useState<number | null>(null);
  const selected = active === null ? null : DONUT_ARCS[active];

  return (
    <div className={card}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-body-2-semibold text-text-primary">Traffic sources</span>
        <span className="text-caption-2-regular text-text-tertiary">Last 30 days</span>
      </div>

      <div className="mt-2 flex items-center gap-3">
        <div
          className="relative size-[116px] shrink-0"
          role="img"
          aria-label={`Traffic sources: ${DONUT_ARCS.map((source) => `${source.label} ${source.share} percent`).join(", ")}.`}
        >
          <svg viewBox="0 0 128 128" className="size-full -rotate-90" aria-hidden>
            <circle
              cx="64"
              cy="64"
              r="48"
              fill="none"
              stroke="currentColor"
              strokeWidth="13"
              className="text-background-tertiary-default"
            />
            {DONUT_ARCS.map((source, index) => {
              const dash = round(source.length - DONUT_GAP);
              return (
                <circle
                  key={source.label}
                  cx="64"
                  cy="64"
                  r="48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="13"
                  strokeDasharray={`${dash} ${round(DONUT_CIRCUMFERENCE - dash)}`}
                  strokeDashoffset={round(-source.offset)}
                  className={cx(
                    source.tone,
                    "transition-opacity duration-200 ease",
                    active !== null && active !== index && "opacity-40",
                  )}
                />
              );
            })}
          </svg>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-center">
            <span className="text-caption-2-regular text-text-tertiary">
              {selected ? selected.label : "Total"}
            </span>
            <span className="text-title-3-semibold text-text-primary tabular-nums">
              {number.format(selected ? selected.value : DONUT_TOTAL)}
            </span>
            <span className="text-caption-2-regular text-text-tertiary">
              {selected ? `${selected.share}% share` : "sessions"}
            </span>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {DONUT_ARCS.map((source, index) => (
            <button
              key={source.label}
              type="button"
              aria-pressed={active === index}
              aria-label={`${source.label}: ${number.format(source.value)} sessions, ${source.share} percent`}
              onClick={() => setActive((current) => (current === index ? null : index))}
              className={cx(
                "flex w-full items-center gap-1.5 rounded-md px-1 py-1 text-start transition-colors duration-150 ease",
                focusRing,
                active === index ? "bg-background-tertiary-default" : "hover:bg-background-secondary-hover",
              )}
            >
              <span aria-hidden className={cx("size-2 shrink-0 rounded-full", source.dot)} />
              <span className="min-w-0 flex-1 truncate text-caption-1-medium text-text-secondary">{source.label}</span>
              <span className="shrink-0 text-caption-2-regular text-text-tertiary tabular-nums">
                {number.format(source.value)}
              </span>
              <span className="w-7 shrink-0 text-end text-caption-1-semibold text-text-primary tabular-nums">
                {source.share}%
              </span>
            </button>
          ))}
        </div>
      </div>

      <p className="mt-2 text-caption-2-regular text-text-tertiary">Select a source to isolate its slice.</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Heatmap grid                                                               */
/* -------------------------------------------------------------------------- */

const HEATMAP_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Seven weekdays by twelve weeks, in sessions. Fixed data, fixed layout. */
const HEATMAP_DATA = [
  [0, 2, 4, 6, 3, 8, 5, 9, 4, 7, 10, 6],
  [1, 3, 5, 2, 7, 6, 9, 4, 8, 5, 11, 7],
  [2, 0, 6, 4, 5, 9, 3, 7, 6, 8, 4, 9],
  [3, 5, 2, 7, 8, 4, 6, 10, 5, 9, 7, 4],
  [4, 6, 7, 3, 9, 5, 8, 6, 10, 4, 12, 8],
  [1, 2, 0, 3, 2, 4, 5, 2, 3, 1, 4, 2],
  [0, 1, 2, 0, 1, 3, 2, 4, 1, 2, 3, 5],
];

const HEATMAP_TOTAL = HEATMAP_DATA.flat().reduce((sum, value) => sum + value, 0);
const HEATMAP_PEAK = Math.max(...HEATMAP_DATA.flat());

const HEAT_CELL = 26;
const HEAT_GAP = 5;
const HEAT_LABEL = 28;
const HEAT_TOP = 8;
const HEAT_WIDTH = HEAT_LABEL + 12 * HEAT_CELL + 11 * HEAT_GAP;
const HEAT_HEIGHT = HEAT_TOP + 7 * HEAT_CELL + 6 * HEAT_GAP;

const HEAT_LEVELS = [
  "text-background-tertiary-default",
  "text-chart-1/25",
  "text-chart-1/45",
  "text-chart-1/70",
  "text-chart-1",
];

const HEAT_SWATCHES = [
  "bg-background-tertiary-default",
  "bg-chart-1/25",
  "bg-chart-1/45",
  "bg-chart-1/70",
  "bg-chart-1",
];

function heatLevel(value: number) {
  if (value === 0) return 0;
  if (value <= 3) return 1;
  if (value <= 6) return 2;
  if (value <= 9) return 3;
  return 4;
}

export function HeatmapGrid() {
  return (
    <div className={cx(card, "max-w-[420px]")}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-body-2-semibold text-text-primary">Contribution activity</span>
        <span className="text-caption-2-regular text-text-tertiary tabular-nums">
          {number.format(HEATMAP_TOTAL)} sessions
        </span>
      </div>
      <p className="text-caption-2-regular text-text-tertiary">Last 12 weeks · Monday to Sunday</p>

      <svg
        viewBox={`0 0 ${HEAT_WIDTH} ${HEAT_HEIGHT}`}
        className="mt-2 h-auto w-full overflow-visible"
        role="img"
        aria-label={`Contribution activity for the last 12 weeks: ${HEATMAP_TOTAL} sessions, with a peak of ${HEATMAP_PEAK} in one day.`}
      >
        {HEATMAP_DAYS.map((day, row) =>
          row === 0 || row === 2 || row === 4 ? (
            <text
              key={day}
              x="0"
              y={HEAT_TOP + row * (HEAT_CELL + HEAT_GAP) + HEAT_CELL / 2}
              dominantBaseline="middle"
              textAnchor="start"
              className="fill-current text-caption-2-regular text-text-tertiary"
            >
              {day}
            </text>
          ) : null,
        )}

        {HEATMAP_DATA.map((week, row) =>
          week.map((value, column) => {
            const level = heatLevel(value);
            return (
              <rect
                key={`${HEATMAP_DAYS[row]}-${column}`}
                x={HEAT_LABEL + column * (HEAT_CELL + HEAT_GAP)}
                y={HEAT_TOP + row * (HEAT_CELL + HEAT_GAP)}
                width={HEAT_CELL}
                height={HEAT_CELL}
                rx="4"
                fill="currentColor"
                stroke="none"
                strokeWidth="2"
                className={cx(
                  HEAT_LEVELS[level],
                  "transition-[stroke] duration-150 ease hover:stroke-text-primary",
                )}
              >
                <title>{`${HEATMAP_DAYS[row]} · week ${column + 1}: ${value} ${value === 1 ? "session" : "sessions"}`}</title>
              </rect>
            );
          }),
        )}
      </svg>

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-caption-2-regular text-text-tertiary">Less</span>
          <div className="flex items-center gap-1" aria-hidden>
            {HEAT_SWATCHES.map((swatch) => (
              <span key={swatch} className={cx("size-2.5 rounded-xs", swatch)} />
            ))}
          </div>
          <span className="text-caption-2-regular text-text-tertiary">More</span>
        </div>
        <span className="text-caption-2-regular text-text-tertiary tabular-nums">Peak {HEATMAP_PEAK}/day</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Gauge dial                                                                 */
/* -------------------------------------------------------------------------- */

const GAUGE_CX = 100;
const GAUGE_CY = 92;
const GAUGE_RADIUS = 72;
const GAUGE_START = 150;
const GAUGE_SWEEP = 240;
const GAUGE_MAX = 100;
const GAUGE_TARGET = 80;

function polar(radius: number, degrees: number): Point {
  const radians = (degrees * Math.PI) / 180;
  return {
    x: GAUGE_CX + radius * Math.cos(radians),
    y: GAUGE_CY + radius * Math.sin(radians),
  };
}

function gaugeArc(sweep: number) {
  const start = polar(GAUGE_RADIUS, GAUGE_START);
  const end = polar(GAUGE_RADIUS, GAUGE_START + sweep);
  const largeArc = sweep > 180 ? 1 : 0;
  return `M ${round(start.x)} ${round(start.y)} A ${GAUGE_RADIUS} ${GAUGE_RADIUS} 0 ${largeArc} 1 ${round(end.x)} ${round(end.y)}`;
}

const GAUGE_TRACK = gaugeArc(GAUGE_SWEEP);
const GAUGE_TARGET_ANGLE = GAUGE_START + (GAUGE_SWEEP * GAUGE_TARGET) / GAUGE_MAX;
const GAUGE_TARGET_INNER = polar(64, GAUGE_TARGET_ANGLE);
const GAUGE_TARGET_OUTER = polar(80, GAUGE_TARGET_ANGLE);

export function GaugeDial() {
  const [used, setUsed] = useState(68.4);
  const sweep = (GAUGE_SWEEP * used) / GAUGE_MAX;
  const over = used >= GAUGE_TARGET;
  const headroom = Math.abs(GAUGE_TARGET - used);

  return (
    <div className={card}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-body-2-semibold text-text-primary">Storage used</span>
          <span className="text-caption-2-regular text-text-tertiary">eu-west-1 · 100 GB plan</span>
        </div>
        <button
          type="button"
          aria-label="Add 5 GB of simulated storage"
          disabled={used >= GAUGE_MAX}
          onClick={() => setUsed((current) => Math.min(GAUGE_MAX, round(current + 5)))}
          className={cx(
            "inline-flex h-6 shrink-0 items-center gap-0.5 rounded-md border border-border-button-default bg-background-primary-default px-1.5 text-caption-2-semibold text-text-secondary shadow-xs",
            "transition-colors duration-150 ease hover:bg-background-primary-hover hover:text-text-primary",
            "disabled:pointer-events-none disabled:opacity-50",
            focusRing,
          )}
        >
          <RiAddLine className="size-3" aria-hidden />
          5 GB
        </button>
      </div>

      <svg
        viewBox="0 0 200 140"
        className="mx-auto mt-1 h-auto w-full max-w-[240px]"
        role="img"
        aria-label={`Storage used: ${used.toFixed(1)} of 100 gigabytes. Warning threshold at 80 gigabytes.`}
      >
        <path
          d={GAUGE_TRACK}
          fill="none"
          stroke="currentColor"
          strokeWidth="11"
          strokeLinecap="round"
          className="text-background-tertiary-default"
        />
        <path
          d={gaugeArc(Math.max(0.01, sweep))}
          fill="none"
          stroke="currentColor"
          strokeWidth="11"
          strokeLinecap="round"
          className={cx("transition-colors duration-300 ease", over ? "text-status-orange-text" : "text-chart-1")}
        />
        <line
          x1={round(GAUGE_TARGET_INNER.x)}
          y1={round(GAUGE_TARGET_INNER.y)}
          x2={round(GAUGE_TARGET_OUTER.x)}
          y2={round(GAUGE_TARGET_OUTER.y)}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-text-secondary"
        />

        <text x="100" y="80" textAnchor="middle" className="fill-current text-title-3-semibold text-text-primary tabular-nums">
          {used.toFixed(1)} GB
        </text>
        <text x="100" y="96" textAnchor="middle" className="fill-current text-caption-2-regular text-text-tertiary">
          of 100 GB
        </text>
      </svg>

      <p
        className={cx(
          "mt-1 flex items-start gap-1.5 text-caption-1-regular",
          over ? "text-status-orange-text" : "text-text-tertiary",
        )}
      >
        <span
          aria-hidden
          className={cx("mt-1 size-1.5 shrink-0 rounded-full", over ? "bg-status-orange-text" : "bg-chart-1")}
        />
        {over
          ? `Threshold crossed · ${headroom.toFixed(1)} GB over the ${GAUGE_TARGET} GB warn line`
          : `Warn at ${GAUGE_TARGET} GB · ${headroom.toFixed(1)} GB headroom`}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Trend delta                                                                */
/* -------------------------------------------------------------------------- */

const TREND_BARS = [58, 64, 61, 72, 69, 78, 84];
const TREND_MAX = Math.max(...TREND_BARS);

export function TrendDelta() {
  const delta = 18.2;
  const up = delta >= 0;

  return (
    <div className={card}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-caption-1-medium text-text-tertiary">Weekly active players</span>
        <button
          type="button"
          aria-label="Open the player activity report"
          className={cx(
            "inline-flex shrink-0 items-center gap-0.5 rounded-sm text-caption-2-semibold text-text-secondary transition-colors duration-150 ease hover:text-text-primary",
            focusRing,
          )}
        >
          Report
          <RiArrowRightUpLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
        </button>
      </div>

      <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-title-1-semibold text-text-primary tabular-nums">24,860</span>
        <span
          className={cx(
            chip,
            up ? "bg-status-lime-background text-status-lime-text" : "bg-status-rose-background text-status-rose-text",
          )}
        >
          {up ? <RiArrowUpLine className="size-3" aria-hidden /> : <RiArrowDownLine className="size-3" aria-hidden />}
          {Math.abs(delta)}%
        </span>
      </div>
      <p className="text-caption-1-regular text-text-tertiary">vs. 21,034 last week</p>

      <div className="mt-3 flex h-7 items-end gap-1" aria-hidden>
        {TREND_BARS.map((value, index) => (
          <span
            key={`${value}-${index}`}
            style={{ height: `${(value / TREND_MAX) * 100}%` }}
            className={cx(
              "flex-1 rounded-sm",
              index === TREND_BARS.length - 1 ? "bg-chart-5" : "bg-chart-5/40",
            )}
          />
        ))}
      </div>
      <div className="mt-1 flex justify-between text-caption-2-regular text-text-tertiary">
        <span>Mon</span>
        <span>Sun</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Specimens                                                                  */
/* -------------------------------------------------------------------------- */

export const CHARTS_SECTION: ExtendedSection = {
  id: "charts",
  title: "Charts",
  blurb: "Small, honest charts that read at a glance and need no charting library.",
  file: "charts.tsx",
  entries: [
    { name: "Sparkline", description: "A trend line with a soft fill, delta and per-point tooltips.", Demo: Sparkline },
    { name: "Mini Bar Series", description: "Twelve months, an average rule and a live readout.", Demo: MiniBarSeries },
    { name: "Donut Breakdown", description: "Four sources, a centered total and a selectable legend.", Demo: DonutBreakdown },
    { name: "Heatmap Grid", description: "Twelve weeks of daily activity on an intensity ramp.", Demo: HeatmapGrid, wide: true },
    { name: "Gauge Dial", description: "A 240° arc with a target tick and a live threshold note.", Demo: GaugeDial },
    { name: "Trend Delta", description: "A headline number, its change and a seven-day bar row.", Demo: TrendDelta },
  ],
};
