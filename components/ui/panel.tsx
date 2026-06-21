import * as React from "react";
import { cn } from "@/lib/utils";

export function Panel({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.025] p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset] backdrop-blur-sm",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function PanelHeader({
  title,
  subtitle,
  children,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
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
      {children}
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
