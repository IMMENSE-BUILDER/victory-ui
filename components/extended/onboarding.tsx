"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ComponentType } from "react";
import {
  RiAddLine,
  RiArrowDownSLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiCheckLine,
  RiCloseLine,
  RiDatabase2Line,
  RiFilter3Line,
  RiFolderAddLine,
  RiLayoutGridLine,
  RiLoader4Line,
  RiMailSendLine,
  RiRefreshLine,
  RiSearchLine,
  RiSendPlaneLine,
  RiShareLine,
  RiSparklingLine,
  RiStackLine,
  RiTimeLine,
  RiUploadCloud2Line,
  RiUserAddLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* Shared */

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";
const cardSurface = "w-full rounded-xl border border-border-button-default bg-background-primary-default shadow-card";
const buttonBase =
  "inline-flex items-center justify-center gap-1.5 rounded-lg text-caption-1-semibold " +
  "transition-[transform,opacity,background-color,color,box-shadow] duration-150 ease-out " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 " +
  "motion-reduce:transition-none motion-reduce:active:scale-100";
const primaryButton = cx(buttonBase, "h-8 bg-button-primary px-2.5 text-text-white shadow-xs", focusRing);
const secondaryButton = cx(
  buttonBase,
  "h-8 border border-border-button-default bg-background-primary-default px-2.5 text-text-primary shadow-xs hover:bg-background-primary-hover",
  focusRing,
);
const quietButton = cx(
  buttonBase,
  "h-7 px-1.5 text-text-secondary hover:bg-background-secondary-default hover:text-text-primary",
  focusRing,
);
const iconButton = cx(
  "flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-icon-tertiary",
  "transition-[background-color,color] duration-150 ease-out hover:bg-background-tertiary-default hover:text-text-primary",
  "motion-reduce:transition-none",
  focusRing,
);
const revealGrid = "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none";

function CompletionCheck({
  checked,
  label,
  onToggle,
}: {
  checked: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
      className={cx(
        "flex size-6 shrink-0 items-center justify-center rounded-full",
        "group",
        focusRing,
      )}
    >
      <span
        className={cx(
          "flex size-[18px] items-center justify-center rounded-full border",
          "transition-[background-color,border-color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
          checked
            ? "border-accent-600 bg-accent-600 text-text-white"
            : "border-border-checkbox-default bg-background-primary-default group-hover:border-border-checkbox-hover",
        )}
      >
        <RiCheckLine
          className={cx(
            "size-3 transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none",
            checked ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
          aria-hidden
        />
      </span>
    </button>
  );
}

function PersonDot({ email }: { email: string }) {
  return (
    <span
      aria-hidden
      className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-100 text-caption-2-semibold text-accent-700"
    >
      {email.slice(0, 1).toUpperCase()}
    </span>
  );
}

/* 1. Welcome Panel */

export function WelcomePanel() {
  const [visible, setVisible] = useState(true);
  const [started, setStarted] = useState(false);

  return (
    <div className="w-full max-w-[300px]">
      <div
        inert={!visible}
        className={cx(
          revealGrid,
          visible ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <section
            aria-label="Welcome to Northline"
            className={cx(
              cardSurface,
              "origin-top p-3 transition-[transform] duration-200 ease-out motion-reduce:transition-none",
              visible ? "scale-100" : "scale-[0.98]",
            )}
          >
            <div className="flex items-start gap-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent-600 text-text-white shadow-xs">
                <RiSparklingLine className="size-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-caption-2-semibold tracking-wide text-accent-600 uppercase">
                  Welcome to Northline
                </p>
                <h3 className="mt-0.5 text-title-3-semibold text-text-primary">
                  Plan a launch without the tab pile.
                </h3>
              </div>
              <button
                type="button"
                aria-label="Dismiss welcome panel"
                onClick={() => setVisible(false)}
                className={cx(iconButton, "-me-1 -mt-1")}
              >
                <RiCloseLine className="size-3.5" aria-hidden />
              </button>
            </div>

            <p className="mt-2 text-caption-1-regular text-text-secondary">
              One board for the brief, the dates and the people doing the work. Setup takes
              about two minutes.
            </p>

            <div className="mt-2.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStarted(true)}
                className={cx(primaryButton, "flex-1")}
              >
                {started ? (
                  <>
                    <RiCheckLine className="size-3.5" aria-hidden />
                    Board created
                  </>
                ) : (
                  <>
                    Create your first board
                    <RiArrowRightLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
                  </>
                )}
              </button>
              <span className="shrink-0 text-caption-2-regular text-text-tertiary">
                {started ? "Saved" : "14-day trial"}
              </span>
            </div>
          </section>
        </div>
      </div>

      <div
        inert={visible}
        className={cx(
          revealGrid,
          visible ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <button
            type="button"
            onClick={() => setVisible(true)}
            className={cx(quietButton, "w-full justify-center")}
          >
            <RiRefreshLine className="size-3.5" aria-hidden />
            Show welcome panel
          </button>
        </div>
      </div>
    </div>
  );
}

/* 2. Setup Checklist */

const SETUP_TASKS = [
  { id: "workspace", title: "Name your workspace", detail: "Shown on invites, shared links and every export." },
  { id: "profile", title: "Add a profile photo", detail: "Teammates recognise you in comments and mentions." },
  { id: "invite", title: "Invite your team", detail: "Two of five seats are still open on the Product plan." },
  { id: "board", title: "Import your first board", detail: "Bring a CSV, a Notion page or start from the launch kit." },
  { id: "slack", title: "Connect Slack", detail: "Get mentions and due-date nudges where the team already talks." },
] as const;

type SetupId = (typeof SETUP_TASKS)[number]["id"];

const SETUP_DONE: Record<SetupId, boolean> = {
  workspace: true,
  profile: true,
  invite: false,
  board: false,
  slack: false,
};

export function SetupChecklist() {
  const baseId = useId();
  const [done, setDone] = useState<Record<SetupId, boolean>>(SETUP_DONE);
  const [openId, setOpenId] = useState<SetupId | null>(null);
  const complete = SETUP_TASKS.filter((task) => done[task.id]).length;

  return (
    <section aria-labelledby={`${baseId}-title`} className={cx(cardSurface, "p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 id={`${baseId}-title`} className="text-body-2-semibold text-text-primary">
          Set up Northline
        </h3>
        <span className="text-caption-1-medium text-text-secondary tabular-nums">
          {complete} of {SETUP_TASKS.length}
        </span>
      </div>

      <div
        role="progressbar"
        aria-label="Setup progress"
        aria-valuemin={0}
        aria-valuemax={SETUP_TASKS.length}
        aria-valuenow={complete}
        className="mt-1.5 h-1 overflow-hidden rounded-full bg-background-tertiary-default"
      >
        <div
          className="h-full rounded-full bg-accent-500 transition-[width] duration-200 ease-out motion-reduce:transition-none"
          style={{ width: `${(complete / SETUP_TASKS.length) * 100}%` }}
        />
      </div>

      <ul className="mt-1">
        {SETUP_TASKS.map((task) => {
          const open = openId === task.id;
          const isDone = done[task.id];
          return (
            <li key={task.id} className="border-b border-separator-border last:border-b-0">
              <div className="flex items-center gap-2">
                <CompletionCheck
                  checked={isDone}
                  label={`Mark “${task.title}” complete`}
                  onToggle={() =>
                    setDone((current) => ({ ...current, [task.id]: !current[task.id] }))
                  }
                />
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`${baseId}-${task.id}`}
                  onClick={() => setOpenId(open ? null : task.id)}
                  className={cx(
                    "flex h-6 min-w-0 flex-1 items-center gap-1 rounded-sm text-start",
                    focusRing,
                  )}
                >
                  <span
                    className={cx(
                      "min-w-0 flex-1 truncate text-body-2-medium transition-[background-color,border-color,color] duration-150 ease-out motion-reduce:transition-none",
                      isDone ? "text-text-tertiary line-through" : "text-text-primary",
                    )}
                  >
                    {task.title}
                  </span>
                  <RiArrowDownSLine
                    className={cx(
                      "size-3.5 shrink-0 text-foreground-icon-tertiary transition-[transform] duration-200 ease-out motion-reduce:transition-none",
                      open && "rotate-180",
                    )}
                    aria-hidden
                  />
                </button>
              </div>
              <div
                id={`${baseId}-${task.id}`}
                inert={!open}
                className={cx(revealGrid, open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
              >
                <div className="min-h-0 overflow-hidden">
                  <p className="pb-1.5 ps-8 text-caption-2-regular text-text-secondary">
                    {task.detail}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* 3. Starter Picker */

const STARTERS = [
  { id: "blank", label: "Blank", title: "Blank board", blurb: "One list, nothing else.", meta: "0 lists", cta: "Create blank board", icon: RiLayoutGridLine },
  { id: "template", label: "Template", title: "Launch template", blurb: "12 tasks across four lists.", meta: "12 tasks", cta: "Use launch template", icon: RiStackLine },
  { id: "import", label: "Import", title: "Import project", blurb: "2,400 rows from a CSV.", meta: "CSV", cta: "Import from CSV", icon: RiUploadCloud2Line },
] as const;

type StarterId = (typeof STARTERS)[number]["id"];

export function StarterPicker() {
  const [starter, setStarter] = useState<StarterId>("template");
  const [created, setCreated] = useState(false);
  const current = STARTERS.find((item) => item.id === starter) ?? STARTERS[0];
  const CurrentIcon = current.icon;

  const choose = (id: StarterId) => {
    setStarter(id);
    setCreated(false);
  };

  return (
    <section aria-label="Choose a starting point" className={cx(cardSurface, "p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Starting point</h3>
        <span className="text-caption-2-medium text-text-tertiary">Step 1 of 3</span>
      </div>

      <div role="group" aria-label="Starting point" className="mt-1.5 grid grid-cols-3 gap-1.5">
        {STARTERS.map((item) => {
          const Icon = item.icon;
          const selected = starter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected}
              onClick={() => choose(item.id)}
              className={cx(
                "flex flex-col gap-1 rounded-lg border p-1.5 text-start",
                "transition-[background-color,border-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                selected
                  ? "border-accent-500 bg-background-secondary-default shadow-xs"
                  : "border-border-button-default bg-background-primary-default hover:bg-background-primary-hover",
              )}
            >
              <span className="flex w-full items-center justify-between">
                <Icon
                  className={cx(
                    "size-3.5",
                    selected ? "text-accent-600" : "text-foreground-icon-secondary",
                  )}
                  aria-hidden
                />
                <RiCheckLine
                  className={cx(
                    "size-3 text-accent-600 transition-[opacity] duration-150 ease-out motion-reduce:transition-none",
                    selected ? "opacity-100" : "opacity-0",
                  )}
                  aria-hidden
                />
              </span>
              <span className="text-caption-1-semibold text-text-primary">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-1.5 flex h-[46px] items-center gap-2 overflow-hidden rounded-lg border border-separator-border bg-background-secondary-default p-1.5">
        <div key={starter} className="flex w-full animate-label-in items-center gap-2 motion-reduce:animate-none">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-primary-default text-foreground-icon-secondary shadow-xs">
            <CurrentIcon className="size-3.5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <span className="truncate text-caption-1-semibold text-text-primary">
                {current.title}
              </span>
              <span className="shrink-0 text-caption-2-regular text-text-tertiary">
                {current.meta}
              </span>
            </div>
            <p aria-live="polite" className="truncate text-caption-2-regular text-text-secondary">
              {created ? "Draft saved to Product team." : current.blurb}
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setCreated(true)}
        className={cx(primaryButton, "mt-2 w-full")}
      >
        {created ? (
          <>
            <RiCheckLine className="size-3.5" aria-hidden />
            Board is ready
          </>
        ) : (
          <>
            {current.cta}
            <RiArrowRightLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
          </>
        )}
      </button>
    </section>
  );
}

/* 4. Sample Data Card */

const SAMPLE_TABLES = [
  { name: "Orders", count: 842 },
  { name: "Customers", count: 318 },
  { name: "Products", count: 88 },
] as const;

const SAMPLE_TOTAL = SAMPLE_TABLES.reduce((total, table) => total + table.count, 0);
const formatCount = new Intl.NumberFormat("en-US");

type SampleStatus = "idle" | "loading" | "loaded";

export function SampleDataCard() {
  const [status, setStatus] = useState<SampleStatus>("idle");

  useEffect(() => {
    if (status !== "loading") return;
    const timer = window.setTimeout(() => setStatus("loaded"), 1400);
    return () => window.clearTimeout(timer);
  }, [status]);

  return (
    <section aria-label="Demo workspace" className={cx(cardSurface, "p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
          <RiDatabase2Line className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">Demo workspace</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">
            Northwind Retail · 3 tables
          </p>
        </div>
        <span
          role="status"
          className={cx(
            "shrink-0 rounded-full px-1.5 py-0.5 text-caption-2-medium transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
            status === "loaded"
              ? "bg-status-lime-background text-status-lime-text"
              : "bg-background-tertiary-default text-text-tertiary",
          )}
        >
          {status === "loaded" ? "Loaded" : status === "loading" ? "Loading" : "Empty"}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-2 rounded-lg bg-background-secondary-default px-2 py-1.5">
        <span className="text-caption-2-regular text-text-tertiary">Before</span>
        <span className="text-body-2-semibold text-text-primary tabular-nums">0</span>
        <RiArrowRightLine className="size-3 text-foreground-icon-tertiary rtl:-scale-x-100" aria-hidden />
        <span className="text-caption-2-regular text-text-tertiary">After</span>
        <span
          className={cx(
            "text-body-2-semibold tabular-nums transition-[background-color,border-color,color] duration-200 ease-out motion-reduce:transition-none",
            status === "loaded" ? "text-status-lime-text" : "text-text-secondary",
          )}
        >
          {formatCount.format(SAMPLE_TOTAL)}
        </span>
        <span className="ms-auto text-caption-2-regular text-text-tertiary">records</span>
      </div>

      <div className="mt-2 flex h-[52px] flex-col justify-center overflow-hidden rounded-lg border border-separator-border bg-background-secondary-default/50 p-1.5">
        {status === "idle" ? (
          <p className="text-caption-2-regular text-text-tertiary">
            Load three linked tables to explore reports, filters and empty states.
          </p>
        ) : status === "loading" ? (
          <div aria-live="polite" className="flex flex-col gap-1">
            <span className="h-1.5 w-2/5 animate-pulse rounded-full bg-background-tertiary-default motion-reduce:animate-none" />
            <span className="h-1.5 w-3/5 animate-pulse rounded-full bg-background-tertiary-default motion-reduce:animate-none" />
            <span className="text-caption-2-regular text-text-tertiary">
              Copying 1,248 records…
            </span>
          </div>
        ) : (
          <ul aria-live="polite" className="grid grid-cols-3 gap-1">
            {SAMPLE_TABLES.map((table, index) => (
              <li
                key={table.name}
                className="animate-label-in rounded-md border border-separator-border bg-background-primary-default px-1 py-0.5 motion-reduce:animate-none"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <span className="block truncate text-center text-caption-2-regular text-text-tertiary">
                  {table.name}
                </span>
                <span className="block text-center text-caption-1-semibold text-text-primary tabular-nums">
                  {formatCount.format(table.count)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={() => setStatus(status === "loaded" ? "idle" : "loading")}
        disabled={status === "loading"}
        className={cx(
          status === "loaded" ? secondaryButton : primaryButton,
          "mt-2 h-7 w-full",
        )}
      >
        {status === "loading" ? (
          <>
            <RiLoader4Line className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
            Loading sample
          </>
        ) : status === "loaded" ? (
          <>
            <RiRefreshLine className="size-3.5" aria-hidden />
            Reset demo
          </>
        ) : (
          <>
            <RiDatabase2Line className="size-3.5" aria-hidden />
            Load sample data
          </>
        )}
      </button>
    </section>
  );
}

/* 5. Invite Team Row */

const INVITE_ROLES = ["Viewer", "Editor", "Admin"] as const;
type InviteRole = (typeof INVITE_ROLES)[number];
type InviteStatus = "draft" | "pending" | "sent";

type Invitee = {
  id: string;
  email: string;
  role: InviteRole;
  status: InviteStatus;
};

const INITIAL_INVITES: Invitee[] = [
  { id: "maya", email: "maya.chen@northline.co", role: "Editor", status: "draft" },
  { id: "dev", email: "dev.raman@northline.co", role: "Editor", status: "draft" },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function InviteeRow({ invite }: { invite: Invitee }) {
  return (
    <li className="flex h-6 items-center gap-1.5">
      <PersonDot email={invite.email} />
      <span dir="ltr" className="min-w-0 flex-1 truncate text-caption-2-regular text-text-secondary">
        {invite.email}
      </span>
      {invite.status === "pending" ? (
        <span className="flex shrink-0 items-center gap-1 text-caption-2-medium text-text-tertiary">
          <RiLoader4Line className="size-3 animate-spin motion-reduce:animate-none" aria-hidden />
          Sending
        </span>
      ) : invite.status === "sent" ? (
        <span className="flex shrink-0 items-center gap-1 text-caption-2-medium text-status-lime-text">
          <RiCheckLine className="size-3" aria-hidden />
          Sent
        </span>
      ) : (
        <span className="shrink-0 rounded-full bg-background-tertiary-default px-1.5 py-0.5 text-caption-2-medium text-text-secondary">
          {invite.role}
        </span>
      )}
    </li>
  );
}

export function InviteTeamRow() {
  const [invites, setInvites] = useState<Invitee[]>(INITIAL_INVITES);
  const [draft, setDraft] = useState("");
  const [role, setRole] = useState<InviteRole>("Editor");
  const [error, setError] = useState<string | null>(null);
  const drafts = invites.filter((invite) => invite.status === "draft").length;
  const pending = invites.some((invite) => invite.status === "pending");
  const sent = invites.filter((invite) => invite.status === "sent").length;

  useEffect(() => {
    const index = invites.findIndex((invite) => invite.status === "pending");
    if (index === -1) return;
    const timer = window.setTimeout(() => {
      setInvites((current) =>
        current.map((invite, position) =>
          position === index ? { ...invite, status: "sent" } : invite,
        ),
      );
    }, 700);
    return () => window.clearTimeout(timer);
  }, [invites]);

  const addInvite = () => {
    const email = draft.trim().toLowerCase();
    if (!email) return;
    if (!EMAIL_PATTERN.test(email)) {
      setError("Enter a full email address.");
      return;
    }
    if (invites.some((invite) => invite.email === email)) {
      setError("That person is already on the list.");
      return;
    }
    if (invites.length >= 5) {
      setError("All five seats are taken.");
      return;
    }
    setInvites((current) => [...current, { id: email, email, role, status: "draft" }]);
    setDraft("");
    setError(null);
  };

  const sendInvites = () => {
    setInvites((current) =>
      current.map((invite) => (invite.status === "draft" ? { ...invite, status: "pending" } : invite)),
    );
    setError(null);
  };

  return (
    <section aria-label="Invite your team" className={cx(cardSurface, "p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Invite your team</h3>
        <span className="text-caption-2-medium text-text-tertiary tabular-nums">
          {5 - invites.length} seats left
        </span>
      </div>

      <div className="mt-1.5 flex items-center gap-1.5">
        <input
          type="email"
          value={draft}
          dir="ltr"
          aria-label="Email address"
          aria-invalid={Boolean(error)}
          placeholder="name@company.com"
          autoComplete="email"
          onChange={(event) => {
            setDraft(event.target.value);
            setError(null);
          }}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            addInvite();
          }}
          className={cx(
            "h-8 min-w-0 flex-1 rounded-lg bg-background-tertiary-default px-2 text-caption-1-medium text-text-primary outline-none placeholder:text-text-placeholder",
            focusRing,
          )}
        />        <button
          type="button"
          aria-label="Add email address"
          onClick={addInvite}
          className={cx(secondaryButton, "size-8 shrink-0 px-0")}
        >
          <RiAddLine className="size-3.5" aria-hidden />
        </button>
        <div className="relative shrink-0">
          <select
            aria-label="Role for new invites"
            value={role}
            onChange={(event) => setRole(event.target.value as InviteRole)}
            className={cx(
              "h-8 appearance-none rounded-lg border border-border-button-default bg-background-primary-default ps-2 pe-6 text-caption-1-medium text-text-primary shadow-xs outline-none",
              focusRing,
            )}
          >
            {INVITE_ROLES.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          <RiArrowDownSLine
            className="pointer-events-none absolute end-1.5 top-1/2 size-3 -translate-y-1/2 text-foreground-icon-tertiary"
            aria-hidden
          />
        </div>
      </div>

      <ul aria-live="polite" className="mt-2 flex flex-col gap-1">
        {invites.map((invite) => <InviteeRow key={invite.id} invite={invite} />)}
      </ul>

      <div className="mt-2 flex items-center justify-between gap-2">
        <span
          role="status"
          className={cx("min-w-0 truncate text-caption-2-regular", error ? "text-text-error-primary" : "text-text-tertiary")}
        >
          {error ?? `${sent} of ${invites.length} sent`}
        </span>
        <button
          type="button"
          onClick={sendInvites}
          disabled={drafts === 0}
          className={cx(primaryButton, "h-7 shrink-0")}
        >
          {drafts > 0 ? (
            <>
              <RiSendPlaneLine className="size-3.5" aria-hidden />
              Send {drafts} invite{drafts === 1 ? "" : "s"}
            </>
          ) : pending ? (
            <>
              <RiLoader4Line className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
              Sending
            </>
          ) : (
            <>
              <RiCheckLine className="size-3.5" aria-hidden />
              Invites sent
            </>
          )}
        </button>
      </div>
    </section>
  );
}

/* 6. First Task Card */

export function FirstTaskCard() {
  const [done, setDone] = useState(false);

  return (
    <section aria-label="Your first task" className={cx(cardSurface, "p-3")}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-caption-2-semibold tracking-wide text-accent-600 uppercase">
          Your first task
        </span>
        <span
          className={cx(
            "flex items-center gap-1 rounded-full px-1.5 py-0.5 text-caption-2-medium transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
            done
              ? "bg-status-lime-background text-status-lime-text"
              : "bg-background-tertiary-default text-text-tertiary",
          )}
        >
          {done ? (
            <RiCheckLine className="size-3" aria-hidden />
          ) : (
            <RiTimeLine className="size-3" aria-hidden />
          )}
          {done ? "Done" : "4 min"}
        </span>
      </div>

      <div className="mt-2 flex items-start gap-2">
        <span className="mt-0.5">
          <CompletionCheck
            checked={done}
            label={`Mark “Publish the Q4 launch board” complete`}
            onToggle={() => setDone((current) => !current)}
          />
        </span>
        <div className="min-w-0 flex-1">
          <h3
            className={cx(
              "text-body-2-semibold transition-[background-color,border-color,color] duration-200 ease-out motion-reduce:transition-none",
              done ? "text-text-tertiary line-through" : "text-text-primary",
            )}
          >
            Publish the Q4 launch board
          </h3>
          <p className="mt-0.5 text-caption-1-regular text-text-secondary">
            Your team is waiting on the plan. Publishing makes it visible to all 12 members.
          </p>
        </div>
      </div>

      <div
        inert={!done}
        className={cx(revealGrid, done ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="mt-2.5 flex items-start gap-2 border-t border-separator-border pt-2.5">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-accent-600">
              <RiUserAddLine className="size-3.5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1 text-caption-1-semibold text-text-primary">
                Next: invite the launch team
                <RiArrowRightLine className="size-3 text-accent-600 rtl:-scale-x-100" aria-hidden />
              </p>
              <p className="mt-0.5 text-caption-2-regular text-text-secondary">
                Three seats are open on Product. Maya, Dev and Priya own the work.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 7. Feature Tour Tip */

const TOUR_STEPS = [
  { title: "Switch boards from here", body: "Every board you own lives in this menu.", target: "Boards", icon: RiLayoutGridLine },
  { title: "Save a filtered view", body: "Filter by owner, then keep it for standup.", target: "Filters", icon: RiFilter3Line },
  { title: "Invite the people who need it", body: "Editors can move cards. Viewers cannot.", target: "Share", icon: RiUserAddLine },
] as const;

type TourStep = (typeof TOUR_STEPS)[number];

function TourCoachMark({
  step,
  index,
  onClose,
  onNext,
  onBack,
  onStep,
}: {
  step: TourStep;
  index: number;
  onClose: () => void;
  onNext: () => void;
  onBack: () => void;
  onStep: (position: number) => void;
}) {
  const StepIcon = step.icon;
  const last = TOUR_STEPS.length - 1;

  return (
    <section
      aria-label={`Tour step ${index + 1} of ${TOUR_STEPS.length}`}
      className="mt-2 rounded-lg border border-border-button-default bg-background-primary-default p-2 shadow-dropdown"
    >
      <div className="flex items-start gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-accent-600">
          <StepIcon className="size-3.5" aria-hidden />
        </span>
        <div key={index} className="min-w-0 flex-1 animate-label-in motion-reduce:animate-none">
          <p aria-live="polite" className="text-caption-1-semibold text-text-primary">{step.title}</p>
          <p className="text-caption-2-regular text-text-secondary">{step.body}</p>
        </div>
        <button type="button" aria-label="Close feature tour" onClick={onClose} className={cx(iconButton, "-me-1 -mt-1")}>
          <RiCloseLine className="size-3" aria-hidden />
        </button>
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <div role="group" aria-label="Tour steps" className="flex items-center">
          {TOUR_STEPS.map((item, position) => (
            <button
              key={item.title}
              type="button"
              aria-label={`Go to step ${position + 1}: ${item.title}`}
              aria-current={position === index ? "step" : undefined}
              onClick={() => onStep(position)}
              className={cx("flex size-6 items-center justify-center rounded-full", focusRing)}
            >
              <span
                className={cx(
                  "h-1.5 rounded-full transition-[width,background-color] duration-200 ease-out motion-reduce:transition-none",
                  position === index ? "w-4 bg-accent-500" : "w-1.5 bg-background-tertiary-default",
                )}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous tour step"
            disabled={index === 0}
            onClick={onBack}
            className={cx(
              "flex size-6 items-center justify-center rounded-md border border-border-button-default bg-background-primary-default text-foreground-icon-secondary",
              "transition-[background-color,color,opacity] duration-150 ease-out hover:bg-background-primary-hover hover:text-text-primary",
              "disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none",
              focusRing,
            )}
          >
            <RiArrowLeftLine className="size-3 rtl:-scale-x-100" aria-hidden />
          </button>
          <button type="button" onClick={onNext} className={cx(primaryButton, "h-6 gap-1 rounded-md px-2 text-caption-2-semibold")}>
            {index === last ? "Done" : "Next"}
            {index < last && <RiArrowRightLine className="size-3 rtl:-scale-x-100" aria-hidden />}
          </button>
        </div>
      </div>
    </section>
  );
}

export function FeatureTourTip() {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(true);
  const replayRef = useRef<HTMLButtonElement>(null);
  const step = TOUR_STEPS[index];
  const last = TOUR_STEPS.length - 1;

  useEffect(() => {
    if (!open) replayRef.current?.focus();
  }, [open]);

  const close = () => setOpen(false);
  const next = () => (index === last ? close() : setIndex(index + 1));

  return (
    <div
      className="w-full max-w-[460px]"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          close();
        }
      }}
    >
      <div className="relative flex h-[186px] flex-col overflow-hidden rounded-xl border border-border-button-default bg-background-secondary-default shadow-card">
        <div className="flex h-8 shrink-0 items-center gap-1.5 border-b border-separator-border bg-background-primary-default px-2">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-accent-600 text-text-white">
            <RiSparklingLine className="size-3" aria-hidden />
          </span>
          <span className="text-caption-2-semibold text-text-primary">Northline</span>
          <span className="text-caption-2-regular text-text-tertiary">/</span>
          <span className="text-caption-2-regular text-text-secondary">Q4 Launch</span>
          <span className="ms-auto flex h-5 shrink-0 items-center gap-1 rounded-full bg-background-secondary-default px-1.5 text-caption-2-regular text-text-tertiary">
            <RiSearchLine className="size-3" aria-hidden />
            Search
          </span>
        </div>

        <div className="flex flex-1 flex-col p-2">
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 z-10 rounded-lg bg-accent-500/5 ring-2 ring-accent-500 transition-[inset-inline-start] duration-200 ease-out motion-reduce:transition-none"
              style={{
                width: "calc((100% - 12px) / 3)",
                insetInlineStart: `calc(${index} * ((100% - 12px) / 3 + 6px))`,
              }}
            />
            <div className="relative flex gap-1.5">
              {TOUR_STEPS.map((item, position) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.target}
                    className={cx(
                      "flex h-10 flex-1 items-center justify-center gap-1 rounded-lg border bg-background-primary-default text-caption-2-medium",
                      position === index ? "border-transparent text-text-primary" : "border-border-button-default text-text-tertiary",
                    )}
                  >
                    <Icon className={cx("size-3.5", position === index ? "text-accent-600" : "text-foreground-icon-tertiary")} aria-hidden />
                    {item.target}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-auto">
            {open ? (
              <TourCoachMark
                step={step}
                index={index}
                onClose={close}
                onNext={next}
                onBack={() => setIndex(Math.max(0, index - 1))}
                onStep={setIndex}
              />
            ) : (
              <div className="mt-2 flex h-[52px] items-center justify-between gap-2 rounded-lg border border-border-button-default bg-background-primary-default px-2">
                <span className="text-caption-2-regular text-text-tertiary">
                  {index === last ? "Tour complete." : `Tour paused at step ${index + 1}.`}
                </span>
                <button
                  ref={replayRef}
                  type="button"
                  onClick={() => {
                    setIndex(0);
                    setOpen(true);
                  }}
                  className={quietButton}
                >
                  <RiRefreshLine className="size-3" aria-hidden />
                  Replay tour
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* 8. Activation Meter */

const ACTIVATION_STAGES = [
  { name: "Create workspace", detail: "Name and timezone set." },
  { name: "Build a board", detail: "Three lists, four owners." },
  { name: "Invite the team", detail: "Two of five seats filled." },
  { name: "Post an update", detail: "The first status goes out." },
] as const;

export function ActivationMeter() {
  const [complete, setComplete] = useState(2);
  const finished = complete === ACTIVATION_STAGES.length;
  const current = finished ? null : ACTIVATION_STAGES[complete];

  return (
    <section aria-label="Activation meter" className={cx(cardSurface, "p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Activation</h3>
        <span className="text-caption-1-medium text-text-secondary tabular-nums">
          {complete} of {ACTIVATION_STAGES.length}
        </span>
      </div>

      <p aria-live="polite" className="mt-1 text-body-2-semibold text-text-primary">
        {current ? `Next: ${current.name}` : "Workspace activated"}
      </p>
      <p className="text-caption-2-regular text-text-tertiary">
        {current ? current.detail : "All four stages are done. Nice work."}
      </p>

      <div
        role="progressbar"
        aria-label="Activation progress"
        aria-valuemin={0}
        aria-valuemax={ACTIVATION_STAGES.length}
        aria-valuenow={complete}
        aria-valuetext={`${complete} of ${ACTIVATION_STAGES.length} stages complete`}
        className="mt-2 flex gap-1"
      >
        {ACTIVATION_STAGES.map((stage, position) => (
          <span
            key={stage.name}
            className={cx(
              "h-2 flex-1 rounded-full transition-[background-color] duration-200 ease-out motion-reduce:transition-none",
              position < complete
                ? "bg-accent-500"
                : position === complete
                  ? "bg-accent-500/30"
                  : "bg-background-tertiary-default",
            )}
          />
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-caption-2-regular text-text-tertiary tabular-nums">
          {complete * 25}% activated
        </span>
        <button
          type="button"
          onClick={() => setComplete(finished ? 0 : complete + 1)}
          className={cx(finished ? secondaryButton : primaryButton, "h-7")}
        >
          {finished ? (
            <>
              <RiRefreshLine className="size-3.5" aria-hidden />
              Start over
            </>
          ) : (
            <>
              Complete stage
              <RiArrowRightLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
            </>
          )}
        </button>
      </div>
    </section>
  );
}

/* 9. Blank Slate */

const SLATE_ACTIONS = [
  { id: "blank", label: "Blank board", description: "One list, ready in seconds", icon: RiLayoutGridLine },
  { id: "csv", label: "Import from CSV", description: "Bring 2,400 rows with headers", icon: RiUploadCloud2Line },
  { id: "template", label: "Use a template", description: "12 tasks from the launch kit", icon: RiStackLine },
] as const;

type SlateId = (typeof SLATE_ACTIONS)[number]["id"];

export function BlankSlate() {
  const [choice, setChoice] = useState<SlateId | null>(null);
  const selected = SLATE_ACTIONS.find((action) => action.id === choice);

  return (
    <section
      aria-label="Empty workspace"
      className="w-full max-w-[300px] rounded-xl border border-dashed border-border-button-default bg-background-primary-default p-2.5 shadow-xs"
    >
      <div className="flex items-center gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background-tertiary-default text-foreground-icon-secondary">
          <RiFolderAddLine className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1 text-start">
          <h3 className="text-body-2-semibold text-text-primary">This workspace is empty</h3>
          <p aria-live="polite" className="truncate text-caption-2-regular text-text-tertiary">
            {selected ? `Selected: ${selected.label}.` : "Pick a starting point."}
          </p>
        </div>
      </div>

      <div role="group" aria-label="Start an empty workspace" className="mt-2 flex flex-col gap-1">
        {SLATE_ACTIONS.map((action) => {
          const Icon = action.icon;
          const active = choice === action.id;
          return (
            <button
              key={action.id}
              type="button"
              aria-pressed={active}
              onClick={() => setChoice(action.id)}
              className={cx(
                "group flex h-9 w-full items-center gap-2 rounded-lg border px-2 text-start",
                "transition-[background-color,border-color,color] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                active
                  ? "border-accent-500 bg-background-secondary-default"
                  : "border-transparent hover:border-border-button-default hover:bg-background-secondary-default",
              )}
            >
              <span
                className={cx(
                  "flex size-6 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default",
                  "transition-[background-color,border-color,color] duration-150 ease-out group-hover:text-accent-600 motion-reduce:transition-none",
                  active ? "text-accent-600" : "text-foreground-icon-secondary",
                )}
              >
                <Icon className="size-3.5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-caption-1-semibold text-text-primary">
                  {action.label}
                </span>
                <span
                  className={cx(
                    "block truncate text-caption-2-regular text-text-tertiary",
                    "transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
                    active
                      ? ""
                      : "opacity-0 -translate-y-0.5 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100",
                  )}
                >
                  {action.description}
                </span>
              </span>
              <RiArrowRightLine
                className={cx(
                  "size-3.5 shrink-0 text-foreground-icon-tertiary rtl:-scale-x-100",
                  "transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
                  active
                    ? ""
                    : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
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

/* 10. Setup Email */

type EmailStatus = "idle" | "sending" | "sent";

export function SetupEmail() {
  const id = useId();
  const [name, setName] = useState("Jordan");
  const [status, setStatus] = useState<EmailStatus>("idle");
  const displayName = name.trim() || "Jordan";

  useEffect(() => {
    if (status !== "sending") return;
    const timer = window.setTimeout(() => setStatus("sent"), 1000);
    return () => window.clearTimeout(timer);
  }, [status]);

  return (
    <section aria-label="Welcome email preview" className={cx(cardSurface, "p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent-600 text-text-white shadow-xs">
          <RiMailSendLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">Welcome email</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">
            Sent when someone joins Northline
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-border-button-default px-1.5 py-0.5 text-caption-2-medium text-text-tertiary">
          Draft
        </span>
      </div>

      <div className="mt-1.5 flex items-center gap-2">
        <label htmlFor={id} className="shrink-0 text-caption-1-medium text-text-secondary">
          First name
        </label>
        <input
          id={id}
          value={name}
          autoComplete="given-name"
          onChange={(event) => {
            setName(event.target.value);
            if (status === "sent") setStatus("idle");
          }}
          className={cx(
            "h-7 min-w-0 flex-1 rounded-lg bg-background-tertiary-default px-2",
            "text-caption-1-medium text-text-primary outline-none placeholder:text-text-placeholder",
            focusRing,
          )}
        />
      </div>

      <div className="mt-1.5 rounded-lg border border-separator-border bg-background-secondary-default px-1.5 py-1">
        <p dir="ltr" className="truncate text-start text-caption-2-regular text-text-tertiary">
          To: jordan.lee@northline.co
        </p>
        <p className="mt-0.5 truncate text-caption-1-semibold text-text-primary">
          Welcome aboard, {displayName}
        </p>
        <p className="mt-0.5 truncate text-caption-2-regular text-text-secondary">
          Your workspace is ready. Start with the Q4 launch template.
        </p>
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span
          role="status"
          aria-live="polite"
          className={cx(
            "min-w-0 truncate text-caption-2-regular transition-[background-color,border-color,color] duration-200 ease-out motion-reduce:transition-none",
            status === "sent" ? "text-status-lime-text" : "text-text-tertiary",
          )}
        >
          {status === "sending"
            ? "Sending test…"
            : status === "sent"
              ? "Test sent to your inbox."
              : "Sends to you only."}
        </span>
        <button
          type="button"
          onClick={() => setStatus("sending")}
          disabled={status === "sending"}
          className={cx(primaryButton, "h-7 shrink-0")}
        >
          {status === "sending" ? (
            <>
              <RiLoader4Line className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
              Sending
            </>
          ) : status === "sent" ? (
            <>
              <RiRefreshLine className="size-3.5" aria-hidden />
              Send again
            </>
          ) : (
            <>
              <RiSendPlaneLine className="size-3.5" aria-hidden />
              Send test
            </>
          )}
        </button>
      </div>
    </section>
  );
}

/* 11. Progress Steps */

const PROGRESS_STEPS = [
  { name: "Workspace", summary: "Northline HQ · GMT+1", detail: "Name the space, pick a timezone and invite the first admin." },
  { name: "Board", summary: "List view · 4 lists", detail: "Choose a layout for the Q4 launch. Lists keep owners visible." },
  { name: "Invite", summary: "Maya, Dev and Priya", detail: "Add the three people who own the work. Editors can move cards." },
  { name: "Publish", summary: "Visible to all 12 members", detail: "Make the board visible to the whole team and send the first update." },
] as const;

export function ProgressSteps() {
  const [current, setCurrent] = useState(1);
  const last = PROGRESS_STEPS.length - 1;
  const step = PROGRESS_STEPS[current];

  return (
    <section aria-label="Board setup progress" className={cx(cardSurface, "max-w-[460px] p-3")}>
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">Set up your board</h3>
          <p className="text-caption-2-regular text-text-tertiary">
            Step {current + 1} of {PROGRESS_STEPS.length} · {step.name}
          </p>
        </div>
        <button
          type="button"
          aria-label="Previous step"
          disabled={current === 0}
          onClick={() => setCurrent(Math.max(0, current - 1))}
          className={cx(
            "flex size-7 items-center justify-center rounded-md border border-border-button-default bg-background-primary-default text-foreground-icon-secondary shadow-xs",
            "transition-[background-color,color,opacity] duration-150 ease-out hover:bg-background-primary-hover hover:text-text-primary",
            "disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none",
            focusRing,
          )}
        >
          <RiArrowLeftLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Next step"
          disabled={current === last}
          onClick={() => setCurrent(Math.min(last, current + 1))}
          className={cx(
            "flex size-7 items-center justify-center rounded-md border border-border-button-default bg-background-primary-default text-foreground-icon-secondary shadow-xs",
            "transition-[background-color,color,opacity] duration-150 ease-out hover:bg-background-primary-hover hover:text-text-primary",
            "disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none",
            focusRing,
          )}
        >
          <RiArrowRightLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
        </button>
      </div>

      <ol className="mt-3 flex items-start">
        {PROGRESS_STEPS.map((item, position) => {
          const done = position < current;
          const active = position === current;
          return (
            <li
              key={item.name}
              className={cx(
                "flex min-w-0 items-start",
                position < last && "flex-1",
              )}
            >
              <div className="flex w-14 shrink-0 flex-col items-center gap-1">
                <button
                  type="button"
                  aria-label={`Go to step ${position + 1}: ${item.name}`}
                  aria-current={active ? "step" : undefined}
                  disabled={position > current}
                  onClick={() => setCurrent(position)}
                  className={cx(
                    "flex size-6 items-center justify-center rounded-full disabled:pointer-events-none",
                    focusRing,
                  )}
                >
                  <span
                    className={cx(
                      "flex size-5 items-center justify-center rounded-full border text-caption-2-semibold",
                      "transition-[background-color,border-color,color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
                      done
                        ? "border-accent-600 bg-accent-600 text-text-white"
                        : active
                          ? "border-accent-600 bg-background-primary-default text-accent-600 ring-2 ring-accent-500/20"
                          : "border-border-button-default bg-background-primary-default text-text-tertiary",
                    )}
                  >
                    {done ? (
                      <RiCheckLine className="size-3" aria-hidden />
                    ) : (
                      <span className="tabular-nums">{position + 1}</span>
                    )}
                  </span>
                </button>
                <span
                  className={cx(
                    "text-caption-2-medium transition-[background-color,border-color,color] duration-200 ease-out motion-reduce:transition-none",
                    active ? "text-text-primary" : "text-text-tertiary",
                  )}
                >
                  {item.name}
                </span>
              </div>
              {position < last && (
                <span
                  aria-hidden
                  className={cx(
                    "mx-1.5 mt-[11px] h-0.5 min-w-4 flex-1 rounded-full transition-[background-color] duration-200 ease-out motion-reduce:transition-none",
                    position < current ? "bg-accent-500" : "bg-background-tertiary-default",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-2.5 rounded-lg border border-separator-border bg-background-secondary-default px-2.5 py-2">
        <div key={current} className="animate-label-in motion-reduce:animate-none">
          <p className="text-caption-1-semibold text-text-primary">
            {step.name} <span className="text-text-tertiary">·</span> {step.summary}
          </p>
          <p aria-live="polite" className="mt-0.5 text-caption-1-regular text-text-secondary">
            {step.detail}
          </p>
        </div>
      </div>
    </section>
  );
}

/* 12. Finish Celebration */

const FINISH_STATS = [
  { label: "Board", value: "1" },
  { label: "Tasks", value: "12" },
  { label: "Teammates", value: "3" },
] as const;

export function FinishCelebration() {
  const nextId = useId();
  const [shared, setShared] = useState(false);
  const [nextOpen, setNextOpen] = useState(false);

  useEffect(() => {
    if (!shared) return;
    const timer = window.setTimeout(() => setShared(false), 1800);
    return () => window.clearTimeout(timer);
  }, [shared]);

  const share = () => {
    setShared(true);
    void navigator.clipboard
      ?.writeText("https://app.northline.co/b/q4-launch")
      .catch(() => undefined);
  };

  return (
    <section aria-label="Setup complete" className={cx(cardSurface, "flex flex-col items-center p-2.5 text-center")}>
      <span className="mt-0.5 flex size-8 animate-label-in items-center justify-center rounded-full bg-accent-600 text-text-white shadow-xs ring-8 ring-accent-500/10 motion-reduce:animate-none">
        <RiCheckLine className="size-4" aria-hidden />
      </span>
      <h3 className="mt-1.5 text-title-3-semibold text-text-primary">Your launch plan is live</h3>
      <p className="mt-0.5 text-caption-1-regular text-text-secondary">
        Four steps, six minutes, one live board.
      </p>

      <dl className="mt-1.5 grid w-full grid-cols-3 divide-x divide-separator-border rounded-lg bg-background-secondary-default py-1">
        {FINISH_STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center">
            <dt className="text-caption-2-regular text-text-tertiary">{stat.label}</dt>
            <dd className="text-caption-1-semibold text-text-primary tabular-nums">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-1.5 flex w-full items-center gap-1.5">
        <button
          type="button"
          onClick={share}
          aria-live="polite"
          className={cx(primaryButton, "h-7 flex-1")}
        >
          {shared ? (
            <>
              <RiCheckLine className="size-3.5" aria-hidden />
              Link copied
            </>
          ) : (
            <>
              <RiShareLine className="size-3.5" aria-hidden />
              Share board
            </>
          )}
        </button>
        <button
          type="button"
          aria-expanded={nextOpen}
          aria-controls={nextId}
          onClick={() => setNextOpen((current) => !current)}
          className={cx(secondaryButton, "h-7 shrink-0 px-2")}
        >
          {nextOpen ? "Hide next" : "What’s next"}
        </button>
      </div>

      <div
        id={nextId}
        inert={!nextOpen}
        className={cx(revealGrid, "w-full", nextOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="mt-2 flex items-center justify-center gap-1 rounded-lg bg-background-secondary-default px-2 py-1.5 text-caption-2-regular text-text-secondary">
            <RiArrowRightLine className="size-3 text-accent-600 rtl:-scale-x-100" aria-hidden />
            Next: invite the launch team to the board.
          </p>
        </div>
      </div>
    </section>
  );
}

/* Specimens */

export const ONBOARDING_SECTION: ExtendedSection = {
  id: "onboarding",
  title: "Onboarding",
  blurb: "First-run paths that get a person to their first real result.",
  file: "onboarding.tsx",
  entries: [
    { name: "Welcome Panel", description: "A first-run card with one promise, one path and a clean exit.", Demo: WelcomePanel },
    { name: "Setup Checklist", description: "Five setup tasks with a live count and inline detail.", Demo: SetupChecklist },
    { name: "Starter Picker", description: "Pick blank, template or import; the preview and CTA follow.", Demo: StarterPicker },
    { name: "Sample Data Card", description: "Load 1,248 demo records and watch the empty state fill.", Demo: SampleDataCard },
    { name: "Invite Team Row", description: "Add emails, choose a role and watch invites send one by one.", Demo: InviteTeamRow },
    { name: "First Task Card", description: "One next action, a completion tick and the step it unlocks.", Demo: FirstTaskCard },
    { name: "Feature Tour Tip", description: "A coach mark with step dots and a spotlight that travels.", Demo: FeatureTourTip, wide: true },
    { name: "Activation Meter", description: "Four stages fill as the workspace activates.", Demo: ActivationMeter },
    { name: "Blank Slate", description: "An empty workspace with three actions that reveal on hover.", Demo: BlankSlate },
    { name: "Setup Email", description: "Edit the first name and send yourself a test email.", Demo: SetupEmail },
    { name: "Progress Steps", description: "A four-step stepper with completed ticks and detail.", Demo: ProgressSteps, wide: true },
    { name: "Finish Celebration", description: "A quiet finish card with a summary and next actions.", Demo: FinishCelebration },
  ],
};
