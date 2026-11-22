"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ComponentType, FormEvent, ReactNode } from "react";
import {
  RiAddLine,
  RiArrowDownSLine,
  RiArrowRightLine,
  RiBugLine,
  RiCalendarLine,
  RiCheckLine,
  RiErrorWarningLine,
  RiFileChartLine,
  RiFileCopyLine,
  RiFileWarningLine,
  RiLoader4Line,
  RiLock2Line,
  RiLoopLeftLine,
  RiNotification3Line,
  RiPauseLine,
  RiPlayLine,
  RiRefreshLine,
  RiSearchLine,
  RiShieldKeyholeLine,
  RiTimerLine,
  RiUserAddLine,
  RiWifiLine,
  RiWifiOffLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* Shared primitives */

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";

const cardSurface = "w-full rounded-xl border border-border-button-default bg-background-primary-default shadow-card";

const buttonBase =
  "inline-flex items-center justify-center gap-1.5 rounded-lg text-caption-1-semibold " +
  "transition-[transform,opacity,background-color,color,box-shadow] duration-150 ease-out " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 " +
  "motion-reduce:transition-none motion-reduce:active:scale-100";

const primaryButton = cx(buttonBase, "h-8 bg-button-primary px-2.5 text-text-white shadow-xs", focusRing);
const secondaryButton = cx(
  buttonBase,
  "h-8 border border-border-button-default bg-background-primary-default px-2.5 text-text-primary shadow-xs hover:bg-background-primary-hover",
  focusRing,
);
const quietButton = cx(
  buttonBase,
  "h-7 px-1.5 text-text-secondary hover:bg-background-secondary-default hover:text-text-primary",
  focusRing,
);

const revealGrid = "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none";

const TONES = {
  rose: "bg-status-rose-background text-status-rose-text",
  orange: "bg-status-orange-background text-status-orange-text",
  yellow: "bg-status-yellow-background text-status-yellow-text",
  blue: "bg-status-blue-background text-status-blue-text",
  lime: "bg-status-lime-background text-status-lime-text",
  neutral: "bg-background-tertiary-default text-text-secondary",
} as const;

type Tone = keyof typeof TONES;

function Badge({
  tone = "neutral", icon: Icon, children, className,
}: { tone?: Tone; icon?: IconComponent; children: ReactNode; className?: string }) {
  return (
    <span className={cx("inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-caption-2-medium", TONES[tone], className)}>
      {Icon ? <Icon className="size-3" aria-hidden /> : null}
      {children}
    </span>
  );
}

function HeaderIcon({ icon: Icon, tone = "rose" }: { icon: IconComponent; tone?: Tone }) {
  return (
    <span aria-hidden className={cx("flex size-8 shrink-0 items-center justify-center rounded-lg", TONES[tone])}>
      <Icon className="size-4" aria-hidden />
    </span>
  );
}

function CopyButton({
  text, label = "Copy diagnostics", copiedLabel = "Copied", className,
}: { text: string; label?: string; copiedLabel?: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(text);
    } catch {
      /* Clipboard can be blocked; the label still confirms the intent. */
    }
    setCopied(true);
  };

  return (
    <button type="button" onClick={() => void copy()} className={cx(secondaryButton, "h-7", className)}>
      {copied ? (
        <RiCheckLine className="size-3.5 text-status-lime-text" aria-hidden />
      ) : (
        <RiFileCopyLine className="size-3.5" aria-hidden />
      )}
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}

/* 1. Error Card */

const ERROR_DIAGNOSTICS = [
  "Request ID: req_8f2c41d9a7",
  "Status: 500 Internal Server Error",
  "Route: /invoices/INV-2084",
  "Service: pricing-api (us-east-1)",
  "Time: 2026-11-05 14:32:08 UTC",
  "Message: Upstream pricing service timed out after 30000 ms",
].join("\n");

export function ErrorCard() {
  const titleId = useId();
  const [state, setState] = useState<"idle" | "retrying" | "queued">("idle");
  const [attempt, setAttempt] = useState(1);

  useEffect(() => {
    if (state !== "retrying") return;
    const timer = window.setTimeout(() => {
      setAttempt((value) => value + 1);
      setState("queued");
    }, 900);
    return () => window.clearTimeout(timer);
  }, [state]);

  const statusCopy =
    state === "retrying"
      ? "Retry started. Waiting for the pricing service…"
      : state === "queued"
        ? `Attempt ${attempt} queued. This page will keep its place.`
        : "No charge was made. Retrying is safe.";

  return (
    <section aria-labelledby={titleId} className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-start gap-2.5">
        <HeaderIcon icon={RiErrorWarningLine} tone="rose" />
        <div className="min-w-0 flex-1">
          <p className="text-caption-2-semibold tracking-wide text-status-rose-text uppercase">
            <span className="font-mono">500</span> · Internal server error
          </p>
          <h3 id={titleId} className="mt-0.5 text-headline-semibold text-text-primary">
            Invoice INV-2084 didn’t load.
          </h3>
        </div>
      </div>

      <p className="mt-1.5 text-caption-1-regular text-text-secondary">
        The pricing service stopped answering after 30s. Your card was not charged.
      </p>

      <div className="mt-2 flex items-center gap-2 rounded-lg bg-background-secondary-default px-2 py-1.5">
        <span className="text-caption-2-regular text-text-tertiary">Request ID</span>
        <bdi dir="ltr" className="ms-auto truncate font-mono text-caption-2-medium text-text-primary">
          req_8f2c41d9a7
        </bdi>
      </div>

      <div className="mt-2 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setState("retrying")}
          disabled={state === "retrying"}
          className={cx(primaryButton, "h-7 flex-1")}
        >
          {state === "retrying" ? (
            <RiLoader4Line className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
          ) : (
            <RiRefreshLine className="size-3.5" aria-hidden />
          )}
          {state === "retrying" ? "Retrying" : state === "queued" ? "Retry again" : "Retry request"}
        </button>
        <CopyButton text={ERROR_DIAGNOSTICS} label="Copy diagnostics" copiedLabel="Copied" className="h-7" />
      </div>

      <p aria-live="polite" className="mt-1.5 min-h-4 text-caption-2-regular text-text-secondary">
        {statusCopy}
      </p>
    </section>
  );
}

/* 2. Blank State */

export function BlankState() {
  const [created, setCreated] = useState(false);

  return (
    <section
      aria-label="No saved reports"
      className="w-full max-w-[300px] rounded-xl border border-dashed border-border-button-default bg-background-primary-default p-3.5 text-center shadow-xs"
    >
      <div aria-hidden className="relative mx-auto flex h-10 w-20 items-end justify-center">
        <span className="absolute inset-x-3 top-1.5 h-8 rotate-6 rounded-lg border border-border-button-default bg-background-secondary-default" />
        <span className="absolute inset-x-2 top-0.5 h-8 -rotate-3 rounded-lg border border-border-button-default bg-background-secondary-default" />
        <span
          className={cx(
            "relative flex h-9 w-16 items-center justify-center rounded-lg border bg-background-primary-default",
            "transition-[border-color,color,background-color] duration-200 ease-out motion-reduce:transition-none",
            created
              ? "border-status-lime-text/40 text-status-lime-text"
              : "border-border-button-default text-foreground-icon-tertiary",
          )}
        >
          {created ? <RiCheckLine className="size-4" aria-hidden /> : <RiFileChartLine className="size-4" aria-hidden />}
        </span>
      </div>

      <h3 className="mt-2 text-title-3-semibold text-text-primary">No saved reports</h3>
      <p className="mt-1 text-caption-1-regular text-text-secondary">
        Start with your Q4 data. The first report appears here for the team.
      </p>

      <button
        type="button"
        onClick={() => setCreated(true)}
        disabled={created}
        className={cx(created ? secondaryButton : primaryButton, "mt-2.5 w-full disabled:opacity-100")}
      >
        {created ? (
          <>
            <RiCheckLine className="size-3.5" aria-hidden />
            Draft created
          </>
        ) : (
          <>
            <RiAddLine className="size-3.5" aria-hidden />
            Create first report
          </>
        )}
      </button>

      <div
        inert={!created}
        className={cx(revealGrid, "text-start", created ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
      >
        <div className="min-h-0 overflow-hidden">
          <p
            aria-live="polite"
            className="mt-2 animate-label-in rounded-lg bg-background-secondary-default px-2 py-1.5 text-caption-2-regular text-text-secondary motion-reduce:animate-none"
          >
            Draft “Q4 pipeline review” saved to Reports. You can rename it any time.
          </p>
        </div>
      </div>
    </section>
  );
}

/* 3. Page Skeleton */

export function PageSkeleton() {
  const [paused, setPaused] = useState(false);

  return (
    <section aria-label="Billing overview loading" aria-busy="true" className={cx(cardSurface, "max-w-[300px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-caption-1-semibold text-text-primary">Billing overview</span>
          <Badge tone={paused ? "neutral" : "blue"}>{paused ? "Paused" : "Loading"}</Badge>
        </div>
        <button
          type="button"
          aria-pressed={paused}
          aria-label={paused ? "Resume loading animation" : "Pause loading animation"}
          onClick={() => setPaused((value) => !value)}
          className={cx(quietButton, "h-6 shrink-0 gap-1 px-1.5 text-caption-2-medium")}
        >
          {paused ? <RiPlayLine className="size-3" aria-hidden /> : <RiPauseLine className="size-3" aria-hidden />}
          {paused ? "Resume" : "Pause"}
        </button>
      </div>

      <div className="relative mt-2 overflow-hidden rounded-lg border border-separator-border bg-background-secondary-default p-2">
        <span
          aria-hidden
          className={cx(
            "pointer-events-none absolute inset-y-0 -left-[60%] z-10 w-[45%] bg-linear-to-r from-transparent via-background-tertiary-hover/50 to-transparent",
            !paused && "bui-badge-shimmer motion-reduce:opacity-0",
          )}
        />
        <div aria-hidden className={cx("relative flex flex-col gap-2 transition-opacity duration-200 ease-out motion-reduce:transition-none", paused && "opacity-70")}>
          <div className="flex items-center gap-2">
            <span className="size-7 shrink-0 rounded-md bg-background-tertiary-default" />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="h-2 w-2/5 rounded-full bg-background-tertiary-default" />
              <span className="h-2 w-3/5 rounded-full bg-background-tertiary-default" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <span className="h-7 rounded-md bg-background-tertiary-default" />
            <span className="h-7 rounded-md bg-background-tertiary-default" />
            <span className="h-7 rounded-md bg-background-tertiary-default" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="h-1.5 w-11/12 rounded-full bg-background-tertiary-default" />
            <span className="h-1.5 w-4/5 rounded-full bg-background-tertiary-default" />
          </div>
        </div>
      </div>

      <p
        key={paused ? "paused" : "loading"}
        className="mt-1.5 animate-label-in text-caption-2-regular text-text-tertiary motion-reduce:animate-none"
      >
        {paused ? "Paused. The last snapshot stays in place." : "Syncing 842 transactions from the ledger…"}
      </p>
    </section>
  );
}

/* 4. Retry Banner */

export function RetryBanner() {
  const [status, setStatus] = useState<"failed" | "retrying" | "saved">("failed");
  const [attempt, setAttempt] = useState(1);

  useEffect(() => {
    if (status !== "retrying") return;
    const timer = window.setTimeout(() => {
      setAttempt(2);
      setStatus("saved");
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [status]);

  const saved = status === "saved";
  const retrying = status === "retrying";
  const visibleAttempt = retrying ? Math.min(3, attempt + 1) : attempt;

  return (
    <section
      aria-label="Draft save status"
      className={cx(
        "w-full max-w-[320px] rounded-xl border p-2.5 shadow-xs",
        "transition-[background-color,border-color,color] duration-200 ease-out motion-reduce:transition-none",
        saved
          ? "border-status-lime-text/20 bg-status-lime-background"
          : "border-status-orange-text/20 bg-status-orange-background",
      )}
    >
      <div className="flex items-start gap-2.5">
        <span
          aria-hidden
          className={cx(
            "flex size-7 shrink-0 items-center justify-center rounded-lg bg-background-primary-default shadow-xs",
            saved ? "text-status-lime-text" : "text-status-orange-text",
          )}
        >
          {saved ? (
            <RiCheckLine className="size-4" aria-hidden />
          ) : retrying ? (
            <RiLoader4Line className="size-4 animate-spin motion-reduce:animate-none" aria-hidden />
          ) : (
            <RiFileWarningLine className="size-4" aria-hidden />
          )}
        </span>
        <div key={status} className="min-w-0 flex-1 animate-label-in motion-reduce:animate-none">
          <div className="flex items-center gap-1.5">
            <p className="min-w-0 flex-1 truncate text-body-2-semibold text-text-primary">
              {saved ? "Draft saved" : retrying ? "Saving your draft…" : "Draft didn’t save"}
            </p>
            <span
              className={cx(
                "shrink-0 rounded-full border px-1.5 py-0.5 text-caption-2-medium tabular-nums",
                saved
                  ? "border-status-lime-text/30 text-status-lime-text"
                  : "border-status-orange-text/30 text-status-orange-text",
              )}
            >
              Attempt {visibleAttempt} of 3
            </span>
          </div>
          <p className="mt-0.5 text-caption-2-regular text-text-primary/80">
            {saved
              ? "Recovered on attempt 2. All 14 blocks are on the server."
              : retrying
                ? "POST /v1/boards/q4-launch/draft is waiting on api.northline.co."
                : "The API returned 502 after 8s. Your work is safe on this device."}
          </p>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="min-w-0 truncate text-caption-2-regular text-text-primary/70">
          {saved ? (
            <span dir="ltr" className="font-mono">Saved 14:32 UTC</span>
          ) : retrying ? (
            "Waiting on api.northline.co"
          ) : (
            "Retrying won’t duplicate blocks"
          )}
        </span>
        <button
          type="button"
          onClick={() => {
            if (saved) {
              setAttempt(1);
              setStatus("failed");
            } else {
              setStatus("retrying");
            }
          }}
          disabled={retrying}
          className={cx(saved ? secondaryButton : primaryButton, "h-7 shrink-0")}
        >
          {saved ? (
            <>
              <RiLoopLeftLine className="size-3.5" aria-hidden />
              Start over
            </>
          ) : retrying ? (
            <>
              <RiLoader4Line className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
              Retrying
            </>
          ) : (
            <>
              <RiRefreshLine className="size-3.5" aria-hidden />
              Retry now
            </>
          )}
        </button>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {saved ? "Draft saved after two attempts." : retrying ? "Retrying the draft save." : "Draft failed to save."}
      </p>
    </section>
  );
}

/* 5. Offline Banner */

export function OfflineBanner() {
  const [status, setStatus] = useState<"offline" | "reconnecting" | "online">("offline");

  useEffect(() => {
    if (status !== "reconnecting") return;
    const timer = window.setTimeout(() => setStatus("online"), 1500);
    return () => window.clearTimeout(timer);
  }, [status]);

  const reconnecting = status === "reconnecting";
  const online = status === "online";

  return (
    <section
      aria-label="Connection status"
      className={cx(
        "w-full max-w-[320px] rounded-xl border p-2.5 shadow-xs",
        "transition-[background-color,border-color,color] duration-200 ease-out motion-reduce:transition-none",
        online
          ? "border-status-lime-text/20 bg-status-lime-background"
          : reconnecting
            ? "border-status-blue-text/20 bg-status-blue-background"
            : "border-status-rose-text/20 bg-status-rose-background",
      )}
    >
      <div className="flex items-start gap-2.5">
        <span
          aria-hidden
          className={cx(
            "flex size-7 shrink-0 items-center justify-center rounded-lg bg-background-primary-default shadow-xs",
            online ? "text-status-lime-text" : reconnecting ? "text-status-blue-text" : "text-status-rose-text",
          )}
        >
          {online ? (
            <RiWifiLine className="size-4" aria-hidden />
          ) : reconnecting ? (
            <RiLoader4Line className="size-4 animate-spin motion-reduce:animate-none" aria-hidden />
          ) : (
            <RiWifiOffLine className="size-4" aria-hidden />
          )}
        </span>
        <div key={status} className="min-w-0 flex-1 animate-label-in motion-reduce:animate-none">
          <p className="text-body-2-semibold text-text-primary">
            {online ? "Back online" : reconnecting ? "Reconnecting…" : "You’re working offline"}
          </p>
          <p className="mt-0.5 text-caption-2-regular text-text-primary/80">
            {online
              ? "4 queued changes synced at 14:31 UTC. Editing is live again."
              : reconnecting
                ? "Reaching api.northline.co. Four changes are waiting to sync."
                : "No network since 14:28 UTC. Four changes are saved on this device."}
          </p>
        </div>
        <Badge
          tone={online ? "lime" : reconnecting ? "blue" : "rose"}
          className="mt-0.5 bg-background-primary-default shadow-xs"
        >
          {online ? "Online" : reconnecting ? "Attempt 2" : "Offline"}
        </Badge>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="min-w-0 truncate text-caption-2-regular text-text-primary/70">
          {online ? <span dir="ltr" className="font-mono">14:31 UTC</span> : reconnecting ? "Checking the route…" : "Changes stay queued on this device"}
        </span>
        {online ? (
          <button
            type="button"
            onClick={() => setStatus("offline")}
            className={cx(secondaryButton, "h-6 shrink-0 px-1.5 text-caption-2-medium shadow-none")}
          >
            <RiLoopLeftLine className="size-3" aria-hidden />
            Test again
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStatus("reconnecting")}
            disabled={reconnecting}
            className={cx(secondaryButton, "h-7 shrink-0 shadow-none")}
          >
            {reconnecting ? (
              <>
                <RiLoader4Line className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
                Reconnecting
              </>
            ) : (
              <>
                <RiRefreshLine className="size-3.5" aria-hidden />
                Reconnect now
              </>
            )}
          </button>
        )}
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {online ? "Connection restored. Four queued changes synced." : reconnecting ? "Reconnecting to the server." : "Connection lost. Four changes are queued locally."}
      </p>
    </section>
  );
}

/* 6. Missing Page */

const REPORTS = [
  { title: "Q4 revenue forecast", path: "/reports/q4-revenue", owner: "Finance" },
  { title: "Churn cohorts, October", path: "/reports/churn-cohorts", owner: "Growth" },
  { title: "Board pack, November", path: "/reports/board-pack", owner: "Exec" },
] as const;

type ReportResult = { kind: "found"; title: string; path: string; owner: string } | { kind: "empty"; query: string };

export function MissingPage() {
  const titleId = useId();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<ReportResult | null>(null);

  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    const match = REPORTS.find((report) => report.title.toLowerCase().includes(term.toLowerCase()));
    setResult(match ? { kind: "found", ...match } : { kind: "empty", query: term });
  };

  return (
    <section aria-labelledby={titleId} className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-background-tertiary-default px-1.5 py-0.5 font-mono text-caption-2-semibold text-text-secondary">
          404
        </span>
        <bdi dir="ltr" className="min-w-0 truncate font-mono text-caption-2-regular text-text-tertiary">
          /reports/q4-forecast
        </bdi>
      </div>

      <h3 id={titleId} className="mt-1.5 text-title-3-semibold text-text-primary">
        Report not found.
      </h3>
      <p className="mt-0.5 text-caption-1-regular text-text-secondary">
        The link may be old, or the report moved to a private folder.
      </p>

      <form onSubmit={search} className="mt-2 flex items-center gap-1.5" role="search" aria-label="Search reports">
        <div
          className={cx(
            "flex h-8 min-w-0 flex-1 items-center gap-1.5 rounded-lg bg-background-tertiary-default px-2",
            "ring-2 ring-inset ring-transparent transition-[background-color,box-shadow] duration-150 ease-out",
            "focus-within:ring-border-focus-ring hover:ring-border-button-hover motion-reduce:transition-none",
          )}
        >
          <RiSearchLine className="size-3.5 shrink-0 text-foreground-icon-secondary" aria-hidden />
          <input
            type="search"
            aria-label="Search reports"
            placeholder="Search reports"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setResult(null);
            }}
            className="min-w-0 flex-1 bg-transparent p-0 text-body-2-regular text-text-primary outline-none placeholder:text-text-placeholder [&::-webkit-search-cancel-button]:appearance-none"
          />
        </div>
        <button type="submit" aria-label="Search reports" className={cx(primaryButton, "size-8 shrink-0 px-0")}>
          <RiArrowRightLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
        </button>
      </form>

      <div aria-live="polite" className="mt-1.5">
        {result?.kind === "found" ? (
          <a
            href={result.path}
            className={cx(
              "flex animate-label-in items-center gap-1.5 rounded-md bg-background-secondary-default px-2 py-1 motion-reduce:animate-none",
              "transition-colors duration-150 ease-out hover:bg-background-secondary-hover motion-reduce:transition-none",
              focusRing,
            )}
          >
            <RiFileChartLine className="size-3.5 shrink-0 text-foreground-icon-secondary" aria-hidden />
            <span className="min-w-0 flex-1 truncate text-caption-1-medium text-text-primary">{result.title}</span>
            <span className="shrink-0 text-caption-2-regular text-text-tertiary">{result.owner}</span>
            <RiArrowRightLine className="size-3 shrink-0 text-foreground-icon-tertiary rtl:-scale-x-100" aria-hidden />
          </a>
        ) : result?.kind === "empty" ? (
          <p className="animate-label-in text-caption-2-regular text-text-secondary motion-reduce:animate-none">
            No report matches “{result.query}”. Try “revenue” or “churn”.
          </p>
        ) : null}
      </div>

      <div className="mt-2 flex items-center gap-1.5">
        <a href="#dashboard" className={cx(primaryButton, "h-7 flex-1")}>
          Back to dashboard
        </a>
        <a href="#reports" className={cx(secondaryButton, "h-7 shrink-0")}>
          All reports
        </a>
      </div>
    </section>
  );
}

/* 7. Permission Denied */

export function PermissionDenied() {
  const titleId = useId();
  const noteId = useId();
  const [asking, setAsking] = useState(false);
  const [sent, setSent] = useState(false);
  const [reason, setReason] = useState("Needs payout reconciliation for the Q4 close.");
  const requestRef = useRef<HTMLButtonElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const shouldRefocus = useRef(false);

  useEffect(() => {
    if (asking || !shouldRefocus.current) return;
    shouldRefocus.current = false;
    requestRef.current?.focus();
  }, [asking]);

  useEffect(() => {
    if (sent) statusRef.current?.focus();
  }, [sent]);

  const cancel = () => {
    shouldRefocus.current = true;
    setAsking(false);
  };

  return (
    <section
      aria-labelledby={titleId}
      className={cx(cardSurface, "max-w-[320px] p-2.5")}
      onKeyDown={(event) => {
        if (event.key === "Escape" && asking) {
          event.stopPropagation();
          cancel();
        }
      }}
    >
      <div className="flex items-start gap-2.5">
        <HeaderIcon icon={RiLock2Line} tone="rose" />
        <div className="min-w-0 flex-1">
          <p className="text-caption-2-semibold tracking-wide text-status-rose-text uppercase">
            <span className="font-mono">403</span> · Forbidden
          </p>
          <h3 id={titleId} className="mt-0.5 text-title-3-semibold text-text-primary">
            Payout runs are restricted.
          </h3>
        </div>
      </div>

      <p className="mt-1.5 text-caption-1-regular text-text-secondary">
        You’re signed in as <bdi dir="ltr">maya@northline.co</bdi> with the Analyst role. This page needs Finance Admin.
      </p>

      <div className="mt-2 flex items-center gap-2 rounded-lg bg-background-secondary-default px-2 py-1.5">
        <RiShieldKeyholeLine className="size-3.5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
        <span className="text-caption-2-regular text-text-tertiary">Missing role</span>
        <span className="ms-auto rounded-full bg-status-rose-background px-1.5 py-0.5 text-caption-2-medium text-status-rose-text">
          Finance Admin
        </span>
      </div>

      <button
        ref={requestRef}
        type="button"
        aria-expanded={asking}
        aria-controls={noteId}
        disabled={sent}
        onClick={() => setAsking((value) => !value)}
        className={cx(asking || sent ? secondaryButton : primaryButton, "mt-2 h-7 w-full", sent && "disabled:opacity-100")}
      >
        {sent ? (
          <>
            <RiCheckLine className="size-3.5 text-status-lime-text" aria-hidden />
            Request sent
          </>
        ) : asking ? (
          "Cancel request"
        ) : (
          <>
            <RiUserAddLine className="size-3.5" aria-hidden />
            Request access
          </>
        )}
      </button>

      <div
        id={noteId}
        inert={!asking}
        className={cx(revealGrid, asking ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="mt-2 flex items-center gap-1.5">
            <input
              id={`${noteId}-reason`}
              aria-label="Note to the workspace owner"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className={cx(
                "h-7 min-w-0 flex-1 rounded-md bg-background-secondary-default px-2 text-caption-1-medium text-text-primary outline-none",
                "transition-[box-shadow,background-color] duration-150 ease-out placeholder:text-text-placeholder motion-reduce:transition-none",
                focusRing,
              )}
            />
            <button
              type="button"
              onClick={() => {
                shouldRefocus.current = false;
                setSent(true);
                setAsking(false);
              }}
              className={cx(primaryButton, "h-7 shrink-0 px-2")}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <p
        ref={statusRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className={cx(
          "mt-1.5 min-h-4 rounded-sm text-caption-2-regular transition-colors duration-200 ease-out motion-reduce:transition-none",
          sent ? "text-status-lime-text" : "text-text-tertiary",
          focusRing,
        )}
      >
        {sent ? "Request sent. We’ll reply at maya@northline.co within one business day." : "Access is reviewed by the workspace owner."}
      </p>
    </section>
  );
}

/* 8. Rate Limited */

const RATE_WINDOW = 8;

export function RateLimited() {
  const [remaining, setRemaining] = useState(RATE_WINDOW);
  const [status, setStatus] = useState<"waiting" | "retrying" | "ok">("waiting");

  useEffect(() => {
    if (status !== "waiting" || remaining <= 0) return;
    const timer = window.setTimeout(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [remaining, status]);

  useEffect(() => {
    if (status !== "retrying") return;
    const timer = window.setTimeout(() => setStatus("ok"), 900);
    return () => window.clearTimeout(timer);
  }, [status]);

  const ok = status === "ok";
  const retrying = status === "retrying";
  const ready = remaining === 0;
  const progress = Math.round((remaining / RATE_WINDOW) * 100);

  const runAgain = () => {
    setRemaining(RATE_WINDOW);
    setStatus("waiting");
  };

  return (
    <section aria-label="Rate limit" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-start gap-2.5">
        <HeaderIcon icon={ok ? RiCheckLine : RiTimerLine} tone={ok ? "lime" : "yellow"} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className={cx("font-mono text-caption-2-semibold", ok ? "text-status-lime-text" : "text-status-yellow-text")}>
              {ok ? "200" : "429"}
            </span>
            <span className="text-caption-2-regular text-text-tertiary">· {ok ? "OK" : "Too many requests"}</span>
            <Badge tone={ok ? "lime" : "yellow"} className="ms-auto">
              {ok ? "Accepted" : retrying ? "Retrying" : "Limited"}
            </Badge>
          </div>
          <h3 className="mt-0.5 text-headline-semibold text-text-primary">
            {ok ? "Request accepted." : "Slow down for a moment."}
          </h3>
        </div>
      </div>

      <p className="mt-1.5 text-caption-1-regular text-text-secondary">
        {ok
          ? "The next attempt returned 200 OK in 42 ms. The export is queued."
          : "Exports are limited to 60 requests per minute. The window resets on its own."}
      </p>

      {ok ? (
        <div className="mt-2 flex items-center gap-2 rounded-lg bg-status-lime-background px-2 py-1.5 text-status-lime-text">
          <RiCheckLine className="size-3.5 shrink-0" aria-hidden />
          <span className="min-w-0 flex-1 text-caption-2-regular">Export EXP-7741 queued for finance@northline.co.</span>
          <span className="shrink-0 text-caption-2-regular tabular-nums">42 ms</span>
        </div>
      ) : (
        <>
          <div className="mt-2 flex items-end justify-between gap-2">
            <div>
              <p className="text-caption-2-regular text-text-tertiary">Quota resets in</p>
              <p className="text-title-3-semibold text-text-primary tabular-nums">
                0:{String(remaining).padStart(2, "0")}
              </p>
            </div>
            <p dir="ltr" className="pb-0.5 font-mono text-caption-2-regular text-text-tertiary">Retry-After: 8s</p>
          </div>
          <div
            role="progressbar"
            aria-label="Rate limit window"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            className="mt-1 h-1 overflow-hidden rounded-full bg-background-tertiary-default"
          >
            <div
              className="h-full rounded-full bg-status-yellow-text transition-[width] duration-200 ease-out motion-reduce:transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      )}

      <button
        type="button"
        onClick={ok ? runAgain : () => setStatus("retrying")}
        disabled={retrying || (!ok && !ready)}
        className={cx(ok ? secondaryButton : primaryButton, "mt-2 h-7 w-full")}
      >
        {ok ? (
          <>
            <RiLoopLeftLine className="size-3.5" aria-hidden />
            Run again
          </>
        ) : retrying ? (
          <>
            <RiLoader4Line className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
            Retrying
          </>
        ) : ready ? (
          <>
            <RiRefreshLine className="size-3.5" aria-hidden />
            Retry request
          </>
        ) : (
          <>
            <RiTimerLine className="size-3.5" aria-hidden />
            Retry in 0:{String(remaining).padStart(2, "0")}
          </>
        )}
      </button>
    </section>
  );
}

/* 9. Maintenance Notice */

export function MaintenanceNotice() {
  const titleId = useId();
  const [subscribed, setSubscribed] = useState(false);

  return (
    <section aria-labelledby={titleId} className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span aria-hidden className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-status-blue-background text-status-blue-text">
          <RiCalendarLine className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 id={titleId} className="text-body-2-semibold text-text-primary">
            Scheduled maintenance
          </h3>
          <p className="text-caption-2-regular text-text-tertiary">Reporting API · 2 hours</p>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-full border border-status-blue-text/20 px-1.5 py-0.5 text-caption-2-medium text-status-blue-text">
          <span className="size-1.5 animate-pulse rounded-full bg-status-blue-text motion-reduce:animate-none" aria-hidden />
          Scheduled
        </span>
      </div>

      <div className="mt-2 rounded-lg border border-separator-border bg-background-secondary-default p-2">
        <p className="text-caption-1-semibold text-text-primary">Sunday, 8 November</p>
        <p className="mt-0.5 text-caption-2-regular text-text-secondary">02:00–04:00 UTC · Dashboards stay up; exports pause.</p>
      </div>

      <p className="mt-1.5 text-caption-2-regular text-text-tertiary">
        {subscribed
          ? "We’ll email ops@northline.co 30 minutes before the window opens."
          : "One email before the window opens. No other reminders."}
      </p>

      <button
        type="button"
        aria-pressed={subscribed}
        onClick={() => setSubscribed((value) => !value)}
        className={cx(subscribed ? secondaryButton : primaryButton, "mt-1.5 h-7 w-full")}
      >
        {subscribed ? (
          <>
            <RiCheckLine className="size-3.5 text-status-lime-text" aria-hidden />
            Reminder set
          </>
        ) : (
          <>
            <RiNotification3Line className="size-3.5" aria-hidden />
            Notify me before it starts
          </>
        )}
      </button>
    </section>
  );
}

/* 10. Timeout State */

const TIMEOUT_LIMIT = 30;
const RETRY_SECONDS = 2.6;

export function TimeoutState() {
  const titleId = useId();
  const [status, setStatus] = useState<"timedout" | "retrying" | "ready">("timedout");
  const [elapsed, setElapsed] = useState(TIMEOUT_LIMIT);
  const [attempt, setAttempt] = useState(1);

  useEffect(() => {
    if (status !== "retrying") return;
    setElapsed(0);
    const tick = window.setInterval(() => {
      setElapsed((value) => Math.min(RETRY_SECONDS, Math.round((value + 0.1) * 10) / 10));
    }, 100);
    const done = window.setTimeout(() => {
      setElapsed(RETRY_SECONDS);
      setStatus("ready");
    }, RETRY_SECONDS * 1000);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(done);
    };
  }, [status]);

  const retry = () => {
    setAttempt((value) => Math.min(3, value + 1));
    setStatus("retrying");
  };

  const runAgain = () => {
    setAttempt(1);
    setElapsed(TIMEOUT_LIMIT);
    setStatus("timedout");
  };

  const retrying = status === "retrying";
  const ready = status === "ready";
  const progress = ready || status === "timedout" ? 100 : Math.min(100, (elapsed / RETRY_SECONDS) * 100);

  return (
    <section aria-labelledby={titleId} className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-start gap-2.5">
        <HeaderIcon icon={ready ? RiCheckLine : RiTimerLine} tone={ready ? "lime" : "orange"} />
        <div className="min-w-0 flex-1">
          <p className={cx("text-caption-2-semibold tracking-wide uppercase", ready ? "text-status-lime-text" : "text-status-orange-text")}>
            <span className="font-mono">{ready ? "200" : "504"}</span> · {ready ? "OK" : "Gateway timeout"}
          </p>
          <h3 id={titleId} className="mt-0.5 text-headline-semibold text-text-primary">
            {ready ? "Export finished." : retrying ? "Retrying the export…" : "The export timed out."}
          </h3>
        </div>
      </div>

      <p className="mt-1.5 text-caption-1-regular text-text-secondary">
        {ready
          ? "Ready after 2.6s. 18.4 MB, sent to finance@northline.co."
          : retrying
            ? `Attempt ${attempt} to /v1/exports/q4. We’ll stop after three.`
            : "No response from the reporting service after 30s. The job may still finish in the background."}
      </p>

      <div className="mt-2 flex items-center gap-2 rounded-lg bg-background-secondary-default px-2 py-1.5">
        <span className="text-caption-2-regular text-text-tertiary">Elapsed</span>
        <span className="text-body-2-semibold text-text-primary tabular-nums">{elapsed.toFixed(1)}s</span>
        <span className="ms-auto text-caption-2-regular text-text-tertiary tabular-nums">
          Attempt {attempt} of 3
        </span>
      </div>

      <div
        role="progressbar"
        aria-label="Export attempt progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        className="mt-1.5 h-1 overflow-hidden rounded-full bg-background-tertiary-default"
      >
        <div
          className={cx(
            "h-full rounded-full transition-[width,background-color] duration-200 ease-out motion-reduce:transition-none",
            ready ? "bg-status-lime-text" : "bg-status-orange-text",
          )}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-2 flex items-center gap-1.5">
        {ready ? (
          <>
            <a href="#export" className={cx(primaryButton, "h-7 flex-1")}>
              Download export
            </a>
            <button type="button" onClick={runAgain} className={cx(secondaryButton, "h-7 shrink-0")}>
              <RiLoopLeftLine className="size-3.5" aria-hidden />
              Run again
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={retry}
            disabled={retrying}
            className={cx(primaryButton, "h-7 w-full")}
          >
            {retrying ? (
              <>
                <RiLoader4Line className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
                Retrying export
              </>
            ) : (
              <>
                <RiRefreshLine className="size-3.5" aria-hidden />
                Retry export
              </>
            )}
          </button>
        )}
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {ready ? "Export finished after 2.6 seconds." : retrying ? "Retrying the export." : "Export timed out after thirty seconds."}
      </p>
    </section>
  );
}

/* 11. Form Errors */

const FORM_FIELDS = [
  { id: "name", label: "Contact", placeholder: "Maya Chen", type: "text", inputMode: "text", autoComplete: "name" },
  { id: "email", label: "Work email", placeholder: "maya@northline.co", type: "email", inputMode: "email", autoComplete: "email" },
  { id: "seats", label: "Seats", placeholder: "12", type: "text", inputMode: "numeric", autoComplete: "off" },
] as const;

type FieldId = (typeof FORM_FIELDS)[number]["id"];
type FormValues = Record<FieldId, string>;

const INITIAL_FORM: FormValues = { name: "", email: "maya@", seats: "120" };

function validateContact(values: FormValues) {
  const errors: Partial<Record<FieldId, string>> = {};
  if (!values.name.trim()) errors.name = "Enter the contact’s name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Add a full email address.";
  const seats = Number(values.seats);
  if (!Number.isInteger(seats) || seats < 1 || seats > 50) errors.seats = "Seats must be 1–50.";
  return errors;
}

export function FormErrors() {
  const baseId = useId();
  const [values, setValues] = useState<FormValues>(INITIAL_FORM);
  const [saved, setSaved] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const seatsRef = useRef<HTMLInputElement>(null);
  const inputRefs = { name: nameRef, email: emailRef, seats: seatsRef };

  const errors = validateContact(values);
  const issues = FORM_FIELDS.flatMap((field) => {
    const message = errors[field.id];
    return message ? [{ id: field.id, message }] : [];
  });
  const errorCount = issues.length;
  const ready = errorCount === 0;

  const update = (id: FieldId, value: string) => {
    setValues((current) => ({ ...current, [id]: value }));
    setSaved(false);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (issues.length > 0) {
      inputRefs[issues[0].id].current?.focus();
      return;
    }
    setSaved(true);
  };

  return (
    <form aria-labelledby={`${baseId}-title`} onSubmit={submit} noValidate className={cx(cardSurface, "max-w-[460px] p-2.5")}>
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <h3 id={`${baseId}-title`} className="text-body-2-semibold text-text-primary">
            Billing contact
          </h3>
          <p className="text-caption-2-regular text-text-tertiary">Used on invoices and receipts.</p>
        </div>
        <Badge tone={ready ? "lime" : "rose"} icon={ready ? RiCheckLine : RiErrorWarningLine}>
          {saved ? "Saved" : ready ? "Valid" : `${errorCount} error${errorCount === 1 ? "" : "s"}`}
        </Badge>
      </div>

      <div className="mt-2 grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] gap-2.5">
        <div
          className={cx(
            "rounded-lg border p-2 transition-[background-color,border-color,color] duration-200 ease-out motion-reduce:transition-none",
            ready
              ? "border-status-lime-text/20 bg-status-lime-background"
              : "border-border-error-default/30 bg-background-tertiary-error",
          )}
        >
          <p aria-live="polite" className={cx("flex items-center gap-1 text-caption-1-semibold", ready ? "text-status-lime-text" : "text-text-destructive")}>
            {ready ? <RiCheckLine className="size-3.5 shrink-0" aria-hidden /> : <RiErrorWarningLine className="size-3.5 shrink-0" aria-hidden />}
            {saved
              ? "Contact saved"
              : ready
                ? "All fields valid"
                : `${errorCount} field${errorCount === 1 ? "" : "s"} ${errorCount === 1 ? "needs" : "need"} attention`}
          </p>
          {ready ? (
            <p className="mt-1 text-caption-2-regular text-text-secondary">
              {saved ? "A receipt copy goes to maya@northline.co." : "Save when you’re ready. Nothing is charged yet."}
            </p>
          ) : (
            <ul className="mt-1 flex flex-col gap-0.5">
              {issues.map((issue) => (
                <li key={issue.id} id={`${baseId}-${issue.id}-error`}>
                  <button
                    type="button"
                    onClick={() => inputRefs[issue.id].current?.focus()}
                    className={cx("rounded-sm text-start text-caption-2-regular text-text-destructive underline-offset-2 hover:underline", focusRing)}
                  >
                    {issue.message}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid grid-cols-[68px_minmax(0,1fr)] content-center items-center gap-x-2 gap-y-1.5">
          {FORM_FIELDS.map((field) => {
            const message = errors[field.id];
            const invalid = !saved && Boolean(message);
            return (
              <div key={field.id} className="contents">
                <label htmlFor={`${baseId}-${field.id}`} className="text-caption-1-medium text-text-secondary">
                  {field.label}
                </label>
                <input
                  ref={inputRefs[field.id]}
                  id={`${baseId}-${field.id}`}
                  type={field.type}
                  dir={field.id === "email" ? "ltr" : undefined}
                  inputMode={field.inputMode}
                  autoComplete={field.autoComplete}
                  placeholder={field.placeholder}
                  value={values[field.id]}
                  aria-invalid={invalid}
                  aria-describedby={invalid ? `${baseId}-${field.id}-error` : undefined}
                  onChange={(event) => update(field.id, event.target.value)}
                  className={cx(
                    "h-7 w-full rounded-lg bg-background-tertiary-default px-2 text-caption-1-medium text-text-primary outline-none",
                    "ring-2 ring-inset transition-[box-shadow,background-color] duration-150 ease-out",
                    "placeholder:text-text-placeholder focus-visible:ring-border-focus-ring motion-reduce:transition-none",
                    invalid ? "ring-border-error-default" : "ring-transparent hover:ring-border-button-hover",
                  )}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 border-t border-separator-border pt-2">
        <p className="min-w-0 truncate text-caption-2-regular text-text-tertiary">
          {saved ? <span dir="ltr" className="font-mono">Saved 14:32 UTC</span> : "No charge until you save."}
        </p>
        <button type="submit" disabled={saved} className={cx(saved ? secondaryButton : primaryButton, "h-7 shrink-0")}>
          {saved ? (
            <>
              <RiCheckLine className="size-3.5" aria-hidden />
              Saved
            </>
          ) : (
            "Save contact"
          )}
        </button>
      </div>
    </form>
  );
}

/* 12. Crash Report */

const CRASH_REPORT = [
  "Crash report crash_9f31c2",
  "Route: /dashboard",
  "Time: 2026-11-05 14:32:08 UTC",
  "TypeError: forecastRows.map is not a function",
  "at RevenueChart (dashboard.tsx:84:19)",
  "at DashboardPage (app/dashboard/page.tsx:31:7)",
].join("\n");

export function CrashReport() {
  const titleId = useId();
  const detailsId = useId();
  const [details, setDetails] = useState(false);
  const [reloading, setReloading] = useState(false);
  const [reloaded, setReloaded] = useState(false);

  useEffect(() => {
    if (!reloading) return;
    const timer = window.setTimeout(() => {
      setReloading(false);
      setReloaded(true);
    }, 1100);
    return () => window.clearTimeout(timer);
  }, [reloading]);

  return (
    <section aria-labelledby={titleId} className={cx(cardSurface, "max-w-[320px] border-border-error-default/40 p-2.5")}>
      <div className="flex items-start gap-2.5">
        <HeaderIcon icon={RiBugLine} tone="rose" />
        <div className="min-w-0 flex-1">
          <p className="text-caption-2-semibold tracking-wide text-status-rose-text uppercase">Error boundary</p>
          <h3 id={titleId} className="mt-0.5 text-title-3-semibold text-text-primary">
            Dashboard stopped rendering.
          </h3>
        </div>
      </div>

      <p className="mt-1.5 text-caption-2-regular text-text-tertiary">
        Route <bdi dir="ltr" className="font-mono">/dashboard</bdi> failed at{" "}
        <bdi dir="ltr" className="font-mono">14:32:08 UTC</bdi>.
      </p>

      <pre
        dir="ltr"
        className="mt-1.5 overflow-hidden rounded-lg border border-separator-border bg-background-secondary-default px-2 py-1.5 text-start font-mono text-caption-2-regular whitespace-pre-wrap break-words text-text-primary"
      >
        TypeError: forecastRows.map is not a function
      </pre>

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <bdi dir="ltr" className="truncate font-mono text-caption-2-regular text-text-tertiary">
          crash_9f31c2
        </bdi>
        <button
          type="button"
          aria-expanded={details}
          aria-controls={detailsId}
          onClick={() => setDetails((value) => !value)}
          className={cx(quietButton, "h-6 shrink-0 gap-1 px-1.5 text-caption-2-medium")}
        >
          Details
          <RiArrowDownSLine
            className={cx(
              "size-3.5 text-foreground-icon-tertiary transition-transform duration-200 ease-out motion-reduce:transition-none",
              details && "rotate-180",
            )}
            aria-hidden
          />
        </button>
      </div>

      <div
        id={detailsId}
        inert={!details}
        className={cx(revealGrid, details ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
      >
        <div className="min-h-0 overflow-hidden">
          <pre
            dir="ltr"
            className="mt-1.5 rounded-lg border border-separator-border bg-background-secondary-default px-2 py-1.5 text-start font-mono text-caption-2-regular whitespace-pre-wrap break-words text-text-secondary"
          >
            {"at RevenueChart (dashboard.tsx:84:19)\nat DashboardPage (app/dashboard/page.tsx:31:7)"}
          </pre>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => {
            setReloading(true);
            setReloaded(false);
          }}
          disabled={reloading}
          className={cx(primaryButton, "h-7 flex-1")}
        >
          {reloading ? (
            <RiLoader4Line className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
          ) : reloaded ? (
            <RiCheckLine className="size-3.5" aria-hidden />
          ) : (
            <RiRefreshLine className="size-3.5" aria-hidden />
          )}
          {reloading ? "Reloading" : reloaded ? "Reloaded" : "Reload dashboard"}
        </button>
        <CopyButton text={CRASH_REPORT} label="Copy report" copiedLabel="Copied" className="h-7" />
      </div>

      <p aria-live="polite" className="mt-1.5 min-h-4 text-caption-2-regular text-text-secondary">
        {reloading
          ? "Rebuilding the route and restoring the last snapshot…"
          : reloaded
            ? "Dashboard reloaded. If it crashes again, copy the report."
            : "No account data is included in the report."}
      </p>
    </section>
  );
}

/* Specimens */

export const ERRORS_SECTION: ExtendedSection = {
  id: "errors",
  title: "Errors",
  blurb: "Failure, absence and waiting, said plainly.",
  file: "errors.tsx",
  entries: [
    { name: "Error Card", description: "A 500 with its request ID, a safe retry and diagnostics on the clipboard.", Demo: ErrorCard },
    { name: "Blank State", description: "An empty report shelf, one quiet illustration and one action that creates a draft.", Demo: BlankState },
    { name: "Page Skeleton", description: "A page taking shape, with a pause control and a static reduced-motion path.", Demo: PageSkeleton },
    { name: "Retry Banner", description: "A failed save that shows its attempt budget, retries and recovers.", Demo: RetryBanner },
    { name: "Offline Banner", description: "Offline, reconnecting and back online, with four queued changes intact.", Demo: OfflineBanner },
    { name: "Missing Page", description: "A 404 with search, a matching report and two routes home.", Demo: MissingPage },
    { name: "Permission Denied", description: "A 403 that names the missing role and sends an access request.", Demo: PermissionDenied },
    { name: "Rate Limited", description: "A 429 with a live reset countdown, a held retry and a clean 200.", Demo: RateLimited },
    { name: "Maintenance Notice", description: "A scheduled window, its status and a reminder that toggles.", Demo: MaintenanceNotice },
    { name: "Timeout State", description: "A slow export with live elapsed time and a retry that finishes.", Demo: TimeoutState },
    { name: "Form Errors", description: "Three invalid fields, a linked summary and a real save.", Demo: FormErrors, wide: true },
    { name: "Crash Report", description: "An error boundary with a stack, reload and a shareable report.", Demo: CrashReport },
  ],
};
