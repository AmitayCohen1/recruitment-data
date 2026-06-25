"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChartExport } from "./chart-export";

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
          "rounded-2xl border border-white/10 bg-white/[0.025] p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset] backdrop-blur-sm",
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
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  /** hide the share/export control (e.g. for non-chart panels) */
  noExport?: boolean;
}) {
  const getNode = React.useContext(PanelNodeCtx);
  const exportName = typeof title === "string" ? title : "תרשים";
  return (
    <div
      className={cn(
        "mb-5 flex flex-wrap items-start justify-between gap-3",
        className,
      )}
    >
      <div className="space-y-1">
        <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm leading-6 text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        {!noExport && getNode && (
          <ChartExport getNode={getNode} name={exportName} />
        )}
      </div>
    </div>
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
        "flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-3 text-sm text-muted-foreground",
        className,
      )}
    >
      {items.map((it) => (
        <span key={it.label} className="flex items-center gap-2">
          <span
            className="size-3 rounded-full"
            style={{ backgroundColor: it.color }}
          />
          {it.label}
        </span>
      ))}
    </div>
  );
}
