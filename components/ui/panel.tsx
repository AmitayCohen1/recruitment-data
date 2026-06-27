"use client";

import * as React from "react";
import { Brain } from "lucide-react";
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
      <div className="min-w-0 space-y-1">
        <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h3>
        {subtitle && (
          <p className="text-[15px] leading-7 text-foreground/80 sm:text-base">
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

export function PanelInsight({
  children,
  title,
  className,
}: {
  children: React.ReactNode;
  title?: React.ReactNode;
  className?: string;
}) {
  const t = useT();
  return (
    <aside
      className={cn(
        "mt-4 flex gap-3 rounded-2xl border border-sky-400/20 bg-sky-400/6 p-4 text-sm leading-6 text-muted-foreground",
        className,
      )}
    >
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-sky-300/20 bg-sky-300/10 text-sky-200">
        <Brain className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="mb-1 font-semibold text-foreground">
          {title ?? t.panel.analysisTitle}
        </p>
        <p>{children}</p>
      </div>
    </aside>
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
