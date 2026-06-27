"use client";

import * as React from "react";
import { ChartFootnote, ChartHeader, ChartPanel } from "@/components/ui/panel";
import {
  genderGap,
  SECTOR_COLOR,
  type SMetric,
} from "@/lib/sectors";
import { MetricTabsS } from "./controls";
import { useT, useLocale } from "@/components/i18n/locale-provider";
import { genderLabel, sectorLabel } from "@/lib/i18n/labels";

export function GenderGap() {
  const t = useT();
  const locale = useLocale();
  const [metric, setMetric] = React.useState<SMetric>("enlist");
  const rows = genderGap(metric);
  const max = Math.max(...rows.map((r) => Math.abs(r.gap)), 1);

  return (
    <ChartPanel>
      <ChartHeader
        title={t.genderGap.title}
        subtitle={t.genderGap.subtitle}
        exportCaption={t.metrics[metric].short}
      >
        <MetricTabsS value={metric} onChange={setMetric} surface="gender-gap" />
      </ChartHeader>

      <ul className="space-y-4">
        {rows.map((r) => {
          const color = SECTOR_COLOR[r.sector];
          const width = (Math.abs(r.gap) / max) * 50;
          const left = r.gap >= 0 ? 50 : 50 - width;
          return (
            <li key={r.sector}>
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <span className="text-sm font-medium" style={{ color }}>
                  {sectorLabel(r.sector, locale)}
                </span>
                <span className="text-xs tabular-nums text-muted-foreground sm:text-sm">
                  👨 {r.boys}% · 👩 {r.girls}% ·{" "}
                  <span className="font-semibold text-foreground">
                    {t.genderGap.gap(r.gap)}
                  </span>
                </span>
              </div>
              <div
                dir="ltr"
                className="relative h-7 overflow-hidden rounded-lg bg-white/4"
              >
                <div className="absolute inset-y-1 left-1/4 w-px bg-white/6" />
                <div className="absolute inset-y-1 left-3/4 w-px bg-white/6" />
                <div className="absolute inset-y-0 left-1/2 w-px bg-white/35" />
                <div
                  className="absolute inset-y-1 rounded-md"
                  style={{
                    left: `${left}%`,
                    width: `${width}%`,
                    background: color,
                  }}
                />
              </div>
              <div
                dir="ltr"
                className="mt-1 grid grid-cols-3 text-[10px] text-muted-foreground/70"
              >
                <span>{genderLabel("בנות", locale)}</span>
                <span className="text-center tabular-nums">0</span>
                <span className="text-right">{genderLabel("בנים", locale)}</span>
              </div>
            </li>
          );
        })}
      </ul>
      <ChartFootnote>{t.genderGap.footnote}</ChartFootnote>
    </ChartPanel>
  );
}
