import * as React from "react";

/** A light filter toolbar — controls sit directly on the page rather than in
 *  their own card, so they read as "filters for this view" without adding
 *  another competing surface. Padding matches the panels' so the labels line
 *  up with the panel titles below. */
export function FilterBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-5">
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
