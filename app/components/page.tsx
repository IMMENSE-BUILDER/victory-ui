"use client";

import { useState } from "react";
import Link from "next/link";
import { RiApps2Line, RiArrowRightLine, RiLayoutGridLine } from "@remixicon/react";

import {
  AppShell,
  CatalogTierFilter,
  ComponentsCatalog,
  useStarterBase,
  type CatalogTier,
} from "@/components/application/app-shell/app-shell";
import { EXTENDED_COUNT, EXTENDED_SECTIONS } from "@/components/extended";

/** The starter's catalogue page: every component and block, linking out. */
export default function ComponentsPage() {
  const [tier, setTier] = useState<CatalogTier>("all");
  const base = useStarterBase();
  return (
    <AppShell
      title="Components and Blocks"
      icon={RiLayoutGridLine}
      actions={<CatalogTierFilter tier={tier} onChange={setTier} />}
      columnClassName="max-w-[964px]"
    >
      <Link
        href={`${base}/library`}
        className="group flex items-center gap-3 rounded-2xl border border-border-button-default bg-background-primary-default p-3 transition-colors duration-150 ease hover:bg-background-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background-tertiary-default text-foreground-icon-secondary">
          <RiApps2Line className="size-5" aria-hidden />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-body-medium text-text-primary">{EXTENDED_COUNT} more components, built here</span>
          <span className="text-body-regular text-text-secondary">
            The extended library: {EXTENDED_SECTIONS.length} families, from inputs and tables to
            charts, AI and commerce.
          </span>
        </span>
        <RiArrowRightLine
          aria-hidden
          className="size-4 shrink-0 text-foreground-icon-secondary transition-transform duration-150 ease group-hover:translate-x-0.5 rtl:-scale-x-100"
        />
      </Link>
      <ComponentsCatalog tier={tier} />
    </AppShell>
  );
}
