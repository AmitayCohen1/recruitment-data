"use client";

import { cn } from "@/lib/utils";
import {
  GENDER_ICON,
  METRIC_ICON,
  S_METRICS,
  type SGender,
  type SMetric,
} from "@/lib/sectors";

const pill =
  "inline-flex flex-wrap items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1";
const btn = (active: boolean) =>
  cn(
    "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
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
          <span aria-hidden className="me-1">{METRIC_ICON[m.key]}</span>
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
          <span aria-hidden className="me-1">{GENDER_ICON[g]}</span>
          {g}
        </button>
      ))}
    </div>
  );
}
