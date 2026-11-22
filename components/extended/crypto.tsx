"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  RiArrowDownLine,
  RiArrowDownSLine,
  RiArrowLeftRightLine,
  RiArrowRightLine,
  RiArrowUpLine,
  RiBellLine,
  RiCheckLine,
  RiEyeLine,
  RiEyeOffLine,
  RiFileCopyLine,
  RiGasStationLine,
  RiHeartFill,
  RiHeartLine,
  RiLoader4Line,
  RiNftLine,
  RiPieChartLine,
  RiRefreshLine,
  RiSendPlaneLine,
  RiShoppingBagLine,
  RiSparklingLine,
  RiWallet3Line,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* -------------------------------------------------------------------------- */
/*  Shared                                                                     */
/* -------------------------------------------------------------------------- */

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";

const card =
  "w-full rounded-xl border border-border-button-default bg-background-primary-default shadow-card";

const buttonBase =
  "inline-flex items-center justify-center gap-1.5 rounded-lg text-caption-1-semibold " +
  "transition-[transform,background-color,border-color,color,box-shadow,opacity] duration-150 ease-out " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 " +
  "motion-reduce:transition-none motion-reduce:active:scale-100";

const primaryButton = cx(
  buttonBase,
  "h-7 bg-button-primary px-2.5 text-text-white shadow-xs hover:opacity-90",
  focusRing,
);

const secondaryButton = cx(
  buttonBase,
  "h-7 border border-border-button-default bg-background-primary-default px-2 text-text-primary shadow-xs hover:bg-background-primary-hover",
  focusRing,
);

const quietButton = cx(
  buttonBase,
  "h-6 px-1.5 text-text-secondary hover:bg-background-secondary-default hover:text-text-primary",
  focusRing,
);

const iconButton = cx(
  "flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-icon-tertiary",
  "transition-[background-color,color] duration-150 ease-out hover:bg-background-tertiary-default hover:text-text-primary",
  "motion-reduce:transition-none",
  focusRing,
);

const tokenChip =
  "inline-flex h-6 shrink-0 items-center rounded-full bg-background-primary-default px-2 " +
  "text-caption-2-semibold text-text-primary shadow-xs";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const usdWhole = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const amountFormat = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const rateFormat = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 6,
  maximumFractionDigits: 6,
});

const integerFormat = new Intl.NumberFormat("en-US");

function shortAddress(value: string) {
  return `${value.slice(0, 6)}…${value.slice(-4)}`;
}

function formatPercent(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  const magnitude = Math.abs(value);
  return `${sign}${magnitude < 1 ? magnitude.toFixed(2) : magnitude.toFixed(1)}%`;
}

function useCopyFeedback(duration = 1600) {
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(null), duration);
    return () => window.clearTimeout(timer);
  }, [copied, duration]);

  const copy = (key: string, value: string) => {
    setCopied(key);
    void navigator.clipboard?.writeText(value).catch(() => undefined);
  };

  return { copied, copy };
}

function CopyButton({
  value,
  label,
  copied,
  onCopy,
  className,
}: {
  value: string;
  label: string;
  copied: boolean;
  onCopy: (value: string) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={`Copy ${label}`}
      onClick={() => onCopy(value)}
      className={cx(iconButton, className)}
    >
      {copied ? (
        <RiCheckLine className="size-3.5 text-status-lime-text" aria-hidden />
      ) : (
        <RiFileCopyLine className="size-3.5" aria-hidden />
      )}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  1. Wallet card                                                             */
/* -------------------------------------------------------------------------- */

const WALLET_ADDRESS = "0x7A3f4c9E2b1D8a05F6c3B7e4A9d2C1f8E5b09C2b";
const WALLET_BALANCE = 12480.55;
const WALLET_ETH = 3.2471;

export function WalletCard() {
  const [hidden, setHidden] = useState(false);
  const { copied, copy } = useCopyFeedback();

  return (
    <section aria-label="Main wallet" className={cx(card, "max-w-[300px] p-3")}>
      <div className="flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-accent-600 text-text-white shadow-xs">
          <RiWallet3Line className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">Main wallet</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">Ethereum · Self-custody</p>
        </div>
        <button
          type="button"
          aria-label={hidden ? "Show balance" : "Hide balance"}
          aria-pressed={hidden}
          onClick={() => setHidden((current) => !current)}
          className={iconButton}
        >
          {hidden ? (
            <RiEyeOffLine className="size-3.5" aria-hidden />
          ) : (
            <RiEyeLine className="size-3.5" aria-hidden />
          )}
        </button>
      </div>

      <div className="mt-2">
        <p
          key={hidden ? "hidden" : "shown"}
          className="animate-label-in text-start text-title-3-semibold text-text-primary tabular-nums motion-reduce:animate-none"
        >
          <bdi dir="ltr">{hidden ? "••••••" : usd.format(WALLET_BALANCE)}</bdi>
        </p>
        <p className="text-caption-2-regular text-text-secondary tabular-nums">
          {hidden ? "Balance hidden" : `${WALLET_ETH.toFixed(4)} ETH`}
          <span className="text-text-tertiary"> · </span>
          <span className={hidden ? "text-text-tertiary" : "text-status-lime-text"}>
            {hidden ? "Tap the eye to reveal" : "+$248.10 today"}
          </span>
        </p>
      </div>

      <div className="mt-2 flex items-center gap-1 rounded-lg bg-background-secondary-default py-1 ps-2 pe-1">
        <span className="size-1.5 shrink-0 rounded-full bg-status-lime-text" aria-hidden />
        <bdi dir="ltr" className="min-w-0 flex-1 truncate font-mono text-caption-2-regular text-text-secondary">
          {shortAddress(WALLET_ADDRESS)}
        </bdi>
        <CopyButton
          value={WALLET_ADDRESS}
          label="wallet address"
          copied={copied === "wallet"}
          onCopy={() => copy("wallet", WALLET_ADDRESS)}
        />
      </div>

      <p role="status" aria-live="polite" className="mt-1.5 h-4 truncate text-caption-2-regular text-text-tertiary">
        {copied === "wallet" ? "Address copied to clipboard." : "Receive only on Ethereum."}
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  2. Token row                                                               */
/* -------------------------------------------------------------------------- */

const TOKENS = [
  {
    id: "eth",
    symbol: "ETH",
    name: "Ethereum",
    glyph: "Ξ",
    price: 3824.1,
    change24: 2.4,
    change7: -1.2,
    volume: "$18.4B",
    dominance: "17.2%",
  },
  {
    id: "usdc",
    symbol: "USDC",
    name: "USD Coin",
    glyph: "$",
    price: 1,
    change24: 0.01,
    change7: 0.02,
    volume: "$6.8B",
    dominance: "0.3%",
  },
  {
    id: "sol",
    symbol: "SOL",
    name: "Solana",
    glyph: "◎",
    price: 182.44,
    change24: -1.8,
    change7: 7.4,
    volume: "$4.1B",
    dominance: "2.9%",
  },
] as const;

type Range = "24H" | "7D";

export function TokenRow() {
  const [range, setRange] = useState<Range>("24H");
  const [selected, setSelected] = useState<(typeof TOKENS)[number]["id"]>("eth");
  const active = TOKENS.find((token) => token.id === selected) ?? TOKENS[0];

  return (
    <section aria-label="Token watchlist" className={cx(card, "max-w-[300px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Watchlist</h3>
        <div role="group" aria-label="Change range" className="flex rounded-md bg-background-secondary-default p-0.5">
          {(["24H", "7D"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={range === option}
              onClick={() => setRange(option)}
              className={cx(
                "h-5 rounded-sm px-1.5 text-caption-2-semibold transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                range === option
                  ? "bg-background-primary-default text-text-primary shadow-xs"
                  : "text-text-tertiary hover:text-text-secondary",
                focusRing,
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-1 flex flex-col">
        {TOKENS.map((token) => {
          const change = range === "24H" ? token.change24 : token.change7;
          const isActive = selected === token.id;
          return (
            <button
              key={token.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setSelected(token.id)}
              className={cx(
                "flex w-full items-center gap-2 rounded-lg px-1.5 py-1 text-start",
                "transition-colors duration-150 ease-out motion-reduce:transition-none",
                isActive ? "bg-background-secondary-default" : "hover:bg-background-secondary-default/60",
                focusRing,
              )}
            >
              <span
                aria-hidden
                className={cx(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-caption-2-semibold transition-colors duration-150 ease-out motion-reduce:transition-none",
                  isActive
                    ? "bg-accent-100 text-accent-700"
                    : "bg-background-tertiary-default text-text-secondary",
                )}
              >
                {token.glyph}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-caption-1-semibold text-text-primary">{token.symbol}</span>
                <span className="block truncate text-caption-2-regular text-text-tertiary">{token.name}</span>
              </span>
              <span className="shrink-0 text-end">
                <span className="block text-caption-1-medium text-text-primary tabular-nums">{usd.format(token.price)}</span>
                <span
                  key={`${range}-${token.id}`}
                  className={cx(
                    "flex animate-label-in items-center justify-end gap-0.5 text-caption-2-medium tabular-nums motion-reduce:animate-none",
                    change >= 0 ? "text-status-lime-text" : "text-status-rose-text",
                  )}
                >
                  {change >= 0 ? (
                    <RiArrowUpLine className="size-2.5" aria-hidden />
                  ) : (
                    <RiArrowDownLine className="size-2.5" aria-hidden />
                  )}
                  {formatPercent(change)}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="mt-1 h-4 truncate text-caption-2-regular text-text-tertiary tabular-nums">
        {active.symbol} volume {active.volume} · dominance {active.dominance}
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  3. Swap form                                                               */
/* -------------------------------------------------------------------------- */

const SWAP_RATE = 3824.1;
const SLIPPAGE_OPTIONS = [0.1, 0.5, 1] as const;

type SwapToken = "ETH" | "USDC";

export function SwapForm() {
  const [from, setFrom] = useState<SwapToken>("ETH");
  const [amount, setAmount] = useState("0.50");
  const [slippage, setSlippage] = useState<number>(0.5);
  const to: SwapToken = from === "ETH" ? "USDC" : "ETH";
  const rate = from === "ETH" ? SWAP_RATE : 1 / SWAP_RATE;
  const parsed = Number.parseFloat(amount);
  const inputValue = Number.isFinite(parsed) ? parsed : 0;
  const gross = inputValue * rate;
  const minimum = gross * (1 - slippage / 100);

  const flip = () => {
    if (gross > 0) setAmount(gross.toFixed(2));
    setFrom(to);
  };

  return (
    <section aria-label="Swap form" className={cx(card, "max-w-[300px] p-3")}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Swap</h3>
        <div className="flex items-center gap-1.5">
          <span className="text-caption-2-regular text-text-tertiary">Slippage</span>
          <div role="group" aria-label="Slippage tolerance" className="flex rounded-md bg-background-secondary-default p-0.5">
            {SLIPPAGE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                aria-label={`${option}% slippage`}
                aria-pressed={slippage === option}
                onClick={() => setSlippage(option)}
                className={cx(
                  "h-5 rounded-sm px-1.5 text-caption-2-semibold tabular-nums transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                  slippage === option
                    ? "bg-background-primary-default text-text-primary shadow-xs"
                    : "text-text-tertiary hover:text-text-secondary",
                  focusRing,
                )}
              >
                {option === 1 ? "1" : option.toFixed(1)}%
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-1.5 rounded-lg bg-background-secondary-default px-2 py-1 ring-2 ring-inset ring-transparent transition-[box-shadow] duration-150 ease-out focus-within:ring-border-focus-ring motion-reduce:transition-none">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-caption-2-regular text-text-tertiary">You pay</span>
          <span className="text-caption-2-regular text-text-tertiary tabular-nums">
            Balance {from === "ETH" ? "3.25 ETH" : "1,912.05 USDC"}
          </span>
        </div>
        <div className="mt-0.5 flex items-center gap-2">
          <input
            aria-label={`Amount in ${from}`}
            inputMode="decimal"
            dir="ltr"
            value={amount}
            onChange={(event) => {
              const next = event.target.value.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
              setAmount(next);
            }}
            className="min-w-0 flex-1 bg-transparent p-0 text-start text-body-2-semibold text-text-primary tabular-nums outline-none placeholder:text-text-placeholder"
          />
          <span key={from} dir="ltr" className={cx(tokenChip, "animate-label-in motion-reduce:animate-none")}>
            {from}
          </span>
        </div>
      </div>

      <div className="relative z-10 -my-2 flex justify-center">
        <button
          type="button"
          aria-label="Swap token direction"
          onClick={flip}
          className={cx(
            "flex size-7 items-center justify-center rounded-full border border-border-button-default bg-background-primary-default text-foreground-icon-secondary shadow-xs",
            "transition-[transform,background-color,color] duration-200 ease-out hover:bg-background-primary-hover hover:text-text-primary",
            "motion-reduce:transition-none",
            focusRing,
          )}
        >
          <RiArrowLeftRightLine
            className={cx(
              "size-3.5 transition-transform duration-200 ease-out motion-reduce:transition-none",
              from === "USDC" && "rotate-180",
            )}
            aria-hidden
          />
        </button>
      </div>

      <div className="rounded-lg bg-background-secondary-default px-2 py-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-caption-2-regular text-text-tertiary">You receive</span>
          <span className="text-caption-2-regular text-text-tertiary">Est. output</span>
        </div>
        <div className="mt-0.5 flex items-center gap-2">
          <output
            aria-live="polite"
            className="min-w-0 flex-1 truncate text-start text-body-2-semibold text-text-primary tabular-nums"
          >
            <bdi dir="ltr">{amountFormat.format(gross)}</bdi>
          </output>
          <span key={to} dir="ltr" className={cx(tokenChip, "animate-label-in motion-reduce:animate-none")}>
            {to}
          </span>
        </div>
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2 text-caption-2-regular text-text-tertiary">
        <span key={from} dir="ltr" className="animate-label-in min-w-0 truncate text-start tabular-nums motion-reduce:animate-none">
          1 {from} = {from === "ETH" ? amountFormat.format(rate) : rateFormat.format(rate)} {to}
        </span>
        <span dir="ltr" className="shrink-0 tabular-nums">Min {amountFormat.format(minimum)} {to}</span>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  4. Gas estimator                                                           */
/* -------------------------------------------------------------------------- */

const GAS_OPTIONS = [
  { id: "slow", label: "Slow", gwei: 22, wait: "~3 min", fee: 1.84, fill: 62 },
  { id: "standard", label: "Standard", gwei: 28, wait: "~45 sec", fee: 2.34, fill: 80 },
  { id: "fast", label: "Fast", gwei: 35, wait: "~15 sec", fee: 2.92, fill: 100 },
] as const;

type GasId = (typeof GAS_OPTIONS)[number]["id"];

export function GasEstimator() {
  const [selected, setSelected] = useState<GasId>("standard");
  const active = GAS_OPTIONS.find((option) => option.id === selected) ?? GAS_OPTIONS[1];
  const tip = Number((active.gwei - 18.2).toFixed(1));

  return (
    <section aria-label="Gas estimator" className={cx(card, "max-w-[300px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-secondary-default text-foreground-icon-secondary">
          <RiGasStationLine className="size-3.5" aria-hidden />
        </span>
        <h3 className="min-w-0 flex-1 text-body-2-semibold text-text-primary">Gas estimate</h3>
        <span className="inline-flex h-5 shrink-0 items-center gap-1 rounded-full bg-status-lime-background px-1.5 text-caption-2-medium text-status-lime-text">
          <span className="size-1.5 rounded-full bg-status-lime-text" aria-hidden />
          Low
        </span>
      </div>

      <div role="group" aria-label="Gas speed" className="mt-1.5 grid grid-cols-3 gap-1.5">
        {GAS_OPTIONS.map((option) => {
          const isActive = selected === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setSelected(option.id)}
              className={cx(
                "flex flex-col items-start gap-0.5 rounded-lg border p-1.5 text-start",
                "transition-[background-color,border-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                isActive
                  ? "border-accent-500 bg-background-secondary-default shadow-xs"
                  : "border-border-button-default bg-background-primary-default hover:bg-background-primary-hover",
                focusRing,
              )}
            >
              <span className="text-caption-2-medium text-text-secondary">{option.label}</span>
              <span className="text-caption-1-semibold text-text-primary tabular-nums">{option.gwei} gwei</span>
              <span className="text-caption-2-regular text-text-tertiary">{option.wait}</span>
              <span className="text-caption-2-semibold text-text-secondary tabular-nums">${option.fee.toFixed(2)}</span>
              <span aria-hidden className="mt-0.5 h-0.5 w-full overflow-hidden rounded-full bg-background-tertiary-default">
                <span
                  className={cx(
                    "block h-full rounded-full bg-accent-500 transition-[width] duration-200 ease-out motion-reduce:transition-none",
                    isActive ? "opacity-100" : "opacity-40",
                  )}
                  style={{ width: `${option.fill}%` }}
                />
              </span>
            </button>
          );
        })}
      </div>

      <div key={selected} className="mt-1.5 flex animate-label-in items-baseline justify-between gap-2 motion-reduce:animate-none">
        <span className="min-w-0 truncate text-caption-2-regular text-text-tertiary tabular-nums">
          Base 18.2 + tip {tip} gwei
        </span>
        <span className="shrink-0 text-caption-2-semibold text-text-primary tabular-nums">${active.fee.toFixed(2)}</span>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  5. Transaction status                                                      */
/* -------------------------------------------------------------------------- */

const TX_HASH = "0x9f2c7b41d8e05a6c3f1b9e2d7a4c8f05b6e341ab";

type TxStatus = "pending" | "speeding" | "confirmed";

export function TransactionStatus() {
  const { copied, copy } = useCopyFeedback();
  const [status, setStatus] = useState<TxStatus>("pending");

  useEffect(() => {
    if (status !== "speeding") return;
    const timer = window.setTimeout(() => setStatus("confirmed"), 1400);
    return () => window.clearTimeout(timer);
  }, [status]);

  const progress = status === "pending" ? 35 : status === "speeding" ? 68 : 100;
  const feeNote =
    status === "confirmed"
      ? "Settled · 12 blocks"
      : status === "speeding"
        ? "Priority +6 gwei · +$0.42"
        : "Fee $2.34 · 12 gwei tip";

  return (
    <section aria-label="Transaction status" className={cx(card, "max-w-[300px] p-3")}>
      <div className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-secondary-default text-foreground-icon-secondary">
          <RiSendPlaneLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
        </span>
        <h3 className="min-w-0 flex-1 text-body-2-semibold text-text-primary">Transaction</h3>
        <span
          role="status"
          aria-live="polite"
          className={cx(
            "inline-flex h-5 shrink-0 items-center gap-1 rounded-full px-1.5 text-caption-2-medium transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
            status === "confirmed"
              ? "bg-status-lime-background text-status-lime-text"
              : status === "speeding"
                ? "bg-status-blue-background text-status-blue-text"
                : "bg-status-yellow-background text-status-yellow-text",
          )}
        >
          {status === "confirmed" ? "Confirmed" : status === "speeding" ? "Confirming" : "Pending"}
        </span>
      </div>

      <div className="mt-1.5 flex items-center gap-1.5 rounded-lg bg-background-secondary-default ps-2 pe-1 py-1">
        <span className="shrink-0 text-caption-2-regular text-text-tertiary">Hash</span>
        <bdi dir="ltr" className="min-w-0 flex-1 truncate font-mono text-caption-2-regular text-text-secondary">
          {shortAddress(TX_HASH)}
        </bdi>
        <CopyButton
          value={TX_HASH}
          label="transaction hash"
          copied={copied === "hash"}
          onCopy={() => copy("hash", TX_HASH)}
        />
      </div>

      <ol className="mt-1.5 flex flex-col gap-1">
        <li className="flex items-center gap-2">
          <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-status-lime-background text-status-lime-text">
            <RiCheckLine className="size-2.5" aria-hidden />
          </span>
          <span className="text-caption-1-semibold text-text-primary">Submitted</span>
          <span className="ms-auto text-caption-2-regular text-text-tertiary tabular-nums">10:42:08</span>
        </li>
        <li className="flex items-center gap-2">
          <span
            className={cx(
              "flex size-4 shrink-0 items-center justify-center rounded-full transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
              status === "confirmed"
                ? "bg-status-lime-background text-status-lime-text"
                : status === "speeding"
                  ? "bg-status-blue-background text-status-blue-text"
                  : "bg-status-yellow-background text-status-yellow-text",
            )}
          >
            {status === "confirmed" ? (
              <RiCheckLine className="size-2.5" aria-hidden />
            ) : status === "speeding" ? (
              <RiLoader4Line className="size-2.5 animate-spin motion-reduce:animate-none" aria-hidden />
            ) : (
              <span className="size-1.5 animate-pulse rounded-full bg-status-yellow-text motion-reduce:animate-none" aria-hidden />
            )}
          </span>
          <span className="text-caption-1-semibold text-text-primary">
            {status === "confirmed" ? "Confirmed" : status === "speeding" ? "Confirming" : "Awaiting confirmation"}
          </span>
          <span className="ms-auto text-caption-2-regular text-text-tertiary tabular-nums">
            {status === "confirmed" ? "10:42:14" : "Block 21,884,102"}
          </span>
        </li>
      </ol>

      <div
        aria-hidden
        className="mt-1.5 h-1 overflow-hidden rounded-full bg-background-tertiary-default"
      >
        <div
          className={cx(
            "h-full rounded-full transition-[width,background-color] duration-200 ease-out motion-reduce:transition-none",
            status === "confirmed" ? "bg-status-lime-text" : "bg-accent-500",
          )}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span className="min-w-0 truncate text-caption-2-regular text-text-tertiary tabular-nums">{feeNote}</span>
        <button
          type="button"
          onClick={() => setStatus(status === "confirmed" ? "pending" : "speeding")}
          disabled={status === "speeding"}
          className={cx(status === "confirmed" ? secondaryButton : primaryButton, "h-6 shrink-0 px-2")}
        >
          {status === "confirmed" ? (
            <>
              <RiRefreshLine className="size-3" aria-hidden />
              New transfer
            </>
          ) : status === "speeding" ? (
            <>
              <RiLoader4Line className="size-3 animate-spin motion-reduce:animate-none" aria-hidden />
              Speeding up
            </>
          ) : (
            <>
              <RiArrowUpLine className="size-3" aria-hidden />
              Speed up
            </>
          )}
        </button>
      </div>

      <span role="status" aria-live="polite" className="sr-only">
        {copied === "hash" ? "Transaction hash copied." : ""}
      </span>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  6. Portfolio chart                                                         */
/* -------------------------------------------------------------------------- */

const ALLOCATION = [
  { id: "eth", symbol: "ETH", name: "Ethereum", value: 18420, percent: 46, color: "bg-chart-1" },
  { id: "btc", symbol: "BTC", name: "Bitcoin", value: 11205, percent: 28, color: "bg-chart-2" },
  { id: "usdc", symbol: "USDC", name: "USD Coin", value: 6400, percent: 16, color: "bg-chart-3" },
  { id: "sol", symbol: "SOL", name: "Solana", value: 4010, percent: 10, color: "bg-chart-4" },
] as const;

type AllocationId = (typeof ALLOCATION)[number]["id"];

const PORTFOLIO_TOTAL = ALLOCATION.reduce((total, asset) => total + asset.value, 0);

export function PortfolioChart() {
  const [selected, setSelected] = useState<AllocationId>("eth");
  const active = ALLOCATION.find((asset) => asset.id === selected) ?? ALLOCATION[0];

  return (
    <section aria-label="Portfolio allocation" className={cx(card, "max-w-[300px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-secondary-default text-foreground-icon-secondary">
          <RiPieChartLine className="size-3.5" aria-hidden />
        </span>
        <h3 className="min-w-0 flex-1 text-body-2-semibold text-text-primary">Portfolio</h3>
        <span className="shrink-0 text-caption-1-semibold text-text-primary tabular-nums">{usdWhole.format(PORTFOLIO_TOTAL)}</span>
      </div>

      <div aria-hidden className="mt-1.5 flex h-2.5 overflow-hidden rounded-full bg-background-tertiary-default">
        {ALLOCATION.map((asset) => (
          <span
            key={asset.id}
            className={cx(
              "h-full transition-[opacity] duration-200 ease-out motion-reduce:transition-none",
              asset.color,
              selected === asset.id ? "opacity-100" : "opacity-50",
            )}
            style={{ width: `${asset.percent}%` }}
          />
        ))}
      </div>

      <div className="mt-1.5 grid grid-cols-2 gap-1">
        {ALLOCATION.map((asset) => {
          const isActive = selected === asset.id;
          return (
            <button
              key={asset.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setSelected(asset.id)}
              className={cx(
                "flex h-7 items-center gap-1.5 rounded-md px-1.5 text-start",
                "transition-[background-color,border-color,color] duration-150 ease-out motion-reduce:transition-none",
                isActive
                  ? "border border-border-button-default bg-background-secondary-default"
                  : "border border-transparent hover:bg-background-secondary-default/60",
                focusRing,
              )}
            >
              <span aria-hidden className={cx("size-2 shrink-0 rounded-full", asset.color)} />
              <span className={cx("min-w-0 flex-1 truncate text-caption-2-medium", isActive ? "text-text-primary" : "text-text-secondary")}>
                {asset.symbol}
              </span>
              <span className="shrink-0 text-caption-2-regular text-text-tertiary tabular-nums">{asset.percent}%</span>
            </button>
          );
        })}
      </div>

      <p
        key={selected}
        aria-live="polite"
        className="mt-1 animate-label-in truncate text-caption-2-regular text-text-tertiary tabular-nums motion-reduce:animate-none"
      >
        {active.name} · {active.percent}% of portfolio · {usdWhole.format(active.value)}
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  7. Network picker                                                          */
/* -------------------------------------------------------------------------- */

const NETWORKS = [
  { id: "ethereum", name: "Ethereum", fee: "$2.40", time: "~30 sec", dot: "bg-chart-1" },
  { id: "base", name: "Base", fee: "$0.08", time: "~5 sec", dot: "bg-chart-4" },
  { id: "arbitrum", name: "Arbitrum One", fee: "$0.12", time: "~8 sec", dot: "bg-chart-6" },
  { id: "solana", name: "Solana", fee: "$0.0003", time: "~2 sec", dot: "bg-chart-5" },
] as const;

type NetworkId = (typeof NETWORKS)[number]["id"];

export function NetworkPicker() {
  const listId = useId();
  const [selected, setSelected] = useState<NetworkId>("base");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const active = NETWORKS.find((network) => network.id === selected) ?? NETWORKS[1];

  useEffect(() => {
    if (!open) return;
    const handlePointer = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    wrapRef.current?.querySelector<HTMLButtonElement>('[data-selected="true"]')?.focus();
  }, [open]);

  const choose = (id: NetworkId) => {
    setSelected(id);
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <section aria-label="Network picker" className={cx(card, "relative max-w-[300px] p-3")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Network</h3>
        <span className="text-caption-2-regular text-text-tertiary">Fees update per chain</span>
      </div>

      <div ref={wrapRef} className="relative mt-1.5">
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((current) => !current)}
          className={cx(
            "flex h-10 w-full items-center gap-2 rounded-lg border border-border-button-default bg-background-primary-default px-2 text-start shadow-xs",
            "transition-[background-color,border-color] duration-150 ease-out hover:bg-background-primary-hover motion-reduce:transition-none",
            open && "border-border-button-active",
            focusRing,
          )}
        >
          <span aria-hidden className="flex size-6 shrink-0 items-center justify-center rounded-full bg-background-secondary-default">
            <span className={cx("size-2 rounded-full", active.dot)} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-caption-1-semibold text-text-primary">{active.name}</span>
            <span className="block truncate text-caption-2-regular text-text-tertiary tabular-nums">
              {active.fee} fee · {active.time}
            </span>
          </span>
          <RiArrowDownSLine
            className={cx(
              "size-4 shrink-0 text-foreground-icon-tertiary transition-transform duration-150 ease-out motion-reduce:transition-none",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>

        <div
          id={listId}
          role="group"
          aria-label="Choose a network"
          inert={!open}
          className={cx(
            "absolute inset-x-0 top-full z-20 mt-1 origin-top rounded-lg border border-border-button-default bg-background-primary-default p-1 shadow-dropdown",
            "transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none",
            open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0",
          )}
        >
          <p className="px-1.5 pb-0.5 text-caption-2-semibold tracking-wide text-text-tertiary uppercase">
            Pay over
          </p>
          {NETWORKS.map((network) => {
            const isActive = selected === network.id;
            return (
              <button
                key={network.id}
                type="button"
                data-selected={isActive}
                aria-pressed={isActive}
                onClick={() => choose(network.id)}
                className={cx(
                  "flex h-8 w-full items-center gap-2 rounded-md px-1.5 text-start",
                  "transition-colors duration-150 ease-out motion-reduce:transition-none",
                  isActive ? "bg-background-secondary-default" : "hover:bg-background-secondary-default",
                  focusRing,
                )}
              >
                <span aria-hidden className={cx("size-2 shrink-0 rounded-full", network.dot)} />
                <span className="min-w-0 flex-1 truncate text-caption-1-medium text-text-primary">{network.name}</span>
                <span className="shrink-0 text-caption-2-regular text-text-tertiary tabular-nums">{network.fee}</span>
                <RiCheckLine
                  className={cx(
                    "size-3.5 shrink-0 text-accent-600 transition-opacity duration-150 ease-out motion-reduce:transition-none",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                  aria-hidden
                />
              </button>
            );
          })}
        </div>
      </div>

      <p key={selected} className="mt-1.5 animate-label-in truncate text-caption-2-regular text-text-tertiary tabular-nums motion-reduce:animate-none">
        Average confirmation {active.time} · {active.fee} per transfer
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  8. Address book                                                            */
/* -------------------------------------------------------------------------- */

const CONTACTS = [
  {
    id: "maya",
    name: "Maya Chen",
    tag: "Design",
    initials: "MC",
    address: "0x4f2A9c7B1e5D3a8F6c0B2d4E9a7C1f3B5d8E0a1",
  },
  {
    id: "vault",
    name: "Ledger vault",
    tag: "Cold storage",
    initials: "LV",
    address: "0x8c31B7e4A9d2C1f8E5b06a3D7c9F2e1B4a8D6c22",
  },
  {
    id: "dev",
    name: "Dev Raman",
    tag: "Contractor",
    initials: "DR",
    address: "0x2b7E9a1C4d8F3e6B0a5D2c7E1f9A4b8C3d6E7d7d",
  },
] as const;

export function AddressBook() {
  const { copied, copy } = useCopyFeedback();
  const active = CONTACTS.find((contact) => contact.id === copied);

  return (
    <section aria-label="Address book" className={cx(card, "max-w-[300px] p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Address book</h3>
        <span className="text-caption-2-regular text-text-tertiary tabular-nums">{CONTACTS.length} saved</span>
      </div>

      <ul className="mt-0.5 flex flex-col">
        {CONTACTS.map((contact) => (
          <li
            key={contact.id}
            className="flex items-center gap-2 border-b border-separator-border py-1.5 last:border-b-0"
          >
            <span
              aria-hidden
              className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-100 text-caption-2-semibold text-accent-700"
            >
              {contact.initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-caption-1-semibold text-text-primary">{contact.name}</p>
              <p className="flex items-center gap-1 truncate text-caption-2-regular text-text-tertiary">
                <bdi dir="ltr" className="truncate font-mono">{shortAddress(contact.address)}</bdi>
                <span aria-hidden>·</span>
                <span className="truncate">{contact.tag}</span>
              </p>
            </div>
            <CopyButton
              value={contact.address}
              label={`${contact.name}'s address`}
              copied={copied === contact.id}
              onCopy={() => copy(contact.id, contact.address)}
            />
          </li>
        ))}
      </ul>

      <p role="status" aria-live="polite" className="mt-1 h-4 truncate text-caption-2-regular text-text-tertiary">
        {active ? `${active.name}'s address copied.` : "Stored on this device only."}
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  9. Staking card                                                            */
/* -------------------------------------------------------------------------- */

const STAKING_APY = 3.8;
const ETH_PRICE = 3824.1;
const STAKE_STEPS = [0.5, 1, 2] as const;

export function StakingCard() {
  const [staked, setStaked] = useState(4.25);
  const [rewards, setRewards] = useState(0.0182);
  const [claimed, setClaimed] = useState(false);
  const [lastStake, setLastStake] = useState<number | null>(null);

  const stake = (amount: number) => {
    setStaked((current) => Math.round((current + amount) * 100) / 100);
    setClaimed(false);
    setLastStake(amount);
  };

  const claim = () => {
    setRewards(0);
    setClaimed(true);
  };

  return (
    <section aria-label="Stake ETH" className={cx(card, "max-w-[300px] p-3")}>
      <div className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-secondary-default text-accent-600">
          <RiSparklingLine className="size-3.5" aria-hidden />
        </span>
        <h3 className="min-w-0 flex-1 text-body-2-semibold text-text-primary">Stake ETH</h3>
        <span className="inline-flex h-5 shrink-0 items-center rounded-full bg-status-lime-background px-1.5 text-caption-2-semibold text-status-lime-text tabular-nums">
          {STAKING_APY}% APY
        </span>
      </div>

      <div className="mt-1.5 flex items-baseline justify-between gap-2">
        <div>
          <p className="text-caption-2-regular text-text-tertiary">Staked balance</p>
          <p key={staked} className="animate-label-in text-title-3-semibold text-text-primary tabular-nums motion-reduce:animate-none">
            {staked.toFixed(2)} ETH
          </p>
        </div>
        <p className="text-caption-2-regular text-text-secondary tabular-nums">{usd.format(staked * ETH_PRICE)}</p>
      </div>

      <div className="mt-1.5 flex items-center gap-2 rounded-lg bg-background-secondary-default px-2 py-1.5">
        <div className="min-w-0 flex-1">
          <p className="text-caption-2-regular text-text-tertiary">Rewards</p>
          <p className="flex items-baseline gap-1 text-caption-1-semibold text-text-primary tabular-nums">
            {rewards.toFixed(4)} ETH
            <span className="text-caption-2-regular text-text-tertiary">{usd.format(rewards * ETH_PRICE)}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={claim}
          disabled={claimed || rewards === 0}
          className={cx(secondaryButton, "h-6 shrink-0 px-2")}
        >
          {claimed ? (
            <>
              <RiCheckLine className="size-3 text-status-lime-text" aria-hidden />
              Claimed
            </>
          ) : (
            "Claim"
          )}
        </button>
      </div>

      <div className="mt-1.5 flex items-center gap-1.5">
        <span className="me-auto text-caption-2-regular text-text-tertiary">Stake more</span>
        {STAKE_STEPS.map((amount) => (
          <button
            key={amount}
            type="button"
            aria-label={`Stake ${amount} ETH`}
            onClick={() => stake(amount)}
            className={cx(secondaryButton, "h-6 px-1.5 tabular-nums")}
          >
            +{amount}
          </button>
        ))}
      </div>

      <p role="status" aria-live="polite" className="mt-1 h-4 truncate text-caption-2-regular text-text-tertiary">
        {claimed
          ? "0.0182 ETH claimed to 0x7A3f…9C2b."
          : lastStake
            ? `+${lastStake.toFixed(1)} ETH staked just now.`
            : "Rewards accrue every block."}
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  10. NFT tile                                                               */
/* -------------------------------------------------------------------------- */

const NFT = {
  name: "Sable 0421",
  collection: "Nightshift Editions",
  floor: 0.84,
  lastSale: 0.72,
  change: 6.2,
} as const;

export function NftTile() {
  const [saved, setSaved] = useState(false);
  const [reserved, setReserved] = useState(false);

  return (
    <section aria-label="NFT collectible" className={cx(card, "max-w-[300px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-secondary-default text-foreground-icon-secondary">
          <RiNftLine className="size-3.5" aria-hidden />
        </span>
        <h3 className="min-w-0 flex-1 text-body-2-semibold text-text-primary">Collectible</h3>
        <button
          type="button"
          aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
          aria-pressed={saved}
          onClick={() => setSaved((current) => !current)}
          className={cx(
            iconButton,
            "transition-[background-color,color,transform] duration-150 ease-out motion-reduce:transition-none",
            saved && "text-status-rose-text",
          )}
        >
          {saved ? <RiHeartFill className="size-3.5" aria-hidden /> : <RiHeartLine className="size-3.5" aria-hidden />}
        </button>
      </div>

      <div className="mt-1.5 flex items-center gap-2.5">
        <div
          aria-hidden
          className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-linear-to-br from-accent-500 via-chart-5 to-chart-3 ring-1 ring-border-button-default"
        >
          <span className="absolute -end-3 -top-3 size-10 rounded-full bg-background-primary-default/25" />
          <span className="absolute -bottom-4 -start-2 size-12 rounded-full border border-background-primary-default/35" />
          <span className="absolute inset-x-2 top-1/2 h-px -rotate-12 bg-background-primary-default/50" />
          <span className="absolute bottom-1.5 end-1.5 font-mono text-caption-2-semibold text-text-white/90">0421</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-2-medium tracking-wide text-text-tertiary uppercase">{NFT.collection}</p>
          <h4 className="truncate text-body-2-semibold text-text-primary">{NFT.name}</h4>
          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="text-caption-2-regular text-text-tertiary">
              Floor <span className="text-caption-1-semibold text-text-primary tabular-nums">{NFT.floor} ETH</span>
            </span>
            <span className="shrink-0 text-caption-2-medium text-status-lime-text tabular-nums">
              {formatPercent(NFT.change)}
            </span>
          </div>
          <p className="truncate text-caption-2-regular text-text-tertiary tabular-nums">
            Last sale {NFT.lastSale} ETH
          </p>
        </div>
      </div>

      <div aria-live="polite">
        <button
          type="button"
          aria-pressed={reserved}
          onClick={() => setReserved((current) => !current)}
          className={cx(reserved ? secondaryButton : primaryButton, "mt-2 w-full")}
        >
          {reserved ? (
            <>
              <RiCheckLine className="size-3.5 text-status-lime-text" aria-hidden />
              Reserved · cancel
            </>
          ) : (
            <>
              <RiShoppingBagLine className="size-3.5" aria-hidden />
              Buy now · {NFT.floor} ETH
            </>
          )}
        </button>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  11. Alert rule                                                             */
/* -------------------------------------------------------------------------- */

type AlertSide = "above" | "below";

export function AlertRule() {
  const id = useId();
  const [side, setSide] = useState<AlertSide>("above");
  const [target, setTarget] = useState("4,000");
  const [created, setCreated] = useState(false);
  const [active, setActive] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const create = () => {
    const parsed = Number.parseFloat(target.replace(/,/g, ""));
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setError("Enter a target price above $0.");
      return;
    }
    setTarget(integerFormat.format(parsed));
    setError(null);
    setActive(true);
    setCreated(true);
  };

  return (
    <section aria-label="Price alert" className={cx(card, "max-w-[300px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-secondary-default text-foreground-icon-secondary">
          <RiBellLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">{created ? "Price alert" : "New price alert"}</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">
            {created ? "Checked every 60 seconds" : "We only notify you once."}
          </p>
        </div>
        <span
          className={cx(
            "shrink-0 rounded-full px-1.5 py-0.5 text-caption-2-medium transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
            !created
              ? "bg-background-tertiary-default text-text-secondary"
              : active
                ? "bg-status-lime-background text-status-lime-text"
                : "bg-status-yellow-background text-status-yellow-text",
          )}
        >
          {created ? (active ? "Active" : "Paused") : "Draft"}
        </span>
      </div>

      {created ? (
        <div key="summary" className="animate-label-in motion-reduce:animate-none">
          <div className="mt-1.5 rounded-lg bg-background-secondary-default px-2 py-1.5">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className={cx(
                  "size-1.5 shrink-0 rounded-full",
                  active ? "animate-pulse bg-status-lime-text motion-reduce:animate-none" : "bg-foreground-icon-quaternary",
                )}
              />
              <p className="min-w-0 flex-1 truncate text-caption-1-semibold text-text-primary tabular-nums">
                ETH {side} ${target}
              </p>
              <button
                type="button"
                role="switch"
                aria-checked={active}
                aria-label="Price alert active"
                onClick={() => setActive((current) => !current)}
                className={cx("relative h-4 w-7 shrink-0 rounded-full transition-colors duration-200 ease-out motion-reduce:transition-none", active ? "bg-accent-600" : "bg-background-tertiary-hover", focusRing)}
              >
                <span
                  className={cx(
                    "absolute start-0.5 top-0.5 size-3 rounded-full bg-background-primary-default shadow-xs",
                    "transition-transform duration-200 ease-out motion-reduce:transition-none",
                    active ? "translate-x-3 rtl:-translate-x-3" : "translate-x-0",
                  )}
                />
              </button>
            </div>
            <p className="mt-0.5 text-caption-2-regular text-text-tertiary tabular-nums">
              {active ? "Last checked at $3,824.10 · 12s ago" : "Paused — no notifications will send."}
            </p>
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <span className="text-caption-2-regular text-text-tertiary">Settings saved to this device.</span>
            <button type="button" onClick={() => setCreated(false)} className={quietButton}>
              Edit rule
            </button>
          </div>
        </div>
      ) : (
        <form
          key="form"
          className="animate-label-in motion-reduce:animate-none"
          onSubmit={(event) => {
            event.preventDefault();
            create();
          }}
        >
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className={tokenChip}>ETH</span>
            <div role="group" aria-label="Alert condition" className="flex rounded-md bg-background-secondary-default p-0.5">
              {(["above", "below"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={side === option}
                  onClick={() => setSide(option)}
                  className={cx(
                    "h-5 rounded-sm px-2 text-caption-2-semibold capitalize transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                    side === option
                      ? "bg-background-primary-default text-text-primary shadow-xs"
                      : "text-text-tertiary hover:text-text-secondary",
                    focusRing,
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-1.5 flex items-center gap-1.5">
            <div
              dir="ltr"
              className="flex h-8 min-w-0 flex-1 items-center gap-1 rounded-lg bg-background-tertiary-default px-2 ring-2 ring-inset ring-transparent transition-[box-shadow] duration-150 ease-out focus-within:ring-border-focus-ring motion-reduce:transition-none"
            >
              <span aria-hidden className="text-caption-1-medium text-text-tertiary">$</span>
              <input
                id={id}
                aria-label="Target price"
                aria-invalid={Boolean(error)}
                aria-describedby={`${id}-error`}
                inputMode="decimal"
                value={target}
                onChange={(event) => {
                  setTarget(event.target.value.replace(/[^\d.,]/g, ""));
                  setError(null);
                }}
                className="min-w-0 flex-1 bg-transparent p-0 text-start text-caption-1-medium text-text-primary tabular-nums outline-none placeholder:text-text-placeholder"
              />
              <span className="shrink-0 text-caption-2-regular text-text-tertiary">USD</span>
            </div>
            <button type="submit" className={cx(primaryButton, "h-8 shrink-0 px-2.5")}>
              Create
            </button>
          </div>
        </form>
      )}

      <p
        id={`${id}-error`}
        role="status"
        aria-live="polite"
        className={cx(
          "mt-1 h-4 truncate text-caption-2-regular",
          error && !created ? "text-text-error-primary" : "text-text-tertiary",
        )}
      >
        {error && !created
          ? error
          : created
            ? active
              ? "Notifications on for this device."
              : "Alert is paused."
            : "ETH is $3,824.10 right now."}
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  12. Bridge card                                                            */
/* -------------------------------------------------------------------------- */

const CHAINS = {
  ethereum: { name: "Ethereum", dot: "bg-chart-1" },
  base: { name: "Base", dot: "bg-chart-4" },
} as const;

const BRIDGE_ROUTES = {
  "eth-base": {
    from: "ethereum",
    to: "base",
    send: "1.00 ETH",
    receive: "0.9996 ETH",
    fee: "0.0004 ETH",
    feeUsd: "$1.53",
    gas: "$1.24",
    total: "$2.77",
    wait: "~2 min",
  },
  "base-eth": {
    from: "base",
    to: "ethereum",
    send: "1.00 ETH",
    receive: "0.9998 ETH",
    fee: "0.0002 ETH",
    feeUsd: "$0.76",
    gas: "$0.18",
    total: "$0.94",
    wait: "~4 min",
  },
} as const;

type RouteId = keyof typeof BRIDGE_ROUTES;
type BridgeStatus = "idle" | "bridging" | "done";

export function BridgeCard() {
  const [routeId, setRouteId] = useState<RouteId>("eth-base");
  const [status, setStatus] = useState<BridgeStatus>("idle");
  const route = BRIDGE_ROUTES[routeId];
  const from = CHAINS[route.from];
  const to = CHAINS[route.to];

  useEffect(() => {
    if (status !== "bridging") return;
    const timer = window.setTimeout(() => setStatus("done"), 1600);
    return () => window.clearTimeout(timer);
  }, [status]);

  const flip = () => {
    setRouteId((current) => (current === "eth-base" ? "base-eth" : "eth-base"));
    setStatus("idle");
  };

  return (
    <section aria-label="Bridge card" className={cx(card, "max-w-[300px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Bridge</h3>
        <span
          role="status"
          aria-live="polite"
          className={cx(
            "inline-flex h-5 items-center rounded-full px-1.5 text-caption-2-medium tabular-nums transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
            status === "done"
              ? "bg-status-lime-background text-status-lime-text"
              : status === "bridging"
                ? "bg-status-blue-background text-status-blue-text"
                : "bg-background-tertiary-default text-text-secondary",
          )}
        >
          {status === "done" ? "Arrived" : status === "bridging" ? "Bridging" : route.wait}
        </span>
      </div>

      <div
        role="group"
        aria-label={`From ${from.name} to ${to.name}`}
        className="mt-1.5 flex items-center gap-1.5 rounded-lg bg-background-secondary-default p-1.5"
      >
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 text-caption-1-semibold text-text-primary">
            <span aria-hidden className={cx("size-1.5 shrink-0 rounded-full", from.dot)} />
            <span className="truncate">{from.name}</span>
          </p>
          <p className="text-caption-2-regular text-text-tertiary tabular-nums">Send {route.send}</p>
        </div>
        <button
          type="button"
          aria-label="Swap bridge direction"
          onClick={flip}
          className={cx(
            "flex size-7 shrink-0 items-center justify-center rounded-full border border-border-button-default bg-background-primary-default text-foreground-icon-secondary shadow-xs",
            "transition-[background-color,color,transform] duration-200 ease-out hover:bg-background-primary-hover hover:text-text-primary motion-reduce:transition-none",
            focusRing,
          )}
        >
          <RiArrowRightLine
            className={cx(
              "size-3.5 rtl:-scale-x-100 transition-transform duration-200 ease-out motion-reduce:transition-none",
              routeId === "base-eth" && "rotate-180",
            )}
            aria-hidden
          />
        </button>
        <div className="min-w-0 flex-1 text-end">
          <p className="flex items-center justify-end gap-1 text-caption-1-semibold text-text-primary">
            <span className="truncate">{to.name}</span>
            <span aria-hidden className={cx("size-1.5 shrink-0 rounded-full", to.dot)} />
          </p>
          <p className="text-caption-2-regular text-text-tertiary tabular-nums">Receive {route.receive}</p>
        </div>
      </div>

      <dl className="mt-1.5 rounded-lg bg-background-secondary-default px-2 py-1">
        <div className="flex items-center justify-between gap-2 text-caption-2-regular">
          <dt className="text-text-tertiary">Bridge fee</dt>
          <dd className="text-text-secondary tabular-nums">{route.fee} · {route.feeUsd}</dd>
        </div>
        <div className="flex items-center justify-between gap-2 text-caption-2-regular">
          <dt className="text-text-tertiary">Gas (est.)</dt>
          <dd className="text-text-secondary tabular-nums">{route.gas}</dd>
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-2 border-t border-separator-border pt-1">
          <dt className="text-caption-2-semibold text-text-secondary">Total fees</dt>
          <dd className="text-caption-2-semibold text-text-primary tabular-nums">{route.total}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={() => setStatus("bridging")}
        disabled={status === "bridging"}
        className={cx(primaryButton, "mt-1.5 h-7 w-full")}
      >
        {status === "bridging" ? (
          <>
            <RiLoader4Line className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
            Bridging
          </>
        ) : status === "done" ? (
          <>
            <RiRefreshLine className="size-3.5" aria-hidden />
            Bridge again
          </>
        ) : (
          <>
            Bridge to {to.name}
            <RiArrowRightLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
          </>
        )}
      </button>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Specimens                                                                  */
/* -------------------------------------------------------------------------- */

export const CRYPTO_SECTION: ExtendedSection = {
  id: "crypto",
  title: "Crypto",
  blurb: "Wallets, swaps and the chain's receipts.",
  file: "crypto.tsx",
  entries: [
    { name: "Wallet Card", description: "Balance, address and copy feedback in one card.", Demo: WalletCard },
    { name: "Token Row", description: "Watchlist rows with price, 24h change and volume.", Demo: TokenRow },
    { name: "Swap Form", description: "ETH to USDC with a live rate, slippage and a direction flip.", Demo: SwapForm },
    { name: "Gas Estimator", description: "Slow, standard and fast quotes with fees and wait times.", Demo: GasEstimator },
    { name: "Transaction Status", description: "A pending transfer that confirms, with a copyable hash.", Demo: TransactionStatus },
    { name: "Portfolio Chart", description: "Allocation bars and a legend that selects an asset.", Demo: PortfolioChart },
    { name: "Network Picker", description: "Pick a network and see the fee and settlement time.", Demo: NetworkPicker },
    { name: "Address Book", description: "Saved addresses with one-tap copying.", Demo: AddressBook },
    { name: "Staking Card", description: "Stake more, watch the balance and claim rewards.", Demo: StakingCard },
    { name: "NFT Tile", description: "A collectible with floor price and a reserve state.", Demo: NftTile },
    { name: "Alert Rule", description: "Create a price alert above or below the market.", Demo: AlertRule },
    { name: "Bridge Card", description: "Move ETH across chains with a full fee breakdown.", Demo: BridgeCard },
  ],
};
