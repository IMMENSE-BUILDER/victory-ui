"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import {
  RiAlertLine,
  RiArrowDownSLine,
  RiArrowGoBackLine,
  RiCheckLine,
  RiCloseLine,
  RiCodeSSlashLine,
  RiDeleteBinLine,
  RiErrorWarningLine,
  RiEyeLine,
  RiEyeOffLine,
  RiFileCopyLine,
  RiGitBranchLine,
  RiGitCommitLine,
  RiGlobalLine,
  RiKey2Line,
  RiLoader4Line,
  RiLockLine,
  RiPauseLine,
  RiPlayLine,
  RiRefreshLine,
  RiSendPlaneLine,
  RiSpeedLine,
  RiTerminalBoxLine,
  RiTimeLine,
  RiWebhookLine,
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
const cardSurface = "w-full rounded-xl border border-border-button-default bg-background-primary-default shadow-card";
const codeSurface = "rounded-lg border border-separator-border bg-docs-code-background";
const mono = "font-mono";

const buttonBase = cx(
  "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg text-caption-1-semibold",
  "transition-[transform,background-color,color,box-shadow,opacity] duration-150 ease-out",
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  "motion-reduce:transition-none motion-reduce:active:scale-100",
);
const primaryButton = cx(buttonBase, "h-8 bg-button-primary px-2.5 text-text-white shadow-xs", focusRing);
const miniButton = cx(
  "inline-flex h-6 shrink-0 items-center justify-center gap-1 rounded-md px-1.5 text-caption-2-semibold",
  "transition-[background-color,color,opacity] duration-150 ease-out motion-reduce:transition-none",
  "disabled:pointer-events-none disabled:opacity-50",
  focusRing,
);
const miniSecondary = cx(
  miniButton,
  "border border-border-button-default bg-background-primary-default text-text-secondary shadow-xs hover:bg-background-primary-hover hover:text-text-primary",
);
const miniDanger = cx(miniButton, "bg-button-danger text-text-white");
const quietButton = cx(
  buttonBase,
  "h-7 px-1.5 text-text-secondary hover:bg-background-secondary-default hover:text-text-primary",
  focusRing,
);
const iconButton = cx(
  "flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-icon-tertiary",
  "transition-[background-color,color] duration-150 ease-out hover:bg-background-tertiary-default hover:text-text-primary",
  "disabled:pointer-events-none disabled:text-foreground-icon-disabled",
  "motion-reduce:transition-none",
  focusRing,
);
const revealGrid = "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none";

function useCopyFeedback(timeout = 1600) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), timeout);
    return () => window.clearTimeout(timer);
  }, [copied, timeout]);

  const copy = (value: string) => {
    setCopied(true);
    void navigator.clipboard?.writeText(value).catch(() => undefined);
  };

  return { copied, copy };
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const { copied, copy } = useCopyFeedback();

  return (
    <button
      type="button"
      aria-label={copied ? `${label} (copied)` : label}
      onClick={() => copy(value)}
      className={iconButton}
    >
      <span key={copied ? "copied" : "copy"} className="flex animate-label-in motion-reduce:animate-none">
        {copied ? (
          <RiCheckLine className="size-3.5 text-status-lime-text" aria-hidden />
        ) : (
          <RiFileCopyLine className="size-3.5" aria-hidden />
        )}
      </span>
    </button>
  );
}

type Tone = "ok" | "warn" | "error" | "neutral";

const TONE_PILL: Record<Tone, string> = {
  ok: "bg-status-lime-background text-status-lime-text",
  warn: "bg-status-yellow-background text-status-yellow-text",
  error: "bg-status-rose-background text-status-rose-text",
  neutral: "bg-background-tertiary-default text-text-secondary",
};

const TONE_DOT: Record<Tone, string> = {
  ok: "bg-status-lime-text",
  warn: "bg-status-orange-text",
  error: "bg-status-rose-text",
  neutral: "bg-foreground-icon-tertiary",
};

function StatusPill({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-caption-2-medium",
        "transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
        TONE_PILL[tone],
      )}
    >
      <span aria-hidden className={cx("size-1.5 rounded-full", TONE_DOT[tone])} />
      {children}
    </span>
  );
}

type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

const METHOD_TONES: Record<Method, string> = {
  GET: "bg-status-cyan-background text-status-cyan-text",
  POST: "bg-status-lime-background text-status-lime-text",
  PATCH: "bg-status-yellow-background text-status-yellow-text",
  PUT: "bg-status-blue-background text-status-blue-text",
  DELETE: "bg-status-rose-background text-status-rose-text",
};

function MethodTag({ method }: { method: Method }) {
  return (
    <span
      dir="ltr"
      className={cx(
        "inline-flex h-5 w-10 shrink-0 items-center justify-center rounded-sm font-mono text-caption-2-semibold uppercase",
        METHOD_TONES[method],
      )}
    >
      {method}
    </span>
  );
}

function DemoIcon({ icon: Icon }: { icon: IconComponent }) {
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
      <Icon className="size-3.5" aria-hidden />
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  1. API key ring                                                            */
/* -------------------------------------------------------------------------- */

const API_KEYS = [
  {
    id: "ci",
    name: "ci-deploy",
    masked: "sk_live_••••••7f3a",
    secret: "sk_live_9c41b7e2d8a05f6b3e7f3a",
    scopes: ["deploy", "read"],
    used: "2 min ago",
  },
  {
    id: "hooks",
    name: "webhooks",
    masked: "sk_live_••••••c02d",
    secret: "sk_live_52ad9e1f4b7c80a6d31c02d",
    scopes: ["hooks"],
    used: "18 min ago",
  },
];

export function ApiKeyRing() {
  const [keys, setKeys] = useState(API_KEYS);
  const [revealed, setRevealed] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<string | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (revoking) cancelRef.current?.focus();
  }, [revoking]);

  const confirmRevoke = (id: string) => {
    setKeys((current) => current.filter((key) => key.id !== id));
    setRevoking(null);
    setRevealed((current) => (current === id ? null : current));
  };

  return (
    <section
      aria-label="API key ring"
      className={cx(cardSurface, "max-w-[320px] p-2.5")}
      onKeyDown={(event) => {
        if (event.key === "Escape" && revoking) {
          event.stopPropagation();
          setRevoking(null);
        }
      }}
    >
      <div className="flex items-center gap-2">
        <DemoIcon icon={RiKey2Line} />
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">API keys</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">Workspace · production</p>
        </div>
        <StatusPill tone={keys.length ? "ok" : "neutral"}>{keys.length} active</StatusPill>
      </div>

      <ul className="mt-1 divide-y divide-separator-border">
        {keys.map((key) => {
          const open = revealed === key.id;
          const confirming = revoking === key.id;

          return (
            <li key={key.id} className="py-1.5 last:pb-0">
              {confirming ? (
                <div className="flex min-h-9 animate-label-in items-center gap-1.5 motion-reduce:animate-none">
                  <p className="min-w-0 flex-1 truncate text-caption-1-medium text-text-primary">
                    Revoke <span className={cx(mono, "text-text-secondary")}>{key.name}</span>?
                  </p>
                  <button ref={cancelRef} type="button" onClick={() => setRevoking(null)} className={miniSecondary}>
                    Cancel
                  </button>
                  <button type="button" onClick={() => confirmRevoke(key.id)} className={miniDanger}>
                    Revoke
                  </button>
                </div>
              ) : (
                <div className="flex min-h-9 items-center gap-1">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="truncate text-caption-1-semibold text-text-primary">{key.name}</span>
                      {key.scopes.map((scope) => (
                        <span
                          key={scope}
                          dir="ltr"
                          className="shrink-0 rounded-sm bg-background-secondary-default px-1 text-caption-2-regular text-text-tertiary"
                        >
                          {scope}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      <span
                        key={open ? "open" : "closed"}
                        dir="ltr"
                        className={cx(
                          mono,
                          "min-w-0 flex-1 animate-label-in truncate text-caption-2-regular text-text-secondary motion-reduce:animate-none",
                        )}
                      >
                        {open ? key.secret : key.masked}
                      </span>
                      {!open && (
                        <span className="shrink-0 text-caption-2-regular text-text-tertiary">· {key.used}</span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label={open ? `Hide ${key.name} key` : `Reveal ${key.name} key`}
                    aria-pressed={open}
                    onClick={() => setRevealed(open ? null : key.id)}
                    className={iconButton}
                  >
                    {open ? <RiEyeOffLine className="size-3.5" aria-hidden /> : <RiEyeLine className="size-3.5" aria-hidden />}
                  </button>
                  <CopyButton value={key.secret} label={`Copy ${key.name} key`} />
                  <button
                    type="button"
                    aria-label={`Revoke ${key.name} key`}
                    onClick={() => setRevoking(key.id)}
                    className={iconButton}
                  >
                    <RiDeleteBinLine className="size-3.5" aria-hidden />
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {keys.length === 0 ? (
        <div className="mt-1.5 flex flex-col items-center gap-1 py-1">
          <p className="text-caption-2-regular text-text-tertiary">No active keys. Requests will fail.</p>
          <button
            type="button"
            onClick={() => {
              setKeys(API_KEYS);
              setRevealed(null);
            }}
            className={cx(quietButton, "w-full")}
          >
            <RiRefreshLine className="size-3.5" aria-hidden />
            Restore demo keys
          </button>
        </div>
      ) : (
        <p className="mt-1.5 text-caption-2-regular text-text-tertiary">Scoped keys rotate every 90 days.</p>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  2. Webhook endpoint                                                        */
/* -------------------------------------------------------------------------- */

const WEBHOOK_URL = "https://api.northline.dev/hooks/github";
const WEBHOOK_EVENTS = ["push", "pull_request", "release"];

type DeliveryState = "idle" | "sending" | "delivered";

export function WebhookEndpoint() {
  const [delivery, setDelivery] = useState<DeliveryState>("idle");

  useEffect(() => {
    if (delivery !== "sending") return;
    const timer = window.setTimeout(() => setDelivery("delivered"), 900);
    return () => window.clearTimeout(timer);
  }, [delivery]);

  const statusText =
    delivery === "sending"
      ? "Sending test event…"
      : delivery === "delivered"
        ? "Delivered 200 in 162 ms"
        : "Last delivery 200 in 184 ms";

  return (
    <section aria-label="Webhook endpoint" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-2">
        <DemoIcon icon={RiWebhookLine} />
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">GitHub webhook</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">5 events · signed sha256</p>
        </div>
        <StatusPill tone="ok">Enabled</StatusPill>
      </div>

      <div className={cx(codeSurface, "mt-2 flex h-8 items-center gap-1 ps-2 pe-1")}>
        <span dir="ltr" className={cx(mono, "min-w-0 flex-1 truncate text-caption-2-regular text-text-secondary")}>
          {WEBHOOK_URL}
        </span>
        <CopyButton value={WEBHOOK_URL} label="Copy webhook URL" />
      </div>

      <div className="mt-1.5 flex items-center gap-1">
        <span className="shrink-0 text-caption-2-regular text-text-tertiary">Events</span>
        {WEBHOOK_EVENTS.map((event) => (
          <span
            key={event}
            dir="ltr"
            className={cx(mono, "rounded-full bg-background-secondary-default px-1.5 py-0.5 text-caption-2-regular text-text-secondary")}
          >
            {event}
          </span>
        ))}
        <span className="ms-auto shrink-0 text-caption-2-regular text-text-tertiary">+2</span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 border-t border-separator-border pt-1.5">
        <div className="min-w-0" aria-live="polite">
          <div key={delivery} className="animate-label-in motion-reduce:animate-none">
            <p
              className={cx(
                "flex items-center gap-1 text-caption-2-regular transition-colors duration-200 ease-out motion-reduce:transition-none",
                delivery === "delivered" ? "text-status-lime-text" : "text-text-secondary",
              )}
            >
              <span
                aria-hidden
                className={cx(
                  "size-1.5 shrink-0 rounded-full",
                  delivery === "delivered" ? "bg-status-lime-text" : "bg-status-lime-text/60",
                )}
              />
              {statusText}
            </p>
            <p className="truncate text-caption-2-regular text-text-tertiary">
              {delivery === "delivered" ? "Just now · signed sha256" : "12:42:08 UTC · attempt 1"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setDelivery("sending")}
          disabled={delivery === "sending"}
          className={cx(primaryButton, "h-7")}
        >
          {delivery === "sending" ? (
            <>
              <RiLoader4Line className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
              Sending
            </>
          ) : delivery === "delivered" ? (
            <>
              <RiRefreshLine className="size-3.5" aria-hidden />
              Send again
            </>
          ) : (
            <>
              <RiSendPlaneLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
              Send test
            </>
          )}
        </button>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  3. Request log                                                             */
/* -------------------------------------------------------------------------- */

const REQUESTS: { id: string; method: Method; path: string; status: number; latency: string; time: string }[] = [
  { id: "req_8f2a", method: "GET", path: "/v1/keys?limit=20", status: 200, latency: "42 ms", time: "12:42:08" },
  { id: "req_8f19", method: "POST", path: "/v1/webhooks", status: 201, latency: "118 ms", time: "12:41:56" },
  { id: "req_8f04", method: "PATCH", path: "/v1/keys/ci-deploy", status: 401, latency: "12 ms", time: "12:41:22" },
  { id: "req_8ef1", method: "GET", path: "/v1/events?after=evt_9", status: 200, latency: "31 ms", time: "12:41:44" },
];

const REQUEST_FILTERS = [
  { id: "all", label: "All" },
  { id: "2xx", label: "2xx" },
  { id: "4xx", label: "4xx" },
] as const;

type RequestFilter = (typeof REQUEST_FILTERS)[number]["id"];

export function RequestLog() {
  const [filter, setFilter] = useState<RequestFilter>("all");
  const visible = REQUESTS.filter((request) => {
    if (filter === "all") return true;
    if (filter === "2xx") return request.status >= 200 && request.status < 300;
    return request.status >= 400;
  });

  return (
    <section aria-label="Request log" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-2">
        <DemoIcon icon={RiTerminalBoxLine} />
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">Request log</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">api.northline.dev · production</p>
        </div>
        <StatusPill tone="ok">Live</StatusPill>
      </div>

      <div role="group" aria-label="Filter requests by status" className="mt-1 flex items-center gap-0.5 rounded-lg bg-background-secondary-default p-0.5">
        {REQUEST_FILTERS.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={filter === option.id}
            onClick={() => setFilter(option.id)}
            className={cx(
              "h-6 flex-1 rounded-md text-caption-2-semibold transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
              focusRing,
              filter === option.id
                ? "bg-segmented-control-selected-background text-text-primary shadow-xs"
                : "text-text-tertiary hover:text-text-secondary",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div key={filter} aria-live="polite" dir="ltr" className="mt-1 animate-label-in motion-reduce:animate-none">
        {visible.map((request) => (
          <div
            key={request.id}
            title={`${request.time} UTC · ${request.id}`}
            className="flex items-center gap-1.5 border-b border-separator-border py-0.5 last:border-b-0"
          >
            <MethodTag method={request.method} />
            <span dir="ltr" className={cx(mono, "min-w-0 flex-1 truncate text-caption-2-regular text-text-secondary")}>
              {request.path}
            </span>
            <span
              className={cx(
                "shrink-0 text-caption-2-semibold tabular-nums",
                request.status >= 400 ? "text-status-rose-text" : "text-status-lime-text",
              )}
            >
              {request.status}
            </span>
            <span className="w-9 shrink-0 text-end text-caption-2-regular text-text-tertiary tabular-nums">
              {request.latency}
            </span>
          </div>
        ))}
      </div>

    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  4. Rate limit dial                                                         */
/* -------------------------------------------------------------------------- */

const RATE_QUOTA = 1000;
const RATE_USED = 684;
const RATE_BURST = 120;
const RATE_THRESHOLD = 800;
const RATE_RADIUS = 26;
const RATE_CIRCUMFERENCE = 2 * Math.PI * RATE_RADIUS;

export function RateLimitDial() {
  const [used, setUsed] = useState(RATE_USED);
  const percent = Math.round((used / RATE_QUOTA) * 100);
  const offset = RATE_CIRCUMFERENCE * (1 - used / RATE_QUOTA);
  const dialTone =
    used >= RATE_THRESHOLD
      ? "text-status-rose-text"
      : used >= RATE_THRESHOLD * 0.75
        ? "text-status-orange-text"
        : "text-status-lime-text";

  return (
    <section aria-label="Rate limit dial" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-2">
        <DemoIcon icon={RiSpeedLine} />
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">Rate limit</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">
            Keys API · workspace <bdi dir="ltr">ws_482</bdi>
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-background-secondary-default px-1.5 py-0.5 text-caption-2-medium text-text-secondary">
          1 min
        </span>
      </div>

      <div className="mt-1.5 flex items-center gap-2.5">
        <div
          role="img"
          aria-label={`${used} of ${RATE_QUOTA} requests used, ${percent} percent. Window resets in ${used === 0 ? "60" : "42"} seconds.`}
          className="relative size-[76px] shrink-0"
        >
          <svg viewBox="0 0 76 76" className="size-[76px] -rotate-90" aria-hidden>
            <circle
              cx="38"
              cy="38"
              r={RATE_RADIUS}
              fill="none"
              strokeWidth="6"
              stroke="currentColor"
              className="text-background-tertiary-default"
            />
            <circle
              cx="38"
              cy="38"
              r={RATE_RADIUS}
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              stroke="currentColor"
              strokeDasharray={RATE_CIRCUMFERENCE}
              strokeDashoffset={offset}
              className={cx("transition-[stroke-dashoffset,color] duration-200 ease-out motion-reduce:transition-none", dialTone)}
            />
          </svg>
          <div
            key={used}
            className="absolute inset-0 flex animate-label-in flex-col items-center justify-center motion-reduce:animate-none"
          >
            <span className="text-title-3-semibold text-text-primary tabular-nums">{percent}%</span>
            <span className="text-caption-2-regular text-text-tertiary">used</span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-body-2-semibold text-text-primary tabular-nums">
            {used.toLocaleString("en-US")} <span className="text-caption-2-regular text-text-tertiary">/ {RATE_QUOTA.toLocaleString("en-US")}</span>
          </p>
          <p className="text-caption-2-regular text-text-tertiary">requests this minute</p>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
            <span className="flex items-center gap-1 text-caption-2-regular text-text-tertiary">
              <RiTimeLine className="size-3" aria-hidden />
              Resets in <span className="text-text-secondary tabular-nums">{used === 0 ? "60s" : "42s"}</span>
            </span>
            <span className="text-caption-2-regular text-text-tertiary">
              Burst <span className="text-text-secondary tabular-nums">+{RATE_BURST}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2 border-t border-separator-border pt-1.5">
        <span className="flex items-center gap-1 text-caption-2-regular text-text-tertiary">
          <RiAlertLine className="size-3 text-status-orange-text" aria-hidden />
          Alert at <span className="tabular-nums">{RATE_THRESHOLD}</span> req/min
        </span>
        <button
          type="button"
          aria-label={used === 0 ? "Restore demo traffic" : "Reset rate limit window"}
          onClick={() => setUsed(used === 0 ? RATE_USED : 0)}
          className={miniSecondary}
        >
          <RiRefreshLine className="size-3" aria-hidden />
          {used === 0 ? "Restore" : "Reset"}
        </button>
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {used === 0 ? "Window reset. Quota is clear." : `${percent} percent of the minute used.`}
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  5. Environment switch                                                      */
/* -------------------------------------------------------------------------- */

const ENVIRONMENTS = [
  { id: "development", label: "Development", host: "dev.northline.dev", tone: "ok" },
  { id: "staging", label: "Staging", host: "staging.northline.dev", tone: "warn" },
  { id: "production", label: "Production", host: "northline.dev", tone: "error" },
] as const;

type EnvId = (typeof ENVIRONMENTS)[number]["id"];

export function EnvironmentSwitch() {
  const overlayId = useId();
  const titleId = useId();
  const hintId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const productionRef = useRef<HTMLButtonElement>(null);
  const wasConfirming = useRef(false);
  const [current, setCurrent] = useState<EnvId>("staging");
  const [confirming, setConfirming] = useState(false);
  const [draft, setDraft] = useState("");

  const currentEnv = ENVIRONMENTS.find((env) => env.id === current) ?? ENVIRONMENTS[0];
  const canSwitch = draft.trim().toLowerCase() === "prod";

  useEffect(() => {
    if (confirming) {
      wasConfirming.current = true;
      inputRef.current?.focus();
      return;
    }
    if (wasConfirming.current) {
      wasConfirming.current = false;
      productionRef.current?.focus();
    }
  }, [confirming]);

  const close = () => {
    setConfirming(false);
    setDraft("");
  };

  const choose = (env: EnvId) => {
    if (env === "production" && current !== "production") {
      setConfirming(true);
      return;
    }
    setCurrent(env);
  };

  const confirmProduction = () => {
    if (!canSwitch) return;
    setCurrent("production");
    close();
  };

  return (
    <section
      aria-label="Environment switch"
      className={cx(cardSurface, "max-w-[320px] p-2.5")}
      onKeyDown={(event) => {
        if (event.key === "Escape" && confirming) {
          event.stopPropagation();
          close();
        }
      }}
    >
      <div className="flex items-center gap-2">
        <DemoIcon icon={RiGlobalLine} />
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">Environment</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">All requests and webhooks</p>
        </div>
        <span role="status" aria-live="polite">
          <span key={current} className="inline-block animate-label-in motion-reduce:animate-none">
            <StatusPill tone={currentEnv.tone}>{currentEnv.label}</StatusPill>
          </span>
        </span>
      </div>

      <div className="relative mt-2">
        <div
          inert={confirming}
          role="group"
          aria-label="Choose environment"
          className="overflow-hidden rounded-lg border border-separator-border"
        >
          {ENVIRONMENTS.map((env) => {
            const active = env.id === current;
            return (
              <button
                key={env.id}
                ref={env.id === "production" ? productionRef : undefined}
                type="button"
                aria-pressed={active}
                aria-expanded={env.id === "production" ? confirming : undefined}
                aria-controls={env.id === "production" ? overlayId : undefined}
                onClick={() => choose(env.id)}
                className={cx(
                  "flex h-9 w-full items-center gap-1.5 border-b border-separator-border px-2 text-start last:border-b-0",
                  "transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
                  focusRing,
                  "focus-visible:ring-inset",
                  active ? "bg-background-secondary-default" : "bg-background-primary-default hover:bg-background-primary-hover",
                )}
              >
                <span aria-hidden className={cx("size-1.5 shrink-0 rounded-full", TONE_DOT[env.tone])} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-caption-1-semibold text-text-primary">{env.label}</span>
                  <span dir="ltr" className={cx(mono, "block truncate text-start text-caption-2-regular text-text-tertiary")}>
                    {env.host}
                  </span>
                </span>
                {active && <RiCheckLine className="size-3.5 shrink-0 text-status-blue-text" aria-hidden />}
              </button>
            );
          })}
        </div>

        <div
          id={overlayId}
          role="dialog"
          aria-labelledby={titleId}
          aria-describedby={hintId}
          aria-hidden={!confirming}
          inert={!confirming}
          className={cx(
            "absolute inset-0 z-10 flex flex-col justify-center gap-1.5 rounded-lg border border-border-error-default bg-background-primary-default p-2 shadow-dropdown",
            "transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
            confirming ? "scale-100 opacity-100" : "pointer-events-none scale-[0.98] opacity-0",
          )}
        >
          <div className="flex items-center gap-1.5">
            <RiLockLine className="size-3.5 shrink-0 text-text-error-primary" aria-hidden />
            <p id={titleId} className="min-w-0 flex-1 truncate text-caption-1-semibold text-text-primary">
              Confirm production
            </p>
            <button
              type="button"
              aria-label="Cancel production switch"
              onClick={close}
              className={cx(iconButton, "-me-1 size-5")}
            >
              <RiCloseLine className="size-3" aria-hidden />
            </button>
          </div>
          <p id={hintId} className="text-caption-2-regular text-text-secondary">
            Live traffic. Type <span dir="ltr" className={cx(mono, "text-text-primary")}>prod</span> to switch.
          </p>
          <div className="flex items-center gap-1">
            <input
              ref={inputRef}
              value={draft}
              dir="ltr"
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="none"
              placeholder="prod"
              aria-label="Type prod to confirm production"
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") confirmProduction();
              }}
              className={cx(
                "h-7 min-w-0 flex-1 rounded-md bg-background-tertiary-default px-1.5",
                mono,
                "text-caption-1-medium text-text-primary outline-none placeholder:text-text-placeholder",
                focusRing,
              )}
            />
            <button
              type="button"
              disabled={!canSwitch}
              onClick={confirmProduction}
              className={canSwitch ? miniDanger : miniSecondary}
            >
              Switch
            </button>
            <button type="button" onClick={close} className={miniSecondary}>
              Cancel
            </button>
          </div>
        </div>
      </div>

      <p className="mt-1 text-caption-2-regular text-text-tertiary">Production changes are logged to the audit trail.</p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  6. Deploy status                                                           */
/* -------------------------------------------------------------------------- */

const DEPLOY_STAGES = ["Build", "Test", "Deploy", "Verify"] as const;

export function DeployStatus() {
  const [rolledBack, setRolledBack] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const keepRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (confirming) keepRef.current?.focus();
  }, [confirming]);

  return (
    <section
      aria-label="Deploy status"
      className={cx(cardSurface, "max-w-[320px] p-2.5")}
      onKeyDown={(event) => {
        if (event.key === "Escape" && confirming) {
          event.stopPropagation();
          setConfirming(false);
        }
      }}
    >
      <div className="flex items-start gap-2">
        <DemoIcon icon={RiGitBranchLine} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="min-w-0 flex-1 truncate text-body-2-semibold text-text-primary">
              Deploy <span className="tabular-nums">#4821</span>
            </h3>
            <span role="status" aria-live="polite">
              <span
                key={rolledBack ? "rolled-back" : "live"}
                className="inline-block animate-label-in motion-reduce:animate-none"
              >
                <StatusPill tone={rolledBack ? "warn" : "ok"}>{rolledBack ? "Rolled back" : "Live"}</StatusPill>
              </span>
            </span>
          </div>
          <p className="mt-0.5 flex items-center gap-1 text-caption-2-regular text-text-tertiary">
            <RiGitCommitLine className="size-3 shrink-0" aria-hidden />
            <span dir="ltr" className={cx(mono, "text-text-secondary")}>9f3c1a7</span>
            <span className="truncate">fix: rotate webhook secret</span>
          </p>
        </div>
      </div>

      <ol className="mt-2 flex items-start" aria-label="Deploy stages">
        {DEPLOY_STAGES.map((stage, index) => {
          const last = index === DEPLOY_STAGES.length - 1;
          const failed = rolledBack && last;
          return (
            <li key={stage} className={cx("flex items-start", last ? "shrink-0" : "flex-1")}>
              <span className="flex shrink-0 flex-col items-center gap-0.5">
                <span
                  className={cx(
                    "flex size-4 items-center justify-center rounded-full border text-text-white",
                    failed ? "border-status-orange-text bg-status-orange-text" : "border-accent-600 bg-accent-600",
                  )}
                >
                  {failed ? (
                    <RiAlertLine className="size-2.5" aria-hidden />
                  ) : (
                    <RiCheckLine className="size-2.5" aria-hidden />
                  )}
                </span>
                <span className={cx("text-caption-2-regular", failed ? "text-status-orange-text" : "text-text-secondary")}>
                  {stage}
                </span>
              </span>
              {!last && <span aria-hidden className="mx-1 mt-2 h-px flex-1 bg-accent-500/50" />}
            </li>
          );
        })}
      </ol>

      {confirming ? (
        <div className="mt-2 animate-label-in border-t border-separator-border pt-1.5 motion-reduce:animate-none">
          <p className="text-caption-1-medium text-text-primary">
            Roll back to <span dir="ltr" className={cx(mono, "text-text-secondary")}>#4819</span>?
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setRolledBack(true);
                setConfirming(false);
              }}
              className={miniDanger}
            >
              <RiArrowGoBackLine className="size-3 rtl:-scale-x-100" aria-hidden />
              Roll back
            </button>
            <button ref={keepRef} type="button" onClick={() => setConfirming(false)} className={miniSecondary}>
              Keep #4821
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-2 flex items-center justify-between gap-2 border-t border-separator-border pt-1.5">
          <span className="min-w-0 truncate text-caption-2-regular text-text-tertiary">
            {rolledBack ? (
              "Rolled back in 9s"
            ) : (
              <>
                Elapsed <span className="text-text-secondary tabular-nums">1m 42s</span> · main
              </>
            )}
          </span>
          {rolledBack ? (
            <button type="button" onClick={() => setRolledBack(false)} className={miniSecondary}>
              <RiRefreshLine className="size-3" aria-hidden />
              Redeploy
            </button>
          ) : (
            <button type="button" onClick={() => setConfirming(true)} className={miniSecondary}>
              <RiArrowGoBackLine className="size-3 rtl:-scale-x-100" aria-hidden />
              Roll back
            </button>
          )}
        </div>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  7. Log stream                                                              */
/* -------------------------------------------------------------------------- */

type LogLevel = "INFO" | "WARN" | "ERROR";

type LogLine = {
  time: string;
  level: LogLevel;
  message: string;
  meta: string;
};

const LOG_POOL: LogLine[] = [
  { time: "12:42:08.914", level: "INFO", message: "request completed", meta: "GET /v1/keys 200 42ms" },
  { time: "12:42:09.107", level: "WARN", message: "rate limit at 68%", meta: "bucket=keys:ws_482" },
  { time: "12:42:09.882", level: "INFO", message: "webhook delivered", meta: "gh.push evt_9f3c 184ms" },
  { time: "12:42:10.331", level: "ERROR", message: "upstream timeout", meta: "payments 3000ms attempt=2" },
  { time: "12:42:10.904", level: "INFO", message: "retry scheduled", meta: "payments in 800ms" },
  { time: "12:42:11.220", level: "INFO", message: "cache warm", meta: "sessions 128 keys" },
  { time: "12:42:11.784", level: "INFO", message: "session refreshed", meta: "sess_8f2a1c 42ms" },
  { time: "12:42:12.016", level: "WARN", message: "queue depth rising", meta: "webhooks 214 pending" },
];

type LiveLogLine = LogLine & { key: number };

const LOG_LEVEL_TONES: Record<LogLevel, string> = {
  INFO: "bg-status-blue-background text-status-blue-text",
  WARN: "bg-status-yellow-background text-status-yellow-text",
  ERROR: "bg-status-rose-background text-status-rose-text",
};

const INITIAL_LOG_LINES: LiveLogLine[] = LOG_POOL.slice(0, 5).map((line, index) => ({ ...line, key: index }));

export function LogStream() {
  const [following, setFollowing] = useState(true);
  const [lines, setLines] = useState<LiveLogLine[]>(INITIAL_LOG_LINES);
  const nextKey = useRef(5);

  useEffect(() => {
    if (!following) return;
    const timer = window.setInterval(() => {
      const line = LOG_POOL[nextKey.current % LOG_POOL.length];
      nextKey.current += 1;
      setLines((current) => [...current.slice(-4), { ...line, key: nextKey.current }]);
    }, 2200);
    return () => window.clearInterval(timer);
  }, [following]);

  return (
    <section aria-label="Log stream" className={cx(cardSurface, "max-w-[560px] p-2.5")}>
      <div className="flex items-center gap-2">
        <DemoIcon icon={RiTerminalBoxLine} />
        <div className="min-w-0 flex-1">
          <h3 className="flex items-center gap-1.5 text-body-2-semibold text-text-primary">
            api-gateway
            <span
              aria-hidden
              className={cx(
                "size-1.5 rounded-full",
                following ? "animate-pulse bg-status-lime-text motion-reduce:animate-none" : "bg-foreground-icon-tertiary",
              )}
            />
          </h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">production · us-east-1 · 8,412 events</p>
        </div>
        <button
          type="button"
          aria-pressed={following}
          aria-label={following ? "Pause live logs" : "Follow live logs"}
          onClick={() => setFollowing((value) => !value)}
          className={miniSecondary}
        >
          {following ? <RiPauseLine className="size-3" aria-hidden /> : <RiPlayLine className="size-3" aria-hidden />}
          {following ? "Pause" : "Follow"}
        </button>
      </div>

      <div dir="ltr" className={cx(codeSurface, "mt-2 overflow-hidden px-1.5 py-1")}>
        {lines.map((line) => (
          <div
            key={line.key}
            className="flex h-[21px] animate-label-in items-center gap-1.5 motion-reduce:animate-none"
          >
            <span dir="ltr" className={cx(mono, "hidden shrink-0 text-caption-2-regular text-text-tertiary sm:inline")}>
              {line.time}
            </span>
            <span
              className={cx(
                "inline-flex h-4 w-9 shrink-0 items-center justify-center rounded-sm font-mono text-caption-2-semibold uppercase",
                LOG_LEVEL_TONES[line.level],
              )}
            >
              {line.level}
            </span>
            <span className={cx(mono, "shrink-0 text-caption-2-regular text-text-secondary")}>{line.message}</span>
            <span dir="ltr" className={cx(mono, "min-w-0 truncate text-caption-2-regular text-text-tertiary")}>
              {line.meta}
            </span>
          </div>
        ))}
      </div>

      <span role="status" aria-live="polite" className="sr-only">
        {following ? "Following live logs" : "Log stream paused"}
      </span>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  8. Error trace                                                             */
/* -------------------------------------------------------------------------- */

const ERROR_MESSAGE = "Cannot read properties of undefined (reading 'id')";

const ERROR_FRAMES = [
  { fn: "getSession", file: "lib/auth/session.ts", line: "42:18", relevant: true },
  { fn: "requireUser", file: "lib/auth/guard.ts", line: "18:9", relevant: false },
  { fn: "handler", file: "app/api/keys/route.ts", line: "24:20", relevant: false },
];

const LIBRARY_FRAMES = [
  { fn: "processTicksAndRejections", file: "node:internal/process/task_queues", line: "95:5" },
  { fn: "NextNodeServer.handleRequest", file: "next/dist/server/next-server.js", line: "318:9" },
  { fn: "runMicrotasks", file: "node:internal/process/task_queues", line: "13:3" },
  { fn: "async Promise.all", file: "node:internal/per_context", line: "0:0" },
];

const ERROR_TRACE_TEXT = [
  `TypeError: ${ERROR_MESSAGE}`,
  ...ERROR_FRAMES.map((frame) => `    at ${frame.fn} (${frame.file}:${frame.line})`),
  ...LIBRARY_FRAMES.map((frame) => `    at ${frame.fn} (${frame.file}:${frame.line})`),
].join("\n");

export function ErrorTrace() {
  const panelId = useId();
  const [expanded, setExpanded] = useState(false);

  return (
    <section aria-label="Error trace" className={cx(cardSurface, "max-w-[560px] p-2.5")}>
      <div className="flex items-start gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-status-rose-background text-status-rose-text">
          <RiErrorWarningLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="min-w-0 flex-1 truncate text-body-2-semibold text-text-primary">
              TypeError <span dir="ltr" className="font-mono text-caption-1-regular text-text-tertiary">keys/route.ts</span>
            </h3>
            <span className="shrink-0 rounded-full bg-status-rose-background px-1.5 py-0.5 text-caption-2-medium text-status-rose-text">
              500
            </span>
            <CopyButton value={ERROR_TRACE_TEXT} label="Copy stack trace" />
          </div>
          <p className="mt-0.5 truncate text-caption-1-regular text-text-secondary">{ERROR_MESSAGE}</p>
        </div>
      </div>

      <div dir="ltr" className={cx(codeSurface, "mt-2 overflow-hidden")}>
        {ERROR_FRAMES.map((frame) => (
          <div
            key={frame.fn}
            className={cx(
              "flex items-center gap-1.5 border-s-2 px-1.5 py-1 text-caption-2-regular",
              frame.relevant
                ? "border-accent-500 bg-accent-500/10"
                : "border-transparent bg-background-primary-default",
            )}
          >
            <span className="shrink-0 text-text-tertiary">at</span>
            <span className={cx(mono, "min-w-0 flex-1 truncate", frame.relevant ? "text-text-primary" : "text-text-secondary")}>
              {frame.fn}
            </span>
            {frame.relevant && (
              <span className="shrink-0 rounded-sm bg-status-blue-background px-1 text-caption-2-semibold text-status-blue-text">
                yours
              </span>
            )}
            <span dir="ltr" className={cx(mono, "min-w-0 flex-1 truncate text-end text-caption-2-regular text-text-tertiary")}>
              {frame.file}:{frame.line}
            </span>
          </div>
        ))}

        <div id={panelId} inert={!expanded} className={cx(revealGrid, expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
          <div className="min-h-0 overflow-hidden">
            {LIBRARY_FRAMES.map((frame) => (
              <div
                key={frame.fn}
                className="flex items-center gap-1.5 border-s-2 border-transparent px-1.5 py-1 text-caption-2-regular"
              >
                <span className="shrink-0 text-text-tertiary">at</span>
                <span className={cx(mono, "min-w-0 flex-1 truncate text-text-tertiary")}>{frame.fn}</span>
                <span dir="ltr" className={cx(mono, "min-w-0 flex-1 truncate text-end text-caption-2-regular text-text-tertiary")}>
                  {frame.file}:{frame.line}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setExpanded((value) => !value)}
          className={cx(
            "flex h-6 w-full items-center justify-center gap-1 border-t border-separator-border",
            "text-caption-2-medium text-text-tertiary transition-[background-color,color] duration-150 ease-out",
            "hover:bg-background-secondary-default hover:text-text-secondary motion-reduce:transition-none",
            focusRing,
            "focus-visible:ring-inset",
          )}
        >
          {expanded ? "Hide library frames" : `Show ${LIBRARY_FRAMES.length} library frames`}
          <RiArrowDownSLine
            className={cx("size-3 transition-transform duration-200 ease-out motion-reduce:transition-none", expanded && "rotate-180")}
            aria-hidden
          />
        </button>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  9. SDK snippet                                                             */
/* -------------------------------------------------------------------------- */

const SDK_LANGS = [
  {
    id: "node",
    label: "Node",
    install: "npm install @northline/sdk@4.2.0",
    code: 'import { Northline } from "@northline/sdk";',
    meta: "Node 18+ · TypeScript types",
  },
  {
    id: "python",
    label: "Python",
    install: "pip install northline-sdk==4.2.0",
    code: "from northline import Northline",
    meta: "Python 3.10+ · typed client",
  },
  {
    id: "go",
    label: "Go",
    install: "go get northline.dev/sdk-go@v4.2.0",
    code: 'import "northline.dev/sdk-go"',
    meta: "Go 1.22+ · context aware",
  },
] as const;

export function SdkSnippet() {
  const [active, setActive] = useState(0);
  const current = SDK_LANGS[active];

  return (
    <section aria-label="SDK snippet" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-2">
        <DemoIcon icon={RiCodeSSlashLine} />
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">SDK</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">Server-side client</p>
        </div>
        <span dir="ltr" className="shrink-0 rounded-full bg-badge-new-background px-1.5 py-0.5 text-caption-2-semibold text-badge-new-text">
          v4.2.0
        </span>
      </div>

      <div className="mt-1.5 flex items-center gap-1">
        <div role="group" aria-label="SDK language" className="flex flex-1 rounded-lg bg-background-secondary-default p-0.5">
          {SDK_LANGS.map((lang, index) => (
            <button
              key={lang.id}
              type="button"
              aria-pressed={active === index}
              onClick={() => setActive(index)}
              className={cx(
                "h-6 flex-1 rounded-md text-caption-2-semibold transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                active === index
                  ? "bg-segmented-control-selected-background text-text-primary shadow-xs"
                  : "text-text-tertiary hover:text-text-secondary",
              )}
            >
              {lang.label}
            </button>
          ))}
        </div>
        <CopyButton key={current.id} value={`${current.install}\n${current.code}`} label={`Copy ${current.label} snippet`} />
      </div>

      <div key={current.id} dir="ltr" className={cx(codeSurface, "mt-1.5 animate-label-in p-2 motion-reduce:animate-none")}>
        <div className="flex items-center gap-1.5">
          <span aria-hidden className={cx(mono, "shrink-0 select-none text-caption-2-regular text-text-tertiary")}>
            $
          </span>
          <code className={cx(mono, "min-w-0 flex-1 truncate text-caption-1-regular text-text-primary")}>
            {current.install}
          </code>
        </div>
        <div className="mt-1 flex items-start gap-1.5">
          <span aria-hidden className="mt-1 h-px w-2 shrink-0 bg-separator-border" />
          <code dir="ltr" className={cx(mono, "min-w-0 flex-1 truncate text-caption-1-regular text-text-secondary")}>
            {current.code}
          </code>
        </div>
      </div>

      <p className="mt-1.5 text-caption-2-regular text-text-tertiary">{current.meta}</p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  10. Status board                                                           */
/* -------------------------------------------------------------------------- */

type ServiceState = "ok" | "degraded";

const SERVICES: {
  id: string;
  name: string;
  host: string;
  uptime: string;
  state: ServiceState;
  bars: string;
  detail: string;
}[] = [
  {
    id: "payments",
    name: "Payments API",
    host: "api.northline.dev",
    uptime: "99.99%",
    state: "ok",
    bars: "11111111111111",
    detail: "No incidents in the last 30 days.",
  },
  {
    id: "webhooks",
    name: "Webhooks",
    host: "hooks.northline.dev",
    uptime: "99.82%",
    state: "degraded",
    bars: "11111112111111",
    detail: "Elevated retries since 12:18 UTC. Deliveries are delayed by about 40 seconds.",
  },
  {
    id: "dashboard",
    name: "Dashboard",
    host: "app.northline.dev",
    uptime: "100%",
    state: "ok",
    bars: "11111111111111",
    detail: "No incidents in the last 30 days.",
  },
];

const UPTIME_SEGMENT_TONES: Record<string, string> = {
  "1": "bg-chart-2",
  "2": "bg-status-orange-text",
  "3": "bg-status-rose-text",
};

type CheckState = "idle" | "checking" | "just";

export function StatusBoard() {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(null);
  const [check, setCheck] = useState<CheckState>("idle");
  const healthy = SERVICES.filter((service) => service.state === "ok").length;

  useEffect(() => {
    if (check !== "checking") return;
    const timer = window.setTimeout(() => setCheck("just"), 700);
    return () => window.clearTimeout(timer);
  }, [check]);

  return (
    <section aria-label="Status board" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-2">
        <DemoIcon icon={RiGlobalLine} />
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">Status board</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">Northline Cloud · 30 days</p>
        </div>
        <StatusPill tone={healthy === SERVICES.length ? "ok" : "warn"}>
          {healthy} of {SERVICES.length} healthy
        </StatusPill>
      </div>

      <ul className="mt-1.5 divide-y divide-separator-border">
        {SERVICES.map((service) => {
          const open = openId === service.id;
          const detailId = `${baseId}-${service.id}`;
          return (
            <li key={service.id}>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={detailId}
                onClick={() => setOpenId(open ? null : service.id)}
                className={cx(
                  "flex w-full flex-col gap-1 py-0.5 text-start transition-colors duration-150 ease-out motion-reduce:transition-none",
                  "hover:bg-background-secondary-default",
                  focusRing,
                )}
              >
                <span className="flex w-full items-center gap-1.5">
                  <span aria-hidden className={cx("size-1.5 shrink-0 rounded-full", TONE_DOT[service.state === "ok" ? "ok" : "warn"])} />
                  <span className="min-w-0 flex-1 truncate text-caption-1-semibold text-text-primary">{service.name}</span>
                  <span
                    className={cx(
                      "shrink-0 text-caption-2-medium",
                      service.state === "ok" ? "text-status-lime-text" : "text-status-orange-text",
                    )}
                  >
                    {service.state === "ok" ? "Operational" : "Degraded"}
                  </span>
                  <RiArrowDownSLine
                    className={cx(
                      "size-3.5 shrink-0 text-foreground-icon-tertiary transition-transform duration-200 ease-out motion-reduce:transition-none",
                      open && "rotate-180",
                    )}
                    aria-hidden
                  />
                </span>
                <span className="flex w-full items-center gap-1.5">
                  <span aria-hidden dir="ltr" className="flex h-2 flex-1 items-stretch gap-px">
                    {service.bars.split("").map((bar, index) => (
                      <span
                        key={index}
                        className={cx("min-w-0 flex-1 rounded-[1px]", UPTIME_SEGMENT_TONES[bar] ?? UPTIME_SEGMENT_TONES["1"])}
                      />
                    ))}
                  </span>
                  <span className="w-10 shrink-0 text-end text-caption-2-regular text-text-tertiary tabular-nums">
                    {service.uptime}
                  </span>
                </span>
              </button>
              <div
                id={detailId}
                inert={!open}
                className={cx(revealGrid, open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="mb-1.5 ms-3 rounded-md bg-background-secondary-default px-2 py-1.5">
                    {service.state === "degraded" && (
                      <span className="mb-1 inline-flex rounded-full bg-status-orange-background px-1.5 py-0.5 text-caption-2-medium text-status-orange-text">
                        Investigating
                      </span>
                    )}
                    <p className="text-caption-2-regular text-text-secondary">{service.detail}</p>
                    <p dir="ltr" className={cx(mono, "mt-0.5 truncate text-start text-caption-2-regular text-text-tertiary")}>
                      {service.host}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-1 flex items-center justify-between gap-2 border-t border-separator-border pt-1.5">
        <p aria-live="polite" className="min-w-0 truncate text-caption-2-regular text-text-tertiary">
          {check === "checking"
            ? "Checking services…"
            : check === "just"
              ? "Checked just now · status.northline.dev"
              : "Checked 12s ago · status.northline.dev"}
        </p>
        <button
          type="button"
          aria-label="Refresh service health"
          disabled={check === "checking"}
          onClick={() => setCheck("checking")}
          className={iconButton}
        >
          <RiRefreshLine
            className={cx("size-3.5", check === "checking" && "animate-spin motion-reduce:animate-none")}
            aria-hidden
          />
        </button>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  11. Latency bars                                                           */
/* -------------------------------------------------------------------------- */

type LatencyWindow = "1h" | "24h";

type LatencyRegion = { region: string; p50: number; p95: number; p99: number };

const LATENCY_WINDOWS: Record<LatencyWindow, { max: number; regions: LatencyRegion[] }> = {
  "1h": {
    max: 400,
    regions: [
      { region: "us-east-1", p50: 42, p95: 118, p99: 240 },
      { region: "eu-west-1", p50: 51, p95: 132, p99: 268 },
      { region: "ap-south-1", p50: 78, p95: 184, p99: 390 },
    ],
  },
  "24h": {
    max: 450,
    regions: [
      { region: "us-east-1", p50: 48, p95: 126, p99: 256 },
      { region: "eu-west-1", p50: 58, p95: 140, p99: 288 },
      { region: "ap-south-1", p50: 84, p95: 196, p99: 412 },
    ],
  },
};

const LATENCY_SERIES = [
  { key: "p50", label: "p50", tone: "bg-chart-2" },
  { key: "p95", label: "p95", tone: "bg-chart-8" },
  { key: "p99", label: "p99", tone: "bg-chart-3" },
] as const;

export function LatencyBars() {
  const [range, setRange] = useState<LatencyWindow>("1h");
  const data = LATENCY_WINDOWS[range];

  return (
    <section aria-label="Latency bars" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-body-2-semibold text-text-primary">Latency by region</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">Edge · p99 budget 300 ms</p>
        </div>
        <div role="group" aria-label="Latency time window" className="flex shrink-0 rounded-lg bg-background-secondary-default p-0.5">
          {(["1h", "24h"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={range === option}
              onClick={() => setRange(option)}
              className={cx(
                "h-6 rounded-md px-1.5 text-caption-2-semibold transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                range === option
                  ? "bg-segmented-control-selected-background text-text-primary shadow-xs"
                  : "text-text-tertiary hover:text-text-secondary",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-1">
        {data.regions.map((region) => (
          <div key={region.region} dir="ltr" className="mt-1 first:mt-0">
            <div className="flex items-baseline justify-between gap-2">
              <span dir="ltr" className="text-caption-2-semibold text-text-secondary">{region.region}</span>
              <span className="flex items-center gap-1.5 text-caption-2-regular text-text-tertiary tabular-nums">
                {LATENCY_SERIES.map((series) => (
                  <span key={series.key} className="flex items-center gap-0.5">
                    <span aria-hidden className={cx("size-1.5 rounded-full", series.tone)} />
                    {series.label}
                    <span className="text-text-secondary">{region[series.key]}</span>
                  </span>
                ))}
                {region.p99 > 300 && <RiAlertLine className="size-3 text-status-orange-text" aria-hidden />}
              </span>
            </div>
            <div
              role="img"
              aria-label={`${region.region}: p50 ${region.p50} milliseconds, p95 ${region.p95}, p99 ${region.p99}.`}
              className="mt-0.5 flex flex-col gap-0.5"
            >
              {LATENCY_SERIES.map((series) => (
                <span key={series.key} aria-hidden className="h-1 overflow-hidden rounded-full bg-background-tertiary-default">
                  <span
                    className={cx(
                      "block h-full rounded-full transition-[width] duration-200 ease-out motion-reduce:transition-none",
                      series.tone,
                    )}
                    style={{ width: `${Math.min(100, (region[series.key] / data.max) * 100)}%` }}
                  />
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  12. Test console                                                           */
/* -------------------------------------------------------------------------- */

const HTTP_METHODS = ["GET", "POST", "PUT"] as const;

type SendState = "idle" | "sending" | "sent";

export function TestConsole() {
  const [method, setMethod] = useState<Method>("POST");
  const [path, setPath] = useState("/v1/sessions");
  const [body, setBody] = useState('{"email":"ada@northline.dev"}');
  const [sendState, setSendState] = useState<SendState>("idle");

  useEffect(() => {
    if (sendState !== "sending") return;
    const timer = window.setTimeout(() => setSendState("sent"), 700);
    return () => window.clearTimeout(timer);
  }, [sendState]);

  const reset = () => setSendState("idle");

  return (
    <section aria-label="Test console" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-2">
        <DemoIcon icon={RiSendPlaneLine} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Test console</h3>
        </div>
        <span className="shrink-0 rounded-full bg-background-secondary-default px-1.5 py-0.5 text-caption-2-medium text-text-secondary">
          sandbox
        </span>
      </div>

      <div dir="ltr" className={cx(codeSurface, "mt-1.5 p-1")}>
        <div className="flex items-center gap-1">
          <div className="relative shrink-0">
            <select
              aria-label="HTTP method"
              value={method}
              disabled={sendState === "sending"}
              onChange={(event) => {
                setMethod(event.target.value as Method);
                reset();
              }}
              className={cx(
                "h-6 appearance-none rounded-md bg-background-secondary-default ps-1.5 pe-5",
                mono,
                "text-caption-2-semibold text-text-primary outline-none disabled:opacity-50",
                focusRing,
              )}
            >
              {HTTP_METHODS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <RiArrowDownSLine
              className={cx(
                "pointer-events-none absolute end-1 top-1/2 size-3 -translate-y-1/2 text-foreground-icon-tertiary",
                sendState === "sending" && "opacity-50",
              )}
              aria-hidden
            />
          </div>
          <input
            aria-label="Request path"
            value={path}
            dir="ltr"
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            disabled={sendState === "sending"}
            onChange={(event) => {
              setPath(event.target.value);
              reset();
            }}
            className={cx(
              "h-6 min-w-0 flex-1 rounded-md bg-background-secondary-default px-1.5",
              mono,
              "text-caption-2-regular text-text-primary outline-none placeholder:text-text-placeholder",
              focusRing,
            )}
          />
        </div>
        <div className="mt-1 flex items-center gap-1">
          <span aria-hidden className="ps-1 text-caption-2-regular text-text-tertiary">
            body
          </span>
          <input
            aria-label="JSON request body"
            value={method === "GET" ? "" : body}
            dir="ltr"
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            disabled={method === "GET" || sendState === "sending"}
            placeholder={method === "GET" ? "No body for GET" : undefined}
            onChange={(event) => {
              setBody(event.target.value);
              reset();
            }}
            className={cx(
              "h-6 min-w-0 flex-1 rounded-md bg-background-secondary-default px-1.5",
              mono,
              "text-caption-2-regular text-text-primary outline-none placeholder:text-text-placeholder disabled:text-input-disabled-text",
              focusRing,
            )}
          />
        </div>
      </div>

      <div className="mt-1 flex items-center justify-between gap-2">
        <p
          className={cx(
            "min-w-0 truncate text-caption-2-regular transition-colors duration-200 ease-out motion-reduce:transition-none",
            sendState === "sent" ? "text-status-lime-text" : "text-text-tertiary",
          )}
          aria-live="polite"
        >
          <span key={sendState} className="inline-block animate-label-in motion-reduce:animate-none">
            {sendState === "sending"
              ? "Sending request…"
              : sendState === "sent"
                ? `${method === "POST" ? "201 Created" : "200 OK"} · 42 ms`
                : "Ready to send"}
          </span>
        </p>
        <button
          type="button"
          onClick={() => setSendState("sending")}
          disabled={sendState === "sending"}
          className={cx(primaryButton, "h-7")}
        >
          {sendState === "sending" ? (
            <>
              <RiLoader4Line className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
              Sending
            </>
          ) : (
            <>
              <RiSendPlaneLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
              Send
            </>
          )}
        </button>
      </div>

      <div className={cx(codeSurface, "mt-1 p-1")}>
        <span className="sr-only">Mock JSON response</span>
        <pre
          dir="ltr"
          className={cx(
            mono,
            "overflow-x-auto text-caption-2-regular transition-colors duration-200 ease-out motion-reduce:transition-none",
            sendState === "sent" ? "text-text-secondary" : "text-text-tertiary",
          )}
        >
          {`{"id":"sess_8f2a1c","status":"created",
 "expires_at":"2026-11-05T13:42Z"}`}
        </pre>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Specimens                                                                  */
/* -------------------------------------------------------------------------- */

export const DEVTOOLS_SECTION: ExtendedSection = {
  id: "devtools",
  title: "Devtools",
  blurb: "Keys, hooks, deploys and logs for the people who ship.",
  file: "devtools.tsx",
  entries: [
    { name: "API Key Ring", description: "Reveal, copy and revoke scoped keys with a last-used trail.", Demo: ApiKeyRing },
    { name: "Webhook Endpoint", description: "A signed endpoint with event chips and a live test delivery.", Demo: WebhookEndpoint },
    { name: "Request Log", description: "Filter the last requests and scan method, path, status and latency.", Demo: RequestLog },
    { name: "Rate Limit Dial", description: "Quota use, burst headroom and the reset window in one dial.", Demo: RateLimitDial },
    { name: "Environment Switch", description: "Move between environments with a typed guard for production.", Demo: EnvironmentSwitch },
    { name: "Deploy Status", description: "Stages, commit and elapsed time, with a guarded rollback.", Demo: DeployStatus },
    { name: "Log Stream", description: "Live log lines that pause, resume and reveal on arrival.", Demo: LogStream, wide: true },
    { name: "Error Trace", description: "A stack trace with collapsed library frames and the culprit in focus.", Demo: ErrorTrace, wide: true },
    { name: "SDK Snippet", description: "Install commands per language with copy feedback and a version chip.", Demo: SdkSnippet },
    { name: "Status Board", description: "Service health, uptime bars and the incident in progress.", Demo: StatusBoard },
    { name: "Latency Bars", description: "p50, p95 and p99 across regions, compared over two windows.", Demo: LatencyBars },
    { name: "Test Console", description: "Build a request, edit the JSON body and watch the mock response land.", Demo: TestConsole },
  ],
};
