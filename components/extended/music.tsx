"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  RiArrowDownLine,
  RiArrowDownSLine,
  RiArrowUpLine,
  RiCheckLine,
  RiComputerLine,
  RiDeleteBinLine,
  RiDiscLine,
  RiEqualizerLine,
  RiFireLine,
  RiGlobalLine,
  RiHeadphoneLine,
  RiMoonLine,
  RiMusic2Line,
  RiPauseFill,
  RiPlayFill,
  RiRefreshLine,
  RiSkipBackFill,
  RiSkipForwardFill,
  RiSpeaker2Line,
  RiTimerLine,
  RiUserFollowLine,
  RiVideoChatLine,
  RiVolumeMuteLine,
  RiVolumeUpLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* Shared anatomy */

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";
const cardSurface = "w-full rounded-xl border border-border-button-default bg-background-primary-default shadow-card";
const buttonBase = cx(
  "inline-flex items-center justify-center gap-1.5 rounded-lg text-caption-1-semibold",
  "transition-[transform,background-color,color,box-shadow,opacity] duration-150 ease-out",
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  "motion-reduce:transition-none motion-reduce:active:scale-100",
  focusRing,
);
const primaryButton = cx(buttonBase, "h-7 bg-button-primary px-2 text-text-white shadow-xs");
const secondaryButton = cx(
  buttonBase,
  "h-7 border border-border-button-default bg-background-primary-default px-2 text-text-primary shadow-xs hover:bg-background-primary-hover",
);
const iconButton = cx(
  "flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-icon-secondary",
  "transition-[background-color,color,opacity] duration-150 ease-out hover:bg-background-tertiary-default hover:text-text-primary",
  "disabled:pointer-events-none disabled:text-foreground-icon-disabled motion-reduce:transition-none",
  focusRing,
);

const numberFormat = new Intl.NumberFormat("en-US");

function formatTime(total: number) {
  const safe = Math.max(0, Math.round(total));
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
}

/* Token-built cover art */

const coverWash = [
  "bg-linear-to-br from-accent-700 via-chart-5 to-chart-3",
  "bg-linear-to-tr from-chart-1 via-accent-600 to-chart-4",
  "bg-linear-to-br from-accent-900 via-chart-3 to-chart-2",
  "bg-linear-to-tr from-chart-3 via-accent-700 to-chart-1",
] as const;

function Cover({ pattern, className, label }: { pattern: number; className?: string; label?: string }) {
  const index = pattern % coverWash.length;

  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cx("relative block overflow-hidden rounded-lg", coverWash[index], className)}
    >
      <span aria-hidden className="absolute inset-0 bg-linear-to-t from-accent-950/45 via-transparent to-transparent" />
      {index === 0 && (
        <>
          <span aria-hidden className="absolute -end-1.5 -top-1.5 size-7 rounded-full border border-text-white/40" />
          <span aria-hidden className="absolute inset-x-2 top-1/2 h-px bg-text-white/30" />
        </>
      )}
      {index === 1 && (
        <>
          <span aria-hidden className="absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-text-white/45" />
          <span aria-hidden className="absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-text-white/30" />
        </>
      )}
      {index === 2 && (
        <span aria-hidden className="absolute inset-x-2 bottom-1.5 flex h-1/2 items-end gap-1">
          <span className="h-1/3 w-1 rounded-t-sm bg-text-white/35" />
          <span className="h-2/3 w-1 rounded-t-sm bg-text-white/30" />
          <span className="h-1/2 w-1 rounded-t-sm bg-text-white/40" />
          <span className="h-full w-1 rounded-t-sm bg-text-white/25" />
        </span>
      )}
      {index === 3 && (
        <>
          <span aria-hidden className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rotate-12 border border-text-white/45" />
          <span aria-hidden className="absolute inset-x-1.5 bottom-1.5 h-px bg-text-white/30" />
        </>
      )}
    </span>
  );
}

/* Shared slider */

function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  valueText,
  className,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  valueText?: string;
  className?: string;
}) {
  const percent = max === min ? 0 : ((value - min) / (max - min)) * 100;

  return (
    <div
      className={cx(
        "relative flex h-4 w-full items-center rounded-full",
        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-border-focus-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background-primary-default",
        disabled && "opacity-40",
        className,
      )}
    >
      <span aria-hidden className="h-1 w-full rounded-full bg-background-quaternary-default" />
      <span
        aria-hidden
        className="absolute start-0 h-1 rounded-full bg-accent-600 transition-[width] duration-200 ease-out motion-reduce:transition-none"
        style={{ width: `${percent}%` }}
      />
      <span
        aria-hidden
        className="absolute size-2.5 -translate-x-1/2 rounded-full border-2 border-accent-600 bg-background-primary-default shadow-xs transition-[inset-inline-start] duration-200 ease-out rtl:translate-x-1/2 motion-reduce:transition-none"
        style={{ insetInlineStart: `${percent}%` }}
      />
      <input
        type="range"
        aria-label={label}
        aria-valuetext={valueText}
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0 disabled:cursor-not-allowed"
      />
    </div>
  );
}

function Meter({ active, className }: { active: boolean; className?: string }) {
  return (
    <span aria-hidden className={cx("flex h-3.5 shrink-0 items-end gap-0.5", className)}>
      {[0, 1, 2].map((bar) => (
        <span
          key={bar}
          className={cx(
            "w-0.5 rounded-full bg-accent-600 transition-[height,opacity] duration-200 ease-out motion-reduce:transition-none",
            active
              ? bar === 1
                ? "h-3.5 animate-pulse motion-reduce:animate-none"
                : bar === 0
                  ? "h-2 animate-pulse motion-reduce:animate-none"
                  : "h-2.5 animate-pulse motion-reduce:animate-none"
              : "h-0.5 opacity-40",
          )}
          style={{ animationDelay: `${bar * 120}ms` }}
        />
      ))}
    </span>
  );
}

/* 1. Now Playing */

const NOW_TRACKS = [
  { title: "Teardrop", artist: "Massive Attack", album: "Mezzanine", duration: 329, pattern: 1 },
  { title: "Angel", artist: "Massive Attack", album: "Mezzanine", duration: 378, pattern: 3 },
] as const;

export function NowPlaying() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [seconds, setSeconds] = useState(74);
  const track = NOW_TRACKS[index];

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setSeconds((current) => (current + 1 >= track.duration ? 0 : current + 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [playing, track.duration]);

  const step = (delta: number) => {
    setIndex((current) => (current + delta + NOW_TRACKS.length) % NOW_TRACKS.length);
    setSeconds(0);
    setPlaying(true);
  };

  return (
    <section aria-label="Now playing" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-2.5">
        <Cover pattern={track.pattern} className="size-14 shrink-0" />
        <div className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className={cx("size-1.5 rounded-full bg-accent-600", playing ? "animate-pulse motion-reduce:animate-none" : "opacity-40")} aria-hidden />
            <span className="text-caption-2-semibold tracking-wide text-text-tertiary uppercase">Now playing</span>
          </span>
          <p key={track.title} aria-live="polite" className="animate-label-in truncate text-body-2-semibold text-text-primary motion-reduce:animate-none">
            {track.title}
          </p>
          <p className="truncate text-caption-2-regular text-text-tertiary">
            {track.artist} · {track.album}
          </p>
        </div>
        <Meter active={playing} />
      </div>

      <div className="mt-2">
        <Slider
          label="Track position"
          value={seconds}
          max={track.duration}
          onChange={setSeconds}
          valueText={`${formatTime(seconds)} of ${formatTime(track.duration)}`}
        />
        <div className="mt-0.5 flex justify-between text-caption-2-regular text-text-tertiary tabular-nums">
          <span>{formatTime(seconds)}</span>
          <span>-{formatTime(track.duration - seconds)}</span>
        </div>
      </div>

      <div className="mt-1 flex items-center justify-center gap-1">
        <button type="button" aria-label="Previous track" onClick={() => step(-1)} className={iconButton}>
          <RiSkipBackFill className="size-3.5 rtl:-scale-x-100" aria-hidden />
        </button>
        <button
          type="button"
          aria-label={playing ? `Pause ${track.title}` : `Play ${track.title}`}
          onClick={() => setPlaying((current) => !current)}
          className={cx(
            "flex size-8 items-center justify-center rounded-full bg-button-primary text-text-white shadow-xs",
            "transition-[transform,box-shadow] duration-150 ease-out active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100",
            focusRing,
          )}
        >
          {playing ? <RiPauseFill className="size-3.5" aria-hidden /> : <RiPlayFill className="size-3.5" aria-hidden />}
        </button>
        <button type="button" aria-label="Next track" onClick={() => step(1)} className={iconButton}>
          <RiSkipForwardFill className="size-3.5 rtl:-scale-x-100" aria-hidden />
        </button>
      </div>
    </section>
  );
}

/* 2. Queue Row */

const QUEUE_START = [
  { id: "roygbiv", title: "Roygbiv", artist: "Boards of Canada", duration: "2:31", pattern: 2 },
  { id: "breathe", title: "Breathe", artist: "The Prodigy", duration: "5:35", pattern: 0 },
  { id: "flim", title: "Flim", artist: "Aphex Twin", duration: "2:57", pattern: 3 },
] as const;

type QueueTrack = (typeof QUEUE_START)[number];

export function QueueRow() {
  const [queue, setQueue] = useState<QueueTrack[]>([...QUEUE_START]);
  const [movedId, setMovedId] = useState<string | null>(null);
  const [notice, setNotice] = useState("Starts after Teardrop.");

  useEffect(() => {
    if (!movedId) return;
    const timer = window.setTimeout(() => setMovedId(null), 600);
    return () => window.clearTimeout(timer);
  }, [movedId]);

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= queue.length) return;
    const track = queue[index];
    setQueue((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setMovedId(track.id);
    setNotice(`Moved “${track.title}” to position ${target + 1}.`);
  };

  const remove = (track: QueueTrack) => {
    setQueue((current) => current.filter((item) => item.id !== track.id));
    setNotice(`Removed “${track.title}” from the queue.`);
  };

  const restore = () => {
    setQueue([...QUEUE_START]);
    setNotice("Queue restored with three tracks.");
  };

  return (
    <section aria-label="Play queue" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Up next</h3>
        <span className="text-caption-2-medium text-text-tertiary tabular-nums">
          {queue.length} of 12
        </span>
      </div>

      {queue.length === 0 ? (
        <div className="mt-1.5 flex h-[108px] flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border-button-default">
          <p className="text-caption-1-medium text-text-secondary">Queue is empty.</p>
          <button type="button" onClick={restore} className={cx(secondaryButton, "h-6 text-caption-2-semibold")}>
            <RiRefreshLine className="size-3" aria-hidden />
            Restore queue
          </button>
        </div>
      ) : (
        <ul className="mt-1">
          {queue.map((track, index) => (
            <li
              key={track.id}
              className={cx(
                "flex h-9 items-center gap-1 rounded-md px-1",
                "transition-[background-color] duration-200 ease-out motion-reduce:transition-none",
                movedId === track.id ? "bg-accent-500/10" : "hover:bg-background-secondary-default",
              )}
            >
              <span className="w-3 shrink-0 text-center text-caption-2-medium text-text-tertiary tabular-nums">{index + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-caption-1-semibold text-text-primary">{track.title}</span>
                <span className="block truncate text-caption-2-regular text-text-tertiary">
                  {track.artist} · {track.duration}
                </span>
              </span>
              <button
                type="button"
                aria-label={`Move ${track.title} up`}
                disabled={index === 0}
                onClick={() => move(index, -1)}
                className={cx(iconButton, "size-5")}
              >
                <RiArrowUpLine className="size-3" aria-hidden />
              </button>
              <button
                type="button"
                aria-label={`Move ${track.title} down`}
                disabled={index === queue.length - 1}
                onClick={() => move(index, 1)}
                className={cx(iconButton, "size-5")}
              >
                <RiArrowDownLine className="size-3" aria-hidden />
              </button>
              <button
                type="button"
                aria-label={`Remove ${track.title} from the queue`}
                onClick={() => remove(track)}
                className={cx(iconButton, "size-5 hover:text-text-error-primary")}
              >
                <RiDeleteBinLine className="size-3" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      <p aria-live="polite" className="mt-1 truncate text-caption-2-regular text-text-tertiary">
        {notice}
      </p>
    </section>
  );
}

/* 3. Playlist Card */

const PLAYLIST = {
  name: "Late Shift",
  curator: "Josephine Vale",
  tracks: 24,
  length: "1 hr 42 min",
  first: "Sea Within a Sea",
};

export function PlaylistCard() {
  const [playing, setPlaying] = useState(false);

  return (
    <section aria-label="Playlist" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-caption-2-semibold tracking-wide text-text-tertiary uppercase">Playlist</span>
        <span className="rounded-full bg-background-secondary-default px-1.5 py-0.5 text-caption-2-medium text-text-secondary">
          Private
        </span>
      </div>

      <div className="mt-1.5 flex items-center gap-2.5">
        <span aria-hidden className="grid size-16 shrink-0 grid-cols-2 gap-0.5 overflow-hidden rounded-lg bg-background-tertiary-default p-0.5">
          {[0, 1, 2, 3].map((pattern) => (
            <Cover key={pattern} pattern={pattern} className="h-full w-full rounded-none" />
          ))}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">{PLAYLIST.name}</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">By {PLAYLIST.curator}</p>
          <p className="mt-0.5 text-caption-2-regular text-text-tertiary tabular-nums">
            {PLAYLIST.tracks} tracks · {PLAYLIST.length}
          </p>
        </div>
        <button
          type="button"
          aria-label={playing ? "Pause Late Shift" : "Play Late Shift"}
          aria-pressed={playing}
          onClick={() => setPlaying((current) => !current)}
          className={cx(
            "flex size-9 shrink-0 items-center justify-center rounded-full bg-button-primary text-text-white shadow-xs",
            "transition-[transform,box-shadow] duration-150 ease-out active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100",
            focusRing,
          )}
        >
          {playing ? <RiPauseFill className="size-4" aria-hidden /> : <RiPlayFill className="size-4" aria-hidden />}
        </button>
      </div>

      <div className="mt-2 flex h-5 items-center gap-1.5 rounded-md bg-background-secondary-default px-1.5">
        <Meter active={playing} />
        <p aria-live="polite" className="min-w-0 truncate text-caption-2-regular text-text-tertiary">
          {playing ? `Playing · ${PLAYLIST.first}` : `Starts with “${PLAYLIST.first}”`}
        </p>
        <span className="ms-auto shrink-0 text-caption-2-regular text-text-tertiary tabular-nums">
          {playing ? "9:26" : "—"}
        </span>
      </div>
    </section>
  );
}

/* 4. Equalizer */

const EQ_BANDS = [
  { id: "60", label: "60 Hz" },
  { id: "230", label: "230 Hz" },
  { id: "910", label: "910 Hz" },
  { id: "3600", label: "3.6 kHz" },
  { id: "14000", label: "14 kHz" },
] as const;

const EQ_START = [2, 3, 0, -2, 1];

function signed(value: number) {
  return value > 0 ? `+${value}` : String(value);
}

export function Equalizer() {
  const [gains, setGains] = useState(EQ_START);
  const dirty = gains.some((gain) => gain !== 0);

  return (
    <section aria-label="Equalizer" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-md bg-background-secondary-default text-accent-600">
          <RiEqualizerLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">Equalizer</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary" aria-live="polite">
            {dirty ? "Custom curve · 5 bands" : "Flat response · 0 dB"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setGains([0, 0, 0, 0, 0])}
          disabled={!dirty}
          aria-label="Reset equalizer to flat"
          className={cx(secondaryButton, "h-6 gap-1 px-1.5 text-caption-2-semibold")}
        >
          <RiRefreshLine className="size-3" aria-hidden />
          Flat
        </button>
      </div>

      <div className="mt-2 flex flex-col gap-1.5">
        {EQ_BANDS.map((band, index) => (
          <div key={band.id} className="flex items-center gap-2">
            <span className="w-9 shrink-0 text-caption-2-medium text-text-tertiary tabular-nums">{band.label}</span>
            <Slider
              label={`${band.label} gain`}
              value={gains[index]}
              min={-6}
              max={6}
              step={1}
              onChange={(value) =>
                setGains((current) => current.map((gain, position) => (position === index ? value : gain)))
              }
              valueText={`${signed(gains[index])} decibels`}
            />
            <span className="w-5 shrink-0 text-end text-caption-2-semibold text-text-secondary tabular-nums">
              {signed(gains[index])}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-1.5 text-caption-2-regular text-text-tertiary">Applied to every output but AirPods.</p>
    </section>
  );
}

/* 5. Lyric Line */

const LYRIC_TIMES = ["0:12", "0:19", "0:26", "0:34"] as const;
const LYRIC_LINES = [
  "Love, love is a verb",
  "Love is a doing word",
  "Fearless on my breath",
  "Gentle impulsion shakes me",
] as const;
const LYRIC_ROW = 28;

export function LyricLine() {
  const [index, setIndex] = useState(1);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % LYRIC_LINES.length);
    }, 2800);
    return () => window.clearInterval(timer);
  }, [playing]);

  return (
    <section aria-label="Synced lyrics" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-1.5">
        <RiMusic2Line className="size-3.5 shrink-0 text-accent-600" aria-hidden />
        <h3 className="min-w-0 flex-1 text-caption-1-semibold text-text-primary">
          Lyrics <span className="text-text-tertiary">· Teardrop</span>
        </h3>
        <span className="flex items-center gap-1 rounded-full bg-status-lime-background px-1.5 py-0.5 text-caption-2-medium text-status-lime-text">
          <span className="size-1 rounded-full bg-status-lime-text" aria-hidden />
          Synced
        </span>
        <button
          type="button"
          aria-label={playing ? "Pause lyrics" : "Resume lyrics"}
          onClick={() => setPlaying((current) => !current)}
          className={cx(iconButton, "-me-1 size-6")}
        >
          {playing ? <RiPauseFill className="size-3" aria-hidden /> : <RiPlayFill className="size-3" aria-hidden />}
        </button>
      </div>

      <div className="relative mt-1.5 overflow-hidden" style={{ height: `${LYRIC_LINES.length * LYRIC_ROW}px` }}>
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-7 rounded-md bg-accent-500/10 ring-1 ring-inset ring-accent-500/40 transition-transform duration-200 ease-out motion-reduce:transition-none"
          style={{ transform: `translateY(${index * LYRIC_ROW}px)` }}
        />
        <ul className="relative">
          {LYRIC_LINES.map((line, position) => (
            <li key={line} className="h-7">
              <button
                type="button"
                aria-label={`Go to lyric at ${LYRIC_TIMES[position]}`}
                aria-current={position === index ? "true" : undefined}
                onClick={() => setIndex(position)}
                className={cx(
                  "flex h-7 w-full items-center rounded-md px-2 text-start text-caption-1-regular",
                  "transition-[color] duration-200 ease-out motion-reduce:transition-none",
                  focusRing,
                  position === index ? "text-text-primary" : "text-text-tertiary hover:text-text-secondary",
                )}
              >
                {line}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-0.5 flex items-center justify-between gap-2 text-caption-2-regular text-text-tertiary tabular-nums">
        <span>{LYRIC_TIMES[index]}</span>
        <span aria-live="polite">{playing ? "Following playback" : `Paused at ${LYRIC_TIMES[index]}`}</span>
      </div>
    </section>
  );
}

/* 6. Album Grid */

const ALBUMS = [
  { title: "Mezzanine", artist: "Massive Attack", pattern: 0 },
  { title: "Immunity", artist: "Jon Hopkins", pattern: 3 },
  { title: "Bloom", artist: "Beach House", pattern: 1 },
  { title: "In Rainbows", artist: "Radiohead", pattern: 2 },
] as const;

export function AlbumGrid() {
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState<string | null>(null);
  const active = ALBUMS[selected];

  const toggle = (title: string) => setPlaying((current) => (current === title ? null : title));

  return (
    <section aria-label="Saved albums" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Albums</h3>
        <span className="text-caption-2-medium text-text-tertiary">{ALBUMS.length} saved</span>
      </div>

      <div role="group" aria-label="Choose an album" className="mt-1.5 grid grid-cols-2 gap-1.5">
        {ALBUMS.map((album, index) => {
          const isSelected = index === selected;
          const isPlaying = playing === album.title;
          return (
            <div
              key={album.title}
              className={cx(
                "group relative flex h-11 items-center gap-1.5 rounded-lg border p-1",
                "transition-[background-color,border-color] duration-150 ease-out motion-reduce:transition-none",
                isSelected
                  ? "border-accent-500 bg-background-secondary-default"
                  : "border-border-button-default bg-background-primary-default hover:bg-background-primary-hover",
              )}
            >
              <Cover pattern={album.pattern} className="size-8 shrink-0 rounded-md" />
              <span className="min-w-0 flex-1 pe-3.5">
                <span className="block truncate text-caption-2-semibold text-text-primary">{album.title}</span>
                <span className="block truncate text-caption-2-regular text-text-tertiary">{album.artist}</span>
              </span>
              <button
                type="button"
                aria-label={`Select ${album.title} by ${album.artist}`}
                aria-pressed={isSelected}
                onClick={() => setSelected(index)}
                className={cx("absolute inset-0 rounded-lg", focusRing)}
              />
              <button
                type="button"
                aria-label={isPlaying ? `Pause ${album.title}` : `Play ${album.title}`}
                onClick={() => toggle(album.title)}
                className={cx(
                  "absolute start-1 top-1 flex size-8 items-center justify-center rounded-md bg-accent-950/55 text-text-white",
                  "pointer-events-none opacity-0 transition-opacity duration-150 ease-out group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100 motion-reduce:transition-none",
                  focusRing,
                )}
              >
                {isPlaying ? <RiPauseFill className="size-3" aria-hidden /> : <RiPlayFill className="size-3" aria-hidden />}
              </button>
              {isSelected && (
                <span className="pointer-events-none absolute end-0.5 top-0.5 flex size-3.5 items-center justify-center rounded-full bg-accent-600 text-text-white" aria-hidden>
                  <RiCheckLine className="size-2.5" />
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span aria-live="polite" className="min-w-0 truncate text-caption-2-regular text-text-tertiary">
          {playing ? `Playing “${playing}”` : `Selected “${active.title}”`}
        </span>
        <button
          type="button"
          onClick={() => toggle(active.title)}
          aria-label={playing === active.title ? `Pause ${active.title}` : `Play ${active.title}`}
          className={cx(secondaryButton, "h-6 shrink-0 gap-1 px-1.5 text-caption-2-semibold")}
        >
          {playing === active.title ? <RiPauseFill className="size-3" aria-hidden /> : <RiPlayFill className="size-3" aria-hidden />}
          {playing === active.title ? "Pause" : "Play"}
        </button>
      </div>
    </section>
  );
}

/* 7. Artist Card */

export function ArtistCard() {
  const [following, setFollowing] = useState(false);
  const followers = 2_418_302 + (following ? 1 : 0);

  return (
    <section aria-label="Artist" className={cx(cardSurface, "max-w-[320px] overflow-hidden")}>
      <div className="relative h-14">
        <Cover pattern={1} className="h-full w-full rounded-none" />
        <span className="absolute -bottom-4 start-2.5 flex size-10 items-center justify-center rounded-full border-2 border-background-primary-default bg-accent-700 text-caption-1-bold text-text-white shadow-xs">
          LS
        </span>
      </div>

      <div className="px-2.5 pb-2.5 pt-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-body-2-semibold text-text-primary">Little Simz</h3>
            <p className="truncate text-caption-2-regular text-text-tertiary">British hip hop · London</p>
          </div>
          <button
            type="button"
            aria-pressed={following}
            onClick={() => setFollowing((current) => !current)}
            className={cx(following ? secondaryButton : primaryButton, "h-6 shrink-0 gap-1 px-1.5 text-caption-2-semibold")}
          >
            {following ? <RiCheckLine className="size-3" aria-hidden /> : <RiUserFollowLine className="size-3" aria-hidden />}
            {following ? "Following" : "Follow"}
          </button>
        </div>

        <p className="mt-1 text-caption-2-regular text-text-tertiary tabular-nums">
          <span key={followers} className="animate-label-in inline-block text-caption-2-semibold text-text-secondary motion-reduce:animate-none">
            {numberFormat.format(followers)}
          </span>{" "}
          monthly listeners
        </p>

        <div className="mt-1.5 flex items-center gap-1.5 rounded-md bg-background-secondary-default px-1.5 py-1">
          <RiMusic2Line className="size-3 shrink-0 text-accent-600" aria-hidden />
          <span className="min-w-0 flex-1 truncate text-caption-2-regular text-text-secondary">Top track · “Introvert”</span>
          <span className="shrink-0 text-caption-2-regular text-text-tertiary tabular-nums">4:12</span>
        </div>
      </div>
    </section>
  );
}

/* 8. Device Picker */

const DEVICES = [
  { id: "airpods", name: "AirPods Pro", detail: "Joseph’s · Bluetooth", icon: RiHeadphoneLine },
  { id: "living", name: "Living room", detail: "Sonos One · Wi-Fi", icon: RiSpeaker2Line },
  { id: "desk", name: "Studio desk", detail: "MacBook Pro · This browser", icon: RiComputerLine },
] as const;

type DeviceId = (typeof DEVICES)[number]["id"];

export function DevicePicker() {
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<DeviceId>("airpods");
  const [outputVolume, setOutputVolume] = useState(62);
  const current = DEVICES.find((device) => device.id === selected) ?? DEVICES[0];
  const CurrentIcon = current.icon;

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <section aria-label="Output device" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Output</h3>
        <span className="text-caption-2-medium text-text-tertiary">1 connected</span>
      </div>

      <div ref={rootRef} className="relative mt-1.5">
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className={cx(
            "flex w-full items-center gap-2 rounded-lg border border-border-button-default bg-background-primary-default px-2 py-1.5 text-start shadow-xs",
            "transition-[background-color,border-color] duration-150 ease-out hover:bg-background-primary-hover motion-reduce:transition-none",
            focusRing,
          )}
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-secondary-default text-foreground-icon-secondary">
            <CurrentIcon className="size-3.5" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-caption-2-regular text-text-tertiary">Playing on</span>
            <span className="block truncate text-caption-1-semibold text-text-primary">{current.name}</span>
          </span>
          <RiArrowDownSLine
            className={cx("size-3.5 shrink-0 text-foreground-icon-tertiary transition-transform duration-200 ease-out motion-reduce:transition-none", open && "rotate-180")}
            aria-hidden
          />
        </button>

        <div
          id={panelId}
          inert={!open}
          className={cx(
            "absolute inset-x-0 top-full z-20 mt-1 grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none",
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <div role="radiogroup" aria-label="Choose output device" className="rounded-lg border border-border-button-default bg-background-primary-default p-1 shadow-dropdown">
              {DEVICES.map((device) => {
                const Icon = device.icon;
                const checked = device.id === selected;
                return (
                  <button
                    key={device.id}
                    type="button"
                    role="radio"
                    aria-checked={checked}
                    onClick={() => {
                      setSelected(device.id);
                      setOpen(false);
                      triggerRef.current?.focus();
                    }}
                    className={cx(
                      "flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-start",
                      "transition-[background-color] duration-150 ease-out hover:bg-background-secondary-default motion-reduce:transition-none",
                      focusRing,
                    )}
                  >
                    <Icon className={cx("size-3.5 shrink-0", checked ? "text-accent-600" : "text-foreground-icon-tertiary")} aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-caption-1-medium text-text-primary">{device.name}</span>
                      <span className="block truncate text-caption-2-regular text-text-tertiary">{device.detail}</span>
                    </span>
                    {checked && (
                      <span className="flex shrink-0 items-center gap-1 text-caption-2-medium text-accent-600">
                        <RiCheckLine className="size-3" aria-hidden />
                        Connected
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-1.5 flex items-center gap-2">
        <RiVolumeUpLine className="size-3 shrink-0 text-foreground-icon-tertiary" aria-hidden />
        <Slider
          label={`${current.name} volume`}
          value={outputVolume}
          onChange={setOutputVolume}
          valueText={`${outputVolume} percent`}
        />
        <span className="w-6 shrink-0 text-end text-caption-2-regular text-text-tertiary tabular-nums">{outputVolume}%</span>
      </div>

      <p className="mt-1 text-caption-2-regular text-text-tertiary">New devices appear here over Wi-Fi.</p>
    </section>
  );
}

/* 9. Sleep Timer */

const SLEEP_PRESETS = [15, 30, 45, 60] as const;

export function SleepTimer() {
  const [minutes, setMinutes] = useState<number>(30);
  const [remaining, setRemaining] = useState(30 * 60);
  const [running, setRunning] = useState(false);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (!running) return;
    if (remaining <= 0) {
      setRunning(false);
      return;
    }
    const timer = window.setTimeout(() => setRemaining((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [running, remaining]);

  const total = minutes * 60;
  const progress = total === 0 ? 0 : (remaining / total) * 100;
  const done = remaining === 0;

  const choose = (value: number) => {
    setMinutes(value);
    setRemaining(value * 60);
  };

  const toggle = () => {
    if (done) {
      setRemaining(total);
      setRunning(true);
      return;
    }
    setRunning((current) => !current);
  };

  return (
    <section aria-label="Sleep timer" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-md bg-background-secondary-default text-accent-600">
          <RiMoonLine className="size-3.5" aria-hidden />
        </span>
        <h3 className="min-w-0 flex-1 text-body-2-semibold text-text-primary">Sleep timer</h3>
        <span
          aria-live="polite"
          className={cx(
            "rounded-full px-1.5 py-0.5 text-caption-2-medium transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
            running ? "bg-status-lime-background text-status-lime-text" : "bg-background-secondary-default text-text-tertiary",
          )}
        >
          {done ? "Ended" : running ? "Running" : remaining === total ? "Ready" : "Paused"}
        </span>
      </div>

      <div className="mt-1.5 flex items-center gap-2.5">
        <div className="relative size-14 shrink-0">
          <svg viewBox="0 0 36 36" className="size-14 -rotate-90" aria-hidden>
            <circle cx="18" cy="18" r="15.5" fill="none" strokeWidth="2.5" className="stroke-background-quaternary-default" />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              strokeWidth="2.5"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray={100}
              strokeDashoffset={100 - progress}
              className="stroke-accent-600 transition-[stroke-dashoffset] duration-200 ease-out motion-reduce:transition-none"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-caption-1-semibold text-text-primary tabular-nums">
            {formatTime(remaining)}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div role="group" aria-label="Timer duration" className="flex gap-1">
            {SLEEP_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                aria-pressed={minutes === preset}
                onClick={() => choose(preset)}
                className={cx(
                  "flex h-6 flex-1 items-center justify-center rounded-md text-caption-2-semibold tabular-nums",
                  "transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                  focusRing,
                  minutes === preset
                    ? "bg-background-secondary-default text-text-primary shadow-xs"
                    : "text-text-tertiary hover:text-text-secondary",
                )}
              >
                {preset}m
              </button>
            ))}
          </div>
          <p className="mt-1 text-caption-2-regular text-text-tertiary">Playback pauses when this ends.</p>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <button
          type="button"
          role="switch"
          aria-checked={fade}
          onClick={() => setFade((current) => !current)}
          className={cx("flex min-w-0 items-center gap-1.5 text-caption-2-medium text-text-secondary", focusRing)}
        >
          <span
            className={cx(
              "relative h-4 w-7 shrink-0 rounded-full transition-[background-color] duration-200 ease-out motion-reduce:transition-none",
              fade ? "bg-accent-600" : "bg-background-quaternary-default",
            )}
            aria-hidden
          >
            <span
              className={cx(
                "absolute top-0.5 size-3 rounded-full bg-background-primary-default shadow-xs",
                "transition-[inset-inline-start] duration-200 ease-out motion-reduce:transition-none",
                fade ? "start-3.5" : "start-0.5",
              )}
            />
          </span>
          <span className="truncate">Fade out last 30 s</span>
        </button>
        <button type="button" onClick={toggle} className={cx(primaryButton, "h-6 shrink-0 gap-1 text-caption-2-semibold")}>
          {done ? <RiRefreshLine className="size-3" aria-hidden /> : running ? <RiPauseFill className="size-3" aria-hidden /> : <RiTimerLine className="size-3" aria-hidden />}
          {done ? "Restart" : running ? "Pause" : "Start"}
        </button>
      </div>
    </section>
  );
}

/* 10. Volume Mixer */

const APPS = [
  { id: "spotify", name: "Spotify", detail: "Now playing · Teardrop", icon: RiMusic2Line, level: 72 },
  { id: "safari", name: "Safari", detail: "2 tabs open", icon: RiGlobalLine, level: 45 },
  { id: "zoom", name: "Zoom", detail: "Call waiting", icon: RiVideoChatLine, level: 88 },
] as const;

type AppId = (typeof APPS)[number]["id"];

const APP_LEVELS = Object.fromEntries(APPS.map((app) => [app.id, app.level] as const)) as Record<AppId, number>;
const APP_MUTED: Record<AppId, boolean> = { spotify: false, safari: false, zoom: true };

export function VolumeMixer() {
  const [levels, setLevels] = useState<Record<AppId, number>>(APP_LEVELS);
  const [muted, setMuted] = useState<Record<AppId, boolean>>(APP_MUTED);

  const setLevel = (id: AppId, value: number) => {
    setLevels((current) => ({ ...current, [id]: value }));
  };

  return (
    <section aria-label="App volume mixer" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">App volume</h3>
        <span className="text-caption-2-medium text-text-tertiary">{APPS.length} apps</span>
      </div>

      <ul className="mt-1 divide-y divide-separator-border">
        {APPS.map((app) => {
          const Icon = app.icon;
          const isMuted = muted[app.id];
          const level = levels[app.id];
          return (
            <li
              key={app.id}
              className={cx(
                "flex items-center gap-2 py-1.5 transition-opacity duration-200 ease-out motion-reduce:transition-none",
                isMuted && "opacity-60",
              )}
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-secondary-default text-foreground-icon-secondary">
                <Icon className="size-3.5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-caption-1-semibold text-text-primary">{app.name}</span>
                  <span className="shrink-0 text-caption-2-regular text-text-tertiary tabular-nums">
                    {isMuted ? "Muted" : `${level}%`}
                  </span>
                </div>
                <Slider
                  label={`${app.name} volume`}
                  value={isMuted ? 0 : level}
                  onChange={(value) => setLevel(app.id, value)}
                  disabled={isMuted}
                  valueText={isMuted ? "Muted" : `${level} percent`}
                />
                <span className="sr-only">{app.detail}</span>
              </div>
              <button
                type="button"
                aria-label={isMuted ? `Unmute ${app.name}` : `Mute ${app.name}`}
                aria-pressed={isMuted}
                onClick={() => setMuted((current) => ({ ...current, [app.id]: !current[app.id] }))}
                className={cx(iconButton, "size-6")}
              >
                {isMuted ? <RiVolumeMuteLine className="size-3.5" aria-hidden /> : <RiVolumeUpLine className="size-3.5" aria-hidden />}
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-1 text-caption-2-regular text-text-tertiary">Muting keeps the last set level.</p>
    </section>
  );
}

/* 11. Song Credits */

const CREDITS = [
  { label: "Writers", value: "Robert Del Naja, Grant Marshall, Andrew Vowles, Elizabeth Fraser" },
  { label: "Producers", value: "Massive Attack, Neil Davidge" },
  { label: "Label", value: "Virgin Records" },
] as const;

const EXTRA_CREDITS = [
  { label: "Mix", value: "Mark “Spike” Stent" },
  { label: "Mastering", value: "Tim Young, Metropolis" },
] as const;

export function SongCredits() {
  const detailId = useId();
  const [open, setOpen] = useState(false);

  return (
    <section aria-label="Song credits" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background-secondary-default text-accent-600">
          <RiDiscLine className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">Song credits</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">Teardrop · Massive Attack</p>
        </div>
        <span className="rounded-full border border-border-button-default px-1.5 py-0.5 text-caption-2-medium text-text-tertiary">1998</span>
      </div>

      <dl className="mt-1.5 grid grid-cols-[54px_1fr] gap-x-2 gap-y-1">
        {CREDITS.map((credit) => (
          <div key={credit.label} className="contents">
            <dt className="text-caption-2-medium text-text-tertiary">{credit.label}</dt>
            <dd className="text-caption-1-regular text-text-secondary">{credit.value}</dd>
          </div>
        ))}
      </dl>

      <div
        id={detailId}
        inert={!open}
        className={cx(
          "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <dl className="grid grid-cols-[54px_1fr] gap-x-2 gap-y-1 pt-1">
            {EXTRA_CREDITS.map((credit) => (
              <div key={credit.label} className="contents">
                <dt className="text-caption-2-medium text-text-tertiary">{credit.label}</dt>
                <dd className="text-caption-1-regular text-text-secondary">{credit.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <button
        type="button"
        aria-expanded={open}
        aria-controls={detailId}
        onClick={() => setOpen((current) => !current)}
        className={cx("mt-1 flex h-6 items-center gap-1 text-caption-2-semibold text-accent-600", focusRing)}
      >
        {open ? "Hide mix credits" : "Show mix credits"}
        <RiArrowDownSLine
          className={cx("size-3 transition-transform duration-200 ease-out motion-reduce:transition-none", open && "rotate-180")}
          aria-hidden
        />
      </button>
    </section>
  );
}

/* 12. Listening Stats */

const LISTENING = {
  week: { minutes: 412, genre: "Shoegaze", share: 38, streak: 12, days: [42, 58, 31, 74, 96, 51, 60] },
  month: { minutes: 1284, genre: "Dream pop", share: 31, streak: 12, days: [148, 176, 132, 201, 224, 187, 216] },
} as const;

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

type RangeKey = keyof typeof LISTENING;

export function ListeningStats() {
  const [range, setRange] = useState<RangeKey>("week");
  const [day, setDay] = useState(4);
  const data = LISTENING[range];
  const peak = Math.max(...data.days);

  return (
    <section aria-label="Listening stats" className={cx(cardSurface, "max-w-[520px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Listening</h3>
        <div role="group" aria-label="Reporting range" className="flex rounded-lg bg-background-secondary-default p-0.5">
          {(["week", "month"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={range === option}
              onClick={() => setRange(option)}
              className={cx(
                "rounded-md px-1.5 py-0.5 text-caption-2-semibold transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                range === option ? "bg-background-primary-default text-text-primary shadow-xs" : "text-text-tertiary hover:text-text-secondary",
              )}
            >
              {option === "week" ? "This week" : "Last month"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2 grid grid-cols-[minmax(0,150px)_1fr] gap-3">
        <div className="min-w-0">
          <p className="text-caption-2-medium tracking-wide text-text-tertiary uppercase">Minutes played</p>
          <p key={`${range}-minutes`} className="animate-label-in text-title-2-semibold text-text-primary tabular-nums motion-reduce:animate-none">
            {numberFormat.format(data.minutes)}
          </p>

          <div className="mt-1.5">
            <p className="flex items-baseline justify-between gap-2 text-caption-2-regular text-text-tertiary">
              <span>Top genre</span>
              <span className="truncate text-caption-2-semibold text-text-secondary">{data.genre}</span>
            </p>
            <div
              role="progressbar"
              aria-label={`${data.genre} share`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={data.share}
              className="mt-1 h-1 overflow-hidden rounded-full bg-background-quaternary-default"
            >
              <div
                className="h-full rounded-full bg-accent-500 transition-[width] duration-200 ease-out motion-reduce:transition-none"
                style={{ width: `${data.share}%` }}
              />
            </div>
          </div>

          <p className="mt-1.5 flex items-center gap-1 text-caption-2-medium text-status-orange-text">
            <RiFireLine className="size-3" aria-hidden />
            {data.streak}-week streak
          </p>
        </div>

        <div className="min-w-0">
          <p aria-live="polite" className="truncate text-caption-2-regular text-text-tertiary tabular-nums">
            <span key={`${range}-${day}`} className="animate-label-in inline-block motion-reduce:animate-none">
              {DAYS[day]} · {data.days[day]} min
            </span>
          </p>
          <div className="mt-1 flex h-16 items-end gap-1">
            {data.days.map((value, index) => (
              <button
                key={DAYS[index]}
                type="button"
                aria-label={`${DAYS[index]}: ${value} minutes`}
                aria-pressed={day === index}
                onClick={() => setDay(index)}
                onFocus={() => setDay(index)}
                onMouseEnter={() => setDay(index)}
                className={cx("group flex h-full flex-1 flex-col justify-end rounded-sm", focusRing)}
              >
                <span
                  className={cx(
                    "w-full rounded-t-sm transition-[height,background-color] duration-200 ease-out motion-reduce:transition-none",
                    day === index ? "bg-accent-600" : "bg-accent-500/35 group-hover:bg-accent-500/60",
                  )}
                  style={{ height: `${Math.max(10, (value / peak) * 100)}%` }}
                />
              </button>
            ))}
          </div>
          <div className="mt-1 flex gap-1">
            {DAYS.map((label) => (
              <span key={label} className="flex-1 text-center text-caption-2-regular text-text-tertiary">
                {label.slice(0, 1)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Section */

export const MUSIC_SECTION: ExtendedSection = {
  id: "music",
  title: "Music",
  blurb: "Playback, queues and the sound around them.",
  file: "music.tsx",
  entries: [
    { name: "Now Playing", description: "Track, artist and a scrubber that keeps time.", Demo: NowPlaying },
    { name: "Queue Row", description: "Up-next tracks that reorder and remove.", Demo: QueueRow },
    { name: "Playlist Card", description: "A token-built cover, track count and play.", Demo: PlaylistCard },
    { name: "Equalizer", description: "Five-band gain with a flat reset.", Demo: Equalizer },
    { name: "Lyric Line", description: "Synced lines with the current one in focus.", Demo: LyricLine },
    { name: "Album Grid", description: "Select an album, then play it on hover.", Demo: AlbumGrid },
    { name: "Artist Card", description: "Followers and a follow toggle that counts.", Demo: ArtistCard },
    { name: "Device Picker", description: "Outputs with the connected one marked.", Demo: DevicePicker },
    { name: "Sleep Timer", description: "Duration, fade-out and a live countdown.", Demo: SleepTimer },
    { name: "Volume Mixer", description: "Per-app levels with independent mutes.", Demo: VolumeMixer },
    { name: "Song Credits", description: "Writers, producers, label and mix details.", Demo: SongCredits },
    { name: "Listening Stats", description: "Minutes, top genre and a weekly streak.", Demo: ListeningStats, wide: true },
  ],
};
