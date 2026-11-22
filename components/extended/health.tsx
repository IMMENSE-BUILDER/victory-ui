"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import {
  RiAlertLine,
  RiArrowDownLine,
  RiArrowDownSLine,
  RiCalendarCheckLine,
  RiCalendarCloseLine,
  RiCalendarEventLine,
  RiCameraLine,
  RiCapsuleLine,
  RiCheckLine,
  RiCloseLine,
  RiDonutChartLine,
  RiErrorWarningLine,
  RiFileCopyLine,
  RiFileTextLine,
  RiFlaskLine,
  RiHeartPulseLine,
  RiLoader4Line,
  RiLockLine,
  RiMapPin2Line,
  RiMedicineBottleLine,
  RiMessage3Line,
  RiMicLine,
  RiPulseLine,
  RiRefreshLine,
  RiSendPlaneLine,
  RiShieldCheckLine,
  RiStethoscopeLine,
  RiTeamLine,
  RiVideoChatLine,
  RiWifiLine,
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
const mutedNote = "text-caption-2-regular text-text-tertiary";
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
const dangerButton = cx(buttonBase, "h-8 bg-button-danger px-2.5 text-text-white shadow-xs", focusRing);
const quietButton = cx(buttonBase, "h-7 px-1.5 text-text-secondary hover:bg-background-secondary-default hover:text-text-primary", focusRing);
const iconButton = cx(
  "flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-icon-tertiary",
  "transition-[background-color,color] duration-150 ease-out hover:bg-background-tertiary-default hover:text-text-primary",
  "motion-reduce:transition-none",
  focusRing,
);
const actionButton = cx(
  "flex size-6 shrink-0 items-center justify-center rounded-md",
  "transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
  focusRing,
);
const tileBase =
  "rounded-lg border text-start transition-[background-color,border-color,box-shadow] " +
  "duration-150 ease-out motion-reduce:transition-none";
const tileOn = "border-accent-500 bg-background-secondary-default shadow-xs";
const tileOff = "border-border-button-default hover:bg-background-primary-hover";
const chipBase =
  "rounded-full border px-1.5 py-0.5 text-caption-2-medium " +
  "transition-[background-color,border-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none";
const revealGrid = "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none";
const sheet = "absolute inset-0 z-10 flex animate-label-in flex-col rounded-xl bg-background-primary-default p-2.5 motion-reduce:animate-none";

const TONES = {
  lime: "bg-status-lime-background text-status-lime-text",
  yellow: "bg-status-yellow-background text-status-yellow-text",
  orange: "bg-status-orange-background text-status-orange-text",
  rose: "bg-status-rose-background text-status-rose-text",
  blue: "bg-status-blue-background text-status-blue-text",
  purple: "bg-status-purple-background text-status-purple-text",
  neutral: "bg-background-tertiary-default text-text-secondary",
} as const;

type Tone = keyof typeof TONES;

function Badge({ tone = "neutral", icon: Icon, children, className }: {
  tone?: Tone;
  icon?: IconComponent;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cx("inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-caption-2-medium", TONES[tone], className)}>
      {Icon ? <Icon className="size-3" aria-hidden /> : null}
      {children}
    </span>
  );
}

function Avatar({ initials, tone = "blue", size = "md" }: { initials: string; tone?: Tone; size?: "sm" | "md" }) {
  return (
    <span
      aria-hidden
      className={cx("flex shrink-0 items-center justify-center rounded-full text-caption-2-semibold", TONES[tone], size === "sm" ? "size-6" : "size-8")}
    >
      {initials}
    </span>
  );
}

function CardHead({ icon: Icon, title, meta, tone = "neutral", trailing }: {
  icon: IconComponent;
  title: string;
  meta?: string;
  tone?: Tone;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <span aria-hidden className={cx("flex size-7 shrink-0 items-center justify-center rounded-lg", TONES[tone])}>
        <Icon className="size-3.5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-body-2-semibold text-text-primary">{title}</h3>
        {meta ? <p className={cx("truncate", mutedNote)}>{meta}</p> : null}
      </div>
      {trailing}
    </div>
  );
}

/* 1. Vitals Row */

const VITALS = [
  { id: "bp", label: "Blood pressure", value: "118/76", unit: "mmHg", range: "Below 120/80", status: "Optimal", marker: 78, trend: "Steady for 6 weeks" },
  { id: "hr", label: "Heart rate", value: "64", unit: "bpm", range: "60–100", status: "Resting", marker: 20, trend: "3 bpm lower than last week" },
  { id: "temp", label: "Temperature", value: "98.4", unit: "°F", range: "97.0–99.0", status: "Normal", marker: 70, trend: "No fever in 6 readings" },
  { id: "weight", label: "Weight", value: "154.2", unit: "lb", range: "150–160", status: "Steady", marker: 42, trend: "1.8 lb below August" },
] as const;

type VitalId = (typeof VITALS)[number]["id"];

export function VitalsRow() {
  const [selected, setSelected] = useState<VitalId>("bp");
  const vital = VITALS.find((item) => item.id === selected) ?? VITALS[0];

  return (
    <section aria-label="Latest vitals" className={cx(cardSurface, "max-w-[600px] p-2.5")}>
      <CardHead icon={RiHeartPulseLine} title="Vitals" meta="Last reading today, 8:42 AM" tone="rose"
        trailing={<Badge tone="lime" icon={RiCheckLine}>4 in range</Badge>} />

      <div role="group" aria-label="Choose a vital" className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {VITALS.map((item) => {
          const active = item.id === selected;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => setSelected(item.id)}
              className={cx(tileBase, "px-1.5 py-1.5", focusRing, active ? tileOn : tileOff)}
            >
              <span className={cx("block truncate", mutedNote)}>{item.label}</span>
              <span className="mt-0.5 flex items-baseline gap-0.5">
                <span className="text-title-3-semibold text-text-primary tabular-nums">{item.value}</span>
                <span className={mutedNote}>{item.unit}</span>
              </span>
              <span className={cx("mt-0.5 block truncate", mutedNote)}>
                {item.range} {item.unit}
              </span>
              <span aria-hidden className="relative mt-1 block h-1 rounded-full bg-background-tertiary-default">
                <span
                  className={cx(
                    "absolute inset-y-0 start-0 rounded-full transition-[width,background-color] duration-200 ease-out motion-reduce:transition-none",
                    active ? "bg-accent-500" : "bg-accent-500/40",
                  )}
                  style={{ width: `${item.marker}%` }}
                />
              </span>
            </button>
          );
        })}
      </div>

      <p
        key={selected}
        aria-live="polite"
        className={cx("mt-1.5 flex animate-label-in items-center gap-1 truncate motion-reduce:animate-none", mutedNote)}
      >
        <span className="shrink-0 text-status-lime-text">{vital.status}</span>
        <span aria-hidden>·</span>
        <span className="truncate">{vital.trend}</span>
      </p>
    </section>
  );
}

/* 2. Medication Schedule */

const MEDICATIONS = [
  { id: "lisinopril", name: "Lisinopril", dose: "10 mg", time: "8:00 AM" },
  { id: "metformin", name: "Metformin", dose: "500 mg", time: "12:30 PM" },
  { id: "atorvastatin", name: "Atorvastatin", dose: "20 mg", time: "8:00 PM" },
] as const;

type MedId = (typeof MEDICATIONS)[number]["id"];
type DoseState = "taken" | "skipped" | "due";

const INITIAL_DOSES: Record<MedId, DoseState> = { lisinopril: "taken", metformin: "taken", atorvastatin: "due" };

export function MedicationSchedule() {
  const [doses, setDoses] = useState<Record<MedId, DoseState>>(INITIAL_DOSES);
  const taken = MEDICATIONS.filter((med) => doses[med.id] === "taken").length;
  const remaining = MEDICATIONS.filter((med) => doses[med.id] === "due").length;
  const setDose = (id: MedId, value: DoseState) =>
    setDoses((current) => {
      const next = { ...current };
      next[id] = value;
      return next;
    });

  return (
    <section aria-label="Today’s medication schedule" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <CardHead icon={RiCapsuleLine} title="Today’s medications" meta="Thu, Nov 5 · 3 doses" tone="blue"
        trailing={<Badge tone={remaining === 0 ? "lime" : "neutral"}>{remaining} left</Badge>} />
      <div
        role="progressbar"
        aria-label="Doses taken"
        aria-valuemin={0}
        aria-valuemax={MEDICATIONS.length}
        aria-valuenow={taken}
        className="mt-1.5 h-1 overflow-hidden rounded-full bg-background-tertiary-default"
      >
        <div
          className="h-full rounded-full bg-accent-500 transition-[width] duration-200 ease-out motion-reduce:transition-none"
          style={{ width: `${(taken / MEDICATIONS.length) * 100}%` }}
        />
      </div>

      <ul className="mt-1">
        {MEDICATIONS.map((med) => {
          const state = doses[med.id];
          return (
            <li key={med.id} className="flex h-7 items-center gap-1 border-b border-separator-border last:border-b-0">
              <time className="w-11 shrink-0 text-caption-2-medium text-text-tertiary tabular-nums">{med.time}</time>
              <span
                className={cx(
                  "min-w-0 flex-1 truncate text-caption-1-semibold transition-[color] duration-150 ease-out motion-reduce:transition-none",
                  state === "skipped" ? "text-text-tertiary line-through" : "text-text-primary",
                )}
              >
                {med.name} <span className="text-caption-2-regular text-text-tertiary">{med.dose}</span>
              </span>
              <span
                className={cx(
                  "w-10 shrink-0 text-end text-caption-2-medium",
                  state === "taken" ? "text-status-lime-text" : state === "skipped" ? "text-status-rose-text" : "text-text-tertiary",
                )}
              >
                {state === "taken" ? "Taken" : state === "skipped" ? "Skipped" : "Due"}
              </span>
              <button
                type="button"
                aria-label={`Mark ${med.name} as taken`}
                aria-pressed={state === "taken"}
                onClick={() => setDose(med.id, state === "taken" ? "due" : "taken")}
                className={cx(
                  actionButton,
                  state === "taken"
                    ? "bg-status-lime-background text-status-lime-text"
                    : "text-foreground-icon-tertiary hover:bg-background-tertiary-default hover:text-text-primary",
                )}
              >
                <RiCheckLine className="size-3.5" aria-hidden />
              </button>
              <button
                type="button"
                aria-label={`Skip ${med.name} today`}
                aria-pressed={state === "skipped"}
                onClick={() => setDose(med.id, state === "skipped" ? "due" : "skipped")}
                className={cx(
                  actionButton,
                  state === "skipped"
                    ? "bg-status-rose-background text-status-rose-text"
                    : "text-foreground-icon-tertiary hover:bg-background-tertiary-default hover:text-text-primary",
                )}
              >
                <RiCloseLine className="size-3.5" aria-hidden />
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span aria-live="polite" className={cx("min-w-0 truncate", mutedNote)}>
          {remaining === 0 ? "All doses logged today." : `${remaining} dose${remaining === 1 ? "" : "s"} left today`}
        </span>
        <button type="button" onClick={() => setDoses(INITIAL_DOSES)} className={quietButton}>
          <RiRefreshLine className="size-3" aria-hidden />
          Reset
        </button>
      </div>
    </section>
  );
}

/* 3. Appointment Card */

const TIME_SLOTS = [
  { id: "fri", day: "Fri", month: "Nov", date: "13", time: "9:15 AM" },
  { id: "mon", day: "Mon", month: "Nov", date: "16", time: "11:00 AM" },
  { id: "tue", day: "Tue", month: "Nov", date: "17", time: "3:45 PM" },
] as const;

const CURRENT_VISIT = { day: "Thu", month: "Nov", date: "12", time: "2:30 PM" };
type Panel = "none" | "reschedule" | "cancel";

export function AppointmentCard() {
  const [appointment, setAppointment] = useState(CURRENT_VISIT);
  const [panel, setPanel] = useState<Panel>("none");
  const [pendingId, setPendingId] = useState<(typeof TIME_SLOTS)[number]["id"]>("fri");
  const [cancelled, setCancelled] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const rescheduled = appointment.day !== CURRENT_VISIT.day || appointment.time !== CURRENT_VISIT.time;
  const pending = TIME_SLOTS.find((slot) => slot.id === pendingId) ?? TIME_SLOTS[0];

  return (
    <section
      aria-label="Upcoming appointment"
      className={cx(cardSurface, "relative max-w-[320px] p-2.5")}
      onKeyDown={(event) => {
        if (event.key === "Escape" && panel !== "none") {
          event.stopPropagation();
          setPanel("none");
        }
      }}
    >
      <CardHead icon={RiCalendarEventLine} title="Cardiology follow-up" tone="blue"
        meta="Northside Medical Pavilion"
        trailing={<Badge tone={cancelled ? "rose" : "blue"}>{cancelled ? "Cancelled" : rescheduled ? "New time" : "In 7 days"}</Badge>} />

      {cancelled ? (
        <div className="mt-2 rounded-lg bg-background-secondary-default p-2">
          <p className="flex items-center gap-1.5 text-caption-1-semibold text-text-primary">
            <RiCalendarCloseLine className="size-3.5 text-status-rose-text" aria-hidden />
            Visit cancelled · no fee
          </p>
          <p className={cx("mt-0.5", mutedNote)}>Next opening: Nov 19 at 10:20 AM.</p>
          <button type="button" onClick={() => { setCancelled(false); setPendingId(TIME_SLOTS[0].id); setPanel("reschedule"); }}
            className={cx(primaryButton, "mt-1.5 h-7 w-full")}>
            <RiCalendarCheckLine className="size-3.5" aria-hidden />
            Book a new visit
          </button>
        </div>
      ) : (
        <>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex size-11 shrink-0 flex-col items-center justify-center rounded-lg bg-background-secondary-default">
              <span className="text-caption-2-semibold tracking-wide text-text-secondary uppercase">{appointment.month}</span>
              <span className="text-title-3-semibold text-text-primary tabular-nums">{appointment.date}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-body-2-semibold text-text-primary">{appointment.day} · {appointment.time}</p>
              <p className={cx("flex items-center gap-1 truncate", mutedNote)}>
                <RiStethoscopeLine className="size-3 shrink-0" aria-hidden />
                Dr. Elena Vasquez, MD · 20 min
              </p>
              <p className={cx("flex items-center gap-1 truncate", mutedNote)}>
                <RiMapPin2Line className="size-3 shrink-0" aria-hidden />
                Suite 410 · Bring your medication list
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <button type="button" onClick={() => { setPendingId(TIME_SLOTS[0].id); setPanel("reschedule"); setNotice(null); }}
              className={cx(secondaryButton, "h-7 flex-1")}>
              <RiCalendarCheckLine className="size-3.5" aria-hidden />
              Reschedule
            </button>
            <button type="button" onClick={() => { setPanel("cancel"); setNotice(null); }} className={cx(quietButton, "h-7")}>
              Cancel
            </button>
          </div>
          <p aria-live="polite" className={cx("mt-1.5 min-h-4", mutedNote)}>
            {notice ?? "Free cancellation until Nov 10."}
          </p>
        </>
      )}

      {panel === "reschedule" ? (
        <div role="dialog" aria-label="Choose a new appointment time" className={sheet}>
          <div className="flex items-baseline justify-between gap-2">
            <h4 className="min-w-0 truncate text-caption-1-semibold text-text-primary">Pick a new time</h4>
            <span className={mutedNote}>Nov 2026</span>
          </div>
          <div role="group" aria-label="Available appointment times" className="mt-2 grid grid-cols-3 gap-1.5">
            {TIME_SLOTS.map((slot) => {
              const active = slot.id === pendingId;
              return (
                <button key={slot.id} type="button" aria-pressed={active} onClick={() => setPendingId(slot.id)}
                  className={cx(tileBase, "px-1.5 py-1", focusRing, active ? tileOn : tileOff)}>
                  <span className={cx("block", mutedNote)}>{slot.day}</span>
                  <span className="block text-caption-1-semibold text-text-primary">{slot.month} {slot.date}</span>
                  <span className={cx("block tabular-nums", mutedNote)}>{slot.time}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-auto flex items-center gap-1.5">
            <button type="button" onClick={() => setPanel("none")} className={cx(quietButton, "flex-1")}>Keep current</button>
            <button type="button" className={cx(primaryButton, "h-7 flex-1")}
              onClick={() => { setAppointment({ ...pending }); setPanel("none"); setNotice(`Confirmed for ${pending.day}, ${pending.month} ${pending.date} at ${pending.time}.`); }}>
              Confirm {pending.day}
            </button>
          </div>
        </div>
      ) : null}

      {panel === "cancel" ? (
        <div role="dialog" aria-label="Cancel this appointment" className={sheet}>
          <div className="flex items-center gap-2">
            <span aria-hidden className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-status-rose-background text-status-rose-text">
              <RiErrorWarningLine className="size-4" aria-hidden />
            </span>
            <h4 className="min-w-0 flex-1 text-caption-1-semibold text-text-primary">Cancel this visit?</h4>
          </div>
          <p className={cx("mt-1.5", mutedNote)}>Next opening: Nov 19 at 10:20 AM. No cancellation fee.</p>
          <div className="mt-auto flex items-center gap-1.5">
            <button type="button" onClick={() => setPanel("none")} className={cx(secondaryButton, "h-7 flex-1")}>Keep visit</button>
            <button type="button" onClick={() => { setCancelled(true); setPanel("none"); }} className={cx(dangerButton, "h-7 flex-1")}>
              Yes, cancel
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

/* 4. Lab Result */

const A1C_TREND = [5.9, 5.8, 5.8, 5.7, 5.6] as const;
const A1C_POINTS = A1C_TREND.map((value, index) => `${2 + index * 16},${24 - (value - 5.4) * 40}`).join(" ");

export function LabResult() {
  const id = useId();
  const [open, setOpen] = useState(false);

  return (
    <section aria-label="Lab result" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <CardHead icon={RiFlaskLine} title="Hemoglobin A1c" meta="Collected Oct 28 · Dr. Patel" tone="lime"
        trailing={<Badge tone="lime" icon={RiCheckLine}>In range</Badge>} />

      <div className="mt-2 flex items-end justify-between gap-2">
        <div>
          <p className="flex items-baseline gap-0.5">
            <span className="text-title-1-semibold text-text-primary tabular-nums">5.6</span>
            <span className="text-caption-1-medium text-text-tertiary">%</span>
          </p>
          <p className="text-caption-2-medium text-status-lime-text">No action needed</p>
        </div>
        <div className="shrink-0 text-end">
          <svg width="68" height="26" viewBox="0 0 68 26" aria-hidden className="text-chart-3">
            <polyline points={A1C_POINTS} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="66" cy="16" r="2.5" fill="currentColor" />
          </svg>
          <p className="flex items-center justify-end gap-0.5 text-caption-2-medium text-status-lime-text">
            <RiArrowDownLine className="size-3" aria-hidden />
            0.3 since May
          </p>
        </div>
      </div>

      <div className="mt-2 rounded-lg bg-background-secondary-default px-2 py-1">
        <div className={cx("flex items-center justify-between gap-2", mutedNote)}>
          <span>Reference 4.0–5.6%</span>
          <span>Final result</span>
        </div>
        <div aria-hidden className="relative mt-1 h-1.5 rounded-full bg-background-tertiary-default">
          <span className="absolute inset-y-0 start-0 w-[92%] rounded-full bg-accent-500" />
          <span className="absolute top-1/2 end-[8%] size-3 -translate-y-1/2 rounded-full border-2 border-background-primary-default bg-accent-600" />
        </div>
      </div>

      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((current) => !current)}
        className={cx(quietButton, "mt-1.5 h-6 w-full justify-between ps-0 pe-0")}
      >
        What this means
        <RiArrowDownSLine
          className={cx("size-3.5 text-foreground-icon-tertiary transition-[transform] duration-200 ease-out motion-reduce:transition-none", open && "rotate-180")}
          aria-hidden
        />
      </button>
      <div id={id} inert={!open} className={cx(revealGrid, open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
        <div className="min-h-0 overflow-hidden">
          <p className="pb-0.5 text-caption-2-regular text-text-secondary">
            A1c measures average blood sugar over three months. 5.6% sits at the upper edge of the healthy
            range, so we will recheck in six months.
          </p>
        </div>
      </div>
    </section>
  );
}

/* 5. Symptom Log */

const SYMPTOMS = ["Headache", "Fatigue", "Nausea", "Dizziness"] as const;
type Symptom = (typeof SYMPTOMS)[number];
type SaveStatus = "idle" | "saving" | "saved";

function severityLabel(value: number) {
  return value <= 3 ? "Mild" : value <= 6 ? "Moderate" : "Severe";
}

export function SymptomLog() {
  const noteId = useId();
  const [severity, setSeverity] = useState(4);
  const [symptoms, setSymptoms] = useState<Symptom[]>(["Headache"]);
  const [note, setNote] = useState("Pressing ache behind my eyes since 1 PM.");
  const [status, setStatus] = useState<SaveStatus>("idle");
  const label = severityLabel(severity);

  useEffect(() => {
    if (status !== "saving") return;
    const timer = window.setTimeout(() => setStatus("saved"), 700);
    return () => window.clearTimeout(timer);
  }, [status]);

  const edit = (apply: () => void) => {
    apply();
    if (status === "saved") setStatus("idle");
  };

  return (
    <section aria-label="Log a symptom" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <CardHead icon={RiPulseLine} title="Symptom log" meta="Thu, Nov 5 · Visible to Dr. Patel" tone="orange"
        trailing={<Badge tone={status === "saved" ? "lime" : "neutral"}>{status === "saved" ? "Logged" : "Draft"}</Badge>} />

      <div className="mt-1.5 flex items-center gap-2">
        <span className="shrink-0 text-caption-2-medium text-text-secondary">Severity</span>
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={severity}
          aria-label="Symptom severity"
          aria-valuetext={`${severity} of 10, ${label}`}
          onChange={(event) => edit(() => setSeverity(Number(event.target.value)))}
          className="h-5 min-w-0 flex-1 cursor-pointer accent-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        />
        <span className="w-16 shrink-0 text-end text-caption-2-semibold text-text-primary tabular-nums">
          {severity}/10 · {label}
        </span>
      </div>

      <div role="group" aria-label="Symptoms" className="mt-1.5 flex flex-wrap gap-1">
        {SYMPTOMS.map((symptom) => {
          const active = symptoms.includes(symptom);
          return (
            <button
              key={symptom}
              type="button"
              aria-pressed={active}
              onClick={() =>
                edit(() =>
                  setSymptoms((current) =>
                    current.includes(symptom) ? current.filter((item) => item !== symptom) : [...current, symptom],
                  ),
                )
              }
              className={cx(chipBase, focusRing, active ? "border-accent-600 bg-accent-600 text-text-white" : "border-border-button-default text-text-secondary hover:bg-background-secondary-default")}
            >
              {symptom}
            </button>
          );
        })}
      </div>

      <label htmlFor={noteId} className="sr-only">Note</label>
      <textarea
        id={noteId}
        rows={2}
        value={note}
        placeholder="What did it feel like?"
        onChange={(event) => edit(() => setNote(event.target.value))}
        className={cx(
          "mt-1.5 h-10 w-full resize-none rounded-lg bg-background-tertiary-default px-2 py-1",
          "text-caption-1-regular text-text-primary outline-none placeholder:text-text-placeholder",
          focusRing,
        )}
      />

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span
          key={status}
          role="status"
          className={cx(
            "min-w-0 animate-label-in truncate text-caption-2-regular motion-reduce:animate-none",
            status === "saved" ? "text-status-lime-text" : "text-text-tertiary",
          )}
        >
          {status === "saving"
            ? "Saving entry…"
            : status === "saved"
              ? "Saved just now · 2:14 PM"
              : symptoms.length === 0
                ? "Pick at least one symptom."
                : "Only your care team can see this."}
        </span>
        <button
          type="button"
          onClick={() => setStatus("saving")}
          disabled={symptoms.length === 0 || status === "saving"}
          className={cx(primaryButton, "h-7 shrink-0")}
        >
          {status === "saving" ? <RiLoader4Line className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden /> : status === "saved" ? <RiCheckLine className="size-3.5" aria-hidden /> : null}
          {status === "saving" ? "Saving" : status === "saved" ? "Saved" : "Save entry"}
        </button>
      </div>
    </section>
  );
}

/* 6. Care Team */

const CARE_TEAM = [
  { id: "vasquez", name: "Dr. Elena Vasquez", short: "Dr. Vasquez", role: "Cardiologist", initials: "EV", tone: "blue", detail: "Replies in about 1 day" },
  { id: "patel", name: "Dr. Marcus Patel", short: "Dr. Patel", role: "Primary care", initials: "MP", tone: "purple", detail: "Same-day messages" },
  { id: "ramirez", name: "Sofia Ramirez, RN", short: "Sofia", role: "Care coordinator", initials: "SR", tone: "lime", detail: "Weekdays, 8 AM–5 PM" },
] as const;

type MemberId = (typeof CARE_TEAM)[number]["id"];

export function CareTeam() {
  const messageId = useId();
  const [openId, setOpenId] = useState<MemberId | null>(null);
  const [draft, setDraft] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const member = CARE_TEAM.find((person) => person.id === openId);

  useEffect(() => {
    if (openId) composerRef.current?.focus();
  }, [openId]);

  const close = () => {
    setOpenId(null);
    openerRef.current?.focus();
  };
  const send = () => {
    if (!member || !draft.trim()) return;
    setSentTo(member.name);
    setDraft("");
    setOpenId(null);
    openerRef.current?.focus();
  };

  return (
    <section
      aria-label="Your care team"
      className={cx(cardSurface, "relative max-w-[320px] p-2.5")}
      onKeyDown={(event) => {
        if (event.key === "Escape" && member) {
          event.stopPropagation();
          close();
        }
      }}
    >
      <CardHead icon={RiTeamLine} title="Care team" meta="3 people · Secure messages" tone="purple"
        trailing={<Badge tone="neutral">Northside</Badge>} />

      <ul className="mt-1.5">
        {CARE_TEAM.map((person) => (
          <li key={person.id} className="flex h-8 items-center gap-1.5 border-b border-separator-border last:border-b-0">
            <Avatar initials={person.initials} tone={person.tone} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-caption-1-semibold text-text-primary">{person.name}</p>
              <p className={cx("truncate", mutedNote)}>{person.role} · {person.detail}</p>
            </div>
            <button
              type="button"
              aria-label={`Message ${person.name}`}
              aria-expanded={openId === person.id}
              onClick={(event) => {
                openerRef.current = event.currentTarget;
                setDraft("");
                setSentTo(null);
                setOpenId(person.id);
              }}
              className={iconButton}
            >
              <RiMessage3Line className="size-3.5" aria-hidden />
            </button>
          </li>
        ))}
      </ul>

      <p key={sentTo ?? "idle"} aria-live="polite" className={cx("mt-1.5 flex min-h-4 animate-label-in items-center gap-1 motion-reduce:animate-none", mutedNote)}>
        {sentTo ? (
          <>
            <RiCheckLine className="size-3 text-status-lime-text" aria-hidden />
            Message sent to {sentTo}.
          </>
        ) : (
          "Replies usually arrive within one business day."
        )}
      </p>

      {member ? (
        <div role="dialog" aria-label={`Message ${member.name}`} className={sheet}>
          <div className="flex items-center gap-2">
            <Avatar initials={member.initials} tone={member.tone} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-caption-1-semibold text-text-primary">{member.name}</p>
              <p className={cx("truncate", mutedNote)}>{member.role}</p>
            </div>
            <button type="button" aria-label="Close message" onClick={close} className={iconButton}>
              <RiCloseLine className="size-3.5" aria-hidden />
            </button>
          </div>
          <label htmlFor={messageId} className="mt-2 text-caption-2-medium text-text-secondary">
            Message {member.short}
          </label>
          <textarea
            id={messageId}
            ref={composerRef}
            rows={2}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask about a medication or symptom…"
            className={cx(
              "mt-1 h-16 w-full resize-none rounded-lg bg-background-tertiary-default px-2 py-1",
              "text-caption-1-regular text-text-primary outline-none placeholder:text-text-placeholder",
              focusRing,
            )}
          />
          <div className="mt-auto flex items-center justify-between gap-1.5">
            <span className={mutedNote}>Encrypted in transit</span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={close} className={quietButton}>Cancel</button>
              <button type="button" disabled={!draft.trim()} onClick={send} className={cx(primaryButton, "h-7")}>
                <RiSendPlaneLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
                Send
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

/* 7. Insurance Card */

const INSURANCE = {
  plan: "Meridian PPO Gold",
  member: "Jordan A. Lee",
  memberId: "MRD 8842 1097",
  group: "GRP 40218",
  effective: "Jan 1 – Dec 31, 2026",
} as const;

type CopyField = "member" | "group";

export function InsuranceCard() {
  const [copied, setCopied] = useState<CopyField | null>(null);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(null), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async (value: string, field: CopyField) => {
    try {
      await navigator.clipboard?.writeText(value);
    } catch {
      /* Clipboard access can be blocked; the label still confirms intent. */
    }
    setCopied(field);
  };

  const fields = [
    { field: "member", label: "Member ID", value: INSURANCE.memberId },
    { field: "group", label: "Group", value: INSURANCE.group },
  ] as const;

  return (
    <section aria-label="Insurance card" className={cx(cardSurface, "max-w-[320px] overflow-hidden")}>
      <div className="flex items-center gap-2 bg-accent-600 p-2.5 text-text-white">
        <RiShieldCheckLine className="size-4 shrink-0" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-1-semibold">Meridian Health</p>
          <p className="truncate text-caption-2-regular text-text-white">{INSURANCE.plan} · Individual</p>
        </div>
        <span className="shrink-0 rounded-full bg-background-primary-default px-1.5 py-0.5 text-caption-2-medium text-status-lime-text">
          Active
        </span>
      </div>

      <div className="p-2.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className={mutedNote}>Member</span>
          <span className="truncate text-caption-1-semibold text-text-primary">{INSURANCE.member}</span>
        </div>

        <div className="mt-1.5 grid grid-cols-2 gap-1.5">
          {fields.map((item) => (
            <div key={item.field} className="rounded-lg bg-background-secondary-default px-1.5 py-1">
              <p className={mutedNote}>{item.label}</p>
              <div className="flex items-center gap-1">
                <span dir="ltr" className="min-w-0 flex-1 truncate font-mono text-caption-1-semibold text-text-primary">
                  {item.value}
                </span>
                <button
                  type="button"
                  aria-label={`Copy ${item.label}`}
                  onClick={() => void copy(item.value, item.field)}
                  className="flex size-5 shrink-0 items-center justify-center rounded-sm text-foreground-icon-tertiary transition-[background-color,color] duration-150 ease-out hover:bg-background-tertiary-default hover:text-text-primary motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                >
                  {copied === item.field ? (
                    <RiCheckLine className="size-3 text-status-lime-text" aria-hidden />
                  ) : (
                    <RiFileCopyLine className="size-3" aria-hidden />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={cx("mt-1.5 flex items-center justify-between gap-2", mutedNote)}>
          <span>Effective {INSURANCE.effective}</span>
          <span className="text-status-lime-text">In network</span>
        </div>
        <p key={copied ?? "idle"} aria-live="polite" className={cx("mt-1 min-h-4 animate-label-in truncate motion-reduce:animate-none", mutedNote)}>
          {copied === "member"
            ? "Member ID copied to clipboard."
            : copied === "group"
              ? "Group number copied to clipboard."
              : "PCP: Dr. Marcus Patel · $25 copay"}
        </p>
      </div>
    </section>
  );
}

/* 8. Prescription Refill */

const REFILL = {
  name: "Atorvastatin",
  dose: "20 mg",
  remaining: 8,
  supply: 30,
  lastFilled: "Oct 2",
  pharmacy: "Cedar Pharmacy",
  address: "214 Alder St",
  pickup: "Fri, Nov 6 after 3 PM",
} as const;

type RefillStatus = "idle" | "sending" | "sent";

export function PrescriptionRefill() {
  const [status, setStatus] = useState<RefillStatus>("idle");
  const low = REFILL.remaining <= 10;

  useEffect(() => {
    if (status !== "sending") return;
    const timer = window.setTimeout(() => setStatus("sent"), 900);
    return () => window.clearTimeout(timer);
  }, [status]);

  return (
    <section aria-label="Prescription refill" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <CardHead icon={RiMedicineBottleLine} title={`${REFILL.name} ${REFILL.dose}`} meta={`${REFILL.pharmacy} · ${REFILL.address}`} tone="yellow"
        trailing={<Badge tone={low ? "yellow" : "neutral"}>{REFILL.remaining} left</Badge>} />

      <div className="mt-2 rounded-lg bg-background-secondary-default px-2 py-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-caption-1-semibold text-text-primary tabular-nums">
            {REFILL.remaining} of {REFILL.supply} doses left
          </span>
          <span className={mutedNote}>Refill by Nov 9</span>
        </div>
        <div
          role="progressbar"
          aria-label="Doses remaining"
          aria-valuemin={0}
          aria-valuemax={REFILL.supply}
          aria-valuenow={REFILL.remaining}
          className="mt-1 h-1.5 overflow-hidden rounded-full bg-background-tertiary-default"
        >
          <div
            className="h-full rounded-full bg-status-orange-text transition-[width] duration-200 ease-out motion-reduce:transition-none"
            style={{ width: `${(REFILL.remaining / REFILL.supply) * 100}%` }}
          />
        </div>
        <div className={cx("mt-1 flex items-center justify-between gap-2", mutedNote)}>
          <span>Last filled {REFILL.lastFilled}</span>
          <span>30-day supply</span>
        </div>
      </div>

      {status === "sent" ? (
        <div className="mt-2 flex animate-label-in items-start gap-1.5 rounded-lg bg-status-lime-background px-2 py-1.5 text-status-lime-text motion-reduce:animate-none">
          <RiCheckLine className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="text-caption-2-semibold">Refill requested</p>
            <p className="text-caption-2-regular">Ready for pickup {REFILL.pickup}.</p>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setStatus("sending")}
          disabled={status === "sending"}
          className={cx(primaryButton, "mt-2 h-7 w-full")}
        >
          {status === "sending" ? <RiLoader4Line className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden /> : <RiRefreshLine className="size-3.5" aria-hidden />}
          {status === "sending" ? "Sending to pharmacy" : "Request refill"}
        </button>
      )}

      <div className="mt-1.5 flex min-h-4 items-center justify-between gap-2">
        <span aria-live="polite" className={cx("truncate", mutedNote)}>
          {status === "sent" ? `Called in to ${REFILL.pharmacy}.` : "Auto-refill is off for this prescription."}
        </span>
        {status === "sent" ? (
          <button type="button" onClick={() => setStatus("idle")} className={quietButton}>Undo</button>
        ) : (
          <span className={cx("shrink-0", mutedNote)}>1 refill left</span>
        )}
      </div>
    </section>
  );
}

/* 9. Allergy Alert */

const ALLERGIES = [
  { id: "penicillin", name: "Penicillin", severity: "Severe", tone: "rose", reaction: "Hives and facial swelling. Avoid amoxicillin and ampicillin.", recorded: "Recorded Mar 2019" },
  { id: "shellfish", name: "Shellfish", severity: "Moderate", tone: "orange", reaction: "Nausea and itching within 20 minutes of eating shrimp.", recorded: "Recorded Jun 2021" },
  { id: "latex", name: "Latex", severity: "Mild", tone: "yellow", reaction: "Contact rash. Use nitrile gloves for exams.", recorded: "Recorded Aug 2023" },
] as const;

type AllergyId = (typeof ALLERGIES)[number]["id"];

export function AllergyAlert() {
  const baseId = useId();
  const [expanded, setExpanded] = useState<AllergyId | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <section
      aria-label="Allergy alert"
      className={cx(cardSurface, "max-w-[320px] p-2.5")}
      onKeyDown={(event) => {
        if (event.key === "Escape" && expanded) {
          event.stopPropagation();
          setExpanded(null);
        }
      }}
    >
      <CardHead icon={RiAlertLine} title="Allergy alert" meta="Reviewed by Dr. Patel · Oct 12" tone="rose"
        trailing={<Badge tone="rose">3 listed</Badge>} />

      <ul className="mt-1.5">
        {ALLERGIES.map((allergy) => {
          const open = expanded === allergy.id;
          return (
            <li key={allergy.id} className="border-b border-separator-border last:border-b-0">
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`${baseId}-${allergy.id}`}
                onClick={() => setExpanded(open ? null : allergy.id)}
                className={cx("flex h-8 w-full items-center gap-1.5 text-start", focusRing)}
              >
                <span className="min-w-0 flex-1 truncate text-caption-1-semibold text-text-primary">{allergy.name}</span>
                <Badge tone={allergy.tone}>{allergy.severity}</Badge>
                <RiArrowDownSLine
                  className={cx("size-3.5 shrink-0 text-foreground-icon-tertiary transition-[transform] duration-200 ease-out motion-reduce:transition-none", open && "rotate-180")}
                  aria-hidden
                />
              </button>
              <div
                id={`${baseId}-${allergy.id}`}
                inert={!open}
                className={cx(revealGrid, open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
              >
                <div className="min-h-0 overflow-hidden">
                  <p className="pb-1.5 text-caption-2-regular text-text-secondary">{allergy.reaction}</p>
                  <p className={cx("pb-1.5", mutedNote)}>{allergy.recorded}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {acknowledged ? (
        <div aria-live="polite" className="mt-1.5 flex animate-label-in items-center gap-1.5 rounded-lg bg-status-lime-background px-2 py-1.5 text-status-lime-text motion-reduce:animate-none">
          <RiCheckLine className="size-3.5 shrink-0" aria-hidden />
          <span className="min-w-0 flex-1 truncate text-caption-2-medium">Acknowledged by Jordan · 9:12 AM</span>
          <button
            type="button"
            onClick={() => setAcknowledged(false)}
            className="shrink-0 text-caption-2-semibold underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            Undo
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => setAcknowledged(true)} className={cx(primaryButton, "mt-1.5 h-7 w-full")}>
          <RiCheckLine className="size-3.5" aria-hidden />
          Acknowledge list
        </button>
      )}
    </section>
  );
}

/* 10. Visit Summary */

const VISIT_SUMMARY = "Acute sinusitis (J01.90) · Amoxicillin 500 mg three times daily for 10 days. Follow-up Mon, Nov 9 at 9:40 AM.";

export function VisitSummary() {
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(VISIT_SUMMARY);
    } catch {
      /* Clipboard access can be blocked; the label still confirms intent. */
    }
    setCopied(true);
  };

  return (
    <section aria-label="Visit summary" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <CardHead icon={RiFileTextLine} title="Visit summary" meta="Oct 24, 2026 · Dr. Marcus Patel" tone="blue"
        trailing={<Badge tone="neutral">Signed</Badge>} />

      <div className="mt-2 rounded-lg bg-background-secondary-default px-2 py-1">
        <p className={mutedNote}>Diagnosis · J01.90</p>
        <p className="text-caption-1-semibold text-text-primary">Acute sinusitis</p>
        <p className="mt-0.5 line-clamp-2 text-caption-2-regular text-text-secondary">
          Amoxicillin 500 mg three times daily for 10 days. Saline rinse twice daily.
        </p>
      </div>

      <div className="mt-1.5 flex items-center gap-1.5">
        <span aria-hidden className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-status-blue-background text-status-blue-text">
          <RiCalendarCheckLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className={mutedNote}>Follow-up · Telehealth</p>
          <p className="text-caption-1-semibold text-text-primary">Mon, Nov 9 · 9:40 AM</p>
        </div>
        <button
          type="button"
          aria-pressed={added}
          onClick={() => setAdded((current) => !current)}
          className={cx(added ? secondaryButton : primaryButton, "h-7 shrink-0")}
        >
          {added ? (
            <>
              <RiCheckLine className="size-3.5 text-status-lime-text" aria-hidden />
              Added
            </>
          ) : (
            <>
              <RiCalendarCheckLine className="size-3.5" aria-hidden />
              Add
            </>
          )}
        </button>
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <p key={copied ? "copied" : added ? "added" : "idle"} aria-live="polite" className={cx("min-w-0 animate-label-in truncate motion-reduce:animate-none", copied ? "text-caption-2-regular text-status-lime-text" : mutedNote)}>
          {copied ? "Summary copied." : added ? "Follow-up added to your calendar." : "Return if fever passes 101.5 °F."}
        </p>
        <button type="button" aria-label="Copy visit summary" onClick={() => void copy()} className={iconButton}>
          {copied ? <RiCheckLine className="size-3 text-status-lime-text" aria-hidden /> : <RiFileCopyLine className="size-3" aria-hidden />}
        </button>
      </div>
    </section>
  );
}

/* 11. Wellness Ring */

const RING_DEFS = [
  { key: "move", label: "Move", goal: 500, unit: "kcal", color: "text-chart-3", dot: "bg-chart-3" },
  { key: "exercise", label: "Exercise", goal: 30, unit: "min", color: "text-chart-2", dot: "bg-chart-2" },
  { key: "stand", label: "Stand", goal: 12, unit: "hr", color: "text-chart-1", dot: "bg-chart-1" },
] as const;

type WellnessDay = { id: string; short: string; label: string; move: number; exercise: number; stand: number };

const WELLNESS_DAYS: WellnessDay[] = [
  { id: "mon", short: "M", label: "Monday", move: 460, exercise: 26, stand: 10 },
  { id: "tue", short: "T", label: "Tuesday", move: 520, exercise: 34, stand: 11 },
  { id: "wed", short: "W", label: "Wednesday", move: 380, exercise: 18, stand: 8 },
  { id: "thu", short: "T", label: "Thursday", move: 430, exercise: 26, stand: 10 },
  { id: "fri", short: "F", label: "Friday", move: 500, exercise: 30, stand: 12 },
  { id: "sat", short: "S", label: "Saturday", move: 610, exercise: 41, stand: 13 },
  { id: "sun", short: "S", label: "Sunday", move: 300, exercise: 15, stand: 7 },
];

const RING_RADII = [27, 20.5, 14] as const;
const RING_CIRCUMFERENCE = RING_RADII.map((radius) => 2 * Math.PI * radius);

export function WellnessRing() {
  const [selected, setSelected] = useState("thu");
  const day = WELLNESS_DAYS.find((item) => item.id === selected) ?? WELLNESS_DAYS[3];
  const overall = Math.round(
    (RING_DEFS.reduce((total, ring) => total + Math.min(day[ring.key] / ring.goal, 1), 0) / RING_DEFS.length) * 100,
  );
  const closed = RING_DEFS.filter((ring) => day[ring.key] >= ring.goal).length;

  return (
    <section aria-label="Wellness activity" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <CardHead icon={RiDonutChartLine} title="Activity" meta="Week of Nov 2 · 3 goals" tone="lime"
        trailing={<Badge tone="neutral">{overall}%</Badge>} />

      <div role="group" aria-label="Choose a day" className="mt-1 grid grid-cols-7 gap-0.5">
        {WELLNESS_DAYS.map((item) => {
          const active = item.id === selected;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              aria-label={item.label}
              onClick={() => setSelected(item.id)}
              className={cx(
                "flex h-6 items-center justify-center rounded-md text-caption-2-semibold",
                "transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                active ? "bg-accent-600 text-text-white" : "text-text-tertiary hover:bg-background-secondary-default hover:text-text-primary",
              )}
            >
              {item.short}
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex items-center gap-3">
        <div className="size-[84px] shrink-0">
          <svg
            viewBox="0 0 72 72"
            className="size-full -rotate-90"
            role="img"
            aria-label={`${day.label}: ${RING_DEFS.map((ring) => `${day[ring.key]} of ${ring.goal} ${ring.label.toLowerCase()}`).join(", ")}`}
          >
            {RING_DEFS.map((ring, index) => {
              const circumference = RING_CIRCUMFERENCE[index];
              return (
                <g key={ring.key}>
                  <circle cx="36" cy="36" r={RING_RADII[index]} fill="none" strokeWidth="5" className="stroke-background-tertiary-default" />
                  <circle
                    cx="36"
                    cy="36"
                    r={RING_RADII[index]}
                    fill="none"
                    strokeWidth="5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - Math.min(day[ring.key] / ring.goal, 1))}
                    className={cx(ring.color, "transition-[stroke-dashoffset] duration-200 ease-out motion-reduce:transition-none")}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        <dl className="min-w-0 flex-1">
          {RING_DEFS.map((ring) => {
            const value = day[ring.key];
            const met = value >= ring.goal;
            return (
              <div key={ring.key} className="flex items-center gap-1.5 py-0.5">
                <dt className="flex min-w-0 flex-1 items-center gap-1.5">
                  <span aria-hidden className={cx("size-1.5 shrink-0 rounded-full", ring.dot)} />
                  <span className={cx("truncate", mutedNote)}>{ring.label}</span>
                  {met ? (
                    <>
                      <RiCheckLine className="size-3 shrink-0 text-status-lime-text" aria-hidden />
                      <span className="sr-only">Goal met</span>
                    </>
                  ) : null}
                </dt>
                <dd className="shrink-0 text-caption-2-semibold text-text-primary tabular-nums">
                  {value}/{ring.goal}
                  <span className="text-caption-2-regular text-text-tertiary"> {ring.unit}</span>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>

      <p aria-live="polite" className={cx("mt-1 truncate", mutedNote)}>
        {day.label} · {overall}% · {closed === 3 ? "All three rings closed." : `${closed} of 3 rings closed.`}
      </p>
    </section>
  );
}

/* 12. Telehealth Waiting */

const DEVICES = [
  { id: "camera", label: "Camera", icon: RiCameraLine },
  { id: "mic", label: "Mic", icon: RiMicLine },
  { id: "network", label: "Wi-Fi", icon: RiWifiLine },
] as const;

type VisitStatus = "waiting" | "joining" | "connected";

export function TelehealthWaiting() {
  const [checked, setChecked] = useState(false);
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<VisitStatus>("waiting");

  useEffect(() => {
    if (!testing) return;
    const timer = window.setTimeout(() => {
      setTesting(false);
      setChecked(true);
    }, 850);
    return () => window.clearTimeout(timer);
  }, [testing]);

  useEffect(() => {
    if (status !== "joining") return;
    const timer = window.setTimeout(() => setStatus("connected"), 1000);
    return () => window.clearTimeout(timer);
  }, [status]);

  return (
    <section aria-label="Telehealth waiting room" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <CardHead icon={RiVideoChatLine} title="Telehealth waiting room" meta="Dr. Marcus Patel · Urgent care" tone="lime"
        trailing={<Badge tone={status === "connected" ? "lime" : "neutral"} icon={status === "connected" ? RiCheckLine : undefined}>
          {status === "connected" ? "Live" : "Queue 2"}
        </Badge>} />

      {status === "connected" ? (
        <div className="mt-1.5 flex animate-label-in flex-col items-center rounded-lg bg-status-lime-background px-2 py-1.5 text-status-lime-text motion-reduce:animate-none">
          <span className="flex size-7 items-center justify-center rounded-full bg-background-primary-default">
            <RiCheckLine className="size-4" aria-hidden />
          </span>
          <p className="mt-1 text-caption-1-semibold">You’re in the visit</p>
          <p className="text-caption-2-regular">Dr. Patel will join in a moment.</p>
        </div>
      ) : (
        <>
          <div className="mt-1.5 flex h-9 items-center gap-2 rounded-lg bg-background-secondary-default px-2">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-primary-default text-caption-1-semibold text-text-primary shadow-xs tabular-nums">
              2
            </span>
            <p className="min-w-0 flex-1 truncate text-caption-1-semibold text-text-primary">
              Two ahead <span className={mutedNote}>· about 6 min</span>
            </p>
            <span className="flex shrink-0 items-center gap-1 text-caption-2-medium text-status-lime-text">
              <span className="size-1.5 animate-pulse rounded-full bg-status-lime-text motion-reduce:animate-none" aria-hidden />
              Live
            </span>
          </div>

          <ul aria-label="Device check" className="mt-1.5 grid grid-cols-3 gap-1">
            {DEVICES.map((device) => {
              const Icon = device.icon;
              return (
                <li
                  key={device.id}
                  aria-label={`${device.label}: ${checked ? "ready" : "not tested"}`}
                  className={cx(
                    "flex h-6 items-center justify-center gap-1 rounded-md",
                    "transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
                    checked ? "bg-status-lime-background text-status-lime-text" : "bg-background-secondary-default text-text-tertiary",
                  )}
                >
                  <Icon className="size-3 shrink-0" aria-hidden />
                  <span className="truncate text-caption-2-medium">{device.label}</span>
                  {checked ? <RiCheckLine className="size-3 shrink-0" aria-hidden /> : null}
                </li>
              );
            })}
          </ul>
        </>
      )}

      <div className="mt-1.5 flex items-center gap-1.5">
        {status === "connected" ? (
          <>
            <span aria-live="polite" className={cx("min-w-0 flex-1 truncate", mutedNote)}>Connected · 2:06 PM</span>
            <button
              type="button"
              onClick={() => {
                setStatus("waiting");
                setChecked(false);
              }}
              className={cx(secondaryButton, "h-7 shrink-0")}
            >
              Leave
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={() => setTesting(true)} disabled={testing || status === "joining"} className={cx(secondaryButton, "h-7 flex-1")}>
              {testing ? <RiLoader4Line className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden /> : <RiCameraLine className="size-3.5" aria-hidden />}
              {testing ? "Checking" : checked ? "Test again" : "Check devices"}
            </button>
            <button
              type="button"
              onClick={() => setStatus("joining")}
              disabled={!checked || status === "joining"}
              className={cx(primaryButton, "h-7 flex-1")}
            >
              {status === "joining" ? <RiLoader4Line className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden /> : <RiVideoChatLine className="size-3.5" aria-hidden />}
              {status === "joining" ? "Joining" : "Join visit"}
            </button>
          </>
        )}
      </div>

      <p aria-live="polite" className={cx("mt-1.5 flex min-h-4 items-center gap-1 truncate", mutedNote)}>
        <RiLockLine className="size-3 shrink-0" aria-hidden />
        {status === "connected"
          ? "This visit is not being recorded."
          : checked
            ? "Devices ready. Join when you are."
            : "A device check keeps the first minute for care."}
      </p>
    </section>
  );
}

/* Specimens */

export const HEALTH_SECTION: ExtendedSection = {
  id: "health",
  title: "Health",
  blurb: "Care plans, vitals and appointments without the clinic clip art.",
  file: "health.tsx",
  entries: [
    { name: "Vitals Row", description: "Four readings in range, with the reference band behind the selected one.", Demo: VitalsRow, wide: true },
    { name: "Medication Schedule", description: "Today’s doses, taken or skipped, with the count that is left.", Demo: MedicationSchedule },
    { name: "Appointment Card", description: "A cardiology follow-up that can move or cancel in place.", Demo: AppointmentCard },
    { name: "Lab Result", description: "A1c with its reference band, trend and a plain-language verdict.", Demo: LabResult },
    { name: "Symptom Log", description: "Severity, symptom chips and a note that files itself.", Demo: SymptomLog },
    { name: "Care Team", description: "Three clinicians and one secure message composer.", Demo: CareTeam },
    { name: "Insurance Card", description: "Plan, member ID and group number with copy confirmation.", Demo: InsuranceCard },
    { name: "Prescription Refill", description: "Eight doses left, a pharmacy and a refill that sends.", Demo: PrescriptionRefill },
    { name: "Allergy Alert", description: "Three allergies with severity, detail and an acknowledgement.", Demo: AllergyAlert },
    { name: "Visit Summary", description: "Diagnosis, notes and a follow-up that lands on the calendar.", Demo: VisitSummary },
    { name: "Wellness Ring", description: "Three activity arcs across a week of switches.", Demo: WellnessRing },
    { name: "Telehealth Waiting", description: "Queue position, device checks and a join that connects.", Demo: TelehealthWaiting },
  ],
};
