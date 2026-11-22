"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  RiArrowDownSLine,
  RiArrowRightLine,
  RiBookmarkFill,
  RiBookmarkLine,
  RiChat3Line,
  RiCheckLine,
  RiLockLine,
  RiMailLine,
  RiPauseLine,
  RiPlayLine,
  RiSunLine,
  RiTimeLine,
  RiUserAddLine,
  RiVerifiedBadgeFill,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* Shared anatomy */

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";
const cardSurface = "w-full rounded-xl border border-border-button-default bg-background-primary-default shadow-card";
const buttonBase =
  "inline-flex items-center justify-center gap-1.5 rounded-lg text-caption-1-semibold " +
  "transition-[transform,opacity,background-color,color,box-shadow] duration-150 ease-out " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 " +
  "motion-reduce:transition-none motion-reduce:active:scale-100";
const primaryButton = cx(buttonBase, "h-7 bg-button-primary px-2.5 text-text-white shadow-xs", focusRing);
const secondaryButton = cx(
  buttonBase,
  "h-7 border border-border-button-default bg-background-primary-default px-2 text-text-primary shadow-xs hover:bg-background-primary-hover",
  focusRing,
);
const quietButton = cx(
  buttonBase,
  "h-6 px-1 text-text-secondary hover:bg-background-secondary-default hover:text-text-primary",
  focusRing,
);
const revealGrid = "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none";

const ART_TONES = {
  harbor: "from-accent-400 via-accent-600 to-accent-900",
  transit: "from-chart-1 via-accent-700 to-accent-900",
  city: "from-chart-3 via-chart-5 to-accent-900",
  weather: "from-chart-4 via-accent-600 to-accent-800",
} as const;

type ArtTone = keyof typeof ART_TONES;

/** Token-built editorial art: no images, same silhouette at every size. */
function NewsArt({ tone = "harbor", className }: { tone?: ArtTone; className?: string }) {
  return (
    <span
      aria-hidden
      className={cx("relative block shrink-0 overflow-hidden rounded-lg bg-linear-to-br", ART_TONES[tone], className)}
    >
      <span className="absolute -end-3 -top-4 size-10 rounded-full border border-text-white/30" />
      <span className="absolute end-1.5 top-1.5 size-1.5 rounded-full bg-text-white/70" />
      <span className="absolute bottom-1.5 start-1.5 h-1 w-5 rounded-full bg-text-white/60" />
      <span className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-accent-950/40 to-transparent" />
    </span>
  );
}

function Meta({ source, time, className }: { source: string; time: string; className?: string }) {
  return (
    <span className={cx("flex min-w-0 items-center gap-1.5 text-caption-2-regular text-text-tertiary", className)}>
      <span className="truncate text-caption-2-semibold text-text-secondary">{source}</span>
      <span aria-hidden className="size-0.5 shrink-0 rounded-full bg-foreground-icon-quaternary" />
      <span className="shrink-0 tabular-nums">{time}</span>
    </span>
  );
}

/* 1. Article Card */

const ARTICLE = {
  kicker: "Harbor & Coast",
  headline: "Port authority delays the seawall vote for a third time",
  dek: "The board wants another cost review before committing $84 million to the north harbor. Residents have waited four years.",
  source: "The Meridian",
  time: "12 min ago",
} as const;

export function ArticleCard() {
  const dekId = useId();
  const [open, setOpen] = useState(false);

  return (
    <article aria-label={ARTICLE.headline} className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-start gap-2.5">
        <NewsArt tone="harbor" className="size-[52px]" />
        <div className="min-w-0 flex-1">
          <p className="text-caption-2-semibold tracking-wide text-accent-600 uppercase">{ARTICLE.kicker}</p>
          <h3 className="mt-0.5 text-body-2-semibold text-text-primary">{ARTICLE.headline}</h3>
        </div>
      </div>

      <p
        id={dekId}
        className={cx(
          "mt-1.5 overflow-hidden text-caption-1-regular text-text-secondary",
          "transition-[max-height,opacity] duration-200 ease-out motion-reduce:transition-none",
          open ? "max-h-12 opacity-100" : "max-h-8 opacity-80",
        )}
      >
        {ARTICLE.dek}
      </p>

      <div className="mt-1 flex items-center justify-between gap-2">
        <Meta source={ARTICLE.source} time={ARTICLE.time} />
        <button
          type="button"
          aria-expanded={open}
          aria-controls={dekId}
          aria-label={open ? "Collapse the article summary" : "Read the full article summary"}
          onClick={() => setOpen((current) => !current)}
          className={cx(quietButton, "shrink-0")}
        >
          {open ? "Less" : "More"}
          <RiArrowDownSLine
            className={cx("size-3.5 transition-transform duration-200 ease-out motion-reduce:transition-none", open && "rotate-180")}
            aria-hidden
          />
        </button>
      </div>
    </article>
  );
}

/* 2. Headline Stack */

const TOP_STORIES = [
  { id: "market", title: "The city approves a car-free Market Street by 2028", source: "The Meridian", time: "8 min ago" },
  { id: "port", title: "Port strike ends after 19 days; backlog clears by Friday", source: "Harbor Wire", time: "24 min ago" },
  { id: "schools", title: "School board reverses its ban on after-school clubs", source: "The Meridian", time: "41 min ago" },
  { id: "rain", title: "Storm drains hold as the first autumn rain arrives", source: "Coastline", time: "1 hour ago" },
] as const;

export function HeadlineStack() {
  const [leadId, setLeadId] = useState<string>(TOP_STORIES[0].id);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const promoted = useRef(false);
  const lead = TOP_STORIES.find((story) => story.id === leadId) ?? TOP_STORIES[0];
  const rest = TOP_STORIES.filter((story) => story.id !== lead.id);

  useEffect(() => {
    if (!promoted.current) return;
    leadRef.current?.focus();
  }, [leadId]);

  const promote = (id: string) => {
    promoted.current = true;
    setLeadId(id);
  };

  return (
    <section aria-label="Top stories" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-caption-2-semibold tracking-wide text-text-tertiary uppercase">Top stories</h3>
        <span className="flex items-center gap-1 text-caption-2-regular text-text-tertiary">
          <span aria-hidden className="size-1.5 rounded-full bg-status-rose-text animate-pulse motion-reduce:animate-none" />
          Updated 2 min ago
        </span>
      </div>

      <div key={lead.id} className="mt-1.5 animate-label-in motion-reduce:animate-none">
        <p
          ref={leadRef}
          tabIndex={-1}
          className="line-clamp-2 rounded-sm text-body-2-semibold text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          {lead.title}
        </p>
        <Meta source={lead.source} time={lead.time} className="mt-1" />
      </div>

      <ul className="mt-1.5 border-t border-separator-border">
        {rest.map((story) => (
          <li key={story.id} className="border-b border-separator-border last:border-b-0">
            <button
              type="button"
              aria-label={`Promote to lead: ${story.title} (${story.time})`}
              onClick={() => promote(story.id)}
              className={cx(
                "group flex h-7 w-full items-center gap-1.5 rounded-md text-start",
                "transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
                "hover:bg-background-secondary-default",
                focusRing,
              )}
            >
              <span className="min-w-0 flex-1 truncate text-caption-1-medium text-text-secondary group-hover:text-text-primary">
                {story.title}
              </span>
              <span className="shrink-0 text-caption-2-regular text-text-tertiary tabular-nums">{story.time}</span>
              <RiArrowRightLine className="size-3 shrink-0 text-foreground-icon-tertiary rtl:-scale-x-100" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* 3. Topic Filter */

const TOPICS = [
  { id: "city", label: "City hall", count: 24 },
  { id: "transit", label: "Transit", count: 18 },
  { id: "housing", label: "Housing", count: 31 },
  { id: "climate", label: "Climate", count: 12 },
  { id: "culture", label: "Culture", count: 9 },
  { id: "sports", label: "Sports", count: 27 },
] as const;

export function TopicFilter() {
  const [selected, setSelected] = useState<string[]>(["city", "housing", "transit"]);
  const stories = TOPICS.filter((topic) => selected.includes(topic.id)).reduce((total, topic) => total + topic.count, 0);

  const toggle = (id: string) => {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  return (
    <section aria-label="Follow news topics" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Follow topics</h3>
        <button type="button" disabled={selected.length === 0} aria-label="Clear all followed topics" onClick={() => setSelected([])} className={quietButton}>
          Clear
        </button>
      </div>

      <div role="group" aria-label="Topics" className="mt-1.5 flex flex-wrap gap-1">
        {TOPICS.map((topic) => {
          const active = selected.includes(topic.id);
          return (
            <button
              key={topic.id}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(topic.id)}
              className={cx(
                "flex h-6 items-center gap-1 rounded-full border px-2 text-caption-2-medium",
                "transition-[background-color,border-color,color] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                active
                  ? "border-accent-500 bg-background-secondary-default text-text-primary"
                  : "border-border-button-default bg-background-primary-default text-text-secondary hover:border-border-button-hover hover:text-text-primary",
              )}
            >
              {topic.label}
              <span className={cx("tabular-nums", active ? "text-accent-600" : "text-text-tertiary")}>{topic.count}</span>
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="mt-1.5 flex items-center gap-1 text-caption-2-regular text-text-tertiary tabular-nums">
        <span
          aria-hidden
          className={cx("size-1.5 shrink-0 rounded-full", selected.length > 0 ? "bg-status-lime-text" : "bg-foreground-icon-tertiary")}
        />
        {selected.length === 0
          ? "Pick a topic to build your feed"
          : `${selected.length} ${selected.length === 1 ? "topic" : "topics"} · ${stories} stories today`}
      </p>
    </section>
  );
}

/* 4. Reading Progress */

const READING_PARAGRAPHS = [
  "At 6:40 the ferry yard is still dark. The first boat leaves at seven, and the deckhands move through the queue with thermoses and a clipboard that has outlived three software systems.",
  "The route carries 1,400 people a day, most of them workers who cannot do their jobs from a kitchen table. When the north dock closed in March, those same people started driving 47 minutes each way.",
  "A new boat will not fix the dock. But the county has finally funded the pilings, and the first contract goes out in January. Until then, the 6:55 keeps its schedule and the queue keeps its patience.",
];

export function ReadingProgress() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ top: 0, pct: 0 });
  const minutesLeft = view.pct >= 100 ? 0 : Math.max(1, Math.ceil(6 * (1 - view.pct / 100)));
  const fade = Math.min(1, view.top / 24);

  const onScroll = () => {
    const node = trackRef.current;
    if (!node) return;
    const max = node.scrollHeight - node.clientHeight;
    const top = node.scrollTop;
    setView({ top, pct: max > 0 ? Math.round((top / max) * 100) : 0 });
  };

  return (
    <section aria-label="Reading progress" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-caption-2-semibold tracking-wide text-accent-600 uppercase">Long read</p>
        <span className="flex items-center gap-1 text-caption-2-regular text-text-tertiary">
          <RiTimeLine className="size-3" aria-hidden />
          6 min
        </span>
      </div>
      <h3 className="mt-0.5 text-body-2-semibold text-text-primary">The last ferry to Vashon</h3>

      <div className="relative mt-1.5">
        <div
          ref={trackRef}
          tabIndex={0}
          role="region"
          aria-label="Story text, 6 minute read"
          onScroll={onScroll}
          className={cx(
            "h-16 overflow-y-auto rounded-lg bg-background-secondary-default p-2",
            "text-caption-2-regular text-text-secondary",
            focusRing,
          )}
        >
          {READING_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph.slice(0, 18)} className="mb-1.5 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>

        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-6">
          <div
            className="absolute inset-x-0 top-0 h-6 backdrop-blur-[1px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
            style={{ opacity: fade }}
          />
          <div
            className="absolute inset-x-0 top-0 h-4 backdrop-blur-[4px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
            style={{ opacity: fade }}
          />
          <div
            className="absolute inset-x-0 top-0 h-6 bg-linear-to-b from-background-secondary-default to-transparent"
            style={{ opacity: fade }}
          />
        </div>
      </div>

      <div className="mt-1.5 flex items-center gap-2">
        <div
          role="progressbar"
          aria-label="Story progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={view.pct}
          className="h-1 flex-1 overflow-hidden rounded-full bg-background-tertiary-default"
        >
          <div
            className="h-full rounded-full bg-accent-500 transition-[width] duration-200 ease-out motion-reduce:transition-none"
            style={{ width: `${view.pct}%` }}
          />
        </div>
        <span className="shrink-0 text-caption-2-medium text-text-secondary tabular-nums">
          {view.pct}% · {view.pct >= 100 ? "Finished" : `${minutesLeft} min left`}
        </span>
      </div>
    </section>
  );
}

/* 5. Save for Later */

export function SaveForLater() {
  const [saved, setSaved] = useState(false);

  return (
    <article aria-label="What the seawall delay means for the working waterfront" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-start gap-2.5">
        <NewsArt tone="transit" className="size-12" />
        <div className="min-w-0 flex-1">
          <p className="text-caption-2-semibold text-text-secondary">The Meridian</p>
          <h3 className="mt-0.5 text-body-2-semibold text-text-primary">What the seawall delay means for the working waterfront</h3>
          <p className="mt-0.5 text-caption-2-regular text-text-tertiary">6 min read · saved for the ferry home</p>
        </div>
        <button
          type="button"
          aria-pressed={saved}
          aria-label={saved ? "Remove from reading list" : "Save for later"}
          onClick={() => setSaved((current) => !current)}
          className={cx(
            "flex size-7 shrink-0 items-center justify-center rounded-full bg-background-tertiary-default",
            "transition-[transform,background-color,color] duration-200 ease-out active:scale-90",
            "motion-reduce:transition-none motion-reduce:active:scale-100",
            focusRing,
            saved ? "text-accent-600" : "text-foreground-icon-secondary hover:text-text-primary",
          )}
        >
          {saved ? (
            <RiBookmarkFill className="size-4 animate-label-in motion-reduce:animate-none" aria-hidden />
          ) : (
            <RiBookmarkLine className="size-4" aria-hidden />
          )}
        </button>
      </div>

      <div className={cx(revealGrid, saved ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
        <div className="min-h-0 overflow-hidden">
          <div className="mt-1.5 flex items-center gap-1.5 border-t border-separator-border pt-1.5 text-caption-2-regular">
            <RiCheckLine className="size-3 shrink-0 text-status-lime-text" aria-hidden />
            <span className="min-w-0 flex-1 truncate text-text-secondary">Saved to your reading list</span>
            <span className="shrink-0 text-text-tertiary tabular-nums">3 saved</span>
          </div>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {saved ? "Article saved for later." : "Article removed from your reading list."}
      </p>
    </article>
  );
}

/* 6. Author Bio */

export function AuthorBio() {
  const [following, setFollowing] = useState(false);

  return (
    <section aria-label="About the author" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-start gap-2.5">
        <span
          aria-hidden
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-600 text-body-2-semibold text-text-white shadow-xs"
        >
          IM
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 text-body-2-semibold text-text-primary">
            Iris Mahon
            <RiVerifiedBadgeFill className="size-3.5 text-accent-500" aria-hidden />
          </p>
          <p className="text-caption-2-regular text-text-tertiary">Harbor & climate reporter</p>
        </div>
        <button
          type="button"
          aria-pressed={following}
          onClick={() => setFollowing((current) => !current)}
          className={cx(
            following ? secondaryButton : primaryButton,
            "shrink-0 gap-1 px-2 text-caption-2-semibold",
          )}
        >
          {following ? <RiCheckLine className="size-3.5" aria-hidden /> : <RiUserAddLine className="size-3.5" aria-hidden />}
          {following ? "Following" : "Follow"}
        </button>
      </div>

      <p className="mt-1.5 text-caption-1-regular text-text-secondary">
        Covers the working coast, the tide tables and the people who read them. Twelve years on the water.
      </p>

      <div className="mt-1.5 flex items-center justify-between gap-2 border-t border-separator-border pt-1.5 text-caption-2-regular text-text-tertiary">
        <span className="tabular-nums">
          <span
            key={following ? "following" : "idle"}
            className="inline-block animate-label-in text-caption-2-semibold text-text-primary motion-reduce:animate-none"
          >
            {following ? "8.3k" : "8.2k"}
          </span>{" "}
          followers
        </span>
        <span aria-live="polite" className={cx("transition-colors duration-200 ease-out motion-reduce:transition-none", following && "text-status-lime-text")}>
          {following ? "You'll see her next story" : "Staff writer since 2019"}
        </span>
      </div>
    </section>
  );
}

/* 7. Live Ticker */

const BREAKING = [
  { id: "seawall", text: "Council passes the $84M seawall bond, 7–4", desk: "City Hall", time: "2 min ago" },
  { id: "ferry", text: "North ferry route resumes after a 19-day strike", desk: "Transit Desk", time: "11 min ago" },
  { id: "air", text: "Air quality alert lifted for the harbor district", desk: "Weather Desk", time: "26 min ago" },
] as const;

export function LiveTicker() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const item = BREAKING[index];

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % BREAKING.length), 4200);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <section aria-label="Breaking news" className={cx(cardSurface, "max-w-[560px] overflow-hidden")}>
      <div className="flex items-center gap-2.5 p-2.5">
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-status-rose-background px-1.5 py-0.5 text-caption-2-semibold text-status-rose-text">
          <span aria-hidden className="size-1.5 rounded-full bg-status-rose-text animate-pulse motion-reduce:animate-none" />
          Breaking
        </span>

        <div aria-live={paused ? "polite" : "off"} className="min-w-0 flex-1">
          <p key={item.id} className="truncate text-caption-1-semibold text-text-primary animate-label-in motion-reduce:animate-none">
            {item.text}
          </p>
          <p className="truncate text-caption-2-regular text-text-tertiary">
            {item.desk} · {item.time}
          </p>
        </div>

        <button
          type="button"
          aria-pressed={paused}
          aria-label={paused ? "Resume breaking news ticker" : "Pause breaking news ticker"}
          onClick={() => setPaused((current) => !current)}
          className={cx(
            "flex size-7 shrink-0 items-center justify-center rounded-full bg-background-tertiary-default text-foreground-icon-secondary",
            "transition-[background-color,color,transform] duration-150 ease-out active:scale-90",
            "motion-reduce:transition-none motion-reduce:active:scale-100",
            focusRing,
            "hover:bg-background-tertiary-hover hover:text-text-primary",
          )}
        >
          {paused ? <RiPlayLine className="size-3.5" aria-hidden /> : <RiPauseLine className="size-3.5" aria-hidden />}
        </button>
      </div>

      <div aria-hidden className="flex gap-0.5 px-2.5 pb-2">
        {BREAKING.map((story, position) => (
          <span
            key={story.id}
            className={cx(
              "h-0.5 flex-1 rounded-full transition-colors duration-200 ease-out motion-reduce:transition-none",
              position === index ? "bg-status-rose-text" : "bg-background-tertiary-default",
            )}
          />
        ))}
      </div>
    </section>
  );
}

/* 8. Newsletter Box */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FREQUENCIES = [
  { id: "daily", label: "Daily", note: "Weekday mornings at 6:30." },
  { id: "weekly", label: "Weekly", note: "Sundays, with the week ahead." },
] as const;

type FrequencyId = (typeof FREQUENCIES)[number]["id"];

export function NewsletterBox() {
  const inputId = useId();
  const statusId = useId();
  const [email, setEmail] = useState("");
  const [frequency, setFrequency] = useState<FrequencyId>("daily");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const note = FREQUENCIES.find((option) => option.id === frequency)?.note ?? FREQUENCIES[0].note;

  const subscribe = () => {
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Enter a full email address.");
      setSent(false);
      return;
    }
    setError(null);
    setSent(true);
  };

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        subscribe();
      }}
      aria-label="Subscribe to The Morning Meridian"
      className={cx(cardSurface, "max-w-[320px] p-2.5")}
    >
      <div className="flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-accent-600 text-text-white shadow-xs">
          <RiMailLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">The Morning Meridian</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">Seven stories. One email. No noise.</p>
        </div>
        <span className="shrink-0 rounded-full bg-background-tertiary-default px-1.5 py-0.5 text-caption-2-medium text-text-secondary">
          Free
        </span>
      </div>

      <div className="mt-1.5 flex items-center gap-1.5">
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <input
          id={inputId}
          type="email"
          dir="ltr"
          autoComplete="email"
          value={email}
          placeholder="you@example.com"
          aria-invalid={Boolean(error)}
          aria-describedby={statusId}
          onChange={(event) => {
            setEmail(event.target.value);
            setError(null);
            setSent(false);
          }}
          className={cx(
            "h-8 min-w-0 flex-1 rounded-lg bg-background-tertiary-default px-2 text-caption-1-medium text-text-primary outline-none",
            "placeholder:text-text-placeholder transition-[box-shadow] duration-150 ease-out motion-reduce:transition-none",
            "focus-visible:ring-2 focus-visible:ring-border-focus-ring",
          )}
        />
        <button type="submit" className={cx(primaryButton, "h-8 shrink-0")}>
          {sent ? <RiCheckLine className="size-3.5" aria-hidden /> : null}
          {sent ? "Subscribed" : "Subscribe"}
        </button>
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <div role="group" aria-label="Email frequency" className="flex rounded-md bg-background-tertiary-default p-0.5">
          {FREQUENCIES.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={frequency === option.id}
              onClick={() => setFrequency(option.id)}
              className={cx(
                "rounded-sm px-1.5 py-0.5 text-caption-2-semibold transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                frequency === option.id
                  ? "bg-background-primary-default text-text-primary shadow-xs"
                  : "text-text-tertiary hover:text-text-secondary",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        <span id={statusId} aria-live="polite" className="flex min-w-0 items-center justify-end gap-1 text-caption-2-regular">
          {error ? (
            <span className="min-w-0 truncate text-text-error-primary">{error}</span>
          ) : sent ? (
            <span className="flex min-w-0 items-center gap-1 truncate text-status-lime-text animate-label-in motion-reduce:animate-none">
              <RiCheckLine className="size-3 shrink-0" aria-hidden />
              {frequency === "daily" ? "First issue tomorrow." : "First issue Sunday."}
            </span>
          ) : (
            <span className="min-w-0 truncate text-text-tertiary">{note}</span>
          )}
        </span>
      </div>
    </form>
  );
}

/* 9. Comment Count */

export function CommentCount() {
  const panelId = useId();
  const [open, setOpen] = useState(false);

  return (
    <section aria-label="Comments on this story" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-body-2-semibold text-text-primary">
          <RiChat3Line className="size-3.5 text-foreground-icon-secondary" aria-hidden />
          Comments
          <span className="rounded-full bg-background-tertiary-default px-1.5 py-0.5 text-caption-2-semibold text-text-secondary tabular-nums">
            24
          </span>
        </p>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((current) => !current)}
          className={cx(quietButton, "shrink-0")}
        >
          {open ? "Collapse" : "Jump to comments"}
          <RiArrowDownSLine
            className={cx("size-3.5 transition-transform duration-200 ease-out motion-reduce:transition-none", open && "rotate-180")}
            aria-hidden
          />
        </button>
      </div>

      <div className="mt-1.5 rounded-lg bg-background-secondary-default p-2">
        <div className="flex items-center gap-1.5">
          <span aria-hidden className="flex size-5 items-center justify-center rounded-full bg-chart-5/20 text-caption-2-semibold text-text-primary">
            DR
          </span>
          <span className="text-caption-2-semibold text-text-primary">Dana Reyes</span>
          <span className="text-caption-2-regular text-text-tertiary">2h ago</span>
        </div>
        <p className="mt-1 line-clamp-2 text-caption-1-regular text-text-secondary">
          The bond vote is only half of it. The maintenance budget is where this usually dies.
        </p>
      </div>

      <div id={panelId} inert={!open} className={cx(revealGrid, open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
        <div className="min-h-0 overflow-hidden">
          <div className="mt-1 flex items-start gap-1.5 border-s-2 border-separator-border ps-2">
            <span aria-hidden className="flex size-5 shrink-0 items-center justify-center rounded-full bg-chart-1/20 text-caption-2-semibold text-text-primary">
              JW
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-caption-2-semibold text-text-primary">
                Jonah Wells <span className="text-caption-2-regular text-text-tertiary">· 1h ago</span>
              </p>
              <p className="line-clamp-2 text-caption-2-regular text-text-secondary">
                The council meets again on the 19th. That is the meeting to watch.
              </p>
            </div>
          </div>
          <p className="mt-1 text-end text-caption-2-regular text-text-tertiary tabular-nums">Showing 2 of 24</p>
        </div>
      </div>
    </section>
  );
}

/* 10. Related Stories */

const RELATED = [
  { id: "charts", title: "The seawall, explained in four charts", source: "Visual Desk", time: "2h ago" },
  { id: "votes", title: "Who voted for the bond — and who didn't", source: "City Hall", time: "4h ago" },
  { id: "cities", title: "What other port cities got wrong", source: "Long Read", time: "6h ago" },
] as const;

export function RelatedStories() {
  const [selected, setSelected] = useState<string>(RELATED[0].id);

  return (
    <section aria-label="Related stories" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Related stories</h3>
        <span className="text-caption-2-regular text-text-tertiary">Picked by the desk</span>
      </div>

      <div className="mt-1 flex flex-col">
        {RELATED.map((story) => {
          const active = selected === story.id;
          return (
            <button
              key={story.id}
              type="button"
              aria-pressed={active}
              onClick={() => setSelected(story.id)}
              className={cx(
                "group flex h-[38px] items-center gap-1.5 border-s-2 ps-2 pe-1 text-start",
                "transition-[background-color,border-color,color] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                active
                  ? "border-accent-500 bg-background-secondary-default"
                  : "border-transparent hover:bg-background-secondary-default",
              )}
            >
              <span className="min-w-0 flex-1">
                <span className={cx("block truncate text-caption-1-medium", active ? "text-text-primary" : "text-text-secondary group-hover:text-text-primary")}>
                  {story.title}
                </span>
                <Meta source={story.source} time={story.time} className="mt-0.5" />
              </span>
              <RiCheckLine
                className={cx(
                  "size-3.5 shrink-0 text-accent-600 transition-opacity duration-150 ease-out motion-reduce:transition-none",
                  active ? "opacity-100" : "opacity-0",
                )}
                aria-hidden
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* 11. Paywall Card */

const PLANS = [
  { id: "monthly", label: "Monthly", price: "$9", cadence: "/mo", detail: "Billed monthly" },
  { id: "annual", label: "Annual", price: "$72", cadence: "/yr", detail: "Save 33%" },
] as const;

type PlanId = (typeof PLANS)[number]["id"];

export function PaywallCard() {
  const [plan, setPlan] = useState<PlanId>("annual");
  const [subscribed, setSubscribed] = useState(false);
  const planRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const current = PLANS.find((option) => option.id === plan) ?? PLANS[1];

  const choose = (id: PlanId) => {
    if (id === plan) return;
    setPlan(id);
    setSubscribed(false);
  };

  return (
    <section aria-label="Member offer" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-1.5">
        <span className="flex size-5 items-center justify-center rounded-md bg-accent-600 text-text-white">
          <RiLockLine className="size-3" aria-hidden />
        </span>
        <span className="text-caption-2-semibold text-text-secondary">The Meridian</span>
        <span className="ms-auto rounded-full bg-background-tertiary-default px-1.5 py-0.5 text-caption-2-medium text-text-secondary">Member story</span>
      </div>

      <h3 className="mt-1 text-headline-semibold text-text-primary">Keep reading the coast.</h3>
      <p className="text-caption-2-regular text-text-tertiary">Unlimited reporting, no ads, cancel anytime.</p>

      <div
        role="radiogroup"
        aria-label="Choose a billing plan"
        className="mt-1.5 grid grid-cols-2 gap-1.5"
        onKeyDown={(event) => {
          if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
          event.preventDefault();
          const next: PlanId = plan === "annual" ? "monthly" : "annual";
          choose(next);
          planRefs.current[next === "annual" ? 1 : 0]?.focus();
        }}
      >
        {PLANS.map((option, position) => {
          const active = plan === option.id;
          return (
            <button
              key={option.id}
              ref={(node) => {
                planRefs.current[position] = node;
              }}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              onClick={() => choose(option.id)}
              className={cx(
                "flex h-10 flex-col justify-center rounded-lg border px-2 text-start",
                "transition-[background-color,border-color,color] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                active
                  ? "border-accent-500 bg-background-secondary-default"
                  : "border-border-button-default bg-background-primary-default hover:border-border-button-hover",
              )}
            >
              <span className="flex items-baseline justify-between gap-1">
                <span className="text-caption-2-semibold text-text-primary">{option.label}</span>
                <span className="text-caption-2-regular text-text-tertiary">{option.detail}</span>
              </span>
              <span className="text-caption-1-semibold text-text-secondary tabular-nums">
                {option.price}
                <span className="text-caption-2-regular text-text-tertiary">{option.cadence}</span>
              </span>
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="mt-1 flex items-center gap-1 text-caption-2-regular text-text-tertiary">
        {subscribed ? (
          <span className="flex items-center gap-1 text-status-lime-text animate-label-in motion-reduce:animate-none">
            <RiCheckLine className="size-3" aria-hidden />
            You&apos;re in. First month free.
          </span>
        ) : (
          <span>
            {plan === "annual" ? "$6.00 a month, billed yearly" : "$9.00 billed every month"}
          </span>
        )}
      </p>

      <button
        type="button"
        onClick={() => setSubscribed(true)}
        className={cx(primaryButton, "mt-1.5 w-full")}
      >
        {subscribed ? "Continue reading" : `Subscribe — ${current.price}${current.cadence}`}
        <RiArrowRightLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
      </button>
    </section>
  );
}

/* 12. Daily Briefing */

const BRIEF_STORIES = [
  { id: "bond", title: "The seawall bond passes, 7–4" },
  { id: "ferry", title: "Ferry backlog clears by Friday" },
  { id: "rain", title: "Rain returns; the harbor drains hold" },
  { id: "rent", title: "Council sets a new vote on rent relief" },
  { id: "exchange", title: "Portland exchange opens on the waterfront" },
  { id: "tide", title: "The tide chart for the week ahead" },
  { id: "lighthouse", title: "One good read: the last lighthouse keeper" },
] as const;

const BRIEF_VISIBLE = 4;
const TOTAL_BRIEF_STORIES = BRIEF_STORIES.length;

export function DailyBriefing() {
  const [read, setRead] = useState<string[]>(["bond"]);
  const allRead = read.length === TOTAL_BRIEF_STORIES;

  const toggle = (id: string) => {
    setRead((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  return (
    <section aria-label="Daily briefing" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-start gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-status-yellow-background text-status-yellow-text">
          <RiSunLine className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">Daily Briefing</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">Thursday, November 5 · 4 min</p>
        </div>
        <span className="shrink-0 rounded-full bg-background-tertiary-default px-1.5 py-0.5 text-caption-2-semibold text-text-secondary tabular-nums">
          7 stories
        </span>
      </div>

      <ul className="mt-1.5 flex flex-col">
        {BRIEF_STORIES.slice(0, BRIEF_VISIBLE).map((story) => {
          const done = read.includes(story.id);
          return (
            <li key={story.id}>
              <button
                type="button"
                role="checkbox"
                aria-checked={done}
                onClick={() => toggle(story.id)}
                className={cx(
                  "group flex h-6 w-full items-center gap-1.5 rounded-md text-start",
                  "transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
                  "hover:bg-background-secondary-default",
                  focusRing,
                )}
              >
                <span
                  className={cx(
                    "flex size-3.5 shrink-0 items-center justify-center rounded-full border",
                    "transition-[background-color,border-color,color] duration-200 ease-out motion-reduce:transition-none",
                    done ? "border-accent-600 bg-accent-600 text-text-white" : "border-border-checkbox-default text-transparent",
                  )}
                >
                  <RiCheckLine className="size-2.5" aria-hidden />
                </span>
                <span
                  className={cx(
                    "min-w-0 flex-1 truncate text-caption-1-medium transition-colors duration-150 ease-out motion-reduce:transition-none",
                    done ? "text-text-tertiary line-through" : "text-text-secondary group-hover:text-text-primary",
                  )}
                >
                  {story.title}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-0.5 flex items-center gap-2 border-t border-separator-border pt-1">
        <div
          role="progressbar"
          aria-label="Briefing read progress"
          aria-valuemin={0}
          aria-valuemax={TOTAL_BRIEF_STORIES}
          aria-valuenow={read.length}
          className="h-1 w-10 shrink-0 overflow-hidden rounded-full bg-background-tertiary-default"
        >
          <div
            className="h-full rounded-full bg-accent-500 transition-[width] duration-200 ease-out motion-reduce:transition-none"
            style={{ width: `${(read.length / TOTAL_BRIEF_STORIES) * 100}%` }}
          />
        </div>
        <span className="min-w-0 flex-1 truncate text-caption-2-regular text-text-tertiary tabular-nums">
          {read.length} of {TOTAL_BRIEF_STORIES} read
        </span>
        <button
          type="button"
          onClick={() => setRead(allRead ? [] : BRIEF_STORIES.map((story) => story.id))}
          className={cx(quietButton, "shrink-0")}
        >
          {allRead ? "Reset" : "Mark all read"}
          <RiArrowRightLine className="size-3 rtl:-scale-x-100" aria-hidden />
        </button>
      </div>
    </section>
  );
}

/* Section */

export const NEWS_SECTION: ExtendedSection = {
  id: "news",
  title: "News",
  blurb: "Headlines, briefings and reading without the noise.",
  file: "news.tsx",
  entries: [
    { name: "Article Card", description: "A headline, a dek and the source line, with a quiet expand.", Demo: ArticleCard },
    { name: "Headline Stack", description: "Top stories where picking a row promotes it to the lead.", Demo: HeadlineStack },
    { name: "Topic Filter", description: "Follow topics by count, with a running story tally.", Demo: TopicFilter },
    { name: "Reading Progress", description: "A real scroll region that reports percent and minutes left.", Demo: ReadingProgress },
    { name: "Save for Later", description: "A bookmark that confirms exactly where the story went.", Demo: SaveForLater },
    { name: "Author Bio", description: "Reporter, beat and a follow that changes the count.", Demo: AuthorBio },
    { name: "Live Ticker", description: "A breaking strip that rotates on its own and pauses on command.", Demo: LiveTicker, wide: true },
    { name: "Newsletter Box", description: "Email, cadence and one honest success state.", Demo: NewsletterBox },
    { name: "Comment Count", description: "The first comment, a reply and a jump into the thread.", Demo: CommentCount },
    { name: "Related Stories", description: "A short related list with sources, times and a next pick.", Demo: RelatedStories },
    { name: "Paywall Card", description: "A member offer with monthly or annual billing.", Demo: PaywallCard },
    { name: "Daily Briefing", description: "A seven-story morning summary with a running read count.", Demo: DailyBriefing },
  ],
};
