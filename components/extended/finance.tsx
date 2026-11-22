"use client";

import { useEffect, useId, useState } from "react";
import type { ComponentType, FormEvent } from "react";
import {
  RiAddLine, RiArrowDownLine, RiArrowDownSLine, RiArrowLeftRightLine, RiArrowRightLine, RiArrowUpLine,
  RiBankCardLine, RiCalendarLine, RiCarLine, RiCheckLine, RiDownloadLine, RiEyeLine, RiEyeOffLine, RiFileCopyLine,
  RiFileTextLine, RiFlag2Line, RiLoader4Line, RiPauseLine, RiPlayLine, RiRefreshLine, RiRestaurantLine,
  RiSnowflakeLine, RiSpotifyLine, RiSubtractLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* Shared */

type IconComponent = ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";
const card = "w-full rounded-xl border border-border-button-default bg-background-primary-default shadow-card";
const surfaceEase = "transition-[background-color,border-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none";
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const usdWhole = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function signedPercent(value: number) {
  return `${value >= 0 ? "+" : "−"}${Math.abs(value).toFixed(2)}%`;
}

function Change({ value }: { value: number }) {
  const up = value >= 0;
  const Icon = up ? RiArrowUpLine : RiArrowDownLine;
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-0.5 text-caption-2-semibold tabular-nums",
        up ? "bg-status-lime-background text-status-lime-text" : "bg-status-rose-background text-status-rose-text",
      )}
    >
      <Icon className="size-3" aria-hidden />
      <bdi dir="ltr">{signedPercent(value)}</bdi>
    </span>
  );
}

function Switch({ checked, onChange, label, disabled }: { checked: boolean; onChange: () => void; label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={cx(
        "relative h-5 w-9 shrink-0 rounded-full transition-[background-color,opacity] duration-200 ease-out motion-reduce:transition-none",
        checked ? "bg-accent-600" : "bg-background-tertiary-hover",
        disabled && "cursor-not-allowed opacity-40",
        focusRing,
      )}
    >
      <span
        aria-hidden
        className={cx(
          "absolute top-0.5 size-4 rounded-full bg-background-primary-default shadow-xs transition-[inset-inline-start] duration-200 ease-out motion-reduce:transition-none",
          checked ? "start-4" : "start-0.5",
        )}
      />
    </button>
  );
}

function IconButton({ icon: Icon, label, onClick, className }: {
  icon: IconComponent;
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cx(
        "flex size-7 shrink-0 items-center justify-center rounded-md text-foreground-icon-secondary",
        surfaceEase, "hover:bg-background-tertiary-default hover:text-text-primary", focusRing, className,
      )}
    >
      <Icon className="size-4" aria-hidden />
    </button>
  );
}

function StepperButton({ icon: Icon, label, onClick, disabled }: {
  icon: IconComponent;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "flex size-6 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary",
        surfaceEase, "hover:bg-background-tertiary-hover hover:text-text-primary disabled:pointer-events-none disabled:text-foreground-icon-disabled", focusRing,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
    </button>
  );
}

/* 1. Portfolio Row */

const HOLDINGS = [
  { ticker: "VTI", name: "Vanguard Total Market", shares: 128.4, value: 32140.8, change: 1.24, weight: 62 },
  { ticker: "NVDA", name: "NVIDIA", shares: 46, value: 12408, change: 3.86, weight: 24 },
  { ticker: "AAPL", name: "Apple", shares: 38, value: 7361.4, change: -0.42, weight: 14 },
];

const PORTFOLIO_TOTAL = HOLDINGS.reduce((total, holding) => total + holding.value, 0);

export function PortfolioRow() {
  const [selected, setSelected] = useState(0);
  const active = HOLDINGS[selected];

  return (
    <section aria-label="Portfolio holdings" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-caption-2-semibold tracking-wide text-text-tertiary uppercase">Portfolio</p>
          <p className="text-title-3-semibold text-text-primary tabular-nums" dir="ltr">
            {usd.format(PORTFOLIO_TOTAL)}
          </p>
        </div>
        <Change value={1.18} />
      </div>

      <ul className="mt-1.5">
        {HOLDINGS.map((holding, index) => {
          const isActive = index === selected;
          return (
            <li key={holding.ticker}>
              <button
                type="button"
                aria-pressed={isActive}
                aria-label={`${holding.name}, ${usd.format(holding.value)}, ${signedPercent(holding.change)} today`}
                onClick={() => setSelected(index)}
                className={cx(
                  "flex h-8 w-full items-center gap-2 rounded-md px-1.5 text-start",
                  surfaceEase,
                  isActive ? "bg-background-secondary-default" : "hover:bg-background-secondary-default/60",
                  focusRing,
                )}
              >
                <span className="w-9 shrink-0 text-caption-1-semibold text-text-primary">{holding.ticker}</span>
                <span className="min-w-0 flex-1 truncate text-caption-2-regular text-text-tertiary">
                  {holding.name}
                </span>
                <span className="shrink-0 text-caption-1-semibold text-text-primary tabular-nums" dir="ltr">
                  {usd.format(holding.value)}
                </span>
                <span
                  className={cx(
                    "w-11 shrink-0 text-end text-caption-2-medium tabular-nums",
                    holding.change >= 0 ? "text-status-lime-text" : "text-status-rose-text",
                  )}
                  dir="ltr"
                >
                  {signedPercent(holding.change)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div
        aria-live="polite"
        className="mt-1 flex items-center border-t border-separator-border pt-1 text-caption-2-regular text-text-tertiary"
      >
        <span key={selected} className="animate-label-in truncate motion-reduce:animate-none">
          {active.ticker} · {active.shares} shares · {active.weight}% of portfolio
        </span>
      </div>
    </section>
  );
}

/* 2. Market Ticker */

const TICKERS = [
  { symbol: "S&P 500", base: 6218.42, step: 0.66, digits: 2, prefix: "", change: 0.62, volume: "2.1B" },
  { symbol: "NVDA", base: 268.94, step: 0.72, digits: 2, prefix: "$", change: 3.86, volume: "214.6M" },
  { symbol: "AAPL", base: 193.72, step: -0.16, digits: 2, prefix: "$", change: -0.42, volume: "48.2M" },
  { symbol: "BTC", base: 96420, step: 52, digits: 0, prefix: "$", change: 1.18, volume: "$38.4B" },
];

function formatTick(value: number, digits: number) {
  return value.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function MarketTicker() {
  const [selected, setSelected] = useState(1);
  const [live, setLive] = useState(true);
  const [tick, setTick] = useState(0);
  const active = TICKERS[selected];

  useEffect(() => {
    if (!live) return;
    const timer = window.setInterval(() => setTick((current) => current + 1), 4000);
    return () => window.clearInterval(timer);
  }, [live]);

  return (
    <section aria-label="Market ticker" className={cx(card, "max-w-[560px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-caption-2-semibold tracking-wide text-text-tertiary uppercase">
          <span
            aria-hidden
            className={cx(
              "size-1.5 rounded-full",
              live ? "animate-pulse bg-status-lime-text motion-reduce:animate-none" : "bg-foreground-icon-quaternary",
            )}
          />
          Markets
        </span>
        <span className="ms-auto hidden text-caption-2-regular text-text-tertiary sm:inline">as of 16:04 GMT</span>
        <button
          type="button"
          aria-label={live ? "Pause market ticker" : "Resume market ticker"}
          onClick={() => setLive((current) => !current)}
          className={cx(
            "flex size-6 items-center justify-center rounded-md text-foreground-icon-secondary",
            surfaceEase,
            "hover:bg-background-tertiary-default hover:text-text-primary",
            focusRing,
          )}
        >
          {live ? (
            <RiPauseLine className="size-3.5" aria-hidden />
          ) : (
            <RiPlayLine className="size-3.5" aria-hidden />
          )}
        </button>
      </div>

      <div role="group" aria-label="Symbols" className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {TICKERS.map((ticker, index) => {
          const isActive = index === selected;
          const price = ticker.base + (tick % 6) * ticker.step;
          const up = ticker.change >= 0;
          const Arrow = up ? RiArrowUpLine : RiArrowDownLine;
          return (
            <button
              key={ticker.symbol}
              type="button"
              aria-pressed={isActive}
              onClick={() => setSelected(index)}
              className={cx(
                "rounded-lg border px-2 py-1.5 text-start",
                surfaceEase,
                isActive
                  ? "border-accent-500 bg-background-secondary-default"
                  : "border-border-button-default bg-background-primary-default hover:bg-background-primary-hover",
                focusRing,
              )}
            >
              <span className="flex items-center justify-between gap-1">
                <span className="truncate text-caption-2-semibold text-text-tertiary">{ticker.symbol}</span>
                <span
                  className={cx(
                    "flex shrink-0 items-center gap-0.5 text-caption-2-medium tabular-nums",
                    up ? "text-status-lime-text" : "text-status-rose-text",
                  )}
                >
                  <Arrow className="size-3" aria-hidden />
                  <bdi dir="ltr">{signedPercent(ticker.change)}</bdi>
                </span>
              </span>
              <span
                key={price}
                className="mt-0.5 block animate-label-in text-body-2-semibold text-text-primary tabular-nums motion-reduce:animate-none"
                dir="ltr"
              >
                {ticker.prefix}
                {formatTick(price, ticker.digits)}
              </span>
            </button>
          );
        })}
      </div>

      <div aria-live="polite" className="mt-1.5 flex items-center gap-2 text-caption-2-regular text-text-tertiary">
        <span className="truncate">
          {active.symbol} · Vol {active.volume} · {live ? "updates every 4s" : "paused"}
        </span>
        <span className="ms-auto shrink-0 tabular-nums" dir="ltr">
          {live ? "LIVE" : "HOLD"}
        </span>
      </div>
    </section>
  );
}

/* 3. Transaction List */

const TRANSACTIONS: {
  merchant: string;
  when: string;
  category: string;
  amount: number;
  icon: IconComponent;
}[] = [
  { merchant: "Sweetgreen", when: "Today, 12:48", category: "Food", amount: 18.4, icon: RiRestaurantLine },
  { merchant: "Lyft", when: "Today, 09:12", category: "Transit", amount: 24.8, icon: RiCarLine },
  { merchant: "Spotify", when: "Yesterday", category: "Bills", amount: 11.99, icon: RiSpotifyLine },
];

const TRANSACTION_FILTERS = ["All", "Food", "Transit", "Bills"] as const;
type TransactionFilter = (typeof TRANSACTION_FILTERS)[number];

export function TransactionList() {
  const [filter, setFilter] = useState<TransactionFilter>("All");
  const visible =
    filter === "All" ? TRANSACTIONS : TRANSACTIONS.filter((transaction) => transaction.category === filter);
  const total = visible.reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <section aria-label="Recent transactions" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Transactions</h3>
        <span
          aria-live="polite"
          className="text-caption-2-regular text-text-tertiary tabular-nums"
          dir="ltr"
        >
          {visible.length} · {usd.format(total)}
        </span>
      </div>

      <div role="group" aria-label="Filter transactions" className="mt-1.5 flex gap-1">
        {TRANSACTION_FILTERS.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={filter === option}
            onClick={() => setFilter(option)}
            className={cx(
              "h-6 rounded-full px-2 text-caption-2-semibold",
              surfaceEase,
              filter === option
                ? "bg-accent-600 text-text-white"
                : "bg-background-secondary-default text-text-secondary hover:text-text-primary",
              focusRing,
            )}
          >
            {option}
          </button>
        ))}
      </div>

      <ul key={filter} className="mt-1.5 animate-label-in motion-reduce:animate-none">
        {visible.map((transaction) => {
          const Icon = transaction.icon;
          return (
            <li
              key={transaction.merchant}
              className="flex h-9 items-center gap-2 rounded-md px-1.5 transition-colors duration-150 ease-out hover:bg-background-secondary-default motion-reduce:transition-none"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-secondary-default text-foreground-icon-secondary">
                <Icon className="size-3.5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-caption-1-semibold text-text-primary">{transaction.merchant}</p>
                <p className="truncate text-caption-2-regular text-text-tertiary">
                  {transaction.category} · {transaction.when}
                </p>
              </div>
              <span className="shrink-0 text-caption-1-semibold text-text-primary tabular-nums" dir="ltr">
                −{usd.format(transaction.amount)}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* 4. Budget Ring */

const MONTHLY_BUDGET = 2400;
const BUDGET_START = 1840;
const RING_RADIUS = 42;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

export function BudgetRing() {
  const [spent, setSpent] = useState(BUDGET_START);
  const remaining = Math.max(0, MONTHLY_BUDGET - spent);
  const percent = Math.min(100, Math.round((spent / MONTHLY_BUDGET) * 100));
  const exhausted = spent >= MONTHLY_BUDGET;

  return (
    <section aria-label="November budget" className={cx(card, "max-w-[320px] p-3")}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">November budget</h3>
        <div className="flex items-center gap-1">
          <span className="text-caption-2-regular text-text-tertiary">of {usdWhole.format(MONTHLY_BUDGET)}</span>
          <IconButton icon={RiRefreshLine} label="Reset November budget" className="size-6" onClick={() => setSpent(BUDGET_START)} />
        </div>
      </div>

      <div className="mt-2 flex items-center gap-3">
        <div
          role="img"
          aria-label={`${percent}% of the November budget spent, ${usd.format(remaining)} remaining`}
          className="relative size-24 shrink-0"
        >
          <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden>
            <circle
              cx="50"
              cy="50"
              r={RING_RADIUS}
              fill="none"
              strokeWidth="9"
              className="stroke-background-tertiary-default"
            />
            <circle
              cx="50"
              cy="50"
              r={RING_RADIUS}
              fill="none"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={RING_LENGTH}
              strokeDashoffset={RING_LENGTH - (percent / 100) * RING_LENGTH}
              className="stroke-accent-500 transition-[stroke-dashoffset] duration-200 ease-out motion-reduce:transition-none"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden>
            <span className="text-title-3-semibold text-text-primary tabular-nums" dir="ltr">
              {percent}%
            </span>
            <span className="text-caption-2-regular text-text-tertiary">spent</span>
          </div>
        </div>

        <dl className="min-w-0 flex-1">
          <div>
            <dt className="text-caption-2-regular text-text-tertiary">Spent</dt>
            <dd className="text-body-2-semibold text-text-primary tabular-nums" dir="ltr">
              {usdWhole.format(spent)}
            </dd>
          </div>
          <div className="mt-1.5">
            <dt className="text-caption-2-regular text-text-tertiary">Remaining</dt>
            <dd
              className={cx(
                "text-body-2-semibold tabular-nums",
                remaining > 0 ? "text-status-lime-text" : "text-status-rose-text",
              )}
              dir="ltr"
            >
              {usdWhole.format(remaining)}
            </dd>
          </div>
        </dl>
      </div>

      <button
        type="button"
        disabled={exhausted}
        onClick={() => setSpent((current) => Math.min(MONTHLY_BUDGET, current + 40))}
        className={cx(
          "mt-2 inline-flex h-7 w-full items-center justify-center gap-1.5 rounded-lg bg-button-primary px-2.5",
          "text-caption-1-semibold text-text-white shadow-xs",
          "transition-[opacity,transform] duration-150 ease-out active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100",
          "disabled:pointer-events-none disabled:opacity-50",
          focusRing,
        )}
      >
        <RiAddLine className="size-3.5" aria-hidden />
        {exhausted ? "Budget fully spent" : "Log a $40 lunch"}
      </button>
    </section>
  );
}

/* 5. Account Card */

const ACCOUNT_BALANCE = 12480.55;

export function AccountCard() {
  const [hidden, setHidden] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyNumber = () => {
    void navigator.clipboard?.writeText("0210000218842").catch(() => {});
    setCopied(true);
  };

  return (
    <section aria-label="Everyday Checking account" className={cx(card, "max-w-[320px] p-3")}>
      <div className="flex items-center gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background-tertiary-default text-foreground-icon-secondary">
          <RiBankCardLine className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Everyday Checking</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">Northline Bank · Member FDIC</p>
        </div>
        <IconButton icon={hidden ? RiEyeOffLine : RiEyeLine} label={hidden ? "Show account balance" : "Hide account balance"} onClick={() => setHidden((current) => !current)} />
      </div>

      <div className="mt-2">
        <p className="text-caption-2-semibold tracking-wide text-text-tertiary uppercase">Available balance</p>
        <p aria-live="polite" className="text-title-2-medium text-text-primary tabular-nums" dir="ltr">
          <span key={hidden ? "hidden" : "shown"} className="animate-label-in motion-reduce:animate-none">
            {hidden ? "••••••" : usd.format(ACCOUNT_BALANCE)}
          </span>
        </p>
      </div>

      <div className="mt-2 flex items-center gap-2 border-t border-separator-border pt-2">
        <span className="text-caption-2-regular text-text-tertiary">Account</span>
        <span className="text-caption-1-semibold text-text-primary tabular-nums" dir="ltr">•••• 8842</span>
        <span className="ms-auto flex items-center gap-1">
          <span key={copied ? "copied" : "idle"} role="status" className="min-w-10 animate-label-in text-end text-caption-2-medium text-status-lime-text motion-reduce:animate-none">
            {copied ? "Copied" : ""}
          </span>
          <IconButton icon={copied ? RiCheckLine : RiFileCopyLine} label={copied ? "Account number copied" : "Copy account number"} onClick={copyNumber} />
        </span>
      </div>
    </section>
  );
}

/* 6. Transfer Form */

const ACCOUNTS = [
  { id: "checking", name: "Everyday Checking", mask: "8842" },
  { id: "savings", name: "High-Yield Savings", mask: "1120" },
] as const;

type AccountId = (typeof ACCOUNTS)[number]["id"];
type TransferState = "idle" | "sending" | "sent";

function formatShortDate(iso: string) {
  const [, month, day] = iso.split("-").map(Number);
  return `${MONTHS_SHORT[Math.max(0, (month || 1) - 1)]} ${day || 5}`;
}

function AccountField({ label, value, other, disabled, onChange }: {
  label: string;
  value: AccountId;
  other: AccountId;
  disabled: boolean;
  onChange: (id: AccountId) => void;
}) {
  return (
    <div className="flex h-7 items-center gap-1.5 px-2">
      <span className="w-8 shrink-0 text-caption-2-regular text-text-tertiary">{label}</span>
      <div className="relative min-w-0 flex-1">
        <select
          aria-label={`${label} account`}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value as AccountId)}
          className="h-6 w-full appearance-none rounded-sm bg-transparent pe-4 text-caption-1-semibold text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:opacity-60"
        >
          {ACCOUNTS.map((account) => (
            <option key={account.id} value={account.id} disabled={account.id === other}>{account.name} · {account.mask}</option>
          ))}
        </select>
        <RiArrowDownSLine className="pointer-events-none absolute end-0 top-1/2 size-3 -translate-y-1/2 text-foreground-icon-tertiary" aria-hidden />
      </div>
    </div>
  );
}

export function TransferForm() {
  const amountId = useId();
  const dateId = useId();
  const [from, setFrom] = useState<AccountId>("checking");
  const [to, setTo] = useState<AccountId>("savings");
  const [amount, setAmount] = useState("240.00");
  const [date, setDate] = useState("2026-11-05");
  const [status, setStatus] = useState<TransferState>("idle");
  const [error, setError] = useState<string | null>(null);

  const fromAccount = ACCOUNTS.find((account) => account.id === from) ?? ACCOUNTS[0];
  const toAccount = ACCOUNTS.find((account) => account.id === to) ?? ACCOUNTS[1];
  const parsed = Number.parseFloat(amount);
  const value = Number.isFinite(parsed) ? parsed : 0;
  const dateLabel = formatShortDate(date);
  const note = error
    ? { tone: "text-text-error-primary", text: error }
    : status === "sent"
      ? { tone: "text-status-lime-text", text: `Sent to ${toAccount.name} · ${dateLabel}` }
      : status === "sending"
        ? { tone: "text-text-tertiary", text: `Sending from ${fromAccount.name}…` }
        : { tone: "text-text-tertiary", text: "Arrives in seconds · No fee" };
  const submitLabel =
    status === "sending" ? "Sending" : status === "sent" ? "Send another" : `Transfer ${usd.format(value)}`;

  useEffect(() => {
    if (status !== "sending") return;
    const timer = window.setTimeout(() => setStatus("sent"), 900);
    return () => window.clearTimeout(timer);
  }, [status]);

  const swap = () => {
    setFrom(to);
    setTo(from);
    setStatus("idle");
    setError(null);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sent") {
      setStatus("idle");
      setError(null);
    } else if (!Number.isFinite(parsed) || parsed <= 0) {
      setError("Enter an amount above $0.");
    } else if (parsed > 1200) {
      setError("The daily transfer limit is $1,200.");
    } else {
      setError(null);
      setStatus("sending");
    }
  };

  return (
    <form aria-label="Transfer money" onSubmit={submit} className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Move money</h3>
        <span className="text-caption-2-regular text-text-tertiary">Instant · no fee</span>
      </div>

      <div className="mt-1.5 flex items-center gap-1.5">
        <div className="min-w-0 flex-1 divide-y divide-separator-border overflow-hidden rounded-lg border border-border-button-default">
          <AccountField label="From" value={from} other={to} disabled={status !== "idle"} onChange={(id) => { setFrom(id); setStatus("idle"); setError(null); }} />
          <AccountField label="To" value={to} other={from} disabled={status !== "idle"} onChange={(id) => { setTo(id); setStatus("idle"); setError(null); }} />
        </div>

        <button type="button" aria-label="Swap from and to accounts" onClick={swap} disabled={status !== "idle"}
          className={cx(
            "flex size-7 shrink-0 items-center justify-center rounded-full border border-border-button-default bg-background-primary-default text-foreground-icon-secondary shadow-xs",
            surfaceEase, "hover:bg-background-primary-hover hover:text-text-primary disabled:pointer-events-none disabled:opacity-40", focusRing,
          )}>
          <RiArrowLeftRightLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
        </button>
      </div>

      <div className="mt-1.5 flex items-center gap-1.5">
        <div className="flex h-8 min-w-0 flex-1 items-center rounded-lg bg-background-tertiary-default px-2 focus-within:ring-2 focus-within:ring-border-focus-ring">
          <span aria-hidden className="text-caption-1-semibold text-text-tertiary">$</span>
          <input id={amountId} aria-label="Transfer amount" inputMode="decimal" autoComplete="off" value={amount} disabled={status !== "idle"}
            onChange={(event) => { setAmount(event.target.value.replace(/[^\d.]/g, "")); setStatus("idle"); setError(null); }}
            className="min-w-0 flex-1 bg-transparent px-1 text-caption-1-semibold text-text-primary tabular-nums outline-none disabled:opacity-60" />
          <span className="shrink-0 text-caption-2-semibold text-text-tertiary">USD</span>
        </div>

        <div className="relative shrink-0">
          <RiCalendarLine className="pointer-events-none absolute start-2 top-1/2 size-3.5 -translate-y-1/2 text-foreground-icon-tertiary" aria-hidden />
          <label htmlFor={dateId} className="sr-only">Transfer date</label>
          <input id={dateId} type="date" value={date} disabled={status !== "idle"} onChange={(event) => setDate(event.target.value)}
            className="h-8 w-[132px] rounded-lg bg-background-tertiary-default ps-7 pe-1 text-caption-2-medium text-text-primary outline-none transition-[background-color,box-shadow] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:opacity-60 motion-reduce:transition-none" />
        </div>
      </div>

      <div aria-live="polite" className="mt-1 flex h-4 items-center gap-1">
        <p key={note.text} role={error ? "alert" : undefined}
          className={cx("flex min-w-0 animate-label-in items-center gap-1 truncate text-caption-2-regular motion-reduce:animate-none", note.tone)}>
          {status === "sending" && (
            <RiLoader4Line className="size-3 shrink-0 animate-spin motion-reduce:animate-none" aria-hidden />
          )}
          {status === "sent" && <RiCheckLine className="size-3 shrink-0" aria-hidden />}
          <span className="truncate">{note.text}</span>
        </p>
      </div>

      <button type="submit" disabled={status === "sending"}
        className={cx(
          "inline-flex h-7 w-full items-center justify-center gap-1.5 rounded-lg px-2.5 text-caption-1-semibold shadow-xs transition-[background-color,opacity,transform] duration-150 ease-out active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100",
          status === "sent"
            ? "border border-border-button-default bg-background-primary-default text-text-primary hover:bg-background-primary-hover"
            : "bg-button-primary text-text-white hover:opacity-90 disabled:opacity-60",
          focusRing,
        )}>
        {status === "sending" ? (
          <RiLoader4Line className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
        ) : status === "sent" ? (
          <RiRefreshLine className="size-3.5" aria-hidden />
        ) : (
          <RiArrowRightLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
        )}
        {submitLabel}
      </button>
    </form>
  );
}

/* 7. Statement Row */

const STATEMENTS = [
  { id: "2026-10", period: "October 2026", balance: 12480.55, size: "2.4 MB" },
  { id: "2026-09", period: "September 2026", balance: 11902.1, size: "2.3 MB" },
  { id: "2026-08", period: "August 2026", balance: 13448.9, size: "2.4 MB" },
];

type DownloadState = "loading" | "done";

export function StatementRow() {
  const [state, setState] = useState<Record<string, DownloadState>>({});
  const loading = STATEMENTS.find((statement) => state[statement.id] === "loading");
  const downloaded = STATEMENTS.filter((statement) => state[statement.id] === "done").length;

  useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => {
      setState((current) => ({ ...current, [loading.id]: "done" }));
    }, 850);
    return () => window.clearTimeout(timer);
  }, [loading]);

  return (
    <section aria-label="Account statements" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Statements</h3>
        <span className="text-caption-2-regular text-text-tertiary">2026</span>
      </div>

      <ul className="mt-1">
        {STATEMENTS.map((statement) => {
          const status = state[statement.id] ?? "idle";
          const isDone = status === "done";
          return (
            <li key={statement.id} className="flex h-9 items-center gap-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background-secondary-default text-foreground-icon-secondary">
                <RiFileTextLine className="size-3.5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-caption-1-semibold text-text-primary">{statement.period}</p>
                <p className="truncate text-caption-2-regular text-text-tertiary">
                  Closing {usd.format(statement.balance)} · PDF
                </p>
              </div>
              <button
                type="button"
                aria-label={`Download ${statement.period} statement`}
                disabled={status === "loading"}
                onClick={() => setState((current) => ({ ...current, [statement.id]: "loading" }))}
                className={cx(
                  "flex size-7 shrink-0 items-center justify-center rounded-md",
                  surfaceEase,
                  isDone ? "text-status-lime-text" : "text-foreground-icon-secondary",
                  "hover:bg-background-tertiary-default hover:text-text-primary disabled:pointer-events-none",
                  focusRing,
                )}
              >
                {status === "loading" ? (
                  <RiLoader4Line className="size-4 animate-spin motion-reduce:animate-none" aria-hidden />
                ) : isDone ? (
                  <RiCheckLine className="size-4 animate-label-in motion-reduce:animate-none" aria-hidden />
                ) : (
                  <RiDownloadLine className="size-4" aria-hidden />
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <p role="status" className="mt-1 flex items-center border-t border-separator-border pt-1 text-caption-2-regular text-text-tertiary">
        {loading
          ? `Preparing ${loading.period}…`
          : downloaded > 0
            ? `${downloaded} of ${STATEMENTS.length} downloaded · ${STATEMENTS[0].size} each`
            : "PDF statements · Updated monthly"}
      </p>
    </section>
  );
}

/* 8. Card Control */

export function CardControl() {
  const [frozen, setFrozen] = useState(false);
  const [online, setOnline] = useState(true);
  const [limit, setLimit] = useState(500);

  return (
    <section aria-label="Card controls" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span
          className={cx(
            "flex size-8 shrink-0 items-center justify-center rounded-lg shadow-xs",
            "transition-[background-color,transform] duration-200 ease-out motion-reduce:transition-none",
            frozen ? "rotate-6 bg-status-blue-background text-status-blue-text" : "rotate-0 bg-accent-600 text-text-white",
          )}
        >
          {frozen ? (
            <RiSnowflakeLine className="size-4" aria-hidden />
          ) : (
            <RiBankCardLine className="size-4" aria-hidden />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Platinum debit</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary tabular-nums" dir="ltr">
            •• 8842 · Exp 08/28
          </p>
        </div>
        <span
          role="status"
          className={cx(
            "shrink-0 rounded-full px-1.5 py-0.5 text-caption-2-semibold",
            "transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
            frozen ? "bg-status-blue-background text-status-blue-text" : "bg-status-lime-background text-status-lime-text",
          )}
        >
          {frozen ? "Frozen" : "Active"}
        </span>
      </div>

      <div className="mt-1.5 flex flex-col divide-y divide-separator-border">
        <div className="flex h-8 items-center gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-caption-1-semibold text-text-primary">Freeze card</p>
          </div>
          <Switch
            checked={frozen}
            onChange={() => setFrozen((current) => !current)}
            label="Freeze card"
          />
        </div>

        <div className="flex h-8 items-center gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-caption-1-semibold text-text-primary">Online payments</p>
          </div>
          <Switch
            checked={online}
            onChange={() => setOnline((current) => !current)}
            label="Allow online payments"
            disabled={frozen}
          />
        </div>

        <div className="flex h-8 items-center gap-2">
          <p className="min-w-0 flex-1 text-caption-1-semibold text-text-primary">Daily limit</p>
          <StepperButton
            icon={RiSubtractLine}
            label="Decrease daily limit by $100"
            disabled={limit <= 100}
            onClick={() => setLimit((current) => Math.max(100, current - 100))}
          />
          <span className="w-12 text-center text-caption-1-semibold text-text-primary tabular-nums" dir="ltr">
            {usdWhole.format(limit)}
          </span>
          <StepperButton
            icon={RiAddLine}
            label="Increase daily limit by $100"
            disabled={limit >= 2000}
            onClick={() => setLimit((current) => Math.min(2000, current + 100))}
          />
        </div>
      </div>

      <div
        inert={!frozen}
        aria-hidden={!frozen}
        className={cx(
          "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none",
          frozen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="mt-1.5 flex items-center gap-1.5 rounded-md bg-status-blue-background px-2 py-1 text-caption-2-medium text-status-blue-text">
            <RiSnowflakeLine className="size-3.5 shrink-0" aria-hidden />
            Frozen — every new purchase will decline.
          </p>
        </div>
      </div>
    </section>
  );
}

/* 9. Bill Split */

const BILL_TOTAL = 186.4;

const BILL_PEOPLE = [
  { id: "maya", name: "Maya", initials: "MC" },
  { id: "dev", name: "Dev", initials: "DR" },
  { id: "priya", name: "Priya", initials: "PS" },
  { id: "jonas", name: "Jonas", initials: "JW" },
];

export function BillSplit() {
  const [included, setIncluded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(BILL_PEOPLE.map((person) => [person.id, true])),
  );
  const count = BILL_PEOPLE.filter((person) => included[person.id]).length;
  const share = count > 0 ? BILL_TOTAL / count : 0;

  return (
    <section aria-label="Split dinner bill" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-body-2-semibold text-text-primary">Split dinner</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">Nobu · Nov 4 · 4 people</p>
        </div>
        <span className="shrink-0 text-title-3-semibold text-text-primary tabular-nums" dir="ltr">
          {usd.format(BILL_TOTAL)}
        </span>
      </div>

      <ul className="mt-1.5">
        {BILL_PEOPLE.map((person) => {
          const isIncluded = included[person.id];
          return (
            <li key={person.id}>
              <button
                type="button"
                aria-pressed={isIncluded}
                aria-label={`Include ${person.name} in the split`}
                onClick={() => setIncluded((current) => ({ ...current, [person.id]: !current[person.id] }))}
                className={cx(
                  "flex h-6 w-full items-center gap-2 rounded-md px-1 text-start",
                  surfaceEase,
                  isIncluded ? "hover:bg-background-secondary-default" : "opacity-60 hover:opacity-100",
                  focusRing,
                )}
              >
                <span
                  className={cx(
                    "flex size-5 shrink-0 items-center justify-center rounded-full text-caption-2-semibold",
                    "transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
                    isIncluded
                      ? "bg-accent-100 text-accent-700"
                      : "bg-background-tertiary-default text-text-tertiary",
                  )}
                >
                  {person.initials}
                </span>
                <span
                  className={cx(
                    "min-w-0 flex-1 truncate text-caption-1-semibold",
                    isIncluded ? "text-text-primary" : "text-text-tertiary line-through",
                  )}
                >
                  {person.name}
                </span>
                <span
                  className={cx(
                    "w-14 shrink-0 text-end text-caption-1-semibold tabular-nums",
                    isIncluded ? "text-text-primary" : "text-text-tertiary",
                  )}
                  dir="ltr"
                >
                  {isIncluded ? usd.format(share) : "—"}
                </span>
                <span
                  aria-hidden
                  className={cx(
                    "flex size-4 shrink-0 items-center justify-center rounded-full",
                    "transition-[background-color,border-color,color] duration-200 ease-out motion-reduce:transition-none",
                    isIncluded
                      ? "bg-accent-600 text-text-white"
                      : "border border-border-button-default text-transparent",
                  )}
                >
                  <RiCheckLine className="size-3" />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div
        aria-live="polite"
        className="mt-1.5 flex items-center justify-between gap-2 border-t border-separator-border pt-1.5"
      >
        <span key={count} className="animate-label-in text-caption-2-regular text-text-tertiary motion-reduce:animate-none">
          {count === 0 ? "No one selected" : `Split between ${count}`}
        </span>
        <span key={count} className="animate-label-in text-caption-1-semibold text-text-primary tabular-nums motion-reduce:animate-none" dir="ltr">
          {count === 0 ? "Select someone" : `${usd.format(share)} each`}
        </span>
      </div>
    </section>
  );
}

/* 10. Savings Goal */

const SAVINGS_TARGET = 5000;
const SAVINGS_START = 3250;
const MONTHLY_START = 250;
const TRIP_BASE_MONTH = 10;
const TRIP_BASE_YEAR = 2026;

export function SavingsGoal() {
  const [saved, setSaved] = useState(SAVINGS_START);
  const [monthly, setMonthly] = useState(MONTHLY_START);
  const complete = saved >= SAVINGS_TARGET;
  const percent = Math.min(100, Math.round((saved / SAVINGS_TARGET) * 100));
  const monthsLeft = complete ? 0 : Math.ceil((SAVINGS_TARGET - saved) / monthly);
  const targetIndex = TRIP_BASE_MONTH + monthsLeft;
  const targetLabel = complete
    ? "Goal reached"
    : `On track for ${MONTHS_LONG[targetIndex % 12]} ${TRIP_BASE_YEAR + Math.floor(targetIndex / 12)}`;

  return (
    <section aria-label="Savings goal: Japan trip" className={cx(card, "max-w-[320px] p-3")}>
      <div className="flex items-center gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent-100 text-accent-700">
          <RiFlag2Line className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">Japan trip</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">
            Target {usdWhole.format(SAVINGS_TARGET)}
          </p>
        </div>
        <IconButton icon={RiRefreshLine} label="Reset savings goal" onClick={() => { setSaved(SAVINGS_START); setMonthly(MONTHLY_START); }} />
      </div>

      <div
        role="progressbar"
        aria-label="Japan trip savings"
        aria-valuemin={0}
        aria-valuemax={SAVINGS_TARGET}
        aria-valuenow={saved}
        aria-valuetext={`${usd.format(saved)} of ${usd.format(SAVINGS_TARGET)} saved`}
        className="mt-2 h-2 overflow-hidden rounded-full bg-background-tertiary-default"
      >
        <div
          className="h-full rounded-full bg-accent-500 transition-[width] duration-200 ease-out motion-reduce:transition-none"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-1 flex items-baseline justify-between gap-2">
        <span className="text-caption-2-regular text-text-tertiary">
          Saved <span className="text-caption-2-semibold text-text-primary tabular-nums" dir="ltr">{usdWhole.format(saved)}</span>
        </span>
        <span className="text-caption-1-semibold text-text-primary tabular-nums" dir="ltr">
          {percent}%
        </span>
      </div>

      <p aria-live="polite" className="mt-0.5 text-caption-2-regular text-status-lime-text">
        {targetLabel}
      </p>

      <div className="mt-1.5 flex h-8 items-center gap-2">
        <p className="min-w-0 flex-1 text-caption-1-semibold text-text-primary">Monthly</p>
        <StepperButton icon={RiSubtractLine} label="Decrease monthly contribution by $50" disabled={monthly <= 50} onClick={() => setMonthly((current) => Math.max(50, current - 50))} />
        <span className="w-12 text-center text-caption-1-semibold text-text-primary tabular-nums" dir="ltr">{usdWhole.format(monthly)}</span>
        <StepperButton icon={RiAddLine} label="Increase monthly contribution by $50" disabled={monthly >= 500} onClick={() => setMonthly((current) => Math.min(500, current + 50))} />
      </div>

      <button
        type="button"
        disabled={complete}
        onClick={() => setSaved((current) => Math.min(SAVINGS_TARGET, current + monthly))}
        className={cx(
          "mt-1 inline-flex h-7 w-full items-center justify-center gap-1.5 rounded-lg px-2.5",
          "text-caption-1-semibold shadow-xs",
          "transition-[background-color,opacity,transform] duration-150 ease-out active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100",
          complete
            ? "border border-border-button-default bg-background-primary-default text-status-lime-text"
            : "bg-button-primary text-text-white hover:opacity-90",
          "disabled:pointer-events-none",
          focusRing,
        )}
      >
        {complete ? (
          <>
            <RiCheckLine className="size-3.5" aria-hidden />
            Goal reached
          </>
        ) : (
          <>
            <RiAddLine className="size-3.5" aria-hidden />
            Add {usdWhole.format(monthly)} this month
          </>
        )}
      </button>
    </section>
  );
}

/* 11. Currency Converter */

const CURRENCIES = [
  { code: "USD", name: "US dollar", rate: 1, symbol: "$" },
  { code: "EUR", name: "Euro", rate: 0.9231, symbol: "€" },
  { code: "GBP", name: "Pound sterling", rate: 0.7842, symbol: "£" },
  { code: "JPY", name: "Japanese yen", rate: 151.42, symbol: "¥" },
] as const;

type CurrencyCode = (typeof CURRENCIES)[number]["code"];

function formatCurrency(value: number, code: CurrencyCode) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: code, maximumFractionDigits: code === "JPY" ? 0 : 2 }).format(value);
}

function CurrencySelect({ label, value, onChange }: { label: string; value: CurrencyCode; onChange: (code: CurrencyCode) => void }) {
  return (
    <label className="relative min-w-0 flex-1">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as CurrencyCode)}
        className="h-8 w-full appearance-none rounded-lg bg-background-tertiary-default ps-2 pe-6 text-caption-1-semibold text-text-primary outline-none transition-[background-color,box-shadow] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-border-focus-ring motion-reduce:transition-none"
      >
        {CURRENCIES.map((currency) => (
          <option key={currency.code} value={currency.code}>{currency.code}</option>
        ))}
      </select>
      <RiArrowDownSLine
        className="pointer-events-none absolute end-2 top-1/2 size-3 -translate-y-1/2 text-foreground-icon-tertiary"
        aria-hidden
      />
    </label>
  );
}

export function CurrencyConverter() {
  const amountId = useId();
  const [from, setFrom] = useState<CurrencyCode>("USD");
  const [to, setTo] = useState<CurrencyCode>("EUR");
  const [amount, setAmount] = useState("1500");

  const fromCurrency = CURRENCIES.find((currency) => currency.code === from) ?? CURRENCIES[0];
  const toCurrency = CURRENCIES.find((currency) => currency.code === to) ?? CURRENCIES[1];
  const parsed = Number.parseFloat(amount.replace(/,/g, ""));
  const value = Number.isFinite(parsed) ? parsed : 0;
  const rate = toCurrency.rate / fromCurrency.rate;
  const converted = value * rate;

  return (
    <section aria-label="Currency converter" className={cx(card, "max-w-[320px] p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Convert</h3>
        <span className="text-caption-2-regular text-text-tertiary">Mid-market rate</span>
      </div>

      <div className="mt-2 flex items-center gap-1.5">
        <CurrencySelect label="From currency" value={from} onChange={setFrom} />

        <button
          type="button"
          aria-label="Swap currencies"
          onClick={() => {
            setFrom(to);
            setTo(from);
          }}
          className={cx(
            "flex size-7 shrink-0 items-center justify-center rounded-full border border-border-button-default",
            "bg-background-primary-default text-foreground-icon-secondary shadow-xs",
            surfaceEase,
            "hover:bg-background-primary-hover hover:text-text-primary",
            focusRing,
          )}
        >
          <RiArrowLeftRightLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
        </button>

        <CurrencySelect label="To currency" value={to} onChange={setTo} />
      </div>

      <div className="mt-1.5 flex h-8 items-center rounded-lg bg-background-tertiary-default px-2 focus-within:ring-2 focus-within:ring-border-focus-ring">
        <span aria-hidden className="text-caption-1-semibold text-text-tertiary">
          {fromCurrency.symbol}
        </span>
        <label htmlFor={amountId} className="sr-only">
          Amount to convert
        </label>
        <input
          id={amountId}
          inputMode="decimal"
          autoComplete="off"
          value={amount}
          onChange={(event) => setAmount(event.target.value.replace(/[^\d.,]/g, ""))}
          className="min-w-0 flex-1 bg-transparent px-1 text-caption-1-semibold text-text-primary tabular-nums outline-none"
        />
        <span className="shrink-0 text-caption-2-semibold text-text-tertiary">{from}</span>
      </div>

      <div className="mt-1.5 rounded-lg bg-background-secondary-default px-2.5 py-1.5">
        <p
          key={`${to}-${amount}`}
          aria-live="polite"
          className="animate-label-in text-title-3-semibold text-text-primary tabular-nums motion-reduce:animate-none"
          dir="ltr"
        >
          {formatCurrency(converted, to)}
        </p>
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-caption-2-regular text-text-tertiary tabular-nums" dir="ltr">
            1 {from} = {rate.toLocaleString("en-US", { maximumFractionDigits: 4 })} {to}
          </span>
          <span className="shrink-0 text-caption-2-regular text-text-tertiary">Nov 5</span>
        </div>
      </div>
    </section>
  );
}

/* 12. Spending Heatmap */

const HEATMAP_START = new Date(2026, 7, 10);
const HEATMAP_TIERS = [
  "bg-background-tertiary-default",
  "bg-chart-1/25",
  "bg-chart-1/45",
  "bg-chart-1/70",
  "bg-chart-1",
] as const;
const HEATMAP_WEEKDAYS = ["Mon", "", "Wed", "", "Fri", "", "Sun"];

const HEATMAP_DAYS = Array.from({ length: 84 }, (_, index) => {
  const date = new Date(HEATMAP_START);
  date.setDate(HEATMAP_START.getDate() + index);
  const day = index % 7;
  const weekend = day >= 5;
  const value = 18 + ((index * 37) % 82) + (weekend ? 28 : 0);
  const tier = value < 35 ? 0 : value < 58 ? 1 : value < 82 ? 2 : value < 106 ? 3 : 4;
  return {
    key: index,
    week: Math.floor(index / 7),
    value,
    tier,
    label: `${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}`,
  };
});

const HEATMAP_TOTAL = HEATMAP_DAYS.reduce((total, day) => total + day.value, 0);

export function SpendingHeatmap() {
  const [active, setActive] = useState(83);
  const day = HEATMAP_DAYS[active];

  return (
    <section aria-label="Spending heatmap" className={cx(card, "max-w-[560px] p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Spending</h3>
        <span className="text-caption-2-regular text-text-tertiary tabular-nums">
          {usdWhole.format(HEATMAP_TOTAL)} · 12 weeks
        </span>
      </div>

      <div dir="ltr" className="mt-1.5 flex gap-1.5">
        <div aria-hidden className="grid grid-rows-7 gap-1">
          {HEATMAP_WEEKDAYS.map((label, index) => (
            <span
              key={index}
              className="flex h-3.5 items-center text-caption-2-regular text-text-tertiary"
            >
              {label}
            </span>
          ))}
        </div>

        <div
          role="group"
          aria-label="Daily spending for the last twelve weeks"
          className="grid grid-flow-col grid-rows-7 gap-1"
        >
          {HEATMAP_DAYS.map((cell) => {
            const isActive = cell.key === active;
            return (
              <button
                key={cell.key}
                type="button"
                aria-pressed={isActive}
                aria-label={`Week ${cell.week + 1}, ${cell.label}: ${usdWhole.format(cell.value)} spent`}
                onMouseEnter={() => setActive(cell.key)}
                onFocus={() => setActive(cell.key)}
                onClick={() => setActive(cell.key)}
                className={cx(
                  "size-3.5 rounded-xs",
                  "transition-[transform,background-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                  "hover:scale-125 focus-visible:scale-125 motion-reduce:hover:scale-100 motion-reduce:focus-visible:scale-100",
                  HEATMAP_TIERS[cell.tier],
                  isActive && "ring-2 ring-border-focus-ring",
                  focusRing,
                )}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-1.5 flex items-center gap-2">
        <p aria-live="polite" className="min-w-0 flex-1 truncate text-caption-2-regular text-text-secondary">
          Week {day.week + 1} · {day.label} ·{" "}
          <span className="text-caption-2-semibold text-text-primary tabular-nums" dir="ltr">
            {usdWhole.format(day.value)}
          </span>
        </p>
        <div className="flex shrink-0 items-center gap-1" aria-hidden>
          <span className="text-caption-2-regular text-text-tertiary">Less</span>
          {HEATMAP_TIERS.map((tier) => (
            <span key={tier} className={cx("size-2.5 rounded-xs", tier)} />
          ))}
          <span className="text-caption-2-regular text-text-tertiary">More</span>
        </div>
      </div>
    </section>
  );
}

/* Specimens */

export const FINANCE_SECTION: ExtendedSection = {
  id: "finance",
  title: "Finance",
  blurb: "Accounts, markets and money moving between them.",
  file: "finance.tsx",
  entries: [
    { name: "Portfolio Row", description: "Three holdings, one total, and the weight each position carries.", Demo: PortfolioRow },
    { name: "Market Ticker", description: "A live tape that pauses; every symbol carries its price and change.", Demo: MarketTicker, wide: true },
    { name: "Transaction List", description: "Merchants, amounts and categories, filtered in one tap.", Demo: TransactionList },
    { name: "Budget Ring", description: "A ring that fills as the month spends, with the remainder kept honest.", Demo: BudgetRing },
    { name: "Account Card", description: "Balance and account number, hidden until asked for, copied when you do.", Demo: AccountCard },
    { name: "Transfer Form", description: "From, to, amount and date, with a swap and a receipt.", Demo: TransferForm },
    { name: "Statement Row", description: "Period, closing balance and a download that finishes.", Demo: StatementRow },
    { name: "Card Control", description: "Freeze, online payments and a daily limit moved in hundreds.", Demo: CardControl },
    { name: "Bill Split", description: "People drop out, the total stays, and each share recalculates.", Demo: BillSplit },
    { name: "Savings Goal", description: "Target, saved and monthly contribution, one deposit at a time.", Demo: SavingsGoal },
    { name: "Currency Converter", description: "An amount, a mid-market rate and the result in another currency.", Demo: CurrencyConverter },
    { name: "Spending Heatmap", description: "Twelve weeks of daily spend, read one cell at a time.", Demo: SpendingHeatmap },
  ],
};
