"use client";

import { cn } from "@/lib/utils";
import { METRICS, type MetricKey } from "@/lib/data";

export function MetricTabs({
  value,
  onChange,
  className,
}: {
  value: MetricKey;
  onChange: (m: MetricKey) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex flex-wrap items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1",
        className,
      )}
    >
      {METRICS.map((m) => (
        <button
          key={m.key}
          type="button"
          onClick={() => onChange(m.key)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            value === m.key
              ? "bg-white/10 text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {m.short}
        </button>
      ))}
    </div>
  );
}
