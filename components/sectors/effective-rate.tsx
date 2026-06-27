"use client";

import * as React from "react";
import { ChartFootnote, ChartHeader, ChartPanel } from "@/components/ui/panel";
import { effective, SECTOR_COLOR, type SGender } from "@/lib/sectors";
import { useT, useLocale } from "@/components/i18n/locale-provider";
import { sectorLabel } from "@/lib/i18n/labels";
import { GenderToggle, SegmentTabs, rateMetricItems } from "./controls";

type EffMetric = "combat" | "officer";
export function EffectiveRate({
  gender: genderProp,
}: { gender?: SGender } = {}) {
  const t = useT();
  const locale = useLocale();
  const controlled = genderProp !== undefined;
  const [metric, setMetric] = React.useState<EffMetric>("combat");
  const [genderState, setGender] = React.useState<SGender>("בנים");
  const gender = genderProp ?? genderState;
  const rows = effective(metric, gender);
  const max = Math.max(...rows.map((r) => r.value), 1);

  return (
    <ChartPanel>
      <ChartHeader
        title={t.effectiveRate.title}
        subtitle={t.effectiveRate.subtitle}
      >
        <div className="flex flex-wrap gap-2">
          {!controlled && (
            <GenderToggle value={gender} onChange={setGender} surface="effective-rate" />
          )}
          {/* Fixed height keeps the active highlight aligned in PNG export. */}
          <SegmentTabs
            items={rateMetricItems(t, ["combat", "officer"])}
            value={metric}
            onChange={(m) => setMetric(m as EffMetric)}
            itemClassName="h-8 items-center justify-center leading-none"
          />
        </div>
      </ChartHeader>

      <ul className="space-y-3">
        {rows.map((r, i) => {
          const color = SECTOR_COLOR[r.sector];
          return (
            <li
              key={r.sector}
              className="rounded-xl border border-white/5 bg-white/2 p-3"
            >
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <span className="flex items-baseline gap-2 truncate text-sm font-medium">
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="truncate" style={{ color }}>
                    {sectorLabel(r.sector, locale)}
                  </span>
                </span>
                <span className="flex shrink-0 items-baseline gap-2">
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {r.enlist}% × {r.rate}%
                  </span>
                  <span className="text-lg font-bold tabular-nums">
                    {r.value}
                  </span>
                </span>
              </div>
              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-white/4">
                <div
                  className="absolute inset-y-0 right-0 rounded-full"
                  style={{ width: `${(r.value / max) * 100}%`, background: color }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <ChartFootnote>{t.effectiveRate.footnote}</ChartFootnote>
    </ChartPanel>
  );
}
