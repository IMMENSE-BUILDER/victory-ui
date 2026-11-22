"use client";

import { useTemplateCopy } from "@/components/foundations/template-copy/template-copy";

import { COMPONENT_SECTIONS, type Entry } from "@/components/application/docs/components-index";
import {
  FREE_COMPONENT_PREVIEWS,
  FREE_PREVIEW_OPTIONS,
  TEMPLATE_CARD,
} from "@/components/application/docs/component-previews-free";
import type { PreviewHref } from "@/components/application/docs/component-preview-hrefs";
import { ShowcaseCard } from "@/components/application/docs/showcase-card";
import { cx } from "@/utils/cx";

/**
 * The local component catalogue.
 *
 * Only the items that actually ship in this repository are listed, and every
 * preview is the real component rendered on this page. Nothing is fetched
 * from an external host: no preview images, no embedded templates, no docs
 * links. That was the source of the broken "Pro" cards, and it made the page
 * depend on a domain we do not own.
 */
export function ComponentsCatalog() {
  const localize = useTemplateCopy();

  const sections = COMPONENT_SECTIONS.map((section) => ({
    ...section,
    entries: section.entries.filter(
      (entry) => entry.tier === "free" && entry.status === "shipped",
    ),
  })).filter((section) => section.entries.length > 0);

  const total = sections.reduce((count, section) => count + section.entries.length, 0);

  return localize((
    <div className="flex w-full flex-col gap-10">
      <p className="max-w-2xl text-body-regular text-text-secondary">
        All {total} items below are in this project as source. Each card renders the real
        component — no screenshots, no remote assets. The Library adds 500 more.
      </p>

      {sections.map((section) => (
        <section key={section.title} id={section.title.toLowerCase()} className="flex flex-col gap-4">
          <div className="flex items-baseline gap-2">
            <h2 className="text-title-2-medium text-text-primary">{section.title}</h2>
            <span className="text-body-medium text-text-tertiary">{section.entries.length}</span>
            <span className="hidden text-body-regular text-text-tertiary sm:inline">{section.blurb}</span>
          </div>

          <div
            className={cx(
              "grid w-full grid-cols-1 gap-x-5 gap-y-3 sm:gap-5",
              section.wide ? "xl:grid-cols-[repeat(2,472px)]" : "sm:grid-cols-2 xl:grid-cols-[repeat(3,304px)]",
            )}
          >
            {section.entries.map((entry) =>
              livePreview(entry) ? (
                <PreviewCard key={entry.name} entry={entry} />
              ) : (
                <CatalogCard key={entry.name} entry={entry} />
              ),
            )}
          </div>
        </section>
      ))}
    </div>
  ));
}

const livePreview = (entry: Entry) => FREE_COMPONENT_PREVIEWS[entry.href as PreviewHref];

/** A real, on-page specimen. No external navigation, no remote image. */
function PreviewCard({ entry }: { entry: Entry }) {
  const localize = useTemplateCopy();
  const Preview = livePreview(entry);
  if (!Preview) return null;

  return localize((
    <ShowcaseCard
      href={`#${entry.href.replace("/components/", "")}`}
      title={entry.name}
      description={entry.description}
      {...(FREE_PREVIEW_OPTIONS[entry.href] ?? {})}
      {...(entry.href.includes("/chat-starter") ? TEMPLATE_CARD : {})}
    >
      <Preview />
    </ShowcaseCard>
  ));
}

/** The quieter card for items with no on-page specimen (tokens, utilities). */
function CatalogCard({ entry }: { entry: Entry }) {
  const localize = useTemplateCopy();
  return localize((
    <div
      id={entry.href.replace("/components/", "")}
      className={cx(
        "group relative flex flex-col gap-1 rounded-2lg border border-border-button-default",
        "bg-background-primary-default p-4",
      )}
    >
      <div className="flex items-center gap-2">
        {entry.icon && (
          <entry.icon className="size-[18px] shrink-0 text-foreground-icon-secondary" aria-hidden />
        )}
        <span className="text-body-medium text-text-primary">{entry.name}</span>
        {entry.isNew && <Tag tone="new">New</Tag>}
      </div>
      <span className="text-body-regular text-text-secondary">{entry.description}</span>
    </div>
  ));
}

/** The docs index's small uppercase tags. */
function Tag({ tone = "neutral", children }: { tone?: "neutral" | "new"; children: string }) {
  const localize = useTemplateCopy();
  return localize((
    <span
      className={cx(
        "inline-flex items-center rounded-sm px-1 py-px text-[10px] leading-4 font-semibold tracking-wide uppercase",
        tone === "new"
          ? "bg-badge-new-background text-badge-new-text"
          : "bg-background-tertiary-default text-text-secondary",
      )}
    >
      {children}
    </span>
  ));
}
