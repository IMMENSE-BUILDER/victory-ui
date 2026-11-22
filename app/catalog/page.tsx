"use client";

import { RiLayoutGridLine } from "@remixicon/react";

import { COMPONENT_SECTIONS } from "@/components/application/docs/components-index";
import {
  FREE_COMPONENT_PREVIEWS,
  FREE_PREVIEW_OPTIONS,
} from "@/components/application/docs/component-previews-free";
import { ShowcaseCard } from "@/components/application/docs/showcase-card";
import { cx } from "@/utils/cx";

/**
 * Local, self-contained catalogue: every free component in this repository
 * rendered live, with no network requests. Unlike /components it never loads
 * preview images, embeds or docs links from an external site, so it works
 * offline.
 */

const slugOf = (href: string) => href.replace("/components/", "");

const previews = FREE_COMPONENT_PREVIEWS as Record<
  string,
  (() => React.ReactElement) | undefined
>;

const SECTIONS = COMPONENT_SECTIONS.map((section) => ({
  ...section,
  entries: section.entries.filter((entry) => entry.tier === "free" && entry.status === "shipped"),
})).filter((section) => section.entries.length > 0);

const TOTAL = SECTIONS.reduce((count, section) => count + section.entries.length, 0);

export default function CatalogPage() {
  return (
    <div className="min-h-dvh bg-background-full">
      <header className="sticky top-0 z-40 border-b border-separator-border bg-background-primary-default/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1300px] flex-wrap items-center gap-3 px-6 py-4">
          <h1 className="text-title-3-semibold text-text-primary">Component catalog</h1>
          <span className="rounded-full bg-background-tertiary-default px-2 py-0.5 text-caption-1-semibold text-text-secondary">
            {TOTAL} free
          </span>
          <span className="text-body-regular text-text-tertiary">
            Every preview below renders from local source. No network required.
          </span>
          <nav className="ms-auto hidden items-center gap-4 md:flex">
            {SECTIONS.map((section) => (
              <a
                key={section.title}
                href={`#${section.title.toLowerCase()}`}
                className="text-body-regular text-text-secondary transition-colors hover:text-text-primary"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1300px] flex-col gap-12 px-6 py-10">
        {SECTIONS.map((section) => (
          <section
            key={section.title}
            id={section.title.toLowerCase()}
            className="flex scroll-mt-24 flex-col gap-4"
          >
            <div className="flex items-baseline gap-2">
              <h2 className="text-title-2-medium text-text-primary">{section.title}</h2>
              <span className="text-body-medium text-text-tertiary">{section.entries.length}</span>
              <span className="hidden text-body-regular text-text-tertiary sm:inline">
                {section.blurb}
              </span>
            </div>

            <div
              className={cx(
                "grid w-full grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2",
                section.wide ? "xl:grid-cols-2" : "xl:grid-cols-3",
              )}
            >
              {section.entries.map((entry) => {
                const Preview = previews[entry.href];
                const id = slugOf(entry.href);

                if (!Preview) {
                  return (
                    <article
                      key={entry.name}
                      id={id}
                      className="flex flex-col gap-2 rounded-3xl border border-border-button-default bg-background-primary-default p-5"
                    >
                      <span className="flex size-10 items-center justify-center rounded-xl bg-background-tertiary-default text-foreground-icon-secondary">
                        {entry.icon ? (
                          <entry.icon className="size-5" />
                        ) : (
                          <RiLayoutGridLine className="size-5" />
                        )}
                      </span>
                      <h3 className="text-headline-medium text-text-primary">{entry.name}</h3>
                      <p className="text-headline-regular text-pretty text-text-secondary">
                        {entry.description}
                      </p>
                    </article>
                  );
                }

                return (
                  <div key={entry.name} id={id} className="scroll-mt-24">
                    <ShowcaseCard
                      title={entry.name}
                      description={entry.description}
                      href={`#${id}`}
                      {...(FREE_PREVIEW_OPTIONS[entry.href] ?? {})}
                    >
                      <Preview />
                    </ShowcaseCard>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
