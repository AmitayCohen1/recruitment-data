"use client";

import { track } from "@/lib/analytics";
import { ControlGroup, SegmentButton } from "@/components/ui/control";
import {
  S_METRICS,
  type SGender,
  type SMetric,
} from "@/lib/sectors";
import { useLocale, useT } from "@/components/i18n/locale-provider";
import { genderLabel, genderEmoji } from "@/lib/i18n/labels";

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
    <ControlGroup className="flex w-full sm:inline-flex sm:w-auto">
      {S_METRICS.map((m) => (
        <SegmentButton
          key={m.key}
          type="button"
          active={value === m.key}
          className="flex-1 px-2.5 sm:flex-none sm:px-3"
          onClick={() => {
            if (surface && value !== m.key) track("sector_metric", { surface, metric: m.key });
            onChange(m.key);
          }}
        >
          {t.metrics[m.key].short}
        </SegmentButton>
      ))}
    </ControlGroup>
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
    <ControlGroup className="flex w-full sm:inline-flex sm:w-auto">
      {(["בנים", "בנות"] as SGender[]).map((g) => (
        <SegmentButton
          key={g}
          type="button"
          active={value === g}
          className="flex-1 px-2.5 sm:flex-none sm:px-3"
          onClick={() => {
            if (surface && value !== g) track("sector_gender", { surface, gender: g });
            onChange(g);
          }}
        >
          {genderEmoji(g)} {genderLabel(g, locale)}
        </SegmentButton>
      ))}
    </ControlGroup>
  );
}
