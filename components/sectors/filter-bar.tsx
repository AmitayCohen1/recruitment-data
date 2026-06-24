import * as React from "react";

/** A classic anchored filter toolbar — a card-matching surface holding labeled
 *  control fields, so shared controls read as "filters for this view" instead
 *  of floating pills. */
export function FilterBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3">
      {children}
    </div>
  );
}

export function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="shrink-0 text-xs font-medium text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  );
}
