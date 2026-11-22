"use client";

import { useId, useState } from "react";
import type { ComponentType, KeyboardEvent, ReactNode } from "react";
import {
  RiArrowDownSLine,
  RiArrowRightLine,
  RiArrowUpLine,
  RiBikeLine,
  RiBookmarkFill,
  RiBookmarkLine,
  RiBookOpenLine,
  RiBuildingLine,
  RiBusLine,
  RiCarLine,
  RiCheckLine,
  RiCloseLine,
  RiCompass3Line,
  RiCupLine,
  RiErrorWarningLine,
  RiFlag2Line,
  RiMapPinLine,
  RiNavigationLine,
  RiRoadMapLine,
  RiRouteLine,
  RiSearchLine,
  RiStarFill,
  RiStore2Line,
  RiTimeLine,
  RiTrafficLightLine,
  RiTreeLine,
  RiWalkLine,
} from "@remixicon/react";
import { Input } from "@/components/base/input/input";
import { Slider } from "@/components/base/slider/slider";
import { Switch } from "@/components/base/switch/switch";
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
  "inline-flex shrink-0 items-center justify-center gap-1 rounded-lg text-caption-1-semibold " +
  "transition-[transform,background-color,color,box-shadow,border-color,opacity] duration-150 ease-out " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 " +
  "motion-reduce:transition-none motion-reduce:active:scale-100";
const primaryButton = cx(buttonBase, "h-7 bg-button-primary px-2.5 text-text-white shadow-xs", focusRing);
const secondaryButton = cx(
  buttonBase,
  "h-7 border border-border-button-default bg-background-primary-default px-2.5 text-text-primary shadow-xs hover:bg-background-primary-hover",
  focusRing,
);
const quietButton = cx(
  buttonBase,
  "h-6 px-1.5 text-caption-2-semibold text-text-secondary hover:bg-background-secondary-default hover:text-text-primary",
  focusRing,
);
const iconButton = cx(
  "flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-icon-tertiary",
  "transition-[background-color,color] duration-150 ease-out hover:bg-background-secondary-default hover:text-text-primary",
  "motion-reduce:transition-none",
  focusRing,
);
const reveal = "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none";

type Tone = "neutral" | "green" | "blue" | "rose";

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-background-secondary-default text-text-secondary",
  green: "bg-status-lime-background text-status-lime-text",
  blue: "bg-status-blue-background text-status-blue-text",
  rose: "bg-status-rose-background text-status-rose-text",
};

function Tag({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={cx("inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-caption-2-medium", TONE_CLASS[tone])}>
      {children}
    </span>
  );
}

type MapBlock = {
  left: string;
  top: string;
  width: string;
  height: string;
  tone: string;
};

const MAP_BLOCK_SETS: MapBlock[][] = [
  [
    { left: "3%", top: "8%", width: "24%", height: "30%", tone: "bg-background-tertiary-default" },
    { left: "30%", top: "6%", width: "18%", height: "22%", tone: "bg-chart-2/20" },
    { left: "52%", top: "8%", width: "20%", height: "16%", tone: "bg-background-tertiary-default" },
    { left: "76%", top: "6%", width: "20%", height: "30%", tone: "bg-background-tertiary-default" },
    { left: "4%", top: "46%", width: "20%", height: "22%", tone: "bg-background-tertiary-default" },
    { left: "28%", top: "38%", width: "26%", height: "26%", tone: "bg-background-tertiary-default" },
    { left: "58%", top: "32%", width: "16%", height: "28%", tone: "bg-chart-4/20" },
    { left: "80%", top: "44%", width: "16%", height: "24%", tone: "bg-background-tertiary-default" },
    { left: "14%", top: "74%", width: "30%", height: "18%", tone: "bg-background-tertiary-default" },
    { left: "54%", top: "70%", width: "38%", height: "22%", tone: "bg-background-tertiary-default" },
  ],
  [
    { left: "5%", top: "8%", width: "28%", height: "26%", tone: "bg-chart-2/20" },
    { left: "38%", top: "6%", width: "22%", height: "20%", tone: "bg-background-tertiary-default" },
    { left: "66%", top: "8%", width: "28%", height: "28%", tone: "bg-background-tertiary-default" },
    { left: "4%", top: "42%", width: "18%", height: "22%", tone: "bg-background-tertiary-default" },
    { left: "26%", top: "38%", width: "26%", height: "24%", tone: "bg-background-tertiary-default" },
    { left: "56%", top: "34%", width: "14%", height: "28%", tone: "bg-chart-4/20" },
    { left: "74%", top: "44%", width: "20%", height: "20%", tone: "bg-background-tertiary-default" },
    { left: "8%", top: "72%", width: "30%", height: "20%", tone: "bg-background-tertiary-default" },
    { left: "44%", top: "70%", width: "22%", height: "22%", tone: "bg-background-tertiary-default" },
    { left: "72%", top: "70%", width: "22%", height: "18%", tone: "bg-background-tertiary-default" },
  ],
  [
    { left: "4%", top: "10%", width: "20%", height: "26%", tone: "bg-background-tertiary-default" },
    { left: "28%", top: "6%", width: "24%", height: "30%", tone: "bg-background-tertiary-default" },
    { left: "56%", top: "10%", width: "16%", height: "22%", tone: "bg-chart-4/20" },
    { left: "76%", top: "8%", width: "20%", height: "26%", tone: "bg-background-tertiary-default" },
    { left: "6%", top: "44%", width: "26%", height: "20%", tone: "bg-background-tertiary-default" },
    { left: "36%", top: "42%", width: "18%", height: "26%", tone: "bg-chart-2/20" },
    { left: "60%", top: "38%", width: "24%", height: "30%", tone: "bg-background-tertiary-default" },
    { left: "10%", top: "72%", width: "30%", height: "20%", tone: "bg-background-tertiary-default" },
    { left: "46%", top: "72%", width: "24%", height: "20%", tone: "bg-background-tertiary-default" },
    { left: "74%", top: "70%", width: "20%", height: "22%", tone: "bg-background-tertiary-default" },
  ],
];

function MiniMap({
  variant = 0,
  label,
  className,
  children,
}: {
  variant?: number;
  label: string;
  className?: string;
  children?: ReactNode;
}) {
  const blocks = MAP_BLOCK_SETS[variant % MAP_BLOCK_SETS.length];

  return (
    <div
      role="group"
      aria-label={label}
      className={cx(
        "relative overflow-hidden rounded-lg border border-border-button-default bg-background-secondary-default",
        className,
      )}
    >
      <div aria-hidden className="absolute inset-0">
        {blocks.map((block, index) => (
          <span
            key={index}
            className={cx("absolute rounded-[2px] border border-separator-border/60", block.tone)}
            style={{ left: block.left, top: block.top, width: block.width, height: block.height }}
          />
        ))}
        <span
          className="absolute h-[7%] bg-background-primary-default"
          style={{ left: 0, right: 0, top: "47%" }}
        />
        <span
          className="absolute w-[5%] bg-background-primary-default"
          style={{ top: 0, bottom: 0, left: "44%" }}
        />
        <span
          className="absolute h-[3px] bg-background-primary-default"
          style={{ left: 0, right: 0, top: "78%" }}
        />
        <span
          className="absolute w-[3px] bg-background-primary-default"
          style={{ top: 0, bottom: 0, left: "19%" }}
        />
      </div>
      {children}
    </div>
  );
}

function MapMarker({
  label,
  x,
  y,
  selected = false,
  onSelect,
}: {
  label: string;
  x: number;
  y: number;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const body = (
    <>
      <span
        className={cx(
          "flex size-6 items-center justify-center rounded-full border shadow-xs",
          "transition-[transform,background-color,border-color,color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
          selected
            ? "scale-110 border-accent-600 bg-accent-600 text-text-white shadow-dropdown"
            : "border-border-button-default bg-background-primary-default text-foreground-icon-secondary",
        )}
      >
        <RiMapPinLine className="size-3.5" aria-hidden />
      </span>
      <span
        className={cx(
          "max-w-[76px] truncate rounded-full px-1.5 py-px text-caption-2-medium shadow-xs",
          "transition-colors duration-150 ease-out motion-reduce:transition-none",
          selected ? "bg-accent-600 text-text-white" : "bg-background-primary-default text-text-secondary",
        )}
      >
        {label}
      </span>
    </>
  );

  const style = { left: `${x}%`, top: `${y}%` };

  if (!onSelect) {
    return (
      <span
        aria-hidden
        style={style}
        className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5"
      >
        {body}
      </span>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={`${label}${selected ? ", selected" : ""}`}
      onClick={onSelect}
      style={style}
      className={cx(
        "absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5 rounded-md p-0.5",
        selected && "z-10",
        focusRing,
      )}
    >
      {body}
    </button>
  );
}

function RoutePath({ show, d, className }: { show: boolean; d: string; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 60"
      preserveAspectRatio="none"
      className={cx("pointer-events-none absolute inset-0 size-full", className)}
    >
      <path
        d={d}
        fill="none"
        pathLength={1}
        strokeDasharray={1}
        strokeWidth={2}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        className={cx(
          "stroke-accent-500 transition-[stroke-dashoffset,opacity] duration-200 ease-out motion-reduce:transition-none",
          show ? "opacity-100 [stroke-dashoffset:0]" : "opacity-0 [stroke-dashoffset:1]",
        )}
      />
    </svg>
  );
}

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));
const formatCount = new Intl.NumberFormat("en-US");

/* 1. Location Card */

export function LocationCard() {
  const [route, setRoute] = useState(false);

  return (
    <section
      aria-label="Ritual Coffee Roasters"
      className={cx(card, "max-w-[320px] p-2.5")}
      onKeyDown={(event) => {
        if (event.key === "Escape" && route) setRoute(false);
      }}
    >
      <div className="flex items-start gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-accent-600 text-text-white shadow-xs">
          <RiCupLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Ritual Coffee Roasters</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">1026 Valencia St · Mission District</p>
        </div>
        <Tag tone="green">
          <span aria-hidden className="size-1.5 rounded-full bg-status-lime-text" />
          Open
        </Tag>
      </div>

      <MiniMap variant={0} label="Map showing Ritual Coffee on Valencia Street" className="mt-2 h-[62px]">
        <RoutePath show={route} d="M6 56 C 24 50, 32 55, 52 55" />
        <MapMarker label="Ritual" x={52} y={55} />
      </MiniMap>

      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1 truncate text-caption-2-regular text-text-tertiary">
          <RiTimeLine className="size-3 shrink-0" aria-hidden />
          Open until 6 PM · 1.2 mi
        </span>
        <button
          type="button"
          aria-pressed={route}
          onClick={() => setRoute((current) => !current)}
          className={cx(route ? secondaryButton : primaryButton, "h-7")}
        >
          {route ? (
            <>
              <RiCheckLine className="size-3.5" aria-hidden />
              Route ready
            </>
          ) : (
            <>
              <RiNavigationLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
              Directions
            </>
          )}
        </button>
      </div>
    </section>
  );
}

/* 2. Map Pin */

const MAP_PICKS = [
  { id: "reveille", label: "Reveille", name: "Café Reveille", meta: "2001 Market St · 0.4 mi · Open until 3 PM", icon: RiCupLine, x: 24, y: 46 },
  { id: "dolores", label: "Dolores", name: "Dolores Park", meta: "Dolores St · 0.6 mi · Open until 10 PM", icon: RiTreeLine, x: 52, y: 70 },
  { id: "dogeared", label: "Books", name: "Dog Eared Books", meta: "900 Valencia St · 0.9 mi · Open until 9 PM", icon: RiBookOpenLine, x: 78, y: 38 },
] as const;

export function MapPin() {
  const [selectedId, setSelectedId] = useState<string>("dolores");
  const selected = MAP_PICKS.find((pick) => pick.id === selectedId) ?? MAP_PICKS[0];
  const SelectedIcon = selected.icon;

  return (
    <section aria-label="Mission neighborhood picks" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Mission picks</h3>
        <span className="text-caption-2-regular text-text-tertiary">3 places · under 1 mi</span>
      </div>

      <MiniMap variant={1} label="Map with three selectable places in the Mission" className="mt-1.5 h-[92px]">
        {MAP_PICKS.map((pick) => (
          <MapMarker
            key={pick.id}
            label={pick.label}
            x={pick.x}
            y={pick.y}
            selected={pick.id === selected.id}
            onSelect={() => setSelectedId(pick.id)}
          />
        ))}
      </MiniMap>

      <div className="mt-2" aria-live="polite">
        <div
          key={selected.id}
          className="flex animate-label-in items-center gap-2 rounded-lg bg-background-secondary-default px-2 py-1.5 motion-reduce:animate-none"
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-primary-default text-accent-600 shadow-xs">
            <SelectedIcon className="size-3.5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-caption-1-semibold text-text-primary">{selected.name}</p>
            <p className="truncate text-caption-2-regular text-text-tertiary">{selected.meta}</p>
          </div>
          <Tag tone="green">Open</Tag>
        </div>
      </div>
    </section>
  );
}

/* 3. Route Summary */

type RouteStep = { text: string; meta: string; icon: IconComponent };

type RouteMode = {
  id: string;
  label: string;
  icon: IconComponent;
  distance: string;
  time: string;
  note: string;
  steps: RouteStep[];
};

const ROUTE_MODES: RouteMode[] = [
  {
    id: "drive",
    label: "Drive",
    icon: RiCarLine,
    distance: "2.4 mi",
    time: "12 min",
    note: "via Valencia St",
    steps: [
      { text: "Head north on Valencia St", meta: "0.8 mi", icon: RiArrowUpLine },
      { text: "Turn right onto 18th St", meta: "0.9 mi", icon: RiArrowRightLine },
      { text: "Arrive at Ferry Building", meta: "0.7 mi", icon: RiFlag2Line },
    ],
  },
  {
    id: "bike",
    label: "Bike",
    icon: RiBikeLine,
    distance: "2.1 mi",
    time: "18 min",
    note: "via The Wiggle",
    steps: [
      { text: "Climb Duboce Ave", meta: "0.7 mi", icon: RiArrowUpLine },
      { text: "Follow the Wiggle to Market", meta: "0.9 mi", icon: RiArrowRightLine },
      { text: "Arrive at Ferry Building", meta: "0.5 mi", icon: RiFlag2Line },
    ],
  },
  {
    id: "walk",
    label: "Walk",
    icon: RiWalkLine,
    distance: "2.3 mi",
    time: "46 min",
    note: "via Mission St",
    steps: [
      { text: "Walk north on Mission St", meta: "1.1 mi", icon: RiArrowUpLine },
      { text: "Turn right onto Embarcadero", meta: "0.9 mi", icon: RiArrowRightLine },
      { text: "Arrive at Ferry Building", meta: "0.3 mi", icon: RiFlag2Line },
    ],
  },
];

export function RouteSummary() {
  const [modeId, setModeId] = useState("drive");
  const mode = ROUTE_MODES.find((option) => option.id === modeId) ?? ROUTE_MODES[0];

  return (
    <section aria-label="Route from Dolores Park to the Ferry Building" className={cx(card, "max-w-[320px] p-2")}>
      <div className="flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-background-secondary-default text-accent-600">
          <RiRouteLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Dolores Park to Ferry Building</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">Today, 9:42 AM · leave now</p>
        </div>
      </div>

      <div role="group" aria-label="Travel mode" className="mt-2 grid grid-cols-3 gap-0.5 rounded-lg bg-background-secondary-default p-0.5">
        {ROUTE_MODES.map((option) => {
          const OptionIcon = option.icon;
          const active = option.id === mode.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => setModeId(option.id)}
              className={cx(
                "flex h-6 items-center justify-center gap-1 rounded-md text-caption-2-semibold",
                "transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                active
                  ? "bg-background-primary-default text-text-primary shadow-xs"
                  : "text-text-tertiary hover:text-text-secondary",
              )}
            >
              <OptionIcon className="size-3" aria-hidden />
              {option.label}
            </button>
          );
        })}
      </div>

      <div key={mode.id} className="animate-label-in motion-reduce:animate-none">
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-title-3-semibold tabular-nums text-text-primary">
            <bdi dir="ltr">{mode.distance}</bdi>
          </span>
          <span className="text-body-2-medium text-text-secondary">
            <bdi dir="ltr">{mode.time}</bdi>
          </span>
          <span className="ms-auto truncate text-caption-2-regular text-text-tertiary">{mode.note}</span>
        </div>

        <ol aria-label="Turn-by-turn steps" className="mt-1 flex flex-col gap-0.5">
          {mode.steps.map((step) => {
            const StepIcon = step.icon;
            return (
              <li key={step.text} className="flex h-5 items-center gap-1.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-background-secondary-default text-foreground-icon-secondary">
                  <StepIcon className="size-3" aria-hidden />
                </span>
                <span className="min-w-0 flex-1 truncate text-caption-2-regular text-text-secondary">{step.text}</span>
                <span className="shrink-0 text-caption-2-regular tabular-nums text-text-tertiary">
                  <bdi dir="ltr">{step.meta}</bdi>
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* 4. Nearby List */

const NEARBY_PLACES = [
  { id: "tartine", name: "Tartine Bakery", category: "Bakery", distance: "0.3 mi", open: true, hours: "Open until 5 PM", icon: RiCupLine },
  { id: "dolores", name: "Dolores Park", category: "Park", distance: "0.6 mi", open: true, hours: "Open until 10 PM", icon: RiTreeLine },
  { id: "books", name: "Dog Eared Books", category: "Bookshop", distance: "0.9 mi", open: false, hours: "Closed · opens 10 AM", icon: RiBookOpenLine },
] as const;

export function NearbyList() {
  const [openOnly, setOpenOnly] = useState(false);
  const [selectedId, setSelectedId] = useState("tartine");

  const toggleOpenOnly = (next: boolean) => {
    setOpenOnly(next);
    if (next && selectedId === "books") setSelectedId("tartine");
  };

  return (
    <section aria-label="Places near 18th and Valencia" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-body-2-semibold text-text-primary">Nearby</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">Sorted by walking distance</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <Switch
            aria-label="Open now"
            size="sm"
            isSelected={openOnly}
            onChange={toggleOpenOnly}
            className="motion-reduce:[&_*]:transition-none"
          />
          <span aria-hidden className="text-caption-2-medium text-text-tertiary">Open now</span>
        </div>
      </div>

      <ul className="mt-1">
        {NEARBY_PLACES.map((place) => {
          const visible = openOnly ? place.open : true;
          const selected = place.id === selectedId;
          const PlaceIcon = place.icon;
          return (
            <li
              key={place.id}
              inert={!visible}
              className={cx(reveal, visible ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
            >
              <div className="min-h-0 overflow-hidden">
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setSelectedId(place.id)}
                  className={cx(
                    "mt-0.5 flex h-9 w-full items-center gap-2 rounded-lg border px-1.5 text-start",
                    "transition-[background-color,border-color] duration-150 ease-out motion-reduce:transition-none",
                    focusRing,
                    selected
                      ? "border-accent-500 bg-background-secondary-default"
                      : "border-transparent hover:bg-background-secondary-default",
                  )}
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-primary-default text-foreground-icon-secondary shadow-xs">
                    <PlaceIcon className="size-3.5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-caption-1-semibold text-text-primary">{place.name}</span>
                    <span className="block truncate text-caption-2-regular text-text-tertiary">
                      {place.category} · {place.hours}
                    </span>
                  </span>
                  <span className="shrink-0 text-caption-2-semibold tabular-nums text-text-secondary">
                    <bdi dir="ltr">{place.distance}</bdi>
                  </span>
                  <span
                    aria-hidden
                    className={cx("size-1.5 shrink-0 rounded-full", place.open ? "bg-state-success-base" : "bg-foreground-icon-quaternary")}
                  />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* 5. Geofence Editor */

const GEOFENCE_CENTER = "Casa Verde · 18th & Valencia";

export function GeofenceEditor() {
  const [radius, setRadius] = useState(800);
  const area = Math.PI * (radius / 1000) ** 2;
  const addresses = Math.round(area * 1180);
  const size = 20 + (radius / 2000) * 52;

  return (
    <section aria-label="Geofence editor" className={cx(card, "max-w-[320px] p-2")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Geofence</h3>
        <span aria-live="polite" className="text-caption-1-semibold tabular-nums text-text-primary">
          {area.toFixed(1)} km²
        </span>
      </div>

      <MiniMap
        variant={2}
        label={`Map showing an ${radius} metre geofence around Casa Verde`}
        className="mt-1.5 h-[76px]"
      >
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-500/60 bg-accent-500/10 transition-[width,height] duration-200 ease-out motion-reduce:transition-none"
          style={{ width: size, height: size }}
        />
        <MapMarker label="Casa Verde" x={50} y={50} />
      </MiniMap>

      <div className="mt-1.5 flex items-baseline justify-between gap-2">
        <span className="text-caption-2-medium text-text-secondary">Radius</span>
        <span className="text-caption-2-semibold tabular-nums text-text-primary">{radius} m</span>
      </div>
      <Slider
        aria-label="Geofence radius"
        thumbLabel="Geofence radius"
        minValue={200}
        maxValue={2000}
        step={100}
        value={radius}
        onChange={setRadius}
        showTooltip={false}
        className="gap-0 motion-reduce:[&_*]:transition-none"
      />
      <p className="truncate text-caption-2-regular text-text-tertiary">
        {formatCount.format(addresses)} addresses inside · {GEOFENCE_CENTER}
      </p>
    </section>
  );
}

/* 6. Store Locator */

const STORES = [
  { id: "mission", name: "Mission", address: "1026 Valencia St", hours: "Open until 7 PM", distance: "0.6 mi", open: true },
  { id: "hayes", name: "Hayes Valley", address: "450 Hayes St", hours: "Open until 8 PM", distance: "1.4 mi", open: true },
  { id: "soma", name: "SoMa", address: "85 Bluxome St", hours: "Open until 6 PM", distance: "1.9 mi", open: true },
  { id: "marina", name: "Marina", address: "2125 Chestnut St", hours: "Closed · opens 9 AM", distance: "2.8 mi", open: false },
] as const;

export function StoreLocator() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("mission");
  const [pickupId, setPickupId] = useState("mission");
  const needle = query.trim().toLowerCase();
  const visible = STORES.filter((store) => `${store.name} ${store.address}`.toLowerCase().includes(needle));
  const results = visible.slice(0, 3);
  const selected = results.find((store) => store.id === selectedId) ?? results[0] ?? null;
  const picked = selected?.id === pickupId;

  return (
    <section aria-label="Store locator" className={cx(card, "max-w-[480px] p-2")}>
      <div className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent-600 text-text-white shadow-xs">
          <RiStore2Line className="size-3.5" aria-hidden />
        </span>
        <h3 className="text-body-2-semibold text-text-primary">Store locator</h3>
        <span className="ms-auto text-caption-2-regular tabular-nums text-text-tertiary">
          {visible.length} of {STORES.length} stores
        </span>
      </div>

      <div className="mt-1.5 grid grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-2">
        <div className="flex min-w-0 flex-col">
          <Input
            aria-label="Search stores by city or neighborhood"
            placeholder="Find a store"
            size="small"
            leadingIcon={RiSearchLine}
            value={query}
            onChange={setQuery}
            className="gap-0"
          />
          <ul className="mt-1 flex flex-col gap-0.5">
            {results.map((store) => {
              const active = store.id === selected?.id;
              return (
                <li key={store.id}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelectedId(store.id)}
                    className={cx(
                      "flex h-7 w-full items-center gap-1.5 rounded-md px-1.5 text-start",
                      "transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
                      focusRing,
                      active
                        ? "bg-background-secondary-default text-text-primary"
                        : "text-text-secondary hover:bg-background-secondary-hover",
                    )}
                  >
                    <span className="min-w-0 flex-1 truncate text-caption-1-medium">{store.name}</span>
                    <span className="shrink-0 text-caption-2-regular tabular-nums text-text-tertiary">
                      <bdi dir="ltr">{store.distance}</bdi>
                    </span>
                    <span
                      aria-hidden
                      className={cx("size-1.5 shrink-0 rounded-full", store.open ? "bg-state-success-base" : "bg-foreground-icon-quaternary")}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
          {visible.length === 0 && (
            <p className="px-1.5 py-1 text-caption-2-regular text-text-tertiary">No store on that block.</p>
          )}
          <p className="mt-auto px-1.5 pt-1 text-caption-2-regular text-text-tertiary">
            {visible.length > results.length ? `+${visible.length - results.length} more nearby` : "Sorted by distance"}
          </p>
        </div>

        <div className="flex min-w-0 flex-col rounded-lg border border-separator-border bg-background-secondary-default p-1.5">
          {selected ? (
            <div key={selected.id} className="flex min-w-0 flex-1 animate-label-in flex-col motion-reduce:animate-none">
              <MiniMap variant={2} label={`Map showing the ${selected.name} store`} className="h-[46px]">
                <MapMarker label={selected.name} x={54} y={50} />
              </MiniMap>
              <p className="mt-1 truncate text-caption-1-semibold text-text-primary">{selected.name}</p>
              <p className="truncate text-caption-2-regular text-text-tertiary">{selected.address}</p>
              <div className="mt-auto flex flex-col gap-1 pt-1">
                <span
                  className={cx(
                    "min-w-0 truncate text-caption-2-medium",
                    selected.open ? "text-status-lime-text" : "text-text-tertiary",
                  )}
                >
                  {selected.hours}
                </span>
                <button
                  type="button"
                  aria-pressed={picked}
                  onClick={() => setPickupId(selected.id)}
                  className={cx(picked ? secondaryButton : primaryButton, "h-6 w-full px-1.5 text-caption-2-semibold")}
                >
                  {picked ? (
                    <>
                      <RiCheckLine className="size-3" aria-hidden />
                      Pickup
                    </>
                  ) : (
                    "Set pickup"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-1 text-center">
              <RiCompass3Line className="size-4 text-foreground-icon-quaternary" aria-hidden />
              <p className="text-caption-2-regular text-text-tertiary">No matching store.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* 7. Delivery Radius */

const COVERAGE_TIERS = [
  { miles: 2, addresses: 3180, eta: "18 min average" },
  { miles: 5, addresses: 18420, eta: "27 min average" },
  { miles: 10, addresses: 61900, eta: "41 min average" },
] as const;

const ADDRESS_POINTS = [
  { x: 48, y: 45, miles: 2 },
  { x: 52, y: 42, miles: 2 },
  { x: 55, y: 56, miles: 2 },
  { x: 42, y: 50, miles: 5 },
  { x: 58, y: 50, miles: 5 },
  { x: 50, y: 22, miles: 5 },
  { x: 50, y: 78, miles: 5 },
  { x: 37, y: 50, miles: 10 },
  { x: 63, y: 50, miles: 10 },
  { x: 50, y: 10, miles: 10 },
  { x: 50, y: 90, miles: 10 },
] as const;

export function DeliveryRadius() {
  const [miles, setMiles] = useState(5);
  const tier = COVERAGE_TIERS.find((option) => option.miles === miles) ?? COVERAGE_TIERS[1];
  const size = 22 + (miles / 10) * 60;

  return (
    <section aria-label="Delivery radius" className={cx(card, "max-w-[320px] p-2")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Delivery radius</h3>
        <span className="rounded-full bg-background-secondary-default px-1.5 py-0.5 text-caption-2-semibold tabular-nums text-text-secondary">
          {miles} mi
        </span>
      </div>

      <MiniMap variant={0} label={`Map showing a ${miles} mile delivery radius`} className="mt-1.5 h-[84px]">
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-500/60 bg-accent-500/10 transition-[width,height] duration-200 ease-out motion-reduce:transition-none"
          style={{ width: size, height: size }}
        />
        {ADDRESS_POINTS.map((point) => {
          const inside = point.miles <= miles;
          return (
            <span
              key={`${point.x}-${point.y}`}
              aria-hidden
              className={cx(
                "absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full",
                "transition-[background-color,opacity,transform] duration-200 ease-out motion-reduce:transition-none",
                inside ? "bg-accent-500 opacity-100" : "bg-foreground-icon-quaternary opacity-30",
              )}
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
            />
          );
        })}
        <MapMarker label="Kitchen" x={50} y={50} />
      </MiniMap>

      <div role="group" aria-label="Coverage radius" className="mt-1.5 grid grid-cols-3 gap-0.5 rounded-lg bg-background-secondary-default p-0.5">
        {COVERAGE_TIERS.map((option) => {
          const active = option.miles === miles;
          return (
            <button
              key={option.miles}
              type="button"
              aria-pressed={active}
              onClick={() => setMiles(option.miles)}
              className={cx(
                "h-6 rounded-md text-caption-2-semibold tabular-nums",
                "transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                active
                  ? "bg-background-primary-default text-text-primary shadow-xs"
                  : "text-text-tertiary hover:text-text-secondary",
              )}
            >
              {option.miles} mi
            </button>
          );
        })}
      </div>

      <div className="mt-1" aria-live="polite">
        <div key={miles} className="flex animate-label-in items-baseline gap-1.5 motion-reduce:animate-none">
          <span className="text-title-3-semibold tabular-nums text-text-primary">{formatCount.format(tier.addresses)}</span>
          <span className="text-caption-2-regular text-text-tertiary">addresses inside</span>
          <span className="ms-auto text-caption-2-medium text-text-secondary">{tier.eta}</span>
        </div>
      </div>
    </section>
  );
}

/* 8. Coordinate Field */

const MISSION_COORDS = { lat: "37.7599", lng: "-122.4148" };
const PRESIDIO_COORDS = { lat: "37.7989", lng: "-122.4662" };

export function CoordinateField() {
  const [lat, setLat] = useState(MISSION_COORDS.lat);
  const [lng, setLng] = useState(MISSION_COORDS.lng);
  const latValue = Number(lat);
  const lngValue = Number(lng);
  const latOk = lat.trim() !== "" && Number.isFinite(latValue) && Math.abs(latValue) <= 90;
  const lngOk = lng.trim() !== "" && Number.isFinite(lngValue) && Math.abs(lngValue) <= 180;
  const inCity = latOk && lngOk && latValue >= 37.7 && latValue <= 37.82 && lngValue >= -122.52 && lngValue <= -122.36;
  const x = lngOk ? clamp(((lngValue + 122.52) / 0.16) * 100) : 50;
  const y = latOk ? clamp(((37.82 - latValue) / 0.12) * 100) : 50;
  const atPresidio = lat.trim() === PRESIDIO_COORDS.lat && lng.trim() === PRESIDIO_COORDS.lng;
  const message = !latOk
    ? "Latitude must be -90 to 90."
    : !lngOk
      ? "Longitude must be -180 to 180."
      : !inCity
        ? "Valid coordinate, outside this map."
        : `Valid · ${Math.abs(latValue).toFixed(4)}° ${latValue >= 0 ? "N" : "S"}, ${Math.abs(lngValue).toFixed(4)}° ${lngValue >= 0 ? "E" : "W"}`;

  const usePresidio = () => {
    const next = atPresidio ? MISSION_COORDS : PRESIDIO_COORDS;
    setLat(next.lat);
    setLng(next.lng);
  };

  return (
    <section aria-label="Coordinate field" className={cx(card, "max-w-[320px] p-2")}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Coordinates</h3>
        <Tag tone="blue">
          <RiCompass3Line className="size-3" aria-hidden />
          San Francisco
        </Tag>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <Input
          label="Latitude"
          size="small"
          inputDir="ltr"
          value={lat}
          isInvalid={!latOk}
          onChange={setLat}
          className="min-w-0 gap-0.5"
        />
        <Input
          label="Longitude"
          size="small"
          inputDir="ltr"
          value={lng}
          isInvalid={!lngOk}
          onChange={setLng}
          className="min-w-0 gap-0.5"
        />
      </div>

      <MiniMap variant={1} label="Map with a marker at the entered coordinate" className="mt-2 h-[52px]">
        <span aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-border-button-default/70" />
        <span aria-hidden className="absolute inset-y-0 left-1/2 w-px bg-border-button-default/70" />
        <span
          aria-hidden
          style={{ left: `${x}%`, top: `${y}%` }}
          className={cx(
            "absolute flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 shadow-xs",
            "transition-[left,top,background-color,border-color,color] duration-200 ease-out motion-reduce:transition-none",
            latOk && lngOk
              ? "border-accent-600 bg-accent-600 text-text-white"
              : "border-border-error-default bg-background-primary-default text-text-error-primary",
          )}
        >
          <RiMapPinLine className="size-3" aria-hidden />
        </span>
      </MiniMap>

      <div className="mt-1.5 flex items-center gap-1.5">
        <span
          className={cx(
            "flex size-4 shrink-0 items-center justify-center rounded-full",
            latOk && lngOk ? "bg-status-lime-background text-status-lime-text" : "bg-status-rose-background text-status-rose-text",
          )}
        >
          {latOk && lngOk ? (
            <RiCheckLine className="size-2.5" aria-hidden />
          ) : (
            <RiErrorWarningLine className="size-2.5" aria-hidden />
          )}
        </span>
        <span
          aria-live="polite"
          className={cx(
            "min-w-0 flex-1 truncate text-caption-2-regular",
            latOk && lngOk ? "text-text-secondary" : "text-text-error-primary",
          )}
        >
          {message}
        </span>
        <button
          type="button"
          aria-label={atPresidio ? "Use Mission District coordinates" : "Use Presidio coordinates"}
          onClick={usePresidio}
          className={quietButton}
        >
          {atPresidio ? "Mission" : "Presidio"}
        </button>
      </div>
    </section>
  );
}

/* 9. Layer Toggle */

const LAYERS = [
  { id: "transit", label: "Transit lines", detail: "12 routes", icon: RiBusLine },
  { id: "parks", label: "Parks", detail: "48 green spaces", icon: RiTreeLine },
  { id: "traffic", label: "Live traffic", detail: "3 delays", icon: RiTrafficLightLine },
] as const;

type LayerId = (typeof LAYERS)[number]["id"];
const LAYER_DEFAULTS: Record<LayerId, boolean> = { transit: true, parks: true, traffic: false };

export function LayerToggle() {
  const [enabled, setEnabled] = useState(LAYER_DEFAULTS);
  const active = LAYERS.filter((layer) => enabled[layer.id]).length;

  return (
    <section aria-label="Map layer toggle" className={cx(card, "max-w-[320px] p-2")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Map layers</h3>
        <span className="text-caption-2-regular tabular-nums text-text-tertiary">{active} of 3 visible</span>
      </div>

      <MiniMap variant={0} label="Map with transit, parks and traffic layers" className="mt-1.5 h-[64px]">
        <span
          aria-hidden
          className={cx(
            "absolute rounded-[2px] bg-chart-2/30 transition-opacity duration-200 ease-out motion-reduce:transition-none",
            enabled.parks ? "opacity-100" : "opacity-0",
          )}
          style={{ left: "30%", top: "12%", width: "22%", height: "32%" }}
        />
        <span
          aria-hidden
          className={cx(
            "absolute rounded-[2px] bg-chart-2/30 transition-opacity duration-200 ease-out motion-reduce:transition-none",
            enabled.parks ? "opacity-100" : "opacity-0",
          )}
          style={{ left: "70%", top: "56%", width: "20%", height: "28%" }}
        />
        <svg
          aria-hidden
          viewBox="0 0 100 60"
          preserveAspectRatio="none"
          className={cx(
            "pointer-events-none absolute inset-0 size-full transition-opacity duration-200 ease-out motion-reduce:transition-none",
            enabled.transit ? "opacity-100" : "opacity-0",
          )}
        >
          <path d="M4 48 L30 32 L58 36 L96 12" fill="none" strokeWidth={2} vectorEffect="non-scaling-stroke" className="stroke-chart-3" />
          <path d="M18 4 L30 30 L48 44 L72 58" fill="none" strokeWidth={2} vectorEffect="non-scaling-stroke" className="stroke-chart-5" />
        </svg>
        <span
          aria-hidden
          className={cx(
            "absolute h-[3px] w-[20%] rounded-full bg-status-rose-text/60 transition-opacity duration-200 ease-out motion-reduce:transition-none",
            enabled.traffic ? "opacity-100" : "opacity-0",
          )}
          style={{ left: "16%", top: "49%" }}
        />
        <span
          aria-hidden
          className={cx(
            "absolute h-[3px] w-[16%] rounded-full bg-status-rose-text/60 transition-opacity duration-200 ease-out motion-reduce:transition-none",
            enabled.traffic ? "opacity-100" : "opacity-0",
          )}
          style={{ left: "60%", top: "30%" }}
        />
      </MiniMap>

      <div className="mt-1 flex flex-col">
        {LAYERS.map((layer) => {
          const Icon = layer.icon;
          return (
            <div key={layer.id} className="flex h-6 items-center gap-1.5">
              <Icon className="size-3.5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
              <span className="min-w-0 flex-1 truncate text-caption-1-medium text-text-primary">{layer.label}</span>
              <span className="hidden shrink-0 text-caption-2-regular text-text-tertiary sm:inline">{layer.detail}</span>
              <Switch
                aria-label={`Toggle ${layer.label.toLowerCase()}`}
                size="sm"
                isSelected={enabled[layer.id]}
                onChange={(next) => setEnabled((current) => ({ ...current, [layer.id]: next }))}
                className="motion-reduce:[&_*]:transition-none"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* 10. Map Legend */

const LEGEND_LAYERS = [
  {
    id: "shelters",
    label: "Shelters",
    count: 12,
    marker: "bg-status-lime-text",
    points: [{ x: 26, y: 38 }, { x: 64, y: 62 }],
  },
  {
    id: "water",
    label: "Water points",
    count: 9,
    marker: "bg-status-blue-text",
    points: [{ x: 44, y: 26 }, { x: 82, y: 44 }],
  },
  {
    id: "zones",
    label: "Evacuation zones",
    count: 6,
    marker: "bg-status-rose-text",
    points: [{ x: 18, y: 68 }, { x: 52, y: 44 }, { x: 74, y: 20 }],
  },
] as const;

type LegendId = (typeof LEGEND_LAYERS)[number]["id"];
const LEGEND_DEFAULTS: Record<LegendId, boolean> = { shelters: true, water: true, zones: true };

export function MapLegend() {
  const [enabled, setEnabled] = useState(LEGEND_DEFAULTS);

  return (
    <section aria-label="Map legend" className={cx(card, "max-w-[320px] p-2")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Map legend</h3>
        <span className="text-caption-2-regular tabular-nums text-text-tertiary">3 layers</span>
      </div>

      <MiniMap variant={2} label="Map showing shelters, water points and evacuation zones" className="mt-1.5 h-[56px]">
        {LEGEND_LAYERS.flatMap((layer) =>
          layer.points.map((point) => (
            <span
              key={`${layer.id}-${point.x}`}
              aria-hidden
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              className={cx(
                "absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-background-primary-default",
                "transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
                layer.marker,
                enabled[layer.id] ? "scale-100 opacity-100" : "scale-50 opacity-0",
              )}
            />
          )),
        )}
      </MiniMap>

      <div className="mt-1 flex flex-col">
        {LEGEND_LAYERS.map((layer) => {
          const on = enabled[layer.id];
          return (
            <button
              key={layer.id}
              type="button"
              aria-pressed={on}
              onClick={() => setEnabled((current) => ({ ...current, [layer.id]: !current[layer.id] }))}
              className={cx(
                "flex h-6 w-full items-center gap-2 rounded-md px-1 text-start",
                "transition-[background-color] duration-150 ease-out hover:bg-background-secondary-default motion-reduce:transition-none",
                focusRing,
              )}
            >
              <span
                aria-hidden
                className={cx(
                  "size-2 shrink-0 rounded-full transition-opacity duration-150 ease-out motion-reduce:transition-none",
                  layer.marker,
                  on ? "opacity-100" : "opacity-30",
                )}
              />
              <span
                className={cx(
                  "min-w-0 flex-1 truncate text-caption-1-medium transition-colors duration-150 ease-out motion-reduce:transition-none",
                  on ? "text-text-primary" : "text-text-tertiary",
                )}
              >
                {layer.label}
              </span>
              <span className="shrink-0 text-caption-2-regular tabular-nums text-text-tertiary">{layer.count}</span>
              <span
                className={cx(
                  "flex size-4 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,color] duration-150 ease-out motion-reduce:transition-none",
                  on
                    ? "border-accent-600 bg-accent-600 text-text-white"
                    : "border-border-checkbox-default bg-background-primary-default",
                )}
              >
                <RiCheckLine
                  className={cx(
                    "size-2.5 transition-[transform,opacity] duration-150 ease-out motion-reduce:transition-none",
                    on ? "scale-100 opacity-100" : "scale-50 opacity-0",
                  )}
                  aria-hidden
                />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* 11. Place Card */

const PLACE_TAGS = ["Wood-fired", "Cocktails", "Late night"];

export function PlaceCard() {
  const [saved, setSaved] = useState(false);

  return (
    <section
      aria-label="Nopa restaurant"
      className={cx(
        card,
        "max-w-[320px] p-2.5 transition-[border-color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
        saved && "border-accent-500 shadow-xs",
      )}
    >
      <MiniMap variant={1} label="Map showing Nopa on Divisadero Street" className="h-[44px]">
        <MapMarker label="Nopa" x={58} y={50} />
      </MiniMap>

      <div className="mt-1.5 flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Nopa</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">553 Divisadero St · Californian</p>
        </div>
        <span className="shrink-0 rounded-full bg-background-secondary-default px-1.5 py-0.5 text-caption-2-semibold text-text-secondary">
          $$$
        </span>
      </div>

      <div className="mt-1 flex items-center gap-1.5">
        <RiStarFill className="size-3 text-status-yellow-text" aria-hidden />
        <span className="text-caption-1-semibold tabular-nums text-text-primary">4.7</span>
        <span className="text-caption-2-regular tabular-nums text-text-tertiary">(312)</span>
        <span aria-hidden className="text-text-tertiary">·</span>
        <span className="text-caption-2-medium text-status-lime-text">Open until 11 PM</span>
      </div>

      <div className="mt-1.5 flex flex-wrap gap-1">
        {PLACE_TAGS.map((tag) => (
          <span key={tag} className="rounded-full bg-background-secondary-default px-1.5 py-0.5 text-caption-2-medium text-text-secondary">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2 border-t border-separator-border pt-1.5">
        <span aria-live="polite" className="min-w-0 truncate text-caption-2-regular text-text-tertiary">
          {saved ? "Saved to your list" : "312 reviews · No booking fee"}
        </span>
        <button
          type="button"
          aria-pressed={saved}
          onClick={() => setSaved((current) => !current)}
          className={cx(saved ? secondaryButton : primaryButton, "h-6")}
        >
          {saved ? (
            <>
              <RiBookmarkFill className="size-3" aria-hidden />
              Saved
            </>
          ) : (
            <>
              <RiBookmarkLine className="size-3" aria-hidden />
              Save
            </>
          )}
        </button>
      </div>
    </section>
  );
}

/* 12. Map Search */

const SEARCH_PLACES = [
  { id: "dolores", name: "Dolores Park", meta: "Park · 0.6 mi", icon: RiTreeLine },
  { id: "birite", name: "Bi-Rite Creamery", meta: "Ice cream · 0.4 mi", icon: RiCupLine },
  { id: "valencia", name: "Valencia Corridor", meta: "Street · 0.3 mi", icon: RiRoadMapLine },
  { id: "sfmoma", name: "SFMOMA", meta: "Museum · 1.8 mi", icon: RiBuildingLine },
  { id: "ferry", name: "Ferry Building", meta: "Market · 2.4 mi", icon: RiStore2Line },
  { id: "tartine", name: "Tartine Bakery", meta: "Bakery · 0.3 mi", icon: RiCupLine },
] as const;

type SearchPlace = (typeof SEARCH_PLACES)[number];

const RECENT_PLACES: SearchPlace[] = [
  SEARCH_PLACES.find((place) => place.id === "tartine") ?? SEARCH_PLACES[0],
  SEARCH_PLACES.find((place) => place.id === "dolores") ?? SEARCH_PLACES[0],
  SEARCH_PLACES.find((place) => place.id === "sfmoma") ?? SEARCH_PLACES[0],
];

export function MapSearch() {
  const baseId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<SearchPlace | null>(null);

  const needle = query.trim().toLowerCase();
  const options = needle
    ? SEARCH_PLACES.filter((place) => `${place.name} ${place.meta}`.toLowerCase().includes(needle)).slice(0, 3)
    : RECENT_PLACES;
  const activeOption = options[Math.min(active, options.length - 1)];
  const optionId = (place: SearchPlace) => `${baseId}-${place.id}`;

  const choose = (place: SearchPlace) => {
    setSelected(place);
    setQuery(place.name);
    setOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      const delta = event.key === "ArrowDown" ? 1 : -1;
      setActive((current) => (options.length === 0 ? 0 : (current + delta + options.length) % options.length));
      return;
    }
    if (event.key === "Enter" && open && activeOption) {
      event.preventDefault();
      choose(activeOption);
    }
  };

  return (
    <div
      className="relative w-full max-w-[320px]"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          setOpen(false);
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <div
        className={cx(
          "flex h-9 w-full items-center gap-2 rounded-2lg bg-background-tertiary-default px-2",
          "ring-2 ring-inset ring-transparent transition-[background-color,box-shadow] duration-150 ease-out",
          "hover:ring-border-button-hover focus-within:ring-border-button-active has-[:focus-visible]:ring-border-focus-ring motion-reduce:transition-none",
        )}
      >
        <RiSearchLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
        <input
          type="text"
          role="combobox"
          aria-label="Search places"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={`${baseId}-panel`}
          aria-autocomplete="list"
          aria-activedescendant={open && activeOption ? optionId(activeOption) : undefined}
          placeholder="Search places"
          value={query}
          autoComplete="off"
          spellCheck={false}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActive(0);
          }}
          onKeyDown={handleKeyDown}
          className="min-w-0 flex-1 bg-transparent p-0 text-body-regular text-text-primary outline-none placeholder:text-text-tertiary"
        />
        {query ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              setActive(0);
              setOpen(true);
            }}
            className={cx(iconButton, "-me-1 size-5")}
          >
            <RiCloseLine className="size-3.5" aria-hidden />
          </button>
        ) : (
          <RiArrowDownSLine
            className={cx(
              "size-4 shrink-0 text-foreground-icon-tertiary transition-transform duration-150 ease-out motion-reduce:transition-none",
              open && "rotate-180",
            )}
            aria-hidden
          />
        )}
      </div>

      <div
        id={`${baseId}-panel`}
        role="listbox"
        aria-label="Place suggestions"
        inert={!open}
        className={cx(
          "absolute inset-x-0 top-9 z-20 mt-1 origin-top rounded-xl border border-border-button-default bg-background-primary-default p-1 shadow-dropdown",
          "transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
          open ? "scale-100 opacity-100" : "pointer-events-none scale-[0.98] opacity-0",
        )}
      >
        <p className="px-1.5 py-0.5 text-caption-2-semibold tracking-wide text-text-tertiary uppercase">
          {needle ? "Suggestions" : "Recent places"}
        </p>
        {options.length > 0 ? (
          options.map((place, index) => {
            const PlaceIcon = place.icon;
            const isActive = index === Math.min(active, options.length - 1);
            return (
              <button
                key={place.id}
                id={optionId(place)}
                type="button"
                role="option"
                aria-selected={selected?.id === place.id}
                tabIndex={-1}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(place)}
                className={cx(
                  "flex h-7 w-full items-center gap-1.5 rounded-md px-1.5 text-start",
                  "transition-[background-color] duration-150 ease-out motion-reduce:transition-none",
                  isActive ? "bg-background-secondary-default" : "hover:bg-background-secondary-hover",
                )}
              >
                <PlaceIcon className="size-3.5 shrink-0 text-foreground-icon-secondary" aria-hidden />
                <span className="min-w-0 flex-1 truncate text-caption-1-medium text-text-primary">{place.name}</span>
                <span className="shrink-0 text-caption-2-regular text-text-tertiary">{place.meta}</span>
                {selected?.id === place.id && <RiCheckLine className="size-3 shrink-0 text-accent-600" aria-hidden />}
              </button>
            );
          })
        ) : (
          <p className="px-1.5 py-1 text-caption-2-regular text-text-tertiary">No places match “{query}”.</p>
        )}
      </div>

      <div className="mt-1.5 flex items-center gap-1.5 rounded-lg bg-background-secondary-default px-2 py-1">
        <RiMapPinLine className="size-3.5 shrink-0 text-accent-600" aria-hidden />
        <span className="min-w-0 flex-1 truncate text-caption-1-semibold text-text-primary">
          {selected ? selected.name : "Pick a recent place to begin"}
        </span>
        {selected && (
          <span className="shrink-0 text-caption-2-regular text-text-tertiary">{selected.meta.split(" · ")[1]}</span>
        )}
      </div>

      <div
        className={cx(
          "mt-1 transition-opacity duration-150 ease-out motion-reduce:transition-none",
          open && "opacity-0",
        )}
        inert={open}
        aria-hidden={open}
      >
        <p className="px-0.5 text-caption-2-semibold tracking-wide text-text-tertiary uppercase">Recent places</p>
        <ul className="mt-0.5">
          {RECENT_PLACES.map((place) => {
            const PlaceIcon = place.icon;
            return (
              <li key={place.id}>
                <button
                  type="button"
                  onClick={() => choose(place)}
                  className={cx(
                    "flex h-6 w-full items-center gap-1.5 rounded-md px-1 text-start",
                    "transition-[background-color] duration-150 ease-out hover:bg-background-secondary-default motion-reduce:transition-none",
                    focusRing,
                  )}
                >
                  <PlaceIcon className="size-3 shrink-0 text-foreground-icon-tertiary" aria-hidden />
                  <span className="min-w-0 flex-1 truncate text-caption-2-regular text-text-secondary">{place.name}</span>
                  <span className="shrink-0 text-caption-2-regular text-text-tertiary">{place.meta.split(" · ")[1]}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Specimens                                                                  */
/* -------------------------------------------------------------------------- */

export const MAPS_SECTION: ExtendedSection = {
  id: "maps",
  title: "Maps",
  blurb: "Places, routes and the distance between them.",
  file: "maps.tsx",
  entries: [
    { name: "Location Card", description: "A place with hours, distance and a route preview.", Demo: LocationCard },
    { name: "Map Pin", description: "Selectable pins on a small map field.", Demo: MapPin },
    { name: "Route Summary", description: "Distance, time and turn-by-turn steps by mode.", Demo: RouteSummary },
    { name: "Nearby List", description: "Places by walking distance, filtered to open now.", Demo: NearbyList },
    { name: "Geofence Editor", description: "A radius slider with a live area and address count.", Demo: GeofenceEditor },
    { name: "Store Locator", description: "Search, results and a selected store with pickup.", Demo: StoreLocator, wide: true },
    { name: "Delivery Radius", description: "Coverage tiers with the addresses each one reaches.", Demo: DeliveryRadius },
    { name: "Coordinate Field", description: "Latitude and longitude with live validation.", Demo: CoordinateField },
    { name: "Layer Toggle", description: "Transit, parks and traffic switched on the map.", Demo: LayerToggle },
    { name: "Map Legend", description: "Layer rows with counts that hide their markers.", Demo: MapLegend },
    { name: "Place Card", description: "Rating, price, tags and a saved state.", Demo: PlaceCard },
    { name: "Map Search", description: "Suggestions and recent places under the field.", Demo: MapSearch },
  ],
};
