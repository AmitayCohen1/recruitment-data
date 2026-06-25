import * as React from "react";

/** A light filter toolbar that spans the full content column (so it lines up
 *  with the hero and the cards instead of floating), anchored by a hairline
 *  rule rather than its own card. Controls are inset to match the panel titles
 *  below. */
export function FilterBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b border-white/10 pb-5">
      <div className="flex flex-col gap-4 px-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3 sm:px-5">
        {children}
      </div>
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
    <div className="flex flex-col items-stretch gap-1.5 sm:flex-row sm:items-center sm:gap-2.5">
      <span className="shrink-0 text-xs font-medium text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  );
}
