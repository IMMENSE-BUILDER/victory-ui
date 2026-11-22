"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import {
  RiAddLine,
  RiAlarmWarningLine,
  RiArrowDownSLine,
  RiArrowGoBackLine,
  RiArrowRightLine,
  RiBookOpenLine,
  RiChat3Line,
  RiCheckLine,
  RiCloseLine,
  RiFileTextLine,
  RiFilter3Line,
  RiFlashlightLine,
  RiInboxLine,
  RiLockLine,
  RiMoneyDollarCircleLine,
  RiPauseLine,
  RiPlayLine,
  RiRefreshLine,
  RiSearchLine,
  RiSendPlaneLine,
  RiStarFill,
  RiStarLine,
  RiTeamLine,
  RiTimerLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* Shared anatomy */

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";
const card = "w-full rounded-xl border border-border-button-default bg-background-primary-default shadow-card";
const transition =
  "transition-[background-color,border-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none";
const buttonBase = cx(
  "inline-flex items-center justify-center gap-1 rounded-lg text-caption-1-semibold",
  "transition-[transform,opacity,background-color,color,box-shadow] duration-150 ease-out",
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  "motion-reduce:transition-none motion-reduce:active:scale-100",
);
const primaryButton = cx(buttonBase, "h-8 bg-button-primary px-2.5 text-text-white shadow-xs", focusRing);
const secondaryButton = cx(buttonBase, "h-8 border border-border-button-default bg-background-primary-default px-2.5 text-text-primary shadow-xs hover:bg-background-primary-hover", focusRing);
const quietButton = cx(buttonBase, "h-7 px-1.5 text-text-secondary hover:bg-background-secondary-default hover:text-text-primary", focusRing);
const iconButton = cx("flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-icon-tertiary", "transition-[background-color,color] duration-150 ease-out hover:bg-background-secondary-default hover:text-text-primary motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-40", focusRing);
const reveal = "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none";
const fieldShell =
  "flex items-center gap-1.5 rounded-lg bg-background-tertiary-default px-2 ring-2 ring-inset ring-transparent transition-[box-shadow] duration-150 ease-out focus-within:ring-border-focus-ring motion-reduce:transition-none";
const fieldInput =
  "min-w-0 flex-1 bg-transparent text-caption-1-medium text-text-primary outline-none placeholder:text-text-placeholder";

type Tone = "accent" | "blue" | "lime" | "yellow" | "orange" | "rose" | "neutral";

const TINTS: Record<Tone, string> = {
  accent: "bg-accent-100 text-accent-700",
  blue: "bg-status-blue-background text-status-blue-text",
  lime: "bg-status-lime-background text-status-lime-text",
  yellow: "bg-status-yellow-background text-status-yellow-text",
  orange: "bg-status-orange-background text-status-orange-text",
  rose: "bg-status-rose-background text-status-rose-text",
  neutral: "bg-background-tertiary-default text-text-secondary",
};

function Pill({
  tone = "neutral",
  dot = false,
  className,
  children,
}: {
  tone?: Tone;
  dot?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-caption-2-medium",
        "transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
        TINTS[tone],
        className,
      )}
    >
      {dot && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

function Avatar({
  initials,
  tone = "neutral",
  className,
}: {
  initials: string;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cx(
        "flex size-7 shrink-0 items-center justify-center rounded-full text-caption-2-semibold",
        TINTS[tone],
        className,
      )}
    >
      {initials}
    </span>
  );
}

function spokenTime(total: number) {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  const parts = [
    minutes > 0 ? `${minutes} minute${minutes === 1 ? "" : "s"}` : "",
    seconds > 0 ? `${seconds} second${seconds === 1 ? "" : "s"}` : "",
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : "0 seconds";
}

/* 1. Ticket Row */

export function TicketRow() {
  const [resolved, setResolved] = useState(false);

  return (
    <article aria-label="Ticket 4471, urgent, from Maya Chen" className={cx(card, "max-w-[300px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-caption-2-medium text-text-tertiary">
          #4471 <span className="text-text-placeholder">·</span> 12m
        </span>
        <Pill tone="rose" dot>
          Urgent
        </Pill>
      </div>

      <div className="mt-2 flex items-start gap-2">
        <Avatar initials="MC" tone="accent" />
        <div className="min-w-0 flex-1">
          <h3
            className={cx(
              "truncate text-body-2-semibold transition-[color] duration-200 ease-out motion-reduce:transition-none",
              resolved ? "text-text-tertiary" : "text-text-primary",
            )}
          >
            Refund for a duplicate charge
          </h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">Maya Chen · Northwind Retail</p>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <span aria-live="polite">
          <Pill tone={resolved ? "lime" : "blue"} dot>
            {resolved ? "Resolved" : "Open"}
          </Pill>
        </span>
        <button
          type="button"
          aria-label={resolved ? "Reopen ticket 4471" : "Mark ticket 4471 resolved"}
          onClick={() => setResolved((value) => !value)}
          className={cx(
            quietButton,
            "h-6 px-1.5 text-caption-2-semibold",
            resolved ? "text-status-lime-text" : "text-text-secondary",
          )}
        >
          {resolved ? (
            <>
              <RiArrowGoBackLine className="size-3 rtl:-scale-x-100" aria-hidden />
              Reopen
            </>
          ) : (
            <>
              <RiCheckLine className="size-3" aria-hidden />
              Resolve
            </>
          )}
        </button>
      </div>
    </article>
  );
}

/* 2. Canned Reply */

const CANNED_REPLIES = [
  { id: "refund", name: "Refund approved", hint: "Billing · 2 lines", body: "Hi Maya — your refund of $584.00 is on its way. It usually lands in 3–5 business days." },
  { id: "delay", name: "Shipping delay", hint: "Logistics · 3 lines", body: "Hi Maya — the carrier is running two days late. Your new delivery date is Friday, Nov 7." },
  { id: "reset", name: "Password reset", hint: "Account · 2 lines", body: "Hi Maya — I sent a reset link to maya.chen@northwind.co. It expires in 30 minutes." },
] as const;

type CannedId = (typeof CANNED_REPLIES)[number]["id"];

export function CannedReply() {
  const selectId = useId();
  const [selected, setSelected] = useState<CannedId>("refund");
  const [inserted, setInserted] = useState(false);
  const active = CANNED_REPLIES.find((reply) => reply.id === selected) ?? CANNED_REPLIES[0];

  useEffect(() => {
    if (!inserted) return;
    const timer = window.setTimeout(() => setInserted(false), 1600);
    return () => window.clearTimeout(timer);
  }, [inserted]);

  return (
    <section aria-label="Canned reply" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-1.5">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
          <RiChat3Line className="size-3.5" aria-hidden />
        </span>
        <h3 className="text-body-2-semibold text-text-primary">Canned replies</h3>
        <span className="ms-auto text-caption-2-regular text-text-tertiary tabular-nums">
          {CANNED_REPLIES.length} saved
        </span>
      </div>

      <label htmlFor={selectId} className="sr-only">
        Choose a canned reply
      </label>
      <div className="relative mt-1.5">
        <select
          id={selectId}
          value={selected}
          onChange={(event) => {
            setSelected(event.target.value as CannedId);
            setInserted(false);
          }}
          className={cx(
            "h-8 w-full appearance-none rounded-lg bg-background-tertiary-default ps-2 pe-7 text-caption-1-medium text-text-primary outline-none",
            transition,
            focusRing,
          )}
        >
          {CANNED_REPLIES.map((reply) => (
            <option key={reply.id} value={reply.id}>
              {reply.name}
            </option>
          ))}
        </select>
        <RiArrowDownSLine
          aria-hidden
          className="pointer-events-none absolute end-2 top-1/2 size-3.5 -translate-y-1/2 text-foreground-icon-tertiary"
        />
      </div>

      <div className="mt-1.5 flex h-[52px] flex-col justify-center overflow-hidden rounded-lg border border-separator-border bg-background-secondary-default px-2">
        <div key={active.id} className="animate-label-in motion-reduce:animate-none">
          <p className="text-caption-2-regular text-text-tertiary">{active.hint}</p>
          <p aria-live="polite" className="mt-0.5 line-clamp-2 text-caption-1-regular text-text-secondary">
            {active.body}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setInserted(true)}
        className={cx(inserted ? secondaryButton : primaryButton, "mt-1.5 h-7 w-full")}
      >
        {inserted ? (
          <>
            <RiCheckLine className="size-3.5" aria-hidden />
            Inserted at cursor
          </>
        ) : (
          <>
            <RiAddLine className="size-3.5" aria-hidden />
            Insert reply
          </>
        )}
      </button>
    </section>
  );
}

/* 3. SLA Badge */

const SLA_TARGET = 300;
const SLA_INITIAL = 127;
const SLA_RESET = 252;

function clock(total: number) {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function SlaBadge() {
  const [remaining, setRemaining] = useState(SLA_INITIAL);
  const [running, setRunning] = useState(true);
  const ended = remaining === 0;
  const warning = remaining < SLA_TARGET / 2;
  const tone: Tone = ended || warning ? "rose" : "lime";

  useEffect(() => {
    if (!running || ended) return;
    const timer = window.setInterval(() => {
      setRemaining((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running, ended]);

  return (
    <section aria-label="First response SLA" className={cx(card, "max-w-[300px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={cx(
              "flex size-7 shrink-0 items-center justify-center rounded-lg transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
              warning ? "bg-status-rose-background text-status-rose-text" : "bg-status-lime-background text-status-lime-text",
            )}
          >
            {warning ? (
              <RiAlarmWarningLine className="size-4" aria-hidden />
            ) : (
              <RiTimerLine className="size-4" aria-hidden />
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate text-caption-1-semibold text-text-primary">First response</p>
            <p className="truncate text-caption-2-regular text-text-tertiary">Target 5 min · 10:42 AM</p>
          </div>
        </div>
        <Pill tone={tone} dot>
          {ended ? "Breached" : warning ? "At risk" : "On track"}
        </Pill>
      </div>

      <div className="mt-2 flex items-end justify-between gap-2">
        <span
          role="timer"
          aria-label={`${spokenTime(remaining)} remaining`}
          className={cx(
            "font-mono text-title-2-medium tabular-nums transition-[color] duration-200 ease-out motion-reduce:transition-none",
            warning ? "text-status-rose-text" : "text-text-primary",
          )}
        >
          {clock(remaining)}
        </span>
        <span className="text-caption-2-regular text-text-tertiary">
          {ended ? "Escalate to a lead" : running ? "Counting down" : "Clock paused"}
        </span>
      </div>

      <div
        role="progressbar"
        aria-label="Time left against the five minute target"
        aria-valuemin={0}
        aria-valuemax={SLA_TARGET}
        aria-valuenow={remaining}
        className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-background-tertiary-default"
      >
        <div
          className={cx(
            "h-full rounded-full transition-[width,background-color] duration-200 ease-out motion-reduce:transition-none",
            warning ? "bg-status-rose-text" : "bg-accent-500",
          )}
          style={{ width: `${(remaining / SLA_TARGET) * 100}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <span aria-live="polite" className="min-w-0 truncate text-caption-2-regular text-text-tertiary">
          {ended ? "Breached at 10:47 AM." : running ? "Auto-escalates at zero." : "Resume when ready."}
        </span>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            aria-label={running ? "Pause SLA clock" : "Resume SLA clock"}
            disabled={ended}
            onClick={() => setRunning((value) => !value)}
            className={iconButton}
          >
            {running ? (
              <RiPauseLine className="size-3.5" aria-hidden />
            ) : (
              <RiPlayLine className="size-3.5" aria-hidden />
            )}
          </button>
          <button
            type="button"
            aria-label="Reset SLA clock"
            onClick={() => {
              setRemaining(SLA_RESET);
              setRunning(true);
            }}
            className={cx(quietButton, "h-6 px-1.5 text-caption-2-semibold")}
          >
            <RiRefreshLine className="size-3" aria-hidden />
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}

/* 4. Customer Card */

const CUSTOMER_TICKETS = [
  { id: "4471", subject: "Refund for a duplicate charge", status: "Open", date: "Nov 4" },
  { id: "4388", subject: "Address change on order 4388", status: "Resolved", date: "Oct 28" },
  { id: "4302", subject: "Invoice copy for March", status: "Resolved", date: "Oct 12" },
] as const;

export function CustomerCard() {
  const olderId = useId();
  const [expanded, setExpanded] = useState(false);
  const visible = CUSTOMER_TICKETS.slice(0, 2);
  const older = CUSTOMER_TICKETS[2];

  return (
    <section aria-label="Customer summary" className={cx(card, "max-w-[300px] p-2.5")}>
      <div className="flex items-start gap-2">
        <Avatar initials="MC" tone="accent" className="size-8" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-body-2-semibold text-text-primary">Maya Chen</h3>
            <Pill tone="accent" className="px-1 py-0 text-caption-2-semibold">
              Pro
            </Pill>
          </div>
          <p className="truncate text-caption-2-regular text-text-tertiary">
            Northwind Retail · since Mar 2023
          </p>
        </div>
      </div>

      <p className="mt-1.5 flex items-center gap-1 text-caption-2-regular text-text-tertiary">
        <RiMoneyDollarCircleLine className="size-3.5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
        <span className="text-text-secondary tabular-nums">$4,280</span> lifetime
        <span aria-hidden className="text-text-placeholder">·</span>
        <span className="tabular-nums">6</span> tickets
        <span aria-hidden className="text-text-placeholder">·</span>
        CSAT <span className="text-text-secondary tabular-nums">4.8</span>
      </p>

      <div className="mt-1.5 flex items-baseline justify-between gap-2">
        <h4 className="text-caption-1-semibold text-text-primary">Recent tickets</h4>
        <span className="text-caption-2-regular text-text-tertiary tabular-nums">last 30 days</span>
      </div>

      <ul className="mt-0.5 flex flex-col">
        {visible.map((ticket) => (
          <li
            key={ticket.id}
            className="flex h-5 items-center gap-1.5 border-b border-separator-border"
          >
            <span
              aria-hidden
              className={cx(
                "size-1.5 shrink-0 rounded-full",
                ticket.status === "Open" ? "bg-status-blue-text" : "bg-status-lime-text",
              )}
            />
            <span className="sr-only">{ticket.status}: </span>
            <span className="min-w-0 flex-1 truncate text-caption-1-regular text-text-secondary">
              {ticket.subject}
            </span>
            <span className="shrink-0 font-mono text-caption-2-regular text-text-tertiary tabular-nums">
              {ticket.date}
            </span>
          </li>
        ))}
      </ul>

      <div
        id={olderId}
        inert={!expanded}
        className={cx(reveal, expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="flex h-5 items-center gap-1.5">
            <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-status-lime-text" />
            <span className="sr-only">{older.status}: </span>
            <span className="min-w-0 flex-1 truncate text-caption-1-regular text-text-secondary">
              {older.subject}
            </span>
            <span className="shrink-0 font-mono text-caption-2-regular text-text-tertiary tabular-nums">
              {older.date}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={olderId}
        onClick={() => setExpanded((value) => !value)}
        className={cx(quietButton, "mt-1 h-6 w-full justify-start px-1 text-caption-2-semibold")}
      >
        <RiArrowDownSLine
          className={cx(
            "size-3.5 transition-[transform] duration-200 ease-out motion-reduce:transition-none",
            expanded && "rotate-180",
          )}
          aria-hidden
        />
        {expanded ? "Show fewer" : "Show 1 older ticket"}
      </button>
    </section>
  );
}

/* 5. Conversation View */

const CONVERSATION = [
  { id: "maya", from: "Maya Chen", initials: "MC", mine: false, text: "Charged twice for order #8842.", time: "9:41" },
  { id: "dev", from: "Dev Raman", initials: "DR", mine: true, text: "Checking the payment log now.", time: "9:43" },
] as const;

export function ConversationView() {
  const [note, setNote] = useState(false);
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!sent) return;
    const timer = window.setTimeout(() => setSent(false), 1600);
    return () => window.clearTimeout(timer);
  }, [sent]);

  const send = () => {
    if (!draft.trim()) return;
    setDraft("");
    setSent(true);
  };

  return (
    <section aria-label="Ticket conversation" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Conversation</h3>
        <Pill tone="blue" dot>Open</Pill>
        <span className="ms-auto text-caption-2-regular text-text-tertiary tabular-nums">2 messages</span>
      </div>

      <div className="mt-1.5 flex flex-col gap-1">
        {CONVERSATION.map((message) => {
          const avatar = <Avatar initials={message.initials} tone={message.mine ? "blue" : "neutral"} className="size-5 text-caption-2-semibold" />;
          const bubble = (
            <div className={cx("max-w-[86%] rounded-lg px-1.5 py-0.5", message.mine ? "bg-accent-600 text-text-white" : "bg-background-secondary-default text-text-primary")}>
              <div className="flex items-baseline gap-1.5">
                <span className="text-caption-2-semibold">{message.from}</span>
                <span className="text-caption-2-regular opacity-70">{message.time}</span>
              </div>
              <p className="text-caption-1-regular">{message.text}</p>
            </div>
          );
          return (
            <div key={message.id} className={cx("flex items-start gap-1.5", message.mine && "justify-end")}>
              {message.mine ? <>{bubble}{avatar}</> : <>{avatar}{bubble}</>}
            </div>
          );
        })}
      </div>

      <div className={cx("mt-2 rounded-lg p-1 ring-1 transition-[background-color,box-shadow] duration-200 ease-out motion-reduce:transition-none", note ? "bg-status-yellow-background ring-status-yellow-text/30" : "bg-background-tertiary-default ring-transparent")}>
        <div className="flex items-center gap-1">
          <button type="button" role="switch" aria-checked={note} onClick={() => { setNote((value) => !value); setSent(false); }} className={cx("flex items-center gap-1.5 rounded-md px-0.5 py-0.5", focusRing)}>
            <span aria-hidden className={cx("flex h-4 w-7 items-center rounded-full p-0.5 transition-[background-color] duration-200 ease-out motion-reduce:transition-none", note ? "bg-status-yellow-text" : "bg-background-tertiary-hover")}>
              <span className={cx("size-3 rounded-full bg-background-primary-default shadow-xs transition-transform duration-200 ease-out motion-reduce:transition-none", note ? "translate-x-3 rtl:-translate-x-3" : "translate-x-0")} />
            </span>
            <span className={cx("flex items-center gap-1 text-caption-2-semibold transition-[color] duration-150 ease-out motion-reduce:transition-none", note ? "text-status-yellow-text" : "text-text-secondary")}>
              {note ? <RiLockLine className="size-3" aria-hidden /> : <RiChat3Line className="size-3" aria-hidden />}
              Internal note
            </span>
          </button>
          <span key={`${note}-${sent}`} aria-live="polite" className="ms-auto animate-label-in truncate text-caption-2-regular text-text-tertiary motion-reduce:animate-none">
            {sent ? (note ? "Note added" : "Reply sent") : note ? "Team only" : "Visible to Maya"}
          </span>
        </div>

        <div className="mt-1 flex items-center gap-1">
          <input
            value={draft}
            aria-label={note ? "Internal note" : "Reply to Maya Chen"}
            placeholder={note ? "Add a note for the team…" : "Write a reply…"}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); send(); } }}
            className="h-7 min-w-0 flex-1 rounded-sm bg-transparent px-1 text-caption-1-medium text-text-primary outline-none placeholder:text-text-placeholder focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          />
          <button type="button" aria-label={note ? "Add internal note" : "Send reply"} disabled={!draft.trim()} onClick={send} className={cx("flex size-7 shrink-0 items-center justify-center rounded-md transition-[background-color,color,opacity] duration-150 ease-out motion-reduce:transition-none disabled:cursor-not-allowed", draft.trim() ? "bg-button-primary text-text-white shadow-xs" : "bg-background-tertiary-hover text-foreground-icon-tertiary", focusRing)}>
            <RiSendPlaneLine className="size-3.5" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}

/* 6. CSAT Survey */

const RATINGS = [
  { value: 1, label: "Very poor" },
  { value: 2, label: "Poor" },
  { value: 3, label: "Okay" },
  { value: 4, label: "Good" },
  { value: 5, label: "Excellent" },
] as const;

export function CsatSurvey() {
  const commentId = useId();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const activeRating = RATINGS.find((item) => item.value === rating);

  if (submitted) {
    return (
      <section aria-label="Survey submitted" className={cx(card, "max-w-[300px] p-3 text-center")}>
        <span className="mx-auto flex size-9 animate-label-in items-center justify-center rounded-full bg-status-lime-background text-status-lime-text ring-8 ring-status-lime-background/40 motion-reduce:animate-none">
          <RiCheckLine className="size-4" aria-hidden />
        </span>
        <h3 className="mt-1.5 text-title-3-semibold text-text-primary">Thanks, Maya</h3>
        <p role="status" className="mt-0.5 text-caption-1-regular text-text-secondary">
          Your {rating}-star rating{comment.trim() ? " and note" : ""} went to Priya’s team.
        </p>
        {comment.trim() && (
          <p className="mt-1 line-clamp-1 rounded-md bg-background-secondary-default px-1.5 py-0.5 text-caption-2-regular text-text-tertiary">
            “{comment.trim()}”
          </p>
        )}
        <div aria-hidden className="mt-1.5 flex justify-center gap-0.5">
          {RATINGS.map((item) => (
            <RiStarFill
              key={item.value}
              className={cx(
                "size-3.5 transition-[color] duration-150 ease-out motion-reduce:transition-none",
                item.value <= rating ? "text-status-yellow-text" : "text-foreground-icon-quaternary",
              )}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setRating(0);
            setComment("");
          }}
          className={cx(quietButton, "mt-1.5 h-6 text-caption-2-semibold")}
        >
          <RiRefreshLine className="size-3" aria-hidden />
          Submit another response
        </button>
      </section>
    );
  }

  return (
    <section aria-label="Customer satisfaction survey" className={cx(card, "max-w-[300px] p-2.5")}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-body-2-semibold text-text-primary">How did we do?</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">Dev resolved #4471 in 42 min</p>
        </div>
        <Pill tone="lime" dot>
          Resolved
        </Pill>
      </div>

      <div
        role="group"
        aria-label="Rate your support experience from one to five stars"
        className="mt-2 flex items-center gap-0.5"
      >
        {RATINGS.map((item) => {
          const selected = item.value <= rating;
          return (
            <button
              key={item.value}
              type="button"
              aria-label={`${item.value} of 5, ${item.label}`}
              aria-pressed={rating === item.value}
              onClick={() => setRating(item.value)}
              className={cx("flex size-7 items-center justify-center rounded-md", focusRing)}
            >
              <span className="sr-only">{item.label}</span>
              {selected ? (
                <RiStarFill
                  className="size-5 scale-105 text-status-yellow-text transition-[color,transform] duration-150 ease-out motion-reduce:transition-none"
                  aria-hidden
                />
              ) : (
                <RiStarLine
                  className="size-5 text-foreground-icon-quaternary transition-[color,transform] duration-150 ease-out hover:text-status-yellow-text motion-reduce:transition-none"
                  aria-hidden
                />
              )}
            </button>
          );
        })}
        <span
          key={rating}
          aria-live="polite"
          className="ms-1 animate-label-in text-caption-2-semibold text-text-secondary motion-reduce:animate-none"
        >
          {activeRating?.label ?? "Pick a rating"}
        </span>
      </div>

      <label htmlFor={commentId} className="sr-only">
        Comment
      </label>
      <input
        id={commentId}
        value={comment}
        placeholder="Anything we could do better?"
        onChange={(event) => setComment(event.target.value)}
        className={cx(
          "mt-1.5 h-8 w-full rounded-lg bg-background-tertiary-default px-2 text-caption-1-medium text-text-primary outline-none placeholder:text-text-placeholder",
          transition,
          focusRing,
        )}
      />

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span className="text-caption-2-regular text-text-tertiary">Optional note</span>
        <button
          type="button"
          disabled={rating === 0}
          onClick={() => setSubmitted(true)}
          className={cx(primaryButton, "h-7 px-2.5")}
        >
          <RiSendPlaneLine className="size-3.5" aria-hidden />
          Send feedback
        </button>
      </div>
    </section>
  );
}

/* 7. Macro Picker */

const MACROS = [
  { id: "refund", title: "Refund approved", category: "Billing", body: "Your refund is approved and should land in 3–5 business days." },
  { id: "delay", title: "Shipping delay", category: "Logistics", body: "The carrier is two days behind. I’ll send tracking as soon as it moves." },
  { id: "reset", title: "Password reset", category: "Account", body: "I sent a reset link that expires in 30 minutes." },
] as const;

type MacroId = (typeof MACROS)[number]["id"];

export function MacroPicker() {
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState<MacroId | null>(null);
  const needle = query.trim().toLowerCase();
  const matches = MACROS.filter((macro) =>
    `${macro.title} ${macro.category} ${macro.body}`.toLowerCase().includes(needle),
  );
  const shown = matches;
  const appliedMacro = MACROS.find((macro) => macro.id === applied);

  useEffect(() => {
    if (!applied) return;
    const timer = window.setTimeout(() => setApplied(null), 1800);
    return () => window.clearTimeout(timer);
  }, [applied]);

  return (
    <section aria-label="Macro picker" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-1.5">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
          <RiFlashlightLine className="size-3.5" aria-hidden />
        </span>
        <h3 className="text-body-2-semibold text-text-primary">Macros</h3>
        <span className="ms-auto text-caption-2-regular text-text-tertiary tabular-nums">
          {matches.length} of {MACROS.length}
        </span>
      </div>

      <div className={cx(fieldShell, "mt-1.5 h-8")}>
        <RiSearchLine className="size-3.5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
        <input
          type="search"
          aria-label="Search macros"
          placeholder="Search macros"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className={cx(fieldInput, "[&::-webkit-search-cancel-button]:appearance-none")}
        />
        {query && (
          <button
            type="button"
            aria-label="Clear macro search"
            onClick={() => setQuery("")}
            className={cx("flex size-5 shrink-0 items-center justify-center rounded-sm text-foreground-icon-tertiary hover:text-text-primary", focusRing)}
          >
            <RiCloseLine className="size-3" aria-hidden />
          </button>
        )}
      </div>

      {shown.length > 0 ? (
        <ul className="mt-1 flex flex-col">
          {shown.map((macro) => {
            const active = applied === macro.id;
            return (
              <li key={macro.id}>
                <button
                  type="button"
                  aria-label={`Apply ${macro.title} macro`}
                  onClick={() => setApplied(macro.id)}
                  className={cx(
                    "group flex h-6 w-full items-center gap-1.5 rounded-md px-1 text-start",
                    "transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
                    focusRing,
                    active ? "bg-status-lime-background" : "hover:bg-background-secondary-default",
                  )}
                >
                  <span
                    className={cx(
                      "min-w-0 flex-1 truncate text-caption-1-medium",
                      active ? "text-status-lime-text" : "text-text-primary",
                    )}
                  >
                    {macro.title}
                  </span>
                  <span className="shrink-0 text-caption-2-regular text-text-tertiary">{macro.category}</span>
                  {active ? (
                    <RiCheckLine className="size-3.5 shrink-0 text-status-lime-text" aria-hidden />
                  ) : (
                    <RiAddLine
                      className={cx(
                        "size-3.5 shrink-0 text-foreground-icon-quaternary opacity-60",
                        "transition-opacity duration-150 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none",
                      )}
                      aria-hidden
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="flex h-[84px] items-center justify-center px-2 text-center text-caption-1-regular text-text-tertiary">
          No macro matches “{query.trim()}”.
        </p>
      )}

      <p aria-live="polite" className="mt-1 min-h-4 truncate text-caption-2-regular text-text-tertiary">
        {appliedMacro ? `${appliedMacro.title} applied at the cursor.` : "Type to filter, click to apply."}
      </p>
    </section>
  );
}

/* 8. Queue Filter */

type QueueStatus = "open" | "pending" | "resolved";
type QueuePriority = "high" | "normal";
type QueueTicket = { id: string; status: QueueStatus; priority: QueuePriority };

const QUEUE_TICKETS: QueueTicket[] = [
  { id: "4471", status: "open", priority: "high" },
  { id: "4468", status: "open", priority: "normal" },
  { id: "4462", status: "open", priority: "high" },
  { id: "4459", status: "pending", priority: "high" },
  { id: "4451", status: "pending", priority: "normal" },
  { id: "4444", status: "resolved", priority: "normal" },
  { id: "4438", status: "open", priority: "normal" },
  { id: "4431", status: "resolved", priority: "high" },
];

const STATUS_OPTIONS: Array<{ id: "all" | QueueStatus; label: string }> = [
  { id: "all", label: "All" },
  { id: "open", label: "Open" },
  { id: "pending", label: "Pending" },
  { id: "resolved", label: "Resolved" },
];

const PRIORITY_OPTIONS: Array<{ id: "all" | QueuePriority; label: string }> = [
  { id: "all", label: "Any" },
  { id: "high", label: "High" },
  { id: "normal", label: "Normal" },
];

const statusCount = (value: "all" | QueueStatus) =>
  value === "all" ? QUEUE_TICKETS.length : QUEUE_TICKETS.filter((ticket) => ticket.status === value).length;

const priorityCount = (value: "all" | QueuePriority) =>
  value === "all" ? QUEUE_TICKETS.length : QUEUE_TICKETS.filter((ticket) => ticket.priority === value).length;

export function QueueFilter() {
  const [status, setStatus] = useState<"all" | QueueStatus>("all");
  const [priority, setPriority] = useState<"all" | QueuePriority>("all");
  const matches = QUEUE_TICKETS.filter(
    (ticket) =>
      (status === "all" || ticket.status === status) &&
      (priority === "all" || ticket.priority === priority),
  );
  const statusLabel = STATUS_OPTIONS.find((option) => option.id === status)?.label ?? "All";
  const priorityLabel = PRIORITY_OPTIONS.find((option) => option.id === priority)?.label ?? "Any";

  return (
    <section aria-label="Queue filters" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-1.5">
        <RiFilter3Line className="size-3.5 shrink-0 text-foreground-icon-secondary" aria-hidden />
        <h3 className="text-body-2-semibold text-text-primary">Queue</h3>
        <span aria-live="polite" className="ms-auto flex items-baseline gap-1 tabular-nums">
          <span
            key={matches.length}
            className="animate-label-in font-mono text-body-2-semibold text-text-primary motion-reduce:animate-none"
          >
            {matches.length}
          </span>
          <span className="text-caption-2-regular text-text-tertiary">of {QUEUE_TICKETS.length}</span>
        </span>
      </div>

      <div role="group" aria-label="Filter by status" className="mt-2 flex flex-wrap items-center gap-1">
        {STATUS_OPTIONS.map((option) => {
          const active = status === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => setStatus(option.id)}
              className={cx(
                "flex h-6 items-center gap-1 rounded-full px-2 text-caption-2-semibold",
                "transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                active
                  ? "bg-accent-600 text-text-white shadow-xs"
                  : "bg-background-tertiary-default text-text-secondary hover:bg-background-tertiary-hover",
              )}
            >
              {option.label}
              <span className="tabular-nums opacity-70">{statusCount(option.id)}</span>
            </button>
          );
        })}
      </div>

      <div role="group" aria-label="Filter by priority" className="mt-1 flex flex-wrap items-center gap-1">
        {PRIORITY_OPTIONS.map((option) => {
          const active = priority === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => setPriority(option.id)}
              className={cx(
                "flex h-6 items-center gap-1 rounded-full px-2 text-caption-2-semibold",
                "transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                active
                  ? "bg-accent-600 text-text-white shadow-xs"
                  : "bg-background-tertiary-default text-text-secondary hover:bg-background-tertiary-hover",
              )}
            >
              {option.label}
              <span className="tabular-nums opacity-70">{priorityCount(option.id)}</span>
            </button>
          );
        })}
        <span className="ms-auto text-caption-2-regular text-text-tertiary">SLA 2h</span>
      </div>

      <p aria-live="polite" className="mt-1 truncate text-caption-2-regular text-text-tertiary">
        {statusLabel} · {priorityLabel} priority · {matches.length === 0 ? "nothing waiting" : "sorted by wait"}
      </p>
    </section>
  );
}

/* 9. Escalation Banner */

const ESCALATION_TEAMS = ["Tier 2 support", "Billing", "Trust & safety"] as const;
type EscalationTeam = (typeof ESCALATION_TEAMS)[number];

export function EscalationBanner() {
  const teamId = useId();
  const confirmId = useId();
  const confirmRef = useRef<HTMLButtonElement>(null);
  const escalateRef = useRef<HTMLButtonElement>(null);
  const [team, setTeam] = useState<EscalationTeam>("Tier 2 support");
  const [confirming, setConfirming] = useState(false);
  const [escalated, setEscalated] = useState(false);

  useEffect(() => {
    if (confirming) confirmRef.current?.focus();
  }, [confirming]);

  return (
    <section
      aria-label="Escalation required"
      onKeyDown={(event) => {
        if (event.key !== "Escape" || !confirming) return;
        event.stopPropagation();
        setConfirming(false);
        escalateRef.current?.focus();
      }}
      className={cx(card, "max-w-[320px] p-2.5")}
    >
      <div className="flex items-start gap-2">
        <span className={cx("flex size-7 shrink-0 items-center justify-center rounded-lg transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none", escalated ? "bg-status-lime-background text-status-lime-text" : "bg-status-orange-background text-status-orange-text")}>
          {escalated ? <RiCheckLine className="size-4" aria-hidden /> : <RiFlashlightLine className="size-4" aria-hidden />}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">
            {escalated ? `Escalated to ${team}` : "Refund over $500 needs a lead"}
          </h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">
            {escalated ? "Maya was notified · just now" : "Ticket #4471 · response due in 8 min"}
          </p>
        </div>
      </div>

      {!escalated && (
        <div className="mt-2 flex items-center gap-1.5">
          <div className="relative min-w-0 flex-1">
            <label htmlFor={teamId} className="sr-only">Escalate to team</label>
            <select
              id={teamId}
              value={team}
              onChange={(event) => setTeam(event.target.value as EscalationTeam)}
              className={cx("h-7 w-full appearance-none rounded-lg border border-border-button-default bg-background-primary-default ps-2 pe-6 text-caption-1-medium text-text-primary shadow-xs outline-none", transition, focusRing)}
            >
              {ESCALATION_TEAMS.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            <RiArrowDownSLine aria-hidden className="pointer-events-none absolute end-1.5 top-1/2 size-3 -translate-y-1/2 text-foreground-icon-tertiary" />
          </div>
          <button
            ref={escalateRef}
            type="button"
            aria-expanded={confirming}
            aria-controls={confirmId}
            onClick={() => setConfirming((value) => !value)}
            className={cx(secondaryButton, "h-7 shrink-0 px-2")}
          >
            {confirming ? "Cancel" : "Escalate"}
          </button>
        </div>
      )}

      <div id={confirmId} inert={!confirming} className={cx(reveal, confirming ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
        <div className="min-h-0 overflow-hidden">
          <div role="group" aria-label={`Confirm escalation to ${team}`} className="mt-2 rounded-lg bg-status-orange-background px-2 py-1.5 ring-1 ring-status-orange-text/20">
            <p className="text-caption-1-semibold text-status-orange-text">Escalate to {team}?</p>
            <p className="text-caption-2-regular text-text-secondary">Maya gets a heads-up automatically.</p>
            <div className="mt-1.5 flex items-center gap-1">
              <button ref={confirmRef} type="button" onClick={() => { setEscalated(true); setConfirming(false); }} className={cx(primaryButton, "h-6 px-2 text-caption-2-semibold")}>
                Confirm
              </button>
              <button type="button" onClick={() => { setConfirming(false); escalateRef.current?.focus(); }} className={cx(quietButton, "h-6 text-caption-2-semibold")}>
                Keep here
              </button>
            </div>
          </div>
        </div>
      </div>

      {escalated && (
        <div className="mt-2 flex items-center justify-between gap-2 border-t border-separator-border pt-1.5">
          <span className="flex min-w-0 items-center gap-1 text-caption-2-regular text-text-tertiary">
            <RiTeamLine className="size-3.5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
            <span className="truncate">Nadia Ruiz · {team}</span>
          </span>
          <button type="button" onClick={() => setEscalated(false)} className={cx(quietButton, "h-6 shrink-0 text-caption-2-semibold")}>
            Undo
          </button>
        </div>
      )}
    </section>
  );
}

/* 10. Knowledge Base */

const ARTICLES = [
  { id: "refunds", title: "Refund timelines by region", category: "Billing", updated: "2 days ago", views: "1.2k", snippet: "Card refunds settle in 3–5 business days. Bank transfers can take up to 7." },
  { id: "tracking", title: "Where is my replacement order?", category: "Shipping", updated: "4 days ago", views: "860", snippet: "Replacements leave the Bristol depot within 48 hours and carry a new tracking link." },
  { id: "password", title: "Reset a customer password", category: "Account", updated: "1 week ago", views: "2.4k", snippet: "Send a reset link from the customer card. The link expires after 30 minutes." },
  { id: "escalate", title: "When to escalate to Tier 2", category: "Process", updated: "2 weeks ago", views: "640", snippet: "Refunds over $500, legal threats or any safety issue go straight to Tier 2." },
  { id: "tags", title: "Using tags without clutter", category: "Workspace", updated: "3 weeks ago", views: "318", snippet: "Cap each queue at six tags and retire the rest every quarter." },
] as const;

type ArticleId = (typeof ARTICLES)[number]["id"];

export function KnowledgeBase() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ArticleId>("refunds");
  const needle = query.trim().toLowerCase();
  const matches = ARTICLES.filter((article) =>
    `${article.title} ${article.category} ${article.snippet}`.toLowerCase().includes(needle),
  );
  const shown = matches.slice(0, 3);
  const active = matches.find((article) => article.id === selected) ?? matches[0];

  return (
    <section aria-label="Knowledge base" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-1.5">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
          <RiBookOpenLine className="size-3.5" aria-hidden />
        </span>
        <h3 className="text-body-2-semibold text-text-primary">Help center</h3>
        <span className="ms-auto text-caption-2-regular text-text-tertiary tabular-nums">
          {matches.length === 0 ? "No matches" : `Top ${shown.length} of ${matches.length}`}
        </span>
      </div>

      <div className={cx(fieldShell, "mt-1.5 h-7")}>
        <RiSearchLine className="size-3.5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
        <input
          type="search"
          aria-label="Search help articles"
          placeholder="Search help articles"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className={cx(fieldInput, "[&::-webkit-search-cancel-button]:appearance-none")}
        />
        {query && (
          <button
            type="button"
            aria-label="Clear article search"
            onClick={() => setQuery("")}
            className={cx("flex size-5 shrink-0 items-center justify-center rounded-sm text-foreground-icon-tertiary hover:text-text-primary", focusRing)}
          >
            <RiCloseLine className="size-3" aria-hidden />
          </button>
        )}
      </div>

      {shown.length > 0 ? (
        <ul className="mt-1 flex flex-col">
          {shown.map((article) => {
            const isActive = active?.id === article.id;
            return (
              <li key={article.id}>
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelected(article.id)}
                  className={cx(
                    "flex h-6 w-full items-center gap-1.5 rounded-md px-1 text-start",
                    "transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
                    focusRing,
                    isActive ? "bg-background-secondary-default" : "hover:bg-background-secondary-default/60",
                  )}
                >
                  <RiFileTextLine
                    className={cx(
                      "size-3.5 shrink-0",
                      isActive ? "text-accent-600" : "text-foreground-icon-tertiary",
                    )}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1 truncate text-caption-1-medium text-text-primary">
                    {article.title}
                  </span>
                  <span className="shrink-0 text-caption-2-regular text-text-tertiary">{article.category}</span>
                  <RiArrowRightLine
                    className={cx(
                      "size-3 shrink-0 text-accent-600 transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none rtl:-scale-x-100",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                    aria-hidden
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex h-[72px] flex-col items-center justify-center text-center">
          <p className="text-caption-1-semibold text-text-secondary">No article matches</p>
          <p className="text-caption-2-regular text-text-tertiary">Try “refund”, “shipping” or “password”.</p>
        </div>
      )}

      <div className="mt-1 border-t border-separator-border pt-1">
        {active ? (
          <div key={active.id} aria-live="polite" className="animate-label-in motion-reduce:animate-none">
            <p className="line-clamp-1 text-caption-2-regular text-text-secondary">{active.snippet}</p>
            <p className="text-caption-2-regular text-text-tertiary tabular-nums">
              Updated {active.updated} · {active.views} views
            </p>
          </div>
        ) : (
          <p className="py-1 text-caption-2-regular text-text-tertiary">Search covers titles, tags and steps.</p>
        )}
      </div>
    </section>
  );
}

/* 11. Ticket Timeline */

type TimelineEvent = {
  id: string;
  actor: string;
  action: string;
  time: string;
  stamp: string;
  internal: boolean;
  tone: Tone;
  icon: IconComponent;
};

const TIMELINE_EVENTS: TimelineEvent[] = [
  { id: "created", actor: "Maya Chen", action: "opened the ticket", time: "9:32 AM", stamp: "2026-11-05T09:32", internal: false, tone: "blue", icon: RiInboxLine },
  { id: "reply", actor: "Dev Raman", action: "replied to Maya", time: "9:41 AM", stamp: "2026-11-05T09:41", internal: false, tone: "accent", icon: RiChat3Line },
  { id: "note", actor: "Priya Nair", action: "added an internal note", time: "9:48 AM", stamp: "2026-11-05T09:48", internal: true, tone: "yellow", icon: RiLockLine },
  { id: "escalated", actor: "Automation", action: "escalated to Tier 2", time: "10:02 AM", stamp: "2026-11-05T10:02", internal: true, tone: "rose", icon: RiFlashlightLine },
];

type TimelineFilter = "all" | "internal";

export function TicketTimeline() {
  const [filter, setFilter] = useState<TimelineFilter>("all");
  const events = filter === "all" ? TIMELINE_EVENTS : TIMELINE_EVENTS.filter((event) => event.internal);
  const allCount = TIMELINE_EVENTS.length;
  const internalCount = TIMELINE_EVENTS.filter((event) => event.internal).length;

  return (
    <section aria-label="Ticket timeline" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Timeline</h3>
        <span className="font-mono text-caption-2-regular text-text-tertiary">#4471</span>
      </div>

      <div role="group" aria-label="Filter timeline" className="mt-1.5 flex items-center gap-1">
        {([
          { id: "all", label: "All", count: allCount },
          { id: "internal", label: "Internal only", count: internalCount },
        ] as const).map((option) => {
          const active = filter === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(option.id)}
              className={cx(
                "flex h-6 items-center gap-1 rounded-full px-2 text-caption-2-semibold",
                "transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                active
                  ? "bg-accent-600 text-text-white shadow-xs"
                  : "bg-background-tertiary-default text-text-secondary hover:bg-background-tertiary-hover",
              )}
            >
              {option.label}
              <span className="tabular-nums opacity-70">{option.count}</span>
            </button>
          );
        })}
        <span className="ms-auto truncate text-caption-2-regular text-text-tertiary">Team only</span>
      </div>

      <ol key={filter} className="mt-1.5 flex animate-label-in flex-col motion-reduce:animate-none">
        {events.map((event, index) => {
          const Icon = event.icon;
          return (
            <li key={event.id} className="flex gap-1.5">
              <span aria-hidden className="flex w-5 shrink-0 flex-col items-center">
                <span className={cx("flex size-5 items-center justify-center rounded-full", TINTS[event.tone])}>
                  <Icon className="size-3" aria-hidden />
                </span>
                {index < events.length - 1 && (
                  <span className="mt-0.5 w-px flex-1 rounded-full bg-separator-border" />
                )}
              </span>
              <div className={cx("flex min-w-0 flex-1 items-baseline gap-1.5", index < events.length - 1 && "pb-3")}>
                <p className="min-w-0 flex-1 truncate text-caption-1-regular text-text-secondary">
                  <span className="text-caption-1-semibold text-text-primary">{event.actor}</span>{" "}
                  {event.action}
                </p>
                <time
                  dateTime={event.stamp}
                  className="shrink-0 font-mono text-caption-2-regular text-text-tertiary tabular-nums"
                >
                  {event.time}
                </time>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* 12. Agent Status */

type PresenceId = "online" | "away" | "busy";

const PRESENCE: Array<{ id: PresenceId; label: string; tone: Tone; dot: string; headline: string; detail: string }> = [
  { id: "online", label: "Online", tone: "lime", dot: "bg-status-lime-text", headline: "Available now", detail: "3 chats open · accepting new conversations" },
  { id: "away", label: "Away", tone: "yellow", dot: "bg-status-yellow-text", headline: "Back at 2:30 PM", detail: "Lunch · 1 chat waiting in the queue" },
  { id: "busy", label: "Busy", tone: "rose", dot: "bg-status-rose-text", headline: "Focus time until 3:00 PM", detail: "New chats route to Tier 1 while busy" },
];

export function AgentStatus() {
  const [presence, setPresence] = useState<PresenceId>("online");
  const active = PRESENCE.find((option) => option.id === presence) ?? PRESENCE[0];

  return (
    <section aria-label="Agent status" className={cx(card, "max-w-[300px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="relative shrink-0">
          <Avatar initials="PN" tone="rose" className="size-8" />
          <span
            aria-hidden
            className={cx(
              "absolute -end-0.5 -bottom-0.5 size-2.5 rounded-full ring-2 ring-background-primary-default",
              "transition-[background-color] duration-200 ease-out motion-reduce:transition-none",
              active.dot,
            )}
          />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Priya Nair</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">Support lead · Tier 2</p>
        </div>
      </div>

      <div
        role="group"
        aria-label="Set your availability"
        className="mt-2 grid grid-cols-3 gap-0.5 rounded-lg bg-segmented-control-background p-0.5"
      >
        {PRESENCE.map((option) => {
          const selected = presence === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setPresence(option.id)}
              className={cx(
                "flex h-6 items-center justify-center gap-1 rounded-md text-caption-2-semibold",
                "transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                selected ? cx(TINTS[option.tone], "shadow-xs") : "text-text-tertiary hover:text-text-primary",
              )}
            >
              <span aria-hidden className="size-1.5 rounded-full bg-current" />
              {option.label}
            </button>
          );
        })}
      </div>

      <div aria-live="polite" className="mt-2">
        <div key={active.id} className="animate-label-in motion-reduce:animate-none">
          <div className="flex items-center gap-1.5">
            <span aria-hidden className={cx("size-1.5 shrink-0 rounded-full", active.dot)} />
            <p className="text-caption-1-semibold text-text-primary">{active.headline}</p>
          </div>
          <p className="mt-0.5 text-caption-2-regular text-text-secondary">{active.detail}</p>
        </div>
      </div>
    </section>
  );
}

/* Specimens */

export const SUPPORT_SECTION: ExtendedSection = {
  id: "support",
  title: "Support",
  blurb: "Queues, context and replies that resolve.",
  file: "support.tsx",
  entries: [
    { name: "Ticket Row", description: "One queue row with priority, requester and a resolve that sticks.", Demo: TicketRow },
    { name: "Canned Reply", description: "Pick a saved reply, preview the copy and insert it.", Demo: CannedReply },
    { name: "SLA Badge", description: "First-response target, a live clock and the at-risk state.", Demo: SlaBadge },
    { name: "Customer Card", description: "Plan, lifetime value and the last few tickets in one card.", Demo: CustomerCard },
    { name: "Conversation View", description: "A short thread with a composer that becomes an internal note.", Demo: ConversationView },
    { name: "CSAT Survey", description: "Stars, a comment and a thank-you that remembers the rating.", Demo: CsatSurvey },
    { name: "Macro Picker", description: "Search saved macros by name and apply one in a click.", Demo: MacroPicker },
    { name: "Queue Filter", description: "Status and priority chips that narrow the queue count.", Demo: QueueFilter },
    { name: "Escalation Banner", description: "Pick a team, confirm the handoff and show the escalation.", Demo: EscalationBanner },
    { name: "Knowledge Base", description: "Search help articles and preview the matching one.", Demo: KnowledgeBase },
    { name: "Ticket Timeline", description: "Events, actors and timestamps, filtered to internal notes.", Demo: TicketTimeline },
    { name: "Agent Status", description: "Switch online, away or busy and read the availability.", Demo: AgentStatus },
  ],
};
