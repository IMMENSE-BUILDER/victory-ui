"use client";

import { useId, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import {
  RiArrowDownLine,
  RiArrowDownSLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiArrowUpLine,
  RiBarChartBoxLine,
  RiCalendarCheckLine,
  RiCalendarScheduleLine,
  RiChat3Line,
  RiCheckLine,
  RiClosedCaptioningLine,
  RiEyeOffLine,
  RiFlag2Line,
  RiFolderLine,
  RiImageLine,
  RiMoneyDollarCircleLine,
  RiMusicLine,
  RiNotification3Line,
  RiPlayFill,
  RiScissorsLine,
  RiTimeLine,
  RiUploadCloud2Line,
  RiUserAddLine,
  RiVerifiedBadgeFill,
  RiVideoLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* -------------------------------------------------------------------------- */
/*  Shared                                                                     */
/* -------------------------------------------------------------------------- */

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

type Tone = "neutral" | "lime" | "rose" | "blue" | "yellow";

const TONES: Record<Tone, string> = {
  neutral: "bg-background-tertiary-default text-text-secondary",
  lime: "bg-status-lime-background text-status-lime-text",
  rose: "bg-status-rose-background text-status-rose-text",
  blue: "bg-status-blue-background text-status-blue-text",
  yellow: "bg-status-yellow-background text-status-yellow-text",
};

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";
const card = "w-full max-w-[320px] rounded-xl border border-border-button-default bg-background-primary-default shadow-card";
const buttonBase =
  "inline-flex items-center justify-center gap-1 rounded-lg text-caption-2-semibold " +
  "transition-[transform,opacity,background-color,color,box-shadow] duration-150 ease-out " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 " +
  "motion-reduce:transition-none motion-reduce:active:scale-100";
const primaryButton = cx(buttonBase, "h-7 bg-button-primary px-2 text-text-white shadow-xs", focusRing);
const secondaryButton = cx(
  buttonBase,
  "h-7 border border-border-button-default bg-background-primary-default px-2 text-text-primary shadow-xs hover:bg-background-primary-hover",
  focusRing,
);
const quietButton = cx(
  buttonBase,
  "h-6 px-1.5 text-text-secondary hover:bg-background-secondary-default hover:text-text-primary",
  focusRing,
);
const revealGrid = "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none";

const number = new Intl.NumberFormat("en-US");
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const usdCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatSeconds = (value: number) => {
  const total = Math.round(value * 10);
  const minutes = Math.floor(total / 600);
  const seconds = Math.floor((total % 600) / 10);
  const tenths = total % 10;
  return `${minutes}:${String(seconds).padStart(2, "0")}.${tenths}`;
};

function Pill({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-0.5 text-caption-2-medium tabular-nums",
        TONES[tone],
      )}
    >
      {children}
    </span>
  );
}

function CardHead({ icon: Icon, label, aside }: { icon: IconComponent; label: string; aside?: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
        <Icon className="size-3.5" aria-hidden />
      </span>
      <h3 className="min-w-0 flex-1 truncate text-body-2-semibold text-text-primary">{label}</h3>
      {aside}
    </div>
  );
}

function Segments<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { id: T; label: string; ariaLabel?: string }[];
  onChange: (id: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="flex shrink-0 rounded-md bg-background-tertiary-default p-0.5">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={value === option.id}
          aria-label={option.ariaLabel ?? option.label}
          onClick={() => onChange(option.id)}
          className={cx(
            "h-5 rounded-sm px-1.5 text-caption-2-semibold transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
            focusRing,
            value === option.id
              ? "bg-segmented-control-selected-background text-text-primary shadow-xs"
              : "text-text-tertiary hover:text-text-secondary",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function MiniSelect({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="relative min-w-0 flex-1">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cx(
          "h-7 w-full appearance-none rounded-lg border border-border-button-default bg-background-primary-default ps-1.5 pe-5 text-caption-1-medium text-text-primary shadow-xs outline-none",
          focusRing,
        )}
      >
        {children}
      </select>
      <RiArrowDownSLine
        aria-hidden
        className="pointer-events-none absolute end-1.5 top-1/2 size-3 -translate-y-1/2 text-foreground-icon-tertiary"
      />
    </div>
  );
}

type ThumbVariant = "sunset" | "signal" | "paper";

const THUMB_OPTIONS: { id: ThumbVariant; name: string; note: string }[] = [
  { id: "sunset", name: "Last light", note: "Warm, cinematic" },
  { id: "signal", name: "Signal", note: "Graphic, high contrast" },
  { id: "paper", name: "Field notes", note: "Type-led, minimal" },
];

function ThumbArt({
  variant,
  className,
  label = false,
}: {
  variant: ThumbVariant;
  className?: string;
  label?: boolean;
}) {
  return (
    <span aria-hidden className={cx("relative block overflow-hidden bg-accent-950", className)}>
      {variant === "sunset" && (
        <>
          <span className="absolute inset-0 bg-linear-to-b from-accent-400 via-chart-3 to-accent-900" />
          <span className="absolute bottom-2 end-3 size-6 rounded-full bg-status-yellow-background shadow-xs" />
          <span className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-accent-950/90 to-transparent" />
          <span className="absolute inset-x-2 bottom-1.5 h-0.5 rounded-full bg-text-white/70" />
        </>
      )}
      {variant === "signal" && (
        <>
          <span className="absolute inset-0 bg-linear-to-br from-accent-700 via-chart-5 to-accent-950" />
          <span className="absolute inset-1.5 rounded-sm border border-chart-2/40" />
          <span className="absolute inset-x-1.5 top-1/2 h-px bg-chart-2/50" />
          <span className="absolute inset-y-1.5 start-1/2 w-px bg-chart-2/50" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="size-3 rounded-full bg-chart-2 shadow-xs" />
          </span>
        </>
      )}
      {variant === "paper" && (
        <>
          <span className="absolute inset-0 bg-background-tertiary-default" />
          <span className="absolute inset-y-0 start-0 w-1/3 bg-accent-600" />
          <span className="absolute start-[38%] top-2 h-1 w-1/2 rounded-full bg-text-primary/80" />
          <span className="absolute start-[38%] top-3.5 h-0.5 w-2/5 rounded-full bg-text-secondary/60" />
          <span className="absolute start-[38%] bottom-2 h-0.5 w-1/3 rounded-full bg-text-secondary/60" />
        </>
      )}
      {label && (
        <span className="absolute bottom-1 start-1.5 rounded-sm bg-accent-950/60 px-1 py-px text-caption-2-semibold text-text-white backdrop-blur-sm">
          {variant === "sunset" ? "LAST LIGHT" : variant === "signal" ? "SIGNAL" : "NOTES"}
        </span>
      )}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  1. Upload wizard                                                           */
/* -------------------------------------------------------------------------- */

const UPLOAD_STEPS = ["File", "Thumbnail", "Details", "Publish"] as const;
const UPLOAD_FILE = { name: "ep-142-rough-cut.mp4", meta: "2.4 GB · 18:42" };

export function UploadWizard() {
  const titleId = useId();
  const [step, setStep] = useState(0);
  const [thumb, setThumb] = useState<ThumbVariant>("sunset");
  const [title, setTitle] = useState("The causeway at high tide");
  const [published, setPublished] = useState(false);
  const last = UPLOAD_STEPS.length - 1;
  const selectedThumb = THUMB_OPTIONS.find((option) => option.id === thumb) ?? THUMB_OPTIONS[0];

  return (
    <section aria-label="Upload wizard" className={cx(card, "p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent-600 text-text-white shadow-xs">
          <RiUploadCloud2Line className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-caption-2-semibold tracking-wide text-text-tertiary uppercase">New upload</p>
          <h3 className="truncate text-body-2-semibold text-text-primary">Episode 142</h3>
        </div>
        <span aria-live="polite" className="shrink-0 text-caption-2-regular text-text-tertiary tabular-nums">
          {published ? "Live" : `${step + 1} of ${UPLOAD_STEPS.length} · ${UPLOAD_STEPS[step]}`}
        </span>
      </div>

      <div className="mt-2 flex gap-1" aria-hidden>
        {UPLOAD_STEPS.map((label, index) => (
          <span
            key={label}
            className={cx(
              "h-1 flex-1 rounded-full transition-[background-color] duration-200 ease-out motion-reduce:transition-none",
              index <= step || published ? "bg-accent-500" : "bg-background-tertiary-default",
            )}
          />
        ))}
      </div>

      <div key={published ? "done" : step} className="flex min-h-[80px] animate-label-in flex-col justify-center motion-reduce:animate-none">
        {published ? (
          <div className="flex items-start gap-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-status-lime-background text-status-lime-text">
              <RiCheckLine className="size-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p role="status" className="text-body-2-semibold text-text-primary">Episode is live</p>
              <p className="mt-0.5 text-caption-2-regular text-text-secondary">Published to 128,431 subscribers. Captions and chapters attached.</p>
            </div>
          </div>
        ) : step === 0 ? (
          <div>
            <div className="flex items-center gap-2 rounded-lg border border-separator-border bg-background-secondary-default p-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background-primary-default text-accent-600 shadow-xs">
                <RiVideoLine className="size-3.5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p dir="ltr" className="truncate text-start text-caption-1-semibold text-text-primary">{UPLOAD_FILE.name}</p>
                <p className="text-caption-2-regular text-text-tertiary tabular-nums">{UPLOAD_FILE.meta}</p>
              </div>
              <Pill tone="lime">Ready</Pill>
            </div>
            <p className="mt-1 text-caption-2-regular text-text-tertiary">ProRes 422 · 4K · stereo mix checked</p>
          </div>
        ) : step === 1 ? (
          <div>
            <div role="group" aria-label="Choose a thumbnail" className="grid grid-cols-3 gap-1.5">
              {THUMB_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={thumb === option.id}
                  aria-label={`${option.name} thumbnail`}
                  onClick={() => setThumb(option.id)}
                  className={cx(
                    "rounded-md p-0.5 transition-[background-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                    focusRing,
                    thumb === option.id ? "bg-accent-500/20 ring-1 ring-accent-500" : "bg-background-tertiary-default hover:bg-background-secondary-hover",
                  )}
                >
                  <ThumbArt variant={option.id} className="aspect-video w-full rounded-sm" />
                </button>
              ))}
            </div>
            <p className="mt-1 text-caption-2-regular text-text-tertiary">{selectedThumb.name} · 1280 × 720 JPG</p>
          </div>
        ) : step === 2 ? (
          <div className="flex flex-col gap-1">
            <label htmlFor={titleId} className="text-caption-2-medium text-text-secondary">Episode title</label>
            <input
              id={titleId}
              value={title}
              maxLength={80}
              onChange={(event) => setTitle(event.target.value)}
              className={cx(
                "h-7 w-full rounded-lg bg-background-tertiary-default px-2 text-caption-1-medium text-text-primary outline-none placeholder:text-text-placeholder",
                focusRing,
              )}
            />
            <div className="flex items-center justify-between gap-2 text-caption-2-regular text-text-tertiary">
              <span>Public · notifications on</span>
              <span className="tabular-nums">{title.length}/80</span>
            </div>
          </div>
        ) : (
          <div>
            <dl className="flex flex-col gap-1">
              {[
                ["File", UPLOAD_FILE.name],
                ["Cover", selectedThumb.name],
                ["Title", title],
              ].map(([term, value]) => (
                <div key={term} className="flex items-center justify-between gap-2">
                  <dt className="shrink-0 text-caption-2-regular text-text-tertiary">{term}</dt>
                  <dd className="min-w-0 truncate text-caption-2-medium text-text-primary">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-1 text-caption-2-regular text-text-tertiary">Goes out at 09:00 GMT to 128,431 subscribers.</p>
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center gap-2">
        {published ? (
          <button type="button" onClick={() => { setPublished(false); setStep(0); }} className={cx(primaryButton, "w-full")}>
            <RiUploadCloud2Line className="size-3.5" aria-hidden />
            Upload another
          </button>
        ) : (
          <>
            <button type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className={cx(secondaryButton, "shrink-0")}>
              <RiArrowLeftLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
              Back
            </button>
            <button
              type="button"
              onClick={() => (step === last ? setPublished(true) : setStep(step + 1))}
              disabled={step === 2 && !title.trim()}
              className={cx(primaryButton, "min-w-0 flex-1")}
            >
              {step === last ? "Publish episode" : "Continue"}
              {step === last ? (
                <RiUploadCloud2Line className="size-3.5" aria-hidden />
              ) : (
                <RiArrowRightLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
              )}
            </button>
          </>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  2. Thumbnail picker                                                        */
/* -------------------------------------------------------------------------- */

export function ThumbnailPicker() {
  const [selected, setSelected] = useState<ThumbVariant>("signal");
  const [applied, setApplied] = useState(false);
  const active = THUMB_OPTIONS.find((option) => option.id === selected) ?? THUMB_OPTIONS[0];

  return (
    <section aria-label="Thumbnail picker" className={cx(card, "p-2.5")}>
      <CardHead
        icon={RiImageLine}
        label="Choose a thumbnail"
        aside={<span className="text-caption-2-regular text-text-tertiary">3 options</span>}
      />

      <div role="group" aria-label="Thumbnail options" className="mt-2 grid grid-cols-3 gap-1.5">
        {THUMB_OPTIONS.map((option) => {
          const isSelected = selected === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => {
                setSelected(option.id);
                setApplied(false);
              }}
              className={cx(
                "group flex flex-col gap-1 rounded-lg border p-1 text-start",
                "transition-[background-color,border-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                isSelected
                  ? "border-accent-500 bg-background-secondary-default shadow-xs"
                  : "border-border-button-default bg-background-primary-default hover:bg-background-primary-hover",
              )}
            >
              <span className="relative block w-full">
                <span className="block overflow-hidden rounded-md">
                  <ThumbArt
                    variant={option.id}
                    label
                    className={cx(
                      "aspect-video w-full transition-transform duration-200 ease-out motion-reduce:transition-none",
                      isSelected ? "scale-100" : "scale-[0.97] group-hover:scale-100",
                    )}
                  />
                </span>
                <span
                  className={cx(
                    "absolute end-1 top-1 flex size-4 items-center justify-center rounded-full bg-background-primary-default text-text-primary shadow-xs",
                    "transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none",
                    isSelected ? "scale-100 opacity-100" : "scale-75 opacity-0",
                  )}
                >
                  <RiCheckLine className="size-3" aria-hidden />
                </span>
              </span>
              <span className="w-full truncate text-center text-caption-2-medium text-text-primary">{option.name}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-1-semibold text-text-primary">{active.name}</p>
          <p className="truncate text-caption-2-regular text-text-tertiary">{active.note} · 1280 × 720</p>
        </div>
        <button
          type="button"
          onClick={() => setApplied(true)}
          disabled={applied}
          className={cx(applied ? secondaryButton : primaryButton, "shrink-0")}
        >
          {applied ? (
            <>
              <RiCheckLine className="size-3.5" aria-hidden />
              Applied
            </>
          ) : (
            "Use cover"
          )}
        </button>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  3. Monetization card                                                       */
/* -------------------------------------------------------------------------- */

const REVENUE_PERIODS = {
  month: {
    tab: "Nov",
    label: "This month",
    revenue: 4218.6,
    rpm: 12.4,
    delta: 18.2,
    payoutLabel: "Next payout",
    payout: "Nov 21",
    payoutNote: "in 16 days",
    progress: 84,
  },
  last: {
    tab: "Oct",
    label: "Last month",
    revenue: 3567.2,
    rpm: 10.8,
    delta: 9.6,
    payoutLabel: "Last payout",
    payout: "Nov 7",
    payoutNote: "settled",
    progress: 100,
  },
} as const;

type RevenuePeriod = keyof typeof REVENUE_PERIODS;
const REVENUE_TABS: { id: RevenuePeriod; label: string; ariaLabel: string }[] = [
  { id: "month", label: "Nov", ariaLabel: "This month" },
  { id: "last", label: "Oct", ariaLabel: "Last month" },
];

export function MonetizationCard() {
  const [period, setPeriod] = useState<RevenuePeriod>("month");
  const data = REVENUE_PERIODS[period];

  return (
    <section aria-label="Monetization summary" className={cx(card, "p-2.5")}>
      <CardHead
        icon={RiMoneyDollarCircleLine}
        label="Monetization"
        aside={<Segments label="Revenue period" value={period} options={REVENUE_TABS} onChange={setPeriod} />}
      />

      <div aria-live="polite" className="mt-2 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="text-caption-2-regular text-text-tertiary">Estimated revenue</p>
          <p key={period} className="animate-number-fade text-title-2-semibold text-text-primary tabular-nums motion-reduce:animate-none">
            {usdCents.format(data.revenue)}
          </p>
        </div>
        <Pill tone={data.delta >= 0 ? "lime" : "rose"}>
          {data.delta >= 0 ? <RiArrowUpLine className="size-3" aria-hidden /> : <RiArrowDownLine className="size-3" aria-hidden />}
          {Math.abs(data.delta).toFixed(1)}%
        </Pill>
      </div>

      <dl className="mt-1.5 grid grid-cols-2 gap-2 border-y border-separator-border py-1.5">
        <div className="min-w-0">
          <dt className="text-caption-2-regular text-text-tertiary">RPM</dt>
          <dd className="text-caption-1-semibold text-text-primary tabular-nums">{usdCents.format(data.rpm)}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-caption-2-regular text-text-tertiary">{data.payoutLabel}</dt>
          <dd className="truncate text-caption-1-semibold text-text-primary tabular-nums">
            {data.payout} <span className="text-caption-2-regular text-text-tertiary">· {data.payoutNote}</span>
          </dd>
        </div>
      </dl>

      <div className="mt-1.5">
        <div className="flex items-baseline justify-between gap-2 text-caption-2-regular">
          <span className="text-text-tertiary">Payout cycle</span>
          <span className="text-text-secondary tabular-nums">{data.progress}%</span>
        </div>
        <div
          role="progressbar"
          aria-label="Payout cycle progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={data.progress}
          className="mt-1 h-1 overflow-hidden rounded-full bg-background-tertiary-default"
        >
          <div
            className="h-full rounded-full bg-accent-500 transition-[width] duration-200 ease-out motion-reduce:transition-none"
            style={{ width: `${data.progress}%` }}
          />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  4. Analytics row                                                           */
/* -------------------------------------------------------------------------- */

const RANGE_ORDER = ["7d", "28d", "90d"] as const;
type RangeKey = (typeof RANGE_ORDER)[number];

const ANALYTICS: Record<
  RangeKey,
  { views: string; watch: string; ctr: string; deltas: [number, number, number]; note: string }
> = {
  "7d": {
    views: "84.2K",
    watch: "6,210 h",
    ctr: "7.4%",
    deltas: [12.4, 8.1, 1.8],
    note: "Saturday at 18:00 is your strongest slot.",
  },
  "28d": {
    views: "412.8K",
    watch: "38,540 h",
    ctr: "6.9%",
    deltas: [18.2, 11.4, -0.8],
    note: "Views are up 18% on the previous 28 days.",
  },
  "90d": {
    views: "1.28M",
    watch: "121,800 h",
    ctr: "6.1%",
    deltas: [32.6, 24.9, -2.4],
    note: "Shorts drive 61% of new viewers this quarter.",
  },
};

export function AnalyticsRow() {
  const [range, setRange] = useState<RangeKey>("28d");
  const current = ANALYTICS[range];
  const stats = [
    { key: "views", label: "Views", value: current.views, delta: current.deltas[0] },
    { key: "watch", label: "Watch time", value: current.watch, delta: current.deltas[1] },
    { key: "ctr", label: "CTR", value: current.ctr, delta: current.deltas[2] },
  ];

  return (
    <section aria-label="Channel analytics" className={cx(card, "p-2.5")}>
      <CardHead
        icon={RiBarChartBoxLine}
        label="Analytics"
        aside={
          <Segments
            label="Analytics range"
            value={range}
            options={RANGE_ORDER.map((option) => ({ id: option, label: option, ariaLabel: `Last ${option}` }))}
            onChange={setRange}
          />
        }
      />

      <dl aria-live="polite" className="mt-2 grid grid-cols-3 gap-2">
        {stats.map((stat) => (
          <div key={stat.key} className="min-w-0">
            <dt className="truncate text-caption-2-regular text-text-tertiary">{stat.label}</dt>
            <dd
              key={`${range}-${stat.key}`}
              className="animate-number-fade truncate text-title-3-semibold text-text-primary tabular-nums motion-reduce:animate-none"
            >
              {stat.value}
            </dd>
            <span
              className={cx(
                "inline-flex items-center gap-0.5 text-caption-2-medium tabular-nums",
                stat.delta >= 0 ? "text-status-lime-text" : "text-status-rose-text",
              )}
            >
              {stat.delta >= 0 ? (
                <RiArrowUpLine className="size-3" aria-hidden />
              ) : (
                <RiArrowDownLine className="size-3" aria-hidden />
              )}
              {Math.abs(stat.delta).toFixed(1)}%
            </span>
          </div>
        ))}
      </dl>

      <p className="mt-2 truncate text-caption-2-regular text-text-tertiary">{current.note}</p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  5. Comment moderation                                                      */
/* -------------------------------------------------------------------------- */

type Moderation = "pending" | "approved" | "hidden" | "reported";

type Comment = { id: string; author: string; initials: string; time: string; text: string; flagged?: boolean };

const COMMENTS: Comment[] = [
  {
    id: "dana",
    author: "Dana Whitfield",
    initials: "DW",
    time: "2m",
    text: "The pacing at 4:12 is perfect. Watched it twice.",
  },
  {
    id: "marc",
    author: "Marc Osei",
    initials: "MO",
    time: "9m",
    text: "Could you link the lens you used for the night shots?",
    flagged: true,
  },
];

const MOD_ACTIONS = [
  { status: "approved", label: "Approve", icon: RiCheckLine },
  { status: "hidden", label: "Hide", icon: RiEyeOffLine },
  { status: "reported", label: "Report", icon: RiFlag2Line },
] as const;

const MOD_META: Record<Exclude<Moderation, "pending">, { label: string; tone: Tone }> = {
  approved: { label: "Approved", tone: "lime" },
  hidden: { label: "Hidden", tone: "yellow" },
  reported: { label: "Reported", tone: "rose" },
};

export function CommentModeration() {
  const [statuses, setStatuses] = useState<Record<string, Moderation>>({ dana: "pending", marc: "pending" });
  const [announcement, setAnnouncement] = useState("");
  const pending = COMMENTS.filter((comment) => statuses[comment.id] === "pending").length;

  const moderate = (comment: Comment, next: Exclude<Moderation, "pending">) => {
    setStatuses((current) => ({ ...current, [comment.id]: next }));
    const left = COMMENTS.filter(
      (item) => item.id !== comment.id && statuses[item.id] === "pending",
    ).length;
    setAnnouncement(`${comment.author} ${MOD_META[next].label.toLowerCase()}. ${left} left in the queue.`);
  };

  const restore = (comment: Comment) => {
    setStatuses((current) => ({ ...current, [comment.id]: "pending" }));
    setAnnouncement(`${comment.author} restored to the queue.`);
  };

  return (
    <section aria-label="Comment moderation" className={cx(card, "p-2.5")}>
      <CardHead
        icon={RiChat3Line}
        label="Comment moderation"
        aside={
          <span className="flex shrink-0 items-center gap-1 text-caption-2-medium text-text-tertiary tabular-nums">
            {pending === 0 && <RiCheckLine className="size-3 text-status-lime-text" aria-hidden />}
            {pending === 0 ? "Queue clear" : `${pending} pending`}
          </span>
        }
      />

      <ul className="mt-1.5 flex flex-col gap-1.5">
        {COMMENTS.map((comment) => {
          const status = statuses[comment.id];
          return (
            <li
              key={comment.id}
              className={cx(
                "rounded-lg border p-1 transition-[background-color,border-color] duration-200 ease-out motion-reduce:transition-none",
                status === "pending"
                  ? "border-separator-border bg-background-secondary-default"
                  : "border-transparent bg-background-secondary-default/60",
              )}
            >
              <div className="flex items-start gap-1.5">
                <span
                  aria-hidden
                  className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-100 text-caption-2-semibold text-accent-700"
                >
                  {comment.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex min-w-0 items-center gap-1 text-caption-2-semibold text-text-primary">
                    <span className="truncate">{comment.author}</span>
                    <span className="shrink-0 text-caption-2-regular text-text-tertiary">{comment.time}</span>
                    {comment.flagged && <Pill tone="rose">Flagged</Pill>}
                  </p>
                  <p className="truncate text-caption-2-regular text-text-secondary">{comment.text}</p>
                </div>
              </div>

              <div className="mt-1 flex h-5 items-center gap-1 ps-7">
                {status === "pending" ? (
                  MOD_ACTIONS.map((action) => {
                    const ActionIcon = action.icon;
                    return (
                      <button
                        key={action.status}
                        type="button"
                        aria-label={`${action.label} comment by ${comment.author}`}
                        onClick={() => moderate(comment, action.status)}
                        className={cx(
                          "inline-flex h-5 items-center gap-0.5 rounded-md px-1 text-caption-2-medium text-text-secondary",
                          "transition-[background-color,color] duration-150 ease-out hover:bg-background-tertiary-default hover:text-text-primary motion-reduce:transition-none",
                          focusRing,
                        )}
                      >
                        <ActionIcon className="size-3" aria-hidden />
                        {action.label}
                      </button>
                    );
                  })
                ) : (
                  <span key={status} className="flex animate-label-in items-center gap-1.5 motion-reduce:animate-none">
                    <Pill tone={MOD_META[status].tone}>{MOD_META[status].label}</Pill>
                    <button
                      type="button"
                      onClick={() => restore(comment)}
                      className={cx(
                        "rounded-sm text-caption-2-medium text-text-tertiary underline-offset-2 transition-colors duration-150 ease-out hover:text-text-primary hover:underline motion-reduce:transition-none",
                        focusRing,
                      )}
                    >
                      Undo
                    </button>
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <p role="status" className="sr-only">
        {announcement}
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  6. Schedule post                                                           */
/* -------------------------------------------------------------------------- */

const POST_DAYS = [
  { id: "fri", weekday: "Fri", day: "6", full: "Fri, Nov 6" },
  { id: "sat", weekday: "Sat", day: "7", full: "Sat, Nov 7" },
  { id: "sun", weekday: "Sun", day: "8", full: "Sun, Nov 8" },
] as const;

type PostDay = (typeof POST_DAYS)[number]["id"];

const POST_TIMES = ["09:00", "12:30", "18:00"] as const;

const POST_ZONES = [
  { id: "pt", city: "Los Angeles", offset: "GMT−8" },
  { id: "et", city: "New York", offset: "GMT−5" },
  { id: "gmt", city: "London", offset: "GMT+0" },
  { id: "cet", city: "Berlin", offset: "GMT+1" },
] as const;

export function SchedulePost() {
  const baseId = useId();
  const [day, setDay] = useState<PostDay>("sat");
  const [time, setTime] = useState<string>("18:00");
  const [zone, setZone] = useState<string>("cet");
  const [scheduled, setScheduled] = useState(false);
  const activeDay = POST_DAYS.find((item) => item.id === day) ?? POST_DAYS[0];
  const activeZone = POST_ZONES.find((item) => item.id === zone) ?? POST_ZONES[2];

  const touch = () => setScheduled(false);

  return (
    <section aria-label="Schedule post" className={cx(card, "p-2.5")}>
      <CardHead
        icon={RiCalendarScheduleLine}
        label="Schedule post"
        aside={<span className="text-caption-2-regular text-text-tertiary">Draft</span>}
      />

      <div role="group" aria-label="Publish date" className="mt-1.5 grid grid-cols-3 gap-1.5">
        {POST_DAYS.map((item) => {
          const active = item.id === day;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setDay(item.id);
                touch();
              }}
              className={cx(
                "flex h-7 items-center justify-center gap-1 rounded-lg border transition-[background-color,border-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                active ? "border-accent-500 bg-background-secondary-default shadow-xs" : "border-border-button-default bg-background-primary-default hover:bg-background-primary-hover",
              )}
            >
              <span className={cx("text-caption-2-regular", active ? "text-text-secondary" : "text-text-tertiary")}>{item.weekday}</span>
              <span className="text-body-2-semibold text-text-primary tabular-nums">{item.day}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-1.5 flex gap-1.5">
        <MiniSelect id={`${baseId}-time`} label="Time" value={time} onChange={(value) => { setTime(value); touch(); }}>
          {POST_TIMES.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </MiniSelect>

        <MiniSelect id={`${baseId}-zone`} label="Timezone" value={zone} onChange={(value) => { setZone(value); touch(); }}>
          {POST_ZONES.map((item) => (
            <option key={item.id} value={item.id}>{item.city}</option>
          ))}
        </MiniSelect>
      </div>

      <div className="mt-1.5 flex items-center gap-1.5 rounded-lg bg-background-secondary-default px-2 py-1">
        <RiTimeLine className="size-3.5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
        <div aria-live="polite" aria-atomic="true" className="min-w-0 flex-1">
          <p
            key={`${day}-${time}-${zone}`}
            className="animate-number-fade truncate text-caption-1-medium text-text-primary tabular-nums motion-reduce:animate-none"
          >
            {activeDay.full} · {time} · {activeZone.offset}
          </p>
        </div>
      </div>

      <button
        type="button"
        aria-pressed={scheduled}
        aria-label={scheduled ? "Cancel scheduled post" : `Schedule post for ${activeDay.full} at ${time}`}
        onClick={() => setScheduled((current) => !current)}
        className={cx(scheduled ? secondaryButton : primaryButton, "mt-1.5 w-full")}
      >
        {scheduled ? (
          <><RiCheckLine className="size-3.5" aria-hidden />Scheduled</>
        ) : (
          <><RiCalendarCheckLine className="size-3.5" aria-hidden />Schedule post</>
        )}
      </button>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  7. Asset library                                                           */
/* -------------------------------------------------------------------------- */

const ASSET_FILTERS = ["All", "B-roll", "A-roll", "Audio"] as const;
type AssetFilter = (typeof ASSET_FILTERS)[number];
type AssetKind = Exclude<AssetFilter, "All">;

type AssetClip = { id: string; name: string; kind: AssetKind; duration: string; tone: string };

const ASSET_CLIPS: AssetClip[] = [
  {
    id: "harbour",
    name: "Harbour at dawn",
    kind: "B-roll",
    duration: "0:24",
    tone: "bg-linear-to-br from-accent-500 via-chart-4 to-accent-800",
  },
  {
    id: "interview",
    name: "Maya, take 3",
    kind: "A-roll",
    duration: "2:08",
    tone: "bg-linear-to-br from-chart-3 via-accent-600 to-accent-900",
  },
  {
    id: "rain",
    name: "Rain on tin",
    kind: "Audio",
    duration: "1:12",
    tone: "bg-linear-to-br from-chart-5 via-accent-700 to-accent-950",
  },
];

export function AssetLibrary() {
  const [filter, setFilter] = useState<AssetFilter>("All");
  const [selected, setSelected] = useState("harbour");
  const clips = filter === "All" ? ASSET_CLIPS : ASSET_CLIPS.filter((clip) => clip.kind === filter);
  const active = ASSET_CLIPS.find((clip) => clip.id === selected) ?? ASSET_CLIPS[0];

  return (
    <section aria-label="Asset library" className={cx(card, "p-2.5")}>
      <CardHead
        icon={RiFolderLine}
        label="Asset library"
        aside={
          <span aria-live="polite" className="text-caption-2-regular text-text-tertiary tabular-nums">
            {clips.length} {clips.length === 1 ? "clip" : "clips"}
          </span>
        }
      />

      <div role="group" aria-label="Filter clips by type" className="mt-1.5 flex items-center gap-1">
        {ASSET_FILTERS.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={filter === option}
            onClick={() => setFilter(option)}
            className={cx(
              "h-5 rounded-full px-1.5 text-caption-2-medium transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
              focusRing,
              filter === option
                ? "bg-accent-600 text-text-white"
                : "bg-background-tertiary-default text-text-tertiary hover:text-text-secondary",
            )}
          >
            {option}
          </button>
        ))}
      </div>

      <div key={filter} className="mt-1.5 flex animate-label-in flex-col gap-0.5 motion-reduce:animate-none">
        {clips.map((clip) => {
          const isSelected = selected === clip.id;
          return (
            <button
              key={clip.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelected(clip.id)}
              className={cx(
                "group flex w-full items-center gap-1.5 rounded-md p-0.5 text-start",
                "transition-[background-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                isSelected ? "bg-background-secondary-default ring-1 ring-accent-500/50" : "hover:bg-background-secondary-default",
              )}
            >
              <span aria-hidden className={cx("relative h-6 w-9 shrink-0 overflow-hidden rounded-sm", clip.tone)}>
                <span className="absolute inset-0 bg-linear-to-t from-accent-950/55 to-transparent" />
                <span className="absolute bottom-0.5 start-0.5 flex size-3 items-center justify-center rounded-full bg-accent-950/35 text-text-white">
                  {clip.kind === "Audio" ? (
                    <RiMusicLine className="size-2" />
                  ) : (
                    <RiPlayFill className="size-2" />
                  )}
                </span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-caption-2-semibold text-text-primary">{clip.name}</span>
                <span className="block truncate text-caption-2-regular text-text-tertiary">
                  {clip.kind} · {clip.duration}
                </span>
              </span>
              <RiCheckLine
                className={cx(
                  "size-3 shrink-0 text-accent-600 transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none",
                  isSelected ? "scale-100 opacity-100" : "scale-75 opacity-0",
                )}
                aria-hidden
              />
            </button>
          );
        })}
      </div>

      <p className="mt-1.5 flex items-center gap-1 truncate text-caption-2-regular text-text-tertiary">
        <RiVideoLine className="size-3 shrink-0" aria-hidden />
        <span className="truncate">
          Selected · {active.name} · {active.duration}
        </span>
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  8. Clip trimmer                                                            */
/* -------------------------------------------------------------------------- */

const SOURCE_DURATION = 24;
const TRIM_FRAMES = [
  "bg-linear-to-br from-accent-700 to-chart-4",
  "bg-linear-to-br from-chart-3 to-accent-800",
  "bg-linear-to-br from-accent-500 to-chart-5",
  "bg-linear-to-br from-chart-1 to-accent-700",
  "bg-linear-to-br from-accent-600 to-chart-2",
  "bg-linear-to-br from-chart-4 to-accent-900",
] as const;

export function ClipTrimmer() {
  const inId = useId();
  const outId = useId();
  const [inPoint, setInPoint] = useState(3.2);
  const [outPoint, setOutPoint] = useState(14.8);
  const duration = outPoint - inPoint;

  const updateIn = (value: number) => {
    const next = Math.round(Math.min(Math.max(0, outPoint - 0.4), Math.max(0, value)) * 10) / 10;
    setInPoint(next);
  };

  const updateOut = (value: number) => {
    const next = Math.round(Math.max(inPoint + 0.4, Math.min(SOURCE_DURATION, value)) * 10) / 10;
    setOutPoint(next);
  };

  const reset = () => {
    setInPoint(3.2);
    setOutPoint(14.8);
  };

  const inPercent = (inPoint / SOURCE_DURATION) * 100;
  const outPercent = (outPoint / SOURCE_DURATION) * 100;

  return (
    <section aria-label="Clip trimmer" className={cx(card, "p-2.5")}>
      <CardHead
        icon={RiScissorsLine}
        label="Clip trimmer"
        aside={
          <Pill tone="blue">
            <RiTimeLine className="size-3" aria-hidden />
            <span key={duration} className="animate-number-fade tabular-nums motion-reduce:animate-none">
              {formatSeconds(duration)}
            </span>
          </Pill>
        }
      />

      <div dir="ltr" className="relative mt-2 h-12 overflow-hidden rounded-lg bg-background-tertiary-default">
        <div className="absolute inset-0 flex gap-px opacity-90" aria-hidden>
          {TRIM_FRAMES.map((tone, index) => (
            <span key={index} className={cx("h-full flex-1", tone)} />
          ))}
        </div>
        <span aria-hidden className="absolute inset-y-0 bg-accent-950/55" style={{ left: 0, width: `${inPercent}%` }} />
        <span aria-hidden className="absolute inset-y-0 bg-accent-950/55" style={{ left: `${outPercent}%`, right: 0 }} />
        <span
          aria-hidden
          className="absolute inset-y-0 border-y-2 border-accent-500 bg-accent-500/10 transition-[left,width] duration-150 ease-out motion-reduce:transition-none"
          style={{ left: `${inPercent}%`, width: `${outPercent - inPercent}%` }}
        />
        <span
          aria-hidden
          className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-accent-400 transition-[left] duration-150 ease-out motion-reduce:transition-none"
          style={{ left: `${inPercent}%` }}
        />
        <span
          aria-hidden
          className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-accent-400 transition-[left] duration-150 ease-out motion-reduce:transition-none"
          style={{ left: `${outPercent}%` }}
        />
      </div>

      <div className="mt-2 flex flex-col gap-1">
        <label htmlFor={inId} className="flex items-center gap-2">
          <span className="w-5 shrink-0 text-caption-2-medium text-text-secondary">In</span>
          <input
            id={inId}
            type="range"
            min={0}
            max={outPoint - 0.4}
            step={0.1}
            value={inPoint}
            aria-valuetext={formatSeconds(inPoint)}
            onChange={(event) => updateIn(Number(event.target.value))}
            className={cx("min-w-0 flex-1 accent-accent-600", focusRing)}
          />
          <span className="w-12 shrink-0 text-end text-caption-2-regular text-text-secondary tabular-nums">
            {formatSeconds(inPoint)}
          </span>
        </label>

        <label htmlFor={outId} className="flex items-center gap-2">
          <span className="w-5 shrink-0 text-caption-2-medium text-text-secondary">Out</span>
          <input
            id={outId}
            type="range"
            min={inPoint + 0.4}
            max={SOURCE_DURATION}
            step={0.1}
            value={outPoint}
            aria-valuetext={formatSeconds(outPoint)}
            onChange={(event) => updateOut(Number(event.target.value))}
            className={cx("min-w-0 flex-1 accent-accent-600", focusRing)}
          />
          <span className="w-12 shrink-0 text-end text-caption-2-regular text-text-secondary tabular-nums">
            {formatSeconds(outPoint)}
          </span>
        </label>
      </div>

      <div className="mt-1 flex items-center justify-between gap-2 text-caption-2-regular text-text-tertiary">
        <span className="tabular-nums">1080 × 1920 · 24 fps</span>
        <button type="button" onClick={reset} className={cx(quietButton, "h-5 px-1")}>
          Reset
        </button>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  9. Caption editor                                                          */
/* -------------------------------------------------------------------------- */

type CaptionCue = { id: string; start: string; end: string; seconds: number; text: string };

const CAPTION_CUES: CaptionCue[] = [
  { id: "c1", start: "0:02", end: "0:05", seconds: 3, text: "The tide comes in faster than the map says." },
  { id: "c2", start: "0:07", end: "0:11", seconds: 4, text: "We had eleven minutes before the causeway closed." },
  { id: "c3", start: "0:13", end: "0:16", seconds: 3, text: "Nobody argued. We just ran." },
];

export function CaptionEditor() {
  const textId = useId();
  const [cues, setCues] = useState<CaptionCue[]>(CAPTION_CUES);
  const [activeId, setActiveId] = useState("c1");
  const [captionsOn, setCaptionsOn] = useState(true);
  const active = cues.find((cue) => cue.id === activeId) ?? cues[0];

  const updateText = (value: string) => {
    setCues((current) => current.map((cue) => (cue.id === active.id ? { ...cue, text: value } : cue)));
  };

  return (
    <section aria-label="Caption editor" className={cx(card, "p-2.5")}>
      <CardHead
        icon={RiClosedCaptioningLine}
        label="Captions"
        aside={
          <button
            type="button"
            aria-pressed={captionsOn}
            aria-label={captionsOn ? "Hide caption overlay" : "Show caption overlay"}
            onClick={() => setCaptionsOn((current) => !current)}
            className={cx(
              "inline-flex h-5 items-center gap-1 rounded-md px-1.5 text-caption-2-semibold",
              "transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
              captionsOn
                ? "bg-accent-600 text-text-white"
                : "bg-background-tertiary-default text-text-tertiary hover:text-text-secondary",
              focusRing,
            )}
          >
            <RiClosedCaptioningLine className="size-3" aria-hidden />
            CC
          </button>
        }
      />

      <div
        aria-hidden
        dir="ltr"
        className="relative mt-1.5 h-12 overflow-hidden rounded-lg bg-linear-to-br from-accent-700 via-chart-5 to-accent-950"
      >
        <span className="absolute -end-4 -top-6 size-20 rounded-full border border-accent-200/25" />
        <span className="absolute end-8 top-2 size-8 rounded-full border border-accent-200/20" />
        <span className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-accent-950/75 to-transparent" />
        <div
          className={cx(
            "absolute inset-x-2 bottom-1.5 flex justify-center transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
            captionsOn ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
          )}
        >
          <span
            key={active.id}
            className="animate-label-in rounded-sm bg-accent-950/80 px-1.5 py-0.5 text-center text-caption-2-semibold text-text-white backdrop-blur-sm motion-reduce:animate-none"
          >
            {active.text.trim() || "Type a caption below"}
          </span>
        </div>
      </div>

      <div role="group" aria-label="Caption cues" className="mt-1.5 flex items-center gap-1">
        {cues.map((cue, index) => (
          <button
            key={cue.id}
            type="button"
            aria-pressed={active.id === cue.id}
            aria-label={`Cue ${index + 1}: ${cue.start} to ${cue.end}`}
            onClick={() => setActiveId(cue.id)}
            className={cx(
              "h-5 flex-1 rounded-md px-1 text-caption-2-medium tabular-nums",
              "transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
              focusRing,
              active.id === cue.id
                ? "bg-background-secondary-default text-text-primary shadow-xs ring-1 ring-border-button-default"
                : "text-text-tertiary hover:bg-background-secondary-default hover:text-text-secondary",
            )}
          >
            {cue.start}–{cue.end}
          </button>
        ))}
      </div>

      <textarea
        id={textId}
        rows={2}
        maxLength={80}
        value={active.text}
        aria-label="Caption text"
        onChange={(event) => updateText(event.target.value)}
        className={cx(
          "mt-1.5 w-full resize-none rounded-lg bg-background-tertiary-default px-2 py-0.5 text-caption-1-regular text-text-primary outline-none placeholder:text-text-placeholder",
          focusRing,
        )}
      />

      <div className="mt-1 flex items-center justify-between gap-2 text-caption-2-regular text-text-tertiary tabular-nums">
        <span>{active.text.length}/80</span>
        <span>
          Cue {cues.findIndex((cue) => cue.id === active.id) + 1} of {cues.length} · {active.seconds.toFixed(1)}s
        </span>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  10. Sponsor card                                                           */
/* -------------------------------------------------------------------------- */

const SPONSOR_STEPS = ["Brief", "Draft", "Review", "Paid"] as const;
const SPONSOR_TONES: Tone[] = ["neutral", "yellow", "blue", "lime"];
const SPONSOR_NOTES = [
  "Scope agreed · fee held",
  "Draft due Nov 12",
  "Sent to Ridgeway for review",
  "Paid · invoice #4821",
] as const;
const SPONSOR_BRIEF = [
  "Hook in the first five seconds",
  "Mention code RIDGEWAY20 once",
  "Disclosure in the description",
] as const;

export function SponsorCard() {
  const briefId = useId();
  const [stage, setStage] = useState(1);
  const [briefOpen, setBriefOpen] = useState(false);
  const done = stage === 3;

  return (
    <section aria-label="Sponsor deal" className={cx(card, "p-2.5")}>
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-accent-600 text-caption-2-bold text-text-white shadow-xs"
        >
          RO
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Ridgeway Outfitters</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">Autumn field test · sponsored</p>
        </div>
        <Pill tone={SPONSOR_TONES[stage]}>
          <span key={stage} className="animate-label-in motion-reduce:animate-none">
            {SPONSOR_STEPS[stage]}
          </span>
        </Pill>
      </div>

      <dl className="mt-2 grid grid-cols-3 gap-2 rounded-lg bg-background-secondary-default px-2 py-1.5">
        <div className="min-w-0">
          <dt className="text-caption-2-regular text-text-tertiary">Deliverable</dt>
          <dd className="truncate text-caption-2-semibold text-text-primary">60s mid-roll</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-caption-2-regular text-text-tertiary">Fee</dt>
          <dd className="text-caption-2-semibold text-text-primary tabular-nums">$3,500</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-caption-2-regular text-text-tertiary">Due</dt>
          <dd className="text-caption-2-semibold text-text-primary tabular-nums">Nov 12</dd>
        </div>
      </dl>

      <div
        role="progressbar"
        aria-label="Sponsor deliverable progress"
        aria-valuemin={1}
        aria-valuemax={4}
        aria-valuenow={stage + 1}
        aria-valuetext={`${SPONSOR_STEPS[stage]}, step ${stage + 1} of 4`}
        className="mt-1.5 flex gap-1"
      >
        {SPONSOR_STEPS.map((step, index) => (
          <span
            key={step}
            className={cx(
              "h-1 flex-1 rounded-full transition-[background-color] duration-200 ease-out motion-reduce:transition-none",
              index <= stage ? "bg-accent-500" : "bg-background-tertiary-default",
            )}
          />
        ))}
      </div>

      <div className="mt-1.5 flex items-center gap-1.5">
        <p aria-live="polite" className="min-w-0 flex-1 truncate text-caption-2-regular text-text-tertiary">
          {SPONSOR_NOTES[stage]}
        </p>
        <button
          type="button"
          aria-expanded={briefOpen}
          aria-controls={briefId}
          onClick={() => setBriefOpen((current) => !current)}
          className={cx(quietButton, "h-5 shrink-0 px-1")}
        >
          Brief
        </button>
        <button
          type="button"
          onClick={() => setStage((current) => Math.min(3, current + 1))}
          disabled={done}
          className={cx(done ? secondaryButton : primaryButton, "h-6 shrink-0")}
        >
          {done ? (
            <>
              <RiCheckLine className="size-3" aria-hidden />
              Paid
            </>
          ) : stage === 2 ? (
            "Mark delivered"
          ) : (
            "Submit draft"
          )}
        </button>
      </div>

      <div id={briefId} inert={!briefOpen} className={cx(revealGrid, briefOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
        <div className="min-h-0 overflow-hidden">
          <ul className="mt-1.5 flex flex-col gap-0.5 rounded-md bg-background-secondary-default px-2 py-1">
            {SPONSOR_BRIEF.map((item) => (
              <li key={item} className="flex items-center gap-1 text-caption-2-regular text-text-secondary">
                <RiCheckLine className="size-3 shrink-0 text-accent-600" aria-hidden />
                <span className="truncate">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  11. Channel card                                                           */
/* -------------------------------------------------------------------------- */

const CHANNEL = {
  name: "Mara Voss",
  handle: "@maravoss",
  subscribers: 128431,
  videos: 214,
  views: "1.2M",
};

export function ChannelCard() {
  const [joined, setJoined] = useState(false);
  const count = CHANNEL.subscribers + (joined ? 1 : 0);

  return (
    <section aria-label="Channel card" className={cx(card, "p-2.5")}>
      <div aria-hidden className="relative h-11 overflow-hidden rounded-lg bg-linear-to-br from-accent-500 via-chart-5 to-accent-800">
        <span className="absolute -end-4 -top-6 size-20 rounded-full border border-accent-200/30" />
        <span className="absolute end-10 top-2 size-9 rounded-full border border-accent-200/20" />
        <span className="absolute -bottom-6 start-1/3 size-20 rounded-full bg-accent-300/20 blur-xl" />
      </div>

      <div className="flex items-end gap-2 px-1">
        <span
          aria-hidden
          className="-mt-4 flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-100 text-body-2-semibold text-accent-700 ring-2 ring-background-primary-default"
        >
          MV
        </span>
        <div className="min-w-0 flex-1 pb-0.5">
          <p className="flex min-w-0 items-center gap-1 text-body-2-semibold text-text-primary">
            <span className="truncate">{CHANNEL.name}</span>
            <RiVerifiedBadgeFill className="size-3.5 shrink-0 text-accent-600" aria-hidden />
            <span className="sr-only">Verified</span>
            {joined && (
              <span className="inline-flex animate-label-in items-center text-accent-600 motion-reduce:animate-none">
                <RiNotification3Line className="size-3" aria-hidden />
                <span className="sr-only">Notifications on</span>
              </span>
            )}
          </p>
          <p dir="ltr" className="truncate text-start text-caption-2-regular text-text-tertiary">
            {CHANNEL.handle}
          </p>
        </div>
        <button
          type="button"
          aria-pressed={joined}
          aria-label={joined ? `Leave ${CHANNEL.name}’s channel` : `Join ${CHANNEL.name}’s channel`}
          onClick={() => setJoined((current) => !current)}
          className={cx(joined ? secondaryButton : primaryButton, "h-6 shrink-0 px-2")}
        >
          {joined ? (
            <>
              <RiCheckLine className="size-3" aria-hidden />
              Joined
            </>
          ) : (
            <>
              <RiUserAddLine className="size-3" aria-hidden />
              Join
            </>
          )}
        </button>
      </div>

      <dl className="mt-1.5 grid grid-cols-3 gap-1 border-t border-separator-border pt-1.5">
        <div className="min-w-0" aria-live="polite">
          <dt className="truncate text-caption-2-regular text-text-tertiary">Subscribers</dt>
          <dd
            key={count}
            className="animate-number-fade truncate text-caption-1-semibold text-text-primary tabular-nums motion-reduce:animate-none"
          >
            {number.format(count)}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="truncate text-caption-2-regular text-text-tertiary">Videos</dt>
          <dd className="text-caption-1-semibold text-text-primary tabular-nums">{CHANNEL.videos}</dd>
        </div>
        <div className="min-w-0">
          <dt className="truncate text-caption-2-regular text-text-tertiary">Views</dt>
          <dd className="text-caption-1-semibold text-text-primary tabular-nums">{CHANNEL.views}</dd>
        </div>
      </dl>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  12. Revenue chart                                                          */
/* -------------------------------------------------------------------------- */

const REVENUE_MONTHS = [
  { id: "jun", month: "Jun", full: "June", revenue: 2840 },
  { id: "jul", month: "Jul", full: "July", revenue: 3120 },
  { id: "aug", month: "Aug", full: "August", revenue: 3460 },
  { id: "sep", month: "Sep", full: "September", revenue: 3980 },
  { id: "oct", month: "Oct", full: "October", revenue: 4120 },
  { id: "nov", month: "Nov", full: "November", revenue: 4218 },
] as const;

type MonthId = (typeof REVENUE_MONTHS)[number]["id"];
const REVENUE_MAX = 4400;
const REVENUE_TOTAL = REVENUE_MONTHS.reduce((sum, month) => sum + month.revenue, 0);

export function RevenueChart() {
  const [selectedId, setSelectedId] = useState<MonthId>("nov");
  const selectedIndex = Math.max(
    0,
    REVENUE_MONTHS.findIndex((month) => month.id === selectedId),
  );
  const selected = REVENUE_MONTHS[selectedIndex];
  const previous = selectedIndex > 0 ? REVENUE_MONTHS[selectedIndex - 1] : null;
  const delta = previous ? ((selected.revenue - previous.revenue) / previous.revenue) * 100 : 0;

  return (
    <section aria-label="Revenue chart" className={cx(card, "p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
          <RiBarChartBoxLine className="size-3.5" aria-hidden />
        </span>
        <h3 className="min-w-0 flex-1 truncate text-body-2-semibold text-text-primary">Revenue</h3>
        <span className="shrink-0 text-caption-2-medium text-text-secondary tabular-nums">
          {usd.format(REVENUE_TOTAL)} <span className="text-caption-2-regular text-text-tertiary">/ 6 mo</span>
        </span>
      </div>

      <div dir="ltr" className="relative mt-2 h-[60px]">
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-separator-border" />
        <div aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-separator-border" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-separator-border" />

        <div role="group" aria-label="Monthly revenue from June to November" className="relative flex h-full items-end gap-1">
          {REVENUE_MONTHS.map((month, index) => (
            <button
              key={month.id}
              type="button"
              aria-pressed={selectedId === month.id}
              aria-label={`${month.full}: ${usd.format(month.revenue)}`}
              onClick={() => setSelectedId(month.id)}
              className={cx(
                "group flex h-full flex-1 items-end rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
              )}
            >
              <span
                className={cx(
                  "w-full origin-bottom animate-bar-rise rounded-t-sm transition-[background-color] duration-200 ease-out motion-reduce:animate-none motion-reduce:transition-none",
                  selectedId === month.id ? "bg-chart-1" : "bg-chart-1/30 group-hover:bg-chart-1/50",
                )}
                style={{ height: `${(month.revenue / REVENUE_MAX) * 100}%`, animationDelay: `${index * 35}ms` }}
              />
            </button>
          ))}
        </div>
      </div>

      <div dir="ltr" className="mt-1 flex gap-1">
        {REVENUE_MONTHS.map((month) => (
          <span
            key={month.id}
            className={cx(
              "flex-1 text-center text-caption-2-medium transition-colors duration-150 ease-out motion-reduce:transition-none",
              selectedId === month.id ? "text-text-primary" : "text-text-tertiary",
            )}
          >
            {month.month}
          </span>
        ))}
      </div>

      <div aria-live="polite" className="mt-1.5 flex items-end justify-between gap-2 border-t border-separator-border pt-1.5">
        <div className="min-w-0">
          <p className="truncate text-caption-2-regular text-text-tertiary">{selected.full}</p>
          <p
            key={selected.id}
            className="animate-number-fade text-title-3-semibold text-text-primary tabular-nums motion-reduce:animate-none"
          >
            {usd.format(selected.revenue)}
          </p>
        </div>
        {previous ? (
          <Pill tone={delta >= 0 ? "lime" : "rose"}>
            {delta >= 0 ? (
              <RiArrowUpLine className="size-3" aria-hidden />
            ) : (
              <RiArrowDownLine className="size-3" aria-hidden />
            )}
            {Math.abs(delta).toFixed(1)}% vs {previous.month}
          </Pill>
        ) : (
          <span className="text-caption-2-regular text-text-tertiary">First month tracked</span>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Specimens                                                                  */
/* -------------------------------------------------------------------------- */

export const CREATOR_SECTION: ExtendedSection = {
  id: "creator",
  title: "Creator",
  blurb: "Uploads, clips and the business of an audience.",
  file: "creator.tsx",
  entries: [
    { name: "Upload Wizard", description: "Four steps from a rough cut to a published episode.", Demo: UploadWizard },
    { name: "Thumbnail Picker", description: "Three token-built covers, one selection and an apply action.", Demo: ThumbnailPicker },
    { name: "Monetization Card", description: "Revenue, RPM and the next payout, with a period switch.", Demo: MonetizationCard },
    { name: "Analytics Row", description: "Views, watch time and CTR for the last 7, 28 or 90 days.", Demo: AnalyticsRow },
    { name: "Comment Moderation", description: "Approve, hide or report comments and watch the queue clear.", Demo: CommentModeration },
    { name: "Schedule Post", description: "Pick a date, a time and a timezone, then schedule.", Demo: SchedulePost },
    { name: "Asset Library", description: "Clips filtered by type, with selection and a live count.", Demo: AssetLibrary },
    { name: "Clip Trimmer", description: "Set in and out points; the cut duration follows.", Demo: ClipTrimmer },
    { name: "Caption Editor", description: "Edit caption text against three timed cues with a live overlay.", Demo: CaptionEditor },
    { name: "Sponsor Card", description: "Sponsor, deliverable and status, from draft to paid.", Demo: SponsorCard },
    { name: "Channel Card", description: "Subscribers, videos and a join state that counts.", Demo: ChannelCard },
    { name: "Revenue Chart", description: "Six months of revenue; select a bar for that month.", Demo: RevenueChart },
  ],
};
