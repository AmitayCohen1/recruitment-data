"use client";

import * as React from "react";
import { track } from "@/lib/analytics";
import { ControlGroup, SegmentButton } from "@/components/ui/control";
import {
  S_METRICS,
  ABS_METRICS,
  type AbsMetric,
  type SGender,
  type SMetric,
} from "@/lib/sectors";
import { useLocale, useT } from "@/components/i18n/locale-provider";
import { genderLabel, genderEmoji } from "@/lib/i18n/labels";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

export type SegmentItem<T extends string> = { key: T; label: React.ReactNode };

/** The one segmented-control behind every filter on the dashboard (gender, rate
 *  metric, absolute metric, view mode). Callers pass the items + value and do
 *  their own analytics in `onChange`, so each filter's labels and tracking live
 *  in exactly one place. Use the helpers below for the metric label text. */
export function SegmentTabs<T extends string>({
  items,
  value,
  onChange,
  itemClassName,
}: {
  items: readonly SegmentItem<T>[];
  value: T;
  onChange: (key: T) => void;
  /** extra classes per button — e.g. fixed height for PNG-export alignment */
  itemClassName?: string;
}) {
  return (
    <ControlGroup className="flex w-full sm:inline-flex sm:w-auto">
      {items.map((it) => (
        <SegmentButton
          key={it.key}
          type="button"
          active={value === it.key}
          onClick={() => onChange(it.key)}
          className={cn("flex-1 px-2.5 sm:flex-none sm:px-3", itemClassName)}
        >
          {it.label}
        </SegmentButton>
      ))}
    </ControlGroup>
  );
}

/** Single source of truth for the rate-metric button labels (enlist/combat/
 *  officer/meaning). Pass `keys` to show/order a subset. */
export const rateMetricItems = (
  t: Dictionary,
  keys: readonly SMetric[] = S_METRICS.map((m) => m.key),
): SegmentItem<SMetric>[] => keys.map((k) => ({ key: k, label: t.metrics[k].short }));

/** Single source of truth for the absolute-count metric labels (fighters/units/
 *  enlistees). */
export const absMetricItems = (t: Dictionary): SegmentItem<AbsMetric>[] =>
  ABS_METRICS.map((m) => ({ key: m.key, label: t.absMetrics[m.key] }));

/** Rate-metric filter. Thin wrapper so the 7 sector cards keep one call shape
 *  and one `sector_metric` analytics event. */
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
    <SegmentTabs
      items={rateMetricItems(t)}
      value={value}
      onChange={(m) => {
        if (surface && value !== m) track("sector_metric", { surface, metric: m });
        onChange(m);
      }}
    />
  );
}

/** Gender filter — boys/girls, the same labels everywhere. */
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
  const items: SegmentItem<SGender>[] = (["בנים", "בנות"] as SGender[]).map((g) => ({
    key: g,
    label: `${genderEmoji(g)} ${genderLabel(g, locale)}`,
  }));
  return (
    <SegmentTabs
      items={items}
      value={value}
      onChange={(g) => {
        if (surface && value !== g) track("sector_gender", { surface, gender: g });
        onChange(g);
      }}
    />
  );
}
