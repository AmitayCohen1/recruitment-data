"use client";

import { cn } from "@/lib/utils";
import {
  S_METRICS,
  type SGender,
  type SMetric,
} from "@/lib/sectors";

const pill =
  "flex w-full items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1 sm:inline-flex sm:w-auto";
const btn = (active: boolean) =>
  cn(
    "min-w-0 flex-1 rounded-lg px-2.5 py-1.5 text-center text-sm font-medium transition-colors sm:flex-none sm:px-3",
    active
      ? "bg-white/10 text-foreground shadow-sm"
      : "text-muted-foreground hover:text-foreground",
  );

export function MetricTabsS({
  value,
  onChange,
}: {
  value: SMetric;
  onChange: (m: SMetric) => void;
}) {
  return (
    <div className={pill}>
      {S_METRICS.map((m) => (
        <button key={m.key} type="button" className={btn(value === m.key)} onClick={() => onChange(m.key)}>
          {m.short}
        </button>
      ))}
    </div>
  );
}

export function GenderToggle({
  value,
  onChange,
}: {
  value: SGender;
  onChange: (g: SGender) => void;
}) {
  return (
    <div className={pill}>
      {(["בנים", "בנות"] as SGender[]).map((g) => (
        <button key={g} type="button" className={btn(value === g)} onClick={() => onChange(g)}>
          {g === "בנים" ? "👨" : "👩"} {g}
        </button>
      ))}
    </div>
  );
}
