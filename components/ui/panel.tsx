"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChartExport } from "./chart-export";
import { useT } from "@/components/i18n/locale-provider";

/** Lets a PanelHeader grab its enclosing Panel's DOM node (for image export). */
const PanelNodeCtx = React.createContext<(() => HTMLElement | null) | null>(
  null,
);

export function Panel({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  const ref = React.useRef<HTMLElement>(null);
  return (
    <PanelNodeCtx.Provider value={() => ref.current}>
      <section
        ref={ref}
        className={cn(
          "rounded-2xl border border-white/10 bg-white/2.5 p-4 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset] backdrop-blur-sm sm:p-5",
          className,
        )}
        {...props}
      >
        {children}
      </section>
    </PanelNodeCtx.Provider>
  );
}

/** Standard shell for chart cards. All dashboard charts should live in this
 *  card; filters belong in the header, legends in the body, notes at the end. */
export function ChartPanel(props: React.ComponentProps<typeof Panel>) {
  return <Panel {...props} />;
}

export function PanelHeader({
  title,
  subtitle,
  children,
  className,
  noExport,
  exportCaption,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  /** hide the share/export control (e.g. for non-chart panels) */
  noExport?: boolean;
  /** Hidden on screen, stamped into exported PNGs when controls are ignored. */
  exportCaption?: React.ReactNode;
}) {
  const getNode = React.useContext(PanelNodeCtx);
  const t = useT();
  const exportName = typeof title === "string" ? title : t.panel.exportFallback;
  return (
    <div
      className={cn(
        "mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 space-y-1.5">
        <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h3>
        {subtitle && (
          <p className="max-w-3xl text-base leading-7 text-foreground/95 sm:text-lg sm:leading-8">
            {subtitle}
          </p>
        )}
        {exportCaption && (
          <p
            data-export-only
            className="hidden pt-0.5 text-sm font-medium text-muted-foreground"
          >
            {exportCaption}
          </p>
        )}
      </div>
      {/* Interactive controls (toggles) + the share button are chrome, not
          chart — keep them out of the exported PNG so shares are clean. */}
      <div className="flex flex-wrap items-center gap-2" data-export-ignore>
        {children}
        {!noExport && getNode && (
          <ChartExport getNode={getNode} name={exportName} />
        )}
      </div>
    </div>
  );
}

/** Standard chart heading. Pass interactive filters/toggles as children so they
 *  stay visually and semantically separate from passive legends. */
export function ChartHeader(props: React.ComponentProps<typeof PanelHeader>) {
  return <PanelHeader {...props} />;
}

export function ChartBody({
  children,
  className,
  scroll = false,
}: {
  children: React.ReactNode;
  className?: string;
  scroll?: boolean;
}) {
  return (
    <div className={cn(scroll && "overflow-x-auto", className)}>
      {children}
    </div>
  );
}

export function ChartFootnote({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("mt-3 text-xs leading-5 text-muted-foreground/75", className)}>
      {children}
    </p>
  );
}

export function ChipLegend({
  items,
  className,
}: {
  items: { label: string; color: string }[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "-mt-1 mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground",
        className,
      )}
    >
      {items.map((it) => (
        <span
          key={it.label}
          className="inline-flex cursor-default items-center gap-2 text-muted-foreground"
        >
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: it.color }}
          />
          {it.label}
        </span>
      ))}
    </div>
  );
}

/** Passive legend: no border, no pill background, no hover state. If it is
 *  clickable/filtering, use ControlGroup + SegmentButton instead. */
export const ChartLegend = ChipLegend;
