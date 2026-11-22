"use client";

import { useEffect, useRef, useState } from "react";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCheckLine,
  RiCloseLine,
  RiDownloadLine,
  RiFullscreenLine,
  RiImageAddLine,
  RiMoreLine,
  RiMusicLine,
  RiPauseFill,
  RiPlayFill,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* -------------------------------------------------------------------------- */
/*  Image gallery                                                              */
/* -------------------------------------------------------------------------- */

const GALLERY = [
  { title: "Dawn patrol", meta: "35mm · f/2.8 · 1/250", gradient: "bg-linear-to-br from-accent-700 via-chart-5 to-chart-3" },
  { title: "Loading bay", meta: "50mm · f/1.8 · 1/125", gradient: "bg-linear-to-br from-chart-2 via-accent-500 to-chart-4" },
  { title: "Rooftop chase", meta: "85mm · f/2.0 · 1/500", gradient: "bg-linear-to-br from-chart-3 via-chart-5 to-accent-800" },
  { title: "Cold storage", meta: "24mm · f/4.0 · 1/60", gradient: "bg-linear-to-br from-chart-4 via-accent-600 to-chart-1" },
  { title: "Alley mouth", meta: "35mm · f/2.2 · 1/200", gradient: "bg-linear-to-br from-accent-900 via-chart-3 to-chart-2" },
  { title: "Last light", meta: "50mm · f/2.8 · 1/160", gradient: "bg-linear-to-br from-chart-1 via-accent-500 to-chart-5" },
];

export function ImageGallery() {
  const [selected, setSelected] = useState(0);
  const active = GALLERY[selected];

  return (
    <figure className="w-full max-w-[320px] overflow-hidden rounded-xl border border-border-button-default bg-background-primary-default shadow-xs">
      <div className="grid grid-cols-3 gap-1.5 p-2" role="group" aria-label="Contact sheet">
        {GALLERY.map((frame, index) => {
          const isSelected = index === selected;
          return (
            <button
              key={frame.title}
              type="button"
              aria-label={`Select ${frame.title}`}
              aria-pressed={isSelected}
              onClick={() => setSelected(index)}
              className={cx(
                "group relative aspect-square overflow-hidden rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary-default",
                frame.gradient,
                isSelected
                  ? "ring-2 ring-border-focus-ring ring-offset-2 ring-offset-background-primary-default"
                  : "ring-1 ring-inset ring-border-button-default hover:ring-border-button-hover",
              )}
            >
              <span
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-accent-950/50 via-transparent to-transparent opacity-0 transition-opacity duration-150 ease group-hover:opacity-100"
              />
              {isSelected && (
                <span className="absolute end-1 top-1 flex size-4 items-center justify-center rounded-full bg-background-primary-default text-text-primary shadow-xs">
                  <RiCheckLine className="size-3" aria-hidden />
                </span>
              )}
            </button>
          );
        })}
      </div>
      <figcaption className="flex items-center justify-between gap-2 border-t border-separator-border px-2.5 py-2">
        <span className="flex min-w-0 flex-col" aria-live="polite">
          <span className="truncate text-body-2-medium text-text-primary">{active.title}</span>
          <span className="truncate text-caption-2-regular text-text-tertiary">{active.meta}</span>
        </span>
        <span className="shrink-0 text-caption-1-regular text-text-tertiary tabular-nums">
          {selected + 1} / {GALLERY.length}
        </span>
      </figcaption>
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/*  Lightbox                                                                   */
/* -------------------------------------------------------------------------- */

const LIGHTBOX = [
  { title: "Rooftop at 06:12", meta: "35mm · ISO 400 · 1/250", gradient: "bg-linear-to-br from-accent-800 via-chart-5 to-chart-4" },
  { title: "Stairwell, east wing", meta: "50mm · ISO 800 · 1/60", gradient: "bg-linear-to-br from-chart-3 via-accent-700 to-chart-1" },
  { title: "Harbour fog", meta: "85mm · ISO 200 · 1/500", gradient: "bg-linear-to-br from-chart-4 via-chart-1 to-accent-600" },
  { title: "Last train home", meta: "24mm · ISO 1600 · 1/30", gradient: "bg-linear-to-br from-accent-900 via-chart-3 to-chart-2" },
];

export function Lightbox() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setIndex((current) => (current - 1 + LIGHTBOX.length) % LIGHTBOX.length);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setIndex((current) => (current + 1) % LIGHTBOX.length);
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const step = (delta: number) => setIndex((current) => (current + delta + LIGHTBOX.length) % LIGHTBOX.length);
  const active = LIGHTBOX[index];

  return (
    <>
      <div className="w-full max-w-[320px]">
        <button
          type="button"
          onClick={() => {
            setIndex(0);
            setOpen(true);
          }}
          aria-label={`Open image viewer: ${LIGHTBOX[0].title}, ${LIGHTBOX.length} stills`}
          className="group relative block w-full overflow-hidden rounded-xl border border-border-button-default bg-background-primary-default text-start shadow-xs transition-shadow duration-150 ease hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background-full"
        >
          <span aria-hidden className={cx("block aspect-[16/10] w-full", LIGHTBOX[0].gradient)} />
          <span aria-hidden className="absolute inset-0 bg-linear-to-t from-accent-950/50 via-transparent to-transparent" />
          <span className="absolute start-2 top-2 inline-flex items-center gap-1 rounded-md bg-background-primary-default/90 px-1.5 py-0.5 text-caption-2-regular text-text-secondary shadow-xs backdrop-blur-sm">
            <RiFullscreenLine className="size-3" aria-hidden /> Expand
          </span>
          <span className="absolute bottom-2 end-2 rounded-md bg-background-primary-default/90 px-1.5 py-0.5 text-caption-2-regular text-text-secondary shadow-xs backdrop-blur-sm">
            {LIGHTBOX.length} stills
          </span>
        </button>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <span className="truncate text-body-2-medium text-text-primary">{LIGHTBOX[0].title}</span>
          <span className="shrink-0 text-caption-2-regular text-text-tertiary tabular-nums">
            Shot 01 / {String(LIGHTBOX.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {open && (
        <div
          role="presentation"
          onPointerDown={() => setOpen(false)}
          className="fixed inset-0 z-50 grid place-items-center bg-background-full/80 p-4 backdrop-blur-sm"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
            onPointerDown={(event) => event.stopPropagation()}
            className="flex max-h-[calc(100dvh-2rem)] w-full max-w-[560px] flex-col overflow-y-auto overscroll-contain rounded-xl border border-border-button-default bg-background-primary-default shadow-xl"
          >
            <div className="flex shrink-0 items-center justify-between gap-2 border-b border-separator-border px-3 py-1.5">
              <span className="text-caption-1-regular text-text-tertiary tabular-nums">
                {String(index + 1).padStart(2, "0")} / {String(LIGHTBOX.length).padStart(2, "0")}
              </span>
              <button
                ref={closeRef}
                type="button"
                aria-label="Close image viewer"
                onClick={() => setOpen(false)}
                className="flex size-7 items-center justify-center rounded-md text-foreground-icon-secondary transition-colors duration-150 ease hover:bg-background-tertiary-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                <RiCloseLine className="size-4" aria-hidden />
              </button>
            </div>

            <div className={cx("relative aspect-[4/3] w-full shrink-0", active.gradient)}>
              <span aria-hidden className="absolute inset-0 bg-linear-to-t from-accent-950/40 via-transparent to-transparent" />
              <button
                type="button"
                aria-label="Previous image"
                onClick={() => step(-1)}
                className="absolute start-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-background-primary-default/90 text-text-primary shadow-sm backdrop-blur-sm transition-colors duration-150 ease hover:bg-background-primary-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                <RiArrowLeftSLine className="size-5 rtl:-scale-x-100" aria-hidden />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={() => step(1)}
                className="absolute end-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-background-primary-default/90 text-text-primary shadow-sm backdrop-blur-sm transition-colors duration-150 ease hover:bg-background-primary-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                <RiArrowRightSLine className="size-5 rtl:-scale-x-100" aria-hidden />
              </button>
              <span className="absolute bottom-2 start-2 rounded-md bg-background-primary-default/90 px-1.5 py-0.5 text-caption-2-regular text-text-secondary shadow-xs backdrop-blur-sm">
                {active.meta}
              </span>
            </div>

            <div className="flex shrink-0 items-center justify-between gap-3 px-3 py-2.5">
              <div className="flex min-w-0 flex-col" aria-live="polite">
                <p className="truncate text-headline-medium text-text-primary">{active.title}</p>
                <p className="truncate text-caption-2-regular text-text-tertiary">
                  Frame {index + 1} of {LIGHTBOX.length} · 6000 × 4000
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1" aria-hidden>
                {LIGHTBOX.map((frame, dot) => (
                  <span
                    key={frame.title}
                    className={cx(
                      "h-1 rounded-full transition-[width,background-color] duration-150 ease",
                      dot === index ? "w-3 bg-accent-500" : "w-1 bg-foreground-icon-quaternary",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Audio waveform                                                             */
/* -------------------------------------------------------------------------- */

const WAVE_HEIGHTS = [
  12, 20, 34, 48, 30, 18, 26, 40, 54, 44, 28, 16,
  22, 36, 50, 42, 26, 14, 20, 32, 46, 56, 38, 24,
  16, 28, 44, 52, 40, 26, 18, 30, 42, 50, 36, 22,
  14, 24, 38, 48, 34, 20, 16, 28, 40, 30, 18, 12,
];

const WAVE_PLAYED = Math.round(WAVE_HEIGHTS.length * 0.38);

export function AudioWaveform() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="w-full max-w-[320px] rounded-xl border border-border-button-default bg-background-primary-default p-3 shadow-xs">
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-accent-600 to-chart-5 text-text-white shadow-xs"
        >
          <RiMusicLine className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-body-2-medium text-text-primary">Harbour fog (field take)</p>
          <p className="truncate text-caption-2-regular text-text-tertiary">Field recording · 48 kHz WAV</p>
        </div>
        <button
          type="button"
          aria-label={playing ? "Pause preview" : "Play preview"}
          aria-pressed={playing}
          onClick={() => setPlaying((next) => !next)}
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-button-primary text-text-white shadow-xs transition-opacity duration-150 ease hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary-default"
        >
          {playing ? (
            <RiPauseFill className="size-4" aria-hidden />
          ) : (
            <RiPlayFill className="ms-0.5 size-4" aria-hidden />
          )}
        </button>
      </div>

      <div
        role="img"
        aria-label="Waveform, 1 minute 14 seconds played of 3 minutes 18 seconds"
        className="relative mt-3 h-14"
        dir="ltr"
      >
        <svg viewBox="0 0 288 64" preserveAspectRatio="none" className="size-full" aria-hidden>
          {WAVE_HEIGHTS.map((height, index) => (
            <rect
              key={index}
              x={index * 6 + 1.5}
              y={(64 - height) / 2}
              width={3}
              height={height}
              rx={1.5}
              className={index < WAVE_PLAYED ? "fill-accent-500" : "fill-foreground-icon-tertiary"}
            />
          ))}
        </svg>
        <span aria-hidden className="absolute inset-y-0 start-[38%] w-px -translate-x-1/2 bg-accent-500">
          <span className="absolute top-0 start-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-500 ring-2 ring-background-primary-default" />
        </span>
      </div>

      <div className="mt-1 flex items-center justify-between text-caption-2-regular text-text-tertiary tabular-nums" dir="ltr">
        <span>1:14</span>
        <span>3:18</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Video card                                                                 */
/* -------------------------------------------------------------------------- */

export function VideoCard() {
  const [playing, setPlaying] = useState(false);

  return (
    <article className="w-full max-w-[320px] overflow-hidden rounded-xl border border-border-button-default bg-background-primary-default shadow-xs">
      <div className="group relative aspect-video overflow-hidden bg-linear-to-br from-accent-900 via-chart-5 to-chart-3">
        <span aria-hidden className="absolute inset-0 bg-linear-to-t from-accent-950/70 via-transparent to-transparent" />
        <span className="absolute start-2 top-2 rounded-sm bg-background-primary-default/90 px-1 py-0.5 text-caption-2-regular text-text-secondary shadow-xs backdrop-blur-sm">
          4K
        </span>
        <span className="absolute bottom-2 end-2 rounded-sm bg-background-primary-default/90 px-1 py-0.5 text-caption-2-regular text-text-secondary tabular-nums shadow-xs backdrop-blur-sm">
          12:48
        </span>
        <span className="absolute bottom-2 start-2 text-caption-2-regular text-text-white/70">SCENE 04</span>
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            type="button"
            aria-label={playing ? "Pause Color grade: neon district" : "Play Color grade: neon district"}
            aria-pressed={playing}
            onClick={() => setPlaying((next) => !next)}
            className="flex size-10 items-center justify-center rounded-full bg-background-primary-default/90 text-text-primary shadow-sm backdrop-blur-sm transition-[background-color,transform] duration-150 ease group-hover:scale-105 hover:bg-background-primary-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary-default"
          >
            {playing ? (
              <RiPauseFill className="size-4" aria-hidden />
            ) : (
              <RiPlayFill className="ms-0.5 size-4" aria-hidden />
            )}
          </button>
        </div>
      </div>
      <div className="flex items-start gap-2 px-2.5 py-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-body-2-medium text-text-primary">Color grade: neon district</p>
          <p className="mt-0.5 truncate text-caption-2-regular text-text-tertiary">Editrim Studio · 4 days ago</p>
        </div>
        <button
          type="button"
          aria-label="More actions for Color grade: neon district"
          className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-icon-secondary transition-colors duration-150 ease hover:bg-background-primary-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          <RiMoreLine className="size-4" aria-hidden />
        </button>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Avatar uploader                                                            */
/* -------------------------------------------------------------------------- */

const PORTRAITS = [
  { initials: "MC", gradient: "bg-linear-to-br from-accent-600 via-chart-5 to-chart-3" },
  { initials: "MC", gradient: "bg-linear-to-br from-chart-4 via-accent-600 to-chart-5" },
];

export function AvatarUploader() {
  const [portrait, setPortrait] = useState<number | null>(0);
  const active = portrait === null ? null : PORTRAITS[portrait];

  const cyclePortrait = () => setPortrait((current) => (current === null ? 0 : (current + 1) % PORTRAITS.length));

  return (
    <div className="w-full max-w-[320px] rounded-xl border border-border-button-default bg-background-primary-default p-3 shadow-xs">
      <div className="flex items-center justify-between gap-2">
        <p className="text-body-2-medium text-text-primary">Profile photo</p>
        <span aria-live="polite" className="text-caption-2-regular text-text-tertiary">
          {active ? "Ready" : "No photo"}
        </span>
      </div>

      <button
        type="button"
        onClick={cyclePortrait}
        aria-label={active ? "Replace profile photo" : "Add a profile photo"}
        className="group mt-2 flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-border-button-default bg-background-secondary-default/60 px-3 py-4 transition-colors duration-150 ease hover:border-border-button-hover hover:bg-background-secondary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
      >
        <span className="relative">
          {active ? (
            <span
              className={cx(
                "flex size-14 items-center justify-center rounded-full text-headline-medium text-text-white shadow-xs ring-2 ring-background-primary-default",
                active.gradient,
              )}
            >
              {active.initials}
            </span>
          ) : (
            <span className="flex size-14 items-center justify-center rounded-full border border-border-button-default bg-background-tertiary-default text-foreground-icon-tertiary">
              <RiImageAddLine className="size-5" aria-hidden />
            </span>
          )}
          {active && (
            <span className="absolute -bottom-0.5 -end-0.5 flex size-5 items-center justify-center rounded-full bg-background-primary-default text-accent-600 shadow-xs ring-1 ring-border-button-default">
              <RiCheckLine className="size-3" aria-hidden />
            </span>
          )}
        </span>
        <span className="flex flex-col items-center gap-0.5 text-center">
          <span className="text-body-2-medium text-text-primary">{active ? "Drop a new portrait" : "Add a portrait"}</span>
          <span className="text-caption-2-regular text-text-tertiary">or click to browse</span>
        </span>
      </button>

      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
        <span className="text-caption-2-regular text-text-tertiary">JPG, PNG, WebP · 5 MB max</span>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={cyclePortrait}
            aria-label={active ? "Change profile photo" : "Add profile photo"}
            className="h-7 rounded-md border border-border-button-default bg-background-primary-default px-2 text-body-2-medium text-text-secondary shadow-xs transition-colors duration-150 ease hover:bg-background-primary-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            {active ? "Change" : "Add"}
          </button>
          <button
            type="button"
            onClick={() => setPortrait(null)}
            disabled={active === null}
            aria-label="Remove profile photo"
            className="h-7 rounded-md px-2 text-body-2-medium text-text-secondary transition-colors duration-150 ease hover:bg-background-tertiary-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:pointer-events-none disabled:text-text-tertiary"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Media object                                                               */
/* -------------------------------------------------------------------------- */

const MEDIA_ROWS = [
  { initials: "MC", title: "Contact sheet — Night shoot", meta: "PNG · 24 frames · 2h ago", gradient: "bg-linear-to-br from-accent-600 to-chart-5" },
  { initials: "JR", title: "Rooftop B-roll", meta: "MP4 · 1.2 GB · Yesterday", gradient: "bg-linear-to-br from-chart-4 to-accent-800" },
  { initials: "PN", title: "Arena ambience", meta: "WAV · 3:18 · Mon", gradient: "bg-linear-to-br from-chart-3 to-accent-700" },
];

export function MediaObject() {
  return (
    <div className="w-full max-w-[320px] overflow-hidden rounded-xl border border-border-button-default bg-background-primary-default shadow-xs">
      <div className="flex items-center justify-between gap-2 border-b border-separator-border px-2.5 py-2">
        <p className="text-body-2-medium text-text-primary">Recent media</p>
        <span className="text-caption-2-regular text-text-tertiary tabular-nums">{MEDIA_ROWS.length} items</span>
      </div>
      <ul className="divide-y divide-separator-border">
        {MEDIA_ROWS.map((row) => (
          <li
            key={row.title}
            className="flex items-center gap-2.5 px-2.5 py-2 transition-colors duration-150 ease hover:bg-background-primary-hover"
          >
            <span
              aria-hidden
              className={cx(
                "flex size-8 shrink-0 items-center justify-center rounded-full text-caption-1-regular text-text-white shadow-xs",
                row.gradient,
              )}
            >
              {row.initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-body-2-medium text-text-primary">{row.title}</p>
              <p className="truncate text-caption-2-regular text-text-tertiary">{row.meta}</p>
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                aria-label={`Download ${row.title}`}
                className="flex size-6 items-center justify-center rounded-md text-foreground-icon-secondary transition-colors duration-150 ease hover:bg-background-tertiary-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                <RiDownloadLine className="size-3.5" aria-hidden />
              </button>
              <button
                type="button"
                aria-label={`More actions for ${row.title}`}
                className="flex size-6 items-center justify-center rounded-md text-foreground-icon-secondary transition-colors duration-150 ease hover:bg-background-tertiary-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                <RiMoreLine className="size-4" aria-hidden />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Specimens                                                                  */
/* -------------------------------------------------------------------------- */

export const MEDIA_SECTION: ExtendedSection = {
  id: "media",
  title: "Media",
  blurb: "Stills, clips and sound, with the controls that make them feel playable.",
  file: "media.tsx",
  entries: [
    { name: "Image Gallery", description: "A 2×3 contact sheet with one frame selected and a counter.", Demo: ImageGallery },
    { name: "Lightbox", description: "A full-screen viewer with arrows, a counter and Escape to close.", Demo: Lightbox },
    { name: "Audio Waveform", description: "A played/unplayed split under a draggable-looking playhead.", Demo: AudioWaveform },
    { name: "Video Card", description: "A 16:9 poster with a play control, duration and metadata.", Demo: VideoCard },
    { name: "Avatar Uploader", description: "A dashed drop zone with a preview, change and remove.", Demo: AvatarUploader },
    { name: "Media Object", description: "A file row with an owner, metadata and trailing actions.", Demo: MediaObject },
  ],
};
