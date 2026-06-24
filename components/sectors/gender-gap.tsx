"use client";

import * as React from "react";
import { Panel, PanelHeader } from "@/components/ui/panel";
import {
  genderGap,
  SECTOR_COLOR,
  type SMetric,
} from "@/lib/sectors";
import { MetricTabsS } from "./controls";

export function GenderGap() {
  const [metric, setMetric] = React.useState<SMetric>("enlist");
  const rows = genderGap(metric);
  const max = Math.max(...rows.map((r) => Math.abs(r.gap)), 1);

  return (
    <Panel>
      <PanelHeader
        title="פערי מגדר לפי מגזר"
        subtitle="הפרש נקודות האחוז בין בנים לבנות בכל מגזר."
      >
        <MetricTabsS value={metric} onChange={setMetric} />
      </PanelHeader>

      <ul className="space-y-4">
        {rows.map((r) => {
          const color = SECTOR_COLOR[r.sector];
          return (
            <li key={r.sector}>
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <span className="text-sm font-medium" style={{ color }}>
                  {r.sector}
                </span>
                <span className="text-xs tabular-nums text-muted-foreground sm:text-sm">
                  👨 {r.boys}% · 👩 {r.girls}% ·{" "}
                  <span className="font-semibold text-foreground">
                    פער {r.gap} נק׳
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
        ערך חיובי מציין שהמדד גבוה יותר אצל בנים; ערך שלילי מציין יתרון לבנות.
      </p>
    </Panel>
  );
}
