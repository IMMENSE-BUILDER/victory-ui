"use client";

import { useState } from "react";
import {
  RiArrowDownLine,
  RiArrowRightSLine,
  RiArrowUpLine,
  RiAttachmentLine,
  RiChat3Line,
  RiDownloadLine,
  RiFilePdf2Line,
  RiMoreLine,
  RiSendPlaneLine,
} from "@remixicon/react";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badge";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* -------------------------------------------------------------------------- */
/*  Description list                                                           */
/* -------------------------------------------------------------------------- */

const SPECS = [
  ["Format", "Editorial deck"],
  ["Size", "1920 × 1080"],
  ["Pages", "12"],
  ["Fonts", "Bricolage, Inter"],
  ["Owner", "Morgan Lee"],
];

export function DescriptionList({ title = "Document" }: { title?: string }) {
  return (
    <div className="w-full max-w-[300px]">
      <p className="mb-1.5 text-caption-1-semibold tracking-wide text-text-tertiary uppercase">{title}</p>
      <dl className="divide-y divide-separator-border rounded-xl border border-border-button-default bg-background-primary-default">
        {SPECS.map(([term, value]) => (
          <div key={term} className="flex items-baseline justify-between gap-3 px-3 py-1.5">
            <dt className="text-body-2-regular text-text-tertiary">{term}</dt>
            <dd className="text-end text-body-2-medium text-text-primary">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Timeline                                                                   */
/* -------------------------------------------------------------------------- */

const EVENTS = [
  { time: "09:12", title: "Brief approved", body: "Morgan signed off on the campaign direction.", tone: "done" as const },
  { time: "11:40", title: "Assets uploaded", body: "18 stills and 2 clips landed in the shared folder.", tone: "done" as const },
  { time: "14:05", title: "Review in progress", body: "Two comments open on the cover.", tone: "current" as const },
  { time: "—", title: "Publish", body: "Scheduled for Thursday at 10:00.", tone: "todo" as const },
];

export function Timeline({ title = "Project timeline" }: { title?: string }) {
  return (
    <div className="w-full max-w-[320px]">
      <p className="mb-2 text-caption-1-semibold tracking-wide text-text-tertiary uppercase">{title}</p>
      <ol className="flex flex-col">
        {EVENTS.map((event, index) => (
          <li key={event.title} className="relative flex gap-3 pb-3 last:pb-0">
            {index < EVENTS.length - 1 && <span aria-hidden className="absolute inset-y-1 start-[5px] w-px bg-separator-border" />}
            <span
              aria-hidden
              className={cx(
                "relative z-10 mt-1 size-[11px] shrink-0 rounded-full border-2",
                event.tone === "done" && "border-accent-500 bg-accent-500",
                event.tone === "current" && "border-accent-500 bg-background-primary-default",
                event.tone === "todo" && "border-border-button-default bg-background-primary-default",
              )}
            />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className={cx("text-body-2-semibold", event.tone === "todo" ? "text-text-tertiary" : "text-text-primary")}>{event.title}</span>
                <span className="shrink-0 text-caption-2-regular text-text-tertiary tabular-nums">{event.time}</span>
              </div>
              <span className="text-caption-1-regular text-text-secondary">{event.body}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Activity feed                                                              */
/* -------------------------------------------------------------------------- */

const ACTIVITY = [
  { initials: "MC", color: "blue" as const, name: "Maya", action: "restyled 4 layers in", target: "Cover / v3", time: "2m" },
  { initials: "JR", color: "lime" as const, name: "Jonas", action: "commented on", target: "Shot list", time: "18m" },
  { initials: "PN", color: "pink" as const, name: "Priya", action: "approved", target: "Invoice 4471", time: "1h" },
  { initials: "OP", color: "neutral" as const, name: "Studio ops", action: "booked", target: "Bay 2", time: "3h" },
];

export function ActivityFeed() {
  return (
    <div className="w-full max-w-[340px] rounded-xl border border-border-button-default bg-background-primary-default">
      <div className="flex items-center justify-between border-b border-separator-border px-3 py-2">
        <span className="text-body-2-semibold text-text-primary">Recent activity</span>
        <Badge color="neutral">4</Badge>
      </div>
      <ul className="divide-y divide-separator-border">
        {ACTIVITY.map((item) => (
          <li key={item.name} className="flex items-center gap-2 px-3 py-2">
            <Avatar size="sm" color={item.color} initials={item.initials} />
            <p className="min-w-0 flex-1 truncate text-body-2-regular text-text-secondary">
              <span className="text-text-primary">{item.name}</span> {item.action}{" "}
              <span className="text-text-primary">{item.target}</span>
            </p>
            <span className="shrink-0 text-caption-2-regular text-text-tertiary tabular-nums">{item.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Avatar group                                                               */
/* -------------------------------------------------------------------------- */

const PEOPLE = [
  { initials: "MC", color: "blue" as const, name: "Maya Chen" },
  { initials: "JR", color: "lime" as const, name: "Jonas Reed" },
  { initials: "PN", color: "pink" as const, name: "Priya Nair" },
  { initials: "SL", color: "neutral" as const, name: "Sam Okafor" },
];

export function AvatarGroup({ extra = 3 }: { extra?: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center">
        {PEOPLE.map((person, index) => (
          <span key={person.initials} className={cx("rounded-full ring-2 ring-background-primary-default", index > 0 && "-ms-1.5")} title={person.name}>
            <Avatar size="md" color={person.color} initials={person.initials} />
          </span>
        ))}
        <span className="-ms-1.5 flex size-8 items-center justify-center rounded-full bg-background-tertiary-default text-caption-1-semibold text-text-secondary ring-2 ring-background-primary-default">
          +{extra}
        </span>
      </div>
      <span className="text-caption-1-regular text-text-tertiary">{PEOPLE.length + extra} people on this file</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Progress ring                                                              */
/* -------------------------------------------------------------------------- */

export function ProgressRing({ value = 72, label = "Complete" }: { value?: number; label?: string }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;

  return (
    <div className="flex items-center gap-3">
      <div className="relative size-[68px]" role="img" aria-label={`${value}% ${label.toLowerCase()}`}>
        <svg viewBox="0 0 68 68" className="size-full -rotate-90" aria-hidden>
          <circle cx="34" cy="34" r={radius} fill="none" strokeWidth="6" className="stroke-background-tertiary-default" />
          <circle
            cx="34"
            cy="34"
            r={radius}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="stroke-accent-500 transition-[stroke-dashoffset] duration-500 ease-out"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-body-semibold text-text-primary tabular-nums">{value}%</span>
      </div>
      <div className="flex flex-col">
        <span className="text-body-2-semibold text-text-primary">{label}</span>
        <span className="text-caption-1-regular text-text-tertiary">9 of 12 pages reviewed</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Comment thread                                                             */
/* -------------------------------------------------------------------------- */

const COMMENTS = [
  {
    initials: "MC",
    color: "blue" as const,
    name: "Maya Chen",
    time: "09:12",
    body: "The cover holds at 1440 but the subtitle wraps at 1280. Can we trim it to one line?",
  },
  {
    initials: "JR",
    color: "lime" as const,
    name: "Jonas Reed",
    time: "09:20",
    body: "Trimmed to “Dead Frontline” — the long version lives in the caption now.",
    reply: true,
  },
];

export function CommentThread() {
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState<string | null>(null);

  return (
    <div className="w-full max-w-[340px] rounded-xl border border-border-button-default bg-background-primary-default">
      <div className="flex items-center gap-1.5 border-b border-separator-border px-3 py-2">
        <RiChat3Line className="size-4 text-foreground-icon-secondary" aria-hidden />
        <span className="text-body-2-semibold text-text-primary">Comments</span>
        <Badge color="neutral">2</Badge>
      </div>
      <ul className="flex flex-col gap-2.5 px-3 py-2.5">
        {COMMENTS.map((comment) => (
          <li key={comment.name} className={cx("flex gap-2", comment.reply && "ms-5")}>
            <Avatar size="sm" color={comment.color} initials={comment.initials} />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-caption-1-semibold text-text-primary">{comment.name}</span>
                <span className="text-caption-2-regular text-text-tertiary tabular-nums">{comment.time}</span>
              </div>
              <p className="text-body-2-regular text-text-secondary">{comment.body}</p>
            </div>
          </li>
        ))}
        {sent && (
          <li className="ms-5 flex gap-2">
            <Avatar size="sm" color="neutral" initials="YO" />
            <div className="flex flex-col gap-0.5">
              <span className="text-caption-1-semibold text-text-primary">You</span>
              <p className="text-body-2-regular text-text-secondary">{sent}</p>
            </div>
          </li>
        )}
      </ul>
      <form
        className="flex items-center gap-1.5 border-t border-separator-border p-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (!draft.trim()) return;
          setSent(draft.trim());
          setDraft("");
        }}
      >
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Reply to the thread"
          aria-label="Reply to the thread"
          className="h-7 min-w-0 flex-1 rounded-md bg-background-tertiary-default px-2 text-body-2-regular text-text-primary outline-none ring-2 ring-inset ring-transparent transition-colors duration-150 ease placeholder:text-text-tertiary focus:ring-border-button-active"
        />
        <button
          type="submit"
          aria-label="Send reply"
          className="flex size-7 items-center justify-center rounded-md bg-button-primary text-text-white shadow-xs transition-opacity duration-150 ease hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          <RiSendPlaneLine className="size-3.5" aria-hidden />
        </button>
      </form>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  File card                                                                  */
/* -------------------------------------------------------------------------- */

export function FileCard({
  name = "Campaign brief.pdf",
  meta = "PDF · 4.2 MB · 12 pages",
  status = "Ready",
}: {
  name?: string;
  meta?: string;
  status?: string;
}) {
  return (
    <div className="flex w-full max-w-[320px] items-center gap-2.5 rounded-xl border border-border-button-default bg-background-primary-default p-2.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-status-rose-background text-status-rose-text">
        <RiFilePdf2Line className="size-5" aria-hidden />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-body-2-semibold text-text-primary">{name}</span>
        <span className="truncate text-caption-1-regular text-text-tertiary">{meta}</span>
        <span className="mt-0.5 flex items-center gap-1 text-caption-2-medium text-state-success-text">
          <RiAttachmentLine className="size-3" aria-hidden /> {status}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-0.5">
        <button type="button" aria-label={`Download ${name}`} className="flex size-7 items-center justify-center rounded-md text-foreground-icon-secondary hover:bg-background-secondary-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring">
          <RiDownloadLine className="size-4" aria-hidden />
        </button>
        <button type="button" aria-label={`More actions for ${name}`} className="flex size-7 items-center justify-center rounded-md text-foreground-icon-secondary hover:bg-background-secondary-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring">
          <RiMoreLine className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Person card                                                                */
/* -------------------------------------------------------------------------- */

export function PersonCard({
  name = "Maya Chen",
  role = "Art director · Lisbon",
  initials = "MC",
  online = true,
}: {
  name?: string;
  role?: string;
  initials?: string;
  online?: boolean;
}) {
  return (
    <div className="flex w-full max-w-[300px] items-center gap-2.5 rounded-xl border border-border-button-default bg-background-primary-default p-3">
      <span className="relative">
        <Avatar size="lg" color="blue" initials={initials} />
        <span
          aria-hidden
          className={cx(
            "absolute -end-0.5 -bottom-0.5 size-2.5 rounded-full ring-2 ring-background-primary-default",
            online ? "bg-state-success-base" : "bg-foreground-icon-disabled",
          )}
        />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-body-2-semibold text-text-primary">{name}</p>
        <p className="truncate text-caption-1-regular text-text-tertiary">{role}</p>
        <p className="text-caption-2-medium text-text-secondary">{online ? "Online now" : "Away"}</p>
      </div>
      <button
        type="button"
        aria-label={`Message ${name}`}
        className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border-button-default text-foreground-icon-secondary shadow-xs hover:bg-background-primary-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
      >
        <RiChat3Line className="size-4" aria-hidden />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Metric tile                                                                */
/* -------------------------------------------------------------------------- */

export function MetricTile({
  label = "Exports this week",
  value = "1,284",
  delta = 12.4,
  note = "vs. 1,142 last week",
}: {
  label?: string;
  value?: string;
  delta?: number;
  note?: string;
}) {
  const up = delta >= 0;
  return (
    <div className="flex w-full max-w-[240px] flex-col gap-1 rounded-xl border border-border-button-default bg-background-primary-default p-3">
      <span className="text-body-2-medium text-text-tertiary">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-title-1-semibold text-text-primary tabular-nums">{value}</span>
        <span
          className={cx(
            "inline-flex items-center gap-0.5 rounded-sm px-1 py-px text-caption-2-semibold",
            up ? "bg-status-lime-background text-status-lime-text" : "bg-status-rose-background text-status-rose-text",
          )}
        >
          {up ? <RiArrowUpLine className="size-3" aria-hidden /> : <RiArrowDownLine className="size-3" aria-hidden />}
          {Math.abs(delta)}%
        </span>
      </div>
      <span className="text-caption-1-regular text-text-tertiary">{note}</span>
      <a
        href="#metric"
        onClick={(event) => event.preventDefault()}
        className="mt-0.5 inline-flex w-max items-center gap-0.5 rounded-sm text-caption-1-semibold text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
      >
        Open report <RiArrowRightSLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
      </a>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Specimens                                                                  */
/* -------------------------------------------------------------------------- */

export const DATA_SECTION: ExtendedSection = {
  id: "data",
  title: "Data display",
  blurb: "Records, people and progress, read at a glance.",
  file: "data-display.tsx",
  entries: [
    { name: "Description List", description: "Term and value pairs on a quiet ruled surface.", Demo: DescriptionList },
    { name: "Timeline", description: "Dated events on a rail, done to scheduled.", Demo: Timeline },
    { name: "Avatar Group", description: "Overlapping faces with a remainder count.", Demo: AvatarGroup },
    { name: "Activity Feed", description: "Who did what, in one scannable column.", Demo: ActivityFeed, wide: true },
    { name: "Progress Ring", description: "One value, drawn as a measured arc.", Demo: ProgressRing },
    { name: "Comment Thread", description: "Replies, indentation and a working composer.", Demo: CommentThread, wide: true },
    { name: "Person Card", description: "Identity, role and presence in one row.", Demo: PersonCard },
    { name: "File Card", description: "A document tile with type, size and actions.", Demo: FileCard, wide: true },
    { name: "Metric Tile", description: "A number with its change and its source.", Demo: MetricTile },
  ],
};
