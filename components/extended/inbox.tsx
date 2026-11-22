"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ComponentType, KeyboardEvent as ReactKeyboardEvent } from "react";
import {
  RiAlarmLine,
  RiArchiveLine,
  RiArrowDownLine,
  RiArrowDownSLine,
  RiArrowUpLine,
  RiAtLine,
  RiAttachment2,
  RiCheckDoubleLine,
  RiCheckLine,
  RiCloseLine,
  RiErrorWarningLine,
  RiFileTextLine,
  RiFilter3Line,
  RiInboxArchiveLine,
  RiInboxLine,
  RiLoader4Line,
  RiPauseLine,
  RiPencilLine,
  RiPriceTag3Line,
  RiRefreshLine,
  RiSearchLine,
  RiSendPlaneLine,
  RiUserLine,
  RiUserSharedLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* Shared */

type IconComponent = ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";
const card = "w-full rounded-xl border border-border-button-default bg-background-primary-default shadow-card";
const transition = "transition-[background-color,border-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none";
const buttonBase =
  "inline-flex items-center justify-center gap-1.5 rounded-lg text-caption-1-semibold transition-[transform,opacity,background-color,color,box-shadow] duration-150 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:scale-100";
const primaryButton = cx(buttonBase, "h-8 bg-button-primary px-2.5 text-text-white shadow-xs", focusRing);
const secondaryButton = cx(buttonBase, "h-8 border border-border-button-default bg-background-primary-default px-2.5 text-text-primary shadow-xs hover:bg-background-primary-hover", focusRing);
const quietButton = cx(buttonBase, "h-7 px-1.5 text-text-secondary hover:bg-background-secondary-default hover:text-text-primary", focusRing);
const iconButton = cx("flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-icon-tertiary transition-[background-color,color] duration-150 ease-out hover:bg-background-secondary-default hover:text-text-primary motion-reduce:transition-none", focusRing);
const reveal = "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none";
const fieldShell =
  "flex items-center gap-1.5 rounded-lg bg-background-tertiary-default px-2 ring-2 ring-inset ring-transparent transition-[box-shadow] duration-150 ease-out focus-within:ring-border-focus-ring motion-reduce:transition-none";
const fieldInput = "min-w-0 flex-1 bg-transparent text-caption-1-medium text-text-primary outline-none placeholder:text-text-placeholder";

type Tone = "blue" | "cyan" | "rose" | "lime" | "neutral";

const TINTS: Record<Tone, string> = {
  blue: "bg-accent-100 text-accent-700",
  cyan: "bg-status-cyan-background text-status-cyan-text",
  rose: "bg-status-rose-background text-status-rose-text",
  lime: "bg-status-lime-background text-status-lime-text",
  neutral: "bg-background-tertiary-default text-text-secondary",
};

function Avatar({ initials, tint = "blue", className }: { initials: string; tint?: Tone; className?: string }) {
  return (
    <span aria-hidden className={cx("flex size-6 shrink-0 items-center justify-center rounded-full text-caption-2-semibold", TINTS[tint], className)}>
      {initials}
    </span>
  );
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* 1. Thread List */

type Thread = { id: string; from: string; initials: string; tint: Tone; subject: string; preview: string; time: string; unread: boolean };

const THREADS: Thread[] = [
  { id: "maya", from: "Maya Chen", initials: "MC", tint: "blue", subject: "Re: Q4 launch checklist", preview: "The press kit is ready for review.", time: "9:42", unread: true },
  { id: "dev", from: "Dev Raman", initials: "DR", tint: "cyan", subject: "Deploy window moved to 2 PM", preview: "Staging is green, waiting on the go-ahead.", time: "9:18", unread: true },
  { id: "priya", from: "Priya Nair", initials: "PN", tint: "rose", subject: "Notes from the pricing call", preview: "Three tiers, one caveat on annual billing.", time: "8:05", unread: true },
  { id: "sam", from: "Sam Okafor", initials: "SO", tint: "lime", subject: "Photography shortlist", preview: "Six frames from the rooftop set.", time: "Mon", unread: false },
];

export function ThreadList() {
  const helperId = useId();
  const [read, setRead] = useState<Set<string>>(() => new Set());
  const [selected, setSelected] = useState(0);
  const rows = useRef<Array<HTMLButtonElement | null>>([]);
  const unread = THREADS.filter((thread) => !read.has(thread.id)).length;

  const move = (next: number) => {
    const target = Math.max(0, Math.min(THREADS.length - 1, next));
    setSelected(target);
    rows.current[target]?.focus();
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const targets: Record<string, number> = { ArrowDown: selected + 1, ArrowUp: selected - 1, Home: 0, End: THREADS.length - 1 };
    if (!(event.key in targets)) return;
    event.preventDefault();
    move(targets[event.key]);
  };

  return (
    <section aria-label="Inbox thread list" className={cx(card, "max-w-[560px] p-2")}>
      <div className="flex h-6 items-center gap-2 px-1">
        <h3 className="text-body-2-semibold text-text-primary">Inbox</h3>
        <span aria-live="polite" className="flex items-center gap-1 text-caption-2-regular text-text-tertiary">
          <span key={unread} className="animate-label-in font-mono tabular-nums text-accent-700 motion-reduce:animate-none">{unread}</span>
          unread
        </span>
        <button type="button" disabled={unread === 0} onClick={() => setRead(new Set(THREADS.map((thread) => thread.id)))} className={cx(quietButton, "ms-auto h-6 px-1.5 text-caption-2-semibold")}>
          {unread === 0 ? "All read" : "Mark all read"}
        </button>
      </div>

      <div role="listbox" aria-label="Threads" aria-describedby={helperId} onKeyDown={onKeyDown} className="mt-1">
        {THREADS.map((thread, index) => {
          const isRead = read.has(thread.id);
          return (
            <button
              key={thread.id}
              ref={(node) => { rows.current[index] = node; }}
              type="button"
              role="option"
              aria-selected={selected === index}
              tabIndex={selected === index ? 0 : -1}
              onFocus={() => setSelected(index)}
              onClick={() => { setSelected(index); setRead((current) => new Set(current).add(thread.id)); }}
              className={cx("flex w-full items-center gap-2 rounded-lg px-1 py-1 text-start", transition, focusRing, selected === index ? "bg-background-secondary-default" : "hover:bg-background-secondary-default/60")}
            >
              <span className="relative shrink-0">
                <Avatar initials={thread.initials} tint={thread.tint} />
                <span
                  aria-hidden
                  className={cx(
                    "absolute -end-0.5 -top-0.5 size-2 rounded-full bg-accent-500 ring-2 ring-background-primary-default",
                    "transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
                    isRead ? "scale-50 opacity-0" : "scale-100 opacity-100",
                  )}
                />
              </span>
              <span className="w-16 shrink-0 truncate text-body-2-medium text-text-primary sm:w-20">{thread.from}</span>
              <span className="min-w-0 flex-1 truncate">
                <span className="sr-only">{isRead ? "Read: " : "Unread: "}</span>
                <span className={cx("text-caption-1-semibold", isRead ? "text-text-secondary" : "text-text-primary")}>{thread.subject}</span>
                <span className="text-caption-1-regular text-text-tertiary"> · {thread.preview}</span>
              </span>
              <span className="shrink-0 font-mono text-caption-2-regular tabular-nums text-text-tertiary">{thread.time}</span>
            </button>
          );
        })}
      </div>

      <p id={helperId} className="sr-only">Use the arrow keys to move between threads. Press Enter to open a thread and mark it read.</p>
    </section>
  );
}

/* 2. Message Bubble */

const CONVERSATION = [
  { id: "in-1", side: "in", text: "Pricing page still needs your eyes before the review." },
  { id: "out-1", side: "out", text: "Checked on mobile — the annual toggle is below the fold." },
  { id: "in-2", side: "in", text: "Good catch. Fixing it before 2 PM." },
] as const;

export function MessageBubble() {
  const [read, setRead] = useState(false);

  return (
    <section aria-label="Conversation with Maya Chen" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-1.5">
        <Avatar initials="MC" />
        <span className="text-caption-1-semibold text-text-primary">Maya Chen</span>
        <span className="ms-auto text-caption-2-regular text-text-tertiary">Today · 3 messages</span>
      </div>

      <ol className="mt-1.5 flex flex-col gap-1">
        {CONVERSATION.map((message) => message.side === "in" ? (
          <li key={message.id} className="flex justify-start">
            <div className="max-w-[88%] rounded-2xl rounded-es-md bg-background-secondary-default px-2.5 py-1">
              <p className="text-caption-1-regular text-text-primary"><span className="sr-only">Maya said: </span>{message.text}</p>
            </div>
          </li>
        ) : (
          <li key={message.id} className="flex justify-end">
            <div className="max-w-[88%] rounded-2xl rounded-ee-md bg-accent-600 px-2.5 py-1 text-text-white">
              <p className="text-caption-1-regular">
                <span className="sr-only">You said: </span>
                {message.text}
                <span className="ms-1 inline-flex translate-y-px align-baseline">
                  {read
                    ? <RiCheckDoubleLine className="size-3 animate-label-in motion-reduce:animate-none" aria-hidden />
                    : <RiCheckLine className="size-3 animate-label-in motion-reduce:animate-none" aria-hidden />}
                </span>
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-1.5 flex items-center justify-between gap-2 border-t border-separator-border pt-1.5">
        <span role="status" aria-live="polite" className={cx("flex items-center gap-1 text-caption-2-regular", transition, read ? "text-status-lime-text" : "text-text-tertiary")}>
          {read
            ? <RiCheckDoubleLine key="read" className="size-3.5 animate-label-in motion-reduce:animate-none" aria-hidden />
            : <RiCheckLine key="delivered" className="size-3.5 animate-label-in motion-reduce:animate-none" aria-hidden />}
          {read ? "Read at 9:42" : "Delivered at 9:40"}
        </span>
        <button type="button" aria-pressed={read} onClick={() => setRead((current) => !current)} className={cx(quietButton, "h-6 px-1.5 text-caption-2-semibold")}>
          {read ? "Mark unread" : "Mark read"}
        </button>
      </div>
    </section>
  );
}

/* 3. Compose Row */

type SendState = "idle" | "sending" | "sent";

export function ComposeRow() {
  const toId = useId();
  const subjectId = useId();
  const errorId = useId();
  const subjectRef = useRef<HTMLInputElement>(null);
  const composeAnotherRef = useRef<HTMLButtonElement>(null);
  const [to, setTo] = useState("maya@northline.co");
  const [subject, setSubject] = useState("Q4 press kit — final pass");
  const [body, setBody] = useState("The annual toggle is fixed on mobile. Ready for the 2 PM review.");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<SendState>("idle");
  const validRecipient = EMAIL_PATTERN.test(to.trim());

  useEffect(() => {
    if (status !== "sending") return;
    const timer = window.setTimeout(() => setStatus("sent"), 900);
    return () => window.clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (status === "sent") composeAnotherRef.current?.focus();
  }, [status]);

  const send = () => {
    if (!to.trim()) return setError("Add a recipient before sending.");
    if (!validRecipient) return setError("That email address is incomplete.");
    if (!subject.trim()) return setError("Give the message a subject.");
    if (!body.trim()) return setError("Write a line before sending.");
    if (body.length > 280) return setError("Trim the message to 280 characters.");
    setError(null);
    setStatus("sending");
  };

  return (
    <section aria-label="Compose a message" className={cx(card, "max-w-[320px] p-2.5")}>
      {status === "sent" ? (
        <div className="flex animate-label-in flex-col items-center py-2 text-center motion-reduce:animate-none">
          <span className="flex size-8 items-center justify-center rounded-full bg-status-lime-background text-status-lime-text"><RiCheckLine className="size-4" aria-hidden /></span>
          <p role="status" className="mt-1.5 text-body-2-semibold text-text-primary">Message sent</p>
          <p className="max-w-full truncate text-caption-1-regular text-text-secondary">{subject}</p>
          <p className="max-w-full truncate text-caption-2-regular text-text-tertiary">To <bdi dir="ltr">{to}</bdi> · 9:42 AM</p>
          <button ref={composeAnotherRef} type="button" onClick={() => { setStatus("idle"); setError(null); setSubject(""); setBody(""); window.setTimeout(() => subjectRef.current?.focus(), 0); }} className={cx(secondaryButton, "mt-2 h-7")}>Compose another</button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-body-2-semibold text-text-primary">New message</h3>
            <button type="button" onClick={send} disabled={status === "sending"} className={cx(primaryButton, "h-7")}>
              {status === "sending"
                ? <><RiLoader4Line className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />Sending</>
                : <><RiSendPlaneLine className="size-3.5 rtl:-scale-x-100" aria-hidden />Send</>}
            </button>
          </div>

          <div className={cx(fieldShell, "mt-1.5 h-7", error && !validRecipient && "ring-border-error-default")}>
            <label htmlFor={toId} className="text-caption-2-medium text-text-secondary">To</label>
            <input id={toId} type="email" dir="ltr" value={to} autoComplete="email" aria-invalid={Boolean(error && !validRecipient)} aria-describedby={error ? errorId : undefined} onChange={(event) => { setTo(event.target.value); if (error) setError(null); }} className={cx(fieldInput, "text-start")} />
            {!validRecipient && to.length > 0 && <RiErrorWarningLine className="size-3.5 shrink-0 text-text-error-primary" aria-hidden />}
          </div>

          <div className={cx(fieldShell, "mt-1 h-7", error && !subject.trim() && "ring-border-error-default")}>
            <label htmlFor={subjectId} className="text-caption-2-medium text-text-secondary">Subject</label>
            <input ref={subjectRef} id={subjectId} value={subject} placeholder="What is this about?" aria-invalid={Boolean(error && !subject.trim())} aria-describedby={error ? errorId : undefined} onChange={(event) => { setSubject(event.target.value); if (error) setError(null); }} className={fieldInput} />
          </div>

          <textarea
            aria-label="Message body"
            rows={2}
            value={body}
            aria-invalid={body.length > 280}
            aria-describedby={error ? errorId : undefined}
            placeholder="Write the message…"
            onChange={(event) => { setBody(event.target.value); if (error) setError(null); }}
            className={cx(
              "mt-1 h-11 w-full resize-none rounded-lg bg-background-tertiary-default px-2 py-1",
              "text-caption-1-regular text-text-primary outline-none placeholder:text-text-placeholder",
              "ring-2 ring-inset ring-transparent transition-[box-shadow] duration-150 ease-out",
              "focus:ring-border-focus-ring motion-reduce:transition-none",
            )}
          />

          <div className="mt-1 flex h-4 items-center justify-between gap-2">
            <p id={errorId} role={error ? "alert" : undefined} className="min-w-0 truncate text-caption-2-regular text-text-error-primary">{error}</p>
            <span className={cx("shrink-0 font-mono text-caption-2-regular tabular-nums", body.length > 280 ? "text-text-error-primary" : "text-text-tertiary")}>{body.length}/280</span>
          </div>
        </>
      )}
    </section>
  );
}

/* 4. Label Picker */

type LabelId = "press" | "design" | "finance" | "hiring";

const LABELS: { id: LabelId; name: string; dot: string; count: number }[] = [
  { id: "press", name: "Press", dot: "bg-status-cyan-text", count: 4 },
  { id: "design", name: "Design", dot: "bg-status-purple-text", count: 12 },
  { id: "finance", name: "Finance", dot: "bg-status-orange-text", count: 7 },
  { id: "hiring", name: "Hiring", dot: "bg-status-lime-text", count: 3 },
];

const BASE_COUNTS = LABELS.reduce((counts, label) => ({ ...counts, [label.id]: label.count }), {} as Record<LabelId, number>);

export function LabelPicker() {
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [applied, setApplied] = useState<LabelId[]>(["press"]);
  const [counts, setCounts] = useState<Record<LabelId, number>>(BASE_COUNTS);

  const close = () => { setOpen(false); triggerRef.current?.focus(); };

  const toggle = (id: LabelId) => {
    const isApplied = applied.includes(id);
    setApplied((current) => isApplied ? current.filter((item) => item !== id) : [...current, id]);
    setCounts((current) => ({ ...current, [id]: Math.max(0, current[id] + (isApplied ? -1 : 1)) }));
  };

  return (
    <div className="w-full max-w-[320px]" onKeyDown={(event) => { if (event.key === "Escape" && open) { event.stopPropagation(); close(); } }}>
      <section aria-label="Thread labels" className={cx(card, "p-2")}>
        <div className="flex h-7 items-center gap-2">
          <RiPriceTag3Line className="size-3.5 text-foreground-icon-secondary" aria-hidden />
          <h3 className="text-body-2-semibold text-text-primary">Labels</h3>
          <span className="font-mono text-caption-2-regular tabular-nums text-text-tertiary">{applied.length}</span>
          <button ref={triggerRef} type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((current) => !current)} className={cx(secondaryButton, "ms-auto h-7 px-2 text-caption-2-semibold")}>
            {open ? "Done" : "Add label"}
          </button>
        </div>

        <div className="mt-1 flex min-h-6 flex-wrap items-center gap-1">
          {applied.length === 0 ? (
            <span className="text-caption-1-regular text-text-tertiary">No labels on this thread yet.</span>
          ) : LABELS.filter((label) => applied.includes(label.id)).map((label) => (
            <span key={label.id} className="flex h-6 animate-label-in items-center gap-1 rounded-full bg-background-secondary-default ps-2 pe-1 text-caption-2-medium text-text-primary motion-reduce:animate-none">
              <span className={cx("size-1.5 rounded-full", label.dot)} aria-hidden />
              {label.name}
              <button
                type="button"
                aria-label={`Remove the ${label.name} label`}
                onClick={() => { toggle(label.id); triggerRef.current?.focus(); }}
                className={cx(
                  "flex size-4 items-center justify-center rounded-full text-foreground-icon-tertiary hover:text-text-primary",
                  focusRing,
                )}
              >
                <RiCloseLine className="size-3" aria-hidden />
              </button>
            </span>
          ))}
        </div>

        <div id={panelId} inert={!open} className={cx(reveal, open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
          <div className="min-h-0 overflow-hidden">
            <div role="group" aria-label="Apply labels" className="mt-1 flex flex-col gap-0.5 border-t border-separator-border pt-1">
              {LABELS.map((label) => {
                const isApplied = applied.includes(label.id);
                return (
                  <button
                    key={label.id}
                    type="button"
                    aria-pressed={isApplied}
                    onClick={() => toggle(label.id)}
                    className={cx(
                      "flex h-6 w-full items-center gap-1.5 rounded-md px-1.5 text-start",
                      transition,
                      focusRing,
                      isApplied ? "bg-background-secondary-default" : "hover:bg-background-secondary-default",
                    )}
                  >
                    <span className={cx("size-2 shrink-0 rounded-full", label.dot)} aria-hidden />
                    <span className="flex-1 text-caption-1-medium text-text-primary">{label.name}</span>
                    <span className="font-mono text-caption-2-regular tabular-nums text-text-tertiary">{counts[label.id]}</span>
                    <span
                      className={cx(
                        "flex size-4 items-center justify-center rounded-full border transition-[background-color,border-color,color] duration-150 ease-out motion-reduce:transition-none",
                        isApplied ? "border-accent-600 bg-accent-600 text-text-white" : "border-border-checkbox-default",
                      )}
                    >
                      <RiCheckLine
                        className={cx(
                          "size-3 transition-[transform,opacity] duration-150 ease-out motion-reduce:transition-none",
                          isApplied ? "scale-100 opacity-100" : "scale-50 opacity-0",
                        )}
                        aria-hidden
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <p className="sr-only" role="status" aria-live="polite">{applied.length} {applied.length === 1 ? "label" : "labels"} applied to this thread.</p>
      </section>
    </div>
  );
}

/* 5. Snooze Menu */

const SNOOZE_OPTIONS = [
  { id: "hour", label: "In 1 hour", detail: "Today, 10:42 AM", short: "10:42 AM" },
  { id: "evening", label: "This evening", detail: "Today, 7:00 PM", short: "7 PM" },
  { id: "tomorrow", label: "Tomorrow morning", detail: "Tue, 9:00 AM", short: "Tue 9 AM" },
  { id: "weekend", label: "This weekend", detail: "Sat, 9:00 AM", short: "Sat 9 AM" },
] as const;

type SnoozeId = (typeof SNOOZE_OPTIONS)[number]["id"];

export function SnoozeMenu() {
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState<SnoozeId>("tomorrow");
  const [snoozed, setSnoozed] = useState<SnoozeId | null>(null);
  const current = SNOOZE_OPTIONS.find((option) => option.id === choice) ?? SNOOZE_OPTIONS[2];
  const active = SNOOZE_OPTIONS.find((option) => option.id === snoozed) ?? null;
  const close = () => { setOpen(false); triggerRef.current?.focus(); };
  const confirm = () => { setSnoozed(choice); setOpen(false); triggerRef.current?.focus(); };

  return (
    <div className="w-full max-w-[320px]" onKeyDown={(event) => { if (event.key === "Escape" && open) { event.stopPropagation(); close(); } }}>
      <section aria-label="Snooze this thread" className={cx(card, "p-2")}>
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((current) => !current)}
          className={cx(
            "flex w-full items-center gap-2 rounded-lg p-1 text-start",
            transition,
            focusRing,
            "hover:bg-background-secondary-default",
          )}
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-secondary-default text-accent-700"><RiAlarmLine className="size-3.5" aria-hidden /></span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-caption-1-semibold text-text-primary">Re: Q4 launch checklist</span>
            <span role="status" className="block truncate text-caption-2-regular text-text-tertiary">{active ? `Snoozed until ${active.detail}` : "Maya Chen · needs a reply by 2 PM"}</span>
          </span>
          <span className="shrink-0 rounded-full bg-background-secondary-default px-1.5 py-0.5 text-caption-2-medium text-text-secondary">{active ? "Snoozed" : "Snooze"}</span>
          <RiArrowDownSLine className={cx("size-3.5 shrink-0 text-foreground-icon-tertiary transition-[transform] duration-200 ease-out motion-reduce:transition-none", open && "rotate-180")} aria-hidden />
        </button>

        <div id={panelId} inert={!open} className={cx(reveal, open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
          <div className="min-h-0 overflow-hidden">
            <div role="group" aria-label="Return time" className="mt-1 flex flex-col px-1">
              {SNOOZE_OPTIONS.map((option) => {
                const selected = choice === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setChoice(option.id)}
                    className={cx(
                      "flex h-6 items-center gap-1.5 rounded-md px-1.5 text-start",
                      transition,
                      focusRing,
                      selected ? "bg-background-secondary-default" : "hover:bg-background-secondary-default",
                    )}
                  >
                    <span className={cx("size-1.5 shrink-0 rounded-full", selected ? "bg-accent-500" : "bg-background-tertiary-default")} aria-hidden />
                    <span className="flex-1 text-caption-1-medium text-text-primary">{option.label}</span>
                    <span className="font-mono text-caption-2-regular text-text-tertiary">{option.detail}</span>
                    <RiCheckLine
                      className={cx(
                        "size-3 text-accent-700 transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none",
                        selected ? "scale-100 opacity-100" : "scale-50 opacity-0",
                      )}
                      aria-hidden
                    />
                  </button>
                );
              })}
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <button type="button" onClick={close} className={cx(quietButton, "h-7")}>Cancel</button>
              <button type="button" onClick={confirm} className={cx(primaryButton, "h-7 flex-1")}><RiAlarmLine className="size-3.5" aria-hidden />Snooze until {current.short}</button>
            </div>
          </div>
        </div>

        {active && !open && (
          <div className="mt-1 flex h-6 animate-label-in items-center justify-between gap-2 px-1 motion-reduce:animate-none">
            <span className="min-w-0 truncate text-caption-2-regular text-text-tertiary">Returns {active.detail}</span>
            <button type="button" onClick={() => { setSnoozed(null); setChoice("tomorrow"); triggerRef.current?.focus(); }} className={cx(quietButton, "h-6 px-1 text-caption-2-semibold")}>Undo snooze</button>
          </div>
        )}
      </section>
    </div>
  );
}

/* 6. Unread Divider */

type SliceMessage = { id: string; from: string; initials: string; tint: Tone; subject: string; time: string; unread: boolean };

const INBOX_SLICE: SliceMessage[] = [
  { id: "read-1", from: "Maya Chen", initials: "MC", tint: "blue", subject: "Invoice 2041 is paid", time: "9:12", unread: false },
  { id: "read-2", from: "Dev Raman", initials: "DR", tint: "cyan", subject: "Staging build is green", time: "9:20", unread: false },
  { id: "new-1", from: "Priya Nair", initials: "PN", tint: "rose", subject: "Pricing call notes, three tiers", time: "9:34", unread: true },
  { id: "new-2", from: "Sam Okafor", initials: "SO", tint: "lime", subject: "Rooftop shortlist is ready", time: "9:36", unread: true },
  { id: "new-3", from: "Lena Ortiz", initials: "LO", tint: "neutral", subject: "Press kit captions, second pass", time: "9:41", unread: true },
];

export function UnreadDivider() {
  const [jumped, setJumped] = useState(false);
  const row = (message: SliceMessage) => (
    <div key={message.id} className="flex h-8 items-center gap-1.5 px-1">
      <span aria-hidden className={cx("size-1.5 shrink-0 rounded-full bg-accent-500 transition-[opacity] duration-200 ease-out motion-reduce:transition-none", message.unread ? "opacity-100" : "opacity-0")} />
      <Avatar initials={message.initials} tint={message.tint} />
      <span className="min-w-0 flex-1 truncate">
        <span className="sr-only">{message.unread ? "New message: " : ""}</span>
        <span className={message.unread ? "text-caption-1-semibold text-text-primary" : "text-caption-1-medium text-text-secondary"}>{message.from}</span>
        <span className="text-caption-1-regular text-text-tertiary"> · {message.subject}</span>
      </span>
      <span className="shrink-0 font-mono text-caption-2-regular tabular-nums text-text-tertiary">{message.time}</span>
    </div>
  );

  return (
    <section aria-label="New messages" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex h-6 items-center gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Inbox</h3>
        <span className="flex items-center gap-1 text-caption-2-regular text-text-tertiary">
          <span aria-hidden className="size-1.5 rounded-full bg-accent-500" />
          <span className="font-mono tabular-nums">3</span> new
        </span>
        <button type="button" aria-pressed={jumped} onClick={() => setJumped((current) => !current)} className={cx(quietButton, "ms-auto h-6 px-1.5 text-caption-2-semibold")}>
          {jumped ? <><RiArrowUpLine className="size-3" aria-hidden />Back to top</> : <>Jump to new<RiArrowDownLine className="size-3" aria-hidden /></>}
        </button>
      </div>

      <div className="mt-1.5 h-[124px] overflow-hidden">
        <div className={cx("transition-transform duration-200 ease-out motion-reduce:transition-none", jumped ? "-translate-y-16" : "translate-y-0")}>
          {INBOX_SLICE.slice(0, 2).map(row)}
          <div className="flex h-7 items-center gap-1.5 px-1">
            <span className="h-px flex-1 bg-separator-border" aria-hidden />
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-accent-50 px-1.5 py-0.5 text-caption-2-semibold text-accent-700">
              <span aria-hidden className="size-1 rounded-full bg-accent-500" />3 new messages
            </span>
            <span className="h-px flex-1 bg-separator-border" aria-hidden />
          </div>
          {INBOX_SLICE.slice(2).map(row)}
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">{jumped ? "Showing the three new messages." : "Showing the top of the inbox."}</p>
    </section>
  );
}

/* 7. Attachment Chip */

type UploadStatus = "uploading" | "paused" | "done" | "removed";

const ATTACHMENT_NAME = "launch-brief.pdf";

export function AttachmentChip() {
  const [status, setStatus] = useState<UploadStatus>("uploading");
  const [progress, setProgress] = useState(0);
  const attachRef = useRef<HTMLButtonElement>(null);
  const uploadActionRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (status !== "uploading") return;
    if (progress >= 100) { setStatus("done"); return; }
    const timer = window.setTimeout(() => setProgress((value) => Math.min(100, value + 20)), 260);
    return () => window.clearTimeout(timer);
  }, [status, progress]);

  useEffect(() => {
    if (status === "removed") attachRef.current?.focus();
  }, [status]);

  if (status === "removed") {
    return (
      <section aria-label="Attachment" className={cx(card, "max-w-[320px] p-2")}>
        <div className="flex h-12 flex-col items-center justify-center rounded-lg border border-dashed border-border-button-default bg-background-secondary-default/50">
          <button ref={attachRef} type="button" onClick={() => { setProgress(0); setStatus("uploading"); window.setTimeout(() => uploadActionRef.current?.focus(), 0); }} className={cx(quietButton, "h-6 text-caption-2-semibold")}><RiAttachment2 className="size-3.5" aria-hidden />Attach a file</button>
          <span className="text-caption-2-regular text-text-tertiary">PDF, PNG or ZIP · up to 25 MB</span>
        </div>
        <p className="sr-only" role="status">Attachment removed.</p>
      </section>
    );
  }

  const uploading = status === "uploading";
  const paused = status === "paused";
  const done = status === "done";

  return (
    <section aria-label="Attachment upload" className={cx(card, "max-w-[320px] p-2")}>
      <div className="flex items-start gap-2 rounded-lg bg-background-secondary-default p-1.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background-primary-default text-foreground-icon-secondary shadow-xs"><RiFileTextLine className="size-4" aria-hidden /></span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-1-semibold text-text-primary"><bdi dir="ltr">{ATTACHMENT_NAME}</bdi></p>
          <p className="flex items-center gap-1 text-caption-2-regular text-text-tertiary">
            <span className="font-mono">2.4 MB</span><span aria-hidden>·</span>
            <span className={cx("truncate transition-[color] duration-150 ease-out motion-reduce:transition-none", done ? "text-status-lime-text" : paused ? "text-status-orange-text" : "text-text-tertiary")}>
              {done ? "Uploaded" : paused ? `Paused at ${progress}%` : `Uploading ${progress}%`}
            </span>
          </p>
          {(uploading || paused) && (
            <div role="progressbar" aria-label={`Upload progress for ${ATTACHMENT_NAME}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} className="mt-1 h-1 overflow-hidden rounded-full bg-background-tertiary-default">
              <div className="h-full rounded-full bg-accent-500 transition-[width] duration-200 ease-out motion-reduce:transition-none" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            ref={uploadActionRef}
            type="button"
            aria-label={uploading ? `Pause upload of ${ATTACHMENT_NAME}` : paused ? `Retry upload of ${ATTACHMENT_NAME}` : `Re-upload ${ATTACHMENT_NAME}`}
            onClick={() => {
              if (uploading) setStatus("paused");
              else if (paused) setStatus("uploading");
              else { setProgress(0); setStatus("uploading"); }
            }}
            className={iconButton}
          >
            {uploading ? <RiPauseLine className="size-3.5" aria-hidden /> : <RiRefreshLine className="size-3.5" aria-hidden />}
          </button>
          <button type="button" aria-label={`Remove ${ATTACHMENT_NAME}`} onClick={() => setStatus("removed")} className={iconButton}><RiCloseLine className="size-3.5" aria-hidden /></button>
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {done ? "Upload complete." : paused ? "Upload paused." : `Uploading ${ATTACHMENT_NAME}.`}
      </p>
    </section>
  );
}

/* 8. Reply Box */

type ReplyState = "idle" | "sending" | "sent";

export function ReplyBox() {
  const [draft, setDraft] = useState("The pricing fix looks good on mobile.");
  const [status, setStatus] = useState<ReplyState>("idle");
  const draftRef = useRef<HTMLTextAreaElement>(null);
  const newReplyRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (status !== "sending") return;
    const timer = window.setTimeout(() => setStatus("sent"), 800);
    return () => window.clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (status === "sent") newReplyRef.current?.focus();
  }, [status]);

  const toggleMention = (name: string) => {
    const token = `@${name}`;
    setDraft((current) => current.includes(token) ? current.replace(`${token} `, "").replace(token, "").trimStart() : `${token} ${current}`);
  };

  const send = () => { if (draft.trim() && status !== "sending") setStatus("sending"); };

  return (
    <section aria-label="Reply to Maya Chen" className={cx(card, "max-w-[320px] p-2.5")}>
      {status === "sent" ? (
        <div className="flex animate-label-in items-center gap-2 motion-reduce:animate-none">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-status-lime-background text-status-lime-text"><RiCheckLine className="size-4" aria-hidden /></span>
          <div className="min-w-0 flex-1">
            <p role="status" className="text-caption-1-semibold text-text-primary">Reply sent</p>
            <p className="truncate text-caption-2-regular text-text-tertiary">To Maya Chen · {draft.includes("@") ? "mention included" : "no mention"}</p>
          </div>
          <button ref={newReplyRef} type="button" onClick={() => { setDraft(""); setStatus("idle"); window.setTimeout(() => draftRef.current?.focus(), 0); }} className={cx(quietButton, "h-6 px-1.5 text-caption-2-semibold")}>New reply</button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-1.5">
            <Avatar initials="MC" />
            <p className="text-caption-2-medium text-text-secondary">Reply to <span className="text-text-primary">Maya Chen</span></p>
            <span className="ms-auto text-caption-2-regular text-text-tertiary">⌘↵</span>
          </div>
          <div className={cx(fieldShell, "mt-1.5 items-end p-1")}>
            <textarea
              ref={draftRef}
              aria-label="Reply message"
              rows={2}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter") { event.preventDefault(); send(); } }}
              placeholder="Write a reply…"
              className="h-9 min-w-0 flex-1 resize-none bg-transparent px-1 py-0.5 text-caption-1-regular text-text-primary outline-none placeholder:text-text-placeholder"
            />
            <button type="button" aria-label="Send reply" disabled={!draft.trim() || status === "sending"} onClick={send} className={cx(primaryButton, "size-7 shrink-0 px-0")}>
              {status === "sending" ? <RiLoader4Line className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden /> : <RiSendPlaneLine className="size-3.5 rtl:-scale-x-100" aria-hidden />}
            </button>
          </div>
          <div className="mt-1 flex h-5 items-center gap-1">
            <span className="text-caption-2-regular text-text-tertiary">Mention</span>
            {["Maya", "Dev"].map((name) => {
              const mentioned = draft.includes(`@${name}`);
              return (
                <button
                  key={name}
                  type="button"
                  aria-label={`${mentioned ? "Remove" : "Add"} mention ${name}`}
                  aria-pressed={mentioned}
                  onClick={() => toggleMention(name)}
                  className={cx("inline-flex h-5 items-center gap-0.5 rounded-full px-1.5 text-caption-2-medium", transition, focusRing, mentioned ? "bg-accent-100 text-accent-700" : "bg-background-secondary-default text-text-secondary hover:text-text-primary")}
                >
                  <RiAtLine className="size-3" aria-hidden />{name}
                </button>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

/* 9. Search Filters */

type SearchThread = { id: string; from: string; subject: string; unread: boolean; attachment: boolean };

const SEARCH_THREADS: SearchThread[] = [
  { id: "s1", from: "Maya Chen", subject: "Pricing page — final pass", unread: true, attachment: true },
  { id: "s2", from: "Dev Raman", subject: "Deploy log for build 248", unread: true, attachment: false },
  { id: "s3", from: "Priya Nair", subject: "Pricing call notes", unread: false, attachment: true },
  { id: "s4", from: "Sam Okafor", subject: "Rooftop shortlist, six frames", unread: false, attachment: true },
  { id: "s5", from: "Lena Ortiz", subject: "Press kit captions", unread: true, attachment: false },
  { id: "s6", from: "Maya Chen", subject: "Q4 review agenda", unread: false, attachment: false },
];

type FilterId = "unread" | "files" | "maya";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "unread", label: "Unread" },
  { id: "files", label: "Has file" },
  { id: "maya", label: "From Maya" },
];

export function SearchFilters() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Record<FilterId, boolean>>({ unread: false, files: false, maya: false });
  const searchRef = useRef<HTMLInputElement>(null);
  const normalized = query.trim().toLowerCase();

  const results = SEARCH_THREADS.filter((thread) => {
    if (normalized && !`${thread.from} ${thread.subject}`.toLowerCase().includes(normalized)) return false;
    if (active.unread && !thread.unread) return false;
    if (active.files && !thread.attachment) return false;
    if (active.maya && thread.from !== "Maya Chen") return false;
    return true;
  });
  const hasFilters = normalized.length > 0 || active.unread || active.files || active.maya;

  return (
    <section aria-label="Search and filter threads" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className={cx(fieldShell, "h-8")}>
        <RiSearchLine className="size-3.5 shrink-0 text-foreground-icon-secondary" aria-hidden />
        <input ref={searchRef} type="search" aria-label="Search threads" value={query} placeholder="Search threads" onChange={(event) => setQuery(event.target.value)} className={cx(fieldInput, "[&::-webkit-search-cancel-button]:appearance-none")} />
        {query && <button type="button" aria-label="Clear search" onClick={() => { setQuery(""); searchRef.current?.focus(); }} className={cx(iconButton, "size-5")}><RiCloseLine className="size-3" aria-hidden /></button>}
      </div>

      <div role="group" aria-label="Filter threads" className="mt-1.5 flex items-center gap-1">
        <RiFilter3Line className="size-3.5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
        {FILTERS.map((filter) => {
          const selected = active[filter.id];
          return (
            <button
              key={filter.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive((current) => ({ ...current, [filter.id]: !current[filter.id] }))}
              className={cx(
                "h-6 rounded-full border px-2 text-caption-2-semibold",
                transition,
                focusRing,
                selected
                  ? "border-accent-500 bg-accent-50 text-accent-700"
                  : "border-border-button-default bg-background-primary-default text-text-secondary hover:bg-background-primary-hover hover:text-text-primary",
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="mt-1.5 flex h-5 items-center gap-1.5">
        <p role="status" aria-live="polite" className="min-w-0 flex-1 truncate text-caption-2-regular text-text-secondary">
          <span className="sr-only">{results.length} of {SEARCH_THREADS.length} threads. </span>
          {results.length === 0 ? "No threads match those filters." : results[0].subject}
        </p>
        {hasFilters && <button type="button" onClick={() => { setQuery(""); setActive({ unread: false, files: false, maya: false }); searchRef.current?.focus(); }} className={cx(quietButton, "h-5 px-1 text-caption-2-medium")}>Reset</button>}
        <span aria-hidden className="shrink-0 text-caption-2-regular text-text-tertiary">
          <span key={results.length} className="inline-block animate-label-in font-mono tabular-nums motion-reduce:animate-none">{results.length}</span>
          <span className="font-mono">/{SEARCH_THREADS.length}</span> threads
        </span>
      </div>
    </section>
  );
}

/* 10. Priority Inbox */

type PriorityId = "reply" | "fyi";
type PriorityGroup = { id: PriorityId; title: string; dot: string; items: { from: string; subject: string; time: string }[] };

const PRIORITY_GROUPS: PriorityGroup[] = [
  {
    id: "reply",
    title: "Needs a reply",
    dot: "bg-status-rose-text",
    items: [
      { from: "Maya", subject: "Pricing page — final sign-off", time: "9:42" },
      { from: "Priya", subject: "Contract redlines, clause 4", time: "8:05" },
    ],
  },
  { id: "fyi", title: "Worth knowing", dot: "bg-status-lime-text", items: [{ from: "Dev", subject: "Deploy finished at 8:12", time: "8:12" }] },
];

export function PriorityInbox() {
  const baseId = useId();
  const [collapsed, setCollapsed] = useState<Record<PriorityId, boolean>>({ reply: false, fyi: true });
  const total = PRIORITY_GROUPS.reduce((count, group) => count + group.items.length, 0);

  return (
    <section aria-label="Priority inbox" className={cx(card, "max-w-[320px] p-2")}>
      <div className="flex h-5 items-center gap-1.5 px-0.5">
        <RiInboxLine className="size-3.5 text-foreground-icon-secondary" aria-hidden />
        <h3 className="text-caption-1-semibold text-text-primary">Priority inbox</h3>
        <span className="ms-auto font-mono text-caption-2-regular tabular-nums text-text-tertiary" aria-hidden>{total}</span>
        <span className="sr-only">{total} messages</span>
      </div>

      {PRIORITY_GROUPS.map((group, index) => {
        const isCollapsed = collapsed[group.id];
        const panelId = `${baseId}-${group.id}`;
        return (
          <div key={group.id} className={cx(index > 0 && "mt-0.5 border-t border-separator-border pt-0.5")}>
            <button
              type="button"
              aria-expanded={!isCollapsed}
              aria-controls={panelId}
              onClick={() => setCollapsed((current) => ({ ...current, [group.id]: !current[group.id] }))}
              className={cx(
                "flex h-6 w-full items-center gap-1.5 rounded-md px-1 text-start",
                transition,
                focusRing,
                "hover:bg-background-secondary-default",
              )}
            >
              <span className={cx("size-1.5 shrink-0 rounded-full", group.dot)} aria-hidden />
              <span className="text-caption-1-semibold text-text-primary">{group.title}</span>
              <span className="font-mono text-caption-2-regular tabular-nums text-text-tertiary">{group.items.length}</span>
              <RiArrowDownSLine className={cx("ms-auto size-3.5 text-foreground-icon-tertiary transition-[transform] duration-200 ease-out motion-reduce:transition-none", !isCollapsed && "rotate-180")} aria-hidden />
            </button>
            <div id={panelId} inert={isCollapsed} className={cx(reveal, isCollapsed ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100")}>
              <ul className="min-h-0 overflow-hidden">
                {group.items.map((item) => (
                  <li key={item.subject} className="flex h-6 items-center gap-1.5 ps-2 pe-1">
                    <span className="w-14 shrink-0 truncate text-caption-1-semibold text-text-primary">{item.from}</span>
                    <span className="min-w-0 flex-1 truncate text-caption-1-regular text-text-secondary">{item.subject}</span>
                    <span className="shrink-0 font-mono text-caption-2-regular tabular-nums text-text-tertiary">{item.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </section>
  );
}

/* 11. Shared Inbox */

type Teammate = { id: string; name: string; role: string; initials: string; tint: Tone };

const TEAMMATES: Teammate[] = [
  { id: "priya", name: "Priya Nair", role: "Support lead", initials: "PN", tint: "rose" },
  { id: "dev", name: "Dev Raman", role: "On-call engineer", initials: "DR", tint: "cyan" },
  { id: "sam", name: "Sam Okafor", role: "Billing", initials: "SO", tint: "lime" },
];

export function SharedInbox() {
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [assignee, setAssignee] = useState<string | null>(null);
  const person = TEAMMATES.find((teammate) => teammate.id === assignee) ?? null;
  const close = () => { setOpen(false); triggerRef.current?.focus(); };

  return (
    <div className="w-full max-w-[320px]" onKeyDown={(event) => { if (event.key === "Escape" && open) { event.stopPropagation(); close(); } }}>
      <section aria-label="Shared inbox thread" className={cx(card, "p-2")}>
        <div className="flex items-center gap-2">
          <Avatar initials="JR" tint="neutral" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-caption-1-semibold text-text-primary">Re: Refund for order #4821</p>
            <p className="truncate text-caption-2-regular text-text-tertiary">Jonas Reed · 9:27 AM</p>
          </div>
          <span className="shrink-0 rounded-full bg-status-rose-background px-1.5 py-0.5 text-caption-2-medium text-status-rose-text">Open</span>
        </div>

        <div className="mt-1.5 flex h-7 items-center gap-1.5 rounded-lg bg-background-secondary-default px-1.5">
          {person ? <Avatar initials={person.initials} tint={person.tint} /> : (
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-dashed border-border-button-default text-foreground-icon-tertiary"><RiUserLine className="size-3" aria-hidden /></span>
          )}
          <span className="min-w-0 flex-1 truncate text-caption-1-medium text-text-primary">{person ? person.name : "Unassigned"}</span>
          <button ref={triggerRef} type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((current) => !current)} className={cx(quietButton, "h-6 px-1.5 text-caption-2-semibold")}>
            {open ? "Close" : person ? "Reassign" : "Assign"}
          </button>
        </div>

        <div id={panelId} inert={!open} className={cx(reveal, open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
          <div className="min-h-0 overflow-hidden">
            <div role="group" aria-label="Assign to teammate" className="mt-1 flex flex-col gap-0.5">
              {TEAMMATES.map((teammate) => {
                const selected = person?.id === teammate.id;
                return (
                  <button
                    key={teammate.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      setAssignee(teammate.id);
                      setOpen(false);
                      triggerRef.current?.focus();
                    }}
                    className={cx(
                      "flex h-7 w-full items-center gap-1.5 rounded-md px-1 text-start",
                      transition,
                      focusRing,
                      selected ? "bg-background-secondary-default" : "hover:bg-background-secondary-default",
                    )}
                  >
                    <Avatar initials={teammate.initials} tint={teammate.tint} />
                    <span className="min-w-0 flex-1 truncate text-caption-1-medium"><span className="text-text-primary">{teammate.name}</span><span className="text-text-tertiary"> · {teammate.role}</span></span>
                    <RiCheckLine className={cx("size-3.5 shrink-0 text-accent-700 transition-[opacity] duration-150 ease-out motion-reduce:transition-none", selected ? "opacity-100" : "opacity-0")} aria-hidden />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {person && !open && (
          <p key={person.id} role="status" className="mt-1 flex animate-label-in items-center gap-1 text-caption-2-regular text-text-tertiary motion-reduce:animate-none">
            <RiUserSharedLine className="size-3 shrink-0 text-accent-700" aria-hidden />
            Handed off to {person.name} · note added to thread
          </p>
        )}
      </section>
    </div>
  );
}

/* 12. Empty Inbox */

const EMPTY_ACTIONS: { id: string; label: string; icon: IconComponent; note: string }[] = [
  { id: "archive", label: "Archive", icon: RiArchiveLine, note: "Archive opened with 18 threads." },
  { id: "compose", label: "Compose", icon: RiPencilLine, note: "Draft started to Maya Chen." },
  { id: "filters", label: "Clear filters", icon: RiFilter3Line, note: "Filters cleared. 24 threads are back." },
];

export function EmptyInbox() {
  const [picked, setPicked] = useState<string | null>(null);
  const note = EMPTY_ACTIONS.find((action) => action.id === picked)?.note ?? "";

  return (
    <section aria-label="Empty inbox" className={cx(card, "max-w-[320px] p-2.5 text-center")}>
      <span className="mx-auto flex size-8 items-center justify-center rounded-full bg-background-secondary-default text-foreground-icon-secondary ring-4 ring-background-secondary-default/50">
        <RiInboxArchiveLine className="size-4" aria-hidden />
      </span>
      <h3 className="mt-2 text-title-3-semibold text-text-primary">Inbox zero</h3>
      <p className="mt-0.5 text-caption-1-regular text-text-secondary">Nothing waiting on you. 18 archived, 2 snoozed until Monday.</p>

      <div role="group" aria-label="Empty inbox actions" className="mt-2 grid grid-cols-3 gap-1">
        {EMPTY_ACTIONS.map((action) => {
          const Icon = action.icon;
          const active = picked === action.id;
          return (
            <button
              key={action.id}
              type="button"
              aria-pressed={active}
              onClick={() => setPicked(active ? null : action.id)}
              className={cx(
                "flex h-[50px] flex-col items-center justify-center gap-1 rounded-lg border px-1 text-caption-2-semibold",
                transition,
                focusRing,
                active
                  ? "border-accent-500 bg-accent-50 text-accent-700"
                  : "border-border-button-default bg-background-primary-default text-text-secondary hover:bg-background-primary-hover hover:text-text-primary",
              )}
            >
              <Icon className="size-3.5" aria-hidden />
              {action.label}
            </button>
          );
        })}
      </div>

      <div className={cx(reveal, picked ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
        <div className="min-h-0 overflow-hidden">
          <p role="status" aria-live="polite" className="mt-1.5 rounded-lg bg-background-secondary-default px-2 py-1 text-start text-caption-2-regular text-text-secondary">{note}</p>
        </div>
      </div>
    </section>
  );
}

/* Specimens */

export const INBOX_SECTION: ExtendedSection = {
  id: "inbox",
  title: "Inbox",
  blurb: "Threads, labels and the quiet work of staying caught up.",
  file: "inbox.tsx",
  entries: [
    { name: "Thread List", description: "Unread and read threads with arrow-key selection and a mark-all action.", Demo: ThreadList, wide: true },
    { name: "Message Bubble", description: "Sent and received bubbles with a delivery-to-read receipt.", Demo: MessageBubble },
    { name: "Compose Row", description: "To, subject and body with inline validation and a send state.", Demo: ComposeRow },
    { name: "Label Picker", description: "Apply or remove labels and watch the thread counts move.", Demo: LabelPicker },
    { name: "Snooze Menu", description: "Choose a return time, confirm the snooze, then undo it.", Demo: SnoozeMenu },
    { name: "Unread Divider", description: "A new-message split with a count and a jump into the unread run.", Demo: UnreadDivider },
    { name: "Attachment Chip", description: "Upload progress with pause, retry and remove in one chip.", Demo: AttachmentChip },
    { name: "Reply Box", description: "A reply field with mention toggles and a send confirmation.", Demo: ReplyBox },
    { name: "Search Filters", description: "Query and filter chips that narrow the live thread count.", Demo: SearchFilters },
    { name: "Priority Inbox", description: "Messages grouped by urgency with collapsible sections.", Demo: PriorityInbox },
    { name: "Shared Inbox", description: "Assign a thread to a teammate and show the handoff.", Demo: SharedInbox },
    { name: "Empty Inbox", description: "A zero state with three actions that answer back.", Demo: EmptyInbox },
  ],
};
