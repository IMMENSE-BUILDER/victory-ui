"use client";

import { Fragment, useEffect, useId, useRef, useState } from "react";
import type { ComponentType, FormEvent, RefObject } from "react";
import {
  RiAddLine,
  RiArrowDownSLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiAtLine,
  RiCalendarLine,
  RiCheckDoubleLine,
  RiCheckLine,
  RiCloseLine,
  RiContrastLine,
  RiCursorLine,
  RiEyeLine,
  RiFileCopyLine,
  RiFileTextLine,
  RiHeartLine,
  RiLightbulbLine,
  RiLinkM,
  RiPencilLine,
  RiQuestionLine,
  RiReplyLine,
  RiSendPlaneLine,
  RiShareLine,
  RiSparklingLine,
  RiTeamLine,
  RiThumbUpLine,
  RiTimeLine,
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

type Tone = "blue" | "teal" | "pink" | "lime" | "purple" | "neutral";
type Presence = "active" | "away" | "offline";

type TeamMember = { id: string; name: string; initials: string; role: string; tone: Tone; status: Presence; activity: string; email: string };

const TEAM: TeamMember[] = [
  { id: "maya", name: "Maya Chen", initials: "MC", role: "Product designer", tone: "blue", status: "active", activity: "Editing the hero section", email: "maya.chen@northline.co" },
  { id: "dev", name: "Dev Raman", initials: "DR", role: "Staff engineer", tone: "teal", status: "active", activity: "Viewing the launch board", email: "dev.raman@northline.co" },
  { id: "priya", name: "Priya Nair", initials: "PN", role: "Content strategist", tone: "pink", status: "away", activity: "Away · back at 14:00", email: "priya.nair@northline.co" },
  { id: "noah", name: "Noah Williams", initials: "NW", role: "Brand lead", tone: "lime", status: "active", activity: "Commenting on pricing", email: "noah.williams@northline.co" },
  { id: "sam", name: "Sam Okafor", initials: "SO", role: "Product manager", tone: "purple", status: "active", activity: "Reviewing the brief", email: "sam.okafor@northline.co" },
  { id: "lena", name: "Lena Fischer", initials: "LF", role: "Researcher", tone: "neutral", status: "offline", activity: "Offline · last seen 16:20", email: "lena.fischer@northline.co" },
];

const YOU: TeamMember = { id: "you", name: "Jordan Lee", initials: "JL", role: "Product lead", tone: "neutral", status: "active", activity: "Reviewing hero copy", email: "jordan.lee@northline.co" };

function findMember(id: string): TeamMember {
  if (id === YOU.id) return YOU;
  return TEAM.find((member) => member.id === id) ?? TEAM[0];
}

const TINTS: Record<Tone, string> = {
  blue: "bg-accent-500/15", teal: "bg-chart-1/20", pink: "bg-chart-3/20",
  lime: "bg-chart-2/20", purple: "bg-chart-5/20", neutral: "bg-background-secondary-default",
};

const STATUS_DOT: Record<Presence, string> = { active: "bg-status-lime-text", away: "bg-status-yellow-text", offline: "bg-foreground-icon-quaternary" };
const STATUS_LABEL: Record<Presence, string> = { active: "Active now", away: "Away", offline: "Offline" };

const AVATAR_SIZES = {
  xs: "size-5 text-caption-2-semibold", sm: "size-6 text-caption-2-semibold",
  md: "size-7 text-caption-2-semibold", lg: "size-8 text-caption-1-semibold",
} as const;

function Avatar({
  member, size = "sm", status = false, className,
}: { member: TeamMember; size?: keyof typeof AVATAR_SIZES; status?: boolean; className?: string }) {
  return (
    <span className={cx("relative inline-flex shrink-0", className)}>
      <span
        aria-hidden
        className={cx(
          "flex items-center justify-center rounded-full text-text-primary ring-1 ring-inset ring-foreground-icon-primary/5",
          TINTS[member.tone],
          AVATAR_SIZES[size],
        )}
      >
        {member.initials}
      </span>
      {status && (
        <span
          role="img"
          aria-label={STATUS_LABEL[member.status]}
          className={cx("absolute -bottom-0.5 -end-0.5 size-2 rounded-full ring-2 ring-background-primary-default", STATUS_DOT[member.status])}
        />
      )}
    </span>
  );
}

function MenuRow({
  member, icon: Icon, label, meta, checked, role = "menuitemradio", onClick,
}: {
  member?: TeamMember;
  icon?: IconComponent;
  label: string;
  meta?: string;
  checked?: boolean;
  role?: "menuitem" | "menuitemradio";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={role === "menuitemradio" ? checked : undefined}
      onClick={onClick}
      className={cx(
        "flex h-7 w-full items-center gap-1.5 rounded-md px-1.5 text-start",
        "transition-colors duration-150 ease-out motion-reduce:transition-none",
        focusRing,
        checked ? "bg-background-secondary-default" : "hover:bg-dropdown-item-hover-background",
      )}
    >
      {member ? <Avatar member={member} size="sm" status /> : Icon ? <Icon className="size-3.5 shrink-0" aria-hidden /> : null}
      <span className="min-w-0 flex-1 truncate text-caption-1-medium text-text-primary">{label}</span>
      {meta && <span className="shrink-0 text-caption-2-regular text-text-tertiary">{meta}</span>}
      {checked && <RiCheckLine className="size-3 shrink-0 text-accent-600" aria-hidden />}
    </button>
  );
}

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";
const transition = "transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-200 ease-out motion-reduce:transition-none";
const card = "w-full max-w-[320px] rounded-xl border border-border-button-default bg-background-primary-default shadow-card";
const buttonBase =
  "inline-flex items-center justify-center gap-1 rounded-lg text-caption-1-semibold " +
  "transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-150 ease-out " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 " +
  "motion-reduce:transition-none motion-reduce:active:scale-100";
const primaryButton = cx(buttonBase, "h-7 bg-button-primary px-2.5 text-text-white shadow-xs", focusRing);
const secondaryButton = cx(buttonBase, "h-7 border border-border-button-default bg-background-primary-default px-2.5 text-text-primary shadow-xs hover:bg-background-primary-hover", focusRing);
const quietButton = cx(buttonBase, "h-6 px-1.5 text-text-secondary hover:bg-background-secondary-default hover:text-text-primary", focusRing);
const iconButton = cx(
  "flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-icon-tertiary",
  "transition-[background-color,color] duration-150 ease-out hover:bg-background-tertiary-default hover:text-text-primary",
  "motion-reduce:transition-none",
  focusRing,
);
const menuSurface = "absolute z-30 overflow-hidden rounded-lg border border-border-button-default bg-background-primary-default p-1 shadow-dropdown";
const chip = "h-6 rounded-full px-2 text-caption-2-semibold transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none";
const selectedChip = "bg-segmented-control-selected-background text-text-primary shadow-xs";
const idleChip = "text-text-tertiary hover:text-text-secondary";

/** Close a popover when the pointer lands outside it. */
function useDismiss(ref: RefObject<HTMLElement | null>, onDismiss: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const handler = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) onDismiss();
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [ref, onDismiss, active]);
}

/** Close an overlay from the keyboard, wherever focus sits inside it. */
function useEscape(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;
    const handler = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onEscape();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [active, onEscape]);
}

/* 1. Threaded Comments */

type Reply = { id: string; authorId: string; text: string; time: string };

const INITIAL_REPLIES: Reply[] = [
  { id: "r1", authorId: "dev", text: "Can trim four words at 1024.", time: "1h" },
  { id: "r2", authorId: "priya", text: "Done in v4 — one line at 1280.", time: "18m" },
];

export function ThreadedComments() {
  const [resolved, setResolved] = useState(false);
  const [replies, setReplies] = useState<Reply[]>(INITIAL_REPLIES);
  const [draft, setDraft] = useState("");
  const author = findMember("maya");
  const latest = replies.slice(-2);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setReplies((current) => [...current, { id: `r${current.length + 1}`, authorId: YOU.id, text, time: "now" }]);
    setDraft("");
  };

  return (
    <section aria-label="Comment thread on the homepage hero" className={cx(card, "p-2.5 transition-colors duration-200 ease-out motion-reduce:transition-none", resolved && "border-status-lime-text/40")}>
      <div className="flex items-center gap-1.5">
        <Avatar member={author} status />
        <div className="min-w-0 flex-1">
          <p className="flex items-baseline gap-1 text-caption-1-semibold text-text-primary">
            <span className="truncate">{author.name}</span>
            <span className="shrink-0 text-caption-2-regular text-text-tertiary">2h</span>
          </p>
          <p className="truncate text-caption-2-regular text-text-tertiary">{author.role}</p>
        </div>
        <button
          type="button" aria-pressed={resolved} aria-label={resolved ? "Reopen comment thread" : "Resolve comment thread"}
          onClick={() => setResolved((current) => !current)}
          className={cx(
            "inline-flex h-6 shrink-0 items-center gap-1 rounded-md border px-1.5 text-caption-2-semibold", transition, focusRing,
            resolved
              ? "border-status-lime-text/40 bg-status-lime-background text-status-lime-text"
              : "border-border-button-default bg-background-primary-default text-text-secondary hover:bg-background-primary-hover hover:text-text-primary",
          )}
        >
          {resolved ? <RiCheckDoubleLine className="size-3" aria-hidden /> : <RiCheckLine className="size-3" aria-hidden />}
          {resolved ? "Reopen" : "Resolve"}
        </button>
      </div>

      <p className={cx("mt-1.5 text-caption-1-regular transition-colors duration-200 ease-out motion-reduce:transition-none", resolved ? "text-text-tertiary" : "text-text-secondary")}>
        The subtitle wraps at 1024. Can it hold two lines before review?
      </p>

      <div aria-live="polite" className={cx("mt-1.5 flex flex-col gap-1 border-s-2 border-separator-border ps-2 transition-opacity duration-200 ease-out motion-reduce:transition-none", resolved ? "opacity-50" : "opacity-100")}>
        {latest.map((reply) => {
          const replyAuthor = findMember(reply.authorId);
          return (
            <div key={reply.id} className="flex items-start gap-1.5 animate-label-in motion-reduce:animate-none">
              <Avatar member={replyAuthor} size="xs" className="mt-0.5" />
              <p className="min-w-0 flex-1 text-caption-2-regular text-text-secondary">
                <span className="text-caption-2-semibold text-text-primary">{replyAuthor.name.split(" ")[0]}</span> {reply.text}
              </p>
              <span className="shrink-0 text-caption-2-regular text-text-tertiary">{reply.time}</span>
            </div>
          );
        })}
      </div>

      <form className="mt-1.5 flex items-center gap-1 border-t border-separator-border pt-1.5" onSubmit={(event) => { event.preventDefault(); send(); }}>
        <input
          aria-label="Reply to Maya Chen" value={resolved ? "" : draft} disabled={resolved}
          placeholder={resolved ? "Thread resolved" : "Reply to Maya…"}
          onChange={(event) => setDraft(event.target.value)}
          className={cx(
            "h-6 min-w-0 flex-1 rounded-md bg-background-tertiary-default px-2 text-caption-1-regular text-text-primary",
            "outline-none placeholder:text-text-placeholder transition-opacity duration-200 disabled:opacity-50", focusRing,
          )}
        />
        <button type="submit" aria-label="Post reply" disabled={resolved || !draft.trim()} className={cx(iconButton, "size-6 rounded-md")}>
          <RiReplyLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
        </button>
      </form>
    </section>
  );
}

/* 2. Approval Card */

type Decision = "pending" | "approved" | "changes";

const DECISION_LABEL: Record<Decision, string> = {
  pending: "Pending",
  approved: "Approved",
  changes: "Changes",
};

const DECISION_PILL: Record<Decision, string> = {
  pending: "bg-status-yellow-background text-status-yellow-text",
  approved: "bg-status-lime-background text-status-lime-text",
  changes: "bg-status-rose-background text-status-rose-text",
};

export function ApprovalCard() {
  const [decision, setDecision] = useState<Decision>("pending");
  const approver = findMember("maya");
  const message =
    decision === "approved"
      ? "Approved at 09:12. Maya can publish v3."
      : decision === "changes"
        ? "Changes requested. Maya will see the note in the thread."
        : "Waiting on a decision. Handoff is at 17:00.";

  return (
    <section aria-label="Approval for homepage hero copy" className={cx(card, "p-2.5")}>
      <div className="flex items-start gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
          <RiFileTextLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Homepage hero copy</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">v3 · 1280px · requested 09:02</p>
        </div>
      </div>

      <div className="mt-1.5 flex items-center gap-1.5 rounded-lg bg-background-secondary-default px-1.5 py-1">
        <Avatar member={approver} status />
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-1-semibold text-text-primary">{approver.name}</p>
          <p className="truncate text-caption-2-regular text-text-tertiary">Approver · Product design</p>
        </div>
        <span
          role="status"
          className={cx("shrink-0 rounded-full px-1.5 py-0.5 text-caption-2-medium transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none", DECISION_PILL[decision])}
        >
          {DECISION_LABEL[decision]}
        </span>
      </div>

      <p aria-live="polite" className="mt-1.5 flex items-start gap-1 text-caption-2-regular text-text-tertiary">
        {decision === "approved" ? (
          <RiCheckLine className="mt-0.5 size-3 shrink-0 text-status-lime-text" aria-hidden />
        ) : decision === "changes" ? (
          <RiPencilLine className="mt-0.5 size-3 shrink-0 text-status-rose-text" aria-hidden />
        ) : (
          <RiTimeLine className="mt-0.5 size-3 shrink-0" aria-hidden />
        )}
        <span className="min-w-0">{message}</span>
      </p>

      <div role="group" aria-label="Approval decision" className="mt-2 flex gap-1.5">
        <button
          type="button" aria-pressed={decision === "approved"} onClick={() => setDecision("approved")}
          className={cx(
            "h-7 flex-1 border",
            decision === "approved" ? "border-status-lime-text/40 bg-status-lime-background text-status-lime-text" : "border-transparent bg-button-primary text-text-white shadow-xs",
            buttonBase, focusRing,
          )}
        >
          <RiCheckLine className="size-3.5" aria-hidden />
          {decision === "approved" ? "Approved" : "Approve"}
        </button>
        <button
          type="button" aria-pressed={decision === "changes"} onClick={() => setDecision("changes")}
          className={cx(
            "h-7 flex-1 border",
            decision === "changes" ? "border-status-rose-text/40 bg-status-rose-background text-status-rose-text" : "border-border-button-default bg-background-primary-default text-text-primary shadow-xs hover:bg-background-primary-hover",
            buttonBase, focusRing,
          )}
        >
          <RiPencilLine className="size-3.5" aria-hidden />
          {decision === "changes" ? "Changes sent" : "Request changes"}
        </button>
      </div>
    </section>
  );
}

/* 3. Presence Stack */

const PRESENT = ["maya", "dev", "priya", "noah"].map(findMember);

export function PresenceStack() {
  const [selected, setSelected] = useState("maya");
  const [following, setFollowing] = useState<string | null>(null);
  const active = findMember(selected);
  const isFollowing = following === active.id;

  return (
    <section aria-label="People in this file" className={cx(card, "p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">In this file</h3>
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-background-secondary-default px-1.5 py-0.5 text-caption-2-medium text-text-secondary">
          <span className="relative flex size-1.5" aria-hidden>
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-status-lime-text opacity-70 motion-reduce:animate-none" />
            <span className="relative inline-flex size-1.5 rounded-full bg-status-lime-text" />
          </span>
          3 online
        </span>
      </div>

      <div className="mt-2 flex items-center">
        {PRESENT.map((member, index) => {
          const isActive = selected === member.id;
          return (
            <button
              key={member.id} type="button" aria-pressed={isActive} onClick={() => setSelected(member.id)}
              aria-label={`${member.name}, ${STATUS_LABEL[member.status]}, ${member.activity}`}
              className={cx(
                "relative rounded-full transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none",
                index > 0 && "-ms-2",
                isActive ? "z-10 -translate-y-1" : "opacity-80 hover:-translate-y-0.5 hover:opacity-100",
                focusRing,
              )}
            >
              <span className={cx("inline-flex rounded-full ring-2 transition-[box-shadow] duration-200 ease-out motion-reduce:transition-none", isActive ? "ring-accent-500" : "ring-background-primary-default")}>
                <Avatar member={member} size="lg" status />
              </span>
            </button>
          );
        })}
        <span aria-label="Sam Okafor and Lena Fischer are also here" role="img" className="-ms-2 flex size-8 shrink-0 items-center justify-center rounded-full bg-background-tertiary-default text-caption-2-semibold text-text-secondary ring-2 ring-background-primary-default">
          +2
        </span>
      </div>

      <div key={active.id} className="mt-2 flex items-center gap-1.5 rounded-lg bg-background-secondary-default px-2 py-1.5 animate-label-in motion-reduce:animate-none">
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-1-semibold text-text-primary">{active.name}</p>
          <p aria-live="polite" className="truncate text-caption-2-regular text-text-tertiary">{active.activity}</p>
        </div>
        <button
          type="button" aria-pressed={isFollowing} onClick={() => setFollowing(isFollowing ? null : active.id)}
          className={cx(
            quietButton, "h-6 shrink-0 border",
            isFollowing ? "border-accent-500/40 bg-accent-500/10 text-accent-700" : "border-transparent",
          )}
        >
          {isFollowing ? <RiCheckLine className="size-3" aria-hidden /> : <RiEyeLine className="size-3" aria-hidden />}
          {isFollowing ? "Following" : "Follow"}
        </button>
      </div>
    </section>
  );
}

/* 4. Share Dialog */

type Permission = "Can edit" | "Can view";

type AccessEntry = { member: TeamMember; permission: Permission };

const INITIAL_ACCESS: AccessEntry[] = [
  { member: findMember("dev"), permission: "Can edit" }, { member: findMember("priya"), permission: "Can view" },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ShareDialog() {
  const titleId = useId();
  const [open, setOpen] = useState(true);
  const [access, setAccess] = useState<AccessEntry[]>(INITIAL_ACCESS);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [inviteSent, setInviteSent] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const close = () => {
    setOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };
  useEscape(open, close);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  useEffect(() => {
    if (!inviteSent) return;
    const timer = window.setTimeout(() => setInviteSent(null), 2200);
    return () => window.clearTimeout(timer);
  }, [inviteSent]);

  const setPermission = (memberId: string, permission: Permission) => {
    setAccess((current) => current.map((entry) => (entry.member.id === memberId ? { ...entry, permission } : entry)));
  };

  const invite = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = draft.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(email)) { setInviteSent(null); setError("Enter a full email address."); return; }
    setError(null);
    setInviteSent(email);
    setDraft("");
  };

  const copyLink = () => {
    void navigator.clipboard?.writeText("https://northline.co/b/q4-launch").catch(() => undefined);
    setCopied(true);
  };

  if (!open) {
    return (
      <div className={cx(card, "flex items-center justify-between gap-2 p-2.5")}>
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background-tertiary-default text-foreground-icon-secondary">
            <RiShareLine className="size-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="truncate text-body-2-semibold text-text-primary">Q4 launch</p>
            <p className="truncate text-caption-2-regular text-text-tertiary">Dev and Priya have access</p>
          </div>
        </div>
        <button ref={triggerRef} type="button" onClick={() => { setOpen(true); window.requestAnimationFrame(() => emailRef.current?.focus()); }} className={primaryButton}>
          <RiShareLine className="size-3.5" aria-hidden /> Share
        </button>
      </div>
    );
  }

  return (
    <section role="dialog" aria-labelledby={titleId} className={cx(card, "p-2.5 animate-label-in motion-reduce:animate-none")} onKeyDown={(event) => { if (event.key === "Escape") close(); }}>
      <div className="flex items-center gap-1.5">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
          <RiShareLine className="size-3.5" aria-hidden />
        </span>
        <h3 id={titleId} className="min-w-0 flex-1 truncate text-body-2-semibold text-text-primary">Share “Q4 launch”</h3>
        <button type="button" aria-label="Close share dialog" onClick={close} className={iconButton}>
          <RiCloseLine className="size-3.5" aria-hidden />
        </button>
      </div>

      <form className="mt-1.5 flex items-center gap-1" onSubmit={invite} noValidate>
        <input
          ref={emailRef}
          type="email" dir="ltr" aria-label="Email address" aria-invalid={Boolean(error)} value={draft}
          placeholder="name@northline.co" autoComplete="email"
          onChange={(event) => { setDraft(event.target.value); setError(null); }}
          className={cx(
            "h-7 min-w-0 flex-1 rounded-lg bg-background-tertiary-default px-2 text-caption-1-regular text-text-primary",
            "outline-none placeholder:text-text-placeholder", focusRing,
          )}
        />
        <button type="submit" className={cx(primaryButton, "shrink-0 px-2")}>
          {inviteSent ? <><RiCheckLine className="size-3" aria-hidden /> Sent</> : "Invite"}
        </button>
      </form>

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span className="shrink-0 text-caption-2-regular text-text-tertiary">People with access</span>
        <span
          role="status" aria-live="polite"
          className={cx("min-w-0 truncate text-end text-caption-2-regular", error ? "text-text-error-primary" : inviteSent ? "text-status-lime-text" : "text-text-tertiary")}
        >
          {error ?? (inviteSent ? `Invite sent to ${inviteSent}` : "2 of 5 seats")}
        </span>
      </div>

      <ul className="mt-0.5 flex flex-col gap-0.5">
        {access.map((entry) => (
          <li key={entry.member.id} className="flex h-6 items-center gap-1.5">
            <Avatar member={entry.member} size="sm" status />
            <span className="min-w-0 flex-1 truncate text-caption-2-medium text-text-primary">{entry.member.name}</span>
            <div className="relative shrink-0">
              <select
                aria-label={`Permission for ${entry.member.name}`} value={entry.permission}
                onChange={(event) => setPermission(entry.member.id, event.target.value as Permission)}
                className={cx(
                  "h-6 appearance-none rounded-md border border-border-button-default bg-background-primary-default ps-1.5 pe-5",
                  "text-caption-2-medium text-text-secondary outline-none transition-colors duration-150 ease-out",
                  "hover:border-border-button-hover motion-reduce:transition-none", focusRing,
                )}
              >
                <option value="Can edit">Can edit</option>
                <option value="Can view">Can view</option>
              </select>
              <RiArrowDownSLine className="pointer-events-none absolute end-1 top-1/2 size-3 -translate-y-1/2 text-foreground-icon-tertiary" aria-hidden />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-1.5 flex items-center gap-1 border-t border-separator-border pt-1.5">
        <RiLinkM className="size-3.5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
        <span dir="ltr" className="min-w-0 flex-1 truncate text-start text-caption-2-regular text-text-tertiary">northline.co/b/q4-launch</span>
        <button type="button" onClick={copyLink} aria-live="polite" className={cx(secondaryButton, "h-6 shrink-0 px-1.5 text-caption-2-semibold")}>
          {copied ? <RiCheckLine className="size-3" aria-hidden /> : <RiFileCopyLine className="size-3" aria-hidden />}
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </section>
  );
}

/* 5. Team Activity */

type ActivityKind = "edit" | "comment" | "approval";
type Activity = { id: string; actorId: string; verb: string; target: string; suffix: string; time: string; kind: ActivityKind };

const ACTIVITY: Activity[] = [
  { id: "a1", actorId: "maya", verb: "moved", target: "Hero copy", suffix: "to In review", time: "09:12", kind: "edit" },
  { id: "a2", actorId: "dev", verb: "approved", target: "Homepage v3", suffix: "", time: "08:48", kind: "approval" },
  { id: "a3", actorId: "priya", verb: "commented on", target: "Pricing table", suffix: "", time: "08:31", kind: "comment" },
  { id: "a4", actorId: "noah", verb: "uploaded", target: "cover-final.png", suffix: "", time: "Yesterday", kind: "edit" },
  { id: "a5", actorId: "maya", verb: "renamed", target: "cover-final.png", suffix: "to Hero cover", time: "Yesterday", kind: "edit" },
];

const ACTIVITY_FILTERS = [
  { id: "all", label: "All" }, { id: "edit", label: "Edits" }, { id: "comment", label: "Comments" }, { id: "approval", label: "Approvals" },
] as const;

type ActivityFilter = (typeof ACTIVITY_FILTERS)[number]["id"];

export function TeamActivity() {
  const [filter, setFilter] = useState<ActivityFilter>("all");
  const items = ACTIVITY.filter((item) => filter === "all" || item.kind === filter);
  const visible = items.slice(0, 3);

  return (
    <section aria-label="Recent team activity" className={cx(card, "p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Team activity</h3>
        <span className="flex shrink-0 items-center gap-1 text-caption-2-regular text-text-tertiary">
          <span className="relative flex size-1.5" aria-hidden>
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-status-lime-text opacity-70 motion-reduce:animate-none" />
            <span className="relative inline-flex size-1.5 rounded-full bg-status-lime-text" />
          </span>
          Live
        </span>
      </div>

      <div role="group" aria-label="Filter activity" className="mt-1 flex items-center gap-0.5 rounded-full bg-background-secondary-default p-0.5">
        {ACTIVITY_FILTERS.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={filter === option.id}
            onClick={() => setFilter(option.id)}
            className={cx(chip, focusRing, filter === option.id ? selectedChip : idleChip)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <ul key={filter} aria-live="polite" className="mt-1 flex flex-col animate-label-in motion-reduce:animate-none">
        {visible.map((item) => {
          const actor = findMember(item.actorId);
          return (
            <li key={item.id} className="flex h-7 items-center gap-1.5">
              <Avatar member={actor} size="xs" status />
              <p className="min-w-0 flex-1 truncate text-caption-2-regular text-text-secondary">
                <span className="text-caption-2-semibold text-text-primary">{actor.name.split(" ")[0]}</span>{" "}
                {item.verb} <span className="text-text-primary">{item.target}</span>
                {item.suffix ? ` ${item.suffix}` : ""}
              </p>
              <span className="shrink-0 text-caption-2-regular text-text-tertiary">{item.time}</span>
            </li>
          );
        })}
      </ul>

      <p className="mt-1 flex items-center justify-between gap-2 text-caption-2-regular text-text-tertiary">
        <span role="status" aria-live="polite">
          Showing {visible.length} of {items.length} updates
        </span>
        <span className="shrink-0 tabular-nums">Today</span>
      </p>
    </section>
  );
}

/* 6. Reaction Picker */

type ReactionKey = "approve" | "love" | "insight" | "question" | "thanks" | "celebrate";

type ReactionDef = { key: ReactionKey; label: string; icon: IconComponent };

const REACTION_DEFS: ReactionDef[] = [
  { key: "approve", label: "Approved", icon: RiCheckDoubleLine }, { key: "love", label: "Love", icon: RiHeartLine }, { key: "insight", label: "Insightful", icon: RiLightbulbLine },
  { key: "question", label: "Question", icon: RiQuestionLine }, { key: "thanks", label: "Thanks", icon: RiThumbUpLine }, { key: "celebrate", label: "Celebrate", icon: RiSparklingLine },
];

type Reaction = { key: ReactionKey; count: number; mine: boolean };

const INITIAL_REACTIONS: Reaction[] = [
  { key: "approve", count: 4, mine: false }, { key: "love", count: 2, mine: true }, { key: "insight", count: 1, mine: false },
];

function reactionDef(key: ReactionKey): ReactionDef {
  return REACTION_DEFS.find((item) => item.key === key) ?? REACTION_DEFS[0];
}

export function ReactionPicker() {
  const [reactions, setReactions] = useState<Reaction[]>(INITIAL_REACTIONS);
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const addRef = useRef<HTMLButtonElement>(null);
  const author = findMember("maya");
  const remaining = REACTION_DEFS.filter((def) => !reactions.some((item) => item.key === def.key));
  const total = reactions.reduce((sum, item) => sum + item.count, 0);

  const closePicker = () => {
    setOpen(false);
    addRef.current?.focus();
  };

  useDismiss(pickerRef, () => setOpen(false), open);
  useEscape(open, closePicker);

  const toggle = (key: ReactionKey) => {
    setReactions((current) => current.flatMap((item) => {
      if (item.key !== key) return [item];
      const mine = !item.mine;
      const count = item.count + (mine ? 1 : -1);
      return count <= 0 ? [] : [{ ...item, mine, count }];
    }));
  };

  const add = (key: ReactionKey) => {
    setReactions((current) => current.some((item) => item.key === key)
      ? current.map((item) => (item.key === key ? { ...item, mine: true, count: item.count + (item.mine ? 0 : 1) } : item))
      : [...current, { key, count: 1, mine: true }]);
    closePicker();
  };

  return (
    <section aria-label="Reactions on Maya's comment" className={cx(card, "p-2.5")} onKeyDown={(event) => { if (event.key === "Escape" && open) closePicker(); }}>
      <div className="flex items-center gap-1.5">
        <Avatar member={author} status />
        <p className="min-w-0 flex-1 truncate text-caption-1-semibold text-text-primary">{author.name}</p>
        <span className="shrink-0 text-caption-2-regular text-text-tertiary">09:12</span>
      </div>

      <p className="mt-1 text-caption-1-regular text-text-secondary">The new empty state reads well. Ship it after the copy check?</p>

      <div ref={pickerRef} className="relative mt-1.5 flex flex-wrap items-center gap-1" role="group" aria-label="Reactions">
        {reactions.map((item) => {
          const def = reactionDef(item.key);
          const Icon = def.icon;
          return (
            <button
              key={item.key} type="button" aria-pressed={item.mine} onClick={() => toggle(item.key)}
              aria-label={`${def.label}, ${item.count} ${item.count === 1 ? "reaction" : "reactions"}${item.mine ? ", including yours" : ""}`}
              className={cx(
                "inline-flex h-6 items-center gap-1 rounded-full border px-1.5 text-caption-2-semibold",
                "transition-[background-color,border-color,color,transform] duration-150 ease-out active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100",
                focusRing,
                item.mine
                  ? "border-accent-500 bg-accent-500/10 text-accent-700"
                  : "border-border-button-default bg-background-primary-default text-text-secondary hover:bg-background-primary-hover hover:text-text-primary",
              )}
            >
              <Icon className="size-3" aria-hidden />
              <span key={item.count} className="tabular-nums animate-label-in motion-reduce:animate-none">{item.count}</span>
            </button>
          );
        })}

        <button
          ref={addRef} type="button" aria-label="Add a reaction" aria-haspopup="menu" aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          className={cx(iconButton, "size-6 rounded-full border border-border-button-default", open && "border-accent-500 text-accent-600")}
        >
          <RiAddLine className="size-3.5" aria-hidden />
        </button>

        {open && (
          <div role="menu" aria-label="Choose a reaction" className={cx(menuSurface, "bottom-full end-0 mb-1 flex w-36 flex-col gap-0.5 animate-label-in motion-reduce:animate-none")}>
            {remaining.length === 0 ? (
              <p className="px-1.5 py-1 text-caption-2-regular text-text-tertiary">All reactions added.</p>
            ) : (
              remaining.map((def) => <MenuRow key={def.key} icon={def.icon} label={def.label} role="menuitem" onClick={() => add(def.key)} />)
            )}
          </div>
        )}
      </div>

      <p className="mt-1 flex items-center gap-1 text-caption-2-regular text-text-tertiary">
        <span aria-live="polite" className="tabular-nums">{total} reactions</span>
        <span aria-hidden>·</span>
        <span>Everyone on Product can see them</span>
      </p>
    </section>
  );
}

/* 7. Mention Menu */

export function MentionMenu() {
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("Hero copy is ready for review, @");
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState<string | null>(null);

  const mention = /(?:^|\s)@([^\s@]*)$/.exec(value);
  const query = mention?.[1] ?? "";
  const menuOpen = open && mention !== null;
  const results = TEAM.filter((member) => member.name.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 2);
  const safeActive = Math.min(active, Math.max(0, results.length - 1));

  useEscape(menuOpen, () => setOpen(false));

  const choose = (member: TeamMember) => {
    setValue((current) => current.replace(/@[^\s@]*$/, `@${member.name} `));
    setOpen(false);
    setStatus(`Mentioned ${member.name}.`);
    inputRef.current?.focus();
  };

  const send = () => {
    if (!value.trim() || value.trim().endsWith("@")) return;
    setStatus("Comment posted to “Hero copy”.");
    setValue("");
    setOpen(false);
  };

  return (
    <section
      aria-label="Comment with mentions"
      className={cx(card, "p-2.5")}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false); }}
    >
      <div className="flex items-center gap-1.5">
        <Avatar member={YOU} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-body-2-semibold text-text-primary">New comment</p>
          <p className="truncate text-caption-2-regular text-text-tertiary">on Hero copy · as Jordan Lee</p>
        </div>
      </div>

      <div className={cx(
        "mt-1.5 flex h-8 items-center gap-1.5 rounded-lg bg-background-tertiary-default px-2",
        "ring-2 ring-inset ring-transparent transition-[box-shadow] duration-150 ease-out focus-within:ring-border-focus-ring motion-reduce:transition-none",
      )}>
        <RiAtLine className="size-3.5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
        <input
          ref={inputRef} role="combobox" aria-label="Comment text, type at to mention a teammate"
          aria-expanded={menuOpen} aria-controls={listId} aria-autocomplete="list"
          aria-activedescendant={menuOpen && results[safeActive] ? `${listId}-${results[safeActive].id}` : undefined}
          value={value}
          onChange={(event) => {
            const next = event.target.value;
            setValue(next);
            setActive(0);
            setOpen(/(?:^|\s)@[^\s@]*$/.test(next));
            setStatus(null);
          }}
          onKeyDown={(event) => {
            if (!menuOpen) return;
            if (event.key === "ArrowDown" && results.length > 0) {
              event.preventDefault();
              setActive((safeActive + 1) % results.length);
            }
            if (event.key === "ArrowUp" && results.length > 0) {
              event.preventDefault();
              setActive((safeActive - 1 + results.length) % results.length);
            }
            if (event.key === "Enter" && results[safeActive]) {
              event.preventDefault();
              choose(results[safeActive]);
            }
            if (event.key === "Escape") {
              event.stopPropagation();
              setOpen(false);
            }
          }}
          className="min-w-0 flex-1 bg-transparent p-0 text-caption-1-regular text-text-primary outline-none placeholder:text-text-placeholder"
        />
      </div>

      {menuOpen && (
        <div className="mt-1 overflow-hidden rounded-lg border border-border-button-default bg-background-primary-default p-0.5 shadow-dropdown animate-label-in motion-reduce:animate-none">
          <ul id={listId} role="listbox" aria-label="Teammates">
            {results.length === 0 ? (
              <li className="px-2 py-1 text-caption-2-regular text-text-tertiary">No teammate matches “{query}”.</li>
            ) : (
              results.map((member, index) => (
                <li key={member.id} role="presentation">
                  <button
                    id={`${listId}-${member.id}`} type="button" role="option" aria-selected={index === safeActive}
                    onMouseDown={(event) => event.preventDefault()} onMouseEnter={() => setActive(index)} onClick={() => choose(member)}
                    className={cx(
                      "flex h-6 w-full items-center gap-1.5 rounded-md px-1.5 text-start",
                      "transition-colors duration-150 ease-out motion-reduce:transition-none", focusRing,
                      index === safeActive ? "bg-background-secondary-default" : "hover:bg-dropdown-item-hover-background",
                    )}
                  >
                    <Avatar member={member} size="xs" />
                    <span className="min-w-0 flex-1 truncate text-caption-1-medium text-text-primary">{member.name}</span>
                    <span className="shrink-0 text-caption-2-regular text-text-tertiary">{member.role}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span
          role="status" aria-live="polite"
          className={cx("min-w-0 truncate text-caption-2-regular", status ? "text-status-lime-text" : "text-text-tertiary")}
        >
          {status ?? (menuOpen ? "↑↓ browse · ↵ insert · Esc close" : "Type @ to mention a teammate")}
        </span>
        <button type="button" onClick={send} disabled={!value.trim() || value.trim().endsWith("@")} className={cx(primaryButton, "h-6 shrink-0 px-2 text-caption-2-semibold")}>
          <RiSendPlaneLine className="size-3 rtl:-scale-x-100" aria-hidden /> Send
        </button>
      </div>
    </section>
  );
}

/* 8. Review Status */

const REVIEW_STAGES = [
  { id: "draft", label: "Draft", icon: RiPencilLine }, { id: "review", label: "In review", icon: RiEyeLine }, { id: "approved", label: "Approved", icon: RiCheckDoubleLine },
] as const;

const REVIEW_META = [
  { detail: "Last edited by Maya Chen", time: "09:41", pill: "bg-background-tertiary-default text-text-secondary" },
  { detail: "Maya Chen is reviewing · 2 open comments", time: "10:05", pill: "bg-status-yellow-background text-status-yellow-text" },
  { detail: "Approved by Maya Chen", time: "09:12", pill: "bg-status-lime-background text-status-lime-text" },
] as const;

export function ReviewStatus() {
  const [stage, setStage] = useState(1);
  const last = REVIEW_STAGES.length - 1;
  const current = REVIEW_STAGES[stage];
  const meta = REVIEW_META[stage];
  const reviewer = findMember("maya");

  const advance = () => {
    if (stage === last) setStage(1);
    else setStage(stage + 1);
  };

  return (
    <section aria-label="Q4 launch brief review status" className={cx(card, "p-2.5")}>
      <div className="flex items-center gap-1.5">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
          <RiFileTextLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Q4 launch brief</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">v3 · 4 pages · 09:41</p>
        </div>
        <span
          role="status"
          className={cx("shrink-0 rounded-full px-1.5 py-0.5 text-caption-2-medium transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none", meta.pill)}
        >
          {current.label}
        </span>
      </div>

      <ol className="mt-2 flex items-start">
        {REVIEW_STAGES.map((item, position) => {
          const Icon = item.icon;
          const active = position === stage;
          const complete = position < stage;
          return (
            <li key={item.id} className={cx("flex items-start", position < last && "flex-1")}>
              <button type="button" aria-pressed={active} aria-label={`Set status to ${item.label}`} onClick={() => setStage(position)} className={cx("flex flex-col items-center gap-1 rounded-md", focusRing)}>
                <span
                  className={cx(
                    "flex size-6 items-center justify-center rounded-full border", transition,
                    complete
                      ? "border-accent-600 bg-accent-600 text-text-white"
                      : active
                        ? "border-accent-600 bg-background-primary-default text-accent-600 ring-2 ring-accent-500/20"
                        : "border-border-button-default bg-background-primary-default text-foreground-icon-tertiary",
                  )}
                >
                  {complete ? <RiCheckLine className="size-3" aria-hidden /> : <Icon className="size-3" aria-hidden />}
                </span>
                <span className={cx("whitespace-nowrap text-caption-2-medium transition-colors duration-150 ease-out motion-reduce:transition-none", active ? "text-text-primary" : "text-text-tertiary")}>
                  {item.label}
                </span>
              </button>
              {position < last && (
                <span
                  aria-hidden
                  className={cx(
                    "mx-1 mt-[11px] mb-4 h-0.5 min-w-4 flex-1 rounded-full transition-[background-color] duration-200 ease-out motion-reduce:transition-none",
                    position < stage ? "bg-accent-500" : "bg-background-tertiary-default",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>

      <div key={stage} className="mt-1.5 flex items-center gap-1.5 rounded-lg bg-background-secondary-default px-2 py-1.5 animate-label-in motion-reduce:animate-none">
        <Avatar member={reviewer} size="sm" status />
        <p aria-live="polite" className="min-w-0 flex-1 truncate text-caption-2-regular text-text-secondary">{meta.detail}</p>
        <span className="shrink-0 text-caption-2-regular text-text-tertiary">{meta.time}</span>
      </div>

      <div className="mt-2 flex items-center gap-1">
        <button
          type="button" aria-label="Move to previous status" disabled={stage === 0}
          onClick={() => setStage(Math.max(0, stage - 1))} className={cx(secondaryButton, "size-7 shrink-0 px-0")}
        >
          <RiArrowLeftLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
        </button>
        <button type="button" onClick={advance} className={cx(primaryButton, "flex-1")}>
          {stage === 2 ? (
            <><RiPencilLine className="size-3.5" aria-hidden /> Reopen for review</>
          ) : stage === 1 ? (
            <><RiCheckLine className="size-3.5" aria-hidden /> Approve document</>
          ) : (
            <>Send for review <RiArrowRightLine className="size-3.5 rtl:-scale-x-100" aria-hidden /></>
          )}
        </button>
      </div>
    </section>
  );
}

/* 9. Cursor Label */

const DOC_LINES = [
  { label: "Intro", text: "The brief, the dates and the people." },
  { label: "Metric", text: "Everyone sees the same status, live." },
  { label: "Rule", text: "Nothing ships without a second review." },
] as const;

const CURSOR_PEOPLE = ["maya", "dev"].map(findMember);

export function CursorLabel() {
  const [line, setLine] = useState(0);
  const [activeId, setActiveId] = useState("maya");
  const active = findMember(activeId);
  const tagTone = active.id === "dev" ? "bg-status-purple-background text-status-purple-text" : "bg-status-blue-background text-status-blue-text";

  return (
    <section aria-label="Live collaborator cursor" className={cx(card, "p-2.5")}>
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Launch notes</h3>
          <p aria-live="polite" className="truncate text-caption-2-regular text-text-tertiary">{active.name.split(" ")[0]} is on the {DOC_LINES[line].label.toLowerCase()}.</p>
        </div>
        <div className="flex shrink-0 items-center">
          {CURSOR_PEOPLE.map((member, index) => (
            <button
              key={member.id} type="button" aria-label={`Follow ${member.name}'s cursor`}
              aria-pressed={activeId === member.id} onClick={() => setActiveId(member.id)}
              className={cx(
                "rounded-full transition-[box-shadow,opacity] duration-150 ease-out motion-reduce:transition-none",
                index > 0 && "-ms-1",
                activeId === member.id ? "z-10 ring-2 ring-accent-500" : "opacity-65 hover:opacity-100",
                focusRing,
              )}
            >
              <Avatar member={member} size="sm" status />
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-1.5 flex h-[112px] flex-col gap-0.5 rounded-lg bg-background-secondary-default p-1.5">
        {DOC_LINES.map((item, index) => (
          <button
            key={item.label} type="button" aria-pressed={line === index} onClick={() => setLine(index)}
            className={cx(
              "flex h-8 w-full items-center gap-2 rounded-md px-1.5 text-start",
              "transition-[background-color,box-shadow] duration-150 ease-out motion-reduce:transition-none", focusRing,
              line === index ? "bg-background-primary-default shadow-xs" : "hover:bg-background-primary-default/60",
            )}
          >
            <span className="w-9 shrink-0 text-caption-2-semibold text-text-tertiary">{item.label}</span>
            <span className="min-w-0 flex-1 truncate text-caption-1-regular text-text-secondary">{item.text}</span>
          </button>
        ))}

        <span
          aria-hidden
          className="pointer-events-none absolute z-10 flex items-center gap-1 transition-transform duration-200 ease-out motion-reduce:transition-none"
          style={{ top: "6px", insetInlineStart: "62%", transform: `translateY(${line * 34}px)` }}
        >
          <RiCursorLine className={cx("size-4 drop-shadow-sm", active.id === "dev" ? "text-status-purple-text" : "text-status-blue-text")} />
          <span key={active.id} className={cx("mt-3 inline-flex h-5 items-center rounded-md px-1.5 text-caption-2-semibold shadow-xs animate-label-in motion-reduce:animate-none", tagTone)}>
            {active.name}
          </span>
        </span>
      </div>
    </section>
  );
}

/* 10. Version Compare */

const VERSIONS = [
  { id: "v1", label: "v1", time: "Nov 3 · 14:02", lines: ["Launch starts Monday.", "One plan for the team.", "Questions go to Maya."] },
  { id: "v2", label: "v2", time: "Nov 4 · 09:20", lines: ["Launch starts Monday.", "Plan, dates and owners in one place.", "Questions go to Maya."] },
  { id: "v3", label: "v3", time: "Nov 5 · 08:47", lines: ["Launch starts Monday.", "Plan, dates and owners, always current.", "Questions go to Maya.", "Ship with a second pair of eyes."] },
] as const;

type VersionId = (typeof VERSIONS)[number]["id"];

function versionById(id: VersionId) {
  return VERSIONS.find((version) => version.id === id) ?? VERSIONS[0];
}

export function VersionCompare() {
  const [leftId, setLeftId] = useState<VersionId>("v2");
  const [rightId, setRightId] = useState<VersionId>("v3");
  const [selected, setSelected] = useState(1);
  const [applied, setApplied] = useState(false);
  const left = versionById(leftId);
  const right = versionById(rightId);
  const rowCount = Math.max(left.lines.length, right.lines.length);

  const changes = Array.from({ length: rowCount }, (_, index) => {
    const leftLine: string | undefined = left.lines[index];
    const rightLine: string | undefined = right.lines[index];
    return { left: leftLine, right: rightLine, changed: leftLine !== rightLine };
  });

  const edited = changes.filter((item) => item.left && item.right && item.changed).length;
  const added = changes.filter((item) => !item.left && item.right).length;
  const removed = changes.filter((item) => item.left && !item.right).length;
  const selectedChange = changes[selected];
  const selectedNote = !selectedChange ? "Pick a line to inspect" : !selectedChange.left ? "Added on the right" : !selectedChange.right ? "Removed from the right" : selectedChange.changed ? "Copy changed" : "No change on this line";

  const changeVersion = (side: "left" | "right", id: VersionId) => {
    if (side === "left") setLeftId(id);
    else setRightId(id);
    setApplied(false);
  };

  const cellTone = (text: string | undefined, side: "left" | "right", changed: boolean) => {
    if (!text) return "border-border-button-default bg-background-secondary-default text-text-tertiary";
    if (!changed) return "border-border-button-default bg-background-primary-default text-text-secondary";
    return side === "left" ? "border-status-rose-text/30 bg-status-rose-background text-status-rose-text" : "border-status-lime-text/30 bg-status-lime-background text-status-lime-text";
  };

  return (
    <section aria-label="Compare document versions" className="w-full max-w-[600px] rounded-xl border border-border-button-default bg-background-primary-default p-3 shadow-card">
      <div className="flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
          <RiContrastLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">Compare versions</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">{edited + added + removed} line changes · {edited} edited</p>
        </div>
        <button
          type="button" aria-pressed={applied} onClick={() => setApplied((current) => !current)}
          className={cx(
            "h-6 shrink-0 border px-2",
            applied ? "border-status-lime-text/40 bg-status-lime-background text-status-lime-text" : "border-transparent bg-button-primary text-text-white shadow-xs",
            buttonBase, focusRing,
          )}
        >
          {applied ? <><RiCheckLine className="size-3" aria-hidden /> {right.label} current</> : `Keep ${right.label}`}
        </button>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-x-1.5 gap-y-1">
        {(["left", "right"] as const).map((side) => {
          const version = side === "left" ? left : right;
          return (
            <div key={side} className="flex min-w-0 items-center justify-between gap-1 rounded-md bg-background-secondary-default px-1.5 py-1">
              <div className="relative shrink-0">
                <select
                  aria-label={`${side === "left" ? "Left" : "Right"} version`} value={side === "left" ? leftId : rightId}
                  onChange={(event) => changeVersion(side, event.target.value as VersionId)}
                  className={cx(
                    "h-6 appearance-none rounded-md border border-border-button-default bg-background-primary-default ps-1.5 pe-5",
                    "text-caption-2-semibold text-text-primary outline-none transition-colors duration-150 ease-out motion-reduce:transition-none", focusRing,
                  )}
                >
                  {VERSIONS.map((version) => <option key={version.id} value={version.id}>{version.label}</option>)}
                </select>
                <RiArrowDownSLine className="pointer-events-none absolute end-1 top-1/2 size-3 -translate-y-1/2 text-foreground-icon-tertiary" aria-hidden />
              </div>
              <span className="truncate text-caption-2-regular text-text-tertiary">{version.time}</span>
            </div>
          );
        })}

        {changes.map((change, index) => (
          <Fragment key={index}>
            {(["left", "right"] as const).map((side) => {
              const text = side === "left" ? change.left : change.right;
              const isSelected = selected === index;
              return (
                <button
                  key={side} type="button" aria-pressed={isSelected} onClick={() => setSelected(index)}
                  aria-label={`${side === "left" ? left.label : right.label}, line ${index + 1}: ${text ?? "no line"}${!text ? ", absent" : change.changed ? ", changed" : ""}`}
                  className={cx(
                    "flex min-h-8 items-center gap-1 rounded-md border px-1.5 py-1 text-start text-caption-2-regular",
                    "transition-[background-color,border-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                    cellTone(text, side, change.changed), isSelected && "ring-2 ring-border-focus-ring", focusRing,
                  )}
                >
                  <span aria-hidden className="w-2 shrink-0 text-center text-caption-2-semibold">{!text ? "—" : change.changed ? (side === "left" ? "−" : "+") : "·"}</span>
                  <span className="min-w-0">{text ?? "No line"}</span>
                </button>
              );
            })}
          </Fragment>
        ))}
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2 text-caption-2-regular text-text-tertiary">
        <span key={`${selected}-${leftId}-${rightId}`} aria-live="polite" className="min-w-0 truncate animate-label-in motion-reduce:animate-none">{selectedNote}</span>
        <span className="shrink-0 tabular-nums">{left.label} → {right.label}</span>
      </div>
    </section>
  );
}

/* 11. Task Assignee */

const DUE_DATES = [
  { id: "today", label: "Today", detail: "Thu, Nov 5" },
  { id: "tomorrow", label: "Tomorrow", detail: "Fri, Nov 6" },
  { id: "monday", label: "Monday", detail: "Mon, Nov 9" },
] as const;

type DueId = (typeof DUE_DATES)[number]["id"];

export function TaskAssignee() {
  const [assigneeId, setAssigneeId] = useState("maya");
  const [dueId, setDueId] = useState<DueId>("today");
  const [openMenu, setOpenMenu] = useState<"assignee" | "due" | null>(null);
  const [done, setDone] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const assigneeRef = useRef<HTMLButtonElement>(null);
  const dueRef = useRef<HTMLButtonElement>(null);
  const assignee = findMember(assigneeId);
  const due = DUE_DATES.find((item) => item.id === dueId) ?? DUE_DATES[0];

  const closeMenu = () => {
    const trigger = openMenu === "assignee" ? assigneeRef.current : dueRef.current;
    setOpenMenu(null);
    trigger?.focus();
  };

  useDismiss(cardRef, () => setOpenMenu(null), openMenu !== null);
  useEscape(openMenu !== null, closeMenu);

  return (
    <section ref={cardRef} aria-label="Task assignment" className={cx(card, "relative p-2.5")}>
      <div className="flex items-start gap-2">
        <button
          type="button" role="checkbox" aria-checked={done} aria-label="Mark finalise launch checklist complete" onClick={() => setDone((current) => !current)}
          className={cx(
            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border", transition, focusRing,
            done ? "border-accent-600 bg-accent-600 text-text-white" : "border-border-checkbox-default bg-background-primary-default hover:border-border-checkbox-hover",
          )}
        >
          <RiCheckLine className={cx("size-3 transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none", done ? "scale-100 opacity-100" : "scale-50 opacity-0")} aria-hidden />
        </button>
        <div className="min-w-0 flex-1">
          <h3 className={cx("text-body-2-semibold transition-colors duration-200 ease-out motion-reduce:transition-none", done ? "text-text-tertiary line-through" : "text-text-primary")}>Finalise launch checklist</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">Hero copy · review at 09:00</p>
        </div>
      </div>

      <div className="relative mt-2">
        <button
          ref={assigneeRef} type="button" aria-haspopup="menu" aria-expanded={openMenu === "assignee"}
          aria-label={`Assignee: ${assignee.name}. Change assignee`}
          onClick={() => setOpenMenu(openMenu === "assignee" ? null : "assignee")}
          className={cx(
            "flex h-8 w-full items-center gap-1.5 rounded-lg border px-1.5 text-start", transition, focusRing,
            openMenu === "assignee" ? "border-accent-500 bg-background-secondary-default" : "border-border-button-default bg-background-primary-default hover:bg-background-primary-hover",
          )}
        >
          <Avatar member={assignee} size="sm" status />
          <span className="min-w-0 flex-1 truncate text-caption-1-semibold text-text-primary">{assignee.name}</span>
          <span className="shrink-0 text-caption-2-regular text-text-tertiary">{assignee.role}</span>
          <RiArrowDownSLine className={cx("size-3.5 shrink-0 text-foreground-icon-tertiary transition-transform duration-150 ease-out motion-reduce:transition-none", openMenu === "assignee" && "rotate-180")} aria-hidden />
        </button>

        {openMenu === "assignee" && (
          <div role="menu" aria-label="Choose assignee" className={cx(menuSurface, "inset-x-0 top-full mt-1 flex flex-col gap-0.5 animate-label-in motion-reduce:animate-none")}>
            {TEAM.slice(0, 4).map((member) => (
              <MenuRow
                key={member.id} member={member} label={member.name} meta={member.role} checked={assigneeId === member.id}
                onClick={() => { setAssigneeId(member.id); closeMenu(); }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="relative mt-1">
        <button
          ref={dueRef} type="button" aria-haspopup="menu" aria-expanded={openMenu === "due"}
          aria-label={`Due date: ${due.label}, ${due.detail}. Change due date`}
          onClick={() => setOpenMenu(openMenu === "due" ? null : "due")}
          className={cx(
            "flex h-8 w-full items-center gap-1.5 rounded-lg border px-1.5 text-start", transition, focusRing,
            openMenu === "due" ? "border-accent-500 bg-background-secondary-default" : "border-border-button-default bg-background-primary-default hover:bg-background-primary-hover",
          )}
        >
          <RiCalendarLine className="size-3.5 shrink-0 text-foreground-icon-secondary" aria-hidden />
          <span className="min-w-0 flex-1 truncate text-caption-1-semibold text-text-primary">Due {due.label.toLowerCase()}</span>
          <span className="shrink-0 text-caption-2-regular text-text-tertiary">{due.detail}</span>
          <RiArrowDownSLine className={cx("size-3.5 shrink-0 text-foreground-icon-tertiary transition-transform duration-150 ease-out motion-reduce:transition-none", openMenu === "due" && "rotate-180")} aria-hidden />
        </button>

        {openMenu === "due" && (
          <div role="menu" aria-label="Choose due date" className={cx(menuSurface, "inset-x-0 top-full mt-1 flex flex-col gap-0.5 animate-label-in motion-reduce:animate-none")}>
            {DUE_DATES.map((date) => (
              <MenuRow
                key={date.id} icon={RiCalendarLine} label={date.label} meta={date.detail} checked={dueId === date.id}
                onClick={() => { setDueId(date.id); closeMenu(); }}
              />
            ))}
          </div>
        )}
      </div>

      <p aria-live="polite" className="mt-1.5 truncate text-caption-2-regular text-text-tertiary">
        {done ? `Done. ${assignee.name.split(" ")[0]} will close the checklist.` : `Owned by ${assignee.name.split(" ")[0]} · due ${due.label.toLowerCase()}`}
      </p>
    </section>
  );
}

/* 12. Team Roster */

const ROLES = ["Admin", "Editor", "Viewer"] as const;
type Role = (typeof ROLES)[number];

const INITIAL_ROLES: Record<string, Role> = {
  maya: "Admin", dev: "Editor", priya: "Editor", sam: "Viewer", noah: "Viewer", lena: "Viewer",
};

const ROSTER = ["maya", "dev", "priya", "sam"].map(findMember);

export function TeamRoster() {
  const [roles, setRoles] = useState<Record<string, Role>>(INITIAL_ROLES);
  const [note, setNote] = useState<string | null>(null);
  const activeCount = ROSTER.filter((member) => member.status === "active").length;
  const awayCount = ROSTER.filter((member) => member.status !== "active").length;

  const updateRole = (member: TeamMember, role: Role) => {
    setRoles((current) => ({ ...current, [member.id]: role }));
    setNote(`${member.name} is now ${role}.`);
  };

  return (
    <section aria-label="Product team roster" className={cx(card, "p-2.5")}>
      <div className="flex items-center gap-1.5">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary"><RiTeamLine className="size-3.5" aria-hidden /></span>
        <h3 className="min-w-0 flex-1 truncate text-body-2-semibold text-text-primary">Product team</h3>
        <span className="shrink-0 text-caption-2-regular text-text-tertiary tabular-nums">{ROSTER.length} of 6 members</span>
      </div>

      <ul className="mt-1.5 flex flex-col gap-0.5">
        {ROSTER.map((member) => (
          <li key={member.id} className="flex h-7 items-center gap-1.5">
            <Avatar member={member} size="sm" status />
            <p className="min-w-0 flex-1 truncate text-caption-1-semibold text-text-primary">{member.name}</p>
            <div className="relative shrink-0">
              <select
                aria-label={`Access role for ${member.name}, ${STATUS_LABEL[member.status]}`}
                value={roles[member.id]}
                onChange={(event) => updateRole(member, event.target.value as Role)}
                className={cx(
                  "h-6 appearance-none rounded-md border border-border-button-default bg-background-primary-default ps-1.5 pe-5",
                  "text-caption-2-medium text-text-secondary outline-none transition-colors duration-150 ease-out hover:border-border-button-hover",
                  "motion-reduce:transition-none", focusRing,
                )}
              >
                {ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
              </select>
              <RiArrowDownSLine className="pointer-events-none absolute end-1 top-1/2 size-3 -translate-y-1/2 text-foreground-icon-tertiary" aria-hidden />
            </div>
          </li>
        ))}
      </ul>

      <p aria-live="polite" className="mt-1.5 flex items-center justify-between gap-2 text-caption-2-regular text-text-tertiary">
        <span key={note ?? "idle"} className={cx("min-w-0 truncate animate-label-in motion-reduce:animate-none", note && "text-status-lime-text")}>{note ?? "Change a role to update access."}</span>
        <span className="shrink-0 tabular-nums">{activeCount} active · {awayCount} away</span>
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Specimens                                                                  */
/* -------------------------------------------------------------------------- */

export const COLLABORATION_SECTION: ExtendedSection = {
  id: "collaboration",
  title: "Collaboration",
  blurb: "Comments, approvals and the handoff between people.",
  file: "collaboration.tsx",
  entries: [
    { name: "Threaded Comments", description: "A comment with replies, a composer and a resolve state.", Demo: ThreadedComments },
    { name: "Approval Card", description: "Approver, status and one-tap approve or request changes.", Demo: ApprovalCard },
    { name: "Presence Stack", description: "Overlapping faces with live status and a follow detail.", Demo: PresenceStack },
    { name: "Share Dialog", description: "Invite by email, set permissions and copy the link.", Demo: ShareDialog },
    { name: "Team Activity", description: "Recent actions with actors, filterable by kind.", Demo: TeamActivity },
    { name: "Reaction Picker", description: "Icon reactions with counts and a compact picker.", Demo: ReactionPicker },
    { name: "Mention Menu", description: "Type @ to filter teammates and insert a mention.", Demo: MentionMenu },
    { name: "Review Status", description: "Move a document from draft to review to approved.", Demo: ReviewStatus },
    { name: "Cursor Label", description: "A live collaborator cursor on the line you pick.", Demo: CursorLabel },
    { name: "Version Compare", description: "Two versions side by side with a live line diff.", Demo: VersionCompare, wide: true },
    { name: "Task Assignee", description: "Reassign a task and move its due date.", Demo: TaskAssignee },
    { name: "Team Roster", description: "Members, access roles and presence in one list.", Demo: TeamRoster },
  ],
};
