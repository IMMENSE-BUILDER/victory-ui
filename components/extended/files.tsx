"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ComponentType, RefObject } from "react";
import {
  RiArrowDownSLine,
  RiArrowLeftLine,
  RiArrowRightSLine,
  RiCheckLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiEyeLine,
  RiFileCopyLine,
  RiFilePdf2Line,
  RiFileTextLine,
  RiFileZipLine,
  RiFolderLine,
  RiFolderOpenLine,
  RiHardDrive2Line,
  RiImageLine,
  RiInboxUnarchiveLine,
  RiLayoutGridLine,
  RiLinkM,
  RiListUnordered,
  RiMore2Line,
  RiPauseLine,
  RiPencilLine,
  RiPlayLine,
  RiRefreshLine,
  RiStarLine,
  RiSubtractLine,
  RiUploadCloud2Line,
  RiVideoLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* Shared anatomy */

type IconComponent = ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";
const card = "w-full rounded-xl border border-border-button-default bg-background-primary-default shadow-card";
const buttonBase =
  "inline-flex items-center justify-center gap-1 rounded-lg text-caption-2-semibold transition-[transform,opacity,background-color,color,box-shadow] duration-150 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:scale-100";
const primaryButton = cx(buttonBase, "h-6 bg-button-primary px-2 text-text-white shadow-xs", focusRing);
const secondaryButton = cx(
  buttonBase,
  "h-6 border border-border-button-default bg-background-primary-default px-2 text-text-primary shadow-xs hover:bg-background-primary-hover",
  focusRing,
);
const quietButton = cx(buttonBase, "h-6 px-1.5 text-text-secondary hover:bg-background-secondary-default hover:text-text-primary", focusRing);
const iconButton = cx(
  "flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-icon-tertiary transition-[background-color,color] duration-150 ease-out hover:bg-background-tertiary-default hover:text-text-primary motion-reduce:transition-none",
  focusRing,
);
const revealGrid = "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none";

/** Close a menu, confirm or drawer on an outside pointer or Escape. */
function useDismiss(ref: RefObject<HTMLElement | null>, active: boolean, onDismiss: () => void, returnFocus?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!active) return;
    const onPointer = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) onDismiss();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onDismiss();
        returnFocus?.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [ref, active, onDismiss, returnFocus]);
}

type FileKind = "pdf" | "doc" | "image" | "video" | "zip";

const KIND: Record<FileKind, { icon: IconComponent; tone: string }> = {
  pdf: { icon: RiFilePdf2Line, tone: "bg-status-rose-background text-status-rose-text" },
  doc: { icon: RiFileTextLine, tone: "bg-status-blue-background text-status-blue-text" },
  image: { icon: RiImageLine, tone: "bg-status-cyan-background text-status-cyan-text" },
  video: { icon: RiVideoLine, tone: "bg-status-purple-background text-status-purple-text" },
  zip: { icon: RiFileZipLine, tone: "bg-status-yellow-background text-status-yellow-text" },
};

function FileGlyph({ kind, className }: { kind: FileKind; className?: string }) {
  const Icon = KIND[kind].icon;
  return (
    <span className={cx("flex size-7 shrink-0 items-center justify-center rounded-md", KIND[kind].tone, className)}>
      <Icon className="size-3.5" aria-hidden />
    </span>
  );
}

function MenuItem({ icon: Icon, label, danger, onSelect }: { icon: IconComponent; label: string; danger?: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onSelect}
      className={cx(
        "flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-start text-caption-2-medium transition-colors duration-150 ease-out hover:bg-dropdown-item-hover-background motion-reduce:transition-none",
        danger ? "text-text-destructive" : "text-text-primary",
        focusRing,
      )}
    >
      <Icon className="size-3.5 shrink-0" aria-hidden />
      {label}
    </button>
  );
}

/* 1. File Grid */

type GridFile = { id: string; name: string; ext: string; size: string; kind: FileKind };

const GRID_FILES: GridFile[] = [
  { id: "brief", name: "Q4-launch-brief", ext: "PDF", size: "2.4 MB", kind: "pdf" },
  { id: "hero", name: "hero-frame-04", ext: "PNG", size: "8.1 MB", kind: "image" },
  { id: "teaser", name: "launch-teaser", ext: "MP4", size: "64 MB", kind: "video" },
  { id: "brand", name: "brand-assets", ext: "ZIP", size: "18 MB", kind: "zip" },
];
export function FileGrid() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [files, setFiles] = useState<GridFile[]>([...GRID_FILES]);
  const [selected, setSelected] = useState<string[]>([]);
  const [menu, setMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useDismiss(menuRef, menu !== null, () => setMenu(null), triggerRef);
  const toggle = (id: string) =>
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  const remove = (id: string) => {
    setFiles((current) => current.filter((file) => file.id !== id));
    setSelected((current) => current.filter((item) => item !== id));
    setMenu(null);
  };
  const actions = (file: GridFile) => (
    <div ref={menu === file.id ? menuRef : undefined} className="relative">
      <button type="button" ref={menu === file.id ? triggerRef : undefined} aria-label={`Actions for ${file.name}.${file.ext.toLowerCase()}`} aria-haspopup="menu" aria-expanded={menu === file.id}
        onClick={() => setMenu(menu === file.id ? null : file.id)} className={cx(iconButton, "size-5 rounded-sm")}>
        <RiMore2Line className="size-3.5" aria-hidden />
      </button>
      {menu === file.id && (
        <div role="menu" aria-label={`Actions for ${file.name}`}
          className="absolute end-0 top-[calc(100%+4px)] z-30 w-32 animate-label-in rounded-lg border border-border-button-default bg-background-primary-default p-1 shadow-dropdown motion-reduce:animate-none">
          <MenuItem icon={RiCheckLine} label={selected.includes(file.id) ? "Deselect" : "Select"}
            onSelect={() => { toggle(file.id); setMenu(null); triggerRef.current?.focus(); }} />
          <MenuItem icon={RiDeleteBinLine} label="Remove" danger onSelect={() => remove(file.id)} />
        </div>
      )}
    </div>
  );
  const viewButton = (mode: "grid" | "list", label: string, Icon: IconComponent) => (
    <button
      type="button"
      aria-label={label}
      aria-pressed={view === mode}
      onClick={() => {
        setView(mode);
        setMenu(null);
      }}
      className={cx(
        "flex size-5 items-center justify-center rounded-sm transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
        view === mode
          ? "bg-background-primary-default text-text-primary shadow-xs"
          : "text-foreground-icon-tertiary hover:text-text-secondary",
        focusRing,
      )}
    >
      <Icon className="size-3" aria-hidden />
    </button>
  );
  return (
    <section aria-label="Campaign files" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex h-6 items-center gap-1.5">
        <h3 className="text-body-2-semibold text-text-primary">Campaign files</h3>
        <span className="truncate text-caption-2-regular text-text-tertiary">
          <span className="font-mono tabular-nums">{selected.length || files.length}</span> {selected.length ? "selected" : files.length === 1 ? "file" : "files"}
        </span>
        <div role="group" aria-label="File layout" className="ms-auto flex shrink-0 items-center gap-0.5 rounded-md bg-background-tertiary-default p-0.5">
          {viewButton("grid", "Grid view", RiLayoutGridLine)}
          {viewButton("list", "List view", RiListUnordered)}
        </div>
      </div>

      {files.length === 0 ? (
        <div className="mt-1.5 flex h-[130px] flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border-button-default">
          <p className="text-caption-2-regular text-text-tertiary">This folder is empty</p>
          <button type="button" onClick={() => setFiles([...GRID_FILES])} className={quietButton}>Restore files</button>
        </div>
      ) : (
        <div key={view} className="mt-1.5 animate-label-in motion-reduce:animate-none">
          {view === "grid" ? (
            <ul className="grid grid-cols-2 gap-1.5">
              {files.map((file) => {
                const isSelected = selected.includes(file.id);
                return (
                  <li key={file.id} className="relative">
                    <button type="button" aria-pressed={isSelected} aria-label={`Select ${file.name}.${file.ext.toLowerCase()}`} onClick={() => toggle(file.id)}
                      className={cx(
                        "flex h-[62px] w-full flex-col justify-between rounded-lg border p-1.5 pe-5 text-start transition-[background-color,border-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                        isSelected ? "border-accent-500 bg-background-secondary-default shadow-xs" : "border-border-button-default bg-background-primary-default hover:bg-background-primary-hover",
                        focusRing,
                      )}>
                      <span className="flex items-center gap-1">
                        <FileGlyph kind={file.kind} className="size-5 rounded-sm" />
                        {isSelected && <RiCheckLine className="size-3 text-accent-600" aria-hidden />}
                      </span>
                      <span className="w-full">
                        <span className="block truncate text-caption-2-semibold text-text-primary">{file.name}</span>
                        <span className="flex items-center gap-1 text-caption-2-regular text-text-tertiary">
                          <span className="font-mono">{file.ext}</span><span aria-hidden>·</span>
                          <span className="truncate font-mono tabular-nums">{file.size}</span>
                        </span>
                      </span>
                    </button>
                    <div className="absolute end-0.5 top-0.5 z-10">{actions(file)}</div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <ul>
              {files.map((file) => {
                const isSelected = selected.includes(file.id);
                return (
                  <li key={file.id} className="flex h-8 items-center gap-1 border-b border-separator-border last:border-b-0">
                    <button type="button" aria-pressed={isSelected} aria-label={`Select ${file.name}.${file.ext.toLowerCase()}`} onClick={() => toggle(file.id)}
                      className={cx(
                        "flex min-w-0 flex-1 items-center gap-1.5 rounded-md px-1 py-0.5 -ms-1 text-start transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
                        isSelected ? "bg-background-secondary-default" : "hover:bg-background-secondary-default",
                        focusRing,
                      )}>
                      <FileGlyph kind={file.kind} className="size-5 rounded-sm" />
                      <span className="min-w-0 flex-1 truncate text-caption-1-medium text-text-primary">{file.name}</span>
                      <span className="shrink-0 font-mono text-caption-2-regular text-text-tertiary tabular-nums">{file.size}</span>
                    </button>
                    <div className="shrink-0">{actions(file)}</div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

/* 2. Upload Queue */

type UploadStatus = "uploading" | "paused" | "done" | "failed";
type Upload = { id: string; name: string; size: string; progress: number; status: UploadStatus; kind: FileKind };

const INITIAL_UPLOADS: Upload[] = [
  { id: "deck", name: "launch-deck.pdf", size: "12.4 MB", progress: 68, status: "uploading", kind: "pdf" },
  { id: "stills", name: "stills-batch-02.zip", size: "48.1 MB", progress: 24, status: "uploading", kind: "zip" },
  { id: "captions", name: "captions-en.vtt", size: "18 KB", progress: 32, status: "failed", kind: "doc" },
];

export function UploadQueue() {
  const [uploads, setUploads] = useState<Upload[]>(INITIAL_UPLOADS);
  const active = uploads.some((upload) => upload.status === "uploading");

  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => {
      setUploads((current) =>
        current.map((upload): Upload => {
          if (upload.status !== "uploading") return upload;
          const progress = Math.min(100, upload.progress + 8);
          return { ...upload, progress, status: progress >= 100 ? "done" : "uploading" };
        }),
      );
    }, 650);
    return () => window.clearInterval(timer);
  }, [active]);

  const setStatus = (id: string, status: UploadStatus, progress?: number) =>
    setUploads((current) =>
      current.map((upload): Upload =>
        upload.id === id ? { ...upload, status, progress: progress ?? upload.progress } : upload,
      ),
    );

  const done = uploads.filter((upload) => upload.status === "done").length;

  return (
    <section aria-label="Upload queue" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex h-6 items-center gap-1.5">
        <span className="flex size-5 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
          <RiUploadCloud2Line className="size-3" aria-hidden />
        </span>
        <h3 className="text-body-2-semibold text-text-primary">Uploads</h3>
        <span className="ms-auto text-caption-2-regular text-text-tertiary">
          <span className="font-mono tabular-nums">{done}</span> of{" "}
          <span className="font-mono tabular-nums">{uploads.length}</span> done
        </span>
      </div>

      <ul className="mt-1.5 flex flex-col gap-1.5">
        {uploads.map((upload) => {
          const percent = upload.status === "failed" ? 32 : upload.progress;
          const barTone =
            upload.status === "failed"
              ? "bg-status-rose-text"
              : upload.status === "done"
                ? "bg-status-lime-text"
                : "bg-accent-500";
          return (
            <li key={upload.id} className="flex items-center gap-1.5">
              <FileGlyph kind={upload.kind} className="size-6 rounded-md" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="min-w-0 flex-1 truncate text-caption-2-semibold text-text-primary">{upload.name}</span>
                  <span
                    className={cx(
                      "shrink-0 font-mono text-caption-2-regular tabular-nums transition-colors duration-150 ease-out motion-reduce:transition-none",
                      upload.status === "failed" ? "text-text-error-primary" : "text-text-tertiary",
                    )}
                  >
                    {upload.status === "failed" ? "Failed" : `${upload.progress}%`}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <div
                    role="progressbar"
                    aria-label={`Upload ${upload.name}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={percent}
                    aria-valuetext={
                      upload.status === "failed"
                        ? "Failed, needs retry"
                        : upload.status === "done"
                          ? "Uploaded"
                          : upload.status === "paused"
                            ? `Paused at ${upload.progress} percent`
                            : `${upload.progress} percent`
                    }
                    className="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-background-tertiary-default"
                  >
                    <div
                      className={cx("h-full rounded-full transition-[width,background-color] duration-200 ease-out motion-reduce:transition-none", barTone)}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="shrink-0 text-caption-2-regular text-text-tertiary">
                    {upload.status === "paused" ? (
                      "Paused"
                    ) : upload.status === "failed" ? (
                      "Needs retry"
                    ) : upload.status === "done" ? (
                      "Ready"
                    ) : (
                      <span className="font-mono tabular-nums">{upload.size}</span>
                    )}
                  </span>
                </div>
              </div>
              {upload.status === "done" ? (
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-status-lime-background text-status-lime-text">
                  <RiCheckLine className="size-3.5" aria-hidden />
                </span>
              ) : upload.status === "failed" ? (
                <button type="button" aria-label={`Retry ${upload.name}`} onClick={() => setStatus(upload.id, "uploading", 4)} className={iconButton}>
                  <RiRefreshLine className="size-3.5" aria-hidden />
                </button>
              ) : (
                <button
                  type="button"
                  aria-label={`${upload.status === "paused" ? "Resume" : "Pause"} ${upload.name}`}
                  onClick={() => setStatus(upload.id, upload.status === "paused" ? "uploading" : "paused")}
                  className={iconButton}
                >
                  {upload.status === "paused" ? <RiPlayLine className="size-3.5" aria-hidden /> : <RiPauseLine className="size-3.5" aria-hidden />}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* 3. File Row */

export function FileRow() {
  const [starred, setStarred] = useState(false);
  const [copied, setCopied] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useDismiss(menuRef, menuOpen, () => setMenuOpen(false), triggerRef);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyLink = () => {
    setCopied(true);
    setMenuOpen(false);
    triggerRef.current?.focus();
    void navigator.clipboard?.writeText("https://northline.co/f/q4-launch").catch(() => undefined);
  };

  return (
    <section aria-label="File row" className={cx(card, "max-w-[460px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Shared with the team</h3>
        <span className="shrink-0 text-caption-2-regular text-text-tertiary">Edited 2h ago</span>
      </div>

      {removed ? (
        <div className="mt-1.5 flex h-[46px] animate-label-in items-center gap-1.5 rounded-lg border border-dashed border-border-button-default bg-background-secondary-default px-2 motion-reduce:animate-none">
          <span className="min-w-0 flex-1 truncate text-caption-1-regular text-text-secondary">Q4-launch-brief.pdf moved to trash.</span>
          <button type="button" onClick={() => setRemoved(false)} className={quietButton}>
            Undo
          </button>
        </div>
      ) : (
        <div className="mt-1.5">
          <div className="grid grid-cols-[minmax(0,1fr)_40px_54px_88px_24px] items-center gap-1 border-b border-separator-border pb-0.5 text-caption-2-regular text-text-tertiary">
            <span>Name</span>
            <span>Type</span>
            <span>Size</span>
            <span>Owner</span>
            <span className="sr-only">Actions</span>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_40px_54px_88px_24px] items-center gap-1 py-1.5">
            <div className="flex min-w-0 items-center gap-1.5">
              <FileGlyph kind="pdf" className="size-6 rounded-md" />
              <div className="min-w-0">
                <p className="flex items-center gap-1">
                  <span className="truncate text-caption-1-semibold text-text-primary">Q4-launch-brief</span>
                  {starred && <RiStarLine className="size-3 shrink-0 text-status-yellow-text" aria-hidden />}
                </p>
                <p className="truncate text-caption-2-regular text-text-tertiary">PDF document · 18 pages</p>
              </div>
            </div>
            <span className="font-mono text-caption-2-regular text-text-secondary">PDF</span>
            <span className="font-mono text-caption-2-regular text-text-secondary tabular-nums">2.4 MB</span>
            <span className="flex min-w-0 items-center gap-1">
              <span
                aria-hidden
                className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-100 text-caption-2-semibold text-accent-700"
              >
                MC
              </span>
              <span className="truncate text-caption-2-regular text-text-secondary">Maya Chen</span>
            </span>
            <div ref={menuRef} className="relative">
              <button
                ref={triggerRef}
                type="button"
                aria-label="Actions for Q4-launch-brief.pdf"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((next) => !next)}
                className={iconButton}
              >
                <RiMore2Line className="size-3.5" aria-hidden />
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  aria-label="File actions"
                  className="absolute end-0 top-[calc(100%+4px)] z-30 w-36 animate-label-in rounded-lg border border-border-button-default bg-background-primary-default p-1 shadow-dropdown motion-reduce:animate-none"
                >
                  <MenuItem icon={RiFileCopyLine} label="Copy link" onSelect={copyLink} />
                  <MenuItem
                    icon={RiStarLine}
                    label={starred ? "Remove star" : "Add star"}
                    onSelect={() => {
                      setStarred((current) => !current);
                      setMenuOpen(false);
                      triggerRef.current?.focus();
                    }}
                  />
                  <MenuItem
                    icon={RiDeleteBinLine}
                    label="Move to trash"
                    danger
                    onSelect={() => {
                      setRemoved(true);
                      setMenuOpen(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-1 flex h-5 items-center border-t border-separator-border pt-1">
        <span
          role="status"
          aria-live="polite"
          className={cx(
            "min-w-0 truncate text-caption-2-regular transition-colors duration-150 ease-out motion-reduce:transition-none",
            copied ? "text-status-lime-text" : "text-text-tertiary",
          )}
        >
          {removed
            ? "Moved to trash · undo above"
            : copied
              ? "Link copied to clipboard"
              : starred
                ? "Starred · visible in Priority"
                : "Maya Chen and 3 others can edit"}
        </span>
      </div>
    </section>
  );
}

/* 4. Version List */

type Version = { id: string; label: string; author: string; date: string; size: string; note: string };

const VERSIONS: Version[] = [
  { id: "v6", label: "v6", author: "Maya Chen", date: "Nov 4, 14:32", size: "2.4 MB", note: "Final copy edits" },
  { id: "v5", label: "v5", author: "Dev Raman", date: "Nov 3, 09:18", size: "2.3 MB", note: "Legal pass" },
  { id: "v4", label: "v4", author: "Priya Nair", date: "Nov 1, 17:05", size: "2.2 MB", note: "Layout lock" },
];

export function VersionList() {
  const [current, setCurrent] = useState("v6");
  const [confirm, setConfirm] = useState<string | null>(null);
  const [restored, setRestored] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useDismiss(listRef, confirm !== null, () => setConfirm(null), triggerRef);

  return (
    <section aria-label="Version history" className={cx(card, "max-w-[320px] p-2.5")} ref={listRef}>
      <div className="flex h-6 items-center gap-1.5">
        <h3 className="text-body-2-semibold text-text-primary">Version history</h3>
        <span className="ms-auto text-caption-2-regular text-text-tertiary">
          <span className="font-mono tabular-nums">{VERSIONS.length}</span> versions
        </span>
      </div>

      <ul className="mt-1">
        {VERSIONS.map((version) => {
          const isCurrent = current === version.id;
          const confirming = confirm === version.id;
          return (
            <li key={version.id} className="border-b border-separator-border py-0.5 last:border-b-0">
              <div className="flex h-5 items-center gap-1.5">
                <span className={cx("font-mono text-caption-1-semibold tabular-nums transition-colors duration-150 ease-out motion-reduce:transition-none", isCurrent ? "text-accent-600" : "text-text-secondary")}>
                  {version.label}
                </span>
                <span className="min-w-0 flex-1 truncate text-caption-2-regular text-text-secondary">{version.note}</span>
                {isCurrent ? (
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-background-secondary-default px-1.5 py-0.5 text-caption-2-medium text-accent-600">
                    <span aria-hidden className="size-1.5 rounded-full bg-accent-500" />
                    Current
                  </span>
                ) : (
                  <button
                    ref={confirming ? triggerRef : undefined}
                    type="button"
                    aria-label={`Restore ${version.label}`}
                    aria-expanded={confirming}
                    onClick={() => setConfirm(confirming ? null : version.id)}
                    className={cx(quietButton, "h-5 shrink-0 px-1")}
                  >
                    Restore
                  </button>
                )}
              </div>
              <p className="text-caption-2-regular text-text-tertiary">
                {version.author} · {version.date} · <span className="font-mono tabular-nums">{version.size}</span>
              </p>
              <div inert={!confirming} className={cx(revealGrid, confirming ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                <div className="min-h-0 overflow-hidden">
                  <div className="mt-1 flex items-center gap-1.5 rounded-lg border border-border-button-default bg-background-secondary-default p-1.5">
                    <p className="min-w-0 flex-1 text-caption-2-regular text-text-secondary">
                      Restore {version.label}? {current} stays in history.
                    </p>
                    <button type="button" onClick={() => { setConfirm(null); triggerRef.current?.focus(); }} className={cx(secondaryButton, "h-5 px-1.5")}>
                      Keep
                    </button>
                    <button
                      type="button"
                      aria-label={`Confirm restore of ${version.label}`}
                      onClick={() => {
                        setCurrent(version.id);
                        setConfirm(null);
                        setRestored(version.label);
                      }}
                      className={cx(primaryButton, "h-5 px-1.5")}
                    >
                      Restore
                    </button>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-1 flex h-4 items-center">
        <span
          role="status"
          aria-live="polite"
          className={cx("truncate text-caption-2-regular transition-colors duration-150 ease-out motion-reduce:transition-none", restored ? "text-status-lime-text" : "text-text-tertiary")}
        >
          {restored ? `${restored} is now current.` : "Restoring keeps the current version in history."}
        </span>
      </div>
    </section>
  );
}

/* 5. Share Link */

const PERMISSIONS = [
  { id: "view", label: "Can view", detail: "Anyone with the link can view and download." },
  { id: "comment", label: "Can comment", detail: "They can comment without changing the file." },
  { id: "edit", label: "Can edit", detail: "They can replace the file and invite others." },
] as const;

const EXPIRY = [
  { id: "7", label: "7 days" },
  { id: "30", label: "30 days" },
  { id: "never", label: "Never" },
] as const;

type Permission = (typeof PERMISSIONS)[number]["id"];
type Expiry = (typeof EXPIRY)[number]["id"];

export function ShareLink() {
  const [permission, setPermission] = useState<Permission>("comment");
  const [expiry, setExpiry] = useState<Expiry>("30");
  const [copied, setCopied] = useState(false);
  const current = PERMISSIONS.find((item) => item.id === permission) ?? PERMISSIONS[0];

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = () => {
    setCopied(true);
    void navigator.clipboard?.writeText("https://northline.co/s/q4-launch-8f2c").catch(() => undefined);
  };

  const selectClass =
    "h-6 w-full appearance-none rounded-md border border-border-button-default bg-background-primary-default ps-1.5 pe-5 text-caption-2-medium text-text-primary outline-none";

  return (
    <section aria-label="Share link" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex h-6 items-center gap-1.5">
        <span className="flex size-5 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
          <RiLinkM className="size-3" aria-hidden />
        </span>
        <h3 className="text-body-2-semibold text-text-primary">Share link</h3>
        <span className="ms-auto shrink-0 text-caption-2-regular text-text-tertiary">
          {expiry === "never" ? "No expiry" : `Expires in ${expiry} days`}
        </span>
      </div>

      <div className="mt-1.5 flex h-8 items-center gap-1 rounded-lg bg-background-tertiary-default ps-2 pe-1">
        <RiLinkM className="size-3.5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
        <span dir="ltr" className="min-w-0 flex-1 truncate text-start text-caption-2-regular text-text-secondary">
          northline.co/s/q4-launch-8f2c
        </span>
        <button
          type="button"
          onClick={copy}
          className={cx(secondaryButton, "h-6 shrink-0 transition-[background-color,border-color,color]", copied && "text-status-lime-text")}
        >
          {copied ? <RiCheckLine className="size-3" aria-hidden /> : <RiFileCopyLine className="size-3" aria-hidden />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="mt-1.5 flex flex-col gap-1">
        <label className="flex items-center gap-1.5">
          <span className="w-[52px] shrink-0 text-caption-2-regular text-text-tertiary">People</span>
          <span className="relative min-w-0 flex-1">
            <select
              aria-label="Link permission"
              value={permission}
              onChange={(event) => setPermission(event.target.value as Permission)}
              className={cx(selectClass, focusRing)}
            >
              {PERMISSIONS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
            <RiArrowDownSLine className="pointer-events-none absolute end-1 top-1/2 size-3 -translate-y-1/2 text-foreground-icon-tertiary" aria-hidden />
          </span>
        </label>
        <label className="flex items-center gap-1.5">
          <span className="w-[52px] shrink-0 text-caption-2-regular text-text-tertiary">Expires</span>
          <span className="relative min-w-0 flex-1">
            <select
              aria-label="Link expiry"
              value={expiry}
              onChange={(event) => setExpiry(event.target.value as Expiry)}
              className={cx(selectClass, focusRing)}
            >
              {EXPIRY.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
            <RiArrowDownSLine className="pointer-events-none absolute end-1 top-1/2 size-3 -translate-y-1/2 text-foreground-icon-tertiary" aria-hidden />
          </span>
        </label>
      </div>

      <p
        aria-live="polite"
        className={cx("mt-1 truncate text-caption-2-regular transition-colors duration-150 ease-out motion-reduce:transition-none", copied ? "text-status-lime-text" : "text-text-tertiary")}
      >
        {copied ? "Link copied to clipboard." : current.detail}
      </p>
    </section>
  );
}

/* 6. Storage Meter */

type StorageSegment = { id: string; label: string; size: number; files: number; tone: string };

const STORAGE: StorageSegment[] = [
  { id: "video", label: "Video", size: 48.2, files: 312, tone: "bg-chart-1" },
  { id: "images", label: "Images", size: 22.6, files: 1488, tone: "bg-chart-4" },
  { id: "docs", label: "Docs", size: 8.4, files: 96, tone: "bg-chart-5" },
  { id: "other", label: "Other", size: 3.1, files: 41, tone: "bg-chart-8" },
];

const PLAN_GB = 100;
const USED_GB = STORAGE.reduce((total, item) => total + item.size, 0);
const FREE_GB = PLAN_GB - USED_GB;

export function StorageMeter() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const shown = hovered ?? pinned;
  const segment = STORAGE.find((item) => item.id === shown);

  return (
    <section aria-label="Storage meter" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex h-6 items-center gap-1.5">
        <span className="flex size-5 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
          <RiHardDrive2Line className="size-3" aria-hidden />
        </span>
        <h3 className="text-body-2-semibold text-text-primary">Workspace storage</h3>
        <span className="ms-auto shrink-0 font-mono text-caption-2-regular tabular-nums text-text-tertiary">
          {USED_GB.toFixed(1)} / {PLAN_GB} GB
        </span>
      </div>

      <div role="group" aria-label="Storage by file type" className="mt-2 flex h-2.5 w-full items-stretch gap-0.5 overflow-hidden rounded-full bg-background-tertiary-default">
        {STORAGE.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-label={`${item.label}, ${item.size.toFixed(1)} gigabytes, ${item.files} files`}
            aria-pressed={pinned === item.id}
            onMouseEnter={() => setHovered(item.id)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(item.id)}
            onBlur={() => setHovered(null)}
            onClick={() => setPinned(pinned === item.id ? null : item.id)}
            style={{ width: `${item.size}%` }}
            className={cx(
              "h-full min-w-0 rounded-sm transition-[opacity] duration-150 ease-out motion-reduce:transition-none",
              item.tone,
              shown && shown !== item.id ? "opacity-40" : "opacity-100",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring",
            )}
          />
        ))}
        <span aria-hidden className="min-w-0 flex-1" />
      </div>

      <p
        key={shown ?? "total"}
        aria-live="polite"
        className="mt-1.5 animate-label-in truncate text-caption-1-regular text-text-secondary motion-reduce:animate-none"
      >
        {segment ? (
          <>
            {segment.label} · <span className="font-mono tabular-nums">{segment.size.toFixed(1)} GB</span> ·{" "}
            <span className="font-mono tabular-nums">{segment.files}</span> files
          </>
        ) : (
          <>
            <span className="font-mono tabular-nums">{USED_GB.toFixed(1)} GB</span> used ·{" "}
            <span className="font-mono tabular-nums">{FREE_GB.toFixed(1)} GB</span> free
          </>
        )}
      </p>

      <div className="mt-1.5 flex flex-wrap gap-1">
        {STORAGE.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={pinned === item.id}
            onClick={() => setPinned(pinned === item.id ? null : item.id)}
            className={cx(
              "flex items-center gap-1 rounded-full px-1.5 py-0.5 text-caption-2-medium transition-colors duration-150 ease-out motion-reduce:transition-none",
              pinned === item.id
                ? "bg-background-secondary-default text-text-primary"
                : "text-text-tertiary hover:bg-background-secondary-default hover:text-text-secondary",
              focusRing,
            )}
          >
            <span className={cx("size-1.5 rounded-full", item.tone)} aria-hidden />
            {item.label}
            <span className="font-mono text-caption-2-regular tabular-nums">{item.size}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

/* 7. Folder Breadcrumb */

type FolderNode = { name: string; count: number; children: string[] };

const FOLDERS: Record<string, FolderNode> = {
  root: { name: "All files", count: 128, children: ["campaign", "brand"] },
  campaign: { name: "Q4 campaign", count: 42, children: ["social", "stills"] },
  brand: { name: "Brand", count: 18, children: [] },
  social: { name: "Social", count: 12, children: [] },
  stills: { name: "Stills", count: 15, children: [] },
};

export function FolderBreadcrumb() {
  const [path, setPath] = useState<string[]>(["root"]);
  const current = FOLDERS[path[path.length - 1]];

  return (
    <section aria-label="Folder browser" className={cx(card, "max-w-[300px] p-2.5")}>
      <div className="flex h-6 items-center gap-1.5">
        <button
          type="button"
          aria-label="Go up one folder"
          disabled={path.length === 1}
          onClick={() => setPath((items) => items.slice(0, -1))}
          className={cx(
            "flex size-5 shrink-0 items-center justify-center rounded-md border border-border-button-default bg-background-primary-default text-foreground-icon-secondary shadow-xs",
            "transition-[background-color,color,opacity] duration-150 ease-out hover:bg-background-primary-hover hover:text-text-primary disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none",
            focusRing,
          )}
        >
          <RiArrowLeftLine className="size-3 rtl:-scale-x-100" aria-hidden />
        </button>
        <nav aria-label="Folder path" className="flex min-w-0 flex-1 items-center gap-0.5">
          {path.map((id, index) => {
            const last = index === path.length - 1;
            return (
              <span key={id} className="flex min-w-0 items-center gap-0.5">
                {index > 0 && <RiArrowRightSLine className="size-3 shrink-0 text-foreground-icon-quaternary rtl:-scale-x-100" aria-hidden />}
                <button
                  type="button"
                  aria-current={last ? "page" : undefined}
                  onClick={() => setPath((items) => items.slice(0, index + 1))}
                  className={cx(
                    "max-w-[86px] truncate rounded-sm px-0.5 text-caption-2-medium transition-colors duration-150 ease-out motion-reduce:transition-none",
                    last ? "text-text-primary" : "text-text-tertiary hover:text-text-secondary",
                    focusRing,
                  )}
                >
                  {FOLDERS[id].name}
                </button>
              </span>
            );
          })}
        </nav>
        <span className="shrink-0 text-caption-2-regular text-text-tertiary">
          <span className="font-mono tabular-nums">{current.count}</span> items
        </span>
      </div>

      <ul key={path[path.length - 1]} className="mt-1.5 animate-label-in motion-reduce:animate-none">
        {current.children.length === 0 ? (
          <li className="flex h-[74px] flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border-button-default">
            <RiFolderOpenLine className="size-5 text-foreground-icon-tertiary" aria-hidden />
            <p className="text-caption-2-regular text-text-tertiary">No subfolders here</p>
          </li>
        ) : (
          current.children.map((id) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => setPath((items) => [...items, id])}
                className={cx(
                  "flex h-8 w-full items-center gap-1.5 rounded-md px-1 text-start transition-colors duration-150 ease-out hover:bg-background-secondary-default motion-reduce:transition-none",
                  focusRing,
                )}
              >
                <RiFolderLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
                <span className="min-w-0 flex-1 truncate text-caption-1-medium text-text-primary">{FOLDERS[id].name}</span>
                <span className="font-mono text-caption-2-regular text-text-tertiary tabular-nums">{FOLDERS[id].count}</span>
                <RiArrowRightSLine className="size-3.5 shrink-0 text-foreground-icon-tertiary rtl:-scale-x-100" aria-hidden />
              </button>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

/* 8. Bulk Actions */

const BULK_FILES: GridFile[] = [
  { id: "brief", name: "Q4-launch-brief.pdf", ext: "PDF", size: "2.4 MB", kind: "pdf" },
  { id: "hero", name: "hero-frame-04.png", ext: "PNG", size: "8.1 MB", kind: "image" },
  { id: "teaser", name: "launch-teaser.mp4", ext: "MP4", size: "64 MB", kind: "video" },
];

export function BulkActions() {
  const [selected, setSelected] = useState<string[]>([]);
  const [removed, setRemoved] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const visible = BULK_FILES.filter((file) => !removed.includes(file.id));
  const allSelected = visible.length > 0 && selected.length === visible.length;
  const someSelected = selected.length > 0 && !allSelected;

  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );

  const move = () => {
    const count = selected.length;
    setSelected([]);
    setStatus(`${count} ${count === 1 ? "file" : "files"} moved to Archive`);
  };

  const remove = () => {
    const count = selected.length;
    setRemoved((current) => [...new Set([...current, ...selected])]);
    setSelected([]);
    setStatus(`${count} ${count === 1 ? "file" : "files"} moved to trash`);
  };

  return (
    <section aria-label="Bulk file actions" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex h-6 items-center gap-1.5">
        <button
          type="button"
          role="checkbox"
          aria-label="Select all files"
          aria-checked={allSelected ? true : someSelected ? "mixed" : false}
          onClick={() => {
            setSelected(allSelected ? [] : visible.map((file) => file.id));
            setStatus(null);
          }}
          className={cx(
            "flex size-4 shrink-0 items-center justify-center rounded-sm border transition-[background-color,border-color,color] duration-150 ease-out motion-reduce:transition-none",
            allSelected || someSelected
              ? "border-accent-600 bg-accent-600 text-text-white"
              : "border-border-checkbox-default bg-background-primary-default text-transparent hover:border-border-checkbox-hover",
            focusRing,
          )}
        >
          {someSelected ? <RiSubtractLine className="size-2.5" aria-hidden /> : <RiCheckLine className="size-2.5" aria-hidden />}
        </button>
        <h3 className="text-body-2-semibold text-text-primary">Files</h3>
        <span className="ms-auto text-caption-2-regular text-text-tertiary">
          <span className="font-mono tabular-nums text-text-primary">{selected.length}</span> selected
        </span>
      </div>

      <ul className="mt-1">
        {BULK_FILES.map((file) => {
          const isRemoved = removed.includes(file.id);
          const isSelected = selected.includes(file.id);
          return (
            <li
              key={file.id}
              aria-hidden={isRemoved}
              className={cx(
                "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none",
                isRemoved ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100",
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <div className={cx("flex h-8 items-center gap-1.5 rounded-md px-1 -ms-1 transition-colors duration-150 ease-out motion-reduce:transition-none", isSelected ? "bg-background-secondary-default" : "")}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-label={`Select ${file.name}`}
                    aria-checked={isSelected}
                    disabled={isRemoved}
                    onClick={() => toggle(file.id)}
                    className={cx(
                      "flex size-4 shrink-0 items-center justify-center rounded-sm border transition-[background-color,border-color,color] duration-150 ease-out motion-reduce:transition-none",
                      isSelected
                        ? "border-accent-600 bg-accent-600 text-text-white"
                        : "border-border-checkbox-default bg-background-primary-default text-transparent hover:border-border-checkbox-hover",
                      focusRing,
                    )}
                  >
                    <RiCheckLine className="size-2.5" aria-hidden />
                  </button>
                  <FileGlyph kind={file.kind} className="size-5 rounded-sm" />
                  <span className="min-w-0 flex-1 truncate text-caption-1-medium text-text-primary">{file.name}</span>
                  <span className="font-mono text-caption-2-regular text-text-tertiary tabular-nums">{file.size}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-1 flex items-center gap-1 border-t border-separator-border pt-1.5">
        <button type="button" onClick={move} disabled={selected.length === 0} className={cx(secondaryButton, "h-5 px-1.5")}>
          <RiFolderLine className="size-3" aria-hidden />
          Move
        </button>
        <button type="button" onClick={remove} disabled={selected.length === 0} className={cx(secondaryButton, "h-5 px-1.5 text-text-destructive")}>
          <RiDeleteBinLine className="size-3" aria-hidden />
          Delete
        </button>
        <span role="status" aria-live="polite" className="min-w-0 flex-1 truncate text-end text-caption-2-regular text-text-tertiary">
          {status ?? "Select files to act"}
        </span>
        {removed.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setRemoved([]);
              setStatus("Files restored");
            }}
            className={cx(quietButton, "h-5 shrink-0 px-1")}
          >
            Undo
          </button>
        )}
      </div>
    </section>
  );
}

/* 9. Preview Drawer */

const PREVIEW_META = [
  { label: "Owner", value: "Maya Chen" },
  { label: "Modified", value: "Nov 4, 14:32" },
  { label: "Size", value: "2.4 MB" },
] as const;

export function PreviewDrawer() {
  const [open, setOpen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  useDismiss(stageRef, open, () => setOpen(false));

  useEffect(() => {
    if (open) closeRef.current?.focus();
    if (wasOpen.current && !open) triggerRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  return (
    <div ref={stageRef} className="relative h-[190px] w-full max-w-[320px] overflow-hidden rounded-xl border border-border-button-default bg-background-primary-default shadow-card">
      <div className="flex h-full flex-col p-2.5" inert={open} aria-hidden={open}>
        <div className="flex h-6 items-center gap-1.5">
          <h3 className="text-body-2-semibold text-text-primary">Campaign files</h3>
          <span className="ms-auto text-caption-2-regular text-text-tertiary">
            <span className="font-mono tabular-nums">3</span> files
          </span>
        </div>
        <div className="mt-1.5 flex flex-col">
          <button
            ref={triggerRef}
            type="button"
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className={cx(
              "flex h-8 items-center gap-1.5 rounded-md px-1 -ms-1 text-start transition-colors duration-150 ease-out hover:bg-background-secondary-default motion-reduce:transition-none",
              focusRing,
            )}
          >
            <FileGlyph kind="pdf" className="size-5 rounded-sm" />
            <span className="min-w-0 flex-1 truncate text-caption-2-semibold text-text-primary">Q4-launch-brief.pdf</span>
            <span className="font-mono text-caption-2-regular text-text-tertiary tabular-nums">2.4 MB</span>
            <RiEyeLine className="size-3.5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
          </button>
          {[
            { kind: "image" as const, name: "hero-frame-04.png", size: "8.1 MB" },
            { kind: "video" as const, name: "launch-teaser.mp4", size: "64 MB" },
          ].map((file) => (
            <div key={file.name} className="flex h-8 items-center gap-1.5 px-1 -ms-1">
              <FileGlyph kind={file.kind} className="size-5 rounded-sm" />
              <span className="min-w-0 flex-1 truncate text-caption-2-regular text-text-secondary">{file.name}</span>
              <span className="font-mono text-caption-2-regular text-text-tertiary tabular-nums">{file.size}</span>
            </div>
          ))}
        </div>
        <p className="mt-auto text-caption-2-regular text-text-tertiary">Select a file to preview its details.</p>
      </div>

      <div aria-hidden={!open} inert={!open} className={cx("absolute inset-0 z-20", open ? "pointer-events-auto" : "pointer-events-none")}>
        <button
          type="button"
          aria-label="Close preview"
          tabIndex={-1}
          onClick={() => setOpen(false)}
          className={cx(
            "absolute inset-0 cursor-default bg-background-primary-default/60 backdrop-blur-[2px] transition-opacity duration-200 ease-out motion-reduce:transition-none",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          role="dialog"
          aria-label="Preview of Q4-launch-brief.pdf"
          className={cx(
            "absolute inset-y-0 end-0 z-10 flex w-[190px] flex-col border-s border-border-button-default bg-background-primary-default shadow-dropdown",
            "transition-transform duration-200 ease-out motion-reduce:transition-none",
            open ? "translate-x-0" : "translate-x-full rtl:-translate-x-full",
          )}
        >
          <div className="flex h-8 shrink-0 items-center gap-1.5 border-b border-separator-border px-1.5">
            <RiFilePdf2Line className="size-3.5 shrink-0 text-status-rose-text" aria-hidden />
            <span className="min-w-0 flex-1 truncate text-caption-2-semibold text-text-primary">Q4-launch-brief.pdf</span>
            <button ref={closeRef} type="button" aria-label="Close preview" onClick={() => setOpen(false)} className={cx(iconButton, "size-5 rounded-sm")}>
              <RiCloseLine className="size-3.5" aria-hidden />
            </button>
          </div>
          <div className="flex flex-1 flex-col p-2">
            <div className="flex h-12 items-center justify-center rounded-lg bg-background-secondary-default">
              <span className="flex size-8 items-center justify-center rounded-md bg-status-rose-background text-status-rose-text">
                <RiFilePdf2Line className="size-4" aria-hidden />
              </span>
            </div>
            <dl className="mt-2 flex flex-col gap-0.5">
              {PREVIEW_META.map((item) => (
                <div key={item.label} className="flex items-baseline gap-1">
                  <dt className="w-14 shrink-0 text-caption-2-regular text-text-tertiary">{item.label}</dt>
                  <dd className={cx("min-w-0 flex-1 truncate text-caption-2-regular text-text-primary", item.label === "Size" && "font-mono tabular-nums")}>{item.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-auto text-caption-2-regular text-text-tertiary">Edited 2h ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 10. Trash Restore */

const TRASH_FILES: GridFile[] = [
  { id: "old", name: "launch-brief-v1.pdf", ext: "PDF", size: "1.9 MB", kind: "pdf" },
  { id: "frames", name: "frames-raw.zip", ext: "ZIP", size: "212 MB", kind: "zip" },
  { id: "notes", name: "meeting-notes.md", ext: "MD", size: "24 KB", kind: "doc" },
];

const TRASH_META: Record<string, { deleted: string; by: string }> = {
  old: { deleted: "Nov 1", by: "Maya Chen" },
  frames: { deleted: "Oct 30", by: "Dev Raman" },
  notes: { deleted: "Oct 28", by: "Priya Nair" },
};

export function TrashRestore() {
  const [restored, setRestored] = useState<string[]>([]);
  const [confirm, setConfirm] = useState(false);
  const [emptied, setEmptied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const emptyRef = useRef<HTMLButtonElement>(null);
  const keepRef = useRef<HTMLButtonElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);
  useDismiss(cardRef, confirm, () => setConfirm(false), emptyRef);
  const remaining = TRASH_FILES.length - restored.length;
  useEffect(() => {
    if (confirm) keepRef.current?.focus();
  }, [confirm]);

  useEffect(() => {
    if (emptied) resetRef.current?.focus();
  }, [emptied]);

  return (
    <section aria-label="Trash" className={cx(card, "max-w-[320px] p-2.5")} ref={cardRef}>
      <div className="flex h-6 items-center gap-1.5">
        <h3 className="text-body-2-semibold text-text-primary">Trash</h3>
        <span className="text-caption-2-regular text-text-tertiary">
          <span className="font-mono tabular-nums">{remaining}</span> in trash
        </span>
        <button
          ref={emptyRef}
          type="button"
          aria-expanded={confirm}
          disabled={emptied || remaining === 0}
          onClick={() => setConfirm((current) => !current)}
          className={cx(quietButton, "ms-auto h-5 px-1 text-text-destructive")}
        >
          Empty trash
        </button>
      </div>

      {confirm ? (
        <div className="mt-1 flex h-[124px] animate-label-in flex-col items-center justify-center rounded-lg border border-border-error-default bg-background-secondary-default p-2 text-center motion-reduce:animate-none">
          <p className="text-caption-1-semibold text-text-primary">Empty the trash?</p>
          <p className="mt-0.5 text-caption-2-regular text-text-secondary">
            <span className="font-mono tabular-nums">{remaining}</span> {remaining === 1 ? "file" : "files"} will be deleted permanently.
          </p>
          <div className="mt-1.5 flex items-center gap-1">
            <button type="button" ref={keepRef} onClick={() => { setConfirm(false); emptyRef.current?.focus(); }} className={secondaryButton}>Keep files</button>
            <button
              type="button"
              onClick={() => {
                setConfirm(false);
                setEmptied(true);
              }}
              className={cx(primaryButton, "bg-button-danger")}
            >
              Empty trash
            </button>
          </div>
        </div>
      ) : emptied ? (
        <div className="mt-1 flex h-[124px] animate-label-in flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border-button-default motion-reduce:animate-none">
          <RiDeleteBinLine className="size-5 text-foreground-icon-tertiary" aria-hidden />
          <p className="text-caption-1-medium text-text-secondary">Trash is empty</p>
          <button
            ref={resetRef}
            type="button"
            onClick={() => {
              setEmptied(false);
              setRestored([]);
            }}
            className={quietButton}
          >
            <RiRefreshLine className="size-3" aria-hidden />
            Reset demo
          </button>
        </div>
      ) : (
        <ul className="mt-1">
          {TRASH_FILES.map((file) => {
            const isRestored = restored.includes(file.id);
            return (
              <li
                key={file.id}
                className={cx(
                  "flex h-9 items-center gap-1.5 border-b border-separator-border last:border-b-0 transition-opacity duration-150 ease-out motion-reduce:transition-none",
                  isRestored ? "opacity-60" : "opacity-100",
                )}
              >
                <FileGlyph kind={file.kind} className="size-6 rounded-md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-caption-2-semibold text-text-primary">{file.name}</p>
                  <p className="truncate text-caption-2-regular text-text-tertiary">
                    Deleted {TRASH_META[file.id].deleted} · {TRASH_META[file.id].by}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-caption-2-regular text-text-tertiary tabular-nums">{file.size}</span>
                {isRestored ? (
                  <span className="flex shrink-0 items-center gap-1 text-caption-2-medium text-status-lime-text">
                    <RiCheckLine className="size-3" aria-hidden />
                    Restored
                  </span>
                ) : (
                  <button
                    type="button"
                    aria-label={`Restore ${file.name}`}
                    onClick={() => setRestored((current) => [...current, file.id])}
                    className={cx(quietButton, "h-5 shrink-0 px-1")}
                  >
                    <RiInboxUnarchiveLine className="size-3" aria-hidden />
                    Restore
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-1.5 flex items-center justify-between gap-2 text-caption-2-regular text-text-tertiary">
        <span>Files auto-delete after 30 days.</span>
        {restored.length === TRASH_FILES.length && (
          <button type="button" onClick={() => setRestored([])} className={cx(quietButton, "h-5 px-1")}>Reset</button>
        )}
      </div>
    </section>
  );
}

/* 11. Inline Rename */

export function InlineRename() {
  const id = useId();
  const errorId = `${id}-error`;
  const [name, setName] = useState("Q4-launch-brief");
  const [draft, setDraft] = useState(name);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const start = () => {
    setDraft(name);
    setError(null);
    setSaved(false);
    setEditing(true);
  };

  const cancel = () => {
    setDraft(name);
    setError(null);
    setEditing(false);
  };

  const commit = () => {
    const next = draft.trim();
    if (!next) return setError("A file needs a name.");
    if (/[\\/]/.test(next)) return setError("Names cannot contain slashes.");
    if (next.length > 48) return setError("Keep the name under 48 characters.");
    setName(next);
    setError(null);
    setEditing(false);
    setSaved(true);
  };

  return (
    <section aria-label="Rename file" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-2">
        <FileGlyph kind="pdf" className="size-7 rounded-md" />
        <div className="min-w-0 flex-1">
          <p className="text-caption-2-regular text-text-tertiary">Campaign files / Q4 campaign</p>
          {editing ? (
            <div className="mt-0.5 animate-label-in motion-reduce:animate-none">
              <label htmlFor={id} className="sr-only">File name</label>
              <div className="flex h-7 items-center rounded-md bg-background-tertiary-default px-1.5 ring-2 ring-inset ring-transparent focus-within:ring-border-focus-ring">
                <input
                  id={id}
                  ref={inputRef}
                  value={draft}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? errorId : undefined}
                  onChange={(event) => {
                    setDraft(event.target.value);
                    setError(null);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      commit();
                    }
                    if (event.key === "Escape") {
                      event.stopPropagation();
                      cancel();
                    }
                  }}
                  className="min-w-0 flex-1 bg-transparent text-body-2-medium text-text-primary outline-none"
                />
                <span className="shrink-0 font-mono text-caption-2-regular text-text-tertiary">.pdf</span>
              </div>
            </div>
          ) : (
            <button
              type="button"
              aria-label={`Rename ${name}.pdf`}
              onClick={start}
              className={cx(
                "mt-0.5 flex h-7 max-w-full items-center gap-1 rounded-md px-1 -ms-1 text-start transition-colors duration-150 ease-out hover:bg-background-secondary-default motion-reduce:transition-none",
                focusRing,
              )}
            >
              <span className="truncate text-body-2-semibold text-text-primary">{name}</span>
              <span className="shrink-0 font-mono text-caption-2-regular text-text-tertiary">.pdf</span>
              <RiPencilLine className="size-3 shrink-0 text-foreground-icon-tertiary" aria-hidden />
            </button>
          )}
        </div>
      </div>

      <div className="mt-2 flex min-h-6 items-center gap-1">
        {editing ? (
          <>
            <button type="button" onClick={commit} className={primaryButton}>
              <RiCheckLine className="size-3" aria-hidden />
              Save
            </button>
            <button type="button" onClick={cancel} className={secondaryButton}>Cancel</button>
            <span
              id={errorId}
              role={error ? "alert" : undefined}
              className="min-w-0 flex-1 truncate text-end text-caption-2-regular text-text-error-primary"
            >
              {error}
            </span>
          </>
        ) : (
          <span
            role="status"
            aria-live="polite"
            className={cx("min-w-0 truncate text-caption-2-regular transition-colors duration-150 ease-out motion-reduce:transition-none", saved ? "text-status-lime-text" : "text-text-tertiary")}
          >
            {saved ? "Name saved." : "Click the name to rename · Enter saves, Esc cancels."}
          </span>
        )}
      </div>
    </section>
  );
}

/* 12. File Type Filter */

type FileGroup = "docs" | "images" | "video" | "archives";
type FilterFile = { name: string; kind: FileKind; group: FileGroup; size: string };

const FILTER_FILES: FilterFile[] = [
  { name: "Q4-launch-brief.pdf", kind: "pdf", group: "docs", size: "2.4 MB" },
  { name: "hero-frame-04.png", kind: "image", group: "images", size: "8.1 MB" },
  { name: "launch-teaser.mp4", kind: "video", group: "video", size: "64 MB" },
  { name: "brand-assets.zip", kind: "zip", group: "archives", size: "18 MB" },
  { name: "legal-review.docx", kind: "doc", group: "docs", size: "480 KB" },
];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "docs", label: "Docs" },
  { id: "images", label: "Images" },
  { id: "video", label: "Video" },
  { id: "archives", label: "Archives" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

export function FileTypeFilter() {
  const [filter, setFilter] = useState<FilterId>("all");
  const shown = filter === "all" ? FILTER_FILES : FILTER_FILES.filter((file) => file.group === filter);
  const countFor = (id: FilterId) =>
    id === "all" ? FILTER_FILES.length : FILTER_FILES.filter((file) => file.group === id).length;

  return (
    <section aria-label="Filter files by type" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex h-6 items-center gap-1.5">
        <h3 className="text-body-2-semibold text-text-primary">Recent files</h3>
        <span className="ms-auto text-caption-2-regular text-text-tertiary">
          <span className="font-mono tabular-nums">{shown.length}</span> shown
        </span>
      </div>

      <div role="group" aria-label="File types" className="mt-1.5 flex flex-wrap gap-1">
        {FILTERS.map((item) => {
          const active = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(item.id)}
              className={cx(
                "flex h-6 shrink-0 items-center gap-1 rounded-full border px-2 text-caption-2-medium transition-[background-color,border-color,color] duration-150 ease-out motion-reduce:transition-none",
                active
                  ? "border-accent-500 bg-background-secondary-default text-text-primary"
                  : "border-border-button-default bg-background-primary-default text-text-secondary hover:bg-background-primary-hover",
                focusRing,
              )}
            >
              {item.label}
              <span className="font-mono text-caption-2-regular tabular-nums text-text-tertiary">{countFor(item.id)}</span>
            </button>
          );
        })}
      </div>

      <ul key={filter} className="mt-1.5 animate-label-in motion-reduce:animate-none">
        {shown.map((file) => (
          <li key={file.name} className="flex h-5 items-center gap-1.5">
            <FileGlyph kind={file.kind} className="size-4 rounded-sm" />
            <span className="min-w-0 flex-1 truncate text-caption-2-regular text-text-primary">{file.name}</span>
            <span className="shrink-0 font-mono text-caption-2-regular text-text-tertiary tabular-nums">{file.size}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* Specimens */

export const FILES_SECTION: ExtendedSection = {
  id: "files",
  title: "Files",
  blurb: "Upload, find, share and version the work.",
  file: "files.tsx",
  entries: [
    { name: "File Grid", description: "Switch grid and list, select tiles, and open per-file actions.", Demo: FileGrid },
    { name: "Upload Queue", description: "Three uploads with live progress, pause, resume and retry.", Demo: UploadQueue },
    { name: "File Row", description: "Name, type, size and owner in one row with an actions menu.", Demo: FileRow, wide: true },
    { name: "Version List", description: "History with a current marker and a guarded restore step.", Demo: VersionList },
    { name: "Share Link", description: "Set permission and expiry, then copy with feedback.", Demo: ShareLink },
    { name: "Storage Meter", description: "Segmented usage against the plan, with a hover readout.", Demo: StorageMeter },
    { name: "Folder Breadcrumb", description: "Move through nested folders and back with item counts.", Demo: FolderBreadcrumb },
    { name: "Bulk Actions", description: "Select all, then move or delete the selected files.", Demo: BulkActions },
    { name: "Preview Drawer", description: "A slide-over preview with metadata and a clean close.", Demo: PreviewDrawer },
    { name: "Trash Restore", description: "Restore deleted files or confirm emptying the trash.", Demo: TrashRestore },
    { name: "Inline Rename", description: "Edit a filename in place, validate it, save or cancel.", Demo: InlineRename },
    { name: "File Type Filter", description: "Type chips with counts that narrow the file list.", Demo: FileTypeFilter },
  ],
};
