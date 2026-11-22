"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  RiAlertLine,
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiCheckLine,
  RiCloseLine,
  RiCodeSSlashLine,
  RiFileCopyLine,
  RiFlaskLine,
  RiHistoryLine,
  RiShieldCheckLine,
  RiTerminalBoxLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* -------------------------------------------------------------------------- */
/*  Status pill                                                                */
/* -------------------------------------------------------------------------- */

const STATUS_VARIANTS = [
  { label: "Operational", tone: "ok" },
  { label: "Degraded", tone: "warn" },
  { label: "Outage", tone: "error" },
  { label: "Maintenance", tone: "neutral" },
] as const;

const STATUS_PILL_TONES = {
  ok: "border-status-lime-text/25 bg-status-lime-background text-status-lime-text",
  warn: "border-status-orange-text/25 bg-status-orange-background text-status-orange-text",
  error: "border-status-rose-text/25 bg-status-rose-background text-status-rose-text",
  neutral: "border-border-button-default bg-background-secondary-default text-text-secondary",
} as const;

const STATUS_DOT_TONES = {
  ok: "bg-status-lime-text",
  warn: "bg-status-orange-text",
  error: "bg-status-rose-text",
  neutral: "bg-foreground-icon-tertiary",
} as const;

export function StatusPill() {
  return (
    <div className="flex w-full max-w-[360px] flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="shrink-0 text-caption-1-semibold tracking-wide text-text-tertiary uppercase">Service health</span>
        <span aria-hidden className="h-px flex-1 bg-separator-border" />
      </div>
      <div className="flex flex-wrap items-center gap-1">
        {STATUS_VARIANTS.map((variant) => (
          <span
            key={variant.tone}
            className={cx(
              "inline-flex h-6 items-center gap-1 rounded-full border px-1.5 text-caption-2-medium",
              STATUS_PILL_TONES[variant.tone],
            )}
          >
            <span aria-hidden className={cx("size-1.5 rounded-full", STATUS_DOT_TONES[variant.tone])} />
            {variant.label}
          </span>
        ))}
      </div>
      <p className="text-caption-1-regular text-text-tertiary">
        Payments API <span aria-hidden>·</span> checked every 30 seconds
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Uptime bar                                                                 */
/* -------------------------------------------------------------------------- */

const UPTIME_MONTHS = ["Sep", "Oct", "Nov"] as const;
const UPTIME_MONTH_LENGTHS = [30, 31, 30] as const;

/** Sep 7 → Nov 5, counted without touching a clock. */
function uptimeDayLabel(index: number) {
  let month = 0;
  let day = 7 + index;
  while (day > UPTIME_MONTH_LENGTHS[month]) {
    day -= UPTIME_MONTH_LENGTHS[month];
    month += 1;
  }
  return `${UPTIME_MONTHS[month]} ${day}`;
}

type UptimeState = "ok" | "degraded" | "outage";

type UptimeIncident = { day: number; state: Exclude<UptimeState, "ok">; minutes: number };

const UPTIME_INCIDENTS: UptimeIncident[] = [
  { day: 11, state: "degraded", minutes: 42 },
  { day: 26, state: "degraded", minutes: 18 },
  { day: 38, state: "degraded", minutes: 8 },
  { day: 56, state: "outage", minutes: 12 },
];

const UPTIME_INCIDENT_DAYS = new Map(UPTIME_INCIDENTS.map((incident) => [incident.day, incident] as const));

const UPTIME_DAYS = Array.from({ length: 60 }, (_, index) => ({
  index,
  incident: UPTIME_INCIDENT_DAYS.get(index),
}));

const UPTIME_DOWNTIME = UPTIME_INCIDENTS.reduce((total, incident) => total + incident.minutes, 0);
const UPTIME_PERCENT = (100 - (UPTIME_DOWNTIME / (60 * 24 * 60)) * 100).toFixed(2);
const UPTIME_DOWNTIME_LABEL = `${Math.floor(UPTIME_DOWNTIME / 60)}h ${UPTIME_DOWNTIME % 60}m`;

const UPTIME_BAR_TONES: Record<UptimeState, string> = {
  ok: "bg-chart-2",
  degraded: "bg-status-orange-text",
  outage: "bg-status-rose-text",
};

const UPTIME_STATE_LABELS: Record<UptimeState, string> = {
  ok: "Operational",
  degraded: "Degraded",
  outage: "Outage",
};

const UPTIME_LEGEND = [
  { label: "Operational", tone: "ok" },
  { label: "Degraded", tone: "degraded" },
  { label: "Outage", tone: "outage" },
] as const;

export function UptimeBar() {
  return (
    <div className="flex w-full max-w-[560px] flex-col gap-3 rounded-xl border border-border-button-default bg-background-primary-default p-3.5 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col">
          <span className="text-caption-1-semibold tracking-wide text-text-tertiary uppercase">API availability</span>
          <span className="text-title-2-semibold text-text-primary tabular-nums">{UPTIME_PERCENT}%</span>
        </div>
        <span className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full border border-border-button-default bg-background-secondary-default px-2 text-caption-2-medium text-text-secondary">
          <RiShieldCheckLine className="size-3.5 text-status-lime-text" aria-hidden />
          SLA 99.9% met
        </span>
      </div>

      <div
        role="img"
        aria-label={`${UPTIME_PERCENT} percent uptime over the last 60 days. ${UPTIME_INCIDENTS.length} incidents, ${UPTIME_DOWNTIME} minutes of downtime.`}
        className="flex h-8 items-stretch gap-px"
      >
        {UPTIME_DAYS.map(({ index, incident }) => {
          const state: UptimeState = incident?.state ?? "ok";
          const title = `${uptimeDayLabel(index)} — ${UPTIME_STATE_LABELS[state]}${incident ? ` · ${incident.minutes} min` : ""}`;
          return (
            <span
              key={index}
              aria-hidden
              title={title}
              className={cx(
                "min-w-0 flex-1 rounded-[2px] transition-opacity duration-150 ease-out hover:opacity-70",
                UPTIME_BAR_TONES[state],
              )}
            />
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-2 text-caption-2-regular text-text-tertiary">
        <span>Sep 7</span>
        <span>Last 60 days</span>
        <span>Nov 5</span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-separator-border pt-2.5">
        <ul className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {UPTIME_LEGEND.map((item) => (
            <li key={item.tone} className="flex items-center gap-1 text-caption-2-regular text-text-secondary">
              <span aria-hidden className={cx("size-1.5 rounded-full", UPTIME_BAR_TONES[item.tone])} />
              {item.label}
            </li>
          ))}
        </ul>
        <span className="text-caption-2-regular text-text-tertiary tabular-nums">
          {UPTIME_INCIDENTS.length} incidents · {UPTIME_DOWNTIME_LABEL} downtime
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Incident banner                                                            */
/* -------------------------------------------------------------------------- */

export function IncidentBanner() {
  const [dismissed, setDismissed] = useState(false);
  const restoreRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (dismissed) restoreRef.current?.focus();
  }, [dismissed]);

  if (dismissed) {
    return (
      <div className="flex w-full max-w-[360px] items-center justify-between gap-2 rounded-xl border border-dashed border-border-button-default px-3 py-2.5">
        <span className="flex min-w-0 items-center gap-1.5 text-caption-1-regular text-text-tertiary">
          <RiCheckLine className="size-3.5 shrink-0 text-status-lime-text" aria-hidden />
          Incident banner dismissed
        </span>
        <button
          ref={restoreRef}
          type="button"
          onClick={() => setDismissed(false)}
          className="shrink-0 rounded-sm text-caption-1-semibold text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          Restore
        </button>
      </div>
    );
  }

  return (
    <div
      role="status"
      className="w-full max-w-[360px] rounded-xl border border-status-orange-text/30 bg-status-orange-background p-3"
    >
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-background-primary-default/70 text-status-orange-text">
          <RiAlertLine className="size-4" aria-hidden />
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="text-caption-2-semibold tracking-wide text-status-orange-text uppercase">Degraded</span>
            <span aria-hidden className="size-1 rounded-full bg-status-orange-text/60" />
            <span className="text-caption-2-regular text-text-primary/85">12 min ago</span>
          </div>
          <p className="text-body-2-semibold text-text-primary">Elevated API latency</p>
          <p className="text-caption-1-regular text-text-primary/85">
            Payments API <span aria-hidden>·</span> <bdi dir="ltr">eu-west-1</bdi> <span aria-hidden>·</span> p95 3.4× baseline
          </p>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
            <span className="text-caption-2-regular text-text-primary/85 tabular-nums">Started 14:32 UTC</span>
            <button
              type="button"
              className="inline-flex h-6 items-center gap-0.5 rounded-md border border-status-orange-text/30 bg-background-primary-default px-1.5 text-caption-2-semibold text-text-primary shadow-xs transition-colors duration-150 ease-out hover:bg-background-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              View status
              <RiArrowRightSLine className="size-3 rtl:-scale-x-100" aria-hidden />
            </button>
          </div>
        </div>

        <button
          type="button"
          aria-label="Dismiss incident banner"
          onClick={() => setDismissed(true)}
          className="-me-1 -mt-1 flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-icon-secondary transition-colors duration-150 ease-out hover:bg-background-primary-default/70 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          <RiCloseLine className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Log level tag                                                              */
/* -------------------------------------------------------------------------- */

type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVEL_TONES: Record<LogLevel, string> = {
  debug: "bg-background-tertiary-default text-text-secondary",
  info: "bg-status-blue-background text-status-blue-text",
  warn: "bg-status-orange-background text-status-orange-text",
  error: "bg-status-rose-background text-status-rose-text",
};

const LOG_LINES: { level: LogLevel; time: string; source: string; message: string }[] = [
  { level: "debug", time: "10:42:07", source: "cache", message: "warm complete · 84ms · keys=1,204" },
  { level: "info", time: "10:42:09", source: "http", message: "GET /v1/projects 200 · 12ms" },
  { level: "warn", time: "10:42:11", source: "webhook", message: "retry 2/3 · backoff 1.6s · hooks.acme.dev" },
  { level: "error", time: "10:42:12", source: "upload", message: "payload 27.4 MB exceeds 25 MB limit" },
];

export function LogLevelTag() {
  const [copied, setCopied] = useState<number | null>(null);

  useEffect(() => {
    if (copied === null) return;
    const timer = window.setTimeout(() => setCopied(null), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyLine = (index: number, line: (typeof LOG_LINES)[number]) => {
    const text = `${line.time} ${line.level.toUpperCase()} [${line.source}] ${line.message}`;
    const clipboard = navigator.clipboard;
    if (clipboard) {
      void clipboard.writeText(text).catch(() => {});
    }
    setCopied(index);
  };

  return (
    <div className="w-full max-w-[380px] overflow-hidden rounded-xl border border-border-button-default bg-background-primary-default">
      <div className="flex items-center justify-between gap-2 border-b border-separator-border px-2.5 py-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <RiTerminalBoxLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
          <span className="truncate font-mono text-caption-1-semibold text-text-primary">
            <bdi dir="ltr">worker.log</bdi>
          </span>
        </div>
        <span className="flex shrink-0 items-center gap-1 text-caption-2-regular text-text-tertiary">
          <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-status-lime-text motion-reduce:animate-none" />
          Live tail
        </span>
      </div>

      <ul className="divide-y divide-separator-border">
        {LOG_LINES.map((line, index) => (
          <li key={`${line.time}-${line.level}`} className="flex items-start gap-2 px-2.5 py-2">
            <span
              className={cx(
                "mt-0.5 inline-flex h-[18px] w-12 shrink-0 items-center justify-center rounded font-mono text-caption-2-semibold uppercase",
                LOG_LEVEL_TONES[line.level],
              )}
            >
              {line.level}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 font-mono text-caption-2-regular text-text-tertiary">
                <span className="tabular-nums">{line.time}</span>
                <span aria-hidden>·</span>
                <span className="truncate">{line.source}</span>
              </div>
              <p
                className={cx(
                  "mt-px truncate font-mono text-caption-1-regular",
                  line.level === "error" ? "text-text-primary" : "text-text-secondary",
                )}
              >
                <bdi dir="ltr">{line.message}</bdi>
              </p>
            </div>

            <button
              type="button"
              aria-label={`Copy ${line.level} log line`}
              onClick={() => copyLine(index, line)}
              className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-icon-secondary transition-colors duration-150 ease-out hover:bg-background-secondary-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              {copied === index ? (
                <RiCheckLine className="size-3.5 text-status-lime-text" aria-hidden />
              ) : (
                <RiFileCopyLine className="size-3.5" aria-hidden />
              )}
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between gap-2 border-t border-separator-border px-2.5 py-1.5">
        <span className="text-caption-2-regular text-text-tertiary">4 events · worker-3</span>
        <span className="text-caption-2-regular text-text-tertiary tabular-nums">10:42:12 UTC</span>
        <span aria-live="polite" className="sr-only">
          {copied === null ? "" : `Copied ${LOG_LINES[copied].level} log line`}
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Environment badge                                                          */
/* -------------------------------------------------------------------------- */

const ENVIRONMENT_TONES = {
  production: {
    badge: "border-status-lime-text/25 bg-status-lime-background text-status-lime-text",
    icon: RiShieldCheckLine,
  },
  staging: {
    badge: "border-status-yellow-text/25 bg-status-yellow-background text-status-yellow-text",
    icon: RiFlaskLine,
  },
  development: {
    badge: "border-status-blue-text/25 bg-status-blue-background text-status-blue-text",
    icon: RiCodeSSlashLine,
  },
} as const;

const ENVIRONMENTS = [
  { id: "production", label: "Production", host: "app.acme.com" },
  { id: "staging", label: "Staging", host: "staging.acme.com" },
  { id: "development", label: "Development", host: "localhost:3000" },
] as const;

export function EnvironmentBadge() {
  return (
    <div className="flex w-full max-w-[360px] flex-col gap-2.5 rounded-xl border border-border-button-default bg-background-primary-default p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-caption-1-semibold tracking-wide text-text-tertiary uppercase">Environment</span>
        <span className="font-mono text-caption-2-regular text-text-tertiary">
          <bdi dir="ltr">us-east-1</bdi>
        </span>
      </div>

      <ul className="flex flex-col gap-2">
        {ENVIRONMENTS.map((environment) => {
          const tone = ENVIRONMENT_TONES[environment.id];
          const Icon = tone.icon;
          return (
            <li key={environment.id} className="flex items-center justify-between gap-2">
              <span
                className={cx(
                  "inline-flex h-6 shrink-0 items-center gap-1 rounded-full border px-2 text-caption-1-medium",
                  tone.badge,
                )}
              >
                <Icon className="size-3.5" aria-hidden />
                {environment.label}
              </span>
              <span className="min-w-0 truncate font-mono text-caption-2-regular text-text-tertiary">
                <bdi dir="ltr">{environment.host}</bdi>
              </span>
            </li>
          );
        })}
      </ul>

      <p className="border-t border-separator-border pt-2 text-caption-1-regular text-text-tertiary">
        Production is customer traffic. Staging mirrors it before release; development runs locally.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Audit row                                                                  */
/* -------------------------------------------------------------------------- */

const AUDIT_EVENTS = [
  {
    id: "evt_8f21c9a",
    actor: "Maya Chen",
    initials: "MC",
    action: "rotated",
    target: "STRIPE_SECRET_KEY",
    context: "Production",
    time: "12m ago",
    detail: "Key rotated from the CLI. The previous key was revoked immediately.",
    facts: ["ip 203.0.113.42", "req 8f21c9a", "scope production"],
  },
  {
    id: "evt_5c04e17",
    actor: "Jonas Reed",
    initials: "JR",
    action: "invited",
    target: "priya@acme.dev",
    context: "Staging",
    time: "1h ago",
    detail: "Invitation sent with the Engineer role. It expires in seven days.",
    facts: ["role engineer", "req 5c04e17", "expires Nov 12"],
  },
  {
    id: "evt_2a9b3d0",
    actor: "Priya Nair",
    initials: "PN",
    action: "enabled",
    target: "sso.enforcement",
    context: "Workspace",
    time: "3h ago",
    detail: "SSO enforcement enabled for all members ahead of the IdP migration.",
    facts: ["members 214", "req 2a9b3d0", "idp okta"],
  },
] as const;

function AuditEntry({
  event,
  defaultOpen = false,
}: {
  event: (typeof AUDIT_EVENTS)[number];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const detailId = useId();

  return (
    <li>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={detailId}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-start gap-2.5 px-3 py-2.5 text-start transition-colors duration-150 ease-out hover:bg-background-secondary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-inset"
      >
        <span
          aria-hidden
          className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border-button-default bg-background-secondary-default font-mono text-caption-2-semibold text-text-primary"
        >
          {event.initials}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-body-2-regular text-text-secondary">
            <span className="text-body-2-medium text-text-primary">{event.actor}</span> {event.action}{" "}
            <bdi dir="ltr" className="font-mono text-body-2-medium text-text-primary">
              {event.target}
            </bdi>
          </span>
          <span className="mt-0.5 flex items-center gap-1.5 text-caption-2-regular text-text-tertiary">
            <span>{event.context}</span>
            <span aria-hidden>·</span>
            <span className="tabular-nums">{event.time}</span>
          </span>
        </span>

        <RiArrowDownSLine
          className={cx(
            "mt-1 size-4 shrink-0 text-foreground-icon-tertiary transition-transform duration-200 ease-out",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      <div
        id={detailId}
        hidden={!open}
        className="border-t border-separator-border bg-background-secondary-default py-2 pe-3 ps-12"
      >
        <p className="text-caption-1-regular text-text-secondary">{event.detail}</p>
        <p className="mt-0.5 truncate font-mono text-caption-2-regular text-text-tertiary">
          <bdi dir="ltr">{event.facts.join(" · ")}</bdi>
        </p>
      </div>
    </li>
  );
}

export function AuditRow() {
  return (
    <div className="w-full max-w-[620px] overflow-hidden rounded-xl border border-border-button-default bg-background-primary-default">
      <div className="flex items-center justify-between gap-2 border-b border-separator-border px-3 py-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <RiHistoryLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
          <span className="text-body-2-semibold text-text-primary">Audit log</span>
          <span className="inline-flex h-4 items-center rounded-full bg-background-tertiary-default px-1.5 text-caption-2-medium text-text-secondary tabular-nums">
            3
          </span>
        </div>
        <span className="shrink-0 text-caption-2-regular text-text-tertiary">Last 24 hours</span>
      </div>

      <ul className="divide-y divide-separator-border">
        {AUDIT_EVENTS.map((event, index) => (
          <AuditEntry key={event.id} event={event} defaultOpen={index === 0} />
        ))}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-separator-border px-3 py-1.5">
        <span className="text-caption-2-regular text-text-tertiary">Signed and immutable · retained 400 days</span>
        <span className="text-caption-2-regular text-text-tertiary tabular-nums">As of 10:42 UTC</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Specimens                                                                  */
/* -------------------------------------------------------------------------- */

export const SYSTEM_SECTION: ExtendedSection = {
  id: "system",
  title: "System",
  blurb: "Health, incidents and the paper trail behind the product.",
  file: "system.tsx",
  entries: [
    { name: "Status Pill", description: "Four service states, compact enough for one row.", Demo: StatusPill },
    { name: "Uptime Bar", description: "Sixty days of availability, with incident days marked.", Demo: UptimeBar, wide: true },
    { name: "Incident Banner", description: "A degraded state you can act on, or dismiss.", Demo: IncidentBanner },
    { name: "Log Level Tag", description: "Severity tags on a live tail, with copy per line.", Demo: LogLevelTag },
    { name: "Environment Badge", description: "Production, staging and development, never confused.", Demo: EnvironmentBadge },
    { name: "Audit Row", description: "Who changed what, with the receipt underneath.", Demo: AuditRow, wide: true },
  ],
};
