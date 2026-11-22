"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  RiAddLine,
  RiArrowDownSLine,
  RiArrowRightLine,
  RiBookmarkFill,
  RiBookmarkLine,
  RiBriefcaseLine,
  RiCalendarEventLine,
  RiCheckLine,
  RiCloseLine,
  RiEyeLine,
  RiFilePdf2Line,
  RiFileTextLine,
  RiLoader4Line,
  RiMoneyDollarCircleLine,
  RiRefreshLine,
  RiSendPlaneLine,
  RiStarFill,
  RiSubtractLine,
  RiTimeLine,
  RiUserAddLine,
  RiUserStarLine,
} from "@remixicon/react";
import { Avatar } from "@/components/base/avatar/avatar";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* -------------------------------------------------------------------------- */
/*  Shared anatomy                                                             */
/* -------------------------------------------------------------------------- */

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";
const cardSurface = "w-full rounded-xl border border-border-button-default bg-background-primary-default shadow-card";
const metaText = "text-caption-2-regular text-text-tertiary";

const buttonBase =
  "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg text-caption-1-semibold " +
  "transition-[transform,background-color,color,box-shadow,opacity] duration-150 ease-out " +
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
  "h-6 rounded-md px-1.5 text-caption-2-semibold text-text-secondary hover:bg-background-secondary-default hover:text-text-primary",
  focusRing,
);
const iconButton = cx(
  "flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-icon-tertiary",
  "transition-[background-color,color,transform] duration-150 ease-out hover:bg-background-tertiary-default hover:text-text-primary",
  "motion-reduce:transition-none",
  focusRing,
);
const revealGrid = "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none";

const STAGES = ["Applied", "Screen", "Interview", "Offer", "Hired"] as const;
type Stage = (typeof STAGES)[number];

const STAGE_PILL: Record<Stage, string> = {
  Applied: "bg-background-tertiary-default text-text-secondary",
  Screen: "bg-status-cyan-background text-status-cyan-text",
  Interview: "bg-status-yellow-background text-status-yellow-text",
  Offer: "bg-status-purple-background text-status-purple-text",
  Hired: "bg-status-lime-background text-status-lime-text",
};

const STAGE_DOT: Record<Stage, string> = {
  Applied: "bg-foreground-icon-tertiary",
  Screen: "bg-status-cyan-text",
  Interview: "bg-status-yellow-text",
  Offer: "bg-status-purple-text",
  Hired: "bg-status-lime-text",
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("");

function StagePill({ stage, className }: { stage: Stage; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-caption-2-medium",
        "transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
        STAGE_PILL[stage],
        className,
      )}
    >
      <span aria-hidden className={cx("size-1.5 rounded-full", STAGE_DOT[stage])} />
      {stage}
    </span>
  );
}

function useEscape(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
}

function usePopoverDismiss(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) onClose();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return ref;
}

/* 1. Candidate Card */

export function CandidateCard() {
  const [stageIndex, setStageIndex] = useState(1);
  const [saved, setSaved] = useState(false);
  const stage = STAGES[stageIndex];
  const next = STAGES[stageIndex + 1];
  const last = stageIndex === STAGES.length - 1;

  return (
    <section aria-label="Candidate Amara Okafor" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-start gap-2">
        <Avatar size="md" color="blue" initials="AO" aria-hidden />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Amara Okafor</h3>
          <p className={cx(metaText, "truncate")}>Senior Product Designer · Lisbon</p>
        </div>
        <button
          type="button"
          aria-label={saved ? "Remove Amara from the shortlist" : "Add Amara to the shortlist"}
          aria-pressed={saved}
          onClick={() => setSaved((current) => !current)}
          className={cx(iconButton, "-me-1 -mt-0.5")}
        >
          <span key={saved ? "on" : "off"} className="flex animate-label-in motion-reduce:animate-none">
            {saved ? (
              <RiBookmarkFill className="size-3.5 text-accent-600" aria-hidden />
            ) : (
              <RiBookmarkLine className="size-3.5" aria-hidden />
            )}
          </span>
        </button>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <StagePill stage={stage} />
        <span className={cx(metaText, "truncate")}>2 of 3 interviews</span>
        <span className="ms-auto flex shrink-0 items-baseline gap-0.5">
          <span className="text-body-2-semibold text-text-primary tabular-nums">4.8</span>
          <span className={metaText}>/ 5</span>
        </span>
      </div>
      <div
        role="img"
        aria-label="Panel score 4.8 out of 5"
        className="mt-1.5 h-1 overflow-hidden rounded-full bg-background-tertiary-default"
      >
        <div className="h-full w-[96%] rounded-full bg-accent-500" />
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span
          aria-live="polite"
          className={cx("min-w-0 truncate text-caption-2-regular", last ? "text-status-lime-text" : "text-text-tertiary")}
        >
          {last ? "Offer signed · starts 5 Jan" : stage === "Offer" ? "Decision call booked for Fri" : `Next: ${next} call`}
        </span>
        <button
          type="button"
          onClick={() => setStageIndex((current) => Math.min(current + 1, STAGES.length - 1))}
          disabled={last}
          className={cx(primaryButton, "h-7 shrink-0")}
        >
          {last ? (
            <>
              <RiCheckLine className="size-3" aria-hidden />
              Final stage
            </>
          ) : (
            <>
              Move to {next}
              <RiArrowRightLine className="size-3 rtl:-scale-x-100" aria-hidden />
            </>
          )}
        </button>
      </div>
    </section>
  );
}

/* 2. Pipeline Board */

type PipelineCandidate = { id: string; name: string; role: string; stage: Stage };

const PIPELINE_CANDIDATES: PipelineCandidate[] = [
  { id: "amara", name: "Amara Okafor", role: "Product Designer", stage: "Screen" },
  { id: "jonas", name: "Jonas Weber", role: "Frontend Engineer", stage: "Screen" },
  { id: "priya", name: "Priya Nair", role: "Design Lead", stage: "Interview" },
  { id: "luis", name: "Luis Ortega", role: "Data Engineer", stage: "Interview" },
  { id: "hana", name: "Hana Sato", role: "Product Designer", stage: "Offer" },
];

const BOARD_STAGES: Stage[] = ["Screen", "Interview", "Offer"];

export function PipelineBoard() {
  const [cards, setCards] = useState(PIPELINE_CANDIDATES);
  const [hired, setHired] = useState(0);

  const move = (card: PipelineCandidate) => {
    const next = STAGES[STAGES.indexOf(card.stage) + 1];
    if (!next) return;
    if (next === "Hired") {
      setHired((count) => count + 1);
      setCards((current) => current.filter((item) => item.id !== card.id));
      return;
    }
    setCards((current) =>
      current.map((item) => (item.id === card.id ? { ...item, stage: next } : item)),
    );
  };

  return (
    <section aria-label="Pipeline for Senior Product Designer" className={cx(cardSurface, "max-w-[560px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
          <RiBriefcaseLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Senior Product Designer</h3>
          <p className={cx(metaText, "truncate")}>Req PRD-118 · {cards.length} active</p>
        </div>
        <span
          className={cx(
            "shrink-0 rounded-full px-1.5 py-0.5 text-caption-2-medium transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
            hired > 0 ? "bg-status-lime-background text-status-lime-text" : "bg-background-tertiary-default text-text-secondary",
          )}
        >
          {hired > 0 ? `${hired} hired` : "Open"}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {BOARD_STAGES.map((stage) => {
          const list = cards.filter((card) => card.stage === stage);
          return (
            <div key={stage} className="flex min-w-0 flex-col gap-1 rounded-lg bg-background-secondary-default p-1">
              <div className="flex items-center justify-between gap-1 px-0.5">
                <span className="truncate text-caption-2-semibold text-text-secondary">{stage}</span>
                <span className={cx(metaText, "tabular-nums")}>{list.length}</span>
              </div>
              <div className="flex flex-col gap-1">
                {list.map((card) => (
                  <div
                    key={card.id}
                    className="animate-label-in rounded-md border border-border-button-default bg-background-primary-default p-1.5 shadow-xs motion-reduce:animate-none"
                  >
                    <div className="flex items-center gap-1">
                      <span
                        aria-hidden
                        className="flex size-5 shrink-0 items-center justify-center rounded-full bg-background-tertiary-default text-caption-2-semibold text-text-secondary"
                      >
                        {initials(card.name)}
                      </span>
                      <span className="truncate text-caption-2-semibold text-text-primary">{card.name}</span>
                    </div>
                    <p className={cx(metaText, "mt-0.5 truncate")}>{card.role}</p>
                    <button
                      type="button"
                      aria-label={
                        stage === "Offer"
                          ? `Mark ${card.name} as hired`
                          : `Move ${card.name} to ${STAGES[STAGES.indexOf(stage) + 1]}`
                      }
                      onClick={() => move(card)}
                      className={cx(
                        quietButton,
                        "mt-1 h-5 w-full justify-between gap-1 rounded-sm px-1 text-caption-2-semibold",
                      )}
                    >
                      <span className="truncate">{stage === "Offer" ? "Hire" : "Move"}</span>
                      <RiArrowRightLine className="size-3 shrink-0 rtl:-scale-x-100" aria-hidden />
                    </button>
                  </div>
                ))}
                {list.length === 0 && (
                  <p className="rounded-md border border-dashed border-border-button-default px-1 py-2 text-center text-caption-2-regular text-text-tertiary">
                    Empty
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span aria-live="polite" className={metaText}>
          {hired > 0 ? `${hired} hired this week` : "No hires yet this week"}
        </span>
        <span className={cx(metaText, "flex items-center gap-1")}>
          <RiTimeLine className="size-3" aria-hidden />
          2 interviews today
        </span>
      </div>
    </section>
  );
}

/* 3. Interview Slot */

const INTERVIEW_DATES = [
  { id: "fri", weekday: "Fri", date: "6 Nov" },
  { id: "mon", weekday: "Mon", date: "9 Nov" },
  { id: "tue", weekday: "Tue", date: "10 Nov" },
] as const;

const INTERVIEW_TIMES = ["09:30", "11:00", "14:30"] as const;

type InterviewDateId = (typeof INTERVIEW_DATES)[number]["id"];

export function InterviewSlot() {
  const [day, setDay] = useState<InterviewDateId>("fri");
  const [time, setTime] = useState<string>("11:00");
  const [confirmed, setConfirmed] = useState(false);
  const chosen = INTERVIEW_DATES.find((option) => option.id === day) ?? INTERVIEW_DATES[0];

  return (
    <section aria-label="Schedule interview with Amara Okafor" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-start gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
          <RiCalendarEventLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Interview · Amara Okafor</h3>
          <p className={cx(metaText, "truncate")}>Panel of 3 · 45 min · Google Meet</p>
        </div>
      </div>
      <div role="group" aria-label="Interview date" className="mt-2 grid grid-cols-3 gap-1">
        {INTERVIEW_DATES.map((option) => {
          const active = day === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setDay(option.id);
                setConfirmed(false);
              }}
              className={cx(
                "flex flex-col rounded-lg border px-1.5 py-1 text-start transition-[background-color,border-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                active ? "border-accent-500 bg-background-secondary-default shadow-xs" : "border-border-button-default bg-background-primary-default hover:bg-background-primary-hover",
              )}
            >
              <span className={cx("text-caption-2-regular", active ? "text-accent-600" : "text-text-tertiary")}>{option.weekday}</span>
              <span className="text-caption-1-semibold text-text-primary">{option.date}</span>
            </button>
          );
        })}
      </div>
      <div role="group" aria-label="Interview time" className="mt-1.5 flex items-center gap-1">
        {INTERVIEW_TIMES.map((option) => {
          const active = time === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setTime(option);
                setConfirmed(false);
              }}
              className={cx(
                "h-6 flex-1 rounded-md text-caption-1-medium tabular-nums transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                active ? "bg-accent-600 text-text-white shadow-xs" : "bg-background-tertiary-default text-text-secondary hover:bg-background-tertiary-hover",
              )}
            >
              <bdi dir="ltr">{option}</bdi>
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span aria-live="polite" className={cx("min-w-0 truncate", metaText)}>
          {confirmed ? "Both calendars blocked" : "GMT+1 · 45 minutes"}
        </span>
        <button
          type="button"
          aria-label={
            confirmed
              ? `Change the confirmed time, ${chosen.weekday} ${chosen.date} at ${time}`
              : `Confirm ${chosen.weekday} ${chosen.date} at ${time}`
          }
          onClick={() => setConfirmed((current) => !current)}
          className={cx(
            confirmed
              ? cx(secondaryButton, "h-7 border-status-lime-text/30 bg-status-lime-background text-status-lime-text")
              : primaryButton,
            "h-7 shrink-0",
          )}
        >
          {confirmed ? <RiCheckLine className="size-3" aria-hidden /> : <RiArrowRightLine className="size-3 rtl:-scale-x-100" aria-hidden />}
          {confirmed ? `Confirmed · ${chosen.date}` : `Confirm ${time}`}
        </button>
      </div>
    </section>
  );
}

/* 4. Scorecard */

const CRITERIA = [
  { id: "craft", label: "Product craft" },
  { id: "comms", label: "Communication" },
  { id: "systems", label: "Systems thinking" },
] as const;

type CriterionId = (typeof CRITERIA)[number]["id"];

const INITIAL_RATINGS: Record<CriterionId, number> = { craft: 4, comms: 5, systems: 3 };

export function Scorecard() {
  const [ratings, setRatings] = useState<Record<CriterionId, number>>(INITIAL_RATINGS);
  const [notes, setNotes] = useState("Strong portfolio. Clear on trade-offs; would pair well with a senior IC.");
  const [submitted, setSubmitted] = useState(false);
  const average = Object.values(ratings).reduce((total, value) => total + value, 0) / CRITERIA.length;

  const rate = (id: CriterionId, value: number) => {
    setRatings((current) => ({ ...current, [id]: value }));
    setSubmitted(false);
  };

  return (
    <section aria-label="Scorecard for Amara Okafor" className={cx(cardSurface, "max-w-[320px] px-2 py-1.5")}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-body-2-semibold text-text-primary">Scorecard · Amara Okafor</h3>
          <p className={cx(metaText, "truncate")}>Interview 2 of 3 · Fri 6 Nov</p>
        </div>
        <span className="shrink-0 text-caption-2-medium text-text-tertiary tabular-nums">
          {average.toFixed(1)} avg
        </span>
      </div>
      <div className="mt-1 flex flex-col">
        {CRITERIA.map((criterion) => (
          <div key={criterion.id} className="flex h-6 items-center justify-between gap-2">
            <span className="min-w-0 truncate text-caption-1-regular text-text-secondary">{criterion.label}</span>
            <div role="group" aria-label={`${criterion.label} rating out of 5`} className="flex shrink-0 items-center">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-label={`${criterion.label}: ${value} of 5`}
                  aria-pressed={ratings[criterion.id] === value}
                  onClick={() => rate(criterion.id, value)}
                  className={cx("rounded-sm p-0.5", focusRing)}
                >
                  <RiStarFill
                    className={cx(
                      "size-3.5 transition-[color,transform] duration-150 ease-out motion-reduce:transition-none",
                      value <= ratings[criterion.id]
                        ? "text-accent-600"
                        : "text-foreground-icon-quaternary hover:text-foreground-icon-secondary",
                    )}
                    aria-hidden
                  />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <textarea
        aria-label="Panel notes"
        rows={1}
        maxLength={140}
        value={notes}
        onChange={(event) => {
          setNotes(event.target.value);
          setSubmitted(false);
        }}
        className={cx(
          "mt-1 h-8 w-full resize-none rounded-lg bg-background-tertiary-default px-2 py-1.5",
          "text-caption-2-regular text-text-primary outline-none placeholder:text-text-placeholder",
          focusRing,
        )}
      />
      <div className="mt-1 flex items-center justify-between gap-2">
        <span
          role="status"
          className={cx(
            "flex min-w-0 items-center gap-1 truncate text-caption-2-regular transition-[color] duration-200 ease-out motion-reduce:transition-none",
            submitted ? "text-status-lime-text" : "text-text-tertiary",
          )}
        >
          {submitted ? (
            <>
              <RiCheckLine className="size-3 shrink-0" aria-hidden />
              Shared with the panel
            </>
          ) : (
            `${notes.length} of 140 characters`
          )}
        </span>
        <button type="button" onClick={() => setSubmitted(true)} className={cx(primaryButton, "h-7 shrink-0")}>
          {submitted ? (
            <>
              <RiCheckLine className="size-3" aria-hidden />
              Submitted
            </>
          ) : (
            "Submit scorecard"
          )}
        </button>
      </div>
    </section>
  );
}

/* 5. Offer Letter */

const OFFER_SALARIES = ["$155k", "$165k", "$175k"] as const;

const OFFER_STARTS = ["5 Jan 2027", "19 Jan 2027"] as const;

const offerChoice = (active: boolean) =>
  cx(
    "h-6 flex-1 rounded-md text-caption-2-semibold transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
    focusRing,
    active
      ? "bg-accent-600 text-text-white shadow-xs"
      : "bg-background-tertiary-default text-text-secondary hover:bg-background-tertiary-hover",
  );

export function OfferLetter() {
  const [salaryIndex, setSalaryIndex] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [preview, setPreview] = useState(false);
  const [sent, setSent] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef(false);
  const salary = OFFER_SALARIES[salaryIndex];
  const start = OFFER_STARTS[startIndex];

  const closePreview = () => {
    returnFocus.current = true;
    setPreview(false);
  };
  useEscape(preview, closePreview);
  useEffect(() => {
    if (preview) {
      closeRef.current?.focus();
    } else if (returnFocus.current) {
      returnFocus.current = false;
      triggerRef.current?.focus();
    }
  }, [preview]);

  return (
    <section className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      {preview ? (
        <div role="region" aria-label="Offer letter preview" className="animate-label-in motion-reduce:animate-none">
          <div className="flex items-center justify-between gap-2">
            <span className="text-caption-2-semibold tracking-wide text-accent-600 uppercase">Northline</span>
            <button ref={closeRef} type="button" aria-label="Close offer preview" onClick={closePreview} className={iconButton}>
              <RiCloseLine className="size-3.5" aria-hidden />
            </button>
          </div>
          <p className="mt-1 text-body-2-semibold text-text-primary">Dear Amara,</p>
          <p className="mt-0.5 text-caption-2-regular text-text-secondary">
            We would love you to join Northline as Senior Product Designer. Full-time, remote in Portugal, four studio days a quarter.
          </p>
          <p className="mt-1.5 rounded-lg bg-background-secondary-default px-2 py-1.5 text-caption-1-semibold text-text-primary">
            {salary} base · starts <bdi dir="ltr">{start}</bdi> · equity 0.08%
          </p>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <span className={cx("min-w-0 truncate", metaText)}>Priya Nair · Design Director</span>
            <button
              type="button"
              onClick={() => setSent(true)}
              className={cx(
                sent
                  ? cx(secondaryButton, "h-7 border-status-lime-text/30 bg-status-lime-background text-status-lime-text")
                  : primaryButton,
                "h-7 shrink-0",
              )}
            >
              {sent ? <RiCheckLine className="size-3" aria-hidden /> : <RiSendPlaneLine className="size-3" aria-hidden />}
              {sent ? "Sent" : "Send offer"}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-body-2-semibold text-text-primary">Offer letter</h3>
              <p className={cx(metaText, "truncate")}>Amara Okafor · Product Designer</p>
            </div>
            <span
              className={cx(
                "shrink-0 rounded-full px-1.5 py-0.5 text-caption-2-medium transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
                sent ? "bg-status-lime-background text-status-lime-text" : "bg-background-tertiary-default text-text-secondary",
              )}
            >
              {sent ? "Sent" : "Draft"}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="w-12 shrink-0 text-caption-2-medium text-text-tertiary">Base</span>
            <div role="group" aria-label="Base salary" className="flex flex-1 gap-1">
              {OFFER_SALARIES.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={salaryIndex === index}
                  onClick={() => {
                    setSalaryIndex(index);
                    setSent(false);
                  }}
                  className={offerChoice(salaryIndex === index)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="w-12 shrink-0 text-caption-2-medium text-text-tertiary">Start</span>
            <div role="group" aria-label="Start date" className="flex flex-1 gap-1">
              {OFFER_STARTS.map((option, index) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={startIndex === index}
                  onClick={() => {
                    setStartIndex(index);
                    setSent(false);
                  }}
                  className={offerChoice(startIndex === index)}
                >
                  <bdi dir="ltr">{option}</bdi>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className={cx(metaText, "truncate")}>Equity 0.08% · reports to Priya</span>
            <button ref={triggerRef} type="button" aria-expanded={preview} onClick={() => setPreview(true)} className={cx(primaryButton, "h-7 shrink-0")}>
              <RiEyeLine className="size-3" aria-hidden /> Preview
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* 6. Job Post */

type JobStatus = "draft" | "publishing" | "live";

const jobInput = cx(
  "h-7 min-w-0 flex-1 rounded-lg bg-background-tertiary-default px-2 text-caption-1-medium text-text-primary outline-none placeholder:text-text-placeholder disabled:text-text-tertiary",
  focusRing,
);

export function JobPost() {
  const titleId = useId();
  const locationId = useId();
  const descriptionId = useId();
  const [title, setTitle] = useState("Senior Product Designer");
  const [location, setLocation] = useState("Remote · EU");
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [status, setStatus] = useState<JobStatus>("draft");

  useEffect(() => {
    if (status !== "publishing") return;
    const timer = window.setTimeout(() => setStatus("live"), 900);
    return () => window.clearTimeout(timer);
  }, [status]);

  useEscape(descriptionOpen, () => setDescriptionOpen(false));

  return (
    <section aria-label="Job post" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Job post</h3>
        <span
          role="status"
          className={cx(
            "rounded-full px-1.5 py-0.5 text-caption-2-medium transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
            status === "live" ? "bg-status-lime-background text-status-lime-text" : "bg-background-tertiary-default text-text-secondary",
          )}
        >
          {status === "live" ? "Live" : status === "publishing" ? "Publishing" : "Draft"}
        </span>
      </div>
      <div className="mt-1.5 flex items-center gap-1.5">
        <label htmlFor={titleId} className="w-12 shrink-0 text-caption-2-medium text-text-tertiary">
          Title
        </label>
        <input
          id={titleId}
          value={title}
          disabled={status === "live"}
          onChange={(event) => setTitle(event.target.value)}
          className={jobInput}
        />
      </div>
      <div className="mt-1 flex items-center gap-1.5">
        <label htmlFor={locationId} className="w-12 shrink-0 text-caption-2-medium text-text-tertiary">
          Location
        </label>
        <input
          id={locationId}
          value={location}
          disabled={status === "live"}
          onChange={(event) => setLocation(event.target.value)}
          className={jobInput}
        />
      </div>
      <button
        type="button"
        aria-expanded={descriptionOpen}
        aria-controls={descriptionId}
        onClick={() => setDescriptionOpen((current) => !current)}
        className={cx(
          quietButton,
          "mt-1.5 h-6 w-full justify-between rounded-md border border-separator-border px-1.5",
        )}
      >
        <span className="flex items-center gap-1">
          <RiFileTextLine className="size-3 text-foreground-icon-tertiary" aria-hidden />
          Description
        </span>
        <span className="flex items-center gap-1">
          {descriptionOpen ? "Hide" : "Preview"}
          <RiArrowDownSLine
            className={cx(
              "size-3.5 transition-[transform] duration-200 ease-out motion-reduce:transition-none",
              descriptionOpen && "rotate-180",
            )}
            aria-hidden
          />
        </span>
      </button>
      <div
        id={descriptionId}
        inert={!descriptionOpen}
        className={cx(revealGrid, descriptionOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="pt-1 text-caption-2-regular text-text-secondary">
            Own the workspace surface end to end with product and engineering. Five years in
            product design, a systems portfolio, and comfort running research.
          </p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className={cx("min-w-0 truncate", metaText)}>
          {status === "live" ? "Live · 14 views" : "Not visible to candidates"}
        </span>
        {status === "live" ? (
          <div className="flex shrink-0 items-center gap-1">
            <span className="flex h-7 items-center gap-1 rounded-lg bg-status-lime-background px-2 text-caption-1-semibold text-status-lime-text">
              <RiCheckLine className="size-3" aria-hidden />
              Published
            </span>
            <button type="button" onClick={() => setStatus("draft")} className={quietButton}>
              Edit
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={status === "publishing" || !title.trim() || !location.trim()}
            onClick={() => setStatus("publishing")}
            className={cx(primaryButton, "h-7 shrink-0")}
          >
            {status === "publishing" ? (
              <>
                <RiLoader4Line className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
                Publishing
              </>
            ) : (
              <>
                <RiSendPlaneLine className="size-3" aria-hidden />
                Publish
              </>
            )}
          </button>
        )}
      </div>
    </section>
  );
}

/* 7. Resume Row */

type ParseStatus = "queued" | "parsing" | "parsed";

export function ResumeRow() {
  const [status, setStatus] = useState<ParseStatus>("queued");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (status !== "parsing") return;
    setProgress(12);
    const interval = window.setInterval(() => setProgress((current) => Math.min(100, current + 14)), 120);
    const timer = window.setTimeout(() => setStatus("parsed"), 1100);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timer);
    };
  }, [status]);

  return (
    <section aria-label="Resume file Amara-Okafor-Resume.pdf" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background-tertiary-default text-foreground-icon-secondary">
          <RiFilePdf2Line className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p dir="ltr" className="truncate text-start text-caption-1-semibold text-text-primary">
            Amara-Okafor-Resume.pdf
          </p>
          <p className={cx(metaText, "truncate")}>PDF · 184 KB · uploaded 2h ago</p>
        </div>
        <span
          className={cx(
            "flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-caption-2-medium transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
            status === "parsed"
              ? "bg-status-lime-background text-status-lime-text"
              : status === "parsing"
                ? "bg-status-yellow-background text-status-yellow-text"
                : "bg-background-tertiary-default text-text-secondary",
          )}
        >
          {status === "parsing" && <RiLoader4Line className="size-3 animate-spin motion-reduce:animate-none" aria-hidden />}
          {status === "parsed" && <RiCheckLine className="size-3" aria-hidden />}
          {status === "parsed" ? "Parsed" : status === "parsing" ? "Parsing" : "Queued"}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="Resume parsing progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={status === "parsed" ? 100 : progress}
        className={cx(
          revealGrid,
          status === "parsing" ? "mt-2 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="h-1 overflow-hidden rounded-full bg-background-tertiary-default">
            <div
              className="h-full rounded-full bg-accent-500 transition-[width] duration-150 ease-out motion-reduce:transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      <div
        inert={status !== "parsed"}
        className={cx(revealGrid, status === "parsed" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="mt-1.5 flex items-center gap-1 truncate text-caption-2-regular text-text-secondary">
            <RiUserStarLine className="size-3 shrink-0 text-accent-600" aria-hidden />
            6 yrs experience · Figma, systems, prototyping
          </p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className={cx("min-w-0 truncate", metaText)}>
          {status === "parsed" ? "Matched to PRD-118" : status === "parsing" ? `${progress}% parsed` : "Waiting to start"}
        </span>
        <button
          type="button"
          onClick={() => setStatus(status === "parsing" ? "queued" : "parsing")}
          disabled={status === "parsing"}
          className={cx(status === "parsed" ? secondaryButton : primaryButton, "h-7 shrink-0")}
        >
          {status === "parsing" ? (
            <>
              <RiLoader4Line className="size-3 animate-spin motion-reduce:animate-none" aria-hidden />
              Parsing
            </>
          ) : (
            <>
              <RiRefreshLine className="size-3" aria-hidden />
              {status === "parsed" ? "Re-parse" : "Parse resume"}
            </>
          )}
        </button>
      </div>
    </section>
  );
}

/* 8. Stage Chip */

export function StageChip() {
  const menuId = useId();
  const [stage, setStage] = useState<Stage>("Screen");
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("Panel notified automatically");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = usePopoverDismiss(open, () => setOpen(false));

  const choose = (next: Stage) => {
    if (next !== stage) {
      setStage(next);
      setNote(next === "Hired" ? "Marked hired · offer accepted" : `Moved to ${next} · panel notified`);
    }
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <section aria-label="Candidate stage for Jonas Weber" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-2">
        <Avatar size="sm" color="lime" initials="JW" aria-hidden />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Jonas Weber</h3>
          <p className={cx(metaText, "truncate")}>Staff Frontend Engineer · Berlin</p>
        </div>
        <span className="shrink-0 text-caption-2-medium text-text-tertiary tabular-nums">4.6</span>
      </div>
      <div
        ref={menuRef}
        onKeyDown={(event) => {
          if (event.key !== "Escape") return;
          event.stopPropagation();
          setOpen(false);
          triggerRef.current?.focus();
        }}
        className="relative mt-2 flex items-center justify-between gap-2"
      >
        <span className="text-caption-2-medium text-text-tertiary">Stage</span>
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((current) => !current)}
          className={cx(
            "flex items-center gap-1 rounded-md p-0.5",
            "transition-[background-color] duration-150 ease-out hover:bg-background-secondary-default motion-reduce:transition-none",
            focusRing,
          )}
        >
          <StagePill stage={stage} />
          <RiArrowDownSLine
            className={cx(
              "size-3.5 text-foreground-icon-tertiary transition-[transform] duration-200 ease-out motion-reduce:transition-none",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>
        {open && (
          <div
            id={menuId}
            role="menu"
            aria-label="Move Jonas Weber to a stage"
            className="absolute end-0 top-full z-30 mt-1 w-40 animate-label-in rounded-lg border border-border-button-default bg-background-primary-default p-1 shadow-dropdown motion-reduce:animate-none"
          >
            {STAGES.map((option) => {
              const active = option === stage;
              return (
                <button
                  key={option}
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => choose(option)}
                  className={cx(
                    "flex h-7 w-full items-center gap-1.5 rounded-md px-1.5 text-start",
                    "transition-[background-color] duration-150 ease-out motion-reduce:transition-none",
                    focusRing,
                    active ? "bg-background-secondary-default" : "hover:bg-background-secondary-default",
                  )}
                >
                  <span aria-hidden className={cx("size-1.5 rounded-full", STAGE_DOT[option])} />
                  <span className="min-w-0 flex-1 truncate text-caption-1-medium text-text-primary">{option}</span>
                  {active && <RiCheckLine className="size-3 shrink-0 text-accent-600" aria-hidden />}
                </button>
              );
            })}
          </div>
        )}
      </div>
      <p aria-live="polite" className={cx("mt-1.5 truncate", metaText)}>
        {note}
      </p>
    </section>
  );
}

/* 9. Feedback Form */

const RECOMMENDATIONS = [
  { id: "strong", label: "Strong yes" },
  { id: "yes", label: "Yes" },
  { id: "no", label: "No" },
] as const;

type Recommendation = (typeof RECOMMENDATIONS)[number]["id"];

const RECOMMENDATION_ON: Record<Recommendation, string> = {
  strong: "bg-status-lime-background text-status-lime-text shadow-xs",
  yes: "bg-accent-600 text-text-white shadow-xs",
  no: "bg-status-rose-background text-status-rose-text shadow-xs",
};

export function FeedbackForm() {
  const notesId = useId();
  const [recommendation, setRecommendation] = useState<Recommendation>("yes");
  const [comments, setComments] = useState("Would pair well with a senior IC. Strong on systems, quieter in the panel.");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section aria-label="Interview feedback for Jonas Weber" className={cx(cardSurface, "max-w-[320px] p-2")}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-body-2-semibold text-text-primary">Interview feedback</h3>
          <p className={cx(metaText, "truncate")}>Jonas Weber · Frontend panel</p>
        </div>
        {submitted && (
          <span className="flex shrink-0 animate-label-in items-center gap-1 text-caption-2-medium text-status-lime-text motion-reduce:animate-none">
            <RiCheckLine className="size-3" aria-hidden />
            Shared
          </span>
        )}
      </div>
      <div role="group" aria-label="Recommendation" className="mt-1.5 flex gap-1 rounded-lg bg-background-tertiary-default p-0.5">
        {RECOMMENDATIONS.map((option) => {
          const active = recommendation === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setRecommendation(option.id);
                setSubmitted(false);
              }}
              className={cx(
                "h-7 flex-1 rounded-md text-caption-1-semibold",
                "transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                active ? RECOMMENDATION_ON[option.id] : "text-text-secondary hover:bg-background-tertiary-hover",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <div className="mt-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <label htmlFor={notesId} className="text-caption-2-medium text-text-tertiary">
            Comments
          </label>
          <span className={cx(metaText, "tabular-nums")}>{comments.length}/140</span>
        </div>
        <textarea
          id={notesId}
          rows={2}
          maxLength={140}
          value={comments}
          onChange={(event) => {
            setComments(event.target.value);
            setSubmitted(false);
          }}
          className={cx(
            "mt-0.5 h-10 w-full resize-none rounded-lg bg-background-tertiary-default px-2 py-1.5",
            "text-caption-2-regular text-text-primary outline-none placeholder:text-text-placeholder",
            focusRing,
          )}
        />
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span className={cx("min-w-0 truncate", metaText)}>
          {submitted ? "Visible to Maya and Dev" : "Shared after you submit"}
        </span>
        <button type="button" onClick={() => setSubmitted(true)} className={cx(primaryButton, "h-7 shrink-0")}>
          {submitted ? (
            <>
              <RiCheckLine className="size-3" aria-hidden />
              Submitted
            </>
          ) : (
            <>
              <RiSendPlaneLine className="size-3" aria-hidden />
              Submit feedback
            </>
          )}
        </button>
      </div>
    </section>
  );
}

/* 10. Referral Card */

type ReferralStatus = "idle" | "sending" | "sent";

export function ReferralCard() {
  const [status, setStatus] = useState<ReferralStatus>("idle");

  useEffect(() => {
    if (status !== "sending") return;
    const timer = window.setTimeout(() => setStatus("sent"), 1000);
    return () => window.clearTimeout(timer);
  }, [status]);

  return (
    <section aria-label="Referral for Amara Okafor" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
          <RiUserAddLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Referral</h3>
          <p className={cx(metaText, "truncate")}>Introduced by Maya Chen · Design</p>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-status-lime-background px-1.5 py-0.5 text-caption-2-medium text-status-lime-text">
          <RiMoneyDollarCircleLine className="size-3" aria-hidden />
          $3,000
        </span>
      </div>
      <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-background-secondary-default px-1.5 py-1.5">
        <Avatar size="sm" color="lime" initials="MC" aria-hidden />
        <div className="min-w-0">
          <p className="truncate text-caption-2-semibold text-text-primary">Maya Chen</p>
          <p className={cx(metaText, "truncate")}>Design Director</p>
        </div>
        <RiArrowRightLine className="mx-0.5 size-3 shrink-0 text-foreground-icon-tertiary rtl:-scale-x-100" aria-hidden />
        <Avatar size="sm" color="blue" initials="AO" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-2-semibold text-text-primary">Amara Okafor</p>
          <p className={cx(metaText, "truncate")}>Product Designer</p>
        </div>
      </div>
      <div role="group" aria-label="Referral milestones" className="mt-1.5 flex items-center gap-1">
        {["Intro", "Interview", "Day 90"].map((milestone, index) => {
          const done = status === "sent" && index === 0;
          return (
            <span key={milestone} className="flex min-w-0 flex-1 items-center gap-1">
              <span
                className={cx(
                  "size-1.5 shrink-0 rounded-full transition-[background-color] duration-200 ease-out motion-reduce:transition-none",
                  done ? "bg-status-lime-text" : index === 0 ? "bg-accent-500" : "bg-background-quaternary-default",
                )}
              />
              <span className={cx("truncate text-caption-2-regular", done ? "text-status-lime-text" : "text-text-tertiary")}>
                {milestone}
              </span>
            </span>
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span aria-live="polite" className={cx("min-w-0 truncate", metaText)}>
          {status === "sent" ? "Paid 90 days after start" : "Maya earns $3,000 on day 90"}
        </span>
        {status === "sent" ? (
          <div className="flex shrink-0 items-center gap-1">
            <span className="flex h-7 animate-label-in items-center gap-1 rounded-lg bg-status-lime-background px-2 text-caption-1-semibold text-status-lime-text motion-reduce:animate-none">
              <RiCheckLine className="size-3" aria-hidden />
              Intro sent
            </span>
            <button type="button" onClick={() => setStatus("idle")} className={quietButton}>
              Undo
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={status === "sending"}
            onClick={() => setStatus("sending")}
            className={cx(primaryButton, "h-7 shrink-0")}
          >
            {status === "sending" ? (
              <>
                <RiLoader4Line className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
                Sending
              </>
            ) : (
              <>
                <RiSendPlaneLine className="size-3" aria-hidden />
                Send intro
              </>
            )}
          </button>
        )}
      </div>
    </section>
  );
}

/* 11. Hiring Plan */

const HIRING_TEAMS = [
  { id: "design", name: "Design", detail: "Product, brand" },
  { id: "engineering", name: "Engineering", detail: "Platform, mobile" },
  { id: "data", name: "Data", detail: "Analytics, ML" },
] as const;

type TeamId = (typeof HIRING_TEAMS)[number]["id"];

const INITIAL_HEADCOUNT: Record<TeamId, number> = { design: 3, engineering: 4, data: 1 };
const APPROVED_HEADCOUNT = 9;

export function HiringPlan() {
  const [counts, setCounts] = useState<Record<TeamId, number>>(INITIAL_HEADCOUNT);
  const total = HIRING_TEAMS.reduce((sum, team) => sum + counts[team.id], 0);
  const over = total > APPROVED_HEADCOUNT;

  const step = (id: TeamId, delta: number) => {
    setCounts((current) => ({ ...current, [id]: Math.max(0, Math.min(8, current[id] + delta)) }));
  };

  return (
    <section aria-label="Hiring plan for Q1 2027" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-body-2-semibold text-text-primary">Hiring plan · Q1 2027</h3>
          <p className={cx(metaText, "truncate")}>Approved by Dev Raman · 9 seats</p>
        </div>
        <span
          aria-live="polite"
          className={cx(
            "flex shrink-0 items-baseline gap-1 text-body-2-semibold tabular-nums transition-[color] duration-200 ease-out motion-reduce:transition-none",
            over ? "text-text-error-primary" : "text-text-primary",
          )}
        >
          {total}
          <span className="text-caption-2-regular">total</span>
        </span>
      </div>
      <div className="mt-1.5 flex flex-col">
        {HIRING_TEAMS.map((team) => (
          <div key={team.id} className="flex h-8 items-center gap-2 border-b border-separator-border last:border-b-0">
            <div className="min-w-0 flex-1">
              <p className="truncate text-caption-1-semibold text-text-primary">{team.name}</p>
              <p className={cx(metaText, "truncate")}>{team.detail}</p>
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                aria-label={`Decrease ${team.name} headcount`}
                disabled={counts[team.id] === 0}
                onClick={() => step(team.id, -1)}
                className={cx(iconButton, "rounded-sm")}
              >
                <RiSubtractLine className="size-3" aria-hidden />
              </button>
              <span className="w-5 text-center text-caption-1-semibold text-text-primary tabular-nums">
                {counts[team.id]}
              </span>
              <button
                type="button"
                aria-label={`Increase ${team.name} headcount`}
                disabled={counts[team.id] === 8}
                onClick={() => step(team.id, 1)}
                className={cx(iconButton, "rounded-sm")}
              >
                <RiAddLine className="size-3" aria-hidden />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <div
          role="progressbar"
          aria-label="Headcount against approved plan"
          aria-valuemin={0}
          aria-valuemax={APPROVED_HEADCOUNT}
          aria-valuenow={Math.min(total, APPROVED_HEADCOUNT)}
          aria-valuetext={`${total} of ${APPROVED_HEADCOUNT} seats`}
          className="h-1 flex-1 overflow-hidden rounded-full bg-background-tertiary-default"
        >
          <div
            className={cx(
              "h-full rounded-full transition-[width,background-color] duration-200 ease-out motion-reduce:transition-none",
              over ? "bg-status-rose-text" : "bg-accent-500",
            )}
            style={{ width: `${Math.min(100, (total / APPROVED_HEADCOUNT) * 100)}%` }}
          />
        </div>
        <span className={cx("shrink-0 text-caption-2-regular", over ? "text-text-error-primary" : "text-text-tertiary")}>
          {over ? `${total - APPROVED_HEADCOUNT} over plan` : `${APPROVED_HEADCOUNT - total} seats left`}
        </span>
      </div>
    </section>
  );
}

/* 12. Calendar Sync */

const SYNC_DAYS = [
  { id: "mon", label: "Mon", date: "9" },
  { id: "tue", label: "Tue", date: "10" },
  { id: "wed", label: "Wed", date: "11" },
  { id: "thu", label: "Thu", date: "12" },
  { id: "fri", label: "Fri", date: "13" },
] as const;

const SYNC_TIMES = ["09:00", "10:30", "13:00", "15:00"] as const;

const AVAILABILITY: number[][] = [
  [3, 2, 3, 1, 0],
  [3, 3, 1, 2, 0],
  [2, 3, 3, 3, 1],
  [1, 2, 3, 3, 2],
];

export function CalendarSync() {
  const [selected, setSelected] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const selectedDay = SYNC_DAYS.find((day) => selected?.startsWith(day.id));
  const selectedTime = selected?.split("-")[1];

  const choose = (value: string) => {
    setSelected((current) => (current === value ? null : value));
    setSent(false);
  };

  return (
    <section aria-label="Find a time for the interview panel" className={cx(cardSurface, "max-w-[560px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
          <RiCalendarEventLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Find a time · Panel of 3</h3>
          <p className={cx(metaText, "truncate")}>Week of 9 Nov 2026 · 45 minutes · Google Meet</p>
        </div>
        <span className="hidden shrink-0 items-center gap-1 text-caption-2-regular text-text-tertiary sm:flex">
          <span aria-hidden className="size-1.5 rounded-full bg-accent-500" />
          All free
          <span aria-hidden className="ms-1 size-1.5 rounded-full bg-background-quaternary-default" />
          Partial
        </span>
      </div>
      <div
        role="group"
        aria-label="Availability for the week of 9 November"
        className="mt-2 grid items-center gap-1"
        style={{ gridTemplateColumns: "2.25rem repeat(5, minmax(0, 1fr))" }}
      >
        <span aria-hidden />
        {SYNC_DAYS.map((day) => (
          <div key={day.id} className="text-center">
            <span className="block text-caption-2-semibold text-text-secondary">{day.label}</span>
            <span className="block text-caption-2-regular text-text-tertiary tabular-nums">{day.date}</span>
          </div>
        ))}
        {SYNC_TIMES.map((time, timeIndex) => (
          <div key={time} className="contents">
            <div className="text-caption-2-regular text-text-tertiary tabular-nums">
              <bdi dir="ltr">{time}</bdi>
            </div>
            {SYNC_DAYS.map((day, dayIndex) => {
              const free = AVAILABILITY[timeIndex][dayIndex];
              const value = `${day.id}-${time}`;
              const active = selected === value;
              const label = `${day.label} ${day.date} Nov at ${time}, ${free} of 3 panelists free`;
              return (
                <button
                  key={day.id}
                  type="button"
                  aria-label={label}
                  aria-pressed={active}
                  disabled={free === 0}
                  onClick={() => choose(value)}
                  className={cx(
                    "flex h-6 items-center justify-center rounded-md border text-caption-2-semibold tabular-nums",
                    "transition-[background-color,border-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                    focusRing,
                    active
                      ? "border-accent-500 bg-accent-600 text-text-white shadow-xs"
                      : free === 3
                        ? "border-accent-500/30 bg-accent-600/15 text-text-primary hover:bg-accent-600/25"
                        : free === 2
                          ? "border-border-button-default bg-background-secondary-default text-text-secondary hover:bg-background-tertiary-default"
                          : "border-separator-border bg-background-primary-default text-text-tertiary hover:bg-background-secondary-default",
                    free === 0 && "pointer-events-none opacity-40",
                  )}
                >
                  {active ? <RiCheckLine className="size-3" aria-hidden /> : free === 0 ? "–" : free}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span aria-live="polite" className={cx("min-w-0 truncate", metaText)}>
          {sent
            ? "Invite sent to Amara and 3 panelists"
            : selectedDay && selectedTime
              ? `${selectedDay.label} ${selectedDay.date} Nov · ${selectedTime}`
              : "Pick a slot with all three free"}
        </span>
        {sent ? (
          <span className="flex h-7 shrink-0 animate-label-in items-center gap-1 rounded-lg bg-status-lime-background px-2 text-caption-1-semibold text-status-lime-text motion-reduce:animate-none">
            <RiCheckLine className="size-3" aria-hidden />
            Invite sent
          </span>
        ) : (
          <button
            type="button"
            disabled={!selected}
            onClick={() => setSent(true)}
            className={cx(primaryButton, "h-7 shrink-0")}
          >
            <RiSendPlaneLine className="size-3" aria-hidden />
            Send invite
          </button>
        )}
      </div>
    </section>
  );
}

/* Specimens */

export const RECRUITING_SECTION: ExtendedSection = {
  id: "recruiting",
  title: "Recruiting",
  blurb: "Candidates, stages and the interview loop.",
  file: "recruiting.tsx",
  entries: [
    { name: "Candidate Card", description: "Name, role, stage and score, with a shortlist and a stage move.", Demo: CandidateCard },
    { name: "Pipeline Board", description: "Three stages, live counts and a move action on every card.", Demo: PipelineBoard, wide: true },
    { name: "Interview Slot", description: "Pick a date and a time, then confirm the panel.", Demo: InterviewSlot },
    { name: "Scorecard", description: "Rate three criteria, leave a note and share with the panel.", Demo: Scorecard },
    { name: "Offer Letter", description: "Choose salary and start date, then preview the letter.", Demo: OfferLetter },
    { name: "Job Post", description: "Edit title and location, preview the copy and publish.", Demo: JobPost },
    { name: "Resume Row", description: "A resume file that parses, with matched experience.", Demo: ResumeRow },
    { name: "Stage Chip", description: "A stage pill with a menu that moves the candidate.", Demo: StageChip },
    { name: "Feedback Form", description: "A recommendation, panel comments and a submission state.", Demo: FeedbackForm },
    { name: "Referral Card", description: "Referrer, candidate and the reward on day 90.", Demo: ReferralCard },
    { name: "Hiring Plan", description: "Headcount by team with a running total and plan line.", Demo: HiringPlan },
    { name: "Calendar Sync", description: "A week of availability and a one-click panel invite.", Demo: CalendarSync, wide: true },
  ],
};
