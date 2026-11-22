"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import {
  RiAlertLine,
  RiArrowDownSLine,
  RiArrowRightLine,
  RiCheckLine,
  RiCloseLine,
  RiComputerLine,
  RiDeleteBinLine,
  RiDownloadLine,
  RiEyeLine,
  RiEyeOffLine,
  RiFileCopyLine,
  RiFileShield2Line,
  RiHistoryLine,
  RiKey2Line,
  RiLoader4Line,
  RiLock2Line,
  RiLockPasswordLine,
  RiMacbookLine,
  RiMessage2Line,
  RiRefreshLine,
  RiShieldCheckLine,
  RiShieldKeyholeLine,
  RiShieldUserLine,
  RiSmartphoneLine,
  RiSubtractLine,
  RiTabletLine,
  RiTimeLine,
  RiUsbLine,
} from "@remixicon/react";
import { Switch } from "@/components/base/switch/switch";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* -------------------------------------------------------------------------- */
/*  Shared anatomy                                                             */
/* -------------------------------------------------------------------------- */

type IconComponent = ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";
const cardSurface = "w-full rounded-xl border border-border-button-default bg-background-primary-default shadow-xs";
const buttonBase = cx(
  "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg text-caption-1-semibold",
  "transition-[transform,background-color,color,box-shadow,opacity] duration-150 ease-out",
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:scale-100",
);
const primaryButton = cx(buttonBase, "h-8 bg-button-primary px-2.5 text-text-white shadow-xs", focusRing);
const secondaryButton = cx(buttonBase, "h-8 border border-border-button-default bg-background-primary-default px-2.5 text-text-primary shadow-xs hover:bg-background-primary-hover", focusRing);
const dangerButton = cx(buttonBase, "h-8 bg-button-danger px-2.5 text-text-white shadow-xs", focusRing);
const quietButton = cx(buttonBase, "h-7 px-1.5 text-text-secondary hover:bg-background-secondary-default hover:text-text-primary", focusRing);
const iconButton = cx(
  "flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-icon-tertiary",
  "transition-[background-color,color] duration-150 ease-out hover:bg-background-tertiary-default hover:text-text-primary",
  "motion-reduce:transition-none",
  focusRing,
);
const revealGrid = "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none";
const stepIn = "animate-label-in motion-reduce:animate-none";

type Tone = "ok" | "warn" | "danger" | "info" | "neutral";

const TONE_PILL: Record<Tone, string> = {
  ok: "bg-status-lime-background text-status-lime-text",
  warn: "bg-status-yellow-background text-status-yellow-text",
  danger: "bg-status-rose-background text-status-rose-text",
  info: "bg-status-blue-background text-status-blue-text",
  neutral: "bg-background-tertiary-default text-text-secondary",
};

const TONE_DOT: Record<Tone, string> = {
  ok: "bg-status-lime-text",
  warn: "bg-status-yellow-text",
  danger: "bg-status-rose-text",
  info: "bg-status-blue-text",
  neutral: "bg-foreground-icon-tertiary",
};

function StatusPill({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      className={cx(
        "inline-flex h-5 shrink-0 items-center gap-1 rounded-full px-1.5 text-caption-2-medium",
        "transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
        TONE_PILL[tone],
      )}
    >
      <span aria-hidden className={cx("size-1.5 rounded-full", TONE_DOT[tone])} />
      {children}
    </span>
  );
}

function Initials({ text }: { text: string }) {
  return <span aria-hidden className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-100 text-caption-2-semibold text-accent-700">{text}</span>;
}

function DemoHead({ icon: Icon, title, detail, children }: { icon: IconComponent; title: string; detail: string; children?: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
        <Icon className="size-3.5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-body-2-semibold text-text-primary">{title}</h3>
        <p className="truncate text-caption-2-regular text-text-tertiary">{detail}</p>
      </div>
      {children}
    </div>
  );
}

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

/* -------------------------------------------------------------------------- */
/*  1. Two-factor setup                                                        */
/* -------------------------------------------------------------------------- */

const MFA_METHODS = [
  { id: "app", label: "Authenticator app", detail: "1Password", icon: RiSmartphoneLine },
  { id: "key", label: "Security key", detail: "YubiKey 5C", icon: RiUsbLine },
  { id: "sms", label: "Text message", detail: "+1 415 ••• 0132", icon: RiMessage2Line },
] as const;

type MfaMethod = (typeof MFA_METHODS)[number]["id"];

const DEMO_CODE = "481263";

export function TwoFactorSetup() {
  const codeId = useId();
  const [step, setStep] = useState<"method" | "code" | "done">("method");
  const [method, setMethod] = useState<MfaMethod>("app");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const current = MFA_METHODS.find((item) => item.id === method) ?? MFA_METHODS[0];

  const verify = () => {
    if (code === DEMO_CODE) {
      setError("");
      setStep("done");
    } else {
      setError("That code does not match. Use 481263 for this demo.");
    }
  };

  const reset = () => {
    setStep("method");
    setCode("");
    setError("");
  };

  return (
    <section aria-label="Two-factor authentication setup" className={cx(cardSurface, "max-w-[300px] p-2.5")}>
      <DemoHead
        icon={RiShieldKeyholeLine}
        title="Two-factor authentication"
        detail={step === "done" ? "Finished" : step === "code" ? "Step 2 of 3 · verify" : "Step 1 of 3 · choose a method"}
      >
        <StatusPill tone={step === "done" ? "ok" : "neutral"}>{step === "done" ? "On" : "Off"}</StatusPill>
      </DemoHead>

      <div key={step} className={cx("mt-2", stepIn)}>
        {step === "method" ? (
          <>
            <div role="group" aria-label="Second factor" className="flex flex-col gap-0.5">
              {MFA_METHODS.map((item) => {
                const Icon = item.icon;
                const selected = method === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setMethod(item.id)}
                    className={cx(
                      "flex h-7 items-center gap-2 rounded-lg border px-2 text-start",
                      "transition-[background-color,border-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                      focusRing,
                      selected ? "border-accent-500 bg-background-secondary-default shadow-xs" : "border-border-button-default bg-background-primary-default hover:bg-background-primary-hover",
                    )}
                  >
                    <Icon className={cx("size-3.5 shrink-0", selected ? "text-accent-600" : "text-foreground-icon-secondary")} aria-hidden />
                    <span className="text-caption-1-semibold text-text-primary">{item.label}</span>
                    <span className="ms-auto truncate text-caption-2-regular text-text-tertiary"><bdi dir="ltr">{item.detail}</bdi></span>
                    <span aria-hidden className={cx("flex size-4 shrink-0 items-center justify-center rounded-full border", "transition-[background-color,border-color,color] duration-150 ease-out motion-reduce:transition-none", selected ? "border-accent-600 bg-accent-600 text-text-white" : "border-border-checkbox-default bg-background-primary-default")}>
                      <RiCheckLine className={cx("size-2.5 transition-[transform,opacity] duration-150 ease-out motion-reduce:transition-none", selected ? "scale-100 opacity-100" : "scale-50 opacity-0")} aria-hidden />
                    </span>
                  </button>
                );
              })}
            </div>
            <button type="button" onClick={() => setStep("code")} className={cx(primaryButton, "mt-1.5 w-full")}>
              Continue
              <RiArrowRightLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
            </button>
          </>
        ) : step === "code" ? (
          <>
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-caption-2-regular text-text-secondary">Code from {current.label}</span>
              <button type="button" onClick={reset} className={cx(quietButton, "h-6 px-1")}>
                Change
              </button>
            </div>
            <label htmlFor={codeId} className="sr-only">Six-digit verification code</label>
            <input
              id={codeId} value={code} inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="000000" dir="ltr"
              aria-invalid={Boolean(error)} aria-describedby={`${codeId}-hint`}
              onChange={(event) => { setCode(event.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
              className={cx("mt-1 h-9 w-full rounded-lg border bg-background-primary-default px-2 text-center text-body-medium tabular-nums tracking-[0.35em] text-text-primary shadow-xs", "outline-none transition-[border-color,box-shadow] duration-150 ease-out motion-reduce:transition-none", "placeholder:tracking-[0.35em] placeholder:text-text-placeholder focus-visible:ring-2 focus-visible:ring-border-focus-ring", error ? "border-border-error-default" : "border-border-button-default")}
            />
            <p id={`${codeId}-hint`} aria-live="polite" className={cx("mt-1 h-4 truncate text-caption-2-regular", error ? "text-text-error-primary" : "text-text-tertiary")}>
              {error || "Demo code 481263 · expires in 30 seconds"}
            </p>
            <div className="mt-1 flex gap-1.5">
              <button type="button" onClick={reset} className={cx(secondaryButton, "flex-1")}>Back</button>
              <button type="button" onClick={verify} disabled={code.length !== 6} className={cx(primaryButton, "flex-1")}>Verify code</button>
            </div>
          </>
        ) : (
          <div role="status" className="flex flex-col items-center py-0.5 text-center">
            <span className="flex size-9 items-center justify-center rounded-full bg-status-lime-background text-status-lime-text">
              <RiShieldCheckLine className="size-5" aria-hidden />
            </span>
            <p className="mt-1.5 text-body-2-semibold text-text-primary">Two-factor is on</p>
            <p className="text-caption-2-regular text-text-tertiary">Authenticator app · added Nov 5, 2026</p>
            <button type="button" onClick={reset} className={cx(quietButton, "mt-1")}>
              Add a backup method
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  2. Session list                                                            */
/* -------------------------------------------------------------------------- */

const SESSIONS = [
  {
    id: "macbook",
    device: "MacBook Pro",
    browser: "Chrome 141",
    location: "Lisbon, PT",
    last: "Active now",
    current: true,
    icon: RiMacbookLine,
  },
  {
    id: "iphone",
    device: "iPhone 16",
    browser: "Safari · iOS 19",
    location: "Lisbon, PT",
    last: "12 min ago",
    current: false,
    icon: RiSmartphoneLine,
  },
  {
    id: "ipad",
    device: "iPad Air",
    browser: "Safari · iPadOS 19",
    location: "Porto, PT",
    last: "Yesterday",
    current: false,
    icon: RiTabletLine,
  },
] as const;

export function SessionList() {
  const [revoked, setRevoked] = useState<ReadonlySet<string>>(() => new Set());
  const others = SESSIONS.filter((session) => !session.current);
  const active = SESSIONS.filter((session) => !revoked.has(session.id)).length;
  const allOthersRevoked = others.every((session) => revoked.has(session.id));

  const revoke = (id: string) => {
    setRevoked((current) => new Set(current).add(id));
  };

  const revokeAll = () => {
    setRevoked((current) => {
      const next = new Set(current);
      for (const session of others) next.add(session.id);
      return next;
    });
  };

  return (
    <section aria-label="Active sessions" className={cx(cardSurface, "max-w-[300px] p-2.5")}>
      <DemoHead icon={RiComputerLine} title="Sessions" detail="Signed in across 3 devices">
        <span aria-live="polite" className="shrink-0 text-caption-2-medium text-text-tertiary tabular-nums">
          {active} active
        </span>
      </DemoHead>

      <ul className="mt-1">
        {SESSIONS.map((session) => {
          const Icon = session.icon;
          const isRevoked = revoked.has(session.id);
          return (
            <li
              key={session.id}
              className={cx(
                revealGrid,
                isRevoked ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100",
              )}
            >
              <div inert={isRevoked} className="min-h-0 overflow-hidden">
                <div className="flex items-center gap-2 py-0.5">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background-secondary-default text-foreground-icon-secondary">
                    <Icon className="size-3.5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="truncate text-caption-1-semibold text-text-primary">{session.device}</span>
                      {session.current && (
                        <span className="shrink-0 rounded-full bg-accent-50 px-1 text-caption-2-medium text-accent-700">
                          This device
                        </span>
                      )}
                    </div>
                    <p className="truncate text-caption-2-regular text-text-tertiary">
                      {session.browser} · {session.location}
                    </p>
                  </div>
                  <span className="shrink-0 text-caption-2-regular text-text-tertiary tabular-nums">
                    {session.last}
                  </span>
                  {!session.current && (
                    <button
                      type="button"
                      onClick={() => revoke(session.id)}
                      aria-label={`Revoke session on ${session.device}`}
                      className={iconButton}
                    >
                      <RiCloseLine className="size-3.5" aria-hidden />
                    </button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-1 flex h-6 items-center justify-between gap-2 border-t border-separator-border pt-1">
        <span aria-live="polite" className="truncate text-caption-2-regular text-text-tertiary">
          {allOthersRevoked ? "All other sessions signed out." : "Sessions expire after 30 days."}
        </span>
        {allOthersRevoked ? (
          <button type="button" onClick={() => setRevoked(new Set())} className={cx(quietButton, "h-6 px-1")}>
            Undo
          </button>
        ) : (
          <button type="button" onClick={revokeAll} className={cx(quietButton, "h-6 px-1")}>
            Revoke all
          </button>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  3. Password policy                                                         */
/* -------------------------------------------------------------------------- */

const PASSWORD_RULES = [
  { id: "length", label: "12 characters or more", test: (value: string) => value.length >= 12 },
  {
    id: "case",
    label: "Upper and lowercase",
    test: (value: string) => /[a-z]/.test(value) && /[A-Z]/.test(value),
  },
  { id: "number", label: "At least one number", test: (value: string) => /\d/.test(value) },
  { id: "symbol", label: "One symbol", test: (value: string) => /[^A-Za-z0-9]/.test(value) },
] as const;

export function PasswordPolicy() {
  const fieldId = useId();
  const [value, setValue] = useState("Northline2026");
  const [visible, setVisible] = useState(false);
  const met = PASSWORD_RULES.filter((rule) => rule.test(value)).length;
  const strength = met === 4 ? "Strong" : met >= 3 ? "Almost" : met >= 2 ? "Fair" : "Too weak";

  return (
    <section aria-label="Password policy" className={cx(cardSurface, "max-w-[300px] p-2.5")}>
      <DemoHead icon={RiLockPasswordLine} title="Password policy" detail="Checked as you type">
        <StatusPill tone={met === 4 ? "ok" : "neutral"}>{met} of 4</StatusPill>
      </DemoHead>

      <label htmlFor={fieldId} className="sr-only">
        New password
      </label>
      <div
        className={cx(
          "mt-2 flex h-9 items-center gap-2 rounded-lg bg-background-tertiary-default px-2",
          "ring-2 ring-inset ring-transparent transition-[box-shadow] duration-150 ease-out focus-within:ring-border-focus-ring",
          "motion-reduce:transition-none",
        )}
      >
        <RiLock2Line className="size-3.5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
        <input
          id={fieldId}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          autoComplete="new-password"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent text-body-regular text-text-primary outline-none placeholder:text-text-placeholder"
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className={cx(iconButton, "size-6")}
        >
          {visible ? <RiEyeOffLine className="size-3.5" aria-hidden /> : <RiEyeLine className="size-3.5" aria-hidden />}
        </button>
      </div>

      <ul className="mt-1.5 grid grid-cols-2 gap-x-2 gap-y-0.5">
        {PASSWORD_RULES.map((rule) => {
          const passed = rule.test(value);
          return (
            <li key={rule.id} className="flex items-center gap-1">
              <span
                aria-hidden
                className={cx(
                  "flex size-3.5 shrink-0 items-center justify-center rounded-full border",
                  "transition-[background-color,border-color,color] duration-150 ease-out motion-reduce:transition-none",
                  passed
                    ? "border-transparent bg-status-lime-background text-status-lime-text"
                    : "border-border-button-default bg-background-primary-default text-transparent",
                )}
              >
                <RiCheckLine
                  className={cx(
                    "size-2.5 transition-[transform,opacity] duration-150 ease-out motion-reduce:transition-none",
                    passed ? "scale-100 opacity-100" : "scale-50 opacity-0",
                  )}
                />
              </span>
              <span className={cx("truncate text-caption-2-regular", passed ? "text-text-secondary" : "text-text-tertiary")}>
                <span className="sr-only">{passed ? "Met: " : "Not met: "}</span>
                {rule.label}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-1.5 flex items-center gap-2 border-t border-separator-border pt-1.5">
        <div aria-hidden className="flex flex-1 gap-1">
          {PASSWORD_RULES.map((rule, index) => (
            <span key={rule.id} className={cx("h-1 flex-1 rounded-full transition-[background-color] duration-200 ease-out motion-reduce:transition-none", index < met ? (met === 4 ? "bg-status-lime-text" : "bg-accent-500") : "bg-background-tertiary-default")} />
          ))}
        </div>
        <span role="status" className="text-caption-2-medium text-text-secondary tabular-nums">
          {strength}
        </span>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  4. Audit log                                                               */
/* -------------------------------------------------------------------------- */

const AUDIT_EVENTS = [
  { id: "evt_8f21", actor: "Maya Chen", initials: "MC", action: "rotated", target: "STRIPE_SECRET_KEY", scope: "Production", time: "09:42", ip: "203.0.113.42", request: "8f21c9a" },
  { id: "evt_5c04", actor: "Jonas Reed", initials: "JR", action: "invited", target: "priya@northline.co", scope: "Workspace", time: "08:18", ip: "198.51.100.24", request: "5c04e17" },
  { id: "evt_2a9b", actor: "Priya Nair", initials: "PN", action: "enabled", target: "sso.enforcement", scope: "Workspace", time: "07:05", ip: "192.0.2.18", request: "2a9b3d0" },
] as const;

export function AuditLog() {
  const [selected, setSelected] = useState<string>(AUDIT_EVENTS[0].id);
  const event = AUDIT_EVENTS.find((item) => item.id === selected) ?? AUDIT_EVENTS[0];

  return (
    <section aria-label="Audit log" className={cx(cardSurface, "max-w-[560px] p-2.5")}>
      <DemoHead icon={RiHistoryLine} title="Audit log" detail="Every change, signed and immutable">
        <span className="inline-flex h-5 shrink-0 items-center rounded-full bg-background-tertiary-default px-1.5 text-caption-2-medium text-text-secondary tabular-nums">
          3 events
        </span>
      </DemoHead>

      <div role="group" aria-label="Recent events" className="mt-1.5 flex flex-col gap-0.5">
        {AUDIT_EVENTS.map((item) => {
          const active = item.id === selected;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => setSelected(item.id)}
              className={cx(
                "flex w-full items-center gap-2 rounded-md px-1 py-0.5 text-start",
                "transition-[background-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                active ? "bg-background-secondary-default shadow-xs" : "hover:bg-background-primary-hover",
              )}
            >
              <Initials text={item.initials} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-caption-1-regular text-text-secondary">
                  <span className="text-caption-1-medium text-text-primary">{item.actor}</span> {item.action}{" "}
                  <bdi dir="ltr" className="font-mono text-caption-1-medium text-text-primary">{item.target}</bdi>
                </span>
                <span className="block truncate text-caption-2-regular text-text-tertiary">{item.scope} · {item.time} UTC</span>
              </span>
              <RiArrowDownSLine className={cx("size-3.5 shrink-0 text-foreground-icon-tertiary transition-transform duration-200 ease-out motion-reduce:transition-none", active && "rotate-180")} aria-hidden />
            </button>
          );
        })}
      </div>

      <div aria-live="polite" className="mt-1 flex h-5 items-center justify-between gap-2 rounded-md bg-background-secondary-default px-2">
        <span className="min-w-0 truncate font-mono text-caption-2-regular text-text-tertiary">
          <bdi dir="ltr">
            ip {event.ip} · req {event.request}
          </bdi>
        </span>
        <span className="flex shrink-0 items-center gap-1 text-caption-2-regular text-text-tertiary">
          <RiShieldCheckLine className="size-3 text-status-lime-text" aria-hidden />
          Verified
        </span>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  5. API key reveal                                                          */
/* -------------------------------------------------------------------------- */

const API_KEY = "sk_live_9f2c7a41d8e3b6c5a90";
const API_KEY_MASKED = "sk_live_••••••••••••••••";

export function ApiKeyReveal() {
  const [visible, setVisible] = useState(false);
  const [revoked, setRevoked] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const { copied, copy } = useCopyFeedback();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!confirming) return;
    cancelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setConfirming(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirming]);

  return (
    <section aria-label="Production API key" className={cx(cardSurface, "max-w-[300px] p-2.5")}>
      <DemoHead icon={RiKey2Line} title="Secret key" detail="Production · created Oct 12">
        <StatusPill tone={revoked ? "danger" : "ok"}>{revoked ? "Revoked" : "Active"}</StatusPill>
      </DemoHead>

      <div className="mt-2 flex h-9 items-center gap-1 rounded-lg border border-separator-border bg-background-secondary-default pe-1 ps-2">
        <span dir="ltr" className="min-w-0 flex-1 truncate font-mono text-caption-1-medium text-text-primary">
          {revoked ? "Revoked · no longer accepted" : visible ? API_KEY : API_KEY_MASKED}
        </span>
        {!revoked && (
          <>
            <button
              type="button"
              onClick={() => setVisible((current) => !current)}
              aria-label={visible ? "Hide API key" : "Reveal API key"}
              aria-pressed={visible}
              className={iconButton}
            >
              {visible ? (
                <RiEyeOffLine className="size-3.5" aria-hidden />
              ) : (
                <RiEyeLine className="size-3.5" aria-hidden />
              )}
            </button>
            <button
              type="button"
              onClick={() => copy(API_KEY)}
              aria-label={copied ? "API key copied" : "Copy API key"}
              className={iconButton}
            >
              {copied ? (
                <RiCheckLine className="size-3.5 text-status-lime-text" aria-hidden />
              ) : (
                <RiFileCopyLine className="size-3.5" aria-hidden />
              )}
            </button>
          </>
        )}
      </div>

      <p aria-live="polite" className="mt-1 h-4 truncate text-caption-2-regular text-text-tertiary">
        {copied
          ? "Copied to clipboard."
          : revoked
            ? "Requests using this key now return 401."
            : "Last used 4 minutes ago from 203.0.113.42"}
      </p>

      <div className="mt-1 flex h-8 items-center">
        {revoked ? (
          <button
            type="button"
            onClick={() => {
              setRevoked(false);
              setVisible(false);
            }}
            className={cx(primaryButton, "w-full")}
          >
            <RiRefreshLine className="size-3.5" aria-hidden />
            Create replacement
          </button>
        ) : confirming ? (
          <div className={cx("flex w-full items-center gap-1.5", stepIn)}>
            <span className="min-w-0 flex-1 text-caption-2-regular text-text-secondary">Apps using it will fail.</span>
            <button
              ref={cancelRef}
              type="button"
              onClick={() => setConfirming(false)}
              className={cx(secondaryButton, "h-7 px-2")}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setRevoked(true);
                setConfirming(false);
                setVisible(false);
              }}
              className={cx(dangerButton, "h-7 px-2")}
            >
              Revoke key
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className={cx(quietButton, "h-7 px-1.5 text-text-error-primary hover:bg-status-rose-background")}
          >
            <RiDeleteBinLine className="size-3.5" aria-hidden />
            Revoke key
          </button>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  6. Permission matrix                                                       */
/* -------------------------------------------------------------------------- */

const ROLES = ["Owner", "Admin", "Editor", "Viewer"] as const;
type Role = (typeof ROLES)[number];

const RESOURCES = ["Billing", "Members", "API keys", "Audit log"] as const;
type Resource = (typeof RESOURCES)[number];

type Grants = Record<Role, Record<Resource, boolean>>;

const INITIAL_GRANTS: Grants = {
  Owner: { Billing: true, Members: true, "API keys": true, "Audit log": true },
  Admin: { Billing: false, Members: true, "API keys": true, "Audit log": true },
  Editor: { Billing: false, Members: false, "API keys": false, "Audit log": false },
  Viewer: { Billing: false, Members: false, "API keys": false, "Audit log": false },
};

export function PermissionMatrix() {
  const [grants, setGrants] = useState<Grants>(INITIAL_GRANTS);

  const toggle = (role: Role, resource: Resource) => {
    if (role === "Owner") return;
    setGrants((current) => ({
      ...current,
      [role]: { ...current[role], [resource]: !current[role][resource] },
    }));
  };

  return (
    <section aria-label="Permission matrix" className={cx(cardSurface, "max-w-[520px] p-2.5")}>
      <DemoHead icon={RiShieldUserLine} title="Permission matrix" detail="Northline workspace · 214 members">
        <span className="hidden shrink-0 text-caption-2-medium text-text-tertiary sm:inline">4 roles × 4 resources</span>
      </DemoHead>

      <table className="mt-1.5 w-full table-fixed border-collapse">
        <caption className="sr-only">
          Permissions by role and resource. Select a cell to grant or revoke access.
        </caption>
        <thead>
          <tr>
            <th
              scope="col"
              className="w-[28%] pb-1 text-start text-caption-2-semibold tracking-wide text-text-tertiary uppercase"
            >
              Role
            </th>
            {RESOURCES.map((resource) => (
              <th key={resource} scope="col" className="pb-1 text-center text-caption-2-medium text-text-tertiary">
                {resource}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROLES.map((role) => {
            const owner = role === "Owner";
            return (
              <tr key={role} className="border-t border-separator-border">
                <th scope="row" className="text-start text-caption-1-medium text-text-primary">
                  <span className="flex items-center gap-1">
                    {role}
                    {owner && <RiLock2Line className="size-3 text-foreground-icon-tertiary" aria-hidden />}
                  </span>
                </th>
                {RESOURCES.map((resource) => {
                  const granted = grants[role][resource];
                  return (
                    <td key={resource} className="text-center">
                      <button
                        type="button"
                        disabled={owner}
                        aria-pressed={granted}
                        aria-label={owner ? `Owner always has ${resource} access` : `${granted ? "Revoke" : "Grant"} ${resource} access for ${role}`}
                        onClick={() => toggle(role, resource)}
                        className={cx(
                          "inline-flex size-5 items-center justify-center rounded-md border",
                          "transition-[background-color,border-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                          focusRing,
                          granted
                            ? "border-accent-500 bg-accent-50 text-accent-700"
                            : "border-border-button-default bg-background-primary-default text-foreground-icon-quaternary hover:bg-background-primary-hover",
                          owner && "cursor-default opacity-70",
                        )}
                      >
                        {granted ? (
                          <RiCheckLine className="size-3" aria-hidden />
                        ) : (
                          <RiSubtractLine className="size-3" aria-hidden />
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-1 flex items-start justify-between gap-2 border-t border-separator-border pt-1.5">
        <span className="min-w-0 text-pretty text-caption-2-regular text-text-tertiary">
          Owner access is fixed. Other changes apply immediately.
        </span>
        <span className="flex shrink-0 items-center gap-1 text-caption-2-regular text-text-tertiary">
          <span aria-hidden className="size-2 rounded-sm border border-accent-500 bg-accent-50" />
          Allowed
        </span>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  7. Login alert                                                             */
/* -------------------------------------------------------------------------- */

type LoginState = "alert" | "trusted" | "secured";

export function LoginAlert() {
  const [state, setState] = useState<LoginState>("alert");
  const resolved = state !== "alert";
  const Icon = state === "alert" ? RiAlertLine : state === "trusted" ? RiShieldCheckLine : RiLock2Line;

  return (
    <section
      aria-label="New device sign-in alert"
      className={cx(
        cardSurface,
        "max-w-[300px] p-2.5 transition-[border-color] duration-200 ease-out motion-reduce:transition-none",
        resolved ? "border-status-lime-text/30" : "border-status-orange-text/30",
      )}
    >
      <div key={state} role={state === "alert" ? "alert" : "status"} className={stepIn}>
        <div className="flex items-start gap-2">
          <span
            className={cx(
              "flex size-8 shrink-0 items-center justify-center rounded-full",
              resolved
                ? "bg-status-lime-background text-status-lime-text"
                : "bg-status-orange-background text-status-orange-text",
            )}
          >
            <Icon className="size-4" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p
              className={cx(
                "text-caption-2-semibold tracking-wide uppercase",
                resolved ? "text-status-lime-text" : "text-status-orange-text",
              )}
            >
              {state === "alert" ? "New sign-in" : state === "trusted" ? "Device trusted" : "Account secured"}
            </p>
            <h3 className="truncate text-body-2-semibold text-text-primary">
              {state === "alert" ? "Chrome on Windows" : state === "trusted" ? "This device is now trusted" : "Session ended"}
            </h3>
          </div>
          <span className="shrink-0 text-caption-2-regular text-text-tertiary">
            {state === "alert" ? "2 min ago" : "Just now"}
          </span>
        </div>

        <p className="mt-1.5 text-caption-2-regular text-text-secondary">
          {state === "alert" ? (
            <>
              Warsaw, Poland · Windows 11 · <bdi dir="ltr">203.0.113.42</bdi>
            </>
          ) : state === "trusted" ? (
            "This device will skip email verification for the next 30 days."
          ) : (
            <>
              Reset link sent to <bdi dir="ltr">maya@northline.co</bdi>. All other sessions were revoked.
            </>
          )}
        </p>

        {state === "alert" && <p className="mt-0.5 text-caption-2-regular text-text-tertiary">First sign-in from this device.</p>}

        {state === "alert" ? (
          <div className="mt-2 flex gap-1.5">
            <button type="button" onClick={() => setState("trusted")} className={cx(secondaryButton, "flex-1")}>
              Yes, it&rsquo;s me
            </button>
            <button type="button" onClick={() => setState("secured")} className={cx(dangerButton, "flex-1")}>
              Secure account
            </button>
          </div>
        ) : (
          <div className="mt-2 flex h-8 items-center justify-between gap-2">
            <span className="text-caption-2-regular text-text-tertiary">
              {state === "trusted" ? "Device added to your trust list." : "Password reset is required."}
            </span>
            <button type="button" onClick={() => setState("alert")} className={cx(quietButton, "h-6 px-1")}>
              Undo
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  8. Device trust                                                            */
/* -------------------------------------------------------------------------- */

const TRUSTED_DEVICES = [
  {
    id: "macbook",
    name: "MacBook Pro",
    detail: "Lisbon · Chrome 141",
    since: "Trusted Oct 3",
    current: true,
    icon: RiMacbookLine,
  },
  {
    id: "iphone",
    name: "iPhone 16",
    detail: "Lisbon · Safari",
    since: "Trusted Sep 18",
    current: false,
    icon: RiSmartphoneLine,
  },
  {
    id: "ipad",
    name: "iPad Air",
    detail: "Porto · Safari",
    since: "Trusted Aug 2",
    current: false,
    icon: RiTabletLine,
  },
] as const;

export function DeviceTrust() {
  const [removed, setRemoved] = useState<string[]>([]);
  const [lastRemoved, setLastRemoved] = useState<string | null>(null);
  const trustedCount = TRUSTED_DEVICES.length - removed.length;
  const removedDevice = TRUSTED_DEVICES.find((device) => device.id === lastRemoved);

  const remove = (id: string) => {
    setRemoved((current) => [...current, id]);
    setLastRemoved(id);
  };

  const undo = () => {
    if (!lastRemoved) return;
    setRemoved((current) => current.filter((id) => id !== lastRemoved));
    setLastRemoved(null);
  };

  return (
    <section aria-label="Trusted devices" className={cx(cardSurface, "max-w-[300px] p-2.5")}>
      <DemoHead icon={RiShieldCheckLine} title="Trusted devices" detail="Skip email checks on known hardware">
        <span className="shrink-0 text-caption-2-medium text-text-tertiary tabular-nums">{trustedCount} trusted</span>
      </DemoHead>

      <ul className="mt-1">
        {TRUSTED_DEVICES.map((device) => {
          const Icon = device.icon;
          const isRemoved = removed.includes(device.id);
          return (
            <li
              key={device.id}
              className={cx(
                revealGrid,
                isRemoved ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100",
              )}
            >
              <div inert={isRemoved} className="min-h-0 overflow-hidden">
                <div className="flex items-center gap-2 py-0.5">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background-secondary-default text-foreground-icon-secondary">
                    <Icon className="size-3.5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="truncate text-caption-1-semibold text-text-primary">{device.name}</span>
                      {device.current && (
                        <span className="shrink-0 rounded-full bg-accent-50 px-1 text-caption-2-medium text-accent-700">
                          This device
                        </span>
                      )}
                    </div>
                    <p className="truncate text-caption-2-regular text-text-tertiary">
                      {device.detail} · {device.since}
                    </p>
                  </div>
                  {!device.current && (
                    <button
                      type="button"
                      onClick={() => remove(device.id)}
                      aria-label={`Remove ${device.name} from trusted devices`}
                      className={iconButton}
                    >
                      <RiCloseLine className="size-3.5" aria-hidden />
                    </button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-1 flex h-6 items-center justify-between gap-2 border-t border-separator-border pt-1">
        <span aria-live="polite" className="truncate text-caption-2-regular text-text-tertiary">
          {removedDevice ? `${removedDevice.name} removed.` : "Removal requires a fresh sign-in."}
        </span>
        {removedDevice ? (
          <button type="button" onClick={undo} className={cx(quietButton, "h-6 px-1")}>
            Undo
          </button>
        ) : (
          <span className="shrink-0 text-caption-2-regular text-text-tertiary tabular-nums">{trustedCount} of 3</span>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  9. Recovery codes                                                          */
/* -------------------------------------------------------------------------- */

const RECOVERY_SETS = [
  ["J7HK-2M9Q", "P4RX-8T2W", "C9ND-5V6B", "M2QF-7L3S", "W8AZ-4K1E", "T6YB-9H5R"],
  ["R3MV-6C8P", "K9WD-2F4N", "X5QT-7B1J", "H8LS-3V6Z", "N2GY-9M4A", "B7CE-5P3U"],
] as const;

export function RecoveryCodes() {
  const [setIndex, setSetIndex] = useState<number | null>(null);
  const { copied, copy } = useCopyFeedback();
  const codes = setIndex === null ? null : RECOVERY_SETS[setIndex];

  const generate = () => {
    setSetIndex((current) => (current === null ? 0 : (current + 1) % RECOVERY_SETS.length));
  };

  const download = () => {
    if (!codes) return;
    const content = [
      "Northline recovery codes",
      "Generated Nov 5, 2026",
      "Account: maya@northline.co",
      "",
      ...codes,
      "",
      "Each code works once. Store this file offline.",
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "northline-recovery-codes.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <section aria-label="Recovery codes" className={cx(cardSurface, "max-w-[300px] p-2.5")}>
      <DemoHead icon={RiFileShield2Line} title="Recovery codes" detail="Backup sign-in when your phone is gone">
        <StatusPill tone={codes ? "info" : "neutral"}>{codes ? "6 left" : "Not set"}</StatusPill>
      </DemoHead>

      <div
        className={cx(
          "mt-2 rounded-lg border px-2 py-1.5 transition-[background-color,border-color] duration-200 ease-out motion-reduce:transition-none",
          codes
            ? "border-separator-border bg-background-secondary-default"
            : "border-dashed border-border-button-default bg-background-secondary-default/50",
        )}
      >
        {codes ? (
          <ul dir="ltr" className="grid grid-cols-2 gap-x-3 gap-y-0.5">
            {codes.map((code) => (
              <li key={code} className="truncate font-mono text-caption-2-regular text-text-primary">
                {code}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex h-[45px] flex-col items-center justify-center gap-0.5 text-center">
            <RiLock2Line className="size-4 text-foreground-icon-tertiary" aria-hidden />
            <p className="text-caption-2-regular text-text-tertiary">Hidden until you generate them.</p>
          </div>
        )}
      </div>

      <div className="mt-2 flex gap-1.5">
        <button type="button" onClick={generate} className={cx(primaryButton, "flex-1")}>
          <RiRefreshLine className="size-3.5" aria-hidden />
          {codes ? "New codes" : "Generate codes"}
        </button>
        <button
          type="button"
          onClick={() => (codes ? copy(codes.join("\n")) : undefined)}
          disabled={!codes}
          aria-label={copied ? "Recovery codes copied" : "Copy recovery codes"}
          className={cx(secondaryButton, "w-8 px-0")}
        >
          {copied ? (
            <RiCheckLine className="size-3.5 text-status-lime-text" aria-hidden />
          ) : (
            <RiFileCopyLine className="size-3.5" aria-hidden />
          )}
        </button>
        <button
          type="button"
          onClick={download}
          disabled={!codes}
          aria-label="Download recovery codes"
          className={cx(secondaryButton, "w-8 px-0")}
        >
          <RiDownloadLine className="size-3.5" aria-hidden />
        </button>
      </div>

      <p aria-live="polite" className="mt-1 h-4 truncate text-caption-2-regular text-text-tertiary">
        {copied
          ? "Copied to clipboard."
          : codes
            ? "Each code works once. Store the file offline."
            : "Generate after enabling two-factor."}
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  10. SSO card                                                               */
/* -------------------------------------------------------------------------- */

export function SsoCard() {
  const [enforce, setEnforce] = useState(true);
  const [testing, setTesting] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!testing) return;
    const timer = window.setTimeout(() => {
      setTesting(false);
      setVerified(true);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [testing]);

  const test = () => {
    setTesting(true);
    setVerified(false);
  };

  return (
    <section aria-label="Single sign-on connection" className={cx(cardSurface, "max-w-[300px] p-2.5")}>
      <DemoHead icon={RiShieldKeyholeLine} title="Single sign-on" detail="Okta · SAML 2.0">
        <StatusPill tone={testing ? "warn" : "ok"}>
          {testing ? "Testing" : verified ? "Verified" : "Connected"}
        </StatusPill>
      </DemoHead>

      <div className="mt-1.5 flex items-center justify-between gap-2 rounded-md bg-background-secondary-default px-2 py-1">
        <span className="min-w-0 truncate font-mono text-caption-2-regular text-text-tertiary">
          <bdi dir="ltr">northline.okta.com</bdi>
        </span>
        <span className="shrink-0 text-caption-2-regular text-text-tertiary">Last sync 4 min ago</span>
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-caption-1-medium text-text-primary">Require SSO</p>
          <p className="truncate text-caption-2-regular text-text-tertiary">
            {enforce ? "All 214 members" : "Passwords still allowed"}
          </p>
        </div>
        <Switch size="sm" isSelected={enforce} onChange={setEnforce} aria-label="Require SSO for all members" className="motion-reduce:[&_*]:transition-none" />
      </div>

      <button type="button" onClick={test} disabled={testing} className={cx(secondaryButton, "mt-1.5 w-full")}>
        {testing ? (
          <RiLoader4Line className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
        ) : (
          <RiRefreshLine className="size-3.5" aria-hidden />
        )}
        {testing ? "Testing connection" : verified ? "Test again" : "Test connection"}
      </button>

      <p aria-live="polite" className="mt-1 h-4 truncate text-caption-2-regular text-text-tertiary">
        {testing
          ? "Fetching metadata from northline.okta.com…"
          : verified
            ? "Metadata valid · certificate expires Mar 2027."
            : "Certificate expires Mar 2027."}
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  11. Data retention                                                         */
/* -------------------------------------------------------------------------- */

const RETENTION_OPTIONS = [
  { days: 30, label: "30 days", detail: "Shortest" },
  { days: 90, label: "90 days", detail: "Recommended" },
  { days: 180, label: "180 days", detail: "Quarterly" },
  { days: 365, label: "1 year", detail: "Regulated" },
] as const;

type RetentionDays = (typeof RETENTION_OPTIONS)[number]["days"];

export function DataRetention() {
  const name = useId();
  const [days, setDays] = useState<RetentionDays>(90);
  const [audit, setAudit] = useState(true);
  const selected = RETENTION_OPTIONS.find((option) => option.days === days) ?? RETENTION_OPTIONS[1];

  return (
    <section aria-label="Data retention policy" className={cx(cardSurface, "max-w-[300px] p-2.5")}>
      <DemoHead icon={RiTimeLine} title="Data retention" detail="Workspace records and logs">
        <StatusPill tone="neutral">{selected.label}</StatusPill>
      </DemoHead>

      <fieldset className="mt-2">
        <legend className="sr-only">Retention period</legend>
        <div className="grid grid-cols-2 gap-1">
          {RETENTION_OPTIONS.map((option) => {
            const isSelected = option.days === days;
            return (
              <label
                key={option.days}
                className={cx(
                  "flex h-8 cursor-pointer items-center gap-1 rounded-lg border px-1.5",
                  "transition-[background-color,border-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                  "focus-within:ring-2 focus-within:ring-border-focus-ring",
                  isSelected
                    ? "border-accent-500 bg-background-secondary-default shadow-xs"
                    : "border-border-button-default bg-background-primary-default hover:bg-background-primary-hover",
                )}
              >
                <input
                  type="radio"
                  name={name}
                  value={option.days}
                  checked={isSelected}
                  onChange={() => setDays(option.days)}
                  className="sr-only"
                />
                <span
                  aria-hidden
                  className={cx(
                    "flex size-3.5 shrink-0 items-center justify-center rounded-full border",
                    "transition-[background-color,border-color] duration-150 ease-out motion-reduce:transition-none",
                    isSelected ? "border-accent-600 bg-accent-600" : "border-border-checkbox-default",
                  )}
                >
                  <span
                    className={cx(
                      "size-1.5 rounded-full bg-text-white transition-[transform,opacity] duration-150 ease-out motion-reduce:transition-none",
                      isSelected ? "scale-100 opacity-100" : "scale-50 opacity-0",
                    )}
                  />
                </span>
                <span className="text-caption-1-semibold text-text-primary">{option.label}</span>
                <span className="ms-auto truncate text-caption-2-regular text-text-tertiary">{option.detail}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <p aria-live="polite" className="mt-1.5 rounded-md bg-background-secondary-default px-2 py-1 text-caption-2-regular text-text-secondary">
        Data older than <span className="text-text-primary">{selected.label}</span> is deleted nightly at 02:00 UTC.
      </p>

      <div className="mt-1 flex items-center justify-between gap-2">
        <span className="min-w-0 truncate text-caption-2-regular text-text-secondary">
          Keep audit logs for 7 years
        </span>
        <Switch size="sm" isSelected={audit} onChange={setAudit} aria-label="Keep audit logs for seven years" className="motion-reduce:[&_*]:transition-none" />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  12. Access request                                                         */
/* -------------------------------------------------------------------------- */

const REQUEST_ROLES = ["Viewer", "Editor", "Admin"] as const;
type RequestRole = (typeof REQUEST_ROLES)[number];
type RequestStatus = "pending" | "approved" | "denied";

const REQUEST_STATUS: Record<RequestStatus, { tone: Tone; label: string }> = {
  pending: { tone: "warn", label: "Pending" },
  approved: { tone: "ok", label: "Approved" },
  denied: { tone: "danger", label: "Denied" },
};

export function AccessRequest() {
  const [role, setRole] = useState<RequestRole>("Editor");
  const [status, setStatus] = useState<RequestStatus>("pending");
  const pending = status === "pending";

  return (
    <section aria-label="Access request from Jonas Reed" className={cx(cardSurface, "max-w-[300px] p-2.5")}>
      <div className="flex items-center gap-2">
        <Initials text="JR" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Jonas Reed</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">Support engineer · 2h ago</p>
        </div>
        <StatusPill tone={REQUEST_STATUS[status].tone}>{REQUEST_STATUS[status].label}</StatusPill>
      </div>

      <div className="mt-1.5 flex items-baseline justify-between gap-2">
        <span className="text-caption-2-regular text-text-tertiary">Requested access</span>
        <span className="truncate text-caption-1-semibold text-text-primary">Billing · export invoices</span>
      </div>

      <div className="mt-1.5 flex items-center gap-1">
        <span className="text-caption-2-regular text-text-tertiary">Role</span>
        {REQUEST_ROLES.map((item) => {
          const selected = role === item;
          return (
            <button
              key={item}
              type="button"
              disabled={!pending}
              aria-pressed={selected}
              onClick={() => setRole(item)}
              className={cx(
                "h-6 rounded-md border px-1.5 text-caption-2-semibold",
                "transition-[background-color,border-color,color] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                selected
                  ? "border-accent-500 bg-background-secondary-default text-text-primary"
                  : "border-border-button-default bg-background-primary-default text-text-tertiary hover:text-text-primary",
                !pending && "opacity-60",
              )}
            >
              {item}
            </button>
          );
        })}
      </div>

      <div key={status} className={cx("mt-1.5", stepIn)}>
        {pending ? (
          <>
            <p className="truncate text-caption-2-regular text-text-tertiary">
              &ldquo;Needs invoice exports for the Q4 reconciliation.&rdquo;
            </p>
            <div className="mt-2 flex gap-1.5">
              <button type="button" onClick={() => setStatus("denied")} className={cx(secondaryButton, "flex-1")}>
                Deny
              </button>
              <button type="button" onClick={() => setStatus("approved")} className={cx(primaryButton, "flex-1")}>
                Approve {role}
              </button>
            </div>
          </>
        ) : (
          <div role="status">
            <div
              className={cx(
                "flex items-center gap-2 rounded-lg px-2 py-1.5",
                status === "approved"
                  ? "bg-status-lime-background text-status-lime-text"
                  : "bg-status-rose-background text-status-rose-text",
              )}
            >
              {status === "approved" ? (
                <RiCheckLine className="size-4 shrink-0" aria-hidden />
              ) : (
                <RiCloseLine className="size-4 shrink-0" aria-hidden />
              )}
              <div className="min-w-0">
                <p className="truncate text-caption-1-semibold">
                  {status === "approved" ? `${role} access granted` : "Request denied"}
                </p>
                <p className="truncate text-caption-2-regular text-text-secondary">
                  {status === "approved" ? "Jonas can export invoices now." : "Jonas keeps current access."}
                </p>
              </div>
            </div>
            <div className="mt-1 flex h-8 items-center justify-between gap-2">
              <span className="text-caption-2-regular text-text-tertiary">Recorded in the audit log.</span>
              <button type="button" onClick={() => setStatus("pending")} className={cx(quietButton, "h-6 px-1")}>
                Undo
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Specimens                                                                  */
/* -------------------------------------------------------------------------- */

export const SECURITY_SECTION: ExtendedSection = {
  id: "security",
  title: "Security",
  blurb: "Sessions, keys and the controls that make access legible.",
  file: "security.tsx",
  entries: [
    { name: "Two-Factor Setup", description: "Pick a second factor, then confirm a six-digit code.", Demo: TwoFactorSetup },
    { name: "Session List", description: "Three signed-in devices; revoke one or all the others.", Demo: SessionList },
    { name: "Password Policy", description: "Four rules checked live, with a strength read underneath.", Demo: PasswordPolicy },
    { name: "Audit Log", description: "Who changed what, when, with the request trail underneath.", Demo: AuditLog, wide: true },
    { name: "API Key Reveal", description: "Reveal, copy and revoke a live key behind a guarded confirm.", Demo: ApiKeyReveal },
    { name: "Permission Matrix", description: "Grant or revoke access across four roles and four resources.", Demo: PermissionMatrix, wide: true },
    { name: "Login Alert", description: "A new device is flagged; trust it or secure the account.", Demo: LoginAlert },
    { name: "Device Trust", description: "Trusted devices with one-tap removal and a clean undo.", Demo: DeviceTrust },
    { name: "Recovery Codes", description: "Generate six single-use codes, then copy or download them.", Demo: RecoveryCodes },
    { name: "SSO Card", description: "Provider, connection health and whether SSO is enforced.", Demo: SsoCard },
    { name: "Data Retention", description: "Pick a retention window and read the deletion rule back.", Demo: DataRetention },
    { name: "Access Request", description: "Review a role request and approve, deny or undo the call.", Demo: AccessRequest },
  ],
};
