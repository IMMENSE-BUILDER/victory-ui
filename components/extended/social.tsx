"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, RefObject } from "react";
import {
  RiAddLine,
  RiArrowDownSLine,
  RiAtLine,
  RiCalendarLine,
  RiChat3Line,
  RiCheckLine,
  RiCloseLine,
  RiLinkM,
  RiLoader4Line,
  RiMapPinLine,
  RiSendPlaneLine,
  RiTimeLine,
  RiUserAddLine,
  RiVerifiedBadgeFill,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* -------------------------------------------------------------------------- */
/*  Shared                                                                     */
/* -------------------------------------------------------------------------- */

type Tone = "blue" | "teal" | "pink" | "lime" | "purple" | "neutral";
type AvatarSize = "sm" | "md" | "lg" | "xl";

const TINTS: Record<Tone, string> = {
  blue: "bg-accent-500/15",
  teal: "bg-chart-1/20",
  pink: "bg-chart-3/20",
  lime: "bg-chart-2/20",
  purple: "bg-chart-5/20",
  neutral: "bg-background-secondary-default",
};

const AVATAR_SIZES: Record<AvatarSize, string> = {
  sm: "size-7 text-caption-1-semibold",
  md: "size-9 text-body-2-semibold",
  lg: "size-11 text-body-semibold",
  xl: "size-14 text-title-2-semibold",
};

function Avatar({
  initials,
  tint = "blue",
  size = "md",
  className,
}: {
  initials: string;
  tint?: Tone;
  size?: AvatarSize;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cx(
        "flex shrink-0 items-center justify-center rounded-full text-text-primary ring-1 ring-inset ring-foreground-icon-primary/5",
        TINTS[tint],
        AVATAR_SIZES[size],
        className,
      )}
    >
      {initials}
    </span>
  );
}

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

type Person = {
  name: string;
  handle: string;
  initials: string;
  tint: Tone;
  role: string;
};

const MAYA = {
  name: "Maya Chen",
  handle: "mayachen",
  initials: "MC",
  tint: "blue" as const,
  role: "Art director",
  bio: "Art director at Nightshift Studio. I make loud products feel quiet, and quiet ones feel inevitable.",
  shortBio: "Art director at Nightshift Studio. Loud products, quiet interfaces.",
  location: "Lisbon, PT",
  site: "mayachen.design",
  followers: "12.4k",
  following: "892",
};

const PEOPLE: Person[] = [
  MAYA,
  { name: "Jonas Reed", handle: "jonasreed", initials: "JR", tint: "teal", role: "Staff engineer" },
  { name: "Priya Nair", handle: "priyanair", initials: "PN", tint: "pink", role: "Product lead" },
  { name: "Sam Okafor", handle: "samokafor", initials: "SO", tint: "lime", role: "Motion designer" },
  { name: "Lena Ortiz", handle: "lenaortiz", initials: "LO", tint: "purple", role: "Brand strategist" },
  { name: "Diego Park", handle: "diegopark", initials: "DP", tint: "neutral", role: "Frontend engineer" },
];

/* -------------------------------------------------------------------------- */
/*  Profile header                                                             */
/* -------------------------------------------------------------------------- */

export function ProfileHeader() {
  const [following, setFollowing] = useState(false);

  return (
    <div className="w-full max-w-[560px] overflow-hidden rounded-2xl border border-border-button-default bg-background-primary-default shadow-xs">
      <div className="relative h-20 bg-linear-to-br from-accent-500 via-accent-600 to-accent-800">
        <div aria-hidden className="absolute -end-6 -top-10 size-36 rounded-full border border-accent-200/30" />
        <div aria-hidden className="absolute end-20 top-3 size-14 rounded-full border border-accent-200/25" />
        <div aria-hidden className="absolute -bottom-8 start-1/3 size-28 rounded-full bg-accent-300/20 blur-xl" />
        <span className="absolute end-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-accent-950/25 px-2 py-1 text-caption-2-medium text-text-white backdrop-blur-sm">
          <span aria-hidden className="size-1.5 rounded-full bg-chart-2" />
          Open to collabs
        </span>
      </div>

      <div className="px-4 pb-3.5">
        <div className="flex items-end justify-between gap-3">
          <span className="relative -mt-7 inline-flex rounded-full bg-background-primary-default p-1">
            <span
              aria-hidden
              className="flex size-14 items-center justify-center rounded-full bg-linear-to-br from-accent-500/20 to-chart-5/20 text-title-2-semibold text-text-primary ring-1 ring-inset ring-accent-500/20"
            >
              MC
            </span>
            <span
              aria-hidden
              className="absolute end-1 bottom-1 size-3 rounded-full bg-chart-2 ring-2 ring-background-primary-default"
            />
          </span>

          <div className="flex items-center gap-1.5 pb-0.5">
            <a
              href="#message"
              onClick={(event) => event.preventDefault()}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border-button-default bg-background-primary-default px-2.5 text-body-2-medium text-text-secondary shadow-xs transition-colors duration-150 ease hover:bg-background-primary-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              <RiChat3Line className="size-3.5" aria-hidden />
              Message
            </a>
            <button
              type="button"
              aria-pressed={following}
              onClick={() => setFollowing((current) => !current)}
              className={cx(
                "inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-body-2-medium shadow-xs transition-colors duration-150 ease",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                following
                  ? "border-border-button-default bg-background-primary-default text-text-secondary hover:bg-background-primary-hover hover:text-text-primary"
                  : "border-transparent bg-accent-600 text-text-white hover:bg-accent-700",
              )}
            >
              {following ? (
                <RiCheckLine className="size-3.5" aria-hidden />
              ) : (
                <RiUserAddLine className="size-3.5" aria-hidden />
              )}
              {following ? "Following" : "Follow"}
            </button>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-title-3-semibold text-text-primary">{MAYA.name}</p>
          <RiVerifiedBadgeFill className="size-4 text-accent-500" aria-hidden />
          <span className="rounded-full bg-background-secondary-default px-1.5 py-0.5 text-caption-2-medium text-text-secondary">
            Follows you
          </span>
        </div>
        <p className="text-body-2-regular text-text-tertiary">
          <bdi dir="ltr">@{MAYA.handle}</bdi> · {MAYA.role}
        </p>
        <p dir="auto" className="mt-1.5 max-w-[420px] text-body-2-regular text-text-secondary">
          {MAYA.bio}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption-1-regular text-text-tertiary">
          <span className="inline-flex items-center gap-1">
            <RiMapPinLine className="size-3.5" aria-hidden />
            {MAYA.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <RiLinkM className="size-3.5" aria-hidden />
            <bdi dir="ltr">{MAYA.site}</bdi>
          </span>
          <span className="inline-flex items-center gap-1">
            <RiCalendarLine className="size-3.5" aria-hidden />
            Joined March 2021
          </span>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-separator-border pt-2.5">
          <span className="inline-flex items-baseline gap-1">
            <span className="text-body-2-semibold text-text-primary tabular-nums">{MAYA.followers}</span>
            <span className="text-caption-1-regular text-text-tertiary">Followers</span>
          </span>
          <span className="inline-flex items-baseline gap-1">
            <span className="text-body-2-semibold text-text-primary tabular-nums">{MAYA.following}</span>
            <span className="text-caption-1-regular text-text-tertiary">Following</span>
          </span>
          <span className="ms-auto inline-flex items-center gap-1 text-caption-2-regular text-text-tertiary">
            <span aria-hidden className="size-1.5 rounded-full bg-chart-2" />
            Last active 2h ago
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Presence dot                                                               */
/* -------------------------------------------------------------------------- */

const PRESENCE = [
  { id: "online", label: "Online", lastSeen: "just now", dot: "bg-chart-2" },
  { id: "away", label: "Away", lastSeen: "20 minutes ago", dot: "bg-accent-400" },
  { id: "busy", label: "Busy", lastSeen: "6 minutes ago", dot: "bg-chart-3" },
  { id: "offline", label: "Offline", lastSeen: "2 hours ago", dot: "bg-foreground-icon-tertiary" },
] as const;

type PresenceId = (typeof PRESENCE)[number]["id"];

export function PresenceDot() {
  const [selected, setSelected] = useState<PresenceId>("online");
  const active = PRESENCE.find((status) => status.id === selected) ?? PRESENCE[0];

  return (
    <div className="flex w-full max-w-[310px] flex-col gap-2.5 rounded-xl border border-border-button-default bg-background-primary-default p-3 shadow-xs">
      <div className="flex items-center justify-between gap-2">
        <span className="text-body-2-semibold text-text-primary">Your presence</span>
        <span className="text-caption-2-regular text-text-tertiary">Visible to team</span>
      </div>

      <div role="group" aria-label="Set your presence" className="flex items-center gap-1">
        {PRESENCE.map((status) => {
          const isActive = selected === status.id;
          return (
            <button
              key={status.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setSelected(status.id)}
              className={cx(
                "flex h-8 flex-1 items-center justify-center gap-1 rounded-lg border px-1 transition-colors duration-150 ease",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                isActive
                  ? "border-accent-500 bg-accent-500/10"
                  : "border-border-button-default bg-background-primary-default hover:bg-background-primary-hover",
              )}
            >
              <span aria-hidden className={cx("size-2 shrink-0 rounded-full", status.dot)} />
              <span className="text-caption-1-medium text-text-primary">{status.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 border-t border-separator-border pt-2.5">
        <Avatar initials="YO" tint="neutral" size="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-caption-1-semibold text-text-primary">You</p>
          <p role="status" aria-live="polite" className="truncate text-caption-1-regular text-text-tertiary">
            Last seen <span className="text-text-secondary">{active.lastSeen}</span>
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-background-secondary-default px-1.5 py-0.5 text-caption-2-medium text-text-secondary">
          <span className="relative flex size-1.5" aria-hidden>
            {active.id === "online" && (
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-chart-2 opacity-75 motion-reduce:animate-none" />
            )}
            <span className={cx("relative inline-flex size-1.5 rounded-full", active.dot)} />
          </span>
          {active.label}
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Reaction bar                                                               */
/* -------------------------------------------------------------------------- */

type Reaction = {
  emoji: string;
  label: string;
  count: number;
  mine: boolean;
};

const INITIAL_REACTIONS: Reaction[] = [
  { emoji: "👍", label: "thumbs up", count: 8, mine: false },
  { emoji: "🔥", label: "fire", count: 5, mine: true },
  { emoji: "🎯", label: "bullseye", count: 2, mine: false },
];

const REACTION_CHOICES = [
  { emoji: "❤️", label: "heart" },
  { emoji: "😂", label: "laugh" },
  { emoji: "😮", label: "wow" },
  { emoji: "👏", label: "applause" },
  { emoji: "🙌", label: "raised hands" },
  { emoji: "👀", label: "eyes" },
] as const;

export function ReactionBar() {
  const [reactions, setReactions] = useState<Reaction[]>(() => INITIAL_REACTIONS.map((item) => ({ ...item })));
  const [open, setOpen] = useState(false);
  const pickerId = useId();
  const pickerRef = useRef<HTMLDivElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  useDismiss(pickerRef, () => setOpen(false), open);

  const toggle = (emoji: string) => {
    setOpen(false);
    setReactions((current) =>
      current.flatMap((reaction) => {
        if (reaction.emoji !== emoji) return [reaction];
        const mine = !reaction.mine;
        const count = reaction.count + (mine ? 1 : -1);
        return count <= 0 ? [] : [{ ...reaction, mine, count }];
      }),
    );
  };

  const addReaction = (emoji: string) => {
    const choice = REACTION_CHOICES.find((item) => item.emoji === emoji);
    setReactions((current) => {
      const existing = current.find((reaction) => reaction.emoji === emoji);
      if (existing) {
        return current.map((reaction) =>
          reaction.emoji === emoji
            ? { ...reaction, mine: true, count: reaction.count + (reaction.mine ? 0 : 1) }
            : reaction,
        );
      }
      return [...current, { emoji, label: choice?.label ?? "reaction", count: 1, mine: true }];
    });
    setOpen(false);
    addButtonRef.current?.focus();
  };

  const total = reactions.reduce((sum, reaction) => sum + reaction.count, 0);
  const mine = reactions.some((reaction) => reaction.mine);

  return (
    <div className="flex w-full max-w-[340px] flex-col gap-2.5 rounded-xl border border-border-button-default bg-background-primary-default p-3 shadow-xs">
      <div className="flex items-start gap-2">
        <Avatar initials="MC" tint="blue" size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-caption-1-semibold text-text-primary">Maya Chen</span>
            <span className="text-caption-2-regular text-text-tertiary tabular-nums">09:12</span>
          </div>
          <p dir="auto" className="text-body-2-regular text-text-secondary">
            Cover v3 is up — the subtitle holds at 1280 now. Ship it?
          </p>
        </div>
      </div>

      <div
        ref={pickerRef}
        role="group"
        aria-label="Reactions"
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
          if (event.key === "Escape" && open) {
            setOpen(false);
            addButtonRef.current?.focus();
          }
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
        }}
        className="relative flex flex-wrap items-center gap-1"
      >
        {reactions.map((reaction) => (
          <button
            key={reaction.emoji}
            type="button"
            aria-pressed={reaction.mine}
            aria-label={`${reaction.label}, ${reaction.count} ${reaction.count === 1 ? "reaction" : "reactions"}${reaction.mine ? ", including yours" : ""}`}
            onClick={() => toggle(reaction.emoji)}
            className={cx(
              "inline-flex h-7 items-center gap-1 rounded-full border px-2 transition-colors duration-150 ease",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
              reaction.mine
                ? "border-accent-500 bg-accent-500/10 text-text-primary"
                : "border-border-button-default bg-background-primary-default text-text-secondary hover:bg-background-primary-hover",
            )}
          >
            <span aria-hidden className="text-headline-medium">
              {reaction.emoji}
            </span>
            <span className={cx("text-caption-1-semibold tabular-nums", reaction.mine ? "text-text-primary" : "text-text-secondary")}>
              {reaction.count}
            </span>
          </button>
        ))}

        <button
          ref={addButtonRef}
          type="button"
          aria-label={open ? "Close reaction picker" : "Add a reaction"}
          aria-expanded={open}
          aria-controls={pickerId}
          onClick={() => setOpen((current) => !current)}
          className="flex size-7 items-center justify-center rounded-full border border-border-button-default bg-background-primary-default text-foreground-icon-secondary shadow-xs transition-colors duration-150 ease hover:bg-background-primary-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          <RiAddLine className={cx("size-4 transition-transform duration-150 ease", open && "rotate-45")} aria-hidden />
        </button>

        {open && (
          <div
            id={pickerId}
            role="group"
            aria-label="Choose a reaction"
            className="absolute end-0 top-[calc(100%+6px)] z-20 flex items-center gap-0.5 rounded-full border border-border-button-default bg-background-primary-default p-1 shadow-dropdown"
          >
            {REACTION_CHOICES.map((choice) => (
              <button
                key={choice.emoji}
                type="button"
                aria-label={`React with ${choice.label}`}
                onClick={() => addReaction(choice.emoji)}
                className="flex size-7 items-center justify-center rounded-full text-headline-medium transition-colors duration-150 ease hover:bg-background-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                <span aria-hidden>{choice.emoji}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-caption-2-regular text-text-tertiary">
          {total} {total === 1 ? "reaction" : "reactions"}
          {mine ? " · You reacted" : ""}
        </span>
        <span className="text-caption-2-regular text-text-tertiary">Thread · 4 replies</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mention input                                                              */
/* -------------------------------------------------------------------------- */

export function MentionInput() {
  const [draft, setDraft] = useState(
    "The cover pass is ready for a second look — can you review before the 14:00 call?",
  );
  const [mentions, setMentions] = useState<Person[]>([MAYA]);
  const [query, setQuery] = useState<string | null>(null);
  const [mentionStart, setMentionStart] = useState<number | null>(null);
  const [active, setActive] = useState(0);
  const [sent, setSent] = useState<string | null>(null);
  const listId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useDismiss(formRef, () => setQuery(null), query !== null);

  const results =
    query === null
      ? []
      : PEOPLE.filter((person) => !mentions.some((mention) => mention.handle === person.handle))
          .filter((person) =>
            `${person.name} ${person.handle} ${person.role}`.toLowerCase().includes(query.toLowerCase()),
          )
          .slice(0, 4);

  const removeMention = (handle: string) => {
    setMentions((current) => current.filter((person) => person.handle !== handle));
    setSent(null);
  };

  const selectPerson = (person: Person) => {
    if (mentionStart === null || query === null) return;
    const nextDraft = draft.slice(0, mentionStart) + draft.slice(mentionStart + 1 + query.length);
    setDraft(nextDraft);
    setMentions((current) =>
      current.some((mention) => mention.handle === person.handle) ? current : [...current, person],
    );
    setQuery(null);
    setMentionStart(null);
    setSent(null);

    const caret = mentionStart;
    requestAnimationFrame(() => {
      const node = textareaRef.current;
      if (!node) return;
      node.focus();
      const position = Math.min(caret, node.value.length);
      node.setSelectionRange(position, position);
    });
  };

  const send = () => {
    if (!draft.trim()) return;
    const names = mentions.map((person) => person.name);
    const summary =
      names.length === 0
        ? "Message sent"
        : names.length === 1
          ? `Sent to ${names[0]}`
          : names.length === 2
            ? `Sent to ${names[0]} and ${names[1]}`
            : `Sent to ${names[0]} and ${names.length - 1} others`;
    setSent(`${summary} · just now`);
    setDraft("");
    setQuery(null);
    setMentionStart(null);
    textareaRef.current?.focus();
  };

  return (
    <div className="flex w-full max-w-[440px] flex-col gap-1.5">
      <form
        ref={formRef}
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          send();
        }}
        onKeyDown={(event: KeyboardEvent<HTMLFormElement>) => {
          if (event.key === "Escape" && query !== null) {
            event.stopPropagation();
            setQuery(null);
            textareaRef.current?.focus();
          }
        }}
        className="flex w-full flex-col rounded-xl border border-border-button-default bg-background-primary-default shadow-xs"
      >
        <div className="flex flex-wrap items-center gap-1 border-b border-separator-border px-2.5 py-2">
          <span className="text-caption-1-medium text-text-tertiary">To</span>
          {mentions.map((person) => (
            <span
              key={person.handle}
              className="inline-flex h-6 items-center gap-1 rounded-full bg-accent-500/10 py-0.5 ps-1.5 pe-0.5 text-caption-1-medium text-text-primary ring-1 ring-inset ring-accent-500/30"
            >
              <RiAtLine className="size-3 text-foreground-icon-secondary" aria-hidden />
              {person.name}
              <button
                type="button"
                aria-label={`Remove mention of ${person.name}`}
                onClick={() => removeMention(person.handle)}
                className="flex size-5 items-center justify-center rounded-full text-foreground-icon-secondary transition-colors duration-150 ease hover:bg-background-tertiary-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                <RiCloseLine className="size-3.5" aria-hidden />
              </button>
            </span>
          ))}
          {mentions.length === 0 && (
            <span className="text-caption-1-regular text-text-tertiary">Type @ to mention someone</span>
          )}
        </div>

        <div className="relative">
          <div className="m-1.5 rounded-lg ring-2 ring-inset ring-transparent transition-[box-shadow] duration-150 ease focus-within:ring-border-focus-ring">
            <textarea
              ref={textareaRef}
              value={draft}
              rows={3}
              dir="auto"
              aria-label="Message"
              aria-controls={listId}
              placeholder="Write a reply… type @ to mention someone"
              onChange={(event) => {
                const value = event.target.value;
                const caret = event.target.selectionStart ?? value.length;
                setDraft(value);
                setSent(null);

                const before = value.slice(0, caret);
                const match = before.match(/(?:^|\s)@([A-Za-z0-9._-]*)$/);
                if (!match) {
                  setQuery(null);
                  setMentionStart(null);
                  return;
                }
                setMentionStart(before.lastIndexOf("@"));
                setQuery(match[1] ?? "");
                setActive(0);
              }}
              onKeyDown={(event: KeyboardEvent<HTMLTextAreaElement>) => {
                if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                  event.preventDefault();
                  send();
                  return;
                }
                if (query === null) return;
                if (results.length === 0) return;
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setActive((current) => (current + 1) % results.length);
                }
                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setActive((current) => (current - 1 + results.length) % results.length);
                }
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  const person = results[active];
                  if (person) selectPerson(person);
                }
              }}
              className="block min-h-[72px] w-full resize-none rounded-lg bg-transparent px-2 py-1.5 text-body-regular text-text-primary outline-none placeholder:text-text-tertiary"
            />
          </div>

          {query !== null && (
            <div
              id={listId}
              role="listbox"
              aria-label="Mention suggestions"
              className="mx-1.5 mb-1.5 overflow-hidden rounded-lg border border-border-button-default bg-background-primary-default p-1"
            >
              {results.length === 0 ? (
                <p className="px-2 py-2 text-caption-1-regular text-text-tertiary">
                  {query ? `No one matches “@${query}”.` : "Everyone is already in this thread."}
                </p>
              ) : (
                results.map((person, index) => (
                  <button
                    key={person.handle}
                    type="button"
                    role="option"
                    aria-selected={index === active}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => selectPerson(person)}
                    className={cx(
                      "flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-start transition-colors duration-100 ease",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                      index === active && "bg-background-secondary-default",
                    )}
                  >
                    <Avatar initials={person.initials} tint={person.tint} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-body-2-medium text-text-primary">{person.name}</span>
                      <span className="block truncate text-caption-2-regular text-text-tertiary">
                        <bdi dir="ltr">@{person.handle}</bdi> · {person.role}
                      </span>
                    </span>
                    <RiAtLine className="size-3.5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-separator-border px-2.5 py-1.5">
          <span className="text-caption-2-regular text-text-tertiary">Type @ to mention · ⌘↵ to send</span>
          <button
            type="submit"
            disabled={!draft.trim()}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-accent-600 px-2.5 text-body-2-medium text-text-white shadow-xs transition-colors duration-150 ease hover:bg-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:pointer-events-none disabled:bg-background-tertiary-default disabled:text-text-tertiary disabled:shadow-none"
          >
            <RiSendPlaneLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
            Send
          </button>
        </div>
      </form>

      {sent && (
        <p role="status" className="flex items-center gap-1 text-caption-1-medium text-text-secondary">
          <RiCheckLine className="size-3.5 text-foreground-icon-secondary" aria-hidden />
          {sent}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  User hover card                                                            */
/* -------------------------------------------------------------------------- */

export function UserHoverCard() {
  const [open, setOpen] = useState(true);
  const [following, setFollowing] = useState(false);
  const cardId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeCard = (restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  };

  return (
    <div
      className="relative flex h-[264px] w-full max-w-[420px] flex-col items-start gap-2 pt-2 sm:items-center"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") return;
        const focused = document.activeElement;
        if (
          focused instanceof HTMLElement &&
          focused.matches(":focus-visible") &&
          event.currentTarget.contains(focused)
        ) {
          return;
        }
        setOpen(false);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          closeCard(true);
        }
      }}
    >
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls={cardId}
          onClick={() => setOpen((current) => !current)}
          className="inline-flex items-center gap-2 rounded-xl border border-border-button-default bg-background-primary-default px-2.5 py-2 shadow-xs transition-colors duration-150 ease hover:bg-background-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          <Avatar initials={MAYA.initials} tint={MAYA.tint} size="md" />
          <span className="text-start">
            <span className="flex items-center gap-1 text-body-2-semibold text-text-primary">
              {MAYA.name}
              <RiVerifiedBadgeFill className="size-3.5 text-accent-500" aria-hidden />
            </span>
            <span className="block text-caption-1-regular text-text-tertiary">
              @{MAYA.handle} · Hover or click
            </span>
          </span>
          <RiArrowDownSLine
            className={cx(
              "ms-1 size-4 text-foreground-icon-tertiary transition-transform duration-150 ease",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>

        {open && (
          <div
            id={cardId}
            role="group"
            aria-label={`Profile preview for ${MAYA.name}`}
            className="absolute start-0 top-[calc(100%+8px)] z-30 w-[300px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-border-button-default bg-background-primary-default shadow-lg"
          >
            <div className="relative h-12 bg-linear-to-br from-accent-500 via-accent-600 to-accent-800">
              <div aria-hidden className="absolute -end-3 -top-6 size-20 rounded-full border border-accent-200/30" />
              <div aria-hidden className="absolute end-16 top-2 size-8 rounded-full bg-accent-300/20" />
              <button
                type="button"
                aria-label={`Close profile preview for ${MAYA.name}`}
                onClick={() => closeCard(true)}
                className="absolute end-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-accent-950/25 text-text-white transition-colors duration-150 ease hover:bg-accent-950/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-200"
              >
                <RiCloseLine className="size-3.5" aria-hidden />
              </button>
            </div>

            <div className="px-3 pb-3">
              <div className="flex items-end justify-between gap-2">
                <span className="-mt-5 inline-flex rounded-full bg-background-primary-default p-0.5">
                  <span
                    aria-hidden
                    className="flex size-9 items-center justify-center rounded-full bg-linear-to-br from-accent-500/20 to-chart-5/20 text-body-2-semibold text-text-primary ring-1 ring-inset ring-accent-500/20"
                  >
                    MC
                  </span>
                </span>
                <button
                  type="button"
                  aria-pressed={following}
                  onClick={() => setFollowing((current) => !current)}
                  className={cx(
                    "inline-flex h-7 items-center gap-1 rounded-lg border px-2 text-caption-1-semibold shadow-xs transition-colors duration-150 ease",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                    following
                      ? "border-border-button-default bg-background-primary-default text-text-secondary hover:bg-background-primary-hover hover:text-text-primary"
                      : "border-transparent bg-accent-600 text-text-white hover:bg-accent-700",
                  )}
                >
                  {following ? (
                    <RiCheckLine className="size-3" aria-hidden />
                  ) : (
                    <RiUserAddLine className="size-3" aria-hidden />
                  )}
                  {following ? "Following" : "Follow"}
                </button>
              </div>

              <div className="mt-1 flex items-center gap-1">
                <span className="text-body-2-semibold text-text-primary">{MAYA.name}</span>
                <RiVerifiedBadgeFill className="size-3.5 text-accent-500" aria-hidden />
              </div>
              <p className="text-caption-2-regular text-text-tertiary">
                <bdi dir="ltr">@{MAYA.handle}</bdi> · {MAYA.location}
              </p>
              <p dir="auto" className="mt-1 text-caption-1-regular text-text-secondary">
                {MAYA.shortBio}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-separator-border pt-1.5 text-caption-2-regular text-text-tertiary">
                <span>
                  <span className="text-body-2-semibold text-text-primary tabular-nums">{MAYA.followers}</span>{" "}
                  Followers
                </span>
                <span>
                  <span className="text-body-2-semibold text-text-primary tabular-nums">{MAYA.following}</span>{" "}
                  Following
                </span>
                <span className="ms-auto inline-flex items-center gap-1 rounded-full bg-background-secondary-default px-1.5 py-0.5 text-caption-2-medium text-text-secondary">
                  Follows you
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Invite row                                                                 */
/* -------------------------------------------------------------------------- */

type PendingInvite = {
  name: string;
  email: string;
  role: string;
  initials: string;
  tint: Tone;
};

const INITIAL_PENDING: PendingInvite[] = [
  {
    name: "Jonas Reed",
    email: "jonas@nightshift.studio",
    role: "Editor",
    initials: "JR",
    tint: "teal",
  },
];

const NEW_INVITE_TINTS: Tone[] = ["purple", "pink", "teal", "blue"];

function nameFromEmail(email: string) {
  const local = email.split("@")[0] ?? "";
  return (
    local
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ") || "New teammate"
  );
}

function initialsFromName(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "NT"
  );
}

export function InviteRow() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Editor");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [queued, setQueued] = useState<Omit<PendingInvite, "tint"> | null>(null);
  const [lastInvited, setLastInvited] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingInvite[]>(INITIAL_PENDING);
  const emailId = useId();
  const trimmedEmail = email.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

  useEffect(() => {
    if (status !== "sending" || !queued) return;
    const invite = queued;
    const timer = window.setTimeout(() => {
      setPending((rows) => {
        const tint = NEW_INVITE_TINTS[rows.length % NEW_INVITE_TINTS.length] ?? "purple";
        return [...rows, { ...invite, tint }].slice(-3);
      });
      setLastInvited(invite.email);
      setStatus("sent");
      setEmail("");
      setQueued(null);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [status, queued]);

  return (
    <div className="flex w-full max-w-[340px] flex-col overflow-hidden rounded-xl border border-border-button-default bg-background-primary-default shadow-xs">
      <div className="flex items-start justify-between gap-2 px-3 pt-3">
        <div className="min-w-0">
          <p className="text-body-2-semibold text-text-primary">Invite to Nightshift Studio</p>
          <p className="text-caption-1-regular text-text-secondary">Design team · 2 seats left</p>
        </div>
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-accent-500/15 text-foreground-icon-primary">
          <RiUserAddLine className="size-4" aria-hidden />
        </span>
      </div>

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (!valid || status === "sending") return;
          const name = nameFromEmail(trimmedEmail);
          setQueued({ name, email: trimmedEmail, role, initials: initialsFromName(name) });
          setStatus("sending");
        }}
        className="flex flex-col gap-1.5 p-3"
      >
        <label htmlFor={emailId} className="text-caption-1-medium text-text-secondary">
          Email address
        </label>
        <input
          id={emailId}
          type="email"
          dir="ltr"
          inputMode="email"
          autoComplete="off"
          spellCheck={false}
          placeholder="teammate@nightshift.studio"
          value={email}
          disabled={status === "sending"}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status === "sent") {
              setStatus("idle");
              setLastInvited(null);
            }
          }}
          className="h-9 w-full rounded-2lg bg-background-tertiary-default px-2.5 text-start text-body-regular text-text-primary outline-none ring-2 ring-inset ring-border-button-default transition-[background-color,box-shadow] duration-150 ease placeholder:text-text-tertiary hover:ring-border-button-hover focus-visible:ring-border-focus-ring disabled:cursor-not-allowed disabled:opacity-60"
        />

        <div className="flex items-center gap-1.5">
          <div className="relative min-w-0 flex-1">
            <select
              aria-label="Role"
              value={role}
              disabled={status === "sending"}
              onChange={(event) => setRole(event.target.value)}
              className="h-8 w-full appearance-none rounded-lg border border-border-button-default bg-background-primary-default ps-2 pe-7 text-body-2-medium text-text-primary shadow-xs outline-none transition-colors duration-150 ease hover:bg-background-primary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:opacity-60"
            >
              <option value="Editor">Editor</option>
              <option value="Admin">Admin</option>
              <option value="Viewer">Viewer</option>
            </select>
            <RiArrowDownSLine
              className="pointer-events-none absolute end-2 top-1/2 size-3.5 -translate-y-1/2 text-foreground-icon-secondary"
              aria-hidden
            />
          </div>

          <button
            type="submit"
            disabled={!valid || status === "sending"}
            aria-busy={status === "sending"}
            className={cx(
              "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border px-2.5 text-body-2-medium shadow-xs transition-colors duration-150 ease",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:pointer-events-none disabled:shadow-none",
              status === "sent"
                ? "border-accent-500/40 bg-accent-500/10 text-text-primary"
                : status === "sending"
                  ? "border-transparent bg-accent-500/20 text-text-primary"
                  : "border-transparent bg-accent-600 text-text-white hover:bg-accent-700 disabled:border-border-button-default disabled:bg-background-tertiary-default disabled:text-text-tertiary",
            )}
          >
            {status === "sending" ? (
              <RiLoader4Line className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
            ) : status === "sent" ? (
              <RiCheckLine className="size-3.5" aria-hidden />
            ) : (
              <RiUserAddLine className="size-3.5" aria-hidden />
            )}
            {status === "sending" ? "Sending" : status === "sent" ? "Sent" : "Invite"}
          </button>
        </div>

        <p
          role={status === "sent" ? "status" : undefined}
          aria-live={status === "sent" ? "polite" : undefined}
          className="flex items-center gap-1 text-caption-2-regular text-text-secondary"
        >
          {status === "sent" ? (
            <>
              <RiCheckLine className="size-3 shrink-0 text-foreground-icon-secondary" aria-hidden />
              <bdi>
                Invite sent to <bdi dir="ltr">{lastInvited ?? "your teammate"}</bdi>. Pending acceptance.
              </bdi>
            </>
          ) : status === "sending" ? (
            <bdi>Sending a secure link…</bdi>
          ) : (
            <bdi>They'll get a secure link that expires in 7 days.</bdi>
          )}
        </p>
      </form>

      <div className="border-t border-separator-border bg-background-secondary-default/50 px-3 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-caption-1-semibold tracking-wide text-text-secondary uppercase">Pending</span>
          <span className="text-caption-2-regular text-text-secondary tabular-nums">{pending.length}</span>
        </div>
        <ul className="mt-1.5 flex flex-col gap-2">
          {pending.map((invite, index) => (
            <li key={`${invite.email}-${index}`} className="flex items-center gap-2">
              <Avatar initials={invite.initials} tint={invite.tint} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-caption-1-semibold text-text-primary">{invite.name}</p>
                <p className="truncate text-caption-2-regular text-text-secondary">
                  <bdi dir="ltr">{invite.email}</bdi>
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end">
                <span className="text-caption-2-medium text-text-secondary">{invite.role}</span>
                <span className="inline-flex items-center gap-0.5 text-caption-2-regular text-text-secondary">
                  <RiTimeLine className="size-3" aria-hidden />
                  Pending
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Specimens                                                                  */
/* -------------------------------------------------------------------------- */

export const SOCIAL_SECTION: ExtendedSection = {
  id: "social",
  title: "Social",
  blurb: "People, presence and the small signals that keep a team close.",
  file: "social.tsx",
  entries: [
    {
      name: "Profile Header",
      description: "Cover, identity, stats and a follow toggle.",
      Demo: ProfileHeader,
      wide: true,
    },
    {
      name: "Presence Dot",
      description: "Four states, a live dot and the last-seen line.",
      Demo: PresenceDot,
    },
    {
      name: "Reaction Bar",
      description: "Emoji counts that toggle, with your own reaction marked.",
      Demo: ReactionBar,
    },
    {
      name: "Mention Input",
      description: "Type @ to filter people into a removable chip.",
      Demo: MentionInput,
      wide: true,
    },
    {
      name: "User Hover Card",
      description: "A profile preview with stats, bio and a follow toggle.",
      Demo: UserHoverCard,
      wide: true,
    },
    {
      name: "Invite Row",
      description: "Email, role and a sending-to-sent invite flow.",
      Demo: InviteRow,
    },
  ],
};
