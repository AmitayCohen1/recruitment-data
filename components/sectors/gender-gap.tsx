"use client";

import * as React from "react";
import { Panel, PanelHeader } from "@/components/ui/panel";
import {
  genderGap,
  SECTOR_COLOR,
  type SMetric,
} from "@/lib/sectors";
import { MetricTabsS } from "./controls";
import { useT, useLocale } from "@/components/i18n/locale-provider";
import { sectorLabel } from "@/lib/i18n/labels";

export function GenderGap() {
  const t = useT();
  const locale = useLocale();
  const [metric, setMetric] = React.useState<SMetric>("enlist");
  const rows = genderGap(metric);
  const max = Math.max(...rows.map((r) => Math.abs(r.gap)), 1);

  return (
    <Panel>
      <PanelHeader
        title={t.genderGap.title}
        subtitle={t.genderGap.subtitle}
      >
        <MetricTabsS value={metric} onChange={setMetric} surface="gender-gap" />
      </PanelHeader>

      <ul className="space-y-4">
        {rows.map((r) => {
          const color = SECTOR_COLOR[r.sector];
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
              <div className="relative h-6 overflow-hidden rounded-lg bg-white/[0.04]">
                <div
                  className="absolute inset-y-0 right-0 rounded-lg"
                  style={{ width: `${(Math.abs(r.gap) / max) * 100}%`, background: color }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <p className="pt-4 text-xs text-muted-foreground">
        {t.genderGap.footnote}
      </p>
    </Panel>
  );
}
