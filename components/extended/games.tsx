"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiBox3Line,
  RiChat3Line,
  RiChatSmile2Line,
  RiCheckLine,
  RiCloseLine,
  RiCoinLine,
  RiCrosshairLine,
  RiFireLine,
  RiFocus3Line,
  RiGiftLine,
  RiHammerLine,
  RiHeartPulseLine,
  RiLoader4Line,
  RiLockLine,
  RiMapPinLine,
  RiMicLine,
  RiNavigationLine,
  RiRefreshLine,
  RiRouteLine,
  RiSettings3Line,
  RiShieldLine,
  RiSparklingLine,
  RiStackLine,
  RiSubtractLine,
  RiSwordLine,
  RiTeamLine,
  RiTrophyLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* Shared anatomy */

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";
const cardSurface = "w-full rounded-xl border border-border-button-default bg-background-primary-default shadow-card";
const muted = "text-caption-2-regular text-text-tertiary";
const buttonBase = cx(
  "inline-flex items-center justify-center gap-1.5 rounded-lg text-caption-1-semibold",
  "transition-[transform,background-color,color,box-shadow,opacity] duration-150 ease-out",
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  "motion-reduce:transition-none motion-reduce:active:scale-100",
  focusRing,
);
const primaryButton = cx(buttonBase, "h-8 bg-button-primary px-2.5 text-text-white shadow-xs");
const secondaryButton = cx(
  buttonBase,
  "h-8 border border-border-button-default bg-background-primary-default px-2.5 text-text-primary shadow-xs hover:bg-background-primary-hover",
);
const quietButton = cx(buttonBase, "h-7 px-1.5 text-text-secondary hover:bg-background-secondary-default hover:text-text-primary");
const iconButton = cx(
  "flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-icon-tertiary",
  "transition-[background-color,color] duration-150 ease-out hover:bg-background-tertiary-default hover:text-text-primary",
  "disabled:pointer-events-none disabled:text-foreground-icon-disabled motion-reduce:transition-none",
  focusRing,
);
const chipBase = "inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-caption-2-medium";

const tones = {
  neutral: "bg-background-tertiary-default text-text-secondary",
  lime: "bg-status-lime-background text-status-lime-text",
  yellow: "bg-status-yellow-background text-status-yellow-text",
  orange: "bg-status-orange-background text-status-orange-text",
  blue: "bg-status-blue-background text-status-blue-text",
  purple: "bg-status-purple-background text-status-purple-text",
  rose: "bg-status-rose-background text-status-rose-text",
} as const;

type Tone = keyof typeof tones;

function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return <span className={cx(chipBase, tones[tone])}>{children}</span>;
}

type Rarity = "Common" | "Rare" | "Epic" | "Legendary";

const rarityTone: Record<Rarity, Tone> = {
  Common: "neutral",
  Rare: "blue",
  Epic: "purple",
  Legendary: "yellow",
};

type ArtShape = "blade" | "core" | "sigil" | "crate";

/** Token-built item art: a hex frame with one geometry per item family. */
function ItemArt({ shape, className }: { shape: ArtShape; className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={className}>
      <path d="M20 3 35 11.5v17L20 37 5 28.5v-17Z" fill="currentColor" opacity="0.14" />
      <path d="M20 7 31 13.5v13L20 33 9 26.5v-13Z" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
      {shape === "blade" ? (
        <path d="M26 11 16 27l-2 2 1-4 9-15 2-1v2Z" fill="currentColor" opacity="0.9" />
      ) : shape === "core" ? (
        <>
          <circle cx="20" cy="20" r="5" fill="currentColor" opacity="0.9" />
          <circle cx="20" cy="20" r="8.5" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        </>
      ) : shape === "sigil" ? (
        <path d="M20 11 27 20l-7 9-7-9Z" fill="currentColor" opacity="0.9" />
      ) : (
        <>
          <path d="M13 15h14v11H13z" fill="currentColor" opacity="0.85" />
          <path d="M13 15h14M20 15v11" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
        </>
      )}
    </svg>
  );
}

function Movement({ value }: { value: number }) {
  if (value === 0) {
    return (
      <span className="inline-flex items-center text-caption-2-medium text-text-tertiary">
        <RiSubtractLine className="size-3" aria-hidden />
        <span className="sr-only">No change</span>
      </span>
    );
  }
  const up = value > 0;
  const Icon = up ? RiArrowUpLine : RiArrowDownLine;
  return (
    <span className={cx("inline-flex items-center gap-0.5 text-caption-2-semibold tabular-nums", up ? "text-status-lime-text" : "text-status-rose-text")}>
      <Icon className="size-3" aria-hidden />
      {Math.abs(value)}
      <span className="sr-only">{up ? "places up" : "places down"}</span>
    </span>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cx(
        "relative h-5 w-9 shrink-0 rounded-full",
        "transition-[background-color] duration-150 ease-out motion-reduce:transition-none",
        checked ? "bg-accent-600" : "bg-background-quaternary-default",
        focusRing,
      )}
    >
      <span
        aria-hidden
        className={cx(
          "absolute top-0.5 size-4 rounded-full bg-background-primary-default shadow-xs",
          "transition-[inset-inline-start] duration-200 ease-out motion-reduce:transition-none",
          checked ? "start-4" : "start-0.5",
        )}
      />
    </button>
  );
}

const format = new Intl.NumberFormat("en-US");

/* 1. Achievement Toast */

const ACHIEVEMENT = {
  name: "Nightfall Veteran",
  detail: "Finish a raid without losing a squadmate.",
  xp: 2500,
  start: 3480,
  target: 6000,
} as const;

export function AchievementToast() {
  const [visible, setVisible] = useState(true);
  const [claimed, setClaimed] = useState(false);
  const showRef = useRef<HTMLButtonElement>(null);
  const progress = Math.min(ACHIEVEMENT.target, ACHIEVEMENT.start + (claimed ? ACHIEVEMENT.xp : 0));
  const percent = (progress / ACHIEVEMENT.target) * 100;

  useEffect(() => {
    if (!visible) showRef.current?.focus();
  }, [visible]);

  return (
    <div
      className="w-full max-w-[320px]"
      onKeyDown={(event) => {
        if (event.key === "Escape" && visible) {
          event.stopPropagation();
          setVisible(false);
        }
      }}
    >
      {visible ? (
        <section
          aria-label="Achievement unlocked"
          className={cx(cardSurface, "animate-label-in p-2.5 motion-reduce:animate-none")}
        >
          <div className="flex items-start gap-2">
            <span className="relative flex size-8 shrink-0 items-center justify-center rounded-lg bg-status-yellow-background text-status-yellow-text">
              <RiTrophyLine className="size-4" aria-hidden />
              <span className="absolute -end-1 -top-1 flex size-3.5 items-center justify-center rounded-full bg-accent-600 text-text-white">
                <RiCheckLine className="size-2.5" aria-hidden />
              </span>
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-caption-2-semibold tracking-wide text-status-yellow-text uppercase">Achievement unlocked</p>
              <h3 className="truncate text-body-2-semibold text-text-primary">{ACHIEVEMENT.name}</h3>
            </div>
            <button type="button" aria-label="Dismiss achievement toast" onClick={() => setVisible(false)} className={cx(iconButton, "-me-1 -mt-1")}>
              <RiCloseLine className="size-3.5" aria-hidden />
            </button>
          </div>
          <p className="mt-1 text-caption-2-regular text-text-secondary">{ACHIEVEMENT.detail}</p>
          <div className="mt-1.5 flex items-baseline justify-between gap-2">
            <span className={muted}>Season rank 6</span>
            <span className="text-caption-2-semibold text-text-primary tabular-nums">
              {format.format(progress)} / {format.format(ACHIEVEMENT.target)} XP
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Season XP toward rank 7"
            aria-valuemin={0}
            aria-valuemax={ACHIEVEMENT.target}
            aria-valuenow={progress}
            aria-valuetext={`${progress} of ${ACHIEVEMENT.target} XP`}
            className="mt-0.5 h-1 overflow-hidden rounded-full bg-background-tertiary-default"
          >
            <div className="h-full rounded-full bg-status-yellow-text transition-[width] duration-200 ease-out motion-reduce:transition-none" style={{ width: `${percent}%` }} />
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span aria-live="polite" className={cx("flex min-w-0 items-center gap-1 truncate text-caption-2-medium", claimed ? "text-status-lime-text" : "text-text-secondary")}>
              {claimed ? <RiCheckLine className="size-3.5 shrink-0" aria-hidden /> : <RiSparklingLine className="size-3.5 shrink-0" aria-hidden />}
              {claimed ? "Reward added to your season" : `+${format.format(ACHIEVEMENT.xp)} XP`}
            </span>
            <button type="button" onClick={() => setClaimed(true)} disabled={claimed} className={cx(claimed ? secondaryButton : primaryButton, "h-7 shrink-0")}>
              {claimed ? "Claimed" : "Claim XP"}
            </button>
          </div>
        </section>
      ) : (
        <div className="flex w-full animate-label-in items-center justify-between gap-2 rounded-xl border border-dashed border-border-button-default bg-background-primary-default px-2.5 py-2 motion-reduce:animate-none">
          <span className={muted}>Achievement hidden.</span>
          <button ref={showRef} type="button" onClick={() => setVisible(true)} className={quietButton}>
            <RiRefreshLine className="size-3.5" aria-hidden />
            Show toast
          </button>
        </div>
      )}
    </div>
  );
}

/* 2. Quest Card */

const QUEST_OBJECTIVES = [
  { id: "docks", label: "Reach the lighthouse docks", detail: "Done", done: true },
  { id: "crates", label: "Recover 4 supply crates", detail: "2 / 4", done: false },
  { id: "fog", label: "Survive the fog until dawn", detail: "Night 2", done: false },
] as const;

type ObjectiveId = (typeof QUEST_OBJECTIVES)[number]["id"];

const QUEST_START: Record<ObjectiveId, boolean> = { docks: true, crates: false, fog: false };

export function QuestCard() {
  const [done, setDone] = useState<Record<ObjectiveId, boolean>>(QUEST_START);
  const [claimed, setClaimed] = useState(false);
  const complete = QUEST_OBJECTIVES.filter((objective) => done[objective.id]).length;
  const allDone = complete === QUEST_OBJECTIVES.length;

  const takeReward = () => {
    if (claimed) {
      setDone(QUEST_START);
      setClaimed(false);
    } else {
      setClaimed(true);
    }
  };

  return (
    <section aria-label="Quest: The Ember Route" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-caption-2-semibold tracking-wide text-accent-600 uppercase">Main quest · Ashfall</p>
          <h3 className="truncate text-body-2-semibold text-text-primary">The Ember Route</h3>
        </div>
        <Badge tone="orange">Lv. 12</Badge>
      </div>

      <ul className="mt-1.5 flex flex-col">
        {QUEST_OBJECTIVES.map((objective) => {
          const checked = done[objective.id];
          return (
            <li key={objective.id}>
              <button
                type="button"
                role="checkbox"
                aria-checked={checked}
                onClick={() => {
                  setDone((current) => ({ ...current, [objective.id]: !current[objective.id] }));
                  setClaimed(false);
                }}
                className={cx("group flex h-6 w-full items-center gap-1.5 rounded-md px-0.5 text-start", focusRing)}
              >
                <span className={cx("flex size-4 shrink-0 items-center justify-center rounded-full border", "transition-[background-color,border-color,color] duration-200 ease-out motion-reduce:transition-none", checked ? "border-accent-600 bg-accent-600 text-text-white" : "border-border-checkbox-default bg-background-primary-default group-hover:border-border-checkbox-hover")}>
                  <RiCheckLine className={cx("size-2.5 transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none", checked ? "scale-100 opacity-100" : "scale-50 opacity-0")} aria-hidden />
                </span>
                <span className={cx("min-w-0 flex-1 truncate text-caption-1-medium transition-[color] duration-200 ease-out motion-reduce:transition-none", checked ? "text-text-tertiary line-through" : "text-text-primary")}>
                  {objective.label}
                </span>
                <span className={cx("shrink-0 text-caption-2-regular tabular-nums", checked ? "text-status-lime-text" : "text-text-tertiary")}>
                  {checked ? "Done" : objective.detail}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div
        role="progressbar"
        aria-label="Quest objectives complete"
        aria-valuemin={0}
        aria-valuemax={QUEST_OBJECTIVES.length}
        aria-valuenow={complete}
        aria-valuetext={`${complete} of ${QUEST_OBJECTIVES.length} objectives`}
        className="mt-1 h-1 overflow-hidden rounded-full bg-background-tertiary-default"
      >
        <div className="h-full rounded-full bg-accent-500 transition-[width] duration-200 ease-out motion-reduce:transition-none" style={{ width: `${(complete / QUEST_OBJECTIVES.length) * 100}%` }} />
      </div>

      <div className="mt-1.5 flex items-center gap-2">
        <span className="flex min-w-0 flex-1 items-center gap-1 text-caption-2-medium text-text-secondary">
          <RiCoinLine className="size-3.5 shrink-0 text-status-yellow-text" aria-hidden />
          850 <span className="text-text-tertiary">+</span>
          <Badge tone="purple">Ember Sigil</Badge>
        </span>
        <button type="button" disabled={!allDone && !claimed} onClick={takeReward} className={cx(claimed || allDone ? primaryButton : secondaryButton, "h-7 shrink-0")}>
          {claimed ? (
            <><RiRefreshLine className="size-3.5" aria-hidden />Run again</>
          ) : allDone ? (
            <><RiGiftLine className="size-3.5" aria-hidden />Claim reward</>
          ) : (
            `${QUEST_OBJECTIVES.length - complete} left`
          )}
        </button>
      </div>
      <p aria-live="polite" className="sr-only">
        {claimed ? "Reward claimed: 850 coins and the Ember Sigil." : `${complete} of ${QUEST_OBJECTIVES.length} objectives complete.`}
      </p>
    </section>
  );
}

/* 3. Rank Row */

type RankScope = "week" | "season";

const RANK_ROWS: Record<RankScope, { rank: number; name: string; initials: string; tier: string; score: number; movement: number; progress: number; toNext: number; next: string; matches: number; percentile: number }> = {
  week: { rank: 4, name: "Rook Vandal", initials: "RV", tier: "Diamond II", score: 12480, movement: 2, progress: 62, toNext: 380, next: "Master", matches: 46, percentile: 8 },
  season: { rank: 11, name: "Rook Vandal", initials: "RV", tier: "Diamond II", score: 84210, movement: -3, progress: 41, toNext: 1240, next: "Master", matches: 212, percentile: 4 },
};

const RANK_SCOPES = [
  { value: "week", label: "Week" },
  { value: "season", label: "Season" },
] as const;

export function RankRow() {
  const [scope, setScope] = useState<RankScope>("week");
  const row = RANK_ROWS[scope];

  return (
    <section aria-label="Ranked ladder row" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Ladder</h3>
        <div role="group" aria-label="Ladder period" className="flex rounded-md bg-background-secondary-default p-0.5">
          {RANK_SCOPES.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={scope === option.value}
              onClick={() => setScope(option.value)}
              className={cx(
                "h-5 rounded-sm px-1.5 text-caption-2-semibold",
                "transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                scope === option.value
                  ? "bg-segmented-control-selected-background text-text-primary shadow-xs"
                  : "text-text-tertiary hover:text-text-secondary",
                focusRing,
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div key={scope} className="mt-1.5 animate-label-in motion-reduce:animate-none">
        <div className="flex items-center gap-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-caption-1-semibold text-text-secondary tabular-nums">
            {row.rank}
          </span>
          <span aria-hidden className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-600 text-caption-2-semibold text-text-white">
            {row.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-caption-1-semibold text-text-primary">{row.name}</p>
            <p className={cx("truncate", muted)}>{row.tier} · Rank {row.rank}</p>
          </div>
          <div className="shrink-0 text-end">
            <p className="text-caption-1-semibold text-text-primary tabular-nums">{format.format(row.score)}</p>
            <div className="flex justify-end">
              <Movement value={row.movement} />
            </div>
          </div>
        </div>

        <div className="mt-1.5 flex items-baseline justify-between gap-2">
          <span className={muted}>{row.matches} matches · Top {row.percentile}%</span>
          <span className="text-caption-2-medium text-text-secondary tabular-nums">
            {format.format(row.toNext)} to {row.next}
          </span>
        </div>
        <div
          role="progressbar"
          aria-label={`Progress to ${row.next}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={row.progress}
          className="mt-0.5 h-1 overflow-hidden rounded-full bg-background-tertiary-default"
        >
          <div
            className="h-full rounded-full bg-accent-500 transition-[width] duration-200 ease-out motion-reduce:transition-none"
            style={{ width: `${row.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-1.5 flex items-center gap-1.5 border-t border-separator-border pt-1.5">
        <span className={muted}>Duo</span>
        <span aria-hidden className="flex size-5 shrink-0 items-center justify-center rounded-full bg-background-tertiary-default text-caption-2-semibold text-text-secondary">
          SL
        </span>
        <span className="truncate text-caption-2-medium text-text-secondary">Sable Lin</span>
        <span className="ms-auto shrink-0 text-caption-2-regular text-text-tertiary tabular-nums">11,920</span>
      </div>
    </section>
  );
}

/* 4. Inventory Slot */

export function InventorySlot() {
  const [equipped, setEquipped] = useState(false);

  return (
    <section aria-label="Inventory slot: Ashfall Blade" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Inventory</h3>
        <span className={muted}>Backpack 12 / 24</span>
      </div>

      <div
        className={cx(
          "mt-1.5 flex items-center gap-2 rounded-lg border p-1.5",
          "transition-[background-color,border-color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
          equipped
            ? "border-accent-500 bg-background-secondary-default shadow-xs"
            : "border-status-purple-text/30 bg-background-primary-default",
        )}
      >
        <span
          className={cx(
            "relative flex size-11 shrink-0 items-center justify-center rounded-md bg-status-purple-background text-status-purple-text",
            "transition-[transform] duration-200 ease-out motion-reduce:transition-none",
            equipped ? "scale-105" : "scale-100",
          )}
        >
          <ItemArt shape="blade" className="size-8" />
          <span className="absolute -bottom-1 -end-1 flex size-4 items-center justify-center rounded-full border border-border-button-default bg-background-primary-default text-caption-2-semibold text-text-secondary">
            34
          </span>
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <h4 className="truncate text-body-2-semibold text-text-primary">Ashfall Blade</h4>
            <Badge tone={rarityTone.Epic}>Epic</Badge>
          </div>
          <p className={cx("truncate", muted)}>Sword · Bound · Lv. 34</p>
          <p className="truncate text-caption-2-medium text-text-secondary">+18% crit · +42 power</p>
        </div>

        <button
          type="button"
          aria-pressed={equipped}
          onClick={() => setEquipped((current) => !current)}
          className={cx(equipped ? secondaryButton : primaryButton, "h-7 w-[66px] shrink-0 px-1")}
        >
          {equipped ? "Equipped" : "Equip"}
        </button>
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span className={muted}>Slot 2 of 3</span>
        <span
          aria-live="polite"
          className={cx(
            "truncate text-caption-2-medium transition-[color] duration-200 ease-out motion-reduce:transition-none",
            equipped ? "text-status-lime-text" : "text-text-tertiary",
          )}
        >
          {equipped ? "Equipped · +18% crit active" : "Unequipped · stats inactive"}
        </span>
      </div>
    </section>
  );
}

/* 5. Party Member */

const PARTY_MEMBER = {
  name: "Mara Voss",
  initials: "MV",
  role: "Warden",
  level: 32,
  health: 82,
  maxHealth: 100,
} as const;

export function PartyMember() {
  const [ready, setReady] = useState(false);
  const healthPercent = (PARTY_MEMBER.health / PARTY_MEMBER.maxHealth) * 100;

  return (
    <section aria-label="Party member: Mara Voss" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <RiTeamLine className="size-4 text-foreground-icon-secondary" aria-hidden />
          <h3 className="text-body-2-semibold text-text-primary">Party</h3>
          <span className={muted}>3 of 4</span>
        </div>
        <span className="flex items-center gap-1 text-caption-2-medium text-status-lime-text">
          <RiMicLine className="size-3" aria-hidden />
          Voice on
        </span>
      </div>

      <div className="mt-1.5 flex items-center gap-2">
        <span className="relative inline-flex">
          <span aria-hidden className="flex size-9 items-center justify-center rounded-full bg-accent-100 text-caption-1-semibold text-accent-700">
            {PARTY_MEMBER.initials}
          </span>
          <span
            className={cx(
              "absolute end-0 bottom-0 size-2.5 rounded-full ring-2 ring-background-primary-default",
              "transition-[background-color] duration-200 ease-out motion-reduce:transition-none",
              ready ? "bg-status-lime-text" : "bg-status-yellow-text",
            )}
            aria-hidden
          />
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-body-2-semibold text-text-primary">{PARTY_MEMBER.name}</h4>
          <p className={cx("truncate", muted)}>
            {PARTY_MEMBER.role} · Lv. {PARTY_MEMBER.level}
          </p>
        </div>
        <button
          type="button"
          aria-pressed={ready}
          onClick={() => setReady((current) => !current)}
          className={cx(
            ready ? secondaryButton : primaryButton,
            "h-7 shrink-0 px-2",
            ready && "text-status-lime-text",
          )}
        >
          {ready ? (
            <>
              <RiCheckLine className="size-3.5" aria-hidden />
              Ready
            </>
          ) : (
            "Ready up"
          )}
        </button>
      </div>

      <div className="mt-1.5 flex items-center gap-2">
        <RiHeartPulseLine
          className={cx("size-3.5 shrink-0", ready ? "text-status-lime-text" : "text-foreground-icon-tertiary")}
          aria-hidden
        />
        <div
          role="progressbar"
          aria-label="Mara Voss health"
          aria-valuemin={0}
          aria-valuemax={PARTY_MEMBER.maxHealth}
          aria-valuenow={PARTY_MEMBER.health}
          aria-valuetext={`${PARTY_MEMBER.health} of ${PARTY_MEMBER.maxHealth} health`}
          className="h-1 flex-1 overflow-hidden rounded-full bg-background-tertiary-default"
        >
          <div
            className={cx(
              "h-full rounded-full transition-[width,background-color] duration-200 ease-out motion-reduce:transition-none",
              PARTY_MEMBER.health < 35 ? "bg-status-rose-text" : "bg-status-lime-text",
            )}
            style={{ width: `${healthPercent}%` }}
          />
        </div>
        <span className="shrink-0 text-caption-2-medium text-text-secondary tabular-nums">
          {PARTY_MEMBER.health} / {PARTY_MEMBER.maxHealth}
        </span>
      </div>

      <p aria-live="polite" className={cx("mt-1 truncate", muted)}>
        {ready ? "Mara is ready · waiting on one more" : "Not ready · queue starts in 1:12"}
      </p>
    </section>
  );
}

/* 6. Match Summary */

type RematchState = "idle" | "searching" | "ready";

const MATCH = {
  result: "Victory",
  map: "Redline Depot",
  mode: "Ranked Control",
  score: "3–1",
  kills: 24,
  deaths: 11,
  assists: 7,
  rating: 8420,
  delta: 18,
} as const;

export function MatchSummary() {
  const [status, setStatus] = useState<RematchState>("idle");

  useEffect(() => {
    if (status !== "searching") return;
    const timer = window.setTimeout(() => setStatus("ready"), 1100);
    return () => window.clearTimeout(timer);
  }, [status]);

  return (
    <section aria-label="Match summary" className={cx(cardSurface, "max-w-[320px] p-3")}>
      <div className="flex items-start gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-status-lime-background text-status-lime-text">
          <RiTrophyLine className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-caption-2-semibold tracking-wide text-status-lime-text uppercase">{MATCH.result}</p>
          <h3 className="truncate text-body-2-semibold text-text-primary">{MATCH.map}</h3>
          <p className={cx("truncate", muted)}>{MATCH.mode}</p>
        </div>
        <p className="shrink-0 text-title-3-semibold text-text-primary tabular-nums">{MATCH.score}</p>
      </div>

      <dl className="mt-2 grid grid-cols-4 divide-x divide-separator-border rounded-lg bg-background-secondary-default py-1">
        {[
          { label: "Kills", value: MATCH.kills },
          { label: "Deaths", value: MATCH.deaths },
          { label: "Assists", value: MATCH.assists },
          { label: "Score", value: format.format(MATCH.rating) },
        ].map((stat) => (
          <div key={stat.label} className="flex min-w-0 flex-col items-center">
            <dt className="text-caption-2-regular text-text-tertiary">{stat.label}</dt>
            <dd className="text-caption-1-semibold text-text-primary tabular-nums">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-2 flex items-center justify-between gap-2">
        <span aria-live="polite" className="flex min-w-0 items-center gap-1 truncate text-caption-2-medium text-text-secondary">
          {status === "ready" ? (
            <>
              <RiCheckLine className="size-3.5 shrink-0 text-status-lime-text" aria-hidden />
              Lobby formed · 4 of 4 ready
            </>
          ) : status === "searching" ? (
            <>
              <RiLoader4Line className="size-3.5 shrink-0 animate-spin text-accent-600 motion-reduce:animate-none" aria-hidden />
              Finding a squad in your rank…
            </>
          ) : (
            <>
              <RiCrosshairLine className="size-3.5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
              Rating +{MATCH.delta} · MVP
            </>
          )}
        </span>
        <button
          type="button"
          disabled={status === "searching"}
          onClick={() => setStatus(status === "ready" ? "idle" : "searching")}
          className={cx(status === "ready" ? secondaryButton : primaryButton, "h-7 shrink-0 px-2")}
        >
          {status === "searching" ? (
            <>
              <RiLoader4Line className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
              Searching
            </>
          ) : status === "ready" ? (
            "Leave lobby"
          ) : (
            <>
              <RiRefreshLine className="size-3.5" aria-hidden />
              Rematch
            </>
          )}
        </button>
      </div>
    </section>
  );
}

/* 7. Season Pass */

const SEASON_TIERS: { tier: number; reward: string; rarity: Rarity; shape: ArtShape; xp: number }[] = [
  { tier: 1, reward: "Havoc Crate", rarity: "Common", shape: "crate", xp: 600 },
  { tier: 2, reward: "Signal Dye", rarity: "Rare", shape: "core", xp: 1200 },
  { tier: 3, reward: "Ashfall Blade", rarity: "Epic", shape: "blade", xp: 1800 },
  { tier: 4, reward: "1,200 Coins", rarity: "Rare", shape: "crate", xp: 2400 },
  { tier: 5, reward: "Ember Sigil", rarity: "Epic", shape: "sigil", xp: 3000 },
  { tier: 6, reward: "Nightfall Skin", rarity: "Legendary", shape: "core", xp: 3600 },
];

export function SeasonPass() {
  const [current, setCurrent] = useState(3);
  const [selected, setSelected] = useState(3);
  const [justClaimed, setJustClaimed] = useState<number | null>(null);
  const reward = SEASON_TIERS.find((item) => item.tier === selected) ?? SEASON_TIERS[0];
  const claimable = selected === current;

  const claim = () => {
    setJustClaimed(current);
    setCurrent((tier) => Math.min(SEASON_TIERS.length + 1, tier + 1));
    setSelected((tier) => Math.min(SEASON_TIERS.length, tier + 1));
  };

  return (
    <section aria-label="Season 04 pass" className={cx(cardSurface, "max-w-[560px] p-3")}>
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <RiSparklingLine className="size-4 text-status-yellow-text" aria-hidden />
          <h3 className="text-body-2-semibold text-text-primary">Season 04 · Ashfall</h3>
        </div>
        <span aria-live="polite" className={cx("truncate text-caption-2-medium", justClaimed ? "text-status-lime-text" : "text-text-tertiary")}>
          {justClaimed ? `Tier ${justClaimed} claimed` : "24 days left"}
        </span>
      </div>

      <div className="mt-1 flex items-baseline justify-between gap-2">
        <span className={muted}>Tier {Math.min(current, SEASON_TIERS.length)} of {SEASON_TIERS.length}</span>
        <span className="text-caption-2-medium text-text-secondary tabular-nums">{format.format(Math.min(SEASON_TIERS.length, current - 1) * 600)} / 3,600 XP</span>
      </div>
      <div
        role="progressbar"
        aria-label="Season tier progress"
        aria-valuemin={0}
        aria-valuemax={SEASON_TIERS.length}
        aria-valuenow={Math.min(SEASON_TIERS.length, current - 1)}
        className="mt-0.5 h-1 overflow-hidden rounded-full bg-background-tertiary-default"
      >
        <div
          className="h-full rounded-full bg-status-yellow-text transition-[width] duration-200 ease-out motion-reduce:transition-none"
          style={{ width: `${(Math.min(SEASON_TIERS.length, current - 1) / SEASON_TIERS.length) * 100}%` }}
        />
      </div>

      <div className="relative mt-2">
        <div aria-hidden className="absolute inset-x-3 top-3 h-0.5 rounded-full bg-background-tertiary-default" />
        <div
          aria-hidden
          className="absolute start-3 top-3 h-0.5 rounded-full bg-accent-500 transition-[width] duration-200 ease-out motion-reduce:transition-none"
          style={{ width: `calc((100% - 24px) * ${(Math.min(current, SEASON_TIERS.length) - 1) / (SEASON_TIERS.length - 1)})` }}
        />
        <ol aria-label="Season tiers" className="relative flex items-start justify-between">
          {SEASON_TIERS.map((item) => {
            const claimedTier = item.tier < current;
            const active = item.tier === current;
            const chosen = item.tier === selected;
            return (
              <li key={item.tier}>
                <button
                  type="button"
                  aria-label={`Tier ${item.tier}: ${item.reward}, ${claimedTier ? "claimed" : active ? "available" : "locked"}`}
                  aria-pressed={chosen}
                  onClick={() => setSelected(item.tier)}
                  className={cx(
                    "relative flex size-6 items-center justify-center rounded-full border text-caption-2-semibold",
                    "transition-[background-color,border-color,color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
                    claimedTier
                      ? "border-accent-600 bg-accent-600 text-text-white"
                      : active
                        ? "border-accent-600 bg-background-primary-default text-accent-600"
                        : "border-border-button-default bg-background-primary-default text-text-tertiary",
                    chosen && "ring-2 ring-accent-500/30",
                    focusRing,
                  )}
                >
                  {claimedTier ? <RiCheckLine className="size-3" aria-hidden /> : active ? item.tier : <RiLockLine className="size-2.5" aria-hidden />}
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-separator-border bg-background-secondary-default p-1.5">
        <span className={cx("flex size-9 shrink-0 items-center justify-center rounded-md", tones[rarityTone[reward.rarity]])}>
          <ItemArt shape={reward.shape} className="size-6" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <p className="truncate text-caption-1-semibold text-text-primary">{reward.reward}</p>
            <Badge tone={rarityTone[reward.rarity]}>{reward.rarity}</Badge>
          </div>
          <p className={cx("truncate", muted)}>Tier {reward.tier} · {format.format(reward.xp)} XP</p>
        </div>
        <button type="button" disabled={!claimable || justClaimed === selected} onClick={claim} className={cx(claimable ? primaryButton : secondaryButton, "h-7 shrink-0 px-2")}>
          {claimable ? (
            <><RiGiftLine className="size-3.5" aria-hidden />Claim</>
          ) : selected < current ? (
            <><RiCheckLine className="size-3.5" aria-hidden />Claimed</>
          ) : (
            <><RiLockLine className="size-3.5" aria-hidden />Locked</>
          )}
        </button>
      </div>
    </section>
  );
}

/* 8. Daily Reward */

const DAILY_REWARDS = [
  { day: "Mon", value: 50 },
  { day: "Tue", value: 75 },
  { day: "Wed", value: 100 },
  { day: "Thu", value: 150 },
  { day: "Fri", value: 200 },
  { day: "Sat", value: 300 },
  { day: "Sun", value: 500 },
] as const;

export function DailyReward() {
  const [claimed, setClaimed] = useState(3);
  const [justClaimed, setJustClaimed] = useState<number | null>(null);
  const complete = claimed >= DAILY_REWARDS.length;
  const next = DAILY_REWARDS[Math.min(claimed, DAILY_REWARDS.length - 1)];

  const advance = () => {
    if (complete) {
      setClaimed(0);
      setJustClaimed(null);
      return;
    }
    const day = claimed + 1;
    setClaimed(day);
    setJustClaimed(day);
  };

  return (
    <section aria-label="Daily reward streak" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="flex size-6 items-center justify-center rounded-md bg-status-orange-background text-status-orange-text">
            <RiFireLine className="size-3.5" aria-hidden />
          </span>
          <h3 className="text-body-2-semibold text-text-primary">Daily reward</h3>
        </div>
        <Badge tone="orange">{claimed}-day streak</Badge>
      </div>

      <div className="mt-1 flex items-baseline justify-between gap-2">
        <span className={muted}>{claimed} of {DAILY_REWARDS.length} claimed</span>
        <span className="text-caption-2-medium text-text-secondary tabular-nums">{complete ? "Week complete" : `Next: ${next.value} coins`}</span>
      </div>
      <div
        role="progressbar"
        aria-label="Weekly reward progress"
        aria-valuemin={0}
        aria-valuemax={DAILY_REWARDS.length}
        aria-valuenow={claimed}
        className="mt-0.5 h-1 overflow-hidden rounded-full bg-background-tertiary-default"
      >
        <div
          className="h-full rounded-full bg-status-orange-text transition-[width] duration-200 ease-out motion-reduce:transition-none"
          style={{ width: `${(claimed / DAILY_REWARDS.length) * 100}%` }}
        />
      </div>

      <ol aria-label="Rewards this week" className="mt-1.5 flex gap-1">
        {DAILY_REWARDS.map((day, index) => {
          const isClaimed = index < claimed;
          const isToday = index === claimed;
          return (
            <li
              key={day.day}
              aria-label={`${day.day}: ${day.value} coins, ${isClaimed ? "claimed" : isToday ? "available today" : "locked"}`}
              className="flex min-w-0 flex-1 flex-col items-center gap-0.5"
            >
              <span className={cx("text-caption-2-medium", isToday ? "text-text-primary" : "text-text-tertiary")}>{day.day}</span>
              <span
                className={cx(
                  "flex h-7 w-full items-center justify-center rounded-md border",
                  "transition-[background-color,border-color,color,transform] duration-200 ease-out motion-reduce:transition-none",
                  isClaimed
                    ? "border-transparent bg-status-lime-background text-status-lime-text"
                    : isToday
                      ? "border-accent-500 bg-background-primary-default text-accent-600 ring-2 ring-accent-500/15"
                      : "border-border-button-default bg-background-secondary-default text-text-tertiary",
                  isClaimed && justClaimed === index + 1 && "scale-105",
                )}
              >
                {isClaimed ? <RiCheckLine className="size-3.5" aria-hidden /> : isToday ? <RiCoinLine className="size-3.5" aria-hidden /> : <RiLockLine className="size-3" aria-hidden />}
              </span>
              <span className={cx("text-caption-2-regular tabular-nums", isClaimed ? "text-text-secondary" : "text-text-tertiary")}>{day.value}</span>
            </li>
          );
        })}
      </ol>

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span aria-live="polite" className={cx("min-w-0 truncate text-caption-2-medium", justClaimed ? "text-status-lime-text" : "text-text-tertiary")}>
          {complete ? "Seven days banked. New week ready." : justClaimed ? `Day ${justClaimed} claimed · +${DAILY_REWARDS[justClaimed - 1].value} coins` : "Claim before midnight to keep the streak."}
        </span>
        <button type="button" onClick={advance} className={cx(complete ? secondaryButton : primaryButton, "h-7 shrink-0 px-2")}>
          {complete ? (
            <>
              <RiRefreshLine className="size-3.5" aria-hidden />
              New week
            </>
          ) : (
            <>
              <RiCoinLine className="size-3.5" aria-hidden />
              Claim {next.value}
            </>
          )}
        </button>
      </div>
    </section>
  );
}

/* 9. Crafting Recipe */

const RECIPE_INGREDIENTS = [
  { id: "ore", name: "Ashen Ore", need: 4 },
  { id: "salt", name: "Void Salt", need: 2 },
  { id: "glass", name: "Cinder Glass", need: 3 },
] as const;

type IngredientId = (typeof RECIPE_INGREDIENTS)[number]["id"];

const CRAFT_START: Record<IngredientId, number> = { ore: 10, salt: 5, glass: 7 };

type CraftState = "idle" | "crafting" | "done";

export function CraftingRecipe() {
  const [stock, setStock] = useState<Record<IngredientId, number>>(CRAFT_START);
  const [owned, setOwned] = useState(2);
  const [status, setStatus] = useState<CraftState>("idle");
  const canCraft = RECIPE_INGREDIENTS.every((item) => stock[item.id] >= item.need);

  useEffect(() => {
    if (status !== "crafting") return;
    const timer = window.setTimeout(() => {
      setStock((current) => {
        const next = { ...current };
        RECIPE_INGREDIENTS.forEach((item) => {
          next[item.id] = current[item.id] - item.need;
        });
        return next;
      });
      setOwned((count) => count + 1);
      setStatus("done");
    }, 900);
    return () => window.clearTimeout(timer);
  }, [status]);

  const reset = () => {
    setStock(CRAFT_START);
    setOwned(2);
    setStatus("idle");
  };

  return (
    <section aria-label="Crafting recipe: Ember Sigil" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <RiHammerLine className="size-4 text-foreground-icon-secondary" aria-hidden />
          <h3 className="text-body-2-semibold text-text-primary">Forge</h3>
        </div>
        <Badge tone="purple">Owned {owned}</Badge>
      </div>

      <div className="mt-1.5 flex items-center gap-2">
        <span className={cx("flex size-9 shrink-0 items-center justify-center rounded-md", tones[rarityTone.Epic], status === "done" && "animate-label-in motion-reduce:animate-none")}>
          <ItemArt shape="sigil" className="size-6" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <h4 className="truncate text-caption-1-semibold text-text-primary">Ember Sigil</h4>
            <Badge tone="purple">Epic</Badge>
          </div>
          <p aria-live="polite" className={cx("truncate", status === "done" ? "text-caption-2-medium text-status-lime-text" : muted)}>
            {status === "crafting" ? "Binding embers…" : status === "done" ? "Crafted · +6% ability power" : "Trinket · +6% ability power"}
          </p>
        </div>
      </div>

      <ul aria-label="Ingredients" className="mt-1.5 flex flex-col">
        {RECIPE_INGREDIENTS.map((item) => {
          const enough = stock[item.id] >= item.need;
          return (
            <li key={item.id} className="flex h-5 items-center gap-1.5">
              <span aria-hidden className={cx("size-1.5 shrink-0 rounded-full", enough ? "bg-status-lime-text" : "bg-status-rose-text")} />
              <span className="min-w-0 flex-1 truncate text-caption-2-regular text-text-secondary">{item.name}</span>
              <span className={cx("shrink-0 text-caption-2-medium tabular-nums", enough ? "text-text-secondary" : "text-text-error-primary")}>
                {stock[item.id]} / {item.need}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-1.5 flex items-center gap-1.5">
        <button
          type="button"
          disabled={!canCraft || status === "crafting"}
          onClick={() => setStatus("crafting")}
          className={cx(canCraft ? primaryButton : secondaryButton, "h-7 min-w-0 flex-1")}
        >
          {status === "crafting" ? (
            <>
              <RiLoader4Line className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
              Crafting
            </>
          ) : canCraft ? (
            <>
              <RiHammerLine className="size-3.5" aria-hidden />
              {status === "done" ? "Craft again" : "Craft"}
            </>
          ) : (
            <>
              <RiBox3Line className="size-3.5" aria-hidden />
              Gather more
            </>
          )}
        </button>
        <button type="button" aria-label="Restock ingredients" onClick={reset} className={cx(iconButton, "border border-border-button-default bg-background-primary-default")}>
          <RiRefreshLine className="size-3.5" aria-hidden />
        </button>
      </div>
    </section>
  );
}

/* 10. Waypoint */

const WAYPOINT = {
  name: "Old Water Tower",
  region: "Ashfall · Zone 3",
  distance: "1.4 km",
  time: "6 min",
  cache: "Survey cache · 240 coins",
} as const;

export function Waypoint() {
  const [progress, setProgress] = useState(0);
  const [traveling, setTraveling] = useState(false);
  const arrived = progress >= 100;

  useEffect(() => {
    if (!traveling) return;
    const timer = window.setInterval(() => {
      setProgress((current) => Math.min(100, current + 10));
    }, 140);
    return () => window.clearInterval(timer);
  }, [traveling]);

  useEffect(() => {
    if (!traveling || progress < 100) return;
    setTraveling(false);
  }, [progress, traveling]);

  const travel = () => {
    if (traveling) {
      setTraveling(false);
      return;
    }
    if (arrived) {
      setProgress(0);
      return;
    }
    setTraveling(true);
  };

  return (
    <section
      aria-label="Waypoint: Old Water Tower"
      className={cx(cardSurface, "max-w-[320px] p-2.5")}
      onKeyDown={(event) => {
        if (event.key === "Escape" && traveling) {
          event.stopPropagation();
          setTraveling(false);
        }
      }}
    >
      <div className="flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
          <RiMapPinLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">Waypoint</h3>
          <p className={cx("truncate", muted)}>{WAYPOINT.region}</p>
        </div>
        <Badge tone={arrived ? "lime" : "neutral"}>{WAYPOINT.distance}</Badge>
      </div>

      <div className="relative mt-1.5 h-14 overflow-hidden rounded-lg border border-separator-border bg-background-secondary-default">
        <svg viewBox="0 0 288 56" className="absolute inset-0 size-full" aria-hidden>
          <path d="M0 46 52 46 78 28 120 28 148 40 214 40 240 22 288 22" fill="none" className="stroke-separator-border" strokeWidth="6" strokeLinejoin="round" />
          <path d="M0 12 46 12 70 30 128 30 168 8 232 8 288 36" fill="none" className="stroke-border-button-default" strokeWidth="1" strokeDasharray="3 5" />
          <path d="M18 42C80 42 88 16 148 20S228 34 270 14" fill="none" pathLength={100} strokeDasharray="100" strokeWidth="2" strokeLinecap="round" className="stroke-accent-500 transition-[stroke-dashoffset] duration-200 ease-out motion-reduce:transition-none" style={{ strokeDashoffset: 100 - progress }} />
          <circle cx="270" cy="14" r="4" className="fill-status-lime-text" />
        </svg>

        <span
          aria-hidden
          className={cx(
            "absolute flex size-5 items-center justify-center rounded-full bg-accent-600 text-text-white shadow-xs -translate-x-1/2 -translate-y-1/2",
            "transition-[left,top] duration-200 ease-out motion-reduce:transition-none",
            traveling && "animate-pulse motion-reduce:animate-none",
          )}
          style={{ left: `${6 + progress * 0.86}%`, top: `${72 - progress * 0.44}%` }}
        >
          <RiNavigationLine className="size-3 rtl:-scale-x-100" aria-hidden />
        </span>
      </div>

      <div className="mt-1.5 flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-1-semibold text-text-primary">{WAYPOINT.name}</p>
          <p className={cx("truncate", muted)}>
            {traveling ? `Traveling · ${progress}%` : arrived ? "Arrived · cache within reach" : `${WAYPOINT.cache} · ${WAYPOINT.time} on foot`}
          </p>
          <span className="sr-only" role="status">
            {arrived ? `Arrived at ${WAYPOINT.name}. Survey cache within reach.` : ""}
          </span>
        </div>
        <button type="button" onClick={travel} className={cx(traveling || arrived ? secondaryButton : primaryButton, "h-7 shrink-0 px-2")}>
          {traveling ? (
            <><RiCloseLine className="size-3.5" aria-hidden />Cancel</>
          ) : arrived ? (
            <><RiRefreshLine className="size-3.5" aria-hidden />Return</>
          ) : progress > 0 ? (
            "Resume"
          ) : (
            <><RiRouteLine className="size-3.5" aria-hidden />Travel</>
          )}
        </button>
      </div>
    </section>
  );
}

/* 11. Chat Wheel */

const WHEEL_MESSAGES = [
  { id: "push", label: "Push mid", icon: RiSwordLine, x: 0, y: -38 },
  { id: "ammo", label: "Need ammo", icon: RiStackLine, x: 33, y: -19 },
  { id: "fall", label: "Fall back", icon: RiShieldLine, x: 33, y: 19 },
  { id: "regroup", label: "Regroup", icon: RiFocus3Line, x: 0, y: 38 },
  { id: "nice", label: "Nice shot", icon: RiChatSmile2Line, x: -33, y: 19 },
  { id: "omw", label: "On my way", icon: RiNavigationLine, x: -33, y: -19 },
] as const;

export function ChatWheel() {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState("Pick a callout");
  const [sent, setSent] = useState<string | null>(null);
  const openRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (!open) {
      if (wasOpen.current) openRef.current?.focus();
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const send = (label: string) => {
    setSent(label);
    setPreview(label);
    setOpen(false);
  };

  return (
    <section aria-label="Squad quick chat" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <RiChat3Line className="size-4 text-foreground-icon-secondary" aria-hidden />
          <h3 className="text-body-2-semibold text-text-primary">Quick chat</h3>
        </div>
        {open ? (
          <button ref={closeRef} type="button" aria-label="Close chat wheel" onClick={() => setOpen(false)} className={iconButton}>
            <RiCloseLine className="size-3.5" aria-hidden />
          </button>
        ) : (
          <span className={muted}>Squad · 4 of 4</span>
        )}
      </div>

      {open ? (
        <div className="animate-label-in motion-reduce:animate-none">
          <div className="relative mx-auto mt-1.5 size-28" role="group" aria-label="Quick messages">
            <span aria-hidden className="absolute inset-3 rounded-full border border-dashed border-separator-border" />
            <span className="absolute start-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-border-button-default bg-background-primary-default px-1 text-center shadow-xs">
              <span className="text-caption-2-semibold text-text-primary">Squad</span>
              <span className="text-caption-2-regular text-text-tertiary">{WHEEL_MESSAGES.length} calls</span>
            </span>
            {WHEEL_MESSAGES.map((message) => {
              const Icon = message.icon;
              return (
                <button
                  key={message.id}
                  type="button"
                  aria-label={`Send quick message: ${message.label}`}
                  onMouseEnter={() => setPreview(message.label)}
                  onFocus={() => setPreview(message.label)}
                  onClick={() => send(message.label)}
                  className={cx(
                    "absolute start-1/2 top-1/2 flex size-7 items-center justify-center rounded-full border border-border-button-default bg-background-primary-default text-foreground-icon-secondary shadow-xs",
                    "transition-[background-color,border-color,color,box-shadow] duration-150 ease-out hover:border-accent-500 hover:bg-background-secondary-default hover:text-accent-600 motion-reduce:transition-none",
                    focusRing,
                  )}
                  style={{ transform: `translate(-50%, -50%) translate(${message.x}px, ${message.y}px)` }}
                >
                  <Icon className={cx("size-3.5", message.id === "omw" && "rtl:-scale-x-100")} aria-hidden />
                </button>
              );
            })}
          </div>
          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="truncate text-caption-2-medium text-text-secondary">{preview}</span>
            <span className={muted}>Esc closes</span>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-dashed border-border-button-default bg-background-secondary-default p-1.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background-primary-default text-accent-600 shadow-xs">
              <RiChat3Line className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p key={sent ?? "idle"} aria-live="polite" className="animate-label-in truncate text-caption-1-semibold text-text-primary motion-reduce:animate-none">{sent ? `Sent · ${sent}` : "No callouts yet"}</p>
              <p className="truncate text-caption-2-regular text-text-tertiary">{sent ? "Delivered to all four players." : "Six callouts, one tap each."}</p>
            </div>
            <button ref={openRef} type="button" aria-expanded={open} onClick={() => setOpen(true)} className={cx(primaryButton, "h-7 shrink-0 px-2")}>
              Open wheel
            </button>
          </div>
          <ul aria-label="Recent callouts" className="mt-1.5 flex flex-col">
            <li className="flex items-center gap-1.5 text-caption-2-regular text-text-tertiary"><span aria-hidden className="size-1 shrink-0 rounded-full bg-status-lime-text" /><span className="truncate">{sent ? `You · ${sent}` : "Mara Voss · Push mid"}</span><span className="ms-auto shrink-0 tabular-nums">{sent ? "Now" : "0:42"}</span></li>
            <li className="flex items-center gap-1.5 text-caption-2-regular text-text-tertiary"><span aria-hidden className="size-1 shrink-0 rounded-full bg-background-quaternary-default" /><span className="truncate">Kilo · Need ammo</span><span className="ms-auto shrink-0 tabular-nums">1:10</span></li>
          </ul>
        </>
      )}
    </section>
  );
}

/* 12. Game Settings */

const SETTINGS = [
  { id: "motion", label: "Motion blur", group: "Graphics" },
  { id: "grain", label: "Film grain", group: "Graphics" },
  { id: "audio", label: "Spatial audio", group: "Audio" },
  { id: "voice", label: "Voice chat", group: "Audio" },
] as const;

type SettingId = (typeof SETTINGS)[number]["id"];

const SETTING_DEFAULTS: Record<SettingId, boolean> = { motion: true, grain: false, audio: true, voice: false };

export function GameSettings() {
  const [values, setValues] = useState<Record<SettingId, boolean>>(SETTING_DEFAULTS);
  const [restored, setRestored] = useState(false);
  const changed = SETTINGS.filter((setting) => values[setting.id] !== SETTING_DEFAULTS[setting.id]).length;

  useEffect(() => {
    if (!restored) return;
    const timer = window.setTimeout(() => setRestored(false), 1600);
    return () => window.clearTimeout(timer);
  }, [restored]);

  const toggle = (id: SettingId) => {
    setValues((current) => ({ ...current, [id]: !current[id] }));
    setRestored(false);
  };

  return (
    <section aria-label="Game settings" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <RiSettings3Line className="size-4 text-foreground-icon-secondary" aria-hidden />
          <h3 className="text-body-2-semibold text-text-primary">Game settings</h3>
        </div>
        <Badge tone={changed ? "blue" : "neutral"}>{changed ? `${changed} changed` : "Default"}</Badge>
      </div>

      <div className="mt-1.5 grid grid-cols-2 gap-1.5">
        {SETTINGS.map((setting) => (
          <div key={setting.id} className="flex min-w-0 items-center justify-between gap-1 rounded-lg bg-background-secondary-default px-2 py-1.5">
            <div className="min-w-0">
              <p className="truncate text-caption-1-medium text-text-primary">{setting.label}</p>
              <p className="truncate text-caption-2-regular text-text-tertiary">{setting.group}</p>
            </div>
            <Toggle label={setting.label} checked={values[setting.id]} onChange={() => toggle(setting.id)} />
          </div>
        ))}
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span aria-live="polite" className={cx("flex min-w-0 items-center gap-1 truncate text-caption-2-medium", restored ? "text-status-lime-text" : "text-text-tertiary")}>
          {restored ? <RiCheckLine className="size-3.5 shrink-0" aria-hidden /> : <RiSparklingLine className="size-3.5 shrink-0" aria-hidden />}
          {restored ? "Defaults restored" : changed ? "Applies to this console" : "Everything at default"}
        </span>
        <button
          type="button"
          onClick={() => {
            setValues(SETTING_DEFAULTS);
            setRestored(true);
          }}
          disabled={changed === 0}
          className={cx(quietButton, "shrink-0")}
        >
          <RiRefreshLine className="size-3.5" aria-hidden />
          Reset
        </button>
      </div>
    </section>
  );
}

/* Specimens */

export const GAMES_SECTION: ExtendedSection = {
  id: "games",
  title: "Games",
  blurb: "Quests, parties and the reward loop.",
  file: "games.tsx",
  entries: [
    { name: "Achievement Toast", description: "An unlock with season XP, a claim and a clean dismiss.", Demo: AchievementToast },
    { name: "Quest Card", description: "Three objectives, a live progress bar and one reward.", Demo: QuestCard },
    { name: "Rank Row", description: "Rank, player, score and movement across two periods.", Demo: RankRow },
    { name: "Inventory Slot", description: "An epic blade with rarity, item power and equip state.", Demo: InventorySlot },
    { name: "Party Member", description: "Class, health and a ready state for the queue.", Demo: PartyMember },
    { name: "Match Summary", description: "Result, K/D/A and score with a rematch search.", Demo: MatchSummary },
    { name: "Season Pass", description: "A six-tier track with claimable tier rewards.", Demo: SeasonPass, wide: true },
    { name: "Daily Reward", description: "A seven-day claim streak with claimed turns.", Demo: DailyReward },
    { name: "Crafting Recipe", description: "Ingredient counts and a timed craft action.", Demo: CraftingRecipe },
    { name: "Waypoint", description: "A map marker, distance and a fast-travel run.", Demo: Waypoint },
    { name: "Chat Wheel", description: "Six quick callouts arranged around a radial hub.", Demo: ChatWheel },
    { name: "Game Settings", description: "Graphics and audio switches with a reset to defaults.", Demo: GameSettings },
  ],
};
