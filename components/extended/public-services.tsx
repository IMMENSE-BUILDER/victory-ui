"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import {
  RiAddLine,
  RiAlertLine,
  RiArrowDownSLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiBankCardLine,
  RiBriefcaseLine,
  RiBusLine,
  RiCalendarCheckLine,
  RiCalendarEventLine,
  RiChat3Line,
  RiCheckLine,
  RiCloseLine,
  RiFileList3Line,
  RiFilePdfLine,
  RiFileShield2Line,
  RiFileTextLine,
  RiHandHeartLine,
  RiHistoryLine,
  RiHome4Line,
  RiInformationLine,
  RiLoader4Line,
  RiMapPin2Line,
  RiNotification3Line,
  RiParentLine,
  RiRefreshLine,
  RiSearchLine,
  RiShieldCheckLine,
  RiSubtractLine,
  RiTimeLine,
  RiUploadCloud2Line,
  RiUserLine,
  RiWallet3Line,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* Shared anatomy */

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";
const cardSurface = "w-full rounded-xl border border-border-button-default bg-background-primary-default shadow-card";
const fieldClass =
  "h-8 w-full rounded-lg bg-background-tertiary-default px-2 text-caption-1-medium text-text-primary outline-none " +
  "placeholder:text-text-placeholder ring-2 ring-inset ring-transparent transition-[background-color,box-shadow] " +
  "duration-150 ease-out hover:ring-border-button-hover focus-visible:ring-border-focus-ring motion-reduce:transition-none";
const buttonBase =
  "inline-flex items-center justify-center gap-1.5 rounded-lg text-caption-1-semibold active:scale-[0.98] " +
  "transition-[transform,opacity,background-color,color,box-shadow] duration-150 ease-out disabled:pointer-events-none " +
  "disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:scale-100";
const primaryButton = cx(buttonBase, "h-8 bg-button-primary px-2.5 text-text-white shadow-xs", focusRing);
const secondaryButton = cx(
  buttonBase,
  "h-8 border border-border-button-default bg-background-primary-default px-2.5 text-text-primary shadow-xs hover:bg-background-primary-hover",
  focusRing,
);
const quietButton = cx(buttonBase, "h-7 px-1.5 text-text-secondary hover:bg-background-secondary-default hover:text-text-primary", focusRing);
const iconButton = cx(
  "flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-icon-tertiary",
  "transition-[background-color,color] duration-150 ease-out hover:bg-background-tertiary-default hover:text-text-primary motion-reduce:transition-none",
  focusRing,
);
const choiceBase = cx(
  "flex h-7 items-center justify-center gap-1 rounded-md border text-caption-1-semibold",
  "transition-[background-color,border-color,color] duration-150 ease-out motion-reduce:transition-none",
  focusRing,
);

const TONES = {
  lime: "bg-status-lime-background text-status-lime-text",
  yellow: "bg-status-yellow-background text-status-yellow-text",
  blue: "bg-status-blue-background text-status-blue-text",
  neutral: "bg-background-tertiary-default text-text-secondary",
} as const;

type Tone = keyof typeof TONES;

function Pill({ tone = "neutral", icon: Icon, children }: { tone?: Tone; icon?: IconComponent; children: ReactNode }) {
  return (
    <span className={cx("inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-caption-2-medium", TONES[tone])}>
      {Icon ? <Icon className="size-3" aria-hidden /> : null}
      {children}
    </span>
  );
}

function DemoHead({ icon: Icon, title, meta, trailing }: { icon: IconComponent; title: ReactNode; meta?: ReactNode; trailing?: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span aria-hidden className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-background-tertiary-default text-foreground-icon-secondary">
        <Icon className="size-3.5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-body-2-semibold text-text-primary">{title}</h3>
        {meta ? <p className="truncate text-caption-2-regular text-text-tertiary">{meta}</p> : null}
      </div>
      {trailing}
    </div>
  );
}

function Meter({ value, max, label }: { value: number; max: number; label: string }) {
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} className="h-1 w-full overflow-hidden rounded-full bg-background-tertiary-default">
      <div
        className="h-full rounded-full bg-accent-500 transition-[width] duration-200 ease-out motion-reduce:transition-none"
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  );
}

function TextField({ label, value, onChange, placeholder, invalid, autoComplete, className, inputMode, maxLength }: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  invalid?: boolean;
  autoComplete?: string;
  className?: string;
  inputMode?: "text" | "numeric";
  maxLength?: number;
}) {
  const id = useId();
  return (
    <label htmlFor={id} className={cx("flex min-w-0 flex-col gap-0.5", className)}>
      <span className="text-caption-2-medium text-text-secondary">{label}</span>
      <input
        id={id}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-invalid={invalid || undefined}
        onChange={(event) => onChange(event.target.value)}
        className={cx(fieldClass, invalid && "ring-2 ring-inset ring-border-error-default focus-visible:ring-border-error-default")}
      />
    </label>
  );
}

function InlineField({ label, value, onChange, autoComplete, inputMode, invalid, className }: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  autoComplete?: string;
  inputMode?: "text" | "numeric";
  invalid?: boolean;
  className?: string;
}) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={cx(
        "flex h-8 min-w-0 items-center gap-1.5 rounded-lg bg-background-tertiary-default px-2 ring-2 ring-inset ring-transparent",
        "transition-[background-color,box-shadow] duration-150 ease-out hover:ring-border-button-hover focus-within:ring-border-focus-ring motion-reduce:transition-none",
        invalid && "ring-border-error-default focus-within:ring-border-error-default",
        className,
      )}
    >
      <span className="shrink-0 text-caption-2-medium text-text-secondary">{label}</span>
      <input
        id={id}
        value={value}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={invalid || undefined}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 flex-1 bg-transparent text-caption-1-medium text-text-primary outline-none placeholder:text-text-placeholder"
      />
    </label>
  );
}

function Choice({ pressed, onClick, children, label, className }: { pressed: boolean; onClick: () => void; children: ReactNode; label?: string; className?: string }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={label}
      onClick={onClick}
      className={cx(
        choiceBase,
        pressed
          ? "border-accent-500 bg-accent-500/10 text-text-primary"
          : "border-border-button-default text-text-secondary hover:bg-background-primary-hover",
        className,
      )}
    >
      {children}
    </button>
  );
}

function Reveal({ id, open, children, className }: { id?: string; open: boolean; children: ReactNode; className?: string }) {
  return (
    <div
      id={id}
      inert={!open}
      className={cx(
        "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        className,
      )}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const usdWhole = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function formatSize(bytes: number) {
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/* 1. Case status */

const CASE_STAGES = [
  { name: "Received", date: "3 Nov", note: "Application BC-2417 was logged with two attachments." },
  { name: "Review", date: "5 Nov", note: "Priya Raman is checking your October payslips." },
  { name: "Decision", date: "12 Nov", note: "A decision letter is issued and posted on this page." },
  { name: "Payment", date: "1 Dec", note: "The first payment of $1,284.00 lands if approved." },
] as const;

export function CaseStatus() {
  const [selected, setSelected] = useState(1);
  const [reminder, setReminder] = useState(false);
  const stage = CASE_STAGES[selected];

  return (
    <section aria-label="Case BC-2417 status" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <DemoHead icon={RiFileList3Line} title="Case BC-2417" meta="Housing support · Priya Raman" trailing={<Pill tone="yellow">In review</Pill>} />

      <div role="group" aria-label="Review the case stages" className="mt-2 grid grid-cols-4 gap-0.5">
        {CASE_STAGES.map((item, index) => {
          const active = selected === index;
          const done = index < 1;
          return (
            <button
              key={item.name}
              type="button"
              aria-pressed={active}
              aria-label={`Show ${item.name} stage, ${item.date}`}
              onClick={() => setSelected(index)}
              className={cx("flex flex-col items-center gap-0.5 rounded-md py-0.5", focusRing)}
            >
              <span
                className={cx(
                  "flex size-4 items-center justify-center rounded-full border text-caption-2-semibold",
                  "transition-[background-color,border-color,color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
                  done
                    ? "border-accent-600 bg-accent-600 text-text-white"
                    : active
                      ? "border-accent-600 bg-background-primary-default text-accent-600 ring-2 ring-accent-500/25"
                      : "border-border-button-default bg-background-primary-default text-text-tertiary",
                )}
              >
                {done ? <RiCheckLine className="size-2.5" aria-hidden /> : <span className="tabular-nums">{index + 1}</span>}
              </span>
              <span className={cx("w-full truncate text-center text-caption-2-medium", active ? "text-text-primary" : "text-text-tertiary")}>
                {item.name}
              </span>
            </button>
          );
        })}
      </div>

      <p key={selected} className="mt-1.5 animate-label-in rounded-lg bg-background-secondary-default px-2 py-1.5 text-caption-1-regular text-text-secondary motion-reduce:animate-none">
        <span className="text-caption-1-semibold text-text-primary">{stage.name} · {stage.date}. </span>
        {stage.note}
      </p>

      <div className="mt-1.5 flex items-center gap-2">
        <p className="flex min-w-0 flex-1 items-center gap-1 text-caption-2-regular text-text-tertiary">
          <RiTimeLine className="size-3 shrink-0" aria-hidden />
          <span className="truncate">Next: payslips due 12 Nov</span>
        </p>
        <button
          type="button"
          aria-pressed={reminder}
          onClick={() => setReminder((current) => !current)}
          className={cx(reminder ? quietButton : secondaryButton, "h-6 shrink-0 gap-1 rounded-md px-1.5 text-caption-2-semibold")}
        >
          {reminder ? <RiCheckLine className="size-3 text-status-lime-text" aria-hidden /> : <RiNotification3Line className="size-3" aria-hidden />}
          {reminder ? "Reminder set" : "Remind me"}
        </button>
      </div>
    </section>
  );
}

/* 2. Form wizard */

const WIZARD_STEPS = [
  { name: "About you", hint: "As printed on your photo ID." },
  { name: "Household", hint: "Everyone who shares the rent." },
  { name: "Review", hint: "Check the details before sending." },
] as const;

export function FormWizard() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("Amara Okafor");
  const [people, setPeople] = useState(3);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const startOverRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (submitted) startOverRef.current?.focus();
  }, [submitted]);

  const next = () => {
    if (submitted) return;
    if (step === 0 && !name.trim()) {
      setError("Enter the name on your ID.");
      return;
    }
    setError(null);
    if (step === 2) {
      setSubmitted(true);
      return;
    }
    setStep((current) => current + 1);
  };

  return (
    <section aria-label="Housing application form" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <DemoHead icon={RiFileShield2Line} title="Housing application" meta={`Step ${submitted ? 3 : step + 1} of 3 · about 4 minutes`} />
      <div className="mt-1.5">
        <Meter value={submitted ? 3 : step + 1} max={3} label="Application progress" />
      </div>
      <p aria-live="polite" className="sr-only">
        {submitted ? "Application submitted" : `Step ${step + 1} of 3: ${WIZARD_STEPS[step].name}`}
      </p>

      {submitted ? (
        <div key="sent" role="status" className="mt-1.5 animate-label-in rounded-lg bg-background-secondary-default px-2 py-1.5 motion-reduce:animate-none">
          <p className="flex items-center gap-1.5 text-caption-1-semibold text-status-lime-text">
            <RiShieldCheckLine className="size-3.5" aria-hidden />
            Application sent
          </p>
          <p className="mt-0.5 text-caption-2-regular text-text-secondary">Reference HS-2417. A caseworker will reply by 12 Nov 2026.</p>
        </div>
      ) : (
        <div key={step} className="mt-1.5 animate-label-in motion-reduce:animate-none">
          {step === 0 ? (
            <>
              <TextField
                label="Full name"
                value={name}
                onChange={(value) => { setName(value); setError(null); }}
                placeholder="First and last name"
                autoComplete="name"
                invalid={Boolean(error)}
              />
              <p className={cx("mt-0.5 text-caption-2-regular", error ? "text-text-error-primary" : "text-text-tertiary")} role={error ? "alert" : undefined}>
                {error ?? WIZARD_STEPS[0].hint}
              </p>
            </>
          ) : step === 1 ? (
            <>
              <div className="flex items-center justify-between gap-2 rounded-lg bg-background-secondary-default px-2 py-1">
                <div>
                  <p className="text-caption-2-regular text-text-tertiary">People in the household</p>
                  <p className="text-body-2-semibold text-text-primary tabular-nums">{people} people</p>
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" aria-label="Remove a person" disabled={people <= 1} onClick={() => setPeople((current) => Math.max(1, current - 1))} className={cx(secondaryButton, "size-7 shrink-0 px-0")}>
                    <RiSubtractLine className="size-3.5" aria-hidden />
                  </button>
                  <span aria-live="polite" className="w-6 text-center text-body-2-semibold text-text-primary tabular-nums">{people}</span>
                  <button type="button" aria-label="Add a person" disabled={people >= 8} onClick={() => setPeople((current) => Math.min(8, current + 1))} className={cx(secondaryButton, "size-7 shrink-0 px-0")}>
                    <RiAddLine className="size-3.5" aria-hidden />
                  </button>
                </div>
              </div>
              <p className="mt-0.5 text-caption-2-regular text-text-tertiary">{WIZARD_STEPS[1].hint}</p>
            </>
          ) : (
            <>
              <dl className="divide-y divide-separator-border rounded-lg bg-background-secondary-default px-2">
                <div className="flex items-center justify-between gap-2 py-1">
                  <dt className="text-caption-2-regular text-text-tertiary">Name</dt>
                  <dd className="min-w-0 truncate text-caption-1-semibold text-text-primary">{name.trim()}</dd>
                </div>
                <div className="flex items-center justify-between gap-2 py-1">
                  <dt className="text-caption-2-regular text-text-tertiary">Household</dt>
                  <dd className="text-caption-1-semibold text-text-primary tabular-nums">{people} people</dd>
                </div>
              </dl>
              <p className="mt-0.5 text-caption-2-regular text-text-tertiary">{WIZARD_STEPS[2].hint}</p>
            </>
          )}
        </div>
      )}

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <button type="button" onClick={() => { setError(null); setStep((current) => Math.max(0, current - 1)); }} disabled={step === 0 || submitted} className={cx(quietButton, "h-7 gap-1")}>
          <RiArrowLeftLine className="size-3 rtl:-scale-x-100" aria-hidden />
          Back
        </button>
        <span className="text-caption-2-medium text-text-tertiary tabular-nums">{submitted ? "Submitted" : `${step + 1} / 3`}</span>
        {submitted ? (
          <button type="button" ref={startOverRef} onClick={() => { setStep(0); setError(null); setSubmitted(false); }} className={cx(secondaryButton, "h-7 gap-1 px-2")}>
            <RiRefreshLine className="size-3.5" aria-hidden />
            Start over
          </button>
        ) : (
          <button type="button" onClick={next} className={cx(primaryButton, "h-7 gap-1 px-2")}>
            {step === 2 ? "Submit" : "Next"}
            <RiArrowRightLine className="size-3 rtl:-scale-x-100" aria-hidden />
          </button>
        )}
      </div>
    </section>
  );
}

/* 3. Document checklist */

const REQUIRED_DOCS = [
  { id: "income", label: "Proof of income", meta: "payslips, Sep–Oct" },
  { id: "id", label: "Photo ID", meta: "passport or licence" },
  { id: "lease", label: "Lease agreement", meta: "pages 1–4, signed" },
] as const;

type DocId = (typeof REQUIRED_DOCS)[number]["id"];
type DocState = "missing" | "checking" | "ready";

export function DocumentChecklist() {
  const [docs, setDocs] = useState<Record<DocId, DocState>>({ income: "ready", id: "missing", lease: "missing" });
  const ready = REQUIRED_DOCS.filter((doc) => docs[doc.id] === "ready").length;
  const nextDoc = REQUIRED_DOCS.find((doc) => docs[doc.id] === "missing");

  useEffect(() => {
    const checking = REQUIRED_DOCS.find((doc) => docs[doc.id] === "checking");
    if (!checking) return;
    const timer = window.setTimeout(() => setDocs((current) => ({ ...current, [checking.id]: "ready" })), 900);
    return () => window.clearTimeout(timer);
  }, [docs]);

  const upload = (id: DocId) => setDocs((current) => (current[id] === "missing" ? { ...current, [id]: "checking" } : current));

  return (
    <section aria-label="Required documents" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Required documents</h3>
        <span aria-live="polite" className="text-caption-2-medium text-text-tertiary tabular-nums">{ready} of {REQUIRED_DOCS.length} ready</span>
      </div>
      <div className="mt-1">
        <Meter value={ready} max={REQUIRED_DOCS.length} label="Documents ready" />
      </div>

      <ul className="mt-1.5">
        {REQUIRED_DOCS.map((doc) => {
          const state = docs[doc.id];
          return (
            <li key={doc.id} className="flex h-7 items-center gap-1.5 border-b border-separator-border last:border-b-0">
              <span className={cx("flex size-5 shrink-0 items-center justify-center rounded-full transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none", state === "ready" ? "bg-status-lime-background text-status-lime-text" : "bg-background-tertiary-default text-foreground-icon-tertiary")}>
                {state === "ready" ? (
                  <RiCheckLine className="size-3 animate-label-in motion-reduce:animate-none" aria-hidden />
                ) : state === "checking" ? (
                  <RiLoader4Line className="size-3 animate-spin motion-reduce:animate-none" aria-hidden />
                ) : (
                  <RiFileTextLine className="size-3" aria-hidden />
                )}
              </span>
              <span className="min-w-0 flex-1 truncate text-caption-1-medium text-text-primary">
                {doc.label}<span className="text-text-tertiary"> · {doc.meta}</span>
              </span>
              {state === "ready" ? (
                <span className="shrink-0 text-caption-2-medium text-status-lime-text">Ready</span>
              ) : (
                <button type="button" aria-label={`Upload ${doc.label}`} disabled={state === "checking"} onClick={() => upload(doc.id)} className={cx(quietButton, "h-6 shrink-0 px-1.5 text-caption-2-semibold")}>
                  {state === "checking" ? "Checking" : "Upload"}
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span className="min-w-0 truncate text-caption-2-regular text-text-tertiary">JPG or PDF · 5 MB max</span>
        <button
          type="button"
          onClick={() => nextDoc && upload(nextDoc.id)}
          disabled={!nextDoc}
          className={cx(primaryButton, "h-6 shrink-0 px-2 text-caption-2-semibold")}
        >
          {nextDoc ? (
            <><RiArrowRightLine className="size-3 rtl:-scale-x-100" aria-hidden />Upload next</>
          ) : ready === REQUIRED_DOCS.length ? (
            <><RiCheckLine className="size-3" aria-hidden />All ready</>
          ) : (
            <><RiLoader4Line className="size-3 animate-spin motion-reduce:animate-none" aria-hidden />Checking</>
          )}
        </button>
      </div>
    </section>
  );
}

/* 4. Appointment booking */

const OFFICES = [
  { id: "central", name: "Central office", address: "14 Marlow St" },
  { id: "north", name: "North gate", address: "88 Halden Rd" },
  { id: "east", name: "East library", address: "2 Foundry Sq" },
] as const;

const APPOINTMENT_DAYS = [
  { label: "Thu 12 Nov", slots: ["09:20", "11:40", "14:00"] },
  { label: "Fri 13 Nov", slots: ["10:00", "13:20", "15:40"] },
  { label: "Mon 16 Nov", slots: ["09:00", "12:30", "16:10"] },
] as const;

export function AppointmentBooking() {
  const selectId = useId();
  const [officeId, setOfficeId] = useState<(typeof OFFICES)[number]["id"]>("central");
  const [dayIndex, setDayIndex] = useState(0);
  const [time, setTime] = useState("09:20");
  const [booked, setBooked] = useState(false);
  const office = OFFICES.find((item) => item.id === officeId) ?? OFFICES[0];
  const day = APPOINTMENT_DAYS[dayIndex];

  const chooseDay = (index: number) => {
    setDayIndex(index);
    setTime(APPOINTMENT_DAYS[index].slots[0]);
    setBooked(false);
  };

  return (
    <section aria-label="Book an appointment" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <DemoHead icon={RiCalendarEventLine} title="Book an appointment" meta="Housing support · in person · 30 min" trailing={<Pill tone="blue">3 dates</Pill>} />

      <div className="relative mt-1.5 flex items-center">
        <RiMapPin2Line className="pointer-events-none absolute start-2 size-3.5 text-foreground-icon-tertiary" aria-hidden />
        <label htmlFor={selectId} className="sr-only">Office location</label>
        <select
          id={selectId}
          value={officeId}
          onChange={(event) => { setOfficeId(event.target.value as (typeof OFFICES)[number]["id"]); setBooked(false); }}
          className={cx(fieldClass, "appearance-none pe-7 ps-7")}
        >
          {OFFICES.map((item) => <option key={item.id} value={item.id}>{item.name} — {item.address}</option>)}
        </select>
        <RiArrowDownSLine className="pointer-events-none absolute end-2 size-3.5 text-foreground-icon-tertiary" aria-hidden />
      </div>

      <div className="mt-1.5 flex items-center gap-1.5">
        <span className="w-7 shrink-0 text-caption-2-medium text-text-tertiary">Date</span>
        <div role="group" aria-label="Appointment date" className="grid flex-1 grid-cols-3 gap-1">
          {APPOINTMENT_DAYS.map((item, index) => (
            <Choice key={item.label} pressed={dayIndex === index} onClick={() => chooseDay(index)}>
              {item.label}
            </Choice>
          ))}
        </div>
      </div>

      <div className="mt-1 flex items-center gap-1.5">
        <span className="w-7 shrink-0 text-caption-2-medium text-text-tertiary">Time</span>
        <div role="group" aria-label="Appointment time" className="grid flex-1 grid-cols-3 gap-1">
          {day.slots.map((slot) => (
            <Choice key={slot} pressed={time === slot} onClick={() => { setTime(slot); setBooked(false); }} className="tabular-nums" label={slot}>
              <span dir="ltr">{slot}</span>
            </Choice>
          ))}
        </div>
      </div>

      <div className="mt-1.5 flex items-center gap-2">
        <p aria-live="polite" className="min-w-0 flex-1 truncate text-caption-2-regular text-text-secondary">
          {booked ? (
            <span className="flex items-center gap-1 text-status-lime-text"><RiCheckLine className="size-3" aria-hidden />Booked · APT-8841 · bring photo ID</span>
          ) : (
            `${office.name} · ${day.label} · ${time}`
          )}
        </p>
        <button type="button" disabled={booked} onClick={() => setBooked(true)} className={cx(booked ? secondaryButton : primaryButton, "h-6 shrink-0 px-2 text-caption-2-semibold")}>
          {booked ? "Booked" : "Confirm"}
        </button>
      </div>
    </section>
  );
}

/* 5. Benefit card */

export function BenefitCard() {
  const historyId = useId();
  const [history, setHistory] = useState(false);
  const [added, setAdded] = useState(false);

  return (
    <section aria-label="Housing support benefit" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <DemoHead icon={RiWallet3Line} title="Housing support" meta="Case BC-2417 · since Jun 2026" trailing={<Pill tone="lime">Active</Pill>} />

      <div className="mt-1.5 flex items-baseline gap-1.5">
        <span className="text-title-2-semibold text-text-primary tabular-nums">{usd.format(1284)}</span>
        <span className="text-caption-2-regular text-text-tertiary">/ month</span>
      </div>
      <p className="text-caption-2-regular text-text-tertiary">
        Next payment <time dateTime="2026-12-01" className="text-caption-1-semibold text-text-primary">Dec 1, 2026</time> · paid on the 1st
      </p>

      <div className="mt-1.5 flex items-center gap-1.5">
        <button type="button" aria-expanded={history} aria-controls={historyId} onClick={() => setHistory((current) => !current)} className={cx(secondaryButton, "h-7 flex-1 gap-1 px-2")}>
          <RiHistoryLine className="size-3.5" aria-hidden />
          History
          <RiArrowDownSLine className={cx("size-3 transition-transform duration-200 ease-out motion-reduce:transition-none", history && "rotate-180")} aria-hidden />
        </button>
        <button type="button" aria-pressed={added} onClick={() => setAdded((current) => !current)} className={cx(added ? secondaryButton : primaryButton, "h-7 gap-1 px-2")}>
          {added ? <RiCheckLine className="size-3.5" aria-hidden /> : <RiCalendarCheckLine className="size-3.5" aria-hidden />}
          {added ? "Reminder added" : "Add reminder"}
        </button>
      </div>

      <Reveal id={historyId} open={history}>
        <ul className="mt-1.5 divide-y divide-separator-border rounded-lg border border-separator-border px-2">
          {[
            { date: "Oct 1, 2026", iso: "2026-10-01" },
            { date: "Sep 1, 2026", iso: "2026-09-01" },
          ].map((payment) => (
            <li key={payment.iso} className="flex items-center gap-2 py-1 text-caption-2-regular">
              <time dateTime={payment.iso} className="min-w-0 flex-1 text-text-secondary">{payment.date}</time>
              <span className="text-status-lime-text">Paid</span>
              <span className="text-caption-1-semibold text-text-primary tabular-nums">{usd.format(1284)}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

/* 6. Address change */

const OLD_ADDRESS = "18 Alder Way, Apt 3, Springfield, IL 62704";

export function AddressChange() {
  const [street, setStreet] = useState("42 Willow Bend");
  const [city, setCity] = useState("Springfield");
  const [zip, setZip] = useState("62704");
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const editRef = useRef<HTMLButtonElement>(null);
  const streetInvalid = Boolean(error) && street.trim().length < 5;
  const cityInvalid = Boolean(error) && !city.trim();
  const zipInvalid = Boolean(error) && !/^\d{5}$/.test(zip.trim());

  useEffect(() => {
    if (confirmed) editRef.current?.focus();
  }, [confirmed]);

  const submit = () => {
    if (street.trim().length < 5) return setError("Enter a full street address.");
    if (!city.trim()) return setError("Enter a city.");
    if (!/^\d{5}$/.test(zip.trim())) return setError("ZIP must be 5 digits.");
    setError(null);
    setConfirmed(true);
  };

  return (
    <section aria-label="Change your address" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <DemoHead icon={RiHome4Line} title="Change your address" meta={<span title={OLD_ADDRESS}>Current: {OLD_ADDRESS}</span>} />

      {confirmed ? (
        <div className="mt-1.5 animate-label-in motion-reduce:animate-none" aria-live="polite">
          <div className="flex items-start gap-2 rounded-lg bg-status-lime-background px-2 py-1.5">
            <RiCheckLine className="mt-0.5 size-3.5 shrink-0 text-status-lime-text" aria-hidden />
            <div className="min-w-0">
              <p className="text-caption-1-semibold text-status-lime-text">Change requested</p>
              <p className="text-caption-2-regular text-text-secondary">Takes effect 17 Nov 2026 · ref AD-2291</p>
            </div>
          </div>
          <div className="mt-1.5 flex gap-1.5 text-caption-2-regular">
            <span className="w-9 shrink-0 text-text-tertiary">From</span>
            <span className="min-w-0 flex-1 text-text-secondary">{OLD_ADDRESS}</span>
          </div>
          <div className="mt-0.5 flex gap-1.5 text-caption-2-regular">
            <span className="w-9 shrink-0 text-text-tertiary">To</span>
            <span className="min-w-0 flex-1 text-caption-1-semibold text-text-primary">{street}, {city}, IL {zip}</span>
          </div>
          <button type="button" ref={editRef} onClick={() => setConfirmed(false)} className={cx(quietButton, "mt-1 h-6 px-1.5 text-caption-2-semibold")}>
            <RiArrowLeftLine className="size-3 rtl:-scale-x-100" aria-hidden />
            Edit again
          </button>
        </div>
      ) : (
        <form onSubmit={(event) => { event.preventDefault(); submit(); }}>
          <div className="mt-1.5 flex flex-col gap-1">
            <InlineField
              label="Street"
              value={street}
              onChange={(value) => { setStreet(value); setError(null); }}
              autoComplete="street-address"
              invalid={streetInvalid}
            />
            <div className="grid grid-cols-[1fr_84px] gap-1.5">
              <InlineField
                label="City"
                value={city}
                onChange={(value) => { setCity(value); setError(null); }}
                autoComplete="address-level2"
                invalid={cityInvalid}
              />
              <InlineField
                label="ZIP"
                value={zip}
                onChange={(value) => { setZip(value.replace(/\D/g, "").slice(0, 5)); setError(null); }}
                inputMode="numeric"
                autoComplete="postal-code"
                invalid={zipInvalid}
              />
            </div>
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <span role={error ? "alert" : undefined} className={cx("min-w-0 truncate text-caption-2-regular", error ? "text-text-error-primary" : "text-text-tertiary")}>
              {error ?? "Takes 1 working day · free"}
            </span>
            <button type="submit" className={cx(primaryButton, "h-7 shrink-0 px-2")}>
              Request change
              <RiArrowRightLine className="size-3 rtl:-scale-x-100" aria-hidden />
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

/* 7. Payment plan */

const INSTALLMENTS = [
  { id: "oct", due: "Oct 1, 2026", iso: "2026-10-01", amount: 93.75 },
  { id: "nov", due: "Nov 1, 2026", iso: "2026-11-01", amount: 93.75 },
  { id: "dec", due: "Dec 1, 2026", iso: "2026-12-01", amount: 93.75 },
  { id: "jan", due: "Jan 1, 2027", iso: "2027-01-01", amount: 93.75 },
] as const;

type InstallmentId = (typeof INSTALLMENTS)[number]["id"];

export function PaymentPlan() {
  const [paidIds, setPaidIds] = useState<InstallmentId[]>(["oct", "nov"]);
  const [paying, setPaying] = useState(false);
  const next = INSTALLMENTS.find((item) => !paidIds.includes(item.id));
  const paidTotal = INSTALLMENTS.filter((item) => paidIds.includes(item.id)).reduce((total, item) => total + item.amount, 0);

  useEffect(() => {
    if (!paying || !next) return;
    const timer = window.setTimeout(() => {
      setPaidIds((current) => (current.includes(next.id) ? current : [...current, next.id]));
      setPaying(false);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [paying, next]);

  return (
    <section aria-label="Payment plan" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <DemoHead icon={RiBankCardLine} title="Payment plan" meta={`Case BC-2417 · ${usd.format(375)} over 4 months`} trailing={<Pill tone="lime">Autopay on</Pill>} />

      <div className="mt-1 flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <Meter value={paidIds.length} max={INSTALLMENTS.length} label="Installments paid" />
        </div>
        <span className="shrink-0 text-caption-2-medium text-text-tertiary tabular-nums">{paidIds.length} of {INSTALLMENTS.length}</span>
      </div>

      <ul className="mt-0.5">
        {INSTALLMENTS.map((item) => {
          const isPaid = paidIds.includes(item.id);
          return (
            <li key={item.id} className="flex h-6 items-center gap-1.5 border-b border-separator-border last:border-b-0">
              <span aria-hidden className={cx("size-1.5 shrink-0 rounded-full transition-[background-color] duration-200 ease-out motion-reduce:transition-none", isPaid ? "bg-status-lime-text" : "bg-background-tertiary-default")} />
              <time dateTime={item.iso} className="min-w-0 flex-1 truncate text-caption-2-regular text-text-secondary">{item.due}</time>
              <span className={cx("shrink-0 text-caption-2-medium", isPaid ? "text-status-lime-text" : item.id === next?.id ? "text-text-primary" : "text-text-tertiary")}>
                {isPaid ? "Paid" : item.id === next?.id ? "Due" : "Scheduled"}
              </span>
              <span className="w-14 shrink-0 text-end text-caption-1-semibold text-text-primary tabular-nums">{usd.format(item.amount)}</span>
            </li>
          );
        })}
      </ul>

      <div className="mt-1.5 flex items-center gap-2">
        <span aria-live="polite" className="min-w-0 flex-1 truncate text-caption-2-regular text-text-tertiary">
          {next ? `${usd.format(paidTotal)} paid · next due ${next.due}` : "All four installments are paid."}
        </span>
        <button type="button" disabled={!next || paying} onClick={() => setPaying(true)} className={cx(primaryButton, "h-6 shrink-0 px-2 text-caption-2-semibold")}>
          {paying ? (
            <><RiLoader4Line className="size-3 animate-spin motion-reduce:animate-none" aria-hidden />Paying</>
          ) : next ? (
            `Pay ${usd.format(next.amount)}`
          ) : (
            <><RiCheckLine className="size-3" aria-hidden />Paid in full</>
          )}
        </button>
      </div>
    </section>
  );
}

/* 8. Notice banner */

export function NoticeBanner() {
  const panelId = useId();
  const respondRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLButtonElement>(null);
  const [dismissed, setDismissed] = useState(false);
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState<"yes" | "no" | null>(null);
  const [sent, setSent] = useState(false);
  const previousDismissed = useRef(dismissed);

  useEffect(() => {
    if (previousDismissed.current === dismissed) return;
    previousDismissed.current = dismissed;
    (dismissed ? restoreRef : respondRef).current?.focus();
  }, [dismissed]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      respondRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <section aria-label="Action required notice" className="w-full max-w-[320px]">
      <Reveal open={!dismissed} className="w-full">
        <div className={cx(cardSurface, "p-2.5")}>
          <div className="flex items-start gap-2">
            <span aria-hidden className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-status-yellow-background text-status-yellow-text">
              <RiAlertLine className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-caption-2-semibold tracking-wide text-status-yellow-text uppercase">Action required</span>
                <span className="rounded-full bg-status-yellow-background px-1.5 text-caption-2-medium text-status-yellow-text tabular-nums">4 days left</span>
              </div>
              <h3 className="text-body-2-semibold text-text-primary">Confirm your income by 9 Nov</h3>
            </div>
            <button type="button" aria-label="Dismiss notice" onClick={() => { setDismissed(true); setOpen(false); }} className={cx(iconButton, "-me-1 -mt-1")}>
              <RiCloseLine className="size-3.5" aria-hidden />
            </button>
          </div>

          <p className="mt-1 text-caption-2-regular text-text-secondary">Case BC-2417 is paused until we receive the signed income form.</p>

          <div className="mt-1.5 flex items-center gap-1.5">
            <button ref={respondRef} type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((current) => !current)} className={cx(open ? secondaryButton : primaryButton, "h-7 gap-1 px-2")}>
              {sent ? <RiCheckLine className="size-3.5" aria-hidden /> : <RiChat3Line className="size-3.5" aria-hidden />}
              {sent ? "Response sent" : open ? "Hide response" : "Respond"}
            </button>
            <span className="text-caption-2-regular text-text-tertiary">or call <span dir="ltr">217 555 0142</span></span>
          </div>

          <Reveal id={panelId} open={open}>
            <div className="mt-1.5 rounded-lg border border-separator-border bg-background-secondary-default p-2">
              {sent ? (
                <p aria-live="polite" className="flex items-center gap-1.5 text-caption-2-medium text-status-lime-text">
                  <RiShieldCheckLine className="size-3.5" aria-hidden />
                  Response received · ref NTF-3092
                </p>
              ) : (
                <>
                  <p className="text-caption-2-medium text-text-secondary">Did your income change in October?</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1">
                    <div role="group" aria-label="Income changed in October" className="flex gap-1">
                      <Choice pressed={answer === "yes"} onClick={() => setAnswer("yes")} className="px-2">Yes, it changed</Choice>
                      <Choice pressed={answer === "no"} onClick={() => setAnswer("no")} className="px-2">No change</Choice>
                    </div>
                    <button type="button" aria-label="Send response" disabled={!answer} onClick={() => setSent(true)} className={cx(primaryButton, "ms-auto h-6 px-2 text-caption-2-semibold")}>
                      Send
                    </button>
                  </div>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </Reveal>

      <Reveal open={dismissed} className="w-full">
        <button type="button" ref={restoreRef} onClick={() => setDismissed(false)} className={cx(quietButton, "w-full justify-center")}>
          <RiRefreshLine className="size-3.5" aria-hidden />
          Restore notice
        </button>
      </Reveal>
    </section>
  );
}

/* 9. Service finder */

const SERVICES = [
  { id: "housing", name: "Emergency housing", tags: "housing shelter rent eviction", wait: "Open now", place: "14 Marlow St", icon: RiHome4Line },
  { id: "food", name: "Food assistance", tags: "food groceries meals snap pantry", wait: "2 min", place: "88 Halden Rd", icon: RiHandHeartLine },
  { id: "childcare", name: "Childcare subsidy", tags: "childcare daycare children family", wait: "5 min", place: "2 Foundry Sq", icon: RiParentLine },
  { id: "transit", name: "Transit pass", tags: "transport bus travel ride fare", wait: "3 min", place: "City Hall", icon: RiBusLine },
  { id: "work", name: "Job support", tags: "job work employment training resume", wait: "1 day", place: "60 Ridge Ave", icon: RiBriefcaseLine },
] as const;

export function ServiceFinder() {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("food");
  const needle = query.trim().toLowerCase();
  const results = needle
    ? SERVICES.filter((service) => `${service.name} ${service.tags} ${service.place}`.toLowerCase().includes(needle))
    : SERVICES.slice(0, 3);
  const selectedService = results.some((service) => service.id === selected)
    ? SERVICES.find((service) => service.id === selected)
    : undefined;

  return (
    <section aria-label="Find a service" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <DemoHead icon={RiHandHeartLine} title="Find support" meta={`Springfield · ${Math.min(results.length, 3)} of ${SERVICES.length} services`} />

      <div className="relative mt-1.5">
        <RiSearchLine className="pointer-events-none absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-foreground-icon-tertiary" aria-hidden />
        <label htmlFor={searchId} className="sr-only">Search services by need</label>
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try “food” or “childcare”"
          className={cx(fieldClass, "ps-8 pe-8 [&::-webkit-search-cancel-button]:appearance-none")}
        />
        {query ? (
          <button
            type="button"
            aria-label="Clear service search"
            onClick={() => setQuery("")}
            className={cx(
              "absolute end-1 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-foreground-icon-tertiary",
              "transition-[background-color,color] duration-150 ease-out hover:bg-background-primary-hover hover:text-text-primary motion-reduce:transition-none",
              focusRing,
            )}
          >
            <RiCloseLine className="size-3.5" aria-hidden />
          </button>
        ) : null}
      </div>

      {results.length === 0 ? (
        <div className="mt-1 flex h-[72px] flex-col items-center justify-center gap-1 text-center">
          <p className="text-caption-1-medium text-text-secondary">No service matches “{query}”.</p>
          <p className="text-caption-2-regular text-text-tertiary">Try “food”, “housing” or “transit”.</p>
        </div>
      ) : (
        <ul className="mt-1 flex flex-col">
          {results.slice(0, 3).map((service) => {
            const Icon = service.icon;
            const active = selected === service.id;
            return (
              <li key={service.id}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelected(service.id)}
                  className={cx(
                    "flex h-6 w-full items-center gap-1.5 rounded-md px-1 text-start",
                    "transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
                    active ? "bg-background-secondary-default" : "hover:bg-background-secondary-default",
                    focusRing,
                  )}
                >
                  <Icon className={cx("size-3.5 shrink-0", active ? "text-accent-600" : "text-foreground-icon-tertiary")} aria-hidden />
                  <span className="min-w-0 flex-1 truncate text-caption-1-medium text-text-primary">{service.name}</span>
                  <span className="shrink-0 text-caption-2-regular text-text-tertiary">{service.wait}</span>
                  {active ? <RiCheckLine className="size-3 shrink-0 text-accent-600" aria-hidden /> : <RiArrowRightLine className="size-3 shrink-0 text-foreground-icon-tertiary rtl:-scale-x-100" aria-hidden />}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-1 flex items-center gap-1" aria-live="polite">
        <RiMapPin2Line className="size-3 shrink-0 text-foreground-icon-tertiary" aria-hidden />
        <span className="min-w-0 truncate text-caption-2-regular text-text-tertiary">
          {selectedService
            ? `${selectedService.name} · ${selectedService.place}`
            : results.length
              ? `${results.length} service${results.length === 1 ? "" : "s"} match your search.`
              : "No office matches that need."}
        </span>
      </div>
    </section>
  );
}

/* 10. ID upload */

const MAX_ID_BYTES = 5 * 1024 * 1024;
const ID_TYPES = ["image/jpeg", "image/png", "application/pdf"];

type IdFile = { name: string; size: number; kind: "image" | "pdf" };
type IdStatus = "empty" | "checking" | "ready";

function SampleIdPreview() {
  return (
    <span aria-hidden className="flex h-full w-full flex-col justify-center gap-0.5 bg-background-tertiary-default px-1.5">
      <span className="flex items-center gap-1">
        <span className="size-2.5 rounded-full bg-foreground-icon-tertiary" />
        <span className="h-0.5 w-5 rounded-full bg-foreground-icon-tertiary" />
      </span>
      <span className="h-0.5 w-full rounded-full bg-background-tertiary-hover" />
      <span className="h-0.5 w-3/4 rounded-full bg-background-tertiary-hover" />
      <span className="text-caption-2-semibold tracking-wide text-text-tertiary uppercase">Sample</span>
    </span>
  );
}

export function IdUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<IdFile | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<IdStatus>("empty");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "checking") return;
    const timer = window.setTimeout(() => setStatus("ready"), 900);
    return () => window.clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const choose = (next: File) => {
    setError(null);
    if (!ID_TYPES.includes(next.type)) return setError("Choose a JPG, PNG or PDF scan.");
    if (next.size > MAX_ID_BYTES) return setError(`${formatSize(next.size)} is over the 5 MB limit.`);
    setPreviewUrl(next.type === "application/pdf" ? null : URL.createObjectURL(next));
    setFile({ name: next.name, size: next.size, kind: next.type === "application/pdf" ? "pdf" : "image" });
    setStatus("checking");
  };

  const useSample = () => {
    setError(null);
    setPreviewUrl(null);
    setFile({ name: "id-front.jpg", size: 1_248_000, kind: "image" });
    setStatus("checking");
  };

  return (
    <section aria-label="Upload your photo ID" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <DemoHead icon={RiFileShield2Line} title="Photo ID" meta="Front of your ID · case BC-2417" trailing={<Pill tone="yellow">Required</Pill>} />

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,application/pdf"
        tabIndex={-1}
        aria-hidden="true"
        className="hidden"
        onChange={(event) => {
          const next = event.target.files?.[0];
          if (next) choose(next);
          event.target.value = "";
        }}
      />

      {file ? (
        <div className="mt-1.5">
          <div className="flex items-center gap-2 rounded-lg border border-border-button-default bg-background-secondary-default p-1.5">
            <span className="h-9 w-14 shrink-0 overflow-hidden rounded-sm border border-separator-border bg-background-primary-default">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt={`Preview of ${file.name}`} className="size-full object-cover" />
              ) : file.kind === "image" ? (
                <SampleIdPreview />
              ) : (
                <span className="flex size-full items-center justify-center text-foreground-icon-tertiary"><RiFilePdfLine className="size-5" aria-hidden /></span>
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-caption-1-semibold text-text-primary">{file.name}</p>
              <p aria-live="polite" className="truncate text-caption-2-regular text-text-tertiary">{formatSize(file.size)} · {status === "checking" ? "Checking scan…" : "Ready to submit"}</p>
            </div>
            {status === "checking" ? (
              <RiLoader4Line className="size-4 shrink-0 animate-spin text-foreground-icon-tertiary motion-reduce:animate-none" aria-hidden />
            ) : (
              <RiCheckLine className="size-4 shrink-0 text-status-lime-text" aria-hidden />
            )}
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <button type="button" onClick={() => { setFile(null); setPreviewUrl(null); setStatus("empty"); setError(null); if (inputRef.current) inputRef.current.value = ""; }} className={cx(quietButton, "h-6 px-1.5 text-caption-2-semibold")}>
              Remove
            </button>
            <button type="button" disabled={status === "checking"} onClick={() => inputRef.current?.click()} className={cx(secondaryButton, "h-6 px-2 text-caption-2-semibold")}>
              Replace file
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-1.5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={cx(
              "flex w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border-button-default bg-background-secondary-default px-2 py-3 text-center",
              "transition-[background-color,border-color] duration-150 ease-out hover:border-border-button-hover hover:bg-background-secondary-hover motion-reduce:transition-none",
              focusRing,
            )}
          >
            <RiUploadCloud2Line className="size-4 text-foreground-icon-tertiary" aria-hidden />
            <span className="text-caption-1-semibold text-text-primary">Upload the front of your ID</span>
            <span className="text-caption-2-regular text-text-tertiary">JPG, PNG or PDF · up to 5 MB</span>
          </button>
          <div className="mt-1 flex items-center justify-between gap-2">
            <span role={error ? "alert" : undefined} className={cx("min-w-0 truncate text-caption-2-regular", error ? "text-text-error-primary" : "text-text-tertiary")}>
              {error ?? "No scan handy?"}
            </span>
            <button type="button" onClick={useSample} className={cx(quietButton, "h-6 px-1.5 text-caption-2-semibold")}>Use sample scan</button>
          </div>
        </div>
      )}

      {file && error ? <p role="alert" className="mt-1 text-caption-2-regular text-text-error-primary">{error}</p> : null}
    </section>
  );
}

/* 11. Eligibility check */

const ELIGIBILITY_QUESTIONS = [
  { id: "resident", question: "Do you live in Springfield?", hint: "Temporary housing counts." },
  { id: "income", question: "Is your household income under $2,400?", hint: "Before tax, all adults, per month." },
  { id: "child", question: "Is there a child under 5 at home?", hint: "On 1 November 2026." },
] as const;

type QuestionId = (typeof ELIGIBILITY_QUESTIONS)[number]["id"];
type Answers = Record<QuestionId, boolean | null>;

export function EligibilityCheck() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ resident: null, income: null, child: null });
  const [done, setDone] = useState(false);
  const question = ELIGIBILITY_QUESTIONS[step];
  const answer = answers[question.id];
  const eligible = answers.resident === true && (answers.income === true || answers.child === true);

  const next = () => {
    if (answer === null) return;
    if (step === ELIGIBILITY_QUESTIONS.length - 1) setDone(true);
    else setStep((current) => current + 1);
  };

  return (
    <section aria-label="Check your eligibility" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <DemoHead icon={RiShieldCheckLine} title="Check eligibility" meta="Housing support · 3 questions · 1 minute" />

      <div className="mt-1.5">
        <Meter value={done ? 3 : step + 1} max={3} label="Eligibility questions answered" />
      </div>

      {done ? (
        <div aria-live="polite" className="animate-label-in motion-reduce:animate-none">
          <div className={cx("mt-1.5 flex items-start gap-2 rounded-lg p-2", eligible ? "bg-status-lime-background" : "bg-status-yellow-background")}>
            <span className={cx("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-background-primary-default", eligible ? "bg-status-lime-text" : "bg-status-yellow-text")} aria-hidden>
              {eligible ? <RiCheckLine className="size-3" /> : <RiInformationLine className="size-3" />}
            </span>
            <div className="min-w-0">
              <p className={cx("text-caption-1-semibold", eligible ? "text-status-lime-text" : "text-status-yellow-text")}>
                {eligible ? "Likely eligible" : "Not eligible on these answers"}
              </p>
              <p className="text-caption-2-regular text-text-secondary">
                {eligible ? `Up to ${usdWhole.format(1284)} a month toward rent.` : "Food and transit support may still apply."}
              </p>
            </div>
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <span className="min-w-0 truncate text-caption-2-regular text-text-tertiary">
              {eligible ? "Next: gather proof of income." : "You can change an answer."}
            </span>
            <button type="button" onClick={() => { setDone(false); setStep(0); }} className={cx(secondaryButton, "h-6 shrink-0 px-2 text-caption-2-semibold")}>
              <RiArrowLeftLine className="size-3 rtl:-scale-x-100" aria-hidden />
              Edit answers
            </button>
          </div>
        </div>
      ) : (
        <>
          <div key={step} aria-live="polite" className="mt-1.5 animate-label-in motion-reduce:animate-none">
            <p className="text-caption-2-medium text-text-tertiary tabular-nums">Question {step + 1} of 3</p>
            <p className="mt-0.5 text-body-2-semibold text-text-primary">{question.question}</p>
            <p className="text-caption-2-regular text-text-tertiary">{question.hint}</p>
          </div>

          <div role="group" aria-label={question.question} className="mt-1.5 grid grid-cols-2 gap-1">
            <Choice pressed={answer === true} onClick={() => setAnswers((current) => ({ ...current, [question.id]: true }))}>Yes</Choice>
            <Choice pressed={answer === false} onClick={() => setAnswers((current) => ({ ...current, [question.id]: false }))}>No</Choice>
          </div>

          <div className="mt-1.5 flex items-center justify-between gap-2">
            <button type="button" disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))} className={cx(quietButton, "h-7 gap-1")}>
              <RiArrowLeftLine className="size-3 rtl:-scale-x-100" aria-hidden />
              Back
            </button>
            <button type="button" disabled={answer === null} onClick={next} className={cx(primaryButton, "h-7 gap-1 px-2")}>
              {step === 2 ? "See result" : "Next"}
              <RiArrowRightLine className="size-3 rtl:-scale-x-100" aria-hidden />
            </button>
          </div>
        </>
      )}
    </section>
  );
}

/* 12. Case timeline */

const TIMELINE = [
  { id: "received", date: "3 Nov", time: "09:14", iso: "2026-11-03T09:14", title: "Application received", actor: "You", tone: "lime" as Tone, icon: RiCheckLine, note: "Form BC-2417 arrived with two attachments. Nothing else is needed from you today." },
  { id: "review", date: "5 Nov", time: "10:05", iso: "2026-11-05T10:05", title: "Review started", actor: "Priya Raman", tone: "blue" as Tone, icon: RiSearchLine, note: "Income check is under way. Priya will request the signed lease if it is missing." },
  { id: "decision", date: "12 Nov", time: "Due", iso: "2026-11-12", title: "Decision due", actor: "Pending", tone: "neutral" as Tone, icon: RiTimeLine, note: "A decision letter and a message will arrive here by the end of the day." },
] as const;

export function CaseTimeline() {
  const baseId = useId();
  const [expanded, setExpanded] = useState<string | null>("review");

  return (
    <section aria-label="Case BC-2417 timeline" className={cx(cardSurface, "max-w-[520px] p-2.5")}>
      <DemoHead icon={RiHistoryLine} title="Case timeline" meta="BC-2417 · 2026 · Housing support" trailing={<Pill tone="blue">Updated 5 Nov</Pill>} />

      <ol className="mt-1.5 flex flex-col">
        {TIMELINE.map((event, index) => {
          const Icon = event.icon;
          const open = expanded === event.id;
          return (
            <li key={event.id} className="flex gap-2">
              <div className="flex w-14 shrink-0 flex-col items-end pt-0.5 text-end">
                <time dateTime={event.iso} className="whitespace-nowrap text-caption-2-semibold text-text-secondary">{event.date}</time>
                <span className="text-caption-2-regular text-text-tertiary">{event.time}</span>
              </div>
              <div className="relative flex w-4 shrink-0 flex-col items-center">
                <span className={cx("mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full", TONES[event.tone])}>
                  <Icon className="size-2.5" aria-hidden />
                </span>
                {index < TIMELINE.length - 1 && <span aria-hidden className="absolute top-5 bottom-0 w-px bg-separator-border" />}
              </div>
              <div className="min-w-0 flex-1 pb-1.5">
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`${baseId}-${event.id}`}
                  onClick={() => setExpanded(open ? null : event.id)}
                  className={cx("flex h-5 w-full items-center gap-1.5 rounded-sm text-start", focusRing)}
                >
                  <span className="min-w-0 flex-1 truncate text-caption-1-semibold text-text-primary">{event.title}</span>
                  <span className="flex shrink-0 items-center gap-1 text-caption-2-regular text-text-tertiary">
                    <RiUserLine className="size-2.5" aria-hidden />
                    <span className="max-w-[88px] truncate">{event.actor}</span>
                  </span>
                  <RiArrowDownSLine className={cx("size-3 shrink-0 text-foreground-icon-tertiary transition-transform duration-200 ease-out motion-reduce:transition-none", open && "rotate-180")} aria-hidden />
                </button>
                <Reveal id={`${baseId}-${event.id}`} open={open}>
                  <p className="pt-0.5 text-caption-2-regular text-text-secondary">{event.note}</p>
                </Reveal>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* Specimens */

export const PUBLIC_SERVICES_SECTION: ExtendedSection = {
  id: "public-services",
  title: "Public services",
  blurb: "Cases, forms and the steps between a person and a benefit.",
  file: "public-services.tsx",
  entries: [
    { name: "Case Status", description: "A case number, its four stages and the one thing due next.", Demo: CaseStatus },
    { name: "Form Wizard", description: "Three steps with a live progress bar, back and next.", Demo: FormWizard },
    { name: "Document Checklist", description: "Required documents move from missing to ready as they upload.", Demo: DocumentChecklist },
    { name: "Appointment Booking", description: "Pick an office, a date and a time; the confirmation holds the details.", Demo: AppointmentBooking },
    { name: "Benefit Card", description: "Amount, frequency and next payment with a payment history.", Demo: BenefitCard },
    { name: "Address Change", description: "Old and new address, validation and a dated confirmation.", Demo: AddressChange },
    { name: "Payment Plan", description: "Four dated installments that pay down one at a time.", Demo: PaymentPlan },
    { name: "Notice Banner", description: "An action-required notice with a deadline and an inline response.", Demo: NoticeBanner },
    { name: "Service Finder", description: "Search local services by need and pick the nearest office.", Demo: ServiceFinder },
    { name: "ID Upload", description: "File validation, a scan preview and a sample for the demo.", Demo: IdUpload },
    { name: "Eligibility Check", description: "Three questions, then a result with an edit path.", Demo: EligibilityCheck },
    { name: "Case Timeline", description: "Dated case events with actors and expandable notes.", Demo: CaseTimeline, wide: true },
  ],
};
