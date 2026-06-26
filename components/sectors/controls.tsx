"use client";

import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import {
  S_METRICS,
  type SGender,
  type SMetric,
} from "@/lib/sectors";
import { useLocale, useT } from "@/components/i18n/locale-provider";
import { genderLabel, genderEmoji } from "@/lib/i18n/labels";

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
  surface,
}: {
  value: SMetric;
  onChange: (m: SMetric) => void;
  /** Identifies which chart this control belongs to, for analytics. */
  surface?: string;
}) {
  const t = useT();
  return (
    <div className={pill}>
      {S_METRICS.map((m) => (
        <button
          key={m.key}
          type="button"
          className={btn(value === m.key)}
          onClick={() => {
            if (surface && value !== m.key) track("sector_metric", { surface, metric: m.key });
            onChange(m.key);
          }}
        >
          {t.metrics[m.key].short}
        </button>
      ))}
    </div>
  );
}

export function GenderToggle({
  value,
  onChange,
  surface,
}: {
  value: SGender;
  onChange: (g: SGender) => void;
  /** Identifies which chart this control belongs to, for analytics. */
  surface?: string;
}) {
  const locale = useLocale();
  return (
    <div className={pill}>
      {(["בנים", "בנות"] as SGender[]).map((g) => (
        <button
          key={g}
          type="button"
          className={btn(value === g)}
          onClick={() => {
            if (surface && value !== g) track("sector_gender", { surface, gender: g });
            onChange(g);
          }}
        >
          {genderEmoji(g)} {genderLabel(g, locale)}
        </button>
      ))}
    </div>
  );
}
