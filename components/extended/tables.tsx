"use client";

import { Fragment, useEffect, useId, useRef, useState } from "react";
import {
  RiAddLine,
  RiArrowDownLine,
  RiArrowDownSLine,
  RiArrowUpDownLine,
  RiArrowUpLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiDownloadLine,
  RiExternalLinkLine,
  RiFilter3Line,
  RiLayoutGridLine,
  RiListCheck,
  RiListUnordered,
  RiPriceTag3Line,
  RiReceiptLine,
  RiSearchLine,
  RiSendPlaneLine,
  RiUserAddLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* -------------------------------------------------------------------------- */
/*  Shared                                                                     */
/* -------------------------------------------------------------------------- */

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";

const iconButton = cx(
  "flex size-7 shrink-0 items-center justify-center rounded-md text-foreground-icon-secondary",
  "transition-colors duration-150 ease hover:bg-background-secondary-hover hover:text-text-primary",
  focusRing,
);

const primaryButton = cx(
  "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-button-primary px-2.5",
  "text-body-2-medium text-text-white shadow-xs transition-opacity duration-150 ease hover:opacity-90",
  focusRing,
);

const secondaryButton = cx(
  "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-border-button-default",
  "bg-background-primary-default px-2.5 text-body-2-medium text-text-primary shadow-xs",
  "transition-colors duration-150 ease hover:bg-background-primary-hover",
  focusRing,
);

const tableShell =
  "w-full overflow-hidden rounded-xl border border-border-table bg-background-primary-default";

const thBase =
  "border-b border-border-table bg-background-secondary-default px-3 py-2 text-start text-caption-2-regular tracking-wide text-text-tertiary uppercase whitespace-nowrap";

const rowBorder = "border-t border-separator-border";

type InvoiceStatus = "Paid" | "Pending" | "Overdue" | "Draft";

type Invoice = {
  id: string;
  client: string;
  owner: string;
  amount: string;
  status: InvoiceStatus;
};

const STATUS_TONE: Record<InvoiceStatus, string> = {
  Paid: "bg-status-lime-background text-status-lime-text",
  Pending: "bg-status-yellow-background text-status-yellow-text",
  Overdue: "bg-status-rose-background text-status-rose-text",
  Draft: "bg-background-tertiary-default text-text-secondary",
};

const AVATAR_TONES = [
  "bg-status-blue-background text-status-blue-text",
  "bg-status-lime-background text-status-lime-text",
  "bg-status-orange-background text-status-orange-text",
  "bg-status-purple-background text-status-purple-text",
  "bg-status-cyan-background text-status-cyan-text",
];

function StatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-sm px-1.5 py-0.5 text-caption-2-regular",
        STATUS_TONE[status],
      )}
    >
      {status}
    </span>
  );
}

function InitialsAvatar({ initials, tone = 0 }: { initials: string; tone?: number }) {
  return (
    <span
      aria-hidden
      className={cx(
        "flex size-6 shrink-0 items-center justify-center rounded-full text-caption-2-regular",
        AVATAR_TONES[tone % AVATAR_TONES.length],
      )}
    >
      {initials}
    </span>
  );
}

function EmptyInvoices({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center gap-1 px-3 py-6 text-center">
      <p className="text-body-2-medium text-text-secondary">No invoices match.</p>
      <p className="text-caption-1-regular text-text-tertiary">
        Try a different search, or clear the filters.
      </p>
      <button
        type="button"
        onClick={onClear}
        className={cx(
          "mt-1 rounded-sm text-caption-1-regular text-text-secondary underline-offset-2",
          "transition-colors duration-150 ease hover:text-text-primary hover:underline",
          focusRing,
        )}
      >
        Clear filters
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Table toolbar                                                              */
/* -------------------------------------------------------------------------- */

const TOOLBAR_INVOICES: Invoice[] = [
  { id: "INV-4471", client: "Northwind Studio", owner: "Maya Chen", amount: "$12,400", status: "Paid" },
  { id: "INV-4468", client: "Harbor & Co.", owner: "Jonas Reed", amount: "$8,600", status: "Pending" },
  { id: "INV-4462", client: "Fieldnote Labs", owner: "Priya Nair", amount: "$3,200", status: "Overdue" },
  { id: "INV-4455", client: "Cinder Works", owner: "Sam Okafor", amount: "$18,900", status: "Draft" },
  { id: "INV-4449", client: "Atlas Freight", owner: "Maya Chen", amount: "$5,400", status: "Paid" },
];

export function TableToolbar() {
  const searchId = useId();
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [unpaidOnly, setUnpaidOnly] = useState(false);
  const [view, setView] = useState<"list" | "grid">("list");

  const needle = query.trim().toLowerCase();
  const rows = TOOLBAR_INVOICES.filter((invoice) => {
    const matchesQuery =
      !needle ||
      `${invoice.id} ${invoice.client} ${invoice.owner}`.toLowerCase().includes(needle);
    const matchesFilter = !unpaidOnly || invoice.status !== "Paid";
    return matchesQuery && matchesFilter;
  });
  const unpaidCount = TOOLBAR_INVOICES.filter((invoice) => invoice.status !== "Paid").length;
  const hasFilters = Boolean(needle) || unpaidOnly;

  const clear = () => {
    setQuery("");
    setUnpaidOnly(false);
    searchRef.current?.focus();
  };

  return (
    <div className="flex w-full max-w-2xl flex-col gap-2.5">
      <div className="flex flex-wrap items-center gap-1.5">
        <div className="flex h-8 min-w-40 flex-1 items-center gap-1.5 rounded-lg bg-background-tertiary-default px-2 ring-2 ring-inset ring-transparent transition-[box-shadow] duration-150 ease focus-within:ring-border-focus-ring sm:max-w-60">
          <RiSearchLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
          <label htmlFor={searchId} className="sr-only">
            Search invoices
          </label>
          <input
            id={searchId}
            ref={searchRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search invoices"
            className="min-w-0 flex-1 bg-transparent text-body-regular text-text-primary outline-none placeholder:text-text-tertiary [&::-webkit-search-cancel-button]:appearance-none"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                searchRef.current?.focus();
              }}
              className={cx(
                "flex size-5 shrink-0 items-center justify-center rounded-xs text-foreground-icon-secondary",
                "transition-colors duration-150 ease hover:text-text-primary",
                focusRing,
              )}
            >
              <RiCloseLine className="size-3.5" aria-hidden />
            </button>
          )}
        </div>

        <button
          type="button"
          aria-pressed={unpaidOnly}
          onClick={() => setUnpaidOnly((current) => !current)}
          className={cx(
            "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-2.5 text-body-2-medium",
            "transition-colors duration-150 ease",
            focusRing,
            unpaidOnly
              ? "border-transparent bg-status-blue-background text-status-blue-text"
              : "border-border-button-default bg-background-primary-default text-text-secondary hover:bg-background-primary-hover hover:text-text-primary",
          )}
        >
          <RiFilter3Line className="size-3.5" aria-hidden />
          Unpaid
          <span
            className={cx(
              "rounded-full px-1 text-caption-2-regular tabular-nums",
              unpaidOnly
                ? "bg-background-primary-default text-text-secondary"
                : "bg-background-tertiary-default text-text-tertiary",
            )}
          >
            {unpaidCount}
          </span>
        </button>

        <div
          role="group"
          aria-label="Invoice view"
          className="flex shrink-0 items-center gap-0.5 rounded-lg border border-border-button-default bg-background-primary-default p-0.5 shadow-xs"
        >
          <button
            type="button"
            aria-label="List view"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
            className={cx(
              "flex size-7 items-center justify-center rounded-md transition-colors duration-150 ease",
              focusRing,
              view === "list"
                ? "bg-segmented-control-selected-background text-text-primary shadow-xs"
                : "text-foreground-icon-secondary hover:bg-background-secondary-hover hover:text-text-primary",
            )}
          >
            <RiListUnordered className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            onClick={() => setView("grid")}
            className={cx(
              "flex size-7 items-center justify-center rounded-md transition-colors duration-150 ease",
              focusRing,
              view === "grid"
                ? "bg-segmented-control-selected-background text-text-primary shadow-xs"
                : "text-foreground-icon-secondary hover:bg-background-secondary-hover hover:text-text-primary",
            )}
          >
            <RiLayoutGridLine className="size-4" aria-hidden />
          </button>
        </div>

        <button type="button" className={cx(primaryButton, "ms-auto")}>
          <RiAddLine className="size-4" aria-hidden />
          New invoice
        </button>
      </div>

      <div className="flex min-h-4 items-center justify-between gap-2">
        <p aria-live="polite" className="text-caption-1-regular text-text-tertiary">
          Showing <span className="text-text-secondary tabular-nums">{rows.length}</span> of{" "}
          <span className="tabular-nums">{TOOLBAR_INVOICES.length}</span> invoices
          {unpaidOnly ? " · unpaid" : ""}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={clear}
            className={cx(
              "shrink-0 rounded-sm text-caption-1-regular text-text-secondary",
              "transition-colors duration-150 ease hover:text-text-primary",
              focusRing,
            )}
          >
            Clear filters
          </button>
        )}
      </div>

      {view === "list" ? (
        <div className={tableShell}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-0 border-collapse sm:min-w-[440px]">
              <caption className="sr-only">Invoices</caption>
              <thead>
                <tr>
                  <th scope="col" className={thBase}>
                    Invoice
                  </th>
                  <th scope="col" className={cx(thBase, "hidden sm:table-cell")}>
                    Owner
                  </th>
                  <th scope="col" className={cx(thBase, "text-end")}>
                    Amount
                  </th>
                  <th scope="col" className={thBase}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className={cx(
                      rowBorder,
                      "transition-colors duration-150 ease hover:bg-background-secondary-default",
                    )}
                  >
                    <td className="px-3 py-2 align-middle">
                      <span className="block text-body-2-medium text-text-primary">
                        {invoice.client}
                      </span>
                      <span className="block text-caption-2-regular text-text-tertiary tabular-nums">
                        {invoice.id}
                      </span>
                    </td>
                    <td className="hidden px-3 py-2 align-middle text-body-2-medium text-text-secondary whitespace-nowrap sm:table-cell">
                      {invoice.owner}
                    </td>
                    <td className="px-3 py-2 align-middle text-end text-body-2-medium text-text-primary tabular-nums whitespace-nowrap">
                      {invoice.amount}
                    </td>
                    <td className="px-3 py-2 align-middle">
                      <StatusBadge status={invoice.status} />
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={4}>
                      <EmptyInvoices onClear={clear} />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {rows.map((invoice) => (
            <div
              key={invoice.id}
              className="flex flex-col gap-1.5 rounded-lg border border-border-button-default bg-background-primary-default p-2.5 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-body-2-medium text-text-primary">{invoice.client}</p>
                  <p className="text-caption-2-regular text-text-tertiary tabular-nums">
                    {invoice.id}
                  </p>
                </div>
                <StatusBadge status={invoice.status} />
              </div>
              <div className="flex items-end justify-between gap-2">
                <span className="text-caption-1-regular text-text-tertiary">{invoice.owner}</span>
                <span className="text-body-2-medium text-text-primary tabular-nums">
                  {invoice.amount}
                </span>
              </div>
            </div>
          ))}
          {rows.length === 0 && (
            <div className="col-span-full rounded-lg border border-dashed border-border-button-default bg-background-primary-default">
              <EmptyInvoices onClear={clear} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sort header                                                                */
/* -------------------------------------------------------------------------- */

type SortKey = "name" | "deals" | "revenue";
type SortState = { key: SortKey; direction: "asc" | "desc" } | null;

const SORT_LABEL: Record<SortKey, string> = {
  name: "Member",
  deals: "Deals",
  revenue: "Revenue",
};

const SORT_ROWS = [
  {
    name: "Maya Chen",
    initials: "MC",
    tone: 0,
    role: "Art director",
    deals: 14,
    revenue: "$248,000",
    revenueValue: 248000,
  },
  {
    name: "Jonas Reed",
    initials: "JR",
    tone: 1,
    role: "Producer",
    deals: 9,
    revenue: "$186,400",
    revenueValue: 186400,
  },
  {
    name: "Priya Nair",
    initials: "PN",
    tone: 2,
    role: "Account lead",
    deals: 17,
    revenue: "$312,800",
    revenueValue: 312800,
  },
  {
    name: "Sam Okafor",
    initials: "SO",
    tone: 3,
    role: "Strategist",
    deals: 11,
    revenue: "$154,200",
    revenueValue: 154200,
  },
  {
    name: "Lena Voss",
    initials: "LV",
    tone: 4,
    role: "Designer",
    deals: 7,
    revenue: "$98,600",
    revenueValue: 98600,
  },
];

function SortableHeader({
  label,
  sortKey,
  sort,
  onSort,
  align = "start",
}: {
  label: string;
  sortKey: SortKey;
  sort: SortState;
  onSort: (key: SortKey) => void;
  align?: "start" | "end";
}) {
  const direction = sort?.key === sortKey ? sort.direction : null;
  const ariaSort: "ascending" | "descending" | "none" =
    direction === "asc" ? "ascending" : direction === "desc" ? "descending" : "none";

  return (
    <th
      scope="col"
      aria-sort={ariaSort}
      className={cx(thBase, align === "end" && "text-end")}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cx(
          "inline-flex items-center gap-1 rounded-xs text-caption-2-regular tracking-wide uppercase",
          "transition-colors duration-150 ease",
          focusRing,
          direction ? "text-text-primary" : "text-text-tertiary hover:text-text-secondary",
        )}
      >
        {label}
        {direction === "asc" ? (
          <RiArrowUpLine className="size-3.5 text-foreground-icon-primary" aria-hidden />
        ) : direction === "desc" ? (
          <RiArrowDownLine className="size-3.5 text-foreground-icon-primary" aria-hidden />
        ) : (
          <RiArrowUpDownLine className="size-3.5 text-foreground-icon-quaternary" aria-hidden />
        )}
      </button>
    </th>
  );
}

export function SortHeader() {
  const [sort, setSort] = useState<SortState>(null);

  const cycleSort = (key: SortKey) => {
    setSort((current) => {
      if (!current || current.key !== key) return { key, direction: "asc" };
      if (current.direction === "asc") return { key, direction: "desc" };
      return null;
    });
  };

  const rows = [...SORT_ROWS];
  if (sort) {
    if (sort.key === "name") {
      rows.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
    } else if (sort.key === "deals") {
      rows.sort((a, b) => a.deals - b.deals);
    } else {
      rows.sort((a, b) => a.revenueValue - b.revenueValue);
    }
    if (sort.direction === "desc") rows.reverse();
  }

  let summary = "Original order · click a header to sort";
  if (sort) {
    const order =
      sort.key === "name"
        ? sort.direction === "asc"
          ? "A–Z"
          : "Z–A"
        : sort.direction === "asc"
          ? "low to high"
          : "high to low";
    summary = `${SORT_LABEL[sort.key]} · ${order}`;
  }

  return (
    <div className="flex w-full max-w-lg flex-col gap-2">
      <div className={tableShell}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-64 border-collapse">
            <caption className="sr-only">Team performance</caption>
            <thead>
              <tr>
                <SortableHeader label="Member" sortKey="name" sort={sort} onSort={cycleSort} />
                <SortableHeader
                  label="Deals"
                  sortKey="deals"
                  sort={sort}
                  onSort={cycleSort}
                  align="end"
                />
                <SortableHeader
                  label="Revenue"
                  sortKey="revenue"
                  sort={sort}
                  onSort={cycleSort}
                  align="end"
                />
              </tr>
            </thead>
            <tbody>
              {rows.map((person) => (
                <tr
                  key={person.name}
                  className={cx(
                    rowBorder,
                    "transition-colors duration-150 ease hover:bg-background-secondary-default",
                  )}
                >
                  <td className="px-3 py-2 align-middle">
                    <div className="flex items-center gap-2">
                      <InitialsAvatar initials={person.initials} tone={person.tone} />
                      <div className="min-w-0">
                        <p className="truncate text-body-2-medium text-text-primary">{person.name}</p>
                        <p className="truncate text-caption-2-regular text-text-tertiary">
                          {person.role}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-end align-middle text-body-2-medium text-text-secondary tabular-nums">
                    {person.deals}
                  </td>
                  <td className="px-3 py-2 text-end align-middle text-body-2-medium text-text-primary tabular-nums whitespace-nowrap">
                    {person.revenue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5">
        <p aria-live="polite" className="text-caption-1-regular text-text-tertiary">
          {summary}
        </p>
        <p className="text-caption-2-regular text-text-tertiary">Asc → desc → clear</p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Column filter                                                              */
/* -------------------------------------------------------------------------- */

const FILTER_CLIENTS = [
  { name: "Northwind Studio", count: 8 },
  { name: "Harbor & Co.", count: 5 },
  { name: "Fieldnote Labs", count: 4 },
  { name: "Cinder Works", count: 6 },
  { name: "Atlas Freight", count: 3 },
  { name: "Verdant Supply", count: 2 },
];

const FILTER_PREVIEW: Array<Omit<Invoice, "owner">> = [
  { id: "INV-4471", client: "Northwind Studio", amount: "$12,400", status: "Paid" },
  { id: "INV-4468", client: "Harbor & Co.", amount: "$8,600", status: "Pending" },
  { id: "INV-4462", client: "Fieldnote Labs", amount: "$3,200", status: "Overdue" },
  { id: "INV-4455", client: "Cinder Works", amount: "$18,900", status: "Draft" },
  { id: "INV-4449", client: "Atlas Freight", amount: "$5,400", status: "Paid" },
  { id: "INV-4442", client: "Verdant Supply", amount: "$7,800", status: "Pending" },
];

export function ColumnFilter() {
  const searchId = useId();
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState<string[]>(["Northwind Studio", "Fieldnote Labs"]);
  const [applied, setApplied] = useState<string[]>(["Northwind Studio", "Fieldnote Labs"]);

  const needle = query.trim().toLowerCase();
  const visibleClients = FILTER_CLIENTS.filter((client) =>
    client.name.toLowerCase().includes(needle),
  );
  const previewRows =
    applied.length === 0
      ? FILTER_PREVIEW
      : FILTER_PREVIEW.filter((invoice) => applied.includes(invoice.client));

  const toggle = (name: string) => {
    setPending((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name],
    );
  };

  const reset = () => {
    setPending([]);
    setApplied([]);
    setQuery("");
  };

  return (
    <div className="flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:items-start">
      <div className="w-full shrink-0 overflow-hidden rounded-xl border border-border-button-default bg-background-primary-default shadow-xs sm:w-72">
        <div className="flex items-start justify-between gap-2 border-b border-separator-border px-3 py-2.5">
          <div className="flex flex-col">
            <span className="text-headline-medium text-text-primary">Filter invoices</span>
            <span className="text-caption-1-regular text-text-tertiary">Client</span>
          </div>
          <span
            aria-live="polite"
            className={cx(
              "shrink-0 rounded-full px-2 py-0.5 text-caption-2-regular tabular-nums",
              pending.length > 0
                ? "bg-background-tertiary-default text-text-secondary"
                : "bg-background-tertiary-default text-text-tertiary",
            )}
          >
            {pending.length} selected
          </span>
        </div>

        <div className="p-2">
          <div className="flex h-8 items-center gap-1.5 rounded-md bg-background-tertiary-default px-2 ring-2 ring-inset ring-transparent transition-[box-shadow] duration-150 ease focus-within:ring-border-focus-ring">
            <RiSearchLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
            <label htmlFor={searchId} className="sr-only">
              Find a client
            </label>
            <input
              id={searchId}
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find a client"
              className="min-w-0 flex-1 bg-transparent text-body-regular text-text-primary outline-none placeholder:text-text-tertiary [&::-webkit-search-cancel-button]:appearance-none"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear client search"
                onClick={() => {
                  setQuery("");
                  searchRef.current?.focus();
                }}
                className={cx(
                  "flex size-5 shrink-0 items-center justify-center rounded-xs text-foreground-icon-secondary",
                  "transition-colors duration-150 ease hover:text-text-primary",
                  focusRing,
                )}
              >
                <RiCloseLine className="size-3.5" aria-hidden />
              </button>
            )}
          </div>

          <div role="group" aria-label="Clients" className="mt-1.5 flex flex-col gap-px">
            {visibleClients.map((client) => {
              const checked = pending.includes(client.name);
              return (
                <label
                  key={client.name}
                  className={cx(
                    "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5",
                    "transition-colors duration-100 ease hover:bg-background-secondary-hover",
                    checked && "bg-background-secondary-default",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(client.name)}
                    className={cx(
                      "size-3.5 shrink-0 cursor-pointer rounded-xs accent-accent-500",
                      focusRing,
                    )}
                  />
                  <span className="min-w-0 flex-1 truncate text-body-2-medium text-text-primary">
                    {client.name}
                  </span>
                  <span className="shrink-0 text-caption-2-regular text-text-tertiary tabular-nums">
                    {client.count}
                  </span>
                </label>
              );
            })}
          </div>

          {visibleClients.length === 0 && (
            <p className="px-2 py-4 text-center text-caption-1-regular text-text-tertiary">
              No client matches “{query}”.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-separator-border p-2">
          <button
            type="button"
            onClick={reset}
            className={cx(
              "h-8 rounded-md px-2 text-body-2-medium text-text-secondary",
              "transition-colors duration-150 ease hover:bg-background-secondary-hover hover:text-text-primary",
              focusRing,
            )}
          >
            Reset
          </button>
          <button type="button" onClick={() => setApplied(pending)} className={secondaryButton}>
            Apply{pending.length > 0 ? ` (${pending.length})` : ""}
          </button>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-1">
          <p className="text-caption-1-regular text-text-tertiary">
            {applied.length === 0
              ? "All clients"
              : `${applied.length} client${applied.length === 1 ? "" : "s"} applied`}
          </p>
          <p
            aria-live="polite"
            className="text-caption-2-regular text-text-tertiary tabular-nums"
          >
            {previewRows.length} of {FILTER_PREVIEW.length} invoices
          </p>
        </div>

        <div className={tableShell}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-64 border-collapse">
              <caption className="sr-only">Invoice preview</caption>
              <thead>
                <tr>
                  <th scope="col" className={thBase}>
                    Invoice
                  </th>
                  <th scope="col" className={cx(thBase, "text-end")}>
                    Amount
                  </th>
                  <th scope="col" className={thBase}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className={cx(
                      rowBorder,
                      "transition-colors duration-150 ease hover:bg-background-secondary-default",
                    )}
                  >
                    <td className="px-3 py-2 align-middle">
                      <span className="block text-body-2-medium text-text-primary tabular-nums">
                        {invoice.id}
                      </span>
                      <span className="block text-caption-2-regular text-text-tertiary">
                        {invoice.client}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-end align-middle text-body-2-medium text-text-primary tabular-nums whitespace-nowrap">
                      {invoice.amount}
                    </td>
                    <td className="px-3 py-2 align-middle">
                      <StatusBadge status={invoice.status} />
                    </td>
                  </tr>
                ))}
                {previewRows.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-3 py-8 text-center text-caption-1-regular text-text-tertiary">
                      No invoices for this selection.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {applied.map((client) => (
            <span
              key={client}
              className="inline-flex items-center gap-1 rounded-full bg-background-tertiary-default py-0.5 ps-2 pe-1 text-caption-2-regular text-text-secondary"
            >
              {client}
              <button
                type="button"
                aria-label={`Remove ${client} filter`}
                onClick={() => {
                  setPending((current) => current.filter((item) => item !== client));
                  setApplied((current) => current.filter((item) => item !== client));
                }}
                className={cx(
                  "flex size-4 items-center justify-center rounded-full text-foreground-icon-tertiary",
                  "transition-colors duration-150 ease hover:text-text-primary",
                  focusRing,
                )}
              >
                <RiCloseLine className="size-3" aria-hidden />
              </button>
            </span>
          ))}
          {applied.length === 0 && (
            <span className="text-caption-2-regular text-text-tertiary">
              No client filters applied.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Bulk action bar                                                            */
/* -------------------------------------------------------------------------- */

type BulkInvoice = Pick<Invoice, "id" | "client" | "amount">;

const BULK_INVOICES: BulkInvoice[] = [
  { id: "INV-4471", client: "Northwind Studio", amount: "$12,400" },
  { id: "INV-4468", client: "Harbor & Co.", amount: "$8,600" },
  { id: "INV-4462", client: "Fieldnote Labs", amount: "$3,200" },
  { id: "INV-4455", client: "Cinder Works", amount: "$18,900" },
  { id: "INV-4449", client: "Atlas Freight", amount: "$5,400" },
];

export function BulkActionBar() {
  const [rows, setRows] = useState<BulkInvoice[]>(BULK_INVOICES);
  const [selected, setSelected] = useState<string[]>(["INV-4471", "INV-4468", "INV-4462"]);
  const [notice, setNotice] = useState<string | null>(null);
  const selectAllRef = useRef<HTMLInputElement>(null);

  const allSelected = rows.length > 0 && selected.length === rows.length;
  const someSelected = selected.length > 0 && !allSelected;
  const visible = selected.length > 0;

  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = someSelected;
  }, [someSelected]);

  const toggleRow = (id: string) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
    setNotice(null);
  };

  const toggleAll = () => {
    setSelected(allSelected ? [] : rows.map((row) => row.id));
    setNotice(null);
  };

  const assign = () => {
    const count = selected.length;
    setNotice(`${count} invoice${count === 1 ? "" : "s"} assigned to Maya Chen.`);
  };

  const tag = () => {
    const count = selected.length;
    setNotice(`${count} invoice${count === 1 ? "" : "s"} tagged “Q3 follow-up”.`);
  };

  const removeSelected = () => {
    const count = selected.length;
    setRows((current) => current.filter((row) => !selected.includes(row.id)));
    setSelected([]);
    setNotice(`${count} invoice${count === 1 ? "" : "s"} deleted.`);
    selectAllRef.current?.focus();
  };

  const clearSelection = () => {
    setSelected([]);
    setNotice(null);
    selectAllRef.current?.focus();
  };

  const restore = () => {
    setRows(BULK_INVOICES);
    setSelected([]);
    setNotice("Invoice list restored.");
  };

  return (
    <div className="w-full max-w-md @container">
      <div className="flex items-center justify-between gap-2">
        <span className="text-body-2-medium text-text-primary">Invoices</span>
        <span
          aria-live="polite"
          className="text-caption-2-regular text-text-tertiary tabular-nums"
        >
          {selected.length > 0 ? `${selected.length} selected` : "None selected"}
        </span>
      </div>

      <div className="relative mt-2">
        <div className={cx(tableShell, rows.length > 0 && "pb-12")}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-64 border-collapse">
              <caption className="sr-only">Invoices</caption>
              <thead>
                <tr>
                  <th scope="col" className={cx(thBase, "w-9 ps-3 pe-1")}>
                    <input
                      ref={selectAllRef}
                      type="checkbox"
                      aria-label="Select all invoices"
                      checked={allSelected}
                      onChange={toggleAll}
                      className={cx(
                        "size-3.5 cursor-pointer rounded-xs accent-accent-500",
                        focusRing,
                      )}
                    />
                  </th>
                  <th scope="col" className={thBase}>
                    Invoice
                  </th>
                  <th scope="col" className={cx(thBase, "text-end")}>
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const isSelected = selected.includes(row.id);
                  return (
                    <tr
                      key={row.id}
                      className={cx(
                        rowBorder,
                        "transition-colors duration-150 ease",
                        isSelected
                          ? "bg-background-secondary-default"
                          : "hover:bg-background-secondary-default",
                      )}
                    >
                      <td className="w-9 py-2 ps-3 pe-1 align-middle">
                        <input
                          type="checkbox"
                          aria-label={`Select ${row.id}`}
                          checked={isSelected}
                          onChange={() => toggleRow(row.id)}
                          className={cx(
                            "size-3.5 cursor-pointer rounded-xs accent-accent-500",
                            focusRing,
                          )}
                        />
                      </td>
                      <td className="px-2 py-2 align-middle">
                        <span className="block text-body-2-medium text-text-primary">
                          {row.client}
                        </span>
                        <span className="block text-caption-2-regular text-text-tertiary tabular-nums">
                          {row.id}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-end align-middle text-body-2-medium text-text-primary tabular-nums whitespace-nowrap">
                        {row.amount}
                      </td>
                    </tr>
                  );
                })}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-3 py-7 text-center">
                      <p className="text-body-2-medium text-text-secondary">
                        All invoices cleared.
                      </p>
                      <button
                        type="button"
                        onClick={restore}
                        className={cx(
                          "mt-1 rounded-sm text-caption-1-regular text-text-secondary underline-offset-2",
                          "transition-colors duration-150 ease hover:text-text-primary hover:underline",
                          focusRing,
                        )}
                      >
                        Restore list
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div
          inert={!visible}
          aria-hidden={!visible}
          className={cx(
            "absolute inset-x-2 -bottom-2 z-10 flex items-center gap-1 rounded-xl border border-border-button-default",
            "bg-background-primary-default p-1.5 shadow-lg transition-[opacity,translate] duration-200 ease-out",
            visible
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-2 opacity-0",
          )}
        >
          <span className="ps-1.5 text-caption-1-regular text-text-secondary tabular-nums">
            {selected.length} selected
          </span>
          <div className="ms-auto flex items-center gap-0.5">
            <button
              type="button"
              onClick={assign}
              aria-label="Assign selected invoices"
              title="Assign"
              className={cx(
                "inline-flex h-7 items-center gap-1 rounded-md px-1.5 text-caption-1-regular text-text-secondary",
                "transition-colors duration-150 ease hover:bg-background-secondary-hover hover:text-text-primary",
                focusRing,
              )}
            >
              <RiUserAddLine className="size-3.5" aria-hidden />
              <span className="hidden @[320px]:inline">Assign</span>
            </button>
            <button
              type="button"
              onClick={tag}
              aria-label="Tag selected invoices"
              title="Tag"
              className={cx(
                "inline-flex h-7 items-center gap-1 rounded-md px-1.5 text-caption-1-regular text-text-secondary",
                "transition-colors duration-150 ease hover:bg-background-secondary-hover hover:text-text-primary",
                focusRing,
              )}
            >
              <RiPriceTag3Line className="size-3.5" aria-hidden />
              <span className="hidden @[320px]:inline">Tag</span>
            </button>
            <button
              type="button"
              onClick={removeSelected}
              aria-label="Delete selected invoices"
              title="Delete"
              className={cx(
                "inline-flex h-7 items-center gap-1 rounded-md px-1.5 text-caption-1-regular text-text-destructive",
                "transition-colors duration-150 ease hover:bg-background-secondary-hover",
                focusRing,
              )}
            >
              <RiDeleteBinLine className="size-3.5" aria-hidden />
              <span className="hidden @[320px]:inline">Delete</span>
            </button>
            <span aria-hidden className="mx-0.5 h-4 w-px bg-separator-border" />
            <button
              type="button"
              onClick={clearSelection}
              aria-label="Clear selection"
              className={iconButton}
            >
              <RiCloseLine className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <p aria-live="polite" className="mt-6 min-h-4 text-caption-2-regular text-text-tertiary">
        {notice ??
          (selected.length > 0
            ? "Actions apply to the selected invoices."
            : "Select rows to assign, tag or delete them.")}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Row detail                                                                 */
/* -------------------------------------------------------------------------- */

type DetailInvoice = Invoice & {
  initials: string;
  tone: number;
  detail: Array<{ label: string; value: string }>;
};

const DETAIL_INVOICES: DetailInvoice[] = [
  {
    id: "INV-4471",
    client: "Northwind Studio",
    owner: "Maya Chen",
    initials: "MC",
    tone: 0,
    amount: "$12,400",
    status: "Paid",
    detail: [
      { label: "Issued", value: "Aug 15, 2026" },
      { label: "Due", value: "Sep 14, 2026" },
      { label: "Terms", value: "Net 30" },
      { label: "PO number", value: "PO-88214" },
      { label: "Billing contact", value: "Avery Lin" },
      { label: "Project", value: "Q3 brand refresh" },
    ],
  },
  {
    id: "INV-4468",
    client: "Harbor & Co.",
    owner: "Jonas Reed",
    initials: "JR",
    tone: 1,
    amount: "$8,600",
    status: "Pending",
    detail: [
      { label: "Issued", value: "Aug 18, 2026" },
      { label: "Due", value: "Sep 17, 2026" },
      { label: "Terms", value: "Net 30" },
      { label: "PO number", value: "PO-77102" },
      { label: "Billing contact", value: "Dana Whitfield" },
      { label: "Project", value: "Harbor rebrand" },
    ],
  },
  {
    id: "INV-4462",
    client: "Fieldnote Labs",
    owner: "Priya Nair",
    initials: "PN",
    tone: 2,
    amount: "$3,200",
    status: "Overdue",
    detail: [
      { label: "Issued", value: "Aug 02, 2026" },
      { label: "Due", value: "Sep 01, 2026" },
      { label: "Terms", value: "Net 15" },
      { label: "PO number", value: "PO-66419" },
      { label: "Billing contact", value: "Eli Moreno" },
      { label: "Project", value: "Fieldnote app" },
    ],
  },
  {
    id: "INV-4455",
    client: "Cinder Works",
    owner: "Sam Okafor",
    initials: "SO",
    tone: 3,
    amount: "$18,900",
    status: "Draft",
    detail: [
      { label: "Issued", value: "Aug 22, 2026" },
      { label: "Due", value: "Sep 21, 2026" },
      { label: "Terms", value: "Net 30" },
      { label: "PO number", value: "PO-90557" },
      { label: "Billing contact", value: "Ruth Calder" },
      { label: "Project", value: "Cinder packaging" },
    ],
  },
  {
    id: "INV-4449",
    client: "Atlas Freight",
    owner: "Maya Chen",
    initials: "MC",
    tone: 0,
    amount: "$5,400",
    status: "Paid",
    detail: [
      { label: "Issued", value: "Aug 05, 2026" },
      { label: "Due", value: "Sep 04, 2026" },
      { label: "Terms", value: "Net 30" },
      { label: "PO number", value: "PO-55208" },
      { label: "Billing contact", value: "Noah Park" },
      { label: "Project", value: "Atlas portal" },
    ],
  },
];

function paymentNoteFor(status: InvoiceStatus) {
  switch (status) {
    case "Paid":
      return "Receipt available";
    case "Overdue":
      return "Payment overdue";
    case "Draft":
      return "Not sent yet";
    default:
      return "Awaiting payment";
  }
}

export function RowDetail() {
  const [openId, setOpenId] = useState<string | null>("INV-4471");

  const toggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <div className="flex w-full max-w-2xl flex-col gap-2">
      <div className={tableShell}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-0 border-collapse sm:min-w-[460px]">
            <caption className="sr-only">Invoices with expandable details</caption>
            <thead>
              <tr>
                <th scope="col" className={thBase}>
                  Invoice
                </th>
                <th scope="col" className={cx(thBase, "hidden sm:table-cell")}>
                  Owner
                </th>
                <th scope="col" className={cx(thBase, "text-end")}>
                  Amount
                </th>
                <th scope="col" className={thBase}>
                  Status
                </th>
                <th scope="col" className={cx(thBase, "w-10 pe-2")}>
                  <span className="sr-only">Details</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {DETAIL_INVOICES.map((invoice) => {
                const open = openId === invoice.id;
                const detailId = `invoice-detail-${invoice.id}`;
                return (
                  <Fragment key={invoice.id}>
                    <tr
                      className={cx(
                        rowBorder,
                        "transition-colors duration-150 ease",
                        open
                          ? "bg-background-secondary-default"
                          : "hover:bg-background-secondary-default",
                      )}
                    >
                      <td className="px-3 py-2 align-middle">
                        <button
                          type="button"
                          aria-expanded={open}
                          aria-controls={detailId}
                          onClick={() => toggle(invoice.id)}
                          className={cx(
                            "flex max-w-full flex-col items-start rounded-sm text-start",
                            focusRing,
                          )}
                        >
                          <span className="text-body-2-medium text-text-primary tabular-nums">
                            {invoice.id}
                          </span>
                          <span className="truncate text-caption-2-regular text-text-tertiary">
                            {invoice.client}
                          </span>
                        </button>
                      </td>
                      <td className="hidden px-3 py-2 align-middle sm:table-cell">
                        <div className="flex items-center gap-2">
                          <InitialsAvatar initials={invoice.initials} tone={invoice.tone} />
                          <span className="truncate text-body-2-medium text-text-secondary">
                            {invoice.owner}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-end align-middle text-body-2-medium text-text-primary tabular-nums whitespace-nowrap">
                        {invoice.amount}
                      </td>
                      <td className="px-3 py-2 align-middle">
                        <StatusBadge status={invoice.status} />
                      </td>
                      <td className="py-2 pe-2 text-end align-middle">
                        <button
                          type="button"
                          aria-label={`${open ? "Hide" : "Show"} details for ${invoice.id}`}
                          aria-expanded={open}
                          aria-controls={detailId}
                          onClick={() => toggle(invoice.id)}
                          className={iconButton}
                        >
                          <RiArrowDownSLine
                            className={cx(
                              "size-4 transition-transform duration-200 ease-out",
                              open && "rotate-180",
                            )}
                            aria-hidden
                          />
                        </button>
                      </td>
                    </tr>
                    {open && (
                      <tr id={detailId} className="bg-background-secondary-default">
                        <td colSpan={5} className="px-2.5 pb-2.5">
                          <div className="rounded-lg border border-border-button-default bg-background-primary-default p-3">
                            <div className="flex flex-col gap-3">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div className="flex min-w-0 flex-col">
                                  <p className="text-body-2-medium text-text-primary">
                                    {invoice.client}
                                  </p>
                                  <p className="text-caption-2-regular text-text-tertiary">
                                    Invoice {invoice.id} · {invoice.owner}
                                  </p>
                                </div>
                                <span className="text-caption-2-regular text-text-tertiary">
                                  Updated 2 days ago
                                </span>
                              </div>

                              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
                                {invoice.detail.map((field) => (
                                  <div key={field.label} className="flex min-w-0 flex-col gap-0.5">
                                    <dt className="text-caption-2-regular tracking-wide text-text-tertiary uppercase">
                                      {field.label}
                                    </dt>
                                    <dd className="truncate text-body-2-medium text-text-primary">
                                      {field.value}
                                    </dd>
                                  </div>
                                ))}
                              </dl>

                              <div className="flex flex-wrap items-center gap-1.5 border-t border-separator-border pt-2.5">
                                <button type="button" className={primaryButton}>
                                  Open invoice
                                  <RiExternalLinkLine className="size-3.5" aria-hidden />
                                </button>
                                <button type="button" className={secondaryButton}>
                                  {invoice.status === "Paid" ? (
                                    <>
                                      <RiReceiptLine className="size-3.5" aria-hidden />
                                      View receipt
                                    </>
                                  ) : (
                                    <>
                                      <RiSendPlaneLine className="size-3.5" aria-hidden />
                                      {invoice.status === "Draft" ? "Send invoice" : "Send reminder"}
                                    </>
                                  )}
                                </button>
                                <button
                                  type="button"
                                  aria-label={`Download ${invoice.id} as PDF`}
                                  className={iconButton}
                                >
                                  <RiDownloadLine className="size-4" aria-hidden />
                                </button>
                                <span className="ms-auto text-caption-2-regular text-text-tertiary">
                                  {paymentNoteFor(invoice.status)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-caption-2-regular text-text-tertiary">
        One invoice stays open at a time.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Density toggle                                                             */
/* -------------------------------------------------------------------------- */

type Density = "compact" | "comfortable";

const DENSITY_OPTIONS: Array<{
  id: Density;
  label: string;
  icon: typeof RiListUnordered;
}> = [
  { id: "compact", label: "Compact", icon: RiListUnordered },
  { id: "comfortable", label: "Comfortable", icon: RiListCheck },
];

const DENSITY_ROWS = [
  {
    name: "Maya Chen",
    initials: "MC",
    tone: 0,
    team: "Design",
    email: "maya@northwind.studio",
    tickets: 12,
    active: true,
  },
  {
    name: "Jonas Reed",
    initials: "JR",
    tone: 1,
    team: "Production",
    email: "jonas@harbor.co",
    tickets: 8,
    active: true,
  },
  {
    name: "Priya Nair",
    initials: "PN",
    tone: 2,
    team: "Accounts",
    email: "priya@fieldnote.app",
    tickets: 15,
    active: false,
  },
  {
    name: "Sam Okafor",
    initials: "SO",
    tone: 3,
    team: "Strategy",
    email: "sam@cinder.works",
    tickets: 5,
    active: true,
  },
  {
    name: "Lena Voss",
    initials: "LV",
    tone: 4,
    team: "Design",
    email: "lena@northwind.studio",
    tickets: 9,
    active: true,
  },
  {
    name: "Eli Moreno",
    initials: "EM",
    tone: 1,
    team: "Accounts",
    email: "eli@fieldnote.app",
    tickets: 6,
    active: false,
  },
];

export function DensityToggle() {
  const [density, setDensity] = useState<Density>("comfortable");

  const cellPadding = density === "compact" ? "py-1" : "py-2.5";

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-headline-medium text-text-primary">Row density</span>
          <span className="text-caption-1-regular text-text-tertiary">
            Applies to the roster below.
          </span>
        </div>
        <div
          role="group"
          aria-label="Row density"
          className="flex shrink-0 items-center gap-0.5 rounded-lg bg-background-tertiary-default p-0.5"
        >
          {DENSITY_OPTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={density === id}
              onClick={() => setDensity(id)}
              className={cx(
                "inline-flex h-7 items-center gap-1 rounded-md px-2 text-caption-1-regular",
                "transition-colors duration-150 ease",
                focusRing,
                density === id
                  ? "bg-segmented-control-selected-background text-text-primary shadow-xs"
                  : "text-text-tertiary hover:text-text-secondary",
              )}
            >
              <Icon className="size-3.5" aria-hidden />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className={tableShell}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-64 table-fixed border-collapse">
            <caption className="sr-only">Team roster</caption>
            <colgroup>
              <col />
              <col className="w-16" />
              <col className="w-20" />
            </colgroup>
            <thead>
              <tr>
                <th scope="col" className={thBase}>
                  Member
                </th>
                <th scope="col" className={cx(thBase, "px-2 text-end")}>
                  Tickets
                </th>
                <th scope="col" className={cx(thBase, "ps-2 pe-3")}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {DENSITY_ROWS.map((person) => (
                <tr
                  key={person.name}
                  className={cx(
                    rowBorder,
                    "transition-colors duration-150 ease hover:bg-background-secondary-default",
                  )}
                >
                  <td
                    className={cx(
                      "ps-3 pe-2 align-middle transition-[padding] duration-200 ease-out",
                      cellPadding,
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <InitialsAvatar initials={person.initials} tone={person.tone} />
                      <div className="min-w-0">
                        <p className="truncate text-body-2-medium text-text-primary">
                          {person.name}
                        </p>
                        {density === "comfortable" && (
                          <p className="truncate text-caption-2-regular text-text-tertiary">
                            {person.team} · {person.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td
                    className={cx(
                      "px-2 text-end align-middle text-body-2-medium text-text-primary tabular-nums",
                      "transition-[padding] duration-200 ease-out",
                      cellPadding,
                    )}
                  >
                    {person.tickets}
                  </td>
                  <td
                    className={cx(
                      "ps-2 pe-3 align-middle transition-[padding] duration-200 ease-out",
                      cellPadding,
                    )}
                  >
                    <span className="inline-flex items-center gap-1 text-caption-1-regular text-text-secondary whitespace-nowrap">
                      <span
                        aria-hidden
                        className={cx(
                          "size-1.5 rounded-full",
                          person.active
                            ? "bg-state-success-base"
                            : "bg-foreground-icon-tertiary",
                        )}
                      />
                      {person.active ? "Active" : "Away"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-1">
        <span className="text-caption-2-regular text-text-tertiary">
          {density === "compact" ? "Compact" : "Comfortable"} · {DENSITY_ROWS.length} of 24 members
        </span>
        <span className="text-caption-2-regular text-text-tertiary">
          {density === "compact" ? "Team line hidden" : "Team line visible"}
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Specimens                                                                  */
/* -------------------------------------------------------------------------- */

export const TABLES_SECTION: ExtendedSection = {
  id: "tables",
  title: "Tables",
  blurb: "Dense records, kept in order and opened in place.",
  file: "tables.tsx",
  entries: [
    {
      name: "Table Toolbar",
      description: "Search, filter, switch views and start a record above the list.",
      Demo: TableToolbar,
      wide: true,
    },
    {
      name: "Sort Header",
      description: "Three-state column sorting with a live reading of the order.",
      Demo: SortHeader,
    },
    {
      name: "Column Filter",
      description: "Searchable checkboxes, staged changes and a reset that clears them.",
      Demo: ColumnFilter,
      wide: true,
    },
    {
      name: "Bulk Action Bar",
      description: "A floating bar that arrives with the selection and leaves with it.",
      Demo: BulkActionBar,
    },
    {
      name: "Row Detail",
      description: "A row that unfolds into terms, contacts and actions.",
      Demo: RowDetail,
      wide: true,
    },
    {
      name: "Density Toggle",
      description: "Compact or comfortable, applied to the rows below.",
      Demo: DensityToggle,
    },
  ],
};
